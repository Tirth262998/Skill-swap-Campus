import { useEffect } from 'react'
import Icon from '../components/Icon.jsx'

function LandingPage() {
  useEffect(() => {
    const revealItems = document.querySelectorAll('.landing-reveal')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          currentObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' })

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="landing-eyebrow"><span className="status-dot" /> YOUR CAMPUS. YOUR NEXT SKILL.</span>
          <h1>Learn from a peer.<br /><span>Teach what you love.</span></h1>
          <p className="landing-lede">
            Trade skills with students around you. Get help with something
            new, share what you already know, and grow together.
          </p>
          <div className="landing-actions">
            <a className="button button-primary landing-primary" href="/register">Explore SkillSwap <span aria-hidden="true">→</span></a>
            <a className="landing-text-link" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
          </div>
          <div className="landing-promise">
            <span><Icon name="users" /></span>
            <p><strong>Everyone has something to teach.</strong><br />And everyone has something new to learn.</p>
          </div>
        </div>

        <div className="exchange-visual" aria-label="Example of students exchanging skills">
          <div className="exchange-glow" aria-hidden="true" />
          <div className="exchange-topline"><span className="exchange-live-dot" /> A SKILL EXCHANGE</div>
          <article className="exchange-card exchange-teach">
            <span className="exchange-card-icon"><Icon name="book" /></span>
            <div><span>I CAN TEACH</span><strong>Photography</strong><small>Jamie · Year 2</small></div>
            <span className="exchange-arrow" aria-hidden="true">↗</span>
          </article>
          <div className="exchange-connector"><span><Icon name="exchange" /></span></div>
          <article className="exchange-card exchange-learn">
            <span className="exchange-card-icon"><Icon name="bulb" /></span>
            <div><span>I WANT TO LEARN</span><strong>Web design</strong><small>Alex · Year 1</small></div>
            <span className="exchange-arrow" aria-hidden="true">↗</span>
          </article>
          <div className="exchange-caption"><Icon name="users" /> Skills grow when they’re shared.</div>
        </div>
      </section>

      <section className="landing-roles" aria-labelledby="roles-title">
        <div className="landing-section-heading landing-reveal">
          <span className="landing-eyebrow">TWO SIDES. ONE CAMPUS COMMUNITY.</span>
          <h2 id="roles-title">Come to learn. Stay to share.</h2>
          <p>You don’t need to be an expert. Just bring a skill or a little curiosity.</p>
        </div>
        <div className="role-grid">
          <article className="role-card role-learner landing-reveal">
            <span className="role-icon"><Icon name="bulb" /></span>
            <span className="role-kicker">FOR THE CURIOUS</span>
            <h3>Find your next “aha!”</h3>
            <p>Pick up practical skills from people who understand campus life—one friendly peer at a time.</p>
            <span className="role-example"><i aria-hidden="true" /> Learn a language, try coding, or get better at presentations.</span>
          </article>
          <article className="role-card role-teacher landing-reveal">
            <span className="role-icon"><Icon name="book" /></span>
            <span className="role-kicker">FOR THE KNOWLEDGE-SHARERS</span>
            <h3>Your experience can help.</h3>
            <p>Turn something you already know into someone else’s breakthrough. Teaching is a great way to grow, too.</p>
            <span className="role-example"><i aria-hidden="true" /> Share design tips, music basics, or study strategies.</span>
          </article>
        </div>
      </section>

      <section className="landing-steps" id="how-it-works">
        <div className="section-heading landing-reveal">
          <span className="landing-eyebrow">SIMPLE BY DESIGN</span>
          <h2>Make learning a two-way street.</h2>
          <p>Start with what you know—or what you’d love to learn.</p>
        </div>
        <div className="landing-steps-grid">
          <article className="step-card landing-reveal">
            <span className="step-number">01 <i>— START</i></span>
            <h3>Share your skills</h3>
            <p>Let your campus know what you can teach and what you’re curious about.</p>
          </article>
          <article className="step-card landing-reveal">
            <span className="step-number">02 <i>— CONNECT</i></span>
            <h3>Find a peer</h3>
            <p>Discover someone whose knowledge matches what you want to explore.</p>
          </article>
          <article className="step-card landing-reveal">
            <span className="step-number">03 <i>— GROW</i></span>
            <h3>Learn together</h3>
            <p>Exchange ideas, build confidence, and take a new skill with you.</p>
          </article>
        </div>
        <div className="landing-cta landing-reveal">
          <div><span>YOUR NEXT SKILL IS CLOSER THAN YOU THINK</span><h2>Make your campus part of your classroom.</h2></div>
          <a className="button button-primary landing-primary" href="/register">Get started <span aria-hidden="true">→</span></a>
        </div>
        <p className="landing-preview-note">This is a frontend preview.</p>
      </section>
    </main>
  )
}

export default LandingPage
