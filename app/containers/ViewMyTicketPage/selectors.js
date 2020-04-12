import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the viewMyTicketPage state domain
 */

const selectViewMyTicketPageDomain = state =>
  state.viewMyTicketPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ViewMyTicketPage
 */

const makeSelectEventId = () =>
  createSelector(
    selectViewMyTicketPageDomain,
    substate => substate.eventId,
  );

const makeSelectTickets = () =>
  createSelector(
    selectViewMyTicketPageDomain,
    substate => substate.tickets,
  );

const makeSelectListModal = () =>
  createSelector(
    selectViewMyTicketPageDomain,
    substate => substate.listModal,
  );

const makeSelectPrice = () =>
  createSelector(
    selectViewMyTicketPageDomain,
    substate => substate.price,
  );

const makeSelectListedTicket = () =>
  createSelector(
    selectViewMyTicketPageDomain,
    substate => substate.ticketListed,
  );

export {
  selectViewMyTicketPageDomain,
  makeSelectEventId,
  makeSelectTickets,
  makeSelectListModal,
  makeSelectPrice,
  makeSelectListedTicket,
};
