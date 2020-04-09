/*
 *
 * ManageEventPage actions
 *
 */

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
  LIST_TICKET,
  WITHDRAW_EARNINGS,
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
  return {
    type: LOAD_EVENTS_FAILURE,
    error,
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

export function listTicket() {
  return {
    type: LIST_TICKET,
  };
}

export function withdrawEarnings() {
  return {
    type: WITHDRAW_EARNINGS,
  };
}
