/*
 *
 * ViewEventPage actions
 *
 */

import { toast } from 'react-toastify';
import {
  LOAD_EVENT,
  LOAD_EVENT_SUCCESS,
  LOAD_EVENT_ERROR,
  BUY_TICKET_BACKEND,
  BUY_TICKET_BACKEND_SUCCESS,
  BUY_TICKET_BACKEND_ERROR,
  PROMPT_LOGIN,
  CHANGE_TICKETCHAIN_ADDRESS,
  CHANGE_NAME,
  CHANGE_DATETIME,
  CHANGE_VENUE,
  CHANGE_OPENINGSALETIME,
  CHANGE_CLOSINGSALETIME,
  EMPTY_TICKETS_ARRAY,
  PUSH_TICKET,
  CHANGE_TICKET,
  CHANGE_MODAL_ISOPEN,
  CHANGE_TRANSACTIONFEE,
} from './constants';
let loadEventToastId = null;
let buyTicketBackendToastId = null;
let promptLoginToastId = null;

export function loadEvent(address) {
  return {
    type: LOAD_EVENT,
    address,
  };
}

export function loadEventSuccess(event) {
  return {
    type: LOAD_EVENT_SUCCESS,
    event,
  };
}

export function loadEventError(error) {
  toast.dismiss(loadEventToastId);
  loadEventToastId = null;
  toast.error(error.message, {
    containerId: 'default',
  });
  return {
    type: LOAD_EVENT_ERROR,
  };
}

export function buyTicketBackend(eventId) {
  return {
    type: BUY_TICKET_BACKEND,
    eventId,
  };
}

export function buyTicketBackendSuccess(res) {
  toast.dismiss(buyTicketBackendToastId);
  buyTicketBackendToastId = null;
  toast.success(res.message, {
    containerId: 'default',
  });
  return {
    type: BUY_TICKET_BACKEND_SUCCESS,
  };
}

export function buyTicketBackendError(error) {
  toast.dismiss(buyTicketBackendToastId);
  buyTicketBackendToastId = null;
  toast.error(error.message, {
    containerId: 'default',
  });
  return {
    type: BUY_TICKET_BACKEND_ERROR,
  };
}

export function promptLogin() {
  toast.dismiss(promptLoginToastId);
  promptLoginToastId = null;
  toast.warning('Please login to use this feature', {
    containerId: 'default',
  });
  return {
    type: PROMPT_LOGIN,
  };
}

export function changeTicketChainAddress(ticketChainAddress) {
  return {
    type: CHANGE_TICKETCHAIN_ADDRESS,
    ticketChainAddress,
  };
}

export function changeName(name) {
  return {
    type: CHANGE_NAME,
    name,
  };
}

export function changeDateTime(dateTime) {
  return {
    type: CHANGE_DATETIME,
    dateTime,
  };
}

export function changeVenue(venue) {
  return {
    type: CHANGE_VENUE,
    venue,
  };
}

export function changeOpeningSaleTime(openingSaleTime) {
  return {
    type: CHANGE_OPENINGSALETIME,
    openingSaleTime,
  };
}

export function changeClosingSaleTime(closingSaleTime) {
  return {
    type: CHANGE_CLOSINGSALETIME,
    closingSaleTime,
  };
}

export function emptyTicketsArray() {
  return {
    type: EMPTY_TICKETS_ARRAY,
  };
}

export function pushTicket(ticket) {
  return {
    type: PUSH_TICKET,
    ticket,
  };
}

export function changeTicket(ticket) {
  return {
    type: CHANGE_TICKET,
    ticket,
  };
}

export function changeModalIsOpen(modalIsOpen) {
  return {
    type: CHANGE_MODAL_ISOPEN,
    modalIsOpen,
  };
}

export function changeTransactionFee(transactionFee) {
  return {
    type: CHANGE_TRANSACTIONFEE,
    transactionFee,
  };
}
