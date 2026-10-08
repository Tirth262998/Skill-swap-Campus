import Navbar from '../components/Navbar'

export default function NotFound({ user, onLogout }) {
  return (
    <>
      <Navbar page="notFound" user={user} onLogout={onLogout} />
      <main className="not-found">
        <span className="eyebrow">PAGE NOT FOUND</span>
        <h1>This page is not part of Week 1.</h1>
        <p>That section may be added in a future phase.</p>
        <a className="button button-primary" href="/">Back to home</a>
      </main>
    </>
  )
}
