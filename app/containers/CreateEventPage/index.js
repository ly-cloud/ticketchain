/**
 *
 * CreateEventPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectEventName,
  makeSelectEventDateTime,
  makeSelectEventStartSale,
  makeSelectEventEndSale,
  makeSelectEventVenue,
  makeSelectEventImage,
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
    onCreateEvent();
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
              autoFocus
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
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
              autoFocus
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
                autoFocus
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={onChangeEventStartSale}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                id="eventEndSale"
                label="End of Sale"
                name="eventEndSale"
                autoFocus
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
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
              autoFocus
              multiline
              rows="4"
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
              autoFocus
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
