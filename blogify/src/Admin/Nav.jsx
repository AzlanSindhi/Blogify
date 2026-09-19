import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/blogs", label: "Blogs" },
    { to: "/about", label: "About" },
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
        }
        .nav-cta:hover { background: #F6E7BC; transform: translateY(-1px); }
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
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: rgba(11,45,114,0.98);
          backdrop-filter: blur(16px);
          padding: 1.5rem 2rem 2rem;
          border-top: 1px solid rgba(10,196,224,0.15);
          gap: 1.2rem;
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
        .mobile-cta {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0B2D72;
          background: #0AC4E0;
          text-decoration: none;
          padding: 0.7rem 1.4rem;
          border-radius: 2px;
          text-align: center;
          margin-top: 0.5rem;
        }
        @media (max-width: 768px) {
          .nav-links, .nav-cta { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className="nav-root">
        <div className={`nav-inner${scrolled ? " scrolled" : ""}`}>
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              Blogify<span>.</span>
            </Link>
            <ul className="nav-links">
              {links.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className={`nav-link${location.pathname === l.to ? " active" : ""}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/login" className="nav-cta">Sign In</Link>
            <button
              className={`hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(p => !p)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          {links.map(l => (
            <Link key={l.to} to={l.to} className="mobile-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="mobile-cta" onClick={() => setMenuOpen(false)}>Sign In</Link>
        </div>
      </nav>
    </>
  );
}