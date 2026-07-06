import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "./nav";
import Footer from "./footer";
import { getPublishedBlogs } from "../services/firebaseService";

const TAG_COLORS = {
  Technology: "#0992C2", Culture: "#0AC4E0", Science: "#0B2D72",
  Design: "#0992C2", Philosophy: "#0AC4E0", Travel: "#0B2D72",
  UX: "#0992C2", Writing: "#0AC4E0", Typography: "#0B2D72",
};

export default function Home() {
  const [blogs,   setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [query,   setQuery]   = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    getPublishedBlogs()
      .then(data => setBlogs(data))
      .catch(e => console.error("Home fetch error:", e))
      .finally(() => setLoading(false));
  }, []);

  const featured = blogs.slice(0, 3).map((b, i) => ({
    ...b, color: [C_BLUE, C_CYAN, C_DARK][i] || C_BLUE,
  }));
  const latest = blogs.slice(3, 9);

  const searchResults = query
    ? blogs.filter(b =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        (b.tag || "").toLowerCase().includes(query.toLowerCase()) ||
        (b.authorName || "").toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .home-root { min-height: 100vh; background: #060f24; color: #F6E7BC; font-family: 'DM Sans', sans-serif; }
        .hero { min-height: 100vh; background: linear-gradient(160deg, #0B2D72 0%, #060f24 60%); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 7rem 2rem 5rem; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 800px; height: 800px; background: radial-gradient(circle, rgba(9,146,194,0.18) 0%, transparent 70%); pointer-events: none; }
        .hero::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(10,196,224,0.3), transparent); }
        .hero-eyebrow { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #0AC4E0; margin-bottom: 1.5rem; position: relative; z-index: 1; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(3rem, 8vw, 6.5rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.03em; color: #F6E7BC; max-width: 800px; margin-bottom: 1.5rem; position: relative; z-index: 1; }
        .hero-title em { font-style: italic; color: #0AC4E0; }
        .hero-sub { font-size: 1.1rem; font-weight: 300; color: rgba(246,231,188,0.6); max-width: 480px; line-height: 1.7; margin-bottom: 3rem; position: relative; z-index: 1; }
        .search-wrap { position: relative; width: 100%; max-width: 580px; z-index: 1; }
        .search-input { width: 100%; background: rgba(11,45,114,0.5); border: 1px solid rgba(10,196,224,0.25); border-radius: 4px; padding: 1.1rem 3.5rem 1.1rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 300; color: #F6E7BC; outline: none; transition: border-color 0.3s, box-shadow 0.3s; backdrop-filter: blur(8px); }
        .search-input.focused { border-color: #0AC4E0; box-shadow: 0 0 0 3px rgba(10,196,224,0.12); }
        .search-input::placeholder { color: rgba(246,231,188,0.3); }
        .search-btn { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: #0AC4E0; cursor: pointer; display: flex; align-items: center; padding: 0.25rem; }
        .search-results { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: #0d1e45; border: 1px solid rgba(10,196,224,0.2); border-radius: 4px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5); max-height: 320px; overflow-y: auto; }
        .sri { padding: 0.9rem 1.2rem; border-bottom: 1px solid rgba(10,196,224,0.08); cursor: pointer; transition: background 0.2s; text-align: left; text-decoration: none; display: block; }
        .sri:last-child { border-bottom: none; }
        .sri:hover { background: rgba(10,196,224,0.08); }
        .sri-tag { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: #0992C2; margin-bottom: 0.2rem; }
        .sri-title { font-size: 0.9rem; font-weight: 400; color: #F6E7BC; }
        .search-empty { padding: 1.2rem; font-size: 0.85rem; color: rgba(246,231,188,0.4); text-align: center; }
        .section { max-width: 1200px; margin: 0 auto; padding: 5rem 2rem; }
        .section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 2.5rem; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: #F6E7BC; letter-spacing: -0.02em; }
        .section-link { font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: #0AC4E0; text-decoration: none; transition: opacity 0.2s; }
        .section-link:hover { opacity: 0.7; }
        .featured-grid { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: auto auto; gap: 1.5px; background: rgba(10,196,224,0.1); border: 1px solid rgba(10,196,224,0.1); border-radius: 6px; overflow: hidden; }
        .feat-card { background: #0a1830; padding: 2.5rem; cursor: pointer; transition: background 0.3s; position: relative; overflow: hidden; text-decoration: none; display: block; }
        .feat-card:hover { background: #0d2040; }
        .feat-card.big { grid-row: 1 / 3; padding: 3rem; }
        .feat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 0; background: var(--accent); transition: height 0.4s cubic-bezier(0.16,1,0.3,1); }
        .feat-card:hover::before { height: 100%; }
        .feat-tag { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; }
        .feat-title { font-family: 'Playfair Display', serif; font-weight: 700; letter-spacing: -0.02em; color: #F6E7BC; line-height: 1.25; margin-bottom: 0.9rem; }
        .feat-card.big .feat-title { font-size: 1.9rem; }
        .feat-card:not(.big) .feat-title { font-size: 1.2rem; }
        .feat-excerpt { font-size: 0.9rem; font-weight: 300; color: rgba(246,231,188,0.55); line-height: 1.7; margin-bottom: 1.5rem; }
        .feat-meta { display: flex; align-items: center; gap: 1rem; font-size: 0.75rem; font-weight: 300; color: rgba(246,231,188,0.35); }
        .feat-meta-dot { width: 3px; height: 3px; background: rgba(246,231,188,0.25); border-radius: 50%; }
        .posts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(10,196,224,0.08); border: 1px solid rgba(10,196,224,0.08); border-radius: 6px; overflow: hidden; }
        .post-card { background: #0a1830; padding: 2rem; cursor: pointer; transition: background 0.3s; text-decoration: none; display: block; }
        .post-card:hover { background: #0d2040; }
        .post-tag { font-size: 0.65rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #0992C2; margin-bottom: 0.75rem; display: block; }
        .post-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: #F6E7BC; line-height: 1.35; letter-spacing: -0.01em; margin-bottom: 0.8rem; }
        .post-meta { font-size: 0.73rem; color: rgba(246,231,188,0.3); display: flex; gap: 0.5rem; align-items: center; }
        .nl-section { background: linear-gradient(135deg, #0B2D72, #0992C2); padding: 5rem 2rem; text-align: center; position: relative; overflow: hidden; }
        .nl-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(10,196,224,0.2) 0%, transparent 70%); }
        .nl-inner { position: relative; z-index: 1; max-width: 500px; margin: 0 auto; }
        .nl-title { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 700; color: #F6E7BC; letter-spacing: -0.02em; margin-bottom: 0.75rem; }
        .nl-sub { font-size: 0.95rem; font-weight: 300; color: rgba(246,231,188,0.7); line-height: 1.6; margin-bottom: 2rem; }
        .nl-form { display: flex; max-width: 400px; margin: 0 auto; }
        .nl-input { flex: 1; background: rgba(6,15,36,0.6); border: 1px solid rgba(246,231,188,0.25); border-right: none; border-radius: 4px 0 0 4px; padding: 0.9rem 1.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: #F6E7BC; outline: none; }
        .nl-input::placeholder { color: rgba(246,231,188,0.35); }
        .nl-submit { background: #F6E7BC; color: #0B2D72; border: none; border-radius: 0 4px 4px 0; padding: 0.9rem 1.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: background 0.3s; }
        .nl-submit:hover { background: #0AC4E0; color: #fff; }
        .skeleton { background: linear-gradient(90deg, rgba(10,196,224,0.05) 25%, rgba(10,196,224,0.1) 50%, rgba(10,196,224,0.05) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @media (max-width: 900px) { .featured-grid { grid-template-columns: 1fr; } .feat-card.big { grid-row: auto; } .posts-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 600px) { .posts-grid { grid-template-columns: 1fr; } .nl-form { flex-direction: column; } .nl-input { border-right: 1px solid rgba(246,231,188,0.25); border-bottom: none; border-radius: 4px 4px 0 0; } .nl-submit { border-radius: 0 0 4px 4px; } }
      `}</style>

      <div className="home-root">
        <Nav />

        <section className="hero">
          <div className="hero-eyebrow">Welcome to Blogify</div>
          <h1 className="hero-title">Words that <em>move</em> the world</h1>
          <p className="hero-sub">Discover thoughtful writing on culture, science, design and everything in between.</p>

          <div className="search-wrap">
            <input
              className={`search-input${focused ? " focused" : ""}`}
              type="text"
              placeholder="Search articles, topics, authors..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
            />
            <button className="search-btn" aria-label="Search">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            {query && focused && (
              <div className="search-results">
                {searchResults.length > 0 ? searchResults.map(p => (
                  <Link key={p.id} to={`/read/${p.id}`} className="sri">
                    <div className="sri-tag">{p.tag}</div>
                    <div className="sri-title">{p.title}</div>
                  </Link>
                )) : (
                  <div className="search-empty">No results for &ldquo;{query}&rdquo;</div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Featured */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Featured Stories</h2>
            <Link to="/blogs" className="section-link">All articles &rarr;</Link>
          </div>
          {loading ? (
            <div style={{ height: "400px" }} className="skeleton" />
          ) : (
            <div className="featured-grid">
              {featured.map((f, i) => (
                <Link key={f.id} to={`/read/${f.id}`} className={`feat-card${i === 0 ? " big" : ""}`} style={{ "--accent": f.color }}>
                  <div className="feat-tag">{f.tag}</div>
                  <h3 className="feat-title">{f.title}</h3>
                  {i === 0 && <p className="feat-excerpt">{f.excerpt}</p>}
                  <div className="feat-meta">
                    <span>{f.authorName}</span>
                    <span className="feat-meta-dot" />
                    <span>{f.date}</span>
                    <span className="feat-meta-dot" />
                    <span>{f.readTime} read</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Latest */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <h2 className="section-title">Latest Posts</h2>
            <Link to="/blogs" className="section-link">View all &rarr;</Link>
          </div>
          {loading ? (
            <div style={{ height: "300px" }} className="skeleton" />
          ) : (
            <div className="posts-grid">
              {latest.map(p => (
                <Link key={p.id} to={`/read/${p.id}`} className="post-card">
                  <span className="post-tag">{p.tag}</span>
                  <div className="post-title">{p.title}</div>
                  <div className="post-meta">
                    <span>{p.authorName}</span>
                    <span>&middot;</span>
                    <span>{p.readTime} read</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter */}
        <section className="nl-section">
          <div className="nl-inner">
            <h2 className="nl-title">Stay in the loop</h2>
            <p className="nl-sub">Get the best articles delivered straight to your inbox — no noise, just good reading.</p>
            <div className="nl-form">
              <input className="nl-input" type="email" placeholder="your@email.com" />
              <button className="nl-submit">Subscribe</button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

const C_BLUE = "#0992C2";
const C_CYAN = "#0AC4E0";
const C_DARK = "#0B2D72";