import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBlogger } from "./BloggerContext";

export default function BloggerSignup() {
  const { signup } = useBlogger();
  const navigate   = useNavigate();
  const [form,    setForm]    = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      const displayName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
      await signup(form.email, form.password, displayName);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message || "Sign up failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5ede4; }
        .bs-root { min-height: 100vh; background: #f5ede4; display: grid; grid-template-columns: 1fr 1fr; font-family: 'DM Sans', sans-serif; }
        .bs-form-panel { background: #faf6f1; display: flex; flex-direction: column; justify-content: center; padding: 4rem 4.5rem; }
        .bs-eyebrow { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #81A6C6; margin-bottom: 1rem; }
        .bs-title { font-family: 'Cormorant Garamond', serif; font-size: 2.6rem; font-weight: 700; color: #2a2a2a; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 0.5rem; }
        .bs-sub { font-size: 0.88rem; font-weight: 300; color: #aaa; margin-bottom: 2rem; }
        .bs-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 0.9rem; }
        .bs-field { margin-bottom: 0.9rem; }
        .bs-label { display: block; font-size: 0.67rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #999; margin-bottom: 0.45rem; }
        .bs-input-wrap { position: relative; }
        .bs-input { width: 100%; background: #fff; border: 1.5px solid #e8ddd4; border-radius: 6px; padding: 0.85rem 1.1rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 300; color: #2a2a2a; outline: none; transition: border-color 0.25s, box-shadow 0.25s; }
        .bs-input:focus { border-color: #81A6C6; box-shadow: 0 0 0 3px rgba(129,166,198,0.12); }
        .bs-input::placeholder { color: #ccc; }
        .bs-pw-toggle { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: #bbb; cursor: pointer; transition: color 0.2s; }
        .bs-pw-toggle:hover { color: #81A6C6; }
        .bs-terms { display: flex; align-items: flex-start; gap: 0.6rem; margin: 1rem 0 1.5rem; font-size: 0.8rem; font-weight: 300; color: #aaa; line-height: 1.5; }
        .bs-terms input { accent-color: #81A6C6; margin-top: 2px; flex-shrink: 0; }
        .bs-terms a { color: #81A6C6; text-decoration: none; }
        .bs-error { font-size: 0.8rem; color: #c0392b; margin-bottom: 1rem; padding: 0.6rem 0.9rem; background: rgba(192,57,43,0.06); border-radius: 4px; border-left: 2px solid #c0392b; }
        .bs-submit { width: 100%; background: #81A6C6; border: none; border-radius: 6px; padding: 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; cursor: pointer; transition: background 0.25s, transform 0.2s; margin-bottom: 1.4rem; }
        .bs-submit:hover:not(:disabled) { background: #6b93b5; transform: translateY(-1px); }
        .bs-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .bs-switch { text-align: center; font-size: 0.85rem; font-weight: 300; color: #aaa; }
        .bs-switch a { color: #81A6C6; text-decoration: none; font-weight: 500; }
        .bs-art { background: linear-gradient(160deg, #AACDDC 0%, #81A6C6 50%, #D2C4B4 100%); display: flex; flex-direction: column; justify-content: center; padding: 4rem; position: relative; overflow: hidden; }
        .bs-art::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%); }
        .bs-art-inner { position: relative; z-index: 1; }
        .bs-art-title { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; font-weight: 700; color: #fff; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 2.5rem; }
        .bs-features { display: flex; flex-direction: column; gap: 1.2rem; }
        .bs-feature { display: flex; align-items: flex-start; gap: 1rem; }
        .bs-feature-icon { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; }
        .bs-feature-name { font-size: 0.88rem; font-weight: 500; color: #fff; margin-bottom: 0.2rem; }
        .bs-feature-desc { font-size: 0.78rem; font-weight: 300; color: rgba(255,255,255,0.65); line-height: 1.5; }
        @media (max-width: 860px) { .bs-root { grid-template-columns: 1fr; } .bs-art { display: none; } .bs-form-panel { padding: 3rem 2rem; } }
        @media (max-width: 400px) { .bs-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="bs-root">
        <div className="bs-form-panel">
          <div className="bs-eyebrow">Create Blogger Account</div>
          <h1 className="bs-title">Start your writing journey</h1>
          <p className="bs-sub">Free forever. Your words, your audience.</p>

          <div className="bs-row">
            <div className="bs-field">
              <label className="bs-label">First Name *</label>
              <input className="bs-input" type="text" placeholder="Jane" value={form.firstName} onChange={set("firstName")} />
            </div>
            <div className="bs-field">
              <label className="bs-label">Last Name</label>
              <input className="bs-input" type="text" placeholder="Doe" value={form.lastName} onChange={set("lastName")} />
            </div>
          </div>

          <div className="bs-field">
            <label className="bs-label">Email *</label>
            <input className="bs-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
          </div>

          <div className="bs-field">
            <label className="bs-label">Password *</label>
            <div className="bs-input-wrap">
              <input className="bs-input" type={showPw ? "text" : "password"} placeholder="Min. 6 characters"
                value={form.password} onChange={set("password")} style={{ paddingRight: "3.5rem" }} />
              <button className="bs-pw-toggle" type="button" onClick={() => setShowPw(p => !p)}>{showPw ? "Hide" : "Show"}</button>
            </div>
          </div>

          <div className="bs-field">
            <label className="bs-label">Confirm Password *</label>
            <input className="bs-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} />
          </div>

          <div className="bs-terms">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">I agree to the <Link to="/contact">Terms of Service</Link> and <Link to="/contact">Privacy Policy</Link></label>
          </div>

          {error && <div className="bs-error">{error}</div>}

          <button className="bs-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="bs-switch">Already have an account? <Link to="/blogger/login">Sign in</Link></p>

          <div style={{ textAlign:"center", marginTop:"1.5rem" }}>
            <Link to="/" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.78rem", fontWeight:"300", color:"rgba(42,42,42,0.4)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"0.35rem" }}
              onMouseOver={e=>e.currentTarget.style.color="#81A6C6"}
              onMouseOut={e=>e.currentTarget.style.color="rgba(42,42,42,0.4)"}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Return to Blogify Home
            </Link>
          </div>
        </div>

        <div className="bs-art">
          <div className="bs-art-inner">
            <h2 className="bs-art-title">Everything you need to write and grow</h2>
            <div className="bs-features">
              {[
                { icon: "✍", name: "Rich Text Editor", desc: "Full formatting — headings, lists, quotes, bold, italic and more." },
                { icon: "📊", name: "Analytics Dashboard", desc: "Views, likes, and engagement across all your posts at a glance." },
                { icon: "📄", name: "PDF Reports", desc: "Export your blog insights as a beautifully formatted PDF report." },
                { icon: "✏️", name: "Edit Anytime", desc: "Update and refine your published posts whenever you like." },
              ].map(f => (
                <div key={f.name} className="bs-feature">
                  <div className="bs-feature-icon">{f.icon}</div>
                  <div>
                    <div className="bs-feature-name">{f.name}</div>
                    <div className="bs-feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}