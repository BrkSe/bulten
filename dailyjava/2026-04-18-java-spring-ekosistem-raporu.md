# Günlük Java / Spring Ekosistem Raporu

Tarih: `18 Nisan 2026, 09:06 TRT`

Kapsam: `17 Nisan 2026 09:08 TRT` ile `18 Nisan 2026 09:06 TRT` arasındaki günlük tarama.

Tekrar azaltma notu: Önceki raporlarda işlendiği için bugün `Spring Cloud Gateway CVE-2026-22750`, `Boot 4.1.0-M4 rollback`, `Spring 7 API versioning / core resilience`, `Spring AI Session API`, `Spring Cloud çift stabil hat`, `Boot 3.5 OSS pencere başlığı`, `JDK 26 G1 throughput` ve `JDK 27 heads-up` eksenleri ana bulgu yapılmadı. Bugünün raporu veri erişimi, mesajlaşma, secret/certificate yaşam döngüsü, Java 26 platform kabiliyetleri, Kubernetes/JVM gözlemlenebilirliği ve yapılandırma yönetişimi eksenine odaklanır.

Kaynak tarama notu: Zorunlu çekirdek kaynaklar olarak [Spring Blog](https://spring.io/blog/), [Spring releases](https://spring.io/blog/category/releases/), ilgili [Spring proje dokümantasyonları](https://docs.spring.io/), [OpenJDK JEP sayfaları](https://openjdk.org/), [Oracle Java Blog](https://blogs.oracle.com/java), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’un haftalık özeti](https://spring.io/blog/2026/04/14/this-week-in-spring-april-14-2026/), [Gunnar Morling](https://www.morling.dev/), ilgili Spring GitHub release/changelog sayfaları ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandı. `Gunnar Morling` tarafında bugünkü öncelik sırasını değiştiren yeni birinci seviye üretim sinyali görülmedi; `Burak KUTBAY` tarafında ise son dönemde `Spring Framework 7 API versioning` ve `Java 25 Stable Values` içerikleri bulunmakla birlikte bugünkü raporun ana karar yüzeyini değiştiren yeni üretim-kritik bir güncelleme tespit edilmedi.

## Öne Çıkan Başlıklar

- `Spring Data 2026.0.0-RC1`, `Boot 4.1 RC` hazırlığının veri erişimi tarafında fiilen kilitlendiğini gösteriyor. Özellikle `Relational upsert`, `Redis Pub/Sub` gönderim tarafı ve `RedisCache.resetCaches()` optimizasyonu dikkat çekiyor.
- `Spring Vault 4.1.0-M1`, secret ve sertifika rotasyonunu daha üst seviye Spring API’lerine taşıyor. Bu, platform ekipleri için “Vault entegrasyonu”ndan “Vault yaşam döngüsü yönetimi”ne geçiş sinyali.
- `Spring for Apache Kafka 4.1.0-M2` ve `Spring AMQP 4.1.0-M3`, mesajlaşma tarafında yalnızca bug fix değil, tüketici kilit süresi uzatma, hata işleme ve `AMQP 1.0` gibi protokol düzeyi ilerlemeler getiriyor.
- `Java 26`, Java backend ekipleri için gerçek değerini yeni syntax’tan çok `HTTP/3`, `Structured Concurrency` ve `AOT cache + ZGC` kombinasyonunda gösteriyor.
- `Inside Java`’daki Kubernetes/JVM gözlemlenebilirlik yazısı ve Josh Long’un işaret ettiği büyük ölçekli `@ConfigurationProperties` örneği birlikte okunduğunda, 2026’da operasyonel olgunluk ile framework ergonomisinin birbirine daha fazla bağlandığı netleşiyor.

## Kritik Güncellemeler

1. `Spring Data 2026.0.0-RC1` yayımlandı. Bu sürüm doğrudan `Spring Boot 4.1 RC` hazırlığının parçası olarak konumlanıyor.
2. `Spring Vault 4.1.0-M1`, `VaultClient`, `ManagedSecret`, `ManagedCertificate` ve sertifika rotasyonu API’leriyle gizli yönetimini daha uygulama-dostu hale getiriyor.
3. `Spring for Apache Kafka 4.1.0-M2`, `Kafka Client 4.2.0` tabanına geçiyor; `share consumer` için `renew()` ve daha olgun hata işleme ekliyor.
4. `Spring AMQP 4.1.0-M3`, `spring-amqp-client` ve `@AmqpListener` ile genel `AMQP 1.0` desteğini pratik hale getiriyor.
5. `Java 26`, `HTTP/3`, `Structured Concurrency` ve `AOT cache with any GC` ile özellikle ağ IO, istek orkestrasyonu ve soğuk başlangıç davranışında anlamlı yeni seçenekler getiriyor.

## Trendler ve Sinyaller

### 1. `Boot 4.1` öncesi ekosistem halkaları tamamlanıyor

`Spring Data RC1`, `Kafka 4.1 M2`, `AMQP 4.1 M3`, `Vault 4.1 M1` ve önceki haftalardaki `Boot 4.1` milestone’ları birlikte okunduğunda, `Spring Boot 4.1` etrafında “çekirdek framework hazır olsun, çevre projeler sonra yetişir” modeli yerine daha koordineli bir hazırlık görülüyor. Bu, büyük ekipler için pozitif sinyal; çünkü veri, mesajlaşma ve secret yönetimi aynı geçiş penceresinde birlikte ele alınabilecek.

### 2. Mesajlaşma katmanı daha protokol-bilinçli hale geliyor

`Kafka` tarafında `share consumer` semantiğinin olgunlaşması ve `AMQP` tarafında genel `AMQP 1.0` desteğinin Spring ergonomisine taşınması, mesajlaşma dünyasında “tek broker, tek tüketim modeli” yaklaşımının zayıfladığını gösteriyor. Protokol farkları artık mimari kararı daha erken etkiliyor.

### 3. Java platformu ağ, eşzamanlılık ve başlangıç davranışında daha üretim odaklı ilerliyor

`HTTP/3`, `Structured Concurrency` ve `AOT cache + any GC` aynı anda değerlendirildiğinde Java 26’nın ana değeri şurada: daha hızlı ağ kurulumları, daha yönetilebilir alt görevler ve özellikle Spring Boot servislerinde daha kısa cold start. Bu, sentaks merakından çok operasyonel verim konusu.

### 4. Konfigürasyon artık yalnızca YAML değil, yönetişim problemi

Josh Long’un işaret ettiği `Apereo CAS` örneği ile Baeldung’ün `@ConfigurationProperties` testleri birlikte ele alındığında, büyük Spring kod tabanlarında sorun `property` eklemek değil; metadata, deprecation, validation, discovery ve test hattını birlikte kurmak. Bu, kısa ömürlü heves değil; kurumsal Spring kod tabanları için kalıcı mühendislik ihtiyacı.

### 5. Gözlemlenebilirlikte “container metriği yetmez” dönemi netleşiyor

`Inside Java` yazısı, Kubernetes’te JVM seviyesindeki gerçek teşhis sinyallerinin hâlâ ek sistem gerektirdiğini açık biçimde gösteriyor. Özellikle pod başına `JFR` toplama, güvenli export ve ölçekli kayıt planlama gibi ihtiyaçlar, Java microservice gözlemlenebilirliğini tekrar JVM’e yaklaştırıyor.

## Araçlar ve Kütüphaneler

- `Spring Data 2026.0.0-RC1`: `Relational Template` tarafında yerel `upsert`; `RedisMessageSendingTemplate`; `RedisCache.resetCaches()` optimizasyonu.
- `Spring Vault 4.1.0-M1`: `VaultClient`, `ManagedSecret`, `ManagedCertificate`, `CertificateContainer`.
- `Spring for Apache Kafka 4.1.0-M2`: `Kafka Client 4.2.0`, `ShareAcknowledgment.renew()`, daha güçlü `share consumer` hata işleme.
- `Spring AMQP 4.1.0-M3`: `spring-amqp-client`, `@AmqpListener`, genel `AMQP 1.0` desteği.
- `Java 26`: `HttpClient.Version.HTTP_3`, `StructuredTaskScope`, `AOT` cache’in `ZGC` ile de kullanılabilmesi.
- Bugün yüksek etkili yeni bağımsız bir Java OSS çerçevesi patlaması yok. Araç tarafındaki değer, mevcut Spring/JDK araçlarının daha üretim-odaklı hale gelmesinden geliyor.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Boot 4.1` geçişi planlayan ekipler veri katmanını ayrıca ele almalı; `Spring Data RC1` ile `Relational upsert` ve `Redis` davranışları bazı ev yapımı yardımcı kodları gereksiz kılabilir.
- `Kafka` kullanan ekipler, `share consumer` modelini klasik consumer group davranışının sadece küçük varyasyonu gibi görmemeli. `renew()` gibi API’ler, işleme süresi ve record lock yönetimi üzerinde doğrudan etki ediyor.
- `RabbitMQ` veya `AMQP` tabanlı heterojen altyapılar kullanan ekipler için `AMQP 1.0` desteği, Spring tarafında broker bağımlılığını azaltabilecek yeni bir yol açıyor.
- `Vault` kullanan platform ekipleri, secret okuma ile secret yaşam döngüsünü ayıran daha temiz bir API hattına kavuşuyor; ancak bu alan hâlâ milestone olduğu için üretimden önce POC şart.
- `Java 26`ya geçişte salt dil özelliği kontrolü yetmez; `HTTP/3` denemeleri, `Structured Concurrency` prototipleri ve `AOT` cold-start benchmark’ları birlikte düşünülmeli.
- Büyük Spring monorepo’larında `@ConfigurationProperties` kullanımı standartlaştırılmadıysa, şimdi bunun bedeli yükseliyor. Metadata, deprecation ve binding testleri olmayan konfigürasyon yüzeyi operasyonel borç yaratır.

## Fırsatlar ve Riskler

Fırsatlar:

- `Spring Data RC1` ile `upsert`, `Redis` gönderim ve cache reset senaryolarında özel altyapı kodunu azaltmak.
- `Spring Vault` ile sertifika ve secret rotasyonunu uygulama seviyesinde daha görünür ve testlenebilir hale getirmek.
- `Spring Kafka` tarafında `share consumer` iş yükleri için daha güvenli lock yenileme ve hata yönetimi kurmak.
- `AMQP 1.0` ile çok broker’lı veya platform-tarafsız mesajlaşma stratejileri denemek.
- `Java 26` üzerinde `HTTP/3` ve `AOT + ZGC` kombinasyonlarıyla cold-start ve dış servis çağrısı davranışını iyileştirmek.
- `@ConfigurationProperties` metadata + validation + test yaklaşımıyla upgrade maliyetini azaltmak.

Riskler:

- `RC` ve `milestone` sürümleri üretime taşımak için erken davranmak.
- `share consumer` semantiğini yanlış okuyup kilit süresi/yenileme akışını eksik tasarlamak.
- `HTTP/3` opt-in desteğini tüm ağlarda otomatik kazanç gibi görmek.
- `Structured Concurrency` preview API’sini ürün yüzeyine fazla sızdırmak.
- `AOT` streaming yaklaşımının constrained ortamlardaki CPU etkisini ölçmeden genellemek.
- `Vault` ve Kubernetes/JFR çözümlerinde sağlayıcı bağımlılığını küçümsemek.

## İzlenmesi Gereken Konular

- `Spring Boot 4.1 RC` çıktığında `Spring Data 2026.0.0-RC1` ile entegrasyon notları ve olası son dakika kırılımları.
- `Spring Vault 4.1` hattında `ManagedSecret` ve `ManagedCertificate` API’lerinin GA öncesi şekli.
- `Spring AMQP 4.1` tarafında `AMQP 1.0` desteğinin RC/GA yolunda ne kadar stabil hale geleceği.
- `Java 26` sonrası gerçek dünya benchmark’larında `HTTP/3` ve `AOT + ZGC` kombinasyonunun Spring Boot servislerine etkisi.
- `Oracle Java Verified Portfolio` içindeki `Helidon` hizalamasının Java ekosisteminde yeni destek/lisanslama beklentileri doğurup doğurmayacağı.
- `Burak KUTBAY` ve topluluk kaynaklarında `Java 25/26` ile `Spring Boot 4` için daha pratik Türkçe migration içeriklerinin gelip gelmeyeceği.

## Kaynak Bazlı Bulgular

### 1. `Spring Data 2026.0.0-RC1`, `Boot 4.1 RC` öncesi veri erişim hattını sabitliyor

- **title:** `Spring Data 2026.0.0-RC1`, veri katmanında feature freeze sinyali veriyor
- **source:** [Spring Blog - Spring Data 2026.0.0-RC1 enters release candidate phase](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/)
- **author:** `Mark Paluch`
- **date:** `17 Nisan 2026`
- **category:** `data-access`
- **tags:** `spring-data`, `boot-4.1`, `redis`, `relational`, `upsert`, `release-candidate`
- **summary:** Resmi duyuru, `Spring Data 2026.0.0-RC1` sürümünün `Spring Boot 4.1 RC` hazırlığı için yayımlandığını söylüyor. Öne çıkan yenilikler `Relational Template API` tarafında `MERGE` / `INSERT ... ON CONFLICT DO UPDATE` tabanlı `upsert`, `RedisMessageSendingTemplate` ve `RedisCache.resetCaches()` optimizasyonu.
- **why_it_matters:** Veri erişim katmanı `Boot 4.1` çevresinde olgunlaşırken pratik geliştirici kazancı üreten API’ler ekleniyor; bu salt bug-fix RC değil.
- **java_spring_relevance:** `Spring Data JDBC/Relational`, `Redis Pub/Sub` veya `Redis Cache` kullanan Spring Boot servisleri için doğrudan önemli.
- **actionability:** `yakın_vade_pilot`
- **impact_level:** `yüksek`
- **opportunities:** Ev yapımı `upsert` SQL katmanını sadeleştirmek; `Redis` mesaj gönderimi ile dinleme tarafını aynı dönüştürücü modeli etrafında toplamak; cache reset operasyonlarını hızlandırmak.
- **risks:** `RC` olduğu için sürpriz API veya davranış ayarı değişebilir; `FLUSHDB` optimizasyonu paylaşımlı Redis kullanımında yanlış varsayımla tehlikeli olabilir.
- **migration_notes:** `Boot 4.1 RC` ile beraber küçük POC açın. Özellikle `RedisCache.resetCaches()` yalnızca cache için ayrılmış Redis instance’larında değerlendirilmeli. `Relational upsert` geçişinde üretim SQL diyaleği bazında entegrasyon testi şart.

### 2. `Spring Vault 4.1.0-M1`, secret tüketiminden secret yaşam döngüsüne geçiyor

- **title:** `Spring Vault 4.1.0-M1`, secret ve sertifika rotasyonunu ilk sınıf API yapıyor
- **source:** [Spring Blog - Spring Vault 4.1.0-M1 available](https://spring.io/blog/2026/03/16/spring-vault-4-1-0-m1-available/)
- **author:** `Mark Paluch`
- **date:** `16 Mart 2026`
- **category:** `security-platform`
- **tags:** `spring-vault`, `managed-secret`, `certificate-rotation`, `vaultclient`, `platform-engineering`
- **summary:** `Spring Vault 4.1.0-M1`; `VaultClient`, `CertificateContainer`, `ManagedSecret` ve `ManagedCertificate` API’lerini tanıtıyor. Duyuruda ayrıca credentials rotation dokümantasyonunun da revize edildiği belirtiliyor.
- **why_it_matters:** Secret yönetimi sadece değer çekme değil; yenileme, sertifika üretimi, rotasyon ve yaşam döngüsü koordinasyonu problemine dönüşüyor.
- **java_spring_relevance:** `HashiCorp Vault` kullanan Spring Boot mikroservisleri ve platform ekipleri için yüksek ilgili.
- **actionability:** `poc_ve_platform_degerlendirmesi`
- **impact_level:** `orta-yüksek`
- **opportunities:** Secret/certificate yaşam döngüsünü uygulama tarafında daha görünür kılmak; namespace özelleştirmelerini daha temiz `VaultClient` ile toplamak; platform ekipleri ile uygulama ekipleri arasında daha net sorumluluk sınırı çizmek.
- **risks:** Henüz `milestone`; API şekli değişebilir. Rotasyon iş akışları iyi modellenmezse uygulama erişim kesintisi üretebilir.
- **migration_notes:** Mevcut `RestTemplate` tabanlı Vault uyarlamalarını hemen sökmek yerine `ManagedSecret` ve `CertificateContainer` etrafında yan yana POC çalıştırın. Özellikle sertifika yenileme süreleri, cache stratejisi ve hata toleransını test edin.

### 3. `Spring for Apache Kafka 4.1.0-M2`, `share consumer`ı üretim gerçeklerine yaklaştırıyor

- **title:** `Spring Kafka 4.1.0-M2`, uzun süren işlerde daha güvenli tüketim semantiği sunuyor
- **source:** [Spring Blog - Spring for Apache Kafka 4.1.0-M2, 4.0.4, and 3.3.14 Available](https://spring.io/blog/2026/03/17/spring-kafka-4/)
- **author:** `Soby Chacko`
- **date:** `17 Mart 2026`
- **category:** `messaging`
- **tags:** `spring-kafka`, `kafka-4.2`, `share-consumer`, `renew`, `error-handling`, `observability`
- **summary:** `4.1.0-M2`, `Apache Kafka Client 4.2.0` üzerine kurulu ilk sürüm. `ShareAcknowledgment.renew()` ile record lock süresi uzatılabiliyor; `share consumer` konteynerinde poll-level ve listener-level hata yönetimi ekleniyor; ayrıca async ack, filtered message observation leak ve reaktif dönüşlü listener retry tarafında düzeltmeler var.
- **why_it_matters:** Uzun süren mesaj işleme akışlarında kilit süresini yönetmek ve hatayı daha tutarlı ele almak artık doğrudan framework seviyesine yaklaşıyor.
- **java_spring_relevance:** `Spring Kafka` kullanan event-driven mikroservisler için doğrudan yüksek ilgili.
- **actionability:** `hedefli_laboratuvar_testi`
- **impact_level:** `yüksek`
- **opportunities:** Uzun süren iş akışlarında erken re-delivery riskini azaltmak; `share consumer`ı daha güvenle denemek; gözlemlenebilirlik sızıntılarını kapatmak.
- **risks:** `share consumer` klasik consumer group mantığı ile karıştırılırsa yanlış retry/lock politikası tasarlanabilir. `M2` olduğu için davranış rafine olabilir.
- **migration_notes:** `share consumer` kullanan ekipler `group.share.record.lock.duration.ms` ve `renew()` akışını birlikte benchmark etmeli. `3.3.x`/`4.0.x` patch line’larındaki gözlem sızıntısı ve async ack düzeltmeleri de envantere alınmalı.

### 4. `Spring AMQP 4.1.0-M3`, Spring ekosistemine genel `AMQP 1.0` dili ekliyor

- **title:** `Spring AMQP 4.1`, `@RabbitListener` dışına çıkarak genel `AMQP 1.0` alanına açılıyor
- **source:** [Spring Blog - Spring AMQP 4.1.0 Milestone 3 Available](https://spring.io/blog/2026/03/18/spring-amqp-4-1-0-m3-available/), [Spring AMQP docs - Generic AMQP 1.0 Support](https://docs.spring.io/spring-amqp/reference/4.1/amqp10-client.html)
- **author:** `Artem Bilan`, `Spring AMQP team`
- **date:** `18 Mart 2026`
- **category:** `messaging`
- **tags:** `spring-amqp`, `amqp-1.0`, `rabbitmq`, `qpid-protonj2`, `protocol`
- **summary:** `Spring AMQP 4.1.0-M3`, `spring-amqp-client` modülü ile genel `AMQP 1.0` desteği getiriyor. Dokümantasyona göre bu modül `Qpid ProtonJ2` tabanlı ve `RabbitMQ` dahil `AMQP 1.0` konuşan peer’lerle çalışabiliyor. Yeni `@AmqpListener`, kullanım ergonomisini `@RabbitListener`a yaklaştırıyor.
- **why_it_matters:** Spring AMQP’nin rolü yalnızca RabbitMQ rahatlığı olmaktan çıkıp daha genel protokol soyutlamasına kayıyor.
- **java_spring_relevance:** `AMQP` kullanan, broker bağımlılığını azaltmak isteyen veya heterojen mesajlaşma altyapısı işleten Spring ekipleri için ilgili.
- **actionability:** `nis_poc`
- **impact_level:** `orta`
- **opportunities:** `AMQP 1.0` tabanlı daha taşınabilir entegrasyon katmanı kurmak; Spring dinleyici modelini farklı broker ortamlarına taşımak.
- **risks:** Erken milestone; operasyonel ve broker uyumluluğu sahada değişebilir. `AMQP 1.0` desteğini mevcut `RabbitMQ` davranışıyla bire bir aynı sanmak hatalı olur.
- **migration_notes:** Mevcut `RabbitListener` üretim akışını değiştirmeden, yeni `spring-amqp-client` ile sınırlı bir POC kurun. Bağlantı yönetimi, mesaj dönüştürme ve DLQ/geri deneme beklentileri broker bazında ayrı test edilmeli.

### 5. `Java 26`, ağ ve cold-start davranışını ciddi biçimde etkileyebilecek üçlü getiriyor

- **title:** `Java 26`, `HTTP/3`, `Structured Concurrency` ve `AOT + any GC` ile backend davranışını değiştiriyor
- **source:** [Oracle Java Blog - The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [JEP 517](https://openjdk.org/jeps/517), [JEP 525](https://openjdk.org/jeps/525), [JEP 516](https://openjdk.org/jeps/516)
- **author:** `Sharat Chander`, `Daniel Fuchs`, `Alan Bateman`, `Viktor Klang`, `Ron Pressler`, `Erik Österlund`
- **date:** `17 Mart 2026` ve ilgili JEP teslimleri
- **category:** `jdk-platform`
- **tags:** `java-26`, `http3`, `structured-concurrency`, `aot-cache`, `zgc`, `cold-start`
- **summary:** `JEP 517`, `HttpClient` için `HTTP/3` desteğini minimal kod değişikliğiyle ve opt-in modelle getiriyor. `JEP 525`, `StructuredTaskScope` ile alt görevleri tek iş birimi gibi yönetmeyi sürdürüyor. `JEP 516`, `AOT cache`i tüm GC’lerle, özellikle `ZGC` ile kullanılabilir hale getiriyor; JEP’te `Spring PetClinic` için `%41` daha hızlı başlangıç örneği veriliyor.
- **why_it_matters:** Üretim sistemlerinde kullanıcıya hissedilen fark çoğu zaman yeni dil özelliğinden değil, ağ kurulumu, alt görev iptali ve cold start davranışından gelir.
- **java_spring_relevance:** `RestClient`, `WebClient`, dış servis orkestrasyonu, containerized Spring Boot servisleri ve server-side request fan-out senaryoları için yüksek ilgili.
- **actionability:** `benchmark_ve_sinirli_pilot`
- **impact_level:** `yüksek`
- **opportunities:** `HTTP/3` destekli upstream’lerde daha iyi ağ davranışı; istek fan-out akışlarında daha temiz iptal/hata yönetimi; `AOT + ZGC` kombinasyonuyla startup ve tail latency dengesini iyileştirmek.
- **risks:** `HTTP/3` varsayılan değil; tüm ağlarda otomatik kazanç beklenmemeli. İlk `HTTP/3` implementasyonu yalnızca varsayılan `SunJSSE` secure-socket provider ile çalışıyor. `Structured Concurrency` preview; kamu API’sine fazla sızdırmak ileride maliyet yaratabilir. `AOT` streaming yaklaşımı constrained ortamlarda ekstra CPU ihtiyacı doğurabilir.
- **migration_notes:** `Java 26` geçişinde üç ayrı deney yapın: `HttpClient.Version.HTTP_3` ile dış çağrı benchmark’ı, `StructuredTaskScope` ile bir fan-out endpoint prototipi, `AOT` cache ile `ZGC`/`G1` cold-start karşılaştırması. Hepsini aynı anda genellemek yerine ayrı hipotezler olarak test edin.

### 6. Kubernetes tarafında JVM teşhisi için yeni çıta: güvenli, merkezi `JFR` orkestrasyonu

- **title:** Kubernetes’te JVM gözlemlenebilirliği için çıta yalnızca pod metriği değil, ölçekli `JFR`
- **source:** [Inside Java - Secure, Scalable JVM Diagnostics for Kubernetes with JMS](https://inside.java/2026/03/13/jms-secure-scalable-jvm/)
- **author:** `Praveen Srivastava`
- **date:** `13 Mart 2026`
- **category:** `observability-operations`
- **tags:** `jfr`, `kubernetes`, `jms`, `oci`, `java-management-service`, `diagnostics`
- **summary:** Yazı, Kubernetes’in pod ve altyapı metrikleri sağlasa da JVM seviyesindeki gerçek teşhis verisini doğal olarak sunmadığını; `Java Management Service` üzerinden güvenli, merkezi ve ölçekli `JFR` yakalama yaklaşımının bu boşluğu hedeflediğini anlatıyor.
- **why_it_matters:** Java servislerinde gerçek sorunlar çoğu zaman GC, allocation, safepoint, lock contention ve thread-state düzeyinde yaşanıyor; bunlar sırf container metriğiyle görünmüyor.
- **java_spring_relevance:** Kubernetes üzerinde çalışan Spring Boot mikroservisleri için operasyonel olarak önemli.
- **actionability:** `izle_ve_ic_modelle`
- **impact_level:** `orta`
- **opportunities:** Üretim teşhis kabiliyetini JVM seviyesine taşımak; JFR’ı ölçekli ve güvenli biçimde orkestre etmek; platform ekibi ile uygulama ekibinin ortak gözlemlenebilirlik dilini güçlendirmek.
- **risks:** Çözüm OCI/JMS merkezli; taşınabilirlik ve vendor bağımlılığı riski var. Büyük hacimli kayıtlar ciddi storage ve gizlilik yükü oluşturabilir.
- **migration_notes:** Üründe doğrudan JMS/OCI’ye bağlanmadan önce kendi platformunuzda şu soruları cevaplayın: `JFR` hangi olaylar için ne kadar süre açık kalacak, kayıtlar nereye alınacak, PII/sır yönetimi nasıl olacak, incident anında otomatik tetikleme nasıl yapılacak?

### 7. `@ConfigurationProperties`, 2026’da artık bir kod stili değil, platform kontratı

- **title:** Büyük Spring kod tabanlarında konfigürasyon yönetimi metadata, deprecation ve test işi haline geliyor
- **source:** [This Week in Spring - April 14th, 2026](https://spring.io/blog/2026/04/14/this-week-in-spring-april-14-2026/), [Spring Boot Configuration Properties at Scale](https://medium.com/all-things-software/spring-boot-configuration-properties-at-scale-884f494721ac), [Baeldung - Testing Spring Boot @ConfigurationProperties](https://www.baeldung.com/spring-boot-testing-configurationproperties)
- **author:** `Josh Long`, `Dmitriy Kopylenko`, `Baeldung`
- **date:** `Nisan 2026`
- **category:** `developer-productivity`
- **tags:** `configurationproperties`, `metadata`, `deprecation`, `validation`, `testing`, `actuator`
- **summary:** Josh Long’un işaret ettiği `Apereo CAS` örneği, büyük ölçekli Spring konfigürasyonunun `@NestedConfigurationProperty`, metadata, runtime discovery ve deprecation takibi ile tasarlandığını gösteriyor. Baeldung de `@ConfigurationProperties` için binding, validation ve profile/yaml tabanlı test örnekleri sunuyor.
- **why_it_matters:** Konfigürasyon karmaşıklığı büyüdüğünde sorun `yaml` yazmak değil; yanlış property’nin sessizce kabul edilmesi, yeniden adlandırmanın kaybolması ve upgrade sırasında davranış belirsizliğidir.
- **java_spring_relevance:** Kurumsal Spring Boot platformları, starter’lar, iç kütüphaneler ve geniş `application.yml` yüzeyi olan ekipler için doğrudan önemli.
- **actionability:** `hemen_standartlastir`
- **impact_level:** `yüksek`
- **opportunities:** `spring-configuration-metadata`, deprecation replacement, actuator discovery ve validation testleri ile upgrade sürtünmesini düşürmek; config yüzeyini ürün kontratı gibi yönetmek.
- **risks:** Metadata ve test yatırımı yapılmazsa property yüzeyi büyüdükçe sessiz hata alanı da büyür. Aşırı esnek yapı, operasyonel keşfi zorlaştırır.
- **migration_notes:** İç starter ve ortak kütüphanelerde `@ConfigurationProperties` sınıflarını envanterleyin. `spring-configuration-metadata` üretimini doğrulayın. Yeniden adlandırılan property’ler için deprecation metadata ekleyin. En kritik config sınıfları için binding + validation testleri açın.

### 8. `Oracle Java Verified Portfolio`, Java ekosisteminde destek paketlemesinin şekil değiştirdiğini gösteriyor

- **title:** Oracle, JDK dışı Java araçları için yeni bir destek katmanı tanımlıyor
- **source:** [Oracle Java Blog - Announcing the Oracle Java Verified Portfolio](https://blogs.oracle.com/java/announcing-jvp)
- **author:** `Donald Smith`
- **date:** `17 Mart 2026`
- **category:** `ecosystem-governance`
- **tags:** `oracle`, `jvp`, `helidon`, `javafx`, `support-model`, `portfolio`
- **summary:** Oracle, `Java Verified Portfolio` altında `Helidon`, `JavaFX` ve Oracle’ın VS Code Java uzantısı gibi JDK dışı bileşenler için ayrı ama Oracle destekli bir portföy kurduğunu duyurdu.
- **why_it_matters:** Java ekosisteminde ürün, araç ve framework desteğinin JDK’dan ayrışan ama JDK ile hizalı yeni bir paketleme modeline girdiğini gösteriyor.
- **java_spring_relevance:** Doğrudan Spring kararı değil; fakat kurumsal Java platform ekipleri için tedarikçi, destek ve lifecycle konuşmalarında yeni referans noktası olabilir.
- **actionability:** `dusuk_oncelik_izle`
- **impact_level:** `düşük`
- **opportunities:** Oracle merkezli kurumsal ortamlarda destek anlaşmalarını sadeleştirmek; `Helidon` ve diğer bileşenlerin lifecycle haritalarını daha net görmek.
- **risks:** Vendor yönlü paketleme modelini genel Java ekosistemi eğilimi sanmak yanlış olur. Spring ekipleri için kısa vadede doğrudan teknik kazanç sınırlı.
- **migration_notes:** Bu başlığı teknik geçişten çok tedarikçi/lifecycle perspektifiyle takip edin. Eğer organizasyon Oracle destekli Java dağıtımı kullanıyorsa `Helidon` ve araç zinciri tarafındaki etkiyi ayrıca değerlendirin.

## Sonuç

Bugünün en önemli sinyali tek bir sansasyonel release değil; `Spring Boot 4.1` çevresindeki veri, mesajlaşma ve secret yönetimi halkalarının şekillenmeye başlaması.

İkinci önemli eksen, Java 26’nın backend ekipleri için artık “yeni Java geldi” değil; `HTTP/3`, `Structured Concurrency` ve `AOT + ZGC` gibi doğrudan üretim davranışını etkileyen araçlar sunması.

Üçüncü eksen ise operasyonel disiplin: Kubernetes’te JVM teşhisi ve büyük ölçekli `@ConfigurationProperties` yönetimi, framework bilgisi ile platform mühendisliğinin birbirinden ayrılamadığını yeniden gösteriyor. Güçlü Spring ekipleri 2026’da yalnızca yeni özelliği denemeyecek; config yüzeyini, mesajlaşma semantiğini ve runtime davranışını birlikte yönetecek.
