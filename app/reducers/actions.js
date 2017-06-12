import isomorphicFetch from 'isomorphic-fetch';

export const NAVIGATE = 'NAVIGATE';
export const GOT_USER = 'GOT_USER';
export const REQUEST_EDIT_USER = 'REQUEST_EDIT_USER';
export const EDIT_USER = 'EDIT_USER';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const RESPONSE_COUNTRIES = 'RESPONSE_COUNTRIES';
export const REQUEST_ADD_USERPROFILEIMAGE = 'REQUEST_ADD_USERPROFILEIMAGE';
export const REQUEST_ADD_USERTEASERIMAGE = 'REQUEST_ADD_USERTEASERIMAGE';
export const OPEN_STAGENAME_MODAL = 'OPEN_STAGENAME_MODAL';
export const CLOSE_STAGENAME_MODAL = 'CLOSE_STAGENAME_MODAL';
export const OPEN_PASSWORD_MODAL = 'OPEN_PASSWORD_MODAL';
export const CLOSE_PASSWORD_MODAL = 'CLOSE_PASSWORD_MODAL';

export const DELETE_EVENT = 'DELETE_EVENT';
export const ADD_EVENT = 'ADD_EVENT';
export const EDIT_EVENT = 'EDIT_EVENT';
export const REQUEST_DELETE_EVENT = 'REQUEST_DELETE_EVENT';
export const REQUEST_ADD_EVENT = 'REQUEST_ADD_EVENT';
export const REQUEST_EDIT_EVENT = 'REQUEST_EDIT_EVENT';
export const REQUEST_ADD_EVENTIMAGE = 'REQUEST_ADD_EVENTIMAGE';
export const REQUEST_ADD_EVENTTEASERIMAGE = 'REQUEST_ADD_EVENTTEASERIMAGE';
export const REQUEST_SUGGEST_EVENT_PERFORMANCE = 'REQUEST_SUGGEST_EVENT_PERFORMANCE';
export const RESPONSE_SUGGEST_EVENT_PERFORMANCE = 'RESPONSE_SUGGEST_EVENT_PERFORMANCE';
export const REQUEST_ADD_EVENT_PERFORMANCE = 'REQUEST_ADD_EVENT_PERFORMANCE';
export const REQUEST_DELETE_EVENT_PERFORMANCE = 'REQUEST_DELETE_EVENT_PERFORMANCE';
export const REQUEST_SUGGEST_EVENT_ORGANIZER = 'REQUEST_SUGGEST_EVENT_ORGANIZER';
export const RESPONSE_SUGGEST_EVENT_ORGANIZER = 'RESPONSE_SUGGEST_EVENT_ORGANIZER';
export const REQUEST_ADD_EVENT_ORGANIZER = 'REQUEST_ADD_EVENT_ORGANIZER';
export const REQUEST_DELETE_EVENT_ORGANIZER = 'REQUEST_DELETE_EVENT_ORGANIZER';
export const REQUEST_SUGGEST_EVENT_ORGANIZINGCREW = 'REQUEST_SUGGEST_EVENT_ORGANIZINGCREW';
export const RESPONSE_SUGGEST_EVENT_ORGANIZINGCREW = 'RESPONSE_SUGGEST_EVENT_ORGANIZINGCREW';
export const REQUEST_ADD_EVENT_ORGANIZINGCREW = 'REQUEST_ADD_EVENT_ORGANIZINGCREW';
export const REQUEST_DELETE_EVENT_ORGANIZINGCREW = 'REQUEST_DELETE_EVENT_ORGANIZINGCREW';
export const REQUEST_ADD_EVENT_VENUE = 'REQUEST_ADD_EVENT_VENUE';
export const REQUEST_DELETE_EVENT_VENUE = 'REQUEST_DELETE_EVENT_VENUE';

