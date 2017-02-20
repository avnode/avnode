import { h } from 'preact'
import { connect } from 'preact-redux'
import { route } from 'preact-router'
import { Field, reduxForm } from 'redux-form';

import { editEvent } from '../../reducers/actions'

let EventForm = props => {
  const { handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="_id" component="input" type="hidden" />
      <div>
        <label htmlFor="title">Title</label>
        <Field name="title" component="input" type="text" value={props.title} />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

EventForm = reduxForm({
  form: 'event',
  onSubmit: (props, dispatch, a, b) => {
    dispatch(editEvent(props));
    route('/events');
  }
})(EventForm);

const EditEvent = props => {
  let { _id, event } = props
  return (
    <EventForm initialValues={event} />
  )
}

const mapStateToProps = (state, props) => {
  return {
    event: (state.user.events.find(item => { return item._id === props._id }))
  }
}

export default connect(mapStateToProps)(EditEvent)
