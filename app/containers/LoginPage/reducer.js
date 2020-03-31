/*
 *
 * LoginPage reducer
 *
 */
import produce from 'immer';
import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN_METAMASK,
  SIGN_MESSAGE,
  HANDLE_AUTHENTICATE,
  TOGGLE_SIGNUP_MODAL,
  SIGNUP,
} from './constants';

export const initialState = {
  publicAddress: '',
  nonce: '',
  signature: '',
  signUpModal: false,
  role: '',
};

/* eslint-disable default-case, no-param-reassign */
const loginPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOGIN_SUCCESS:
        draft.name = '';
        draft.email = '';
        draft.isSubmitted = false;
        break;
      case LOGIN_ERROR:
        break;
      case LOGIN_METAMASK:
        draft.publicAddress = action.publicAddress;
        break;
      case SIGN_MESSAGE:
        draft.nonce = action.nonce;
        break;
      case HANDLE_AUTHENTICATE:
        draft.signature = action.signature;
        break;
      case TOGGLE_SIGNUP_MODAL:
        draft.signUpModal = action.signUpModal;
        break;
      case SIGNUP:
        draft.publicAddress = action.publicAddress;
        draft.role = action.role;
        break;
    }
  });

export default loginPageReducer;
