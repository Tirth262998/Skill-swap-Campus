import Brand from './Brand'

export default function Sidebar({ page }) {
  return (
    <aside className="app-sidebar">
      <Brand light />
      <nav className="side-nav" aria-label="Student navigation">
        <span className="side-label">YOUR SPACE</span>
        <a className={page === 'dashboard' ? 'side-link side-active' : 'side-link'} href="/dashboard">
          <span aria-hidden="true">⌂</span> Dashboard
        </a>
        <a className={page === 'profile' ? 'side-link side-active' : 'side-link'} href="/profile">
          <span aria-hidden="true">◉</span> My profile
        </a>
        <span className="side-label side-label-later">COMING LATER</span>
        <span className="side-link side-disabled" aria-disabled="true">
          <span aria-hidden="true">✦</span> Skills
        </span>
        <span className="side-link side-disabled" aria-disabled="true">
          <span aria-hidden="true">⌕</span> Discover
        </span>
      </nav>
      <div className="sidebar-bottom">
        <p>Good things happen<br />when we share.</p>
        <span className="sidebar-flower" aria-hidden="true">✳</span>
      </div>
    </aside>
  )
}
