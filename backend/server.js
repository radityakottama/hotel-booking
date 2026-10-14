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

app.get("/api/rooms", (req, res) => {
  res.json(Room.findAll());
});

app.post("/api/rooms", (req, res) => {
  const { name, type, cap, bed, size, price, available, perks, hills, valley } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Nama dan harga kamar wajib diisi." });
  }

  const room = Room.create({
    name, type, cap, bed, size, price, available,
    perks: perks || [],
    hills: hills || "#7fb98b",
    valley: valley || "#3d7a5a",
  });

  res.status(201).json(room);
});

app.post("/api/bookings", (req, res) => {
  const { roomId, checkIn, checkOut, roomCount, guest } = req.body;

  const room = Room.findById(roomId);
  if (!room) return res.status(404).json({ error: "Kamar tidak ditemukan." });

  const today = Booking.toLocalISO(new Date());
  const dateError = Booking.validateDates(checkIn, checkOut, today);
  if (dateError) return res.status(400).json({ error: dateError });

  if (!Booking.canBook(room, guest.adults, roomCount)) {
    return res.status(400).json({ error: "Kamar tidak muat atau stok tidak cukup." });
  }

  const guestError = Booking.validateGuest(guest);
  if (guestError) return res.status(400).json({ error: guestError });

  const nights = Booking.nightsBetween(checkIn, checkOut);
  const price = Booking.priceBreakdown(room.price, nights, roomCount, { service: 0.10, tax: 0.11 });
  const code = Booking.generateCode("TS");

  // Simpan booking DAN kurangi stok sekaligus, lewat transaction -- supaya
  // dua-duanya berhasil bersamaan, atau dua-duanya batal bersamaan kalau
  // tiba-tiba ada error di tengah.
  const saveBooking = db.transaction(() => {
    BookingModel.create({
      code, roomId: room.id, roomName: room.name, checkIn, checkOut, nights,
      roomCount, guestName: guest.name.trim(), total: price.total,
    });
    Room.decreaseStock(room.id, roomCount);
  });
  saveBooking();

  res.json({
    code,
    room: room.name,
    checkIn, checkOut, nights,
    rooms: roomCount,
    name: guest.name.trim(),
    total: price.total,
  });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
