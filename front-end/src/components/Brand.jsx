export default function Brand({ light = false }) {
  return (
    <a className={`brand${light ? ' brand-light' : ''}`} href="/" aria-label="SkillSwap Campus home">
      <span className="brand-mark" aria-hidden="true">S</span>
      <span>SkillSwap <strong>Campus</strong></span>
    </a>
  )
}
