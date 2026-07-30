# Günlük Java / Spring Ekosistem Raporu

Tarih: 30 Temmuz 2026 Perşembe  
Tarama zamanı: 30 Temmuz 2026 09:10 TSİ  
Odak: Haziran sürüm dalgasından sonra görünür hale gelen doğrulama backlog'u; structured logging, transaction-bound events, WebAuthn/JWT decoder, AOT repository semantics, dependency provenance ve JDK 28 correctness yönü

Tarama notu: 30 Temmuz 2026 itibarıyla [Spring Blog](https://spring.io/blog), [Spring releases yüzeyi](https://spring.io/blog/category/releases), [Spring Boot 3.5.16 duyurusu](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now), [Spring Framework 7.0.8 ve 6.2.19 duyurusu](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now), [Spring Security 2026.06 release notu](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06), [Spring Boot logging referansı](https://docs.spring.io/spring-boot/reference/features/logging.html), [Spring Data JPA AOT referansı](https://docs.spring.io/spring-data/jpa/reference/jpa/aot.html), [Spring Framework transaction-bound events referansı](https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html), [Spring Security passkeys referansı](https://docs.spring.io/spring-security/reference/servlet/authentication/passkeys.html), [Spring Security JWT resource server referansı](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html), [Spring Boot issue #51154](https://github.com/spring-projects/spring-boot/issues/51154), [Spring Framework issue #37084](https://github.com/spring-projects/spring-framework/issues/37084), [Spring Security issue #19473](https://github.com/spring-projects/spring-security/issues/19473), [Spring Security issue #19474](https://github.com/spring-projects/spring-security/issues/19474), [Spring Data JPA issue #4304](https://github.com/spring-projects/spring-data-jpa/issues/4304), [This Week in Spring - July 28th, 2026](https://spring.io/blog/2026/07/28/this-week-in-spring-july-28-2026), [VMware Tanzu Spring Delivers SLSA L3 Compliant Java Dependencies](https://blogs.vmware.com/tanzu/vmware-tanzu-spring-delivers-slsa-l3-compliant-java-dependencies-for-spring-boot-2-7-x-3-x-and-4-x/), [OpenJDK JDK 28 sayfası](https://openjdk.org/projects/jdk/28/), [JEP 539](https://openjdk.org/jeps/539), [JEP 401](https://openjdk.org/jeps/401), [Inside Java - Identifying JDK Value Class Candidates](https://inside.java/2026/07/16/identify-jdk-value-classes-candidates/), [InfoQ Java roundup 27 Temmuz 2026](https://www.infoq.com/news/2026/07/java-news-roundup-jul20-2026/), [Baeldung Java Weekly 656](https://www.baeldung.com/java-weekly-656), [Gunnar Morling’in Temmuz yazıları](https://www.morling.dev/blog/) ve [Burak KUTBAY’ın feature flag yazısı](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html/) kontrol edildi. Bugün resmi Spring yüzeyinde yeni bir büyük GA dalgası yok. Buna karşın açık issue akışı, referans dokümanlar ve JDK yönü birlikte okunduğunda, asıl sinyalin "yükseltme tamamlandı" değil "kenar durumlar için doğrulama backlog'u açıldı" olduğu görülüyor.

## Öne Çıkan Başlıklar

- [Spring Boot 4.1.0 structured logging yüzeyi](https://docs.spring.io/spring-boot/reference/features/logging.html), [29 Temmuz 2026 tarihli issue #51154](https://github.com/spring-projects/spring-boot/issues/51154) ile yeni bir regresyon sinyali verdi: tek bir başarısız JSON encode, aynı thread'deki bir sonraki log event'ini de bozuk JSON'a çevirebiliyor.
- [Spring Framework issue #37084](https://github.com/spring-projects/spring-framework/issues/37084), nested `@TransactionalEventListener` ve `REQUIRES_NEW` kombinasyonunda sessiz JDBC connection sızıntısı ihtimalini gündeme taşıdı. Bu, event tabanlı servis içi orkestrasyon kullanan ekipler için yüksek önem taşıyor.
- [Spring Security issue #19473](https://github.com/spring-projects/spring-security/issues/19473) ve [#19474](https://github.com/spring-projects/spring-security/issues/19474), 7.0.x hattında passkey clone detection ve JWKS fetch davranışı için ek üretim testi gerektiğini gösteriyor.
- [Spring Data JPA AOT referansı](https://docs.spring.io/spring-data/jpa/reference/jpa/aot.html) ile [issue #4304](https://github.com/spring-projects/spring-data-jpa/issues/4304) birlikte okunduğunda, `spring.aot.repositories.enabled` kullanımının null semantiği dahil açık contract test gerektirdiği görülüyor.
- [Josh Long’un 28 Temmuz 2026 tarihli haftalık özeti](https://spring.io/blog/2026/07/28/this-week-in-spring-july-28-2026) ve [Tanzu’nun SLSA L3 bağımlılık duyurusu](https://blogs.vmware.com/tanzu/vmware-tanzu-spring-delivers-slsa-l3-compliant-java-dependencies-for-spring-boot-2-7-x-3-x-and-4-x/) supply-chain provenance'i Spring dünyasında artık "ekstra güvenlik lüksü" değil platform özelliği gibi konumluyor.
- [OpenJDK JDK 28 sayfası](https://openjdk.org/projects/jdk/28/) bugün itibarıyla [JEP 401](https://openjdk.org/jeps/401) ve [JEP 539](https://openjdk.org/jeps/539) için 30 Temmuz 2026 review kapanışını gösteriyor. Java platformu immutable/correctness yönüne daha sert dönüyor.

## Kritik Güncellemeler

### 1. Spring Boot 4.1 structured logging, yalnız format meselesi değil artık veri bütünlüğü riski

[Spring Boot logging referansı](https://docs.spring.io/spring-boot/reference/features/logging.html), structured logging'i ECS, GELF ve Logstash formatlarıyla doğrudan desteklenen resmi bir yüzey olarak sunuyor. Ancak [issue #51154](https://github.com/spring-projects/spring-boot/issues/51154), `WritableJson.toByteArray(Charset)` sırasında oluşan bir hatanın thread-local buffer içinde kısmi byte bırakabildiğini ve aynı thread'deki bir sonraki log event'ini bozuk JSON'a çevirdiğini gösteriyor. Issue açıklamasına göre bu bir `4.1.0` regresyonu; `4.0.7` aynı senaryoda etkilenmiyor.

Bu sinyal küçük görünmemeli. Structured log kullanan ekiplerde tek bir bozuk event, sadece o satırı değil, izleyen event'in de parse edilememesine yol açabiliyor. Sonuç olarak SIEM ingest, alerting, correlation ve incident forensics sessizce bozulabiliyor.

### 2. Nested transaction-bound event akışları, 3.5.x/6.2.x tarafında daha dikkatli ele alınmalı

[Spring Framework transaction-bound events dokümantasyonu](https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html), `@TransactionalEventListener` için `BEFORE_COMMIT`, `AFTER_COMMIT`, `AFTER_ROLLBACK` ve `AFTER_COMPLETION` fazlarını resmi model olarak tanımlıyor. Buna rağmen [issue #37084](https://github.com/spring-projects/spring-framework/issues/37084), `AFTER_COMMIT` içinden açılan `REQUIRES_NEW` transaction'ın yeni event yayınlaması ve bunun `BEFORE_COMMIT` listener ile tekrar `REQUIRES_NEW` akışına girmesi durumunda Hikari connection sayısının sessizce yükselip pool exhaustion'a gidebildiğini bildiriyor.

Risk burada iki katmanlı:

- Sorun exception atmadan connection checkout bırakabiliyor.
- Reproducer, [Spring Framework `6.2.19`](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now) üzerinde çalışıyor ve resmi release notu bu sürümü "most probably the last OSS release of the 6.2.x generation" diye tanımlıyor.

Bu, 3.5.x hattında event tabanlı iç orkestrasyon kuran ekiplerin "bir sonraki patch'te çözülür" rahatlığıyla davranmaması gerektiği anlamına geliyor.

### 3. Spring Security 7.0.x sonrası auth edge backlog'u gerçek

[Spring Security passkeys referansı](https://docs.spring.io/spring-security/reference/servlet/authentication/passkeys.html), `spring-security-webauthn` modülünü artık resmi yüzey haline getiriyor. Fakat [issue #19473](https://github.com/spring-projects/spring-security/issues/19473), `7.0.x` hattında persisted `signatureCount` değerinin doğrulamaya geri beslenmediğini, bu yüzden clone detection davranışının fiilen devre dışı kaldığını bildiriyor. Issue, bunun `6.5.x`'te çalıştığını ve `7.0.5`'te bozulduğunu açıkça söylüyor.

Diğer tarafta [issue #19474](https://github.com/spring-projects/spring-security/issues/19474), `Spring Boot 4.0.6` / `Spring Security 7.0.5` yükseltmesi sonrasında AWS ortamında `NimbusJwtDecoder.fetchJwks(...)` yolunda intermittent `Read timed out` gördüğünü raporluyor. Lokal ortamda tekrarlanmaması, bu problemi daha da önemli hale getiriyor; çünkü gerçek risk cold-start, network jitter, NAT, TLS handshake veya upstream IdP davranışı altında ortaya çıkıyor.

[Spring Security 2026.06 release notu](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06), güncel çizgileri `6.5.11`, `7.0.6` ve `7.1.0` olarak gösteriyor. Bu nedenle ekiplerin burada "hangi major'a geçelim?" sorusundan önce "kullandığımız exact patch'te auth contract'larımız gerçekten çalışıyor mu?" sorusuna dönmesi gerekiyor.

### 4. Spring Data AOT repository generation performans kazancı kadar semantik yük de getiriyor

[Spring Data JPA AOT dokümantasyonu](https://docs.spring.io/spring-data/jpa/reference/jpa/aot.html), AOT repositories'i build-time'da query method implementation üreten bir optimizasyon olarak konumluyor ve bu üretilen sınıfların iç detaylarının future release'lerde değişebileceğini açıkça belirtiyor. [Issue #4304](https://github.com/spring-projects/spring-data-jpa/issues/4304) ise `spring.aot.repositories.enabled` açıkken üretilen JPA repository method'unun null parametreyi `IS NULL` semantiğine çevirmeyip düz `setParameter` kullandığını ve davranış farkı yarattığını gösteriyor.

Bu bulgu önemli; çünkü burada problem sadece "native image daha hızlı mı açılıyor?" değil. AOT kod üretimi, sorgu semantiğinin kendisini etkileyebilecek kadar davranışsal bir yüzey haline geliyor.

### 5. Supply-chain provenance, Spring ekosisteminde artık enterprise side-note değil

[Josh Long’un 28 Temmuz haftalık özeti](https://spring.io/blog/2026/07/28/this-week-in-spring-july-28-2026), Tanzu tarafındaki [SLSA Level 3 compliant dependencies duyurusuna](https://blogs.vmware.com/tanzu/vmware-tanzu-spring-delivers-slsa-l3-compliant-java-dependencies-for-spring-boot-2-7-x-3-x-and-4-x/) özellikle işaret ediyor. Tanzu yayını, Spring Boot `2.7.x`, `3.x` ve `4.x` için transitive dependency ağacını kapsayan clean-room build yaklaşımıyla cryptographically verifiable provenance sunduğunu söylüyor.

Bu herkese açık Maven Central gerçeğini bugün değiştirmiyor. Ama büyük kurumsal ekipler için kritik bir yön değişimi var: dependency güveni artık sadece CVE taramasıyla değil, artifact provenance ile de ölçülüyor.

### 6. JDK 28, Java'nın correctness hattını daha görünür hale getiriyor

[OpenJDK JDK 28 sayfası](https://openjdk.org/projects/jdk/28/) 30 Temmuz 2026 review kapanışıyla [JEP 539 - Strict Field Initialization in the JVM](https://openjdk.org/jeps/539) ve [JEP 401 - Value Objects](https://openjdk.org/jeps/401) için hedefleme sürecini gösteriyor. [InfoQ’nun 27 Temmuz 2026 roundup’ı](https://www.infoq.com/news/2026/07/java-news-roundup-jul20-2026/) bu iki JEP'i haftanın ana JVM sinyali olarak öne çıkarıyor. [Inside Java - Identifying JDK Value Class Candidates](https://inside.java/2026/07/16/identify-jdk-value-classes-candidates/) ise JDK'nin preview açıkken bile "starter kit" değer sınıflarıyla geçişi kolaylaştırmaya çalıştığını açıklıyor.

Bugün Spring geliştiricisinin kodunu yarın value object'e taşıması gerekmiyor. Ama proxy, reflection, ORM identity, serialization ve mutable DTO varsayımlarını uzun vadede etkileyecek bir yön belli olmuş durumda.

## Trendler ve Sinyaller

### Trend Kümesi 1: Haziran release dalgasının asıl maliyeti, Temmuz sonundaki kenar davranışlarda çıkıyor

Tekrarlayan sinyal şu:

- Structured logging üretim verisini bozabiliyor.
- Nested transactional event akışları connection lifecycle'ı zorlayabiliyor.
- WebAuthn ve remote JWKS fetch davranışı patch-level test gerektiriyor.
- AOT repository generation, query semantiğini etkileyebiliyor.

Bu tablo, 4.1/7.0/2026.0 geçişlerini "sürüm yükseldi, iş bitti" şeklinde değil "doğrulama backlog'u açıldı" şeklinde yönetmek gerektiğini gösteriyor.

### Trend Kümesi 2: Build-time ve runtime doğruluğu birbirine yaklaşıyor

AOT repository generation, structured logging byte-path'i ve JEP 539/401 birlikte okunduğunda platformun yönü net:

- daha fazla iş build-time'a kayıyor
- daha az örtük davranış kabul ediliyor
- immutable/correctness semantiği daha erken doğrulanmak isteniyor

Bu, Spring ekipleri için test stratejisinin yalnız integration test değil generated code ve negative-path test'lerini de kapsaması gerektiği anlamına geliyor.

### Trend Kümesi 3: Dependency güveni, artifact provenance seviyesine çıkıyor

SLSA L3 uyumlu bağımlılık zinciri duyurusu topluluk kullanıcısı için hemen tüketilebilir olmayabilir. Buna rağmen yön kalıcı: "aynı GAV ama kaynağı ve provenance'i belirsiz artifact" yaklaşımı enterprise Java tarafında giderek daha az kabul görecek.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: structured logging, transaction-bound events ve auth edge-case doğrulaması
- Kalıcı değer: AOT repository davranışını performans konusu değil semantik konu olarak görmek
- Kalıcı değer: dependency provenance'in platform satın alma/standardizasyon kriterine dönüşmesi
- İzlenmeli ama bugün erken: JEP 401 ve JEP 539'un framework yansımaları
- Düşük öncelik: bugün yeni bir "hemen ekle" sınıfında evrensel OSS kütüphane sinyali yok

## Araçlar ve Kütüphaneler

- `StructuredLogEncoder` / `StructuredLogLayout`: güçlü ama 4.1.0 için ek negatif test gerektiriyor. JSON üretim başarısızlıklarını, MDC çakışmalarını ve custom member davranışlarını otomatik test etmeyen ekipler için erken rahatlık riski var.
- `spring-security-webauthn`: passkey yatırımını sadeleştiriyor; ancak `7.0.x` doğrulama hattı özel testler olmadan güven varsayımı üretmemeli.
- `NimbusJwtDecoder`: resmi ve yaygın yol olmasına rağmen remote JWK set erişimi ağ/topoloji farklarına duyarlı. Resource server ekipleri timeout ve cache davranışını prod benzeri ortamda ölçmeli.
- Spring Data AOT repositories: startup ve reflection maliyeti açısından değerli; ama query semantiği için regression suite gerektiriyor. Gerektiğinde `spring.aot.repositories.enabled=false` veya modül seviyesinde `spring.aot.jpa.repositories.enabled=false` ile geri çekilebilecek bir optimizasyon olarak ele alınmalı.
- `Spring Enterprise Repository` ve SLSA L3 artifacts: ticari/kurumsal bağlama bağlı bir sinyal. Topluluk-only ekip için anında dependency değişikliği değil; regulated veya yüksek compliance baskısı olan ekip için değerlendirme konusu.

Bugün için yeni bir "her Spring ekibi yarın bunu eklesin" sınıfında OSS araç çıkmıyor. Ana değer, mevcut stack'in daha dikkatli işletilmesinde.

## Java / Spring Geliştiricileri İçin Etkiler

- Boot 4.1 structured logging kullanıyorsanız, log pipeline'ı yalnız happy-path ile doğrulanmış saymayın. Fail eden bir encode'in sonraki event'i bozup bozmadığını test edin.
- `@TransactionalEventListener` ile transaction içinde tekrar event üreten servisleriniz varsa, Hikari active/idle metriklerini sadece load test'te değil listener topolojisi bazında da izleyin.
- Passkey ve OAuth2 resource server kullanan ekipler, auth testlerini "token doğrulandı mı?" seviyesinden çıkarıp clone detection, JWKS refresh, timeout ve cold-start davranışına taşımalı.
- AOT optimizasyonu açıldığında, repository null semantiği dahil davranış farklarını contract test ile doğrulamak zorunlu hale geliyor.
- Kurumsal platform ekipleri, dependency provenance'i CVE sayısından ayrı bir kabul kriteri olarak backlog'a almalı.

## Fırsatlar ve Riskler

- Fırsat: Structured logging ve AOT gibi yeni yüzeyleri üretime almadan önce negative-path regression suite yazarak ilerideki incident maliyetini düşürmek.
- Risk: "Framework resmi destekliyor" varsayımıyla kenar davranışları test etmeden 4.1/7.0 rollout yapmak.
- Fırsat: Transaction-bound event akışlarını daha sade, daha ölçülebilir ve connection lifecycle açısından daha görünür hale getirmek.
- Risk: Sessiz connection leak veya parse edilemeyen log satırları gibi gözden kaçan bozulmaların ancak yük altında fark edilmesi.
- Fırsat: Feature flag ve controlled rollout ile yeni logging/auth/AOT davranışlarını dar blast radius içinde doğrulamak.
- Risk: AOT optimizasyonunu semantik olarak eşdeğer sanıp null, SpEL, derived query veya named query davranışlarını test etmemek.
- Fırsat: SLSA/provenance yaklaşımını iç artifact repository standartlarına çevirmek.
- Risk: Compliance veya supply-chain gereksinimleri gelmeden provenance konusunu "enterprise marketing" diye küçümsemek.

## İzlenmesi Gereken Konular

- [Spring Boot issue #51154](https://github.com/spring-projects/spring-boot/issues/51154) için 4.1.x fix veya workaround önerisi
- [Spring Framework issue #37084](https://github.com/spring-projects/spring-framework/issues/37084) için triage sonucu ve 7.0.x üzerinde benzer davranışın doğrulanıp doğrulanmayacağı
- [Spring Security issue #19473](https://github.com/spring-projects/spring-security/issues/19473) ve [#19474](https://github.com/spring-projects/spring-security/issues/19474) için 7.0.6/7.1.x düzeltme veya doğrulama notları
- [Spring Data JPA issue #4304](https://github.com/spring-projects/spring-data-jpa/issues/4304) için generated repository null semantiğinin nasıl ele alınacağı
- [OpenJDK JDK 28](https://openjdk.org/projects/jdk/28/) altında JEP 401 ve 539 review sonuçlarının 30 Temmuz 2026 sonrası nasıl netleşeceği
- SLSA/provenance yaklaşımının açık Spring tüketim zincirine ne kadar yansıyacağı

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Boot 4.1 structured logging regresyonu, başarısız event'ten sonraki log satırını da bozabiliyor
- `source`: [Spring Boot logging referansı](https://docs.spring.io/spring-boot/reference/features/logging.html) | [Issue #51154](https://github.com/spring-projects/spring-boot/issues/51154)
- `author`: Spring Boot Team | edwardsre
- `date`: 29 Temmuz 2026 issue; 30 Temmuz 2026'da doğrulandı
- `category`: observability, logging, runtime-correctness
- `tags`: spring-boot, structured-logging, ecs, logstash, gelf, json, regression
- `summary`: Boot'un resmi structured logging yüzeyi, `4.1.0`'da bir encode hatası sonrası aynı thread'deki sonraki event'i de bozuk JSON üretebilen regresyon sinyali veriyor. Issue, `4.0.7`'nin aynı senaryoda etkilenmediğini söylüyor.
- `why_it_matters`: Parse edilemeyen log satırı sadece telemetry kalitesini değil incident response ve güvenlik görünürlüğünü de bozar.
- `java_spring_relevance`: Spring Boot 4.1 structured logging kullanan tüm ekipler için doğrudan üretim etkisi var.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: Log pipeline için negatif testler yazmak; custom structured log üyelerini daha kontrollü eklemek
- `risks`: JSON ingest kırılması; bir event yüzünden sonraki event'in de kaybolması; sessiz observability bozulması
- `migration_notes`: 4.1.0 rollout'unda MDC/key-value çakışması ve hata fırlatan custom JSON member senaryolarını test edin; structured logging mission-critical ise fix netleşmeden geniş rollout yapmayın.

### Bulgu 2

- `title`: Nested `@TransactionalEventListener` + `REQUIRES_NEW`, connection lifecycle açısından sessiz risk üretiyor
- `source`: [Transaction-bound events referansı](https://docs.spring.io/spring-framework/reference/data-access/transaction/event.html) | [Issue #37084](https://github.com/spring-projects/spring-framework/issues/37084) | [Spring Framework 7.0.8 ve 6.2.19 duyurusu](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now)
- `author`: Spring Framework Team | aytacdereli
- `date`: 22 Temmuz 2026 issue; 30 Temmuz 2026'da doğrulandı
- `category`: transactions, eventing, data-access
- `tags`: spring-framework, transactional-event-listener, requires-new, hikari, jpa, connection-pool
- `summary`: `AFTER_COMMIT` listener içinden `REQUIRES_NEW` akışına giren ve tekrar event yayınlayan senaryoda JDBC connection'ların geri dönmeyebildiği bir reproducer paylaşıldı. Reproducer `Spring Framework 6.2.19` / `Boot 3.5.14` üzerinde pool exhaustion'a gidebiliyor.
- `why_it_matters`: Sessiz connection sızıntısı çoğu zaman sadece yük altında ve geç fark edilir; event tabanlı servis içi orkestrasyonda ciddi üretim riski yaratır.
- `java_spring_relevance`: Domain event, outbox benzeri iç akışlar veya transactional listener zincirleri kullanan Spring ekipleri için doğrudan önemli.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: Event akışlarını sadeleştirmek; connection lifecycle görünürlüğünü artırmak; listener topolojisini yeniden değerlendirmek
- `risks`: Hikari pool exhaustion; exception atmayan sessiz kaynak tüketimi; OSS patch penceresinin daralması
- `migration_notes`: Nested transactional listener akışları için load ve soak test ekleyin; Hikari active connection metriğini senaryo bazında izleyin; 6.2.x'in OSS sonuna yaklaştığını varsayarak workaround/backpressure planı hazırlayın.

### Bulgu 3

- `title`: Spring Security 7.0.x sonrası auth edge-case backlog'u büyüyor: passkeys clone detection ve JWKS fetch davranışı
- `source`: [Passkeys referansı](https://docs.spring.io/spring-security/reference/servlet/authentication/passkeys.html) | [JWT resource server referansı](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html) | [Issue #19473](https://github.com/spring-projects/spring-security/issues/19473) | [Issue #19474](https://github.com/spring-projects/spring-security/issues/19474) | [Spring Security 2026.06 release notu](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06)
- `author`: Spring Security Team | gavinrwalters | napa-email
- `date`: 27-28 Temmuz 2026 issue'ları; 30 Temmuz 2026'da doğrulandı
- `category`: security, authentication, oauth2
- `tags`: spring-security, webauthn, passkeys, nimbusjwtdecoder, jwks, aws, okta, regression
- `summary`: `spring-security-webauthn` 7.0.x hattında signature counter clone detection için doğrulamaya geri beslenmiyor; ayrı bir issue ise `NimbusJwtDecoder.fetchJwks(...)` yolunda AWS/Okta ortamında upgrade sonrası intermittent timeout gösteriyor.
- `why_it_matters`: Auth katmanındaki bozulmalar çoğu zaman üretimde, düşük tekrar oranıyla ve yüksek etkili şekilde ortaya çıkar.
- `java_spring_relevance`: Passkey veya OAuth2 resource server kullanan Spring ekipleri için doğrudan operational risk.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: Daha güçlü auth synthetic testleri; sign-counter ve remote JWK davranışı için prod-benzeri test ortamları
- `risks`: Clone detection'ın fiilen çalışmaması; geçici gibi görünen ama erişim kesintisine dönüşebilen token doğrulama problemleri
- `migration_notes`: Exact patch seviyenizde 7.0.6/7.1.x retesti yapın; sign counter doğrulamasını ve JWK fetch davranışını network jitter/cold-start senaryolarında ölçün; auth regression testlerini yalnız happy-path ile sınırlamayın.

### Bulgu 4

- `title`: Spring Data JPA AOT repository generation, null semantiği için ayrıca doğrulanmalı
- `source`: [Spring Data JPA AOT referansı](https://docs.spring.io/spring-data/jpa/reference/jpa/aot.html) | [Issue #4304](https://github.com/spring-projects/spring-data-jpa/issues/4304)
- `author`: Spring Data Team | LoganWlv
- `date`: 28 Temmuz 2026 issue; 30 Temmuz 2026'da doğrulandı
- `category`: aot, data-access, performance
- `tags`: spring-data-jpa, aot, generated-repositories, null-semantics, query-generation
- `summary`: AOT-generated repository implementation'ın null parametreyi `IS NULL` davranışına çevirmediği ve farklı query semantiği oluşturduğu bir örnek paylaşıldı. Dokümanlar üretilen AOT repository sınıflarının internal optimization olduğunu vurguluyor.
- `why_it_matters`: Build-time optimizasyonlar sadece performansı değil iş kuralını da etkileyebiliyorsa, bunlar artık "transparent" optimizasyon sayılmaz.
- `java_spring_relevance`: Startup maliyeti için AOT kullanan Spring Data JPA ekipleri doğrudan etkilenebilir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: AOT kullanımını açık contract test ile güvenceye almak; modül bazlı aç/kapa stratejisi kurmak
- `risks`: Null semantiği veya query davranışında sessiz üretim farkları; AOT'yi güvenli varsaymak
- `migration_notes`: Null parametreli repository method'ları için ayrı testler ekleyin; gerekiyorsa `spring.aot.jpa.repositories.enabled=false` ile JPA modülünü geri çekin; generated repository'leri public contract gibi kullanmayın.

### Bulgu 5

- `title`: Spring dependency zincirinde SLSA L3 provenance, enterprise karar kriterine dönüşüyor
- `source`: [This Week in Spring - 28 Temmuz 2026](https://spring.io/blog/2026/07/28/this-week-in-spring-july-28-2026) | [VMware Tanzu SLSA L3 bağımlılık duyurusu](https://blogs.vmware.com/tanzu/vmware-tanzu-spring-delivers-slsa-l3-compliant-java-dependencies-for-spring-boot-2-7-x-3-x-and-4-x/)
- `author`: Josh Long | Purnima Padmanabhan
- `date`: 24-28 Temmuz 2026; 30 Temmuz 2026'da doğrulandı
- `category`: supply-chain, security, enterprise-platform
- `tags`: spring-boot, slsa, provenance, enterprise-repository, dependency-management, clean-room-builds
- `summary`: Tanzu tarafı, Spring Boot `2.7.x`, `3.x` ve `4.x` için transitive dependency zinciri üzerinde SLSA Level 3 provenance ve clean-room build yaklaşımı sunduğunu duyurdu; Josh Long bunu aynı hafta öne çıkardı.
- `why_it_matters`: Java bağımlılık güvenliği, CVE listesi kadar artifact provenance ve build lineage tartışmasına da taşınıyor.
- `java_spring_relevance`: Regulated, yüksek compliance veya büyük tedarik zinciri baskısı olan Spring ekipleri için stratejik önem taşıyor.
- `actionability`: `izle_ve_pilotla`
- `impact_level`: `orta-yüksek`
- `opportunities`: İç artifact repository standardını provenance odaklı kurmak; dependency kabul kriterlerini sertleştirmek
- `risks`: Konuyu sadece ticari pazarlama olarak okuyup kurumsal gereksinim gelince hazırlıksız kalmak
- `migration_notes`: Topluluk-only ekip için hemen dependency değişimi gerektirmez; enterprise ekipler ise mevcut Artifactory/Nexus akışlarını provenance beklentisiyle yeniden değerlendirmeli.

### Bulgu 6

- `title`: JDK 28, strict field initialization ve value objects ile Java correctness modelini sertleştiriyor
- `source`: [OpenJDK JDK 28 sayfası](https://openjdk.org/projects/jdk/28/) | [JEP 539](https://openjdk.org/jeps/539) | [JEP 401](https://openjdk.org/jeps/401) | [Inside Java - Identifying JDK Value Class Candidates](https://inside.java/2026/07/16/identify-jdk-value-classes-candidates/) | [InfoQ roundup 27 Temmuz 2026](https://www.infoq.com/news/2026/07/java-news-roundup-jul20-2026/)
- `author`: OpenJDK authors | Dan Smith | Michael Redlich
- `date`: 16-30 Temmuz 2026 sinyalleri
- `category`: jdk, language, correctness
- `tags`: jdk28, jep539, jep401, value-objects, strict-initialization, valhalla
- `summary`: JDK 28 hedef listesinde review kapanışı 30 Temmuz 2026 olan JEP 401 ve 539, Java'nın immutable/correctness semantiğini daha görünür hale getiriyor; Inside Java da geçiş için aday JDK değer sınıflarını anlatıyor.
- `why_it_matters`: Framework'ler, bytecode araçları ve serialization/ORM katmanı uzun vadede identity ve default-value varsayımlarını gözden geçirmek zorunda kalabilir.
- `java_spring_relevance`: Bugün doğrudan migration üretmiyor; ama Spring çevresindeki proxy, reflection ve DTO tasarımlarını orta vadede etkileyecek bir yön değişimi.
- `actionability`: `izle_ve_pilotla`
- `impact_level`: `orta`
- `opportunities`: Immutable domain model denemeleri; language/platform kabiliyetleriyle daha az savunma kodu yazmak
- `risks`: Preview heyecanıyla erken framework varsayımı kurmak; identity/serialization davranışlarını hafife almak
- `migration_notes`: Şimdilik üretim migrasyonu değil izleme ve laboratuvar pilotu konusu; proxy/ORM/serialization yoğun ekipler preview ilerledikçe uyumluluk testleri planlamalı.

## Sonuç

Bugünün ana kararı, Spring/Java tarafında şu an en yüksek değerin yeni bir framework özelliği kovalamakta değil, yakın zamanda gelen özelliklerin ve patch'lerin kenar davranışlarını disiplinli biçimde doğrulamakta olduğudur. Structured logging, transactional event zincirleri, passkey/JWKS auth yolları ve AOT repositories aynı şeyi söylüyor: yükseltme backlog'u artık daha çok correctness backlog'u.

Enterprise tarafta ise ikinci güçlü sinyal provenance. Dependency'nin yalnız sürümü değil, nasıl ve nerede üretildiği de karar kriterine dönüyor. JVM tarafında JDK 28 ile gelen strict initialization ve value objects yönü de bu tabloyu tamamlıyor: Java platformu daha az örtük, daha çok doğrulanabilir davranış istiyor. Spring ekiplerinin buna cevabı daha fazla negative-path test, daha görünür rollout ve exact patch seviyesinde daha sıkı doğrulama olmalı.
