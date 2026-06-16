// ============================================
// UMKMate AI — Caption AI (Modul 01)
// Smart local generator — no API required
// ============================================

// ─── DOM refs ────────────────────────────────────────────────────────────────

const fotoInput      = document.getElementById('foto');
const preview        = document.getElementById('preview');
const btnGenerate    = document.getElementById('btn-generate');
const btnClear       = document.getElementById('btn-clear');
const placeholder    = document.getElementById('output-placeholder');
const outputPlatforms= document.getElementById('output-platforms');
const detectedBadge  = document.getElementById('detected-type');

// ─── Photo preview ───────────────────────────────────────────────────────────

fotoInput?.addEventListener('change', () => {
  const file = fotoInput.files[0];
  if (!file) { preview.style.display = 'none'; return; }
  const reader = new FileReader();
  reader.onload = e => { preview.src = e.target.result; preview.style.display = 'block'; };
  reader.readAsDataURL(file);
});

// ─── Product-type detection ──────────────────────────────────────────────────
// Returns { key, label, emojis[], hashtags[] }

const PRODUCT_TYPES = [
  {
    key: 'makanan',
    label: 'Makanan & Minuman',
    keywords: ['keripik','tempe','bakso','kue','roti','sambal','rendang','mie','nasi','ayam',
                'ikan','minuman','jus','kopi','teh','es','snack','cemilan','olahan','frozen',
                'cookies','brownies','catering','praline','coklat','permen','dodol','jenang'],
    emojis: ['🍽️','😋','🤤','🔥','✨'],
    hashtags: ['#MakananLokal','#CemilanEnak','#KulinerIndonesia','#HomeMade',
               '#MakananUMKM','#FoodLokal','#JajananNusantara']
  },
  {
    key: 'fashion',
    label: 'Fashion & Pakaian',
    keywords: ['baju','kaos','kemeja','batik','dress','rok','celana','jaket','hoodie',
                'daster','gamis','hijab','kerudung','topi','tas','sepatu','sandal','gelang',
                'kalung','cincin','aksesori','perhiasan','bordir','tenun','lurik'],
    emojis: ['👗','✨','💅','🌟','👜'],
    hashtags: ['#FashionLokal','#OOTDIndonesia','#BusanaMuslim','#HandmadeFashion',
               '#ProdukLokal','#StyleIndonesia','#FashionUMKM']
  },
  {
    key: 'kerajinan',
    label: 'Kerajinan Tangan',
    keywords: ['kerajinan','anyaman','ukiran','gerabah','batik','tenun','sulam','rajut',
                'kayu','rotan','bambu','perak','tembaga','macrame','lilin','sabun','handmade',
                'souvenir','hampers','gift','hadiah','dekorasi','hiasan','lukisan','pahatan'],
    emojis: ['🎨','✂️','🪡','🖌️','💎'],
    hashtags: ['#HandmadeIndonesia','#KrajinanLokal','#ArtisanIndonesia','#Souvenir',
               '#HadiahuNik','#DekorasiRumah','#UMKM']
  },
  {
    key: 'kecantikan',
    label: 'Kecantikan & Perawatan',
    keywords: ['skincare','serum','toner','moisturizer','sabun','shampoo','masker','lulur',
                'lotion','parfum','lip','lipstik','makeup','foundation','bedak','krim',
                'perawatan','kecantikan','organik','herbal','aloe','argan','vitamin'],
    emojis: ['💄','✨','🌿','💆','🌸'],
    hashtags: ['#SkincareLokal','#BeautyIndonesia','#KecantikanAlami','#OrganicSkincare',
               '#GlowUp','#NaturalBeauty','#BeautyUMKM']
  },
  {
    key: 'elektronik',
    label: 'Elektronik & Gadget',
    keywords: ['hp','handphone','charger','kabel','earphone','speaker','powerbank','casing',
                'laptop','tablet','elektronik','gadget','aksesoris','wireless','bluetooth',
                'smartwatch','keyboard','mouse','tripod','ring light','lampu led'],
    emojis: ['📱','⚡','🔌','💻','🎧'],
    hashtags: ['#GadgetIndonesia','#AksesorisHP','#TechLokal','#ElektronikMurah',
               '#GadgetMurah','#TechAccessories','#DigitalLifestyle']
  },
  {
    key: 'jasa',
    label: 'Jasa & Layanan',
    keywords: ['jasa','service','laundry','cuci','fotografi','foto','desain','design',
                'print','cetak','jahit','les','kursus','cleaning','servis','reparasi',
                'konsultasi','freelance','digital','marketing','konten'],
    emojis: ['🛠️','⭐','💼','🤝','✅'],
    hashtags: ['#JasaLokal','#ServiceProfessional','#UMKM','#JasaMurah',
               '#ProLokal','#FreelanceIndonesia','#JasaTerpercaya']
  },
  {
    key: 'pertanian',
    label: 'Pertanian & Perkebunan',
    keywords: ['sayur','sayuran','buah','beras','organik','hidroponik','tanaman','herbal',
                'rempah','jahe','kunyit','kencur','temulawak','kopi','teh','coklat kakao',
                'kelapa','madu','propolis','telur','daging','ikan segar'],
    emojis: ['🌿','🌱','🥬','🍃','🌾'],
    hashtags: ['#ProdukOrganik','#PertanianLokal','#SayurSegar','#FarmFresh',
               '#OrganikIndonesia','#HerbalAlami','#PetiOrganic']
  }
];

