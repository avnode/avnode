import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage} from 'preact-intl';

import { editCrew, suggestCrewMember, addCrewMember } from '../../reducers/actions';

const Member = ({member}) => {
  return (
    <li className="list-group-item justify-content-between">
      <span>{member.name}</span>
      { /*
      <a className="btn btn-danger ajax" href="#">
        i.fa.fa-trash
      </a> */ }
      { /*
       each member in members
         li.list-group-item.justify-content-between
           if member.id == user.id
             span
               =member.name
               i.badge.badge-default.badge-pill=__("Me")
           else
             span=member.name
           a.btn.btn-danger.ajax(
             href='#'
             data-method='delete'
             data-endpoint=crew.editUrl + '/members/' + member._id,
             data-confirm='true'
           )
             i.fa.fa-trash
        */ }
    </li>
  );
};

let CrewForm = props => {
  const { handleSubmit, dispatch, crew } = props;
  const memberSuggestions = props.user._memberSuggestions || [];
  const findMember = (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      return dispatch(suggestCrewMember(e.target.value));
    } // FIXME: handle reset
  };
  const addMember = (crewId) => (member) => (e) => {
    e.preventDefault();
    return dispatch(addCrewMember(crewId, member));
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header">
          <FormattedMessage id="crew.edit.headline" defaultMessage="Crew Details" />
        </div>
        <div className="card-block">
          <Field name="_id" component="input" type="hidden" />
          <div className="form-group">
            <label htmlFor="name">
              <FormattedMessage id="crew.edit.form.label.name" defaultMessage="Name" />
            </label>
            <Field className="form-control" name="name" component="input" type="text" value={props.name} />
          </div>
          <div className="formGroup">
            { /*
               if crew.image
                 img.img-thumbnail.mb-3(
                   src=crew.imageUrl
                 )
               else
                 p=__('Upload image')
               label.custom-file
                 input.custom-file-input(
                   type='file'
                   name='image'
                 )
                 span.custom-file-control
              */} 
          </div>
          <div className="form-group">
            <label htmlFor="about">
              <FormattedMessage id="crew.edit.form.label.about" defaultMessage="About" />
            </label>
            <Field className="form-control" name="about" component="textarea" value={props.about} />
          </div>
          <div className="form-group">
            <label htmlFor="members">
              <FormattedMessage id="crew.edit.form.label.members" defaultMessage="Members" />
            </label>
            <ul className="list-group">
              {/* props.members.map((m) => (
                  <Member member={m} />
                )) */
              }
            </ul>
          </div>
          <div className="form-group">
            <label htmlFor="member">
              <FormattedMessage id="crew.edit.form.label.about" defaultMessage="Invite others" />
            </label>
            <input
              className="form-control"
              type="text"
              autocomplete="off"
              placeholder={props.intl.formatMessage({id: "crew.edit.form.label.about", defaultMessage:"Type to find users…"})}
              onKeyUp={ findMember }
            />
            <div className="mt-1">
              { memberSuggestions.map((m) => (
                <button
                  type="button"
                  className="btn btn-secondary btn-block text-left"
                  onClick={ addMember(props._id)(m) }
                >
                    {m.stagename} ({m.name})
                  </button>
                ))
              }
            </div>
          </div>
          <div className="form-group">
            <button className="btn btn-primary" type="submit">
              <FormattedMessage id="general.form.save" defaultMessage="Save" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

CrewForm = injectIntl(reduxForm({ form: 'crew' })(CrewForm));

const EditCrew = props => {
  const memberSuggestions = props._memberSuggestions || [];
  //memberSuggestions={memberSuggestions}
  const onSubmit = (props, dispatch) => {
    dispatch(editCrew(props));
  };
  const onSubmitSuccess = () => {
    route('/account/crews');
  };
  return (
    <CrewForm
      initialValues={props.crew}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    crew: (state.user.crews.find(c => { return c._id === props._id; })),
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps)(EditCrew);
