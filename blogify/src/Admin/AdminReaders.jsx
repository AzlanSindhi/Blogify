import { useState } from "react";
import { useAdmin } from "./AdminContext";
import AdminLayout from "./AdminLayout";

export default function AdminReaders() {
  const { readers, addReader, removeReader, toggleReaderStatus, dataLoading } = useAdmin();
  const [search,        setSearch]        = useState("");
  const [filter,        setFilter]        = useState("all");
  const [sortBy,        setSortBy]        = useState("joined");
  const [showAdd,       setShowAdd]       = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [newReader,     setNewReader]     = useState({ displayName: "", email: "" });
  const [addLoading,    setAddLoading]    = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const filtered = readers
    .filter(r => filter === "all" || r.status === filter)
    .filter(r =>
      (r.displayName || r.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.email || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "reads") return (b.articlesRead || 0) - (a.articlesRead || 0);
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    });

  const handleAdd = async () => {
    if (!newReader.displayName || !newReader.email) return;
    setAddLoading(true);
    try {
      await addReader({ displayName: newReader.displayName, email: newReader.email, name: newReader.displayName, avatar: newReader.displayName[0].toUpperCase() });
      setNewReader({ displayName: "", email: "" });
      setShowAdd(false);
    } catch (e) { alert("Error: " + e.message); }
    setAddLoading(false);
  };

  const handleToggle = async (uid) => {
    setActionLoading(uid);
    try { await toggleReaderStatus(uid); } catch (e) { alert(e.message); }
    setActionLoading(null);
  };

  const handleRemove = async (uid) => {
    setActionLoading(uid);
    try { await removeReader(uid); setRemoveConfirm(null); } catch (e) { alert(e.message); }
    setActionLoading(null);
  };

  return (
    <AdminLayout title="Readers">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .ar-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem}
        .ar-top h2{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#e8e0d6;letter-spacing:-0.02em}
        .ar-top p{font-size:0.8rem;color:rgba(232,224,214,0.3);margin-top:0.2rem}
        .ar-add-btn{display:inline-flex;align-items:center;gap:0.4rem;background:#81A6C6;border:none;border-radius:6px;padding:0.6rem 1.1rem;font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:500;color:#fff;cursor:pointer;transition:background 0.2s}
        .ar-add-btn:hover{background:#6b93b5}
        .ar-controls{display:flex;align-items:center;gap:0.6rem;margin-bottom:1.5rem;flex-wrap:wrap}
        .ar-search{flex:1;min-width:200px;max-width:280px;background:rgba(255,255,255,0.03);border:1px solid rgba(129,166,198,0.12);border-radius:6px;padding:0.55rem 1rem;font-family:'DM Sans',sans-serif;font-size:0.84rem;color:#e8e0d6;outline:none;transition:border-color 0.25s}
        .ar-search:focus{border-color:#81A6C6} .ar-search::placeholder{color:rgba(232,224,214,0.2)}
        .ar-tabs{display:flex;background:rgba(255,255,255,0.03);border:1px solid rgba(129,166,198,0.1);border-radius:6px;overflow:hidden;padding:0.2rem;gap:0.15rem}
        .ar-tab{background:none;border:none;border-radius:4px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:0.78rem;color:rgba(232,224,214,0.4);cursor:pointer;transition:all 0.2s}
        .ar-tab.active{background:#81A6C6;color:#fff;font-weight:500}
        .ar-sort{background:rgba(255,255,255,0.03);border:1px solid rgba(129,166,198,0.1);border-radius:6px;padding:0.4rem 0.7rem;font-family:'DM Sans',sans-serif;font-size:0.78rem;color:rgba(232,224,214,0.5);outline:none;cursor:pointer}
        .ar-card{background:#141e28;border:1px solid rgba(129,166,198,0.08);border-radius:10px;overflow:hidden}
        .ar-table{width:100%;border-collapse:collapse}
        .ar-th{font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(232,224,214,0.25);padding:0.9rem 1.2rem;text-align:left;border-bottom:1px solid rgba(129,166,198,0.06);background:rgba(129,166,198,0.03)}
        .ar-td{padding:1rem 1.2rem;font-size:0.83rem;color:rgba(232,224,214,0.6);border-bottom:1px solid rgba(129,166,198,0.05);vertical-align:middle}
        .ar-row:last-child .ar-td{border-bottom:none}
        .ar-row:hover .ar-td{background:rgba(129,166,198,0.03)}
        .ar-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#1a2e40,#81A6C680);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:0.9rem;font-weight:700;color:#81A6C6;flex-shrink:0}
        .ar-name{font-size:0.86rem;font-weight:500;color:#e8e0d6}
        .ar-email{font-size:0.73rem;color:rgba(232,224,214,0.3);margin-top:0.1rem}
        .ar-badge{display:inline-block;font-size:0.6rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;padding:0.18rem 0.5rem;border-radius:99px}
        .ar-badge.active{background:rgba(129,166,198,0.12);color:#81A6C6}
        .ar-badge.suspended{background:rgba(210,196,180,0.15);color:#D2C4B4}
        .ar-action{background:none;border:1px solid rgba(129,166,198,0.12);border-radius:4px;padding:0.3rem 0.7rem;font-family:'DM Sans',sans-serif;font-size:0.72rem;color:rgba(232,224,214,0.4);cursor:pointer;transition:all 0.2s;margin-left:0.4rem;white-space:nowrap}
        .ar-action:hover{border-color:#81A6C6;color:#81A6C6}
        .ar-action.remove:hover{border-color:#e57373;color:#e57373;background:rgba(229,115,115,0.05)}
        .ar-action:disabled{opacity:0.4;cursor:not-allowed}
        .ar-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);z-index:999;display:flex;align-items:center;justify-content:center}
        .ar-modal{background:#141e28;border:1px solid rgba(129,166,198,0.15);border-radius:12px;padding:2rem;width:380px;box-shadow:0 24px 80px rgba(0,0,0,0.4)}
        .ar-modal-title{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:#e8e0d6;margin-bottom:0.4rem}
        .ar-modal-sub{font-size:0.83rem;color:rgba(232,224,214,0.4);margin-bottom:1.4rem;line-height:1.5}
        .ar-field{margin-bottom:0.9rem}
        .ar-label{display:block;font-size:0.65rem;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(232,224,214,0.35);margin-bottom:0.4rem}
        .ar-input{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(129,166,198,0.15);border-radius:6px;padding:0.75rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:0.88rem;color:#e8e0d6;outline:none;transition:border-color 0.25s}
        .ar-input:focus{border-color:#81A6C6} .ar-input::placeholder{color:rgba(232,224,214,0.2)}
        .ar-modal-btns{display:flex;gap:0.6rem;margin-top:1.2rem}
        .ar-modal-cancel{flex:1;background:none;border:1px solid rgba(129,166,198,0.15);border-radius:6px;padding:0.7rem;font-family:'DM Sans',sans-serif;font-size:0.83rem;color:rgba(232,224,214,0.4);cursor:pointer}
        .ar-modal-confirm{flex:1;background:#81A6C6;border:none;border-radius:6px;padding:0.7rem;font-family:'DM Sans',sans-serif;font-size:0.83rem;font-weight:500;color:#fff;cursor:pointer;transition:background 0.2s}
        .ar-modal-confirm:hover{background:#6b93b5}
        .ar-modal-danger{flex:1;background:#c0392b;border:none;border-radius:6px;padding:0.7rem;font-family:'DM Sans',sans-serif;font-size:0.83rem;font-weight:500;color:#fff;cursor:pointer}
        .ar-empty{text-align:center;padding:4rem;color:rgba(232,224,214,0.25);font-size:0.88rem}
        .ar-loading{text-align:center;padding:3rem;color:rgba(232,224,214,0.25);font-size:0.85rem}
      `}</style>

      <div className="ar-top">
        <div>
          <h2>Readers</h2>
          <p>{readers.length} total &middot; {readers.filter(r => r.status === "active").length} active</p>
        </div>
        <button className="ar-add-btn" onClick={() => setShowAdd(true)}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Reader
        </button>
      </div>

      <div className="ar-controls">
        <input className="ar-search" type="text" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="ar-tabs">
          {["all","active","suspended"].map(f => (
            <button key={f} className={`ar-tab${filter===f?" active":""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <select className="ar-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="joined">Sort: Newest</option>
          <option value="reads">Sort: Most Active</option>
        </select>
      </div>

      <div className="ar-card">
        {dataLoading ? (
          <div className="ar-loading">Loading readers...</div>
        ) : filtered.length === 0 ? (
          <div className="ar-empty">No readers found.</div>
        ) : (
          <table className="ar-table">
            <thead>
              <tr>
                <th className="ar-th">Reader</th>
                <th className="ar-th">Joined</th>
                <th className="ar-th">Articles Read</th>
                <th className="ar-th">Saved</th>
                <th className="ar-th">Status</th>
                <th className="ar-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const uid  = r.uid || r.id;
                const name = r.displayName || r.name || r.email || "Reader";
                return (
                  <tr key={uid} className="ar-row">
                    <td className="ar-td">
                      <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                        <div className="ar-avatar">{(r.avatar || name[0]).toUpperCase()}</div>
                        <div>
                          <div className="ar-name">{name}</div>
                          <div className="ar-email">{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="ar-td">{r.joinedDate || "—"}</td>
                    <td className="ar-td">{r.articlesRead || 0}</td>
                    <td className="ar-td">{r.savedArticles || 0}</td>
                    <td className="ar-td"><span className={`ar-badge ${r.status || "active"}`}>{r.status || "active"}</span></td>
                    <td className="ar-td" style={{whiteSpace:"nowrap"}}>
                      <button className="ar-action" disabled={actionLoading===uid}
                        onClick={() => handleToggle(uid)}>
                        {actionLoading===uid ? "..." : r.status==="active" ? "Suspend" : "Activate"}
                      </button>
                      <button className="ar-action remove" disabled={actionLoading===uid}
                        onClick={() => setRemoveConfirm({ uid, name })}>Remove</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="ar-overlay" onClick={() => setShowAdd(false)}>
          <div className="ar-modal" onClick={e => e.stopPropagation()}>
            <div className="ar-modal-title">Add New Reader</div>
            <p className="ar-modal-sub">Manually add a reader account to the platform.</p>
            <div className="ar-field">
              <label className="ar-label">Full Name</label>
              <input className="ar-input" placeholder="Jane Doe"
                value={newReader.displayName} onChange={e => setNewReader(p=>({...p,displayName:e.target.value}))} />
            </div>
            <div className="ar-field">
              <label className="ar-label">Email</label>
              <input className="ar-input" type="email" placeholder="jane@example.com"
                value={newReader.email} onChange={e => setNewReader(p=>({...p,email:e.target.value}))} />
            </div>
            <div className="ar-modal-btns">
              <button className="ar-modal-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="ar-modal-confirm" onClick={handleAdd} disabled={addLoading}>
                {addLoading ? "Adding..." : "Add Reader"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirm */}
      {removeConfirm && (
        <div className="ar-overlay" onClick={() => setRemoveConfirm(null)}>
          <div className="ar-modal" onClick={e => e.stopPropagation()}>
            <div className="ar-modal-title">Remove Reader?</div>
            <p className="ar-modal-sub">&ldquo;{removeConfirm.name}&rdquo; will be permanently removed.</p>
            <div className="ar-modal-btns">
              <button className="ar-modal-cancel" onClick={() => setRemoveConfirm(null)}>Cancel</button>
              <button className="ar-modal-danger" onClick={() => handleRemove(removeConfirm.uid)}>
                {actionLoading===removeConfirm.uid ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}