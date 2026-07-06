import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "./AdminContext";

export default function AdminLogin() {
  const { login } = useAdmin();
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
      navigate("/admin/dashboard");
    } catch (e) {
      setError(e.message || "Login failed. Check your credentials.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f1923; }
        .al-root { min-height: 100vh; background: #0f1923; display: grid; grid-template-columns: 1fr 480px; font-family: 'DM Sans', sans-serif; color: #e8e0d6; }
        .al-art { background: linear-gradient(150deg, #1a2a3a 0%, #0f1923 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 3.5rem; position: relative; overflow: hidden; border-right: 1px solid rgba(129,166,198,0.1); }
        .al-art::before { content: ''; position: absolute; top: -150px; left: -150px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(129,166,198,0.08) 0%, transparent 70%); }
        .al-art-logo { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: #e8e0d6; letter-spacing: -0.02em; z-index: 1; }
        .al-art-logo span { color: #81A6C6; }
        .al-art-logo small { display: block; font-family: 'DM Sans', sans-serif; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(232,224,214,0.35); margin-top: 0.25rem; }
        .al-art-mid { z-index: 1; }
        .al-art-heading { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 700; color: #e8e0d6; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 1.5rem; }
        .al-stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(129,166,198,0.1); border-radius: 8px; overflow: hidden; }
        .al-stat-box { background: rgba(129,166,198,0.05); padding: 1.2rem; text-align: center; }
        .al-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; color: #81A6C6; }
        .al-stat-label { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(232,224,214,0.4); margin-top: 0.2rem; }
        .al-art-footer { font-size: 0.75rem; color: rgba(232,224,214,0.25); letter-spacing: 0.06em; z-index: 1; }
        .al-panel { background: #141e28; display: flex; flex-direction: column; justify-content: center; padding: 4rem 3.5rem; }
        .al-eyebrow { font-size: 0.65rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #81A6C6; margin-bottom: 1rem; }
        .al-title { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: #e8e0d6; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 0.5rem; }
        .al-sub { font-size: 0.88rem; font-weight: 300; color: rgba(232,224,214,0.4); margin-bottom: 2rem; }
        .al-demo { background: rgba(129,166,198,0.07); border: 1px solid rgba(129,166,198,0.2); border-radius: 8px; padding: 0.9rem 1.1rem; margin-bottom: 1.5rem; font-size: 0.8rem; color: rgba(232,224,214,0.7); line-height: 1.7; }
        .al-demo strong { color: #81A6C6; font-weight: 500; }
        .al-demo-label { font-size: 0.62rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #81A6C6; margin-bottom: 0.4rem; display: block; }
        .al-field { margin-bottom: 1.1rem; }
        .al-label { display: block; font-size: 0.67rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(232,224,214,0.4); margin-bottom: 0.45rem; }
        .al-input-wrap { position: relative; }
        .al-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(129,166,198,0.15); border-radius: 6px; padding: 0.9rem 1.1rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 300; color: #e8e0d6; outline: none; transition: border-color 0.25s, box-shadow 0.25s; }
        .al-input:focus { border-color: #81A6C6; box-shadow: 0 0 0 3px rgba(129,166,198,0.1); }
        .al-input::placeholder { color: rgba(232,224,214,0.2); }
        .al-pw-toggle { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(232,224,214,0.3); cursor: pointer; transition: color 0.2s; }
        .al-pw-toggle:hover { color: #81A6C6; }
        .al-error { font-size: 0.78rem; color: #e57373; background: rgba(229,115,115,0.08); border: 1px solid rgba(229,115,115,0.2); border-radius: 6px; padding: 0.6rem 0.9rem; margin-bottom: 1rem; }
        .al-submit { width: 100%; background: #81A6C6; border: none; border-radius: 6px; padding: 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #fff; cursor: pointer; transition: background 0.25s, transform 0.2s; margin-top: 0.5rem; }
        .al-submit:hover:not(:disabled) { background: #6b93b5; transform: translateY(-1px); }
        .al-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .al-back { display: block; text-align: center; font-size: 0.8rem; font-weight: 300; color: rgba(232,224,214,0.3); text-decoration: none; margin-top: 1.5rem; transition: color 0.2s; }
        .al-back:hover { color: rgba(232,224,214,0.7); }
        @media (max-width: 860px) { .al-root { grid-template-columns: 1fr; } .al-art { display: none; } .al-panel { padding: 3rem 2rem; } }
      `}</style>

      <div className="al-root">
        <div className="al-art">
          <div className="al-art-logo">
            Blogify<span>.</span>
            <small>Administration</small>
          </div>
          <div className="al-art-mid">
            <h2 className="al-art-heading">Platform Control Centre</h2>
            <div className="al-stats-row">
              <div className="al-stat-box"><div className="al-stat-val">18</div><div className="al-stat-label">Total Blogs</div></div>
              <div className="al-stat-box"><div className="al-stat-val">7</div><div className="al-stat-label">Bloggers</div></div>
              <div className="al-stat-box"><div className="al-stat-val">10</div><div className="al-stat-label">Readers</div></div>
            </div>
          </div>
          <p className="al-art-footer">Restricted access &mdash; authorised personnel only</p>
        </div>

        <div className="al-panel">
          <div className="al-eyebrow">Admin Portal</div>
          <h1 className="al-title">Sign in to<br />the admin panel</h1>
          <p className="al-sub">Full platform access and management.</p>

          <div className="al-demo">
            <span className="al-demo-label">Demo Credentials</span>
            Email: <strong>admin@blogify.com</strong><br />
            Password: <strong>admin1234</strong>
          </div>

          <div className="al-field">
            <label className="al-label">Email</label>
            <input className="al-input" type="email" placeholder="admin@blogify.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>

          <div className="al-field">
            <label className="al-label">Password</label>
            <div className="al-input-wrap">
              <input className="al-input" type={showPw ? "text" : "password"}
                placeholder="Your password" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ paddingRight: "3.5rem" }} />
              <button className="al-pw-toggle" type="button" onClick={() => setShowPw(p => !p)}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <div className="al-error">{error}</div>}

          <button className="al-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in..." : "Access Admin Panel"}
          </button>
          <Link to="/" className="al-back">Return to Blogify.com</Link>
        </div>
      </div>
    </>
  );
}