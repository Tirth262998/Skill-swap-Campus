import SiteHeader from '../components/SiteHeader.jsx'

function NotFoundPage({ theme, onToggleTheme }) {
  return (
    <>
      <SiteHeader page="notFound" theme={theme} onToggleTheme={onToggleTheme} />
      <main className="not-found">
        <span className="eyebrow">PAGE NOT FOUND</span>
        <h1>This page does not exist.</h1>
        <p>That section may be added in a future phase.</p>
        <a className="button button-primary" href="/">Back to home</a>
      </main>
    </>
  )
}

export default NotFoundPage
