# Günlük Java / Spring Ekosistem Raporu

Tarih: `15 Nisan 2026, 09:05 TRT`

Kapsam: `14 Nisan 2026 09:01 TRT` ile `15 Nisan 2026 09:05 TRT` arasındaki günlük tarama.

Tekrar azaltma notu: Önceki raporlarda ayrıntılı işlendiği için `Spring Cloud Gateway CVE-2026-22750`, `Spring Security 7 MFA`, `Spring I/O 2026 program özeti`, `JDK 27 locale heads-up` ve genel `Boot 4 / Oakwood` anlatısı bugün tekrar ana bulgu yapılmadı.

Kaynak tarama notu: [Spring Blog](https://spring.io/blog/), [Spring Releases](https://spring.io/blog/category/releases/), [Spring proje sayfaları](https://spring.io/projects), [Spring Security advisory sayfaları](https://spring.io/security), [Spring Framework REST client dokümantasyonu](https://docs.spring.io/spring-framework/reference/web/webmvc-client.html), [Spring Boot REST client dokümantasyonu](https://docs.spring.io/spring-boot/4.0-SNAPSHOT/reference/io/rest-client.html), [OpenJDK](https://openjdk.org/projects/), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’un haftalık özeti](https://spring.io/blog/2026/04/14/this-week-in-spring-april-14-2026/), [Gunnar Morling](https://www.morling.dev/), ilgili GitHub release sayfaları ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandı. Bugünkü taramada yeni birinci seviye `Spring Boot` / `Spring Framework` / `Spring Cloud` GA duyurusu ya da yeni bir güvenlik advisory’si bulunmadı. Baeldung’in `i18n` yazısı ve Maven TUI bağlantısı tarandı, ancak bugünün mimari karar kalitesini anlamlı şekilde değiştirecek kadar güçlü sinyal üretmedi. Burak KUTBAY blog ana sayfasında görünen en güncel arşiv `Haziran 2025`; bugün yeni 2026 içeriği görünmedi.

## Öne Çıkan Başlıklar

- `RestTemplate`, artık açık biçimde legacy yola itiliyor. Güncel Spring referansı `RestTemplate`i `RestClient` lehine deprecated olarak çerçeveliyor; InfoQ ise bunun `Spring Framework 7.1 -> 8` yolunda daha da sertleşeceğini aktarıyor.
- `Spring Cloud Data Flow`, `Spring Cloud Deployer` ve `Spring Statemachine` için açık kaynak çizgi kapanmış durumda. Bu yeni bir duyuru değil; ama resmi proje sayfaları bunu hâlâ en üstte gösterdiği için 2026 yol haritasında hâlâ etkili bir sınır.
- Büyük `Spring Boot` kod tabanlarında konfigürasyon yönetimi bağımsız bir platform mühendisliği konusu haline geliyor. Apereo CAS örneği, `@ConfigurationProperties` kullanımını gerçek ölçekli bir disipline dönüştüren net pratikler sunuyor.
- Yeni kritik framework release’i yok; bugünün değeri daha çok portföy sınırlarının, client API yönünün ve operasyonel disiplinin netleşmesinde.

## Kritik Güncellemeler

1. Bugünkü taramada yeni bir `Spring Boot`, `Spring Framework`, `Spring Cloud`, `Spring AI` veya `JDK` güvenlik bülteni öne çıkmadı.

2. Buna rağmen iki yüksek etkili karar sinyali var:

- Yeni synchronous HTTP istemci kodu için `RestTemplate` artık doğru varsayılan değil.
- `SCDF/Deployer/Statemachine` yatırımı, artık “aktif OSS yol haritası” varsayımıyla yapılamaz.

3. Düşük öncelikli ama pratik bir operasyon notu da var: container içinde çalışan JVM servislerinde `-Xmx` tek başına bellek stratejisi değildir; non-heap tüketim yeniden gündeme alınmalı.

## Trendler ve Sinyaller

1. Spring ekosistemi düşük katkı alan portföy parçalarını daraltırken yüksek kullanım alanlarında API yüzeyini sadeleştiriyor. `RestTemplate -> RestClient` yönü ve `SCDF` tarafındaki portföy daralması aynı resmi tamamlıyor: daha az tarihsel yük, daha net yatırım alanı.

2. Typed ve deklaratif istemci modeli kalıcı değer üretiyor. `RestClient`, `HTTP Service Client`, `ApiVersionInserter` ve ortak `RestClient` paylaşımı; servisler arası iletişimi `ad-hoc` helper sınıflardan çıkarıp framework yüzeyine taşıyor.

3. Konfigürasyon artık yalnızca `application.yml` büyüdü problemi değil. Çok modüllü ve çok tenant’lı Boot platformlarında metadata, rename/deprecation yönetimi, IDE keşfedilebilirliği ve runtime binding davranışı platform kalitesinin parçası haline geliyor.

4. Gürültü ve kalıcı değer ayrımı bugün daha net:

- Kalıcı değer: `RestClient` göçü, `SCDF` portföy sınırı, config metadata disiplini.
- Düşük öncelik: Maven TUI, genel amaçlı eğitim videoları ve tekrar eden mikroservis giriş içerikleri.

## Araçlar ve Kütüphaneler

- `RestClient` ve `HTTP Service Client`: Yeni outbound HTTP kodu için ana yön burası. Özellikle `Boot 4 / Framework 7` planlayan ekiplerde teknik borç biriktirmeden ilerlemek için önemli.
- `Spring Cloud Stream 5.0.1`: Çekirdek event-driven framework hattı canlı ve aktif.
- `Spring Cloud Stream Applications 2025.0.1`: Hazır uygulama kataloğu tarafında stabil hat hâlâ `Spring Boot 3.4.10 / Spring Cloud Stream 4.2.2`. Bu bir çıkarımdır: hazır starter-app kataloğu bugün itibarıyla `Boot 4` modernizasyonunu önden taşımıyor.
- Düşük öncelik: [Java Memory Options You Need in Production](https://bell-sw.com/videos/java-memory-options-you-need-in-production/) videosu framework haberi değil; ama Kubernetes/container içinde çalışan Java servisleri için iyi bir operasyonel refresher.

## Java / Spring Geliştiricileri İçin Etkiler

- `RestTemplate` kullanan mevcut kodu bugün söküp atmak gerekmez; ama yeni synchronous istemci geliştirmesini hâlâ `RestTemplateBuilder` üstüne kurmak teknik olarak savunması zayıf bir karar haline geliyor.
- `SCDF` kullanan ekipler için konu “bugün bozuldu mu?” değil, “önümüzdeki 12-18 ayda bu platformu hangi destek modeliyle yaşayacağız?” sorusu.
- Çok sayıda `@ConfigurationProperties` kullanan kurumsal Boot uygulamalarında config şeması artık dokümantasyon görevi değil; migration, support ve self-service DX görevi.
- Event-driven veya batch platform kuran ekipler için app-side framework (`Stream`, `Task`) ile orchestration ürünü (`SCDF`) arasındaki fark artık daha dikkatli çizilmeli.

## Fırsatlar ve Riskler

Fırsatlar:

- `RestClient` ve `HTTP Service Clients` ile outbound HTTP katmanını standartlaştırmak.
- `additional-spring-configuration-metadata.json` ve net namespace tasarımı ile config keşfedilebilirliğini artırmak.
- `SCDF` bağımlı platformlarda ürün mü, platform-native orchestrator mu, sade `Stream/Task + Kubernetes` mi kararını açıklaştırmak.
- JVM bellek politikasını heap dışı tüketimle birlikte ele alıp OOM teşhisini iyileştirmek.

Riskler:

- Yeni entegrasyon kodunu hâlâ `RestTemplate` ile yazıp kısa süre sonra ikinci bir göç işi çıkarmak.
- `SCDF` ve ilişkili ekosistemi aktif OSS geleceği varmış gibi planlamak.
- Yüzlerce property içeren Boot kod tabanlarında metadata, rename ve deprecation eşlemeleri olmadan büyümek.
- Container limitlerini yalnızca `-Xmx` üzerinden yönetip direct buffer, metaspace, thread stack ve code cache tüketimini görmezden gelmek.

## İzlenmesi Gereken Konular

- `Spring Framework 7.1` dokümanlarında `RestTemplate` anlatısı daha sert bir deprecation/migration çizgisine evriliyor mu?
- `Spring I/O 2026` sonrası `HTTP Service Clients`, `Boot 4 restructuring`, `gRPC`, `Spring Cloud Contract 5` ve `durable agents` oturumlarının slayt/video/örnek repo çıktıları.
- `Spring Cloud Stream Applications` tarafında `Boot 4` tabanlı stabil katalog ne zaman ortaya çıkacak?
- `SCDF` enterprise-only release hattının `Boot 3.5` ve sonrası için nasıl şekilleneceği.
- `Gunnar Morling` ve `Burak KUTBAY` tarafında bu başlıklara temas eden yeni yazılar gelip gelmeyeceği.

## Kaynak Bazlı Bulgular

### 1. `RestTemplate`ten `RestClient`e geçiş artık ertelenmemeli

- **title:** `RestTemplate` artık resmi olarak ikinci planda; yeni sync HTTP yatırımı `RestClient`e kayıyor
- **source:** [Spring Framework REST Clients reference](https://docs.spring.io/spring-framework/reference/7.0-SNAPSHOT/integration/rest-clients.html), [Spring Boot Calling REST Services](https://docs.spring.io/spring-boot/4.0-SNAPSHOT/reference/io/rest-client.html), [InfoQ: Spring Framework 7 and Spring Boot 4 Deliver API Versioning, Resilience, and Null-Safe Annotations](https://www.infoq.com/news/2025/11/spring-7-spring-boot-4/)
- **author:** `Spring Team`, `Karsten Silz`
- **date:** `Güncel referans dokümantasyon, 15 Nisan 2026 erişim`
- **category:** `migration-path`
- **tags:** `restclient`, `resttemplate`, `http-service-client`, `spring-framework-7`, `spring-boot-4`, `outbound-http`
- **summary:** Spring Framework referansı artık `RestTemplate`i `RestClient` lehine deprecated bir yol olarak konumluyor. `HTTP Service Client` desteği de typed/deklaratif istemci modelini güçlendiriyor. InfoQ yazısı, bu yönün `Framework 7.1` ve daha sonrası için daha da belirginleşeceğini aktarıyor.
- **why_it_matters:** Java ekipleri outbound HTTP katmanını uzun ömürlü kullanır. Yanlış default seçimi, observability, auth, retry, versioning ve client standardizasyonunda ikinci bir göç işine dönüşür.
- **java_spring_relevance:** `RestTemplate`, `RestClient`, `WebClient`, interface-based HTTP client’lar ve service-to-service çağrılar Spring uygulamalarının merkezinde.
- **actionability:** `near-term-migration`
- **impact_level:** `medium-high`
- **opportunities:** Ortak `RestClient` factory standardı kurmak; `HttpServiceProxyFactory` ile typed istemcileri tek modelde toplamak; yeni client geliştirmelerini tek yola indirmek.
- **risks:** Mevcut kodun bir kısmını `RestTemplate`, bir kısmını `RestClient` ile büyütmek; farklı error handling ve metric desenleri üretmek; migration’ı çok geçe bırakmak.
- **migration_notes:** Yeni synchronous HTTP kodu için `RestTemplate` kullanımını dondurun. Mevcut bean ve helper envanterini çıkarın. Basit JSON client’ları önce `RestClient`e taşıyın. Typed client ihtiyacı olan alanlarda `HTTP Service Client` değerlendirin. `RestTemplate` kullanımını yalnızca kısa vadeli bakım modunda bırakın.

### 2. `Spring Cloud Data Flow` ve ilişkili orchestration hattı artık aktif OSS yatırım alanı değil

- **title:** `SCDF/Deployer/Statemachine` için açık kaynak yol kapandı; event/batch platform kararı netleşmeli
- **source:** [Spring Cloud Data Flow project page](https://spring.io/projects/spring-cloud-dataflow/), [Spring Cloud Data Flow End of Open-Source](https://spring.io/blog/2025/04/21/spring-cloud-data-flow-commercial/), [Spring Cloud Stream Applications project page](https://spring.io/projects/spring-cloud-stream-applications/), [spring-cloud/stream-applications releases](https://github.com/spring-cloud/stream-applications/releases)
- **author:** `Spring Team`, `Michael Minella`
- **date:** `21 Nisan 2025 duyurusu + 15 Nisan 2026 güncel proje sayfaları`
- **category:** `portfolio-shift`
- **tags:** `spring-cloud-data-flow`, `spring-cloud-deployer`, `spring-statemachine`, `spring-cloud-stream`, `batch`, `event-driven`, `platform`
- **summary:** Resmi Spring bloguna göre `Spring Cloud Data Flow 2.11.x`, `Spring Cloud Deployer 2.9.x` ve `Spring Statemachine 4.0.x` son açık kaynak hatlar. Güncel `SCDF` proje sayfası bunu hâlâ açıkça gösteriyor. Aynı anda `Spring Cloud Stream` çekirdeği `5.0.1` seviyesinde aktifken, `Spring Cloud Stream Applications` stabil hazır uygulama kataloğu hâlâ `Boot 3.4.10 / Stream 4.2.2` hattında.
- **why_it_matters:** Event-driven ve batch platform yatırımları sadece uygulama kodundan ibaret değil; orchestration, starter katalog, dashboard, DSL ve upgrade modeli de kritik. Burada destek ve gelecek yol haritası değişmiş durumda.
- **java_spring_relevance:** `Spring Cloud Stream`, `Spring Cloud Task`, `SCDF`, batch orkestrasyonu, veri pipeline’ları ve event-driven platform kuran Spring ekipleri doğrudan etkilenir.
- **actionability:** `roadmap-planning`
- **impact_level:** `high`
- **opportunities:** App-side messaging modelini `Stream/Task` tarafında koruyup orchestration katmanını yeniden değerlendirmek; ürünleşmiş destek modeli ile platform-native çözüm arasında daha bilinçli seçim yapmak.
- **risks:** `SCDF` yatırımlarını aktif OSS inovasyon hattı varmış gibi planlamak; hazır starter-app kataloğunun `Boot 4` ile eşzamanlı olacağını varsaymak; sürüm ve destek boşluklarını geç fark etmek.
- **migration_notes:** `SCDF` kullanıyorsanız destek ufkunu, yükseltme politikanızı ve ticari/kurumsal seçenekleri netleştirin. Yalnızca app-side event akışına ihtiyacınız varsa `Spring Cloud Stream` ve platform-native deploy yaklaşımını ayrı değerlendirin. Hazır stream-app katalogları için `Boot 4` varsayımı yapmadan önce gerçekten kullanılan sürüm hattını doğrulayın.

### 3. Büyük `Spring Boot` kod tabanlarında konfigürasyon tasarımı ayrı bir mühendislik alanı haline geliyor

- **title:** `@ConfigurationProperties` ölçeği yönetilmezse migration ve support maliyeti hızla büyüyor
- **source:** [Spring Boot Configuration Properties at Scale](https://medium.com/all-things-software/spring-boot-configuration-properties-at-scale-884f494721ac), [Spring Boot Configuration Metadata](https://docs.spring.io/spring-boot/docs/2.3.x/reference/html/appendix-configuration-metadata.html)
- **author:** `Dmitriy Kopylenko`
- **date:** `Nisan 2026`
- **category:** `platform-engineering`
- **tags:** `configurationproperties`, `binder`, `metadata`, `deprecation`, `spring-boot`, `platform-engineering`, `developer-experience`
- **summary:** Apereo CAS örneği, `Spring Boot` üstünde `1000+` property ve yüzlerce sınıfı tek kök namespace, yoğun `@NestedConfigurationProperty`, doğrudan `Binder` API kullanımı ve `additional-spring-configuration-metadata.json` içindeki rename/deprecation eşlemeleri ile yönetiyor.
- **why_it_matters:** Çoğu kurumsal Boot kod tabanı sessiz config borcu biriktirir. Property keşfi zorlaşır, yanlış isimler sessizce kaçar, rename işlemleri migration kırığına dönüşür ve support ekipleri hangi ayarın hangi modüle ait olduğunu izleyemez.
- **java_spring_relevance:** Çok modüllü servis platformları, starter setleri, tenant bazlı config, feature flag ve dış kaynaklı runtime binding kullanan Spring ekipleri için doğrudan ilgili.
- **actionability:** `near-term-adopt`
- **impact_level:** `medium`
- **opportunities:** IDE autocomplete ve keşfedilebilirliği artırmak; startup sırasında rename/deprecation uyarıları üretmek; config dokümantasyonunu koddan üretmek; runtime map binding’i güvenli hale getirmek.
- **risks:** Küçük servislerde aşırı mühendislik; metadata üretilmeyen custom annotation’lar; config şemasını koddan koparan el yapımı wiki yaklaşımı.
- **migration_notes:** Küçük servislerde tüm deseni kopyalamayın. Önce en problemli namespace için tek kök `@ConfigurationProperties` sınıfı tanımlayın. Composite alanlarda `@NestedConfigurationProperty` kullanın. `additional-spring-configuration-metadata.json` ile rename/deprecation eşlemelerini üretin. Runtime map/tablo/REST payload binding ihtiyacı varsa `Binder` API’yi kontrollü şekilde kullanın.

### 4. Düşük öncelik ama üretim açısından yararlı sinyal: JVM bellek ayarlarını heap ile sınırlamayın

- **title:** Düşük öncelik: container içindeki Java servislerinde `-Xmx` tek başına bellek stratejisi değildir
- **source:** [Java Memory Options You Need in Production](https://bell-sw.com/videos/java-memory-options-you-need-in-production/), [BellSoft Content Library](https://bell-sw.com/content-library/?tags=frameworks)
- **author:** `Catherine Edelveis`
- **date:** `2 Nisan 2026`
- **category:** `operability-refresh`
- **tags:** `jvm-memory`, `containers`, `kubernetes`, `maxrampercentage`, `direct-memory`, `oom`, `gc-logging`, `spring-boot`
- **summary:** İçerik, heap dışı RAM tüketimini açıkça hatırlatıyor: metaspace, thread stack, code cache, direct buffer ve native allocation’lar yüzünden süreç `heap fine` görünürken yine OOM olabilir. Özellikle container ortamında `MaxRAMPercentage`, direct memory limiti, GC logları ve OOM teşhisi öne çıkarılıyor.
- **why_it_matters:** Spring Boot servisleri sıklıkla Kubernetes limitleri altında çalışıyor. Tomcat/Netty, JDBC driver’ları, NIO tabanlı istemciler ve observability ajanları non-heap tüketimi büyütebilir.
- **java_spring_relevance:** `Spring Boot` API’leri, gateway’ler, messaging client’ları, WebFlux/Netty servisleri ve yüksek concurrency’li JVM süreçleri için doğrudan operasyonel değer taşıyor.
- **actionability:** `immediate-check`
- **impact_level:** `low-medium`
- **opportunities:** Daha gerçekçi container limitleri tanımlamak; OOM sonrası teşhisi hızlandırmak; heap dışı tüketimi ölçüp beklenmeyen restart’ları azaltmak.
- **risks:** Rastgele JVM flag eklemek; collector değişimini log ve metrik olmadan denemek; memory tuning’i “Xmx büyüt” refleksine indirgemek.
- **migration_notes:** En azından `-Xlog:gc*`, `-XX:+HeapDumpOnOutOfMemoryError` ve tutarlı heap dump yolu gibi temel tanı ayarlarını standartlaştırın. Container kullanan servislerde `MaxRAMPercentage` ve direct memory tüketimini gözden geçirin. Netty/NIO ağırlıklı uygulamalarda non-heap tüketimini ayrıca izleyin.

## Sonuç

Bugün yeni bir release yağmuru yok; ama bu, karar değeri olmadığı anlamına gelmiyor. En güçlü sinyal, Spring ekosisteminin nerede yatırım yoğunlaştırdığı ve nerede tarihsel yükü azaltmaya başladığı.

Senior Java / Spring ekipleri için bugünün üç net çıktısı var: yeni sync HTTP istemci geliştirmesini `RestClient`e yönlendirmek, `SCDF` ve ilişkili orchestration ürünleri için destek/gelecek planını açıklaştırmak, büyük `Boot` kod tabanlarında config metadata ve rename disiplinini başlatmak. Bunlar hype değil; doğrudan bakım maliyeti, migration doğruluğu ve platform sürdürülebilirliğiyle ilgili.
