/**
 * booking.js
 * Logika bisnis murni: tidak menyentuh DOM, tidak memakai localStorage.
 * Karena "murni", semua fungsi di sini mudah diuji (lihat tests/booking.test.js)
 * dan bisa dipelajari tanpa perlu membuka browser.
 *
 * Catatan: dulu file ini juga berisi logika booking in-house (canBook,
 * roomsLeft, priceBreakdown, dst) -- sekarang booking sungguhan jadi
 * tanggung jawab booking engine eksternal (lihat CONFIG.BOOKING_ENGINE_URL
 * di js/data.js), jadi yang tersisa cuma yang masih dipakai: validasi
 * form pencarian tanggal.
 */

const Booking = (() => {
  /** Ubah Date ke "YYYY-MM-DD" memakai zona waktu LOKAL.
   *  (toISOString() memakai UTC, sehingga dekat tengah malam di WITA
   *  tanggalnya bisa mundur satu hari.) */
  function toLocalISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  /** Validasi tanggal. Mengembalikan pesan error, atau "" jika valid.
   *  String ISO "YYYY-MM-DD" bisa dibandingkan langsung dengan < dan >. */
  function validateDates(checkIn, checkOut, todayISO) {
    if (!checkIn || !checkOut) return "Isi tanggal check-in dan check-out.";
    if (checkIn < todayISO) return "Tanggal check-in tidak boleh sebelum hari ini.";
    if (checkOut <= checkIn) return "Tanggal check-out harus setelah check-in.";
    return "";
  }

  return { toLocalISO, validateDates };
})();

// Agar file ini bisa diuji di Node.js tanpa mengubah cara kerjanya di browser.
if (typeof module !== "undefined" && module.exports) module.exports = Booking;
