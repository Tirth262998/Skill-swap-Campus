import { useState, useEffect } from 'react'
import './App.css'
import { apiCall } from './services/api'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Skills from './pages/Skills'
import NotFound from './pages/NotFound'
import Discover from './pages/Discover'
import StudentProfile from './pages/StudentProfile'

const pageFromPath = () => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return 'home'
  if (path === '/register') return 'register'
  if (path === '/login') return 'login'
  if (path === '/dashboard') return 'dashboard'
  if (path === '/profile') return 'profile'
  if (path === '/skills') return 'skills'
  if (path === '/discover') return 'discover'
  if (/^\/students\/[^/]+$/.test(path)) return 'student-profile'
  return 'notFound'
}

function App() {
  const page = pageFromPath()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)


  useEffect(() => {
    let isMounted = true
    const checkAuth = async () => {
      setAuthLoading(true)
      const res = await apiCall('/auth/me', { method: 'GET' })

      if (!isMounted) return

      if (res.success && res.data.user) {
        setUser(res.data.user)
        
        const profRes = await apiCall('/profile', { method: 'GET' })
        if (isMounted && profRes.success && profRes.data.profile) {
          setProfile(profRes.data.profile)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setAuthLoading(false)
    }

    checkAuth()
    return () => { isMounted = false }
  }, [])

 
  useEffect(() => {
    if (!authLoading) {
      if (['dashboard', 'profile', 'skills', 'discover', 'student-profile'].includes(page) && !user) {
        window.location.href = '/login'
      } else if ((page === 'login' || page === 'register') && user) {
        window.location.href = '/dashboard'
      }
    }
  }, [authLoading, user, page])

  const handleLogout = async () => {
    await apiCall('/auth/logout', { method: 'POST' })
    setUser(null)
    setProfile(null)
    window.location.href = '/login'
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleProfileUpdated = (profileData) => {
    setProfile(profileData)
    setUser((prev) => prev ? { ...prev, profileCompleted: true, name: profileData.name, department: profileData.department, year: profileData.year } : null)
  }

  if (authLoading && ['dashboard', 'profile', 'skills', 'discover', 'student-profile'].includes(page)) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--ink-soft)' }}>
        <p>Checking session...</p>
      </div>
    )
  }

  if (page === 'register') {
    return <Register user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
  }

  if (page === 'login') {
    return <Login user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
  }

  if (page === 'dashboard') {
    return <Dashboard user={user} profile={profile} onLogout={handleLogout} />
  }

  if (page === 'profile') {
    return (
      <Profile
        user={user}
        profile={profile}
        onLogout={handleLogout}
        onProfileUpdated={handleProfileUpdated}
      />
    )
  }

  if (page === 'skills') {
    return <Skills user={user} onLogout={handleLogout} />
  }

  if (page === 'discover') {
    return <Discover user={user} onLogout={handleLogout} />
  }

  if (page === 'student-profile') {
    return <StudentProfile user={user} onLogout={handleLogout} />
  }

  if (page === 'notFound') {
    return <NotFound user={user} onLogout={handleLogout} />
  }

  return <Home user={user} onLogout={handleLogout} />
}

export default App
