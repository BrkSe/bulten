# Günlük Java / Spring Ekosistem Raporu

Tarih: 6 Ağustos 2026 Perşembe  
Tarama zamanı: 6 Ağustos 2026 09:08 TSİ  
Odak: virtual thread üretimleşmesi; context propagation; servlet/reactive sınırları; Spring görev yürütme semantiği

Tarama notu: 6 Ağustos 2026 09:08 TSİ itibarıyla [Spring Blog](https://spring.io/blog), [Spring proje sayfaları](https://spring.io/projects), [Spring release duyuruları](https://spring.io/blog/category/releases), Spring Boot/Framework/Security/Cloud/AI/Modulith GitHub release yüzeyleri, [Spring Boot referans dokümantasyonu](https://docs.spring.io/spring-boot/reference/), [Spring Batch dokümantasyonu](https://docs.spring.io/spring-batch/reference/), [Spring for Apache Kafka dokümantasyonu](https://docs.spring.io/spring-kafka/reference/), [OpenJDK JEP 491](https://openjdk.org/jeps/491), [OpenJDK JEP 506](https://openjdk.org/jeps/506), [JDK 27 EA release notes](https://jdk.java.net/27/release-notes), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), Josh Long ve Spring maintainers’ın son paylaşımları, Dan Vega’nın son yazıları, Gunnar Morling’in güncel blog akışı ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Bugün resmi yüzeylerde yeni bir büyük Spring GA dalgası yok; doğrulanabilen stabil hatlar hâlâ Spring Boot `4.1.0`, Spring Framework `7.0.8`, Spring Security `7.1.0`, Spring Cloud `2025.1.2`, Spring AI `2.0.0` ve Spring Modulith `2.1.0`. Günün güçlü sinyali yeni sürüm değil: JDK 24/25 ve Spring 4.1 dokümantasyonu, virtual thread kararını ilk kez ciddi biçimde üretim backlog’una taşımış durumda.

## Öne Çıkan Başlıklar

- JDK 24 ile gelen `JEP 491`, `synchronized` içindeki bloklamada virtual thread’in carrier thread’i bırakabilmesini sağlıyor; bu, Spring ekipleri için en büyük benimseme bariyerlerinden birini fiilen kaldırdı.
- JDK 25’te final olan `JEP 506 Scoped Values`, virtual thread kullanan servislerde `ThreadLocal` tabanlı context taşımanın yerini alabilecek ilk yerleşik ve daha güvenli primitive haline geldi.
- Spring Boot `4.1.0` dokümantasyonu, `spring.threads.virtual.enabled=true` için artık açıkça “en iyi deneyim için Java 24 veya üstü” diyor; bu önemli çünkü Spring tarafında da öneri dili netleşmiş durumda.
- Virtual thread açmak yalnız HTTP request iş parçacıklarını etkilemiyor; Spring Boot’un auto-configured `AsyncTaskExecutor` ve `TaskScheduler` davranışı da değişiyor, bazı pooling ayarları fiilen devre dışı kalıyor.
- WebFlux için otomatik “migrate away” sonucu çıkmıyor. Blocking request/response servisler için MVC + virtual threads kuvvetli aday; SSE, WebSocket, streaming ve backpressure ihtiyacı olan servisler için WebFlux hâlâ doğal tercih.

## Kritik Güncellemeler

### 1. Virtual thread kararı artık “deneysel oyuncak” değil, JDK 25 hedefli platform kararı

[OpenJDK JEP 491](https://openjdk.org/jeps/491), virtual thread’lerin `synchronized` blok veya method içinde bloklandıklarında carrier platform thread’i serbest bırakabilmesini sağlayarak “pinning” yüzeyini neredeyse tamamen küçültüyor. Bu değişiklik, `JEP 444` ile gelen virtual thread modelinin Spring Boot servislerinde daha güvenli pilot edilmesini mümkün kılıyor. [Spring Boot `SpringApplication` dokümantasyonu](https://docs.spring.io/spring-boot/reference/features/spring-application.html) da bunu destekler biçimde virtual thread’ler için Java 24+ önerisini net yazıyor.

Bu sinyal pratikte önemli çünkü bugüne kadar birçok ekipte “virtual thread güzel ama gerçek kodda `synchronized`, `ThreadLocal` ve eski kütüphaneler yüzünden riskli” refleksi haklıydı. O refleks tamamen bitmedi, ama risk profili artık JVM içinden iyileştirildi.

### 2. `spring.threads.virtual.enabled` yalnız request modelini değil, Boot görev yürütme semantiğini değiştiriyor

[Spring Boot Task Execution and Scheduling](https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html) dokümantasyonu önemli bir detayı açık yazıyor: virtual thread açıldığında auto-configured `AsyncTaskExecutor`, `ThreadPoolTaskExecutor` yerine `SimpleAsyncTaskExecutor` oluyor; `TaskScheduler` da `SimpleAsyncTaskScheduler` oluyor ve pooling ayarlarını dikkate almıyor. Bu, birçok ekibin “aynı uygulama ama thread modeli biraz farklı” sandığı geçişin aslında `@Async`, scheduler ve background iş davranışını da etkilediği anlamına geliyor.

Başka bir deyişle, property flip etmek yalnız servlet request başına thread davranışını değil, uygulamanın arka plan yürütme politikasını da değiştiriyor. Bu değişiklik ölçülmeden açılırsa, eski thread-pool tavanının sağladığı örtük kaynak sınırları sessizce kaybolabilir.

### 3. Spring portföyünde readiness eşit değil: Batch olumlu, Kafka tarafı dikkat istiyor

[Spring Batch 5.1 “What’s New” dokümanı](https://docs.spring.io/spring-batch/reference/5.1/whatsnew.html), virtual thread desteğinin framework’ün tüm alanlarında kullanılabildiğini söylüyor; concurrent step ve paralel step launch bunun içinde. Buna karşılık [Spring for Apache Kafka thread-safety dokümanı](https://docs.spring.io/spring-kafka/reference/kafka/thread-safety.html), concurrent listener container’larda virtual thread kullanırken platform thread sayısını aşan concurrency için pinning ve race condition riski konusunda açık uyarı veriyor.

Bu fark kritik. “JVM artık hazır, o zaman tüm Spring portföyü hazırdır” varsayımı yanlış. Web, batch ve async yüzeylerinde fırsat var; messaging tarafında ise üçüncü taraf kütüphanelerin ve listener topolojisinin daha dar pilot edilmesi gerekiyor.

## Trendler ve Sinyaller

### Trend Kümesi 1: Kaynak sınırını thread pool değil, uygulama kodu taşımaya başlıyor

`JEP 491`, `Scoped Values`, Spring Boot virtual thread opt-in ve [InfoQ’nun üretim odaklı değerlendirmesi](https://www.infoq.com/articles/virtual-threads-after-jdk24/) birlikte okunduğunda aynı sonuç çıkıyor: thread pool artık hem iş izolasyonu hem de kaynak sınırı için kullanılan tek araç olmaktan çıkıyor. Virtual thread ile istek başına concurrency genişliyor; buna karşılık veritabanı havuzu, downstream rate limit, dosya descriptor sınırı ve listener concurrency gibi gerçek limitler artık açıkça kod ve konfigürasyonla yönetilmek zorunda.

### Trend Kümesi 2: Reactive mimari “varsayılan ileri seçenek” olmaktan çok karar filtresine dönüyor

[InfoQ’nun “Virtual Threads after JDK 24” yazısı](https://www.infoq.com/articles/virtual-threads-after-jdk24/) ve [Spring MVC optimizasyon yazısı](https://spring.io/blog/2026/02/25/optimizing-spring-mvc) aynı yöne bakıyor. Blocking request/response servislerde MVC + virtual thread hattı artık savunulabilir; ancak WebFlux’un streaming, SSE, WebSocket ve backpressure değeri ortadan kalkmış değil. Bu da ekiplerin “reaktif çünkü ölçek” kararını yeniden test etmesini, ama “reaktif çünkü akış semantiği gerekiyor” kararını korumasını gerektiriyor.

### Trend Kümesi 3: Context propagation tarafında `ThreadLocal` borcu görünür hale geliyor

`JEP 506 Scoped Values`, [Baeldung’in Java 25 özeti](https://www.baeldung.com/java-25-features) ve InfoQ’nun migration notları bir araya gelince asıl zor kısmın concurrency primitive değil, context ve cache alışkanlıkları olduğu görülüyor. `ThreadLocal.withInitial()` ile gizli cache tutan, `InheritableThreadLocal` ile auth/trace context taşıyan kod tabanı virtual thread altında aynı şekilde düşünülmemeli.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: JDK 25’i virtual thread + scoped values hedefiyle değerlendirmek
- Kalıcı değer: `ThreadLocal`, `@Async`, scheduler ve listener concurrency yüzeylerini kod incelemesine almak
- Kalıcı değer: JFR `jdk.VirtualThreadPinned` olayını gözlemlenebilirlik standardına eklemek
- Düşük öncelik: yalnız benchmark ekran görüntüsü gördüğü için servisleri aceleyle WebFlux’tan çıkarmak
- Düşük öncelik: virtual thread açmayı “tek satırlık performans hack’i” gibi görmek

## Araçlar ve Kütüphaneler

- [Spring Boot 4.1.0](https://docs.spring.io/spring-boot/reference/): Bugünün en önemli araç sinyali yeni artifact değil, virtual thread semantiğini yeterince açık ve operasyonel biçimde anlatan referans doküman.
- [Spring Batch 6.0.4 / 5.1 hattı](https://docs.spring.io/spring-batch/reference/): Batch işlerinde virtual thread denemeleri için olgun yüzey; özellikle paralel step ve task executor kararları için anlamlı.
- [Spring for Apache Kafka 4.1.0 dokümantasyonu](https://docs.spring.io/spring-kafka/reference/kafka/thread-safety.html): Messaging tarafında “hazır gibi görünen ama pilot gerektiren” alanı netleştiriyor.
- [Oracle Java Platform Extension for Visual Studio Code 26.0.1](https://inside.java/2026/08/05/java-vscode-extension-update/): Düşük öncelikli ama güncel tooling sinyali; Java 26 tabanlı inner-loop standardizasyonu yapan ekipler için izlenebilir.
- Bugün yeni ve kritik bir Java/Spring OSS GA lansmanı yok. Araç tarafındaki değer, yeni paketlerden çok mevcut yüzeylerin concurrency semantiğini netleştirmesinde.

## Java / Spring Geliştiricileri İçin Etkiler

- Servlet stack üzerinde blocking JDBC, `RestClient`, synchronous HTTP veya klasik JPA kullanan Spring Boot servisleri için virtual thread pilotu artık gerçekçi. Özellikle JDK 25 hedefi olan ekipler bu kararı ertelememeli.
- `spring.threads.virtual.enabled=true` açmadan önce yalnız controller/request akışını değil; `@Async`, scheduler, batch step executor, Kafka listener ve tüm `ThreadLocal` kullanımını envantere dökün.
- WebFlux kullanan ekipler “virtual thread geldi, reactive bitti” sonucuna gitmemeli. Önce workload’ı sınıflandırın: request/response ise aday, streaming/backpressure ise kalmalı.
- Operasyon ekipleri JFR `jdk.VirtualThreadPinned`, `jdk.VirtualThreadSubmitFailed` ve `jcmd Thread.dump_to_file -format=json` komutunu runbook’a eklemeli.
- Platform ekipleri için kritik fark şu: thread havuzu tavanı kaybolduğunda asıl kapasite tavanı connection pool, semaphore ve downstream quota oluyor. Bu sınırlar açıkça yazılmadıysa geçiş eksik kalır.

## Fırsatlar ve Riskler

- Fırsat: Blocking kodu koruyup concurrency kazanmak; gereksiz reaktif karmaşıklığı azaltmak.
- Fırsat: `ScopedValue` ile auth, tenant ve trace context’i daha güvenli ve daha okunabilir hale getirmek.
- Fırsat: Batch ve klasik MVC servislerinde daha sade debugging ve daha okunabilir stack trace elde etmek.
- Risk: `ThreadLocal` cache mantığının virtual thread altında patlayan allocation veya beklenmedik context kaybı üretmesi.
- Risk: Scheduler ve `@Async` tarafında pooling varsayımının sessizce bozulması.
- Risk: Kafka listener concurrency’sini platform thread kapasitesinin üstüne çıkarıp pinning ve yarış sorunları üretmek.
- Risk: WebFlux’tan yalnız moda gereği çıkıp, aslında streaming/backpressure gerektiren servisleri yanlış modele taşımak.

## İzlenmesi Gereken Konular

- Spring Boot `4.1.x` ve `3.5.x` hatlarında virtual thread ile ilgili yeni issue, release note veya davranış düzeltmeleri
- Spring for Apache Kafka tarafında third-party library koordinasyonu tamamlandıkça virtual-thread concurrency tavsiyesinin nasıl değişeceği
- JDK 27 hattındaki [Structured Concurrency preview](https://jdk.java.net/27/release-notes) ve bunun Spring request fan-out desenlerine etkisi
- `ScopedValue` benimsenmesi arttıkça Spring Security, tracing ve observability ekosisteminde hangi entegrasyonların doğrudan bunu hedefleyeceği
- Düşük öncelik: Java 26/VS Code extension hattındaki tooling güncellemeleri; üretim mimarisi kararını tek başına belirlemez

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Virtual thread kararı Spring ekipleri için ilk kez net biçimde JDK 25 hedefli platform kararı haline geldi
- `source`: [OpenJDK JEP 491](https://openjdk.org/jeps/491) | [OpenJDK JEP 506](https://openjdk.org/jeps/506) | [Spring Boot SpringApplication docs](https://docs.spring.io/spring-boot/reference/features/spring-application.html) | [Optimizations in Spring MVC](https://spring.io/blog/2026/02/25/optimizing-spring-mvc)
- `author`: Patricio Chilano Mateo, Alan Bateman | Andrew Haley, Andrew Dinn | Spring Boot team | Dave Syer
- `date`: JDK 24 | JDK 25 | 6 Ağustos 2026 itibarıyla geçerli dokümantasyon | 25 Şubat 2026
- `category`: jvm, concurrency, framework-baseline
- `tags`: virtual-threads, jep-491, jep-506, spring-boot, spring-mvc, scoped-values, jdk-25
- `summary`: JEP 491, `synchronized` içindeki bloklamada virtual thread’in carrier thread’i bırakabilmesini sağlıyor; JEP 506 da `ScopedValue` API’sini finalize ediyor. Spring Boot dokümanı virtual thread için Java 24+ önerirken Spring MVC ölçümleri küçük veri kümelerinde ciddi throughput artışı gösteriyor.
- `why_it_matters`: Teknik tartışma “virtual threads olur mu?” noktasından “hangi servisleri ne sırayla taşırız?” noktasına geçti.
- `java_spring_relevance`: Blocking MVC, JPA, `RestClient`, scheduler ve batch kullanan klasik Spring servisleri için doğrudan mimari karar değeri var.
- `actionability`: `planli_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: daha sade request modeli; yüksek concurrency; daha okunabilir kod; daha az incidental reactive karmaşıklık
- `risks`: JDK 21 üzerinde kalıp pinning riskini hafife almak; yalnız property flip edip geri kalan borcu görmezden gelmek
- `migration_notes`: Mümkünse JDK 25 hedefleyin; değilse JDK 21’de pinning riskini JFR ile görünür kılın. Geçişi feature bazlı değil servis tipine göre planlayın.

### Bulgu 2

- `title`: `spring.threads.virtual.enabled` arka plandaki görev yürütme politikasını da değiştiriyor
- `source`: [Spring Boot Task Execution and Scheduling docs](https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html) | [Spring Boot SpringApplication docs](https://docs.spring.io/spring-boot/reference/features/spring-application.html)
- `author`: Spring Boot team
- `date`: 6 Ağustos 2026 itibarıyla geçerli dokümantasyon
- `category`: runtime-behavior, async-processing, scheduling
- `tags`: spring-boot, async, scheduler, simpleasynctaskexecutor, simpleasynctaskscheduler, virtual-threads
- `summary`: Virtual thread açıldığında auto-configured `AsyncTaskExecutor`, `SimpleAsyncTaskExecutor` olur; `TaskScheduler` da `SimpleAsyncTaskScheduler` olur ve pooling ayarlarını dikkate almaz.
- `why_it_matters`: Birçok ekip thread sınırını farkında olmadan `ThreadPoolTaskExecutor` ve scheduler pool size ile kontrol ediyor. Virtual thread geçişi bu örtük kapasite modelini bozabilir.
- `java_spring_relevance`: `@Async`, scheduled job, background publish/refresh, mail, webhook ve benzeri yan iş akışları Spring ekiplerinde çok yaygın.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: thread havuzu ayarıyla uğraşmadan daha basit concurrency modeli; request ve background işler için daha tutarlı gözlemleme
- `risks`: concurrency patlaması; kontrolsüz downstream çağrı artışı; scheduler beklentilerinin değişmesi
- `migration_notes`: `@Async` ve scheduled işlerinizi ayrı yük testine alın. Connection pool, semaphore ve rate limit ayarlarını thread pool’dan bağımsız yeniden yazın.

### Bulgu 3

- `title`: WebFlux’tan MVC’ye geçiş artık ideolojik değil, workload tipine bağlı karar filtresi
- `source`: [Virtual Threads after JDK 24: What Changed for Production Java](https://www.infoq.com/articles/virtual-threads-after-jdk24/) | [Optimizations in Spring MVC](https://spring.io/blog/2026/02/25/optimizing-spring-mvc) | [Spring Boot virtual thread docs](https://docs.spring.io/spring-boot/reference/features/spring-application.html)
- `author`: Sandeep Bharadwaj | Dave Syer | Spring Boot team
- `date`: 31 Temmuz 2026 | 25 Şubat 2026 | 6 Ağustos 2026 itibarıyla geçerli dokümantasyon
- `category`: architecture, web-stack, migration
- `tags`: spring-mvc, webflux, netty, tomcat, reactive, virtual-threads, migration
- `summary`: Spring Boot’ta virtual thread property’si Netty tabanlı WebFlux request modelini değiştirmiyor. Blocking request/response servislerde MVC + virtual thread sadeleşme fırsatı sunuyor; SSE, WebSocket, streaming ve backpressure kullanan servislerde WebFlux gerekçesi devam ediyor.
- `why_it_matters`: Web stack kararı artık framework modasıyla değil, akış semantiği ve I/O karakteristiğiyle verilmek zorunda.
- `java_spring_relevance`: Spring ekiplerinin en pahalı mimari borçlarından biri yanlış stack seçimi; bu bulgu onu yeniden çerçeveliyor.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: gereksiz Reactor zincirlerini sadeleştirmek; MVC’de daha basit debugging; bakım maliyetini azaltmak
- `risks`: streaming/backpressure gerektiren servisi yanlışlıkla blocking modele taşımak; ölçümsüz migration
- `migration_notes`: Önce servisleri sınıflandırın: blocking request/response, mixed, streaming. Sadece ilk grupta pilot açın; R2DBC/JDBC dönüşüm maliyetini ayrıca yazın.

### Bulgu 4

- `title`: Asıl migration yükü `ThreadLocal` ve context propagation borcunda
- `source`: [OpenJDK JEP 506](https://openjdk.org/jeps/506) | [Virtual Threads after JDK 24: What Changed for Production Java](https://www.infoq.com/articles/virtual-threads-after-jdk24/) | [New Features in Java 25](https://www.baeldung.com/java-25-features)
- `author`: Andrew Haley, Andrew Dinn | Sandeep Bharadwaj | Baeldung
- `date`: JDK 25 | 31 Temmuz 2026 | 2025 Java 25 özeti, 6 Ağustos 2026’da erişilen doküman
- `category`: context-propagation, concurrency, code-hygiene
- `tags`: threadlocal, inheritablethreadlocal, scopedvalue, context, tracing, security-context
- `summary`: `ScopedValue`, immutable context’i thread ve child thread’lere daha düşük maliyetle taşımak için finalize edildi. InfoQ ve Baeldung tarafı da `ThreadLocal` cache ve context alışkanlıklarının virtual thread altında yeniden düşünülmesi gerektiğini vurguluyor.
- `why_it_matters`: Virtual thread açmak kolay; gizli state taşıyan uygulama kodunu düzeltmek zor. Gerçek üretim riski burada.
- `java_spring_relevance`: Spring Security context, tenant context, trace correlation, MDC ve custom request context kodları sıklıkla `ThreadLocal` temelli.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: daha güvenli context aktarımı; daha az memory leak; daha temiz API sınırları
- `risks`: auth veya trace bilgisinin sessiz kaybı; thread başına cache beklentisinin çökmesi; beklenmeyen allocation artışı
- `migration_notes`: `ThreadLocal`, `InheritableThreadLocal` ve `withInitial()` kullanımını tarayın. Context amaçlı olanları `ScopedValue` aday listesine alın; cache amaçlı olanları bounded executor veya başka cache desenleriyle yeniden düşünün.

### Bulgu 5

- `title`: Spring Batch virtual thread için hazır yüzeye sahipken Kafka tarafı hâlâ kontrollü pilot gerektiriyor
- `source`: [Spring Batch 5.1 What’s New](https://docs.spring.io/spring-batch/reference/5.1/whatsnew.html) | [Spring for Apache Kafka Thread Safety](https://docs.spring.io/spring-kafka/reference/kafka/thread-safety.html) | [Dan Vega - JDK 24's Major Improvement: Virtual Threads Without Pinning](https://www.danvega.dev/blog/jdk-24-virtual-threads-without-pinning)
- `author`: Spring Batch team | Spring for Apache Kafka team | Dan Vega
- `date`: dokümantasyon ve blog içeriği 6 Ağustos 2026’da kontrol edildi; Dan Vega yazısı 9 Nisan 2025
- `category`: messaging, batch-processing, ecosystem-readiness
- `tags`: spring-batch, spring-kafka, listener-container, pinning, taskexecutor, batch
- `summary`: Spring Batch, virtual thread’i concurrent step ve paralel çalıştırma dahil framework genelinde destekliyor. Spring Kafka ise concurrent listener container’larda platform thread sayısını aşan concurrency için açık risk notu düşüyor. Dan Vega’nın pratik benchmark anlatısı da lock ve blocking I/O desenlerinin hâlâ tasarım dikkatine ihtiyaç duyduğunu gösteriyor.
- `why_it_matters`: Aynı organizasyonda web servisi güvenle taşıyıp messaging katmanında problem üretmek çok olası.
- `java_spring_relevance`: Batch, eventing ve stream işleyen Spring ekipleri için portföy içi readiness farkı doğrudan mimari karar etkisidir.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: batch tarafında daha hızlı parallelization denemeleri; lock tabanlı iş akışlarında daha iyi throughput
- `risks`: Kafka listener tarafında pinning, yarış ve kapasite sürprizi; lock kapsamının yanlış tasarlanması
- `migration_notes`: Batch ve MVC için ayrı pilot lane açın; Kafka listener concurrency’yi platform thread sayısını aşmayacak şekilde sınırlayın; lock granularity ve blocking I/O bölgelerini kod incelemesine alın.

## Sonuç

6 Ağustos 2026 için ana karar şudur: Java/Spring ekipleri virtual thread’i artık “bir gün bakarız” başlığında tutmamalı. JVM tarafında `JEP 491` ve `JEP 506` ile temel risk profili anlamlı biçimde iyileşti; Spring tarafında da Boot ve ilgili dokümantasyon bu kararı operasyonel hale getirecek kadar netleşti. Buna rağmen geçiş tek satırlık config işi değil. En kritik işler `ThreadLocal` temizliği, explicit kaynak sınırları, WebFlux/MVC karar filtresi ve messaging/batch yüzeylerini ayrı değerlendirmek olacak. Güçlü ekipler için bugünün fırsatı yeni framework kovalamak değil, bu concurrency modelini kontrollü ve ölçülü biçimde üretime yaklaştırmak.
