// ============================================
// UMKMate AI — Backend API
// Express + PostgreSQL (pgAdmin4)
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'umkmate_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || ''
});

// ── Paksa timezone WIB (Asia/Jakarta = UTC+7) untuk setiap koneksi baru ──────
// pg memanggil ini sekali per koneksi sebelum query pertama dijalankan.
pool.on('connect', (client) => {
  client.query("SET timezone = 'Asia/Jakarta'");
});

// --- Health check ---
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================
// MODUL 02 — Catatan Kas
// ============================================

app.get('/api/transaksi', async (req, res) => {
  try {
    // Kembalikan tanggal dalam WIB agar tampilan di frontend sudah benar
    const result = await pool.query(
      `SELECT id, catatan, jumlah, jenis,
              (tanggal AT TIME ZONE 'Asia/Jakarta') AS tanggal
       FROM transaksi
       ORDER BY tanggal DESC
       LIMIT 200`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/transaksi', async (req, res) => {
  const { catatan, jumlah, jenis, tanggal } = req.body;

  if (!catatan || !jumlah || !['masuk', 'keluar'].includes(jenis)) {
    return res.status(400).json({ message: 'Data tidak lengkap atau jenis tidak valid.' });
  }

  try {
    // Jika client mengirim tanggal (ISO string UTC dari JS), konversi ke WIB.
    // Jika tidak dikirim, gunakan NOW() AT TIME ZONE 'Asia/Jakarta' agar
    // waktu server selalu tersimpan sebagai WIB — bukan UTC.
    const result = await pool.query(
      `INSERT INTO transaksi (catatan, jumlah, jenis, tanggal)
       VALUES ($1, $2, $3,
         COALESCE($4::timestamptz, NOW() AT TIME ZONE 'Asia/Jakarta')
       )
       RETURNING id, catatan, jumlah, jenis,
         (tanggal AT TIME ZONE 'Asia/Jakarta') AS tanggal`,
      [catatan, jumlah, jenis, tanggal || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// MODUL 03 — Chatbot (rule-based sederhana)
// Ganti logic di dalam buatBalasan() dengan
// panggilan ke PartyRock / model AI pilihanmu.
// ============================================

function buatBalasan(pesan) {
  const teks = pesan.toLowerCase();

  if (teks.includes('jam') || teks.includes('buka')) {
    return 'Kami buka setiap hari pukul 08.00 - 20.00 WIB. Untuk pemesanan di luar jam tersebut, silakan tinggalkan pesan ya!';
  }
  if (teks.includes('harga') || teks.includes('berapa')) {
    return 'Harga produk kami mulai dari Rp 12.000. Boleh sebutkan nama produknya agar kami bantu infokan harga pastinya?';
  }
  if (teks.includes('ongkir') || teks.includes('kirim') || teks.includes('pengiriman')) {
    return 'Kami melayani pengiriman via kurir instan (GoSend/GrabExpress) untuk area dalam kota, dan JNE/J&T untuk luar kota.';
  }
  if (teks.includes('halo') || teks.includes('hai') || teks.includes('permisi')) {
    return 'Halo! Terima kasih sudah menghubungi kami. Ada yang bisa kami bantu? 😊';
  }
  return 'Terima kasih atas pesannya! Tim kami akan segera membalas. Sementara itu, kamu juga bisa tanya tentang jam buka, harga, atau pengiriman.';
}

app.post('/api/chat', async (req, res) => {
  const { pesan } = req.body;
  if (!pesan) return res.status(400).json({ message: 'Pesan kosong.' });

  const balasan = buatBalasan(pesan);

  try {
    await pool.query(
      'INSERT INTO chat_log (pesan_user, pesan_bot) VALUES ($1, $2)',
      [pesan, balasan]
    );
  } catch (err) {
    console.error('Gagal menyimpan log chat:', err.message);
  }

  res.json({ balasan });
});

// ============================================
// MODUL 04 — Analitik
// ============================================

app.get('/api/analitik/ringkasan', async (req, res) => {
  try {
    const totals = await pool.query(`
      SELECT jenis, COALESCE(SUM(jumlah), 0) AS total
      FROM transaksi
      GROUP BY jenis
    `);

    const harian = await pool.query(`
      SELECT
        DATE(tanggal AT TIME ZONE 'Asia/Jakarta') AS tanggal,
        jenis,
        SUM(jumlah) AS total
      FROM transaksi
      WHERE tanggal >= (NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '14 days'
      GROUP BY DATE(tanggal AT TIME ZONE 'Asia/Jakarta'), jenis
      ORDER BY tanggal ASC
    `);

    const stokRendah = await pool.query(`
      SELECT nama, stok, terjual_total
      FROM produk
      ORDER BY stok ASC
      LIMIT 5
    `);

    res.json({
      totals: totals.rows,
      harian: harian.rows,
      stokRendah: stokRendah.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/produk', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produk ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`UMKMate AI backend berjalan di http://localhost:${PORT}`);
});
