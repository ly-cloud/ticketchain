/*
 *
 * HomePage reducer
 *
 */
import produce from 'immer';
import { LOAD_NETWORKID } from './constants';

export const initialState = {
  networkId: null,
};

/* eslint-disable default-case, no-param-reassign */
const homePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_NETWORKID:
        draft.networkId = action.networkId;
        break;
    }
  });

export default homePageReducer;
