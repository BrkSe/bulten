# Günlük Java / Spring Ekosistem Raporu

Tarih: 22 Mayıs 2026  
Tarama zamanı: 22 Mayıs 2026 09:04 TSİ  
Odak: Spring AI bellek mimarisi, Spring Framework 7 / Boot 4.1 platform sertleştirmeleri, JDK 26 istemci ve JDBC etkileri, Kafka tarafında yeni tüketim semantiği

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring release/advisory sayfaları](https://spring.io/security), [OpenJDK / JDK 26 release notes](https://jdk.java.net/26/release-notes), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’un yazıları](https://spring.io/blog/author/jlong), [Gunnar Morling’in blogu](https://www.morling.dev/blog/), ilgili GitHub/release kaynakları ve [Burak KUTBAY’ın blogu](https://blog.burakkutbay.com/) tarandı. 22 Mayıs 2026 sabahı taramasında 21 Mayıs 2026 sonrasına ait yeni bir büyük Spring Security veya Spring Cloud advisory dalgası görünmedi; bu yüzden rapor, son iki haftadaki ancak önceki raporlarda merkezlenmemiş daha kalıcı mühendislik sinyallerine odaklandı. Baeldung tarafında daha çok öğretici içerik, Gunnar Morling tarafında ise daha çok veri/Parquet odaklı araç sinyali vardı; karar kalitesini değiştiren ana hareketler yine resmi release, dokümantasyon ve platform notlarından geldi.

## Öne Çıkan Başlıklar

- [Spring AI 1.0.7 / 1.1.6 / 2.0.0-M6](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now) ile bellek yönetimi çizgisi daha açık hale geldi: implicit conversation memory kaldırılıyor, `PromptChatMemoryAdvisor` devreden çıkıyor ve çağrı başına açık conversation kimliği yönetimi bekleniyor.
- [Spring AI Session API](https://spring.io/blog/2026/04/15/spring-ai-agentic-patterns-part-7-session-api) yazısı, Spring AI tarafında state yönetiminin kısa vadeli feature değil, kalıcı mimari değişim olduğunu gösteriyor: event-sourced session log, compaction ve branch isolation doğrudan çok-ajanlı sistemler için tasarlanıyor.
- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now) ve [InfoQ’daki Spring 7 / Boot 4 röportajı](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) birlikte okunduğunda şu tablo netleşiyor: Spring ekibi API versioning, retry, concurrency throttling, SSRF koruması ve observability gibi konuları yan kütüphane değil platform standardı haline getiriyor.
- [JDK 26 HTTP Client güncellemeleri](https://inside.java/2026/03/04/jdk-26-http-client/) ve [JDK 26 release notes](https://jdk.java.net/26/release-notes), Java runtime yükseltmesinin artık sadece JVM performansı değil istemci davranışı ve entegrasyon semantiği anlamına geldiğini gösteriyor.
- [Spring Kafka 4.1.0-RC1](https://spring.io/blog/2026/05/06/spring-for-apache-kafka-4-1-0-RC1-4-0-5-and-3-3-15-available-now) ile gelen share consumer ve KIP-1034 hizası, event-driven Spring ekipleri için kuyruk ve hata yönetimini broker-native bir modele yaklaştırıyor.

## Kritik Güncellemeler

### 1. Spring AI tarafında "hafıza" artık yardımcı sınıf değil, mimari yüzey

[Spring AI 1.0.7 / 1.1.6 / 2.0.0-M6 release notu](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now) ve [2.0 upgrade notları](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/upgrade-notes.html), iki önemli kırılım gösteriyor:

- Implicit/default conversation ID davranışı kaldırılıyor.
- `PromptChatMemoryAdvisor` yerine daha açık, request-bazlı state yönetimi bekleniyor.

[Session API yazısı](https://spring.io/blog/2026/04/15/spring-ai-agentic-patterns-part-7-session-api) ise bu kırılımın nedenini açıklıyor: klasik `ChatMemory`, modern agentic iş yükleri için çok düz bir soyutlama kalıyor. Yeni yön; event log, short-term memory, compaction, branch isolation ve agent transition metadata gibi kavramlarla çok-oturumlu ve çok-ajanlı sistemleri hedefliyor.

Bu neden kritik:

- Spring AI kullanan ekiplerde yanlış memory scope, veri sızıntısı ve kullanıcılar arası bağlam karışması doğrudan prod riski üretir.
- Bu, "AI demo kodu" seviyesinde bir API değişimi değil; multi-tenant sohbet, agent orchestration ve auditability çizgisini etkileyen bir mimari karar.
- Upgrade sırasında derleme kırıkları ve davranış farkları görmek normal; asıl risk bunları sıradan refactor gibi küçümsemek.

Kısa yorum: Bugün Spring AI kullanan ekipler için doğru yaklaşım, `conversationId` ve session scope tasarımını uygulama contract’ının parçası gibi ele almak. "Varsayılan memory" veya "tek global sohbet geçmişi" yaklaşımı artık zayıf bir model.

### 2. Spring Framework 7 / Boot 4.1 hattı, platform varsayımlarını daha katı hale getiriyor

[Spring Boot 4.1.0-RC1 duyurusu](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now) şu alanlarda doğrudan platform etkisi olan yenilikler getiriyor:

- OpenTelemetry env var desteği,
- `LazyConnectionDataSourceProxy` iyileştirmeleri,
- `InetAddressFilter` ile SSRF azaltma,
- Undertow 4.0 entegrasyonu,
- `RestClient`/`WebClient` için yeni gözlem ve yapılandırma noktaları.

[InfoQ’daki Spring team röportajı](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) ise daha büyük resmi veriyor:

- API versioning için framework içi model,
- core retry ve concurrency throttling,
- Spring Boot 3.5 OSS bakım penceresinin Haziran 2026’da daralması,
- yükseltmenin artık sadece dependency bump değil, platform modernizasyonu olması.

[Burak KUTBAY’ın Spring Framework 7 API versiyonlama yazısı](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/) da bu resmi pratik tarafa çekiyor: header bazlı versiyonlama, `version` attribute’ü ve property tabanlı yönetim, özellikle kurumsal REST yüzeyleri için uygulanabilir bir yol sunuyor.

Bu neden kritik:

- Spring ekibi bir süredir opsiyonel kalan konuları çekirdeğe alıyor; bu, kurum içi ortak starter ve wrapper katmanlarının bazılarını gereksiz hale getirebilir.
- SSRF azaltma, retry ve API versioning gibi konular artık "sonradan ekleriz" alanından çıkıp platform baseline’ına dönüşüyor.
- Haziran 2026 destek takvimi nedeniyle Boot 3.5 üzerinde kalan ekiplerin karar penceresi daralıyor.

Kısa yorum: Boot 4 / Framework 7 geçişini sadece kod uyumluluğu olarak ele alan ekipler eksik bakıyor. Asıl konu, kurumun API yönetişimi, resilience standardı ve runtime güvenlik çizgisinin yeniden tanımlanması.

### 3. JDK 26 artık istemci davranışını ve veri erişim semantiğini de değiştiriyor

[Inside Java’daki HTTP Client güncelleme yazısı](https://inside.java/2026/03/04/jdk-26-http-client/) ve [JDK 26 release notes](https://jdk.java.net/26/release-notes), backend ekipleri için iki ayrı sinyal taşıyor.

HTTP tarafında:

- HTTP/3 desteği geldi.
- `send()` / `sendAsync()` timeout davranışı artık response body tüketimini de kapsıyor.
- `SSLParameters` artık `connect()` sırasında daha tutarlı uygulanıyor.
- Body olmayan bazı isteklerde `Content-Length: 0` otomatik gönderimi kaldırıldı.

JDBC tarafında:

- JDBC 4.5 ile `JSON` ve `DECFLOAT` `JDBCType` / `Types` sabitlerine ekleniyor.
- `Array`, `Blob`, `Clob`, `NClob`, `SQLXML` gibi tipler `AutoCloseable` oluyor.
- Bu değişimler özellikle driver ve framework ekosisteminde uyumluluk etkisi yaratabilir.

Bu neden kritik:

- JDK HttpClient kullanan ya da dolaylı olarak JDK istemci davranışına yaslanan servislerde timeout ve header davranışı farkı entegrasyon testlerini etkileyebilir.
- JSON column ve kaynak yaşam döngüsü tarafındaki JDBC değişimleri, Spring JDBC / Spring Data JDBC / jOOQ / driver katmanlarını orta vadede daha standart hale getirebilir.
- Runtime upgrade’in yalnız JVM flag veya GC konusu olmadığını bir kez daha gösteriyor.

Kısa yorum: Java 26’ya geçiş planlayan ekipler için staging test kapsamına HTTP client timeouts, upstream proxy davranışı ve JDBC driver uyumluluğu mutlaka eklenmeli.

## Trendler ve Sinyaller

### Trend Kümesi 1: İmplicit davranıştan explicit kontratlara geçiş

- Spring AI, memory scope’u açık conversation ve session kavramlarıyla sertleştiriyor.
- Spring Framework 7, API versioning’i framework yüzeyine taşıyor.
- Spring Kafka share consumer modeli, ack ve hata davranışını daha görünür hale getiriyor.

Bu kümenin kalıcı değeri yüksek. Çünkü hepsi aynı şeyi söylüyor: state, version ve teslimat semantiği artık gizli framework davranışı olarak bırakılmıyor.

### Trend Kümesi 2: Platform yetenekleri çekirdeğe çekiliyor

- Retry, concurrency throttling, SSRF koruması, observability ve HTTP istemci davranışı gibi alanlar yan araçlardan çekirdeğe yaklaşıyor.
- Bu, platform ekiplerinin "bizim ortak starter bunu sağlıyor" dediği katmanları yeniden değerlendirmesi gerektiği anlamına geliyor.

Kısa vadeli gürültü değil; orta ve uzun vadeli mimari değer taşıyor.

### Trend Kümesi 3: Broker-native ve runtime-native özelliklere dönüş

- Kafka tarafında share consumers ve native DLQ yönü,
- Java tarafında HTTP/3 ve daha belirgin timeout semantiği,
- Spring AI tarafında event-sourced session yaklaşımı.

Ortak sinyal şu: soyutlama hâlâ önemli, ama soyutlamanın altındaki runtime ve broker modeli daha açık biçimde yüzeye çıkıyor.

### Gürültü mü, kalıcı mı?

- Kalıcı mühendislik değeri yüksek: Spring AI memory scope değişimi, Boot 4.1 / Framework 7 platform standartları, JDK 26 istemci ve JDBC davranış değişimleri.
- İzle ve pilotla: Spring Kafka share consumers, Session API’nin 2.1 hedefli nihai şekli.
- Düşük öncelik / niş: veri gölü ve Parquet ağırlıklı olmayan ekipler için yeni veri araçları.

## Araçlar ve Kütüphaneler

- [Spring Kafka 4.1.0-RC1](https://spring.io/blog/2026/05/06/spring-for-apache-kafka-4-1-0-RC1-4-0-5-and-3-3-15-available-now): Yüksek dikkat, ama kontrollü pilot. Queue/share consumer ve native error handling tarafı anlamlı.
- [Spring AI Session API yönü](https://spring.io/blog/2026/04/15/spring-ai-agentic-patterns-part-7-session-api): Yüksek mimari sinyal. Bugün prod standardı değil, ama stateful agent uygulamaları için önemli yön değişimi.
- [Spring Boot 4.1.0-RC1](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now): Yüksek öncelik. Observability, HTTP client ve security hardening için upgrade laboratuvarı açmak mantıklı.
- [JDK 26 HttpClient / JDBC 4.5](https://jdk.java.net/26/release-notes): Orta-yüksek öncelik. Uygulama kodundan çok entegrasyon ve araç zincirini etkiler.
- [Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/hardwood-1.0.0-beta2/): Düşük öncelik. Parquet, S3 ve veri işleme ağırlıklı JVM ekipleri için ilginç; klasik Spring servisleri için bugün ana gündem değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI tabanlı özellik geliştiriyorsanız, bellek kapsamını ürün kontratı gibi tasarlayın. `conversationId` üretimi, tenant izolasyonu ve memory retention stratejisi açık olmalı.
- Boot 4 / Framework 7 planı yapıyorsanız, yalnız compile fix listesi çıkarmayın. API versiyonlama, retry standardı, SSRF koruması ve observability baseline’ını da aynı workstream’e alın.
- Java 26 denemelerinde, sadece benchmark koşmayın. Özellikle HttpClient timeout davranışı ve bodyless request header semantiğini gerçek upstream’lerle test edin.
- JDBC kullanan servislerde, driver ekosisteminin `JSON`, `DECFLOAT` ve `AutoCloseable` değişimlerine ne kadar hazır olduğunu görün. Bu, özellikle custom driver wrapper veya eski library zincirlerinde beklenmedik yan etki yaratabilir.
- Kafka ekipleri için share consumer tarafı umut verici, ama hemen organizasyon standardı yapılacak kadar olgun değil. Boot 4.1 veya yeni Kafka client denemeleri içinde dar kapsamlı POC daha doğru olur.

## Fırsatlar ve Riskler

- Fırsat: Spring AI’de explicit session tasarımı, çok kullanıcılı ve çok ajanlı sistemlerde veri sızıntısı riskini azaltabilir.
- Fırsat: Boot 4.1 / Framework 7 ile kurum içi ekstra retry, versioning ve SSRF wrapper’larının bir kısmı sadeleşebilir.
- Fırsat: JDK 26’nın HTTP/3 ve JDBC genişlemeleri, uygulama katmanını bozmadan platform yeteneğini artırabilir.
- Fırsat: Kafka share consumer yaklaşımı, kuyruk benzeri iş yüklerinde daha doğal ölçeklenme ve daha temiz hata modeli sağlayabilir.
- Risk: Spring AI migration’ı yüzeysel yapılırsa memory scope hataları çok geç fark edilir.
- Risk: Boot 4.1 ve Framework 7’ye geçişte "eski ortak starter’lar zaten aynı işi yapıyor" varsayımı teknik borcu büyütebilir.
- Risk: JDK 26 HttpClient değişimleri sessiz entegrasyon farkı üretir; özellikle timeout ve header semantiği loglarda açık görünmeyebilir.
- Risk: JDBC 4.5 değişimleri framework kodundan çok driver ve araç zincirinde kırılma yaratabilir.
- Risk: Kafka share consumers preview/RC çizgisindeyken geniş rollout yapılması geri alma maliyetini yükseltir.

## İzlenmesi Gereken Konular

- [Spring AI Session API](https://spring.io/blog/2026/04/15/spring-ai-agentic-patterns-part-7-session-api) tarafının hedefi Kasım 2026 civarında Spring AI 2.1; `ChatMemory` deprecation çizgisinin ne kadar sertleşeceği izlenmeli.
- [Spring Boot 4.1 release treni](https://spring.io/blog/2026/05/11/may-train-shift) artık 1-5 Haziran 2026 penceresine kaymış durumda; pilot ve upgrade backlog’ları buna göre güncellenmeli.
- [InfoQ röportajında](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) vurgulanan Boot 3.5 OSS bakım sınırı Haziran 2026 içinde netleşecek; bu tarih birçok kurum için karar tetikleyicisi olabilir.
- Spring Kafka share consumer çizgisinin GA sürümde ne kadar stabil kalacağı ve Spring Boot otomatik konfigürasyonuna nasıl oturacağı yakından izlenmeli.
- Baeldung ve topluluk blogları bugün doğrudan prod kararını değiştiren büyük bir sinyal vermedi; yine de Spring AI, Boot 4 ve testing ergonomisi etrafındaki tutorial akışı önümüzdeki haftalarda adoption hızını artırabilir.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring AI bellek modeli implicit yapıdan explicit session tasarımına kayıyor
- source: [Spring AI 1.0.7 / 1.1.6 / 2.0.0-M6 Available Now](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now), [Spring AI Upgrade Notes](https://docs.spring.io/spring-ai/reference/2.0-SNAPSHOT/upgrade-notes.html), [Spring AI Agentic Patterns Part 7: Session API](https://spring.io/blog/2026/04/15/spring-ai-agentic-patterns-part-7-session-api)
- author: Christian Tzolov, Ilayaperumal Gopinathan
- date: 15 Nisan 2026 ve 8 Mayıs 2026
- category: ai-migration, state-management, architecture
- tags: spring-ai, session-api, chat-memory, conversation-id, multitenancy, migration
- summary: Spring AI tarafında default conversation memory modeli kaldırılıyor; session tabanlı, event-sourced ve compaction destekli state yönetimi yönü güçleniyor.
- why_it_matters: Üretimde agent veya sohbet tabanlı sistemlerde veri sızıntısı ve yanlış bağlam eşlemesi riski doğrudan memory scope kararına bağlı.
- java_spring_relevance: Spring AI kullanan veya yakın vadede LLM destekli Spring servisleri çıkaracak ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Daha güvenli tenant izolasyonu, daha izlenebilir agent state modeli ve daha kontrollü session lifecycle.
- risks: Eski implicit memory davranışına güvenen kod tabanlarında upgrade sonrası sessiz davranış farkı ve kullanıcılar arası context karışması.
- migration_notes: `PromptChatMemoryAdvisor` bağımlılıklarını ve default conversation varsayımlarını temizleyin; request başına explicit `conversationId` ve session scope kurgulayın.

### Bulgu 2

- title: Spring Framework 7 ve Boot 4.1, API yönetişimi ile resilience konularını platform standardına çekiyor
- source: [Spring Boot 4.1.0-RC1 Available Now](https://spring.io/blog/2026/04/23/spring-boot-4-1-0-RC1-available-now), [InfoQ: Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Burak KUTBAY - API Versiyonlama ve Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/)
- author: Andy Wilkinson, DaShaun Carter, Dan Vega, Burak KUTBAY
- date: 23 Nisan 2026, 13 Nisan 2026 ve ilgili pratik içerik
- category: platform, migration, api-governance, resilience
- tags: spring-boot-4.1, spring-framework-7, api-versioning, retry, concurrency-throttling, ssrf, observability
- summary: Boot 4.1 RC1 ve Spring 7 yönü; API versioning, retry, concurrency throttling, SSRF azaltma ve observability iyileştirmelerini yan konular olmaktan çıkarıp çekirdeğe yaklaştırıyor.
- why_it_matters: Platform ekiplerinin yıllardır starter, filter ve wrapper ile çözdüğü ortak problemler artık framework tarafından daha standart çözülebilir.
- java_spring_relevance: Enterprise REST ve microservice yüzeyi yöneten Spring Boot ekipleri için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Kurum içi altyapı katmanını sadeleştirmek, API versioning disiplinini standartlaştırmak ve güvenlik/observability baseline’ını güçlendirmek.
- risks: Mevcut ortak starter’lar ve custom retry/versioning çözümleriyle çakışma; yükseltme işinin yalnız compile fix zannedilmesi.
- migration_notes: Boot 4.1 laboratuvarında API versioning stratejisini, mevcut retry/policy katmanlarını ve SSRF kontrol noktalarını birlikte gözden geçirin.

### Bulgu 3

- title: Java 26 HttpClient değişimleri, istemci timeout ve protokol davranışını etkiliyor
- source: [Inside Java - HTTP Client Updates in JDK 26](https://inside.java/2026/03/04/jdk-26-http-client/), [JDK 26 Release Notes](https://jdk.java.net/26/release-notes)
- author: Daniel Fuchs
- date: 4 Mart 2026
- category: runtime, networking, compatibility
- tags: jdk26, httpclient, http3, timeout, sslparameters, content-length
- summary: JDK 26 ile HTTP/3 desteği geliyor; timeout davranışı response body tüketimini de kapsıyor; `SSLParameters` uygulaması ve bodyless request header davranışı değişiyor.
- why_it_matters: Bu tür farklar benchmark’ta değil, gerçek upstream ve edge proxy davranışında ortaya çıkar; sessiz entegrasyon farkı yaratabilir.
- java_spring_relevance: `RestClient`, `WebClient`, custom SDK veya JDK HttpClient tabanlı iletişim kullanan Java/Spring ekipleri için yüksek.
- actionability: izle_ve_test_et
- impact_level: orta-yüksek
- opportunities: HTTP/3 denemeleri ve daha net istemci semantiği ile latency/transport tarafında iyileşme şansı.
- risks: Timeout, SSL ve header davranışlarının beklenmedik şekilde değişmesi; özellikle eski upstream’lerde veya proxy arkasında sorun.
- migration_notes: Java 26 pilotunda gerçek staging trafiğiyle timeout, TLS ve bodyless POST/DELETE entegrasyonlarını yeniden test edin.

### Bulgu 4

- title: JDBC 4.5 ile JSON ve kaynak yaşam döngüsü standardı genişliyor
- source: [JDK 26 Release Notes](https://jdk.java.net/26/release-notes)
- author: belirtilmemiş
- date: 2026 JDK 26 release notes
- category: data-access, compatibility, standards
- tags: jdbc4.5, json, decfloat, autocloseable, drivers, spring-jdbc
- summary: JDBC 4.5 `JSON` ve `DECFLOAT` tiplerini resmileştiriyor; bazı JDBC kaynak tipleri `AutoCloseable` oluyor ve varsayılan implementasyonlar genişliyor.
- why_it_matters: DB sürücüleri, veri erişim araçları ve framework wrapper’ları için uyumluluk alanı açılıyor; standart JSON desteği orta vadede daha temiz kod üretebilir.
- java_spring_relevance: Spring JDBC, Spring Data JDBC, jOOQ veya custom JDBC katmanı kullanan ekipler için orta-yüksek.
- actionability: planlı_aksiyon
- impact_level: orta
- opportunities: JSON kolonları ve kaynak yönetimi için daha tutarlı driver davranışı; eski yardımcı katmanları sadeleştirme şansı.
- risks: Özellikle eski veya özel driver’larda uyumluluk kusuru; framework katmanında değil altyapı tarafında beklenmedik kırılma.
- migration_notes: Driver üreticisi notlarını ve integration testlerini izleyin; `AutoCloseable` semantiğinin mevcut wrapper’larla etkileşimini kontrol edin.

### Bulgu 5

- title: Spring Kafka 4.1 RC1, queue-semantics ve hata işleme modelini broker-native yöne itiyor
- source: [Spring for Apache Kafka 4.1.0-RC1, 4.0.5 and 3.3.15 Available Now](https://spring.io/blog/2026/05/06/spring-for-apache-kafka-4-1-0-RC1-4-0-5-and-3-3-15-available-now), [Spring Kafka Queue Support Reference](https://docs.spring.io/spring-kafka/reference/kafka/kafka-queues.html)
- author: Gary Russell
- date: 6 Mayıs 2026
- category: messaging, streaming, operations
- tags: spring-kafka, share-consumers, queue, native-dlq, kip-1034, kafka-streams
- summary: Share consumer preview; `ACCEPT`/`RELEASE`/`REJECT` ack modeli, async commit ve native DLQ yönü ile Spring Kafka, kuyruk benzeri iş yüklerinde broker-native davranışa yaklaşıyor.
- why_it_matters: Pek çok kurum Kafka’yı yalnız log değil iş kuyruğu gibi de kullanıyor; bu yüzden teslimat ve poison-record davranışının daha net olması önem taşıyor.
- java_spring_relevance: Event-driven Spring Boot servisleri ve Kafka Streams kullanan ekipler için yüksek.
- actionability: izle_ve_pilotla
- impact_level: orta-yüksek
- opportunities: Daha temiz queue semantiği, daha kontrollü poison record davranışı ve bazı custom retry/DLQ katmanlarını sadeleştirme.
- risks: Özelliklerin RC/preview çizgisinde olması; davranış ve API yüzeyinin hâlâ değişebilmesi.
- migration_notes: Geniş rollout yerine izole consumer gruplarında POC yapın; mevcut DLQ, backoff ve poison record akışlarıyla karşılaştırın.

### Bulgu 6

- title: Hardwood Beta2, JVM veri araçlarında pratik ama niş bir sinyal veriyor
- source: [Hardwood 1.0.0.Beta2 Is Out](https://www.morling.dev/blog/hardwood-1.0.0-beta2/)
- author: Gunnar Morling
- date: 29 Nisan 2026
- category: tooling, data-engineering
- tags: parquet, s3, variant, cli, data-tooling, jvm
- summary: Hardwood Beta2; VARIANT desteği, etkileşimli TUI ve daha verimli S3/Parquet taramasıyla JVM tarafında veri inceleme araçlarının geliştiğini gösteriyor.
- why_it_matters: Klasik Spring servisleri için ana konu değil; ama veri gölü, batch ve analitik çevresinde çalışan JVM ekipleri için faydalı olabilir.
- java_spring_relevance: Düşük-orta. Yalnız Parquet/S3 ağırlıklı veri işleyen Spring veya Java ekiplerinde anlamlı.
- actionability: bilgilendirici
- impact_level: düşük
- opportunities: Veri inceleme ve debug akışlarında JVM tabanlı hafif araç kullanımını artırmak.
- risks: Genel Spring backend ekipleri için dikkat dağıtıcı olabilir; platform standardı gibi ele alınmamalı.
- migration_notes: Yalnız veri odaklı ekiplerde sınırlı deneme değerli; genel kurumsal Java gündemine taşımak için erken.

## Sonuç

22 Mayıs 2026 taramasında bugünün en güçlü mesajı şu: Java ve Spring ekosistemi artık sadece yeni sürüm yayımlamıyor; state yönetimi, API yönetişimi, protokol davranışı ve queue semantiği gibi eskiden "uygulama detayı" sayılan alanları çekirdeğe alıyor.

Kısa vadede en doğru aksiyon seti üç parçalı görünüyor: Spring AI kullanan ekipler memory scope migration’ını ciddiye almalı; Boot 4.1 / Framework 7 planı yapanlar API versioning ve resilience standardını erken tanımlamalı; Java 26 denemeleri yapanlar ise HttpClient ve JDBC davranış testlerini normal regression kapsamına çekmeli. Kafka share consumer çizgisi ise umut verici, ama bugün için geniş rollout değil dikkatli pilot konusu.
