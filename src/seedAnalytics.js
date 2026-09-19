import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const analytics = {
  "2025-01": {
    month: "Jan 2025",
    newReaders: 2,
    newBloggers: 1,
    newBlogs: 0,
    totalViews: 0,
    tagBreakdown: {}
  },

  "2025-02": {
    month: "Feb 2025",
    newReaders: 2,
    newBloggers: 2,
    newBlogs: 0,
    totalViews: 1200,
    tagBreakdown: {}
  },

  "2025-03": {
    month: "Mar 2025",
    newReaders: 2,
    newBloggers: 2,
    newBlogs: 0,
    totalViews: 3400,
    tagBreakdown: {}
  },

  "2025-04": {
    month: "Apr 2025",
    newReaders: 2,
    newBloggers: 2,
    newBlogs: 3,
    totalViews: 8900,
    tagBreakdown: { Design: 2, Science: 1 }
  },

  "2025-05": {
    month: "May 2025",
    newReaders: 2,
    newBloggers: 0,
    newBlogs: 7,
    totalViews: 19270,
    tagBreakdown: {
      UX: 1,
      Writing: 1,
      Science: 2,
      Culture: 2,
      Travel: 1
    }
  },

  "2025-06": {
    month: "Jun 2025",
    newReaders: 2,
    newBloggers: 0,
    newBlogs: 8,
    totalViews: 23870,
    tagBreakdown: {
      Design: 3,
      Technology: 2,
      Culture: 1,
      Philosophy: 1,
      Science: 1
    }
  }
};

const seedAnalytics = async () => {
  try {
    for (const id in analytics) {
      await setDoc(doc(db, "analytics", id), analytics[id]);
    }
    console.log("✅ Analytics inserted!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

export default seedAnalytics;