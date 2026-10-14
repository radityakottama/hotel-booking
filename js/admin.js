/**
 * admin.js
 * Halaman admin berdiri sendiri (tidak lewat index.html/app.js) --
 * langsung bicara ke backend lewat fetch(), pola yang sama seperti
 * confirmBooking() di app.js.
 */

const API = "http://localhost:3000/api/rooms";
const $ = (selector) => document.querySelector(selector);

async function loadRooms() {
  const rooms = await fetch(API).then((r) => r.json());

  $("#room-list").innerHTML = rooms
    .map(
      (room) => `
      <div class="admin-row">
        <div>
          <strong>${UI.escapeHtml(room.name)}</strong> — ${UI.escapeHtml(room.type)},
          ${room.cap} tamu, ${UI.rupiah(room.price)}/malam, stok: ${room.left}
        </div>
        <button class="btn sec" data-delete="${room.id}">Hapus</button>
      </div>
    `
    )
    .join("");
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

  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();

  if (!response.ok) {
    $("#form-msg").textContent = result.error;
    return;
  }

  $("#form-msg").textContent = "";
  e.target.reset();
  loadRooms();
});

$("#room-list").addEventListener("click", async (e) => {
  const button = e.target.closest("[data-delete]");
  if (!button) return;
  if (!confirm("Yakin mau hapus kamar ini?")) return;

  await fetch(`${API}/${button.dataset.delete}`, { method: "DELETE" });
  loadRooms();
});

loadRooms();
