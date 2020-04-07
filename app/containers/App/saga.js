import { takeLatest, select, call, put } from 'redux-saga/effects';
import { LOGIN_METAMASK } from './constants';
import { makeSelectPublicAddress } from './selectors';
import { loginSuccess, loginError } from '../LoginPage/actions';
import * as api from '../../utils/apiManager';

export function* metamaskLogin() {
  const publicAddress = yield select(makeSelectPublicAddress());
  try {
    const res = yield call(api.login, publicAddress);
    yield put(loginSuccess(res.data));
  } catch (err) {
    yield put(loginError(err.response.data));
  }
}

export default function* appSaga() {
  yield takeLatest(LOGIN_METAMASK, metamaskLogin);
}
