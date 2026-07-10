// ============================================================
// HorseSquare Pakistan - Admin Dashboard Logic
// Talks to the same backend running this page (relative URLs)
// ============================================================

const API = "/api";
let token = localStorage.getItem("hs_admin_token") || "";
let currentHorseFilter = "";

// ---------- Auth ----------

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;
  const errorBox = document.getElementById("loginError");
  errorBox.style.display = "none";

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!data.success) {
      errorBox.textContent = data.message || "Login failed";
      errorBox.style.display = "block";
      return;
    }

    if (data.user.role !== "admin") {
      errorBox.textContent = "This account is not an admin.";
      errorBox.style.display = "block";
      return;
    }

    token = data.token;
    localStorage.setItem("hs_admin_token", token);
    showDashboard();
  } catch (err) {
    errorBox.textContent = "Could not reach server. Is the backend running?";
    errorBox.style.display = "block";
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("hs_admin_token");
  token = "";
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("loginScreen").style.display = "flex";
});

function authHeaders() {
  return { Authorization: `Bearer ${token}` };
}

async function apiGet(path) {
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  return res.json();
}

async function apiPut(path, body = {}) {
  const res = await fetch(`${API}${path}`, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function apiDelete(path) {
  const res = await fetch(`${API}${path}`, { method: "DELETE", headers: authHeaders() });
  return res.json();
}

// On page load, if we already have a token, skip straight to dashboard
window.addEventListener("DOMContentLoaded", () => {
  if (token) showDashboard();
});

function showDashboard() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  loadOverview();
}

// ---------- Sidebar navigation ----------

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    const section = item.dataset.section;
    document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
    document.getElementById(`section-${section}`).classList.add("active");
    document.getElementById("sectionTitle").textContent = item.textContent.trim();

    if (section === "overview") loadOverview();
    if (section === "users") loadUsers();
    if (section === "horses") loadHorses();
    if (section === "auctions") loadAuctions();
    if (section === "breeding") loadBreedingRequests();
    if (section === "vet") loadVetInquiries();
    if (section === "contact") loadContactMessages();
  });
});

// ---------- Overview ----------

async function loadOverview() {
  const data = await apiGet("/admin/stats");
  if (!data.success) return;
  const s = data.data;

  const cards = [
    { num: s.totalUsers, label: "Registered Users" },
    { num: s.totalHorses, label: "Total Horse Listings" },
    { num: s.pendingHorses, label: "Pending Approval", gold: true },
    { num: s.approvedHorses, label: "Approved Listings" },
    { num: s.liveAuctions, label: "Live Auctions" },
    { num: s.endedAuctions, label: "Ended Auctions" },
    { num: s.pendingBreedingRequests, label: "Pending Breeding Requests", gold: true },
    { num: s.totalVetInquiries, label: "AI Vet Inquiries" },
  ];

  document.getElementById("statsGrid").innerHTML = cards
    .map(
      (c) => `
      <div class="stat-card ${c.gold ? "gold" : ""}">
        <div class="num">${c.num}</div>
        <div class="label">${c.label}</div>
      </div>`
    )
    .join("");
}

// ---------- Users ----------

async function loadUsers() {
  const data = await apiGet("/admin/users");
  const tbody = document.getElementById("usersTableBody");

  if (!data.success || data.data.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No users found.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.data
    .map(
      (u) => `
      <tr>
        <td>${escapeHtml(u.firstName)} ${escapeHtml(u.lastName)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.city)}</td>
        <td>${escapeHtml(u.userType)}</td>
        <td><span class="badge ${u.status}">${u.status}</span></td>
        <td>${formatDate(u.createdAt)}</td>
        <td class="actions-cell">
          ${
            u.role === "admin"
              ? `<span style="font-size:12px;color:#94A3B8;">Admin account</span>`
              : `
            <button class="btn-sm btn-block" onclick="blockUser('${u._id}')">${u.status === "active" ? "Block" : "Unblock"}</button>
            <button class="btn-sm btn-delete" onclick="deleteUser('${u._id}')">Delete</button>
          `
          }
        </td>
      </tr>`
    )
    .join("");
}

async function blockUser(id) {
  await apiPut(`/admin/users/${id}/block`);
  loadUsers();
}

async function deleteUser(id) {
  if (!confirm("Delete this user permanently?")) return;
  await apiDelete(`/admin/users/${id}`);
  loadUsers();
}

// ---------- Horse Listings ----------

document.querySelectorAll("#horseFilterTabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#horseFilterTabs button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentHorseFilter = btn.dataset.status;
    loadHorses();
  });
});

