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
    return fetch(`http://localhost:3000/user`)
      .then(response => response.json())
      .then(json => dispatch(gotUser(json)))
  }
}
