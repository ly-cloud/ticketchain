/*
 *
 * HomePage reducer
 *
 */
import produce from 'immer';
import { EMPTY_EVENTS_ARRAY, PUSH_EVENT } from './constants';

export const initialState = {
  events: [],
};

/* eslint-disable default-case, no-param-reassign */
const homePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case EMPTY_EVENTS_ARRAY:
        draft.events = [];
        break;
      case PUSH_EVENT:
        draft.events.push(action.event);
        break;
    }
  });

export default homePageReducer;
