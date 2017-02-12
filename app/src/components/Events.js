import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import Event from './event'
import AddEvent from '../containers/AddEvent'

const Events = ({events}) => (
  <div>
    <h1>Events</h1>
    <AddEvent />
    <ul>
      {events.map((event) =>
        <Event event={event} />
      )}
    </ul>
  </div>
)

const mapStateToProps = (state) => {
  return {
    events: state.events
  }
}

export default connect(mapStateToProps)(Events)
