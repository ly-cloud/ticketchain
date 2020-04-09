/*
 *
 * HomePage actions
 *
 */

import { toast } from 'react-toastify';
import {
  CHANGE_TICKETCHAINADDRESS,
  LOAD_EVENT,
  LOAD_EVENT_ERROR,
  EMPTY_EVENTS_ARRAY,
  PUSH_EVENT,
} from './constants';
let loadEventToastId = null;

export function changeTicketChainAddress(ticketChainAddress) {
  return {
    type: CHANGE_TICKETCHAINADDRESS,
    ticketChainAddress,
  };
}

export function loadEvent(eventId) {
  return {
    type: LOAD_EVENT,
    eventId,
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

export function emptyEventsArray() {
  return {
    type: EMPTY_EVENTS_ARRAY,
  };
}

export function pushEvent(event) {
  return {
    type: PUSH_EVENT,
    event,
  };
}
