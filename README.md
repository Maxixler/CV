# Eren Kale — Kişisel Portföy Web Sitesi

> CV PDF'inden oluşturulmuş, tek sayfalık, tamamen statik (HTML/CSS/JS) kişisel portföy sitesi.
> Framework yok, bağımlılık yok — dosyaları tarayıcıda aç veya herhangi bir statik sunucuyla serve et.

---

## 📁 Proje Yapısı

```
CV/
├── index.html          # Ana HTML — tüm 8 bölüm burada
├── style.css           # Tüm stiller (~1300 satır)
├── script.js           # Animasyonlar ve etkileşim
├── profile_avatar.png  # AI-generate profil silüeti
├── EREN_KALE_CV.pdf    # Kaynak CV dosyası
└── README.md           # Bu dosya
```

---

## 🎨 Tasarım Kararları

| Karar | Detay |
|-------|-------|
| **Tema** | Koyu (dark) arka plan (`#0a0a0f`) ile glassmorphism kartlar |
| **Renk Paleti** | Cyan (`#00d4ff`) → Purple (`#7c3aed`) gradyan aksanlar |
| **Font** | Inter (genel) + JetBrains Mono (kod/terminal) — Google Fonts CDN |
| **Düzen** | Tek sayfa, smooth scroll navigasyon |
| **Framework** | Yok — saf HTML5, CSS3, vanilla JS |
| **Responsive** | 3 breakpoint: 1024px, 768px, 480px |

---

## 📐 Bölüm Yapısı (index.html)

HTML'de `<section>` etiketleriyle ayrılmış 8 ana bölüm:

| # | Bölüm ID | Başlık | İçerik |
|---|----------|--------|--------|
| — | `#hero` | Hero | Terminal widget, glitch isim, orbiting icons, CTA butonları |
| 01 | `#about` | About Me | Bio paragrafları + 4 highlight kartı (Chip, AI, RF, Research) |
| 02 | `#education` | Education | Timeline: Marmara Üniv., TU Ilmenau (Erasmus+), Atatürk Üniv. |
| 03 | `#experience` | Experience | Kartlar: Turkcell, E3TAM, T3 Foundation |
| 04 | `#projects` | Projects | HexaChipsters, SDR LoRaWAN, Embedded Projects, Deneyap, C/C++ |
| 05 | `#publications` | Publications | FPGA/RISC-V makalesi + DergiPark linki |
| 06 | `#leadership` | Leadership | EEMK kulüp rolleri |
| 07 | `#skills` | Skills | Hardware/RTL, Software/AI, Languages tag'leri |
| 08 | `#contact` | Get in Touch | Email, LinkedIn, GitHub (3 sütun grid) |

---

## 🧩 CSS Mimarisi (style.css)

### CSS Custom Properties (`:root`)
Tüm renkler, fontlar, radius, gölgeler ve geçişler CSS değişkenleriyle tanımlı:
```css
--bg-primary: #0a0a0f;
--accent-1: #00d4ff;      /* cyan */
--accent-2: #7c3aed;      /* purple */
--font-primary: 'Inter';
--font-mono: 'JetBrains Mono';
```

### Ana CSS Bileşenleri
- **`.glass-card`** — Glassmorphism: `backdrop-filter: blur(12px)`, yarı-saydam bg, ince border
- **`.hero-terminal`** — macOS tarzı terminal penceresi (renkli noktalı başlık)
- **`.glitch`** — `::before`/`::after` pseudo-elementleri ile glitch animasyonu
- **`.orbit-ring` / `.orbit-icon`** — CSS `transform: rotate() translateX()` ile yörünge animasyonu
- **`.circuit-path`** — SVG `stroke-dasharray` + `stroke-dashoffset` ile çizim animasyonu
- **Timeline** — Sol kenar çizgisi + renkli dot'lar ile eğitim zaman çizelgesi

### Animasyonlar
| Keyframe | Ne yapar |
|----------|----------|
| `glitchAnim` | İsimde rastgele titreşim (translate) |
| `spinRing` | Yörünge halkasını döndürür |
| `spinRingReverse` | İkonları ters döndürür (sabit kalmaları için) |
| `drawCircuit` | SVG devre yollarını çizer |
| `pulseNode` | Devre düğümlerini titreştirir |
| `pulseGlow` | Profil resmi glow efekti |
| `blink` | Typed cursor yanıp sönme |
| `scrollWheel` | Scroll indicator animasyonu |
| `float` | Scroll indicator yüzme |

---

## ⚡ JavaScript İşlevleri (script.js)

### 1. Particle Background
- Canvas API ile `#particles-canvas`'a çizim
- 80 parçacık, birbirine yakın olanlar arasında çizgi çeker
- `requestAnimationFrame` döngüsü

### 2. Typing Effect
- `#typed-text` elementinde döngüsel yazım/silim
- Yazılan cümleler:
  ```
  design low-power chips.
  build embedded systems.
  deploy AI on edge devices.
  analyze RF signals.
  prototype RISC-V SoCs.
  engineer the future.
  ```

