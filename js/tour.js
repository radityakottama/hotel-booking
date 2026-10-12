const viewer = pannellum.viewer("panorama", {
  "default": {
    "firstScene": "lobby",
    "autoLoad": true,
    "sceneFadeDuration": 1000
  },
  "scenes": {
    "lobby": {
      "type": "equirectangular",
      "panorama": "https://pannellum.org/images/cerro-toco-0.jpg",
      "hotSpots": [
        {
          "pitch": 1.6,
          "yaw": 176.7,
          "type": "scene",
          "text": "Menuju Kamar",
          "sceneId": "kamar"
        }
      ]
    },
    "kamar": {
      "type": "equirectangular",
      "panorama": "https://pannellum.org/images/cerro-toco-1.jpg",
      "hotSpots": [
        {
          "pitch": 0,
          "yaw": 0,
          "type": "scene",
          "text": "Kembali ke Lobby",
          "sceneId": "lobby"
        }
      ]
    }
  }
});

// Alat bantu development: klik di mana pun pada panorama untuk melihat
// koordinat pitch/yaw titik itu di Console — dipakai tiap kali menentukan
// posisi hotspot untuk foto baru. Sengaja dipertahankan (bukan kode
// sementara), karena akan dipakai ulang setiap kali ganti/tambah foto.
document.querySelector("#panorama").addEventListener("click", (e) => {
  const coords = viewer.mouseEventToCoords(e);
  console.log(`pitch: ${coords[0].toFixed(1)}, yaw: ${coords[1].toFixed(1)}`);
});

// Tombol "Kembali" default-nya ke index.html (selalu jalan, bahkan kalau
// halaman ini dibuka langsung lewat URL, tanpa riwayat navigasi).
// Tapi kalau user memang baru saja datang dari halaman lain di situs ini
// (document.referrer satu origin), pakai history.back() supaya kembali
// persis ke halaman asalnya (misalnya category.html?slug=spa), bukan
// selalu dilempar ke home.
if (document.referrer && new URL(document.referrer).origin === location.origin) {
  document.querySelector("#tour-back").addEventListener("click", (e) => {
    e.preventDefault();
    history.back();
  });
}