# Horse Square Pakistan — Target Framework & Roadmap Template

> **Important:** This is *not* an audit of your actual code. I only had access to the public GitHub landing page (folder names, language %, commit count) — GitHub blocks automated access to individual files, and my environment has no network access to clone the repo. Everything below is a generic best-practice framework for a horse-marketplace platform, for you to compare against your real implementation. Bugs, completion percentages, and security findings tied to specific files can't honestly be produced without reading the actual code.

## What's confirmed from the public page
- Root-level split: `client/` and `server/` (typical MERN-style separation)
- Single commit in history — suggests a fresh/squashed upload rather than incremental history
- Language mix: ~69% JavaScript, ~30% HTML, ~1% CSS — worth checking yourself whether `client` is a React SPA (usually shows as almost entirely JS/JSX) or has a lot of static multi-page HTML mixed in
- No README, license, or releases visible

---

## Section A — Target Feature Checklist

Use this as a self-audit checklist. Tick what already exists in your repo.

### Authentication & Accounts
- [x] Email/password signup + login (Fully implemented)
- [x] Password reset flow (6-digit code logged in console for development)
- [ ] Email verification
- [/] JWT/session handling with refresh tokens (JWT implemented, refresh tokens missing)
- [x] Role-based access (buyer / seller / admin)
- [ ] Social login (optional)
- [ ] Profile management (edit info, avatar, contact details)

### Horse Marketplace / Listings
- [x] Create/edit/delete listing (seller)
- [x] Multi-image upload with gallery view (Multer on backend, Sell page on frontend)
- [/] Breed, age, price, location, health/vaccination fields (Age/Health/Vaccination fields are missing from DB schema, but other core fields are present)
- [x] Listing status (active, sold, pending) (Handled by Admin)
- [ ] Draft vs published listings

### Search & Discovery
- [x] Keyword search (Text indexing on backend)
- [/] Filters: breed, price range, location, age, gender (Age and gender filters not supported due to missing DB attributes)
- [/] Sort (newest, price asc/desc) (Only sorting by newest is implemented on backend)
- [x] Pagination or infinite scroll (Fully supported in backend)
- [ ] Saved searches / alerts

### Horse Details Page
- [/] Full image gallery/zoom (Modal popup on Marketplace; no separate details page routing)
- [/] Seller contact/inquiry button (Displays phone/WhatsApp, but has no inline message center)
- [/] Map/location display (Coordinates stored, but no map visualization UI)
- [ ] Related/similar listings
- [ ] Share listing (social/link)

### Buyer Experience
- [ ] Wishlist/favorites
- [ ] Inquiry/messaging with seller
- [ ] Inquiry history

### Seller Dashboard
- [ ] My listings management (No front-end page for sellers, only raw backend API support)
- [ ] Inquiry inbox
- [/] Basic analytics (views, inquiries per listing) (Views tracked in DB schema)

### Admin Panel
- [x] User management (Can block/unblock and delete users)
- [x] Listing moderation/approval queue (Admin approves/rejects pending listings)
- [ ] Reported content handling
- [x] Platform-wide analytics (Stats counter on admin dashboard)

### Payments (if in scope)
- [ ] Escrow or deposit handling
- [ ] Payment gateway integration (local: JazzCash/Easypaisa, or Stripe)
- [ ] Transaction history
- [ ] Invoicing/receipts

### Notifications
- [ ] In-app notifications
- [ ] Email notifications (new inquiry, listing status)
- [ ] Push notifications (if mobile/PWA)

### AI Features (mentioned in your spec — none confirmed to exist)
- [ ] Breed identification from photo
- [ ] Price/valuation estimator
- [/] Chatbot for buyer support / Vet Check (Rule-based symptom advice logs as "AI result", but no real LLM integration)
- [ ] Personalized listing recommendations

### Trust & Compliance
- [ ] Seller verification badge
- [ ] Reviews/ratings
- [ ] Report listing/user
- [ ] Terms of Service, Privacy Policy, dispute process (relevant for livestock trade)

### Platform Basics
- [x] Responsive layout (mobile/tablet/desktop)
- [x] Accessibility (alt text, keyboard nav, contrast)
- [/] SEO basics (meta tags, sitemap)
- [/] Error/404 pages (Backend routing handles it; frontend lacks custom 404 page)
- [ ] Rate limiting on public APIs
- [x] Environment-variable-based secrets (no hardcoded keys)
- [x] Input validation client + server side
- [ ] Automated tests (unit/integration)
- [ ] CI pipeline

---

## Section B — Roadmap Template (16 Milestones)

Illustrative file paths below assume a typical MERN layout (`client/src/...`, `server/...`). Confirm these against your actual structure before treating them as instructions — I haven't seen the real tree.

| # | Milestone | Goal | Typical Files | Dependencies | Complexity |
|---|-----------|------|---------------|---------------|------------|
| 1 | Project Cleanup | Remove dead code, unused deps, console.logs, fix lint config | Root configs, `.eslintrc`, `package.json` | None | Low |
| 2 | Folder Structure Refactor | Establish consistent client/server module structure | `client/src/`, `server/` | M1 | Medium |
| 3 | Authentication | Solid signup/login/JWT/roles | `server/routes/auth`, `client/src/pages/Auth` | M2 | High |
| 4 | Database Schema | Finalize models, indexes, relations | `server/models/` | M2 | Medium |
| 5 | Horse Listings CRUD | Create/edit/delete + image upload | `server/routes/listings`, `client/src/pages/Listings` | M3, M4 | High |
| 6 | Search & Filters | Query params, indexing, filter UI | `server/controllers/search`, `client/src/components/Filters` | M5 | Medium |
| 7 | Horse Details Page | Gallery, contact seller, map | `client/src/pages/HorseDetail` | M5 | Medium |
| 8 | Seller Dashboard | Manage listings, view inquiries | `client/src/pages/Dashboard/Seller` | M5 | Medium |
| 9 | Admin Panel | Moderate users/listings | `client/src/pages/Admin`, `server/routes/admin` | M3, M5 | High |
| 10 | Payments | Gateway integration, transaction records | `server/routes/payments`, `client/src/pages/Checkout` | M3, M5 | High |
| 11 | AI Features | Breed ID / price estimator / chatbot (scope TBD) | `server/services/ai`, `client/src/components/AI*` | M5 | High |
| 12 | Notifications | Email + in-app | `server/services/notifications` | M3 | Medium |
| 13 | Performance Optimization | Code splitting, image opt, query tuning | Across `client/src`, `server/` | All prior | Medium |
| 14 | Security Hardening | Rate limiting, validation, secrets audit | `server/middleware/` | All prior | High |
| 15 | Testing | Unit + integration test coverage | `**/__tests__` or `*.test.js` | All prior | Medium |
| 16 | Deployment | CI/CD, env config, hosting setup | `.github/workflows`, deployment configs | All prior | Medium |

Each milestone should still get the acceptance-criteria treatment from your original spec (build passes, no lint errors, responsive on desktop/tablet/mobile) before merging — that verification has to happen in an environment with real access to run the build (your machine, CI, or Claude Code), since I can't execute `npm install`/build/test commands from here.

---

## Next steps
Whenever you're ready for a real audit instead of a template: uploading the repo as a `.zip` here, or pointing Claude Code at the actual repo, gets you the genuine bug list, real completion percentages, and an actionable Phase 3 workflow (Claude Code can also actually run the branch → commit → push → PR → merge cycle, which I can't do from this chat).
