import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "./AdminContext";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { to: "/admin/readers", label: "Readers", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { to: "/admin/bloggers", label: "Bloggers", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { to: "/admin/blogs", label: "All Blogs", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { to: "/admin/insights", label: "Insights", icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

export default function AdminLayout({ children, title }) {
  const { logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f1923; }

        .adm-layout {
          display: flex;
          min-height: 100vh;
          background: #111b25;
          font-family: 'DM Sans', sans-serif;
          color: #e8e0d6;
        }
        .adm-sidebar {
          width: 230px;
          flex-shrink: 0;
          background: #0f1923;
          border-right: 1px solid rgba(129,166,198,0.08);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
        }
        .adm-logo-wrap {
          padding: 2rem 1.6rem 1.4rem;
          border-bottom: 1px solid rgba(129,166,198,0.08);
        }
        .adm-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #e8e0d6;
          letter-spacing: -0.02em;
          text-decoration: none;
          display: block;
        }
        .adm-logo span { color: #81A6C6; }
        .adm-logo-badge {
          display: inline-block;
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: rgba(129,166,198,0.12);
          color: #81A6C6;
          border-radius: 3px;
          padding: 0.15rem 0.4rem;
          margin-top: 0.3rem;
        }
        .adm-nav {
          flex: 1;
          padding: 1.5rem 0.7rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .adm-nav-label {
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(232,224,214,0.2);
          padding: 0 0.8rem;
          margin-bottom: 0.4rem;
          margin-top: 0.3rem;
        }
        .adm-link {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.65rem 0.9rem;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 400;
          color: rgba(232,224,214,0.45);
          transition: all 0.2s;
        }
        .adm-link:hover { background: rgba(129,166,198,0.08); color: #e8e0d6; }
        .adm-link.active { background: rgba(129,166,198,0.12); color: #81A6C6; font-weight: 500; }
        .adm-link.active svg { stroke: #81A6C6; }
        .adm-footer {
          padding: 1.2rem 1.4rem;
          border-top: 1px solid rgba(129,166,198,0.08);
        }
        .adm-footer-email {
          font-size: 0.72rem;
          font-weight: 300;
          color: rgba(232,224,214,0.25);
          margin-bottom: 0.6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .adm-logout {
          width: 100%;
          background: none;
          border: 1px solid rgba(129,166,198,0.15);
          border-radius: 6px;
          padding: 0.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: rgba(232,224,214,0.35);
          cursor: pointer;
          transition: all 0.2s;
        }
        .adm-logout:hover { border-color: #e57373; color: #e57373; background: rgba(229,115,115,0.05); }
        .adm-home-link { display: flex; align-items: center; gap: 0.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 400; color: rgba(232,224,214,0.25); text-decoration: none; padding: 0.4rem 0; margin-bottom: 0.5rem; transition: color 0.2s; }
        .adm-home-link:hover { color: rgba(232,224,214,0.6); }

        .adm-main { margin-left: 230px; flex: 1; min-height: 100vh; }
        .adm-topbar {
          background: #0f1923;
          border-bottom: 1px solid rgba(129,166,198,0.08);
          padding: 0 2.5rem;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .adm-topbar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #e8e0d6;
          letter-spacing: -0.01em;
        }
        .adm-topbar-right {
          font-size: 0.72rem;
          font-weight: 300;
          color: rgba(232,224,214,0.25);
          letter-spacing: 0.04em;
        }
        .adm-content { padding: 2.5rem; }

        @media (max-width: 768px) {
          .adm-sidebar { display: none; }
          .adm-main { margin-left: 0; }
          .adm-content { padding: 1.5rem; }
        }
      `}</style>

      <div className="adm-layout">
        <aside className="adm-sidebar">
          <div className="adm-logo-wrap">
            <Link to="/admin/dashboard" className="adm-logo">Blogify<span>.</span></Link>
            <span className="adm-logo-badge">Admin</span>
          </div>
          <nav className="adm-nav">
            <div className="adm-nav-label">Management</div>
            {NAV.map(item => (
              <Link key={item.to} to={item.to}
                className={`adm-link${location.pathname === item.to ? " active" : ""}`}>
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
          <div className="adm-footer">
            <div className="adm-footer-email">admin@blogify.com</div>
            <a href="/" className="adm-home-link">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Return to Home
            </a>
            <button className="adm-logout" onClick={() => { logout(); navigate("/admin/login"); }}>
              Sign Out
            </button>
          </div>
        </aside>

        <main className="adm-main">
          <div className="adm-topbar">
            <div className="adm-topbar-title">{title}</div>
            <div className="adm-topbar-right">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
          <div className="adm-content">{children}</div>
        </main>
      </div>
    </>
  );
}