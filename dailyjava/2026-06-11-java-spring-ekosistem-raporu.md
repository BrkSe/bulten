# Günlük Java / Spring Ekosistem Raporu

Tarih: 11 Haziran 2026  
Tarama zamanı: 11 Haziran 2026 09:03 TSİ  
Odak: Spring Boot `4.1.0` GA ile release-train hizalanması, altyapı default'larında güvenlik sertleşmesi ve eski OSS hatlarında destek baskısı

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security/), [Spring Boot 4.1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes), ilgili GitHub release notları, [Inside Java](https://inside.java/), [dev.java](https://dev.java/news/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java/Spring](https://www.infoq.com/java/), [Baeldung Java Weekly](https://www.baeldung.com/java-weekly-649), [Josh Long'un 9 Haziran 2026 tarihli haftalık özeti](https://spring.io/blog/2026/06/09/this-week-in-spring-june-9-2026), [Gunnar Morling'in blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY'ın blogu](https://blog.burakkutbay.com/) tarandı. 11 Haziran sabahı itibarıyla karar etkisi en yüksek sinyal resmi Spring release-train duyurularında toplandı. Gunnar Morling ve Burak KUTBAY tarafında bugünü yönlendirecek yeni günlük bir release sinyali görünmedi; Baeldung ve InfoQ ise ağırlıklı olarak ikincil bağlam sağladı.

## Öne Çıkan Başlıklar

- [Spring Boot `4.1.0`](https://spring.io/blog/2026/06/10/spring-boot-4) GA oldu. gRPC desteği, `InetAddressFilter` ile SSRF sertleşmesi, `@Async` context propagation, OpenTelemetry iyileştirmeleri, RabbitMQ Streams SSL, `spring.datasource.connection-fetch=lazy`, `@RedisListener` auto-configuration ve Mongo tabanlı Spring Batch metadata desteği günün en güçlü yeni platform sinyali.
- [Spring Boot `3.5.15`](https://spring.io/blog/2026/06/10/spring-boot-3-5-15-available-now) ve [`4.0.7`](https://spring.io/blog/2026/06/10/spring-boot-4-0-7-available-now) iki CVE kapattı: mail auto-configuration altında SSL hostname verification eksiği ve embedded Artemis için öngörülebilir temp directory sorunu.
- [Spring for GraphQL `1.4.6` ve `2.0.4`](https://spring.io/blog/2026/06/10/spring-for-graphql-1-4-6-and-2-0-4-released) üç adet "High" seviye CVE kapattı. `1.4.6`, `1.4.x` hattının son OSS sürümü.
- [Spring Batch `6.0.4` ve `5.2.6`](https://spring.io/blog/2026/06/10/spring-batch-6-0-4-and-5-2-6-available-now) yayımlandı. `5.2.6`, büyük olasılıkla `5.2.x` hattının son OSS release'i ve bu başlık göç baskısını artırıyor.
- [Spring Integration `7.1.0`](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released) ve [Spring gRPC `1.1.0`](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now) birlikte okunduğunda, Boot `4.1` etrafında yeni bir entegrasyon standardizasyonu oluşuyor.
- [Spring Vault `4.1`](https://spring.io/blog/2026/06/10/spring-vault-4-1-available) secret rotation ve certificate lifecycle işlerini uygulama kodundan platform katmanına taşıyabilecek yeni API'ler getiriyor.
- [Inside Java'nın 11 Haziran tarihli ZGC yazısı](https://inside.java/2026/06/11/thesis-simplify-weak-reference-processing-zgc/) bugün için doğrudan release haberi değil; ancak `WeakReference` yoğun iş yüklerinde gelecekte GC maliyetini düşürmeye dönük güçlü bir araştırma sinyali veriyor.

## Kritik Güncellemeler

### 1. Spring Boot 4.1 artık "küçük bir minor" değil, uygulama iskeletini yeniden tanımlayan bir platform release'i

[Spring Boot 4.1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) şu başlıkları aynı pakette getiriyor:

- gRPC server/client yazımı ve testleri için birinci sınıf destek
- `InetAddressFilter` ile outgoing HTTP çağrılarında SSRF sertleşmesi
- `@Async` için context propagation ve OpenTelemetry tarafında daha ayrıntılı SDK/limit/sampler kontrolü
- RabbitMQ Streams için SSL ve Testcontainers/Docker Compose service connection desteği
- `spring.datasource.connection-fetch=lazy` ile fiziksel JDBC connection alma zamanını geciktirme
- `@RedisListener` auto-configuration ve Mongo tabanlı Spring Batch metadata starter'ı
- Log4j için dahili file rotation stratejileri

Asıl kritik kısım yalnızca yeni feature listesi değil. Aynı release, Boot `4.0`'ta deprecated olan API'leri siliyor, Apache Derby desteğini deprecate ediyor, layertools jar mode'u kaldırıyor, `-DskipTests` ile AOT test atlama davranışını değiştiriyor ve jOOQ destek hattını `3.20` seviyesine çekerek Java 21 gereksinimini fiilen öne çıkarıyor.

Bu neden kritik:

- Boot `4.1`, feature kazanımı kadar build pipeline ve upgrade davranışı da değiştiriyor.
- Platform ekipleri için "gRPC, OTel, SSRF, Rabbit Streams, lazy JDBC" artık ayrı starter/örnek çözümler yerine ana platform seviyesinde yönetilebilir hale geliyor.
- Özellikle jOOQ kullanan ekiplerde Boot `4.1` kararı, yalnız framework upgrade değil JDK planını da etkileyebilir.

### 2. Boot `3.5.15` ve `4.0.7`, eski hatlarda kalacak ekipler için beklenmeyecek kadar önemli bakım sürümleri

Her iki sürüm de şu iki güvenlik açığını kapatıyor:

- [CVE-2026-40992](https://spring.io/security/cve-2026-40992/): Mail auto-configuration SSL hostname verification açığı
- [CVE-2026-41001](https://spring.io/security/cve-2026-41001/): Embedded Artemis için öngörülebilir temp directory

Ek olarak release body'lerinde şu satırlar üretim açısından anlamlı:

- GraphQL WebSocket allowed origins konfigürasyon düzeltmesi
- `spring.rabbitmq.ssl.bundle` boş override durumunda yanlış SSL enable davranışının düzeltilmesi
- Spring Boot Loader için RSA ve EC signed JAR desteği
- Meter registry cleanup ve Docker Compose hata loglarının daha iyi yüzeye çıkarılması

Bu neden kritik:

- Boot `4.1`e hemen geçmeyecek ekipler için bugün gerçek güvenlik hattı `3.5.15` ve `4.0.7`.
- Mail, Artemis, GraphQL WebSocket ve signed JAR gibi konular çoğu kurumda "yan özellik" gibi görünür ama doğrudan üretim davranışı değiştirir.

### 3. Spring GraphQL tarafında artık mesele yalnız feature değil, destekli hatta dönme zorunluluğu

[Spring for GraphQL `1.4.6` ve `2.0.4`](https://spring.io/blog/2026/06/10/spring-for-graphql-1-4-6-and-2-0-4-released) üç "High" seviye CVE kapatıyor:

- `CVE-2026-41699`: Unsafe Deserialization in Spring GraphQL
- `CVE-2026-41700`: Cross-Site WebSocket Hijacking in Spring for GraphQL
- `CVE-2026-41856`: Spring GraphQL Annotation Detection Vulnerability

GitHub release notlarında ek olarak şu operasyonel düzeltmeler var:

- WebFlux WebSocket tarafında client disconnect sonrası memory leak düzeltmesi
- Idle concurrent session'larda keepalive ping düzeltmesi
- Observation kapanmama sorunu ve handler interface annotation bug'ları

En önemli satır: `1.4.6`, `1.4.x` hattının son OSS release'i.

Bu neden kritik:

- GraphQL kullanan ekipler için bu artık yalnız CVE patch'i değil, support line kararı.
- WebSocket kullanan GraphQL servislerinde güvenlik ve memory davranışı aynı gün etkileniyor.

### 4. Spring Batch ve Spring Vault başlıkları, "arka ofis" bileşenlerinin yine yol haritası etkisi taşıdığını gösteriyor

[Spring Batch `6.0.4` ve `5.2.6`](https://spring.io/blog/2026/06/10/spring-batch-6-0-4-and-5-2-6-available-now) bakım sürümleri görünse de iki net mesaj veriyor:

- `5.2.6` büyük olasılıkla son OSS `5.2.x` sürümü
- `6.0.4`, Spring Boot `4.0.7`; `5.2.6`, Spring Boot `3.5.15` ile hizalanıyor

GitHub release notlarında Mongo DAO performans iyileştirmeleri, `SimpleJobRepository.update(StepExecution)` performans çalışmaları ve transaction/skip policy düzeltmeleri var. Buna ek olarak Boot `4.1`, MongoDB destekli Batch metadata için yeni `spring-boot-batch-data-mongo` starter'ı getiriyor.

[Spring Vault `4.1`](https://spring.io/blog/2026/06/10/spring-vault-4-1-available) ise:

- `ManagedSecret` API
- managed certificate issuance/rotation
- `VaultClient` abstraction
- Vault `2.0.0` ile build
- KV version detection

başlıklarıyla secrets management işini operasyonel bir primitive haline getiriyor.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring Boot 4.1 yeni "yakınsama hattı" oldu

Boot `4.1` release notes aynı anda şu bağımlılıkları yeni ana hatta taşıyor:

- Spring GraphQL `2.0.4`
- Spring gRPC `1.1.0`
- Spring Integration `7.1.0`
- Spring Security `7.1.0`
- Spring Data `2026.0.0`
- Spring AMQP `4.1.0`
- Spring Kafka `4.1.0`
- Spring Session `4.1.0`

Çıkarım: Kurumsal ekipler için artık yalnız "Boot upgrade" değil, tüm kenar protokollerini ve observability katmanını birlikte standardize etme penceresi açılmış durumda.

### Trend Kümesi 2: Güvenlik sertleşmesi giderek uygulama kodundan framework default'larına kayıyor

Tekrarlayan desenler:

- Mail client hostname verification
- outgoing HTTP SSRF koruması
- GraphQL WebSocket origin ve hijacking yüzeyi
- RabbitMQ Streams SSL ve `rabbitmq.ssl.bundle` davranışı
- signed JAR loader desteği

Çıkarım: 2026 Spring hattında güvenlik artık yalnız `spring-security` bağımlılığına indirgenemiyor; framework auto-configuration default'ları doğrudan threat model parçası.

### Trend Kümesi 3: OSS support line baskısı görünür hale geldi

Bugün en net örnekler:

- Spring GraphQL `1.4.6` son OSS `1.4.x`
- Spring Batch `5.2.6` muhtemelen son OSS `5.2.x`

Çıkarım: "Patch alırız, major/minor upgrade sonra" yaklaşımı giderek pahalılaşıyor. Release-train dışında kalmak artık sadece feature geriliği değil, bakım hattı riski.

### Trend Kümesi 4: JVM tarafında en değerli sinyal yine doğrudan ürüne değil, runtime verimliliğine bakıyor

[Inside Java'nın ZGC yazısı](https://inside.java/2026/06/11/thesis-simplify-weak-reference-processing-zgc/) queue'suz `WeakReference` işleme maliyetini azaltmaya dönük mekanizmalar tartışıyor. Bu bugün production'a alınacak bir özellik değil; ancak cache, interning ve listener registration gibi `WeakReference` kullanan kodların GC maliyeti artık daha görünür bir optimizasyon alanı.

### Hype mı, kalıcı mı?

- Kalıcı mühendislik değeri çok yüksek: Spring Boot `4.1`, Boot `3.5.15`/`4.0.7` patch'leri, Spring GraphQL güvenlik güncellemesi, Batch/Vault support-line sinyali
- Hedefli ama kalıcı değer: Spring Integration `7.1.0`, Spring gRPC `1.1.0`
- İzlemelik ama bugün için düşük öncelik: ZGC weak-reference processing araştırması

## Araçlar ve Kütüphaneler

- [Spring Boot `4.1.0`](https://spring.io/blog/2026/06/10/spring-boot-4): gRPC, SSRF mitigation, OTel, lazy JDBC ve RabbitMQ Streams SSL ile günün ana platform release'i.
- [Spring Boot `3.5.15`](https://spring.io/blog/2026/06/10/spring-boot-3-5-15-available-now) / [`4.0.7`](https://spring.io/blog/2026/06/10/spring-boot-4-0-7-available-now): geçiş yapmayacak ekipler için zorunlu patch seviyesi.
- [Spring for GraphQL `1.4.6` / `2.0.4`](https://spring.io/blog/2026/06/10/spring-for-graphql-1-4-6-and-2-0-4-released): GraphQL kullanan ekiplerde acil patch.
- [Spring Integration `7.1.0`](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released): lock registry ve file-output güvenliği dahil önemli düzeltmeler.
- [Spring gRPC `1.1.0`](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now): Boot `4.1` auto-configuration hattına geçiş için referans sürüm.
- [Spring Batch `6.0.4` / `5.2.6`](https://spring.io/blog/2026/06/10/spring-batch-6-0-4-and-5-2-6-available-now): batch iş yüklerinde göç kararı gerektiren bakım release'i.
- [Spring Vault `4.1`](https://spring.io/blog/2026/06/10/spring-vault-4-1-available): secret ve sertifika yaşam döngüsü için dikkat çekici yeni API yüzeyi.
- [ZGC weak reference processing araştırması](https://inside.java/2026/06/11/thesis-simplify-weak-reference-processing-zgc/): ürün değil, fakat gelecekteki JVM tuning yönünü göstermesi açısından izlemelik.

## Java / Spring Geliştiricileri İçin Etkiler

- Boot `4.1` hedefleyen ekipler upgrade checklist'ine yalnız bağımlılık sürümlerini değil; kaldırılan deprecated API'leri, layertools değişimini, AOT test davranışını ve jOOQ/Java 21 etkisini de eklemeli.
- GraphQL kullanan ekipler patch'i yalnız dependency bump olarak görmemeli; WebSocket origin kuralları, session keepalive davranışı ve memory leak regression testi de yapmalı.
- Batch kullanan ekipler `5.2.x` üzerinde kalmanın artık geçici bir karar olduğunu kabul etmeli. Özellikle yeni iş akışları için `6.0.x` ve Boot `4.x` kombinasyonu planlanmalı.
- Secret rotation, certificate issuance ve Vault integration'ı için özel wrapper yazan ekipler, Spring Vault `4.1` ile bu yükün bir kısmını platform katmanına taşıyabilir.
- Event-driven ve integration-heavy servislerde Boot `4.1` + Spring Integration `7.1` + Spring gRPC `1.1` birleşimi, custom wiring maliyetini düşürebilir.

## Fırsatlar ve Riskler

- Fırsat: Boot `4.1` ile gRPC, observability, SSRF mitigation ve RabbitMQ Streams SSL gibi yatay ihtiyaçları standartlaştırmak
- Fırsat: `spring.datasource.connection-fetch=lazy` ile her request'te DB connection almayan servislerde kaynak verimliliği kazanmak
- Fırsat: Spring Vault `4.1` ile secret rotation ve sertifika yaşam döngüsünü uygulama kodundan çıkarmak
- Fırsat: Batch metadata için MongoDB kullanan mimarilerde yeni Boot starter ile operasyonu sadeleştirmek
- Risk: GraphQL `1.4.x` hattında kalıp son OSS sürüm uyarısını görmezden gelmek
- Risk: Boot `4.1`e geçerken jOOQ/Java 21 gereksinimini son dakikada fark etmek
- Risk: `-DskipTests` davranış değişimi nedeniyle CI pipeline'larında beklenmeyen AOT/test süresi sapmaları yaşamak
- Risk: Batch `5.2.x` ve diğer son-OSS hatlarda uzun süre kalıp ticari destek veya hızlı göç gerektiren bir sıkışma yaratmak

## İzlenmesi Gereken Konular

- Spring Boot `4.1.x` hattında ilk follow-up patch'lerin özellikle gRPC ve OTel tarafında ne kadar hızlı geldiği
- Spring GraphQL `2.0.x` hattında bugünkü CVE seti sonrası ek hardening veya migration rehberi gelip gelmeyeceği
- Spring Batch `6.0.x` tarafında Mongo metadata kullanımının saha geri bildirimleri
- Spring Vault `4.1` için `ManagedSecret` ve certificate rotation API'lerinin operasyonel örneklerinin çoğalıp çoğalmayacağı
- Spring Integration `7.1.x` içinde Redis/JDBC lock registry düzeltmelerinin dağıtık scheduler ve leader election kullanan ekiplerde nasıl karşılık bulduğu
- ZGC weak-reference işleme çalışmalarının JDK issue/JEP seviyesine taşıyınıp taşınmadığı

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot `4.1.0`, uygulama platformunun güvenlik, observability ve protokol katmanını birlikte yükselten bir birleşik release oldu
- source: [Spring Boot 4.1.0 available now](https://spring.io/blog/2026/06/10/spring-boot-4), [Spring Boot 4.1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes)
- author: Andy Wilkinson; Spring Boot Team
- date: 10 Haziran 2026
- category: platform, observability, security, developer-productivity
- tags: spring-boot-4.1, grpc, inetaddressfilter, opentelemetry, rabbitmq-streams, lazy-jdbc, redis-listener
- summary: Boot `4.1`, gRPC desteği, SSRF mitigation, OpenTelemetry iyileştirmeleri, lazy JDBC connection fetching, RabbitMQ Streams SSL, Mongo tabanlı Batch starter ve Redis listener auto-config ile ana platform hattını genişletti.
- why_it_matters: Bu release yalnız yeni starter eklemiyor; framework default'larını ve build davranışını da değiştiriyor.
- java_spring_relevance: Spring Boot tabanlı yeni servisler ve platform standardizasyonu yapan ekipler için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: çok-yüksek
- opportunities: Custom gRPC/OTel/SSRF wiring'ini sadeleştirmek; platform standartlarını ortaklaştırmak.
- risks: Deprecated API silinmeleri, jOOQ/Java 21 etkisi ve CI/AOT davranış değişimlerini geç fark etmek.
- migration_notes: `4.0` deprecated API'leri kaldırıldı; Derby desteği deprecate edildi; layertools jar mode kaldırıldı; `-DskipTests` artık AOT testlerini atlatmıyor; jOOQ desteği Java 21 gerektiren `3.20` seviyesine geldi.

### Bulgu 2

- title: Spring Boot `3.5.15` ve `4.0.7`, geçiş yapmayacak ekipler için gerçek patch tabanı haline geldi
- source: [Spring Boot 3.5.15 available now](https://spring.io/blog/2026/06/10/spring-boot-3-5-15-available-now), [Spring Boot 4.0.7 available now](https://spring.io/blog/2026/06/10/spring-boot-4-0-7-available-now), [CVE-2026-40992](https://spring.io/security/cve-2026-40992/), [CVE-2026-41001](https://spring.io/security/cve-2026-41001/)
- author: Andy Wilkinson
- date: 10 Haziran 2026
- category: maintenance, security, operations
- tags: spring-boot-3.5.15, spring-boot-4.0.7, mail, ssl, artemis, graphql-websocket
- summary: Her iki bakım sürümü mail SSL hostname verification ve Artemis temp directory güvenlik açıklarını kapatırken, GraphQL WebSocket origin ayarları, signed JAR loader ve SSL bundle davranışlarında da önemli düzeltmeler taşıyor.
- why_it_matters: Hemen Boot `4.1`e gitmeyecek ekipler için bu sürümler güvenlik ve operasyon doğrultusunda minimum güvenli tabanı temsil ediyor.
- java_spring_relevance: LTS benzeri kararlılık arayan Boot `3.5` ve `4.0` kullanıcıları için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Upgrade'i küçük tutup kritik açıkları kapatmak; signed JAR ve WebSocket davranışlarını düzeltmek.
- risks: Mail/Artemis açıklarını ertelemek; Boot major upgrade'i beklerken prod riskini açık bırakmak.
- migration_notes: Mail ve messaging kullanan servislerde smoke test yapılmalı; GraphQL WebSocket ve SSL bundle konfigürasyonları yeniden doğrulanmalı.

### Bulgu 3

- title: Spring for GraphQL `1.4.6` ve `2.0.4`, güvenlik kapatmasıyla birlikte support-line kararını öne çekti
- source: [Spring for GraphQL 1.4.6 and 2.0.4 released](https://spring.io/blog/2026/06/10/spring-for-graphql-1-4-6-and-2-0-4-released), [Spring GraphQL v2.0.4](https://github.com/spring-projects/spring-graphql/releases/tag/v2.0.4), [Spring GraphQL v1.4.6](https://github.com/spring-projects/spring-graphql/releases/tag/v1.4.6)
- author: Brian Clozel
- date: 10 Haziran 2026
- category: security, graphql, websocket
- tags: spring-graphql, websocket, high-cve, memory-leak, keepalive, oss-support
- summary: Üç yüksek seviye CVE kapatıldı; release notları aynı zamanda WebSocket memory leak, keepalive ve observation sorunlarını düzeltiyor. `1.4.6`, `1.4.x` hattının son OSS sürümü.
- why_it_matters: GraphQL kullanan ekipler için bugünkü iş yalnız patch almak değil, hangi support hattında kalacaklarını seçmek.
- java_spring_relevance: GraphQL HTTP/WebSocket endpoint'leri olan Spring uygulamaları için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: `2.0.x` hattına geçip Boot `4.1` ile hizalanmak; WebSocket davranışını stabil hale getirmek.
- risks: `1.4.x`te takılı kalmak; WebSocket origin/keepalive regresyonlarını test etmeden deploy etmek.
- migration_notes: `1.4.x` kullanıcıları için `1.4.6` son OSS durak olabilir; `2.0.x` ve Boot `4.1` kombinasyonu orta vadeli hedef olmalı.

### Bulgu 4

- title: Spring Batch `6.0.4` ve `5.2.6`, batch iş yüklerinde "bakım sürümü" değil göç sinyali üretti
- source: [Spring Batch 6.0.4 and 5.2.6 available now](https://spring.io/blog/2026/06/10/spring-batch-6-0-4-and-5-2-6-available-now), [Spring Batch v6.0.4](https://github.com/spring-projects/spring-batch/releases/tag/v6.0.4), [Spring Boot 4.1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes)
- author: Mahmoud Ben Hassine; Spring Boot Team
- date: 10 Haziran 2026
- category: batch, migration, data-access
- tags: spring-batch, boot-4.1, mongo, oss-support, job-repository
- summary: `5.2.6` büyük olasılıkla son OSS `5.2.x` sürümü. `6.0.4` performans ve transaction davranışında düzeltmeler getirirken, Boot `4.1` Mongo tabanlı Batch metadata starter'ı ile yeni bir çalışma modeli açıyor.
- why_it_matters: Batch altyapıları çoğu kurumda upgrade'i geciken ama kritik iş yükleridir; support line değişimi burada roadmap etkisi yaratır.
- java_spring_relevance: Spring Batch kullanan finansal, entegrasyon ve arka-ofis sistemleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Mongo metadata ile operasyonu sadeleştirmek; `6.0.x`e geçerken performans kazanmak.
- risks: `5.2.x` üzerinde uzun süre kalmak; göçü son OSS sürüm sonrası aceleye getirmek.
- migration_notes: Yeni geliştirmelerde `6.0.x` + Boot `4.x` düşünülmeli; Mongo repository, transaction ve skip policy davranışları regression test'e alınmalı.

### Bulgu 5

- title: Spring Integration `7.1.0` ve Spring gRPC `1.1.0`, Boot `4.1` etrafında entegrasyon yığınının yeni standardını şekillendiriyor
- source: [Spring Integration 7.1.0 Available](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released), [Spring Integration v7.1.0](https://github.com/spring-projects/spring-integration/releases/tag/v7.1.0), [Spring gRPC 1.1.0 available now](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now), [Spring gRPC v1.1.0](https://github.com/spring-projects/spring-grpc/releases/tag/v1.1.0)
- author: Glenn Renfro; Dave Syer
- date: 10 Haziran 2026
- category: integration, messaging, rpc
- tags: spring-integration, spring-grpc, redis-lock-registry, grpc, boot-4.1
- summary: Spring Integration `7.1.0`, file output güvenliği ve lock registry yarış koşulları dahil kritik düzeltmeler getiriyor. Spring gRPC `1.1.0` ise auto-configuration'ı doğrudan Boot `4.1` hattına taşıyor.
- why_it_matters: Entegrasyon ağırlıklı sistemlerde framework hizalaması, custom adapter ve config yükünü azaltır.
- java_spring_relevance: gRPC, Redis lock registry, file flow, event-driven integration kullanan ekipler için yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Boot `4.1` ile gRPC ve integration wiring'ini sadeleştirmek; Redis/JDBC lock registry davranışını iyileştirmek.
- risks: Eski custom gRPC starter'larıyla ilerleyip Boot `4.1` ile çakışma yaşamak; dağıtık lock davranışını test etmeden upgrade yapmak.
- migration_notes: Spring gRPC `1.0` kullanıcıları Boot `4.1` geçişinde migration guide izlemeli; Integration kullanan servislerde lock ve file flow regression testleri zorunlu.

### Bulgu 6

- title: Spring Vault `4.1`, secret ve certificate lifecycle yönetimini uygulama kodundan platforma çekebilecek yeni API'ler getirdi
- source: [Spring Vault 4.1 Generally Available](https://spring.io/blog/2026/06/10/spring-vault-4-1-available), [Spring Vault 4.1.0 release notes](https://github.com/spring-projects/spring-vault/releases/tag/4.1.0)
- author: Mark Paluch
- date: 10 Haziran 2026
- category: security, secrets-management, platform-engineering
- tags: spring-vault, managedsecret, certificate-rotation, vaultclient, kv-version-detection
- summary: `ManagedSecret`, managed certificate issuance/rotation, `VaultClient` abstraction ve KV version detection gibi başlıklar Vault entegrasyonunu daha operasyonel ve sürdürülebilir hale getiriyor.
- why_it_matters: Secret rotation ve sertifika yaşam döngüsü genelde uygulama kodunda veya özel script'lerde dağınık yaşar; bu release bunu toparlama fırsatı sunuyor.
- java_spring_relevance: Vault kullanan ya da merkezi secret governance hedefleyen Spring ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Secret ve certificate rotation işlerini standartlaştırmak; custom wrapper katmanını küçültmek.
- risks: Mevcut Vault integration'ı yeni API'lere plansız taşımak; operational ownership'i netleştirmemek.
- migration_notes: Yeni API'ler seçici alınabilir; öncelik certificate ve renewable secret kullanım senaryoları olmalı.

### Bulgu 7

- title: ZGC weak-reference processing araştırması, gelecekte GC maliyeti yüksek Java servisleri için yeni optimizasyon yönü açabilir
- source: [Simplifying Weak Reference Processing in ZGC](https://inside.java/2026/06/11/thesis-simplify-weak-reference-processing-zgc/), [Java News - dev.java](https://dev.java/news/)
- author: Fredrik Hammarberg
- date: 11 Haziran 2026
- category: jvm, gc, performance
- tags: zgc, weakreference, gc, performance, cache, runtime
- summary: Yazı, queue'suz `WeakReference` işleme maliyetini azaltmak için pipeline ayrıştırması ve daha cache-friendly veri yapıları öneriyor. Bu bir ürün release'i değil, araştırma sonucu.
- why_it_matters: `WeakReference` yoğun cache/listener/interner kullanan servislerde GC overhead'i gerçek maliyet kalemi olabilir.
- java_spring_relevance: Yüksek trafikli JVM servislerinde runtime tuning ile ilgilenen ekipler için orta.
- actionability: izlemelik
- impact_level: düşük-orta
- opportunities: Kendi uygulama kodunda gereksiz `WeakReference` kullanımını gözden geçirmek; ZGC gelişmelerini yakından izlemek.
- risks: Bugün için bunu ürünleşmiş JVM davranışı gibi yorumlamak.
- migration_notes: Şimdilik göç notu yok; bu başlık teknik radar maddesi olarak izlenmeli.

## Sonuç

Bugünün ana kararı yeni bir kütüphane seçmekten çok, Spring Boot `4.1` hattını ne zaman standart platform haline getireceğinizi ve `3.5`/`4.0`/`1.4`/`5.2` gibi eski OSS hatlarda ne kadar süre kalacağınızı netleştirmek. En yüksek kısa vadeli aksiyon GraphQL ve Boot patch seviyelerini güvenli noktaya çekmek; en yüksek orta vadeli fırsat ise Boot `4.1` ile gRPC, observability, SSRF koruması ve event-driven altyapıyı ortaklaştırmak.
