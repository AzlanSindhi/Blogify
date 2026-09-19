import { useNavigate } from "react-router-dom";
import { useAdmin } from "./AdminContext";
import AdminLayout from "./AdminLayout";

const C = { blue: "#81A6C6", sky: "#AACDDC", sand: "#D2C4B4", cream: "#F3E3D0" };

function StatCard({ label, value, sub, color, icon, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "#141e28", border: "1px solid rgba(129,166,198,0.1)", borderRadius: "10px",
      padding: "1.5rem", position: "relative", overflow: "hidden",
      cursor: onClick ? "pointer" : "default", transition: "border-color 0.2s, transform 0.2s",
    }}
      onMouseOver={e => { if (onClick) { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-2px)"; }}}
      onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(129,166,198,0.1)"; e.currentTarget.style.transform = ""; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: color }} />
      <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: color + "1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", marginBottom: "1rem" }}>{icon}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: "700", color: "#e8e0d6", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "0.4rem" }}>{value}</div>
      <div style={{ fontSize: "0.72rem", fontWeight: "500", color: "rgba(232,224,214,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      {sub && <div style={{ fontSize: "0.7rem", color: "rgba(232,224,214,0.25)", marginTop: "0.3rem" }}>{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const { readers, bloggers, blogs, analytics, dataLoading } = useAdmin();
  const navigate = useNavigate();

  const publishedBlogs = blogs.filter(b => b.status === "published");
  const totalViews     = blogs.reduce((s, b) => s + (b.views || 0), 0);
  const topBlog        = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
  const topBlogger     = [...bloggers].sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))[0];
  const activeReaders  = readers.filter(r => r.status === "active").length;

  const tagCounts  = blogs.reduce((acc, b) => { acc[b.tag] = (acc[b.tag] || 0) + 1; return acc; }, {});
  const tagEntries = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  const maxTag     = Math.max(...tagEntries.map(([, v]) => v), 1);

  const monthlyMax = Math.max(...(analytics.map(d => d.totalViews || 0)), 1);

  const badge = (txt, color) => (
    <span style={{ display: "inline-block", fontSize: "0.6rem", fontWeight: "500", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.15rem 0.5rem", borderRadius: "99px", background: color + "20", color }}>{txt}</span>
  );

  if (dataLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div style={{ textAlign: "center", padding: "5rem", color: "rgba(232,224,214,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Loading platform data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .adm-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem}
        .adm-grid-3{display:grid;grid-template-columns:2fr 1fr 1fr;gap:1rem;margin-bottom:1rem}
        .adm-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
        .adm-card{background:#141e28;border:1px solid rgba(129,166,198,0.1);border-radius:10px;padding:1.5rem}
        .adm-card-title{font-size:0.65rem;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:rgba(232,224,214,0.3);margin-bottom:1.2rem;display:flex;align-items:center;justify-content:space-between}
        .adm-card-title a{color:#81A6C6;font-size:0.62rem;text-decoration:none}
        .adm-table{width:100%;border-collapse:collapse}
        .adm-th{font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(232,224,214,0.25);padding:0 0 0.7rem;text-align:left;border-bottom:1px solid rgba(129,166,198,0.08)}
        .adm-td{padding:0.8rem 0;font-size:0.82rem;color:rgba(232,224,214,0.6);border-bottom:1px solid rgba(129,166,198,0.05);vertical-align:middle}
        .adm-mini-bar-wrap{margin-bottom:0.7rem}
        .adm-mini-bar-label{display:flex;justify-content:space-between;margin-bottom:0.3rem;font-size:0.76rem;color:rgba(232,224,214,0.5)}
        .adm-mini-bar-track{height:5px;background:rgba(129,166,198,0.1);border-radius:99px;overflow:hidden}
        .adm-mini-bar-fill{height:100%;border-radius:99px}
        .adm-chart{display:flex;align-items:flex-end;gap:0.4rem;height:130px;margin-bottom:0.5rem}
        .adm-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:0.3rem;height:100%;justify-content:flex-end}
        .adm-bar-rect{width:100%;border-radius:3px 3px 0 0;transition:height 0.8s}
        .adm-bar-lbl{font-size:0.58rem;color:rgba(232,224,214,0.25)}
        @media(max-width:1100px){.adm-grid-4{grid-template-columns:repeat(2,1fr)}.adm-grid-3{grid-template-columns:1fr}}
        @media(max-width:700px){.adm-grid-2{grid-template-columns:1fr}}
      `}</style>

      <div className="adm-grid-4">
        <StatCard label="Total Readers" value={readers.length} sub={`${activeReaders} active`} color={C.blue} icon="👥" onClick={() => navigate("/admin/readers")} />
        <StatCard label="Total Bloggers" value={bloggers.length} sub={`${bloggers.filter(b=>b.status==="active").length} active`} color={C.sky} icon="✍️" onClick={() => navigate("/admin/bloggers")} />
        <StatCard label="Total Blogs" value={blogs.length} sub={`${publishedBlogs.length} published`} color={C.sand} icon="📄" onClick={() => navigate("/admin/blogs")} />
        <StatCard label="Total Views" value={totalViews.toLocaleString()} sub="all time" color={C.cream} icon="👁" />
      </div>

      <div className="adm-grid-3">
        <div className="adm-card">
          <div className="adm-card-title">Monthly Views <a href="/admin/insights">Insights →</a></div>
          <div className="adm-chart">
            {analytics.map((d, i) => (
              <div key={i} className="adm-bar-col">
                <div className="adm-bar-rect" style={{
                  height: `${Math.max(4, ((d.totalViews || 0) / monthlyMax) * 100)}%`,
                  background: i === analytics.length - 1 ? `linear-gradient(180deg,${C.blue},${C.sky})` : "rgba(129,166,198,0.18)",
                }} title={`${d.month}: ${(d.totalViews||0).toLocaleString()} views`} />
                <span className="adm-bar-lbl">{(d.month || "").split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-card" style={{ background: "linear-gradient(135deg,#1a2e40,#141e28)", border: "1px solid rgba(129,166,198,0.2)" }}>
          <div className="adm-card-title" style={{ color: "rgba(232,224,214,0.5)" }}>Top Blog</div>
          {topBlog ? (
            <>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#81A6C6", marginBottom: "0.5rem" }}>{topBlog.tag}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: "700", color: "#e8e0d6", lineHeight: 1.3, marginBottom: "1rem" }}>{topBlog.title}</div>
              <div style={{ display: "flex", gap: "1rem" }}>
                {[["👁", (topBlog.views||0).toLocaleString()], ["❤️", topBlog.likes||0], ["💬", topBlog.commentCount||0]].map(([icon, val]) => (
                  <div key={icon}><div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: "700", color: "#AACDDC" }}>{val}</div><div style={{ fontSize: "0.65rem", color: "rgba(232,224,214,0.3)" }}>{icon}</div></div>
                ))}
              </div>
            </>
          ) : <div style={{ color: "rgba(232,224,214,0.2)", fontSize: "0.85rem" }}>No posts yet.</div>}
        </div>

        <div className="adm-card">
          <div className="adm-card-title">Top Blogger</div>
          {topBlogger ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#81A6C6,#AACDDC)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", fontWeight: "700", color: "#fff" }}>{topBlogger.avatar || topBlogger.displayName?.[0]}</div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "500", color: "#e8e0d6" }}>{topBlogger.displayName}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(232,224,214,0.3)" }}>{topBlogger.totalPosts || 0} posts</div>
                </div>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", fontWeight: "700", color: "#81A6C6" }}>{(topBlogger.totalViews || 0).toLocaleString()}</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(232,224,214,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Total Views</div>
            </>
          ) : <div style={{ color: "rgba(232,224,214,0.2)", fontSize: "0.85rem" }}>No bloggers yet.</div>}
        </div>
      </div>

      <div className="adm-grid-2">
        <div className="adm-card">
          <div className="adm-card-title">Content by Category</div>
          {tagEntries.map(([tag, count]) => (
            <div key={tag} className="adm-mini-bar-wrap">
              <div className="adm-mini-bar-label"><span>{tag}</span><span>{count}</span></div>
              <div className="adm-mini-bar-track">
                <div className="adm-mini-bar-fill" style={{ width: `${(count/maxTag)*100}%`, background: `linear-gradient(90deg,${C.blue},${C.sky})` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="adm-card">
          <div className="adm-card-title">Recent Posts <a href="/admin/blogs">All →</a></div>
          <table className="adm-table">
            <thead><tr><th className="adm-th">Title</th><th className="adm-th">Blogger</th><th className="adm-th">Views</th><th className="adm-th">Status</th></tr></thead>
            <tbody>
              {[...blogs].sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)).slice(0,5).map(b => (
                <tr key={b.id}>
                  <td className="adm-td" style={{ maxWidth:"130px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.title}</td>
                  <td className="adm-td">{(b.authorName||"").split(" ")[0]}</td>
                  <td className="adm-td">{(b.views||0).toLocaleString()}</td>
                  <td className="adm-td">{badge(b.status, b.status==="published"?C.blue:C.sand)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}