// ============================================
// UMKMate AI — Ekspor Multi-bahasa (Modul 05)
// High-quality product description generator
// Structure: TITLE → OPENING → DESCRIPTION →
//            FEATURES → TARGET MARKET →
//            SHIPPING & ORDER → CTA
// ============================================

// ─── Product-type detection (shared logic with caption.js) ───────────────────

const EKSPOR_PRODUCT_TYPES = [
  {
    key: 'fashion',
    label: 'Fashion & Batik',
    keywords: ['batik','tenun','lurik','baju','kaos','kemeja','dress','rok','celana','jaket',
               'hoodie','daster','gamis','hijab','kerudung','topi','tas','sepatu','sandal',
               'gelang','kalung','cincin','aksesori','perhiasan','bordir','kain','sarung'],
    emoji: '👗',
    culturalNote: {
      en: 'Each piece carries the soul of Indonesian weaving and dyeing traditions spanning centuries.',
      zh: '每件作品都承载着印度尼西亚数百年纺织与染色传统的精髓。',
      ar: 'تحمل كل قطعة روح تقاليد النسيج والصباغة الإندونيسية التي تمتد لقرون.',
      ja: '各作品には、何世紀にもわたるインドネシアの織物・染色の伝統が息づいています。',
      ko: '각 작품에는 수백 년에 걸친 인도네시아 직물 및 염색 전통의 정수가 담겨 있습니다.'
    }
  },
  {
    key: 'makanan',
    label: 'Food & Beverage',
    keywords: ['keripik','tempe','bakso','kue','roti','sambal','rendang','mie','nasi','ayam',
               'ikan','minuman','jus','kopi','teh','es','snack','cemilan','olahan','frozen',
               'cookies','brownies','catering','praline','coklat','permen','dodol','jenang',
               'kacang','kerupuk','abon','dendeng','selai'],
    emoji: '🍽️',
    culturalNote: {
      en: 'Rooted in Indonesia\'s rich culinary heritage, crafted from time-honoured recipes passed down through generations.',
      zh: '植根于印度尼西亚丰富的烹饪遗产，采用世代相传的传统配方精心制作。',
      ar: 'متجذر في الإرث الطهوي الغني لإندونيسيا، مصنوع وفق وصفات تقليدية متوارثة عبر الأجيال.',
      ja: 'インドネシアの豊かな料理文化に根ざし、代々受け継がれてきた伝統的なレシピで丁寧に作られています。',
      ko: '인도네시아의 풍부한 요리 전통에 뿌리를 두고, 대대로 내려온 전통 레시피로 정성껏 만들어졌습니다.'
    }
  },
  {
    key: 'kerajinan',
    label: 'Handcraft & Art',
    keywords: ['kerajinan','anyaman','ukiran','gerabah','tenun','sulam','rajut','kayu','rotan',
               'bambu','perak','tembaga','macrame','lilin','sabun','handmade','souvenir',
               'hampers','gift','dekorasi','hiasan','lukisan','pahatan','patung','wayang',
               'topeng','puppets','batik','jumputan'],
    emoji: '🎨',
    culturalNote: {
      en: 'Handcrafted one by one by master artisans, preserving Indonesia\'s intangible cultural heritage.',
      zh: '由工匠大师一件一件手工制作，保护和传承印度尼西亚的非物质文化遗产。',
      ar: 'مصنوعة يدوياً واحدة تلو الأخرى من قبل حرفيين ماهرين، للحفاظ على التراث الثقافي غير المادي لإندونيسيا.',
      ja: '熟練した職人が一つ一つ手作りし、インドネシアの無形文化遺産を守り続けています。',
      ko: '장인 공예가들이 하나씩 손으로 만들어, 인도네시아의 무형 문화유산을 보존합니다.'
    }
  },
  {
    key: 'kecantikan',
    label: 'Beauty & Wellness',
    keywords: ['skincare','serum','toner','moisturizer','sabun','shampoo','masker','lulur',
               'lotion','parfum','lip','lipstik','makeup','foundation','bedak','krim',
               'perawatan','kecantikan','organik','herbal','aloe','argan','vitamin','spa',
               'aromaterapi','minyak','essential oil','scrub','body butter'],
    emoji: '🌿',
    culturalNote: {
      en: 'Formulated from Indonesia\'s botanical treasures — ancient beauty rituals reimagined for the modern world.',
      zh: '以印度尼西亚的植物宝藏为原料配制 — 将古老美容仪式重新诠释为现代护肤之道。',
      ar: 'مُصاغ من كنوز النباتات الإندونيسية — طقوس تجميل قديمة أُعيدت صياغتها للعالم الحديث.',
      ja: 'インドネシアの植物の宝から配合 — 古代の美容儀式を現代のために再解釈しました。',
      ko: '인도네시아의 식물 보물로 만든 포뮬라 — 고대 미용 의식을 현대적으로 재해석했습니다.'
    }
  },
  {
    key: 'pertanian',
    label: 'Agriculture & Organic',
    keywords: ['sayur','sayuran','buah','beras','organik','hidroponik','tanaman','herbal',
               'rempah','jahe','kunyit','kencur','temulawak','kopi','teh','coklat','kakao',
               'kelapa','madu','propolis','telur','daging','ikan segar','rempah-rempah',
               'vanili','kayu manis','lada','cengkeh','pala','kapulaga'],
    emoji: '🌾',
    culturalNote: {
      en: 'Grown in Indonesia\'s fertile volcanic soils — pure, natural, and sustainably farmed.',
      zh: '种植于印度尼西亚肥沃的火山土壤 — 纯净、天然、可持续农业生产。',
      ar: 'مزروعة في التربة البركانية الخصبة في إندونيسيا — نقية وطبيعية ومزروعة باستدامة.',
      ja: 'インドネシアの肥沃な火山性土壌で育てられた — 純粋で自然で持続可能な農法。',
      ko: '인도네시아의 비옥한 화산토에서 재배 — 순수하고 자연적이며 지속 가능하게 농사지은 제품.'
    }
  },
  {
    key: 'elektronik',
    label: 'Electronics & Gadget',
    keywords: ['hp','handphone','charger','kabel','earphone','speaker','powerbank','casing',
               'laptop','tablet','elektronik','gadget','aksesoris','wireless','bluetooth',
               'smartwatch','keyboard','mouse','tripod','ring light','lampu led'],
    emoji: '📱',
    culturalNote: {
      en: 'Engineered for performance, designed for the way you live — smart technology at competitive prices.',
      zh: '为性能而生，为生活方式而设计 — 具有竞争力价格的智能技术。',
      ar: 'مُصمم للأداء العالي وأسلوب الحياة — تقنية ذكية بأسعار تنافسية.',
      ja: 'パフォーマンスのために設計され、ライフスタイルに合わせてデザイン — 競争力のある価格のスマート技術。',
      ko: '성능을 위해 설계되고 생활 방식에 맞게 디자인 — 경쟁력 있는 가격의 스마트 기술.'
    }
  },
  {
    key: 'jasa',
    label: 'Services',
    keywords: ['jasa','service','laundry','cuci','fotografi','foto','desain','design',
               'print','cetak','jahit','les','kursus','cleaning','servis','reparasi',
               'konsultasi','freelance','digital','marketing','konten'],
    emoji: '💼',
    culturalNote: {
      en: 'Professional service excellence backed by Indonesian dedication, precision, and warm hospitality.',
      zh: '专业服务卓越，以印度尼西亚人的敬业精神、精准度和热情好客为后盾。',
      ar: 'تميز في الخدمة المهنية مدعوماً بالتفاني الإندونيسي والدقة والضيافة الدافئة.',
      ja: 'インドネシアの献身、精確さ、温かいホスピタリティに裏打ちされたプロフェッショナルサービスの卓越性。',
      ko: '인도네시아의 헌신, 정밀함, 따뜻한 환대로 뒷받침되는 전문 서비스 우수성.'
    }
  }
];

