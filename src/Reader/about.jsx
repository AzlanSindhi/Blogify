import Nav from "./nav";
import Footer from "./footer";

const TEAM = [
  { name: "Aria Mehta", role: "Editor in Chief", initial: "A" },
  { name: "Leo Strand", role: "Head of Culture", initial: "L" },
  { name: "Dev Patel", role: "Technology Editor", initial: "D" },
  { name: "Priya Nair", role: "Science Correspondent", initial: "P" },
];

const STATS = [
  { value: "12K+", label: "Readers" },
  { value: "400+", label: "Articles Published" },
  { value: "40+", label: "Contributing Writers" },
  { value: "18", label: "Countries Reached" },
];

export default function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .about-root {
          min-height: 100vh;
          background: #060f24;
          color: #F6E7BC;
          font-family: 'DM Sans', sans-serif;
        }

        /* HERO */
        .about-hero {
          background: linear-gradient(150deg, #0B2D72 0%, #060f24 55%);
          padding: 10rem 2rem 7rem;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .about-hero-eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0AC4E0;
          margin-bottom: 1.2rem;
        }
        .about-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          color: #F6E7BC;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .about-hero-title em {
          font-style: italic;
          color: #0AC4E0;
        }
        .about-hero-p {
          font-size: 1rem;
          font-weight: 300;
          color: rgba(246,231,188,0.6);
          line-height: 1.8;
        }
        .about-hero-visual {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: rgba(10,196,224,0.1);
          border: 1px solid rgba(10,196,224,0.1);
          border-radius: 6px;
          overflow: hidden;
        }
        .about-stat {
          background: #0a1830;
          padding: 2.5rem 2rem;
          text-align: center;
        }
        .about-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 900;
          color: #0AC4E0;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 0.4rem;
        }
        .about-stat-label {
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(246,231,188,0.35);
        }

        /* MISSION */
        .mission-section {
          border-top: 1px solid rgba(10,196,224,0.08);
          border-bottom: 1px solid rgba(10,196,224,0.08);
          background: linear-gradient(180deg, rgba(11,45,114,0.2) 0%, transparent 100%);
        }
        .mission-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 2rem;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          align-items: start;
        }
        .mission-label {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0992C2;
          padding-top: 0.4rem;
        }
        .mission-content {}
        .mission-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #F6E7BC;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
        }
        .mission-p {
          font-size: 0.95rem;
          font-weight: 300;
          color: rgba(246,231,188,0.55);
          line-height: 1.85;
          margin-bottom: 1.2rem;
        }
        .mission-p:last-child { margin-bottom: 0; }
        .mission-highlight {
          font-size: 1.2rem;
          font-weight: 300;
          font-style: italic;
          font-family: 'Playfair Display', serif;
          color: rgba(246,231,188,0.75);
          border-left: 2px solid #0AC4E0;
          padding-left: 1.5rem;
          margin: 2rem 0;
          line-height: 1.6;
        }

        /* TEAM */
        .team-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 2rem;
        }
        .team-header {
          display: flex;
          align-items: baseline;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .team-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #F6E7BC;
          letter-spacing: -0.02em;
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(10,196,224,0.08);
          border: 1px solid rgba(10,196,224,0.08);
          border-radius: 6px;
          overflow: hidden;
        }
        .team-card {
          background: #0a1830;
          padding: 2.5rem 2rem;
          transition: background 0.3s;
        }
        .team-card:hover { background: #0d2040; }
        .team-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0992C2, #0AC4E0);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #F6E7BC;
          margin-bottom: 1.2rem;
        }
        .team-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #F6E7BC;
          letter-spacing: -0.01em;
          margin-bottom: 0.3rem;
        }
        .team-role {
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0992C2;
        }

        /* VALUES */
        .values-section {
          background: linear-gradient(135deg, #0B2D72 0%, #0992C2 100%);
          padding: 6rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .values-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 50%, rgba(10,196,224,0.15) 0%, transparent 70%);
        }
        .values-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .values-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #F6E7BC;
          letter-spacing: -0.02em;
          margin-bottom: 3rem;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .value-item {}
        .value-num {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 900;
          color: rgba(246,231,188,0.15);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .value-name {
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #F6E7BC;
          margin-bottom: 0.6rem;
        }
        .value-desc {
          font-size: 0.88rem;
          font-weight: 300;
          color: rgba(246,231,188,0.6);
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .about-hero { grid-template-columns: 1fr; gap: 3rem; }
          .team-grid { grid-template-columns: repeat(2, 1fr); }
          .values-grid { grid-template-columns: repeat(2, 1fr); }
          .mission-inner { grid-template-columns: 1fr; gap: 2rem; }
        }
        @media (max-width: 600px) {
          .team-grid { grid-template-columns: 1fr; }
          .values-grid { grid-template-columns: 1fr; }
          .about-hero-visual { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="about-root">
        <Nav />

        {/* HERO */}
        <div className="about-hero">
          <div>
            <div className="about-hero-eyebrow">✦ Our story</div>
            <h1 className="about-hero-title">
              Built for the <em>curious</em> mind
            </h1>
            <p className="about-hero-p">
              Reader was born from a simple frustration: the internet is vast, but finding writing that genuinely matters to you feels increasingly rare. We set out to change that.
            </p>
          </div>
          <div className="about-hero-visual">
            {STATS.map(s => (
              <div key={s.label} className="about-stat">
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MISSION */}
        <div className="mission-section">
          <div className="mission-inner">
            <div className="mission-label">Our Mission</div>
            <div className="mission-content">
              <h2 className="mission-title">Good writing deserves a good home</h2>
              <p className="mission-p">
                We believe the web has made publishing easy but discovery hard. Algorithms optimise for clicks, not comprehension. Feeds reward novelty over nuance. The result is a glut of content and a famine of meaning.
              </p>
              <blockquote className="mission-highlight">
                "We want reading to feel like what it always was — a private conversation between a writer and a reader."
              </blockquote>
              <p className="mission-p">
                Reader is our attempt to restore that. We curate carefully, present cleanly, and never let advertising distort what surfaces. Every article you find here was chosen because it deserves to be read, not because it paid to be seen.
              </p>
            </div>
          </div>
        </div>

        {/* TEAM */}
        <div className="team-section">
          <div className="team-header">
            <h2 className="team-title">The Team</h2>
          </div>
          <div className="team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="team-card">
                <div className="team-avatar">{m.initial}</div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* VALUES */}
        <div className="values-section">
          <div className="values-inner">
            <h2 className="values-title">What we stand for</h2>
            <div className="values-grid">
              {[
                { n: "01", name: "Clarity", desc: "We believe in writing that is precise and honest. No clickbait, no manufactured outrage." },
                { n: "02", name: "Depth", desc: "Short takes are fine. Long reads are better. We make space for both without apologising for either." },
                { n: "03", name: "Independence", desc: "No investors demanding growth at all costs. No advertisers bending editorial. Just readers and writers." },
              ].map(v => (
                <div key={v.n} className="value-item">
                  <div className="value-num">{v.n}</div>
                  <div className="value-name">{v.name}</div>
                  <p className="value-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}