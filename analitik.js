// ============================================
// UMKMate AI — Analitik (Modul 04)
// ============================================

const API_BASE = 'http://localhost:3000/api';
const LOCAL_KEY = 'umkmate_transaksi';

const elStatus = document.getElementById('conn-status');
const elTotalMasuk = document.getElementById('total-masuk');
const elTotalKeluar = document.getElementById('total-keluar');
const elSaldo = document.getElementById('saldo');
const elSaran = document.getElementById('saran-stok');

let backendAvailable = false;

function formatRupiah(angka) {
  return 'Rp ' + Number(angka || 0).toLocaleString('id-ID');
}

// Susun 14 hari terakhir sebagai sumbu waktu
function rentangTanggal() {
  const hari = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    hari.push(d.toISOString().slice(0, 10));
  }
  return hari;
}

function gambarChart(labels, dataMasuk, dataKeluar) {
  const ctx = document.getElementById('chart-tren');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.map(l => new Date(l).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })),
      datasets: [
        {
          label: 'Pemasukan',
          data: dataMasuk,
          borderColor: '#2f6f63',
          backgroundColor: 'rgba(47,111,99,0.12)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Pengeluaran',
          data: dataKeluar,
          borderColor: '#b8453a',
          backgroundColor: 'rgba(184,69,58,0.12)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { font: { family: 'IBM Plex Mono', size: 11 } } }
      },
      scales: {
        x: { ticks: { font: { family: 'IBM Plex Mono', size: 10 } } },
        y: { ticks: { font: { family: 'IBM Plex Mono', size: 10 } } }
      }
    }
  });
}

function renderSaranStok(produkList) {
  if (!produkList.length) {
    elSaran.innerHTML = '<p style="color:var(--ink-soft);">Belum ada data produk. Tambahkan data di tabel <code>produk</code> melalui pgAdmin4.</p>';
    return;
  }

  elSaran.innerHTML = produkList.map(p => {
    let saran;
    if (p.stok <= 5) {
      saran = `⚠️ Stok "${p.nama}" tinggal ${p.stok} — segera produksi/beli lagi, terutama karena sudah terjual ${p.terjual_total} unit.`;
    } else if (p.stok <= 15) {
      saran = `🟡 Stok "${p.nama}" masih ${p.stok}, mulai siapkan restock dalam beberapa hari.`;
    } else {
      saran = `✅ Stok "${p.nama}" aman (${p.stok} unit). Pertimbangkan promosi tambahan agar perputaran lebih cepat.`;
    }
    return `<div class="receipt-row"><span class="label">${saran}</span></div>`;
  }).join('');
}

// --- Mode online: ambil dari backend ---
async function muatDariBackend() {
  const res = await fetch(`${API_BASE}/analitik/ringkasan`);
  const data = await res.json();

  const masuk = data.totals.find(t => t.jenis === 'masuk');
  const keluar = data.totals.find(t => t.jenis === 'keluar');
  const totalMasuk = masuk ? Number(masuk.total) : 0;
  const totalKeluar = keluar ? Number(keluar.total) : 0;

  elTotalMasuk.textContent = formatRupiah(totalMasuk);
  elTotalKeluar.textContent = formatRupiah(totalKeluar);
  elSaldo.textContent = formatRupiah(totalMasuk - totalKeluar);

  const labels = rentangTanggal();
  const dataMasuk = labels.map(tgl => {
    const row = data.harian.find(h => h.tanggal.slice(0, 10) === tgl && h.jenis === 'masuk');
    return row ? Number(row.total) : 0;
  });
  const dataKeluar = labels.map(tgl => {
    const row = data.harian.find(h => h.tanggal.slice(0, 10) === tgl && h.jenis === 'keluar');
    return row ? Number(row.total) : 0;
  });

  gambarChart(labels, dataMasuk, dataKeluar);
  renderSaranStok(data.stokRendah);
}

// --- Mode offline: ambil dari localStorage ---
function muatDariLokal() {
  const data = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');

  const totalMasuk = data.filter(t => t.jenis === 'masuk').reduce((a, b) => a + Number(b.jumlah), 0);
  const totalKeluar = data.filter(t => t.jenis === 'keluar').reduce((a, b) => a + Number(b.jumlah), 0);

  elTotalMasuk.textContent = formatRupiah(totalMasuk);
  elTotalKeluar.textContent = formatRupiah(totalKeluar);
  elSaldo.textContent = formatRupiah(totalMasuk - totalKeluar);

  const labels = rentangTanggal();
  const dataMasuk = labels.map(tgl =>
    data.filter(t => t.jenis === 'masuk' && t.tanggal.slice(0, 10) === tgl)
        .reduce((a, b) => a + Number(b.jumlah), 0)
  );
  const dataKeluar = labels.map(tgl =>
    data.filter(t => t.jenis === 'keluar' && t.tanggal.slice(0, 10) === tgl)
        .reduce((a, b) => a + Number(b.jumlah), 0)
  );

  gambarChart(labels, dataMasuk, dataKeluar);

  // Data produk contoh untuk mode offline
  renderSaranStok([
    { nama: 'Keripik Tempe Pedas Manis', stok: 4, terjual_total: 120 },
    { nama: 'Keripik Singkong Original', stok: 12, terjual_total: 80 }
  ]);
}

// --- Inisialisasi ---
(async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error();
    backendAvailable = true;
    elStatus.textContent = 'Tersambung ke database PostgreSQL ✓';
    await muatDariBackend();
  } catch {
    backendAvailable = false;
    elStatus.textContent = 'Mode lokal — menampilkan data demo & data dari browser ini';
    muatDariLokal();
  }
})();
