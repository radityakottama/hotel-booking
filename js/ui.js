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

  /** Kartu satu kamar. Tombol "Pesan" meredirect ke booking engine
   *  eksternal (lihat goToBookingEngine di app.js) -- situs ini cuma
   *  menampilkan konten kamar, bukan memproses booking sendiri. */
  function roomCard(room) {
    const perks = room.perks.map((p) => `<span>${p}</span>`).join("");

    return `<article class="room">
      <div class="art">${roomArt(room)}</div>
      <div class="rb">
        <h3>${room.name}</h3>
        <div class="meta">${room.type} · ${room.size} m² · ${room.bed} · maks. ${room.cap} tamu</div>
        <div class="am">${perks}</div>
        <div class="pr">
          <div><b>${rupiah(room.price)}</b><small> /malam</small></div>
          <button class="btn" data-room="${room.id}">Pesan</button>
        </div>
      </div>
    </article>`;
  }

  /** Kartu konten generik (judul + deskripsi + 1 gambar).
   *  Dipakai untuk halaman kategori seperti Dining, Spa, Experience —
   *  formatnya sama, konten (data) yang beda-beda per halaman.
   *  `index` menentukan apakah kartu ini "big" (kartu pertama, langsung
   *  terlihat sehingga tidak di-lazy-load) atau kartu biasa. */
  function contentCard(item, index) {
    const sizeClass = item.big ? "big" : "";
    const lazyAttr = index === 0 ? "" : ' loading="lazy"';
    return `<article class="card reveal ${sizeClass}">
      <img src="${item.image}" alt="${escapeHtml(item.title)}"${lazyAttr}>
      <div class="cb">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.desc)}</p>
      </div>
    </article>`;
  }

  function emptyState(message) {
    return `<div class="empty">${message}</div>`;
  }

  return { rupiah, formatDate, escapeHtml, filterChips, roomCard, contentCard, emptyState };
})();
