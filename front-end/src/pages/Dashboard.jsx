import AppShell from '../components/AppShell'
import { CheckIcon, SkillsIcon } from '../components/Icons'

export default function Dashboard({ user, profile, onLogout }) {
  const isProfileComplete = Boolean(user?.profileCompleted || profile)

  return (
    <AppShell page="dashboard" user={user} onLogout={onLogout}>
      <div className="page-intro">
        <span className="eyebrow">YOUR CAMPUS, YOUR COMMUNITY</span>
        <h1>Welcome, {user?.name || 'Student'}</h1>
        <p>Your learning journey begins with the people around you.</p>
      </div>

      <div className="dashboard-grid">
        <section className="welcome-card">
          <div className="welcome-copy">
            <span className="card-kicker">STUDENT ACCOUNT</span>
            <h2>{user?.department || 'Campus'} — Year {user?.year || '1'}</h2>
            <p>Logged in as <strong>{user?.email}</strong>. Share skills and connect with classmates.</p>
            <a className="button button-light" href="/profile">
              {isProfileComplete ? 'Edit your profile' : 'Create profile'} <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="completion-card">
          <div className="card-title-row">
            <div>
              <span className="card-kicker">YOUR PROFILE</span>
              <h2>Profile Status</h2>
            </div>
            <span
              className={`completion-icon ${isProfileComplete ? 'completion-icon-done' : 'completion-icon-pending'}`}
              aria-hidden="true"
            >
              {isProfileComplete ? <CheckIcon size={18} /> : <span className="pending-dot" />}
            </span>
          </div>

          <div className="progress-label">
            <span>Profile completion</span>
            <span style={{ color: isProfileComplete ? '#1e7e45' : '#b27715', fontWeight: 650 }}>
              {isProfileComplete ? 'Complete' : 'Incomplete'}
            </span>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-label="Profile completion progress"
            aria-valuenow={isProfileComplete ? 100 : 33}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span
              style={{
                width: isProfileComplete ? '100%' : '33%',
                background: isProfileComplete ? '#1e7e45' : '#c88f28',
              }}
            />
          </div>

          <p>
            {isProfileComplete
              ? 'Your student profile is active. You can keep it updated anytime.'
              : 'Complete your profile details to tell your campus community about yourself.'}
          </p>
          <a className="text-link" href="/profile">
            {isProfileComplete ? 'Manage profile details' : 'Complete profile now'} <span aria-hidden="true">→</span>
          </a>
        </section>
      </div>

      <section className="next-step-card">
        <div className="next-step-icon" aria-hidden="true">
          <SkillsIcon size={20} />
        </div>
        <div className="next-step-copy">
          <span className="card-kicker">YOUR NEXT STEP</span>
          <h2>Manage your skills</h2>
          <p>Add the skills you can teach and the ones you want to learn.</p>
        </div>
        <a className="button button-primary button-small" href="/skills">
          Manage skills <span aria-hidden="true">→</span>
        </a>
      </section>
    </AppShell>
  )
}
