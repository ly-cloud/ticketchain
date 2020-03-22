/**
 *
 * Footer
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
}));

function Footer() {
  const classes = useStyles();
  return (
    <div>
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          TicketChain
        </Typography>
        {/* <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography> */}
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          <Link color="inherit" to="/">
            TicketChain
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </footer>
    </div>
  );
}

Footer.propTypes = {};

export default Footer;
