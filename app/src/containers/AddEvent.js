import { h } from 'preact';
import { connect } from 'preact-redux'

import { addEvent } from '../reducers/actions'

const AddEvent = ({ dispatch }) => {
  let input
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        //if (!input.value.trim()) {
        //  return
        //}
        dispatch(addEvent(input.value))
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Add Event
        </button>
      </form>
    </div>
  )
}
export default connect()(AddEvent)
