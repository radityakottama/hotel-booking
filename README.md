# Tirta Senja Resort – Website Pemesanan Hotel

Demo website pemesanan hotel berbahasa Indonesia untuk **hotel fiktif** di Ubud, Bali. Dibuat murni dengan HTML, CSS, dan JavaScript (tanpa framework) sebagai proyek portofolio front-end.

> Ini proyek demo untuk belajar. Belum ada pembayaran sungguhan, tapi sekarang sudah punya backend (Node.js + Express) yang memvalidasi pesanan — lihat folder `backend/`.

## Fitur

- Pencarian berdasarkan tanggal check-in/check-out, jumlah tamu, dan jumlah kamar, lengkap dengan validasi tanggal.
- Lima tipe kamar, dengan filter tipe dan urutan (harga terendah, harga tertinggi, kapasitas).
- Kamar yang tidak muat untuk jumlah tamu, atau stoknya kurang, otomatis dinonaktifkan.
- Form pemesanan dengan validasi nama, email, dan nomor HP.
- Rincian harga: harga kamar × malam × jumlah kamar, biaya layanan 10%, pajak 11%.
- Kode pesanan otomatis dan halaman "Pesanan saya" (riwayat disimpan di browser lewat `localStorage`).
- Responsif, mendukung mode gelap, dan menghormati pengaturan "kurangi gerakan".
- Ilustrasi kamar berupa SVG, tanpa gambar eksternal.
- **Live Chat AI**: tombol chat di pojok kanan bawah untuk bertanya ke resepsionis virtual (Claude), yang menjawab berdasarkan data kamar di database.

## Menjalankan

Proyek ini sekarang punya dua bagian yang jalan terpisah: **frontend** (statis, root folder) dan **backend** (API, folder `backend/`).

**Frontend** — cara paling cepat: buka `index.html` langsung di browser. Atau lewat server lokal (butuh Python 3):

```bash
npm start
# buka http://localhost:8080
```

**Backend** (perlu jalan bersamaan supaya pencarian/pemesanan kamar berfungsi):

```bash
cd backend
npm install   # sekali saja, pertama kali
npm run dev
# API jalan di http://localhost:3000
```

**Live Chat AI** (opsional) butuh API key Claude. Salin `backend/.env.example` jadi `backend/.env`, lalu isi `ANTHROPIC_API_KEY` dengan key dari [Claude Console](https://platform.claude.com/settings/keys). File `.env` tidak ikut di-commit. Tanpa key, situs tetap jalan dan chat hanya menampilkan pesan "belum dikonfigurasi".

Menjalankan pengujian (butuh Node.js 22+, dan `npm install` di folder `backend/` sekali karena tes chat memakai dependensi backend):

```bash
npm test
```

## Struktur proyek

```
tirta-senja-booking/
├── index.html            Kerangka halaman
├── css/
│   └── styles.css        Semua gaya (tema, tata letak, komponen, responsif)
├── js/
│   ├── data.js           Konstanta aplikasi (tarif, batas, dll.) -- data kamar sudah pindah ke backend
│   ├── booking.js        Logika murni: hitung malam, harga, validasi, kode pesanan
│   │                     (dipakai dua arah: browser DAN backend/server.js)
│   ├── storage.js        Simpan dan baca riwayat pesanan (localStorage)
│   ├── ui.js             Fungsi pembuat HTML (kartu kamar, form, konfirmasi)
│   ├── app.js            State, event listener, ambil data lewat fetch() ke backend
│   └── chat.js           Widget Live Chat AI (berdiri sendiri, kirim riwayat ke /api/chat)
├── tests/
│   ├── booking.test.js   Uji unit untuk logika di booking.js
│   └── chat.test.js      Uji validasi riwayat chat dan isi instruksi untuk Claude
└── backend/               Server API (Node.js + Express), lihat package.json sendiri di sini
    ├── server.js          Route kamar, pesanan, dan POST /api/chat
    ├── chat.js            Live Chat AI: instruksi untuk Claude, validasi riwayat, panggil Claude API
    ├── .env.example       Contoh isi .env (ANTHROPIC_API_KEY)
    └── data/
        └── rooms.js        Data kamar sungguhan (sumber kebenaran, bukan lagi js/data.js)
```

## Cara membaca kodenya

Baca berurutan dari yang paling mendasar ke yang paling tinggi:

1. **`data.js`**: daftar kamar dan angka konfigurasi. Mulai dari sini untuk memahami data apa yang dipakai.
2. **`booking.js`**: semua aturan bisnis ada di sini dan tidak menyentuh halaman web. Fungsinya kecil dan murni, jadi mudah dibaca dan diuji.
3. **`storage.js`**: pembungkus `localStorage` dengan cadangan di memori kalau penyimpanan diblokir.
4. **`ui.js`**: mengubah data menjadi HTML. Perhatikan `escapeHtml`, yang mencegah serangan XSS dari teks yang diketik pengguna.
5. **`app.js`**: menyimpan satu objek `state`, memasang event listener, dan memanggil fungsi-fungsi di atas.

Alur saat pengguna menekan "Cari kamar":

```
klik tombol → Booking.validateDates → perbarui state → renderRooms
  → Booking.canBook (aktifkan/nonaktifkan tombol) → UI.roomCard (buat HTML)
```

Alur saat pengguna memesan:

```
klik "Pesan" → Booking.priceBreakdown → UI.bookingForm
  → klik "Konfirmasi" → Booking.validateGuest → Booking.generateCode
  → BookingStore.add → UI.confirmation
```

## Keputusan desain yang layak dipelajari

- **Logika dipisah dari tampilan.** `booking.js` tidak tahu apa-apa soal DOM, sehingga bisa diuji di Node.js.
- **Tanggal memakai zona waktu lokal.** `toISOString()` memakai UTC dan bisa mundur sehari di WITA mendekati tengah malam, jadi dipakai `toLocalISO`.
- **Perhitungan malam dibaca sebagai UTC** agar pergantian jam musim panas tidak menggeser hasil.
- **Satu sumber data.** Menambah kamar cukup menambah satu objek di `ROOMS`.
- **Tanpa build tool.** Skrip dimuat berurutan di `index.html`, sehingga proyek bisa dibuka dengan klik ganda.

## Ide pengembangan

- Halaman detail kamar dengan galeri foto.
- Kalender ketersediaan per tanggal (saat ini stok masih statis).
- Backend sederhana (Node/Express atau Laravel) untuk menyimpan pesanan dan ketersediaan nyata.
- Pembayaran sandbox, misalnya Midtrans.
- Tes antarmuka otomatis dengan Playwright.
- Sistem multi-tema (bukan cuma multi-konten) kalau situs ini dipakai untuk beberapa hotel dengan layout/struktur halaman yang benar-benar berbeda (bukan cuma warna/konten beda), mirip pola tema WordPress atau page builder.

## Lisensi

[MIT](LICENSE)
