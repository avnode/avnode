import { h } from 'preact'
import { connect } from 'preact-redux'

import { removeEvent, editEvent } from '../../reducers/actions'

const EventShow = ({event, dispatch}) => {
  return (
    <li>
      {event.title}
      <a href="#" onClick={e => { dispatch(removeEvent(event._id)) }}>remove</a>
      <a href={'/account/events/' + event._id}>ba  sdfasd   f </a>
    </li>
  )
}

export default connect()(EventShow)
