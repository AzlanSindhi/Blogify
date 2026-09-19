import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/firebaseService";

export default function Login() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    try {
      const { profile } = await loginUser(email, password);
      // Route based on role
      if (profile?.role === "blogger")      navigate("/dashboard");
      else if (profile?.role === "admin")   navigate("/admin/dashboard");
      else                                  navigate("/");
    } catch (e) {
      const msg = e.code === "auth/user-not-found" || e.code === "auth/wrong-password" || e.code === "auth/invalid-credential"
        ? "Invalid email or password."
        : e.message || "Login failed. Please try again.";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-root { min-height: 100vh; background: #060f24; display: flex; font-family: 'DM Sans', sans-serif; }
        .login-art { flex: 1; background: linear-gradient(160deg, #0B2D72 0%, #0992C2 100%); display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; padding: 4rem; position: relative; overflow: hidden; }
        .login-art::before { content: ''; position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(10,196,224,0.25) 0%, transparent 70%); }
        .login-art-quote { font-family: 'Playfair Display', serif; font-size: 2.8rem; font-style: italic; line-height: 1.2; color: #F6E7BC; letter-spacing: -0.02em; position: relative; z-index: 1; margin-bottom: 1rem; }
        .login-art-attr { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(246,231,188,0.5); position: relative; z-index: 1; }
        .login-panel { width: 480px; flex-shrink: 0; background: #060f24; display: flex; flex-direction: column; justify-content: center; padding: 5rem 4rem; border-left: 1px solid rgba(10,196,224,0.1); }
        .login-logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #F6E7BC; text-decoration: none; margin-bottom: 3rem; display: block; letter-spacing: -0.02em; }
        .login-logo span { color: #0AC4E0; }
        .login-heading { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: #F6E7BC; letter-spacing: -0.02em; margin-bottom: 0.4rem; }
        .login-sub { font-size: 0.9rem; font-weight: 300; color: rgba(246,231,188,0.45); margin-bottom: 2.5rem; }
        .form-group { margin-bottom: 1.2rem; }
        .form-label { display: block; font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(246,231,188,0.5); margin-bottom: 0.5rem; }
        .form-control-wrap { position: relative; }
        .form-control { width: 100%; background: rgba(11,45,114,0.35); border: 1px solid rgba(10,196,224,0.2); border-radius: 4px; padding: 0.9rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 300; color: #F6E7BC; outline: none; transition: border-color 0.3s, box-shadow 0.3s; }
        .form-control:focus { border-color: #0AC4E0; box-shadow: 0 0 0 3px rgba(10,196,224,0.1); }
        .form-control::placeholder { color: rgba(246,231,188,0.2); }
        .pw-toggle { position: absolute; right: 0.8rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(246,231,188,0.35); cursor: pointer; font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; }
        .pw-toggle:hover { color: #0AC4E0; }
        .form-extras { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.8rem; margin-top: 0.3rem; }
        .form-remember { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; font-weight: 300; color: rgba(246,231,188,0.45); cursor: pointer; }
        .form-remember input { accent-color: #0AC4E0; }
        .form-forgot { font-size: 0.82rem; font-weight: 300; color: #0AC4E0; text-decoration: none; }
        .login-error { font-size: 0.8rem; color: #ff6b6b; background: rgba(255,107,107,0.08); border: 1px solid rgba(255,107,107,0.2); border-radius: 4px; padding: 0.65rem 0.9rem; margin-bottom: 1rem; }
        .btn-primary { width: 100%; background: #0992C2; border: none; border-radius: 4px; padding: 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #F6E7BC; cursor: pointer; transition: background 0.3s, transform 0.2s; margin-bottom: 1.2rem; }
        .btn-primary:hover:not(:disabled) { background: #0AC4E0; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .divider { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; }
        .divider-line { flex: 1; height: 1px; background: rgba(10,196,224,0.1); }
        .divider-text { font-size: 0.75rem; color: rgba(246,231,188,0.25); letter-spacing: 0.08em; }
        .login-switch { font-size: 0.85rem; font-weight: 300; color: rgba(246,231,188,0.4); text-align: center; }
        .login-switch a { color: #0AC4E0; text-decoration: none; }
        .login-switch a:hover { text-decoration: underline; }
        @media (max-width: 900px) { .login-art { display: none; } .login-panel { width: 100%; padding: 6rem 2rem 3rem; } }
      `}</style>

      <div className="login-root">
        <div className="login-art">
          <blockquote className="login-art-quote">
            &ldquo;A reader lives a thousand lives before he dies.&rdquo;
          </blockquote>
          <p className="login-art-attr">George R.R. Martin</p>
        </div>

        <div className="login-panel">
          <Link to="/" className="login-logo">Blogify<span>.</span></Link>
          <h1 className="login-heading">Welcome back</h1>
          <p className="login-sub">Sign in to continue your reading journey</p>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-control-wrap">
              <input className="form-control" type={showPw ? "text" : "password"}
                placeholder="Your password" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ paddingRight: "3.5rem" }} />
              <button className="pw-toggle" type="button" onClick={() => setShowPw(p => !p)}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-extras">
            <label className="form-remember">
              <input type="checkbox" /> Remember me
            </label>
            <span className="form-forgot" style={{ cursor: "default" }}>Forgot password?</span>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">or</span>
            <span className="divider-line" />
          </div>

          <p className="login-switch">
            Don&apos;t have an account?{" "}
            <Link to="/signup">Create one</Link>
            {" "}|{" "}
            <Link to="/blogger/login">Blogger login</Link>
          </p>
          <div style={{ textAlign:"center", marginTop:"1.5rem" }}>
            <Link to="/" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", fontWeight:"300", color:"rgba(246,231,188,0.25)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"0.35rem", transition:"color 0.2s" }}
              onMouseOver={e=>e.currentTarget.style.color="rgba(246,231,188,0.6)"}
              onMouseOut={e=>e.currentTarget.style.color="rgba(246,231,188,0.25)"}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}