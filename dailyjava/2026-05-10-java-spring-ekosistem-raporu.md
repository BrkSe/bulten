# Günlük Java / Spring Ekosistem Raporu

Tarih: 10 Mayıs 2026  
Tarama zamanı: 10 Mayıs 2026 09:12 TSİ  
Odak: Spring web/security bakım hattı, Boot 4.1 RC1 ve release-train disiplini, Spring AI M6 kırıcı değişiklikleri, JDK 26/27 güvenlik ve uyumluluk sertleşmesi, durable agent runtime sinyalleri

Tarama notu: Bu rapor hazırlanırken zorunlu kaynaklar sistematik olarak kontrol edildi: [Official Spring Blog](https://spring.io/blog/), [Spring Projects](https://spring.io/projects), [Spring Release Highlights](https://spring.io/projects/release-highlights), [Spring Boot Reference](https://docs.spring.io/spring-boot/reference/index.html), [Spring Cloud Release Reference](https://docs.spring.io/spring-cloud-release/reference/spring-projects.html), [Spring Security Reference](https://docs.spring.io/spring-security/reference/index.html), [Spring AI M6 duyurusu](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/), [Spring AI v2.0.0-M6 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M6), [Spring Framework 7.0.7 release notes](https://github.com/spring-projects/spring-framework/releases/tag/v7.0.7), [Spring Boot 4.1.0-RC1 duyurusu](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), [Spring Boot v4.1.0-RC1 release notes](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0-RC1), [Spring Authorization Server 1.5.7 duyurusu](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now), [CVE-2026-22740](https://spring.io/security/cve-2026-22740), [CVE-2026-22741](https://spring.io/security/cve-2026-22741), [CVE-2026-22745](https://spring.io/security/cve-2026-22745), [OpenJDK JEP 500](https://openjdk.org/jeps/500), [OpenJDK JEP 527](https://openjdk.org/jeps/527), [OpenJDK JEP 532](https://openjdk.org/jeps/532), [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [Inside Java - Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/), [Oracle Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26), [JDK 26 consolidated release notes](https://www.oracle.com/java/technologies/javase/26all-relnotes.html), [InfoQ - The Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [InfoQ - ClawRunr](https://www.infoq.com/news/2026/05/clawrunr/), [This Week in Spring - 5 Mayıs 2026](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026/), [A Bootiful Podcast - Ronald Dehuysser](https://spring.io/blog/2026/04/30/a-bootiful-podcast-ronald-dehuysser/), [JobRunr ClawRunr duyurusu](https://www.jobrunr.io/en/blog/clawrunr/), [Spring Modulith 2.1 RC1 duyurusu](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released), [Spring Modulith 2.1.0-RC1 release notes](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0-RC1), [Spring AI Session API yazısı](https://spring.io/blog/2026/04/15/spring-ai-session-management), [IK.AM Nullability Maven Plugin yazısı](https://ik.am/entries/900/en), [Baeldung Java Weekly 644](https://www.baeldung.com/java-weekly-644), [Gunnar Morling blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/).  
Baeldung tarafında bugün için doğrudan yüksek öncelikli yeni release veya breaking-change sinyali yok; haftalık derleme daha çok kürasyon niteliğinde. Burak KUTBAY tarafında da bugün yeni resmi sürüm duyurusu yok; ancak [API Versiyonlama – Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/) ve [HTTP Service Client Nedir – Spring Boot 4.0](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/) yazıları, resmi Spring yönüyle aynı pratik eksene işaret ediyor.

## Öne Çıkan Başlıklar

- [Spring Framework 7.0.7](https://github.com/spring-projects/spring-framework/releases/tag/v7.0.7) ve ilgili [resmi advisories](https://spring.io/security/) sonrası, web katmanında güvenlik bakımını “sonraki sprint” işi gibi görmek artık zayıf bir yaklaşım. Özellikle WebFlux multipart, static resource cache ve Windows static resource path çözümleme alanlarında görünür sertleşme var.
- [Spring AI 2.0.0-M6](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M6), state yönetimini örtük modelden açık modele taşıdı: `PromptChatMemoryAdvisor` kaldırıldı, explicit `conversation ID` zorunlu hale geldi, mutable option API’leri builder temelli immutable yöne kaydı.
- [Spring Boot 4.1.0-RC1](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0-RC1) ile [Spring release highlights](https://spring.io/projects/release-highlights) birlikte okunduğunda, outbound HTTP güvenliği, API versioning ve interface client tarafında daha “platform seviyesinde” yaklaşım belirginleşiyor.
- [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now), dinamik client registration metadata doğrulamasındaki CVE’yi kapatıyor; 1.3.x ve 1.4.x için açık kaynak desteği bittiği için eski hatlarda kalmak artık daha pahalı.
- JVM tarafında “integrity by default” ve kripto modernizasyonu aynı anda sertleşiyor: [JEP 500](https://openjdk.org/jeps/500), [JDK 26 release notes](https://www.oracle.com/java/technologies/javase/26all-relnotes.html) ve [JEP 527](https://openjdk.org/jeps/527) birlikte okunduğunda reflection, keystore ve TLS tercihleri daha denetimli hale geliyor.
- Ajan/agent tarafında kalıcı değer artık “prompt” değil, runtime: [Spring AI Session API](https://spring.io/blog/2026/04/15/spring-ai-session-management), [ClawRunr](https://www.jobrunr.io/en/blog/clawrunr/) ve [Spring Modulith 2.1 RC1](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0-RC1) birlikte, durable execution + event publication + session compaction yönünü güçlendiriyor.

## Kritik Güncellemeler

### Spring Framework web katmanında güvenlik bakımı yükseltildi

[Spring Framework 7.0.7](https://github.com/spring-projects/spring-framework/releases/tag/v7.0.7) ile birlikte aynı dönemde yayımlanan resmi advisory başlıkları doğrudan web katmanını hedefliyor:

- [CVE-2026-22740](https://spring.io/security/cve-2026-22740): WebFlux multipart temp file yönetimi üzerinden DoS riski
- [CVE-2026-22741](https://spring.io/security/cve-2026-22741): Spring MVC ve WebFlux static resource cache poisoning
- [CVE-2026-22745](https://spring.io/security/cve-2026-22745): Windows üzerinde static resource çözümlemesinde DoS

Bu yalnız güvenlik bülteni değil. 7.0.7 release notes aynı zamanda validator performansı, `RestClientXhrTransport`, multipart codec error handling ve API version config değişiklikleri getiriyor. Yani patch yükseltmesi “sadece CVE kapatma” olarak değil, web stack davranışı ve test matrisiyle birlikte ele alınmalı.

### Spring AI M6 artık üretim migration maliyeti taşıyor

[Spring AI 2.0.0-M6 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M6) son dönemin en açık kırıcı değişiklik setlerinden birini içeriyor:

- `PromptChatMemoryAdvisor` kaldırıldı
- explicit `conversation ID` zorunlu hale geldi
- `OpenAiConnectionProperties`, `OpenAiCommonProperties` olarak yeniden adlandırıldı
- provider option sınıflarında mutable setter yaklaşımı bırakılıp builder/constructor yaklaşımı güçlendirildi
- SAP HANA DB ve Infinispan vector store modülleri çıkarıldı

Bu değişikliklerin ortak yönü, AI entegrasyonunu “örtük state + mutable config” yaklaşımından “açık scope + immutable config” yaklaşımına zorlaması. Demo’larda önemsiz görünen bu değişiklik, çok oturumlu, çok kullanıcılı, audit gerektiren agent sistemlerinde ciddi mimari fark yaratır.

### Boot 4.1 RC1 ve Oakwood hattı platform davranışını yukarı çekiyor

[Spring Boot 4.1.0-RC1](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0-RC1) şu başlıkları öne çıkarıyor:

- OpenTelemetry SDK environment variables desteği
- HTTP client tarafında `InetAddress` filtering ile SSRF mitigation
- `LazyConnectionDataSourceProxy` desteği
- certificate monitoring ve `SslMeterBinder` iyileştirmeleri
- `@GrpcAdvice` desteği

Buna [Spring release highlights](https://spring.io/projects/release-highlights) sayfasındaki Cloud 2025.1 hattını ekleyince tablo daha netleşiyor:

- Spring Cloud 2025.1, Boot 4.0 hizasında ve Jakarta EE 11, Jackson 3, JSpecify çizgisinde
- Spring Cloud Gateway, Spring Framework 7 API versioning modeliyle hizalanıyor
- Interface client tarafında declarative circuit breaker ve `lb://` desteği geliyor

Bu kombinasyonun anlamı şu: platform artık outbound çağrıları, versiyonlamayı ve null-safety’yi uygulama ekibinin ad-hoc kararı olmaktan çıkarıp çerçeve seviyesinde biçimlendiriyor.

### Authorization Server tarafında “patch yeter” demek artık eksik

[Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now), `CVE-2026-22752` için fix içeriyor. Daha kritik nokta ise 1.3.x ve 1.4.x hatlarının açık kaynak destek dışına çıkmış olması. Yani yalnız “güvenlik yaması var mı?” değil, “hangi nesilde kalıyoruz?” sorusu da artık önem kazandı.

### JDK 26/27 hattı refleksiyon ve kripto borcunu görünür yapıyor

- [JEP 500](https://openjdk.org/jeps/500) ile JDK 26’da final field mutation varsayılan olarak warning üretmeye başladı; gelecekte `deny` varsayılan olacak.
- [Inside Java rehberi](https://inside.java/2026/04/27/avoiding-final-field-mutation/) bu borcu constructor injection, records, explicit serialization protokolleri ve JFR ile temizlemeyi öneriyor.
- [JDK 26 release notes](https://www.oracle.com/java/technologies/javase/26all-relnotes.html), JKS/JCEKS için uyarı üretiyor, PKCS12 tarafında PBMAC1 yönüne işaret ediyor ve belirli Chunghwa kök sertifikalarına güveni kısıtlıyor.
- [JEP 527](https://openjdk.org/jeps/527), JDK 27’de TLS 1.3 için post-quantum hybrid key exchange’i hedefliyor; `X25519MLKEM768` varsayılan tercih sırasının başına geliyor.

Bu çizgi doğrudan Spring’i hedeflemiyor; fakat Spring Boot üzerinde çalışan her servis bu runtime davranışına tabi.

## Trendler ve Sinyaller

### 1. Release-train uyumu artık operasyonel politika

Tekrarlanan sinyal şu: sürüm seçimi “hangi starter compile oluyor?” seviyesinden “hangi nesil destekleniyor, hangi BOM hangi Boot hattına hizalı?” seviyesine çıktı.

- [Spring Cloud](https://spring.io/projects/spring-cloud) açıkça `2025.1.x -> Boot 4.0.x`, `2025.0.x -> Boot 3.5.x` eşleşmesini veriyor.
- [Spring Security migration rehberi](https://docs.spring.io/spring-security/reference/migration/) son patch sürüme çıkmadan major migration önermiyor.
- [Spring Authorization Server 1.5.7 duyurusu](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now) eski nesillerin OSS EOL olduğunu net söylüyor.

Kalıcı değer: desteklenen hatlara erken ve disiplinli geçiş.  
Gürültü: tekil kütüphane bump’larını “upgrade tamam” sanmak.

### 2. Örtük davranış yerine explicit ve immutable tasarım dayatılıyor

Bu yalnız Spring AI konusu değil. Aynı yönde birden fazla sinyal var:

- Spring AI explicit `conversation ID` ve immutable option builder’larına gidiyor
- JDK 26 final field mutation’ı kısıtlıyor
- [IK.AM Nullability Maven Plugin](https://ik.am/entries/900/en), JSpecify/NullAway ile build-time nullability kapısını pratik hale getiriyor
- [Spring release highlights](https://spring.io/projects/release-highlights) Jackson 3 ve JSpecify’ı portföyün merkezine alıyor

Bu, “framework büyüyor” değil; framework, belirsiz ve gizli davranışı daha pahalı hale getiriyor.

### 3. Outbound client governance ilk sınıf konu haline geliyor

[InfoQ Spring 7 / Boot 4 röportajı](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Boot 4.1 RC1](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0-RC1), [release highlights](https://spring.io/projects/release-highlights) ve [Burak KUTBAY’ın API versioning yazısı](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html) aynı deseni gösteriyor:

- API versioning artık “controller if-else” seviyesi konu değil
- outbound HTTP güvenliği için SSRF mitigation framework seviyesine geliyor
- interface client’lar retry/circuit breaker/load-balancing ile daha merkezi tanımlanıyor
- observability için OTel env tabanlı yönetim daha görünür hale geliyor

Bu, mikroservis ekipleri için özellikle önemli; çünkü problem artık yalnız endpoint yazmak değil, çok sayıda servisin dış çağrı politikasını tutarlı yönetmek.

### 4. Agent hype’ı ile durable execution değeri ayrışıyor

[ClawRunr](https://www.jobrunr.io/en/blog/clawrunr/), [Spring AI Session API](https://spring.io/blog/2026/04/15/spring-ai-session-management) ve [Spring Modulith 2.1 RC1](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0-RC1) birlikte şu sinyali veriyor:

- asıl kalıcı değer prompt zincirleri değil
- session sınırları, retry, job durability, event publication, monitoring ve transaction güvenliği önemli

Yani hype katmanı “Java agent framework” olabilir; kalıcı mühendislik değeri ise durable workflow/runtime altyapısıdır.

### 5. JDK 27 tarafında iki ayrı çizgi var: güvenlikte sertleşme, dilde rafine preview

- [JEP 527](https://openjdk.org/jeps/527): ağ güvenliğinde üretim etkisi yüksek, uzun vadeli değer yüksek
- [JEP 532](https://openjdk.org/jeps/532): dil ergonomisi yönünde beşinci preview, kısa vadeli migration etkisi düşük

Bu ayrım önemli. Her yeni JEP aynı önemde değil. Enterprise Spring ekipleri için JEP 527 ve JEP 500 daha somut; JEP 532 şimdilik izlemelik.

## Araçlar ve Kütüphaneler

- [Nullability Maven Plugin](https://ik.am/entries/900/en): Orta-yüksek öncelik. Maven kullanan ve Spring Framework 7 / Boot 4 hattına gelen ekiplerde JSpecify + NullAway benimsemeyi ciddi biçimde kolaylaştırıyor.
- [ClawRunr](https://www.jobrunr.io/en/blog/clawrunr/): Orta öncelik. Hemen standart yapılacak araç değil; ama JVM üzerinde durable agent runtime desenini izlemek için anlamlı.
- [Spring Modulith 2.1.0-RC1](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0-RC1): Orta öncelik. Özellikle event publication ve JobRunr entegrasyonu kullanan ekipler için değerli.
- [Spring Boot 4.1.0-RC1](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0-RC1): Yüksek öncelik, ama sadece laboratuvar için. Production default’u değil; release-train ve üçüncü parti starter uyumluluğu ile denenmeli.
- [Gunnar Morling’in Hardwood yazıları](https://www.morling.dev/blog/): Düşük öncelik. Parquet, S3 ve veri yoğun JVM işlerinde ilginç; tipik Spring CRUD veya API gateway servisleri için bugünün ana konusu değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring web katmanında 7.0.7 yükseltmesi ve ilgili CVE taraması backlog’a değil aktif güvenlik iş listesine alınmalı.
- Spring AI kullanan ekipler, explicit `conversation ID` taşımayan tüm çağrı akışlarını ve `PromptChatMemoryAdvisor` kullanımlarını hemen envanterlemeli.
- Boot 4.1 laboratuvarı kurulacaksa, yalnız uygulama kodu değil; Cloud BOM, Security, Kafka/Pulsar, gRPC ve özel starter zinciri birlikte test edilmeli.
- Spring Authorization Server kullanan ekipler, yalnız patch seviyesini değil nesil seviyesini de gözden geçirmeli; 1.3/1.4’te kalmak artık açık kaynak bakım açısından savunması zor bir karar.
- JDK 26/27 hazırlığında `--illegal-final-field-mutation=debug` ve seçili hatlarda `deny` ile ayrı CI lane açmak mantıklı.
- Keystore tarafında JKS/JCEKS temizliği ve PKCS12 standardizasyonu için plan yapılmalı; bu yalnız kripto ekibinin işi değil, platform ekibinin işi.
- API versioning, retry ve client-side governance konuları artık bağımsız ekiplerin lokal çözümü olmaktan çıkarılıp platform standardına bağlanmalı.

## Fırsatlar ve Riskler

- Fırsat: Spring AI’nin explicit memory scope yönü, çok kullanıcılı ve regülasyonlu ortamlarda daha denetlenebilir davranış sağlayabilir.
- Fırsat: Boot 4.1 RC1’deki OTel env desteği ve HTTP client sertleşmeleri, deployment pipeline ile runtime policy entegrasyonunu sadeleştirebilir.
- Fırsat: Spring Cloud 2025.1’in API versioning ve interface client yetenekleri, servisler arası sözleşme yönetişimini kod seviyesinden platform seviyesine çekebilir.
- Fırsat: JEP 527 ile gelen PQC yönü, uzun ömürlü veri ve regülasyon baskısı olan alanlarda erken hazırlık avantajı sağlayabilir.
- Risk: Spring AI M6’daki immutable API geçişi ve vector store çıkarımları, compile sorunu kadar sessiz davranış farkları da üretebilir.
- Risk: Spring Framework web advisories’ini geciktirmek, klasik “patch sonra” refleksiyle gereksiz maruziyet yaratır.
- Risk: Boot 4.1 RC1’i tek başına yükseltmek, release-train uyumsuzluğu ve üçüncü parti starter kırıkları doğurabilir.
- Risk: JKS/JCEKS ve legacy cert chain’ler zamanında temizlenmezse, runtime upgrade sonrası kesintiler güvenlikten çok operasyon problemi olarak ortaya çıkabilir.

## İzlenmesi Gereken Konular

- [Spring Boot 4.1 GA](https://docs.spring.io/spring-boot/reference/index.html) ve buna eşlik edecek proje hizalamaları
- [Spring AI 2.0 hattı](https://github.com/spring-projects/spring-ai/releases) içinde memory/session API’lerinin RC/GA aşamasında ne kadar stabilize olacağı
- [Spring Cloud 2025.1.x](https://spring.io/projects/spring-cloud) hattında interface client ve gateway özelliklerinin gerçek saha benimsenmesi
- [JEP 527](https://openjdk.org/jeps/527) sonrası TLS named group ve istemci/terminator uyumluluğu
- [JEP 500](https://openjdk.org/jeps/500) sonrası kütüphane ekosisteminin `deny` varsayılanına ne kadar hızlı hazırlandığı
- [Spring Boot 3.5’in ücretsiz OSS bakım penceresi](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) Haziran 2026’ya yaklaşırken kurumların upgrade temposu

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Framework 7.0.7 web katmanında güvenlik bakımını öne çekiyor
- source: [Spring Framework 7.0.7 release notes](https://github.com/spring-projects/spring-framework/releases/tag/v7.0.7), [CVE-2026-22740](https://spring.io/security/cve-2026-22740), [CVE-2026-22741](https://spring.io/security/cve-2026-22741), [CVE-2026-22745](https://spring.io/security/cve-2026-22745)
- author: Spring Framework team / Spring security advisories
- date: 17 Nisan 2026
- category: framework, security, web, maintenance
- tags: spring-framework, webflux, spring-mvc, multipart, static-resources, dos, cache-poisoning
- summary: Spring Framework 7.0.7 bakım sürümüyle aynı dönemde WebFlux multipart temp files, static resource cache poisoning ve Windows static resource handling için üç resmi advisory yayımlandı.
- why_it_matters: Bu, Spring web katmanında sıradan patch yükseltmesi değil; edge-case gibi görünen resource ve multipart davranışlarının güvenlik yüzeyi olduğunu hatırlatıyor.
- java_spring_relevance: Spring MVC ve WebFlux tabanlı servisler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Web stack patch sürecini güvenlik odaklı standartlaştırmak, resource handling testlerini otomatikleştirmek.
- risks: Patch ertelemesi, WAF veya reverse proxy arkasında yanlış güven hissi, Windows node’larda gözden kaçan maruziyet.
- migration_notes: 7.0.7/6.2.18 hattına çıkış planlanmalı; static resource ve multipart akışları için regresyon testleri eklenmeli.

### Bulgu 2

- title: Spring AI 2.0.0-M6 explicit state ve immutable config modelini dayatıyor
- source: [Spring AI blog duyurusu](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/), [Spring AI v2.0.0-M6 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M6)
- author: Ilayaperumal Gopinathan / Spring AI team
- date: 8 Mayıs 2026
- category: ai, release, migration, state-management
- tags: spring-ai, conversation-id, chat-memory, builders, immutable-config, vector-store
- summary: M6 sürümü, `PromptChatMemoryAdvisor` kaldırılması, explicit `conversation ID`, option sınıflarında builder yaklaşımı ve bazı vector store modüllerinin çıkarılması gibi kırıcı değişiklikler içeriyor.
- why_it_matters: Bu sürüm, agent uygulamalarını demo aşamasından üretim aşamasına taşırken state yönetimini açık ve denetlenebilir hale getiriyor.
- java_spring_relevance: Spring AI ile chat, agent, copilot veya retrieval katmanı geliştiren ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Daha güvenli session izolasyonu, daha öngörülebilir davranış, immutable model ile daha az config drift.
- risks: Sessiz davranış farkları, eski memory abstractions’a bağımlılık, çıkarılan vector store modülleri nedeniyle gizli bağımlılık kırıkları.
- migration_notes: `PromptChatMemoryAdvisor` kullanımını kaldırın; request zincirinde explicit `conversation ID` taşıyın; provider option’larını builder/constructor tabanlı koda taşıyın.

### Bulgu 3

- title: Boot 4.1 RC1 ve Cloud release highlights, client governance’i platform seviyesine taşıyor
- source: [Spring Boot 4.1.0-RC1 duyurusu](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), [Spring Boot v4.1.0-RC1 release notes](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0-RC1), [Spring Release Highlights](https://spring.io/projects/release-highlights), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud), [Spring Cloud release reference](https://docs.spring.io/spring-cloud-release/reference/spring-projects.html)
- author: Andy Wilkinson / Spring Team
- date: 23 Nisan 2026 ve güncel proje dokümantasyonu
- category: platform, cloud, observability, api-governance
- tags: spring-boot-4.1, spring-cloud-2025.1, ssrf, opentelemetry, api-versioning, interface-clients, jspecify, jackson3
- summary: Boot 4.1 RC1, OTel env vars, HTTP client `InetAddress` filtering, `LazyConnectionDataSourceProxy` ve sertifika gözlemi gibi operasyonel özellikler eklerken; release highlights tarafı Cloud 2025.1 ile API versioning ve interface client governance yönünü görünür kılıyor.
- why_it_matters: Çıkış yapan istekler, sürümleme ve gözlemlenebilirlik artık framework’ün “yumuşak önerisi” değil, platform şekillendiricisi.
- java_spring_relevance: Spring Boot + Spring Cloud kullanan mikroservis ekipleri için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Standart SSRF koruması, merkezi observability config’i, API sözleşmesi yönetişimi, declarative resilience.
- risks: Release-train karışıklığı, üçüncü parti starter uyumsuzluğu, RC sürümün üretime erken alınması.
- migration_notes: Boot 4.1 denemeleri ayrı bir laboratuvar hattında yapılmalı; Cloud BOM ve interface client kullanan servisler birlikte test edilmeli.

### Bulgu 4

- title: Spring Authorization Server 1.5.7 güvenlik düzeltmesi kadar nesil seçimini de kritik hale getiriyor
- source: [Spring Authorization Server 1.5.7 duyurusu](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now), [Spring Projects sayfası](https://spring.io/projects)
- author: Joe Grandja
- date: 21 Nisan 2026
- category: security, identity, oauth2
- tags: authorization-server, oauth2, oidc, dynamic-client-registration, cve-2026-22752, eol
- summary: 1.5.7 sürümü dynamic client registration metadata doğrulamasına ilişkin CVE’yi kapatıyor; 1.3.x ve 1.4.x hatlarının OSS desteği de sona ermiş durumda.
- why_it_matters: Kimlik altyapısında yalnız patch seviyesi değil, hangi destekli nesilde olduğunuz da güvenlik stratejisinin parçası.
- java_spring_relevance: Spring Authorization Server kullanan ekipler için çok yüksek; yalnız resource server kullanan ekipler için orta.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Kimlik katmanını desteklenen nesle taşıyıp güvenlik borcunu azaltmak.
- risks: EOL hatlarda kalmak, DCR uçları açıkken metadata validation açığına maruz kalmak, vendor/support belirsizliği.
- migration_notes: 1.5.x hattına geçin; DCR kullanılıyorsa kayıt doğrulama akışlarını yeniden test edin; 1.3/1.4 kullanımını açık risk olarak işaretleyin.

### Bulgu 5

- title: JDK 26/27 hattı reflection, keystore ve TLS tercihlerini daha sert yönetiyor
- source: [JEP 500](https://openjdk.org/jeps/500), [Inside Java - Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/), [JDK 26 consolidated release notes](https://www.oracle.com/java/technologies/javase/26all-relnotes.html), [JEP 527](https://openjdk.org/jeps/527), [Oracle Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26)
- author: OpenJDK / Nicolai Parlog / Oracle Java team
- date: 17 Mart 2026, 21 Nisan 2026, 27 Nisan 2026
- category: jdk, security, compatibility, runtime
- tags: jdk-26, jdk-27, final-field-mutation, pkcs12, jks, jceks, tls, post-quantum
- summary: JDK 26 final field mutation için warning rejimine geçti, JKS/JCEKS kullanımını uyarı kapsamına aldı, PKCS12 tarafında PBMAC1 yönünü işaret etti ve bazı CA zincirlerini kısıtladı; JDK 27 ise TLS 1.3 için hybrid post-quantum key exchange hedefliyor.
- why_it_matters: Runtime davranışı, uygulama kodundan bağımsız olarak güvenlik ve uyumluluk maliyeti doğuruyor.
- java_spring_relevance: JVM üzerinde çalışan tüm Spring servisleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Constructor injection ve immutable modellemeyi artırmak, keystore standardizasyonu, geleceğe dönük TLS hazırlığı.
- risks: Reflection tabanlı test/kütüphane kırıkları, legacy keystore kullanımı, sertifika zinciri uyumsuzlukları, istemci/terminator interoperability sorunları.
- migration_notes: `--illegal-final-field-mutation=debug` ve seçili `deny` koşuları ekleyin; JKS/JCEKS envanteri çıkarın; PKCS12 geçişini planlayın; TLS named groups politikalarını gözden geçirin.

### Bulgu 6

- title: Durable agent runtime yaklaşımı JVM ekosisteminde somutlaşıyor
- source: [Spring AI Session API](https://spring.io/blog/2026/04/15/spring-ai-session-management), [JobRunr ClawRunr](https://www.jobrunr.io/en/blog/clawrunr/), [InfoQ ClawRunr haberi](https://www.infoq.com/news/2026/05/clawrunr/), [Spring Modulith 2.1 RC1 release notes](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0-RC1), [A Bootiful Podcast - Ronald Dehuysser](https://spring.io/blog/2026/04/30/a-bootiful-podcast-ronald-dehuysser/)
- author: Christian Tzolov, Ronald Dehuysser, Oliver Drotbohm, Josh Long
- date: 15 Nisan 2026, 24 Nisan 2026, 30 Nisan 2026, 1-5 Mayıs 2026
- category: architecture, ai, scheduling, modularity
- tags: durable-execution, spring-ai, jobrunr, clawrunr, spring-modulith, session-api, event-publication
- summary: Session compaction, persistent short-term memory, scheduled/retryable agent execution ve event publication güvenliği aynı mimari hatta birleşmeye başladı.
- why_it_matters: Üretimde agent sistemlerinin problemi model seçimi kadar retry, transaction, state isolation ve monitoring.
- java_spring_relevance: Agent, workflow, async orchestration veya event-driven Spring sistemleri kuran ekipler için yüksek.
- actionability: izlemeye_değer
- impact_level: orta-yüksek
- opportunities: JVM üzerinde tek yığınla durable AI/workflow tasarımı, mevcut Spring operasyon modelini koruyarak yeni kullanım alanı açmak.
- risks: Hype’a kapılıp runtime disiplinini ihmal etmek, session/state sınırlarını zayıf kurmak, dayanıklılık ve idempotency konularını model katmanına bırakmak.
- migration_notes: Agent prototiplerinde session store, retry, idempotency key ve event publication semantiği ilk günden tasarlanmalı.

### Bulgu 7

- title: JSpecify ve nullability disiplini artık build-time kalite kapısına dönüşüyor
- source: [IK.AM Nullability Maven Plugin yazısı](https://ik.am/entries/900/en), [Spring Release Highlights](https://spring.io/projects/release-highlights), [InfoQ Spring 7 / Boot 4 röportajı](https://www.infoq.com/articles/spring-team-spring-7-boot-4/)
- author: Toshiaki Maki, Spring Team, InfoQ panelistleri
- date: 24 Şubat 2026, 13 Nisan 2026 ve güncel release highlights
- category: developer-productivity, static-analysis, migration
- tags: jspecify, nullaway, nullability, maven, spring-framework-7, jackson3
- summary: JSpecify artık yalnız dokümantasyon konusu değil; NullAway ve Nullability Maven Plugin ile build-time kalite kapısına dönüşebiliyor, Spring portföyü de bu yönde hizalanıyor.
- why_it_matters: Büyük kod tabanlarında null güvenliği, runtime hata yerine CI aşamasında ölçülebilir kalite metriği haline geliyor.
- java_spring_relevance: Özellikle Maven kullanan büyük Spring ekipleri için orta-yüksek.
- actionability: planlı_aksiyon
- impact_level: orta
- opportunities: NPE sınıfını sistematik azaltmak, API null sözleşmelerini netleştirmek, migration sürecini ölçülebilir hale getirmek.
- risks: Mevcut kod tabanında gürültülü ilk adaptasyon, `@NullMarked` eksikleri, yanlış pozitiflerle geliştirici direnci.
- migration_notes: Önce bir alt modülde pilot uygulanmalı; `package-info.java` ve NullMarked stratejisi netleştirilmeli; kritik API’ler için null sözleşmeleri yazılı hale getirilmeli.

## Sonuç

10 Mayıs 2026 itibarıyla en güçlü mühendislik sinyali, Spring ve JDK ekosisteminin aynı anda daha explicit, daha immutable ve daha policy-driven bir yöne ilerliyor olması. Spring tarafında bu; API versioning, outbound client governance, session scope, release-train uyumu ve security patch disiplini olarak görünüyor. JDK tarafında ise reflection kısıtları, keystore modernizasyonu ve TLS güvenliği olarak karşımıza çıkıyor.

Bugün için pratik öncelik sırası net: önce Spring web/security patch hattını kapatmak, ardından Spring AI M6 migration etkisini çıkarmak, sonra Boot 4.1 + Cloud uyumluluk laboratuvarını release-train seviyesinde kurmak. Orta vadede ise durable agent runtime ve JSpecify/nullability disiplinine bakan ekipler avantajlı konuma geçecek.
