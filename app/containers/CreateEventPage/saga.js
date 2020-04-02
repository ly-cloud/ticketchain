import { takeLatest, select, cps } from 'redux-saga/effects';
import Web3 from 'web3';
import {
  makeSelectEventName,
  makeSelectEventDateTime,
  makeSelectEventStartSale,
  makeSelectEventEndSale,
  makeSelectEventVenue,
  // makeSelectEventImage,
} from './selectors';
// import {
//   makeSelectSignature,
//   makeSelectPublicAddress,
// } from '../LoginPage/selectors';
import { CREATE_EVENT } from './constants';
// import * as api from '../../utils/apiManager';
import EventTicket from '../../../build/contracts/EventTicket.json';

const web3 = new Web3(window.ethereum);

export function* createEvent() {
  const eventName = yield select(makeSelectEventName());
  const eventDateTime = yield select(makeSelectEventDateTime());
  const eventStartSale = yield select(makeSelectEventStartSale());
  const eventEndSale = yield select(makeSelectEventEndSale());
  const eventVenue = yield select(makeSelectEventVenue());
  // const eventImage = yield select(makeSelectEventImage());
  try {
    const owner = yield cps(web3.eth.getCoinbase);
    const eventTicketContract = new web3.eth.Contract(EventTicket.abi);
    const ticketChainAddress = '0xFb8D71b9eE85530C1f3d7931651ffad92d978F4e';
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
    const deployContract = yield eventTicketContract.deploy(deployParams);
    const esimatedGas = yield cps(deployContract.estimateGas);
    const sendParams = {
      from: owner,
      gasPrice: esimatedGas,
      gas: esimatedGas,
    };
    const deployRes = yield cps(deployContract.send, sendParams);
    console.log(deployRes);
  } catch (err) {
    console.log(err);
    // yield put(loginError(err.response.data));
  }
}

export default function* createEventPageSaga() {
  yield takeLatest(CREATE_EVENT, createEvent);
}
