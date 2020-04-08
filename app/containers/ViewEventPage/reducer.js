/*
 *
 * ViewEventPage reducer
 *
 */
import produce from 'immer';
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

export const initialState = {
  eventId: null,
  name: '',
  dateTime: null,
  venue: '',
  openingSaleTime: null,
  closingSaleTime: null,
  tickets: [],
};

/* eslint-disable default-case, no-param-reassign */
const viewEventPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_EVENTID:
        draft.eventId = action.eventId;
        break;
      case CHANGE_NAME:
        draft.name = action.name;
        break;
      case CHANGE_DATETIME:
        draft.dateTime = action.dateTime;
        break;
      case CHANGE_VENUE:
        draft.venue = action.venue;
        break;
      case CHANGE_OPENINGSALETIME:
        draft.openingSaleTime = action.openingSaleTime;
        break;
      case CHANGE_CLOSINGSALETIME:
        draft.closingSaleTime = action.closingSaleTime;
        break;
      case EMPTY_TICKETS_ARRAY:
        draft.tickets = [];
        break;
      case PUSH_TICKET:
        draft.tickets.push(action.ticket);
        break;
    }
  });

export default viewEventPageReducer;
