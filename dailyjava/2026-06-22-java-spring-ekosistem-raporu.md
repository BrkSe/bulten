# Günlük Java / Spring Ekosistem Raporu

Tarih: 22 Haziran 2026  
Tarama zamanı: 22 Haziran 2026 09:08 TSİ  
Odak: Örtük framework davranışlarının görünür kontrol yüzeylerine dönüşmesi: batch metadata deposu, veri ve kimlik patch-floor'u, agentic tool loop mimarisi ve JDK yol haritası takibi

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Boot 4.1 ve Spring Batch yazısı](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch), [Spring AI 2.0 tool calling yazısı](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling), [This Week in Spring - 16 Haziran 2026](https://spring.io/blog/2026/06/16/this-week-in-spring-june-16-2026), [Spring Data 2026.0.0 GA](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available), [Spring Data 2025.1.6 ve 2025.0.12 service release duyurusu](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released), [Spring Security 2026.06 releases](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06), [Spring Authorization Server 2026.06 releases](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06), [Spring Session 2026.06 releases](https://spring.io/blog/2026/06/09/spring-session-releases-2026-06), ilgili GitHub release sayfaları, [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [Inside Java JDK 27 etiketi](https://inside.java/tag/jdk-27/), [Inside Java Quality Outreach yazıları](https://inside.java/2026/05/22/quality-heads-up/), [Inside Java microservice benchmark özeti](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/), [Oracle Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26), [Oracle Jipher 10.36 duyurusu](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java), [InfoQ Java](https://www.infoq.com/java/), [Baeldung Java Weekly 651](https://www.baeldung.com/java-weekly-651), [Gunnar Morling akışı](https://www.morling.dev/index.xml) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandı. Dünkü rapordaki Boot `4.1` tabanı, Spring Cloud release-train kararı, gRPC, Vault ve GraphQL ekseni tekrar edilmedi; bugün Batch metadata kontrol yüzeyi, Spring Data ve kimlik/security patch zemini, Spring AI tool loop mimarisi ve JDK izleme sinyalleri öne çıkarıldı. Burak KUTBAY blogunda 22 Haziran 2026 itibarıyla bu öncelik sırasını değiştiren yeni bir Java/Spring girdisi görünmüyor; Gunnar Morling tarafında ise Hardwood `1.0.0.CR1` yalnız belirli veri platformu ekipleri için düşük-orta öncelikli bir araç sinyali üretiyor. Bu son değerlendirme, taranan kaynakların karşılaştırılmasından yapılan çıkarımdır.

## Öne Çıkan Başlıklar

- [Spring Boot 4.1](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch), Spring Batch metadata'sını artık yeni `spring-boot-starter-batch-data-mongodb` ile MongoDB üzerinde tutabiliyor; Mongo ağırlıklı ekipler için "Batch için zorunlu yan SQL veritabanı" varsayımı kırıldı.
- [Spring Data 2026.0.0](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available) yeni özelliklerle geldi, ama aynı gün çıkan [2025.1.6 ve 2025.0.12 service release'leri](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released) 12 farklı CVE kapattığı için gerçek öncelik feature adoption değil patch-floor.
- [Spring Security 2026.06](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06) ve [Spring Authorization Server 1.5.8](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06), SAML, open redirect ve X.509 impersonation yüzeylerinde doğrudan üretim etkisi olan düzeltmeler taşıyor.
- [Spring AI 2.0 tool calling mimarisi](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling), tool loop'u model implementasyonunun içinden çıkarıp advisor zincirine taşıyor; bu, AI kodu için feature değil kontrol-düzlemi değişikliği.
- [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/) ile [Inside Java JDK 27 akışı](https://inside.java/tag/jdk-27/) arasında görünürlük farkı var; tek landing page'e bakmak artık JDK 27 değişim yüzeyini eksik okumaya yol açıyor.

## Kritik Güncellemeler

### 1. Spring Batch metadata katmanı artık SQL'e kilitli değil

[Josh Long'un 21 Haziran yazısı](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch), Spring Batch'in yıllardır taşıdığı örtük varsayımı kırıyor: `JobRepository` için SQL veritabanı zorunlu değil. Yeni `spring-boot-starter-batch-data-mongodb` ile Spring Boot `4.1`, MongoDB üzerinde metadata yönetimini autoconfiguration seviyesine taşıyor.

Bu değişikliğin teknik olarak önemli kısmı şu:

- `spring.batch.data.mongodb.schema.initialize=true` ile gerekli koleksiyonlar otomatik açılıyor.
- JDBC metadata yolu devre dışı bırakılmak istenirse `BatchJdbcAutoConfiguration` explicit olarak exclude ediliyor.
- MongoDB tarafında transaction gerektiği için tek node bile olsa replica set gerekiyor.

Bu, Mongo kullanan ekipler için net bir altyapı sadeleşmesi fırsatı. Ama "SQL'i siliyoruz" refleksiyle hareket etmek riskli. Çünkü burada sadeleşen şey business data değil, Batch metadata kontrol yüzeyi. Restart semantics, job replay, audit izi ve transaction davranışı test edilmeden migration yapılmamalı.

### 2. Spring Data tarafında feature train ile patch floor birbirinden ayrıldı

[Spring Data 2026.0.0 GA](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available) değerli bir feature set getiriyor:

- type-safe property paths
- annotation-driven Redis Pub/Sub listener'ları
- çoklu koleksiyonlu MongoDB bulk write API'si
- JDBC ve R2DBC için tek statement upsert

Ama aynı gün yayımlanan [Spring Data 2025.1.6 ve 2025.0.12 service release'leri](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released) 12 CVE kapatıyor. Bu CVE kümesi Data Commons property path resolution DoS, MongoDB annotated query binding breakout, relational `LIKE` pattern escaping, Sort parametreleriyle DoS, Data REST JSON Patch ve SpEL injection gibi çok farklı giriş noktalarını kapsıyor.

Sonuç net: Spring Data için iki ayrı backlog gerekiyor.

- Birincisi, `2026.0.0` özellikleri için planlı modernizasyon backlog'u.
- İkincisi, `2025.1.6` ve `2025.0.12` patch floor'una acil yükseltme backlog'u.

Bu ayrımı yapmayan ekipler feature heyecanıyla patch borcunu görünmez hale getirir.

### 3. Kimlik ve güvenlik katmanında 9 Haziran tabanı zorunlu hale geldi

[Spring Security 2026.06 release'i](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06), `6.5.11`, `7.0.6` ve `7.1.0` sürümlerini aynı anda yayınladı ve yedi CVE kapattı. Sinyal yalnız sayı değil, etki yüzeyi:

- SAML 2.0 servis sağlayıcı tarafında DEFLATE inflation ve decryption/signature doğrulama sorunları
- HTML output encoding açığı
- `CookieRequestCache` open redirect
- Authorization Server `request_uri` open redirect
- X.509 client certificate ile unauthorized impersonation

[Spring Authorization Server 1.5.8](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06) aynı `request_uri` açığını kendi release notuyla ayrıca işaret ediyor. Buna [Spring Session 2026.06](https://spring.io/blog/2026/06/09/spring-session-releases-2026-06) dependency alignment düzeltmeleri de eklenince mesaj şu oluyor: kimlik ve session katmanında "daha sonra bakarız" penceresi kapanmış durumda.

Özellikle şu ekipler bunu acil iş olarak görmeli:

- SAML kullanan kurumsal login akışları
- custom Authorization Server veya OAuth2 provider kuran ekipler
- X.509 client certificate ile servisler arası trust kuran altyapılar

### 4. Spring AI 2.0'da tool loop artık görünmez sihir değil, mimari yüzey

[Spring AI 2.0 tool calling yazısı](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling), 1.x ile 2.0 arasındaki en önemli farkın model listesi değil kontrol akışı olduğunu gösteriyor.

Kritik noktalar:

- Tool execution loop artık model implementasyonunun içinde gizli değil; advisor chain'in bir parçası.
- `ToolCallingAdvisor`, tool çağrısı kalmayana kadar recursive olarak downstream chain'i yeniden çalıştırıyor.
- Memory advisor'ı loop'un dışında tutulursa sadece final kullanıcı ve asistan mesajları persist ediliyor.
- Memory advisor'ı loop'un içine alınırsa tool request/response transcript'i de kalıcı hale geliyor; bu daha zengin bağlam veriyor ama yanlış kurgulanırsa duplicate history riski doğuruyor.
- `AugmentedToolCallbackProvider`, modelin tool çağrısından önce kendi gerekçesini üretmesini zorlayabiliyor.
- MCP client/server starter'ları ile remote tool ekosistemi Spring tarafına doğal biçimde bağlanabiliyor.

Bu, Spring AI kullanan ekipler için doğrudan şu anlama geliyor: advisor sıralaması, memory policy ve tool transcript saklama modeli artık business logic kadar mimari karar.

### 5. JDK 26/27 takibi için tek resmi sayfa yetmiyor

[Oracle Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26), JDK `26` güncelleme desteğinin Eylül 2026'ya kadar süreceğini ve Oracle'ın feature-release ritmini koruduğunu tekrar netleştiriyor. Ancak daha önemli sinyal JDK `27` izleme yüzeyinde.

[OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/) bugün hâlâ yalnız `JEP 527`yi listeliyor ve son güncelleme tarihi `2026/1/20`. Buna karşılık [Inside Java JDK 27 etiketi](https://inside.java/tag/jdk-27/) ve Quality Outreach akışı şu başlıkları çoktan işaret ediyor:

- `JEP 523` G1'in tüm ortamlarda default hale gelmesi
- `JEP 531` Lazy Constants
- `JEP 532` primitive types in patterns
- `JEP 533` Structured Concurrency
- `JEP 537` Vector API
- `JEP 538` PEM encodings
- launcher option kaldırımları
- JSON thread dump format değişiklikleri

Bu fark, Spring ve JVM ekipleri için operasyonel bir ders veriyor: JDK yol haritasını yalnız landing page üzerinden izlemek artık güvenli değil. Inside Java tag akışı, Quality Outreach notları ve doğrudan JEP duyuruları birlikte okunmalı.

## Trendler ve Sinyaller

### Trend Kümesi 1: Framework "magic" yerine explicit kontrol düzlemi geliyor

Tekrarlayan sinyaller:

- Spring Batch metadata store'unun explicit olarak MongoDB'ye taşınabilmesi
- Spring AI tool loop'unun advisor chain'e alınması
- Spring Data'da type-safe property paths ile string-temelli query yüzeyinin daraltılması

Çıkarım:

- Spring ekosistemi "kolaylık" sağlarken artık davranışları daha görünür ve ayarlanabilir hale getiriyor.
- Bu, senior ekipler için iyi haber; çünkü production debugging, policy enforcement ve audit tarafında gizli otomasyon yerine yönetilebilir akışlar oluşuyor.

### Trend Kümesi 2: Patch-floor ile feature-train aynı backlog içinde yönetilemez

Tekrarlayan sinyaller:

- Spring Data `2026.0.0` feature release'i ile `2025.1.6/2025.0.12` service floor'u aynı gün geldi
- Spring Security `2026.06` ve Authorization Server `1.5.8` aynı güvenlik penceresini işaret ediyor
- `This Week in Spring` akışı aynı hafta içinde çok sayıda coordinated patch yayımlandığını gösteriyor

Çıkarım:

- "Yeni sürüm çıktı, sonra topluca geçeriz" yaklaşımı yetersiz.
- Ekiplerin feature adoption, support-line migration ve security patch-floor için ayrı karar kanalları kurması gerekiyor.

### Trend Kümesi 3: Dependency drift artık build sorunu değil mimari risk

Tekrarlayan sinyaller:

- [Block'un monorepo yazısı](https://engineering.block.xyz/blog/from-polyrepo-fragmentation-to-monorepo-leverage) 450 JVM repository'yi tek codebase altında topladı
- aynı yazı dependency drift, diamond dependency ve cross-repo change maliyetini doğrudan runtime riski olarak anlatıyor
- shared Gradle plugin'ler, dependency graph tabanlı build scoping ve merge queue kullanımı artık "tooling nice-to-have" değil

Çıkarım:

- Büyük Spring estates için internal BOM hijyeni, ortak Gradle convention'ları ve selective CI stratejileri artık platform mühendisliğinin merkezinde.

### Trend Kümesi 4: Java performansı ikinci runtime açma kararını daha zor savunulur hale getiriyor

Tekrarlayan sinyaller:

- [Inside Java'nın 2026 benchmark güncellemesi](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/) Java ve Go mikroservislerini tekrar karşılaştırıyor
- [Baeldung Java Weekly 651](https://www.baeldung.com/java-weekly-651) aynı yazıyı haftanın temel sinyallerinden biri olarak öne çıkarıyor
- [Oracle Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26) feature release ritminin kararlı biçimde sürdüğünü vurguluyor

Çıkarım:

- Salt performans nedeniyle ikinci bir backend runtime açma argümanı zayıflıyor.
- Bu yine de "ölçmeden karar verin" anlamına gelmiyor; doğru sonuç için kendi payload, concurrency ve observability yükünüzde test şart.

## Araçlar ve Kütüphaneler

- [spring-boot-starter-batch-data-mongodb](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch): Mongo-first ekipler için bugün en dikkat çekici yeni starter. Batch metadata altyapısını sadeleştiriyor.
- [Spring Data 2026.0.0](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available): type-safe property path ve Redis/Mongo ergonomisi nedeniyle orta vadede ciddi değer üretebilir.
- [Spring AI ToolCallingAdvisor ve MCP starter'ları](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling): agentic Java uygulamalarında gözlemlenebilir ve compose edilebilir tool execution için bugün en önemli çerçeve yüzeyi.
- [Block monorepo build yaklaşımı](https://engineering.block.xyz/blog/from-polyrepo-fragmentation-to-monorepo-leverage): doğrudan kütüphane değil, ama shared Gradle plugin, dependency graph build scoping ve IntelliJ plugin yaklaşımı büyük JVM organizasyonları için güçlü referans.
- Düşük öncelik: [Hardwood 1.0.0.CR1](https://www.morling.dev/blog/improved-column-reader-api-geospatial-support-hardwood-1-0-0-cr1-available/) Parquet ve geospatial analytics iş yüklerinde ilginç; tipik Spring mikroservis backlog'u için ise bugün ikincil.

Bugün bunların dışında, ortalama bir Spring Boot mikroservis ekibinin önceliğini yukarıdaki kadar değiştiren yeni bir OSS araç sinyali görünmüyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Batch kullanan ve MongoDB standardı olan ekipler, ayrı metadata RDBMS zorunluluğunu yeniden sorgulamalı; ama transaction/replica set önkoşulunu production checklist'e koymadan migration yapmamalı.
- Spring Data kullanan ekipler, feature adoption tartışmasından önce `2025.1.6` veya `2025.0.12` patch floor'una inmiş olmalı. Özellikle Data REST, Mongo annotated query ve property path kullanan yüzeylerde gecikme pahalı.
- Spring Security ve Authorization Server kullanan ekipler, Haziran 9 sürüm tabanını "minor bakım" değil açık güvenlik işi olarak görmeli.
- Spring AI ekipleri, tool invocation ve memory persistence sırasını infrastructure detayı gibi değil ürün davranışı gibi ele almalı.
- JDK roadmap takibini yapan ekipler, yalnız `openjdk.org/projects/jdk/27` gibi landing page'lere güvenmemeli; Inside Java ve Quality Outreach akışlarını engineering watchlist'e bağlamalı.
- Çok sayıda internal Spring servisi olan organizasyonlar, dependency drift'i build optimizasyonu değil release güvenliği problemi olarak ele almalı.

## Fırsatlar ve Riskler

- Fırsat: Batch metadata için MongoDB kullanımı, platform topolojisini sadeleştirebilir ve ekip içi "neden ekstra Postgres var?" sorusunu ortadan kaldırabilir.
- Risk: MongoDB transaction ihtiyacı nedeniyle replica set'siz lokal veya test kurulumları sessizce sorun çıkarabilir.
- Fırsat: Spring Data `2026.0.0`, query yüzeyinde type safety ve Redis/Mongo ergonomisi ile refactor güvenini artırabilir.
- Risk: Data service release'lerindeki 12 CVE, feature adoption beklenirken üretimde açık kalmış patch borcu yaratabilir.
- Fırsat: Spring AI advisor zinciri ve MCP entegrasyonu, şirket içi tool ve policy katmanlarını Spring standardına oturtma fırsatı veriyor.
- Risk: Memory advisor'ı loop içine alıp internal history'yi doğru kapatmayan ekipler duplicate transcript, beklenmeyen context büyümesi ve maliyet artışı yaşayabilir.
- Fırsat: Monorepo veya dependency-graph aware build stratejileri, çok servisli Spring organizasyonlarında toplu migration işlerini dramatik biçimde ucuzlatabilir.
- Risk: JDK 27 izleme yüzeyindeki görünürlük farkı, yanlış "henüz değişen bir şey yok" algısı üretip test penceresini daraltabilir.

## İzlenmesi Gereken Konular

- Spring Boot `4.1.x` hattında Mongo-backed Batch metadata için ek örnekler, dokümantasyon ve production hardening notları gelir mi?
- Spring AI `2.0.x` serisinde advisor ordering, streaming tool loops ve memory persistence etrafında erken düzeltmeler gerekiyor mu?
- Spring Data service release'lerindeki CVE düzeltmeleri, farklı Boot yönetilen dependency hatlarına ne hızla taşınacak?
- Spring Security / Authorization Server tarafında Haziran patch dalgasını izleyen follow-up release'ler yeni davranış değişiklikleri getirir mi?
- Inside Java JDK `27` akışı ile OpenJDK proje sayfası arasındaki görünürlük farkı kapanacak mı, yoksa ekiplerin kalıcı olarak çok kanallı izleme modeline geçmesi mi gerekecek?
- Java ve Go benchmark güncellemesinin companion repo sonuçları, kendi servis profilinizde yeniden üretilebilir mi?

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Batch metadata deposu Spring Boot `4.1` ile SQL bağımlılığından pratikte kurtuluyor
- `source`: [MongoDB-backed Spring Batch jobs and more in Spring Boot 4.1](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch) | [Spring Batch releases](https://github.com/spring-projects/spring-batch/releases)
- `author`: Josh Long | Spring Batch Team
- `date`: 21 Haziran 2026 | 10 Haziran 2026
- `category`: batch, platform-engineering, data-access, migration
- `tags`: spring-batch, spring-boot-4.1, mongodb, jobrepository, autoconfiguration, transactions, replica-set
- `summary`: Yeni `spring-boot-starter-batch-data-mongodb`, Spring Batch metadata'sını MongoDB üzerinde Boot seviyesinde autoconfigure ederek ayrı metadata SQL veritabanı ihtiyacını azaltıyor.
- `why_it_matters`: Batch altyapısındaki en eski örtük varsayımlardan biri kırılıyor; bu, operasyonel topolojiyi ve restart semantics tasarımını etkiliyor.
- `java_spring_relevance`: Spring Batch kullanan Java ekipleri için doğrudan runtime ve deployment davranışı değişiyor.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: Mongo-first ekipler daha az hareketli parça ile batch çalıştırabilir.
- `risks`: Replica set ve transaction önkoşulu gözden kaçarsa batch metadata güvenilirliği düşer.
- `migration_notes`: `spring.batch.data.mongodb.schema.initialize=true`, `BatchJdbcAutoConfiguration` exclusion ve transaction testleri migration checklist'ine eklenmeli.

### Bulgu 2

- `title`: Spring Data `2026.0.0` yenilikleri güçlü, ama gerçek aciliyet service-line patch floor'unda
- `source`: [Spring Data 2026.0.0 generally available](https://spring.io/blog/2026/06/09/spring-data-2026-0-0-generally-available) | [Spring Data 2025.1.6 and 2025.0.12 released](https://spring.io/blog/2026/06/09/spring-data-2025-1-6-and-2025-0-12-released) | [Spring Data project page](https://spring.io/projects/spring-data)
- `author`: Mark Paluch
- `date`: 9 Haziran 2026
- `category`: data-access, security, redis, mongodb, relational, migration
- `tags`: spring-data-2026.0.0, spring-data-2025.1.6, spring-data-2025.0.12, type-safe-property-paths, redis-listener, mongodb-bulkwrite, upsert, cve
- `summary`: `2026.0.0` type-safe property paths ve yeni Redis/Mongo/Relational yetenekleri getirirken, `2025.1.6` ve `2025.0.12` hatları aynı anda 12 CVE kapatıyor.
- `why_it_matters`: Data katmanında feature planı ile security patch planı artık ayrı yönetilmek zorunda.
- `java_spring_relevance`: Spring Data JPA, MongoDB, Redis, REST ve Data Commons kullanan ekiplerin neredeyse tamamı etkileniyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: Type-safe query yüzeyi ve yeni bulk/upsert kabiliyetleri orta vadede bakım maliyetini düşürebilir.
- `risks`: Patch floor ertelenirse SpEL injection, DoS ve query breakout riskleri üretimde açık kalır.
- `migration_notes`: Önce service-line patch'leri alınmalı; `2026.0.0` adoption ise ayrı regression planı ile değerlendirilmelidir.

### Bulgu 3

- `title`: Spring Security `2026.06` ve Authorization Server `1.5.8` kimlik katmanında zorunlu yükseltme penceresi açtı
- `source`: [Spring Security 2026.06 Releases - Contains CVE Fixes](https://spring.io/blog/2026/06/09/spring-security-releases-2026-06) | [Spring Authorization Server 2026.06 Releases - Contains CVE Fixes](https://spring.io/blog/2026/06/09/spring-authorization-server-releases-2026-06) | [Spring Session 2026.06 Releases](https://spring.io/blog/2026/06/09/spring-session-releases-2026-06) | [Spring Security releases](https://github.com/spring-projects/spring-security/releases) | [Spring Authorization Server releases](https://github.com/spring-projects/spring-authorization-server/releases)
- `author`: Josh Cummings | Joe Grandja
- `date`: 9 Haziran 2026
- `category`: security, identity, authn, authz, session-management
- `tags`: spring-security-7.1.0, spring-security-7.0.6, spring-security-6.5.11, spring-authorization-server-1.5.8, saml, open-redirect, x509, session
- `summary`: Security ve Authorization Server release'leri SAML, `request_uri` open redirect, XSS ve X.509 impersonation dahil bir dizi doğrudan üretim riskini kapatıyor.
- `why_it_matters`: Kimlik katmanı açığı, uygulama feature'ından bağımsız olarak en pahalı incident sınıflarından biridir.
- `java_spring_relevance`: SAML, OAuth2/OIDC, Authorization Server ve session tabanlı Spring Security kullanan ekipler doğrudan etkilenir.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: Patch sonrası auth flow test setleri temizlenirse kimlik altyapısının güven seviyesi netleşir.
- `risks`: Eski support line'larda kalmak, OSS dışında kalan fix'lere bağımlı hale getirir.
- `migration_notes`: Authorization Server kullanan ekipler `1.5.8` seviyesini, Security kullanan ekipler ise kendi hattına uygun Haziran 9 patch sürümünü minimum taban yapmalı.

### Bulgu 4

- `title`: Spring AI `2.0` tool loop'unu advisor zincirine taşıyarak agent davranışını gözlemlenebilir hale getiriyor
- `source`: [Tool Calling in Spring AI 2.0: A Composable, Agentic Architecture](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling) | [Spring AI releases](https://github.com/spring-projects/spring-ai/releases) | [Baeldung Java Weekly 651](https://www.baeldung.com/java-weekly-651)
- `author`: Mark Pollack
- `date`: 15 Haziran 2026 | 19 Haziran 2026
- `category`: ai-platform, architecture, developer-productivity, observability
- `tags`: spring-ai-2.0, toolcallingadvisor, advisor-chain, memory, mcp, tool-augmentation, agentic
- `summary`: Tool execution loop artık model implementasyonunda gizli değil; advisor zinciri, memory yerleşimi ve MCP entegrasyonu ile compose edilebilir hale geldi.
- `why_it_matters`: Agent akışını izlemek, sınırlandırmak ve kurumsal policy ile zenginleştirmek artık Spring seviyesinde mümkün.
- `java_spring_relevance`: Spring AI ile üretim agent, tool-calling veya MCP entegrasyonu kuran Java ekipleri için doğrudan mimari etkisi var.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: İç araçlar, audit log ve evaluation katmanları tool transcript üzerinden standartlaştırılabilir.
- `risks`: Advisor sırası ve memory policy yanlış kurgulanırsa maliyet, context şişmesi ve beklenmeyen davranışlar oluşabilir.
- `migration_notes`: 1.x'ten 2.0'a geçen ekipler memory advisor konumunu, internal history davranışını ve tool callback kaydını explicit olarak gözden geçirmeli.

### Bulgu 5

- `title`: JDK `26` için üretim penceresi net, JDK `27` için ise sinyal takibi çok kanallı hale geldi
- `source`: [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26) | [JDK 27 project page](https://openjdk.org/projects/jdk/27/) | [Inside Java JDK 27 tag](https://inside.java/tag/jdk-27/) | [OpenJDK Quality Outreach: JDK 27 Approaches Rampdown](https://inside.java/2026/05/22/quality-heads-up/) | [Inside Java microservice benchmark update](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/)
- `author`: Georges Saab | Inside Java contributors
- `date`: 18 Mart 2026 | 22 Haziran 2026 kontrolüyle güncel görünüm
- `category`: jvm, roadmap, performance, compatibility, operations
- `tags`: jdk26, jdk27, quality-outreach, jep523, jep531, jep533, jep537, jep538, roadmap-visibility
- `summary`: JDK `26` için destek ve cadence tarafı net görünürken, JDK `27` değişim yüzeyini anlamak için proje sayfası tek başına yeterli değil; Inside Java akışı çok daha fazla hedeflenmiş JEP ve compatibility heads-up gösteriyor.
- `why_it_matters`: JVM upgrade planları eksik sinyalle yapılırsa test penceresi daralır ve kırılmalar prod'a yaklaşır.
- `java_spring_relevance`: Spring Boot servisleri sonuçta JDK üzerinde koşuyor; launcher option, JSON thread dump, GC ve concurrency değişimleri framework'ten bağımsız olarak etkiler.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: Erken watchlist kuran ekipler JDK `27` geçişini daha ucuz regression maliyetiyle yönetebilir.
- `risks`: Tek landing page'e güvenmek, yaklaşan davranış değişikliklerini gözden kaçırabilir.
- `migration_notes`: JDK watchlist'inize `inside.java/tag/jdk-27`, Quality Outreach notları ve ilgili JEP duyuruları eklenmeli; yalnız `openjdk.org/projects/jdk/27` izlenmemeli.

### Bulgu 6

- `title`: Büyük JVM organizasyonlarında dependency drift artık platform mimarisi problemi
- `source`: [From Polyrepo Fragmentation to Monorepo Leverage](https://engineering.block.xyz/blog/from-polyrepo-fragmentation-to-monorepo-leverage) | [InfoQ summary of the Block migration](https://www.infoq.com/news/2026/06/block-450-jvm-monorepo-migration/)
- `author`: Yissachar Radcliffe | Leela Kumili
- `date`: 10 Mart 2026 | 19 Haziran 2026
- `category`: platform-engineering, build, ci-cd, dependency-management
- `tags`: monorepo, gradle, dependency-drift, merge-queue, intellij-plugin, selective-ci, jvm-estate
- `summary`: Block, yaklaşık 450 JVM repository'yi tek monorepo'ya taşıyarak dependency drift, diamond dependency ve cross-repo change maliyetini azaltmış; sistem haftada yaklaşık 8.800 build ve yaklaşık 10 dakikalık p90 CI ile çalışıyor.
- `why_it_matters`: Çok servisli Java organizasyonlarında versiyon sapması ve ortak upgrade maliyeti artık salt repo düzeni tercihi değil, teslimat güvenliği problemi.
- `java_spring_relevance`: Birden fazla Spring servis, ortak kütüphane ve internal BOM yöneten ekipler aynı sınıf sorunu yaşıyor.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: Shared Gradle plugin, dependency-graph build scoping ve merge queue yaklaşımı iç platform roadmap'ine çevrilebilir.
- `risks`: Körlemesine monorepo geçişi, tooling ve quality gate yatırımı olmadan yeni darboğazlar üretir.
- `migration_notes`: Monorepo kararı zorunlu değil; ama dependency graph görünürlüğü, ortak build convention'ları ve cross-service atomic change kabiliyeti bir şekilde sağlanmalı.

## Sonuç

Bugünün en güçlü sinyali, Spring ve JVM ekosisteminin örtük varsayımları açık kontrol yüzeylerine dönüştürmesi oldu. Spring Batch metadata deposunun explicit hale gelmesi, Spring AI tool loop'unun advisor zincirine çıkması, Spring Data'da feature-train ile patch-floor'un ayrışması ve JDK `27` yol haritası için çok kanallı izleme ihtiyacı aynı şeyi söylüyor: üretim olgunluğu artık daha az "framework magic", daha çok görünür karar noktası istiyor.

Senior Java / Spring ekipleri için pratik öncelik sırası şu olmalı: önce Haziran 9 patch-floor'unu alın, sonra Batch metadata topolojinizi ve Spring AI tool policy'nizi yeniden düşünün, paralelde de JDK watchlist'inizi landing page bağımlılığından çıkarın. Yeni feature'ların değeri var; ama bugünün asıl kazancı, davranışı daha açık ve yönetilebilir hale getiren yüzeylerde.
