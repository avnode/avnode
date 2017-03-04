import { h } from 'preact'
import { connect } from 'preact-redux'
import { route } from 'preact-router'
import { Field, reduxForm } from 'redux-form';

import { editEvent, postEvent } from '../../reducers/actions'

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

EventForm = reduxForm({ form: 'event' })(EventForm);

const EditEvent = props => {
  let { _id, event, user } = props
  const onSubmit = (props, dispatch) => {
    dispatch(editEvent(props));
    dispatch(postEvent(props));
  }
  const onSubmitSuccess = () => {
    route('/events')
  }
  return (
    <EventForm
      initialValues={event}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
    />
  )
}

const mapStateToProps = (state, props) => {
  return {
    event: (state.user.events.find(event => { return event._id === props._id })),
    user: state.user
  }
}

export default connect(mapStateToProps)(EditEvent)
