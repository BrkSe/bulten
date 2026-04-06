# Günlük Java / Spring Ekosistem Raporu

Tarih: 6 Nisan 2026

Kapsam: `5 Nisan 2026 09:00 TRT` ile `6 Nisan 2026 09:00 TRT` arasındaki günlük tarama. Önceki raporlarda ayrıntılı işlendiği için `Spring Security / Cloud Config` patch dalgası, `Boot 4.1` preview oynaklığı ve `JDK 26` genel operability anlatısı bu raporda tekrar merkez yapılmadı.

Not: `Spring Blog`, `Spring` proje/release sayfaları, `OpenJDK`, `Oracle Java Blog`, `Inside Java`, `InfoQ Java`, `Baeldung`, `Josh Long`, `Gunnar Morling`, ilgili `GitHub` release sayfaları ve `Burak KUTBAY` kaynakları tarandı. Bugün ana sıralamayı belirleyen yeni sinyal resmi Spring engineering/release içerikleri ile altyapı katmanı bakım duyurularından geldi; `Baeldung`, `Josh Long`, `Gunnar Morling` ve `Burak KUTBAY` tarafında bugün raporun öncelik sırasını değiştirecek yeni yüksek etkili yayın çıkmadı.

## Öne Çıkan Başlıklar

- En güçlü yeni Spring sinyali `Spring Data` cephesinden geldi. `2026.0.0-M2`, veri erişiminde string tabanlı kırılganlığı azaltan type-safe property path yaklaşımını release hattına taşıyor.
- `Spring Framework` tarafında değer yalnızca yeni feature eklemekten değil, sabit framework maliyetini düşürmekten geliyor. `Spring MVC` benchmark çalışması bunu net şekilde gösterdi.
- Altyapı bakım katmanı bu hafta sessiz ama pahalı hataları hedef aldı: `Tomcat 11.0.21` özellikle `NIO + TLS` response flush davranışında üretim etkili bir düzeltme içeriyor, `Log4j 2.25.4` ise log layout ve konfigürasyon tutarlılığı tarafını toparlıyor.
- Java agent/AI ekosisteminde yeni önemli dış sinyal `ADK for Java 1.0.0`. Buradaki asıl değer yeni demo araçları değil; `A2A`, memory/session servisleri ve human-in-the-loop gibi operasyonel yapı taşlarının standartlaşması.
- `Gradle 9.5.0-RC1` ve `JDK 27 EA16` sinyalleri geldi; bunlar uygulama ekipleri için hemen aksiyon konusu değil, ancak platform ve build ekipleri için izleme listesine girmeli.

## Kritik Güncellemeler

