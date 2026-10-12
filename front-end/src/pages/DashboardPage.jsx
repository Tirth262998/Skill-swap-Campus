import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'

function DashboardPage({ theme, onToggleTheme }) {
  return (
    <AppShell page="dashboard" theme={theme} onToggleTheme={onToggleTheme}>
      <div className="page-intro">
        <span className="eyebrow">YOUR CAMPUS, YOUR COMMUNITY</span>
        <h1>Welcome to SkillSwap</h1>
        <p>Your learning journey begins with the people around you.</p>
      </div>
      <div className="dashboard-grid">
        <section className="welcome-card">
          <div className="welcome-copy">
            <span className="card-kicker">A PLACE TO LEARN & SHARE</span>
            <h2>There’s a little teacher in all of us.</h2>
            <p>Your account and profile details will appear here once authentication is connected.</p>
            <a className="button button-light" href="/profile">Preview profile <span aria-hidden="true">→</span></a>
          </div>
          <div className="welcome-decoration" aria-hidden="true"><Icon name="users" /></div>
        </section>
        <section className="completion-card">
          <div className="card-title-row"><div><span className="card-kicker">YOUR PROFILE</span><h2>Getting started</h2></div><span className="completion-icon"><Icon name="user" /></span></div>
          <div className="progress-label"><span>Profile completion</span><span>Unavailable</span></div>
          <div className="progress-track" role="progressbar" aria-label="Profile completion unavailable until profile fields are confirmed" aria-valuetext="Unavailable">
            <span />
          </div>
          <p>Completion will be calculated from required profile fields once the backend model is confirmed. Skills are not included.</p>
          <a className="text-link" href="/profile">View profile preview <span aria-hidden="true">→</span></a>
        </section>
      </div>
      <section className="next-step-card">
        <div className="next-step-icon"><Icon name="book" /></div>
        <div className="next-step-copy"><span className="card-kicker">YOUR NEXT STEP</span><h2>Add your skills</h2><p>Skills are part of Week 2 and will be available later.</p></div>
        <button className="button button-disabled" type="button" disabled>Add skills <span aria-hidden="true">→</span></button>
      </section>
      <div className="dashboard-note" role="status"><span aria-hidden="true">i</span> This is a visual preview. No account data or authentication session is active.</div>
    </AppShell>
  )
}

export default DashboardPage
