import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

const users = {

  // BLOGGERS
  uid_alex: {
    uid: "uid_alex",
    email: "blogger@blogify.com",
    displayName: "Alex Rivera",
    role: "blogger",
    avatar: "A",
    status: "active",
    createdAt: Timestamp.fromDate(new Date("2025-01-12")),
    month: "Jan 2025",
    joinedDate: "Jan 12, 2025",
    bio: "Product designer and writer focused on UI systems.",
    totalPosts: 5,
    totalViews: 10240,
    totalLikes: 854,
    articlesRead: 0,
    savedArticles: 0,
    savedArticleIds: []
  },

  uid_priya: {
    uid: "uid_priya",
    email: "priya@blogify.com",
    displayName: "Priya Nair",
    role: "blogger",
    avatar: "P",
    status: "active",
    createdAt: Timestamp.fromDate(new Date("2025-02-03")),
    month: "Feb 2025",
    joinedDate: "Feb 3, 2025",
    bio: "Science journalist and marine biologist.",
    totalPosts: 4,
    totalViews: 13770,
    totalLikes: 884,
    articlesRead: 0,
    savedArticles: 0,
    savedArticleIds: []
  },

  uid_leo: {
    uid: "uid_leo",
    email: "leo@blogify.com",
    displayName: "Leo Strand",
    role: "blogger",
    avatar: "L",
    status: "active",
    createdAt: Timestamp.fromDate(new Date("2025-02-18")),
    month: "Feb 2025",
    joinedDate: "Feb 18, 2025",
    bio: "Writes about literature and slow life.",
    totalPosts: 3,
    totalViews: 8080,
    totalLikes: 672,
    articlesRead: 0,
    savedArticles: 0,
    savedArticleIds: []
  },

  uid_sam: {
    uid: "uid_sam",
    email: "sam@blogify.com",
    displayName: "Sam Cho",
    role: "blogger",
    avatar: "S",
    status: "active",
    createdAt: Timestamp.fromDate(new Date("2025-03-05")),
    month: "Mar 2025",
    joinedDate: "Mar 5, 2025",
    bio: "Philosopher and UX writer.",
    totalPosts: 2,
    totalViews: 3840,
    totalLikes: 296,
    articlesRead: 0,
    savedArticles: 0,
    savedArticleIds: []
  },

  uid_nina: {
    uid: "uid_nina",
    email: "nina@blogify.com",
    displayName: "Nina Ross",
    role: "blogger",
    avatar: "N",
    status: "active",
    createdAt: Timestamp.fromDate(new Date("2025-03-20")),
    month: "Mar 2025",
    joinedDate: "Mar 20, 2025",
    bio: "Editorial designer.",
    totalPosts: 2,
    totalViews: 6620,
    totalLikes: 532,
    articlesRead: 0,
    savedArticles: 0,
    savedArticleIds: []
  },

  uid_dev: {
    uid: "uid_dev",
    email: "dev@blogify.com",
    displayName: "Dev Patel",
    role: "blogger",
    avatar: "D",
    status: "active",
    createdAt: Timestamp.fromDate(new Date("2025-04-08")),
    month: "Apr 2025",
    joinedDate: "Apr 8, 2025",
    bio: "Software engineer.",
    totalPosts: 1,
    totalViews: 1560,
    totalLikes: 112,
    articlesRead: 0,
    savedArticles: 0,
    savedArticleIds: []
  },

  uid_aiko: {
    uid: "uid_aiko",
    email: "aiko@blogify.com",
    displayName: "Aiko Tanaka",
    role: "blogger",
    avatar: "T",
    status: "suspended",
    createdAt: Timestamp.fromDate(new Date("2025-04-22")),
    month: "Apr 2025",
    joinedDate: "Apr 22, 2025",
    bio: "Travel writer.",
    totalPosts: 1,
    totalViews: 3120,
    totalLikes: 256,
    articlesRead: 0,
    savedArticles: 0,
    savedArticleIds: []
  },

  // ADMIN
  uid_admin: {
    uid: "uid_admin",
    email: "admin@blogify.com",
    displayName: "Blogify Admin",
    role: "admin",
    avatar: "A",
    status: "active",
    createdAt: Timestamp.fromDate(new Date("2025-01-01")),
    month: "Jan 2025",
    joinedDate: "Jan 1, 2025",
    bio: "",
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    articlesRead: 0,
    savedArticles: 0,
    savedArticleIds: []
  },

  // READERS
  uid_maya: {
    uid: "uid_maya",
    email: "maya@example.com",
    displayName: "Maya K.",
    role: "reader",
    avatar: "M",
    status: "active",
    createdAt: Timestamp.fromDate(new Date("2025-01-20")),
    month: "Jan 2025",
    joinedDate: "Jan 20, 2025",
    bio: "",
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    articlesRead: 48,
    savedArticles: 12,
    savedArticleIds: ["blog_001", "blog_006", "blog_009"]
  },

  uid_soren: {
    uid: "uid_soren",
    email: "soren@example.com",
    displayName: "Soren L.",
    role: "reader",
    avatar: "S",
    status: "active",
    createdAt: Timestamp.fromDate(new Date("2025-02-01")),
    month: "Feb 2025",
    joinedDate: "Feb 1, 2025",
    bio: "",
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    articlesRead: 32,
    savedArticles: 5,
    savedArticleIds: []
  },

  uid_nour: {
    uid: "uid_nour",
    email: "nour@example.com",
    displayName: "Nour A.",
    role: "reader",
    avatar: "N",
    status: "active",
    createdAt: Timestamp.fromDate(new Date("2025-02-10")),
    month: "Feb 2025",
    joinedDate: "Feb 10, 2025",
    bio: "",
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    articlesRead: 21,
    savedArticles: 3,
    savedArticleIds: []
  }

};

const seedUsers = async () => {
  try {
    for (const id in users) {
      await setDoc(doc(db, "users", id), users[id]);
    }
    console.log("✅ All users inserted!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

export default seedUsers;