### 3. Navbar Scroll
- `window.scroll > 50px` → `#navbar.scrolled` sınıfı eklenir (blur arka plan)

### 4. Mobile Menu
- `#hamburger` butonu → `.nav-links.open` toggle
- Link tıklanınca menü kapanır

### 5. Scroll Reveal
- `IntersectionObserver` ile `[data-animate]` elementleri görünür olunca `.animate-in` sınıfı eklenir
- Sıralı gecikme (`i * 100ms`)

### 6. Smooth Scroll
- `a[href^="#"]` tıklamalarında `scrollIntoView({ behavior: 'smooth' })`

---

## 🔗 Dış Bağlantılar ve Veriler

| Kaynak | URL |
|--------|-----|
| GitHub | https://github.com/Maxixler |
| LinkedIn | https://linkedin.com/in/eren-kale |
| E-posta | ereenkale@gmail.com |
| Makale (DergiPark) | https://dergipark.org.tr/tr/pub/pajes/article/1815680 |
| Google Fonts | Inter + JetBrains Mono |

---

## 🛠️ Geliştirme Rehberi

### Yerel Sunucu Başlatma
```bash
cd c:\Users\Administrator\Desktop\yazilim\CV
python -m http.server 8080
# Tarayıcıda → http://127.0.0.1:8080/index.html
```

### Yeni Bölüm Ekleme
1. `index.html`'de mevcut bir `<section>` bloğunu kopyala
2. `id`, `section-number`, başlık ve içeriği değiştir
3. Navigasyona yeni `<li><a href="#yeni-id">` ekle
4. `style.css`'de ilgili stili ekle (`.glass-card` yapısını kullan)

### Yeni Proje Kartı Ekleme
`#projects > .projects-grid` içine:
```html
<div class="project-card glass-card github-card" data-animate>
    <div class="project-icon">🔧</div>
    <div class="project-status">GitHub Repository</div>
    <h3>Proje Adı</h3>
    <p>Proje açıklaması.</p>
    <div class="project-tech">
        <span class="tag">Tag1</span>
        <span class="tag">Tag2</span>
    </div>
    <a href="https://github.com/Maxixler/REPO" target="_blank" class="project-link">
        View on GitHub ↗
    </a>
</div>
```

### Yeni Deneyim Kartı Ekleme
`#experience > .experience-grid` içine:
```html
<div class="exp-card glass-card" data-animate>
    <div class="exp-header">
        <div class="exp-company">Şirket Adı</div>
        <div class="exp-date">Tarih Aralığı</div>
    </div>
    <div class="exp-role">Pozisyon</div>
    <ul class="exp-details">
        <li>Madde 1</li>
        <li>Madde 2</li>
    </ul>
    <div class="exp-tags">
        <span class="tag">Teknoloji</span>
    </div>
</div>
```

### Profil Resmini Değiştirme
`profile_avatar.png` dosyasını gerçek fotoğrafınla değiştir. Kare (1:1) oran önerilir, CSS otomatik olarak yuvarlak kesecektir.

### Renk Paletini Değiştirme
`style.css` → `:root` bloğundaki değişkenleri değiştir:
```css
--accent-1: #YeniRenk1;
--accent-2: #YeniRenk2;
```
Tüm gradyanlar ve vurgular otomatik güncellenecektir.

### Terminal İçeriğini Düzenleme
`index.html` → `.hero-terminal > .terminal-body` içindeki `.terminal-line` elementlerini düzenle.

### Typing Cümlelerini Değiştirme
`script.js` → `phrases` dizisini düzenle:
```js
const phrases = [
    'yeni cümle 1.',
    'yeni cümle 2.',
];
```

---

## 📋 Yapılmış Değişiklikler Geçmişi

### v1.0 — İlk Oluşturma
- CV PDF'inden tüm veriler çıkarıldı (PyPDF2)
- GitHub profili (@Maxixler) araştırıldı — 6 repo entegre edildi
- 8 bölümlü tek sayfalık site oluşturuldu
- Dark glassmorphism teması, particle arka plan, typing efekti

### v1.1 — Kullanıcı Geri Bildirimi
- **Kaldırılan:** Hero istatistikleri, telefon numarası, 3D Runner projesi, Özel Levent Boğazı deneyimi
- **Eklenen:** Terminal widget (whoami/cat/echo), glitch efekti, orbiting tech icons, circuit SVG, DergiPark makale linki, GitHub butonu

---

## ⚠️ Bilinen Sınırlamalar
- `favicon.ico` yok — tarayıcı 404 verir (işlevsel sorun değil)
- Profil resmi AI-generate silüet — gerçek fotoğrafla değiştirilebilir
- Google Fonts CDN'den yükleniyor — çevrimdışı çalışmaz (font dosyaları indirilip local serve edilebilir)
- Tüm içerik İngilizce (CV'nin İngilizce versiyonundan)
