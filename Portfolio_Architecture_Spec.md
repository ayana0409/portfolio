# System Context: 3D Interactive Portfolio Website
> **Note for AI Assistant:** This document acts as the master specification for a React-based interactive portfolio. When reading this document, adhere to the architectural choices, color palettes, and animation logic defined below.

## 1. Project Overview
- **Owner:** Dương Đoàn Thuận (GitHub: @ayana0409)
- **Role:** Backend Developer (C#, .NET)
- **Core Concept:** A 3D interactive portfolio featuring a 3D flipbook for projects and a "tear-in-half" scroll transition.
- **Framework:** React (Vite) or Next.js
- **Styling:** Tailwind CSS
- **State/Data:** `portfolioData.json` (Local JSON database)
- **i18n:** `react-i18next` (vi / en)
- **Deployment:** GitHub Pages (via GitHub Actions)

## 2. Design System: Color Palette (Tailwind CSS)
The design follows a modern, tech-focused "Slate & Blue" theme.

### Light Mode (Default)
- **Background (Main):** `bg-slate-50` (#f8fafc) - *Off-white, soft on eyes*
- **Background (Card/Book Page):** `bg-white` (#ffffff)
- **Text (Primary):** `text-slate-900` (#0f172a)
- **Text (Secondary/Muted):** `text-slate-500` (#64748b)
- **Accent/Primary Brand:** `text-blue-600` (#2563eb)
- **Borders/Dividers:** `border-slate-200` (#e2e8f0)

### Dark Mode
- **Background (Main):** `bg-slate-950` (#020617) - *Deep dark slate*
- **Background (Card/Book Page):** `bg-slate-900` (#0f172a)
- **Text (Primary):** `text-slate-200` (#e2e8f0)
- **Text (Secondary/Muted):** `text-slate-400` (#94a3b8)
- **Accent/Primary Brand:** `text-blue-400` (#60a5fa) - *Lighter blue for dark mode contrast*
- **Borders/Dividers:** `border-slate-800` (#1e293b)

## 3. Data Architecture (JSON Schema)
The entire portfolio content is driven by a single JSON file. The AI should use this structure to generate UI components.

```json
{
  "about": {
    "title": { "vi": "Giới thiệu", "en": "About Me" },
    "role": { "vi": "Lập trình viên Backend", "en": "Backend Developer" }
  },
  "projects": [
    {
      "id": "motorcycle-repair-shop",
      "type": "info",
      "technologies": ["C#", ".NET", "ReactJS"],
      "summary": { "vi": "Hệ thống quản lý...", "en": "Management system..." }
    }
  ]
}
```
*Note on `type`: Use conditional rendering (`type === 'info'` vs `type === 'gallery'`) to dynamically load different layout components.*

## 4. Animation Specifications & Resources

### 4.1. 3D Page Flip
- **Library:** `react-pageflip` (wrapper for StPageFlip)
- **Behavior:** The user can drag or click corners to flip pages. Used exclusively for browsing through the `projects` array.

### 4.2. Scroll-Triggered "Paper Tear" Transition
- **Concept:** When scrolling down, the current page visually tears in half (horizontally or diagonally). The top half moves up (`translateY(-100%)`), the bottom half moves down (`translateY(100%)`), revealing the next section emerging from underneath (`z-index` layering).
- **Recommended Tech:** GSAP + ScrollTrigger + CSS `clip-path` + SVG `<filter>` (for jagged edges).

#### **Search Queries for AI & User (To find open-source templates):**
If generating code or searching CodePen, use these exact keywords:
1. `"GSAP scrolltrigger torn paper effect codepen"`
2. `"CSS clip-path page split scroll animation"`
3. `"GSAP reveal next section split screen Codepen"`
4. `"Paper tear rip transition CSS SVG"`

#### **AI Implementation Strategy (If writing from scratch):**
```css
/* Core logic for the AI to understand */
.page-container { position: relative; height: 100vh; overflow: hidden; }
.tear-top { 
  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%); /* plus jagged svg filter */
}
.tear-bottom { 
  clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
}
.next-page {
  position: absolute; top: 0; left: 0; width: 100%; z-index: -1;
}
```
```javascript
// GSAP Logic expectation
gsap.to(".tear-top", {
  yPercent: -100,
  scrollTrigger: { trigger: ".page-container", scrub: true, start: "top top" }
});
gsap.to(".tear-bottom", {
  yPercent: 100,
  scrollTrigger: { trigger: ".page-container", scrub: true, start: "top top" }
});