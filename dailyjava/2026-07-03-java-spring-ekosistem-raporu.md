# Günlük Java / Spring Ekosistem Raporu

Tarih: 3 Temmuz 2026  
Tarama zamanı: 3 Temmuz 2026 09:04 TSİ  
Odak: resmi Spring release yüzeyi sakin kalırken Spring AI tarafında MCP ve tool-control-plane olgunlaşması, MCP Java SDK `2.0` migrasyon maliyeti ve HotSpot tarafında SIMD/vectorization performans hattının görünürleşmesi

Tarama notu: Resmi [Spring Blog](https://spring.io/blog.atom), [Spring Security advisories feed](https://spring.io/security.atom), ilgili [Spring AI `2.0.0` GA duyurusu](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now) ve Spring GitHub release yüzeyleri, [MCP Java SDK `2.0.0` release notu](https://github.com/modelcontextprotocol/java-sdk/releases/tag/v2.0.0), [MCP Java SDK `2.0` migration guide](https://github.com/modelcontextprotocol/java-sdk/blob/v2.0.0/MIGRATION-2.0.md), [OpenJDK JDK 27 EA sayfası](https://jdk.java.net/27/), [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases), [Inside Java](https://inside.java/feed.xml), [dev.java/news](https://dev.java/news/), [InfoQ Java](https://www.infoq.com/java/news/), [Josh Long’un 2 Temmuz 2026 tarihli podcast duyurusu](https://spring.io/blog/2026/07/02/a-bootiful-podcast-sebastien-deleuze), [Gunnar Morling feed’i](https://www.morling.dev/index.xml), [Burak KUTBAY blog feed’i](https://blog.burakkutbay.com/feed/) ve ilgili GitHub release sayfaları tarandı. 3 Temmuz 2026 itibarıyla Spring security feed’inde 12 Haziran 2026’dan daha yeni bir advisory görünmüyor. [Oracle Java Blog](https://blogs.oracle.com/java/) ve [Baeldung Java Weekly](https://www.baeldung.com/java-weekly) doğrudan erişimde `403` verdiği için bugünkü raporda erişilebilen resmi Oracle güncelleme kanalları ve açık secondary kaynaklar kullanıldı. Gunnar Morling tarafında en yeni yüksek sinyal hâlâ Hardwood `1.0`; Burak KUTBAY tarafında ise bugün Java/Spring karar yüzeyini değiştiren yeni bir yazı görünmüyor.

## Öne Çıkan Başlıklar

- Bugünün en önemli resmi Spring sinyali yeni bir CVE veya patch dalgası değil; Spring AI `2.0` ile MCP entegrasyonunun tool, transport, security ve observability katmanına kadar inmesi.
- [Spring AI `2.0.0` GA](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now), `ToolSearchToolCallingAdvisor`, `mcp-annotations`, `Streamable HTTP` default’u ve Spring tabanlı OAuth `2.0` / API-key güvenliği ile AI entegrasyonunu demo seviyesinden operasyonel kontrat seviyesine taşıyor.
- [MCP Java SDK `2.0.0`](https://github.com/modelcontextprotocol/java-sdk/releases/tag/v2.0.0) ve [migration guide](https://github.com/modelcontextprotocol/java-sdk/blob/v2.0.0/MIGRATION-2.0.md), bu geçişin yalnız özellik değil gerçek bir migrasyon işi olduğunu gösteriyor: zorunlu alan enforcement, JSON Schema `2020-12` validasyonu, `Tool.inputSchema` tip değişimi ve SSE’den `Streamable HTTP`’ye kayış doğrudan kod etkisi üretiyor.
- JVM tarafında [Inside Java’nın 2 Temmuz 2026 tarihli SIMD yazısı](https://inside.java/2026/07/02/simd-vectors-hotspot-jvm/), JDK `26` ile auto-vectorization ve Vector API’nin artık daha somut benchmark adayı olduğunu gösteriyor.
- [JDK `27` EA build `29`](https://jdk.java.net/27/) 2 Temmuz 2026’da yayınlandı; buna karşılık [Oracle’ın destekli tabanı](https://java.oraclecloud.com/currentJavaReleases) 3 Temmuz 2026 itibarıyla hâlâ `25.0.3`, `21.0.11`, `17.0.19` ve `26.0.1`. Yani deney hattı ile prod hattını ayrı tutma disiplini hâlâ geçerli.

## Kritik Güncellemeler

### 1. Spring AI `2.0`, AI entegrasyonunu prompt katmanından protokol katmanına taşıyor

[Spring AI `2.0.0` GA duyurusu](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now), yalnız model adaptörü ekleyen bir sürüm değil. Dünkü structured-output ekseninden farklı olarak bugünün daha kalıcı sinyali, AI entegrasyonunun artık tool discovery, protocol negotiation ve operability üzerinden okunması gerektiği.

Öne çıkan teknik başlıklar:

- Spring AI `2.0`, Spring Boot `4.0` / `4.1` ve Spring Framework `7.0` baseline’ını hedefliyor.
- Kod tabanı `JSpecify` ile nullability açısından daha net hale geliyor.
- `ToolSearchToolCallingAdvisor`, yüzlerce tool’u her istekte modele yüklemek yerine session başına indeksleyip gerektiğinde kademeli açıyor.
- `mcp-annotations`, MCP server yazmayı normal Spring geliştirme biçimine yaklaştırıyor.
- WebMVC ve WebFlux transport’ları Spring AI tarafına taşınıyor; `Streamable HTTP`, deprecated SSE transport’un yerini alıyor.
- MCP entegrasyonu Micrometer span’leri, OpenTelemetry uyumlu metrikler ve `mcp-security` üzerinden OAuth `2.0` / API-key güvenliği ile geliyor.

Bu, özellikle iç tool platformu, geliştirici asistanı, arka plan operasyon ajanı veya kurumsal knowledge/tool surface inşa eden Spring ekipleri için büyük fark. Artık soru “LLM çağrısını nasıl yaparım?” değil; “tool’ları nasıl discover ederim, nasıl yetkilendiririm, nasıl izlerim, nasıl remote ölçeklerim?” sorusu.

### 2. MCP Java SDK `2.0`, gizli protokol gevşekliklerini build-time ve runtime hatasına çeviriyor

[MCP Java SDK `2.0.0` release notu](https://github.com/modelcontextprotocol/java-sdk/releases/tag/v2.0.0) ve [migration guide](https://github.com/modelcontextprotocol/java-sdk/blob/v2.0.0/MIGRATION-2.0.md), Spring AI ile gelen MCP katmanının “güzel yeni API” olmaktan çok “sertleşmiş protokol sözleşmesi” olduğunu netleştiriyor.

Özellikle dikkat çeken değişiklikler:

- MCP spec’te zorunlu olan alanlar artık object construction anında non-null / non-empty enforce ediliyor.
- `Tool.inputSchema`, dar bir `JsonSchema` tipi yerine `Map<String, Object>` tabanına geçiyor; bu, dialect-specific keyword’leri koruyor ama mevcut kodu kırabiliyor.
- Gömülü schema’lar varsayılan olarak JSON Schema `2020-12` meta-schema’sına göre validate ediliyor; hatalı schema hem `build()` sırasında hem `addTool()` sırasında fail edebiliyor.
- `validateToolInputs(true)` default olduğu için tool argümanları artık input schema’ya göre doğrulanıyor.
- `protocolVersions()` artık yalnız `2024-11-05` değil, SDK’nın bildiği dört sürümü birden advertise ediyor: `2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`.
- HTTP+SSE transport deprecated; yön `Streamable HTTP`.

Bu değişiklikler, özellikle custom MCP server/client yazan Java ekiplerinde geçiş maliyetini küçümsememek gerektiğini gösteriyor. Dün konuştuğumuz typed structured output güvenilirliği model cevabına bakıyordu; bugünkü daha altyapısal gerçek ise tool protokolünün kendisinin artık gevşek davranmayacağı.

### 3. Spring release/advisory yüzeyi sakin; değer şimdi migration backlog’unda

[Spring Blog feed’i](https://spring.io/blog.atom) ve [Spring Security feed’i](https://spring.io/security.atom) 3 Temmuz 2026 sabahı tekrar kontrol edildi. Son resmi Spring Blog girişi 2 Temmuz 2026 tarihli [Josh Long / Sébastien Deleuze podcast duyurusu](https://spring.io/blog/2026/07/02/a-bootiful-podcast-sebastien-deleuze); security feed’de en yeni kayıt ise 12 Haziran 2026 tarihli [Spring AI vector store advisory](https://spring.io/security/cve-2026-47835).

Bu, “yeni yangın yok” anlamına geliyor; ama “iş yok” anlamına gelmiyor. Tam tersi:

- MCP / Spring AI `2.0` göçleri için test backlog’u açmak,
- transport geçişlerini netleştirmek,
- tool schema kalitesini artırmak,
- auth/observability entegrasyonunu ilk sınıf backlog yapmak

bugün yeni release kovalamaktan daha yüksek getirili.

### 4. JDK `26` performans anlatısı daha düşük seviyeli CPU verimliliğine kayıyor

[Inside Java’daki SIMD yazısı](https://inside.java/2026/07/02/simd-vectors-hotspot-jvm/) ve [dev.java/news özeti](https://dev.java/news/) birlikte okunduğunda, resmi Java tarafının son günlerdeki performans anlatısı artık yalnız GC veya startup üzerinde değil; doğrudan auto-vectorization, Vector API, `MemorySegment`, alignment ve branch davranışı üzerine yoğunlaşıyor.

Öne çıkan mesajlar:

- JDK `26` ile gelen iyileştirmeler gerçek dünyada CPU vector instruction’larını daha iyi kullanmayı hedefliyor.
- Auto-vectorization belirli loop şekillerinde faydalı; fill, copy, map ve reduce gibi örnekler özellikle öne çıkıyor.
- Auto-vectorization yetmediğinde Vector API hâlâ doğrudan araç olarak kalıyor.
- `MemorySegment`, aliasing, alignment, gather/scatter ve branch misprediction gibi detaylar artık Java geliştiricisinin görmezden gelemeyeceği performans değişkenleri.

Bu her CRUD servisi için kritik değil. Ama veri işleme, scoring, sıkıştırma, görüntü/medya işleme, columnar analytics, crypto veya LLM/RAG çevresi embedding-postprocess işlerinde Java’nın “CPU’ya yakın” tarafı yeniden önem kazanıyor.

## Trendler ve Sinyaller

### Trend Kümesi 1: AI katmanı prompt’tan protokol ve kontrol düzlemine kayıyor

Tekrarlayan sinyal:

- [Spring AI `2.0` GA](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now)
- [MCP Java SDK `2.0.0`](https://github.com/modelcontextprotocol/java-sdk/releases/tag/v2.0.0)
- [LangChain4j `1.17.0`](https://github.com/langchain4j/langchain4j/releases/tag/1.17.0)

Çıkarım:

- Kısa vadeli hype, “agent” terminolojisinde.
- Kalıcı mühendislik değeri ise tool discovery, compensating action, chat memory ownership, schema validation, protocol versioning ve auth/observability entegrasyonunda.

### Trend Kümesi 2: Şema ve validasyon artık geliştirici tercihi değil runtime davranışı

Tekrarlayan sinyal:

- [MCP Java SDK `2.0` migration guide](https://github.com/modelcontextprotocol/java-sdk/blob/v2.0.0/MIGRATION-2.0.md)
- [Spring AI `2.0` MCP entegrasyon başlıkları](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now)

Çıkarım:

- Dün structured output için gördüğümüz “şema disiplinine dönüş” bugün tool protokolünde de aynen var.
- Java/Spring ekipleri için yeni norm, “önce çalışsın sonra sıkılaştırırız” değil; “önce kontratı ve validasyonu tanımla” haline geliyor.

### Trend Kümesi 3: Resmi Java performans yönü yeniden hot-path optimizasyonuna dönüyor

Tekrarlayan sinyal:

- [SIMD / Vector API yazısı](https://inside.java/2026/07/02/simd-vectors-hotspot-jvm/)
- [ZGC’nin on yıllık performans yazısı](https://inside.java/2026/06/30/zgc-performance-decade/)
- [JDK `27` EA build `29`](https://jdk.java.net/27/)

Çıkarım:

- Kalıcı değer yeni syntax’tan çok runtime ve CPU verimi tarafında birikiyor.
- Özellikle CPU-bound Java servisleri için “Java zaten yeterince hızlıdır” varsayımı yeniden ölçüm gerektiriyor; bazen daha hızlı olabilir, bazen de hiç fark etmeyebilir.

## Araçlar ve Kütüphaneler

- [Spring AI `2.0`](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now): yüksek öncelik. Eğer Spring tabanlı AI uygulaması kuruyorsanız artık yalnız model adapter’larını değil MCP, tool discovery, auth ve transport kararlarını birlikte ele almalısınız.
- [MCP Java SDK `2.0`](https://github.com/modelcontextprotocol/java-sdk/releases/tag/v2.0.0): yüksek öncelik. Spring AI içinde ya da bağımsız kullanımda, migrasyon checklist’i gerektiriyor.
- [LangChain4j `1.17.0` ve `1.17.1`](https://github.com/langchain4j/langchain4j/releases): düşük öncelikli ama anlamlı watchlist. `DebatePlanner`, tool compensating action, `OracleChatMemoryStore` ve raw streaming callback gibi özellikler geliyor; `1.16.3` tarafındaki metadata-filter SQL injection fix’i de yüzeyin hızla genişlediğini gösteriyor.
- Bugün yeni ve yüksek öncelikli Spring observability/test kütüphanesi sinyali görünmüyor. Güçlü sinyal, kütüphane adından çok protokol katmanının sertleşmesinde.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI veya MCP tabanlı tool server/client geliştiriyorsanız, `Tool.inputSchema`, embedded schema doğruluğu, transport seçimi ve auth modeli artık mimari karar başlığıdır; “sonradan toparlarız” kalemi değil.
- Özellikle SSE kullanan veya custom transport yazan ekipler `Streamable HTTP` geçişini ve `protocolVersions()` davranışını test etmelidir.
- Custom MCP object construction yapan ekipler null/empty alanları artık build-time kırılma sebebi olarak görmelidir.
- `switch` exhaustiveness veya eski `JsonSchema` wrapper’larına güvenen kodlar MCP `2.0` geçişinde sessiz teknik borç çıkarabilir.
- CPU-bound Java servisleriniz varsa JDK `26` üzerinde vectorizable hot path’ler için JMH tabanlı gerçek benchmark açmak anlamlıdır.
- Network veya veritabanı ağırlıklı klasik CRUD servislerinde ise vectorization çoğu zaman düşük getirili kalır; burada gereksiz karmaşıklık yaratmamak gerekir.

## Fırsatlar ve Riskler

- Fırsat: Spring AI `2.0` ile iç tool platformlarını IDE, CLI, bot ve backend servisleri arasında ortak MCP kontratı üzerinde birleştirmek mümkün.
- Risk: MCP `2.0` migrasyonunu küçük bir dependency upgrade sanmak; schema, transport ve validation kaynaklı kırılmaları üretime taşır.
- Fırsat: `ToolSearchToolCallingAdvisor`, yüzlerce tool içeren kurumsal kataloglarda prompt şişmesini ve yanlış tool seçimini azaltabilir.
- Risk: Tool kataloglarını progressive disclosure ile açarken auth scope ve audit trail aynı hızda olgunlaştırılmazsa güvenlik borcu büyür.
- Fırsat: Vector API ve gelişen auto-vectorization, Java içinde kalıp sıcak döngüleri optimize etme fırsatı veriyor.
- Risk: I/O-bound servislerde bu tür optimizasyonlara erken girmek gereksiz complexity üretir.
- Fırsat: LangChain4j tarafındaki compensating action ve Oracle chat memory özellikleri, Spring ekiplerine alternatif tasarım fikirleri verebilir.
- Risk: Spring AI ve LangChain4j’yi net sınır koymadan aynı çekirdekte karıştırmak abstraction karmaşası ve operasyonel parçalanma yaratır.

## İzlenmesi Gereken Konular

- Spring security feed’inde Temmuz 2026 boyunca yeni bir advisory veya patch dalgası gelecek mi?
- Spring AI `2.x` hattında MCP enterprise feature’larının ne kadarı çekirdek, ne kadarı community extension olarak kalacak?
- `Streamable HTTP` geçişi sonrası Spring tabanlı MCP deployment örnekleri ne kadar hızlı çoğalacak?
- JDK `27` sonraki EA build’lerinde Vector API, Panama veya serviceability tarafında Spring ekiplerini etkileyen daha güçlü sinyaller çıkacak mı?
- LangChain4j’nin hızlı özellik temposu, Spring AI ile rekabette mi yoksa tamamlayıcı desen seviyesinde mi kalacak?

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring AI `2.0`, MCP ve tool-control-plane katmanını ilk sınıf Spring concern’üne çeviriyor
- `source`: [Spring AI 2.0.0 GA available now](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now) | [A Bootiful Podcast: Sébastien Deleuze](https://spring.io/blog/2026/07/02/a-bootiful-podcast-sebastien-deleuze)
- `author`: Christian Tzolov | Josh Long
- `date`: 12 Haziran 2026 / 2 Temmuz 2026
- `category`: ai-platform, protocol, developer-productivity, operations
- `tags`: spring-ai-2.0, mcp, toolsearchtoolcallingadvisor, mcp-annotations, streamable-http, oauth2, api-key, micrometer, jackson3, jspecify
- `summary`: Spring AI `2.0`, Boot `4.x` / Framework `7` tabanına otururken MCP integration, progressive tool disclosure, Streamable HTTP ve Spring tabanlı auth/observability katmanını birlikte getiriyor.
- `why_it_matters`: AI entegrasyonu artık yalnız model çağrısı değil; tool discovery, remote transport, auth ve telemetry kontratlarının da birlikte tasarlanması gerekiyor.
- `java_spring_relevance`: İç tool platformu, agentic backend, developer assistant veya Spring Boot tabanlı AI servisleri kuran ekipler için doğrudan etkili.
- `actionability`: `planli_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: ortak MCP katmanı, daha temiz tool discovery, mevcut Spring security ve telemetry stack’ini yeniden kullanma
- `risks`: Boot `4.x` baseline, yeni transport varsayımları, progressive tool disclosure ile auth scope karmaşıklığı
- `migration_notes`: MCP adoption yapılacaksa yalnız dependency değil; transport, auth, observability ve tool registration davranışı birlikte gözden geçirilmelidir.

### Bulgu 2

- `title`: MCP Java SDK `2.0`, gevşek tool protokolünü sıkı sözleşmeye dönüştürüyor
- `source`: [MCP Java SDK 2.0.0 release](https://github.com/modelcontextprotocol/java-sdk/releases/tag/v2.0.0) | [Migration Guide — 2.0](https://github.com/modelcontextprotocol/java-sdk/blob/v2.0.0/MIGRATION-2.0.md)
- `author`: MCP Java SDK maintainers
- `date`: 11 Haziran 2026
- `category`: protocol, migration, validation, compatibility
- `tags`: mcp-java-sdk-2.0, inputschema-map, json-schema-2020-12, validateToolInputs, protocolVersions, sse-deprecated, streamable-http
- `summary`: SDK `2.0`, required field enforcement, schema validation, `Tool.inputSchema` tip değişimi ve SSE deprecation ile eski gevşek davranışları sona erdiriyor.
- `why_it_matters`: Daha önce sessizce geçen hatalar artık build-time veya runtime seviyesinde kırılmaya dönüşecek; bu da prod güvenilirliği için iyi ama göç maliyeti için gerçek bir iş.
- `java_spring_relevance`: Spring AI üzerinden veya doğrudan MCP client/server yazan Java ekipleri, bu breaking change’lerden doğrudan etkilenir.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: daha doğru schema, daha iyi forward-compatibility, net protocol negotiation
- `risks`: invalid schema’lar, eski `JsonSchema` wrapper’ları, custom transport kodu, SSE bağımlılığı, switch exhaustiveness kırılmaları
- `migration_notes`: `Tool.inputSchema()` kullanımları, embedded JSON Schema belgeleri, `validateToolInputs`, custom request builder’lar ve transport tercihleri audit edilmelidir.

### Bulgu 3

- `title`: Inside Java, JDK `26` ile SIMD ve Vector API’yi yeniden sıcak yol performans aracı olarak öne çıkarıyor
- `source`: [SIMD Vectors in the HotSpot JVM - Auto Vectorization and the Vector API](https://inside.java/2026/07/02/simd-vectors-hotspot-jvm/) | [dev.java/news](https://dev.java/news/)
- `author`: Emanuel Peter
- `date`: 2 Temmuz 2026
- `category`: jvm, performance, panama, runtime
- `tags`: jdk-26, simd, auto-vectorization, vector-api, memorysegment, alignment, gather-scatter, branch-misprediction
- `summary`: Resmi Java ekibi, JDK `26` ile auto-vectorization ve Vector API tarafındaki ilerlemeleri fill/copy/map/reduce döngüleri, `MemorySegment`, alignment ve branch davranışı üzerinden daha uygulanabilir bir şekilde anlatıyor.
- `why_it_matters`: CPU-bound Java kodunda gerçek throughput ve latency artışı potansiyeli var; bu, Java servislerinin yalnız framework değil hot-path kod seviyesinde de optimize edilebildiğini gösteriyor.
- `java_spring_relevance`: Spring Boot servislerinin içindeki scoring, crypto, codec, analytics, search, media veya post-processing katmanları için doğrudan anlamlı.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: sıcak döngüleri JDK `26` üzerinde yeniden benchmark etmek, gerekirse Vector API ile hedefli optimizasyon yapmak
- `risks`: I/O-bound sistemlerde yanlış optimizasyon önceliği, bakım maliyeti, donanım bağımlı sonuçlar
- `migration_notes`: JMH ile önce ölçüm yapılmalı; Vector API kullanımı yalnız gerçekten sıcak ve deterministik kod yollarına indirgenmelidir.

### Bulgu 4

- `title`: LangChain4j `1.17.x`, agent kontrol davranışlarını genişletiyor ama düşük öncelikli watchlist olarak kalmalı
- `source`: [LangChain4j releases](https://github.com/langchain4j/langchain4j/releases) | [InfoQ Java News Roundup - June 22, 2026](https://www.infoq.com/news/2026/06/java-news-roundup-jun22-2026/)
- `author`: LangChain4j maintainers | Sergio De Simone
- `date`: 26 Haziran 2026 / 30 Haziran 2026 / 22 Haziran 2026
- `category`: ai-platform, library, workflow, watchlist
- `tags`: langchain4j-1.17.0, langchain4j-1.17.1, debateplanner, compensating-action, oracle-chat-memory-store, raw-stream-events, hibernate-workaround
- `summary`: `1.17.0`, debate agentic pattern, tool compensating action, Oracle tabanlı chat memory ve raw streaming event callback getiriyor; `1.17.1` ise Hibernate bug workaround’u ile hızlı follow-up yapıyor.
- `why_it_matters`: Java AI ekosisteminde kontrol-plane davranışları yalnız Spring AI’da değil, alternatif kütüphanelerde de hızla olgunlaşıyor.
- `java_spring_relevance`: Spring ekipleri vendor-neutral bir AI abstraction arıyorsa veya LangChain4j ile Spring AI arasında seçim yapıyorsa anlamlı; aksi durumda düşük öncelikli.
- `actionability`: `izlemelik`
- `impact_level`: `dusuk-orta`
- `opportunities`: alternatif tasarım desenleri, Oracle-centric memory store, failure compensation modelleri
- `risks`: abstraction parçalanması, yakın zamanda gelen güvenlik ve workaround ihtiyacı nedeniyle hızlı değişen yüzey
- `migration_notes`: Spring AI ve LangChain4j aynı çekirdekte karıştırılacaksa adapter sınırı net çizilmeli; tek uygulamada iki agent abstraction katmanı doğrudan iç içe geçirilmemelidir.

### Bulgu 5

- `title`: JDK `27` build `29` geldi; destekli Oracle tabanı ise sabit kaldı
- `source`: [OpenJDK JDK 27 Early-Access Builds](https://jdk.java.net/27/) | [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases)
- `author`: OpenJDK / Oracle Java update channels
- `date`: 2 Temmuz 2026 / 3 Temmuz 2026 itibarıyla doğrulandı
- `category`: jvm, release-governance, watchlist
- `tags`: jdk27, build29, early-access, java-25.0.3, java-21.0.11, java-17.0.19, java-26.0.1
- `summary`: JDK `27` EA hattı 2 Temmuz 2026’da `build 29`’a yükseldi; buna rağmen destekli Oracle runtime tabanı 3 Temmuz 2026 sabahı itibarıyla değişmedi.
- `why_it_matters`: Deney hattı ile prod hattı karıştırılırsa support ve güvenlik varsayımları bozulur; ama EA hattı erken benchmark ve compatibility yakalama fırsatı sunar.
- `java_spring_relevance`: Runtime standardizasyonu yapan Spring platform ekipleri, CI image seçimi ve benchmark şeritleri açısından doğrudan etkilenir.
- `actionability`: `izlemelik`
- `impact_level`: `dusuk-orta`
- `opportunities`: GA öncesi benchmark, compatibility dry-run, framework/library readiness takibi
- `risks`: EA build’i prod baseline’a sızdırmak, yanlış support beklentisi kurmak
- `migration_notes`: Prod image pin’leri destekli Oracle veya kurum standardı JDK hatlarında tutulmalı; JDK `27` yalnız benchmark/canary şeridinde denenmelidir.

## Sonuç

3 Temmuz 2026 radarının ana mesajı yeni bir Spring patch dalgası değil, Java/Spring ekiplerinin AI entegrasyonunu daha ciddi bir altyapı sözleşmesi olarak ele almak zorunda olduğu. Spring AI `2.0` ve MCP Java SDK `2.0`, tool server/client işini artık prompt yardımcılarından çıkarıp protokol, schema, auth ve transport kararına dönüştürüyor. JVM tarafında ise günün daha kalıcı ikinci sinyali, JDK `26` ile CPU-verimli hot-path optimizasyonlarının yeniden görünür hale gelmesi. Kısa özetle: bugün aksiyon listesi patch kovalamak değil; MCP migrasyon checklist’i açmak, transport ve schema validasyonunu sertleştirmek ve gerçekten CPU-bound sıcak yollar için yeni benchmark başlatmak.
