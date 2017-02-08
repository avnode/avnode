const getEvents = (events) => {
  return events;
}

const mapStateToProps = (state) => {
  return {
    events: getEvents(state.todos, state.visibilityFilter)
  }
}

const mapDispatchToProps = (dispatch) {
  return {};
}

Events = connect()(mapStateToProps, mapDispatchToProps)(Events)
export default Events
