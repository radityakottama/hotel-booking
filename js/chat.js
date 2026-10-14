/**
 * chat.js
 * Widget "Live Chat AI": tombol bulat di pojok kanan bawah yang membuka
 * jendela chat dengan resepsionis virtual (Claude, lewat backend).
 *
 * File ini berdiri sendiri: tidak butuh file JS lain, cukup dipasang di
 * halaman mana pun dengan <script src="js/chat.js"></script>.
 */
(() => {
  const API_URL = "http://localhost:3000/api/chat";

  // Riwayat percakapan. Dikirim UTUH ke server setiap kali tamu bertanya,
  // karena Claude tidak mengingat pesan sebelumnya dengan sendirinya.
  const history = [];

  // ---------- Bangun elemen HTML ----------

  const toggle = document.createElement("button");
  toggle.className = "chat-toggle";
  toggle.setAttribute("aria-label", "Buka live chat");
  toggle.textContent = "💬";

  const panel = document.createElement("section");
  panel.className = "chat-panel";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Live chat");
  panel.innerHTML = `
    <div class="chat-head">
      <strong>Resepsionis Tirta Senja</strong>
      <button class="chat-close" aria-label="Tutup live chat">✕</button>
    </div>
    <div class="chat-log" aria-live="polite"></div>
    <form class="chat-form">
      <input class="chat-input" maxlength="1000" placeholder="Tanya soal kamar, harga..." aria-label="Pesan" required>
      <button class="btn" type="submit">Kirim</button>
    </form>`;

  document.body.append(toggle, panel);

  const log = panel.querySelector(".chat-log");
  const form = panel.querySelector(".chat-form");
  const input = panel.querySelector(".chat-input");
  const sendButton = form.querySelector("button");

  /** Tambah satu gelembung chat. Pakai textContent, BUKAN innerHTML,
   *  supaya teks dari tamu maupun dari AI tidak bisa menyisipkan HTML
   *  (pencegahan XSS, sama seperti escapeHtml di ui.js). */
  function addBubble(kind, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-msg chat-${kind}`;
    bubble.textContent = text;
    log.append(bubble);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  // ---------- Kirim pesan ----------

  async function send(text) {
    history.push({ role: "user", content: text });
    addBubble("user", text);
    const typing = addBubble("bot", "Sedang mengetik…");
    input.disabled = sendButton.disabled = true;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const result = await response.json();

      if (!response.ok) {
        // Pesan gagal: buang dari riwayat supaya tamu bisa coba lagi
        // tanpa ada dua pesan "user" berturut-turut.
        history.pop();
        typing.className = "chat-msg chat-error";
        typing.textContent = result.error;
        return;
      }

      history.push({ role: "assistant", content: result.reply });
      typing.textContent = result.reply;
    } catch {
      history.pop();
      typing.className = "chat-msg chat-error";
      typing.textContent = "Tidak bisa terhubung ke server. Pastikan backend sudah jalan.";
    } finally {
      input.disabled = sendButton.disabled = false;
      input.focus();
      log.scrollTop = log.scrollHeight;
    }
  }

  // ---------- Event listener ----------

  toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) {
      if (!log.childElementCount) {
        addBubble("bot", "Halo! Saya resepsionis virtual Tirta Senja. Ada yang bisa saya bantu soal kamar atau menginap di sini?");
      }
      input.focus();
    }
  });

  panel.querySelector(".chat-close").addEventListener("click", () => {
    panel.hidden = true;
    toggle.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // cegah halaman reload (perilaku bawaan <form>)
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    send(text);
  });
})();
