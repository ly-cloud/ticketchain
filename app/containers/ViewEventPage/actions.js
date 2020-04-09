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
  CHANGE_NAME,
  CHANGE_DATETIME,
  CHANGE_VENUE,
  CHANGE_OPENINGSALETIME,
  CHANGE_CLOSINGSALETIME,
  EMPTY_TICKETS_ARRAY,
  PUSH_TICKET,
} from './constants';
let loadEventToastId = null;

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
