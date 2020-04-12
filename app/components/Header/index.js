/**
 *
 * Header
 *
 */

import React from 'react';
import clsx from 'clsx';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Tooltip,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Identicon from 'identicon.js';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Text } from 'rimble-ui';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
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
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

function Header(props) {
  const { account, sidebarOpen } = props;
  const { onHandleMetamaskLogin, onChangeSidebarOpen, onCopySuccess } = props;
  const classes = useStyles();

  return (
    <AppBar
      position="sticky"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: sidebarOpen,
      })}
    >
      <Toolbar>
        {account && !sidebarOpen && (
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => onChangeSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
        {account && sidebarOpen && (
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => onChangeSidebarOpen(false)}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
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
            <Tooltip
              title={account}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                navigator.clipboard.writeText(account);
                onCopySuccess();
              }}
            >
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
            </Tooltip>
          ) : (
            <Button
              color="default"
              variant="contained"
              onClick={onHandleMetamaskLogin}
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
  sidebarOpen: PropTypes.bool,
  onHandleMetamaskLogin: PropTypes.func,
  onChangeSidebarOpen: PropTypes.func,
  onCopySuccess: PropTypes.func,
};

export default Header;
