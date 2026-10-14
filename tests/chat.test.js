// Uji bagian Live Chat yang tidak butuh internet/API key.
// Butuh dependensi backend: jalankan "cd backend && npm install" dulu.
const test = require("node:test");
const assert = require("node:assert/strict");
const Chat = require("../backend/chat.js");

test("cleanHistory menolak riwayat kosong atau rusak", () => {
  assert.match(Chat.cleanHistory([]).error, /kosong/);
  assert.match(Chat.cleanHistory("halo").error, /kosong/);
  assert.match(Chat.cleanHistory([{ role: "system", content: "x" }]).error, /Format/);
  assert.match(Chat.cleanHistory([{ role: "user", content: "   " }]).error, /Format/);
  assert.match(Chat.cleanHistory([{ role: "user", content: "x".repeat(1001) }]).error, /terlalu panjang/);
  assert.match(Chat.cleanHistory([
    { role: "user", content: "halo" },
    { role: "assistant", content: "hai" },
  ]).error, /terakhir/);
});

test("cleanHistory memotong riwayat panjang dan selalu mulai dari user", () => {
  const long = [];
  for (let i = 0; i < 15; i++) {
    long.push({ role: "user", content: `tanya ${i}` }, { role: "assistant", content: `jawab ${i}` });
  }
  long.push({ role: "user", content: "terakhir", extra: "dibuang" });

  const { messages } = Chat.cleanHistory(long);
  assert.ok(messages.length <= 20);
  assert.equal(messages[0].role, "user");
  assert.deepEqual(messages.at(-1), { role: "user", content: "terakhir" });
});

test("buildSystemPrompt memuat data kamar dari database", () => {
  const prompt = Chat.buildSystemPrompt([
    { name: "Kamar Taman", type: "Standar", cap: 2, bed: "1 King", size: 28, price: 850000, perks: ["AC", "Teras"] },
  ]);
  assert.match(prompt, /Kamar Taman \(Standar\): maks 2 tamu/);
  assert.match(prompt, /Rp850\.000\/malam/);
});
