/**
 *
 * CreateEventPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

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
import {
  makeSelectEventName,
  makeSelectEventDateTime,
  makeSelectEventStartSale,
  makeSelectEventEndSale,
  makeSelectEventVenue,
  makeSelectEventImage,
  makeSelectEventDes,
} from './selectors';
import {
  changeEventName,
  changeEventDateTime,
  changeEventStartSale,
  changeEventEndSale,
  changeEventVenue,
  changeEventImage,
  createEvent,
  changeEventDes,
} from './actions';
import reducer from './reducer';
import saga from './saga';

let toastId = null;

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
  startEndSale: {
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
  },
}));

export function CreateEventPage(props) {
  useEffect(() => {}, []);

  const {
    eventName,
    eventVenue,
    eventDes,
    eventImage,
    eventDateTime,
    eventStartSale,
    eventEndSale,
  } = props;

  const {
    onChangeEventName,
    onChangeEventDateTime,
    onChangeEventVenue,
    onChangeEventStartSale,
    onChangeEventEndSale,
    onChangeEventImage,
    onChangeEventDes,
    onCreateEvent,
  } = props;

  useInjectReducer({ key: 'createEventPage', reducer });
  useInjectSaga({ key: 'createEventPage', saga });

  const classes = useStyles();

  async function onHandleSubmit(evt) {
    evt.preventDefault();
    const dateTime = moment(eventDateTime);
    const startSale = moment(eventStartSale);
    const endSale = moment(eventEndSale);
    const isValid =
      dateTime.isValid() && startSale.isValid() && endSale.isValid();
    const startEndValid = startSale.isBefore(endSale);
    const dateTimeValid =
      dateTime.isAfter(startSale) && dateTime.isAfter(endSale);
    let message = '';
    const fieldsValid =
      eventName.length === 0 ||
      eventVenue.length === 0 ||
      eventDes.length === 0 ||
      eventImage.length === 0;
    if (!isValid || !startEndValid || !dateTimeValid || fieldsValid) {
      if (fieldsValid) {
        message = 'Please fill up all fields';
      } else if (!isValid) {
        message = 'The date time format entered is incorrect';
      } else if (!startEndValid) {
        message =
          'The date time for the Start of Sale is after the End of Sale';
      } else if (!dateTime.isAfter(startSale)) {
        message = 'The date time of the event is before the Start of Sale';
      } else if (!dateTime.isAfter(endSale)) {
        message = 'The date time of the event is before the Start of Sale';
      } else if (!dateTimeValid) {
        message =
          'The date time of the event is before the both Start of Sale and End of Sale';
      }
      toast.dismiss(toastId);
      toastId = null;
      toast.error(message, {
        containerId: 'default',
      });
    } else {
      onCreateEvent();
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>TicketChain - Create Event</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Create Event
          </Typography>
          <form className={classes.form} noValidate onSubmit={onHandleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="eventName"
              label="Event Name"
              name="eventName"
              autoFocus
              value={eventName}
              onChange={onChangeEventName}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="eventDateTime"
              label="Date and Time"
              name="eventDateTime"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              value={eventDateTime}
              onChange={onChangeEventDateTime}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="eventVenue"
              label="Event Venue"
              name="eventVenue"
              value={eventVenue}
              onChange={onChangeEventVenue}
            />
            <Container className={classes.startEndSale}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                id="eventStartSale"
                label="Start of Sale"
                name="eventStartSale"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                value={eventStartSale}
                onChange={onChangeEventStartSale}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                id="eventEndSale"
                label="End of Sale"
                name="eventEndSale"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                value={eventEndSale}
                onChange={onChangeEventEndSale}
              />
            </Container>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="eventDes"
              label="Event Description"
              name="eventDes"
              multiline
              rows="4"
              value={eventDes}
              onChange={onChangeEventDes}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="eventImage"
              label="Event Banner URL"
              name="eventImage"
              value={eventImage}
              onChange={onChangeEventImage}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create
            </Button>
          </form>
        </div>
        <Box mt={8} />
      </Container>
    </React.Fragment>
  );
}

CreateEventPage.propTypes = {
  eventName: PropTypes.string,
  eventVenue: PropTypes.string,
  eventDes: PropTypes.string,
  eventImage: PropTypes.string,
  eventDateTime: PropTypes.string,
  eventStartSale: PropTypes.string,
  eventEndSale: PropTypes.string,
  onChangeEventName: PropTypes.func,
  onChangeEventDateTime: PropTypes.func,
  onChangeEventVenue: PropTypes.func,
  onChangeEventStartSale: PropTypes.func,
  onChangeEventEndSale: PropTypes.func,
  onChangeEventImage: PropTypes.func,
  onChangeEventDes: PropTypes.func,
  onCreateEvent: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  eventName: makeSelectEventName(),
  eventDateTime: makeSelectEventDateTime(),
  eventVenue: makeSelectEventVenue(),
  eventStartSale: makeSelectEventStartSale(),
  eventEndSale: makeSelectEventEndSale(),
  eventImage: makeSelectEventImage(),
  eventDes: makeSelectEventDes(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeEventName: evt => {
      dispatch(changeEventName(evt.target.value));
    },
    onChangeEventDateTime: evt => {
      dispatch(changeEventDateTime(evt.target.value));
    },
    onChangeEventVenue: evt => dispatch(changeEventVenue(evt.target.value)),
    onChangeEventStartSale: evt => {
      dispatch(changeEventStartSale(evt.target.value));
    },
    onChangeEventEndSale: evt => {
      dispatch(changeEventEndSale(evt.target.value));
    },
    onChangeEventImage: evt => dispatch(changeEventImage(evt.target.value)),
    onChangeEventDes: evt => dispatch(changeEventDes(evt.target.value)),
    onCreateEvent: () => dispatch(createEvent()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(CreateEventPage);
