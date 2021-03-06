/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_ACCOUNTS = 'app/App/LOAD_ACCOUNTS';
export const LOAD_NETWORKID = 'app/App/LOAD_NETWORKID';
export const CHANGE_OWNER = 'app/App/CHANGE_OWNER';
export const CHANGE_ONWEB3PROVIDER = 'app/App/CHANGE_ONWEB3PROVIDER';
export const CHANGE_SIDEBAR_OPEN = 'app/App/CHANGE_SIDEBAR_OPEN';
export const LOGIN_METAMASK = 'app/App/LOGIN_METAMASK';
export const LOGIN_SUCCESS = 'app/App/LOGIN_SUCCESS';
export const LOGIN_ERROR = 'app/App/LOGIN_ERROR';
export const COPY_SUCCESS = 'app/App/COPY_SUCCESS';
