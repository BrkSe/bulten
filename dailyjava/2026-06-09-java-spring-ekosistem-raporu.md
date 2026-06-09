# Günlük Java / Spring Ekosistem Raporu

Tarih: 9 Haziran 2026  
Tarama zamanı: 9 Haziran 2026 09:05 TSİ  
Odak: Haziran patch dalgasının somut etkileri, Spring Framework `6.2.x` OSS hattının kapanış eşiği, observability ve kenar modüllerdeki güvenlik yamaları

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security/), [OpenJDK kaynakları](https://openjdk.org/projects/jdk/27/), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’un 2 Haziran 2026 tarihli haftalık özeti](https://spring.io/blog/2026/06/02/this-week-in-spring-june-2-2026/), [Gunnar Morling’in blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY’ın blogu](https://blog.burakkutbay.com/) ile ilgili GitHub release/advisory kayıtları kontrol edildi. 9 Haziran 2026 itibarıyla yeni karar etkisi ağırlıklı olarak 8 Haziran’da açılan Spring patch dalgasında toplandı. Oracle Java tarafında aynı tarih aralığında yeni bir JDK patch yayını görünmüyor; resmi Java tarafındaki en taze günlük sinyal daha çok geliştirici aracı düzeyinde kaldı.

## Öne Çıkan Başlıklar

- [Spring Framework `7.0.8` ve `6.2.19`](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now/) aynı gün içinde 18 ayrı CVE ile geldi; daha önemlisi Spring takımı `6.2.19` için “muhtemelen son OSS 6.2.x sürümü” ifadesini kullandı. Bu, güvenlik upgrade’ini doğrudan branch geçişi konusuna çevirdi.
- [Micrometer advisories](https://spring.io/security/cve-2026-40983/) ve [fix sürümleri](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.16.6) ile observability katmanı artık pasif bir starter bağımlılığı değil, aktif bir patch yüzeyi olduğunu gösterdi. Aynı gün [Micrometer `1.17.0`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0) da GA oldu.
- [Spring LDAP `3.3.8`, `4.0.4`, `4.1.0`](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06/) boş parola ile authentication bypass riskini kapatıyor; `4.1.0` ayrıca transitive dependency davranışını değiştiriyor.
- [Spring HATEOAS `3.1 GA`, `3.0.7`, `2.5.3`](https://spring.io/blog/2026/06/08/spring-hateoas-3-1-GA-3-0-7-and-2-5-3-released/) iki yüksek etkili CVE ile geldi. Hypermedia kabul eden uçlar çoğu ekipte düşük görünürlükte olduğu için bu risk kolay gözden kaçabilir.
- [Spring Retry `2.0.13`](https://spring.io/blog/2026/06/08/spring-retry-2/) önemli ama dar kapsamlı bir düzeltme içeriyor: asıl risk, yalnız `@Retryable(stateful=true)` kullanan ve attacker-controlled key üreten akışlarda.
- Java/JVM tarafında bugün üretim kararını değiştirecek yeni bir runtime announcement yok. [Oracle Java Extension for VS Code `26.0.0`](https://inside.java/2026/06/08/java-vscode-extension-update) geliştirici verimliliği açısından faydalı ama düşük öncelikli.

## Kritik Güncellemeler

### 1. Spring Framework `7.0.8` ve `6.2.19`, güvenlik fix’inden fazlası: OSS branch kapanış sinyali

[Spring Framework `7.0.8` ve `6.2.19`](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now/) tekil bir CVE kapanışı değil; web, expression ve request-processing katmanına yayılmış toplu bir düzeltme paketi.

- Aynı release kümesinde WebSocket session ID üretimi, WebFlux session fixation, multipart işleme, static resource zinciri, `AntPathMatcher`, SpEL, SSRF ve Jackson JMS converter yüzeyleri birlikte etkileniyor.
- Temsili örnekler:
- [CVE-2026-41854](https://spring.io/security/cve-2026-41854/): `UriComponentsBuilder` ile dış kaynaklı URL parse/validation akışlarında SSRF riski.
- [CVE-2026-41852](https://spring.io/security/cve-2026-41852/): güvenilmeyen SpEL ifadeleri değerlendirilirse istenmeyen zero-arg method invocation mümkün.
- Release duyurusundaki en stratejik cümle şu: `6.2.19`, büyük olasılıkla `6.2.x` neslinin son OSS sürümü.

Bu neden kritik:

- Bugün mesele yalnız `6.2.18 -> 6.2.19` değil; OSS kullanıcıları için `6.2.x` üstünde kalma maliyeti hızla artıyor.
- “Hangi CVE bana uygulanıyor?” sorusu yine önemli; ama bu kadar geniş yüzeyli bir rollup geldiğinde seçici cherry-pick yaklaşımı yerine tam framework upgrade daha savunulabilir.
- Spring MVC/WebFlux kullanan ekipler için artık web katmanı güvenliği ile sürüm stratejisi aynı backlog maddesi haline geldi.

Pratik yorum:

- `6.2.x` OSS hattındaysanız kısa vadeli patch, orta vadeli `7.0.x` geçiş planını aynı anda açın.
- Özellikle şu kod yollarını yeniden tarayın:
- kullanıcıdan gelen URL’yi parse edip doğrulayan helper’lar
- kullanıcı kontrollü SpEL değerlendirmesi
- static resource chain ve versioned resource kullanımı
- custom multipart handling

### 2. Micrometer, bugün itibarıyla “sadece metrics kütüphanesi” değil

[CVE-2026-40983](https://spring.io/security/cve-2026-40983/) ve [CVE-2026-40984](https://spring.io/security/cve-2026-40984/) birlikte okunduğunda Micrometer’ın hem gRPC hem HTTP server instrumentation yüzeyinde DoS riski taşıdığı açık.

- gRPC tarafında risk; `ObservationRegistry`, gözlem kaydı, `DefaultMeterObservationHandler` veya benzeri metrik üreten handler ve `ObservationGrpcServerInterceptor` kombinasyonunda açılıyor.
- HTTP tarafında risk; `micrometer-core`, `micrometer-jetty11`, `micrometer-jetty12` instrumentasyonları ile metrik kaydı yapıldığında tetiklenebiliyor.
- Fix sürümleri resmi advisory’de `1.16.6` ve `1.15.12` olarak veriliyor.
- Aynı gün [Micrometer `1.17.0`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0) da GA oldu; ayrıca [v1.16.6](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.16.6) ve [v1.15.12](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.15.12) release notlarında HTTP/gRPC instrumentation allocation azaltımları görünür durumda.

Bu neden kritik:

- Spring ekipleri çoğu zaman framework ve cloud bağımlılıklarını yakından izler, observability bağımlılıklarını ise BOM içinde “arka plan” kabul eder. Bugün bu varsayım kırılıyor.
- Saldırı yüzeyi doğrudan iş mantığında değil; request etiketleme ve instrumentation davranışında oluşuyor. Bu yüzden gözden kaçması kolay.
- Framework tarafını güncellemek tek başına yetmeyebilir; efektif Micrometer sürümünü ayrıca doğrulamak gerekir.

Pratik yorum:

- `dependency:tree`, `gradle dependencies` veya build scan ile efektif Micrometer sürümünü çıkarın.
- Spring Boot BOM’u üzerinden geldiği için güvenli olduğunu varsaymayın; gerçek çözüm, fix seviyesinin uygulama build’ine girip girmediğini doğrulamaktır.
- gRPC ve HTTP server metrics’i aktif olan servisler önceliklendirilmeli.

### 3. Spring LDAP düzeltmesi yalnız güvenlik değil, aynı zamanda geçiş notu taşıyor

[Spring LDAP `3.3.8`, `4.0.4`, `4.1.0`](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06/) ile gelen [CVE-2026-41720](https://spring.io/security/cve-2026-41720/) boş veya `null` parola ile unauthenticated bind kabul eden LDAP server’larda password verification bypass riskini kapatıyor.

- Etkilenen yüzey doğrudan `AbstractContextSource`, `LdapTemplate` ve `LdapClient`.
- OSS fix seviyeleri `3.3.8` ve `4.0.4`.
- Aynı duyuruda `4.1.0` da GA oldu.
- [Spring LDAP 4.1 “What’s New” sayfası](https://docs.spring.io/spring-ldap/reference/4.1/whats-new.html) iki önemli not veriyor:
- `spring-data-commons`, artık `spring-ldap-core` üzerinden transitive gelmiyor; buna güvenen uygulamalar explicit dependency eklemek zorunda.
- `LdapClient` arama desteğine `map()`, `single()`, `optional()`, `list()` ve `stream()` eklendi.

Bu neden kritik:

- LDAP çoğu ekipte “eski ama stabil” görülen bir entegrasyon. Tam da bu yüzden auth bypass türü kusurlar uzun süre görünmez kalabiliyor.
- `4.1.0` geçişi yalnız feature upgrade değil; build-time dependency varsayımlarını da bozabilir.
- Enterprise directory entegrasyonlarında bu tip hatalar blast radius’i yüksek ama test kapsamı dar olur.

Pratik yorum:

- Empty password bind davranışı için negatif test ekleyin.
- `spring-ldap-core` kullanan projelerde `spring-data-commons` transitif geliyor varsayımı varsa build’i şimdi kırmak, prod’da kırmaktan iyidir.
- `LdapClient` kullanan ekipler `4.1.0` API kazanımlarını değerlendirebilir; ama güvenlik fix’ini feature geçişinden bağımsız planlamak daha doğru.

### 4. Spring HATEOAS, “nadir kullanılan medya tipi” yüzeyinde iki sert uyarı verdi

[Spring HATEOAS `3.1 GA`, `3.0.7`, `2.5.3`](https://spring.io/blog/2026/06/08/spring-hateoas-3-1-GA-3-0-7-and-2-5-3-released/) ile iki yüksek etkili advisory aynı anda kapatıldı:

- [CVE-2026-41006](https://spring.io/security/cve-2026-41006/): Collection+JSON ve UBER deserializer’ları Jackson access-control anotasyonlarını dikkate almadan reflection ile binding yapabiliyor.
- [CVE-2026-41007](https://spring.io/security/cve-2026-41007/): attacker-supplied link relation string’leri için unbounded static cache tutuluyor ve heap exhaustion oluşabiliyor.

Bu neden kritik:

- Bu risk her Spring MVC uygulamasına eşit dağılmıyor; ama `@EnableHypermediaSupport`, auto-configured hypermedia ve `RepresentationModel` / `EntityModel` alan request-body uçları olan ekiplerde doğrudan kritik.
- Çoğu takım HATEOAS’ı “okuma tarafı” özelliği gibi görür. Oysa advisory doğrudan inbound deserialization yüzeyini işaret ediyor.
- Hypermedia tipleri uygulamada açık ama aktif kullanımda değilse bile, kabul edilen media type listesi beklenmedik bir saldırı yüzeyi yaratabilir.

Pratik yorum:

- Collection+JSON veya UBER medya tiplerini gerçekten kullanmıyorsanız kapatmayı değerlendirin.
- `RepresentationModel` veya `EntityModel` tabanlı inbound binding yapan uçları ayrı tarayın.
- `Link` header veya benzeri client-controlled hypermedia parse akışları için hafıza baskısı testi yapın.

### 5. Spring Retry `2.0.13`: etkisi dar ama göz ardı edilirse pahalı

[Spring Retry `2.0.13`](https://spring.io/blog/2026/06/08/spring-retry-2/) ile [CVE-2026-41710](https://spring.io/security/cve-2026-41710/) kapatıldı.

- Risk yalnız şu üç koşul aynı anda varsa açılıyor:
- `@Retryable(stateful=true)` açık olacak
- cache key attacker-controlled olacak
- saldırgan aynı isteği tekrar ettirmeden sürekli yeni failing key üretebilecek
- Advisory açıkça söylüyor: stateless retry, yani default davranış etkilenmiyor.

Bu neden kritik:

- Spring retry kullanan herkesin paniğe kapılması gerekmiyor; ama stateful retry kullananların hızlı davranması gerekiyor.
- Birçok ekip retry denince Reactor veya stateless AOP retry düşünür. Stateful retry ise çoğu zaman daha eski imperative servis katmanlarında görünür.
- Advisory’nin pratik değeri, blast radius’i daraltması: doğru envanter çıkarılırsa upgrade önceliği daha rasyonel sıralanabilir.

Pratik yorum:

- Önce stateful retry kullanıp kullanmadığınızı bulun.
- Kullanıyorsanız `2.0.13`’e çıkın ve default key generator’ın attacker-controlled parametrelerle çalışıp çalışmadığını kontrol edin.
- Retry cache davranışı için yük testi eklemek mantıklı.

## Trendler ve Sinyaller

### Trend Kümesi 1: Haziran patch penceresi “beklenen yoğunluk” olmaktan çıkıp somut release dalgasına dönüştü

- [Josh Long’un 2 Haziran özeti](https://spring.io/blog/2026/06/02/this-week-in-spring-june-2-2026/) ve güvenlik odaklı release kayması uyarısı, 8 Haziran’da gerçek release setine dönüştü.
- Bugün görülen tablo, tek bir amiral gemi proje değil; Framework, Micrometer, LDAP, HATEOAS ve Retry gibi farklı katmanların aynı gün hareket etmesi.

Çıkarım: Bu hafta “tek dependency bump” değil, modül bazlı doğrulama haftası.

### Trend Kümesi 2: BOM veya release train tek başına yeterli görünürlük sağlamıyor

- Framework patch’ini almak Micrometer riskini çözmüyor.
- LDAP, HATEOAS ve Retry ayrı release hızlarında ilerliyor.
- `6.2.x` OSS hattının kapanış sinyali, “aynı major içinde kalırız” konforunu azaltıyor.

Çıkarım: Kurumsal Spring takımlarında governance artık yalnız parent BOM değil, kritik modül envanteri üzerinden yürümeli.

### Trend Kümesi 3: Risk yüzeyi artık yalnız core web stack değil

- observability instrumentation
- LDAP bind stratejileri
- hypermedia deserialization
- stateful retry cache’leri

Bu başlıklar tipik mimari diyagramlarda merkezde görünmez; ama bugünkü advisories tam bu çevresel yüzeyleri vuruyor.

Çıkarım: “Nadir kullanılan” veya “altyapı detayı” sayılan modüller için güvenlik envanteri çıkarma dönemi başladı.

### Hype mı, kalıcı mı?

- Kalıcı mühendislik değeri yüksek: Framework `7.0.8` / `6.2.19`, Micrometer patch seviyesi, LDAP auth bypass fix’i, HATEOAS inbound hardening
- Dar ama gerçek risk: stateful Spring Retry cache exhaustion
- Düşük öncelik / bilgi amaçlı: [Oracle Java Extension for VS Code `26.0.0`](https://inside.java/2026/06/08/java-vscode-extension-update), [JavaNext Language Features](https://inside.java/2026/06/07/java-next-language-features)

## Araçlar ve Kütüphaneler

- [Spring Framework `7.0.8` / `6.2.19`](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now/): Bugünün en yüksek karar etkisine sahip release kümesi.
- [Micrometer `1.17.0`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0), [`1.16.6`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.16.6), [`1.15.12`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.15.12): Security-driven observability bakım hattı.
- [Spring LDAP `4.1.0`](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06/): güvenlik fix’ine ek olarak `LdapClient` arama API iyileştirmeleri ve dependency davranış değişimi getiriyor.
- [Spring HATEOAS `3.1 GA`](https://spring.io/blog/2026/06/08/spring-hateoas-3-1-GA-3-0-7-and-2-5-3-released/): güvenlik fix’iyle birlikte aktif GA çizgisi.
- [Spring Retry `2.0.13`](https://spring.io/blog/2026/06/08/spring-retry-2/): dar ama önemli bir servis katmanı hardening sürümü.
- Düşük öncelik: [Oracle Java Extension for Visual Studio Code `26.0.0`](https://inside.java/2026/06/08/java-vscode-extension-update) artık VS Code variables, run configuration settings, extension-level formatter ayarları ve Maven `settings.xml` yolu desteği veriyor.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Framework 6.2.x` OSS hattındaysanız, bugünkü aksiyon yalnız `6.2.19` almak değil; `7.0.x` geçiş işini sprint backlog’una somut olarak koymak.
- Spring web katmanında kullanıcıdan gelen URL parse/validation akışlarını `UriComponentsBuilder` kullanımına göre tarayın.
- Güvenilmeyen SpEL ifadesi kabul eden herhangi bir katman varsa bunu normal bug değil, güvenlik tasarım hatası gibi ele alın.
- Metrics/observation katmanını dependency tree’de görünür hale getirin; özellikle server HTTP ve gRPC instrumentation kullanan servislerde Micrometer sürümü doğrulansın.
- LDAP ile authentication yapıyorsanız boş parola davranışı için otomatik test ekleyin; bu hata prod konfigürasyon farklarında sessizce açılabilir.
- Hypermedia medya tipleri aktifse yalnız outbound serialization’a bakmayın; inbound `RepresentationModel` bağlamasını da tehdit modeline dahil edin.
- `@Retryable(stateful=true)` kullanan servisler, Reactor retry kullanan servislerle aynı risk sınıfında değil. Önceliklendirmeyi bu ayrım üzerinden yapın.

## Fırsatlar ve Riskler

- Fırsat: Bu patch haftasını kullanıp Spring uygulamalarında “tehlikeli ama görünmez” yüzey envanteri çıkarmak
- Fırsat: Observability bağımlılıklarını ilk kez gerçek governance kapsamına almak
- Fırsat: `6.2.x` üstünde ertelenen `7.0.x` geçişini güvenlik gerekçesiyle hızlandırmak
- Risk: Yalnız framework patch’ine odaklanıp Micrometer, HATEOAS, LDAP veya Retry açıklarını kaçırmak
- Risk: `6.2.19`’u rutin service release sanıp branch kapanış sinyalini görmezden gelmek
- Risk: `spring-ldap-core` içinden transitif gelen `spring-data-commons` varsayımının `4.1.0` ile sessizce kırılması
- Risk: Stateful retry kullanımını envantere çıkarmadan CVE-2026-41710’u “bize uygulanmaz” diye geçmek

## İzlenmesi Gereken Konular

- Spring Boot service release’lerinin ve BOM’larının bu yeni Framework/Micrometer/HATEOAS/LDAP seviyelerini ne hızla içine alacağı
- 8-14 Haziran 2026 güvenlik haftasında Spring Security, Spring Cloud veya başka portföy modüllerinden yeni advisory gelip gelmeyeceği
- `Spring Framework 6.2.x` sonrası OSS kullanıcıları için resmi yönlendirme ve `7.0.x` göç mesajlarının sertleşip sertleşmeyeceği
- Micrometer `1.17.x` hattının Spring Boot tarafında ne zaman daha yaygın default haline geleceği
- Oracle Java Blog veya Inside Java tarafında bu hafta yeni bir JDK update / quality heads-up çıkıp çıkmayacağı; 9 Haziran 2026 sabahı itibarıyla yeni bir runtime release post’u görünmüyor

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Framework `7.0.8` ve `6.2.19`, güvenlik rollup’ını OSS branch geçiş baskısına dönüştürdü
- source: [Spring Framework `7.0.8` and `6.2.19` Available Now](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now/), [CVE-2026-41854](https://spring.io/security/cve-2026-41854/), [CVE-2026-41852](https://spring.io/security/cve-2026-41852/)
- author: Rossen Stoyanchev; Spring Security Advisory Team
- date: 8 Haziran 2026
- category: security, framework-core, branch-transition
- tags: spring-framework, spring-mvc, webflux, spel, ssrf, 6-2-x, 7-0-x
- summary: Framework release’i 18 CVE ile geldi ve `6.2.19` için muhtemel son OSS `6.2.x` sürümü uyarısı yapıldı. Bu, patch’i doğrudan branch-strategy kararı haline getiriyor.
- why_it_matters: Güvenlik açığı kapatmanın ötesinde, kısa ömürlü bir OSS bakım hattında kalmanın maliyeti görünür hale geldi.
- java_spring_relevance: Spring MVC ve WebFlux kullanan bütün ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: `7.0.x` geçişini kurumsal olarak planlamak, SpEL ve URL parse akışlarını aynı anda sertleştirmek.
- risks: Seçici CVE yorumu yapıp geniş yüzeyli release’i eksik almak; `6.2.x` üstünde gereğinden uzun kalmak.
- migration_notes: OSS kullanıcıları için asgari hedef `6.2.19`; fakat pratikte `7.0.x` yol haritası açılmalı. `UriComponentsBuilder` ve untrusted SpEL kullanan akışlar ayrı test edilmelidir.

### Bulgu 2

- title: Micrometer `1.16.6` ve `1.15.12`, observability katmanını aktif güvenlik bakım alanına taşıdı
- source: [CVE-2026-40983](https://spring.io/security/cve-2026-40983/), [CVE-2026-40984](https://spring.io/security/cve-2026-40984/), [Micrometer `1.16.6`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.16.6), [Micrometer `1.15.12`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.15.12), [Micrometer `1.17.0`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0)
- author: Spring Security Advisory Team; Micrometer maintainers
- date: 8 Haziran 2026
- category: observability, security, metrics, instrumentation
- tags: micrometer, observationregistry, grpc, http-server, jetty11, jetty12, dos
- summary: gRPC ve HTTP server instrumentation için DoS riskleri yayımlandı; fix seviyeleri `1.16.6` ve `1.15.12`. Aynı gün `1.17.0` GA oldu.
- why_it_matters: Metrics katmanı pasif telemetri değil; attacker-controlled request yüzeyi ile kaynak tüketimine açık bir runtime bileşeni.
- java_spring_relevance: Spring Boot + Micrometer kullanan hemen her üretim servisi için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Observability bağımlılıklarını ilk sınıf patch yönetimi kapsamına almak.
- risks: Framework sürümünü güncelleyip Micrometer fix seviyesini kaçırmak; gRPC ve HTTP instrumentasyonlarını güvenli varsaymak.
- migration_notes: Efektif BOM sonucu hangi Micrometer sürümünü aldığınız doğrulanmalı. Server metrics aktif servisler `1.16.6` veya `1.15.12` fix seviyesine çekilmelidir; yeni hat açılacaksa `1.17.0` ayrıca değerlendirilmelidir.

### Bulgu 3

- title: Spring LDAP boş parola bypass fix’i ile geldi; `4.1.0` aynı anda dependency davranışını değiştirdi
- source: [Spring LDAP 2026.06 Releases - Contains CVE Fix](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06/), [CVE-2026-41720](https://spring.io/security/cve-2026-41720/), [What’s New in Spring LDAP 4.1](https://docs.spring.io/spring-ldap/reference/4.1/whats-new.html)
- author: Josh Cummings; Spring Security Advisory Team
- date: 8 Haziran 2026
- category: identity, security, ldap, dependency-management
- tags: spring-ldap, ldapclient, authentication, empty-password, spring-data-commons, 4-1-0
- summary: Boş parola ile LDAP bind bypass riski kapatıldı; OSS fix sürümleri `3.3.8` ve `4.0.4`. `4.1.0` ayrıca `spring-data-commons` transitif bağımlılık varsayımını kaldırıyor ve `LdapClient` arama API’sini genişletiyor.
- why_it_matters: Kimlik doğrulama yüzeyi ile build-time dependency davranışı aynı release içinde değişti; güvenlik ve geçiş işi birlikte gelmiş oldu.
- java_spring_relevance: LDAP/AD entegrasyonu olan kurumsal Spring ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: LDAP auth test kapsamını iyileştirmek ve `LdapClient` API modernizasyonunu güvenlik upgrade’iyle birlikte yapmak.
- risks: Empty password bind senaryosunu kaçırmak; `4.1.0` geçişinde eksik explicit dependency nedeniyle build/runtime kırılması yaşamak.
- migration_notes: `3.3.x` için `3.3.8`, `4.0.x` için `4.0.4` asgari fix seviyesidir. `4.1.0` denenirse `spring-data-commons` explicit tanımı kontrol edilmelidir.

### Bulgu 4

- title: Spring HATEOAS release’i inbound hypermedia uçlarını daha riskli gösterdi
- source: [Spring HATEOAS `3.1 GA`, `3.0.7`, and `2.5.3` released](https://spring.io/blog/2026/06/08/spring-hateoas-3-1-GA-3-0-7-and-2-5-3-released/), [CVE-2026-41006](https://spring.io/security/cve-2026-41006/), [CVE-2026-41007](https://spring.io/security/cve-2026-41007/)
- author: Oliver Drotbohm; Spring Security Advisory Team
- date: Advisory tarihi 2 Haziran 2026, fix release tarihi 8 Haziran 2026
- category: hypermedia, deserialization, caching, web-security
- tags: spring-hateoas, collection-json, uber, representationmodel, entitymodel, deserialization, cache
- summary: Collection+JSON/UBER deserializer’larının Jackson erişim kısıtlarını atlaması ve attacker-supplied link relation string’leri için unbounded cache tutulması iki ayrı yüksek risk oluşturdu.
- why_it_matters: HATEOAS çoğu ekipte düşük görünürlüklü bir modül; bu da inbound hypermedia risklerinin üretimde sessizce kalmasına yol açabilir.
- java_spring_relevance: Hypermedia destekli REST API’ler ve `RepresentationModel` tabanlı giriş nesneleri kullanan Spring uygulamaları için yüksek.
- actionability: hemen_aksiyon
- impact_level: orta-yüksek
- opportunities: Kullanılmayan media type’ları kapatmak ve inbound hypermedia yüzeyini daraltmak.
- risks: Reflection tabanlı istenmeyen property binding veya hafıza tüketimi ile DoS yaşamak.
- migration_notes: OSS hat için `2.5.3` ve `3.0.7` fix seviyeleri alınmalı; `3.1 GA` yeni ana hat olarak ayrı değerlendirilmelidir. COLLECTION_JSON ve UBER desteği gerçekten gerekmiyorsa kapatılmalıdır.

### Bulgu 5

- title: Spring Retry `2.0.13`, dar kapsamlı ama operasyonel olarak pahalı stateful retry açığını kapattı
- source: [Spring Retry `2.0.13` available now](https://spring.io/blog/2026/06/08/spring-retry-2/), [CVE-2026-41710](https://spring.io/security/cve-2026-41710/)
- author: Stéphane Nicoll; Spring Security Advisory Team
- date: 8 Haziran 2026
- category: resilience, retry, security, cache-behavior
- tags: spring-retry, stateful-retry, retryable, dos, cache-exhaustion
- summary: Uygulama genelindeki stateful retry cache, attacker-controlled unique failing key’lerle doldurulup kalıcı olarak işlevsiz bırakılabiliyor. Stateless retry etkilenmiyor.
- why_it_matters: Retry kullanımı yaygın; fakat hangi retry modelinin açık olduğunu bilmeyen ekipler yanlış önceliklendirme yapabilir.
- java_spring_relevance: Özellikle imperative servis katmanında stateful Spring Retry kullanan ekipler için yüksek.
- actionability: hemen_aksiyon
- impact_level: orta-yüksek
- opportunities: Stateful retry kullanımını envantere çıkarıp gereksizse stateless veya Reactor tabanlı modellere dönmek.
- risks: Retry cache’in dolmasıyla circuit-breaker benzeri akışların topluca bozulması.
- migration_notes: `2.0.x` hattı için `2.0.13` alınmalı. Önce `@Retryable(stateful=true)` kullanımı ve default key generator’ın attacker-controlled argümanlarla çalışıp çalışmadığı doğrulanmalıdır.

### Bulgu 6

- title: Oracle Java Extension for VS Code `26.0.0`, günlük Java tarafında düşük öncelikli ama net bir DX güncellemesi
- source: [Oracle Java Extension for Visual Studio Code Version `26.0.0` Is Now Available](https://inside.java/2026/06/08/java-vscode-extension-update), [Oracle Java Blog](https://blogs.oracle.com/java/)
- author: Arvind Aprameya; Oracle Java Blog editoryal yüzeyi
- date: 8 Haziran 2026 ve 9 Haziran 2026 görünümü
- category: developer-productivity, tooling, ide
- tags: vscode, java-extension, netbeans-29, maven, formatter, run-config
- summary: VS Code Java eklentisi artık extension-level formatter ayarları, run configuration settings, JDK Home ve Maven `settings.xml` yolu desteği veriyor. 9 Haziran 2026 sabahı itibarıyla Oracle Java Blog’da bundan daha taze bir runtime/security duyurusu görünmüyor.
- why_it_matters: Geliştirici deneyimini iyileştirir; fakat bugünün üretim önceliğini belirleyen konu bu değil.
- java_spring_relevance: VS Code kullanan Java ekipleri için faydalı, production mimari kararı için düşük öncelikli.
- actionability: bilgi
- impact_level: düşük
- opportunities: IDE standardizasyonu ve ekip içi run-config paylaşımı.
- risks: Anlamlı bir üretim riski yok; sadece yanlış önceliklendirme riski var.
- migration_notes: İsteyen ekipler eklentiyi pilotlayabilir; ancak bugünkü asıl iş dependency patching olduğu için hemen rollout zorunlu değildir.

## Sonuç

9 Haziran 2026 için en güçlü sinyal, Spring ekosisteminde güvenlik baskısının artık soyut bir uyarı olmaktan çıkıp somut ve çok katmanlı release dalgasına dönüşmüş olması. Bugünün en önemli teknik kararı, yalnız Spring Framework patch’ini almak değil; aynı anda Micrometer, LDAP, HATEOAS ve Retry gibi kenarda görünen ama üretimde gerçek risk taşıyan modülleri de sürüm yönetişimine dahil etmek. OSS tarafta `6.2.x` için kapanış eşiği görünmüş durumda; bu yüzden kısa vadeli patch ve orta vadeli `7.0.x` geçişi artık tek bir mühendislik gündemi olarak ele alınmalı.
