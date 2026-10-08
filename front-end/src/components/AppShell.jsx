import Sidebar from './Sidebar'

export default function AppShell({ children, page, user, onLogout }) {
  return (
    <div className="app-shell">
      <Sidebar page={page} />
      <div className="app-main">
        <header className="app-topbar">
          <a className="mobile-brand" href="/">SkillSwap <strong>Campus</strong></a>
          {user && (
            <span className="preview-chip">
              <span /> CONNECTED ({user.email})
            </span>
          )}
          <button className="button button-quiet button-small" type="button" onClick={onLogout}>
            Log out
          </button>
          <nav className="mobile-app-nav" aria-label="Student navigation">
            <a className={page === 'dashboard' ? 'mobile-nav-active' : ''} href="/dashboard">Dashboard</a>
            <a className={page === 'profile' ? 'mobile-nav-active' : ''} href="/profile">Profile</a>
          </nav>
        </header>
        <main className="dashboard-content">{children}</main>
        <footer className="app-footer">SkillSwap Campus <span>·</span> Peer learning starts here.</footer>
      </div>
    </div>
  )
}
