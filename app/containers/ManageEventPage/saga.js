import { takeLatest, put, select, call } from 'redux-saga/effects';
import Web3 from 'web3';
import request from 'utils/request';
import {
  LOAD_EVENTS,
  MINT_TICKET,
  LIST_TICKETS,
  WITHDRAW_EARNINGS,
} from './constants';
import { makeSelectAccounts } from '../App/selectors';
import {
  loadEventsSuccess,
  loadEventsFailure,
  mintTicketSuccess,
  listTicketsSuccess,
  withdrawEarningsSuccess,
} from './actions';
import {
  makeSelectSelectedContract,
  makeSelectMassMint,
  makeSelectSeatNumber,
  makeSelectPrice,
  makeSelectQuantity,
} from './selectors';
import EventTicket from '../../../build/contracts/EventTicket.json';

const web3 = new Web3(window.ethereum);

export function* loadEvents() {
  try {
    const accounts = yield select(makeSelectAccounts());
    const addressStr = accounts[0].toLowerCase();
    const requestURL = `${
      process.env.BACKEND_API_URL
    }/eventOrganiser/ownerAddress/${addressStr}`;
    const res = yield call(request, requestURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    const events = res.events.map(({ address, imageUrl, description }) => ({
      address,
      imageUrl,
      description,
    }));
    const results = [];
    for (const event of events) {
      const instance = new web3.eth.Contract(EventTicket.abi, event.address);
      const balance = yield web3.eth.getBalance(event.address);
      const eventDetails = yield instance.methods.getEvent().call();
      const eventObj = {
        eventId: eventDetails[0],
        eventName: eventDetails[1],
        eventDateTime: eventDetails[2],
        venue: eventDetails[3],
        openSaleTime: eventDetails[4],
        closingSaleTime: eventDetails[5],
        isListed: eventDetails[6],
        address: event.address,
        imageUrl: event.imageUrl,
        description: event.description,
        balance: web3.utils.fromWei(balance, 'ether'),
      };
      results.push(eventObj);
    }
    yield put(loadEventsSuccess(results));
  } catch (error) {
    yield put(loadEventsFailure(error));
  }
}

export function* mintTicket() {
  try {
    const accounts = yield select(makeSelectAccounts());
    const contract = yield select(makeSelectSelectedContract());
    const massMint = yield select(makeSelectMassMint());
    const seatNumber = yield select(makeSelectSeatNumber());
    if (seatNumber < 0) {
      return;
    }
    const priceStr = yield select(makeSelectPrice());
    const priceWei = web3.utils.toWei(priceStr, 'wei');
    if (priceWei.includes('-')) {
      return;
    }
    const quantity = yield select(makeSelectQuantity());

    const instance = new web3.eth.Contract(EventTicket.abi, contract);
    if (massMint) {
      if (quantity > 0) {
        yield instance.methods
          .massMint(priceWei, seatNumber, quantity)
          .send({ from: accounts[0] });
        yield put(mintTicketSuccess('Tickets minted successfully!'));
      }
    } else {
      yield instance.methods
        .mint(priceWei, seatNumber)
        .send({ from: accounts[0] });
      yield put(mintTicketSuccess('Ticket minted successfully!'));
    }
  } catch (error) {
    yield put(loadEventsFailure(error));
  }
}

export function* listTickets() {
  try {
    const accounts = yield select(makeSelectAccounts());
    const contract = yield select(makeSelectSelectedContract());
    const instance = new web3.eth.Contract(EventTicket.abi, contract);
    yield instance.methods.massList().send({ from: accounts[0] });
    yield put(listTicketsSuccess('Tickets listed successfully!'));
    yield loadEvents();
  } catch (error) {
    yield put(loadEventsFailure(error));
  }
}

export function* withdrawEarnings() {
  try {
    const accounts = yield select(makeSelectAccounts());
    const contract = yield select(makeSelectSelectedContract());
    const instance = new web3.eth.Contract(EventTicket.abi, contract);
    yield instance.methods.withdraw().send({ from: accounts[0] });
    yield put(withdrawEarningsSuccess('Balance withdrawn successfully!'));
    yield loadEvents();
  } catch (error) {
    yield put(loadEventsFailure(error));
  }
}

export default function* manageEventPageSaga() {
  yield takeLatest(LOAD_EVENTS, loadEvents);
  yield takeLatest(MINT_TICKET, mintTicket);
  yield takeLatest(LIST_TICKETS, listTickets);
  yield takeLatest(WITHDRAW_EARNINGS, withdrawEarnings);
}
