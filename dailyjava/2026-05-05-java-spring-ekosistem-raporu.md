# Günlük Java / Spring Ekosistem Raporu

Tarih: 5 Mayıs 2026  
Tarama zamanı: 5 Mayıs 2026 09:11 TSİ  
Odak: Spring Data 2026.0 RC1’in veri/Redis etkisi, Spring AI 2.0.0-M5’in gerçek migration yüzeyi, JDK tarafında immutability ve güvenli başlatma çizgisinin sertleşmesi

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring Cloud proje sayfası](https://spring.io/spring-cloud), [Spring AI proje sayfası](https://spring.io/projects/spring-ai), [Spring Data 2026.0.0-RC1 duyurusu](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC), [Spring AI 2.0.0-M5 GitHub release notları](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M5), [Spring AI 1.0.6 / 1.1.5 / 2.0.0-M5 blog duyurusu](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/), [Spring Cloud 2025.0.2](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released), [Spring Cloud 2025.1.1](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released), [OpenJDK JEP 500](https://openjdk.org/jeps/500), [OpenJDK JEP 531](https://openjdk.org/jeps/531), [OpenJDK JEP 513](https://openjdk.org/jeps/513), [JDK 25 proje sayfası](https://openjdk.org/projects/jdk/25/), [JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [Inside Java](https://inside.java/), [Inside Java - Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java roundup - 4 Mayıs 2026](https://www.infoq.com/news/2026/05/java-news-roundup-apr27-2026/), [Baeldung Spring AI Series](https://www.baeldung.com/spring-ai-series), [Baeldung Recursive Advisors](https://www.baeldung.com/spring-ai-recursive-advisors), [Josh Long - This Week in Spring, 28 Nisan 2026](https://spring.io/blog/2026/04/28/this-week-in-spring-april-28-2026/), [Gunnar Morling - Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/) ve [Burak KUTBAY - Java 25 Stable Values API](https://blog.burakkutbay.com/java-25-stable-values-api-nedir-jep-502.html/) incelendi. Oracle Java Blog tarafında bugün Spring ekiplerinin backlog’unu doğrudan değiştirecek yeni bir backend odaklı duyuru yok; bu yüzden raporun ağırlığı Spring release hatları ve OpenJDK yön değişimlerinde tutuldu.

## Öne Çıkan Başlıklar

- Bugünün en az konuşulan ama en pratik Spring sinyali [Spring Data 2026.0.0-RC1](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC): relational upsert, Redis mesajlaşma ve cache reset tarafında doğrudan kod/mimari etkisi var.
- [Spring AI 2.0.0-M5](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M5), yeni provider eklemekten çok bağımlılık yüzeyini sadeleştirip bazı entegrasyonları repo dışına itiyor; bu sürüm “AI feature” değil “migration olayı”.
- OpenJDK tarafında [JEP 500](https://openjdk.org/jeps/500), [JEP 531](https://openjdk.org/jeps/531) ve [JEP 513](https://openjdk.org/jeps/513) birlikte okunduğunda yön açık: Java, güvenli başlatma ve immutability konusunda daha opinionated hale geliyor.
- Spring Cloud dünyasında paralel sürüm hatları bitmiş değil: [2025.0.2](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released) Boot 3.5 hattına, [2025.1.1](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released) ise Boot 4.0.1+ hattına oturuyor.

## Kritik Güncellemeler

### Spring Data 2026.0 RC1 veri katmanında sadece bakım değil davranış farkı getiriyor

[Spring Data 2026.0.0-RC1](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC), Boot 4.1 GA öncesi en anlamlı “uygulama koduna dokunur” Spring bileşenlerinden biri. Relational Template API’sine gelen upsert desteği, özel vendor SQL veya custom repository katmanlarını sadeleştirebilir. Redis tarafında `RedisMessageSendingTemplate`, listener tarafındaki `MessageConverter` semantiğini gönderim tarafına da taşıyor. `RedisCache.resetCaches()` optimizasyonu ise sadece cache için ayrılmış Redis kullanıyorsanız güzel; aynı Redis’i farklı veri türleriyle paylaşıyorsanız `FLUSHDB` yaklaşımı ciddi operasyon riski taşır.

### Spring AI 2.0.0-M5 açık bir sadeleşme getiriyor, ama kod maliyetiyle

[Spring AI 2.0.0-M5 release notları](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M5), Azure OpenAI modülünün kaldırılması, OpenAI resmi Java SDK’sına geçiş, `ChatClient` tarafında `combineWith()` tabanlı yeni options merge davranışı ve MCP Java SDK 2.0.0-M2 kırılımları nedeniyle doğrudan migration konusu. Bu sürümde önemli olan yeni model sayısı değil; hangi modüllerin artık repo içinde olmadığı, hangi yardımcı API’lerin kaldırıldığı ve hangi davranışların artık daha açık biçimde `ChatClient` seviyesine taşındığı.

### JDK tarafında uyarı dönemi başladı, refleksiyon toleransı daralıyor

[JEP 500](https://openjdk.org/jeps/500) ile JDK 26, final alanların deep reflection ile değiştirilmesine uyarı üretmeye başladı; [Inside Java’nın rehberi](https://inside.java/2026/04/27/avoiding-final-field-mutation/) ise bunu nasıl aşmanız gerektiğini açıkça anlatıyor: constructor, record, proxy-record veya daha açık serialization protokolleri. Bu konu yalnız JVM iç işi değil; Spring, Jackson, map/DTO araçları, test fixture’ları ve legacy framework uzantıları bu değişimden dolaylı etkilenebilir.

### Bugün yeni büyük Boot/Security duyurusu yok; önemli olan son haftadaki değişikliklerin gerçek etkisini ayırmak

5 Mayıs 2026 itibarıyla yeni bir Spring Boot veya Spring Security ana duyurusu yok. Bu iyi haber; çünkü ekiplerin bugün yapması gereken iş yeni release kovalamak değil, son 10-15 günlük release dalgasındaki gerçekten maliyetli değişimleri ayıklamak.

## Trendler ve Sinyaller

### 1. Spring ekosisteminde veri katmanı tekrar stratejik hale geliyor

Son haftalarda dikkat çoğunlukla AI ve Boot 4.1 RC üstündeydi; fakat [Spring Data 2026.0 RC1](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC) daha kalıcı mühendislik değeri taşıyor. Upsert, Redis listener/send simetrisi ve toplu cache reset davranışı; büyük kurumsal uygulamalarda basit görünse de en çok tekrar eden yapısal kodu etkiler.

### 2. Spring AI tarafında kalıcı değer provider çoğaltmakta değil, sınırları netleştirmekte

[Spring AI M5 release notları](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M5), [Spring AI Agentic Patterns serisi](https://spring.io/blog/), [Josh Long’un haftalık özeti](https://spring.io/blog/2026/04/28/this-week-in-spring-april-28-2026/) ve [Baeldung Spring AI Series](https://www.baeldung.com/spring-ai-series) birlikte okunduğunda ortak sinyal şu: memory, advisor zinciri, structured output ve MCP/OAuth entegrasyonu kalıcı; provider isimleri ve beta SDK’lar ise daha oynak. Kısa vadeli hype ile uzun vadeli mimari değer burada ayrışıyor.

### 3. JVM “integrity by default” yönüne doğru gidiyor

[JEP 500](https://openjdk.org/jeps/500) ile final alanlara reflektif yazımın kısılması, [JEP 513](https://openjdk.org/jeps/513) ile constructor gövdelerinin daha güvenli yazılabilmesi ve [JEP 531](https://openjdk.org/jeps/531) ile deferred immutability’ye platform desteği verilmesi, tekil JEP’lerden daha büyük bir çizgiyi gösteriyor: Java, güvenli nesne başlatma ve değişmez veri modelini yalnız tavsiye değil, giderek default davranış haline getiriyor.

### 4. Spring Cloud hâlâ çift raylı yönetilmek zorunda

[Spring Cloud 2025.0.2](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released) Boot 3.5.13 üstüne, [Spring Cloud 2025.1.1](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released) ise Boot 4.0.1+ uyumluluğu için çıktı. [Proje sayfasının](https://spring.io/spring-cloud) şu an 2025.1.1 göstermesi, tüm filonun oraya taşınması gerektiği anlamına gelmiyor; 3.5 ve 4.0 filolarını ayrı BOM disipliniyle yönetmek gerekiyor.

### 5. Düşük gürültü ama faydalı bir yan sinyal: Java veri araçları hafifliyor

[Gunnar Morling’in Hardwood 1.0.0.Beta2 duyurusu](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/), Java 21+ odaklı daha hafif Parquet işleme araçlarının olgunlaştığını gösteriyor. Bu, doğrudan her Spring ekibi için kritik değil; ama object storage, lakehouse, CDC arşivi veya analitik veri servisleri olan takımlar için izlemeye değer.

## Araçlar ve Kütüphaneler

- [Spring Data 2026.0.0-RC1](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC): Yüksek öncelik. Özellikle Spring Data Relational ve Redis kullanan ekipler için doğrudan backlog etkisi var.
- [Spring AI 2.0.0-M5](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M5): Yüksek öncelik. Yeni provider değil, yeni bağımlılık sınırları ve migration yüzeyi önemli.
- [Spring Cloud 2025.1.1](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released) ve [2025.0.2](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released): Orta-yüksek öncelik. Çift release train yönetimi gerektiriyor.
- [Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/): Düşük-orta öncelik. Parquet/S3 ağırlıklı Java servisleri varsa POC değeri var.
- [Baeldung Spring AI Series](https://www.baeldung.com/spring-ai-series): Bilgilendirici. Bugün release-seviyesi kritik duyuru yok; ama topluluğun hangi Spring AI soyutlamalarına yatırım yaptığını göstermesi açısından anlamlı.

Bugün testing, observability ve CI/CD tarafında backlog’u zorunlu değiştirecek yeni bir Java/Spring release sinyali bulunmuyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Boot 4.1 pilotu yapan ekipler, Spring Data RC1’i yalnız dependency bump olarak değil; SQL semantiği, Redis topology’si ve cache operasyonu açısından değerlendirmeli.
- Spring AI 2.0 hattına hazırlanan ekipler, kod tabanında `spring-ai-azure-openai`, `spring-ai-openai-sdk`, `ModelOptionsUtils.merge()` ve MCP JSON transitive dependency varsayımlarını açıkça aramalı.
- JDK 26+ benimseyen ekipler, final alan mutasyonu yapan refleksiyon yollarını şimdiden envanterlemeli; warning bugün, exception yarın gelebilir.
- Spring Cloud kullanan platform ekipleri, Boot 3.5 ve Boot 4.0 filoları için ayrı BOM, ayrı test matrisi ve ayrı upgrade playbook’u tutmalı.
- AI tarafında kalıcı kazanç istiyorsanız provider sayısından önce memory, advisor, tool protocol ve authorization katmanını standardize etmek daha doğru yatırım olur.

## Fırsatlar ve Riskler

### Fırsatlar

- Spring Data upsert desteği, vendor özel SQL ve custom save-or-update altyapısını azaltabilir.
- `RedisMessageSendingTemplate`, pub/sub tarafında payload dönüşümünü daha tutarlı hale getirerek custom glue kodunu düşürebilir.
- Spring AI’nin resmi OpenAI SDK’ya geçişi, uzun vadede daha temiz sağlayıcı uyumluluğu ve daha net destek yüzeyi sağlayabilir.
- `LazyConstant` çizgisi olgunlaşırsa, startup-sensitive Java servislerinde “lazy ama JVM-optimize” desenleri standart hale gelebilir.

### Riskler

- `RedisCache.resetCaches()` optimizasyonunu paylaşımlı Redis üzerinde yanlış kullanmak yıkıcı olabilir.
- Spring AI M5, compile-time kırılma ve sessiz davranış farkı üretebilir; özellikle custom options merge ve test wiring tarafında.
- Final field mutation warning’leri, özellikle test altyapılarında ve özel serialization/reflection kodlarında beklenmedik gürültü çıkarabilir.
- Spring Cloud train karışıklığı, compile aşamasında değil runtime’da pahalı classpath ve autoconfiguration sorunları üretebilir.

## İzlenmesi Gereken Konular

- Spring Data 2026.0 GA’nın Mayıs 2026 içinde ne zaman çıktığı ve RC1’deki upsert/Redis davranışlarının aynen korunup korunmadığı.
- Spring AI 2.0 hattında repo dışına taşınan provider entegrasyonlarının nasıl konumlanacağı ve yeni migration dökümanlarının genişleyip genişlemeyeceği.
- JDK final field restrictions’ın warning’den exception’a hangi takvimle sertleşeceği.
- `LazyConstant` API’sinin üçüncü preview sonrası isim ve API yüzeyinde tekrar değişip değişmeyeceği.
- Spring Cloud proje sayfasındaki current version ile Boot 3.5/4.0 filolarındaki gerçek train kullanımı arasında drift oluşup oluşmadığı.
- Oracle Java Blog tarafında JDK 26/27 sonrası backend ekiplerini doğrudan etkileyen yeni runtime veya support-policy duyuruları.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Data 2026.0.0-RC1 veri katmanında gerçek üretim etkisi taşıyor
- source: [Spring Data 2026.0.0-RC1 enters release candidate phase](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC)
- author: Mark Paluch
- date: 17 Nisan 2026
- category: data, redis, relational, release-candidate
- tags: spring-data, upsert, redis, cache, boot-4.1
- summary: Spring Data 2026.0 RC1, Relational Template API’de upsert desteği, `RedisMessageSendingTemplate` ve `RedisCache.resetCaches()` optimizasyonu getiriyor; final GA için Mayıs 2026 hedefleniyor.
- why_it_matters: Bu değişiklikler repository katmanı, Redis event akışları ve cache operasyonlarını doğrudan etkiliyor; dolayısıyla yalnız “framework güncellemesi” değil.
- java_spring_relevance: Spring Data Relational, Redis veya Boot 4.1 pilotu kullanan ekipler için yüksek.
- actionability: boot_4_1_pilotlarinda_upsert_ve_redis_topolojisini_test_et
- impact_level: yüksek
- opportunities: Daha az custom upsert kodu, daha tutarlı Redis message conversion, daha hızlı cache reset akışı.
- risks: Veritabanı bazlı SQL semantiği farkları, paylaşımlı Redis’te `FLUSHDB` yan etkisi, converter uyumsuzluğu.
- migration_notes: Upsert davranışını hedef veritabanlarında contract test ile doğrula; `resetCaches()` optimizasyonunu sadece cache için ayrılmış Redis üzerinde kullan; Redis pub/sub payload formatlarını yeniden test et.

### Bulgu 2

- title: Spring AI 2.0.0-M5 bağımlılık yüzeyini küçültüyor ama migration maliyeti çıkarıyor
- source: [Spring AI 2.0.0-M5 GitHub release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M5), [Spring AI 1.0.6, 1.1.5, 2.0.0-M5 Available Now](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/), [Spring AI project page](https://spring.io/projects/spring-ai)
- author: Ilayaperumal Gopinathan, Spring AI Team
- date: 27 Nisan 2026
- category: ai, migration, dependency-management
- tags: spring-ai, openai-java, azure-openai, mcp, structured-output, combinewith
- summary: M5 ile `spring-ai-azure-openai` kaldırıldı, resmi `openai-java` SDK kullanımı benimsendi, `ChatClient` options merge davranışı `combineWith()` ile yeniden tanımlandı, MCP Java SDK 2.0.0-M2 geçişi ve bazı transitive dependency kaldırımları geldi.
- why_it_matters: Bu sürümde risk, yeni model eklemekten çok mevcut entegrasyonların derleme ve davranış seviyesinde değişmesi.
- java_spring_relevance: Spring AI kullanan veya 2.0 hattına hazırlanan Spring Boot ekipleri için çok yüksek.
- actionability: spring_ai_bagimlilik_ve_merge_davranisini_envanterle
- impact_level: çok-yüksek
- opportunities: Daha temiz sağlayıcı katmanı, resmi SDK ile daha tutarlı destek hattı, structured output pipeline’ında daha esnek custom converter kullanımı.
- risks: Compile-time kırılma, custom chat options birleşim mantığında sessiz davranış farkı, MCP entegrasyonlarında ek migration yükü.
- migration_notes: `spring-ai-azure-openai`, `spring-ai-openai-sdk`, `ModelOptionsUtils.merge()` ve MCP JSON bağımlılık varsayımlarını ara; `ChatClient` options davranışını entegrasyon testleriyle doğrula; repo dışına taşınan sağlayıcılar için alternatif plan oluştur.

### Bulgu 3

- title: JEP 500 ile final alan mutasyonu artık tolere edilen pratik olmaktan çıkıyor
- source: [JEP 500: Prepare to Make Final Mean Final](https://openjdk.org/jeps/500), [Inside Java - Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/)
- author: Ron Pressler, Alex Buckley, Nicolai Parlog
- date: JEP güncellemesi 21 Ocak 2026, rehber yazısı 27 Nisan 2026
- category: jvm, integrity, compatibility
- tags: final-fields, reflection, serialization, jdk26, integrity-by-default
- summary: JDK 26, final alanların deep reflection ile değiştirilmesine warning üretmeye başladı; Inside Java rehberi records, constructor tabanlı yeniden oluşturma ve açık serialization protokollerini öneriyor.
- why_it_matters: Bugün warning olan davranış yarın exception olabilir; bu da refleksiyonla nesne kuran veya mutate eden altyapılarda kırılma riski demek.
- java_spring_relevance: Spring uygulamalarında Jackson uzantıları, custom serializers, test fixture’ları, reflection-heavy yardımcı kütüphaneler ve bazı legacy entegrasyonlar için yüksek.
- actionability: final_field_mutation_envanteri_cikar
- impact_level: yüksek
- opportunities: Daha güvenli nesne modeli, daha iyi JVM optimizasyon potansiyeli, daha açık veri taşıma protokolleri.
- risks: Testlerde warning yağmuru, reflection tabanlı kütüphanelerde gizli uyumsuzluk, serialization shortcut’larının bozulması.
- migration_notes: `Field#setAccessible`, `Field#set`, özel deserialization ve “boş constructor + field fill” yaklaşımlarını ara; mümkünse constructor, record veya proxy-record temelli yeniden kurulum modeline geç.

### Bulgu 4

- title: Lazy Constant ve Flexible Constructor Bodies birlikte daha güvenli lazy initialization yolu açıyor
- source: [JEP 531: Lazy Constants (Third Preview)](https://openjdk.org/jeps/531), [JEP 513: Flexible Constructor Bodies](https://openjdk.org/jeps/513), [JDK 25 project page](https://openjdk.org/projects/jdk/25/), [Burak KUTBAY - Java 25 Stable Values API](https://blog.burakkutbay.com/java-25-stable-values-api-nedir-jep-502.html/)
- author: Per Minborg, Maurizio Cimadamore, Archie Cobbs, Gavin Bierman, Burak KUTBAY
- date: JEP 531 güncellemesi 25 Şubat 2026, JEP 513 teslimi JDK 25, Burak KUTBAY yazısı 22 Haziran 2025
- category: java-language, initialization, performance
- tags: lazy-constant, stable-values, constructor-bodies, startup, immutability
- summary: Java 25’te teslim edilen esnek constructor gövdeleri ve JDK 27 için üçüncü preview’ye gelen `LazyConstant`, JVM-optimize edilebilir ama on-demand çalışan değişmez başlatma desenlerini güçlendiriyor.
- why_it_matters: Bu yön, ad-hoc lazy init ve double-checked locking yerine daha güvenli, daha okunabilir ve gelecekte daha optimize edilebilir bir standart arayışını gösteriyor.
- java_spring_relevance: Özellikle startup hassasiyeti olan Spring servisleri, iç platform kütüphaneleri, logger/client/cache/registry benzeri pahalı nesneleri yöneten ekipler için orta-yüksek.
- actionability: preview_izle_ve_infra_poc_planla
- impact_level: orta-yüksek
- opportunities: Daha iyi startup profili, daha temiz lazy initialization, optimizer dostu değişmez veri yaklaşımı.
- risks: Preview API olduğu için yüzey değişebilir; erken üretim kullanımı teknik borç doğurabilir.
- migration_notes: Public API veya yaygın paylaşılan kütüphane sözleşmelerine henüz koyma; preview branch veya teknoloji radarı seviyesinde POC ile izle.

### Bulgu 5

- title: Spring Cloud tarafında Boot 3.5 ve Boot 4.0 için çift release train disiplini şart
- source: [Spring Cloud 2025.0.2 (aka Northfields) Has Been Released](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released), [Spring Cloud 2025.1.1 (aka Oakwood) Has Been Released](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released), [Spring Cloud project page](https://spring.io/spring-cloud)
- author: Ryan Baxter, Spring Cloud Team
- date: 29 Ocak 2026, 2 Nisan 2026, proje sayfası 5 Mayıs 2026 taraması
- category: cloud-native, compatibility, release-management
- tags: spring-cloud, bom, boot-3.5, boot-4.0, compatibility
- summary: 2025.0.2 release train’i Boot 3.5.13 tabanlı; 2025.1.1 ise Boot 4.0.1 ve sonrası 4.0.x için uyumluluk getiriyor. Proje sayfası bugün 2025.1.1’i öne çıkarıyor.
- why_it_matters: Aynı organizasyonda Boot 3.5 ve 4.0 filoları birlikte yaşıyorsa tek BOM refleksi pahalı çalışma zamanı sorunları üretebilir.
- java_spring_relevance: Spring Cloud Config, Gateway, Stream, OpenFeign, Kubernetes, Circuit Breaker kullanan ekipler için doğrudan yüksek.
- actionability: boot_ve_cloud_bom_matrisini_bugun_dogrula
- impact_level: orta-yüksek
- opportunities: Daha temiz upgrade yolu, train bazlı daha öngörülebilir bakım stratejisi.
- risks: Yanlış BOM eşleşmesi, runtime classpath sürprizleri, autoconfiguration çatışmaları.
- migration_notes: Boot 3.5 ve 4.0 hatlarını ayrı BOM ve ayrı CI matrisiyle yönet; “current version” etiketine bakıp tüm filoyu aynı trene taşımaya çalışma.

### Bulgu 6

- title: Spring AI etrafında kalıcı desen memory, advisors ve MCP tarafında oluşuyor
- source: [This Week in Spring - April 28th, 2026](https://spring.io/blog/2026/04/28/this-week-in-spring-april-28-2026/), [Baeldung Spring AI Series](https://www.baeldung.com/spring-ai-series), [Baeldung Recursive Advisors](https://www.baeldung.com/spring-ai-recursive-advisors)
- author: Josh Long, Baeldung, Ralf Ueberfuhr
- date: 28 Nisan 2026, 29 Nisan 2026, 8 Nisan 2026
- category: ai, architecture, developer-productivity
- tags: spring-ai, memory, advisors, mcp, oauth2, tool-calling
- summary: Hem resmi Spring içerikleri hem topluluk içerikleri, Spring AI’de en yoğun yatırımın provider listesine değil session memory, recursive advisors, MCP ve authorization desenlerine gittiğini gösteriyor.
- why_it_matters: Uzun ömürlü platform yatırımı model sağlayıcısı seçiminde değil; tool contract, memory yönetimi ve güvenlik sınırlarında oluşuyor.
- java_spring_relevance: Spring AI ile gerçek ürün inşa eden ekipler için orta-yüksek; yalnız demo yapan ekipler için daha düşük.
- actionability: agent_memory_ve_tooling_sozlesmelerini_standardize_et
- impact_level: orta
- opportunities: Tekrarlanabilir AI servis mimarisi, provider değiştirilebilirliği, daha net governance.
- risks: Takımın dikkatini provider hype’ına verip memory/authorization mimarisini ertelemesi.
- migration_notes: Erken aşamada advisor zinciri, memory stratejisi, MCP güvenlik modeli ve structured output politikasını yazılı standart haline getir.

## Sonuç

Bugünün en güçlü teknik sinyali, Spring dünyasında release sayısının çokluğundan değil, üç farklı katmanda aynı anda görülen sertleşmeden geliyor: veri katmanında daha güçlü ve daha operasyonel Spring Data davranışları, AI katmanında daha disiplinli bağımlılık ve tool sınırları, JVM tarafında ise daha güvenli başlatma ve immutability varsayımları. Bir senior Java/Spring ekibi için doğru kısa vadeli cevap; yeni oyuncak aramak değil, veri/Redis kararlarını, Spring AI dependency yüzeyini ve JDK reflection alışkanlıklarını sistematik biçimde gözden geçirmek.
