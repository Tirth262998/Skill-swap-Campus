import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'

function ProfilePage({ theme, onToggleTheme }) {
  return (
    <AppShell page="profile" theme={theme} onToggleTheme={onToggleTheme}>
      <div className="page-intro">
        <span className="eyebrow">YOUR SPACE</span>
        <h1>My profile</h1>
        <p>A little about you helps your campus community get to know you.</p>
      </div>
      <section className="profile-placeholder">
        <div className="profile-placeholder-icon"><Icon name="user" /></div>
        <span className="card-kicker">PROFILE FORM PENDING</span>
        <h2>Waiting for the profile contract</h2>
        <p>Profile fields, validation rules, and save behavior will be added after the backend model and API are confirmed. No unsupported fields are shown or submitted.</p>
        <div className="pending-list">
          <span><i aria-hidden="true" /> <b>01</b> Backend-supported profile fields</span>
          <span><i aria-hidden="true" /> <b>02</b> Required-field and completion rules</span>
          <span><i aria-hidden="true" /> <b>03</b> Create, view, and update API details</span>
        </div>
        <button className="button button-disabled" type="button" disabled><span aria-hidden="true">◷</span> Save profile — not connected</button>
      </section>
    </AppShell>
  )
}

export default ProfilePage
