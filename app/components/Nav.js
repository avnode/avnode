import { h } from 'preact'
import { connect } from 'preact-redux'
import Router from 'preact-router';

const Nav = () => {
  return (
    <nav class="nav nav-pills nav-justified">
      <a class="nav-link" href="/account/general">General</a>
      <a class="nav-link" href="/account/events">Events</a>
      <a class="nav-link" href="/account/crews">Crews</a>
    </nav>
  )
}

export default Nav
