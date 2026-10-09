import { useState, useEffect } from 'react'
import AppShell from '../components/AppShell'
import SkillCard from '../components/SkillCard'
import SkillForm from '../components/SkillForm'
import { getMySkills, createSkill, updateSkill, deleteSkill } from '../services/skillsApi'
import { BookOpenIcon, DiscoverIcon, SkillsIcon } from '../components/Icons'

export default function Skills({ user, onLogout }) {
  const [skills, setSkills] = useState([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // Pre-set type when clicking "Add" in a specific section
  const [defaultType, setDefaultType] = useState('teach')

  // Fetch skills on mount
  useEffect(() => {
    let isMounted = true
    const fetchSkills = async () => {
      setFetching(true)
      setError('')
      const res = await getMySkills()

      if (!isMounted) return

      if (res.success && res.data.skills) {
        setSkills(res.data.skills)
      } else if (res.success && Array.isArray(res.data)) {
        setSkills(res.data)
      } else {
        setError(res.message || 'Failed to load skills.')
      }
      setFetching(false)
    }

    fetchSkills()
    return () => { isMounted = false }
  }, [])

  const clearMessages = () => {
    setError('')
    setSuccessMsg('')
  }

  const handleOpenAdd = (type) => {
    clearMessages()
    setDefaultType(type)
    setEditingSkill(null)
    setShowForm(true)
  }

  const handleOpenEdit = (skill) => {
    clearMessages()
    setEditingSkill(skill)
    setDefaultType(skill.type)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingSkill(null)
  }

  const handleSubmitForm = async (formData) => {
    setFormLoading(true)
    clearMessages()

    if (editingSkill) {
      // Update
      const res = await updateSkill(editingSkill._id, formData)
      setFormLoading(false)

      if (res.success) {
        const updated = res.data.skill || { ...editingSkill, ...formData }
        setSkills((prev) =>
          prev.map((s) => (s._id === editingSkill._id ? updated : s))
        )
        setSuccessMsg('Skill updated successfully!')
        setShowForm(false)
        setEditingSkill(null)
      } else {
        setError(res.message || 'Failed to update skill.')
      }
    } else {
      // Create
      const res = await createSkill(formData)
      setFormLoading(false)

      if (res.success) {
        const newSkill = res.data.skill || res.data
        setSkills((prev) => [...prev, newSkill])
        setSuccessMsg('Skill added successfully!')
        setShowForm(false)
      } else {
        setError(res.message || 'Failed to add skill.')
      }
    }
  }

  const handleDelete = async (skillId) => {
    clearMessages()
    setDeletingId(skillId)

    const res = await deleteSkill(skillId)
    setDeletingId(null)

    if (res.success) {
      setSkills((prev) => prev.filter((s) => s._id !== skillId))
      setSuccessMsg('Skill removed successfully!')
    } else {
      setError(res.message || 'Failed to remove skill.')
    }
  }

  // Split skills into two categories
  const teachSkills = skills.filter((s) => s.type === 'teach')
  const learnSkills = skills.filter((s) => s.type === 'learn')

  return (
    <AppShell page="skills" user={user} onLogout={onLogout}>
      <div className="page-intro">
        <span className="eyebrow">YOUR SKILLS</span>
        <h1>Skill Management</h1>
        <p>Add the skills you can teach and the ones you want to learn.</p>
      </div>

      {/* Status messages */}
      {successMsg && (
        <div className="form-success-banner" role="status">{successMsg}</div>
      )}
      {error && (
        <div className="form-error-banner" role="alert">{error}</div>
      )}

      {/* Inline form */}
      {showForm && (
        <section className="skills-form-section">
          <SkillForm
            initialData={editingSkill || { name: '', type: defaultType }}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        </section>
      )}

      {fetching ? (
        <section className="profile-placeholder">
          <div className="profile-placeholder-icon" aria-hidden="true">
            <SkillsIcon size={24} />
          </div>
          <h2>Loading skills…</h2>
        </section>
      ) : (
        <div className="skills-columns">
          {/* Skills I Can Teach */}
          <section className="skills-section">
            <div className="skills-section-header">
              <div>
                <span className="card-kicker">TEACHING</span>
                <h2 className="skills-section-title">Skills I Can Teach</h2>
              </div>
              <button
                className="button button-primary button-small"
                type="button"
                onClick={() => handleOpenAdd('teach')}
                disabled={formLoading}
              >
                + Add skill
              </button>
            </div>

            {teachSkills.length === 0 ? (
              <div className="skills-empty">
                <span className="skills-empty-icon" aria-hidden="true">
                  <BookOpenIcon size={26} />
                </span>
                <p>No teaching skills yet. Add a skill you can teach to get started.</p>
              </div>
            ) : (
              <div className="skills-list">
                {teachSkills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    deleting={deletingId === skill._id}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Skills I Want To Learn */}
          <section className="skills-section">
            <div className="skills-section-header">
              <div>
                <span className="card-kicker">LEARNING</span>
                <h2 className="skills-section-title">Skills I Want to Learn</h2>
              </div>
              <button
                className="button button-primary button-small"
                type="button"
                onClick={() => handleOpenAdd('learn')}
                disabled={formLoading}
              >
                + Add skill
              </button>
            </div>

            {learnSkills.length === 0 ? (
              <div className="skills-empty">
                <span className="skills-empty-icon" aria-hidden="true">
                  <DiscoverIcon size={26} />
                </span>
                <p>No learning goals yet. Add a skill you want to learn.</p>
              </div>
            ) : (
              <div className="skills-list">
                {learnSkills.map((skill) => (
                  <SkillCard
                    key={skill._id}
                    skill={skill}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    deleting={deletingId === skill._id}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </AppShell>
  )
}
