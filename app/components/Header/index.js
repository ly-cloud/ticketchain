/**
 *
 * Header
 *
 */

import React from 'react';
import { AppBar, Toolbar, IconButton, Button, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import Identicon from 'identicon.js';
import Typography from '@material-ui/core/Typography';
import { Text } from 'rimble-ui';
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
          {account ? (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Box mt={0.75} mr={1}>
                <img
                  width="20"
                  height="20"
                  src={`data:image/png;base64,${new Identicon(
                    account,
                    10,
                  ).toString()}`}
                  alt="Identicon"
                />
              </Box>
              <Box mt={0.5} mr={2}>
                <Text
                  fontWeight={600}
                  fontSize="12px"
                  color="#FFFFFF"
                  lineHeight={1}
                >
                  Connected as
                </Text>
                <Text fontSize={1} color="#FFFFFF">
                  {`${account.substring(0, 6)}...${account.substring(
                    account.length - 4,
                  )}`}
                </Text>
              </Box>
            </Box>
          ) : (
            <Button
              component={Link}
              color="default"
              variant="contained"
              to="/login"
            >
              Login
            </Button>
          )}
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
