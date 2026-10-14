/**
 * models/Category.js
 * Query SQL untuk tabel "categories" (Dining, Spa, Experience) dan
 * "category_items" -- dipakai halaman publik (page-category.js, nav.js
 * lewat API) dan panel admin Spa/Dining/Experience.
 */
const db = require("../db.js");

function toItem(row) {
  return { id: row.id, title: row.title, desc: row.description, image: row.image, big: !!row.big, order: row.order_number };
}

function findAll() {
  return db.prepare("SELECT slug, title FROM categories ORDER BY slug").all();
}

/** Satu kategori lengkap dengan item-itemnya, terurut sesuai "order_number". */
function findBySlug(slug) {
  const category = db.prepare("SELECT slug, title FROM categories WHERE slug = ?").get(slug);
  if (!category) return null;

  const items = db.prepare("SELECT * FROM category_items WHERE category_slug = ? ORDER BY order_number").all(slug);
  return { ...category, items: items.map(toItem) };
}

function updateTitle(slug, title) {
  db.prepare("UPDATE categories SET title = ? WHERE slug = ?").run(title, slug);
  return findBySlug(slug);
}

function findItemById(id) {
  const row = db.prepare("SELECT * FROM category_items WHERE id = ?").get(id);
  return row ? toItem(row) : null;
}

function createItem(slug, item) {
  const result = db.prepare(`
    INSERT INTO category_items (category_slug, title, description, image, big, order_number)
    VALUES (@slug, @title, @description, @image, @big, @order)
  `).run({
    slug, title: item.title, description: item.desc, image: item.image,
    big: item.big ? 1 : 0, order: item.order ?? 0,
  });

  return findItemById(result.lastInsertRowid);
}

// Sama pola seperti Room.js: whitelist kolom yang boleh diubah, karena
// nama kolom tidak bisa diamankan lewat parameter seperti nilai biasa.
// Field API "desc" dipetakan ke kolom DB "description" (lihat catatan di db.js).
const ITEM_FIELD_TO_COLUMN = { title: "title", desc: "description", image: "image", big: "big", order: "order_number" };

/** Ubah SEBAGIAN data item -- field yang tidak dikirim tetap seperti semula. */
function updateItem(id, changes) {
  const fields = Object.keys(changes).filter((f) => ITEM_FIELD_TO_COLUMN[f]);
  if (fields.length === 0) return findItemById(id);

  const setClause = fields.map((f) => `${ITEM_FIELD_TO_COLUMN[f]} = @${f}`).join(", ");
  const params = { id };
  fields.forEach((f) => {
    params[f] = f === "big" ? (changes[f] ? 1 : 0) : changes[f];
  });

  db.prepare(`UPDATE category_items SET ${setClause} WHERE id = @id`).run(params);
  return findItemById(id);
}

function removeItem(id) {
  const result = db.prepare("DELETE FROM category_items WHERE id = ?").run(id);
  return result.changes > 0;
}

module.exports = { findAll, findBySlug, updateTitle, createItem, updateItem, removeItem };
