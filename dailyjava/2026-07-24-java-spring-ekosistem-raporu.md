# Günlük Java / Spring Ekosistem Raporu

Tarih: 24 Temmuz 2026 Cuma  
Tarama zamanı: 24 Temmuz 2026 23:45 TSİ  
Odak: sözleşme yönetişimi, HTTP istemci modernizasyonu ve aylık JVM güvenlik ritmine hazırlık

Tarama notu: 24 Temmuz 2026 Cuma günü [Spring Blog](https://spring.io/blog/), [Spring Framework 7.0 Release Notes](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-7.0-Release-Notes), [API Versioning in Spring](https://spring.io/blog/2025/09/16/api-versioning-in-spring), [HTTP Service Client Enhancements](https://spring.io/blog/2025/09/23/http-service-client-enhancements), [The state of HTTP clients in Spring](https://spring.io/blog/2025/09/30/the-state-of-http-clients-in-spring), [Spring Kafka What’s New](https://docs.spring.io/spring-kafka/reference/whats-new.html), [Oracle’ın daha sık Java güvenlik güncellemeleri duyurusu](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases), [JDK 26.0.2 release notes](https://www.oracle.com/java/technologies/javase/26-0-2-relnotes.html), [OpenJDK JDK 27 sayfası](https://openjdk.org/projects/jdk/27/), [JEP 523](https://openjdk.org/jeps/523), [Inside Java Quality Outreach Heads-up](https://inside.java/2026/07/20/quality-heads-up/), [This Week in Spring - 21 Temmuz 2026](https://spring.io/blog/2026/07/21/this-week-in-spring-july-21-2026/), [Gunnar Morling’in 22 Temmuz 2026 tarihli Hardwood yazısı](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/), [Baeldung’in 22 Temmuz 2026 tarihli LM Studio + Spring AI yazısı](https://www.baeldung.com/spring-integrating-local-llms-spring-ai-lm-studio), [InfoQ Java yüzeyi](https://www.infoq.com/java/news/) ve [Burak KUTBAY’ın blogu](https://blog.burakkutbay.com/) kontrol edildi. Bugün resmi Spring release yüzeyinde yeni bir GA/patch dalgası görünmedi; en güçlü sinyal yeni sürüm ilanlarından çok, artık ertelenmemesi gereken migration ve operasyon kararlarında oluşuyor.

## Öne Çıkan Başlıklar

- 24 Temmuz 2026 itibarıyla Spring tarafında asıl yüksek etkili konu yeni patch avı değil; Spring Framework 7 ile API versioning, HTTP client gruplama ve `RestTemplate` sonrası istemci standardizasyonunun gerçek backlog maddesine dönüşmesi.
- Oracle, Java güvenlik güncellemelerini aylık ritme kaydırmaya hazırlanıyor ve 18 Ağustos 2026 için ek Java CSPU planlıyor. Bu, JDK patch işini çeyreklik bakım penceresinden çıkarıyor.
- JDK 27 artık Rampdown Phase Two aşamasında; özellik seti donmuş durumda. Küçük pod’larda varsayılan GC davranışı, TLS 1.3 post-quantum hibrit anahtar değişimi ve JFR redaction gibi başlıklar artık “izlemelik fikir” değil, gerçek canary konusu.
- Event-driven servisler için asıl sessiz değişim Spring Kafka 4.1’de: `ackMode`, `ShareAckMode`, `syncShareCommits` ve recoverer kararları teslimat semantiğini daha görünür, ama daha sorumlu hale getiriyor.

## Kritik Güncellemeler

### 1. Spring 7’de API versioning ilk sınıf sözleşme primitive’ine dönüştü

[Spring Framework 7.0 Release Notes](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-7.0-Release-Notes) ve [API Versioning in Spring](https://spring.io/blog/2025/09/16/api-versioning-in-spring) birlikte okunduğunda, versioning artık “header koyup elle route etme” tekniği olmaktan çıkıyor. `ApiVersionStrategy`, versiyon çözümleme, parse, validation ve deprecation hint üretimini framework seviyesine taşıyor; `spring.mvc.apiversion.use.header=API-Version` gibi Boot property’leriyle de operasyonel hale geliyor. Buna `RestTestClient`, `WebTestClient` ve MockMvc tarafındaki destek de eklenmiş durumda.

Bu başlık bugün önemli çünkü kurumsal Spring portföylerinde sürümleme çoğu zaman gateway, controller ve test utility katmanına dağılmış özel kodlarla yönetiliyor. Artık bu dağınıklığın yerini daha tutarlı bir framework kontratı alabiliyor.

### 2. HTTP istemci tarafında gerçek yön değişimi: `@ImportHttpServices` ve `RestTemplate` sonrası dönem

[HTTP Service Client Enhancements](https://spring.io/blog/2025/09/23/http-service-client-enhancements) ve [The state of HTTP clients in Spring](https://spring.io/blog/2025/09/30/the-state-of-http-clients-in-spring) iki kritik şeyi netleştiriyor:

- Spring Framework 7, `@ImportHttpServices` ile HTTP interface client’larını grup bazında kaydedip tek bir yapılandırma yüzeyiyle yönetebiliyor.
- `RestTemplate` için yön artık geri dönmüyor; Spring ekibi 30 Eylül 2025’te niyet beyanını yaptı, Spring Framework `7.1` için resmi `@Deprecated` işaretini Kasım 2026 civarı hedeflediğini açıkça yazdı.

Bu, özellikle çok sayıda dış servis entegrasyonu olan Spring Boot ekiplerinde “bir gün bakarız” seviyesindeki client modernizasyonunun artık takvime bağlanması gerektiği anlamına geliyor.

### 3. Oracle Java patch ritmi hızlanıyor; güvenlik baseline’ı artık aylık konuşulmalı

[Oracle blog duyurusu](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) 20 Temmuz 2026 tarihinde, Java güvenlik güncellemelerinin önümüzdeki yıl boyunca aylık ritme kaydırılacağını ve 18 Ağustos 2026 için ek bir Java CSPU planlandığını açıkladı. [currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) ise 21 Temmuz 2026 itibarıyla destekli baseline’ları görünür kılıyor:

- `26.0.2`
- `25.0.4`
- `21.0.12`
- `17.0.20`

Bu değişim, “uygulamayı üç ayda bir patch’leriz” alışkanlığını zorluyor. JDK artık uygulama release treninden bağımsız, ayrı bir güvenlik tedarik zinciri gerektiriyor.

### 4. JDK 26.0.2 yalnız CVE paketi değil; crypto ve sertifika davranışını da değiştiriyor

[JDK 26.0.2 release notes](https://www.oracle.com/java/technologies/javase/26-0-2-relnotes.html) üç üretim etkili detayı öne çıkarıyor:

- ML-KEM ve ML-DSA private key encoding, RFC `9935` ve `9881` ile uyumlu yeni PKCS #8 formatına taşındı.
- `seed`, `expandedKey` ve `both` seçenekleriyle davranış kontrolü için yeni property yüzeyi eklendi.
- `com.sun.security.crl.maxSize` ile ağ üzerinden indirilen CRL boyutu için varsayılan `20 MiB` sınırı geldi.

Ek olarak, generational ZGC kullanılırken `jdk.OldObjectSample` JFR event’i devre dışı bırakıldı. Bu da “gözlem verisini sonradan toplarız” yaklaşımının bazı runtime kombinasyonlarında artık aynı sonucu vermeyeceğini gösteriyor.

### 5. JDK 27 artık gerçek hazırlık aşamasında

[OpenJDK JDK 27 sayfası](https://openjdk.org/projects/jdk/27/) 24 Temmuz 2026 itibarıyla şunu söylüyor: JDK 27, 16 Temmuz 2026’da Rampdown Phase Two’ya geçti; özellik seti dondu; genel erişim tarihi 15 Eylül 2026. Öne çıkan JEP listesi:

- [JEP 523](https://openjdk.org/jeps/523): G1 artık tüm ortamlarda varsayılan GC
- JEP `527`: TLS `1.3` için post-quantum hibrit key exchange
- JEP `534`: Compact Object Headers by Default
- JEP `536`: JFR in-process data redaction
- JEP `538`: PEM Encodings of Cryptographic Objects

Bugün önemli olan nokta şu: Spring ekipleri için Java 27 artık “çok erken” değil; özellikle küçük container, güvenlik sertleşmesi ve servis gözlemlenebilirliği açısından canary backlog’una alınacak kadar olgunlaştı.

### 6. Spring Kafka 4.1, teslimat semantiğini config dosyasından çıkarıp tasarım kararına dönüştürüyor

[Spring Kafka What’s New](https://docs.spring.io/spring-kafka/reference/whats-new.html) tarafında günün en pratik sinyali:

- `@KafkaListener` artık listener bazında `ackMode` alabiliyor.
- `setExplicitShareAcknowledgment(boolean)` yerine `ShareAckMode` (`EXPLICIT`, `MANUAL`, `IMPLICIT`) geldi.
- `syncShareCommits`, `commitSync()` ile `commitAsync()` arasında bilinçli seçim istiyor.
- Share consumer error handling tarafında `ACCEPT`, `RELEASE`, `REJECT` kararları recoverer üzerinden açık hale geliyor.

Kafka’yı queue benzeri kullanım desenleriyle birleştiren ekiplerde bu, performans ve doğruluk kararlarının artık daha açık belgelendirilmesi gerektiği anlamına geliyor.

## Trendler ve Sinyaller

### Trend Kümesi 1: Sözleşme yönetişimi framework içine taşınıyor

API versioning, HTTP service registry, `RestTestClient`, `ShareAckMode` ve explicit recoverer kararları aynı yönde ilerliyor: framework’ler, daha önce ekiplerin kendi helper katmanlarında yönettiği sözleşmeleri çekirdek primitive’lere dönüştürüyor.

### Trend Kümesi 2: JVM güvenlik patch’i uygulama release treninden ayrışıyor

Oracle’ın aylık güvenlik ritmi planı ile current baseline verisi birlikte okunduğunda, JDK yükseltmesi artık yalnız “yeni özellik” değil; base image, CI matrisi, smoke test ve rollout otomasyonunun ritmini belirleyen ayrı bir operasyon akışı.

### Trend Kümesi 3: Gizli varsayımlar görünür karar yüzeyine dönüşüyor

JDK 27’de default GC seçimi, JDK 26.0.2’de CRL ve private key encoding davranışı, Spring Kafka’da share consumer commit modeli; hepsi “varsayılan bırak geç” yaklaşımını zayıflatıyor.

### Trend Kümesi 4: AI ve veri araçları büyüyor ama çoğu ekip için hâlâ ikincil

[This Week in Spring - 21 Temmuz 2026](https://spring.io/blog/2026/07/21/this-week-in-spring-july-21-2026/) içinde AG-UI ve Capstead gibi Spring AI çevresi araçları öne çıkıyor. [Baeldung’in LM Studio yazısı](https://www.baeldung.com/spring-integrating-local-llms-spring-ai-lm-studio) ve [Gunnar Morling’in Hardwood performans yazısı](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/) ise değerli ama daha niş. Bunlar bugünün çekirdek üretim kararı değil; izlemelik araç hattı.

## Araçlar ve Kütüphaneler

- `ApiVersionStrategy`: yüksek öncelik. API sürümleme helper kodunu framework kontratına taşıyabilir.
- `RestTestClient`: yüksek öncelik. MVC/live server testlerini tek API ile birleştirme fırsatı veriyor.
- `@ImportHttpServices` ve HTTP Service Registry: yüksek öncelik. Çok sayıda dış servis konuşan uygulamalarda istemci konfigürasyonunu sadeleştirebilir.
- `ContainerProperties.ShareAckMode` ve `syncShareCommits`: orta-yüksek öncelik. Kafka share consumer davranışını daha net ayırır.
- `Hardwood` fixed-length list fast path: düşük-orta öncelik. Parquet üstünde embedding veya sabit boyutlu vektör okuyan JVM iş yükleri için anlamlı.
- LM Studio + Spring AI `2.0`: düşük öncelik. Offline ve privacy-sensitive prototiplerde yararlı; genel Spring backend portföyü için ana üretim hattı değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring 7 veya Boot 4 hattına çıkacak ekipler API versioning ve HTTP client modernizasyonunu ayrı backlog maddesi olarak ele almalı; bunu yalnız dependency upgrade diye kapatmak yetersiz.
- `RestTemplate` kullanan servisler için “şimdilik çalışıyor” argümanı zayıflıyor. Yeni özellikler artık `RestClient` ve HTTP interface dünyasında birikiyor.
- Platform ekipleri JDK patch yönetimini Ağustos 2026’dan itibaren aylık güvenlik ritmine göre planlamaya başlamalı.
- Java 27 canary’lerinde explicit GC seçilmiyorsa test matrisi dar kalıyor; özellikle küçük pod’lar ve kısa ömürlü worker’lar ayrı ölçülmeli.
- Kafka kullanan ekipler `ackMode`, share consumer recoverer ve sync/async commit kararlarını SLO ve veri kaybı toleransı ile birlikte belgelendirmeli.

## Fırsatlar ve Riskler

- Fırsat: API versioning ve HTTP service registry ile controller, client ve test katmanlarında dağılmış özel kodu azaltmak.
- Risk: `RestTemplate` modernizasyonunu erteleyip yeni güvenlik, observability ve test primitive’lerinden mahrum kalmak.
- Fırsat: Aylık JDK patch ritmini erkenden kurup güvenlik baseline gerisinde kalma riskini düşürmek.
- Risk: Java patch’lerini uygulama release trenine kilitleyip yeni CSPU ritmini kaçırmak.
- Fırsat: Kafka 4.1 ile teslimat semantiğini daha görünür ve denetlenebilir hale getirmek.
- Risk: `commitAsync()` veya share recoverer kararlarını throughput lehine açıp durability etkisini gözden kaçırmak.
- Fırsat: Java 27’yi Eylül 2026 GA öncesi sınırlı canary ile ölçmek.
- Risk: G1 default, PQ TLS veya JFR davranış farklarını ilk kez prod’da görmek.

## İzlenmesi Gereken Konular

- 18 Ağustos 2026 için planlanan ilk ek Java CSPU’nun gerçekten hangi JDK hatlarına ve hangi kapsamla geldiği
- 15 Eylül 2026 JDK 27 GA öncesi erken erişim derlemelerinde G1 default davranışına ek başka servis etkili değişiklikler çıkıp çıkmadığı
- Spring Framework `7.1` ile `RestTemplate` için resmi `@Deprecated` işaretinin kesinleşmesi
- Spring Kafka share consumer semantiğinin gerçek prod telemetry sonuçları
- Spring AI tarafında AG-UI, Capstead ve local-model entegrasyonlarının deneysel katmandan kalıcı platform desenine dönüşüp dönüşmediği
- Burak KUTBAY blogundaki feature-flag ve rollout disiplini çizgisinin Spring 7/Boot 4 migration programına nasıl bağlanacağı

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring 7 API versioning, sürümlemeyi controller hilesinden framework kontratına taşıyor
- `source`: [Spring Framework 7.0 Release Notes](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-7.0-Release-Notes) | [API Versioning in Spring](https://spring.io/blog/2025/09/16/api-versioning-in-spring)
- `author`: Rossen Stoyanchev
- `date`: 16 Eylül 2025; 24 Temmuz 2026 itibarıyla doğrulandı
- `category`: api-governance, web, testing, migration
- `tags`: api-versioning, apiversionstrategy, restclient, webclient, resttestclient, mockmvc, boot-properties
- `summary`: Spring MVC ve WebFlux artık API versioning için birinci sınıf destek sunuyor. `ApiVersionStrategy`, request version çözümleme, doğrulama ve deprecation hint üretimini yönetiyor; Boot tarafında `spring.mvc.apiversion.use.header` gibi property’lerle aktive edilebiliyor; test tarafında `RestTestClient`, `WebTestClient` ve MockMvc desteği var.
- `why_it_matters`: API sürümleme uzun ömürlü servislerde kaçınılmaz. Framework içi kontrat, dağınık filter/interceptor/helper yaklaşımını azaltıp bakım maliyetini görünür biçimde düşürebilir.
- `java_spring_relevance`: Spring Boot ile çok sürümlü REST API işleten ekipler için doğrudan kritik; test altyapısı ve istemci katmanı da aynı sözleşmeye bağlanabiliyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: sürümleme bilgisini gateway ve controller dışındaki test/istemci katmanında da ortaklaştırmak; deprecation sinyalini kontrollü vermek
- `risks`: mevcut özel versioning kodu ile framework desteğinin çakışması; header/media type/path stratejilerinin yarım geçişte dağılması
- `migration_notes`: repo çapında custom version resolver, header filter ve test utility’lerini envanterleyin; `RestTestClient` ve MockMvc tarafında ortak `ApiVersionInserter` stratejisine geçiş planı çıkarın.

### Bulgu 2

- `title`: HTTP service registry ve `RestTemplate` sonrası dönem, istemci modernizasyonunu takvime bağlıyor
- `source`: [HTTP Service Client Enhancements](https://spring.io/blog/2025/09/23/http-service-client-enhancements) | [The state of HTTP clients in Spring](https://spring.io/blog/2025/09/30/the-state-of-http-clients-in-spring)
- `author`: Rossen Stoyanchev | Brian Clozel
- `date`: 23-30 Eylül 2025; 24 Temmuz 2026 itibarıyla aktif migration konusu
- `category`: http-clients, integration, migration, developer-productivity
- `tags`: importhttpservices, httpserviceproxyfactory, restclient, resttemplate, resttestclient, boot-starters, client-registry
- `summary`: Spring Framework 7, `@ImportHttpServices` ve HTTP Service Registry ile grup bazlı client proxy kaydı sunuyor. Aynı resmi kaynaklar `RestTemplate` için yönün kapanmış olduğunu, Spring Framework `7.1` hattında resmi `@Deprecated` işaretinin planlandığını ve yeni yeteneklerin `RestClient` tarafında biriktiğini söylüyor.
- `why_it_matters`: Çok sayıda dış API tüketen servislerde istemci katmanı kontrolsüz büyür. Registry ve grup konfigürasyonu, bu katmanı yeniden standardize etme fırsatı sunuyor.
- `java_spring_relevance`: Dış servis konuşan Spring Boot mikroservisleri, edge servisleri ve BFF katmanları için doğrudan etkili.
- `actionability`: `planli_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: dış servis istemcilerini grup bazında ortak timeout, auth, header ve observability politikalarına bağlamak
- `risks`: `RestTemplate` bağımlılığını sürdürüp yeni özelliklerden kopmak; kısmi geçişte iki farklı istemci standardı taşımak
- `migration_notes`: `RestTemplate`, `TestRestTemplate` ve manuel `HttpServiceProxyFactory` kullanımını aratın; yeni client’ları doğrudan `RestClient` + `@ImportHttpServices` ile başlatın; eski istemciler için domain bazlı geçiş sırası belirleyin.

### Bulgu 3

- `title`: Oracle, aylık Java güvenlik güncellemelerine hazırlanıyor; destekli baseline’lar 21 Temmuz 2026’da yenilendi
- `source`: [Transitioning Java to more frequent security updates](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) | [currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases)
- `author`: Donald Smith | Oracle Java team
- `date`: 20-21 Temmuz 2026
- `category`: runtime-governance, security, operations
- `tags`: oracle-jdk, cspu, monthly-updates, 26.0.2, 25.0.4, 21.0.12, 17.0.20, base-image
- `summary`: Oracle, Java güvenlik güncelleme sürecini aylık ritme kaydırmayı planladığını ve 18 Ağustos 2026 için ek bir Java CSPU hedeflediğini açıkladı. Aynı anda destekli sürüm yüzeyinde `26.0.2`, `25.0.4`, `21.0.12` ve `17.0.20` baseline’ları görünür hale geldi.
- `why_it_matters`: JVM patch disiplini artık uygulama sürümünden ayrı bir teslimat zinciri gerektiriyor. Güvenlik baseline’ını kaçırmak daha kolay, telafisi ise daha pahalı olacak.
- `java_spring_relevance`: Spring uygulamalarının tamamı çalıştığı JVM’e bağımlı. Container image, CI, smoke test ve rollout zinciri bu ritim değişiminden doğrudan etkilenecek.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: JDK envanterini otomatikleştirmek; base image rebuild ve rollout sürecini sıklaştırmak
- `risks`: güvenlik baseline gerisinde kalmak; çeyreklik patch varsayımını sürdürüp CSPU ritmine hazırlıksız yakalanmak
- `migration_notes`: servis bazında JDK sürüm envanteri çıkarın; JDK patch yayınını uygulama release’inden bağımsız pipeline olarak tanımlayın; 18 Ağustos 2026 tarihini şimdiden bakım takvimine ekleyin.

### Bulgu 4

- `title`: JDK 26.0.2, kripto anahtar formatı ve CRL davranışında sessiz ama üretim etkili değişiklikler getiriyor
- `source`: [JDK 26.0.2 Release Notes](https://www.oracle.com/java/technologies/javase/26-0-2-relnotes.html)
- `author`: Oracle Java team
- `date`: 21 Temmuz 2026
- `category`: cryptography, security, runtime-behavior, observability
- `tags`: jdk26.0.2, ml-kem, ml-dsa, pkcs8, crl, certpath, generational-zgc, jfr
- `summary`: JDK `26.0.2`, ML-KEM ve ML-DSA private key encoding formatını yeni RFC’lerle uyumlu hale getiriyor; `seed`/`expandedKey`/`both` seçenekleriyle davranış kontrolü ekliyor; ayrıca `com.sun.security.crl.maxSize` ile varsayılan `20 MiB` CRL indirme sınırı getiriyor. Generational ZGC altında `jdk.OldObjectSample` JFR event’i de kapatılmış durumda.
- `why_it_matters`: Patch sürümleri yalnız CVE listesi değildir. Kripto ve sertifika doğrulama davranışı değiştiğinde, mTLS ve compliance akışları sessizce etkilenebilir.
- `java_spring_relevance`: Spring Security, mTLS, kurumsal PKI, outbound TLS ve JFR tabanlı sorun analizi kullanan Java servislerinde doğrudan önemlidir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: PKI ve certpath davranışını daha kontrollü hale getirmek; güvenlik testi ile runtime gözlemlenebilirliğini yeniden hizalamak
- `risks`: eski private key encoding beklentileriyle uyumsuzluk; büyük CRL’lerin sessizce elenmesi; JFR event kaybını fark etmemek
- `migration_notes`: PQC veya custom PKI kullanan sistemlerde key encode/decode testleri çalıştırın; CRL boyut eşiğini ve `certpath` debug çıktısını doğrulayın; generational ZGC kullanan ortamlarda JFR dashboard beklentilerini gözden geçirin.

### Bulgu 5

- `title`: JDK 27, 16 Temmuz 2026’dan beri feature-frozen; küçük ortamlarda default G1 artık gerçek davranış değişimi
- `source`: [OpenJDK JDK 27 page](https://openjdk.org/projects/jdk/27/) | [JEP 523](https://openjdk.org/jeps/523) | [Inside Java Quality Outreach Heads-up](https://inside.java/2026/07/20/quality-heads-up/)
- `author`: OpenJDK | Thomas Schatzl | Nicolai Parlog
- `date`: 16-20 Temmuz 2026
- `category`: jvm, gc, security, release-planning
- `tags`: jdk27, rampdown-phase-two, g1-default, jep523, pq-tls, compact-headers, jfr-redaction, ga-2026-09-15
- `summary`: JDK 27, 16 Temmuz 2026’da Rampdown Phase Two’ya geçti; özellik seti dondu; hedef genel erişim tarihi 15 Eylül 2026. Bu release içinde G1’in tüm ortamlarda varsayılan hale gelmesi, TLS `1.3` PQ hibrit key exchange, compact object headers, JFR in-process redaction ve PEM encoding başlıkları var.
- `why_it_matters`: Artık sadece laboratuvar merakı değil; Eylül 2026 GA öncesi sınırlı canary için yeterince somut ve stabil bir yüzey oluştu.
- `java_spring_relevance`: Spring Boot servislerinin büyük bölümü explicit GC seçmeden ve default TLS/JFR davranışlarıyla çalışır. Bu nedenle davranış farkı doğrudan servis gecikmesi, güvenlik ve diagnostiğe yansıyabilir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: Java 27 canary standardı kurmak; explicit GC ve TLS gözlemlerini platform politikası haline getirmek
- `risks`: küçük pod’larda GC davranışını üretimde ilk kez görmek; yeni security/serviceability primitive’lerini ölçmeden GA’ya girmek
- `migration_notes`: düşük CPU/bellek pod’larında Java 27 karşılaştırmalı benchmark çalıştırın; explicit GC seçimi yapıp yapmayacağınıza karar verin; PQ TLS ve JFR redaction etkisini security/observability ekipleriyle birlikte test edin.

### Bulgu 6

- `title`: Spring Kafka 4.1, share consumer teslimat modelini açık seçimlere zorluyor
- `source`: [Spring Kafka What’s New](https://docs.spring.io/spring-kafka/reference/whats-new.html)
- `author`: Spring Kafka ekibi
- `date`: 24 Temmuz 2026 itibarıyla geçerli dokümantasyon
- `category`: messaging, event-driven, reliability, operations
- `tags`: spring-kafka, shareackmode, ackmode, syncsharecommits, commitasync, recoverer, dlq
- `summary`: Spring Kafka `4.1`, listener bazında `ackMode`, share consumer için `ShareAckMode`, `syncShareCommits` ve açık recoverer kararlarını getiriyor. Böylece throughput, durability ve hata işleme semantiği container factory içinden çıkıp servis tasarım kararına dönüşüyor.
- `why_it_matters`: Kafka ile queue semantiği karıştırıldığında en çok sessiz hata burada çıkar. Framework artık bu kararları saklamıyor; ekiplerin de saklamaması gerekiyor.
- `java_spring_relevance`: Spring Boot ile Kafka consumer işleten, retry/requeue davranışı kritik olan ve share consumer kullanan ekipler için yüksek önem taşır.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: servis bazında açık teslimat sözleşmesi tanımlamak; telemetry ile commit/durability dengesini daha iyi kurmak
- `risks`: `commitAsync()` kullanımını yanlış yorumlamak; `RELEASE`/`REJECT` kararlarını veri modeliyle uyumsuz seçmek
- `migration_notes`: `@KafkaListener`, `ContainerProperties`, error handler ve recoverer kullanımını tarayın; share consumer olan hatlarda `ackMode` ve commit stratejisini yazılı hale getirin; rollout’u telemetry eşliğinde yapın.

### Bulgu 7

- `title`: Yerel model ve JVM veri araçları hareketli, ama çoğu Spring portföyü için hâlâ düşük öncelikli keşif hattı
- `source`: [This Week in Spring - July 21st, 2026](https://spring.io/blog/2026/07/21/this-week-in-spring-july-21-2026/) | [Integrating Local LLMs with Spring AI Using LM Studio](https://www.baeldung.com/spring-integrating-local-llms-spring-ai-lm-studio) | [A Fast Path for Fixed-Length Lists in Parquet](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/) | [Burak KUTBAY Blog](https://blog.burakkutbay.com/)
- `author`: Josh Long | Manfred Ng | Gunnar Morling | Burak KUTBAY
- `date`: 21-22 Temmuz 2026 ve mevcut blog yüzeyleri
- `category`: ai-platform, tooling, data-performance
- `tags`: spring-ai, lm-studio, local-llm, ag-ui, capstead, hardwood, parquet, embeddings, feature-flags
- `summary`: Josh Long’un haftalık özetinde AG-UI ve Capstead gibi Spring AI etrafı araçlar öne çıkıyor. Baeldung, Spring AI `2.0` ile LM Studio üzerinden lokal chat + embedding model entegrasyonunu gösteriyor. Gunnar Morling ise Hardwood’da fixed-length list fast path ile Parquet üzerinde özellikle embedding benzeri veri için anlamlı hızlanma raporluyor. Burak KUTBAY tarafında ise feature-flag ve kontrollü rollout çizgisi migration disiplini için hâlâ geçerli.
- `why_it_matters`: AI ve veri araçları tarafında seçenek artıyor; fakat bunların çoğu çekirdek Spring backend standardından çok, belirli kullanım senaryolarında değer üretiyor.
- `java_spring_relevance`: Local LLM, privacy-sensitive PoC, retrieval/embedding boru hatları veya veri yoğun JVM iş yükleri olan ekipler için anlamlı; genel mikroservis portföyü için ikincil.
- `actionability`: `izlemelik`
- `impact_level`: `düşük-orta`
- `opportunities`: offline AI prototipleri; embedding/parquet okuma hızında niş optimizasyon; rollout güvenliğini feature-flag disipliniyle güçlendirmek
- `risks`: erken üretimleşme; lokal model operasyon maliyetini küçümsemek; niş veri optimizasyonunu genel platform önceliği sanmak
- `migration_notes`: yerel model entegrasyonlarını prod standardı değil lab lane olarak tutun; Parquet/embedding yoğunluğu gerçekten varsa Hardwood benzeri optimizasyonları PoC ile ölçün; rollout güvenliği için feature-flag kararlarını migration programına bağlayın.

## Sonuç

24 Temmuz 2026 Cuma günü Java/Spring tarafında en anlamlı gündem yeni bir release listesi değil; sözleşme ve operasyon borcunun görünür hale gelmesi. Kısa vadede en yüksek getirili hamleler: API versioning ve HTTP client modernizasyonunu backlog’a resmen sokmak, JDK patch ritmini Ağustos 2026 aylık güvenlik temposuna göre yeniden kurmak, Java 27 için constrained-environment canary hazırlamak ve Kafka teslimat semantiğini açık karar haline getirmek.
