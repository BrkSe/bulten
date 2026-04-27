# Günlük Java / Spring Ekosistem Raporu

Tarih: 27 Nisan 2026  
Odak: Spring Boot 4.1 RC hattı ile Spring Cloud uyumluluk boşluğu, event-driven release train olgunlaşması, güvenlik yamalarıyla daralan destek pencereleri, JDK 27 TLS hazırlığı

Tarama notu: Bugünkü taramada [Spring Blog](https://spring.io/blog/), [Spring proje sayfaları](https://spring.io/projects/), [Spring Boot proje sayfası](https://spring.io/projects/spring-boot/), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/), [Spring Security proje sayfası](https://spring.io/projects/spring-security/), [Spring Security advisories ve release duyuruları](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Authorization Server 1.5.7 duyurusu](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now), [Spring Boot 4.1.0-RC1 duyurusu](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), [Spring for Apache Kafka 4.1.0-RC1/4.0.5/3.3.15 duyurusu](https://spring.io/blog/2026/04/22/spring-kafka-4), [Spring Integration 7.1.0-RC1 duyurusu](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available), [Spring Modulith 2.1 RC1 duyurusu](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released), [Spring Cloud release documentation](https://docs.spring.io/spring-cloud-release/reference/index.html), [OpenJDK JEP 527](https://openjdk.org/jeps/527), [Inside Java](https://inside.java/2026/04/08/javaone-post-quantum-cryptography/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Spring roundup](https://www.infoq.com/news/2026/04/spring-news-roundup-apr20-2026/), [InfoQ Java roundup](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/), [Baeldung Java Weekly 643](https://www.baeldung.com/java-weekly-643), [Josh Long - This Week in Spring (21 Nisan 2026)](https://spring.io/blog/2026/04/21/this-week-in-spring-april-21st-2026), [Gunnar Morling blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Josh Long ve InfoQ, release-train yoğunluğunun merkezinde Boot 4.1/Kafka/Security/Integration hattı olduğunu doğruluyor. Gunnar Morling tarafında bugün Spring ekosistemi öncelik sırasını değiştiren yeni bir framework release yok; en güncel anlamlı teknik sinyal `Hardwood` beta. Burak KUTBAY tarafında son içerikler Boot 4 ve Spring 7 adoption temasını destekliyor, ancak bugün için yeni bir güvenlik veya release alarmı üretmiyor.

## Öne Çıkan Başlıklar

- En yüksek pratik değerli yeni sinyal, `Spring Boot 4.1.0-RC1` ile resmi `Spring Cloud` uyumluluk matrisinin birbirinden ayrışmış olması. Boot 4.1 RC1 yayımlandı, ancak resmi Spring Cloud dokümantasyonu `2025.1.x` hattını hâlâ `Boot 4.0.x` ile eşliyor ve referans dokümanda desteklenen Boot sürümü `4.0.2` olarak görünüyor.
- `Spring Security 6.5.10`, `7.0.5`, `7.1.0-RC1` ve `Spring Authorization Server 1.5.7` yalnızca CVE kapatmıyor; aynı anda eski nesiller için açık kaynak destek penceresinin daraldığını da ilan ediyor. Bu artık salt patch yönetimi değil, ürün yaşam döngüsü kararı.
- Event-driven tarafta yüzeysel değil, semantik değişim var. `Spring Kafka 4.1.0-RC1` share consumer, async commit callback ve Kafka Streams recovery modelini olgunlaştırırken; `Spring Integration 7.1.0-RC1` Redis lock davranışını `Redis 8.4+` native `CAS/CAD` komutlarına yaklaştırıyor.
- `Spring Modulith 2.1 RC1`, modüler monolit yaklaşımını yine “gösterişli” değil “operasyonel” iyileştirmelerle ilerletiyor: `@ModuleSlicing`, JobRunr transaction handling ve event publication registry düzeltmeleri bunun işareti.
- JDK tarafında bugün en değerli orta vadeli sinyal, `JDK 27` için gelen post-quantum hibrit TLS 1.3 anahtar değişimi. Bu hemen prod geçişi gerektirmiyor, ama mTLS, outbound HTTPS ve servis mesh kullanan ekipler için erken test listesine girmeli.

## Kritik Güncellemeler

### Spring Boot 4.1 RC1 ile Spring Cloud resmi matrisi arasında boşluk var

23 Nisan 2026 tarihli `Spring Boot 4.1.0-RC1`; OpenTelemetry SDK environment variable desteği, `InetAddressFilter` ile HTTP client SSRF azaltımı ve `LazyConnectionDataSourceProxy` desteği getiriyor. Bunlar gerçek üretim davranışı etkileyen özellikler.

Buna karşın resmi [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/) ve [Spring Cloud release dokümantasyonu](https://docs.spring.io/spring-cloud-release/reference/index.html), `2025.1.x` hattını `Spring Boot 4.0.x` ile eşliyor. Referans doküman ayrıca desteklenen Boot sürümünü `4.0.2` olarak yazıyor. Yani Boot 4.1 RC1 heyecanı ile Spring Cloud üretim matrisini aynı şey sanmak hata olur.

Pratik sonuç: Spring Cloud yoğun kullanan ekipler için `Boot 4.1.0-RC1`, geniş çaplı upgrade hedefi değil; sınırlı pilot, bağımlılık kilitleme ve davranış smoke testleri gerektiren bir erken doğrulama adımıdır.

### Spring Security ve Authorization Server tarafında patch ile support lifecycle aynı anda sıkışıyor

21 Nisan 2026’daki `Spring Security 2026.04` duyurusu; kullanıcı niteliği enumerate edilmesi, `X.509` istemci sertifikasıyla yetkisiz impersonation, `withIssuerLocation` ile hatalı güvenlik konfigürasyonu, servlet path matching hataları ve `JdbcOneTimeTokenService` ile çoklu oturum açılabilmesi gibi güvenlik sorunlarını kapatıyor.

Aynı gün yayımlanan `Spring Authorization Server 1.5.7`, dinamik client registration metadata doğrulamasındaki `CVE-2026-22752` açığını düzeltiyor.

Asıl kritik nokta, bu yamaların yanında `Spring Security 5.7.x`, `5.8.x`, `6.3.x`, `6.4.x` ile Authorization Server `1.3.x` ve `1.4.x` hatlarında açık kaynak desteğin bitmiş olduğunun açıkça söylenmesi. Yani bazı ekipler için “patchle ve devam et” dönemi kapanmış durumda; ya desteklenen hatta geçilecek ya da commercial hotfix hattına bağlanılacak.

### Event-driven stack, daha belirgin altyapı semantiğine kayıyor

`Spring for Apache Kafka 4.1.0-RC1`, 22 Nisan 2026’da yayımlandı. En önemli işaretler:

- Share consumer için `ShareAckMode` enum’u ile daha açık acknowledgment semantiği
- Async commit görünürlüğü için `AcknowledgementCommitCallback`
- Kafka Streams tarafında `groupProtocol` seçimi ile klasik model veya server-side rebalance yaklaşımı arasında tercih
- KIP-1034 hizasında native DLQ ve recovery yaklaşımına yakınlaşma

`Spring Integration 7.1.0-RC1` de 21 Nisan 2026’da geldi ve `RedisLockRegistry` için `Redis 8.4+` native `CAS/CAD` komutlarını kullanmaya başladı; eski sürümlerde Lua fallback korunuyor.

Bu iki yayın birlikte okunduğunda sinyal net: Spring eventing katmanı artık yalnızca annotation rahatlığı sunmuyor; broker ve koordinasyon katmanının davranışını uygulama koduna daha görünür biçimde taşıyor.

## Trendler ve Sinyaller

### 1. Release candidate bolluğu tek başına haber değil, uyumluluk matrisi asıl haber

`Boot`, `Security`, `Kafka`, `Integration`, `Modulith` ve `Vault` RC duyuruları tek başına bakıldığında gürültü yaratabilir. Kalıcı mühendislik değeri taşıyan kısım ise bunların hangi kombinasyonlarının gerçekten birlikte desteklendiği. Bugünün güçlü sinyali, RC yayın sayısı değil; `Boot 4.1` ile `Spring Cloud` arasında hâlâ kapanmamış resmi uyumluluk boşluğu olması.

### 2. Event-driven mimari, kütüphane yüzeyinden çok çalışma zamanı semantiğine kayıyor

Share consumer, async commit callback, broker-side recovery uyumu, Redis native distributed lock komutları ve JobRunr transaction rafinmanları aynı hikayeyi anlatıyor: Java/Spring ekipleri artık yalnızca API değil, çalışma zamanı davranışı seçiyor. Bu kalıcı değer taşıyan bir trend.

### 3. Güvenlik riski artık sadece CVE sayısı değil, destek hattının kendisi

Spring tarafında eski nesiller için “hala çalışıyor” yaklaşımı daha pahalı hale geliyor. Çünkü risk artık yalnızca açık sayısı değil; OSS patch penceresinin kapanması, commercial hotfix bağımlılığı ve platform modernizasyonunu geciktirmenin maliyeti.

### 4. Modüler monolit yaklaşımı geçici bir tartışma değil, üretim disiplini haline geliyor

`Spring Modulith` tarafındaki değişiklikler, mikroservis öncesi mimari sıkılığı güçlendirmeye devam ediyor. Özellikle event publication registry, outbox/externalization ve JobRunr benzeri entegrasyonlar bu yaklaşımın “demo seviyesinden” çıktığını gösteriyor.

### 5. JDK güvenlik yol haritasında hype değil, uzun ömürlü değer var

`JEP 527` gibi TLS 1.3 post-quantum hibrit anahtar değişimi, bugün için gündelik feature haberi gibi görünebilir. Ancak servisler arası güvenli haberleşmenin büyük kısmı JSSE üzerinden aktığı için bu tip değişiklikler orta vadede Spring ekosistemini doğrudan etkiler. Bu, kısa vadeli gürültü değil.

## Araçlar ve Kütüphaneler

- `Spring Kafka 4.1.0-RC1`: Yüksek öncelik. Özellikle Kafka 4.x, share consumer ve Kafka Streams recovery kullanan ekipler için anlamlı.
- `Spring Integration 7.1.0-RC1`: Orta-yüksek öncelik. Redis tabanlı koordinasyon, lock ve message flow kullanan ekipler izlemeli.
- `Spring Modulith 2.1.0-RC1`: Orta öncelik. Modüler monolit ve event externalization yaklaşımı olan ekipler için güçlü sinyal.
- `Spring Security 7.1.0-RC1` ve `Spring Authorization Server 1.5.7`: Yüksek öncelik. Yeni feature’dan çok patch ve support lifecycle açısından kritik.
- `Hardwood 1.0.0.Beta1`: Düşük öncelik. [Gunnar Morling’in 2 Nisan 2026 tarihli duyurusu](https://www.morling.dev/blog/hardwood-reaches-beta-s3-predicate-push-down-cli/) ile gelen S3 backend, predicate push-down ve CLI desteği; data-heavy JVM servisleri için ilginç, ama tipik Spring Boot mikroservislerinin ana gündemi değil.

Spring AI tarafında bugün üretim önceliğini değiştiren yeni bir release görülmedi. Bu alanda içerik bolluğu var, ancak bugünkü taramada kurumsal Java/Spring ekipleri için daha kalıcı sinyal uyumluluk, güvenlik ve eventing tarafında çıktı.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Cloud` kullanan ekipler, `Boot 4.1.0-RC1` ile geniş rollout planını karıştırmamalı. Özellikle `Gateway`, `Config`, `OpenFeign`, `Stream`, `Kubernetes` ve `Contract` kullanan sistemlerde resmi matris beklenmeden platform upgrade başlatmak gereksiz risk üretir.
- `Spring Security` ve `Authorization Server` kullanan ekipler, auth altyapısını bir dependency refresh işi gibi değil, support policy işi gibi ele almalı. Eski hatlarda kalmanın maliyeti hızla artıyor.
- Kafka ekipleri için önemli soru artık “hangi annotation” değil, “hangi tüketim semantiği”. Share consumer; partition affinity, batch processing, manual offset yönetimi ve poison message akışına dair eski varsayımları bozabilir.
- Redis ile lock veya koordinasyon yapan ekipler, `Redis 8.4+` ve daha eski sürümler arasındaki davranış farklarını test etmeden RC benimsememeli.
- `Spring Modulith` kullanan veya monolitten mikroservise geçiş baskısını azaltmak isteyen ekipler için 2.1 hattı izlemeye değer. Özellikle event publication ve iş akışı dışsallaştırma kullanan sistemlerde bu hat mimari borcu azaltabilir.
- JDK 27 hazırlığı yapan ekipler, TLS named groups override eden sistemleri ve servis mesh/proxy zincirini envanterlemeli. Post-quantum hibrit TLS kod değişikliği istemeyebilir, ama ağ katmanı sürpriz çıkarabilir.

## Fırsatlar ve Riskler

### Fırsatlar

- `Boot 4.1` feature setini Spring Cloud bağımlı olmayan servislerde erken pilotlayarak OTel env-var standardizasyonu ve SSRF azaltımı gibi konularda önden kazanım sağlamak.
- `Spring Kafka 4.1` ile Kafka Streams recovery ve async commit gözlemlenebilirliğini sadeleştirmek.
- `Spring Integration 7.1` ile Redis lock yenileme ve bırakma yolunu daha doğru ve daha görünür hale getirmek.
- `Spring Modulith 2.1` ile modüler monolit sınırlarını, event publication temizliğini ve JobRunr transaction davranışını güçlendirmek.
- `JDK 27` TLS yeniliklerini erkenden deneyip kurum içi TLS altyapısındaki zayıf halkaları GA öncesi görmek.

### Riskler

- Resmi uyumluluk kapanmadan `Boot 4.1 RC1` ile `Spring Cloud` üretim kombinasyonları oluşturmak.
- OSS destek dışına çıkmış `Spring Security` veya `Authorization Server` hatlarında sessizce kalmaya devam etmek.
- Share consumer modelini klasik consumer group gibi varsayıp partition temelli iş garantilerine güvenmek.
- `Redis 8.4+` native lock yolu ile eski Lua fallback yolunu aynı operasyonel davranış sanmak.
- `jdk.tls.namedGroups` override eden, eski TLS middlebox kullanan veya katı sertifika cihazlarına bağlı ortamlarda JDK 27 TLS davranışını test etmemek.

## İzlenmesi Gereken Konular

- Resmi `Spring Cloud` hattının `Boot 4.1.x` uyumluluğunu ne zaman ilan edeceği
- `Spring Boot 4.1` GA öncesi yeni migration note veya compatibility uyarısı gelip gelmeyeceği
- `Spring Security` ve `Authorization Server` tarafında bu CVE kümesine bağlı ek servis release gerekip gerekmediği
- `Spring Kafka 4.1` share consumer modelinin GA’ya kadar hangi sınırlamaları koruyacağı
- `Spring Integration 7.1` ve `Redis 8.4+` lock davranışının gerçek yük altında nasıl sonuç verdiği
- `Spring Modulith 2.1 GA` öncesi JobRunr ve event publication registry değişikliklerinin stabil hale gelip gelmediği
- `JDK 27` için TLS 1.3 post-quantum hibrit anahtar değişimi etrafında yeni interoperabilite notları çıkıp çıkmayacağı

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot 4.1.0-RC1 güçlü geliyor, ancak resmi Spring Cloud matrisi hâlâ Boot 4.0.x seviyesinde
- source: [Spring Boot 4.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/), [Spring Cloud release reference](https://docs.spring.io/spring-cloud-release/reference/index.html)
- author: Andy Wilkinson, Spring Cloud Team
- date: 23 Nisan 2026 ve 27 Nisan 2026 durum kontrolü
- category: platform-compatibility, release-candidate, spring-cloud
- tags: spring-boot-4.1, spring-cloud-2025.1, compatibility-matrix, opentelemetry, ssrf, lazy-jdbc
- summary: `Spring Boot 4.1.0-RC1` önemli üretim özellikleriyle geldi, ancak resmi `Spring Cloud 2025.1.x` dokümantasyonu hâlâ `Boot 4.0.x` uyumluluğu söylüyor ve desteklenen Boot sürümü `4.0.2` olarak belirtiliyor.
- why_it_matters: RC heyecanı ile resmi destek matrisini karıştırmak, özellikle Spring Cloud kullanan platformlarda gereksiz sürprizler üretir.
- java_spring_relevance: Spring Boot ve Spring Cloud üzerine kurulu mikroservis portföyleri için doğrudan karar değeri taşıyor.
- actionability: kontrollu_pilot_ve_genis_yayilimi_ertele
- impact_level: çok_yüksek
- opportunities: Spring Cloud bağımlı olmayan servislerde OTel env-var, SSRF filtresi ve lazy JDBC davranışını erkenden test etmek.
- risks: BOM uyumsuzluğu, auto-configuration davranış farkları ve resmi support dışı kombinasyonlara düşmek.
- migration_notes: Spring Cloud kullanan uygulamalarda resmi matris beklenmeli. Pilot yapılacaksa bağımlılıklar kilitlenmeli ve smoke/regression testleri genişletilmelidir.

### Bulgu 2

- title: Spring Security 2026.04 ve Spring Authorization Server 1.5.7, güvenlik yamalarını destek penceresi daralmasıyla birlikte getiriyor
- source: [Spring Security 2026.04 Releases - Contains CVE Fixes](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Authorization Server 1.5.7 Available Now](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now)
- author: Josh Cummings, Joe Grandja
- date: 21 Nisan 2026
- category: security, lifecycle, auth
- tags: spring-security, spring-authorization-server, cve, x509, oauth2, one-time-token, support-policy
- summary: Yeni yayınlar; `DaoAuthenticationProvider`, `X.509`, `withIssuerLocation`, servlet path matching ve one-time token akışı dahil çok sayıda güvenlik sorununu kapatıyor. Aynı duyurularda eski nesiller için OSS desteğin bittiği de netleştiriliyor.
- why_it_matters: Bu artık yalnızca “patch yap” konusu değil; hangi ürün hattında kalınacağına dair yaşam döngüsü kararı.
- java_spring_relevance: Kimlik doğrulama, authorization server, OAuth2 login veya client registration kullanan tüm Spring ekipleri için yüksek önemde.
- actionability: hemen_guncelle_ve_destek_penceresini_yeniden_planla
- impact_level: çok_yüksek
- opportunities: Auth konfigürasyonunu sadeleştirmek, desteklenen hatlara geçişi hızlandırmak ve güvenlik borcunu azaltmak.
- risks: Yetkisiz erişim, hatalı auth kararı, yanlış issuer konfigürasyonu ve artık OSS patch alamayan sürümlerde sessiz risk birikimi.
- migration_notes: Desteklenen hatlarda `6.5.10`, `7.0.5`, `1.5.7` seviyeleri hedeflenmeli. Eski nesiller için commercial hotfix zorunluluğu oluşabilir.

### Bulgu 3

- title: Spring Kafka 4.1.0-RC1, share consumer ve Kafka Streams hata işleme modelini daha üretim-odaklı hale getiriyor
- source: [Spring for Apache Kafka 4.1.0-RC1, 4.0.5, and 3.3.15 Available](https://spring.io/blog/2026/04/22/spring-kafka-4), [Spring Kafka reference overview](https://docs.spring.io/spring-kafka/reference/)
- author: Soby Chacko
- date: 22 Nisan 2026
- category: messaging, event-driven, release-candidate
- tags: spring-kafka, share-consumer, kafka-streams, kip-1034, kip-1071, async-commits
- summary: `Spring Kafka 4.1.0-RC1`; `ShareAckMode`, async commit callback, `StreamsBuilderFactoryBean.groupProtocol` seçimi ve Kafka Streams recovery yaklaşımında `KIP-1034` hizası gibi değişikliklerle geliyor.
- why_it_matters: Bu değişiklikler API kozmetiği değil; tüketim semantiği, rebalance davranışı ve hata toparlama stratejisini etkiliyor.
- java_spring_relevance: Spring Boot üzerinden Kafka tüketen, Kafka Streams kullanan veya event-driven sistemlerde delivery garantisi tartışan ekipler için doğrudan etkili.
- actionability: pilot_ve_yuk_altinda_dogrula
- impact_level: yüksek
- opportunities: Daha net ack semantiği, daha görünür async commit sonucu ve Streams tarafında daha doğal recovery/DLQ yaklaşımı.
- risks: Partition affinity, batch işleme ve manual offset varsayımlarının share consumer ile örtüşmemesi.
- migration_notes: Share consumer halen erken aşama olarak ele alınmalı. `groupProtocol`, commit callback ve listener davranışı gerçek yük altında test edilmelidir.

### Bulgu 4

- title: Spring Integration 7.1.0-RC1 ile Redis tabanlı dağıtık kilitler native CAS/CAD komutlarına kayıyor
- source: [Spring Integration 7.1.0-RC1 Available](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available)
- author: Glenn Renfro
- date: 21 Nisan 2026
- category: distributed-systems, integration, redis
- tags: spring-integration, redislockregistry, redis-8.4, cas, cad, distributed-locks
- summary: `RedisLockRegistry`, `Redis 8.4+` üzerinde lock yenileme ve serbest bırakma için native `CAS/CAD` komutlarına geçiyor; eski sürümler için Lua fallback korunuyor.
- why_it_matters: Dağıtık lock altyapısı doğru çalıştığında görünmezdir; yanlış çalıştığında ise veri bütünlüğü ve koordinasyon hataları üretir.
- java_spring_relevance: Redis ile koordinasyon, aggregator/resequencer veya custom lock akışları kuran Spring Integration ekipleri için doğrudan ilgili.
- actionability: labda_test_et_ve_redis_surumuyle_eslestir
- impact_level: orta-yüksek
- opportunities: Daha tutarlı lock renewal/release davranışı ve Redis DSL ile daha okunabilir akışlar.
- risks: `Redis 8.4+` ile eski sürüm fallback yolunu eşdeğer sanmak, mixed-cluster davranışını test etmemek.
- migration_notes: Redis sürümü, TTL, renewal ve fallback yolu birlikte test edilmelidir. Özellikle lock kritik iş akışlarında canary olmadan geçiş yapılmamalıdır.

### Bulgu 5

- title: Spring Modulith 2.1 RC1, modüler monolit yolunu JobRunr ve event publication registry rafinmanlarıyla sertleştiriyor
- source: [Spring Modulith 2.1 RC1, 2.0.6, and 1.4.11 released](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released), [Spring Modulith event publication registry dokümantasyonu](https://docs.spring.io/spring-modulith/reference/events.html)
- author: Oliver Drotbohm
- date: 24 Nisan 2026
- category: architecture, modular-monolith, release-candidate
- tags: spring-modulith, module-slicing, jobrunr, event-publication, modular-monolith
- summary: `2.1 RC1`; `@ModuleSlicing` için daha doğru `@SpringBootApplication` tercihi, JobRunr transaction handling iyileştirmeleri ve event publication registry tarafında rafinmanlar getiriyor.
- why_it_matters: Modüler monolitin üretimde değer üretmesi; test sınırları, transaction davranışı ve event publication güvenilirliğinin güçlü olmasına bağlı.
- java_spring_relevance: Mikroservise erken parçalanmak istemeyen ama mimari disiplin arayan Spring Boot ekipleri için anlamlı.
- actionability: pilot_et_ve_test_stratejisini_guncelle
- impact_level: orta-yüksek
- opportunities: Daha net modül sınırları, daha güvenilir event externalization ve background job entegrasyonu.
- risks: RC sürümde davranış farkları ve GA öncesi küçük ama etkili semantik değişimler.
- migration_notes: JobRunr, event publication registry ve module integration test kullanan ekipler RC ile laboratuvar testi yapmalı; doğrudan geniş prod geçişi erken olur.

### Bulgu 6

- title: JDK 27 için post-quantum hibrit TLS 1.3 anahtar değişimi, Java ağ güvenliği tabanını ileri taşıyor
- source: [JEP 527](https://openjdk.org/jeps/527), [Java and Post-Quantum Cryptography](https://inside.java/2026/04/08/javaone-post-quantum-cryptography/)
- author: Jamil Nimeh, Sean Mullan
- date: 17 Şubat 2026 ve 8 Nisan 2026
- category: jdk, security, crypto
- tags: jdk-27, tls-1.3, post-quantum, ml-kem, x25519mlkem768, ssl
- summary: `JDK 27`, TLS 1.3 için hibrit post-quantum anahtar değişimi getiriyor. Varsayılan istemci tercihlerinde `X25519MLKEM768` öne alınacak ve `javax.net.ssl` kullanan uygulamalar çoğu durumda kod değişikliği yapmadan bundan yararlanabilecek.
- why_it_matters: Uygulama kodu değişmeden güvenlik tabanını güçlendirmek güçlü bir fırsat; ancak ağ zincirindeki eski bileşenler nedeniyle görünmez uyumluluk sorunları çıkabilir.
- java_spring_relevance: Spring servisleri çoğunlukla JSSE üzerinden TLS kullandığı için bu değişiklik; outbound HTTPS, mTLS, service mesh ve partner entegrasyonlarını doğrudan etkileyebilir.
- actionability: izle_ve_early_access_smoke_test_planla
- impact_level: orta
- opportunities: Kod değiştirmeden daha dayanıklı varsayılan TLS duruşu.
- risks: Draft standard değişimi, middlebox/proxy uyumsuzluğu ve custom `namedGroups` override’larının hibrit grupları engellemesi.
- migration_notes: `jdk.tls.namedGroups` override’ları, TLS terminator cihazları ve non-prod handshake testleri JDK 27 denemelerinden önce envanterlenmelidir.

### Bulgu 7

- title: Hardwood 1.0.0.Beta1, veri ağırlıklı JVM servisleri için düşük öncelikli ama ilginç bir Parquet aracı olarak öne çıkıyor
- source: [Gunnar Morling blogu](https://www.morling.dev/blog/)
- author: Gunnar Morling
- date: 2 Nisan 2026
- category: tooling, data-processing
- tags: parquet, s3, predicate-pushdown, cli, jvm
- summary: Gunnar Morling’in son büyük güncellemesi olan `Hardwood 1.0.0.Beta1`; S3 backend, predicate push-down, CLI ve düşük bağımlılık yüzeyi ile veri işleme tarafında dikkat çekiyor.
- why_it_matters: Spring merkezli tipik CRUD/mikroservis ekipleri için ana gündem değil; ancak data servisleri ve ETL odaklı JVM ekipleri için bağımlılık yüzeyi küçük alternatifler önemli olabilir.
- java_spring_relevance: Relevansı sınırlı ama gerçek; özellikle Spring Batch, data ingestion veya object storage üstünde çalışan JVM servisleri için.
- actionability: dusuk_oncelikli_takip
- impact_level: düşük
- opportunities: Hadoop ekosistemi taşımadan Parquet işlemek isteyen servisler için daha hafif bir seçenek doğabilir.
- risks: Beta olgunluğu, ekosistem entegrasyonunun henüz erken aşamada olması.
- migration_notes: Ancak izole POC veya laboratuvar seviyesinde değerlendirilmelidir; genel Spring platform standardı olarak ele almak için erken.

## Sonuç

27 Nisan 2026 itibarıyla en önemli mühendislik sonucu şu: Spring ekosisteminde asıl konu artık yeni RC sayısı değil, bu RC’lerin hangi resmi uyumluluk ve destek matrisinde çalıştığı. `Boot 4.1 RC1` ilgi çekici, fakat `Spring Cloud` kullanan ekipler için hemen yaygınlaştırılabilir değil. `Security` ve `Authorization Server` tarafında patch ile support lifecycle aynı masaya gelmiş durumda. Event-driven tarafta ise Kafka ve Redis tabanlı koordinasyon semantiği daha ciddi hale geliyor.

Bugün için en doğru yaklaşım; heyecanlı upgrade yerine kontrollü pilot, desteklenen hatlara geçiş planı ve çalışma zamanı davranışını ölçen testler kurmak. Kısa vadede en yüksek değer, sürüm matrisini doğru okumak ve auth/eventing katmanındaki gizli semantik değişimleri erken yakalamaktan geliyor.
