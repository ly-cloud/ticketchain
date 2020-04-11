/*
 *
 * ViewMyTicketPage reducer
 *
 */
import produce from 'immer';
import {
  TOGGLE_LIST_MODAL,
  LOAD_EVENTID,
  LOAD_TICKETS_SUCCESS,
} from './constants';

export const initialState = {
  listModal: false,
  tickets: [],
  eventId: '',
};

/* eslint-disable default-case, no-param-reassign */
const viewMyTicketPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case TOGGLE_LIST_MODAL:
        draft.listModal = action.listModal;
        break;
      case LOAD_EVENTID:
        draft.eventId = action.eventId;
        break;
      case LOAD_TICKETS_SUCCESS:
        draft.tickets = action.tickets;
    }
  });

export default viewMyTicketPageReducer;
