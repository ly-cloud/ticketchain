/*
 *
 * App reducer
 *
 */
import produce from 'immer';
import { LOAD_ACCOUNTS } from './constants';

export const initialState = {
  accounts: [],
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_ACCOUNTS:
        draft.accounts = action.accounts;
        break;
    }
  });

export default appReducer;
