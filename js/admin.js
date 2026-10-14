/**
 * admin.js
 * Panel "Kelola Kamar" di shell admin (admin/index.html) -- langsung
 * bicara ke backend lewat authFetch() (pengganti fetch() biasa yang
 * otomatis sisipkan token login -- lihat admin-auth.js).
 *
 * Dibungkus IIFE: panel lain di shell yang sama (admin-content.js,
 * admin-category.js) juga punya `$`/`API` sendiri -- tanpa pembungkus
 * ini, deklarasi `const` yang sama-sama di level global akan bentrok
 * (SyntaxError) begitu digabung di satu halaman.
 */
(() => {
  const API = API_ROOMS;
  const $ = (selector) => document.querySelector(selector);

  // null = form lagi dipakai buat TAMBAH kamar baru.
  // berisi id = form lagi dipakai buat EDIT kamar itu (lihat enterEditMode).
  let editingId = null;

  async function loadRooms() {
    const rooms = await authFetch(API).then((r) => r.json());

    $("#room-list").innerHTML = rooms
      .map(
        (room) => `
        <div class="admin-row">
          <div>
            <strong>${UI.escapeHtml(room.name)}</strong> — ${UI.escapeHtml(room.type)},
            ${room.cap} tamu, ${UI.rupiah(room.price)}/malam, ${room.left} unit
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn sec" data-edit="${room.id}">Edit</button>
            <button class="btn sec" data-delete="${room.id}">Hapus</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  /** Isi form dengan data kamar yang mau diedit, ganti tombol submit jadi
   *  "Update Kamar", munculkan tombol "Batal". */
  function enterEditMode(room) {
    editingId = room.id;
    $("#f-name").value = room.name;
    $("#f-type").value = room.type;
    $("#f-cap").value = room.cap;
    $("#f-bed").value = room.bed;
    $("#f-size").value = room.size;
    $("#f-price").value = room.price;
    $("#f-available").value = room.left;
    $("#f-perks").value = room.perks.join(", ");

    $("#form-submit").textContent = "Update Kamar";
    $("#form-cancel").hidden = false;
    $("#f-name").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /** Balik form ke mode "tambah kamar baru". */
  function exitEditMode() {
    editingId = null;
    $("#room-form").reset();
    $("#form-submit").textContent = "Simpan Kamar";
    $("#form-cancel").hidden = true;
  }

  $("#room-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const perks = $("#f-perks").value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const body = {
      name: $("#f-name").value,
      type: $("#f-type").value,
      cap: Number($("#f-cap").value),
      bed: $("#f-bed").value,
      size: Number($("#f-size").value),
      price: Number($("#f-price").value),
      available: Number($("#f-available").value),
      perks,
    };

    // Edit mode -> PATCH ke kamar yang sedang diedit. Mode tambah -> POST
    // bikin kamar baru. Keduanya kirim body yang sama, bedanya cuma method
    // dan URL tujuan.
    const url = editingId ? `${API}/${editingId}` : API;
    const method = editingId ? "PATCH" : "POST";

    const response = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();

    if (!response.ok) {
      $("#form-msg").textContent = result.error;
      return;
    }

    $("#form-msg").textContent = "";
    exitEditMode();
    loadRooms();
  });

  $("#form-cancel").addEventListener("click", exitEditMode);

  $("#room-list").addEventListener("click", async (e) => {
    const editButton = e.target.closest("[data-edit]");
    if (editButton) {
      const rooms = await authFetch(API).then((r) => r.json());
      const room = rooms.find((r) => r.id === Number(editButton.dataset.edit));
      enterEditMode(room);
      return;
    }

    const deleteButton = e.target.closest("[data-delete]");
    if (deleteButton) {
      if (!confirm("Yakin mau hapus kamar ini?")) return;
      await authFetch(`${API}/${deleteButton.dataset.delete}`, { method: "DELETE" });
      if (editingId === Number(deleteButton.dataset.delete)) exitEditMode();
      loadRooms();
    }
  });

  loadRooms();
})();
