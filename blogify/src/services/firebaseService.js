// src/services/firebaseService.js
// Central Firebase service for all three modules.

import {
  collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot, increment, arrayUnion, arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "../firebase";

// ── helpers ──────────────────────────────────────────────────────────────────
const toData = (snap) => ({ id: snap.id, ...snap.data() });

// ── AUTH ─────────────────────────────────────────────────────────────────────

export const registerUser = async ({ email, password, displayName, role }) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid  = cred.user.uid;
  const now  = new Date();
  await setDoc(doc(db, "users", uid), {
    uid, email, displayName, role,
    name:   displayName,          // keep both for compatibility
    avatar: displayName[0].toUpperCase(),
    status: "active",
    createdAt:   serverTimestamp(),
    month:       now.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    joinedDate:  now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    bio: "", totalPosts: 0, totalViews: 0, totalLikes: 0,
    articlesRead: 0, savedArticles: 0, savedArticleIds: [],
  });
  return cred.user;
};

export const loginUser = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  const profile = snap.exists() ? snap.data() : null;
  return { user: cred.user, profile };
};

export const logoutUser  = () => signOut(auth);
export const subscribeAuth = (cb) => onAuthStateChanged(auth, cb);

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// ── BLOGS — public reader ──────────────────────────────────────────────────

export const getPublishedBlogs = async () => {
  // Try the ordered query first; if the composite index doesn't exist yet,
  // fall back to a simple collection fetch and sort in JS.
  try {
    const q    = query(collection(db, "blogs"), where("status", "==", "published"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(toData);
  } catch (e) {
    console.warn("Firestore index not ready, sorting client-side:", e);
    // Firestore index not yet built — fetch all and filter in JS
    const snap = await getDocs(collection(db, "blogs"));
    return snap.docs
      .map(toData)
      .filter(b => b.status === "published")
      .sort((a, b) => {
        const ta = a.createdAt?.seconds || 0;
        const tb = b.createdAt?.seconds || 0;
        return tb - ta;
      });
  }
};

export const getBlogById = async (id) => {
  const ref  = doc(db, "blogs", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  // Increment view count — fire-and-forget, don't block render
  updateDoc(ref, { views: increment(1) }).catch(() => {});
  return toData(snap);
};

export const toggleBlogLike = async (blogId, uid) => {
  const ref  = doc(db, "blogs", blogId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  const liked = (snap.data().likedBy || []).includes(uid);
  await updateDoc(ref, {
    likes:   increment(liked ? -1 : 1),
    likedBy: liked ? arrayRemove(uid) : arrayUnion(uid),
  });
  return !liked;
};

// ── COMMENTS ─────────────────────────────────────────────────────────────────

export const subscribeComments = (blogId, callback) => {
  const q = query(
    collection(db, "blogs", blogId, "comments"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q,
    snap => callback(snap.docs.map(toData)),
    // If index missing, fall back to unordered
    () => {
      const q2 = collection(db, "blogs", blogId, "comments");
      return onSnapshot(q2, snap => {
        const sorted = snap.docs.map(toData).sort((a, b) => {
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        });
        callback(sorted);
      });
    }
  );
};

export const addComment = async (blogId, { authorName, authorId, text }) => {
  const ref = await addDoc(collection(db, "blogs", blogId, "comments"), {
    authorName,
    authorInitial: (authorName || "A")[0].toUpperCase(),
    authorId: authorId || null,
    text,
    createdAt:   serverTimestamp(),
    timeDisplay: "Just now",
    likes: 0,
    likedBy: [],
  });
  updateDoc(doc(db, "blogs", blogId), { commentCount: increment(1) }).catch(() => {});
  return ref.id;
};

export const toggleCommentLike = async (blogId, commentId, uid) => {
  const ref  = doc(db, "blogs", blogId, "comments", commentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const liked = (snap.data().likedBy || []).includes(uid);
  await updateDoc(ref, {
    likes:   increment(liked ? -1 : 1),
    likedBy: liked ? arrayRemove(uid) : arrayUnion(uid),
  });
};

// ── BLOGGER ───────────────────────────────────────────────────────────────────

export const getBloggerBlogs = async (authorId) => {
  try {
    const q    = query(collection(db, "blogs"), where("authorId", "==", authorId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(toData);
  } catch {
    const snap = await getDocs(query(collection(db, "blogs"), where("authorId", "==", authorId)));
    return snap.docs.map(toData).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }
};

export const saveBlog = async (blogData, authorProfile) => {
  const { id, ...data } = blogData;
  const payload = {
    ...data,
    authorId:    authorProfile.uid,
    authorName:  authorProfile.displayName || authorProfile.name || "Blogger",
    authorAvatar: authorProfile.avatar || (authorProfile.displayName || "B")[0].toUpperCase(),
    authorBio:   authorProfile.bio || "",
    updatedAt:   serverTimestamp(),
  };
  if (id) {
    await updateDoc(doc(db, "blogs", id), payload);
    return id;
  }
  const now = new Date();
  const ref = await addDoc(collection(db, "blogs"), {
    ...payload,
    views: 0, likes: 0, likedBy: [], commentCount: 0,
    createdAt: serverTimestamp(),
    date:  now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    month: now.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  });
  updateDoc(doc(db, "users", authorProfile.uid), { totalPosts: increment(1) }).catch(() => {});
  return ref.id;
};

export const deleteBlog = async (blogId, authorId) => {
  await deleteDoc(doc(db, "blogs", blogId));
  if (authorId) updateDoc(doc(db, "users", authorId), { totalPosts: increment(-1) }).catch(() => {});
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

export const getAllUsers = async (role) => {
  try {
    const q    = role
      ? query(collection(db, "users"), where("role", "==", role), orderBy("createdAt", "desc"))
      : query(collection(db, "users"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(toData);
  } catch {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(toData)
      .filter(u => !role || u.role === role)
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }
};

export const getAllBlogs = async () => {
  try {
    const q    = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(toData);
  } catch {
    const snap = await getDocs(collection(db, "blogs"));
    return snap.docs.map(toData).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }
};

export const updateUserStatus  = async (uid, status) => updateDoc(doc(db, "users", uid), { status });
export const removeUser        = async (uid)         => deleteDoc(doc(db, "users", uid));
export const adminDeleteBlog   = async (id)          => deleteDoc(doc(db, "blogs", id));

export const getAnalytics = async () => {
  try {
    const snap = await getDocs(query(collection(db, "analytics"), orderBy("month")));
    return snap.docs.map(toData);
  } catch {
    const snap = await getDocs(collection(db, "analytics"));
    return snap.docs.map(toData).sort((a, b) => a.month?.localeCompare(b.month || "") || 0);
  }
};

// ── CONTACT ───────────────────────────────────────────────────────────────────

export const saveContactMessage = async ({ name, email, subject, message }) => {
  await addDoc(collection(db, "contact_messages"), {
    name, email, subject, message,
    submittedAt: serverTimestamp(),
    read: false,
  });
};

// ── SAVED ARTICLES ────────────────────────────────────────────────────────────

export const toggleSavedArticle = async (uid, blogId) => {
  const ref  = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  const saved = (snap.data().savedArticleIds || []).includes(blogId);
  await updateDoc(ref, {
    savedArticleIds: saved ? arrayRemove(blogId) : arrayUnion(blogId),
    savedArticles:   increment(saved ? -1 : 1),
  });
  return !saved;
};