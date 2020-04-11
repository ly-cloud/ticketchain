/**
 *
 * Sidebar
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddBox';
import EventIcon from '@material-ui/icons/Event';
import TicketIcon from '@material-ui/icons/ConfirmationNumber';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
const drawerWidth = 240;

const useStyles = makeStyles(() => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

function Sidebar(props) {
  const { sidebarOpen, onChangeSidebarOpen } = props;
  const classes = useStyles();
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Divider />
      <List>
        <ListItem
          button
          component={Link}
          to="/createEvent"
          key="Create Event"
          onClick={() => onChangeSidebarOpen(false)}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Create Event" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/manageEvent"
          key="Manage my Event(s)"
          onClick={() => onChangeSidebarOpen(false)}
        >
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Manage my Event(s)" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem
          button
          component={Link}
          to="/myTickets"
          key="View my Ticket(s)"
          onClick={() => onChangeSidebarOpen(false)}
        >
          <ListItemIcon>
            <TicketIcon />
          </ListItemIcon>
          <ListItemText primary="View my Ticket(s)" />
        </ListItem>
      </List>
    </Drawer>
  );
}

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool,
  onChangeSidebarOpen: PropTypes.func,
};

export default Sidebar;
