import isomorphicFetch from 'isomorphic-fetch';

export const GOT_USER = 'GOT_USER';
export const EDIT_USER = 'EDIT_USER';
export const EDIT_EVENT = 'EDIT_EVENT';
export const DELETE_EVENT = 'DELETE_EVENT';
export const ADD_EVENT = 'ADD_EVENT';

// Wrap fetch with some default settings, always
// return parsed JSON…
const fetch = (path, options = {}) => {
  return isomorphicFetch(path, Object.assign({}, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  }, options)).then(response => response.json());
};

export function gotUser(json) {
  return { type: GOT_USER, json };
}

export function editUser(json) {
  return { type: EDIT_USER, json };
}

export function editEvent(json) {
  return { type: EDIT_EVENT, json };
}

export function removeEvent(id) {
  return { type: DELETE_EVENT, id };
}

export function fetchUser() {
  return dispatch => {
    return fetch('/account/api/user')
      .then(json => dispatch(gotUser(json)));
  };
}

export function postEvent(data) {
  return dispatch => {
    return fetch(
      `/account/api/event/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function addEvent(title) {
  return dispatch => {
    return fetch(
      '/account/api/event', {
        method: 'POST',
        body: JSON.stringify({ title })
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function deleteEvent(id) {
  return dispatch => {
    return fetch(
      `/account/api/event/${id}`, {
        method: 'DELETE',
      })
      .then(json => dispatch(gotUser(json)));
  };
}