function detectProductType(nama, keunggulan) {
  const teks = (nama + ' ' + keunggulan).toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const type of PRODUCT_TYPES) {
    const score = type.keywords.filter(k => teks.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = type; }
  }

  // Fallback ke makanan jika tidak terdeteksi (paling umum untuk UMKM)
  return best || PRODUCT_TYPES[0];
}

// ─── Hashtag builder ─────────────────────────────────────────────────────────

function buildHashtags(prodType, nama, tone) {
  const baseHashtags = [...prodType.hashtags];

  // Tambah hashtag dari nama produk
  const namaSlug = nama.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
  if (namaSlug.length > 2) baseHashtags.unshift(`#${namaSlug}`);

  // Tambah hashtag tone-specific
  const toneHashtags = {
    santai:      ['#GasOrder','#BuruhCoba','#RecommendedBanget'],
    profesional: ['#QualityFirst','#TerpercayaSejak','#PremiumLokal'],
    lucu:        ['#NoKapNoKip','#RealTalk','#Hahaha'],
    emosional:   ['#DukungUMKM','#BangkitBersama','#ProdukDenganCerita']
  };
  baseHashtags.push(...(toneHashtags[tone] || []));
  baseHashtags.push('#UMKMIndonesia', '#ProdukLokal', '#BuatanIndonesia');

  return [...new Set(baseHashtags)].join(' ');
}

// ─── Product-context helpers ──────────────────────────────────────────────────
// Returns rich narrative fragments tuned per product category & tone

