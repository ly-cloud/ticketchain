/*
 *
 * EditEventPage actions
 *
 */

import { toast } from 'react-toastify';
import {
  LOAD_EVENT,
  LOAD_EVENT_SUCCESS,
  LOAD_EVENT_ERROR,
  CHANGE_NAME,
  CHANGE_DESCRIPTION,
  CHANGE_IMAGEURL,
  CHANGE_DATETIME,
  CHANGE_VENUE,
  CHANGE_OPENINGSALETIME,
  CHANGE_CLOSINGSALETIME,
  EDIT_EVENT,
  EDIT_EVENT_SUCCESS,
  EDIT_EVENT_ERROR,
} from './constants';
let loadEventToastId = null;
let editEventToastId = null;

export function loadEvent(
  address,
  name,
  dateTime,
  venue,
  openingSaleTime,
  closingSaleTime,
  isListed,
) {
  return {
    type: LOAD_EVENT,
    address,
    name,
    dateTime,
    venue,
    openingSaleTime,
    closingSaleTime,
    isListed,
  };
}

export function loadEventSuccess(event, initialEvent) {
  return {
    type: LOAD_EVENT_SUCCESS,
    event,
    initialEvent,
  };
}

export function loadEventError(error) {
  toast.dismiss(loadEventToastId);
  loadEventToastId = null;
  toast.error(error.message, {
    containerId: 'default',
  });
  return {
    type: LOAD_EVENT_ERROR,
  };
}

export function changeName(name) {
  return {
    type: CHANGE_NAME,
    name,
  };
}

export function changeDescription(description) {
  return {
    type: CHANGE_DESCRIPTION,
    description,
  };
}

export function changeImageUrl(imageUrl) {
  return {
    type: CHANGE_IMAGEURL,
    imageUrl,
  };
}

export function changeDateTime(dateTime) {
  return {
    type: CHANGE_DATETIME,
    dateTime,
  };
}

export function changeVenue(venue) {
  return {
    type: CHANGE_VENUE,
    venue,
  };
}

export function changeOpeningSaleTime(openingSaleTime) {
  return {
    type: CHANGE_OPENINGSALETIME,
    openingSaleTime,
  };
}

export function changeClosingSaleTime(closingSaleTime) {
  return {
    type: CHANGE_CLOSINGSALETIME,
    closingSaleTime,
  };
}

export function editEvent() {
  return {
    type: EDIT_EVENT,
  };
}

export function editEventSuccess(res) {
  toast.dismiss(editEventToastId);
  editEventToastId = null;
  toast.success(res.message, {
    containerId: 'default',
  });
  return {
    type: EDIT_EVENT_SUCCESS,
  };
}

export function editEventError(error) {
  toast.dismiss(editEventToastId);
  editEventToastId = null;
  toast.error(error.message, {
    containerId: 'default',
  });
  return {
    type: EDIT_EVENT_ERROR,
  };
}
