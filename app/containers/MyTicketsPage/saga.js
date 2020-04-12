import { takeLatest, call, put, cps } from 'redux-saga/effects';
import Web3 from 'web3';
import { LOAD_TICKETS } from './constants';
import { loadedEvents } from './actions';
import * as api from '../../utils/apiManager';
import EventTicket from '../../../build/contracts/EventTicket.json';
// Individual exports for testing

const web3 = new Web3(window.ethereum);

export function* loadAllTicketsOwned() {
  // Get all tickets from off-chain
  const accounts = yield cps(web3.eth.getAccounts);
  const ownerAddress = accounts[0];
  const ticketsRes = yield call(api.getMyTickets, ownerAddress);
  const ticketsOffChain = [...ticketsRes.data.tickets];

  // Get all the eventIds
  const eventIds = [];
  ticketsOffChain.forEach(ticket => {
    eventIds.push(ticket.eventId);
  });
  const uniqueEventIds = new Set(eventIds);
  const eventIdsArr = [...uniqueEventIds];

  // Fetch off-chain event data
  const eventOffchain = [];
  for (const eventId of eventIdsArr) {
    const eventRes = yield call(api.getEventbyEventId, eventId);
    eventOffchain.push(eventRes.data.event);
  }

  // Fetch on-chain event data
  const events = [];
  for (const event of eventOffchain) {
    const eventContractInstance = new web3.eth.Contract(
      EventTicket.abi,
      event.address,
    );
    const eventDetails = yield eventContractInstance.methods.getEvent().call();
    const eventObj = {
      eventId: eventDetails[0],
      eventName: eventDetails[1],
      eventDateTime: eventDetails[2],
      venue: eventDetails[3],
      imageUrl: event.imageUrl,
      description: event.description,
    };
    events.push(eventObj);
  }
  yield put(loadedEvents(events));
}

export default function* myTicketsPageSaga() {
  yield takeLatest(LOAD_TICKETS, loadAllTicketsOwned);
}
