import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the homePage state domain
 */

const selectHomePageDomain = state => state.homePage || initialState;

const makeSelectTicketChainAddress = () =>
  createSelector(
    selectHomePageDomain,
    substate => substate.ticketChainAddress,
  );

const makeSelectEventId = () =>
  createSelector(
    selectHomePageDomain,
    substate => substate.eventId,
  );

const makeSelectEvents = () =>
  createSelector(
    selectHomePageDomain,
    substate => substate.events,
  );

export {
  selectHomePageDomain,
  makeSelectTicketChainAddress,
  makeSelectEventId,
  makeSelectEvents,
};
