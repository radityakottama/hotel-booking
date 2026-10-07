async function loadPartials(selector, url) {
    const response = await fetch(url);
    document.querySelector(selector).innerHTML = await response.text();
}

// Kumpulan semua partial yang harus selesai dimuat sebelum app.js boleh jalan.
// app.js menunggu ini (await window.partialsReady) supaya elemen di dalam
// partial (misalnya #myBk) dijamin sudah ada di DOM saat dicari.
window.partialsReady = Promise.all([
  loadPartials("#header-placeholder", "partials/header.html"),
]);

window.partialsReady.then(() => {
  document.querySelector("#menuBtn").addEventListener("click", () => {
    document.querySelector("#nav").classList.toggle("open");
  });
});