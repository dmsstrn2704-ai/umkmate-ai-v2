// ============================================
// UMKMate AI — Kas & Analitik (Modul 02 + 04)
// ============================================

const API_BASE  = 'http://localhost:3000/api';
const LOCAL_KEY = 'umkmate_transaksi';

// DOM refs — Catatan Kas
const elCatatan    = document.getElementById('catatan');
const elJumlah     = document.getElementById('jumlah');
const elJenis      = document.getElementById('jenis');
const elTabel      = document.getElementById('tabel-transaksi');
const elStatus     = document.getElementById('conn-status');

// DOM refs — KPI (shared antara kas & analitik)
const elTotalMasuk  = document.getElementById('total-masuk');
const elTotalKeluar = document.getElementById('total-keluar');
const elSaldo       = document.getElementById('saldo');

// DOM refs — Analitik
const elSaran = document.getElementById('saran-stok');

let backendAvailable = false;
let chartInstance    = null;   // simpan referensi agar bisa di-destroy sebelum redraw

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRupiah(angka) {
  return 'Rp ' + Number(angka || 0).toLocaleString('id-ID');
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/** Kembalikan array 14 tanggal terakhir dalam format YYYY-MM-DD */
function rentangTanggal() {
  const hari = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    hari.push(d.toISOString().slice(0, 10));
  }
  return hari;
}

// ─── Render Chart ─────────────────────────────────────────────────────────────

function gambarChart(labels, dataMasuk, dataKeluar) {
  const canvas = document.getElementById('chart-tren');
  if (!canvas) return;

  // Hancurkan instance lama jika ada (hindari "Canvas already in use" error)
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels.map(l =>
        new Date(l).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
      ),
      datasets: [
        {
          label: 'Pemasukan',
          data: dataMasuk,
          borderColor: '#2f6f63',
          backgroundColor: 'rgba(47,111,99,0.12)',
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6
        },
        {
          label: 'Pengeluaran',
          data: dataKeluar,
          borderColor: '#b8453a',
          backgroundColor: 'rgba(184,69,58,0.12)',
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            font: { family: "'IBM Plex Mono', monospace", size: 11 },
            boxWidth: 14,
            padding: 16
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => ' ' + formatRupiah(ctx.parsed.y)
          }
        }
      },
      scales: {
        x: {
          ticks: { font: { family: "'IBM Plex Mono', monospace", size: 10 }, maxRotation: 45 },
          grid: { color: 'rgba(34,48,58,0.06)' }
        },
        y: {
          ticks: {
            font: { family: "'IBM Plex Mono', monospace", size: 10 },
            callback: v => 'Rp ' + Number(v).toLocaleString('id-ID')
          },
          grid: { color: 'rgba(34,48,58,0.06)' }
        }
      }
    }
  });
}

// ─── Render Saran Stok ────────────────────────────────────────────────────────

function renderSaranStok(produkList) {
  if (!elSaran) return;

  if (!produkList || !produkList.length) {
    elSaran.innerHTML =
      '<p style="color:var(--ink-soft);margin:0;">Belum ada data produk. ' +
      'Tambahkan data di tabel <code>produk</code> melalui pgAdmin4.</p>';
    return;
  }

  elSaran.innerHTML = produkList.map(p => {
    let saran;
    if (p.stok <= 5) {
      saran = `⚠️ Stok <strong>${escapeHtml(p.nama)}</strong> tinggal ${p.stok} — segera produksi/beli lagi (sudah terjual ${p.terjual_total} unit).`;
    } else if (p.stok <= 15) {
      saran = `🟡 Stok <strong>${escapeHtml(p.nama)}</strong> masih ${p.stok}, mulai siapkan restock dalam beberapa hari.`;
    } else {
      saran = `✅ Stok <strong>${escapeHtml(p.nama)}</strong> aman (${p.stok} unit). Pertimbangkan promosi agar perputaran lebih cepat.`;
    }
    return `<div class="receipt-row" style="border-bottom:1px dashed var(--paper-line);padding:10px 0;">
              <span style="font-size:0.9rem;line-height:1.5;">${saran}</span>
            </div>`;
  }).join('');
}

