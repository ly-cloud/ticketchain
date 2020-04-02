import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the homePage state domain
 */

const selectHomePageDomain = state => state.homePage || initialState;

const makeSelectEvents = () =>
  createSelector(
    selectHomePageDomain,
    substate => substate.events,
  );

export { selectHomePageDomain, makeSelectEvents };