function detectEksporType(nama, bahan, keunggulan) {
  const teks = (nama + ' ' + bahan + ' ' + keunggulan).toLowerCase();
  let best = null, bestScore = 0;
  for (const t of EKSPOR_PRODUCT_TYPES) {
    const score = t.keywords.filter(k => teks.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = t; }
  }
  return best || EKSPOR_PRODUCT_TYPES[2]; // fallback: kerajinan
}

// ─── Target market labels per language ───────────────────────────────────────

const TARGET_LABELS = {
  umum:      { en:'General / International Market', zh:'普通/国际市场', ar:'السوق العام / الدولي', ja:'一般/国際市場', ko:'일반/국제 시장' },
  premium:   { en:'Premium & Luxury Buyers',         zh:'高端/奢侈品买家', ar:'المشترون المميزون والفاخرون', ja:'プレミアム＆ラグジュアリーバイヤー', ko:'프리미엄 및 럭셔리 구매자' },
  grosir:    { en:'Wholesale / Bulk Buyers',          zh:'批发/大批量买家', ar:'مشترو الجملة / الكميات الكبيرة', ja:'卸売/大量バイヤー', ko:'도매/대량 구매자' },
  ecommerce: { en:'Global E-commerce',                zh:'全球电商平台', ar:'التجارة الإلكترونية العالمية', ja:'グローバルEコマース', ko:'글로벌 이커머스' }
};

