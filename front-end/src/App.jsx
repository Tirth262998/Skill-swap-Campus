import './App.css'

const pageFromPath = () => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return 'home'
  if (path === '/register') return 'register'
  if (path === '/login') return 'login'
  if (path === '/dashboard') return 'dashboard'
  if (path === '/profile') return 'profile'
  return 'notFound'
}

function Brand({ light = false }) {
  return (
    <a className={`brand${light ? ' brand-light' : ''}`} href="/" aria-label="SkillSwap Campus home">
      <span className="brand-mark" aria-hidden="true">S</span>
      <span>SkillSwap <strong>Campus</strong></span>
    </a>
  )
}

function Header({ page }) {
  const isAppPage = page === 'dashboard' || page === 'profile'

  return (
    <header className="site-header">
      <Brand />
      <nav className="header-nav" aria-label="Main navigation">
        {isAppPage ? (
          <>
            <a className={page === 'dashboard' ? 'nav-active' : ''} href="/dashboard">Dashboard</a>
            <a className={page === 'profile' ? 'nav-active' : ''} href="/profile">Profile</a>
            <button className="button button-quiet button-small" type="button" disabled title="Authentication integration is pending">
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

function LandingPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow"><span className="status-dot" /> LEARN FROM YOUR CAMPUS</span>
          <h1>Good at something?<br /><span>Pass it on.</span></h1>
          <p className="hero-description">
            SkillSwap Campus is a peer-to-peer campus skill exchange.
            Share what you know and find a fellow student who can teach
            you something new.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/register">Create your account <span aria-hidden="true">→</span></a>
            <a className="button button-secondary" href="/login">I already have an account</a>
          </div>
          <p className="hero-footnote">Made for students, powered by each other.</p>
        </div>
        <div className="hero-art" aria-label="Illustration of students exchanging ideas" role="img">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-sun" />
          <div className="art-card card-blue"><span className="art-icon">✦</span><span>Teach what<br />you know</span></div>
          <div className="art-card card-cream"><span className="art-icon">↗</span><span>Learn something<br />new</span></div>
          <div className="art-center"><span className="center-star">✳</span><span>share<br /><b>skills</b></span></div>
          <span className="art-spark spark-one" aria-hidden="true">✳</span>
          <span className="art-spark spark-two" aria-hidden="true">✦</span>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span className="eyebrow">A LITTLE GIVE. A LOT TO GAIN.</span>
          <h2>Your campus is full of teachers.</h2>
          <p>They just might be sitting right next to you.</p>
        </div>
        <div className="steps-grid">
          <article className="step-card">
            <span className="step-number">01</span>
            <h3>Bring your curiosity</h3>
            <p>Tell your campus community what you enjoy learning and what you can share.</p>
          </article>
          <article className="step-card">
            <span className="step-number">02</span>
            <h3>Meet a peer</h3>
            <p>Connect with students who are excited to trade time, ideas, and know-how.</p>
          </article>
          <article className="step-card">
            <span className="step-number">03</span>
            <h3>Grow together</h3>
            <p>Every exchange is a chance to learn something and help someone else do the same.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

function AuthPage({ mode }) {
  const isRegister = mode === 'register'

  return (
    <main className="auth-layout">
      <section className="auth-aside">
        <div className="aside-decoration" aria-hidden="true">✳</div>
        <span className="eyebrow">YOUR NEXT SKILL STARTS HERE</span>
        <h1>{isRegister ? 'Make room for a new kind of learning.' : 'Welcome back to your campus.'}</h1>
        <p>{isRegister
          ? 'A community where everyone has something to teach and something to learn.'
          : 'Pick up where curiosity left off. Your campus community is here.'}</p>
        <div className="aside-note"><span aria-hidden="true">✦</span> Learning is better together.</div>
      </section>
      <section className="auth-panel">
        <a className="back-link" href="/">← <span>Back to home</span></a>
        <div className="form-heading">
          <span className="eyebrow">{isRegister ? 'GET STARTED' : 'GOOD TO SEE YOU'}</span>
          <h2>{isRegister ? 'Create your account' : 'Log in'}</h2>
          <p>{isRegister ? 'Join your campus skill-sharing community.' : 'Sign in to continue your skill journey.'}</p>
        </div>
        <div className="integration-notice" role="status">
          <span className="notice-icon" aria-hidden="true">i</span>
          <p><strong>Preview only.</strong> Form submission is disabled until the backend API contract is available. No credentials will be sent.</p>
        </div>
        <form className="auth-form">
          {isRegister && (
            <div className="field">
              <label htmlFor="full-name">Full name <span className="field-note">preview field</span></label>
              <input id="full-name" name="fullName" type="text" autoComplete="name" placeholder="e.g. Alex Morgan" disabled />
            </div>
          )}
          <div className="field">
            <label htmlFor={`${mode}-email`}>Email address <span className="field-note">preview field</span></label>
            <input id={`${mode}-email`} name="email" type="email" autoComplete="email" placeholder="you@university.edu" disabled />
          </div>
          <div className="field">
            <label htmlFor={`${mode}-password`}>Password <span className="field-note">preview field</span></label>
            <input id={`${mode}-password`} name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="Enter your password" disabled />
          </div>
          {isRegister && (
            <div className="field">
              <label htmlFor="confirm-password">Confirm password <span className="field-note">preview field</span></label>
              <input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Enter your password again" disabled />
            </div>
          )}
          <button className="button button-primary auth-submit" type="submit" disabled>
            {isRegister ? 'Create account' : 'Log in'} <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New to SkillSwap Campus?'}
          {' '}<a href={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</a>
        </p>
        <p className="form-footnote">Displayed fields are a UI preview, not a confirmed API request schema.</p>
      </section>
    </main>
  )
}

function AppShell({ children, page }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Brand light />
        <nav className="side-nav" aria-label="Student navigation">
          <span className="side-label">YOUR SPACE</span>
          <a className={page === 'dashboard' ? 'side-link side-active' : 'side-link'} href="/dashboard"><span aria-hidden="true">⌂</span> Dashboard</a>
          <a className={page === 'profile' ? 'side-link side-active' : 'side-link'} href="/profile"><span aria-hidden="true">◉</span> My profile</a>
          <span className="side-label side-label-later">COMING LATER</span>
          <span className="side-link side-disabled" aria-disabled="true"><span aria-hidden="true">✦</span> Skills</span>
          <span className="side-link side-disabled" aria-disabled="true"><span aria-hidden="true">⌕</span> Discover</span>
        </nav>
        <div className="sidebar-bottom">
          <p>Good things happen<br />when we share.</p>
          <span className="sidebar-flower" aria-hidden="true">✳</span>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <a className="mobile-brand" href="/">SkillSwap <strong>Campus</strong></a>
          <span className="preview-chip"><span /> FRONTEND PREVIEW</span>
          <button className="button button-quiet button-small" type="button" disabled title="Authentication integration is pending">Log out</button>
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

function DashboardPage() {
  return (
    <AppShell page="dashboard">
      <div className="page-intro">
        <span className="eyebrow">YOUR CAMPUS, YOUR COMMUNITY</span>
        <h1>Welcome to SkillSwap<span className="wave">✳</span></h1>
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
          <div className="welcome-decoration" aria-hidden="true"><span>✳</span><i>✦</i></div>
        </section>
        <section className="completion-card">
          <div className="card-title-row"><div><span className="card-kicker">YOUR PROFILE</span><h2>Getting started</h2></div><span className="completion-icon" aria-hidden="true">◌</span></div>
          <div className="progress-label"><span>Profile completion</span><span>Unavailable</span></div>
          <div className="progress-track" role="progressbar" aria-label="Profile completion unavailable until profile fields are confirmed" aria-valuetext="Unavailable">
            <span />
          </div>
          <p>Completion will be calculated from required profile fields once the backend model is confirmed. Skills are not included.</p>
          <a className="text-link" href="/profile">View profile preview <span aria-hidden="true">→</span></a>
        </section>
      </div>
      <section className="next-step-card">
        <div className="next-step-icon" aria-hidden="true">✦</div>
        <div className="next-step-copy"><span className="card-kicker">YOUR NEXT STEP</span><h2>Add your skills</h2><p>Skills are part of Week 2 and will be available later.</p></div>
        <button className="button button-disabled" type="button" disabled>Add skills <span aria-hidden="true">→</span></button>
      </section>
      <div className="dashboard-note" role="status"><span aria-hidden="true">i</span> This is a visual preview. No account data or authentication session is active.</div>
    </AppShell>
  )
}

function ProfilePage() {
  return (
    <AppShell page="profile">
      <div className="page-intro">
        <span className="eyebrow">YOUR SPACE</span>
        <h1>My profile</h1>
        <p>A little about you helps your campus community get to know you.</p>
      </div>
      <section className="profile-placeholder">
        <div className="profile-placeholder-icon" aria-hidden="true">◉</div>
        <span className="card-kicker">PROFILE FORM PENDING</span>
        <h2>Waiting for the profile contract</h2>
        <p>Profile fields, validation rules, and save behavior will be added after the backend model and API are confirmed. No unsupported fields are shown or submitted.</p>
        <div className="pending-list">
          <span><i /> Backend-supported profile fields</span>
          <span><i /> Required-field and completion rules</span>
          <span><i /> Create, view, and update API details</span>
        </div>
        <button className="button button-disabled" type="button" disabled>Save profile — not connected</button>
      </section>
    </AppShell>
  )
}

function NotFoundPage() {
  return (
    <>
      <Header page="notFound" />
      <main className="not-found">
        <span className="eyebrow">PAGE NOT FOUND</span>
        <h1>This page is not part of Week 1.</h1>
        <p>That section may be added in a future phase.</p>
        <a className="button button-primary" href="/">Back to home</a>
      </main>
    </>
  )
}

function App() {
  const page = pageFromPath()

  if (page === 'register' || page === 'login') return <><Header page={page} /><AuthPage mode={page} /></>
  if (page === 'dashboard') return <DashboardPage />
  if (page === 'profile') return <ProfilePage />
  if (page === 'notFound') return <NotFoundPage />
  return <><Header page="home" /><LandingPage /><footer className="site-footer"><Brand /><span>Peer learning starts here.</span></footer></>
}

export default App
