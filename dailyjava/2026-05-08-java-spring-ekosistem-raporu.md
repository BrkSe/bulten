# Günlük Java / Spring Ekosistem Raporu

Tarih: 8 Mayıs 2026  
Tarama zamanı: 8 Mayıs 2026 09:10 TSİ  
Odak: Spring çekirdek güvenlik yamaları, Spring Boot 4.1 RC1’in operasyonel etkileri, mesajlaşma/integration release adayları, Spring AI SDK konsolidasyonu, OpenJDK’nin performans ve PQC yönü

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring Boot proje/dokümantasyon sayfaları](https://docs.spring.io/spring-boot/index.html), [Spring Security dokümantasyonu](https://docs.spring.io/spring-security/reference/index.html), [Spring Authorization Server proje sayfası](https://spring.io/projects/spring-authorization-server), [Spring AI release duyurusu](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/), [Spring for Apache Kafka duyurusu](https://spring.io/blog/2026/04/22/spring-kafka-4/), [Spring Integration 7.1.0-RC1 duyurusu](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/), [Spring Modulith 2.1 RC1 duyurusu](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/), [OpenJDK JEP Index](https://openjdk.org/jeps/), [JEP 522](https://openjdk.org/jeps/522), [JEP 527](https://openjdk.org/jeps/527), [Oracle Java Blog](https://blogs.oracle.com/java/the-arrival-of-java-26), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/news/), [Baeldung](https://www.baeldung.com/spring-ai-series), [Josh Long - This Week in Spring, 5 Mayıs 2026](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026/), [Gunnar Morling’in son yazıları](https://www.morling.dev/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Bugün InfoQ ve Josh Long tarafı resmi release dalgasını doğruluyor; Baeldung ve Burak KUTBAY tarafında ise üretim önceliğini tek başına değiştirecek yeni release/incident sinyali görünmüyor.

## Öne Çıkan Başlıklar

- 17-23 Nisan 2026 arasında yayımlanan [Spring Framework 6.2.18/7.0.7](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/), [Spring Security 6.5.10/7.0.5/7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/), [Spring Boot 3.5.14](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now/) ve [Spring Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/) birlikte okunduğunda, Spring’in çekirdek web ve security katmanında koordineli bir patch zinciri oluştuğu görülüyor.
- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/) yeni feature sayısından çok, platform ekiplerini ilgilendiren üç kritik konu getiriyor: OpenTelemetry environment variable eşlemesi, `InetAddressFilter` ile SSRF sertleştirmesi ve `spring.datasource.connection-fetch=lazy`.
- [Spring AI 1.0.6 / 1.1.5 / 2.0.0-M5](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/) bu kez yalnız provider değişimi değil, aynı zamanda güvenlik düzeltmeleri ve resmi `openai-java` SDK’sı etrafında sadeleşme getiriyor.
- [Spring for Apache Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4/) ve [Spring Integration 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/) olay güdümlü sistemler için failure semantics tarafında daha olgun varsayımlar sunuyor.
- [JEP 527](https://openjdk.org/jeps/527) ve [Inside Java’nın PQC anlatımı](https://inside.java/2026/04/08/javaone-post-quantum-cryptography/) birlikte okunduğunda JDK 27 ile TLS 1.3 tarafında post-quantum hibrit anahtar değişimi artık gerçek bir yakın-vade platform konusu haline geliyor.

## Kritik Güncellemeler

### Spring çekirdeğinde güvenlik yama zinciri oluştu

Bu haftanın en yüksek sinyali tek bir CVE değil, katmanlı bir patch zinciri:

- [Spring Framework 6.2.18 ve 7.0.7](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/) WebFlux multipart temp file DoS, static resource cache poisoning ve Windows static resource DoS açıklarını kapatıyor.
- [Spring Security 6.5.10, 7.0.5 ve 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-security-releases) kullanıcı attribute enumeration, X.509 impersonation, `withIssuerLocation` yanlış güvenlik varsayımı, servlet path matching sorunları ve one-time token tekrar kullanımını düzeltiyor.
- [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/) dynamic client registration metadata validation açığını kapatıyor.
- [Spring Boot 3.5.14](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now/) ve [4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/) TLS hostname verification, weak PRNG, predictable temp directory, PID symlink ve Actuator security chain gibi doğrudan ops davranışına dokunan açıkları kapatıyor.

Buradaki kritik nokta, bir Spring Boot servisinin gerçek risk yüzeyinin yalnız framework veya yalnız security bağımlılığı ile açıklanamaması. Auto-configuration, starter zinciri ve auth server katmanı birlikte ele alınmalı.

### Spring Authorization Server artık geçiş rejiminde

[Spring Authorization Server proje sayfası](https://spring.io/projects/spring-authorization-server) açık şekilde şunu söylüyor: Spring Authorization Server, Spring Security `7.0` içine taşındı; `1.5.x` hattı son nesil. Bu, standalone Authorization Server kullanan ekipler için yalnız patch almak değil, orta vadeli mimari yönü de netleştiriyor.

### Spring Boot 4.1.0-RC1, prod öncesi platform testi istiyor

[Spring Boot 4.1.0-RC1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes) birkaç özellikle öne çıkıyor:

- OpenTelemetry environment variable’larının Boot config yüzeyine eşlenmesi
- `InetAddressFilter` ile blocking ve reactive HTTP client’larda SSRF azaltımı
- `spring.datasource.connection-fetch=lazy` ile `LazyConnectionDataSourceProxy` tabanlı geç bağlanma
- `@RedisListener` auto-configuration
- gRPC tarafında referans dokümantasyon ve `@GrpcAdvice`

Bu sürüm doğrudan GA tavsiyesi değil; fakat Boot 4 yol haritası olan ekiplerin pre-GA testlerini ertelememesi gerekiyor.

## Trendler ve Sinyaller

### 1. “Security by default” Spring’in daha alt katmanlarına iniyor

Tekrarlanan desen açık:

- TLS hostname verification
- SSRF engelleme
- temp file ve temp directory sahiplik/doğrulama
- path matching doğruluğu
- auth metadata validation
- default filter chain davranışı

Yani risk yüzeyi artık yalnız `@PreAuthorize` ya da JWT doğrulama değil; client-side auto-config ve operasyonel varsayımlar da aynı derecede kritik.

### 2. Release candidate kullanımı artık yalnız merak değil, platform hazırlığı

[Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/), [Spring Security 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Integration 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/), [Spring Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4/) ve [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/) aynı pencereye yığılmış durumda. Bu, Spring takımının yeni nesil platform treni için entegrasyon yüzeyini hızla dondurduğunu gösteriyor.

### 3. Event-driven tarafta “retry” yerine daha net yürütme semantiklerine gidiliyor

[Spring Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4/) share consumer ack modları, async commit callback’leri, lifecycle event’leri ve Kafka Streams tarafında KIP-1034 uyumu getiriyor. [Spring Integration 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/) Redis lock yenileme/serbest bırakma semantiklerini daha deterministik hale getiriyor. [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/) ise event publication registry ve JobRunr transaction handling tarafını iyileştiriyor.

Bu üçü birlikte okunduğunda mesaj şu: olay güdümlü Java yığını giderek “ne zaman retry ettim?” sorusundan “hangi yürütme semantiğini garanti ediyorum?” sorusuna kayıyor.

### 4. OpenJDK tarafında yenilik dili değil, runtime varsayımı değişiyor

[Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26), [JEP 522](https://openjdk.org/jeps/522), [Inside Java’nın Java 26 for DevOps yazısı](https://inside.java/2026/03/02/jdk-26-rn-ops/) ve [JEP 527](https://openjdk.org/jeps/527) birlikte ele alındığında iki kalıcı sinyal öne çıkıyor:

- G1 throughput iyileştirmeleri artık “GC tuning” değil, genel amaçlı servis performansına temas eden varsayımlar üretiyor.
- TLS 1.3 için hibrit post-quantum key exchange, uygulama kodu değiştirmeden davranış etkisi yaratabilecek bir güvenlik geçişi hazırlıyor.

## Araçlar ve Kütüphaneler

- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/): Yüksek öncelik. Prod’a değil, platform laboratuvarına alınmalı.
- [Spring for Apache Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4/): Yüksek öncelik. Özellikle Kafka Streams, DLQ ve share consumer kullanan ekipler için.
- [Spring Integration 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/): Orta-yüksek öncelik. Redis kilitleri ve JMS altyapısı kullanan ekiplerde anlamlı.
- [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/): Orta öncelik. Özellikle modüler monolith ve domain event yönetimi yapan ekiplerde.
- [Spring AI 2.0.0-M5 / 1.1.5 / 1.0.6](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/): Yüksek öncelik, ama yalnız Spring AI kullanan ekipler için.
- [Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/): Düşük-orta öncelik. Veri servisleri, object storage ve Parquet yoğun iş yükleri için ilginç; tipik Spring Boot mikroservis backlog’unu bugün tek başına değiştirmez.

Bugün observability, Kubernetes operatörleri veya test araçları tarafında tek başına zorunlu upgrade üreten bağımsız yeni bir Java/Spring release görünmüyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Boot servisleri için yalnız parent/BOM sürümü değil, altında taşınan security ve auth katmanı da doğrulanmalı. “Boot yükseldi, konu kapandı” yaklaşımı yetersiz.
- Auth server kullanan ekipler, `1.5.x` hattını sürdürülebilir son durak gibi değil, Spring Security 7’ye geçiş köprüsü gibi görmeli.
- Platform ekipleri Boot 4.1 RC1’i özellikle şu senaryolarda test etmeli: outbound HTTP güvenliği, trace/metrics config standardizasyonu, connection pool tüketimi, Redis listener davranışı.
- Kafka/Streams kullanan ekipler, native DLQ ve yeni exception handler akışlarını kendi retry/DLT mimarileriyle karşılaştırmalı; bazı custom wrapper’lar gereksiz hale gelebilir.
- Java 26 ve 27 laboratuvarında yalnız benchmark koşmak yetmez; TLS terminator, service mesh, proxy ve locale/regression davranışları da denenmeli.
- Spring AI kullanan ekiplerde konu yeni model eklemek değil, hangi modüllerin ana repodan çıktığı ve hangi SDK yüzeyinin standart hale geldiği.

## Fırsatlar ve Riskler

### Fırsatlar

- Güvenlik patch zincirini fırsata çevirip desteklenen Spring hatlarına sade bir geçiş planı kurulabilir.
- Boot 4.1 RC1’deki OTel env var desteği, çok ortamlı deployment’larda config standardizasyonunu kolaylaştırabilir.
- `InetAddressFilter`, SSRF savunmasını uygulama içinde tekrar yazmak yerine platform standardı haline getirme fırsatı sunuyor.
- Kafka/Integration tarafındaki yeni semantiklerle retry, DLT ve lock davranışlarında custom altyapı kodu azaltılabilir.
- JDK 27 PQC hazırlığı, finans ve regülasyon baskısı yüksek kurumlarda erken uyum avantajı sağlayabilir.

### Riskler

- Destek dışına çıkan Spring Security ve Authorization Server hatlarında kalmak, bir sonraki advisory dalgasında doğrudan yamaya erişememe riski taşır.
- Boot 4.1 RC1’in dependency train’i, üçüncü parti starter veya kurum içi auto-config katmanlarında sürpriz uyumsuzluk üretebilir.
- PQC hibrit TLS desteği, uygulama kodu değiştirmeden network middlebox ve handshake uyumluluğu problemi yaratabilir.
- Spring AI 2.x çizgisinde modül kaldırımları compile-time kırıklar kadar config drift de yaratabilir.
- Redis 8.4+ CAS/CAD optimizasyonları güzel görünse de heterojen Redis filolarında fallback davranışı ayrıca doğrulanmalı.

## İzlenmesi Gereken Konular

- Spring Boot `4.1.0` GA’ye kadar `InetAddressFilter`, lazy connection fetch ve OTel env var eşlemesinde yeni migration notları gelip gelmeyeceği.
- Spring Security `7.1.0` ve Spring Authorization Server sonrası resmi geçiş dokümantasyonunun ne kadar netleşeceği.
- Spring Kafka `4.1` GA hattında KIP-1034 ve KIP-1071 etrafında API veya davranış netleşmelerinin sürüp sürmeyeceği.
- JDK 27 tarafında [JEP 527](https://openjdk.org/jeps/527) dışındaki security ve compatibility heads-up’ların artıp artmayacağı.
- [Inside Java Quality Outreach: obsolete translation resources removed](https://inside.java/2026/04/21/quality-heads-up/) uyarısının framework ve enterprise localization paketlerine etkisi.
- [Gunnar Morling’in Hardwood 1.0 yol haritası](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/): veri ekipleri için izlemeye değer; klasik Spring servisleri için düşük öncelik.
- [Burak KUTBAY blogu](https://blog.burakkutbay.com/) bugün yeni release sinyali üretmiyor; ancak Türkçe öğrenme/danışma içeriği olarak Spring Framework 7 API versiyonlama ve Spring Boot 4 HTTP Service Client yazıları faydalı.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring’in çekirdek web ve security katmanında koordineli patch zinciri oluştu
- source: [Spring Framework 6.2.18 ve 7.0.7](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/), [Spring Security 2026.04 Releases](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/), [Spring Boot 3.5.14](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now/), [Spring Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/), [Spring Authorization Server project page](https://spring.io/projects/spring-authorization-server)
- author: Stéphane Nicoll, Josh Cummings, Joe Grandja, Andy Wilkinson
- date: 17-23 Nisan 2026
- category: security, spring-boot, spring-security, spring-framework, auth
- tags: cve, tls, actuator, x509, auth-server, supported-versions, hotfix
- summary: Spring Framework, Spring Security, Authorization Server ve Spring Boot aynı hafta içinde web, auth, TLS ve temp file/path davranışlarını etkileyen güvenlik yamaları yayımladı. Bu, risk yüzeyinin katmanlar arası olduğunu netleştiriyor.
- why_it_matters: Tek bir bağımlılığı güncellemek artık yeterli değil; framework, security, auto-configuration ve auth server birlikte ele alınmalı.
- java_spring_relevance: Tüm Spring Boot ve Spring Security tabanlı servisler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Desteklenen sürümlere sadeleşme, security upgrade akışını otomatikleştirme, supported-version politikasını servis kataloğuna bağlama.
- risks: TLS hostname verification kusurları, auth misconfiguration, token tekrar kullanımı, cache poisoning, unsupported line üzerinde kalma.
- migration_notes: OSS tarafta hedef çizgi olarak en az Spring Boot `3.5.14` veya `4.0.6`, Spring Security `6.5.10` veya `7.0.5` düşünülmeli; standalone Spring Authorization Server kullanan ekipler `1.5.x` hattını geçiş köprüsü olarak planlamalı.

### Bulgu 2

- title: Spring Boot 4.1.0-RC1 platform güvenliği ve operasyonel ayarlar için gerçek bir pre-GA test noktası
- source: [Spring Boot 4.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/), [Spring Boot 4.1.0-RC1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes), [Spring Boot docs index](https://docs.spring.io/spring-boot/index.html)
- author: Andy Wilkinson, Spring Boot team
- date: 23 Nisan 2026
- category: platform, boot, observability, security, operations
- tags: spring-boot-4.1, opentelemetry, ssrf, inetaddressfilter, datasource, grpc, redis
- summary: Boot 4.1.0-RC1; OTel environment variable desteği, `InetAddressFilter` ile HTTP client SSRF sertleştirmesi, lazy JDBC connection fetching, `@RedisListener` auto-config ve güncellenmiş dependency train ile geliyor.
- why_it_matters: Bu değişiklikler uygulama feature’ından çok platform davranışını değiştiriyor; tracing, outbound network policy ve DB pool tüketimi üzerinde doğrudan etkili.
- java_spring_relevance: Boot 4 ve yeni platform treni hedefleyen Java/Spring ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: OTel konfigürasyon standardizasyonu, SSRF hardening, daha verimli connection pool kullanımı, RC dönemde uyumluluk yakalama.
- risks: RC dependency zincirinde üçüncü parti starter uyumsuzlukları, proxy varsayımlarındaki değişimin yan etkileri, yeni config yüzeyinin eksik test edilmesi.
- migration_notes: Prod geçişi için erken; ancak staging/lab ortamında outbound HTTP, proxy davranışı, lazy connection fetch ve Redis listener senaryoları özellikle çalıştırılmalı.

### Bulgu 3

- title: Spring AI M5 hattı güvenlik düzeltmelerini SDK konsolidasyonu ve modül daralmasıyla birlikte getiriyor
- source: [Spring AI 1.0.6, 1.1.5, 2.0.0-M5 Available Now](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/)
- author: Ilayaperumal Gopinathan, Spring AI Team
- date: 27 Nisan 2026
- category: ai, release, migration, security
- tags: spring-ai, openai-java, azure-openai, vertex-ai, zhipuai, oci-genai, combinewith
- summary: Spring AI’nin yeni sürümleri çok sayıda güvenlik düzeltmesi içerirken, 2.0.0-M5 hattı resmi `openai-java` SDK’sında birleşiyor ve bazı provider modüllerini ana depodan çıkarıyor.
- why_it_matters: Spring AI kullanan ekipler için konu yalnız yeni capability değil; dependency yüzeyi, starter seçimi ve test kapsamı yeniden düşünülmeli.
- java_spring_relevance: Spring AI kullanan ekipler için yüksek, diğer Spring ekipleri için düşük öncelik.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Tekil SDK standardı, ChatClient etrafında sadeleşme, native structured output ve usage metrics ile daha temiz entegrasyon.
- risks: compile-time kırıkları, config drift, çıkarılan provider modüller yüzünden sessiz runtime sürprizleri.
- migration_notes: `ModelOptionUtils.merge()` benzeri kullanımlar `combineWith()` ile gözden geçirilmeli; Azure OpenAI için standart `spring-ai-openai` yaklaşımı test edilmeli; ana repodan ayrılan provider modülleri envanterlenmeli.

### Bulgu 4

- title: Mesajlaşma ve entegrasyon katmanı failure semantics tarafında olgunlaşıyor
- source: [Spring for Apache Kafka 4.1.0-RC1, 4.0.5, and 3.3.15](https://spring.io/blog/2026/04/22/spring-kafka-4/), [Spring Integration 7.1.0-RC1 Available](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/), [Spring Modulith 2.1 RC1, 2.0.6, and 1.4.11 released](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/)
- author: Soby Chacko, Glenn Renfro, Oliver Drotbohm
- date: 21-24 Nisan 2026
- category: messaging, integration, event-driven, architecture
- tags: kafka, kafka-streams, dlq, kips, redis-locks, jms, modulith, jobrunr
- summary: Spring Kafka yeni ack/commit/lifecycle semantiklerini ve Kafka Streams hata akışını güçlendiriyor; Spring Integration Redis lock ve JMS yüzeyini iyileştiriyor; Spring Modulith event publication registry ve JobRunr transaction handling tarafını rafine ediyor.
- why_it_matters: Olay güdümlü Java sistemlerinde reliability davranışı artık daha fazla framework seviyesinde ifade edilebiliyor.
- java_spring_relevance: Kafka, Redis, JMS veya domain event yoğun Spring ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Custom retry/DLT glue kodunu azaltmak, daha net event lifecycle görünürlüğü, modüler domain event akışlarını sadeleştirmek.
- risks: RC API değişiklikleri, broker/Redis versiyon bağımlılıkları, mevcut custom error handler’larla çakışma.
- migration_notes: Kafka Streams tarafında KIP-1034 tabanlı handler yaklaşımı mevcut DLT stratejileriyle karşılaştırılmalı; Redis 8.4+ ve older fallback davranışı ayrı test edilmeli; JobRunr kullanan Modulith ekipleri transaction semantiğini doğrulamalı.

### Bulgu 5

- title: OpenJDK tarafında hem performans varsayımları hem de TLS güvenlik varsayımları değişiyor
- source: [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [Java 26 for DevOps](https://inside.java/2026/03/02/jdk-26-rn-ops/), [JEP 522](https://openjdk.org/jeps/522), [JEP 527](https://openjdk.org/jeps/527), [Java and Post-Quantum Cryptography](https://inside.java/2026/04/08/javaone-post-quantum-cryptography/), [Quality Outreach Heads-up - JDK 27: Obsolete Translation Resources Removed](https://inside.java/2026/04/21/quality-heads-up/)
- author: Sharat Chander, Billy Korando, Sean Mullan, OpenJDK
- date: 17 Mart 2026 - 21 Nisan 2026
- category: jdk, runtime, security, performance, compatibility
- tags: java-26, java-27, g1, pqc, tls-1.3, ml-kem, localization
- summary: JDK 26 G1 throughput iyileştirmeleri ve operasyonel değişiklikler getirirken, JDK 27 için hibrit post-quantum TLS 1.3 anahtar değişimi tamamlanmış durumda. Aynı anda bazı compatibility heads-up’lar da görünür hale geliyor.
- why_it_matters: Uygulama kodunu değiştirmeden JVM runtime ve TLS handshake davranışı değişebilir; bu, özellikle büyük kurumsal filolarda önemlidir.
- java_spring_relevance: JVM üzerinde çalışan tüm Spring servisleri için orta-yüksek.
- actionability: izlemeye_deger_ve_lab
- impact_level: orta-yüksek
- opportunities: G1 throughput artışından faydalanmak, kuantum-sonrası TLS hazırlığını erkenden yapmak, runtime laboratuvarını daha disiplinli kurmak.
- risks: TLS terminator/middlebox uyumsuzlukları, localization regresyonları, erken 27 geçişlerinde beklenmedik davranış farkları.
- migration_notes: Java 26 benchmark’ları prod benzeri trafikle ölçülmeli; `jdk.tls.namedGroups` ve TLS uyumluluğu lab ortamında test edilmeli; locale bağımlı uygulamalar JDK 27 EA ile erkenden denenmeli.

### Bulgu 6

- title: Hardwood 1.0.0.Beta2 veri servisleri için izlenebilir yeni bir Java aracı
- source: [VARIANT Support, Interactive Parquet File TUI: Hardwood 1.0.0.Beta2 Is Out](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/)
- author: Gunnar Morling
- date: 29 Nisan 2026
- category: tools, data, performance, oss
- tags: parquet, s3, cli, tui, java-21, performance
- summary: Hardwood Beta2; VARIANT kolon desteği, interaktif Parquet TUI, daha verimli S3 okuma ve daha düşük allocation baskısı getiriyor. 1.0 finalin Mayıs içinde gelmesi hedefleniyor.
- why_it_matters: Doğrudan Spring çekirdeği konusu değil; fakat Java tabanlı veri servisleri ve object storage iş yükleri için ilginç bir ekosistem sinyali.
- java_spring_relevance: Tipik Spring Boot CRUD/microservice ekipleri için düşük; veri işleme ve lakehouse çevresindeki Java ekipleri için orta.
- actionability: dusuk_oncelik_izleme
- impact_level: düşük-orta
- opportunities: Hafif Parquet işleme, S3 üstünde daha verimli analiz araçları, Java 21+ veri servislerinde alternatif parser.
- risks: Erken beta olgunluğu, klasik kurumsal Spring servisleri için sınırlı doğrudan fayda.
- migration_notes: Spring backlog’una zorunlu girdi değil; veri tarafı ihtiyaç varsa laboratuvar düzeyinde denenmeli.

## Sonuç

8 Mayıs 2026 itibarıyla en yüksek değerli sinyal, Spring ekosisteminde güvenliğin daha çok framework ile ops katmanı arasındaki gri bölgede yoğunlaşması. Kısa vadede yapılacak en doğru iş, desteklenen Spring Boot/Security/Auth Server hatlarına kararlı yükseltme planı çıkarmak ve Boot 4.1 RC1’i feature değil platform testi olarak ele almak. Orta vadede ise olay güdümlü semantiklerin framework seviyesine taşınması ve JDK’nin TLS/PQC yönü, mimari kararları etkileyebilecek daha kalıcı hareketler olarak izlenmeli.
