/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import NotFoundImage from './404.jpg';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export function NotFoundPage(props) {
  const classes = useStyles();
  return (
    <div>
      <img
        src={NotFoundImage}
        alt="Page not found!"
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '50%',
        }}
      />
      <div style={{ padding: '10px', textAlign: 'center' }}>
        <h1 style={{ color: '#d9534f' }}>
          Opps! We can&apos;t find the page you&apos;re looking for!
        </h1>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<BackIcon />}
          onClick={() => props.history.goBack()}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<HomeIcon />}
          component={Link}
          to="/"
        >
          Home
        </Button>
      </div>
    </div>
  );
}

NotFoundPage.propTypes = {
  history: PropTypes.object,
};

export default compose(NotFoundPage);
