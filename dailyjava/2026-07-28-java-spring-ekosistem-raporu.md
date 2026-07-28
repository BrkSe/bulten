# Günlük Java / Spring Ekosistem Raporu

Tarih: 28 Temmuz 2026 Salı  
Tarama zamanı: 28 Temmuz 2026 09:10 TSİ  
Odak: Spring Boot 4.1 etrafında oluşan yeni platform merkezi; Spring Cloud, Spring Data, messaging portföyü ve Java platform operasyonlarının bu yeni hatta göre yeniden hizalanması

Tarama notu: 28 Temmuz 2026 tarihinde [Spring Blog](https://spring.io/blog), [Spring Boot 4.1.0 duyurusu](https://spring.io/blog/2026/06/10/spring-boot-4/), [Spring Boot 4.1 + Spring Batch MongoDB yazısı](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/), [Spring Office Hours: Spring Boot 4.1 with Phil Webb](https://spring.io/blog/2026/07/06/spring-office-hours-podcast-S5E17/), [Spring Cloud 2025.1.2](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/), [Spring Data 2026.0.0 GA](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available/), [Moving beyond Strings in Spring Data](https://spring.io/blog/2026/02/27/moving-beyond-strings-in-spring-data/), [Spring Security 2026.06 releases](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06/), [What’s New in Spring Security 7.1](https://docs.spring.io/spring-security/reference/whats-new.html), [Spring Integration 7.1.0](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/), [Spring AMQP 4.1.0](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/), [Spring Kafka 4.1.0](https://spring.io/blog/2026/06/09/spring-kafka-4/), [Spring Batch 6.0.4](https://spring.io/blog/2026/06/10/spring-batch-6-0-4-and-5-2-6-available-now/), [Spring gRPC 1.1.0](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now/), [OpenJDK JEP 527](https://openjdk.org/jeps/527), [Inside Java JDK 27 PQ TLS heads-up](https://inside.java/2026/05/17/quality-heads-up/), [Inside Java PQ TLS detayı](https://inside.java/2026/02/17/tls-post-quantum-hybrid-key-exchange/), [Oracle Java güvenlik güncelleme ritmi duyurusu](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), [Oracle Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26), [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases), [InfoQ Spring Boot 4.1 analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/), [InfoQ Spring roundup](https://www.infoq.com/news/2026/06/spring-news-roundup-jun08-2026/), [Gunnar Morling blog indeks](https://www.morling.dev/blog/), [Burak KUTBAY blog ana sayfa](https://blog.burakkutbay.com/), [Burak KUTBAY ArchUnit yazısı](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/) ve [Baeldung Java Weekly 654](https://www.baeldung.com/java-weekly-654) kontrol edildi. 28 Temmuz 2026 itibarıyla resmi Spring yüzeyinde aynı gün yeni bir GA dalgası yok; buna rağmen Haziran ortasında çıkan 4.1 nesli artık pasif izleme konusu değil. Bugünün en güçlü sinyali, Spring Boot 4.1 etrafında Data, Cloud, Security ve messaging bileşenlerinin yeterince hizalanmış olması ve ekiplerin artık gerçek pilot, kısmi geçiş veya platform policy kararı verebilecek noktaya gelmesi.

## Öne Çıkan Başlıklar

- Spring Boot 4.1, Spring ekosisteminde artık sadece bir minor sürüm değil; gRPC, outbound SSRF koruması, OpenTelemetry iyileştirmeleri, lazy connection alma ve MongoDB-backed Batch metadata gibi kararları aynı hatta topluyor.
- Spring Cloud 2025.1.2, Spring Boot 4.1 ile çalışan mikroservis ekipleri için fiili başlangıç tabanı haline gelmiş durumda.
- Spring Data 2026.0, string tabanlı property path alışkanlıklarını kırabilecek kadar olgun; refactor güvenliği ve Redis/Mongo/relational tarafında doğrudan üretim faydası veriyor.
- Messaging hattında aynı anda modernleşme ve sertleşme var: Spring gRPC 1.1.0, Spring Integration 7.1.0, Spring AMQP 4.1.0 ve Spring Kafka 4.1.0 birlikte okunduğunda protokol çeşitliliği artarken güven varsayımları daralıyor.
- Spring Security 7.1, MFA ve ağ-bağlamlı yetkilendirmeyi sadeleştiriyor; aynı anda bazı eski destek hatlarının OSS desteği kapanmış durumda.
- Oracle’ın 20 Temmuz 2026 duyurusu, Java güvenlik güncelleme ritminin çeyreklik modelden daha sık bir modele kayacağını gösteriyor; bu, bağımlılık yönetimi kadar release engineering süreçlerini de etkileyecek.

## Kritik Güncellemeler

### 1. Spring Boot 4.1 artık gerçek bir platform pilotu açmak için yeterli yoğunlukta özellik taşıyor

[Spring Boot 4.1.0 duyurusu](https://spring.io/blog/2026/06/10/spring-boot-4/) ve [InfoQ analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/), bu sürümün Spring Boot 4.0 gibi jenerasyon kırılımı değil, fakat 4.0 geçişini anlamlı kılacak operasyonel tamamlayıcılar getirdiğini gösteriyor. En güçlü başlıklar:

- Spring gRPC desteği
- `InetAddressFilter` ile outbound SSRF azaltımı
- OpenTelemetry tarafında yeni kontrol yüzeyleri
- `spring.datasource.connection-fetch=lazy` ile fiziksel bağlantıyı geciktirme
- MongoDB-backed Spring Batch metadata için autoconfiguration

Bu kombinasyonun anlamı şu: 4.1 yükseltmesi sadece “yeni starter” eklemek değil; servis çağrısı, telemetri, veri bağlantısı ve batch altyapısını aynı anda daha belirgin hale getiriyor. Özellikle Boot 4.0’a geçmiş ekipler için 4.1 artık bekleme değil pilot açma sürümü.

### 2. Spring Cloud 2025.1.2 olmadan Boot 4.1 pilotu parçalı kalıyor

[Spring Cloud 2025.1.2 duyurusu](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) açık biçimde bu train’in Spring Boot `4.1.0` uyumluluğunu getirdiğini söylüyor. Aynı sürüm Gateway `5.0.2`, Config `5.0.4`, Function `5.0.3`, Contract `5.0.3`, Stream `5.0.2` ve Kubernetes `5.0.2` gibi modülleri de beraber taşıyor.

Bu, mikroservis filolarında çok kritik. Tek bir servis Boot 4.1’e geçebilir; fakat platformun tamamı Cloud BOM, starter ve override seviyesinde aynı yere gelmemişse sonuç uyumlu bir geçiş değil, parça parça sürüm adacıkları olur.

### 3. Spring Security 7.1, patch değil politika yazdıran bir sürüm

[Spring Security 2026.06 duyurusu](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06/) ve [What’s New in Spring Security 7.1](https://docs.spring.io/spring-security/reference/whats-new.html) iki önemli sinyal veriyor:

- Yeni `InetAddressMatcher`, `ConditionalAuthorizationManager`, programatik MFA koşulları ve WebAuthn odaklı genişlemeler geliyor.
- Spring Security `5.7.x`, `5.8.x`, `6.3.x` ve `6.4.x` OSS destek çizgileri kapanmış durumda.

Bu nedenle 7.1 sadece “yeni feature” değil. Yetkilendirme stratejisini IP/ağ bağlamı, MFA kombinasyonları ve WebAuthn kayıt durumu gibi daha gerçekçi koşullara taşıyabilen ekipler için fırsat; eski hatlarda kalanlar içinse sürdürülebilirlik riski.

### 4. Java güvenlik güncellemesi artık sadece temmuz-ekim-ocak-nisan ritmiyle düşünülmemeli

[Oracle’ın 20 Temmuz 2026 tarihli duyurusu](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), Java tarafında çeyreklik CPU modelinin yanına aylık hedefli CSPU güncellemeleri ekleme niyetini netleştiriyor. Oracle, 18 Ağustos 2026 için aylık bir Java CSPU hedefliyor ve 2027 boyunca birden fazla aylık güncelleme planlandığını söylüyor.

Bu haber uygulama kodundan çok süreçleri etkiliyor. Kendi JDK’sını paketleyen, container imajı basan veya regulasyon gereği patch SLA’si olan ekiplerin test, image promotion ve deploy pencerelerini buna göre sıklaştırması gerekecek.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring 4.1 dalgası artık gerçek bir ekosistem hattı

Boot 4.1, Cloud 2025.1.2, Security 7.1, Data 2026.0, Integration 7.1, Kafka 4.1, AMQP 4.1 ve gRPC 1.1 birlikte okunduğunda, bu sürümler tekil proje release’i gibi değil; aynı anda yükseltilebilecek bir ekosistem şeridi gibi davranıyor. Bu, enterprise ekipler için önemli çünkü “önce çekirdek framework, sonra aylar sonra çevre projeler” bekleme modeli zayıflıyor.

### Trend Kümesi 2: Framework varsayımları daha kısıtlayıcı ve daha güvenli hale geliyor

Bugünün seçili bulgularında ortak bir desen var:

- Boot 4.1 `InetAddressFilter` ile outbound hedefleri kısıtlıyor.
- Security 7.1 ağ-bağlamlı yetkilendirmeyi ilk sınıf vatandaş yapıyor.
- AMQP 4.1 JSON converter tarafında “trust all” davranışını varsayılan olmaktan çıkarıyor.
- Kafka 4.1 header ve delegate cache tarafında suistimal edilmesi kolay yüzeyleri sıkılaştırıyor.

Yani ekosistem genel yönü daha açık: kolay ama geniş varsayımlar yerine explicit trust boundary.

### Trend Kümesi 3: Depolama ve protokol çeşitliliği artık autoconfiguration kalitesine taşınıyor

MongoDB-backed Batch metadata, AMQP 1.0, gRPC istemci/sunucu autoconfiguration, CloudEvents dönüşümleri ve Redis listener endpoint’leri birlikte okunduğunda Spring ekosistemi artık “HTTP + JDBC + klasik broker” üçlüsünün ötesini daha doğal hale getiriyor. Buradaki esas değer, bu çeşitliliğin artık elle wiring gerektirmeden sağlanması.

### Trend Kümesi 4: JDK tarafında operasyonel hazırlık süresi kısalıyor

Oracle’ın daha sık güvenlik güncelleme planı ve JDK 27’nin PQ hybrid TLS özelliği birlikte okunduğunda, Java platformu yükseltmeleri artık sadece LTS geçişlerinde konuşulacak bir konu değil. JDK sürümü, güvenlik posture’u ve release takvimi daha sık birbirine bağlanacak.

## Araçlar ve Kütüphaneler

- `Spring Boot 4.1`: yüksek öncelik. gRPC, observability, SSRF azaltımı, lazy DB connection ve Batch/Mongo senaryolarını bir araya getiriyor.
- `spring-boot-starter-batch-data-mongodb`: yüksek öncelik. Batch metadata için ayrı bir ilişkisel veritabanı taşıma zorunluluğunu azaltıyor.
- `Spring gRPC 1.1.0`: yüksek öncelik. Boot 4.1 autoconfiguration hattına geçtiği için gRPC kullanan ekiplerde maliyeti düşürüyor.
- `Spring Data 2026.0`: orta-yüksek öncelik. Type-safe property path, annotated Redis Pub/Sub, Mongo bulk write ve relational upsert ile veri katmanında refactor güvenliği ve expressiveness artıyor.
- `Spring AMQP 4.1.0`: orta-yüksek öncelik. `spring-amqp-client` ile generic AMQP 1.0 açılımı getiriyor; aynı zamanda JSON güven varsayımını daraltıyor.
- `Spring Integration 7.1.0`: orta öncelik. CloudEvents ve gRPC modülleri mimari esnekliği artırıyor; ama etkisi Integration kullanan ekiplerde belirgin.
- `Spring Kafka 4.1.0`: yüksek öncelik. Kafka ekipleri için esas değer yeni özellikten çok batch listener correctness ve header hardening tarafında.
- `JDK 27 hybrid TLS`: izleme önceliği yüksek. GA öncesi test değeri büyük, fakat üretim aksiyonu için partner sistem ve TLS terminator uyumu görülmeli.

Bugün için Spring dışı yeni OSS sinyaller arasında, resmi 4.1 hattının ürettiği karar değeri kadar güçlü bir aday görünmedi. [Gunnar Morling’in son Hardwood yazıları](https://www.morling.dev/blog/) ve [Burak KUTBAY’ın son ArchUnit içeriği](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/) ilginç; ancak 28 Temmuz 2026 itibarıyla çoğu backend ekip için bugünün ana kararı bunlar değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Boot 4.0 veya 3.5 üzerinde olan ekipler, 4.1’i “tam geçiş” olarak değil hedefli pilot olarak değerlendirmeli. En iyi adaylar: gRPC kullananlar, outbound HTTP güvenliği önemli olanlar, yoğun telemetri ihtiyacı olanlar, batch metadata için ayrı SQL veritabanı taşımaktan bıkanlar.
- Spring Cloud kullanan ekipler, Boot 4.1 denemelerini Cloud `2025.1.2` altına indirmemeli. Aksi halde BOM uyumu ve starter override maliyeti hızla artar.
- Spring Data kullanan ekipler, type-safe property path geçişini tüm kod tabanına zorla yaymak yerine yüksek refactor trafiği olan repository/specification/sort noktalarında seçici başlatmalı.
- Spring Security ekipleri, 7.1’in yeni MFA ve ağ-bağlamlı API’lerini sadece özellik olarak değil authorization policy sadeleştirme fırsatı olarak görmeli.
- Mesajlaşma ekipleri, AMQP/Kafka/Integration sürümlerini özellik listesi diye değil davranış ve güven varsayımı değişikliği diye okumalı.
- Release engineering ekipleri, Java güvenlik güncellemelerinin sıklaşmasına hazırlık için JDK bump süresini, regression bütçesini ve container rebuild zincirini ölçmeye başlamalı.

## Fırsatlar ve Riskler

- Fırsat: Spring Boot 4.1 ile 4.0’ın teorik faydalarını nihayet üretim pilotuna dönüştürmek.
- Risk: Boot 4.1’e tek servis bazında çıkıp Cloud/Data/Security çizgilerini aynı anda hizalamamak.
- Fırsat: Spring Data 2026.0 ile string tabanlı property path kaynaklı refactor kazalarını azaltmak.
- Risk: AMQP 4.1 ve Kafka 4.1 davranış değişikliklerini “sadece patch” gibi görüp test derinliğini eksik bırakmak.
- Fırsat: Batch metadata için MongoDB kullanarak gereksiz JDBC altyapısını azaltmak.
- Risk: Java aylık CSPU modeline geçişte build-test-release hattını hazırlamadan kalmak.
- Fırsat: JDK 27 hybrid TLS ile servisler arası TLS katmanını kod değiştirmeden güçlendirmek.
- Risk: `jdk.tls.namedGroups` veya özel SSL ayarları kullanan uygulamalarda yeni default davranışı fark etmemek.

## İzlenmesi Gereken Konular

- Spring Boot 4.1 sonrası ilk düzeltme dalgasının hangi alanlarda yoğunlaşacağı
- Spring Cloud `2025.1.x` hattında Boot 4.1 uyumunu tamamlayan ek küçük sürümlerin gelip gelmeyeceği
- Spring Security 7.1’in adoption seviyesine göre 6.5.x hattında ne kadar süre daha büyük kurumsal ağırlık kalacağı
- Oracle’ın 18 Ağustos 2026 hedefli ilk Java CSPU’sunun kapsamı ve bunun CI/CD takvimlerine etkisi
- JDK 27 EA build’leriyle servis mesh, TLS terminator, API gateway ve JVM içi HTTP istemci davranışlarında ek uyum sorunları çıkıp çıkmayacağı
- Spring Boot 4.2’de planlanan `spring-boot-amqp` modülünün generic AMQP 1.0 kullanımını ne kadar daha kolaylaştıracağı

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Boot 4.1, sonunda gerçek bir pilot baseline’a dönüştü
- `source`: [Spring Boot 4.1.0 available now](https://spring.io/blog/2026/06/10/spring-boot-4/) | [MongoDB-backed Spring Batch jobs and more in Spring Boot 4.1](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/) | [Spring Office Hours: Spring Boot 4.1 with Phil Webb](https://spring.io/blog/2026/07/06/spring-office-hours-podcast-S5E17/) | [InfoQ Spring Boot 4.1 analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/)
- `author`: Andy Wilkinson | Josh Long | Dan Vega | Karsten Silz
- `date`: 10 Haziran 2026, 21 Haziran 2026, 6 Temmuz 2026; 28 Temmuz 2026’da doğrulandı
- `category`: platform, spring-boot, observability, integration
- `tags`: spring-boot-4-1, grpc, inetaddressfilter, opentelemetry, batch, mongodb, lazy-connection
- `summary`: Spring Boot 4.1; gRPC autoconfiguration, outbound SSRF azaltımı, lazy datasource bağlantısı, OpenTelemetry iyileştirmeleri ve MongoDB-backed Batch metadata ile 4.0 hattını üretime daha yakın hale getiriyor.
- `why_it_matters`: 4.0 büyük geçişti; 4.1 ise o geçişin günlük operasyon ve platform değerini görünür kılan sürüm.
- `java_spring_relevance`: Spring Boot merkezli tüm servis ekipleri için doğrudan önemli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: gRPC’yi first-party starter ile sadeleştirmek; batch metadata için gereksiz SQL bağımlılığını azaltmak; startup ve connection pressure iyileştirmeleri almak
- `risks`: tek başına Boot yükseltip çevre projeleri eski bırakmak; yeni config yüzeylerini test etmeden geçmek
- `migration_notes`: 4.0 üzerindeyseniz 4.1 pilotunu en çok gRPC, batch, outbound HTTP ve yoğun telemetri kullanan servislerde başlatın; `spring.datasource.connection-fetch=lazy` ve yeni OTel davranışlarını hedefli test edin.

### Bulgu 2

- `title`: Spring Cloud 2025.1.2, Boot 4.1 uyumluluğunun fiili tabanı oldu
- `source`: [Spring Cloud 2025.1.2 (aka Oakwood) Has Been Released](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/)
- `author`: Ryan Baxter
- `date`: 11 Haziran 2026; 28 Temmuz 2026’da doğrulandı
- `category`: spring-cloud, release-management, microservices
- `tags`: spring-cloud, oakwood, boot-4-1, bom, gateway, config, function
- `summary`: Spring Cloud `2025.1.2`, Spring Boot `4.1.0` uyumluluğunu getiriyor ve Gateway, Config, Function, Stream, Contract ve Kubernetes modüllerini aynı BOM altında topluyor.
- `why_it_matters`: Boot 4.1’e çıkan Cloud ekipleri için sürüm uyumu artık teori değil; exact train floor kararı gerekiyor.
- `java_spring_relevance`: Spring Cloud ile dağıtık servisler yöneten ekipler için kritik.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: Boot 4.1 pilotunu platform düzeyinde tutarlı hale getirmek; merkezi BOM yönetimini sadeleştirmek
- `risks`: servis bazlı override’larla parçalı uyumluluk üretmek; eski Cloud train’lerinde kalmak
- `migration_notes`: Boot 4.1 denemelerini `2025.1.2` altına indirmeyin; parent POM ve shared BOM’larda exact tag doğrulaması yapın; Gateway/Config/Function override’larını çıkarın.

### Bulgu 3

- `title`: Spring Data 2026.0, veri erişiminde refactor-güvenli API’leri ana akıma taşıyor
- `source`: [Spring Data 2026.0.0 generally available](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available/) | [Moving beyond Strings in Spring Data](https://spring.io/blog/2026/02/27/moving-beyond-strings-in-spring-data/) | [InfoQ Spring roundup](https://www.infoq.com/news/2026/06/spring-news-roundup-jun08-2026/)
- `author`: Mark Paluch | Michael Redlich
- `date`: 27 Şubat 2026 ve 9 Haziran 2026; 28 Temmuz 2026’da doğrulandı
- `category`: data-access, api-design, refactoring-safety
- `tags`: spring-data, property-path, redis-pubsub, mongodb-bulk, upsert, kotlin
- `summary`: Spring Data 2026.0; type-safe property paths, annotated Redis Pub/Sub listeners, çoklu koleksiyon MongoDB bulk write ve relational upsert gibi doğrudan kod bakım maliyeti düşüren yenilikler getiriyor.
- `why_it_matters`: String tabanlı sort/query/property referansları, büyük kod tabanlarında sessiz refactor riskidir. Bu sürüm bunu azaltmak için pratik bir yol sunuyor.
- `java_spring_relevance`: Spring Data JPA, MongoDB, Redis ve Relational kullanan ekiplerde geniş etki alanı var.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: property name typo sınıfını küçültmek; Redis listener modelini sadeleştirmek; bulk/upsert akışlarını daha okunur hale getirmek
- `risks`: tüm kod tabanını gereksiz yere toplu dönüştürmeye çalışmak; string API’leri kötüymüş gibi davranıp dinamik senaryoları zorlaştırmak
- `migration_notes`: type-safe property paths’ı önce yoğun refactor gören `Sort`, `Specification`, `Criteria` ve query helper katmanlarında başlatın; Redis ve MongoDB ekipleri yeni API’leri yan yana PoC ile değerlendirsin.

### Bulgu 4

- `title`: Messaging hattı aynı anda modernleşiyor ve güven varsayımlarını sıkılaştırıyor
- `source`: [Spring gRPC 1.1.0 available now](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now/) | [Spring Integration 7.1.0 Available](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/) | [Spring AMQP 4.1.0 Available](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/) | [Spring Kafka 4.1.0](https://spring.io/blog/2026/06/09/spring-kafka-4/)
- `author`: Dave Syer | Glenn Renfro | Artem Bilan | Soby Chacko
- `date`: 9-10 Haziran 2026; 28 Temmuz 2026’da doğrulandı
- `category`: messaging, integration, protocol-support, hardening
- `tags`: spring-grpc, spring-integration, spring-amqp, spring-kafka, cloudevents, amqp-1-0, rabbitmq-4-3
- `summary`: gRPC 1.1.0 autoconfiguration’ı Boot 4.1’e taşıyor; Integration 7.1 CloudEvents ve gRPC modülleri ekliyor; AMQP 4.1 generic AMQP 1.0 açıyor ve JSON tarafında “trust all” varsayımını kaldırıyor; Kafka 4.1 batch correctness ve header hardening getiriyor.
- `why_it_matters`: Bu değişimler birlikte okunduğunda mesele yeni adapter değil; mesajlaşma katmanının davranış, güven ve operasyon kontratının değişmesi.
- `java_spring_relevance`: Event-driven mimariler, broker entegrasyonları ve gRPC kullanan Spring ekipleri için çok önemli.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: third-party starter ve elle wiring ihtiyacını azaltmak; çok protokollü entegrasyon mimarisini sadeleştirmek; header/deserialization risklerini azaltmak
- `risks`: AMQP trusted packages davranışını fark etmemek; Kafka batch listener düzeltmelerini test etmeden geçirmek; Boot 4 projelerinde `spring-boot-starter-kafka` explicit gerekliliğini atlamak
- `migration_notes`: gRPC kullanan ekipler Boot 4.1 autoconfig migration guide’ını takip etmeli; AMQP tarafında trusted package ayarlarını explicit hale getirmeli; Kafka batch ve retry senaryoları için regresyon testi yazmalı; RabbitMQ 4.3 semantik değişikliklerini DLT/retry akışında doğrulamalı.

### Bulgu 5

- `title`: Spring Security 7.1, koşullu MFA ve ağ-bağlamlı yetkilendirmeyi sadeleştirirken eski hatları geride bırakıyor
- `source`: [Spring Security 2026.06 Releases - Contains CVE Fixes](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06/) | [What’s New in Spring Security 7.1](https://docs.spring.io/spring-security/reference/whats-new.html) | [InfoQ Spring roundup](https://www.infoq.com/news/2026/06/spring-news-roundup-jun08-2026/)
- `author`: Josh Cummings | Spring Security team | Michael Redlich
- `date`: 9 Haziran 2026; 28 Temmuz 2026’da doğrulandı
- `category`: security, authorization, authentication, support-policy
- `tags`: spring-security, 7-1, inetaddressmatcher, mfa, webauthn, support-lines
- `summary`: Spring Security 7.1; `InetAddressMatcher`, programatik MFA koşulları, `ConditionalAuthorizationManager`, WebAuthn odaklı koşullar ve yeni OAuth2 yardımcıları getiriyor. Aynı anda bazı eski hatların OSS desteği kapanmış durumda.
- `why_it_matters`: Güvenlik katmanında yenilik sadece yamalar değil; authorization politikasını daha ifade edilebilir hale getiren API’ler ve destek çizgisi baskısı birlikte geliyor.
- `java_spring_relevance`: Spring Security kullanan her ekip için önemli, özellikle kimlik doğrulama ve risk tabanlı erişim kararları olan sistemlerde.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: IP/ağ bağlamlı kuralları sadeleştirmek; WebAuthn veya MFA rollout’unu daha modüler kılmak; destekli hatta yaklaşmak
- `risks`: eski destek çizgilerinde kalmaya devam etmek; yeni policy API’lerini kullanmadan karmaşık custom filter/refactor borcunu büyütmek
- `migration_notes`: önce mevcut Security hattınızın destek durumunu doğrulayın; sonra `InetAddressMatcher`, `anyOf()` ve koşullu MFA kullanımını birkaç kritik endpoint üzerinde deneyin; destek dışı çizgiler için yükseltme planı açın.

### Bulgu 6

- `title`: Oracle Java güvenlik güncellemelerini aylık ritme yaklaştırıyor
- `source`: [Transitioning Java to more frequent security updates](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) | [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26) | [currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases)
- `author`: Donald Smith | Sharat Chander
- `date`: 17 Mart 2026 ve 20 Temmuz 2026; 28 Temmuz 2026’da doğrulandı
- `category`: jdk, security-updates, release-engineering
- `tags`: oracle-jdk, cpu, cspu, monthly-patching, release-cadence
- `summary`: Oracle, 18 Ağustos 2026 için aylık bir Java CSPU hedefliyor ve 2027’de birden fazla aylık güncelleme planlandığını belirtiyor. Java 26, Eylül 2026’da JDK 27 ile yer değiştirecek mevcut feature release.
- `why_it_matters`: JDK patching artık yalnız altyapı ekibinin arka plan işi değil; uygulama yaşam döngüsü ve dağıtım takvimiyle daha sık iç içe geçecek.
- `java_spring_relevance`: JVM paketleyen, container imajı basan veya kurumsal patch SLA’si olan tüm Spring ekipleri için doğrudan etkili.
- `actionability`: `planli_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: JDK bump süreçlerini otomatikleştirmek; güvenlik baseline’ını daha hızlı kapatmak
- `risks`: mevcut çeyreklik patch sürecinin aylık ritimde yetişmemesi; JDK’yı uygulamayla birlikte ship eden ekiplerde doğrulama kuyruğu oluşması
- `migration_notes`: ağustos öncesi bir deneme koşusu yapın; container/JRE bundle yenileme süresini ölçün; JDK patch regression testlerini daha kısa çevrime taşıyın.

### Bulgu 7

- `title`: JDK 27, servisler arası TLS için kuantum sonrası hibrit anahtar değişimini neredeyse bedava getiriyor
- `source`: [Inside Java heads-up](https://inside.java/2026/05/17/quality-heads-up/) | [Inside Java: Post-Quantum Hybrid Key Exchange for TLS 1.3](https://inside.java/2026/02/17/tls-post-quantum-hybrid-key-exchange/) | [JEP 527](https://openjdk.org/jeps/527)
- `author`: Ana-Maria Mihalceanu | Jamil Nimeh
- `date`: 17 Şubat 2026 ve 17 Mayıs 2026; 28 Temmuz 2026’da doğrulandı
- `category`: jdk, tls, crypto, early-access
- `tags`: jdk27, tls13, post-quantum, ml-kem, jsse, namedgroups
- `summary`: JDK 27, TLS 1.3 için hibrit post-quantum anahtar değişimini SunJSSE içinde getiriyor. Standart `javax.net.ssl` API’lerini kullanan uygulamalar, `namedGroups` override etmiyorsa bunu varsayılan olarak kazanabiliyor.
- `why_it_matters`: Servisler arası TLS güvenliğinde önemli bir iyileştirme, uygulama mantığını değiştirmeden elde edilebiliyor; fakat özel TLS ayarı yapan ekiplerin bunu test etmesi gerekiyor.
- `java_spring_relevance`: Spring MVC, WebFlux, WebClient, RestClient, gateway ve broker bağlantılarında JDK TLS katmanına güvenen tüm ekipleri ilgilendiriyor.
- `actionability`: `izle_ve_pilotla`
- `impact_level`: `orta-yüksek`
- `opportunities`: harvest-now-decrypt-later riskine karşı daha güçlü varsayılan elde etmek; JDK 27 EA testlerini anlamlı hale getirmek
- `risks`: özel `jdk.tls.namedGroups` ayarları veya ara katman uyumsuzluğu; servis mesh veya TLS terminator’ların hibrit group’ları beklenmedik biçimde ele alması
- `migration_notes`: JDK 27 EA ile staging test açın; custom `SSLParameters::setNamedGroups` ve sistem property override’larını bulun; partner sistemler ve L7/L4 terminator’lar ile handshake uyumunu doğrulayın.

## Sonuç

28 Temmuz 2026 için Java/Spring tarafındaki en güçlü sinyal, yeni bir tekil duyurudan çok Haziran ortasında çıkan 4.1 dalgasının artık üretim kararı üretecek kadar olgunlaşmış olması. Spring Boot 4.1, Spring Cloud 2025.1.2, Spring Data 2026.0, Spring Security 7.1 ve messaging hattı birlikte okunduğunda “bekleyelim” demek gittikçe daha zayıf bir pozisyon oluyor; asıl doğru soru, hangi servis veya platform parçasıyla kontrollü pilot açılacağı.

JDK tarafında ise iki ayrı hazırlık gerekiyor: kısa vadede Oracle’ın daha sık güvenlik güncelleme ritmine release sürecini alıştırmak, orta vadede JDK 27’nin PQ TLS gibi varsayılan güvenlik iyileştirmelerini özel TLS ayarlarıyla kullanan sistemlerde önceden test etmek. Bugün en yüksek değerli iş, Boot 4.1/Cloud 2025.1.2 uyumlu aday servisleri seçmek ve JDK patch/JDK 27 EA doğrulama hattını ayrı backlog kalemleri olarak açmak.
