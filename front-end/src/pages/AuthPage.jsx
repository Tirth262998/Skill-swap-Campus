import Icon from '../components/Icon.jsx'

function AuthPage({ mode }) {
  const isRegister = mode === 'register'

  return (
    <main className="auth-layout">
      <section className="auth-aside">
        <div className="aside-decoration" aria-hidden="true"><Icon name="users" /></div>
        <span className="eyebrow">YOUR NEXT SKILL STARTS HERE</span>
        <h1>{isRegister ? 'Make room for a new kind of learning.' : 'Welcome back to your campus.'}</h1>
        <p>{isRegister
          ? 'A community where everyone has something to teach and something to learn.'
          : 'Pick up where curiosity left off. Your campus community is here.'}</p>
        <div className="auth-feature-stack" aria-label="SkillSwap community highlights">
          <div className="auth-feature-card">
            <span><Icon name="book" /></span>
            <div><strong>Share what you know</strong><small>Your experience has value.</small></div>
            <i>01</i>
          </div>
          <div className="auth-feature-card">
            <span><Icon name="bulb" /></span>
            <div><strong>Learn something new</strong><small>Grow with a campus peer.</small></div>
            <i>02</i>
          </div>
          <div className="auth-feature-line" aria-hidden="true" />
        </div>
        <div className="aside-note"><Icon name="users" /> Learning is better together.</div>
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

export default AuthPage
