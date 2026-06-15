// ============================================
// UMKMate AI — Caption AI (Modul 01)
// ============================================

// Ganti dengan link "Share" dari aplikasi PartyRock kamu, contoh:
// const PARTYROCK_URL = "https://partyrock.aws/u/namamu/xxxx/Nama-App";
const PARTYROCK_URL = "";

const fotoInput = document.getElementById('foto');
const preview = document.getElementById('preview');
const btnGenerate = document.getElementById('btn-generate');
const btnClear = document.getElementById('btn-clear');
const btnCopy = document.getElementById('btn-copy');
const outputText = document.getElementById('output-text');

// Pratinjau foto produk
fotoInput.addEventListener('change', () => {
  const file = fotoInput.files[0];
  if (!file) {
    preview.style.display = 'none';
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// Template caption per gaya bahasa (mode demo lokal — pengganti panggilan AI)
const templates = {
  santai: ({ nama, harga, keunggulan, platform }) => `✨ ${nama} ✨

Lagi nyari cemilan/produk yang ${keunggulan || 'enak dan bikin nagih'}? Yuk cobain ${nama}!

💰 Harga cuma ${harga || 'terjangkau banget'}
📦 Siap kirim / ready stock setiap hari

Buruan order sebelum kehabisan ya, gengs! Cocok banget buat dibagikan di ${platform}. 😍

#UMKM #${nama.replace(/\s+/g, '')} #ProdukLokal`,

  profesional: ({ nama, harga, keunggulan, platform }) => `${nama}

Kami menghadirkan ${nama} dengan kualitas terjamin. ${keunggulan ? 'Keunggulan produk kami: ' + keunggulan + '.' : ''}

Harga: ${harga || 'Hubungi kami untuk informasi harga'}
Tersedia untuk pemesanan melalui ${platform}.

Pesan sekarang dan rasakan kualitas terbaik dari produk lokal kami.

#ProdukBerkualitas #UMKMIndonesia`,

  lucu: ({ nama, harga, keunggulan, platform }) => `WARNING ⚠️ ${nama} bisa bikin nagih, jangan salahkan kami kalau dompet jadi tipis 😂

${keunggulan ? 'Soal ' + keunggulan + ', ini sih juaranya.' : 'Pokoknya enak, titik.'}

Harga ${harga || 'ramah kantong'} — worth it banget dibandingin gabut sambil mikir mau makan apa.

Cus order di ${platform} sekarang, sebelum tetangga duluan beli! 🏃‍♂️💨

#JajananViral #${nama.replace(/\s+/g, '')}`,

  emosional: ({ nama, harga, keunggulan, platform }) => `Setiap ${nama} yang kami buat, dibuat dengan cerita dan ketekunan — bukan sekadar produk.

${keunggulan ? keunggulan + ', lahir dari proses yang kami jaga kualitasnya setiap hari.' : 'Dibuat dengan bahan terbaik dan sepenuh hati.'}

Dengan harga ${harga || 'yang bersahabat'}, kamu tidak hanya membeli produk — kamu turut mendukung usaha kecil untuk terus bertumbuh.

Pesan lewat ${platform}, dan jadilah bagian dari perjalanan kami. 🙏

#DukungUMKM #ProdukDenganCerita`
};

btnGenerate.addEventListener('click', () => {
  const nama = document.getElementById('nama').value.trim() || 'Produk Kamu';
  const harga = document.getElementById('harga').value.trim();
  const keunggulan = document.getElementById('keunggulan').value.trim();
  const platform = document.getElementById('platform').value;
  const tone = document.getElementById('tone').value;

  if (!document.getElementById('nama').value.trim()) {
    outputText.textContent = 'Isi minimal "Nama Produk" terlebih dahulu, ya.';
    btnCopy.style.display = 'none';
    return;
  }

  const generator = templates[tone] || templates.santai;
  const hasil = generator({ nama, harga, keunggulan, platform });

  outputText.textContent = hasil;
  btnCopy.style.display = 'inline-block';
});

btnClear.addEventListener('click', () => {
  document.getElementById('nama').value = '';
  document.getElementById('harga').value = '';
  document.getElementById('keunggulan').value = '';
  preview.style.display = 'none';
  fotoInput.value = '';
  outputText.textContent = 'Hasil caption akan muncul di sini setelah kamu mengisi detail produk dan menekan tombol "Buatkan Caption".';
  btnCopy.style.display = 'none';
});

btnCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(outputText.textContent).then(() => {
    btnCopy.textContent = 'Tersalin ✓';
    setTimeout(() => (btnCopy.textContent = 'Salin Teks'), 1500);
  });
});

// Tampilkan embed PartyRock jika URL sudah diisi
if (PARTYROCK_URL) {
  const container = document.getElementById('partyrock-embed');
  const iframe = document.createElement('iframe');
  iframe.src = PARTYROCK_URL;
  iframe.style.width = '100%';
  iframe.style.height = '500px';
  iframe.style.border = '1px solid var(--ink)';
  iframe.style.borderRadius = '6px';
  iframe.style.marginTop = '12px';
  container.appendChild(iframe);
}
