# Trend Radar - 2 Temmuz 2026

Tarama zamanı: 2 Temmuz 2026 09:05 TRT

Product Hunt 2 Temmuz arşivi:
Tıkla:
https://www.producthunt.com/leaderboard/daily/2026/7/2

Product Hunt aktif PT günü:
Tıkla:
https://www.producthunt.com/leaderboard/daily/2026/7/1

Product Hunt karşılaştırma leaderboard'u:
Tıkla:
https://www.producthunt.com/leaderboard/daily/2026/6/30

Hacker News:
Tıkla:
https://news.ycombinator.com/news

GitHub Trending:
Tıkla:
https://github.com/trending

GitHub Changelog - Set AI credit session limits in Copilot CLI and SDK:
Tıkla:
https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/

GitHub Changelog - Enterprises can default to auto model selection:
Tıkla:
https://github.blog/changelog/2026-07-01-enterprises-can-default-to-auto-model-selection/

GitHub Changelog - Browser tools for GitHub Copilot in VS Code are generally available:
Tıkla:
https://github.blog/changelog/2026-07-01-browser-tools-for-github-copilot-in-vs-code-are-generally-available/

Cloudflare - Monetization Gateway:
Tıkla:
https://blog.cloudflare.com/monetization-gateway/

Cloudflare - Your site, your rules: new AI traffic options for all customers:
Tıkla:
https://blog.cloudflare.com/content-independence-day-ai-options/

Vercel - The Agent Stack:
Tıkla:
https://vercel.com/blog/agent-stack

Vercel - Build realtime voice agents on AI Gateway:
Tıkla:
https://vercel.com/blog/realtime-voice-agents-on-ai-gateway

Vercel - Introducing eve:
Tıkla:
https://vercel.com/blog/introducing-eve

Inside Java:
Tıkla:
https://inside.java/

Anthropic - Introducing Claude Sonnet 5:
Tıkla:
https://www.anthropic.com/news/claude-sonnet-5

Senior SWE-Bench:
Tıkla:
https://senior-swe-bench.snorkel.ai/

Arama etiketleri:
`governed-execution-rail`, `agent-payments`, `browser-native-actuation`, `evaluation-pressure`, `short-lived-permission-plane`, `multimodal-command-surface`

## Bugünün resmi

- 2 Temmuz 2026 09:05 TRT taramasında Pacific saati `1 Temmuz 2026 23:05 PDT` idi. Product Hunt `2 Temmuz` URL'si doğrudan fetch'te Cloudflare `403` verdiği için aktif launch günü `1 Temmuz 2026`, karşılaştırma günü `30 Haziran 2026` olarak sabitlendi.
- Dünkü ana eksen `embedded agent surface + reusable skill + budget governance` idi: ajan mevcut mobil, inbox, takvim ve analytics yüzeylerine yerleşiyordu.
- Bugün sinyal bir adım ileri gitti: pazar artık ajanın hangi yüzeye gömüldüğünden çok hangi işi gerçekten icra ettiği, hangi limite çarptığında durduğu, hangi browser akışını bitirdiği ve hangi isteğin artık ödeme gerektirdiğiyle ilgileniyor.
- Product Hunt'taki `Acti`, `Humalike`, `Tabstack Browser Automation`, `Adam CAD Copilot` ve `Sequence`; GitHub tarafındaki `browser tools`, `auto model selection`, `Copilot vision` ve `AI credit session limits`; Cloudflare'ın `Monetization Gateway`; Vercel'in `durable execution + approvals + sandbox`; HN'deki `Senior SWE-Bench`, `ZCode` ve `CursorBench 3.1` aynı kararı veriyor: agent pazarı demo değil, kontrollü icra katmanı satmaya başladı.

## Dünden bugüne kayış

- `30 Haziran 2026` akışı `Cursor for iOS`, `Skills Marketplace by Databox`, `Akiflow` ve `Supafax` ile agent'i mevcut çalışma yüzeylerine dağıtıyordu.
- `1 Temmuz 2026` akışı ise `Acti`, `Tabstack`, `Adam CAD Copilot` ve `Sequence` ile aynı yüzeyleri gerçek aksiyon rayına çeviriyor: klavyeden komut ver, browser işi bitir, CAD objesini düzenle, para hareketi başlat.
- Bu yüzden kayış `embedded agent surface` çizgisinden `governed execution rail` çizgisine geçti.
- Dün soru `ajan hangi ekranda yaşayacak?` idi; bugün soru `ajan hangi işlemi hangi izin, bütçe, audit ve benchmark ile tamamlayacak?` oldu.

## Ana pattern'ler

