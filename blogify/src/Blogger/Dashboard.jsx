import { useNavigate, Link } from "react-router-dom";
import { useBlogger } from "./BloggerContext";
import BloggerLayout from "./BloggerLayout";

const C = { blue: "#81A6C6", sky: "#AACDDC", sand: "#D2C4B4", cream: "#F3E3D0" };

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8ddd4", borderRadius: "12px", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color }} />
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", marginBottom: "1rem" }}>{icon}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: "700", color: "#2a2a2a", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "0.4rem" }}>{value}</div>
      <div style={{ fontSize: "0.72rem", fontWeight: "500", color: "#888", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.7rem", color: "#bbb", marginTop: "0.3rem" }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontSize: "0.82rem", color: "#555" }}>{label}</span>
        <span style={{ fontSize: "0.82rem", color: "#888", fontWeight: "300" }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height: "6px", background: "#f0e8de", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { blogs, blogger, blogsLoading } = useBlogger();
  const navigate = useNavigate();

  const published     = blogs.filter(b => b.status === "published");
  const drafts        = blogs.filter(b => b.status === "draft");
  const totalViews    = blogs.reduce((s, b) => s + (b.views || 0), 0);
  const totalLikes    = blogs.reduce((s, b) => s + (b.likes || 0), 0);
  const totalComments = blogs.reduce((s, b) => s + (b.commentCount || 0), 0);
  const topBlog       = [...published].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
  const maxViews      = Math.max(...blogs.map(b => b.views || 0), 1);

  if (blogsLoading) {
    return (
      <BloggerLayout>
        <div style={{ textAlign: "center", padding: "5rem", color: "#aaa", fontFamily: "'DM Sans',sans-serif" }}>
          Loading your dashboard...
        </div>
      </BloggerLayout>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .db-welcome { margin-bottom: 2rem; }
        .db-welcome-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: #2a2a2a; letter-spacing: -0.03em; margin-bottom: 0.3rem; }
        .db-welcome-title span { color: #81A6C6; }
        .db-welcome-sub { font-size: 0.88rem; font-weight: 300; color: #aaa; }
        .db-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.2rem; margin-bottom: 2rem; }
        .db-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.2rem; }
        .db-card { background: #fff; border: 1px solid #e8ddd4; border-radius: 12px; padding: 1.5rem; }
        .db-card-title { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #aaa; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; }
        .db-card-title a { color: #81A6C6; text-decoration: none; font-size: 0.7rem; }
        .db-table { width: 100%; border-collapse: collapse; }
        .db-th { font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; padding: 0 0 0.8rem; text-align: left; border-bottom: 1px solid #f0e8de; }
        .db-td { padding: 0.9rem 0; font-size: 0.84rem; color: #555; border-bottom: 1px solid #f0e8de; vertical-align: middle; }
        .db-td:last-child { text-align: right; color: #aaa; }
        .db-post-title-cell { font-size: 0.86rem; color: #2a2a2a; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .db-badge { display: inline-block; font-size: 0.62rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 99px; }
        .db-badge.published { background: rgba(129,166,198,0.12); color: #81A6C6; }
        .db-badge.draft { background: rgba(210,196,180,0.3); color: #a08060; }
        .db-top-post { background: linear-gradient(135deg, #81A6C6 0%, #AACDDC 100%); border-radius: 12px; padding: 1.8rem; color: #fff; position: relative; overflow: hidden; margin-bottom: 1.2rem; }
        .db-top-post::before { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; }
        .db-top-label { font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 0.7rem; }
        .db-top-title { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; line-height: 1.3; margin-bottom: 1.2rem; position: relative; z-index: 1; }
        .db-top-stats { display: flex; gap: 1.5rem; position: relative; z-index: 1; }
        .db-top-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1; }
        .db-top-stat-label { font-size: 0.68rem; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.08em; }
        .db-new-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: #81A6C6; border: none; border-radius: 8px; padding: 0.7rem 1.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: #fff; cursor: pointer; transition: background 0.2s; text-decoration: none; }
        .db-new-btn:hover { background: #6b93b5; }
        .db-empty { text-align: center; padding: 3rem; color: #bbb; font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-style: italic; }
        @media (max-width: 1100px) { .db-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 700px) { .db-grid { grid-template-columns: 1fr; } }
      `}</style>

      <BloggerLayout>
        <div className="db-welcome">
          <h1 className="db-welcome-title">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},&nbsp;
            <span>{blogger?.displayName?.split(" ")[0] || "Writer"}</span>
          </h1>
          <p className="db-welcome-sub">Here&apos;s how your content is performing.</p>
        </div>

        <div className="db-stats">
          <StatCard label="Published Posts" value={published.length} sub={`${drafts.length} draft${drafts.length !== 1 ? "s" : ""}`} color={C.blue} icon="📝" />
          <StatCard label="Total Views" value={totalViews.toLocaleString()} sub="all time" color={C.sky} icon="👁" />
          <StatCard label="Total Likes" value={totalLikes.toLocaleString()} sub="across all posts" color={C.sand} icon="❤️" />
          <StatCard label="Comments" value={totalComments.toLocaleString()} sub="reader responses" color={C.cream} icon="💬" />
        </div>

        <div className="db-grid">
          <div className="db-card">
            <div className="db-card-title">Views by Post <Link to="/my-blogs">All →</Link></div>
            {blogs.length === 0 ? (
              <div className="db-empty">No posts yet.</div>
            ) : (
              blogs.sort((a, b) => (b.views || 0) - (a.views || 0)).map(b => (
                <MiniBar key={b.id}
                  label={b.title.length > 35 ? b.title.slice(0, 35) + "…" : b.title}
                  value={b.views || 0} max={maxViews}
                  color={`linear-gradient(90deg, ${C.blue}, ${C.sky})`} />
              ))
            )}
          </div>

          <div>
            {topBlog && (
              <div className="db-top-post">
                <div className="db-top-label">⭐ Top Performing Post</div>
                <div className="db-top-title">{topBlog.title}</div>
                <div className="db-top-stats">
                  {[["Views", topBlog.views || 0], ["Likes", topBlog.likes || 0], ["Comments", topBlog.commentCount || 0]].map(([l, v]) => (
                    <div key={l}><div className="db-top-stat-val">{v.toLocaleString()}</div><div className="db-top-stat-label">{l}</div></div>
                  ))}
                </div>
              </div>
            )}
            <Link to="/editor" className="db-new-btn">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Write New Post
            </Link>
          </div>
        </div>

        <div className="db-card">
          <div className="db-card-title">Recent Posts <Link to="/my-blogs">Manage →</Link></div>
          {blogs.length === 0 ? (
            <div className="db-empty">No posts yet. <Link to="/editor">Write your first post</Link>.</div>
          ) : (
            <table className="db-table">
              <thead>
                <tr>
                  <th className="db-th">Title</th>
                  <th className="db-th">Category</th>
                  <th className="db-th">Status</th>
                  <th className="db-th">Views</th>
                  <th className="db-th">Likes</th>
                  <th className="db-th">Date</th>
                </tr>
              </thead>
              <tbody>
                {[...blogs].slice(0, 6).map(b => (
                  <tr key={b.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/editor/${b.id}`)}>
                    <td className="db-td"><div className="db-post-title-cell">{b.title}</div></td>
                    <td className="db-td">{b.tag}</td>
                    <td className="db-td"><span className={`db-badge ${b.status}`}>{b.status}</span></td>
                    <td className="db-td">{(b.views || 0).toLocaleString()}</td>
                    <td className="db-td">{b.likes || 0}</td>
                    <td className="db-td">{b.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </BloggerLayout>
    </>
  );
}