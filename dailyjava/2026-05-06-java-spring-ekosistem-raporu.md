# Günlük Java / Spring Ekosistem Raporu

Tarih: 6 Mayıs 2026  
Tarama zamanı: 6 Mayıs 2026 09:08 TSİ  
Odak: Spring Boot/Security patch dalgası, Spring AI güvenlik sinyalleri, event-driven stack’te RC sertleşmesi

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring proje sayfaları](https://spring.io/projects/), [Spring Security Advisories](https://spring.io/security/), [Spring Boot 4.1.0-RC1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/), [Oracle Java Blog](https://blogs.oracle.com/java), [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [Inside Java](https://inside.java/), [InfoQ Java/Spring içerikleri](https://www.infoq.com/spring/), [MCP in the Java World](https://www.infoq.com/articles/mcp-java-architectural-strategy-llm-integrations/), [Baeldung Spring AI Series](https://www.baeldung.com/spring-ai-series), [Josh Long - This Week in Spring, 5 Mayıs 2026](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026/), [Gunnar Morling’in son yazıları](https://www.morling.dev/blog/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Oracle/Inside Java tarafında bugün Spring ekiplerinin sprint planını doğrudan değiştirecek yeni bir backend duyurusu yok; bu nedenle rapor ağırlığı 21-28 Nisan 2026 arasındaki Spring release ve güvenlik sinyallerine verildi.

## Öne Çıkan Başlıklar

- Bugünün en acil işi yeni özellik denemek değil, [Spring Boot 3.5.14](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now/) ve [4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/) ile gelen CVE düzeltmelerini üretim filolarına hızla taşımak.
- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/) yalnız bir RC değil; outbound HTTP sertleştirme, lazy JDBC connection fetching, Redis listener autoconfig ve OTel environment variable desteği ile operasyon modelini değiştiriyor.
- [Spring Security 6.5.10 / 7.0.5 / 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-security-releases/) ve [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/) hattı bir yandan çoklu CVE kapatırken bir yandan eski jenerasyonların açık kaynak desteğinin bittiğini netleştiriyor.
- [Spring Security Advisories](https://spring.io/security/) üzerinde 27-28 Nisan 2026’da yayımlanan Spring AI ve Spring gRPC açıkları, Java’da AI/gRPC kullanımının artık “demo katmanı” değil gerçek güvenlik mühendisliği konusu olduğunu gösteriyor.
- [Spring Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4/) ve [Spring Modulith 2.1.0-RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/) event-driven mimaride daha açık ack, recovery, event publication ve transaction semantiği yönüne gidiyor.

## Kritik Güncellemeler

### Spring Boot 3.5.14 ve 4.0.6 bekletilecek bakım sürümleri değil

[Spring Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/) sekiz CVE; [Spring Boot 3.5.14](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now/) altı CVE kapatıyor. Özellikle TLS hostname verification’ın Elasticsearch/RabbitMQ/Cassandra auto-configuration altında etkisiz kalması, `RandomValuePropertySource` için zayıf PRNG kullanımı, `ApplicationTemp` ve PID file symlink davranışları ve remote DevTools timing attack konusu doğrudan operasyon güvenliği etkisi taşıyor. 4.0.6’ya özel olarak actuator/security filter chain davranışı da düzeltiliyor.

### Spring Boot 4.1 RC1 platform ekipleri için anlamlı bir sıçrama

[Spring Boot 4.1.0-RC1 blog duyurusu](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/) ve [release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes) birlikte okunduğunda öne çıkanlar net: OpenTelemetry environment variable desteği, `LazyConnectionDataSourceProxy` temelli lazy connection fetching, `@RedisListener` auto-configuration, `InetAddressFilter` ile outbound HTTP SSRF azaltımı ve gRPC desteğinin dokümantasyon/`@GrpcAdvice` tarafında olgunlaşması. Bu değişiklikler yalnız “yeni API” değil; config yüzeyi, connection pool davranışı ve güvenlik duruşu değişikliği.

### Spring Security ve Authorization Server tarafında destek sınırları sertleşti

[Spring Security 2026.04 release’leri](https://spring.io/blog/2026/04/21/spring-security-releases/) yedi farklı CVE düzeltmesi içeriyor. [Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/) ise dinamik client registration metadata doğrulamasındaki açığı kapatıyor. Daha önemlisi, Security 5.7/5.8/6.3/6.4 ve Authorization Server 1.3/1.4 hatlarının açık kaynak desteğinin bittiği açıkça söyleniyor. Bu, “uygun bir zamanda upgrade ederiz” alanını daraltıyor.

### Spring AI için bu haftanın esas hikâyesi yeni provider değil güvenlik

[Spring Security Advisories](https://spring.io/security/) sayfasında 27 Nisan 2026 tarihli Spring AI açıkları arasında filter expression converter injection, cross-tenant chat memory exfiltration, world-writable `/tmp` ONNX model cache, attacker-controlled PDF ile OOM ve `CosmosDBVectorStore.doDelete()` SQL injection yer alıyor. Spring AI kullanan ekipler için bugünün doğru refleksi yeni model eklemek değil; tenant izolasyonu, input escaping, temp file hijyeni ve dosya işleme sınırlarını test etmek.

## Trendler ve Sinyaller

### 1. Spring 4.1 hattı “framework feature” değil “platform control surface” olarak büyüyor

[Spring Boot 4.1 RC1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes) gösteriyor ki 4.1 hattındaki anlamlı kazanım yalnız starter sayısı değil; çevresel OTel config, SSRF filtreleri, Redis listener varsayılanları, gRPC error handling ve lazy JDBC davranışı gibi platform-level kontroller.

### 2. Güvenlik yüzeyi artık yalnız web katmanında değil

[Spring Security Advisories](https://spring.io/security/) tarafında aynı hafta içinde Spring Boot, Spring AI ve Spring gRPC açıklarının görünmesi önemli bir tekrar eden sinyal. Java/Spring dünyasında risk yüzeyi artık `HttpSecurity` ile sınırlı değil; outbound client, vector store, model cache, gRPC worker thread ve temp directory davranışı da güvenlik backlog’una girmiş durumda.

### 3. Event-driven stack daha açık semantik istiyor

[Spring Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4/) ve [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/) birlikte okunduğunda ortak yön şu: ack mode, async commit, DLQ/recovery, event publication registry ve transaction handling gibi önce “altyapı detayı” sayılan konular artık first-class API haline geliyor.

### 4. Java AI mimarisi model seçiminden çok protokol ve yönetişim tartışmasına kayıyor

[InfoQ’daki MCP yazısı](https://www.infoq.com/articles/mcp-java-architectural-strategy-llm-integrations/), [Baeldung Spring AI Series](https://www.baeldung.com/spring-ai-series) ve [Josh Long’un haftalık özeti](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026/) birlikte düşünüldüğünde kalıcı yatırım alanı provider soyutlaması değil; MCP/tool sınırları, memory yönetimi, authorization ve güvenli çok-tenant mimari.

### 5. Java platform tarafında panik yok, fakat lab zamanı var

[The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26) mikroservis ve platform ekipleri için HTTP/3 client desteği, AOT object caching with any GC, structured concurrency, PEM encoding API ve final-field uyarı rejimini aynı pakette getiriyor. Bu alanlar bugün acil patch konusu değil; fakat 2026 ikinci yarısı için performans ve runtime deneyleri yapılacak doğru zemin burada.

## Araçlar ve Kütüphaneler

- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/): Yüksek öncelik. Özellikle platform ekipleri ve Boot 4.1 pilotları için.
- [Spring Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/) / [3.5.14](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now/): Çok yüksek öncelik. Doğrudan güvenlik bakım sürümleri.
- [Spring Security 7.1.0-RC1 / 7.0.5 / 6.5.10](https://spring.io/blog/2026/04/21/spring-security-releases/): Çok yüksek öncelik. CVE kapanışları ve destek politikası etkisi var.
- [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/): Yüksek öncelik. Özellikle dynamic client registration kullanan ekipler için.
- [Spring for Apache Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4/): Orta-yüksek öncelik. Ack/DLQ/recovery semantiği değişiyor.
- [Spring Modulith 2.1.0-RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/): Orta-yüksek öncelik. Modüler monolith ve outbox/event publication kullanan ekipler için.
- [Spring for Apache Pulsar 2.0.5 / 1.2.17](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available/): Orta öncelik. Pulsar 4.2.0 hizalaması nedeniyle broker tarafı upgrade planı olan ekipler için önemli.
- [Spring Shell 4.0.2](https://spring.io/blog/2026/04/24/spring-shell-4-0-2-is-out/): Düşük-orta öncelik. CLI/GraalVM native image kullanan ekipler için faydalı.
- [Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26): İzleme/lab önceliği. Özellikle HTTP client ve startup/warmup optimizasyonu için.

Bugün testing, CI/CD ve Kubernetes tarafında tek başına backlog’u değiştirecek ayrı bir Java/Spring release sinyali görünmüyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Eğer Boot 3.5.x veya 4.0.x üzerindeyseniz, patch penceresini ertelemek teknik olarak savunulabilir değil; bu sürümler güvenlik davranışını etkileyen auto-config düzeltmeleri içeriyor.
- Boot 4.1 RC1 pilotu yapan ekipler, `spring.datasource.connection-fetch`, outbound HTTP allow/deny stratejisi, Redis listener varsayılanları ve gRPC exception handling davranışını entegrasyon testlerine eklemeli.
- Spring Security eski hatlarda kalan ekipler, açık kaynak destek sınırı nedeniyle “desteklenen sürümde ama eski patch” yaklaşımını bırakıp jenerasyon bazlı yol haritası çıkarmalı.
- Spring AI kullanan ekipler için güvenlik review checklist’i artık klasik web checklist’ten farklı olmalı: conversation scoping, vector store query escaping, file parser guardrail’leri ve temp/cache ownership kontrolü şart.
- Kafka veya event publication altyapısı olan ekipler, business logic review yerine ack/retry/commit semantics review yapmalı; bugünkü kazanım bu tarafta.
- JDK 26’ya bakacak platform ekipleri, HTTP/3 ve AOT cache tarafını canary servislerde ölçmeden geniş yayılıma gitmemeli.

## Fırsatlar ve Riskler

### Fırsatlar

- Boot 4.1 ile OTel environment variable desteği, container-first deployment ve platform standardizasyonunu kolaylaştırabilir.
- Lazy JDBC connection fetching, connection pool baskısını ve boş transaction maliyetini azaltabilir.
- `InetAddressFilter`, outbound HTTP SSRF kontrolünü uygulama içinde merkezi hale getirebilir.
- Spring Kafka 4.1 RC1, Streams tarafında native DLQ/recovery desenlerini sadeleştirebilir.
- Spring Modulith 2.1 RC1, JobRunr ve event publication registry iyileştirmeleriyle modüler monolith + async publication tasarımlarını daha güvenilir hale getirebilir.

### Riskler

- Boot hotfix’lerindeki TLS hostname verification ve weak PRNG sorunları düzeltilmeden kalan servisler “çalışıyor gibi görünen ama güvenlikçe kırık” durumda olabilir.
- `LazyConnectionDataSourceProxy` kullanımı bazı transaction/metrics beklentilerini sessizce değiştirebilir.
- Spring AI açıkları, çok-tenant memory ve vector store katmanında veri sızmasına kadar giden etkiler taşıyor.
- Spring gRPC tarafındaki 28 Nisan 2026 advisories, yeni eklenen gRPC yüzeyinin güvenlik takibi olmadan hızla üretime taşınmasının riskli olduğunu gösteriyor.
- Kafka share consumer ve async commit davranışları yanlış okunursa duplicate processing ya da beklenmeyen commit paternleri görülebilir.

## İzlenmesi Gereken Konular

- Spring AI advisories için tek tek fixed-version doğrulaması ve buna karşılık gelen maintenance release haritası.
- Spring Boot 4.1.0 GA’da RC1’deki SSRF, Redis listener ve lazy JDBC davranışlarının aynen korunup korunmadığı.
- [Spring Security Advisories](https://spring.io/security/) üzerindeki Spring gRPC açıkları için patch line ve Boot entegrasyon matrisi.
- [Spring Cloud proje sayfasındaki](https://spring.io/projects/spring-cloud/) uyumluluk tablosunun 2025.1.x/2025.0.x filolarında nasıl güncelleneceği; sayfa örneklerinde hâlâ `2025.1.0` BOM görülüyor, bu yüzden ekipler “en son patch” bilgisini release notes’tan doğrulamalı.
- Java 26 HTTP/3 ve AOT object caching’in gerçek servislerdeki latency/startup etkisi.
- MCP ve tool-calling mimarilerinde Java tarafında kurumsal authorization ve audit desenlerinin nasıl standartlaşacağı.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot 4.1.0-RC1 operasyonel kontrol yüzeyini büyütüyor
- source: [Spring Boot 4.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/), [Spring Boot 4.1.0-RC1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes)
- author: Andy Wilkinson, Spring Boot Team
- date: 23 Nisan 2026
- category: boot, platform, observability, security, release-candidate
- tags: spring-boot, 4.1-rc1, opentelemetry, ssrf, redis, jdbc, grpc
- summary: RC1; OpenTelemetry environment variable desteği, `spring.datasource.connection-fetch` ile lazy JDBC connection fetching, `@RedisListener` auto-configuration, outbound HTTP için `InetAddressFilter` ve `@GrpcAdvice` desteği getiriyor.
- why_it_matters: Bunlar “küçük iyileştirme” değil; config yönetimi, connection pool davranışı, outbound network güvenliği ve gRPC hata işleme semantiğini etkiliyor.
- java_spring_relevance: Boot 4.1/Framework 7.1 pilotu yapan Spring ekipleri için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: OTel standardizasyonu, daha verimli JDBC kullanımı, merkezileştirilmiş SSRF azaltımı, daha kolay Redis listener wiring.
- risks: Lazy connection fetching transaction ve ölçüm beklentilerini değiştirebilir; Redis starter’a gelen yeni transitive dependency davranış farkı üretebilir; network filter yanlış konfigüre edilirse internal servis erişimleri kırılabilir.
- migration_notes: `spring.datasource.connection-fetch=lazy` için entegrasyon testleri ekle; outbound HTTP target allowlist’lerini tasarla; `spring.data.redis.listener.*` ayarlarını değerlendir; gRPC exception mapping davranışını canary ortamda doğrula.

### Bulgu 2

- title: Spring Boot 4.0.6 ve 3.5.14 gerçek bir güvenlik patch dalgası
- source: [Spring Boot 4.0.6 available now](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/), [Spring Boot 3.5.14 available now](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now/), [Spring Security Advisories](https://spring.io/security/)
- author: Andy Wilkinson, Spring Team
- date: 23 Nisan 2026
- category: security, maintenance-release, operations
- tags: spring-boot, cve, tls, devtools, randomvaluepropertysource, applicationtemp, actuator
- summary: 4.0.6 ve 3.5.14; TLS hostname verification, remote DevTools timing attack, predictable temp directory, weak PRNG ve PID symlink davranışları dahil çoklu güvenlik açığını kapatıyor; 4.0.6 ayrıca varsayılan security filter chain davranışını da düzeltiyor.
- why_it_matters: Açıkların çoğu uygulama kodundan değil auto-configuration ve runtime yardımcı bileşenlerden geliyor; bu yüzden “uygulama güvenli görünüyor” yanıltıcı olabilir.
- java_spring_relevance: Boot 3.5.x ve 4.0.x kullanan neredeyse tüm ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: SSL bundle kullanımını kurumsal standartlarla yeniden doğrulamak, remote devtools ve temp directory hijyenini standart hale getirmek.
- risks: Hostname verification eksikliği, secret tahmini, local privilege escalation benzeri davranışlar, actuator güvenlik varsayımlarının bozulması.
- migration_notes: 3.5.x filolarını 3.5.14’e, 4.0.x filolarını 4.0.6’ya taşı; remote DevTools’u canlı ortamlarda kapalı tut; SSL bundle ile Elasticsearch/RabbitMQ/Cassandra bağlantılarını yeniden test et; `random.*` kullanan güvenlik amaçlı kodları gözden geçir.

### Bulgu 3

- title: Spring Security ve Authorization Server hattı hem CVE kapatıyor hem destek sınırını daraltıyor
- source: [Spring Security 2026.04 Releases - Contains CVE Fixes](https://spring.io/blog/2026/04/21/spring-security-releases/), [Spring Authorization Server 1.5.7 Available Now](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/)
- author: Josh Cummings, Joe Grandja
- date: 21 Nisan 2026
- category: security, identity, support-policy
- tags: spring-security, authorization-server, cve, x509, daoauthenticationprovider, one-time-token, support
- summary: Spring Security 6.5.10/7.0.5/7.1.0-RC1 yedi CVE kapatıyor; Authorization Server 1.5.7 dynamic client registration metadata doğrulamasındaki açığı gideriyor. Aynı duyurular eski Security ve Auth Server jenerasyonlarının açık kaynak desteğinin bittiğini de netleştiriyor.
- why_it_matters: Güvenlik backlog’u artık yalnız patch değil; desteklenen jenerasyonda kalma zorunluluğu da var.
- java_spring_relevance: Identity, OAuth2/OIDC, X.509 veya custom auth akışı kullanan Spring ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Auth stack sadeleştirme, obsolete sürümlerin temizlenmesi, token ve client registration akışlarının yeniden sertleştirilmesi.
- risks: Desteksiz sürümde kalmak, yanlış servlet path eşleştirmeleri, one-time token veya X.509 tabanlı akışlarda yetki hataları.
- migration_notes: Security/Auth Server sürüm envanteri çıkar; 1.3/1.4 Auth Server veya 5.7/5.8/6.3/6.4 Security hatlarında kalıyorsan upgrade penceresini öne çek; dynamic client registration ve one-time token akışlarına regresyon test ekle.

### Bulgu 4

- title: Spring AI için haftanın esas sinyali tenant izolasyonu ve input sanitization
- source: [Spring Security Advisories](https://spring.io/security/), [This Week in Spring - May 5th, 2026](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026/)
- author: Spring Team, Josh Long
- date: 27 Nisan 2026 ve 5 Mayıs 2026
- category: ai, security, multi-tenancy
- tags: spring-ai, vector-store, chat-memory, cosmosdb, onnx, pdf, isolation
- summary: Spring advisories; vector store filter injection, `VectorStoreChatMemoryAdvisor` conversation scoping kaynaklı cross-tenant memory exfiltration, world-writable ONNX cache, attacker-controlled PDF ile OOM ve `CosmosDBVectorStore.doDelete()` SQL injection risklerini listeliyor. Aynı hafta Spring AI release dalgası ve topluluk içerikleri AI kullanımının güvenlik ağırlığını artırıyor.
- why_it_matters: Spring AI kullanan ekipler için kritik risk artık “yanlış cevap döndürme” değil, veri sızdırma ve tenant sınırı ihlali.
- java_spring_relevance: RAG, vector store, chat memory veya AI file ingestion kullanan Spring Boot ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Conversation scoping, file ingestion guardrail’leri ve vector query escaping için kurumsal güvenlik standardı oluşturmak.
- risks: Cross-tenant veri sızıntısı, SQL injection, shared host exposure, bellek tüketimi patlaması.
- migration_notes: Advisory bazında affected/fixed version doğrulaması yap; kullanıcı kaynaklı conversation/document/filter girdilerini sanitize et; default `/tmp` cache kullanımını sınırla; PDF işleme için boyut/zaman/bellek limitleri koy; AI katmanına security testleri ekle.

### Bulgu 5

- title: Spring Kafka 4.1.0-RC1 mesaj işleme semantiğini daha açık hale getiriyor
- source: [Spring for Apache Kafka 4.1.0-RC1, 4.0.5, and 3.3.15 Available](https://spring.io/blog/2026/04/22/spring-kafka-4/)
- author: Soby Chacko
- date: 22 Nisan 2026
- category: messaging, streaming, release-candidate
- tags: spring-kafka, share-consumer, ack-mode, async-commit, dlq, kafka-streams, kip-1034, kip-1071
- summary: 4.1 RC1; share consumer için `ShareAckMode` enum, async commit callback desteği, ek lifecycle event’ler, Kafka Streams tarafında `groupProtocol` seçimi ve KIP-1034 uyumlu native DLQ/recovery handler’ları getiriyor. Patch sürümleri 4.0.5 ve 3.3.15 de ilgili düzeltmeleri taşıyor.
- why_it_matters: Bu sürüm API kozmetiği değil; listener semantics, retry/DLQ tasarımı ve Streams operatör davranışı değişiyor.
- java_spring_relevance: Kafka tabanlı event-driven Spring ekipleri için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Daha açık ack modeli, native DLQ ile daha sade Streams hata yönetimi, server-side rebalance senaryolarına geçiş.
- risks: Yanlış ack/commit seçimi duplicate processing veya gözden kaçan failure modları üretebilir.
- migration_notes: Listener container config’lerini ve commit callback kullanımını gözden geçir; Streams recovery davranışını integration test ile doğrula; Boot 3.5.14/4.0.6/4.1 RC1 ile gelen Spring Kafka versiyonunu bilinçli seç.

### Bulgu 6

- title: Spring Modulith 2.1 RC1 ve Spring Pulsar 2.0.5 event altyapısını sertleştiriyor
- source: [Spring Modulith 2.1 RC1, 2.0.6, and 1.4.11 released](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/), [Spring for Apache Pulsar 1.2.17 and 2.0.5 are now available](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available/), [Spring Pulsar 2.0.5 release notes](https://github.com/spring-projects/spring-pulsar/releases/tag/v2.0.5)
- author: Oliver Drotbohm, Soby Chacko, Spring Teams
- date: 22-24 Nisan 2026
- category: modularity, event-driven, messaging
- tags: spring-modulith, spring-pulsar, jobrunr, event-publication, transactions, pulsar-4.2
- summary: Spring Modulith 2.1 RC1, `@ModuleSlicing`, JobRunr transaction handling ve event publication registry tarafında iyileştirmeler getiriyor. Spring Pulsar 2.0.5 ise Pulsar 4.2.0 hizalaması ve ilgili bug fix’lerle mesajlaşma katmanını güncelliyor.
- why_it_matters: Modüler monolith’ten broker tabanlı eventing’e kadar olan zincirde yayınlama, recovery ve transaction davranışı daha kritik hale geliyor.
- java_spring_relevance: Outbox, event publication registry, JobRunr veya Pulsar kullanan Spring ekipleri için orta-yüksek.
- actionability: izlemeye_deger
- impact_level: orta-yüksek
- opportunities: Daha güvenilir event publication, daha temiz JobRunr entegrasyonu, Pulsar 4.2 geçişiyle broker tarafı hizalama.
- risks: Event publication registry edge-case’leri ve transaction sınırları gözden kaçarsa sessiz veri tutarsızlığı oluşabilir.
- migration_notes: Modulith event publication akışları için failure/retry testleri ekle; JobRunr entegrasyonunu transaction senaryolarında tekrar doğrula; Pulsar 4.2.x planın varsa 2.0.5 üzerinde smoke test yap.

### Bulgu 7

- title: Java AI mimarisi provider çoğaltmaktan çok MCP ve yönetişime kayıyor
- source: [MCP in the Java World: Bringing Architectural Strategy to LLM Integrations](https://www.infoq.com/articles/mcp-java-architectural-strategy-llm-integrations/), [Spring AI Series](https://www.baeldung.com/spring-ai-series), [This Week in Spring - May 5th, 2026](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026/)
- author: InfoQ, Baeldung, Josh Long
- date: 29 Nisan 2026 civarı topluluk güncellemeleri ve 5 Mayıs 2026 haftalık özet
- category: ai, architecture, governance
- tags: mcp, spring-ai, advisors, memory, governance, tool-calling
- summary: Resmi ve topluluk kaynaklarında tekrar eden tema; Java’da LLM entegrasyonunun değeri artık doğrudan model SDK’sında değil, tool protocol, memory, authorization ve çok-ajanlı koordinasyon desenlerinde aranıyor.
- why_it_matters: Kurumsal Java ekipleri için kalıcı mühendislik değeri provider değiştirmekten çok güvenli ve yönetişilebilir entegrasyon sınırları kurmakta.
- java_spring_relevance: Spring AI veya Java tabanlı LLM servisleri geliştiren ekipler için orta-yüksek.
- actionability: izlemeye_deger
- impact_level: orta
- opportunities: MCP tabanlı daha taşınabilir tool katmanı, merkezi auth/audit politikaları, provider bağımsız servis mimarisi.
- risks: Takımların provider hype’ına odaklanıp memory, tenant, audit ve authorization katmanlarını ihmal etmesi.
- migration_notes: AI servislerinde protocol boundary, tool registry, memory retention ve authorization modelini yazılı mimari standarda dönüştür; provider entegrasyonlarını ikinci aşama karar haline getir.

### Bulgu 8

- title: Java 26 servis platformları için deney yapılacak anlamlı ama acil olmayan yenilikler getiriyor
- source: [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [Inside Java](https://inside.java/)
- author: Sharat Chander, Java Team at Oracle
- date: 17 Mart 2026 ve Nisan-Mayıs 2026 Inside Java içerikleri
- category: jdk, runtime, performance, networking
- tags: java-26, http3, aot-cache, structured-concurrency, pem, lazy-constants
- summary: Java 26; HTTP Client için HTTP/3, any-GC AOT object caching, structured concurrency, PEM encoding API ve final-field warning rejimini bir araya getiriyor.
- why_it_matters: Modern Spring servislerinde outbound HTTP, startup/warmup, concurrency ve crypto tarafında ölçülebilir kazanım potansiyeli var.
- java_spring_relevance: Platform engineering ve performans odaklı Java ekipleri için orta.
- actionability: bilgilendirici_ve_lab
- impact_level: orta
- opportunities: Daha düşük startup/warmup süresi, daha iyi ağ performansı, daha okunabilir concurrency kodu, kriptografik entegrasyonların sadeleşmesi.
- risks: Preview/incubator alanlarına erken üretim bağımlılığı teknik borç yaratabilir; HTTP/3 geçişi ağ ekipleriyle koordinasyon ister.
- migration_notes: HTTP/3 ve AOT cache’i canary servislerde ölç; preview özellikleri prod sözleşmesine değil deney branch’lerine koy; JDK 26 upgrade testlerine crypto ve HTTP client regresyonlarını dahil et.

## Sonuç

6 Mayıs 2026 için en güçlü mühendislik sinyali açık: Java/Spring ekiplerinin bugün en çok değer üreteceği iş yeni çerçeve denemek değil, Spring’in son iki haftadaki güvenlik ve RC dalgasını bilinçli şekilde sindirmek. Öncelik sırası net olmalı: önce Boot/Security/Auth Server patch’leri, ardından Spring AI ve gRPC yüzeyinde güvenlik envanteri, sonra Kafka/Modulith gibi event semantiğini etkileyen RC değişiklikleri. JDK 26 tarafı ise acil upgrade çağrısı değil; 2026 ikinci yarısı için ölçümlü lab yatırım alanı.