export const REQUEST_ADD_CREW = 'REQUEST_ADD_CREW';
export const REQUEST_DELETE_CREW = 'REQUEST_DELETE_CREW';
export const REQUEST_EDIT_CREW = 'REQUEST_EDIT_CREW';
export const REQUEST_SUGGEST_CREWMEMBER = 'REQUEST_SUGGEST_CREWMEMBER';
export const RESPONSE_SUGGEST_CREWMEMBER = 'RESPONSE_SUGGEST_CREWMEMBER';
export const REQUEST_ADD_CREWMEMBER = 'REQUEST_ADD_CREWMEMBER';
export const REQUEST_DELETE_CREWMEMBER = 'REQUEST_DELETE_CREWMEMBER';
export const REQUEST_ADD_CREWIMAGE = 'REQUEST_ADD_CREWIMAGE';
export const REQUEST_ADD_CREWTEASERIMAGE = 'REQUEST_ADD_CREWTEASERIMAGE';

export const REQUEST_ADD_PERFORMANCE = 'REQUEST_ADD_PERFORMANCE';
export const REQUEST_DELETE_PERFORMANCE = 'REQUEST_DELETE_PERFORMANCE';
export const REQUEST_EDIT_PERFORMANCE = 'REQUEST_EDIT_PERFORMANCE';
export const REQUEST_ADD_PERFORMANCEIMAGE = 'REQUEST_ADD_PERFORMANCEIMAGE';
export const REQUEST_ADD_PERFORMANCETEASERIMAGE = 'REQUEST_ADD_PERFORMANCETEASERIMAGE';
export const REQUEST_ADD_PERFORMANCEVIDEO = 'REQUEST_ADD_PERFORMANCEVIDEO';
export const REQUEST_SUGGEST_PERFORMANCE_CREW = 'REQUEST_SUGGEST_PERFORMANCE_CREW';
export const RESPONSE_SUGGEST_PERFORMANCE_CREW = 'RESPONSE_SUGGEST_PERFORMANCE_CREW';
export const REQUEST_ADD_PERFORMANCE_CREW = 'REQUEST_ADD_PERFORMANCE_CREW';
export const REQUEST_DELETE_PERFORMANCE_CREW = 'REQUEST_DELETE_PERFORMANCE_CREW';
export const REQUEST_SUGGEST_PERFORMANCE_PERFORMER = 'REQUEST_SUGGEST_PERFORMANCE_PERFORMER';
export const RESPONSE_SUGGEST_PERFORMANCE_PERFORMER = 'RESPONSE_SUGGEST_PERFORMANCE_PERFORMER';
export const REQUEST_ADD_PERFORMANCE_PERFORMER = 'REQUEST_ADD_PERFORMANCE_PERFORMER';
export const REQUEST_DELETE_PERFORMANCE_PERFORMER = 'REQUEST_DELETE_PERFORMANCE_PERFORMER';

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

export function navigate(active) {
  return { type: NAVIGATE, active };
}

export function gotUser(json) {
  return { type: GOT_USER, json };
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

export function addEventImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENTIMAGE,
      payload: {
        eventId: id
      }
    });
    return fetch(`/account/api/event/${id}/image`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
    .then(json => dispatch(gotUser(json)));
  };
}

export function addEventTeaserImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENTTEASERIMAGE,
      payload: {
        eventId: id
      }
    });
    return fetch(`/account/api/event/${id}/teaser`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
    .then(json => dispatch(gotUser(json)));
  };
}

export function suggestEventPerformance(eventId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_EVENT_PERFORMANCE,
      payload: {
        q,
        eventId
      }
    });
    return fetch(`/account/api/search/performance?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_EVENT_PERFORMANCE,
          suggestions: json
        });
      });
  };
}

export function addEventPerformance(eventId, performanceId) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENT_PERFORMANCE
    });
    return fetch(`/account/api/event/${eventId}/performance/${performanceId}`, {
      method: 'PUT',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function removeEventPerformance(eventId, performanceId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_EVENT_PERFORMANCE,
      payload: {
        eventId,
        performanceId
      }
    });
    return fetch(`/account/api/event/${eventId}/performance/${performanceId}`, {
      method: 'DELETE',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function suggestEventOrganizer(eventId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_EVENT_ORGANIZER,
      payload: {
        q,
        eventId
      }
    });
    return fetch(`/account/api/search/user?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_EVENT_ORGANIZER,
          suggestions: json
        });
      });
  };
}

