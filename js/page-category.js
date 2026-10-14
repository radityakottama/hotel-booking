/**
 * page-category.js
 * SATU file ini melayani SEMUA halaman kategori (Dining, Spa, Experience,
 * dst). Kategori mana yang ditampilkan ditentukan oleh parameter "slug"
 * di URL (contoh: category.html?slug=spa), bukan oleh nama file HTML.
 *
 * Menambah kategori baru = menambah satu baris di tabel "categories"
 * (lewat admin, atau langsung di database). Tidak perlu bikin file HTML
 * atau JS baru sama sekali.
 */

/** Ambil kategori dari backend. Dulu dibaca dari objek statis CATEGORIES
 *  di data-categories.js, sekarang datanya di database (bisa diedit lewat
 *  admin/index.html panel Spa/Dining/Experience). */
async function fetchCategory(slug) {
  const response = await fetch(`${API_CATEGORIES}/${slug}`);
  return response.ok ? response.json() : null;
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
