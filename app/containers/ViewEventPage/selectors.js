import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the viewEventPage state domain
 */

const selectViewEventPageDomain = state => state.viewEventPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ViewEventPage
 */

const makeSelectAddress = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.address,
  );

const makeSelectTicketChainAddress = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.ticketChainAddress,
  );

const makeSelectName = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.name,
  );

const makeSelectDescription = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.description,
  );

const makeSelectImageUrl = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.imageUrl,
  );

const makeSelectDateTime = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.dateTime,
  );

const makeSelectVenue = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.venue,
  );

const makeSelectOpeningSaleTime = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.openingSaleTime,
  );

const makeSelectClosingSaleTime = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.closingSaleTime,
  );

const makeSelectTickets = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.tickets,
  );

const makeSelectTicket = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.ticket,
  );

const makeSelectEventId = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.eventId,
  );

const makeSelectModalIsOpen = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.modalIsOpen,
  );

const makeSelectTransactionFee = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.transactionFee,
  );

export {
  selectViewEventPageDomain,
  makeSelectAddress,
  makeSelectTicketChainAddress,
  makeSelectName,
  makeSelectDescription,
  makeSelectImageUrl,
  makeSelectDateTime,
  makeSelectVenue,
  makeSelectOpeningSaleTime,
  makeSelectClosingSaleTime,
  makeSelectTickets,
  makeSelectTicket,
  makeSelectEventId,
  makeSelectModalIsOpen,
  makeSelectTransactionFee,
};
