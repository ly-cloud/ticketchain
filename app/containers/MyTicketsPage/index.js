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

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { loadTickets } from './actions';
import { makeSelectTickets, makeSelectEvents } from './selectors';
import reducer from './reducer';
import saga from './saga';

export function MyTicketsPage(props) {
  useInjectReducer({ key: 'myTicketsPage', reducer });
  useInjectSaga({ key: 'myTicketsPage', saga });

  const { onLoadTickets } = props;
  const { tickets } = props;

  useEffect(() => {
    onLoadTickets();
  }, []);

  return (
    <div>
      <Helmet>
        <title>MyTicketsPage</title>
        <meta name="description" content="My Tickets" />
      </Helmet>
      <h1>{tickets}</h1>
    </div>
  );
}

MyTicketsPage.propTypes = {
  onLoadTickets: PropTypes.func,
  tickets: PropTypes.arrayOf(String),
  // events: PropTypes.arrayOf(String),
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
