# Günlük Java / Spring Ekosistem Raporu

Tarih: 29 Mart 2026

Bu rapor, 29 Mart 2026 itibarıyla Java, JVM, Spring, Spring Boot, Spring Cloud ve yakın ekosistemde üretim etkisi yaratabilecek güncel sinyalleri özetler. Öncelik, güvenlik yamaları, platform geçişleri, kırıcı değişiklikler, operasyonel etkiler ve orta vadeli mimari kararları etkileyen gelişmelerdedir.

## Öne Çıkan Başlıklar

- En kritik kısa vadeli konu, `Spring Boot 3.5.12` ile kapatılan iki ayrı Actuator kimlik doğrulama bypass zafiyeti. İnternete açık management uçları olan ekipler için bu sürüm doğrudan yamalanmalı.
- `Spring Boot 4` ve `Spring Framework 7` hattı artık izole bir erken-adopter alanı olmaktan çıkıyor; `Spring Cloud 2025.1.1`, `Spring Tools 5.1.0`, topluluk içerikleri ve yeni milestone’lar bu hattın etrafında ekosistem uyumu oluşturuyor.
- `Spring AI` çok hızlı ilerliyor; fakat `2.0.0-M3` sürümündeki kırıcı değişiklikler ve CVE düzeltmeleri, üretim kullanımında API oynaklığının hâlâ yüksek olduğunu gösteriyor.
- `JDK 26` GA ile HTTP/3, final field mutasyon uyarıları ve any-GC AOT cache gibi özellikler Java servislerinin ağ, başlangıç süresi ve runtime bütünlüğü tarafında somut etkiler yaratacak.
- Native image kullanan ekipler için `Oracle GraalVM 25.0.2` önemli: macOS x64 desteği bitti. Apple Silicon dışındaki build ajanları ve geliştirici makineleri gözden geçirilmeli.

## Kritik Güncellemeler

- `Spring Boot 3.5.12` (19 Mart 2026): `CVE-2026-22731` ve `CVE-2026-22733` düzeltildi. Özellikle Actuator health group path’leri ve Cloud Foundry endpoint’leri için doğrudan güvenlik etkisi var.
- `Spring Framework 6.2.17` ve `7.0.6` (13 Mart 2026): sırasıyla `Boot 3.5.12` ve `Boot 4.0.4` içine taşınan bakım sürümleri. Klasik “dependency drift” yerine platform sürümü ile birlikte alınmalı.
- `Spring Boot 4.1.0-M3` (20 Mart 2026): gRPC, OpenTelemetry, RabbitMQ Streams SSL, AMQP 1.0 ve Spring Batch + MongoDB desteği ile platform yönünü netleştiriyor.
- `Spring AI 2.0.0-M3 / 1.1.3 / 1.0.4` (17 Mart 2026): hem güvenlik yamaları hem de kırıcı API değişiklikleri içeriyor. Özellikle MCP paket taşınmaları ve `Jackson 3` geçişi dikkat gerektiriyor.
- `JDK 26` GA (17 Mart 2026): sadece yeni JEP’ler değil, aynı zamanda runtime davranışı ve operasyonel gözlemlenebilirlik tarafında da değişiklikler getiriyor.

## Trendler ve Sinyaller

### 1. Spring 4 / Framework 7 hattı etrafında ekosistem hizalanması güçleniyor

Tek başına `Boot 4` milestone’ları artık yeterli sinyal değil; asıl güçlü gösterge, etrafındaki araç ve release train uyumu. `Spring Cloud 2025.1.1`, `Boot 4.0.1+` ile uyumluluk sorununu kapatıyor. `Spring Tools 5.1.0`, Framework 7 API versioning ve AOT repository desteği için IDE ergonomisi ekliyor. Baeldung ve Burak KUTBAY gibi topluluk kaynaklarında da `Boot 4 / Framework 7` başlıklarının öğretilebilir içeriklere dönmesi, göçün keşif aşamasından planlama aşamasına geçtiğini gösteriyor.

Değerlendirme: Bu kısa vadeli hype değil. 2026 boyunca yeni servislerde ve orta vadeli platform planlarında kalıcı değer üretme potansiyeli yüksek.

### 2. Spring AI tarafında değer yüksek, istikrar düşük

