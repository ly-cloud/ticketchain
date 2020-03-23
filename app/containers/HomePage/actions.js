/*
 *
 * HomePage actions
 *
 */

import { LOAD_NETWORKID } from './constants';

export function loadNetworkId(networkId) {
  return {
    type: LOAD_NETWORKID,
    networkId,
  };
}
