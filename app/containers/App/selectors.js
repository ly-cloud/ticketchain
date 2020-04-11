import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectRouter = state => state.router;

const selectAppDomain = state => state.app || initialState;

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.location,
  );

const makeSelectAccounts = () =>
  createSelector(
    selectAppDomain,
    substate => substate.accounts,
  );

const makeSelectNetworkId = () =>
  createSelector(
    selectAppDomain,
    substate => substate.networkId,
  );

const makeSelectOnWeb3Provider = () =>
  createSelector(
    selectAppDomain,
    substate => substate.onWeb3Provider,
  );

const makeSelectSidebarOpen = () =>
  createSelector(
    selectAppDomain,
    substate => substate.sidebarOpen,
  );

export {
  makeSelectLocation,
  makeSelectAccounts,
  makeSelectNetworkId,
  makeSelectOnWeb3Provider,
  makeSelectSidebarOpen,
};
