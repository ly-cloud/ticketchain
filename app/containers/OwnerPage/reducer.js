/*
 *
 * OwnerPage reducer
 *
 */
import produce from 'immer';
import {
  LOAD_PAGE,
  LOAD_PAGE_SUCCESS,
  CHANGE_COMMISSION,
  CHANGE_OPEN_WITHDRAW_COMMISSION,
  WITHDRAW_COMMISSION_SUCCESS,
} from './constants';

export const initialState = {
  loading: false,
  currCommission: '',
  currBalance: '',
  commission: '',
  openWithdrawCommission: false,
};

/* eslint-disable default-case, no-param-reassign */
const ownerPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_PAGE:
        draft.loading = true;
        break;
      case LOAD_PAGE_SUCCESS:
        draft.loading = false;
        draft.currCommission = action.currCommission;
        draft.currBalance = action.currBalance;
        break;
      case CHANGE_COMMISSION:
        draft.commission = action.commission;
        break;
      case CHANGE_OPEN_WITHDRAW_COMMISSION:
        draft.openWithdrawCommission = !draft.openWithdrawCommission;
        break;
      case WITHDRAW_COMMISSION_SUCCESS:
        draft.openWithdrawCommission = false;
        break;
    }
  });

export default ownerPageReducer;
