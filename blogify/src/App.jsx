import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ── Reader Pages ─────────────────────────────────────────────── */
import Home    from "./Reader/home";
import Blogs   from "./Reader/blogs";
import About   from "./Reader/about";
import Login   from "./Reader/login";
import Signup  from "./Reader/signup";
import Read    from "./Reader/read";
import Contact from "./Reader/contact";

/* ── Blogger Module ───────────────────────────────────────────── */
import { BloggerProvider, useBlogger } from "./Blogger/BloggerContext";
import BloggerLogin  from "./Blogger/BloggerLogin";
import BloggerSignup from "./Blogger/BloggerSignup";
import Dashboard     from "./Blogger/Dashboard";
import BloggerBlogs  from "./Blogger/BloggerBlogs";
import BlogEditor    from "./Blogger/BlogEditor";

/* ── Admin Module ─────────────────────────────────────────────── */
import { AdminProvider, useAdmin } from "./Admin/AdminContext";
import AdminLogin     from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminReaders   from "./Admin/AdminReaders";
import AdminBloggers  from "./Admin/AdminBloggers";
import AdminBlogs     from "./Admin/AdminBlogs";
import AdminInsights  from "./Admin/AdminInsights";

/* ── Route guards ─────────────────────────────────────────────── */

// Shows a blank screen while Firebase auth state resolves (prevents flash redirect)
function BloggerAuthGate({ children }) {
  const { authLoading } = useBlogger();
  if (authLoading) return null;
  return children;
}

function ProtectedBlogger({ children }) {
  const { isLoggedIn, authLoading } = useBlogger();
  if (authLoading) return null;
  return isLoggedIn ? children : <Navigate to="/blogger/login" replace />;
}

function PublicBlogger({ children }) {
  const { isLoggedIn, authLoading } = useBlogger();
  if (authLoading) return null;
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
}

function ProtectedAdmin({ children }) {
  const { isLoggedIn, authLoading } = useAdmin();
  if (authLoading) return null;
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />;
}

/* ── App ──────────────────────────────────────────────────────── */
export default function App() {
  return (
    <AdminProvider>
      <BloggerProvider>
        <BrowserRouter>
          <Routes>

            {/* ── Reader (public) ─────────────────────────────── */}
            <Route path="/"         element={<Home />} />
            <Route path="/blogs"    element={<Blogs />} />
            <Route path="/about"    element={<About />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/signup"   element={<Signup />} />
            <Route path="/contact"  element={<Contact />} />
            <Route path="/read/:id" element={<Read />} />
            <Route path="/read"     element={<Read />} />

            {/* ── Blogger auth pages ──────────────────────────── */}
            <Route path="/blogger/login"
              element={<BloggerAuthGate><PublicBlogger><BloggerLogin /></PublicBlogger></BloggerAuthGate>} />
            <Route path="/blogger/signup"
              element={<BloggerAuthGate><PublicBlogger><BloggerSignup /></PublicBlogger></BloggerAuthGate>} />

            {/* ── Blogger protected pages ─────────────────────── */}
            <Route path="/dashboard"
              element={<ProtectedBlogger><Dashboard /></ProtectedBlogger>} />
            <Route path="/my-blogs"
              element={<ProtectedBlogger><BloggerBlogs /></ProtectedBlogger>} />
            <Route path="/editor"
              element={<ProtectedBlogger><BlogEditor /></ProtectedBlogger>} />
            <Route path="/editor/:id"
              element={<ProtectedBlogger><BlogEditor /></ProtectedBlogger>} />

            {/* ── Legacy blogger redirects ─────────────────────── */}
            <Route path="/blogger/dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/blogger/blogs"     element={<Navigate to="/my-blogs" replace />} />
            <Route path="/blogger/editor"    element={<Navigate to="/editor" replace />} />

            {/* ── Admin ───────────────────────────────────────── */}
            <Route path="/admin/login"     element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
            <Route path="/admin/readers"   element={<ProtectedAdmin><AdminReaders /></ProtectedAdmin>} />
            <Route path="/admin/bloggers"  element={<ProtectedAdmin><AdminBloggers /></ProtectedAdmin>} />
            <Route path="/admin/blogs"     element={<ProtectedAdmin><AdminBlogs /></ProtectedAdmin>} />
            <Route path="/admin/insights"  element={<ProtectedAdmin><AdminInsights /></ProtectedAdmin>} />

            {/* ── 404 ─────────────────────────────────────────── */}
            <Route path="*" element={
              <div style={{minHeight:"100vh",background:"#060f24",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#F6E7BC",fontFamily:"'DM Sans',sans-serif",gap:"1rem"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"4rem",fontWeight:"900"}}>404</div>
                <div style={{fontSize:"1rem",color:"rgba(246,231,188,0.5)"}}>Page not found</div>
                <a href="/" style={{color:"#0AC4E0",textDecoration:"none",fontSize:"0.9rem"}}>Return home</a>
              </div>
            } />

          </Routes>
        </BrowserRouter>
      </BloggerProvider>
    </AdminProvider>
  );
}