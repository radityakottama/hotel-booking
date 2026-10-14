/**
 * admin-category.js
 * Panel Spa/Dining/Experience di shell admin -- SATU controller dipakai
 * ULANG 3 kali (lihat initCategoryPanel di paling bawah), supaya tidak
 * menulis 3 salinan kode yang nyaris sama persis. Pola CRUD-nya sama
 * seperti admin.js (Kelola Kamar): tambah/edit/hapus, 1 form dipakai
 * bergantian untuk tambah dan edit tergantung ada "editingId" atau tidak.
 *
 * Elemen tiap panel dicari lewat `panelEl.querySelector(".cat-...")` --
 * bukan `id`, karena 3 panel yang pakai controller ini ada di halaman
 * yang SAMA, dan `id` wajib unik se-halaman.
 */
function initCategoryPanel(slug, panelEl) {
  const API = `http://localhost:3000/api/categories/${slug}`;
  const $ = (selector) => panelEl.querySelector(selector);

  const heading = $(".cat-heading");
  const titleForm = $(".cat-title-form");
  const titleInput = $(".cat-title-input");
  const itemForm = $(".cat-item-form");
  const fTitle = $(".cat-f-title");
  const fDesc = $(".cat-f-desc");
  const fImage = $(".cat-f-image");
  const fOrder = $(".cat-f-order");
  const fBig = $(".cat-f-big");
  const submitBtn = $(".cat-submit");
  const cancelBtn = $(".cat-cancel");
  const itemMsg = $(".cat-item-msg");
  const list = $(".cat-item-list");

  // null = form item lagi dipakai buat TAMBAH item baru.
  // berisi id = form item lagi dipakai buat EDIT item itu.
  let editingId = null;

  async function load() {
    const category = await fetch(API).then((r) => r.json());
    heading.textContent = category.title;
    titleInput.value = category.title;

    list.innerHTML = category.items
      .map(
        (item) => `
        <div class="admin-row">
          <div>
            <strong>${UI.escapeHtml(item.title)}</strong> — urutan ${item.order}${item.big ? ", kartu besar" : ""}<br>
            <span class="meta">${UI.escapeHtml(item.desc)}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn sec" data-edit="${item.id}">Edit</button>
            <button class="btn sec" data-delete="${item.id}">Hapus</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  function enterEditMode(item) {
    editingId = item.id;
    fTitle.value = item.title;
    fDesc.value = item.desc;
    fImage.value = item.image;
    fOrder.value = item.order;
    fBig.checked = item.big;

    submitBtn.textContent = "Update Item";
    cancelBtn.hidden = false;
    fTitle.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function exitEditMode() {
    editingId = null;
    itemForm.reset();
    submitBtn.textContent = "Tambah Item";
    cancelBtn.hidden = true;
  }

  titleForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await fetch(API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: titleInput.value }),
    });
    load();
  });

  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      title: fTitle.value,
      desc: fDesc.value,
      image: fImage.value,
      order: Number(fOrder.value),
      big: fBig.checked,
    };

    // Edit mode -> PATCH ke item yang sedang diedit. Mode tambah -> POST
    // bikin item baru. Sama polanya seperti admin.js.
    const url = editingId ? `http://localhost:3000/api/categories/items/${editingId}` : `${API}/items`;
    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();

    if (!response.ok) {
      itemMsg.textContent = result.error;
      return;
    }

    itemMsg.textContent = "";
    exitEditMode();
    load();
  });

  cancelBtn.addEventListener("click", exitEditMode);

  list.addEventListener("click", async (e) => {
    const editButton = e.target.closest("[data-edit]");
    if (editButton) {
      const category = await fetch(API).then((r) => r.json());
      const item = category.items.find((i) => i.id === Number(editButton.dataset.edit));
      enterEditMode(item);
      return;
    }

    const deleteButton = e.target.closest("[data-delete]");
    if (deleteButton) {
      if (!confirm("Yakin mau hapus item ini?")) return;
      await fetch(`http://localhost:3000/api/categories/items/${deleteButton.dataset.delete}`, { method: "DELETE" });
      if (editingId === Number(deleteButton.dataset.delete)) exitEditMode();
      load();
    }
  });

  load();
}

["spa", "dining", "experience"].forEach((slug) => {
  initCategoryPanel(slug, document.querySelector(`#panel-${slug}`));
});
