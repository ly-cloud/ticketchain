/*
 *
 * App reducer
 *
 */
import produce from 'immer';
import {
  LOAD_ACCOUNTS,
  LOAD_NETWORKID,
  CHANGE_OWNER,
  CHANGE_ONWEB3PROVIDER,
  CHANGE_SIDEBAR_OPEN,
} from './constants';

export const initialState = {
  accounts: [],
  networkId: 0,
  onWeb3Provider: true,
  sidebarOpen: false,
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
      case CHANGE_OWNER:
        draft.owner = action.owner;
        break;
      case CHANGE_ONWEB3PROVIDER:
        draft.onWeb3Provider = action.onWeb3Provider;
        break;
      case CHANGE_SIDEBAR_OPEN:
        draft.sidebarOpen = action.sidebarOpen;
        break;
    }
  });

export default appReducer;
