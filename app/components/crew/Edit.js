import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';

import { editCrew } from '../../reducers/actions';

let CrewForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Field name="_id" component="input" type="hidden" />
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <Field className="form-control" name="name" component="input" type="text" value={props.name} />
      </div>
      <button className="btn btn-primary" type="submit">Submit</button>
    </form>
  );
};

CrewForm = reduxForm({ form: 'crew' })(CrewForm);

const EditCrew = props => {
  let { crew } = props;
  const onSubmit = (props, dispatch) => {
    dispatch(editCrew(props));
  };
  const onSubmitSuccess = () => {
    route('/account/crews');
  };
  return (
    <CrewForm
      initialValues={crew}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    crew: (state.user.crews.find(c => { return c._id === props._id; })),
    user: state.user
  };
};

export default connect(mapStateToProps)(EditCrew);
