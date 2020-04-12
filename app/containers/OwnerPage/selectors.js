import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ownerPage state domain
 */

const selectOwnerPageDomain = state => state.ownerPage || initialState;

/**
 * Other specific selectors
 */

const makeSelectLoading = () =>
  createSelector(
    selectOwnerPageDomain,
    substate => substate.loading,
  );

const makeSelectOpenWithdrawCommission = () =>
  createSelector(
    selectOwnerPageDomain,
    substate => substate.openWithdrawCommission,
  );

const makeSelectCurrCommission = () =>
  createSelector(
    selectOwnerPageDomain,
    substate => substate.currCommission,
  );

const makeSelectCurrBalance = () =>
  createSelector(
    selectOwnerPageDomain,
    substate => substate.currBalance,
  );

const makeSelectCommission = () =>
  createSelector(
    selectOwnerPageDomain,
    substate => substate.commission,
  );

export {
  selectOwnerPageDomain,
  makeSelectLoading,
  makeSelectOpenWithdrawCommission,
  makeSelectCurrCommission,
  makeSelectCurrBalance,
  makeSelectCommission,
};