Agent Skills, AskUserQuestion, Subagent Orchestration ve A2A gibi desenler Spring AI ekosistemini Java backend ekipleri için çok daha çekici hâle getiriyor. Ancak aynı dönemde gelen `2.0.0-M3` kırıcı değişiklikleri ve güvenlik düzeltmeleri, bu alanın hâlâ hızlı evrim geçirdiğini gösteriyor.

Değerlendirme: Üretimde yaygın standardizasyon için erken; ama kontrollü PoC ve platform keşfi için çok güçlü sinyal.

### 3. JDK tarafında “language candy” değil, runtime ve operasyon etkisi öne çıkıyor

`HTTP/3`, `Prepare to Make Final Mean Final`, `Ahead-of-Time Object Caching with Any GC` ve `Structured Concurrency` doğrudan mikroservis, ağ, startup ve güvenlik davranışını etkiliyor. Bu, JDK 26’nın sadece dil özellikleriyle değil, platform mühendisliği ve operasyon bakışıyla değerlendirilmesi gerektiğini gösteriyor.

Değerlendirme: Orta vadede kalıcı değer. Özellikle platform ekipleri ve altyapı standardizasyonu yapan takımlar için yüksek öncelik.

### 4. Üretim değeri olan yenilik ile gürültü ayrımı

- Dayanıklı değer: güvenlik yamaları, Spring Cloud uyumluluk düzeltmeleri, JDK 26 runtime değişiklikleri, AOT ve observability desteği.
- İzlenmesi gereken ama erken alanlar: Spring AI agentic patterns, A2A, subagent orkestrasyonu.
- Düşük öncelik / daha çok bilgilendirici: Oracle Java Verified Portfolio gibi vendor paketleme sinyalleri. Spring ekipleri için doğrudan mimari karar gerektiren bir başlık değil.

## Araçlar ve Kütüphaneler

- `Spring Tools 5.1.0`, özellikle JDBC `@Query` SQL intelligence, Java 15+ text block dönüşümü, AOT repository desteği ve Framework 7 API versioning quick-fix’leri ile ciddi verimlilik kazancı sunuyor. Spring geliştirici deneyimi tarafında en güçlü kısa vadeli araç güncellemesi bu.
- `Spring Data 2026.0.0-M2`, Redis Pub/Sub için annotation-driven listener modeli getiriyor. Mesajlaşmayı Spring Messaging çizgisine yaklaştırdığı için operasyonel karmaşıklığı azaltabilir.
- `Spring Data 2026.0.0-M1/M2` hattındaki type-safe property path yaklaşımı, uzun vadede string-based query/property kullanımını azaltarak refactor güvenliğini artırabilir.
- `Spring gRPC` desteğinin `Boot 4.1.0-M3` içinde öne çıkarılması, gRPC’nin Spring ekosisteminde artık yan ürün değil ana platform kabiliyeti olarak konumlandığını gösteriyor.
- Bu taramada, tipik Spring backend ekiplerinin hemen denemesi gereken yeni bağımsız OSS kütüphane sinyali sınırlı. En güçlü araç sinyali bağımsız bir kütüphane değil, platform destekli IDE ve veri erişim iyileştirmeleri.

## Java / Spring Geliştiricileri İçin Etkiler

- `Boot 3.5.x` hattında kalan servisler için en mantıklı hareket, yeni özellik aramadan `3.5.12` güvenlik güncellemesini almak.
- `Boot 4` göçü artık “bekleyelim, ekosistem hazır değil” seviyesinde değil; fakat bu göç hâlâ sürümler arası otomatik bir bump olarak ele alınmamalı. Özellikle Spring Cloud, Jackson, MCP, observability ve test altyapısı birlikte düşünülmeli.
- `JDK 26` değerlendirmesi, sadece benchmark değil uyumluluk testi de gerektiriyor. Reflection ile final field mutasyonu yapan kodlar, araçlar ve bazı serileştirme senaryoları erkenden tespit edilmeli.
- Eğer ekip AI tabanlı araçlar, agentic workflow’lar veya MCP tabanlı entegrasyonlar geliştiriyorsa, Spring AI ciddi bir aday. Ancak bunu doğrudan core business servislerine gömmek yerine ayrı bir deneysel katmanda konumlamak daha rasyonel.

## Fırsatlar ve Riskler

### Fırsatlar

