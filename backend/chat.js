/**
 * chat.js
 * Otak "Live Chat AI": menyusun instruksi untuk Claude, memeriksa riwayat
 * chat yang dikirim browser, lalu meminta jawaban ke Claude API.
 *
 * Kenapa lewat backend, bukan langsung dari browser? Karena memanggil
 * Claude butuh API key, dan apa pun yang ada di kode browser bisa dilihat
 * siapa saja (klik kanan > View Source). Key-nya cukup disimpan di server
 * (file backend/.env), browser hanya bicara ke /api/chat.
 */
const Anthropic = require("@anthropic-ai/sdk");

// Client dibuat sekali saja. Tanpa argumen, SDK membaca ANTHROPIC_API_KEY
// dari environment (diisi dari backend/.env, lihat server.js).
const client = new Anthropic();

const MAX_MESSAGES = 20;    // riwayat yang dikirim ke Claude (pesan lama dibuang)
const MAX_CHARS = 1000;     // panjang maksimal satu pesan dari tamu

/** Instruksi untuk Claude. Data kamar diambil langsung dari database,
 *  jadi kalau admin mengubah harga, jawaban chat ikut berubah. */
function buildSystemPrompt(rooms) {
  const roomList = rooms
    .map((r) => `- ${r.name} (${r.type}): maks ${r.cap} tamu, ${r.bed}, ${r.size} m², ` +
      `Rp${r.price.toLocaleString("id-ID")}/malam. Fasilitas: ${r.perks.join(", ")}.`)
    .join("\n");

  return `Kamu adalah resepsionis virtual Tirta Senja Resort & Villa, resort fiktif di Ubud, Bali, di antara sawah dan sungai. Situs ini proyek demo, bukan hotel sungguhan.

Jawab dalam Bahasa Indonesia yang ramah dan singkat (2-4 kalimat), kecuali tamu memakai bahasa lain.

Tipe kamar yang tersedia:
${roomList}

Harga di atas belum termasuk biaya layanan 10% dan pajak 11% (pajak dihitung dari harga kamar + biaya layanan).

Aturan:
- Hanya gunakan informasi di atas. Kalau ditanya hal yang tidak ada di sini (jam check-in, antar-jemput, promo, dll.), katakan kamu belum punya informasinya dan sarankan menghubungi resepsionis.
- Kamu tidak bisa memesan atau membatalkan kamar sendiri. Arahkan tamu memakai form "Cari kamar" di halaman utama.
- Jangan pernah meminta data kartu kredit atau kata sandi.`;
}

/** Periksa riwayat chat dari browser. Mengembalikan { error } atau
 *  { messages } yang sudah aman dikirim ke Claude.
 *
 *  Kenapa perlu diperiksa? Endpoint ini terbuka, jadi siapa pun bisa
 *  mengirim apa saja -- dan setiap panggilan ke Claude ada biayanya. */
function cleanHistory(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: "Pesan tidak boleh kosong." };
  }

  for (const m of messages) {
    if (!m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string" || !m.content.trim()) {
      return { error: "Format pesan tidak dikenali." };
    }
    if (m.role === "user" && m.content.length > MAX_CHARS) {
      return { error: `Pesan terlalu panjang (maks ${MAX_CHARS} karakter).` };
    }
  }

  if (messages[messages.length - 1].role !== "user") {
    return { error: "Pesan terakhir harus dari tamu." };
  }

  // Ambil yang terbaru saja, dan pastikan pesan pertama dari "user" --
  // aturan Claude API: percakapan selalu dimulai oleh user.
  let recent = messages.slice(-MAX_MESSAGES);
  while (recent[0].role !== "user") recent = recent.slice(1);

  return { messages: recent.map(({ role, content }) => ({ role, content })) };
}

/** Minta balasan ke Claude. Mengembalikan teks jawabannya. */
async function reply(rooms, messages) {
  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    // "low": untuk chat ringan seperti ini sudah cukup, dan jawabannya lebih cepat.
    output_config: { effort: "low" },
    // Kalau filter keamanan Claude menolak pertanyaan, server Anthropic
    // otomatis mencoba lagi dengan model cadangan yang direkomendasikan.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: buildSystemPrompt(rooms),
    messages,
  });

  // Penolakan tetap datang sebagai respons sukses (HTTP 200), jadi dicek dulu.
  if (response.stop_reason === "refusal") {
    return "Maaf, saya tidak bisa membantu pertanyaan itu. Ada hal lain soal menginap di Tirta Senja yang bisa saya bantu?";
  }

  // Jawaban Claude berupa daftar "block"; yang berisi teks bertipe "text".
  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

module.exports = { buildSystemPrompt, cleanHistory, reply, Anthropic };
