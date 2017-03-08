import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import R from 'ramda';

import {
  GOT_USER,
  EDIT_USER,

  EDIT_EVENT,
  REQUEST_DELETE_EVENT,
  REQUEST_EDIT_EVENT,
  REQUEST_ADD_EVENT,

  REQUEST_SUGGEST_CREWMEMBER,
  RESPONSE_SUGGEST_CREWMEMBER,
  REQUEST_ADD_CREWIMAGE,
  ADD_CREWMEMBER,
  REQUEST_DELETE_CREWMEMBER
} from './actions';

const initialValues = {
  events: [],
  crews: []
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

const crew = (state = {}, action) => {
  switch (action.type) {
  case ADD_CREWMEMBER:
    if (state._id !== action.payload.crewId) {
      return state;
    }
    return Object.assign({}, state, {
      members: R.append(action.payload.member, state.members)
    });
  case REQUEST_ADD_CREWIMAGE:
    if (state._id !== action.payload.crewId) {
      return state;
    }
    return Object.assign({}, state, {
      imageUploadInProgress: true
    });
  case REQUEST_DELETE_CREWMEMBER:
    if (state._id !== action.payload.crewId) {
      return state;
    }
    return Object.assign({}, state, {
      members: state.members.map((m) => {
        if (m._id === action.payload.memberId) {
          return Object.assign({}, m, {
            deletionInProgress: true
          });
        } else {
          return m;
        }
      })
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
    return Object.assign({}, state, event(state, action));
  case REQUEST_EDIT_EVENT:
  case REQUEST_DELETE_EVENT:
    return Object.assign({}, state, {
      events: state.events.map((e) => {
        return event(e, action);
      })
    });
  case RESPONSE_SUGGEST_CREWMEMBER:
    return Object.assign({}, state, {
      _memberSuggestions: action.suggestions,
      _memberSuggestionInProgress: false
    });
  case REQUEST_SUGGEST_CREWMEMBER:
    return Object.assign({}, state, {
      _memberSuggestionInProgress: true
    });
  case REQUEST_ADD_CREWIMAGE:
  case REQUEST_DELETE_CREWMEMBER:
  case REQUEST_SUGGEST_CREWMEMBER:
  case ADD_CREWMEMBER:
    return Object.assign({}, state, {
      crews: state.crews.map((c) => {
        return crew(c, action);
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
