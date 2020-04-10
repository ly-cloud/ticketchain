/*
 *
 * LoginPage actions
 *
 */
import { toast } from 'react-toastify';
import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_METAMASK,
  SIGN_MESSAGE,
  HANDLE_AUTHENTICATE,
  TOGGLE_SIGNUP_MODAL,
  SIGNUP,
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

export function loginMetamask() {
  return {
    type: LOGIN_METAMASK,
  };
}

export function signMessage(nonce) {
  return {
    type: SIGN_MESSAGE,
    nonce,
  };
}

export function handleAuthentication(signature) {
  return {
    type: HANDLE_AUTHENTICATE,
    signature,
  };
}

export function toggleSignUpModal(signUpModal) {
  return {
    type: TOGGLE_SIGNUP_MODAL,
    signUpModal,
  };
}

export function signUp(publicAddress, role) {
  return {
    type: SIGNUP,
    publicAddress,
    role,
  };
}