### 1. Klavye, ses ve görüntü artık sadece giriş değil, operasyon tetikleyicisi

`Acti` mobil klavyeyi arama ve aksiyon yüzeyine çeviriyor. Vercel `AI Gateway` üzerinde realtime voice'u aynı routing ve spend-control katmanına alıyor. GitHub aynı gün `Copilot vision` ile görsel girdiyi, `browser tools` ile sayfa aksiyonunu Copilot yüzeyine bağlıyor.

Bu ne diyor:

- Yeni agent farkı yeni chat penceresi açmak değil, mevcut giriş yüzeyini icra motoruna çevirmek.
- `Keyboard + voice + vision` üçlüsü artık ayrı deneyler değil, aynı multimodal komut yüzeyinin parçaları.
- Kazanan ürün, kullanıcının yeni UI öğrenmesini değil mevcut davranışını agentic hale getirmesini sağlayacak.

### 2. Browser ve uygulama içi aksiyon, agent için varsayılan execution katmanı oluyor

`Tabstack Browser Automation` tek API çağrısıyla gerçek browser sürmeyi, form doldurmayı ve etkileşim sonrası açılan sayfayı sonuç olarak döndürmeyi vaat ediyor. GitHub'ın `browser tools` duyurusu ve Anthropic'in `Claude Sonnet 5` anlatısı da aynı yere çıkıyor: güçlü agent artık sadece metin üretmiyor, sayfayı geziyor, tool çağırıyor ve çok adımlı işi kapatıyor.

Bu ne diyor:

- Browser automation artık niş RPA değil, genel agent stack'in çekirdek primitive'i.
- `Read-only retrieval` çizgisinden `stateful action` çizgisine geçiyoruz.
- Web üzerinde iş yapan her ürün için browser eylemi yakında opsiyon değil taban yetenek olacak.

### 3. Para, kredi ve model routing agent'in yeni control plane'i haline geliyor

`Sequence` AI agent'ler için scoped key, spending limit ve audit trail ile para hareketi sunuyor. Cloudflare `Monetization Gateway` ile web sayfası, API, dataset ve MCP tool çağrılarını istek seviyesinde fiyatlamaya hazırlanıyor. GitHub da aynı gün `AI credit session limits` ve `auto model selection` ile agent'in hem bütçe hem model kararını yönetilebilir primitive'e çeviriyor.

Bu ne diyor:

- Agent artık yalnızca komut çalışan yazılım değil, harcama yapan ekonomik aktör.
- `Budget cap`, `model routing` ve `payment rail` aynı ürün hikayesinde birleşiyor.
- Girişim fırsatı artık sadece `daha iyi agent` değil; `daha kontrollü ve daha ücretlendirilebilir agent execution`.

### 4. Approval, durability ve eval katmanı zorunlu hale geliyor

Vercel `Agent Stack` açıkça üç ana ihtiyacı tarif ediyor: model routing, çok adımlı workflow ve sistem bağlantıları. `eve` ise bunu `durable execution`, `sandboxed compute`, `human-in-the-loop approvals` ve `evals` ile paketliyor. HN tarafında `Senior SWE-Bench`, `ZCode` ve `CursorBench 3.1` gibi başlıkların öne çıkması da kalite tartışmasının benchmark ve harness katmanına taşındığını gösteriyor.

Bu ne diyor:

- Agent pazarı artık demo videodan çok `resume edilebilir run`, `sandbox`, `approval gate` ve `eval score` konuşuyor.
- Uzun iş ufku olan görevler için dayanıklılık ve ara checkpoint maliyet optimizasyonu kadar önemli.
- Evals olmadan agent satmak, test'siz backend satmaya benzemeye başlıyor.

### 5. Kimlik, davranış ve domain içgüdüsü yeni middleware katmanına dönüşüyor

`Humalike` agent'e sosyal zeka API'si vermeye çalışıyor. `Logto` GitHub Trending'de AI uygulamaları için OIDC, OAuth 2.1, multi-tenancy ve RBAC odağıyla yükseliyor. Vercel `Connect` kısa ömürlü task-token yaklaşımını öne çıkarırken Cloudflare aynı vizyonu `verified agent identity` ile ödeme ve erişim katmanına bağlıyor.

Bu ne diyor:

- Agent IQ tek başına yetmiyor; yetki, temsil ettiği kullanıcı ve davranış kalıbı da ürün parçası oluyor.
- `Who authorized this action?` sorusu artık enterprise adoption'ın merkezinde.
- Identity-aware middleware, yeni dalga agent altyapısının en sert farklılaştırıcılarından biri olacak.

## Product Hunt radarı