// ─── Render Tabel Transaksi ───────────────────────────────────────────────────

function renderTabel(data) {
  if (!elTabel) return;
  if (!data.length) {
    elTabel.innerHTML =
      '<tr><td colspan="3" class="table-empty">Belum ada transaksi.</td></tr>';
    return;
  }
  elTabel.innerHTML = data.map(t => {
    const tanggal = new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    const tanda = t.jenis === 'masuk' ? '+' : '−';
    const kelas = t.jenis === 'masuk' ? 'amount-in' : 'amount-out';
    return `<tr>
      <td>${tanggal}</td>
      <td>${escapeHtml(t.catatan)}</td>
      <td class="${kelas}" style="text-align:right;">${tanda} ${formatRupiah(t.jumlah)}</td>
    </tr>`;
  }).join('');
}

// ─── Render KPI ───────────────────────────────────────────────────────────────

function renderKPI(data) {
  const masuk  = data.filter(t => t.jenis === 'masuk') .reduce((a, b) => a + Number(b.jumlah), 0);
  const keluar = data.filter(t => t.jenis === 'keluar').reduce((a, b) => a + Number(b.jumlah), 0);
  if (elTotalMasuk)  elTotalMasuk.textContent  = formatRupiah(masuk);
  if (elTotalKeluar) elTotalKeluar.textContent = formatRupiah(keluar);
  if (elSaldo)       elSaldo.textContent       = formatRupiah(masuk - keluar);
}

// ─── Chart data dari array transaksi lokal ────────────────────────────────────

function gambarChartDariLokal(data) {
  const labels     = rentangTanggal();
  const dataMasuk  = labels.map(tgl =>
    data.filter(t => t.jenis === 'masuk' && t.tanggal.slice(0, 10) === tgl)
        .reduce((a, b) => a + Number(b.jumlah), 0)
  );
  const dataKeluar = labels.map(tgl =>
    data.filter(t => t.jenis === 'keluar' && t.tanggal.slice(0, 10) === tgl)
        .reduce((a, b) => a + Number(b.jumlah), 0)
  );
  gambarChart(labels, dataMasuk, dataKeluar);
}

// ─── Simpan lokal ─────────────────────────────────────────────────────────────

