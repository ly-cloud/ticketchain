import { call, put, select, cps, takeLatest } from 'redux-saga/effects';
import Web3 from 'web3';
import { makeSelectEventId } from './selectors';
import { loadTicketsSuccess } from './actions';
import * as api from '../../utils/apiManager';
import EventTicket from '../../../build/contracts/EventTicket.json';
import { LOAD_EVENTID } from './constants';

const web3 = new Web3(window.ethereum);

export function* loadTicketsOfEvent() {
  // Get all tickets from off-chain that belong to current eventId
  const accounts = yield cps(web3.eth.getAccounts);
  const ownerAddress = accounts[0];
  const eventId = yield select(makeSelectEventId());
  const offChainTicketsRes = yield call(
    api.getTicketsByAddressAndEventId,
    ...[ownerAddress, eventId],
  );
  const offChainTickets = [...offChainTicketsRes.data.tickets];

  // Get event contract's address
  const offChainEventRes = yield call(api.getEventbyEventId, eventId);
  const eventAddress = offChainEventRes.data.event.address;
  const eventContractInstance = new web3.eth.Contract(
    EventTicket.abi,
    eventAddress,
  );

  // Get ticket details off + on chain
  const tickets = [];
  for (const offChainTicket of offChainTickets) {
    const ticketDetails = yield eventContractInstance.methods
      .tickets(offChainTicket.ticketId)
      .call();
    const ticketObj = {
      ticketId: ticketDetails[0],
      originalPrice: ticketDetails[1],
      seatNumber: ticketDetails[2],
      currOwner: ticketDetails[3],
      prevOwner: ticketDetails[4],
      listed: offChainTicket.resellListed,
    };
    tickets.push(ticketObj);
  }
  console.log(tickets);

  yield put(loadTicketsSuccess(tickets));
}

export default function* viewMyTicketsPageSaga() {
  // load eventId into state, then from state load tickets
  yield takeLatest(LOAD_EVENTID, loadTicketsOfEvent);
}
