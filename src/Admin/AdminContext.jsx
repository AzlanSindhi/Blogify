/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser, logoutUser, subscribeAuth, getUserProfile,
  getAllUsers, getAllBlogs, updateUserStatus, removeUser,
  adminDeleteBlog, getAnalytics,
} from "../services/firebaseService";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [readers,     setReaders]     = useState([]);
  const [bloggers,    setBloggers]    = useState([]);
  const [blogs,       setBlogs]       = useState([]);
  const [analytics,   setAnalytics]   = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAuth(async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile?.role === "admin") {
            setIsLoggedIn(true);
            _loadAllData();
          } else {
            setIsLoggedIn(false);
          }
        } catch {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const _loadAllData = async () => {
    setDataLoading(true);
    try {
      const [allUsers, allBlogs, allAnalytics] = await Promise.all([
        getAllUsers(),
        getAllBlogs(),
        getAnalytics(),
      ]);
      setReaders(allUsers.filter(u => u.role === "reader"));
      setBloggers(allUsers.filter(u => u.role === "blogger"));
      setBlogs(allBlogs);
      setAnalytics(allAnalytics);
    } catch (e) {
      console.error("Admin loadAllData:", e);
    }
    setDataLoading(false);
  };

  const login = async (email, password) => {
    const { profile } = await loginUser(email, password);
    if (profile?.role !== "admin") {
      await logoutUser();
      throw new Error("This account does not have admin access.");
    }
    setIsLoggedIn(true);
    await _loadAllData();
    return profile;
  };

  const logout = async () => {
    try { await logoutUser(); } catch (err) { console.error("Admin logout error:", err); }
    setIsLoggedIn(false);
    setReaders([]); setBloggers([]); setBlogs([]); setAnalytics([]);
  };

  // ── Readers ────────────────────────────────────────────────────────────────
  const toggleReaderStatus = async (uid) => {
    const reader    = readers.find(r => r.uid === uid);
    const newStatus = reader?.status === "active" ? "suspended" : "active";
    await updateUserStatus(uid, newStatus);
    setReaders(prev => prev.map(r => r.uid === uid ? { ...r, status: newStatus } : r));
  };

  const removeReader = async (uid) => {
    await removeUser(uid);
    setReaders(prev => prev.filter(r => r.uid !== uid));
  };

  const addReader = async (readerData) => {
    // Admin manually adding a reader creates a Firestore doc (no Auth account)
    const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    const { db } = await import("../firebase");
    const now = new Date();
    const ref = await addDoc(collection(db, "users"), {
      ...readerData,
      role:        "reader",
      status:      "active",
      createdAt:   serverTimestamp(),
      month:       now.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      joinedDate:  now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      articlesRead: 0,
      savedArticles: 0,
      savedArticleIds: [],
    });
    setReaders(prev => [...prev, { ...readerData, uid: ref.id, id: ref.id, status: "active" }]);
  };

  // ── Bloggers ───────────────────────────────────────────────────────────────
  const toggleBloggerStatus = async (uid) => {
    const blogger   = bloggers.find(b => b.uid === uid);
    const newStatus = blogger?.status === "active" ? "suspended" : "active";
    await updateUserStatus(uid, newStatus);
    setBloggers(prev => prev.map(b => b.uid === uid ? { ...b, status: newStatus } : b));
  };

  const removeBlogger = async (uid) => {
    await removeUser(uid);
    setBloggers(prev => prev.filter(b => b.uid !== uid));
  };

  // ── Blogs ──────────────────────────────────────────────────────────────────
  const removeBlog = async (id) => {
    await adminDeleteBlog(id);
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  return (
    <AdminContext.Provider value={{
      isLoggedIn, authLoading, dataLoading,
      readers, bloggers, blogs, analytics,
      login, logout,
      toggleReaderStatus, removeReader, addReader,
      toggleBloggerStatus, removeBlogger,
      removeBlog,
      refresh: _loadAllData,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);