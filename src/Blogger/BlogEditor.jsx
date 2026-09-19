import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogger } from "./BloggerContext";
import BloggerLayout from "./BloggerLayout";

const TAGS = ["Design", "Typography", "Writing", "UX", "Technology", "Culture", "Science", "Travel", "Philosophy"];

function ToolbarBtn({ title, active, onClick, children }) {
  return (
    <button title={title} onMouseDown={e => { e.preventDefault(); onClick(); }}
      style={{ background: active ? "#81A6C6" : "none", color: active ? "#fff" : "#666", border: "none", borderRadius: "5px", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.82rem", fontWeight: "600", transition: "background 0.15s, color 0.15s", flexShrink: 0 }}
      onMouseOver={e => { if (!active) e.currentTarget.style.background = "#f0e8de"; }}
      onMouseOut={e => { if (!active) e.currentTarget.style.background = "none"; }}>
      {children}
    </button>
  );
}

function ToolbarSep() {
  return <div style={{ width: "1px", height: "20px", background: "#e8ddd4", margin: "0 0.3rem", flexShrink: 0 }} />;
}

export default function BlogEditor() {
  const { id }          = useParams();
  const { blogs, saveBlog } = useBlogger();
  const navigate        = useNavigate();

  const existing = id ? blogs.find(b => b.id === id) : null;

  const [title,    setTitle]    = useState(existing?.title   || "");
  const [excerpt,  setExcerpt]  = useState(existing?.excerpt || "");
  const [tag,      setTag]      = useState(existing?.tag     || TAGS[0]);
  const [status,   setStatus]   = useState(existing?.status  || "draft");
  const [readTime, setReadTime] = useState(existing?.readTime|| "5 min");
  const [saved,    setSaved]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef(null);

  const countWords = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    }
  }, []);

  useEffect(() => {
    if (existing?.content && editorRef.current) {
      editorRef.current.innerHTML = existing.content;
      const timer = setTimeout(countWords, 0);
      return () => clearTimeout(timer);
    }
  }, [existing?.id, existing?.content, countWords]);

  const exec = (cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    countWords();
  };

  const isActive = (cmd) => { try { return document.queryCommandState(cmd); } catch { return false; } };

  const handleSave = async (saveStatus) => {
    const content = editorRef.current?.innerHTML || "";
    if (!title.trim()) { setError("Please add a title."); return; }
    setError(""); setSaving(true);
    try {
      await saveBlog({
        ...(existing ? { id: existing.id } : {}),
        title, excerpt, tag, readTime, content,
        status: saveStatus || status,
        subtitle: excerpt,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      if (saveStatus === "published") navigate("/my-blogs");
    } catch (e) {
      setError("Save failed: " + e.message);
    }
    setSaving(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .ed-wrap{display:grid;grid-template-columns:1fr 280px;gap:1.5rem;align-items:start}
        .ed-toolbar{background:#fff;border:1px solid #e8ddd4;border-radius:10px 10px 0 0;padding:0.6rem 0.8rem;display:flex;align-items:center;gap:0.2rem;flex-wrap:wrap}
        .ed-select{background:none;border:1px solid #e8ddd4;border-radius:5px;padding:0.25rem 0.5rem;font-family:'DM Sans',sans-serif;font-size:0.78rem;color:#666;outline:none;cursor:pointer;flex-shrink:0}
        .ed-title-input{width:100%;background:#fff;border:1px solid #e8ddd4;border-radius:10px 10px 0 0;border-bottom:none;padding:1.2rem 3rem;font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;color:#2a2a2a;outline:none;letter-spacing:-0.02em;transition:border-color 0.25s}
        .ed-title-input:focus{border-color:#81A6C6} .ed-title-input::placeholder{color:#ccc;font-style:italic}
        .ed-content-area{background:#fff;border:1px solid #e8ddd4;border-top:none;padding:2.5rem 3rem;min-height:520px;outline:none;font-family:'Lora',serif;font-size:1rem;line-height:1.85;color:#2a2a2a;caret-color:#81A6C6}
        .ed-content-area:empty::before{content:"Start writing your story here...";color:#ccc;font-style:italic;pointer-events:none}
        .ed-content-area h1{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:#1a1a1a;margin:1.5rem 0 0.8rem;letter-spacing:-0.03em}
        .ed-content-area h2{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#1a1a1a;margin:1.3rem 0 0.7rem;letter-spacing:-0.02em}
        .ed-content-area h3{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:700;color:#1a1a1a;margin:1.1rem 0 0.6rem}
        .ed-content-area p{margin-bottom:1rem}
        .ed-content-area blockquote{border-left:3px solid #81A6C6;margin:1.5rem 0;padding:0.8rem 1.5rem;background:rgba(129,166,198,0.06);font-style:italic;color:#555;border-radius:0 6px 6px 0}
        .ed-content-area ul,.ed-content-area ol{padding-left:1.8rem;margin-bottom:1rem}
        .ed-content-area a{color:#81A6C6;text-decoration:underline}
        .ed-content-area img{max-width:100%;border-radius:8px;margin:1rem 0}
        .ed-footer-bar{display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.8rem;background:#faf6f1;border:1px solid #e8ddd4;border-top:none;border-radius:0 0 10px 10px;font-size:0.72rem;color:#bbb;letter-spacing:0.04em}
        .ed-panel{background:#fff;border:1px solid #e8ddd4;border-radius:10px;overflow:hidden;margin-bottom:1rem}
        .ed-panel-title{font-size:0.68rem;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:#aaa;padding:0.9rem 1.2rem;border-bottom:1px solid #f0e8de;background:#faf6f1}
        .ed-panel-body{padding:1.2rem}
        .ed-field{margin-bottom:0.9rem} .ed-field:last-child{margin-bottom:0}
        .ed-label{display:block;font-size:0.67rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#aaa;margin-bottom:0.4rem}
        .ed-input,.ed-textarea,.ed-select-field{width:100%;background:#faf6f1;border:1px solid #e8ddd4;border-radius:6px;padding:0.65rem 0.8rem;font-family:'DM Sans',sans-serif;font-size:0.84rem;color:#2a2a2a;outline:none;transition:border-color 0.25s}
        .ed-input:focus,.ed-textarea:focus,.ed-select-field:focus{border-color:#81A6C6}
        .ed-input::placeholder,.ed-textarea::placeholder{color:#ccc}
        .ed-textarea{resize:vertical;min-height:70px;line-height:1.5}
        .ed-status-toggle{display:flex;background:#faf6f1;border:1px solid #e8ddd4;border-radius:6px;overflow:hidden;padding:0.2rem;gap:0.2rem}
        .ed-status-btn{flex:1;background:none;border:none;border-radius:4px;padding:0.5rem;font-family:'DM Sans',sans-serif;font-size:0.78rem;color:#aaa;cursor:pointer;transition:all 0.2s;text-align:center}
        .ed-status-btn.active{background:#81A6C6;color:#fff;font-weight:500}
        .ed-actions{display:flex;flex-direction:column;gap:0.5rem}
        .ed-save-btn{width:100%;border:none;border-radius:8px;padding:0.8rem;font-family:'DM Sans',sans-serif;font-size:0.84rem;font-weight:500;letter-spacing:0.06em;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:0.5rem}
        .ed-save-primary{background:#81A6C6;color:#fff} .ed-save-primary:hover:not(:disabled){background:#6b93b5;transform:translateY(-1px)}
        .ed-save-secondary{background:#f0e8de;color:#888} .ed-save-secondary:hover{background:#e8ddd4}
        .ed-save-btn:disabled{opacity:0.6;cursor:not-allowed}
        .ed-saved-badge{display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;color:#81A6C6;justify-content:center;padding:0.3rem}
        .ed-error{font-size:0.78rem;color:#c0392b;background:rgba(192,57,43,0.06);border:1px solid rgba(192,57,43,0.2);border-radius:4px;padding:0.5rem 0.7rem;margin-bottom:0.5rem}
        .ed-back{display:inline-flex;align-items:center;gap:0.4rem;font-size:0.78rem;color:#aaa;margin-bottom:1.2rem;transition:color 0.2s;background:none;border:none;cursor:pointer;padding:0;font-family:'DM Sans',sans-serif}
        .ed-back:hover{color:#81A6C6}
        @media(max-width:900px){.ed-wrap{grid-template-columns:1fr}}
      `}</style>

      <BloggerLayout>
        <button className="ed-back" onClick={() => navigate("/my-blogs")}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Blogs
        </button>

        <div className="ed-wrap">
          <div>
            <input className="ed-title-input" type="text" placeholder="Post title..."
              value={title} onChange={e => setTitle(e.target.value)} />

            <div className="ed-toolbar">
              <select className="ed-select" onChange={e => exec("formatBlock", e.target.value)} defaultValue="">
                <option value="" disabled>Format</option>
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="blockquote">Quote</option>
              </select>
              <ToolbarSep />
              <ToolbarBtn title="Bold" active={isActive("bold")} onClick={() => exec("bold")}><b>B</b></ToolbarBtn>
              <ToolbarBtn title="Italic" active={isActive("italic")} onClick={() => exec("italic")}><i>I</i></ToolbarBtn>
              <ToolbarBtn title="Underline" active={isActive("underline")} onClick={() => exec("underline")}><u>U</u></ToolbarBtn>
              <ToolbarBtn title="Strikethrough" active={isActive("strikeThrough")} onClick={() => exec("strikeThrough")}><s>S</s></ToolbarBtn>
              <ToolbarSep />
              <ToolbarBtn title="Bullet List" active={isActive("insertUnorderedList")} onClick={() => exec("insertUnorderedList")}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
              </ToolbarBtn>
              <ToolbarBtn title="Numbered List" active={isActive("insertOrderedList")} onClick={() => exec("insertOrderedList")}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/></svg>
              </ToolbarBtn>
              <ToolbarSep />
              <ToolbarBtn title="Align Left" active={false} onClick={() => exec("justifyLeft")}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
              </ToolbarBtn>
              <ToolbarBtn title="Center" active={false} onClick={() => exec("justifyCenter")}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
              </ToolbarBtn>
              <ToolbarSep />
              <ToolbarBtn title="Insert Link" active={false} onClick={() => { const url = prompt("URL:"); if (url) exec("createLink", url); }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </ToolbarBtn>
              <ToolbarBtn title="Insert Image" active={false} onClick={() => { const url = prompt("Image URL:"); if (url) exec("insertImage", url); }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </ToolbarBtn>
              <ToolbarSep />
              <ToolbarBtn title="Undo" active={false} onClick={() => exec("undo")}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
              </ToolbarBtn>
              <ToolbarBtn title="Redo" active={false} onClick={() => exec("redo")}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>
              </ToolbarBtn>
              <ToolbarBtn title="Clear Formatting" active={false} onClick={() => exec("removeFormat")}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </ToolbarBtn>
            </div>

            <div ref={editorRef} className="ed-content-area" contentEditable suppressContentEditableWarning
              onInput={countWords} onKeyUp={countWords} />
            <div className="ed-footer-bar">
              <span>{wordCount} words &nbsp;|&nbsp; ~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
              <span>{existing ? "Editing existing post" : "New post"}</span>
            </div>
          </div>

          <div>
            <div className="ed-panel">
              <div className="ed-panel-title">Publish</div>
              <div className="ed-panel-body">
                <div className="ed-field">
                  <label className="ed-label">Status</label>
                  <div className="ed-status-toggle">
                    <button className={`ed-status-btn${status === "draft" ? " active" : ""}`} onClick={() => setStatus("draft")}>Draft</button>
                    <button className={`ed-status-btn${status === "published" ? " active" : ""}`} onClick={() => setStatus("published")}>Published</button>
                  </div>
                </div>
                <div className="ed-actions">
                  {error && <div className="ed-error">{error}</div>}
                  <button className="ed-save-btn ed-save-primary" onClick={() => handleSave(status)} disabled={saving}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {saving ? "Saving..." : status === "published" ? "Save & Publish" : "Save Draft"}
                  </button>
                  {status === "draft" && (
                    <button className="ed-save-btn ed-save-secondary" onClick={() => handleSave("published")} disabled={saving}>
                      Publish Now
                    </button>
                  )}
                  {saved && (
                    <div className="ed-saved-badge">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      Saved to Firebase
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="ed-panel">
              <div className="ed-panel-title">Post Details</div>
              <div className="ed-panel-body">
                <div className="ed-field">
                  <label className="ed-label">Category</label>
                  <select className="ed-select-field" value={tag} onChange={e => setTag(e.target.value)}>
                    {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="ed-field">
                  <label className="ed-label">Excerpt</label>
                  <textarea className="ed-textarea" placeholder="Brief summary shown in listings..."
                    value={excerpt} onChange={e => setExcerpt(e.target.value)} />
                </div>
                <div className="ed-field">
                  <label className="ed-label">Read Time</label>
                  <input className="ed-input" type="text" placeholder="e.g. 5 min"
                    value={readTime} onChange={e => setReadTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="ed-panel">
              <div className="ed-panel-title">Shortcuts</div>
              <div className="ed-panel-body">
                {[["Bold","Ctrl+B"],["Italic","Ctrl+I"],["Underline","Ctrl+U"],["Undo","Ctrl+Z"],["Redo","Ctrl+Y"]].map(([a,s]) => (
                  <div key={a} style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.5rem", fontSize:"0.78rem" }}>
                    <span style={{ color:"#888" }}>{a}</span>
                    <kbd style={{ background:"#f0e8de", border:"1px solid #e8ddd4", borderRadius:"3px", padding:"0.1rem 0.4rem", fontSize:"0.7rem", color:"#888", fontFamily:"monospace" }}>{s}</kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BloggerLayout>
    </>
  );
}