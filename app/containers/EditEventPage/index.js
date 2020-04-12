/**
 *
 * EditEventPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Web3 from 'web3';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import moment from 'moment';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectName,
  makeSelectDescription,
  makeSelectImageUrl,
  makeSelectDateTime,
  makeSelectVenue,
  makeSelectOpeningSaleTime,
  makeSelectClosingSaleTime,
  makeSelectInitialEvent,
  makeSelectIsListed,
} from './selectors';
import {
  loadEvent,
  changeName,
  changeDescription,
  changeImageUrl,
  changeDateTime,
  changeVenue,
  changeOpeningSaleTime,
  changeClosingSaleTime,
  editEvent,
  editEventError,
} from './actions';
import { makeSelectAccounts } from '../App/selectors';

// Import ABIs
import TicketChain from '../../../build/contracts/TicketChain.json';
import EventTicket from '../../../build/contracts/EventTicket.json';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  openingClosingSale: {
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
  },
}));

export function EditEventPage(props) {
  useEffect(() => {
    loadBlockchainData();
  }, []);

  const {
    match,
    accounts,
    name,
    description,
    imageUrl,
    dateTime,
    venue,
    openingSaleTime,
    closingSaleTime,
    isListed,
    initialEvent,
  } = props;
  const {
    onLoadEvent,
    onChangeName,
    onChangeDescription,
    onChangeImageUrl,
    onChangeDateTime,
    onChangeVenue,
    onChangeOpeningSaleTime,
    onChangeClosingSaleTime,
    onEditEvent,
    onEditEventError,
  } = props;

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const { web3 } = window;
      // Load NetworkId
      const networkId = await web3.eth.net.getId();
      const networkData = TicketChain.networks[networkId];
      if (networkData) {
        // Retrieve instance of TicketChain contract
        const ticketChainInstance = new web3.eth.Contract(
          TicketChain.abi,
          networkData.address,
        );

        // Retrieve event ticket address
        const eventTicketAddress = await ticketChainInstance.methods
          .events(match.params.eventId)
          .call();

        // Retrieve instance of EventTicket contract
        const eventTicketInstance = new web3.eth.Contract(
          EventTicket.abi,
          eventTicketAddress,
        );
        // // Returns an array of event ticket details
        // [eventId, eventName, eventDatetime, venue, openSaleTime, closingSaleTime, isListed]
        const eventTicketDetails = await eventTicketInstance.methods
          .getEvent()
          .call();

        // Save event ticket address in store for use in Saga
        onLoadEvent(
          eventTicketAddress,
          eventTicketDetails[1],
          moment(eventTicketDetails[2] * 1000)
            .toISOString(true)
            .substring(0, 16),
          eventTicketDetails[3],
          moment(eventTicketDetails[4] * 1000)
            .toISOString(true)
            .substring(0, 16),
          moment(eventTicketDetails[5] * 1000)
            .toISOString(true)
            .substring(0, 16),
          eventTicketDetails[6],
        );
      } else {
        // window.alert('TicketChain contract not deployed to detected network.');
      }
    }
  };

  const onHandleEditEvent = async evt => {
    evt.preventDefault();
    const dateTimeMoment = moment(dateTime);
    const openingSaleMoment = moment(openingSaleTime);
    const closingSaleMoment = moment(closingSaleTime);
    const isValid =
      dateTimeMoment.isValid() &&
      openingSaleMoment.isValid() &&
      closingSaleMoment.isValid();
    const openingClosingValid = openingSaleMoment.isBefore(closingSaleMoment);
    const dateTimeValid =
      dateTimeMoment.isAfter(openingSaleMoment) &&
      dateTimeMoment.isAfter(closingSaleMoment);
    let message = '';
    const fieldsValid =
      name.length === 0 ||
      venue.length === 0 ||
      description.length === 0 ||
      imageUrl.length === 0;
    if (!isValid || !openingClosingValid || !dateTimeValid || fieldsValid) {
      if (fieldsValid) {
        message = 'Please fill up all fields';
      } else if (!isValid) {
        message = 'The date time format entered is incorrect';
      } else if (!openingClosingValid) {
        message =
          'The date time for the Start of Sale is after the End of Sale';
      } else if (!dateTimeMoment.isAfter(openingSaleMoment)) {
        message = 'The date time of the event is before the Start of Sale';
      } else if (!dateTimeMoment.isAfter(closingSaleMoment)) {
        message = 'The date time of the event is before the End of Sale';
      }
      onEditEventError({ message });
    } else {
      window.web3 = new Web3(window.ethereum);
      const { web3 } = window;
      // Load NetworkId
      const networkId = await web3.eth.net.getId();
      const networkData = TicketChain.networks[networkId];
      if (networkData) {
        // Retrieve instance of TicketChain contract
        const ticketChainInstance = new web3.eth.Contract(
          TicketChain.abi,
          networkData.address,
        );

        // Retrieve event ticket address
        const eventTicketAddress = await ticketChainInstance.methods
          .events(match.params.eventId)
          .call();

        // Retrieve instance of EventTicket contract
        const eventTicketInstance = new web3.eth.Contract(
          EventTicket.abi,
          eventTicketAddress,
        );

        if (
          initialEvent.name !== name ||
          initialEvent.dateTime !== dateTime ||
          initialEvent.venue !== venue ||
          initialEvent.openingSaleTime !== openingSaleTime ||
          initialEvent.closingSaleTime !== closingSaleTime
        ) {
          await eventTicketInstance.methods
            .updateEvent(
              name,
              moment(dateTime).unix(),
              venue,
              moment(openingSaleTime).unix(),
              moment(closingSaleTime).unix(),
            )
            .send({ from: accounts[0] });
        }
        onEditEvent();
      } else {
        // window.alert('TicketChain contract not deployed to detected network.');
      }
    }
  };

  useInjectReducer({ key: 'editEventPage', reducer });
  useInjectSaga({ key: 'editEventPage', saga });

  const classes = useStyles();

  return (
    <div>
      <React.Fragment>
        <Helmet>
          <title>TicketChain - Edit Event</title>
          <meta name="description" content="TicketChain EditEventPage" />
        </Helmet>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Edit Event
            </Typography>
            <form
              className={classes.form}
              noValidate
              onSubmit={onHandleEditEvent}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Event Name"
                name="name"
                autoFocus
                value={name}
                onChange={onChangeName}
                disabled={isListed}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="dateTime"
                label="Date and Time"
                name="dateTime"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                value={dateTime}
                onChange={onChangeDateTime}
                disabled={isListed}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="venue"
                label="Event Venue"
                name="venue"
                value={venue}
                onChange={onChangeVenue}
                disabled={isListed}
              />
              <Container className={classes.openingClosingSale}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  id="openingSaleTime"
                  label="Start of Sale"
                  name="openingSaleTime"
                  type="datetime-local"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={openingSaleTime}
                  onChange={onChangeOpeningSaleTime}
                  disabled={isListed}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  id="closingSaleTime"
                  label="End of Sale"
                  name="closingSaleTime"
                  type="datetime-local"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={closingSaleTime}
                  onChange={onChangeClosingSaleTime}
                  disabled={isListed}
                />
              </Container>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="description"
                label="Event Description"
                name="description"
                multiline
                rows="4"
                value={description}
                onChange={onChangeDescription}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="imageUrl"
                label="Event Banner URL"
                name="imageUrl"
                value={imageUrl}
                onChange={onChangeImageUrl}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={
                  initialEvent &&
                  !(
                    initialEvent.name !== name ||
                    initialEvent.dateTime !== dateTime ||
                    initialEvent.venue !== venue ||
                    initialEvent.openingSaleTime !== openingSaleTime ||
                    initialEvent.closingSaleTime !== closingSaleTime ||
                    initialEvent.description !== description ||
                    initialEvent.imageUrl !== imageUrl
                  )
                }
              >
                Edit
              </Button>
            </form>
          </div>
          <Box mt={8} />
        </Container>
      </React.Fragment>
    </div>
  );
}

EditEventPage.propTypes = {
  match: PropTypes.object,
  accounts: PropTypes.arrayOf(Object),
  name: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  dateTime: PropTypes.string,
  venue: PropTypes.string,
  openingSaleTime: PropTypes.string,
  closingSaleTime: PropTypes.string,
  initialEvent: PropTypes.object,
  isListed: PropTypes.bool,
  onLoadEvent: PropTypes.func,
  onChangeName: PropTypes.func,
  onChangeDescription: PropTypes.func,
  onChangeImageUrl: PropTypes.func,
  onChangeDateTime: PropTypes.func,
  onChangeVenue: PropTypes.func,
  onChangeOpeningSaleTime: PropTypes.func,
  onChangeClosingSaleTime: PropTypes.func,
  onEditEvent: PropTypes.func,
  onEditEventError: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  accounts: makeSelectAccounts(),
  name: makeSelectName(),
  description: makeSelectDescription(),
  imageUrl: makeSelectImageUrl(),
  dateTime: makeSelectDateTime(),
  venue: makeSelectVenue(),
  openingSaleTime: makeSelectOpeningSaleTime(),
  closingSaleTime: makeSelectClosingSaleTime(),
  isListed: makeSelectIsListed(),
  initialEvent: makeSelectInitialEvent(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadEvent: (
      address,
      name,
      dateTime,
      venue,
      openingSaleTime,
      closingSaleTime,
      isListed,
    ) =>
      dispatch(
        loadEvent(
          address,
          name,
          dateTime,
          venue,
          openingSaleTime,
          closingSaleTime,
          isListed,
        ),
      ),
    onChangeName: evt => {
      dispatch(changeName(evt.target.value));
    },
    onChangeDescription: evt => dispatch(changeDescription(evt.target.value)),
    onChangeImageUrl: evt => dispatch(changeImageUrl(evt.target.value)),
    onChangeDateTime: evt => {
      dispatch(changeDateTime(evt.target.value));
    },
    onChangeVenue: evt => dispatch(changeVenue(evt.target.value)),
    onChangeOpeningSaleTime: evt => {
      dispatch(changeOpeningSaleTime(evt.target.value));
    },
    onChangeClosingSaleTime: evt => {
      dispatch(changeClosingSaleTime(evt.target.value));
    },
    onEditEvent: () => dispatch(editEvent()),
    onEditEventError: error => dispatch(editEventError(error)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(EditEventPage);
