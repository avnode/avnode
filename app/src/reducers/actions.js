export const ADD_EVENT = 'ADD_EVENT'
export const EDIT_EVENT = 'EDIT_EVENT'
export const REMOVE_EVENT = 'REMOVE_EVENT'

export function addEvent(title) {
  return { type: ADD_EVENT, title }
}

export function editEvent(id) {
  return { type: EDIT_EVENT, id }
}

export function removeEvent(id) {
  return { type: REMOVE_EVENT, id }
}