// ─── Shipping info per language & market ─────────────────────────────────────

function shippingInfo(lang, target) {
  const wholesale = target === 'grosir';
  const info = {
    en: wholesale
      ? `Minimum Order Quantity (MOQ): Negotiable. Bulk pricing available. Shipping via JNE International, DHL, or FedEx. Production lead time: 7–14 business days. Custom branding & OEM available upon request.`
      : `Available for worldwide shipping. Dispatch within 1–3 business days. Tracked shipping via DHL Express, EMS, or JNE International. Packaging designed to protect during transit.`,
    zh: wholesale
      ? `最小起订量（MOQ）：可协商。提供批量定价。通过 JNE International、DHL 或 FedEx 发货。生产交货期：7–14 个工作日。可根据要求提供定制品牌和 OEM 服务。`
      : `全球发货。1–3 个工作日内发出。通过 DHL Express、EMS 或 JNE International 提供追踪物流。包装经过精心设计，确保运输安全。`,
    ar: wholesale
      ? `الحد الأدنى لكمية الطلب (MOQ): قابل للتفاوض. تتوفر أسعار الجملة. الشحن عبر JNE International أو DHL أو FedEx. مدة الإنتاج: 7–14 يوم عمل. تتوفر خدمة العلامة التجارية المخصصة والـ OEM عند الطلب.`
      : `الشحن متاح لجميع أنحاء العالم. الإرسال خلال 1–3 أيام عمل. شحن مع تتبع عبر DHL Express أو EMS أو JNE International. تغليف مُصمم للحماية أثناء النقل.`,
    ja: wholesale
      ? `最小注文数量（MOQ）：要相談。大量注文の特別価格あり。JNE International・DHL・FedEx にて発送。製造リードタイム：7〜14営業日。カスタムブランディング・OEM対応可能。`
      : `世界中への配送に対応。1〜3営業日以内に発送。DHL Express・EMS・JNE Internationalによる追跡配送。輸送中の保護を考慮したパッケージング。`,
    ko: wholesale
      ? `최소 주문 수량(MOQ): 협상 가능. 대량 구매 할인 가격 제공. JNE International, DHL 또는 FedEx로 배송. 생산 납기: 7–14영업일. 커스텀 브랜딩 및 OEM 가능.`
      : `전 세계 배송 가능. 1–3영업일 이내 발송. DHL Express, EMS 또는 JNE International 추적 배송. 운송 중 보호를 위한 포장 설계.`
  };
  return info[lang] || info.en;
}

// ─── CTA per language & market ────────────────────────────────────────────────