function simpanLokal(transaksi) {
  const data = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  data.unshift({ id: Date.now(), ...transaksi });
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

// ─── Muat semua data (transaksi + chart + saran) ──────────────────────────────

async function muatSemua() {
  if (backendAvailable) {
    // ── Mode online ──
    try {
      // 1. Ambil transaksi untuk tabel
      const resT = await fetch(`${API_BASE}/transaksi`);
      const transaksi = resT.ok ? await resT.json() : [];
      renderTabel(transaksi);
      renderKPI(transaksi);

      // 2. Ambil ringkasan analitik untuk chart
      const resA = await fetch(`${API_BASE}/analitik/ringkasan`);
      if (resA.ok) {
        const analitik = await resA.json();
        const labels = rentangTanggal();
        const dataMasuk  = labels.map(tgl => {
          const r = (analitik.harian || []).find(h => h.tanggal.slice(0, 10) === tgl && h.jenis === 'masuk');
          return r ? Number(r.total) : 0;
        });
        const dataKeluar = labels.map(tgl => {
          const r = (analitik.harian || []).find(h => h.tanggal.slice(0, 10) === tgl && h.jenis === 'keluar');
          return r ? Number(r.total) : 0;
        });
        gambarChart(labels, dataMasuk, dataKeluar);

        // KPI dari analitik endpoint (lebih akurat untuk total)
        const totMasuk  = analitik.totals?.find(t => t.jenis === 'masuk');
        const totKeluar = analitik.totals?.find(t => t.jenis === 'keluar');
        if (totMasuk && totKeluar) {
          const m = Number(totMasuk.total);
          const k = Number(totKeluar.total);
          if (elTotalMasuk)  elTotalMasuk.textContent  = formatRupiah(m);
          if (elTotalKeluar) elTotalKeluar.textContent = formatRupiah(k);
          if (elSaldo)       elSaldo.textContent       = formatRupiah(m - k);
        }

        renderSaranStok(analitik.stokRendah || []);
      } else {
        // Chart fallback dari transaksi lokal jika endpoint analitik tidak ada
        gambarChartDariLokal(transaksi);
        await muatSaranStokDariAPI();
      }
    } catch (err) {
      console.error('Error memuat data online:', err);
      muatModOffline();
    }
  } else {
    // ── Mode offline ──
    muatModOffline();
  }
}

async function muatSaranStokDariAPI() {
  try {
    const res = await fetch(`${API_BASE}/produk`);
    if (!res.ok) throw new Error('API produk gagal');
    const produk = await res.json();
    renderSaranStok(produk);
  } catch {
    renderSaranStok([
      { nama: 'Keripik Tempe Pedas Manis', stok: 4,  terjual_total: 120 },
      { nama: 'Keripik Singkong Original', stok: 12, terjual_total: 80  }
    ]);
  }
}

function muatModOffline() {
  const data = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  renderTabel(data);
  renderKPI(data);
  gambarChartDariLokal(data);
  renderSaranStok([
    { nama: 'Keripik Tempe Pedas Manis', stok: 4,  terjual_total: 120 },
    { nama: 'Keripik Singkong Original', stok: 12, terjual_total: 80  }
  ]);
}

// ─── Event: Deteksi Otomatis ──────────────────────────────────────────────────

document.getElementById('btn-parse')?.addEventListener('click', () => {
  const teks = (elCatatan?.value || '').toLowerCase();

  let match  = teks.match(/(\d+(?:[.,]\d+)?)\s*(rb|ribu|k)?/);
  let jumlah = 0;
  if (match) {
    jumlah = parseFloat(match[1].replace(',', '.').replace(/\./g, ''));
    if (match[2]) jumlah *= 1000;
  }

  const kataMasuk  = ['jual', 'terima', 'dapat', 'pemasukan', 'untung', 'bayar dari'];
  const kataKeluar = ['beli', 'bayar', 'keluar', 'belanja', 'pengeluaran', 'sewa'];

  let jenis = 'masuk';
  if (kataKeluar.some(k => teks.includes(k))) jenis = 'keluar';
  if (kataMasuk.some(k  => teks.includes(k))) jenis = 'masuk';

  if (jumlah > 0 && elJumlah) elJumlah.value = jumlah;
  if (elJenis) elJenis.value = jenis;
});

// ─── Event: Simpan Transaksi ──────────────────────────────────────────────────

document.getElementById('btn-simpan')?.addEventListener('click', async () => {
  const catatan = elCatatan?.value.trim() || '';
  const jumlah  = parseFloat(elJumlah?.value || '0');
  const jenis   = elJenis?.value || 'masuk';

  if (!catatan || !jumlah) {
    alert('Isi catatan dan jumlah terlebih dahulu.');
    return;
  }

  const transaksi = { catatan, jumlah, jenis, tanggal: new Date().toISOString() };

  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/transaksi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaksi)
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
    } catch (err) {
      console.error(err);
      simpanLokal(transaksi);
    }
  } else {
    simpanLokal(transaksi);
  }

  if (elCatatan) elCatatan.value = '';
  if (elJumlah)  elJumlah.value  = '';

  muatSemua();
});

// ─── Init: Cek backend → muat semua ──────────────────────────────────────────

(async () => {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error();
    backendAvailable = true;
    if (elStatus) elStatus.textContent = 'Tersambung ke database PostgreSQL ✓';
  } catch {
    backendAvailable = false;
    if (elStatus) elStatus.textContent = 'Mode lokal — data tersimpan di browser ini saja';
  }
  await muatSemua();
})();
