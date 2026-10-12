const Database = require("better-sqlite3");
const db = new Database("tirta-senja.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    cap INTEGER NOT NULL,
    bed TEXT NOT NULL,
    size INTEGER NOT NULL,
    price INTEGER NOT NULL,
    available INTEGER NOT NULL,
    perks TEXT NOT NULL,
    hills TEXT NOT NULL,
    valley TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    code TEXT PRIMARY KEY,
    room_id INTEGER NOT NULL,
    room_name TEXT NOT NULL,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    nights INTEGER NOT NULL,
    room_count INTEGER NOT NULL,
    guest_name TEXT NOT NULL,
    total INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )
`);

// Seed: isi tabel rooms SEKALI SAJA, pas pertama kali databasenya kosong.
// Kalau dijalankan lagi (server restart), tabel sudah ada isinya, jadi
// blok ini dilewati -- mencegah data dobel tiap kali server nyala ulang.
const roomCount = db.prepare("SELECT COUNT(*) AS total FROM rooms").get().total;

if (roomCount === 0) {
  const ROOMS = require("./data/rooms.js");
  const insert = db.prepare(`
    INSERT INTO rooms (id, name, type, cap, bed, size, price, available, perks, hills, valley)
    VALUES (@id, @name, @type, @cap, @bed, @size, @price, @left, @perks, @hills, @valley)
  `);

  for (const room of ROOMS) {
    insert.run({ ...room, perks: JSON.stringify(room.perks) });
  }

  console.log(`Seed: ${ROOMS.length} kamar dimasukkan ke database.`);
}

module.exports = db;