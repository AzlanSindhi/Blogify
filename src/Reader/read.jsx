import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "./nav";
import Footer from "./footer";
import {
  getBlogById, getPublishedBlogs,
  toggleBlogLike, subscribeComments, addComment, toggleCommentLike,
} from "../services/firebaseService";

function ProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, height:"2px", background:"rgba(10,196,224,0.12)", zIndex:2000 }}>
      <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#0992C2,#0AC4E0)", transition:"width 0.1s linear" }} />
    </div>
  );
}

export default function Read() {
  const { id }      = useParams();
  const commentsRef = useRef(null);

  const [article,    setArticle]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [related,    setRelated]    = useState([]);
  const [liked,      setLiked]      = useState(false);
  const [likeCount,  setLikeCount]  = useState(0);
  const [likeAnim,   setLikeAnim]   = useState(false);
  const [comments,   setComments]   = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [commentFocused, setCommentFocused] = useState(false);

  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setLoading(true);
  }

  // Load article
  useEffect(() => {
    if (!id) return;
    getBlogById(id)
      .then(data => {
        setArticle(data);
        setLikeCount(data?.likes || 0);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  // Load related blogs
  useEffect(() => {
    if (!article) return;
    getPublishedBlogs().then(blogs => {
      const rel = blogs
        .filter(b => b.id !== id && b.tag === article.tag)
        .slice(0, 3);
      setRelated(rel);
    });
  }, [article, id]);

  // Real-time comments
  useEffect(() => {
    if (!id) return;
    const unsub = subscribeComments(id, (data) => setComments(data));
    return unsub;
  }, [id]);

  const handleLike = async () => {
    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(p => newLiked ? p + 1 : p - 1);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    try {
      await toggleBlogLike(id, "anonymous_user"); // replace with real uid when auth is wired
    } catch (e) {
      console.error("Failed to toggle blog like:", e);
      // Revert on error
      setLiked(!newLiked);
      setLikeCount(p => newLiked ? p - 1 : p + 1);
    }
  };

  const handleCommentLike = async (commentId) => {
    // Optimistic
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c
    ));
    try {
      await toggleCommentLike(id, commentId, "anonymous_user");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await addComment(id, {
        authorName: commenterName.trim() || "Anonymous Reader",
        authorId:   null,
        text:       newComment.trim(),
      });
      setNewComment(""); setCommenterName("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (e) {
      console.error("Comment error:", e);
    }
    setSubmitting(false);
  };

  const scrollToComments = () => commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (loading) {
    return (
      <>
        <Nav />
        <div style={{ minHeight:"100vh", background:"#060f24", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(246,231,188,0.4)", fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem" }}>
          Loading article...
        </div>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Nav />
        <div style={{ minHeight:"100vh", background:"#060f24", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"rgba(246,231,188,0.4)", fontFamily:"'DM Sans',sans-serif", gap:"1rem" }}>
          <p>Article not found.</p>
          <Link to="/blogs" style={{ color:"#0AC4E0", textDecoration:"none" }}>Back to all blogs</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .read-root { min-height: 100vh; background: #060f24; color: #F6E7BC; font-family: 'DM Sans', sans-serif; }
        .read-hero { background: linear-gradient(170deg, #0B2D72 0%, #060f24 65%); padding: 8rem 2rem 5rem; position: relative; overflow: hidden; }
        .read-hero::after { content:''; position:absolute; bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(10,196,224,0.2),transparent); }
        .read-hero-inner { max-width: 760px; margin: 0 auto; }
        .read-breadcrumb { display:flex;align-items:center;gap:0.5rem;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(246,231,188,0.35);margin-bottom:2rem; }
        .read-breadcrumb a { color:rgba(246,231,188,0.35);text-decoration:none;transition:color 0.2s; }
        .read-breadcrumb a:hover { color:#0AC4E0; }
        .read-tag { display:inline-block;font-size:0.68rem;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:#060f24;background:#0AC4E0;padding:0.3rem 0.9rem;border-radius:2px;margin-bottom:1.5rem; }
        .read-title { font-family:'Playfair Display',serif;font-size:clamp(2.2rem,5vw,3.6rem);font-weight:900;line-height:1.1;letter-spacing:-0.03em;color:#F6E7BC;margin-bottom:1.2rem; }
        .read-subtitle { font-family:'Lora',serif;font-size:1.15rem;font-style:italic;color:rgba(246,231,188,0.6);line-height:1.65;margin-bottom:2.5rem; }
        .read-meta-bar { display:flex;align-items:center;justify-content:space-between;padding-top:1.5rem;border-top:1px solid rgba(10,196,224,0.1);flex-wrap:wrap;gap:1rem; }
        .read-author-row { display:flex;align-items:center;gap:0.9rem; }
        .read-author-avatar { width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#0992C2,#0AC4E0);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:#F6E7BC;flex-shrink:0; }
        .read-author-name { font-size:0.88rem;font-weight:500;color:#F6E7BC; }
        .read-author-date { font-size:0.75rem;font-weight:300;color:rgba(246,231,188,0.35);margin-top:0.1rem; }
        .read-meta-right { display:flex;align-items:center;gap:1.2rem; }
        .read-meta-pill { font-size:0.72rem;font-weight:400;letter-spacing:0.08em;color:rgba(246,231,188,0.4);display:flex;align-items:center;gap:0.4rem; }
        .read-action-btn { background:none;border:1px solid rgba(10,196,224,0.2);border-radius:2px;padding:0.4rem 0.9rem;font-family:'DM Sans',sans-serif;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:rgba(246,231,188,0.5);cursor:pointer;transition:all 0.25s;display:flex;align-items:center;gap:0.4rem; }
        .read-action-btn:hover { border-color:#0AC4E0;color:#0AC4E0; }
        .read-layout { max-width: 1100px; margin: 0 auto; padding: 5rem 2rem; display: grid; grid-template-columns: 1fr 280px; gap: 5rem; align-items: start; }
        .article-lead { font-family:'Lora',serif;font-size:1.22rem;font-weight:400;line-height:1.8;color:rgba(246,231,188,0.9);margin-bottom:2.5rem;padding-left:1.5rem;border-left:3px solid #0AC4E0; }
        .article-h2 { font-family:'Playfair Display',serif;font-size:1.55rem;font-weight:700;color:#F6E7BC;letter-spacing:-0.02em;margin:3rem 0 1.2rem;line-height:1.25; }
        .article-p { font-family:'Lora',serif;font-size:1.05rem;line-height:1.9;color:rgba(246,231,188,0.72);margin-bottom:1.6rem; }
        .article-html { font-family:'Lora',serif;font-size:1.05rem;line-height:1.9;color:rgba(246,231,188,0.72); }
        .article-html h1,.article-html h2 { font-family:'Playfair Display',serif;color:#F6E7BC;letter-spacing:-0.02em;margin:2.5rem 0 1rem; }
        .article-html h2 { font-size:1.55rem;font-weight:700; }
        .article-html h1 { font-size:2rem;font-weight:900; }
        .article-html p { margin-bottom:1.5rem; }
        .article-html blockquote { border-left:3px solid #0992C2;margin:2rem 0;padding:1.2rem 2rem;background:rgba(11,45,114,0.3);border-radius:0 4px 4px 0;font-style:italic;color:rgba(246,231,188,0.8); }
        .article-html ul,.article-html ol { padding-left:2rem;margin-bottom:1.5rem; }
        .article-html li { margin-bottom:0.5rem; }
        .article-html a { color:#0AC4E0; }
        .article-html img { max-width:100%;border-radius:8px;margin:1.5rem 0; }
        .article-html strong { color:#F6E7BC;font-weight:600; }
        .article-actions { display:flex;align-items:center;gap:1rem;padding:2rem 0;border-top:1px solid rgba(10,196,224,0.1);border-bottom:1px solid rgba(10,196,224,0.1);margin:3rem 0;flex-wrap:wrap; }
        .like-btn { display:flex;align-items:center;gap:0.6rem;background:none;border:1px solid rgba(10,196,224,0.2);border-radius:3px;padding:0.65rem 1.3rem;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:500;cursor:pointer;transition:all 0.25s;color:rgba(246,231,188,0.6); }
        .like-btn.liked { background:rgba(220,50,80,0.1);border-color:rgba(220,50,80,0.5);color:#ff6b7a; }
        .like-btn:hover:not(.liked) { border-color:rgba(220,50,80,0.4);color:#ff6b7a; }
        .like-btn.anim svg { transform:scale(1.4); }
        .like-btn svg { transition:transform 0.3s cubic-bezier(0.34,1.6,0.64,1); }
        .like-count { font-size:0.82rem;font-weight:300;color:rgba(246,231,188,0.35); }
        .share-btn { display:flex;align-items:center;gap:0.5rem;background:none;border:1px solid rgba(10,196,224,0.15);border-radius:3px;padding:0.65rem 1.1rem;font-family:'DM Sans',sans-serif;font-size:0.82rem;letter-spacing:0.06em;text-transform:uppercase;color:rgba(246,231,188,0.4);cursor:pointer;transition:all 0.25s; }
        .share-btn:hover { border-color:#0992C2;color:#0992C2; }
        .comment-jump-btn { display:flex;align-items:center;gap:0.5rem;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:0.82rem;color:rgba(246,231,188,0.4);cursor:pointer;transition:color 0.2s;margin-left:auto; }
        .comment-jump-btn:hover { color:#0AC4E0; }
        .author-card { background:rgba(11,45,114,0.3);border:1px solid rgba(10,196,224,0.1);border-radius:6px;padding:2rem;margin-top:3rem; }
        .author-card-top { display:flex;align-items:center;gap:1rem;margin-bottom:1rem; }
        .author-card-avatar { width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#0992C2,#0AC4E0);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:#F6E7BC;flex-shrink:0; }
        .author-card-name { font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:#F6E7BC;letter-spacing:-0.01em; }
        .author-card-label { font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:#0992C2;margin-top:0.15rem; }
        .author-card-bio { font-family:'Lora',serif;font-size:0.88rem;font-style:italic;line-height:1.7;color:rgba(246,231,188,0.5); }
        .read-sidebar { position:sticky;top:100px; }
        .sidebar-like { display:flex;flex-direction:column;align-items:center;gap:0.5rem;padding:1.5rem;background:rgba(11,45,114,0.3);border:1px solid rgba(10,196,224,0.1);border-radius:6px;margin-bottom:2.5rem; }
        .sidebar-like-btn { width:52px;height:52px;border-radius:50%;background:none;border:1px solid rgba(10,196,224,0.2);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s;color:rgba(246,231,188,0.5); }
        .sidebar-like-btn.liked { background:rgba(220,50,80,0.12);border-color:rgba(220,50,80,0.5);color:#ff6b7a; }
        .sidebar-like-btn:hover:not(.liked) { border-color:rgba(220,50,80,0.4);color:#ff6b7a;transform:scale(1.08); }
        .sidebar-like-btn.anim { transform:scale(1.25); }
        .sidebar-like-count { font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:#F6E7BC; }
        .sidebar-like-label { font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(246,231,188,0.3); }
        .sidebar-section { margin-bottom:2.5rem; }
        .sidebar-label { font-size:0.65rem;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:#0992C2;margin-bottom:1.2rem;padding-bottom:0.6rem;border-bottom:1px solid rgba(10,196,224,0.1); }
        .related-item { padding:1rem 0;border-bottom:1px solid rgba(10,196,224,0.07);text-decoration:none;display:block; }
        .related-item:last-child { border-bottom:none; }
        .related-tag { font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:#0992C2;margin-bottom:0.3rem; }
        .related-title { font-family:'Playfair Display',serif;font-size:0.9rem;font-weight:700;color:rgba(246,231,188,0.75);line-height:1.35;letter-spacing:-0.01em;transition:color 0.2s; }
        .related-item:hover .related-title { color:#F6E7BC; }
        .related-meta { font-size:0.7rem;color:rgba(246,231,188,0.25);margin-top:0.3rem; }
        .comments-section { max-width:760px;margin:0 auto;padding:0 2rem 6rem; }
        .comments-header { display:flex;align-items:baseline;gap:1rem;margin-bottom:2.5rem;padding-bottom:1.2rem;border-bottom:1px solid rgba(10,196,224,0.1); }
        .comments-title { font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#F6E7BC;letter-spacing:-0.02em; }
        .comments-count { font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(246,231,188,0.3); }
        .comment-form { background:rgba(11,45,114,0.25);border:1px solid rgba(10,196,224,0.12);border-radius:6px;padding:1.8rem;margin-bottom:3rem;transition:border-color 0.3s; }
        .comment-form.focused { border-color:rgba(10,196,224,0.3); }
        .comment-form-title { font-size:0.72rem;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:#0992C2;margin-bottom:1.2rem; }
        .comment-name-input { width:100%;background:rgba(6,15,36,0.6);border:1px solid rgba(10,196,224,0.15);border-radius:4px;padding:0.7rem 1rem;font-family:'DM Sans',sans-serif;font-size:0.88rem;font-weight:300;color:#F6E7BC;outline:none;transition:border-color 0.3s;margin-bottom:0.8rem; }
        .comment-name-input:focus { border-color:#0AC4E0; }
        .comment-name-input::placeholder { color:rgba(246,231,188,0.2); }
        .comment-textarea { width:100%;background:rgba(6,15,36,0.6);border:1px solid rgba(10,196,224,0.15);border-radius:4px;padding:0.9rem 1rem;font-family:'Lora',serif;font-size:0.95rem;color:#F6E7BC;outline:none;resize:vertical;min-height:110px;transition:border-color 0.3s;line-height:1.65; }
        .comment-textarea:focus { border-color:#0AC4E0; }
        .comment-textarea::placeholder { color:rgba(246,231,188,0.2);font-style:italic; }
        .comment-form-footer { display:flex;align-items:center;justify-content:space-between;margin-top:1rem;flex-wrap:wrap;gap:0.75rem; }
        .comment-form-note { font-size:0.75rem;color:rgba(246,231,188,0.25); }
        .comment-submit-btn { background:#0992C2;border:none;border-radius:3px;padding:0.65rem 1.6rem;font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#F6E7BC;cursor:pointer;transition:background 0.25s,transform 0.2s; }
        .comment-submit-btn:hover:not(:disabled) { background:#0AC4E0;transform:translateY(-1px); }
        .comment-submit-btn:disabled { opacity:0.4;cursor:not-allowed; }
        .submit-success { font-size:0.8rem;color:#0AC4E0;display:flex;align-items:center;gap:0.4rem; }
        .comment-list { display:flex;flex-direction:column; }
        .comment-item { padding:1.8rem 0;border-bottom:1px solid rgba(10,196,224,0.07);animation:fadeIn 0.4s ease; }
        .comment-item:last-child { border-bottom:none; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .comment-top { display:flex;align-items:center;justify-content:space-between;margin-bottom:0.9rem; }
        .comment-author-row { display:flex;align-items:center;gap:0.75rem; }
        .comment-avatar { width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#0B2D72,#0992C280);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:0.9rem;font-weight:700;color:#F6E7BC;flex-shrink:0; }
        .comment-author-name { font-size:0.88rem;font-weight:500;color:#F6E7BC; }
        .comment-time { font-size:0.72rem;font-weight:300;color:rgba(246,231,188,0.25);margin-top:0.1rem; }
        .comment-like-btn { display:flex;align-items:center;gap:0.4rem;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:0.75rem;color:rgba(246,231,188,0.3);cursor:pointer;transition:color 0.2s;padding:0.25rem 0; }
        .comment-like-btn:hover,.comment-like-btn.liked { color:#ff6b7a; }
        .comment-text { font-family:'Lora',serif;font-size:0.97rem;line-height:1.75;color:rgba(246,231,188,0.65); }
        @media (max-width:900px) { .read-layout{grid-template-columns:1fr;gap:3rem} .read-sidebar{position:static} .sidebar-like{flex-direction:row;justify-content:center} }
        @media (max-width:600px) { .read-meta-bar{flex-direction:column;align-items:flex-start} .article-actions{gap:0.6rem} .comment-jump-btn{margin-left:0} }
      `}</style>

      <ProgressBar />
      <div className="read-root">
        <Nav />

        {/* Hero */}
        <section className="read-hero">
          <div className="read-hero-inner">
            <div className="read-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/blogs">Blogs</Link>
              <span>/</span>
              <span style={{ color:"rgba(246,231,188,0.6)" }}>{article.tag}</span>
            </div>
            <span className="read-tag">{article.tag}</span>
            <h1 className="read-title">{article.title}</h1>
            {article.subtitle && <p className="read-subtitle">{article.subtitle}</p>}
            <div className="read-meta-bar">
              <div className="read-author-row">
                <div className="read-author-avatar">{(article.authorAvatar || article.authorName?.[0] || "A")}</div>
                <div>
                  <div className="read-author-name">{article.authorName}</div>
                  <div className="read-author-date">{article.date}</div>
                </div>
              </div>
              <div className="read-meta-right">
                <span className="read-meta-pill">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {article.readTime} read
                </span>
                <button className="read-action-btn" onClick={scrollToComments}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {comments.length} comments
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Body + Sidebar */}
        <div className="read-layout">
          <article>
            {/* Render HTML content from Firestore */}
            <div
              className="article-html"
              dangerouslySetInnerHTML={{ __html: article.content || "<p>No content available.</p>" }}
            />

            {/* Actions bar */}
            <div className="article-actions">
              <button className={`like-btn${liked?" liked":""}${likeAnim?" anim":""}`} onClick={handleLike}>
                <svg width="16" height="16" fill={liked?"currentColor":"none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {liked ? "Liked" : "Like this"}
              </button>
              <span className="like-count">{likeCount} people liked this</span>
              <button className="share-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
              <button className="comment-jump-btn" onClick={scrollToComments}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {comments.length} comments
              </button>
            </div>

            {/* Author card */}
            {article.authorName && (
              <div className="author-card">
                <div className="author-card-top">
                  <div className="author-card-avatar">{article.authorAvatar || article.authorName[0]}</div>
                  <div>
                    <div className="author-card-name">{article.authorName}</div>
                    <div className="author-card-label">Contributing Writer</div>
                  </div>
                </div>
                {article.authorBio && <p className="author-card-bio">{article.authorBio}</p>}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="read-sidebar">
            <div className="sidebar-like">
              <button className={`sidebar-like-btn${liked?" liked":""}${likeAnim?" anim":""}`} onClick={handleLike}>
                <svg width="20" height="20" fill={liked?"currentColor":"none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <div className="sidebar-like-count">{likeCount}</div>
              <div className="sidebar-like-label">{liked ? "You liked this" : "Likes"}</div>
            </div>

            {related.length > 0 && (
              <div className="sidebar-section">
                <div className="sidebar-label">Related Reading</div>
                {related.map(r => (
                  <Link key={r.id} to={`/read/${r.id}`} className="related-item">
                    <div className="related-tag">{r.tag}</div>
                    <div className="related-title">{r.title}</div>
                    <div className="related-meta">{r.authorName} &middot; {r.readTime} read</div>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>

        {/* Comments */}
        <section className="comments-section" ref={commentsRef}>
          <div className="comments-header">
            <h2 className="comments-title">Discussion</h2>
            <span className="comments-count">{comments.length} comments</span>
          </div>

          <div className={`comment-form${commentFocused?" focused":""}`}>
            <div className="comment-form-title">Leave a response</div>
            <input className="comment-name-input" type="text" placeholder="Your name (optional)"
              value={commenterName} onChange={e => setCommenterName(e.target.value)}
              onFocus={() => setCommentFocused(true)} onBlur={() => setCommentFocused(false)} />
            <textarea className="comment-textarea" placeholder="Share your thoughts on this piece..."
              value={newComment} onChange={e => setNewComment(e.target.value)}
              onFocus={() => setCommentFocused(true)} onBlur={() => setCommentFocused(false)} />
            <div className="comment-form-footer">
              {submitted ? (
                <span className="submit-success">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  Comment posted
                </span>
              ) : (
                <span className="comment-form-note">Be thoughtful. Be kind.</span>
              )}
              <button className="comment-submit-btn" onClick={handleSubmit}
                disabled={!newComment.trim() || submitting}>
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>

          <div className="comment-list">
            {comments.map(c => (
              <div key={c.id} className="comment-item">
                <div className="comment-top">
                  <div className="comment-author-row">
                    <div className="comment-avatar">{c.authorInitial || (c.authorName?.[0] || "A")}</div>
                    <div>
                      <div className="comment-author-name">{c.authorName}</div>
                      <div className="comment-time">
                        {c.createdAt?.toDate ? new Date(c.createdAt.toDate()).toLocaleDateString("en-US", { month:"short", day:"numeric" }) : c.timeDisplay || "Just now"}
                      </div>
                    </div>
                  </div>
                  <button className={`comment-like-btn${c.liked?" liked":""}`} onClick={() => handleCommentLike(c.id)}>
                    <svg width="13" height="13" fill={c.liked?"currentColor":"none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {c.likes > 0 && c.likes}
                  </button>
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}