import Navbar from '../components/Navbar'
import AuthPage from '../components/AuthPage'

export default function Login({ user, onLogout, onLoginSuccess }) {
  return (
    <>
      <Navbar page="login" user={user} onLogout={onLogout} />
      <AuthPage mode="login" onLoginSuccess={onLoginSuccess} />
    </>
  )
}