- `Boot 4.1` hattı ile gRPC, observability ve batch/data özelliklerinin daha doğal biçimde tek platform altında toplanması.
- `JDK 26` ile HTTP/3 ve AOT cache sayesinde soğuk başlangıç, ağ verimliliği ve platform standardizasyonunda kazanım fırsatı.
- `Spring Data` tarafında type-safe property path ve yeni Redis listener modeliyle daha refactor-dostu ve daha okunabilir veri erişim katmanları.
- `Spring Tools 5.1.0` ile özellikle API versioning ve AOT/refactor süreçlerinde geliştirici verimliliğinin artması.

### Riskler

- Actuator yüzeyine sahip sistemlerde `Boot 3.5.12`’ye çıkmamak doğrudan güvenlik riski.
- `Spring AI 2.0.0-M3` hattına plansız geçiş, MCP artifact taşınmaları ve `Jackson 3` geçişi nedeniyle build/runtime kırılmalarına yol açabilir.
- `Boot 4` göçünde Spring Cloud release train hizası kaçırılırsa uyumluluk sorunları üretim öncesinde değil entegrasyon aşamasında patlayabilir.
- Native image kullanan ekiplerde macOS x64 build makinesi veya geliştirici ortamı kalmışsa `GraalVM 25.0.2` sonrası sürpriz destek sorunları oluşabilir.
- `JDK 26` ile final field mutasyon uyarıları, bazı reflection ağır kütüphanelerde teknik borcu görünür hâle getirecek.

## İzlenmesi Gereken Konular

- `Spring AI 2.0.0-M4` ile null-safety/JSpecify tarafında beklenen devam adımları.
- `Spring Data 2026.0.0` hattının Nisan RC ve Mayıs GA planı.
- `Spring Boot 4.1` yol haritasında milestone’dan RC’ye geçerken gRPC ve OTel özelliklerinin ne kadar stabilize olacağı.
- `Spring Cloud 2025.1.x` sonrası ek uyumluluk/geri alma notları.
- `JDK 26` için framework ve library ekosisteminin final field kısıtları ve HTTP/3 desteğine nasıl adapte olacağı.
- Apple Silicon dışı native-image build zinciri kullanan ekiplerde GraalVM alternatifleri veya ajan standardizasyonu.

## Kaynak Bazlı Bulgular

### 1. Spring Boot 3.5.12 ile iki kritik Actuator güvenlik açığı kapatıldı

