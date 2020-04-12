/*
 *
 * ViewMyTicketPage actions
 *
 */
import { toast } from 'react-toastify';
import {
  LOAD_TICKETS,
  TOGGLE_LIST_MODAL,
  LOAD_EVENTID,
  LOAD_TICKETS_SUCCESS,
  LOAD_TICKET,
  CHANGE_PRICE,
  LIST_TICKET,
  UNLIST_TICKET,
  SUCCESS,
  FAILED,
} from './constants';

let toastId = null;

export function loadTickets() {
  return {
    type: LOAD_TICKETS,
  };
}

export function toggleListModal(listModal) {
  return {
    type: TOGGLE_LIST_MODAL,
    listModal,
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

export function loadTicket(ticketListed) {
  return {
    type: LOAD_TICKET,
    ticketListed,
  };
}

export function changePrice(price) {
  return {
    type: CHANGE_PRICE,
    price,
  };
}

export function listTicket() {
  return {
    type: LIST_TICKET,
  };
}

export function unlistTicket() {
  return {
    type: UNLIST_TICKET,
  };
}

export function success(message) {
  toast.dismiss(toastId);
  toastId = null;
  toast.success(message, {
    containerId: 'default',
  });
  return {
    type: SUCCESS,
  };
}

export function failed(message) {
  toast.dismiss(toastId);
  toastId = null;
  toast.error(message, {
    containerId: 'default',
  });
  return {
    type: FAILED,
  };
}
