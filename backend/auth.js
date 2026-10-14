/**
 * auth.js
 * Autentikasi admin SANGAT sederhana: satu password (dari backend/.env),
 * bukan sistem banyak user/akun -- cukup untuk proyek demo dengan satu
 * admin. Setelah login berhasil, server kasih token acak yang harus
 * disertakan tiap request ke endpoint yang MENGUBAH data (header
 * "Authorization: Bearer <token>").
 *
 * Token disimpan di MEMORI server (bukan database) -- cukup untuk demo,
 * tapi artinya semua admin otomatis ter-logout kalau server di-restart.
 */
const crypto = require("crypto");

const SESSION_HOURS = 24;
const sessions = new Map(); // token -> waktu kedaluwarsa (timestamp ms)

/** Cek password, buat token baru kalau cocok.
 *  Mengembalikan { token } atau { error }. */
function login(password) {
  if (!process.env.ADMIN_PASSWORD) {
    return { error: "Login admin belum dikonfigurasi (ADMIN_PASSWORD belum diisi di backend/.env)." };
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Password salah." };
  }

  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  return { token };
}

function isValid(token) {
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    sessions.delete(token); // kedaluwarsa -- bersihkan supaya Map tidak numpuk token mati
    return false;
  }
  return true;
}

/** Middleware: pasang di route yang MENGUBAH data (POST/PATCH/DELETE).
 *  Route GET (dibaca situs publik) sengaja TIDAK dipasangi ini. */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!isValid(token)) {
    return res.status(401).json({ error: "Sesi admin tidak valid, silakan login ulang." });
  }
  next();
}

module.exports = { login, requireAuth };
