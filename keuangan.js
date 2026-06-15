// ============================================
// UMKMate AI — Catatan Kas (Modul 02)
// ============================================

// Ubah jika backend dijalankan di alamat/port lain
const API_BASE = 'http://localhost:3000/api';
const LOCAL_KEY = 'umkmate_transaksi';

const elCatatan = document.getElementById('catatan');
const elJumlah = document.getElementById('jumlah');
const elJenis = document.getElementById('jenis');
const elTabel = document.getElementById('tabel-transaksi');
const elTotalMasuk = document.getElementById('total-masuk');
const elTotalKeluar = document.getElementById('total-keluar');
const elSaldo = document.getElementById('saldo');
const elStatus = document.getElementById('conn-status');

let backendAvailable = false;

function formatRupiah(angka) {
  return 'Rp ' + Number(angka || 0).toLocaleString('id-ID');
}

// --- Deteksi otomatis jenis & jumlah dari teks ---
document.getElementById('btn-parse').addEventListener('click', () => {
  const teks = elCatatan.value.toLowerCase();

  // Cari angka di dalam teks (mendukung format 50000, 50.000, 50rb, 15k)
  let match = teks.match(/(\d+(?:[.,]\d+)?)\s*(rb|ribu|k)?/);
  let jumlah = 0;
  if (match) {
    jumlah = parseFloat(match[1].replace(',', '.').replace(/\./g, ''));
    if (match[2]) jumlah *= 1000;
  }

  const kataMasuk = ['jual', 'terima', 'dapat', 'pemasukan', 'untung', 'bayar dari'];
  const kataKeluar = ['beli', 'bayar', 'keluar', 'belanja', 'pengeluaran', 'sewa'];

  let jenis = 'masuk';
  if (kataKeluar.some(k => teks.includes(k))) jenis = 'keluar';
  if (kataMasuk.some(k => teks.includes(k))) jenis = 'masuk';

  if (jumlah > 0) elJumlah.value = jumlah;
  elJenis.value = jenis;
});

// --- Simpan transaksi ---
document.getElementById('btn-simpan').addEventListener('click', async () => {
  const catatan = elCatatan.value.trim();
  const jumlah = parseFloat(elJumlah.value);
  const jenis = elJenis.value;

  if (!catatan || !jumlah) {
    alert('Isi catatan dan jumlah terlebih dahulu.');
    return;
  }

  const transaksi = {
    catatan,
    jumlah,
    jenis,
    tanggal: new Date().toISOString()
  };

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

  elCatatan.value = '';
  elJumlah.value = '';
  muatTransaksi();
});

function simpanLokal(transaksi) {
  const data = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  data.unshift({ id: Date.now(), ...transaksi });
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

// --- Muat & render transaksi ---
async function muatTransaksi() {
  let data = [];

  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/transaksi`);
      if (!res.ok) throw new Error('Gagal memuat');
      data = await res.json();
    } catch (err) {
      console.error(err);
      data = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    }
  } else {
    data = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  }

  renderTabel(data);
  renderRingkasan(data);
}

function renderTabel(data) {
  if (!data.length) {
    elTabel.innerHTML = '<tr><td colspan="3" style="color:var(--ink-soft);">Belum ada transaksi.</td></tr>';
    return;
  }

  elTabel.innerHTML = data.map(t => {
    const tanggal = new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    const tanda = t.jenis === 'masuk' ? '+' : '-';
    const kelas = t.jenis === 'masuk' ? 'amount-in' : 'amount-out';
    return `<tr>
      <td>${tanggal}</td>
      <td>${escapeHtml(t.catatan)}</td>
      <td class="${kelas}" style="text-align:right;">${tanda} ${formatRupiah(t.jumlah)}</td>
    </tr>`;
  }).join('');
}

function renderRingkasan(data) {
  const masuk = data.filter(t => t.jenis === 'masuk').reduce((a, b) => a + Number(b.jumlah), 0);
  const keluar = data.filter(t => t.jenis === 'keluar').reduce((a, b) => a + Number(b.jumlah), 0);
  elTotalMasuk.textContent = formatRupiah(masuk);
  elTotalKeluar.textContent = formatRupiah(keluar);
  elSaldo.textContent = formatRupiah(masuk - keluar);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Cek koneksi backend saat halaman dibuka ---
async function cekBackend() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      backendAvailable = true;
      elStatus.textContent = 'Tersambung ke database PostgreSQL ✓';
    } else {
      throw new Error();
    }
  } catch {
    backendAvailable = false;
    elStatus.textContent = 'Mode lokal (database belum aktif) — data tersimpan di browser ini saja';
  }
  muatTransaksi();
}

cekBackend();
