/**
 * models/Room.js
 * Semua query SQL yang berhubungan dengan tabel "rooms" dikumpulkan di
 * sini -- route di server.js tidak perlu tahu bentuk query-nya sama
 * sekali, cukup panggil fungsi (findAll, findById, dst).
 */
const db = require("../db.js");

/** Ubah baris database (kolom "available", perks berupa teks) jadi bentuk
 *  yang dipahami kode lama (booking.js, ui.js) yang pakai nama "left" dan
 *  perks sebagai array -- supaya kode itu TIDAK perlu diubah sama sekali. */
function toRoom(row) {
  return { ...row, left: row.available, perks: JSON.parse(row.perks) };
}

function findAll() {
  return db.prepare("SELECT * FROM rooms").all().map(toRoom);
}

function findById(id) {
  const row = db.prepare("SELECT * FROM rooms WHERE id = ?").get(id);
  return row ? toRoom(row) : null;
}

function decreaseStock(id, count) {
  db.prepare("UPDATE rooms SET available = available - ? WHERE id = ?").run(count, id);
}

/** Tambah kamar baru. "id" TIDAK diisi manual -- SQLite otomatis kasih
 *  nomor berikutnya yang belum terpakai untuk kolom INTEGER PRIMARY KEY. */
function create(room) {
  const result = db.prepare(`
    INSERT INTO rooms (name, type, cap, bed, size, price, available, perks, hills, valley)
    VALUES (@name, @type, @cap, @bed, @size, @price, @available, @perks, @hills, @valley)
  `).run({ ...room, perks: JSON.stringify(room.perks) });

  return findById(result.lastInsertRowid);
}

module.exports = { findAll, findById, decreaseStock, create };
