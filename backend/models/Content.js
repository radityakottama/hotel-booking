/**
 * models/Content.js
 * Konten halaman utama yang bisa diubah lewat CMS (admin/index.html, panel "Beranda"),
 * tanpa perlu edit index.html langsung -- cuma satu baris di tabel
 * "site_content" (id selalu 1, lihat seed di db.js).
 */
const db = require("../db.js");

function get() {
  return db.prepare("SELECT hero_title AS heroTitle, hero_subtitle AS heroSubtitle FROM site_content WHERE id = 1").get();
}

// Sama seperti EDITABLE_FIELDS di Room.js: whitelist supaya nama kolom
// tidak bisa "disusupi" lewat body request.
const FIELD_TO_COLUMN = { heroTitle: "hero_title", heroSubtitle: "hero_subtitle" };

/** Ubah SEBAGIAN konten -- field yang tidak dikirim tetap seperti semula. */
function update(changes) {
  const fields = Object.keys(changes).filter((f) => FIELD_TO_COLUMN[f]);
  if (fields.length === 0) return get();

  const setClause = fields.map((f) => `${FIELD_TO_COLUMN[f]} = @${f}`).join(", ");
  db.prepare(`UPDATE site_content SET ${setClause} WHERE id = 1`).run(changes);
  return get();
}

module.exports = { get, update };
