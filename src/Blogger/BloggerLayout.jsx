import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBlogger } from "./BloggerContext";

// Routes match the uploaded App.jsx exactly:
// /dashboard, /my-blogs, /editor
const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to: "/my-blogs",
    label: "My Blogs",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    to: "/editor",
    label: "New Post",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
];

// Which page title to show in the topbar
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/my-blogs":  "My Blogs",
  "/editor":    "Post Editor",
};

export default function BloggerLayout({ children }) {
  const { blogger, logout } = useBlogger();
  const location = useLocation();
  const navigate  = useNavigate();

  // Determine active nav (also matches /editor/:id)
  const isActive = (to) => {
    if (to === "/editor") return location.pathname.startsWith("/editor");
    return location.pathname === to;
  };

  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname === path || (path === "/editor" && location.pathname.startsWith("/editor"))
  )?.[1] || "Blogger Portal";

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error("Logout error:", err); }
    navigate("/blogger/login");
  };

  // Derive display name — supports both Firebase profile (displayName) and legacy (name)
  const displayName = blogger?.displayName || blogger?.name || "Blogger";
  const avatarLetter = blogger?.avatar || displayName[0]?.toUpperCase() || "B";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0e8de; }
        .bl-layout { display: flex; min-height: 100vh; background: #f0e8de; font-family: 'DM Sans', sans-serif; }
        .bl-sidebar { width: 240px; flex-shrink: 0; background: #fff; border-right: 1px solid #e8ddd4; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
        .bl-sidebar-logo { padding: 2rem 1.8rem 1.5rem; border-bottom: 1px solid #f0e8de; }
        .bl-logo-text { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: #2a2a2a; letter-spacing: -0.02em; text-decoration: none; display: block; }
        .bl-logo-text span { color: #81A6C6; }
        .bl-logo-sub { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; margin-top: 0.15rem; }
        .bl-sidebar-nav { flex: 1; padding: 1.5rem 0.8rem; display: flex; flex-direction: column; gap: 0.2rem; }
        .bl-nav-label { font-size: 0.62rem; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: #ccc; padding: 0 0.8rem; margin-bottom: 0.6rem; }
        .bl-nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 1rem; border-radius: 8px; text-decoration: none; font-size: 0.86rem; font-weight: 400; color: #888; transition: all 0.2s; }
        .bl-nav-item:hover { background: #f5ede4; color: #2a2a2a; }
        .bl-nav-item.active { background: linear-gradient(135deg, rgba(129,166,198,0.15), rgba(170,205,220,0.1)); color: #81A6C6; font-weight: 500; }
        .bl-nav-item.active svg { stroke: #81A6C6; }
        .bl-sidebar-footer { padding: 1.2rem 1.6rem; border-top: 1px solid #f0e8de; }
        .bl-user-row { display: flex; align-items: center; gap: 0.7rem; margin-bottom: 0.7rem; }
        .bl-user-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #81A6C6, #AACDDC); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; font-weight: 700; color: #fff; flex-shrink: 0; }
        .bl-user-name { font-size: 0.84rem; font-weight: 500; color: #2a2a2a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bl-user-role { font-size: 0.68rem; color: #bbb; letter-spacing: 0.04em; }
        .bl-logout { width: 100%; background: none; border: 1px solid #e8ddd4; border-radius: 6px; padding: 0.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: #aaa; cursor: pointer; transition: all 0.2s; }
        .bl-logout:hover { border-color: #c0392b; color: #c0392b; background: rgba(192,57,43,0.04); }
        .bl-home-link { display: flex; align-items: center; gap: 0.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 400; color: rgba(42,42,42,0.4); text-decoration: none; padding: 0.5rem 0; margin-bottom: 0.5rem; transition: color 0.2s; }
        .bl-home-link:hover { color: #81A6C6; }
        .bl-home-link svg { flex-shrink: 0; }
        .bl-main { margin-left: 240px; flex: 1; min-height: 100vh; }
        .bl-topbar { background: #fff; border-bottom: 1px solid #e8ddd4; padding: 0 2.5rem; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .bl-topbar-title { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 700; color: #2a2a2a; letter-spacing: -0.01em; }
        .bl-topbar-date { font-size: 0.75rem; font-weight: 300; color: #bbb; letter-spacing: 0.04em; }
        .bl-content { padding: 2.5rem; }
        @media (max-width: 768px) { .bl-sidebar { display: none; } .bl-main { margin-left: 0; } .bl-content { padding: 1.5rem; } }
      `}</style>

      <div className="bl-layout">
        <aside className="bl-sidebar">
          <div className="bl-sidebar-logo">
            <Link to="/dashboard" className="bl-logo-text">Blogify<span>.</span></Link>
            <div className="bl-logo-sub">Blogger Portal</div>
          </div>

          <nav className="bl-sidebar-nav">
            <div className="bl-nav-label">Menu</div>
            {NAV_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`bl-nav-item${isActive(item.to) ? " active" : ""}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="bl-sidebar-footer">
            <div className="bl-user-row">
              <div className="bl-user-avatar">{avatarLetter}</div>
              <div>
                <div className="bl-user-name">{displayName}</div>
                <div className="bl-user-role">Author</div>
              </div>
            </div>
            <a href="/" className="bl-home-link">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Return to Home
              </a>
            <button className="bl-logout" onClick={handleLogout}>Sign Out</button>
          </div>
        </aside>

        <main className="bl-main">
          <div className="bl-topbar">
            <div className="bl-topbar-title">{pageTitle}</div>
            <div className="bl-topbar-date">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>
          <div className="bl-content">{children}</div>
        </main>
      </div>
    </>
  );
}