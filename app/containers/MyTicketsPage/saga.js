import { takeLatest, call, put, cps } from 'redux-saga/effects';
import Web3 from 'web3';
import { loadedTickets } from './actions';
import { LOAD_TICKETS } from './constants';
import * as api from '../../utils/apiManager';
// Individual exports for testing

const web3 = new Web3(window.ethereum);

export function* loadAllTicketsOwned() {
  const ownerAddress = yield cps(web3.eth.getCoinbase);
  const tickets = yield call(api.getMyTickets, ownerAddress);
  yield put(loadedTickets(tickets.data.tickets));
}

export default function* myTicketsPageSaga() {
  yield takeLatest(LOAD_TICKETS, loadAllTicketsOwned);
}
