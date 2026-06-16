# UMKMate AI

Asisten AI all-in-one untuk pelaku UMKM Indonesia — caption produk, catatan kas,
chatbot pelanggan, analitik, ekspor multi-bahasa, konten visual, branding, dan
negosiasi harga, dalam satu web app yang ditenagai Amazon Bedrock via PartyRock.

Semua file ada dalam **satu folder** (tidak ada subfolder), supaya mudah dikelola.

---

## 8 Modul Fitur

| # | Modul | File | Keterangan |
|---|-------|------|-----------|
| 01 | **Caption AI** | `caption.html` + `caption.js` | Generate caption Instagram / Facebook / WhatsApp dengan 4 gaya bahasa, deteksi jenis produk otomatis, terjemahan 4 bahasa |
| 02 & 04 | **Kas & Analitik** | `keuangan.html` + `keuangan.js` | Catat transaksi harian, ringkasan KPI, grafik tren 14 hari, saran stok AI — tersambung PostgreSQL |
| 03 | **Chatbot Pelanggan** | `chatbot.html` + `chatbot.js` | Simulasi chatbot rule-based 24 jam, log percakapan ke database |
| 05 | **Ekspor Multi-bahasa** | `ekspor.html` | Generator deskripsi produk dalam 5 bahasa via PartyRock (English, 中文, العربية, 日本語, 한국어) |
| 06 | **Foto & Video AI** | `video.html` | Generator prompt foto produk (Midjourney/DALL-E) dan video (Kling/Hailuo/Pika) via PartyRock, dengan tab switcher |
| 07 | **Branding** | `branding.html` | Generator nama produk, slogan, konsep warna, dan bio media sosial via PartyRock |
| 08 | **Negosiasi Harga** | `negosiasi.html` | Asisten strategi negosiasi dengan 5 skenario (eceran, reseller, grosir, konsinyasi, internasional) via PartyRock |

---

## Daftar File

```
# ── Halaman ──────────────────────────────────────────────────────
index.html          # Dasbor utama + landing page (hero, stats counter, module grid)
caption.html        # Modul 01 — Caption AI
keuangan.html       # Modul 02 & 04 — Kas & Analitik (digabung)
chatbot.html        # Modul 03 — Chatbot Pelanggan
ekspor.html         # Modul 05 — Ekspor Multi-bahasa (via PartyRock)
video.html          # Modul 06 — Foto & Video AI (via PartyRock)
branding.html       # Modul 07 — Branding (via PartyRock)
negosiasi.html      # Modul 08 — Negosiasi Harga (via PartyRock)

# ── Logic Frontend ───────────────────────────────────────────────
caption.js          # Modul 01 — smart caption generator (deteksi produk, 4 tone, terjemahan)
keuangan.js         # Modul 02 & 04 — catatan kas + chart analitik (terintegrasi)
chatbot.js          # Modul 03 — chatbot rule-based
ekspor.js           # Modul 05 — (legacy; halaman kini pakai PartyRock langsung)

# ── Styling ──────────────────────────────────────────────────────
style.css           # Tema visual lengkap (design tokens, animasi, responsive, semua modul)

# ── Backend ──────────────────────────────────────────────────────
server.js           # API Express (transaksi, chatbot, analitik) + timezone WIB fix
schema.sql          # Struktur tabel PostgreSQL (transaksi, produk, chat_log)
package.json        # Daftar dependensi backend
package-lock.json   # Lock file npm
.env                # Konfigurasi database aktif (tidak di-commit)
.env.example        # Template konfigurasi database
.gitignore          # Mengabaikan node_modules/ dan .env
```

---

## App PartyRock yang Sudah Live

Semua app ditenagai **Amazon Bedrock** dan bisa diakses gratis:

