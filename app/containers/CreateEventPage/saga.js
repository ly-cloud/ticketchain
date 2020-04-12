import { takeLatest, select, cps, call, put } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import Web3 from 'web3';
import request from 'utils/request';
import Moment from 'moment';
import { loginSuccess, loginError } from '../LoginPage/actions';
import {
  makeSelectEventName,
  makeSelectEventDateTime,
  makeSelectEventStartSale,
  makeSelectEventEndSale,
  makeSelectEventVenue,
  makeSelectEventImage,
  makeSelectEventDes,
} from './selectors';
import { makeSelectAccounts } from '../App/selectors';
import { clearForm } from './actions';
import { CREATE_EVENT } from './constants';
import EventTicket from '../../../build/contracts/EventTicket.json';
import TicketChain from '../../../build/contracts/TicketChain.json';

const web3 = new Web3(window.ethereum);

export function* createEvent() {
  const accounts = yield select(makeSelectAccounts());
  const eventName = yield select(makeSelectEventName());
  let eventDateTime = yield select(makeSelectEventDateTime());
  eventDateTime = Moment(eventDateTime).valueOf() / 1000;
  let eventStartSale = yield select(makeSelectEventStartSale());
  eventStartSale = Moment(eventStartSale).valueOf() / 1000;

  let eventEndSale = yield select(makeSelectEventEndSale());
  eventEndSale = Moment(eventEndSale).valueOf() / 1000;
  const eventVenue = yield select(makeSelectEventVenue());
  const eventImage = yield select(makeSelectEventImage());
  const eventDes = yield select(makeSelectEventDes());
  try {
    const owner = accounts[0];
    const eventTicketContract = new web3.eth.Contract(EventTicket.abi);
    const networkId = yield cps(web3.eth.net.getId);
    const networkData = TicketChain.networks[networkId];
    const ticketChainAddress = networkData.address;
    const deployParams = {
      data: EventTicket.bytecode,
      arguments: [
        ticketChainAddress,
        eventName,
        eventDateTime,
        eventVenue,
        eventStartSale,
        eventEndSale,
      ],
    };

    // Deploy Contract
    const deployContract = yield eventTicketContract.deploy(deployParams);
    const sendParams = {
      from: owner,
    };
    const newContractinstance = yield call(deployContract.send, sendParams);

    const contractAddress = newContractinstance.options.address;

    // Intialise EventTicket with TicketChain
    const eventTicketInstance = new web3.eth.Contract(
      EventTicket.abi,
      contractAddress,
    );
    const initialised = yield eventTicketInstance.methods.initialise();
    const sendParamsInit = {
      from: owner,
    };
    yield call(initialised.send, sendParamsInit);

    // Get eventId
    const eventDetails = yield eventTicketInstance.methods.getEvent().call();
    const eventId = eventDetails[0];

    // Persist to backend
    const requestUrl = `${
      process.env.BACKEND_API_URL
    }/eventOrganiser/createEvent`;

    const res = yield call(request, requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset =utf-8',
      },
      body: JSON.stringify({
        address: contractAddress,
        name: eventName,
        imageUrl: eventImage,
        description: eventDes,
        ownerAddress: owner,
        eventId,
      }),
    });
    yield put(clearForm());
    yield put(loginSuccess(res));
    yield put(push('/manageEvent'));
  } catch (err) {
    yield put(loginError(err.data));
  }
}

export default function* createEventPageSaga() {
  yield takeLatest(CREATE_EVENT, createEvent);
}