function getProductContext(prodType, nama, keunggulan, tone) {
  const K = keunggulan || '';

  // Story seeds per product category — used by all tone generators
  const stories = {
    makanan: {
      tradition : `Resep ini dijaga turun-temurun, dibuat dari bahan-bahan pilihan yang dipilih langsung dari sumber terbaik.`,
      process   : `Setiap batch dibuat dalam jumlah terbatas untuk memastikan kesegaran dan cita rasa yang konsisten.`,
      value     : `Bukan sekadar cemilan — ini warisan rasa yang membawa kenangan rumah dalam setiap gigitan.`,
      en_hook   : `A taste of Indonesia's culinary heritage — crafted with time-honoured recipes and the finest local ingredients.`
    },
    fashion: {
      tradition : `Setiap motif menyimpan makna — warisan budaya Indonesia yang dirajut dalam setiap helai benang dengan ketelitian tangan terampil.`,
      process   : `Dibuat melalui proses pengerjaan yang teliti, menggabungkan teknik tradisional dengan desain kontemporer yang relevan.`,
      value     : `Bukan sekadar pakaian — ini pernyataan identitas, kebanggaan pada karya anak bangsa.`,
      en_hook   : `Wear the soul of Indonesia — where ancient artistry meets modern elegance in every thread.`
    },
    kerajinan: {
      tradition : `Setiap karya lahir dari tangan terampil pengrajin yang telah mengabdikan hidupnya pada seni ini selama puluhan tahun.`,
      process   : `Dibuat satu per satu, tanpa produksi massal — setiap detail dikerjakan dengan penuh kesadaran dan rasa cinta.`,
      value     : `Lebih dari sekadar benda — ini adalah karya seni yang membawa jiwa pembuatnya ke dalam setiap rumah yang menyambut.`,
      en_hook   : `Handcrafted with devotion — each piece tells the story of Indonesian artisans preserving centuries of tradition.`
    },
    kecantikan: {
      tradition : `Diracik dari bahan-bahan alam pilihan yang telah digunakan turun-temurun dalam ritual kecantikan perempuan Indonesia.`,
      process   : `Formulasi kami menggunakan ekstrak tumbuhan lokal yang diproses dengan teknologi modern, tanpa mengorbankan kemurnian alaminya.`,
      value     : `Perawatan diri bukan sekadar rutinitas — ini ritual menghargai diri, dengan bahan-bahan yang bumi berikan untuk kita.`,
      en_hook   : `Ancient Indonesian beauty wisdom, bottled for the modern woman — pure, natural, and deeply nourishing.`
    },
    elektronik: {
      tradition : `Dirancang untuk menjawab kebutuhan gaya hidup digital yang terus berkembang, dengan performa yang tidak mengorbankan kemudahan.`,
      process   : `Setiap unit melewati quality control ketat sebelum sampai ke tangan Anda — karena kepercayaan Anda adalah prioritas kami.`,
      value     : `Bukan sekadar gadget — ini mitra produktivitas yang dirancang untuk membuat hari-hari Anda lebih efisien dan menyenangkan.`,
      en_hook   : `Engineered for the way you live — smart, reliable, and built to last.`
    },
    jasa: {
      tradition : `Kami membangun kepercayaan satu pelanggan dalam satu waktu — setiap pekerjaan dikerjakan seolah itu adalah reputasi kami di taruhan.`,
      process   : `Proses kami transparan, komunikasi terbuka, dan hasil selalu melebihi ekspektasi — bukan janji kosong, tapi standar yang kami pegang.`,
      value     : `Bukan sekadar jasa — ini kemitraan. Masalah Anda adalah masalah kami, dan solusi terbaik adalah satu-satunya hasil yang kami terima.`,
      en_hook   : `Professional service that speaks for itself — trusted by hundreds of satisfied clients across Indonesia.`
    },
    pertanian: {
      tradition : `Dari ladang yang kami rawat dengan tangan sendiri, tanpa pestisida kimia — setiap produk adalah cerminan kasih sayang pada bumi dan pembeli.`,
      process   : `Dipanen pada waktu yang tepat, diproses dengan standar kebersihan tinggi, dan sampai ke tangan Anda dalam kondisi terbaik.`,
      value     : `Memilih produk kami berarti mendukung pertanian berkelanjutan yang menjaga keseimbangan alam untuk generasi berikutnya.`,
      en_hook   : `Farm-fresh and naturally grown — straight from our soil to your table, with love and zero compromise.`
    }
  };

  const ctx = stories[prodType.key] || stories.makanan;

  // Build a product-specific benefit sentence that converts feature → feeling
  const benefitSentence = K
    ? `${K} — setiap aspek ini bukan sekadar keunggulan teknis, melainkan pengalaman nyata yang bisa langsung kamu rasakan sendiri`
    : ctx.value;

  return { ...ctx, benefitSentence };
}

// ─── Caption generators per tone ──────────────────────────────────────────────
// Structure: JUDUL → HOOK (storytelling) → BODY (filosofi + benefit) →
//            SOCIAL PROOF → CTA → (hashtag appended separately)
// Length: IG ~200-300 words, FB ~350-500 words, WA ~120-160 words

