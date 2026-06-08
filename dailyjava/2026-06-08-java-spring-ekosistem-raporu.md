# Günlük Java / Spring Ekosistem Raporu

Tarih: 8 Haziran 2026  
Tarama zamanı: 8 Haziran 2026 09:06 TSİ  
Odak: Spring Cloud güvenlik fix seviyeleri ile release-train uyumsuzluğu, JDK 27'nin TLS ve serviceability yüzeyindeki operasyonel etkileri, ve üretim odaklı araç/kütüphane güncellemeleri

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security/), Spring Cloud, Spring AI ve Spring Modulith GitHub release kayıtları, [OpenJDK JEP sayfaları](https://openjdk.org/jeps/0), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long'un This Week in Spring yazısı](https://spring.io/blog/2026/06/02/this-week-in-spring-june-2-2026/), [Gunnar Morling'in blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY'ın blogu](https://blog.burakkutbay.com/) kontrol edildi. 8 Haziran 2026 itibarıyla Spring Boot, Spring Framework ve Spring Security tarafında 7 Haziran sonrasına ait yeni bir GA/patch duyurusu görünmüyor. Bugünün en yüksek karar etkisi, 8-14 Haziran güvenlik penceresine girerken Spring Cloud Config ve Spring Cloud Function fix seviyelerinin mevcut release-train BOM'larıyla tam hizalı olmaması ve JDK 27'nin doğrudan TLS, teşhis ve çalışma zamanı sözleşmelerine dokunan değişikliklerinde toplandı. Baeldung, Burak KUTBAY ve Gunnar Morling tarafında yararlı içerikler vardı; ancak bugün üretim önceliğini değiştiren sinyal, esas olarak advisory, release ve JEP yüzeyinde oluştu.

## Öne Çıkan Başlıklar

- [Spring Cloud Config](https://spring.io/blog/2026/05/08/spring-cloud-april-releases/) ve [Spring Cloud Function](https://spring.io/blog/2026/05/08/spring-cloud-april-releases/) için Mayıs başında yayımlanan güvenlik fix'leri, 8 Haziran 2026 itibarıyla hâlâ aktif bir sürüm yönetimi riski: OSS fix seviyeleri `Config 4.3.3 / 5.0.3` ve `Function 4.3.3 / 5.0.2`, ancak [Spring Cloud 2025.0.2](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released/) BOM'u `Config 4.3.2` ve `Function 4.3.2` seviyesinde.
- [CVE-2026-40982](https://spring.io/security/cve-2026-40982), [CVE-2026-40981](https://spring.io/security/cve-2026-40981), [CVE-2026-41002](https://spring.io/security/cve-2026-41002) ve [CVE-2026-41004](https://spring.io/security/cve-2026-41004) birlikte okunduğunda, Spring Cloud Config Server'ın yalnız tekil bir bug değil, merkezi konfigürasyon güven sınırını etkileyen çok parçalı bir risk yüzeyi taşıdığı görülüyor.
- [JEP 527](https://openjdk.org/jeps/527) 5 Haziran 2026 itibarıyla JDK 27 için `Delivered`; `X25519MLKEM768` hibrit anahtar değişimi varsayılan listede en öne geliyor. `javax.net.ssl` kullanan Java uygulamaları, özel named group sabitlemesi yapmıyorsa kod değiştirmeden post-quantum TLS'e yaklaşabiliyor.
- [JDK 27 JSON thread dump heads-up](https://inside.java/2026/05/20/quality-heads-up/) artık `processId`, `tid` ve `threadCount` alanlarını string değil numeric üretip `formatVersion: 2` ekliyor. Bu, observability betikleri ve incident araçları için sessiz ama gerçek bir kırılım.
- [OpenJDK Quality Outreach heads-up listesi](https://inside.java/headsup/) JDK 27 rampdown yaklaşırken `final field mutation` uyarılarını yeniden öne taşıyor. [JEP 500](https://openjdk.org/jeps/8349536) hattı nedeniyle reflection ile `final` alan mutasyonu yapan kütüphaneler için zaman daralıyor.

## Kritik Güncellemeler

### 1. Spring Cloud tarafında asıl sorun yalnız CVE sayısı değil, BOM ile fix seviyesinin ayrışması

[Spring Cloud Function and Config Have Been Released To Address Several CVEs](https://spring.io/blog/2026/05/08/spring-cloud-april-releases/) yazısı ile ilgili advisory sayfaları bir arada okunduğunda şu tablo çıkıyor:

- Spring Cloud Config için OSS fix sürümleri `4.3.3` ve `5.0.3`.
- Spring Cloud Function için OSS fix sürümleri `4.3.3` ve `5.0.2`.
- Config tarafında dört advisory birlikte geliyor:
  - [CVE-2026-40982](https://spring.io/security/cve-2026-40982/): `spring-cloud-config-server` ile directory traversal, `CRITICAL`
  - [CVE-2026-40981](https://spring.io/security/cve-2026-40981/): Google Secrets Manager backend kullanırken istemcinin yetkisiz GCP proje secret'larına erişebilmesi, `HIGH`
  - [CVE-2026-41002](https://spring.io/security/cve-2026-41002/): `spring.cloud.config.server.git.basedir` üzerinde TOCTOU saldırısı, `HIGH`
  - [CVE-2026-41004](https://spring.io/security/cve-2026-41004/): trace log açıkken hassas verinin plain text loglara düşmesi, `MEDIUM`
- Function tarafında iki advisory var:
  - [CVE-2026-40989](https://spring.io/security/cve-2026-40989/): self-routing guard bypass ile kompozisyon altında OOM riski
  - [CVE-2026-40990](https://spring.io/security/cve-2026-40990/): function registry'de unbounded cache ile OOM riski

Asıl kritik nokta şu:

- [Spring Cloud 2025.0.2 (Northfields)](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released/) 2 Nisan 2026'da yayınlandı.
- Bu release train, [Spring Cloud proje sayfasına](https://spring.io/projects/spring-cloud/) göre `Spring Boot 3.5.x` hattına karşılık geliyor.
- Aynı release notu, `2025.0.2` içinde `Spring Cloud Config 4.3.2` ve `Spring Cloud Function 4.3.2` geldiğini açıkça yazıyor.

Bu neden kritik:

- `spring-cloud-dependencies:2025.0.2` kullanıyor olmak, 8 Haziran 2026 itibarıyla bu CVE'leri otomatik olarak kapatmıyor.
- Özellikle `Boot 3.5.x + Northfields` kullanan ekipler "release train'in son servis sürümündeyiz" diye düşünse bile Config ve Function için bir service release daha ileri gitmek zorunda.
- Config Server çoğu kurumda "internal" kabul edilse bile blast radius'i yüksektir; çünkü hem config okuma yüzeyi hem secret erişim sınırı hem de git clone/trace logging davranışı aynı bileşende toplanıyor.

Net yorum: Bugünün en güçlü Spring sinyali yeni feature değil, merkezi dependency management yaklaşımının güvenlik penceresinde yetersiz kalabildiği gerçeği.

### 2. JDK 27, JSSE tabanlı TLS için post-quantum hibrit anahtar değişimini pratikleştiriyor

[JEP 527](https://openjdk.org/jeps/527) 5 Haziran 2026 güncellemesiyle `Release 27` için `Closed / Delivered` durumda. [Inside Java heads-up](https://inside.java/2026/05/17/quality-heads-up/) da aynı değişikliği kalite tarama çağrısıyla öne çıkarıyor.

Öne çıkan teknik noktalar:

- JDK'nin TLS 1.3 implementasyonu üç hibrit named group getiriyor:
  - `X25519MLKEM768`
  - `SecP256r1MLKEM768`
  - `SecP384r1MLKEM1024`
- Varsayılan listede `X25519MLKEM768` en öne alınıyor.
- JEP metni açık: Uygulama özel named group seçmiyorsa mevcut kodu değiştirmeden quantum-resistant TLS avantajı görülebilir.
- Override noktaları hâlâ var:
  - JVM seviyesi `jdk.tls.namedGroups`
  - Programatik `SSLParameters::setNamedGroups(...)`

Bu neden kritik:

- Bu değişiklik Java backend ekipleri için "gelecek vizyonu" seviyesinde kalmıyor; tam tersine JSSE tabanlı outbound ve inbound TLS yollarında runtime default değişimi yaratıyor.
- Spring Boot servislerinde Tomcat/Jetty, JDK SSL stack kullanan istemciler, bazı JDBC sürücüleri ve Kafka benzeri JSSE tabanlı istemciler bundan doğrudan etkilenebilir.
- Tersine, kendi TLS sağlayıcısını kullanan veya named groups listesini sert biçimde sabitleyen bileşenlerde interop testi şart.

Net yorum: JDK 27'nin güvenlik tarafındaki en kalıcı üretim değeri, iş mantığına dokunmadan TLS katmanını daha ileri taşıması olabilir; ama bunu "kodsuz geçiş" diye okuyup proxy, LB ve policy katmanını test etmemek hatalı olur.

### 3. JDK 27 JSON thread dump formatı, incident araç zincirini sessizce kırabilir

[Quality Outreach Heads-up - JDK 27: Numeric Fields in JSON Thread Dumps](https://inside.java/2026/05/20/quality-heads-up/) küçük görünen ama prod araçları için yüksek etkili bir değişiklik içeriyor:

- `com.sun.management.HotSpotDiagnosticMXBean.dumpThreads`
- `jcmd <PID> Thread.dump_to_file -format=json`

çıktıları artık şu farklarla geliyor:

- `processId`, `tid` ve `threadCount` string değil numeric
- yeni `formatVersion: 2` alanı var

Bu neden kritik:

- Pek çok kurumda JSON thread dump, sadece manuel debug aracı değil; SIEM, internal parser, support portal, log enrichment veya otomatik incident toplama hattının girdisi.
- Şema değişikliği gürültülü bir exception üretmeyebilir; tip dönüşümü yüzünden dashboard, ingest pipeline ya da analiz betiği sessizce bozulabilir.
- Spring ekipleri çoğu zaman JVM inceleme katmanını platform/SRE tarafına bırakır; bu yüzden uygulama ekipleri ile platform ekipleri arasında "bize dokunmaz" boşluğu oluşur.

Net yorum: JDK 27 pilotunda performans benchmark kadar önemli bir iş, thread dump tüketen her dahili aracı `formatVersion: 2` ve numeric alanlarla test etmektir.

### 4. JDK 27 rampdown yaklaşırken final field mutation borcu görünür hale geliyor

[Inside Java heads-up indeksinde](https://inside.java/headsup/) 22 Mayıs 2026 tarihli "Newsletter: JDK 27 Approaches Rampdown | Final Field Mutation Warnings Heads-up" notu öne çıkıyor. Bu, [JEP 500](https://openjdk.org/jeps/8349536) ile başlayan daha büyük hareketin parçası:

- JDK 26'dan itibaren deep reflection ile `final` field mutasyonu warning üretiyor.
- Gelecek bir JDK sürümünde bunun exception seviyesine yükselmesi hedefleniyor.
- JEP 500, offender tespiti için iki pratik yol veriyor:
  - `--illegal-final-field-mutation=debug`
  - JFR üstünden `jdk.FinalFieldMutation` event'lerini izlemek

Bu neden kritik:

- Spring'in güncel önerileri constructor injection ve açık sözleşme yönünde olduğu için doğrudan uygulama kodu çoğu zaman güvende olabilir.
- Ama serialization, mocking, ORM, bytecode manipulation, test fixture veya legacy framework katmanında `final` alan mutasyonu hâlâ görülebilir.
- Sorun genelde uygulama değil, transitif bağımlılık veya test altyapısı içinde saklanır.

Net yorum: JDK 27'ye hazırlanırken bugünün aksiyonu bu warning'i yok saymak değil, JDK 26/27 EA üstünde offender inventory çıkarmaktır.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring güvenlik operasyonu artık "BOM güncelle, geç" kadar basit değil

Tekrarlayan desen açık:

- güvenlik fix'leri service release olarak geliyor,
- release train bunları aynı anda emmeyebiliyor,
- merkezi config ve function routing gibi yatay bileşenler, tek servis bug'ından daha büyük risk yaratıyor.

Çıkarım: Kurumsal Spring ekipleri yalnız release-train seviyesinde değil, alt modül seviyesinde de patch doğrulaması yapmalı.

### Trend Kümesi 2: JDK 27'nin en kalıcı değeri sözdiziminden çok runtime sözleşmesinde

- TLS named groups varsayılanı değişiyor,
- JSON thread dump şeması değişiyor,
- final field mutation toleransı daralıyor.

Çıkarım: JDK 27 hazırlığı için en kritik checklist maddeleri dil özelliği denemeleri değil; network, parser, teşhis ve compatibility runbook'ları.

### Trend Kümesi 3: Toplulukta AI/MCP heyecanı sürüyor ama bugünün dayanıklı değeri hâlâ güvenlik ve operability

- Baeldung tarafında Spring AI subagent orchestration ve MCP UI içerikleri güncel ve öğretici.
- Spring AI etrafındaki topluluk üretimi artıyor.
- Buna rağmen 8 Haziran 2026 için doğrudan üretim kararı etkileyen esas konu agent pattern değil; fix seviyesi, TLS interop ve toolchain uyumu.

Çıkarım: Agentik pattern'ler izlenmeli; fakat bugünün kurumsal Java/Spring yol haritasında patch hijyeni ve runtime geçiş disiplini daha yüksek öncelikli.

### Hype mı, kalıcı mı?

- Kalıcı mühendislik değeri yüksek: Spring Cloud Config/Function fix seviyesi yönetimi, JDK 27 hibrit TLS, JSON thread dump şema uyumu
- İzle ve pilotla: final field mutation offender envanteri, Spring Modulith 2.1 RC1
- Düşük öncelik: [Baeldung'in Spring AI subagent orchestration yazısı](https://www.baeldung.com/spring-ai-subagent-orchestration), [Baeldung'in MCP içine HTML UI gömme yazısı](https://www.baeldung.com/spring-ai-embed-mcp-server-html-ui), [Gunnar Morling'in Hardwood 1.0.0.CR1 duyurusu](https://www.morling.dev/blog/) tipik Spring Boot mikroservis backlog'unu bugün tek başına değiştirmiyor

## Araçlar ve Kütüphaneler

- [Spring Modulith 2.0.6](https://github.com/spring-projects/spring-modulith/releases/tag/2.0.6): `JdbcEventPublicationRepository` tarafında "currently processing publication" silinmesi hatasını ve failed publication batch işleme sorunlarını düzeltiyor. `Spring Boot 4.0.6` ve `Spring Framework 7.0.7` hizalaması var.
- [Spring Modulith 2.1.0-RC1](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0-RC1): JobRunr transaction handling iyileştirmesi, unified event externalization altyapısı ve `Boot 4.1` hattına hazırlık getiriyor. Modulith/outbox kullanan ekipler için orta-yüksek öncelikli.
- [Hardwood 1.0.0.CR1](https://www.morling.dev/blog/): Gunnar Morling'in Parquet odaklı Java 21+ kütüphanesi ilk candidate release'ine geldi; column reader API ve geospatial destek ekliyor. Veri işleme yoğun JVM servisleri için izlenebilir, ama klasik Spring CRUD/microservice hattında düşük öncelikli.
- Bugün mainstream Spring Boot backend'leri doğrudan etkileyen yeni bir bağımsız OSS araç dalgası görünmüyor. Gürültüden çok düzeltme ve uyumluluk haftasındayız.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Boot 3.5.x + Spring Cloud 2025.0.x` hattındaysanız ve Config/Function kullanıyorsanız, yalnız release train BOM'una güvenmeyin. Modül seviyesinde fix sürümlerini ayrıca doğrulayın.
- Config Server çalıştırıyorsanız şu dört noktayı ayrı ayrı denetleyin:
  - file-serving endpoint yüzeyi
  - Google Secrets Manager backend kullanımı
  - `spring.cloud.config.server.git.basedir` konumu
  - trace log açık mı
- `Spring Boot 4.0.x + Spring Cloud 2025.1.x` hattında JSSE tabanlı TLS kullanıyorsanız, JDK 27 pilotlarında named groups override edip etmediğinizi envantere çıkarın.
- Incident tooling'iniz JSON thread dump parse ediyorsa, `formatVersion: 2` ve numeric `processId`/`tid`/`threadCount` desteği için test ekleyin.
- JDK 26/27 EA ile bir doğrulama profili açıp `--illegal-final-field-mutation=debug` ve JFR üstünden offender çıkarın. Bu iş prod geçiş gününe bırakılmamalı.
- Modulith kullanan ekipler için event publication repository ve outbox benzeri akışlar, 2.0.6/2.1.0-RC1 notları yeniden okunacak kadar önemli.

## Fırsatlar ve Riskler

- Fırsat: JDK 27 ile JSSE tabanlı servislerde ek uygulama kodu yazmadan post-quantum TLS hazırlığına yaklaşmak
- Fırsat: JSON thread dump format versiyonlamasını fırsat bilip iç observability araçlarını daha dayanıklı hale getirmek
- Fırsat: Spring Cloud fix seviyelerini merkezi governance altında yönetip release-train bağımlılığını daha şeffaf hale getirmek
- Risk: `spring-cloud-dependencies:2025.0.2` kullandığı için güvende olduğunu sanmak
- Risk: Config Server'ı "sadece internal" diye sınıflandırıp directory traversal, secret leakage ve TOCTOU sınıfı riskleri küçümsemek
- Risk: `jdk.tls.namedGroups` veya özel TLS policy nedeniyle JDK 27 hibrit handshake'lerinde sürpriz interop sorunları yaşamak
- Risk: JSON thread dump şema değişimini küçük görüp kriz anında parser kırılmasıyla karşılaşmak
- Risk: final field mutation warning'lerini testte görüp production geçişine kadar ertelemek

## İzlenmesi Gereken Konular

- Spring Cloud `2025.0.x` ve `2025.1.x` için yeni bir service release gelip Config/Function güvenlik fix'lerini BOM içine ne zaman alacak
- 8-14 Haziran 2026 güvenlik penceresinde Spring portföyünden hangi ek patch sürümleri çıkacak
- JDK 27 hibrit TLS default'larının kurum içi reverse proxy, service mesh, FIPS veya WAF zincirlerinde ek interop sorunu doğurup doğurmayacağı
- JSON thread dump `formatVersion` yüzeyinde ek şema değişikliği gelip gelmeyeceği
- JDK 27 rampdown yaklaşırken ek OpenJDK Quality Outreach uyarılarının hangi framework ve kütüphaneleri etkileyebileceği
- Spring AI, Spring Security ve Spring Cloud tarafında Haziran ortası yeni advisory veya forced service release gelip gelmeyeceği

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Cloud patch haftası, release-train BOM'un tek başına yetmediğini gösteriyor
- source: [Spring Cloud Function and Config Have Been Released To Address Several CVEs](https://spring.io/blog/2026/05/08/spring-cloud-april-releases/), [CVE-2026-40982](https://spring.io/security/cve-2026-40982/), [CVE-2026-40981](https://spring.io/security/cve-2026-40981/), [CVE-2026-41002](https://spring.io/security/cve-2026-41002/), [CVE-2026-41004](https://spring.io/security/cve-2026-41004/), [CVE-2026-40989](https://spring.io/security/cve-2026-40989/), [CVE-2026-40990](https://spring.io/security/cve-2026-40990/), [Spring Cloud 2025.0.2 (aka Northfields) Has Been Released](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released/), [Spring Cloud project page](https://spring.io/projects/spring-cloud/)
- author: Ryan Baxter; Spring Security Advisory Team
- date: 2 Mayıs 2026 - 8 Mayıs 2026, operasyonel öncelik 8 Haziran 2026 itibarıyla çok yüksek
- category: security, dependency-management, config-server, function-runtime
- tags: spring-cloud-config, spring-cloud-function, northfields, boot-3-5, cve-2026-40982, cve-2026-40981, cve-2026-41002, cve-2026-41004, cve-2026-40989, cve-2026-40990
- summary: Config Server tarafında directory traversal, GCP secret scope bypass, TOCTOU ve sensitive logging; Function tarafında recursion/cache kaynaklı OOM riskleri var. Buna karşılık Northfields `2025.0.2` BOM'u hâlâ `Config 4.3.2` ve `Function 4.3.2` taşıyor.
- why_it_matters: Release-train seviyesinde güncel olmak, bugünün Spring Cloud güvenlik penceresinde yeterli güvence değil.
- java_spring_relevance: Spring Cloud kullanan kurumsal mikroservis ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Merkezi BOM override politikası kurmak, Config Server güven sınırını daha sıkı modellemek, config ve function bileşenlerini ayrı patch yönetimiyle ele almak.
- risks: Kritik dosya erişimi, yetkisiz secret okuma, log sızıntısı, ve kompozisyon altındaki OOM risklerinin aynı anda üretim ortamına taşınması.
- migration_notes: `Boot 3.5.x` ve `2025.0.x` hattında Config için en az `4.3.3`, Function için en az `4.3.3` seviyesine çıkılmalı. `Boot 4.0.x` hattında ilgili OSS fix seviyeleri Config `5.0.3` ve Function `5.0.2`. GCP Secrets Manager backend kullanılıyorsa geçici olarak `spring.cloud.config.server.gcp-secret-manager.token-mandatory=true` değerlendirilmeli.

### Bulgu 2

- title: JDK 27, JSSE tabanlı TLS için hibrit post-quantum anahtar değişimini varsayılanlaştırıyor
- source: [JEP 527: Post-Quantum Hybrid Key Exchange for TLS 1.3](https://openjdk.org/jeps/527), [Quality Outreach Heads-up - JDK 27: Post-Quantum Hybrid Key Exchange for TLS 1.3](https://inside.java/2026/05/17/quality-heads-up/)
- author: Jamil Nimeh; Ana-Maria Mihalceanu
- date: 17 Mayıs 2026 ve 5 Haziran 2026 güncelleme durumu
- category: platform-security, tls, crypto, runtime-defaults
- tags: jdk-27, tls13, ml-kem, x25519mlkem768, jsse, spring-boot
- summary: JDK 27, `X25519MLKEM768` başta olmak üzere hibrit ML-KEM + ECDHE named group'larını TLS 1.3 default listesine ekliyor. Uygulama özel named group override etmiyorsa quantum-resistant TLS avantajı kod değişmeden görülebilir.
- why_it_matters: Güvenlik kazanımı uygulama mantığından değil runtime default'undan geliyor; bu yüzden değer büyük ama interop riski sessiz.
- java_spring_relevance: JSSE tabanlı TLS kullanan Spring Boot, Kafka, JDBC ve benzeri Java backend bileşenleri için yüksek.
- actionability: pilotla
- impact_level: yüksek
- opportunities: Uygulama koduna dokunmadan servisler arası TLS güvenliğini orta vadede güçlendirmek.
- risks: `jdk.tls.namedGroups` override'ları, özel TLS policy'ler veya eski ara ağ cihazlarıyla handshake uyumsuzluğu yaşamak.
- migration_notes: JDK 27 pilotlarında named groups envanteri çıkarılmalı; reverse proxy, service mesh, WAF, LB ve partner endpoint zinciriyle handshake testleri yapılmalı.

### Bulgu 3

- title: JDK 27 JSON thread dump formatı, observability betiklerini kırabilecek sessiz bir şema değişikliği getiriyor
- source: [Quality Outreach Heads-up - JDK 27: Numeric Fields in JSON Thread Dumps](https://inside.java/2026/05/20/quality-heads-up/)
- author: Ana-Maria Mihalceanu
- date: 20 Mayıs 2026
- category: serviceability, observability, diagnostics
- tags: jdk-27, jcmd, json-thread-dump, formatversion2, processid, tid, threadcount
- summary: `dumpThreads` ve `jcmd Thread.dump_to_file -format=json` çıktıları artık `processId`, `tid` ve `threadCount` alanlarını numeric üretiyor; ayrıca `formatVersion: 2` geliyor.
- why_it_matters: Şema değişikliği JVM tarafında küçük görünse de prod araç zincirinde parser, ETL ve dashboard kırığına dönüşebilir.
- java_spring_relevance: Spring servislerini işleten platform, SRE ve incident-response ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: İç tooling'i versiyon farklarına daha dayanıklı hale getirmek, dump parser'larını test edilebilir sözleşmeye oturtmak.
- risks: Kriz anında otomatik thread dump ingest veya analiz hattının sessizce bozulması.
- migration_notes: `formatVersion` kontrolü eklenmeli; numeric/string ayrımı yapan parser ve JSON schema doğrulamaları güncellenmeli.

### Bulgu 4

- title: JDK 27 rampdown yaklaşırken final field mutation kullanan kütüphaneler için hazırlık penceresi daralıyor
- source: [OpenJDK Quality Outreach Heads Up](https://inside.java/headsup/), [JEP 500: Prepare to Make Final Mean Final](https://openjdk.org/jeps/8349536)
- author: David Delabassee; Ron Pressler; Alex Buckley
- date: 22 Mayıs 2026, arka plan değişikliği JDK 26 ile aktif
- category: platform-compatibility, reflection, runtime-integrity
- tags: jdk-27, jdk-26, final-field-mutation, reflection, jfr, illegal-final-field-mutation
- summary: OpenJDK tarafı JDK 27 rampdown sürecinde final field mutation warning'lerini yeniden öne taşıyor. JDK 26 warning üretiyor; sonraki adım exception'a doğru gidiyor.
- why_it_matters: Sorun çoğu zaman uygulama kodunda değil, transitif bağımlılık veya test altyapısında saklandığı için geç fark edilir.
- java_spring_relevance: Spring ekosisteminde özellikle serialization, mocking, legacy reflection ve framework entegrasyonları olan ekipler için orta-yüksek.
- actionability: izle_ve_test_et
- impact_level: orta-yüksek
- opportunities: Reflection borcunu temizlemek, constructor injection ve daha açık nesne oluşturma sözleşmelerine yönelmek.
- risks: JDK geçişinde warning veya gelecekte hard failure ile karşılaşmak; offender kaynağını geç tespit etmek.
- migration_notes: JDK 26/27 EA test profilinde `--illegal-final-field-mutation=debug` kullanılmalı; JFR `jdk.FinalFieldMutation` event'leri toplanmalı; warning üreten kütüphaneler ayrı backlog maddesi haline getirilmeli.

### Bulgu 5

- title: Spring Modulith 2.0.6 ve 2.1.0-RC1, event publication ve JobRunr entegrasyonunu daha güvenli hale getiriyor
- source: [Spring Modulith 2.0.6 release notes](https://github.com/spring-projects/spring-modulith/releases/tag/2.0.6), [Spring Modulith 2.1.0-RC1 release notes](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0-RC1)
- author: spring-projects maintainers
- date: 24 Nisan 2026
- category: modular-monolith, outbox, eventing, scheduling
- tags: spring-modulith, eventpublicationregistry, jobrunr, boot-4, framework-7, outbox
- summary: `JdbcEventPublicationRepository` tarafında işlenmekte olan publication silinmesi ve failed publication batch işleme sorunları kapanıyor; 2.1.0-RC1 ayrıca JobRunr transaction handling ve unified event externalization iyileştirmeleri getiriyor.
- why_it_matters: Modulith veya outbox-benzeri event publication akışları kullanan ekiplerde bu hatalar veri doğruluğu ve tekrar işleme davranışını doğrudan etkiler.
- java_spring_relevance: Spring Modulith kullanan ekipler için orta-yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Event publication hattını daha güvenilir hale getirmek, Boot 4.x geçişini daha kontrollü yapmak.
- risks: Eski sürümde kalıp publication lifecycle edge-case'lerini prod'a taşımak.
- migration_notes: Özellikle JDBC publication repository veya JobRunr entegrasyonu kullanılıyorsa 2.0.6/2.1.0-RC1 değişiklikleri release notu düzeyinde değil, doğrudan test backlog'u olarak ele alınmalı.

### Bulgu 6

- title: Hardwood 1.0.0.CR1, veri-ağır Java servisleri için izlenebilir fakat düşük öncelikli bir yan araç sinyali
- source: [Gunnar Morling blog](https://www.morling.dev/blog/)
- author: Gunnar Morling
- date: 31 Mayıs 2026
- category: data-tooling, parquet, performance
- tags: hardwood, parquet, java21, geospatial, cli
- summary: Hardwood 1.0.0.CR1, Parquet için daha iyi column reader API'si ve ilk geospatial desteği getiriyor; Java 21+ üzerinde hafif bağımlılık yaklaşımı sunuyor.
- why_it_matters: Spring tabanlı veri işleme veya lakehouse çevresine yakın JVM servislerinde işe yarayabilir.
- java_spring_relevance: Klasik mikroservis hattı için düşük; veri işleme yoğun Java servisleri için seçici biçimde anlamlı.
- actionability: izle
- impact_level: düşük
- opportunities: Hadoop bağımlılığı olmadan daha hafif Parquet işleme akışları kurmak.
- risks: Tipik Spring Boot servisleri için gereksiz dikkat dağıtıcı olabilir.
- migration_notes: Yalnız gerçekten uygulama içinde Parquet parse ediliyorsa değerlendirilmelidir; genel Spring platform backlog'una üst sıralardan girmemeli.

## Sonuç

8 Haziran 2026 için en doğru Java/Spring refleksi yeni framework özelliği kovalamak değil, sürüm yönetimi ve runtime geçiş disiplini uygulamak. Spring Cloud tarafında release-train seviyesinde güncel olmak ile güvenlik açısından güncel olmak aynı şey değil; Config ve Function kullanıcıları bunu bugün özellikle ciddiye almalı. JDK 27 tarafında ise en kritik hazırlık işleri TLS named group uyumluluğu, JSON thread dump parser güncellemesi ve final field mutation offender taraması. Kısacası bugün değer yaratan başlıklar "daha akıllı agent" değil, daha sıkı patch ve daha dayanıklı işletim sözleşmesi.
