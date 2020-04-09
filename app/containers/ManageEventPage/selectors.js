import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the manageEventPage state domain
 */

const selectManageEventPageDomain = state =>
  state.manageEventPage || initialState;

/**
 * Other specific selectors
 */

const makeSelectEvents = () =>
  createSelector(
    selectManageEventPageDomain,
    substate => substate.createdEvents,
  );

const makeSelectLoading = () =>
  createSelector(
    selectManageEventPageDomain,
    substate => substate.loading,
  );

const makeSelectSelectedContract = () =>
  createSelector(
    selectManageEventPageDomain,
    substate => substate.selectedContract,
  );

const makeSelectOpenMintTicket = () =>
  createSelector(
    selectManageEventPageDomain,
    substate => substate.openMintTicket,
  );

const makeSelectMassMint = () =>
  createSelector(
    selectManageEventPageDomain,
    substate => substate.massMint,
  );

const makeSelectSeatNumber = () =>
  createSelector(
    selectManageEventPageDomain,
    substate => substate.seatNumber,
  );

const makeSelectPrice = () =>
  createSelector(
    selectManageEventPageDomain,
    substate => substate.price,
  );

const makeSelectQuantity = () =>
  createSelector(
    selectManageEventPageDomain,
    substate => substate.quantity,
  );

export {
  selectManageEventPageDomain,
  makeSelectEvents,
  makeSelectLoading,
  makeSelectSelectedContract,
  makeSelectOpenMintTicket,
  makeSelectMassMint,
  makeSelectSeatNumber,
  makeSelectPrice,
  makeSelectQuantity,
};
