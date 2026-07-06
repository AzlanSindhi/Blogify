/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser, logoutUser, registerUser, subscribeAuth, getUserProfile,
  getBloggerBlogs, saveBlog as fbSaveBlog, deleteBlog as fbDeleteBlog,
} from "../services/firebaseService";

const BloggerContext = createContext(null);

export function BloggerProvider({ children }) {
  const [blogger,      setBlogger]      = useState(null);
  const [blogs,        setBlogs]        = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [authLoading,  setAuthLoading]  = useState(true);

  const _loadBlogs = async (uid) => {
    setBlogsLoading(true);
    try {
      const data = await getBloggerBlogs(uid);
      setBlogs(data);
    } catch (e) {
      console.error("loadBlogs:", e);
      setBlogs([]);
    }
    setBlogsLoading(false);
  };

  // Listen to Firebase Auth state on mount
  useEffect(() => {
    const unsub = subscribeAuth(async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile?.role === "blogger") {
            setBlogger(profile);
            _loadBlogs(fbUser.uid);
          } else {
            setBlogger(null);
          }
        } catch {
          setBlogger(null);
        }
      } else {
        setBlogger(null);
        setBlogs([]);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    const { user, profile } = await loginUser(email, password);
    if (profile?.role !== "blogger") {
      await logoutUser();
      throw new Error("This account is not registered as a blogger. Use /blogger/signup to create one.");
    }
    setBlogger(profile);
    await _loadBlogs(user.uid);
    return profile;
  };

  const signup = async (email, password, displayName) => {
    const user    = await registerUser({ email, password, displayName, role: "blogger" });
    const profile = await getUserProfile(user.uid);
    setBlogger(profile);
    setBlogs([]);
    return profile;
  };

  const logout = async () => {
    try { await logoutUser(); } catch (err) { console.error("Blogger logout error:", err); }
    setBlogger(null);
    setBlogs([]);
  };

  const saveBlog = async (blogData) => {
    if (!blogger) throw new Error("Not logged in");
    const id = await fbSaveBlog(blogData, blogger);
    await _loadBlogs(blogger.uid);
    return id;
  };

  const deleteBlog = async (blogId) => {
    if (!blogger) throw new Error("Not logged in");
    await fbDeleteBlog(blogId, blogger.uid);
    setBlogs(prev => prev.filter(b => b.id !== blogId));
  };

  return (
    <BloggerContext.Provider value={{
      isLoggedIn:   !!blogger,
      blogger,
      blogs,
      blogsLoading,
      authLoading,
      login,
      signup,
      logout,
      saveBlog,
      deleteBlog,
      refreshBlogs: () => blogger && _loadBlogs(blogger.uid),
    }}>
      {children}
    </BloggerContext.Provider>
  );
}

export const useBlogger = () => useContext(BloggerContext);