import { takeLatest, select, call, put } from 'redux-saga/effects';
import { LOGIN_METAMASK } from './constants';
import { loginSuccess, loginError } from './actions';
import { makeSelectAccounts } from './selectors';
import * as api from '../../utils/apiManager';

export function* metamaskLogin() {
  const accounts = yield select(makeSelectAccounts());
  const address = accounts[0];
  try {
    const res = yield call(api.login, address);
    yield put(loginSuccess(res.data));
  } catch (err) {
    yield put(loginError(err.response.data));
  }
}

export default function* appSaga() {
  yield takeLatest(LOGIN_METAMASK, metamaskLogin);
}
