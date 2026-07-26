# Günlük Java / Spring Ekosistem Raporu

Tarih: 26 Temmuz 2026 Pazar  
Tarama zamanı: 26 Temmuz 2026 09:08 TSİ  
Odak: release sonrası yönetişim; Spring AI `2.0` ve MCP migration borcu, executable governance, aylık JDK patch ritmi

Tarama notu: 26 Temmuz 2026 Pazar günü [Spring Blog](https://spring.io/blog/), [Spring AI Upgrade Notes](https://docs.spring.io/spring-ai/reference/upgrade-notes.html), [Spring AI MCP Overview](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html), [Spring Security Advisories](https://spring.io/security), [Spring AI `v2.0.0` release](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0), [Spring Boot `v3.5.16`](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.16), [Spring Framework `v7.0.8`](https://github.com/spring-projects/spring-framework/releases/tag/v7.0.8), [Spring Framework `v6.2.19`](https://github.com/spring-projects/spring-framework/releases/tag/v6.2.19), [OpenJDK JDK 27](https://openjdk.org/projects/jdk/27/), [Oracle’ın aylık Java güvenlik güncellemeleri duyurusu](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases), [Inside Java: AI Solutions with Spring AI 2.0](https://inside.java/2026/07/23/podcast-063/), [Inside Java: Java MCP Tool Development](https://inside.java/2026/07/25/design-java-mcp-tool/), [This Week in Spring - 21 Temmuz 2026](https://spring.io/blog/2026/07/21/this-week-in-spring-july-21-2026), [InfoQ Java Roundup - 20 Temmuz 2026](https://www.infoq.com/news/2026/07/java-news-roundup-jul13-2026/), [Baeldung: Subagent Orchestration in Spring AI](https://www.baeldung.com/spring-ai-subagent-orchestration), [Gunnar Morling: Fixed-Length Lists in Parquet](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/), [Burak KUTBAY: ArchUnit](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/) ve [Burak KUTBAY: Feature Flag + Unleash](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html/) kontrol edildi. Hafta sonu itibarıyla resmi release ve advisory yüzeyinde yeni bir Spring GA ya da yeni bir CVE dalgası görünmüyor; bugün en güçlü sinyal, Haziran’daki büyük sürümlerin Temmuz sonunda “şimdi neyi standartlaştırmalı, neyi test etmeli, neyi koda dökmeliyim?” sorusuna dönüşmüş olması.

## Öne Çıkan Başlıklar

- 26 Temmuz 2026 itibarıyla çekirdek Spring release yüzeyi yeni bir GA vermiyor; Spring AI `2.0.0`, Boot `3.5.16` ve Framework `7.0.8/6.2.19` sonrası asıl iş migration ve yönetişim borcunu kapatmak.
- Spring AI `2.0`, yalnız sürüm değil yapı değişikliği getiriyor: `ToolSearchToolCallingAdvisor` ayrı starter’a taşındı, MCP Spring transport’ları artık doğrudan Spring AI tarafında, annotation tabanlı MCP modeli netleşti.
- Inside Java’nın 25 Temmuz 2026 tarihli MCP yazısı, Java dünyasında yeni pratik deseni netleştiriyor: dışarıya sabit tool sözleşmesi, içeride değişebilir embedding sağlayıcısı ve provider-uyumlu scorer zinciri.
- Oracle’ın aylık Java security update planı ile JDK 27’nin `Rampdown Phase Two` aşaması üst üste geldi; JVM yükseltmesi artık “bir sonraki çeyrekte bakarız” konusu değil.
- Burak KUTBAY’ın ArchUnit ve feature-flag yazıları, bugünün teknik borcuna en pratik cevabı hatırlatıyor: yönetişimi wiki’de değil testte ve rollout katmanında yaşatmak.

## Kritik Güncellemeler

### 1. Resmi release yüzeyi sakin; bu sessizlik bekleme değil kapanış işi çağrısı

GitHub release yüzeyinde 26 Temmuz 2026 itibarıyla en güncel çekirdek tarihlerin hâlâ Haziran’da olduğu görülüyor:

- Spring AI `2.0.0`: 12 Haziran 2026
- Spring Boot `3.5.16`: 25 Haziran 2026
- Spring Framework `7.0.8` ve `6.2.19`: 8 Haziran 2026

Spring Security advisories sayfasında da görünen son toplu advisory tarihi 9 Haziran 2026. Bu tablo, “bir patch daha gelsin sonra bakarız” yaklaşımını zayıflatıyor. Yüksek değerli iş artık yeni etiket beklemek değil; mevcut büyük sürümlerin getirdiği modül, paket, transport, runtime ve rollout etkilerini standardize etmek.

### 2. Spring AI `2.0` artık deneysel değil; tool ve MCP yüzeyi üretim tasarımı istiyor

Resmi upgrade notları, Spring AI `2.0` geçişinin dependency bump’tan büyük olduğunu açıkça gösteriyor:

- `ToolSearchToolCallingAdvisor`, ayrı modül ve starter’a taşındı.
- `spring-ai-starter-tool-search-advisor`, auto-configured `ChatClient` içinde default tool loop’un yerini alabiliyor.
- Spring’e özgü MCP transport implementasyonları artık MCP Java SDK içinde değil; Spring AI projesine taşındı.
- `mcp-spring-webflux` ve `mcp-spring-webmvc` group id/paket adları değişti.
- `ToolCallback` ve advisor ordering konusu artık doğrudan mimari karar haline geldi.

Bu, özellikle Spring AI ile agent, MCP server/client veya tool-heavy uygulama yapan ekiplerde yanlış import, yanlış starter ve aşırı geniş tool context yüzünden sessiz davranış bozulmaları üretebilir.

### 3. Java tarafında yeni pattern: tool adı sabit kalır, inference stratejisi içeride değişir

Inside Java’nın 25 Temmuz 2026 tarihli “Pairing In-Process and Hosted Embeddings for Java MCP Tool Development” yazısı, Java ekosistemi için çok net bir üretim mesajı veriyor:

- Dışarıya tek bir MCP tool sun.
- Sağlayıcı seçimini tool adına sızdırma.
- Local geliştirme için in-process embedding yolu sağla.
- Hosted semantic kalite için provider-backed embedding yolu koru.
- Ama scorer artifact’ini embedding temsilinden asla ayırma.

Yazı ayrıca iki kritik operasyon ayrımı yapıyor:

- `protocol readiness`: endpoint ayakta mı?
- `inference readiness`: gerçek scorer/embedding zinciri çalışıyor mu?

Bu ayrım, Spring Boot Actuator sağlık kontrolü ya da platform readiness kontratları için doğrudan uygulanabilir.

### 4. JVM operasyon temposu sıkılaşıyor

Oracle 20 Temmuz 2026’da Java güvenlik güncellemelerini daha sık verme planını duyurdu ve 18 Ağustos 2026 için ek bir Java CSPU hedeflediğini açıkladı. `currentJavaReleases` yüzeyi de 21 Temmuz 2026 itibarıyla destekli baseline’ları güncelledi:

- `26.0.2`
- `25.0.4`
- `21.0.12`
- `17.0.20`

Aynı dönemde OpenJDK JDK 27 sayfası, 16 Temmuz 2026 itibarıyla JDK 27’nin `Rampdown Phase Two` aşamasına geçtiğini gösteriyor. Takvim net:

- 6 Ağustos 2026: Initial Release Candidate
- 20 Ağustos 2026: Final Release Candidate
- 15 Eylül 2026: General Availability

Inside Java’nın 20 Temmuz 2026 tarihli Quality Outreach notu da JDK 27 ile G1’in tüm ortamlarda varsayılan hale gelmesi nedeniyle constrained environment benchmark’ını açıkça öneriyor.

## Trendler ve Sinyaller

### Trend Kümesi 1: Tool sözleşmesi framework primitive’ine dönüşüyor

Spring AI `2.0` tool loop’unu advisor zincirine taşıyor; MCP transport’ları Spring tarafına alıyor; annotation tabanlı server/client modeli belirginleşiyor. Inside Java da aynı dönemde tek tool sözleşmesi arkasında değişebilir embedding stratejisini öneriyor. Ortak sonuç: Java/Spring tarafında tool çağrısı artık helper utility değil, açık API kontratı.

### Trend Kümesi 2: Yönetişim dokümandan koda taşınıyor

Burak KUTBAY’ın ArchUnit yazısı mimari kuralları test koduna, feature-flag yazısı rollout kararını operasyon katmanına taşıyor. Josh Long’un 21 Temmuz haftalık özetinde geçen `Capstead` benzeri governance/observability araçları da aynı ihtiyacı işaret ediyor. Ekipler artık “bunu böyle kullanın” demekten çok “bunu böyle kullanmazsanız build kırılsın” çizgisine gidiyor.

### Trend Kümesi 3: JVM patch ritmi uygulama release treninden ayrışıyor

Oracle’ın aylık cadence hazırlığı ve JDK 27 canary penceresi birlikte okunduğunda, JVM yükseltmesi artık application sprint backlog’undan ayrı yönetilecek bir platform akışı haline geliyor. Bu özellikle container base image, smoke test ve rollout zincirini etkiliyor.

### Trend Kümesi 4: Embedding ve vector iş yükleri etrafında performans gerçeği görünürleşiyor

Inside Java’nın provider-uyumlu scorer yaklaşımı ile Gunnar Morling’in Parquet fixed-length list yazısı aynı yere çıkıyor: AI özellikleri yalnız prompt ve agent katmanı değil; veri temsili, scorer uyumu ve I/O maliyeti de artık gerçek mühendislik konusu.

## Araçlar ve Kütüphaneler

- `spring-ai-starter-tool-search-advisor`: yüksek öncelik. Tool tanımlarını her çağrıda daraltarak LLM’e gereksiz tool şişmesini azaltabilir.
- Spring AI MCP starter’ları (`spring-ai-starter-mcp-server-webmvc`, `spring-ai-starter-mcp-server-webflux`): yüksek öncelik. MCP server/client kurulumunu daha açık ve Spring-native hale getiriyor.
- Spring AI MCP annotations: orta-yüksek öncelik. `@McpTool`, `@McpResource`, `@McpPrompt` ile boilerplate azaltıyor ama package migration dikkat istiyor.
- `spring-ai-agent-utils` ve markdown tabanlı subagent pattern’i: orta öncelik. Fikir güçlü; fakat örnekleri doğrudan kopyalamadan önce resmi BOM ve artifact sürümleri ile hizalanmalı.
- `Capstead`: düşük-orta öncelik. Governance ve daha granular observability iddiası ilginç; henüz çoğu Spring portföyü için ana üretim standardı değil.
- `Hardwood` ve fixed-length list optimizasyon hattı: düşük-orta öncelik. Embedding/Parquet yoğun iş yüklerinde anlamlı; klasik CRUD veya mesajlaşma servisleri için yan kulvar.
- InfoQ’daki LangChain4j ve Oracle AI Agent Studio sinyalleri: düşük öncelik. İzlemelik, fakat resmi Spring AI migration yüzeyinden daha acil değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI veya MCP kullanan ekipler, `2.0` geçişini “compile olur mu?” seviyesinde değil, tool sözleşmesi ve advisor ordering seviyesiyle ele almalı.
- Tool sağlayan servislerde provider seçimi API adına sızmamalı; sabit tool şeması, değişebilir inference arkası daha sürdürülebilir.
- Readiness kontrolü tek katmanlı olmamalı; endpoint ayakta olsa bile model/scorer zinciri hazır olmayabilir.
- Tutorial ve blog örneklerinden dependency kopyalayan ekipler, resmi `spring-ai-bom` ile drift kontrolü yapmalı.
- Platform ekipleri JDK patch işini üç aylık bakım penceresinden çıkarıp aylık cadence’e göre planlamaya başlamalı.
- JDK 27 için küçük pod, düşük CPU ve kısa ömürlü worker profillerinde benchmark lane açmak artık erken değil.

## Fırsatlar ve Riskler

- Fırsat: Spring AI tool arayüzünü sadeleştirip tool-search ile daha küçük, daha denetlenebilir tool yüzeyi kurmak.
- Risk: eski MCP package ve starter varsayımlarını sessizce taşımak; çalışıyor gibi görünen ama hatalı tool loop üretmek.
- Fırsat: local embedding + hosted embedding ikiliğini tek tool sözleşmesi altında toplamak.
- Risk: scorer artifact’ini yanlış embedding ailesiyle eşleştirip anlamsız ama görünürde çalışan sonuçlar almak.
- Fırsat: ArchUnit ile mimari sınırları, feature flag ile rollout kararlarını executable hale getirmek.
- Risk: migration kurallarını wiki’de bırakıp bütün geçişi tek release’e sıkıştırmak.
- Fırsat: aylık JDK cadence ile güvenlik baseline’ını daha hızlı yukarı çekmek.
- Risk: JVM tabanını uygulama release’ine kilitleyip CSPU ritmini kaçırmak.

## İzlenmesi Gereken Konular

- 6 Ağustos 2026 JDK 27 Initial RC ve 20 Ağustos 2026 Final RC’de özellikle GC/serviceability tarafında ek sürpriz olup olmayacağı
- 18 Ağustos 2026 Java CSPU’nun gerçek kapsamı ve organizasyonların aylık patch pipeline’a ne kadar hazır olduğu
- Spring AI `2.0.x` hattında `ToolSearchToolCallingAdvisor` ve MCP package migration’ına dair patch/rehber güncellemeleri
- Baeldung ve benzeri community içeriklerin milestone artifact’lerden GA koordinatlarına ne hızla kaydığı
- `Capstead` ve benzeri governance araçlarının gerçek prod kullanım örnekleri
- Parquet tarafında `FIXED_SIZE_LIST` tartışmasının spesifikasyona ve JVM kütüphanelerine ne hızla yansıyacağı

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Core Spring release yüzeyi sakin; asıl iş post-release migration ve sertleşme
- `source`: [Spring AI `v2.0.0` release](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0) | [Spring Boot `v3.5.16`](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.16) | [Spring Framework `v7.0.8`](https://github.com/spring-projects/spring-framework/releases/tag/v7.0.8) | [Spring Framework `v6.2.19`](https://github.com/spring-projects/spring-framework/releases/tag/v6.2.19) | [Spring Security Advisories](https://spring.io/security)
- `author`: Spring maintainers ve release yöneticileri
- `date`: 8-25 Haziran 2026 sürümleri; 26 Temmuz 2026 itibarıyla doğrulandı
- `category`: release-management, maintenance, governance
- `tags`: spring-ai-2.0.0, spring-boot-3.5.16, spring-framework-7.0.8, spring-framework-6.2.19, advisory-silence, post-release-hardening
- `summary`: 26 Temmuz 2026 Pazar itibarıyla core Spring yüzeyinde yeni bir GA etiketi ya da yeni bir advisory dalgası görünmüyor. En güncel temel tarihler hâlâ Haziran ortası/sonuna ait.
- `why_it_matters`: Yeni patch beklemek yerine mevcut sürümlerin getirdiği package, transport, runtime ve support-line etkilerini kapatmak daha yüksek değer üretiyor.
- `java_spring_relevance`: Spring Boot, Spring Framework veya Spring AI kullanan tüm ekipler için doğrudan önemli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: sprint odağını “etiket kovalamaktan” migration hardening, test ve yönetişim işlerine kaydırmak
- `risks`: yeni release gelmedi diye teknik borcu ertelemek; sessiz drift biriktirmek
- `migration_notes`: repo bazında mevcut Spring sürüm envanterini çıkarın; büyük release sonrası checklist oluşturun; paket/transport/health-check/test etkilerini ayrıca takip edin.

### Bulgu 2

- `title`: Spring AI `2.0` migration yüzeyi, sürüm yükseltmeden büyük; tool ve MCP katmanı yeniden düzenlendi
- `source`: [Spring AI Upgrade Notes](https://docs.spring.io/spring-ai/reference/upgrade-notes.html) | [Spring AI MCP Overview](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html) | [Spring Office Hours S5E18](https://spring.io/blog/2026/07/13/spring-office-hours-podcast-S5E18)
- `author`: Spring AI team | Dan Vega | DaShaun Carter
- `date`: 13 Temmuz 2026 ve mevcut `2.0.0` dokümantasyonu
- `category`: ai-platform, migration, tool-calling, mcp
- `tags`: spring-ai-2.0, toolsearch, advisor-chain, mcp, transport, starter, toolcallback
- `summary`: `ToolSearchToolCallingAdvisor` ayrı modül ve starter’a taşındı; auto-configured `ChatClient` içinde default tool loop’un yerini alabiliyor. MCP Spring transport’ları da SDK’dan Spring AI projesine alındı; WebMVC/WebFlux MCP starter ve annotation modeli netleşti.
- `why_it_matters`: Bu değişiklikler yalnız import kırmıyor; tool sayısının modele nasıl sunulduğunu, advisor sıralamasını ve MCP server/client kurulumunu da değiştiriyor.
- `java_spring_relevance`: Spring AI, ChatClient, MCP server/client veya tool-heavy agent uygulaması yapan Java ekipleri için çok kritik.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: daha küçük tool payload, daha sade starter tabanlı kurulum, daha temiz advisor zinciri
- `risks`: yanlış group id/package, sessizce bozulan tool loop, gereksiz geniş tool context, tutorial kaynaklı eski dependency taşınması
- `migration_notes`: resmi `spring-ai-bom` `2.0.0` tabanına sabitlenin; eski `io.modelcontextprotocol.sdk` Spring transport bağımlılıklarını kaldırın; `spring-ai-starter-tool-search-advisor` gereksinimini değerlendirin; `ToolCallback` ve advisor ordering tarafını gözden geçirin.

### Bulgu 3

- `title`: Java tarafında önerilen yeni pattern: sabit tool sözleşmesi, içeride değişebilir embedding sağlayıcısı
- `source`: [Inside Java: Java MCP Tool Development](https://inside.java/2026/07/25/design-java-mcp-tool/) | [Inside Java: AI Solutions with Spring AI 2.0](https://inside.java/2026/07/23/podcast-063/)
- `author`: Ana-Maria Mihalceanu | Lize Raes | Dan Vega
- `date`: 23-25 Temmuz 2026
- `category`: ai-platform, architecture, mcp, inference
- `tags`: mcp, tool-contract, djl, deepnetts, minilm, openai-embeddings, readiness, provider-compatibility
- `summary`: `urgency-mcp` örneği, dışarıya tek bir MCP tool sunup içeride local MiniLM + DJL veya hosted OpenAI embedding yolu kullanıyor. Kritik kural net: scorer modeli, eğitildiği embedding temsilinden ayrılamaz. Ayrıca servis `protocol readiness` ile `inference readiness` ayrımı yapıyor.
- `why_it_matters`: Bu desen, tool sözleşmesini korurken sağlayıcıyı ve semantic kalite stratejisini değiştirebilmenizi sağlıyor. Aynı zamanda sağlık kontrolü tasarımını ciddileştiriyor.
- `java_spring_relevance`: Spring AI ile MCP server/client, tool API veya embedding tabanlı Java servisler geliştiren ekipler için yüksek değerli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: credentials’sız local geliştirme, daha deterministik CI, tool adını bozmadan sağlayıcı stratejisi değiştirme
- `risks`: scorer/embedding uyumsuzluğu, sadece endpoint canlılığına bakan health check, provider seçimini API sözleşmesine sızdırma
- `migration_notes`: tool şemasını sabit tutun; scorer artifact’lerini embedding ailesine göre versiyonlayın; readiness kontrollerinde inference katmanını ayrıca doğrulayın; local yolu CI ve smoke testlerde kullanın, hosted yolu semantic acceptance testlerine ayırın.

### Bulgu 4

- `title`: Community pattern’ler doğru yöne gidiyor ama artifact ve sürüm disiplini şart
- `source`: [Baeldung: Subagent Orchestration in Spring AI](https://www.baeldung.com/spring-ai-subagent-orchestration) | [Spring AI Getting Started](https://docs.spring.io/spring-ai/reference/getting-started.html) | [This Week in Spring - 21 Temmuz 2026](https://spring.io/blog/2026/07/21/this-week-in-spring-july-21-2026) | [InfoQ Java Roundup - 20 Temmuz 2026](https://www.infoq.com/news/2026/07/java-news-roundup-jul13-2026/)
- `author`: Sagar Verma | Spring AI team | Josh Long | Michael Redlich
- `date`: 20-24 Temmuz 2026 ve güncel resmi dokümantasyon
- `category`: ai-platform, ecosystem-watch, tutorial-drift, developer-productivity
- `tags`: subagents, markdown-agents, spring-ai-agent-utils, capstead, ag-ui, langchain4j, version-skew
- `summary`: Community içeriklerinde subagent orchestration, AG-UI, governance ve observability temaları hızlanıyor. Ancak Baeldung örneğinde hâlâ `spring-ai-starter-model-openai` için `2.0.0-M5` koordinatı kullanılıyor; resmi Spring AI dokümanı ise stabil hattı `2.0.0` ve Boot `4.0.x/4.1.x` desteğiyle gösteriyor.
- `why_it_matters`: Fikirler doğru olsa bile copy-paste dependency kullanımı prod’a milestone artifact, eski transport varsayımı veya transitive uyumsuzluk taşıyabilir.
- `java_spring_relevance`: Spring AI’ı tutorial, workshop veya PoC üzerinden öğrenip üretime taşıyan Java ekipleri için önemli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta`
- `opportunities`: subagent, governance ve observability pattern’lerini resmi GA tabanıyla yeniden kurmak
- `risks`: eski milestone bağımlılıklarıyla üretim hazırlığı yapmak; community örneğini resmi migration notlarıyla karşılaştırmadan almak
- `migration_notes`: tutorial POM’larını resmi `spring-ai-bom` ile hizalayın; community örneğini import etmeden önce upgrade notes farklarını çıkarın; `Capstead`, `AG-UI` ve benzeri araçları PoC kulvarında tutun.

### Bulgu 5

- `title`: JVM operasyon penceresi daralıyor; aylık security cadence ve JDK 27 canary aynı anda geldi
- `source`: [Oracle’ın aylık Java güvenlik güncellemeleri duyurusu](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) | [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) | [OpenJDK JDK 27](https://openjdk.org/projects/jdk/27/) | [Inside Java Quality Outreach](https://inside.java/2026/07/20/quality-heads-up/) | [A Bootiful Podcast: Billy Korando on Java 27](https://spring.io/blog/2026/07/23/a-bootiful-podcast-billy-korando)
- `author`: Donald Smith | OpenJDK | Nicolai Parlog | Josh Long
- `date`: 20-25 Temmuz 2026
- `category`: runtime-governance, security, gc, release-planning
- `tags`: monthly-cspu, currentjavareleases, jdk27, rdp2, g1-default, canary, base-image
- `summary`: Oracle, 18 Ağustos 2026 ile başlayan daha sık Java security update ritmine hazırlanıyor; destekli baseline’lar 21 Temmuz 2026’da güncellendi. JDK 27 ise 16 Temmuz 2026’dan beri `Rampdown Phase Two` aşamasında ve `15 Eylül 2026` GA tarihine yürüyor. G1 artık tüm ortamlarda varsayılan olacak.
- `why_it_matters`: JVM artık çeyreklik gözden geçirme nesnesi değil. Güvenlik cadence’i ve canary penceresi aynı ay içinde işletilmek zorunda.
- `java_spring_relevance`: Container’da, worker’da, cron’da veya API servisinde çalışan tüm Spring uygulamaları için doğrudan etkili.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: aylık runtime rebuild lane kurmak; Java 27 için erken benchmark yapmak; explicit GC ve rollout politikasını netleştirmek
- `risks`: eski base image’larla kalmak; küçük pod’larda default G1 davranışını ilk kez prod’da görmek; CSPU pencerelerini kaçırmak
- `migration_notes`: servis bazında JDK baseline envanteri çıkarın; Ağustos 18 CSPU’yu bakım takvimine alın; JDK 27’yi düşük CPU/düşük bellek profillerinde ölçün; gerektiğinde feature flag veya trafik bölme ile canary yapın.

### Bulgu 6

- `title`: Executable governance, migration stresinin pratik cevabı haline geliyor
- `source`: [Burak KUTBAY: ArchUnit ile Proje Mimarisini Test Edin](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/) | [Burak KUTBAY: Feature Flag ile Güvenli Dağıtım](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html/)
- `author`: Burak KUTBAY
- `date`: 11 Temmuz 2026 | 15 Temmuz 2026
- `category`: architecture-governance, ci-cd, rollout, testing
- `tags`: archunit, unleash, feature-flags, canary, ci-cd, living-architecture, rollout-safety
- `summary`: ArchUnit yazısı mimari kuralları test kodu ve CI parçasına dönüştürüyor; Unleash/feature flag yazısı ise dağıtımı deploy’dan ayırıp kontrollü rollout’u öne çıkarıyor. Birlikte okunduğunda bugünün migration baskısına güçlü pratik cevap veriyorlar.
- `why_it_matters`: Tool transport’ları, HTTP client stack’i, advisor sıraları veya JDK varsayımları değişirken yazılı kural tek başına yetmiyor; testlenen sınır ve kapatılabilir rollout gerekiyor.
- `java_spring_relevance`: Katmanlı Spring Boot uygulamaları, çok modüllü monorepo’lar ve kontrollü rollout isteyen ekipler için yüksek değerli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: mimari sınırları kodla doğrulamak; riskli migration’ları feature flag ile kademeli açmak; review yükünü azaltmak
- `risks`: wiki’de kalan mimari; tek seferde büyük geçiş; PR incelemesine aşırı güven
- `migration_notes`: controller/service/repository ve forbidden dependency kurallarını ArchUnit ile yazın; Spring AI, HTTP client veya JDK uplift geçişlerini feature flag arkasına alın; CI’da boundary ihlalini fail eden standart kural seti oluşturun.

### Bulgu 7

- `title`: Vector yoğun JVM iş yüklerinde Parquet maliyeti görünür; çoğu ekip için hâlâ yan kulvar
- `source`: [Gunnar Morling: A Fast Path for Fixed-Length Lists in Parquet](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/)
- `author`: Gunnar Morling
- `date`: 22 Temmuz 2026
- `category`: data-performance, vector-workloads, storage
- `tags`: parquet, fixed-size-list, embeddings, hardwood, data-plane, performance
- `summary`: Parquet’in mevcut list encoding modeli, sabit boyutlu embedding vektörlerinde gereksiz maliyet üretiyor; Gunnar Morling yaklaşık `3x` okuma maliyeti penceresine dikkat çekiyor ve toplulukta `FIXED_SIZE_LIST` tartışmasının sürdüğünü aktarıyor.
- `why_it_matters`: Embedding veya retrieval iş yükü yapan ekipler için veri katmanı maliyeti prompt katmanından daha kritik hale gelebilir.
- `java_spring_relevance`: RAG, offline embedding pipeline veya vector ETL yürüten Java ekipleri için orta; klasik Spring backend’ler için düşük öncelik.
- `actionability`: `izlemelik`
- `impact_level`: `düşük-orta`
- `opportunities`: daha ucuz vector ETL, daha hızlı offline scoring, Java 21+ veri hattında daha verimli columnar okuma
- `risks`: darboğaz ölçmeden storage tarafında erken refactor’a gitmek
- `migration_notes`: önce mevcut Parquet read path’ini benchmark edin; embedding I/O gerçekten baskınsa fixed-size list ve/veya Hardwood hattını değerlendirin; genel backend ekipleri için bunu ana backlog’a taşımayın.

## Sonuç

26 Temmuz 2026 Pazar gününün yüksek sinyali yeni bir Spring sürümü değil; release sonrası yönetişimin kod ve platform seviyesine inmesi. Spring AI `2.0` ile tool ve MCP yüzeyi artık gerçek mimari kontrat. Oracle’ın aylık patch ritmi ve JDK 27 RDP2 takvimi, JVM’i ayrı bir teslimat hattı haline getiriyor. Bu ortamda en doğru hamleler: Spring AI/MCP migration borcunu kapatmak, tool sözleşmesini sağlayıcıdan ayırmak, readiness ve rollout disiplinini sertleştirmek, ArchUnit ile mimari sınırları test etmek ve JDK 27 için küçük ortam benchmark lane’i açmak.
