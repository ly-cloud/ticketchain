/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import Web3 from 'web3';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// Use custom css file for react-toastify instead to modify the toast's positions
import './styles.css';
import { makeStyles } from '@material-ui/core/styles';
import { useInjectReducer } from 'utils/injectReducer';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import HomePage from 'containers/HomePage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';

import reducer from './reducer';

// Import ABIs
// import TicketChain from '../../../build/contracts/TicketChain.json';

import GlobalStyle from '../../global-styles';
import { makeSelectLoadAccounts } from './selectors';
import { loadAccounts } from './actions';

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

const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      'Non-Ethereum browser detected. You should consider trying MetaMask!',
    );
  }
};

export function App(props) {
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    const { web3 } = window;
    // Load account
    const accounts = await web3.eth.getAccounts();
    onLoadAccounts(accounts);
  };

  // Event that notifies whenever the account/address in metamask change
  window.ethereum.on('accountsChanged', accounts => {
    onLoadAccounts(accounts);
  });

  const { accounts } = props;
  const { onLoadAccounts } = props;

  useInjectReducer({ key: 'app', reducer });

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Header account={accounts[0]} />
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
          <Route exact path="/login" component={LoginPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
      <GlobalStyle />
      <Footer />
    </div>
  );
}

App.propTypes = {
  accounts: PropTypes.arrayOf(String),
  onLoadAccounts: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  accounts: makeSelectLoadAccounts(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadAccounts: accounts => dispatch(loadAccounts(accounts)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(App);
