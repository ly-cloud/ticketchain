import { put, select, cps, takeLatest } from 'redux-saga/effects';
import Web3 from 'web3';
import { LOAD_PAGE, SET_COMMISSION, WITHDRAW_COMMISSION } from './constants';
import {
  loadPageFailure,
  loadPageSuccess,
  setCommissionSuccess,
  withdrawCommissionSuccess,
} from './actions';
import { makeSelectCommission } from './selectors';
import TicketChain from '../../../build/contracts/TicketChain.json';

const web3 = new Web3(window.ethereum);

export function* loadPage() {
  try {
    const accounts = yield cps(web3.eth.getAccounts);
    const addressStr = accounts[0];
    const networkId = yield web3.eth.net.getId();
    const networkData = TicketChain.networks[networkId];
    const instance = new web3.eth.Contract(
      TicketChain.abi,
      networkData.address,
    );
    const owner = yield instance.methods.OWNER().call();
    if (addressStr !== owner) {
      yield put(
        loadPageFailure({ message: 'Only meant for TicketChain owner!' }),
      );
      return;
    }
    const commission = yield instance.methods.commission().call();
    const balance = yield web3.eth.getBalance(networkData.address);
    yield put(
      loadPageSuccess(
        web3.utils.fromWei(commission, 'wei'),
        web3.utils.fromWei(balance, 'ether'),
      ),
    );
  } catch (error) {
    yield put(loadPageFailure(error));
  }
}

export function* setCommission() {
  try {
    const accounts = yield cps(web3.eth.getAccounts);
    const addressStr = accounts[0];
    const networkId = yield web3.eth.net.getId();
    const networkData = TicketChain.networks[networkId];
    const instance = new web3.eth.Contract(
      TicketChain.abi,
      networkData.address,
    );
    const owner = yield instance.methods.OWNER().call();
    if (addressStr !== owner) {
      yield put(
        loadPageFailure({ message: 'Only meant for TicketChain owner!' }),
      );
      return;
    }
    const commission = yield select(makeSelectCommission());
    if (commission.includes('-')) {
      return;
    }
    yield instance.methods.setCommission(commission).send({ from: addressStr });
    yield put(setCommissionSuccess('Commission set successfully!'));
  } catch (error) {
    yield put(loadPageFailure(error));
  }
}

export function* withdrawCommission() {
  try {
    const accounts = yield cps(web3.eth.getAccounts);
    const addressStr = accounts[0];
    const networkId = yield web3.eth.net.getId();
    const networkData = TicketChain.networks[networkId];
    const instance = new web3.eth.Contract(
      TicketChain.abi,
      networkData.address,
    );
    const owner = yield instance.methods.OWNER().call();
    if (addressStr !== owner) {
      yield put(
        loadPageFailure({ message: 'Only meant for TicketChain owner!' }),
      );
      return;
    }
    yield instance.methods.withdraw().send({ from: addressStr });
    yield put(withdrawCommissionSuccess('Balance withdrawn successfully!'));
    yield loadPage();
  } catch (error) {
    yield put(loadPageFailure(error));
  }
}

export default function* ownerPageSaga() {
  yield takeLatest(LOAD_PAGE, loadPage);
  yield takeLatest(SET_COMMISSION, setCommission);
  yield takeLatest(WITHDRAW_COMMISSION, withdrawCommission);
}
