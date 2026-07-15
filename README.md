# HorseSquare Pakistan 🐎

HorseSquare Pakistan is a premium, state-of-the-art MERN stack web application tailored for equine enthusiasts, breeders, and traders in Pakistan. It provides a complete digital ecosystem for buying/selling horses, live auctions, breeding management, and automated AI veterinary advice.

---

## 🌟 Key Features

1. **Equine Marketplace**: Buy and sell premium breeds (Thoroughbred, Arabian, Desi/Nukra, Sindhi, Balochi, Friesian) with interactive dual price range sliders and localized city filters.
2. **Live Auctions**: Secure, real-time equine bidding panel with authenticated bidding and current high bid sync.
3. **Breeding Directory**: Directory of certified champion breeding studs with inline request bookings.
4. **AI Vet Diagnostics**: Interactive symptoms checker targeting local equine diseases (e.g. Trypanosomiasis/Surra) with instant professional advice.
5. **Emergency Contacts**: City-wise directory of top Pakistani veterinarians and horse hospitals.
6. **Admin Dashboard**: Full listing moderation queue, user management (active/blocked), and platform analytics.

---

## 🛠️ Technology Stack
*   **Frontend**: React (Vite), React Router, Lucide Icons, Custom CSS with HSL variables.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB with Mongoose ODM (includes an automatic in-memory Mongo server fallback for local zero-config testing).
*   **Authentication**: JSON Web Tokens (JWT) stored in browser `localStorage`.

---

## 🚀 How to Run Locally

Follow these steps to run the client and server on your local machine:

### 1. Run the Backend Server
```bash
cd server
npm install
node server.js
```
*   **Server runs at**: `http://localhost:5000`

### 2. Run the Frontend Client
```bash
cd client
npm install
npm run dev
```
*   **Website runs at**: `http://localhost:5173`

*(Note: On Windows PowerShell, if script execution is blocked, use `npm.cmd` instead of `npm`, e.g., `npm.cmd install` and `npm.cmd run dev`)*.

---

## 📝 How to Add and Commit to Git
To add this README and all your project updates to Git, run the following commands in your main project terminal:

```bash
# 1. Add all changed files to the staging area
git add .

# 2. Commit the changes with a message
git commit -m "Add root README and finalize frontend-backend MERN integrations"

# 3. Push to your repository
git push origin main
```
