import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectRouter = state => state.router;

const selectAppDomain = state => state.app || initialState;

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.location,
  );

const makeSelectLoadAccounts = () =>
  createSelector(
    selectAppDomain,
    substate => substate.accounts,
  );

export { makeSelectLocation, makeSelectLoadAccounts };
