import { takeLatest } from 'redux-saga/effects';
// import Web3 from 'web3';
// import { loadedTickets } from './actions';
import { LOAD_TICKETS } from './constants';
// import * as api from '../../utils/apiManager';
// import TicketChain from '../../../build/contracts/TicketChain.json';
// Individual exports for testing

// const web3 = new Web3(window.ethereum);

export function* loadAllTicketsOwned() {
  // const ownerAddress = yield cps(web3.eth.getCoinbase);
  // const tickets = yield call(api.getMyTickets, ownerAddress);
  // const networkId = yield cps(web3.eth.net.getId);
  // const networkData = TicketChain.networks[networkId];
  // const ticketChainAddress = networkData.address;
  // const ticketChainInstance = new web3.eth.Contract(TicketChain.abi, ticketChainAddress);
  // const eventInstance = yield ticketChainInstance.events.call(0);
  // console.log(eventInstance)
  // for(ticket of tickets) {
  //   const eventId = ticket.eventId;
  //   console.log()
  // }
  // yield put(loadedTickets(tickets.data.tickets));
}

export default function* myTicketsPageSaga() {
  yield takeLatest(LOAD_TICKETS, loadAllTicketsOwned);
}
