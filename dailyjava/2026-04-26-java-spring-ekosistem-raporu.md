# Günlük Java / Spring Ekosistem Raporu

Tarih: 26 Nisan 2026  
Odak: Spring Boot güvenlik patch hattı, Spring Boot 4.1 release train olgunlaşması, Spring Data ve Spring Vault RC sinyalleri, JDK 26 performans etkisi ve JDK 27 uyumluluk riski

Tarama notu: Bu rapor için [Spring Blog](https://spring.io/blog/), [Spring Security Advisories](https://spring.io/security/), [Spring Boot 4.1.0-RC1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes), [Spring Data 2026.0.0-RC1](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/), [Spring Vault 4.1.0-RC1](https://github.com/spring-projects/spring-vault/releases/tag/4.1.0-RC1), [OpenJDK JEP 522](https://openjdk.org/jeps/522), [OpenJDK JEP 527](https://openjdk.org/jeps/527), [Inside Java](https://inside.java/2026/04/21/quality-heads-up/), [Oracle Java Blog](https://blogs.oracle.com/java/the-arrival-of-java-26), [InfoQ Java roundup](https://www.infoq.com/news/2026/04/java-news-roundup-apr06-2026/), [Baeldung Java Weekly 643](https://www.baeldung.com/java-weekly-643), [Josh Long - This Week in Spring](https://spring.io/blog/2026/04/21/this-week-in-spring-april-21-2026/), [Gunnar Morling blog](https://www.morling.dev/blog/), [Burak KUTBAY blog](https://blog.burakkutbay.com/) ve ek olarak [Foojay](https://foojay.io/today/crossing-the-river-styx-spring-boot-3-5-and-the-zombie-dependency-problem/) kontrol edildi. Josh Long ve Baeldung bu haftaki release/security yoğunluğunu doğruluyor. Gunnar Morling ve Burak KUTBAY tarafında bugün öncelik sırasını değiştiren yeni bir release veya güvenlik duyurusu yok; yine de radar doğrulaması için kontrol edildiler.

## Öne Çıkan Başlıklar

23 Nisan 2026 tarihli `Spring Boot 3.5.14` ve `4.0.6` yayınları, Spring tarafında haftanın en acil konusu oldu. Bu patch hattı; TLS hostname verification, zayıf rastgele değer üretimi, temp dizin güvenliği, PID file symlink davranışı ve bir adet kritik varsayılan güvenlik zinciri problemi dahil çok sayıda CVE kapatıyor. Özellikle `Spring Boot 4.0.x` kullanan ekipler için bu yalnızca rutin patch değil, doğrudan güvenlik bakımıdır.

`Spring Boot 4.1.0-RC1`, Nisan 2026 sonunda en güçlü mimari sinyali veriyor. OpenTelemetry environment variable desteği, `InetAddressFilter` ile SSRF sertleştirmesi, lazy JDBC connection fetching, Redis listener auto-config ve geniş release-train hizalaması; Boot 4.1’in yalnızca yeni bir sürüm değil, yeni bir platform tabanı olacağını gösteriyor.

`Spring Data 2026.0.0-RC1` ve `Spring Vault 4.1.0-RC1`, Boot 4.1 hattının etrafında veri ve secrets katmanının da eşzamanlı olgunlaştığını gösteriyor. Veri yazma/upsert semantiği, Redis cache sıfırlama davranışı ve Vault 2.0 uyumu; özellikle platform ekipleri için pratik karar değeri taşıyor.

JDK tarafında iki ayrı ama bağlantılı sinyal var. Java 26 ile G1 throughput iyileştirmesi artık delivered durumda; JDK 27 tarafında ise locale resource temizliği, bazı OpenJDK dağıtımlarında test ve uyumluluk sürprizleri yaratabilir. Bu ikisi birlikte, JDK yükseltmelerinin sadece performans değil davranış testi de gerektirdiğini hatırlatıyor.

## Kritik Güncellemeler

### Spring Boot 3.5.14 ve 4.0.6 güvenlik hattı

`Spring Boot 3.5.14` ve `4.0.6`, 23 Nisan 2026’da yayınlandı. `4.0.6` sekiz CVE içeriyor; `3.5.14` ise bu setin açık kaynakta 3.5 hattına düşen kısmını kapatıyor. En önemli bulgular:

- `CVE-2026-40976`: Actuator var, `spring-boot-health` yok ve uygulama varsayılan servlet security filter chain’e güveniyorsa `4.0.0 - 4.0.5` hattında yetkisiz erişim mümkün olabiliyor.
- `CVE-2026-40971` ve `CVE-2026-40974`: RabbitMQ ve Cassandra SSL auto-configuration, belirli koşullarda hostname verification yapmıyor.
- `CVE-2026-40975`: `${random.value}` gizli anahtar üretimi için uygun değil; birçok ekip bunu zaten “convenience config” gibi kullanıyordu.
- `CVE-2026-40973`: `ApplicationTemp` üzerinden yerel saldırganın session bilgisi okuması veya kod çalıştırma zinciri kurması mümkün olabiliyor.

Bu hafta Spring güvenliğinin en önemli dersi şu: riskler sadece business logic veya custom security config’te değil, auto-configuration ve default davranışlarda.

### Spring Boot 4.1.0-RC1 platform yönü

`Spring Boot 4.1.0-RC1`, 23 Nisan 2026’da çıktı. Öne çıkanlar:

- OpenTelemetry environment variable desteği
- `InetAddressFilter` ile HTTP istemcilerinde SSRF azaltımı
- `spring.datasource.connection-fetch=lazy` ile fiziksel JDBC bağlantısını gerçekten ihtiyaç anına erteleme
- `@RedisListener` endpoint’leri için auto-configuration
- gRPC desteğinin dokümantasyonla daha görünür hale gelmesi

En kritik nokta ise bağımlılık hizalaması. Bu RC; `Spring Data 2026.0.0-RC1`, `Spring Security 7.1.0-RC1`, `Spring Kafka 4.1.0-RC1`, `Micrometer 1.17.0-RC1`, `Spring Session 4.1.0-RC1`, `Spring Integration 7.1.0-RC1` ve `Spring Framework 7.0.7` ile geliyor. Bu, Boot 4.1’in tek başına değil, release train olarak değerlendirilmesi gerektiği anlamına geliyor.

## Trendler ve Sinyaller

### 1. Güvenlik konusu artık starter ve auto-config yüzeyine taşındı

Bu haftaki Boot CVE’leri klasik “uygulama kodunda açık var” vakalarından çok farklı. RabbitMQ/Cassandra TLS doğrulaması, random secret üretimi, temp dizin sahipliği ve varsayılan security filter chain davranışı; platform ekibinin dependency ve starter seçimini doğrudan güvenlik konusu haline getiriyor.

### 2. Boot 4.1, release candidate aşamasında bile ayrı projeleri aynı hatta topluyor

Boot 4.1 RC1 tek başına değerlendirilmemeli. Spring Data RC1, Vault RC1, Kafka RC1, Security RC1 ve Micrometer RC1 hizası birlikte okunduğunda, Mayıs 2026’daki GA öncesi önemli bir platform konsolidasyonu görülüyor. Kurumsal ekipler açısından bu, “tek modül yükseltmesi” değil “platform sprinti” anlamına gelir.

### 3. Performans iyileştirmeleri artık JDK seçimini yeniden anlamlı kılıyor

Java 26’daki G1 iyileştirmesi, default GC kullanan tipik Spring servislerinde teorik değil pratik sonuçlar doğurabilir. OpenJDK JEP 522’de paylaşılan ölçümlerde, referans alanlarını yoğun güncelleyen iş yüklerinde `%5-%15` throughput artışı belirtiliyor. Bu, container yoğun mikroservis ortamlarında ciddi altyapı etkisi yaratabilir.

### 4. JDK yükseltmesi sadece benchmark işi değil, uyumluluk testidir

Inside Java’nın 21 Nisan 2026 tarihli heads-up yazısı, JDK 27’de bazı eski yerelleştirme kaynaklarının kaldırılacağını söylüyor. Özellikle Oracle/JDK EA dışında kendi OpenJDK build’lerini veya vendor dağıtımlarını kullanan ekiplerde locale-sensitive testler kırılabilir. Bu tip değişiklikler production bug üretmese bile CI ve smoke test zincirini bozar.

### 5. Destek penceresi, artık güvenlik sinyali olarak izlenmeli

Foojay’de Steve Poole’un yazısı önemli bir zihniyet düzeltmesi yapıyor: EOL sonrası CVE sessizliği güvenlik değil görünmezlik anlamına gelebilir. Spring’in resmi support policy sayfası tam gün vermese de `Spring Boot 3.5` gibi son minor hatların OSS penceresinin sınırlı, enterprise desteğinin ise daha uzun olduğunu net biçimde ortaya koyuyor. Bu, 2026 yazına yaklaşırken Boot 3.5 kullanıcıları için gerçek bir yol haritası konusu.

## Araçlar ve Kütüphaneler

Bugün geniş kitleyi etkileyen tamamen yeni bir bağımsız JVM aracı çıkmadı. Dikkat edilmesi gereken esas başlıklar mevcut Spring altyapı katmanlarının yeni release candidate’ları:

- `Spring Data 2026.0.0-RC1`: Relational upsert, Redis mesajlaşma yardımcıları ve cache reset optimizasyonu ile özellikle veri ve cache katmanında değer üretiyor.
- `Spring Vault 4.1.0-RC1`: Vault `2.0.0` ile derlenmesi ve Spring Framework `7.0.7` / Spring Data `2026.0.0-RC1` hizası nedeniyle secrets platformları için anlamlı.
- `Spring Boot 4.1.0-RC1`: SSRF azaltımı ve OTel env-var eşlemesi, sadece feature değil platform sertleştirmesi niteliğinde.

`Spring Shell 4.0.2` yayınlandı, ancak bugünkü üretim öncelik sırasını değiştirecek kadar güçlü bir sinyal üretmiyor. Bu sürümü düşük öncelikli bakım notu olarak görüyorum.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Boot 4.0.x` kullanan ekipler için hedef net: `4.0.6` seviyesine çıkmak bekletilmemeli.
- `Spring Boot 3.5.x` kullanan ekipler yalnızca uygulamayı derliyor olmayı yeterli kabul etmemeli; RabbitMQ, Cassandra, temp/session ve secret üretimi konfigürasyonları özellikle yeniden gözden geçirilmeli.
- `Boot 4.1` planlayan ekipler, RC aşamasında bile observability, JDBC connection lifecycle, Redis listener yapısı ve outbound HTTP güvenliği üzerinde erken test yapmalı.
- `Spring Data` kullanan ekipler için relational upsert ve Redis cache reset davranışı, repository ve cache abstraction tasarımını etkileyebilir.
- `Vault` kullanan ekipler, HashiCorp Vault `2.0` uyumu ve Spring Framework 7 hattı için bağımlılık laboratuvarı açmalı.
- JDK 27 tarafında locale-specific assertion kullanan testler varsa, şimdiden EA build ile kontrol edilmeli.

## Fırsatlar ve Riskler

### Fırsatlar

- Boot 4.1 ile OTel env-var desteğini kullanarak container ve platform bazlı config standardizasyonunu güçlendirmek.
- `InetAddressFilter` ile SSRF riskini framework seviyesinde daraltmak.
- G1 throughput iyileştirmelerini kullanarak CPU yoğun servislerde altyapı maliyetini düşürmek.
- Spring Data RC1 ile veri erişiminde upsert semantiğini sadeleştirmek.
- Spring Vault RC1 ile secrets yönetimini Vault 2.0 uyumlu hatta taşımak.

### Riskler

- `${random.value}` benzeri convenience mekanizmaları secret üretimi için kullanmaya devam etmek.
- Boot patch notlarını sadece “dependency upgrade” gibi okuyup güvenlik yüzeyini kaçırmak.
- JDK 27 locale değişimlerini göz ardı edip CI kırılmalarını prod öncesinde fark etmemek.
- Boot 3.5 hattında kalıp OSS destek penceresinin bitişine çok geç reaksiyon vermek.
- Boot 4.1 RC1’i sadece compile-level doğrulamayla değerlendirip davranış testlerini ihmal etmek.

## İzlenmesi Gereken Konular

- `Spring Boot 4.1 GA` ve ona bağlı `Spring Data 2026.0`, `Spring Vault 4.1`, `Spring Security 7.1`, `Micrometer 1.17` final sürümleri
- `Spring Boot 3.4.x`, `3.3.x` ve `2.7.x` kullanan ekiplerde enterprise-only patch hattına geçiş gereksinimi
- `JDK 27` EA build’lerinde locale ve hata mesajı doğrulamalarının etkisi
- `Spring Cloud Gateway 4.2.0` kullanan ekipler için 9 Nisan 2026 tarihli `CVE-2026-22750` advisory’si; özellikle `spring.ssl.bundle` kullanımında yanlış güven varsayımı riski
- Spring tarafında observability release-train’inin `Micrometer 1.17` ile nasıl olgunlaşacağı

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot 3.5.14 ve 4.0.6, auto-configuration ve default security yüzeyindeki çoklu CVE’leri kapatıyor
- source: [Spring Boot 3.5.14 available now](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now/) ; [Spring Boot 4.0.6 available now](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/) ; [CVE-2026-40976](https://spring.io/security/cve-2026-40976/) ; [CVE-2026-40975](https://spring.io/security/cve-2026-40975/) ; [CVE-2026-40973](https://spring.io/security/cve-2026-40973/) ; [CVE-2026-40971](https://spring.io/security/cve-2026-40971/) ; [CVE-2026-40974](https://spring.io/security/cve-2026-40974/)
- author: Andy Wilkinson ; Spring Security Advisories
- date: 23 Nisan 2026
- category: security, release, maintenance
- tags: spring-boot, cve, actuator, tls, rabbitmq, cassandra, tempdir, secrets
- summary: `3.5.14` ve `4.0.6`; default security chain, SSL hostname verification, weak PRNG, temp directory ownership ve PID file path davranışı dahil çok sayıda güvenlik açığını kapatıyor.
- why_it_matters: Bu açıklar framework içi varsayılanlar ve auto-configuration katmanında olduğu için, ekipler kendi kodları güvenli olsa bile etkilenebilir.
- java_spring_relevance: Spring Boot kullanan neredeyse tüm servisler için doğrudan etkili; özellikle Actuator, RabbitMQ, Cassandra, persistent session ve DevTools kullanan ekipler için yüksek önemde.
- actionability: hemen_guncelle
- impact_level: çok_yüksek
- opportunities: Güvenlik yamalarını platform sprinti içinde standartlaştırmak ve secret/TLS config gözden geçirmesini aynı pencereye almak.
- risks: Patch gecikirse yetkisiz erişim, yanlış TLS güven varsayımı veya local-host saldırı yüzeyi devam eder.
- migration_notes: `4.0.x` -> `4.0.6`, `3.5.x` -> `3.5.14` öncelikli. `3.4.x`, `3.3.x` ve `2.7.x` için düzeltmeler enterprise-only hatlarda.

### Bulgu 2

- title: Spring Boot 4.1.0-RC1, observability ve outbound HTTP güvenliğini merkeze alan yeni release train’i şekillendiriyor
- source: [Spring Boot 4.1.0-RC1 available now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now/) ; [Spring Boot 4.1.0-RC1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-RC1-Release-Notes)
- author: Andy Wilkinson ; Spring Boot team
- date: 23 Nisan 2026
- category: platform-direction, release-candidate
- tags: spring-boot-4-1, opentelemetry, ssrf, redis, jdbc, grpc, release-train
- summary: Boot `4.1.0-RC1`; OTel environment variable desteği, `InetAddressFilter` ile SSRF azaltımı, lazy JDBC connection fetching, Redis listener auto-config ve geniş bağımlılık hizalaması getiriyor.
- why_it_matters: Bu sürüm yalnızca yeni feature listesi sunmuyor; observability, ağ güvenliği ve veri erişim davranışını framework seviyesinde yeniden şekillendiriyor.
- java_spring_relevance: Spring Boot 4.1’e hazırlanan ekipler için config, bağlantı yaşam döngüsü, telemetry ve HTTP istemci güvenliği konularında erken karar değeri taşıyor.
- actionability: pilotla_ve_roadmape_al
- impact_level: yüksek
- opportunities: OTel config standardizasyonu, SSRF yüzeyini daraltma, JDBC pool kullanımını optimize etme.
- risks: RC sürümde davranış farkları ve config semantiği değişiklikleri test edilmeden prod planına yazılırsa sürprizler üretir.
- migration_notes: `spring.datasource.connection-fetch`, outbound HTTP client policy, Redis listener beans ve gRPC kullanım desenleri RC aşamasında test edilmeli.

### Bulgu 3

- title: Spring Data 2026.0.0-RC1, relational upsert ve Redis cache/message davranışlarında pratik kazanımlar sunuyor
- source: [Spring Data 2026.0.0-RC1 enters release candidate phase](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC/)
- author: Mark Paluch
- date: 17 Nisan 2026
- category: data, cache, release-candidate
- tags: spring-data, upsert, redis, cache, pubsub, relational
- summary: `2026.0.0-RC1`; Template API üzerinden relational upsert, `RedisMessageSendingTemplate` ve `RedisCache.resetCaches()` optimizasyonu ile geliyor.
- why_it_matters: Veri katmanında upsert ve cache reset gibi konular genellikle ekiplerin kendi etrafını dolaştığı alanlardır; framework desteği bakım yükünü azaltır.
- java_spring_relevance: Spring Data JPA/Relational/Redis kullanan ekipler için repository tasarımı, cache invalidation ve pub/sub uygulama desenleri üzerinde etkili.
- actionability: kontrollu_pilot
- impact_level: orta_yüksek
- opportunities: Upsert semantiğini sadeleştirmek, Redis cache reset operasyonlarını daha hızlı hale getirmek, listener/sender converter uyumunu artırmak.
- risks: RC sürüm olduğu için API ve davranış son halini almamış olabilir; özellikle Redis’i sadece cache için kullanmayan sistemlerde `FLUSHDB` optimizasyon mantığı dikkat ister.
- migration_notes: Yeni kodda custom upsert SQL ve elle yazılmış Redis reset mantıkları varsa `2026.0` final öncesi yeniden değerlendirilmeli.

### Bulgu 4

- title: Spring Vault 4.1.0-RC1, Vault 2.0 hattına ve Framework 7 tabanına hizalanıyor
- source: [Spring Vault 4.1.0-RC1 and 4.0.2 released](https://spring.io/blog/2026/04/20/spring-vault-4-0-rc1-4-0-2-released/) ; [Spring Vault 4.1.0-RC1 release](https://github.com/spring-projects/spring-vault/releases/tag/4.1.0-RC1)
- author: Mark Paluch
- date: 20 Nisan 2026
- category: security, secrets, release-candidate
- tags: spring-vault, hashicorp-vault, secrets-management, spring-framework-7, spring-data-2026
- summary: `Spring Vault 4.1.0-RC1`; Vault `2.0.0` ile derleniyor ve Spring Framework `7.0.7` ile Spring Data `2026.0.0-RC1` üzerine hizalanıyor.
- why_it_matters: Secrets yönetimi çoğu kurumda merkezi platform konusu; Vault tarafındaki büyük sürüm hizası geç kalınırsa bağımlılık uyumsuzluğu yaratır.
- java_spring_relevance: Spring üzerinden Vault entegrasyonu kullanan mikroservis ve platform ekipleri için doğrudan karar değeri var.
- actionability: labda_test_et
- impact_level: orta
- opportunities: Vault 2.0 geçişini Framework 7 / Boot 4.1 modernizasyonuyla aynı pencereye toplamak.
- risks: RC sürüm olduğu için davranış ve bağımlılık etkileşimleri erken aşamada sürpriz çıkarabilir.
- migration_notes: Vault 2.0 kullanan veya planlayan ekipler, token/lease/secret backend entegrasyonlarını RC ile smoke test etmelidir.

### Bulgu 5

- title: Java 26 ile gelen G1 throughput iyileştirmesi, tipik Spring servislerinde göz ardı edilmemesi gereken bir platform fırsatı sunuyor
- source: [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26) ; [JEP 522](https://openjdk.org/jeps/522)
- author: Sharat Chander ; Ivan Walulya ; Thomas Schatzl
- date: 17 Mart 2026 ; 21 Ocak 2026 güncellemesi
- category: jdk, performance, gc
- tags: java-26, g1, throughput, gc, hotspot, microservices
- summary: Java 26; G1’de senkronizasyon azaltımıyla throughput artışı hedefliyor. JEP 522’de, referans alanı yazımı yoğun iş yüklerinde `%5-%15` aralığında kazanç görüldüğü belirtiliyor.
- why_it_matters: G1 çoğu Spring Boot servisinde default GC olarak zaten kullanımda; bu yüzden iyileştirme benimsemek için kod rewrite gerektirmiyor.
- java_spring_relevance: Container yoğun çalışan, yüksek eşzamanlılığa sahip Spring servislerinde CPU ve latency dengesine doğrudan etki edebilir.
- actionability: laboratuvarda_olc
- impact_level: orta_yüksek
- opportunities: Ek donanım eklemeden throughput kazanımı, daha iyi CPU kullanım profili, bazı iş yüklerinde daha düşük pause maliyeti.
- risks: Her iş yükünde aynı kazanç görülmeyebilir; benchmark yapılmadan genelleme yapmak hatalı olur.
- migration_notes: JDK 26 testleri, mevcut JDK 21/25 tabanlı prod profilleriyle karşılaştırmalı yapılmalı; GC log ve CPU profili birlikte izlenmeli.

### Bulgu 6

- title: JDK 27, eski yerelleştirme kaynaklarını kaldırırken bazı OpenJDK dağıtımlarında test ve uyumluluk sürprizi yaratabilir
- source: [Quality Outreach Heads-up - JDK 27: Obsolete Translation Resources Removed](https://inside.java/2026/04/21/quality-heads-up/)
- author: David Delabassee
- date: 21 Nisan 2026
- category: compatibility, migration, jdk
- tags: jdk-27, locale, testing, compatibility, openjdk-distributions
- summary: JDK 27; bakımı yapılmayan bazı locale resource dosyalarını kaldırıyor. Oracle JDK ve `jdk.java.net` EA build’leri zaten bundan etkilenmiyordu, ancak başka bazı build zincirlerinde davranış farkı oluşabilir.
- why_it_matters: Bu değişiklik fonksiyonel bug’dan çok test ve operasyon sürprizi üretir; kırılan yer genelde uygulama mantığı değil sabit çıktı beklentisidir.
- java_spring_relevance: Spring tabanlı servislerde integration testler, hata mesajı kıyasları ve locale-sensitive log/assertion kontrolleri etkilenebilir.
- actionability: ci_uyumluluk_testi
- impact_level: orta
- opportunities: Hata mesajı kıyaslarını daha dayanıklı hale getirmek ve JDK vendor bağımlı testleri temizlemek.
- risks: Özellikle exact string assertion yapan testler ve desteklenmeyen locale çıktısına güvenen araçlar kırılabilir.
- migration_notes: JDK 27 EA build’lerini CI’ye eklemek, locale bağımlı testleri belirlemek ve mümkünse mesaj içeriği yerine hata tipi/semantik doğrulamak doğru yaklaşım olur.

### Bulgu 7

- title: Spring Boot 3.5 için OSS destek penceresi daralıyor; sessiz CVE dashboard’ları yanıltıcı olabilir
- source: [Crossing the River Styx: Spring Boot 3.5 and the Zombie Dependency Problem](https://foojay.io/today/crossing-the-river-styx-spring-boot-3-5-and-the-zombie-dependency-problem/) ; [Spring Support Policy](https://spring.io/support-policy) ; [Spring Boot 3.5.0 available now](https://spring.io/blog/2025/05/22/spring-boot-3-5-0-available-now)
- author: Steve Poole ; Spring team
- date: 19 Nisan 2026 ; 22 Mayıs 2025
- category: lifecycle, security, roadmap
- tags: spring-boot-3-5, eol, support-policy, cve, migration, enterprise-support
- summary: Foojay’deki analiz, EOL sonrası CVE sessizliğinin güvenliğe değil görünmezliğe işaret edebileceğini savunuyor. Spring’in resmi support policy sayfası da son minor hatlarda OSS pencerenin sınırlı, enterprise desteğin ise daha uzun olduğunu doğruluyor.
- why_it_matters: Teknik ekipler genellikle “scanner temizse risk yok” varsayımına kayıyor; EOL sonrasında bu varsayım zayıf.
- java_spring_relevance: `Spring Boot 3.5` üzerinde kalan ekipler için bu doğrudan bütçe, roadmap ve güvenlik bakımı kararı.
- actionability: roadmap_ve_destek_karari
- impact_level: orta_yüksek
- opportunities: 4.0/4.1 geçişini planlı yapmak, gerekirse enterprise support köprüsü kurmak, bağımlılık envanterini temizlemek.
- risks: OSS destek penceresi sonrasında görünmeyen açıklar, gecikmiş migration ve yalancı güven hissi.
- migration_notes: Spring’in public support policy sayfası kesin bir gün vermiyor; `3.5.0` çıkış tarihi olan `22 Mayıs 2025` ve “minor release minimum 13 ay” kuralı nedeniyle OSS pencerenin `2026 Haziran` sonuna yaklaşacağı çıkarımı yapılabilir. Steve Poole yazısında `30 Haziran 2026` tarihini işaret ediyor; bunu resmi tarih değil, güçlü bir planlama sinyali olarak okumak daha doğru.

## Sonuç

26 Nisan 2026 itibarıyla en güçlü karar sinyali, Spring Boot güvenlik patch hattının bekletilmemesi gerektiğidir. Bunun hemen arkasında, `Boot 4.1` etrafında oluşan yeni release train’in veri, secrets, observability ve messaging katmanlarını aynı anda hizalaması geliyor.

Bugünün uzun vadeli değeri ise iki noktada toplanıyor: Birincisi, JDK tarafında Java 26 performans kazanımları ile JDK 27 uyumluluk riskleri birlikte yönetilmeli. İkincisi, Spring Boot 3.5 için destek ufku artık yalnızca “ileride bakarız” konusu değil; 2026 yazı gelmeden migration veya support stratejisi netleştirilmeli.
