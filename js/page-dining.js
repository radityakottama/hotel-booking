/**
 * page-dining.js
 * Menghubungkan data (DINING_ITEMS) + fungsi render (UI.contentCard)
 * khusus untuk halaman Dining. Pola file ini yang nanti disalin untuk
 * halaman kategori lain (page-spa.js, page-experience.js, dst).
 */
document.querySelector("#gallery").innerHTML = DINING_ITEMS
  .map((item, index) => UI.contentCard(item, index))
  .join("");

observeReveal();
