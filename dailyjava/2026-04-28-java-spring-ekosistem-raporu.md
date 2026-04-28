# Günlük Java / Spring Ekosistem Raporu

Tarih: 28 Nisan 2026  
Odak: güvenlik advisory'leri, veri/cache semantiği, Spring AI bellek mimarisi, JDK patch ve uyumluluk sinyalleri

Tarama notu: Bugünkü taramada [Spring Blog](https://spring.io/blog/), [Spring Security Advisories](https://spring.io/security/), [Spring Framework 6.2.18 ve 7.0.7 duyurusu](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/), [Spring Data 2026.0.0-RC1 duyurusu](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/), [Spring Vault 4.1.0-RC1 duyurusu](https://spring.io/blog/2026/04/20/spring-vault-4-0-rc1-4-0-2-released/), [Spring AI Session API yazısı](https://spring.io/blog/2026/04/15/spring-ai-session-management/), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/), [Spring Cloud release referansı](https://docs.spring.io/spring-cloud-release/reference/index.html), [Oracle Java update kanalı](https://docs.oracle.com/en-us/iaas/releasenotes/java-management/jdk_cpu_april_2026.htm), [JDK 27 EA release notes](https://jdk.java.net/27/release-notes), [Inside Java Quality Outreach](https://inside.java/2026/04/21/quality-heads-up/), [InfoQ Java roundup](https://www.infoq.com/news/2026/04/java-news-roundup-apr20-2026/), [Baeldung Java Weekly](https://www.baeldung.com/java-weekly-643), [Josh Long - This Week in Spring](https://spring.io/blog/2026/04/21/this-week-in-spring-april-21st-2026), [Gunnar Morling blogu](https://www.morling.dev/blog/), [Burak KUTBAY blogu](https://blog.burakkutbay.com/) ve ilgili resmi dokümantasyonlar kontrol edildi. Baeldung, Gunnar Morling ve Burak KUTBAY tarafında bugün üretim kararını değiştirecek yeni bir release veya incident sinyali yok; asıl yüksek değerli bulgular Spring güvenlik sayfası, Spring Framework/Data yayınları ve Java platform update kanallarından geldi.

## Öne Çıkan Başlıklar

- `Spring Boot` tarafında 23 Nisan 2026 advisory dalgası, uygulama kodundan çok konfigürasyon kaynaklı güvenlik açıklarına işaret ediyor: SSL bundle kullanırken hostname verification'ın atlanması, `DevTools` remote secret karşılaştırması, tahmin edilebilir temp directory ve `${random.*}` değerlerinin yanlış amaçla secret olarak kullanılması.
- `Spring Framework 6.2.18` ve `7.0.7`, web katmanında üç ayrı CVE kapatıyor. Aynı duyuruda `5.3.x` ve `6.1.x` için açık kaynak destek penceresinin kapandığı açıkça söyleniyor.
- `Spring Data 2026.0.0-RC1`, veri erişim ergonomisi ile runtime semantiğini birlikte etkileyen üç başlık getiriyor: relational `upsert`, `RedisMessageSendingTemplate` ve `RedisCache.resetCaches()` için `FLUSHDB` optimizasyonu.
- `Spring AI Session API`, düz mesaj penceresinden event-sourced, turn-safe ve multi-agent uyumlu bellek modeline geçişin ilk net işareti. Bu sadece yeni API değil, yaklaşım değişikliği.
- Java platform tarafında bugün en pratik iş, yeni feature kovalamak değil; `April 21, 2026` CPU patch'lerini almak ve `JDK 27` başlıklarını uyumluluk test listesine koymak.

## Kritik Güncellemeler

### Spring Boot güvenlik advisory'leri konfigürasyon düzeyinde sertleşme gerektiriyor

[Spring Security Advisories](https://spring.io/security/) sayfasında 23 Nisan 2026 tarihli bir dizi Spring Boot advisory öne çıkıyor:

- `CVE-2026-40970`: SSL bundle ile Elasticsearch bağlantısında hostname verification atlanabiliyor.
- `CVE-2026-40972`: `DevTools` remote secret karşılaştırması timing attack'e açık.
- `CVE-2026-40973`: `ApplicationTemp` için tahmin edilebilir temp directory kabul edilebiliyor.
- `CVE-2026-40974`: Cassandra SSL auto-configuration hostname verification yapmıyor.
- `CVE-2026-40975`: `${random.value}` secret üretimi için uygun değil.

Buradaki ortak desen şu: risklerin çoğu business logic'ten değil, framework convenience katmanından geliyor. Bu yüzden dependency upgrade tek başına yeterli değil; platform ekiplerinin config review, smoke test ve security regression kontrolü eklemesi gerekiyor.

### Spring Framework web katmanında güvenlik ve support lifecycle aynı anda sıkışıyor

[Spring Framework 6.2.18 ve 7.0.7 duyurusu](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/) üç önemli açığı kapatıyor:

- `CVE-2026-22740`: WebFlux multipart temp file DoS
- `CVE-2026-22741`: Spring MVC/WebFlux static resource cache poisoning
- `CVE-2026-22745`: Windows üzerinde static resource handling DoS

Aynı duyuruda açık kaynak desteğin `5.3.x` ve `6.1.x` için bittiği de net biçimde yazılmış durumda. Yani bazı ekipler için sorun yalnızca CVE kapatmak değil; artık desteklenen hatlara geçmeden güvenlik borcunu kapatmak da mümkün değil.

### Spring AI tarafında saldırı yüzeyi büyüyor

[Spring Security Advisories](https://spring.io/security/) sayfasında 27 Nisan 2026 itibarıyla `CVE-2026-40980` başlığı altında attacker-controlled PDF ile OOM üretilebildiği görülüyor. Aynı advisory akışında daha önce Spring AI için `SimpleVectorStore` tarafında kritik SpEL injection ve `BedrockProxyChatModel` tarafında SSRF advisory'leri de yayımlanmıştı.

Bu, Spring AI kullanımının "sadece model sağlayıcısı seçimi" olmaktan çıktığını gösteriyor. Belge işleme, vector store filtreleme ve medya fetch katmanları artık klasik backend threat model'ine dahil edilmeli.

### Oracle Java CPU yayımlandı; JDK 27 heads-up'ları artık gerçek upgrade backlog maddesi

[Oracle Java CPU April 2026 yayını](https://docs.oracle.com/en-us/iaas/releasenotes/java-management/jdk_cpu_april_2026.htm), `26.0.1`, `25.0.3`, `21.0.11`, `17.0.19`, `11.0.31` ve `8u491` sürümlerini öne çıkarıyor. Paralelde [JDK 27 EA release notes](https://jdk.java.net/27/release-notes) ve [Inside Java Quality Outreach](https://inside.java/2026/04/21/quality-heads-up/) iki somut uyumluluk başlığı veriyor:

- `ThreadPoolExecutor.finalize()` kaldırıldı.
- Bakımı yapılmayan çeviri resource'ları kaldırılıyor; aktif bakım yalnızca İngilizce tabanına ek olarak Almanca, Japonca ve Basitleştirilmiş Çince için sürüyor.

Bu iki başlık, özellikle yaşlı kütüphaneler, custom executor wrapper'ları ve locale'e hassas testler için sessiz kırılma riski taşıyor.

## Trendler ve Sinyaller

### 1. Güvenlik açıkları artık framework konfor katmanında yoğunlaşıyor

Spring Boot advisory'leri, Spring Framework web CVE'leri ve Spring AI ingestion advisory'leri birlikte okunduğunda ortak desen net: riskler artık yalnızca "yanlış iş kuralı kodu"ndan değil, auto-configuration, helper abstraction ve parser davranışlarından doğuyor.

### 2. Spring ekosistemi stateful abstraction'ları daha ciddi hale getiriyor

[Spring Data RC1](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/) ile Redis ve relational katmanda daha belirgin semantik davranışlar geliyor. [Spring AI Session API](https://spring.io/blog/2026/04/15/spring-ai-session-management/) ise agent memory modelini basit message window'dan event log'a taşıyor. İkisi birlikte okunduğunda sinyal şu: Spring katmanı artık yalnızca API kolaylığı değil, state yönetimi ve davranış garantisi satıyor.

### 3. Günün yüksek değeri "yeni feature" değil, yükseltme hijyeni

[InfoQ Java roundup](https://www.infoq.com/news/2026/04/java-news-roundup-apr20-2026/) ile [Josh Long'un haftalık özeti](https://spring.io/blog/2026/04/21/this-week-in-spring-april-21st-2026) bu hafta ekosistemin patch, RC ve uyumluluk trafik yoğunluğunu doğruluyor. Yani bugün için kalıcı mühendislik değer; yeni framework denemekten çok, patch cadence ve compatibility smoke testlerini disipline etmekte.

## Araçlar ve Kütüphaneler

- `Spring Data 2026.0.0-RC1`: Yüksek öncelik. Özellikle relational upsert, Redis pub/sub ve cache reset davranışları kullanan ekipler için.
- `spring-ai-session-jdbc` ve Session API ekosistemi: Orta-yüksek öncelik. Agentic uygulama geliştiren ekipler için mimari yön belirleyici.
- `Spring Vault 4.1.0-RC1`: Düşük öncelik. [Resmi duyuru](https://spring.io/blog/2026/04/20/spring-vault-4-0-rc1-4-0-2-released/) yeni davranışları detaylandırmıyor; yalnızca changelog'a işaret ediyor. Vault kullanan ekipler için izlenmeli, ama bugün için ana gündem değil.
- Yeni bağımsız OSS araç tarafında bugün Spring/JVM ekiplerinin yol haritasını değiştirecek kadar güçlü ikinci bir sinyal yok. Gunnar Morling ve Baeldung tarafı daha çok öğretici/izleme değeri taşıyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Boot tabanlı operasyonlarda SSL bundle kullanan Elasticsearch ve Cassandra bağlantıları yeniden doğrulanmalı. "TLS açık" ile "sunucu kimliği doğrulanıyor" aynı şey değil.
- `${random.value}` benzeri convenience property'ler secret kaynağı olarak kullanılmamalı. Uygulama içi rastgelelik ile güvenlik amaçlı secret üretimi aynı problem değil.
- Spring AI ile user-supplied PDF işleniyorsa boyut limiti, parser isolation, timeout ve bellek baskısı testleri eklenmeli.
- Spring Data RC1'deki `RedisCache.resetCaches()` optimizasyonu yalnızca Redis instance'ı gerçekten sadece cache için ayrılmışsa güvenli kabul edilmeli.
- Yeni agentic servisler geliştiriliyorsa `ChatMemory` etrafında daha fazla yatırım yapmak yerine event-sourced ve turn-safe memory yaklaşımına yakın tasarım tercih edilmeli.
- JDK 27 geçişi planlanıyorsa `finalize()` override eden internal helper sınıflar ve locale snapshot testleri şimdiden taranmalı.

## Fırsatlar ve Riskler

- Fırsat: Spring Data relational upsert, veritabanı vendor'ına özel DAO dallanmalarını azaltabilir.
- Fırsat: Session API yaklaşımı, çok ajanlı akışlarda daha denetlenebilir ve auditable memory davranışı sağlayabilir.
- Fırsat: CPU patch ritmini otomasyona bağlayan ekipler, güvenlik update'lerini daha öngörülebilir hale getirebilir.
- Risk: Boot advisory'leri "konfigürasyon zaten doğru sanılıyordu" sınıfında olduğu için görünmezce prod'a taşınabilir.
- Risk: `RedisCache.resetCaches()` yanlış yerde kullanılırsa paylaşımlı Redis üzerinde beklenmeyen veri temizliği yaratabilir.
- Risk: Spring AI ingestion katmanındaki açıklar, RAG ve internal assistant projelerinde klasik web güvenliği kadar ciddi hale geliyor.
- Risk: JDK 27 ile `finalize()` ve locale resource değişiklikleri, testte görünmeyen ama prod'da açılan davranış farkları doğurabilir.

## İzlenmesi Gereken Konular

- Spring Boot'un April 23, 2026 advisory seti için hangi patch/hotfix kombinasyonlarının önerildiği.
- Spring AI 2.1 yol haritasında `ChatMemory` deprecation ifadesinin ne zaman resmileşeceği.
- Spring Data `2026.0` final sürümünün Mayıs 2026 içinde hangi Boot 4.1 kombinasyonuyla geleceği.
- JDK 27 EA ile framework ve kütüphane maintainer'larının paylaşacağı ilk uyumluluk raporları.
- Spring Vault `4.1.0-RC1` changelog'unda secret rotation ve certificate lifecycle tarafında öne çıkan değişiklikler.
- Baeldung, Josh Long, Gunnar Morling ve Burak KUTBAY tarafında bugün kritik yeni release yok; ama bu kanallar operational follow-up ve pratik örnekler için izlenmeye devam etmeli.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot advisory seti, güvenliği business logic'ten çok config sözleşmelerine taşıyor
- source: [Spring Security Advisories](https://spring.io/security/)
- author: belirtilmemiş
- date: 23 Nisan 2026
- category: security, configuration-hardening
- tags: spring-boot, ssl-bundle, hostname-verification, devtools, applicationtemp, random-value
- summary: Spring Boot tarafında SSL bundle ile hostname verification eksikliği, DevTools remote secret timing attack, tahmin edilebilir temp directory ve zayıf PRNG kaynaklı yanlış secret kullanımı gibi birbiriyle ilişkili advisory'ler yayımlandı.
- why_it_matters: Sorunlar çoğunlukla uygulama kodunda değil, framework convenience davranışında ortaya çıkıyor; bu yüzden görünmezce prod'a taşınmaları kolay.
- java_spring_relevance: Spring Boot üzerinde Elasticsearch, Cassandra, DevTools veya `${random.*}` kullanan ekipleri doğrudan etkiliyor.
- actionability: hemen_env_gözden_geçir_ve_patch_planla
- impact_level: çok_yüksek
- opportunities: Config hardening checklist, TLS doğrulama testleri ve secret yönetimi standartlarını kurumsallaştırmak.
- risks: MITM, local privilege abuse, secret sızıntısı ve yanlış güvenlik varsayımları.
- migration_notes: Advisory bazında önerilen patch seviyeleri uygulanmalı; `${random.value}` secret yerine gerçek secret manager veya güvenli üretim yolu kullanılmalı.

### Bulgu 2

- title: Spring Framework 6.2.18 ve 7.0.7, web katmanında CVE kapatırken eski hatlar için OSS desteği sonlandırıyor
- source: [Spring Framework 6.2.18 and 7.0.7 Available Now](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/)
- author: Stéphane Nicoll
- date: 17 Nisan 2026
- category: framework-security, web
- tags: spring-framework, spring-mvc, webflux, dos, cache-poisoning, support-policy
- summary: `6.2.18` ve `7.0.7`; WebFlux multipart temp file DoS, static resource cache poisoning ve Windows static resource DoS açıklarını kapatıyor. Aynı duyuru `5.3.x` ve `6.1.x` için OSS desteğin bittiğini de teyit ediyor.
- why_it_matters: Web katmanı açığı ile support lifecycle kararı aynı anda geliyor; yalnızca patch değil, hat değişimi gerekebilir.
- java_spring_relevance: Spring MVC veya WebFlux kullanan neredeyse tüm ekipler için üretim etkili.
- actionability: desteklenen_hatta_hizli_gecis_ve_web_regression_test
- impact_level: çok_yüksek
- opportunities: Web edge-case testlerini, özellikle multipart ve static resource senaryolarını güçlendirmek.
- risks: Disk tüketimi, kaynak cache bozulması, Windows platformunda bağlantı tüketimi ve artık patch alamayan hatlarda kalıcı risk birikimi.
- migration_notes: Boot `3.5.14` ve `4.0.6` eşleşmeleri dikkate alınmalı; `5.3.x` ve `6.1.x` kullanıcıları açık kaynak tarafında daha fazla beklememeli.

### Bulgu 3

- title: Spring AI tarafında parser ve vector store güvenliği birinci sınıf risk haline geliyor
- source: [Spring Security Advisories](https://spring.io/security/)
- author: belirtilmemiş
- date: 27 Nisan 2026
- category: ai-security
- tags: spring-ai, pdf, vector-store, spel, ssrf, rag
- summary: 27 Nisan 2026'da attacker-controlled PDF ile OOM advisory'si listeleniyor; aynı advisory akışı kısa süre önce Spring AI için kritik SpEL injection ve SSRF başlıkları da barındırıyordu.
- why_it_matters: AI entegrasyonlarında tehlike yalnızca model cevabı değil; ingest, filter ve media fetch adımları da saldırı yüzeyi.
- java_spring_relevance: Spring AI ile RAG, dosya işleme, vector store ve external model proxy entegrasyonu yapan ekipler için doğrudan ilgili.
- actionability: ai_pipeline_hardening_ve_patch_eslestirme
- impact_level: yüksek
- opportunities: Belge işleme ve vector query katmanını sandbox, allowlist ve resource limit ile yeniden tasarlamak.
- risks: OOM, SSRF, olası kod çalıştırma ve data exfiltration.
- migration_notes: Advisory bazlı fix sürümleri eşleştirilmeli; user-supplied belge işleme ve vector filter kullanımında geçici korumalar hemen eklenmeli.

### Bulgu 4

- title: Spring Data 2026.0.0-RC1, relational upsert ve Redis semantiğiyle gerçek üretim etkisi taşıyor
- source: [Spring Data 2026.0.0-RC1 enters release candidate phase](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/)
- author: Mark Paluch
- date: 17 Nisan 2026
- category: data, cache, release-candidate
- tags: spring-data, upsert, redis, relational, pubsub, cache
- summary: RC1; relational template API'de `MERGE` veya `INSERT ... ON CONFLICT ... DO UPDATE` tabanlı upsert, `RedisMessageSendingTemplate` ve `RedisCache.resetCaches()` optimizasyonu getiriyor.
- why_it_matters: Bunlar yalnızca API konforu değil; veri yazma, event yayma ve cache temizleme davranışını sadeleştiriyor ve bazı yerlerde değiştiriyor.
- java_spring_relevance: Spring Data Redis, Relational/JDBC/R2DBC ve event-driven cache desenleri kullanan ekipler için güçlü sinyal.
- actionability: pilot_ve_davranis_testi
- impact_level: yüksek
- opportunities: Vendor-specific upsert kodunu azaltmak, Redis pub/sub ile messaging modelini sadeleştirmek, toplu cache reset maliyetini düşürmek.
- risks: `FLUSHDB` optimizasyonunun paylaşımlı Redis kullanımında yanlış varsayılması, upsert davranışının mevcut conflict stratejileriyle çakışması.
- migration_notes: RC sürüm olarak ele alınmalı; özellikle Redis instance ayrımı ve SQL dialect davranışı test edilmeden geniş rollout yapılmamalı.

### Bulgu 5

- title: Spring AI Session API, `ChatMemory` sonrası dönemin taslak mimarisini gösteriyor
- source: [Spring AI Agentic Patterns (Part 7): Session API](https://spring.io/blog/2026/04/15/spring-ai-session-management/)
- author: Christian Tzolov
- date: 15 Nisan 2026
- category: architecture, ai-platform
- tags: spring-ai, session-api, event-sourcing, memory, multi-agent, jdbc
- summary: Session API; turn-safe compaction, event-sourced kısa dönem bellek, branch isolation ve recall storage yaklaşımı sunuyor. Yazı, çözümün `spring-ai-community` içinde inkübe edildiğini ve Spring AI `2.1` hedefiyle `ChatMemory` yerine geçmesinin planlandığını söylüyor.
- why_it_matters: Agent memory katmanı, kısa vadede önemli tasarım kararlarından biri olacak; bugün seçilen abstraction yarın migration maliyeti doğurabilir.
- java_spring_relevance: Internal assistant, workflow agent veya tool-calling servisleri geliştiren Spring ekipleri için doğrudan ilgili.
- actionability: yeni_gelisimleri_buna_gore_tasarla_mevcutleri_izle
- impact_level: orta-yüksek
- opportunities: Denetlenebilir memory lifecycle, daha güvenli context compaction ve çok ajanlı iş akışlarında daha temiz ayrım.
- risks: Henüz community incubation aşamasında; API ve davranış yüzeyi değişebilir.
- migration_notes: Yeni projelerde flat message eviction varsayımlarını azaltmak mantıklı; mevcut `ChatMemory` tabanlı akışlar için doğrudan göç değil, mimari hazırlık önerilir.

### Bulgu 6

- title: April 2026 Java CPU ve JDK 27 heads-up'ları, platform yükseltmesini feature değil uyumluluk işi haline getiriyor
- source: [Oracle Critical Patch Update (CPU) April 2026 for Oracle Java SE](https://docs.oracle.com/en-us/iaas/releasenotes/java-management/jdk_cpu_april_2026.htm), [JDK 27 Early-Access Release Notes](https://jdk.java.net/27/release-notes), [Inside Java Quality Outreach](https://inside.java/2026/04/21/quality-heads-up/)
- author: Oracle Java Management, OpenJDK, David Delabassee
- date: 21 Nisan 2026
- category: jdk, security, compatibility
- tags: jdk, cpu, jdk27, finalize, locale, upgrade
- summary: Oracle CPU ile `26.0.1`, `25.0.3`, `21.0.11`, `17.0.19`, `11.0.31`, `8u491` yayımlandı. JDK 27 tarafında `ThreadPoolExecutor.finalize()` kaldırılıyor ve bakımı yapılmayan locale resource'ları temizleniyor.
- why_it_matters: Bunlar büyük manşet feature değil, ama upgrade sırasında sessiz kırılma yaratan tipik başlıklar.
- java_spring_relevance: JVM üzerinde çalışan tüm Spring servisleri etkilenir; özellikle eski kütüphaneler ve locale'e duyarlı testler riskli.
- actionability: cpu_patchle_ve_jdk27_smoke_test_hazirla
- impact_level: yüksek
- opportunities: Quarterly patching disiplinini standartlaştırmak ve JDK yükseltmelerini daha küçük dilimlerle yönetmek.
- risks: Custom executor kalıntıları, locale-dependent snapshot bozulmaları ve eski bağımlılıkların JDK 27 ile derleme/çalışma sorunları.
- migration_notes: `finalize()` override kullanan internal kod taranmalı; locale regression testleri ve JDK 27 EA smoke testleri backlog'a alınmalı.

### Bulgu 7

- title: Spring Vault 4.1.0-RC1 yayımlandı, fakat resmi duyuru bugün için yüksek sinyal değişiklik sunmuyor
- source: [Spring Vault 4.1.0-RC1 and 4.0.2 released](https://spring.io/blog/2026/04/20/spring-vault-4-0-rc1-4-0-2-released/)
- author: Mark Paluch
- date: 20 Nisan 2026
- category: security, secrets, release-candidate
- tags: spring-vault, hashicorp-vault, secrets, certificate-rotation
- summary: Resmi duyuru yalnızca `4.1.0-RC1` ve `4.0.2` yayınlarını ve changelog bağlantısını veriyor; önemli davranış değişiklikleri blog post içinde özetlenmiyor.
- why_it_matters: Vault kullanan ekipler için sürüm hareketi var, ancak bugünün yüksek öncelikli kararları için yeterli sinyal henüz burada değil.
- java_spring_relevance: HashiCorp Vault ile secret management veya certificate lifecycle kullanan Spring ekipleri için izlenmeye değer.
- actionability: changelog_okuyup_izle
- impact_level: düşük
- opportunities: RC changelog'u erken okuyarak secret rotation/certificate yönetimi tarafında GA öncesi doğrulama yapmak.
- risks: Blog postun kısa olması nedeniyle önemli değişikliklerin gözden kaçması.
- migration_notes: Doğrudan rollout yerine changelog review ve mevcut Vault akışlarıyla laboratuvar testi önerilir.

## Sonuç

28 Nisan 2026 itibarıyla en güçlü mühendislik sonucu şu: Java/Spring ekipleri için bugünün esas işi yeni bir "parlak framework" seçmek değil, güvenlik ve davranış sözleşmelerini yeniden doğrulamak. Spring Boot advisory'leri konfigürasyon katmanını, Spring Framework yayınları web edge-case'lerini, Spring AI advisories ise ingest ve vector store yüzeyini öne çekiyor.

Kısa vadede en yüksek getirili aksiyonlar; Spring Boot/Spring Framework patch planını hızlandırmak, Spring AI kullanan akışlara resource ve input hardening eklemek, Redis/cache davranış değişimlerini kontrollü pilotlamak ve JDK 27 için küçük ama kırıcı uyumluluk başlıklarını erkenden test etmektir. Bugünün kalıcı değeri, feature heyecanından çok platform hijyeninde yatıyor.