function ctaText(lang, target, nama) {
  const ctas = {
    en: {
      umum:      `Interested in ${nama}? Contact us via DM or WhatsApp for product catalog, pricing, and international shipping details.`,
      premium:   `Explore our exclusive ${nama} collection. Contact us via DM or WhatsApp for private catalog and bespoke orders.`,
      grosir:    `Looking for wholesale ${nama}? Contact us for MOQ details, bulk pricing, and OEM options. We export worldwide.`,
      ecommerce: `Ready to list ${nama} on your platform? Contact us for dropship & wholesale programs, product data sheets, and API integration.`
    },
    zh: {
      umum:      `对 ${nama} 感兴趣？请通过私信或 WhatsApp 联系我们，获取产品目录、报价和国际运输详情。`,
      premium:   `探索我们的独家 ${nama} 系列。请通过私信或 WhatsApp 联系我们，获取私人目录和定制订单。`,
      grosir:    `寻找 ${nama} 批发货源？联系我们了解最小起订量、批发价格和 OEM 选项。我们面向全球出口。`,
      ecommerce: `准备好在您的平台上上架 ${nama}？联系我们了解代发货和批发计划、产品数据表和接口对接。`
    },
    ar: {
      umum:      `هل أنت مهتم بـ ${nama}؟ تواصل معنا عبر الرسائل المباشرة أو واتساب للحصول على كتالوج المنتجات والأسعار وتفاصيل الشحن الدولي.`,
      premium:   `استكشف مجموعة ${nama} الحصرية لدينا. تواصل معنا عبر DM أو واتساب للحصول على الكتالوج الخاص والطلبات المخصصة.`,
      grosir:    `هل تبحث عن ${nama} بالجملة؟ تواصل معنا للاستفسار عن الحد الأدنى للطلب وأسعار الجملة وخيارات OEM. نصدر إلى جميع أنحاء العالم.`,
      ecommerce: `هل أنت مستعد لإدراج ${nama} على منصتك؟ تواصل معنا لمعرفة برامج الدروبشيبينج والجملة وصحائف بيانات المنتجات.`
    },
    ja: {
      umum:      `${nama} にご興味をお持ちですか？製品カタログ、価格、国際配送の詳細はDMまたはWhatsAppにてお問い合わせください。`,
      premium:   `限定 ${nama} コレクションをご覧ください。プライベートカタログとオーダーメイドのご注文はDMまたはWhatsAppへ。`,
      grosir:    `${nama} の卸売をお探しですか？MOQ・卸値・OEMオプションについてはお気軽にお問い合わせください。世界中に輸出しています。`,
      ecommerce: `${nama} をプラットフォームに掲載しますか？ドロップシップ・卸売プログラム、製品データシートについてお問い合わせください。`
    },
    ko: {
      umum:      `${nama}에 관심 있으신가요? 제품 카탈로그, 가격, 국제 배송 세부 정보는 DM 또는 WhatsApp으로 문의하세요.`,
      premium:   `독점적인 ${nama} 컬렉션을 탐색해보세요. 프라이빗 카탈로그 및 맞춤 주문은 DM 또는 WhatsApp으로 연락 주세요.`,
      grosir:    `${nama} 도매를 찾고 계신가요? MOQ, 대량 가격 및 OEM 옵션에 대해 문의하세요. 전 세계로 수출합니다.`,
      ecommerce: `${nama}를 플랫폼에 등록할 준비가 되셨나요? 드롭십 및 도매 프로그램, 제품 데이터 시트에 대해 문의하세요.`
    }
  };
  return (ctas[lang] && ctas[lang][target]) || (ctas.en && ctas.en[target]) || '';
}

// ─── Core description generator ──────────────────────────────────────────────
// Returns a full multi-section export description string for one language

