// Jalankan dengan: npm test   (butuh Node.js 18 atau lebih baru)
const test = require("node:test");
const assert = require("node:assert/strict");
const Booking = require("../js/booking.js");

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
