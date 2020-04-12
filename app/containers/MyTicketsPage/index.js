/**
 *
 * MyTicketsPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { loadTickets } from './actions';
import { makeSelectEvents } from './selectors';
import { makeSelectAccounts } from '../App/selectors';
import reducer from './reducer';
import saga from './saga';

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
}));

export function MyTicketsPage(props) {
  useInjectReducer({ key: 'myTicketsPage', reducer });
  useInjectSaga({ key: 'myTicketsPage', saga });

  useEffect(() => {
    if (window.ethereum.selectedAddress) {
      onLoadTickets();
      window.ethereum.on('accountsChanged', () => {
        onLoadTickets();
      });
    } else {
      window.alert('Please install and enable MetaMask to continue.');
    }
  }, []);

  const { onLoadTickets } = props;
  const { events, accounts } = props;

  const classes = useStyles();

  return (
    <div>
      <Helmet>
        <title>MyTicketsPage</title>
        <meta name="description" content="My Tickets" />
      </Helmet>
      <CssBaseline />
      <div className={classes.title}>
        <Typography variant="h3">My Tickets</Typography>
        <Chip
          label={
            <Typography variant="body2">
              You are viewing tickets owned by this address: {accounts[0]}
            </Typography>
          }
        />
      </div>
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {events.map(event => (
              <Grid item key={event.eventId} x1s={12} sm={6} md={6}>
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
                    <Typography>{event.venue}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      style={{ textAlign: 'center' }}
                      component={Link}
                      to={`/myTickets/${event.eventId}`}
                    >
                      View Ticket(s)
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </div>
  );
}

MyTicketsPage.propTypes = {
  onLoadTickets: PropTypes.func,
  events: PropTypes.arrayOf(String),
  accounts: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  events: makeSelectEvents(),
  accounts: makeSelectAccounts(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadTickets: () => dispatch(loadTickets()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(MyTicketsPage);
