import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import { removeEvent } from '../reducers/actions'

const Event = ({event, dispatch}) => {
  return (
    <li>
      {event.title} <a onClick={e => { dispatch(removeEvent(event.id)) }}>remove</a>
    </li>
  )
}

export default connect()(Event)
