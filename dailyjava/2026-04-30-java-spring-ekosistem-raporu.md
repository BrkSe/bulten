# Günlük Java / Spring Ekosistem Raporu

Tarih: 30 Nisan 2026  
Odak: Spring Boot 4.1 RC1’in pratik etkileri, Spring Security 7 faktör modeli, Spring Modulith ve messaging RC dalgası, OpenJDK varsayılan değişim sinyalleri, Nisan CPU/JDK baseline güncellemeleri

Tarama notu: 30 Nisan 2026 sabahı itibarıyla tamamen yeni aynı gün resmi Spring/Java yayını sınırlı. Bu nedenle bugünkü rapor, 21-29 Nisan arasında yayımlanan ama dünkü güvenlik özetlerinden farklı ve daha kalıcı mühendislik değeri taşıyan sinyalleri öne çıkarıyor. [Spring Blog](https://spring.io/blog/), [Spring Projects](https://spring.io/projects), [Spring Security release/advisory akışı](https://spring.io/security), [Spring Boot 4.1.0-RC1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes), [Spring Security MFA dokümantasyonu](https://docs.spring.io/spring-security/reference/7.0/servlet/authentication/mfa.html), [Spring Cloud release train duyuruları](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released), [OpenJDK JEP taslakları](https://openjdk.org/jeps/8379682), [Oracle Java release notes](https://www.oracle.com/java/technologies/javase/25-0-3-relnotes.html), [Inside Java](https://inside.java/), [InfoQ Java/Spring roundup’ları](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), Josh Long’un açık paylaşımları, Gunnar Morling’in blogu ve [Burak KUTBAY’ın blogu](https://blog.burakkutbay.com/) kontrol edildi. Josh Long, Gunnar Morling ve Burak KUTBAY tarafında bugün yeni üretim-kritik release duyurusu yok; fakat ekosistem yönünü doğrulayan yardımcı içerikler mevcut.

## Öne Çıkan Başlıklar

- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), sadece sürüm ilerlemesi değil; SSRF filtreleme, OpenTelemetry environment variable eşlemesi, lazy JDBC connection fetch, Redis listener auto-config ve gRPC entegrasyonu gibi doğrudan runtime davranışını etkileyen başlıklar getiriyor.
- [Spring Security 7’nin MFA modeli](https://docs.spring.io/spring-security/reference/7.0/servlet/authentication/mfa.html), artık “harici IdP ile çözeriz” seviyesinden çıkıp framework içi first-class capability haline geliyor. Ancak [OTT race condition](https://spring.io/security/cve-2026-22751) ve [path matcher zincir hatası](https://spring.io/security/cve-2026-22753) nedeniyle güvenlik akışları hâlâ dikkat istiyor.
- [Spring Modulith 2.1.0-RC1](https://spring.io/blog/2026/04/23/spring-modulith-2-1-0-RC1-available-now) ile [JetBrains’in modular monolith migration rehberi](https://blog.jetbrains.com/idea/2026/02/migrating-to-modular-monolith-using-spring-modulith-and-intellij-idea/), mikroservisten geri dönüş değil; sınırları kodla doğrulanabilen daha disiplinli modüler monolith yaklaşımının olgunlaştığını gösteriyor.
- [Spring Integration 7.1.0-RC1](https://spring.io/blog/2026/04/22/spring-integration-7-1-0-RC1-available-now) ve [Spring for Apache Kafka 4.1.0-RC1](https://spring.io/blog/2026/04/22/spring-kafka-4), feature eklemekten çok mesajlaşma semantiğini görünür ve ayarlanabilir hale getiriyor.
- OpenJDK tarafında [Shenandoah için generational mode’un varsayılan yapılması](https://openjdk.org/jeps/8379682) ve [compact object headers’ın varsayılan olması](https://openjdk.org/jeps/8350458) hâlâ taslak aşamada; fakat yön net: JVM, daha küçük bellek ayak izi ve daha dengeli latency varsayılanlarına doğru ilerliyor.
- [Oracle JDK 25.0.3](https://www.oracle.com/java/technologies/javase/25-0-3-relnotes.html), yalnız güvenlik CPU’su değil; G1 davranışı, `keytool/jarsigner` parola işleme ve `jdk.security.disabledAlgorithms` gibi operasyonel ayrıntılarda da pratik etki yaratıyor.

## Kritik Güncellemeler

### Spring Boot 4.1 RC1, pilot ortamlar için gerçek davranış değişiklikleri taşıyor

[Spring Boot 4.1.0-RC1 duyurusu](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now) ve [release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes), RC sürümün yalnız dependency refresh olmadığını gösteriyor:

- `ReactorClientHttpRequestFactoryBuilder`, artık varsayılan olarak `proxyWithSystemProperties` uygulamıyor. Sistem proxy property’lerine sessizce güvenen outbound HTTP çağrıları için bu bir migration riskidir.
- `spring.datasource.connection-fetch=lazy`, JDBC bağlantısının transaction başlamadan gereksiz erken alınmasını azaltabiliyor. Connection pool baskısı yaşayan servisler için değerli.
- `InetAddressFilter` ve `allowedHostnames`, SSRF riskini framework seviyesinde daraltmak için pratik bir kontrol noktası ekliyor.
- OpenTelemetry SDK environment variable’ları artık config binding ile daha doğal hizalanıyor; platform ekipleri için container/deployment tabanlı telemetry standardizasyonu kolaylaşıyor.
- `@RedisListener` auto-configuration ve gRPC tarafında `@GrpcAdvice` dokümantasyonu, Boot’un yalnız HTTP değil eventing ve RPC akışlarını da daha first-class hale getirdiğini gösteriyor.

Bu sürüm geniş rollout adayı değil; ama kontrollü pilot için teknik olarak anlamlı. Özellikle platform şablonları üreten ekipler, 4.1 hattını sadece “yakında GA olacak” diye değil, yeni varsayımları nedeniyle test etmelidir.

### Spring Security 7, MFA’yı merkezileştiriyor; ama auth zinciri ve token store hâlâ kırılgan

[Spring Security’nin 21 Nisan release post’u](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Security MFA dokümantasyonu](https://docs.spring.io/spring-security/reference/7.0/servlet/authentication/mfa.html), [Baeldung’in Spring Security 7 MFA yazısı](https://www.baeldung.com/spring-security-mfa) ve advisory’ler birlikte okunduğunda iki güçlü sinyal çıkıyor:

- Framework, `FactorGrantedAuthority` ve `@EnableMultiFactorAuthentication` ile MFA’yı native authorization modeli içine taşıyor.
- Aynı anda yanlış matcher kullanımı ve zayıf token store implementasyonu hâlâ ciddi risk üretebiliyor.

Özellikle:

- [CVE-2026-22753](https://spring.io/security/cve-2026-22753): `spring.mvc.servlet.path` ile `HttpSecurity#securityMatchers(String...)` birlikte kullanıldığında yanlış zincir seçimi güvenlik kontrollerini etkisiz bırakabiliyor.
- [CVE-2026-22751](https://spring.io/security/cve-2026-22751): `JdbcOneTimeTokenService` race condition, birden fazla OTP tüketimine izin verebiliyor.
- [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-1-4-4-and-1-3-9-available-now), [CVE-2026-22752](https://spring.io/security/cve-2026-22752) ile dynamic client registration metadata doğrulama boşluğunu kapatıyor; aynı yazıda 1.3.x ve 1.4.x için OSS desteğin bittiği de açıkça söyleniyor.

Buradaki kalıcı ders şu: Spring Security 7 ile factor-based auth daha güçlü hale geliyor, ama matcher, token store ve support window kararları hâlâ “opsiyonel temizlik” değil.

### JVM tarafında yeni syntax’tan çok yeni varsayılanlar yaklaşmakta

OpenJDK tarafında bugün en önemli sinyal yeni dil özelliği değil:

- [Shenandoah GC: Generational Mode by Default](https://openjdk.org/jeps/8379682) taslağı, düşük pause hedefleyen servislerde generational Shenandoah’ın gelecekte ana yol olabileceğini gösteriyor.
- [Compact Object Headers by Default](https://openjdk.org/jeps/8350458) taslağı, bellek ayak izini küçültme yönünün deneysel olmaktan çıktığını gösteriyor.

Bu JEP’ler henüz `Draft` durumda. Yani bugünden production kararı verilmez. Ancak bellek yoğun Java servisleri, büyük cache kullanan Spring uygulamaları ve container memory limit’i altında çalışan workload’lar için benchmark backlog’una girmesi gereken konular bunlar.

### Oracle JDK 25.0.3, patch değil çalışma zamanı davranışı da değiştiriyor

[Oracle JDK 25.0.3 release notes](https://www.oracle.com/java/technologies/javase/25-0-3-relnotes.html), backend ekipleri için üç pratik başlık içeriyor:

- `-XX:+UseGCOverheadLimit`, artık G1 ile de destekleniyor ve varsayılan açık. GC thrash yaşayan servislerde davranış farkı görülebilir.
- `keytool` ve `jarsigner`, stdin/console parola okuma davranışında daha tutarlı hale geliyor. Build/CI script’leri etkilenebilir.
- `jdk.security.disabledAlgorithms`, hem TLS hem JCE policy düzeyinde daha görünür bir kontrol yüzeyi sunuyor.

Ek olarak `tzdata 2026a` güncellemesi, tarih/saat hassasiyeti olan servislerde standart patch döngüsü ile birlikte ele alınmalı.

## Trendler ve Sinyaller

### 1. Spring ekosistemi “framework feature” değil “runtime contract” konuşuyor

Boot 4.1 RC1, Spring Security advisory’leri, Spring Integration 7.1 RC1 ve Spring Kafka 4.1 RC1 birlikte okunduğunda ortak nokta şu:

- Varsayılanların nasıl çalıştığı daha açık hale getiriliyor.
- Operasyonel davranışlar configuration ve API seviyesinde daha görünür oluyor.
- Hata, retry, auth ve proxy gibi daha önce sessiz kalan alanlar explicit contract haline getiriliyor.

Bu kısa ömürlü release gürültüsü değil; büyük kurumsal Spring platformlarında kalıcı mühendislik yönü gibi görünüyor.

### 2. Modular monolith, mikroservislere alternatif değil; kontrollü ara katman olarak güçleniyor

[Spring Modulith 2.1.0-RC1](https://spring.io/blog/2026/04/23/spring-modulith-2-1-0-RC1-available-now) ile gelen `@ModuleSlicing`, event publication registry iyileştirmeleri ve JobRunr transaction senkronizasyonu; [JetBrains’in migration rehberi](https://blog.jetbrains.com/idea/2026/02/migrating-to-modular-monolith-using-spring-modulith-and-intellij-idea/) ile birleşince şunu söylüyor:

- Çok servisli karmaşadan bunalan ekipler için “tek deployable ama doğrulanabilir sınırlar” modeli güçleniyor.
- Modulith artık yalnız teori veya konferans konusu değil; test, yapı ve IDE akışıyla destekleniyor.

### 3. Eventing tarafında asıl yenilik daha çok semantik netlik

[Spring Kafka 4.1](https://spring.io/blog/2026/04/22/spring-kafka-4) ve [Spring Integration 7.1 RC1](https://spring.io/blog/2026/04/22/spring-integration-7-1-0-RC1-available-now):

- share consumer ack davranışını,
- Kafka Streams error/DLQ recovery yolunu,
- Redis lock CAS/CAD fallback’ini,
- JMS template özelleştirmesini

daha explicit hale getiriyor. Bu da event-driven sistemlerde “özellik var mı?” sorusundan çok “failure path nasıl davranıyor?” sorusunu öne çıkarıyor.

### 4. JVM performans yönü, daha küçük header ve daha genç GC varsayılanları tarafına kayıyor

Shenandoah generational default ve compact object headers taslakları, JVM’in gelecekte daha farklı memory/latency varsayımları ile gelebileceğini gösteriyor. Spring uygulaması doğrudan değişmese bile container sizing, benchmark eğrileri ve GC flag birikimi etkilenebilir.

## Araçlar ve Kütüphaneler

- `Spring Modulith 2.1.0-RC1`: Yüksek izleme değeri. `@ModuleSlicing`, event publication registry ve JobRunr transaction senkronizasyonu, büyük monolith’lerde modül sınırlarını gerçek iş akışlarına bağlamayı kolaylaştırıyor.
- `Spring for Apache Kafka 4.1.0-RC1`: Yüksek izleme değeri. Share consumer ack modları, async commit ve Kafka Streams için yerel DLT/error handling desteği gerçek davranış değişikliği taşıyor.
- `Spring Integration 7.1.0-RC1`: Orta-yüksek öncelik. Redis 8.4+ için native CAS/CAD kilit yolu ve fallback davranışı, dağıtık lock semantiğini netleştiriyor.
- `Spring Security 7 MFA API’leri`: Yüksek öncelik. Bu bir ayrı kütüphane değil; ama factor-based auth modelini native hale getirdiği için ekip içi MFA soyutlamalarını sadeleştirebilir.
- `Burak KUTBAY blogundaki Spring Boot 4 / Spring Framework 7 içerikleri`: Düşük öncelik. Güncel release sinyali değil; fakat Türkçe ekip içi paylaşım veya onboarding için yararlı pratik anlatımlar olmaya devam ediyor.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Boot 4.1` pilotu açacaksanız, ilk kontrol listesi business feature değil outbound proxy davranışı, telemetry env var binding, lazy datasource fetch ve SSRF filtreleme olmalı.
- `Spring Security 7` veya `Spring Authorization Server` kullanıyorsanız, factor-based MFA’yı resmi modelle ele almak mantıklı; fakat matcher seçimi, OTP store implementasyonu ve support policy birlikte değerlendirilmeli.
- `Spring Cloud` kullanan ekipler için `Boot 4.1 RC1` hâlâ dikkatli ele alınmalı. [Spring Cloud 2025.0.2](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released) hattı Boot `3.5.13` tabanlı; [2025.1.1](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released) ise Boot `4.0.1+` ile hizalanıyor. `4.1` için geniş rollout öncesi resmi uyumluluk matrisi beklenmeli.
- `Spring Modulith`, mikroservise bölünmek üzere olan ama ekip/operasyon yükü nedeniyle zorlanan sistemlerde “önce sınırları doğrula, sonra ayır” yaklaşımı için daha olgun bir seçenek haline geliyor.
- `Kafka/Redis/JMS` yoğun sistemlerde RC sürümleri doğrudan production’a taşımak doğru değil; fakat ack, lock ve recovery semantiğini bugünden test etmek sonradan pahalı sürprizleri azaltır.
- JVM tarafında bugün yapılacak iş “JEP kabul edildi mi?” takibi değil; memory-sensitive birkaç servis için Shenandoah generational ve compact object headers benchmark kuyruğu açmaktır.

## Fırsatlar ve Riskler

### Fırsatlar

- Boot 4.1’in SSRF, telemetry ve connection-fetch iyileştirmeleri, platform şablonlarını daha güvenli ve daha ekonomik hale getirebilir.
- Security 7’nin factor modeli, custom MFA glue code’unu azaltabilir ve authorization mantığını daha okunur yapabilir.
- Modulith 2.1 RC1, modüler monolith kullanan ekiplerde test edilebilir sınırlar ve olay akışı görünürlüğü sağlayabilir.
- Kafka/Integration RC’leri, event-driven sistemlerde failure-path davranışlarını daha öngörülebilir hale getirme fırsatı sunuyor.
- OpenJDK’nin yeni varsayılan yönü, özellikle container memory baskısı yaşayan servislerde orta vadede gerçek performans kazanımı yaratabilir.

### Riskler

- Boot 4.1’de sessiz proxy davranışı beklentisi veya eski outbound HTTP varsayımlarına güvenmek production farkı doğurabilir.
- Security matcher konfigürasyonu ve OTP store davranışı, MFA eklenirken “daha güvenli olduk” hissi yaratıp gerçekte yeni açık bırakabilir.
- Spring Cloud kullanan takımlar için Boot 4.1’e erken geçiş, release train uyumluluk boşluğu nedeniyle beklenmedik integration kırılmaları doğurabilir.
- Messaging RC özellikleri, özellikle share consumer ve distributed lock davranışında yük altı fark yaratabilir; unit test ile yakalanmayabilir.
- JDK 25.0.3’teki GC ve security policy davranış farkları, performans ve CI script tarafında küçük ama sürprizli regresyonlara neden olabilir.

## İzlenmesi Gereken Konular

- Spring Boot 4.1 GA ve buna eşlik edecek resmi Spring Cloud uyumluluk mesajı.
- Spring Security 7.1 GA yolunda factor-based MFA API’lerinde yeni sadeleştirmeler veya yeni advisory’ler.
- Spring Authorization Server tarafında 1.5.x sonrası support penceresi ve 2.0 yönü.
- Shenandoah generational default ve compact object headers JEP’lerinin `Draft` statüsünden ileri aşamaya geçip geçmeyeceği.
- Spring Kafka 4.1 ve Spring Integration 7.1 RC özelliklerinin GA’ya kadar davranış değiştirip değiştirmeyeceği.
- Burak KUTBAY, Josh Long ve Gunnar Morling gibi kaynaklarda bu başlıkları pratik örnek veya migration rehberine dönüştüren yeni içeriklerin gelip gelmeyeceği.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot 4.1 RC1, platform ekipleri için güvenlik ve runtime contract odaklı gerçek bir pilot sürüm
- source: [Spring Boot 4.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), [Spring Boot 4.1.0-RC1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes)
- author: Moritz Halbritter, Spring Boot Team
- date: 23 Nisan 2026 ve 28 Nisan 2026 release notes güncellemesi
- category: platform-runtime, observability, security
- tags: spring-boot, 4.1.0-rc1, ssrf, opentelemetry, lazy-datasource, grpc, redis
- summary: RC1 sürümü outbound proxy varsayımlarını değiştiriyor, telemetry environment variable eşlemesini iyileştiriyor, lazy JDBC connection fetch ekliyor ve SSRF azaltımı için yeni filtreleme yüzeyi sunuyor.
- why_it_matters: Bu değişiklikler business feature’dan çok runtime davranışını etkilediği için upgrade maliyeti küçük görünse de gerçek operasyon farkı yaratabilir.
- java_spring_relevance: Spring Boot kullanan tüm Java backend ekipleri için doğrudan ilgili; özellikle platform template, starter ve golden-path üreten ekipler için.
- actionability: kontrollu_pilot_ve_runtime_regression_test
- impact_level: çok_yüksek
- opportunities: Daha iyi telemetry standardizasyonu, daha güvenli outbound HTTP, daha ekonomik JDBC kullanım modeli.
- risks: Proxy davranışı kırılması, konfigürasyon farkı nedeniyle gizli regresyon, Spring Cloud uyumluluk boşluğu.
- migration_notes: 4.1 pilotunda outbound proxy, datasource fetch davranışı, telemetry binding ve SSRF filtreleme ilk test başlıkları olmalı.

### Bulgu 2

- title: Spring Security 7’nin factor-based MFA modeli olgunlaşıyor; matcher ve one-time-token store seçimleri hâlâ kritik
- source: [Spring Security Releases](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Security MFA docs](https://docs.spring.io/spring-security/reference/7.0/servlet/authentication/mfa.html), [CVE-2026-22751](https://spring.io/security/cve-2026-22751), [CVE-2026-22753](https://spring.io/security/cve-2026-22753), [Baeldung - Multiple-Factor Authentication in Spring Security 7](https://www.baeldung.com/spring-security-mfa)
- author: Spring Security Team, Rob Winch, Baeldung Editorial Team
- date: 21 Nisan 2026 ve 29 Nisan 2026 bağlam kontrolü
- category: security-architecture
- tags: spring-security, mfa, factorgrantedauthority, one-time-token, securitymatchers, servlet-path
- summary: Spring Security 7, MFA’yı framework içi factor modeline taşıyor; ancak path matcher zinciri ve JDBC one-time-token store davranışı yeni açık yüzeyleri üretebiliyor.
- why_it_matters: Güvenlik ekibi için değerli olan native MFA desteği, yanlış konfigürasyon veya zayıf token store ile sahte bir güven hissi yaratabilir.
- java_spring_relevance: Spring Security kullanan tüm Java/Spring servisleri için yüksek önem taşır; özellikle custom login, OTT veya faktör tabanlı authorization planlayan ekipler için.
- actionability: patchle_ve_mfa_akisini_resmi_model_ile_yeniden_tasarla
- impact_level: çok_yüksek
- opportunities: Custom MFA glue code’unu azaltmak, authorization akışını daha okunur ve test edilebilir hale getirmek.
- risks: Yanlış chain eşleşmesi, çoklu OTP tüketimi, factor modeli eklerken gerçek güvenlik borcunun gizlenmesi.
- migration_notes: `securityMatchers(String...)` kullanımı `servletPath` ile birlikte yeniden test edilmeli; `JdbcOneTimeTokenService` kullanılan akışlar patchlenmeli veya alternatif store değerlendirilmelidir.

### Bulgu 3

- title: Spring Authorization Server patch’i yalnız CVE kapatmıyor; eski support penceresini de fiilen kapatıyor
- source: [Spring Authorization Server 1.5.7, 1.4.4, and 1.3.9 available now](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-1-4-4-and-1-3-9-available-now), [CVE-2026-22752](https://spring.io/security/cve-2026-22752)
- author: Ritesh Pamnani
- date: 21 Nisan 2026
- category: identity-security
- tags: spring-authorization-server, oauth2, dynamic-client-registration, support-policy, patching
- summary: Dynamic client registration metadata için yetersiz doğrulama açığı kapatıldı; aynı anda 1.3.x ve 1.4.x için OSS desteğin bittiği net şekilde duyuruldu.
- why_it_matters: IAM/identity tarafında patch gecikmesi yalnız güvenlik açığı değil, destek penceresi dışına düşme riski anlamına geliyor.
- java_spring_relevance: OAuth2 Authorization Server işleten Spring ekipleri için doğrudan production önceliği.
- actionability: desteklenen_hatta_hizli_gecis
- impact_level: yüksek
- opportunities: Dynamic client registration politikalarını daha sıkı hale getirmek ve support matrix’i sadeleştirmek.
- risks: Destek dışı dalda kalmak, registration metadata doğrulamasına aşırı güvenmek, kimlik altyapısında sessiz risk biriktirmek.
- migration_notes: 1.5.x hattı hedeflenmeli; 1.3/1.4 üzerinde kalanlar upgrade backlog’unu güvenlik işi olarak ele almalı.

### Bulgu 4

- title: Spring Modulith 2.1 RC1 ve IntelliJ rehberi, modüler monolith’i yeniden ciddi bir seçenek haline getiriyor
- source: [Spring Modulith 2.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-modulith-2-1-0-RC1-available-now), [Migrating to Modular Monolith using Spring Modulith and IntelliJ IDEA](https://blog.jetbrains.com/idea/2026/02/migrating-to-modular-monolith-using-spring-modulith-and-intellij-idea/)
- author: Oliver Drotbohm, JetBrains
- date: 23 Nisan 2026 ve 6 Şubat 2026
- category: architecture, developer-productivity
- tags: spring-modulith, modular-monolith, module-slicing, event-publication, jobrunr, intellij
- summary: RC1, modül dilimleme ve event publication tarafını güçlendirirken JetBrains rehberi sınır doğrulama ve test akışını pratik hale getiriyor.
- why_it_matters: Mikroservis karmaşıklığını azaltmak isteyen ekipler için deploy modelini bozmandan önce modül sınırlarını kodla doğrulama seçeneği güçleniyor.
- java_spring_relevance: Büyük Spring Boot monolith’leri, domain boundary problemi yaşayan servis platformları ve kademeli ayrıştırma yapan ekipler için yüksek değer taşır.
- actionability: secili_monolithlerde_modul_siniri_pilotu
- impact_level: orta-yüksek
- opportunities: Daha net domain sınırları, daha düşük dağıtım karmaşıklığı, modül seviyesinde test disiplini.
- risks: Mikroservis yerine “büyük modüler karmaşa” üretmek; modül kurallarını doğrulamadan yalnız annotation eklemek.
- migration_notes: `ApplicationModules.verify()` ve modul test akışları önce pilot bir bounded context üzerinde denenmeli.

### Bulgu 5

- title: Spring Kafka 4.1 RC1 ve Spring Integration 7.1 RC1, eventing dünyasında failure-path semantiğini görünürleştiriyor
- source: [Spring for Apache Kafka 4](https://spring.io/blog/2026/04/22/spring-kafka-4), [Spring Integration 7.1.0-RC1 available now](https://spring.io/blog/2026/04/22/spring-integration-7-1-0-RC1-available-now)
- author: Gary Russell, Artem Bilan
- date: 22 Nisan 2026
- category: messaging, distributed-systems
- tags: spring-kafka, spring-integration, share-consumer, async-commit, kafka-streams, redis-lock, jms
- summary: Kafka tarafında ack, async commit ve Streams recovery; Integration tarafında Redis CAS/CAD ve JMS özelleştirmesi daha explicit hale geliyor.
- why_it_matters: Event-driven sistemlerde asıl production farkı çoğu zaman API değil failure path ve retry/ack davranışıdır.
- java_spring_relevance: Kafka, Redis, JMS veya Spring Integration kullanan Java/Spring ekipleri için doğrudan ilgili.
- actionability: yuk_altinda_semantik_regression_test
- impact_level: yüksek
- opportunities: Recovery davranışını daha kontrollü hale getirmek, lock ve ack semantiklerini daha iyi gözlemlemek.
- risks: RC davranış değişikliği, yük altında farklı ack/lock sonuçları, local testlerde görünmeyen cluster farkları.
- migration_notes: Özellikle share consumer, DLT/error handler ve Redis lock akışları staging altında tekrar ölçülmeli.

### Bulgu 6

- title: OpenJDK, bellek ve GC varsayılanlarını değiştirebilecek iki taslakla yönünü açık ediyor
- source: [Shenandoah GC: Generational Mode by Default](https://openjdk.org/jeps/8379682), [Compact Object Headers by Default](https://openjdk.org/jeps/8350458), [InfoQ Java News Roundup](https://www.infoq.com/news/2026/04/java-news-roundup-apr20-2026/)
- author: Roman Kennke, Anton Kozlov, Michael Redlich
- date: 24 Ocak 2026 ve 28 Nisan 2026 bağlam kontrolü
- category: jvm-performance
- tags: openjdk, shenandoah, generational-gc, compact-object-headers, memory, performance
- summary: Her iki JEP de hâlâ taslak aşamada; ancak JVM yönü, daha küçük object header ve daha dengeli generational GC varsayılanlarına doğru kayıyor.
- why_it_matters: JVM varsayılanı değiştiğinde uygulama kodu aynı kalsa bile container sizing, latency ve memory eğrileri değişebilir.
- java_spring_relevance: Bellek yoğun Spring Boot servisleri, yüksek throughput API’ler ve cache-heavy uygulamalar için özellikle anlamlıdır.
- actionability: benchmark_backloguna_al
- impact_level: orta-yüksek
- opportunities: Daha düşük bellek ayak izi ve daha iyi GC davranışı için orta vadeli kazanım.
- risks: Erken veya yanlış benchmark yorumu, flag birikimi ile yeni varsayılanların çakışması.
- migration_notes: Bugünden production flag değiştirmek yerine birkaç temsilî servis üzerinde controlled benchmark açılmalı; JEP statülerinin taslak olduğu unutulmamalı.

### Bulgu 7

- title: Oracle JDK 25.0.3, güvenlik CPU’suna ek olarak GC ve güvenlik policy davranışında pratik değişiklikler getiriyor
- source: [Oracle Java SE 25.0.3 Release Notes](https://www.oracle.com/java/technologies/javase/25-0-3-relnotes.html)
- author: Oracle
- date: 21 Nisan 2026
- category: jdk-operations
- tags: jdk25, cpu, g1, usegcoverheadlimit, keytool, jarsigner, tzdata, disabledalgorithms
- summary: 25.0.3 sürümü, G1 için `UseGCOverheadLimit`, parola okuma iyileştirmeleri, JCE algoritma kısıtlama property’si ve `tzdata 2026a` güncellemesi gibi doğrudan operasyonel etkiler içeriyor.
- why_it_matters: Quarterly patch’ler yalnız güvenlik açığı kapatmaz; çalışma zamanı ve CI davranışını da küçük ama önemli biçimde değiştirebilir.
- java_spring_relevance: JDK üstünde çalışan tüm Spring uygulamaları için temel operasyon bilgisidir.
- actionability: cpu_patchle_ve_gc_ve_ci_davranisini_gozlemle
- impact_level: orta-yüksek
- opportunities: Daha tutarlı güvenlik policy yönetimi ve GC thrash tespiti.
- risks: Script uyumsuzluğu, beklenmedik GC abort davranışı, zaman dilimi farklarının iş kurallarını etkilemesi.
- migration_notes: JDK patch sonrası performans, build signing script’leri ve tarih/saat hassas testler birlikte kontrol edilmeli.

### Bulgu 8

- title: Spring Cloud release train sinyali hâlâ Boot 4.1 için temkinli ilerlemeyi gerektiriyor
- source: [Spring Cloud 2025.0.2 (Northfields) has been released](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released), [Spring Cloud 2025.1.1 (Oakwood) has been released](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released), [Spring Cloud project page](https://spring.io/projects/spring-cloud/)
- author: Olga Maciaszek-Sharma
- date: 2 Nisan 2026 ve 29 Ocak 2026
- category: platform-compatibility
- tags: spring-cloud, spring-boot, compatibility, release-train, oakwood, northfields
- summary: 2025.0.2 hattı hâlâ Boot 3.5.13 tabanlı; 2025.1.1 ise Boot 4.0.1+ ile hizalı. Boot 4.1 RC1 için henüz eşdeğer net bir release-train mesajı yok.
- why_it_matters: Spring Cloud kullanan takımlar için Boot RC geçişi sadece Boot testinden ibaret değildir; release-train uyumluluğu temel belirleyicidir.
- java_spring_relevance: Spring Cloud Gateway, Config, Stream, OpenFeign veya Bus kullanan ekipler için özellikle önemlidir.
- actionability: genis_rolloutu_ertele_ve_matrisi_bekle
- impact_level: yüksek
- opportunities: Geçişi bilinçli pilotlarla yapmak ve release-train borcunu azaltmak.
- risks: Yanlış versiyon kombinasyonu, auto-config kırılması, transitif bağımlılık uyuşmazlıkları.
- migration_notes: 4.1 hattı Cloud bağımlı sistemlerde yalnız pilot/staging amaçlı kullanılmalı; resmi matris netleşmeden platform baseline yapılmamalı.

## Sonuç

30 Nisan 2026 itibarıyla en güçlü sinyal yeni feature bolluğu değil; Spring ve JVM tarafında varsayımların daha explicit hale gelmesi. Boot 4.1 RC1, Security 7 MFA, Modulith 2.1 RC1 ve Kafka/Integration RC’leri aynı şeyi söylüyor: framework artık daha fazla sihir değil, daha görünür davranış sözleşmesi üretmeye çalışıyor.

Kısa vadede en mantıklı hareket, `Boot 4.1` için kontrollü pilot açmak, `Security/Auth Server` patch ve support matrix’ini sıkılaştırmak, `Spring Cloud` uyumluluğunu ayrı doğrulamak ve JVM tarafında yeni default yönleri benchmark kuyruğuna almaktır. Gürültüye değil bu kalıcı sözleşme değişimlerine odaklanan ekipler daha az sürpriz yaşar.
