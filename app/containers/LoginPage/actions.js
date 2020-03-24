/*
 *
 * LoginPage actions
 *
 */
import React from 'react';
import { toast } from 'react-toastify';
import LoadingToast from 'components/LoadingToast';
import {
  CHANGE_EMAIL,
  CHANGE_PASSWORD,
  CHANGE_ISSUBMITTED,
  CHANGE_ERRORTEXT,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_METAMASK,
  SIGN_MESSAGE,
} from './constants';
let loginToastId = null;

export function changeEmail(email) {
  return {
    type: CHANGE_EMAIL,
    email,
  };
}

export function changePassword(password) {
  return {
    type: CHANGE_PASSWORD,
    password,
  };
}

export function changeIsSubmitted(isSubmitted) {
  return {
    type: CHANGE_ISSUBMITTED,
    isSubmitted,
  };
}

export function changeErrorText(errorText) {
  return {
    type: CHANGE_ERRORTEXT,
    errorText,
  };
}

export function login() {
  loginToastId = toast(<LoadingToast message="Logging in..." />, {
    containerId: 'loading',
    type: toast.TYPE.INFO,
  });
  return {
    type: LOGIN,
  };
}

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

export function loginMetamask(publicAddress) {
  return {
    type: LOGIN_METAMASK,
    publicAddress,
  };
}

export function signMessage(nonce) {
  return {
    type: SIGN_MESSAGE,
    nonce,
  };
}

export function handleAuthentication() {}
