/* eslint-disable no-await-in-loop */
/* eslint-disable indent */
/**
 *
 * ViewEventPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import Web3 from 'web3';
import { compose } from 'redux';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid, Container } from '@material-ui/core';
import Image from 'material-ui-image';
import MaterialTable from 'material-table';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  makeSelectEventId,
  makeSelectName,
  makeSelectDateTime,
  makeSelectVenue,
  makeSelectOpeningSaleTime,
  makeSelectClosingSaleTime,
  makeSelectTickets,
} from './selectors';
import {
  changeEventId,
  changeName,
  changeDateTime,
  changeVenue,
  changeOpeningSaleTime,
  changeClosingSaleTime,
  emptyTicketsArray,
  pushTicket,
} from './actions';
import reducer from './reducer';
import saga from './saga';

// Import ABIs
import TicketChain from '../../../build/contracts/TicketChain.json';
import EventTicket from '../../../build/contracts/EventTicket.json';

const useStyles = makeStyles(theme => ({
  imageContent: {
    backgroundColor: theme.palette.grey[400],
    // backgroundColor: theme.palette.background.paper,
    // padding: theme.spacing(8, 0, 6),
  },
  grid: {
    margin: '0px 0px 10vh 0px',
  },
  detailsBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
    color: 'white',
  },
  salesBox: {
    margin: '0 auto',
    maxWidth: '80%',
  },
  salesNotice: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.info.light,
    color: 'white',
    textAlign: 'center',
    margin: '0px 0px 10vh 0px',
  },
  salesClosing: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.warning.light,
    color: 'white',
    textAlign: 'center',
    margin: '0px 0px 10px 0px',
  },
  salesClosed: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.error.light,
    color: 'white',
    margin: '0px 0px 10vh 0px',
    textAlign: 'center',
  },
}));

export function ViewEventPage(props) {
  useEffect(() => {
    loadBlockchainData();
  }, []);

  const {
    match,
    eventId,
    name,
    dateTime,
    venue,
    openingSaleTime,
    closingSaleTime,
    tickets,
  } = props;
  const {
    onChangeEventId,
    onChangeName,
    onChangeDateTime,
    onChangeVenue,
    onChangeOpeningSaleTime,
    onChangeClosingSaleTime,
    onEmptyTicketsArray,
    onPushTicket,
  } = props;
  const currentTime = new Date();
  useInjectReducer({ key: 'viewEventPage', reducer });
  useInjectSaga({ key: 'viewEventPage', saga });

  const classes = useStyles();

  const loadBlockchainData = async () => {
    onChangeEventId(parseInt(match.params.eventId, 10));
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
        const address = await ticketChainInstance.methods
          .events(match.params.eventId)
          .call();

        // Retrieve instance of EventTicket contract
        const eventTicketInstance = new web3.eth.Contract(
          EventTicket.abi,
          address,
        );
        // // Returns an array of event ticket details
        // [eventName, eventDatetime, venue, openSaleTime, closingSaleTime, isListed]
        const eventTicketDetails = await eventTicketInstance.methods
          .getEvent()
          .call();

        onChangeName(eventTicketDetails[1]);
        onChangeDateTime(new Date(eventTicketDetails[2] * 1000));
        onChangeVenue(eventTicketDetails[3]);
        onChangeOpeningSaleTime(new Date(eventTicketDetails[4] * 1000));
        onChangeClosingSaleTime(new Date(eventTicketDetails[5] * 1000));

        const totalTickets = await eventTicketInstance.methods
          .getTotalTickets()
          .call();
        // Empty the events array in the redux store
        onEmptyTicketsArray();

        // Retrieve information of all tickets
        for (let ticketId = 1; ticketId <= totalTickets; ticketId += 1) {
          // Returns an array of ticket details
          // [seller, price, listed, seatNumber]
          const ticketDetails = await ticketChainInstance.methods
            .ticketsListing(match.params.eventId, ticketId)
            .call();
          if (ticketDetails.listed) {
            const ticketObject = {
              seller: ticketDetails.seller,
              price: ticketDetails.price,
              listed: ticketDetails.listed,
              seatNumber: ticketDetails.seatNumber,
            };
            onPushTicket(ticketObject);
          }
        }
      } else {
        // window.alert('TicketChain contract not deployed to detected network.');
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>TicketChain - {name}</title>
        <meta name="description" content="TicketChain View Event Page" />
      </Helmet>
      <div className={classes.imageContent}>
        <Container maxWidth="md">
          <Image
            src="https://esportsobserver.com/wp-content/uploads/2019/12/ONE-Esports-Dota-2-Simgapore-Major-768x382.jpg"
            // src="https://media.hitekno.com/thumbs/2020/04/04/56583-meme-coffin-dancing/350x230-img-56583-meme-coffin-dancing.jpg"
            aspectRatio={16 / 9}
            color="#303030"
          />
        </Container>
      </div>
      <Grid item xs={12} className={classes.grid}>
        <Paper elevation={0} className={classes.detailsBox}>
          <Typography variant="h4">{name}</Typography>
          <Typography variant="h6">
            Date/Time:{' '}
            {dateTime &&
              dateTime.toLocaleString('en-GB', {
                dateStyle: 'full',
                timeStyle: 'short',
                hour12: true,
              })}
          </Typography>
          <Typography variant="h6">Venue: {venue}</Typography>
          <Typography variant="body1" gutterBottom>
            description
          </Typography>
        </Paper>
      </Grid>
      {currentTime && openingSaleTime && closingSaleTime && (
        <div className={classes.salesBox}>
          {currentTime.getTime() < openingSaleTime.getTime() && (
            <Paper elevation={0} className={classes.salesNotice}>
              <Typography variant="h6">Ticket sale Period:</Typography>
              <Typography variant="subtitle">
                {openingSaleTime.toLocaleString('en-GB', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                  hour12: true,
                })}{' '}
                -{' '}
                {closingSaleTime.toLocaleString('en-GB', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                  hour12: true,
                })}
              </Typography>
            </Paper>
          )}
          {currentTime.getTime() > closingSaleTime.getTime() && (
            <Paper elevation={0} className={classes.salesClosed}>
              <Typography variant="h6">
                Ticket sale ended on{' '}
                {closingSaleTime.toLocaleString('en-GB', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                  hour12: true,
                })}
              </Typography>
            </Paper>
          )}
          {currentTime.getTime() > openingSaleTime.getTime() &&
            currentTime.getTime() < closingSaleTime.getTime() && (
              <div>
                <Paper elevation={0} className={classes.salesClosing}>
                  <Typography variant="h6">
                    Ticket sale ends on{' '}
                    {closingSaleTime.toLocaleString('en-GB', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                      hour12: true,
                    })}
                  </Typography>
                </Paper>
                {/* [seller, price, listed, seatNumber] */}
                <MaterialTable
                  columns={[
                    {
                      title: 'Seat Number',
                      field: 'seatNumber',
                      type: 'numeric',
                      cellStyle: { textAlign: 'center' },
                      headerStyle: { textAlign: 'left' },
                    },
                    {
                      title: 'Price',
                      field: 'price',
                      type: 'currency',
                      render: rowData => `${rowData.price} ETH`,
                      cellStyle: { textAlign: 'left' },
                    },
                    {
                      title: 'Seller',
                      field: 'seller',
                      render: rowData =>
                        `${rowData.seller.substring(
                          0,
                          6,
                        )}...${rowData.seller.substring(
                          rowData.seller.length - 4,
                        )}`,
                    },
                  ]}
                  data={tickets}
                  title={name}
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
}

