import Brand from './Brand.jsx'
import ThemeToggle from './ThemeToggle.jsx'

function SiteHeader({ page, theme, onToggleTheme }) {
  const isAppPage = page === 'dashboard' || page === 'profile'

  return (
    <header className="site-header">
      <Brand />
      <nav className="header-nav" aria-label="Main navigation">
        {isAppPage ? (
          <>
            <a className={page === 'dashboard' ? 'nav-active' : ''} href="/dashboard">Dashboard</a>
            <a className={page === 'profile' ? 'nav-active' : ''} href="/profile">Profile</a>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button className="button button-quiet button-small" type="button" disabled title="Authentication integration is pending">
              Log out
            </button>
          </>
        ) : (
          <>
            <a href="#how-it-works">How it works</a>
            <a className="nav-login" href="/login">Log in</a>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <a className="button button-primary button-small" href="/register">Join the campus</a>
          </>
        )}
      </nav>
    </header>
  )
}

export default SiteHeader
