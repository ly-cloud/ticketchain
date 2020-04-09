/*
 *
 * MyTicketsPage actions
 *
 */

import { DEFAULT_ACTION, LOAD_TICKETS, TICKETS_LOADED } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function loadTickets() {
  return {
    type: LOAD_TICKETS,
  };
}

export function loadedTickets(tickets) {
  return {
    type: TICKETS_LOADED,
    tickets,
  };
}