function generateLangDescription(lang, { nama, bahan, keunggulan, harga, target, prodType }) {
  const tLabel  = TARGET_LABELS[target][lang]  || TARGET_LABELS[target].en;
  const cultural = prodType.culturalNote[lang]  || prodType.culturalNote.en;
  const shipping = shippingInfo(lang, target);
  const cta      = ctaText(lang, target, nama);

  // Parse keunggulan into feature bullet points
  const featureRaw = keunggulan
    ? keunggulan.split(/[,;،、]+/).map(f => f.trim()).filter(Boolean)
    : [];

  // Locale-specific labels for each section
  const L = {
    en: {
      origin:'🌍 From Indonesia with Pride', desc:'Product Description', features:'Key Features',
      market:'Target Market', price:'Price', shipping:'Shipping & Order Info', cta:'How to Order'
    },
    zh: {
      origin:'🌍 来自印度尼西亚，骄傲出品', desc:'产品描述', features:'主要特点',
      market:'目标市场', price:'价格', shipping:'配送与订购信息', cta:'如何订购'
    },
    ar: {
      origin:'🌍 من إندونيسيا بفخر', desc:'وصف المنتج', features:'المميزات الرئيسية',
      market:'السوق المستهدف', price:'السعر', shipping:'معلومات الشحن والطلب', cta:'كيفية الطلب'
    },
    ja: {
      origin:'🌍 インドネシアから誇りを込めて', desc:'製品説明', features:'主な特徴',
      market:'ターゲット市場', price:'価格', shipping:'配送・注文情報', cta:'注文方法'
    },
    ko: {
      origin:'🌍 인도네시아에서 자랑스럽게', desc:'제품 설명', features:'주요 특징',
      market:'타겟 시장', price:'가격', shipping:'배송 및 주문 정보', cta:'주문 방법'
    }
  };
  const lbl = L[lang] || L.en;

  // ── Build each section ────────────────────────────────────────────

  // 1. TITLE
  const titleMap = {
    en: {
      fashion:    `Premium Handcrafted ${nama} — Java's Finest 🌍✨`,
      makanan:    `Authentic Indonesian ${nama} — Taste the Tradition 🍽️`,
      kerajinan:  `The Art of ${nama} — Masterpiece from Indonesia 🎨`,
      kecantikan: `Pure Indonesian ${nama} — Nature's Beauty Secret 🌿`,
      pertanian:  `Farm-Fresh Indonesian ${nama} — Nature's Finest 🌾`,
      elektronik: `${nama} — Smart Technology, Competitive Price 📱`,
      jasa:       `${nama} — Professional Indonesian Service Excellence 💼`
    },
    zh: {
      fashion:    `精品手工${nama} — 爪哇匠心之作 🌍✨`,
      makanan:    `正宗印尼${nama} — 品味传统风味 🍽️`,
      kerajinan:  `${nama}的艺术 — 来自印度尼西亚的杰作 🎨`,
      kecantikan: `纯正印尼${nama} — 大自然的美丽秘密 🌿`,
      pertanian:  `农场直供印尼${nama} — 大自然精华 🌾`,
      elektronik: `${nama} — 智能技术，具有竞争力的价格 📱`,
      jasa:       `${nama} — 印度尼西亚专业服务卓越 💼`
    },
    ar: {
      fashion:    `${nama} اليدوي الفاخر — أجود ما في جاوا 🌍✨`,
      makanan:    `${nama} الإندونيسي الأصيل — تذوق التراث 🍽️`,
      kerajinan:  `فن ${nama} — تحفة من إندونيسيا 🎨`,
      kecantikan: `${nama} الإندونيسي النقي — سر جمال الطبيعة 🌿`,
      pertanian:  `${nama} الإندونيسي الطازج — خير الطبيعة 🌾`,
      elektronik: `${nama} — تقنية ذكية بسعر تنافسي 📱`,
      jasa:       `${nama} — تميز الخدمات الإندونيسية المهنية 💼`
    },
    ja: {
      fashion:    `プレミアムハンドクラフト ${nama} — ジャワの逸品 🌍✨`,
      makanan:    `本格インドネシア ${nama} — 伝統の味を体験 🍽️`,
      kerajinan:  `${nama} の芸術 — インドネシアの傑作 🎨`,
      kecantikan: `純粋なインドネシア ${nama} — 自然の美の秘密 🌿`,
      pertanian:  `農場直送インドネシア ${nama} — 大自然の恵み 🌾`,
      elektronik: `${nama} — スマートテクノロジー、競争力ある価格 📱`,
      jasa:       `${nama} — インドネシアプロフェッショナルサービスの卓越性 💼`
    },
    ko: {
      fashion:    `프리미엄 핸드크래프트 ${nama} — 자바 최고의 작품 🌍✨`,
      makanan:    `정통 인도네시아 ${nama} — 전통의 맛을 경험하세요 🍽️`,
      kerajinan:  `${nama}의 예술 — 인도네시아의 걸작 🎨`,
      kecantikan: `순수한 인도네시아 ${nama} — 자연의 아름다움 비결 🌿`,
      pertanian:  `농장 직송 인도네시아 ${nama} — 자연의 정수 🌾`,
      elektronik: `${nama} — 스마트 기술, 경쟁력 있는 가격 📱`,
      jasa:       `${nama} — 인도네시아 전문 서비스 우수성 💼`
    }
  };
  const title = (titleMap[lang] && titleMap[lang][prodType.key])
    || (titleMap.en[prodType.key] || `${nama} — From Indonesia 🌍`);

  // 2. OPENING — cultural story seed
  const opening = cultural;

  // 3. PRODUCT DESCRIPTION — bahan + keunggulan woven into prose
  const descMap = {
    en: `${nama} is a distinguished ${prodType.label.toLowerCase()} sourced directly from Indonesian artisans and producers. ${bahan ? `Crafted from ${bahan},` : 'Made with carefully selected materials,'} every piece embodies the dedication and craftsmanship that Indonesia is renowned for on the global stage. ${keunggulan ? keunggulan + '.' : 'Each unit maintains consistent quality standards that meet international export requirements.'}`,
    zh: `${nama} 是直接来自印度尼西亚工匠和生产商的卓越${prodType.label}产品。${bahan ? `采用${bahan}精心制作，` : '采用精心挑选的材料制作，'}每件作品都体现了印度尼西亚在全球舞台上享誉盛名的工艺与专注。${keunggulan ? keunggulan + '。' : '每件产品均保持符合国际出口要求的一致质量标准。'}`,
    ar: `${nama} هو منتج ${prodType.label} متميز يأتي مباشرة من الحرفيين والمنتجين الإندونيسيين. ${bahan ? `مصنوع من ${bahan}،` : 'مصنوع من مواد مختارة بعناية،'} تجسد كل قطعة التفاني والحرفية التي تشتهر بها إندونيسيا على الساحة العالمية. ${keunggulan ? keunggulan + '.' : 'كل وحدة تحافظ على معايير جودة متسقة تلبي متطلبات التصدير الدولية.'}`,
    ja: `${nama}は、インドネシアの職人や生産者から直接仕入れた優れた${prodType.label}製品です。${bahan ? `${bahan}で丁寧に作られており、` : '厳選された素材で作られており、'}すべての作品にはインドネシアが世界舞台で名高い職人技と誠意が込められています。${keunggulan ? keunggulan + '。' : '各ユニットは国際輸出要件を満たす一貫した品質基準を維持しています。'}`,
    ko: `${nama}는 인도네시아 장인과 생산자들로부터 직접 소싱된 뛰어난 ${prodType.label} 제품입니다. ${bahan ? `${bahan}으로 정성껏 만들어져` : '엄선된 재료로 만들어져'} 각 작품에는 세계 무대에서 인정받는 인도네시아의 장인 정신이 담겨 있습니다. ${keunggulan ? keunggulan + '.' : '각 단위는 국제 수출 요건을 충족하는 일관된 품질 기준을 유지합니다.'}`
  };
  const desc = descMap[lang] || descMap.en;

  // 4. KEY FEATURES
  const defaultFeatures = {
    en: ['Authentic Indonesian origin','Meets international export quality standards','Ethically produced','Available in custom sizes & variants','Competitive wholesale pricing'],
    zh: ['正宗印度尼西亚原产','符合国际出口质量标准','道德生产','提供定制尺寸和款式','批发价格具有竞争力'],
    ar: ['أصل إندونيسي أصيل','يلبي معايير الجودة الدولية للتصدير','إنتاج أخلاقي','متوفر بأحجام وتصاميم مخصصة','أسعار جملة تنافسية'],
    ja: ['本場インドネシア原産','国際輸出品質基準適合','倫理的に生産','カスタムサイズ・バリエーション対応可能','競争力ある卸売価格'],
    ko: ['정통 인도네시아 원산','국제 수출 품질 기준 충족','윤리적으로 생산','맞춤 사이즈 및 변형 가능','경쟁력 있는 도매 가격']
  };
  const checkmark = lang === 'ar' ? '✓ ' : '✓ ';
  const featureLines = featureRaw.length
    ? featureRaw.map(f => checkmark + f).join('\n')
    : (defaultFeatures[lang] || defaultFeatures.en).map(f => checkmark + f).join('\n');

  // 5. TARGET MARKET sentence
  const marketSentence = {
    en: `Ideal for ${tLabel}. Suitable for retail, distribution, and e-commerce platforms worldwide.`,
    zh: `适合${tLabel}。适用于全球零售、分销和电商平台。`,
    ar: `مثالي لـ${tLabel}. مناسب للبيع بالتجزئة والتوزيع ومنصات التجارة الإلكترونية في جميع أنحاء العالم.`,
    ja: `${tLabel}に最適。世界中の小売、流通、Eコマースプラットフォームに対応。`,
    ko: `${tLabel}에 이상적입니다. 전 세계 소매, 유통 및 이커머스 플랫폼에 적합합니다.`
  };

  // ── Assemble full output ──────────────────────────────────────────

  const priceBlock = harga ? `\n💰 ${lbl.price}: ${harga}` : '';

  return [
    `${title}`,
    ``,
    `${lbl.origin}`,
    opening,
    ``,
    `📋 ${lbl.desc}`,
    desc,
    ``,
    `⭐ ${lbl.features}`,
    featureLines,
    ``,
    `🎯 ${lbl.market}`,
    (marketSentence[lang] || marketSentence.en),
    priceBlock,
    ``,
    `📦 ${lbl.shipping}`,
    shipping,
    ``,
    `📩 ${lbl.cta}`,
    cta
  ].filter(line => line !== null && line !== undefined).join('\n');
}

