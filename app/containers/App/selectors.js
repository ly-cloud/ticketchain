import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectRouter = state => state.router;

const selectAppDomain = state => state.app || initialState;

const makeSelectLocation = () =>
  createSelector(
    selectRouter,
    routerState => routerState.location,
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

export { makeSelectLocation, makeSelectNetworkId, makeSelectOnWeb3Provider };
