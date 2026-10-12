/**
 * nav.js
 * Mengisi link navigasi di header dari data CATEGORIES.
 * Jadi kalau nambah kategori baru di data-categories.js, link menunya
 * otomatis ikut bertambah di SEMUA halaman — tidak perlu edit
 * partials/header.html sama sekali.
 *
 * Menunggu window.partialsReady dulu (header harus sudah ada di DOM),
 * sama seperti listener #menuBtn di partials.js.
 */
window.partialsReady.then(() => {
  const links = Object.entries(CATEGORIES)
    .map(([slug, category]) => `<a href="category.html?slug=${slug}" class="navlink">${category.title}</a>`)
    .join("");
  // Disisipkan langsung sebagai anak <nav> (sejajar tombol "Pesanan saya"),
  // bukan dibungkus elemen lain, supaya "gap" di CSS #nav berlaku ke
  // setiap link secara individual.
  document.querySelector("#myBk").insertAdjacentHTML("beforebegin", links);
});
