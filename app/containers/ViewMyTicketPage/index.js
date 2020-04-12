/**
 *
 * ViewMyTicketPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Web3 from 'web3';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  loadEventId,
  toggleListModal,
  changePrice,
  loadTicket,
  listTicket,
  unlistTicket,
} from './actions';
import {
  makeSelectTickets,
  makeSelectListModal,
  makeSelectPrice,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
let toastId = null;

const useStyles = makeStyles(theme => ({
  table: {
    paddingTop: theme.spacing(8),
  },
  pricesField: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export function ViewMyTicketPage(props) {
  useInjectReducer({ key: 'viewMyTicketPage', reducer });
  useInjectSaga({ key: 'viewMyTicketPage', saga });

  const { match, tickets, listModal, price } = props;
  const {
    onLoadEventId,
    onOpenListModal,
    onChangePrice,
    onCloseListModal,
    onLoadTicket,
    onListTicket,
    onUnlistTicket,
  } = props;

  useEffect(() => {
    if (window.ethereum.selectedAddress) {
      populateEventId();
      window.ethereum.on('accountsChanged', () => {
        populateEventId();
      });
    } else {
      window.alert('Please install and enable MetaMask to continue.');
    }
  }, []);

  const populateEventId = async () => {
    const { eventId } = match.params;
    onLoadEventId(eventId);
  };

  const onHandleSubmitListTicket = async () => {
    if (price === 0) {
      const message = 'The price of the ticket cannot be 0';
      toast.dismiss(toastId);
      toastId = null;
      toast.error(message, {
        containerId: 'default',
      });
    } else {
      onListTicket();
      onCloseListModal();
    }
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <Helmet>
        <title>My Tickets</title>
        <meta name="description" content="MyTickets Page" />
      </Helmet>
      <Container component="main" maxWidth="lg" className={classes.table}>
        <MaterialTable
          localization={{
            header: {
              actions: 'List/Unlist',
            },
          }}
          columns={[
            {
              title: 'Seat Number',
              field: 'seatNumber',
              type: 'numeric',
              cellStyle: { textAlign: 'left', paddingLeft: '40px' },
              headerStyle: { textAlign: 'left' },
            },
            {
              title: 'Original Price',
              field: 'price',
              type: 'currency',
              render: rowData =>
                `${Web3.utils.fromWei(rowData.originalPrice, 'ether')} ETH`,
              cellStyle: { textAlign: 'left' },
            },
          ]}
          actions={[
            rowData => ({
              icon: 'store',
              tooltip: 'List',
              onClick: (event, rowData) => {
                // Open modal
                onOpenListModal(true);
                // Load ticket into state
                onLoadTicket(rowData);
              },
              disabled: rowData.listed === true,
            }),
            rowData => ({
              icon: 'clear',
              tooltip: 'Unlist',
              onClick: (event, rowData) => {
                onLoadTicket(rowData);
                onUnlistTicket();
              },
              disabled: rowData.listed === false,
            }),
          ]}
          options={{
            actionsColumnIndex: -1,
          }}
          data={tickets}
          title="My Tickets"
        />
      </Container>
      <Dialog
        open={listModal}
        onClose={() => onCloseListModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">List Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`The ownership of the ticket will be transferred to the TicketChain's
            Market Place. However, you can still unlist the ticket later on if
            you wish to do so.`}
          </DialogContentText>
          <Grid className={classes.pricesField}>
            <TextField
              label="Price in Wei"
              multiline
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={onChangePrice}
            />
            <TextField
              value={Web3.utils.fromWei(price.toString(), 'ether')}
              multiline
              label="Price in Eth"
              type="number"
              disabled
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={onHandleSubmitListTicket}
          >
            List Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

ViewMyTicketPage.propTypes = {
  onLoadEventId: PropTypes.func,
  onOpenListModal: PropTypes.func,
  onCloseListModal: PropTypes.func,
  onChangePrice: PropTypes.func,
  onListTicket: PropTypes.func,
  onLoadTicket: PropTypes.func,
  onUnlistTicket: PropTypes.func,
  match: PropTypes.object,
  tickets: PropTypes.arrayOf(Object),
  listModal: PropTypes.bool,
  price: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  tickets: makeSelectTickets(),
  listModal: makeSelectListModal(),
  price: makeSelectPrice(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadEventId: eventId => dispatch(loadEventId(eventId)),
    onOpenListModal: state => dispatch(toggleListModal(state)),
    onCloseListModal: state => dispatch(toggleListModal(state)),
    onChangePrice: evt => dispatch(changePrice(evt.target.value)),
    onLoadTicket: ticket => dispatch(loadTicket(ticket)),
    onListTicket: () => dispatch(listTicket()),
    onUnlistTicket: () => dispatch(unlistTicket()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ViewMyTicketPage);
