/*
 *
 * MyTicketsPage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION, TICKETS_LOADED, EVENTS_LOADED } from './constants';

export const initialState = {
  tickets: [],
  events: [],
};

/* eslint-disable default-case, no-param-reassign */
const myTicketsPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DEFAULT_ACTION:
        break;
      case TICKETS_LOADED:
        draft.tickets = action.tickets;
        break;
      case EVENTS_LOADED:
        draft.events = action.events;
    }
  });

export default myTicketsPageReducer;