export function addEventOrganizer(eventId, organizerId) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENT_ORGANIZER
    });
    return fetch(`/account/api/event/${eventId}/organizer/${organizerId}`, {
      method: 'PUT',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function removeEventOrganizer(eventId, organizerId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_EVENT_ORGANIZER,
      payload: {
        eventId,
        organizerId
      }
    });
    return fetch(`/account/api/event/${eventId}/organizer/${organizerId}`, {
      method: 'DELETE',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function suggestEventOrganizingCrew(eventId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_EVENT_ORGANIZINGCREW,
      payload: {
        q,
        eventId
      }
    });
    return fetch(`/account/api/search/crew?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_EVENT_ORGANIZINGCREW,
          suggestions: json
        });
      });
  };
}

export function addEventOrganizingCrew(eventId, organizingCrewId) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENT_ORGANIZINGCREW
    });
    return fetch(`/account/api/event/${eventId}/organizingcrew/${organizingCrewId}`, {
      method: 'PUT',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function removeEventOrganizingCrew(eventId, organizingCrewId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_EVENT_ORGANIZINGCREW,
      payload: {
        eventId,
        organizingCrewId
      }
    });
    return fetch(`/account/api/event/${eventId}/organizingcrew/${organizingCrewId}`, {
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

export function suggestCrewMember(crewId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_CREWMEMBER,
      payload: {
        q,
        crewId
      }
    });
    return fetch(`/account/api/search/user?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_CREWMEMBER,
          suggestions: json
        });
      });
  };
}

export function addCrewMember(crewId, member) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_CREWMEMBER
    });
    return fetch(`/account/api/crew/${crewId}/member/${member.id}`, {
      method: 'PUT',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function removeCrewMember(crewId, member) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_CREWMEMBER,
      payload: {
        crewId,
        memberId: member._id
      }
    });
    return fetch(`/account/api/crew/${crewId}/member/${member._id}`, {
      method: 'DELETE',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function addCrewImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_CREWIMAGE,
      payload: {
        crewId: id
      }
    });
    return fetch(`/account/api/crew/${id}/image`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
    .then(json => dispatch(gotUser(json)));
  };
}

export function addCrewTeaserImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_CREWTEASERIMAGE,
      payload: {
        crewId: id
      }
    });
    return fetch(`/account/api/crew/${id}/teaser`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
    .then(json => dispatch(gotUser(json)));
  };
}

export function addPerformance(title) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCE
    });
    return fetch(
      '/account/api/performance', {
        method: 'POST',
        body: JSON.stringify({ title })
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function deletePerformance(id) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_PERFORMANCE,
      id
    });
    return fetch(
      `/account/api/performance/${id}`, {
        method: 'DELETE',
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function editPerformance(data) {
  return dispatch => {
    dispatch({
      type: REQUEST_EDIT_PERFORMANCE,
      id: data._id
    });
    return fetch(
      `/account/api/performance/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function addPerformanceImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCEIMAGE,
      payload: {
        performanceId: id
      }
    });
    return fetch(`/account/api/performance/${id}/image`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
    .then(json => dispatch(gotUser(json)));
  };
}

export function addPerformanceTeaserImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCETEASERIMAGE,
      payload: {
        performanceId: id
      }
    });
    return fetch(`/account/api/performance/${id}/teaser`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
    .then(json => dispatch(gotUser(json)));
  };
}

export function addPerformanceVideo({_id, video}) {
  return dispatch => {
    console.log('FIND ME', _id, video);
    dispatch({
      type: REQUEST_ADD_PERFORMANCEVIDEO,
      payload: {
        performanceId: _id,
        video: video
      }
    });
    return fetch(`/account/api/performance/${_id}/video`, {
      method: 'POST',
      body: JSON.stringify({ video})
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function suggestPerformanceCrew(performanceId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_PERFORMANCE_CREW,
      payload: {
        q,
        performanceId
      }
    });
    return fetch(`/account/api/search/crew?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_PERFORMANCE_CREW,
          suggestions: json
        });
      });
  };
}

