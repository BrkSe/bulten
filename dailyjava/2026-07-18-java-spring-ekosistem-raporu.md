# Günlük Java / Spring Ekosistem Raporu

Tarih: 18 Temmuz 2026  
Tarama zamanı: 18 Temmuz 2026 09:06 TSİ  
Odak: release-train sonrası görünür hale gelen güvenli varsayılanlar, protokol standardizasyonu ve yaklaşan JDK operasyon penceresi

Tarama notu: Bugün [Spring Blog](https://spring.io/blog/), [Spring Release Highlights](https://spring.io/projects/release-highlights/), [Spring Integration 7.1.0 duyurusu](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/), [Spring AMQP 4.1.0 duyurusu](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/), [Spring Authorization Server 2026.06 duyurusu](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06/), [Spring Security 7.1 yenilikleri](https://docs.spring.io/spring-security/reference/7.1.0/whats-new.html), [Spring Session 4.1 yenilikleri](https://docs.spring.io/spring-session/reference/4.1/whats-new.html), [Spring Boot yükseltme rehberi](https://docs.spring.io/spring-boot/upgrading.html), [Spring Boot deprecated property listesi](https://docs.spring.io/spring-boot/appendix/deprecated-application-properties/index.html), [dev.java/news](https://dev.java/news/), [OpenJDK JDK 27 sayfası](https://openjdk.org/projects/jdk/27/), [Oracle Java SE Support Roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html), [Oracle JDK 26 release notes](https://www.oracle.com/java/technologies/javase/26all-relnotes.html), [Oracle CPU July 2026 ön duyurusu](https://www.oracle.com/security-alerts/cpujul2026.html), [InfoQ Java News](https://www.infoq.com/java/news/), [Josh Long - This Week in Spring, 14 Temmuz 2026](https://spring.io/blog/2026/07/14/this-week-in-spring-july-14-2026), [Gunnar Morling blog arşivi](https://www.morling.dev/blog/), [Hardwood 1.0 yazısı](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/), [Baeldung Java 26 özeti](https://www.baeldung.com/java-26-new-features) ve [Burak KUTBAY blog ana sayfası](https://blog.burakkutbay.com/) kontrol edildi. OpenJDK tarafında dünkü raporda öne çıkan 16 Temmuz tarihli value-class tartışmasının ötesinde daha yüksek üretim sinyali veren yeni bir not görünmedi; bugün daha güçlü sinyal Oracle güncelleme penceresi ve Spring 4.1 hattındaki güven varsayımlarında oluşuyor.

## Öne Çıkan Başlıklar

- Spring ekosisteminde asıl değişim artık yeni annotation eklemekten çok güven sınırlarını default davranışlara taşımak: AMQP tarafında `trust no one`, Integration tarafında header allowlist ve Security tarafında IP/introspection primitifleri aynı yöne işaret ediyor.
- Spring Boot `4.1` geçiş maliyeti koddan çok `application.yml` katmanında birikiyor; Jackson 3 uyumu ve rename edilen property'ler sessiz davranış farkı üretebilir.
- Kimlik ve edge yüzeylerinde küçük görünen release'ler aslında backlog'a hemen girmesi gereken işler doğuruyor: Authorization Server `1.5.8` açık yönlendirme düzeltmesi ve Spring Security `7.1` edge/auth iyileştirmeleri bunların başında.
- Oracle Java tarafında 21 Temmuz 2026 CPU penceresi ve Eylül 2026 sonrası Oracle JDK `21` lisans değişimi, runtime standardizasyonunu yalnız teknik değil operasyonel bir karar haline getiriyor.

## Kritik Güncellemeler

### 1. Spring Authorization Server `1.5.8` yalnız patch değil, support-line kararı

[Spring Authorization Server 2026.06 duyurusu](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06/) `CVE-2026-41008` düzeltmesini getiriyor: `request_uri` üzerinden açık yönlendirme riski. Aynı duyuru daha önemli ikinci sinyali de veriyor: açık kaynak desteği `1.3.x` ve `1.4.x` hatları için bitmiş durumda. Bu iki bilgi birlikte okunmalı. Kimlik altyapısı kuran ekipler için mesele yalnız CVE patch'lemek değil; destekli hatta kalıp kalmadığını da doğrulamak.

### 2. Spring AMQP `4.1.0`, mesajlaşma güven kontratını sertleştiriyor

[Spring AMQP `4.1.0` duyurusu](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/) generic AMQP `1.0` desteği, RabbitMQ `4.3` uyumu ve dinamik consumer'lar için daha agresif scale-down davranışı getiriyor. Fakat üretim açısından asıl kritik nokta JSON converter'ların artık varsayılan olarak kimseye güvenmemesi ve iki CVE düzeltmesi:

- `CVE-2026-41701`: fixed reply queue kullanan yapılarda reply poisoning
- `CVE-2026-41714`: `amqps://` URI kullanımında güvenli SSL kurulumunun atlanması

Bu, özellikle eski "trust all package" alışkanlığıyla büyümüş kurumsal kod tabanlarında sessiz kırılma ve daha güvenli varsayılan arasında net bir seçim doğuruyor.

### 3. Spring Integration `7.1.0`, entegrasyon katmanını daha standart ve daha şüpheci hale getiriyor

[Spring Integration `7.1.0` duyurusu](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/) yalnız yeni modül listesi değil. Aynı release:

- `CloudEvents` dönüşümleri için yeni modül
- gRPC iletişimi için yeni modül
- HTTP handler tarafında `RestTemplate` yerine `RestClient` yönü
- `AllowListMessageHeaderSelector`
- `CVE-2026-40987` düzeltmesi

üzerinden "ad hoc entegrasyon" yerine daha standart protokoller ve daha kontrollü metadata taşıma yaklaşımını güçlendiriyor. Event-driven akışlar, edge integration ve file/remote sync kullanan ekipler için bu doğrudan mimari sinyal.

### 4. Spring Security `7.1.0`, edge ve auth tarafında daha iyi primitifler veriyor

[Release Highlights](https://spring.io/projects/release-highlights/) ve [Spring Security 7.1 yenilikleri](https://docs.spring.io/spring-security/reference/7.1.0/whats-new.html) üç pratik iyileştirmeyi öne çıkarıyor:

- `InetAddressMatcher`
- `RestClientOpaqueTokenIntrospector`
- WebAuthn akışlarında authentication event yayınlama

Bunlar "güzel ek özellik" seviyesinde değil. IP tabanlı kontrol, opaque token introspection ve passkey/WebAuthn gözlemlenebilirliği olan sistemlerde kendi helper kodunuzu azaltma ve framework ile aynı hizaya gelme fırsatı sunuyor.

### 5. Spring Boot `4.1` göçünde gerçek iş `application.yml` içinden çıkıyor

[Spring Boot yükseltme rehberi](https://docs.spring.io/spring-boot/upgrading.html) `spring-boot-properties-migrator` modülünü açıkça öneriyor. Aynı rehber, geçici runtime göç desteği sağlasa da `@PropertySource` gibi geç eklenen property'leri yakalamadığını söylüyor. [Deprecated property listesi](https://docs.spring.io/spring-boot/appendix/deprecated-application-properties/index.html) ise değişimin yüzey alanını görünür kılıyor:

- `spring.sql.init.enabled` yerine `spring.sql.init.mode`
- pek çok `spring.jackson2.*` anahtarı Jackson 3 lehine deprecate
- çeşitli JMS/Kafka retry property rename'leri

Bu, Boot `4.1` geçişini dependency bump gibi ele alan ekiplerin konfigürasyon sürüklenmesini gözden kaçırabileceği anlamına geliyor.

### 6. Oracle Java tarafında tarih bazlı operasyon penceresi açıldı

[Oracle JDK 26 release notes](https://www.oracle.com/java/technologies/javase/26all-relnotes.html) açık biçimde `26.0.1` için "21 Temmuz 2026 CPU sonrasına taşımayın" uyarısı veriyor. [Oracle Java SE Support Roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html) ise Oracle JDK `21` için permissive lisans penceresinin Eylül 2026 sonrası kapanacağını, permissive hatta kalmak isteyenlerin `25` veya üstüne çıkması gerektiğini belirtiyor.

Bu sinyal Spring ekipleri için iki kat önemli:

- Runtime baseline'ı geciktirmek artık yalnız performans/tuning konusu değil.
- Platform standardizasyonu, lisans ve patch ritmiyle birlikte ele alınmalı.

## Trendler ve Sinyaller

### Trend Kümesi 1: Güven sınırları framework default'larına taşınıyor

AMQP JSON converter'larının "trust no one" yaklaşımı, Integration tarafındaki allowlist selector ve Security tarafındaki yeni edge/auth primitifleri aynı mesajı veriyor: framework ekipleri artık "uygulama geliştiricisi doğru davranır" varsayımını terk ediyor. Bu kısa vadeli hype değil; kalıcı güvenlik yönü.

### Trend Kümesi 2: Protokol standardizasyonu hızlanıyor

CloudEvents, gRPC, AMQP `1.0`, `RestClient`, opaque token introspection. Farklı projelerden gelen bu başlıklar tek bir ortak yöne işaret ediyor: özel adapter ve el yapımı wrapper yerine daha standart, taşınabilir ve gözlemlenebilir protokoller.

### Trend Kümesi 3: Config yüzeyi yeni migration savaş alanı

Boot `4.1` sonrası asıl sürtünme koddan çok property anahtarlarında, serializer varsayımlarında ve geç eklenen environment kaynaklarında. CI'da config diff üretmeyen ekipler, upgrade'i "başarıyla deploy oldu" diye kapatıp sessiz davranış farkı taşıyabilir.

### Trend Kümesi 4: Runtime kararı lisans ve patch takvimine bağlanıyor

Oracle JDK `21` lisans penceresi ve `26.0.1` CPU takvimi, JDK seçimini yeniden altyapı kararı haline getiriyor. Özellikle büyük Spring filolarında "hangi LTS'teyiz?" sorusunun yanına "hangi lisans ve hangi update disipliniyle?" sorusu da eklenmeli.

## Araçlar ve Kütüphaneler

- [spring-amqp-client](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/): yüksek öncelik. AMQP `1.0` konuşmak isteyen ekipler için resmi, Spring uyumlu yol.
- [spring-integration-cloudevents](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/) ve [spring-integration-grpc](https://docs.spring.io/spring-integration/reference/7.1.0/whats-new.html): yüksek öncelik. Özellikle event envelope standardizasyonu ve service-to-service RPC için.
- [RestClientOpaqueTokenIntrospector](https://docs.spring.io/spring-security/reference/7.1.0/whats-new.html): orta-yüksek öncelik. Opaque token doğrulamada el yapımı HTTP client katmanını azaltabilir.
- [InetAddressMatcher](https://docs.spring.io/spring-security/reference/7.1.0/whats-new.html): orta-yüksek öncelik. IP bazlı allow/deny kararlarını daha okunur hale getirebilir.
- [spring-boot-properties-migrator](https://docs.spring.io/spring-boot/upgrading.html): yüksek öncelik. Geçici migration aracı olarak değerli; kalıcı bağımlılık olarak bırakılmamalı.

Bugün "hemen al ve her projeye koy" seviyesinde yeni genel amaçlı bir OSS araç yok. Sinyal daha çok mevcut Spring araçlarının daha güvenli ve daha standart hale gelmesinde.

## Java / Spring Geliştiricileri İçin Etkiler

- Authorization Server kullanan ekipler `1.5.8` ve `request_uri` akışlarını ayrı bir güvenlik iş maddesi olarak ele almalı.
- RabbitMQ/AMQP kullanan ekipler `trustedPackages=*` gibi eski rahat varsayımları yeniden değerlendirmeli; testlerde çalışıyor olması artık güvenli olduğu anlamına gelmiyor.
- Integration akışlarında custom envelope ve el yapımı gRPC bridge kullanan ekipler, `7.1` modülleriyle sadeleşme fırsatını değerlendirmeli.
- Boot `4.1` göçü yapan ekipler kod diff'inden önce property envanteri çıkarmalı; özellikle Jackson 2 anahtarları ve geç eklenen environment kaynakları için.
- Oracle JDK `21` kullanan platform ekipleri Eylül 2026 lisans değişimi öncesi `21` kalma, `25`e çıkma veya farklı dağıtım seçme kararını netleştirmeli.

## Fırsatlar ve Riskler

- Fırsat: Edge ve messaging güvenliğini helper kütüphanelerden framework default'larına taşıyıp bakım yükünü azaltmak.
- Risk: Güvenli varsayılanlara geçişte test edilmemiş serialization, introspection veya reply-queue davranışlarının üretimde kırılması.
- Fırsat: CloudEvents, gRPC ve AMQP `1.0` üzerinden daha taşınabilir bir entegrasyon omurgası kurmak.
- Risk: Protocol standardizasyonunu yalnız dependency upgrade sanıp schema, header ve compatibility testlerini atlamak.
- Fırsat: Boot config diff ve migrator kullanımıyla upgrade maliyetini görünür hale getirmek.
- Risk: Sessiz property rename'lerini kaçırıp production davranışını fark etmeden değiştirmek.
- Fırsat: JDK update/lisans kararlarını erken alıp son dakika runtime standardizasyon krizini önlemek.
- Risk: 21 Temmuz 2026 CPU ve Eylül 2026 Oracle JDK `21` lisans penceresini pas geçmek.

## İzlenmesi Gereken Konular

- 21 Temmuz 2026 Oracle CPU yayınlandığında Java filonuzun hangi baseline'da kaldığı
- Spring Authorization Server `1.3.x` ve `1.4.x` üzerinde kalan servislerin gerçekten ne zaman destekli hatta taşınacağı
- Spring AMQP `4.1` geçişinde `trustedPackages` ve SSL kurulumlarının hangi servislerde kırılma riski ürettiği
- Spring Integration `7.1` migration guide içindeki breaking change maddelerinin repo envanterine işlenip işlenmediği
- Boot `4.1` yükseltmelerinde `spring.jackson2.*` ve diğer deprecated key'lerin CI üzerinden görünür hale gelip gelmediği
- Spring Session Hazelcast/MongoDB modüllerinin vendor-led bakım modeli altında cadence ve test matrisi beklentisinin değişip değişmediği
- OpenJDK `27` hattında Eylül 2026'ya kadar ek üretim etkili JEP veya serviceability değişikliği gelip gelmediği

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Authorization Server `1.5.8`, açık yönlendirme riskini kapatırken eski support-line'ları da fiilen dışarı itiyor
- `source`: [Spring Authorization Server 2026.06 Releases - Contains CVE Fixes](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06/)
- `author`: Joe Grandja
- `date`: 9 Haziran 2026
- `category`: security, identity, support-policy
- `tags`: spring-authorization-server, cve-2026-41008, request-uri, open-redirect, support-line, boot-3.5.14.1
- `summary`: Spring Authorization Server `1.5.8` `request_uri` tabanlı açık yönlendirme düzeltmesi getiriyor; aynı duyuru `1.3.x` ve `1.4.x` açık kaynak destek hatlarının bittiğini de netleştiriyor.
- `why_it_matters`: İnternete açık kimlik altyapılarında küçük yönlendirme açıkları yüksek etkili zincir risklere dönüşebilir; destek dışı hatta kalmak patch akışını daha da zorlaştırır.
- `java_spring_relevance`: Spring Security Authorization Server kullanan kurum içi SSO, B2B auth ve API platform ekipleri için doğrudan kritik.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: `1.5.x` standardizasyonu; Boot sürüm haritasını auth bileşenleriyle yeniden hizalama
- `risks`: destek dışı `1.3.x`/`1.4.x` hatlarında kalmak; `request_uri` ve redirect akışlarını yanlış güven varsayımıyla bırakmak
- `migration_notes`: `1.5.8`e geçiş planı çıkarın; redirect ve `request_uri` işleyişi için regresyon testi yazın; enterprise hat kullanıyorsanız ticari artifact akışını doğrulayın.

### Bulgu 2

- `title`: Spring AMQP `4.1.0`, AMQP `1.0` açılımını güvenli varsayılanlarla birlikte getiriyor
- `source`: [Spring AMQP 4.1.0 Available](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/) | [Spring Release Highlights](https://spring.io/projects/release-highlights/) | [InfoQ June Spring roundup](https://www.infoq.com/news/2026/06/spring-news-roundup-jun08-2026/)
- `author`: Artem Bilan | Spring team | Michael Redlich
- `date`: 9 Haziran 2026
- `category`: messaging, security, protocol, operations
- `tags`: spring-amqp, amqp-1.0, protonj2, rabbitmq-4.3, trustedpackages, cve-2026-41701, cve-2026-41714
- `summary`: Release generic AMQP `1.0` desteği, RabbitMQ `4.3` uyumu, daha hızlı dynamic consumer scale-down davranışı ve JSON converter'larda "trust no one" default'u getiriyor; aynı anda iki messaging güvenlik açığını kapatıyor.
- `why_it_matters`: Mesajlaşma katmanı genelde yıllarca değişmeden kaldığı için güvenli default değişimleri en çok bu alanda sessiz borç ve sürpriz davranış üretir.
- `java_spring_relevance`: Spring AMQP, Spring Integration AMQP veya RabbitMQ tabanlı iş akışı kullanan Java ekipleri için yüksek öncelikli.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: AMQP `1.0` ile broker bağımlılığını azaltmak; güvenli serializer sınırları kurmak; tüketici ölçekleme davranışını sadeleştirmek
- `risks`: `trustedPackages=*` geri açılımını kör kullanmak; fixed reply queue ve SSL URI davranışını test etmeden upgrade etmek
- `migration_notes`: `MessageConverter`, `trustedPackages`, fixed reply queue ve `amqps://` kullanımını repo çapında aratın; AMQP `1.0` ihtiyacı varsa ayrı PoC ile protocol uyumluluğunu doğrulayın.

### Bulgu 3

- `title`: Spring Integration `7.1.0`, entegrasyon akışlarını CloudEvents, gRPC ve allowlist yaklaşımına itiyor
- `source`: [Spring Integration 7.1.0 Available](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/) | [What's New in 7.1](https://docs.spring.io/spring-integration/reference/7.1.0/whats-new.html) | [Spring Release Highlights](https://spring.io/projects/release-highlights/)
- `author`: Glenn Renfro
- `date`: 10 Haziran 2026
- `category`: integration, event-driven, transport, security
- `tags`: spring-integration, cloudevents, grpc, restclient, allowlistmessageheaderselector, cve-2026-40987, migration-guide
- `summary`: `7.1.0`, CloudEvents ve gRPC için yeni modüller ekliyor; HTTP tarafında `RestClient` yönünü güçlendiriyor; message metadata güveni için allowlist selector sunuyor ve remote file canonicalization CVE'sini kapatıyor.
- `why_it_matters`: Entegrasyon katmanı çoğu zaman kurumsal sistemlerin en heterojen bölgesi; standartlaşma burada doğrudan bakım ve güvenlik farkı yaratır.
- `java_spring_relevance`: Spring Integration akışları, file sync, event bridge, internal RPC ve header zengin message pipeline kullanan ekipler için doğrudan etkili.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: özel header/envelope şemalarını sadeleştirmek; CloudEvents veya gRPC ile daha uyumlu akışlar kurmak
- `risks`: migration guide okunmadan yükseltme yapmak; header güvenini eski varsayımla sürdürmek; remote file sync davranışını yeniden test etmemek
- `migration_notes`: `RestTemplate` tabanlı outbound HTTP, custom header forwarding ve remote file synchronizer kullanan akışları envanterleyin; `7.1` migration guide maddelerini her akış için ayrı kontrol edin.

### Bulgu 4

- `title`: Spring Security `7.1.0`, edge ve auth mantığını el yapımı yardımcı sınıflardan framework primitiflerine çekiyor
- `source`: [What's New in Spring Security 7.1](https://docs.spring.io/spring-security/reference/7.1.0/whats-new.html) | [Spring Release Highlights](https://spring.io/projects/release-highlights/) | [Spring Security 2026.06 Releases](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06)
- `author`: Spring Security team | Josh Cummings
- `date`: 9-10 Haziran 2026
- `category`: security, edge, oauth2, authentication
- `tags`: spring-security, inetaddressmatcher, restclientopaquetokenintrospector, webauthn, mfa, auth-events
- `summary`: `7.1.0`, `InetAddressMatcher`, `RestClientOpaqueTokenIntrospector` ve WebAuthn authentication event yayınlama gibi üretimde işe yarayan yeni güvenlik primitifleri getiriyor; aynı release ailesi CVE düzeltmelerini de taşıyor.
- `why_it_matters`: Güvenlikte helper kod ne kadar fazlaysa yanlış davranış ve bakım yükü de o kadar artar; bu primitifler bazı yaygın custom implementasyonları çöpe çıkarabilir.
- `java_spring_relevance`: OAuth2 resource server, MFA/WebAuthn, reverse-proxy farkındalığı ve IP bazlı erişim politikası olan tüm Spring Security kurulumları için anlamlı.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: custom introspection client'ını kaldırmak; IP policy kodunu sadeleştirmek; passkey akışlarında daha iyi gözlemlenebilirlik elde etmek
- `risks`: eski helper kodu framework ile çakışacak şekilde bırakmak; upgrade sonrası auth davranışını doğrulamamak
- `migration_notes`: opaque token introspection, IP-based allow/deny logic ve WebAuthn event tüketimi olan bileşenleri tarayın; custom client/filter zinciri ile yeni built-in primitifleri karşılaştırın.

### Bulgu 5

- `title`: Spring Boot `4.1` geçişi için en pahalı borç config drift; `spring-boot-properties-migrator` yalnız geçici emniyet kemeri
- `source`: [Upgrading Spring Boot](https://docs.spring.io/spring-boot/upgrading.html) | [Deprecated Application Properties](https://docs.spring.io/spring-boot/appendix/deprecated-application-properties/index.html) | [Spring Release Highlights](https://spring.io/projects/release-highlights/)
- `author`: Spring Boot team
- `date`: güncel dokümantasyon, 18 Temmuz 2026 itibarıyla doğrulandı
- `category`: migration, compatibility, config-governance
- `tags`: spring-boot-4.1, properties-migrator, jackson3, deprecated-properties, propertysource, config-drift
- `summary`: Spring Boot, feature release yükseltmelerinde `spring-boot-properties-migrator` modülünü geçici tanılama ve runtime migration aracı olarak öneriyor; deprecated property listesi özellikle Jackson 3 ve çeşitli infra anahtarlarında sessiz konfigürasyon sürüklenmesini görünür kılıyor.
- `why_it_matters`: Upgrade'in geçti görünmesi, doğru config ile çalıştığı anlamına gelmez; özellikle property rename'leri sessiz no-op veya farklı default davranış üretebilir.
- `java_spring_relevance`: Boot kullanan hemen her servis için geçerli; config'i yoğun olan platform, integration ve data servislerinde etkisi daha yüksek.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: CI'da config diff ve startup diagnostics üretmek; Jackson 3 geçişini kontrollü yapmak
- `risks`: `@PropertySource` gibi geç eklenen kaynakların migrator tarafından görülmemesi; deprecated anahtarların sessiz kalması
- `migration_notes`: migrator'ı geçici olarak ekleyin, startup uyarılarını toplayın, sonra bağımlılığı kaldırın; `spring.jackson2.*`, `spring.sql.init.enabled` ve eski retry/JMS key'lerini repo çapında aratın.

### Bulgu 6

- `title`: Oracle JDK için Temmuz-Eylül 2026 penceresi, runtime standardizasyonunu lisans ve CPU takvimine bağlıyor
- `source`: [Oracle JDK 26 Release Notes](https://www.oracle.com/java/technologies/javase/26all-relnotes.html) | [Oracle Java SE Support Roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html) | [Oracle CPU July 2026 pre-release advisory](https://www.oracle.com/security-alerts/cpujul2026.html) | [OpenJDK JDK 27 page](https://openjdk.org/projects/jdk/27/)
- `author`: Oracle Java team | OpenJDK
- `date`: 21 Nisan 2026, Temmuz 2026, 18 Temmuz 2026 itibarıyla geçerli yol haritası
- `category`: runtime-governance, security, licensing, platform-engineering
- `tags`: oracle-jdk, jdk-26.0.1, july-21-cpu, jdk-21, permissive-license, jdk-25, jdk-27
- `summary`: Oracle, `26.0.1` için 21 Temmuz 2026 CPU sonrasına kalmama uyarısı yapıyor; ayrıca Oracle JDK `21` public permissive penceresinin Eylül 2026 sonrası kapanacağını ve permissive hatta kalmak isteyenlerin `25` veya üstüne çıkması gerektiğini söylüyor.
- `why_it_matters`: Runtime baseline seçimi geciktiğinde yalnız güvenlik değil lisans ve operasyon modeli de değişir; büyük Spring filolarında bunun etkisi toplu olur.
- `java_spring_relevance`: Boot/Spring uygulamaları doğrudan JVM üzerinde yaşadığı için bu kararlar build image, container base image, CI test matrisi ve destek sözleşmesine kadar uzanır.
- `actionability`: `planli_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: JDK standardizasyonunu erken planlamak; `21`den `25`e veya uygun dağıtıma geçişi kontrollü yapmak; CPU takvimini platform ritmine bağlamak
- `risks`: Temmuz CPU'sunu ve Eylül lisans penceresini kaçırmak; container image'larda heterojen JDK yayılımı bırakmak
- `migration_notes`: üretimde hangi Oracle JDK sürümlerinin çalıştığını envanterleyin; `21` ve `26.0.1` kullanan servisleri ayrı işaretleyin; Eylül 2026 öncesi lisans/paketleme kararını kesinleştirin.

## Sonuç

Bugünün en güçlü sinyali yeni bir "büyük framework lansmanı" değil; Spring `4.1` sonrası ekosistemin güveni varsayılanlara taşıması ve bunun konfigürasyon, messaging, auth ve runtime yönetiminde gerçek operasyon işi üretmesi. Kısa vadede en mantıklı hareket, Authorization Server ve AMQP yamalarını öne çekmek, Boot `4.1` config diff işini backlog'a almak ve JDK update/lisans penceresini Eylül'e bırakmadan netleştirmek.
