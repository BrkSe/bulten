# Günlük Java / Spring Ekosistem Raporu

Tarih: 3 Ağustos 2026 Pazartesi  
Tarama zamanı: 3 Ağustos 2026 09:09 TSİ  
Odak: stateful workflow yüzeyleri; taşıma protokollerinde genişleme ama daha sıkı güven; JVM çalışma zamanı ve veri düzlemi verimliliği

Tarama notu: 3 Ağustos 2026 itibarıyla [Spring Blog](https://spring.io/blog), [Spring proje sayfaları](https://spring.io/projects), [Spring release duyuruları](https://spring.io/blog/category/releases), ilgili GitHub release notları, [Spring Batch proje sayfası](https://spring.io/projects/spring-batch), [Spring Integration proje sayfası](https://spring.io/projects/spring-integration), [Spring Modulith proje sayfası](https://spring.io/projects/spring-modulith), [Spring gRPC proje sayfası](https://spring.io/projects/spring-grpc), [OpenJDK JEP 516](https://openjdk.org/jeps/516), [OpenJDK JEP 522](https://openjdk.org/jeps/522), [Inside Java - Performance Improvements in JDK 26](https://inside.java/2026/06/09/jdk-26-performance-improvements/), [Inside Java - JIT Compiler From the Ground Up](https://inside.java/2026/07/30/podcast-064/), [Oracle Java Blog - Transitioning Java to more frequent security updates](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), [Oracle Java Blog - Oracle Jipher 10.36](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java), [InfoQ Spring Boot 4.1 analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/), [InfoQ Spring roundup - Haziran 2026](https://www.infoq.com/news/2026/06/spring-news-roundup-jun08-2026/), [Baeldung Java Weekly 651](https://www.baeldung.com/java-weekly-651), [Baeldung - Docker Compose Support in Spring Boot](https://www.baeldung.com/docker-compose-support-spring-boot), [Josh Long - MongoDB-backed Spring Batch jobs and more in Spring Boot 4.1](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/), [Gunnar Morling - A Fast Path for Fixed-Length Lists in Parquet](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/), [Burak KUTBAY - ArchUnit ile Proje Mimarisini Test Edin](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/) ve [Burak KUTBAY - Feature Flag ile Güvenli Dağıtım](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html/) kontrol edildi. GitHub Releases API tarafında bugün hâlâ [Spring Boot `4.1.0`](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0), [Spring Batch `6.0.4`](https://github.com/spring-projects/spring-batch/releases/tag/v6.0.4), [Spring Modulith `2.1.0`](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0), [Spring Integration `7.1.0`](https://github.com/spring-projects/spring-integration/releases/tag/v7.1.0), [Spring gRPC `1.1.0`](https://github.com/spring-projects-experimental/spring-grpc/releases/tag/v1.1.0), [Spring AMQP `4.1.0`](https://github.com/spring-projects/spring-amqp/releases/tag/v4.1.0), [Spring for Apache Kafka `4.1.0`](https://github.com/spring-projects/spring-kafka/releases/tag/v4.1.0), [Spring Cloud `2025.1.2`](https://github.com/spring-cloud/spring-cloud-release/releases/tag/v2025.1.2), [Spring Framework `7.0.8`](https://github.com/spring-projects/spring-framework/releases/tag/v7.0.8) ve [Spring Tools `5.3.0.RELEASE`](https://github.com/spring-projects/sts4/releases/tag/5.3.0.RELEASE) güncel çizgi. Bugün yeni bir büyük Spring GA dalgası yok; güçlü sinyal, durum tutan iş akışlarının ve taşıma yüzeylerinin artık daha açık sahiplik istemesi.

## Öne Çıkan Başlıklar

- Spring Batch tarafında `JobRepository` için MongoDB artık gerçek bir birinci sınıf seçenek; sadece batch metadata tutmak için ayrı SQL sidecar taşıma zorunluluğu zayıflıyor.
- Spring Modulith 2.1, outbox/event externalization ve modül testlerini olgunlaştırıyor; mimari sınırlar wiki metni olmaktan çıkıp testlenen bir sözleşmeye dönüşüyor.
- Spring’in taşıma yüzeyi aynı anda genişliyor ve sertleşiyor: gRPC, CloudEvents ve AMQP 1.0 desteği artarken `trust-all` benzeri varsayımlar kapanıyor.
- JDK 26 çalışma zamanı iyileştirmeleri, Spring servislerine uygulama kodunu değiştirmeden startup, throughput ve virtual-thread ölçeklenmesi tarafında yeni headroom açıyor.
- Düşük öncelikli ama gerçek sinyal: JVM veri düzleminde Parquet/fixed-size list optimizasyonları, embedding veya analitik yan yük taşıyan Java servislerini daha ciddiye alınır hale getiriyor.

## Kritik Güncellemeler

### 1. Spring Batch 6.0.4 ve Boot 4.1, batch state'i SQL zorunluluğundan çıkarıyor

[Josh Long’un 21 Haziran 2026 tarihli yazısı](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/) ve [Spring Batch 6.0.4 release notları](https://github.com/spring-projects/spring-batch/releases/tag/v6.0.4), Batch `JobRepository` katmanının MongoDB ile artık pratik ve Boot dostu hale geldiğini gösteriyor. Spring Batch yıllarca job, step ve execution metadata’sı için SQL varsaydı; Boot 4.1 ile gelen `spring-boot-starter-batch-data-mongodb` bu bağımlılığı azaltıyor.

Bu yeni bir "NoSQL ile de olur" cümlesinden daha önemli. Eğer ekip zaten MongoDB üzerinde yaşıyorsa, sadece Batch metadata için ikinci bir ilişkisel veritabanı taşımanın operasyonel maliyeti artık daha zor savunulur. Buna karşılık, transaction gereksinimi devam ediyor; örnek kurulumun replica set istemesi tesadüf değil.

### 2. Spring Modulith 2.1, modüler monolith'i sunum değil operasyon disiplini haline getiriyor

[Spring Modulith 2.1 GA duyurusu](https://spring.io/blog/2026/06/11/spring-modulith-2-1-ga-2-0-7-and-1-4-12-released/) ve [proje sayfası](https://spring.io/projects/spring-modulith), event externalization outbox desteği, JobRunr/Namastack entegrasyonları, modül-seviyesi testler ve observability düzenlemeleriyle artık "ileride bakarız" kategorisinden çıktı. [Burak KUTBAY’ın 11 Temmuz 2026 tarihli ArchUnit yazısı](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/) ile birlikte okunduğunda mesaj net: paket sınırları, dependency yönü ve event akışı insan hafızasına bırakılamaz.

Özellikle Spring Boot tabanlı tek deploy unit içinde büyüyen ekiplerde, dağıtık sisteme geçmeden önce domain sınırlarını test ve outbox katmanıyla görünür kılmak daha ekonomik bir yol sunuyor.

### 3. Transport seçenekleri artıyor; buna karşılık "kolay ama gevşek" varsayımlar kapanıyor

[Spring Boot 4.1 duyurusu](https://spring.io/blog/2026/06/10/spring-boot-4/) ve [Spring Office Hours - Phil Webb bölümü](https://spring.io/blog/2026/07/06/spring-office-hours-podcast-S5E17/) Boot tarafında gRPC desteğini ve AMQP 1.0 gibi ek yüzeyleri öne çıkarıyor. [Spring gRPC 1.1.0](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now/), [Spring Integration 7.1.0](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/), [Spring AMQP 4.1.0](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/) ve [Spring for Apache Kafka 4.1.0](https://spring.io/blog/2026/06/09/spring-kafka-4/) birlikte okunduğunda aynı desen görünüyor:

- gRPC artık Boot 4.1 ile daha doğal bir transport seçeneği
- CloudEvents dönüşümleri doğrudan Integration modülüne girdi
- AMQP 1.0 için ayrı client yüzeyi açıldı
- JSON converter ve trusted package davranışlarında eski gevşek güven varsayımları kapanıyor
- retry routing, selector cache ve remote file sync gibi alanlarda güvenlik/CVE temizliği yapılıyor

Bu, "daha fazla seçenek" kadar "daha az gizli varsayım" demek. Protokol seçimi, header güveni, deserialization politikası ve retry semantiği artık starter ekleyip unutulacak konular değil.

### 4. JDK 26, Spring servislerine bedava performans alanı açıyor

[Inside Java’nın 9 Haziran 2026 tarihli JDK 26 performans özeti](https://inside.java/2026/06/09/jdk-26-performance-improvements/) ve ilgili [JEP 516](https://openjdk.org/jeps/516) / [JEP 522](https://openjdk.org/jeps/522) başlıkları, JDK tarafında yalnız sentaktik değil doğrudan çalışma zamanı kazançları geldiğini gösteriyor. Öne çıkanlar:

- G1’de daha az senkronizasyon ile referans-ağır iş yüklerinde throughput artışı
- AOT object cache’in GC bağımsız hale gelmesiyle startup ve warmup kazanımları
- explicit `-Xms` verilmediğinde daha küçük başlangıç heap’i
- class initialization beklerken virtual thread’lerin carrier’dan ayrılabilmesi
- çok parametreli metodların C2 tarafından daha iyi derlenmesi

Bu değişikliklerin çoğu Spring Boot servislerinde doğrudan iş kodu değiştirmeden hissedilebilir; ama "JDK yükselttik, kesin hızlı" diye varsaymak yanlış olur. Özellikle startup-sensitive servis, function workload, virtual-thread yoğun akış ve referans-ağır domain modellerinde ölçüm yapılmalı.

### 5. Regüle ortamlarda Java kripto davranışı sıkılaşıyor

[Oracle Jipher 10.36 duyurusu](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java) genel Java dünyası için niş görünebilir; ama FIPS-regulated ortamlarda çalışan Spring servisleri için doğrudan davranış etkisi var. DSA key/signature generation desteğinin kalkması, TLS 1.2 tarafında Extended Master Secret zorunluluğu, Triple DES kısıtları, RSA-PSS ve PBKDF2 sınırları "sadece provider patch’i" değil.

Bu tür değişiklikler özellikle mTLS, legacy partner bağlantıları, password-based key derivation ve eski sertifika/algoritma mirası olan kurumsal entegrasyonlarda sessiz kırılma yaratabilir. Ayrıca Oracle, Jipher 10.36’nın GraalVM for JDK 17/21 destekleyen son planlı sürüm olduğunu söylüyor; bu da FIPS gerektiren native veya GraalVM tabanlı kurulumlar için açık migration baskısı demek.

## Trendler ve Sinyaller

### Trend Kümesi 1: Stateful workflow altyapısı framework çekirdeğine yaklaşıyor

Tekrarlayan sinyal:

- Batch metadata artık yalnız JDBC dünyasına bağlı değil
- event externalization/outbox pratikleri yan kütüphane numarasından ana tasarım kararına çıkıyor
- modül sınırları ve modül testleri, microservice'e kaçmadan önce de ciddi yatırım alanı haline geliyor

Bu kısa vadeli hype değil. Özellikle hem online transaction hem batch hem event akışı taşıyan ekiplerde kalıcı değer üretiyor.

### Trend Kümesi 2: Protocol sprawl büyüyor; buna karşılık güven varsayımları daralıyor

Tekrarlayan sinyal:

- gRPC ve CloudEvents gibi alternatifler artık resmi Spring yüzeyinde
- AMQP/Kafka tarafında güvenlik düzeltmeleri davranış ve config beklentilerini değiştiriyor
- `trust-all`, gevşek deserialization ve implicit retry yönlendirmesi gibi pratikler giderek daha pahalı hale geliyor

Buradaki esas iş teknoloji seçmek değil; hangi protokolün hangi sınırda kullanılacağını ve güven sözleşmesini açıkça yazmak.

### Trend Kümesi 3: JVM hâlâ altyapı vergisini düşürüyor

Tekrarlayan sinyal:

- JDK 26, startup/warmup/throughput tarafında uygulama katmanını rahatlatan iyileştirmeler taşıyor
- Gunnar Morling’in Parquet fixed-size list yazısı, JVM veri düzleminin embeddings ve analitik yan işlerde de daha rekabetçi olabileceğini gösteriyor

Bu, her Spring servisinin data engine olacağı anlamına gelmez. Ama performans darboğazını sadece framework seviyesinde aramak giderek daha zayıf bir refleks.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: Batch/job state ve event externalization sahipliğini açıkça tasarlamak
- Kalıcı değer: Transport başına güven sözleşmesi tanımlamak
- Kalıcı değer: JDK yükseltmelerini yalnız güvenlik değil performans kapasitesi olarak da değerlendirmek
- Düşük öncelik: Embedding/Parquet optimizasyonları, veri-yoğun veya AI-adjacent yükünüz yoksa bugün ana backlog maddesi değil

## Araçlar ve Kütüphaneler

- [`spring-boot-starter-batch-data-mongodb`](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/): Batch metadata için MongoDB tabanlı autoconfiguration; sadece metadata uğruna ayrı SQL instance taşıyan ekipler için önemli.
- [Spring Modulith 2.1](https://spring.io/projects/spring-modulith): outbox/event externalization, modül testleri ve modulith-level observability ile büyüyen Boot uygulamaları için ciddi seçenek.
- [`spring-integration-cloudevents`](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/) ve [`spring-integration-grpc`](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/): event ve gRPC akışlarını enterprise integration modeline daha doğal taşıyor.
- [`spring-amqp-client`](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/): AMQP 1.0 desteği ile RabbitMQ dışındaki broker topolojileri için daha ciddi opsiyon.
- [Spring gRPC 1.1.0](https://spring.io/projects/spring-grpc): Boot 4.1 autoconfiguration hattına taşınmış gRPC katmanı.
- [Hardwood](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/): fixed-size list/Parquet okuma maliyetini ciddi düşüren JVM kütüphanesi; klasik CRUD servisleri için değil, data-heavy yan işler için izlemeye değer.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Batch kullanıyor ama domain verisini esasen MongoDB’de tutuyorsanız, ikinci veritabanını yalnız metadata için taşıyıp taşımadığınızı tekrar sorgulamanın zamanı geldi.
- Tek deploy edilen ama modüler olması gereken büyük Spring Boot uygulamalarında `ApplicationModules.verify()`, modül testleri ve ArchUnit kuralları birlikte düşünülmeli.
- gRPC, Kafka, AMQP ve CloudEvents aynı platformda çoğaldıkça "her iş için bir protokol" yaklaşımı teknik çeviklik değil, governance borcu üretebilir.
- JDK 26’ya geçiş yalnız güvenlik veya LTS takvimi açısından değil; startup, virtual thread ve throughput kazanımı açısından da ölçülmeli.
- Regüle ortamlarda kripto provider güncellemeleri, uygulama davranışını framework patch’leri kadar sert etkileyebilir; özellikle legacy TLS/mTLS hatlarında.

## Fırsatlar ve Riskler

- Fırsat: Batch metadata altyapısını domain topolojinize yaklaştırıp gereksiz SQL bağımlılığını azaltmak
- Risk: Mongo-backed Batch desteğini transaction gereksinimini hesaba katmadan pilotlamak
- Fırsat: Modül sınırlarını test ve outbox ile doğrulayıp erken microservice bölünmesini geciktirmek
- Risk: Modulith veya ArchUnit’i yalnız dokümantasyon aksesuarı gibi kullanıp CI kapısı yapmamak
- Fırsat: gRPC/CloudEvents/AMQP 1.0 ile taşıma yüzeyini bilinçli sadeleştirmek
- Risk: Aynı ekipte birden fazla protokolü ortak sözleşme olmadan büyütmek
- Fırsat: JDK 26 iyileştirmelerini kullanarak startup ve throughput kazanımını düşük maliyetle almak
- Risk: JVM kazanımlarını üretim-benzeri benchmark yapmadan genellemek
- Fırsat: FIPS veya regüle ortamlarda kripto davranışını erken test edip kırılmaları kontrollü yakalamak
- Risk: provider güncellemesini görünmez altyapı işi sayıp uygulama regresyonu testini atlamak

## İzlenmesi Gereken Konular

- Spring Boot 4.1 üzerinde gRPC ve CloudEvents kullanımının sahada tekil servislerde mi, platform standardı olarak mı yerleşeceği
- Mongo-backed Batch repository kullanan ekiplerde replica set, transaction ve restart semantics tarafında gerçek üretim geri bildirimi
- Spring Modulith 2.1’in outbox/JobRunr entegrasyonlarının ekiplerce dağıtık orkestrasyon yerine ne ölçüde tercih edileceği
- JDK 26 performans kazanımlarının sizin servis profilinizde startup mı, throughput mu, yoksa virtual-thread ölçeklenmesi mi ürettiği
- 18 Ağustos 2026’daki planlı Java CSPU ile daha sık güvenlik güncellemesi ritminin build/test/release süreçlerini ne kadar zorladığı
- Düşük öncelik: fixed-size vector/Parquet optimizasyonlarının Spring veri platformu veya embedding-adjacent servisler için ayrı bir JVM avantajı üretip üretmediği

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: MongoDB-backed JobRepository, Spring Batch state yönetimini uygulama topolojisine yaklaştırıyor
- `source`: [MongoDB-backed Spring Batch jobs and more in Spring Boot 4.1](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/) | [Spring Batch 6.0.4 and 5.2.6 available now](https://spring.io/blog/2026/06/10/spring-batch-6-0-4-and-5-2-6-available-now) | [Spring Batch project page](https://spring.io/projects/spring-batch)
- `author`: Josh Long | Mahmoud Ben Hassine
- `date`: 21 Haziran 2026 | 10 Haziran 2026
- `category`: batch-processing, data-access, platform-topology
- `tags`: spring-batch, mongodb, jobrepository, boot-4.1, metadata-store, transactions
- `summary`: Spring Batch `JobRepository` için MongoDB desteği ve Boot 4.1 starter/autoconfiguration hattı, batch metadata’nın yalnız JDBC ile tutulduğu dönemi fiilen kapatıyor.
- `why_it_matters`: Sadece batch metadata yüzünden ikinci bir ilişkisel veritabanı işletmek birçok ekip için gereksiz operasyon maliyeti yaratıyordu.
- `java_spring_relevance`: Spring Batch kullanan ve esas veri topolojisi MongoDB olan Java/Spring ekipleri için doğrudan mimari ve operasyon kararı üretir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: veri topolojisini sadeleştirmek; sidecar SQL bağımlılığını azaltmak; batch kurulumunu domain verisine daha yakın taşımak
- `risks`: replica set ve transaction gereksinimini küçümsemek; restart semantics’i pilotlamadan üretime çıkmak; sink/topoloji ayrımını ihmal etmek
- `migration_notes`: Batch metadata için ayrı RDBMS taşıyan servisleri listeleyin; transaction gereksinimi ve restart senaryolarını replica set ile test edin; job metadata ve business data store kararlarını bilinçli ayırın.

### Bulgu 2

- `title`: Spring Modulith 2.1 ve ArchUnit, modüler monolith sınırlarını testlenebilir sözleşmeye çeviriyor
- `source`: [Spring Modulith 2.1 GA, 2.0.7, and 1.4.12 released](https://spring.io/blog/2026/06/11/spring-modulith-2-1-ga-2-0-7-and-1-4-12-released/) | [Spring Modulith project page](https://spring.io/projects/spring-modulith) | [ArchUnit ile Proje Mimarisini Test Edin](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/)
- `author`: Oliver Drotbohm | Burak KUTBAY
- `date`: 11 Haziran 2026 | 11 Temmuz 2026
- `category`: architecture, testing, eventing, governance
- `tags`: spring-modulith, archunit, outbox, jobrunr, module-tests, applicationmodules
- `summary`: Modulith 2.1; outbox/event externalization, modül-seviyesi testler ve observability iyileştirmeleriyle büyüyen Boot uygulamalarında sınır doğrulamasını pratik hale getiriyor; ArchUnit bunu daha genel mimari kurallarla tamamlıyor.
- `why_it_matters`: Dağıtık sisteme geçmeden önce modül sınırlarını ve dependency yönünü test etmeyen ekipler, kod tabanı büyüdükçe refactor maliyetini katlıyor.
- `java_spring_relevance`: Tek deploy edilen ama çok domain taşıyan Spring Boot sistemlerinde doğrudan uygulanabilir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: modül boundary’lerini CI kapısı yapmak; outbox ile event externalization’ı standartlaştırmak; mimari ihlalleri erken yakalamak
- `risks`: modulith kullanımını yalnız diyagram üretimine indirgemek; event externalization ile transaction sahipliğini netleştirmemek; mimari testleri opsiyonel bırakmak
- `migration_notes`: Önce bir bounded context seçin; `ApplicationModules.of(...).verify()` ve en az bir `@ApplicationModuleTests` senaryosu ekleyin; paket/katman kurallarını ArchUnit ile CI’da zorunlu hale getirin.

### Bulgu 3

- `title`: Transport yüzeyi genişlerken mesaj güveni ve davranış varsayımları sertleşiyor
- `source`: [Spring Boot 4.1.0 available now](https://spring.io/blog/2026/06/10/spring-boot-4/) | [Spring Office Hours Podcast: S5E17 - Spring Boot 4.1 with Phil Webb](https://spring.io/blog/2026/07/06/spring-office-hours-podcast-S5E17/) | [Spring gRPC 1.1.0 available now](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now/) | [Spring Integration 7.1.0 Available](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/) | [Spring AMQP 4.1.0 Available](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/) | [Spring for Apache Kafka 4.1.0, 4.0.6, and 3.3.16 Available](https://spring.io/blog/2026/06/09/spring-kafka-4/)
- `author`: Andy Wilkinson | Dan Vega | Dave Syer | Glenn Renfro | Artem Bilan | Soby Chacko
- `date`: 9-10 Haziran 2026 | 6 Temmuz 2026
- `category`: messaging, service-communication, security-hardening, protocol-governance
- `tags`: spring-grpc, spring-integration, cloudevents, amqp-1.0, kafka, deserialization, retry-topics
- `summary`: Spring portföyü aynı anda gRPC, CloudEvents ve AMQP 1.0 gibi daha fazla transport seçeneği açıyor; fakat JSON converter, trusted package, retry routing ve file sync gibi yüzeylerde eski gevşek varsayımları da kapatıyor.
- `why_it_matters`: Transport çoğaldıkça güven, retry ve serialization kararları görünmez teknik borca dönüşür.
- `java_spring_relevance`: Microservice, event-driven ve integration-heavy Spring ekipleri için doğrudan üretim etkisi vardır.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: gRPC/CloudEvents/AMQP 1.0 ile daha net integration contract’ları kurmak; implicit güven varsayımlarını temizlemek; retry ve deserialization politikasını standardize etmek
- `risks`: çoklu protokol sprawl; gevşek trusted packages; header tabanlı saldırı yüzeyi; eski config’lerin davranış değiştirmesi
- `migration_notes`: Her transport için tek sayfalık sözleşme hazırlayın: serialization formatı, trusted packages, retry/backoff, error mapping, observation. AMQP/Kafka ve Integration kullanan hatlarda regresyon ve negatif güvenlik testlerini ayrı koşun.

### Bulgu 4

- `title`: JDK 26, startup ve throughput maliyetini Spring uygulamalarında altyapı katmanında düşürüyor
- `source`: [Performance Improvements in JDK 26](https://inside.java/2026/06/09/jdk-26-performance-improvements/) | [JEP 516: Ahead-of-Time Object Caching with Any GC](https://openjdk.org/jeps/516) | [JEP 522: G1 GC: Improve Throughput by Reducing Synchronization](https://openjdk.org/jeps/522) | [Episode 64 “JIT Compiler From the Ground Up”](https://inside.java/2026/07/30/podcast-064/)
- `author`: Ana-Maria Mihalceanu | Per-Ake Minborg | Nicolai Parlog | Roberto Lozano
- `date`: 9 Haziran 2026 | 30 Temmuz 2026
- `category`: jvm, performance, runtime, virtual-threads
- `tags`: jdk-26, g1, aot-cache, c2, startup, virtual-threads, hotspot
- `summary`: JDK 26; G1 throughput, GC-agnostic AOT cache, daha küçük default başlangıç heap’i, virtual thread carrier unmounting ve C2 iyileştirmeleriyle backend servislerde kod değiştirmeden performans alanı açıyor.
- `why_it_matters`: Performans darboğazı her zaman uygulama kodunda değil; doğru JDK seviyesi bazen framework düzeyindeki optimizasyondan daha ucuz kazanç üretir.
- `java_spring_relevance`: Spring Boot mikroservisleri, fonksiyon iş yükleri ve virtual-thread deneyen ekipler için doğrudan anlamlıdır.
- `actionability`: `izle_ve_pilotla`
- `impact_level`: `orta-yüksek`
- `opportunities`: startup/warmup süresini azaltmak; throughput kazanmak; virtual-thread yoğun akışları daha güvenli pilotlamak
- `risks`: JDK yükseltmesini benchmark yapmadan genellemek; GC ve heap davranışındaki değişiklikleri izlememek; AOT cache davranışını kör kullanmak
- `migration_notes`: JDK 26 pilotunda startup süresi, p95 latency, allocation rate ve CPU kullanımını birlikte ölçün; virtual-thread kullanan akışlarda class-loading yoğun başlangıç senaryolarını ayrıca test edin.

### Bulgu 5

- `title`: FIPS-regulated Java crypto yüzeyi daha kısıtlayıcı hale geliyor
- `source`: [Announcing Oracle Jipher 10.36: FIPS 140-3 Cryptography for Java](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java) | [Transitioning Java to more frequent security updates](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates)
- `author`: Poonam Parhar | Donald Smith
- `date`: 4 Haziran 2026 | 20 Temmuz 2026
- `category`: security, cryptography, compliance, runtime-policy
- `tags`: fips-140-3, jipher, tls-1.2, pbkdf2, graalvm, java-cspu
- `summary`: Oracle Jipher 10.36; algoritma ve kullanım kısıtlarını sıkılaştırıyor, bazı legacy davranışları kapatıyor ve GraalVM tabanlı FIPS kurulumları için çıkış baskısı oluşturuyor; Oracle ayrıca 18 Ağustos 2026 için ek Java güvenlik güncellemesi hedefliyor.
- `why_it_matters`: Kripto provider ve patch cadence değişiklikleri, özellikle regüle ortamlarda doğrudan uygulama davranışını ve release ritmini etkiler.
- `java_spring_relevance`: Spring Security, mTLS, legacy partner entegrasyonu ve FIPS zorunluluğu olan Java backend ekipleri için kritik olabilir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: legacy kripto kullanımını temizlemek; FIPS uyumunu daha erken test etmek; patch acceptance sürecini sıklaştırmak
- `risks`: DSA, Triple DES, PBKDF2 veya TLS 1.2 kenar durumlarında sessiz kırılma; GraalVM tabanlı FIPS topolojilerinde destek boşluğu
- `migration_notes`: Algoritma envanteri çıkarın; mTLS ve password-based crypto akışlarını negatif testlerle doğrulayın; GraalVM üzerinde FIPS kullanan servisler için Oracle JDK geçiş seçeneğini masaya alın.

## Sonuç

3 Ağustos 2026 itibarıyla en güçlü mühendislik sinyali yeni bir framework ismi değil; state tutan iş akışlarını, event dışsallaştırmasını, mesaj güvenini ve JDK çalışma zamanı kazanımlarını birlikte yönetebilmek. Spring ekipleri için bugünün pratik kararı şu: batch state, modül sınırı, transport güveni ve JDK seviyesi artık birbirinden bağımsız backlog maddeleri değil; tek bir platform işletim disiplini olarak ele alınmalı.
