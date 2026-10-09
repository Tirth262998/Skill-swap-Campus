import Navbar from '../components/Navbar'

export default function NotFound({ user, onLogout }) {
  return (
    <>
      <Navbar page="notFound" user={user} onLogout={onLogout} />
      <main className="not-found">
        <span className="eyebrow">PAGE NOT FOUND</span>
        <h1>Oops! Page not found.</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <a className="button button-primary" href="/">Back to home</a>
      </main>
    </>
  )
}
