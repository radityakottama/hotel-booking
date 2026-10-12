const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const ROOMS = require("./data/rooms.js");
const Booking = require("./js/booking.js");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Halo dari dapur!");
});

app.get("/api/rooms", (req, res) => {
  res.json(ROOMS);
});

app.post("/api/bookings", (req, res) => {
  const { roomId, checkIn, checkOut, roomCount, guest } = req.body;

  const room = ROOMS.find((r) => r.id === roomId);
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

  res.json({
    code: Booking.generateCode("TS"),
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