/*
 *
 * ManageEventPage reducer
 *
 */
import produce from 'immer';
import {
  LOAD_EVENTS,
  LOAD_EVENTS_SUCCESS,
  CHANGE_SELECTED_CONTRACT,
  CHANGE_OPEN_MINT_TICKET,
  CHANGE_MASS_MINT,
  CHANGE_SEAT_NUMBER,
  CHANGE_PRICE,
  CHANGE_QUANTITY,
  MINT_TICKET_SUCCESS,
} from './constants';

export const initialState = {
  createdEvents: [],
  loading: false,
  error: true,
  selectedContract: '',
  openMintTicket: false,
  massMint: false,
  seatNumber: 0,
  price: 0,
  quantity: 0,
};

/* eslint-disable default-case, no-param-reassign */
const manageEventPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_EVENTS:
        draft.loading = true;
        draft.error = false;
        break;
      case LOAD_EVENTS_SUCCESS:
        draft.loading = false;
        draft.error = false;
        draft.createdEvents = action.createdEvents;
        break;
      case CHANGE_SELECTED_CONTRACT:
        draft.selectedContract = action.selectedContract;
        break;
      case CHANGE_OPEN_MINT_TICKET:
        draft.openMintTicket = !draft.openMintTicket;
        break;
      case CHANGE_MASS_MINT:
        draft.massMint = !draft.massMint;
        break;
      case CHANGE_SEAT_NUMBER:
        draft.seatNumber = action.seatNumber;
        break;
      case CHANGE_PRICE:
        draft.price = action.price;
        break;
      case CHANGE_QUANTITY:
        draft.quantity = action.quantity;
        break;
      case MINT_TICKET_SUCCESS:
        draft.openMintTicket = false;
        break;
    }
  });

export default manageEventPageReducer;
