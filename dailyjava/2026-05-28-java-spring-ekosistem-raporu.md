# Günlük Java / Spring Ekosistem Raporu

Tarih: 28 Mayıs 2026  
Tarama zamanı: 28 Mayıs 2026 09:06 TSİ  
Odak: Spring Boot güvenlik bakım sürümleri, Spring Security ve gRPC tarafındaki yeni güvenlik sinyalleri, Spring Boot 4.1 RC1'in operasyonel kabiliyetleri ve JDK 27'nin startup script kırabilecek migration değişiklikleri

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring proje sayfaları](https://spring.io/projects), [Spring Security advisories](https://spring.io/security), ilgili GitHub release sayfaları, [Inside Java](https://inside.java/), [OpenJDK JDK 27 release notes](https://jdk.java.net/27/release-notes), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java/Spring](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long akışı](https://spring.io/blog/2026/05/26/this-week-in-spring-may-26-2026), [Gunnar Morling'in blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY'ın blogu](https://blog.burakkutbay.com/) kontrol edildi. Baeldung tarafında özellikle Spring Authorization Server multitenancy ve Spring AI MCP anotasyon yazıları; Burak KUTBAY tarafında API versioning ve HTTP Service Client yazıları; Gunnar Morling tarafında Hardwood/Parquet yazıları görüldü. Bunlar faydalı referanslar olsa da bugünün ana üretim kararı etkisi, release ve advisory kaynaklarında toplandı.

## Öne Çıkan Başlıklar

- [Spring Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now) ve [3.5.14](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now), TLS hostname verification, temp directory, weak PRNG, DevTools remote secret ve PID path gibi doğrudan operasyon yüzeyine dokunan bir CVE kümesini kapatıyor.
- [Spring Security 6.5.10 / 7.0.5 / 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-security-releases/) yalnız patch değil; eski OSS destek hatlarının kapandığını ve MFA, opaque token introspection, preflight filtering gibi 7.1 özelliklerinin devreye girdiğini gösteriyor.
- [Spring gRPC için CVE-2026-40968](https://spring.io/security/cve-2026-40968), authorization failure sonrasında `SecurityContext` sızıntısı riskini ortaya koydu; [1.0.3](https://docs.spring.io/spring-grpc/reference/index.html) sürümü bekletilmemeli.
- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), HTTP client egress kontrolü, OpenTelemetry env var desteği, `LazyConnectionDataSourceProxy`, gRPC advice ve truststore certificate monitoring gibi pratik operasyon özelliklerini çekirdeğe yaklaştırıyor.
- [JDK 27 heads-up](https://inside.java/2026/05/13/quality-heads-up/) tarafında esas yeni risk, startup script'lerde kalan `-noverify`, `-Xverify:none`, `-verifyremote`, `-noclassgc` gibi eski launcher seçeneklerinin artık hard-fail üretmeye yaklaşması.

## Kritik Güncellemeler

### 1. Spring Boot 4.0.6 ve 3.5.14 güvenlik bakım sürümleri, "küçük upgrade" muamelesi görmemeli

[Spring Boot 4.0.6 duyurusu](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now) ve [3.5.14 duyurusu](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now) birlikte okunduğunda net tablo şu:

- TLS hostname verification yalnız uygulama kodunda değil, starter/autoconfiguration katmanında da kırılabiliyor.
- `RandomValuePropertySource` gibi masum görünen bir yardımcı yapı, secret üretiminde zayıf PRNG kullanımına dönebiliyor.
- Predictable temp directory ve PID file symlink takibi, container veya çok kullanıcılı ortamlarda istismar yüzeyine dönüşebiliyor.
- Remote DevTools secret karşılaştırması, production'da "zaten kapalıdır" varsayımıyla unutulmaya çok müsait.

Öne çıkan CVE'ler:

- `CVE-2026-40970`: Elasticsearch auto-configuration SSL hostname verification
- `CVE-2026-40971`: RabbitMQ auto-configuration SSL hostname verification
- `CVE-2026-40972`: DevTools remote secret timing attack
- `CVE-2026-40973`: Predictable temp directory
- `CVE-2026-40974`: Cassandra SSL auto-configuration
- `CVE-2026-40975`: `RandomValuePropertySource` weak PRNG
- `CVE-2026-40976`: Actuator var ama health yokken default security zinciri hatalı
- `CVE-2026-40977`: PID file path symlink takibi

Bu neden kritik:

- Bunların çoğu business logic değil platform kodu. Yani "bizim auth katmanımız temiz" demek yetmiyor.
- Özellikle platform ekiplerinin verdiği ortak starter, base image ve deployment template'ler üzerinden aynı zafiyet onlarca servise yayılabiliyor.
- 4.0.x ve 3.5.x ekipleri için aksiyon aynı: feature beklemeden patch geçmek.

Net yorum: Bugünün en yüksek öncelikli işi, Boot point release envanterini ve kullanılan starter kombinasyonlarını doğrulamak.

### 2. Spring Security hattında patch, support ve yeni feature yönü aynı anda değişiyor

[Spring Security 2026.04 releases](https://spring.io/blog/2026/04/21/spring-security-releases/) altı madde altında yedi CVE'yi kapatıyor:

- `DaoAuthenticationProvider` ile user attribute enumeration
- X.509 client certificate ile unauthorized impersonation
- `withIssuerLocation` ile misconfiguration riski
- `HttpSecurity#securityMatchers` ve XML authorization rules için servlet path eşleşme hataları
- Authorization Server dynamic client registration metadata validation açığı
- `JdbcOneTimeTokenService` ile tek kullanımlık token'ın birden fazla session açabilmesi

Ek olarak aynı duyuru iki operasyonel gerçeği hatırlatıyor:

- Spring Security `5.7.x`, `5.8.x`, `6.3.x`, `6.4.x` OSS destek dışı.
- Destekli OSS çizgisi fiilen `6.5.x` ve `7.0.x`; yeni kabiliyetlerin geldiği preview çizgi ise `7.1.0-RC1`.

[Spring Security 7.1 "What's New"](https://docs.spring.io/spring-security/reference/7.1-SNAPSHOT/whats-new.html) tarafında da düşük gürültülü ama değerli özellikler var:

- programmatic MFA koşulları
- `MultiFactorCondition.WEBAUTHN_REGISTERED`
- `RestClientOpaqueTokenIntrospector`
- `InetAddressMatcher`
- CORS preflight için `PreFlightRequestFilter`

Bu neden kritik:

- Security sürümü artık yalnız dependency bump değil; hangi destek hattında kalacağınıza dair platform kararı.
- 7.1 özellikleri doğrudan enterprise auth use-case'lerine gidiyor: MFA, opaque token, conditional auth, edge filtering.
- Özellikle servlet path matching açığı, custom servlet path kullanan gateway ve legacy WAR dağıtımları için sessiz güvenlik boşluğu üretir.

Net yorum: Güvenlik tarafında "önce patch, sonra feature" yaklaşımı doğru; ama 7.1'e bakmadan gelecek auth backlog'u planlamak da eksik kalır.

### 3. Spring gRPC 1.0.3, güvenlik nedeniyle acil geçilmesi gereken niş ama ciddi bir sürüm

[Spring advisory CVE-2026-40968](https://spring.io/security/cve-2026-40968) şunu söylüyor:

- Authenticated bir kullanıcı gRPC metoduna erişemediğinde, başarısız authorization sonrasında kimlik worker thread üzerinde kalabiliyor.
- Daha sonra aynı thread'de gelen unauthenticated istek, önceki kimlik bağlamını miras alabiliyor.
- Etkilenen hat: Spring gRPC `1.0.0 - 1.0.2`
- Fix: `1.0.3`

[Spring gRPC docs](https://docs.spring.io/spring-grpc/reference/index.html) bugün stable çizginin `1.0.3` olduğunu gösteriyor.

Bu neden kritik:

- Bu tip sorunlar business metric'lerde değil, privilege boundary'de yaşanır.
- High-throughput gRPC servislerinde thread reuse yüzünden laboratuvar dışı prod etkisi üretme ihtimali vardır.
- REST ekibi bu riski hiç görmeyebilir; gRPC servisleri ayrı yaşam döngüsündeyse daha da tehlikeli.

Net yorum: gRPC kullanıyorsanız bu sürüm "nice to have" değil, security hotfix.

### 4. Spring Boot 4.1.0-RC1, operasyon ve güvenliği framework seviyesine taşıyor

[Spring Boot 4.1.0-RC1 duyurusu](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now) ve [GitHub release notes](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0-RC1) birlikte bakıldığında öne çıkanlar:

- HTTP client tarafında `InetAddress` filtering ile SSRF/egress kontrolü
- OpenTelemetry SDK environment variables desteği
- `LazyConnectionDataSourceProxy` desteği
- truststore certificate monitoring için `SslMeterBinder`
- gRPC exception handling için `@GrpcAdvice`
- Redis annotation-driven listeners
- custom `SessionTimeout` bean desteği
- API versioning path strategy etrafındaki bug fix'ler

Bu neden önemli:

- Boot 4.1 yalnız yeni starter değil; platform guardrail'lerini koda daha yakın taşıyor.
- `InetAddress` filtreleme, outbound policy'yi yalnız reverse proxy veya sidecar'a bırakmayan bir yaklaşım.
- OTel env var desteği, platform mühendisliği ile uygulama ekipleri arasındaki konfigürasyon sözleşmesini sadeleştirir.
- `LazyConnectionDataSourceProxy`, özellikle işlem açmayan request path'lerde gereksiz DB bağlantısını azaltabilir.

Net yorum: RC olduğu için prod standardı yapılmaz; ama platform pilotu için güçlü aday.

### 5. JDK 27 geçişinde ilk kırılma noktası uygulama kodu değil, launcher ve script katmanı olacak

[Inside Java heads-up](https://inside.java/2026/05/13/quality-heads-up/) ve [JDK 27 release notes](https://jdk.java.net/27/release-notes) birlikte iki pratik uyarı veriyor:

- `-noclassgc`, `-verifyremote`, `-noverify`, `-Xverify:none` artık kaldırılma eşiğinde; JDK 27'de unrecognized option olarak hard fail üretmeleri bekleniyor.
- `java.locale.useOldISOCodes` özelliği kaldırıldı; legacy `"iw"`, `"ji"`, `"in"` kodlarına güvenen davranışlar artık warning üretip etkisiz kalacak.

Bu neden kritik:

- Eski JVM flag'leri çoğu zaman uygulama repo'sunda değil Dockerfile, Helm chart, init script, app server config veya CI wrapper içinde saklıdır.
- JDK pilotları "uygulama ayağa kalkmıyor" diye görünür ama gerçek sebep kod değil script olur.
- Locale tarafı daha düşük öncelik ama çok dilli legacy entegrasyonlarda veri/parsing sürprizi yaratabilir.

Net yorum: JDK 27 readiness için ilk iş benchmark değil, config grep.

## Trendler ve Sinyaller

### Trend Kümesi 1: Güvenlik borcu artık business auth kodundan çok framework entegrasyonlarında birikiyor

Tekrarlayan sinyal şurada:

- Boot point release CVE'leri autoconfiguration ve runtime yardımcılarına vuruyor.
- Spring Security release'i matcher, X.509, OTT ve auth-server metadata gibi edge-case görünen ama production'da pahalı alanları kapatıyor.
- Spring gRPC advisory, thread context isolation tarafındaki güvenlik riskini ortaya çıkarıyor.

Çıkarım: 2026'da Java/Spring güvenliği, "security starter ekledik" seviyesinde değil; dependency graph, starter davranışı ve support line yönetimi seviyesinde.

### Trend Kümesi 2: Framework 7 / Boot 4 nesli, ops ve policy kararlarını platform primitives haline getiriyor

[InfoQ'nun Spring Framework 7 / Boot 4 röportajı](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) ile Spring'in resmi release notları birlikte okunduğunda tekrar eden desen şu:

- retry ve concurrency throttling artık çekirdeğe daha yakın
- API versioning explicit strateji seçimi istiyor
- Boot 4.1 RC1 egress filtering, telemetry env vars ve gRPC advice gibi konuları first-class hale getiriyor

[Burak KUTBAY'ın API versioning yazısı](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/) bu çizginin Türkçe toplulukta da eğitim konusu haline geldiğini gösteriyor.

Çıkarım: Eskiden "yan kütüphane" ile çözülen konular, artık platform standardına dönüşüyor. Bu iyi haber; ama ekiplerin explicit politika seçmesi gerekiyor.

### Trend Kümesi 3: JDK 27 migration riski, göz alıcı JEP'lerden çok görünmeyen config artıklarında

Son günlerde OpenJDK tarafında çok sayıda headline var; fakat tipik Spring backend ekipleri için bugünün daha kalıcı sinyali şu:

- eski launcher seçenekleri
- legacy locale uyumluluk property'leri
- startup script kalıntıları

Çıkarım: JDK 27 hazırlığında build ve runtime hygiene, yeni dil özelliklerinden daha acil.

## Araçlar ve Kütüphaneler

- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now): Yüksek öncelikli pilot adayı. Özellikle `InetAddress` filtering, OTel env vars ve `LazyConnectionDataSourceProxy` için.
- [Spring gRPC 1.0.3](https://docs.spring.io/spring-grpc/reference/index.html): gRPC kullanan ekipler için doğrudan upgrade hedefi. Güvenlik nedeniyle ertelenmemeli.
- [Spring Security 7.1.0-RC1](https://docs.spring.io/spring-security/reference/7.1-SNAPSHOT/whats-new.html): MFA ve opaque token tarafı olan ekipler için incelemeye değer.
- [Spring Authorization Server multitenancy makalesi](https://www.baeldung.com/spring-multitenancy): Faydalı pratik rehber, ancak bugünün ana engineering sinyali değil. Düşük öncelik.
- [Gunnar Morling'in Hardwood yazıları](https://www.morling.dev/blog/): Veri/Parquet hattı için ilginç, fakat tipik Spring Boot mikroservis yol haritası için bugün düşük öncelik.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Boot `4.0.x` veya `3.5.x` kullanıyorsanız, point release upgrade'i feature değil security işi olarak ele alın.
- `RabbitMQ`, `Cassandra`, `Elasticsearch`, `Actuator`, `DevTools remote`, custom temp dir ve PID path kullanan servisler öncelikli kontrol listesine alınmalı.
- Spring Security'de eski hatlarda kalıyorsanız yalnız feature değil destek problemi de yaşıyorsunuz; bu artık yol haritası kararı.
- Spring gRPC kullanan servislerde negatif authorization testleri yoksa, bu advisory onları zorunlu hale getiriyor.
- Boot 4.1 pilotu açan ekipler security/observability/platform engineering tarafında gerçek değer görebilir; ama RC olduğu için prod standardı yapmadan önce geniş entegrasyon testi şart.
- JDK 27 planı olan ekipler, JVM flag audit'ini doğrudan infra repo'larında başlatmalı; yalnız uygulama repo'sunu taramak yetmez.

## Fırsatlar ve Riskler

- Fırsat: Boot 4.1 ile outbound HTTP güvenlik politikalarını framework seviyesinde standardize etmek.
- Fırsat: OTel env var desteği ile platform ekipleri ve servis ekipleri arasındaki telemetry konfigürasyon sözleşmesini sadeleştirmek.
- Fırsat: Security 7.1 ile MFA ve resource server entegrasyonlarını daha az custom kodla kurmak.
- Fırsat: JDK 27 hazırlığını erken yaparak upgrade döneminde "mysterious startup failure" sınıfını azaltmak.
- Risk: "bakım sürümü" diye Boot patch'lerini geciktirmek ve TLS / temp dir / PRNG / devtools açıklarıyla yaşamak.
- Risk: gRPC servislerinde thread-local security sızıntısını gözden kaçırmak.
- Risk: Eski Spring Security veya Authorization Server hatlarında kalıp destek dışına düşmek.
- Risk: JDK 27'de kaldırılan launcher seçeneklerinin CI, Docker veya app server script'lerini sessizce bozmaya devam etmesi.

## İzlenmesi Gereken Konular

- [Spring AI milestones](https://github.com/spring-projects/spring-ai/milestones) tarafında `2.0.0-RC1` ve `2.0.0` hâlâ açık görünüyor. Spring AI 2.0 GA bekleyen ekipler, resmi release post gelmeden API'yi sabit kabul etmemeli.
- Spring Security `7.1` hattının GA'ye ne kadar hızlı gideceği önemli; MFA ve opaque token kullanan ekipler RC notlarını yakından takip etmeli.
- Spring Boot `4.1` tarafında RC1 sonrası özellikle HTTP client filtering, Redis listeners ve gRPC support değişimlerini izlemek gerekiyor.
- JDK 27 rampdown sürecinde benzer "quality outreach" uyarıları gelmeye devam edecek; yalnız JEP headline değil, release note farkları da taranmalı.
- Baeldung ve topluluk bloglarında Boot 4 / Security 7 / Spring AI etrafında pratik içerik artıyor. Bunlar release sinyali değil ama ekip içi migration enablement için değerli.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot 4.0.6 ve 3.5.14, starter ve runtime yüzeyindeki güvenlik açıklarını kapatıyor
- source: [Spring Boot 4.0.6 available now](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now), [Spring Boot 3.5.14 available now](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now), [Spring Boot releases](https://github.com/spring-projects/spring-boot/releases)
- author: Andy Wilkinson
- date: 23 Nisan 2026
- category: security, runtime, operational-hardening
- tags: spring-boot, cve, rabbitmq, cassandra, elasticsearch, devtools, tempdir, actuator, prng
- summary: Boot 4.0.6 ve 3.5.14; TLS hostname verification, remote DevTools secret karşılaştırması, temp directory güvenliği, weak PRNG ve PID path symlink takibi dahil bir CVE kümesini kapatıyor.
- why_it_matters: Zafiyetler business logic değil framework entegrasyonlarında ortaya çıkıyor; bu yüzden ortak starter kullanan bütün servisler etkilenebilir.
- java_spring_relevance: Spring Boot tabanlı servis parkı için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Boot point release politikasını güvenlik odaklı standardize etmek; platform starter envanterini temizlemek.
- risks: "küçük bakım sürümü" diye geciktirilirse aynı açıklık onlarca serviste kalabilir.
- migration_notes: Kullanılan starter'ları envanterleyin; TLS verification, temp path ve DevTools remote yüzeylerini test ederek 4.0.6 / 3.5.14'e geçin.

### Bulgu 2

- title: Spring Security patch hattı hem ciddi CVE kapatıyor hem de eski OSS destek çizgilerini kapatıyor
- source: [Spring Security 2026.04 Releases - Contains CVE Fixes](https://spring.io/blog/2026/04/21/spring-security-releases/), [What's New in Spring Security 7.1](https://docs.spring.io/spring-security/reference/7.1-SNAPSHOT/whats-new.html), [Spring Authorization Server 1.5.7 Available Now](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now), [Spring Authorization Server project page](https://spring.io/projects/spring-authorization-server)
- author: Josh Cummings, Joe Grandja
- date: 21 Nisan 2026
- category: security, identity, support-lifecycle
- tags: spring-security, spring-authorization-server, mfa, x509, one-time-token, dynamic-client-registration, support-policy
- summary: Security `6.5.10`, `7.0.5`, `7.1.0-RC1` ve Authorization Server `1.5.7`; matcher, X.509, user enumeration, OTT ve dynamic client registration açıklarını kapatıyor; aynı anda eski OSS hatları da kapatılmış durumda.
- why_it_matters: Patch kararı artık yalnız teknik değil; hangi support line'da kalınacağına dair platform kararı haline geliyor.
- java_spring_relevance: Auth, OAuth2, OIDC, resource server veya auth server işleten tüm Spring ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: MFA, opaque token introspection ve conditional auth gibi 7.1 kabiliyetlerini planlı şekilde devreye almak.
- risks: Destek dışı security hatlarında kalmak; servlet path matching veya auth-server metadata validation açıklarını prod'da taşımak.
- migration_notes: Önce destek hattını netleştirin; sonra patch geçin. 7.1 pilotunda MFA, WebAuthn ve resource server davranışlarını ayrı test edin.

### Bulgu 3

- title: Spring Boot 4.1.0-RC1, outbound güvenlik ve observability kontrolünü çekirdeğe yaklaştırıyor
- source: [Spring Boot 4.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), [Spring Boot v4.1.0-RC1 release notes](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0-RC1), [The Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/)
- author: Andy Wilkinson, Karsten Silz, Phil Webb, Sam Brannen, Rossen Stoyanchev ve diğer Spring ekip üyeleri
- date: 23 Nisan 2026
- category: platform-engineering, observability, network-security, developer-productivity
- tags: spring-boot-4-1, opentelemetry, ssrf, inetaddressfilter, lazyconnectiondatasourceproxy, grpc, redis, api-versioning
- summary: Boot 4.1 RC1; HTTP client `InetAddress` filtering, OTel env var desteği, `LazyConnectionDataSourceProxy`, `SslMeterBinder` certificate monitoring, `@GrpcAdvice` ve Redis listeners gibi doğrudan operasyonel değer üreten özellikler getiriyor.
- why_it_matters: Güvenlik ve telemetry politikalarını sidecar veya custom starter yerine framework primitives ile standardize etme fırsatı sunuyor.
- java_spring_relevance: Platform ekipleri, observability sahipleri ve Boot 4 yol haritasındaki servisler için yüksek.
- actionability: pilotla
- impact_level: yüksek
- opportunities: Egress guardrail, daha sade OTel rollout'u, daha kontrollü DB bağlantı kullanımı, gRPC hata yönetimi.
- risks: RC kalitesi; mevcut HTTP client, Redis, gRPC ve versioning davranışlarında entegrasyon farkları.
- migration_notes: Prod'a doğrudan çıkmayın; non-prod pilotta HTTP client filtering, OTel env var precedence ve gRPC error mapping testlerini ekleyin.

### Bulgu 4

- title: Spring gRPC 1.0.3, authorization failure sonrası kimlik sızıntısını düzeltiyor
- source: [CVE-2026-40968 advisory](https://spring.io/security/cve-2026-40968), [Spring gRPC reference](https://docs.spring.io/spring-grpc/reference/index.html), [Spring gRPC project page](https://spring.io/projects/spring-grpc/)
- author: Spring Team
- date: 28 Nisan 2026
- category: security, service-communication, grpc
- tags: spring-grpc, securitycontext, thread-reuse, authorization, privilege-escalation
- summary: AuthZ başarısızlığından sonra `SecurityContext` worker thread üzerinde kalabildiği için, sonraki unauthenticated istekler yanlış kimliği miras alabiliyor; `1.0.3` bu problemi düzeltiyor.
- why_it_matters: Bu sınıf sorunlar düşük görünürlüklü ama yüksek etkili privilege boundary hatalarıdır.
- java_spring_relevance: gRPC ile çalışan Spring Boot servisleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: gRPC authz failure senaryolarını otomatik regresyon testine dönüştürmek.
- risks: Thread reuse altında cross-request identity bleed; yanlış yetkiyle iş yapılması.
- migration_notes: `1.0.0-1.0.2` kullanıyorsanız `1.0.3`e geçin; ayrıca deny-path entegrasyon testleri ekleyin.

### Bulgu 5

- title: JDK 27, eski launcher seçeneklerini ve legacy locale geri dönüş yolunu kapatıyor
- source: [Inside Java - Removal of Deprecated Java Launcher Options](https://inside.java/2026/05/13/quality-heads-up/), [JDK 27 Early-Access Release Notes](https://jdk.java.net/27/release-notes)
- author: Billy Korando, OpenJDK Release Notes
- date: 13 Mayıs 2026
- category: migration, runtime, compatibility
- tags: jdk-27, launcher-options, noverify, noclassgc, verifyremote, locale, startup-scripts
- summary: `-noverify`, `-Xverify:none`, `-verifyremote`, `-noclassgc` artık kaldırılıyor; `java.locale.useOldISOCodes` de etkisiz hale geliyor.
- why_it_matters: En sık kırılan nokta uygulama kodu değil, unutulmuş runtime flag ve startup wrapper'ları olur.
- java_spring_relevance: JDK 27 pilotu planlayan tüm Java/Spring ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Runtime flag temizlik çalışması yapmak; legacy locale davranışını standardize etmek.
- risks: JDK 27 denemelerinde aniden ayağa kalkmayan servisler; locale bazlı entegrasyon sürprizleri.
- migration_notes: Infra repo, Helm chart, Dockerfile, systemd unit ve CI wrapper'larında bu flag'leri grep'leyin; locale tarafında `he`, `yi`, `id` kodlarına geçin.

## Sonuç

Bugünün en güçlü mesajı şu: risk artık yeni büyük özelliğin kendisinde değil, point release ve platform defaults katmanında birikiyor. Boot patch'leri, Security support line'ları, gRPC advisory'leri ve JDK 27 startup uyumluluğu birlikte düşünüldüğünde, senior Spring ekipleri için doğru hareket "önce platform hijyeni ve patch disiplini, sonra feature adoption" çizgisi.

En kısa aksiyon listesi:

1. Boot `4.0.6` / `3.5.14` ve Security `6.5.10` / `7.0.5` patch planını doğrulayın.
2. Spring gRPC kullanıyorsanız `1.0.3`e geçin ve deny-path test ekleyin.
3. JDK 27 hazırlığı için runtime flag grep çalışmasını uygulama repo'sunun dışına taşıyın.
4. Boot 4.1 RC1'i prod değil, platform pilotu olarak ele alın.
