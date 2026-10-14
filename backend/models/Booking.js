/**
 * models/Booking.js
 * Query SQL untuk tabel "bookings". Namanya sengaja "Booking" (mirip
 * js/booking.js), tapi beda tugas: file ini urusan DATABASE (simpan
 * baris), js/booking.js urusan LOGIKA (hitung harga, validasi) --
 * keduanya dipakai bersamaan di server.js, tidak saling gantikan.
 */
const db = require("../db.js");

function create(booking) {
  db.prepare(`
    INSERT INTO bookings (code, room_id, room_name, check_in, check_out, nights, room_count, guest_name, total, created_at)
    VALUES (@code, @roomId, @roomName, @checkIn, @checkOut, @nights, @roomCount, @guestName, @total, @createdAt)
  `).run({ ...booking, createdAt: new Date().toISOString() });
}

/** Pesanan untuk kamar `roomId` yang rentangnya BENTROK dengan
 *  [checkIn, checkOut). Dua rentang bentrok kalau masing-masing mulai
 *  sebelum yang lain selesai -- tanggal "YYYY-MM-DD" bisa dibandingkan
 *  langsung sebagai teks, jadi cukup pakai < di SQL.
 *  Kolom diberi alias supaya bentuknya cocok dengan Booking.roomsLeft. */
function findOverlapping(roomId, checkIn, checkOut) {
  return db.prepare(`
    SELECT check_in AS checkIn, check_out AS checkOut, room_count AS roomCount
    FROM bookings
    WHERE room_id = ? AND check_in < ? AND ? < check_out
  `).all(roomId, checkOut, checkIn);
}

module.exports = { create, findOverlapping };
