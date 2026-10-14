# Tirta Senja Resort – Website Hotel + CMS

Demo website hotel berbahasa Indonesia untuk **hotel fiktif** di Ubud, Bali. Dibuat murni dengan HTML, CSS, dan JavaScript (tanpa framework) sebagai proyek portofolio front-end.

> Ini proyek demo untuk belajar. Situs ini berperan sebagai **etalase + CMS** (seperti website hotel sungguhan), sementara proses booking/pembayaran didelegasikan ke **booking engine eksternal** lewat redirect (pola yang dipakai provider seperti D-EDGE) — lihat bagian "Arsitektur: redirect ke booking engine" di bawah.

## Fitur

- Pencarian berdasarkan tanggal check-in/check-out, jumlah tamu, dan jumlah kamar, lengkap dengan validasi tanggal.
- Lima tipe kamar, dengan filter tipe dan urutan (harga terendah, harga tertinggi, kapasitas).
- Tombol "Pesan" meredirect ke booking engine eksternal, membawa tanggal/jumlah tamu yang sudah dipilih lewat query string.
- Halaman Dining/Spa/Experience: kontennya (judul & tiap item) diambil dari database, bisa diedit lewat admin.
- **Admin Panel**: satu shell dengan sidebar (`admin/index.html`) -- kelola kamar, teks hero beranda, dan konten Spa/Dining/Experience (CRUD penuh per item), semua di satu halaman tanpa reload saat pindah menu.
- Responsif, mendukung mode gelap, dan menghormati pengaturan "kurangi gerakan".
- Ilustrasi kamar berupa SVG, tanpa gambar eksternal.

## Arsitektur: redirect ke booking engine

Hotel sungguhan biasanya **tidak** memproses booking & pembayaran di website mereka sendiri — itu didelegasikan ke booking engine pihak ketiga (D-EDGE, SiteMinder, dll) lewat redirect penuh ke domain booking engine. Proyek ini meniru pola itu:

```
Situs ini (etalase + CMS)
    │
    │ klik "Pesan" → redirect PENUH, bawa tanggal/tamu via query string
    ▼
Booking engine eksternal (CONFIG.BOOKING_ENGINE_URL)
    │
    │ di sinilah ketersediaan real-time, rate plan, dan pembayaran
    │ sungguhan diproses -- di luar tanggung jawab situs ini
```

`CONFIG.BOOKING_ENGINE_URL` di [js/data.js](js/data.js) saat ini **placeholder demo**. Untuk integrasi sungguhan, ganti dengan URL yang diberikan provider booking engine (biasanya sudah termasuk kode properti hotel kamu), lalu sesuaikan nama parameter query di `goToBookingEngine()` ([js/app.js](js/app.js)) kalau provider-nya pakai nama parameter berbeda.

## Menjalankan

Proyek ini punya dua bagian yang jalan terpisah: **frontend** (statis, root folder) dan **backend** (API, folder `backend/`).

**Frontend** — cara paling cepat: buka `index.html` langsung di browser. Atau lewat server lokal (butuh Python 3):

```bash
npm start
# buka http://localhost:8080
```

**Backend** (perlu jalan bersamaan supaya daftar kamar & CMS berfungsi):

```bash
cd backend
npm install   # sekali saja, pertama kali
npm run dev
# API jalan di http://localhost:3000
```

Menjalankan pengujian (butuh Node.js 18+):

```bash
npm test
```

## Struktur proyek

```
tirta-senja-booking/
├── index.html            Kerangka halaman (etalase)
├── category.html         Satu halaman untuk Dining/Spa/Experience (?slug=...)
├── admin/
│   └── index.html         Shell admin: sidebar + panel Kamar/Beranda/Spa/Dining/Experience
├── css/
│   └── styles.css        Semua gaya, termasuk layout sidebar admin (.admin-shell dkk)
├── js/
│   ├── data.js            Konstanta aplikasi, termasuk CONFIG.BOOKING_ENGINE_URL
│   ├── booking.js         Logika murni: validasi tanggal (dipakai browser & backend)
│   ├── ui.js               Fungsi pembuat HTML (kartu kamar, kartu konten, dll.)
│   ├── app.js              State, event listener, redirect ke booking engine
│   ├── nav.js              Bangun link menu header dari GET /api/categories
│   ├── page-category.js    Render satu halaman kategori berdasar ?slug=
│   ├── admin.js             Panel "Kelola Kamar" di shell admin
│   ├── admin-content.js     Panel "Beranda" di shell admin
│   ├── admin-category.js    Panel Spa/Dining/Experience (1 controller dipakai 3x)
│   └── admin-shell.js       Logika sidebar: tampilkan/sembunyikan panel
├── tests/
│   └── booking.test.js   Uji unit untuk logika di booking.js
└── backend/               Server API (Node.js + Express), lihat package.json sendiri di sini
    ├── server.js           Semua route: /api/rooms, /api/content, /api/categories
    ├── models/
    │   ├── Room.js          Query SQL kamar (konten marketing, bukan stok real-time)
    │   ├── Content.js       Query SQL konten hero (title/subtitle)
    │   └── Category.js      Query SQL kategori + item (Dining/Spa/Experience)
    └── data/
        ├── rooms.js         Data kamar awal (dipakai sekali untuk seed database)
        └── categories.js    Data kategori awal (dipakai sekali untuk seed database)
```

