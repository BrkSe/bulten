# Günlük Java / Spring Ekosistem Raporu

Tarih: `20 Nisan 2026, 09:05 TRT`

Kapsam: `19 Nisan 2026 09:00 TRT` ile `20 Nisan 2026 09:05 TRT` arasındaki günlük tarama.

Tekrar azaltma notu: Önceki raporlarda işlendiği için bugün `JEP 500 final field mutation`, `Keycloak 26.6.0`, `LangChain4j 1.13.0`, `Hibernate ORM 7.3`, `Spring Data 2026.0.0-RC1`, `Spring Vault 4.1.0-M1`, `Spring Kafka share consumer`, `Spring AMQP 1.0`, `Java 26 HTTP/3 / Structured Concurrency / AOT`, `Spring AI Recursive Advisors / TOON`, `Maven 3.9.14 CI hygiene`, `JDK 27 release schedule` ve `Spring Cloud Gateway CVE-2026-22750` ana bulgu olarak tekrar edilmedi. Bu rapor, yeni veya farklı karar değeri taşıyan sinyallere odaklanır.

Kaynak tarama notu: Zorunlu kaynaklar olarak [Spring Blog](https://spring.io/blog/), [Spring release kategorisi](https://spring.io/blog/category/releases/), [Spring Security Advisories](https://spring.io/security), ilgili Spring proje sayfaları, Spring GitHub release notları, [OpenJDK](https://openjdk.org/), [JDK EA builds](https://jdk.java.net/), [Oracle Java Blog](https://blogs.oracle.com/java), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), Josh Long'un `This Week in Spring` akışı, [Gunnar Morling](https://www.morling.dev/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Josh Long tarafında son güçlü haftalık akış `14 Nisan 2026`, Gunnar Morling tarafında son yeni üretim-kritik kayıt `2 Nisan 2026 Hardwood beta`, Burak KUTBAY tarafında ana sayfada görünen son Java/Spring odaklı içerikler `Java 25 Stable Values`, `Java 24 Stream Gatherers` ve `Spring Cloud Bus` eksenindedir; bugün bu üç kaynakta yeni ana bulgu gerektiren taze kayıt görülmedi.

## Öne Çıkan Başlıklar

- `Spring Framework 6.2.18` ve `7.0.7`, üç yeni Spring Framework CVE'sini kapatan kritik bakım sürümleri olarak yayımlandı. WebFlux multipart temp dosyaları, static resource cache poisoning ve Windows üzerinde static resource DoS senaryoları özellikle web yüzeyi açık Spring uygulamaları için hızlı envanter gerektiriyor.
- Bu Framework sürümleri gelecek hafta `Spring Boot 3.5.14` ve `Spring Boot 4.0.6` ile taşınacak. Etkilenen uygulamalarda Boot patch bekleme, geçici Framework override veya ticari hotfix seçenekleri risk bazlı ele alınmalı.
- `Apache Tomcat 10.1.54`, `11.0.21` ve `9.0.117` hattında yayımlanan güvenlik düzeltmeleri, gömülü Tomcat kullanan Spring Boot servisleri için ayrıca önemli. OCSP/client certificate davranışı, clustering loglarında Kubernetes bearer token sızıntısı, EncryptInterceptor bypass ve JSON access log escaping başlıkları üretim operasyonunu etkileyebilir.
- Inside Java'nın `How the JVM Optimizes Generic Code` yayını, Project Valhalla ile generics optimizasyonunun nasıl değişeceğine dair uzun vadeli sinyal veriyor. Bu, bugün kod değiştirme çağrısı değil; fakat performans kritik Java kütüphaneleri, collection-heavy servisler ve framework içi generic API tasarımları için izlenmesi gereken bir yön.
- Spring Security tarafında OAuth 2.0 Token Exchange pratiği, mikroservislerde audience-bound token ve service-to-service yetkilendirme için daha uygulanabilir hale geliyor. Bu, Keycloak gibi IAM platformlarındaki yeni grant kabiliyetleriyle aynı yönde okunmalı.
- `JEP 528` ve Inside Java'nın crashed JVM analiz yayınları, JVM servis edilebilirliğinde `jcmd` merkezli post-mortem teşhis hattının güçlendiğini gösteriyor. Kubernetes üzerinde Spring Boot çalıştıran ekipler için core dump ve libjvm saklama politikaları şimdiden düşünülmeli.

## Kritik Güncellemeler

1. `Spring Framework 6.2.18` ve `7.0.7`, `CVE-2026-22740`, `CVE-2026-22741` ve `CVE-2026-22745` için OSS düzeltmeleri içeriyor.
2. `CVE-2026-22740`, WebFlux multipart request işleyen uygulamalarda 10 KB üzerindeki part'lar için oluşan temp dosyalarının bazı durumlarda temizlenmemesiyle disk tüketimi DoS riskine işaret ediyor.
3. `CVE-2026-22741`, Spring MVC/WebFlux static resource chain, cache ve encoded resource resolver kombinasyonunda cache poisoning ile frontend istemcilerinin bozulmasına yol açabiliyor.
4. `CVE-2026-22745`, static resource'ları file system üzerinden servis eden ve Windows üzerinde çalışan Spring MVC/WebFlux uygulamalarında yavaş çözümlenen isteklerle bağlantı tüketimi DoS riskini kapatıyor.
5. Spring Framework 5.3.x ve 6.1.x için OSS destek hattı dışında kalma baskısı yeniden görünür oldu; 6.2.x için OSS destek penceresi de Haziran 2026'da kapanıyor.
6. Apache Tomcat 10.1.54 ve 11.0.21, 9 Nisan'da kamuya açılan birden fazla güvenlik düzeltmesini içeriyor; Spring Boot BOM'larının bu düzeltmeleri hangi patch seviyesinde taşıdığı takip edilmeli.
7. Spring Framework 7.0.7 release notes, `RestClient`, API versioning, Kotlin serialization, validation performansı, JDK 24+ metadata ve JMS shutdown gibi alanlarda Boot 4 ekiplerinin göreceği pratik düzeltmeler içeriyor.

## Trendler ve Sinyaller

### 1. Web/resource handling güvenlik yüzeyi büyüyor

Spring Framework CVE'leri ile Tomcat CVE'leri birlikte okunduğunda ortak sinyal net: upload, static resource, encoding, cache ve connector davranışları artık "framework detayı" değil, doğrudan saldırı yüzeyi. Spring ekipleri yalnızca business endpoint güvenliğine değil, static content, multipart limits, temp directory kapasitesi, access log formatı ve reverse proxy etkileşimine de güvenlik kontrolü olarak bakmalı.

### 2. Spring 6.2 ve Boot 3.5 hattı kısa vadeli migration baskısı taşıyor

Spring Framework wiki'si 6.2.x'i 6. neslin son feature branch'i olarak konumluyor ve OSS desteğin Haziran 2026'da biteceğini belirtiyor. Önceki raporlarda Boot 3.5 için de benzer pencere işlenmişti. Bugünkü güvenlik sürümü bu takvimi daha somut hale getiriyor: Boot 3.5/Framework 6.2 üzerinde kalan ekipler artık sadece feature migration değil, güvenlik patch erişimi ve destek modeli kararı da vermeli.

### 3. Framework 7 olgunlaşması küçük API pürüzlerini temizliyor

Spring Framework 7.0.7, Boot 4 kullanan ekipler için büyük bir özellik sürümü değil; fakat `RestClient`, API versioning, resource resolver, validation, Kotlin serialization ve JDK 24+ class metadata düzeltmeleri, Framework 7'nin üretim kullanımı etrafındaki pürüzleri azaltıyor. Bu tür küçük düzeltmeler, Boot 4'e geçiş POC'larında "framework yeni, riskli" algısını daha ölçülebilir hale getirir.

### 4. JVM performansında uzun vadeli konu generic specialization

Inside Java ve JavaOne içeriği, bugünkü HotSpot'un generic kodu type profiling, inlining ve devirtualization ile çok iyi optimize edebildiğini; ancak profile pollution ve Valhalla value class layout'larının yeni performans eşikleri yaratacağını anlatıyor. Enterprise Spring ekipleri için kısa vadeli aksiyon benchmark disiplinidir; uzun vadeli değer ise Valhalla sonrası generic-heavy kütüphanelerin nasıl evrileceğini izlemektir.

### 5. Service-to-service auth, token exchange ve audience sınırına kayıyor

Baeldung'ün Spring Security token exchange rehberi, Keycloak 26.6.0 gibi IAM platformlarındaki yeni grant destekleriyle aynı yönde sinyal veriyor. Mikroservislerde tek access token'ı her downstream servise taşımak yerine, hedef audience ve scope'a göre token dönüştürmek daha güvenli ve denetlenebilir bir model haline geliyor.

### 6. JVM olay sonrası teşhisinde core dump tekrar merkezde

JEP 528 kabul edilirse `jcmd`, çalışan JVM yanında çökmüş JVM core dump'ları üzerinde de tanıdık teşhis komutlarını çalıştırabilecek. Bu, Spring Boot servisleri için doğrudan yeni kod yazma konusu değil; ancak production incident runbook'larında core dump toplama, saklama, maskeleme ve analiz ortamı hazırlama ihtiyacını öne çıkarıyor.

## Araçlar ve Kütüphaneler

- `Spring Framework 6.2.18 / 7.0.7`: WebFlux multipart temp file DoS, static resource cache poisoning ve Windows static resource DoS düzeltmeleri.
- `Spring Boot 3.5.14 / 4.0.6`: Henüz yayımlanmadı; Spring Framework 6.2.18 ve 7.0.7'nin gelecek hafta bu Boot sürümleriyle taşınması bekleniyor.
- `Apache Tomcat 10.1.54 / 11.0.21 / 9.0.117`: OCSP, client certificate, cluster log secret leak, EncryptInterceptor bypass ve JSON access log escaping düzeltmeleri.
- `Spring Framework 7.0.7 GitHub release`: `MockRestServiceServer#createServer` için `RestClient` varyantı, `RestClientXhrTransport`, `PreFlightRequestFilter`, validation adapter performansı, Kotlin serialization JSON array decoding, JDK 24+ metadata düzeltmeleri.
- `Spring Security Token Exchange`: OAuth 2.0 Token Exchange Grant ile audience ve scope değiştirerek downstream servis çağrılarında daha doğru token kullanımı.
- `JEP 528`: `jcmd` ile post-mortem crash analysis adayı; live ve core dump teşhis deneyimini yakınlaştırmayı hedefliyor.

## Java / Spring Geliştiricileri İçin Etkiler

- WebFlux multipart upload kullanan servislerde temp dizin kapasitesi, cleanup davranışı ve upload limitleri hemen gözden geçirilmeli. Sadece `max-file-size` ayarı yeterli kabul edilmemeli; disk tüketimi ve temp file yaşam döngüsü gözlemlenmeli.
- Static resource chain kullanan MVC/WebFlux uygulamalarında `resource chain caching`, encoded resource resolver, CDN/proxy cache ve frontend asset invalidation birlikte test edilmeli. Özellikle SPA asset'leri Spring üzerinden servis ediliyorsa cache poisoning etkisi kullanıcıya doğrudan yansır.
- Windows üzerinde çalışan Spring uygulamaları azınlıkta olabilir; ancak kurumsal iç uygulamalar, batch-admin panelleri veya legacy deployment'lar bu sınıfa girebilir. Bu ortamlar "prod değil" varsayımıyla atlanmamalı.
- Spring Boot uygulamalarında Framework veya Tomcat bağımlılıklarını manuel override etmek kısa vadede mümkün olabilir, fakat Boot dependency management dışına çıkmak entegrasyon regresyonu doğurabilir. Etkilenen servislerde önce Boot patch seviyesinin beklenip beklenemeyeceği risk bazlı belirlenmeli.
- Gömülü Tomcat kullanan ekipler sadece Boot sürümüne değil, runtime'da gerçekten hangi Tomcat jar'ının yüklendiğine bakmalı. Container image layer'ları, WAR deployment, custom server override ve vendor hotfix hatları ayrı doğrulanmalı.
- Token exchange, mikroservislerde "gateway token'ını içeride aynen dolaştırma" alışkanlığını azaltmak için ciddi bir aday. Bu model authorization server, resource server ve client registration tasarımını birlikte etkiler.
- Generic-heavy performans sorunlarında yalnızca algoritma karmaşıklığına değil, call-site type çeşitliliğine ve JIT profiline de bakılmalı. Bu özellikle serialization, mapping, validation, query DSL ve collection transform katmanlarında anlamlıdır.
- JVM crash sonrası teşhis için core dump üretimi, hassas veri riski ve analiz ortamı önceden tanımlanmalı. Incident anında ilk kez core dump politikası yazmak gerçekçi değildir.

## Fırsatlar ve Riskler

Fırsatlar:

- Spring Framework 6.2.18/7.0.7 ile web katmanı güvenlik açıklarını hızlı kapatmak ve aynı anda Framework 7/Boot 4 geçiş POC'larında küçük ama önemli runtime düzeltmelerini almak.
- Tomcat 10.1.54/11.0.21 düzeltmeleriyle mTLS, clustering, access log ve reverse proxy davranışlarını daha güvenli hale getirmek.
- Token exchange'i service mesh, API gateway ve Spring Security resource server mimarisiyle birlikte değerlendirerek downstream servislerde daha dar yetkili token modeli kurmak.
- JEP 528 yönünü izleyerek JVM crash runbook'larını modernize etmek; `jhsdb` bağımlılığını azaltabilecek daha standart bir teşhis hattına hazırlanmak.
- Valhalla ve generic specialization yönünü izleyerek performans kritik framework veya library tasarımlarında geleceğe daha uyumlu API kararları almak.

Riskler:

- Spring Framework CVE'lerini yalnızca WebFlux veya yalnızca static content kullanan küçük bir alt küme gibi görüp uygulama envanterini eksik yapmak.
- Boot BOM dışına plansız Framework/Tomcat override eklemek ve security fix alırken farklı bir HTTP, resource handling veya serialization regresyonu üretmek.
- Commercial-only düzeltme gerektiren eski Spring branch'lerinde kalıp OSS patch beklentisiyle zaman kaybetmek.
- Token exchange'i mimari sınırları netleştirmeden eklemek; her servis için audience, scope, subject ve delegation modelini belirsiz bırakmak.
- Core dump teşhisini açarken dump dosyalarının secret, token, PII veya heap içi business verisi taşıyabileceğini göz ardı etmek.

## İzlenmesi Gereken Konular

- `Spring Boot 3.5.14` ve `Spring Boot 4.0.6` yayımlandığında dependency BOM içinde Spring Framework ve Tomcat patch seviyelerinin doğrulanması.
- `CVE-2026-22740`, `CVE-2026-22741` ve `CVE-2026-22745` için NVD/CISA skor ve distro advisory güncellemeleri.
- Tomcat 10.1.54/11.0.21 düzeltmelerinin Spring Boot, container distro, vendor JDK/Tomcat bundle ve enterprise hotfix kanallarına ne zaman taşındığı.
- Spring Framework 6.2 OSS destek bitişi yaklaştıkça Boot 3.5 üzerinde kalacak ekiplerin destek modeli.
- Spring Security ve Spring Authorization Server tarafında token exchange örneklerinin production guidance'a dönüşmesi.
- JEP 528'in JDK hedef durumu ve `jcmd` post-mortem komut kapsamının netleşmesi.
- Project Valhalla generic specialization ve value class layout çalışmalarının Java koleksiyonları, ORM, serialization ve mapper kütüphanelerinde yaratacağı etkiler.

## Kaynak Bazlı Bulgular

### 1. Spring Framework 6.2.18 ve 7.0.7 üç yeni CVE için hızlı güvenlik yaması getiriyor

- **title:** Spring Framework 6.2.18 / 7.0.7, WebFlux multipart ve static resource güvenlik açıklarını kapatıyor
- **source:** [Spring Blog - Spring Framework 6.2.18 and 7.0.7 Available Now](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/), [CVE-2026-22740](https://spring.io/security/cve-2026-22740/), [CVE-2026-22741](https://spring.io/security/cve-2026-22741/), [CVE-2026-22745](https://spring.io/security/cve-2026-22745/)
- **author:** `Stéphane Nicoll`, `Spring Security advisory team`
- **date:** `17 Nisan 2026`
- **category:** `security-platform-release`
- **tags:** `spring-framework`, `spring-boot`, `webflux`, `spring-mvc`, `multipart`, `static-resources`, `cache-poisoning`, `dos`
- **summary:** Spring Framework 6.2.18 ve 7.0.7 yayımlandı. Sürüm, WebFlux multipart temp file cleanup kaynaklı disk tüketimi DoS riskini, MVC/WebFlux static resource cache poisoning riskini ve Windows file-system static resource çözümlemesindeki DoS riskini düzeltiyor. Bu Framework sürümleri gelecek hafta Boot 3.5.14 ve 4.0.6 ile taşınacak.
- **why_it_matters:** Bu açıklar application business kodundan bağımsız, framework resource handling davranışında. Upload, static asset ve cache kombinasyonları üretimde sık kullanıldığı için etki alanı basit endpoint güvenliği taramalarından daha geniş olabilir.
- **java_spring_relevance:** Spring Boot web servisleri, WebFlux upload endpoint'leri, Spring MVC static asset sunumu, SPA backend'leri ve encoded static resource chain kullanan uygulamalar doğrudan etkilenebilir.
- **actionability:** `hemen_envanter_ve_patch_planı`
- **impact_level:** `yüksek`
- **opportunities:** Web katmanı güvenlik envanterini güçlendirmek; Boot patch sürecini hızlandırmak; static resource ve multipart testlerini release checklist'e eklemek.
- **risks:** Etkilenmeyen varsayımıyla patch'i ertelemek; Boot BOM dışına acele override ekleyip entegrasyon regresyonu üretmek; eski Framework 5.3/6.1 branch'lerinde OSS fix beklemek.
- **migration_notes:** Uygulamalarda `spring-webflux`, `spring-webmvc`, multipart upload, static resource chain, encoded resource resolver, Windows deployment ve CDN/proxy cache kullanımlarını tarayın. Boot 3.5.14/4.0.6 yayımlandığında normal dependency management ile yükseltmeyi tercih edin. Etkilenen ve bekleyemeyen servislerde Framework override yapılacaksa web, upload, SSE, static asset ve integration testleri zorunlu çalıştırılmalı.

### 2. Spring Framework 7.0.7, Boot 4 geçişlerinde görülebilecek küçük ama önemli pürüzleri azaltıyor

- **title:** Framework 7.0.7 release notes, RestClient ve API versioning etrafında üretim olgunlaşması gösteriyor
- **source:** [Spring Framework v7.0.7 GitHub release](https://github.com/spring-projects/spring-framework/releases/tag/v7.0.7), [Spring Framework v6.2.18 GitHub release](https://github.com/spring-projects/spring-framework/releases/tag/v6.2.18)
- **author:** `Spring Framework maintainers`
- **date:** `17 Nisan 2026`
- **category:** `framework-engineering`
- **tags:** `spring-framework-7`, `spring-boot-4`, `restclient`, `api-versioning`, `kotlin`, `validation`, `jms`, `jdk24`
- **summary:** 7.0.7; validation adapter performansı, `MockRestServiceServer` için `RestClient` varyantı, `RestClientXhrTransport`, `PreFlightRequestFilter`, Kotlin serialization JSON array decoding, API versioning API düzeltmeleri, JDK 24+ metadata sorunları, JMS shutdown ve resource resolver düzeltmeleri içeriyor.
- **why_it_matters:** Boot 4 ve Framework 7 geçişlerinde büyük kırılmalar kadar küçük runtime pürüzleri de ekiplerin güvenini etkiler. Bu release, Framework 7'nin web client, API versioning, validation ve yeni JDK kombinasyonlarında daha rafine hale geldiğini gösteriyor.
- **java_spring_relevance:** RestTemplate'den RestClient'a geçiş yapan, API versioning kullanan, Kotlin/WebFlux uygulamaları çalıştıran veya JDK 24+ test hattı açan Spring ekipleri için doğrudan anlamlı.
- **actionability:** `boot4_poc_ortamında_dogrula`
- **impact_level:** `orta-yüksek`
- **opportunities:** Boot 4 pilotlarında RestClient test altyapısını güçlendirmek; API versioning kullanımını güncel API davranışına göre doğrulamak; validation ve resource handling benchmark'larını yenilemek.
- **risks:** 7.0.x üzerinde zaten production çalışan servislerde küçük public API davranışlarını fark etmeden almak; snapshot/milestone döneminden kalan fluent API kullanımlarında compile kırılması yaşamak.
- **migration_notes:** Boot 4 POC branch'lerinde 7.0.7 ile tüm web client, API versioning, validation ve static resource testlerini tekrar koşturun. RestTemplate tabanlı test yardımcılarını RestClient varyantlarına taşıma fırsatını değerlendirin. JDK 24+ veya JDK 25 testlerinde annotation/class metadata hatalarını özellikle izleyin.

### 3. Apache Tomcat 10.1.54 / 11.0.21 güvenlik düzeltmeleri Spring Boot runtime envanterini etkiliyor

- **title:** Tomcat güvenlik yamaları, gömülü servlet container'ın ayrı izlenmesi gerektiğini hatırlatıyor
- **source:** [Apache Tomcat 10 vulnerabilities](https://tomcat.apache.org/security-10.html), [Apache Tomcat 11 vulnerabilities](https://tomcat.apache.org/security-11.html), [Apache Tomcat 9 vulnerabilities](https://tomcat.apache.org/security-9.html)
- **author:** `Apache Tomcat Security Team`
- **date:** `2-4 Nisan 2026 düzeltmeleri, 9 Nisan 2026 kamuya açıklama`
- **category:** `runtime-security`
- **tags:** `tomcat`, `spring-boot`, `embedded-tomcat`, `mtls`, `ocsp`, `kubernetes`, `access-logs`, `request-smuggling`, `encryptinterceptor`
- **summary:** Tomcat 10.1.54, 11.0.21 ve 9.0.117; OCSP soft-fail/client certificate doğrulaması, Kubernetes bearer token'ın cluster loglarına düşmesi, EncryptInterceptor bypass, JSON access log escaping ve önceki 10.1.53/11.0.20 düzeltmeleriyle ilişkili ek HTTP/TLS sorunlarını kapatıyor.
- **why_it_matters:** Spring Boot uygulamaları Tomcat'i çoğu zaman "starter bağımlılığı" olarak görür; ancak connector, TLS, clustering, access log ve reverse proxy davranışları doğrudan güvenlik ve operasyon konusudur.
- **java_spring_relevance:** `spring-boot-starter-web` ile gömülü Tomcat kullanan servisler, WAR deployment yapan ekipler, mTLS/CLIENT_CERT kullanan sistemler, Kubernetes içinde Tomcat clustering açan uygulamalar ve JSON access log kullanan platformlar etkilenebilir.
- **actionability:** `runtime_dependency_envanteri`
- **impact_level:** `yüksek`
- **opportunities:** Runtime SBOM doğrulamasını iyileştirmek; mTLS ve access log testlerini CI/security checklist'e eklemek; Boot BOM ile gerçek runtime jar'ı arasındaki farkları yakalamak.
- **risks:** Spring Boot sürümünün güvenli olduğunu varsayıp runtime'daki Tomcat jar'ını doğrulamamak; container image veya vendor hotfix hattından gelen Tomcat sürümünü gözden kaçırmak; clustering loglarında secret sızıntısını sadece düşük öncelikli log sorunu gibi görmek.
- **migration_notes:** Çalışan servislerde `org.apache.catalina.util.ServerInfo` veya dependency tree ile gerçek Tomcat sürümünü doğrulayın. Boot BOM, container image, WAR runtime ve vendor hotfix kanallarını ayrı ayrı kontrol edin. mTLS, OCSP, reverse proxy, JSON access log ve Kubernetes secret loglama senaryolarını staging'de test edin.

### 4. Inside Java generics yayını, Valhalla sonrası performans modelinin değişeceğini gösteriyor

- **title:** JVM generic optimizasyonunda profile pollution ve Valhalla generic specialization izlenmeli
- **source:** [Inside Java - How the JVM Optimizes Generic Code](https://inside.java/2026/04/19/generics-optimization/), [JavaOne session summary](https://dev.java/community/javaone-2026/sessions/lrn1467/), [Jeanne Boyarsky JavaOne notes](https://www.selikoff.net/2026/03/19/javaone-2026-how-the-jvm-optimizes-generic-code-a-deep-dive/)
- **author:** `John Rose`, `Jeanne Boyarsky`
- **date:** `19 Nisan 2026`, `19 Mart 2026`
- **category:** `jvm-performance-roadmap`
- **tags:** `jvm`, `hotspot`, `generics`, `project-valhalla`, `value-classes`, `type-profiling`, `inlining`, `devirtualization`
- **summary:** Java generics bugün type profiling, inlining ve devirtualization sayesinde yüksek performans verebiliyor; ancak profile pollution, çok tipli call-site'lar ve Valhalla value class layout'ları yeni optimizasyon sınırları yaratıyor. Uzun vadeli çözüm olarak generic specialization yönü anlatılıyor.
- **why_it_matters:** Performans kritik Java kodunda "generic soyutlama bedavadır" varsayımı her zaman geçerli değil. JVM çok iyi optimize eder, fakat megamorphic call-site ve tip profili kirliliği ciddi performans eşiği yaratabilir.
- **java_spring_relevance:** Spring Data, validation, serialization, mapping, collection transformation, query DSL ve reactive pipeline kodları yoğun generic API kullanır. Bu katmanlarda performans sorunu varsa JIT profil davranışı da incelenmeli.
- **actionability:** `izle_ve_benchmark_disiplini_kur`
- **impact_level:** `orta`
- **opportunities:** JMH benchmark'larını gerçek tip çeşitliliğiyle tasarlamak; hot path'lerde monomorphic/bimorphic/megamorphic davranışı ölçmek; Valhalla sonrası kütüphane tasarımına hazırlanmak.
- **risks:** Bu sinyali bugünden agresif mikro-optimizasyon bahanesi yapmak; benchmark'ı tek tip mutlu yol verisiyle çalıştırıp production type diversity etkisini kaçırmak.
- **migration_notes:** Hemen migration gerektirmez. Performans kritik generic kodlarda JFR, async-profiler ve JITWatch gibi araçlarla call-site profili incelenmeli. Valhalla/generic specialization JEP'leri somutlaştıkça framework ve library güncellemeleri ayrı izlenmeli.

### 5. Spring Security Token Exchange, mikroservislerde daha doğru delegated auth modeline işaret ediyor

- **title:** OAuth 2.0 Token Exchange, Spring Security tabanlı service-to-service çağrılarda audience sınırını güçlendiriyor
- **source:** [Baeldung - A Guide to Token Exchange in Spring Security](https://www.baeldung.com/spring-security-token-exchange-guide), [Spring Security project page](https://spring.io/projects/spring-security)
- **author:** `Hamid Reza Sharifi`, `Baeldung reviewers`
- **date:** `15 Nisan 2026`
- **category:** `security-architecture`
- **tags:** `spring-security`, `oauth2`, `token-exchange`, `rfc8693`, `microservices`, `resource-server`, `authorization-server`
- **summary:** Baeldung rehberi, Spring Security 6.3 ile OAuth 2.0 Token Exchange Grant desteğinin mikroservislerde bir access token'ı farklı audience veya scope için başka bir token'a dönüştürme senaryosunda nasıl kullanılacağını anlatıyor.
- **why_it_matters:** Mikroservislerde kullanıcı token'ını tüm iç servislere aynen taşımak fazla yetki, belirsiz audience ve zor denetlenebilir trust boundary yaratır. Token exchange, delegation ilişkisini daha açık hale getirir.
- **java_spring_relevance:** Spring Security Resource Server, OAuth2 Client ve Spring Authorization Server kullanan ekipler için token exchange, gateway-to-service veya service-to-service çağrılarında pratik bir mimari araçtır.
- **actionability:** `mimari_degerlendirme_ve_poc`
- **impact_level:** `orta-yüksek`
- **opportunities:** Downstream servislerde dar scope/audience kullanmak; audit izlerini güçlendirmek; IAM platformu ile servis kontratlarını daha açık tanımlamak.
- **risks:** Token exchange'i tüm servis çağrılarına otomatik ekleyip latency ve authorization server bağımlılığını artırmak; subject, actor, audience ve scope modelini dokümante etmeden uygulamak.
- **migration_notes:** Önce en riskli cross-service çağrıları seçin. Authorization server token exchange desteğini, client registration modelini, cache/TTL stratejisini ve failure behavior'ı POC'de ölçün. Gateway, resource server ve downstream servis loglarında token subject/audience izlenebilirliğini standartlaştırın.

### 6. JEP 528, JVM crash sonrası teşhisi `jcmd` merkezli hale getirmeyi hedefliyor

- **title:** Post-mortem `jcmd`, Spring Boot operasyonlarında incident runbook kalitesini artırabilir
- **source:** [OpenJDK JEP 528](https://openjdk.org/jeps/528), [Inside Java - Analyzing Crashed JVMs](https://inside.java/2026/04/02/newscast-109/), [Inside Java Podcast Episode 53](https://inside.java/2026/04/04/podcast-053/)
- **author:** `Kevin Walls`, `Nicolai Parlog`
- **date:** `2-4 Nisan 2026`, JEP güncelleme tarihi `16 Ekim 2025`
- **category:** `jvm-serviceability`
- **tags:** `jcmd`, `jvm`, `core-dump`, `post-mortem`, `kubernetes`, `incident-response`, `observability`
- **summary:** JEP 528 candidate durumunda. Amaç, bugün canlı JVM'e bağlanan `jcmd` komutlarının bir kısmını crash sonrası core dump üzerinde de çalıştırabilmek. JEP; thread, heap, classloader, metaspace, native memory ve VM bilgileri gibi tanı komutlarının post-mortem ortamda kullanılmasını hedefliyor.
- **why_it_matters:** JVM crash olaylarında canlı observability artık mümkün değildir. Core dump üzerinde tanıdık `jcmd` komutlarını çalıştırmak, native debugger veya kırılgan servis edilebilirlik araçlarına bağımlılığı azaltabilir.
- **java_spring_relevance:** Spring Boot servisleri Kubernetes veya container ortamında crash olduğunda çoğu ekip yalnızca pod loglarına bakar. Native crash, JVM bug, agent problemi veya JNI/native library hatalarında core dump teşhisi çok daha değerlidir.
- **actionability:** `orta_vade_izle_ve_runbook_hazirla`
- **impact_level:** `orta`
- **opportunities:** Incident response standardını geliştirmek; core dump ve `libjvm` saklama akışını otomatikleştirmek; production crash analiz süresini kısaltmak.
- **risks:** Core dump dosyaları heap içi secret, token ve PII taşıyabilir. Yanlış saklama veya analiz ortamına kontrolsüz taşıma ciddi veri sızıntısı riski doğurur.
- **migration_notes:** JEP henüz candidate; üretim davranışı olarak varsayılmamalı. Buna rağmen platform ekipleri crash dump policy, dosya boyutu limitleri, güvenli storage, erişim kontrolü ve aynı OS/CPU mimarisinde analiz ortamı gereksinimlerini bugünden tasarlayabilir.

## Sonuç

Bugünün en güçlü karar sinyali Spring Framework ve Tomcat güvenlik yamalarıdır. Spring ekipleri için pratik aksiyon, web/resource handling yüzeyini envanterlemek, Boot patch penceresini takip etmek ve gerçek runtime bağımlılıklarını doğrulamaktır.

İkinci sinyal destek ve migration baskısıdır. Spring Framework 6.2 ve Boot 3.5 hattı kısa vadede hâlâ üretim için geçerli olsa da destek penceresi daralıyor; güvenlik yamaları bu takvimi soyut bir roadmap konusu olmaktan çıkarıp operasyonel karar haline getiriyor.

Üçüncü sinyal daha uzun vadeli: JVM tarafında Valhalla/generic specialization ve post-mortem `jcmd` gibi çalışmalar, Java'nın performans ve operasyon modelini derinden ama aşamalı değiştiriyor. Bugün yapılacak en doğru şey, bu başlıkları hype olarak değil, benchmark, incident runbook ve platform standardı konularına bağlayarak izlemek.