const generators = {

  // ── SANTAI ── Local Pride, Global Vibe — casual, emoji-rich, relatable ────
  santai({ nama, harga, keunggulan, prodType }) {
    const e   = prodType.emojis;
    const H   = harga || null;
    const ctx = getProductContext(prodType, nama, keunggulan, 'santai');

    const judul_ig = `Local Pride, Global Vibe! ✈️🔥`;
    const judul_fb = `${e[0]} ${nama} — Yang Lokal Tapi Levelnya Internasional!`;
    const judul_wa = `${e[0]} Info Produk Keren: *${nama}*`;

    const ig =
`${judul_ig}

Guys, boleh jujur gak? ${e[1]}

Dulu gue juga pernah underestimate produk lokal. Terus ketemu *${nama}* — dan pandangan gue langsung berubah 360 derajat.

${ctx.tradition}

${ctx.benefitSentence}.

Dan yang bikin makin cinta? ${ctx.process}

💬 *Kata mereka yang udah nyoba:*
"Sekali coba langsung repeat order. Gak nyangka bisa sebagus ini dari brand lokal!" ⭐⭐⭐⭐⭐
— Pelanggan setia kami, Jakarta

${H ? `💰 Harga: *${H}* — worth it banget, jauh dari lebay!\n` : ''}🛒 Klik link di bio sekarang! Stok terbatas, jangan sampai kehabisan ya bestie! ${e[0]}`;

    const fb =
`${judul_fb}

${e[0]} Scroll beneran sebentar — ini bukan promo biasa.

━━━━━━━━━━━━━━━━
✨ KENAPA ${nama.toUpperCase()}?
━━━━━━━━━━━━━━━━
${ctx.tradition}

${ctx.benefitSentence}.

Bukan sekadar ${prodType.label.toLowerCase()} — ini lifestyle choice yang bikin kamu bangga jadi konsumen cerdas yang support lokal. ${e[4]}

━━━━━━━━━━━━━━━━
🌟 FILOSOFI DI BALIKNYA
━━━━━━━━━━━━━━━━
${ctx.process}

${ctx.value}

Gue personally percaya, kalau kamu coba sekali — kamu gak akan mau balik ke yang lain. Bukan lebay, ini based on experience ribuan pelanggan kami. 😄

━━━━━━━━━━━━━━━━
💬 SOCIAL PROOF
━━━━━━━━━━━━━━━━
"Awalnya ragu, sekarang jadi langganan tetap. Kualitasnya konsisten banget!"
— Pelanggan kami, Bandung ⭐⭐⭐⭐⭐

"Udah rekomendasiin ke semua temen. Mereka semua bilang makasih!" 😂
— Pelanggan kami, Surabaya

━━━━━━━━━━━━━━━━
🛒 GAS ORDER SEKARANG!
━━━━━━━━━━━━━━━━
${H ? `💰 Harga: *${H}*\n` : ''}⚡ Stok terbatas — kemarin hampir habis!
📦 Pengiriman ke seluruh Indonesia

Klik tombol hubungi atau DM langsung ya! Respon super cepat kok! ${e[0]}

Tag temen yang wajib tau soal ini 👇`;

    const wa =
`${judul_wa}

Halo kak! ${e[0]} Mau kasih tau produk yang lagi hits banget nih:

📖 *Ceritanya:*
${ctx.tradition}

✨ *Yang bikin beda:*
${ctx.benefitSentence}.

⭐ *Sudah dipercaya* ribuan pelanggan Indonesia
${H ? `💰 *Harga:* ${H}` : ''}
📦 Ready stock, kirim hari ini!

Gaskeun order kak — balas chat ini aja, respon cepat! 🤙`;

    return { instagram: ig.trim(), facebook: fb.trim(), whatsapp: wa.trim() };
  },

  // ── PROFESIONAL ── The Art of Mastery — formal, value-driven, premium ──────
  profesional({ nama, harga, keunggulan, prodType }) {
    const e   = prodType.emojis;
    const H   = harga || null;
    const ctx = getProductContext(prodType, nama, keunggulan, 'profesional');

    const ig =
`The Art of Excellence: ${nama} ${e[4]}✨

Dalam dunia yang penuh dengan pilihan biasa, *${nama}* hadir sebagai standar yang berbeda.

${ctx.tradition}

▸ KEUNGGULAN YANG TERASA
${ctx.benefitSentence}.

▸ PROSES YANG TIDAK BERKOMPROMI
${ctx.process}

${ctx.value}

▸ DIPERCAYA PARA PROFESIONAL
Lebih dari ribuan pelanggan di seluruh Indonesia telah menjadikan ${nama} sebagai pilihan utama mereka — bukan karena diskon, tapi karena kualitas yang berbicara sendiri.

${H ? `Investasi terbaik Anda hari ini: *${H}*\n` : ''}Untuk pemesanan eksklusif dan katalog lengkap, hubungi kami melalui DM atau link di bio. ${e[4]}`;

    const fb =
`${e[4]} ${nama} — Standar Baru dalam Dunia ${prodType.label}

Kami percaya bahwa setiap pelanggan berhak mendapatkan yang terbaik — bukan sekadar yang tersedia.

━━━━━━━━━━━━━━━━
🎯 FILOSOFI KAMI
━━━━━━━━━━━━━━━━
${ctx.tradition}

Ini bukan sekadar produk. Ini adalah manifestasi dari komitmen kami: bahwa kualitas sejati tidak perlu berteriak — ia cukup berbisik, dan orang-orang yang tepat akan mendengar.

━━━━━━━━━━━━━━━━
✨ KEUNGGULAN TERUKUR
━━━━━━━━━━━━━━━━
${ctx.benefitSentence}.

${ctx.process}

Setiap detail ${nama} kami rancang bukan untuk memenuhi standar minimum — melainkan untuk melampaui ekspektasi tertinggi Anda.

━━━━━━━━━━━━━━━━
🌟 DIPERCAYA, BUKAN SEKADAR POPULER
━━━━━━━━━━━━━━━━
"Kami mencari ${prodType.label.toLowerCase()} yang benar-benar sesuai standar profesional. ${nama} menjawab semua kriteria itu."
— Klien korporat kami, Jakarta

"Kualitas konsisten dari awal hingga pengiriman terakhir. Inilah yang kami sebut mitra terpercaya."
— Pelanggan loyal, 2+ tahun bersama kami

━━━━━━━━━━━━━━━━
📋 INFORMASI PEMESANAN
━━━━━━━━━━━━━━━━
${H ? `Harga: *${H}*\n` : ''}Ketersediaan terbatas untuk menjaga standar kualitas yang kami pertahankan.

Hubungi kami untuk konsultasi personal, katalog produk, dan penawaran khusus untuk pembelian dalam jumlah besar. Tim kami siap merespons dalam waktu kurang dari 1 jam. ${e[4]}`;

    const wa =
`Selamat pagi/siang, Kak 🙏

Kami ingin memperkenalkan *${nama}* — solusi ${prodType.label.toLowerCase()} dengan standar premium.

📖 *Filosofi produk kami:*
${ctx.tradition}

✅ *Keunggulan terukur:*
${ctx.benefitSentence}.

🌟 *Kepercayaan:* Dipilih oleh ribuan pelanggan profesional di seluruh Indonesia.
${H ? `\n💼 *Investasi:* ${H}` : ''}

Kami menyediakan konsultasi personal dan katalog lengkap untuk Anda. Silakan balas pesan ini — tim kami siap membantu. 🙏`;

    return { instagram: ig.trim(), facebook: fb.trim(), whatsapp: wa.trim() };
  },

  // ── LUCU ── Plot Twist Alert — humor, wordplay, relatable story arc ─────────
  lucu({ nama, harga, keunggulan, prodType }) {
    const e   = prodType.emojis;
    const H   = harga || null;
    const ctx = getProductContext(prodType, nama, keunggulan, 'lucu');

    const ig =
`Plot Twist: ${prodType.label} Lokal Ini Bikin Kalap 😭${e[0]}

Jujur ya, awalnya gue juga mikir "ah paling sama aja."

TAPI TERNYATA—

${ctx.tradition.replace(/\.$/, '')}... dan somehow ini yang bikin ${nama} beda dari yang pernah gue coba seumur hidup. 😳

${ctx.benefitSentence}.

Dan entah kenapa ${ctx.process.replace(/^[A-Z]/, c => c.toLowerCase())}

Hasilnya? ${ctx.value.replace(/^[A-Z]/, c => c.toLowerCase())}

💬 *Plot twist terbesar:*
"Beli pertama buat iseng. Sekarang udah repeat order ke-7. Tolong." 😂
— Pelanggan kami yang udah nyerah lawan diri sendiri

${H ? `💸 Harga: *${H}* — masih lebih murah dari biaya nyesel gak beli\n` : ''}👉 Link di bio. Klik sekarang, sebelum kamu nyesel sambil liatin orang lain posting foto ${nama} duluan. ${e[2]}`;

    const fb =
`${e[0]} THREAD: Kenapa Gue Akhirnya Nyerah dan Beli ${nama}

Okay jadi ceritanya panjang, tapi dengerin dulu.

Gue udah lama resist. "Ah produk lokal paling standar aja." Gue salah. Banget.

━━━━━━━━━━━━━━━━
ACT 1: SKEPTIS
━━━━━━━━━━━━━━━━
Temen gue udah recommend berkali-kali. Gue selalu bilang "nanti deh, nanti deh."

Nanti deh itu ternyata butuh berbulan-bulan. 🤦

━━━━━━━━━━━━━━━━
ACT 2: AKHIRNYA NYOBA
━━━━━━━━━━━━━━━━
${ctx.tradition}

${ctx.benefitSentence}.

Waktu pertama kali nyoba, reaksi gue literally: "...oh."

Bukan "oh biasa aja." Tapi "oh, INI yang dimaksud temen gue selama ini." ${e[1]}

━━━━━━━━━━━━━━━━
ACT 3: PLOT TWIST
━━━━━━━━━━━━━━━━
${ctx.process}

${ctx.value}

Dan sekarang gue jadi orang yang nge-recommend ke semua orang. Lingkaran sudah sempurna. 🔄

━━━━━━━━━━━━━━━━
EPILOG (AKA: KATA MEREKA)
━━━━━━━━━━━━━━━━
"Kalau tau begini dari dulu, udah dari lama beli." — hampir semua pelanggan baru kami 😂

"Inisial order 1, sekarang order ke-5. Tolong bantu gue." — pelanggan loyal kami ${e[2]}

━━━━━━━━━━━━━━━━
THE END (tapi order-nya jangan diakhirin)
━━━━━━━━━━━━━━━━
${H ? `Harga: *${H}* (lebih murah dari penyesalan, trust me)\n` : ''}DM atau klik hubungi sekarang. Respon cepet, gak kayak nunggu antrian di kafe hits. ${e[0]}

Siapa yang relate sama cerita gue? Drop komen! 👇`;

    const wa =
`Halo kak! ${e[0]} Izin ganggu bentar — ini penting, serius (tapi santai) 😄

Jadi ada yang namanya *${nama}* dan gue harus cerita:

📖 ${ctx.tradition}

🎯 Yang bikin beda: ${ctx.benefitSentence}.

😂 *Fun fact:* Pelanggan kami rata-rata bilang "sekali dulu" tapi ujungnya order ke-3, 4, 5...

${H ? `💸 *Harga:* ${H} — worth it bet!\n` : ''}⚡ Stok terbatas (ini serius, bukan drama)

Order kak? Balas chat ini aja! Gak pake lama, gak kayak delivery yang bilang "segera" tapi 3 hari 😂🙏`;

    return { instagram: ig.trim(), facebook: fb.trim(), whatsapp: wa.trim() };
  },

  // ── EMOSIONAL ── Wear the Philosophy — storytelling, impact, heartfelt CTA ──
  emosional({ nama, harga, keunggulan, prodType }) {
    const e   = prodType.emojis;
    const H   = harga || null;
    const ctx = getProductContext(prodType, nama, keunggulan, 'emosional');

    const ig =
`Wear the Philosophy 🛖✨

Ada produk yang lahir dari kebutuhan.
Ada produk yang lahir dari passion.
*${nama}* lahir dari keduanya — dan dari sesuatu yang lebih dalam lagi.

${ctx.tradition}

${ctx.benefitSentence}.

Tapi yang membuat ${nama} benar-benar istimewa adalah ini: ${ctx.value}

Ribuan pelanggan yang kini menjadi bagian dari keluarga kami tidak datang karena promosi. Mereka datang karena mereka merasakan — ada sesuatu yang berbeda di sini. Sesuatu yang dibuat dengan sungguh-sungguh.

${H ? `Dengan *${H}*, kamu tidak hanya membeli ${prodType.label.toLowerCase()} — kamu turut menghidupi cerita ini.\n` : ''}Dukung UMKM Indonesia 🌍
Hubungi kami via DM untuk pemesanan. Terima kasih sudah percaya. 🙏`;

    const fb =
`🛖 ${nama} — Lebih dari Sekadar ${prodType.label}

Kami ingin bercerita sebentar. Bukan tentang produk. Tapi tentang mengapa kami ada.

━━━━━━━━━━━━━━━━
🌱 DI MANA SEMUANYA DIMULAI
━━━━━━━━━━━━━━━━
${ctx.tradition}

Bukan karena ada permintaan pasar yang mendesak. Bukan karena ada tren yang perlu dikejar. Tapi karena ada nilai yang perlu dijaga — dan ${nama} adalah cara kami menjaganya.

━━━━━━━━━━━━━━━━
💎 APA YANG KAMI TUANGKAN
━━━━━━━━━━━━━━━━
${ctx.benefitSentence}.

${ctx.process}

${ctx.value}

Setiap ${nama} yang sampai ke tanganmu membawa semua ini bersamanya.

━━━━━━━━━━━━━━━━
💬 SUARA MEREKA YANG TELAH MERASAKAN
━━━━━━━━━━━━━━━━
"Saya tidak menyangka sebuah ${prodType.label.toLowerCase()} bisa membuat saya merasa terhubung dengan sesuatu yang lebih besar."
— Pelanggan kami, Yogyakarta

"Terima kasih sudah terus menjaga kualitas ini. Kami selalu kembali, bukan karena kebiasaan — tapi karena memang tidak ada yang sebanding."
— Pelanggan setia, 3 tahun bersama kami

━━━━━━━━━━━━━━━━
🌍 BERGABUNGLAH DALAM PERJALANAN INI
━━━━━━━━━━━━━━━━
${H ? `${H} — harga yang kami jaga agar cerita ini bisa menjangkau lebih banyak orang.\n` : ''}Dengan memilih ${nama}, kamu tidak sekadar membeli. Kamu memilih untuk menjadi bagian dari gerakan: mendukung ${prodType.label.toLowerCase()} lokal yang dibuat dengan hati, oleh tangan-tangan Indonesia.

Hubungi kami untuk pemesanan. Setiap pesan yang masuk kami sambut dengan sepenuh hati. 🙏

Bagikan kepada mereka yang percaya bahwa pilihan kecil bisa membuat perbedaan besar. 💛`;

    const wa =
`Halo kak 🙏

Izin berbagi sesuatu yang lebih dari sekadar info produk:

*${nama}* adalah ${ctx.value.replace(/^[A-Z]/, c => c.toLowerCase())}

📖 *Cerita di baliknya:*
${ctx.tradition}

💎 *Yang kamu dapatkan:*
${ctx.benefitSentence}.

💛 Ribuan pelanggan sudah menjadi bagian dari perjalanan ini — dan banyak yang berkata, "kenapa gak dari dulu?"
${H ? `\n🌱 *Harga:* ${H} — untuk mendukung ${prodType.label.toLowerCase()} lokal yang bermakna.` : ''}

Kalau kamu percaya pada hal-hal yang dibuat dengan sungguh-sungguh — kami ada untuk kamu, kak.

Balas pesan ini kapan pun. Dengan senang hati kami melayani. 🤎`;

    return { instagram: ig.trim(), facebook: fb.trim(), whatsapp: wa.trim() };
  }
};

