import { takeLatest, put, select } from 'redux-saga/effects';
import Web3 from 'web3';
import { LOAD_EVENTS, MINT_TICKET } from './constants';
import { makeSelectAccounts } from '../App/selectors';
import { loadEventsSuccess, loadEventsFailure } from './actions';
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
    // TODO: Make API call to db, fetch all events created by this address
    // Hard coded for now
    const contracts = [
      '0x8cA8c52e656c985D4cDf75B3DB08eAeFeE571b06',
      '0x79b1f9a21dba7ac40e174d21c8de074963b14b11',
    ];
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
    yield put(loadEventsFailure(error.response.data));
  }
}

export function* mintTicket() {
  const accounts = yield select(makeSelectAccounts());
  const contract = yield select(makeSelectSelectedContract());
  const massMint = yield select(makeSelectMassMint());
  const seatNumber = yield select(makeSelectSeatNumber());
  const price = yield select(makeSelectPrice());
  const quantity = yield select(makeSelectQuantity());
  const instance = new web3.eth.Contract(EventTicket.abi, contract);
  if (massMint) {
    yield instance.methods
      .massMint(price, seatNumber, quantity)
      .send({ from: accounts[0] });
  } else {
    yield instance.methods.mint(price, seatNumber).send({ from: accounts[0] });
  }
}

export default function* manageEventPageSaga() {
  yield takeLatest(LOAD_EVENTS, loadEvents);
  yield takeLatest(MINT_TICKET, mintTicket);
}
