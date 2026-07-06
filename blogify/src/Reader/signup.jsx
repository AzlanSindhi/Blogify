import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/firebaseService";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      const displayName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      await registerUser({ email: form.email, password: form.password, displayName, role: "reader" });
      navigate("/");
    } catch (e) {
      const msg = e.code === "auth/email-already-in-use"
        ? "An account with this email already exists."
        : e.message || "Sign up failed. Please try again.";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .signup-root { min-height: 100vh; background: #060f24; display: flex; font-family: 'DM Sans', sans-serif; color: #F6E7BC; }
        .signup-art { flex: 1; background: linear-gradient(200deg, #0AC4E0 0%, #0B2D72 100%); display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: 4rem; position: relative; overflow: hidden; }
        .signup-art::after { content: ''; position: absolute; bottom: -150px; left: -150px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(246,231,188,0.1) 0%, transparent 70%); }
        .signup-art-heading { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 700; color: #F6E7BC; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 1rem; position: relative; z-index: 1; }
        .signup-art-sub { font-size: 0.95rem; font-weight: 300; color: rgba(246,231,188,0.65); line-height: 1.7; max-width: 320px; position: relative; z-index: 1; margin-bottom: 2.5rem; }
        .signup-features { display: flex; flex-direction: column; gap: 0.75rem; position: relative; z-index: 1; }
        .signup-feature { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; font-weight: 300; color: rgba(246,231,188,0.7); }
        .signup-feature-dot { width: 6px; height: 6px; background: #F6E7BC; border-radius: 50%; flex-shrink: 0; }
        .signup-panel { width: 500px; flex-shrink: 0; background: #060f24; border-left: 1px solid rgba(10,196,224,0.1); display: flex; flex-direction: column; justify-content: center; padding: 5rem 4rem; }
        .signup-logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #F6E7BC; text-decoration: none; margin-bottom: 2.5rem; display: block; letter-spacing: -0.02em; }
        .signup-logo span { color: #0AC4E0; }
        .signup-heading { font-family: 'Playfair Display', serif; font-size: 1.9rem; font-weight: 700; color: #F6E7BC; letter-spacing: -0.02em; margin-bottom: 0.4rem; }
        .signup-sub { font-size: 0.88rem; font-weight: 300; color: rgba(246,231,188,0.4); margin-bottom: 2.2rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 0.8rem; }
        .form-group { margin-bottom: 0.9rem; }
        .form-label { display: block; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(246,231,188,0.45); margin-bottom: 0.45rem; }
        .form-control-wrap { position: relative; }
        .form-control { width: 100%; background: rgba(11,45,114,0.35); border: 1px solid rgba(10,196,224,0.2); border-radius: 4px; padding: 0.85rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 300; color: #F6E7BC; outline: none; transition: border-color 0.3s, box-shadow 0.3s; }
        .form-control:focus { border-color: #0AC4E0; box-shadow: 0 0 0 3px rgba(10,196,224,0.1); }
        .form-control::placeholder { color: rgba(246,231,188,0.2); }
        .pw-toggle { position: absolute; right: 0.8rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(246,231,188,0.3); cursor: pointer; font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; }
        .pw-toggle:hover { color: #0AC4E0; }
        .terms-check { display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 1.5rem; }
        .terms-check input { accent-color: #0AC4E0; width: 14px; height: 14px; margin-top: 2px; flex-shrink: 0; }
        .terms-text { font-size: 0.8rem; font-weight: 300; color: rgba(246,231,188,0.4); line-height: 1.5; }
        .terms-text a { color: #0AC4E0; text-decoration: none; }
        .signup-error { font-size: 0.8rem; color: #ff6b6b; background: rgba(255,107,107,0.08); border: 1px solid rgba(255,107,107,0.2); border-radius: 4px; padding: 0.65rem 0.9rem; margin-bottom: 1rem; }
        .btn-primary { width: 100%; background: linear-gradient(135deg, #0992C2, #0AC4E0); border: none; border-radius: 4px; padding: 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #F6E7BC; cursor: pointer; transition: opacity 0.3s, transform 0.2s; margin-bottom: 1.4rem; }
        .btn-primary:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-switch { font-size: 0.85rem; font-weight: 300; color: rgba(246,231,188,0.35); text-align: center; }
        .login-switch a { color: #0AC4E0; text-decoration: none; }
        @media (max-width: 900px) { .signup-art { display: none; } .signup-panel { width: 100%; padding: 6rem 2rem 3rem; } }
        @media (max-width: 400px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="signup-root">
        <div className="signup-art">
          <h2 className="signup-art-heading">Start your<br />reading story</h2>
          <p className="signup-art-sub">Join thousands of readers who discover new perspectives every day.</p>
          <div className="signup-features">
            {["Curated articles across every topic", "Personalized reading lists", "Save and bookmark pieces you love", "Ad-free, distraction-free experience"].map(f => (
              <div key={f} className="signup-feature"><span className="signup-feature-dot" />{f}</div>
            ))}
          </div>
        </div>

        <div className="signup-panel">
          <Link to="/" className="signup-logo">Blogify<span>.</span></Link>
          <h1 className="signup-heading">Create account</h1>
          <p className="signup-sub">Free forever. No credit card required.</p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input className="form-control" type="text" placeholder="Jane"
                value={form.firstName} onChange={set("firstName")} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-control" type="text" placeholder="Doe"
                value={form.lastName} onChange={set("lastName")} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-control" type="email" placeholder="you@example.com"
              value={form.email} onChange={set("email")} />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div className="form-control-wrap">
              <input className="form-control" type={showPw ? "text" : "password"}
                placeholder="Min. 6 characters" value={form.password}
                onChange={set("password")} style={{ paddingRight: "3.5rem" }} />
              <button className="pw-toggle" type="button" onClick={() => setShowPw(p => !p)}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input className="form-control" type="password" placeholder="Repeat password"
              value={form.confirm} onChange={set("confirm")} />
          </div>

          <div className="terms-check">
            <input type="checkbox" id="terms" />
            <label className="terms-text" htmlFor="terms">
              I agree to the <Link to="/contact">Terms of Service</Link> and <Link to="/contact">Privacy Policy</Link>
            </label>
          </div>

          {error && <div className="signup-error">{error}</div>}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="login-switch">
            Already have an account? <Link to="/login">Sign in</Link>
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