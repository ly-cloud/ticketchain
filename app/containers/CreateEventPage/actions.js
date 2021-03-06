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
  CREATE_EVENT,
  CHANGE_EVENTDES,
  CLEAR_FORM,
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

export function changeEventDes(eventDes) {
  return {
    type: CHANGE_EVENTDES,
    eventDes,
  };
}

export function clearForm() {
  return {
    type: CLEAR_FORM,
  };
}

export function createEvent() {
  return {
    type: CREATE_EVENT,
  };
}
