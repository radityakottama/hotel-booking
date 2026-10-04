/**
 * data.js
 * Semua data statis dan konstanta aplikasi ada di sini.
 * Ingin menambah kamar? Cukup tambah satu objek ke array ROOMS.
 */

const CONFIG = {
  SERVICE_RATE: 0.10,        // biaya layanan 10% dari harga kamar
  TAX_RATE: 0.11,            // pajak 11% dari (harga kamar + biaya layanan)
  MAX_ROOMS: 3,              // maksimum kamar per pesanan
  MAX_ADULTS: 6,             // maksimum tamu dewasa per pesanan
  STORAGE_KEY: "ts_bookings",
  CODE_PREFIX: "TS",
};

const ROOM_TYPES = ["Semua", "Standar", "Deluxe", "Suite", "Villa"];

/**
 * Field setiap kamar:
 *  id    : pengenal unik
 *  name  : nama kamar
 *  type  : tipe (dipakai untuk filter)
 *  cap   : kapasitas tamu per kamar
 *  bed   : konfigurasi tempat tidur
 *  size  : luas dalam m²
 *  price : harga per malam (Rupiah)
 *  left  : sisa kamar (dipakai untuk cek ketersediaan)
 *  perks : fasilitas yang ditampilkan sebagai tag
 *  hills/valley : dua warna untuk ilustrasi SVG kamar
 */
const ROOMS = [
  { id: 1, name: "Kamar Taman", type: "Standar", cap: 2, bed: "1 King", size: 28, price: 850000, left: 4,
    perks: ["AC", "Wi-Fi", "Teras"], hills: "#7fb98b", valley: "#3d7a5a" },
  { id: 2, name: "Kamar Sawah", type: "Deluxe", cap: 3, bed: "1 King + sofa bed", size: 36, price: 1250000, left: 3,
    perks: ["AC", "Wi-Fi", "Balkon", "Sarapan"], hills: "#c9d96b", valley: "#4f8a3c" },
  { id: 3, name: "Suite Sungai", type: "Suite", cap: 3, bed: "1 King", size: 48, price: 1950000, left: 2,
    perks: ["AC", "Wi-Fi", "Bathtub", "Sarapan"], hills: "#8fd0cc", valley: "#1f7a74" },
  { id: 4, name: "Villa Kolam Pribadi", type: "Villa", cap: 4, bed: "2 Queen", size: 85, price: 3400000, left: 1,
    perks: ["Kolam", "Dapur", "Wi-Fi", "Sarapan"], hills: "#f0c36d", valley: "#c26a2f" },
  { id: 5, name: "Bungalow Keluarga", type: "Villa", cap: 5, bed: "1 King + 2 Single", size: 70, price: 2650000, left: 3,
    perks: ["AC", "Wi-Fi", "Dapur kecil"], hills: "#a7c8e8", valley: "#3b6ea5" },
];
