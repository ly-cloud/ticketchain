/* eslint-disable no-await-in-loop */
/**
 *
 * HomePage
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
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Image from 'material-ui-image';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from './TicketChain.jpg';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { makeSelectEvents } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { emptyEventsArray, pushEvent } from './actions';

// Import ABIs
import TicketChain from '../../../build/contracts/TicketChain.json';
import EventTicket from '../../../build/contracts/EventTicket.json';

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
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
}));

export function HomePage(props) {
  useEffect(() => {
    loadBlockchainData();
  }, []);

  const { events } = props;
  const { onEmptyEventsArray, onPushEvent } = props;

  useInjectReducer({ key: 'homePage', reducer });
  useInjectSaga({ key: 'homePage', saga });

  const classes = useStyles();

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
        // Retrieve total number of events in TicketChain contract
        const numEvents = await ticketChainInstance.methods
          .getTotalEvents()
          .call();
        // Empty the events array in the redux store
        onEmptyEventsArray();

        // Retrieve information of all events
        for (let eventId = 1; eventId <= numEvents; eventId += 1) {
          // Retrieve event ticket address
          const eventTicketAddress = await ticketChainInstance.methods
            .events(eventId)
            .call();
          // Retrieve instance of EventTicket contract
          const eventTicketInstance = new web3.eth.Contract(
            EventTicket.abi,
            eventTicketAddress,
          );
          // Retrieve event name
          const eventName = await eventTicketInstance.methods
            .eventName()
            .call();
          // Retrieve event date and time
          let eventDateTime = await eventTicketInstance.methods
            .eventDateTime()
            .call();
          eventDateTime = new Date(eventDateTime * 1000);
          // Retrieve event venue
          const venue = await eventTicketInstance.methods.venue().call();
          // Store information inside an object
          const eventObject = {
            eventTicketAddress,
            eventId,
            eventName,
            eventDateTime,
            venue,
          };
          // Push object to events array in the redux store
          onPushEvent(eventObject);
        }
      } else {
        // Leave this section like this until jh figures out what to do in this scenario
        // window.alert('TicketChain contract not deployed to detected network.');
      }
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>TicketChain</title>
        <meta name="description" content="TicketChain HomePage" />
      </Helmet>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            {/* <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              TicketChain
            </Typography> */}
            <Image src={logo} aspectRatio={16 / 9} color="#3f51b5" />
            {/* <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              The evolution of ticketing
            </Typography> */}
            {/* <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Main call to action
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Secondary action
                  </Button>
                </Grid>
              </Grid>
            </div> */}
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {events.map(event => (
              <Grid item key={event.eventId} x1s={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title={event.eventName}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {event.eventName}
                    </Typography>
                    <Typography gutterBottom variant="subtitle1" component="h2">
                      {event.eventDateTime.toLocaleString('en-GB', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                        hour12: true,
                      })}
                    </Typography>
                    <Typography>{event.venue}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Buy Ticket(s)
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}

HomePage.propTypes = {
  events: PropTypes.arrayOf(Object),
  onEmptyEventsArray: PropTypes.func,
  onPushEvent: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  events: makeSelectEvents(),
});

function mapDispatchToProps(dispatch) {
  return {
    onEmptyEventsArray: () => dispatch(emptyEventsArray()),
    onPushEvent: event => dispatch(pushEvent(event)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HomePage);
