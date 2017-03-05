import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import {
  GOT_USER,
  EDIT_USER,

  EDIT_EVENT,
  REQUEST_DELETE_EVENT,
  REQUEST_EDIT_EVENT,
  REQUEST_ADD_EVENT 
} from './actions';

const initialValues = {
  events: []
};
const event = (state = {}, action) => {
  switch (action.type) {
  case EDIT_EVENT:
    if (state._id !== action.json._id) {
      return state;
    }
    return Object.assign({}, state, action.json);
  case REQUEST_ADD_EVENT:
    return Object.assign({}, state, {
      ajaxInProgress: true
    });
  case REQUEST_DELETE_EVENT:
    if (state._id !== action.id) {
      return state;
    }
    return Object.assign({}, state, {
      ajaxInProgress: true
    });

  default:
    return state;
  }
};
const user = (state = initialValues, action) => {
  switch (action.type) {
  case GOT_USER:
    return action.json;
  case EDIT_USER:
    return state;
  case EDIT_EVENT:
    return state; // FIXME?!
  case REQUEST_ADD_EVENT:
    return Object.assign({}, state, {
      events: event(state.events, action)
    });
  case REQUEST_EDIT_EVENT:
  case REQUEST_DELETE_EVENT:
    return Object.assign({}, state, {
      events: state.events.map((e) => {
        return event(e, action);
      })
    });
  default:
    return state;
  }
};

const reducer = combineReducers({
  user,
  form: formReducer
});

export default reducer;
