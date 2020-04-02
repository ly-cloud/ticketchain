/*
 *
 * CreateEventPage reducer
 *
 */
import produce from 'immer';
import {
  CHANGE_EVENTDATETIME,
  CHANGE_EVENTENDSALE,
  CHANGE_EVENTIMAGE,
  CHANGE_EVENTSTARTSALE,
  CHANGE_EVENTNAME,
  CHANGE_EVENTVENUE,
  CREATE_EVENT,
} from './constants';

export const initialState = {
  eventName: '',
  eventDateTime: '',
  eventVenue: '',
  eventStartSale: '',
  eventEndSale: '',
  eventImage: '',
};

/* eslint-disable default-case, no-param-reassign */
const createEventPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_EVENTNAME:
        draft.eventName = action.eventName;
        break;
      case CHANGE_EVENTDATETIME:
        draft.eventDateTime = action.eventDateTime;
        break;
      case CHANGE_EVENTSTARTSALE:
        draft.eventStartSale = action.eventStartSale;
        break;
      case CHANGE_EVENTENDSALE:
        draft.eventEndSale = action.eventEndSale;
        break;
      case CHANGE_EVENTVENUE:
        draft.eventVenue = action.eventVenue;
        break;
      case CHANGE_EVENTIMAGE:
        draft.eventImage = action.eventImage;
        break;
      case CREATE_EVENT:
        break;
    }
  });

export default createEventPageReducer;
