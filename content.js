(function createPortfolioContent(globalObject) {
  const DEFAULT_LANGUAGE = "en";
  const SUPPORTED_LANGUAGES = ["en", "tr"];

  const content = {
    en: {
      "meta.title": "Eren Kale | Strategy & Innovation Engineer",
      "meta.description": "Engineering depth, business insight, and emerging technologies—turned into decisions, systems, and growth.",
      "nav.profile": "Profile",
      "nav.labs": "Innovation Labs",
      "nav.cases": "Selected Cases",
      "nav.trajectory": "Trajectory",
      "nav.contact": "Contact",
      "hero.role": "Strategy & Innovation Engineer",
      "hero.heading": "Turning emerging technology into decisions, systems, and growth.",
      "hero.body": "I connect engineering depth, business insight, and leadership to move ideas from technical possibility to practical value.",
      "hero.primaryCta": "Discuss an opportunity",
      "hero.secondaryCta": "Download CV",
      "profile.heading": "One profile. Three connected lenses.",
      "profile.engineering.title": "Engineering depth",
      "profile.engineering.body": "RTL, FPGA, RISC-V, embedded systems, RF/SDR, AI, and telecommunications.",
      "profile.business.title": "Business insight",
      "profile.business.body": "Business studies and a focus on value, trade-offs, adoption, and scalable opportunities.",
      "profile.leadership.title": "Leadership",
      "profile.leadership.body": "Led activities for 400+ members, secured sponsorships, and mentored engineering teams.",
      "labs.heading": "Three small tools. One strategic story.",
      "labs.body": "Explore how I frame opportunities, balance trade-offs, and turn ideas into roadmaps.",
      "radar.title": "Technology Opportunity Radar",
      "radar.body": "Compare curated technologies by strategic impact and readiness.",
      "tradeoff.title": "Engineering Trade-off Studio",
      "tradeoff.body": "Balance impact, speed, risk, and cost to reveal a next action.",
      "roadmap.title": "Innovation Roadmap Builder",
      "roadmap.body": "Arrange a technology opportunity into Now, Next, and Later.",
      "labs.reset": "Reset",
      "cases.heading": "Technical work, reframed as strategic evidence.",
      "cases.mergen.title": "Mergen Low-Power Processor",
      "cases.mergen.body": "Balancing performance, verification, power, and industrial relevance.",
      "cases.sdr.title": "SDR-Based LoRaWAN Analysis",
      "cases.sdr.body": "Building a reusable platform for real-time 868 MHz experimentation.",
      "cases.edgeAi.title": "Embedded AI at E3TAM",
      "cases.edgeAi.body": "Moving computer vision from a model toward an operational edge system.",
      "trajectory.heading": "Proof and trajectory",
      "contact.heading": "Let's explore what technology could unlock next.",
      "contact.body": "If you are shaping an R&D, innovation, or technology strategy challenge, I would be glad to compare perspectives.",
      "contact.email": "Start a conversation",
    },
    tr: {
      "meta.title": "Eren Kale | Strateji ve İnovasyon Mühendisi",
      "meta.description": "Mühendislik derinliğini, iş bakışını ve gelişen teknolojileri kararlara, sistemlere ve büyümeye dönüştürür.",
      "nav.profile": "Profil",
      "nav.labs": "İnovasyon Laboratuvarları",
      "nav.cases": "Seçili Vakalar",
      "nav.trajectory": "Gelişim Çizgisi",
      "nav.contact": "İletişim",
      "hero.role": "Strateji ve İnovasyon Mühendisi",
      "hero.heading": "Gelişen teknolojileri kararlara, sistemlere ve büyümeye dönüştürüyorum.",
      "hero.body": "Fikirleri teknik olasılıktan uygulanabilir değere taşımak için mühendislik derinliğini, iş bakışını ve liderliği bir araya getiriyorum.",
      "hero.primaryCta": "Bir fırsatı konuşalım",
      "hero.secondaryCta": "CV'yi indir",
      "profile.heading": "Tek profil. Birbiriyle bağlantılı üç bakış.",
      "profile.engineering.title": "Mühendislik derinliği",
      "profile.engineering.body": "RTL, FPGA, RISC-V, gömülü sistemler, RF/SDR, yapay zekâ ve telekomünikasyon.",
      "profile.business.title": "İş bakışı",
      "profile.business.body": "İşletme eğitimi; değer, ödünleşimler, benimsenme ve ölçeklenebilir fırsat odağı.",
      "profile.leadership.title": "Liderlik",
      "profile.leadership.body": "400+ üyeye yönelik faaliyetleri yönetti, sponsorluklar sağladı ve mühendislik ekiplerine mentorluk yaptı.",
      "labs.heading": "Üç küçük araç. Tek bir stratejik hikâye.",
      "labs.body": "Fırsatları nasıl çerçevelediğimi, ödünleşimleri nasıl dengelediğimi ve fikirleri yol haritasına nasıl dönüştürdüğümü keşfedin.",
      "radar.title": "Teknoloji Fırsat Radarı",
      "radar.body": "Seçili teknolojileri stratejik etki ve hazırlık düzeyine göre karşılaştırın.",
      "tradeoff.title": "Mühendislik Ödünleşim Stüdyosu",
      "tradeoff.body": "Bir sonraki adımı görmek için etki, hız, risk ve maliyeti dengeleyin.",
      "roadmap.title": "İnovasyon Yol Haritası",
      "roadmap.body": "Bir teknoloji fırsatını Şimdi, Sonraki ve Daha Sonra adımlarına ayırın.",
      "labs.reset": "Sıfırla",
      "cases.heading": "Stratejik kanıta dönüşen teknik çalışmalar.",
      "cases.mergen.title": "Mergen Düşük Güçlü İşlemci",
      "cases.mergen.body": "Performans, doğrulama, güç ve endüstriyel uygunluğu dengelemek.",
      "cases.sdr.title": "SDR Tabanlı LoRaWAN Analizi",
      "cases.sdr.body": "Gerçek zamanlı 868 MHz deneyleri için yeniden kullanılabilir bir platform kurmak.",
      "cases.edgeAi.title": "E3TAM'da Gömülü Yapay Zekâ",
      "cases.edgeAi.body": "Bilgisayarlı görü modelini çalışan bir uç sisteme yaklaştırmak.",
      "trajectory.heading": "Kanıtlar ve gelişim çizgisi",
      "contact.heading": "Teknolojinin sırada neyi mümkün kılabileceğini birlikte keşfedelim.",
      "contact.body": "Bir Ar-Ge, inovasyon veya teknoloji stratejisi problemi üzerinde çalışıyorsanız bakış açılarımızı karşılaştırmak isterim.",
      "contact.email": "Görüşme başlat",
    },
  };

  function getText(language, key) {
    const resolvedLanguage = SUPPORTED_LANGUAGES.includes(language)
      ? language
      : DEFAULT_LANGUAGE;
    return content[resolvedLanguage][key] ?? `[${key}]`;
  }

  function validateContentParity() {
    const referenceKeys = Object.keys(content[DEFAULT_LANGUAGE]);
    const missing = {};
    for (const language of SUPPORTED_LANGUAGES) {
      missing[language] = referenceKeys.filter((key) => !(key in content[language]));
    }
    const valid = Object.values(missing).every((keys) => keys.length === 0)
      && SUPPORTED_LANGUAGES.every(
        (language) => Object.keys(content[language]).length === referenceKeys.length,
      );
    return { valid, missing };
  }

  const api = {
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    content,
    getText,
    validateContentParity,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalObject) globalObject.PortfolioContent = api;
}(typeof window !== "undefined" ? window : globalThis));
