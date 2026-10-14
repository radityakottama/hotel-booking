// Jalankan dengan: npm test   (butuh Node.js 18 atau lebih baru)
const test = require("node:test");
const assert = require("node:assert/strict");
const Booking = require("../js/booking.js");

const RATES = { service: 0.10, tax: 0.11 };

test("nightsBetween menghitung jumlah malam", () => {
  assert.equal(Booking.nightsBetween("2026-10-05", "2026-10-08"), 3);
  assert.equal(Booking.nightsBetween("2026-12-31", "2027-01-02"), 2);
});

test("toLocalISO memakai tanggal lokal, bukan UTC", () => {
  assert.equal(Booking.toLocalISO(new Date(2026, 0, 5, 23, 30)), "2026-01-05");
});

test("validateDates menolak input yang salah", () => {
  const today = "2026-10-04";
  assert.match(Booking.validateDates("", "2026-10-06", today), /Isi tanggal/);
  assert.match(Booking.validateDates("2026-10-03", "2026-10-06", today), /sebelum hari ini/);
  assert.match(Booking.validateDates("2026-10-06", "2026-10-06", today), /setelah check-in/);
  assert.equal(Booking.validateDates("2026-10-04", "2026-10-06", today), "");
});

test("canBook memeriksa kapasitas dan stok", () => {
  const room = { cap: 2, left: 2 };
  assert.equal(Booking.canBook(room, 2, 1), true);
  assert.equal(Booking.canBook(room, 3, 1), false); // kapasitas kurang
  assert.equal(Booking.canBook(room, 4, 2), true);
  assert.equal(Booking.canBook(room, 2, 3), false); // stok kurang
});

test("roomsLeft menghitung sisa kamar per malam, bukan per pesanan", () => {
  const bookings = [
    { checkIn: "2026-11-01", checkOut: "2026-11-03", roomCount: 1 }, // malam 1, 2
    { checkIn: "2026-11-03", checkOut: "2026-11-05", roomCount: 2 }, // malam 3, 4
  ];
  assert.equal(Booking.roomsLeft(3, [], "2026-11-01", "2026-11-03"), 3);       // belum ada pesanan
  assert.equal(Booking.roomsLeft(3, bookings, "2026-11-01", "2026-11-03"), 2); // cuma pesanan pertama
  assert.equal(Booking.roomsLeft(3, bookings, "2026-11-02", "2026-11-04"), 1); // malam 3 paling penuh (2)
  assert.equal(Booking.roomsLeft(3, bookings, "2026-11-05", "2026-11-07"), 3); // check-out tgl 5 tidak bentrok
  assert.equal(Booking.roomsLeft(3, bookings, "2026-10-30", "2026-11-01"), 3); // check-in tgl 1 tidak bentrok
  assert.equal(Booking.roomsLeft(1, bookings, "2026-11-03", "2026-11-04"), 0); // tidak pernah minus
});

test("priceBreakdown: layanan 10% lalu pajak 11% dari (subtotal + layanan)", () => {
  const p = Booking.priceBreakdown(1000000, 2, 1, RATES);
  assert.equal(p.subtotal, 2000000);
  assert.equal(p.service, 200000);
  assert.equal(p.tax, 242000);
  assert.equal(p.total, 2442000);
});

test("roomsLeft menghitung sisa kamar per malam, bukan per pesanan", () => {
  const bookings = [
    { checkIn: "2026-11-01", checkOut: "2026-11-03", roomCount: 1 }, // malam 1, 2
    { checkIn: "2026-11-03", checkOut: "2026-11-05", roomCount: 2 }, // malam 3, 4
  ];
  assert.equal(Booking.roomsLeft(3, [], "2026-11-01", "2026-11-03"), 3);       // belum ada pesanan
  assert.equal(Booking.roomsLeft(3, bookings, "2026-11-01", "2026-11-03"), 2); // cuma pesanan pertama
  assert.equal(Booking.roomsLeft(3, bookings, "2026-11-02", "2026-11-04"), 1); // malam 3 paling penuh (2)
  assert.equal(Booking.roomsLeft(3, bookings, "2026-11-05", "2026-11-07"), 3); // check-out tgl 5 tidak bentrok
  assert.equal(Booking.roomsLeft(3, bookings, "2026-10-30", "2026-11-01"), 3); // check-in tgl 1 tidak bentrok
  assert.equal(Booking.roomsLeft(1, bookings, "2026-11-03", "2026-11-04"), 0); // tidak pernah minus
});

test("priceBreakdown mengalikan jumlah kamar", () => {
  assert.equal(Booking.priceBreakdown(850000, 3, 2, RATES).subtotal, 5100000);
});

test("validateGuest memeriksa nama, email, dan nomor HP", () => {
  const ok = { name: "Raditya", email: "a@b.co", phone: "081234567890" };
  assert.equal(Booking.validateGuest(ok), "");
  assert.match(Booking.validateGuest({ ...ok, name: "Al" }), /Nama/);
  assert.match(Booking.validateGuest({ ...ok, email: "salah" }), /email/);
  assert.match(Booking.validateGuest({ ...ok, phone: "123" }), /HP/);
});

test("generateCode berformat PREFIX-XXXXXX", () => {
  assert.match(Booking.generateCode("TS"), /^TS-[A-Z0-9]{1,6}$/);
  assert.equal(Booking.generateCode("TS", () => 0.5), "TS-I");
});
