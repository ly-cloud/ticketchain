/*
 *
 * App actions
 *
 */

import {
  LOAD_ACCOUNTS,
  LOAD_NETWORKID,
  CHANGE_ONWEB3PROVIDER,
  LOGIN_METAMASK,
} from './constants';

export function loadAccounts(accounts) {
  return {
    type: LOAD_ACCOUNTS,
    accounts,
  };
}

export function loadNetworkId(networkId) {
  return {
    type: LOAD_NETWORKID,
    networkId,
  };
}

export function changeOnWeb3Provider(onWeb3Provider) {
  return {
    type: CHANGE_ONWEB3PROVIDER,
    onWeb3Provider,
  };
}

export function changePublicAddress(publicAddress) {
  return {
    type: LOGIN_METAMASK,
    publicAddress,
  };
}
