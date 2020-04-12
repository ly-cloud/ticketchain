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
  LOAD_TICKET,
  CHANGE_PRICE,
} from './constants';

export const initialState = {
  listModal: false,
  tickets: [],
  eventId: '',
  ticketListed: '',
  price: 0,
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
        break;
      case LOAD_TICKET:
        draft.ticketListed = action.ticketListed;
        break;
      case CHANGE_PRICE:
        draft.price = action.price;
        break;
    }
  });

export default viewMyTicketPageReducer;