// ─── Render helpers ───────────────────────────────────────────────────────────

const LANG_META = {
  English:  { flag: '🇬🇧', code: 'en', label: 'English',        dir: 'ltr' },
  Mandarin: { flag: '🇨🇳', code: 'zh', label: '中文 (Mandarin)', dir: 'ltr' },
  Arabic:   { flag: '🇸🇦', code: 'ar', label: 'العربية',        dir: 'rtl' },
  Japanese: { flag: '🇯🇵', code: 'ja', label: '日本語',          dir: 'ltr' },
  Korean:   { flag: '🇰🇷', code: 'ko', label: '한국어',          dir: 'ltr' }
};

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function buildOutputHTML(langs, data) {
  if (!langs.length) {
    return `<div class="output-placeholder">
      <span class="output-placeholder-icon">⚠️</span>
      <p>Pilih minimal satu bahasa output.</p>
    </div>`;
  }

  return langs.map((lang, i) => {
    const meta = LANG_META[lang];
    if (!meta) return '';
    const text = generateLangDescription(meta.code, data);
    const id   = `ekspor-out-${meta.code}`;
    return `
      <div class="output-lang-block animate-slideup is-visible" style="--delay:${i * 0.06}s">
        <div class="output-lang-header">
          <span class="output-lang-name">${meta.flag} ${meta.label}</span>
          <button class="btn-copy-lang secondary" data-target="${id}" type="button">Salin</button>
        </div>
        <pre class="output-lang-text" id="${id}" dir="${meta.dir}">${escHtml(text)}</pre>
      </div>`;
  }).join('');
}

