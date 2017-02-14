import { h } from 'preact'
import { connect } from 'preact-redux'

import { removeEvent } from '../reducers/actions'
import { editEvent } from '../reducers/actions'

const Event = ({event, dispatch}) => {
  return (
    <li>
      {event.title}
      <a href="#" onClick={e => { dispatch(removeEvent(event.id)) }}>remove</a>
      <a href={'/events/' + event.id}>edit</a>
    </li>
  )
}

export default connect()(Event)
