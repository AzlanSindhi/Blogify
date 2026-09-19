<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# Blogify — Premium Multi-Module Blogging Platform

## Overview
**Blogify** is a sleek, modern, and highly structured multi-module blogging platform designed for rich storytelling and robust platform moderation. Powered by **React**, **Vite**, and **Firebase**, Blogify caters to three distinct user groups — readers, content creators (bloggers), and administrators — each equipped with a customized user interface and specialized dashboards. The platform incorporates premium, custom-tailored aesthetics with glassmorphic elements, smooth micro-animations, and structured data views.

---

## Features

### 1. Reader Module
* **Discover Content**: Responsive grid listings with categories, reading times, publication dates, and search/filter controls.
* **Immersive Reading**: Scroll-linked read progress indicators, rich article layouts, like counters, and seamless social sharing capabilities.
* **Real-time Comments**: Live comment threads with real-time Firestore synchronization, support for anonymous commenter naming, and individual comment likes.
* **Reading List**: Save and bookmark articles for offline tracking (for registered readers).

### 2. Blogger Module
* **Analytics Dashboard**: View publication stats at a glance, including total views, likes, comments, and monthly performance charts.
* **Medium-style Editor**: Contenteditable visual text editor supporting bold, italic, underline, list formatting, quote inserts, links, and inline image uploads.
* **Dynamic Post Management**: Create, edit, save draft, publish, and delete blog posts with dynamic word counters and computed read-time feedback.

### 3. Administrator Module
* **Unified Admin Panel**: Overview stats showing total registered readers, active bloggers, published posts, and pageview counts.
* **Monthly Growth Insights**: Growth charts illustrating monthly traffic and subscriber acquisition.
* **Content Management**: Complete control over articles (approve, reject, or delete blogs) and users (suspend or restore reader/blogger credentials).
* **PDF Report Generation**: Download period-filtered system audit reports formatted as styled print/PDF sheets.

---

## Tech Stack
* **Frontend Library**: React 19.x (Functional Components, Custom Contexts, Hooks)
* **Build Tool & Bundler**: Vite 8.x (Hot Module Replacement)
* **Styling**: Vanilla CSS (Harmonious customized HSL color palette, dark glassmorphism, responsive grid layouts)
* **Backend Database & Auth**: Firebase v12 (Firestore Realtime Databases, Firebase Authentication)
* **Notifications & Mailers**: @emailjs/browser (Contact form submission alerts)
* **Routing**: React Router v7

---

## Dataset
Blogify relies on three primary document collections in Firestore:
1. **`users`**: Manages auth profiles, role definitions (`reader`, `blogger`, `admin`), active status (`active`, `suspended`), total posts, views, and bookmarked article list.
2. **`blogs`**: Contains the articles, post titles, tags, content (HTML markup), view counters, list of user UIDs who liked the post, excerpt descriptions, and author references.
3. **`analytics`**: Logs monthly system traffic, including views, newly registered readers, bloggers, and new post counts.

---

## Installation

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your machine.

### Installation Steps
1. Clone the repository and navigate to the project directory:
   ```bash
   cd c:/Users/Azlan/Desktop/Projects/Blogify/blogify
   ```
2. Install all required package dependencies:
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```

---

## Usage

### User Roles & Navigation
* **Reader Access**: Browse freely at `/`. Register and sign in as a reader via `/signup` and `/login`.
* **Blogger Portal**: Create a blogger account at `/blogger/signup` and sign in at `/blogger/login` to access the Blogger Dashboard (`/dashboard`).
* **Admin Portal**: Sign in as an administrator at `/admin/login` using admin credentials to open the Admin Dashboard (`/admin/dashboard`).

---

## Results
* **Bug Fixes**: Resolved critical route interpolation bugs in Blogger lists where clicked links navigated to hardcoded string values instead of dynamic database IDs.
* **Compile & Lint Correctness**: Eliminated temporal dead-zone declaration ordering issues, missing React Hook dependency array items, unused variables, and empty catch-blocks.
* **Responsive Styling**: Standardized design across reader grids, blogger panels, and PDF charts to adapt perfectly to mobile viewports.

---

## Screenshots
Below is the architectural representation of Blogify's interface flow:

```
+-----------------------------------------------------------------+
|                       Blogify Reader Portal                     |
|  [Home]   [Blogs]   [About]   [Contact]             [Sign In]   |
+-----------------------------------------------------------------+
|                                                                 |
|   +-------------------+  +-------------------+                  |
|   |  Featured Blog    |  |  Category Cloud   |                  |
|   |                   |  |  [Design] [UX]    |                  |
|   +-------------------+  +-------------------+                  |
|                                                                 |
+-----------------------------------------------------------------+
```

*(Mockups and UI screenshots can be added here or generated as production assets)*

---

## Future Improvements
* **Rich Markdown Support**: Transition from HTML contenteditable inputs to a markdown-editor.
* **Storage Uploads**: Wire up Firebase Storage to allow users to directly upload and crop blogger profile avatars and cover header images.
* **Newsletter Dispatch**: Automate monthly newsletter delivery using cloud functions triggered by new published articles.

---

## Author
Developed and maintained by **Azlan**.
>>>>>>> 3c13b0708a4f5ceeba906883d70dc19f2d9c8512
