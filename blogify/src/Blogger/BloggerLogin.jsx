import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBlogger } from "./BloggerContext";

export default function BloggerLogin() {
  const { login } = useBlogger();
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message || "Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5ede4; }
        .bl-root { min-height: 100vh; background: #f5ede4; display: grid; grid-template-columns: 1fr 1fr; font-family: 'DM Sans', sans-serif; }
        .bl-art { background: linear-gradient(150deg, #81A6C6 0%, #AACDDC 60%, #D2C4B4 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 3.5rem; position: relative; overflow: hidden; }
        .bl-art::before { content: ''; position: absolute; top: -120px; right: -120px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%); pointer-events: none; }
        .bl-art-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; z-index: 1; }
        .bl-art-logo span { color: rgba(255,255,255,0.6); }
        .bl-art-mid { z-index: 1; }
        .bl-art-quote { font-family: 'Cormorant Garamond', serif; font-size: 2.6rem; font-weight: 600; font-style: italic; color: #fff; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 1.2rem; }
        .bl-art-attr { font-size: 0.78rem; font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.6); }
        .bl-art-footer { z-index: 1; font-size: 0.78rem; color: rgba(255,255,255,0.5); letter-spacing: 0.04em; }
        .bl-form-panel { background: #faf6f1; display: flex; flex-direction: column; justify-content: center; padding: 5rem 4.5rem; }
        .bl-form-eyebrow { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #81A6C6; margin-bottom: 1rem; }
        .bl-form-title { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; font-weight: 700; color: #2a2a2a; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 0.5rem; }
        .bl-form-sub { font-size: 0.9rem; font-weight: 300; color: #999; margin-bottom: 1.5rem; }
        .bl-demo { background: rgba(129,166,198,0.08); border: 1px solid rgba(129,166,198,0.25); border-radius: 6px; padding: 0.8rem 1rem; margin-bottom: 1.5rem; font-size: 0.78rem; color: #81A6C6; line-height: 1.7; }
        .bl-demo strong { font-weight: 600; }
        .bl-demo-label { font-size: 0.62rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; display: block; margin-bottom: 0.3rem; }
        .bl-field { margin-bottom: 1.2rem; }
        .bl-label { display: block; font-size: 0.68rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(42,42,42,0.5); margin-bottom: 0.5rem; }
        .bl-input-wrap { position: relative; }
        .bl-input { width: 100%; background: #fff; border: 1.5px solid #e8ddd4; border-radius: 6px; padding: 0.9rem 1.1rem; font-family: 'DM Sans', sans-serif; font-size: 0.92rem; font-weight: 300; color: #2a2a2a; outline: none; transition: border-color 0.25s, box-shadow 0.25s; }
        .bl-input:focus { border-color: #81A6C6; box-shadow: 0 0 0 3px rgba(129,166,198,0.12); }
        .bl-input::placeholder { color: #ccc; }
        .bl-pw-toggle { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: #aaa; cursor: pointer; transition: color 0.2s; }
        .bl-pw-toggle:hover { color: #81A6C6; }
        .bl-extras { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.8rem; }
        .bl-remember { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; font-weight: 300; color: #aaa; cursor: pointer; }
        .bl-remember input { accent-color: #81A6C6; }
        .bl-forgot { font-size: 0.82rem; color: #81A6C6; text-decoration: none; transition: opacity 0.2s; }
        .bl-forgot:hover { opacity: 0.7; }
        .bl-error { font-size: 0.8rem; color: #c0392b; margin-bottom: 1rem; padding: 0.6rem 0.9rem; background: rgba(192,57,43,0.06); border-radius: 4px; border-left: 2px solid #c0392b; }
        .bl-submit { width: 100%; background: #81A6C6; border: none; border-radius: 6px; padding: 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; cursor: pointer; transition: background 0.25s, transform 0.2s; margin-bottom: 1.5rem; }
        .bl-submit:hover:not(:disabled) { background: #6b93b5; transform: translateY(-1px); }
        .bl-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .bl-divider { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
        .bl-divider-line { flex: 1; height: 1px; background: #e8ddd4; }
        .bl-divider-text { font-size: 0.72rem; color: #ccc; letter-spacing: 0.08em; }
        .bl-switch { text-align: center; font-size: 0.85rem; font-weight: 300; color: #aaa; }
        .bl-switch a { color: #81A6C6; text-decoration: none; font-weight: 500; }
        @media (max-width: 860px) { .bl-root { grid-template-columns: 1fr; } .bl-art { display: none; } .bl-form-panel { padding: 3rem 2rem; } }
      `}</style>

      <div className="bl-root">
        <div className="bl-art">
          <div className="bl-art-logo">Blogify<span>.</span></div>
          <div className="bl-art-mid">
            <p className="bl-art-quote">&ldquo;Fill your paper with the breathings of your heart.&rdquo;</p>
            <p className="bl-art-attr">William Wordsworth</p>
          </div>
          <p className="bl-art-footer">Your writing platform &mdash; 2025</p>
        </div>

        <div className="bl-form-panel">
          <div className="bl-form-eyebrow">Blogger Portal</div>
          <h1 className="bl-form-title">Welcome back,<br />writer.</h1>
          <p className="bl-form-sub">Sign in to manage your stories and insights.</p>

          <div className="bl-demo">
            <span className="bl-demo-label">Demo Credentials</span>
            Email: <strong>blogger@blogify.com</strong><br />
            Password: <strong>blog1234</strong>
          </div>

          <div className="bl-field">
            <label className="bl-label">Email</label>
            <input className="bl-input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>

          <div className="bl-field">
            <label className="bl-label">Password</label>
            <div className="bl-input-wrap">
              <input className="bl-input" type={showPw ? "text" : "password"}
                placeholder="Your password" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ paddingRight: "3.5rem" }} />
              <button className="bl-pw-toggle" type="button" onClick={() => setShowPw(p => !p)}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="bl-extras">
            <label className="bl-remember"><input type="checkbox" /> Remember me</label>
            <span className="bl-forgot" style={{ cursor: "default" }}>Forgot password?</span>
          </div>

          {error && <div className="bl-error">{error}</div>}

          <button className="bl-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="bl-divider">
            <span className="bl-divider-line" /><span className="bl-divider-text">or</span><span className="bl-divider-line" />
          </div>

          <p className="bl-switch">
            New to Blogify? <Link to="/blogger/signup">Create an account</Link>
          </p>

          <div style={{ textAlign:"center", marginTop:"1.5rem" }}>
            <Link to="/" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", fontWeight:"300", color:"rgba(42,42,42,0.4)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"0.35rem", transition:"color 0.2s" }}
              onMouseOver={e=>e.currentTarget.style.color="#81A6C6"}
              onMouseOut={e=>e.currentTarget.style.color="rgba(42,42,42,0.4)"}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Return to Blogify Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}