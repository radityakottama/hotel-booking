/**
 * data-tour.js
 * Data virtual tour: scene Pannellum + struktur menu navigasi (bisa
 * berlapis/nested). Dipisah dari tour.js supaya kalau nanti dipakai
 * untuk hotel lain, cukup ganti file data ini -- tour.html & tour.js
 * tetap sama persis. Pola ini sama dengan CATEGORIES di
 * data-categories.js (format sama, konten beda per "pemilik").
 *
 * Field "menu":
 *  - item biasa  : { label, sceneId }
 *  - item kategori (submenu): { label, children: [...] } -- TANPA sceneId
 *
 * Catatan: foto masih demo bawaan Pannellum (gunung), bukan foto hotel
 * asli -- ganti field "panorama" di "scenes" kalau sudah ada foto asli.
 */
const TOUR_DATA = {
  firstScene: "aerial",

  scenes: {
    aerial: {
      type: "equirectangular",
      panorama: "https://pannellum.org/images/cerro-toco-0.jpg",
      hotSpots: [
        {
          "pitch": -2,
          "yaw": 118,
          "type": "scene",
          "text": "Menuju lobby",
          "sceneId": "lobby"
        }
      ],
    },
    lobby: {
      type: "equirectangular",
      panorama: "https://pannellum.org/images/cerro-toco-1.jpg",
      hotSpots: [
        {
          "pitch": 4.7,
          "yaw": -127.8,
          "type": "scene",
          "text": "Menuju room superior",
          "sceneId": "room_superior"
        },
        {
          "pitch": 5.6,
          "yaw": -105.2,
          "type": "scene",
          "text": "Menuju room deluxe",
          "sceneId": "room_deluxe"
        }
      ],
    },
    room_superior: {
      type: "equirectangular",
      panorama: "https://pannellum.org/images/cerro-toco-0.jpg",
      hotSpots: [
        {
          "pitch": -1.3,
          "yaw": 8.7,
          "type": "scene",
          "text": "Menuju lobby",
          "sceneId": "lobby"
        }
      ],
    },
    room_deluxe: {
      type: "equirectangular",
      panorama: "https://pannellum.org/images/cerro-toco-1.jpg",
      hotSpots: [
        {
          "pitch": -1.3,
          "yaw": 8.7,
          "type": "scene",
          "text": "Menuju lobby",
          "sceneId": "lobby"
        }
      ],
    },
  },

  menu: [
    { label: "Aerial View", sceneId: "aerial" },
    { label: "Lobby & Receptionist", sceneId: "lobby" },
    {
      label: "Rooms",
      children: [
        { label: "Superior King Room", sceneId: "room_superior" },
        { label: "Deluxe Twin Room", sceneId: "room_deluxe" },
      ],
    },
  ],
};
