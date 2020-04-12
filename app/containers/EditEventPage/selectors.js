import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the editEventPage state domain
 */

const selectEditEventPageDomain = state => state.editEventPage || initialState;

const makeSelectAddress = () =>
  createSelector(
    selectEditEventPageDomain,
    substate => substate.address,
  );

const makeSelectName = () =>
  createSelector(
    selectEditEventPageDomain,
    substate => substate.name,
  );

const makeSelectDescription = () =>
  createSelector(
    selectEditEventPageDomain,
    substate => substate.description,
  );

const makeSelectImageUrl = () =>
  createSelector(
    selectEditEventPageDomain,
    substate => substate.imageUrl,
  );

const makeSelectDateTime = () =>
  createSelector(
    selectEditEventPageDomain,
    substate => substate.dateTime,
  );

const makeSelectVenue = () =>
  createSelector(
    selectEditEventPageDomain,
    substate => substate.venue,
  );

const makeSelectOpeningSaleTime = () =>
  createSelector(
    selectEditEventPageDomain,
    substate => substate.openingSaleTime,
  );

const makeSelectClosingSaleTime = () =>
  createSelector(
    selectEditEventPageDomain,
    substate => substate.closingSaleTime,
  );

const makeSelectIsListed = () =>
  createSelector(
    selectEditEventPageDomain,
    substate => substate.isListed,
  );

const makeSelectInitialEvent = () =>
  createSelector(
    selectEditEventPageDomain,
    substate => substate.initialEvent,
  );

export {
  selectEditEventPageDomain,
  makeSelectAddress,
  makeSelectName,
  makeSelectDescription,
  makeSelectImageUrl,
  makeSelectDateTime,
  makeSelectVenue,
  makeSelectOpeningSaleTime,
  makeSelectClosingSaleTime,
  makeSelectIsListed,
  makeSelectInitialEvent,
};
