/**
 * admin-shell.js
 * Logika sidebar: klik menu -> tampilkan panel yang sesuai, sembunyikan
 * yang lain, tanpa reload halaman. Panel & data-nya sendiri sudah
 * dimuat semua sejak awal (lewat admin.js/admin-content.js/admin-category.js)
 * -- file ini CUMA urusan tampil/sembunyi, tidak urusan ambil data.
 */
(() => {
  const menuButtons = document.querySelectorAll(".admin-sidebar button[data-panel]");

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      menuButtons.forEach((b) => b.removeAttribute("aria-current"));
      button.setAttribute("aria-current", "true");

      document.querySelectorAll(".admin-panel").forEach((panel) => {
        panel.hidden = panel.id !== `panel-${button.dataset.panel}`;
      });
    });
  });

  document.querySelector("#admin-logout").addEventListener("click", () => {
    clearAdminToken(); // dari admin-auth.js
    location.href = "login.html";
  });
})();
