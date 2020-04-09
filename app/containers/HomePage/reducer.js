/*
 *
 * HomePage reducer
 *
 */
import produce from 'immer';
import {
  CHANGE_TICKETCHAINADDRESS,
  LOAD_EVENT,
  EMPTY_EVENTS_ARRAY,
  PUSH_EVENT,
} from './constants';

export const initialState = {
  ticketChainAddress: '',
  eventId: null,
  events: [],
};

/* eslint-disable default-case, no-param-reassign */
const homePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_TICKETCHAINADDRESS:
        draft.ticketChainAddress = action.ticketChainAddress;
        break;
      case LOAD_EVENT:
        draft.eventId = action.eventId;
        break;
      case EMPTY_EVENTS_ARRAY:
        draft.events = [];
        break;
      case PUSH_EVENT:
        draft.events.push(action.event);
        break;
    }
  });

export default homePageReducer;
