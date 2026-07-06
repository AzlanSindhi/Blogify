import { useState } from "react";
import { useAdmin } from "./AdminContext";
import AdminLayout from "./AdminLayout";

export default function AdminBloggers() {
  const { bloggers, removeBlogger, toggleBloggerStatus, blogs, dataLoading } = useAdmin();
  const [search,        setSearch]        = useState("");
  const [filter,        setFilter]        = useState("all");
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const filtered = bloggers
    .filter(b => filter === "all" || b.status === filter)
    .filter(b =>
      (b.displayName || b.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.email || "").toLowerCase().includes(search.toLowerCase())
    );

  const getBlogCount = (uid) => blogs.filter(b => b.authorId === uid).length;

  const handleToggle = async (uid) => {
    setActionLoading(uid);
    try { await toggleBloggerStatus(uid); } catch (e) { alert(e.message); }
    setActionLoading(null);
  };

  const handleRemove = async (uid) => {
    setActionLoading(uid);
    try { await removeBlogger(uid); setRemoveConfirm(null); } catch (e) { alert(e.message); }
    setActionLoading(null);
  };

  return (
    <AdminLayout title="Bloggers">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .abg-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem}
        .abg-top h2{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#e8e0d6;letter-spacing:-0.02em}
        .abg-top p{font-size:0.8rem;color:rgba(232,224,214,0.3);margin-top:0.2rem}
        .abg-controls{display:flex;align-items:center;gap:0.6rem;margin-bottom:1.5rem;flex-wrap:wrap}
        .abg-search{flex:1;min-width:200px;max-width:280px;background:rgba(255,255,255,0.03);border:1px solid rgba(129,166,198,0.12);border-radius:6px;padding:0.55rem 1rem;font-family:'DM Sans',sans-serif;font-size:0.84rem;color:#e8e0d6;outline:none;transition:border-color 0.25s}
        .abg-search:focus{border-color:#81A6C6} .abg-search::placeholder{color:rgba(232,224,214,0.2)}
        .abg-tabs{display:flex;background:rgba(255,255,255,0.03);border:1px solid rgba(129,166,198,0.1);border-radius:6px;overflow:hidden;padding:0.2rem;gap:0.15rem}
        .abg-tab{background:none;border:none;border-radius:4px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:0.78rem;color:rgba(232,224,214,0.4);cursor:pointer;transition:all 0.2s}
        .abg-tab.active{background:#81A6C6;color:#fff;font-weight:500}
        .abg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem}
        .abg-card{background:#141e28;border:1px solid rgba(129,166,198,0.08);border-radius:10px;overflow:hidden;transition:border-color 0.2s,transform 0.2s}
        .abg-card:hover{border-color:rgba(129,166,198,0.2);transform:translateY(-2px)}
        .abg-card-bar{height:3px}
        .abg-card-body{padding:1.4rem}
        .abg-card-top{display:flex;align-items:center;gap:0.9rem;margin-bottom:1.2rem}
        .abg-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#81A6C6,#AACDDC);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:#fff;flex-shrink:0}
        .abg-avatar.suspended{background:linear-gradient(135deg,#555,#777)}
        .abg-name{font-size:0.95rem;font-weight:500;color:#e8e0d6}
        .abg-email{font-size:0.72rem;color:rgba(232,224,214,0.3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .abg-badge{display:inline-block;font-size:0.6rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;padding:0.18rem 0.5rem;border-radius:99px}
        .abg-badge.active{background:rgba(129,166,198,0.12);color:#81A6C6}
        .abg-badge.suspended{background:rgba(210,196,180,0.15);color:#D2C4B4}
        .abg-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:1.2rem;padding:1rem;background:rgba(129,166,198,0.04);border-radius:8px}
        .abg-stat-val{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:700;color:#AACDDC}
        .abg-stat-label{font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(232,224,214,0.3);margin-top:0.1rem}
        .abg-meta{font-size:0.72rem;color:rgba(232,224,214,0.25);margin-bottom:1.1rem}
        .abg-actions{display:flex;gap:0.5rem}
        .abg-action{flex:1;background:none;border:1px solid rgba(129,166,198,0.12);border-radius:6px;padding:0.5rem;font-family:'DM Sans',sans-serif;font-size:0.75rem;color:rgba(232,224,214,0.4);cursor:pointer;transition:all 0.2s}
        .abg-action:hover{border-color:#81A6C6;color:#81A6C6}
        .abg-action.remove:hover{border-color:#e57373;color:#e57373;background:rgba(229,115,115,0.04)}
        .abg-action:disabled{opacity:0.4;cursor:not-allowed}
        .abg-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:999;display:flex;align-items:center;justify-content:center}
        .abg-modal{background:#141e28;border:1px solid rgba(129,166,198,0.15);border-radius:12px;padding:2rem;width:380px;box-shadow:0 24px 80px rgba(0,0,0,0.4)}
        .abg-modal-title{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:#e8e0d6;margin-bottom:0.4rem}
        .abg-modal-sub{font-size:0.83rem;color:rgba(232,224,214,0.4);margin-bottom:1.4rem;line-height:1.6}
        .abg-modal-btns{display:flex;gap:0.6rem}
        .abg-modal-cancel{flex:1;background:none;border:1px solid rgba(129,166,198,0.15);border-radius:6px;padding:0.7rem;font-family:'DM Sans',sans-serif;font-size:0.83rem;color:rgba(232,224,214,0.4);cursor:pointer}
        .abg-modal-danger{flex:1;background:#c0392b;border:none;border-radius:6px;padding:0.7rem;font-family:'DM Sans',sans-serif;font-size:0.83rem;font-weight:500;color:#fff;cursor:pointer}
        .abg-empty{text-align:center;padding:4rem;color:rgba(232,224,214,0.25);font-size:0.88rem}
        .abg-loading{text-align:center;padding:3rem;color:rgba(232,224,214,0.25);font-size:0.85rem}
      `}</style>

      <div className="abg-top">
        <div>
          <h2>Bloggers</h2>
          <p>{bloggers.length} total &middot; {bloggers.filter(b => b.status === "active" || !b.status).length} active</p>
        </div>
      </div>

      <div className="abg-controls">
        <input className="abg-search" type="text" placeholder="Search bloggers..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="abg-tabs">
          {["all","active","suspended"].map(f => (
            <button key={f} className={`abg-tab${filter===f?" active":""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {dataLoading ? (
        <div className="abg-loading">Loading bloggers...</div>
      ) : filtered.length === 0 ? (
        <div className="abg-empty">No bloggers found.</div>
      ) : (
        <div className="abg-grid">
          {filtered.map(b => {
            const uid  = b.uid || b.id;
            const name = b.displayName || b.name || b.email || "Blogger";
            const susp = b.status === "suspended";
            return (
              <div key={uid} className="abg-card">
                <div className="abg-card-bar" style={{ background: susp ? "#D2C4B4" : "linear-gradient(90deg,#81A6C6,#AACDDC)" }} />
                <div className="abg-card-body">
                  <div className="abg-card-top">
                    <div className={`abg-avatar${susp?" suspended":""}`}>{(b.avatar||name[0]).toUpperCase()}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                        <span className="abg-name">{name}</span>
                        <span className={`abg-badge ${b.status||"active"}`}>{b.status||"active"}</span>
                      </div>
                      <div className="abg-email">{b.email}</div>
                    </div>
                  </div>

                  <div className="abg-stats">
                    <div><div className="abg-stat-val">{getBlogCount(uid)}</div><div className="abg-stat-label">Posts</div></div>
                    <div><div className="abg-stat-val">{((b.totalViews||0)/1000).toFixed(1)}k</div><div className="abg-stat-label">Views</div></div>
                    <div><div className="abg-stat-val">{b.totalLikes||0}</div><div className="abg-stat-label">Likes</div></div>
                  </div>

                  <div className="abg-meta">Joined {b.joinedDate || "—"}</div>

                  <div className="abg-actions">
                    <button className="abg-action" disabled={actionLoading===uid} onClick={() => handleToggle(uid)}>
                      {actionLoading===uid ? "..." : susp ? "Activate" : "Suspend"}
                    </button>
                    <button className="abg-action remove" disabled={actionLoading===uid} onClick={() => setRemoveConfirm({uid,name})}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {removeConfirm && (
        <div className="abg-overlay" onClick={() => setRemoveConfirm(null)}>
          <div className="abg-modal" onClick={e => e.stopPropagation()}>
            <div className="abg-modal-title">Remove Blogger?</div>
            <p className="abg-modal-sub">&ldquo;{removeConfirm.name}&rdquo; and all associated data will be permanently removed.</p>
            <div className="abg-modal-btns">
              <button className="abg-modal-cancel" onClick={() => setRemoveConfirm(null)}>Cancel</button>
              <button className="abg-modal-danger" onClick={() => handleRemove(removeConfirm.uid)}>
                {actionLoading===removeConfirm.uid ? "Removing..." : "Remove Blogger"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}