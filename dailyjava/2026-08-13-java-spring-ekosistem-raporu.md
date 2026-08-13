# Günlük Java / Spring Ekosistem Raporu

Tarih: 13 Ağustos 2026 Perşembe  
Tarama zamanı: 13 Ağustos 2026 09:07 TSİ  
Odak: Spring tarafında asıl sinyal yeni bir GA dalgası değil; `Spring Boot / Spring Cloud / JDK / seçili bağımlılık` matrisinin artık ayrı ayrı yönetilmesi gereken bir destek ve göç sözleşmesine dönüşmesi

Tarama notu: 13 Ağustos 2026 09:07 TSİ itibarıyla [Spring Blog](https://spring.io/blog), [Spring release sayfaları](https://spring.io/blog/category/releases/), [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security/), [Spring Boot 4.1.0 duyurusu](https://spring.io/blog/2026/06/10/spring-boot-4/), [Spring Boot 3.5.16 duyurusu](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/), [Spring Boot sistem gereksinimleri](https://docs.spring.io/spring-boot/system-requirements.html), [Spring Boot 4.1 release notları](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/), [Spring Cloud 2025.1.2 duyurusu](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/), [Spring Cloud 2025.0.3 duyurusu](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/), [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases), [OpenJDK JDK 27 EA sayfası](https://jdk.java.net/27/), [Inside Java](https://inside.java/), [This Week in Spring - August 11th, 2026](https://spring.io/blog/2026/08/11/this-week-in-spring-august-11-2026), [InfoQ Spring Boot 4.1 analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/), [Baeldung Java Weekly 657](https://www.baeldung.com/java-weekly-657), [Baeldung Java Weekly 658](https://www.baeldung.com/java-weekly-658), [Gunnar Morling blogu](https://www.morling.dev/blog/), [Burak KUTBAY blogu](https://blog.burakkutbay.com/) ve Josh Long’un güncel kamusal akışı kontrol edildi. 13 Ağustos 2026 itibarıyla yeni bir Spring Boot/Framework/Cloud GA ya da yeni bir Ağustos security advisory görünmüyor. Bugünün daha güçlü sinyali, destekli OSS hattın artık `3.5.x -> 4.x` şeklinde net ayrışması ve Spring Cloud tarafında bu geçişin `version matrix` olarak resmileşmesi.

## Öne Çıkan Başlıklar

- [Spring Boot 3.5.16](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/) `3.5.x` hattının son OSS sürümü. `3.5.x` üzerinde kalmak artık “bir sonraki patch’i bekleriz” değil, açıkça destek dışı hatta kalmak anlamına geliyor.
- [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/) artık eşlemeyi doğrudan söylüyor: `2025.1.x (Oakwood)` hattı `Boot 4.0.x` ve `4.1.x` ile uyumlu; `2025.0.x (Northfields)` ise `3.5.x` hattı ve `*` ile EOL olarak işaretli.
- [Spring Boot 4.1 sistem gereksinimleri](https://docs.spring.io/spring-boot/system-requirements.html), geçişte genel Java tabanını zorla yükseltmiyor: `Java 17+` destekleniyor. Ancak [Boot 4.1 release notları](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) `jOOQ 3.20` için `Java 21+` gerektirdiğini açıkça belirtiyor. Yani gerçek göç maliyeti framework değil, servis bazlı bağımlılık matrisi tarafından belirleniyor.
- [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) tarafında `17.0.20`, `21.0.12`, `25.0.4` ve `26.0.2` satırları güncel güvenlik baseline’ı gösteriyor. Spring ekipleri artık “tek Java sürümü” yerine `servis-sınıfı bazlı runtime lane` tasarlamak zorunda.
- [Spring Security Advisories](https://spring.io/security/) sayfasında en güncel dalga hâlâ `9-12 Haziran 2026` güvenlik yayınları. Bu, destek dışı hatlarda kalan ekipler için riskin teorik değil pratik olduğunu gösteriyor.

## Kritik Güncellemeler

### 1. Spring Boot 3.5.x için OSS yol kapandı

[Spring Boot 3.5.16 duyurusu](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/) açık biçimde bunun `3.5.x generation` için son OSS sürüm olduğunu söylüyor ve OSS destek almak isteyenleri `4.0.x` veya `4.1.x` hatlarına yönlendiriyor.

Bu, iki açıdan kritik:

- `3.5.x` üzerinde kalmak artık “stabil hatta kalıyoruz” değil, “bir sonraki açıkta community fix alamayacağız” demek
- platform takımlarının `major upgrade` kartını ertelemesi, güvenlik ve uyumluluk kararını da ertelemiş olmuyor

### 2. Spring Cloud geçişi artık sürüm yükseltmesinden çok destek matrisi problemi

[Spring Cloud proje sayfasındaki uyumluluk tablosu](https://spring.io/projects/spring-cloud/) net:

- `2025.1.x (Oakwood)` -> `Spring Boot 4.0.x`, `4.1.x (2025.1.2 ile birlikte)`
- `2025.0.x (Northfields)` -> `Spring Boot 3.5.x`
- `*` işaretli release train’ler EOL

[Spring Cloud 2025.1.2 duyurusu](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) ayrıca `Boot 4.1.0 compatibility` eklediğini söylüyor. [Spring Cloud 2025.0.3 duyurusu](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/) ise bunun `2025.0.x` hattındaki son OSS release olduğunu ve bu hattın `Boot 3.5.15` tabanlı olduğunu belirtiyor.

Pratik sonuç: Spring Cloud kullanan servislerde “önce Boot’u çıkar, Cloud’u sonra düşünürüz” yaklaşımı artık güvenli değil.

### 3. Boot 4.1 genel Java tabanını koruyor, ama bağımlılıklar yerel kırılma yaratıyor

[Spring Boot sistem gereksinimleri](https://docs.spring.io/spring-boot/system-requirements.html) `Boot 4.1.0` için:

- minimum `Java 17`
- desteklenen üst sınır `Java 26`
- native image için `GraalVM Community 25`

[Spring Boot 4.1 release notları](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) ise `jOOQ 3.20` nedeniyle bazı uygulamaların fiilen `Java 21+` istemeye başladığını söylüyor.

[Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) bugün itibarıyla:

- `17.0.20`
- `21.0.12`
- `25.0.4`
- `26.0.2`

satırlarını güncel güvenlik baseline olarak gösteriyor.

Bu da şu anlama geliyor:

- framework geçişi ile runtime geçişi artık aynı ticket içinde yönetilmemeli
- `jOOQ`, `native-image`, `Spring Cloud`, `gRPC`, `Kafka/AMQP` ve benzeri kullanım desenleri servis bazında ayrı lane açtırabilir

### 4. Boot 4.1 yalnızca “yeni major” değil, iletişim ve güvenlik yüzeyi güncellemesi

[Spring Boot 4.1 duyurusu](https://spring.io/blog/2026/06/10/spring-boot-4/) ve [release notları](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) aşağıdaki alanları öne çıkarıyor:

- yerleşik `Spring gRPC` desteği
- HTTP istemcileri için `InetAddressFilter` tabanlı SSRF azaltımı
- observability/OpenTelemetry iyileştirmeleri
- Jackson okuma/yazma ayarlarının daha merkezi konfigürasyonu
- bazı veri erişim akışlarında `lazy` bağlantı kazanımları

Bu yüzden `4.1` sadece “destek için geçelim” sürümü değil; outbound HTTP, gRPC, tracing ve platform güvenliği tarafında somut işletim değeri taşıyor.

### 5. Yeni Ağustos advisory yok; son ciddi dalga Haziran’da ve kapsam geniş

[Spring Security Advisories](https://spring.io/security/) sayfasında en güncel üst satırlar hâlâ:

- `12 Haziran 2026`: Spring AI
- `11 Haziran 2026`: Spring Cloud Sleuth, Spring Statemachine, Spring Cloud Gateway
- `10 Haziran 2026`: Spring Boot, Spring Integration, Spring Web Services, Spring for GraphQL
- `9 Haziran 2026`: Spring Security, Spring Data Commons, Spring Data MongoDB

Bu tablo bugünün “sessiz” olmasının güvenli olduğu anlamına gelmiyor. Tersine, destek dışı hatta kalan servislerin bir sonraki benzer dalgada doğrudan zorunlu göçe itileceğini gösteriyor.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring yükseltmesi artık tek bir `framework version bump` değil

Tekrarlayan güçlü sinyal şu:

- Boot OSS hattı `3.5.x` sonrası `4.x` tarafına geçti
- Cloud tarafı bunu release-train matrisi olarak resmileştirdi
- Java tabanı Boot seviyesinde geniş kaldı ama seçili bağımlılıklar servis bazlı daha yüksek tabanlar istiyor

Kalıcı değer burada. Gürültü değil.

### Trend Kümesi 2: Microservice platform sahipliği BOM seviyesinde daha görünür hale geliyor

Özellikle Spring Cloud kullanan ekiplerde gerçek karar artık şunlar:

- hangi `Boot` minor hattı
- hangi `Cloud` release train
- hangi `JDK` lane
- hangi `native/jOOQ/gRPC` istisnaları

Bu, “takım kendisi yükseltsin” yaklaşımını zayıflatıyor; platform ekibinin merkezi BOM ve destek matrisi yayımlaması gerekiyor.

### Trend Kümesi 3: Güvenlik riski artık yalnız CVE’den değil, destek dışı kombinasyondan doğuyor

Haziran advisory dalgası çok sayıda projeye yayıldı. Bu yüzden artık risk, sadece “şu kütüphanede açık var mı?” sorusu değil; “bu servis, düzeltme alan OSS kombinasyonda mı?” sorusu.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: `Boot/Cloud/JDK/dependency` envanteri çıkarmak
- Kalıcı değer: Cloud kullanan servislerde `2025.1.2` hedefini resmi platform standardına çevirmek
- Kalıcı değer: `Java 17 tabanı var diye tüm servisler aynı kolaylıkla geçer` varsayımını bırakmak
- Düşük öncelik: Ağustos ortasında yeni bir release gelmediği için günlük gürültü düşük; bugünün kararı haber kovalamak değil, destek hattını kapatmak

## Araçlar ve Kütüphaneler

- [Spring gRPC](https://spring.io/blog/2026/06/10/spring-boot-4/): Boot 4.1 ile yerleşik hale geldi. gRPC sunucu/istemci, Servlet HTTP/2 ve test desteği isteyen ekipler için artık üçüncü taraf starter bağımlılığı azaltılabilir.
- [InetAddressFilter tabanlı SSRF azaltımı](https://spring.io/blog/2026/06/10/spring-boot-4/): outbound HTTP kullanan servislerde ağ sınırlarını kod ve config seviyesinde sıkılaştırmak için değerli.
- [Spring Cloud Gateway 2025.1.2 / 2025.0.3 değişiklikleri](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/): `StripContextPath`, body codec özelleştirme ve `URI template` observability iyileştirmeleri gateway katmanında somut operasyonel kazanım sunuyor.
- [Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/) ve [fixed-length list optimizasyonu](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/): JVM içinde Parquet okuyan veri-ağır servisler için ilginç. Ancak tipik Spring CRUD/microservice ekipleri için bugün düşük öncelikli.

Bugün “hemen alınacak” yeni bir genel amaçlı Spring runtime kütüphanesi görünmüyor. Değer, kütüphane keşfinden çok sürüm ve destek topolojisini düzeltme tarafında.

## Java / Spring Geliştiricileri İçin Etkiler

- Her servis için şu matrisi çıkarın: `Spring Boot`, `Spring Cloud`, `JDK`, `native-image`, `jOOQ`, `gRPC`, `Gateway`, `Config`, `Kubernetes`, `messaging starter`.
- Spring Cloud kullanan servislerde hedef kombinasyonu açıkça `Boot 4.1.x + Cloud 2025.1.2` olarak yazın. Boot yükseltmesini Cloud’dan ayrı yürütmeyin.
- Spring Cloud kullanmayan ama OSS destek isteyen servislerde `4.0.x` ve `4.1.x` arasında özellik ihtiyacına göre ayrım yapın. gRPC, SSRF ve observability kazanımı varsa `4.1.x` öncelikli olsun.
- `Java 17 minimum` cümlesini migration kolaylığı olarak okuyun, yeterlilik garantisi olarak değil. `jOOQ`, native image ve bazı build araçları için ek kontrol şart.
- Unsupported hatta kalan servisler için “sonra bakarız” yaklaşımı yerine iki yol seçin: hızlandırılmış geçiş veya ücretli destek.

## Fırsatlar ve Riskler

- Fırsat: `4.1.x` ile hem OSS destekli hatta dönmek hem de gRPC, SSRF azaltımı ve observability iyileştirmelerini almak
- Fırsat: platform takımı seviyesinde BOM standardizasyonu yapıp servis çeşitliliğini azaltmak
- Fırsat: runtime lane yaklaşımıyla tüm servisleri gereksiz yere aynı JDK’ya zorlamadan göçü kademelendirmek
- Risk: `Boot 4.1 Java 17 destekliyor` diye tüm servislerin sorunsuz göç edeceğini varsaymak
- Risk: Spring Cloud release train uyumsuzluğunu test aşamasına kadar fark etmemek
- Risk: bir sonraki güvenlik dalgasında `3.5.x` veya `2025.0.x` üzerinde kalan servislerin acil göçe zorlanması
- Risk: gateway/config/discovery katmanında BOM uyumsuzluğu nedeniyle davranış farklılıklarını geç fark etmek

## İzlenmesi Gereken Konular

- [Spring Boot docs](https://docs.spring.io/spring-boot/system-requirements.html) üzerinde görünen `4.1.1-SNAPSHOT`, `4.0.8-SNAPSHOT` ve `4.2.0-SNAPSHOT` hatları. Özellikle `4.1.1` patch’i gerçek geçiş için daha güvenli pencere olabilir.
- [InfoQ’nun Boot 4.1 analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/) `Boot 4.2` için `spring-boot-amqp` ve `QPid Proton` tabanlı `AMQP 1.0` desteğini Kasım 2026 hedefi olarak işaret ediyor. AMQP 1.0 backlog’u olan ekipler izlemeli.
- [OpenJDK JDK 27 EA](https://jdk.java.net/27/) ve [JDK 27 release notes](https://jdk.java.net/27/release-notes) tarafındaki ilerleme. Bu bugün prod kararı değil ama `4.2` ve sonraki Boot/Cloud minor’ları için erken doğrulama hattı olabilir.
- [Spring Security Advisories](https://spring.io/security/) sayfasında Haziran sonrası yeni toplu advisory dalgası gelip gelmeyeceği.

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Boot 3.5.16, 3.5.x hattının son OSS çıkışı oldu
- `source`: [Spring Boot 3.5.16 available now](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/)
- `author`: Andy Wilkinson
- `date`: 25 Haziran 2026
- `category`: `release-governance`, `support-lifecycle`
- `tags`: `spring-boot-3.5.16`, `oss-eol`, `upgrade-planning`
- `summary`: Spring Boot ekibi `3.5.16` sürümünü yayımladı ve bunun `3.5.x` jenerasyonundaki son OSS release olduğunu açıkça belirtti.
- `why_it_matters`: Bu, 3.5.x üzerinde kalmanın artık “stabil seçim” değil “destek dışı seçim” olduğu anlamına geliyor.
- `java_spring_relevance`: Spring Boot tabanlı tüm servisler için bir sonraki güvenlik ve bug fix yolunu doğrudan etkiliyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: 4.x hattına geçip toplu platform sadeleştirmesi yapmak; gereksiz custom backport yükünü azaltmak
- `risks`: yeni açıklar geldiğinde community patch alamamak; platform ekibinin acil göçe zorlanması
- `migration_notes`: her 3.5.x servisi için `4.0.x`, `4.1.x` veya ticari destek kararı netleştirilmeli

### Bulgu 2

- `title`: Spring Cloud 2025.1.2, Boot 4.1 için resmi geçiş köprüsü; 2025.0.x ise 3.5.x’e kilitli ve EOL
- `source`: [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud/) | [Spring Cloud 2025.1.2](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) | [Spring Cloud 2025.0.3](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/)
- `author`: Spring Cloud team | Ryan Baxter
- `date`: 13 Ağustos 2026 itibarıyla doğrulanan eşleme; temel yayınlar 11 Haziran 2026
- `category`: `microservices-platform`, `compatibility`, `support-lifecycle`
- `tags`: `spring-cloud-2025.1.2`, `oakwood`, `northfields`, `boot-4.1`, `version-matrix`
- `summary`: Spring Cloud resmi eşleme tablosu `2025.1.x` hattını `Boot 4.0.x/4.1.x`, `2025.0.x` hattını ise yalnız `Boot 3.5.x` ile eşliyor; `2025.0.x` tarafı artık destek dışı işaretli.
- `why_it_matters`: Spring Cloud kullanan ekipler için yükseltme kararı framework değil release-train uyumluluğu üzerinden verilmeli.
- `java_spring_relevance`: Config, Gateway, Discovery, OpenFeign, Stream, Task ve Kubernetes kullanan Spring ekiplerinin tümü etkileniyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: merkezi BOM standardı kurmak; tüm cloud-native servisleri aynı destekli hatta toplamak
- `risks`: Boot 4.1 ile yanlış Cloud hattını eşlemek; gateway/config davranış farklarını geç yakalamak
- `migration_notes`: Spring Cloud içeren servislerde hedef BOM `spring-cloud-dependencies:2025.1.2` olmalı; gateway/config/kubernetes davranış testleri zorunlu tutulmalı

### Bulgu 3

- `title`: Boot 4.1 genel Java tabanını koruyor, ama jOOQ ve native image kullanımı servis bazlı daha yüksek tabanlar doğuruyor
- `source`: [Spring Boot sistem gereksinimleri](https://docs.spring.io/spring-boot/system-requirements.html) | [Spring Boot 4.1 release notları](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) | [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases)
- `author`: Spring Boot team | Oracle Java team
- `date`: 13 Ağustos 2026 doğrulaması; temel yayınlar Haziran-Temmuz 2026
- `category`: `runtime-governance`, `compatibility`, `platform-engineering`
- `tags`: `java17`, `java21`, `java25`, `java26`, `jooq-3.20`, `graalvm25`, `runtime-lanes`
- `summary`: Boot 4.1 `Java 17-26` aralığını destekliyor; native image tarafında `GraalVM 25` gerekiyor; `jOOQ 3.20` ise ilgili servislerde `Java 21+` şartı getiriyor.
- `why_it_matters`: Artık “Boot yükselttik, Java kararı da bitti” yaklaşımı doğru değil; servis bazlı istisnalar belirleyici.
- `java_spring_relevance`: jOOQ, native image veya ileri veri erişim/desenleri kullanan Spring Boot servislerinde doğrudan migration maliyeti yaratır.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: tüm servisleri tek seferde JDK yükseltmeden kontrollü lane tasarlamak
- `risks`: Java 17 tabanı nedeniyle göçü olduğundan kolay sanmak; build ve runtime sürprizleri yaşamak
- `migration_notes`: her servis için `required_jdk`, `tested_jdk`, `native_image`, `jooq` alanlarını içeren açık bir migration kartı oluşturulmalı

### Bulgu 4

- `title`: Spring Boot 4.1, gRPC, outbound HTTP güvenliği ve observability tarafında somut operasyonel değer getiriyor
- `source`: [Spring Boot 4.1.0 available now](https://spring.io/blog/2026/06/10/spring-boot-4/) | [Spring Boot 4.1 release notları](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) | [InfoQ analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/)
- `author`: Andy Wilkinson | Spring Boot team | Karsten Silz
- `date`: 10-15 Haziran 2026
- `category`: `service-communication`, `security`, `observability`, `developer-productivity`
- `tags`: `spring-grpc`, `inetaddressfilter`, `ssrf`, `opentelemetry`, `lazy-datasource`
- `summary`: Boot 4.1; yerleşik gRPC desteği, HTTP client SSRF azaltımı, observability güncellemeleri ve veri erişimi/başlangıç maliyetini iyileştiren küçük ama pratik gelişmeler getiriyor.
- `why_it_matters`: 4.1’e geçiş sadece destek baskısı değil; platform güvenliği ve servis iletişimi için de elle tutulur kazanım üretiyor.
- `java_spring_relevance`: outbound HTTP kullanan, gRPC deneyen veya telemetry standardı kuran Spring Boot ekipleri için doğrudan kullanım alanı var.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: üçüncü taraf gRPC starter yükünü azaltmak; SSRF guardrail’ı çerçeve seviyesine taşımak; telemetry standardını iyileştirmek
- `risks`: yalnız destek baskısı nedeniyle geçip yeni kabiliyetleri operasyona yansıtmamak
- `migration_notes`: pilot servislerde gRPC, outbound HTTP policy ve OpenTelemetry konfigürasyonlarını birlikte doğrulayın

### Bulgu 5

- `title`: Spring advisory yüzeyi geniş kaldı; yeni Ağustos yayını olmasa da Haziran dalgası hâlâ ana risk göstergesi
- `source`: [Spring Security Advisories](https://spring.io/security/)
- `author`: Spring team
- `date`: 13 Ağustos 2026 doğrulaması; son yoğun yayınlar 9-12 Haziran 2026
- `category`: `security-operations`, `risk-management`
- `tags`: `spring-security-advisories`, `spring-boot-cve`, `spring-cloud-gateway-cve`, `spring-data-cve`, `spring-graphql-cve`
- `summary`: Advisory sayfasında son üst satırlar hâlâ Haziran 2026’daki Spring AI, Cloud Gateway, Boot, Security, Data ve GraphQL açıklarını gösteriyor; Ağustos’ta yeni üst seviye yayın görünmüyor.
- `why_it_matters`: Haber akışı sessiz olsa bile, destek dışı hattaki servisler bir sonraki yayın dalgasında doğrudan açık pozisyona düşer.
- `java_spring_relevance`: Spring portföyünde birden fazla proje kullanan ekipler için risk artık tek kütüphaneden çok tüm kombinasyonda.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: güvenlik backlog’unu sürüm-backlog ile birleştirmek; destek dışı servisleri görünür kılmak
- `risks`: “şu an advisory yok” diye migration işini ertelemek
- `migration_notes`: servis envanterine `last_supported_fix_lane` alanı ekleyin; unsupported kombinasyonları kırmızı işaretleyin

### Bulgu 6

- `title`: Gunnar Morling’in Hardwood 1.0 hattı, veri-ağır JVM servisleri için izlenmeye değer ama genel Spring ekipleri için düşük öncelikli
- `source`: [Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/) | [A Fast Path for Fixed-Length Lists in Parquet](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/)
- `author`: Gunnar Morling
- `date`: 25 Haziran 2026 | 22 Temmuz 2026
- `category`: `oss-tooling`, `performance`, `data-processing`
- `tags`: `hardwood`, `parquet`, `java21`, `vector-embeddings`, `columnar-io`
- `summary`: Hardwood 1.0, JVM üzerinde hızlı ve hafif Parquet okuma için üretim hazır bir seçenek olarak konumlanıyor; fixed-length list optimizasyonu özellikle embedding benzeri iş yüklerinde dikkat çekiyor.
- `why_it_matters`: Spring servisleri veriyi yalnız OLTP veritabanından değil dosya/tablo formatlarından da işlemeye başladıkça JVM içi columnar IO önem kazanıyor.
- `java_spring_relevance`: analitik batch, veri zenginleştirme veya embedding dosyalarını JVM içinde okuyan Spring ekipleri için anlamlı; tipik REST CRUD servisleri için bugün ikincil.
- `actionability`: `izleme`
- `impact_level`: `düşük-orta`
- `opportunities`: veri-ağır JVM servislerinde daha hafif Parquet işleme; Java 21+ tarafında yüksek performanslı yardımcı araç kullanımı
- `risks`: genel Spring ekosistem raporunda bu sinyali olduğundan büyük yorumlamak
- `migration_notes`: yalnız Parquet/embedding yoğun iş yüklerinde POC yapın; genel kurumsal platform standardına hemen taşımayın

## Sonuç

13 Ağustos 2026 için en güçlü Java / Spring sinyali yeni bir framework özelliği değil, destekli yolun artık açık biçimde ikiye ayrılmasıdır. `Spring Boot 3.5.x` ve `Spring Cloud 2025.0.x` hattı geride bırakılması gereken eski OSS yol; `Boot 4.0/4.1` ve özellikle Spring Cloud kullanan servisler için `2025.1.2` yeni resmi yol haline gelmiş durumda.

Bugün verilmesi gereken teknik karar “hangi yeni feature daha heyecanlı?” değil; her servisin `Boot / Cloud / JDK / bağımlılık` kombinasyonunu görünür kılıp destekli hatta nasıl alınacağını belirlemektir. En doğru kısa vadeli adım, migration backlog’unu framework sürümünden çıkarıp platform destek matrisi olarak yönetmeye başlamaktır.
