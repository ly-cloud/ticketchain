import { takeLatest, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import {
  LOGIN,
  LOGIN_METAMASK,
  SIGN_MESSAGE,
  HANDLE_AUTHENTICATE,
} from './constants';
import {
  loginSuccess,
  loginError,
  signMessage,
  handleAuthentication,
} from './actions';
import {
  makeSelectEmail,
  makeSelectPassword,
  makeSelectPublicAddress,
  makeSelectNonce,
  makeSelectSignature,
} from './selectors';
import * as api from '../../utils/apiManager';

const { web3 } = window;

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

export function* loginMetamask() {
  const publicAddress = yield select(makeSelectPublicAddress());
  try {
    const res = yield call(api.getUserDataByAddress, publicAddress);
    yield put(signMessage(res.data.user.nonce));
  } catch (err) {
    yield put(loginError(err.response.data));
  }
}

export function* signMessageWithAddress() {
  const nonce = yield select(makeSelectNonce());
  const publicAddress = yield select(makeSelectPublicAddress());
  const message = `I am signing my one-time nonce: ${nonce}`;
  try {
    const signature = yield call(
      web3.eth.personal.sign,
      ...[message, publicAddress],
    );
    yield put(handleAuthentication(signature, publicAddress));
  } catch (err) {
    yield put(loginError(err.response.data));
  }
}

export function* backendAuthentication() {
  const publicAddress = yield select(makeSelectPublicAddress());
  const signature = yield select(makeSelectSignature());
  try {
    const res = yield call(api.authenticateUser, ...[signature, publicAddress]);
    console.log(res);
  } catch (err) {
    yield put(loginError(err.response.data));
  }
}

export default function* loginPageSaga() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(LOGIN_METAMASK, loginMetamask);
  yield takeLatest(SIGN_MESSAGE, signMessageWithAddress);
  yield takeLatest(HANDLE_AUTHENTICATE, backendAuthentication);
}
