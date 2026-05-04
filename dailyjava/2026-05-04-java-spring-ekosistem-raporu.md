# Günlük Java / Spring Ekosistem Raporu

Tarih: 4 Mayıs 2026  
Tarama zamanı: 4 Mayıs 2026 09:11 TSİ  
Odak: Spring AI bakım hattındaki güvenlik ve sağlayıcı uyumluluğu, event-driven tarafta Modulith/Kafka olgunlaşması, JSpecify ile derleme zamanı null-safety, Nisan 2026 JDK CPU hattının üretim etkileri

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring Projects](https://spring.io/projects/), [Spring Boot 4.1.0-RC1 release](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/), [Spring AI 1.0.6 / 1.1.5 / 2.0.0-M5 release](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/), [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/), [Spring for Apache Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4), [Spring Cloud project page](https://spring.io/projects/spring-cloud/), [OpenJDK JDK 27 page](https://openjdk.org/projects/jdk/27/), [JEP 500](https://openjdk.org/jeps/500), [Inside Java - Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/), [Inside Java - JDK 27 translation resources heads-up](https://inside.java/2026/04/21/quality-heads-up/), [Oracle Java Blog - The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [Oracle April 2026 CPU](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm), [JDK 26.0.1 Release Notes](https://www.oracle.com/java/technologies/javase/26-0-1-relnotes.html), [InfoQ - The Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Baeldung - Spring Data AOT Repositories](https://www.baeldung.com/spring-data-aot-repositories), [Josh Long - This Week in Spring, 28 Nisan 2026](https://spring.io/blog/2026/04/28/this-week-in-spring-april-28-2026/), [Gunnar Morling - Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/), [IK.AM - Nullability Maven Plugin](https://ik.am/entries/900/en) ve [Burak KUTBAY - API Versiyonlama / Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html) tarandı. Baeldung tarafında bugün release-seviyesi yeni kritik bir duyuru yok; ancak AOT repositories ve Spring AI serileri, topluluğun AOT + agentic workflow eksenine kaydığını doğruluyor.

## Öne Çıkan Başlıklar

- En güçlü günlük sinyal Spring AI bakım hattından geldi: [Spring AI 1.0.6, 1.1.5 ve 2.0.0-M5](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/) yalnız hata düzeltmiyor; beş CVE kapatıyor ve sağlayıcı/model yaşam döngüsünü sertleştiriyor.
- Event-driven tarafta iki farklı ama tamamlayıcı yön belirginleşiyor: [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/) uygulama içi modüler sınırları olgunlaştırırken [Spring Kafka 4.1 RC1](https://spring.io/blog/2026/04/22/spring-kafka-4) broker seviyesi paylaşılmış tüketim ve Kafka Streams hata yönetimini geliştiriyor.
- Spring 7 / Boot 4 geçişi artık sadece framework upgrade konusu değil; [InfoQ paneli](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Spring Tools 5.1.0](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released) ve [Nullability Maven Plugin](https://ik.am/entries/900/en) ile birlikte sözleşme, null-safety ve IDE/build tool zinciri konusu haline geliyor.
- JDK cephesinde en somut üretim etkisi hâlâ [21 Nisan 2026 CPU hattı](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm): yeni baseline sürümleri, TZ 2026a ve Chunghwa kök sertifika güvensizleştirmesi ertelenmemeli.
- JVM veri araçları tarafında [Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/) dikkat çekiyor; klasik `parquet-java` ağırlığına alternatif, Java 21+ odaklı daha hafif bir okuma yolu oluşuyor.

## Kritik Güncellemeler

### Spring AI tarafında patch artık sadece dependency bump değil

[Spring AI 1.0.6, 1.1.5 ve 2.0.0-M5](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/) beş güvenlik düzeltmesiyle geldi. 1.1.5 notlarında Pixtral 12B tamamen kaldırılıyor, Pixtral Large deprecated ediliyor ve ekipler önerilen Mistral vision modellerine yönlendiriliyor. Bu, Spring AI kullanan ekipler için “SDK sürümünü yükseltelim” seviyesini geçiyor; model adları, provider konfigürasyonları ve vision tabanlı regresyon testleri birlikte ele alınmalı.

### Event-driven ve mesajlaşma katmanında daha operasyonel bir olgunluk sinyali var

[Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/) tarafında event publication registry ve JobRunr transaction handling iyileştirmeleri var. [Spring Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4) ise share consumer ack modeli, async commit callback, Kafka Streams `group.protocol` seçimi ve native DLQ hizalaması getiriyor. İki gelişme birlikte okunduğunda sinyal açık: Java ekipleri yalnız “mesaj gönder/al” değil, teslimat semantiği, event yayın kaydı ve hata geri kazanımı düzeyinde daha ince kontrol istiyor.

### JDK CPU hattı sessiz üretim kırılmaları yaratabilecek değişiklikler taşıyor

[Oracle April 2026 CPU](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm) ile 26.0.1, 25.0.3, 21.0.11, 17.0.19 ve 11.0.31 yayımlandı. [JDK 26.0.1 release notes](https://www.oracle.com/java/technologies/javase/26-0-1-relnotes.html) TZ 2026a değişikliklerini ve 17 Mart 2026 sonrası düzenlenen Chunghwa-köklü TLS sertifikalarının artık güvensiz sayılacağını açıkça belirtiyor. Bu konu yalnız güvenlik bülteni olarak okunmamalı; dış sistem sertifika zinciri ve zaman dilimi farklarına hassas iş yükleri için doğrudan operasyonel etki yaratır.

### Spring Cloud cephesinde bugün yeni büyük release haberi yok, ama sürüm eşleşmesi hâlâ kritik

[Spring Cloud project page](https://spring.io/projects/spring-cloud/) 4 Mayıs 2026 itibarıyla Boot 4.0.x için `2025.1.x`, Boot 3.5.x için `2025.0.x` eşleşmesini veriyor. Dün vurgulanan güvenlik perspektifine ek olarak bugünkü sonuç şu: messaging, config ve gateway katmanında doğru train seçimi hâlâ mimari hijyen değil, üretim güvenilirliği konusu.

## Trendler ve Sinyaller

### 1. Spring ekosisteminde “platform release” aşağı katmanlara iniyor

Boot 4.1 RC1 artık tek başına okunmuyor. [Spring AI release’i](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/), [Spring Modulith RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/) ve [Spring Kafka 4.1 RC1](https://spring.io/blog/2026/04/22/spring-kafka-4) aynı pencere içinde hizalanıyor. Bu, bağımsız kütüphane yükseltmelerinden çok “release train temelli pilot” yaklaşımını güçlendiriyor.

### 2. Event-driven mimaride iki seviyeli sertleşme var

Bir tarafta Modulith ile uygulama içi sınırlar, event publication kayıtları ve iş planlama entegrasyonları toparlanıyor. Diğer tarafta Kafka ile share consumer, async commit ve native DLQ üzerinden broker seviyesinde daha açık hata semantiği kazanılıyor. Bu çizgi, klasik “her şeyi ayrı mikroservis yap” refleksinin yerini daha kontrollü olay odaklı tasarıma bıraktığını gösteriyor.

### 3. Null-safety ve API sözleşmesi artık belge değil araç konusu

[InfoQ’daki Spring paneli](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) Spring Framework 7’nin retry, concurrency throttling ve API versioning’i çekirdeğe aldığını gösteriyor. [Spring Tools 5.1.0](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released) JSpecify, AOT repository ve API versioning desteğini IDE’ye taşıyor. [IK.AM Nullability Maven Plugin](https://ik.am/entries/900/en) ise aynı yaklaşımı derleme pipeline’ına indiriyor. Bu, kurumsal Java ekipleri için kalıcı mühendislik değeri taşıyan bir trend.

### 4. JDK değişimleri daha çok davranış ve uyumluluk katmanında birikiyor

[Inside Java’nın final field mutation yazısı](https://inside.java/2026/04/27/avoiding-final-field-mutation/) ve [JEP 500](https://openjdk.org/jeps/500), reflective mutasyonun artık tolere edilen bir pratik olmaktan çıkacağını netleştiriyor. [JDK 27 quality heads-up](https://inside.java/2026/04/21/quality-heads-up/) ve [JDK 27 project page](https://openjdk.org/projects/jdk/27/) ise çeviri kaynaklarının kaldırılması ve post-quantum TLS 1.3 gibi daha “altyapısal” uyumluluk başlıklarının yaklaşmakta olduğunu gösteriyor.

### 5. Veri yolu ve object storage çevresinde hafif JVM araçları yükseliyor

[Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/) hem VARIANT desteği hem de S3 üzerinden daha verimli okuma ile dikkat çekiyor. Bu, yalnız veri mühendisliği ekosistemi değil; CDC, lakehouse ve büyük event arşivi okuyan Java servisleri için de izlenmesi gereken bir sinyal.

## Araçlar ve Kütüphaneler

- [Spring AI 1.1.5](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/): Yüksek öncelik. Güvenlik düzeltmeleri ve model yaşam döngüsü değişikliği içeriyor.
- [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/): Orta-yüksek öncelik. Modüler monolit, outbox ve domain event odaklı ekipler için anlamlı.
- [Spring Kafka 4.1.0-RC1 / 4.0.5 / 3.3.15](https://spring.io/blog/2026/04/22/spring-kafka-4): Yüksek öncelik. Özellikle share consumer veya Kafka Streams kullanan ekipler için.
- [Nullability Maven Plugin](https://ik.am/entries/900/en): Orta-yüksek öncelik. Spring 7 / JSpecify geçişini build-time enforcement seviyesine taşıyor.
- [Spring Tools 5.1.0](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released): Orta öncelik. IDE tarafında AOT repository, API versioning ve JSpecify desteği ile verimlilik artırıyor.
- [Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/): Orta öncelik. Veri yoğun Java arka uçları için deneysel ama umut verici.
- [Spring Shell 4.0.2](https://spring.io/blog/2026/04/24/spring-shell-4-0-2-is-out/): Düşük öncelik. Bakım sürümü; doğrudan mimari etki sınırlı.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI kullanıyorsanız bugünkü aksiyon yalnız patch atmak değil; provider/model konfigürasyonlarını envanterleyip test etmek olmalı.
- Event-driven sistemlerde “retry yetiyor” dönemi kapanıyor. Modulith ile event publication takibi ve Kafka ile DLQ/ack semantiği daha bilinçli tasarlanmalı.
- Spring 7 / Boot 4 geçişi planlayan ekipler, migration backlog’una nullability ve API versioning kararlarını açıkça eklemeli; bunlar son dakika detayları değil.
- JDK güncellemelerini yalnız CVE kapatma refleksiyle yönetmek yetmez. Sertifika zinciri ve timezone etkileri için smoke test hattı kurulmalı.
- JDK 26/27 deneyen platform ekipleri, reflection ile `final` alan yazan kütüphaneleri ve test fixture altyapılarını erkenden taramalı.

## Fırsatlar ve Riskler

### Fırsatlar

- JSpecify + NullAway kombinasyonu, NPE kaynaklı hataları CI aşamasında yakalayarak özellikle büyük Spring kod tabanlarında kalıcı kalite artışı sağlayabilir.
- Spring Modulith RC1, mikroservise bölmeden önce modül sınırlarını ve event akışlarını daha disiplinli hale getirmek için iyi bir pilot alan sunuyor.
- Spring Kafka 4.1 RC1 ile paylaşımlı tüketim ve Streams hata yönetimi daha az custom altyapı kodu ile çözülebilir.
- Hardwood gibi hafif araçlar, S3/lakehouse tarafında Hadoop bağımlılığı olmadan daha küçük operational footprint sağlayabilir.

### Riskler

- Spring AI provider/model değişiklikleri, özellikle testlerde fark edilmeyen sessiz davranış farkı üretme riski taşıyor.
- Chunghwa kök sertifika güvensizleştirmesi, dış kurum entegrasyonlarında yalnızca belirli müşterileri etkileyen zor teşhis edilen TLS sorunları yaratabilir.
- `final` field mutation uyarıları bugün warning olsa da yarın daha sert politika olabilir; geçici JVM flag’lerine güvenmek teknik borç üretir.
- Spring Cloud release train uyumsuzluğu, bugün yeni bir duyuru olmasa da Boot 3.5 / 4.0 filolarında hâlâ sessiz entegrasyon problemi üretebilir.

## İzlenmesi Gereken Konular

- Boot 4.1 GA yayımlandığında `InetAddressFilter`, OpenTelemetry environment variable desteği ve `LazyConnectionDataSourceProxy` davranışının son hâli.
- Spring AI tarafında M5 sonrası GA/RC çizgisinde yeni provider deprecation veya ek güvenlik backport’u olup olmayacağı.
- Spring Modulith 2.1 GA öncesinde event publication registry ve JobRunr entegrasyonunun daha fazla davranış değişikliği alıp almayacağı.
- JDK 27’de [Post-Quantum Hybrid Key Exchange for TLS 1.3](https://openjdk.org/projects/jdk/27/) ve translation resource removal değişikliklerinin kurumsal test matrisine ne kadar erken gireceği.
- Spring Cloud tarafında 4 Mayıs 2026 itibarıyla güncel eşleşmenin Boot 4.0.x -> `2025.1.x`, Boot 3.5.x -> `2025.0.x` olarak korunup korunmayacağı.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring AI bakım hattı güvenlik düzeltmesi ile birlikte model yaşam döngüsünü de sertleştiriyor
- source: [Spring AI 1.0.6, 1.1.5, 2.0.0-M5](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/), [Spring Projects](https://spring.io/projects/), [This Week in Spring - 28 Nisan 2026](https://spring.io/blog/2026/04/28/this-week-in-spring-april-28-2026/)
- author: Ilayaperumal Gopinathan, Josh Long
- date: 27 Nisan 2026 ve 28 Nisan 2026
- category: ai, security, release-management
- tags: spring-ai, cve, mistral, pixtral, spring-boot
- summary: Spring AI 1.0.6, 1.1.5 ve 2.0.0-M5 beş CVE düzeltmesiyle geldi; 1.1.5 tarafında Pixtral 12B kaldırıldı, Pixtral Large deprecated edildi ve önerilen Mistral vision modellerine yönlendirme yapıldı.
- why_it_matters: AI katmanında risk artık yalnız kütüphane versiyonu değil; provider ve model kimliklerinin yaşam döngüsü de üretim davranışını etkiliyor.
- java_spring_relevance: Spring AI kullanan Java ekipleri için doğrudan yüksek; özellikle vision iş yükleri ve çoklu sağlayıcı kullanan servislerde.
- actionability: hemen_patch_ve_model_konfig_tarama
- impact_level: yüksek
- opportunities: Daha temiz sağlayıcı portföyü ve daha güvenli Spring AI hattı.
- risks: Sessiz model uyumsuzluğu, test snapshot drift’i, CVE borcunun taşınması.
- migration_notes: Sürüm yükseltmesiyle birlikte kullanılan model ID’lerini, provider özel property’leri ve tool-calling/vision akışlarını yeniden doğrula.

### Bulgu 2

- title: Spring Modulith 2.1 RC1 modüler monolit yaklaşımını daha operasyonel hale getiriyor
- source: [Spring Modulith 2.1 RC1, 2.0.6, and 1.4.11 released](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/), [Spring Projects](https://spring.io/projects/)
- author: Oliver Drotbohm
- date: 24 Nisan 2026
- category: architecture, modularity, event-driven
- tags: spring-modulith, modular-monolith, jobrunr, event-publication, module-slicing
- summary: 2.1 RC1; `@ModuleSlicing` tercihleri, JobRunr transaction handling ve event publication registry tarafında iyileştirmeler getiriyor.
- why_it_matters: Modüler monolit kullanan ekiplerin en zorlandığı alan uygulama sınırı değil, event yayını ve iş planlama/transaction etkileşimi oluyor.
- java_spring_relevance: Spring Boot tabanlı domain-modüler sistemler ve mikroservise bölünmeden önce iç sınırları sertleştirmek isteyen ekipler için yüksek.
- actionability: pilot_modulith_2_1_rc1
- impact_level: orta_yüksek
- opportunities: Domain event akışlarını daha görünür ve denetlenebilir kılmak.
- risks: RC seviyesinde davranış farkı, JobRunr ve event publication entegrasyonunda regresyon.
- migration_notes: Önce iç araçlar veya domain event yoğun bir servis üzerinde pilot kur; publication registry ve background job transaction akışlarını test et.

### Bulgu 3

- title: Spring Kafka 4.1 RC1 paylaşımlı tüketim ve Streams hata yönetimini olgunlaştırıyor
- source: [Spring for Apache Kafka 4.1.0-RC1, 4.0.5, and 3.3.15 Available](https://spring.io/blog/2026/04/22/spring-kafka-4), [This Week in Spring - 28 Nisan 2026](https://spring.io/blog/2026/04/28/this-week-in-spring-april-28-2026/)
- author: Soby Chacko, Josh Long
- date: 22 Nisan 2026 ve 28 Nisan 2026
- category: messaging, streaming, resilience
- tags: spring-kafka, kafka-streams, dlq, share-consumer, ack
- summary: 4.1 RC1; `ShareAckMode`, async commit callback, lifecycle events, Kafka Streams `group.protocol` seçimi ve KIP-1034 ile hizalı native DLQ/exception handler desteği getiriyor.
- why_it_matters: Bu değişiklikler custom consumer orchestration ve hata geri kazanım kodunun bir bölümünü framework seviyesine taşıyor.
- java_spring_relevance: Kafka üzerinden event-driven çalışan Spring servisleri ve Kafka Streams pipeline’ları için doğrudan yüksek.
- actionability: stable_hat_patch_ve_rc_poc
- impact_level: yüksek
- opportunities: Daha temiz ack semantiği, daha kontrollü failover ve daha az özel hata işleme kodu.
- risks: RC davranış farkı, commit semantiği değişimine bağlı geri basınç veya duplicate processing sürprizleri.
- migration_notes: Stable hatta isen 3.3.15 veya 4.0.5’e geç; 4.1 RC1’i share consumer veya Streams DLQ ihtiyacı olan servislerde kontrollü POC ile dene.

### Bulgu 4

- title: Spring 7 / Boot 4 geçişi araç zinciri ve sözleşme tasarımına kayıyor
- source: [The Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Spring Tools 5.1.0 released](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released), [Nullability Maven Plugin](https://ik.am/entries/900/en), [API Versiyonlama - Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html)
- author: Karsten Silz, Phil Webb, Sam Brannen, Rossen Stoyanchev, Martin Lippert, Toshiaki Maki, Burak KUTBAY
- date: 24 Şubat 2026, 11 Mart 2026, 13 Nisan 2026, 2025 son çeyrek
- category: migration, developer-productivity, api-design
- tags: spring-framework-7, spring-boot-4, jspecify, nullaway, api-versioning, spring-tools
- summary: Spring Boot 4 modülerleşme ile daha küçük jar ve daha az classpath kontrolü hedeflerken, Spring Framework 7 retry ve concurrency throttling’i çekirdeğe alıyor; JSpecify, API versioning ve AOT repository desteği IDE/build zincirine inmeye başlıyor.
- why_it_matters: Büyük Spring geçişleri artık yalnız kod uyarlama işi değil; null-safety, API sözleşmesi ve build-time doğrulama kararları istiyor.
- java_spring_relevance: Boot 3’ten 4’e geçiş planlayan tüm ekipler için yüksek; özellikle çok modüllü kurumsal uygulamalarda.
- actionability: migration_backloguna_sozlesme_ve_tooling_ekle
- impact_level: yüksek
- opportunities: NPE borcunu düşürmek, API sürümleme politikasını netleştirmek, upgrade maliyetini araçla azaltmak.
- risks: Nullability kurallarının aniden sertleştirilmesi, sürümleme stratejisinin tutarsız kalması, Boot 3.5 bakım penceresinin yanlış okunması.
- migration_notes: Önce migration guide ve OpenRewrite hattı ile ilerle; JSpecify’ı package/package-info bazında kademeli aç; API versioning stratejisini path/header/query/media-type düzeyinde yazılı karar haline getir.

### Bulgu 5

- title: Nisan 2026 Oracle CPU hattı TLS ve timezone davranışını da değiştiriyor
- source: [Oracle Critical Patch Update April 2026 for Oracle Java SE](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm), [JDK 26.0.1 Release Notes](https://www.oracle.com/java/technologies/javase/26-0-1-relnotes.html), [JDK 25.0.3 Release Notes](https://www.oracle.com/java/technologies/javase/25-0-3-relnotes.html), [JDK 21.0.11 Release Notes](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html), [JDK 17.0.19 Release Notes](https://www.oracle.com/java/technologies/javase/17-0-19-relnotes.html)
- author: Oracle Java Team
- date: 21 Nisan 2026
- category: security, operations, compatibility
- tags: cpu, jdk26, jdk25, jdk21, jdk17, timezone, tls
- summary: 26.0.1, 25.0.3, 21.0.11, 17.0.19 ve 11.0.31 yayımlandı; TZ 2026a eklendi ve Chunghwa kök sertifikalarına bağlı belirli TLS sertifikaları yeni kurallarla güvensiz hale geldi.
- why_it_matters: Bu tür değişiklikler çoğu zaman yalnız bazı müşterilerde veya bazı bölgelerde hata üretir; teşhisi zordur ama etkisi büyüktür.
- java_spring_relevance: Spring servislerinin neredeyse tamamı outbound TLS ve tarih/saat dönüşümlerine bağımlı olduğu için çok yüksek.
- actionability: hemen_cpu_patch_ve_tls_smoke_test
- impact_level: çok_yüksek
- opportunities: Baz imajları ve runtime’ları tek baseline’da toplama fırsatı.
- risks: Sertifika zinciri kırılması, timezone farkı, drift’li container image kullanımı.
- migration_notes: Baz imajlarını güncelle, kritik dış entegrasyonlarda TLS handshake smoke test koştur, zaman dilimi hassas batch/raporlama işlerini yeniden doğrula.

### Bulgu 6

- title: JDK 26 uyarıyor, JDK 27 daha katı bir uyumluluk rejimine hazırlanıyor
- source: [JEP 500](https://openjdk.org/jeps/500), [Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/), [JDK 27 project page](https://openjdk.org/projects/jdk/27/), [Quality Outreach Heads-up - JDK 27](https://inside.java/2026/04/21/quality-heads-up/)
- author: Ron Pressler, Alex Buckley, Nicolai Parlog, David Delabassee
- date: 21 Nisan 2026 ve 27 Nisan 2026
- category: jvm, integrity, compatibility
- tags: jdk26, jdk27, final-fields, reflection, tls1.3, locale
- summary: JDK 26, reflective `final` field mutasyonuna warning vermeye başlıyor; JDK 27 hattında ise post-quantum hybrid TLS 1.3 ve bazı eski translation resource’ların kaldırılması görünüyor.
- why_it_matters: Bunlar yeni sözdizimi değil; framework, serializer, test fixture ve kurumsal kütüphanelerin davranışına dokunan değişiklikler.
- java_spring_relevance: Reflection, serialization, mapping, test utility ve custom agent kullanan Spring/Java ekipleri için orta-yüksek.
- actionability: reflection_ve_locale_uyumluluk_envanteri
- impact_level: orta_yüksek
- opportunities: Daha net object lifecycle, daha öngörülebilir runtime davranışı, daha güçlü TLS hattı.
- risks: Warning birikmesi, eski testlerin locale çıktısına bağlanması, gelecekte sert kırılmalar.
- migration_notes: `--enable-final-field-mutation` gibi bayrakları kalıcı çözüm görme; kütüphane yükseltme ve constructor/record odaklı tasarıma yönel.

### Bulgu 7

- title: Hardwood 1.0.0.Beta2 JVM veri araçlarında hafif ve hızlı alternatif arayışını güçlendiriyor
- source: [VARIANT Support, Interactive Parquet File TUI: Hardwood 1.0.0.Beta2 Is Out](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/)
- author: Gunnar Morling
- date: 29 Nisan 2026
- category: tools, data, performance
- tags: parquet, s3, object-storage, cli, variant, java21
- summary: Hardwood Beta2; VARIANT kolon desteği, interaktif TUI, unified reader API, S3 erişim iyileştirmeleri ve belirgin performans kazançları getiriyor.
- why_it_matters: Data-heavy Java servisleri için Hadoop bağımlılığı yüksek klasik parquet stack’ine daha hafif bir seçenek doğuyor.
- java_spring_relevance: Spring Batch, CDC, analytics-adjacent veya object storage’dan Parquet okuyan Java servisleri için orta önemde.
- actionability: pOC_ve_benchmark
- impact_level: orta
- opportunities: Daha küçük bağımlılık ağacı, daha iyi S3 okuma maliyeti, daha düşük GC baskısı.
- risks: Beta seviye olgunluk, yazma desteğinin henüz gelmemiş olması, mevcut tooling ile entegrasyon belirsizliği.
- migration_notes: Doğrudan prod’a alma; benchmark ve iç araç/PoC seviyesinde değerlendir, özellikle `parquet-java` bağımlılık maliyeti yüksekse yakın takibe al.

## Sonuç

Bugünün en değerli sinyali, Java/Spring ekosisteminin yalnız yeni feature üretmediği; güvenlik, null-safety, event delivery ve runtime davranışı konularını daha sistematik hale getirdiği yönünde. Senior bir Java/Spring ekip lideri için kısa vadeli öncelik sırası net: Spring AI kullanan servisleri patch’le ve model konfigürasyonunu denetle, JDK CPU güncellemelerini erteleme, Kafka/Modulith pilotlarını olay akışı ve teslimat semantiği üzerinden değerlendir, Boot 4 geçiş backlog’una nullability ve API versioning kararlarını açıkça yaz.
