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

const makeSelectEventId = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.eventId,
  );

const makeSelectName = () =>
  createSelector(
    selectViewEventPageDomain,
    substate => substate.name,
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

export {
  selectViewEventPageDomain,
  makeSelectEventId,
  makeSelectName,
  makeSelectDateTime,
  makeSelectVenue,
  makeSelectOpeningSaleTime,
  makeSelectClosingSaleTime,
  makeSelectTickets,
};
