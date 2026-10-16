import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import MatchDonut from '../components/MatchDonut'
import { UserIcon } from '../components/Icons'
import { getStudent, sendExchangeRequest } from '../services/discoverApi'

const studentIdFromPath = () => window.location.pathname.split('/').filter(Boolean).pop() || ''

export default function StudentProfile({ user, onLogout }) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [requestError, setRequestError] = useState('')

  useEffect(() => {
    let active = true
    const loadStudent = async () => {
      const result = await getStudent(studentIdFromPath())
      if (!active) return
      if (result.success) {
        setStudent(result.data.student)
      } else {
        setError(result.message || 'Student profile could not be loaded.')
      }
      setLoading(false)
    }

    loadStudent()
    return () => { active = false }
  }, [])

  const handleSendRequest = async () => {
    if (!student) return
    setSending(true)
    setRequestError('')
    const result = await sendExchangeRequest({ recipientId: student.profile.userId })
    setSending(false)
    if (result.success) {
      setRequestSent(true)
    } else {
      setRequestError(result.message || 'The exchange request could not be sent.')
    }
  }

  return (
    <AppShell page="discover" user={user} onLogout={onLogout}>
      <div className="page-intro">
        <span className="eyebrow">YOUR CAMPUS, YOUR COMMUNITY</span>
        <h1>Student profile</h1>
        <p>See what this student can teach and what they hope to learn.</p>
      </div>

      <a className="discover-back-link" href="/discover">← Back to Discover</a>
      {loading ? (
        <section className="discover-state" role="status"><p>Loading student profile…</p></section>
      ) : error ? (
        <section className="discover-state" role="alert">
          <UserIcon size={24} />
          <h2>Profile unavailable</h2>
          <p>{error}</p>
        </section>
      ) : student ? (
        <section className="student-profile-card">
          <div className="student-profile-heading">
            {student.profile.profileImage ? (
              <img className="discover-avatar student-profile-avatar" src={student.profile.profileImage} alt="" />
            ) : (
              <span className="discover-avatar discover-avatar-initials student-profile-avatar" aria-hidden="true">
                {student.profile.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
              </span>
            )}
            <div>
              <span className="card-kicker">CAMPUS STUDENT</span>
              <h2>{student.profile.name}</h2>
              <p>{student.profile.department} · Year {student.profile.year}</p>
              {student.profile.availability && <p>Availability: {student.profile.availability}</p>}
            </div>
            <MatchDonut score={student.matchScore} size={76} />
          </div>

          {student.profile.bio && <p className="student-profile-bio">{student.profile.bio}</p>}

          <div className="student-profile-skills">
            <section>
              <span className="card-kicker">TEACHING</span>
              <h3>Skills they can teach</h3>
              {student.skills.filter((skill) => skill.type === 'teach').length ? (
                <ul>
                  {student.skills.filter((skill) => skill.type === 'teach').map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              ) : <p>No teaching skills listed yet.</p>}
            </section>
            <section>
              <span className="card-kicker">LEARNING</span>
              <h3>Skills they want to learn</h3>
              {student.skills.filter((skill) => skill.type === 'learn').length ? (
                <ul>
                  {student.skills.filter((skill) => skill.type === 'learn').map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              ) : <p>No learning goals listed yet.</p>}
            </section>
          </div>

          {requestError && <p className="discover-request-error" role="alert">{requestError}</p>}
          <button
            className="button button-primary"
            type="button"
            onClick={handleSendRequest}
            disabled={sending || requestSent}
          >
            {requestSent ? 'Request sent' : sending ? 'Sending…' : 'Send exchange request'}
          </button>
        </section>
      ) : null}
    </AppShell>
  )
}
