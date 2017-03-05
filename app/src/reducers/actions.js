import fetch from 'isomorphic-fetch'

export const GOT_USER = 'GOT_USER'
export const EDIT_USER = 'EDIT_USER'
export const EDIT_EVENT = 'EDIT_EVENT'

export function gotUser(json) {
  return { type: GOT_USER, json }
}

export function editUser(json) {
  return { type: EDIT_USER, json }
}

export function editEvent(json) {
  return { type: EDIT_EVENT, json }
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
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(json => console.log('json', json))
  }
}
