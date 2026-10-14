/**
 * admin-auth.js
 * Dipakai BERSAMA oleh admin/login.html dan admin/index.html (shell
 * admin) -- baca-tulis token login di localStorage, dan authFetch()
 * sebagai pengganti fetch() biasa untuk request yang butuh login.
 *
 * Catatan: fungsi di sini TIDAK otomatis jalan sendiri (tidak ada kode
 * yang auto-redirect begitu file ini dimuat) -- supaya file yang sama
 * bisa dipakai login.html tanpa ikut ke-redirect. Tiap halaman panggil
 * eksplisit fungsi yang dibutuhkan (lihat requireAdminLogin() di
 * admin/index.html).
 */
const ADMIN_TOKEN_KEY = "ts_admin_token";

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

/** Redirect ke halaman login kalau belum ada token tersimpan. Dipanggil
 *  di awal admin/index.html, SEBELUM panel mana pun mulai fetch data. */
function requireAdminLogin() {
  if (!getAdminToken()) location.href = "login.html";
}

/** Pengganti fetch() biasa untuk request admin -- otomatis sisipkan
 *  header Authorization, dan otomatis lempar balik ke halaman login
 *  kalau backend bilang token sudah tidak valid/kedaluwarsa (401). */
async function authFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), Authorization: `Bearer ${getAdminToken()}` },
  });

  if (response.status === 401) {
    clearAdminToken();
    location.href = "login.html";
    throw new Error("Sesi admin sudah berakhir, silakan login ulang.");
  }

  return response;
}
