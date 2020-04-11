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

import CssBaseline from '@material-ui/core/CssBaseline';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Image from 'material-ui-image';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { loadTickets } from './actions';
import { makeSelectTickets, makeSelectEvents } from './selectors';
import reducer from './reducer';
import saga from './saga';

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

export function MyTicketsPage(props) {
  useInjectReducer({ key: 'myTicketsPage', reducer });
  useInjectSaga({ key: 'myTicketsPage', saga });

  useEffect(() => {
    onLoadTickets();
  }, []);

  const { onLoadTickets } = props;
  const { events } = props;

  const classes = useStyles();

  return (
    <div>
      <Helmet>
        <title>MyTicketsPage</title>
        <meta name="description" content="My Tickets" />
      </Helmet>
      <CssBaseline />
      <main>
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
};

const mapStateToProps = createStructuredSelector({
  tickets: makeSelectTickets(),
  events: makeSelectEvents(),
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
