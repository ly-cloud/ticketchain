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
  CHANGE_EVENTDES,
  CREATE_EVENT,
  CLEAR_FORM,
} from './constants';

export const initialState = {
  eventName: '',
  eventDateTime: '',
  eventVenue: '',
  eventStartSale: '',
  eventEndSale: '',
  eventImage: '',
  eventDes: '',
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
      case CHANGE_EVENTDES:
        draft.eventDes = action.eventDes;
        break;
      case CLEAR_FORM:
        draft.eventName = '';
        draft.eventDateTime = '';
        draft.eventStartSale = '';
        draft.eventEndSale = '';
        draft.eventVenue = '';
        draft.eventImage = '';
        draft.eventDes = '';
        break;
      case CREATE_EVENT:
        break;
    }
  });

export default createEventPageReducer;
