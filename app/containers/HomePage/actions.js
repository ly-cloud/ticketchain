/*
 *
 * HomePage actions
 *
 */

import { EMPTY_EVENTS_ARRAY, PUSH_EVENT } from './constants';

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
