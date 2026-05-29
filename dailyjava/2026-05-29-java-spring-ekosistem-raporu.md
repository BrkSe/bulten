# Günlük Java / Spring Ekosistem Raporu

Tarih: 29 Mayıs 2026  
Tarama zamanı: 29 Mayıs 2026 09:06 TSİ  
Odak: Spring AI release/migration hattı, JDK 27 concurrency ve serviceability sinyalleri, event-driven Java stack güncellemeleri ve AOT'nin üretim olgunluğu

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), Spring AI ve Spring Pulsar GitHub release kayıtları, [Inside Java](https://inside.java/), [OpenJDK JEP sayfaları](https://openjdk.org/jeps/0), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long'un This Week in Spring yazısı](https://spring.io/blog/2026/05/26/this-week-in-spring-may-26-2026/), [Gunnar Morling'in blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY'ın blogu](https://blog.burakkutbay.com/) kontrol edildi. Baeldung, Gunnar Morling, Josh Long ve Burak KUTBAY tarafında yararlı bağlam vardı; ancak 29 Mayıs 2026 için üretim kararı etkisi en yüksek sinyaller, Spring AI release kayıtları ile OpenJDK/Inside Java duyurularında toplandı.

## Öne Çıkan Başlıklar

- 29 Mayıs 2026 itibarıyla Spring AI'nin en yeni kararlı yayınları [1.0.8](https://github.com/spring-projects/spring-ai/releases/tag/v1.0.8) ve [1.1.7](https://github.com/spring-projects/spring-ai/releases/tag/v1.1.7) (22 Mayıs 2026), en yeni pre-release'i ise [2.0.0-M8](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M8) (27 Mayıs 2026).
- Spring AI `1.1.7`, OpenAI streaming chunk kaybı, Ollama + GraalVM native image uyumsuzluğu ve RedisVectorStore delete truncation gibi doğrudan production davranışını etkileyen hataları kapatıyor.
- Spring AI `2.0.0-M7/M8`, tool-calling ve MCP taşıma sözleşmesini değiştiriyor: SSE transport deprecated, Streamable HTTP varsayılan, `ToolCallAdvisor` default, bazı setter tabanlı config yolları ve modüller kaldırılmış durumda.
- [JEP 533 Structured Concurrency](https://inside.java/2026/05/11/jep533-target-jdk27/) JDK 27'ye yedinci preview olarak hedeflendi; exception akışını daha tanıdık hale getiriyor ve sanal thread tabanlı fan-out kodlarında hata işleme ergonomisini iyileştiriyor.
- [JEP 528](https://openjdk.org/jeps/528), `jcmd` ile core dump üstünden post-mortem JVM incelemeyi aynı araca toplamayı hedefliyor; bu, Java platform ekipleri için gerçek bir runbook değişikliği adayı.
- [Spring for Apache Pulsar 2.0.5](https://github.com/spring-projects/spring-pulsar/releases/tag/v2.0.5), Pulsar `4.2.0`, Spring Framework `7.0.7` ve Micrometer `1.16.5` hizalamasıyla geldi; Pulsar kullanan Spring ekipleri için bu sadece bakım sürümü değil.

## Kritik Güncellemeler

### 1. Spring AI kararlı hattı artık "beklenebilir bug fix" seviyesini geçti

[Spring AI 1.0.8 / 1.1.7 / 2.0.0-M7 duyurusu](https://spring.io/blog/2026/05/23/spring-ai-1-0-8-1-1-7-2-0-0-m7-available-now/) ve ilgili GitHub release kayıtları birlikte okunduğunda, kararlı hat için öne çıkanlar şunlar:

- `1.1.7`, `OpenAiChatModel` tarafında streaming chunk kaybını düzeltiyor.
- `1.1.7`, Ollama kullanımını GraalVM native image ile tekrar uyumlu hale getiriyor.
- `1.1.7` ve `1.0.8`, `RedisVectorStore#doDelete` tarafındaki sessiz truncate davranışını düzeltiyor.

Bu üç başlık ortak bir şeyi söylüyor: Spring AI artık yalnız demolar ve prototipler için değil; streaming, vector store ve native-image kombinasyonlarında gerçekten production yüzeyi taşıyor. Bu yüzden bu sürümler, özellikle `Boot 3.5.x` üstündeki AI servisleri için doğrudan upgrade adayı.

### 2. Spring AI 2.0 hattında API freeze henüz tamamlanmış değil

29 Mayıs 2026 itibarıyla:

- en yeni pre-release: [`2.0.0-M8`](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M8), yayın tarihi 27 Mayıs 2026
- açık milestone: `2.0.0-RC1`, hedef tarih 1 Haziran 2026
- açık milestone: `2.0.0`, hedef tarih 4 Haziran 2026

`M7` ve `M8` hattındaki anlamlı değişiklikler:

- SSE tabanlı MCP transport'ları deprecated, Streamable HTTP varsayılan hale geliyor.
- `ToolCallAdvisor`, tool invocation için varsayılan yaklaşım oluyor.
- `ToolSpec` fluent API ekleniyor.
- `ChatOptions` setter'ları ve bazı eski config biçimleri kaldırılıyor; builder tabanlı kurulum zorunlu hale geliyor.
- `M8`, `M7`'de ortaya çıkan cookie/session tabanlı auth kırılımını ve `pgvector` starter bağımlılık sorununu düzeltiyor.

Bu neden kritik:

- `Boot 4.x` ile Spring AI `2.x` planlayan ekipler için göç konusu artık "hangi model provider?" sorusundan çok "taşıma protokolü, tool chain ve config contract nasıl değişiyor?" sorusuna dönüştü.
- RC1 çıkmadan API'yi donmuş kabul etmek erken olur.

### 3. Java platform tarafında yeni ana sinyal: concurrency ve crash diagnosability olgunlaşıyor

Bugün en güçlü Java runtime sinyali yeni bir dil özelliği değil; iki ayrı üretim konusunun olgunlaşması:

- [Structured Concurrency 7th Preview](https://inside.java/2026/05/11/jep533-target-jdk27/) ile virtual-thread tabanlı fan-out iş akışları daha okunabilir hata sözleşmesine yaklaşıyor.
- [Post-Mortem Crash Analysis with jcmd](https://openjdk.org/jeps/528) ile crash sonrası teşhis için araç zinciri sadeleşiyor.

Spring MVC/WebFlux veya mesaj tüketici servislerinde paralel downstream çağrılar kuran ekipler için ilk konu; native crash, agent çakışması veya JNI tabanlı arıza yaşayan platform ekipleri için ikinci konu önem kazanıyor.

Not: 29 Mayıs 2026 itibarıyla Spring Security, Spring Cloud veya Spring Framework tarafında, önceki günlerde görülen patch/advisory hattından daha yeni ve daha yüksek etkili ek bir release sinyali çıkmadı. Mevcut patch öncelikleri değişmiş değil.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring AI artık "özellik ekleme" değil, sözleşme yönetimi problemi

Tekrarlayan desen şu:

- kararlı hatta production bug fix'leri geliyor,
- 2.0 hattında transport, tool-calling ve config davranışları hızla değişiyor,
- stable ve pre-release hatları arasında operasyonel fark büyüyor.

Çıkarım: Spring AI kullanan ekipler dependency upgrade işini sıradan kütüphane bump'ı gibi yönetmemeli. Ayrı release kanalı, ayrı test matrisleri ve daha sık contract regression testleri gerekiyor.

### Trend Kümesi 2: Java runtime tarafında asıl değer ergonomi + operasyon basitleştirmesinden geliyor

- Structured concurrency exception modeli klasik `Future.get()` mantığına yaklaşıyor.
- `jcmd` post-mortem hedefi, canlı ve crash sonrası teşhisi tek araca toplamaya çalışıyor.

Çıkarım: Java platformu, yüksek seviyeli dağıtık servis davranışını ve düşük seviyeli JVM teşhisini aynı anda sadeleştiriyor. Bu, kurumsal Java ekiplerinin bakım maliyetini orta vadede düşürür.

### Trend Kümesi 3: AOT artık benchmark fetişi değil, SDLC konusu

[Netflix'in Java AOT üretim sunumu](https://inside.java/2026/05/23/java-aot-in-production-at-netflix/) şu açıdan önemli: startup iyileştirmesi tek başına teknik bir oyun değil; derleme zinciri, deploy boru hattı, gözlemlenebilirlik ve servis sınıflandırmasıyla birlikte düşünülüyor.

Çıkarım: Spring Boot ekipleri AOT/native stratejisini sadece "cold start iyi olur mu?" diye değil, "hangi servis sınıfı için hangi artifact tipi mantıklı?" diye ele almalı.

### Trend Kümesi 4: Event-driven stack'te bakım sürümleri artık ekosistem hizalaması da taşıyor

Spring for Apache Pulsar `2.0.5`, yalnız tekil bug fix taşımıyor; Pulsar `4.2.0`, Spring Framework `7.0.7` ve Micrometer `1.16.5` ile hizalama içeriyor.

Çıkarım: Mesajlaşma kütüphanelerinde bakım sürümü, broker/client/metrics kombinasyonunu birlikte etkileyebiliyor. Özellikle observability ve schema testleri önem kazanıyor.

## Araçlar ve Kütüphaneler

- [Spring AI 1.1.7](https://github.com/spring-projects/spring-ai/releases/tag/v1.1.7): `Boot 3.5.x` hattında production bug fix sürümü. En yüksek öncelikli AI upgrade adayı.
- [Spring AI 2.0.0-M8](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M8): `Boot 4.x` kullanan ekipler için yakın dönem entegrasyon hedefi; fakat henüz RC değil.
- [Spring for Apache Pulsar 2.0.5](https://github.com/spring-projects/spring-pulsar/releases/tag/v2.0.5): Event-driven Spring ekipleri için orta-yüksek öncelikli hizalama sürümü.
- [`jcmd` post-mortem analizi](https://openjdk.org/jeps/528): Henüz aday JEP, ama platform ve SRE ekiplerinin şimdiden runbook hazırlığı yapması gereken araç.
- [Inside Java: Java AOT in Production at Netflix](https://inside.java/2026/05/23/java-aot-in-production-at-netflix/): Doğrudan bir kütüphane yayını değil; ancak AOT kararını ciddiye almak için güçlü bir üretim sinyali.
- [Baeldung'in Spring Boot 4 / Spring Framework 7 yazısı](https://www.baeldung.com/spring-boot-4-spring-framework-7) ve [Burak KUTBAY'ın API versiyonlama yazısı](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/) bugün için açıklayıcı bağlam sunuyor; fakat yeni release/advisory seviyesinde sinyal üretmiyorlar.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI `1.1.x` kullanıyorsanız, `1.1.7` artık "uygun zamanda geçeriz" değil, production correctness upgrade'i olarak ele alınmalı.
- `Boot 4.x + Spring AI 2.x` hedefliyorsanız, 29 Mayıs 2026 itibarıyla en güncel yayın `M8`; RC1 ve GA henüz çıkmış değil. Göç planı mutlaka `1 Haziran 2026` ve `4 Haziran 2026` milestone penceresine göre yapılmalı.
- Virtual thread ile paralel downstream çağrılar yazıyorsanız, JDK 27 preview hattı artık exception yönetimini daha tanıdık hale getiriyor. Bu, service aggregator ve orchestration kodu için önemli.
- JVM crash teşhisi pahalıysa, `hs_err` dosyası + core dump + eşleşen `libjvm` saklama standardı bugünden kurulmalı. JEP 528 bunun üstüne oturuyor.
- Pulsar kullanan ekiplerde upgrade kararı yalnız uygulama kodu açısından değil; broker sürümü, serializer/schema davranışı ve metrik etiketleme açısından da test edilmeli.
- AOT/native denemeleri olan Spring Boot ekipleri, bunu bireysel servis hack'i olarak değil, platform capability olarak ele almalı.

## Fırsatlar ve Riskler

- Fırsat: Spring AI `ToolSpec` ve `ToolCallAdvisor` yaklaşımıyla agent/tool entegrasyonlarını daha sistematik hale getirmek.
- Fırsat: Structured concurrency ile fan-out servislerde timeout, cancellation ve exception yönetimini sadeleştirmek.
- Fırsat: `jcmd` post-mortem yaklaşımıyla crash sonrası MTTR'ı düşürmek.
- Fırsat: AOT'yi yalnız cold start değil, ölçeklenme ve deploy ergonomisi için değerlendirmek.
- Risk: Spring AI `2.0` hattında SSE deprecation, config contract değişimleri ve pre-release churn yüzünden erken sabitleme yapmak.
- Risk: Spring AI stable hatta kalıp streaming chunk kaybı veya Redis delete truncation gibi sessiz veri/doğruluk sorunlarını taşımak.
- Risk: Core dump taşıma süreçlerinde hassas veri yönetimini atlamak.
- Risk: Pulsar upgrade'ini sadece dependency bump gibi görüp broker/client/testcontainer/metrics zincirini atlamak.

## İzlenmesi Gereken Konular

- `Spring AI 2.0.0-RC1` milestone'u: hedef 1 Haziran 2026, hâlâ açık.
- `Spring AI 2.0.0` GA milestone'u: hedef 4 Haziran 2026, hâlâ açık.
- `Spring AI 2.0.0-M8` sonrası blog duyurusu veya RC1 yayınının gelip gelmeyeceği.
- JEP 528'in candidate aşamasından delivery hattına nasıl ilerleyeceği.
- Structured concurrency preview hattında JDK 27 EA build'lerinde ek sözleşme değişikliği olup olmayacağı.
- Spring ekosisteminde Netflix benzeri AOT/Leyden tecrübelerinin resmi Spring Boot rehberlerine ne ölçüde yansıyacağı.
- Spring Security / Spring Cloud tarafında bugüne ek yeni advisory gelip gelmeyeceği; şu an için yeni yüksek öncelikli sinyal yok.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring AI 1.1.7 ve 1.0.8, sessiz production hatalarını kapatan gerçek bakım sürümleri
- source: [Spring AI 1.0.8, 1.1.7, 2.0.0-M7 Available Now](https://spring.io/blog/2026/05/23/spring-ai-1-0-8-1-1-7-2-0-0-m7-available-now/), [Spring AI 1.1.7 release](https://github.com/spring-projects/spring-ai/releases/tag/v1.1.7), [Spring AI 1.0.8 release](https://github.com/spring-projects/spring-ai/releases/tag/v1.0.8), [Spring AI README compatibility](https://github.com/spring-projects/spring-ai)
- author: Ilayaperumal Gopinathan
- date: 22-23 Mayıs 2026
- category: ai-platform, streaming, native-image, vector-store-correctness
- tags: spring-ai, spring-boot-3-5, openai-streaming, ollama, graalvm, redis-vector-store
- summary: `1.1.7`, OpenAI streaming chunk kaybını ve Ollama + GraalVM native image sorununu düzeltiyor; `1.0.8` ve `1.1.7`, RedisVectorStore silme işlemlerindeki sessiz truncate davranışını kapatıyor.
- why_it_matters: Bu tip hatalar gürültülü crash üretmeyip sessiz doğruluk bozulması yaratır; production'da en pahalı hata sınıfı budur.
- java_spring_relevance: Spring AI kullanan `Boot 3.5.x` ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: `2.0` beklemeden stable hattan daha güvenli AI servisleri çalıştırmak.
- risks: Streaming cevapların eksik gitmesi, vector-store delete davranışının sessizce eksik kalması, native-image deneylerinin bozulması.
- migration_notes: `Spring AI 1.1.x` hattı `Spring Boot 3.5.x` ile hizalı; upgrade sonrası streaming, vector store ve native-image smoke testleri yeniden koşturulmalı.

### Bulgu 2

- title: Spring AI 2.0 hattı sözleşmeyi değiştiriyor; 29 Mayıs 2026 itibarıyla RC1 ve GA henüz çıkmadı
- source: [Spring AI 2.0.0-M7 release](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M7), [Spring AI 2.0.0-M8 release](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M8), [Spring AI 1.0.8, 1.1.7, 2.0.0-M7 Available Now](https://spring.io/blog/2026/05/23/spring-ai-1-0-8-1-1-7-2-0-0-m7-available-now/), [Spring AI milestones](https://github.com/spring-projects/spring-ai/milestones), [Spring AI README compatibility](https://github.com/spring-projects/spring-ai)
- author: Ilayaperumal Gopinathan ve Spring AI maintainers
- date: 22-27 Mayıs 2026
- category: ai-platform-migration, mcp, tool-calling, configuration-contract
- tags: spring-ai-2-0, spring-boot-4, mcp, streamable-http, sse, toolspec, toolcalladvisor, pgvector
- summary: `M7`, SSE tabanlı MCP transport'u deprecated ilan edip Streamable HTTP'yi varsayılan yapıyor; `ToolCallAdvisor` varsayılan hale geliyor, `ToolSpec` geliyor, bazı modüller ve setter tabanlı config yolları kalkıyor. `M8`, auth ve pgvector tarafındaki regresyonları kapatıyor. 29 Mayıs 2026 itibarıyla `RC1` milestone'u açık ve hedefi 1 Haziran 2026; `GA` milestone'u açık ve hedefi 4 Haziran 2026.
- why_it_matters: Bu hat yeni özellik eklemekten çok uygulama sözleşmesini değiştiriyor; erken sabitleme pahalı teknik borç üretir.
- java_spring_relevance: `Spring Boot 4.x` üstünde AI/agent servis kuran ekipler için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: çok-yüksek
- opportunities: Tool-calling mimarisini standardize etmek, yeni transport yaklaşımıyla daha düzenli MCP entegrasyonları kurmak.
- risks: Deprecated transport'a veya eski config şekline yapışmak, M7'deki auth kırılımı gibi prerelease regresyonlarını prod-benzeri ortama taşımak.
- migration_notes: `Spring AI 2.x` hattı `Spring Boot 4.x` gerektiriyor. RC1 çıkana kadar migration branch'i ayrı tutulmalı; M7/M8 üzerinde transport, auth, pgvector ve tool-calling regresyon testleri hazırlanmalı.

### Bulgu 3

- title: JDK 27 Structured Concurrency 7th Preview, sanal thread fan-out kodunda exception akışını sadeleştiriyor
- source: [Inside Java: JEP targeted to JDK 27: 533](https://inside.java/2026/05/11/jep533-target-jdk27/), [InfoQ: JEP 533 Tightens Exception Handling in Java's Structured Concurrency for JDK 27](https://www.infoq.com/news/2026/05/jep-533-jdk-27/)
- author: Alan Bateman, Viktor Klang, Ron Pressler; ikincil özet A N M Bazlur Rahman
- date: 11-13 Mayıs 2026
- category: concurrency, virtual-threads, api-evolution
- tags: jdk-27, loom, structured-concurrency, executionexception, joiner, virtual-threads
- summary: JEP 533, JDK 27'ye yedinci preview olarak hedeflendi. Bu turda odak, `StructuredTaskScope` exception sözleşmesini tanıdık hale getirmek: `FailedException` yerine `ExecutionException`, tipli `Joiner` ve daha sade `open(...)` konfigürasyonu.
- why_it_matters: Fan-out servislerde hata, timeout ve cancellation akışı daha okunabilir hale geliyor; bu tam olarak microservice orchestration kodunu ilgilendiriyor.
- java_spring_relevance: Virtual thread deneyen Spring MVC/WebFlux ve backend orchestration ekipleri için yüksek.
- actionability: pilotla
- impact_level: yüksek
- opportunities: Aggregator servislerde daha net concurrency sözleşmesi; custom `Future`/`ExecutorService` glue kodunu azaltma.
- risks: Preview API olduğu için son dakika contract değişimi; eski preview'lere göre catch bloklarının bozulması.
- migration_notes: Preview olduğu unutulmamalı. JDK 27 EA üzerinde `ExecutionException` akışı, timeout davranışı ve custom joiner kullanan kodlar ayrı test edilmelidir.

### Bulgu 4

- title: JEP 528, `jcmd` ile canlı ve crash sonrası JVM teşhisini tek araca yaklaştırıyor
- source: [OpenJDK JEP 528](https://openjdk.org/jeps/528), [Inside Java: Post-Mortem JVM Crash Analysis with jcmd](https://inside.java/2026/05/16/javaone-jcmd-jvm-analysis/)
- author: Kevin Walls; sunum özeti Fairoz Matte
- date: 16 Mayıs 2026 ve mevcut JEP durumu
- category: serviceability, platform-engineering, incident-response
- tags: jcmd, core-dump, hs_err, jhsdb, serviceability, hotspot
- summary: JEP 528, `jcmd` aracını core dump üstünden de çalıştırmayı hedefliyor. `Thread.print`, `GC.heap_dump`, `VM.native_memory` dahil 26 komutun post-mortem ortamda kullanılabilmesi planlanıyor; eşleşen `libjvm` ve aynı OS/arch gereksinimi korunuyor.
- why_it_matters: JVM crash teşhisi bugün çoğu ekipte kırılgan ve uzman bağımlı. `jcmd` standardizasyonu runbook maliyetini düşürür.
- java_spring_relevance: Spring ekiplerinde özellikle JNI, agent, profiler, native client veya container crash senaryoları olan platform/SRE tarafı için yüksek.
- actionability: izle_ve_planla
- impact_level: yüksek
- opportunities: Crash sonrası teşhis süresini düşürmek, `jhsdb` ve dağınık debug pratiğini azaltmak.
- risks: Core dump taşınırken hassas verinin uygunsuz ortama sızması; doğru `libjvm` ikilisinin saklanmaması.
- migration_notes: Bugünden itibaren `hs_err`, core dump ve ilgili JVM binary saklama politikası standartlaştırılmalı. JEP teslim edilmeden önce bile bu hazırlık değer üretir.

### Bulgu 5

- title: Netflix'in AOT üretim anlatısı, Leyden/AOT'u gerçek platform konusu haline getiriyor
- source: [Inside Java: Java AOT in Production at Netflix](https://inside.java/2026/05/23/java-aot-in-production-at-netflix/)
- author: Martin Chalupa ve Ian Brown
- date: 23 Mayıs 2026
- category: performance, aot, platform-engineering
- tags: project-leyden, aot, startup, sdlc, platform, netflix
- summary: Netflix, JavaOne 2026'da Project Leyden kullanarak kritik servislerin startup süresini iyileştirmek için yalnız JVM tekniğini değil, bunu destekleyen yazılım ve SDLC altyapısını da anlattı.
- why_it_matters: Bu, AOT'nin artık laboratuvar düzeyi performans oyuncağı değil; build, deploy ve işletim sürecine yayılan bir üretim kararı olduğunu gösteriyor.
- java_spring_relevance: Spring Boot AOT/native yol haritası olan ekipler için yüksek; Spring özelinde çıkarım yapılıyor ama sinyal güçlü.
- actionability: pilotla
- impact_level: orta-yüksek
- opportunities: Cold-start hassas stateless servislerde daha agresif ölçeklenme ve daha hızlı deploy.
- risks: Artifact matrisi büyümesi, debug/observability akışlarının ayrışması, her servise körlemesine uygulanırsa verimsizlik.
- migration_notes: İlk aday, latency veya autoscaling baskısı yüksek stateless servisler olmalı. AOT denemeleri platform ekipleriyle birlikte yürütülmeli; tekil ekip deneyi olarak bırakılmamalı.

### Bulgu 6

- title: Spring for Apache Pulsar 2.0.5, Pulsar 4.2.0 ve ölçümleme hizalamasıyla orta-yüksek önemde bakım sürümü
- source: [Spring for Apache Pulsar 1.2.17 and 2.0.5 are now available](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available), [Spring Pulsar 2.0.5 release](https://github.com/spring-projects/spring-pulsar/releases/tag/v2.0.5), [Spring for Apache Pulsar project page](https://spring.io/projects/spring-pulsar)
- author: Soby Chacko ve Spring Pulsar maintainers
- date: 20-22 Nisan 2026
- category: messaging, event-driven, observability, compatibility
- tags: spring-pulsar, apache-pulsar, pulsar-4-2, micrometer, spring-framework-7-0-7, boot-4
- summary: `2.0.5`, Pulsar `4.2.0` uyumu ve buna bağlı entegrasyon kırılımlarını toparlıyor; aynı zamanda Spring Framework `7.0.7` ve Micrometer `1.16.5` hizalamasını içeriyor. `1.2.17`, `Boot 3.5.14`; `2.0.5`, `Boot 4.0.6` ve `4.1.0-RC1` hattına bağlanıyor.
- why_it_matters: Event-driven ekiplerde mesajlaşma kütüphanesi sürümü, broker/client sürümü ve ölçümleme zinciri birlikte çalışır; biri tek başına güncellenmez.
- java_spring_relevance: Spring üstünde Pulsar kullanan ekipler için yüksek; genel Spring kitlesi için orta.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Boot 4 tabanlı event-driven servislerde daha temiz sürüm hizalaması ve daha güncel metrics altyapısı.
- risks: Pulsar istemci davranışı, schema/serializer akışı veya testcontainer tabanlı entegrasyon testlerinde sürpriz kırılımlar.
- migration_notes: Upgrade sonrası broker uyumluluğu, yeniden deneme/ack politikaları, schema registry davranışı ve Micrometer etiketleri mutlaka smoke test kapsamına alınmalı.

## Sonuç

29 Mayıs 2026'in en anlamlı Java/Spring sinyali yeni bir mega framework duyurusu değil; Spring AI'nin production bug fix ve contract değişimlerinin aynı anda hızlanması ile Java platformunun concurrency ve teşhis ergonomisini ciddi şekilde cilalaması. Kısa vadede en net aksiyon, Spring AI stable hattında kalan ekiplerin `1.1.7` seviyesine çıkması ve `2.0` geçişi planlayan ekiplerin `M8 -> RC1 -> GA` penceresini dikkatle izlemesi.

Orta vadede ise iki başlık öne çıkıyor: virtual-thread tabanlı servis mimarilerinde structured concurrency'nin olgunlaşması ve crash sonrası JVM teşhisinin `jcmd` etrafında sadeleşmesi. Buna event-driven stack hizalaması ve AOT'nin üretim gerçekliği eklendiğinde, bugünün mesajı net: Java/Spring ekosistemi 2026'da yalnız daha fazla özellik değil, daha disiplinli çalışma sözleşmeleri ve daha güçlü operability üretiyor.
