import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { GOT_USER, EDIT_USER, EDIT_EVENT } from './actions'

const initialValues = {
  events: []
}
const event = (state = {}, action) => {
  switch (action.type) {
    case EDIT_EVENT:
      if (state._id !== action.json._id) {
        return state
      }
      let newState = Object.assign(state, action.json);
      return newState;
    default:
      return state
  }
}
const user = (state = initialValues, action) => {
  switch (action.type) {
    case GOT_USER:
      return action.json
    case EDIT_USER:
      return state
    case EDIT_EVENT:
      let newState = Object.assign({}, state)
      newState.events = newState.events.map(e => {
        return event(e, action)
      })
      return newState
    default:
      return state
  }
}

const reducer = combineReducers({
  user,
  form: formReducer
})

export default reducer
