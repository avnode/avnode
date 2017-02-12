import { h } from 'preact';
import { connect } from 'preact-redux'

import { editEvent } from '../reducers/actions'

const EditEvent = ({ dispatch }) => {
  let input
  return (
    <div>
      Edit Form
    </div>
  )
}
export default connect()(EditEvent)
