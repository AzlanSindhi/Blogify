import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBlogger } from "./BloggerContext";
import BloggerLayout from "./BloggerLayout";

function generatePDFReport(blogs, blogger) {
  const published     = blogs.filter(b => b.status === "published");
  const totalViews    = blogs.reduce((s, b) => s + (b.views || 0), 0);
  const totalLikes    = blogs.reduce((s, b) => s + (b.likes || 0), 0);
  const totalComments = blogs.reduce((s, b) => s + (b.commentCount || 0), 0);

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Blog Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0} body{font-family:'DM Sans',sans-serif;background:#fff;color:#2a2a2a}
    .cover{background:linear-gradient(135deg,#81A6C6,#AACDDC,#D2C4B4);padding:4rem 3rem}
    .cover-logo{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:#fff;margin-bottom:0.5rem}
    .cover-title{font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:700;color:#fff;margin-bottom:0.5rem}
    .cover-meta{font-size:0.78rem;color:rgba(255,255,255,0.6);margin-top:1rem}
    .body{padding:3rem}
    .section-title{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#2a2a2a;margin:2rem 0 1rem;padding-bottom:0.5rem;border-bottom:2px solid #81A6C6}
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem}
    .stat-box{border:1px solid #e8ddd4;border-radius:8px;padding:1.2rem;text-align:center;background:#faf6f1}
    .stat-val{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:#81A6C6}
    .stat-label{font-size:0.68rem;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin-top:0.3rem}
    table{width:100%;border-collapse:collapse;margin-bottom:2rem}
    th{font-size:0.65rem;text-transform:uppercase;letter-spacing:0.12em;color:#888;padding:0.7rem 0.8rem;text-align:left;background:#faf6f1;border-bottom:1px solid #e8ddd4}
    td{padding:0.85rem 0.8rem;font-size:0.83rem;color:#444;border-bottom:1px solid #f0e8de}
    .badge{display:inline-block;font-size:0.62rem;text-transform:uppercase;padding:0.15rem 0.5rem;border-radius:99px;font-weight:500}
    .badge.published{background:rgba(129,166,198,0.15);color:#81A6C6}
    .badge.draft{background:rgba(210,196,180,0.3);color:#a08060}
    .bar-wrap{margin-bottom:0.8rem}
    .bar-label{display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.3rem}
    .bar-track{height:8px;background:#f0e8de;border-radius:99px;overflow:hidden}
    .bar-fill{height:100%;background:linear-gradient(90deg,#81A6C6,#AACDDC);border-radius:99px}
    .footer{text-align:center;font-size:0.72rem;color:#bbb;padding:2rem 3rem;border-top:1px solid #e8ddd4;margin-top:2rem}
    @media print{@page{margin:0}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <div class="cover">
    <div class="cover-logo">Blogify.</div>
    <div class="cover-title">Blog Performance Report</div>
    <div class="cover-meta">Author: ${blogger?.displayName || "Blogger"} | Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  </div>
  <div class="body">
    <div class="section-title">Overview</div>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-val">${blogs.length}</div><div class="stat-label">Total Posts</div></div>
      <div class="stat-box"><div class="stat-val">${totalViews.toLocaleString()}</div><div class="stat-label">Total Views</div></div>
      <div class="stat-box"><div class="stat-val">${totalLikes}</div><div class="stat-label">Total Likes</div></div>
      <div class="stat-box"><div class="stat-val">${totalComments}</div><div class="stat-label">Comments</div></div>
    </div>
    <div class="section-title">All Posts</div>
    <table><thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Views</th><th>Likes</th><th>Comments</th><th>Date</th></tr></thead>
    <tbody>${blogs.map(b => `<tr><td><strong>${b.title}</strong></td><td>${b.tag}</td><td><span class="badge ${b.status}">${b.status}</span></td><td>${(b.views||0).toLocaleString()}</td><td>${b.likes||0}</td><td>${b.commentCount||0}</td><td>${b.date}</td></tr>`).join("")}</tbody></table>
    <div class="section-title">Views by Post</div>
    ${[...blogs].sort((a,b)=>(b.views||0)-(a.views||0)).map(b=>{
      const pct=Math.round(((b.views||0)/Math.max(...blogs.map(x=>x.views||0),1))*100);
      return `<div class="bar-wrap"><div class="bar-label"><span>${b.title.length>50?b.title.slice(0,50)+"...":b.title}</span><span>${(b.views||0).toLocaleString()}</span></div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div></div>`;
    }).join("")}
    <div class="section-title">Summary</div>
    <table>
      <tr><td><strong>Published</strong></td><td>${published.length}</td></tr>
      <tr><td><strong>Drafts</strong></td><td>${blogs.filter(b=>b.status==="draft").length}</td></tr>
      <tr><td><strong>Avg Views / Post</strong></td><td>${blogs.length?Math.round(totalViews/blogs.length).toLocaleString():0}</td></tr>
      <tr><td><strong>Top Post</strong></td><td>${[...blogs].sort((a,b)=>(b.views||0)-(a.views||0))[0]?.title||"N/A"}</td></tr>
    </table>
  </div>
  <div class="footer">Blogify. Blogger Portal | ${blogger?.displayName||"Blogger"} | ${new Date().toISOString().split("T")[0]}</div>
  <script>window.onload=function(){window.print()}</script>
  </body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url  = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export default function BloggerBlogs() {
  const { blogs, deleteBlog, blogger, blogsLoading } = useBlogger();
  const navigate  = useNavigate();
  const [filter,        setFilter]        = useState("all");
  const [search,        setSearch]        = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [pdfLoading,    setPdfLoading]    = useState(false);
  const [deleting,      setDeleting]      = useState(null);

  const filtered = blogs.filter(b => {
    const matchFilter = filter === "all" || b.status === filter;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.tag.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteBlog(id);
    } catch (e) {
      alert("Could not delete post: " + e.message);
    }
    setDeleting(null);
    setDeleteConfirm(null);
  };

  const handlePDF = () => {
    setPdfLoading(true);
    setTimeout(() => { generatePDFReport(blogs, blogger); setPdfLoading(false); }, 300);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .bb-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.8rem;flex-wrap:wrap;gap:1rem}
        .bb-header h2{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;color:#2a2a2a;letter-spacing:-0.02em}
        .bb-header p{font-size:0.82rem;color:#aaa;margin-top:0.2rem}
        .bb-header-right{display:flex;align-items:center;gap:0.75rem}
        .bb-btn{display:inline-flex;align-items:center;gap:0.5rem;border-radius:8px;padding:0.65rem 1.2rem;font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:500;cursor:pointer;text-decoration:none;border:none;transition:all 0.2s}
        .bb-btn-primary{background:#81A6C6;color:#fff} .bb-btn-primary:hover{background:#6b93b5;transform:translateY(-1px)}
        .bb-btn-pdf{background:#F3E3D0;color:#8b6a50;border:1px solid #e8c9a8} .bb-btn-pdf:hover{background:#e8d4be}
        .bb-btn-pdf:disabled{opacity:0.6;cursor:not-allowed}
        .bb-filters{display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap}
        .bb-filter-tabs{display:flex;background:#fff;border:1px solid #e8ddd4;border-radius:8px;overflow:hidden;padding:0.2rem;gap:0.2rem}
        .bb-filter-tab{background:none;border:none;border-radius:6px;padding:0.45rem 1rem;font-family:'DM Sans',sans-serif;font-size:0.8rem;color:#aaa;cursor:pointer;transition:all 0.2s}
        .bb-filter-tab.active{background:#81A6C6;color:#fff;font-weight:500}
        .bb-search{flex:1;max-width:280px;background:#fff;border:1px solid #e8ddd4;border-radius:8px;padding:0.55rem 1rem;font-family:'DM Sans',sans-serif;font-size:0.86rem;color:#2a2a2a;outline:none;transition:border-color 0.25s}
        .bb-search:focus{border-color:#81A6C6} .bb-search::placeholder{color:#ccc}
        .bb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.2rem}
        .bb-card{background:#fff;border:1px solid #e8ddd4;border-radius:12px;overflow:hidden;transition:box-shadow 0.2s,transform 0.2s}
        .bb-card:hover{box-shadow:0 8px 32px rgba(129,166,198,0.12);transform:translateY(-2px)}
        .bb-card-top{height:5px}
        .bb-card-body{padding:1.4rem}
        .bb-card-meta{display:flex;align-items:center;gap:0.5rem;margin-bottom:0.7rem}
        .bb-tag-pill{font-size:0.62rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;background:#f0e8de;color:#888;padding:0.2rem 0.6rem;border-radius:99px}
        .bb-status-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        .bb-status-dot.published{background:#81A6C6} .bb-status-dot.draft{background:#D2C4B4}
        .bb-status-text{font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;color:#bbb}
        .bb-card-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:700;color:#2a2a2a;letter-spacing:-0.02em;line-height:1.3;margin-bottom:0.6rem}
        .bb-card-excerpt{font-size:0.82rem;color:#aaa;line-height:1.6;margin-bottom:1.2rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .bb-card-stats{display:flex;gap:1.2rem;margin-bottom:1.2rem;padding-bottom:1.2rem;border-bottom:1px solid #f0e8de}
        .bb-stat{text-align:center}
        .bb-stat-val{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:700;color:#2a2a2a}
        .bb-stat-label{font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;color:#bbb}
        .bb-card-actions{display:flex;gap:0.5rem}
        .bb-act-btn{flex:1;background:none;border:1px solid #e8ddd4;border-radius:6px;padding:0.5rem;font-family:'DM Sans',sans-serif;font-size:0.75rem;color:#888;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:0.35rem}
        .bb-act-btn:hover{border-color:#81A6C6;color:#81A6C6} .bb-act-btn.delete:hover{border-color:#c0392b;color:#c0392b;background:rgba(192,57,43,0.04)}
        .bb-date{font-size:0.72rem;color:#ccc;margin-left:auto}
        .bb-modal-overlay{position:fixed;inset:0;background:rgba(42,42,42,0.4);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center}
        .bb-modal{background:#fff;border-radius:12px;padding:2rem;max-width:400px;width:90%;box-shadow:0 24px 80px rgba(0,0,0,0.15)}
        .bb-modal-title{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:#2a2a2a;margin-bottom:0.5rem}
        .bb-modal-sub{font-size:0.86rem;color:#888;margin-bottom:1.5rem;line-height:1.5}
        .bb-modal-actions{display:flex;gap:0.75rem}
        .bb-modal-cancel{flex:1;background:#fff;border:1px solid #e8ddd4;border-radius:8px;padding:0.7rem;font-family:'DM Sans',sans-serif;font-size:0.84rem;color:#888;cursor:pointer}
        .bb-modal-delete{flex:1;background:#c0392b;border:none;border-radius:8px;padding:0.7rem;font-family:'DM Sans',sans-serif;font-size:0.84rem;font-weight:500;color:#fff;cursor:pointer}
        .bb-empty{text-align:center;padding:5rem 2rem;color:#bbb;font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-style:italic}
        .bb-loading{text-align:center;padding:3rem;color:#aaa;font-family:'DM Sans',sans-serif}
      `}</style>

      <BloggerLayout>
        <div className="bb-header">
          <div>
            <h2>My Blog Posts</h2>
            <p>{blogs.length} posts total &middot; {blogs.filter(b => b.status === "published").length} published</p>
          </div>
          <div className="bb-header-right">
            <button className="bb-btn bb-btn-pdf" onClick={handlePDF} disabled={pdfLoading || blogs.length === 0}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="12" y2="18"/><polyline points="9 15 12 18 15 15"/></svg>
              {pdfLoading ? "Generating..." : "Download Report"}
            </button>
            <Link to="/editor" className="bb-btn bb-btn-primary">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Post
            </Link>
          </div>
        </div>

        <div className="bb-filters">
          <div className="bb-filter-tabs">
            {["all", "published", "draft"].map(f => (
              <button key={f} className={`bb-filter-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <input className="bb-search" type="text" placeholder="Search posts..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {blogsLoading ? (
          <div className="bb-loading">Loading posts...</div>
        ) : filtered.length === 0 ? (
          <div className="bb-empty">
            {blogs.length === 0 ? "No posts yet. Start writing!" : "No posts match your search."}
          </div>
        ) : (
          <div className="bb-grid">
            {filtered.map(blog => (
              <div key={blog.id} className="bb-card">
                <div className="bb-card-top" style={{ background: blog.status === "published" ? "linear-gradient(90deg,#81A6C6,#AACDDC)" : "#D2C4B4" }} />
                <div className="bb-card-body">
                  <div className="bb-card-meta">
                    <span className="bb-tag-pill">{blog.tag}</span>
                    <span className={`bb-status-dot ${blog.status}`} />
                    <span className="bb-status-text">{blog.status}</span>
                    <span className="bb-date">{blog.date}</span>
                  </div>
                  <div className="bb-card-title">{blog.title}</div>
                  {blog.excerpt && <p className="bb-card-excerpt">{blog.excerpt}</p>}
                  <div className="bb-card-stats">
                    {[["Views", blog.views || 0], ["Likes", blog.likes || 0], ["Comments", blog.commentCount || 0], ["Read", blog.readTime || "—"]].map(([l, v]) => (
                      <div key={l} className="bb-stat"><div className="bb-stat-val">{v}</div><div className="bb-stat-label">{l}</div></div>
                    ))}
                  </div>
                  <div className="bb-card-actions">
                    <button className="bb-act-btn" onClick={() => navigate(`/editor/blog.id`)}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                    <button className="bb-act-btn delete" onClick={() => setDeleteConfirm(blog.id)}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                      {deleting === blog.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteConfirm && (
          <div className="bb-modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="bb-modal" onClick={e => e.stopPropagation()}>
              <div className="bb-modal-title">Delete this post?</div>
              <p className="bb-modal-sub">
                &ldquo;{blogs.find(b => b.id === deleteConfirm)?.title}&rdquo; will be permanently deleted. This cannot be undone.
              </p>
              <div className="bb-modal-actions">
                <button className="bb-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="bb-modal-delete" onClick={() => handleDelete(deleteConfirm)}>Delete Post</button>
              </div>
            </div>
          </div>
        )}
      </BloggerLayout>
    </>
  );
}