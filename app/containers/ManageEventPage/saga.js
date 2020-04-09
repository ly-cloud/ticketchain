import { takeLatest, put, select, call } from 'redux-saga/effects';
import Web3 from 'web3';
import request from 'utils/request';
import { LOAD_EVENTS, MINT_TICKET } from './constants';
import { makeSelectAccounts } from '../App/selectors';
import {
  loadEventsSuccess,
  loadEventsFailure,
  mintTicketSuccess,
} from './actions';
import {
  makeSelectSelectedContract,
  makeSelectMassMint,
  makeSelectSeatNumber,
  makeSelectPrice,
  makeSelectQuantity,
} from './selectors';
import EventTicket from '../../../build/contracts/EventTicket.json';

const web3 = new Web3(window.ethereum);

export function* loadEvents() {
  try {
    const accounts = yield select(makeSelectAccounts());
    const addressStr = accounts[0].toLowerCase();
    const requestURL = `${
      process.env.BACKEND_API_URL
    }/eventOrganiser/ownerAddress/${addressStr}`;

    const res = yield call(request, requestURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    const contracts = res.events.map(event => event.address);
    const results = [];
    for (const address of contracts) {
      const instance = new web3.eth.Contract(EventTicket.abi, address);
      const eventDetails = yield instance.methods.getEvent().call();
      const eventObj = {};
      eventObj.eventId = eventDetails[0];
      eventObj.eventName = eventDetails[1];
      eventObj.eventDateTime = eventDetails[2];
      eventObj.venue = eventDetails[3];
      eventObj.openSaleTime = eventDetails[4];
      eventObj.closingSaleTime = eventDetails[5];
      eventObj.isListed = eventDetails[6];
      eventObj.address = address;
      results.push(eventObj);
    }
    yield put(loadEventsSuccess(results));
  } catch (error) {
    yield put(loadEventsFailure(error));
  }
}

export function* mintTicket() {
  const accounts = yield select(makeSelectAccounts());
  const contract = yield select(makeSelectSelectedContract());
  const massMint = yield select(makeSelectMassMint());
  const seatNumber = yield select(makeSelectSeatNumber());
  const price = yield select(makeSelectPrice());
  const quantity = yield select(makeSelectQuantity());
  if (seatNumber < 0 || price < 0) {
    return;
  }
  const instance = new web3.eth.Contract(EventTicket.abi, contract);
  if (massMint) {
    if (quantity > 0) {
      yield instance.methods
        .massMint(price, seatNumber, quantity)
        .send({ from: accounts[0] });
      yield put(mintTicketSuccess('Tickets minted successfully!'));
    }
  } else {
    yield instance.methods.mint(price, seatNumber).send({ from: accounts[0] });
    yield put(mintTicketSuccess('Ticket minted successfully!'));
  }
}

export default function* manageEventPageSaga() {
  yield takeLatest(LOAD_EVENTS, loadEvents);
  yield takeLatest(MINT_TICKET, mintTicket);
}
