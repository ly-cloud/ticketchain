/**
 *
 * OwnerPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectLoading,
  makeSelectOpenWithdrawCommission,
  makeSelectCurrCommission,
  makeSelectCurrBalance,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  loadPage,
  changeCommission,
  setCommission,
  changeOpenWithdrawCommission,
  withdrawCommission,
} from './actions';

const key = 'ownerPage';
const useStyles = makeStyles(theme => ({
  title: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export function OwnerPage({
  onLoad,
  loading,
  currCommission,
  currBalance,
  onChangeCommission,
  onSetCommission,
  openWithdrawCommission,
  onChangeOpenWithdrawCommission,
  onWithdrawCommission,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useEffect(() => {
    if (window.ethereum.selectedAddress) {
      onLoad();
    } else {
      window.alert('Please install and enable MetaMask to continue.');
    }
  }, []);

  const classes = useStyles();

  return (
    <div>
      <Helmet>
        <title>TicketChain - Owner Page</title>
        <meta name="description" content="TicketChain OwnerPage" />
      </Helmet>
      <CssBaseline />
      <div className={classes.title}>
        <Typography variant="h3">TicketChain Owner</Typography>
      </div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress />
      </Backdrop>
      <Dialog
        open={openWithdrawCommission}
        onClose={() => onChangeOpenWithdrawCommission('')}
      >
        <DialogTitle>Withdraw Commissions</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw all commissions from the contract?
          </DialogContentText>
          <DialogActions>
            <Button
              onClick={() => onChangeOpenWithdrawCommission('')}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onWithdrawCommission()}
              color="primary"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <TextField
              required
              id="commission"
              label="Commission (wei)"
              type="number"
              defaultValue={currCommission}
              onChange={onChangeCommission}
            />
            <Button
              variant="contained"
              onClick={() => onSetCommission()}
              color="primary"
            >
              Set Commission
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="subtitle1">
              Current Balance: {currBalance} ETH
            </Typography>
            <Button
              variant="contained"
              onClick={() => onChangeOpenWithdrawCommission()}
              color="primary"
            >
              Withdraw Balance
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

OwnerPage.propTypes = {
  onLoad: PropTypes.func,
  loading: PropTypes.bool,
  currCommission: PropTypes.string,
  currBalance: PropTypes.string,
  onChangeCommission: PropTypes.func,
  onSetCommission: PropTypes.func,
  openWithdrawCommission: PropTypes.bool,
  onChangeOpenWithdrawCommission: PropTypes.func,
  onWithdrawCommission: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  openWithdrawCommission: makeSelectOpenWithdrawCommission(),
  currCommission: makeSelectCurrCommission(),
  currBalance: makeSelectCurrBalance(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoad: () => dispatch(loadPage()),
    onChangeCommission: evt => dispatch(changeCommission(evt.target.value)),
    onSetCommission: () => dispatch(setCommission()),
    onChangeOpenWithdrawCommission: () =>
      dispatch(changeOpenWithdrawCommission()),
    onWithdrawCommission: () => dispatch(withdrawCommission()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(OwnerPage);