// ─── Translation — full caption per language, tone-aware ─────────────────────
// Generates a complete Instagram-length caption (not just a one-liner intro)

function translateCaption(igCaption, nama, harga, keunggulan, langCode, tone, prodType) {
  const K = keunggulan || 'premium quality';
  const H = harga || '';
  const cat = prodType ? prodType.label : 'product';

  // Pull the product-context English hook for richer translation base
  const ctx = prodType ? getProductContext(prodType, nama, keunggulan, tone) : null;
  const enHook = ctx ? ctx.en_hook : `Discover ${nama} — crafted with passion from Indonesia.`;

  const toneMap = {
    santai:      { en: 'casual and fun',       zh: '轻松有趣',   ar: 'مرح وودود',  ja: 'カジュアルで楽しい' },
    profesional: { en: 'professional',         zh: '专业',      ar: 'احترافي',    ja: 'プロフェッショナル' },
    lucu:        { en: 'humorous and relatable',zh: '幽默风趣',   ar: 'فكاهي',      ja: 'ユーモラス' },
    emosional:   { en: 'heartfelt storytelling',zh: '感人叙事',   ar: 'مؤثر',       ja: '心に響くストーリー' }
  };
  const tm = toneMap[tone] || toneMap.santai;

  const captions = {
    en:
`✨ ${nama} — Indonesian Excellence, Delivered 🌍

${enHook}

${K ? `What makes it special: ${K} — crafted with care and precision that you can feel in every use.` : 'Crafted with uncompromising care and precision — quality you can feel from the first moment.'}

Trusted by thousands of customers across Indonesia. Not because of big marketing budgets — but because the product speaks for itself.

${H ? `💰 Price: ${H}\n` : ''}🛒 Order now via DM or click the link in bio!
Supporting Indonesian UMKM, one purchase at a time. 🇮🇩

#IndonesianMade #LocalPride #UMKMIndonesia #MadeInIndonesia`,

    zh:
`✨ ${nama} — 印尼精品，品质之选 🌍

${enHook.replace(/\bIndonesia[n]?\b/g, '印度尼西亚').replace(/\bcraft\b/gi, '制作').replace(/\bpassion\b/gi, '热情')}

${K ? `产品亮点：${K}。每一个细节都经过精心打磨，让您在每次使用中都能感受到与众不同。` : '每一个细节都经过精心打磨——您第一次体验便能感受到的品质。'}

已受到印度尼西亚数千名顾客的信赖与喜爱。口碑来自真实体验，而非营销噱头。

${H ? `💰 价格：${H}\n` : ''}📩 私信订购或点击主页链接！
支持印尼本地品牌 🇮🇩

#印尼制造 #本地品牌 #优质产品 #UMKM`,

    ar:
`✨ ${nama} — جودة إندونيسية أصيلة 🌍

${enHook}

${K ? `ما يميزه: ${K} — صُنع بعناية فائقة وإتقان تشعر به في كل استخدام.` : 'صُنع بعناية فائقة لا تقبل المساومة — جودة تشعر بها من اللحظة الأولى.'}

موثوق به من قِبل آلاف العملاء في جميع أنحاء إندونيسيا — لأن المنتج يتحدث عن نفسه.

${H ? `💰 السعر: ${H}\n` : ''}📩 اطلب الآن عبر الرسائل المباشرة أو الرابط في البيو!
ادعم المنتجات المحلية الإندونيسية 🇮🇩

#صنع_في_إندونيسيا #منتجات_محلية #جودة_عالية`,

    ja:
`✨ ${nama} — インドネシアの誇り、世界へ 🌍

${enHook}

${K ? `特長：${K}。細部にまでこだわった丁寧な作りを、ご使用のたびに実感していただけます。` : '妥協なき品質への想い——初めての体験からその違いを感じていただけます。'}

インドネシア全土の何千ものお客様にご愛顧いただいています。大きな広告費ではなく、製品そのものが証明しています。

${H ? `💰 価格：${H}\n` : ''}📩 DMまたはプロフィールのリンクからご注文ください！
インドネシアの中小企業を応援しています 🇮🇩

#インドネシア製 #ローカルブランド #高品質 #UMKM`
  };

  return captions[langCode] || igCaption;
}

