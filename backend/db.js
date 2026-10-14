const Database = require("better-sqlite3");
const db = new Database("tirta-senja.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    cap INTEGER NOT NULL,
    bed TEXT NOT NULL,
    size INTEGER NOT NULL,
    price INTEGER NOT NULL,
    available INTEGER NOT NULL,
    perks TEXT NOT NULL,
    hills TEXT NOT NULL,
    valley TEXT NOT NULL
  )
`);

// Konten halaman utama yang bisa diubah lewat CMS (admin/index.html, panel "Beranda").
// Cuma satu baris (id selalu 1) -- tidak perlu tabel relasional untuk
// konten sesederhana ini.
db.exec(`
  CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL
  )
`);

// Halaman kategori (Dining, Spa, Experience) -- dulu datanya statis di
// js/data-categories.js, sekarang pindah ke sini supaya bisa diedit
// lewat admin (lihat admin/index.html panel Spa/Dining/Experience).
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL
  )
`);

// Catatan: kolom deskripsi dinamai "description", BUKAN "desc" -- "desc"
// adalah kata kunci SQL (dipakai di ORDER BY ... DESC), jadi berisiko
// bentrok kalau dipakai sebagai nama kolom.
db.exec(`
  CREATE TABLE IF NOT EXISTS category_items (
    id INTEGER PRIMARY KEY,
    category_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    big INTEGER NOT NULL DEFAULT 0,
    order_number INTEGER NOT NULL DEFAULT 0
  )
`);

// Seed: isi tabel rooms SEKALI SAJA, pas pertama kali databasenya kosong.
// Kalau dijalankan lagi (server restart), tabel sudah ada isinya, jadi
// blok ini dilewati -- mencegah data dobel tiap kali server nyala ulang.
const roomCount = db.prepare("SELECT COUNT(*) AS total FROM rooms").get().total;

if (roomCount === 0) {
  const ROOMS = require("./data/rooms.js");
  const insert = db.prepare(`
    INSERT INTO rooms (id, name, type, cap, bed, size, price, available, perks, hills, valley)
    VALUES (@id, @name, @type, @cap, @bed, @size, @price, @left, @perks, @hills, @valley)
  `);

  for (const room of ROOMS) {
    insert.run({ ...room, perks: JSON.stringify(room.perks) });
  }

  console.log(`Seed: ${ROOMS.length} kamar dimasukkan ke database.`);
}

const contentCount = db.prepare("SELECT COUNT(*) AS total FROM site_content").get().total;

if (contentCount === 0) {
  db.prepare(`
    INSERT INTO site_content (id, hero_title, hero_subtitle)
    VALUES (1, @heroTitle, @heroSubtitle)
  `).run({
    heroTitle: "Menginap di antara sawah dan sungai",
    heroSubtitle: "Pilih tanggal, lihat kamar yang tersedia, dan dapatkan kode pesanan dalam hitungan detik.",
  });

  console.log("Seed: konten hero default dimasukkan ke database.");
}

const categoryCount = db.prepare("SELECT COUNT(*) AS total FROM categories").get().total;

if (categoryCount === 0) {
  const CATEGORIES = require("./data/categories.js");
  const insertCategory = db.prepare("INSERT INTO categories (slug, title) VALUES (@slug, @title)");
  const insertItem = db.prepare(`
    INSERT INTO category_items (category_slug, title, description, image, big, order_number)
    VALUES (@categorySlug, @title, @description, @image, @big, @orderNumber)
  `);

  for (const [slug, category] of Object.entries(CATEGORIES)) {
    insertCategory.run({ slug, title: category.title });
    category.items.forEach((item, index) => {
      insertItem.run({
        categorySlug: slug,
        title: item.title,
        description: item.desc,
        image: item.image,
        big: item.big ? 1 : 0,
        orderNumber: index,
      });
    });
  }

  console.log(`Seed: ${Object.keys(CATEGORIES).length} kategori dimasukkan ke database.`);
}

module.exports = db;