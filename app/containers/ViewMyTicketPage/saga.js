import { call, put, select, cps, takeLatest } from 'redux-saga/effects';
import Web3 from 'web3';
import request from 'utils/request';
import {
  makeSelectEventId,
  makeSelectListedTicket,
  makeSelectPrice,
} from './selectors';
import { loadTicketsSuccess, success, failed, loadEventId } from './actions';
import * as api from '../../utils/apiManager';
import EventTicket from '../../../build/contracts/EventTicket.json';
import TicketChain from '../../../build/contracts/TicketChain.json';
import { LOAD_EVENTID, LIST_TICKET, UNLIST_TICKET } from './constants';

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

  yield put(loadTicketsSuccess(tickets));
}

export function* listTicket() {
  const ticket = yield select(makeSelectListedTicket());
  const price = yield select(makeSelectPrice());
  const eventId = yield select(makeSelectEventId());
  const accounts = yield cps(web3.eth.getAccounts);
  const address = accounts[0];

  if (price > ticket.originalPrice) {
    yield put(
      failed(
        'Ticket failed to list. The price listed is higer than the original price',
      ),
    );
  } else {
    // Get ticketChain instance
    const networkId = yield cps(web3.eth.net.getId);
    const networkData = TicketChain.networks[networkId];
    const ticketChainInstance = new web3.eth.Contract(
      TicketChain.abi,
      networkData.address,
    );

    try {
      const eventRes = yield call(api.getEventbyEventId, eventId);
      const { event } = eventRes.data;
      const eventAddress = event.address;
      const eventTicketInstance = new web3.eth.Contract(
        EventTicket.abi,
        eventAddress,
      );
      // Transfer ticket to ticketChain
      yield eventTicketInstance.methods
        .transfer(ticket.ticketId)
        .send({ from: address });
      // List the ticket on ticketChain
      yield ticketChainInstance.methods
        .list(eventId, ticket.ticketId, price, ticket.seatNumber)
        .send({ from: address });
      // Change ticket in offchain current owner to ticketChain's address
      const requestURL = `${process.env.BACKEND_API_URL}/ticket/ticketId/${
        ticket.ticketId
      }/eventId/${eventId}`;
      yield call(request, requestURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          resellListed: true,
        }),
      });
      yield put(success('Ticket successfully listed'));
      yield put(loadEventId(eventId));
    } catch (err) {
      console.log(err);
      yield put(failed('Ticket failed to list'));
    }
  }
}

export function* unlistTicket() {
  const ticket = yield select(makeSelectListedTicket());
  const eventId = yield select(makeSelectEventId());
  const accounts = yield cps(web3.eth.getAccounts);
  const address = accounts[0];

  const networkId = yield cps(web3.eth.net.getId);
  const networkData = TicketChain.networks[networkId];
  const ticketChainInstance = new web3.eth.Contract(
    TicketChain.abi,
    networkData.address,
  );
  try {
    yield ticketChainInstance.methods
      .unlist(eventId, ticket.ticketId)
      .send({ from: address });
    const requestURL = `${process.env.BACKEND_API_URL}/ticket/ticketId/${
      ticket.ticketId
    }/eventId/${eventId}`;
    yield call(request, requestURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        resellListed: false,
      }),
    });
    yield put(success('Ticket successfully unlisted'));
    yield put(loadEventId(eventId));
  } catch (err) {
    console.log(err);
    yield put(failed('Ticket failed to unlist'));
  }
}

export default function* viewMyTicketsPageSaga() {
  // load eventId into state, then from state load tickets
  yield takeLatest(LOAD_EVENTID, loadTicketsOfEvent);
  yield takeLatest(LIST_TICKET, listTicket);
  yield takeLatest(UNLIST_TICKET, unlistTicket);
}
