import { h } from 'preact';

const Nav = () => {
  return (
    <nav className="nav nav-pills nav-justified">
      <a className="nav-link" href="/account/general">General</a>
      <a className="nav-link" href="/account/events">Events</a>
      <a className="nav-link" href="/account/crews">Crews</a>
    </nav>
  );
};

export default Nav;
