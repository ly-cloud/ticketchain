/*
 *
 * HomePage actions
 *
 */

import { LOAD_ACCOUNTS } from './constants';

export function loadAccounts(accounts) {
  return {
    type: LOAD_ACCOUNTS,
    accounts,
  };
}
