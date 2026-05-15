# Günlük Java / Spring Ekosistem Raporu

Tarih: 15 Mayıs 2026  
Tarama zamanı: 15 Mayıs 2026 09:08 TSİ  
Odak: Spring 4.1 RC ekosistemi, güvenlik ve entegrasyon sertleşmesi, JDK 26/27 ağ ve concurrency primitive'leri

Tarama notu: Bu rapor hazırlanırken önce [Official Spring Blog](https://spring.io/blog/), [Spring Projects](https://spring.io/projects/), [Spring Cloud release docs](https://docs.spring.io/spring-cloud-release/reference/spring-projects.html), [Spring Security docs](https://docs.spring.io/spring-security/reference/index.html), [Inside Java](https://inside.java/), [OpenJDK JEP Index](https://openjdk.org/jeps/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/spring-boot-4-spring-framework-7), [Josh Long'un 12 Mayıs 2026 notu](https://spring.io/blog/2026/05/12/this-week-in-spring-may-12-2026), [Gunnar Morling'in blogu](https://www.morling.dev/), ilgili GitHub release sayfaları, [Moderne/OpenRewrite migration içeriği](https://www.moderne.ai/blog/spring-boot-4x-migration-guide) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. 14 Mayıs 2026 raporundaki Mayıs release-train kayması, Spring support boundary sertleşmesi ve JDK 27 launcher option kaldırımları bu raporda ana başlık olarak tekrar edilmedi. Bugünün daha kalıcı sinyali; Spring 4.1 hattının RC seviyesinde ekosistemleşmesi ve JDK tarafında doğrudan servis mimarisini etkileyen HTTP/3, post-quantum TLS ve structured concurrency yönünün netleşmesi.

## Öne Çıkan Başlıklar

- Spring ekosistemi için asıl haber artık tek bir `Spring Boot 4.1.0-RC1` sürümü değil; [Security 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-security-releases), [Integration 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available), [Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4), [Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released) ve diğer yan projelerle birlikte gerçek bir pre-GA entegrasyon penceresi oluşmuş olması.
- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), sadece hata düzeltmesi getirmiyor; OTLP exporter environment variable desteği, `InetAddressFilter` tabanlı SSRF azaltımı ve `LazyConnectionDataSourceProxy` desteği ile gözlemlenebilirlik, ağ güvenliği ve transaction davranışına dokunuyor.
- [Spring Security 2026.04 sürümleri](https://spring.io/blog/2026/04/21/spring-security-releases) yedi farklı CVE kapatıyor. Aynı anda [Spring Security 7.1 API/docs](https://docs.spring.io/spring-security/reference/7.1/api/java/org/springframework/security/config/annotation/authorization/EnableMultiFactorAuthentication.html) MFA koşulları ve [PreFlightRequestFilter](https://docs.spring.io/spring-framework/docs/7.1.0-SNAPSHOT/javadoc-api/org/springframework/web/filter/PreFlightRequestFilter.html) gibi çerçeve hizalı güvenlik primitive'lerini görünür hale getiriyor.
- Messaging ve koordinasyon tarafında [Spring Integration 7.1 RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available), [Spring Kafka 4.1 RC1](https://spring.io/blog/2026/04/22/spring-kafka-4) ve [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released) birlikte okunduğunda, dağıtık lock, paylaşılmış consumer semantiği ve job transaction handling artık framework düzeyinde daha güçlü hale geliyor.
- OpenJDK tarafında [Structured Concurrency JEP 533'ün JDK 27'ye yedinci preview olarak hedeflenmesi](https://inside.java/2026/05/11/jep533-target-jdk27/), [HTTP/3'ün JDK 26'ya gelmiş olması](https://openjdk.org/jeps/517) ve [post-quantum hibrit TLS 1.3'ün JDK 27'de default tercih sırasına girmesi](https://openjdk.org/jeps/527) Java servis runtime'ı için orta vadeli etkisi yüksek sinyaller.

## Kritik Güncellemeler

### 1. Spring 4.1 artık tek ürün değil, RC dalgası

[Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now) tek başına değerlendirildiğinde önemli ama asıl anlamı, [InfoQ'nun 27 Nisan 2026 tarihli roundup'ında](https://www.infoq.com/news/2026/04/spring-news-roundup-apr20-2026/) görüldüğü gibi Security, Integration, Kafka, AMQP, Vault, Session ve LDAP taraflarının da aynı dönemde RC çizgisine taşınmış olması. Bu, kurumsal ekipler için "GA çıkınca bakarız" evresinden "RC üstünde çapraz entegrasyon testleri açılmalı" evresine geçildiği anlamına geliyor.

### 2. Security tarafı patch değil, mimari borç uyarısı veriyor

[Spring Security 6.5.10, 7.0.5 ve 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-security-releases) hattı; `DaoAuthenticationProvider`, X.509 impersonation, `withIssuerLocation`, servlet path matching ve dynamic client registration dahil birden fazla yüzeyde CVE kapatıyor. Bu yalnızca "patch alın" uyarısı değil. Aynı anda [MFA desteği](https://docs.spring.io/spring-security/reference/servlet/authentication/mfa.html) ve [`@EnableMultiFactorAuthentication`](https://docs.spring.io/spring-security/reference/7.1/api/java/org/springframework/security/config/annotation/authorization/EnableMultiFactorAuthentication.html) ile authorization modelinin daha policy-driven hale geldiği de görülüyor.

### 3. Messaging ve coordination primitive'leri daha operasyonel hale geliyor

[Spring Integration 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available) içindeki Redis `CAS/CAD` kullanımı, eski Lua fallback'ini korurken yeni Redis sürümlerinde lock yenileme ve bırakma davranışını daha deterministik hale getiriyor. [Spring Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4) tarafındaki `ShareAckMode` ve async commit callback görünürlüğü de Kafka 4 paylaşılmış consumer modelini daha pratik hale getiriyor. [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released) ile gelen JobRunr transaction handling ve `@ModuleSlicing` iyileştirmeleri bu hattı tamamlıyor.

### 4. JDK ağ ve concurrency katmanı doğrudan backend mimarisine yaklaşıyor

[JEP 517](https://openjdk.org/jeps/517) ile JDK `HttpClient` artık HTTP/3'ü opt-in destekliyor. [JEP 527](https://openjdk.org/jeps/527) ile JDK 27, TLS 1.3 için hibrit post-quantum key exchange gruplarını ekliyor ve `X25519MLKEM768` grubunu default tercih sırasının başına koyuyor. Buna karşılık [Structured Concurrency](https://inside.java/2026/05/11/jep533-target-jdk27/) hâlâ preview çizgisinde; yani yön net, ama API yüzeyi henüz "kurumsal shared library standardı" statüsünde değil.

## Trendler ve Sinyaller

### 1. Spring 4.1 için doğru yaklaşım, erken ama kontrollü entegrasyon testi

RC seviyesi artık yalnız Spring Boot ile sınırlı değil. Security, Integration, Kafka ve Modulith RC'leri birlikte geldiği için kurum içi starter, auth, tracing, messaging ve data access kombinasyonlarını ayrı bir pre-GA lane üzerinde test etmek daha rasyonel hale geldi.

### 2. Güvenlik, artık yalnız patch cadence değil; runtime davranışının parçası

SSRF azaltımı, pre-flight filtreleme, factor-based authorization ve path matching düzeltmeleri, güvenliğin ayrı bir güvenlik kütüphanesi katmanı olmaktan çıkıp framework davranışına gömüldüğünü gösteriyor.

### 3. Dağıtık koordinasyon primitive'leri framework seviyesinde olgunlaşıyor

Redis lock semantiği, Kafka share consumer davranışı ve JobRunr transaction handling iyileştirmeleri; mikroservis ve event-driven ekiplerin yıllardır elle çözdüğü ağrı noktalarının doğrudan Spring ekosistemi içine geri geldiğini gösteriyor.

### 4. JDK artık ağ ve servis iletişimi katmanına daha yakın

HTTP/3 ve post-quantum TLS gibi değişiklikler, JVM'i sadece "uygulamayı çalıştıran katman" olmaktan çıkarıp ağ davranışını etkileyen bir mimari bileşene dönüştürüyor. Bu özellikle Spring dışı HTTP client kullanan iç SDK'lar ve platform ekipleri için önemli.

### 5. Migration automation, büyük geçişlerde opsiyon olmaktan çıkıyor

[InfoQ Spring team paneli](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) ve [Josh Long'un 12 Mayıs notu](https://spring.io/blog/2026/05/12/this-week-in-spring-may-12-2026) birlikte okunduğunda, OpenRewrite/Moderne ekseninin artık tanıtım malzemesi değil gerçek upgrade altyapısı olarak görüldüğü anlaşılıyor.

## Araçlar ve Kütüphaneler

- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now): OTLP environment variable uyumu, `InetAddressFilter` ile SSRF azaltımı ve `LazyConnectionDataSourceProxy` desteği nedeniyle yüksek öncelikli izleme adayı.
- [Spring Integration 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available): Redis tabanlı distributed lock kullanan ekipler için RC seviyesinde bile anlamlı teknik değer taşıyor.
- [Spring for Apache Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4): Kafka 4 queue/share consumer benimseyen takımlar için pratik etkisi yüksek.
- [OpenRewrite / Moderne Boot 4 migration rehberi](https://www.moderne.ai/blog/spring-boot-4x-migration-guide): Özellikle çok servisli portföylerde upgrade operasyonunu recipe bazlı hale getirmek için güçlü aday.
- Düşük öncelik ama izlenebilir: [Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/) Java 21+ üzerinde Parquet inceleme ve veri servisleri için ilginç; fakat tipik Spring Boot CRUD servisleri için bugün ana akım değil.
- Kubernetes, container build, Spring Cloud Kubernetes ve observability tarafında bugün tek başına roadmap değiştirecek yeni resmi duyuru görmedim.

## Java / Spring Geliştiricileri İçin Etkiler

- Boot `4.1` için ayrı bir pre-GA test lane açın. Özellikle iç starter'lar, security config'leri, tracing/exporter ayarları ve database proxy davranışları bu lane'e girmeli.
- Outbound HTTP kullanan servislerde `InetAddressFilter` ve SSRF azaltımının mevcut allowlist/blocklist mantığınızla nasıl örtüştüğünü test edin.
- Spring Security kullanan servislerde path matching, issuer discovery, X.509 auth ve dynamic client registration akışları için regresyon testlerini güncelleyin.
- Redis ile lock renewal yapan scheduler/job altyapınız varsa Spring Integration `7.1` hattını laboratuvar ortamında deneyin; Redis `8.4+` avantajı gerçek olabilir.
- Kafka 4 share consumer kullanmayı düşünüyorsanız Spring Kafka `4.1` ile ack/commit görünürlüğünü erken test edin; bu alan prod'da değil pilotta doğrulanmalı.
- JDK `HttpClient` kullanan iç SDK'larınız varsa HTTP/3'ü deneysel olarak test etmeye başlayın. Ancak Reactor Netty veya Apache HttpClient kullanan Spring uygulamaları bu avantajı otomatik olarak almaz; client stack ayrımı net tutulmalı.
- Virtual thread denemeleri yapıyorsanız structured concurrency API'lerini public platform sözleşmelerine sokmayın; preview durumunu koruyun.

## Fırsatlar ve Riskler

- Fırsat: RC ekosisteminin genişliği, Haziran başındaki release-train öncesinde daha gerçekçi entegrasyon testi yapma şansı veriyor.
- Fırsat: Spring Security 7.1 ile MFA ve authorization modelini daha merkezi bir policy haline getirmek mümkün.
- Fırsat: HTTP/3 ve PQ TLS yönü, platform ekiplerinin orta vadeli ağ yol haritasını JVM katmanıyla hizalamasını kolaylaştırabilir.
- Fırsat: OpenRewrite reçeteleri, Boot 4 geçişini tek tek ekiplerin el emeği yerine merkezi bir modernizasyon hattına dönüştürebilir.
- Risk: RC sürümlerini "hemen üretime geçelim" dürtüsüyle almak, faydadan çok koordinasyon maliyeti üretebilir.
- Risk: Spring Security patch'lerini geciktirmek, yalnız açık bırakmak değil kimlik ve path matching davranışını yanlış sürümde dondurmak anlamına gelebilir.
- Risk: JDK network yeniliklerini tüm Java HTTP stack'lerinin otomatik kazanımı sanmak yanlış olur; JDK `HttpClient` ile Reactor/Netty dünyası ayrışıyor.
- Risk: Structured Concurrency hâlâ preview olduğundan, kurumsal shared library içine erken gömülmesi ileride API geri dönüş maliyeti yaratabilir.

## İzlenmesi Gereken Konular

- `1-5 Haziran 2026` penceresindeki Spring OSS release-train ve özellikle `Spring Boot 4.1 GA`.
- `Spring Security 7.1 GA` öncesinde MFA, factor authorization ve pre-flight filter entegrasyonlarının son şekli.
- `Spring Integration 7.1` ve `Spring Kafka 4.1` GA sürümlerinde RC davranışlarının korunup korunmadığı.
- JDK 27 için `Structured Concurrency` preview statüsünün devam edip etmeyeceği ve ek Loom JEP'leri.
- JDK 27 post-quantum TLS gruplarının gerçek dünyadaki proxy, LB ve service mesh katmanlarında ne kadar problemsiz çalıştığı.
- Düşük öncelik: Java veri servisleri ve Spring Batch tarzı hatlarda Hardwood benzeri Java 21+ minimal-dependency veri araçlarının olgunlaşması.
- Burak KUTBAY blogundaki [API versiyonlama](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/) ve [HTTP Service Client](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/) içerikleri hâlâ iyi bağlam sağlıyor; ancak bugün yeni bir üretim alarmı üretmiyorlar.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring 4.1 RC ekosistemi genişledi; kurumsal test penceresi artık gerçek
- source: [Spring Boot 4.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), [Spring Security 2026.04 Releases](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Integration 7.1.0-RC1 Available](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available), [Spring for Apache Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4), [Spring News Roundup: First Release Candidates of Boot, Security, Integration, Modulith, AMQP](https://www.infoq.com/news/2026/04/spring-news-roundup-apr20-2026/)
- author: Andy Wilkinson; Josh Cummings; Glenn Renfro; Soby Chacko; Michael Redlich
- date: 21-27 Nisan 2026
- category: release-train, platform-readiness
- tags: spring-boot-4-1, spring-security-7-1, spring-integration-7-1, spring-kafka-4-1, rc, enterprise-test-lane
- summary: Spring 4.1 hattı artık tek başına Boot preview'si değil; security, integration, Kafka ve diğer yan projelerle beraber gerçek bir release-train provasına dönüşmüş durumda.
- why_it_matters: Kurum içi shared library, auth, tracing ve messaging kombinasyonlarının gerçekçi biçimde test edilebilmesi için gereken sinyal artık mevcut.
- java_spring_relevance: Enterprise Spring Boot ve Spring Cloud ekipleri için çok yüksek.
- actionability: planli_aksiyon
- impact_level: yüksek
- opportunities: GA öncesi uyumluluk hatalarını daha ucuz yakalamak; iç platform bileşenlerini önceden doğrulamak.
- risks: RC'leri doğrudan prod adayı saymak; sadece Boot parent sürümünü yükseltip yan projeleri test dışı bırakmak.
- migration_notes: `Boot 4.1` lane'i, security, messaging, persistence ve observability kombinasyonlarını birlikte test edecek şekilde tasarlanmalı.

### Bulgu 2

- title: Spring Boot 4.1.0-RC1 observability, ağ güvenliği ve transaction davranışına dokunuyor
- source: [Spring Boot 4.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), [InfoQ roundup](https://www.infoq.com/news/2026/04/spring-news-roundup-apr20-2026/)
- author: Andy Wilkinson; Michael Redlich
- date: 23 Nisan 2026 ve 27 Nisan 2026
- category: platform, observability, security
- tags: spring-boot-4-1, otlp, inetaddressfilter, lazyconnectiondatasourceproxy, runtime-behavior
- summary: Boot `4.1.0-RC1`; OTLP SDK exporter environment variable desteği, `InetAddressFilter` ile HTTP client SSRF azaltımı ve `LazyConnectionDataSourceProxy` desteği getiriyor.
- why_it_matters: Bu üç başlık uygulama dışı gibi görünse de production davranışını, outbound network erişimini ve transaction semantiğini doğrudan etkiliyor.
- java_spring_relevance: Spring Boot tabanlı servisler, platform ekipleri ve gözlemlenebilirlik altyapısı kullanan takımlar için yüksek.
- actionability: hizli_pilot
- impact_level: orta-yüksek
- opportunities: Daha standart OTLP konfigürasyonu, outbound güvenlik kuralı standardizasyonu ve connection acquisition davranışında iyileşme.
- risks: SSRF azaltımının mevcut allowlist yaklaşımıyla çatışması; transaction davranışında beklenmeyen değişim; environment variable tabanlı exporter konfigürasyonunda yanlış varsayımlar.
- migration_notes: Outbound HTTP policy testleri, OTLP env tabanlı deploy konfigürasyonu ve transaction integration testleri güncellenmeli.

### Bulgu 3

- title: Spring Security 2026.04 sürümleri hem CVE kapatıyor hem de 7.1 authorization modeline işaret ediyor
- source: [Spring Security 2026.04 Releases - Contains CVE Fixes](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Security MFA docs](https://docs.spring.io/spring-security/reference/servlet/authentication/mfa.html), [EnableMultiFactorAuthentication API](https://docs.spring.io/spring-security/reference/7.1/api/java/org/springframework/security/config/annotation/authorization/EnableMultiFactorAuthentication.html), [PreFlightRequestFilter API](https://docs.spring.io/spring-framework/docs/7.1.0-SNAPSHOT/javadoc-api/org/springframework/web/filter/PreFlightRequestFilter.html)
- author: Josh Cummings; Spring Security team; Rossen Stoyanchev
- date: 21 Nisan 2026 ve güncel 7.1 dokümantasyonu
- category: security, authentication, authorization
- tags: spring-security, cve, mfa, preflight, x509, path-matching, authorization-manager
- summary: `6.5.10`, `7.0.5` ve `7.1.0-RC1`; kimlik doğrulama, X.509, issuer discovery ve path matching alanlarında kritik düzeltmeler içeriyor. Aynı dönemde 7.1 dokümantasyonu, MFA ve pre-flight filtreleme gibi policy-temelli güvenlik yapılarını daha görünür hale getiriyor.
- why_it_matters: Edge servislerdeki güvenlik sorunları çoğu zaman uygulama iş kodundan değil yanlış matcher, yanlış filter zinciri veya eksik authz politikalarından kaynaklanır.
- java_spring_relevance: API gateway, auth server, resource server ve servlet tabanlı web servisler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: MFA'yı ad-hoc kod yerine merkezi politika olarak kurmak; CORS/pre-flight akışlarını daha doğru yönetmek.
- risks: Eski path matching varsayımlarında kalmak; X.509 ve issuer discovery akışlarında açık bırakmak; çok faktörlü auth'ı ürünleşmeden önce zayıf tasarlamak.
- migration_notes: Security regression suite içine issuer discovery, X.509, path matcher ve pre-flight senaryoları eklenmeli. `7.1` özellikleri önce pilotta doğrulanmalı.

### Bulgu 4

- title: Integration, Kafka ve Modulith RC'leri dağıtık koordinasyonu daha deterministik hale getiriyor
- source: [Spring Integration 7.1.0-RC1 Available](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available), [Spring for Apache Kafka 4.1.0-RC1, 4.0.5, and 3.3.15 Available](https://spring.io/blog/2026/04/22/spring-kafka-4), [Spring Modulith 2.1 RC1, 2.0.6, and 1.4.11 released](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released), [InfoQ roundup](https://www.infoq.com/news/2026/04/spring-news-roundup-apr20-2026/)
- author: Glenn Renfro; Soby Chacko; Oliver Drotbohm; Michael Redlich
- date: 21-27 Nisan 2026
- category: integration, messaging, distributed-systems
- tags: redis-lock, kafka-share-consumer, async-commit, modulith, jobrunr, eventing
- summary: Redis lock renewal/release için native `CAS/CAD`, Kafka share consumer tarafında daha net ack/commit davranışı ve Modulith tarafında JobRunr transaction handling iyileştirmeleri geliyor.
- why_it_matters: Bu başlıklar nadir görülen ama pahalı üretim arızalarının çıktığı koordinasyon katmanına dokunuyor.
- java_spring_relevance: Event-driven sistemler, scheduler'lar, job processing ve Kafka/Redis yoğun servisler için yüksek.
- actionability: pilot_aksiyon
- impact_level: yüksek
- opportunities: Kendi lock/coordination glue kodunu azaltmak; event publication ve job akışlarını daha güvenilir hale getirmek.
- risks: RC sürüm davranışının prod koşullarında yeterince sınanmaması; Redis/Kafka davranışlarını sürüm farkıyla yanlış yorumlamak.
- migration_notes: Redis `8.4+` ile eski fallback davranışları yan yana test edilmeli; Kafka share consumer ve JobRunr akışları yük testine sokulmalı.

### Bulgu 5

- title: Structured Concurrency, JDK 27'de hâlâ preview ve bu önemli bir sinyal
- source: [JEP targeted to JDK 27: 533: Structured Concurrency (7th Preview)](https://inside.java/2026/05/11/jep533-target-jdk27/), [InfoQ Java News Roundup](https://www.infoq.com/news/2026/05/java-news-roundup-apr27-2026/)
- author: Alan Bateman; Viktor Klang; Ron Pressler; Michael Redlich
- date: 4 Mayıs 2026 ve 11 Mayıs 2026
- category: jdk, concurrency, loom
- tags: jdk-27, structured-concurrency, preview, virtual-threads, cancellation, observability
- summary: Structured Concurrency, JDK 27 için yedinci preview olarak hedeflenmiş durumda. Yön kararlı, ama API hâlâ nihai değil.
- why_it_matters: Sanal thread'lerle ilerleyen ekipler, concurrency modelini daha okunur hale getirmek isteyecek; fakat preview API'yi shared platform sözleşmesine gömmek geri dönüş maliyeti yaratabilir.
- java_spring_relevance: Virtual thread benimseyen Java/Spring ekipleri ve iç SDK geliştiren platform ekipleri için orta-yüksek.
- actionability: izle_ve_pilotla
- impact_level: orta-yüksek
- opportunities: Daha temiz cancellation, hata toplama ve task scope yönetimi.
- risks: Preview churn; framework dışı concurrency abstraction'larının erken standartlaşması; vendor/JDK kombinasyonlarında beklenmeyen davranış farkları.
- migration_notes: Structured Concurrency kullanımı deneysel modül veya adapter arkasına alınmalı; public API'ye erken taşınmamalı.

### Bulgu 6

- title: OpenJDK ağ katmanı hız ve güvenlik tarafında somut ilerliyor: HTTP/3 ve post-quantum TLS
- source: [JEP 517: HTTP/3 for the HTTP Client API](https://openjdk.org/jeps/517), [JEP 527: Post-Quantum Hybrid Key Exchange for TLS 1.3](https://openjdk.org/jeps/527)
- author: Daniel Fuchs; Jamil Nimeh
- date: JEP güncellemeleri Ocak-Şubat 2026, etkileri JDK 26 ve JDK 27
- category: jdk, networking, security
- tags: http3, quic, java-http-client, tls13, pqc, named-groups
- summary: JDK 26, `HttpClient` için HTTP/3 opt-in desteği getiriyor. JDK 27 ise TLS 1.3 için hibrit post-quantum named group'ları ekliyor ve `X25519MLKEM768` grubunu default tercih sırasının başına koyuyor.
- why_it_matters: Java servislerinin outbound iletişim davranışı, TLS handshake özellikleri ve uzun vadeli güvenlik varsayımları değişmeye başlıyor.
- java_spring_relevance: Java `HttpClient` kullanan iç SDK'lar, gateway egress katmanı ve güvenlik/performans odaklı servisler için yüksek; tipik Reactor Netty uygulamaları için dolaylı.
- actionability: izle_ve_pilotla
- impact_level: orta-yüksek
- opportunities: Daha hızlı handshake ve daha dayanıklı transport; orta vadede kuantum-sonrası güvenlik uyumu.
- risks: Proksi/LB/service mesh zincirinin hazır olmaması; belirli named group override'larının JDK varsayılan faydasını devre dışı bırakması; Spring'in kullandığı HTTP client stack'leri arasında yanlış genelleme yapılması.
- migration_notes: Laboratuvar ortamında HTTP/3 denemeleri yapılmalı; TLS handshake ve named group davranışı mevcut ingress/proxy katmanıyla test edilmeli.

### Bulgu 7

- title: OpenRewrite tabanlı migration otomasyonu, Boot 4.x geçişi için artık gerçek bir gereklilik
- source: [The Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [This Week in Spring - May 12th, 2026](https://spring.io/blog/2026/05/12/this-week-in-spring-may-12-2026), [Moderne Boot 4 migration guide](https://www.moderne.ai/blog/spring-boot-4x-migration-guide)
- author: Karsten Silz ve Spring ekibi; Josh Long; Moderne ekibi
- date: 13 Nisan 2026, 12 Mayıs 2026 ve güncel Moderne içeriği
- category: tooling, migration, developer-productivity
- tags: openrewrite, moderne, boot-4-migration, recipes, automation
- summary: Spring ekibi Boot `3 -> 4` geçişi için community OpenRewrite recipes vurgusu yapıyor; Josh Long son notunda OpenRewrite/Moderne eksenini tekrar öne çıkarıyor; Moderne tarafı artık Boot 4 hattını ayrı bir migration problemi olarak çerçeveliyor.
- why_it_matters: Kurumsal geçişler artık yalnız teknik uyumluluk değil, ölçekli operasyon problemi. Elle diff takibiyle yürütmek pahalı.
- java_spring_relevance: Çok servisli Spring portföyleri ve merkezi platform ekipleri için yüksek.
- actionability: planli_aksiyon
- impact_level: orta
- opportunities: Merkezileştirilmiş tarifelerle upgrade işini tekrarlanabilir hale getirmek; zafiyetli bağımlılıkları otomatik tespit etmek.
- risks: Manuel upgrade'e güvenmek; iç starter ve özel framework extension davranışlarını araçsız taşımaya çalışmak.
- migration_notes: RC/GA öncesi repo taraması yapıp custom recipe ihtiyacı belirlenmeli; özellikle Jackson 3 ve modüler auto-config geçişleri otomasyona aday.

### Bulgu 8

- title: Hardwood 1.0.0.Beta2, Spring veri servisleri için düşük öncelikli ama ilginç bir Java 21+ araç sinyali
- source: [Gunnar Morling ana sayfa](https://www.morling.dev/), [Hardwood 1.0.0.Beta2 yazısı](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/)
- author: Gunnar Morling
- date: 29 Nisan 2026
- category: tooling, data, low-priority
- tags: parquet, java-21, cli, tui, object-storage, hardwood
- summary: Hardwood `1.0.0.Beta2`; VARIANT desteği, interaktif TUI, daha iyi performans ve object storage erişim iyileştirmeleri getiriyor.
- why_it_matters: Spring Batch, veri işleme veya lakehouse kenar servisleri geliştiren ekipler için Java-native, düşük bağımlılıklı bir Parquet aracı alternatifi oluşuyor.
- java_spring_relevance: Genel Spring Boot servisleri için düşük; veri platformu ve batch hatları için seçici biçimde anlamlı.
- actionability: low_priority_watch
- impact_level: düşük
- opportunities: CLI/TUI destekli hızlı Parquet inceleme; Java 21+ ile düşük bağımlılık yaklaşımı.
- risks: Beta yazılım; olgun ekosistem alternatiflerine göre daha dar kullanım alanı.
- migration_notes: Sadece veri yoğun yardımcı araçlar veya iç ops CLI'ları için değerlendirilmesi mantıklı.

## Sonuç

Bugünün en güçlü mühendislik sinyali, Spring ekosisteminde `4.1` hattının RC seviyesinde yatay olarak genişlemiş olması. Bu, senior Java/Spring ekipleri için "özellik bakma" değil "entegrasyon lane'i açma" çağrısıdır. En yakın pratik aksiyon; Boot 4.1, Security 7.1, Integration/Kafka RC'leri ve mevcut iç starter'lar arasında erken uyumluluk testi başlatmaktır.

JVM tarafında ise JDK 26/27 değişiklikleri artık yalnız dil özelliği haberi değil. HTTP/3, post-quantum TLS ve structured concurrency yönü; önümüzdeki sprintlerde değilse bile bu yılın ikinci yarısındaki platform yol haritalarında mutlaka yer almalı. Ancak structured concurrency preview olduğu için burada disiplinli olmak ve public contract'a erken taşımamak kritik.
