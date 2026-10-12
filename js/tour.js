/**
 * tour.js
 * Generik -- tidak tahu apa-apa soal "hotel mana". Semua konten (scene,
 * foto, struktur menu) datang dari TOUR_DATA (data-tour.js). Supaya
 * dipakai untuk hotel lain, cukup ganti data-tour.js.
 */

const viewer = pannellum.viewer("panorama", {
  "default": {
    "firstScene": TOUR_DATA.firstScene,
    "autoLoad": true,
    "sceneFadeDuration": 1000,
    "showControls": false, // kontrol bawaan (zoom, fullscreen) dimatikan, diganti versi custom di bawah
  },
  "scenes": TOUR_DATA.scenes,
});

// ---------- Panel menu (berlapis: kategori bisa punya submenu) ----------

const menuEl = document.querySelector("#tour-menu");

/** Render satu "layar" menu -- entah menu utama atau submenu kategori.
 *  `items` daftar yang mau ditampilkan, `parent` dipakai tombol BACK
 *  (null kalau ini menu utama, berarti tidak ada tombol BACK). */
function renderMenu(items, parent) {
  const backButton = parent ? `<button class="menu-back" data-back="1">← Kembali ke menu</button>` : "";

  const rows = items
    .map((item, index) => {
      const label = item.children ? `${item.label} ›` : item.label;
      return `<button class="menu-item" data-index="${index}">${label}</button>`;
    })
    .join("");

  menuEl.innerHTML = backButton + rows;

  if (parent) {
    menuEl.querySelector("[data-back]").addEventListener("click", () => renderMenu(parent, null));
  }

  menuEl.querySelectorAll(".menu-item").forEach((button) => {
    button.addEventListener("click", () => {
      const item = items[Number(button.dataset.index)];
      if (item.children) {
        // Kategori diklik -> masuk ke submenu, "items" saat ini disimpan
        // sebagai "parent" supaya tombol BACK tahu harus kembali ke mana.
        renderMenu(item.children, items);
      } else {
        viewer.loadScene(item.sceneId);
      }
    });
  });
}

renderMenu(TOUR_DATA.menu, null);

// ---------- Judul scene aktif + tombol "panorama sebelumnya" ----------

/** Ubah TOUR_DATA.menu (berlapis) jadi { sceneId: label } yang datar,
 *  supaya gampang cari judul dari ID scene. */
const sceneLabels = {};
(function flattenMenu(items) {
  items.forEach((item) => {
    if (item.children) flattenMenu(item.children);
    else sceneLabels[item.sceneId] = item.label;
  });
})(TOUR_DATA.menu);

const sceneTitleEl = document.querySelector("#scene-title");
const prevButton = document.querySelector("#tour-prev");

let sceneHistory = [];
let currentScene = TOUR_DATA.firstScene;
let isGoingBack = false; // true sesaat sebelum loadScene() dipanggil oleh tombol "Sebelumnya"

// "scenechange" adalah event bawaan Pannellum, terpicu SETIAP kali scene
// berganti -- baik lewat panel menu kita, maupun (nanti) lewat hotspot di
// dalam gambar. Dengan dengarkan event ini (bukan nulis logika di tiap
// tempat yang bisa memicu pindah scene), judul & riwayat selalu akurat
// dari sumber perpindahan mana pun.
viewer.on("scenechange", (sceneId) => {
  if (!isGoingBack) sceneHistory.push(currentScene);
  isGoingBack = false;
  currentScene = sceneId;

  sceneTitleEl.textContent = sceneLabels[sceneId] || sceneId;
  prevButton.hidden = sceneHistory.length === 0;
});

prevButton.addEventListener("click", () => {
  if (!sceneHistory.length) return;
  isGoingBack = true;
  viewer.loadScene(sceneHistory.pop());
});

// Scene pertama tidak memicu event "scenechange" (dia "autoLoad", bukan
// hasil loadScene() manual), jadi judul awal diisi manual di sini.
sceneTitleEl.textContent = sceneLabels[TOUR_DATA.firstScene] || TOUR_DATA.firstScene;

// ---------- Kontrol custom (zoom, fullscreen, kompas) ----------

// Ganti kontrol bawaan Pannellum dengan tombol kita sendiri. Pannellum
// TIDAK punya fungsi zoomIn()/zoomOut() -- zoom diatur lewat Hfov (Horizontal
// Field of View, satuan derajat): makin KECIL nilainya, makin zoom in.
// setHfov() otomatis membatasi nilainya sesuai getHfovBounds(), jadi tidak
// perlu dicek manual supaya tidak zoom berlebihan.
function adjustZoom(step) {
  viewer.setHfov(viewer.getHfov() + step);
}
document.querySelector("#ctrl-zoom-in").addEventListener("click", () => adjustZoom(-10));
document.querySelector("#ctrl-zoom-out").addEventListener("click", () => adjustZoom(10));
// Bukan pakai viewer.toggleFullscreen() -- itu cuma bikin #panorama sendiri
// yang fullscreen, elemen lain (toolbar, menu, tombol fullscreen ini sendiri)
// jadi ikut hilang karena di luar elemen yang fullscreen. Di sini <html>
// (seluruh halaman) yang dibikin fullscreen, supaya semua kontrol tetap
// kelihatan dan bisa diklik lagi buat keluar.
document.querySelector("#ctrl-fullscreen").addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
});

// Pannellum perlu tahu ukurannya berubah (masuk/keluar fullscreen) supaya
// panorama ikut menyesuaikan, bukan cuma browser yang berubah ukuran.
document.addEventListener("fullscreenchange", () => viewer.resize());

// Kompas: jarum diputar berlawanan arah dengan sudut hadap kamera (yaw),
// supaya "N" selalu menunjuk ke utara asli, bukan ke arah kamera.
// viewer.getYaw() dipanggil terus-menerus lewat requestAnimationFrame,
// karena Pannellum tidak punya event "kamera berputar" yang bisa didengar
// langsung -- rotasi kamera terjadi tiap frame saat user drag/animasi.
const compassNeedle = document.querySelector("#compass-needle");
function updateCompass() {
  compassNeedle.style.transform = `rotate(${-viewer.getYaw()}deg)`;
  requestAnimationFrame(updateCompass);
}
updateCompass();

// ---------- Alat bantu development ----------

// Klik di mana pun pada panorama untuk melihat koordinat pitch/yaw titik
// itu di Console -- dipakai tiap kali menentukan posisi hotspot untuk
// foto baru. Sengaja dipertahankan (bukan kode sementara), karena akan
// dipakai ulang setiap kali ganti/tambah foto.
document.querySelector("#panorama").addEventListener("click", (e) => {
  const coords = viewer.mouseEventToCoords(e);
  console.log(`pitch: ${coords[0].toFixed(1)}, yaw: ${coords[1].toFixed(1)}`);
});

// ---------- Tombol "Kembali" ke situs utama ----------

// Default-nya ke index.html (selalu jalan, bahkan kalau halaman ini
// dibuka langsung lewat URL, tanpa riwayat navigasi). Tapi kalau user
// memang baru saja datang dari halaman lain di situs ini (document.referrer
// satu origin), pakai history.back() supaya kembali persis ke halaman
// asalnya (misalnya category.html?slug=spa), bukan selalu dilempar ke home.
if (document.referrer && new URL(document.referrer).origin === location.origin) {
  document.querySelector("#tour-back").addEventListener("click", (e) => {
    e.preventDefault();
    history.back();
  });
}
