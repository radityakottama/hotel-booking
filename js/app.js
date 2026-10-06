/**
 * app.js
 * Titik masuk aplikasi: menyimpan state, memasang event listener,
 * dan menghubungkan logika (booking.js) dengan tampilan (ui.js).
 *
 * Urutan baca yang disarankan untuk belajar:
 *   data.js -> booking.js -> storage.js -> ui.js -> app.js
 */

(async () => {
  await window.partialsReady; // tunggu header (dan partial lain nanti) selesai dimuat sebelum mencari elemen apa pun

  const $ = (selector) => document.querySelector(selector);
  const dialog = $("#dlg");
  const dialogBody = $("#dgc");

  const today = Booking.toLocalISO(new Date());
  const inDays = (n) => Booking.toLocalISO(new Date(Date.now() + n * 86400000));

  // State aplikasi: satu objek, diubah hanya lewat event handler di bawah.
  const state = {
    type: "Semua",
    sort: "price-asc",
    checkIn: inDays(1),
    checkOut: inDays(3),
    adults: 2,
    rooms: 1,
  };

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
    const nights = Booking.nightsBetween(state.checkIn, state.checkOut);
    const visible = ROOMS.filter((r) => state.type === "Semua" || r.type === state.type);

    $("#grid").innerHTML = visible.length
      ? sortRooms(visible)
          .map((room) =>
            UI.roomCard(room, {
              nights,
              roomCount: state.rooms,
              bookable: Booking.canBook(room, state.adults, state.rooms),
            }))
          .join("")
      : UI.emptyState("Tidak ada kamar untuk filter ini. Pilih tipe lain.");
  }

  // ---------- Dialog ----------

  function showDialog(html) {
    dialogBody.innerHTML = html;
    if (!dialog.open) dialog.showModal();
  }

  function openBookingForm(room) {
    const nights = Booking.nightsBetween(state.checkIn, state.checkOut);
    const price = Booking.priceBreakdown(room.price, nights, state.rooms, {
      service: CONFIG.SERVICE_RATE,
      tax: CONFIG.TAX_RATE,
    });
    showDialog(UI.bookingForm(room, state, nights, price));
    $("#guest-name").focus();
    $("#btn-cancel").onclick = () => dialog.close();
    $("#btn-confirm").onclick = () => confirmBooking(room, nights, price);
  }

  function confirmBooking(room, nights, price) {
    const guest = {
      name: $("#guest-name").value,
      email: $("#guest-email").value,
      phone: $("#guest-phone").value,
    };
    const error = Booking.validateGuest(guest);
    if (error) {
      $("#form-error").textContent = error;
      return;
    }

    const booking = {
      code: Booking.generateCode(CONFIG.CODE_PREFIX),
      room: room.name,
      checkIn: state.checkIn,
      checkOut: state.checkOut,
      nights,
      rooms: state.rooms,
      name: guest.name.trim(),
      total: price.total,
    };
    BookingStore.add(booking);
    showDialog(UI.confirmation(booking));
    $("#btn-close").onclick = () => dialog.close();
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
    renderRooms();
    $("#grid").scrollIntoView({ behavior: "smooth" });
  });

  $("#grid").addEventListener("click", (e) => {
    const button = e.target.closest("button[data-room]");
    if (!button) return;
    openBookingForm(ROOMS.find((r) => r.id === Number(button.dataset.room)));
  });

  $("#myBk").addEventListener("click", () => {
    showDialog(UI.myBookings(BookingStore.load()));
    $("#btn-close").onclick = () => dialog.close();
  });

  // ---------- Inisialisasi ----------

  $("#ci").value = state.checkIn;
  $("#ci").min = today;
  $("#co").value = state.checkOut;
  $("#ad").innerHTML = Array.from({ length: CONFIG.MAX_ADULTS }, (_, i) =>
    `<option ${i + 1 === state.adults ? "selected" : ""}>${i + 1}</option>`).join("");
  $("#rm").innerHTML = Array.from({ length: CONFIG.MAX_ROOMS }, (_, i) => `<option>${i + 1}</option>`).join("");

  renderChips();
  renderRooms();
})();
