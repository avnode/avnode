import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import Event from './event'

const Events = ({events}) => (
  <ul>
    {events.map((event) =>
      <Event event={event} />
    )}
  </ul>
)

const mapStateToProps = (state) => {
  return {
    events: state.events
  }
}

export default connect(mapStateToProps)(Events)
