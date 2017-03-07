import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import {
  editCrew,
  suggestCrewMember,
  addCrewMember,
  addCrewImage,
  removeCrewMember,
} from '../../reducers/actions';
import ImageDropzone from '../ImageDropzone';

const Member = injectIntl(({member, me, onDelete, intl}) => {
  const meLabel = intl.formatMessage({
    id: "crew.edit.form.member.met",
    defaultMessage:"Me"
  });
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {`${member.stagename} `}
        { (member._id === me) ?
          <i className="badge badge-default badge-pill">{meLabel}</i>
          : null
        }
      </span>
      <button
        type="button"
        className="btn btn-danger"
        onClick={onDelete}
      >
        <i className="fa fa-trash"></i>
      </button>
    </li>
  );
});

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

  const removeMember = (crewId) => (member) => (e) => {
    e.preventDefault();
    return dispatch(removeCrewMember(crewId, member));
  };

  const onImageDrop = (crewId) => (files, _something, ev) => {
    const file = files[0];
    return dispatch(addCrewImage(crewId, file));
  };

  // FIXME: Get url from backend somehow…
  const getImageUrl = (image) => {
    return `/storage/${image._id}/1920/400`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="card-header">
          <FormattedMessage
            id="crew.edit.headline"
            defaultMessage="Crew Details"
          />
        </div>
        <div className="card-block">
          <Field
            name="_id"
            component="input"
            type="hidden"
          />

          <div className="form-group">
            <label htmlFor="name">
              <FormattedMessage
                id="crew.edit.form.label.name"
                defaultMessage="Name"
              />
            </label>
            <Field
              className="form-control"
              name="name"
              component="input"
              type="text"
              value={props.name}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">
              <FormattedMessage
                id="crew.edit.form.label.image"
                defaultMessage="Image"
              />
            </label>
            { crew && crew.image ?
              <img
                className="img-thumbnail mb-3"
                src={getImageUrl(crew.image)}
                alt={`image of ${crew.name}`}
                /> :
              null
            }
            <ImageDropzone
              imageUploadInProgress={(crew && crew.imageUploadInProgress)}
              onDrop={onImageDrop(props._id)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="about">
              <FormattedMessage
                id="crew.edit.form.label.about"
                defaultMessage="About"
              />
            </label>
            <Field
              className="form-control"
              name="about"
              component="textarea"
              value={props.about}
            />
          </div>

          <div className="form-group">
            <label htmlFor="members">
              <FormattedMessage
                id="crew.edit.form.label.members"
                defaultMessage="Members"
              />
            </label>
            <ul className="list-group">
              { crew && crew.members.map((m) => (
                <Member
                  member={m}
                  me={props.user._id}
                  onDelete={removeMember(crew._id)(m)}
                />
                ))
              }
            </ul>
          </div>

          <div className="form-group">
            <label htmlFor="member">
              <FormattedMessage
                id="crew.edit.form.label.about"
                defaultMessage="Invite others"
              />
            </label>
            <input
              className="form-control"
              type="text"
              autocomplete="off"
              placeholder={props.intl.formatMessage({
                id: "crew.edit.form.label.about",
                defaultMessage:"Type to find users…"
              })}
              onKeyUp={ findMember }
            />
            <div className="mt-1 list-group">
              { memberSuggestions.map((m) => (
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                  onClick={ addMember(props._id)(m) }
                >
                    {m.stagename} ({m.name})
                  </button>
                ))
              }
            </div>
          </div>

          <div className="form-group">
            <button
              className="btn btn-primary"
              type="submit"
            >
              <FormattedMessage
                id="general.form.save"
                defaultMessage="Save"
              />
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
