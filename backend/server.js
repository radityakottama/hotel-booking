const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const db = require("./db.js");
const Room = require("./models/Room.js");
const BookingModel = require("./models/Booking.js");
const Booking = require("../js/booking.js"); // logika murni (hitung harga, validasi) -- beda dari BookingModel (urusan database)

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Halo dari dapur!");
});

/** Isi `left` kamar dengan sisa kamar untuk rentang tanggal itu
 *  (jumlah unit dikurangi pesanan yang bentrok di malam terpenuh). */
function withAvailability(room, checkIn, checkOut) {
  const bookings = BookingModel.findOverlapping(room.id, checkIn, checkOut);
  return { ...room, left: Booking.roomsLeft(room.left, bookings, checkIn, checkOut) };
}

// GET /api/rooms                         -> left = jumlah unit (dipakai Admin Panel)
// GET /api/rooms?checkIn=...&checkOut=... -> left = sisa kamar di tanggal itu
app.get("/api/rooms", (req, res) => {
  const { checkIn, checkOut } = req.query;
  const rooms = Room.findAll();
  if (!checkIn && !checkOut) return res.json(rooms);

  // Di sini tanggal lampau tidak ditolak (pakai "" sebagai hari ini) --
  // cuma mau tahu ketersediaan, bukan memesan.
  const dateError = Booking.validateDates(checkIn, checkOut, "");
  if (dateError) return res.status(400).json({ error: dateError });

  res.json(rooms.map((room) => withAvailability(room, checkIn, checkOut)));
});

app.post("/api/rooms", (req, res) => {
  const { name, type, cap, bed, size, price, available, perks, hills, valley } = req.body;

  // Semua kolom ini NOT NULL di database (lihat db.js) -- kalau salah satu
  // kosong, INSERT akan gagal dengan error SQLite mentah yang membocorkan
  // detail internal server. Divalidasi dulu di sini supaya gagalnya rapi
  // (400 + pesan jelas), bukan crash (500).
  if (!name || !type || !cap || !bed || !size || !price || available == null) {
    return res.status(400).json({ error: "Nama, tipe, kapasitas, tempat tidur, luas, harga, dan stok kamar wajib diisi." });
  }

  const room = Room.create({
    name, type, cap, bed, size, price, available,
    perks: perks || [],
    hills: hills || "#7fb98b",
    valley: valley || "#3d7a5a",
  });

  res.status(201).json(room);
});

app.patch("/api/rooms/:id", (req, res) => {
  const room = Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: "Kamar tidak ditemukan." });

  const updated = Room.update(req.params.id, req.body);
  res.json(updated);
});

app.delete("/api/rooms/:id", (req, res) => {
  const deleted = Room.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Kamar tidak ditemukan." });
  res.status(204).send();
});

app.post("/api/bookings", (req, res) => {
  const { roomId, checkIn, checkOut, roomCount, guest } = req.body;

  const room = Room.findById(roomId);
  if (!room) return res.status(404).json({ error: "Kamar tidak ditemukan." });

  const today = Booking.toLocalISO(new Date());
  const dateError = Booking.validateDates(checkIn, checkOut, today);
  if (dateError) return res.status(400).json({ error: dateError });

  const guestError = Booking.validateGuest(guest);
  if (guestError) return res.status(400).json({ error: guestError });

  const nights = Booking.nightsBetween(checkIn, checkOut);
  const price = Booking.priceBreakdown(room.price, nights, roomCount, { service: 0.10, tax: 0.11 });
  const code = Booking.generateCode("TS");

  // Cek sisa kamar DAN simpan pesanan di dalam satu transaction. Stok
  // tidak lagi dikurangi permanen: sisa kamar dihitung ulang dari pesanan
  // yang tanggalnya bentrok. Karena cek dan simpan terjadi di transaction
  // yang sama, dua pesanan yang datang bersamaan tidak bisa sama-sama
  // lolos lalu membuat kamar "minus".
  const saveBooking = db.transaction(() => {
    if (!Booking.canBook(withAvailability(room, checkIn, checkOut), guest.adults, roomCount)) {
      return false;
    }
    BookingModel.create({
      code, roomId: room.id, roomName: room.name, checkIn, checkOut, nights,
      roomCount, guestName: guest.name.trim(), total: price.total,
    });
    return true;
  });
  if (!saveBooking()) {
    return res.status(400).json({ error: "Kamar tidak muat atau sudah penuh di tanggal itu." });
  }

  res.json({
    code,
    room: room.name,
    checkIn, checkOut, nights,
    rooms: roomCount,
    name: guest.name.trim(),
    total: price.total,
  });
});

// Error-handling middleware -- Express mengenalinya KHUSUS karena punya 4
// parameter (err, req, res, next), harus ditulis TERAKHIR (setelah semua
// route). Kalau ada error yang tidak sengaja lolos dari penanganan di route
// manapun (misalnya body kosong/salah format), ini jadi jaring pengaman
// terakhir -- server tetap hidup, cuma request itu yang gagal dengan rapi.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Terjadi kesalahan di server." });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
