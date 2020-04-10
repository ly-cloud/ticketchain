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
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Image from 'material-ui-image';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { makeSelectEvents } from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  changeTicketChainAddress,
  loadEvent,
  emptyEventsArray,
} from './actions';
import logo from '../../images/TicketChain.jpg';

// Import ABIs
import TicketChain from '../../../build/contracts/TicketChain.json';

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
  const { onChangeTicketChainAddress, onLoadEvent, onEmptyEventsArray } = props;

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
      // Store TicketChain address in store
      onChangeTicketChainAddress(networkData.address);
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
          onLoadEvent(eventId);
        }
      } else {
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
            <Image src={logo} aspectRatio={16 / 9} color="#3f51b5" />
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {events.map(event => (
              <Grid item key={event.eventId} x1s={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <Image src={event.imageUrl} aspectRatio={16 / 9} />
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
                    <Button
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/event/${event.eventId}`}
                    >
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
  onChangeTicketChainAddress: PropTypes.func,
  onLoadEvent: PropTypes.func,
  onEmptyEventsArray: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  events: makeSelectEvents(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeTicketChainAddress: ticketChainAddress =>
      dispatch(changeTicketChainAddress(ticketChainAddress)),
    onLoadEvent: eventId => dispatch(loadEvent(eventId)),
    onEmptyEventsArray: () => dispatch(emptyEventsArray()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HomePage);
