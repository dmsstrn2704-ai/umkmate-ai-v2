// ============================================
// UMKMate AI — Chatbot (Modul 03)
// ============================================

const API_BASE = 'http://localhost:3000/api';

const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const btnKirim = document.getElementById('btn-kirim');
const elStatus = document.getElementById('conn-status');

let backendAvailable = false;

function tambahBubble(teks, jenis) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${jenis}`;
  bubble.textContent = teks;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Balasan rule-based offline (cadangan jika backend belum aktif)
function balasanOffline(pesan) {
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

async function kirimPesan() {
  const pesan = chatInput.value.trim();
  if (!pesan) return;

  tambahBubble(pesan, 'user');
  chatInput.value = '';

  let balasan;
  if (backendAvailable) {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pesan })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      balasan = data.balasan;
    } catch {
      balasan = balasanOffline(pesan);
    }
  } else {
    balasan = balasanOffline(pesan);
  }

  setTimeout(() => tambahBubble(balasan, 'bot'), 350);
}

btnKirim.addEventListener('click', kirimPesan);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') kirimPesan();
});

// Cek koneksi backend
(async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      backendAvailable = true;
      elStatus.textContent = 'Tersambung ke backend ✓ (riwayat chat tersimpan)';
    } else {
      throw new Error();
    }
  } catch {
    backendAvailable = false;
    elStatus.textContent = 'Mode lokal — backend belum aktif, riwayat tidak disimpan';
  }
})();