function bindCopyButtons() {
  document.querySelectorAll('#output-container .btn-copy-lang').forEach(btn => {
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

// ─── Event: Generate ─────────────────────────────────────────────────────────

document.getElementById('btn-generate-ekspor')?.addEventListener('click', () => {
  const nama       = document.getElementById('nama-produk')?.value.trim() || 'Produk UMKM';
  const bahan      = document.getElementById('bahan')?.value.trim()       || '';
  const keunggulan = document.getElementById('keunggulan')?.value.trim()  || '';
  const harga      = document.getElementById('harga')?.value.trim()       || '';
  const target     = document.getElementById('target-pasar')?.value       || 'umum';
  const langs      = [...document.querySelectorAll('input[name="bahasa"]:checked')].map(el => el.value);

  if (!document.getElementById('nama-produk')?.value.trim()) {
    document.getElementById('output-container').innerHTML = `
      <div class="output-placeholder">
        <span class="output-placeholder-icon">⚠️</span>
        <p>Isi <strong>Nama Produk</strong> terlebih dahulu.</p>
      </div>`;
    return;
  }

  const prodType = detectEksporType(nama, bahan, keunggulan);

  // Show detected badge
  const badge = document.getElementById('detected-type-ekspor');
  if (badge) {
    badge.textContent = prodType.emoji + ' ' + prodType.label;
    badge.style.display = '';
  }

  const data = { nama, bahan, keunggulan, harga, target, prodType };
  document.getElementById('output-container').innerHTML = buildOutputHTML(langs, data);
  bindCopyButtons();
});

// ─── Event: Reset ─────────────────────────────────────────────────────────────

document.getElementById('btn-reset-ekspor')?.addEventListener('click', () => {
  ['nama-produk','bahan','keunggulan','harga'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('input[name="bahasa"]').forEach((cb, i) => {
    cb.checked = i === 0;
  });
  const badge = document.getElementById('detected-type-ekspor');
  if (badge) badge.style.display = 'none';

  document.getElementById('output-container').innerHTML = `
    <div class="output-placeholder">
      <span class="output-placeholder-icon">🌍</span>
      <p>Isi detail produk di sebelah kiri lalu klik <strong>Generate Deskripsi</strong>.</p>
    </div>`;
});
