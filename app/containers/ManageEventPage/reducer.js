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
  CHANGE_OPEN_LIST_TICKETS,
  LIST_TICKETS_SUCCESS,
  CHANGE_OPEN_WITHDRAW_EARNINGS,
  WITHDRAW_EARNINGS_SUCCESS,
} from './constants';

export const initialState = {
  createdEvents: [],
  loading: false,
  selectedContract: '',
  // Mint Ticket
  openMintTicket: false,
  massMint: false,
  seatNumber: '',
  price: 0,
  quantity: 0,
  // List Tickets
  openListTickets: false,
  // Withdraw Earnings
  openWithdrawEarnings: false,
};

/* eslint-disable default-case, no-param-reassign */
const manageEventPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_EVENTS:
        draft.loading = true;
        break;
      case LOAD_EVENTS_SUCCESS:
        draft.loading = false;
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
      case CHANGE_OPEN_LIST_TICKETS:
        draft.openListTickets = !draft.openListTickets;
        break;
      case LIST_TICKETS_SUCCESS:
        draft.openListTickets = false;
        break;
      case CHANGE_OPEN_WITHDRAW_EARNINGS:
        draft.openWithdrawEarnings = !draft.openWithdrawEarnings;
        break;
      case WITHDRAW_EARNINGS_SUCCESS:
        draft.openWithdrawEarnings = false;
        break;
    }
  });

export default manageEventPageReducer;
