import { createContext, useContext, useState, useEffect } from 'react'

const THEME_STORAGE_KEY = 'skillswap-theme'
const ThemeContext = createContext()

function readInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') return saved

    const legacy = localStorage.getItem('theme')
    if (legacy === 'dark' || legacy === 'light') return legacy
  } catch {
    // localStorage unavailable (e.g. private browsing restriction)
  }

  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
      const legacy = localStorage.getItem('theme')
      if (legacy && legacy !== theme) {
        localStorage.removeItem('theme')
      }
    } catch {}

    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme

    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#121115' : '#14243b')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
