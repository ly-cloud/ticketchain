/*
 *
 * CreateEventPage actions
 *
 */

import {
  CHANGE_EVENTNAME,
  CHANGE_EVENTDATETIME,
  CHANGE_EVENTSTARTSALE,
  CHANGE_EVENTENDSALE,
  CHANGE_EVENTVENUE,
  CHANGE_EVENTIMAGE,
} from './constants';

export function changeEventName(eventName) {
  return {
    type: CHANGE_EVENTNAME,
    eventName,
  };
}

export function changeEventDateTime(eventDateTime) {
  return {
    type: CHANGE_EVENTDATETIME,
    eventDateTime,
  };
}
export function changeEventVenue(eventVenue) {
  return {
    type: CHANGE_EVENTVENUE,
    eventVenue,
  };
}

export function changeEventStartSale(eventStartSale) {
  return {
    type: CHANGE_EVENTSTARTSALE,
    eventStartSale,
  };
}
export function changeEventEndSale(eventEndSale) {
  return {
    type: CHANGE_EVENTENDSALE,
    eventEndSale,
  };
}

export function changeEventImage(eventImage) {
  return {
    type: CHANGE_EVENTIMAGE,
    eventImage,
  };
}
