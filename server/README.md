# HorseSquare Pakistan — Backend (Node.js + Express + MongoDB)

This is the complete backend for your FYP frontend. It powers every button, form, and filter
across all your pages: Login, Register, Forgot Password, Home/Marketplace + filters, Sell a Horse,
Live Auction + bidding, Riding School, Breeding System + requests, AI Vet Doctor, Contact Us,
and a brand-new **Admin Dashboard** (your frontend didn't have one — see note below).

---

## 1. Project structure

```
horsesquare-backend/
├── server.js                  # entry point
├── package.json
├── .env.example                # copy this to .env and fill in your values
├── config/
│   ├── db.js                   # MongoDB connection
│   ├── seedAdmin.js             # auto-creates the default admin account
│   └── seed.js                  # optional: seeds sample horses/auction/breeding data
├── models/                      # Mongoose schemas (User, Horse, Auction, Breeding, VetInquiry, Misc)
├── controllers/                 # business logic for every route
├── routes/                       # Express routers
├── middleware/                   # auth (JWT), upload (multer), errorHandler
├── uploads/                       # uploaded horse/breeding/vet images get stored here
├── public/admin/                  # the Admin Dashboard (plain HTML/JS, served at /admin)
└── frontend-integration/          # YOUR original pages, wired up to call this backend
    ├── index.html                  (home/marketplace - was part of p1-6_frontent.html)
    ├── sell.html
    ├── auction.html
    ├── riding-school.html
    ├── breeding-system.html
    ├── ai-vet-doctor.html
    ├── contact.html                 (new - your nav linked to it but it didn't exist)
    ├── login.html                    (was P-7_login_page_fyp.html)
    ├── register.html                  (was P-8_New_registration_fyp.html)
    └── forgot-password.html            (was P-9_Code_for_reset_fyp.html)
```

Your original `p1-6_frontent.html` had 6 different pages pasted into ONE file. I split it into
6 separate files (index/sell/auction/riding-school/breeding-system/ai-vet-doctor.html) because
that's how a real multi-page site needs to work — each links to the others via real `<a href>`
navigation instead of broken `#anchor` links.

---

## 2. Was there an Admin Dashboard in your frontend?

**No.** None of your 4 uploaded files contained any admin page. I built one from scratch at
`public/admin/index.html` + `admin.js`, in the same navy/gold visual style as your site. It lets
the admin:
- See dashboard stats (total users, pending listings, live auctions, etc.)
- View/block/delete users
- Approve/reject/mark-sold horse listings
- View/close/delete auctions
- View and update breeding requests
- View AI Vet inquiries
- View and resolve Contact Us messages

---

## 3. Setup Instructions

### Step 1 — Install Node.js
Download from https://nodejs.org (LTS version). Confirm with:
```bash
node -v
npm -v
```

### Step 2 — Install MongoDB (choose ONE option)

**Option A: Local MongoDB (runs on your own laptop)**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install it (on Windows, install as a Service so it auto-starts).
3. Verify it's running:
   ```bash
   mongosh
   ```
   If a shell opens, MongoDB is running on `mongodb://127.0.0.1:27017`.
4. In `.env`, keep the default:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/horsesquare
   ```

**Option B: MongoDB Atlas (free cloud database — no install needed)**
1. Sign up at https://www.mongodb.com/cloud/atlas/register
2. Create a free (M0) cluster.
3. Under "Database Access", create a user with a username/password.
4. Under "Network Access", add your IP (or `0.0.0.0/0` to allow from anywhere, fine for FYP demo).
5. Click "Connect" → "Drivers" → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. In `.env`, comment out the local line and use:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/horsesquare?retryWrites=true&w=majority
   ```
   (Note the `/horsesquare` added before the `?` — this sets the database name.)

### Step 3 — Configure environment variables
```bash
cd horsesquare-backend
cp .env.example .env
```
Open `.env` and check/edit the values (defaults work fine for local testing):
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/horsesquare
JWT_SECRET=horsesquare_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@horsesquare.pk
ADMIN_PASSWORD=Admin@12345
```

### Step 4 — Install dependencies
```bash
npm install
```

### Step 5 (optional but recommended) — Seed sample data
This fills your database with the same sample horses/auction/breeding cards that were
hardcoded in your original frontend, so the pages aren't empty on first run:
```bash
npm run seed
```

### Step 6 — Start the server
```bash
npm start
```
You should see:
```
✅ MongoDB Connected: ...
👑 Default admin account created: admin@horsesquare.pk / Admin@12345
🚀 Server running on http://localhost:5000
🛠️  Admin dashboard at http://localhost:5000/admin
```

For development with auto-restart on file changes:
```bash
npm run dev
```

---

## 4. Running your frontend pages

The files in `frontend-integration/` are your original pages, now wired to call
`http://localhost:5000/api/...`. Open them directly in a browser (double-click `index.html`,
or use VS Code's "Live Server" extension for a nicer experience), **while the backend server
is running**.

Start here: `frontend-integration/login.html` → register a new account → you'll land on
`index.html` (the marketplace).

Admin dashboard: open `http://localhost:5000/admin` directly and log in with:
```
Email: admin@horsesquare.pk
Password: Admin@12345
```
(Change this password after first login by updating `.env` and re-seeding, or build an
"Edit Profile" page later — out of scope for this initial build.)

---

## 5. API Reference (for your FYP report / viva)

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create account (P-8) |
| POST | `/auth/login` | Login (P-7) |
| POST | `/auth/forgot-password` | Send reset code (P-9) |
| POST | `/auth/verify-reset-code` | Verify a code before resetting |
| POST | `/auth/reset-password` | Set new password using code |
| GET | `/auth/me` | Get current logged-in user (requires Bearer token) |

### Horses (Marketplace)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/horses?breed=&minPrice=&maxPrice=&location=&search=` | List/filter/search approved horses |
| GET | `/horses/:id` | Single horse detail |
| POST | `/horses` | Submit a new listing (multipart/form-data, field `images`) |
| PUT | `/horses/:id` | Edit own listing (auth required) |
| DELETE | `/horses/:id` | Delete own listing (auth required) |

### Auctions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/auctions?status=live` | List auctions |
| GET | `/auctions/:id` | Single auction + live countdown + bid history |
| POST | `/auctions` | Create auction (auth required) |
| POST | `/auctions/:id/bid` | Place a bid |
| PUT | `/auctions/:id/close` | Manually end (auth required) |

### Breeding
| Method | Endpoint | Description |
|---|---|---|
| GET | `/breeding/horses` | List breeding horse cards |
| POST | `/breeding/requests` | Submit a breeding request |

### AI Vet Doctor
| Method | Endpoint | Description |
|---|---|---|
| POST | `/vet/check` | Submit symptoms (multipart/form-data) → returns assessment |

### Contact
| Method | Endpoint | Description |
|---|---|---|
| POST | `/contact` | Submit contact form |

### Location
| Method | Endpoint | Description |
|---|---|---|
| POST | `/location` | Save a "Use My Current Location" ping |

### Admin (all require `Authorization: Bearer <admin-token>`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/stats` | Dashboard overview numbers |
| GET | `/admin/users` | List all users |
| PUT | `/admin/users/:id/block` | Block/unblock a user |
| DELETE | `/admin/users/:id` | Delete a user |
| GET | `/admin/horses?status=pending` | List/filter listings for moderation |
| PUT | `/admin/horses/:id/approve` | Approve a listing |
| PUT | `/admin/horses/:id/reject` | Reject a listing |
| PUT | `/admin/horses/:id/mark-sold` | Mark a listing as sold |
| GET | `/admin/auctions` | List all auctions |
| PUT | `/admin/auctions/:id/close` | Force-end an auction |
| DELETE | `/admin/auctions/:id` | Delete an auction |
| GET | `/admin/breeding-requests` | List breeding requests |
| PUT | `/admin/breeding-requests/:id` | Update request status |
| GET | `/admin/vet-inquiries` | List AI Vet inquiries |

---

## 6. Important notes for your FYP submission

1. **Change `JWT_SECRET`** in `.env` to your own random string before any real deployment.
2. **Remove the `devCode` field** in `authController.js` → `forgotPassword` before final submission —
   it's there only so you can test the "forgot password" flow without setting up a real email
   service (the reset code is also printed in the server console either way).
3. To send *real* emails for password reset, install `nodemailer` (already in `package.json`) and
   replace the `console.log` in `forgotPassword` with an actual `transporter.sendMail(...)` call —
   ask if you'd like this wired up to Gmail/SMTP.
4. All uploaded images are saved to the `uploads/` folder and served at
   `http://localhost:5000/uploads/<filename>`. If you deploy this online later, you'd want to move
   this to a cloud storage service (e.g. Cloudinary) — fine to mention as "future work" in your report.
5. `frontend-integration/*.html` files all point to `http://localhost:5000/api`. If you deploy your
   backend somewhere else, update the `API_BASE` constant near the top of each file's `<script>`.
