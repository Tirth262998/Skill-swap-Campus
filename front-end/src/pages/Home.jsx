import Navbar from '../components/Navbar'
import Brand from '../components/Brand'
import { BookOpenIcon, CheckIcon, DiscoverIcon, SkillsIcon, UserIcon } from '../components/Icons'

export default function Home({ user, onLogout }) {
  return (
    <>
      <Navbar page="home" user={user} onLogout={onLogout} />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow"><span className="status-dot" /> LEARN FROM YOUR CAMPUS</span>
            <h1>Good at something?<span>Pass it on.</span></h1>
            <p className="hero-description">
              SkillSwap Campus helps students teach what they know, learn what they want,
              and grow through meaningful peer-to-peer exchange.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="/register">Create your account <span aria-hidden="true">→</span></a>
              <a className="button button-secondary" href="/login">I already have an account</a>
            </div>
            <p className="hero-footnote">Made for students, powered by each other.</p>
          </div>

          <div className="hero-art" aria-label="Illustration of students exchanging skills" role="img">
            <div className="skill-visual">
              <div className="connection-line connection-left" aria-hidden="true" />
              <div className="connection-line connection-right" aria-hidden="true" />

              <div className="student-card student-card-left">
                <div className="student-header">
                  <div className="avatar avatar-blue">A</div>
                  <div>
                    <p className="student-name">Aarav</p>
                    <span className="student-role">Java • CSE</span>
                  </div>
                </div>
                <div className="skill-stack">
                  <span className="skill-tag skill-tag-primary">Java</span>
                  <span className="skill-tag skill-tag-soft">Mentoring</span>
                </div>
                <p className="student-note">Can teach</p>
              </div>

              <div className="match-badge">
                <span>Match</span>
              </div>

              <div className="student-card student-card-right">
                <div className="student-header">
                  <div className="avatar avatar-gold">M</div>
                  <div>
                    <p className="student-name">Mira</p>
                    <span className="student-role">UI/UX • Design</span>
                  </div>
                </div>
                <div className="skill-stack">
                  <span className="skill-tag skill-tag-accent">UI/UX</span>
                  <span className="skill-tag skill-tag-soft">Design</span>
                </div>
                <p className="student-note">Wants to learn</p>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-section">
          <div className="section-heading">
            <span className="eyebrow">WHY STUDENTS USE IT</span>
            <h2>Built for peer learning.</h2>
            <p>Share expertise, discover new skills, and connect with classmates who are learning the same way you are.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon"><UserIcon size={20} /></div>
              <h3>Share your strengths</h3>
              <p>List the skills you can teach and help others move forward with confidence.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon"><DiscoverIcon size={20} /></div>
              <h3>Discover peers</h3>
              <p>Find students with complementary interests and practical campus connections.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon"><SkillsIcon size={20} /></div>
              <h3>Build your skill stack</h3>
              <p>Track the knowledge you offer and the areas you want to deepen.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon"><CheckIcon size={20} /></div>
              <h3>Learn together</h3>
              <p>Turn one-to-one exchange into a stronger and more collaborative campus community.</p>
            </article>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">A LITTLE GIVE. A LOT TO GAIN.</span>
            <h2>Your campus is full of teachers.</h2>
            <p>It starts with one conversation, one idea, and one skill you’re ready to share.</p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3>Create your profile</h3>
              <p>Tell your campus community who you are, what you study, and what you’re excited about.</p>
            </article>
            <article className="step-card">
              <span className="step-number">02</span>
              <h3>Add your skills</h3>
              <p>Share what you can teach and the topics you want to learn more deeply.</p>
            </article>
            <article className="step-card">
              <span className="step-number">03</span>
              <h3>Find the right match</h3>
              <p>Discover students with complementary skills and mutual motivation.</p>
            </article>
            <article className="step-card">
              <span className="step-number">04</span>
              <h3>Grow together</h3>
              <p>Exchange time, ideas, and support to build a stronger learning network.</p>
            </article>
          </div>
        </section>

        <section className="community-section">
          <div className="community-panel">
            <div className="community-copy">
              <span className="eyebrow">LEARN WITH YOUR PEOPLE</span>
              <h2>Build a network that helps everyone grow.</h2>
              <p>
                SkillSwap Campus makes it easy to learn from classmates, share practical experience,
                and turn campus connections into meaningful opportunities.
              </p>
            </div>

            <div className="community-points" aria-label="SkillSwap Campus benefits">
              <div className="community-point"><span className="check-pill"><CheckIcon size={14} /></span> Share knowledge with peers</div>
              <div className="community-point"><span className="check-pill"><CheckIcon size={14} /></span> Learn skills that matter to you</div>
              <div className="community-point"><span className="check-pill"><CheckIcon size={14} /></span> Build a more connected campus community</div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel">
            <span className="eyebrow">YOUR NEXT SKILL EXCHANGE STARTS HERE</span>
            <h2>Share what you know. Learn what you want.</h2>
            <div className="cta-actions">
              <a className="button button-primary" href="/register">Get started <span aria-hidden="true">→</span></a>
              <a className="button button-secondary" href="/login">Log in</a>
            </div>
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