const langLabels = {
  en: '🇬🇧 English',
  zh: '🇨🇳 中文 (Mandarin)',
  ar: '🇸🇦 العربية (Arabic)',
  ja: '🇯🇵 日本語 (Japanese)'
};

// ─── Copy helper ─────────────────────────────────────────────────────────────

function setupCopyButtons() {
  document.querySelectorAll('.btn-copy-lang').forEach(btn => {
    // Remove old listener by cloning
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', () => {
      const target = document.getElementById(fresh.dataset.target);
      if (!target) return;
      navigator.clipboard.writeText(target.textContent).then(() => {
        fresh.textContent = 'Tersalin ✓';
        fresh.style.color = 'var(--stamp-teal)';
        setTimeout(() => { fresh.textContent = 'Salin'; fresh.style.color = ''; }, 2000);
      });
    });
  });
}

// ─── Main generate handler ────────────────────────────────────────────────────

btnGenerate?.addEventListener('click', () => {
  const nama       = document.getElementById('nama')?.value.trim();
  const harga      = document.getElementById('harga')?.value.trim();
  const keunggulan = document.getElementById('keunggulan')?.value.trim();
  const tone       = document.getElementById('tone')?.value || 'santai';
  const translation= document.querySelector('input[name="translation"]:checked')?.value || 'none';

  if (!nama) {
    placeholder.style.display = '';
    placeholder.querySelector('p').innerHTML =
      '⚠️ Isi minimal <strong>Nama Produk</strong> terlebih dahulu.';
    outputPlatforms.style.display = 'none';
    return;
  }

  // 1. Detect product type
  const prodType = detectProductType(nama, keunggulan);

  // 2. Generate captions
  const gen = generators[tone] || generators.santai;
  const result = gen({ nama, harga, keunggulan, prodType });

  // 3. Build hashtags
  const hashtags = buildHashtags(prodType, nama, tone);

  // 4. Render
  document.getElementById('text-instagram').textContent = result.instagram;
  document.getElementById('text-facebook').textContent  = result.facebook;
  document.getElementById('text-whatsapp').textContent  = result.whatsapp;
  document.getElementById('text-hashtags').textContent  = hashtags;

  // 5. Translation
  const transSection = document.getElementById('translation-section');
  if (translation !== 'none') {
    const translated = translateCaption(result.instagram, nama, harga, keunggulan, translation, tone, prodType);
    document.getElementById('text-translation').textContent = translated;
    document.getElementById('translation-lang-label').textContent =
      langLabels[translation] || '🌐 Terjemahan';
    transSection.style.display = '';
  } else {
    transSection.style.display = 'none';
  }

  // 6. Show detected badge
  detectedBadge.textContent = prodType.emojis[0] + ' ' + prodType.label;
  detectedBadge.style.display = '';

  // 7. Swap placeholder ↔ output
  placeholder.style.display = 'none';
  outputPlatforms.style.display = '';

  // 8. Wire copy buttons
  setupCopyButtons();
});

// ─── Clear ────────────────────────────────────────────────────────────────────

btnClear?.addEventListener('click', () => {
  ['nama','harga','keunggulan'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  if (preview) { preview.style.display = 'none'; }
  if (fotoInput) fotoInput.value = '';

  // Reset translation radio
  const noTranslate = document.querySelector('input[name="translation"][value="none"]');
  if (noTranslate) noTranslate.checked = true;

  placeholder.querySelector('p').innerHTML =
    'Isi detail produk di sebelah kiri lalu klik <strong>Buatkan Caption</strong>.';
  placeholder.style.display = '';
  outputPlatforms.style.display = 'none';
  detectedBadge.style.display = 'none';
});
