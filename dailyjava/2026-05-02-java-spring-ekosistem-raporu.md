# Günlük Java / Spring Ekosistem Raporu

Tarih: 2 Mayıs 2026  
Odak: Spring Boot 4.0.6 güvenlik yaması ve 4.1.0-RC1 özellik dalgası, Spring AI 2.0.0-M5 kırılmaları, Boot 4 etrafında hizalanan Spring yan projeleri, JVM operasyon ve uyumluluk sinyalleri

Tarama notu: 2 Mayıs 2026 itibarıyla [Official Spring Blog](https://spring.io/blog/), [Spring Boot project page](https://spring.io/projects/spring-boot/), [Spring Cloud project page](https://spring.io/projects/spring-cloud/), Spring release postları ve changelog bağlantıları, [OpenJDK](https://openjdk.org/), [OpenJDK JEP draft: Automatic Heap Sizing for ZGC](https://openjdk.org/jeps/8377305), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’ın This Week in Spring yazısı](https://spring.io/blog/2026/04/28/this-week-in-spring-april-28-2026), [Gunnar Morling’in blogu](https://www.morling.dev/blog/), ilgili GitHub release sayfaları ve [Burak KUTBAY’ın blogu](https://blog.burakkutbay.com/) tarandı. Baeldung ve Burak KUTBAY tarafında bugün doğrudan release seviyesi yeni kırılma üreten bir gelişme öne çıkmadı; bu kaynaklar daha çok açıklayıcı ve eğitim amaçlı içerik üretmiş durumda. Bu nedenle rapor, son 10-12 gündeki daha kalıcı ve üretim etkisi yüksek sinyalleri öne çıkarır.

## Öne Çıkan Başlıklar

- [Spring Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now), sekiz ayrı CVE düzeltmesi nedeniyle doğrudan üretim patch önceliği taşıyor.
- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), observability, outbound HTTP güvenliği ve JDBC erişiminde daha olgun bir Boot 4.1 çizgisi gösteriyor.
- [Spring AI 1.0.6, 1.1.5 ve 2.0.0-M5](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now), yalnız hata düzeltmesi değil; modül kaldırmaları ve migration gerektiren API davranış değişimleri getiriyor.
- [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/) ile [Oakwood 2025.1.1 duyurusu](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released), Boot 4.0.x kullanan ekipler için doğru release train seçimini netleştiriyor.
- [Spring for Apache Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4), share consumer ve Kafka Streams hata kurtarma tarafında doğrudan davranış ve operasyon etkisi taşıyan yenilikler getiriyor.
- [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now), dinamik client registration kullanan ekipler için hemen aksiyon gerektiren bir CVE içeriyor.
- JVM tarafında [OpenJDK ZGC heap sizing taslağı](https://openjdk.org/jeps/8377305) ve [JDK 27 locale cleanup duyurusu](https://inside.java/2026/04/21/quality-heads-up/) birlikte okunmalı: JVM ergonomisi daha otomatik hale gelirken bazı eski varsayımlar da kaldırılıyor.

## Kritik Güncellemeler

### Spring Boot 4.0.6 prod ortamlar için bekletilmemeli

Boot 4.0.6 duyurusu, sıradan bir bakım sürümü olmaktan daha ağır. SSL bundle ile hostname verification’ın devre dışı kalması, zayıf PRNG ile secret benzeri değer üretimi, actuator varlığında default filter chain yetkilendirme açığı ve PID file symlink takibi gibi sekiz CVE düzeltmesi doğrudan üretim yüzeyine dokunuyor. Boot 4.0.x hattında kalan ekipler için bu sürüm teknik borç temizliği değil, güvenlik hijyeni.

### Boot 4.1.0-RC1, yalnız özellik değil operasyonel yönelim veriyor

RC1 tarafındaki üç sinyal özellikle önemli:

- OpenTelemetry SDK environment variable desteği, container ve platform tabanlı observability konfigürasyonunu daha standart hale getiriyor.
- `InetAddressFilter` tabanlı HTTP client SSRF mitigation, outbound çağrılarda uygulama seviyesinde host filtreleme zemini sunuyor.
- `LazyConnectionDataSourceProxy` desteği, transaction açıldı diye fiziksel DB bağlantısının hemen alınması zorunluluğunu azaltarak özellikle okuma ağırlıklı veya kısa transaction akışlarında maliyeti düşürme potansiyeli taşıyor.

Bu sürüm RC olduğu için prod değil pilot servislerde ele alınmalı; ama yön açık: Boot 4.1 güvenlik ve platform entegrasyonunu framework seviyesine çekiyor.

### Spring AI yükseltmeleri “patch” gibi görünse de migration işi doğuruyor

Spring AI 2.0.0-M5 içinde Azure OpenAI özel modüllerinin kaldırılması, `ModelOptionUtils.merge()` merkezli option birleştirme akışının `ChatClient.Builder.combineWith()` yönüne taşınması, Vertex AI ve OCI GenAI entegrasyonlarının ana repodan ayrılması, doğrudan derleme ve konfigürasyon etkisi üretebilir. Spring AI kullanan ekipler bu sürümü “dependency bump” olarak değil “kod ve bağımlılık envanteri kontrolü” olarak ele almalı.

### Kimlik ve yetkilendirme tarafında ayrı bir aciliyet var

Spring Authorization Server 1.5.7, dinamik client registration metadata validation açığını kapatıyor. Aynı duyuruda 1.3.x ve 1.4.x açık kaynak destek penceresinin kapanmış olması da ayrıca önemli. DCR kullanıyorsanız bu yalnız CVE değil, sürüm hattı seçimi problemidir.

## Trendler ve Sinyaller

### 1. Boot 4 artık tek ürün değil, ekosistem tabanı

Spring tarafındaki Nisan sonu dalga tek tek release’lerden ibaret değil. Boot 4.0.6, Boot 4.1 RC1, Spring Cloud Oakwood uyumluluğu, Spring Kafka 4.1 RC1, Spring Integration 7.1 RC1 ve Spring Modulith 2.1 RC1 birlikte okunduğunda tek bir mesaj çıkıyor: Boot 4, yan projelerin hizalandığı gerçek platform tabanı haline geldi.

### 2. Güvenlik sertleşmesi artık varsayılan davranış düzeyine iniyor

Boot 4.0.6 CVE listesi ile Boot 4.1 RC1’in outbound HTTP host filtering yönü aynı çizgiye bakıyor. Frameworkler artık yalnız TLS açmayı değil, doğru host doğrulamasını, daha güvenli secret üretimini ve daha sıkı request davranışını da varsayılan seviyede sıkılaştırıyor.

### 3. Event-driven yığın upstream broker semantiklerine yaklaşıyor

Spring Kafka 4.1 RC1 içindeki `ShareAckMode`, async commit callback’leri ve Kafka Streams KIP-1034 hizalanması; Spring ekibinin kendi soyutlamasını upstream broker ve stream runtime davranışlarından kopuk tutmak istemediğini gösteriyor. Bu iyi haber, çünkü uzun vadede custom recoverer ve edge-case kodunu azaltır; fakat upgrade test maliyetini artırır.

### 4. JVM ergonomisi daha otomatik, daha opinionated hale geliyor

OpenJDK’nin ZGC heap sizing taslağı, `-Xmx` ve `SoftMaxHeapSize` ayarlarının zamanla daha az elle yönetilmesini hedefliyor. Aynı dönemde JDK 27’nin eski locale resource’larını temizlemesi ise “geriye uyumluluk her şeyden önemli” çizgisinden hafifçe uzaklaşıldığını gösteriyor. JVM, hem daha akıllı varsayımlar kuruyor hem de taşınan teknik yükü uygulama ekiplerine görünür hale getiriyor.

## Araçlar ve Kütüphaneler

- [Spring for Apache Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4): Yüksek öncelik. Özellikle Kafka Streams ve share consumer kullanan ekiplerde test backlog’una girmeli.
- [Spring Integration 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available): Orta-yüksek öncelik. Redis 8.4+ kullanan lock akışlarında native CAS/CAD desteği operasyonel olarak anlamlı.
- [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released): Orta öncelik. JobRunr transaction handling ve event publication registry iyileştirmeleri modüler monolith ve outbox-benzeri akışlar için önemli.
- [Hardwood 1.0.0.Beta1](https://www.morling.dev/blog/hardwood-reaches-beta-s3-predicate-push-down-cli/): Düşük öncelik fakat izlemeye değer. Parquet okuma, object storage ve veri servisleri olan JVM ekipleri için hafif bağımlılıklı alternatif olabilir.
- [Spring Shell 4.0.2](https://docs.spring.io/spring-shell/reference/index.html): Düşük öncelik. CLI tabanlı internal tooling üreten ekipler için güncel stabil sürüm var; fakat bugün doğrudan mimari karar değiştirecek bir sinyal üretmiyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Boot 4.0.x çalıştıran servisler için en mantıklı kısa vadeli iş, 4.0.6 patch geçişini güvenlik regression testleriyle tamamlamak.
- Boot 4.1 hattı için RC1 artık okunabilir durumda; özellikle observability ve outbound HTTP güvenlik gereksinimi yüksek platform ekipleri pilot servis seçebilir.
- Spring Cloud kullanan ekipler, Boot sürümünü yükseltmeden önce release train hizasını doğrulamalı. Yanlış BOM eşleşmesi burada en pahalı hatalardan biri olur.
- Spring AI kullanan ekipler provider modülü ve option birleştirme davranışı açısından upgrade playbook yazmadan 2.0.0-M5’e geçmemeli.
- Kafka ve Integration tarafında yenilikler, event-driven sistemlerde custom glue kodunu azaltma fırsatı veriyor; fakat ack, DLQ, redelivery ve lock release semantiklerinin yeniden test edilmesini şart koşuyor.
- JVM operasyon tarafında ZGC ve locale sinyalleri, yalnız framework değil JDK roadmap’inin de backlog’da görünür tutulması gerektiğini hatırlatıyor.

## Fırsatlar ve Riskler

### Fırsatlar

- Boot 4.1 RC1 ile OpenTelemetry environment variable desteği, platform seviyesinde daha temiz observability rollout’ları sağlayabilir.
- `InetAddressFilter` çizgisi, SSRF önleme işini uygulama ekiplerinin kendi helper sınıflarından framework düzeyine taşıma fırsatı sunuyor.
- Spring Kafka 4.1’in KIP-1034 hizalanması, Kafka Streams hata işleme ve DLQ akışlarını daha az custom kodla yönetme şansı veriyor.
- Spring Integration 7.1 RC1 ve Modulith 2.1 RC1, Redis lock ve internal event publication güvenilirliğini yükselterek operasyonel sürprizleri azaltabilir.
- ZGC automatic heap sizing taslağı, container yoğun JVM platformlarında orta vadede tuning maliyetini düşürebilir.

### Riskler

- Boot 4.0.6, güvenlik açığı kapatırken bazı davranışları fiilen sıkılaştırır; TLS, actuator ve temp path bağımlı scriptler beklenmedik kırılma üretebilir.
- Boot 4.1 RC1 hâlâ RC; prod rollout için erken.
- Spring AI 2.0.0-M5, modül kaldırmaları nedeniyle doğrudan compile-time kırılma ve konfigürasyon kayması üretebilir.
- Spring Cloud 2025.0.0 ile Boot 4.0.1+ karışımı, görünürde derlenen ama çalışma zamanında sorun çıkaran classpath kombinasyonları doğurabilir.
- Spring Kafka 4.1 tarafında share consumer ve commit davranışları doğru anlaşılmazsa redelivery, duplicate processing veya gözden kaçan poison message problemleri büyüyebilir.
- JDK 27 locale temizliği, lokalize JDK mesajlarına bağımlı testleri veya araçları sessizce etkileyebilir.

## İzlenmesi Gereken Konular

- Spring Boot 4.1.0 GA’ya giderken RC1’deki `InetAddressFilter` ve `LazyConnectionDataSourceProxy` desteğinin API ve default davranışlarının sabit kalıp kalmayacağı.
- Spring AI 2.0.0 hattında M5 sonrası RC/GA paketleşmesinin provider modüllerini ne kadar daha ayrıştıracağı.
- Spring Integration 7.1 ve Spring Modulith 2.1 GA sürümlerinde migration guide kapsamının genişleyip genişlemeyeceği.
- Spring Cloud Oakwood hattının Boot 4.0.6 ve sonrası için yeni SR yayımlayıp yayımlamayacağı.
- OpenJDK ZGC automatic heap sizing taslağının Candidate/Target seviyesine ilerleyip ilerlemeyeceği.
- JDK 27 early access testlerinde locale resource temizliğinin log parser, assertion ve i18n test altyapılarına etkisi.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot 4.0.6 patch önceliği, Boot 4.1.0-RC1 ise yakın vadeli platform yönünü netleştiriyor
- source: [Spring Boot 4.0.6 available now](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now), [Spring Boot 4.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), [Spring Boot 4.1 observability docs](https://docs.spring.io/spring-boot/4.1/reference/actuator/observability.html), [HttpClientSettings API](https://docs.spring.io/spring-boot/4.1.0-SNAPSHOT/api/java/org/springframework/boot/http/client/HttpClientSettings.html), [LazyConnectionDataSourceProxy Javadoc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/datasource/LazyConnectionDataSourceProxy.html)
- author: Andy Wilkinson, Spring Boot Docs Team
- date: 23 Nisan 2026
- category: security, observability, platform, data-access
- tags: spring-boot-4, cve, otel, ssrf, datasource, tls, rc
- summary: Boot 4.0.6 sekiz CVE kapatıyor; Boot 4.1.0-RC1 ise OpenTelemetry environment variable desteği, HTTP client host filtreleme ve lazy JDBC connection alma gibi üretim odaklı yönelimler gösteriyor.
- why_it_matters: Aynı hafta içinde hem patch zorunluluğu hem de yeni platform davranışı oluştu. Biri bekletilmemeli, diğeri ise kontrollü pilot gerektiriyor.
- java_spring_relevance: Spring Boot üzerinde çalışan hemen her Java backend için doğrudan ilgili; özellikle actuator, SSL bundle, outbound HTTP ve JDBC transaction kullanan servislerde çok yüksek önem taşıyor.
- actionability: 4_0_6_patchini_hemen_planla_4_1_rc1_icin_pilot_servis_sec
- impact_level: cok_yuksek
- opportunities: Daha standart observability konfigürasyonu, daha güvenli outbound HTTP, gereksiz erken DB connection maliyetini azaltma.
- risks: Güvenlik sıkılaştırmaları nedeniyle davranış farkı, RC1’in henüz final olmaması, yanlış test kapsamı yüzünden sessiz regresyon.
- migration_notes: Prod için önce 4.0.6’ya geç; RC1’i yalnız pilot servislerde TLS, actuator, SSRF filtreleme ve transaction davranışı testleriyle dene.

### Bulgu 2

- title: Spring AI 2.0.0-M5 sadeleşiyor ama kod ve bağımlılık yüzeyini kırarak sadeleşiyor
- source: [Spring AI 1.0.6, 1.1.5, 2.0.0-M5 Available Now](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now), [Spring AI Upgrade Notes](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/upgrade-notes.html)
- author: Ilayaperumal Gopinathan, Spring AI Team
- date: 27 Nisan 2026
- category: ai, migration, security, developer-productivity
- tags: spring-ai, 2.0.0-m5, openai, azure-openai, vertex-ai, oci-genai, chatclient
- summary: 1.0.6, 1.1.5 ve 2.0.0-M5 sürümleri beş güvenlik düzeltmesiyle geliyor; 2.0.0-M5 içinde Azure OpenAI modülleri kaldırılıyor, provider integrasyonları ana repodan ayrılıyor ve option birleştirme davranışı `ChatClient` seviyesine taşınıyor.
- why_it_matters: AI stack’lerde en pahalı hata genellikle runtime’da değil, dependency yapısı değiştiğinde görülür. Bu sürüm tam olarak o bölgeye dokunuyor.
- java_spring_relevance: Spring AI kullanan Java ekipleri için çok yüksek; AI kullanmayan ekipler için ise izleme seviyesinde.
- actionability: spring_ai_bagimlilik_envanteri_cikar_ve_m5_dry_run_yap
- impact_level: yuksek
- opportunities: Daha sade core modül yapısı, resmi OpenAI SDK üzerinden daha tutarlı entegrasyon, provider bazlı ayrışmanın daha net hale gelmesi.
- risks: Derleme kırılması, eski modül adlarına bağımlılık, `ModelOptionUtils.merge()` varsayımlarının bozulması, provider migration hataları.
- migration_notes: `spring-ai-openai` dışındaki provider modüllerini ve custom option merge kodunu ara; gerekiyorsa ayrı repo modüllerine geç ve `combineWith()` tabanlı akışa uyum sağla.

### Bulgu 3

- title: Spring Cloud için doğru gerçek artık net: Boot 4.0.x kullanıyorsan Oakwood 2025.1.x hattında kalmalısın
- source: [Spring Cloud project page](https://spring.io/projects/spring-cloud/), [Spring Cloud 2025.1.1 (aka Oakwood) Has Been Released](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released)
- author: Spring Cloud Team, Ryan Baxter
- date: 29 Ocak 2026 ve proje sayfasındaki güncel uyumluluk matrisi
- category: cloud-native, compatibility, migration
- tags: spring-cloud, oakwood, 2025.1.x, boot-4, release-train, bom
- summary: Resmi matrise göre Spring Cloud 2025.1.x, Boot 4.0.x için doğru release train. Ayrıca 2025.0.0 hattı Boot 4.0.1 ve sonrası ile uyumsuz; 2022.0 ve daha eski bir dizi tren ise artık destek dışı.
- why_it_matters: Spring Cloud tarafındaki sorunlar çoğu zaman tek bir kütüphane bug’ı gibi görünür ama kök neden çoğunlukla yanlış BOM hizasıdır.
- java_spring_relevance: Spring Cloud, Config, Gateway, OpenFeign, Kubernetes, Stream veya Circuit Breaker kullanan tüm Boot ekipleri için doğrudan ilgili.
- actionability: boot_cloud_bom_hizasini_bugun_dogrula
- impact_level: yuksek
- opportunities: Doğru release train ile daha öngörülebilir upgrade, daha temiz bağımlılık ağacı, daha düşük classpath sürprizi.
- risks: Yanlış BOM eşleşmesi, destek dışı tren kullanımı, görünürde çalışan ama runtime’da bozulan dependency kombinasyonları.
- migration_notes: Boot 4.0.x için `spring-cloud-dependencies` BOM’unu 2025.1.x hattına çek; 2025.0.0 veya daha eski trenler varsa ayrıca temizle.

### Bulgu 4

- title: Spring Kafka 4.1.0-RC1, event-driven ekipler için yalnız yeni sürüm değil yeni semantik
- source: [Spring for Apache Kafka 4.1.0-RC1, 4.0.5, and 3.3.15 Available](https://spring.io/blog/2026/04/22/spring-kafka-4), [Spring Kafka reference docs](https://docs.spring.io/spring-kafka/reference/)
- author: Soby Chacko
- date: 22 Nisan 2026
- category: messaging, event-driven, resilience, operations
- tags: spring-kafka, kafka-streams, share-consumer, dlq, kip-1034, kip-1071, boot-4
- summary: 4.1.0-RC1; `ShareAckMode` enum, async commit callback’leri, yeni lifecycle event’leri, Kafka Streams tarafında `groupProtocol` seçimi ve KIP-1034 ile uyumlu native DLQ/exception handling getiriyor. 4.0.5 ve 3.3.15 ise bunların uygulanabilen kısmını patch hatlara taşıyor.
- why_it_matters: Messaging katmanında küçük görünen ack veya recovery değişiklikleri duplicate event, poison message veya sessiz veri kaybı olarak çok pahalıya dönebilir.
- java_spring_relevance: Spring Kafka veya Kafka Streams kullanan mikroservis ekipleri için çok yüksek önem taşır.
- actionability: ack_davranisi_ve_dlq_redelivery_senaryolarini_yeniden_test_et
- impact_level: yuksek
- opportunities: Daha az custom recoverer, upstream Kafka semantiğiyle daha iyi hizalanma, share consumer operasyonlarının daha görünür hale gelmesi.
- risks: Ack modu yanlış yorumlanırsa tekrar işleme veya kayıp, group protocol değişiminde rebalance davranışı farkı, Streams hata işleme akışında beklenmedik sonuçlar.
- migration_notes: `ShareAckMode` seçimini açık yap; async commit callback ve DLQ/redelivery senaryoları için entegrasyon testi ekle; Boot entegrasyon eşleşmesini 3.5.14 / 4.0.6 / 4.1.0-RC1 matrisine göre doğrula.

### Bulgu 5

- title: Spring Integration ve Spring Modulith tarafında güvenilirlik iyileştirmeleri öne çıkıyor
- source: [Spring Integration 7.1.0-RC1 Available](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available), [Spring Modulith 2.1 RC1, 2.0.6, and 1.4.11 released](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released)
- author: Glenn Renfro, Oliver Drotbohm
- date: 21 Nisan 2026 ve 24 Nisan 2026
- category: distributed-systems, integration, modularity, reliability
- tags: spring-integration, spring-modulith, redis, jobrunr, event-publication, jms
- summary: Spring Integration 7.1.0-RC1; RedisLockRegistry için Redis 8.4+ native CAS/CAD kullanımı ve Redis DSL getirirken, Spring Modulith 2.1 RC1 JobRunr transaction handling ve event publication registry tarafında iyileştirmeler yapıyor.
- why_it_matters: Bu iki proje de “iş uygulaması mantığı”ndan çok görünmez altyapı güvenilirliğini etkiler; tam da bu yüzden prod etkileri release note’dan daha büyük olabilir.
- java_spring_relevance: Internal eventing, scheduled iş akışları, modüler monolith veya Redis tabanlı koordinasyon kullanan Spring ekipleri için doğrudan ilgili.
- actionability: kullaniyorsan_pilot_upgrade_ve_registry_lock_testleri_ekle
- impact_level: orta_yuksek
- opportunities: Redis lock davranışında daha temiz yol, JobRunr entegrasyonunda transaction güveni, internal event publication akışlarında daha az gizli hata.
- risks: Redis sürümüne bağlı davranış farkı, migration guide atlanırsa kırılma, job orchestration ve registry semantiğinde sürprizler.
- migration_notes: Redis 8.4+ ile daha eski sürümleri ayrı test et; Modulith event publication ve JobRunr akışları için integration test kapsamını genişlet.

### Bulgu 6

- title: Spring Authorization Server 1.5.7, DCR açığını kapatıyor ve eski hatların bittiğini ilan ediyor
- source: [Spring Authorization Server 1.5.7 Available Now](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now)
- author: Joe Grandja
- date: 21 Nisan 2026
- category: security, identity, support-policy
- tags: spring-authorization-server, oauth2, dynamic-client-registration, cve, support-window
- summary: 1.5.7, dynamic client registration endpoint’lerinde client metadata validation yetersizliği açığını kapatıyor; aynı anda 1.3.x ve 1.4.x açık kaynak destek penceresinin bittiğini net biçimde söylüyor.
- why_it_matters: Authorization server tarafındaki açıklar, uygulama kodundan daha merkezi etki üretir; özellikle DCR açıksa risk katsayısı yüksektir.
- java_spring_relevance: Spring Authorization Server kullanan identity platformları ve B2B/B2C OAuth2 mimarileri için doğrudan kritik.
- actionability: dcr_aciksa_hemen_1_5_7_veya_destekli_backporta_gec
- impact_level: cok_yuksek
- opportunities: Destekli tek hatta toplanmak, security posture’ı sadeleştirmek, identity bileşenini net sürüm politikasına bağlamak.
- risks: DCR açık kalırsa güvenlik açığı, eski OSS hatlarda kalınırsa desteksiz işletim, geri uyumluluk varsayımlarının sürmesi.
- migration_notes: Önce DCR endpoint’lerinin gerçekten açık olup olmadığını doğrula; açık ise 1.5.7’ye yükselt veya mecbursan ticari backport hattına geç.

### Bulgu 7

- title: JVM tarafında iki farklı ama tamamlayıcı sinyal var: daha akıllı heap, daha az tarihsel yük
- source: [OpenJDK JEP draft: Automatic Heap Sizing for ZGC](https://openjdk.org/jeps/8377305), [Quality Outreach Heads-up - JDK 27: Obsolete Translation Resources Removed](https://inside.java/2026/04/21/quality-heads-up/)
- author: Erik Österlund, David Delabassee
- date: 10 Mart 2026 güncellenmiş JEP taslağı ve 21 Nisan 2026 Inside Java duyurusu
- category: jvm, performance, compatibility, operations
- tags: openjdk, zgc, heap-sizing, jdk27, locale-resources, container
- summary: OpenJDK, ZGC için CPU ve sistem baskısına göre heap boyutunu dinamik ayarlayan yeni bir yön öneriyor; ayrı olarak JDK 27, bakımı yapılmayan locale resource’larını kaldırarak yalnız aktif tutulan dilleri koruyor.
- why_it_matters: Biri performans tuning maliyetini azaltabilir, diğeri ise yıllardır fark edilmeyen test ve araç varsayımlarını görünür hale getirebilir.
- java_spring_relevance: Container içinde çalışan Spring servislerinde JVM tuning kararlarını; çok dilli ürünlerde veya lokalize JDK mesajlarına bakan testlerde ise uyumluluğu etkiler.
- actionability: zgc_kullaniyorsan_izle_jdk27_icin_locale_testlerini_backloga_al
- impact_level: orta
- opportunities: Daha az elle `-Xmx`/`SoftMaxHeapSize` tuning, çok süreçli ortamlarda daha iyi komşuluk davranışı.
- risks: Taslak JEP’in yön değiştirmesi, locale resource kaldırımı nedeniyle assertion veya log parser kırılması.
- migration_notes: Kısa vadede yalnız izleme ve erken test; özellikle locale bağımlı testler ile containerized ZGC benchmark’ları şimdiden hazırlanmalı.

### Bulgu 8

- title: Hardwood 1.0.0.Beta1, veri ağırlıklı JVM servisleri için hafif Parquet aracı olarak izlenmeye değer
- source: [Hardwood Reaches Beta: S3, Predicate Push-Down, CLI, and More](https://www.morling.dev/blog/hardwood-reaches-beta-s3-predicate-push-down-cli/)
- author: Gunnar Morling
- date: 2 Nisan 2026
- category: tools, data, performance
- tags: parquet, java, s3, predicate-pushdown, cli, avro
- summary: Hardwood beta sürümü; S3 backend, predicate push-down, Avro bindings ve CLI ile birlikte geliyor. Proje hafif bağımlılık ve performans odağıyla konumlanıyor.
- why_it_matters: Parquet erişimi çoğu JVM projede Hadoop veya ağır bağımlılık setleri yüzünden gereksiz karmaşık hale geliyor. Daha hafif alternatifler özellikle platform ve veri servislerinde değerli olabilir.
- java_spring_relevance: Spring ekosisteminin çekirdeği değil; ancak data-heavy Java backend’ler, object storage üzerinden analitik dosya okuyan servisler ve ETL yardımcı uygulamalar için anlamlı.
- actionability: low_priority_poc_olarak_izle
- impact_level: dusuk
- opportunities: Daha hafif binary footprint, object storage üzerinden daha pratik Parquet okuma, internal veri araçları için daha sade stack.
- risks: Beta sürüm olgunluğu, API’nin henüz stabil olmaması, üretim veri formatı edge-case’leri.
- migration_notes: Doğrudan prod geçişi yerine benchmark veya internal tooling POC ile değerlendirilmesi daha doğru.

## Sonuç

Bugünün en güçlü üretim sinyali, Spring ekosisteminin Boot 4 çevresinde hızla sertleşmesi: bir tarafta 4.0.6 ile güvenlik açığı kapatma zorunluluğu, diğer tarafta 4.1 RC1 ve yan projelerle şekillenen yeni operasyon modeli var.

Kısa vadede en doğru aksiyon sırası şu olur: önce Boot 4.0.6 ve gerekiyorsa Spring Authorization Server 1.5.7 patch geçişlerini tamamlamak, ardından Cloud/Kafka/Integration/Modulith hizasını envanter bazlı doğrulamak, son olarak Spring AI ve JVM tarafındaki daha yapısal geçişleri pilot ve benchmark akışlarına almak.
