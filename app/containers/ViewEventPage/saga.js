import { takeLatest, put, call, select } from 'redux-saga/effects';
import request from 'utils/request';
import { LOAD_EVENT, BUY_TICKET_BACKEND } from './constants';
import {
  loadEventSuccess,
  loadEventError,
  buyTicketBackendSuccess,
  buyTicketBackendError,
} from './actions';
import {
  makeSelectAddress,
  makeSelectEventId,
  makeSelectTicket,
} from './selectors';
import { makeSelectAccounts } from '../App/selectors';

export function* loadEvent() {
  // Select address from store
  const address = yield select(makeSelectAddress());

  const requestURL = `${
    process.env.BACKEND_API_URL
  }/eventOrganiser/address/${address}`;

  try {
    const res = yield call(request, requestURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    yield put(loadEventSuccess(res.event));
  } catch (err) {
    const errRes = yield err.response.json();
    yield put(loadEventError(errRes));
  }
}

export function* buyTicketBackend() {
  // Select eventId from store
  const eventId = yield select(makeSelectEventId());
  // Select ownerAddress from store
  const ownerAddresses = yield select(makeSelectAccounts());
  // Select ticket from store
  const ticket = yield select(makeSelectTicket());

  const requestURL = `${process.env.BACKEND_API_URL}/ticket/buyTicket`;

  try {
    const res = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        eventId,
        currentOwner: ownerAddresses[0],
        ticketId: ticket.ticketId,
      }),
    });
    yield put(buyTicketBackendSuccess(res));
  } catch (err) {
    const errRes = yield err.response.json();
    yield put(buyTicketBackendError(errRes));
  }
}

export default function* viewEventPageSaga() {
  yield takeLatest(LOAD_EVENT, loadEvent);
  yield takeLatest(BUY_TICKET_BACKEND, buyTicketBackend);
}
