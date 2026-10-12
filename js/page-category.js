/**
 * page-category.js
 * SATU file ini melayani SEMUA halaman kategori (Dining, Spa, Experience,
 * dst). Kategori mana yang ditampilkan ditentukan oleh parameter "slug"
 * di URL (contoh: category.html?slug=spa), bukan oleh nama file HTML.
 *
 * Menambah kategori baru = menambah satu entri di data-categories.js.
 * Tidak perlu bikin file HTML atau JS baru sama sekali.
 */

/** Ditulis seolah async (menunggu), walau datanya masih lokal, supaya
 *  nanti gampang diganti jadi fetch() sungguhan ke API tanpa mengubah
 *  kode lain di file ini — cukup ganti isi fungsi ini saja. */
async function fetchCategory(slug) {
  // Nanti kalau sudah ada backend, baris di atas diganti jadi:
  // return fetch(`/api/categories/${slug}`).then((r) => r.json());
  return CATEGORIES[slug] || null;
}

(async () => {
  const slug = new URLSearchParams(location.search).get("slug");
  const category = await fetchCategory(slug);

  if (!category) {
    document.querySelector("#page-title").textContent = "Halaman tidak ditemukan";
    document.querySelector("#gallery").innerHTML = UI.emptyState(`Kategori "${slug}" tidak ditemukan.`);
    return;
  }

  document.querySelector("#page-title").textContent = category.title;
  document.title = `Tirta Senja Resort – ${category.title}`;
  document.querySelector("#gallery").innerHTML = category.items
    .map((item, index) => UI.contentCard(item, index))
    .join("");

  observeReveal();
})();
