import { useEffect, useRef, useState } from 'react'
import AppShell from '../components/AppShell'
import MatchDonut from '../components/MatchDonut'
import { DiscoverIcon, UserIcon } from '../components/Icons'
import { apiCall } from '../services/api'
import { getMySkills } from '../services/skillsApi'
import { getDiscoverStudents, sendExchangeRequest } from '../services/discoverApi'
import { rankStudents } from '../utils/matching'

const PAGE_SIZE = 12

const initialFilters = {
  skillType: '',
  department: '',
  availability: '',
  minScore: '0',
}

const departmentSuggestions = ['CSE', 'EEE', 'ECE']
const availabilitySuggestions = ['Weekends', 'Weekday evenings']

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export default function Discover({ user, onLogout }) {
  const [draftFilters, setDraftFilters] = useState(initialFilters)
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const [students, setStudents] = useState([])
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewerProfile, setViewerProfile] = useState(null)
  const [viewerSkills, setViewerSkills] = useState([])
  const [viewerError, setViewerError] = useState('')
  const [sendingIds, setSendingIds] = useState(() => new Set())
  const [sentIds, setSentIds] = useState(() => new Set())
  const [requestErrors, setRequestErrors] = useState({})
  const filterPanelRef = useRef(null)
  const filterButtonRef = useRef(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => setAppliedSearch(search.trim()), 250)
    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    if (!filtersOpen) return undefined

    const handlePointerDown = (event) => {
      if (!filterPanelRef.current?.contains(event.target)) setFiltersOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setFiltersOpen(false)
        filterButtonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [filtersOpen])

  useEffect(() => {
    let active = true
    const loadViewerSkills = async () => {
      const [profileResult, skillsResult] = await Promise.all([
        apiCall('/profile', { method: 'GET' }),
        getMySkills(),
      ])
      if (!active) return
      const failures = []
      if (profileResult.success) {
        setViewerProfile(profileResult.data.profile)
      } else {
        failures.push(profileResult.message || 'Your profile could not be loaded.')
      }
      if (skillsResult.success) {
        setViewerSkills(skillsResult.data.skills || [])
      } else {
        failures.push(skillsResult.message || 'Your skills could not be loaded.')
      }
      setViewerError(failures.join(' '))
    }

    loadViewerSkills()
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    const loadStudents = async () => {
      setLoading(true)
      setError('')
      const result = await getDiscoverStudents({
        ...appliedFilters,
        search: appliedSearch,
        page,
        limit: PAGE_SIZE,
      })

      if (!active) return
      if (result.success) {
        setStudents(rankStudents(null, result.data.students || []))
        setPagination(result.data.pagination || null)
      } else {
        setStudents([])
        setPagination(null)
        setError(result.message || 'Students could not be loaded.')
      }
      setLoading(false)
    }

    loadStudents()
    return () => { active = false }
  }, [appliedFilters, appliedSearch, page])

  const updateDraftFilter = (event) => {
    const { name, value } = event.target
    setDraftFilters((current) => ({ ...current, [name]: value }))
  }

  const applyFilters = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
    setFiltersOpen(false)
  }

  const resetFilters = () => {
    setDraftFilters(initialFilters)
    setAppliedFilters(initialFilters)
    setPage(1)
    setFiltersOpen(false)
  }

  const updateSearch = (event) => {
    setSearch(event.target.value)
    setPage(1)
  }

  const activeFilters = [
    appliedFilters.department && {
      key: 'department',
      label: `Department: ${appliedFilters.department}`,
    },
    appliedFilters.availability && {
      key: 'availability',
      label: `Availability: ${appliedFilters.availability}`,
    },
    appliedFilters.minScore !== '0' && {
      key: 'minScore',
      label: `Match: ${appliedFilters.minScore}%+`,
    },
    appliedFilters.skillType && {
      key: 'skillType',
      label: appliedFilters.skillType === 'learn' ? 'Skills I want to learn' : 'Skills I can teach',
    },
  ].filter(Boolean)

  const removeFilter = (key) => {
    const next = { ...appliedFilters, [key]: key === 'minScore' ? '0' : '' }
    setDraftFilters(next)
    setAppliedFilters(next)
    setPage(1)
  }

  const handleSendRequest = async (student) => {
    const recipientId = student.profile.userId
    if (sendingIds.has(recipientId)) return
    setSendingIds((current) => new Set(current).add(recipientId))
    setRequestErrors((current) => ({ ...current, [recipientId]: '' }))

    const result = await sendExchangeRequest({ recipientId })

    if (result.success) {
      setSentIds((current) => new Set(current).add(recipientId))
    } else {
      setRequestErrors((current) => ({
        ...current,
        [recipientId]: result.message || 'The exchange request could not be sent.',
      }))
    }

    setSendingIds((current) => {
      const next = new Set(current)
      next.delete(recipientId)
      return next
    })
  }

  const pageCount = pagination?.totalPages || 0

  return (
    <AppShell page="discover" user={user} onLogout={onLogout}>
      <div className="page-intro">
        <span className="eyebrow">YOUR CAMPUS, YOUR COMMUNITY</span>
        <h1>Discover students</h1>
        <p>Find classmates to exchange skills and learn together.</p>
      </div>

      {viewerError && <div className="form-error-banner" role="alert">{viewerError}</div>}
      {error && <div className="form-error-banner" role="alert">{error}</div>}

      <section className="discover-directory" aria-label="Discover students">
        <div className="discover-search-row">
          <label className="discover-smart-search">
            <DiscoverIcon size={19} />
            <input
              type="search"
              value={search}
              onChange={updateSearch}
              placeholder="Search students or skills..."
              aria-label="Search students or skills"
              autoComplete="off"
            />
            {search && (
              <button
                className="discover-search-clear"
                type="button"
                onClick={() => {
                  setSearch('')
                  setPage(1)
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>
          <div className="discover-filter-anchor" ref={filterPanelRef}>
            <button
              className={`discover-filter-toggle${filtersOpen ? ' is-open' : ''}`}
              type="button"
              aria-expanded={filtersOpen}
              aria-controls="discover-filter-popover"
              ref={filterButtonRef}
              onClick={() => {
                setDraftFilters(appliedFilters)
                setFiltersOpen((open) => !open)
              }}
            >
              <span aria-hidden="true">⚙</span>
              Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ''}
              <span className="discover-filter-chevron" aria-hidden="true">⌄</span>
            </button>
            {filtersOpen && (
              <div
                className="discover-filter-popover"
                id="discover-filter-popover"
                role="group"
                aria-label="Discover filters"
              >
                <div className="discover-popover-heading">
                  <strong>Refine results</strong>
                  <button
                    type="button"
                    className="discover-popover-close"
                    aria-label="Close filters"
                    onClick={() => setFiltersOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <label className="discover-filter">
                  <span>Department</span>
                  <input
                    list="discover-departments"
                    name="department"
                    value={draftFilters.department}
                    onChange={updateDraftFilter}
                    placeholder="All departments"
                  />
                  <datalist id="discover-departments">
                    {[...new Set([...departmentSuggestions, user?.department].filter(Boolean))].map((department) => (
                      <option key={department} value={department} />
                    ))}
                  </datalist>
                  <small>Choose a suggestion or enter a department.</small>
                </label>
                <label className="discover-filter">
                  <span>Availability</span>
                  <input
                    list="discover-availability"
                    name="availability"
                    value={draftFilters.availability}
                    onChange={updateDraftFilter}
                    placeholder="Any availability"
                  />
                  <datalist id="discover-availability">
                    {[...new Set([...availabilitySuggestions, viewerProfile?.availability].filter(Boolean))].map((availability) => (
                      <option key={availability} value={availability} />
                    ))}
                  </datalist>
                  <small>Matches the availability text on a student's profile.</small>
                </label>
                <label className="discover-filter">
                  <span>Minimum match</span>
                  <select name="minScore" value={draftFilters.minScore} onChange={updateDraftFilter}>
                    <option value="0">Any match</option>
                    <option value="40">40% or higher</option>
                    <option value="60">60% or higher</option>
                    <option value="80">80% or higher</option>
                    <option value="90">90% or higher</option>
                  </select>
                </label>
                <label className="discover-filter">
                  <span>Skill direction</span>
                  <select name="skillType" value={draftFilters.skillType} onChange={updateDraftFilter}>
                    <option value="">Any direction</option>
                    <option value="learn">Skills I want to learn</option>
                    <option value="teach">Skills I want to teach</option>
                  </select>
                  <small>Search still checks both exchange directions.</small>
                </label>
                <div className="discover-filter-actions">
                  <button
                    className="button button-secondary button-small"
                    type="button"
                    onClick={resetFilters}
                  >
                    Reset filters
                  </button>
                  <button
                    className="button button-primary button-small"
                    type="button"
                    onClick={applyFilters}
                  >
                    Apply filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="discover-active-filters" aria-label="Active filters">
            {activeFilters.map((filter) => (
              <button
                className="discover-filter-chip"
                type="button"
                key={filter.key}
                onClick={() => removeFilter(filter.key)}
                aria-label={`Remove filter: ${filter.label}`}
              >
                {filter.label}<span aria-hidden="true">×</span>
              </button>
            ))}
            <button className="discover-clear-filters" type="button" onClick={resetFilters}>
              Clear all
            </button>
          </div>
        )}

        <div className="discover-results-heading">
          <div>
            <span className="card-kicker">SKILL EXCHANGE MATCHES</span>
            <h2>Students to learn with</h2>
          </div>
          {pagination && (
            <span className="discover-result-count">
              {pagination.total} {pagination.total === 1 ? 'student' : 'students'}
            </span>
          )}
        </div>

        {viewerProfile && viewerSkills.length > 0 && (
          <p className="discover-viewer-context">
            Matching for {viewerProfile.name}: your {viewerSkills.length} listed{' '}
            {viewerSkills.length === 1 ? 'skill' : 'skills'} are included in each match score.
          </p>
        )}

        {loading ? (
          <div className="discover-state" role="status">
            <DiscoverIcon size={24} />
            <p>Finding students and ranking the matches…</p>
          </div>
        ) : error ? (
          <div className="discover-state" role="status">
            <DiscoverIcon size={24} />
            <h3>Results unavailable</h3>
            <p>Check your connection and try again.</p>
          </div>
        ) : students.length === 0 ? (
          <div className="discover-state" role="status">
            <DiscoverIcon size={24} />
            <h3>{pagination?.total === 0 ? 'No students match these filters' : 'No students to show'}</h3>
            <p>Try changing your search or filters to see more classmates.</p>
          </div>
        ) : (
          <div className="discover-student-list">
            {students.map((student) => {
              const id = student.profile.userId
              const teachSkills = student.skills.filter((skill) => skill.type === 'teach')
              const learnSkills = student.skills.filter((skill) => skill.type === 'learn')

              return (
                <article className="discover-student-card" key={id}>
                  <div className="discover-student-main">
                    <a className="discover-avatar-link" href={`/students/${encodeURIComponent(id)}`}>
                      {student.profile.profileImage ? (
                        <img className="discover-avatar" src={student.profile.profileImage} alt="" />
                      ) : (
                        <span className="discover-avatar discover-avatar-initials" aria-hidden="true">
                          {getInitials(student.profile.name) || <UserIcon size={22} />}
                        </span>
                      )}
                    </a>
                    <div className="discover-student-info">
                      <a className="discover-student-name" href={`/students/${encodeURIComponent(id)}`}>
                        {student.profile.name}
                      </a>
                      <p>{student.profile.department} · Year {student.profile.year}</p>
                      {student.profile.availability && (
                        <span className="discover-availability">
                          Available: {student.profile.availability}
                        </span>
                      )}
                    </div>
                    <MatchDonut score={student.matchScore} size={66} />
                  </div>

                  {student.profile.bio && <p className="discover-student-bio">{student.profile.bio}</p>}

                  <div className="discover-skill-columns">
                    <div>
                      <span>Can teach</span>
                      <p>{teachSkills.length ? teachSkills.map((skill) => skill.name).join(', ') : 'Not listed'}</p>
                    </div>
                    <div>
                      <span>Wants to learn</span>
                      <p>{learnSkills.length ? learnSkills.map((skill) => skill.name).join(', ') : 'Not listed'}</p>
                    </div>
                  </div>

                  {requestErrors[id] && (
                    <p className="discover-request-error" role="alert">{requestErrors[id]}</p>
                  )}
                  <div className="discover-card-actions">
                    <a className="button button-secondary button-small" href={`/students/${encodeURIComponent(id)}`}>
                      View profile
                    </a>
                    <button
                      className="button button-primary button-small"
                      type="button"
                      onClick={() => handleSendRequest(student)}
                      disabled={sendingIds.has(id) || sentIds.has(id)}
                    >
                      {sentIds.has(id) ? 'Request sent' : sendingIds.has(id) ? 'Sending…' : 'Send request'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {!loading && pageCount > 1 && (
          <nav className="discover-pagination" aria-label="Student results pages">
            <button
              className="button button-secondary button-small"
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>Page {page} of {pageCount}</span>
            <button
              className="button button-secondary button-small"
              type="button"
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              disabled={page >= pageCount}
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </AppShell>
  )
}
