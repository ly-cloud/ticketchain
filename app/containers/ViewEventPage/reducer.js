/*
 *
 * ViewEventPage reducer
 *
 */
import produce from 'immer';
import {
  LOAD_EVENT,
  LOAD_EVENT_SUCCESS,
  CHANGE_NAME,
  CHANGE_TICKETCHAIN_ADDRESS,
  CHANGE_DATETIME,
  CHANGE_VENUE,
  CHANGE_OPENINGSALETIME,
  CHANGE_CLOSINGSALETIME,
  EMPTY_TICKETS_ARRAY,
  PUSH_TICKET,
  CHANGE_TICKET,
  CHANGE_MODAL_ISOPEN,
  CHANGE_TRANSACTIONFEE,
} from './constants';

export const initialState = {
  address: '',
  name: '',
  description: '',
  imageUrl: '',
  dateTime: null,
  venue: '',
  openingSaleTime: null,
  closingSaleTime: null,
  tickets: [],
  ticket: null,
  modalIsOpen: false,
  transactionFee: '',
};

/* eslint-disable default-case, no-param-reassign */
const viewEventPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_EVENT:
        draft.name = '';
        draft.description = '';
        draft.imageUrl = '';
        draft.dateTime = null;
        draft.venue = '';
        draft.openingSaleTime = null;
        draft.closingSaleTime = null;
        draft.address = action.address;
        break;
      case LOAD_EVENT_SUCCESS:
        draft.description = action.event.description;
        draft.imageUrl = action.event.imageUrl;
        break;
      case CHANGE_TICKETCHAIN_ADDRESS:
        draft.ticketChainAddress = action.ticketChainAddress;
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
      case CHANGE_TICKET:
        draft.ticket = action.ticket;
        break;
      case CHANGE_MODAL_ISOPEN:
        draft.modalIsOpen = action.modalIsOpen;
        break;
      case CHANGE_TRANSACTIONFEE:
        draft.transactionFee = action.transactionFee;
        break;
    }
  });

export default viewEventPageReducer;