### 1 Temmuz 2026 PT aktif launch akışında öne çıkanlar

1. **Acti**
Mobil klavyeyi doğrudan komut ve retrieval yüzeyine çeviriyor. Bu, agent'in ayrı uygulamaya değil mevcut input akışına yerleştiğini gösteriyor.
Tıkla:
https://www.openacti.com

2. **Humalike**
`Behavioral infrastructure for humanlike AI agents` söylemiyle model zekasından çok davranış katmanını ürünleştiriyor.
Tıkla:
https://www.humalike.ai

3. **Tabstack Browser Automation**
Gerçek browser aksiyonunu, yapılandırılmış veri çıkışını ve agent task completion'ı tek API katmanında birleştiriyor.
Tıkla:
https://tabstack.ai

4. **Claude Sonnet 5**
Product Hunt tarafında doğrudan `plans, acts, and gets work done` söylemiyle konumlanıyor; model pazarı artık execution kalitesi üzerinden satılıyor.
Tıkla:
https://www.anthropic.com/news/claude-sonnet-5

5. **Adam CAD Copilot**
CAD işini ayrı copilot penceresine değil Onshape ve Fusion içindeki mevcut mühendislik yüzeyine taşıyor.
Tıkla:
https://adam.new/copilot

6. **Sequence**
Leaderboard'da ilk beşin dışında kalsa da günün en kuvvetli altyapı sinyallerinden biri; agent için para hareketini, limitleri ve audit trail'i bir araya getiriyor.
Tıkla:
https://home.getsequence.io

### Bir gün önceki leaderboard: 30 Haziran 2026

1. **Cursor for iOS**
Dünün mobil yüzey sinyalini taşıyordu; bugünkü `Acti` ile birlikte bakıldığında mobil artık sadece erişim değil, doğrudan aksiyon yüzeyi.
Tıkla:
https://cursor.com

2. **Skills Marketplace by Databox**
Dün değer tekrar kullanılabilir skill kataloğundaydı; bugün bu beceriler gerçek icra, ödeme ve limit katmanına bağlanıyor.
Tıkla:
https://databox.com

3. **Foresight by Lightning Rod**
Karar API'si modeli dünkü akışta güçlüydü; bugün aynı mantık execution-grade altyapı ürünleriyle birleşiyor.
Tıkla:
https://www.lightningrod.ai

4. **Akiflow**
Dünün takvim ve görev yüzeyi sinyalini veriyordu; bugün bunun üstüne action rail katmanı biniyor.
Tıkla:
https://www.akiflow.com

5. **Supafax**
Inbox yüzeyinin agent runtime'a dönüşmesi dünkü hikayeydi; bugün benzer mantık browser, keyboard ve payment katmanına genişliyor.
Tıkla:
https://supafax.com

### Product Hunt'tan çıkan net sonuç

- `30 Haziran 2026` günü agent'in nereye yerleştiği öne çıkıyordu.
- `1 Temmuz 2026` günü agent'in hangi işi gerçekten kapattığı, neyi tetiklediği ve hangi limitlerle çalıştığı öne çıktı.
- Bu yüzden Product Hunt sinyali bugün `embedded operator surface` çizgisinden `policy-aware execution rail` çizgisine kayıyor.

## GitHub Trending radarı

- **diegosouzapw/OmniRoute**
Tek endpoint üstünde `231+ provider`, auto-fallback ve token compression vurgusu; model routing'in doğrudan maliyet ve süreklilik ürünü haline geldiğini gösteriyor.
Tıkla:
https://github.com/diegosouzapw/OmniRoute

- **logto-io/logto**
OIDC, OAuth 2.1, SSO ve RBAC odağı; AI uygulamalarında identity ve entitlement katmanının çekirdekleştiğini doğruluyor.
Tıkla:
https://github.com/logto-io/logto

- **usestrix/strix**
Açık kaynak AI pentest aracı, execution-grade agent pazarının güvenlik tarafında da ayrı ürünler doğurduğunu gösteriyor.
Tıkla:
https://github.com/usestrix/strix

- **msitarzewski/agency-agents**
Uzman agent kataloğu teması hâlâ yaşıyor; ancak bugünün farkı, bu uzmanlıkların artık routing, auth ve audit katmanlarıyla birlikte okunması.
Tıkla:
https://github.com/msitarzewski/agency-agents

- **allenai/olmocr**
PDF'i LLM-dostu formata çeviren toolkit, input temizleme ve belge-işleme hattının agent pipeline'ında ayrı bir katman olarak kalmaya devam ettiğini gösteriyor.
Tıkla:
https://github.com/allenai/olmocr

