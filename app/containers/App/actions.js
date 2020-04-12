/*
 *
 * App actions
 *
 */
import { toast } from 'react-toastify';
import {
  LOAD_ACCOUNTS,
  LOAD_NETWORKID,
  CHANGE_OWNER,
  CHANGE_ONWEB3PROVIDER,
  CHANGE_SIDEBAR_OPEN,
  LOGIN_METAMASK,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  COPY_SUCCESS,
} from './constants';

let loginToastId = null;
let copySuccessId = null;

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

export function changeOwner(owner) {
  return {
    type: CHANGE_OWNER,
    owner,
  };
}

export function changeOnWeb3Provider(onWeb3Provider) {
  return {
    type: CHANGE_ONWEB3PROVIDER,
    onWeb3Provider,
  };
}

export function changeSidebarOpen(sidebarOpen) {
  return {
    type: CHANGE_SIDEBAR_OPEN,
    sidebarOpen,
  };
}

export function loginMetamask() {
  return {
    type: LOGIN_METAMASK,
  };
}

export function copySuccess() {
  toast.dismiss(copySuccessId);
  copySuccessId = null;
  toast.success('Address copied to clipboard!', {
    containerId: 'default',
  });
  return {
    type: COPY_SUCCESS,
  };
}
