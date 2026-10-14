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

module.exports = { create };
