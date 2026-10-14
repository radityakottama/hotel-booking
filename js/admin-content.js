/**
 * admin-content.js
 * Panel "Beranda" di shell admin (admin/index.html) -- bicara ke backend
 * lewat fetch(), untuk ubah konten hero halaman utama.
 *
 * Dibungkus IIFE: panel lain di shell yang sama (admin.js, admin-category.js)
 * juga punya `$`/`API` sendiri -- tanpa pembungkus ini, deklarasi `const`
 * yang sama-sama di level global akan bentrok (SyntaxError) begitu
 * digabung di satu halaman.
 */
(() => {
  const API = "http://localhost:3000/api/content";
  const $ = (selector) => document.querySelector(selector);

  async function loadContent() {
    const content = await fetch(API).then((r) => r.json());
    $("#f-hero-title").value = content.heroTitle;
    $("#f-hero-subtitle").value = content.heroSubtitle;
  }

  $("#content-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      heroTitle: $("#f-hero-title").value,
      heroSubtitle: $("#f-hero-subtitle").value,
    };

    const response = await fetch(API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();

    if (!response.ok) {
      $("#content-form-msg").textContent = result.error;
      return;
    }

    $("#content-form-msg").textContent = "Tersimpan.";
  });

  loadContent();
})();
