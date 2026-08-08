# Günlük Java / Spring Ekosistem Raporu

Tarih: 8 Ağustos 2026 Cumartesi  
Tarama zamanı: 8 Ağustos 2026 09:07 TSİ  
Odak: sanal thread geçişinde thread-pool ayarlarından kaynak bütçesi ve observability disiplinine geçiş

Tarama notu: 8 Ağustos 2026 09:07 TSİ itibarıyla [Spring Blog](https://spring.io/blog), [Spring proje sayfaları](https://spring.io/projects), [Spring Boot referans dokümantasyonu](https://docs.spring.io/spring-boot/reference/features/spring-application.html), [Spring Framework resilience dokümantasyonu](https://docs.spring.io/spring-framework/reference/core/resilience.html), [Spring for Apache Kafka thread-safety dokümantasyonu](https://docs.spring.io/spring-kafka/reference/kafka/thread-safety.html), [Spring Batch 6 yenilikleri](https://docs.spring.io/spring-batch/reference/whatsnew.html), [Oracle Virtual Threads dokümantasyonu](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html), [OpenJDK JEP 491](https://openjdk.org/jeps/491), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/articles/virtual-threads-after-jdk24/), [Baeldung](https://www.baeldung.com/java-synchronize-virtual-thread-no-pinning), Josh Long’un son paylaşımları ([This Week in Spring - August 4th, 2026](https://spring.io/blog/2026/08/04/this-week-in-spring-august-4-2026), [Phil Webb podcast bölümü](https://spring.io/blog/2026/07/30/a-bootiful-podcast-phil-webb)), Gunnar Morling’in güncel blog akışı, ilgili GitHub release yüzeyleri ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Bugün yeni bir büyük Spring GA dalgası yok; GitHub release yüzeyleri hâlâ Haziran 2026’daki `Spring Boot 4.1.0`, `Spring Security 7.1.0`, `Spring Kafka 4.1.0`, `Spring Batch 6.0.4` ve `Spring Framework 7.0.8` çizgisini gösteriyor. Bu yüzden bugünün güçlü sinyali sürüm değil: sanal thread’lerin JDK 24+/25 ile daha güvenli hale gelmesi, ama Spring uygulamalarında concurrency sınırını thread pool’dan veritabanı, broker, scheduler ve rate-limit tarafına taşıması. Gunnar Morling’in son Hardwood/Parquet yazıları ile Burak KUTBAY blogundaki Feature Flag ve ArchUnit içerikleri tekrar gözden geçirildi; bugünün ana kararını değiştirecek daha yeni ve daha yüksek öncelikli bir Spring/JVM concurrency sinyali üretmiyorlar.

## Öne Çıkan Başlıklar

- Sanal thread’ler artık Spring Boot servislerinde açılması kolay bir özellik ama resmi dokümanlar bunun yalnız performans ayarı değil, executor ve scheduler semantiği değişikliği olduğunu açıkça söylüyor.
- Oracle’ın resmi rehberi ile Spring Framework’ün `@ConcurrencyLimit` yaklaşımı aynı yere çıkıyor: gerçek limit artık thread sayısı değil, erişilen kaynağın kapasitesi.
- `Spring for Apache Kafka` dokümanı sanal thread altında yüksek listener concurrency konusunda hâlâ temkinli; mesajlaşma hattı "tek property ile aç ve unut" seviyesinde değil.
- `Spring Batch 6`, local chunking ve JFR observability ile batch tarafında daha fazla yerel paralellik açıyor; bu da concurrency bütçesini mimari karar haline getiriyor.
- Bugün yeni büyük release yok; üretim için en değerli karar yeni sürüm kovalamak değil, sanal thread rollout disiplinini doğru kurmak.

## Kritik Güncellemeler

### 1. Spring Boot’ta sanal thread açmak executor davranışını değiştiriyor

[Spring Boot dokümantasyonu](https://docs.spring.io/spring-boot/reference/features/spring-application.html) ve [task execution/scheduling bölümü](https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html), `spring.threads.virtual.enabled=true` ayarının sadece "daha hızlı thread" vermediğini; auto-configured executor ve scheduler davranışını da değiştirdiğini açıkça belirtiyor.

Pratik etkiler:

- Pool boyutu ayarları etkisiz hale gelebiliyor.
- Scheduler tarafı `SimpleAsyncTaskScheduler` ile çalışıp pooling ayarlarını yok sayabiliyor.
- Sanal thread’ler daemon thread olduğu için, özellikle `@Scheduled` ağırlıklı servislerde `spring.main.keep-alive=true` olmadan JVM’in beklenenden erken kapanması mümkün.

Bu, "aynı servis, yalnız başka thread tipi" kadar hafif bir geçiş olmadığını gösteriyor.

### 2. JDK 24+/25 ile en görünür pinning darboğazı azaldı, ama risk bitmedi

[OpenJDK JEP 491](https://openjdk.org/jeps/491) ve [Oracle Virtual Threads rehberi](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html), `synchronized` kaynaklı en görünür carrier pinning probleminin JDK 24 ile büyük ölçüde iyileştirildiğini gösteriyor. Ancak resmi rehber hâlâ `jdk.VirtualThreadPinned` olayını, JSON thread dump’larını ve pinning gözlemini rollout kontrol listesinde tutuyor.

Kalan risk alanları:

- native method / foreign function çağrıları
- class loading ve class initializer yolları
- Linux local file I/O

Yani "JDK 25’e çıktık, pinning konusu kapandı" sonucu teknik olarak savunulamaz.

### 3. Messaging ve batch tarafı daha açık concurrency guardrail istiyor

[Spring for Apache Kafka thread safety dokümantasyonu](https://docs.spring.io/spring-kafka/reference/kafka/thread-safety.html), sanal thread’lerde listener container concurrency değerinin platform thread sayısını aşması halinde pinning ve race-condition riskine dikkat çekiyor. [Spring Batch 6 yenilikleri](https://docs.spring.io/spring-batch/reference/whatsnew.html) ise local chunking, graceful shutdown ve JFR observability ile daha fazla yerel paralellik açıyor.

Bu iki sinyal birlikte şu anlama geliyor: request/response servisleri ile event-driven veya batch workload’ları aynı olgunluk seviyesinde değil. Sanal thread rollout’u workload türüne göre ayrıştırılmalı.

## Trendler ve Sinyaller

### Trend Kümesi 1: Concurrency bütçesi thread pool ayarından kaynak bütçesine kayıyor

[Oracle Virtual Threads rehberi](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html) açık biçimde şunu söylüyor: sanal thread’ler thread pool ile sınırlandırılmamalı; limit gerekiyorsa semaphore, rate-limit veya bağlantı havuzu gibi kaynağa yakın mekanizmalar kullanılmalı. [Spring Framework resilience dokümantasyonu](https://docs.spring.io/spring-framework/reference/core/resilience.html) da `@ConcurrencyLimit` ile aynı yaklaşımı Spring içine taşıyor.

Bu, Java/Spring ekipleri için önemli bir zihniyet kayması:

- thread pool artık varsayılan bulkhead değil
- JDBC pool, broker concurrency, dış API QPS limiti ve disk I/O bütçesi asıl sınırlayıcı
- başarısız rollout belirtileri CPU’dan çok downstream saturasyonu ve GC davranışında görülebilir

### Trend Kümesi 2: Observability nice-to-have değil, rollout gate

[Oracle Virtual Threads](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html) rehberi `jdk.VirtualThreadPinned` ve `jcmd Thread.dump_to_file -format=json` kullanımını doğrudan öneriyor. [Spring Batch 6](https://docs.spring.io/spring-batch/reference/whatsnew.html) ise JFR olaylarını batch runtime observability’sinin parçası yapıyor. [InfoQ’nun 31 Temmuz 2026 tarihli analizi](https://www.infoq.com/articles/virtual-threads-after-jdk24/) da gerçek sorunların pinning, `ThreadLocal` cache davranışı ve bağlantı havuzu sınırlarında çıktığını gösteriyor.

Teknik sonuç: sanal thread rollout’u benchmark screenshot ile değil, JFR ve JSON thread dump ile doğrulanmalı.

### Trend Kümesi 3: HTTP request/response tarafı önce olgunlaşıyor, streaming ve message-driven taraf temkin istiyor

[InfoQ](https://www.infoq.com/articles/virtual-threads-after-jdk24/), Spring MVC + sanal thread modelini blocking I/O servisler için güçlü varsayılan olarak konumlarken; backpressure, SSE, WebSocket ve streaming ağırlıklı işlerde WebFlux değerinin sürdüğünü söylüyor. Spring Kafka’nın uyarısı da bu ayrımı güçlendiriyor.

Yani mimari karar artık "reactive mi, thread-per-request mi?" ikiliği değil. Daha doğru soru şu:

- hangi çağrı yolu blocking I/O ağırlıklı
- hangi yol backpressure gerektiriyor
- hangi yol broker, pool veya file I/O nedeniyle pinning/saturasyon riski taşıyor

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: sanal thread rollout’unu kaynak bütçesi ve JFR ile yönetmek
- Kalıcı değer: `ThreadLocal` cache, scheduler keep-alive ve listener concurrency varsayımlarını yeniden denetlemek
- Kalıcı değer: workload bazlı rollout yapmak; her servise aynı anda açmamak
- Düşük öncelik: yalnız "JDK 24/25 daha iyi" argümanıyla tüm servislerde sanal thread default’u açmak
- Düşük öncelik: Kafka, batch ve scheduler tarafındaki farklı olgunlukları yok sayıp tek tip concurrency politikası uygulamak

## Araçlar ve Kütüphaneler

- [Spring Boot virtual threads ayarı](https://docs.spring.io/spring-boot/reference/features/spring-application.html): `spring.threads.virtual.enabled=true` ancak yanında `spring.main.keep-alive=true` ihtiyacını da değerlendirin.
- [Spring Framework `@ConcurrencyLimit`](https://docs.spring.io/spring-framework/reference/core/resilience.html): sanal thread altında thread pool yerine kaynak bazlı concurrency sınırı koymanın çekirdek Spring yolu.
- [Oracle JFR ve `jcmd` araçları](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html): `jdk.VirtualThreadPinned` ve JSON thread dump, rollout doğrulamasında en değerli iki araç.
- [Spring Batch 6 local chunking ve JFR olayları](https://docs.spring.io/spring-batch/reference/whatsnew.html): batch tarafında paralelliği artırırken runtime gözlemini de çekirdeğe taşıyor.
- [Baeldung’in güncel pinning yazısı](https://www.baeldung.com/java-synchronize-virtual-thread-no-pinning): resmi kaynak değil ama JDK 24 öncesi/sonrası davranış farkını hızlı laboratuvar düzeyinde görmek için pratik bir açıklayıcı.
- Düşük öncelik: [Inside Java’daki "Embracing Virtual Threads with Helidon" bölümü](https://inside.java/) bu alanın hâlâ aktif topluluk odağı olduğunu gösteriyor; doğrudan migration rehberi değil ama yön doğrulayıcı bir sinyal.

## Java / Spring Geliştiricileri İçin Etkiler

- `spring.threads.virtual.enabled` açmayı bir tuning parametresi gibi değil, concurrency model değişikliği gibi ele alın.
- `ThreadLocal.withInitial`, `SimpleDateFormat`, özel serializer/buffer cache’leri ve thread reuse varsayan yardımcı sınıfları kod taramasına alın.
- Sadece scheduler kullanan servislerde `spring.main.keep-alive` ihtiyacını doğrulayın.
- Kafka consumer servislerinde listener concurrency değerini platform thread sınırını aşmayacak şekilde tutun; özellikle burst trafik ve rebalance senaryolarında yük testi yapın.
- Batch işlerinde önce tek thread’li baseline ölçün; sonra local chunking veya daha geniş paralellik açın.
- Blocking HTTP/JDBC servislerinde sanal thread iyi sonuç verebilir; ama WebFlux, SSE, WebSocket ve backpressure ağırlıklı akışlarda reactive modelin değeri sürüyor.

## Fırsatlar ve Riskler

- Fırsat: Daha sade blocking kod ile daha yüksek throughput elde etmek
- Fırsat: Thread pool tuning karmaşasını azaltıp kaynağa yakın bulkhead kuralları tanımlamak
- Fırsat: JFR ve JSON thread dump ile concurrency sorunlarını daha erken görünür hale getirmek
- Risk: Pool ayarlarının artık koruyucu sınır olmadığını fark etmeden DB/API doygunluğuna gitmek
- Risk: `ThreadLocal` cache’lerin sessizce bozulup GC baskısını artırması
- Risk: `@Scheduled` tabanlı servislerin daemon thread davranışı nedeniyle yaşam döngüsü problemi yaşaması
- Risk: Kafka listener concurrency veya batch paralelliğini platform thread ve downstream kapasitesinden bağımsız artırmak

## İzlenmesi Gereken Konular

- `Spring for Apache Kafka` tarafında sanal thread uyumluluğu için üçüncü parti bağımlılıkların ne hızda olgunlaştığı
- `Spring Boot 4.1.x` ve sonraki örneklerde sanal thread + keep-alive + scheduler desenlerinin nasıl belgelenmeye devam edeceği
- `Spring Batch 6.1` hattında local chunking, JFR olayları ve graceful shutdown etrafındaki erken saha geri bildirimleri
- Java tarafında Scoped Values ve Structured Concurrency rehberlerinin Spring örneklerine daha açık yansıyıp yansımadığı
- Düşük öncelik: Gunnar Morling ve Burak KUTBAY tarafında bu ekseni doğrudan genişleten yeni concurrency yazıları gelirse yeniden değerlendirilmesi

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Boot’ta sanal thread açmak executor ve scheduler semantiğini değiştiriyor
- `source`: [Spring Boot - SpringApplication](https://docs.spring.io/spring-boot/reference/features/spring-application.html) | [Spring Boot - Task Execution and Scheduling](https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html)
- `author`: Spring Boot team
- `date`: 8 Ağustos 2026 itibarıyla güncel referans dokümantasyonu
- `category`: runtime-concurrency, boot
- `tags`: spring-boot, virtual-threads, executor, scheduler, daemon-threads, keep-alive
- `summary`: `spring.threads.virtual.enabled=true` yalnızca yeni bir executor seçmiyor; scheduler tarafında pooling ayarlarını yok sayan bir modele geçiyor ve daemon thread davranışı nedeniyle `spring.main.keep-alive=true` ihtiyacını doğurabiliyor.
- `why_it_matters`: Aynı kod tabanı, aynı business logic ile runtime davranışı değişiyor; bu üretimde sessiz davranış farkları üretebilir.
- `java_spring_relevance`: Spring Boot servisleri için bu karar doğrudan actuator, scheduler, async task ve yaşam döngüsü davranışını etkiliyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: daha sade blocking servisler; daha az thread-pool tuning; daha yüksek I/O throughput
- `risks`: pool ayarlarına güvenen koruma mekanizmalarının kaybolması; scheduler tabanlı servislerin beklenmedik JVM çıkışı
- `migration_notes`: `spring.task.*` ayarlarını ve `@Scheduled` kullanan servisleri tek tek inceleyin; sanal thread rollout’unda `spring.main.keep-alive=true` gerekip gerekmediğini yük testi ve kapanış senaryoları ile doğrulayın.

### Bulgu 2

- `title`: Oracle’ın resmi rehberi sanal thread’i hız değil kapasite aracı olarak konumluyor
- `source`: [Oracle Virtual Threads](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html) | [Spring Framework Resilience Features](https://docs.spring.io/spring-framework/reference/core/resilience.html)
- `author`: Oracle Java team | Spring Framework team
- `date`: Oracle Java SE 25 dokümantasyonu | 8 Ağustos 2026 itibarıyla güncel Spring Framework dokümantasyonu
- `category`: concurrency-governance, jdk
- `tags`: oracle-java, virtual-threads, semaphore, connection-pool, threadlocal, concurrencylimit
- `summary`: Oracle rehberi sanal thread’lerin "daha hızlı thread" olmadığını; kapasite artışı için tasarlandığını, pool’lanmaması gerektiğini ve limit gerekiyorsa semaphore ya da mevcut connection-pool sınırları ile konulması gerektiğini söylüyor. Spring Framework’ün `@ConcurrencyLimit` yaklaşımı bu modeli çerçeveye taşıyor.
- `why_it_matters`: Asıl mimari karar thread sayısı değil, hangi kaynağa kaç eşzamanlı erişime izin verileceği.
- `java_spring_relevance`: Spring MVC, JDBC, HTTP client, scheduler ve dış servis çağrıları yapan bütün servislerde concurrency kontrolü yeniden düşünülmeli.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: thread pool karmaşasını azaltmak; daha net kaynak bütçesi; daha iyi bulkhead tasarımı
- `risks`: DB/API doygunluğu; `ThreadLocal` cache patlaması; GC baskısının sessiz yükselmesi
- `migration_notes`: thread pool’u throttle gibi kullanan kodu tarayın; gerekiyorsa semaphore, rate-limit, bağlantı havuzu sınırları veya `@ConcurrencyLimit` ile kaynağa yakın guardrail kurun. `ThreadLocal` cache’leri özellikle gözden geçirin.

### Bulgu 3

- `title`: JDK 24+ synchronized pinning darboğazını daralttı ama rollout checklist’i ortadan kaldırmadı
- `source`: [OpenJDK JEP 491](https://openjdk.org/jeps/491) | [Oracle Virtual Threads](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html) | [Virtual Threads after JDK 24: What Changed for Production Java](https://www.infoq.com/articles/virtual-threads-after-jdk24/) | [Baeldung - Synchronize Virtual Thread Without Pinning](https://www.baeldung.com/java-synchronize-virtual-thread-no-pinning)
- `author`: OpenJDK | Oracle Java team | Sandeep Bharadwaj | Baeldung
- `date`: JEP 491 | Oracle Java SE 25 dokümantasyonu | 31 Temmuz 2026 | 2026
- `category`: jdk-runtime, diagnostics
- `tags`: jep-491, pinned-threads, jfr, jcmd, jdk24, jdk25, diagnostics
- `summary`: `synchronized` kaynaklı en görünür carrier pinning sorunu JDK 24 ile belirgin biçimde azalmış durumda. Ancak native method, class loading ve Linux file I/O gibi yollar hâlâ pinning üretebiliyor; bu yüzden `jdk.VirtualThreadPinned` ve JSON thread dump’ları rollout kontrol listesinden çıkmıyor.
- `why_it_matters`: "JDK yükselttik, problem çözüldü" yaklaşımı eksik; bazı workload’larda asıl incident yüzeyi yine runtime altında kalabilir.
- `java_spring_relevance`: Spring Boot servisleri, özellikle üçüncü parti sürücüler, loglama/telemetri eklentileri, şifreleme sağlayıcıları ve yoğun dosya erişimi kullanan sistemlerde bu risk doğrudan üretime taşınır.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: JDK 24+/25 ile daha güvenli sanal thread rollout; daha düşük lock kaynaklı adoption riski
- `risks`: native/file-I/O kaynaklı gizli pinning; jstack ile görünmeyen ama JFR’de ortaya çıkan scheduler sıkışmaları
- `migration_notes`: rollout öncesi JFR açın, `jdk.VirtualThreadPinned` olaylarını izleyin, gerektiğinde `jcmd <pid> Thread.dump_to_file -format=json` ile inceleme yapın. JDK 21’den 24+/25’e geçişi yalnız derleme uyumu ile değil yük testi ile doğrulayın.

### Bulgu 4

- `title`: Spring for Apache Kafka sanal thread ile yüksek listener concurrency konusunda hâlâ temkin istiyor
- `source`: [Spring for Apache Kafka - Thread Safety](https://docs.spring.io/spring-kafka/reference/kafka/thread-safety.html)
- `author`: Spring for Apache Kafka team
- `date`: 8 Ağustos 2026 itibarıyla güncel referans dokümantasyonu
- `category`: messaging, kafka
- `tags`: spring-kafka, listener-container, concurrency, virtual-threads, pinned-threads, race-conditions
- `summary`: Resmi dokümantasyon, altyapı kütüphanelerindeki `synchronized` koordinasyon sınırlamaları nedeniyle sanal thread altında listener container concurrency değerinin platform thread sayısını aşmasının pinning ve race-condition riski doğurabileceğini açıkça belirtiyor.
- `why_it_matters`: Event-driven servislerde concurrency kazancı yanıltıcı olabilir; en hassas üretim yükleri tam da burada bulunur.
- `java_spring_relevance`: Kafka consumer, stream processor ve yüksek hacimli event-driven Spring servisleri için doğrudan operasyonel etki taşır.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: bounded rollout ile consumer throughput kazanımı; daha kontrollü modernizasyon
- `risks`: burst trafikte scheduler sıkışması; race-condition; yanlış listener concurrency kararıyla görünmeyen incident üretmek
- `migration_notes`: listener concurrency değerini mevcut platform thread kapasitesi ve broker/backing store sınırları ile bağlayın. Sanal thread’i önce düşük concurrency ile açın; rebalance, retry ve burst load senaryolarını ayrıca test edin.

### Bulgu 5

- `title`: Spring Batch 6, paralelliği büyütürken JFR observability’yi de çekirdeğe taşıyor
- `source`: [What’s New in Spring Batch 6](https://docs.spring.io/spring-batch/reference/whatsnew.html) | [Scaling and Parallel Processing](https://docs.spring.io/spring-batch/reference/scalability.html)
- `author`: Spring Batch team
- `date`: 8 Ağustos 2026 itibarıyla güncel Spring Batch 6.0.4 dokümantasyonu
- `category`: batch, observability, concurrency
- `tags`: spring-batch, local-chunking, jfr, graceful-shutdown, scalability, taskexecutor
- `summary`: Spring Batch 6, local chunking, graceful shutdown ve JFR olayları ile batch işlerinde aynı JVM içinde daha fazla paralellik ve daha fazla görünürlük sunuyor. Ancak bu aynı zamanda item işlemeyi veritabanı, dosya sistemi ve dış servis kapasitesiyle daha dikkatli eşleştirme zorunluluğu doğuruyor.
- `why_it_matters`: Batch işlerinde concurrency açmak artık daha kolay; yanlış açmak da daha kolay.
- `java_spring_relevance`: Büyük veri hacimli Spring Batch işlerinde işleme modeli, restartability ve transaction sınırları doğrudan etkilenir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: daha yüksek batch throughput; daha iyi JFR tabanlı gözlem; kontrollü graceful shutdown
- `risks`: okuma/yazma darboğazları; store kapasitesini aşan chunk paralelliği; worker thread transaction beklentilerinde yanlış varsayımlar
- `migration_notes`: önce single-thread baseline çıkarın; sonra local chunking ve `TaskExecutor` ile kademeli artış yapın. JFR ile step/item/transaction davranışını gözleyin; store bazlı concurrency limitleri tanımlayın.

### Bulgu 6

- `title`: Bugünün önceliği yeni release kovalamak değil, rollout disiplinini kurmak
- `source`: [Spring Boot Releases](https://github.com/spring-projects/spring-boot/releases) | [Spring Security Releases](https://github.com/spring-projects/spring-security/releases) | [Spring for Apache Kafka Releases](https://github.com/spring-projects/spring-kafka/releases) | [Spring Batch Releases](https://github.com/spring-projects/spring-batch/releases) | [Spring Framework Releases](https://github.com/spring-projects/spring-framework/releases)
- `author`: ilgili Spring proje ekipleri
- `date`: 8 Ağustos 2026 itibarıyla GitHub release yüzeyleri
- `category`: release-cadence, portfolio-signal
- `tags`: spring-releases, boot-4-1, security-7-1, kafka-4-1, batch-6-0-4, framework-7-0-8
- `summary`: Son büyük kararlı Spring çekirdek sürümleri Haziran 2026 çizgisinde kalıyor; bugün aynı gün yeni kritik GA veya patch dalgası yok. Bu yüzden karar alanı sürüm seçimi değil, mevcut runtime kabiliyetlerini nasıl güvenli devreye alacağınız.
- `why_it_matters`: Raporun değeri gerçek sinyali ayıklamakta; bugün release-notes tekrarı değil, concurrency rollout riski önde.
- `java_spring_relevance`: Spring ekipleri yanlışlıkla "bugün release yoksa haber de yok" sonucuna gitmemeli; operasyonel mimari sinyal çoğu gün sürüm sinyalinden daha güçlüdür.
- `actionability`: `bilgi`
- `impact_level`: `orta`
- `opportunities`: teknik borcu sürüm kovalamak yerine rollout check-listesine çevirmek
- `risks`: release yok diye runtime davranış değişimini küçümsemek
- `migration_notes`: mevcut 2026.06 tabanını korurken sanal thread, scheduler, batch ve messaging davranışını kontrollü pilotlarla doğrulayın.

## Sonuç

8 Ağustos 2026 için en değerli Java/Spring sinyali yeni bir artifact adı değil. Asıl sinyal şu: sanal thread’ler artık üretime daha yakın, ama koruyucu sınırlar thread pool ayarlarında değil. Spring Boot scheduler davranışı, Oracle’ın kaynak bazlı concurrency rehberi, Spring Kafka’nın temkinli uyarısı ve Spring Batch 6’nın açtığı yerel paralellik birlikte okunduğunda doğru karar şudur: sanal thread rollout’unu servis bazlı yapın, `ThreadLocal` ve scheduler varsayımlarını tarayın, Kafka ve batch concurrency’yi açıkça sınırlandırın, JFR ve JSON thread dump’ı standart rollout kanıtı haline getirin. Bugünün backlog değeri yeni sürüm yükseltmekten çok, mevcut runtime modelini yanlış anlamamaktır.
