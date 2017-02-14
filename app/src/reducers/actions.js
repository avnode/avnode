export const ADD_EVENT = 'ADD_EVENT'
export const GET_EVENT = 'GET_EVENT'
export const EDIT_EVENT = 'EDIT_EVENT'
export const REMOVE_EVENT = 'REMOVE_EVENT'

export function getEvent(id) {
  return { type: GET_EVENT, id }
}

export function addEvent(title) {
  return { type: ADD_EVENT, title }
}

export function editEvent(payload) {
  return { type: EDIT_EVENT, payload }
}

export function removeEvent(id) {
  return { type: REMOVE_EVENT, id }
}
