/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import clsx from 'clsx';
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
import EditEventPage from 'containers/EditEventPage/Loadable';
import ViewEventPage from 'containers/ViewEventPage/Loadable';
import MyTicketsPage from 'containers/MyTicketsPage/Loadable';
import ViewMyTicketPage from 'containers/ViewMyTicketPage/Loadable';
import OwnerPage from 'containers/OwnerPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Sidebar from 'components/Sidebar';
import ConnectionBanner from '@rimble/connection-banner';

import reducer from './reducer';
import saga from './saga';
// Import ABIs
import TicketChain from '../../../build/contracts/TicketChain.json';

import GlobalStyle from '../../global-styles';
import {
  makeSelectAccounts,
  makeSelectNetworkId,
  makeSelectOwner,
  makeSelectOnWeb3Provider,
  makeSelectSidebarOpen,
} from './selectors';
import {
  loadNetworkId,
  loadAccounts,
  changeOnWeb3Provider,
  changeSidebarOpen,
  copySuccess,
  changeOwner,
} from './actions';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
}));

export function App(props) {
  useInjectReducer({ key: 'app', reducer });
  useInjectSaga({ key: 'app', saga });

  useEffect(() => {
    checkMetamaskSupport();
  }, []);

  const { networkId, accounts, owner, onWeb3Provider, sidebarOpen } = props;
  const {
    onLoadNetworkId,
    onLoadAccounts,
    onChangeOwner,
    onChangeWeb3Provider,
    onChangeSidebarOpen,
    onCopySuccess,
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
        const networkData = TicketChain.networks[currentNetworkId];
        if (networkData) {
          // Retrieve instance of TicketChain contract
          const ticketChainInstance = new web3.eth.Contract(
            TicketChain.abi,
            networkData.address,
          );

          // Retrieve TicketChain Owner's address
          const ownerAddress = await ticketChainInstance.methods.OWNER().call();

          // Save TicketChain Owner's address in store
          onChangeOwner(ownerAddress);
        } else {
          // window.alert('TicketChain contract not deployed to detected network.');
        }
      }
    }
  };

  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      let { web3 } = window;
      web3 = new Web3(window.ethereum);
      const currentNetworkId = await web3.eth.net.getId();
      onLoadNetworkId(currentNetworkId);
      const currentAccounts = await web3.eth.getAccounts();
      onLoadAccounts(currentAccounts);
      const networkData = TicketChain.networks[networkId];
      if (networkData) {
        // Retrieve instance of TicketChain contract
        const ticketChainInstance = new web3.eth.Contract(
          TicketChain.abi,
          networkData.address,
        );

        // Retrieve TicketChain Owner's address
        const ownerAddress = await ticketChainInstance.methods.OWNER().call();

        // Save TicketChain Owner's address in store
        onChangeOwner(ownerAddress);
      } else {
        // window.alert('TicketChain contract not deployed to detected network.');
      }
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
      if (newAccounts.length > 0) {
        const accountConverted = Web3.utils.toChecksumAddress(newAccounts[0]);
        onLoadAccounts([accountConverted]);
      } else {
        onLoadAccounts([]);
      }
    });
  }

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Sidebar
        account={accounts[0]}
        owner={owner}
        sidebarOpen={sidebarOpen}
        onChangeSidebarOpen={onChangeSidebarOpen}
      />
      <Header
        account={accounts[0]}
        sidebarOpen={sidebarOpen}
        onHandleMetamaskLogin={loadWeb3}
        onChangeSidebarOpen={onChangeSidebarOpen}
        onCopySuccess={onCopySuccess}
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
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: sidebarOpen,
        })}
      >
        <ConnectionBanner
          currentNetwork={networkId}
          requiredNetwork={5777}
          onWeb3Fallback={!onWeb3Provider} //	True to display install metamask message
        />
        <Switch>
          <Route exact path="/" component={HomePage} />
          {accounts.length > 0 && accounts[0] === owner && (
            <Route exact path="/owner" component={OwnerPage} />
          )}
          <Route exact path="/manageEvent" component={ManageEventPage} />
          <Route exact path="/createEvent" component={CreateEventPage} />
          <Route exact path="/myTickets" component={MyTicketsPage} />
          <Route
            exact
            path="/myTickets/:eventId"
            component={ViewMyTicketPage}
          />
          <Route exact path="/event/:eventId" component={ViewEventPage} />
          {accounts.length > 0 && (
            <Route exact path="/manageEvent" component={ManageEventPage} />
          )}
          {accounts.length > 0 && (
            <Route exact path="/createEvent" component={CreateEventPage} />
          )}
          {accounts.length > 0 && (
            <Route exact path="/editEvent/:eventId" component={EditEventPage} />
          )}
          {accounts.length > 0 && (
            <Route exact path="/myTickets" component={MyTicketsPage} />
          )}
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
  owner: PropTypes.string,
  onWeb3Provider: PropTypes.bool,
  sidebarOpen: PropTypes.bool,
  onLoadAccounts: PropTypes.func,
  onLoadNetworkId: PropTypes.func,
  onChangeOwner: PropTypes.func,
  onChangeWeb3Provider: PropTypes.func,
  onChangeSidebarOpen: PropTypes.func,
  onCopySuccess: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  networkId: makeSelectNetworkId(),
  accounts: makeSelectAccounts(),
  owner: makeSelectOwner(),
  onWeb3Provider: makeSelectOnWeb3Provider(),
  sidebarOpen: makeSelectSidebarOpen(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadAccounts: accounts => dispatch(loadAccounts(accounts)),
    onLoadNetworkId: networkId => dispatch(loadNetworkId(networkId)),
    onChangeOwner: owner => dispatch(changeOwner(owner)),
    onChangeWeb3Provider: onWeb3Provider =>
      dispatch(changeOnWeb3Provider(onWeb3Provider)),
    onChangeSidebarOpen: sidebarOpen => {
      dispatch(changeSidebarOpen(sidebarOpen));
    },
    onCopySuccess: () => {
      dispatch(copySuccess());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(App);
