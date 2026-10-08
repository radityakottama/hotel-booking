/**
 * reveal.js
 * Animasi fade-in saat elemen ".reveal" masuk area layar (viewport).
 *
 * Dibungkus jadi fungsi (bukan langsung jalan saat file dimuat) karena
 * kartu konten sekarang sering dibuat BELAKANGAN oleh JS lain (misalnya
 * page-dining.js) — observeReveal() baru dipanggil SETELAH kartu-kartu
 * itu selesai dirender, supaya tidak ada yang terlewat diamati.
 */
function observeReveal(selector = ".reveal") {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  });
  document.querySelectorAll(selector).forEach((el) => io.observe(el));
}
