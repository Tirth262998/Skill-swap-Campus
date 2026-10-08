import { useState, useEffect } from 'react'
import './App.css'
import { apiCall } from './services/api'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

const pageFromPath = () => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return 'home'
  if (path === '/register') return 'register'
  if (path === '/login') return 'login'
  if (path === '/dashboard') return 'dashboard'
  if (path === '/profile') return 'profile'
  return 'notFound'
}

function App() {
  const page = pageFromPath()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Check authenticated session on load
  useEffect(() => {
    let isMounted = true
    const checkAuth = async () => {
      setAuthLoading(true)
      const res = await apiCall('/auth/me', { method: 'GET' })

      if (!isMounted) return

      if (res.success && res.data.user) {
        setUser(res.data.user)
        // Also fetch profile if authenticated
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

  // Redirect protection once auth check completes
  useEffect(() => {
    if (!authLoading) {
      if ((page === 'dashboard' || page === 'profile') && !user) {
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

  if (authLoading && (page === 'dashboard' || page === 'profile')) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#f5f7fa', color: '#63718a' }}>
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

  if (page === 'notFound') {
    return <NotFound user={user} onLogout={handleLogout} />
  }

  return <Home user={user} onLogout={handleLogout} />
}

export default App
