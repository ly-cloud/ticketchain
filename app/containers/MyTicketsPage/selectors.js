import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the myTicketsPage state domain
 */

const selectMyTicketsPageDomain = state => state.myTicketsPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MyTicketsPage
 */

const makeSelectTickets = () =>
  createSelector(
    selectMyTicketsPageDomain,
    substate => substate.tickets,
  );

const makeSelectEvents = () =>
  createSelector(
    selectMyTicketsPageDomain,
    substate => substate.events,
  );

export { selectMyTicketsPageDomain, makeSelectTickets, makeSelectEvents };
