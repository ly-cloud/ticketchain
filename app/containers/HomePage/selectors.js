import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the homePage state domain
 */

const selectHomePageDomain = state => state.homePage || initialState;

const makeSelectLoadNetworkId = () =>
  createSelector(
    selectHomePageDomain,
    substate => substate.networkId,
  );

export { selectHomePageDomain, makeSelectLoadNetworkId };
