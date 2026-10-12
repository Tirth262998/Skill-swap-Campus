import AppShell from '../components/AppShell'
import { DiscoverIcon } from '../components/Icons'

export default function Discover({ user, onLogout }) {
  return (
    <AppShell page="discover" user={user} onLogout={onLogout}>
      <div className="page-intro">
        <span className="eyebrow">YOUR CAMPUS, YOUR COMMUNITY</span>
        <h1>Discover students</h1>
        <p>Find classmates to exchange skills and learn together.</p>
      </div>

      <section className="discover-workspace" aria-labelledby="discover-heading">
        <div className="discover-workspace-icon" aria-hidden="true">
          <DiscoverIcon size={24} />
        </div>
        <span className="card-kicker">COMING SOON</span>
        <h2 id="discover-heading">Student discovery needs a directory API</h2>
        <p>
          The current backend only provides your own profile and skills. It does not yet provide
          other students’ profiles and skills, so this page cannot show real matches or enable
          search and filters without inventing data.
        </p>
        <div className="discover-requirements">
          <strong>Needed from the backend</strong>
          <ul>
            <li>An authenticated directory response with student profiles and each student’s skills</li>
            <li>A public student profile lookup by student ID, including that student’s skills</li>
            <li>An exchange-request endpoint with duplicate/pending-request behavior</li>
          </ul>
        </div>
      </section>
    </AppShell>
  )
}
