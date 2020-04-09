import { takeLatest, put, call, select } from 'redux-saga/effects';
import request from 'utils/request';
import { LOAD_EVENT } from './constants';
import { loadEventSuccess, loadEventError } from './actions';
import { makeSelectAddress } from './selectors';

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

export default function* viewEventPageSaga() {
  yield takeLatest(LOAD_EVENT, loadEvent);
}
