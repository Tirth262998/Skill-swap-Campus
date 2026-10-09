import Brand from './Brand'
import { HomeIcon, UserIcon, SkillsIcon, DiscoverIcon } from './Icons'

export default function Sidebar({ page }) {
  return (
    <aside className="app-sidebar">
      <Brand light />
      <nav className="side-nav" aria-label="Student navigation">
        <span className="side-label">YOUR SPACE</span>
        <a className={page === 'dashboard' ? 'side-link side-active' : 'side-link'} href="/dashboard">
          <span className="side-icon-wrap" aria-hidden="true">
            <HomeIcon size={16} />
          </span>
          Dashboard
        </a>
        <a className={page === 'profile' ? 'side-link side-active' : 'side-link'} href="/profile">
          <span className="side-icon-wrap" aria-hidden="true">
            <UserIcon size={16} />
          </span>
          My profile
        </a>
        <a className={page === 'skills' ? 'side-link side-active' : 'side-link'} href="/skills">
          <span className="side-icon-wrap" aria-hidden="true">
            <SkillsIcon size={16} />
          </span>
          Skills
        </a>

        <span className="side-label side-label-later">COMING LATER</span>
        <span className="side-link side-disabled" aria-disabled="true">
          <span className="side-icon-wrap" aria-hidden="true">
            <DiscoverIcon size={16} />
          </span>
          Discover
        </span>
      </nav>

      <div className="sidebar-bottom">
        <p className="sidebar-quote">Good things happen<br />when we share.</p>
      </div>
    </aside>
  )
}
