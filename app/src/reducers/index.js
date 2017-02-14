import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import { ADD_EVENT, GET_EVENT, EDIT_EVENT, REMOVE_EVENT } from './actions'

const initialState = [{
  id: 1,
  title: 'asdf'
},{
  id: 2,
  title: 'wuff'
}]

const event = (state = {}, action) => {
  switch (action.type) {
    case EDIT_EVENT:
      if (state.id !== action.id) {
        return state;
      }
      return [
        ...state,
        action.payload
      ];
    default:
      return state;
  }
}

const events = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENT:
      return {
        title: 'wuff'
      }
    case ADD_EVENT:
      return [
        ...state,
        { id: state.length + 1, title: action.title }
      ]
    case EDIT_EVENT:
      return state.map(e =>
        event(e, action)
      )
    case REMOVE_EVENT:
      return state.filter(item => { return item.id !== action.id })
    default:
      return state
  }
}

const reducer = combineReducers({
  events,
  form: formReducer
})

export default reducer
