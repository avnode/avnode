import { h } from 'preact'
import { connect } from 'preact-redux'

import { removeEvent, editEvent } from '../../reducers/actions'

const EventShow = ({event, dispatch}) => {
  return (
    <li class="list-group-item justify-content-between">
      {event.title}
      <span>
        <a class="btn btn-secondary" href="#" onClick={e => { dispatch(removeEvent(event._id)) }}><i class="fa fa-trash"></i></a>
        <a class="btn btn-secondary" href={'/account/events/' + event._id}><i class="fa fa-edit"></i></a>
      </span>
    </li>
  )
}

export default connect()(EventShow)
