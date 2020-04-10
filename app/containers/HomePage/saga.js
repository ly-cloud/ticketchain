import { takeEvery, put, call, select } from 'redux-saga/effects';
import Web3 from 'web3';
import request from 'utils/request';
import { LOAD_EVENT } from './constants';
import { loadEventError, pushEvent } from './actions';
import TicketChain from '../../../build/contracts/TicketChain.json';
import EventTicket from '../../../build/contracts/EventTicket.json';
import { makeSelectTicketChainAddress, makeSelectEventId } from './selectors';

const web3 = new Web3(window.ethereum);

export function* loadEvent() {
  // Select TicketChainAddress from store
  const ticketChainAddress = yield select(makeSelectTicketChainAddress());
  // Select eventId from store
  const eventId = yield select(makeSelectEventId());

  const ticketChainInstance = new web3.eth.Contract(
    TicketChain.abi,
    ticketChainAddress,
  );
  // Retrieve event ticket address
  const eventTicketAddress = yield ticketChainInstance.methods
    .events(eventId)
    .call();

  // Retrieve instance of EventTicket contract
  const eventTicketInstance = new web3.eth.Contract(
    EventTicket.abi,
    eventTicketAddress,
  );
  // Returns an array of event ticket details
  // [eventName, eventDatetime, venue, openSaleTime, closingSaleTime, isListed]
  const eventTicketDetails = yield eventTicketInstance.methods
    .getEvent()
    .call();

  // if EventTicket is listed
  if (eventTicketDetails[6]) {
    const requestURL = `${
      process.env.BACKEND_API_URL
    }/eventOrganiser/address/${eventTicketAddress}`;

    try {
      const res = yield call(request, requestURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      // Store information inside an object
      const eventObject = {
        eventTicketAddress,
        eventId,
        eventName: eventTicketDetails[1],
        description: res.event.description,
        imageUrl: res.event.imageUrl,
        eventDateTime: new Date(eventTicketDetails[2] * 1000),
        venue: eventTicketDetails[3],
      };

      // Push object to events array in the redux store
      yield put(pushEvent(eventObject));
    } catch (err) {
      const errRes = yield err.response.json();
      yield put(loadEventError(errRes));
    }
  }
}

export default function* homePageSaga() {
  yield takeEvery(LOAD_EVENT, loadEvent);
}
