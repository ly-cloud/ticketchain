/*
 *
 * ViewEventPage actions
 *
 */

import {
  CHANGE_EVENTID,
  CHANGE_NAME,
  CHANGE_DATETIME,
  CHANGE_VENUE,
  CHANGE_OPENINGSALETIME,
  CHANGE_CLOSINGSALETIME,
  EMPTY_TICKETS_ARRAY,
  PUSH_TICKET,
} from './constants';

export function changeEventId(eventId) {
  return {
    type: CHANGE_EVENTID,
    eventId,
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
