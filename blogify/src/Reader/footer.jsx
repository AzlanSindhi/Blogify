import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

        .footer-root {
          background: #060f24;
          border-top: 1px solid rgba(10,196,224,0.12);
          color: #F6E7BC;
          font-family: 'DM Sans', sans-serif;
        }
        .footer-top {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem 3rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 2.5rem;
        }
        .footer-brand-logo {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: #F6E7BC;
          text-decoration: none;
          letter-spacing: -0.02em;
          display: block;
          margin-bottom: 1rem;
        }
        .footer-brand-logo span { color: #0AC4E0; }
        .footer-tagline {
          font-size: 0.9rem;
          font-weight: 300;
          color: rgba(246,231,188,0.5);
          line-height: 1.7;
          max-width: 240px;
          margin-bottom: 1.5rem;
        }
        .footer-social {
          display: flex;
          gap: 0.75rem;
        }
        .footer-social a {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(10,196,224,0.25);
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(246,231,188,0.5);
          font-size: 0.75rem;
          text-decoration: none;
          transition: all 0.3s;
          font-weight: 500;
        }
        .footer-social a:hover {
          border-color: #0AC4E0;
          color: #0AC4E0;
          background: rgba(10,196,224,0.08);
        }
        .footer-col-title {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0992C2;
          margin-bottom: 1.4rem;
        }
        .footer-col-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-col-links a {
          font-size: 0.875rem;
          font-weight: 300;
          color: rgba(246,231,188,0.55);
          text-decoration: none;
          transition: color 0.3s;
          letter-spacing: 0.01em;
        }
        .footer-col-links a:hover { color: #F6E7BC; }
        .footer-blogger-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: #0AC4E0;
          text-decoration: none;
          border: 1px solid rgba(10,196,224,0.3);
          border-radius: 3px;
          padding: 0.5rem 0.9rem;
          margin-top: 0.5rem;
          transition: all 0.3s;
          letter-spacing: 0.04em;
        }
        .footer-blogger-link:hover {
          background: rgba(10,196,224,0.1);
          border-color: #0AC4E0;
        }
        .footer-divider {
          border: none;
          border-top: 1px solid rgba(10,196,224,0.08);
          margin: 0;
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-copy {
          font-size: 0.78rem;
          font-weight: 300;
          color: rgba(246,231,188,0.3);
          letter-spacing: 0.02em;
        }
        .footer-copy span { color: #0AC4E0; }
        .footer-legal {
          display: flex;
          gap: 1.5rem;
        }
        .footer-legal a {
          font-size: 0.78rem;
          font-weight: 300;
          color: rgba(246,231,188,0.3);
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.3s;
        }
        .footer-legal a:hover { color: rgba(246,231,188,0.7); }

        @media (max-width: 1024px) {
          .footer-top { grid-template-columns: 1fr 1fr 1fr; gap: 2rem; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .footer-top { grid-template-columns: 1fr 1fr; }
          .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-brand-logo">Blogify<span>.</span></Link>
            <p className="footer-tagline">
              A modern reading and writing platform for curious minds. Discover stories, share ideas, and connect with readers worldwide.
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Tw</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Ig</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">Li</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">Gh</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Explore</div>
            <ul className="footer-col-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/blogs">All Blogs</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Reader</div>
            <ul className="footer-col-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Saved Articles</Link></li>
              <li><Link to="/login">Reading List</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Blogger</div>
            <ul className="footer-col-links">
              <li><Link to="/blogger/login">Login as Blogger</Link></li>
              <li><Link to="/blogger/signup">Create Blog Account</Link></li>
              <li><Link to="/blogger/dashboard">Dashboard</Link></li>
            </ul>
            <Link to="/blogger/login" className="footer-blogger-link">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Start Writing
            </Link>
          </div>

          <div>
            <div className="footer-col-title">Admin</div>
            <ul className="footer-col-links">
              <li><Link to="/admin/login">Admin Portal</Link></li>
              <li><Link to="/contact">Help Center</Link></li>
              <li><Link to="/contact">Privacy Policy</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/contact">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; 2025 Blogify<span>.</span> &mdash; All rights reserved
          </p>
          <div className="footer-legal">
            <Link to="/contact">Privacy</Link>
            <Link to="/contact">Terms</Link>
            <Link to="/contact">Cookies</Link>
          </div>
        </div>
      </footer>
    </>
  );
}