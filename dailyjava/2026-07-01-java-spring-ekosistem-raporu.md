# Günlük Java / Spring Ekosistem Raporu

Tarih: 1 Temmuz 2026  
Tarama zamanı: 1 Temmuz 2026 09:06 TSİ  
Odak: son açık kaynak bakım hattından çıkış planı, eski hatlara geri taşınan correctness düzeltmeleri, üretim odaklı Spring AI entegrasyonları ve mevcut Oracle Java çalışma zamanı zemini

Tarama notu: Resmi [Spring Blog](https://spring.io/blog), [Spring proje sayfaları](https://spring.io/projects), [Spring Security advisories](https://spring.io/security), ilgili Spring GitHub release yüzeyleri, [OpenJDK JDK 27 sayfası](https://openjdk.org/projects/jdk/27/), [JEP 527](https://openjdk.org/jeps/527), [Inside Java](https://inside.java/), [dev.java News](https://dev.java/news/), [Oracle Java resmi sürüm API'leri](https://java.oraclecloud.com/currentJavaReleases), [Oracle Java Blog](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java), [InfoQ Java](https://www.infoq.com/java/news/), [Baeldung Java Weekly](https://www.baeldung.com/java-weekly-652), [Josh Long'un haftalık yazısı](https://spring.io/blog/2026/06/30/this-week-in-spring-june-30-2026), [Gunnar Morling feed'i](https://www.morling.dev/index.xml) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/feed/) tarandı. Bugün yeni ve yüksek etkili sinyal daha çok Spring bakım/upgrade sınırları ile JVM runtime tabanında geldi; Gunnar Morling tarafında son güçlü sinyal hâlâ Hardwood `1.0`, Burak KUTBAY blogunda ise bugün karar yüzeyini değiştiren yeni bir Java/Spring yazısı görünmüyor.

## Öne Çıkan Başlıklar

- [Spring Boot `3.5.16`](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now) artık `3.5.x` hattının son OSS sürümü; [Spring Data `2025.0.13`](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released) de `3.5.x` neslinin son açık kaynak servisi olarak konumlandı. Bu, Boot `3.5` üstünde kalan ekipler için "bir sonraki patch'i bekleriz" rahatlığının bittiği anlamına geliyor.
- [Spring Integration `6.5.10`](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10), eski hatta bile lock registry, SOAP gateway, JMS DSL ve dosya işleme correctness düzeltmeleri taşıyor. Mesaj açık: bakım hattında kalmak artık sadece CVE almak değil, sessiz doğruluk yamalarını da zamanında yakalamak demek.
- [Microsoft'un Spring AI 2.0 + Azure Cosmos DB yazısı](https://devblogs.microsoft.com/cosmosdb/spring-ai-2-0-is-ga-vector-search-memory-and-agents-on-azure-cosmos-db/) Spring AI ekosisteminin demo connector seviyesinden vendor-owned, production-grade modül seviyesine geçtiğini gösteriyor.
- Oracle'ın resmi update kanalları 1 Temmuz 2026 itibarıyla güncel güvenlik tabanını net gösteriyor: `25.0.3`, `21.0.11`, `17.0.19`, `26.0.1`. JDK `27` hâlâ izleme hattı; bugünün pratik kararı desteklenen runtime'larda kalmak ve benchmark'ı burada yapmak.

## Kritik Güncellemeler

### 1. Boot `3.5.x` ve Data `3.5.x` için son açık kaynak çıkış penceresi kapandı

[Spring Boot `3.5.16`](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now) duyurusunda bu sürümün `3.5.x` neslinin son OSS sürümü olduğu açıkça yazıyor. [Spring Data `2025.0.13`](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released) da `3.5.x` çizgisi için son açık kaynak servis release'i olarak tanımlanıyor. Aynı anda [Spring proje sayfaları](https://spring.io/projects) ön yüzde Boot `4.1.0`, Framework `7.0.8` ve Data `2026.0.0` çizgisini gösteriyor.

Bu üç veri birlikte okunduğunda anlam şu: Boot `3.5` üstünde kalmak artık "stabil ama destekli" durumda kalmak değil; "son sorumlu patch'i alıp yükseltme planını başlatmak" durumuna girmek demek. Özellikle platform ekipleri için bu, 2026 yaz backlog'unda `4.0.x` veya `4.1.x` geçişini opsiyon değil program haline getiriyor.

### 2. Spring Integration `6.5.10`, bakım hattında bile incident önleyen düzeltmeler geldiğini gösterdi

[Spring Integration `6.5.10` release notları](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10), eski hat için gelen yamanın kozmetik olmadığını gösteriyor. Çarpan maddeler:

- `JdbcLockRegistry` ve `RedisLockRegistry` tarafında bucket çakışması yüzünden `APP_LOCK` kaydının silinmemesi
- elde tutulan lock'ların ZooKeeper registry'den yanlış eviction alması
- `AbstractWebServiceInboundGateway` tarafında istemciye daha güvenli generic hata dönülmesi
- Java DSL ile inbound JMS kanal adı verildiğinde startup kırılması
- `FileReadingMessageSource` için canonical file davranışının düzeltilmesi

Bu tür düzeltmeler genellikle changelog'da küçük görünür ama üretimde lock sızıntısı, stuck flow, yanlış hata yüzeyi ve dosya akışı bozulması olarak çıkar. Üstelik [Boot `3.5.16` release notları](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.16) bu sürümün `Spring Integration 6.5.10` yükseltmesini taşıdığını gösteriyor; yani bakım hattında kalan ekipler için bile regression testi ciddiye alınmalı.

### 3. Spring AI `2.0`, vendor-maintained veri/agent modülleriyle daha kurumsal bir şekle giriyor

[Spring AI `2.0.0` GA duyurusu](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now), bazı entegrasyonların artık ilgili vendor'lar tarafından doğrudan bakım aldığını açık yazıyor; örnek olarak Azure Cosmos DB modülleri belirtilmiş. Bunu [Theo van Kraay'ın 29 Haziran 2026 tarihli Microsoft yazısı](https://devblogs.microsoft.com/cosmosdb/spring-ai-2-0-is-ga-vector-search-memory-and-agents-on-azure-cosmos-db/) somutlaştırıyor:

- `com.azure.spring.ai` altında ayrı release cadence
- vektör arama için DiskANN tabanlı store
- `ChatMemoryRepository` için kalıcı chat memory
- `DefaultAzureCredential` ile secret'sız varsayılan kimlik akışı
- Spring Boot `4.1+`, Spring AI `2.0+`, Java `21+` tabanı

Bu hype değil; özellikle RAG, chat memory ve agent orchestration kuran Java ekipleri için "ikinci bir veri katmanı mı açalım, yoksa mevcut platform veritabanı üstünde mi yürüyelim?" sorusuna daha üretim odaklı bir yanıt getiriyor.

### 4. Oracle resmi update kanalı, bugünün gerçek runtime tabanını gösteriyor

[Oracle `currentJavaReleases` API'si](https://java.oraclecloud.com/currentJavaReleases) ve [Java versions API'si](https://java.oraclecloud.com/javaVersions), 1 Temmuz 2026 itibarıyla destekli sürümleri ve güncel patch seviyelerini net veriyor:

- `25.0.3` LTS, destekli
- `21.0.11` LTS, destekli
- `17.0.19` LTS, destekli
- `26.0.1` feature release, destekli, destek sonu `17 Eylül 2026`

Bu yüzden bugünün Java kararı, JDK `27` preview etrafında heyecan üretmekten çok, hangi servislerin `17`/`21`/`25` üzerinde kaldığını ve hangilerinin `26` benchmark penceresine alınacağını netleştirmek olmalı. [OpenJDK JDK 27 sayfası](https://openjdk.org/projects/jdk/27/) ile [JEP 527](https://openjdk.org/jeps/527) hâlâ izlenmeli, ancak üretim tabanı olarak değil, erken hazırlık hattı olarak.

## Trendler ve Sinyaller

### Trend Kümesi 1: "Patch alırız" dönemi bitiyor, "yükseltme programı" dönemi başlıyor

Tekrarlayan sinyal:

- [Spring Boot `3.5.16`](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now) son OSS `3.5.x`
- [Spring Data `2025.0.13`](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released) son OSS `3.5.x`
- [Josh Long'un 30 Haziran notu](https://spring.io/blog/2026/06/30/this-week-in-spring-june-30-2026) artifact-first patch alma disiplinini tekrar vurguluyor

Çıkarım:

- Kısa vadeli gürültü, tek bir CVE başlığından ibaret.
- Kalıcı mühendislik değeri, support-line kapanışını sprint planına çevirmek.

### Trend Kümesi 2: Bakım hattında kalmak, shallow smoke test ile yönetilemeyecek kadar pahalılaşıyor

Tekrarlayan sinyal:

- [Spring Integration `6.5.10`](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10) correctness backport'ları
- [Spring Boot `3.5.16`](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.16) dependency pickup

Çıkarım:

- "Eski hatta kaldık ama değişen bir şey yok" varsayımı yanlış.
- Özellikle lock registry, file flow, SOAP/JMS girişleri ve protocol bridge'ler için targeted regression şart.

### Trend Kümesi 3: Spring AI ekosistemi deneysel adapter'dan vendor-owned modüle kayıyor

Tekrarlayan sinyal:

- [Spring AI `2.0.0` GA](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now) içindeki externally-maintained module yaklaşımı
- [Microsoft Azure Cosmos DB entegrasyonu](https://devblogs.microsoft.com/cosmosdb/spring-ai-2-0-is-ga-vector-search-memory-and-agents-on-azure-cosmos-db/)
- [Josh Long'un haftalık özeti](https://spring.io/blog/2026/06/30/this-week-in-spring-june-30-2026)

Çıkarım:

- Kısa vadeli hype, "multi-agent demo" kısmında.
- Kalıcı değer, veri katmanı, memory ve kimlik akışının vendor tarafından sahiplenilmesinde.

### Trend Kümesi 4: JVM anlatısı yeni syntax'tan çok runtime olgunluğuna dönüyor

Tekrarlayan sinyal:

- [Inside Java'da ZGC'nin on yılı](https://inside.java/2026/06/30/zgc-performance-decade/)
- [dev.java News](https://dev.java/news/) ana sayfasında aynı ZGC vurgusu
- [Oracle resmi sürüm API'leri](https://java.oraclecloud.com/currentJavaReleases)

Çıkarım:

- Bugünün yüksek değerli Java sorusu "JDK 27'de hangi preview var?" değil.
- Daha doğru soru: "Düşük gecikme, hızlı warmup, daha iyi gözlemlenebilirlik için hangi servis hangi destekli JDK hattına taşınmalı?"

## Araçlar ve Kütüphaneler

- [Spring Integration `6.5.10`](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10): lock registry, inbound gateway ve dosya akışlarında sessiz ama prod etkili düzeltmeler nedeniyle doğrudan takip edilmeli.
- [Azure Cosmos DB için Spring AI modülleri](https://devblogs.microsoft.com/cosmosdb/spring-ai-2-0-is-ga-vector-search-memory-and-agents-on-azure-cosmos-db/): `VectorStore` ve `ChatMemoryRepository` kullanımını daha az glue code ile kurumsal çizgiye çekiyor.
- [Oracle Java Releases API](https://java.oraclecloud.com/currentJavaReleases): platform ekibi veya build altyapısı için sürüm/policy otomasyonu üretmekte kullanılabilecek düşük gürültülü bir resmi kaynak.
- Bugün yeni ve yüksek öncelikli bir test/observability kütüphanesi sinyali zayıf. Güçlü sinyal daha çok platform hattı, runtime ve AI entegrasyon mimarisinde.

## Java / Spring Geliştiricileri İçin Etkiler

- Boot `3.5` veya Spring Data `3.5` hattındaysanız artık "desteklenen stabil hat" konforunda değilsiniz. Yükseltme backlog'unu tarihlendirmeniz gerekiyor.
- Spring Integration kullanan servislerde yalnız message flow smoke testi yetmez; lock, retry, timeout, gateway hata yayılımı ve dosya sistemi davranışı için odaklı regresyon paketi gerekli.
- Spring AI kullanan ekiplerde yeni soru model sağlayıcıdan çok entegrasyon sahipliği olmalı: vector store, memory ve auth kimde, nasıl güncellenecek, kim release edecek?
- JVM tarafında benchmark tartışmasını preview özelliklerden çok güncel patch seviyesi ve GC seçimi üstüne çekmek daha doğru. Düşük gecikme ihtiyacı olan servislerde ZGC yeniden masaya alınmalı.
- Oracle update API'leri nedeniyle "hangi JDK sürümü güncel?" sorusu artık manuel takip edilmek zorunda değil; bunu CI veya platform dashboard'una koymak mümkün.

## Fırsatlar ve Riskler

- Fırsat: Boot `4.0/4.1` geçişini merkezi program haline getirip parça parça yangın söndürmek yerine planlı modernizasyon yapılabilir.
- Risk: `3.5.x` üstünde kalıp yalnız CVE bekleyen ekipler, correctness ve support riski biriktirir.
- Fırsat: Spring AI'da vendor-maintained modüller, kurumsal sahiplik ve support beklentisini netleştirir.
- Risk: Tek veritabanında hem operational hem vector workload koşturmak, kapasite ve maliyet modellemesi yapılmadan uygulanırsa geri tepebilir.
- Fırsat: Oracle resmi release API'leri sürüm uyumluluğu ve lifecycle görünürlüğünü otomasyona taşır.
- Risk: ZGC veya JDK `26` gibi runtime hamleleri ölçüm yapılmadan "genel iyidir" diye açılırsa bazı iş yüklerinde gereksiz komplekslik doğurabilir.

## İzlenmesi Gereken Konular

- Spring tarafında `3.5.x` ve `2025.0.x` sonrası follow-up migration rehberleri geliyor mu?
- Spring Integration `6.5.x` hattında yeni backport'lar devam edecek mi, yoksa `7.x` çizgisine baskı mı artacak?
- Spring AI için Azure dışındaki vendor-owned modüller benzer hızla görünür hale gelecek mi?
- Oracle'ın bir sonraki resmi CPU penceresinde `17/21/25/26` hatları nasıl güncellenecek ve kurum içi baz sürümler buna göre nasıl ayarlanacak?
- ZGC ve diğer runtime iyileştirmeleri gerçek Spring Boot servislerinde latency/throughput bazında ölçülüyor mu, yoksa hâlâ varsayımla mı karar veriliyor?

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Boot `3.5.16` ve Spring Data `2025.0.13`, eski nesil için son açık kaynak patch tabanını ilan ediyor
- `source`: [Spring Boot `3.5.16` duyurusu](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now) | [Spring Data `2025.0.13` duyurusu](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released) | [Spring proje sayfaları](https://spring.io/projects)
- `author`: Andy Wilkinson | Mark Paluch
- `date`: 24-25 Haziran 2026
- `category`: platform, maintenance, support-policy, migration
- `tags`: spring-boot-3.5.16, spring-data-2025.0.13, last-oss, support-line, boot-4.1, data-2026.0.0
- `summary`: Boot `3.5.x` ve Data `3.5.x` çizgisi artık son OSS patch seviyesini gördü; ön yüzde aktif taban Boot `4.1` ve Data `2026.0.0`.
- `why_it_matters`: Bu artık sadece sürüm bilgisi değil; sonraki açık kaynak güvenli zemin için yükseltme gerektiğini söyleyen lifecycle sinyali.
- `java_spring_relevance`: Spring Boot tabanlı mikroservisler, starter envanteri ve veri erişim katmanı bu karardan doğrudan etkilenir.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: upgrade programını tek dalga halinde planlamak, support dışı kalan bağımlılıkları erken temizlemek
- `risks`: eski hatta takılı kalmak, yeni patch ve correctness düzeltmelerini kaçırmak, enterprise destek kararı vermeden uzatmak
- `migration_notes`: Boot `3.5` kullanan ekipler `4.0.x` veya `4.1.x` için uygulama, starter ve test matrisi çıkararak tarihli geçiş planı başlatmalı.

### Bulgu 2

- `title`: Spring Integration `6.5.10`, bakım hattında bile distributed lock ve gateway correctness risklerini kapatıyor
- `source`: [Spring Integration `v6.5.10` release notları](https://github.com/spring-projects/spring-integration/releases/tag/v6.5.10) | [Spring Boot `v3.5.16` release notları](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.16)
- `author`: Spring Integration team
- `date`: 30 Haziran 2026
- `category`: integration, messaging, operations, correctness
- `tags`: spring-integration, jdbc-lock-registry, redis-lock-registry, zookeeper, soap-gateway, jms-dsl, file-reading
- `summary`: `6.5.10`, lock bucket çakışması, lock eviction, SOAP hata yayılımı, JMS DSL startup ve canonical file işleme gibi doğrudan üretim davranışı etkileyen bugfix'ler getiriyor.
- `why_it_matters`: Bu düzeltmeler yokken sistemler çalışıyor gibi görünebilir ama yük altında stuck lock, yanlış hata yüzeyi veya beklenmeyen dosya akışı bozulmaları üretebilir.
- `java_spring_relevance`: Spring Integration ile job orchestration, file ingestion, SOAP bridge, JMS ve distributed coordination kullanan ekipler için doğrudan etkili.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: bakım hattında bile incident olasılığını düşürmek, legacy entegrasyon akışlarını daha güvenilir hale getirmek
- `risks`: mevcut workaround'ların görünür hale gelmesi, hedeflenmemiş smoke test ile davranış farkının kaçırılması
- `migration_notes`: lock registry, file polling, inbound gateway ve JMS DSL kullanan akışlar için targeted regression testi açılmalı; sadece unit test yeterli değil.

### Bulgu 3

- `title`: Spring AI `2.0` ekosistemi, vendor-maintained data ve memory modülleriyle üretim çizgisine yaklaşıyor
- `source`: [Spring AI `2.0.0` GA duyurusu](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now) | [Spring AI 2.0 is GA: Vector Search, Memory, and Agents on Azure Cosmos DB](https://devblogs.microsoft.com/cosmosdb/spring-ai-2-0-is-ga-vector-search-memory-and-agents-on-azure-cosmos-db/) | [This Week in Spring - June 30th, 2026](https://spring.io/blog/2026/06/30/this-week-in-spring-june-30-2026)
- `author`: Christian Tzolov | Theo van Kraay | Josh Long
- `date`: 12 Haziran 2026 / 29 Haziran 2026 / 30 Haziran 2026
- `category`: ai-platform, cloud-data, developer-productivity, architecture
- `tags`: spring-ai-2.0, azure-cosmos-db, vector-store, chat-memory, diskann, boot-4.1, java21
- `summary`: Spring AI `2.0`, bazı entegrasyonları doğrudan vendor bakımına açtı; Azure Cosmos DB modülleri bunun ilk somut, production-grade örneklerinden biri oldu.
- `why_it_matters`: AI uygulamalarında en pahalı borç genelde prompt değil; memory, vector store, auth ve lifecycle sahipliğidir.
- `java_spring_relevance`: Spring AI ile RAG, tool-calling, persistent memory veya multi-agent akışları kuran Java ekipleri için mimari karar yüzeyi oluşturur.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: daha az custom adapter kodu, daha net support sınırı, mevcut veri platformu üstünde AI özelliği geliştirme
- `risks`: provider ve veri katmanı bağımlılığının derinleşmesi, kapasite/maliyet modellemesi yapılmadan aynı veritabanına fazla rol yüklenmesi
- `migration_notes`: Spring AI pilotlarında connector seçimi yapılırken "kim release ediyor, kim support ediyor, kim credential modelini taşıyor?" sorusu artık ilk karar maddesi olmalı.

### Bulgu 4

- `title`: Oracle resmi release kanalı, 1 Temmuz 2026 için güncel güvenlik zeminini açık biçimde veriyor
- `source`: [Oracle `currentJavaReleases` API](https://java.oraclecloud.com/currentJavaReleases) | [Oracle `javaVersions` API](https://java.oraclecloud.com/javaVersions)
- `author`: Oracle Java update channels
- `date`: 1 Temmuz 2026 itibarıyla
- `category`: runtime, support-policy, platform-engineering, upgrade-governance
- `tags`: oracle-java, currentjavareleases, java-25.0.3, java-21.0.11, java-17.0.19, java-26.0.1, lifecycle
- `summary`: Oracle resmi kanalında `25.0.3`, `21.0.11`, `17.0.19` ve `26.0.1` güncel ve destekli olarak görünüyor; `26` için destek sonu da net biçimde yayınlanıyor.
- `why_it_matters`: JDK kararı söylenti veya wiki değil, resmi lifecycle verisiyle yönetilebilir hale geliyor.
- `java_spring_relevance`: Spring servisleri, CI ajanları, container base image'leri ve platform standardizasyonu için doğrudan kullanım değeri taşır.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: otomatik lifecycle görünürlüğü, JDK drift tespiti, kurum içi runtime standardını daha objektif yönetmek
- `risks`: eski ama çalışan JDK'ların güvenli sanılması, unsupported feature release'lerin görünmeden birikmesi
- `migration_notes`: build pipeline veya platform dashboard'unda resmi API tüketilerek servis bazında JDK sürüm envanteri ve support durumu görünür kılınmalı.

### Bulgu 5

- `title`: ZGC, resmi Java anlatısında artık niş bir GC değil, olgun üretim runtime seçeneği olarak konumlanıyor
- `source`: [ZGC: A Decade of Redefining Java Performance](https://inside.java/2026/06/30/zgc-performance-decade/) | [dev.java News](https://dev.java/news/)
- `author`: Stefan Johansson (alum)
- `date`: 30 Haziran 2026
- `category`: jvm, gc, performance, runtime
- `tags`: zgc, latency, production-runtime, jdk25, low-pause, performance
- `summary`: Inside Java ve dev.java ana sayfası, ZGC'yi deneysel bir kolektör gibi değil, dünya çapında kritik servisleri taşıyan olgun bir runtime seçeneği olarak çerçeveliyor.
- `why_it_matters`: JVM performans tartışması yeniden gerçek operasyon metriklerine, özellikle düşük pause ve yanıt süresi kararlılığına dönüyor.
- `java_spring_relevance`: yüksek eşzamanlılık, websocket, API gateway, event tüketici ve düşük gecikme hedefi olan Spring Boot servislerinde doğrudan deney alanı açar.
- `actionability`: `izlemelik`
- `impact_level`: `orta-yüksek`
- `opportunities`: latency hedefli servislerde GC seçimini daha bilinçli yapmak, JDK yükseltmesini performans yatırımı olarak görmek
- `risks`: ZGC'yi her iş yükünde otomatik kazanım sanmak, heap/CPU maliyetini ölçmeden genellemek
- `migration_notes`: ZGC değerlendirmesi yalnız sintetik benchmark ile değil; gerçek trafik profili, heap davranışı ve tail latency metriğiyle yapılmalı.

## Sonuç

1 Temmuz 2026 radarının ana mesajı yeni bir framework özelliğinden çok, karar penceresinin daralması. Spring Boot `3.5.x` ve Spring Data `3.5.x` için açık kaynak güvenli zemin kapanmış durumda; Spring Integration `6.5.10` ise eski hatlarda bile correctness borcunun yaşamaya devam ettiğini gösteriyor. AI tarafında gerçek değer artık "ajan demosu" değil, vendor-owned veri ve memory modülleriyle kurumsal sahiplik modelinin netleşmesi. JVM tarafında da bugünün üretim odaklı kararı JDK `27` heyecanı değil, `17/21/25/26` tabanında net sürüm, GC ve benchmark disiplini kurmak.
