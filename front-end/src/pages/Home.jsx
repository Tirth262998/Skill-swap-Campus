import Navbar from '../components/Navbar'
import Brand from '../components/Brand'

export default function Home({ user, onLogout }) {
  return (
    <>
      <Navbar page="home" user={user} onLogout={onLogout} />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow"><span className="status-dot" /> LEARN FROM YOUR CAMPUS</span>
            <h1>Good at something?<br /><span>Pass it on.</span></h1>
            <p className="hero-description">
              SkillSwap Campus is a peer-to-peer campus skill exchange.
              Share what you know and find a fellow student who can teach
              you something new.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="/register">Create your account <span aria-hidden="true">→</span></a>
              <a className="button button-secondary" href="/login">I already have an account</a>
            </div>
            <p className="hero-footnote">Made for students, powered by each other.</p>
          </div>
          <div className="hero-art" aria-label="Illustration of students exchanging ideas" role="img">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="art-sun" />
            <div className="art-card card-blue"><span className="art-icon">✦</span><span>Teach what<br />you know</span></div>
            <div className="art-card card-cream"><span className="art-icon">↗</span><span>Learn something<br />new</span></div>
            <div className="art-center"><span className="center-star">✳</span><span>share<br /><b>skills</b></span></div>
            <span className="art-spark spark-one" aria-hidden="true">✳</span>
            <span className="art-spark spark-two" aria-hidden="true">✦</span>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">A LITTLE GIVE. A LOT TO GAIN.</span>
            <h2>Your campus is full of teachers.</h2>
            <p>They just might be sitting right next to you.</p>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3>Bring your curiosity</h3>
              <p>Tell your campus community what you enjoy learning and what you can share.</p>
            </article>
            <article className="step-card">
              <span className="step-number">02</span>
              <h3>Meet a peer</h3>
              <p>Connect with students who are excited to trade time, ideas, and know-how.</p>
            </article>
            <article className="step-card">
              <span className="step-number">03</span>
              <h3>Grow together</h3>
              <p>Every exchange is a chance to learn something and help someone else do the same.</p>
            </article>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <Brand />
        <span>Peer learning starts here.</span>
      </footer>
    </>
  )
}