> **Catatan IIFE:** `admin.js`, `admin-content.js`, dan `admin-category.js` sama-sama
> jalan di SATU halaman (`admin/index.html`), jadi tiap file dibungkus
> `(() => { ... })()` supaya variabel seperti `$`/`API` tidak bentrok antar file
> (kalau tidak dibungkus, `const` yang sama-sama dideklarasikan di level global
> akan jadi `SyntaxError`).

## Cara membaca kodenya

Baca berurutan dari yang paling mendasar ke yang paling tinggi:

1. **`data.js`**: konfigurasi aplikasi, termasuk URL booking engine. Mulai dari sini untuk memahami pengaturan apa yang dipakai.
2. **`booking.js`**: validasi tanggal murni, tidak menyentuh halaman web — mudah dibaca dan diuji.
3. **`ui.js`**: mengubah data menjadi HTML. Perhatikan `escapeHtml`, yang mencegah serangan XSS dari teks yang diketik pengguna.
4. **`app.js`**: menyimpan satu objek `state`, memasang event listener, ambil data & konten dari backend, dan meredirect ke booking engine saat "Pesan" diklik.

Alur saat pengguna menekan "Cari kamar":

```
klik tombol → Booking.validateDates → perbarui state (tanggal, tamu)
```

Alur saat pengguna memesan:

```
klik "Pesan" → goToBookingEngine (bangun query string) → redirect ke CONFIG.BOOKING_ENGINE_URL
```

## Keputusan desain yang layak dipelajari

- **Logika dipisah dari tampilan.** `booking.js` tidak tahu apa-apa soal DOM, sehingga bisa diuji di Node.js.
- **Tanggal memakai zona waktu lokal.** `toISOString()` memakai UTC dan bisa mundur sehari di WITA mendekati tengah malam, jadi dipakai `toLocalISO`.
- **Pola partial update** di CRUD kamar (`Room.update`), hero (`Content.update`), dan item kategori (`Category.updateItem`): cuma field yang dikirim yang berubah, field lain tetap sama.
- **Satu controller dipakai ulang.** Panel Spa/Dining/Experience di admin punya markup HTML yang nyaris identik, tapi SATU fungsi `initCategoryPanel(slug, panelEl)` yang mengendalikan ketiganya -- bukan 3 salinan kode JS yang sama persis.
- **Graceful fallback.** Kalau backend/API gagal dihubungi (mis. lupa `npm run dev`), teks hero default di HTML tetap tampil, situs tidak "rusak" total.
- **Tanpa build tool.** Skrip dimuat berurutan di `index.html`, sehingga proyek bisa dibuka dengan klik ganda.

## Ide pengembangan

- Halaman detail kamar dengan galeri foto.
- CMS diperluas lagi: upload gambar (saat ini URL teks), promo banner, artikel/blog.
- Integrasi booking engine sungguhan (D-EDGE, SiteMinder, dll) menggantikan `CONFIG.BOOKING_ENGINE_URL` placeholder.
- Autentikasi untuk `admin/` (saat ini siapa pun yang tahu alamatnya bisa ubah kamar/konten).
- Tes antarmuka otomatis dengan Playwright.
- Sistem multi-tema (bukan cuma multi-konten) kalau situs ini dipakai untuk beberapa hotel dengan layout/struktur halaman yang benar-benar berbeda (bukan cuma warna/konten beda), mirip pola tema WordPress atau page builder.

## Lisensi

[MIT](LICENSE)
