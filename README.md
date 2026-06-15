# UMKMate AI

Asisten AI all-in-one untuk pelaku UMKM Indonesia — caption produk, catatan kas,
chatbot pelanggan, dan analitik, dalam satu web app.

Semua file ada dalam **satu folder** (tidak ada subfolder), supaya mudah dikelola.

## Daftar File

```
index.html       # Dasbor utama
caption.html      # Modul 01 — Caption AI
keuangan.html      # Modul 02 — Catatan Kas
chatbot.html        # Modul 03 — Chatbot
analitik.html        # Modul 04 — Analitik & Saran Stok

style.css            # Tema visual (gaya buku kas/ledger)
caption.js            # Logic Modul 01
keuangan.js            # Logic Modul 02
chatbot.js              # Logic Modul 03
analitik.js              # Logic Modul 04

server.js                 # Backend API (Express)
schema.sql                  # Struktur tabel PostgreSQL
package.json                 # Daftar library backend
.env.example                   # Contoh konfigurasi database
```

## 1. Membuka Frontend (tanpa backend)

Klik dua kali `index.html` untuk membuka di browser. Semua modul bisa langsung
dicoba dalam **mode demo lokal**:
- Caption AI -> pakai template bawaan
- Catatan Kas & Analitik -> data tersimpan di `localStorage` browser
- Chatbot -> balasan rule-based dari `chatbot.js`

## 2. Database (pgAdmin4 + PostgreSQL)

1. Buka pgAdmin4, buat database baru, misalnya `umkmate_db`.
2. Klik kanan database tersebut -> **Query Tool**.
3. Buka file `schema.sql` (pakai Notepad), copy semua isinya, paste ke Query Tool,
   lalu jalankan (Execute / F5).
4. Tabel `transaksi`, `produk`, dan `chat_log` akan otomatis dibuat.

## 3. Menjalankan Backend

Buka Command Prompt, masuk ke folder ini, lalu:

```bash
npm install
```

Setelah selesai, salin file `.env.example` menjadi `.env` (boleh pakai copy-paste
di File Explorer lalu rename), lalu edit `.env` sesuai pengaturan PostgreSQL kamu
(host, port, nama database, user, password).

Jalankan backend:

```bash
npm start
```

Jika berhasil, akan muncul:

```
UMKMate AI backend berjalan di http://localhost:3000
```

Setelah backend aktif, buka kembali `keuangan.html`, `chatbot.html`, atau
`analitik.html` — badge status di bagian atas halaman akan berubah jadi
**"Tersambung ke database PostgreSQL ✓"**.

## 4. Menyambungkan ke PartyRock

1. Buat widget di [PartyRock](https://partyrock.aws) yang menerima input sesuai
   kebutuhan modul (misalnya: nama produk, harga, keunggulan -> output caption).
2. Klik **Share** di PartyRock untuk mendapatkan link publik.
3. - Untuk **Caption AI**: tempel link ke variabel `PARTYROCK_URL` di `caption.js`.
   - Untuk **Chatbot**: gunakan API PartyRock di dalam fungsi `buatBalasan()`
     pada `server.js`.

## 5. Deploy ke Hosting Gratis

- **Frontend**: deploy semua file `.html`, `.css`, `.js` ke [Vercel](https://vercel.com)
  atau [Netlify](https://netlify.com) — drag & drop saja.
- **Backend**: deploy `server.js`, `package.json`, `schema.sql` ke
  [Render](https://render.com) atau [Railway](https://railway.app), lalu
  hubungkan ke database PostgreSQL cloud (Neon, Supabase, atau Railway Postgres).
- Setelah backend live, ubah `API_BASE` di `keuangan.js`, `chatbot.js`, dan
  `analitik.js` dari `http://localhost:3000/api` menjadi URL backend yang online.

## Roadmap Pengembangan

- [x] Struktur dasar 4 modul + desain visual
- [x] Caption AI (mode template, siap disambungkan PartyRock)
- [x] Catatan Kas (CRUD + PostgreSQL)
- [x] Chatbot (rule-based + log ke database)
- [x] Analitik (chart tren + saran stok)
- [ ] Integrasi AI nyata via PartyRock untuk Caption & Chatbot
- [ ] Autentikasi pengguna (multi-UMKM)
- [ ] PWA: manifest.json + service worker agar bisa di-install di HP
