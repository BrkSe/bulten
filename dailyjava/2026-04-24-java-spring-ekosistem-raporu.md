# Günlük Java / Spring Ekosistem Raporu

Tarih: 24 Nisan 2026  
Odak: Spring Boot güvenlik yamaları, Spring Boot 4.1 release candidate hattı, Redis tabanlı koordinasyon desenleri, Oracle Java CPU, JDK 27 uyumluluk sinyalleri

Kaynak tarama notu: Bugünkü taramada [Spring Blog](https://spring.io/blog/), [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security), [Spring Boot 4.1.0-RC1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes), [Spring Data 2026.0.0-RC1 duyurusu](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/), [Spring Integration 7.1.0-RC1 duyurusu](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/), [Inside Java](https://inside.java/2026/04/21/quality-heads-up/), [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [Oracle Java Blog](https://blogs.oracle.com/java), [Oracle Java CPU April 2026](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm), [JDK 21.0.11 release notes](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html), [InfoQ Java roundup](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/), [Baeldung Java Weekly 643](https://www.baeldung.com/java-weekly-643), [Foojay runtime seçimi yazısı](https://foojay.io/today/which-java-runtime-should-you-use-in-production-comparing-openjdk-distributions/), [Foojay cache invalidation yazısı](https://nljug.org/uncategorized/distributed-cache-invalidation-patterns/), [Gunnar Morling](https://www.morling.dev/), Josh Long'un güncel Spring içerikleri ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Josh Long, Gunnar Morling ve Burak KUTBAY tarafında bugün öncelik sırasını tek başına değiştiren yeni bir release veya güvenlik duyurusu görülmedi; bu kaynaklar trend doğrulaması için kullanıldı.

## Öne Çıkan Başlıklar

23 Nisan 2026 tarihli Spring Boot yayınları bugünün en yüksek öncelikli sinyalini üretti. `Spring Boot 3.5.14` ve `4.0.6`, auto-configuration ve default security davranışına dokunan altı ile sekiz arasında CVE düzeltmesi içeriyor. Özellikle `4.0.6` içindeki `CVE-2026-40976`, belirli koşullarda default security filter chain'in tüm endpoint'leri fiilen açık bırakabilmesi nedeniyle doğrudan üretim riski taşıyor.

`Spring Boot 4.1.0-RC1` aynı gün yayınlandı ve bu RC sıradan bir önizleme değil. OpenTelemetry SDK environment variable desteği, `InetAddressFilter` ile SSRF sertleştirmesi, lazy JDBC connection fetching ve `@RedisListener` auto-configuration; Spring Boot 4.1 hattının daha çok operasyonel olgunluk ve platform ergonomisine odaklandığını gösteriyor.

Spring Data `2026.0.0-RC1`, Spring Integration `7.1.0-RC1` ve harici mimari yazılar birlikte okunduğunda Redis'in Spring dünyasında sadece cache değil, aynı zamanda koordinasyon, pub/sub ve invalidation düzlemi haline geldiği görülüyor. Bu, mikroservis mimarisinde veri doğruluğu ve lock davranışı için daha disiplinli sınırlar gerektiriyor.

JVM tarafında yeni ana sinyal, 21 Nisan 2026 Oracle CPU baseline'ı ile 23 Nisan Boot yamalarının birleşmesi. Java runtime patch seviyesi ile Spring dependency seviyesi artık ayrı iş kalemi olarak ele alınmamalı. Ayrıca Inside Java'nın 21 Nisan 2026 tarihli JDK 27 heads-up notu, bazı OpenJDK dağıtımlarında çeviri kaynaklarının kaldırılması nedeniyle locale'a bağlı testlerin ve sabit mesaj beklentilerinin kırılabileceğini gösteriyor.

## Kritik Güncellemeler

### Spring Boot 3.5.14 ve 4.0.6 güvenlik yamaları

`Spring Boot 4.0.6`, sekiz CVE düzeltmesiyle geldi. En ciddi olanı `CVE-2026-40976`: servlet tabanlı uygulama kendi Spring Security konfigürasyonunu yazmıyorsa, `spring-boot-actuator-autoconfigure` varsa ve `spring-boot-health` yoksa default security filter chain yetkisiz erişime izin verebiliyor. Bu açık yalnızca `4.0.0 - 4.0.5` hattını etkiliyor ve `4.0.6` ile kapanıyor.

`Spring Boot 3.5.14` ise altı CVE düzeltiyor. En pratik etkili düzeltmeler şunlar:

- `CVE-2026-40972`: Remote DevTools secret karşılaştırması timing attack ile sızdırılabiliyor; uç durumda uzaktan class yükleme ve RCE'ye gidebilir.
- `CVE-2026-40973`: `ApplicationTemp` dizini sahiplik doğrulaması olmadan kullanılabildiği için persistent session kullanan senaryolarda session hırsızlığı veya host-level kötüye kullanım riski doğuyor.
- `CVE-2026-40971` ve `CVE-2026-40974`: RabbitMQ ve Cassandra SSL auto-configuration hostname verification yapmıyor.
- `CVE-2026-40975`: `${random.value}` secret üretmek için uygun değil; yalnızca `random.uuid` görece güvenli bırakılmış.
- `CVE-2026-40977`: `ApplicationPidFileWriter` öngörülebilir bir path'te symlink izleyebiliyor.

Boot `4.0.6` tarafında bunlara ek olarak `CVE-2026-40970` ile Elasticsearch SSL bundle hostname verification sorunu da düzeltiliyor.

### Spring Boot 4.1.0-RC1 artık gerçek canary adayı

`Spring Boot 4.1.0-RC1`, 113 iyileştirme ve hata düzeltmesi içeriyor. Bugün için en önemli üç konu:

- OpenTelemetry SDK environment variable desteği: platform ekipleri container tabanlı telemetry standardizasyonunu Spring property override zinciriyle boğuşmadan yapabilir.
- `InetAddressFilter`: hem blocking hem reactive HTTP client'larda egress policy bazlı SSRF sertleştirmesi mümkün hale geliyor.
- `spring.datasource.connection-fetch=lazy`: fiziksel JDBC connection'ın yalnızca statement gerektiğinde havuzdan alınması, boş transaction ve read-mostly servislerde connection pressure'ı azaltabilir.

RC1 ayrıca `Micrometer 1.17.0-RC1`, `Spring Data 2026.0.0-RC1`, `Spring Integration 7.1.0-RC1`, `Spring Kafka 4.1.0-RC1`, `Spring Security 7.1.0-RC1` ve `Spring Session 4.1.0-RC1` gibi bağımlılıkları beraberinde getiriyor. Bu nedenle 4.1 denemesi tek bir artifact değil, bütün bir platform denemesi olarak ele alınmalı.

### Oracle Java CPU April 2026 runtime baseline'ı oluşturdu

21 Nisan 2026 Oracle CPU ile `26.0.1`, `25.0.3`, `21.0.11`, `17.0.19`, `11.0.31` ve `8u491` yayımlandı. `JDK 21.0.11` release notes tarafında iki başlık pratik önem taşıyor:

- `IANA TZ Data 2026a` güncellemesi: saat dilimi verisine duyarlı batch, cron ve zaman bazlı iş akışlarında davranış farkı oluşabilir.
- `Chunghwa` kök sertifikalarına bağlı ve `17 Mart 2026` sonrasında verilmiş TLS server sertifikalarının artık güvenilmeyeceği duyuruldu.

Oracle GraalVM release calendar da aynı CPU gününde `17.0.19`, `21.0.11`, `25.0.3`, `26.0.1` için patch planını gösteriyor. Native image veya GraalVM tabanlı dağıtımlar için runtime patch seviyesi ayrıca kontrol edilmeli.

### JDK 27 locale uyumluluğu erken test gerektiriyor

Inside Java'nın 21 Nisan 2026 tarihli Quality Outreach notuna göre JDK 27, bakımı yapılmayan çeviri kaynaklarını kaldırıyor. Sadece İngilizceye ek olarak Almanca, Japonca ve Basitleştirilmiş Çince aktif olarak korunuyor. `jdk.java.net` EA build'leri ve Oracle JDK bundan etkilenmiyor; ancak başka OpenJDK dağıtımlarında bazı locale'lar artık İngilizce mesaj döndürebilir.

Bu, özellikle exception mesajı veya JDK kaynak metni üzerinden assertion yapan testler için sessiz kırılma riski demek. Spring uygulamaları doğrudan bu özellikten etkilenmeyebilir; ama CI'da kullanılan JDK dağıtımı değiştiğinde test davranışı değişebilir.

## Trendler ve Sinyaller

### 1. Spring güvenliği artık starter ve auto-configuration seviyesinde düşünülmeli

Bugünkü CVE kümesi, klasik "uygulama kodunda açık" kalıbından farklı. SSL bundle hostname verification, default security filter chain, temp dizini yönetimi, weak PRNG ve PID writer davranışı gibi konuların çoğu framework starter ve runtime default'larından geliyor. Bu, Spring ekipleri için tehdit modelinin `application.yml`, starter seçimi ve default bean wiring'e kadar indiğini gösteriyor.

### 2. Boot 4.1 hattı gösterişli değil, operasyonel olarak kalıcı

OpenTelemetry environment variable desteği, lazy connection fetch ve SSRF egress filtreleri hype değil. Bunlar kurumsal platformların telemetry standardizasyonu, connection pool verimliliği ve outbound network policy kontrolü için kalıcı mühendislik değerine sahip.

### 3. Redis, cache'ten daha fazlası haline geliyor

Spring Data RC1'de `RedisMessageSendingTemplate` ve `RedisCache.resetCaches()`, Spring Integration RC1'de native CAS/CAD tabanlı `RedisLockRegistry`, Boot 4.1 RC1'de `@RedisListener` auto-config; Redis'in artık hem veri önbelleği hem de olaylaşma ve koordinasyon katmanı olarak kullanıldığını gösteriyor. Bu yaklaşım verimli olabilir, fakat veri alanlarının ve operasyonel sınırların net ayrılmasını gerektiriyor.

### 4. Runtime vendor seçimi yeniden önem kazandı

Inside Java'nın JDK 27 heads-up notu ile Foojay'in OpenJDK dağıtımı karşılaştırması birlikte okunduğunda, "OpenJDK zaten OpenJDK" yaklaşımı zayıflıyor. Çeviri kaynakları, support ownership, CPU ritmi, GraalVM uyumu ve platform bağımlı ek yamalar farklı dağıtımlarda farklı sonuçlar üretebilir.

### 5. Gürültü ile kalıcı değer arasındaki ayrım bugün net

Bugün AI çerçeveleri, konferans notları ve genel Java ekosistemi yazıları da tarandı. Ancak Java/Spring backend ekipleri için bugün kalıcı karar değeri taşıyan konular güvenlik yaması, runtime patch seviyesi, Redis tabanlı koordinasyon ve Boot 4.1 pilot hazırlığı oldu. Geri kalan başlıklar daha çok izleme seviyesinde.

## Araçlar ve Kütüphaneler

- `Spring Boot 3.5.14`: En yüksek öncelik. `3.5.x` kullanan herkes için patch release, güvenlik gereksinimi olarak değerlendirilmeli.
- `Spring Boot 4.0.6`: En yüksek öncelik. Özellikle default security chain kullanan `4.0.x` servisleri için ertelenmemeli.
- `Spring Boot 4.1.0-RC1`: Orta-yüksek öncelik. Canary ve platform pilotu için uygun; doğrudan geniş üretim yayılımı için erken.
- `Spring Data 2026.0.0-RC1`: Orta öncelik. Özellikle Redis ve relational upsert kullanan ekipler için anlamlı.
- `Spring Integration 7.1.0-RC1`: Orta öncelik. Redis lock davranışı ve JMS özelleştirmesi kullanan ekipler için yakın takipte olmalı.
- `Oracle JDK 21.0.11 / 25.0.3 / 26.0.1`: Yüksek öncelik. Application runtime, CI, buildpack ve base image seviyesinde hizalanmalı.
- `GraalVM CPU hattı`: Orta öncelik. Native image kullanan ekipler JDK patch baseline'ından ayrı düşünmemeli.

Spring Cloud tarafında bugün yeni ana seviye bir release sinyali görülmedi. Mevcut `2025.1.1` ve `2025.0.2` uyumluluk hatlarının yeni Boot güvenlik baseline'larına ne kadar hızlı hizalanacağı izlenmeli. Spring AI tarafında da bugün üretim önceliğini değiştiren yeni bir release bulunmadı; bu alan şimdilik daha çok izleme gündemi olarak kaldı.

## Java / Spring Geliştiricileri İçin Etkiler

İlk iş, servis envanterini `Spring Boot 4.0.x` ve `3.5.x` bazında çıkarmak olmalı. Özellikle şu özellikleri kullanan servisler önceliklendirilmeli: Actuator, RabbitMQ, Cassandra, Elasticsearch, Remote DevTools, persistent session, `ApplicationPidFileWriter`, `${random.value}` ile üretilmiş secret benzeri konfigürasyonlar.

`Spring Boot 4.1.0-RC1` ile pilot yapan ekipler, yalnızca derleme geçti diye yetinmemeli. `ReactorClientHttpRequestFactoryBuilder` ve `ReactorClientHttpConnectorBuilder` default davranışındaki değişiklik, proxy/system property beklentisi olan outbound HTTP akışlarını etkileyebilir. `InetAddressFilter` entegrasyonu, şirket içi allowlist egress politikasıyla birlikte test edilmeli.

Redis kullanan ekipler için en kritik yorum şu: Redis artık sadece cache ise bir kural seti, hem cache hem pub/sub hem lock ise başka bir kural seti gerekiyor. `RedisCache.resetCaches()` altında `FLUSHDB` optimizasyonu yalnızca Redis örneği gerçekten sadece cache için ayrılmışsa güvenli. Aksi durumda aynı veritabanında mesajlaşma, lock veya başka state tutuluyorsa bu optimizasyon operasyonel risk taşır.

JDK CPU tarafında container image, buildpack, CI runner ve developer SDK eşitlemesi yapılmalı. Yalnızca prod JDK'sını güncellemek yetmez. `JDK 21.0.11` ile gelen zaman dilimi ve güven zinciri değişiklikleri entegrasyon testlerinde görülmeden üretimde sürpriz yaratabilir.

## Fırsatlar ve Riskler

Fırsatlar:

- Spring Boot 4.1 ile OpenTelemetry configuration standardını environment variable seviyesinde sadeleştirmek.
- `InetAddressFilter` ile SSRF savunmasını uygulama bazlı custom koddan framework seviyesine taşımak.
- Lazy JDBC connection fetching ile connection pool basıncını azaltmak.
- Redis listener, pub/sub ve cache invalidation desenlerini daha tutarlı hale getirmek.
- Runtime vendor ve support ownership kararını procurement değil platform güvenilirliği problemi olarak yeniden ele almak.

Riskler:

- `Spring Boot 4.0.0 - 4.0.5` kullanan ve default security chain'e güvenen servislerde yetkisiz erişim kalması.
- Remote DevTools açık veya yanlışlıkla erişilebilir ortamlarda timing attack yüzeyinin küçümsenmesi.
- `${random.value}` ile üretilmiş mevcut secret'ların uzun süre sessizce sistemde kalması.
- Redis'i çok amaçlı kullanırken cache reset, pub/sub ve lock state'lerinin birbirine zarar vermesi.
- JDK dağıtımı değiştiğinde locale'a bağlı testlerin İngilizce çıktıya dönüp sessizce kırılması.

Migration notları:

- `Spring Boot 3.5.x` için hedef sürüm `3.5.14`; `4.0.x` için hedef sürüm `4.0.6`.
- `4.1.0-RC1` pilotlarında `spring.datasource.connection-fetch`, Redis listener auto-config, HTTP client egress policy ve proxy davranışı birlikte test edilmeli.
- `@RedisListener` kullanımıyla gelen starter footprint değişikliği nedeniyle `spring-boot-starter-data-redis` artık `spring-messaging` de getiriyor; custom bean conflict ihtimali gözden geçirilmeli.
- JDK 21.0.11 geçişinde outbound TLS sertifika zincirleri, cron/batch zaman hesapları ve locale'a bağlı testler yeniden çalıştırılmalı.
- Foojay'in 19 Nisan 2026 tarihli Boot 3.5 yazısı, açık kaynak support penceresinin hızla daraldığını vurguluyor; bunu resmi support policy ile birlikte 4.0/4.1 geçiş planına çevirmek mantıklı.

## İzlenmesi Gereken Konular

- `Spring Boot 4.1` hattında RC2 veya GA öncesi yeni migration notu gelip gelmeyeceği.
- `Spring Data 2026.0.0` ve `Spring Integration 7.1.0` için Mayıs 2026 GA sürümlerinde breaking-change yüzeyinin daralması.
- Spring Cloud release train'lerinin yeni Boot güvenlik baseline'larını ne kadar hızlı içereceği.
- JDK 27 için yeni Quality Outreach başlıkları: özellikle finalization, locale ve test uyumluluğu tarafı.
- GraalVM April 2026 CPU sürümlerinin yerel native image pipeline'larında ne kadar hızlı benimsenebildiği.
- Runtime seçiminde Temurin, Liberica, Zulu, Corretto, Semeru, Red Hat ve SapMachine gibi dağıtımlar arasında support ownership ve CI/prod eşleşmesinin netleştirilmesi.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot 3.5.14 ve 4.0.6 güvenlik yama dalgası yayımlandı
- source: [Spring Boot 3.5.14 available now](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now/), [Spring Boot 4.0.6 available now](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/), [CVE-2026-40972](https://spring.io/security/cve-2026-40972/), [CVE-2026-40973](https://spring.io/security/cve-2026-40973/), [CVE-2026-40974](https://spring.io/security/cve-2026-40974/), [CVE-2026-40975](https://spring.io/security/cve-2026-40975/), [CVE-2026-40976](https://spring.io/security/cve-2026-40976/), [CVE-2026-40977](https://spring.io/security/cve-2026-40977/)
- author: Andy Wilkinson, Spring Team
- date: 23 Nisan 2026
- category: security, release, auto-configuration
- tags: spring-boot, cve, actuator, devtools, ssl-bundle, cassandra, rabbitmq, elasticsearch, applicationtemp, prng
- summary: `3.5.14` ve `4.0.6`, Spring Boot auto-configuration ve default security davranışlarını etkileyen çoklu CVE düzeltmeleriyle çıktı. `4.0.6` hattında kritik yetkilendirme bypass riski kapatıldı.
- why_it_matters: Kod değiştirmeden yalnızca starter ve varsayılan davranış nedeniyle açık oluşabiliyor; bu nedenle risk görünenden daha yaygın olabilir.
- java_spring_relevance: Spring Boot kullanan servislerin büyük bölümü starter, auto-config ve default filter chain davranışlarına güveniyor.
- actionability: hemen_yama_gecisi_ve_servis_envanteri
- impact_level: çok_yüksek
- opportunities: Starter ve security default envanterini çıkarmak, secret ve TLS hijyenini düzeltmek, DevTools kullanımını yeniden sınırlamak.
- risks: Yetkisiz erişim, yanlış TLS hostname verification, timing attack ile secret sızıntısı, host-local temp ve pid path kötüye kullanımı.
- migration_notes: `3.5.x` için `3.5.14`, `4.0.x` için `4.0.6` hedeflenmeli. Özellikle Actuator, DevTools, RabbitMQ, Cassandra, Elasticsearch, persistent session ve `ApplicationPidFileWriter` kullanan servisler önceliklendirilmeli.

### Bulgu 2

- title: Spring Boot 4.1.0-RC1 operasyonel sertleştirme ve platform hizası getiriyor
- source: [Spring Boot 4.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/), [Spring Boot 4.1.0-RC1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes)
- author: Andy Wilkinson, Stéphane Nicoll
- date: 23 Nisan 2026
- category: release-candidate, observability, runtime-hardening
- tags: spring-boot-4.1, opentelemetry, ssrf, lazy-jdbc, redis-listener, micrometer, spring-data, spring-integration, grpc
- summary: `4.1.0-RC1`; OpenTelemetry SDK environment variable desteği, `InetAddressFilter` ile SSRF azaltımı, lazy connection fetch ve `@RedisListener` auto-config gibi üretim davranışını etkileyen özellikler sunuyor. Aynı zamanda 4.1 release train bağımlılıklarını toplu halde RC seviyesine taşıyor.
- why_it_matters: Bu RC, uygulama davranışı, telemetry standardı, outbound network policy ve connection pool verimi üzerinde gerçek etkisi olan değişiklikler taşıyor.
- java_spring_relevance: Spring Boot 4.1'e geçecek ekipler yalnızca compile uyumu değil, runtime semantiği ve dependency set değişimini de test etmek zorunda.
- actionability: hedefli_canary_ve_platform_pilotu
- impact_level: yüksek
- opportunities: Egress sertleştirmesi, telemetry standardizasyonu, connection pool optimizasyonu ve Redis tabanlı listener modelinin sadeleşmesi.
- risks: RC bağımlılıklarıyla birlikte beklenmeyen davranış farkları, proxy/default HTTP client beklentilerinin değişmesi, yeni starter footprint'inin bean conflict yaratması.
- migration_notes: `ReactorClientHttpRequestFactoryBuilder` default değişikliği, `spring.datasource.connection-fetch=lazy` semantiği, `spring-boot-starter-data-redis` ile gelen `spring-messaging` bağımlılığı ve RC bağımlılık zinciri birlikte test edilmeli.

### Bulgu 3

- title: Redis, Spring stack içinde cache'ten koordinasyon düzlemine kayıyor
- source: [Spring Data 2026.0.0-RC1 enters release candidate phase](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/), [Spring Integration 7.1.0-RC1 Available](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/), [Spring Boot 4.1.0-RC1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes), [Distributed Cache Invalidation Patterns](https://nljug.org/uncategorized/distributed-cache-invalidation-patterns/)
- author: Mark Paluch, Glenn Renfro, Matteo Rossi
- date: 17 Nisan 2026, 21 Nisan 2026, 23 Nisan 2026
- category: distributed-systems, caching, messaging
- tags: redis, cache-invalidation, redislockregistry, pubsub, redislistener, spring-data-redis, spring-integration, distributed-locks
- summary: Spring Data RC1 `RedisMessageSendingTemplate` ve `RedisCache.resetCaches()`, Spring Integration RC1 native CAS/CAD tabanlı `RedisLockRegistry` ve Boot 4.1 `@RedisListener` auto-config birlikte düşünüldüğünde Redis; cache, pub/sub ve lock koordinasyonunun ortak zemini haline geliyor.
- why_it_matters: Aynı Redis altyapısını birden fazla amaç için kullanmak latency'yi düşürebilir; fakat veri doğruluğu, lock güvenilirliği ve invalidation semantiğini karmaşıklaştırır.
- java_spring_relevance: Spring Boot mikroservislerinde Redis çok yaygın; cache, eventing ve coordination'ın aynı yerde birleşmesi doğrudan üretim mimarisi kararıdır.
- actionability: mimari_sinir_cizimi_ve_yuk_testi
- impact_level: orta-yüksek
- opportunities: Daha basit pub/sub kablolaması, daha hızlı distributed cache reset stratejileri, Redis 8.4+ ile daha doğal lock semantiği.
- risks: `FLUSHDB` tabanlı reset'in paylaşılan Redis'te yıkıcı olması, node'lar arası stale cache davranışı, Lua fallback ile native CAS/CAD arasında davranış farkları.
- migration_notes: Redis instance/DB tahsisini netleştirin. Cache-only, lock-only ve pub/sub amaçlarını karıştırmayın. Redis 8.4+ için native lock davranışını, eski sürümlerde Lua fallback'i yük altında ayrı test edin.

### Bulgu 4

- title: Oracle Java CPU April 2026 yeni runtime baseline'ını oluşturdu
- source: [Oracle Critical Patch Update (CPU) April 2026 for Oracle Java SE](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm), [JDK 21.0.11 Release Notes](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html), [Oracle GraalVM Release Calendar](https://docs.oracle.com/en/graalvm/release-calendar.html)
- author: Oracle Java Management, Oracle Java, Oracle GraalVM team
- date: 21 Nisan 2026
- category: runtime, security, platform-engineering
- tags: jdk-21.0.11, jdk-25.0.3, jdk-26.0.1, graalvm, tzdata-2026a, tls, cpu
- summary: Oracle CPU ile desteklenen JDK hatları aynı gün patch aldı. `JDK 21.0.11`, `TZDB 2026a` ve `Chunghwa` kök sertifikalarına yönelik yeni distrust davranışını içeriyor. GraalVM de aynı patch ritmine hizalı.
- why_it_matters: Runtime patch seviyesi ile uygulama dependency seviyesi birlikte hareket etmediğinde Spring servisleri farklı TLS, zaman ve güven davranışları sergileyebilir.
- java_spring_relevance: Spring Boot servisleri çoğunlukla container, buildpack veya managed runtime üzerinde çalışıyor; JDK farkı doğrudan HTTP/TLS, scheduler ve native image davranışını etkiler.
- actionability: runtime_image_ve_ci_hizalama
- impact_level: yüksek
- opportunities: Tek patch penceresinde JDK, GraalVM ve Boot dependency baseline'ını standardize etmek.
- risks: Sertifika zinciri sorunları, zaman dilimi farkları, CI ile prod arasında patch seviyesi kayması.
- migration_notes: Base image, buildpack, CI runner ve geliştirici JDK'ları eş zamanlı güncelleyin. TLS entegrasyon testlerini ve time-zone hassas iş akışlarını patch sonrası yeniden çalıştırın.

### Bulgu 5

- title: JDK 27 çeviri kaynağı temizliği bazı OpenJDK dağıtımlarında test kırabilir
- source: [Inside Java - Quality Outreach Heads-up - JDK 27: Obsolete Translation Resources Removed](https://inside.java/2026/04/21/quality-heads-up/), [OpenJDK JDK 27 Project Page](https://openjdk.org/projects/jdk/27/)
- author: David Delabassee
- date: 21 Nisan 2026
- category: compatibility, i18n, early-access
- tags: jdk-27, localization, qa, openjdk-distributions, tests, ci
- summary: JDK 27, bakımı yapılmayan locale çeviri kaynaklarını kaldırıyor. Oracle JDK ve `jdk.java.net` EA build'leri etkilenmiyor; ancak diğer bazı OpenJDK dağıtımlarında desteklenmeyen locale çıktıları İngilizceye dönebilir.
- why_it_matters: Locale'a bağlı testler ve sabit JDK mesaj beklentileri, uygulama kodu değişmeden kırılabilir.
- java_spring_relevance: Spring test paketlerinde exception mesajı, bind hatası veya locale bazlı log/assertion kalıpları hâlâ sık görülüyor.
- actionability: erken_uyumluluk_testi
- impact_level: orta
- opportunities: Mesaj metni yerine hata tipi ve kod bazlı assertion standardına geçmek.
- risks: JDK dağıtımı değiştiğinde CI ve prod davranışının ayrışması, gizli i18n bağımlılıklarının ortaya çıkması.
- migration_notes: Mesaj içeriğine dayalı testleri azaltın. Hedeflediğiniz gerçek JDK dağıtımıyla JDK 27 EA smoke test çalıştırın. Locale'a bağlı çıktıları sözleşme yerine gözlemsel veri olarak ele alın.

### Bulgu 6

- title: Runtime dağıtımı ve support ownership yeniden stratejik karar haline geliyor
- source: [Choosing the Right OpenJDK Distribution for Production](https://foojay.io/today/which-java-runtime-should-you-use-in-production-comparing-openjdk-distributions/), [Spring Support Policy](https://spring.io/support-policy), [Baeldung Java Weekly 643](https://www.baeldung.com/java-weekly-643)
- author: Catherine Edelveis, Spring Team, Baeldung editörleri
- date: 18 Nisan 2026, 23 Nisan 2026
- category: platform-engineering, supply-chain, roadmap
- tags: openjdk-distributions, support, temurin, liberica, zulu, corretto, semeru, sapmachine, spring-support-policy
- summary: Harici kürasyon ve vendor karşılaştırmaları, Java runtime seçiminin artık yalnızca "hangi JDK sürümü" sorusu olmadığını; support ownership, patch ritmi ve platform uyumu sorusu olduğunu tekrar vurguluyor.
- why_it_matters: JDK 27 heads-up'ları ve CPU patch ritmi, prod ile CI arasında aynı vendor/distribution kullanılmıyorsa beklenmeyen farklar doğurabilir.
- java_spring_relevance: Spring Boot ekipleri için aynı servis; farklı container image, farklı buildpack ve farklı JDK vendor ile farklı davranabilir.
- actionability: platform_karari_ve_standartlastirma
- impact_level: orta
- opportunities: Runtime standardizasyonu, support ve patch penceresini sadeleştirme, native image ve observability toolchain uyumunu iyileştirme.
- risks: Vendor özel yamalar veya support boşlukları nedeniyle CI/prod sapması, EOL yaklaşırken güvenlik görünürlüğünün azalması.
- migration_notes: Bu bulgu release değil, dayanıklı bir yön sinyali. Tek bir standart JDK dağıtımı, tek patch politikası ve açık support ownership kararı belirlemek değerli olur.

## Sonuç

24 Nisan 2026 koşusunda en yüksek karar değeri taşıyan konu `Spring Boot 3.5.14` ve `4.0.6` yamaları oldu. Bu yayınlar, Spring Boot kullanan ekiplerin güvenlik riskini yalnızca uygulama kodunda değil, default filter chain, SSL bundle ve runtime yardımcı bileşenlerinde de araması gerektiğini tekrar gösteriyor.

İkinci büyük sinyal, `Spring Boot 4.1.0-RC1` ile release train'in operasyonel olarak ciddileşmesi. OpenTelemetry env vars, SSRF azaltımı, lazy JDBC connection fetching ve Redis listener auto-config; 4.1 hattının kurumsal platform ekipleri için yakın dönem pilot gündemine alınması gerektiğini gösteriyor.

Üçüncü olarak Redis, Spring stack içinde daha geniş bir koordinasyon rolüne geçiyor. Bu iyi bir fırsat, fakat yalnızca cache, pub/sub ve lock davranışlarını aynı operasyonel sözleşme altında netleştirebilen ekipler için. JVM tarafında ise Oracle CPU ve JDK 27 heads-up'ları, runtime patch seviyesinin artık Spring dependency düzeyi kadar önemli olduğunu net biçimde teyit ediyor.
