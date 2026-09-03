# System Context & Architecture Specification: Interactive Portfolio & AI Assistant
> **Master Specification:** This document reflects the complete, actual architecture and deployment implementation for Dương Đoàn Thuận's Portfolio website and its integrated Cloudflare Worker AI Assistant.

---

## 1. Project Overview

- **Owner:** Dương Đoàn Thuận (GitHub: [@ayana0409](https://github.com/ayana0409))
- **Role:** Backend Developer (C#, .NET)
- **Live Frontend URL:** `https://ayana0409.github.io/portfolio/`
- **Live AI Worker API:** `https://portfolio-gemini-worker.ayana0409-porfolio.workers.dev/api/chat`
- **Core Concept:** A high-performance, dark-themed interactive portfolio featuring 3D project flipbook showcase, career experience deep-dive drawer, and an Edge-powered Gemini AI assistant.
- **Frontend Stack:** React 19, Vite 6, Tailwind CSS 3, GSAP, react-pageflip, react-i18next
- **Backend / Edge Stack:** Cloudflare Workers (ES Modules), Google Gemini AI REST API
- **Deployment:** GitHub Pages (Frontend via GitHub Actions) + Cloudflare Edge (Backend)

---

## 2. System Architecture Diagram

```mermaid
graph TD
    User([Visitor / Recruiter]) -->|Browse Portfolio| GH_Pages[GitHub Pages Frontend<br/>https://ayana0409.github.io/portfolio/]
    User -->|Chat with AI| ChatBot[React ChatBot Widget<br/>src/features/chat/ChatBot.jsx]
    
    ChatBot -->|POST /api/chat<br/>CORS Restricted| CF_Worker[Cloudflare Worker Edge<br/>portfolio-gemini-worker]
    
    CF_Worker -->|1. Fetch Dynamic Data<br/>5-min Edge Cache| GH_Raw[(GitHub Raw<br/>portfolioData.json)]
    CF_Worker -->|2. Secure REST API Call<br/>Encrypted Secret Key| Gemini_API[Google Gemini AI API<br/>gemini-1.5-flash / flash-lite]
    
    Gemini_API -->|Grounded AI Response| CF_Worker
    CF_Worker -->|JSON { reply }| ChatBot
```

---

## 3. Frontend Architecture

### 3.1. Directory Structure
```text
Portfolio/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions CI/CD for GitHub Pages
├── public/                     # Static public assets, favicon, i18n
├── src/
│   ├── assets/                 # Project & experience showcase images
│   ├── components/
│   │   ├── common/             # Header, Footer, LanguageToggle, ThemeToggle
│   │   └── layouts/            # MainLayout (with useScrollSnap)
│   ├── data/
│   │   └── portfolioData.json  # Master single-source-of-truth data
│   ├── features/
│   │   ├── hero/               # Cinematic SpaceX Hero banner
│   │   ├── about/              # Narrative biography & key metrics
│   │   ├── skills/             # Categorized skills matrix
│   │   ├── experience/         # Career timeline with deep-dive drawer
│   │   ├── projects/           # 3D interactive flipbook (react-pageflip)
│   │   ├── contact/            # Direct contact & social connections
│   │   └── chat/               # Floating AI ChatBot Assistant (ChatBot.jsx)
│   ├── hooks/                  # Custom React hooks (useScrollSnap)
│   ├── i18n/                   # react-i18next bilingual configuration (vi / en)
│   ├── App.jsx                 # Main application assembler
│   └── main.jsx                # React root entry point
├── worker/                     # Cloudflare Worker Edge Backend
│   ├── src/
│   │   └── index.js            # Worker entry point & API proxy
│   ├── wrangler.toml           # Cloudflare deployment configuration
│   ├── README.md               # Worker setup & deployment guide
│   ├── .dev.vars.example       # Local development environment sample
│   └── .dev.vars               # Local secret variables (git-ignored)
├── vite.config.js              # Vite config (base: '/portfolio/')
├── package.json                # Consolidated monorepo package scripts
└── Portfolio_Architecture_Spec.md
```

### 3.2. Design System: Slate & Blue Tech Theme
The UI uses an opinionated, high-contrast dark palette tailored for backend engineers:

- **Background (Main):** `bg-slate-950` (#020617) — *Deep obsidian slate*
- **Background (Cards & Containers):** `bg-slate-900/90` (#0f172a) with `backdrop-blur-xl`
- **Text (Primary):** `text-slate-100` (#f8fafc)
- **Text (Muted/Secondary):** `text-slate-400` (#94a3b8)
- **Brand Accent:** `text-blue-500` / `bg-blue-600` (#2563eb / #3b82f6)
- **Borders & Dividers:** `border-slate-800` / `border-slate-700/60`

---

## 4. Cloudflare Worker Edge & Gemini AI Architecture

### 4.1. Edge Proxy Role & Security
- **Zero Client-Side Secret Leakage:** The Gemini API Key is never bundled in frontend code. It is stored as an encrypted secret in Cloudflare's Secret Store (`npx wrangler secret put GEMINI_API_KEY`).
- **Cold Start:** Runs on Cloudflare V8 isolates with ~0ms cold start latency.
- **Strict CORS Enforcement:** Preflight `OPTIONS` and `POST` requests are validated against allowed origins (`https://ayana0409.github.io`, `https://ayana0409.github.io/portfolio`, and local development ports).

### 4.2. Dynamic Grounding & Anti-Hallucination Logic
- **Single Source of Truth:** The Worker dynamically fetches the latest `portfolioData.json` directly from GitHub Raw (`raw.githubusercontent.com/ayana0409/portfolio/main/src/data/portfolioData.json`).
- **Edge Caching:** Responses are cached in-memory and via Cloudflare Cache API for 5 minutes (`cf: { cacheTtl: 300 }`), avoiding GitHub rate limits while providing sub-second latency.
- **Strict Persona & Technical-First Instructions:**
  - AI acts as an engineering-focused assistant representing Thuận, prioritizing Architecture patterns (Clean Architecture, CQRS, Modular Monolith), Database & Caching (Redis, indexing), Engineering Trade-offs, and Security/Performance.
  - Strictly restricted to answering using information present in `portfolioData.json` (including `technicalDetails` and `technicalSpec`).
  - For unlisted private info (e.g. personal phone number or unlisted technologies), the AI politely declines and directs recruiters to Thuận's official Email and GitHub.
- **Local Fallback:** Bundled local JSON data is preserved as a fallback if GitHub Raw is temporarily unavailable.

### 4.3. Error Handling & Resilience Matrix
| Error Scenario | HTTP Code | Handled Behavior | User-Facing Message |
| :--- | :--- | :--- | :--- |
| **Rate Limit / Quota Exceeded** | `429` | Graceful JSON response | Friendly rate limit notice with retry advice |
| **Invalid Key / Bad Config** | `400` / `403` | Logs error & returns detailed message | Clear debug notification for configuration check |
| **Google Server Overload** | `500` / `502` | Catches 5xx status from Gemini | Notification that AI servers are temporarily busy |
| **Network Timeout (> 15s)** | `504` | `AbortSignal.timeout(15000)` triggered | Informs user of timeout, prevents UI freezing |
| **Safety Filter Block** | `200` / `400` | Checks `finishReason === 'SAFETY'` | Explains content policy constraint politely |

---

## 5. Frontend AI ChatBot Component (`ChatBot.jsx`)

Located at [src/features/chat/ChatBot.jsx](file:///d:/Workspace/Portfolio/src/features/chat/ChatBot.jsx):

- **Floating Action Button (FAB):** Bottom-right position with ambient pulsing blue glow ring (`animate-pulse`).
- **Interactive Modal:** Glassmorphism card (`backdrop-blur-xl bg-slate-900/95`) with live `Edge AI` status badge.
- **Quick Prompt Discovery:** Pre-configured suggestion chips tailored to active language (Vietnamese / English):
  - *Core skills inquiry*
  - *FPT Software experience*
  - *Featured project details*
  - *Contact information*
- **Rich Markdown Formatter:** Custom lightweight parser rendering bold (`**text**`), bullet lists (`*`, `-`, `•`), numbered lists (`1.`, `2.`), inline code (`` `code` ``), and clickable URLs (`<a>` with `target="_blank"`).
- **Auto Sync & Auto Scroll:** Real-time smooth scrolling to latest responses and reset conversation button.

---

## 6. Monorepo Scripts & Deployment Workflow

All commands are unified at the repository root [package.json](file:///d:/Workspace/Portfolio/package.json):

```json
"scripts": {
  "dev": "node node_modules/vite/bin/vite.js",
  "build": "node node_modules/vite/bin/vite.js build",
  "worker:dev": "wrangler dev --config worker/wrangler.toml",
  "worker:deploy": "wrangler deploy --config worker/wrangler.toml"
}
```

### 6.1. Updating Data Workflow
1. Edit skills, experiences, or projects in [src/data/portfolioData.json](file:///d:/Workspace/Portfolio/src/data/portfolioData.json).
2. Commit and push:
   ```bash
   git add .
   git commit -m "update: portfolio data"
   git push origin main
   ```
3. **Result:**
   - **Frontend:** Automatically rebuilt and published by GitHub Actions to `https://ayana0409.github.io/portfolio/`.
   - **AI Worker:** Automatically synchronizes with the updated JSON from GitHub Raw on the next user query (no worker redeployment needed).