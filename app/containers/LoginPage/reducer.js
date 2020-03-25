/*
 *
 * LoginPage reducer
 *
 */
import produce from 'immer';
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
  HANDLE_AUTHENTICATE,
} from './constants';

export const initialState = {
  email: '',
  password: '',
  isSubmitted: false,
  errorText: '',
  publicAddress: '',
  nonce: '',
  signature: '',
};

/* eslint-disable default-case, no-param-reassign */
const loginPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_EMAIL:
        draft.email = action.email;
        break;
      case CHANGE_PASSWORD:
        draft.password = action.password;
        break;
      case CHANGE_ISSUBMITTED:
        draft.isSubmitted = action.isSubmitted;
        break;
      case CHANGE_ERRORTEXT:
        draft.errorText = action.errorText;
        break;
      case LOGIN:
        break;
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
    }
  });

export default loginPageReducer;
