import { takeLatest, call, put, select, cps } from 'redux-saga/effects';
import {
  LOGIN_METAMASK,
  SIGN_MESSAGE,
  HANDLE_AUTHENTICATE,
  SIGNUP,
} from './constants';
import {
  loginSuccess,
  loginError,
  signMessage,
  handleAuthentication,
  toggleSignUpModal,
} from './actions';
import {
  makeSelectPublicAddress,
  makeSelectNonce,
  makeSelectSignature,
  makeSelectRole,
} from './selectors';
import * as api from '../../utils/apiManager';

const { web3 } = window;

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
    // const accounts = yield cps(web3.eth.getCoinbase, (error,result) => {
    //   console.log(result)
    // });

    const signature = yield cps(
      web3.personal.sign,
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
    yield put(loginSuccess(res.data));
  } catch (err) {
    yield put(loginError(err.response.data));
  }
}

export function* backendSignUp() {
  const publicAddress = yield select(makeSelectPublicAddress());
  const role = yield select(makeSelectRole());
  try {
    yield put(toggleSignUpModal(false));
    const res = yield call(api.userSignUp, ...[publicAddress, role]);
    yield put(loginSuccess(res.data));
  } catch (err) {
    yield put(loginError(err.response.data));
  }
}

export default function* loginPageSaga() {
  yield takeLatest(LOGIN_METAMASK, loginMetamask);
  yield takeLatest(SIGN_MESSAGE, signMessageWithAddress);
  yield takeLatest(HANDLE_AUTHENTICATE, backendAuthentication);
  yield takeLatest(SIGNUP, backendSignUp);
}
