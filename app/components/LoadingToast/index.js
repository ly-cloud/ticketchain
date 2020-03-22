/**
 *
 * LoadingToast
 *
 */

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

function LoadingToast(props) {
  const { message } = props;

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={3}>
          <CircularProgress color="secondary" />
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2">{message}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

LoadingToast.propTypes = {
  message: PropTypes.string,
};

export default LoadingToast;
