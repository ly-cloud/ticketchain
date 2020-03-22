/**
 *
 * Header
 *
 */

import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
// import Button from '@material-ui/core/Button';
// import Link from '@material-ui/core/Link';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    // flexGrow: 1,
    textDecoration: 'none',
  },
  rightToolbar: {
    marginLeft: 'auto',
    marginRight: -12,
  },
}));

function Header(props) {
  const { account } = props;
  const classes = useStyles();

  return (
    // <div className={classes.root}> // Commented for sticky header
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component={Link}
          variant="h6"
          className={classes.title}
          color="inherit"
          to=""
        >
          TicketChain
        </Typography>

        <section className={classes.rightToolbar}>
          {account || <span />}
          {/* <Button
            component={Link}
            color="default"
            variant="contained"
            to="/login"
          >
            Login
          </Button> */}
        </section>
      </Toolbar>
    </AppBar>
    // </div>
  );
}

Header.propTypes = {
  account: PropTypes.string,
};

export default Header;
