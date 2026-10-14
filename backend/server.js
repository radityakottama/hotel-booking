const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

const Room = require("./models/Room.js");
const Content = require("./models/Content.js");
const Category = require("./models/Category.js");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Halo dari dapur!");
});

// Daftar kamar sebagai KONTEN (harga, tipe, foto/perks) -- bukan
// ketersediaan real-time. Cek stok & booking sungguhan jadi tanggung
// jawab booking engine eksternal, situs ini cuma menampilkan & meredirect
// (lihat CONFIG.BOOKING_ENGINE_URL di js/data.js).
app.get("/api/rooms", (req, res) => {
  res.json(Room.findAll());
});

app.post("/api/rooms", (req, res) => {
  const { name, type, cap, bed, size, price, available, perks, hills, valley } = req.body;

  // Semua kolom ini NOT NULL di database (lihat db.js) -- kalau salah satu
  // kosong, INSERT akan gagal dengan error SQLite mentah yang membocorkan
  // detail internal server. Divalidasi dulu di sini supaya gagalnya rapi
  // (400 + pesan jelas), bukan crash (500).
  if (!name || !type || !cap || !bed || !size || !price || available == null) {
    return res.status(400).json({ error: "Nama, tipe, kapasitas, tempat tidur, luas, harga, dan stok kamar wajib diisi." });
  }

  const room = Room.create({
    name, type, cap, bed, size, price, available,
    perks: perks || [],
    hills: hills || "#7fb98b",
    valley: valley || "#3d7a5a",
  });

  res.status(201).json(room);
});

app.patch("/api/rooms/:id", (req, res) => {
  const room = Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: "Kamar tidak ditemukan." });

  const updated = Room.update(req.params.id, req.body);
  res.json(updated);
});

app.delete("/api/rooms/:id", (req, res) => {
  const deleted = Room.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Kamar tidak ditemukan." });
  res.status(204).send();
});

// Konten halaman utama (hero title/subtitle), dipakai index.html supaya
// teksnya bisa diubah lewat admin/index.html (panel "Beranda") tanpa edit HTML langsung.
app.get("/api/content", (req, res) => {
  res.json(Content.get());
});

app.patch("/api/content", (req, res) => {
  res.json(Content.update(req.body));
});

// Halaman kategori (Dining, Spa, Experience) -- dipakai halaman publik
// (category.html lewat page-category.js), nav header (nav.js), dan panel
// admin Spa/Dining/Experience.
app.get("/api/categories", (req, res) => {
  res.json(Category.findAll());
});

app.get("/api/categories/:slug", (req, res) => {
  const category = Category.findBySlug(req.params.slug);
  if (!category) return res.status(404).json({ error: "Kategori tidak ditemukan." });
  res.json(category);
});

app.patch("/api/categories/:slug", (req, res) => {
  const category = Category.findBySlug(req.params.slug);
  if (!category) return res.status(404).json({ error: "Kategori tidak ditemukan." });

  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Judul kategori wajib diisi." });

  res.json(Category.updateTitle(req.params.slug, title));
});

app.post("/api/categories/:slug/items", (req, res) => {
  const category = Category.findBySlug(req.params.slug);
  if (!category) return res.status(404).json({ error: "Kategori tidak ditemukan." });

  const { title, desc, image } = req.body;
  if (!title || !desc || !image) {
    return res.status(400).json({ error: "Judul, deskripsi, dan gambar wajib diisi." });
  }

  const item = Category.createItem(req.params.slug, req.body);
  res.status(201).json(item);
});

app.patch("/api/categories/items/:id", (req, res) => {
  res.json(Category.updateItem(req.params.id, req.body));
});

app.delete("/api/categories/items/:id", (req, res) => {
  const deleted = Category.removeItem(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Item tidak ditemukan." });
  res.status(204).send();
});

// Error-handling middleware -- Express mengenalinya KHUSUS karena punya 4
// parameter (err, req, res, next), harus ditulis TERAKHIR (setelah semua
// route). Kalau ada error yang tidak sengaja lolos dari penanganan di route
// manapun (misalnya body kosong/salah format), ini jadi jaring pengaman
// terakhir -- server tetap hidup, cuma request itu yang gagal dengan rapi.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Terjadi kesalahan di server." });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
