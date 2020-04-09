/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// Use custom css file for react-toastify instead to modify the toast's positions
import './styles.css';
import { makeStyles } from '@material-ui/core/styles';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Web3 from 'web3';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import ManageEventPage from 'containers/ManageEventPage/Loadable';
import CreateEventPage from 'containers/CreateEventPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import ConnectionBanner from '@rimble/connection-banner';

import reducer from './reducer';
import saga from './saga';
// Import ABIs
// import TicketChain from '../../../build/contracts/TicketChain.json';

import GlobalStyle from '../../global-styles';
import {
  makeSelectAccounts,
  makeSelectNetworkId,
  makeSelectOnWeb3Provider,
} from './selectors';
import {
  loadNetworkId,
  loadAccounts,
  changeOnWeb3Provider,
  changePublicAddress,
} from './actions';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
  },
}));

export function App(props) {
  useEffect(() => {
    checkMetamaskSupport();
  }, []);

  const { networkId, accounts, onWeb3Provider } = props;
  const {
    onLoadNetworkId,
    onLoadAccounts,
    onChangeWeb3Provider,
    onMetamaskLogin,
  } = props;

  // Check if user has Metamask on browsr
  const checkMetamaskSupport = async () => {
    if (typeof web3 === 'undefined') {
      onChangeWeb3Provider(false);
    } else {
      onChangeWeb3Provider(true);
      if (window.ethereum) {
        let { web3 } = window;
        web3 = new Web3(window.ethereum);
        const currentNetworkId = await web3.eth.net.getId();
        onLoadNetworkId(currentNetworkId);
        const currentAccounts = await web3.eth.getAccounts();
        onLoadAccounts(currentAccounts);
      }
    }
  };

  // Handle Metamask Login
  const onHandleMetamaskLogin = async () => {
    const web3 = await loadWeb3();
    // Get the active address that Metamask is using
    const publicAddress = await web3.eth.getCoinbase();
    onMetamaskLogin(publicAddress);
    // Get networkId
    const currentNetworkId = await web3.eth.net.getId();
    onLoadNetworkId(currentNetworkId);
  };

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = await new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = await new Web3(window.web3.currentProvider);
    } else {
      onChangeWeb3Provider(false);
    }
    const { web3 } = window;
    return web3;
  };

  // const loadWeb3 = async () => {
  //   console.log(web3)
  //   if (window.ethereum) {
  //     window.web3 = new Web3(window.ethereum);
  //     console.log('eth');
  //     await window.ethereum.enable();
  //   } else if (window.web3) {
  //     window.web3 = new Web3(window.web3.currentProvider);
  //   } else {
  //     onChangeWeb3Provider(false);
  //     // window.alert(
  //     //   'Non-Ethereum browser detected. You should consider trying MetaMask!',
  //     // );
  //   }
  // };

  // Event that notifies whenever the account/address in metamask change
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', newAccounts => {
      onLoadAccounts(newAccounts);
    });
  }

  useInjectReducer({ key: 'app', reducer });
  useInjectSaga({ key: 'app', saga });

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Header
        account={accounts[0]}
        onHandleMetamaskLogin={onHandleMetamaskLogin}
      />
      <ConnectionBanner
        currentNetwork={networkId}
        requiredNetwork={5777}
        onWeb3Fallback={!onWeb3Provider} //	True to display install metamask message
      />
      <ToastContainer
        enableMultiContainer
        containerId="default"
        position="top-right"
      />
      <ToastContainer
        enableMultiContainer
        containerId="manualClose"
        position="top-right"
        autoClose={false}
      />
      <ToastContainer
        enableMultiContainer
        containerId="loading"
        position="top-center"
        autoClose={false}
        draggable={false}
        closeButton={false}
        closeOnClick={false}
      />
      <div className={classes.main}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/manageEvent" component={ManageEventPage} />
          <Route exact path="/createEvent" component={CreateEventPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
      <GlobalStyle />
      <Footer />
    </div>
  );
}

App.propTypes = {
  networkId: PropTypes.number,
  accounts: PropTypes.arrayOf(String),
  onWeb3Provider: PropTypes.bool,
  onLoadAccounts: PropTypes.func,
  onLoadNetworkId: PropTypes.func,
  onChangeWeb3Provider: PropTypes.func,
  onMetamaskLogin: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  networkId: makeSelectNetworkId(),
  accounts: makeSelectAccounts(),
  onWeb3Provider: makeSelectOnWeb3Provider(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadAccounts: accounts => dispatch(loadAccounts(accounts)),
    onLoadNetworkId: networkId => dispatch(loadNetworkId(networkId)),
    onChangeWeb3Provider: onWeb3Provider =>
      dispatch(changeOnWeb3Provider(onWeb3Provider)),
    onMetamaskLogin: publicAddress =>
      dispatch(changePublicAddress(publicAddress)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(App);
