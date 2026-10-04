/**
 * booking.js
 * Logika bisnis murni: tidak menyentuh DOM, tidak memakai localStorage.
 * Karena "murni", semua fungsi di sini mudah diuji (lihat tests/booking.test.js)
 * dan bisa dipelajari tanpa perlu membuka browser.
 */

const Booking = (() => {
  const DAY_MS = 24 * 60 * 60 * 1000;

  /** Ubah Date ke "YYYY-MM-DD" memakai zona waktu LOKAL.
   *  (toISOString() memakai UTC, sehingga dekat tengah malam di WITA
   *  tanggalnya bisa mundur satu hari.) */
  function toLocalISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  /** Jumlah malam antara dua tanggal "YYYY-MM-DD".
   *  Keduanya dibaca sebagai UTC agar pergantian jam musim panas tidak mengganggu hitungan. */
  function nightsBetween(checkIn, checkOut) {
    const a = Date.parse(`${checkIn}T00:00:00Z`);
    const b = Date.parse(`${checkOut}T00:00:00Z`);
    return Math.round((b - a) / DAY_MS);
  }

  /** Validasi tanggal. Mengembalikan pesan error, atau "" jika valid.
   *  String ISO "YYYY-MM-DD" bisa dibandingkan langsung dengan < dan >. */
  function validateDates(checkIn, checkOut, todayISO) {
    if (!checkIn || !checkOut) return "Isi tanggal check-in dan check-out.";
    if (checkIn < todayISO) return "Tanggal check-in tidak boleh sebelum hari ini.";
    if (checkOut <= checkIn) return "Tanggal check-out harus setelah check-in.";
    return "";
  }

  /** Apakah kamar ini bisa dipesan untuk jumlah tamu dan kamar tertentu?
   *  Syarat 1: total kapasitas cukup. Syarat 2: stok kamar cukup. */
  function canBook(room, guests, roomCount) {
    return room.cap * roomCount >= guests && room.left >= roomCount;
  }

  /** Rincian harga. Biaya layanan dihitung dari subtotal,
   *  pajak dihitung dari (subtotal + biaya layanan). Semua dibulatkan ke Rupiah. */
  function priceBreakdown(pricePerNight, nights, roomCount, rates) {
    const subtotal = pricePerNight * nights * roomCount;
    const service = Math.round(subtotal * rates.service);
    const tax = Math.round((subtotal + service) * rates.tax);
    return { subtotal, service, tax, total: subtotal + service + tax };
  }

  /** Validasi data tamu. Mengembalikan pesan error, atau "" jika valid. */
  function validateGuest({ name, email, phone }) {
    if (name.trim().length < 3) return "Nama minimal 3 karakter.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Format email belum benar.";
    if (!/^[0-9+\- ]{9,15}$/.test(phone.trim())) return "No. HP harus 9–15 digit.";
    return "";
  }

  /** Kode pesanan, contoh: TS-K3X9QA. `rand` bisa diganti saat pengujian. */
  function generateCode(prefix, rand = Math.random) {
    return `${prefix}-${rand().toString(36).slice(2, 8).toUpperCase()}`;
  }

  return { toLocalISO, nightsBetween, validateDates, canBook, priceBreakdown, validateGuest, generateCode };
})();

// Agar file ini bisa diuji di Node.js tanpa mengubah cara kerjanya di browser.
if (typeof module !== "undefined" && module.exports) module.exports = Booking;
