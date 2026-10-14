/**
 * admin-login.js
 * Form login admin/login.html -- kirim password ke POST /api/login,
 * simpan token yang dibalas, lalu masuk ke shell admin.
 */
(() => {
  const $ = (selector) => document.querySelector(selector);

  // Toggle "tampilkan password": ganti type input password<->text,
  // ikon & aria-label ikut berubah supaya pembaca layar tahu statusnya.
  $("#pw-toggle").addEventListener("click", () => {
    const input = $("#f-password");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    $("#pw-toggle").textContent = show ? "🙈" : "👁";
    $("#pw-toggle").setAttribute("aria-label", show ? "Sembunyikan password" : "Tampilkan password");
  });

  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: $("#f-password").value }),
    });
    const result = await response.json();

    if (!response.ok) {
      $("#login-msg").textContent = result.error;
      return;
    }

    setAdminToken(result.token);
    location.href = "index.html";
  });
})();
