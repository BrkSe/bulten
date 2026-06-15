# Günlük Java / Spring Ekosistem Raporu

Tarih: 15 Haziran 2026  
Tarama zamanı: 15 Haziran 2026 09:07 TSİ  
Odak: Spring tarafında güvenlik düzeltmelerinin davranış değiştiren migrasyon etkileri, observability hattında unsupported baskısı, Spring Boot `4.1` ile güvenlik ve RPC varsayımlarının çerçeve içine taşınması, Java upstream katkı süreçlerinde AI yönetişimi

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring Security Advisories](https://spring.io/security/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Boot 4.1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes), Spring AI ve Spring Statemachine GitHub release sayfaları, [Inside Java](https://inside.java/), [OpenJDK generative AI interim policy](https://openjdk.org/legal/ai), [GraalVM contributor policy](https://www.graalvm.org/community/contributors/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung Java Weekly 650](https://www.baeldung.com/java-weekly-650), [Josh Long’un 9 Haziran 2026 haftalık özeti](https://spring.io/blog/2026/06/09/this-week-in-spring-june-9-2026), [Gunnar Morling RSS akışı](https://www.morling.dev/index.xml) ve [Burak KUTBAY blog feed’i](https://blog.burakkutbay.com/feed/) tarandı. 15 Haziran 2026 sabahı itibarıyla Josh Long tarafında 9 Haziran sonrasında yeni bir haftalık toplu yazı görünmüyor; Gunnar Morling tarafında yeni bir Spring/Java release kararı değiştiren gönderi yok; Burak KUTBAY tarafında 13 Haziran tarihli yazı proje yönetimi ve teslimat disiplini odaklı, bugünkü Spring/Java sürüm kararlarını doğrudan değiştirmiyor.

## Öne Çıkan Başlıklar

- [Spring Statemachine `CVE-2026-41862`](https://spring.io/security/cve-2026-41862), yalnız güvenlik patch’i değil; allowlist zorunluluğu, eski persisted context’lerin okunamaması ve Redis key namespace değişimiyle gerçek migrasyon işi doğuruyor.
- [Spring AI `CVE-2026-47835`](https://spring.io/security/cve-2026-47835), Elasticsearch, OpenSearch ve GemFire tabanlı vector store metadata filtrelerinde sorgu zorlamasına yol açabiliyor; `1.0.9` ve `1.1.8` bu yüzden gecikmeden alınmalı.
- [Spring Cloud Sleuth `CVE-2026-41708`](https://spring.io/security/cve-2026-41708) için fix yalnız enterprise hattında (`3.1.14`) var; hâlâ Sleuth `3.1.x` kullanan ekipler için Micrometer Tracing’e geçiş artık sadece “iyi fikir” değil, destek ve güvenlik kararı.
- [Spring Boot `4.1`](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes), gRPC auto-configuration, `InetAddressFilter` ile SSRF azaltma, `@Async` context propagation ve OpenTelemetry ayarlarıyla platform mühendisliğini framework default’una çekiyor.
- [OpenJDK generative AI interim policy](https://openjdk.org/legal/ai), AI tarafından üretilmiş katkıları yasaklarken [GraalVM contributor policy](https://www.graalvm.org/community/contributors/) AI-assisted katkıları kabul ediyor; Java ekosisteminde upstream katkı kuralları tek tip değil.
- [Oracle Jipher `10.36`](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java), FIPS ortamlarda önemli; fakat GraalVM için planlanan son update release olması regüle dağıtımlarda Oracle JDK geçiş planını öne çekiyor.

## Kritik Güncellemeler

### 1. Spring Statemachine `4.0.2`, RCE düzeltirken veri biçimi ve çalışma zamanı varsayımlarını değiştiriyor

[CVE-2026-41862](https://spring.io/security/cve-2026-41862), Spring Statemachine’in Kryo tabanlı JPA, MongoDB, Redis ve ZooKeeper persistence katmanlarında allowlist olmadan deserialization yapılabildiğini ve bunun JVM içinde RCE’ye dönebileceğini söylüyor. Güvenlik tarafı tek başına kritik; fakat pratikte daha büyük sinyal fix’in çalışma şeklinden geliyor:

- `Kryo.setRegistrationRequired(true)` açılıyor.
- Framework ve JDK tipleri allowlist ile kayıt ediliyor.
- Uygulamaya özel state/event sınıflarını artık sizin ayrıca `Consumer<Kryo>` ile register etmeniz gerekiyor.
- Eski sürümde persist edilmiş state-machine context’ler yeni sürüm tarafından okunamıyor.
- Redis repository artık `ssm:context:` namespace’i kullanıyor; eski anahtarlar upgrade sonrası görünmez hale geliyor.

Bu, “patch alıp geçelim” türü bir durum değil. StateMachine kullanan ekipler için gerçek iş listesi şunlar:

- persist edilen custom state/event/header tiplerini envanterlemek
- upgrade öncesi context store draining veya migration stratejisi hazırlamak
- Redis key görünürlüğünü test etmek
- ilk persist/load akışlarında `IllegalArgumentException: Class is not registered` hatasını test ortamında yakalamak

### 2. Spring AI vector store açığı, RAG sistemlerinde metadata filtresini gerçek saldırı yüzeyine dönüştürüyor

[CVE-2026-47835](https://spring.io/security/cve-2026-47835), Spring AI vector store metadata filtrelerinde özel karakterlerle Elasticsearch, OpenSearch ve GemFire tarafında keyfi sorgu çalıştırma zorlaması yapılabildiğini gösteriyor. Etkilenen modüller:

- `spring-ai-elasticsearch-store`
- `spring-ai-opensearch-store`
- `spring-ai-gemfire-store`

Fix versiyonları açık:

- `1.0.x -> 1.0.9`
- `1.1.x -> 1.1.8`

Bu başlığın önemi, AI özelliğinin “chat demo”dan üretim veri erişimine kaydığı yerde ortaya çıkıyor. Eğer kullanıcı tarafındaki filtre alanlarını veya doğal dil arkasındaki metadata eşlemelerini doğrudan vector store filtresine aktarıyorsanız, bu artık uygulama seviyesinde güvenlik kontrolü gerektiriyor. Dünkü rapordaki Spring AI `2.0.0` GA ekseninden farklı olarak bugünkü karar noktası mimari güzellik değil; `Boot 3.5.x` üstünde kalan AI ekipleri için bakım hattının güvenlik zemini.

### 3. Sleuth `3.1.x` için güvenlik fix’inin enterprise-only olması, observability migration borcunu görünür hale getirdi

[CVE-2026-41708](https://spring.io/security/cve-2026-41708), `spring-cloud-sleuth-instrumentation` kullanan ve Spring TX instrumentation’ı kapatmamış uygulamalarda DoS riski olduğunu söylüyor. Zorlayıcı nokta şu:

- Etkilenen aralık: `3.1.0 - 3.1.13`
- Fix: `3.1.14`
- Availability: yalnız enterprise support

Bu, iki açıdan kritik:

- Hâlâ Sleuth kullanan ekipler muhtemelen zaten eski observability hattında kalmış durumda.
- Güvenlik düzeltmesi bile açık kaynak patch akışında olmadığı için Micrometer Tracing’e geçiş ertelenebilir bir refactor olmaktan çıkıyor.

Bugünün pratik sonucu: Eğer servislerde `spring-cloud-sleuth-instrumentation` var ise, bunun sadece “eski ama çalışıyor” diye bırakılması artık savunulamaz.

### 4. Spring Boot `4.1`, framework’ün içine güvenlik ve platform varsayımlarını daha sert gömüyor

[Spring Boot `4.1` release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) ve bunu bugünkü dış gözle özetleyen [InfoQ haberi](https://www.infoq.com/news/2026/06/spring-boot-4-1/) birlikte okununca değerli olan şey release’in kendisi değil, hangi problemleri artık framework’ün çözdüğü:

- gRPC server/client uygulamaları için resmi support
- reactive ve blocking HTTP client’larda `InetAddressFilter` ile SSRF azaltma
- `@Async` için context propagation
- OpenTelemetry SDK’yi açıp kapatma, sampler ve exporter config yüzeyinin genişlemesi
- jOOQ tarafında Java 21 gereksiniminin daha görünür hale gelmesi

Buradaki kalıcı sinyal şu: Güvenlik ve platform mühendisliği konuları artık “biz ayrı starter yazarız” alanından çıkıp Spring Boot varsayımlarına yaklaşıyor. Özellikle outbound HTTP çağrısı çok yapan servislerde `InetAddressFilter` ciddi biçimde değerlendirilmeli.

### 5. Oracle Jipher `10.36`, compliance ekipleri için kriptografi değişiminden fazlası

[Oracle Jipher `10.36`](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java), FIPS 140-3 gereksinimlerine uyum için bir dizi sert kısıt getiriyor:

- DSA key/signature generation yok
- TLS `1.2` key derivation için Extended Master Secret zorunlu
- Triple DES encryption ve key generation yok
- RSA-PSS salt ve RSA padding davranışları sıkılaştırılıyor
- PBKDF2 minimum salt/password/iteration sınırları geliyor

Asıl operasyonel sinyal ise bu sürümün GraalVM for JDK 17/21 için planlanan son update release olması. FIPS zorunlu Java workload’larını GraalVM üstünde çalıştıran ekipler için bu, yol haritası kararıdır.

### 6. OpenJDK ve GraalVM, AI destekli katkılarda artık farklı kurumsal çizgiler izliyor

[OpenJDK interim policy](https://openjdk.org/legal/ai), AI tarafından üretilmiş içeriğin katkı olarak gönderilmesini yasaklıyor; yalnız anlama, debug ve review amaçlı özel kullanımına izin veriyor. Buna karşılık [GraalVM contributor policy](https://www.graalvm.org/community/contributors/) AI-assisted katkıları kabul ediyor; sorumluluğu insan katkıcıda bırakıyor.

Bu başlık doğrudan üretim runtime etkisi yaratmıyor; fakat şu ekipler için anlamlı:

- upstream’e patch gönderen platform ekipleri
- iç açık kaynak yönetişimi kuran organizasyonlar
- AI coding policy’lerini “tek kuralla” tanımlamaya çalışan mühendislik liderleri

Java ekosisteminde AI katkı yönetişimi standardize olmuş değil.

## Trendler ve Sinyaller

### Trend Kümesi 1: Güvenlik düzeltmeleri artık davranış değiştiriyor

Tekrarlayan sinyal:

- Statemachine fix’i serialization kuralı, wire format ve Redis key alanını değiştiriyor
- Spring Cloud Gateway fix’i proxy/header davranışını değiştiriyordu
- Spring AI fix’i kullanıcı filtresi ile backend sorgu yüzeyi arasındaki sınırı görünür kılıyor

Çıkarım: “Patch seviyesi aldık” cümlesi artık yeterli kabul edilmemeli. Her fix için çalışma zamanı, veri biçimi ve config davranışı ayrı test edilmeli.

### Trend Kümesi 2: Unsupported veya paid-only hatlar daha görünür baskı kuruyor

Tekrarlayan sinyal:

- Sleuth `3.1.14` fix’i enterprise-only
- Jipher `10.36`, GraalVM FIPS hattında son planlı update
- Son günlerde Spring Cloud tarafında da son OSS hat uyarıları gelmişti

Çıkarım: Spring/JVM ekiplerinde “bir sonraki çeyrekte bakarız” diye ertelenen migrasyonlar artık güvenlik ve compliance riski taşıyor.

### Trend Kümesi 3: Çerçeve varsayımları platform mühendisliğini içeri alıyor

Tekrarlayan sinyal:

- Boot `4.1` ile gRPC resmi support
- outbound HTTP için SSRF azaltma
- `@Async` context propagation
- daha derli toplu OpenTelemetry konfigürasyonu

Çıkarım: 2026 yazında Spring Boot hattında değerin önemli kısmı yeni endpoint anotasyonlarından değil, operasyonel default’lardan geliyor.

### Trend Kümesi 4: AI artık hem uygulama güvenliğini hem de upstream yönetişimini etkiliyor

Tekrarlayan sinyal:

- Spring AI vector store filtresi güvenlik açığı
- OpenJDK AI katkı yasağı
- GraalVM AI-assisted contribution kabulü
- Inside Java’nın [agentic migration](https://inside.java/2026/06/14/cline-migrate-java-oca/) oturumu

Çıkarım: AI’nin kalıcı değeri üretimde yalnız “ajan yazmak” değil; migrasyon, review ve otomasyon akışlarını nasıl yönettiğinizde. Gürültü tarafı bol; kalıcı değer validation ve governance’ta.

### Gürültü mü, kalıcı değer mi?

- Çok yüksek kalıcı değer: Statemachine `CVE-2026-41862`, Spring AI `CVE-2026-47835`, Sleuth `CVE-2026-41708`
- Yüksek kalıcı değer: Boot `4.1` SSRF/gRPC/OTel yüzeyi
- Bağlama bağlı yüksek değer: Jipher `10.36` ve GraalVM FIPS yol ayrımı
- Düşük-orta öncelikli fakat izlemeye değer: OpenJDK vs GraalVM AI katkı politikası ayrışması, Inside Java agentic migration oturumu

## Araçlar ve Kütüphaneler

- [Spring Statemachine `4.0.2`](https://github.com/spring-projects/spring-statemachine/releases/tag/v4.0.2): güvenlik fix’i ile birlikte serialization ve persistence davranışı değişiyor.
- [Spring AI `1.1.8`](https://github.com/spring-projects/spring-ai/releases/tag/v1.1.8) ve [`1.0.9`](https://github.com/spring-projects/spring-ai/releases/tag/v1.0.9): vector store güvenlik düzeltmesi nedeniyle bakım hattında minimum zemin.
- [Spring Boot `4.1`](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes): gRPC, SSRF hardening ve observability config yüzeyiyle platform default’larını güçlendiriyor.
- [Oracle Jipher `10.36`](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java): FIPS ortamlarda dikkat gerektiren crypto sağlayıcısı güncellemesi.
- [OpenJDK AI Policy](https://openjdk.org/legal/ai) ve [GraalVM contributor policy](https://www.graalvm.org/community/contributors/): runtime değil, fakat Java platform katkı süreçlerinde artık takip edilmesi gereken yönetişim araçları.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Statemachine persistence kullanan ekipler, upgrade öncesi custom state/event registration ve eski persisted context migration planı yapmadan üretim geçişi yapmamalı.
- RAG veya semantic search katmanında Spring AI vector store kullanan ekipler, metadata filtrelemesini güvenlik sınırı olarak ele almalı; özellikle dış kullanıcıdan gelen filtreler için.
- `spring-cloud-sleuth-instrumentation` bağımlılığı hâlâ canlıysa, servis bazında Micrometer Tracing’e geçiş backlog değil acil mimari iş kabul edilmeli.
- Spring Boot `4.1` değerlendiren ekipler, custom outbound HTTP guard kodlarını ve ayrı gRPC starter’larını sadeleştirme fırsatı bulabilir.
- Compliance zorunlu ortamlarda GraalVM + FIPS kombinasyonu kullanılıyorsa, Jipher `10.36` sonrası Oracle JDK geçişi için bütçe ve zaman planı çıkarmak gerekiyor.
- Upstream’e katkı veren ekipler, AI coding policy’lerini repo bazında tanımlamalı; “Oracle-backed Java projelerinde kural aynıdır” varsayımı artık yanlış.

## Fırsatlar ve Riskler

- Fırsat: Boot `4.1` ile gRPC ve outbound HTTP güvenlik yüzeyini framework içine taşımak
- Fırsat: StateMachine upgrade’i sırasında persistence modelini ve custom type envanterini temizlemek
- Fırsat: Sleuth’ten Micrometer Tracing’e geçişi yalnız migration değil observability sadeleşmesi olarak ele almak
- Fırsat: RAG uygulamalarında metadata filtreleme katmanını açık bir güvenlik kontratına dönüştürmek
- Risk: StateMachine fix’ini dependency bump gibi ele alıp eski context’lerin okunamamasıyla üretimde sürpriz yaşamak
- Risk: Redis namespace değişimini görmeyip “context kayboldu” türü operasyonel hata üretmek
- Risk: Spring AI vector store filtrelerini kullanıcı girdisinden doğrudan üretmeye devam etmek
- Risk: Sleuth `3.1.x` hattında kalıp güvenlik düzeltmesini yalnız paid support ile alabilir duruma düşmek
- Risk: FIPS + GraalVM kullanan ortamlarda Jipher yol haritasını son dakikaya bırakmak

## İzlenmesi Gereken Konular

- Spring tarafı, StateMachine güvenlik fix’i sonrası migration kolaylaştıracak ek araç veya guide yayımlayacak mı
- Spring AI `2.0.x` dokümantasyonu, vector store güvenlik modeli ve filter construction için daha net “safe usage” örnekleri ekleyecek mi
- Sleuth `3.1.x` kullanıcıları için Micrometer Tracing’e geçişi hızlandıracak resmi bir migration notu veya otomasyon rehberi gelecek mi
- Boot `4.1` üstünde `InetAddressFilter` kullanımında sahadan false positive veya DNS/mesh yan etkisi raporları çıkacak mı
- OpenJDK interim AI policy kalıcı politikaya dönerken kapsam daralacak mı, yoksa repo dışı içerikleri de aynı sertlikte kapsayacak mı
- Oracle, FIPS gerektiren GraalVM kullanıcıları için Jipher `10.36` sonrasına dönük daha somut geçiş yolu açıklayacak mı

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Statemachine `CVE-2026-41862`, güvenlik fix’iyle birlikte serialization sözleşmesini değiştirdi
- source: [CVE-2026-41862](https://spring.io/security/cve-2026-41862), [Spring Statemachine `4.0.2` Release](https://github.com/spring-projects/spring-statemachine/releases/tag/v4.0.2)
- author: Spring Security Team; Janne Valkealahti ve Spring Statemachine maintainers
- date: 11 Haziran 2026
- category: security, serialization, state-management, migration
- tags: statemachine, kryo, deserialization, allowlist, redis, wire-format
- summary: Kryo tabanlı persisted context deserialization’ında allowlist eksikliği RCE riski doğuruyor. Fix, explicit class registration, wire-format değişimi ve Redis key namespace değişimi getiriyor.
- why_it_matters: Güvenlik açığıyla birlikte çalışma zamanı ve veri uyumluluğu değişiyor; upgrade doğrudan operasyonel etki üretiyor.
- java_spring_relevance: Spring Statemachine persistence kullanan servisler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Persist edilen state/event tiplerini temizleyip state machine persistence modelini daha sıkı hale getirmek.
- risks: Eski context’lerin okunamaması, custom sınıfların register edilmemesi, Redis anahtar görünürlüğünün kaybolması.
- migration_notes: `Kryo.setRegistrationRequired(true)` sonrası custom state/event/header tipleri explicit register edilmeli; eski persisted context’ler upgrade sonrası okunamaz; Redis key prefix değişimi test edilmeli.

### Bulgu 2

- title: Spring AI vector store güvenlik açığı, RAG metadata filtrelerini saldırı yüzeyine çevirdi
- source: [CVE-2026-47835](https://spring.io/security/cve-2026-47835), [Spring AI `1.1.8` Release](https://github.com/spring-projects/spring-ai/releases/tag/v1.1.8), [Spring AI `1.0.9` Release](https://github.com/spring-projects/spring-ai/releases/tag/v1.0.9)
- author: Spring Security Team; Spring AI Team; Nitro Cao
- date: 12 Haziran 2026
- category: security, ai-platform, search, data-access
- tags: spring-ai, vector-store, elasticsearch, opensearch, gemfire, rag, metadata-filter
- summary: Özel karakterlerle metadata filtrelerinden Elasticsearch, OpenSearch ve GemFire tarafında keyfi sorgu zorlaması yapılabiliyor. Fix versiyonları `1.0.9` ve `1.1.8`.
- why_it_matters: AI özelliklerinde veri erişim katmanı genellikle “uygulama dışı yardımcı servis” gibi ele alınıyor; bu advisory onun doğrudan güvenlik sınırı olduğunu gösteriyor.
- java_spring_relevance: Spring AI ile RAG, semantic search veya vector filtering kullanan Java ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Metadata filter üretimini merkezi validation katmanına almak; vector store sorgularını daha güvenli sözleşmelere bağlamak.
- risks: Kullanıcı girdisinin metadata filtrelerine doğrudan eşlenmesi; iç veri kümelerinde beklenmeyen sorguların zorlanması.
- migration_notes: `spring-ai-elasticsearch-store`, `spring-ai-opensearch-store` ve `spring-ai-gemfire-store` kullanıcıları `1.0.9` veya `1.1.8` seviyesine çıkmalı; filtre kurma katmanı yeniden gözden geçirilmeli.

### Bulgu 3

- title: Sleuth `3.1.x` için güvenlik fix’inin enterprise-only olması, tracing migrasyonunu güvenlik kararına dönüştürdü
- source: [CVE-2026-41708](https://spring.io/security/cve-2026-41708)
- author: Spring Security Team
- date: 11 Haziran 2026
- category: security, observability, support-policy, migration
- tags: sleuth, spring-tx, dos, micrometer-tracing, paid-support
- summary: `spring-cloud-sleuth-instrumentation` ve aktif Spring TX instrumentation kombinasyonunda DoS açığı var. Fix yalnız `3.1.14` ve enterprise support hattında.
- why_it_matters: Eski observability stack’inde kalmanın bedeli artık yalnız teknik borç değil; güvenlik düzeltmesi için ücretli hatta bağımlılık.
- java_spring_relevance: Spring Cloud Sleuth kullanan ekipler için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Micrometer Tracing’e geçip observability mimarisini sadeleştirmek.
- risks: Sleuth hattında kalıp yeni güvenlik olaylarında yine aynı destek baskısına girmek.
- migration_notes: Önce `spring-cloud-sleuth-instrumentation` kullanımını servis bazında tespit edin; TX instrumentation gerçekten kullanılıyorsa migration veya enterprise patch kararı hemen verilmeli.

### Bulgu 4

- title: Spring Boot `4.1`, outbound güvenlik ve RPC altyapısını framework varsayımına yaklaştırdı
- source: [Spring Boot `4.1` Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes), [InfoQ: Spring Boot 4.1 Adds gRPC Auto-Configuration, SSRF Mitigation, and Kotlin 2.3 Support](https://www.infoq.com/news/2026/06/spring-boot-4-1/)
- author: Spring Boot Team; Karsten Silz
- date: 10-15 Haziran 2026
- category: platform, security, rpc, observability
- tags: boot-4.1, grpc, inetaddressfilter, ssrf, opentelemetry, async-context, jooq
- summary: Boot `4.1`, gRPC server/client support, `InetAddressFilter` tabanlı SSRF azaltma, `@Async` context propagation ve daha geniş OpenTelemetry config yüzeyi getiriyor.
- why_it_matters: Takımların kendi starter veya guard koduyla çözdüğü pek çok platform işi artık doğrudan framework seviyesinde destekleniyor.
- java_spring_relevance: Boot `4.x` yoluna giren Java/Spring ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Custom gRPC bootstrap ve outbound SSRF guard kodlarını azaltmak; observability config karmaşasını düşürmek.
- risks: `InetAddressFilter` ve gRPC migration etkilerini test etmeden geçiş yapmak; jOOQ/Java 21 gereksinimini gözden kaçırmak.
- migration_notes: Spring gRPC `1.0` kullanıcıları resmi migration guide’ı okumalı; outbound HTTP istemcilerinde DNS/proxy/mesh senaryoları `InetAddressFilter` ile birlikte test edilmeli.

### Bulgu 5

- title: Oracle Jipher `10.36`, FIPS uyumunu sıkılaştırırken GraalVM hattında çıkış sinyali verdi
- source: [Announcing Oracle Jipher `10.36`](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java)
- author: Poonam Parhar
- date: 4 Haziran 2026
- category: security, compliance, cryptography, platform
- tags: jipher, fips-140-3, graalvm, oracle-jdk, tls-1.2, pbkdf2, rsa-pss
- summary: Jipher `10.36`, FIPS 140-3 gereksinimleri nedeniyle crypto kullanımını sıkılaştırıyor ve GraalVM for JDK 17/21 için planlanan son update release olduğunu söylüyor.
- why_it_matters: Regüle ortamlarda küçük crypto değişiklikleri bile deploy blokajına dönüşebilir; ayrıca GraalVM kullanan FIPS workload’lar için yol haritası değişiyor.
- java_spring_relevance: Genel Spring ekipleri için orta; compliance zorunlu ekipler için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Oracle JDK tabanlı destekli FIPS mimarisine geçişi erken planlamak; eski TLS/crypto varsayımlarını temizlemek.
- risks: GraalVM tabanlı FIPS runtime’ı son dakika yeniden platformlamak zorunda kalmak; TLS `1.2` EMS ve PBKDF2 limitleri nedeniyle beklenmedik kırılmalar yaşamak.
- migration_notes: DSA, Triple DES, RSA padding ve PBKDF2 kullanım yüzeyleri test edilmeli; GraalVM tabanlı FIPS dağıtımlarında Oracle JDK geçiş planı açılmalı.

### Bulgu 6

- title: OpenJDK ve GraalVM, AI katkı politikalarında ayrıştı; Java ekosisteminde tek bir upstream kuralı yok
- source: [OpenJDK Interim Policy on Generative AI](https://openjdk.org/legal/ai), [GraalVM For Contributors](https://www.graalvm.org/community/contributors/), [Inside Java: How Agentic Coding Can Help You Migrate Java Applications Faster](https://inside.java/2026/06/14/cline-migrate-java-oca/)
- author: OpenJDK Governing Board / Mark Reinhold; GraalVM Team; Mahdi Kefayati, Saoud Rizwan
- date: 9 Nisan 2026 - 14 Haziran 2026
- category: governance, ai-platform, oss-process, migration
- tags: openjdk, graalvm, ai-assisted-coding, contribution-policy, migration
- summary: OpenJDK AI tarafından üretilmiş katkıları yasaklarken GraalVM AI-assisted katkıları kabul ediyor. Aynı dönemde Inside Java, agentic coding’i Java migrasyonlarını hızlandıran yardımcı yaklaşım olarak çerçeveliyor.
- why_it_matters: AI coding yalnız ürün kodunu değil, upstream katkı ve iç mühendislik süreçlerini de etkiliyor; bu alan repo bazında kural gerektiriyor.
- java_spring_relevance: Upstream katkı veren veya iç açık kaynak yönetişimi kuran Java ekipleri için orta.
- actionability: izlemelik
- impact_level: düşük-orta
- opportunities: Repo bazlı AI contribution policy ve validation standartları yazmak; migrasyon otomasyonunu kontrollü şekilde hızlandırmak.
- risks: Farklı Java projelerine aynı AI contribution kuralını uygulayıp hukuki veya süreçsel sürpriz yaşamak.
- migration_notes: AI destekli modernizasyon kullanılacaksa otomatik doğrulama, test ve insan review zorunlu tasarlanmalı; upstream hedefe göre politika ayrı okunmalı.

## Sonuç

15 Haziran 2026 itibarıyla Java/Spring tarafındaki en güçlü günlük sinyal yeni bir “özellik dalgası” değil; güvenlik düzeltmelerinin uygulama davranışını, veri biçimini ve destek penceresini değiştirmesi. Bugün en acil başlıklar Spring Statemachine persistence kullanan servislerdeki davranış kırığı, Spring AI vector store filtrelerinin güvenlik sınırına dönüşmesi ve Sleuth hattında kalmanın artık güvenlik borcu üretmesi.

Kısa vadede senior Spring ekiplerinin en doğru hamlesi, sürüm yükseltmelerini dependency listesi düzeyinde değil kullanım yüzeyi düzeyinde ele almak: persist edilen sınıflar, metadata filtreleri, tracing bağımlılıkları, outbound HTTP güvenlik kontrolleri ve compliance runtime kararları ayrı ayrı masaya yatırılmalı. Bugünün kalıcı değeri burada.
