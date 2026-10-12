import AppShell from '../components/AppShell'
import { UserIcon } from '../components/Icons'

export default function StudentProfile({ user, onLogout }) {
  return (
    <AppShell page="discover" user={user} onLogout={onLogout}>
      <section className="discover-workspace student-profile-unavailable" role="status">
        <div className="discover-workspace-icon" aria-hidden="true">
          <UserIcon size={24} />
        </div>
        <span className="card-kicker">STUDENT PROFILE</span>
        <h1>Profile details aren’t available yet</h1>
        <p>
          The backend does not currently expose other students’ profiles or skills. A match score
          and Send Request action will appear once those APIs are available.
        </p>
        <a className="button button-secondary" href="/discover">Back to Discover</a>
      </section>
    </AppShell>
  )
}
