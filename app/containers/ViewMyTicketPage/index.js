/**
 *
 * ViewMyTicketPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Web3 from 'web3';

import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { loadEventId } from './actions';
import { makeSelectTickets } from './selectors';
import reducer from './reducer';
import saga from './saga';

const useStyles = makeStyles(theme => ({
  table: {
    paddingTop: theme.spacing(8),
  },
}));

export function ViewMyTicketPage(props) {
  useInjectReducer({ key: 'viewMyTicketPage', reducer });
  useInjectSaga({ key: 'viewMyTicketPage', saga });

  const { match, tickets } = props;
  const { onLoadEventId } = props;

  useEffect(() => {
    populateEventId();
  }, []);

  const populateEventId = async () => {
    const { eventId } = match.params;
    onLoadEventId(eventId);
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <Helmet>
        <title>My Tickets</title>
        <meta name="description" content="MyTickets Page" />
      </Helmet>
      <Container component="main" maxWidth="m" className={classes.table}>
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
              title: 'Price',
              field: 'price',
              type: 'currency',
              render: rowData =>
                `${Web3.utils.fromWei(rowData.originalPrice, 'ether')} ETH`,
              cellStyle: { textAlign: 'left' },
            },
          ]}
          actions={[
            {
              icon: 'store',
              tooltip: 'List',
            }
          ]}
          options={{
            actionsColumnIndex: -1,
          }}
          data={tickets}
          title="My Tickets"
        />
      </Container>
    </React.Fragment>
  );
}

ViewMyTicketPage.propTypes = {
  match: PropTypes.object,
  onLoadEventId: PropTypes.func,
  tickets: PropTypes.arrayOf(Object),
};

const mapStateToProps = createStructuredSelector({
  tickets: makeSelectTickets(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadEventId: eventId => dispatch(loadEventId(eventId)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ViewMyTicketPage);
