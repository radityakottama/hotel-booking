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
