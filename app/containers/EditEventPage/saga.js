import { takeLatest, put, call, select, cps } from 'redux-saga/effects';
import Web3 from 'web3';
import request from 'utils/request';
import { push } from 'connected-react-router';
import { LOAD_EVENT, EDIT_EVENT } from './constants';
import {
  loadEventSuccess,
  loadEventError,
  editEventSuccess,
  editEventError,
} from './actions';
import {
  makeSelectAddress,
  makeSelectName,
  makeSelectDateTime,
  makeSelectVenue,
  makeSelectOpeningSaleTime,
  makeSelectClosingSaleTime,
  makeSelectDescription,
  makeSelectImageUrl,
  makeSelectInitialEvent,
} from './selectors';

const web3 = new Web3(window.ethereum);

export function* loadEvent() {
  // Select address from store
  const eventTicketAddress = yield select(makeSelectAddress());
  const name = yield select(makeSelectName());
  const dateTime = yield select(makeSelectDateTime());
  const venue = yield select(makeSelectVenue());
  const openingSaleTime = yield select(makeSelectOpeningSaleTime());
  const closingSaleTime = yield select(makeSelectClosingSaleTime());

  const accounts = yield cps(web3.eth.getAccounts);
  // Retrieve list of Event Ticket addresses owned by current user's address
  let requestURL = `${
    process.env.BACKEND_API_URL
  }/eventOrganiser/ownerAddress/${accounts[0]}`;
  try {
    let res = yield call(request, requestURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    const addresses = res.events.map(({ address }) => address);
    // Check if the event ticket to be edited belongs to current user
    if (addresses.includes(eventTicketAddress)) {
      requestURL = `${
        process.env.BACKEND_API_URL
      }/eventOrganiser/address/${eventTicketAddress}`;
      res = yield call(request, requestURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      const initialEvent = {
        name,
        description: res.event.description,
        imageUrl: res.event.imageUrl,
        dateTime,
        venue,
        openingSaleTime,
        closingSaleTime,
      };
      yield put(loadEventSuccess(res.event, initialEvent));
    } else {
      yield put(push('/'));
    }
  } catch (err) {
    const errRes = yield err.response.json();
    yield put(loadEventError(errRes));
  }
}

export function* editEvent() {
  // Select address from store
  const address = yield select(makeSelectAddress());
  const description = yield select(makeSelectDescription());
  const imageUrl = yield select(makeSelectImageUrl());
  const initialEvent = yield select(makeSelectInitialEvent());

  if (
    initialEvent.description !== description ||
    initialEvent.imageUrl !== imageUrl
  ) {
    const requestURL = `${
      process.env.BACKEND_API_URL
    }/eventOrganiser/address/${address}`;

    try {
      const res = yield call(request, requestURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          description,
          imageUrl,
        }),
      });
      yield put(editEventSuccess(res));
      yield put(push('/manageEvent'));
    } catch (err) {
      const errRes = yield err.response.json();
      yield put(editEventError(errRes));
    }
  } else {
    yield put(editEventSuccess({ message: 'Event successfully updated' }));
    yield put(push('/manageEvent'));
  }
}

// Individual exports for testing
export default function* editEventPageSaga() {
  yield takeLatest(LOAD_EVENT, loadEvent);
  yield takeLatest(EDIT_EVENT, editEvent);
}
