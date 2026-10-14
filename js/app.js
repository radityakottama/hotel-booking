/**
 * app.js
 * Titik masuk aplikasi: menyimpan state, memasang event listener,
 * dan menghubungkan logika (booking.js) dengan tampilan (ui.js).
 *
 * Urutan baca yang disarankan untuk belajar:
 *   data.js -> booking.js -> ui.js -> app.js
 *
 * Catatan arsitektur: situs ini CUMA etalase (lihat kamar, cari tanggal).
 * Proses booking & pembayaran sungguhan terjadi di booking engine
 * eksternal -- tombol "Pesan" meredirect ke sana (goToBookingEngine di
 * bawah), bukan membuat pesanan di backend kita sendiri.
 */

(async () => {
  await window.partialsReady; // tunggu header (dan partial lain nanti) selesai dimuat sebelum mencari elemen apa pun

  const $ = (selector) => document.querySelector(selector);

  const today = Booking.toLocalISO(new Date());
  const inDays = (n) => Booking.toLocalISO(new Date(Date.now() + n * 86400000));

  /** Tambah `n` hari ke tanggal "YYYY-MM-DD", dibaca sebagai UTC supaya
   *  pergantian jam musim panas tidak menggeser hasil (pola sama seperti
   *  nightsBetween yang dulu ada di booking.js). */
  function addDays(iso, n) {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + n);
    return date.toISOString().slice(0, 10);
  }

  /** Check-out minimal sehari setelah check-in (tidak boleh sama/duluan).
   *  Dipanggil tiap kali check-in berubah, supaya input tanggal check-out
   *  BENAR-BENAR menolak pilihan yang tidak valid, bukan cuma dicegat
   *  belakangan lewat Booking.validateDates saat klik "Cari kamar". */
  function syncCheckoutMin() {
    const minCheckOut = addDays($("#ci").value, 1);
    $("#co").min = minCheckOut;
    if ($("#co").value < minCheckOut) $("#co").value = minCheckOut;
  }

  // State aplikasi: satu objek, diubah hanya lewat event handler di bawah.
  const state = {
    type: "Semua",
    sort: "price-asc",
    checkIn: inDays(1),
    checkOut: inDays(3),
    adults: 2,
    rooms: 1,
  };

  // Data kamar dari server -- konten (nama, harga, foto/perks), bukan
  // ketersediaan real-time (itu urusan booking engine).
  let ROOMS = [];

  async function loadRooms() {
    ROOMS = await fetch("http://localhost:3000/api/rooms").then((r) => r.json());
  }

  /** Isi teks hero dari CMS (admin/index.html, panel "Beranda"). Kalau server/API gagal
   *  dihubungi, teks default yang sudah ada di index.html tetap tampil --
   *  situs tidak boleh rusak cuma karena backend sedang mati. */
  async function loadContent() {
    try {
      const content = await fetch("http://localhost:3000/api/content").then((r) => r.json());
      if (content.heroTitle) $("#hero-title").textContent = content.heroTitle;
      if (content.heroSubtitle) $("#hero-subtitle").textContent = content.heroSubtitle;
    } catch {
      // Biarkan teks default di HTML yang tampil.
    }
  }

  // ---------- Render ----------

  function renderChips() {
    $("#chips").innerHTML = UI.filterChips(ROOM_TYPES, state.type);
  }

  function sortRooms(rooms) {
    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "capacity": (a, b) => b.cap - a.cap,
    };
    return [...rooms].sort(sorters[state.sort]);
  }

  function renderRooms() {
    const visible = ROOMS.filter((r) => state.type === "Semua" || r.type === state.type);

    $("#grid").innerHTML = visible.length
      ? sortRooms(visible).map((room) => UI.roomCard(room)).join("")
      : UI.emptyState("Tidak ada kamar untuk filter ini. Pilih tipe lain.");
  }

  // ---------- Booking engine ----------

  /** Redirect ke booking engine eksternal, mengikuti pola nyata yang
   *  dipakai hotel (contoh: elisonhotel.com -> secure-hotel-booking.com/d-edge/...).
   *  Parameter tanggal & jumlah tamu "dititipkan" lewat query string supaya
   *  tamu tidak perlu input ulang di halaman booking engine. */
  function goToBookingEngine(room) {
    const params = new URLSearchParams({
      arrivalDate: state.checkIn,
      departureDate: state.checkOut,
      selectedAdultCount: state.adults,
      currency: "IDR",
      promoCode: "",
      roomType: room.type,
    });
    window.location.href = `${CONFIG.BOOKING_ENGINE_URL}?${params}`;
  }

  // ---------- Event listeners ----------

  $("#chips").addEventListener("click", (e) => {
    const type = e.target.dataset.type;
    if (!type) return;
    state.type = type;
    renderChips();
    renderRooms();
  });

  $("#sort").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderRooms();
  });

  $("#go").addEventListener("click", () => {
    const checkIn = $("#ci").value;
    const checkOut = $("#co").value;
    const error = Booking.validateDates(checkIn, checkOut, today);
    $("#serr").textContent = error;
    if (error) return;

    state.checkIn = checkIn;
    state.checkOut = checkOut;
    state.adults = Number($("#ad").value);
    state.rooms = Number($("#rm").value);
    $("#grid").scrollIntoView({ behavior: "smooth" });
  });

  $("#grid").addEventListener("click", (e) => {
    const button = e.target.closest("button[data-room]");
    if (!button) return;
    goToBookingEngine(ROOMS.find((r) => r.id === Number(button.dataset.room)));
  });

  $("#ci").addEventListener("change", syncCheckoutMin);

  // ---------- Inisialisasi ----------

  $("#ci").value = state.checkIn;
  $("#ci").min = today;
  $("#co").value = state.checkOut;
  syncCheckoutMin();
  $("#ad").innerHTML = Array.from({ length: CONFIG.MAX_ADULTS }, (_, i) =>
    `<option ${i + 1 === state.adults ? "selected" : ""}>${i + 1}</option>`).join("");
  $("#rm").innerHTML = Array.from({ length: CONFIG.MAX_ROOMS }, (_, i) => `<option>${i + 1}</option>`).join("");

  await loadContent();
  await loadRooms();
  renderChips();
  renderRooms();
})();
