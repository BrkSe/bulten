# Günlük Java / Spring Ekosistem Raporu

Tarih: `13 Nisan 2026, 09:46 TRT`

Kapsam: `12 Nisan 2026 09:09 TRT` ile `13 Nisan 2026 09:46 TRT` arasındaki günlük tarama.

Kaynak tarama notu: [Spring Blog](https://spring.io/blog/), [Spring proje sayfaları](https://spring.io/projects), Spring release duyuruları ve migration dökümanları, [OpenJDK JEP sayfaları](https://openjdk.org/jeps/0), [Oracle Java Blog](https://blogs.oracle.com/java), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), Josh Long’un güncel Spring içerikleri, Spring maintainer yazıları, ilgili GitHub/release bağlantıları ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandı. Bugünkü taramada Baeldung ve Burak KUTBAY tarafında öncelik sırasını değiştiren yeni birinci seviye bir bulgu çıkmadı; bu nedenle rapor, daha yüksek üretim etkisi taşıyan resmi release, migration ve platform sinyallerine odaklandı.

## Öne Çıkan Başlıklar

- `Spring Boot 3.5.12` ve `4.0.4`, iki actuator kimlik doğrulama bypass CVE’sini kapatıyor. Boot ekipleri için bug fix değil, doğrudan patch penceresi konusu.
- `Spring Security 7` hazırlığı artık soyut gelecek planı değil. Lambda DSL zorunluluğu, `PathPatternRequestMatcher` geçişi ve relative redirect davranışı bugünden kod taraması gerektiriyor.
- `Spring Data`, string tabanlı property path yaklaşımından kademeli olarak çıkıyor. Tip güvenli property reference yönü, uzun ömürlü domain refactor’larında gerçek hata maliyetini azaltabilir.
- `Spring Kafka 4.1.0-M2`, Kafka `4.2.0` tabanına geçerken share consumer ve gözlemlenebilirlik tarafında önemli sinyaller veriyor; patch hatları da observation leak düzeltmelerini geri taşıyor.
- `Java 26`, sadece dil seviyesi değil; `HTTP/3`, any-GC AOT cache ve `final` alan mutasyonu uyarıları ile doğrudan platform/operasyon etkisi yaratıyor.

## Kritik Güncellemeler

1. `Spring Boot 3.5.12` ve `4.0.4` gecikmeden değerlendirilmeli.
   Resmi duyurular, her iki hattın da `CVE-2026-22731` ve `CVE-2026-22733` düzeltmelerini içerdiğini söylüyor. Özellikle actuator health group path ve Cloud Foundry endpoint erişimleri kullanan ekipler için bu sürümler öncelikli.

2. `Spring Security 7` göç hazırlığı, “major upgrade gelince bakarız” işi olmaktan çıktı.
   Resmi migration rehberi, Lambda DSL’nin zorunlu hale geleceğini, `.apply()` yerine `.with()` kullanımına geçilmesi gerektiğini ve request matcher davranışının değişeceğini net biçimde yazıyor.

3. `Spring Data` tarafında tip güvenli query/property path yönü güçleniyor.
   `2026.0.0-M1` ile gelen type-safe property paths, `2026.0.0-M2` ile birlikte annotation-driven Redis listeners ve yeni bulk API yönüyle daha geniş bir ergonomi hamlesine dönüşüyor.

4. `Spring AI 2.0.0-M4`, yeni kabiliyet kadar temizlenmesi gereken entegrasyon yüzeyi de getiriyor.
   Dynamic structured output kontrolü olumlu; ancak Vertex AI, ZhiPu AI ve OCI GenAI integration sınıfları için deprecation kararı, production bağımlılığı olan ekiplerde migration backlog’u başlatmalı.

5. `Java 26` kabul edilirse, outbound HTTP ve startup davranışı için yeni test yüzeyi açılıyor.
   `HTTP/3` artık JDK `HttpClient` içinde opt-in destekli; Project Leyden tarafında any-GC object cache ile ZGC gibi collector’lar için de hızlı başlangıç yolu açılıyor.

## Trendler ve Sinyaller

### 1. Spring portföyünde derleme zamanı güvenliği ve daha açık DSL’ler öne çıkıyor

Tekil release notlarının ötesinde tekrar eden sinyal şu:

- Spring Security, daha belirsiz zincir tabanlı konfigürasyondan zorunlu Lambda DSL’e itiyor.
- Spring Data, `"address.country"` gibi string path’lerden `PropertyPath.of(...)` ve method reference yaklaşımına kayıyor.
- Spring Tools `5.1.0`, Framework 7 API versioning ve query intelligence için IDE seviyesinde doğrulama ekliyor.

Bu üçü birlikte okunduğunda, Spring ekosistemi “çalışır ama sonradan patlar” stilinden “IDE/derleyici erken söylesin” çizgisine daha fazla yatırım yapıyor.

### 2. Platform tarafında odak yeni özellikten çok operasyonel sertleşme

Bugünkü güçlü sinyallerin ortak paydası:

- security patch release’leri
- gözlemlenebilirlik sızıntısı düzeltmeleri
- request matcher davranışı değişimleri
- `final` alan mutasyonunun kısıtlanmasına hazırlık

Bu, ekosistemin şu an daha çok production doğruluğu, güvenlik ve beklenmeyen davranışların azaltılması ekseninde ilerlediğini gösteriyor.

### 3. Event-driven altyapı, framework seviyesinde daha olgun hale geliyor

`Spring Kafka` tarafında share consumer semantics ve error handling iyileşirken, `Spring Modulith 2.1 M4` JobRunr ile event externalization desteği getiriyor. Yani “event çıkar, gerisi sana kalmış” seviyesi yerine, teslimat semantiği ve dışsallaştırma seçenekleri framework katmanında daha görünür hale geliyor.

### 4. AI tarafında genişleme kadar sadeleşme de var

`Spring AI 2.0.0-M4` sadece yeni özellik eklemiyor; bazı provider entegrasyonlarını gelecekte kaldırılacak diye işaretliyor. Bu, AI stack seçiminde “her sağlayıcıya aynı anda bağlanalım” yaklaşımının yerine daha seçici ve sürdürülebilir entegrasyon yüzeyinin önem kazandığını düşündürüyor.

## Araçlar ve Kütüphaneler

- `Spring Boot 3.5.12 / 4.0.4`
  Yüksek öncelik. CVE düzeltmeleri nedeniyle doğrudan patch release olarak ele alınmalı.

- `Spring Security 7 migration rehberi`
  Yeni kütüphane değil; ama bugünkü en yüksek operasyonel değere sahip dokümanlardan biri. Upgrade öncesi statik kod tarama checklist’i üretmek için uygun.

- `Spring Data 2026.0.0-M2`
  Orta-yüksek öncelik. Redis Pub/Sub annotation modeli ve Mongo bulk API iyileştirmeleri nedeniyle veri erişimi/entegrasyon ekipleri için dikkat çekici.

- `Spring Kafka 4.1.0-M2`
  Orta-yüksek öncelik. Kafka `4.2.0` tabanı, share consumer geliştirmeleri ve observation leak fix’leri nedeniyle özellikle event-driven servislerde izlenmeli.

- `Spring Modulith 2.1 M4`
  Orta öncelik. Modüler monolit kullanan ekiplerde event externalization ve AOT desteği bakımından önemli.

- `Spring Tools 5.1.0`
  Düşük-orta öncelik. Üretim runtime etkisinden çok geliştirici verimliliği etkisi var; ancak Cursor/VS Code/Eclipse kullanan ekiplerde Spring 7/Boot 4 hazırlığını kolaylaştırabilir.

## Java / Spring Geliştiricileri İçin Etkiler

- Actuator güvenlik konfigürasyonlarını tekrar gözden geçirin. Özellikle custom `SecurityFilterChain` tanımlayan servislerde, “Boot zaten koruyor” varsayımı tehlikeli.
- Spring Security 7’ye yakın vadede geçmeyecek olsanız bile, mevcut konfigürasyonlarınızda `.and()` zinciri, `.apply()` kullanan custom DSL’ler ve `AntPathRequestMatcher` bağımlılıklarını taramaya başlayın.
- Spring Data kullanıyorsanız, yoğun refactor edilen repository/query kodlarında type-safe property paths’i seçici biçimde denemek mantıklı. Her yerde zorunlu değil, ama en kırılgan sorgu kodunda değerli.
- Kafka tabanlı servislerde observation leak fix’leri ve async ack davranışları nedeniyle patch seviyesinde yükseltme, yeni feature’dan daha önemli olabilir.
- Java 26 değerlendirmesinde sadece dil özelliklerine bakmayın. `HttpClient`, AOT startup ve reflection/serialization davranışı için ayrı uyumluluk testi tanımlayın.

## Fırsatlar ve Riskler

### Fırsatlar

- Spring Security 7 hazırlığını erken başlatan ekipler, major upgrade’i tek büyük sıçrama yerine küçük refactor’lara bölebilir.
- Type-safe property paths, büyük domain model refactor’larında testlere yakalanmayan string path hatalarını azaltabilir.
- Java 26 `HTTP/3` desteği, yüksek latency ve mobil/ağ kaybı senaryolarında outbound client katmanında performans fırsatı yaratabilir.
- Spring Modulith + JobRunr kombinasyonu, modüler monolitten dış dünyaya güvenilir event çıkarma konusunu sadeleştirebilir.

### Riskler

- Security patch release’lerini “sadece bakım sürümü” gibi görmek, özellikle actuator yüzeyi açık sistemlerde gereksiz risk yaratır.
- Spring AI’de deprecated provider entegrasyonlarını geç fark etmek, model sağlayıcı değişimini acele migration’a dönüştürebilir.
- Spring Security matcher değişimleri, login redirect ve URL pattern davranışlarında sessiz regresyon çıkarabilir.
- `JEP 500` etkisi, reflection ile final alan mutate eden eski kütüphanelerde log gürültüsü ve ileride sert kırılma olarak geri dönebilir.

## İzlenmesi Gereken Konular

- `Spring Boot 3.5.x` ve `4.0.x` sonrası ek patch release’lerde actuator/security yüzeyine ilişkin yeni advisory gelip gelmeyeceği
- `Spring Security 7.1.x` hattında migration rehberinin yeni zorunlu maddeler ekleyip eklemediği
- `Spring AI 2.0` GA’ya giderken deprecated provider entegrasyonları için resmi replacement yönlendirmeleri
- `Java 26` benimsemesinde framework ve serialization kütüphanelerinin `JEP 500` warning temizliği
- `Spring Modulith 2.1` hattında JobRunr externalization’ın gerçek üretim örnekleri ve operasyonel desenleri

## Kaynak Bazlı Bulgular

### 1. Spring Boot patch release’leri actuator güvenlik açığını kapatıyor

- **title:** Spring Boot `3.5.12` ve `4.0.4`, actuator path tabanlı auth bypass açıklarını kapatıyor
- **source:** [Spring Boot 3.5.12 available now](https://spring.io/blog/2026/03/19/spring-boot-3-5-12-available-now), [Spring Boot 4.0.4 available now](https://spring.io/blog/2026/03/19/spring-boot-4-0-4-available-now)
- **author:** Moritz Halbritter
- **date:** `19 Mart 2026`
- **category:** security-update / spring-boot / actuator
- **tags:** `spring-boot`, `security`, `actuator`, `cve-2026-22731`, `cve-2026-22733`, `patch-release`
- **summary:** Her iki Boot hattı da actuator health group path ve Cloud Foundry endpoint yüzeyindeki authentication bypass açıklarını kapatıyor.
- **why_it_matters:** Bu sürümler özellik değil güvenlik taşıyor; patch’i ertelemek riskin açık kalması anlamına gelir.
- **java_spring_relevance:** Çok yüksek. Spring Boot kullanan her HTTP servis için doğrudan ilgili.
- **actionability:** Hemen değerlendirilmeli.
- **impact_level:** Yüksek.
- **opportunities:** Actuator erişim politikasını yeniden doğrulamak ve custom security chain’leri sadeleştirmek.
- **risks:** “Sadece patch” diye geciktirmek; custom actuator exposure kurallarında açık yüzey bırakmak.
- **migration_notes:** Upgrade sonrası `management.endpoints.web.exposure.*`, custom `SecurityFilterChain`, health groups ve Cloud Foundry endpoint erişim kuralları smoke test edilmeli.

### 2. Spring Security 7 hazırlığı bugünden kod temizliği gerektiriyor

- **title:** Spring Security 7 migration rehberi, matcher ve DSL değişimlerini erkene çekiyor
- **source:** [Configuration Migrations](https://docs.spring.io/spring-security/reference/6.5/migration-7/configuration.html), [Web Migrations](https://docs.spring.io/spring-security/reference/6.5/migration-7/web.html)
- **author:** Spring Security ekibi
- **date:** `13 Nisan 2026 itibarıyla resmi migration rehberi`
- **category:** migration / security / framework-breaking-change
- **tags:** `spring-security`, `migration`, `lambda-dsl`, `pathpatternrequestmatcher`, `favorRelativeUris`, `portResolver`
- **summary:** Rehber, Lambda DSL kullanımının Spring Security 7’de zorunlu olacağını; `.apply()` yerine `.with()` geçişini; relative redirect, `PortResolver` kaldırılması ve `PathPatternRequestMatcher` varsayılanını açıkça tarif ediyor.
- **why_it_matters:** Bunlar sürüm yükseltme gününde fark edilirse test kaçakları ve güvenlik regresyonları üretir.
- **java_spring_relevance:** Çok yüksek. Servlet ve WebFlux güvenlik konfigürasyonu olan tüm Spring servisleri etkilenir.
- **actionability:** Hemen backlog’a alınmalı.
- **impact_level:** Yüksek.
- **opportunities:** Güvenlik konfigürasyonlarını daha okunur hale getirmek; matcher kullanımını tek biçime indirmek.
- **risks:** Login redirect, switch-user, custom DSL ve URL eşleme davranışlarında sessiz kırılmalar.
- **migration_notes:** Kod taramasında `.and()`, `.apply()`, `AntPathRequestMatcher`, `MvcRequestMatcher`, `setExitUserUrl`, `setSwitchUserUrl` ve custom `PortResolver` kullanımları tespit edilmeli.

### 3. Spring Data string tabanlı sorgu yolundan kademeli çıkıyor

- **title:** Spring Data, type-safe property paths ile query/refactor güvenliğini yükseltiyor
- **source:** [Spring Data 2026.0.0-M1 released](https://spring.io/blog/2026/02/13/spring-data-2026-0-0-m1-released), [Moving beyond Strings in Spring Data](https://spring.io/blog/2026/02/27/moving-beyond-strings-in-spring-data), [Spring Data 2026.0.0-M2 released](https://spring.io/blog/2026/03/13/spring-data-2026-0-0-M2-released)
- **author:** Mark Paluch
- **date:** `13 Şubat 2026`, `27 Şubat 2026`, `13 Mart 2026`
- **category:** data-access / developer-productivity / api-design
- **tags:** `spring-data`, `typed-property-path`, `refactoring-safety`, `redis-pubsub`, `mongodb-bulk`, `developer-experience`
- **summary:** `PropertyPath.of(Person::getName)` ve benzeri API’ler, stringly-typed query path’leri azaltmayı hedefliyor. M2 hattı ayrıca annotation-driven Redis listener ve yeni Mongo bulk yazım modeli getiriyor.
- **why_it_matters:** Veri erişim katmanında hataların önemli bölümü derleyicide değil çalışırken görülüyor; bu hamle o sınıf hataları küçültüyor.
- **java_spring_relevance:** Yüksek. Repository, Criteria, query ve refactor yoğun Spring Data kodu olan ekipler için doğrudan ilgili.
- **actionability:** Pilot olarak hemen denenebilir.
- **impact_level:** Orta-yüksek.
- **opportunities:** Refactor güvenliğini artırmak; query kodunu daha okunur ve IDE dostu hale getirmek.
- **risks:** Dinamik field adı gerektiren kullanım senaryolarında aşırı soyutlamaya kaçmak; karışık geçiş döneminde iki stilin düzensiz kullanımı.
- **migration_notes:** Tüm query kodunu bir anda taşımayın. Sık refactor edilen, nested path kullanan veya production’da bug çıkarmış repository/sort kriterlerinden başlayın.

### 4. Spring AI M4, hem structured output hem de sağlayıcı sadeleştirmesi getiriyor

- **title:** Spring AI `2.0.0-M4`, structured output’u güçlendirirken bazı provider entegrasyonlarını deprecated ilan ediyor
- **source:** [Spring AI 2.0.0-M4, 1.1.4 and 1.0.5 are available now](https://spring.io/blog/2026/03/26/spring-ai-2-0-0-M4-and-1-1-4-and-1-0-5-available)
- **author:** Ilayaperumal Gopinathan
- **date:** `26 Mart 2026`
- **category:** ai-framework / release / migration
- **tags:** `spring-ai`, `structured-output`, `deprecation`, `vertex-ai`, `zhipu-ai`, `oci-genai`, `sdk-upgrade`
- **summary:** `1.1.4` ve `2.0.0-M4` sürümlerinde dynamic structured output kontrolü öne çıkıyor. Buna karşılık Vertex AI, ZhiPu AI ve OCI GenAI integration sınıfları deprecated edilerek gelecekte kaldırılacak diye işaretlenmiş.
- **why_it_matters:** AI tarafında “daha çok provider” değil “daha yönetilebilir yüzey” yönüne kayış var. Bu kararlar son dakikaya bırakılırsa model sağlayıcı migration’ı pahalılaşır.
- **java_spring_relevance:** Yüksek. Spring AI tabanlı servis ve internal assistant geliştiren ekipler için doğrudan ilgili.
- **actionability:** Kullanılan provider’a göre hemen veya yakın vadede.
- **impact_level:** Orta-yüksek.
- **opportunities:** Structured output ve SDK güncellemeleri ile daha denetlenebilir AI entegrasyonu kurmak.
- **risks:** Deprecated entegrasyonların prod’da fark edilmeden kalması; provider bağımlılığının geç çözülmesi.
- **migration_notes:** Provider bağımlılığı envanteri çıkarılmalı. Deprecated adapter kullanan servislerde alternatif sağlayıcı veya resmi replacement yolu şimdiden kararlaştırılmalı.

### 5. Spring Kafka’da asıl değer yeni feature kadar patch kalitesi

- **title:** Spring Kafka `4.1.0-M2`, Kafka `4.2.0` ile hizalanırken patch hatları observation leak düzeltmelerini geri taşıyor
- **source:** [Spring for Apache Kafka 4.1.0-M2, 4.0.4, and 3.3.14 Available](https://spring.io/blog/2026/03/17/spring-kafka-4)
- **author:** Soby Chacko
- **date:** `17 Mart 2026`
- **category:** messaging / observability / event-driven
- **tags:** `spring-kafka`, `apache-kafka-4.2`, `share-consumer`, `retryabletopic`, `observability`, `memory-leak`
- **summary:** `4.1.0-M2`, Kafka client `4.2.0` tabanına geçiyor; share consumer için `renew()` ve gelişmiş hata işleme getiriyor. `4.0.4` ve `3.3.14` ise async ack kilitlenmesi ve filtered-message observation leak gibi kritik bug’ları geri taşıyor.
- **why_it_matters:** Event-driven servislerde gözlemlenebilirlik sızıntısı ve ack davranış bozukluğu, yeni feature eksikliğinden daha pahalıdır.
- **java_spring_relevance:** Yüksek. Kafka kullanan Spring mikroservisleri için doğrudan ilgili.
- **actionability:** Patch hatları için hemen; milestone hattı için kontrollü pilot.
- **impact_level:** Orta-yüksek.
- **opportunities:** Share consumer semantiğiyle daha esnek kuyruk benzeri tüketim desenleri kurmak.
- **risks:** Patch sürümlerini erteleyip observation leak veya async ack sorunlarını prod’da taşımak.
- **migration_notes:** `@RetryableTopic`, async ack, custom error handler ve Micrometer/observation entegrasyonu olan consumer’lar upgrade sonrası özel olarak test edilmeli.

### 6. Spring Modulith, event externalization’ı daha pratik hale getiriyor

- **title:** Spring Modulith `2.1 M4`, JobRunr ile event externalization seçeneğini genişletiyor
- **source:** [Spring Modulith 2.1 M4, 2.0.5, and 1.4.10 released](https://spring.io/blog/2026/03/27/spring-modulith-2-1-m4-2-0-5-and-1-4-10-released), [Spring Modulith event externalization docs](https://docs.spring.io/spring-modulith/reference/1.4-SNAPSHOT/events.html)
- **author:** Oliver Drotbohm; Spring Modulith ekibi
- **date:** `27 Mart 2026`
- **category:** architecture / modular-monolith / eventing
- **tags:** `spring-modulith`, `jobrunr`, `event-externalization`, `modular-monolith`, `aot`
- **summary:** `2.1 M4`, Namastack’e ek olarak JobRunr tabanlı event externalization desteği getiriyor; ayrıca event publication registry giriş tetikleyicileri ve bazı AOT iyileştirmeleri ekleniyor.
- **why_it_matters:** Modüler monolit kuran ekipler için domain event’leri dış dünyaya taşıma konusu daha az el yapımı hale geliyor.
- **java_spring_relevance:** Orta-yüksek. Özellikle Spring Boot tabanlı modüler monolit ve kademeli ayrıştırma yapan ekipler için.
- **actionability:** Pilot için uygun.
- **impact_level:** Orta.
- **opportunities:** Event dışsallaştırmasını uygulama içi modüler sınırlarla daha tutarlı yönetmek.
- **risks:** Delivery semantiği ve retry/backoff davranışını framework’e fazla bırakıp operasyonel nüansları gözden kaçırmak.
- **migration_notes:** `@Externalized` kullanan olaylarda teslim garantisi, duplicate handling ve idempotency politikası açıkça tanımlanmalı.

### 7. Java 26, framework ekipleri için yeni test ve temizlik işleri açıyor

- **title:** Java 26; `HTTP/3`, any-GC AOT cache ve `final` alan mutasyonu uyarılarıyla doğrudan backend etkisi yaratıyor
- **source:** [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [JEP 517](https://openjdk.org/jeps/517), [JEP 516](https://openjdk.org/jeps/516), [JEP 500](https://openjdk.org/jeps/500), [Inside Java: How JDK 26 Improves G1's Throughput](https://inside.java/2026/04/09/podcast-054/)
- **author:** Sharat Chander; OpenJDK yazarları; Nicolai Parlog ve Stefan Johansson
- **date:** `17 Mart 2026`, `9 Nisan 2026`
- **category:** jdk / runtime / networking / integrity
- **tags:** `java-26`, `http3`, `aot-cache`, `leyden`, `final-fields`, `integrity-by-default`, `g1`
- **summary:** Java 26 ile JDK `HttpClient` için opt-in `HTTP/3` desteği geliyor; GC-agnostic AOT object caching ile hızlı başlangıç yolu tüm collector’lara açılıyor; deep reflection ile `final` alan mutasyonları için warning dönemi başlıyor.
- **why_it_matters:** Bunlar teorik JEP değil; outbound client, startup profili, serialization/reflection ve runtime temizliği için gerçek etkiler üretiyor.
- **java_spring_relevance:** Yüksek. Spring Boot servisleri, native/AOT denemeleri ve reflection yoğun kütüphaneler kullanan ekipler için doğrudan ilgili.
- **actionability:** İzleme + kontrollü test.
- **impact_level:** Orta-yüksek.
- **opportunities:** `HTTP/3` ile daha iyi istemci davranışı; AOT cache ile daha hızlı scale-out; reflection temizlikleriyle daha güvenli runtime.
- **risks:** `final` field mutate eden eski kütüphanelerde warning/uyumsuzluk; `HTTP/3` geçişinde altyapı veya karşı uç uyumsuzluğu; AOT ölçümlerinde yanlış beklenti.
- **migration_notes:** `HttpClient` kullanan bileşenlerde `HTTP_3` denemeleri ayrı feature flag ile yapılmalı. Reflection kullanan serialization/test araçlarında `final` alan yazımı aranmalı. AOT cache denemeleri collector bazlı ölçülmeli.

## Sonuç

Bugünün en net mesajı şu: Java/Spring tarafında değerli hareketler daha çok üretim güvenliği, açık DSL, refactor güvenliği ve altyapı olgunluğu ekseninde geliyor. En acil konu `Boot 3.5.12 / 4.0.4` patch penceresi; en yüksek teknik kaldıraç ise `Spring Security 7` ön hazırlığını bugünden başlatmak. Bunun yanında `Spring Data` ve `Java 26` tarafındaki değişimler, 2026 boyunca “daha erken hata yakalama” ve “daha az sürprizli runtime” yönünün güçleneceğini gösteriyor.
