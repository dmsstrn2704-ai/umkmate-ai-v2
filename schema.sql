-- ============================================
-- UMKMate AI — Database Schema (PostgreSQL)
-- Jalankan file ini di pgAdmin4 (Query Tool)
-- pada database yang sudah kamu buat, misal: umkmate_db
-- ============================================

-- Tabel transaksi kas (Modul 02 — Catatan Kas, dipakai juga di Modul 04 — Analitik)
CREATE TABLE IF NOT EXISTS transaksi (
  id SERIAL PRIMARY KEY,
  catatan TEXT NOT NULL,
  jumlah NUMERIC(14, 2) NOT NULL,
  jenis VARCHAR(10) NOT NULL CHECK (jenis IN ('masuk', 'keluar')),
  tanggal TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel produk sederhana (dipakai untuk saran stok di Modul 04)
CREATE TABLE IF NOT EXISTS produk (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  stok INTEGER NOT NULL DEFAULT 0,
  harga NUMERIC(14, 2) NOT NULL DEFAULT 0,
  terjual_total INTEGER NOT NULL DEFAULT 0
);

-- Tabel riwayat chat pelanggan (Modul 03 — Chatbot)
CREATE TABLE IF NOT EXISTS chat_log (
  id SERIAL PRIMARY KEY,
  pesan_user TEXT NOT NULL,
  pesan_bot TEXT NOT NULL,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contoh data awal (boleh dihapus)
INSERT INTO produk (nama, stok, harga, terjual_total) VALUES
  ('Keripik Tempe Pedas Manis', 25, 15000, 120),
  ('Keripik Singkong Original', 10, 12000, 80)
ON CONFLICT DO NOTHING;
