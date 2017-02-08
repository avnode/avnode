import { combineReducers } from 'redux'
import { ADD_EVENT } from './actions'
import { REMOVE_EVENT } from './actions'

const initialState = [{
  id: 1,
  title: 'asdf'
},{
  id: 2,
  title: 'wuff'
}]
console.log(initialState.filter(function(item) {
  return item.id != 2
}));

function events(state = initialState, action) {
  switch (action.type) {
    case ADD_EVENT:
      return [
        ...state,
        { id: state.length + 1, title: action.title }
      ]
    case REMOVE_EVENT:
      return state.filter(item => { return item.id !== action.id })
    default:
      return state
  }
}

const accountApp = combineReducers({
  events
})

export default accountApp
