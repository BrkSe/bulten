# Günlük Java / Spring Ekosistem Raporu

Tarih: 28 Haziran 2026  
Tarama zamanı: 28 Haziran 2026 09:09 TSİ  
Odak: gizli sihir yerine açık sözleşme, gecikmeli immutability ve platform ölçeğinde dependency drift kontrolü; bugün yeni büyük Spring güvenlik dalgasından çok bu mimari yönün güçlendiği bir gün

Tarama notu: [Spring Blog](https://spring.io/blog/), [Spring proje sayfaları](https://spring.io/projects), ilgili [Spring GitHub release notları](https://github.com/spring-projects), [OpenJDK JEP 531](https://openjdk.org/jeps/531), [Oracle Java Blog](https://blogs.oracle.com/java/the-arrival-of-java-26), [dev.java news](https://dev.java/news/), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/news/), [Baeldung Java Weekly 652](https://www.baeldung.com/java-weekly-652), [Josh Long'ın This Week in Spring yazısı](https://spring.io/blog/2026/06/23/this-week-in-spring-june-23-2026/), [Gunnar Morling blogu](https://www.morling.dev/), [Gunnar Morling'in Hardwood 1.0 yazısı](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/), ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandı. Resmi Spring feed ve GitHub release yüzeylerinde 28 Haziran 2026 itibarıyla [Spring Boot `3.5.16`](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/) ve [Spring Data `2025.0.13`](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/) sonrasına geçen yeni bir kritik release görünmüyor; bu cümle resmi yüzeylerin birlikte değerlendirilmesinden yapılan çıkarımdır. Burak KUTBAY tarafında bugün karar yüzeyini değiştirecek kadar yeni bir Java/Spring yazısı görünmedi; son görünür ilgili yazılar [HTTP Service Client - Spring Boot 4.0](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/), [API Versiyonlama - Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/) ve [Stable Values API](https://blog.burakkutbay.com/java-25-stable-values-api-nedir-jep-502.html/) ekseninde kalıyor.

## Öne Çıkan Başlıklar

- [JDK 27 için Lazy Constants üçüncü preview](https://openjdk.org/jeps/531) ve [Inside Java'nın immutable data oturumu](https://inside.java/2026/06/21/better-tools-immutable-data/), Java'nın startup ve initialization hikayesini "eager final" kalıbından "deferred immutability" yönüne taşıyor.
- [Spring AI 2.0 structured output yazısı](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output/) ile [tool-calling mimarisi yazısı](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling/), Spring AI kullanan ekiplerde ham string cevaptan typed, retry edilebilir ve gözlemlenebilir sözleşme katmanına geçişi netleştiriyor.
- [Block'un 450 JVM reposunu monorepo'ya taşıma hikayesi](https://engineering.block.xyz/blog/from-polyrepo-fragmentation-to-monorepo-leverage) ve [InfoQ analizi](https://www.infoq.com/news/2026/06/block-450-jvm-monorepo-migration/) büyük Spring filoları için dependency drift probleminin artık "build hijyeni" değil mimari ve platform problemi olduğunu gösteriyor.
- [Gunnar Morling'in Hardwood 1.0 duyurusu](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/) veri yoğun JVM iş yükleri için Java `21+` tabanlı hafif Parquet okuma alanında yeni bir üretim adayı çıkarıyor.
- [Java microservices vs Go benchmark güncellemesi](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/) ve [JDK 26 performans özeti](https://inside.java/2026/06/09/jdk-26-performance-improvements/) birlikte okunduğunda, performans tartışmasının dil folklorundan çok workload-shape, startup ve runtime tuning meselesine döndüğü görülüyor.
- Güvenlik advisory ve kırıcı Spring release tarafında bugün yeni güçlü sinyal yok; acil patch-floor resmi değişmedi.

## Kritik Güncellemeler

### 1. Resmi Spring yüzeyinde bugün yeni patch alarmı yok, fakat yön değişimi net

[Spring Blog feed](https://spring.io/blog/) üzerinde bugün en yeni teknik sinyaller hâlâ [Spring Boot `3.5.16`](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/), [Spring Data `2025.0.13`](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/), [Spring AI structured output](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output/) ve [Josh Long'ın 23 Haziran seçkisi](https://spring.io/blog/2026/06/23/this-week-in-spring-june-23-2026/) olarak görünüyor. Bu nedenle bugünün en değerli kararı "yeni patch var mı?" değil, "hangi kalıcı mimari sinyal tekrar ediyor?" sorusuna cevap vermek.

Pratik anlamı:

- Dün ve önceki gün alınmış Boot/Data patch kararları geçerliliğini koruyor.
- Yeni değer, framework yüzeyinin typed contract, deferred init ve platform ölçeklenebilirliği tarafına aynı anda işaret etmesinde.

### 2. OpenJDK tarafında deferred immutability artık somut bir uygulama modeli haline geliyor

[JEP 531](https://openjdk.org/jeps/531), `LazyConstant` ile değerin en fazla bir kez, ihtiyaç anında üretilmesini; sonrasında da JVM'in bu değeri sabit gibi optimize etmesini hedefliyor. [Inside Java'nın immutable data oturumu](https://inside.java/2026/06/21/better-tools-immutable-data/) bu hattı records, value objects, flexible constructor bodies ve initialization diagnostics ile birlikte anlatıyor. [Oracle'ın Java 26 yazısı](https://blogs.oracle.com/java/the-arrival-of-java-26) da lazy constants'ı cloud-native ve AI servislerde startup ve kaynak verimi kazanımı açısından açıkça konumluyor.

Bu, Spring ekipleri için dil seviyesi merak konusu olmaktan öte şu anlama geliyor:

- el yapımı lazy singleton, `volatile` cache, double-checked locking ve "ilk istekte oluştur" kalıpları tekrar düşünülmeli
- startup maliyeti yüksek bean bağımlılıkları ve statik yardımcı nesneler için daha temiz bir gelecek modeli oluşuyor

### 3. Spring AI 2.0, prompt zincirini sözleşme ve kontrol akışı düzeyine çıkarıyor

[Structured output yazısı](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output/) üç önemli mesaj veriyor:

- `.content()` yerine `.entity(...)` ile doğrudan typed nesneye dönmek mümkün
- `validateSchema()` ile shape drift sonrası otomatik düzeltici retry devreye alınabiliyor
- `useProviderStructuredOutput()` ile şema prompt içinde değil sağlayıcı API düzeyinde zorlanabiliyor

[Tool-calling mimarisi yazısı](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling/) ise tool invocation mantığını model implementasyonlarının içinden çıkarıp advisor zincirine taşıyor. Bu, aktif Spring AI ekipleri için hype değil; audit edilebilirlik, retry semantiği ve tool seçimi maliyeti açısından ciddi bir üretim kazanımı.

### 4. Dependency drift, yüzlerce JVM servisinde ayrı bir platform problemi olarak ortaya çıkıyor

[Block'un mühendislik yazısı](https://engineering.block.xyz/blog/from-polyrepo-fragmentation-to-monorepo-leverage) ve [InfoQ röportajı](https://www.infoq.com/news/2026/06/block-450-jvm-monorepo-migration/) aynı noktayı güçlendiriyor:

- polyrepo yapı kırıcı değişiklikleri görünmezleştirebiliyor
- internal library publish zinciri geriye dönük uyumluluk disiplinini zayıflatabiliyor
- selective CI, dependency graph ve merge queue olmadan büyük JVM filolarında güvenli ortak değişim yapmak pahalılaşıyor

Spring Boot, Spring Cloud ve kurum içi starter/BOM kullanan organizasyonlar için bu doğrudan üretim konusu.

### 5. JVM veri düzlemi için yeni, daha dar ama daha güçlü araçlar çıkıyor

[Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/) "genel amaçlı her şeyi yapalım" çizgisinde değil; Parquet'i hızlı, çok çekirdekli ve minimal bağımlılıkla okumaya odaklanıyor. Bu tür araçlar tipik CRUD servisleri için önemsiz olabilir; ancak batch, ETL, lakehouse ingestion ve event-archive iş yükleri için ciddi sinyal.

## Trendler ve Sinyaller

### Trend Kümesi 1: Açık sözleşme, framework ve platform katmanında ortak tema haline geliyor

Tekrarlayan sinyal:

- `LazyConstant` ile "ne zaman initialize olur?" sorusunun explicit hale gelmesi
- Spring AI'da typed `.entity(...)`, `validateSchema()` ve provider-side schema enforcement
- Block tarafında dependency graph bazlı build scoping ve atomic multi-service değişim

Çıkarım:

- Java/Spring ekosistemi "arka planda sihir" yerine "önceden ifade edilmiş sözleşme" yönüne gidiyor.
- Bu, özellikle üretim hatalarının sebebini açıklamayı ve otomasyonu güvenli kılmayı kolaylaştırıyor.

### Trend Kümesi 2: Startup ve cold-path optimizasyonu artık yan konu değil

Tekrarlayan sinyal:

- `LazyConstant` ile geç başlatma
- [JDK 26 performans iyileştirmeleri](https://inside.java/2026/06/09/jdk-26-performance-improvements/)
- [Java vs Go benchmark güncellemesi](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/)

Çıkarım:

- "Java hızlı mı?" sorusundan çok "hangi initialization ve runtime stratejisiyle hızlı?" sorusu önem kazanıyor.
- Spring Boot servislerinde cold start, pod churn ve scale-up davranışı ayrı backlog maddesi olmalı.

### Trend Kümesi 3: Platform engineering, repository topolojisi kadar dependency topolojisi konusu

Tekrarlayan sinyal:

- monorepo tek başına çözüm değil
- dependency graph, selective CI, merge queue ve IDE deneyimi birlikte ele alınıyor
- Baeldung'in haftalık seçkisi de bu konuyu Java ekipleri için öne çıkarıyor

Çıkarım:

- Büyük Spring mikroservis filolarında asıl sorun repo sayısı değil, kırıcı değişikliklerin akışa nasıl yansıtıldığı.
- Internal starter, ortak kütüphane ve shared contract yöneten ekipler bu sinyali ciddiye almalı.

### Trend Kümesi 4: Veri yoğun JVM iş yükleri için niş ama kuvvetli OSS araçları olgunlaşıyor

Tekrarlayan sinyal:

- Hardwood 1.0 üretim hazır söylemi
- Java `21+` tabanı
- minimal dependency ve core-saturated parallel decode yaklaşımı

Çıkarım:

- Spring Batch veya event arşivleme kullanan ekiplerde klasik `parquet-java` varsayımı sorgulanabilir.
- Bu genel mikroservis kitlesi için değil; ama ilgili ekipler için göz ardı edilmeyecek kadar somut.

## Araçlar ve Kütüphaneler

- [Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/): Java `21+`, minimal dependency, çok çekirdekli Parquet okuma. Batch ve analytics kenarlarında değerli.
- [StructuredOutputValidationAdvisor](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output/): typed LLM cevabını şemaya karşı doğrulayıp otomatik retry eden pratik güvenlik ağı.
- [ToolCallingAdvisor / ToolSearchToolCallingAdvisor](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling/): tool loop'larını model içi kara kutudan çıkarıp ölçülebilir/kompoze edilebilir Spring primitive'ine dönüştürüyor.
- Düşük öncelik: [Oracle Java VS Code Extension `26.0.0`](https://inside.java/2026/06/08/java-vscode-extension-update/) geliştirici ergonomisi için faydalı, ancak bugünün üretim kararını belirleyen esas sinyal değil.
- Bugün geniş etki alanlı yeni bir bağımsız Spring kütüphanesi veya kritik release görünmüyor; değer daha çok sözleşme, başlatma ve platform pratiklerinde toplanmış durumda.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI kullanan ekipler, state değiştiren veya routing yapan akışlarda ham `.content()` kullanımını azaltıp typed `.entity(...)` + `validateSchema()` kombinasyonunu değerlendirmeli.
- `LazyConstant` henüz preview olduğu için doğrudan üretim standardı yapılamaz; ancak mevcut lazy init anti-pattern'lerini envantere alıp JDK `26/27` değerlendirme backlog'una eklemek mantıklı.
- Kurum içinde onlarca Spring Boot servisi ve ortak starter/bom varsa, repo topolojisini değiştirmeden önce dependency graph temelli build kapsamı, merge queue ve shared Gradle convention seti kurulmalı.
- Parquet dosyaları batch veya analitik iş akışında sıcak yoldaysa Hardwood pilotu anlamlı olabilir; tipik REST mikroservisinde ise gereksiz bir dikkat dağıtıcı olabilir.
- Java performans tartışmalarında "Go hızlıdır, Java yavaştır" refleksiyle karar vermek zayıf. Kendi iş yükünüzü JDK `26`, virtual threads ve güncel cold-start iyileştirmeleriyle ölçmeden teknoloji seçimi yapmak artık daha savunmasız.

## Fırsatlar ve Riskler

- Fırsat: typed structured output ve provider-side schema enforcement, downstream veri bozulmasını ve geç patlayan parsing hatalarını azaltabilir.
- Risk: Spring AI typed response akışı streaming yolunda çalışmıyor; ayrıca bazı sağlayıcılarda JSON Schema desteği kısmi.
- Fırsat: deferred immutability yaklaşımı, startup ve kaynak tüketiminde ölçülebilir iyileşme getirebilir.
- Risk: `LazyConstant` preview API; bugünden kod tabanını buna göre kırmak yerine hazırlık backlog'u açmak daha doğru.
- Fırsat: dependency graph bazlı CI ve atomic değişim, Spring release-train veya internal starter geçişlerini daha az sancılı hale getirebilir.
- Risk: "Block yaptıysa biz de monorepo'ya geçelim" refleksi, gerekli platform yatırımı olmadan yeni darboğazlar üretir.
- Fırsat: Hardwood gibi niş araçlar, veri düzlemi iş yüklerinde JVM'in batch/analytics tarafındaki verimini artırabilir.
- Risk: yeni kütüphaneleri çekirdek veri yoluna almadan önce format uyumluluğu, sıkıştırma türleri ve gözlemlenebilirlik ihtiyaçları test edilmeli.

## İzlenmesi Gereken Konular

- `LazyConstant` API'si JDK `27` sürecinde başka sadeleştirmeler alıyor mu?
- Spring AI `2.x` hattında tool state, session persistence ve observability tarafı daha da ilk sınıf hale geliyor mu?
- Spring resmi release yüzeyinde Boot `4.1.x` veya `3.5.x` için beklenmedik yeni patch/advisory çıkıyor mu?
- Block, selective CI veya IDE tarafındaki araçlarından açık kaynak olarak daha fazlasını paylaşıyor mu?
- Gunnar Morling tarafında Hardwood için yazma desteği, daha geniş uyumluluk tablosu veya Spring Batch entegrasyon örnekleri geliyor mu?
- Burak KUTBAY tarafında 2026 yaz döneminde Java `26/27`, Spring Framework `7` veya Boot `4.x` hakkında daha güncel pratik yazılar geliyor mu?

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: JDK `27` lazy constants hattı, Java uygulamalarında gecikmeli immutability'yi bir dil/VM tasarım konusu olmaktan çıkarıp gerçek uygulama modeline dönüştürüyor
- `source`: [JEP 531: Lazy Constants (Third Preview)](https://openjdk.org/jeps/531) | [Better Tools for Immutable Data](https://inside.java/2026/06/21/better-tools-immutable-data/) | [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26) | [Java 25: Stable Values API Nedir? JEP 502](https://blog.burakkutbay.com/java-25-stable-values-api-nedir-jep-502.html/)
- `author`: Per Minborg, Maurizio Cimadamore | Dan Smith | Sharat Chander | Burak KUTBAY
- `date`: 17 Mayıs - 21 Haziran 2026, ikincil açıklayıcı kaynak olarak 22 Haziran 2025
- `category`: jvm, runtime, startup, immutability, performance
- `tags`: jdk27, lazyconstant, immutable-data, startup, initialization, preview-api, stable-values
- `summary`: `LazyConstant`, pahalı nesneleri ancak gerçekten gerektiğinde üretip sonrasında JVM tarafından sabit gibi optimize ettirebilen bir model sunuyor; Inside Java bunu immutable data araç setinin parçası olarak konumluyor.
- `why_it_matters`: Java tarafında yıllardır elle yazılan lazy init kalıpları ya correctness riski ya da okunabilirlik borcu üretiyordu. Bu alan artık doğrudan platformun optimize ettiği bir yöne gidiyor.
- `java_spring_relevance`: Spring uygulamalarında logger, client, serializer, mapper, cache wrapper ve konfigürasyon yardımcıları gibi ilk erişimde oluşturulan çok sayıda nesne var. Bu trend, Spring ekosistemindeki startup ve kaynak kullanımı kararlarını uzun vadede etkiler.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: soğuk başlangıç maliyetini düşürmek, el yapımı lazy init kalıplarını sadeleştirmek, JVM optimizasyonlarına daha fazla alan açmak
- `risks`: preview API'ye erken bağlanmak, mevcut üretim kodunu yalnız kavramsal benzerlik nedeniyle gereksiz yere yeniden yazmak
- `migration_notes`: JDK `26/27` denemelerinde mevcut `volatile` cache, supplier tabanlı geç başlatma ve double-checked locking kalıpları envantere alınmalı; ancak doğrudan üretim standardı yapmadan önce API'nin nihai şekli beklenmeli.

### Bulgu 2

- `title`: Spring AI `2.0`, typed structured output ve advisor-temelli tool loop ile LLM entegrasyonunu sözleşme-first hale getiriyor
- `source`: [Self-Correcting Structured Output in Spring AI 2.0](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output/) | [Tool Calling in Spring AI 2.0: A Composable, Agentic Architecture](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling/) | [This Week in Spring - June 23rd, 2026](https://spring.io/blog/2026/06/23/this-week-in-spring-june-23-2026/) | [Java Weekly, Issue 652](https://www.baeldung.com/java-weekly-652)
- `author`: Christian Tzolov | Josh Long | Baeldung editorial team
- `date`: 15-26 Haziran 2026
- `category`: ai-platform, contracts, observability, developer-productivity
- `tags`: spring-ai, entity, validateSchema, structured-output, advisor-chain, tool-calling, token-savings
- `summary`: `.entity(...)`, `validateSchema()` ve `useProviderStructuredOutput()` ile typed çıktı ve otomatik düzeltici retry mümkün hale gelirken, tool calling de advisor zincirine taşınıyor; böylece tool loop'ları ölçülebilir ve kompoze edilebilir hale geliyor.
- `why_it_matters`: LLM çağrılarında asıl risk çoğu zaman model cevabının okunamaması değil, yanlış shape ile sessizce akışın bozulmasıdır. Spring AI burada doğrudan uygulama sınırını sertleştiriyor.
- `java_spring_relevance`: Spring AI kullanan Java ekipleri için prompt zinciri artık yalnız AI konusu değil; normal bir typed integration contract konusu haline geliyor.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: typed routing, daha az parse hatası, sağlayıcıya göre daha sıkı response sözleşmesi, çok tool'lu agent akışlarında token ve context tasarrufu
- `risks`: sağlayıcıya göre eksik JSON Schema desteği, streaming akışta typed parse olmaması, OpenAI tarafında top-level array gibi pratik kısıtlar
- `migration_notes`: veri yazan, karar veren veya dış sisteme çağrı yapan akışlarda `.content()` kullanımı azaltılmalı; önce küçük pilotlarda `.entity(...)` ve `validateSchema()` denenmeli, ardından çok tool'lu ajanlarda advisor zinciri değerlendirilmelidir.

### Bulgu 3

- `title`: Dependency drift'i azaltmak için repo topolojisinden çok dependency graph ve atomic change yeteneği öne çıkıyor
- `source`: [From Polyrepo Fragmentation to Monorepo Leverage](https://engineering.block.xyz/blog/from-polyrepo-fragmentation-to-monorepo-leverage) | [Behind the Scenes: Block 450 JVM Repositories into Monorepo to Reduce Dependency Drift](https://www.infoq.com/news/2026/06/block-450-jvm-monorepo-migration/) | [Java Weekly, Issue 652](https://www.baeldung.com/java-weekly-652)
- `author`: Yissachar Radcliffe | Leela Kumili | Baeldung editorial team
- `date`: 10-26 Haziran 2026
- `category`: platform-engineering, build, dependency-management, microservices
- `tags`: monorepo, dependency-drift, gradle, merge-queue, selective-ci, jvm-fleet, platform
- `summary`: Block, yaklaşık `450` JVM repository'sini tek monorepo'ya taşıyarak dependency drift, coordinated rollout ve runtime incompatibility baskısını azaltmış; bunu da merge queue, dependency graph bazlı build scoping ve custom IntelliJ desteğiyle taşımış.
- `why_it_matters`: Yüzlerce servisli yapılarda problem çoğu zaman "hangi sürümdeyiz?" değil "aynı anda güvenli biçimde nasıl ilerleriz?" sorusudur. Bu vaka analizi bunu çok net gösteriyor.
- `java_spring_relevance`: Çok sayıda Spring Boot servisi, ortak starter/BOM ve shared library kullanan ekipler aynı koordinasyon ağrısını yaşıyor.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: atomic multi-service değişim, daha hızlı framework upgrade, dependency görünürlüğü, daha güvenilir CI kapsamı
- `risks`: monorepo'yu araç ve süreç yatırımı olmadan kopyalamak, geliştirici deneyimini ve CI sürelerini bozabilir
- `migration_notes`: önce mevcut repo yapısında dependency graph çıkarılmalı, selective build/test kapsamı uygulanmalı, merge queue ve shared Gradle convention seti kurulmalı; repo topolojisi değişikliği bundan sonra düşünülmelidir.

### Bulgu 4

- `title`: Hardwood `1.0`, Parquet'i JVM üzerinde hafif ve yüksek performanslı okuma için üretim adayı yeni bir yol açıyor
- `source`: [Hardwood 1.0: A Fast, Lightweight Apache Parquet Reader for the JVM](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/) | [hardwood-hq/hardwood](https://github.com/hardwood-hq/hardwood) | [InfoQ Podcast: Chasing Efficient Java Development](https://www.infoq.com/podcasts/chasing-efficient-java-development/)
- `author`: Gunnar Morling | Olimpiu Pop
- `date`: 25-27 Haziran 2026
- `category`: data-engineering, batch, library, performance
- `tags`: hardwood, parquet, java21, batch, analytics, minimal-dependencies, multithreaded
- `summary`: Hardwood `1.0`, Java `21+` hedefleyen, zorunlu bağımlılığı olmayan ve sayfa çözümlemeyi tüm CPU çekirdeklerine yayabilen yeni bir Parquet okuyucu olarak üretime hazır ilan edildi.
- `why_it_matters`: JVM veri iş yüklerinde çoğu ekip klasik web servis lensiyle düşünürken, veri düzlemindeki I/O ve decode maliyeti ayrı bir optimizasyon alanı haline geliyor.
- `java_spring_relevance`: Spring Batch, Kafka tabanlı arşivleme, data export/import ve lakehouse entegrasyonlarında Parquet sıcak yoldaysa doğrudan ilgili.
- `actionability`: `izlemelik`
- `impact_level`: `orta`
- `opportunities`: daha hafif batch işleyiciler, daha küçük sidecar araçları, ETL veya raporlama işlerinde daha düşük bağımlılık maliyeti
- `risks`: yeni kütüphane olgunluğu, mevcut Parquet ekosistemiyle davranış farkları, gözlemlenebilirlik veya entegrasyon eksikleri
- `migration_notes`: sadece Parquet gerçekten sıcak yoldaysa pilot açılmalı; mevcut `parquet-java` veya kurum içi çözümle throughput, bellek, schema desteği ve sıkıştırma türleri karşılaştırılmalıdır.

### Bulgu 5

- `title`: Java performans tartışması dil savaşından workload-shape ve startup stratejisine kayıyor
- `source`: [Can Java Microservices Be As Fast As Go? A 2026 Benchmark Update](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/) | [Performance Improvements in JDK 26](https://inside.java/2026/06/09/jdk-26-performance-improvements/) | [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26) | [dev.java news](https://dev.java/news/)
- `author`: Mark Nelson | Ana-Maria Mihalceanu | Per-Ake Minborg | Sharat Chander
- `date`: 9-15 Haziran 2026
- `category`: jvm, performance, microservices, runtime
- `tags`: java26, go-benchmark, virtual-threads, startup, aot-cache, g1, microservices
- `summary`: Java ve Go mikroservislerini yeniden karşılaştıran benchmark güncellemesi, tartışmayı dilden çok payload boyutu, concurrency seviyesi ve runtime iyileştirmeleri düzeyine çekiyor; JDK `26` da G1, AOT cache ve runtime verimiyle bunu destekliyor.
- `why_it_matters`: Performans kararı çoğu organizasyonda hâlâ eski kabullere dayanıyor. Güncel JDK ve uygulama şekli hesaba katılmadan verilen teknoloji kararları zayıf kalıyor.
- `java_spring_relevance`: Spring Boot servisleri sıklıkla "daha hızlı dil" önyargısıyla karşılaştırılıyor; oysa modern JDK ile gerçek darboğazlar daha çok startup, allocation ve request shape tarafında ortaya çıkıyor.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: sanıldığı kadar erken dil göçü yapmadan mevcut Java filolarından daha fazla verim almak, virtual thread ve runtime iyileştirmelerini gerçek verilerle değerlendirmek
- `risks`: tek bir benchmark sonucunu genellemek, kendi iş yükünüzde ölçmeden mimari yön değiştirmek
- `migration_notes`: JDK `26` pilotlarında startup, warmup, throughput ve bellek ölçümleri ayrı tutulmalı; özellikle küçük pod'lar ve bursty trafik altındaki Spring servisleri için uygulamaya özel benchmark açılmalıdır.

## Sonuç

Bugünün en kuvvetli sinyali yeni bir CVE veya yeni bir Spring major release değil; Java ve Spring ekosisteminin ortak biçimde daha açık sözleşmelere, daha güvenli gecikmeli başlatmaya ve daha platform-merkezli dependency yönetimine kayması. Senior bir Java/Spring ekip için kısa vadede yapılacak iş, Boot/Data patch zeminini korurken AI entegrasyonlarında typed contract denemeleri başlatmak, lazy init anti-pattern'lerini envantere almak ve büyük servis filolarında dependency drift'i teknik borç değil mimari risk olarak ele almaktır.
