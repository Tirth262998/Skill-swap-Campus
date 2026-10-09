import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'

export default function AppShell({ children, page, user, onLogout }) {
  return (
    <div className="app-shell">
      <Sidebar page={page} />
      <div className="app-main">
        <header className="app-topbar">
          <a className="mobile-brand" href="/">SkillSwap <strong>Campus</strong></a>
          <div className="topbar-actions">
            {user && (
              <span className="preview-chip">
                <span /> CONNECTED ({user.email})
              </span>
            )}
            <ThemeToggle />
            <button className="button button-quiet button-small" type="button" onClick={onLogout}>
              Log out
            </button>
          </div>
          <nav className="mobile-app-nav" aria-label="Student navigation">
            <a className={page === 'dashboard' ? 'mobile-nav-active' : ''} href="/dashboard">Dashboard</a>
            <a className={page === 'profile' ? 'mobile-nav-active' : ''} href="/profile">Profile</a>
            <a className={page === 'skills' ? 'mobile-nav-active' : ''} href="/skills">Skills</a>
          </nav>
        </header>
        <main className="dashboard-content">{children}</main>
        <footer className="app-footer">SkillSwap Campus <span>·</span> Peer learning starts here.</footer>
      </div>
    </div>
  )
}
