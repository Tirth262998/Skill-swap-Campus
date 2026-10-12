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

          <div className="hero-art" aria-label="A campus network connecting students through skill exchange" role="img">
            <div className="campus-visual">
              <div className="campus-visual-heading">
                <span className="campus-visual-brand"><span className="campus-brand-glyph">S</span> SKILLSWAP <i>·</i> CAMPUS</span>
                <span className="campus-visual-live"><span /> NETWORK LIVE</span>
              </div>

              <div className="campus-network">
                <svg className="network-lines" viewBox="0 0 480 310" fill="none" aria-hidden="true">
                  <path d="M240 145 102 62M240 145 378 62M240 145 102 248M240 145 378 248" />
                  <circle cx="102" cy="62" r="4" />
                  <circle cx="378" cy="62" r="4" />
                  <circle cx="102" cy="248" r="4" />
                  <circle cx="378" cy="248" r="4" />
                </svg>

                <div className="network-skill network-skill-java">
                  <span className="network-skill-icon">01</span>
                  <span><small>CAN TEACH</small><strong>Java mentoring</strong></span>
                </div>
                <div className="network-skill network-skill-design">
                  <span className="network-skill-icon">02</span>
                  <span><small>WANTS TO LEARN</small><strong>UI/UX design</strong></span>
                </div>
                <div className="network-skill network-skill-photo">
                  <span className="network-skill-icon">03</span>
                  <span><small>ALSO SHARED</small><strong>Photography</strong></span>
                </div>
                <div className="network-skill network-skill-code">
                  <span className="network-skill-icon">04</span>
                  <span><small>ALSO LEARNING</small><strong>Web development</strong></span>
                </div>

                <div className="campus-hub">
                  <span className="campus-hub-icon" aria-hidden="true"><BookOpenIcon size={23} /></span>
                  <strong>SKILL<br />EXCHANGE</strong>
                  <span className="campus-hub-people">
                    <span className="network-avatar network-avatar-purple">A</span>
                    <span className="network-avatar network-avatar-amber">M</span>
                    <span>Aarav <i>×</i> Mira</span>
                  </span>
                  <span className="campus-hub-caption">YOUR CAMPUS</span>
                </div>
              </div>

              <div className="campus-visual-footer">
                <span><i /> 2 students connected</span>
                <span className="campus-visual-exchange">KNOWLEDGE GOES BOTH WAYS <b>↗</b></span>
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
