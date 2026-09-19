import { useState } from "react";
import { useAdmin } from "./AdminContext";
import AdminLayout from "./AdminLayout";

const C = { blue: "#81A6C6", sky: "#AACDDC", sand: "#D2C4B4", cream: "#F3E3D0" };

function generatePDF(blogs, bloggers, readers, analytics, selectedMonth) {
  const monthBlogs = selectedMonth === "all" ? blogs : blogs.filter(b => b.month === selectedMonth);
  const tagCounts  = monthBlogs.reduce((acc, b) => { acc[b.tag||"Other"] = (acc[b.tag||"Other"]||0)+1; return acc; }, {});
  const tagEntries = Object.entries(tagCounts).sort((a,b) => b[1]-a[1]);
  const maxTag     = Math.max(...Object.values(tagCounts), 1);
  const totalViews    = monthBlogs.reduce((s,b) => s+(b.views||0), 0);
  const totalLikes    = monthBlogs.reduce((s,b) => s+(b.likes||0), 0);
  const totalComments = monthBlogs.reduce((s,b) => s+(b.commentCount||0), 0);
  const maxMV         = Math.max(...analytics.map(d=>d.totalViews||0), 1);

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Blogify Admin Report${selectedMonth!=="all"?" - "+selectedMonth:""}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0} body{font-family:'DM Sans',sans-serif;background:#fff;color:#1a2a3a}
    .cover{background:linear-gradient(135deg,#0f1923,#1a2e40,#81A6C6);padding:4rem 3.5rem}
    .cover-logo{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:700;color:#fff;margin-bottom:0.5rem}
    .cover-badge{display:inline-block;background:rgba(129,166,198,0.25);color:#AACDDC;font-size:0.7rem;letter-spacing:0.16em;text-transform:uppercase;padding:0.2rem 0.6rem;border-radius:3px;margin-bottom:2rem}
    .cover-title{font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:700;color:#fff;line-height:1.15;margin-bottom:0.5rem}
    .cover-meta{font-size:0.78rem;color:rgba(255,255,255,0.4);margin-top:1.5rem}
    .body{padding:3rem}
    .sec{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#1a2a3a;letter-spacing:-0.02em;margin:2.5rem 0 1rem;padding-bottom:0.5rem;border-bottom:2px solid #81A6C6}
    .sec:first-child{margin-top:0}
    .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem}
    .sbox{border:1px solid #e0d5cc;border-radius:8px;padding:1.2rem;text-align:center;background:#faf6f1;border-top:3px solid #81A6C6}
    .sval{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:#81A6C6}
    .slabel{font-size:0.68rem;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin-top:0.3rem}
    .mchart{display:flex;align-items:flex-end;gap:0.4rem;height:100px;margin-bottom:1.2rem}
    .mbar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;height:100%;justify-content:flex-end}
    .mbar{width:100%;border-radius:3px 3px 0 0;background:linear-gradient(180deg,#81A6C6,#AACDDC)}
    .mlabel{font-size:0.6rem;color:#aaa}
    table{width:100%;border-collapse:collapse;margin-bottom:2rem}
    th{font-size:0.65rem;text-transform:uppercase;letter-spacing:0.12em;color:#888;padding:0.7rem 0.8rem;text-align:left;background:#faf6f1;border-bottom:1px solid #e0d5cc}
    td{padding:0.85rem 0.8rem;font-size:0.83rem;color:#444;border-bottom:1px solid #f0e8de}
    .badge{display:inline-block;font-size:0.62rem;text-transform:uppercase;padding:0.15rem 0.5rem;border-radius:99px;font-weight:500}
    .badge.published{background:rgba(129,166,198,0.15);color:#81A6C6}
    .badge.draft{background:rgba(210,196,180,0.25);color:#8b6a50}
    .bar-wrap{margin-bottom:0.8rem}
    .bar-label{display:flex;justify-content:space-between;font-size:0.78rem;color:#555;margin-bottom:0.3rem}
    .bar-track{height:8px;background:#f0e8de;border-radius:99px;overflow:hidden}
    .bar-fill{height:100%;background:linear-gradient(90deg,#81A6C6,#AACDDC);border-radius:99px}
    .footer{text-align:center;font-size:0.72rem;color:#bbb;padding:2rem;border-top:1px solid #e0d5cc;margin-top:2rem}
    @media print{@page{margin:0}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <div class="cover">
    <div class="cover-logo">Blogify.</div>
    <div class="cover-badge">Admin Report</div>
    <div class="cover-title">Platform Insights${selectedMonth!=="all"?"<br/>"+selectedMonth:""}</div>
    <div class="cover-meta">Generated: ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})} &nbsp;|&nbsp; Period: ${selectedMonth!=="all"?selectedMonth:"All Time"}</div>
  </div>
  <div class="body">
    <div class="sec">Platform Overview</div>
    <div class="stats">
      <div class="sbox"><div class="sval">${readers.length}</div><div class="slabel">Readers</div></div>
      <div class="sbox"><div class="sval">${bloggers.length}</div><div class="slabel">Bloggers</div></div>
      <div class="sbox"><div class="sval">${monthBlogs.length}</div><div class="slabel">Blogs</div></div>
      <div class="sbox"><div class="sval">${totalViews.toLocaleString()}</div><div class="slabel">Total Views</div></div>
    </div>
    <div class="sec">Monthly Growth</div>
    <div class="mchart">
      ${analytics.map(d=>{const pct=Math.max(4,((d.totalViews||0)/maxMV)*100);return`<div class="mbar-wrap"><div class="mbar" style="height:${pct}%"></div><div class="mlabel">${(d.month||"").split(" ")[0]}</div></div>`;}).join("")}
    </div>
    <table><thead><tr><th>Month</th><th>New Readers</th><th>New Bloggers</th><th>New Blogs</th><th>Views</th></tr></thead>
    <tbody>${analytics.map(d=>`<tr><td><strong>${d.month}</strong></td><td>${d.newReaders||0}</td><td>${d.newBloggers||0}</td><td>${d.newBlogs||0}</td><td>${(d.totalViews||0).toLocaleString()}</td></tr>`).join("")}</tbody></table>
    <div class="sec">Content by Category</div>
    ${tagEntries.map(([tag,count])=>{const views=monthBlogs.filter(b=>b.tag===tag).reduce((s,b)=>s+(b.views||0),0);const pct=Math.round((count/maxTag)*100);return`<div class="bar-wrap"><div class="bar-label"><span><strong>${tag}</strong> — ${count} post${count!==1?"s":""}</span><span>${views.toLocaleString()} views</span></div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div></div>`;}).join("")}
    <div class="sec">Top Performing Blogs</div>
    <table><thead><tr><th>Title</th><th>Blogger</th><th>Category</th><th>Status</th><th>Views</th><th>Likes</th><th>Comments</th></tr></thead>
    <tbody>${[...monthBlogs].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,10).map(b=>`<tr><td><strong>${b.title}</strong></td><td>${b.authorName||"—"}</td><td>${b.tag||"—"}</td><td><span class="badge ${b.status||"draft"}">${b.status||"draft"}</span></td><td>${(b.views||0).toLocaleString()}</td><td>${b.likes||0}</td><td>${b.commentCount||0}</td></tr>`).join("")}</tbody></table>
    <div class="sec">Blogger Performance</div>
    <table><thead><tr><th>Blogger</th><th>Posts</th><th>Total Views</th><th>Joined</th><th>Status</th></tr></thead>
    <tbody>${[...bloggers].sort((a,b)=>(b.totalViews||0)-(a.totalViews||0)).map(b=>`<tr><td><strong>${b.displayName||b.name||"—"}</strong><br/><span style="font-size:0.75rem;color:#aaa">${b.email||""}</span></td><td>${b.totalPosts||0}</td><td>${(b.totalViews||0).toLocaleString()}</td><td>${b.joinedDate||"—"}</td><td><span class="badge ${b.status||"active"}">${b.status||"active"}</span></td></tr>`).join("")}</tbody></table>
    <div class="sec">Summary</div>
    <table>
      <tr><td><strong>Active Readers</strong></td><td>${readers.filter(r=>r.status==="active"||!r.status).length}</td></tr>
      <tr><td><strong>Suspended Readers</strong></td><td>${readers.filter(r=>r.status==="suspended").length}</td></tr>
      <tr><td><strong>Active Bloggers</strong></td><td>${bloggers.filter(b=>b.status==="active"||!b.status).length}</td></tr>
      <tr><td><strong>Published Blogs</strong></td><td>${monthBlogs.filter(b=>b.status==="published").length}</td></tr>
      <tr><td><strong>Draft Blogs</strong></td><td>${monthBlogs.filter(b=>b.status==="draft").length}</td></tr>
      <tr><td><strong>Total Likes</strong></td><td>${totalLikes.toLocaleString()}</td></tr>
      <tr><td><strong>Total Comments</strong></td><td>${totalComments.toLocaleString()}</td></tr>
      <tr><td><strong>Most Popular Category</strong></td><td>${tagEntries[0]?.[0]||"N/A"}</td></tr>
    </table>
  </div>
  <div class="footer">Blogify. Admin Portal &nbsp;|&nbsp; Period: ${selectedMonth!=="all"?selectedMonth:"All Time"} &nbsp;|&nbsp; ${new Date().toISOString().split("T")[0]}</div>
  <script>window.onload=function(){window.print()}</script>
  </body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url  = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export default function AdminInsights() {
  const { blogs, bloggers, readers, analytics, dataLoading } = useAdmin();
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [pdfLoading,    setPdfLoading]    = useState(false);

  // Build month options from analytics + from blog months
  const blogMonths  = [...new Set(blogs.map(b => b.month).filter(Boolean))].sort();
  const analyticsM  = analytics.map(d => d.month).filter(Boolean);
  const allMonths   = ["all", ...new Set([...analyticsM, ...blogMonths])].sort((a,b)=>a==="all"?-1:a.localeCompare(b));

  const monthBlogs  = selectedMonth === "all" ? blogs : blogs.filter(b => b.month === selectedMonth);
  const tagCounts   = monthBlogs.reduce((acc,b) => { acc[b.tag||"Other"]=(acc[b.tag||"Other"]||0)+1; return acc; }, {});
  const tagEntries  = Object.entries(tagCounts).sort((a,b) => b[1]-a[1]);
  const maxTag      = Math.max(...Object.values(tagCounts), 1);
  const tagViews    = monthBlogs.reduce((acc,b) => { acc[b.tag||"Other"]=(acc[b.tag||"Other"]||0)+(b.views||0); return acc; }, {});
  const maxTagViews = Math.max(...Object.values(tagViews), 1);
  const maxMV       = Math.max(...analytics.map(d=>d.totalViews||0), 1);

  const handlePDF = () => {
    setPdfLoading(true);
    setTimeout(() => { generatePDF(blogs, bloggers, readers, analytics, selectedMonth); setPdfLoading(false); }, 300);
  };

  return (
    <AdminLayout title="Insights">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');
        .ai-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.8rem;flex-wrap:wrap;gap:1rem}
        .ai-top h2{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:#e8e0d6;letter-spacing:-0.02em}
        .ai-top p{font-size:0.8rem;color:rgba(232,224,214,0.3);margin-top:0.2rem}
        .ai-controls{display:flex;align-items:center;gap:0.7rem;flex-wrap:wrap}
        .ai-month{background:rgba(255,255,255,0.03);border:1px solid rgba(129,166,198,0.15);border-radius:6px;padding:0.55rem 1rem;font-family:'DM Sans',sans-serif;font-size:0.84rem;color:#e8e0d6;outline:none;cursor:pointer;min-width:160px}
        .ai-month:focus{border-color:#81A6C6}
        .ai-pdf{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(243,227,208,0.1);border:1px solid rgba(243,227,208,0.2);border-radius:6px;padding:0.55rem 1.2rem;font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:500;color:#F3E3D0;cursor:pointer;transition:all 0.2s}
        .ai-pdf:hover{background:rgba(243,227,208,0.18)} .ai-pdf:disabled{opacity:0.5;cursor:not-allowed}
        .ai-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
        .ai-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem}
        .ai-card{background:#141e28;border:1px solid rgba(129,166,198,0.08);border-radius:10px;padding:1.5rem;margin-bottom:1rem}
        .ai-card-title{font-size:0.65rem;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:rgba(232,224,214,0.3);margin-bottom:1.3rem;display:flex;align-items:center;gap:0.5rem}
        .ai-badge{font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;background:rgba(129,166,198,0.1);color:#81A6C6;padding:0.15rem 0.45rem;border-radius:99px}
        .ai-chart{display:flex;align-items:flex-end;gap:0.4rem;height:130px;margin-bottom:0.8rem}
        .ai-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:0.3rem;height:100%;justify-content:flex-end}
        .ai-bar{width:100%;border-radius:3px 3px 0 0;transition:height 0.8s}
        .ai-bar-lbl{font-size:0.58rem;color:rgba(232,224,214,0.25);white-space:nowrap}
        .ai-trend{display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid rgba(129,166,198,0.05)}
        .ai-trend:last-child{border-bottom:none}
        .ai-trend-rank{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:rgba(129,166,198,0.2);width:28px;flex-shrink:0}
        .ai-trend-name{font-size:0.86rem;color:rgba(232,224,214,0.7)}
        .ai-trend-count{font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:700;color:#81A6C6}
        .ai-trend-sub{font-size:0.65rem;color:rgba(232,224,214,0.25);text-align:right}
        .ai-bar-wrap{margin-bottom:0.9rem}
        .ai-bar-label{display:flex;justify-content:space-between;font-size:0.76rem;color:rgba(232,224,214,0.5);margin-bottom:0.3rem}
        .ai-bar-track{height:6px;background:rgba(129,166,198,0.08);border-radius:99px;overflow:hidden}
        .ai-bar-fill{height:100%;border-radius:99px}
        .ai-tbl{width:100%;border-collapse:collapse}
        .ai-th{font-size:0.6rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(232,224,214,0.2);padding:0 0 0.7rem;text-align:left;border-bottom:1px solid rgba(129,166,198,0.06)}
        .ai-td{padding:0.75rem 0.5rem;font-size:0.82rem;color:rgba(232,224,214,0.6);border-bottom:1px solid rgba(129,166,198,0.04)}
        .ai-loading{text-align:center;padding:3rem;color:rgba(232,224,214,0.25);font-size:0.85rem}
        @media(max-width:900px){.ai-grid-2,.ai-grid-3{grid-template-columns:1fr}}
      `}</style>

      <div className="ai-top">
        <div>
          <h2>Insights</h2>
          <p>Platform-wide trends and analytics</p>
        </div>
        <div className="ai-controls">
          <select className="ai-month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {allMonths.map(m => <option key={m} value={m}>{m==="all"?"All Time":m}</option>)}
          </select>
          <button className="ai-pdf" onClick={handlePDF} disabled={pdfLoading || dataLoading}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="12" y2="18"/><polyline points="9 15 12 18 15 15"/></svg>
            {pdfLoading ? "Generating..." : `Download ${selectedMonth!=="all"?selectedMonth+" ":""}Report`}
          </button>
        </div>
      </div>

      {dataLoading ? (
        <div className="ai-loading">Loading insights...</div>
      ) : (
        <>
          {/* Monthly views chart */}
          <div className="ai-card">
            <div className="ai-card-title">
              Monthly Views
              {selectedMonth!=="all" && <span className="ai-badge">{selectedMonth}</span>}
            </div>
            {analytics.length > 0 ? (
              <>
                <div className="ai-chart">
                  {analytics.map((d, i) => (
                    <div key={i} className="ai-bar-col">
                      <div className="ai-bar" style={{
                        height: `${Math.max(4, ((d.totalViews||0)/maxMV)*100)}%`,
                        background: d.month===selectedMonth
                          ? `linear-gradient(180deg,${C.cream},${C.sand})`
                          : `linear-gradient(180deg,${C.blue},${C.sky})`,
                        opacity: selectedMonth!=="all" && d.month!==selectedMonth ? 0.25 : 1,
                      }} title={`${d.month}: ${(d.totalViews||0).toLocaleString()}`} />
                      <span className="ai-bar-lbl">{(d.month||"").split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
                  {analytics.map(d => (
                    <div key={d.month}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.95rem",fontWeight:"700",color:d.month===selectedMonth?C.cream:C.blue}}>
                        {(d.totalViews||0)>=1000?((d.totalViews||0)/1000).toFixed(1)+"k":(d.totalViews||0)}
                      </div>
                      <div style={{fontSize:"0.58rem",color:"rgba(232,224,214,0.25)"}}>{d.month}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{color:"rgba(232,224,214,0.2)",fontSize:"0.85rem"}}>No analytics data. Add documents to the <strong>analytics</strong> collection in Firestore.</div>
            )}
          </div>

          <div className="ai-grid-2">
            {/* Category by post count */}
            <div className="ai-card">
              <div className="ai-card-title">
                Trending Categories — Posts
                {selectedMonth!=="all"&&<span className="ai-badge">{selectedMonth}</span>}
              </div>
              {tagEntries.length===0 ? <div style={{color:"rgba(232,224,214,0.2)",fontSize:"0.85rem"}}>No data for this period.</div>
              : tagEntries.map(([tag,count],i) => (
                <div key={tag} className="ai-trend">
                  <div className="ai-trend-rank">0{i+1}</div>
                  <div style={{flex:1,margin:"0 0.8rem"}}>
                    <div className="ai-trend-name">{tag}</div>
                    <div className="ai-bar-wrap" style={{marginBottom:0,marginTop:"0.3rem"}}>
                      <div className="ai-bar-track">
                        <div className="ai-bar-fill" style={{width:`${(count/maxTag)*100}%`,background:`linear-gradient(90deg,${C.blue},${C.sky})`}} />
                      </div>
                    </div>
                  </div>
                  <div><div className="ai-trend-count">{count}</div><div className="ai-trend-sub">post{count!==1?"s":""}</div></div>
                </div>
              ))}
            </div>

            {/* Category by views */}
            <div className="ai-card">
              <div className="ai-card-title">
                Trending Categories — Views
                {selectedMonth!=="all"&&<span className="ai-badge">{selectedMonth}</span>}
              </div>
              {Object.keys(tagViews).length===0 ? <div style={{color:"rgba(232,224,214,0.2)",fontSize:"0.85rem"}}>No data for this period.</div>
              : Object.entries(tagViews).sort((a,b)=>b[1]-a[1]).map(([tag,views],i) => (
                <div key={tag} className="ai-trend">
                  <div className="ai-trend-rank">0{i+1}</div>
                  <div style={{flex:1,margin:"0 0.8rem"}}>
                    <div className="ai-trend-name">{tag}</div>
                    <div className="ai-bar-wrap" style={{marginBottom:0,marginTop:"0.3rem"}}>
                      <div className="ai-bar-track">
                        <div className="ai-bar-fill" style={{width:`${(views/maxTagViews)*100}%`,background:`linear-gradient(90deg,${C.sky},${C.sand})`}} />
                      </div>
                    </div>
                  </div>
                  <div><div className="ai-trend-count">{views>=1000?(views/1000).toFixed(1)+"k":views}</div><div className="ai-trend-sub">views</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly growth bars */}
          {analytics.length > 0 && (
            <div className="ai-grid-3">
              {[
                { title: "New Readers / Month", key: "newReaders", color: `${C.blue},${C.sky}` },
                { title: "New Bloggers / Month", key: "newBloggers", color: `${C.sky},${C.sand}` },
                { title: "New Blogs / Month",   key: "newBlogs",    color: `${C.sand},${C.cream}` },
              ].map(({ title, key, color }) => {
                const maxVal = Math.max(...analytics.map(d=>d[key]||0), 1);
                return (
                  <div key={key} className="ai-card">
                    <div className="ai-card-title">{title}</div>
                    {analytics.map(d => (
                      <div key={d.month} className="ai-bar-wrap">
                        <div className="ai-bar-label"><span>{d.month}</span><span>{d[key]||0}</span></div>
                        <div className="ai-bar-track">
                          <div className="ai-bar-fill" style={{ width:`${((d[key]||0)/maxVal)*100}%`, background:`linear-gradient(90deg,${color})` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Top blogs table */}
          <div className="ai-card">
            <div className="ai-card-title">
              Top Blogs by Views
              {selectedMonth!=="all"&&<span className="ai-badge">{selectedMonth}</span>}
            </div>
            {monthBlogs.length===0 ? (
              <div style={{color:"rgba(232,224,214,0.2)",fontSize:"0.85rem"}}>No blogs for this period.</div>
            ) : (
              <table className="ai-tbl">
                <thead>
                  <tr>
                    {["#","Title","Blogger","Category","Views","Likes","Comments"].map(h => (
                      <th key={h} className="ai-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...monthBlogs].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,8).map((b,i) => (
                    <tr key={b.id}>
                      <td className="ai-td" style={{color:"rgba(232,224,214,0.2)",fontSize:"0.75rem"}}>{String(i+1).padStart(2,"0")}</td>
                      <td className="ai-td" style={{maxWidth:"180px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"rgba(232,224,214,0.75)"}}>{b.title}</td>
                      <td className="ai-td" style={{color:"rgba(232,224,214,0.4)",whiteSpace:"nowrap"}}>{(b.authorName||"").split(" ")[0]}</td>
                      <td className="ai-td" style={{color:C.sky}}>{b.tag||"—"}</td>
                      <td className="ai-td" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",fontWeight:"700",color:C.blue}}>{(b.views||0).toLocaleString()}</td>
                      <td className="ai-td" style={{color:"rgba(232,224,214,0.4)"}}>{b.likes||0}</td>
                      <td className="ai-td" style={{color:"rgba(232,224,214,0.4)"}}>{b.commentCount||0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}