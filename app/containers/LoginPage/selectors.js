import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the loginPage state domain
 */

const selectLoginPageDomain = state => state.loginPage || initialState;

/**
 * Other specific selectors
 */

const makeSelectEmail = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate.email,
  );

const makeSelectPassword = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate.password,
  );

const makeSelectIsSubmitted = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate.isSubmitted,
  );

const makeSelectErrorText = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate.errorText,
  );

const makeSelectPublicAddress = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate.publicAddress,
  );

const makeSelectNonce = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate.nonce,
  );

const makeSelectSignature = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate.signature,
  );

/**
 * Default selector used by LoginPage
 */

const makeSelectLoginPage = () =>
  createSelector(
    selectLoginPageDomain,
    substate => substate,
  );

export default makeSelectLoginPage;
export {
  selectLoginPageDomain,
  makeSelectEmail,
  makeSelectPassword,
  makeSelectIsSubmitted,
  makeSelectErrorText,
  makeSelectPublicAddress,
  makeSelectNonce,
  makeSelectSignature,
};
