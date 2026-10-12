/**
 * data-categories.js
 * Simulasi data yang nanti akan datang dari API sungguhan (Fase 3 roadmap).
 * Bentuknya sengaja dibuat seperti respons API: objek, key-nya "slug"
 * (pengenal di URL), isinya { title, items }.
 *
 * Kenapa object bukan array? Supaya pencarian "kategori dengan slug X"
 * cepat (CATEGORIES[slug]), tidak perlu .find() ke seluruh array.
 */
const CATEGORIES = {
  dining: {
    title: "Dining",
    items: [
      { id: 1, title: "Sawah Terrace", desc: "Sarapan menghadap sawah berundak, buka sejak pukul 7 pagi.", image: "https://picsum.photos/seed/1/600/600", big: true },
      { id: 2, title: "Sungai Kitchen", desc: "Masakan fusion Indonesia-internasional dengan bahan lokal.", image: "https://picsum.photos/seed/2/600/600" },
      { id: 3, title: "Senja Bar", desc: "Koktail signature saat matahari terbenam di tepi sungai.", image: "https://picsum.photos/seed/3/600/600" },
      { id: 4, title: "Private Dining", desc: "Makan malam privat untuk momen spesial, reservasi 24 jam sebelumnya.", image: "https://picsum.photos/seed/4/600/600" },
      { id: 5, title: "Cooking Class", desc: "Belajar memasak resep tradisional Bali bersama chef kami.", image: "https://picsum.photos/seed/5/600/600" },
      { id: 6, title: "Poolside Grill", desc: "Barbeque santai di tepi kolam, tersedia tiap akhir pekan.", image: "https://picsum.photos/seed/6/600/600" },
    ],
  },
  spa: {
    title: "Spa",
    items: [
      { id: 1, title: "Balinese Massage", desc: "Pijat tradisional Bali 90 menit dengan minyak aromaterapi.", image: "https://picsum.photos/seed/11/600/600", big: true },
      { id: 2, title: "Hot Stone Therapy", desc: "Terapi batu panas untuk relaksasi otot mendalam.", image: "https://picsum.photos/seed/12/600/600" },
      { id: 3, title: "Floral Bath", desc: "Rendam santai dengan bunga segar dan air hangat.", image: "https://picsum.photos/seed/13/600/600" },
      { id: 4, title: "Couple Spa", desc: "Perawatan berdua di ruang privat menghadap sungai.", image: "https://picsum.photos/seed/14/600/600" },
      { id: 5, title: "Facial Treatment", desc: "Perawatan wajah dengan bahan alami khas Bali.", image: "https://picsum.photos/seed/15/600/600" },
    ],
  },
  experience: {
    title: "Experience",
    items: [
      { id: 1, title: "Sunrise Trekking", desc: "Trekking pagi menyusuri sawah berundak sebelum matahari terbit.", image: "https://picsum.photos/seed/21/600/600", big: true },
      { id: 2, title: "Bike Tour", desc: "Bersepeda keliling desa sekitar Ubud bersama pemandu lokal.", image: "https://picsum.photos/seed/22/600/600" },
      { id: 3, title: "Yoga Session", desc: "Kelas yoga pagi di pendopo terbuka menghadap sawah.", image: "https://picsum.photos/seed/23/600/600" },
      { id: 4, title: "Craft Workshop", desc: "Belajar kerajinan tangan tradisional bersama perajin lokal.", image: "https://picsum.photos/seed/24/600/600" },
    ],
  },
};
