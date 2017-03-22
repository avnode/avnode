import { connect } from 'preact-redux';
import {
  openStagenameModal,
  closeStagenameModal,
  openPasswordModal,
  closePasswordModal,
  addUserProfileImage,
  addUserTeaserImage,
  fetchCountries
} from '../reducers/actions';
import General from './General';

const mapStateToProps = ({user}) => ({
  user: user,
  initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
  openStagenameModal: dispatch(openStagenameModal),
  closeStagenameModal: dispatch(closeStagenameModal),
  openPasswordModal: dispatch(openPasswordModal),
  closePasswordModal: dispatch(closePasswordModal),
  addUserProfileImage: dispatch(addUserProfileImage),
  addUserTeaserImage: dispatch(addUserTeaserImage),
  saveProfile: (ev, props) => {
    console.log('HERE', ev, props);
  },
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(General);
