# Günlük Java / Spring Ekosistem Raporu

Tarih: 11 Mayıs 2026  
Tarama zamanı: 11 Mayıs 2026 09:13 TSİ  
Odak: Spring Security destek matrisi ve CVE kapanışları, Boot 4 stabilizasyonu, Cloud 2025.1.1 hizası, JDK 21.0.11 operasyonel etkileri, JDK 27 sinyallerinde gürültü/değer ayrımı

Tarama notu: Bu rapor hazırlanırken zorunlu kaynaklar sistematik olarak kontrol edildi: [Official Spring Blog](https://spring.io/blog/), [Spring Projects](https://spring.io/projects), [Spring Release Highlights](https://spring.io/projects/release-highlights), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud), [Spring Cloud release referansı](https://docs.spring.io/spring-cloud-release/reference/spring-projects.html), [Spring Security 2026.04 releases](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Security referansı](https://docs.spring.io/spring-security/reference/index.html), [Spring Boot releases](https://github.com/spring-projects/spring-boot/releases), [Spring AI 1.0.7 / 1.1.6 / 2.0.0-M6 duyurusu](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/), [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [JEP 532](https://openjdk.org/jeps/532), [JEP 527](https://openjdk.org/jeps/527), [Inside Java](https://inside.java/), [OpenJDK Quality Outreach Heads-up](https://inside.java/headsup/), [Oracle Java Blog](https://blogs.oracle.com/java), [Oracle Java CPU Nisan 2026](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm), [JDK 21.0.11 release notes](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html), [Oracle Java Verified Portfolio duyurusu](https://blogs.oracle.com/java/announcing-jvp), [GraalVM release calendar](https://www.graalvm.org/release-calendar/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung Spring AI Series](https://www.baeldung.com/spring-ai-series), [Gunnar Morling - Hardwood Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/), [Josh Long - This Week in Spring, 5 Mayıs 2026](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026/), [Burak KUTBAY - API Versiyonlama / Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/) ve [Burak KUTBAY - HTTP Service Client / Spring Boot 4.0](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/).  
Bugün resmi Spring tarafında 8 Mayıs 2026 tarihli Spring AI M6 duyurusundan daha yeni, yüksek etkili bir release dalgası görünmüyor. Bu yüzden bu koşuda tekrar üretmek yerine daha az işlenmiş ama üretim etkisi yüksek sinyallere ağırlık verildi: Spring Security destek çizgisi, Boot 4 stabilizasyon bug fix’leri, Cloud 2025.1.1 hizası ve Oracle/OpenJDK runtime sertleşmesi. Baeldung ve Josh Long tarafında son günler daha çok eğitim ve topluluk kürasyonu ağırlıklı; doğrudan yeni breaking-change sinyali üretmiyorlar.

## Öne Çıkan Başlıklar

- [Spring Security 6.5.10 ve 7.0.5](https://spring.io/blog/2026/04/21/spring-security-releases) yalnız CVE kapatmıyor; aynı anda 5.7.x, 5.8.x, 6.3.x ve 6.4.x hatlarının OSS bakım dışına çıktığını netleştiriyor. Bu, “patch sonra bakarız” alanı değil, doğrudan destek stratejisi konusu.
- [Spring Boot 4.0.6](https://github.com/spring-projects/spring-boot/releases/tag/v4.0.6) bugün Boot 4’e geçmek isteyen ekipler için asıl güvenli giriş noktası gibi duruyor. [4.1.0-RC1](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0-RC1) ise hâlâ laboratuvar hattı.
- [Spring Cloud 2025.1.1](https://spring.io/projects/spring-cloud) ile [release highlights](https://spring.io/projects/release-highlights) birlikte okunduğunda, interface client yönetişimi, `lb://` ve declarative circuit breaker artık “opsiyonel tatlılık” değil; platform standardı adayları.
- [JDK 21.0.11](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html) tarafında en pratik risk, yeni feature değil; `tzdata 2026a`, Temmuz 2026 CPU penceresi ve Chunghwa kök sertifikalarına ilişkin güvensizleştirme kararı.
- OpenJDK tarafında [JEP 532](https://openjdk.org/jeps/532) 8 Mayıs 2026’da JDK 27’ye beşinci preview olarak hedeflendi; ama kısa vadeli kurumsal etki açısından hâlâ [JEP 527](https://openjdk.org/jeps/527) ve runtime güvenliği daha önemli.
- Oracle’ın [Java Verified Portfolio](https://blogs.oracle.com/java/announcing-jvp) ve [GraalVM release calendar](https://www.graalvm.org/release-calendar/) sinyali, native-image ve destek stratejisinin artık “JDK release = GraalVM release” varsayımıyla yönetilmemesi gerektiğini gösteriyor.

## Kritik Güncellemeler

### Spring Security tarafında sürüm seçimi artık güvenlik kadar önemli

[Spring Security 2026.04 releases](https://spring.io/blog/2026/04/21/spring-security-releases) ile `6.5.10`, `7.0.5` ve `7.1.0-RC1` yayımlandı. Duyuruda yedi CVE açıkça listeleniyor: user attribute enumeration, X.509 impersonation, `withIssuerLocation` misconfiguration, `securityMatchers` ve XML authorization path eşleşme problemleri, Authorization Server dynamic client registration validation açığı ve `JdbcOneTimeTokenService` yarış durumu. Daha kritik olan ikinci mesaj ise şu: `5.7.x`, `5.8.x`, `6.3.x` ve `6.4.x` OSS bakım dışı.

Bu ne anlama geliyor? Eski nesilde kalmak artık sadece “bir iki patch geriden gelmek” değil; açık kaynak bakım modelinin dışına çıkmak demek. Özellikle kimlik, OAuth2, SAML, X.509 veya one-time token kullanan ekiplerde bu konu backlog maddesi değil, release planı maddesi olmalı.

### Boot 4 stabilizasyonu görünmez ama pahalı hataları kapatıyor

[Spring Boot 4.0.6 release notes](https://github.com/spring-projects/spring-boot/releases/tag/v4.0.6) gösterişli feature anlatmıyor; tam tersine üretimde maliyeti yüksek bug’ları topluyor:

- `RandomValuePropertySource` gizli veriler için uygun değil uyarısı
- reactive MongoDB starter’ın senkron MongoDB driver’ını transitif taşıması
- classic starter’larda eksik modüller
- `@ServiceConnection` ile `@Ssl` anotasyon davranışı
- Docker Compose ile ActiveMQ/Artemis imajlarında uyumsuzluklar

Aynı sürüm [Spring Framework 7.0.7](https://github.com/spring-projects/spring-framework/releases/tag/v7.0.7) ve [Spring Security 7.0.5](https://spring.io/projects/spring-security) gibi bakım yükseltmelerini de çekiyor. Yani Boot 4’e geçecek ekip için bugünkü akıllı pozisyon, `4.0.6` üstünde üretim sertleştirmesi; `4.1.0-RC1` üstünde ise ayrı bir deney hattı kurmak.

### Cloud 2025.1.1, Boot 4 geçişini teknik tercih olmaktan çıkarıyor

[Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud) bugün `2025.1.1`’i stable gösteriyor ve `2025.1.x -> Boot 4.0.x`, `2025.0.x -> Boot 3.5.x` eşleşmesini net veriyor. [Release highlights](https://spring.io/projects/release-highlights) aynı hatta üç pratik yetenek öne çıkarıyor:

- Spring Cloud Gateway için API versioning predicate
- Spring Interface Clients için built-in circuit breaker entegrasyonu
- Interface client tanımlarında `lb://` desteği

Bu başlıklar küçük görünse de mikroservis takımlarının dış servis çağrılarını, versiyonlamayı ve servis keşfini daha merkezi yönetmesine izin veriyor. Buradaki asıl değer yeni annotation değil; dağınık client politikalarının çerçeve seviyesine taşınması.

### JDK 21.0.11 operasyonel notları feature listesinden daha önemli

[JDK 21.0.11 release notes](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html) ve [Oracle CPU Nisan 2026](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm) birkaç pratik konuya işaret ediyor:

- `tzdata 2026a` ile zaman bölgesi verisi güncellendi
- Sonraki CPU tarihi 21 Temmuz 2026 olarak verildi
- 17 Mart 2026 sonrası düzenlenen ve Chunghwa kök sertifikalarına zincirlenen TLS sertifikaları artık reddedilecek
- `CHUNGHWA_TLS` politikası, sadece bilinçli ve kontrollü istisna olarak geri açılabilecek

Spring Boot servisleri çoğu zaman “sadece uygulama jar’ı” gibi konuşuluyor; gerçekte dış dünyaya TLS konuşan, scheduler kullanan ve zaman dilimine duyarlı runtime’lar. Bu yüzden JDK patch seviyesi uygulama sürümünden ayrıştırılamaz.

## Trendler ve Sinyaller

### 1. Güvenlik bakımı artık destek politikasıyla birlikte okunmalı

Tekil CVE kapatma dönemi fiilen bitti. Spring Security duyurusu, Spring ekosisteminde “hangi patch’e çıkalım?” sorusunu “hangi nesilde kalmamız artık savunulamaz?” sorusuna dönüştürüyor. Benzer biçimde Oracle CPU notları da “hangi JDK feature’ını deniyoruz?” sorusundan önce “hangi baseline’da kaldık?” sorusunu dayatıyor.

Kalıcı değer: Desteklenen nesle disiplinli geçiş.  
Gürültü: Sadece tek modülün patch numarasına bakıp genel güvenlik pozisyonunu sağlıklı sanmak.

### 2. Platform, dış çağrı yönetişimini framework seviyesine çekiyor

Boot 4.1 RC1, Cloud 2025.1.1 ve release highlights birlikte okunduğunda dış HTTP/gRPC/messaging çağrılarında ortak desen belirgin:

- istemci davranışı merkezi tanımlansın
- versiyonlama framework seviyesinde çözülsün
- load balancing ve resilience deklaratif olsun
- observability env tabanlı ve standartlaştırılmış ilerlesin

Bu, özellikle çok sayıda takımın aynı platformu kullandığı kurumlarda ciddi bir mimari sinyal.

### 3. JVM tarafında iki ayrı hat var: gerçek operasyon etkisi ve geliştirici ergonomisi

[JEP 532](https://openjdk.org/jeps/532) dil ergonomisini genişletiyor; primitive pattern matching alanını beşinci kez preview ediyor. Buna karşılık [JEP 527](https://openjdk.org/jeps/527) ve JDK 21.0.11/26.0.1 notları doğrudan TLS, CA güveni ve runtime davranışı etkiliyor.

Kalıcı değer: PQC/TLS ve runtime sertleşmesi.  
Düşük öncelikli izleme: primitive pattern preview hattı.

### 4. Native ve destek stratejisi JDK ritminden ayrışıyor

[Oracle Java Verified Portfolio](https://blogs.oracle.com/java/announcing-jvp) ile [GraalVM release calendar](https://www.graalvm.org/release-calendar/) birlikte okunduğunda, Oracle’ın Java runtime çevresindeki destek ve paketleme modelini daha modüler hale getirdiği görülüyor. Spring Native/AOT ve native-image kullanan ekipler için anlamı basit: “GraalVM nasıl olsa JDK ile aynı ritimde gider” varsayımı zayıflıyor.

## Araçlar ve Kütüphaneler

- [Spring Security 7.1.0-RC1](https://github.com/spring-projects/spring-security/releases): Orta öncelik. Preview hat; ama DPoP özelleştirme, WebAuthn/MFA koşulları ve request matching iyileştirmeleri nedeniyle kimlik platformu ekipleri için izlemeye değer.
- [Spring Boot 4.0.6](https://github.com/spring-projects/spring-boot/releases/tag/v4.0.6): Yüksek öncelik. Yeni feature değil, ama üretim stabilizasyon sürümü.
- [Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/): Düşük-orta öncelik. Minimal bağımlılıklı, performans odaklı Parquet parser; veri yoğun batch veya lakehouse sidecar senaryolarında izlenebilir.
- [Oracle GraalVM for JDK 21.0.11](https://docs.oracle.com/en/graalvm/jdk/21/docs/release-notes/): Orta öncelik. Native image kullanan ekipler CPU hizasını ayrı takip etmeli.
- [Oracle Java Verified Portfolio](https://blogs.oracle.com/java/announcing-jvp): Düşük öncelik. Spring uygulama kodu için doğrudan zorunlu değil; fakat kurumsal destek, araç standardizasyonu ve tedarik zinciri yönetimi açısından sinyal değeri var.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Security kullanan ekipler, yalnız artifact sürümünü değil hangi destek neslinde kaldıklarını da envanterlemeli.
- Boot 4’e geçen ekipler için “en yeni prerelease” yerine “en güncel stabil maintenance” daha rasyonel başlangıç noktası.
- Spring Cloud kullanan platformlar, interface client + `lb://` + circuit breaker kombinasyonunu takım bazlı yardımcı kütüphaneler yerine merkezi standart olarak düşünmeli.
- JDK 21 filolarında Temmuz 2026 CPU tarihini şimdiden takvime almak ve dış TLS bağımlılıklarında Chunghwa kök sertifika etkisini kontrol etmek gerekir.
- JDK 27 preview başlıkları, demo ve eğitim içeriği için ilginç; kurumsal Spring servis yol haritası için ise şu an ikincil.
- Spring AI kullanan ekipler için 8 Mayıs 2026 tarihli M6 migration penceresi hâlâ açık; fakat bugün yeni ek release olmadığı için ayrı breaking-change başlığı olarak tekrar yükseltilmedi.

## Fırsatlar ve Riskler

- Fırsat: Cloud 2025.1.1 ile interface client yönetişimini merkezileştirmek, mikroservis ağında ortak davranış üretir.
- Fırsat: Boot 4.0.6 ve Security 7.0.5 gibi stabil bakım sürümleri, büyük feature yükseltmesi yapmadan risk azaltma şansı veriyor.
- Fırsat: JDK runtime patch disiplini, TLS ve zaman dilimi kaynaklı “uygulama dışı” görünen üretim arızalarını azaltır.
- Risk: Eski Spring Security nesillerinde kalmak, açık kaynak patch penceresi kapandıktan sonra güvenlik borcunu hızla büyütür.
- Risk: Boot 4.1 RC1’i release-train ve starter uyumu test edilmeden üretime yaklaştırmak, sessiz classpath ve auto-config sürprizleri doğurabilir.
- Risk: Sertifika güvensizleştirme kararları, özellikle üçüncü taraf veya kurumsal ara sertifika zincirleri kullanan dış servislerde beklenmedik bağlantı sorunları yaratabilir.
- Risk: GraalVM/native stratejisini JDK sürümüne fazla sıkı bağlamak, yeni destek modelinde planlama hatası doğurabilir.

## İzlenmesi Gereken Konular

- [Spring Security 7.1 GA](https://github.com/spring-projects/spring-security/releases) yaklaşırken RC1’deki DPoP, WebAuthn ve matcher iyileştirmelerinin final API şekli.
- [Spring Boot 4.1 GA](https://github.com/spring-projects/spring-boot/releases) öncesinde RC hattında başka güvenlik veya davranışsal düzeltme gelip gelmeyeceği.
- [Spring Cloud 2025.1.2-SNAPSHOT](https://docs.spring.io/spring-cloud-release/reference/spring-projects.html) ile Oakwood hattında yeni service release ihtiyacı oluşup oluşmadığı.
- [JEP 527](https://openjdk.org/jeps/527) sonrası TLS named group ve istemci/terminator uyumluluğunun saha tepkileri.
- [JEP 532](https://openjdk.org/jeps/532) hattının JDK 27’de hâlâ preview kalıp kalmayacağı; bu konu bugün için düşük öncelik.
- [Spring AI M6](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/) migration örüntülerinin RC/GA aşamasında ne kadar stabil hale geleceği.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Security 2026.04 hattı, CVE kapatmanın ötesinde destek nesli değişimi dayatıyor
- source: [Spring Security 2026.04 Releases - Contains CVE Fixes](https://spring.io/blog/2026/04/21/spring-security-releases), [Spring Security referansı](https://docs.spring.io/spring-security/reference/index.html)
- author: Josh Cummings / Spring Security team
- date: 21 Nisan 2026
- category: security, identity, support-policy
- tags: spring-security, cve, oauth2, x509, one-time-token, authorization-server, eol
- summary: Spring Security `6.5.10`, `7.0.5` ve `7.1.0-RC1` yedi CVE’yi kapatırken, `5.7.x`, `5.8.x`, `6.3.x` ve `6.4.x` hatlarının OSS bakım dışına çıktığını da ilan ediyor.
- why_it_matters: Bu, güvenlik güncellemesini patch numarası tartışmasından çıkarıp destek matrisi ve yükseltme ekonomisi konusuna taşıyor.
- java_spring_relevance: Spring Security, Authorization Server veya kurumsal kimlik katmanı kullanan ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Desteklenen nesillere geçerek güvenlik ve bakım politikasını sadeleştirmek.
- risks: EOL hatlarda kalıp yalnız lokal workaround’larla güvenlik yönetmeye çalışmak.
- migration_notes: En az `6.5.10` veya `7.0.5` seviyesine çıkılmalı; eski Boot hatlarında ticari hotfix bağımlılığı ayrıca gözden geçirilmeli.

### Bulgu 2

- title: Spring Boot 4.0.6, Boot 4 üretim geçişinde en anlamlı stabil giriş noktası
- source: [Spring Boot v4.0.6 release notes](https://github.com/spring-projects/spring-boot/releases/tag/v4.0.6), [Spring Boot v4.1.0-RC1 release notes](https://github.com/spring-projects/spring-boot/releases/tag/v4.1.0-RC1)
- author: Spring Boot team
- date: 23 Nisan 2026
- category: platform, maintenance, production-readiness
- tags: spring-boot-4.0.6, spring-boot-4.1.0-rc1, secrets, mongodb, docker-compose, test-starters, ssl
- summary: 4.0.6, gizli veri üretimi, starter eksikleri, reactive Mongo bağımlılıkları ve Compose entegrasyonu gibi maliyetli davranış kusurlarını düzeltiyor; 4.1 RC1 ise daha çok yeni platform kabiliyeti sunuyor.
- why_it_matters: Birçok ekip yeni feature peşinde RC hattına koşuyor; oysa bugünkü üretim gerçeği daha çok maintenance kalitesi gerektiriyor.
- java_spring_relevance: Boot 4’e geçmeyi planlayan veya yeni geçen ekipler için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Boot 4 geçişini RC riski almadan daha kontrollü başlatmak.
- risks: 4.1 RC1’i stabil 4.0 bakım hattı yerine doğrudan üretim adayı görmek.
- migration_notes: Üretim için önce `4.0.6` üstünde smoke/regression çalıştırmak, `4.1` denemelerini ayrı compatibility lane’de tutmak daha doğru.

### Bulgu 3

- title: Spring Cloud 2025.1.1, client governance başlıklarını çerçeve standardına yaklaştırıyor
- source: [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud), [Spring Release Highlights](https://spring.io/projects/release-highlights), [Spring Cloud release reference](https://docs.spring.io/spring-cloud-release/reference/spring-projects.html)
- author: Spring Cloud team / Spring portfolio
- date: 11 Mayıs 2026 itibarıyla güncel proje sayfaları
- category: cloud, microservices, api-governance
- tags: spring-cloud-2025.1.1, oakwood, interface-clients, circuit-breaker, load-balancer, api-versioning, boot-4
- summary: Oakwood hattı `Boot 4.0.x` ile net eşleşiyor; release highlights tarafı interface client’lar için circuit breaker, `lb://` desteği ve Gateway API versioning’i öne çıkarıyor.
- why_it_matters: Mikroservis ekiplerinin istemci politikalarını uygulama bazlı yardımcı koddan çıkarıp platform bazlı standartlara taşımasına yardım ediyor.
- java_spring_relevance: Spring Cloud, Gateway, discovery veya service-to-service HTTP kullanan ekipler için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Dış çağrılarda ortak retry/circuit-breaker/load-balancing politikası oluşturmak.
- risks: Boot/Cloud train’lerini karıştırarak sessiz classpath kırıkları üretmek.
- migration_notes: `2025.1.x` yalnız `Boot 4.0.x` ile denenmeli; `2025.0.x` kullanan hatlar `Boot 3.5.x` dışında zorlanmamalı.

### Bulgu 4

- title: JDK 21.0.11 CPU, TLS güveni ve zaman verisi tarafında doğrudan operasyonel sonuç üretiyor
- source: [JDK 21.0.11 release notes](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html), [Oracle Critical Patch Update April 2026 for Java SE](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm)
- author: Oracle Java Platform Group
- date: 21 Nisan 2026
- category: jdk, security, operations
- tags: jdk-21, cpu, tzdata-2026a, tls, certificates, baseline, java-management-service
- summary: `21.0.11+9` security baseline’i, `tzdata 2026a`, Temmuz 2026 CPU uyarısı ve Chunghwa kök sertifikaları için yeni güvensizleştirme kuralı ile geliyor.
- why_it_matters: Bu değişiklikler uygulama koduna dokunmadan bağlantı, zamanlama ve altyapı davranışını etkileyebilir.
- java_spring_relevance: JDK 21 üstünde çalışan bütün Spring Boot servisleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: JDK patch yönetimini uygulama release sürecine daha bilinçli entegre etmek.
- risks: Eski trust chain, ihmal edilmiş JDK baseline ve gecikmiş CPU patch’leri nedeniyle saha arızaları.
- migration_notes: TLS endpoint envanteri ve CA zinciri kontrolü yapılmalı; Temmuz 2026 CPU penceresi takvime şimdiden alınmalı.

### Bulgu 5

- title: JDK 27 sinyallerinde JEP 532 gürültüsü ile JEP 527 kalıcı değeri ayrışıyor
- source: [JEP 532](https://openjdk.org/jeps/532), [JEP 527](https://openjdk.org/jeps/527), [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/)
- author: OpenJDK
- date: 8 Mayıs 2026 ve 11 Mayıs 2026 itibarıyla proje sayfası
- category: language, runtime, roadmap
- tags: jdk-27, jep-532, jep-527, preview, pattern-matching, post-quantum-tls
- summary: JEP 532, JDK 27 için beşinci preview olarak yeniden hedeflenirken; gerçek üretim etkisi açısından hâlâ TLS 1.3 için post-quantum hybrid key exchange getiren JEP 527 daha önemli duruyor.
- why_it_matters: Her JEP aynı önemde değil; ekiplerin izleme bütçesi sınırlıysa dil ergonomisi ile runtime güvenliğini ayırması gerekir.
- java_spring_relevance: Spring uygulama ekipleri için orta; platform/runtime ekipleri için orta-yüksek.
- actionability: izlemeye_değer
- impact_level: orta
- opportunities: Eğitim ve teknik keşif ortamlarında yeni pattern matching kullanımını denemek.
- risks: Preview dil özelliklerini gerçek üretim roadmap etkisiyle karıştırmak.
- migration_notes: JEP 532 için acil migration ihtiyacı yok; JEP 527 tarafında ise TLS ve proxy uyumluluğu ilerleyen aylarda test edilmeli.

### Bulgu 6

- title: Oracle’ın JVP ve GraalVM takvim sinyali, native stratejiyi JDK’den gevşetiyor
- source: [Announcing the Oracle Java Verified Portfolio](https://blogs.oracle.com/java/announcing-jvp), [Detaching GraalVM from the Java Ecosystem Train](https://blogs.oracle.com/java/detaching-graalvm-from-the-java-ecosystem-train), [GraalVM release calendar](https://www.graalvm.org/release-calendar/)
- author: Donald Smith / Oracle, GraalVM team
- date: 17 Mart 2026, 15 Eylül 2025 ve güncel release calendar
- category: native, ecosystem, support-model
- tags: graalvm, native-image, oracle-jvp, helidon, release-cadence, support
- summary: Oracle, JDK çevresindeki destekli bileşenleri JVP altında ayırırken GraalVM’in Java release train ile bire bir gitmeyeceğini daha görünür hale getiriyor; güncel release calendar da CPU-temelli ayrı ritmi netleştiriyor.
- why_it_matters: Native image veya GraalVM kullanan ekiplerde sürüm planlama ve destek beklentileri doğrudan etkileniyor.
- java_spring_relevance: Spring Native/AOT veya GraalVM kullanan ekipler için orta-yüksek; diğerleri için düşük-orta.
- actionability: planlı_aksiyon
- impact_level: orta
- opportunities: Native toolchain’i daha bilinçli, ayrı yaşam döngüsüyle yönetmek.
- risks: GraalVM sürümünü JDK sürümüyle otomatik eş kabul edip patch veya destek boşluğu yaratmak.
- migration_notes: Native pipeline’larda JDK, GraalVM, build tools ve Spring AOT matrisi ayrı takip edilmeli.

### Bulgu 7

- title: Hardwood Beta2, veri yoğun JVM yan iş yükleri için izlenebilir ama çekirdek Spring gündemi değil
- source: [Gunnar Morling - Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/), [InfoQ Java News feed](https://www.infoq.com/java/news/)
- author: Gunnar Morling
- date: 29 Nisan 2026
- category: tooling, data, performance
- tags: hardwood, parquet, variant, tui, s3, object-storage, batch
- summary: Hardwood Beta2, VARIANT desteği, interaktif TUI ve daha iyi object storage/parquet okuma özellikleri getiriyor.
- why_it_matters: Tipik REST CRUD Spring servisleri için değil; ama veri işleyen batch, lakehouse veya analytics yan servisleri için ilginç bir Java araç sinyali.
- java_spring_relevance: Genel Spring ekipleri için düşük; veri platformu ve batch ekipleri için orta.
- actionability: düşük_öncelik_izleme
- impact_level: düşük-orta
- opportunities: Minimal bağımlılıklı Parquet işleme ve hızlı CLI/TUI inceleme akışları.
- risks: Erken beta olduğu için geniş üretim standardı gibi ele alınması.
- migration_notes: Bugün için POC veya laboratuvar düzeyinde değerlendirilmeli; ana uygulama standardı yapılmamalı.

## Sonuç

Bugünün en kalıcı mühendislik sinyali, yeni feature heyecanı değil; desteklenen güvenlik hattında kalma disiplini. Spring Security sürüm matrisi, Boot 4 stabilizasyonu, Cloud 2025.1.1 hizası ve JDK 21.0.11 operasyonel notları birlikte okunduğunda, Java/Spring ekiplerinin önümüzdeki birkaç haftada en çok değer üreteceği alanın “daha yeni kütüphane” değil “daha net destek ve runtime politikası” olduğu görülüyor.

İkinci önemli ayrım da şu: JDK 27 preview ve yan ekosistem araçları izlemeye değer, ama kısa vadeli üretim kararı yaratmıyor. Üretim etkisi yüksek kararlar bugün için hâlâ security patch, release-train uyumu, TLS/CA davranışı ve client governance başlıklarında.
