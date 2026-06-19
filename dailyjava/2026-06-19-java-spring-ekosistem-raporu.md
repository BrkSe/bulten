# Günlük Java / Spring Ekosistem Raporu

Tarih: 19 Haziran 2026  
Tarama zamanı: 19 Haziran 2026 09:08 TSİ  
Odak: Spring Data 4.1 etrafında büyüyen sorgu/yama yüzeyleri, kimlik ve oturum katmanındaki patch baskısı, JDK 27 için artık ertelenmemesi gereken uyumluluk testleri

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security/), Spring Security / Spring Authorization Server / Spring LDAP / Spring Retry / Spring Data release notları ve changelog girişleri, [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [JEP 523](https://openjdk.org/jeps/523), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/), Baeldung’in güncel Java/Spring içerikleri, Josh Long’un [This Week in Spring - 16 Haziran 2026](https://spring.io/blog/2026/06/16/this-week-in-spring-june-16-2026) yazısı, Gunnar Morling’in güncel blog akışı ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. InfoQ ve Baeldung tarafı bugün resmi Spring release/advisory hattından daha güçlü yeni karar sinyali üretmiyor. Gunnar Morling ve Burak KUTBAY tarafında 19 Haziran 2026 itibarıyla bugünün öncelik sırasını değiştirecek yeni bir Java/Spring yayını görünmüyor. Oracle Java Blog tarafında ise son güçlü üretim sinyali hâlâ 4 Haziran 2026 tarihli [Oracle Jipher 10.36](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java) duyurusu; bugünkü öncelik resmi OpenJDK ve Inside Java tarafındaki JDK 27 geçiş sinyallerinde.

## Öne Çıkan Başlıklar

- [Spring Data 2026.0.0 GA](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available) geliştirici ergonomisini ilerletiyor; fakat asıl üretim sinyali, [2025.1.6 ve 2025.0.12 servis sürümlerinin](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released) Querydsl, JSON Patch, `@Query`, `Sort`, property-path ve data-binding yüzeylerinde toplu güvenlik temizliği getirmesi.
- [Spring Security 7.1.0](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06) yalnız patch sürümü değil; [programmatic MFA, WebAuthn koşullu MFA ve yeni authorization manager yüzeyi](https://docs.spring.io/spring-security/reference/whats-new.html) ile kimlik katmanını daha politika odaklı hale getiriyor.
- [Spring Authorization Server 1.5.8](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06), [Spring LDAP 4.1.0](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06) ve [Spring Retry 2.0.13](https://spring.io/blog/2026/06/08/spring-retry-2) birlikte okunduğunda mesaj net: auth redirect, LDAP bind ve stateful retry cache artık “yardımcı framework detayı” değil, doğrudan saldırı yüzeyi.
- JDK 27 hattında [JSON thread dump format değişikliği](https://inside.java/2026/05/20/quality-heads-up/), [launcher option kaldırımları](https://inside.java/2026/05/13/quality-heads-up/) ve [G1’in her ortamda default olması hedefi](https://openjdk.org/jeps/523), JVM yükseltmesini yalnız performans değil operasyon/test konusu haline getiriyor.

## Kritik Güncellemeler

### 1. Spring Data 4.1 GA’nın gölgesindeki gerçek konu: dışa açılmış sorgu ve patch yüzeyleri

[Spring Data 2026.0.0 ("4.1")](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available) tarafında ilk bakışta öne çıkan başlıklar olumlu:

- Type-safe property paths
- Redis Pub/Sub listener iyileştirmeleri ve UnifiedJedis geçişi
- MongoDB için multi-collection bulk write desteği
- JDBC ve R2DBC için single-statement upsert

Ancak üretim açısından daha yüksek sinyal, aynı hafta çıkan [2025.1.6 ve 2025.0.12 servis sürümlerinde](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released) gizli. Bu sürümler tek tek küçük bug fix’lerden ibaret değil; toplamda on iki CVE ile veri erişim yüzeylerinde ortak bir güvenlik deseni gösteriyor:

- property path çözümlemesi ve negatif sonuç cache’leri attacker-controlled string kabul ediyor
- `Sort`, `@ProjectedPayload`, Querydsl filter ve JSON Patch girişleri heap veya stack tüketimine dönebiliyor
- MongoDB `@Query` ve Data REST JSON Patch akışlarında SpEL injection sınıfı riskler oluşabiliyor
- Query By Example / LIKE / regex benzeri bağlamlarda kaçış eksikleri veri sızdırma veya sorgu genişletme etkisi doğurabiliyor
- Spring Data REST hata yanıtları persistence-layer iç detaylarını dışarı sızdırabiliyor

Bu tablo, “Spring Data REST’i hızlı CRUD diye açalım, sonra sıkılaştırırız” yaklaşımının artık savunulabilir olmadığını gösteriyor. 16 Haziran raporundaki eksen tip güvenli property path ve 4.1 GA ergonomisiydi; bugünkü yeni sinyal ise aynı yüzeylerin dış dünyaya açıldığında ne kadar agresif bir patch yükü taşıdığı.

### 2. Kimlik katmanında aynı anda hem özellik hem patch dalgası var

[Spring Security 6.5.11 / 7.0.6 / 7.1.0](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06) seti yalnız CVE kapatmıyor; [Spring Security 7.1](https://docs.spring.io/spring-security/reference/whats-new.html) ile şu yönleri güçlendiriyor:

- `ConditionalAuthorizationManager`
- programmatic MFA için `when` / `withWhen` koşulları
- WebAuthn kayıt durumuna göre koşullu MFA
- `InetAddressMatcher`
- `PreFlightRequestFilter` desteği
- `RestClientOpaqueTokenIntrospector`

Aynı anda kapatılan açıklar ise doğrudan auth perimeter’ına dokunuyor:

- [CVE-2026-40988](https://spring.io/security/cve-2026-40988): SAML redirect binding tarafında unbounded DEFLATE inflation
- [CVE-2026-40993](https://spring.io/security/cve-2026-40993): SAML metadata depolamasında native deserialization riski
- [CVE-2026-41706](https://spring.io/security/cve-2026-41706): `CookieRequestCache` / `CookieServerRequestCache` ile login sonrası open redirect
- [CVE-2026-47838](https://spring.io/security/cve-2026-47838): X.509 CN ayrıştırmasında yanlış kullanıcı okuma / impersonation
- [CVE-2026-41008](https://spring.io/security/cve-2026-41008): Authorization Server `request_uri` open redirect

Mesaj şu: 2026’da Spring Security tarafındaki “özellik” hikâyesi passkey/WebAuthn/MFA yönüne ilerlerken, “patch” hikâyesi hâlâ SAML, redirect ve certificate parsing gibi çok klasik enterprise yüzeylerinden geliyor. Yani roadmap ve patch yönetimi artık aynı ekipte birleşmek zorunda.

### 3. LDAP ve Retry de artık “altyapı ayrıntısı” değil

[Spring LDAP 3.3.8 / 4.0.4 / 4.1.0](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06) ile kapatılan [CVE-2026-41720](https://spring.io/security/cve-2026-41720), boş veya `null` parola ile yapılan bind girişimlerinin RFC 4513’te tanımlanan unauthenticated bind davranışına kayabilmesini vurguluyor. Bu açık yalnız Spring Security LDAP adapter’ı değil, doğrudan `AbstractContextSource`, `LdapTemplate` ve `LdapClient` kullanan uygulamaları da etkiliyor.

[Spring Retry 2.0.13](https://spring.io/blog/2026/06/08/spring-retry-2) ile kapanan [CVE-2026-41710](https://spring.io/security/cve-2026-41710) ise daha az görünür ama production etkisi yüksek: `@Retryable(stateful = true)` kullanıyorsanız ve key attacker-controlled ise, başarısız ve bir daha tekrar edilmeyen çağrılar global retry cache’i kalıcı biçimde zehirleyebiliyor.

Bu ikisi birlikte şunu söylüyor:

- credential validation yalnız security filter chain konusu değil
- retry state de artık saf dayanıklılık deseni değil, kapasite ve erişilebilirlik güvenliği konusu

### 4. JDK 27 için “bakarız” dönemi bitiyor

Inside Java ve OpenJDK tarafında son haftalardaki sinyaller bir araya getirildiğinde, 19 Haziran 2026 itibarıyla en mantıklı yorum şu: JDK 27 uyumluluk testi artık ileri tarihe atılmamalı.

Öne çıkan noktalar:

- [JDK 27 kalite uyarıları](https://inside.java/2026/05/22/quality-heads-up/) release hattının stabilizasyon evresine girdiğini açıkça söylüyor.
- [JSON thread dump çıktılarında](https://inside.java/2026/05/20/quality-heads-up/) `tid`, `thread counts` ve `processId` artık string değil sayı olarak yazılıyor; parser, APM ve log tooling buna göre güncellenmeli.
- [Launcher option kaldırımları](https://inside.java/2026/05/13/quality-heads-up/) nedeniyle `-noverify`, `-Xverify:none`, `-verifyremote`, `-noclassgc` kullanan eski startup script’leri doğrudan fail edecek.
- [JEP 523](https://openjdk.org/jeps/523), explicit GC seçmeyen ortamlarda G1’i her yerde default hale getirmeyi hedefliyor.
- [JDK 27 proje hattı](https://openjdk.org/projects/jdk/27/) ve yakın tarihli Inside Java yayınları, kriptografi ve serviceability başlıklarının bu release’te özellikle izlenmesi gerektiğini gösteriyor.

Buradaki çıkarım kaynaklardan türetilmiştir: asıl kırılma noktası yeni language feature değil, var olan operasyon otomasyonunun ve gözlemleme aracının yeni JDK davranışlarıyla ne kadar uyumlu olduğu.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring ekosisteminde saldırı yüzeyi artık controller’dan çok “framework convenience layer” içinde birikiyor

Tekrarlayan örnekler:

- Spring Data REST JSON Patch ve Querydsl filter yüzeyleri
- Spring Security `CookieRequestCache`
- Spring Authorization Server `request_uri`
- Spring LDAP bind stratejileri
- Spring Retry stateful cache yönetimi

Çıkarım:

- “Framework bizi zaten güvenli yapar” varsayımı zayıflıyor.
- Özellikle otomatik binding, auto-generated filter, patch, redirect ve cache anahtarları en kırılgan katman haline geliyor.

### Trend Kümesi 2: Özellik geliştirmeleri ile güvenlik bakım penceresi aynı sprint’e düştü

Tekrarlayan örnekler:

- Spring Data 4.1 GA ile aynı anda servis release’lerde toplu CVE düzeltmeleri
- Spring Security 7.1 yeni MFA/WebAuthn yüzeyi ile birlikte auth CVE’leri
- Spring LDAP 4.1 feature line ile security fix’in aynı release dalgasında gelmesi

Çıkarım:

- Upgrade kararını “özellik istiyor muyuz?” diye değil, “hangi risk yüzeyinde kalıyoruz?” diye vermek gerekiyor.
- Minor/GA release duyurularını tek başına okumak yanıltıcı; aynı günün advisory set’i ile birlikte değerlendirmek zorunlu.

### Trend Kümesi 3: JDK yükseltmesi script, parser ve runtime varsayımlarını kırdığı için platform işi haline geldi

Tekrarlayan örnekler:

- JSON thread dump format değişimi
- launcher option kaldırımları
- G1 default seçiminin yaygınlaşması

Çıkarım:

- Uygulama ekibi tek başına “Java 27’ye geçelim” diyemez.
- Platform engineering, SRE, gözlemleme ve build/release hattı birlikte test etmezse upgrade maliyeti son dakikaya kalır.

### Gürültü mü, kalıcı değer mi?

- Çok yüksek kalıcı değer: Spring Data REST/Commons güvenlik yüzeyleri, Spring Security auth perimeter patch tabanı
- Yüksek kalıcı değer: Spring Security 7.1 MFA/WebAuthn politika yüzeyi, JDK 27 serviceability uyumluluğu
- Orta kalıcı değer: Spring Data 4.1 feature seti
- Düşük öncelik: tutorial düzeyindeki Baeldung AI/OAuth içerikleri ve eski blog akışları; ilginçler ama bugünkü karar sırasını değiştirmiyorlar

## Araçlar ve Kütüphaneler

- [Spring Data 2026.0.0 / 4.1](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available): type-safe property paths, Redis Pub/Sub listener iyileştirmeleri, Mongo multi-collection bulk writes, JDBC/R2DBC single-statement upsert.
- [Spring Security 7.1](https://docs.spring.io/spring-security/reference/whats-new.html): programmatic MFA, WebAuthn tabanlı koşullu MFA, `ConditionalAuthorizationManager`, yeni opaque token introspection yüzeyi.
- [Spring Authorization Server 1.5.8](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06): yeni özellikten çok güvenli redirect doğrulaması için minimum patch tabanı.
- [Spring LDAP 4.1.0](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06): `LdapClient` hattını kullanan ekipler için yeni aktif line; asıl kritik konu boş parola bind davranışının düzeltilmesi.
- [JDK 27 EA hattı](https://openjdk.org/projects/jdk/27/): bu raporda “araç”tan çok test platformu olarak önemli. Yeni language özelliğinden önce toolchain uyumluluğu ölçülmeli.

Bugün ayrı bir yeni OSS araç duyurusu, production Java/Spring yol haritasını yukarıdakiler kadar değiştirmiyor. Bu nedenle araç bölümünde hype değil, doğrudan operasyonel etkisi olan runtime ve framework katmanları öne çıkarıldı.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Data REST, Querydsl web desteği, `@ProjectedPayload`, JSON Patch ve dıştan gelen `Sort` / filter parametreleri kullanıyorsanız bunları plain convenience API değil, saldırı yüzeyi olarak ele alın.
- Spring Security tarafında passkey/WebAuthn veya MFA planlıyorsanız 7.1.0’ı yalnız feature release olarak değil, aynı anda patch floor olarak değerlendirin.
- Authorization Server kullanan ekipler `request_uri` akışını ve login sonrası redirect davranışlarını güvenlik testi kapsamına almalı.
- LDAP bind işlemi için “sunucu reddeder zaten” varsayımı geçerli değil; boş parola ve null parola senaryoları uygulama testine açıkça eklenmeli.
- `@Retryable(stateful = true)` kullanan ekipler key üretimini ve cache büyüme sınırlarını tekrar gözden geçirmeli; aksi halde retry altyapısı DoS yüzeyine dönüşebilir.
- JDK 27 denemelerinde yalnız benchmark koşturmak yetmez; startup script, APM parser, thread dump analizi, container memory davranışı ve GC default seçimi birlikte test edilmeli.

## Fırsatlar ve Riskler

### Fırsatlar

- Spring Data 4.1’in type-safe path ve upsert iyileştirmeleri ile custom query/binding kodunu azaltıp güvenlik denetim alanını daraltmak.
- Spring Security 7.1 ile MFA kararlarını endpoint bazlı değil politika bazlı modellemek.
- JDK 27 geçişini erken test edip gözlemleme ve startup hattını release öncesinde standartlaştırmak.
- LDAP ve retry davranışlarını merkezileştirip ekipler arası farklı implementasyonları azaltmak.

### Riskler

- Spring Data REST’i internet-facing bırakıp JSON Patch, Querydsl ve hata gövdesi davranışlarını varsayılanlara terk etmek.
- Auth redirect ve cookie cache akışlarını klasik phishing/open-redirect testlerine dahil etmemek.
- X.509 veya LDAP entegrasyonlarını “kurumsal altyapı zaten güvenli” diye düşünerek negatif test yapmamak.
- JDK 27 yükseltmesinde eski JVM flag’leri kullanan deployment manifestlerini son dakikada fark etmek.
- JSON thread dump format değişimini fark etmeyip incident tooling’ini sessizce bozmak.

## İzlenmesi Gereken Konular

- Spring Boot’un “gelecek hafta” alacağı Spring Data servis sürümlerinin BOM’a tam olarak hangi seviyede yansıyacağı.
- Spring Security 7.1.x hattında MFA/WebAuthn tarafına ek guardrail veya follow-up düzeltme gelip gelmeyeceği.
- Spring Data REST için ilave advisory veya davranış değişikliği gerektiren patch’lerin çıkıp çıkmayacağı.
- JDK 27 tarafında G1 default değişiminin container ve küçük heap profillerinde gerçek etkisi.
- Oracle Java Blog ve Inside Java tarafında JDK 27 release yaklaşırken yeni migration heads-up’ların gelip gelmeyeceği.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Data 4.1 GA, verimlilik iyileştirmeleri getirirken veri erişim katmanının güvenlik sınırlarını da sert biçimde görünür kıldı
- source: [Spring Data 2026.0.0 generally available](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available), [Spring Data 2025.1.6 and 2025.0.12 released](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released)
- author: Mark Paluch
- date: 09 Haziran 2026
- category: data-access, platform, migration, security
- tags: spring-data, property-path, redis-pubsub, mongodb-bulk, r2dbc-upsert, jdbc-upsert, patch-floor
- summary: Spring Data 4.1; type-safe property path, Redis Pub/Sub listener, Mongo bulk write ve upsert tarafında gerçek geliştirmeler sunuyor. Ancak aynı zaman penceresinde çıkan servis sürümleri, veri erişim yüzeylerinin güvenlik açısından ciddi bir temizlik gerektirdiğini gösteriyor.
- why_it_matters: Feature kazanımı ile patch zorunluluğu aynı release dalgasında birleşti; ekibin yalnız yeni feature’a bakıp eski servis hattında kalması artık daha riskli.
- java_spring_relevance: Spring Data JPA, MongoDB, Redis, JDBC, R2DBC, REST ve Querydsl kullanan tüm Java/Spring ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Custom query/binding kodunu azaltırken type-safe API’lerle daha denetlenebilir veri erişim katmanı kurmak.
- risks: Dış input’un property path, patch path, regex veya sort parametresi olarak framework içine doğrudan girmesi.
- migration_notes: 4.1 feature seti ilgini çekmese bile 2025.1.6/2025.0.12 veya Boot’un bunları içeren patch tabanına geçiş planlanmalı.

### Bulgu 2

- title: Spring Data REST ve Commons, otomatik filter/patch kolaylıklarının saldırı yüzeyine dönüştüğünü kanıtladı
- source: [CVE-2026-41695](https://spring.io/security/cve-2026-41695), [CVE-2026-41717](https://spring.io/security/cve-2026-41717), [CVE-2026-41728](https://spring.io/security/cve-2026-41728), [CVE-2026-41729](https://spring.io/security/cve-2026-41729), [CVE-2026-41837](https://spring.io/security/cve-2026-41837), [CVE-2026-41730](https://spring.io/security/cve-2026-41730)
- author: Spring Security Advisory Team
- date: 09 Haziran 2026
- category: security, api-design, data-access, rest
- tags: spring-data-rest, querydsl, json-patch, spel-injection, property-path, error-leakage, dos
- summary: Spring Data REST ve Commons tarafında property-path DoS, JSON Patch bypass, map-key üzerinden SpEL injection, hata yanıtında iç detay sızması ve Jackson-hidden alanların filter key olarak açığa çıkması gibi birden çok açık aynı eksende toplandı.
- why_it_matters: Bu açıklar tek bir kütüphanedeki bug’dan fazlasını söylüyor; otomatik filter, patch ve binding convenience’ları dış dünyaya açıldığında güvenlik tasarımı haline geliyor.
- java_spring_relevance: Spring Data REST, Querydsl web desteği, `@ProjectedPayload`, dış input’tan `Sort` veya patch alan endpoint’leri olan Java servisleri için doğrudan kritik.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Repository export yüzeylerini daraltmak, allow-list tabanlı filter/patch API’lerine geçmek, explicit DTO sınırlarını güçlendirmek.
- risks: CRUD üretkenliği uğruna domain model’i ve repository surface’ini internete açmak.
- migration_notes: Public-facing Data REST varsa patch seviyesini yükseltin; JSON Patch, Querydsl ve hata gövdesi davranışını integration test ile yeniden doğrulayın; mümkünse explicit controller/DTO katmanına dönün.

### Bulgu 3

- title: Spring Security 7.1, MFA ve WebAuthn tarafında politika yüzeyini genişletirken auth perimeter’daki klasik açıkları da kapatıyor
- source: [Spring Security 2026.06 Releases - Contains CVE Fixes](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06), [What’s New in Spring Security 7.1](https://docs.spring.io/spring-security/reference/whats-new.html), [CVE-2026-41706](https://spring.io/security/cve-2026-41706), [CVE-2026-47838](https://spring.io/security/cve-2026-47838), [CVE-2026-40988](https://spring.io/security/cve-2026-40988)
- author: Josh Cummings; Spring Security Team
- date: 09 Haziran 2026
- category: security, identity, web, oauth2
- tags: spring-security, mfa, webauthn, conditional-authorization, saml, x509, redirect, opaque-token
- summary: 7.1.0; programmatic MFA, WebAuthn-registered kullanıcılar için koşullu MFA ve yeni authorization manager yüzeyleri eklerken, aynı sürüm ailesi SAML, redirect ve X.509 tabanlı açıkları kapatıyor.
- why_it_matters: Kimlik katmanı aynı anda hem modernleşiyor hem de geleneksel enterprise auth akışlarından patch yemeye devam ediyor; ayrı iki backlog gibi yönetilemez.
- java_spring_relevance: SAML, OAuth2, pre-auth X.509, cookie-based request caching veya passkey/WebAuthn planı olan Spring ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: MFA kurallarını kullanıcı tipi, ağ bağlamı ve kayıt durumu üzerinden daha esnek tanımlamak.
- risks: Feature upgrade yapmadan security patch beklemek veya patch yapıp auth davranışını yeniden test etmemek.
- migration_notes: 6.5.11 / 7.0.6 / 7.1.0 minimum tabanlarını kontrol edin; SAML redirect binding, login sonrası redirect ve X.509 principal extraction akışlarını negatif testlerle çalıştırın.

### Bulgu 4

- title: Spring Authorization Server 1.5.8, login akışında `request_uri` doğrulamasını artık görmezden gelinemeyecek bir risk olarak öne çıkardı
- source: [Spring Authorization Server 2026.06 Releases - Contains CVE Fixes](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06), [CVE-2026-41008](https://spring.io/security/cve-2026-41008)
- author: Joe Grandja; Spring Security Advisory Team
- date: 09 Haziran 2026
- category: security, oauth2, authorization
- tags: authorization-server, request-uri, open-redirect, oidc, login
- summary: Authorization endpoint’in `request_uri` parametresini yetersiz doğrulaması, geçersiz `request_uri` ile keyfi `redirect_uri` kombinasyonuna açık kapı bırakıyordu.
- why_it_matters: Bu tür açıklar çoğu zaman uygulama business logic’inde değil, authorization server entegrasyonunda ortaya çıkar ve phishing zincirine dönüşür.
- java_spring_relevance: Spring Authorization Server kullanan veya özelleştirilmiş OIDC/OAuth2 login akışları bulunan Java ekipleri için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Redirect doğrulama politikasını merkezileştirmek, OIDC integration test paketini güçlendirmek.
- risks: Login success veya authorization request akışında istemci yönlendirmelerini fazla esnek bırakmak.
- migration_notes: 1.5.8’e çıkın; özel `AuthorizationEndpoint` veya redirect doğrulama uzantılarınızı yeniden gözden geçirin.

### Bulgu 5

- title: Spring LDAP ve Spring Retry, görünmez alt katman davranışlarının doğrudan güvenlik problemi olabileceğini yeniden hatırlattı
- source: [Spring LDAP 2026.06 Releases - Contains CVE Fix](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06), [CVE-2026-41720](https://spring.io/security/cve-2026-41720), [Spring Retry 2.0.13 available now](https://spring.io/blog/2026/06/08/spring-retry-2), [CVE-2026-41710](https://spring.io/security/cve-2026-41710)
- author: Josh Cummings; Stéphane Nicoll; Spring Security Advisory Team
- date: 08 Haziran 2026
- category: security, resilience, authentication, operations
- tags: spring-ldap, ldapclient, ldaptemplate, empty-password, spring-retry, stateful-retry, cache-exhaustion
- summary: Spring LDAP boş/null parola ile unauthenticated bind riskini kapatırken, Spring Retry stateful retry cache’inin attacker-controlled key ile kalıcı biçimde doldurulabildiğini gösterdi.
- why_it_matters: Her iki açık da “framework default davranışı” düzeyinde; uygulama mantığınız kusursuz olsa bile çevresel policy ve cache davranışı sizi savunmasız bırakabiliyor.
- java_spring_relevance: LDAP auth yapan, `LdapTemplate`/`LdapClient` kullanan veya stateful retry ile idempotency/iş kuralı akışı kuran ekipler için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Credential validation ve retry policy’lerini merkezi, test edilebilir bileşenlere taşımak.
- risks: LDAP sunucusunun boş parola bind kabul etmesi veya retry cache key’inin dış input ile kontrol edilmesi.
- migration_notes: LDAP tarafında boş parola testlerini ekleyin; stateful retry kullanıyorsanız key generator ve cache eviction davranışını yeniden tasarlayın.

### Bulgu 6

- title: JDK 27 geçişi, koddan önce platform otomasyonunu kırabilecek küçük ama kritik davranış değişiklikleri getiriyor
- source: [JDK 27](https://openjdk.org/projects/jdk/27/), [JEP 523](https://openjdk.org/jeps/523), [JDK 27: Numeric Fields in JSON Thread Dumps](https://inside.java/2026/05/20/quality-heads-up/), [JDK 27: Removal of Deprecated Java Launcher Options](https://inside.java/2026/05/13/quality-heads-up/), [JDK 27 Approaches Rampdown](https://inside.java/2026/05/22/quality-heads-up/)
- author: OpenJDK; Ana-Maria Mihalceanu; Billy Korando; David Delabassee
- date: 13-22 Mayıs 2026
- category: jvm, operations, serviceability, migration
- tags: jdk27, g1, launcher-options, thread-dumps, serviceability, ea-testing
- summary: JDK 27 hattı; launcher option kaldırımları, JSON thread dump format değişimi ve G1 default seçimi gibi küçük görünen ama platform otomasyonunu etkileyen değişiklikler taşıyor.
- why_it_matters: Kırılacak şey çoğu zaman uygulama kodu değil; startup script, parser, incident tooling, APM entegrasyonu ve küçük heap profilleri olacak.
- java_spring_relevance: JVM üzerinde çalışan tüm Spring servisleri için yüksek; özellikle container platformu ve operasyon otomasyonu güçlü olan ekiplerde etkisi daha görünür.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: JDK yükseltme sürecini SRE/platform ekibiyle birlikte standardize etmek, GC ve thread-dump otomasyonunu sadeleştirmek.
- risks: Eski JVM flag’leriyle prod açılış hatası, JSON thread dump parser kırılması, GC davranışını fark etmeden değiştirmek.
- migration_notes: JDK 27 EA hattında smoke test açın; deployment manifest ve startup script’lerde kaldırılan option’ları tarayın; thread dump parser’larını `formatVersion` ve numeric alanlarla test edin.

## Sonuç

Bugünün en güçlü Java/Spring sinyali yeni bir framework heyecanı değil, Spring’in “kolaylık katmanları”nın güvenlik açısından ne kadar pahalı hale geldiği. Spring Data, Spring Security, Authorization Server, LDAP ve Retry tarafındaki açıklar aynı şeyi söylüyor: dış input’u otomatik filtreye, patch path’e, redirect’e, bind’e veya cache key’ine dönüştüren her soyutlama artık explicit güvenlik tasarımı istiyor.

İkinci kritik mesaj ise JDK 27’nin bekleme odasında olmadığı. 19 Haziran 2026 itibarıyla akıllı hareket, dil özelliği kovalamaktan önce startup flag’lerini, thread dump parser’larını, GC varsayımlarını ve platform otomasyonunu yeni JDK hattına karşı test etmek. Java/Spring ekipleri için bugünün doğru refleksi yeni oyuncak eklemek değil; görünmez varsayımları görünür hale getirmek.
