import { takeLatest, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import { LOGIN } from './constants';
import { loginSuccess, loginError } from './actions';
import { makeSelectEmail, makeSelectPassword } from './selectors';

export function* login() {
  // Select email from store
  const email = yield select(makeSelectEmail());
  // Select password from store
  const password = yield select(makeSelectPassword());

  const requestURL = `${process.env.BACKEND_API_URL}/login`;

  try {
    const res = yield call(request, requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // Authorization: `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    yield put(loginSuccess(res));
  } catch (err) {
    const errRes = yield err.response.json();
    yield put(loginError(errRes));
  }
}

export default function* loginPageSaga() {
  yield takeLatest(LOGIN, login);
}
