import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

const blogId = "blog_006"; // 🔥 change if needed

const comments = {
  cmt_001: {
    id: "cmt_001",
    authorName: "Maya K.",
    authorInitial: "M",
    authorId: "uid_maya",
    text: "This is one of the most lucid pieces I have read.",
    createdAt: Timestamp.fromDate(new Date("2025-06-15T11:00:00")),
    timeDisplay: "2 hours ago",
    likes: 14,
    likedBy: []
  },

  cmt_002: {
    id: "cmt_002",
    authorName: "Soren D.",
    authorInitial: "S",
    authorId: "uid_soren",
    text: "Weiser's quote feels prophetic now.",
    createdAt: Timestamp.fromDate(new Date("2025-06-15T08:00:00")),
    timeDisplay: "5 hours ago",
    likes: 9,
    likedBy: []
  },

  cmt_003: {
    id: "cmt_003",
    authorName: "Nour A.",
    authorInitial: "N",
    authorId: "uid_nour",
    text: "Interesting perspective on friction vs design.",
    createdAt: Timestamp.fromDate(new Date("2025-06-14T09:00:00")),
    timeDisplay: "1 day ago",
    likes: 22,
    likedBy: []
  }
};

const seedComments = async () => {
  try {
    for (const id in comments) {
      await setDoc(
        doc(db, "blogs", blogId, "comments", id),
        comments[id]
      );
    }
    console.log("✅ Comments inserted!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

export default seedComments;