# Günlük Java / Spring Ekosistem Raporu

Tarih: `21 Nisan 2026, 09:04 TRT`

Kapsam: `20 Nisan 2026 09:05 TRT` ile `21 Nisan 2026 09:04 TRT` arasındaki günlük tarama.

Tekrar azaltma notu: Önceki raporlarda işlendiği için bugün `Spring Framework 6.2.18 / 7.0.7 CVE yamaları`, `Tomcat 10.1.54 / 11.0.21 güvenlik düzeltmeleri`, `Spring Data 2026.0.0-RC1`, `JEP 500 final field mutation`, `Spring AI Session API`, `Spring Cloud Gateway CVE-2026-22750`, `Keycloak 26.6.0`, `LangChain4j 1.13.0`, `Hibernate ORM 7.3`, `Java 26 HTTP/3 / AOT / Structured Concurrency`, `JDK 27 takvimi` ve `ConfigurationProperties yönetişimi` ana bulgu olarak tekrar edilmedi. Bugünkü rapor, yeni veya farklı karar değeri taşıyan sinyallere odaklanır.

Kaynak tarama notu: Zorunlu çekirdek kaynaklar olarak [Spring Blog](https://spring.io/blog/), [Spring release kategorisi](https://spring.io/blog/category/releases/), [Spring Security advisories](https://spring.io/security), [Spring Boot project page](https://spring.io/projects/spring-boot/), [Spring Cloud project page](https://spring.io/projects/spring-cloud/), Spring AI ve Framework proje sayfaları, ilgili GitHub release notları, [OpenJDK JEP sayfaları](https://openjdk.org/jeps/), [JDK 27 EA release notes](https://jdk.java.net/27/release-notes), [Oracle Java Blog](https://blogs.oracle.com/java), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung Java Weekly](https://www.baeldung.com/java-weekly-642), Josh Long'un `This Week in Spring` akışı, [Gunnar Morling](https://www.morling.dev/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Spring Blog tarafında bugün yeni `This Week in Spring` veya yeni Boot patch duyurusu görülmedi; Boot proje sayfası halen `4.0.5`, Cloud proje sayfası halen `2025.1.1` göstermektedir. Gunnar Morling tarafında son yeni kayıt `2 Nisan 2026 Hardwood beta`; Burak KUTBAY blogunda ana sayfada görünen son Java/Spring odaklı kayıtlar yeni günlük ana bulgu üretmedi.

## Öne Çıkan Başlıklar

- `JEP 534`, Compact Object Headers'ın varsayılan JVM object header düzeni olması için Candidate durumuna yükseldi. Bu, Spring Boot servislerinde kod değişikliği gerektirmeden heap kullanımı ve GC baskısını azaltabilecek uzun vadeli bir JVM sinyali.
- `JEP 533`, Structured Concurrency için yedinci preview olarak Candidate durumuna çıktı. API hala stabil değil; fakat virtual thread tabanlı fan-out/fan-in servis kodlarında cancellation, timeout ve observability modelinin nereye gittiğini gösteriyor.
- `Micrometer Metrics 1.17.0-RC1`, JDK 25 ve JDK 26 runtime metriklerini gözlemlenebilir hale getirmeye başlıyor. `ForkJoinPool#getDelayedTaskCount()` ve `MemoryMXBean#getTotalGcCpuTime()` desteği, modern JVM sürümleriyle Spring Boot observability hattının birlikte evrildiğini gösteriyor.
- `Apache Camel 4.19.0`, Spring Boot 4 desteği, Kafka 4.2 client, MCP client/server araçları, AI bileşenlerinde OAuth SPI, PQC hazırlığı ve yeni `camel-spring-ai-image` gibi bileşenlerle entegrasyon platformu tarafında güçlü bir release.
- `Jakarta EE 12` için M4-M10 kilometre taşları netleşti. Core Profile için Q4 2026, Web Profile ve Platform için 2027 başı/ortası hedefi; Spring ekipleri için doğrudan değil ama Servlet, REST, CDI, JSON-B, JPA ve Validation yol haritası açısından izlenmeli.
- Quarkus'un reflection-free Jackson serializer/deserializer optimizasyonunu varsayılan yapma kararı, Spring ekosistemi için rekabetçi bir sinyal: JSON serialization, AOT/native ve reflection azaltma artık framework performans savaşının merkezinde.

## Kritik Güncellemeler

1. Bugün yeni Spring CVE veya yeni Spring Boot patch duyurusu tespit edilmedi; ancak dün işlenen Framework yamalarının Boot `3.5.14` ve `4.0.6` ile taşınması hala izlenmesi gereken en yakın kritik madde.
2. `JEP 534`, JDK 27 yönünde object header layout değişikliğini varsayılan hale getirmeyi hedefliyor; eski layout `-XX:-UseCompactObjectHeaders` ile kapatılabilecek, fakat eski düzenin gelecekte kaldırılması planlanıyor.
3. `JEP 533`, Structured Concurrency API'sinin hala preview olduğunu teyit ediyor. Kütüphane public API'lerine bu API'yi sızdırmak bugün riskli kalmaya devam ediyor.
4. `Micrometer 1.17.0-RC1`, JDK 26 GC CPU time metriği ve JDK 25 ForkJoinPool delayed task metriği ile yeni JDK seviyelerini observability yüzeyine taşıyor.
5. `Camel 4.19.0`, `camel-spring-boot` için Spring Boot 4 desteği ekliyor; aynı release Java 17 ve 21 desteklediğini belirtiyor, JDK 25 desteğini bir sonraki `4.20` sürümüne konumlandırıyor.
6. `Jakarta EE 12` planı, Core Profile'ın 2026 sonunda, Web Profile ve tam Platform'un 2027'de tamamlanabileceğini gösteriyor; bu, Jakarta EE 11 sonrası geçişin hızlı bir "hemen yükselt" konusu olmadığını netleştiriyor.

## Trendler ve Sinyaller

### 1. JVM verimlilik çalışmaları framework koduna dokunmadan kazanç üretmeye yöneliyor

Compact Object Headers, G1 throughput iyileştirmeleri ve AOT cache hattı birlikte okunduğunda OpenJDK tarafındaki ana eğilim belirgin: modern Java servislerinde performans kazanımı yalnızca uygulama kodundan değil, JVM runtime layout ve startup/GC davranışından gelecek. Spring Boot uygulamaları genellikle object-heavy çalışır; dependency injection graph, DTO, ORM entity, cache entry, proxy ve framework metadata yoğunluğu nedeniyle header boyutu ve heap yoğunluğu pratik etki yaratabilir.

### 2. Virtual thread sonrası asıl konu cancellation ve yapılandırılmış yaşam döngüsü

Structured Concurrency tekrar preview olsa da yön sabit: virtual thread ile bol thread üretmek tek başına yeterli değil. Spring tabanlı servislerde paralel downstream çağrı, timeout ve cancellation davranışı genellikle `CompletableFuture`, `ExecutorService`, reactive pipeline veya custom thread pool ile dağınık yönetiliyor. Structured Concurrency, bu dağınıklığı daha okunabilir ve gözlemlenebilir bir blok yapısına çekmek istiyor.

### 3. Observability kütüphaneleri yeni JDK API'lerini hızla ürünleştiriyor

Micrometer'ın JDK 25/26 API'lerini RC seviyesinde metriklere çevirmesi, Spring Boot Actuator kullanıcıları için önemli. JVM sürümü yükselirken observability stack aynı hızda güncellenmezse yeni runtime sinyalleri dashboard ve alert kurallarına yansımaz. Bu, JDK upgrade testlerinin yalnızca uygulama testleriyle değil, telemetry doğrulamasıyla da yürütülmesi gerektiğini gösteriyor.

### 4. Entegrasyon framework'leri AI, MCP, OAuth ve PQC ekseninde genişliyor

Camel 4.19.0, klasik EIP/integration framework algısının ötesine geçiyor. MCP araçları, AI endpoint'lerinde OAuth, Spring AI Image, Hugging Face, pgvector, Kafka 4.2 ve PQC TLS hazırlığı aynı release içinde görünüyor. Bu, entegrasyon katmanlarının AI tool orchestration, güvenli kimlik, vektör veri ve post-quantum hazırlık gibi platform yetkinliklerini birleştirme yönünde evrildiğini gösteriyor.

### 5. Jakarta EE 12, Spring için doğrudan roadmap değil ama alt standart zemini etkiliyor

Spring Framework, Jakarta EE API'lerini doğrudan tüketmese bile Servlet, Validation, Persistence, JSON, REST ve transaction standartlarının yönü Spring Boot ekosistemini etkiler. Jakarta EE 12'nin Java SE 21+ tabanı, HTTP/3 gereksinimi değerlendirmeleri, virtual thread programlama modeli ve SecurityManager temizliği, Spring 7/Boot 4 sonrası enterprise Java tabanıyla aynı büyük resme oturuyor.

### 6. JSON serialization yarışında build-time ve reflection azaltma baskısı artıyor

Quarkus'un reflection-free Jackson serializer/deserializer optimizasyonunu varsayılan yapma planı, Spring tarafında da AOT, native image, Jackson 3 ve reflection hint kalitesinin stratejik olduğunu hatırlatıyor. Bu doğrudan Spring değişikliği değil; ancak performans ve native image rekabetinde Java web framework'lerinin nereye yatırım yaptığını gösteren güçlü bir sinyal.

## Araçlar ve Kütüphaneler

- `OpenJDK JEP 534`: Compact Object Headers'ı varsayılan yapmayı hedefleyen Candidate JEP; object-heavy servislerde heap ve CPU verimliliği açısından izlenmeli.
- `OpenJDK JEP 533`: Structured Concurrency yedinci preview; virtual thread ile paralel servis çağrıları için cancellation ve observability modelini olgunlaştırıyor.
- `Micrometer Metrics 1.17.0-RC1`: JDK 25 ForkJoinPool delayed task metriği, JDK 26 GC CPU time metriği, Observation scope validation, exemplar sizing ve GraalVM 25 native hint düzeltmesi.
- `Apache Camel 4.19.0`: Spring Boot 4 support, Kafka 4.2 client, Azure Functions, Spring AI Image, Hugging Face, pgvector, MCP client/server tooling, OAuth SPI ve PQC readiness.
- `Jakarta EE 12`: Core Profile M4 dönemi; REST 5.0, CDI 5.0, JSON-P 2.2 ve JSON-B 3.1 milestone/beta beklentileri.
- `JBang 0.138.0`: WAR dosyalarını JAR benzeri çalıştırma desteği, manifest launcher flag davranışı ve bazı CVE/dependency düzeltmeleri. Düşük-orta öncelikli developer productivity sinyali.
- `Quarkus reflection-free Jackson serializers`: Quarkus 3.35 ile varsayılan yapılması planlanan build-time JSON serialization optimizasyonu; Spring için karşılaştırmalı performans/AOT sinyali.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Boot ekipleri JDK 27 EA testlerinde yalnızca compile/runtime başarısına bakmamalı; heap kullanımı, GC sıklığı, startup, RSS ve p95/p99 latency değerlerini Compact Object Headers açık/kapalı karşılaştırmalı ölçmeli.
- Structured Concurrency preview API olduğu için production Spring kütüphanelerinin public API'sine sokulmamalı. Buna rağmen downstream servis fan-out, cancellation ve timeout davranışını modelleyen internal spike'lar için değerlidir.
- Micrometer 1.17 hattı, JDK upgrade çalışmalarında observability uyumluluğunu ayrı bir test maddesi yapmayı gerektiriyor. Spring Boot Actuator dashboard'larında yeni GC CPU ve executor queue/delay sinyalleri için alarm semantiği yeniden düşünülmeli.
- Camel kullanan Spring ekipleri `4.19.0` ile Boot 4 uyumluluğunu test edebilir; fakat JDK 25 desteği için `4.20` beklentisi not edilmeli. Kafka, OAuth, MCP ve PQC değişiklikleri entegrasyon test matrisi gerektirir.
- Jakarta EE 12 zaman çizelgesi, Boot 4'e geçen ekipler için kısa vadeli migration konusu değil; ancak Servlet 6.2, Persistence 4.0, Validation 4.0, CDI 5.0 ve JSON-B/JSON-P güncellemeleri yol haritasında izlenmeli.
- Quarkus'un Jackson optimizasyonu, Spring ekipleri için "Quarkus'a geç" çağrısı değildir. Daha doğru çıkarım, JSON serialization benchmark'larının reflection maliyeti, AOT/native image davranışı ve Jackson 3 uyumluluğu ile birlikte ele alınmasıdır.
- JBang 0.138.0, küçük Java otomasyonları ve lokal araçlar için WAR çalıştırma senaryolarını kolaylaştırabilir; kurumsal üretim standardı değil, geliştirici deneyimi yardımcı aracı olarak değerlendirilmelidir.

## Fırsatlar ve Riskler

Fırsatlar:

- JDK 27 EA hattında Compact Object Headers etkisini gerçek Spring Boot workload'larıyla ölçerek JVM yükseltmesinin kapasite planına katkısını erken görmek.
- Micrometer 1.17 RC ile JDK 26/27 telemetry uyumluluğunu test ederek observability stack'i JDK upgrade planına dahil etmek.
- Camel 4.19.0 üzerinden Spring Boot 4 entegrasyonlarını, Kafka 4.2 client davranışını ve AI/MCP route tasarımlarını kontrollü POC ortamında değerlendirmek.
- Jakarta EE 12 planını Spring 7 / Boot 4 sonrası kurumsal platform roadmap'iyle birlikte okuyarak Servlet/JPA/Validation bağımlılıklarını uzun vadeli izlemek.
- JSON serialization için JMH ve endpoint-level benchmark seti kurarak Spring MVC/WebFlux, Jackson 3 hazırlığı, AOT/native image ve reflection hint kalitesini ölçülebilir hale getirmek.

Riskler:

- Compact Object Headers'ı "bedava performans" varsayıp load test yapmadan JDK upgrade kararı vermek. Object layout değişiklikleri agent, native entegrasyon, instrumentation ve bazı düşük seviye kütüphanelerde test ister.
- Structured Concurrency preview API'sini erken public API'ye sokmak ve sonraki preview değişikliklerinde kırılma yaşamak.
- Micrometer RC sürümünü üretimde genel standart yapmak; RC, pilot ve test için değerlidir, platform BOM stratejisiyle karıştırılmamalıdır.
- Camel Spring Boot BOM'unu Boot BOM'u ile plansız karıştırmak; entegrasyon framework'lerinde dependency override hataları runtime'da zor teşhis edilir.
- Jakarta EE 12 takvimini Spring Boot upgrade takvimiyle bire bir eşitlemek. Spring'in kendi release ve dependency management kararları ayrıca izlenmeli.
- Quarkus reflection-free Jackson kararını Spring tarafında doğrudan uygulanabilir sanmak; Spring AOT/native modeli farklıdır ve aynı optimizasyonun etkisi ölçülmeden genellenmemelidir.

## İzlenmesi Gereken Konular

- `Spring Boot 3.5.14` ve `Spring Boot 4.0.6` yayımlandığında Spring Framework 6.2.18/7.0.7 ve Tomcat patch seviyelerinin BOM'a nasıl taşındığı.
- `JEP 534` hedef sürüm durumu ve JDK 27 EA build'lerinde Compact Object Headers varsayılan davranışının test sonuçları.
- `JEP 533` API değişiklikleri; özellikle `StructuredTaskScope`, `Joiner`, timeout ve cancellation semantiği.
- `Micrometer 1.17.0` GA ve Spring Boot'un hangi sürüm hattında bu Micrometer seviyesine hizalanacağı.
- `Camel 4.20` planlanan Haziran release'i ve JDK 25 desteği; Camel 4.19'daki Boot 4 desteğinin gerçek Spring ekiplerinden gelecek geri bildirimleri.
- Jakarta EE 12 Core Profile M4 çıktıları; REST 5.0, CDI 5.0, JSON-P 2.2 ve JSON-B 3.1 milestone/beta durumları.
- Jackson 3, Spring Boot 4, Spring AOT ve native image hattında reflection azaltma / serializer üretimi konularının nasıl olgunlaşacağı.

## Kaynak Bazlı Bulgular

### 1. `JEP 534`, Compact Object Headers'ı varsayılan yapma yolunda Candidate oldu

- **title:** Compact Object Headers varsayılan JVM object layout'u olmaya yaklaşıyor
- **source:** [OpenJDK JEP draft 8361187](https://openjdk.org/jeps/8361187), [InfoQ Java News Roundup - Apr 13, 2026](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/)
- **author:** `Roman Kennke`, `Michael Redlich`
- **date:** `14-20 Nisan 2026`
- **category:** `jvm-performance-runtime`
- **tags:** `openjdk`, `jdk27`, `compact-object-headers`, `project-lilliput`, `memory`, `gc`, `spring-boot`
- **summary:** `JEP 534`, Compact Object Headers'ın varsayılan object header layout'u olmasını ve eski 12-byte layout'un gelecekte kaldırılmak üzere deprecate edilmesini öneriyor. Draft metin, JDK 25'te ürün özelliği olan `-XX:+UseCompactObjectHeaders` davranışının artık default hale gelmesini hedefliyor.
- **why_it_matters:** Object header boyutu Java heap yoğunluğunu doğrudan etkiler. Object-heavy backend servislerde daha küçük header, daha az heap baskısı, daha az GC ve potansiyel CPU kazanımı anlamına gelebilir.
- **java_spring_relevance:** Spring Boot servisleri framework metadata, bean graph, DTO, proxy, collection, cache, ORM entity ve serialization nesneleri nedeniyle object-heavy olabilir. Bu yüzden JVM seviyesindeki memory layout değişiklikleri uygulama kodu değişmeden kapasite ve latency değerlerini etkileyebilir.
- **actionability:** `ea_benchmark_ve_izle`
- **impact_level:** `orta-yüksek`
- **opportunities:** JDK 27 EA hattında heap/RSS/GC ölçümleri yapmak; object-heavy servislerde kapasite kazanımını erken görmek; container memory limitlerini daha gerçekçi ayarlamak.
- **risks:** Instrumentation agent'ları, profiler'lar, native entegrasyonlar veya object layout varsayımı yapan düşük seviye kütüphaneler beklenmeyen davranış gösterebilir. Hype etkisiyle ölçümsüz kapasite azaltımı risklidir.
- **migration_notes:** JDK 27 EA testlerinde aynı workload'u default ayar ve `-XX:-UseCompactObjectHeaders` ile karşılaştırın. Ölçümler heap usage, RSS, GC count/time, allocation rate, p95/p99 latency ve startup sürelerini içermeli. Production kararı GA ve ilgili vendor JDK doğrulaması beklenerek verilmeli.

### 2. `JEP 533`, Structured Concurrency'nin hala preview ama yönü net bir API olduğunu gösteriyor

- **title:** Structured Concurrency yedinci preview ile virtual thread yaşam döngüsü modelini olgunlaştırıyor
- **source:** [OpenJDK JEP 533 Candidate duyurusu](https://www.mail-archive.com/loom-dev%40openjdk.org/msg00666.html), [JEP 525 Structured Concurrency sixth preview detayları](https://openjdk.org/jeps/8366891), [InfoQ Java News Roundup - Apr 13, 2026](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/)
- **author:** `Alan Bateman`, `Viktor Klang`, `Ron Pressler`, `Mark Reinhold`, `Michael Redlich`
- **date:** `14-20 Nisan 2026`
- **category:** `concurrency-platform`
- **tags:** `openjdk`, `jdk27`, `structured-concurrency`, `virtual-threads`, `structuredtaskscope`, `cancellation`, `observability`
- **summary:** `JEP 533`, Structured Concurrency API'sini JDK 27 için yedinci preview olarak öneriyor. Amaç, ilgili alt görevleri tek bir iş birimi gibi ele alarak hata yönetimi, cancellation, timeout ve observability davranışını sadeleştirmek.
- **why_it_matters:** Virtual threads ucuz thread sağladı; fakat büyük backend sistemlerinde asıl zor konu alt görevlerin ne zaman iptal edileceği, nasıl join edileceği ve gözlemlenebilir ilişkilerinin nasıl korunacağıdır.
- **java_spring_relevance:** Spring servislerinde paralel downstream çağrılar, dış API agregasyonları, batch alt görevleri ve gateway/backend fan-out senaryoları yaygındır. Structured Concurrency bu akışlarda `ExecutorService` ve dağınık `CompletableFuture` kullanımına alternatif olabilir.
- **actionability:** `internal_poc_ama_public_apiye_sokma`
- **impact_level:** `orta`
- **opportunities:** Fan-out/fan-in servis kodlarında cancellation ve timeout davranışını daha okunabilir hale getirmek; virtual thread observability modelini erken öğrenmek; incident thread dump yorumlamasını sadeleştirmek.
- **risks:** API preview olduğu için değişmeye devam edebilir. Library public API'lerine sokulması, Spring starter veya shared platform kütüphanelerinde ileride kırılma üretir.
- **migration_notes:** Sadece internal spike ve lab ortamında deneyin. Public API, framework extension point veya uzun ömürlü shared library kontratlarına `StructuredTaskScope` sızdırmayın. POC'lerde failure, timeout, interruption, MDC/context propagation ve metrics behavior ayrı test edilmeli.

### 3. `Micrometer Metrics 1.17.0-RC1`, modern JDK metriklerini Spring observability hattına yaklaştırıyor

- **title:** Micrometer 1.17 RC1, JDK 25/26 runtime sinyallerini metrik yüzeyine taşıyor
- **source:** [Micrometer GitHub releases - 1.17.0-RC1](https://github.com/micrometer-metrics/micrometer/releases), [InfoQ Java News Roundup - Apr 13, 2026](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/)
- **author:** `Jonatan Ivanov`, `Micrometer maintainers`, `Michael Redlich`
- **date:** `13-20 Nisan 2026`
- **category:** `observability`
- **tags:** `micrometer`, `spring-boot-actuator`, `jdk25`, `jdk26`, `gc`, `forkjoinpool`, `observation`, `graalvm`
- **summary:** `Micrometer 1.17.0-RC1`; `ForkJoinPool#getDelayedTaskCount()` için `executor.delayed` gauge metriği, JDK 26 `MemoryMXBean#getTotalGcCpuTime()` için cumulative GC CPU time counter metriği, Observation scope validation, exemplar sizing ve GraalVM 25 native reflection hint düzeltmesi içeriyor.
- **why_it_matters:** JVM yeni runtime sinyalleri üretirken observability kütüphanelerinin bunları hızla görünür kılması gerekir. Aksi halde JDK yükseltmesiyle gelen fayda veya regresyonlar metrik sisteminde izlenemez.
- **java_spring_relevance:** Spring Boot Actuator, Micrometer üzerine kurulu. Bu nedenle Micrometer değişiklikleri doğrudan Spring servislerinin Prometheus/OTLP/CloudWatch/Dynatrace gözlemlenebilirliğini etkiler.
- **actionability:** `pilot_observability_testi`
- **impact_level:** `orta-yüksek`
- **opportunities:** JDK 26 upgrade testlerinde GC CPU time metriği ile GC maliyetini daha iyi izlemek; executor gecikme metriğiyle arka plan iş havuzlarında saturation sinyallerini iyileştirmek; Observation scope hatalarını testte yakalamak.
- **risks:** RC sürümü platform standardı yapmak erken olabilir. Yeni metrikler yanlış etiketleme veya yüksek kardinaliteyle dashboard/TSDB maliyeti üretebilir. Exemplar ayarları sampling ve storage maliyetiyle birlikte düşünülmeli.
- **migration_notes:** Spring Boot BOM dışına Micrometer RC override'ı yalnızca izole test servislerinde yapın. Yeni metrik isimleri, tag setleri, dashboard sorguları ve alert eşiklerini staging ortamında doğrulayın. GA çıktığında Boot'un hangi sürüm hattında bu versiyona hizalanacağını takip edin.

### 4. `Apache Camel 4.19.0`, Spring Boot 4, AI/MCP ve PQC ekseninde entegrasyon platformunu genişletiyor

- **title:** Camel 4.19.0, Spring Boot 4 desteği ve AI/MCP entegrasyonlarını aynı release içinde topluyor
- **source:** [Apache Camel 4.19.0 release notes](https://camel.apache.org/releases/release-4.19.0/), [Apache Camel 4.19 What's New](https://camel.apache.org/blog/2026/04/camel419-whatsnew/), [InfoQ Java News Roundup - Apr 13, 2026](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/)
- **author:** `Apache Camel maintainers`, `Claus Ibsen ve katkıda bulunanlar`, `Michael Redlich`
- **date:** `Nisan 2026`
- **category:** `integration-platform`
- **tags:** `apache-camel`, `spring-boot-4`, `kafka-4.2`, `mcp`, `spring-ai`, `oauth`, `pqc`, `pgvector`, `huggingface`
- **summary:** Camel 4.19.0; Spring Boot 4 desteği, Kafka 4.2 client upgrade, MCP client desteği, Camel JBang MCP araçları, AI bileşenleri için OAuth SPI, Spring AI Image component, Hugging Face, pgvector, Azure Functions, Google AI bileşenleri ve PQC TLS/named groups hazırlıkları içeriyor.
- **why_it_matters:** Camel, kurumsal entegrasyonların merkezinde olan ekipler için yalnızca mesaj route eden bir kütüphane değil, artık AI tool orchestration, kimlik, cloud servisleri, vektör veri ve güvenli TLS hazırlığı gibi platform konularını bir araya getiriyor.
- **java_spring_relevance:** Spring Boot üzerinde Camel starter kullanan ekipler Boot 4'e geçişte Camel 4.19'u test etmek zorunda kalacak. Kafka, OAuth, MCP ve Spring AI bileşenleri Spring Cloud/Spring Integration kullanan mimarilerle de kesişiyor.
- **actionability:** `hedefli_poc_ve_bom_testi`
- **impact_level:** `orta-yüksek`
- **opportunities:** Boot 4 migration branch'lerinde Camel route'larını erken doğrulamak; MCP araçlarıyla route teşhis/test scaffold üretimini denemek; AI route'larında OAuth profilleri ve secured MCP server kullanımını standartlaştırmak.
- **risks:** Boot BOM ve Camel BOM karışımı dependency conflict üretebilir. AI/MCP route'ları yanlış izin modeliyle veri sızıntısı yaratabilir. PQC ayarları TLS uyumluluğu test edilmeden açılırsa eski endpoint'lerle handshake sorunu çıkarabilir.
- **migration_notes:** Önce dependency tree ve BOM sıralamasını doğrulayın. Camel route integration testlerini Boot 4 branch'inde koşturun. Kafka 4.2 client, OAuth token refresh, MCP transport, SSL named groups ve route shutdown davranışını ayrı senaryolarla test edin. JDK 25 hedefleniyorsa Camel 4.20 planını izleyin.

### 5. `Jakarta EE 12` kilometre taşları, enterprise Java standart zeminini uzun vadeli etkiliyor

- **title:** Jakarta EE 12 planı Core Profile için 2026 sonu, Web/Profile Platform için 2027 penceresi çiziyor
- **source:** [Eclipse Foundation - Hashtag Jakarta EE #329](https://blogs.eclipse.org/post/ivar-grimstad/hashtag-jakarta-ee-329), [Jakarta EE Core Profile 12 under development](https://jakarta.ee/specifications/coreprofile/12/), [InfoQ Java News Roundup - Apr 13, 2026](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/)
- **author:** `Ivar Grimstad`, `Jakarta EE Platform team`, `Michael Redlich`
- **date:** `19-20 Nisan 2026`
- **category:** `enterprise-java-standards`
- **tags:** `jakarta-ee-12`, `core-profile`, `web-profile`, `servlet`, `cdi`, `json-b`, `json-p`, `rest`, `java21`
- **summary:** Jakarta EE 12 planında M4 dönemi `1 Nisan - 15 Mayıs 2026` olarak tanımlandı. REST 5.0, CDI 5.0, JSON-P 2.2 ve JSON-B 3.1 için milestone/beta ilerlemesi bekleniyor. Core Profile'ın Q4 2026, Web Profile ve Platform'un 2027'nin ilk yarısında çıkması hedefleniyor.
- **why_it_matters:** Jakarta EE standartları, Spring dışı uygulama sunucuları kadar Spring'in kullandığı alt API'leri ve Java enterprise beklentilerini de etkiler. Servlet, Validation, Persistence ve JSON standartlarındaki değişimler uzun vadede Spring Boot dependency ve compatibility kararlarına yansır.
- **java_spring_relevance:** Spring Boot 4 ve Framework 7 zaten Jakarta namespace döneminde olgunlaşıyor. Jakarta EE 12'nin Java SE 21+ tabanı, HTTP/3 değerlendirmeleri, virtual thread programlama modeli ve SecurityManager temizliği Spring ekiplerinin platform kararlarıyla aynı yöne işaret ediyor.
- **actionability:** `roadmap_izleme`
- **impact_level:** `orta`
- **opportunities:** Enterprise platform yol haritasında Jakarta API seviyelerini erken takip etmek; uygulama sunucusu, Servlet container, Validation/JPA provider ve JSON binding stratejisini planlamak.
- **risks:** Jakarta EE 12 zaman çizelgesini Spring Boot release takvimiyle karıştırmak; henüz milestone/beta seviyesindeki API'leri production beklentisiyle değerlendirmek.
- **migration_notes:** Bugün uygulama migration'ı gerektirmez. Platform ekipleri Servlet, Validation, Persistence, REST ve JSON bağımlılıklarını roadmap dokümanına eklemeli; Boot dependency management dışına Jakarta API override yapılmamalı.

### 6. Quarkus'un reflection-free Jackson kararı, Spring AOT ve JSON performansı için rekabetçi sinyal veriyor

- **title:** Reflection-free Jackson serializers default hale gelirken JSON serialization performansı daha stratejik oluyor
- **source:** [Quarkus - Enabling reflection-free Jackson serializers by default](https://quarkus.io/blog/reflection-free-jsckson-serializers/), [Baeldung Java Weekly 642](https://www.baeldung.com/java-weekly-642)
- **author:** `Mario Fusco`, `Baeldung`
- **date:** `13-17 Nisan 2026`
- **category:** `serialization-performance`
- **tags:** `jackson`, `reflection`, `quarkus`, `aot`, `native-image`, `json`, `spring-boot`
- **summary:** Quarkus, build-time metaprogramming ile üretilen reflection-free Jackson serializer/deserializer optimizasyonunu `3.35` release'inde varsayılan yapmayı planlıyor. Amaç, Jackson'ın runtime reflection maliyetini azaltmak ve performans/uyumluluk dengesini olgunlaştırmak.
- **why_it_matters:** JSON serialization çoğu Java backend servisinin hot path'inde yer alır. Reflection maliyeti, native image hint karmaşıklığı ve serializer uyumluluğu modern framework performansının kritik alanları haline geliyor.
- **java_spring_relevance:** Spring MVC/WebFlux uygulamaları Jackson'ı yoğun kullanır. Spring AOT/native image ve Boot 4/Jackson 3 dönemi yaklaşırken reflection azaltma, serializer uyumluluğu ve endpoint-level benchmark disiplini Spring ekipleri için de önemlidir.
- **actionability:** `karsilastirmali_benchmark_ve_izleme`
- **impact_level:** `orta`
- **opportunities:** Spring uygulamalarında JSON serialization benchmark seti kurmak; native image ve JVM modunda serializer davranışını karşılaştırmak; Jackson 3 geçişinde reflection hint borcunu görünür yapmak.
- **risks:** Quarkus optimizasyonunu doğrudan Spring'e taşınabilir sanmak; serialization performansını sadece mikrobenchmark ile değerlendirip gerçek DTO çeşitliliği, polymorphism, custom serializer ve validation etkilerini kaçırmak.
- **migration_notes:** Spring tarafında hemen değişiklik gerektirmez. Ancak Boot 4/Jackson 3 POC'lerinde JMH ve endpoint benchmark'ları, AOT/native image smoke testleri, custom serializer/deserializer ve polymorphic DTO senaryoları birlikte çalıştırılmalı.

### 7. `JBang 0.138.0`, Java otomasyonlarında WAR çalıştırma ve manifest flag uyumluluğunu iyileştiriyor

- **title:** JBang 0.138.0, self-bootable WAR çalıştırmayı ve manifest launcher flag davranışını destekliyor
- **source:** [JBang 0.138.0 release summary](https://newreleases.io/project/github/jbangdev/jbang/release/v0.138.0), [InfoQ Java News Roundup - Apr 13, 2026](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/)
- **author:** `JBang maintainers`, `Michael Redlich`
- **date:** `13-20 Nisan 2026`
- **category:** `developer-productivity`
- **tags:** `jbang`, `java-cli`, `automation`, `war`, `manifest`, `developer-tools`
- **summary:** `JBang 0.138.0`, WAR dosyalarını JAR dosyalarıyla benzer kabiliyetlerle çalıştırma desteği ekliyor. Ayrıca `MANIFEST.MF` launcher flag'lerinin `java -jar` davranışına daha yakın onurlandırılması ve bazı CVE/dependency düzeltmeleri var.
- **why_it_matters:** JBang, Java'yı script ve automation dili olarak kullanan ekipler için pratik bir araç. WAR çalıştırma desteği, self-contained Java web artifact'lerini hızlı deneme veya lokal teşhis senaryolarında kolaylık sağlayabilir.
- **java_spring_relevance:** Spring Boot çoğunlukla executable JAR ile çalışsa da bazı kurumsal ekipler WAR packaging kullanıyor. JBang bu artifact'leri lokal tooling veya otomasyon içinde çalıştırma deneyimini sadeleştirebilir.
- **actionability:** `dusuk_oncelik_deneme`
- **impact_level:** `düşük-orta`
- **opportunities:** Lokal teşhis, demo, migration spike ve küçük Java otomasyonlarında JBang kullanımını genişletmek.
- **risks:** Production runtime standardı gibi kullanmak veya kurumsal deployment süreçlerini JBang'e bağlamak doğru değildir. WAR behavior, uygulama sunucusu semantiğinin tamamını temsil etmeyebilir.
- **migration_notes:** Zorunlu migration yok. Developer tooling reposunda JBang version pinning yapılabilir; güvenlik politikası olan ortamlarda indirilen script/dependency kaynakları ayrıca denetlenmeli.

## Sonuç

Bugünün ana sinyali, Java/Spring ekosisteminin aynı anda üç katmanda ilerlediğidir: JVM runtime verimliliği, observability'nin yeni JDK API'lerine uyumu ve entegrasyon/AI platformlarının Boot 4, MCP, OAuth ve PQC yönünde genişlemesi.

Kısa vadede Spring ekiplerinin en somut aksiyonu, beklenen Boot patch sürümlerini izlemeye devam etmek ve JDK/Micrometer/Camel başlıklarını izole test ortamlarında ölçmektir. Orta vadede ise Compact Object Headers, Structured Concurrency ve Jakarta EE 12 gibi başlıklar roadmap seviyesinde takip edilmeli; bunlar bugünden geniş migration başlatacak konular değil, ama 2026 sonu ve 2027 platform kararlarını şekillendirecek sinyallerdir.
