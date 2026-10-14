/**
 * data.js
 * Semua data statis dan konstanta aplikasi ada di sini.
 * Ingin menambah kamar? Cukup tambah satu objek ke array ROOMS.
 */

const CONFIG = {
  MAX_ROOMS: 3,              // maksimum kamar per pencarian
  MAX_ADULTS: 6,             // maksimum tamu dewasa per pencarian

  // Booking engine eksternal (pola D-EDGE dkk): tombol "Pesan" redirect
  // ke sini, bukan buat pesanan sendiri di backend kita. Ini PLACEHOLDER
  // demo -- ganti dengan URL booking engine sungguhan (dari provider yang
  // dipakai hotel, lengkap dengan kode properti) saat integrasi nyata.
  BOOKING_ENGINE_URL: "https://secure-hotel-booking.com/d-edge/redirect/DEMO/id-ID",
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
