/**
 *
 * LoginPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import Web3 from 'web3';
import {
  makeSelectPublicAddress,
  makeSelectSignUpModal,
  makeSelectRole,
} from './selectors';
import { loginMetamask, toggleSignUpModal, signUp } from './actions';
import { loadNetworkId } from '../App/actions';
import { makeSelectLoadNetworkId } from '../App/selectors';
import reducer from './reducer';
import saga from './saga';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '50vh',
    justifyContent: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    textDecoration: 'none',
  },
  metamask: {
    marginBottom: theme.spacing(1),
    width: '80%',
  },
}));

export function LoginPage(props) {
  useEffect(() => {}, []);

  const { signUpModal } = props;
  const {
    onMetamaskLogin,
    onLoadNetworkId,
    onChangeWeb3Provider,
    onToggleSignUpModal,
    onMetamaskSignUp,
  } = props;

  useInjectReducer({ key: 'loginPage', reducer });
  useInjectSaga({ key: 'loginPage', saga });

  const classes = useStyles();

  async function loadWeb3() {
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
  }

  async function onHandleMetamaskLogin() {
    const web3 = await loadWeb3();
    // Get the active address that Metamask is using
    const publicAddress = await web3.eth.getCoinbase();
    onMetamaskLogin(publicAddress);
    // Get networkId
    const networkId = await web3.eth.net.getId();
    onLoadNetworkId(networkId);
  }

  async function onHandleSignUp(role) {
    const web3 = await loadWeb3();
    const publicAddress = await web3.eth.getCoinbase();
    onMetamaskSignUp(publicAddress, role);
  }

  function openCloseSignUpModel() {
    if (signUpModal) {
      onToggleSignUpModal(false);
    } else {
      onToggleSignUpModal(true);
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>TicketChain - Login</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.metamask}
            onClick={onHandleMetamaskLogin}
          >
            Login with Metamask
          </Button>
          <Container onClick={openCloseSignUpModel}>
            {"Don't have an account? Sign Up"}
          </Container>
        </Paper>
        <Dialog
          open={signUpModal}
          onClose={openCloseSignUpModel}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
          <DialogContent>
            <DialogContentText>
              We only accept sign up using MetaMask. Please have a MetaMask
              account and MetaMask browser installed before signing up. Select
              the options below to sign up!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              className={classes.metamask}
              onClick={() => onHandleSignUp('customer')}
            >
              As a Customer
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.metamask}
              onClick={() => onHandleSignUp('event organiser')}
            >
              As an Event Organiser
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </React.Fragment>
  );
}

LoginPage.propTypes = {
  signUpModal: PropTypes.bool,
  onMetamaskLogin: PropTypes.func,
  onLoadNetworkId: PropTypes.func,
  onChangeWeb3Provider: PropTypes.func,
  onToggleSignUpModal: PropTypes.func,
  onMetamaskSignUp: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  publicAddress: makeSelectPublicAddress(),
  networkId: makeSelectLoadNetworkId(),
  signUpModal: makeSelectSignUpModal(),
  role: makeSelectRole(),
});

function mapDispatchToProps(dispatch) {
  return {
    onMetamaskLogin: publicAddress => dispatch(loginMetamask(publicAddress)),
    onLoadNetworkId: networkId => dispatch(loadNetworkId(networkId)),
    onToggleSignUpModal: status => dispatch(toggleSignUpModal(status)),
    onMetamaskSignUp: (publicAddress, role) =>
      dispatch(signUp(publicAddress, role)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LoginPage);
