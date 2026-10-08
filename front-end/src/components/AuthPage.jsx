import { useState } from 'react'
import { apiCall } from '../services/api'

export default function AuthPage({ mode, onLoginSuccess, allowedDomain = '@student.nitw.ac.in' }) {
  const isRegister = mode === 'register'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    year: '1',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isRegister) {
      if (!formData.name.trim()) {
        setError('Full name is required.')
        return
      }
      const trimmedEmail = formData.email.trim().toLowerCase()
      if (!trimmedEmail.endsWith(allowedDomain)) {
        setError('Please use your NIT Warangal student email address.')
        return
      }
      if (!formData.department.trim()) {
        setError('Department is required.')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)

    if (isRegister) {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        department: formData.department.trim(),
        year: Number(formData.year),
      }

      const res = await apiCall('/auth/register', {
        method: 'POST',
        body: payload,
      })

      setLoading(false)

      if (res.success) {
        if (onLoginSuccess) {
          onLoginSuccess(res.data.user)
        }
        window.location.href = '/dashboard'
      } else {
        setError(res.message || 'Registration failed. Please try again.')
      }
    } else {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      }

      const res = await apiCall('/auth/login', {
        method: 'POST',
        body: payload,
      })

      setLoading(false)

      if (res.success) {
        if (onLoginSuccess) {
          onLoginSuccess(res.data.user)
        }
        window.location.href = '/dashboard'
      } else {
        setError(res.message || 'Invalid email or password.')
      }
    }
  }

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

        {error && (
          <div className="form-error-banner" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="field">
              <label htmlFor="full-name">Full name</label>
              <input
                id="full-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Tirth Chaudhari"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="field">
            <label htmlFor={`${mode}-email`}>Email address</label>
            <input
              id={`${mode}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="field">
            <label htmlFor={`${mode}-password`}>Password</label>
            <input
              id={`${mode}-password`}
              name="password"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {isRegister && (
            <>
              <div className="field">
                <label htmlFor="confirm-password">Confirm password</label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="field">
                <label htmlFor="department">Department / Major</label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="e.g. CSE, EEE, ECE"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="field">
                <label htmlFor="year">Academic Year</label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                 
                </select>
              </div>
            </>
          )}

          <button className="button button-primary auth-submit" type="submit" disabled={loading}>
            {loading
              ? (isRegister ? 'Creating account...' : 'Logging in...')
              : (isRegister ? 'Create account' : 'Log in')} <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'New to SkillSwap Campus?'}
          {' '}<a href={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</a>
        </p>
      </section>
    </main>
  )
}