- Başlık: Spring Boot 3.5.12 güvenlik güncellemesi
- Kaynak: [Spring Boot 3.5.12 available now](https://spring.io/blog/2026/03/19/spring-boot-3-5-12-available-now)
- Yazar: Moritz Halbritter
- Tarih: 19 Mart 2026
- Kategori: Güvenlik / Bakım sürümü
- Etiketler: `spring-boot`, `actuator`, `security`, `cve`, `cloudfoundry`
- Özet: `Boot 3.5.12`, 46 düzeltmenin yanında `CVE-2026-22731` ve `CVE-2026-22733` açıklarını kapatıyor.
- Neden önemli: Management yüzeyindeki auth bypass türü açıklar, içeride “low risk” gibi görünse bile gerçek üretim topolojilerinde hızlıca kritikleşir.
- Java/Spring ilgisi: Spring Boot kullanan hemen her servis için doğrudan ilgili.
- Aksiyon seviyesi: Hemen aksiyon
- Etki seviyesi: Yüksek
- Fırsatlar: Actuator exposure, management port ayrımı ve endpoint authorization politikalarını tekrar sertleştirmek için iyi tetikleyici.
- Riskler: Yamayı almayan servislerde health group ve Cloud Foundry endpoint’leri üzerinden yetkisiz erişim riski.
- Migrasyon notları: Salt patch upgrade olarak ele alınmalı; ayrıca custom management security config’leri regresyon testinden geçirilmeli.

### 2. Spring 4 / Framework 7 hattı ekosistem desteği kazanmaya devam ediyor

- Başlık: Boot 4 hattı yalnızca milestone değil, artık çevresel ekosistem hareketi
- Kaynak: [Spring Boot 4.1.0-M3 available now](https://spring.io/blog/2026/03/20/spring-boot-4-1-0-M3-available-now), [Spring Framework 6.2.17 and 7.0.6 Available Now](https://spring.io/blog/2026/03/13/spring-framework-6-2-17-and-7-0-6-available-now), [Spring Cloud 2025.1.1 (aka Oakwood) Has Been Released](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released), [Spring Tools 5.1.0 released](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released), [Spring Boot 4 & Spring Framework 7 – What’s New](https://www.baeldung.com/spring-boot-4-spring-framework-7), [API Versiyonlama – Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/)
- Yazar: Phil Webb; Brian Clozel; Ryan Baxter; Martin Lippert; Ralf Ueberfuhr; Burak KUTBAY
- Tarih: 29 Ocak 2026 - 20 Mart 2026
- Kategori: Platform evrimi / Ekosistem hizalanması
- Etiketler: `spring-boot-4`, `spring-framework-7`, `spring-cloud`, `api-versioning`, `tooling`, `migration`
- Özet: `Boot 4.1.0-M3` yeni platform kabiliyetleri eklerken, `Spring Cloud 2025.1.1` Boot `4.0.1+` uyumluluğunu getiriyor; `Spring Tools 5.1.0` ise Framework 7 ve AOT tarafında geliştirici deneyimini tamamlıyor.
- Neden önemli: Büyük göçler, yalnızca core framework hazır olduğunda değil çevresindeki release train ve tooling hazır olduğunda anlamlı hâle gelir.
- Java/Spring ilgisi: Yeni servis platform standardı belirleyen veya 2026 roadmap’i yapan tüm Spring ekipleri için çok ilgili.
- Aksiyon seviyesi: Pilot / Planla
- Etki seviyesi: Yüksek
- Fırsatlar: gRPC, OTel, API versioning ve daha güçlü geliştirme araçlarını standart platforma dahil etmek.
- Riskler: Spring Cloud uyumluluk çizgisi ve bağımlılık zinciri yönetilmezse göç pahalı ve kırılgan olur.
- Migrasyon notları: Greenfield servislerde `Boot 4` pilotu düşünülebilir; brownfield tarafta önce `3.5.12` güvenli tabanına oturup sonra kütüphane uyumluluğu envanteri çıkarılmalı.

### 3. Spring AI hızla büyüyor; üretim kullanımı için sürüm disiplini şart

- Başlık: Spring AI’de aynı anda hem güvenlik hem kırıcı değişim sinyali var
- Kaynak: [Spring AI 2.0.0-M3, 1.1.3 and 1.0.4 Available Now](https://spring.io/blog/2026/03/17/spring-ai-2-0-0-M3-and-1-1-3-and-1-0-4-available), [Spring AI Agentic Patterns (Part 1): Agent Skills - Modular, Reusable Capabilities](https://spring.io/blog/2026/01/13/spring-ai-generic-agent-skills/), [Spring AI Agentic Patterns (Part 4): Subagent Orchestration](https://spring.io/blog/2026/01/27/spring-ai-agentic-patterns-4-task-subagents), [Spring AI Agentic Patterns (Part 5): Building Interoperable Agents with the Agent2Agent (A2A) Protocol](https://spring.io/blog/2026/01/29/spring-ai-agentic-patterns-a2a-integration), [Spring AI Agentic Patterns (Part 2): AskUserQuestionTool - Agents That Clarify Before Acting](https://spring.io/blog/2026/01/16/spring-ai-ask-user-question-tool)
- Yazar: Christian Tzolov; Ilayaperumal Gopinathan
- Tarih: 13 Ocak 2026 - 17 Mart 2026
- Kategori: AI platformu / Erken dönem mimari desenler
- Etiketler: `spring-ai`, `mcp`, `a2a`, `agent-skills`, `subagents`, `jackson-3`
- Özet: `Spring AI 2.0.0-M3` 91 iyileştirme ve güvenlik düzeltmeleri getirirken; aynı zamanda MCP annotation/package taşıması, transport artifact relocation, `Jackson 3` geçişi ve `ToolContext` davranış değişimi gibi kırıcı farklar içeriyor.
- Neden önemli: AI tarafında asıl risk model seçimi değil, hızla değişen entegrasyon yüzeyi ve güvenlik/operasyon sınırları.
- Java/Spring ilgisi: Java ile agentic iş akışı kurmak isteyen Spring ekipleri için en güçlü portföy adayı; ancak stabilite beklentisi klasik Spring projelerinden düşük.
- Aksiyon seviyesi: Kontrollü PoC / Sıkı versiyon yönetimi
- Etki seviyesi: Orta-Yüksek
- Fırsatlar: Vendor-agnostic agent skills, A2A ve subagent desenleri ile Java tarafında güçlü bir agent platformu kurma imkânı.
- Riskler: Unsandboxed script çalıştırma, hızlı API değişimi, MCP modül taşınmaları, `Jackson 2 -> 3` geçiş kırıkları.
- Migrasyon notları: `2.0.0-M3` yükseltmesi upgrade notes okunmadan yapılmamalı; AI yetenekleri mümkünse ayrı bounded context veya ayrı deployment birimi içinde tutulmalı.

### 4. JDK 26, ağ ve startup davranışını doğrudan etkileyen bir sürüm

- Başlık: JDK 26 GA ile HTTP/3, any-GC AOT cache ve runtime bütünlüğü öne çıktı
- Kaynak: [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [JEP 517: HTTP/3 for the HTTP Client API](https://openjdk.org/jeps/517), [JEP 500: Prepare to Make Final Mean Final](https://openjdk.org/jeps/500), [Java 26 for DevOps](https://inside.java/2026/03/02/jdk-26-rn-ops/)
- Yazar: Sharat Chander; Daniel Fuchs; Mandy Chung; Billy Korando
- Tarih: 2 Mart 2026 - 17 Mart 2026
- Kategori: JDK / Runtime / Operasyon
- Etiketler: `jdk-26`, `http3`, `jep-500`, `aot-cache`, `structured-concurrency`, `gc`
- Özet: `JDK 26`, HTTP Client için HTTP/3 desteği, final field mutasyonlarına uyarı, any-GC AOT object caching, Structured Concurrency preview ve G1/ZGC operasyon iyileştirmeleri getiriyor.
- Neden önemli: Bu değişiklikler doğrudan servislerin startup süresi, ağ gecikmesi, runtime güvenliği ve concurrency modelini etkiliyor.
- Java/Spring ilgisi: Spring Boot servisleri yoğun olarak `HttpClient`, reflection, observability ve container startup davranışından etkilenir.
- Aksiyon seviyesi: İzle + laboratuvar testi başlat
- Etki seviyesi: Yüksek
- Fırsatlar: HTTP/3 ile daha iyi istemci tarafı ağ verimi; any-GC AOT ile hızlı startup; structured concurrency ile daha okunabilir concurrent orchestration.
- Riskler: Reflection ile final field mutasyonu kullanan kütüphaneler; üçüncü parti SSL provider ile HTTP/3 ilk sürüm kısıtları; preview API’lere aşırı bağlanma.
- Migrasyon notları: JDK 26 testlerinde `--illegal-final-field-mutation=deny` benzeri sıkı modlar denenmeli; HTTP/3 yalnızca kontrollü istemci senaryolarında pilot edilmeli.

### 5. GraalVM 25.0.2 native-image zincirinde görünmeyen ama sert bir kırılma taşıyor

- Başlık: GraalVM 25.0.2 ile macOS x64 desteği bitti
- Kaynak: [Oracle GraalVM 25 Release Notes](https://docs.oracle.com/en/graalvm/jdk/25/docs/release-notes/)
- Yazar: Oracle GraalVM dokümantasyonu
- Tarih: 20 Ocak 2026
- Kategori: Native image / Platform desteği
- Etiketler: `graalvm`, `native-image`, `macos-x64`, `apple-silicon`, `cpu`
- Özet: `Oracle GraalVM 25.0.2`, Ocak 2026 CPU düzeltmelerini içeriyor ve macOS x64 desteğini tamamen kaldırıyor; destek yalnızca macOS AArch64 üzerinde devam ediyor.
- Neden önemli: Birçok ekipte production Linux üstünde olsa bile local build, smoke test veya release cut aşamaları hâlâ Intel macOS makinelerde çalışabiliyor.
- Java/Spring ilgisi: Spring Boot native image ve AOT kullanan ekipler için doğrudan ilgili.
- Aksiyon seviyesi: Hemen ortam envanteri çıkar
- Etki seviyesi: Orta-Yüksek
- Fırsatlar: Build ajanlarını Apple Silicon veya Linux standardına çekip daha öngörülebilir native pipeline kurmak.
- Riskler: Yerel geliştirici deneyimi ve CI ajanları sessizce bozulabilir; native build süreleri ve cache’ler yeniden tasarlanabilir.
- Migrasyon notları: Intel macOS kullanan native-image zincirleri için ajan standardizasyonu veya alternatif dağıtım kombinasyonları belirlenmeli.

### 6. Spring Data, stringly-typed veri erişiminden daha güvenli modele doğru gidiyor

- Başlık: Spring Data 2026.0.0 hattında type-safe property path ve Redis listener modeli öne çıkıyor
- Kaynak: [Spring Data 2026.0.0-M1 released](https://spring.io/blog/2026/02/13/spring-data-2026-0-0-m1-released), [Spring Data 2026.0.0-M2 released](https://spring.io/blog/2026/03/13/spring-data-2026-0-0-M2-released)
- Yazar: Mark Paluch
- Tarih: 13 Şubat 2026 - 13 Mart 2026
- Kategori: Veri erişimi / API ergonomisi
- Etiketler: `spring-data`, `redis`, `mongodb`, `typesafe`, `property-path`, `messaging`
- Özet: `2026.0.0-M1` ile type-safe property path/property reference yaklaşımı gelirken, `M2` ile annotation-driven Redis Pub/Sub listener ve yeni Mongo bulk API öne çıkıyor.
- Neden önemli: Spring veri katmanında string bazlı property kullanımı, refactor ve bakım sırasında sessiz kırılmalara yol açabiliyor.
- Java/Spring ilgisi: JPA, Mongo, JDBC, R2DBC, Redis kullanan takımlar için doğrudan değer taşıyor.
- Aksiyon seviyesi: İzle / seçili pilot
- Etki seviyesi: Orta
- Fırsatlar: Daha güvenli query construction, daha okunabilir Redis abonelik modeli, daha güçlü bulk write kabiliyeti.
- Riskler: Milestone sürüm olduğu için davranış değişebilir; erkenden yaygın üretim kullanımına almak pahalı olabilir.
- Migrasyon notları: Kod üreten veya yoğun criteria/query yazan modüllerde küçük PoC’lerle denenmeli; GA öncesi geniş adoption önerilmez.

### 7. Spring Tools 5.1.0, geliştirici üretkenliği tarafında beklenenden daha yüksek etki taşıyor

- Başlık: IDE tarafında API versioning, AOT ve SQL ergonomisi güçleniyor
- Kaynak: [Spring Tools 5.1.0 released](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released)
- Yazar: Martin Lippert
- Tarih: 11 Mart 2026
- Kategori: Geliştirici deneyimi / Tooling
- Etiketler: `spring-tools`, `vscode`, `cursor`, `eclipse`, `aot`, `sql-intelligence`, `api-versioning`
- Özet: Yeni sürüm; JDBC `@Query` SQL intelligence, text block dönüşümü, AOT repository desteği, Framework 7 API versioning doğrulamaları ve JDK 25 AOT cache tabanlı startup iyileştirmeleri sunuyor.
- Neden önemli: Büyük platform geçişlerinde en pahalı gizli maliyet, geliştirici ergonomisinin düşmesidir; bu sürüm tam tersine geçişi kolaylaştırıyor.
- Java/Spring ilgisi: Günlük IDE akışı üzerinden doğrudan tüm Spring geliştiricilerini etkiliyor.
- Aksiyon seviyesi: Yakın vadede al
- Etki seviyesi: Orta
- Fırsatlar: Refactor ve query bakım maliyetini düşürmek, Boot 4/Framework 7 keşfini hızlandırmak.
- Riskler: Kurum içi IDE standardı eskiyse ekipler arası deneyim farklılaşabilir.
- Migrasyon notları: VS Code/Cursor/Theia veya Eclipse kullanan ekiplerde planlı rollout yapılabilir; özellikle API versioning kullanan servisler fayda görür.

## Sonuç

Bugünün en net kararı, `Spring Boot 3.5.12` güvenlik düzeltmesini ertelememek. Orta vadede ise üç başlık öne çıkıyor: `Boot 4 / Framework 7` geçiş planı, `JDK 26` laboratuvar uyumluluk testi ve `Spring AI` için kontrollü ama üretimden izole keşif hattı.

Kısacası: kısa vadede patch, orta vadede platform hizası, uzun vadede ise AI ve JDK 26 kaynaklı yeni çalışma modeline hazırlık.
