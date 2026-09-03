# Günlük Java / Spring Ekosistem Raporu

Tarih: 02 Eylul 2026 Carsamba  
Tarama zamani: 02 Eylul 2026 20:14 TSI  
Tekrar etmeme filtresi: 16 Agustos'taki `Spring AI/MCP contract governance`, 15 Agustos `runtime licensing/CSPU`, 14 Agustos `gateway/gRPC protocol policy`, 13 Agustos `support matrix`, 12 Agustos `editor/LSP guardrail` anlatilari bugunun ana temasi olarak dislandi.  
Odak: 18 Agustos 2026 Oracle CPU ve 20-26 Agustos 2026 Spring release/advisory dalgasi birlikte okundugunda, Java ve Spring patch pencerelerinin artik tek bir operasyon backlog'u gibi yonetilmesi gerekiyor.

Tarama notu: 02 Eylul 2026 20:14 TSI itibariyla [Spring release sayfasi](https://spring.io/blog/category/releases), [Spring Security Advisories](https://spring.io/security), [Spring Projects](https://spring.io/projects), [Spring Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html), [Spring Cloud 2025.1.3 duyurusu](https://spring.io/blog/2026/08/20/spring-cloud-2025-1-3-has-been-released), [Spring Boot 4.1.1](https://spring.io/blog/2026/08/20/spring-boot-4-1-1-available-now), [Spring Boot 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-boot-4-2-0-M1-available-now), [Spring Data 2026.1.0-M1, 2026.0.1 ve 2025.1.7](https://spring.io/blog/2026/08/20/spring-data-2026), [Spring Batch 6.0.5 ve 6.1.0-M1](https://spring.io/blog/2026/08/20/spring-batch-6-0-5-and-6-1-0-M1-available-now), [Spring AMQP 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-amqp-4-2-0-m1-available), [Spring Modulith 2.2 M1](https://spring.io/blog/2026/08/26/spring-modulith-2-2-m1-2-1-1-2-0-8-and-1-4-13-released), [Oracle Java Releases API](https://java.oraclecloud.com/javaReleases?format=json), [Transitioning Java to more frequent security updates](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), [JDK 21 approaches end-of-permissive license](https://blogs.oracle.com/java/jdk-21-approaches-end-of-permissive-license), [jdk.java.net](https://jdk.java.net/), [Inside Java feed](https://inside.java/feed.xml), [InfoQ Spring Boot 4.1 analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/), [Baeldung InetAddressFilter analizi](https://www.baeldung.com/spring-boot-http-client-ssrf-mitigation-inetaddressfilter), [Gunnar Morling blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandi. Josh Long'un [01 Eylul 2026](https://spring.io/blog/2026/09/01/this-week-in-spring-september-1-2026) ve [25 Agustos 2026](https://spring.io/blog/2026/08/25/this-week-in-spring-august-25) akislari Agustos sonundaki release dalgasini halen one cikariyor. Gunnar Morling'in 31 Agustos tarihli Hardwood 1.1.0.Beta1 yazisi ilgi cekici ama bugunun tipik Spring backend kararlarini degistirecek seviyede degil. Burak KUTBAY tarafinda bugunun ana eksenini degistiren daha yeni bir uretim sinyali gorunmedi.

## Öne Çıkan Başlıklar

- Oracle'un 18 Agustos 2026 CPU'su ile JDK `26.0.2.1`, `25.0.4.1` ve `21.0.12.1` guncel security baseline'a geldi; ayni hatta Oracle aylik Java security update ritmini acikca ilan etti.
- Spring'in 20 Agustos 2026 dalgasi tek bir proje patch'i degil; Cloud, Batch, Integration, AMQP ve Data tarafinda deserialization, SSRF, JSON Patch ve trust-boundary temizligi getiren toplu bir portfoy hareketi.
- Spring Boot `4.1.1` resmi olarak Java `26` uyumunu acikca belirtiyor; ancak Spring Cloud `2025.1.3` release train'i duyuru metninde Boot `4.0.8` tabanini kullaniyor. Bu nedenle `Boot 4.1.1 + Cloud 2025.1.3` kombinasyonu destekli olsa da kurum ici canary ve smoke test zorunlu.
- `Spring Boot 4.2.0-M1`, `Spring Modulith 2.2 M1`, `Spring Integration 7.2.0-M1` ve `Spring AMQP 4.2.0-M1` bir sonraki minor hatta `RestClient`, `AMQP 1.0`, buildpack image cache ve daha sert security default'larina gecisin hizlandigini gosteriyor.

## Kritik Güncellemeler

### 1. Oracle CPU ile Spring patch penceresi artik birbirinden bagimsiz okunamaz

[Oracle Java Releases API](https://java.oraclecloud.com/javaReleases?format=json) 18 Agustos 2026 tarihli guncel hatlari `26.0.2.1`, `25.0.4.1`, `21.0.12.1`, `17.0.20.1` ve `11.0.32.1` olarak gosteriyor. [Oracle'un cadence duyurusu](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) ise Java guvenlik guncellemelerinin uce aylik CPU ritminden aylik CSPU ritmine kaydirildigini, Agustos 2026'nin bu gecisin ilk somut orneklerinden biri oldugunu acikca soyluyor.

Bu tek basina onemli; ancak Spring tarafindaki 20 Agustos patch dalgasi ile birlikte okundugunda asil anlamini buluyor. Java ekipleri artik `JDK patch` ve `Spring patch` islerini farkli sprint veya farkli onay zincirlerinde gecistiremez. Ikisi de ayni release engineering kalibina girmeye basliyor.

### 2. JDK 26 artik gercek, ama hala uzun omurlu default degil

[jdk.java.net](https://jdk.java.net/) JDK 26'yi "Ready for use" olarak gosteriyor. [Spring Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html) ise `4.1.1` icin Java 17 minimumunu korurken Java 26 ile uyumu acikca yaziyor. Buna ragmen Oracle API, JDK 26 icin `endOfSupportLifeDate` alanini `17 Eylul 2026` olarak gosteriyor; yani bu hat bir LTS degil ve hizli donus gerektiriyor.

Sonuc acik: `Boot 4.1.1 + Java 26` bir production default'u degil, bir validation ve benchmark lane'i. Ozellikle Cloud, Batch veya Integration yogun sistemlerde JDK 26 uyumu hemen denenmeli; ama uzun sureli operasyon tabani olarak `JDK 25` veya lisans/kurum politikasina gore `JDK 21` daha mantikli.

### 3. JDK 21 lisans penceresi artik somut deadline'a donustu

[JDK 21 approaches end-of-permissive license](https://blogs.oracle.com/java/jdk-21-approaches-end-of-permissive-license) yazisi, Oracle JDK 21 guncellemelerinin `Eylul 2026` sonuna kadar `NFTC`, `Ekim 2026 CPU` ile birlikte ise `OTN` lisansina gececegini netlestiriyor. Bu, onceki haftalardaki teori degil; artik takvime bagli bir gecis.

Spring 4.x / Framework 7.x yoluna girmis ekipler icin bu iki etkili karar doguruyor:

- `Oracle JDK 21` kullanan ucretsiz dagitim tercihlerinin lisans etkisi Ekim 2026 oncesi netlestirilmeli.
- `JDK 25`e gecis backlog'u security, buildpack, native-image ve smoke test planlariyla birlikte ele alinmali.

### 4. 20 Agustos Spring dalgasi, "version bump" degil guvenlik ve davranis temizligi

[Spring Security Advisories](https://spring.io/security) 20 Agustos 2026 gunune ayni gunde dusen Spring Security, Spring Cloud Config, Spring Cloud Function, Spring Cloud Gateway, Spring Data JPA, Spring Data REST, Spring AI, Spring Batch, Spring Integration, Spring AMQP, Reactor Core ve Reactor Netty aciklarini gosteriyor. Bu, portfoy bazli bir cleanup oldugunu anlatan en net sinyal.

Ozellikle dikkat cekici noktalar:

- [Spring Cloud Gateway `CVE-2026-47879`](https://spring.io/security/cve-2026-47879): `JsonToGrpcGatewayFilterFactory` tarafinda proto descriptor kaynagi icin SSRF ve native file access riski.
- [Spring Cloud Function `CVE-2026-59291`](https://spring.io/security/cve-2026-59291): file read/SSRF siniri.
- [Spring Batch `CVE-2026-47875`](https://spring.io/security/cve-2026-47875) ve [CVE-2026-47878](https://spring.io/security/cve-2026-47878): `ExecutionContext` ve job parameter deserialization guvenligi.
- [Spring Integration `CVE-2026-47864`](https://spring.io/security/cve-2026-47864): `SerializingHttpMessageConverter` ile klasik Java deserialization RCE.
- [Spring AMQP `CVE-2026-47860`](https://spring.io/security/cve-2026-47860): poison message ile crash-loop ve JVM cikisi riski.
- [Spring Data JPA `CVE-2026-47834`](https://spring.io/security/cve-2026-47834) ve [Spring Data REST `CVE-2026-47849`](https://spring.io/security/cve-2026-47849): veri erisim katmaninda sort ve JSON Patch trust sinirlari.

Bu toplu desen, bugunun en kalici sinyali: Java serialization, request-derived metadata ve framework-level implicit trust varsayimlari tekrar audit listesine dondu.

### 5. 4.2 hattinda teknik yon net: RestClient, AMQP 1.0 ve image cache

[Spring Boot 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-boot-4-2-0-M1-available-now) iki notayi acik sekilde one cikardi: `AMQP 1.0 support` ve `Image-Based Build Cache Support for Buildpacks`. [Spring Modulith 2.2 M1](https://spring.io/blog/2026/08/26/spring-modulith-2-2-m1-2-1-1-2-0-8-and-1-4-13-released) de ayni cizgide Spring Boot `4.2 M1` ve Framework `7.1 M1` tabanina geciyor.

Bu sinyalin degeri su: Spring ekosistemi bir sonraki minor hatta yalnizca yeni ozellik eklemiyor; platform ekiplerinden daha disiplinli HTTP client, messaging ve image build borcunu kapatmalarini bekliyor.

## Trendler ve Sinyaller

### Trend Kumesi 1: Deserialization ve metadata trust sinirlari geri dondu

Tekrarlayan pattern su:

- Batch, `ExecutionContext` ve `JobParameter` icin daha sert allow-list istiyor.
- Integration, `application/x-java-serialized-object` yolunun artik klasik RCE yuzeyi oldugunu yeniden hatirlatiyor.
- AMQP tarafi `poison message` ve JVM error handler varsayimlarini artik guvenli saymiyor.
- Data REST, `@Id` ve `@Version` alanlarini JSON Patch yoluyla dokunulabilir birakmanin yatay yetki ve lost-update riski yarattigini gosteriyor.
- Data JPA, `Sort` parametresinin native query ile bulustugu yerde sanitization gerektigini acikca soyluyor.

Bu, gundelik patch listesi degil; `uygulama ici veri guvenilir mi?`, `framework hangi objeyi deserialize ediyor?`, `hangi metadata kullanici girdisinden geliyor?` sorularini yeniden one cikaran daha genis bir temizlik.

### Trend Kumesi 2: Patch cadence sikisiyor

Oracle Java tarafindaki aylik guvenlik update niyeti ile Spring tarafindaki portfoy patch toplulugu ayni sey soyluyor: `quarterly patch ritual` dusuncesi artik yetersiz. Patch islemleri:

- daha sik,
- daha capraz bagimli,
- daha cok smoke-test isteyen,
- ve daha fazla platform otomasyonu gerektiren bir seye donusuyor.

### Trend Kumesi 3: RestTemplate mirasi kapanis evresine girdi

[Spring Integration What's New](https://docs.spring.io/spring-integration/reference/whats-new.html) ve [HTTP outbound docs](https://docs.spring.io/spring-integration/reference/http/outbound.html) `RestTemplate` tabanli konfigurasyonun deprecated oldugunu, `RestClient` tabanli modele gecilmesi gerektigini acikca soyluyor. [Spring AMQP 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-amqp-4-2-0-m1-available) da `RestTemplateNodeLocator`'i deprecate ediyor ve SSL hostname verification'ini fiilen daimi hale getiriyor.

Bu sinyal sadece API ergonomisi degil. HTTP client davranisi, timeout, proxy, TLS ve SSRF politikasi artik ayni modernization backlog'unda toplanmali.

### Gurultu mu, kalici deger mi?

- Kalici deger: patch cadence'in JDK ve Spring boyunca tek release engineering problemi haline gelmesi
- Kalici deger: deserialization, JSON Patch ve request-derived metadata icin daha sert trust sinirlari
- Kalici deger: `RestClient`, hostname verification ve outbound allow-list yaklasimlari
- Kalici deger: `Boot 4.1.1`'in Java 26 uyumunu test lane'i olarak kullanmak
- Gurultu: milestone surumleri uretime yakistirmak
- Gurultu: yalnizca BOM bump yapip `ExecutionContext`, `JSON Patch`, `proto descriptor`, `serialized object` gibi riskli yolaklari test etmemek

## Araçlar ve Kütüphaneler

- [Spring Boot 4.1.1](https://spring.io/blog/2026/08/20/spring-boot-4-1-1-available-now): mevcut 4.1 production lane'inin bakim surumu; Java 26 uyumunu resmi olarak dogruluyor.
- [Spring Cloud 2025.1.3 BOM](https://spring.io/blog/2026/08/20/spring-cloud-2025-1-3-has-been-released): Config `5.0.5`, Function `5.0.4`, Gateway `5.0.3`, Stream `5.0.3` gibi fix seviyelerini tek train altinda topluyor.
- [Spring Batch 6.0.5](https://spring.io/blog/2026/08/20/spring-batch-6-0-5-and-6-1-0-M1-available-now): JDBC JobRepository kullanan ekipler icin acil patch adayi.
- [Spring Integration 7.1.1 ve 7.2.0-M1](https://spring.io/blog/2026/08/20/spring-integration-7-2-0-m1-released): security fix + `RestClient` migration sinyali ayni anda geliyor.
- [Spring AMQP 4.1.1 ve 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-amqp-4-2-0-m1-available): messaging guvenligi ve istemci modernizasyonunu beraber getiriyor.
- [Spring Data 2026.0.1 ve 2025.1.7](https://spring.io/blog/2026/08/20/spring-data-2026): service release hattinda security fix, M1 tarafinda ilk `RedisJsonTemplate` sinyali var.
- Dusuk oncelik: Gunnar Morling'in [Hardwood 1.1.0.Beta1](https://www.morling.dev/blog/parquet-file-write-support-bloom-filters-improved-performance-hardwood-1-1-0-beta1-is-out/) yazisi Parquet agirlikli JVM ekipleri icin anlamli; fakat tipik Spring microservice ekipleri icin bugunun esas karar basligi degil.

## Java / Spring Geliştiricileri İçin Etkiler

- JDK patch penceresini Spring patch penceresinden ayirma. `JDK -> BOM -> smoke test -> deploy` zincirini tek release checklist'e donustur.
- `Boot 4.1.1 + Java 26` kombinasyonunu benchmark/canary lane'inde calistir; `JDK 26`yi uzun omurlu default varsayma.
- Oracle JDK 21'i `NFTC` altinda kullaniyorsan Ekim 2026 CPU oncesi lisans ve runtime gecis kararini ver.
- Spring Cloud Gateway kullaniyorsan `JsonToGrpcGatewayFilterFactory` icin file tabanli proto descriptor kullanimini gozden gecir; gerekli yerde `valid-proto-descriptor-prefixes` ile izinli kaynak listesini sabitle.
- Spring Batch JDBC JobRepository kullaniyorsan `ExecutionContext` icindeki custom tipleri say; `DefaultExecutionContextSerializer#setObjectInputFilter(...)` ihtiyacini degerlendir.
- Spring Data REST repository expose ediyorsan JSON Patch ile `@Id` ve `@Version` mutasyonunu kontrol et; sadece auth'e guvenme.
- Native SQL + `Sort` / `Pageable` kullanan Data JPA repository'lerinde parametre sanitization ve integration test yaz.
- Spring Integration veya baska outbound HTTP entegrasyonlarinda `RestTemplate` tabanli client customization'lari `RestClient` backlog'una al.
- AMQP tarafinda poison-message, decompression ve `JavaLangErrorHandler` senaryolarini kaideli test et; "message broker halleder" varsayimini birak.

## Fırsatlar ve Riskler

- Firsat: `Boot 4.1.1` ile Java 26 uyumunu hemen olcup, Eylul ve Ekim patch'leri oncesi runtime gozlemi toplamak
- Firsat: Cloud `2025.1.3` ile Config, Function, Gateway ve Stream fix seviyelerini ayni rollout'ta toplamak
- Firsat: `RestClient` ve outbound allow-list modernizasyonunu security backlog'u ile birlestirmek
- Risk: `Boot 4.1.1 + Cloud 2025.1.3` destekli kombinasyonu "otomatik guvenli" sanip kurum ici smoke testleri atlamak
- Risk: Batch/Integration serializer fix'lerinin custom tip kullanan uygulamalarda sessiz davranis degisikligi yaratmasi
- Risk: Data REST PATCH veya native-query sort yuzeylerinin sadece unit test ile gecistirilmesi
- Risk: JDK 21 lisans penceresini kacirip Ekim 2026'dan sonra plansiz procurement veya runtime degisikligine zorlanmak
- Risk: milestone hatlari uretime alarak patch gerginligini daha da arttirmak

## İzlenmesi Gereken Konular

- `Spring Boot 4.1.2`, `Spring Cloud 2025.1.4`, `Spring Data 2026.0.2` gibi takip patch'lerinde Agustos 20 dalgasinin hangi fixleri stabilize ettigi
- Spring Cloud release notlarinda `Boot 4.1.x` icin daha acik test matrisi veya daha net baseline dili gelip gelmeyecegi
- `Spring Integration 7.2.x` ve `Spring AMQP 4.2.x` hattinda `RestClient` ve hostname verification migration notlarinin ne kadar sertlesecegi
- Oracle'in Ekim 2026 CPU oncesi `monthly Java security update` planini nasil ayrintilandiracagi
- JDK 27 GA ile PQC/TLS ve release cadence'in Spring rollout stratejisini yeniden etkileyip etkilemeyecegi
- Onceki raporun ana ekseni oldugu icin lider hikaye yapmadim; ancak [Spring AI 2.0.1](https://spring.io/blog/2026/08/21/spring-ai-2-0-1-available-now) security ve upgrade notlari agent kullanan ekipler icin ayrica izlenmeli

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Oracle Java security cadence'i aylik ritme kayarken JDK 26 kisa omurlu scout lane'e donustu
- `source`: [Oracle Java Releases API](https://java.oraclecloud.com/javaReleases?format=json) | [Transitioning Java to more frequent security updates](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) | [JDK 21 approaches end-of-permissive license](https://blogs.oracle.com/java/jdk-21-approaches-end-of-permissive-license) | [jdk.java.net](https://jdk.java.net/)
- `author`: Donald Smith, Oracle Java team
- `date`: 18 Agustos 2026 CPU, 14 Agustos 2026 lisans notu, 02 Eylul 2026 dogrulamasi
- `category`: `runtime-governance`, `security-operations`, `licensing`, `release-cadence`
- `tags`: `jdk-26.0.2.1`, `jdk-25.0.4.1`, `jdk-21.0.12.1`, `nftc`, `otn`, `monthly-cspu`
- `summary`: Oracle API guncel JDK hatlarini 18 Agustos CPU ile yenilenmis gosteriyor; Oracle blogu ise Java guvenlik guncellemelerini aylik ritme kaydirirken JDK 21'in permissive lisans penceresinin Ekim 2026 CPU ile kapanacagini acikca belirtiyor.
- `why_it_matters`: JDK secimi artik yalnizca performans veya language feature karari degil; patch ritmi, lisans ve release engineering karari.
- `java_spring_relevance`: Spring Boot 4.x/Framework 7.x ekipleri runtime lane'lerini ve deploy temposunu bu degisime gore planlamak zorunda.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: Java 26 ile erken uyumluluk testi, JDK 25 ile daha net production baseline, otomatik JDK envanteri
- `risks`: Plansiz lisans gecisi, kisa omurlu non-LTS'yi production default sanmak, JDK ve Spring patch'lerini ayri yonetmek
- `migration_notes`: `prod=25`, `legacy/bridge=21`, `validation=26` gibi acik runtime lane politikasi yaz; Oracle JDK 21 NFTC kullanimini Ekim 2026 oncesi netlestir

### Bulgu 2

- `title`: Spring Boot 4.1.1 production lane'i Java 26'yi aciyor; 4.2.0-M1 ise bir sonraki minor backlog'unu gosteriyor
- `source`: [Spring Boot 4.1.1 available now](https://spring.io/blog/2026/08/20/spring-boot-4-1-1-available-now) | [System Requirements](https://docs.spring.io/spring-boot/system-requirements.html) | [Spring Boot 4.2.0-M1 available now](https://spring.io/blog/2026/08/20/spring-boot-4-2-0-M1-available-now) | [InfoQ Spring Boot 4.1 analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/)
- `author`: Phil Webb, Spring Boot team, Karsten Silz
- `date`: 20 Agustos 2026, 02 Eylul 2026 dogrulamasi
- `category`: `release-engineering`, `compatibility`, `platform-lanes`, `build`
- `tags`: `spring-boot-4.1.1`, `spring-framework-7.0.9`, `java-26`, `spring-boot-4.2.0-m1`, `amqp-1.0`, `image-based-build-cache`
- `summary`: Boot 4.1.1 bakim surumu Java 17 minimumunu korurken Java 26 uyumunu resmileştiriyor; 4.2.0-M1 ise AMQP 1.0 ve buildpack image cache gibi bir sonraki dalganin omurgasini gosteriyor.
- `why_it_matters`: Production lane ile validation lane'in ayrilmasi netlesiyor; ekiplerin "tek surum herkese yeter" yaklasimi zayifliyor.
- `java_spring_relevance`: Boot kullanan tum ekiplerin JDK, messaging ve image build stratejilerini dogrudan etkiler.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: Java 26 benchmarking, image cache denemeleri, AMQP 1.0 hazirligi
- `risks`: 4.2 milestone ozelliklerini production sorunu cozum araci gibi kullanmak, 4.1.1'i smoke-testsiz gecmek
- `migration_notes`: 4.1.1'i mevcut production lane'de patch olarak ele al; 4.2.0-M1'i yalnizca internal starter, platform BOM ve CI compatibility lane'inde dene

### Bulgu 3

- `title`: Spring Cloud 2025.1.3, Boot 4.1 ekosistemine destek verirken guvenlik agirlikli bir GA train olarak geldi
- `source`: [Spring Cloud 2025.1.3 duyurusu](https://spring.io/blog/2026/08/20/spring-cloud-2025-1-3-has-been-released) | [Spring Cloud project page](https://spring.io/projects/spring-cloud) | [CVE-2026-47879](https://spring.io/security/cve-2026-47879) | [CVE-2026-59291](https://spring.io/security/cve-2026-59291)
- `author`: Ryan Baxter, Spring team
- `date`: 20 Agustos 2026, 02 Eylul 2026 dogrulamasi
- `category`: `microservices-platform`, `security`, `release-train`, `compatibility`
- `tags`: `spring-cloud-2025.1.3`, `oakwood`, `spring-cloud-gateway-5.0.3`, `spring-cloud-function-5.0.4`, `spring-cloud-config-5.0.5`, `boot-4.0.8`, `boot-4.1.x`
- `summary`: Cloud 2025.1.3 train'i Config, Function, Gateway ve Stream tarafinda cok sayida fix getiriyor. Duyuru metni train'in Boot 4.0.8 tabanini kullandigini soylerken proje sayfasi 2025.1.x hattinin 4.1.x ile 2025.1.2'den beri uyumlu oldugunu belirtiyor.
- `why_it_matters`: Resmi uyum ile train'in conservative tabani arasindaki fark, kurum ici canary'yi zorunlu kiliyor.
- `java_spring_relevance`: Spring Cloud kullanan microservice platformlari icin dogrudan rollout karari.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: Config/Gateway/Function/Stream fix'lerini ayni train ile toplamak, 4.1.x lane'ine kontrollu gecmek
- `risks`: Supported/compatible bilgisini smoke test yerine koymak, JsonToGrpc veya Function boundary'lerini ihmal etmek
- `migration_notes`: `Boot 4.1.1 + Cloud 2025.1.3` kombinasyonunu staging'de config refresh, gateway routing, gRPC bridge, stream serialization ve circuit-breaker davranislariyla birlikte test et

### Bulgu 4

- `title`: Spring Batch ve Spring Integration, klasik Java deserialization borcunu kapatmaya zorluyor
- `source`: [Spring Batch 6.0.5 ve 6.1.0-M1](https://spring.io/blog/2026/08/20/spring-batch-6-0-5-and-6-1-0-M1-available-now) | [CVE-2026-47875](https://spring.io/security/cve-2026-47875) | [CVE-2026-47878](https://spring.io/security/cve-2026-47878) | [Spring Integration 7.2.0-M1 Available](https://spring.io/blog/2026/08/20/spring-integration-7-2-0-m1-released) | [CVE-2026-47864](https://spring.io/security/cve-2026-47864)
- `author`: Mahmoud Ben Hassine, Glenn Renfro, Spring Security team
- `date`: 20 Agustos 2026
- `category`: `security`, `deserialization`, `batch`, `integration`
- `tags`: `spring-batch-6.0.5`, `spring-integration-7.1.1`, `executioncontext`, `objectinputfilter`, `serializinghttpmessageconverter`
- `summary`: Batch JDBC job repository ve job parameter deserialization yollari artik daha sert tip allow-list bekliyor; Integration tarafinda ise `SerializingHttpMessageConverter` ile gelen klasik RCE yuzeyi acik sekilde kapatiliyor.
- `why_it_matters`: Framework'un daha once sessizce tolere ettigi Java serialization varsayimlari artik operasyonel risk olarak kabul ediliyor.
- `java_spring_relevance`: Batch job'lari, file processing, ETL, legacy integration ve serialized message tasiyan Spring uygulamalari icin dogrudan etki.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: ExecutionContext tiplerini daraltmak, serializer policy yazmak, eski serialized transport'lari emekliye ayirmak
- `risks`: Custom tip kullanan job'larda patch sonrasi behavior degisikligi, serialized endpoint'leri gozden kacirmak
- `migration_notes`: Batch'te custom `ExecutionContext` tiplerini say ve gerekiyorsa `ObjectInputFilter` ekle; Integration'da inbound serialized-object yuzeyini kapat veya class allow-list ile koru

### Bulgu 5

- `title`: AMQP ve outbound HTTP istemcileri icin yeni default: daha sert TLS ve RestClient
- `source`: [Spring AMQP 4.2.0-M1 Available](https://spring.io/blog/2026/08/20/spring-amqp-4-2-0-m1-available) | [CVE-2026-47860](https://spring.io/security/cve-2026-47860) | [Spring Integration What's New](https://docs.spring.io/spring-integration/reference/whats-new.html) | [HTTP Outbound Components](https://docs.spring.io/spring-integration/reference/http/outbound.html) | [Baeldung InetAddressFilter analizi](https://www.baeldung.com/spring-boot-http-client-ssrf-mitigation-inetaddressfilter)
- `author`: Glenn Renfro, Spring docs team, Hamid Reza Sharifi
- `date`: 20-22 Agustos 2026, 02 Eylul 2026 dogrulamasi
- `category`: `messaging`, `http-clients`, `tls`, `security-hardening`
- `tags`: `spring-amqp-4.1.1`, `spring-amqp-4.2.0-m1`, `restclient`, `resttemplatenodelocator`, `hostname-verification`, `inetaddressfilter`
- `summary`: Spring AMQP 4.2.0-M1 `RestTemplateNodeLocator`'i deprecate ediyor ve SSL hostname verification'i kalici hale getiriyor; Spring Integration ise outbound HTTP tarafinda `RestTemplate` konfigurasyonunu deprecated ilan ediyor. Baeldung'in 22 Agustos yazisi Boot 4.1 `InetAddressFilter` ozelliginin pratikte nasil kullanilacagini anlatmaya baslamis durumda.
- `why_it_matters`: Outbound ag davranisi artik framework default'lariyla daha siki belirleniyor; legacy client customization'lari teknik borca donusuyor.
- `java_spring_relevance`: HTTP client, message broker ve service discovery kullanan Spring servislerinin tamamina etki eder.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: RestClient standardizasyonu, SSRF korumalari, daha guvenli TLS default'lari
- `risks`: RestTemplate bagimli custom timeout/proxy/TLS davranislarini kaybetmek, broker path'lerinde poison-message senaryosunu test etmemek
- `migration_notes`: Outbound HTTP tanimlarinda `RestClient.create(restTemplate)` ile adimli gecis planla; broker ve node locator konfiglerini yeni client modeline gore normalize et

### Bulgu 6

- `title`: Spring Data service release'leri, veri erisim ve PATCH sinirlarini daha acik hale getirdi
- `source`: [Spring Data 2026.1.0-M1, 2026.0.1 ve 2025.1.7](https://spring.io/blog/2026/08/20/spring-data-2026) | [CVE-2026-47834](https://spring.io/security/cve-2026-47834) | [CVE-2026-47849](https://spring.io/security/cve-2026-47849)
- `author`: Christoph Strobl, Spring Security team
- `date`: 20 Agustos 2026
- `category`: `data-access`, `security`, `rest`, `persistence`
- `tags`: `spring-data-2026.0.1`, `spring-data-2025.1.7`, `spring-data-jpa-4.1.1`, `spring-data-rest-5.1.1`, `json-patch`, `sort-validation`
- `summary`: Spring Data service release'leri bugfix ve security fix tasiyor; ayni gun yayinlanan advisories ise Data JPA native-query sort path'ini ve Data REST JSON Patch yolunu somut risk alanlari olarak isaretliyor.
- `why_it_matters`: Veri erisim katmaninda framework yardimi olsa bile untrusted request metadata'si halen kritik risk kaynagi.
- `java_spring_relevance`: Spring Data JPA veya Spring Data REST kullanan ekipler icin dogrudan sorgu guvenligi ve optimistic locking karari.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: Sort sanitization politikalari, PATCH surface daraltma, repository exposure cleanup
- `risks`: `Sort` ve `Pageable` icin "framework zaten korur" varsayimi, JSON Patch ile id/version degisikligini gozden kacirmak
- `migration_notes`: Native query + `Sort` kullanan repository'lerde giris kontrolu ekle; Spring Data REST icin `PATCH` davranisini entity bazinda audit et ve gerekiyorsa alanlari deserializasyona kapat

## Sonuç

02 Eylul 2026 itibariyla asil haber yeni bir "tek surum" degil; Oracle ve Spring tarafinin patch temposunun ayni operasyon cizgisine yaklasmasi. Agustos 18-26 araligindaki veriler, Java/Spring ekiplerinin artik `runtime`, `framework`, `serialization`, `outbound client` ve `data boundary` kararlarini ayri backlog'lar olarak degil tek bir guvenlik ve release engineering problemi olarak yonetmesi gerektigini gosteriyor.

En dogru kisa plan su: `JDK 25`i ana production lane, `JDK 26`yi kisa omurlu validation lane olarak ele al; `Boot 4.1.1` ve ilgili Spring patch'lerini staging'e cek; Batch/Integration/AMQP/Data/Cloud tarafindaki trust-boundary testlerini BOM bump'in ayrilmaz parcasi yap; `RestClient` ve outbound allow-list modernizasyonunu Eylul backlog'una bugunden koy.
