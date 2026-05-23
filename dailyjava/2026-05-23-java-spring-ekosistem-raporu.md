# Günlük Java / Spring Ekosistem Raporu

Tarih: 23 Mayıs 2026  
Tarama zamanı: 23 Mayıs 2026 09:05 TSİ  
Odak: Spring Boot 4 portföy baselini, Spring Security 7 yetenek seti, Spring Cloud interface client yönü, Spring Data'nın compile-time veri erişim çizgisi ve JDK 27 structured concurrency

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring release highlights](https://spring.io/projects/release-highlights/), [Spring release/advisory sayfaları](https://spring.io/security), [Spring Security 7 "What's New"](https://docs.spring.io/spring-security/reference/whats-new.html), [OpenJDK mail arşivi ve draft API dokümanları](https://www.mail-archive.com/core-libs-dev%40openjdk.org/msg70964.html), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/the-arrival-of-java-26), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’un güncel yazar sayfası](https://spring.io/authors/joshlong/), [Gunnar Morling’in blogu](https://www.morling.dev/blog/), ilgili GitHub/release kaynakları ve [Burak KUTBAY’ın blogu](https://blog.burakkutbay.com/) tarandı. Bugün karar kalitesini en çok etkileyen sinyaller, tekil blog yazılarından değil resmi release highlights, referans dokümantasyonu ve OpenJDK/JDK 27 hazırlık notlarından geldi. Josh Long, Baeldung, Gunnar Morling ve Burak KUTBAY tarafında faydalı ancak bugünkü mimari/roadmap kararını tek başına değiştirecek yeni bir kırılım görünmedi; Oracle Java Blog tarafında da Spring ekipleri için yeni bir prod-kırıcı hareketten çok mevcut Java 26/27 çizgisinin kurumsal çerçevesi öne çıktı.

## Öne Çıkan Başlıklar

- [Spring Boot 4 release train highlights](https://spring.io/projects/release-highlights/) artık sadece yeni feature listesi değil; Jakarta EE 11, JSpecify null-safety, Jackson 3, `spring-core` retry ve GraalVM 25 metadatası üzerinden kurumsal Java baseline'ını yeniden tanımlıyor.
- [Spring Security 7'nin yenilikleri](https://docs.spring.io/spring-security/reference/whats-new.html), güvenliği "starter ekledik bitti" çizgisinden çıkarıp MFA, modüler güvenlik konfigürasyonu, Password4j tabanlı encoder'lar ve HTTP Service Clients için OAuth2 desteği eksenine taşıyor.
- [Spring Cloud 2025.1 / Oakwood](https://spring.io/projects/release-highlights/) tarafında Interface Clients, `lb://` tabanlı servis adresleme, built-in Circuit Breaker ve Gateway API versioning predicate birleşince servisler arası HTTP iletişimi daha deklaratif hale geliyor.
- [Spring Data release highlights](https://spring.io/projects/release-highlights/) ile repository AOT işleme varsayılan oluyor; vektör arama, JPQL tabanlı derived query üretimi ve [2026.0.0-RC1](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/) eklemeleri veri erişim katmanını daha compile-time ve daha operasyonel hale getiriyor.
- [JEP 533 / Structured Concurrency](https://www.mail-archive.com/core-libs-dev%40openjdk.org/msg70964.html) JDK 27 için entegre edildi; API hâlâ preview ama Java sunucu tarafı eşzamanlılık modelinin kalıcı yönü artık daha net.

## Kritik Güncellemeler

### 1. Spring Boot 4 portföyü, dependency upgrade değil platform baseline değişimi olarak ele alınmalı

[Spring release highlights](https://spring.io/projects/release-highlights/) sayfası bugün en güçlü resmi sinyallerden birini veriyor:

- Tüm portföy [Jakarta EE 11](https://spring.io/projects/release-highlights/) çizgisine taşınmış durumda.
- JSpecify null-safety neredeyse bütün yüzeyde standart hale geliyor.
- Jackson 3, portföy varsayılanı haline geliyor; Jackson 2 destekleri geri çekilen geçiş moduna indirgeniyor.
- `spring-retry` bağımlılığı yerini `spring-core` içindeki yeni retry API'sine bırakıyor; bu çizgi AMQP, Kafka, Integration ve Batch'e kadar taşınıyor.
- GraalVM 25'in unified reachability metadata formatı native image tarafında resmi baseline'a dönüyor.

Bu neden kritik:

- Java/Spring ekiplerinin bağımlılık matrisi artık yalnız `spring-boot-starter-*` seviyesinde değil; `jakarta.*`, Jackson modülleri, null-safety denetleyicileri ve native metadata araç zinciri birlikte ele alınmalı.
- Kurum içinde yıllardır taşınan retry abstraction, custom serialization config ve nullability eksiklikleri bazı yerlerde sadeleşirken bazı yerlerde çatışma yaratabilir.
- Jackson 2'ye sıkı bağlı mesajlaşma, cache, REST docs veya custom `ObjectMapper` eklentileri sessiz migration maliyeti çıkarabilir.

Kısa yorum: Boot 4 denemelerini "uygulama ayağa kalkıyor mu?" seviyesinde bırakmak teknik borcu ileri iter. Doğru yaklaşım, pre-flight uyumluluk envanteri çıkarmaktır.

### 2. Spring Security 7, güvenlik yüzeyini daha modüler ve daha ürünleştirilebilir hale getiriyor

[What’s New in Spring Security 7.0](https://docs.spring.io/spring-security/reference/whats-new.html) ve [2026.04 Security releases](https://spring.io/blog/2026/04/21/spring-security-releases) birlikte okunduğunda şu tablo netleşiyor:

- Multi-Factor Authentication artık çekirdek feature set'in parçası.
- Servlet ve WebFlux için modüler güvenlik konfigürasyonu resmi olarak destekleniyor.
- Password4j tabanlı Argon2, BCrypt, SCrypt, PBKDF2 ve Balloon Hashing encoder seçenekleri geliyor.
- OAuth2 desteği, HTTP Service Clients seviyesine kadar taşınıyor.
- PKCE, Authorization Server tarafında varsayılan hale geliyor.
- `authorizeRequests` ve eski DSL parçaları fiilen geride kalıyor; lambda DSL ve yeni authorization yaklaşımı esas çizgi oluyor.

Bu neden kritik:

- Kurumsal ekipler güvenliği artık tek büyük `SecurityConfig` dosyasında toplamak yerine modül bazlı bileşenlere ayırabilir.
- MFA ve modern encoder seçenekleri, zero-trust veya yüksek uyumluluk gerektiren ürünlerde dış katman yerine doğrudan framework içi standarda taşınabilir.
- HTTP Service Clients ile OAuth2 entegrasyonu, servisler arası çağrılarda custom token plumbing kodlarını azaltabilir.

Kısa yorum: Security 7 geçişi yalnız CVE kapama işi değil; uygulama güvenlik mimarisini sadeleştirme fırsatı.

### 3. Spring Cloud 2025.1, Interface Clients etrafında servisler arası iletişim modelini yeniden şekillendiriyor

[Spring Cloud release highlights](https://spring.io/projects/release-highlights/) ve [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/) üç somut değişimi öne çıkarıyor:

- Spring Cloud Gateway 5.0, Spring Framework 7'nin API versioning modeline bağlanan Server WebFlux API Versioning Predicate getiriyor.
- Spring Cloud Commons 5.0, annotated Interface Clients için built-in Circuit Breaker desteği ekliyor.
- Aynı yüzeyde `lb://` scheme desteği ile servis discovery ve HTTP client konfigürasyonu aynı deklaratif modele yaklaşıyor.

Ek olarak, release highlights tarafında Spring Cloud Stream 5.0 için consumer priority ordering sinyali de görünüyor; bu özellik özellikle aynı binding üzerinde önceliklendirme isteyen ekipler için pratik değer taşıyabilir.

Bu neden kritik:

- OpenFeign, `RestTemplate` sarmalları ve custom discovery/retry kombinasyonları olan ekiplerde sadeleşme fırsatı oluşuyor.
- API versioning ile gateway yönlendirmesi aynı modelde buluştuğunda, version routing politikaları uygulama kodundan gateway kontratına daha net taşınabilir.
- Circuit breaker ve load balancer davranışının interface client düzeyinde resmileşmesi, platform ekiplerinin kendi "ortak istemci SDK" katmanlarını sorgulamasına yol açabilir.

Kısa yorum: Buradaki kalıcı sinyal, servisler arası HTTP'nin framework içinde daha deklaratif ve daha yönetişilebilir hale gelmesi.

### 4. Spring Data, veri erişim katmanını daha compile-time, daha hızlı ve daha AOT-friendly yapıyor

[Spring Data release highlights](https://spring.io/projects/release-highlights/) ve [Spring Data 2026.0.0-RC1 duyurusu](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/) birlikte okunduğunda, bu alanın yalnız CRUD kolaylığı olmadığını tekrar görüyoruz:

- Repository query method'ları build time'da işleniyor; AOT repository modeli varsayılan çizgi oluyor.
- Vektör benzerlik araması için repository method convention'ları resmi hale geliyor.
- Derived query üretiminin Criteria API yerine JPQL string üzerinden yapılması, özellikle Hibernate query cache ile throughput artışı hedefliyor.
- 2026.0 RC1 tarafında relational upsert, `RedisMessageSendingTemplate` ve `RedisCache.resetCaches()` iyileştirmeleri prod kullanımını doğrudan etkileyen eklemeler.

Bu neden kritik:

- Veri erişim katmanı compile-time'a kaydıkça startup, native image ve refactor güvenliği artıyor; ama aynı anda eski reflection ağırlıklı beklentiler kırılabiliyor.
- Vektör arama resmi repository yüzeyine taşındığında, "AI/semantic search" kullanan ekipler için custom query helper katmanları azalabilir.
- Relational upsert ve Redis tarafındaki iyileştirmeler, özellikle event-driven ve cache-heavy uygulamalarda daha temiz domain kodu üretebilir.

Kısa yorum: Spring Data bugün yalnız "kolay repository" değil; veri erişim performansı, native uyumluluk ve AI-adjacent query yüzeyinin taşıyıcısı haline geliyor.

### 5. JDK 27 Structured Concurrency yedinci preview, artık mimari yönü belirgin bir yatırım

[OpenJDK entegrasyon mail'i](https://www.mail-archive.com/core-libs-dev%40openjdk.org/msg70964.html), [yeni aday JEP duyurusu](https://www.mail-archive.com/loom-dev%40openjdk.org/msg00666.html), [JDK 27 draft `StructuredTaskScope` API dokümanı](https://cr.openjdk.org/~alanb/sc-jdk27/api/java.base/java/util/concurrent/StructuredTaskScope.html) ve [Inside Java hedefleme notu](https://inside.java/2026/05/11/jep533-target-jdk27/) birlikte şu noktaları doğruluyor:

- JEP 533, JDK 27 hattına entegre edildi.
- `StructuredTaskScope` artık sonuç tipi, `join()` dönüş tipi ve `join()` tarafından atılan exception tipi üzerinden daha açık biçimde modelleniyor.
- `open()` aileleri, thread factory, timeout ve scope konfigürasyonunu daha sistematik hale getiriyor.
- Timeout, cancellation ve exception propagation semantiği standardize edilmeye devam ediyor.

Bu neden kritik:

- Virtual thread kullanan veya kullanmayı planlayan backend ekipleri için structured concurrency artık yalnız deneysel fikir değil, somut bir API şekline kavuşuyor.
- Özellikle "aynı isteğin parçası olan paralel alt çağrılar" yapan servislerde cancellation ve exception propagation disiplini daha okunabilir hale gelebilir.
- Ancak hâlâ preview olduğu için, doğrudan ürün public API'sine bağlamak erken olur.

Kısa yorum: JDK 27 structured concurrency'yi prod default'u yapma zamanı henüz gelmedi; fakat internal concurrency abstraction'larını bu modele yaklaştırma zamanı gelmiş durumda.

## Trendler ve Sinyaller

### Trend Kümesi 1: Type-safety ve compile-time davranış, artık ikinci sınıf optimizasyon değil

- JSpecify null-safety portföy geneline yayılıyor.
- Spring Data repository işleme build-time tarafına kayıyor.
- Spring GraphQL ve HATEOAS katmanları Jackson 3 ve AOT standardına hizalanıyor.
- JDK structured concurrency tarafında exception tipi ve scope konfigürasyonu daha açık hale geliyor.

Bu kümenin kalıcı değeri yüksek. Çünkü hepsi "geliştirici ergonomisi" diye başlayan ama doğrudan prod güvenilirliğine uzanan değişiklikler.

### Trend Kümesi 2: Dağıtık sistem sözleşmeleri framework içinde resmileşiyor

- API versioning artık sadece REST controller detayı değil; Spring Framework + Gateway birlikte ele alınıyor.
- Interface Clients, Circuit Breaker ve `lb://` ile servis discovery daha deklaratif oluyor.
- Security 7, OAuth2 ve HTTP Service Clients'i aynı güvenlik modeline daha sıkı bağlıyor.

Bu çizgi, orta vadede custom platform wrapper'larının bir kısmını gereksiz hale getirebilir.

### Trend Kümesi 3: Side library değil, çekirdek platform yeteneği

- `spring-retry` yerine `spring-core` retry.
- Authorization Server'ın Security ile daha sıkı bütünleşmesi.
- Native metadata, nullability, retry, versioning ve authz/authn konularının çekirdeğe yaklaşması.

Kısa vadeli gürültü değil; uzun vadeli çatı değişimi.

### Gürültü mü, kalıcı mı?

- Kalıcı mühendislik değeri yüksek: Jackson 3/JSpecify/AOT yönü, Security 7 feature set'i, Interface Clients + Gateway versioning, Spring Data compile-time yönü, structured concurrency standardizasyonu.
- İzle ve pilotla: Spring GraphQL 2.0 hizası, Pulsar 2.0.5 ekosistemi, consumer priority gibi daha seçici adoption başlıkları.
- Düşük öncelik: Spring Shell 4.0.2 ve Oracle Java tarafındaki backend dışı kurumsal paketleme duyuruları.

## Araçlar ve Kütüphaneler

- [Spring Security 7.0.5 / 7.1.0-RC1](https://docs.spring.io/spring-security/reference/index.html): Yüksek öncelik. Özellikle MFA, modüler konfigürasyon ve HTTP Service Clients güvenliği için.
- [Spring Cloud 2025.1.1](https://spring.io/projects/spring-cloud/): Yüksek öncelik. Interface Clients, Gateway versioning ve servis discovery/resilience standardizasyonu için.
- [Spring Data 2026.0.0-RC1](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/): Yüksek öncelik. Upsert, Redis iyileştirmeleri ve 4.1 RC1 veri erişim çizgisi için.
- [Spring GraphQL 2.0.3](https://spring.io/projects/spring-graphql/): Orta öncelik. GraphQL Java 25 ve Security 7 hizası anlamlı.
- [Spring for Apache Pulsar 2.0.5](https://spring.io/projects/spring-pulsar/): Orta-düşük öncelik. Kafka dışında Pulsar kullanan ekipler için değerli; genel Spring ekipleri için seçici.
- [spring-boot-starter-restclient](https://www.baeldung.com/spring-boot-restclient): Orta öncelik. Baeldung tarafındaki güncel rehber, Boot 4 HTTP client adoption'ının pratikte hızlandığını gösteriyor; ancak bugünün ana sinyali topluluk makalesi değil resmi Boot 4 yönü.
- [Spring Shell 4.0.2](https://spring.io/blog/2026/04/24/spring-shell-4-0-2-is-out/): Düşük öncelik. CLI veya operasyonel shell araçları geliştirmiyorsanız bugünün ana gündemi değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Boot 4 hazırlığı yapıyorsanız ilk işiniz `jakarta.*`, Jackson 2 kullanımı, `spring-retry` bağımlılıkları ve native metadata eklentilerini envanterlemek olmalı.
- Security 7 geçişinde eski DSL'leri yalnız derleme hatası düzeyinde ele almayın; modüler güvenlik yapısına ve MFA gereksinimlerine göre tasarımı yeniden düşünün.
- OpenFeign veya custom REST client katmanı olan ekipler, Spring Interface Clients + Circuit Breaker + `lb://` modelini ciddi biçimde karşılaştırmalı.
- Spring Data kullanan servislerde build-time repository üretimi, derived query davranışı ve vector search kabiliyetleri için küçük ama gerçekçi benchmark'lar çıkarın.
- JDK 27 structured concurrency ilgilendiriyorsa, bunu önce internal helper library veya yeni yazılacak arka plan orchestration bileşenlerinde deneyin; preview API'yi doğrudan dış kontrata bağlamayın.
- GraphQL kullanan ekipler için Security 7 ve GraphQL Java 25 hizası anlamlı; REST ekipleri için ise bu başlık bugün orta öncelik.

## Fırsatlar ve Riskler

- Fırsat: Jackson 3 ve JSpecify ile daha tip güvenli, daha AOT-friendly ve daha tutarlı uygulama yüzeyleri kurulabilir.
- Fırsat: Security 7 ve Spring Cloud 2025.1 sayesinde kurum içi ortak güvenlik/istemci kütüphanelerinin bir kısmı sadeleşebilir.
- Fırsat: Spring Data'nın compile-time yönü startup, native image ve query throughput tarafında gerçek operasyonel kazanç yaratabilir.
- Fırsat: Structured concurrency, özellikle çoklu downstream çağrı yapan servislerde cancellation ve failure propagation karmaşasını azaltabilir.
- Risk: Boot 4 geçişi sıradan dependency bump gibi yönetilirse Jackson 3, Jakarta 11 ve retry değişimleri sessiz prod farkları yaratır.
- Risk: Security 7'de eski DSL ve grant beklentileri sürüyorsa migration beklenenden daha pahalı olabilir.
- Risk: Interface Clients'e hızlı geçiş yapıp mevcut observability, fallback ve timeout politikalarını netleştirmezseniz davranış uyumsuzlukları oluşur.
- Risk: Structured concurrency preview olduğu için erken standartlaştırma, JDK 27 sonrası API değişim maliyeti doğurabilir.

## İzlenmesi Gereken Konular

- [Spring Boot 4.1 release penceresi](https://spring.io/blog/2026/05/11/may-train-shift) 1-5 Haziran 2026 aralığına kaymış durumda; final Spring Data 2026.0 ve ilgili portföy entegrasyonları bu pencereyle birlikte netleşecek.
- Spring Security 7.1 GA sürecinde RC özelliklerinin ne kadarının sabit kaldığı takip edilmeli.
- Spring Cloud tarafında Interface Clients'in OpenFeign benzeri mevcut kalıpları ne ölçüde geride bırakacağı izlenmeli.
- Jackson 2'nin portföy genelinde ne hızda geri çekileceği, özellikle messaging ve serialization-heavy servisler için kritik.
- JDK 27 structured concurrency'nin preview'dan çıkış hızı ve buna bağlı kütüphane ekosistemi adoption'ı izlenmeli.
- GraphQL veya Pulsar kullanan ekipler, Boot 4/Framework 7 hizasının ek araç zinciri maliyetini erken ölçmeli.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot 4 portföyü, type-safe ve AOT-friendly bir kurumsal baseline'a dönüşüyor
- source: [Spring Release Highlights](https://spring.io/projects/release-highlights/)
- author: Spring team
- date: tarih belirtilmemiş; 23 Mayıs 2026 taramasında doğrulandı
- category: platform-baseline, migration, runtime-governance
- tags: spring-boot-4, jakarta-ee-11, jspecify, jackson-3, spring-core-retry, graalvm
- summary: Spring portföyü Jakarta EE 11, JSpecify null-safety, Jackson 3 varsayılanı, `spring-core` retry ve GraalVM 25 metadata formatı etrafında yeni bir platform standardına oturuyor.
- why_it_matters: Bu değişim sadece framework API'lerini değil, kurum içi starter'ları, serialization zincirini, native build hattını ve hata yönetimi yaklaşımını birlikte etkiler.
- java_spring_relevance: Enterprise Spring Boot ekipleri için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: çok-yüksek
- opportunities: Ortak altyapı katmanını sadeleştirmek, native image ve startup tarafında kazanım almak, null-safety disiplinini güçlendirmek.
- risks: Jackson 2 bağımlılıkları, `spring-retry` kullanımı ve `javax`/`jakarta` geçiş kalıntıları sessiz davranış farkı çıkarabilir.
- migration_notes: Boot 4 öncesi bağımlılık envanteri, serializer testi, retry interception davranışı ve native metadata denemesi yapılmalı.

### Bulgu 2

- title: Spring Security 7, güvenlik yeteneklerini modüler ve ürünleştirilebilir hale getiriyor
- source: [What’s New in Spring Security 7.0](https://docs.spring.io/spring-security/reference/whats-new.html), [Spring Security 2026.04 Releases](https://spring.io/blog/2026/04/21/spring-security-releases)
- author: Spring Security team, Josh Cummings
- date: 21 Nisan 2026 ve güncel 7.0.5 dokümantasyonu
- category: security, authentication, authorization
- tags: spring-security-7, mfa, modular-config, password4j, oauth2, http-service-clients, pkce
- summary: Security 7; MFA, modular config, modern password encoder'lar, HTTP Service Clients için OAuth2 desteği ve PKCE default davranışı ile güvenlik yüzeyini genişletiyor.
- why_it_matters: Güvenlik kodu çoğu kurumda dağınık ve tekrar içerir; bu sürüm, birçok custom çözümü resmi feature set içine çekiyor.
- java_spring_relevance: Spring Security kullanan tüm ekipler için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Güvenlik konfigürasyonunu daha küçük modüllere bölmek, MFA'yı resmi mekanizmalarla kurgulamak, servisler arası OAuth2 akışını sadeleştirmek.
- risks: Eski DSL, password grant ve dağınık custom authz kodları migration maliyetini artırabilir.
- migration_notes: `authorizeRequests` ve benzeri eski DSL kullanımlarını tarayın; MFA, PKCE ve HTTP Service Client güvenliği için küçük pilotlar açın.

### Bulgu 3

- title: Spring Cloud 2025.1, servisler arası iletişimi Interface Clients merkezli yeniden tanımlıyor
- source: [Spring Release Highlights](https://spring.io/projects/release-highlights/), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/)
- author: Spring team
- date: tarih belirtilmemiş; 23 Mayıs 2026 taramasında doğrulandı
- category: microservices, service-communication, resilience
- tags: spring-cloud-2025.1, interface-clients, circuit-breaker, load-balancer, gateway, api-versioning, spring-cloud-stream
- summary: API versioning predicate, built-in Circuit Breaker, `lb://` scheme ve consumer priority sinyalleri Spring Cloud'un HTTP/messaging sözleşmelerini daha deklaratif hale getiriyor.
- why_it_matters: OpenFeign, custom discovery ve client wrapper yığınları olan ekipler için yeni sadeleşme ve standardizasyon alanı açılıyor.
- java_spring_relevance: Microservice ve distributed systems odaklı Spring ekipleri için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: İstemci tarafını sadeleştirmek, gateway ile API versiyonlamayı tek modelde toplamak, servis discovery davranışını standardize etmek.
- risks: Mevcut client stack'leriyle davranış farkı, timeout/fallback gözlemlenebilirliğinde geçiş riski.
- migration_notes: OpenFeign veya custom client kullanımını bir servis grubunda Interface Clients ile kıyaslayın; gateway versiyonlama politikasını ayrı test edin.

### Bulgu 4

- title: Spring Data, repository katmanını compile-time ve performans odaklı bir çizgiye taşıyor
- source: [Spring Release Highlights](https://spring.io/projects/release-highlights/), [Spring Data 2026.0.0-RC1 enters release candidate phase](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/)
- author: Spring team, Mark Paluch
- date: 17 Nisan 2026 ve güncel release highlights doğrulaması
- category: data-access, performance, aot
- tags: spring-data, aot-repositories, vector-search, jpql, upsert, redis, native
- summary: AOT repository işleme varsayılan oluyor; vector search method convention'ları, JPQL tabanlı derived query üretimi ve 2026.0 RC1 upsert/Redis eklemeleri veri erişim katmanını daha güçlü hale getiriyor.
- why_it_matters: Veri erişim kodu, çoğu Java servisinde latency, startup ve refactor güvenliği açısından ana belirleyicilerden biridir.
- java_spring_relevance: Spring Data JPA/Relational/Redis/MongoDB kullanan ekipler için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Daha iyi startup/natif uyumluluk, daha hızlı derived query'ler, daha doğal upsert ve cache/message entegrasyonları.
- risks: Build-time repository işleme ve query semantiği eski beklentilerle çakışabilir; vector search tarafı yanlış önceliklendirilirse gereksiz karmaşa getirir.
- migration_notes: Kritik repository'lerde query sonuçlarını ve performansını regresyon testine alın; Redis ve upsert akışlarını ayrı POC ile doğrulayın.

### Bulgu 5

- title: JDK 27 Structured Concurrency, preview olmasına rağmen artık gerçek mimari yön veriyor
- source: [OpenJDK integration mail](https://www.mail-archive.com/core-libs-dev%40openjdk.org/msg70964.html), [New candidate JEP 533](https://www.mail-archive.com/loom-dev%40openjdk.org/msg00666.html), [StructuredTaskScope draft API](https://cr.openjdk.org/~alanb/sc-jdk27/api/java.base/java/util/concurrent/StructuredTaskScope.html), [Inside Java target note](https://inside.java/2026/05/11/jep533-target-jdk27/)
- author: Alan Bateman, Mark Reinhold, OpenJDK Project Loom contributors
- date: 14 Nisan 2026, 6 Mayıs 2026 ve 11 Mayıs 2026
- category: jdk, concurrency, preview-api
- tags: jdk27, structured-concurrency, virtual-threads, structuredtaskscope, cancellation, observability
- summary: JEP 533 JDK 27 hattına entegre edildi; `StructuredTaskScope` sonuç, exception ve konfigürasyon modelini daha açık hale getirerek cancellation/exception propagation disiplinini olgunlaştırıyor.
- why_it_matters: Çoklu downstream çağrılar, paralel veri toplama ve orchestrasyon işleri yapan Java servislerinde eşzamanlılık ergonomisi doğrudan güvenilirlik sorunudur.
- java_spring_relevance: Virtual thread veya yeni concurrency modelleriyle ilgilenen Java backend ekipleri için yüksek.
- actionability: izle_ve_pilotla
- impact_level: orta-yüksek
- opportunities: Daha okunabilir parallel orchestration, daha net timeout/cancellation semantiği ve daha iyi observability.
- risks: Preview API olduğu için doğrudan ürün kontratına bağlanırsa JDK 27 sonrası uyumsuzluk doğabilir.
- migration_notes: Önce internal helper katmanlarında veya yeni servislerde deneyin; public library API'lerini bu preview yüzeye doğrudan bağlamayın.

### Bulgu 6

- title: Spring GraphQL 2.0, GraphQL yüzeyini Spring 7 / Security 7 baselinine tam hizalıyor
- source: [Spring Release Highlights](https://spring.io/projects/release-highlights/), [Spring for GraphQL proje sayfası](https://spring.io/projects/spring-graphql/)
- author: Spring team
- date: tarih belirtilmemiş; 23 Mayıs 2026 taramasında doğrulandı
- category: api-contract, graphql, security-alignment
- tags: spring-graphql-2.0, graphql-java-25, graphiql, security-7, null-safety, reactive
- summary: Spring GraphQL 2.0, GraphQL Java 25.0 ve GraphiQL 5.2.1'e yükselirken Spring Framework 7 ve Spring Security 7 ile tam hizaya geliyor.
- why_it_matters: GraphQL kullanan Spring ekipleri için bu, GraphQL katmanının "ayrı dünya" olmaktan çıkıp ana platform baseline'ına bağlanması demek.
- java_spring_relevance: GraphQL kullanan ekipler için yüksek; sadece REST ekipleri için orta/düşük.
- actionability: izle_ve_pilotla
- impact_level: orta
- opportunities: Security, authorization ve null-safety davranışını REST ve GraphQL arasında daha tutarlı hale getirmek.
- risks: GraphQL interceptor, authz ve schema-execution davranışlarında sürüm hizası kaynaklı beklenmeyen farklar.
- migration_notes: GraphQL endpoint security, method authorization ve client tooling uyumluluğunu Boot 4 laboratuvarında ayrı test edin.

## Sonuç

23 Mayıs 2026 itibarıyla bugünün en güçlü sinyali, Spring ekosisteminin birkaç ayrı projede yeni özellik çıkarmasından daha büyük: Boot 4 etrafında type-safety, AOT, güvenlik, istemci iletişimi ve veri erişimi aynı anda daha resmi ve daha çekirdek hale geliyor. Bu, Java/Spring ekipleri için "yeni sürüm denemesi" değil, platform standardını yeniden yazma işi.

En doğru kısa vadeli aksiyon seti şudur: Boot 4 için Jackson/Jakarta/retry envanteri çıkarın; Security 7 ve Interface Clients için hedefli POC açın; Spring Data compile-time etkilerini gerçek repository'lerle ölçün; structured concurrency tarafını ise yalnız internal deney alanlarında takip edin. GraphQL ve Pulsar gibi seçici alanlar bugün herkese zorunlu değil, ama ilgili ekipler için erken hizalanma maliyetini düşürür.
