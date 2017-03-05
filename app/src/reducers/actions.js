import fetch from 'isomorphic-fetch'

export const GOT_USER = 'GOT_USER'
export const EDIT_USER = 'EDIT_USER'
export const EDIT_EVENT = 'EDIT_EVENT'
export const DELETE_EVENT = 'DELETE_EVENT'
export const ADD_EVENT = 'ADD_EVENT'

export function gotUser(json) {
  return { type: GOT_USER, json }
}

export function editUser(json) {
  return { type: EDIT_USER, json }
}

export function editEvent(json) {
  return { type: EDIT_EVENT, json }
}

export function removeEvent(id) {
  return { type: DELETE_EVENT, id }
}

export function fetchUser() {
  return dispatch => {
    return fetch(`/account/api/user`, {
        credentials: 'same-origin'
      })
      .then(response => response.json())
      .then(json => dispatch(gotUser(json)))
  }
}

export function postEvent(data) {
  return dispatch => {
    return fetch(
      `/account/api/event/${data._id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(json => dispatch(gotUser(json)))
  }
}

export function addEvent(title) {
  return dispatch => {
    return fetch(
      `/account/api/event`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify({ title })
      })
      .then(response => response.json())
      .then(json => dispatch(gotUser(json)))
  }
};

export function deleteEvent(id) {
  return dispatch => {
    return fetch(
      `/account/api/event/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(json => dispatch(gotUser(json)))
  }
};
