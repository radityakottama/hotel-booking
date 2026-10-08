/**
 * data-dining.js
 * Data konten halaman Dining. Pola yang sama (array of objects) dipakai
 * nanti untuk Spa, Experience, dll — tinggal bikin file data-*.js baru.
 *
 * Field tiap item:
 *  id    : pengenal unik
 *  title : judul kartu
 *  desc  : deskripsi singkat
 *  image : URL gambar
 *  big   : (opsional) true untuk kartu ukuran 2x2 di grid
 */
const DINING_ITEMS = [
  { id: 1, title: "Sawah Terrace", desc: "Sarapan menghadap sawah berundak, buka sejak pukul 7 pagi.", image: "https://picsum.photos/seed/1/600/600", big: true },
  { id: 2, title: "Sungai Kitchen", desc: "Masakan fusion Indonesia-internasional dengan bahan lokal.", image: "https://picsum.photos/seed/2/600/600" },
  { id: 3, title: "Senja Bar", desc: "Koktail signature saat matahari terbenam di tepi sungai.", image: "https://picsum.photos/seed/3/600/600" },
  { id: 4, title: "Private Dining", desc: "Makan malam privat untuk momen spesial, reservasi 24 jam sebelumnya.", image: "https://picsum.photos/seed/4/600/600" },
  { id: 5, title: "Cooking Class", desc: "Belajar memasak resep tradisional Bali bersama chef kami.", image: "https://picsum.photos/seed/5/600/600" },
  { id: 6, title: "Poolside Grill", desc: "Barbeque santai di tepi kolam, tersedia tiap akhir pekan.", image: "https://picsum.photos/seed/6/600/600" },
];
