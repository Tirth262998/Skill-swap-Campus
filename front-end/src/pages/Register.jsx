import Navbar from '../components/Navbar'
import AuthPage from '../components/AuthPage'

export const COLLEGE_EMAIL_DOMAIN = '@student.nitw.ac.in'

export default function Register({ user, onLogout, onLoginSuccess }) {
  return (
    <>
      <Navbar page="register" user={user} onLogout={onLogout} />
      <AuthPage
        mode="register"
        onLoginSuccess={onLoginSuccess}
        allowedDomain={COLLEGE_EMAIL_DOMAIN}
      />
    </>
  )
}
