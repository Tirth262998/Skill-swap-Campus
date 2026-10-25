import { useEffect, useMemo, useState } from 'react'
import AppShell from '../components/AppShell'
import { DiscoverIcon } from '../components/Icons'
import { getRequests, updateRequestStatus } from '../services/requestsApi'

const formatDate = (value) => {
  if (!value) return 'Unknown date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

const formatRelativeHours = (value) => {
  if (!value) return 'No deadline'
  const expiresAt = new Date(value)
  if (Number.isNaN(expiresAt.getTime())) return 'No deadline'

  const remaining = expiresAt.getTime() - Date.now()
  const hours = Math.max(0, Math.ceil(remaining / (60 * 60 * 1000)))

  if (hours <= 48) return `Expiring soon · ${hours}h left`
  if (hours < 24 * 10) return `${Math.ceil(hours / 24)}d left`
  return `${Math.ceil(hours / 24)} days left`
}

const getInitials = (name = '') => {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'ST'
}

const statusClassName = (status) => {
  if (status === 'pending') return 'request-status request-status-pending'
  if (status === 'accepted') return 'request-status request-status-accepted'
  if (status === 'rejected') return 'request-status request-status-rejected'
  return 'request-status request-status-expired'
}

const statusLabel = (status) => {
  if (status === 'pending') return 'Pending'
  if (status === 'accepted') return 'Accepted'
  if (status === 'rejected') return 'Rejected'
  return 'Expired'
}

export default function RequestManagement({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('sent')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [now, setNow] = useState(Date.now())
  const [processingIds, setProcessingIds] = useState(() => new Set())
  const [data, setData] = useState({
    sent: [],
    received: [],
    summary: {
      totalSent: 0,
      totalReceived: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      expired: 0,
    },
  })

  const loadRequests = async () => {
    setLoading(true)
    setError('')
    const result = await getRequests()

    if (result.success) {
      setData(result.data.requests || {
        sent: [],
        received: [],
        summary: {
          totalSent: 0,
          totalReceived: 0,
          pending: 0,
          accepted: 0,
          rejected: 0,
          expired: 0,
        },
      })
    } else {
      setData({
        sent: [],
        received: [],
        summary: {
          totalSent: 0,
          totalReceived: 0,
          pending: 0,
          accepted: 0,
          rejected: 0,
          expired: 0,
        },
      })
      setError(result.message || 'Your requests could not be loaded.')
    }

    setLoading(false)
  }

  useEffect(() => {
    loadRequests()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60 * 1000)
    return () => window.clearInterval(timer)
  }, [])

  const filteredSent = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()
    return (data.sent || []).filter((request) => {
      const isActive = request.status !== 'expired' && !(request.status === 'pending' && request.isExpired)
      if (!isActive) return false
      if (!searchTerm) return true
      const name = request.otherUser?.name || ''
      return name.toLowerCase().includes(searchTerm)
    })
  }, [data.sent, search])

  const filteredReceived = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()
    return (data.received || []).filter((request) => {
      const isActive = request.status !== 'expired' && !(request.status === 'pending' && request.isExpired)
      if (!isActive) return false
      if (!searchTerm) return true
      const name = request.otherUser?.name || ''
      return name.toLowerCase().includes(searchTerm)
    })
  }, [data.received, search])

  const handleDecision = async (requestId, nextStatus) => {
    if (processingIds.has(requestId)) return

    setProcessingIds((current) => new Set(current).add(requestId))
    setError('')
    setSuccessMessage('')

    const result = await updateRequestStatus(requestId, nextStatus)

    if (result.success) {
      setSuccessMessage(nextStatus === 'accepted' ? 'Request accepted successfully.' : 'Request rejected successfully.')
      await loadRequests()
    } else {
      setError(result.message || 'Unable to update this request.')
    }

    setProcessingIds((current) => {
      const updated = new Set(current)
      updated.delete(requestId)
      return updated
    })
  }

  const renderRequestCard = (request, direction) => {
    const displayName = request.otherUser?.name || 'Student'
    const displayImage = request.otherUser?.profileImage
    const department = request.otherUser?.department || 'Campus'
    const profileSkills = Array.isArray(request.skills) ? request.skills : []
    const isReceivedPending = direction === 'received' && request.status === 'pending'
    const expiresAt = request.expiresAt ? new Date(request.expiresAt) : null
    const remainingMs = expiresAt ? expiresAt.getTime() - now : null
    const timeLeftLabel = remainingMs !== null && remainingMs > 0
      ? (() => {
          const totalMinutes = Math.max(0, Math.floor(remainingMs / 60000))
          const days = Math.floor(totalMinutes / (24 * 60))
          const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
          const minutes = totalMinutes % 60
          if (days > 0) return `${days}d ${hours}h left`
          if (hours > 0) return `${hours}h ${minutes}m left`
          if (minutes > 0) return `${minutes}m left`
          return `${Math.max(0, Math.floor(remainingMs / 1000))}s left`
        })()
      : 'Expired'
    const expiresSoon = remainingMs !== null && remainingMs <= 48 * 60 * 60 * 1000 && remainingMs > 0

    return (
      <article key={request.id} className="request-card">
        <div className="request-header-row">
          <div className="request-person-wrap">
            {displayImage ? (
              <img className="request-avatar" src={displayImage} alt={displayName} />
            ) : (
              <div className="request-avatar request-avatar-fallback" aria-label={`${displayName} initial`}>
                {getInitials(displayName)}
              </div>
            )}
            <div className="request-person-copy">
              <h3>{displayName}</h3>
              <p>{department}</p>
            </div>
          </div>
          <span className={statusClassName(request.status)}>{statusLabel(request.status)}</span>
        </div>

        <div className="request-meta-grid">
          <div>
            <span className="request-label">Request date</span>
            <strong>{formatDate(request.createdAt)}</strong>
          </div>
          <div>
            <span className="request-label">Expires</span>
            <strong>
              {request.status === 'pending'
                ? formatRelativeHours(request.expiresAt)
                : statusLabel(request.status)}
            </strong>
          </div>
        </div>

        {profileSkills.length > 0 && (
          <div className="request-skill-list" aria-label="Relevant skills">
            {profileSkills.slice(0, 4).map((skill) => (
              <span key={skill.id || `${skill.name}-${skill.type}`} className="request-tag">
                {skill.name}
              </span>
            ))}
          </div>
        )}

        {request.message && <p className="request-message">“{request.message}”</p>}

        {request.status === 'pending' && (
          <div className="request-timer-row">
            <span className={expiresSoon ? 'request-warning' : 'request-neutral'}>
              {expiresSoon ? 'Expiring soon' : 'Time remaining'}
            </span>
            <strong>{timeLeftLabel}</strong>
          </div>
        )}

        {isReceivedPending && (
          <div className="request-actions">
            <button
              type="button"
              className="button button-primary button-small"
              onClick={() => handleDecision(request.id, 'accepted')}
              disabled={processingIds.has(request.id)}
            >
              {processingIds.has(request.id) ? 'Processing…' : 'Accept'}
            </button>
            <button
              type="button"
              className="button button-secondary button-small"
              onClick={() => handleDecision(request.id, 'rejected')}
              disabled={processingIds.has(request.id)}
            >
              Reject
            </button>
          </div>
        )}
      </article>
    )
  }

  const displayedRequests = activeTab === 'sent' ? filteredSent : filteredReceived
  const visibleCount = displayedRequests.length

  return (
    <AppShell page="requests" user={user} onLogout={onLogout}>
      <div className="page-intro">
        <span className="eyebrow">YOUR CAMPUS, YOUR COMMUNITY</span>
        <h1>Request management</h1>
        <p>Track your exchange requests and respond to incoming invites.</p>
      </div>

      {error && (
        <div className="form-error-banner" role="alert">
          {error}
          <button type="button" className="button button-quiet button-small" onClick={loadRequests}>
            Retry
          </button>
        </div>
      )}

      {successMessage && (
        <div className="form-success-banner" role="status">
          {successMessage}
        </div>
      )}

      <div className="request-summary-grid">
        <div className="request-stat-card">
          <span>Total Sent</span>
          <strong>{data.summary.totalSent || 0}</strong>
        </div>
        <div className="request-stat-card">
          <span>Total Received</span>
          <strong>{data.summary.totalReceived || 0}</strong>
        </div>
        <div className="request-stat-card">
          <span>Pending Requests</span>
          <strong>{data.summary.pending || 0}</strong>
        </div>
        <div className="request-stat-card">
          <span>Accepted Requests</span>
          <strong>{data.summary.accepted || 0}</strong>
        </div>
      </div>

      <section className="request-shell" aria-label="Exchange requests panel">
        <div className="request-panel-header">
          <div className="request-tabs" role="tablist" aria-label="Request tabs">
            <button
              type="button"
              className={activeTab === 'sent' ? 'request-tab is-active' : 'request-tab'}
              onClick={() => setActiveTab('sent')}
              role="tab"
              aria-selected={activeTab === 'sent'}
            >
              Sent Requests
              <span className="request-badge">{data.sent.length}</span>
            </button>
            <button
              type="button"
              className={activeTab === 'received' ? 'request-tab is-active' : 'request-tab'}
              onClick={() => setActiveTab('received')}
              role="tab"
              aria-selected={activeTab === 'received'}
            >
              Received Requests
              <span className="request-badge">{data.received.length}</span>
            </button>
          </div>

          <label className="request-search" aria-label="Search requests by student name">
            <DiscoverIcon size={16} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by student name..."
              autoComplete="off"
            />
          </label>
        </div>

        {loading ? (
          <div className="request-list request-list-loading">
            {[0, 1, 2].map((item) => (
              <div key={item} className="request-card request-card-skeleton" aria-hidden="true">
                <div className="skeleton-line skeleton-avatar" />
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-copy" />
                <div className="skeleton-line skeleton-copy short" />
              </div>
            ))}
          </div>
        ) : visibleCount === 0 ? (
          <div className="request-empty-state">
            <h3>No requests match your search.</h3>
            <p>
              {search.trim()
                ? 'Try a different student name or clear the filter.'
                : activeTab === 'sent'
                  ? 'You have not sent any exchange requests yet.'
                  : 'You have not received any exchange requests yet.'}
            </p>
          </div>
        ) : (
          <div className="request-list">
            {displayedRequests.map((request) => renderRequestCard(request, activeTab))}
          </div>
        )}
      </section>
    </AppShell>
  )
}