| # | Nama App | Link | Dipakai di Modul |
|---|----------|------|-----------------|
| 1 | Pembuat Caption Produk UMKM | [Buka →](https://partyrock.aws/u/Dimas27/sUQG-DaHZ/Pembuat-Caption-Produk-UMKM) | Modul 01 (Caption AI) |
| 2 | Caption dari Foto + Terjemahan | [Buka →](https://partyrock.aws/u/Dimas27/6TCrfP58L/new-app-6TCrfP58L) | Modul 01 (Caption dari Foto) |
| 3 | UMKM Global Product Description Generator | [Buka →](https://partyrock.aws/u/Dimas27/BVNQJke0g/UMKM-Global-Product-Description-Generator) | Modul 05 (Ekspor) |
| 4 | Generator Prompt Foto Produk AI | [Buka →](https://partyrock.aws/u/Dimas27/-6Fimenlq/new-app-6Fimenlq) | Modul 06 (Foto AI) |
| 5 | Generator Prompt Video AI | [Buka →](https://partyrock.aws/u/Dimas27/wR5TeLDph/new-app-wR5TeLDph) | Modul 06 (Video AI) |
| 6 | Kreator Brand UMKM Indonesia | [Buka →](https://partyrock.aws/u/Dimas27/ULKxYsyK9/Kreator-Brand-UMKM-Indonesia) | Modul 07 (Branding) |
| 7 | Asisten Negosiasi Harga UMKM Indonesia | [Buka →](https://partyrock.aws/u/Dimas27/lUkM2gONP/Asisten-Negosiasi-Harga-UMKM-Indonesia) | Modul 08 (Negosiasi) |

---

## Setup & Menjalankan Project

### 1. Membuka Frontend (tanpa backend)

Klik dua kali `index.html` untuk membuka di browser. Semua modul bisa langsung
dicoba dalam **mode demo lokal**:

- **Caption AI** → generator lokal cerdas dengan deteksi jenis produk otomatis,
  4 gaya bahasa, output 3 platform (IG/FB/WA), dan terjemahan 4 bahasa
- **Kas & Analitik** → data tersimpan di `localStorage` browser, grafik Chart.js
  memakai data demo offline
- **Chatbot** → balasan rule-based dari `chatbot.js`
- **Ekspor, Video, Branding, Negosiasi** → klik tombol untuk membuka app PartyRock
  di tab baru (perlu koneksi internet)

### 2. Database (pgAdmin4 + PostgreSQL)

1. Buka pgAdmin4, buat database baru, misalnya `umkmate_db`.
2. Klik kanan database tersebut → **Query Tool**.
3. Buka file `schema.sql`, copy semua isinya, paste ke Query Tool, lalu jalankan
   (**Execute / F5**).
4. Tabel `transaksi`, `produk`, dan `chat_log` akan otomatis dibuat.
5. Skema sudah menyertakan `SET timezone = 'Asia/Jakarta'` — semua timestamp
   tersimpan dalam WIB (UTC+7).

### 3. Menjalankan Backend

Buka Command Prompt di folder project, lalu:

```bash
npm install
```

Salin `.env.example` menjadi `.env`, lalu edit sesuai pengaturan PostgreSQL-mu:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=umkmate_db
DB_USER=postgres
DB_PASSWORD=passwordmu
PORT=3000
```

Jalankan backend:

```bash
npm start
```

Jika berhasil:

```
UMKMate AI backend berjalan di http://localhost:3000
```

Setelah backend aktif, buka `keuangan.html` — badge status akan berubah jadi
**"Tersambung ke database PostgreSQL ✓"**. Grafik dan saran stok akan memuat
data nyata dari database.

### 4. Timezone WIB

Backend sudah dikonfigurasi agar semua timestamp menggunakan **Asia/Jakarta (UTC+7)**:

- `pool.on('connect')` menjalankan `SET timezone = 'Asia/Jakarta'` tiap koneksi
- Query INSERT menggunakan `NOW() AT TIME ZONE 'Asia/Jakarta'`
- Query SELECT mengembalikan `tanggal AT TIME ZONE 'Asia/Jakarta'`
- Grafik analitik mengelompokkan hari berdasarkan `DATE(tanggal AT TIME ZONE 'Asia/Jakarta')`

### 5. Deploy ke Hosting Gratis

**Frontend** — deploy semua file `.html`, `.css`, `.js` ke
[Vercel](https://vercel.com) atau [Netlify](https://netlify.com) (drag & drop).

**Backend** — deploy `server.js`, `package.json` ke [Render](https://render.com)
atau [Railway](https://railway.app), lalu sambungkan ke database PostgreSQL cloud
(Neon, Supabase, atau Railway Postgres).

Setelah backend live, ubah `API_BASE` di `keuangan.js` dan `chatbot.js` dari
`http://localhost:3000/api` menjadi URL backend yang online.

---

## Roadmap Pengembangan

- [x] Struktur dasar 4 modul + desain visual (ledger/buku kas theme)
- [x] Caption AI — generator lokal cerdas (deteksi produk, 4 tone, 3 platform, terjemahan 4 bahasa)
- [x] Catatan Kas (CRUD + PostgreSQL + localStorage fallback)
- [x] Chatbot pelanggan (rule-based + log ke database)
- [x] Analitik — grafik tren Chart.js + saran stok AI (digabung ke keuangan.html)
- [x] Ekspor Multi-bahasa — 5 bahasa via PartyRock (English, 中文, العربية, 日本語, 한국어)
- [x] Foto & Video AI — generator prompt foto + video, tab switcher, 6 tool rekomendasi
- [x] Branding — generator nama produk, slogan, dan identitas brand via PartyRock
- [x] Negosiasi Harga — asisten strategi & skrip negosiasi 5 skenario via PartyRock
- [x] Landing page modern — hero animasi, stats counter, module grid 8 kartu
- [x] Hamburger menu responsive untuk semua halaman
- [x] Timezone fix — semua timestamp WIB (Asia/Jakarta)
- [x] Responsive design — target 375px (iPhone SE) sampai 768px (tablet)
- [x] 7 app PartyRock live (Amazon Bedrock)
- [ ] Autentikasi pengguna (multi-UMKM, login per toko)
- [ ] PWA: `manifest.json` + service worker agar bisa di-install di HP
- [ ] Push notification untuk stok rendah
- [ ] Export laporan keuangan ke PDF / Excel

---

## Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| Frontend | HTML5, CSS3 (custom design tokens), Vanilla JavaScript |
| Grafik | Chart.js 4.4.4 |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (pgAdmin4) |
| AI | Amazon Bedrock via PartyRock |
| Font | Space Grotesk, Plus Jakarta Sans, IBM Plex Mono (Google Fonts) |
| Deploy | Vercel / Netlify (frontend), Render / Railway (backend) |

---

*Dibuat untuk Hackathon — UMKMate AI membantu UMKM Indonesia naik kelas dengan AI.*
