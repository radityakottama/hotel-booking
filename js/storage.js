/**
 * storage.js
 * Menyimpan riwayat pesanan di browser (localStorage).
 * Jika localStorage diblokir (mode privat, dsb.), data disimpan di memori
 * dan hilang saat halaman ditutup. Aplikasi tetap berjalan.
 */

const BookingStore = (() => {
  let memory = [];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || "[]");
    } catch (err) {
      return memory;
    }
  }

  /** Tambah pesanan baru di urutan paling atas. */
  function add(booking) {
    const all = load();
    all.unshift(booking);
    memory = all;
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(all));
    } catch (err) {
      /* abaikan: data tetap ada di memori */
    }
  }

  return { load, add };
})();
