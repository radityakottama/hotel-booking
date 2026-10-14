/**
 * data/categories.js
 * Data awal kategori (Dining, Spa, Experience) -- sumber kebenaran untuk
 * seed SEKALI SAJA ke tabel categories/category_items (lihat db.js).
 * Setelah ada isinya di database, admin mengubah lewat admin/index.html
 * (panel Spa/Dining/Experience), bukan edit file ini lagi.
 */
module.exports = {
  dining: {
    title: "Dining",
    items: [
      { title: "Sawah Terrace", desc: "Sarapan menghadap sawah berundak, buka sejak pukul 7 pagi.", image: "https://picsum.photos/seed/1/600/600", big: true },
      { title: "Sungai Kitchen", desc: "Masakan fusion Indonesia-internasional dengan bahan lokal.", image: "https://picsum.photos/seed/2/600/600" },
      { title: "Senja Bar", desc: "Koktail signature saat matahari terbenam di tepi sungai.", image: "https://picsum.photos/seed/3/600/600" },
      { title: "Private Dining", desc: "Makan malam privat untuk momen spesial, reservasi 24 jam sebelumnya.", image: "https://picsum.photos/seed/4/600/600" },
      { title: "Cooking Class", desc: "Belajar memasak resep tradisional Bali bersama chef kami.", image: "https://picsum.photos/seed/5/600/600" },
      { title: "Poolside Grill", desc: "Barbeque santai di tepi kolam, tersedia tiap akhir pekan.", image: "https://picsum.photos/seed/6/600/600" },
    ],
  },
  spa: {
    title: "Spa",
    items: [
      { title: "Balinese Massage", desc: "Pijat tradisional Bali 90 menit dengan minyak aromaterapi.", image: "https://picsum.photos/seed/11/600/600", big: true },
      { title: "Hot Stone Therapy", desc: "Terapi batu panas untuk relaksasi otot mendalam.", image: "https://picsum.photos/seed/12/600/600" },
      { title: "Floral Bath", desc: "Rendam santai dengan bunga segar dan air hangat.", image: "https://picsum.photos/seed/13/600/600" },
      { title: "Couple Spa", desc: "Perawatan berdua di ruang privat menghadap sungai.", image: "https://picsum.photos/seed/14/600/600" },
      { title: "Facial Treatment", desc: "Perawatan wajah dengan bahan alami khas Bali.", image: "https://picsum.photos/seed/15/600/600" },
    ],
  },
  experience: {
    title: "Experience",
    items: [
      { title: "Sunrise Trekking", desc: "Trekking pagi menyusuri sawah berundak sebelum matahari terbit.", image: "https://picsum.photos/seed/21/600/600", big: true },
      { title: "Bike Tour", desc: "Bersepeda keliling desa sekitar Ubud bersama pemandu lokal.", image: "https://picsum.photos/seed/22/600/600" },
      { title: "Yoga Session", desc: "Kelas yoga pagi di pendopo terbuka menghadap sawah.", image: "https://picsum.photos/seed/23/600/600" },
      { title: "Craft Workshop", desc: "Belajar kerajinan tangan tradisional bersama perajin lokal.", image: "https://picsum.photos/seed/24/600/600" },
    ],
  },
};
