/**
 * nav.js
 * Mengisi link navigasi di header dari daftar kategori di backend.
 * Jadi kalau judul kategori diubah lewat admin, link menunya otomatis
 * ikut berubah di SEMUA halaman — tidak perlu edit partials/header.html.
 *
 * Menunggu window.partialsReady dulu (header harus sudah ada di DOM),
 * sama seperti listener #menuBtn di partials.js.
 */
window.partialsReady.then(async () => {
  const categories = await fetch(API_CATEGORIES).then((r) => r.json());
  const categoryLinks = categories
    .map((category) => `<a href="category.html?slug=${category.slug}" class="navlink">${category.title}</a>`)
    .join("");
  // "Virtual Tour" bukan kategori konten (tidak ada di tabel categories),
  // jadi ditulis statis di sini -- tapi tetap lewat nav.js supaya satu
  // sumber untuk seluruh isi menu, bukan ditulis terpisah di partials/header.html.
  const tourLink = `<a href="tour.html" class="navlink">Virtual Tour</a>`;
  document.querySelector("#nav-links").innerHTML = categoryLinks + tourLink;
});
