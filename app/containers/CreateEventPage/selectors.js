import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the createEventPage state domain
 */

const selectCreateEventPageDomain = state =>
  state.createEventPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CreateEventPage
 */

const makeSelectCreateEventPage = () =>
  createSelector(
    selectCreateEventPageDomain,
    substate => substate,
  );

const makeSelectEventName = () =>
  createSelector(
    selectCreateEventPageDomain,
    substate => substate.eventName,
  );

const makeSelectEventDateTime = () =>
  createSelector(
    selectCreateEventPageDomain,
    substate => substate.eventDateTime,
  );

const makeSelectEventVenue = () =>
  createSelector(
    selectCreateEventPageDomain,
    substate => substate.eventVenue,
  );

const makeSelectEventStartSale = () =>
  createSelector(
    selectCreateEventPageDomain,
    substate => substate.eventStartSale,
  );

const makeSelectEventEndSale = () =>
  createSelector(
    selectCreateEventPageDomain,
    substate => substate.eventEndSale,
  );

const makeSelectEventImage = () =>
  createSelector(
    selectCreateEventPageDomain,
    substate => substate.eventImage,
  );

const makeSelectEventDes = () =>
  createSelector(
    selectCreateEventPageDomain,
    substate => substate.eventDes,
  );

export default makeSelectCreateEventPage;
export {
  selectCreateEventPageDomain,
  makeSelectEventName,
  makeSelectEventDateTime,
  makeSelectEventStartSale,
  makeSelectEventEndSale,
  makeSelectEventVenue,
  makeSelectEventImage,
  makeSelectEventDes,
};
