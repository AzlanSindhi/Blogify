import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "./nav";
import Footer from "./footer";
import { getPublishedBlogs } from "../services/firebaseService";

const TAGS = ["All", "Technology", "Culture", "Science", "Design", "Philosophy", "Travel", "UX", "Writing", "Typography"];

const TAG_COLORS = {
  Technology: "#0AC4E0", Culture: "#0992C2", Science: "#0B2D72",
  Design: "#0AC4E0", Philosophy: "#0992C2", Travel: "#F6E7BC",
  UX: "#0AC4E0", Writing: "#0992C2", Typography: "#0B2D72",
};

export default function Blogs() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [active,  setActive]  = useState("All");
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    getPublishedBlogs()
      .then(data => setPosts(data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p =>
    (active === "All" || p.tag === active) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) ||
     (p.excerpt || "").toLowerCase().includes(search.toLowerCase()) ||
     (p.authorName || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .blogs-root { min-height: 100vh; background: #060f24; color: #F6E7BC; font-family: 'DM Sans', sans-serif; }
        .blogs-hero { background: linear-gradient(160deg, #0B2D72 0%, #060f24 60%); padding: 9rem 2rem 5rem; text-align: center; position: relative; overflow: hidden; }
        .blogs-hero::before { content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(9,146,194,0.15) 0%, transparent 70%); }
        .blogs-hero-eyebrow { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #0AC4E0; margin-bottom: 1rem; position: relative; z-index: 1; }
        .blogs-hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; letter-spacing: -0.03em; color: #F6E7BC; position: relative; z-index: 1; margin-bottom: 0.75rem; }
        .blogs-hero-sub { font-size: 1rem; font-weight: 300; color: rgba(246,231,188,0.5); position: relative; z-index: 1; }
        .filter-bar { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 0; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
        .filter-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .filter-tag { background: none; border: 1px solid rgba(10,196,224,0.2); border-radius: 2px; padding: 0.4rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(246,231,188,0.5); cursor: pointer; transition: all 0.25s; }
        .filter-tag:hover { border-color: #0992C2; color: #F6E7BC; }
        .filter-tag.active { background: #0992C2; border-color: #0992C2; color: #F6E7BC; }
        .filter-search { background: rgba(11,45,114,0.4); border: 1px solid rgba(10,196,224,0.2); border-radius: 4px; padding: 0.5rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 300; color: #F6E7BC; outline: none; transition: border-color 0.3s; width: 220px; }
        .filter-search:focus { border-color: #0AC4E0; }
        .filter-search::placeholder { color: rgba(246,231,188,0.25); }
        .blogs-grid-wrap { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 5rem; }
        .result-count { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(246,231,188,0.3); margin-bottom: 2rem; }
        .result-count span { color: #0AC4E0; }
        .blogs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(10,196,224,0.08); border: 1px solid rgba(10,196,224,0.08); border-radius: 6px; overflow: hidden; }
        .blog-card { background: #0a1830; padding: 2.2rem; cursor: pointer; transition: background 0.3s; display: flex; flex-direction: column; position: relative; text-decoration: none; }
        .blog-card:hover { background: #0d2040; }
        .blog-card-accent { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .blog-card:hover .blog-card-accent { transform: scaleX(1); }
        .blog-tag { font-size: 0.65rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.8rem; }
        .blog-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: #F6E7BC; line-height: 1.35; letter-spacing: -0.01em; margin-bottom: 0.7rem; }
        .blog-excerpt { font-size: 0.84rem; font-weight: 300; color: rgba(246,231,188,0.45); line-height: 1.65; flex: 1; margin-bottom: 1.2rem; }
        .blog-meta { display: flex; align-items: center; gap: 0.6rem; font-size: 0.72rem; color: rgba(246,231,188,0.3); }
        .blog-meta-dot { width: 2px; height: 2px; background: rgba(246,231,188,0.2); border-radius: 50%; }
        .no-results { grid-column: 1/-1; text-align: center; padding: 5rem 2rem; color: rgba(246,231,188,0.3); font-size: 0.9rem; }
        .skeleton-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(10,196,224,0.08); border-radius: 6px; overflow: hidden; }
        .skeleton-card { background: #0a1830; height: 200px; background: linear-gradient(90deg,rgba(10,196,224,0.04) 25%,rgba(10,196,224,0.08) 50%,rgba(10,196,224,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @media (max-width: 960px) { .blogs-grid { grid-template-columns: repeat(2,1fr); } .skeleton-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 600px) { .blogs-grid { grid-template-columns: 1fr; } .filter-bar { flex-direction: column; align-items: flex-start; } .filter-search { width: 100%; } }
      `}</style>

      <div className="blogs-root">
        <Nav />

        <section className="blogs-hero">
          <div className="blogs-hero-eyebrow">The Archive</div>
          <h1 className="blogs-hero-title">All Articles</h1>
          <p className="blogs-hero-sub">{loading ? "Loading..." : `${posts.length} stories and counting`}</p>
        </section>

        <div className="filter-bar">
          <div className="filter-tags">
            {TAGS.map(t => (
              <button key={t} className={`filter-tag${active === t ? " active" : ""}`} onClick={() => setActive(t)}>{t}</button>
            ))}
          </div>
          <input className="filter-search" type="text" placeholder="Search articles..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="blogs-grid-wrap">
          <p className="result-count">
            Showing <span>{filtered.length}</span> of {posts.length} articles
          </p>
          {loading ? (
            <div className="skeleton-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="blogs-grid">
              {filtered.length > 0 ? filtered.map(p => (
                <Link key={p.id} to={`/read/${p.id}`} className="blog-card" style={{ "--accent": TAG_COLORS[p.tag] || "#0992C2" }}>
                  <div className="blog-card-accent" />
                  <div className="blog-tag">{p.tag}</div>
                  <h3 className="blog-title">{p.title}</h3>
                  {p.excerpt && <p className="blog-excerpt">{p.excerpt}</p>}
                  <div className="blog-meta">
                    <span>{p.authorName}</span>
                    <span className="blog-meta-dot" />
                    <span>{p.date}</span>
                    <span className="blog-meta-dot" />
                    <span>{p.readTime} read</span>
                  </div>
                </Link>
              )) : (
                <div className="no-results">No articles match your search.</div>
              )}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}