/*
 *
 * App reducer
 *
 */
import produce from 'immer';
import {
  LOAD_ACCOUNTS,
  LOAD_NETWORKID,
  CHANGE_ONWEB3PROVIDER,
  LOGIN_METAMASK,
} from './constants';

export const initialState = {
  accounts: [],
  networkId: 0,
  onWeb3Provider: true,
  publicAddress: '',
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_ACCOUNTS:
        draft.accounts = action.accounts;
        break;
      case LOAD_NETWORKID:
        draft.networkId = action.networkId;
        break;
      case CHANGE_ONWEB3PROVIDER:
        draft.onWeb3Provider = action.onWeb3Provider;
        break;
      case LOGIN_METAMASK:
        draft.publicAddress = action.publicAddress;
    }
  });

export default appReducer;
