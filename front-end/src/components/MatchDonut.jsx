export default function MatchDonut({ score = 0, size = 56, className = '' }) {
  const percentage = Math.round(Math.max(0, Math.min(100, Number(score) || 0)))
  const radius = 20
  const circumference = 2 * Math.PI * radius

  return (
    <span
      className={`match-donut ${className}`.trim()}
      role="img"
      aria-label={`Match score: ${percentage} percent`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="match-donut-track" cx="24" cy="24" r={radius} />
        <circle
          className="match-donut-progress"
          cx="24"
          cy="24"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percentage / 100)}
        />
      </svg>
      <span className="match-donut-value">{percentage}%</span>
    </span>
  )
}
