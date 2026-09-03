# Technical Specification: Short Link Management System (shorter-link)

## 1. Executive Summary & Overview
- **System Purpose:** High-performance, secure URL shortening and analytics platform with real-time notifications, group collaboration, dynamic level quotas, and audit logging.
- **Key Repositories:**
  - Backend API: [github.com/ayana0409/shorter-link-api](https://github.com/ayana0409/shorter-link-api)
  - Frontend SPA: [github.com/ayana0409/shorter-link-fe](https://github.com/ayana0409/shorter-link-fe)
  - WebSocket Service: [github.com/ayana0409/shorter-link-websocket](https://github.com/ayana0409/shorter-link-websocket)

---

## 2. Architecture & Design Patterns
- **Architectural Style:** Modular Monolith built with NestJS, strictly separating layers:
  - `Controllers`: HTTP routing, DTO transformation, Request validation via class-validator.
  - `Services`: Core business logic, cache coordination, transaction boundaries.
  - `Repositories / Mongoose Schemas`: Data access abstraction and persistence.
- **Design Patterns Applied:**
  - **Dependency Injection (IoC):** Native NestJS container for modular decoupling and testability.
  - **Cache-Aside Pattern:** Cache short URL resolutions in Redis prior to database query.
  - **Guard-based RBAC:** Role-based and Level-based route protection (`@Roles()`, `@Levels()`).
  - **Interceptor Pattern:** Automatic audit logging and standard JSON envelope transformations.
  - **Observer / Event Pattern:** Real-time event publishing to WebSocket service via Redis pub/sub.

---

## 3. Database, Caching & Indexing Strategies
- **Primary Database:** MongoDB with Mongoose ODM for document persistence.
  - `urls` collection: Compound index `{ shortCode: 1 }` (unique, O(1) key resolution).
  - Index `{ userId: 1, createdAt: -1 }` for fast dashboard queries and user link management.
  - Index `{ groupId: 1, createdAt: -1 }` for group link sharing.
  - TTL index for automatic expiration of temporary links based on tier quotas.
- **Caching Layer (Redis):**
  - **Short URL Redirection Cache:** Key `url:{shortCode}` with configurable TTL (default 24 hours). Redirect requests hit Redis first, reducing database read load by ~90%.
  - **Rate Limiting Counter:** Sliding window counters using Redis Sorted Sets (`ZADD`, `ZREMRANGEBYSCORE`) per IP and User ID.
  - **Session & Token Management:** Redis Hash stores active refresh tokens and user permission snapshots.

---

## 4. Security & Authentication Architecture
- **JWT Authentication with Refresh Token Rotation:**
  - Short-lived Access Token (15 minutes).
  - Long-lived Refresh Token (7 days) with **Token Family Revocation**: If a compromised or previously rotated refresh token is reused, all tokens belonging to that family are invalidated immediately.
- **Multi-Tab Synchronization:**
  - BroadcastChannel API on the frontend synchronized with HTTP-only cookies and proactive token refresh before expiration.
- **Rate Limiting & Abuse Prevention:**
  - Redis-backed rate limiting per IP and per account tier to prevent brute-force short-code scanning and DDoS.
  - Password protection for sensitive short links (hashed using bcrypt with salt).

---

## 5. Engineering Challenges, Trade-offs & Solutions
- **Challenge 1: Short Code Collision vs Performance**
  - *Context:* Generating short, readable alphanumeric codes without predictable sequencing.
  - *Decision:* Used NanoID with a 6-8 character alphabet. Instead of locking the database, the system attempts optimistic insertion with a retry budget of 3 attempts upon duplicate key error (`E11000`).
- **Challenge 2: High-Frequency Click Analytics & Latency**
  - *Context:* Incrementing click counts on every redirect can bottleneck database writes during viral traffic spikes.
  - *Solution:* Fire-and-forget asynchronous increment using Redis `INCR` and buffer updates, periodically flushing batch analytics to MongoDB via scheduled cron worker.
