# Günlük Java / Spring Ekosistem Raporu

Tarih: 16 Temmuz 2026  
Tarama zamanı: 16 Temmuz 2026 09:06 TSİ  
Odak: sessiz release günlerinde hangi migration ve platform kararlarının gerçekten backlog'a girmesi gerektiğini ayırmak

Tarama notu: Bugün [Spring Blog](https://spring.io/blog.atom), [Spring Security advisories feed](https://spring.io/security.atom), [Spring Release Highlights](https://spring.io/projects/release-highlights/), [Spring Data 2026.0 release notes](https://github.com/spring-projects/spring-data-commons/wiki/Spring-Data-2026.0-Release-Notes), [Spring Integration 7.1 "What's New"](https://docs.spring.io/spring-integration/reference/7.1.0/whats-new.html), [Spring Session 4.1 "What's New"](https://docs.spring.io/spring-session/reference/4.1/whats-new.html), [Spring Boot upgrading guide](https://docs.spring.io/spring-boot/upgrading.html), [Spring Boot deprecated application properties appendix](https://docs.spring.io/spring-boot/appendix/deprecated-application-properties/index.html), [Inside Java feed](https://inside.java/feed.xml), [dev.java/news](https://dev.java/news/), [OpenJDK JDK 27 project page](https://openjdk.org/projects/jdk/27/), [JEP 527](https://openjdk.org/jeps/527), [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases), [This Week in Spring - July 14th, 2026](https://spring.io/blog/2026/07/14/this-week-in-spring-july-14-2026), [A Bootiful Podcast: Moritz Halbritter](https://spring.io/blog/2026/07/09/a-bootiful-podcast-moritz-halbritter), [Loic Mathieu - Java 27: What's new?](https://www.loicmathieu.fr/wordpress/informatique/java-27-whats-new/), [Gunnar Morling feed'i](https://www.morling.dev/index.xml), [Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/), [InfoQ Java news](https://www.infoq.com/java/news/) ve [Burak KUTBAY blog feed'i](https://blog.burakkutbay.com/feed/) kontrol edildi. [Baeldung](https://www.baeldung.com/) ve Oracle Java Blog HTML yüzeyi bu ortamdan `403` verdiği için yalnız erişilebilen resmi/düşük-belirsizlikli kaynaklar kullanıldı. 16 Temmuz 2026 itibarıyla resmi Spring yüzeyinde 14 Temmuz sonrası yeni release yazısı, 12 Haziran 2026 sonrası da yeni security advisory görünmüyor; bu yüzden bugünün raporu yeni sürüm kovalamaktan çok mevcut geçiş maliyetlerini ve platform sinyallerini sıralıyor. Burak KUTBAY tarafında görünen en yeni iki yazı 15 Temmuz ve 11 Temmuz tarihli, yani dünkü eksene tekrar düşmemek için yalnız tarama kontrolü olarak bırakıldı.

## Öne Çıkan Başlıklar

- [Spring Data 2026.0.0](https://github.com/spring-projects/spring-data-commons/wiki/Spring-Data-2026.0-Release-Notes), string tabanlı property path kullanımını azaltan type-safe API'ler ve JDBC/R2DBC `upsert` desteğiyle günlük repository kodunu doğrudan etkileyen en güçlü resmi sinyali veriyor.
- [Spring Integration 7.1](https://docs.spring.io/spring-integration/reference/7.1.0/whats-new.html) ve [Spring AMQP 4.1](https://spring.io/projects/release-highlights/) birlikte okunduğunda entegrasyon katmanında daha açık protokol seçimi öne çıkıyor: CloudEvents, gRPC, `RestClient` ve generic AMQP 1.0.
- [Spring Session 4.1](https://docs.spring.io/spring-session/reference/4.1/whats-new.html) içindeki Hazelcast ve MongoDB sahiplik değişimleri küçük release notu gibi görünse de, kurumsal ekipler için bakım ritmi ve destek beklentisini etkileyen bir governance sinyali.
- [Spring Boot upgrading guide](https://docs.spring.io/spring-boot/upgrading.html) ve [deprecated properties appendix](https://docs.spring.io/spring-boot/appendix/deprecated-application-properties/index.html), Boot `4.1` geçişini "dependency bump" olmaktan çıkarıp config envanteri işi haline getiriyor.
- [OpenJDK JDK 27 project page](https://openjdk.org/projects/jdk/27/) yalnızca [JEP 527](https://openjdk.org/jeps/527) hedeflenmiş dar bir release resmi çiziyor; [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) ise prod baseline'ın hâlâ `26.0.1`, `25.0.3`, `21.0.11` ve `17.0.19` üzerinde tutulması gerektiğini doğruluyor.

## Kritik Güncellemeler

### 1. Spring Data 2026.0.0, veri erişiminde "stringly typed" yüzeyi daraltıyor

[Spring Data 2026.0 release notes](https://github.com/spring-projects/spring-data-commons/wiki/Spring-Data-2026.0-Release-Notes) üç noktada doğrudan üretim etkisi yaratıyor:

- `PropertyPath.of(...)` ve `Sort.by(Person::getFirstName, ...)` gibi type-safe property referanslarıyla string tabanlı path kullanımını azaltıyor.
- Spring Data JDBC ve R2DBC tarafında tek statement ile `upsert` desteği getiriyor.
- Spring Data Redis için annotation-driven Pub/Sub listener endpoint'lerini ekliyor.

Bu güncelleme yeni özellikten çok bakım maliyeti düşüren bir kontrat değişimi. Özellikle çok sayıda dinamik sıralama/filtreleme yapan repository katmanlarında refactor sonrası sessiz kırılmaların bir kısmı artık derleme zamanına çekilebilir.

### 2. Entegrasyon katmanında RestTemplate sonrası dönem daha görünür hale geliyor

[Spring Integration 7.1 "What's New"](https://docs.spring.io/spring-integration/reference/7.1.0/whats-new.html) üç net sinyal veriyor:

- yeni `spring-integration-cloudevents` modülü,
- yeni `spring-integration-grpc` modülü,
- `HttpRequestExecutingMessageHandler` için `RestClient` desteği ve `RestTemplate` konfigürasyonunun deprecated ilan edilmesi.

[Spring Release Highlights](https://spring.io/projects/release-highlights/) ayrıca [Spring AMQP 4.1](https://spring.io/projects/release-highlights/) ile generic AMQP 1.0 istemcisini de aynı dalgaya ekliyor. Buradaki ortak mesaj, entegrasyon yüzeyini "eski HTTP helper + ad hoc event payload" seviyesinde bırakmamak.

### 3. Spring Session sahiplik değişimi küçük görünse de platform kararıdır

[Spring Session 4.1 "What's New"](https://docs.spring.io/spring-session/reference/4.1/whats-new.html) içinde iki madde var:

- Spring Session Hazelcast artık Hazelcast ekibi tarafından yönetiliyor.
- Spring Session MongoDB artık MongoDB ekibi tarafından yönetiliyor.

Bu olumlu bir uzmanlaşma işareti olabilir; ancak Spring Boot release train içinde oturan ekipler için aynı zamanda şu soruyu açıyor: "Session altyapısında kullandığım store-adapter modülünün bakım ritmi ve test matrisi artık hangi ekibin önceliğine bağlı?"

### 4. Spring Boot 4.1 geçişinde asıl sürtünme kod değil, konfigürasyon envanteri

[Spring Boot upgrading guide](https://docs.spring.io/spring-boot/upgrading.html), yeni feature release geçişlerinde `spring-boot-properties-migrator` kullanımını açıkça öneriyor. [Deprecated application properties appendix](https://docs.spring.io/spring-boot/appendix/deprecated-application-properties/index.html) ise bunun nedenini gösteriyor:

- Jackson 3 tercihine kayan property yüzeyleri,
- `management.endpoints.enabled-by-default` gibi property değişimleri,
- JMS/Kafka/ActiveMQ/Artemis tarafındaki rename örnekleri,
- artık kaldırılma yoluna girmiş devtools ve Jackson 2 tabanlı seçenekler.

Bu, Boot `4.1` geçişinde "uygulama açıldıysa iş bitti" yaklaşımının yetersiz olduğunu gösteriyor. Özellikle büyük `application.yml` dosyalarında sessiz rename birikimi ciddi operasyonel sürpriz üretebilir.

### 5. JDK 27, özellik patlaması değil güvenlik ve hardening hattı gibi davranıyor

[OpenJDK JDK 27 project page](https://openjdk.org/projects/jdk/27/) bugün için yalnız [JEP 527 - Post-Quantum Hybrid Key Exchange for TLS 1.3](https://openjdk.org/jeps/527) hedeflenmiş diyor. [JEP 527](https://openjdk.org/jeps/527), `javax.net.ssl` kullanan uygulamaların kod değiştirmeden hibrit post-quantum TLS 1.3 key exchange algoritmalarından faydalanmasını hedefliyor.

[Loic Mathieu'nun Java 27 özeti](https://www.loicmathieu.fr/wordpress/informatique/java-27-whats-new/) bu resmi destekliyor: Java 27 küçük bir sürüm; ama güvenlik ve işletim tarafında TLS certificate compression, `jcmd VM.security_properties`, bazı performans iyileştirmeleri ve JVMCI kaldırılması gibi küçük ama etkili değişiklikler getiriyor. [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) ise prod destekli hattın henüz değişmediğini doğruluyor.

## Trendler ve Sinyaller

### Trend Kümesi 1: Derleme zamanı güveni geri kazanma çabası güçleniyor

Spring Data'nın type-safe property path hamlesi, Spring Boot'un property migrator ve deprecated property listesiyle birlikte okunduğunda aynı şeyi söylüyor: framework, string bazlı yapılandırma ve sorgu referanslarından doğan hataları daha erken aşamaya çekmek istiyor.

Bu kısa vadeli hype değil; kurumsal Java kod tabanlarında bakım maliyetini gerçekten etkileyen kalıcı değer.

### Trend Kümesi 2: Entegrasyon katmanı daha açık protokol tercihlerine doğru kayıyor

CloudEvents, gRPC, `RestClient` ve AMQP 1.0 sinyalleri birlikte bakıldığında entegrasyon mimarisinde şu dönüşüm görülüyor:

- olay zarfı daha standart,
- transport seçimi daha görünür,
- client altyapısı daha modern,
- framework'ün "arka planda bir şeyler hallederiz" alanı daralıyor.

Bu da ekipleri daha erken mimari karar almaya zorluyor; yani iyi haber ve kötü haber aynı anda.

### Trend Kümesi 3: Portföy içi sahiplik, artık teknik risk kadar tedarik zinciri riski de

Spring Session içindeki Hazelcast ve MongoDB sahiplik kayması, Spring ekosisteminin giderek daha fazla partner/vendor katkılı parçalara açıldığını gösteriyor. Bu, özellik kalitesini artırabilir; ama patch ritmi, destek beklentisi ve release train uyumu açısından ayrıca izlenmeli.

### Trend Kümesi 4: Java 27'de büyük dil özelliği değil, güvenlik ve bakım odaklı kazanımlar öne çıkıyor

JDK 27'nin resmi yüzeyi dar. Bu yüzden üretim ekibi açısından doğru okuma şu:

- yeni büyük dil özelliği beklentisi düşük,
- güvenlik/TLS ve küçük performans iyileştirmeleri daha önemli,
- prod baseline kararı ile EA gözlem hattı birbirine karıştırılmamalı.

### Kısa ömürlü gürültü vs kalıcı değer

- Kalıcı değer: type-safe property path, config migrator disiplini, `RestClient` yönü, standart event/protocol yüzeyleri
- Orta vadeli izleme alanı: Spring Session vendor-led ownership, JDK 27 EA sertleşmesi, generic AMQP 1.0 adoption
- Gürültü riski: sessiz release günlerinde "önemli bir şey yok" sanıp migration borcunu görünmez bırakmak

## Araçlar ve Kütüphaneler

- [Spring Boot properties migrator](https://docs.spring.io/spring-boot/upgrading.html): yüksek öncelik. Özellikle `3.x -> 4.1` veya `4.0.x -> 4.1` geçişlerinde konfigürasyon rename'lerini görünür hale getirmek için.
- [Spring Data 2026.0.0 type-safe property paths](https://github.com/spring-projects/spring-data-commons/wiki/Spring-Data-2026.0-Release-Notes): yüksek öncelik. Dinamik sort/filter/repository DSL kullanan ekipler için.
- [Spring Integration CloudEvents ve gRPC modülleri](https://docs.spring.io/spring-integration/reference/7.1.0/whats-new.html): orta-yüksek öncelik. Olay taşıma ve servisler arası iletişim katmanını sadeleştirebilir.
- [Spring AMQP 4.1 AMQP 1.0 client](https://spring.io/projects/release-highlights/): orta öncelik. RabbitMQ dışı veya daha generic broker senaryoları için değerlendirilebilir.
- [Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/): düşük-orta öncelik. Java 21+ kullanan veri yoğun batch/ETL servisleri için dikkat çekici yeni JVM aracı.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Data kullanan ekipler, yeni kodda string property path üretmeyi azaltmak için ortak repository yardımcılarını type-safe API'lere taşımalı.
- JDBC/R2DBC `upsert` cazip görünüyor; ancak `@Version` uygulanmaması concurrency semantiğini değiştirebilir. Bu yüzden kritik aggregate'larda doğrudan açılmamalı.
- Spring Integration tabanlı HTTP akışlarında `RestTemplate` kalıntıları varsa artık resmen migration backlog'una girmeli.
- Session store olarak Hazelcast veya MongoDB kullanan ekipler, modül upgrade'lerini sadece Spring Boot BOM yükseltmesi gibi değil, ayrı entegrasyon testi konusu gibi ele almalı.
- Boot `4.1` geçişinde config diff otomasyonu kurmayan ekipler, kod testleri geçse bile runtime davranış sapması yaşayabilir.
- JDK 27 için en doğru kullanım bugün pilot/perf/security canary hattı; prod default hattı değil.

## Fırsatlar ve Riskler

- Fırsat: type-safe property path ve config migrator ile derleme zamanı güvenini artırmak.
- Risk: `upsert` kullanımında optimistic locking beklentisini yanlış varsaymak.
- Fırsat: CloudEvents ve gRPC ile entegrasyon sınırlarını daha açık modellemek.
- Risk: `RestTemplate` deprecated yönünü görmezden gelip upgrade maliyetini büyütmek.
- Fırsat: vendor-led Spring Session modüllerinde store'e daha yakın iyileştirmeler görmek.
- Risk: sahiplik değişiminin release ritmi ve dokümantasyon tutarlılığı üzerinde etkisini geç fark etmek.
- Fırsat: JDK 27'nin küçük ama anlamlı güvenlik/hardening değişimlerini erken canary'de ölçmek.
- Risk: Oracle destekli baseline'dan erken kopup JDK 27'yi prod standardı gibi davranmak.

## İzlenmesi Gereken Konular

- Spring Data `2026.1` hattında `@ProjectedPayload` geçiş uyarılarının nasıl sertleşeceği
- Spring Integration örneklerinde `RestClient` kullanımının ne hızla varsayılan pratiğe dönüştüğü
- Spring Session Hazelcast ve MongoDB modüllerinin release ritmi ile Spring Boot train uyumunun nasıl ilerlediği
- JDK 27 EA hattında [JEP 527](https://openjdk.org/jeps/527) dışında yeni hedeflenecek iş kalıp kalmayacağı
- [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) tarafında destekli prod baseline penceresinin ne zaman değişeceği
- [Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/) etrafında write path ve ekosistem olgunluğunun ne hızla gelişeceği

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Data 2026.0.0 ile repository ve query yüzeyinde type-safe kontrat dönemi güçleniyor
- `source`: [Spring Data 2026.0 release notes](https://github.com/spring-projects/spring-data-commons/wiki/Spring-Data-2026.0-Release-Notes) | [Spring Release Highlights](https://spring.io/projects/release-highlights/)
- `author`: Mark Paluch | Spring Data team
- `date`: 9 Haziran 2026
- `category`: data-access, migration, type-safety
- `tags`: spring-data-2026.0, property-path, upsert, redis-listener, jdbc, r2dbc, mongodb
- `summary`: Spring Data `2026.0.0`, type-safe property paths, JDBC/R2DBC için tek statement `upsert` ve Redis annotation-driven listener endpoint'leri getiriyor.
- `why_it_matters`: String tabanlı query/property referanslarını azaltarak bakım maliyetini ve sessiz runtime kırılmalarını düşürme potansiyeli taşıyor.
- `java_spring_relevance`: Repository DSL, sorting/filtering, relational persistence ve Redis event glue kullanan Spring ekipleri için doğrudan uygulamalı değer üretiyor.
- `actionability`: `planli_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: ortak query/sort yardımcılarını type-safe API'ye çekmek; Redis Pub/Sub kodunu annotation-driven modele sadeleştirmek
- `risks`: `upsert` sırasında `@Version` beklentisini yanlış kurmak; SQL Server tarafında `IDENTITY_INSERT` gibi dialect gereksinimlerini atlamak
- `migration_notes`: Yeni kodda `PropertyPath.of(...)` ve method reference tabanlı sort kullanımını standartlaştırın; `upsert` kullanmadan önce optimistic locking beklentisini ADR seviyesinde netleştirin; Mongo multi-collection `bulkWrite` için MongoDB `8.0+` gereksinimini not edin.

### Bulgu 2

- `title`: Spring Integration 7.1 ve Spring AMQP 4.1, entegrasyon yüzeyini daha standart ve açık protokollere itiyor
- `source`: [Spring Integration 7.1 "What's New"](https://docs.spring.io/spring-integration/reference/7.1.0/whats-new.html) | [Spring Release Highlights](https://spring.io/projects/release-highlights/)
- `author`: Spring Integration team | Spring AMQP team
- `date`: Haziran 2026
- `category`: integration, messaging, transport, event-driven
- `tags`: spring-integration-7.1, cloudevents, grpc, restclient, resttemplate-deprecated, amqp-1.0
- `summary`: Spring Integration `7.1`, CloudEvents ve gRPC modülleri ekliyor; HTTP message handler tarafında `RestClient` desteği getirip `RestTemplate` konfigürasyonunu deprecated ilan ediyor. Spring AMQP `4.1` ise generic AMQP 1.0 istemcisi ekliyor.
- `why_it_matters`: Entegrasyon sınırlarında ad hoc payload ve legacy HTTP client seçimlerini daha pahalı hale getiriyor; standart zarf ve daha net transport seçimi öne çıkıyor.
- `java_spring_relevance`: Spring Integration, Spring Messaging, broker bağlantıları ve servisler arası çağrılarla çalışan mikroservis ekipleri için doğrudan önemli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: event envelope standardizasyonu; gRPC entegrasyonunda custom adapter yükünü azaltmak; `RestClient` yönüne erkenden geçmek
- `risks`: yarım göç nedeniyle entegrasyon katmanında birden fazla transport ve istemci modelinin paralel yaşaması; CloudEvents dönüşüm maliyetini küçümsemek
- `migration_notes`: `RestTemplate` bağımlı integration flow'ları envantere alın; yeni HTTP entegrasyonlarında `RestClient` varsayılan kabul edin; CloudEvents'i tüm olaylara değil, sınır sistemleri ve çoklu tüketici senaryolarına hedefleyin.

### Bulgu 3

- `title`: Spring Session'da Hazelcast ve MongoDB sahiplik değişimi, teknikten çok bakım yönetişimi sinyali veriyor
- `source`: [Spring Session 4.1 "What's New"](https://docs.spring.io/spring-session/reference/4.1/whats-new.html) | [Spring Release Highlights](https://spring.io/projects/release-highlights/)
- `author`: Spring Session team
- `date`: Haziran 2026
- `category`: support-policy, platform-governance, session-management
- `tags`: spring-session, hazelcast, mongodb, ownership, support, maintenance
- `summary`: Spring Session Hazelcast modülü artık Hazelcast ekibi, MongoDB modülü ise MongoDB ekibi tarafından yönetiliyor.
- `why_it_matters`: Session store adaptörlerinin bakım ritmi ve öncelikleri klasik Spring çekirdek ritminden kısmen ayrışabilir.
- `java_spring_relevance`: Stateful web uygulamaları, session replication, distributed auth state ve store-backed session kullanan Spring Boot ekipleri için önemli.
- `actionability`: `izlemelik`
- `impact_level`: `orta-yuksek`
- `opportunities`: store'e daha yakın uzmanlık, performans ve özellik gelişimi
- `risks`: release cadence asimetrisi, dokümantasyon drift'i, Boot train ile gecikmeli hizalanma
- `migration_notes`: Hazelcast/MongoDB tabanlı session kullanan uygulamalarda upgrade testlerini BOM yükseltmesinden ayrı bir entegrasyon testi kapısı olarak ele alın; serialization, TTL ve session expiry davranışını tekrar doğrulayın.

### Bulgu 4

- `title`: Spring Boot 4.1 yükseltmesi için konfigürasyon diff'i artık zorunlu bir mühendislik adımı
- `source`: [Spring Boot upgrading guide](https://docs.spring.io/spring-boot/upgrading.html) | [Deprecated application properties appendix](https://docs.spring.io/spring-boot/appendix/deprecated-application-properties/index.html) | [A Bootiful Podcast: Moritz Halbritter](https://spring.io/blog/2026/07/09/a-bootiful-podcast-moritz-halbritter)
- `author`: Spring Boot team | Josh Long
- `date`: 9-16 Temmuz 2026 kontrolü
- `category`: migration, config-governance, platform-engineering
- `tags`: spring-boot-4.1, properties-migrator, deprecated-properties, jackson3, config-drift
- `summary`: Spring Boot resmi dokümanları, feature release geçişlerinde `spring-boot-properties-migrator` kullanımını öneriyor; deprecated properties listesi ise config yüzeyinde ciddi rename/deprecation birikimi olduğunu gösteriyor.
- `why_it_matters`: Büyük Boot geçişlerinde esas hata sınıfı artık çoğu kez Java kodu değil, property envanteri ve runtime config drift.
- `java_spring_relevance`: Boot tabanlı her servis için doğrudan geçerli; özellikle merkezi config ve çok profil kullanan ekiplerde daha kritik.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: config rename'lerini CI içinde görünür yapmak; canary ortamında property migrator ile güvenli geçiş yapmak
- `risks`: migrator'u kalıcı bağımlılık haline getirmek; deprecated property'leri "çalışıyor" diye taşımaya devam etmek; Jackson 3 yönünü geç fark etmek
- `migration_notes`: `runtimeOnly("org.springframework.boot:spring-boot-properties-migrator")` bağımlılığını yalnız geçiş penceresinde ekleyin; startup uyarılarını toplayıp config diff listesi üretin; geçiş tamamlanınca bağımlılığı kaldırın; deprecated property listesine karşı otomatik lint ekleyin.

### Bulgu 5

- `title`: JDK 27 bugün için dar ama güvenlik ağırlıklı bir izleme hattı
- `source`: [OpenJDK JDK 27 project page](https://openjdk.org/projects/jdk/27/) | [JEP 527](https://openjdk.org/jeps/527) | [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) | [Loic Mathieu - Java 27: What's new?](https://www.loicmathieu.fr/wordpress/informatique/java-27-whats-new/) | [dev.java/news](https://dev.java/news/)
- `author`: OpenJDK contributors | Oracle | Loic Mathieu | Nicolai Parlog
- `date`: 9-16 Temmuz 2026 kontrolü
- `category`: jvm, security, compatibility, runtime-governance
- `tags`: jdk27, jep527, tls1.3, post-quantum, jvmci-removal, jcmd, supported-runtime
- `summary`: OpenJDK JDK 27 sayfasında bugün yalnız JEP `527` hedeflenmiş görünüyor. Loic Mathieu, Java 27'yi küçük bir sürüm olarak özetliyor; ama TLS certificate compression, `jcmd VM.security_properties`, JVMCI kaldırılması ve bazı performans iyileştirmeleri gibi anlamlı detaylar olduğunu vurguluyor. Oracle tarafı ise prod destekli hattın hâlâ `26.0.1`, `25.0.3`, `21.0.11` ve `17.0.19` olduğunu söylüyor.
- `why_it_matters`: Java ekipleri için bu sürüm "her şeyi buna taşıyalım" release'i değil; ama TLS, kripto ve işletim araçları açısından erken ölçülmeye değer.
- `java_spring_relevance`: Spring Boot servislerinde TLS terminasyonu, outbound HTTPS istemcileri, güvenlik denetimi ve JVM araç kullanımını etkileyebilir.
- `actionability`: `izlemelik`
- `impact_level`: `orta-yuksek`
- `opportunities`: post-quantum TLS canary testleri; `jcmd` tabanlı güvenlik property gözlemi; küçük performans kazanımlarını benchmark etmek
- `risks`: JVMCI veya yakın ekosistem varsayımlarına yaslanan araçlarda sürpriz davranış; destekli baseline'dan erken kopmak
- `migration_notes`: JDK 27'yi önce perf/security canary hattında deneyin; prod standardını Oracle destekli satırlarda tutun; TLS ve crypto stack'i staging'de doğrulamadan rollout yapmayın.

### Bulgu 6

- `title`: Gunnar Morling'in Hardwood 1.0'ı, veri yoğun JVM işlerinde izlenmeye değer yeni bir araç
- `source`: [Gunnar Morling feed'i](https://www.morling.dev/index.xml) | [Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/)
- `author`: Gunnar Morling
- `date`: 25 Haziran 2026
- `category`: tooling, data-engineering, batch
- `tags`: hardwood, parquet, java21, batch, etl, analytics
- `summary`: Hardwood `1.0`, Java `21+` için hafif, hızlı ve minimal bağımlılıklı bir Apache Parquet reader olarak production-ready ilan edildi.
- `why_it_matters`: Her Spring geliştiricisi için zorunlu değil; ama veri ingest, offline processing, batch ve analitik pipeline'larda JVM tarafında daha hafif alternatif arayan ekipler için güçlü sinyal.
- `java_spring_relevance`: Spring Batch, scheduled jobs, ETL mikroservisleri ve veri yan-servisleri için daha anlamlı; klasik CRUD servisleri için düşük öncelikli.
- `actionability`: `izlemelik`
- `impact_level`: `dusuk-orta`
- `opportunities`: Hadoop/Spark dışı daha hafif Parquet işleme yardımcıları oluşturmak; Java 21 tabanlı veri servislerinde performans kazanımı aramak
- `risks`: yeni 1.0 kütüphaneyi kritik iş yoluna erken almak; yazma desteği beklentisini bugünün sürümüne yüklemek
- `migration_notes`: Önce offline job veya sidecar iş yüklerinde deneyin; write path ihtiyacı olan akışlarda yol haritasını izleyin; Java 21 baseline zorunluluğunu açıkça not edin.

## Sonuç

16 Temmuz 2026 için en değerli Java/Spring sinyali yeni bir patch değil, release sessizliğinde hangi teknik borcun artık ertelenmemesi gerektiği. Spring Data tarafında type-safe query/property kontratları, Spring Integration tarafında `RestClient` ve standart event/protocol yüzeyleri, Spring Boot tarafında config migrator disiplini ve JDK 27 tarafında dar ama önemli güvenlik/hardening hattı öne çıkıyor.

Bugün senior bir Spring ekibinin en rasyonel aksiyonu yeni başlık aramak değil; `config drift`, string tabanlı repository/query yüzeyi, eski integration client'ları ve store-adapter sahiplik riskini net backlog maddelerine çevirmek.
