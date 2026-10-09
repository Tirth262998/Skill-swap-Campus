import { useState, useEffect } from 'react'

export default function SkillForm({ initialData, onSubmit, onCancel, loading }) {
  const isEditing = Boolean(initialData)

  const [name, setName] = useState(initialData?.name || '')
  const [type, setType] = useState(initialData?.type || 'teach')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setType(initialData.type || 'teach')
    } else {
      setName('')
      setType('teach')
    }
    setError('')
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmed = name.trim()
    if (!trimmed) {
      setError('Skill name is required.')
      return
    }
    if (trimmed.length < 2) {
      setError('Skill name must be at least 2 characters.')
      return
    }
    if (trimmed.length > 50) {
      setError('Skill name must be 50 characters or fewer.')
      return
    }

    onSubmit({ name: trimmed, type })
  }

  return (
    <form className="skill-form" onSubmit={handleSubmit}>
      <h3 className="skill-form-title">
        {isEditing ? 'Edit Skill' : 'Add a Skill'}
      </h3>

      {error && (
        <div className="form-error-banner" role="alert">{error}</div>
      )}

      <div className="field">
        <label htmlFor="skill-name">Skill name *</label>
        <input
          id="skill-name"
          type="text"
          placeholder="e.g. Java, React, UI/UX"
          value={name}
          onChange={(e) => { setName(e.target.value); if (error) setError('') }}
          disabled={loading}
          autoFocus
        />
      </div>

      <div className="field">
        <label htmlFor="skill-type">Skill type *</label>
        <select
          id="skill-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={loading || isEditing}
        >
          <option value="teach">Can Teach</option>
          <option value="learn">Want to Learn</option>
        </select>
      </div>

      <div className="skill-form-actions">
        <button
          className="button button-primary button-small"
          type="submit"
          disabled={loading}
        >
          {loading
            ? (isEditing ? 'Saving…' : 'Adding…')
            : (isEditing ? 'Save changes' : 'Add skill')}
        </button>
        <button
          className="button button-secondary button-small"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
