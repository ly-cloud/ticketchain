/*
 *
 * App actions
 *
 */
import { toast } from 'react-toastify';
import {
  LOAD_ACCOUNTS,
  LOAD_NETWORKID,
  CHANGE_ONWEB3PROVIDER,
  LOGIN_METAMASK,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from './constants';

let loginToastId = null;

export function loginSuccess(res) {
  toast.dismiss(loginToastId);
  loginToastId = null;
  toast.success(res.message, {
    containerId: 'default',
  });
  return {
    type: LOGIN_SUCCESS,
  };
}

export function loginError(error) {
  toast.dismiss(loginToastId);
  loginToastId = null;
  toast.error(error.message, {
    containerId: 'default',
  });
  return {
    type: LOGIN_ERROR,
    error,
  };
}

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

export function loginMetamask() {
  return {
    type: LOGIN_METAMASK,
  };
}
