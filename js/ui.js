/**
 * ui.js
 * Fungsi yang menghasilkan HTML (template). Tidak menyimpan state dan tidak
 * memasang event listener; itu tugas app.js.
 */

const UI = (() => {
  const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  /** Mencegah XSS: teks dari pengguna (mis. nama) tidak boleh dimasukkan ke
   *  innerHTML apa adanya, karena bisa berisi tag HTML berbahaya. */
  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /** Ilustrasi kamar berupa SVG: langit bergradasi, matahari, dan tiga lapis bukit. */
  function roomArt(room) {
    const gid = `sky-${room.id}`;
    return `<svg viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="var(--sky1)"/><stop offset="1" stop-color="var(--sky2)"/>
      </linearGradient></defs>
      <rect width="300" height="150" fill="url(#${gid})"/>
      <circle cx="235" cy="42" r="20" fill="#e8a33d" opacity=".9"/>
      <path d="M0 100 Q75 60 150 95 T300 85 V150 H0Z" fill="${room.hills}"/>
      <path d="M0 120 Q90 88 180 118 T300 110 V150 H0Z" fill="${room.valley}"/>
      <path d="M0 138 Q100 118 200 136 T300 130 V150 H0Z" fill="#12302c" opacity=".35"/>
    </svg>`;
  }

  function filterChips(types, activeType) {
    return types
      .map((t) => `<button class="chip" aria-pressed="${t === activeType}" data-type="${t}">${t}</button>`)
      .join("");
  }

  /** Kartu satu kamar. `bookable` menentukan tombol aktif atau nonaktif. */
  function roomCard(room, { nights, roomCount, bookable }) {
    const perks = room.perks.map((p) => `<span>${p}</span>`).join("");
    const scarcity = room.left <= 2 ? `<div class="left">Sisa ${room.left} kamar</div>` : "";
    const stayTotal = nights > 0
      ? `<small>${rupiah(room.price * nights * roomCount)} untuk ${nights} malam</small>` : "";
    const button = bookable
      ? `<button class="btn" data-room="${room.id}">Pesan</button>`
      : `<button class="btn" disabled>Tidak muat</button>`;

    return `<article class="room">
      <div class="art">${roomArt(room)}</div>
      <div class="rb">
        <h3>${room.name}</h3>
        <div class="meta">${room.type} · ${room.size} m² · ${room.bed} · maks. ${room.cap} tamu</div>
        <div class="am">${perks}</div>
        ${scarcity}
        <div class="pr">
          <div><b>${rupiah(room.price)}</b><small> /malam</small><br>${stayTotal}</div>
          ${button}
        </div>
      </div>
    </article>`;
  }

  function emptyState(message) {
    return `<div class="empty">${message}</div>`;
  }

  function summaryRows(lines, total) {
    const rows = lines.map(([label, value]) => `<div><span>${label}</span><span>${value}</span></div>`).join("");
    return `<div class="sum">${rows}<div class="t"><span>Total</span><span>${rupiah(total)}</span></div></div>`;
  }

  /** Isi dialog form pemesanan. */
  function bookingForm(room, search, nights, price) {
    const lines = [
      [`${rupiah(room.price)} × ${nights} malam × ${search.rooms}`, rupiah(price.subtotal)],
      [`Biaya layanan ${CONFIG.SERVICE_RATE * 100}%`, rupiah(price.service)],
      [`Pajak ${CONFIG.TAX_RATE * 100}%`, rupiah(price.tax)],
    ];
    return `<h2>${room.name}</h2>
      <div class="meta">${formatDate(search.checkIn)} – ${formatDate(search.checkOut)} · ${nights} malam · ${search.rooms} kamar · ${search.adults} tamu</div>
      <label>Nama lengkap<input id="guest-name" autocomplete="name"></label>
      <div class="row">
        <label>Email<input id="guest-email" type="email" autocomplete="email"></label>
        <label>No. HP<input id="guest-phone" type="tel" autocomplete="tel"></label>
      </div>
      <label>Permintaan khusus (opsional)<input id="guest-note" placeholder="Contoh: lantai atas, check-in malam"></label>
      ${summaryRows(lines, price.total)}
      <div class="err" id="form-error" role="alert"></div>
      <div class="row">
        <button class="btn sec" id="btn-cancel">Batal</button>
        <button class="btn" id="btn-confirm">Konfirmasi pesanan</button>
      </div>`;
  }

  function confirmation(b) {
    return `<h2>Pesanan berhasil</h2>
      <div class="meta">Simpan kode ini untuk check-in, ${escapeHtml(b.name)}.</div>
      <div class="code">${escapeHtml(b.code)}</div>
      <div class="sum">
        <div><span>Kamar</span><span>${escapeHtml(b.room)}</span></div>
        <div><span>Tanggal</span><span>${formatDate(b.checkIn)} – ${formatDate(b.checkOut)}</span></div>
        <div class="t"><span>Total</span><span>${rupiah(b.total)}</span></div>
      </div>
      <button class="btn" id="btn-close">Selesai</button>`;
  }

  function myBookings(list) {
    const body = list.length
      ? list.map((b) => `<div class="bk">
          <div><b>${escapeHtml(b.code)}</b><br>${escapeHtml(b.room)}<br>
          <span class="meta">${formatDate(b.checkIn)} – ${formatDate(b.checkOut)}</span></div>
          <b>${rupiah(b.total)}</b></div>`).join("")
      : emptyState("Belum ada pesanan. Pilih kamar dan buat pesanan pertama Anda.");
    return `<h2>Pesanan saya</h2>${body}<button class="btn sec" id="btn-close">Tutup</button>`;
  }

  return { rupiah, formatDate, escapeHtml, filterChips, roomCard, emptyState, bookingForm, confirmation, myBookings };
})();
