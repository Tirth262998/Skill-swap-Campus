export default function SkillCard({ skill, onEdit, onDelete, deleting }) {
  const isTeach = skill.type === 'teach'

  return (
    <div className={`skill-card ${isTeach ? 'skill-card-teach' : 'skill-card-learn'}`}>
      <div className="skill-card-info">
        <span className="skill-card-name">{skill.name}</span>
        <span className={`skill-type-tag ${isTeach ? 'tag-teach' : 'tag-learn'}`}>
          {isTeach ? 'Can Teach' : 'Want to Learn'}
        </span>
      </div>
      <div className="skill-card-actions">
        <button
          className="button button-small button-secondary"
          type="button"
          onClick={() => onEdit(skill)}
          disabled={deleting}
        >
          Edit
        </button>
        <button
          className="button button-small button-danger"
          type="button"
          onClick={() => onDelete(skill._id)}
          disabled={deleting}
        >
          {deleting ? 'Removing…' : 'Remove'}
        </button>
      </div>
    </div>
  )
}
