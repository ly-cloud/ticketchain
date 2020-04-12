/*
 *
 * EditEventPage reducer
 *
 */
import produce from 'immer';
import {
  LOAD_EVENT,
  LOAD_EVENT_SUCCESS,
  EDIT_EVENT_SUCCESS,
  CHANGE_NAME,
  CHANGE_DESCRIPTION,
  CHANGE_IMAGEURL,
  CHANGE_DATETIME,
  CHANGE_VENUE,
  CHANGE_OPENINGSALETIME,
  CHANGE_CLOSINGSALETIME,
} from './constants';

export const initialState = {
  address: '',
  name: '',
  description: '',
  imageUrl: '',
  dateTime: '',
  venue: '',
  openingSaleTime: '',
  closingSaleTime: '',
  isListed: false,
  initialEvent: null,
};

/* eslint-disable default-case, no-param-reassign */
const editEventPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_EVENT:
        draft.name = action.name;
        draft.description = '';
        draft.imageUrl = '';
        draft.dateTime = action.dateTime;
        draft.venue = action.venue;
        draft.openingSaleTime = action.openingSaleTime;
        draft.closingSaleTime = action.closingSaleTime;
        draft.isListed = action.isListed;
        draft.address = action.address;
        break;
      case LOAD_EVENT_SUCCESS:
        draft.description = action.event.description;
        draft.imageUrl = action.event.imageUrl;
        draft.initialEvent = action.initialEvent;
        break;
      case EDIT_EVENT_SUCCESS:
        draft.name = '';
        draft.description = '';
        draft.imageUrl = '';
        draft.dateTime = '';
        draft.venue = '';
        draft.openingSaleTime = '';
        draft.closingSaleTime = '';
        draft.isListed = false;
        draft.address = null;
        break;
      case CHANGE_NAME:
        draft.name = action.name;
        break;
      case CHANGE_DESCRIPTION:
        draft.description = action.description;
        break;
      case CHANGE_IMAGEURL:
        draft.imageUrl = action.imageUrl;
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
    }
  });

export default editEventPageReducer;
