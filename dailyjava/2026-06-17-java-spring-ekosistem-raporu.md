# Günlük Java / Spring Ekosistem Raporu

Tarih: 17 Haziran 2026  
Tarama zamanı: 17 Haziran 2026 09:06 TSİ  
Odak: Spring çekirdek web katmanında support sınırı ve davranış değişiklikleri, kimlik ve yardımcı kütüphanelerde güvenlik baskısı, Spring-aware araç zinciri ve JDK 27 operasyon sözleşmeleri

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security/), Spring Framework / Authorization Server / Session / REST Docs / LDAP / Retry / Tools / Shell release yazıları ve changelog bağlantıları, [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung Java Weekly 649](https://www.baeldung.com/java-weekly-649) ve [650](https://www.baeldung.com/java-weekly-650), Josh Long'un [This Week in Spring - 9 Haziran 2026](https://spring.io/blog/2026/06/09/this-week-in-spring-june-9-2026) ve [16 Haziran 2026](https://spring.io/blog/2026/06/16/this-week-in-spring-june-16-2026) yazıları, Gunnar Morling'in [morling.dev](https://www.morling.dev/) akışı ve [Burak KUTBAY blog feed'i](https://blog.burakkutbay.com/feed/) kontrol edildi. 17 Haziran 2026 sabahı itibarıyla Oracle Java Blog, InfoQ Java, Baeldung, Gunnar Morling ve Burak KUTBAY tarafında resmi Spring release/advisory hattından daha güçlü ve daha yeni bir karar sinyali görünmüyor; bu yüzden rapor release note, advisory ve changelog eksenini merkeze alıyor.

## Öne Çıkan Başlıklar

- [Spring Framework 7.0.8 ve 6.2.19](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now), web katmanı, SpEL, static resource, multipart ve URL parsing yüzeyine yayılan geniş bir güvenlik paketiyle geldi; ayrıca `6.2.19`, `6.2.x` hattının muhtemel son OSS sürümü olarak işaretlendi.
- [Spring Authorization Server 1.5.8](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06) ve [Spring LDAP 3.3.8 / 4.0.4 / 4.1.0](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06), kimlik sınırında iki farklı ama kritik güven varsayımını düzeltiyor: `request_uri` redirect doğrulaması ve boş parola ile LDAP bind.
- [Spring Retry 2.0.13](https://spring.io/blog/2026/06/08/spring-retry-2) ile [Spring REST Docs 3.0.6 / 4.0.1](https://spring.io/blog/2026/06/09/spring-restdocs-3), "yardımcı" görülen retry ve dokümantasyon/test kütüphanelerinin de üretim risk yüzeyine dahil olduğunu hatırlatıyor.
- [Spring Tools 5.2.0](https://spring.io/blog/2026/06/15/spring-tools-5-2-0-released), Spring'e özel embedded MCP, Spring AI validation ve type-safe property refactor akışını IDE/agent düzeyine taşıyor; bu, genel amaçlı AI yardımcısından domain-aware Spring yardımcısına geçiş sinyali.
- [JDK 27 JSON thread dump formatı](https://inside.java/2026/05/20/quality-heads-up/), `tid`, `threadCount` ve `processId` alanlarını string yerine sayısal tipte yazıyor ve `formatVersion: 2` ekliyor; thread dump parse eden tüm araçlar yeniden test edilmeli.

## Kritik Güncellemeler

### 1. Spring Framework 7.0.8 / 6.2.19: patch seviyesi değil, support hattı kararı

[Spring Framework 7.0.8 ve 6.2.19](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now), tek bir CVE ile sınırlı olmayan, çekirdek web katmanına yayılan bir düzeltme paketi yayımladı. Öne çıkan pratik etkiler:

- Static resource cache senaryosunda, farklı resource handler'lar arasında ortak cache kullanılıyorsa, korumalı kaynağa yanlışlıkla erişim açılabiliyor.
- Kullanıcı kontrollü SpEL değerlendiren uygulamalarda artık işlem sayısı sınırı devreye giriyor; fix sonrası `SpelEvaluationException (EL1085E)` davranışı görülebilir.
- `UriComponentsBuilder` ile dış URL doğrulayan kodlarda host parsing hatası nedeniyle SSRF riski bulunuyor.
- Multipart kabul eden ve WAF/proxy arkasında çalışan Spring MVC/WebFlux uygulamalarında multipart smuggling ile dış katman kontrolleri atlatılabiliyor.

Asıl kritik nokta sürüm stratejisinde:

- `7.0.x` için `7.0.8` OSS fix.
- `6.2.x` için `6.2.19` OSS fix.
- `6.1.x` ve `5.3.x` fix'leri artık commercial hatta kaldı.
- Spring ekibi `6.2.19` için "muhtemel son OSS release" ifadesini açıkça kullandı.

Bu, `Framework 6.2 + Boot 4.0` veya daha eski support çizgisinde kalan ekiplerin, yalnız patch değil release line kararı vermesi gerektiği anlamına geliyor.

### 2. Kimlik sınırı: Authorization Server ve LDAP aynı anda yanlış güven varsayımlarını daraltıyor

[Spring Authorization Server 1.5.8](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06), `request_uri` parametresinin yetersiz doğrulanması nedeniyle ortaya çıkan open redirect açığını kapatıyor. Advisory tarafındaki kritik ayrıntı şu: saldırgan, geçersiz bir `request_uri` ile birlikte doğrulanmamış bir `redirect_uri` enjekte edebiliyor. Bu doğrudan login ve consent akışına dokunuyor.

Aynı eksende [Spring LDAP 3.3.8 / 4.0.4 / 4.1.0](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06), boş veya null parola ile yapılan bind'i reddetmeyen authentication strategy davranışını düzeltiyor. Advisory, `AbstractContextSource`, `LdapTemplate` ve `LdapClient` kullanan akışların etkilendiğini açıkça söylüyor.

Buradaki mühendislik sonucu:

- Kimlik altyapısında "framework bizim yerimize bunu zaten doğru yapıyordur" varsayımı zayıfladı.
- Authorization Server `1.3.x` ve `1.4.x` OSS destek dışı; fix'ler commercial artifact hattına kayıyor.
- LDAP tarafında da `2.4.x` ve `3.2.x` destek dışı; eski hatlarda kalmak güvenlik borcu.

Özellikle kurumsal SSO, custom OAuth/OIDC provider, şirket içi LDAP/AD entegrasyonları olan ekipler için bu başlıklar acil.

### 3. Retry ve dokümantasyon/test zinciri artık üretim saldırı yüzeyi

[Spring Retry 2.0.13](https://spring.io/blog/2026/06/08/spring-retry-2) tarafında problem, yalnız retry başarısızlığı değil; `@Retryable(stateful=true)` kullanan uygulamalarda stateful retry cache'inin saldırgan kontrollü anahtarlarla kalıcı biçimde doldurulabilmesi. Advisory'nin önemli ayrımı şu:

- Stateless retry default davranış ve etkilenmiyor.
- Stateful retry açıkça kullanılıyorsa,
- Anahtarlar request argümanlarından türetiliyorsa,
- Ve saldırgan her isteği başarısız bırakıp tekrar ettirmiyorsa,

cache dolduktan sonra tüm sonraki stateful retry ve circuit breaker akışları başarısız olabiliyor.

[Spring REST Docs 3.0.6 ve 4.0.1](https://spring.io/blog/2026/06/09/spring-restdocs-3) ise daha sinsi bir riski kapatıyor: uzak bir API'yi HTTP üzerinden dokümante ederken, ele geçirilmiş veya kötü niyetli bir endpoint'in döndürdüğü XML içerik, sonraki dokümantasyon test çalıştırmasında XXE tetikleyebiliyor.

Mesaj net:

- Retry policy kodu da güvenlik kodudur.
- Test ve dokümantasyon pipeline'ı da güvenilmez input işler.
- "Bu sadece CI'da çalışıyor" savunması artık zayıf.

### 4. Spring Tools 5.2.0 ve Spring Shell 4.0.3: geliştirici verimi artık framework bilgisi üzerinden artıyor

[Spring Tools 5.2.0](https://spring.io/blog/2026/06/15/spring-tools-5-2-0-released), bugünkü en ilginç üretkenlik sinyallerinden biri:

- Claude Code için deneysel plugin
- embedded MCP server ile Spring'e özel statik analiz, problem/fix ve indexing bilgisi
- Spring AI projeleri için validation ve indexing
- şirket içi veya ticari Maven repository'lerini dikkate alabilen sürüm doğrulama
- Spring Data'nın type-safe property referanslarına refactor desteği

Bu, "LLM editör eklentisi" seviyesinden daha ileri bir şey: tool, Spring semantiğini modelin önüne kontrollü olarak koymaya başlıyor.

[Spring Shell 4.0.3](https://github.com/spring-projects/spring-shell/releases/tag/v4.0.3) ise daha operasyonel bir hat düzeltmesi:

- JDK 25 sonrası bozulan tab completion düzeltildi
- DevTools auto-reload desteği eklendi
- native compilation için eksik runtime hints tamamlandı
- argüman autocomplete ve help çıktısı iyileştirildi

İç araç, admin CLI ve platform otomasyonu yazan ekipler için küçük görünen ama geliştirici akışını net iyileştiren bir paket.

### 5. JDK 27 thread dump formatı: observability tooling sessizce kırılabilir

[Inside Java'nın JDK 27 heads-up yazısı](https://inside.java/2026/05/20/quality-heads-up/) ve [JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/) birlikte okunduğunda bugünün en pratik JVM sinyali şu:

- JSON thread dump'larda `processId`, `tid` ve `threadCount` artık string değil numeric.
- Yeni çıktı `formatVersion: 2` taşıyor.
- OpenJDK ekibi özellikle bu dosyaları parse eden araç, script ve testlerin JDK 27 EA ile doğrulanmasını istiyor.

Eğer kurum içinde thread dump JSON'unu ingest eden bir parser, log enrichment script'i, SIEM dönüştürücüsü veya incident otomasyonu varsa, bu kırılma ancak prod benzeri testte yakalanır.

## Trendler ve Sinyaller

### Trend Kümesi 1: AI kaynaklı güvenlik baskısı release ritmini değiştiriyor

Josh Long'un 9 Haziran notunda Spring topluluğundan Broadcom'a gelen aylık güvenlik advisory sayısının Mart'tan Nisan'a `%1700`'den fazla arttığı açıkça söyleniyor. 16 Haziran notunda ise Mayıs release train'inin gecikmesinin nedeninin AI-driven CVE dalgası olduğu tekrar vurgulanıyor.

Çıkarım:

- Spring upgrade pencerelerini "aylık düzenli patch" mantığıyla değil, yoğun advisory dönemlerine göre daha çevik planlamak gerekebilir.
- SAST/LLM destekli zafiyet bulma hacmi yükseldikçe, küçük yardımcı modüller de aynı sertlikte taranacak.

### Trend Kümesi 2: Support boundary artık doğrudan güvenlik mimarisi konusu

Tekrarlayan örnekler:

- Framework `6.2.x` son OSS çizgisine yaklaştı.
- Authorization Server `1.3.x` ve `1.4.x` OSS dışına çıktı.
- LDAP `2.4.x` ve `3.2.x` support dışı.

Çıkarım:

- "Kod çalışıyor, o halde bekleyelim" yaklaşımı artık teknik değil finansal bir karar da içeriyor.
- Release line seçimi, güvenlik patch erişimini belirliyor.

### Trend Kümesi 3: Güvenlik düzeltmeleri yalnız runtime request path'inde değil

Tekrarlayan alanlar:

- Retry cache
- dokümantasyon testleri
- static resource cache
- multipart WAF/proxy etkileşimi
- URL validation yardımcı API'leri

Çıkarım:

- Yardımcı framework bileşenleri artık "periferik" değil.
- Test kodu, build pipeline ve araç betikleri de güvenlik incelemesine dahil edilmeli.

### Trend Kümesi 4: Spring ekosistemi AI'ı genel değil, domain-aware hale getiriyor

Tekrarlayan sinyal:

- Spring Tools embedded MCP
- Spring AI proje validation/indexing
- type-safe property refactor akışının araç düzeyine taşınması

Çıkarım:

- Kalıcı verim artışı, genel chat penceresinden çok framework'e özel semantic assistance ile gelecek.

### Gürültü mü, kalıcı değer mi?

- Çok yüksek kalıcı değer: Spring Framework `7.0.8/6.2.19`, Authorization Server `1.5.8`, LDAP boş parola bind fix'i
- Yüksek kalıcı değer: Spring Retry `2.0.13`, REST Docs `3.0.6/4.0.1`, JDK 27 JSON thread dump formatı
- Orta-yüksek kalıcı değer: Spring Tools `5.2.0` embedded MCP yönü
- Düşük öncelik: Spring Session `4.1.0/4.0.4/3.5.7` bug fix + dependency convergence; güçlü fonksiyonel sıçrama sinyali zayıf

## Araçlar ve Kütüphaneler

- [Spring Tools 5.2.0](https://spring.io/blog/2026/06/15/spring-tools-5-2-0-released): Bugünün en güçlü tooling sinyali. Spring-specific MCP, Spring AI validation, repo-aware version validation ve type-safe property refactor desteği gerçek ekip verimine dokunuyor.
- [Spring Shell 4.0.3 ve 3.4.3](https://spring.io/blog/2026/06/11/spring-shell-4-0-3-and-3-4-3-are-out): İç CLI'lar ve native binary üretimi için anlamlı bug fix paketi. JDK 25 tab completion ve native hints düzeltmeleri pratik.
- [Spring Session 4.1.0 / 4.0.4 / 3.5.7](https://spring.io/blog/2026/06/09/spring-session-releases-2026-06): Düşük öncelik. Büyük özellik sıçraması yok; fakat [4.1.0 release body](https://github.com/spring-projects/spring-session/releases/tag/4.1.0), Security `7.1.0`, Framework `7.0.8`, Data `2025.1.6` ve Reactor `2025.0.6` hizasını gösteriyor. Session store kullanan ekipler için iyi bir bakım tabanı.
- Bugün Spring dışı tarafta, Java/Spring backend ekibinin kısa vadeli mimari kararını doğrudan değiştirecek yeni bir OSS araç dalgası görünmüyor. Gözlenen ana hareket, mevcut ekosistemin sertleşmesi ve araçların daha Spring-aware hale gelmesi.

## Java / Spring Geliştiricileri İçin Etkiler

- `spring-webmvc`, `spring-webflux` veya doğrudan Framework `6.2.x` / `7.0.x` kullanan servislerde static resource handler, multipart kabulü, `UriComponentsBuilder` doğrulaması ve user-controlled SpEL kullanımı taranmalı.
- `Framework 6.2.x` üzerinde kalan ekipler, `6.2.19` sonrası yol haritasını netleştirmeli; bu hat uzun süreli güvenli OSS zemin olmayabilir.
- Spring Authorization Server kullanan ekipler `request_uri` akışını ve custom redirect doğrulamalarını yeniden test etmeli.
- LDAP bind kullanan ekipler boş/null parola ile gelen login akışını negatif test setine eklemeli; `LdapTemplate` veya `LdapClient` kullanımı özellikle taranmalı.
- `@Retryable(stateful=true)` kullanan kod tabanlarında anahtar üretimi ve cache ömrü gözden geçirilmeli; internetten gelen argümanlara dayanan stateful retry yüksek riskli.
- REST Docs ile uzaktaki API'leri dokümante eden testler güvenilmeyen XML input işliyormuş gibi ele alınmalı.
- Thread dump JSON parse eden araçlar JDK 27 EA üstünde doğrulanmalı; string varsayımı yapan parser'lar sessizce bozulabilir.
- Spring Tools 5.2.0, özellikle büyük monorepo veya şirket içi Maven repository kullanan ekiplerde yükseltme ve refactor maliyetini düşürebilir.

## Fırsatlar ve Riskler

- Fırsat: Spring Tools `5.2.0` ile type-safe property refactor ve Spring-aware validation akışını standart IDE deneyimine taşımak.
- Fırsat: Framework `7.0.x` geçişini yalnız security patch olarak değil, eski helper API ve validation varsayımlarını sadeleştirme fırsatı olarak kullanmak.
- Fırsat: JDK 27 geçişi öncesi observability parser envanterini çıkarıp thread dump otomasyonlarını sözleşme bazlı hale getirmek.
- Risk: `6.1.x`, `5.3.x`, `Authorization Server 1.3/1.4`, `LDAP 2.4/3.2` gibi support dışı hatlarda kalıp enterprise-only fix duvarına çarpmak.
- Risk: Stateful retry'i resilience pattern'i sanıp cache dolum vektörünü gözden kaçırmak.
- Risk: REST Docs ve test pipeline'ını "prod dışı" sayıp uzak XML input riskini hafife almak.
- Risk: `UriComponentsBuilder` ve user-controlled SpEL kullanımını business logic detayı sanıp Framework advisory'lerini tam uygulama yüzeyine yaymamak.

## İzlenmesi Gereken Konular

- Spring Framework `6.2.x -> 7.0.x` geçişinde topluluk kaynaklı migration notları ve olası follow-up patch'ler
- AI-driven CVE yoğunluğunun Spring release takvimine etkisinin kalıcı olup olmayacağı
- Spring Tools embedded MCP/Claude Code entegrasyonunun erken erişimden stabil kurumsal kullanıma ne kadar hızlı taşınacağı
- Spring Session ve diğer yardımcı modüllerin Security `7.1.x` / Framework `7.0.x` hattında ne kadar hızlı sıklaşacağı
- JDK 27 EA sürecinde thread dump JSON değişiminin APM, SIEM ve incident araçlarında yarattığı uyum sorunları

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Framework 7.0.8 ve 6.2.19, çekirdek web ve SpEL yüzeyinde geniş sertleşme getirirken `6.2.x` için OSS çıkış sinyali verdi
- source: [Spring Framework 7.0.8 and 6.2.19 Available Now](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now), [CVE-2026-41841](https://spring.io/security/cve-2026-41841), [CVE-2026-41850](https://spring.io/security/cve-2026-41850), [CVE-2026-41853](https://spring.io/security/cve-2026-41853), [CVE-2026-41854](https://spring.io/security/cve-2026-41854)
- author: Rossen Stoyanchev; Spring Security Advisory Team
- date: 8 Haziran 2026
- category: framework, security, compatibility, support-policy
- tags: spring-framework, webmvc, webflux, spel, multipart, uricomponentsbuilder, last-oss
- summary: `7.0.8` ve `6.2.19`, static resource cache, multipart request smuggling, SpEL DoS, SSRF ve daha birçok açığı kapatıyor. Spring ekibi ayrıca `6.2.19` için "muhtemel son OSS release" notunu düşüyor.
- why_it_matters: Bu artık tekil patch değil; framework line seçimi, güvenlik ve support erişimi kararına dönüştü.
- java_spring_relevance: Spring MVC/WebFlux ve SpEL kullanan tüm backend ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Framework `7.0.x` geçişiyle eski validation ve helper varsayımlarını temizlemek.
- risks: `6.2.x` veya daha eski ticari hatlarda kalıp sonraki fix'leri kaçırmak; user-controlled SpEL ve URL doğrulamasını gözden kaçırmak.
- migration_notes: Static resource handler, shared cache, multipart proxy/WAF, `UriComponentsBuilder` ve user-controlled SpEL kullanımını tarayın; `6.2.x` sonrası hedef hattı belirleyin.

### Bulgu 2

- title: Spring Authorization Server 1.5.8, `request_uri` doğrulamasındaki açık nedeniyle auth redirect sınırını yeniden çiziyor
- source: [Spring Authorization Server 2026.06 Releases](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06), [CVE-2026-41008](https://spring.io/security/cve-2026-41008)
- author: Joe Grandja; Spring Security Advisory Team
- date: 9 Haziran 2026
- category: identity, security, oauth2, support-policy
- tags: authorization-server, request-uri, redirect-uri, oidc, support-line
- summary: Authorization endpoint, geçersiz `request_uri` ile birlikte doğrulanmamış `redirect_uri` kabul ederek open redirect yaratabiliyordu. OSS fix `1.5.8`; `1.3.x` ve `1.4.x` için destek ticari hatta kaymış durumda.
- why_it_matters: Kimlik giriş ve consent akışları dış dünyaya açık olduğu için düşük öncelikli görünen redirect sorunları burada pratik phishing ve login akışı suistimaline dönüşür.
- java_spring_relevance: Spring Authorization Server veya custom OAuth/OIDC provider işleten ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Redirect doğrulama ve auth request test matrisini sadeleştirip merkezi hale getirmek.
- risks: Eski OSS kuşaklarında kalmak; custom `request_uri`/`redirect_uri` mantığını framework fix'iyle uyumsuz bırakmak.
- migration_notes: `1.5.8`'e geçin; eski kuşaklarda commercial artifact bağımlılığını görünür şekilde belgeleyin; negatif auth-flow testleri ekleyin.

### Bulgu 3

- title: Spring LDAP boş parola bind'ini kapattı; kurumsal dizin entegrasyonlarında sessiz auth bypass riski vardı
- source: [Spring LDAP 2026.06 Releases](https://spring.io/blog/2026/06/08/spring-ldap-releases-2026-06), [CVE-2026-41720](https://spring.io/security/cve-2026-41720)
- author: Josh Cummings; Spring Security Advisory Team
- date: 8 Haziran 2026
- category: identity, security, ldap, authentication
- tags: spring-ldap, empty-password, bind, ldaptemplate, ldapclient, abstractcontextsource
- summary: `DirContextAuthenticationStrategy`, boş veya null parola ile yapılan bind'i reddetmiyordu. LDAP sunucusu unauthenticated bind'e izin veriyorsa geçerli kullanıcı adıyla parola doğrulaması atlanabiliyordu.
- why_it_matters: Kurumsal LDAP/AD entegrasyonlarında bug, sadece edge-case değil gerçek auth bypass sınıfı.
- java_spring_relevance: LDAP/AD ile kimlik doğrulayan Spring uygulamaları için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: LDAP login akışlarını daha net negatif testlerle standartlaştırmak.
- risks: `AbstractContextSource`, `LdapTemplate` veya `LdapClient` kullanan uygulamalarda boş parola senaryosunu kaçırmak; support dışı hatlarda kalmak.
- migration_notes: `3.3.8` veya `4.0.4+` seviyesine çıkın; boş parola testlerini regression suite'e ekleyin; eski `2.4.x/3.2.x` hatları için enterprise kararı verin.

### Bulgu 4

- title: Spring Retry 2.0.13 ve REST Docs 3.0.6/4.0.1, yardımcı kütüphanelerin de doğrudan saldırı yüzeyi olduğunu gösteriyor
- source: [Spring Retry 2.0.13](https://spring.io/blog/2026/06/08/spring-retry-2), [CVE-2026-41710](https://spring.io/security/cve-2026-41710), [Spring REST Docs 3.0.6](https://spring.io/blog/2026/06/09/spring-restdocs-3), [CVE-2026-40991](https://spring.io/security/cve-2026-40991)
- author: Stephane Nicoll; Andy Wilkinson; Spring Security Advisory Team
- date: 8-9 Haziran 2026
- category: resilience, testing, security, ci-cd
- tags: spring-retry, stateful-retry, cache-exhaustion, spring-restdocs, xxe, ci
- summary: Stateful retry cache'i saldırgan kontrollü anahtarlarla kalıcı biçimde doldurulabiliyor; REST Docs ise uzak HTTP API'den gelen kötü niyetli XML'i dokümantasyon testinde XXE'ye dönüştürebiliyor.
- why_it_matters: Retry ve test/dokümantasyon kodu genelde güvenlik incelemesinin dışında kalıyor; bu dalga tam tersini gösteriyor.
- java_spring_relevance: `@Retryable(stateful=true)` kullanan servisler ve REST Docs tabanlı contract/doc testleri olan ekipler için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Stateful retry kullanımını daraltmak; CI dokümantasyon işlerini güvenilmeyen input modeliyle yeniden tasarlamak.
- risks: Cache dolumu nedeniyle resilience katmanının çökmesi; uzak API yanıtlarını güvenli sanan test pipeline'larının XXE ile zehirlenmesi.
- migration_notes: Spring Retry `2.0.13` ve REST Docs `3.0.6/4.0.1` seviyelerine çıkın; stateful retry anahtar üretimini inceleyin; remote API dokümantasyon testlerini sandbox/güvenilmez input modeliyle değerlendirin.

### Bulgu 5

- title: Spring Tools 5.2.0 ve Spring Shell 4.0.3, Spring-aware geliştirici araç zincirini olgunlaştırıyor
- source: [Spring Tools 5.2.0 released](https://spring.io/blog/2026/06/15/spring-tools-5-2-0-released), [Spring Shell 4.0.3 and 3.4.3 are out!](https://spring.io/blog/2026/06/11/spring-shell-4-0-3-and-3-4-3-are-out), [Spring Shell 4.0.3 GitHub Release](https://github.com/spring-projects/spring-shell/releases/tag/v4.0.3)
- author: Martin Lippert; Mahmoud Ben Hassine
- date: 11-15 Haziran 2026
- category: developer-productivity, tooling, ai-assisted-development
- tags: spring-tools, spring-shell, mcp, claude-code, copilot, native-hints, jdk25
- summary: Spring Tools, Spring'e özel embedded MCP, Spring AI indexing/validation ve repo-aware version validation getiriyor. Spring Shell ise JDK 25 tab completion, devtools autoreload ve native runtime hint sorunlarını toparlıyor.
- why_it_matters: AI destekli geliştirme, framework semantiği ile beslenirse değerli; aksi halde yüzeysel kalıyor. Spring ekibi bunu ürünleştirmeye başladı.
- java_spring_relevance: Büyük Spring kod tabanları, iç CLI araçları ve agent destekli editör kullanan ekipler için orta-yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Kurumsal repo ve upgrade işlerinde tool-assisted doğrulama; internal CLI akışlarında daha stabil native/JDK uyumu.
- risks: Erken erişim araç beklentisini üretim kalitesi sanmak; Spring semantiğini anlamayan genel LLM akışlarında kalmak.
- migration_notes: Tool pilot'u küçük bir repo üzerinde deneyin; Spring Shell kullanan iç CLI'larda JDK 25 ve native build testlerini yenileyin.

### Bulgu 6

- title: JDK 27 JSON thread dump formatı sayısal alanlara geçti; observability ve incident otomasyonları yeniden test istiyor
- source: [Inside Java - Numeric Fields in JSON Thread Dumps](https://inside.java/2026/05/20/quality-heads-up/), [OpenJDK JDK 27 Project Page](https://openjdk.org/projects/jdk/27/)
- author: Ana-Maria Mihalceanu; OpenJDK
- date: 20 Mayıs 2026
- category: jvm, observability, tooling, compatibility
- tags: jdk27, thread-dump, json, formatversion2, serviceability
- summary: `jcmd Thread.dump_to_file -format=json` ve ilgili MXBean çıktıları artık `processId`, `tid` ve `threadCount` alanlarını numeric yazıyor; ayrıca `formatVersion: 2` eklendi.
- why_it_matters: Thread dump ingest eden script ve araçlar genelde sessiz varsayımlarla yazılır; bu tip değişim prod incident anında ortaya çıkar.
- java_spring_relevance: Yoğun üretim gözlemi yapan Java backend ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Thread dump parser'larını versioned contract mantığına geçirmek.
- risks: JDK 27 pilotlarında parser kırılması, yanlış dashboard/incident enrichment, otomasyon sessiz hataları.
- migration_notes: JDK 27 EA ile thread dump parser testleri yazın; string kabul eden şemaları numeric + `formatVersion` destekleyecek şekilde güncelleyin.

## Sonuç

17 Haziran itibarıyla en güçlü sinyal, Spring ekosisteminde güvenlik baskısının artık sadece "hangi patch'i alalım?" sorusu olmaması. Çekirdek framework, kimlik altyapısı, retry mekanizması, dokümantasyon testleri ve hatta IDE araç zinciri aynı anda daha sıkı sözleşmelere doğru gidiyor. Bu da ekipleri iki karara zorluyor: support line seçimini netleştirmek ve yardımcı görülen bileşenleri güvenlik/operasyon envanterine dahil etmek.

Bugün için pratik öncelik sırası şu olmalı: önce Framework/Authorization Server/LDAP/Retry/REST Docs patch seviyesi, sonra JDK 27 parser uyumu, ardından Spring Tools 5.2.0 gibi domain-aware tooling pilotları. Gürültü yüksek, ama kalıcı değer güven sınırlarını ve bakım hattını daha görünür hale getiren başlıklarda.
