import { h } from 'preact';
import { connect } from 'preact-redux';
import { navigate } from '../reducers/actions';
import { FormattedMessage } from 'preact-intl';
import { route, Router, Route, Link } from 'preact-router';

const Nav = ({active, dispatch}) => {
  const classes = (path) => {
    return (active === path) ? 'nav-link active' : 'nav-link'
  }
  return (
    <nav id="account-nav" class="nav nav-pills nav-justified">
      <a className={classes('/account/profile')} href="/account/profile" onClick={e => { dispatch(navigate('/account/profile')) }}>
        <FormattedMessage
          id="nav.profile"
          defaultMessage="Profile"
        />
      </a>
      <a className={classes('/account/events')} href="/account/events" onClick={e => { dispatch(navigate('/account/events')) }}>
        <FormattedMessage
          id="nav.events"
          defaultMessage="Events"
        />
      </a>
      <a className={classes('/account/crews')} href="/account/crews" onClick={e => { dispatch(navigate('/account/crews')) }}>
        <FormattedMessage
          id="nav.crews"
          defaultMessage="Crews"
        />
      </a>
      <a className={classes('/account/preferences')} href="/account/preferences" onClick={e => { dispatch(navigate('/account/preferences')) }}>
        <FormattedMessage
          id="nav.preferences"
          defaultMessage="Preferences"
        />
      </a>
    </nav>
  );
};

const mapStateToProps = ({user}) => ({
  active: user.active
});

export default connect(mapStateToProps)(Nav);
