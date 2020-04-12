/**
 *
 * ManageEventPage
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Link } from 'react-router-dom';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { makeSelectAccounts } from '../App/selectors';
import {
  makeSelectEvents,
  makeSelectLoading,
  makeSelectMassMint,
  makeSelectOpenMintTicket,
  makeSelectOpenListTickets,
  makeSelectOpenWithdrawEarnings,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  loadEvents,
  changeSelectedContract,
  changeOpenMintTicket,
  changeMassMint,
  changeSeatNumber,
  changePrice,
  changeQuantity,
  mintTicket,
  changeOpenListTickets,
  listTickets,
  changeOpenWithdrawEarnings,
  withdrawEarnings,
} from './actions';

const key = 'manageEventPage';
const useStyles = makeStyles(theme => ({
  title: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export function ManageEventPage({
  loading,
  createdEvents,
  onLoad,
  accounts,
  massMint,
  openMintTicket,
  onChangeOpenMintTicket,
  onChangeMassMint,
  onChangeSeatNumber,
  onChangePrice,
  onChangeQuantity,
  onMintTicket,
  openListTickets,
  onChangeOpenListTickets,
  onListTickets,
  openWithdrawEarnings,
  onChangeOpenWithdrawEarnings,
  onWithdrawEarnings,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  useEffect(() => {
    if (window.ethereum.selectedAddress) {
      onLoad();
      window.ethereum.on('accountsChanged', () => {
        onLoad();
      });
    } else {
      window.alert('Please install and enable MetaMask to continue.');
    }
  }, []);

  const classes = useStyles();

  return (
    <div>
      <Helmet>
        <title>TicketChain - Manage Events</title>
        <meta name="description" content="TicketChain ManageEventPage" />
      </Helmet>
      <CssBaseline />
      <div className={classes.title}>
        <Typography variant="h3">Manage Events</Typography>
        <Chip
          label={
            <Typography variant="body2">
              You are viewing events created on this address: {accounts[0]}
            </Typography>
          }
        />
      </div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress />
      </Backdrop>
      <Dialog open={openMintTicket} onClose={() => onChangeOpenMintTicket('')}>
        <DialogTitle>Mint Ticket</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={massMint}
                onChange={onChangeMassMint}
                name="massMint"
                color="primary"
              />
            }
            label="Mass Mint"
          />
          {massMint && (
            <Typography variant="body2">
              Tickets will be minted with running seat numbers.
            </Typography>
          )}
          <TextField
            margin="dense"
            id="seatNumber"
            label="Seat Number"
            type="number"
            fullWidth
            onChange={onChangeSeatNumber}
          />
          <TextField
            margin="dense"
            id="price"
            label="Price (wei)"
            type="number"
            fullWidth
            onChange={onChangePrice}
          />
          {massMint && (
            <TextField
              margin="dense"
              id="quantity"
              label="Quantity"
              type="number"
              fullWidth
              onChange={onChangeQuantity}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onMintTicket()} color="primary">
            Mint
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openListTickets}
        onClose={() => onChangeOpenListTickets('')}
      >
        <DialogTitle>List Tickets</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will list all your minted tickets onto the TicketChain market,
            you will not be able to mint more ticket after this operation.
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => onChangeOpenListTickets('')} color="primary">
              Cancel
            </Button>
            <Button onClick={() => onListTickets()} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openWithdrawEarnings}
        onClose={() => onChangeOpenWithdrawEarnings('')}
      >
        <DialogTitle>Withdraw Earnings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw the ether balance from this
            contract?
          </DialogContentText>
          <DialogActions>
            <Button
              onClick={() => onChangeOpenWithdrawEarnings('')}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onWithdrawEarnings()}
              color="primary"
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {createdEvents.map(event => (
            <Grid item key={event.eventId} xs={12} sm={6} md={6}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={event.imageUrl}
                  title={event.eventName}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {event.eventName}
                  </Typography>
                  <Typography gutterBottom variant="subtitle1" component="h2">
                    {new Date(event.eventDateTime * 1000).toLocaleString(
                      'en-SG',
                      {
                        dateStyle: 'full',
                        timeStyle: 'short',
                        hour12: true,
                      },
                    )}
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    {event.venue}
                  </Typography>
                  <Typography gutterBottom variant="caption">
                    {event.description}
                  </Typography>
                  <Typography variant="subtitle1">
                    Current Balance: {event.balance} eth
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    style={{ textAlign: 'center' }}
                    component={Link}
                    to={`/editEvent/${event.eventId}`}
                  >
                    Edit Event
                  </Button>
                  <Button
                    disabled={event.isListed}
                    size="small"
                    color="primary"
                    onClick={() => onChangeOpenMintTicket(event.address)}
                  >
                    Mint Tickets
                  </Button>
                  <Button
                    disabled={event.isListed}
                    size="small"
                    color="primary"
                    onClick={() => onChangeOpenListTickets(event.address)}
                  >
                    List Tickets
                  </Button>
                  <Button
                    disabled={!event.isListed}
                    size="small"
                    color="primary"
                    onClick={() => onChangeOpenWithdrawEarnings(event.address)}
                  >
                    Withdraw Earnings
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

ManageEventPage.propTypes = {
  loading: PropTypes.bool,
  createdEvents: PropTypes.arrayOf(PropTypes.object),
  accounts: PropTypes.arrayOf(PropTypes.string),
  onLoad: PropTypes.func,
  // Mint Ticket
  openMintTicket: PropTypes.bool,
  massMint: PropTypes.bool,
  onChangeOpenMintTicket: PropTypes.func,
  onChangeMassMint: PropTypes.func,
  onChangeSeatNumber: PropTypes.func,
  onChangePrice: PropTypes.func,
  onChangeQuantity: PropTypes.func,
  onMintTicket: PropTypes.func,
  // List Tickets
  openListTickets: PropTypes.bool,
  onChangeOpenListTickets: PropTypes.func,
  onListTickets: PropTypes.func,
  // Withdraw Earnings
  openWithdrawEarnings: PropTypes.bool,
  onChangeOpenWithdrawEarnings: PropTypes.func,
  onWithdrawEarnings: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  createdEvents: makeSelectEvents(),
  accounts: makeSelectAccounts(),
  openMintTicket: makeSelectOpenMintTicket(),
  massMint: makeSelectMassMint(),
  openListTickets: makeSelectOpenListTickets(),
  openWithdrawEarnings: makeSelectOpenWithdrawEarnings(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoad: () => dispatch(loadEvents()),
    onChangeOpenMintTicket: address => {
      dispatch(changeSelectedContract(address));
      dispatch(changeOpenMintTicket());
    },
    onChangeMassMint: () => dispatch(changeMassMint()),
    onChangeSeatNumber: evt =>
      dispatch(changeSeatNumber(parseInt(evt.target.value, 10))),
    onChangePrice: evt => dispatch(changePrice(evt.target.value)),
    onChangeQuantity: evt =>
      dispatch(changeQuantity(parseInt(evt.target.value, 10))),
    onMintTicket: () => dispatch(mintTicket()),
    onChangeOpenListTickets: address => {
      dispatch(changeSelectedContract(address));
      dispatch(changeOpenListTickets());
    },
    onListTickets: () => dispatch(listTickets()),
    onChangeOpenWithdrawEarnings: address => {
      dispatch(changeSelectedContract(address));
      dispatch(changeOpenWithdrawEarnings());
    },
    onWithdrawEarnings: () => dispatch(withdrawEarnings()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ManageEventPage);
