import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { subscribeAuth, getUserProfile, logoutUser } from "../services/firebaseService";

export default function Nav() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [user,      setUser]      = useState(null);   // Firebase auth user
  const [profile,   setProfile]   = useState(null);  // Firestore profile
  const [signingOut, setSigningOut] = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Firebase auth listener
  useEffect(() => {
    const unsub = subscribeAuth(async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        try {
          const p = await getUserProfile(fbUser.uid);
          setProfile(p);
        } catch {
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return unsub;
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try { await logoutUser(); } catch (err) { console.error("Signout error:", err); }
    setUser(null);
    setProfile(null);
    setSigningOut(false);
    navigate("/");
  };

  const firstName = (profile?.displayName || profile?.name || user?.email || "")
    .split(" ")[0]
    .split("@")[0];

  // Readers only see greeting in nav; bloggers/admins get a portal link too
  const isBlogger = profile?.role === "blogger";
  const isAdmin   = profile?.role === "admin";

  const links = [
    { to: "/",        label: "Home" },
    { to: "/blogs",   label: "Blogs" },
    { to: "/about",   label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-inner {
          background: transparent;
          backdrop-filter: none;
          border-bottom: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-inner.scrolled {
          background: rgba(11,45,114,0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(10,196,224,0.15);
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: #F6E7BC;
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        .nav-logo span { color: #0AC4E0; }
        .nav-links {
          display: flex;
          gap: 2.5rem;
          align-items: center;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(246,231,188,0.7);
          text-decoration: none;
          position: relative;
          transition: color 0.3s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 1px;
          background: #0AC4E0;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-link:hover, .nav-link.active { color: #F6E7BC; }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }

        /* ── Auth area (right side) ── */
        .nav-auth {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        /* Greeting pill shown when logged in */
        .nav-greeting {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0992C2, #0AC4E0);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 0.8rem;
          font-weight: 700;
          color: #060f24;
          flex-shrink: 0;
        }
        .nav-greeting-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          font-weight: 400;
          color: rgba(246,231,188,0.75);
          white-space: nowrap;
        }
        .nav-greeting-text strong {
          color: #F6E7BC;
          font-weight: 500;
        }
        /* Portal link for blogger/admin */
        .nav-portal {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #0AC4E0;
          text-decoration: none;
          border: 1px solid rgba(10,196,224,0.3);
          padding: 0.3rem 0.8rem;
          border-radius: 2px;
          transition: all 0.25s;
          white-space: nowrap;
        }
        .nav-portal:hover {
          background: rgba(10,196,224,0.1);
          border-color: #0AC4E0;
        }
        /* Sign out button */
        .nav-signout {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: rgba(246,231,188,0.35);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.3rem 0.5rem;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-signout:hover { color: rgba(246,231,188,0.7); }
        /* Sign in CTA (logged out) */
        .nav-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #0B2D72;
          background: #0AC4E0;
          text-decoration: none;
          padding: 0.5rem 1.4rem;
          border-radius: 2px;
          transition: all 0.3s;
          white-space: nowrap;
        }
        .nav-cta:hover { background: #F6E7BC; transform: translateY(-1px); }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
        }
        .hamburger span {
          display: block; width: 24px; height: 1.5px;
          background: #F6E7BC;
          transition: all 0.3s;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: rgba(11,45,114,0.98);
          backdrop-filter: blur(16px);
          padding: 1.5rem 2rem 2rem;
          border-top: 1px solid rgba(10,196,224,0.15);
          gap: 1rem;
        }
        .mobile-menu.open { display: flex; }
        .mobile-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(246,231,188,0.8);
          text-decoration: none;
        }
        .mobile-user {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0;
          border-top: 1px solid rgba(10,196,224,0.1);
          margin-top: 0.5rem;
        }
        .mobile-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0992C2, #0AC4E0);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 0.75rem; font-weight: 700;
          color: #060f24; flex-shrink: 0;
        }
        .mobile-greeting {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 300;
          color: rgba(246,231,188,0.6);
        }
        .mobile-greeting strong { color: #F6E7BC; font-weight: 500; }
        .mobile-cta {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #0B2D72; background: #0AC4E0;
          text-decoration: none;
          padding: 0.7rem 1.4rem;
          border-radius: 2px; text-align: center;
        }
        .mobile-signout {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: rgba(246,231,188,0.4);
          background: none; border: none;
          cursor: pointer; text-align: left; padding: 0;
        }

        @media (max-width: 768px) {
          .nav-links, .nav-auth { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className="nav-root">
        <div className={`nav-inner${scrolled ? " scrolled" : ""}`}>
          <div className="nav-container">
            <Link to="/" className="nav-logo">Blogify<span>.</span></Link>

            <ul className="nav-links">
              {links.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className={`nav-link${location.pathname === l.to ? " active" : ""}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ── Right side: auth area ── */}
            <div className="nav-auth">
              {user ? (
                <div className="nav-greeting">
                  <div className="nav-avatar">
                    {firstName[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="nav-greeting-text">
                    Hey, <strong>{firstName}</strong>
                  </span>
                  {isBlogger && (
                    <Link to="/dashboard" className="nav-portal">My Blog</Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="nav-portal">Admin</Link>
                  )}
                  <button className="nav-signout" onClick={handleSignOut} disabled={signingOut}>
                    {signingOut ? "..." : "Sign out"}
                  </button>
                </div>
              ) : (
                <Link to="/login" className="nav-cta">Sign In</Link>
              )}
            </div>

            <button
              className={`hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(p => !p)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          {links.map(l => (
            <Link key={l.to} to={l.to} className="mobile-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}

          {user ? (
            <>
              <div className="mobile-user">
                <div className="mobile-avatar">{firstName[0]?.toUpperCase() || "U"}</div>
                <span className="mobile-greeting">
                  Hey, <strong>{firstName}</strong>
                </span>
              </div>
              {isBlogger && (
                <Link to="/dashboard" className="mobile-link" style={{ color:"#0AC4E0" }} onClick={() => setMenuOpen(false)}>
                  My Blog Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/dashboard" className="mobile-link" style={{ color:"#0AC4E0" }} onClick={() => setMenuOpen(false)}>
                  Admin Portal
                </Link>
              )}
              <button className="mobile-signout" onClick={() => { handleSignOut(); setMenuOpen(false); }}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-cta" onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      </nav>
    </>
  );
}