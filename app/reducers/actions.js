import isomorphicFetch from 'isomorphic-fetch';

export const GOT_USER = 'GOT_USER';
export const EDIT_USER = 'EDIT_USER';

export const DELETE_EVENT = 'DELETE_EVENT';
export const ADD_EVENT = 'ADD_EVENT';
export const EDIT_EVENT = 'EDIT_EVENT';
export const REQUEST_DELETE_EVENT = 'REQUEST_DELETE_EVENT';
export const REQUEST_ADD_EVENT = 'REQUEST_ADD_EVENT';
export const REQUEST_EDIT_EVENT = 'REQUEST_EDIT_EVENT';

export const REQUEST_ADD_CREW = 'REQUEST_ADD_CREW';
export const REQUEST_DELETE_CREW = 'REQUEST_DELETE_CREW';
export const REQUEST_EDIT_CREW = 'REQUEST_EDIT_CREW';
export const REQUEST_SUGGEST_CREWMEMBER = 'REQUEST_SUGGEST_CREWMEMBER';
export const RESPONSE_SUGGEST_CREWMEMBER = 'RESPONSE_SUGGEST_CREWMEMBER';
export const ADD_CREWMEMBER = 'ADD_CREWMEMBER';
export const REQUEST_ADD_CREWIMAGE = 'REQUEST_ADD_CREWIMAGE';

// Wrap fetch with some default settings, always
// return parsed JSON…
const fetch = (path, options = {}, json = true) => {
  const opts = Object.assign({}, {
    credentials: 'same-origin'
  }, options);
  if (json === true) {
    opts.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  return isomorphicFetch(path, opts)
    .then(response => response.json());
};

export function gotUser(json) {
  return { type: GOT_USER, json };
}

export function editUser(json) {
  return { type: EDIT_USER, json };
}

export function fetchUser() {
  return dispatch => {
    return fetch('/account/api/user')
      .then(json => dispatch(gotUser(json)));
  };
}

export function editEvent(data) {
  return dispatch => {
    dispatch({
      type: REQUEST_EDIT_EVENT,
      id: data._id
    });
    return fetch(
      `/account/api/event/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function addEvent(title) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENT
    });
    return fetch(
      '/account/api/event', {
        method: 'POST',
        body: JSON.stringify({ title })
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function deleteEvent(id) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_EVENT,
      id
    });
    return fetch(
      `/account/api/event/${id}`, {
        method: 'DELETE',
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function addCrew(title) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_CREW
    });
    return fetch(
      '/account/api/crew', {
        method: 'POST',
        body: JSON.stringify({ title })
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function deleteCrew(id) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_CREW,
      id
    });
    return fetch(
      `/account/api/crew/${id}`, {
        method: 'DELETE',
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function editCrew(data) {
  return dispatch => {
    dispatch({
      type: REQUEST_EDIT_CREW,
      id: data._id
    });
    return fetch(
      `/account/api/crew/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function suggestCrewMember(q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_CREWMEMBER,
      q
    });
    return fetch(`/account/api/search/user?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_CREWMEMBER,
          suggestions: json
        });
      });
  };
};

export function addCrewMember(crewId, member) {
  return {
    type: ADD_CREWMEMBER,
    payload: {
      crewId,
      member
    }
  };
}

export function addCrewImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_CREWIMAGE
    });
    const formData = new FormData();
    formData.append('image', file, file.name)
    return fetch(`/account/api/crew/${id}/image`, {
      method: 'POST',
      body: formData
    }, false)
    .then(json => dispatch(gotUser(json)));
  }
}
