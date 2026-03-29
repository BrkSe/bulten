# Bulten

`TrendRadar` ve `Java / Spring Ekosistem Teknoloji Radar Ajanı` tarafından üretilen günlük markdown raporlarını, GitHub Pages üzerinde ücretsiz yayınlanan gezilebilir bir newsletter yüzeyine dönüştürür.

## Ne yapıyor?

- `dailytrend/` ve `dailyjava/` içindeki tüm `.md` dosyalarını otomatik keşfeder.
- Her klasörü bağımsız bir yayın akışı olarak işler.
- Ana sayfada birleşik bir federated akış sunar.
- Her sayı için okunabilir bir detay sayfası üretir.
- Global RSS, akış bazlı RSS ve OPML export üretir.
- GitHub'a push geldiğinde otomatik build alır ve GitHub Pages'e deploy eder.

## Klasör yapısı

```text
dailytrend/
dailyjava/
src/
.github/workflows/deploy.yml
```

Yeni bir akış eklemek istersen yalnızca [src/config/feeds.js](/Users/burakkutbay/Projects/bulten/src/config/feeds.js) içindeki tanıma yeni klasör bilgisini eklemen yeterli.

## Lokal geliştirme

```bash
npm install
npm run dev
```

Build testi:

```bash
npm run build
```

Otomasyon sonrası commit/push için:

```bash
npm run publish:reports
```

## GitHub Pages yayını

1. Bu klasörü bir GitHub reposuna bağla.
2. Varsayılan branch olarak `main` kullan.
3. Push yap.
4. GitHub repo ayarlarında Pages kaynağını `GitHub Actions` olarak bırak.

`.github/workflows/deploy.yml` her push sonrası statik siteyi derleyip Pages artefact olarak deploy eder.

## Otomasyon akışı

Senin mevcut ajanların günlük markdown ürettiğinde bu repo içine commit/push yaparsa:

- yeni sayı otomatik keşfedilir,
- site yeniden build edilir,
- GitHub Pages üzerinde yeni içerik canlıya çıkar.

İstersen ajanların sonunda `npm run publish:reports` çağrısı yapabilirsin. Bu komut:

- sadece `dailytrend/` ve `dailyjava/` değişikliklerini stage eder,
- önce build doğrulaması yapar,
- ardından commit atıp mevcut branch'e pushlar.

