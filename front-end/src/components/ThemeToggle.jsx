import { useTheme } from '../context/ThemeContext'
import { SunIcon, MoonIcon } from './Icons'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className={`theme-toggle-thumb ${isDark ? 'thumb-dark' : 'thumb-light'}`}>
          {isDark ? <MoonIcon size={12} /> : <SunIcon size={12} />}
        </span>
      </span>
      <span className="theme-toggle-text">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}