async function loadHorses() {
  const query = currentHorseFilter ? `?status=${currentHorseFilter}` : "";
  const data = await apiGet(`/admin/horses${query}`);
  const tbody = document.getElementById("horsesTableBody");

  if (!data.success || data.data.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No listings found.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.data
    .map(
      (h) => `
      <tr>
        <td>${escapeHtml(h.name)}</td>
        <td>${escapeHtml(h.breed)}</td>
        <td>₨ ${Number(h.price).toLocaleString()}</td>
        <td>${escapeHtml(h.location)}</td>
        <td>${escapeHtml(h.sellerName)}</td>
        <td><span class="badge ${h.status}">${h.status}</span></td>
        <td class="actions-cell">
          ${h.status !== "approved" ? `<button class="btn-sm btn-approve" onclick="approveHorse('${h._id}')">Approve</button>` : ""}
          ${h.status !== "rejected" ? `<button class="btn-sm btn-reject" onclick="rejectHorse('${h._id}')">Reject</button>` : ""}
          ${h.status === "approved" ? `<button class="btn-sm btn-info" onclick="markSold('${h._id}')">Mark Sold</button>` : ""}
        </td>
      </tr>`
    )
    .join("");
}

async function approveHorse(id) {
  await apiPut(`/admin/horses/${id}/approve`);
  loadHorses();
}
async function rejectHorse(id) {
  await apiPut(`/admin/horses/${id}/reject`);
  loadHorses();
}
async function markSold(id) {
  await apiPut(`/admin/horses/${id}/mark-sold`);
  loadHorses();
}

// ---------- Auctions ----------

async function loadAuctions() {
  const data = await apiGet("/admin/auctions");
  const tbody = document.getElementById("auctionsTableBody");

  if (!data.success || data.data.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No auctions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.data
    .map(
      (a) => `
      <tr>
        <td>${escapeHtml(a.horseName)}</td>
        <td>${escapeHtml(a.breed)}</td>
        <td>₨ ${Number(a.currentBid).toLocaleString()}</td>
        <td>${escapeHtml(a.highestBidder || "—")}</td>
        <td><span class="badge ${a.status}">${a.status}</span></td>
        <td>${formatDate(a.endTime)}</td>
        <td class="actions-cell">
          ${a.status === "live" ? `<button class="btn-sm btn-reject" onclick="closeAuction('${a._id}')">End Now</button>` : ""}
          <button class="btn-sm btn-delete" onclick="deleteAuction('${a._id}')">Delete</button>
        </td>
      </tr>`
    )
    .join("");
}

async function closeAuction(id) {
  await apiPut(`/admin/auctions/${id}/close`);
  loadAuctions();
}
async function deleteAuction(id) {
  if (!confirm("Delete this auction permanently?")) return;
  await apiDelete(`/admin/auctions/${id}`);
  loadAuctions();
}

// ---------- Breeding Requests ----------

async function loadBreedingRequests() {
  const data = await apiGet("/admin/breeding-requests");
  const tbody = document.getElementById("breedingTableBody");

  if (!data.success || data.data.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No breeding requests found.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.data
    .map(
      (r) => `
      <tr>
        <td>${escapeHtml(r.requesterName)}</td>
        <td>${escapeHtml(r.phone)}</td>
        <td>${escapeHtml(r.ownHorseName)}</td>
        <td>${escapeHtml(r.preferredBreed)}</td>
        <td><span class="badge ${r.status}">${r.status}</span></td>
        <td class="actions-cell">
          ${r.status === "pending" ? `<button class="btn-sm btn-approve" onclick="updateBreedingStatus('${r._id}','contacted')">Mark Contacted</button>` : ""}
          ${r.status !== "closed" ? `<button class="btn-sm btn-info" onclick="updateBreedingStatus('${r._id}','closed')">Close</button>` : ""}
        </td>
      </tr>`
    )
    .join("");
}

async function updateBreedingStatus(id, status) {
  await apiPut(`/admin/breeding-requests/${id}`, { status });
  loadBreedingRequests();
}

// ---------- Vet Inquiries ----------

async function loadVetInquiries() {
  const data = await apiGet("/admin/vet-inquiries");
  const tbody = document.getElementById("vetTableBody");

  if (!data.success || data.data.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">No inquiries found.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.data
    .map(
      (v) => `
      <tr>
        <td>${escapeHtml(v.horseName)}</td>
        <td>${escapeHtml(v.symptom)}</td>
        <td><span class="badge ${v.severity === "warning" ? "pending" : "approved"}">${v.severity}</span></td>
        <td>${formatDate(v.createdAt)}</td>
      </tr>`
    )
    .join("");
}

// ---------- Contact Messages ----------

async function loadContactMessages() {
  const data = await apiGet("/contact");
  const tbody = document.getElementById("contactTableBody");

  if (!data.success || data.data.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No messages found.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.data
    .map(
      (m) => `
      <tr>
        <td>${escapeHtml(m.name)}</td>
        <td>${escapeHtml(m.email || "—")}</td>
        <td>${escapeHtml(m.message).slice(0, 60)}${m.message.length > 60 ? "..." : ""}</td>
        <td><span class="badge ${m.status}">${m.status}</span></td>
        <td class="actions-cell">
          ${m.status !== "resolved" ? `<button class="btn-sm btn-approve" onclick="updateContactStatus('${m._id}','resolved')">Resolve</button>` : ""}
        </td>
      </tr>`
    )
    .join("");
}

async function updateContactStatus(id, status) {
  await apiPut(`/contact/${id}`, { status });
  loadContactMessages();
}

// ---------- Helpers ----------

function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
