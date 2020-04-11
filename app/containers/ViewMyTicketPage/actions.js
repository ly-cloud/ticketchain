/*
 *
 * ViewMyTicketPage actions
 *
 */

import {
  LOAD_TICKETS,
  TOGGLE_LIST_MODAL,
  LOAD_EVENTID,
  LOAD_TICKETS_SUCCESS,
} from './constants';

export function loadTickets() {
  return {
    type: LOAD_TICKETS,
  };
}

export function toggleModal(state) {
  return {
    type: TOGGLE_LIST_MODAL,
    state,
  };
}

export function loadEventId(eventId) {
  return {
    type: LOAD_EVENTID,
    eventId,
  };
}

export function loadTicketsSuccess(tickets) {
  return {
    type: LOAD_TICKETS_SUCCESS,
    tickets,
  };
}
