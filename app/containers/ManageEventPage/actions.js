/*
 *
 * ManageEventPage actions
 *
 */

import { toast } from 'react-toastify';
import {
  LOAD_EVENTS,
  LOAD_EVENTS_SUCCESS,
  LOAD_EVENTS_FAILURE,
  CHANGE_SELECTED_CONTRACT,
  CHANGE_OPEN_MINT_TICKET,
  CHANGE_MASS_MINT,
  CHANGE_SEAT_NUMBER,
  CHANGE_PRICE,
  CHANGE_QUANTITY,
  MINT_TICKET,
  MINT_TICKET_SUCCESS,
  CHANGE_OPEN_LIST_TICKETS,
  LIST_TICKETS,
  LIST_TICKETS_SUCCESS,
  CHANGE_OPEN_WITHDRAW_EARNINGS,
  WITHDRAW_EARNINGS,
  WITHDRAW_EARNINGS_SUCCESS,
} from './constants';

export function loadEvents() {
  return {
    type: LOAD_EVENTS,
  };
}

export function loadEventsSuccess(createdEvents) {
  return {
    type: LOAD_EVENTS_SUCCESS,
    createdEvents,
  };
}

export function loadEventsFailure(error) {
  toast.dismiss();
  toast.error(error.message, {
    containerId: 'default',
  });
  return {
    type: LOAD_EVENTS_FAILURE,
  };
}

export function changeSelectedContract(selectedContract) {
  return {
    type: CHANGE_SELECTED_CONTRACT,
    selectedContract,
  };
}

export function changeOpenMintTicket() {
  return {
    type: CHANGE_OPEN_MINT_TICKET,
  };
}

export function changeMassMint() {
  return {
    type: CHANGE_MASS_MINT,
  };
}

export function changeSeatNumber(seatNumber) {
  return {
    type: CHANGE_SEAT_NUMBER,
    seatNumber,
  };
}

export function changePrice(price) {
  return {
    type: CHANGE_PRICE,
    price,
  };
}

export function changeQuantity(quantity) {
  return {
    type: CHANGE_QUANTITY,
    quantity,
  };
}

export function mintTicket() {
  return {
    type: MINT_TICKET,
  };
}

export function mintTicketSuccess(message) {
  toast.dismiss();
  toast.success(message, {
    containerId: 'default',
  });
  return {
    type: MINT_TICKET_SUCCESS,
  };
}

export function changeOpenListTickets() {
  return {
    type: CHANGE_OPEN_LIST_TICKETS,
  };
}

export function listTickets() {
  return {
    type: LIST_TICKETS,
  };
}

export function listTicketsSuccess(message) {
  toast.dismiss();
  toast.success(message, {
    containerId: 'default',
  });
  return {
    type: LIST_TICKETS_SUCCESS,
  };
}

export function changeOpenWithdrawEarnings() {
  return {
    type: CHANGE_OPEN_WITHDRAW_EARNINGS,
  };
}

export function withdrawEarnings() {
  return {
    type: WITHDRAW_EARNINGS,
  };
}

export function withdrawEarningsSuccess(message) {
  toast.dismiss();
  toast.success(message, {
    containerId: 'default',
  });
  return {
    type: WITHDRAW_EARNINGS_SUCCESS,
  };
}
