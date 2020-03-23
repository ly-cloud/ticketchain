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
} from './constants';

export const initialState = {
  accounts: [],
  networkId: null,
  onWeb3Provider: true,
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
    }
  });

export default appReducer;
