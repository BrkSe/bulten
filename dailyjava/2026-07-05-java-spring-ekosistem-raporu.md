# Günlük Java / Spring Ekosistem Raporu

Tarih: 5 Temmuz 2026  
Tarama zamanı: 5 Temmuz 2026 09:09 TSİ  
Odak: modüler monolitin üretim kontratına dönüşmesi, entegrasyon katmanındaki sessiz correctness yamaları, arka plan iş akışlarının yaşam döngüsü disiplini ve JVM performansının iş yükü şekline göre yeniden ele alınması

Tarama notu: Bugün [Spring Blog](https://spring.io/blog.atom), [Spring Security advisories feed](https://spring.io/security.atom), [Spring Modulith 2.1 duyurusu](https://spring.io/blog/2026/06/11/spring-modulith-2-1-ga-2-0-7-and-1-4-12-released), [Spring Modulith `2.1.0` release notları](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0), [Spring Integration `6.5.10` release notları](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10), [Spring AMQP `3.2.12` release notları](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12), [Spring project sayfaları](https://spring.io/projects), [dev.java News](https://dev.java/news/), [Inside Java feed](https://inside.java/feed.xml), [SIMD Vectors in the HotSpot JVM](https://inside.java/2026/07/02/simd-vectors-hotspot-jvm/), [ZGC: A Decade of Redefining Java Performance](https://inside.java/2026/06/30/zgc-performance-decade/), [Can Java Microservices Be As Fast As Go? A 2026 Benchmark Update](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/), [OpenJDK JDK `27` EA](https://jdk.java.net/27/), [Oracle Java `currentJavaReleases` API](https://java.oraclecloud.com/currentJavaReleases), [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [InfoQ Spring roundup](https://www.infoq.com/news/2026/06/spring-news-roundup-jun08-2026/), [InfoQ Java roundup](https://www.infoq.com/news/2026/06/java-news-roundup-jun15-2026/), [InfoQ Spring Boot `4.1` analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/), [Baeldung Java Weekly 650](https://www.baeldung.com/java-weekly-650), [Josh Long’un 30 Haziran 2026 tarihli This Week in Spring yazısı](https://spring.io/blog/2026/06/30/this-week-in-spring-june-30-2026), [Josh Long’un 2 Temmuz 2026 podcast duyurusu](https://spring.io/blog/2026/07/02/a-bootiful-podcast-sebastien-deleuze), [Gunnar Morling feed’i](https://www.morling.dev/index.xml), [Burak KUTBAY blog feed’i](https://blog.burakkutbay.com/feed/) ve [JobRunr `8.7.0`](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.0) / [`8.7.1`](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.1) release notları yeniden kontrol edildi. 5 Temmuz 2026 itibarıyla Spring Security feed’inde 12 Haziran 2026’dan daha yeni bir advisory görünmüyor. Gunnar Morling tarafında en yeni güçlü sinyal hâlâ 25 Haziran tarihli Hardwood `1.0`; Burak KUTBAY blogunda ise bugün Java/Spring backend ekiplerinin öncelik sırasını değiştiren daha yeni bir teknik yazı görünmüyor.

## Öne Çıkan Başlıklar

- [Spring Modulith `2.1.0`](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0), modüler monoliti “iyi niyetli paketleme” düzeyinden çıkarıp outbox, event externalization, slice test ve observability ile daha üretim-uyumlu bir mimari seçeneğe dönüştürüyor.
- [Spring Integration `6.5.10`](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10) ve [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12), bakım hattındaki küçük sürümlerin aslında lock cleanup, ZooKeeper lock ömrü, JMS DSL startup ve RabbitMQ `3.13` uyumluluğu gibi doğrudan incident önleyici düzeltmeler taşıdığını gösteriyor.
- [JobRunr `8.7.0` ve `8.7.1`](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.1), background job sunucusunun ne zaman ayağa kalktığını ve DST çakışmalarında cron’un nasıl davrandığını görünür hale getiriyor. Bu, Spring servislerinde “arka plan işini sonra bakarız” yaklaşımının maliyetini büyütüyor.
- [Micrometer `1.17.0`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0) ile [Spring Boot `4.1`](https://www.infoq.com/news/2026/06/spring-boot-4-1/), observability’yi ücretsiz yan etki olmaktan çıkarıp allocation, exporter davranışı ve async context propagation üzerinden gerçek bir performans backlog’una dönüştürüyor.
- [dev.java](https://dev.java/news/) ve [Inside Java](https://inside.java/) tarafındaki yeni resmi anlatı, Java performansını dil savaşı yerine iş yükü şekli üzerinden tartışıyor: SIMD/vectorization, ZGC olgunluğu ve Java-vs-Go benchmark güncellemesi bu hattın en net üç örneği.

## Kritik Güncellemeler

### 1. Spring Modulith `2.1`, modüler monolit için “toy architecture” aşamasını geride bırakıyor

[Oliver Drotbohm’un duyurusu](https://spring.io/blog/2026/06/11/spring-modulith-2-1-ga-2-0-7-and-1-4-12-released), [GitHub release notları](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0) ve [InfoQ özeti](https://www.infoq.com/news/2026/06/spring-news-roundup-jun08-2026/) birlikte okunduğunda, `2.1.0`’ın yalnız dependency upgrade sürümü olmadığı netleşiyor. Üç detay özellikle kritik:

- Namastack tabanlı outbox desteği, event externalization işini uygulama kodundan çıkarıp daha deterministik hale getiriyor.
- `JobRunrEventExternalizer`, domain event dışsallaştırmasını doğrudan background workflow katmanına bağlayabiliyor.
- `@ModuleSlicing` ve `PublishedEvents`/`Scenario` geliştirmeleri, modül sınırlarını sadece diyagramda değil test katmanında da zorlamayı kolaylaştırıyor.

Bu, mikroservise gitmek istemeyen ama modüler monolitini de “tek deploy ediliyor diye tek modül sayalım” seviyesinde bırakmak istemeyen ekipler için önemli. Bugünün mimari sinyali yeni servis sayısını artırmak değil; modül sınırını, event publication yaşam döngüsünü ve dışsallaştırma stratejisini somutlaştırmak.

### 2. Entegrasyon katmanında küçük patch’ler büyük operasyon maliyetleri önlüyor

[Spring Integration `6.5.10`](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10) release notları, bakım sürümlerinin “sıradan bugfix” diye geçiştirilemeyeceğini bir kez daha gösteriyor. Özellikle şunlar üretim açısından yüksek değerli:

- `JdbcLockRegistry` ve `RedisLockRegistry` için bucket çakışması sonucu `APP_LOCK` kaydının unlock sonrası silinmemesi
- ZooKeeper lock registry’de tutulmakta olan lock’ların yanlışlıkla evict edilebilmesi
- Java DSL ile inbound JMS bileşenlerinde kanal adı verildiğinde startup failure
- `PartitionedDispatcher` ve `DatagramPacketMessageMapper` gibi zor teşhis edilen edge-case concurrency/protocol hataları

[Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12) tarafında ise iki nokta öne çıkıyor:

- `x-queue-leader-locator` nedeniyle RabbitMQ `3.13` classic queue declaration regresyonu
- bozuk `x-death` header geldiğinde `ClassCastException`

Bu tip düzeltmelerin ortak özelliği şu: günlük geliştirme akışında görünmezler, ama patladıklarında incident süresini orantısız büyütürler. Dolayısıyla burada doğru yaklaşım “patch almak kolay” değil, “patch küçük olsa da davranış regresyon testini ciddiye almak gerekir” olmalı.

### 3. JobRunr `8.7.x`, background workflow’ları container yaşam döngüsüne daha sıkı bağlıyor

[JobRunr `8.7.0`](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.0) ile gelen lazy server initialization, `BackgroundJobServer` ve dashboard web server’ın `initialize()` çağrısına bağlanmasını sağlıyor. [InfoQ Java roundup](https://www.infoq.com/news/2026/06/java-news-roundup-jun15-2026/) bunu özellikle “diğer JVM framework’leriyle entegrasyon” bağlamında öne çıkarmış.

Bu değişiklik, Spring ekipleri için iki nedenle önemli:

- job server’ın readiness öncesi istemeden ayağa kalkmasını engellemek artık daha kontrollü hale geliyor
- framework yaşam döngüsüne gömülü background worker davranışı daha görünür hale geliyor

[JobRunr `8.7.1`](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.1) ile gelen DST overlap cron fix’i ise küçük görünüyor ama gerçek dünyada daha önemli olabilir. Çok bölgeli sistemlerde veya Avrupa/ABD takvimine bağlı recurring job’larda yılda iki kez görülen bu tip bug’lar pahalı postmortem üretir. Özellikle Modulith `2.1` ile JobRunr externalization birlikte düşünülüyorsa, scheduler davranışı artık yalnız bir yardımcı kütüphane konusu değil, event delivery güvenilirliğinin parçası.

### 4. Observability katmanı artık açık performans ve maliyet alanı

[Micrometer `1.17.0`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0) GA notlarında ilk bakışta dramatik bir başlık yok; ama detaylar daha önemli:

- HTTP server instrumentation tarafında allocation düşürülüyor
- gRPC server convention tarafında allocation düşürülüyor
- `LongTaskTimer` ve Jetty `TimedHandler` gibi pratik edge case’ler düzeltiliyor

Öte yandan [`1.17.0-RC1`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0-RC1) ile görünür hale gelen `ForkJoinPool#getDelayedTaskCount()` metriği ve JDK `26` `MemoryPoolMXBean.getTotalGcCpuTime()` desteği, metrik yüzeyinin artık doğrudan runtime kararlarına bağlandığını gösteriyor.

[Spring Boot `4.1` analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/) ile bu tablo daha da net: `@Async` context propagation, `management.opentelemetry.enabled`, OTLP exemplar ve exporter ayarları, ölçüm maliyetini “sonradan ekleriz” alanından çıkarıp platform tasarımına taşıyor. Sonuç olarak observability artık sadece “traces görünsün” işi değil; allocation, cardinality ve exporter davranışı dahil edilmeden yapılan telemetry rollout’ları pahalıya mal olabilir.

## Trendler ve Sinyaller

### Trend Kümesi 1: Daha çok mikroservis değil, daha sağlam modül sınırı

Tekrarlayan sinyal:

- [Spring Modulith `2.1`](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0), modül testini ve event externalization’ı derinleştiriyor.
- [JobRunr `8.7.x`](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.1), background workflow yaşam döngüsünü daha açık hale getiriyor.
- [Inside Java’daki Java-vs-Go benchmark güncellemesi](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/) ise dili değil workload tasarımını öne çıkarıyor.

Çıkarım:

- Bugünün daha kalıcı mimari değeri yeni servis açmak değil; tek deploy edilebilir birim içinde modül sınırını, event teslim zincirini ve background processing davranışını sıkılaştırmak.

### Trend Kümesi 2: Maintenance release’ler artık “önemsiz patch” sayılmamalı

Tekrarlayan sinyal:

- [Spring Integration `6.5.10`](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10) distributed lock ve protocol correctness hataları kapatıyor.
- [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12) RabbitMQ `3.13` regresyonunu düzeltiyor.
- [JobRunr `8.7.1`](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.1) DST overlap düzeltmesi taşıyor.

Çıkarım:

- Sessiz patch’ler doğrudan incident sayısını düşürebilir. Sürüm numarası küçük diye etki alanı küçük varsaymak artık tehlikeli.

### Trend Kümesi 3: Observability “görsellik” değil, maliyet ve davranış yönetimi

Tekrarlayan sinyal:

- [Micrometer `1.17`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0) allocation ve metric yüzeyini optimize ediyor.
- [Micrometer Tracing `1.7.0`](https://github.com/micrometer-metrics/tracing/releases/tag/v1.7.0) OpenTelemetry Instrumentation bağımlılığını yükseltiyor.
- [Spring Boot `4.1`](https://www.infoq.com/news/2026/06/spring-boot-4-1/) async context propagation ve OTel kontrol yüzeyini genişletiyor.

Çıkarım:

- Kalıcı değer “dashboard daha güzel oldu” değil; telemetry’nin CPU, heap, network ve cardinality maliyetini yöneten bir kontrol düzlemi kurmak.

### Trend Kümesi 4: JVM performansında hype azalıyor, workload-shape mühendisliği öne çıkıyor

Tekrarlayan sinyal:

- [SIMD Vectors in the HotSpot JVM](https://inside.java/2026/07/02/simd-vectors-hotspot-jvm/) otomatik vectorization ve Vector API’yi gerçek loop şekilleri üzerinden anlatıyor.
- [ZGC: A Decade of Redefining Java Performance](https://inside.java/2026/06/30/zgc-performance-decade/) JDK `25` düzeyinde sub-millisecond pause anlatısını olgunlaştırıyor.
- [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [JEP 516](https://openjdk.org/jeps/516), [JEP 517](https://openjdk.org/jeps/517) ve [JEP 529](https://openjdk.org/jeps/529) üzerinden startup, HTTP/3 ve vector işlemeyi doğrudan üretim senaryolarına bağlıyor.

Çıkarım:

- Kalıcı değer dil değiştirmekte değil; hangi endpoint, serializer, batch adımı veya compute hot path gerçekten darboğazsa onu ölçmekte.

### Hype vs kalıcı değer

- Kalıcı değer: modül sınırlarını test edilebilir hale getirmek, event externalization’ı deterministik kurmak, telemetry maliyetini ölçmek, maintenance patch’leri davranış testiyle almak.
- Hype’a kayma riski: Vector API veya Java-vs-Go benchmark tartışmasını doğrudan genel mimari karara çevirmek.
- Düşük öncelik: [Gunnar Morling’in Hardwood `1.0`](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/) veri yoğun JVM iş yükleri için ilginç; fakat tipik Spring Boot mikroservisi için bugünün ilk üç önceliğine girmiyor.

## Araçlar ve Kütüphaneler

- [Spring Modulith `2.1.0`](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0): yüksek öncelik. Domain event, outbox ve modüler monolit kullanan ekipler için doğrudan mimari fırsat.
- [Spring Integration `6.5.10`](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10): yüksek öncelik. Lock registry, JMS DSL, SOAP gateway, UDP ve file-flow kullanan ekipler için patch seviyesi kritik.
- [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12): orta-yüksek öncelik. RabbitMQ `3.13` kullanan veya `x-death` header’larını işleyen ekipler için özellikle önemli.
- [JobRunr `8.7.1`](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.1): orta-yüksek öncelik. Recurring jobs ve DST kullanan bölgeler için patch alınmalı.
- [Micrometer `1.17.0`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0) ve [Micrometer Tracing `1.7.0`](https://github.com/micrometer-metrics/tracing/releases/tag/v1.7.0): orta-yüksek öncelik. Özellikle Boot `4.1` ve OpenTelemetry kullanan ekiplerde.
- Bugün “hemen almazsan geri kalırsın” seviyesinde yeni bir framework hype’ı yok. Yüksek getirili iş, mevcut mesajlaşma/telemetry/modül yapısını daha sağlam hale getirmek.

## Java / Spring Geliştiricileri İçin Etkiler

- Modüler monolit kullanan ekipler için en makul deney, yeni bounded context’i doğrudan mikroservise ayırmak yerine önce [Modulith `2.1`](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0) ile modül testi, event publication ve externalization akışını sıkılaştırmak.
- Spring Integration kullanan ekipler, `6.5.10` patch’ini sırf dependency bot önerdi diye değil; lock release, failover ve adapter davranışı regresyon paketiyle birlikte değerlendirmeli.
- RabbitMQ `3.13` kullanan ekipler, [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12) öncesi classic queue declaration davranışını doğrulamadan sürüm dondurmamalı.
- JobRunr kullanan ekipler, `initialize()` çağrısının tam olarak nerede yapıldığını ve job server’ın readiness/liveness ile nasıl hizalandığını kontrol etmeli.
- Boot `4.1` ve Micrometer `1.17` kullanan ekipler, telemetry kardinalitesi, allocation ve exporter konfigürasyonunu “ops işi” diye ayırmamalı; bu doğrudan uygulama performansı konusu.
- JVM performans problemi yaşayan ekipler, önce endpoint bazlı benchmark, serializer ölçümü ve GC/trace korelasyonu üretmeli. Go’ya geçiş veya Vector API adopt etme kararı, ölçüm olmadan verilmemeli.

## Fırsatlar ve Riskler

- Fırsat: [Modulith `2.1`](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0) ile modüler monolitte outbox ve event externalization’ı daha güvenilir hale getirip gereksiz mikroservis bölünmesini ertelemek mümkün.
- Risk: JobRunr externalization, outbox ve mevcut scheduler davranışı birlikte kullanıldığında duplicate delivery veya transaction boundary hataları doğabilir.
- Fırsat: [Spring Integration `6.5.10`](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10) ve [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12), nadir ama pahalı entegrasyon incident’lerini azaltabilir.
- Risk: “Patch sürümü küçük” diye concurrency, Rabbit topolojisi veya header parse regresyonu test edilmezse düzeltme almak yeni hata olarak geri dönebilir.
- Fırsat: [Micrometer `1.17`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0) ile telemetry overhead daha düşük ve daha görünür hale getirilebilir.
- Risk: cardinality, exemplar ve exporter davranışı kontrol edilmezse observability maliyeti yine sessizce büyür.
- Fırsat: [JDK `26`](https://blogs.oracle.com/java/the-arrival-of-java-26) tarafındaki vectorization ve HTTP/3 yönü, belirli hot path’lerde ciddi kazanç açabilir.
- Risk: bu sinyalleri genel amaçlı rewrite veya erken runtime standardizasyonu olarak yorumlamak yanlış yatırım doğurur.

## İzlenmesi Gereken Konular

- [Spring Modulith](https://spring.io/projects/spring-modulith) tarafında outbox, JobRunr transaction handling ve publisher confirmation konularına gelecek follow-up patch’ler.
- [Spring Integration](https://spring.io/projects/spring-integration) ve [Spring AMQP](https://spring.io/projects/spring-amqp) bakım hattında yeni concurrency ve broker uyumluluk düzeltmeleri.
- [Micrometer `1.17.x`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0) ile [Spring Boot `4.1.x`](https://www.infoq.com/news/2026/06/spring-boot-4-1/) kombinasyonunda telemetry maliyeti ve tracing davranışının saha geri bildirimleri.
- [JDK `27` build `29`](https://jdk.java.net/27/) hattında Vector API, Lazy Constants ve structured concurrency yönünün ne kadar stabilize olacağı.
- Düşük öncelik: [Gunnar Morling’in Hardwood hattı](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/) veri altyapısı yoğun ekipler için izlenebilir.
- Düşük öncelik: Burak KUTBAY blogunda bugün yeni, yüksek etkili Java/Spring backend yazısı görünmüyor.

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Modulith `2.1`, modüler monoliti olay dışsallaştırma ve test tarafında üretime yaklaştırıyor
- `source`: [Spring Modulith 2.1 GA duyurusu](https://spring.io/blog/2026/06/11/spring-modulith-2-1-ga-2-0-7-and-1-4-12-released) | [Spring Modulith `2.1.0` release notları](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0) | [InfoQ Spring roundup](https://www.infoq.com/news/2026/06/spring-news-roundup-jun08-2026/) | [Spring Modulith proje sayfası](https://spring.io/projects/spring-modulith)
- `author`: Oliver Drotbohm | Spring Modulith maintainers | Michael Redlich
- `date`: 11 Haziran 2026
- `category`: architecture, event-driven, testing, observability
- `tags`: spring-modulith-2.1, outbox, namastack, jobrunr, module-slicing, publishedevents, observability
- `summary`: `2.1.0`, Namastack outbox desteği, `JobRunrEventExternalizer`, `@ModuleSlicing`, çok thread’li `PublishedEvents`/`Scenario` görünürlüğü ve observability ayrıştırması getiriyor. Bu sayede modüler monolitler, event delivery ve test sınırlarını daha üretim-benzeri kurabiliyor.
- `why_it_matters`: Ekipler mikroservise gitmeden önce modül sınırlarını, event teslim zincirini ve background externalization davranışını daha güvenilir hale getirebilir.
- `java_spring_relevance`: Spring Boot monolitleri, domain event kullanan ekipler ve transactional messaging yapan servisler için doğrudan relevant.
- `actionability`: `planli_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: outbox desenini sadeleştirmek, modül testlerini güçlendirmek, modüler monolit ömrünü uzatmak
- `risks`: transaction boundary karmaşası, duplicate externalization, yeni observability ve outbox bileşenlerini yanlış konumlandırmak
- `migration_notes`: tüm sistemi bir anda taşımak yerine tek bounded context üzerinde `@ModuleSlicing`, event publication registry ve externalization akışı pilotlanmalı; JobRunr veya RabbitMQ ile kullanılan externalization yolunda retry/confirmation davranışı test edilmeli.

### Bulgu 2

- `title`: Spring Integration `6.5.10` ve Spring AMQP `3.2.12`, sessiz ama incident önleyici correctness düzeltmeleri taşıyor
- `source`: [Spring Integration `6.5.10`](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10) | [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12) | [Spring Integration proje sayfası](https://spring.io/projects/spring-integration) | [Spring AMQP proje sayfası](https://spring.io/projects/spring-amqp)
- `author`: Spring Integration maintainers | Spring AMQP maintainers
- `date`: 24 Haziran 2026 / 30 Haziran 2026
- `category`: integration, messaging, concurrency, operations
- `tags`: spring-integration-6.5.10, spring-amqp-3.2.12, jdbc-lock-registry, redis-lock-registry, zookeeper, jms-dsl, rabbitmq-3.13, x-death
- `summary`: `6.5.10`, distributed lock ve adapter tarafında zor teşhis edilen concurrency/protocol bug’larını kapatıyor. `3.2.12` ise RabbitMQ `3.13` classic queue declaration regresyonunu ve bozuk `x-death` header kaynaklı `ClassCastException` senaryosunu düzeltiyor.
- `why_it_matters`: Bu düzeltmeler günlük feature geliştirmede görünmez, ama patladıklarında lock sızıntısı, startup failure, queue declaration hatası veya yanlış mesaj işleme gibi pahalı incident’ler üretir.
- `java_spring_relevance`: Spring Integration flow’ları, RabbitMQ topolojileri, distributed lock kullanan scheduler’lar ve JMS/SOAP/file adapter’ları olan ekipler için doğrudan etkili.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: lock/scheduler incident’lerini azaltmak, broker uyumluluğunu iyileştirmek, eski integration flow’larda güven artırmak
- `risks`: patch’i “minor” sayıp concurrency regresyonu test etmemek, broker sürüm kombinasyonlarını doğrulamadan rollout yapmak
- `migration_notes`: RabbitMQ `3.13` ile classic queue declaration, distributed lock release/failover, inbound JMS startup ve bozuk header senaryoları test ortamında tekrar oynatılmalı; patch upgrade mutlaka davranış regresyon paketi ile alınmalı.

### Bulgu 3

- `title`: JobRunr `8.7.x`, arka plan işlerinin yaşam döngüsü ve takvim doğruluğunu daha görünür hale getiriyor
- `source`: [JobRunr `8.7.0` release notları](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.0) | [JobRunr `8.7.1` release notları](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.1) | [InfoQ Java roundup](https://www.infoq.com/news/2026/06/java-news-roundup-jun15-2026/) | [JobRunr docs - other JVM frameworks](https://www.jobrunr.io/en/documentation/getting-started/other/#integrating-jobrunr-in-other-jvm-frameworks)
- `author`: JobRunr maintainers | Michael Redlich
- `date`: 19 Haziran 2026 / 26 Haziran 2026
- `category`: scheduling, background-processing, operations
- `tags`: jobrunr-8.7.0, jobrunr-8.7.1, lazy-server-init, fluent-api, jackson3, dst-overlap, recurring-jobs
- `summary`: `8.7.0`, server başlatmayı `initialize()` çağrısına bağlayarak lifecycle kontrolünü netleştiriyor ve Jackson 3 koleksiyon desteğini iyileştiriyor. `8.7.1`, DST overlap sırasında cron parse hatasını düzeltiyor.
- `why_it_matters`: Background job altyapısı, uygulama yaşam döngüsünden ayrı düşünüldüğünde readiness hataları ve takvim kaynaklı sessiz iş kayıpları üretir.
- `java_spring_relevance`: JobRunr kullanan Spring Boot servisleri, recurring jobs, internal workflow orchestration ve Modulith ile event externalization birleştiren ekipler için doğrudan relevant.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: job server başlangıcını container lifecycle ile hizalamak, scheduler davranışını daha öngörülebilir hale getirmek
- `risks`: yanlış `initialize()` konumu, readiness öncesi worker açılması, DST overlap döneminde eksik veya çift iş çalışması
- `migration_notes`: rollout öncesi `initialize()` akışı, readiness/liveness davranışı ve DST kullanan bölgelerde recurring job regresyon testleri doğrulanmalı; Job argümanlarında Jackson 3 koleksiyon serileştirmesi test edilmeli.

### Bulgu 4

- `title`: Micrometer `1.17`, observability maliyetini görünmez yan etkiden yönetilen runtime alanına taşıyor
- `source`: [Micrometer `1.17.0`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0) | [Micrometer `1.17.0-RC1`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0-RC1) | [Micrometer Tracing `1.7.0`](https://github.com/micrometer-metrics/tracing/releases/tag/v1.7.0) | [InfoQ Spring Boot `4.1` analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/) | [InfoQ Java roundup](https://www.infoq.com/news/2026/06/java-news-roundup-jun08-2026/) | [Baeldung Java Weekly 650](https://www.baeldung.com/java-weekly-650)
- `author`: Micrometer maintainers | Michael Redlich | Baeldung team
- `date`: 8 Haziran 2026 / 16 Haziran 2026
- `category`: observability, performance, telemetry, runtime
- `tags`: micrometer-1.17, micrometer-tracing-1.7, http-allocation, grpc-allocation, gc-cpu-time, delayed-task, exemplars, otlp, boot-4.1
- `summary`: `1.17.0`, HTTP ve gRPC server instrumentation allocation’ını düşürüyor; RC hattı ise JDK `26` GC CPU time ve delayed task metrics gibi daha derin runtime görünürlüğü ekliyor. Spring Boot `4.1`, bunu async context propagation ve OpenTelemetry kontrol yüzeyiyle platform davranışına bağlıyor.
- `why_it_matters`: Telemetry katmanı artık sadece görünürlük değil; CPU, heap, async bağlam ve exporter maliyetinin aktif olarak yönetildiği bir alan.
- `java_spring_relevance`: Actuator, OpenTelemetry, high-QPS endpoint’ler, async task havuzları ve JVM runtime metrikleri kullanan tüm Spring ekipleri için önemli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: observability overhead’ını düşürmek, GC ve executor davranışını daha iyi görmek, async trace zincirini sadeleştirmek
- `risks`: kardinalite patlaması, exporter maliyetini küçümsemek, Micrometer/OTel sürümlerini uyumsuz bırakmak
- `migration_notes`: `management.opentelemetry.*`, async context propagation, exemplar/compression seçenekleri ve metrik dashboard’ları servis bazında gözden geçirilmeli; telemetry rollout’u için performans karşılaştırması yapılmalı.

### Bulgu 5

- `title`: Resmi Java performans anlatısı, dil savaşından iş yükü şekline dayalı optimizasyona kayıyor
- `source`: [dev.java News](https://dev.java/news/) | [SIMD Vectors in the HotSpot JVM](https://inside.java/2026/07/02/simd-vectors-hotspot-jvm/) | [ZGC: A Decade of Redefining Java Performance](https://inside.java/2026/06/30/zgc-performance-decade/) | [Can Java Microservices Be As Fast As Go? A 2026 Benchmark Update](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/) | [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26) | [OpenJDK JDK `27` EA](https://jdk.java.net/27/)
- `author`: Emanuel Peter | Stefan Johansson | Mark Nelson | Oracle Java team
- `date`: 15 Haziran 2026 - 2 Temmuz 2026
- `category`: jvm, performance, runtime, benchmarking
- `tags`: jdk26, vector-api, auto-vectorization, zgc, microservices-benchmark, http3, hot-path, workload-shape
- `summary`: Resmi Java kanalları şu an yeni syntax’tan çok performansın nerede ve nasıl kazanılacağını anlatıyor: vectorization, ZGC olgunluğu, payload ve concurrency duyarlı benchmark’lar, HTTP/3 ve AOT/GC yönü birlikte ele alınıyor.
- `why_it_matters`: Performans işi artık “hangi dil daha hızlı?” tartışmasından çok, hangi endpoint veya veri dönüşümü gerçekten darboğazsa ona odaklanmayı gerektiriyor.
- `java_spring_relevance`: Gateway, API, veri işleme ve düşük gecikme hedefli Spring servisleri için doğrudan stratejik sinyal.
- `actionability`: `izlemelik`
- `impact_level`: `orta-yuksek`
- `opportunities`: hot path benchmark’ları, doğru GC seçimi, Vector API’yi dar kapsamlı bileşenlerde hedefli kullanmak
- `risks`: ölçümsüz GC değişikliği, yanlış benchmark yorumları, dili veya framework’ü gereksiz yere değiştirme baskısı
- `migration_notes`: önce JMH veya uçtan uca endpoint benchmark’ları kurulmalı; Vector API ve yeni runtime özellikleri yalnız kanıtlanmış sıcak yollar için değerlendirilmelidir, genel platform kararı olarak değil.

## Sonuç

5 Temmuz 2026 radarının en güçlü mesajı yeni bir büyük framework lansmanı değil; mevcut Java/Spring sistemlerinin mimari ve operasyonel disiplinini artırmak. En değerli Spring sinyali, [Modulith `2.1`](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0) ile modüler monolitin artık daha ciddi bir üretim seçeneğine dönüşmesi. En kritik bakım sinyali, [Spring Integration `6.5.10`](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10), [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12) ve [JobRunr `8.7.1`](https://github.com/jobrunr/jobrunr/releases/tag/v8.7.1) gibi küçük sürümlerin aslında pahalı incident’leri önleyen correctness düzeltmeleri taşıması. JVM tarafında ise resim net: hype yerine iş yükü şekline dayalı, ölçülebilir performans mühendisliği öne çıkıyor. Kısa özetle bugün en yüksek getirili işler; modül sınırlarını test edilebilir hale getirmek, background workflow yaşam döngüsünü kontrol etmek, telemetry maliyetini ölçmek ve maintenance patch’leri ciddiye almak.
