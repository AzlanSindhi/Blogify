import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

const blogs = {
  blog_004: {
  id: "blog_004",
  title: "Writing for the Web: Clarity Over Cleverness",
  excerpt: "Why clear, direct prose outperforms witty copy.",
  content: "<h2>The Problem with Clever</h2><p>Clear writing wins...</p>",
  tag: "Writing",
  status: "published",
  authorId: "uid_alex",
  authorName: "Alex Rivera",
  authorAvatar: "A",
  createdAt: Timestamp.fromDate(new Date("2025-05-28")),
  updatedAt: Timestamp.fromDate(new Date("2025-05-28")),
  readTime: "4 min",
  views: 1890,
  likes: 143,
  likedBy: []
},

blog_005: {
  id: "blog_005",
  title: "Microinteractions: The Small Details That Matter",
  excerpt: "Small UI details improve experience.",
  content: "<h2>Microinteractions</h2><p>Small things matter...</p>",
  tag: "UX",
  status: "published",
  authorId: "uid_alex",
  authorName: "Alex Rivera",
  authorAvatar: "A",
  createdAt: Timestamp.fromDate(new Date("2025-05-20")),
  updatedAt: Timestamp.fromDate(new Date("2025-05-20")),
  readTime: "5 min",
  views: 2750,
  likes: 231,
  likedBy: []
},

blog_006: {
  id: "blog_006",
  title: "The Quiet Revolution of Ambient Computing",
  excerpt: "Invisible interfaces are changing interaction.",
  content: "<h2>Ambient Computing</h2><p>Interfaces are disappearing...</p>",
  tag: "Technology",
  status: "published",
  authorId: "uid_priya",
  authorName: "Priya Nair",
  authorAvatar: "P",
  createdAt: Timestamp.fromDate(new Date("2025-06-12")),
  updatedAt: Timestamp.fromDate(new Date("2025-06-12")),
  readTime: "6 min",
  views: 4120,
  likes: 382,
  likedBy: []
},

blog_007: {
  id: "blog_007",
  title: "Why the Ocean Thinks Differently Than Us",
  excerpt: "Distributed intelligence in marine life.",
  content: "<h2>Ocean Intelligence</h2><p>Octopus has multiple brains...</p>",
  tag: "Science",
  status: "published",
  authorId: "uid_priya",
  authorName: "Priya Nair",
  authorAvatar: "P",
  createdAt: Timestamp.fromDate(new Date("2025-06-07")),
  updatedAt: Timestamp.fromDate(new Date("2025-06-07")),
  readTime: "5 min",
  views: 3890,
  likes: 304,
  likedBy: []
},

blog_008: {
  id: "blog_008",
  title: "Plants Are Talking — We Are Finally Listening",
  excerpt: "Plants communicate chemically.",
  content: "<h2>Plant Communication</h2><p>Plants signal each other...</p>",
  tag: "Science",
  status: "published",
  authorId: "uid_priya",
  authorName: "Priya Nair",
  authorAvatar: "P",
  createdAt: Timestamp.fromDate(new Date("2025-05-27")),
  updatedAt: Timestamp.fromDate(new Date("2025-05-27")),
  readTime: "5 min",
  views: 2640,
  likes: 198,
  likedBy: []
},

blog_009: {
  id: "blog_009",
  title: "Reading in the Age of Distraction",
  excerpt: "Deep reading still exists.",
  content: "<h2>Reading</h2><p>Attention can be rebuilt...</p>",
  tag: "Culture",
  status: "published",
  authorId: "uid_leo",
  authorName: "Leo Strand",
  authorAvatar: "L",
  createdAt: Timestamp.fromDate(new Date("2025-06-09")),
  updatedAt: Timestamp.fromDate(new Date("2025-06-09")),
  readTime: "8 min",
  views: 3210,
  likes: 276,
  likedBy: []
},

blog_010: {
  id: "blog_010",
  title: "The Slow Comeback of the Handwritten Letter",
  excerpt: "Letters are returning.",
  content: "<h2>Letters</h2><p>Writing is becoming meaningful again...</p>",
  tag: "Culture",
  status: "published",
  authorId: "uid_leo",
  authorName: "Leo Strand",
  authorAvatar: "L",
  createdAt: Timestamp.fromDate(new Date("2025-05-25")),
  updatedAt: Timestamp.fromDate(new Date("2025-05-25")),
  readTime: "4 min",
  views: 1980,
  likes: 155,
  likedBy: []
},blog_011: {
  id: "blog_011",
  title: "Cities That Smell Like Memory",
  excerpt: "Memory is tied to smell.",
  content: "<h2>Smell</h2><p>Cities are remembered through scent...</p>",
  tag: "Travel",
  status: "published",
  authorId: "uid_leo",
  authorName: "Leo Strand",
  authorAvatar: "L",
  createdAt: Timestamp.fromDate(new Date("2025-05-18")),
  updatedAt: Timestamp.fromDate(new Date("2025-05-18")),
  readTime: "6 min",
  views: 2890,
  likes: 241,
  likedBy: []
},

blog_012: {
  id: "blog_012",
  title: "Boredom as a Creative Technology",
  excerpt: "Boredom fuels creativity.",
  content: "<h2>Boredom</h2><p>Doing nothing helps thinking...</p>",
  tag: "Philosophy",
  status: "published",
  authorId: "uid_sam",
  authorName: "Sam Cho",
  authorAvatar: "S",
  createdAt: Timestamp.fromDate(new Date("2025-06-03")),
  updatedAt: Timestamp.fromDate(new Date("2025-06-03")),
  readTime: "6 min",
  views: 1740,
  likes: 129,
  likedBy: []
},

blog_013: {
  id: "blog_013",
  title: "The Ethics of Attention",
  excerpt: "Attention is a moral choice.",
  content: "<h2>Attention</h2><p>Where you focus matters...</p>",
  tag: "Philosophy",
  status: "published",
  authorId: "uid_sam",
  authorName: "Sam Cho",
  authorAvatar: "S",
  createdAt: Timestamp.fromDate(new Date("2025-05-22")),
  updatedAt: Timestamp.fromDate(new Date("2025-05-22")),
  readTime: "7 min",
  views: 2100,
  likes: 167,
  likedBy: []
},

blog_014: {
  id: "blog_014",
  title: "Brutalism Is Back and It Is Beautiful",
  excerpt: "Raw design aesthetics are back.",
  content: "<h2>Brutalism</h2><p>Design without decoration...</p>",
  tag: "Design",
  status: "published",
  authorId: "uid_nina",
  authorName: "Nina Ross",
  authorAvatar: "N",
  createdAt: Timestamp.fromDate(new Date("2025-06-05")),
  updatedAt: Timestamp.fromDate(new Date("2025-06-05")),
  readTime: "4 min",
  views: 3650,
  likes: 298,
  likedBy: []
},

blog_015: {
  id: "blog_015",
  title: "When White Space Speaks Louder Than Words",
  excerpt: "Negative space is powerful.",
  content: "<h2>White Space</h2><p>Silence in design matters...</p>",
  tag: "Design",
  status: "published",
  authorId: "uid_nina",
  authorName: "Nina Ross",
  authorAvatar: "N",
  createdAt: Timestamp.fromDate(new Date("2025-04-28")),
  updatedAt: Timestamp.fromDate(new Date("2025-04-28")),
  readTime: "5 min",
  views: 2970,
  likes: 234,
  likedBy: []
},

blog_016: {
  id: "blog_016",
  title: "Latency is a Feeling",
  excerpt: "Performance affects emotions.",
  content: "<h2>Latency</h2><p>Speed impacts experience...</p>",
  tag: "Technology",
  status: "published",
  authorId: "uid_dev",
  authorName: "Dev Patel",
  authorAvatar: "D",
  createdAt: Timestamp.fromDate(new Date("2025-06-01")),
  updatedAt: Timestamp.fromDate(new Date("2025-06-01")),
  readTime: "3 min",
  views: 1560,
  likes: 112,
  likedBy: []
},

blog_017: {
  id: "blog_017",
  title: "The Topography of Silence",
  excerpt: "Exploring quiet places.",
  content: "<h2>Silence</h2><p>Quiet spaces reveal self...</p>",
  tag: "Travel",
  status: "published",
  authorId: "uid_aiko",
  authorName: "Aiko Tanaka",
  authorAvatar: "T",
  createdAt: Timestamp.fromDate(new Date("2025-05-18")),
  updatedAt: Timestamp.fromDate(new Date("2025-05-18")),
  readTime: "9 min",
  views: 3120,
  likes: 256,
  likedBy: []
},

blog_018: {
  id: "blog_018",
  title: "Science of Deep Sleep",
  excerpt: "Sleep affects brain health.",
  content: "<h2>Sleep</h2><p>Brain cleans itself during sleep...</p>",
  tag: "Science",
  status: "draft",
  authorId: "uid_priya",
  authorName: "Priya Nair",
  authorAvatar: "P",
  createdAt: Timestamp.fromDate(new Date("2025-04-15")),
  updatedAt: Timestamp.fromDate(new Date("2025-04-15")),
  readTime: "7 min",
  views: 0,
  likes: 0,
  likedBy: []
}
  
};

const seedBlogs = async () => {
  try {
    for (const id in blogs) {
      await setDoc(doc(db, "blogs", id), blogs[id]);
    }
    console.log("✅ Blogs inserted!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

export default seedBlogs;