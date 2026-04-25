# Günlük Java / Spring Ekosistem Raporu

Tarih: 25 Nisan 2026  
Odak: Spring Security ve Spring Framework güvenlik hattı, Kafka/Pulsar yayınları, Spring Modulith 2.1 RC1, Spring AI Session yol haritası, Java platformunda HTTP/3 ve post-quantum TLS hazırlığı

Kaynak tarama notu: Bu taramada [Spring Blog](https://spring.io/blog), [Spring Projects](https://spring.io/projects), ilgili Spring release/changelog sayfaları, [OpenJDK JEP 527](https://openjdk.org/jeps/527), [Oracle Java Blog - The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [Inside Java - Java and Post-Quantum Cryptography](https://inside.java/2026/04/08/javaone-post-quantum-cryptography/), [InfoQ - Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Baeldung Java Weekly 643](https://www.baeldung.com/java-weekly-643), Josh Long’un Spring roundup içerikleri, [Gunnar Morling’in blogu](https://www.morling.dev/), Spring maintainer yayınları/GitHub release notları ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Josh Long, Gunnar Morling ve Burak KUTBAY tarafında bugün ana öncelik sırasını tek başına değiştiren yeni bir güvenlik veya release duyurusu yok; fakat bu kaynaklar, özellikle platform yönü ve pratik benimseme sinyallerini doğrulamak için kullanıldı.

## Öne Çıkan Başlıklar

Bugünün en güçlü sinyali, Spring güvenlik hattının birden fazla katmanda aynı hafta içinde sertleşmesi. `Spring Security 6.5.10 / 7.0.5 / 7.1.0-RC1`, `Spring Authorization Server 1.5.7` ve `Spring Framework 6.2.18 / 7.0.7` birlikte okunduğunda; kimlik doğrulama, yetkilendirme eşlemesi, dinamik client registration ve MVC/WebFlux static resource işleme tarafında gerçek üretim etkisi olan açıkların kapatıldığı görülüyor.

Mesajlaşma tarafında `Spring for Apache Kafka 4.1.0-RC1 / 4.0.5 / 3.3.15` ile `Spring for Apache Pulsar 1.2.17 / 2.0.5` öne çıkıyor. Kafka tarafında share consumer, async commit callback, server-side rebalance seçimi ve Kafka Streams için yerel DLQ/exception handler hizalaması; event-driven Spring ekipleri için sadece versiyon güncellemesi değil, davranış semantiği değişimi anlamına geliyor.

Mimari araçlar tarafında `Spring Modulith 2.1 RC1`, modül dilimleme, JobRunr transaction handling ve event publication registry üzerinde olgunlaşma sinyali veriyor. Bu, modüler monolith ve outbox/event publication desenlerini Spring içinde daha disiplinli kullanmak isteyen ekipler için değerli.

Java platformunda kısa vadede hemen prod’a alınacak tek bir kırmızı alarm yok; ancak orta vadeli yön çok net. Java 26 ile HTTP/3 istemci desteği ve Structured Concurrency hattı pratik hale gelirken, OpenJDK JEP 527 ile TLS 1.3 için post-quantum hybrid key exchange artık ciddi bir hazırlık konusu haline geliyor.

## Kritik Güncellemeler

### Spring Security ve Authorization Server güvenlik hattı

21 Nisan 2026 tarihli `Spring Security 2026.04` yayınları; `DaoAuthenticationProvider`, `X.509`, `withIssuerLocation`, servlet path matching ve `JdbcOneTimeTokenService` alanlarında birden fazla CVE düzeltmesi içeriyor. Aynı gün çıkan `Spring Authorization Server 1.5.7`, `CVE-2026-22752` için doğrudan yama sağlıyor. Bu iki yayın birlikte ele alınmalı; çünkü kimlik akışları pratikte çoğu kurumda ayrık projeler gibi görünse de aynı güven zincirinin parçaları.

### Spring Framework 6.2.18 ve 7.0.7

17 Nisan 2026 tarihli bu bakım sürümleri, üç kritik web katmanı açığını kapatıyor: multipart temp file kaynaklı WebFlux disk tüketimi, MVC/WebFlux static resource cache poisoning ve Windows üzerinde static resource handling kaynaklı DoS. Bu hat, özellikle edge node, dosya yükleme, CDN/resource cache ve Windows tabanlı geliştirme/test altyapıları için doğrudan önemli.

### Spring Kafka ve Pulsar yayınları

22 Nisan 2026 tarihli Kafka ve Pulsar yayınları, sadece dependency bump olarak okunmamalı. Kafka tarafında `ShareAckMode`, async commit callback, `groupProtocol` seçimi ve Kafka Streams error handling hizalaması; tüketici davranışı, yeniden dengeleme ve hata yönetimi tarafında etkili. Pulsar yayınları ise yeni Boot hatlarına düzgün entegrasyon için taşıyıcı işlev görüyor: `1.2.17` -> Boot `3.5.14`, `2.0.5` -> Boot `4.0.6` ve `4.1.0-RC1`.

### Spring Modulith 2.1 RC1

24 Nisan 2026 tarihli `Spring Modulith 2.1 RC1`, “modüler monolith” söylemini yeni özellik eklemekten çok davranış sertleştirmeye taşıyor. JobRunr transaction handling ve event publication registry tarafındaki iyileştirmeler, modül içi olaylaşma ve dışsallaştırma akışlarının beklenmedik tutarsızlıklar üretmesini azaltmaya odaklanıyor.

## Trendler ve Sinyaller

### 1. Güvenlik artık sadece uygulama kodu meselesi değil

Bu hafta boyunca gelen Spring Security, Authorization Server, Framework ve Boot yayınları birlikte okunduğunda risklerin önemli bölümünün artık “uygulama business logic hatası” değil; framework default’ları, matcher semantiği, resource handling ve otomatik yapılandırma seviyesinde ortaya çıktığı görülüyor. Kurumsal ekiplerin güvenlik bakımını starter, auto-config ve dependency hattı üzerinden düşünmesi gerekiyor.

### 2. Event-driven Spring stack, broker semantiğine daha yakın hale geliyor

Kafka’daki share consumer, server-side rebalance ve KIP-1034 uyumu; Spring’in artık mesajlaşma soyutlamasında eski “framework her şeyi gizler” yaklaşımından biraz uzaklaştığını gösteriyor. Bu iyi bir gelişme; çünkü yüksek hacimli üretim sistemlerinde gerçek broker davranışıyla hizalı soyutlamalar daha değerli.

### 3. Durum, sınır ve kayıt altına alma geri dönüyor

Spring Modulith tarafında event publication registry, JobRunr transaction handling; Spring AI tarafında event-sourced session log ve context compaction yaklaşımı; mimari olarak aynı yere işaret ediyor: sistem davranışı daha açık tanımlanmış sınırlar ve kayıt altına alınmış durum üzerinden yönetilmeli. Bu kısa ömürlü hype değil, kalıcı mühendislik değeri taşıyan bir yön.

### 4. Spring 7 / Boot 4 hattı platform katmanını sadeleştiriyor

InfoQ’daki Spring ekip röportajı, Boot 4 modülerleşmesinin classpath taramasını azaltarak daha küçük artifact ve daha hızlı başlangıç davranışına katkı verdiğini; Spring Framework 7’nin ise retry ve concurrency throttling gibi yetenekleri çekirdeğe çektiğini vurguluyor. Burak KUTBAY’ın API versioning ve HTTP service client içerikleri de bu yönün günlük geliştirme pratiğine indiğini gösteriyor.

### 5. Hype ile kalıcı değer ayrımı bugün daha net

Bugün AI alanında çok sayıda içerik tarandı; ancak üretim Java/Spring ekipleri için dayanıklı değer oluşturan başlıklar güvenlik yamaları, eventing semantiği, modüler mimari olgunlaşması ve JDK ağ/kripto yönü oldu. AI memory/session modeli önemli, fakat yalnızca Spring AI tabanlı ürün geliştiren ekipler için kısa vadede öncelikli.

## Araçlar ve Kütüphaneler

- `Spring for Apache Kafka 4.1.0-RC1`: Event-driven ekipler için yüksek öncelikli izleme konusu. Share consumer ve Streams error handling değişiklikleri canary test gerektiriyor.
- `Spring Modulith 2.1 RC1`: Modüler monolith ve domain event altyapısı kullanan ekipler için anlamlı bir pilot adayı.
- `Spring AI Session` yaklaşımı: Event-sourced session log, turn-safe compaction ve keyword-searchable recall ile mimari olarak güçlü; ancak genel backend ekipleri için şu an “izle/pilotla” seviyesinde.
- `Hardwood 1.0.0.Beta1`: Gunnar Morling’in minimal bağımlılıklı Parquet parser’ı; S3 backend, predicate push-down, Avro binding ve CLI ile ilginç bir JVM araç sinyali. Veri ağırlıklı servisler için düşük öncelikli ama kaliteli bir radar maddesi.

Bugün observability, testing ve Kubernetes tarafında tek başına öncelik sırasını değiştiren yeni bir resmi Spring/JVM yayını saptamadım.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Boot kullanan servislerde “sadece Boot patch’i geçmek” yeterli görülmemeli; Security, Authorization Server ve Framework seviyesinde hangi sürüm hattında olduğunuz net envanterlenmeli.
- Kafka kullanan ekipler, `4.1.x` pilotlarında tüketici davranışını sadece entegrasyon testleriyle değil, gecikme ve yeniden dengeleme metrikleriyle de doğrulamalı.
- Spring Modulith kullanan ekipler için `2.1 RC1`, özellikle JobRunr ve event publication kullanan sistemlerde kontrollü pilot için uygun görünüyor.
- Spring AI kullanan ekipler, `ChatMemory` etrafında yeni yatırım yaparken Session API’nin `2.1` hedefi ve deprecation yönünü dikkate almalı.
- Java platform tarafında JDK 26/27 laboratuvar çalışmaları artık daha anlamlı: HTTP/3, structured concurrency ve post-quantum TLS hazırlığı, gelecek 6-12 aylık platform planına girmeli.

## Fırsatlar ve Riskler

### Fırsatlar

- Güvenlik ve framework patch pencerelerini tek bir “platform release train” halinde yönetmek.
- Kafka tarafında server-side rebalance ve native DLQ semantiğini daha sade bir operasyon modeline dönüştürmek.
- Modulith ile modül sınırlarını ve event publication akışlarını daha görünür ve doğrulanabilir hale getirmek.
- JDK 26 üzerinden HTTP/3 ve concurrency modernizasyonu için kontrollü performans testleri başlatmak.
- Spring 7 / Boot 4’ün modülerleşme ve çekirdek yeteneklerini kullanarak dış bağımlılık yüzeyini azaltmak.

### Riskler

- Güvenlik yamalarını yalnızca Boot seviyesinde izleyip alt projelerdeki kırılgan alanları gözden kaçırmak.
- Kafka 4.1 özelliklerini davranış farklarını anlamadan prod’a taşımak.
- Modulith event publication ve JobRunr entegrasyonunu yeterli transaction sınır testi olmadan yükseltmek.
- Spring AI tarafında kısa ömürlü mevcut `ChatMemory` yatırımlarını, yaklaşan Session modelini hesaba katmadan büyütmek.
- PQC/TLS ve HTTP/3 gibi JDK yeniliklerini “çok erken” diyerek tamamen görmezden gelip uyumluluk çalışmasını geciktirmek.

## İzlenmesi Gereken Konular

- Spring Security `7.1.0` GA’ya giderken RC notlarında yeni davranış değişikliği çıkıp çıkmayacağı.
- Spring Boot `4.1.0` final sürümünde Kafka/Pulsar/Security/Spring Data hattının nasıl stabilize olacağı.
- Spring Modulith `2.1 GA` öncesinde event publication ve JobRunr tarafında ek düzeltmeler gelip gelmeyeceği.
- Spring AI `2.0.0-RC1` ve `2.1` hattında Session API’nin resmi ürüne hangi kapsamla gireceği.
- OpenJDK `JEP 527` ve TLS named groups davranışının farklı vendor JDK’larda ne kadar hızlı yaygınlaşacağı.
- Burak KUTBAY, Josh Long ve Gunnar Morling gibi pratik odaklı kaynaklarda bu başlıkların üretim deneyimiyle doğrulanıp doğrulanmadığı.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Security ve Authorization Server güvenlik hattı aynı günde sertleşti
- source: [Spring Security 2026.04 Releases - Contains CVE Fixes](https://spring.io/blog/2026/04/21/spring-security-releases/) ; [Spring Authorization Server 1.5.7 Available Now](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/) ; [Java Weekly 643](https://www.baeldung.com/java-weekly-643)
- author: Josh Cummings ; Joe Grandja ; Baeldung editörleri
- date: 21-23 Nisan 2026
- category: security, identity, release
- tags: spring-security, authorization-server, cve, x509, oauth2, oidc, one-time-token, path-matching
- summary: `Spring Security 6.5.10 / 7.0.5 / 7.1.0-RC1` ve `Spring Authorization Server 1.5.7`; path matching, X.509 user impersonation, `withIssuerLocation`, dynamic client registration ve one-time token alanlarında güvenlik düzeltmeleri içeriyor.
- why_it_matters: Kimlik doğrulama ve yetkilendirme hataları, servis sınırlarından bağımsız olarak tüm platformun güven modelini etkiler; bu yüzden “küçük bakım sürümü” gibi ele alınmamalı.
- java_spring_relevance: Spring Security ve Authorization Server, kurumsal Java/Spring servislerinin önemli bölümünde doğrudan veya dolaylı olarak yer alıyor.
- actionability: hemen
- impact_level: çok_yüksek
- opportunities: Auth akışlarını, servlet path matcher kurallarını ve dynamic client registration politikalarını netleştirme fırsatı doğuyor.
- risks: Yanlış path match, client metadata doğrulama zafiyeti veya one-time token davranışı; yetkisiz erişim, yanlış yetkilendirme veya oturum semantiği bozulmasına yol açabilir.
- migration_notes: Açık kaynak desteği biten `5.7.x`, `5.8.x`, `6.3.x`, `6.4.x` hatlarında kalan ekipler planlı upgrade hazırlamalı. Commercial hotfix kullanan ekipler için `2.7.32.2`, `3.3.18.2`, `3.4.15.2` eşlemeleri ayrıca not edilmeli.

### Bulgu 2

- title: Spring Framework 6.2.18 ve 7.0.7 web katmanında üç CVE kapattı
- source: [Spring Framework 6.2.18 and 7.0.7 Available Now](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/) ; [InfoQ Java News Roundup - Apr 13, 2026](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/)
- author: Stéphane Nicoll ; Michael Redlich
- date: 17 Nisan 2026, 20 Nisan 2026
- category: security, web, framework
- tags: spring-framework, spring-mvc, webflux, cve, multipart, static-resources, dos
- summary: `CVE-2026-22740`, `CVE-2026-22741` ve `CVE-2026-22745`; WebFlux multipart temp file temizliği, static resource cache poisoning ve Windows üzerindeki static resource handling kaynaklı DoS sorunlarını kapatıyor.
- why_it_matters: Bu tip açıklar çoğu zaman uygulama kodundan bağımsız şekilde framework default davranışından kaynaklanır ve altyapı seviyesinde etkili olur.
- java_spring_relevance: Spring MVC/WebFlux kullanan tüm web servisleri bu katmana bağlı; özellikle dosya yükleme ve statik içerik sunumu yapan servisler etkilenebilir.
- actionability: hemen
- impact_level: çok_yüksek
- opportunities: Resource handling ve upload pipeline’ını daha disiplinli test etme, static resource önbellekleme stratejisini gözden geçirme.
- risks: Disk tüketimi, cache zehirlenmesi ve bağlantı tüketimiyle oluşan DoS senaryoları.
- migration_notes: `6.2.x` kullananlar `6.2.18`e, `7.0.x` kullananlar `7.0.7`ye geçmeli. Eski OSS-dışı hatlarda kalan ekipler commercial hotfix planını ayrıca doğrulamalı.

### Bulgu 3

- title: Spring Kafka 4.1 RC1 ve Pulsar 2.0.5 event-driven davranışı etkileyen değişiklikler taşıyor
- source: [Spring for Apache Kafka 4.1.0-RC1, 4.0.5, and 3.3.15 Available](https://spring.io/blog/2026/04/22/spring-kafka-4/) ; [Spring for Apache Pulsar 1.2.17 and 2.0.5 are now available](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available/) ; [Java Weekly 643](https://www.baeldung.com/java-weekly-643)
- author: Soby Chacko ; Chris Bono ; Baeldung editörleri
- date: 22-23 Nisan 2026
- category: messaging, event-driven, release
- tags: spring-kafka, kafka-streams, spring-pulsar, share-consumer, kip-1034, kip-1071, boot-alignment
- summary: Kafka tarafında `ShareAckMode`, async commit callback, `StreamsBuilderFactoryBean#groupProtocol` ve Kafka Streams için native DLQ/exception handler hizalaması geldi. Pulsar tarafında yeni sürümler Boot `3.5.14`, `4.0.6` ve `4.1.0-RC1` hatlarına hizalanıyor.
- why_it_matters: Mesajlaşma framework’lerinde küçük görünen semantik değişiklikler; commit, rebalance, error handling ve back-pressure davranışını doğrudan etkiler.
- java_spring_relevance: Spring Cloud Stream dışı doğrudan Kafka/Pulsar kullanımı artıyor; bu yüzden framework seviyesindeki bu değişiklikler gerçek üretim davranışını etkiler.
- actionability: hedefli_canary
- impact_level: yüksek
- opportunities: Broker semantiğine daha yakın tüketici ayarlarıyla gecikme, hata kurtarma ve DLQ yönetimini iyileştirmek.
- risks: Ack/commit davranışının değişmesi, rebalance sapmaları ve Streams exception handling farkları nedeniyle sürpriz işleme sonuçları.
- migration_notes: `4.1.0-RC1` ancak kontrollü pilot için uygun. `4.0.5` ve `3.3.15` patch hattı daha güvenli. Rebalance, retry, DLQ ve consumer lag metrikleriyle birlikte smoke/canary testi önerilir.

### Bulgu 4

- title: Spring Modulith 2.1 RC1 modüler monolith tarafında işlem sınırı ve event publication olgunluğu getiriyor
- source: [Spring Modulith 2.1 RC1, 2.0.6, and 1.4.11 released](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released)
- author: Oliver Drotbohm
- date: 24 Nisan 2026
- category: architecture, modularity, release-candidate
- tags: spring-modulith, modular-monolith, jobrunr, event-publication, module-slicing
- summary: `2.1 RC1`; `@ModuleSlicing` davranışını rafine ediyor, JobRunr entegrasyonunda transaction handling’i iyileştiriyor ve event publication registry üzerinde bir dizi düzeltme getiriyor.
- why_it_matters: Modüler monolith yaklaşımının gerçek değeri; modül sınırı, transaction sınırı ve event publication güvenilirliği birlikte geldiğinde ortaya çıkıyor.
- java_spring_relevance: Mikroservise gitmeden önce daha disiplinli modüler yapı kurmak isteyen Spring ekipleri için doğrudan karar değeri taşıyor.
- actionability: pilotla_ve_izle
- impact_level: orta-yüksek
- opportunities: Modulith tabanlı domain sınırlarını daha iyi doğrulamak, event publication akışlarını güvenilirleştirmek.
- risks: RC sürüm olduğu için API ve davranışın son halini almamış olması; özellikle JobRunr kullanan sistemlerde yeni transaction davranışı yan etki üretebilir.
- migration_notes: `2.0.x` kullanan ekipler önce `2.0.6` patch hattında kalabilir. `2.1 RC1` yalnızca modüler mimariyi ileri taşımak isteyen ekiplerde kontrollü deneme için mantıklı.

### Bulgu 5

- title: Spring AI Session, ChatMemory yerine event-sourced kısa dönem hafıza modeline işaret ediyor
- source: [Spring AI Agentic Patterns (Part 7): Session API — Event-Sourced Short-Term Memory with Context Compaction](https://spring.io/blog/2026/04/15/spring-ai-session-management/) ; [Spring Blog](https://spring.io/blog)
- author: Christian Tzolov ; Josh Long
- date: 15-21 Nisan 2026
- category: ai, architecture, roadmap
- tags: spring-ai, session-api, chatmemory, compaction, event-sourcing, agents
- summary: Spring AI Session yaklaşımı; konuşmayı düz mesaj listesi yerine event-sourced log olarak saklıyor, turn-safe compaction sağlıyor ve yol haritasında `Spring AI 2.1` ile `ChatMemory` yerine geçmesi hedefleniyor.
- why_it_matters: AI tarafındaki hafıza modeli; tool-call zinciri, multi-agent branching ve context compaction kalite sorunlarını çözüyorsa kalıcı mimari değer üretir.
- java_spring_relevance: Spring AI kullanan backend ekipleri için bu, uygulama state modeli ve maliyet/kalite dengesi üzerinde doğrudan etkili.
- actionability: izle_ve_pilotla
- impact_level: orta
- opportunities: Session state’i daha kontrollü, arama yapılabilir ve turn-safe biçimde yönetmek.
- risks: Erken yatırımın yeni API’ye göre yeniden yazım gerektirmesi; mevcut `ChatMemory` etrafında özel soyutlamalar geliştiren ekiplerde teknik borç oluşması.
- migration_notes: Yeni projelerde `ChatMemory` üzerine ağır özel genişletme yapmadan önce Session yönünü dikkate almak mantıklı. Üretim dışı pilot ve API sınırı soyutlaması önerilir.

### Bulgu 6

- title: Java platformunda HTTP/3, structured concurrency ve post-quantum TLS aynı yöne bakıyor
- source: [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26) ; [Java and Post-Quantum Cryptography](https://inside.java/2026/04/08/javaone-post-quantum-cryptography/) ; [OpenJDK JEP 527](https://openjdk.org/jeps/527)
- author: Sharat Chander ; Sean Mullan ; Jamil Nimeh
- date: 17 Nisan 2026, 8 Nisan 2026
- category: jdk, security, networking, concurrency
- tags: java-26, jdk-27, http3, structured-concurrency, pqc, tls13, ml-kem
- summary: Java 26; HTTP/3 istemci desteği ve Structured Concurrency hattını ileri taşıyor. JDK 27 hedefli JEP 527 ise TLS 1.3 için hybrid post-quantum key exchange’i Java’nın default yönüne yaklaştırıyor.
- why_it_matters: Ağ protokolü ve kripto değişimleri yavaş görünür; fakat platform takımları geç kaldığında uyumluluk, performans ve güvenlik maliyeti yüksek olur.
- java_spring_relevance: Spring tabanlı mikroservisler yoğun HTTP/TLS trafiği üretir; JDK düzeyindeki değişiklikler doğrudan istemci, gateway ve servisler arası iletişimi etkiler.
- actionability: laboratuvarda_degerlendir
- impact_level: orta-yüksek
- opportunities: HTTP/3 ile istemci gecikmesini düşürmek, structured concurrency ile I/O ağırlıklı servis akışlarını sadeleştirmek, PQC hazırlığını erken başlatmak.
- risks: Erken benimsemede uyumluluk, gözlemlenebilirlik ve TLS interop sorunları; farklı vendor JDK’larda farklı davranışlar.
- migration_notes: Üretimde hemen açmak yerine JDK 26 tabanlı performans laboratuvarı ve JDK 27 EA uyumluluk testi daha doğru olur. `jdk.tls.namedGroups` ve özel SSL ayarları kullanan kodlar özellikle gözden geçirilmeli.

### Bulgu 7

- title: Spring 7 ve Boot 4 hattı modülerleşme ile çekirdek yetenekleri sadeleştiriyor
- source: [The Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) ; [HTTP Service Client Nedir – Spring Boot 4.0](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/) ; [API Versiyonlama – Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/)
- author: Karsten Silz, Phil Webb, Sam Brannen, Rossen Stoyanchev, Mark Pollack, Martin Lippert, Michael Minella ; Burak KUTBAY
- date: 13 Nisan 2026, son 6 ay
- category: platform-direction, developer-productivity, architecture
- tags: spring-boot-4, spring-framework-7, modularization, retry, concurrency-limit, api-versioning, http-service-client
- summary: InfoQ’daki ekip röportajı, Boot 4 modülerleşmesinin classpath kontrol maliyetini azaltıp daha küçük artifact ürettiğini; Framework 7’nin retry ve concurrency throttling’i çekirdeğe çektiğini vurguluyor. Burak KUTBAY’ın içerikleri ise API versioning ve HTTP service client gibi yeniliklerin günlük geliştirme pratiğine indiğini gösteriyor.
- why_it_matters: Bunlar gösterişli “feature”lerden çok, kurumsal ekiplerin daha az bağımlılık ve daha net programlama modeliyle çalışmasını sağlayan yapısal değişiklikler.
- java_spring_relevance: Büyük Spring kod tabanlarında bağımlılık yüzeyi, startup davranışı ve ortak HTTP istemci yaklaşımı ciddi bakım maliyeti yaratır.
- actionability: roadmap_planlamasi
- impact_level: orta-yüksek
- opportunities: Daha küçük artifact, daha net HTTP client standardı, daha az harici retry/concurrency altyapısı.
- risks: Geçiş sırasında eski ekip alışkanlıklarıyla yeni çekirdek yeteneklerin çakışması; modülerleşmenin bağımlılık varsayımlarını bozması.
- migration_notes: Boot 4 / Framework 7 geçişi yalnızca derleme uyumu olarak ele alınmamalı. HTTP istemcileri, retry politikaları, API versioning yaklaşımı ve modül bağımlılıkları birlikte gözden geçirilmeli.

### Bulgu 8

- title: Hardwood Beta, veri ağırlıklı JVM servisleri için düşük öncelikli ama kaliteli bir radar maddesi
- source: [Hardwood Reaches Beta: S3, Predicate Push-Down, CLI, and More](https://www.morling.dev/blog/hardwood-reaches-beta-s3-predicate-push-down-cli/)
- author: Gunnar Morling
- date: 2 Nisan 2026
- category: tooling, data, low-priority
- tags: parquet, hardwood, java21, s3, predicate-pushdown, avro, cli
- summary: Gunnar Morling’in yeni Parquet parser’ı Hardwood, beta aşamasında S3 backend, predicate push-down, Avro binding ve CLI ekledi. Minimal bağımlılık ve performans odağı dikkat çekiyor.
- why_it_matters: Bu doğrudan Spring ekosistemi haberi değil; ancak veri gölü, analitik yan işler veya büyük dosya işleme yapan Java servisleri için faydalı bir JVM araç sinyali.
- java_spring_relevance: Çoğu klasik Spring backend ekibi için düşük öncelik; veri/ingestion iş yükü olan ekipler için ise izlemeye değer.
- actionability: izle
- impact_level: düşük
- opportunities: Hadoop bağımlılıklarını azaltmak, Java 21+ veri işleme servislerinde daha hafif Parquet okuma hattı kurmak.
- risks: Beta olgunluğu ve sınırlı üretim geçmişi.
- migration_notes: Sadece laboratuvar/pilot seviyesi değerlendirme mantıklı. Ana veri yolu için erken.

## Sonuç

25 Nisan 2026 itibarıyla en önemli karar sinyali, Spring güvenlik bakımının tekil proje bazında değil; Security, Authorization Server, Framework ve Boot hatlarını birlikte yöneten bir platform disiplini gerektirmesidir. Bunun hemen arkasında, Kafka/Pulsar tarafındaki davranış değişiklikleri ve Spring Modulith’in transaction/event publication olgunlaşması geliyor.

Orta vadeli stratejik sinyal ise daha büyük: Spring 7 / Boot 4 modülerleşiyor, Java platformu HTTP/3 ve structured concurrency ile daha modern servis davranışına yaklaşıyor, TLS tarafında ise post-quantum hazırlık artık soyut bir gelecek konusu olmaktan çıkıyor. Kısa vadede yapılacak en doğru iş; güvenlik yamalarını hızla almak, event-driven davranış farklarını canary ile doğrulamak ve JDK 26/27 laboratuvar çalışmalarını başlatmak.