- [Spring Data 2026.0.0-M2, 2025.1.8 ve 2025.0.12 duyurusu](https://spring.io/blog/2026/03/13/spring-data-2026-0-0-M2-2025-1-8-and-2025-0-12-released), type-safe property reference yönünü release train seviyesinde güçlendirdi. Aynı duyuru Redis ve Mongo tarafında da somut yenilikler taşıyor.
- [Mark Paluch’ın “Moving beyond Strings in Spring Data” yazısı](https://spring.io/blog/2026/02/27/moving-beyond-strings-in-spring-data/) artık sadece fikir yazısı değil; release train ile birlikte gerçek migration backlog girdisi haline geldi.
- [Dave Syer’ın “Optimizations in Spring MVC” analizi](https://spring.io/blog/2026/02/25/optimizations-in-spring-mvc-spring-fruits-benchmark), `Spring Framework 7.0.5/7.0.6` optimizasyonları ve virtual thread etkinleştirmenin küçük veri setlerinde throughput’u ciddi biçimde iyileştirebildiğini gösteriyor.
- [Apache Tomcat 11.0.21 changelog](https://tomcat.apache.org/tomcat-11.0-doc/changelog.html), response’un bağlantı kapanana kadar tam yazılamamasına yol açabilen `NIO + TLS` non-blocking flush hatasını düzeltiyor.
- `Apache Log4j 2.25.4`, `RFC5424Layout`, `XMLLayout` ve bazı konfigürasyon tutarsızlıklarını düzelterek log pipeline güvenilirliğini artırıyor. Bu başlık [InfoQ’nun 6 Nisan 2026 Java roundup’ında](https://www.infoq.com/development/news/77/) da öne çıkarılmış durumda.
- [Google’ın ADK for Java 1.0.0 duyurusu](https://developers.googleblog.com/announcing-adk-for-java-100-building-the-future-of-ai-agents-in-java/) Java tarafında agent mimarisinin “protokol, hafıza, onay akışı” eksenine kaydığını doğruluyor.

## Trendler ve Sinyaller

### 1. Spring veri erişiminde “stringly-typed” tasarım borcunu azaltmaya başladı

`Spring Data` tarafındaki type-safe property path yaklaşımı, repository ve query kodunda yıllardır tolere edilen sessiz kırılma tipini hedefliyor. Bu yalnızca estetik bir API iyileştirmesi değil; refactor güvenliği, IDE desteği ve büyük kod tabanlarında bakım maliyeti açısından gerçek etki üretiyor.

### 2. Framework mühendisliği yine performans konuşuyor, ama bu kez daha gerçekçi

`Spring MVC` benchmark yazısının değeri “Spring çok hızlı oldu” demesinde değil. Asıl değer, küçük veri setlerinde sabit framework maliyetinin hâlâ optimize edilebilir olduğunu; büyük veri setlerinde ise iş mantığının baskın maliyet olmaya devam ettiğini açıkça göstermesi. Bu, benchmark sonuçlarını daha doğru okuma çağrısı.

### 3. Üretim riski artık sadece framework feature katmanında değil, altyapı tesisatında da

`Tomcat` ve `Log4j` güncellemeleri, en pahalı hataların çoğu zaman business logic değil taşıyıcı katmanlarda ortaya çıktığını hatırlatıyor. Kısmi response yazımı, bozuk log formatı veya HTTP/2 kenar durumları, uygulama kodundan bağımsız olarak müşteri etkisi yaratabiliyor.

### 4. Java AI araçlarında kalıcı değer, framework içi rahatlık değil protokol uyumluluğu

`ADK for Java 1.0.0` ile gelen `A2A`, memory/session servisleri, plugin mimarisi ve `HITL` desteği; Java agent dünyasında “chat demo” döneminden “entegrasyon sözleşmesi ve operasyon modeli” dönemine geçildiğini gösteriyor. Spring ekipleri için doğru sonuç, tek bir framework’e kapanmak değil; sınırları açık protokollerle çizmek.

## Araçlar ve Kütüphaneler

- `Spring Data 2026.0.0-M2`: Type-safe property paths, annotation tabanlı Redis keyspace notification desteği, `Redis 8.4` için koşullu `SET/DEL` ve gözden geçirilmiş `MongoDB` bulk API ile dikkat çekiyor.
- `Apache Tomcat 11.0.21`: `NIO + TLS` flush davranışı ve `HTTP/2` header parsing kenar durumları için önemli bakım sürümü.
- `Apache Log4j 2.25.4`: Özellikle syslog/XML formatlı log taşıyan ekipler için anlamlı bakım sürümü.
- `ADK for Java 1.0.0`: Java agent araç setlerinde protokol ve hafıza katmanını öne çıkaran yeni 1.0 eşiği.
- `Gradle 9.5.0-RC1`: Görev kökeni (`task provenance`) görünürlüğü ve build authoring ergonomisi nedeniyle platform ekipleri için izlenmeye değer; uygulama ekipleri için düşük öncelik.
- `Kubernetes`, `service mesh` ve observability tarafında bugün Java/Spring merkezli yeni yüksek etkili bir resmi duyuru çıkmadı.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Data` kullanan ekipler, repository ve criteria/sort kodundaki string tabanlı property kullanımını en riskli alanlardan başlayarak kademeli biçimde type-safe API’lere taşıyabilir.
- `Spring MVC` kullanan yüksek trafikli ama nispeten hafif payload’lı servislerde, framework ve container yükseltmesi ile virtual thread denemeleri ölçülebilir kazanç üretebilir. Ancak benchmark sonucu doğrudan kopyalanmamalı.
- `External Tomcat` üstünde çalışan Spring uygulamaları için `11.0.21` düzeltmeleri daha acil. `Embedded Tomcat` kullanan ekiplerde ise `Spring Boot` bağımlılık yönetiminin bu sürümleri ne zaman çektiği izlenmeli.
- `Log4j` düzeni merkezi loglama, SIEM veya syslog pipeline’ına bağlı olan ekiplerde sadece “patch” değil veri kalitesi konusu. Log format bozulmaları, gözlemlenebilirlik zincirini sessizce kırabilir.
- `Spring AI` veya genel Java agent yatırımı planlayan ekipler için yeni ders şu: önce memory sınırlarını, tool approval akışlarını ve protokol uyumunu tasarlayın; framework seçimini sonra yapın.

## Fırsatlar ve Riskler

### Fırsatlar

- Repository/query katmanında refactor güvenliğini artırıp latent production bug sınıfını azaltmak.
- Hafif `MVC` endpoint’lerde container/framework optimizasyonları ile ek kapasite kazanmak.
- Server ve logging katmanındaki bakım sürümlerini erkenden alarak müşteri etkili ama zor izole edilen hataları düşürmek.
- AI/agent çalışmalarında `MCP` veya `A2A` gibi protokol uyumlu sınırlar kurarak gelecekteki framework değişim maliyetini azaltmak.

### Riskler

- Type-safe property path yaklaşımını “her şeyi yeniden yazma” projesine çevirmek.
- Benchmark optimizasyonlarını iş yükü ve gözlemlenebilirlik gereksinimi analiz etmeden genellemek.
- `Tomcat` ve `Log4j` gibi altyapı sürümlerini “uygulama değiştirmiyor” diye ertelemek.
- AI tarafında memory, approval ve artefact yaşam döngüsü tanımlanmadan üretim entegrasyonu yapmak.

## İzlenmesi Gereken Konular

- `Spring Data 2026.0.x` hattında type-safe query API yüzeyinin ne kadar genişleyeceği ve GA öncesi isim/ergonomi değişikliği olup olmayacağı
- `Spring Framework 7.0.6` ve ilişkili optimizasyonların `Spring Boot` tarafında varsayılan deneyime ne hızla yansıyacağı
- `Spring Boot` bağımlılık yönetiminin `Tomcat` ve `Log4j` bakım sürümlerini hangi hızda BOM’a çekeceği
- `Gradle 9.5` final sürümünde RC yeniliklerinin ne kadarının stabil kalacağı
- Java agent ekosisteminde `Spring AI`, `ADK`, `MCP` ve `A2A` etrafında fiili uyumluluk pratiklerinin nasıl şekilleneceği
- `Baeldung`, `Josh Long`, `Gunnar Morling` ve `Burak KUTBAY` tarafında bugünkü ana temaları derinleştiren yeni pratik içeriklerin gelip gelmeyeceği

## Kaynak Bazlı Bulgular

### 1. `Spring Data 2026.0.0-M2`, veri erişiminde type-safe refactor yönünü release seviyesine taşıyor

- **title:** `Spring Data`, string tabanlı property erişimini azaltan type-safe yaklaşımı artık gerçek migration konusu haline getiriyor
- **source:** [Spring Data 2026.0.0-M2, 2025.1.8, and 2025.0.12 Released](https://spring.io/blog/2026/03/13/spring-data-2026-0-0-M2-2025-1-8-and-2025-0-12-released), [Moving beyond Strings in Spring Data](https://spring.io/blog/2026/02/27/moving-beyond-strings-in-spring-data/)
- **author:** Mark Paluch
- **date:** 27 Şubat 2026, 13 Mart 2026
- **category:** Data access / API design / release
- **tags:** `spring-data`, `typed-property-path`, `refactor-safety`, `redis`, `mongodb`, `kotlin`
- **summary:** `Spring Data 2026.0.0-M2`, type-safe property references yaklaşımını release train içine taşıyor. Aynı hatta annotation tabanlı Redis keyspace notifications, `Redis 8.4` için koşullu `SET/DEL` desteği ve gözden geçirilmiş `MongoDB` bulk API de var.
- **why_it_matters:** Büyük Java kod tabanlarında query ve sort ifadelerindeki string literal’ler, refactor sonrası derleme aşamasında yakalanmayan pahalı hata sınıfları üretir.
- **java_spring_relevance:** `Spring Data JPA`, `MongoDB`, `Redis` ve genel repository/criteria kullanan ekipler için doğrudan ilgili.
- **actionability:** Yakın vadeli pilot
- **impact_level:** Yüksek
- **opportunities:** Daha güvenli refactor, daha güçlü IDE desteği, Kotlin ile daha doğal property path kullanımı.
- **risks:** Dinamik field adı gereken senaryolarda yanlış soyutlama; ekiplerin tüm query yüzeyini gereksiz yere bir anda dönüştürmeye çalışması.
- **migration_notes:** Önce sık refactor edilen repository/specification/sort alanlarında deneyin. Runtime’da gelen dinamik property isimleri için string API’leri koruyun. Query çevirisi ve generated SQL/command sonuçlarını entegrasyon testleriyle doğrulayın.

### 2. `Spring MVC` tarafında sabit framework maliyetini azaltmak yeniden önem kazandı

- **title:** `Spring Framework 7.0.5/7.0.6` optimizasyonları ve virtual thread’ler, hafif `MVC` endpoint’lerde ölçülebilir kazanç üretebiliyor
- **source:** [Optimizations in Spring MVC](https://spring.io/blog/2026/02/25/optimizations-in-spring-mvc-spring-fruits-benchmark)
- **author:** Dave Syer
- **date:** 25 Şubat 2026
- **category:** Performance / framework engineering
- **tags:** `spring-mvc`, `spring-framework-7`, `virtual-threads`, `throughput`, `benchmark`, `transactional`
- **summary:** Spring’in meyve benchmark analizi, `Framework 7.0.6` optimizasyonları ve virtual thread etkinleştirmesiyle küçük veri setlerinde throughput’un ciddi oranda iyileşebildiğini; ancak büyük veri setlerinde asıl maliyetin uygulama işi olmaya devam ettiğini gösteriyor.
- **why_it_matters:** Birçok kurumsal Spring servisi tam da bu profile sahip: hafif JSON payload, yüksek istek sayısı, düşük business logic maliyeti. Bu tip sistemlerde framework overhead’i görünenden daha önemli olabilir.
- **java_spring_relevance:** `Spring Boot MVC` kullanan internal API, gateway-adjacent servisler ve CRUD yoğun endpoint’ler için yüksek ilgili.
- **actionability:** Hemen benchmark / ölçüm
- **impact_level:** Orta-Yüksek
- **opportunities:** Yeniden yazım yapmadan ek throughput kazanımı, daha düşük pod sayısı veya daha iyi latency.
- **risks:** Gözlemlenebilirlik katmanını körlemesine kapatmak; `@Transactional(readOnly = true)` optimizasyonunu yazma akışlarına da kopyalamak; tek benchmark’ı genel gerçeklik sanmak.
- **migration_notes:** Kendi iş yükünüzde profil çıkarın. `Framework` ve `Boot` sürüm yükseltmesini virtual thread denemesiyle birlikte test edin. Observability, DB driver ve transaction davranışını ölçmeden genelleme yapmayın.

### 3. `Tomcat 11.0.21` ve `Log4j 2.25.4`, üretim tesisatında sessiz ama önemli bakım sinyali veriyor

- **title:** Web container ve logging katmanındaki küçük sürümler, müşteri etkili hataları hedefliyor
- **source:** [Apache Tomcat 11 Changelog](https://tomcat.apache.org/tomcat-11.0-doc/changelog.html), [Apache Tomcat ana sayfa duyurusu](https://tomcat.apache.org/), [InfoQ Java News Roundup](https://www.infoq.com/development/news/77/)
- **author:** Apache Tomcat Project, Apache Logging Services, Michael Redlich
- **date:** 30 Mart 2026, 4 Nisan 2026, 6 Nisan 2026
- **category:** Runtime infrastructure / maintenance / logging
- **tags:** `tomcat`, `log4j`, `nio`, `tls`, `http2`, `syslog`, `xmllayout`, `maintenance`
- **summary:** `Tomcat 11.0.21`, `NIO + TLS` non-blocking flush hatasını düzelterek response’un bağlantı kapanana kadar eksik yazılması riskini kapatıyor; ayrıca `HTTP/2` header frame parsing kenar durumu ve bazı cluster/SSL ayrıntıları da elden geçirilmiş durumda. Aynı dönemde `Log4j 2.25.4`, layout ve konfigürasyon tutarlılığına odaklanan bir bakım sürümü olarak öne çıktı.
- **why_it_matters:** Bu tür sorunlar uygulama kodundan bağımsız görünür; ama semptomları kullanıcı tarafında timeout, yarım response veya bozuk log kaydı olarak yaşanır ve kök neden analizi pahalıdır.
- **java_spring_relevance:** `Spring Boot` servisleri, özellikle external `Tomcat` kullanan dağıtımlar ve merkezi log pipeline’ına bağımlı ekipler için doğrudan ilgili.
- **actionability:** Etkilenenlerde hemen güncelleme, diğerlerinde yakın izleme
- **impact_level:** Yüksek
- **opportunities:** Base image, embedded container ve logging bağımlılık denetimini sıkılaştırmak; release window’ları yalnızca uygulama feature’larına göre değil altyapı riskine göre de planlamak.
- **risks:** `Boot` BOM’una güvenip gerçek runtime sürümünü doğrulamamak; log format değişikliklerini SIEM tarafında test etmemek.
- **migration_notes:** `External Tomcat` kullanıyorsanız daha hızlı patchleyin. `Embedded Tomcat` kullanıyorsanız `Spring Boot` dependency management sürümünü kontrol edin. `RFC5424` veya `XML` tabanlı log taşıyorsanız parser/sanitization davranışını doğrulayın.

### 4. `ADK for Java 1.0.0`, Java agent ekosisteminin nereye gittiğine dair güçlü dış sinyal

- **title:** Java agent araçları artık demo özelliklerinden çok protokol, hafıza ve insan onayı akışını standartlaştırıyor
- **source:** [Announcing ADK for Java 1.0.0](https://developers.googleblog.com/announcing-adk-for-java-100-building-the-future-of-ai-agents-in-java/), [google/adk-java 1.0.0 release](https://github.com/google/adk-java/releases/tag/v1.0.0)
- **author:** Guillaume Laforge
- **date:** 30 Mart 2026
- **category:** AI / developer productivity / protocol interoperability
- **tags:** `java`, `adk`, `a2a`, `memory`, `session`, `human-in-the-loop`, `spring-ai-adjacent`
- **summary:** `ADK for Java 1.0.0`; `A2A` desteği, session/memory servisleri, event compaction, `ToolConfirmation` tabanlı insan onayı ve plugin mimarisi ile geldi. Release notları ayrıca `Spring AI MessageConverter` tarafında görüntü işleme ve backward compatibility iyileştirmeleri içeriyor.
- **why_it_matters:** Java ekosistemindeki AI yatırımı hızla “tek seferlik PoC” olmaktan çıkıyor. Kalıcı sorun artık model çağırmak değil; state yönetimi, tool approval, artefact yaşam döngüsü ve framework’ler arası iletişim.
- **java_spring_relevance:** `Spring AI` kullanan veya kurumsal Java stack’inde agent tabanlı akış düşünen ekipler için orta-yüksek ilgili.
- **actionability:** İzleme / sınırlı pilot
- **impact_level:** Orta
- **opportunities:** Framework bağımsız agent sınırları kurmak, onay akışlarını standardize etmek, hafıza servislerini baştan tasarlamak.
- **risks:** Yeni framework churn’i, cloud bağımlı hafıza servisleri, test edilemez tool akışları.
- **migration_notes:** Agent sınırlarını mümkünse `HTTP`, `MCP`, `A2A` benzeri açık sözleşmelerle kurun. Provider ve framework bağımlılığını servis katmanı arkasına alın. Tool onay ve memory yükleme davranışlarını entegrasyon testine taşıyın.

### 5. Düşük öncelikli ama izlenmeli: `Gradle 9.5.0-RC1` ve `JDK 27 EA16`

- **title:** Build ve platform hattında yeni aday sürümler geliyor, fakat uygulama ekipleri için bugünün ana kararı bunlar değil
- **source:** [InfoQ Java News Roundup](https://www.infoq.com/development/news/77/)
- **author:** Michael Redlich
- **date:** 6 Nisan 2026
- **category:** Build tooling / early access / watchlist
- **tags:** `gradle`, `jdk-27`, `task-provenance`, `kotlin-settings-plugin`, `ea-build`, `low-priority`
- **summary:** `InfoQ`, bu haftaki Java roundup’ta `Gradle 9.5.0-RC1`, `JDK 27 EA16`, `TornadoVM 4.0` ve birkaç bakım sürümünü birlikte öne çıkarıyor. En anlamlı başlık, build authoring ve hata ayıklama ergonomisini iyileştiren `Gradle 9.5.0-RC1`.
- **why_it_matters:** Büyük kurumsal Java kod tabanlarında gerçek sürtünme çoğu zaman build logic, convention plugin ve CI teşhis kabiliyetinde yaşanır.
- **java_spring_relevance:** Platform engineering ve iç geliştirici platformu ekipleri için orta ilgili; tipik uygulama ekipleri için düşük öncelikli.
- **actionability:** İzleme
- **impact_level:** Düşük-Orta
- **opportunities:** Daha iyi build hata analizi, daha güvenli build convention’ları, JDK matrisi hazırlığını erkenden yapmak.
- **risks:** RC/EA sürümlere erken bağlanmak, CI ve plugin uyumluluğunu bozmak.
- **migration_notes:** Ayrı CI branch’inde deneyin. `buildSrc`, convention plugin’ler ve JDK matrix testleri olmadan ana hattan geçmeyin.

## Sonuç

`6 Nisan 2026` taramasının en net mesajı şu: bugün değer üreten sinyal, büyük “yeni framework” duyurularından çok API güvenliği, framework overhead’i ve altyapı bakım kalitesinden geldi. `Spring Data` tarafındaki type-safe yön, Spring ekiplerinin yıllardır tolere ettiği string tabanlı bakım borcunu azaltmak için somut bir yol açıyor.

Aynı anda `Tomcat`, `Log4j` ve `ADK for Java` tarafındaki gelişmeler Java ekiplerine farklı ama ortak bir ders veriyor: üretim kalitesi artık sadece business feature eklemekle gelmiyor. Veri erişiminde refactor güvenliği, web/logging tesisatında sessiz hata azaltımı ve AI tarafında protokol uyumlu sınırlar, roadmap planlamasında daha üst sıraya çıkmalı.
