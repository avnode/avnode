import { h } from 'preact';
import { FormattedMessage } from 'preact-intl';

const Nav = () => {
  return (
    <nav className="nav nav-pills nav-justified">
      <a className="nav-link" href="/account/profile">
        <FormattedMessage
          id="nav.profile"
          defaultMessage="Profile"
        />
      </a>
      <a className="nav-link" href="/account/events">
        <FormattedMessage
          id="nav.events"
          defaultMessage="Events"
        />
      </a>
      <a className="nav-link" href="/account/crews">
        <FormattedMessage
          id="nav.crews"
          defaultMessage="Crews"
        />
      </a>
      <a className="nav-link" href="/account/preferences">
        <FormattedMessage
          id="nav.preferences"
          defaultMessage="Preferences"
        />
      </a>
    </nav>
  );
};

export default Nav;
