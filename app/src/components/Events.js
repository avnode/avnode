import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import EventAdd from './event/Add'
import EventShow from './event/Show'

const Events = props => {
  const { events } = props
  return (
    <div>
      <h1>Events</h1>
      <EventAdd />
      <ul>
        {events.map((event) =>
          <EventShow event={event} />
        )}
      </ul>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    events: state.user.events
  }
}

export default connect(mapStateToProps)(Events)