ViewEventPage.propTypes = {
  match: PropTypes.object,
  eventId: PropTypes.number,
  name: PropTypes.string,
  dateTime: PropTypes.instanceOf(Date),
  venue: PropTypes.string,
  openingSaleTime: PropTypes.instanceOf(Date),
  closingSaleTime: PropTypes.instanceOf(Date),
  tickets: PropTypes.arrayOf(Object),
  onChangeEventId: PropTypes.func,
  onChangeName: PropTypes.func,
  onChangeDateTime: PropTypes.func,
  onChangeVenue: PropTypes.func,
  onChangeOpeningSaleTime: PropTypes.func,
  onChangeClosingSaleTime: PropTypes.func,
  onEmptyTicketsArray: PropTypes.func,
  onPushTicket: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  eventId: makeSelectEventId(),
  name: makeSelectName(),
  dateTime: makeSelectDateTime(),
  venue: makeSelectVenue(),
  openingSaleTime: makeSelectOpeningSaleTime(),
  closingSaleTime: makeSelectClosingSaleTime(),
  tickets: makeSelectTickets(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeEventId: eventId => dispatch(changeEventId(eventId)),
    onChangeName: name => dispatch(changeName(name)),
    onChangeDateTime: dateTime => dispatch(changeDateTime(dateTime)),
    onChangeVenue: venue => dispatch(changeVenue(venue)),
    onChangeOpeningSaleTime: openingSaleTime =>
      dispatch(changeOpeningSaleTime(openingSaleTime)),
    onChangeClosingSaleTime: closingSaleTime =>
      dispatch(changeClosingSaleTime(closingSaleTime)),
    onEmptyTicketsArray: () => dispatch(emptyTicketsArray()),
    onPushTicket: ticket => dispatch(pushTicket(ticket)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ViewEventPage);
