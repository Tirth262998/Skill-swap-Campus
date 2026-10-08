import { useState, useEffect } from 'react'
import AppShell from '../components/AppShell'
import { apiCall } from '../services/api'

export default function Profile({ user, profile, onLogout, onProfileUpdated }) {
  const [formData, setFormData] = useState({
    name: profile?.name || user?.name || '',
    department: profile?.department || user?.department || '',
    year: String(profile?.year || user?.year || '1'),
    bio: profile?.bio || '',
    profileImage: profile?.profileImage || '',
    interests: Array.isArray(profile?.interests) ? profile.interests.join(', ') : '',
    availability: profile?.availability || '',
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!profile)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isExisting, setIsExisting] = useState(Boolean(profile))

  useEffect(() => {
    let isMounted = true
    const fetchProfile = async () => {
      setFetching(true)
      const res = await apiCall('/profile', { method: 'GET' })

      if (!isMounted) return

      if (res.success && res.data.profile) {
        const p = res.data.profile
        setIsExisting(true)
        setFormData({
          name: p.name || user?.name || '',
          department: p.department || user?.department || '',
          year: String(p.year || user?.year || '1'),
          bio: p.bio || '',
          profileImage: p.profileImage || '',
          interests: Array.isArray(p.interests) ? p.interests.join(', ') : '',
          availability: p.availability || '',
        })
      } else {
        setIsExisting(false)
        setFormData((prev) => ({
          ...prev,
          name: user?.name || '',
          department: user?.department || '',
          year: String(user?.year || '1'),
        }))
      }
      setFetching(false)
    }

    fetchProfile()
    return () => { isMounted = false }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (message.text) setMessage({ type: '', text: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required.' })
      return
    }
    if (!formData.department.trim()) {
      setMessage({ type: 'error', text: 'Department is required.' })
      return
    }

    setLoading(true)

    const interestsArray = formData.interests
      ? formData.interests.split(',').map((item) => item.trim()).filter(Boolean)
      : []

    const payload = {
      name: formData.name.trim(),
      department: formData.department.trim(),
      year: Number(formData.year),
      bio: formData.bio.trim() || undefined,
      profileImage: formData.profileImage.trim() || undefined,
      interests: interestsArray,
      availability: formData.availability.trim() || undefined,
    }

    const method = isExisting ? 'PUT' : 'POST'
    const res = await apiCall('/profile', {
      method,
      body: payload,
    })

    setLoading(false)

    if (res.success) {
      setIsExisting(true)
      setMessage({ type: 'success', text: 'Profile saved successfully!' })
      if (onProfileUpdated) {
        onProfileUpdated(res.data.profile)
      }
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to save profile.' })
    }
  }

  return (
    <AppShell page="profile" user={user} onLogout={onLogout}>
      <div className="page-intro">
        <span className="eyebrow">YOUR SPACE</span>
        <h1>My profile</h1>
        <p>A little about you helps your campus community get to know you.</p>
      </div>

      {fetching ? (
        <section className="profile-placeholder">
          <div className="profile-placeholder-icon" aria-hidden="true">◉</div>
          <h2>Loading profile...</h2>
        </section>
      ) : (
        <section className="profile-placeholder" style={{ textAlign: 'left', maxWidth: '680px' }}>
          <div className="card-title-row" style={{ marginBottom: '24px' }}>
            <div>
              <span className="card-kicker">STUDENT INFORMATION</span>
              <h2 style={{ fontSize: '26px', margin: '6px 0 0' }}>
                {isExisting ? 'Edit Your Profile' : 'Create Your Profile'}
              </h2>
            </div>
            <div className="profile-placeholder-icon" style={{ margin: 0, width: '45px', height: '45px', fontSize: '22px' }}>
              ◉
            </div>
          </div>

          {message.text && (
            <div className={message.type === 'error' ? 'form-error-banner' : 'form-success-banner'}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field">
              <label htmlFor="prof-name">Full name *</label>
              <input
                id="prof-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="prof-dept">Department / Major *</label>
              <input
                id="prof-dept"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="prof-year">Academic Year *</label>
              <select
                id="prof-year"
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
                <option value="5">5th Year</option>
                <option value="6">6th Year</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="prof-bio">Bio / About you</label>
              <textarea
                id="prof-bio"
                name="bio"
                placeholder="Share a little about yourself, your goals, or what interests you."
                value={formData.bio}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="prof-img">Profile Image URL</label>
              <input
                id="prof-img"
                name="profileImage"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={formData.profileImage}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="prof-interests">Interests (comma separated)</label>
              <input
                id="prof-interests"
                name="interests"
                type="text"
                placeholder="e.g. AI, Web Development, Design, Music"
                value={formData.interests}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="prof-avail">Availability</label>
              <input
                id="prof-avail"
                name="availability"
                type="text"
                placeholder="e.g. Weekends, Weekday evenings"
                value={formData.availability}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button
              className="button button-primary"
              type="submit"
              disabled={loading}
              style={{ marginTop: '12px' }}
            >
              {loading ? 'Saving profile...' : (isExisting ? 'Update profile' : 'Create profile')} <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>
      )}
    </AppShell>
  )
}