export function addPerformanceCrew(performanceId, crewId) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCE_CREW
    });
    return fetch(`/account/api/performance/${performanceId}/crew/${crewId}`, {
      method: 'PUT',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function removePerformanceCrew(performanceId, crewId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_PERFORMANCE_CREW,
      payload: {
        performanceId,
        crewId
      }
    });
    return fetch(`/account/api/performance/${performanceId}/crew/${crewId}`, {
      method: 'DELETE',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function suggestPerformancePerformer(performanceId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_PERFORMANCE_PERFORMER,
      payload: {
        q,
        performanceId
      }
    });
    return fetch(`/account/api/search/user?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_PERFORMANCE_PERFORMER,
          suggestions: json
        });
      });
  };
}

export function addPerformancePerformer(performanceId, performerId) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCE_PERFORMER
    });
    return fetch(`/account/api/performance/${performanceId}/performer/${performerId}`, {
      method: 'PUT',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function removePerformancePerformer(performanceId, performerId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_PERFORMANCE_PERFORMER,
      payload: {
        performanceId,
        performerId
      }
    });
    return fetch(`/account/api/performance/${performanceId}/performer/${performerId}`, {
      method: 'DELETE',
    })
    .then(json => dispatch(gotUser(json)));
  };
}

export function openStagenameModal(dispatch) {
  return () => (
    dispatch({
      type: OPEN_STAGENAME_MODAL
    })
  );
}

export function closeStagenameModal(dispatch) {
  return () => (
    dispatch({
      type: CLOSE_STAGENAME_MODAL
    })
  );
}

export function openPasswordModal(dispatch) {
  return () => (
    dispatch({
      type: OPEN_PASSWORD_MODAL
    })
  );
}

export function closePasswordModal(dispatch) {
  return () => (
    dispatch({
      type: CLOSE_PASSWORD_MODAL
    })
  );
}

const wrapInFormData = (file) => {
  const formData = new FormData();
  formData.append('image', file, file.name);
  return formData;
};

export function addUserProfileImage(dispatch) {
  return (id, file) => {
    dispatch({
      type: REQUEST_ADD_USERPROFILEIMAGE,
      payload: {
        user: id
      }
    });
    return fetch(`/account/api/user/${id}/image/profile`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
    .then(json => dispatch(gotUser(json)));
  };
}

export function addUserTeaserImage(dispatch) {
  return (id, file) => {
    dispatch({
      type: REQUEST_ADD_USERTEASERIMAGE,
      payload: {
        user: id
      }
    });
    return fetch(`/account/api/user/${id}/image/teaser`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
    .then(json => dispatch(gotUser(json)));
  };
}

export function editUser(dispatch) {
  return data => {
    dispatch({
      type: REQUEST_EDIT_USER,
      id: data._id
    });
    return fetch(
      `/account/api/user/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function changeLanguage(dispatch) {
  return language => {
    dispatch({
      type: CHANGE_LANGUAGE,
      payload: {
        language
      }
    });
  };
}

export function fetchCountries(dispatch) {
  return () => {
    return fetch('/account/api/countries')
    .then(json => (
      dispatch({
        type: RESPONSE_COUNTRIES,
        payload: {
          countries: json
        }
      })
    ));
  };
}

export function addEventVenue(dispatch) {
  return (id, location) => {
    dispatch({
      type: REQUEST_ADD_EVENT_VENUE,
      payload: {
        event: id,
        location: location
      }
    });
    return fetch(
      '/account/api/event/venue', {
        method: 'POST',
        body: JSON.stringify({id, location })
      })
      .then(json => dispatch(gotUser(json)));
  };
};

export function removeEventVenue(dispatch) {
  return (eventId, venueId) => {
    dispatch({
      type: REQUEST_DELETE_EVENT_VENUE,
      payload: {
        event: eventId,
        venue: venueId
      }
    });
    return fetch(
      `/account/api/event/${eventId}/venue/${venueId}`, {
        method: 'DELETE'
      })
      .then(json => dispatch(gotUser(json)));
  };
};
