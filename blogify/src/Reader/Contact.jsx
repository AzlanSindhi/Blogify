import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "./nav";
import Footer from "./footer";
import { saveContactMessage } from "../services/firebaseService";

// ─── EmailJS Setup ─────────────────────────────────────────────────────────
// Run: npm install @emailjs/browser
// Then go to https://emailjs.com → create account → add Gmail service →
// create template with {{from_name}} {{from_email}} {{subject}} {{message}}
// Paste your three IDs here:
const EMAILJS_SERVICE_ID  = "service_blogify";    // ← your service ID
const EMAILJS_TEMPLATE_ID = "template_contact";   // ← your template ID
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";    // ← Account > General > Public Key
// ───────────────────────────────────────────────────────────────────────────

const TOPICS = [
  "General Enquiry","Partnership / Collaboration","Report a Bug",
  "Press & Media","Blogger Support","Advertise with Us","Other",
];

export default function Contact() {
  const [form,     setForm]     = useState({ name:"", email:"", subject:TOPICS[0], message:"" });
  const [status,   setStatus]   = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg("Please fill in all required fields."); return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErrorMsg("Please enter a valid email address."); return;
    }
    setErrorMsg(""); setStatus("sending");

    // 1. Always save to Firestore (works without any extra config)
    try { await saveContactMessage({ ...form }); } catch (err) { console.error("Failed to save contact message:", err); }

    // 2. Try EmailJS (requires npm install @emailjs/browser + real IDs)
    try {
      const emailjs = await import("@emailjs/browser").catch(() => null);
      if (emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: form.name, from_email: form.email,
          subject: form.subject, message: form.message,
          to_email: "azlaank1284@gmail.com", reply_to: form.email,
        }, EMAILJS_PUBLIC_KEY);
      } else {
        // Fallback: open user's mail client
        window.open(
          `mailto:azlaank1284@gmail.com?subject=${encodeURIComponent("[Blogify] "+form.subject)}&body=${encodeURIComponent("From: "+form.name+"\nEmail: "+form.email+"\n\n"+form.message)}`
        );
      }
    } catch(err) {
      console.warn("EmailJS:", err.message || err);
      // Message already saved to Firestore — still succeed
    }

    setStatus("success");
    setForm({ name:"", email:"", subject:TOPICS[0], message:"" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .ct-root{min-height:100vh;background:#060f24;color:#F6E7BC;font-family:'DM Sans',sans-serif}
        .ct-hero{background:linear-gradient(160deg,#0B2D72 0%,#060f24 65%);padding:9rem 2rem 5rem;text-align:center;position:relative;overflow:hidden}
        .ct-hero::before{content:'';position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:600px;height:600px;background:radial-gradient(circle,rgba(9,146,194,0.12) 0%,transparent 70%);pointer-events:none}
        .ct-eyebrow{font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:#0AC4E0;margin-bottom:1rem;position:relative;z-index:1}
        .ct-title{font-family:'Playfair Display',serif;font-size:clamp(2.5rem,6vw,4rem);font-weight:900;letter-spacing:-0.03em;color:#F6E7BC;margin-bottom:1rem;position:relative;z-index:1}
        .ct-subtitle{font-size:1rem;font-weight:300;color:rgba(246,231,188,0.55);max-width:480px;margin:0 auto;line-height:1.7;position:relative;z-index:1}
        .ct-layout{max-width:1100px;margin:0 auto;padding:5rem 2rem 6rem;display:grid;grid-template-columns:1fr 1.6fr;gap:5rem;align-items:start}
        .ct-info-lbl{font-size:0.72rem;letter-spacing:0.16em;text-transform:uppercase;color:#0992C2;margin-bottom:2rem}
        .ct-info-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:#F6E7BC;letter-spacing:-0.02em;margin-bottom:1rem;line-height:1.2}
        .ct-info-desc{font-size:0.92rem;font-weight:300;color:rgba(246,231,188,0.5);line-height:1.8;margin-bottom:2.5rem}
        .ct-items{display:flex;flex-direction:column;gap:1.5rem}
        .ct-item{display:flex;align-items:flex-start;gap:1rem}
        .ct-icon{width:40px;height:40px;border-radius:8px;background:rgba(10,196,224,0.08);border:1px solid rgba(10,196,224,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#0AC4E0}
        .ct-item-title{font-size:0.84rem;font-weight:500;color:#F6E7BC;margin-bottom:0.2rem}
        .ct-item-val{font-size:0.8rem;font-weight:300;color:rgba(246,231,188,0.45)}
        .ct-item-val a{color:#0AC4E0;text-decoration:none}
        .ct-form-card{background:rgba(11,45,114,0.25);border:1px solid rgba(10,196,224,0.12);border-radius:12px;padding:2.5rem}
        .ct-form-title{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:#F6E7BC;letter-spacing:-0.02em;margin-bottom:0.4rem}
        .ct-form-sub{font-size:0.82rem;font-weight:300;color:rgba(246,231,188,0.4);margin-bottom:2rem}
        .ct-row{display:grid;grid-template-columns:1fr 1fr;gap:0.9rem;margin-bottom:0.9rem}
        .ct-field{margin-bottom:0.9rem}
        .ct-label{display:block;font-size:0.67rem;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(246,231,188,0.4);margin-bottom:0.45rem}
        .ct-input,.ct-select,.ct-textarea{width:100%;background:rgba(6,15,36,0.6);border:1px solid rgba(10,196,224,0.15);border-radius:6px;padding:0.85rem 1rem;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:300;color:#F6E7BC;outline:none;transition:border-color 0.25s,box-shadow 0.25s}
        .ct-input:focus,.ct-select:focus,.ct-textarea:focus{border-color:#0AC4E0;box-shadow:0 0 0 3px rgba(10,196,224,0.08)}
        .ct-input::placeholder,.ct-textarea::placeholder{color:rgba(246,231,188,0.2)}
        .ct-select option{background:#0a1830;color:#F6E7BC}
        .ct-textarea{resize:vertical;min-height:130px;line-height:1.6}
        .ct-error{font-size:0.78rem;color:#ff6b6b;background:rgba(255,107,107,0.08);border:1px solid rgba(255,107,107,0.2);border-radius:6px;padding:0.65rem 0.9rem;margin-bottom:1rem}
        .ct-submit{width:100%;background:linear-gradient(135deg,#0992C2,#0AC4E0);border:none;border-radius:6px;padding:1rem;font-family:'DM Sans',sans-serif;font-size:0.88rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#060f24;cursor:pointer;transition:opacity 0.25s,transform 0.2s;margin-top:0.5rem;display:flex;align-items:center;justify-content:center;gap:0.6rem}
        .ct-submit:hover:not(:disabled){opacity:0.85;transform:translateY(-1px)}
        .ct-submit:disabled{opacity:0.6;cursor:not-allowed;transform:none}
        .ct-success{text-align:center;padding:3rem 1rem}
        .ct-success-icon{width:64px;height:64px;border-radius:50%;background:rgba(10,196,224,0.1);border:2px solid rgba(10,196,224,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;color:#0AC4E0}
        .ct-success-title{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#F6E7BC;letter-spacing:-0.02em;margin-bottom:0.6rem}
        .ct-success-sub{font-size:0.88rem;font-weight:300;color:rgba(246,231,188,0.5);line-height:1.7;margin-bottom:1.5rem}
        .ct-success-btn{background:none;border:1px solid rgba(10,196,224,0.3);border-radius:6px;padding:0.6rem 1.4rem;font-family:'DM Sans',sans-serif;font-size:0.82rem;color:#0AC4E0;cursor:pointer;transition:all 0.2s}
        .ct-success-btn:hover{background:rgba(10,196,224,0.08)}
        .ct-faq{background:rgba(11,45,114,0.15);border-top:1px solid rgba(10,196,224,0.08)}
        .ct-faq-inner{max-width:1100px;margin:0 auto;padding:4rem 2rem}
        .ct-faq-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:#F6E7BC;letter-spacing:-0.02em;margin-bottom:2.5rem}
        .ct-faq-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem}
        .ct-faq-item{background:rgba(11,45,114,0.3);border:1px solid rgba(10,196,224,0.08);border-radius:8px;padding:1.5rem}
        .ct-faq-q{font-size:0.92rem;font-weight:500;color:#F6E7BC;margin-bottom:0.6rem;line-height:1.4}
        .ct-faq-a{font-size:0.84rem;font-weight:300;color:rgba(246,231,188,0.5);line-height:1.7}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:860px){.ct-layout{grid-template-columns:1fr;gap:3rem}.ct-faq-grid{grid-template-columns:1fr}}
        @media(max-width:480px){.ct-row{grid-template-columns:1fr}.ct-form-card{padding:1.5rem}}
      `}</style>

      <div className="ct-root">
        <Nav />

        <section className="ct-hero">
          <div className="ct-eyebrow">Get in touch</div>
          <h1 className="ct-title">Contact Us</h1>
          <p className="ct-subtitle">Have a question, idea, or just want to say hello? We read every message and reply within 24 hours.</p>
        </section>

        <div className="ct-layout">
          <div>
            <div className="ct-info-lbl">Contact Information</div>
            <h2 className="ct-info-title">We&apos;d love to hear from you</h2>
            <p className="ct-info-desc">Whether you&apos;re a reader, blogger, or brand — reach out and we&apos;ll get back to you.</p>
            <div className="ct-items">
              <div className="ct-item">
                <div className="ct-icon"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                <div><div className="ct-item-title">Email</div><div className="ct-item-val"><a href="mailto:azlaank12842@gmail.com">azlaank12842@gmail.com</a></div></div>
              </div>
              <div className="ct-item">
                <div className="ct-icon"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                <div><div className="ct-item-title">Response Time</div><div className="ct-item-val">Within 24 hours on weekdays</div></div>
              </div>
              <div className="ct-item">
                <div className="ct-icon"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
                <div><div className="ct-item-title">Location</div><div className="ct-item-val">Blogify HQ &mdash; Remote first, worldwide</div></div>
              </div>
              <div className="ct-item">
                <div className="ct-icon"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
                <div><div className="ct-item-title">Want to write for us?</div><div className="ct-item-val"><Link to="/blogger/signup" style={{color:"#0AC4E0",textDecoration:"none"}}>Create a Blogger account</Link> and start publishing.</div></div>
              </div>
            </div>
          </div>

          <div className="ct-form-card">
            {status === "success" ? (
              <div className="ct-success">
                <div className="ct-success-icon"><svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div className="ct-success-title">Message sent!</div>
                <p className="ct-success-sub">Thanks for reaching out. We&apos;ve received your message and will reply within 24 hours.</p>
                <button className="ct-success-btn" onClick={() => setStatus("idle")}>Send another message</button>
              </div>
            ) : (
              <>
                <div className="ct-form-title">Send us a message</div>
                <p className="ct-form-sub">All fields marked * are required.</p>
                <form onSubmit={handleSubmit}>
                  <div className="ct-row">
                    <div className="ct-field">
                      <label className="ct-label">Full Name *</label>
                      <input className="ct-input" type="text" placeholder="Your name" value={form.name} onChange={set("name")} required />
                    </div>
                    <div className="ct-field">
                      <label className="ct-label">Email *</label>
                      <input className="ct-input" type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} required />
                    </div>
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Topic</label>
                    <select className="ct-select" value={form.subject} onChange={set("subject")}>
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="ct-field">
                    <label className="ct-label">Message *</label>
                    <textarea className="ct-textarea" placeholder="Tell us what's on your mind..." value={form.message} onChange={set("message")} required />
                  </div>
                  {errorMsg && <div className="ct-error">{errorMsg}</div>}
                  <button type="submit" className="ct-submit" disabled={status === "sending"}>
                    {status === "sending" ? (
                      <><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Sending...</>
                    ) : (
                      <><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Message</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <section className="ct-faq">
          <div className="ct-faq-inner">
            <h2 className="ct-faq-title">Frequently asked questions</h2>
            <div className="ct-faq-grid">
              {[
                ["How do I become a blogger on Blogify?","Sign up at /blogger/signup. Once registered you can start writing and publishing immediately from your dashboard."],
                ["Can readers comment without an account?","Yes — anyone can leave comments and like articles. An account lets you save articles to your reading list."],
                ["How long before my blog post is live?","Published posts go live immediately. You control publish/draft status from the editor."],
                ["Is Blogify free to use?","Absolutely free. Reading is always free. Creating a blogger account is free. No credit card required."],
                ["How do I report inappropriate content?","Use the form above with topic 'Report a Bug', or email us directly at azlaank12842@gmail.com."],
                ["Can I delete my account?","Yes. Contact us via this form and we will remove all your data within 48 hours."],
              ].map(([q,a]) => (
                <div key={q} className="ct-faq-item">
                  <div className="ct-faq-q">{q}</div>
                  <div className="ct-faq-a">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}