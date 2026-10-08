import Brand from './Brand'

export default function Navbar({ page, user, onLogout }) {
  const isAppPage = page === 'dashboard' || page === 'profile'
  const isAuthenticated = Boolean(user)

  return (
    <header className="site-header">
      <Brand />
      <nav className="header-nav" aria-label="Main navigation">
        {isAuthenticated || isAppPage ? (
          <>
            <a className={page === 'dashboard' ? 'nav-active' : ''} href="/dashboard">Dashboard</a>
            <a className={page === 'profile' ? 'nav-active' : ''} href="/profile">Profile</a>
            <button className="button button-quiet button-small" type="button" onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <a href="#how-it-works">How it works</a>
            <a className="nav-login" href="/login">Log in</a>
            <a className="button button-primary button-small" href="/register">Join the campus</a>
          </>
        )}
      </nav>
    </header>
  )
}
