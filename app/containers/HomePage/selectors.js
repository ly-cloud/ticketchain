import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the homePage state domain
 */

const selectHomePageDomain = state => state.homePage || initialState;

const makeSelectLoadAccounts = () =>
  createSelector(
    selectHomePageDomain,
    substate => substate.accounts,
  );

export { selectHomePageDomain, makeSelectLoadAccounts };
