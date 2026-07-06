import { useState } from "react";
import { useAdmin } from "./AdminContext";
import AdminLayout from "./AdminLayout";

const C = { blue: "#81A6C6", sky: "#AACDDC", sand: "#D2C4B4" };

export default function AdminBlogs() {
  const { blogs, removeBlog, dataLoading } = useAdmin();
  const [search,        setSearch]        = useState("");
  const [filter,        setFilter]        = useState("all");
  const [tagFilter,     setTagFilter]     = useState("all");
  const [sortBy,        setSortBy]        = useState("date");
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [viewBlog,      setViewBlog]      = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const allTags = ["all", ...Array.from(new Set(blogs.map(b => b.tag).filter(Boolean)))].sort();

  const filtered = blogs
    .filter(b => filter === "all" || b.status === filter)
    .filter(b => tagFilter === "all" || b.tag === tagFilter)
    .filter(b =>
      (b.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.authorName || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.tag || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "views") return (b.views||0) - (a.views||0);
      if (sortBy === "likes") return (b.likes||0) - (a.likes||0);
      return (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0);
    });

  const badge = (txt, color, bg) => (
    <span style={{display:"inline-block",fontSize:"0.6rem",fontWeight:"500",letterSpacing:"0.1em",textTransform:"uppercase",padding:"0.18rem 0.5rem",borderRadius:"99px",background:bg,color}}>{txt}</span>
  );

  const handleRemove = async (id) => {
    setActionLoading(id);
    try { await removeBlog(id); setRemoveConfirm(null); } catch (e) { alert(e.message); }
    setActionLoading(null);
  };

  return (
    <AdminLayout title="All Blogs">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .abl-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem}
        .abl-top h2{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#e8e0d6;letter-spacing:-0.02em}
        .abl-top p{font-size:0.8rem;color:rgba(232,224,214,0.3);margin-top:0.2rem}
        .abl-controls{display:flex;align-items:center;gap:0.6rem;margin-bottom:1.5rem;flex-wrap:wrap}
        .abl-search{flex:1;min-width:200px;max-width:280px;background:rgba(255,255,255,0.03);border:1px solid rgba(129,166,198,0.12);border-radius:6px;padding:0.55rem 1rem;font-family:'DM Sans',sans-serif;font-size:0.84rem;color:#e8e0d6;outline:none;transition:border-color 0.25s}
        .abl-search:focus{border-color:#81A6C6} .abl-search::placeholder{color:rgba(232,224,214,0.2)}
        .abl-tabs{display:flex;background:rgba(255,255,255,0.03);border:1px solid rgba(129,166,198,0.1);border-radius:6px;overflow:hidden;padding:0.2rem;gap:0.15rem}
        .abl-tab{background:none;border:none;border-radius:4px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:0.78rem;color:rgba(232,224,214,0.4);cursor:pointer;transition:all 0.2s}
        .abl-tab.active{background:#81A6C6;color:#fff;font-weight:500}
        .abl-select{background:rgba(255,255,255,0.03);border:1px solid rgba(129,166,198,0.1);border-radius:6px;padding:0.4rem 0.7rem;font-family:'DM Sans',sans-serif;font-size:0.78rem;color:rgba(232,224,214,0.5);outline:none;cursor:pointer}
        .abl-count{font-size:0.78rem;color:rgba(232,224,214,0.25);margin-bottom:1rem}
        .abl-card{background:#141e28;border:1px solid rgba(129,166,198,0.08);border-radius:10px;overflow:hidden}
        .abl-table{width:100%;border-collapse:collapse}
        .abl-th{font-size:0.6rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(232,224,214,0.25);padding:0.9rem 1.2rem;text-align:left;border-bottom:1px solid rgba(129,166,198,0.06);background:rgba(129,166,198,0.03)}
        .abl-td{padding:1rem 1.2rem;font-size:0.82rem;color:rgba(232,224,214,0.55);border-bottom:1px solid rgba(129,166,198,0.04);vertical-align:middle}
        .abl-row:last-child .abl-td{border-bottom:none}
        .abl-row:hover .abl-td{background:rgba(129,166,198,0.03)}
        .abl-title-cell{font-size:0.85rem;font-weight:400;color:rgba(232,224,214,0.85);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .abl-blogger-cell{display:flex;align-items:center;gap:0.5rem}
        .abl-b-dot{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#1a2e40,#81A6C660);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:0.8rem;font-weight:700;color:#81A6C6;flex-shrink:0}
        .abl-action{background:none;border:1px solid rgba(129,166,198,0.12);border-radius:4px;padding:0.28rem 0.65rem;font-family:'DM Sans',sans-serif;font-size:0.72rem;color:rgba(232,224,214,0.4);cursor:pointer;transition:all 0.2s;margin-left:0.3rem;white-space:nowrap}
        .abl-action:hover{border-color:#81A6C6;color:#81A6C6}
        .abl-action.remove:hover{border-color:#e57373;color:#e57373;background:rgba(229,115,115,0.04)}
        .abl-action:disabled{opacity:0.4;cursor:not-allowed}
        .abl-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);z-index:999;display:flex;align-items:center;justify-content:center;padding:2rem}
        .abl-modal{background:#141e28;border:1px solid rgba(129,166,198,0.15);border-radius:12px;padding:2.5rem;width:600px;max-height:80vh;overflow-y:auto;box-shadow:0 32px 100px rgba(0,0,0,0.5)}
        .abl-modal-tag{font-size:0.65rem;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:#81A6C6;margin-bottom:0.8rem}
        .abl-modal-title{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;color:#e8e0d6;letter-spacing:-0.02em;line-height:1.2;margin-bottom:0.6rem}
        .abl-modal-meta{font-size:0.75rem;color:rgba(232,224,214,0.3);margin-bottom:1.2rem;padding-bottom:1.2rem;border-bottom:1px solid rgba(129,166,198,0.08)}
        .abl-modal-excerpt{font-size:0.9rem;color:rgba(232,224,214,0.55);line-height:1.7;margin-bottom:1.5rem;font-style:italic}
        .abl-modal-stats{display:flex;gap:2rem;margin-bottom:1.5rem}
        .abl-modal-stat-val{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#AACDDC}
        .abl-modal-stat-label{font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(232,224,214,0.25);margin-top:0.1rem}
        .abl-modal-close{background:rgba(129,166,198,0.1);border:1px solid rgba(129,166,198,0.15);border-radius:6px;padding:0.6rem 1.4rem;font-family:'DM Sans',sans-serif;font-size:0.82rem;color:rgba(232,224,214,0.6);cursor:pointer;transition:all 0.2s}
        .abl-modal-close:hover{border-color:#81A6C6;color:#81A6C6}
        .abl-confirm-modal{background:#141e28;border:1px solid rgba(129,166,198,0.15);border-radius:12px;padding:2rem;width:380px}
        .abl-confirm-title{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:#e8e0d6;margin-bottom:0.4rem}
        .abl-confirm-sub{font-size:0.83rem;color:rgba(232,224,214,0.4);margin-bottom:1.4rem;line-height:1.6}
        .abl-confirm-btns{display:flex;gap:0.6rem}
        .abl-confirm-cancel{flex:1;background:none;border:1px solid rgba(129,166,198,0.15);border-radius:6px;padding:0.7rem;font-family:'DM Sans',sans-serif;font-size:0.83rem;color:rgba(232,224,214,0.4);cursor:pointer}
        .abl-confirm-remove{flex:1;background:#c0392b;border:none;border-radius:6px;padding:0.7rem;font-family:'DM Sans',sans-serif;font-size:0.83rem;font-weight:500;color:#fff;cursor:pointer}
        .abl-empty{text-align:center;padding:5rem;color:rgba(232,224,214,0.2);font-size:0.88rem}
        .abl-loading{text-align:center;padding:3rem;color:rgba(232,224,214,0.25);font-size:0.85rem}
      `}</style>

      <div className="abl-top">
        <div>
          <h2>All Blogs</h2>
          <p>{blogs.length} total &middot; {blogs.filter(b=>b.status==="published").length} published</p>
        </div>
      </div>

      <div className="abl-controls">
        <input className="abl-search" type="text" placeholder="Search title, blogger, tag..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="abl-tabs">
          {["all","published","draft"].map(f => (
            <button key={f} className={`abl-tab${filter===f?" active":""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <select className="abl-select" value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
          {allTags.map(t => <option key={t} value={t}>{t==="all"?"All Categories":t}</option>)}
        </select>
        <select className="abl-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Sort: Latest</option>
          <option value="views">Sort: Most Viewed</option>
          <option value="likes">Sort: Most Liked</option>
        </select>
      </div>

      <p className="abl-count">Showing {filtered.length} of {blogs.length} blogs</p>

      <div className="abl-card">
        {dataLoading ? (
          <div className="abl-loading">Loading blogs...</div>
        ) : filtered.length === 0 ? (
          <div className="abl-empty">No blogs match your filters.</div>
        ) : (
          <table className="abl-table">
            <thead>
              <tr>
                <th className="abl-th">Title</th>
                <th className="abl-th">Blogger</th>
                <th className="abl-th">Category</th>
                <th className="abl-th">Status</th>
                <th className="abl-th">Views</th>
                <th className="abl-th">Likes</th>
                <th className="abl-th">Date</th>
                <th className="abl-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="abl-row">
                  <td className="abl-td"><div className="abl-title-cell" title={b.title}>{b.title}</div></td>
                  <td className="abl-td">
                    <div className="abl-blogger-cell">
                      <div className="abl-b-dot">{(b.authorName||"?")[0]}</div>
                      <span>{(b.authorName||"").split(" ")[0]}</span>
                    </div>
                  </td>
                  <td className="abl-td">{badge(b.tag||"—", C.sky, "rgba(170,205,220,0.1)")}</td>
                  <td className="abl-td">
                    {badge(b.status||"draft", b.status==="published"?C.blue:C.sand,
                      b.status==="published"?"rgba(129,166,198,0.1)":"rgba(210,196,180,0.1)")}
                  </td>
                  <td className="abl-td">{(b.views||0).toLocaleString()}</td>
                  <td className="abl-td">{b.likes||0}</td>
                  <td className="abl-td" style={{whiteSpace:"nowrap"}}>{b.date||"—"}</td>
                  <td className="abl-td" style={{whiteSpace:"nowrap"}}>
                    <button className="abl-action" onClick={() => setViewBlog(b)}>View</button>
                    <button className="abl-action remove" disabled={actionLoading===b.id}
                      onClick={() => setRemoveConfirm(b)}>
                      {actionLoading===b.id ? "..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewBlog && (
        <div className="abl-overlay" onClick={() => setViewBlog(null)}>
          <div className="abl-modal" onClick={e => e.stopPropagation()}>
            <div className="abl-modal-tag">{viewBlog.tag}</div>
            <div className="abl-modal-title">{viewBlog.title}</div>
            <div className="abl-modal-meta">
              By {viewBlog.authorName} &nbsp;&middot;&nbsp; {viewBlog.date} &nbsp;&middot;&nbsp; {viewBlog.readTime} read &nbsp;&middot;&nbsp;
              {badge(viewBlog.status||"draft", viewBlog.status==="published"?C.blue:C.sand,
                viewBlog.status==="published"?"rgba(129,166,198,0.15)":"rgba(210,196,180,0.15)")}
            </div>
            {viewBlog.excerpt && <p className="abl-modal-excerpt">&ldquo;{viewBlog.excerpt}&rdquo;</p>}
            <div className="abl-modal-stats">
              {[["Views",(viewBlog.views||0).toLocaleString()],["Likes",viewBlog.likes||0],["Comments",viewBlog.commentCount||0]].map(([l,v]) => (
                <div key={l}><div className="abl-modal-stat-val">{v}</div><div className="abl-modal-stat-label">{l}</div></div>
              ))}
            </div>
            <button className="abl-modal-close" onClick={() => setViewBlog(null)}>Close</button>
          </div>
        </div>
      )}

      {removeConfirm && (
        <div className="abl-overlay" onClick={() => setRemoveConfirm(null)}>
          <div className="abl-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="abl-confirm-title">Remove Blog?</div>
            <p className="abl-confirm-sub">&ldquo;{removeConfirm.title}&rdquo; will be permanently removed from the platform.</p>
            <div className="abl-confirm-btns">
              <button className="abl-confirm-cancel" onClick={() => setRemoveConfirm(null)}>Cancel</button>
              <button className="abl-confirm-remove" onClick={() => handleRemove(removeConfirm.id)}>
                {actionLoading===removeConfirm.id ? "Removing..." : "Remove Blog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}