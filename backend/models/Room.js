/**
 * models/Room.js
 * Semua query SQL yang berhubungan dengan tabel "rooms" dikumpulkan di
 * sini -- route di server.js tidak perlu tahu bentuk query-nya sama
 * sekali, cukup panggil fungsi (findAll, findById, dst).
 */
const db = require("../db.js");

/** Ubah baris database (kolom "available", perks berupa teks) jadi bentuk
 *  yang dipahami kode lama (booking.js, ui.js) yang pakai nama "left" dan
 *  perks sebagai array -- supaya kode itu TIDAK perlu diubah sama sekali.
 *
 *  Catatan: kolom "available" sekarang berarti JUMLAH UNIT kamar tipe ini
 *  (tetap, tidak berkurang saat dipesan). Sisa kamar untuk tanggal
 *  tertentu dihitung terpisah di server.js lewat Booking.roomsLeft. */
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

/** Tambah kamar baru. "id" TIDAK diisi manual -- SQLite otomatis kasih
 *  nomor berikutnya yang belum terpakai untuk kolom INTEGER PRIMARY KEY. */
function create(room) {
  const result = db.prepare(`
    INSERT INTO rooms (name, type, cap, bed, size, price, available, perks, hills, valley)
    VALUES (@name, @type, @cap, @bed, @size, @price, @available, @perks, @hills, @valley)
  `).run({ ...room, perks: JSON.stringify(room.perks) });

  return findById(result.lastInsertRowid);
}

// Daftar kolom yang BOLEH diubah lewat update() -- nama kolom tidak bisa
// diamankan pakai parameter (@nama) seperti nilai biasa, jadi dibatasi di
// sini supaya tidak ada nama kolom "liar" yang ikut ditempel ke query.
const EDITABLE_FIELDS = ["name", "type", "cap", "bed", "size", "price", "available", "perks", "hills", "valley"];

/** Ubah SEBAGIAN data kamar -- cuma field yang ada di objek "changes" yang
 *  diubah, field lain yang tidak dikirim TETAP seperti semula. Field di
 *  luar EDITABLE_FIELDS diabaikan (bukan error, cuma dilewati saja). */
function update(id, changes) {
  const fields = Object.keys(changes).filter((f) => EDITABLE_FIELDS.includes(f));
  if (fields.length === 0) return findById(id);

  const setClause = fields.map((f) => `${f} = @${f}`).join(", ");
  const params = { id };
  fields.forEach((f) => {
    params[f] = f === "perks" ? JSON.stringify(changes[f]) : changes[f];
  });

  db.prepare(`UPDATE rooms SET ${setClause} WHERE id = @id`).run(params);
  return findById(id);
}

/** Hapus kamar berdasarkan id. Mengembalikan true kalau ada baris yang
 *  terhapus, false kalau id-nya memang tidak ada dari awal. */
function remove(id) {
  const result = db.prepare("DELETE FROM rooms WHERE id = ?").run(id);
  return result.changes > 0;
}

module.exports = { findAll, findById, create, update, remove };
