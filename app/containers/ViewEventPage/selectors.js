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

export {
  selectViewEventPageDomain,
  makeSelectAddress,
  makeSelectName,
  makeSelectDescription,
  makeSelectImageUrl,
  makeSelectDateTime,
  makeSelectVenue,
  makeSelectOpeningSaleTime,
  makeSelectClosingSaleTime,
  makeSelectTickets,
};
