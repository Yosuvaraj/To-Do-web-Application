# ✦ Taskr — Checklist Web Application

A sleek, production-ready **To-Do / Checklist app** built with React + Vite, backed by Supabase, and deployed on Netlify.

---

## 🚀 Live Demo

> **[https://taskr-app.netlify.app](https://taskr-app.netlify.app)**  
> *(Replace with your actual Netlify URL after deployment)*

---

## 🛠 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18 + Vite 5                 |
| Styling     | Pure CSS (custom properties, animations) |
| Database    | Supabase (PostgreSQL)             |
| Hosting     | Netlify                           |
| Fonts       | Syne + DM Sans (Google Fonts)     |

---

## ✨ Features

- **Multiple lists** — Create named checklists (e.g., "Daily Tasks", "Project Tasks")
- **Add tasks** — Type and press Enter or click Add
- **Toggle completion** — Click the circle checkbox to mark done/undone
- **Delete tasks** — Hover a task to reveal the trash icon
- **Filter view** — Switch between All / Pending / Completed tabs
- **Progress ring** — Visual % completion indicator per list
- **Persistent storage** — All data saved in Supabase (survives page refresh)
- **Responsive** — Works on desktop and mobile

---

## ⚙️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/taskr-checklist-app.git
cd taskr-checklist-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Open **SQL Editor** → paste the contents of [`supabase-schema.sql`](./supabase-schema.sql) → **Run**
3. Go to **Settings → API** and copy your **Project URL** and **anon public** key

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 🌐 Deploying to Netlify

### Option A — Netlify UI (drag & drop)

```bash
npm run build       # creates the /dist folder
```

Then drag the `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init        # follow prompts, build command: npm run build, publish dir: dist
netlify deploy --prod
```

### Option C — GitHub integration (recommended)

1. Push your repo to GitHub
2. On Netlify: **Add new site → Import from Git → GitHub**
3. Build command: `npm run build` | Publish directory: `dist`
4. Add environment variables in **Site Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy site**

The included `netlify.toml` handles SPA routing automatically.

---

## 🤖 AI Tools Used

This project was built with assistance from **Claude (Anthropic)** in the following ways:

| Area | AI Assistance |
|------|---------------|
| **App architecture** | Claude designed the component structure and Supabase data model (lists → items relationship with RLS policies) |
| **React logic** | Claude wrote the full CRUD logic — fetching, inserting, updating, and deleting records via the Supabase JS client |
| **UI/CSS design** | Claude generated the dark editorial aesthetic with custom CSS variables, grid background, progress ring SVG animation, and micro-interactions (slide-in animation, hover reveals) |
| **Supabase schema** | Claude authored the SQL schema including indexes and Row Level Security policies |
| **Deployment config** | Claude created `netlify.toml` for SPA redirect rules and the `.env.example` template |
| **README** | This README was structured and written with Claude's help |

**Workflow**: Requirements were fed to Claude, which produced the full codebase in one pass. The developer reviewed, tested locally, and deployed — demonstrating how AI tools dramatically accelerate shipping production-quality apps.

---

## 📁 Project Structure

```
taskr-checklist-app/
├── src/
│   ├── App.jsx          # Main component (all features)
│   ├── main.jsx         # React entry point
│   └── index.css        # All styles
├── index.html           # HTML shell
├── vite.config.js       # Vite configuration
├── netlify.toml         # Netlify SPA routing
├── supabase-schema.sql  # Database setup SQL
├── .env.example         # Environment variable template
├── .gitignore
└── package.json
```

---

## 📄 License

MIT — free to use and modify.