## Hacker News ve blog radarı

- **HN: benchmark savaşı ajanların “senior engineer” çıtasına taşınıyor**
HN ana sayfasında aynı anda `ZCode`, `Senior SWE-Bench` ve `CursorBench 3.1` gibi başlıkların görünmesi, yarışın prompt şovundan çok uzun ufuklu execution değerlendirmesine kaydığını gösteriyor.
Tıkla:
https://zcode.z.ai/en

Tıkla:
https://senior-swe-bench.snorkel.ai/

Tıkla:
https://cursor.com/evals

- **GitHub: Copilot tek bir model ürünü olmaktan çıkıp yönetilen agent çalışma yüzeyine dönüşüyor**
`browser tools`, `Copilot vision`, `AI credit session limits`, `auto model selection` ve bir gün önce gelen `Claude Sonnet 5` birlikte okununca GitHub'ın modeli değil agent çalışma ortamını ürünleştirdiği görülüyor.
Tıkla:
https://github.blog/changelog/2026-07-01-browser-tools-for-github-copilot-in-vs-code-are-generally-available/

Tıkla:
https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/

Tıkla:
https://github.blog/changelog/2026-07-01-enterprises-can-default-to-auto-model-selection/

Tıkla:
https://github.blog/changelog/2026-07-01-copilot-vision-is-generally-available/

Tıkla:
https://github.blog/changelog/2026-06-30-claude-sonnet-5-is-generally-available-for-github-copilot/

- **Cloudflare: agentic web artık fiyat, bot sınıfı ve ödeme protokolüyle birlikte geliyor**
`Monetization Gateway`, `AI traffic options` ve aynı günkü Content Independence Day yazıları; API, içerik ve MCP tool kullanımının request-level ekonomiyle buluştuğunu gösteriyor.
Tıkla:
https://blog.cloudflare.com/monetization-gateway/

Tıkla:
https://blog.cloudflare.com/content-independence-day-ai-options/

Tıkla:
https://blog.cloudflare.com/agentic-internet-bot-report/

- **Vercel: production-grade agent tanımı artık açık**
`Agent Stack` model routing, workflow ve sistem bağlantısını; `eve` ise durable execution, sandbox, approvals ve evals'i doğrudan çerçeve içinde veriyor. Realtime voice eklemesi de aynı execution hattını ses girişine açıyor.
Tıkla:
https://vercel.com/blog/agent-stack

Tıkla:
https://vercel.com/blog/introducing-eve

Tıkla:
https://vercel.com/blog/realtime-voice-agents-on-ai-gateway

- **Inside Java: runtime zemini hâlâ sert ve gözden çıkarılmıyor**
Inside Java ana sayfasında aynı anda `ZGC`, `Java microservices benchmark`, `agentic coding` ve `Intelligent JVM Monitoring` içeriklerinin öne çıkması; agent dalgasının performans, migration ve production telemetry ihtiyacını ortadan kaldırmadığını gösteriyor.
Tıkla:
https://inside.java/

Tıkla:
https://inside.java/2026/06/14/cline-migrate-java-oca/

Tıkla:
https://inside.java/2026/06/30/zgc-performance-decade/

## Fırsat alanları

- **Policy-aware browser operator rail**
Tarayıcı aksiyonunu, approval adımını ve audit trail'i tek yerde çözen dikey execution altyapısı.

- **Agent payment and settlement broker**
Sequence ve Cloudflare çizgisinde, tool çağrısı ile ödeme kararını aynı request akışında birleştiren ekonomik katman.

- **Identity-scoped action middleware**
Kısa ömürlü token, RBAC, temsil edilen kullanıcı bilgisi ve davranış politikalarını task bazında yöneten agent access fabric.

- **Eval-first enterprise automation stack**
Senior SWE-Bench ve CursorBench benzeri benchmark'ları canlı iş akışına bağlayan, release öncesi agent kalite kapısı kuran platform.

- **Vertical execution copilots**
CAD, security, analytics, finance ve inbox gibi zaten güçlü iş primitive'i olan alanlarda, ayrı chat yerine işi doğrudan bitiren dar fakat derin agent katmanı.

## Kapanış

Bugünün Trend Radar'ı şunu söylüyor: agent pazarı `ajanı nereye koyacağız?` sorusundan `ajan hangi gerçek işi hangi sınırlarla yapacak?` sorusuna geçti. En kuvvetli sinyal, yeni bir chatbot arayüzünden değil; browser aksiyonu, multimodal giriş, payment rail, approval gate, session limit ve eval katmanının aynı execution sözleşmesinde birleşmesinden geliyor.
