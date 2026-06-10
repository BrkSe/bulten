# Günlük Java / Spring Ekosistem Raporu

Tarih: 10 Haziran 2026  
Tarama zamanı: 10 Haziran 2026 09:05 TSİ  
Odak: Spring Security ve Spring Data çevresindeki yeni 9 Haziran güvenlik dalgası, messaging katmanında Spring AMQP sertleşmesi ve JVM tarafında JDK 26'nın sessiz ama kalıcı performans sinyalleri

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring Security Advisories](https://spring.io/security/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/), [Josh Long'un 9 Haziran 2026 tarihli haftalık özeti](https://spring.io/blog/2026/06/09/this-week-in-spring-june-9-2026/), [InfoQ Java](https://www.infoq.com/java/), [Gunnar Morling'in blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY'ın blogu](https://blog.burakkutbay.com/) tarandı. Topluluk tarafında faydalı içerikler vardı; ancak 10 Haziran 2026 sabahı itibarıyla karar etkisi en yüksek sinyal açık biçimde resmi Spring release/advisory akışında ve resmi Java kanallarında toplandı.

## Öne Çıkan Başlıklar

- [Spring Security `6.5.11`, `7.0.6`, `7.1.0`](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06/) aynı anda yayımlandı; SAML, post-login redirect, X.509 CN ayrıştırma ve HTML form üretimi yüzeylerinde kritik güvenlik kapanışları geldi. En önemli yan sinyal, `5.7.x`, `5.8.x`, `6.3.x` ve `6.4.x` açık kaynak destek hatlarının bitmiş olması.
- [Spring Authorization Server `1.5.8`](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06/) ayrı bir upgrade gerektiriyor; `request_uri` doğrulama eksiği nedeniyle open redirect riski var. Security tarafını güncellemek tek başına bunu kapatmıyor.
- [Spring Data `2025.1.6` ve `2025.0.12`](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released/) servis sürümleri 12 CVE ile geldi. Özellikle Spring Data REST, MongoDB `@Query`, `Sort`, `Querydsl` ve property-path çözümleme yüzeyleri artık doğrudan HTTP saldırı yüzeyi olarak ele alınmalı.
- [Spring Data `2026.0.0` GA](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available/) yeni özellik tarafında güçlü: type-safe property paths, annotation-driven Redis Pub/Sub, MongoDB çoklu koleksiyon bulk write ve JDBC/R2DBC tek statement upsert.
- [Spring AMQP `4.1.0`](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/) yalnız yeni özellik değil; fixed reply queue reply poisoning ve `amqps://` SSL güven doğrulama boşluğu için de düzeltme içeriyor. Ayrıca JSON converter'lar artık varsayılan olarak "trust no one".
- [Inside Java'nın JDK 26 performans özeti](https://inside.java/2026/06/09/jdk-26-performance-improvements/) yeni bir ürün duyurusu değil ama güçlü bir platform sinyali: daha küçük default initial heap, `LazyConstant`, daha agresif C2 erişimi ve sanal thread bekleme davranışı üretim maliyetini kod değiştirmeden düşürebilir.

## Kritik Güncellemeler

### 1. Spring Security tarafında problem tek bir CVE değil, kimlik doğrulama sınırlarının farklı katmanlarda aynı gün delinmesi

[Spring Security 2026.06 release duyurusu](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06/) şu riskleri aynı paket içinde kapatıyor:

- [CVE-2026-40988](https://spring.io/security/cve-2026-40988/): SAML 2.0 REDIRECT binding altında sınırsız DEFLATE inflation ile DoS
- [CVE-2026-40993](https://spring.io/security/cve-2026-40993/): `JdbcAssertingPartyMetadataRepository` içinde SAML credential BLOB deserialization yüzeyi
- [CVE-2026-41003](https://spring.io/security/cve-2026-41003/): `RelyingPartyRegistration` etkilenebiliyorsa HTML form üretiminde XSS
- [CVE-2026-41694](https://spring.io/security/cve-2026-41694/): imzasız SAML payload'ları decryption oracle gibi kullanılabiliyor
- [CVE-2026-41706](https://spring.io/security/cve-2026-41706/): `CookieRequestCache` / `CookieServerRequestCache` ile post-login open redirect
- [CVE-2026-47838](https://spring.io/security/cve-2026-47838/): hatalı `CN` ayrıştırmasıyla X.509 pre-auth impersonation

Bu neden kritik:

- Bugün odak "framework genel güvenliği" değil; SSO, SAML, pre-auth ve redirect sonrası kullanıcı akışlarının saldırı yüzeyi.
- Özellikle SAML kullanan kurumlarda blast radius yalnız uygulama değil, IdP/SP entegrasyon akışı.
- Release duyurusu ayrıca `5.7.x`, `5.8.x`, `6.3.x` ve `6.4.x` açık kaynak destek hatlarının bittiğini söylüyor. Yani bazı ekipler için mesele yalnız patch değil, destekli hatta dönme kararı.

Pratik yorum:

- SAML SP kullanıyorsanız bu release kümesi bugünün en yüksek öncelikli upgrade'i.
- `CookieRequestCache` veya `CookieServerRequestCache` kullanıyorsanız custom login success redirect davranışınızı yeniden test edin.
- X.509 pre-auth kullanan ekipler `SubjectDnX509PrincipalExtractor` yerine `SubjectX500PrincipalExtractor` geçişini ertelememeli.

### 2. Spring Authorization Server, Spring Security'den ayrı düşünülmeli

[CVE-2026-41008](https://spring.io/security/cve-2026-41008/) authorization endpoint tarafında `request_uri` parametresinin yetersiz doğrulanması nedeniyle open redirect oluşturabiliyor. Etkilenen hatlar:

- Spring Security `7.0.0 - 7.0.5`
- Spring Authorization Server `1.5.0 - 1.5.7`

[Spring Authorization Server `1.5.8`](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06/) bu düzeltmeyi getiriyor.

Bu neden kritik:

- OAuth/OIDC authorization server kullanan ekipler için risk uygulama içindeki "yardımcı redirect" değil, kimlik federasyonu akışının merkezinde.
- Security çekirdeğini patch'lemek ile auth server bağımlılığını patch'lemek aynı şey değil.

Net yorum:

- Kurum içi login broker veya merkezi authorization server kullanan ekipler bağımlılık ağacında `spring-security-oauth2-authorization-server` sürümünü ayrıca doğrulamalı.

### 3. Spring Data tarafında asıl haber GA release değil, request-driven query yüzeylerinin topluca sertleşmesi

[Spring Data `2025.1.6` ve `2025.0.12`](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released/) aşağıdaki sınıflarda toplu CVE kapanışı getiriyor:

- property path çözümleme ve `Sort` parsing DoS: [CVE-2026-41695](https://spring.io/security/cve-2026-41695/), [CVE-2026-41711](https://spring.io/security/cve-2026-41711/)
- MongoDB `@Query` / placeholder / regex kaynaklı veri kaçağı veya SpEL injection: [CVE-2026-41696](https://spring.io/security/cve-2026-41696/), [CVE-2026-41717](https://spring.io/security/cve-2026-41717/)
- Spring Data REST JSON Patch ve Querydsl yüzeyi: [CVE-2026-41728](https://spring.io/security/cve-2026-41728/), [CVE-2026-41729](https://spring.io/security/cve-2026-41729/), [CVE-2026-41730](https://spring.io/security/cve-2026-41730/), [CVE-2026-41837](https://spring.io/security/cve-2026-41837/)

Öne çıkan pratik desen:

- `Spring Data Commons` doğrudan HTTP açığı çıkarmıyor; açık, property path veya sort parametresini dış girdiden alıp bunu repository altyapısına taşıyan uygulama kodunda açılıyor.
- `spring-data-rest` varsa risk alanı belirgin biçimde büyüyor.
- `@Query("?0")`, `@Query(":#{?0}")` veya regex parameter binding kullanan MongoDB repository metodları doğrudan envantere alınmalı.

En önemli release yönetimi notu:

- Spring Data ekibi bu servis sürümlerinin gelecek Spring Boot sürümlerine "önümüzdeki hafta" alınacağını söylüyor.
- Yani bugün exposed repository uçları olan ekiplerde "Boot patch gelince alırız" yaklaşımı bir haftalık açık pencere bırakıyor.

### 4. Spring AMQP artık yalnız messaging kolaylığı değil, güvenlik ve güven sınırı kararı

[Spring AMQP `4.1.0`](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/) ile gelen iki önemli güvenlik kapanışı:

- [CVE-2026-41701](https://spring.io/security/cve-2026-41701/): fixed reply queue kullanan `RabbitTemplate.sendAndReceive()` akışlarında tahmin edilebilir correlation ID ile reply poisoning
- [CVE-2026-41714](https://spring.io/security/cve-2026-41714/): `RabbitConnectionFactoryBean.setUri("amqps://...")` kullanılıp `setUseSSL(true)` çağrılmıyorsa TLS var ama certificate/hostname doğrulaması yok

Yeni sürümün ürün tarafı da önemli:

- dedicated `spring-amqp-client` modülü ile generic AMQP 1.0 / ProtonJ 2 desteği
- RabbitMQ `4.3` uyumluluğu
- `SimpleMessageListenerContainer` için immediate scale-down
- JSON converter'ların varsayılan olarak "trust no one" moduna geçmesi

Bu neden kritik:

- Messaging katmanı çoğu ekipte network güven sınırının "içeride" kaldığı varsayımıyla çalışır. Bugünkü advisory'ler bunun zayıf varsayım olduğunu gösteriyor.
- Yeni default JSON trust davranışı güvenlik açısından olumlu; fakat eski "her pakete güven" varsayımı olan tüketiciler için davranış değişimi testi gerekir.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring güvenlik raporları artık core web stack'ten repository ve auth edge'lere kayıyor

Tekrarlayan desen:

- auth redirect
- SAML payload işleme
- X.509 extractor
- JSON Patch
- Querydsl filter parametreleri
- property path ve sort çözümleme

Çıkarım: Saldırı yüzeyi giderek daha fazla "framework feature convenience" noktalarında açılıyor. Güvenlik incelemesi yalnız controller ve filter katmanında kalmamalı.

### Trend Kümesi 2: Release-train veya Boot BOM yeterli ama anlık değil

- Spring Data servis sürümleri Boot'a ancak gelecek hafta alınacak.
- Spring Authorization Server ayrı bir upgrade gerektiriyor.
- Spring Security tarafında bazı OSS hatlar kapandı; backport beklentisi gerçekçi değil.

Çıkarım: Kritik haftalarda kurumsal ekipler yalnız BOM senkronunu bekleyerek hareket etmemeli; seçili override stratejisi hazır olmalı.

### Trend Kümesi 3: JVM performansında "özellik eklemeden kazanç" dönemi sürüyor

[JDK 26 performans yazısı](https://inside.java/2026/06/09/jdk-26-performance-improvements/) dört kalıcı sinyal veriyor:

- `LazyConstant` ile geç başlatma kalıbını daha güvenli ve optimize edilebilir hale getirme
- explicit `-Xms` vermeyen uygulamalarda daha küçük başlangıç heap'i ile daha hızlı startup
- çok parametreli metodlarda daha geniş C2 derleme kapsamı
- sınıf başlatma bekleyen virtual thread'lerin carrier thread'i daha az bloke etmesi

Çıkarım: JDK upgrade yalnız yeni dil özelliği değil; özellikle servis başlangıç süresi, sanal thread yoğunluğu ve CPU verimi üzerinde doğrudan maliyet etkisi taşıyor.

### Hype mı, kalıcı mı?

- Kalıcı mühendislik değeri çok yüksek: Spring Security/Auth Server patch set'i, Spring Data servis sürümleri, Spring AMQP güvenlik kapanışları
- Yüksek ama hedefli değer: JDK 26 performans pilotu
- Düşük öncelik / izlemelik: [Spring AI `2.0.0-RC2`](https://spring.io/blog/2026/06/09/spring-ai-2-0-0-RC2-available-now/), [Oracle Jipher `10.36`](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java)

## Araçlar ve Kütüphaneler

- [Spring Security `6.5.11`, `7.0.6`, `7.1.0`](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06/): güvenlik odaklı günün en kritik release kümesi.
- [Spring Authorization Server `1.5.8`](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06/): authorization endpoint redirect doğrulama fix'i.
- [Spring Data `2025.1.6` / `2025.0.12`](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released/): mevcut üretim hatları için güvenlik bakım sürümleri.
- [Spring Data `2026.0.0` GA](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available/): type-safe property paths, Redis Pub/Sub listener'lar, multi-collection bulk write, JDBC/R2DBC upsert.
- [Spring AMQP `4.1.0`](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/), [`4.0.4`](https://spring.io/security/cve-2026-41701/), [`3.2.11`](https://spring.io/security/cve-2026-41701/): messaging ve broker TLS güvenliği için bakım şart.
- [Spring REST Docs `3.0.6`](https://spring.io/blog/2026/06/09/spring-restdocs-3/): uzaktaki API'leri dokümante eden testlerde XXE kapanışı içeriyor.
- [Spring AI `2.0.0-RC2`](https://spring.io/blog/2026/06/09/spring-ai-2-0-0-RC2-available-now/): OpenAI/Anthropic HTTP client konfigürasyonu, tool-calling auto-registration ve RC1 sonrası stabilizasyon. Düşük öncelikli ama RC kullanıcıları için anlamlı.
- [Oracle Jipher `10.36`](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java): FIPS 140-3 ortamlarında DSA, TLS 1.2 EMS, Triple DES ve PBKDF2 davranış değişimleri içeriyor. Regüle olmayan ekipler için düşük öncelik.

## Java / Spring Geliştiricileri İçin Etkiler

- SAML SP veya federated login akışınız varsa Spring Security patch'leri "bakım" değil, prod güvenlik olayı seviyesinde ele alınmalı.
- `spring-security-oauth2-authorization-server` kullanan ekipler bağımlılık yönetiminde ayrı override yapmaya hazır olmalı.
- Spring Data REST veya dış dünyaya açılmış repository abstractions varsa query, sort, patch ve filter parametreleri artık threat model içinde birinci sınıf girdiler.
- MongoDB tarafında `@Query` ile esnek placeholder kullanımı refactoring kolaylığı değil, saldırı vektörü de olabilir. Özellikle `?0` ve `:#{?0}` türü capture-all kalıplar gözden geçirilmeli.
- RabbitMQ istemci konfigürasyonunu `amqps://` URI ile bitmiş sayan ekipler TLS doğrulamasını yanlış güvenli varsaymış olabilir.
- JDK 26'ya geçiş düşünmeyen ekipler bile bu performans değişikliklerini not etmeli; sonraki LTS veya ara feature release geçişinde ciddi startup / throughput kazanımı potansiyeli var.

## Fırsatlar ve Riskler

- Fırsat: Spring Data `2026.0.0` ile stringly-typed query/property kullanımını azaltıp refactoring güvenliğini artırmak
- Fırsat: Spring AMQP `4.1.0` ile AMQP 1.0, RabbitMQ `4.3` ve daha güvenli JSON converter default'larına aynı geçişte ulaşmak
- Fırsat: JDK 26 performans kazanımlarını staging'de benchmark edip JDK upgrade işini performans gerekçesiyle de savunmak
- Risk: Spring Security patch'ini alıp Authorization Server sürümünü atlamak
- Risk: Spring Data servis sürümleri Boot BOM'a henüz inmediği için bekleyerek açık bırakmak
- Risk: Data REST ve Querydsl tabanlı dışa açık filtrelemeyi "yalnız veri erişim kolaylığı" gibi görmek
- Risk: `RabbitConnectionFactoryBean.setUri("amqps://...")` kullanımını sertifikalı güvenli bağlantı sanmak
- Risk: Spring AI RC2'yi production-ready gibi yorumlamak; bugün için daha doğru okuma "hızlı stabilize olan RC hattı"

## İzlenmesi Gereken Konular

- Spring Boot'un gelecek hafta yayımlanacak sürümlerinin Spring Data `2025.1.6` / `2025.0.12` ve ilgili güvenlik fix seviyelerini ne zaman varsayılan hale getireceği
- Spring Security `7.1.x` hattında bugünkü security closure sonrası ek hardening veya follow-up advisory gelip gelmeyeceği
- Spring Authorization Server `1.5.8` sonrası `request_uri` validation davranışı etrafında topluluk bug raporları oluşup oluşmayacağı
- Spring AMQP `4.1.x` hattında "trust no one" JSON converter default'unun göç maliyeti
- JDK 26 performans yazısında öne çıkan optimizasyonların JDK 27'de daha da genişleyip genişlemeyeceği
- FIPS regülasyonlu ekipler için Oracle Jipher `10.36` sonrası DSA, Triple DES ve PBKDF2 parametre kısıtlarının operasyonel kırılım üretip üretmeyeceği

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Security 2026.06 release kümesi, SAML ve redirect akışlarını doğrudan hedef alan çok katmanlı bir güvenlik kapanışı getirdi
- source: [Spring Security 2026.06 Releases](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06/), [CVE-2026-40988](https://spring.io/security/cve-2026-40988/), [CVE-2026-40993](https://spring.io/security/cve-2026-40993/), [CVE-2026-41003](https://spring.io/security/cve-2026-41003/), [CVE-2026-41694](https://spring.io/security/cve-2026-41694/), [CVE-2026-41706](https://spring.io/security/cve-2026-41706/), [CVE-2026-47838](https://spring.io/security/cve-2026-47838/)
- author: Josh Cummings; Spring Security Advisory Team
- date: 9 Haziran 2026
- category: security, identity, saml, redirect, x509
- tags: spring-security, saml2, cookie-request-cache, x509, xss, redirect, deserialization
- summary: Aynı gün yayımlanan Spring Security sürümleri SAML DoS, SAML credential deserialization, XSS, redirect ve X.509 impersonation risklerini kapatıyor. Ayrıca bazı eski hatlar için OSS destek fiilen bitmiş durumda.
- why_it_matters: Kimlik, yönlendirme ve güvenilen upstream varsayımları aynı anda etkileniyor; bu, tipik web uygulaması patch'inden daha geniş operasyonel etki yaratır.
- java_spring_relevance: Spring Security ile SSO, SAML, pre-auth veya custom login flow kullanan ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: SAML ve redirect akışlarını yeniden test ederek güvenlik modelini sadeleştirmek; deprecated extractor geçişini tamamlamak.
- risks: Security sürümünü ertelemek; destek dışı OSS hatlarda kalmak; redirect ve X.509 davranışlarını test etmeden deploy etmek.
- migration_notes: Hedef OSS seviyeler `6.5.11` ve `7.0.6`; `SubjectDnX509PrincipalExtractor` yerine `SubjectX500PrincipalExtractor` geçişi planlanmalı. SAML Login için GET response handling kısıtları ayrıca gözden geçirilmeli.

### Bulgu 2

- title: Spring Authorization Server `1.5.8`, auth endpoint redirect doğrulamasını ayrı bir bakım maddesine dönüştürdü
- source: [Spring Authorization Server 2026.06 Releases](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06/), [CVE-2026-41008](https://spring.io/security/cve-2026-41008/)
- author: Joe Grandja; Spring Security Advisory Team
- date: 9 Haziran 2026
- category: security, oauth2, authorization-server, redirect
- tags: spring-authorization-server, request_uri, redirect_uri, oauth2, oidc
- summary: Authorization endpoint, `request_uri` parametresini yetersiz doğruladığı için open redirect oluşturabiliyor. Fix, Spring Security çekirdeğinden ayrı olarak Authorization Server `1.5.8` ile geliyor.
- why_it_matters: Merkezi auth server kullanan yapılarda açık uygulama sınırını değil, kimlik akışının merkezini etkiliyor.
- java_spring_relevance: Spring Authorization Server kullanan bütün ekipler için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Auth server bağımlılıklarını uygulama güvenlik bağımlılıklarından ayrı governance altına almak.
- risks: Security patch alındı sanıp auth server sürümünü atlamak; redirect validation testlerini ihmal etmek.
- migration_notes: En az `1.5.8` hedeflenmeli. `spring-security-oauth2-authorization-server` sürümü bağımlılık ağacında ayrıca doğrulanmalı.

### Bulgu 3

- title: Spring Data servis sürümleri, HTTP'den repository altyapısına uzanan query yüzeylerini güvenlik konusu haline getirdi
- source: [Spring Data 2025.1.6 and 2025.0.12 released](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released/), [CVE-2026-41695](https://spring.io/security/cve-2026-41695/), [CVE-2026-41711](https://spring.io/security/cve-2026-41711/), [CVE-2026-41696](https://spring.io/security/cve-2026-41696/), [CVE-2026-41717](https://spring.io/security/cve-2026-41717/), [CVE-2026-41728](https://spring.io/security/cve-2026-41728/), [CVE-2026-41729](https://spring.io/security/cve-2026-41729/), [CVE-2026-41730](https://spring.io/security/cve-2026-41730/), [CVE-2026-41837](https://spring.io/security/cve-2026-41837/)
- author: Mark Paluch; Spring Security Advisory Team
- date: 9 Haziran 2026
- category: security, data-access, spring-data-rest, mongodb
- tags: spring-data, property-path, sort, querydsl, json-patch, spel, mongodb, spring-data-rest
- summary: Spring Data Commons, MongoDB ve Data REST tarafındaki birden çok CVE; sort parsing, property path resolution, regex placeholder, capture-all `@Query`, Querydsl ve JSON Patch yüzeylerinde dış girdinin repository mekanizmalarına taşınmasının pahalı olduğunu gösterdi.
- why_it_matters: Bu açıklar çoğu zaman controller katmanında görünmez; esas risk "framework convenience" ile dış girdinin doğrudan data abstraction katmanına verilmesi.
- java_spring_relevance: Spring Data REST, exposed repository metotları, MongoDB annotated query veya Querydsl filtreleme kullanan ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Query allow-list, input sanitization ve exposed repository envanterini çıkarmak; string tabanlı query kalıplarını azaltmak.
- risks: Gelecek Boot release'ini beklerken kritik bir haftayı açık geçirmek; `spring-data-rest` yüzeyini varsayılan güvenli kabul etmek.
- migration_notes: `2025.1.6` veya `2025.0.12` düzeyine çıkılmalı. `@Query("?0")`, `@Query(":#{?0}")`, regex binding ve JSON Patch kullanan uçlar ayrı regression testi gerektirir. Querydsl kullanan repository'lerde allow-list yaklaşımı değerlendirilmeli.

### Bulgu 4

- title: Spring Data `2026.0.0` GA, veri erişim API'lerini daha type-safe ve operasyonel hale getiriyor
- source: [Spring Data 2026.0.0 generally available](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available/), [Moving beyond Strings in Spring Data](https://spring.io/blog/2026/02/27/moving-beyond-strings-in-spring-data/)
- author: Mark Paluch
- date: 9 Haziran 2026
- category: data-access, developer-productivity, api-design
- tags: spring-data-2026-0, type-safe-property-paths, redis, mongodb, jdbc, r2dbc, upsert
- summary: Yeni GA hat; type-safe property paths, annotation-driven Redis Pub/Sub listeners, UnifiedJedis geçişi, MongoDB multi-collection bulk write ve JDBC/R2DBC tek statement upsert ile veri erişim katmanını hem daha güvenli hem daha ergonomik hale getiriyor.
- why_it_matters: String tabanlı property path ve query kurulumunu azaltmak, hem bakım maliyetini hem de yanlış property adı kaynaklı hata sınıfını düşürür.
- java_spring_relevance: Yeni geliştirme yapan veya ileri sürüm Spring Boot hattına geçen ekipler için yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: `Sort.by(Person::getFirstName)` benzeri type-safe geçişlerle refactoring güvenliği kazanmak; Redis ve relational upsert akışlarını sadeleştirmek.
- risks: Yeni GA hattı ile mevcut Boot/BOM uyumunu doğrulamadan erken geniş rollout yapmak.
- migration_notes: Eski string tabanlı API'ler yaşamaya devam ediyor; göç seçici yapılabilir. Özellikle yoğun sort/query kodu olan ortak kütüphaneler önce ele alınmalı.

### Bulgu 5

- title: Spring AMQP `4.1.0`, mesajlaşma katmanında hem güvenlik hem de varsayılan güven modeli değişimi getiriyor
- source: [Spring AMQP 4.1.0 Available](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available/), [CVE-2026-41701](https://spring.io/security/cve-2026-41701/), [CVE-2026-41714](https://spring.io/security/cve-2026-41714/)
- author: Artem Bilan; Spring Security Advisory Team
- date: 9 Haziran 2026
- category: messaging, security, broker-connectivity
- tags: spring-amqp, rabbitmq, amqp1, protonj2, json-converter, tls, correlation-id
- summary: Spring AMQP yeni özelliklerle birlikte fixed reply queue correlation ID tahmin edilebilirliği ve `amqps://` TLS güven doğrulama boşluğunu kapatıyor. JSON converter'ların varsayılanı artık "trust no one".
- why_it_matters: Messaging altyapısı çoğu ekipte iç ağ varsayımıyla gevşek değerlendirilir; bugünkü advisory'ler bunun maliyetini gösteriyor.
- java_spring_relevance: RabbitMQ veya AMQP kullanan Spring servisleri için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: RabbitMQ `4.3` ve daha güvenli converter default'larına aynı bakım penceresinde geçmek.
- risks: Fixed reply queue kullanan RPC kalıplarında reply poisoning riskini hafife almak; TLS'in var olmasını sertifika doğrulaması var sanmak.
- migration_notes: En az `4.0.4` veya `3.2.11` alınmalı; yeni projelerde `4.1.0` değerlendirilmeli. JSON converter trusted packages davranışı regression test ister.

### Bulgu 6

- title: JDK 26 performans sinyalleri, Java runtime yükseltmesini yeniden ekonomik hale getiriyor
- source: [Performance Improvements in JDK 26](https://inside.java/2026/06/09/jdk-26-performance-improvements/), [JDK 26](https://openjdk.org/projects/jdk/26/)
- author: Ana-Maria Mihalceanu; Per-Ake Minborg
- date: 9 Haziran 2026
- category: jdk, performance, runtime, compiler, virtual-threads
- tags: jdk26, lazyconstant, startup, heap, c2, vectorization, virtual-threads
- summary: JDK 26; `LazyConstant`, daha küçük default initial heap, daha geniş C2 optimizasyonu, gelişmiş vectorization cost modeli ve class initialization bekleyen virtual thread'lerde daha az carrier blocking ile pratik performans kazanımları sunuyor.
- why_it_matters: Bu değişikliklerin önemli kısmı uygulama kodu değiştirmeden kazanılabiliyor; özellikle servis startup ve throughput maliyeti için doğrudan değer taşıyor.
- java_spring_relevance: JVM üstünde çalışan tüm Spring servisleri için orta-yüksek.
- actionability: pilotla
- impact_level: orta-yüksek
- opportunities: Staging benchmark'ları ile JDK yükseltmesini yalnız güvenlik değil performans gerekçesiyle de hızlandırmak.
- risks: Varsayılan heap davranışı ve sanal thread scheduling değişimlerini ölçmeden üretime taşımak.
- migration_notes: Mevcut LTS hattında kalan ekipler bile JDK 26 pilotu açmalı. Özellikle startup süresi, CPU yoğun endpoint'ler ve virtual thread kullanılan workload'lar ayrı ölçülmeli.

### Bulgu 7

- title: Spring AI RC2 ve Oracle Jipher 10.36, dar ama teknik olarak anlamlı izleme başlıkları açtı
- source: [Spring AI 2.0.0-RC2](https://spring.io/blog/2026/06/09/spring-ai-2-0-0-RC2-available-now/), [Oracle Jipher 10.36](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java)
- author: Ilayaperumal Gopinathan; Poonam Parhar
- date: 9 Haziran 2026 ve 4 Haziran 2026
- category: ai, crypto, regulated-environments, low-priority
- tags: spring-ai, openai, anthropic, tool-calling, fips, pbkdf2, tls12
- summary: Spring AI RC2, RC1 sonrası tool-calling ve provider istemcilerinde stabilizasyon getiriyor; Oracle Jipher 10.36 ise FIPS 140-3 gereklilikleri nedeniyle DSA, TLS 1.2 EMS, Triple DES ve PBKDF2 kısıtlarını sertleştiriyor.
- why_it_matters: Bunlar herkesi etkilemiyor ama etkilenen ekiplerde runtime davranışını doğrudan değiştirebiliyor.
- java_spring_relevance: Spring AI RC kullanan veya FIPS-regüle Java ortamı işleten ekipler için seçici olarak yüksek.
- actionability: izle_ve_test_et
- impact_level: düşük-orta
- opportunities: AI RC hattında provider-level HTTP client konfigürasyonunu kurumsal proxy/policy ile hizalamak; FIPS ekiplerinde eski crypto kullanımını temizlemek.
- risks: RC sürümü production-ready saymak; Jipher kısıtlarının eski sertifika/padding alışkanlıklarını sessizce bozmasını gözden kaçırmak.
- migration_notes: Spring AI tarafında RC1'den RC2'ye geçiş düşük maliyetli ama test gerektirir. Jipher tarafında PBKDF2 iteration/salt ve TLS 1.2 EMS bağımlılıkları önceden taranmalıdır.

## Sonuç

10 Haziran 2026 sabahında Java/Spring dünyasının en güçlü günlük sinyali yeni feature yarışı değil; auth, data-access ve messaging katmanlarında aynı gün sıkışan güvenlik ve davranış düzeltmeleri. Bugünün rasyonel aksiyonu, Spring Security/Auth Server, Spring Data ve Spring AMQP için bağımlılık envanterini BOM seviyesinin ötesinde doğrulamak; exposed query ve patch yüzeylerini tehdit modeli içine almak; ardından JDK 26 performans pilotunu orta vadeli verimlilik işi olarak sıraya koymak.
