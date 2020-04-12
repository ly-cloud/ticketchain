/*
 *
 * OwnerPage actions
 *
 */

import { toast } from 'react-toastify';
import {
  LOAD_PAGE,
  LOAD_PAGE_SUCCESS,
  LOAD_PAGE_FAILURE,
  CHANGE_COMMISSION,
  SET_COMMISSION,
  SET_COMMISSION_SUCCESS,
  CHANGE_OPEN_WITHDRAW_COMMISSION,
  WITHDRAW_COMMISSION,
  WITHDRAW_COMMISSION_SUCCESS,
} from './constants';

export function loadPage() {
  return {
    type: LOAD_PAGE,
  };
}

export function loadPageSuccess(currCommission, currBalance) {
  return {
    type: LOAD_PAGE_SUCCESS,
    currCommission,
    currBalance,
  };
}

export function loadPageFailure(error) {
  toast.dismiss();
  toast.error(error.message, {
    containerId: 'default',
  });
  return {
    type: LOAD_PAGE_FAILURE,
  };
}

export function changeCommission(commission) {
  return {
    type: CHANGE_COMMISSION,
    commission,
  };
}

export function setCommission() {
  return {
    type: SET_COMMISSION,
  };
}

export function setCommissionSuccess(message) {
  toast.dismiss();
  toast.success(message, {
    containerId: 'default',
  });
  return {
    type: SET_COMMISSION_SUCCESS,
  };
}

export function changeOpenWithdrawCommission() {
  return {
    type: CHANGE_OPEN_WITHDRAW_COMMISSION,
  };
}

export function withdrawCommission() {
  return {
    type: WITHDRAW_COMMISSION,
  };
}

export function withdrawCommissionSuccess(message) {
  toast.dismiss();
  toast.success(message, {
    containerId: 'default',
  });
  return {
    type: WITHDRAW_COMMISSION_SUCCESS,
  };
}
