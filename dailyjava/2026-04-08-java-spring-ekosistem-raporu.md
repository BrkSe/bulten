# Günlük Java / Spring Ekosistem Raporu

Tarih: `8 Nisan 2026`

Kapsam: `7 Nisan 2026 09:00 TRT` ile `8 Nisan 2026 09:15 TRT` arasındaki günlük tarama. Önceki raporlarda ayrıntılı işlendiği için `Spring Cloud 2025.0.2 / CVE-2026-22739`, `Spring Security` bakım dalgası, `Tomcat / Log4j` runtime bakımı, genel `JDK 26` operability anlatısı, `Spring Data` typed property paths, `JobRunr` karbon duyarlı scheduling ve `Project Leyden` genel çerçevesi bu raporda tekrar ana bulgu yapılmadı.

Kaynak tarama notu: [Spring Blog](https://spring.io/blog/), Spring proje sayfaları, Spring GitHub release sayfaları, [OpenJDK JDK 26](https://openjdk.org/projects/jdk/26/), [OpenJDK JDK 27](https://openjdk.org/projects/jdk/27/), [JEP 527](https://openjdk.org/jeps/527), [Inside Java](https://inside.java/), Oracle Java kaynakları, [InfoQ Java](https://www.infoq.com/java/), Baeldung, Josh Long'un [This Week in Spring](https://spring.io/blog/2026/04/07/this-week-in-spring-april-07-2026/), Gunnar Morling'in [blog akışı](https://www.morling.dev/), Spring maintainer ve community GitHub kaynakları, JobRunr/JavaClaw akışı ve Burak KUTBAY blogu kontrol edildi. Bugün en güçlü yeni sinyal Spring AI ve agentic Java uygulamalarının operasyonel bileşenlere yaklaşması oldu.

## Öne Çıkan Başlıklar

- Resmi Spring akışında 7 Nisan'da [Spring AI Agentic Patterns Part 6: AutoMemoryTools](https://spring.io/blog/2026/04/07/spring-ai-agentic-patterns-6-memory-tools/) yayımlandı. Bu, Spring AI tarafında sohbet geçmişi dışına çıkan, dosya tabanlı ve sağlayıcı bağımsız uzun dönem agent memory yaklaşımını görünür hale getiriyor.
- Josh Long'un [This Week in Spring, 7 Nisan 2026](https://spring.io/blog/2026/04/07/this-week-in-spring-april-07-2026/) derlemesi, Spring AI + JobRunr + Spring Modulith çizgisinde Java agent runtime denemelerinin hızlandığını gösteriyor. Bu alan henüz standart değil, ama enterprise Java ekipleri için izlenmesi gereken bir uygulama mimarisi sinyali.
- InfoQ tarafındaki [Context-Augmented Generation with Spring Boot](https://www.infoq.com/articles/java-ai-context-augmented-generation/) yazısı, RAG tasarımının artık yalnızca vector search değil, kullanıcı/tenant/yetki/oturum bağlamını yöneten ayrı bir context katmanı gerektirdiğini netleştiriyor.
- Trivago'nun [Spring Boot + GraalVM Native Image üretim deneyimi](https://medium.com/graalvm/inside-trivagos-graalvm-migration-native-image-for-graphql-at-scale-912bca9df841), native image'ın demo seviyesinden gerçek trafik, replica sayısı, CPU kullanımı ve warm-up etkisiyle değerlendirilen bir optimizasyon kararına dönüştüğünü gösteriyor.
- OpenJDK tarafında [JDK 27](https://openjdk.org/projects/jdk/27/) için hedeflenen [JEP 527: Post-Quantum Hybrid Key Exchange for TLS 1.3](https://openjdk.org/jeps/527), Spring servislerinin TLS davranışını uygulama kodu değişmeden etkileyebilecek bir platform güvenliği başlığı olarak izlenmeli.
- Kotlin + Spring Data JPA tarafında JetBrains'in [Spring Data JPA with Kotlin](https://blog.jetbrains.com/idea/2026/03/using-spring-data-jpa-with-kotlin/) yazısı, Kotlin kullanan Spring ekipleri için pratik ama üretim değeri olan JPA modelleme uyarılarını tekrar gündeme taşıyor.

## Kritik Güncellemeler

Bugünkü taramada yeni bir Spring Boot, Spring Framework veya Spring Cloud GA/patch duyurusu tespit edilmedi. [Spring Blog releases](https://spring.io/blog/category/releases/) akışında hâlâ 26 Mart tarihli Spring Boot `3.5.13`, `4.0.5`, `4.1.0-M4`, Spring AI `2.0.0-M4 / 1.1.4 / 1.0.5` ve 2 Nisan tarihli Spring Cloud `2025.0.2` duyuruları önde. Bunlar önceki raporlarda işlendiği için bugün yeni aksiyon olarak tekrar açılmadı.

Bugünün daha kritik platform sinyali JDK 27 TLS hattında. [JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/) şu an hedeflenen özellikler arasında JEP 527'yi listeliyor. [JEP 527](https://openjdk.org/jeps/527), TLS 1.3 için post-quantum hibrit anahtar değişimini Java güvenlik sağlayıcısı ve JSSE davranışı üzerinden getirmeyi hedefliyor. Spring Boot ekipleri için bu doğrudan kod değişikliği değil; ancak `WebClient`, `RestTemplate`, JDBC, messaging client'ları, service mesh dışı TLS ve kurumsal proxy/terminator uyumluluğu açısından test matrisi gerektiren bir runtime değişikliği.

Spring AI tarafında `AutoMemoryTools` güvenlik açısından "hemen üretime alın" değil, "kontrollü pilot yap" başlığıdır. Dosya tabanlı kalıcı hafıza, agent deneyimini güçlendirirken PII, tenant izolasyonu, stale memory, prompt injection ve filesystem yetkisi risklerini büyütür. Özellikle generic `FileSystemTools` yaklaşımı, blog yazısında da belirtildiği gibi sandbox sınırı zayıf olduğundan yalnızca güvenilen ve izole ortamlarda düşünülmeli.

## Trendler ve Sinyaller

1. **Agentic Java artık sadece model çağrısı değil, state ve workflow mimarisi istiyor.**
   Spring AI `AutoMemoryTools`, InfoQ CAG yazısı ve JavaClaw sinyali aynı yöne bakıyor: Java ekipleri LLM entegrasyonunu `ChatClient.call()` seviyesinde bırakırsa production davranışını yönetemez. Kalıcı hafıza, bağlam seçimi, tool güvenliği, job orchestration, event akışı ve yetki modeli ayrı tasarım konuları haline geliyor.

2. **RAG mimarisi "veri getir, prompt'a koy" basitliğinden uzaklaşıyor.**
   Context-Augmented Generation anlatısı, kullanıcı tercihi, tenant bilgisi, role/permission, session history ve domain metadata gibi bağlamların modelden önce bir context manager tarafından seçilmesi gerektiğini vurguluyor. Bu, Spring Security ve domain servisleriyle daha güçlü entegrasyon ihtiyacı doğurur.

3. **Native image kararı artık framework uyumluluğu değil, üretim ekonomisi kararı.**
   Trivago'nun GraalVM deneyimi, warm-up yokluğu, CPU kullanımı ve replica sayısının ölçülmesi gerektiğini gösteriyor. Spring Boot tarafında `RuntimeHints`, build pipeline süresi, debug edilebilirlik ve gözlemlenebilirlik native image pilotunun asıl maliyet kalemleri.

4. **JVM güvenlik varsayılanları TLS seviyesinde değişmeye hazırlanıyor.**
   JDK 27 post-quantum hibrit TLS hedefi, uygulama kodundan ziyade bağlantı topolojisini etkiler. Java servisleri kurumsal proxy, legacy TLS terminator, mTLS gateway veya sıkı `jdk.tls.namedGroups` konfigürasyonu kullanıyorsa erken uyumluluk testi gerekir.

5. **Kotlin + JPA pratikleri olgunlaşıyor ama entity modeli hâlâ dikkat istiyor.**
   JetBrains yazısı Kotlin'in Spring Data JPA ile çalıştığını değil, nasıl çalıştırılırsa daha az risk ürettiğini öne çıkarıyor: `no-arg`, `all-open`, `kotlin-reflect`, data class/entity ayrımı, DTO projection ve SQL bind logging ayarları üretim kalitesi açısından önemli.

## Araçlar ve Kütüphaneler

- `spring-ai-agent-utils / AutoMemoryTools`: [Spring AI Agentic Patterns Part 6](https://spring.io/blog/2026/04/07/spring-ai-agentic-patterns-6-memory-tools/) yazısında anlatılan araç seti, `MEMORY.md` index dosyası ve typed Markdown memory dosyalarıyla uzun dönem hafıza modeli sunuyor. [GitHub projesi](https://github.com/spring-ai-community/spring-ai-agent-utils) Spring AI `2.0.0-M4+` ile kullanılacak örnekleri ve danışman/tool yaklaşımını içeriyor.
- `JavaClaw`: Josh Long'un [7 Nisan haftalık derlemesinde](https://spring.io/blog/2026/04/07/this-week-in-spring-april-07-2026/) işaret ettiği [JavaClaw](https://github.com/jobrunr/javaclaw), Spring Boot, Spring AI, Spring Events, Spring Modulith ve JobRunr üzerinde OpenClaw benzeri agent workflow denemesi. GitHub tarafında yıldız ilgisi var, ancak release olmaması nedeniyle şimdilik production adayı değil, mimari referans.
- `GraalVM Native Image`: Trivago'nun [GraphQL gateway deneyimi](https://medium.com/graalvm/inside-trivagos-graalvm-migration-native-image-for-graphql-at-scale-912bca9df841), Spring Boot + GraalVM geçişini ölçülebilir üretim optimizasyonu olarak ele alıyor. Spring takımları için ana konu native image'ı "hızlıdır" diye değil, replica/CPU/warm-up/test coverage dengesiyle değerlendirmek.
- `OpenJDK JEP 527`: [Post-Quantum Hybrid Key Exchange for TLS 1.3](https://openjdk.org/jeps/527), Java TLS stack'i için takip edilmesi gereken orta vadeli güvenlik değişimi.
- `Spring Data JPA + Kotlin`: [JetBrains yazısı](https://blog.jetbrains.com/idea/2026/03/using-spring-data-jpa-with-kotlin/), özellikle Kotlin'e parça parça geçen Spring Boot ekipleri için entity/repository tasarım checklist'i olarak kullanılabilir.
- `TornadoVM 4.0`: InfoQ'nun Java roundup'ında görünen bu release, GPU/heterogeneous compute tarafında Java'yı izleyen ekipler için düşük-orta öncelikli bir sinyal. Genel Spring microservice ekipleri için bugün ana aksiyon değildir.
- `Baeldung / Gunnar Morling / Burak KUTBAY`: Baeldung'da JMOD/AOT ve Spring AI çevresinde önceki raporlarla çakışan destekleyici içerikler görüldü; Gunnar Morling'in son ana başlığı `Hardwood 1.0.0.Beta1` önceki raporda işlendi; Burak KUTBAY blogunda bugünkü öncelik sıralamasını değiştiren yeni Java/Spring bulgusu tespit edilmedi.

## Java / Spring Geliştiricileri İçin Etkiler

Spring AI kullanan ekipler için ilk pratik çıkarım, agent state'ini açık bir mimari bileşen olarak ele almak. `ChatMemory`, kısa dönem konuşma penceresi için yeterli olabilir; ama kullanıcı tercihi, proje kararı, domain context ve uzun ömürlü agent öğrenimi için ayrı, denetlenebilir, silinebilir ve tenant bazında izole bir memory katmanı gerekir. `AutoMemoryTools` bu konuda iyi bir örnek, ancak üretim kullanımı için PII redaction, memory retention, audit log ve prompt injection testleriyle birlikte düşünülmeli.

RAG uygulamaları geliştiren Spring ekipleri için CAG yaklaşımı, servis sınırlarını netleştirir. Retrieval pipeline'ı ile authorization/context pipeline'ı aynı şey değildir. Kullanıcı yetkisi, tenant, subscription level, feature flag, domain policy ve session state modelden önce hesaplanmalı; sonra retrieval ve prompt assembly aşamasına kontrollü şekilde aktarılmalı. Bu tasarım Spring Security, domain servisleri ve observability ile birlikte ele alınmazsa RAG çıktısı tutarsız ve denetlenemez hale gelir.

GraalVM Native Image tarafında artık daha rasyonel bir pilot modeli kurulabilir. Spring Boot servisini native image'a taşımadan önce cold start, warm-up, CPU, RSS, tail latency, build süresi, image size, actuator/JFR/logging davranışı ve rollback senaryosu birlikte ölçülmeli. Trivago vakası değerli çünkü native image'ı salt "daha hızlı başlar" iddiasından çıkarıp kapasite planlama verisine bağlıyor.

JDK 27 TLS değişikliği, platform ekiplerinin güvenlik test matrisi içine girmeli. Servis kodu değişmese bile JVM upgrade'i TLS handshake davranışını, upstream uyumluluğunu ve kurumsal terminator/proxy katmanını etkileyebilir. Spring ekipleri özellikle custom TLS ayarı, mTLS, outbound REST client, Kafka/RabbitMQ/JDBC TLS ve eski appliance entegrasyonlarında erken test planı çıkarmalı.

Kotlin kullanan Spring Data JPA ekipleri için JetBrains yazısı basit bir tutorial'dan daha değerli: entity sınıflarında Kotlin data class cazibesine direnmek, `all-open/no-arg` plugin'lerini otomatik değil bilinçli yönetmek, DTO projection ile gereksiz entity hydration'dan kaçınmak ve SQL bind logging'i prod ortamda kapatmak gerçek üretim etkisi olan noktalar.

## Fırsatlar ve Riskler

Fırsatlar:

- Spring AI agent uygulamalarında long-term memory, context manager ve workflow scheduler'ı ayrı bileşenler olarak tasarlamak.
- `AutoMemoryTools` ile düşük riskli bir internal agent üzerinde dosya tabanlı memory pilotu yapmak; silme, güncelleme, konsolidasyon ve audit davranışını ölçmek.
- RAG mimarisinde authorization-aware context assembly standardı çıkarmak.
- Native image adaylarını gerçek üretim metriğiyle seçmek: yüksek warm-up maliyeti, kısa ömürlü pod, yoğun scale-out, pahalı CPU tüketimi.
- JDK 27 EA ile TLS handshake uyumluluk testlerini kurumsal proxy, service mesh ve mTLS kombinasyonlarında erkenden çalıştırmak.
- Kotlin Spring Data JPA projelerinde entity/repository/DTO projection checklist'i oluşturmak.

Riskler:

- Agent memory içine kişisel veri, gizli proje kararı veya tenant'a özel bilgiyi lifecycle ve silme politikası olmadan yazmak.
- Context manager yerine prompt içinde ad hoc policy taşımak; bu, audit ve authorization hatalarını büyütür.
- Native image geçişini tek benchmark veya demo endpoint ile standartlaştırmak; reflection, serialization, logging, metrics ve test coverage borcu üretir.
- `jdk.tls.namedGroups` gibi TLS konfigürasyonlarını fazla daraltmak; post-quantum hibrit TLS geçişinde uyumsuz handshake hataları doğabilir.
- Kotlin JPA entity'lerini data class olarak modelleyip lazy loading, proxy, equals/hashCode ve dirty checking sorunlarını üretime taşımak.
- JavaClaw gibi erken agent runtime denemelerini release ve bakım modeli netleşmeden platform standardı yapmak.

## İzlenmesi Gereken Konular

- Spring AI `AutoMemoryTools` ve `spring-ai-agent-utils` release notlarında API kararlılığı, Spring AI `2.0.0-M4+` uyumluluğu ve sandbox davranışı.
- Spring Boot `4.1` milestone akışında Spring AI ve observability entegrasyonlarının olgunlaşma durumu.
- InfoQ CAG yazısındaki context manager deseninin Spring Security, multitenancy ve vector DB pratikleriyle gerçek projelerde nasıl uygulandığı.
- JavaClaw/JobRunr tabanlı agent workflow yaklaşımının release, lisans, maintenance ve production-hardening durumu.
- GraalVM Native Image ve Spring Boot ekiplerinden yeni production migration vaka çalışmaları.
- JDK 27 EA build'lerinde JEP 527 TLS davranışı, kurumsal TLS terminator/proxy uyumluluğu ve test sonuçları.
- Kotlin + Spring Data JPA tarafında IntelliJ IDEA 2026.1 otomatik plugin/inspection davranışının CI ve build dosyalarıyla tutarlılığı.
- TornadoVM 4.0 ve heterojen compute hattının Java batch, analytics veya düşük gecikmeli compute işlerinde gerçek kullanım bulup bulmadığı.

## Kaynak Bazlı Bulgular

### 1. Spring AI AutoMemoryTools agent memory için somut bir yapı öneriyor

- **title:** `Spring AI AutoMemoryTools ile kalıcı agent memory`
- **source:** [Spring Blog: AutoMemoryTools](https://spring.io/blog/2026/04/07/spring-ai-agentic-patterns-6-memory-tools/), [spring-ai-agent-utils GitHub](https://github.com/spring-ai-community/spring-ai-agent-utils)
- **author:** `Christian Tzolov`
- **date:** `7 Nisan 2026`
- **category:** `ai-agent-memory-governance`
- **tags:** `spring-ai`, `automemorytools`, `chatmemory`, `agent-memory`, `filesystem-tools`, `mcp-adjacent`, `governance`
- **summary:** Spring AI ekosisteminde `AutoMemoryTools` ve `AutoMemoryToolsAdvisor`, konuşma penceresinden bağımsız uzun dönem agent hafızasını typed Markdown dosyaları ve `MEMORY.md` index yaklaşımıyla modellemeyi öneriyor. Araç, `ChatMemory` ile rekabet etmiyor; onu kalıcı, seçilmiş ve daha küçük bir memory katmanıyla tamamlıyor.
- **why_it_matters:** Agent uygulamaları production'a yaklaştıkça memory lifecycle, veri sınıflandırma, silme, güncelleme, audit ve prompt injection riski temel mimari konular haline gelir.
- **java_spring_relevance:** Spring AI kullanan ekipler için bu, `ChatClient` seviyesinden bir üst mimari katmana geçiş sinyali. Advisor zinciri, tool registration, `ChatMemoryAdvisor` ve memory directory seçimi Spring uygulama yapısına doğrudan temas ediyor.
- **actionability:** `near-term-pilot`
- **impact_level:** `medium-high`
- **opportunities:** Internal agent'larda kullanıcı/proje tercihi, domain kararları ve uzun dönem görev bilgisini kontrollü saklamak; provider bağımsız memory modeli kurmak.
- **risks:** PII sızıntısı, tenant izolasyonu hatası, stale memory, prompt injection, dosya yetkisi genişliği, konsolidasyon sırasında yanlış bilgi kaybı.
- **migration_notes:** Önce tek tenantlı ve düşük riskli internal bir agent seçin. Memory root'u sandbox içinde tutun, retention/silme politikası belirleyin, PII redaction ekleyin, `FileSystemTools` genel yaklaşımını üretimde yalnızca ek OS-level sandbox ile düşünün.

### 2. Context-Augmented Generation RAG tasarımında yeni bir katman gerektiriyor

- **title:** `Spring Boot ile Context-Augmented Generation`
- **source:** [InfoQ: Context-Augmented Generation with Spring Boot](https://www.infoq.com/articles/java-ai-context-augmented-generation/)
- **author:** `Thomas Vitale`
- **date:** `2 Nisan 2026`
- **category:** `ai-architecture-and-rag`
- **tags:** `spring-boot`, `spring-ai`, `rag`, `cag`, `context-manager`, `multitenancy`, `authorization`, `prompt-engineering`
- **summary:** Yazı, RAG yaklaşımının çoğu zaman yalnızca retrieval olarak ele alındığını; production sistemlerde kullanıcı profili, tenant, session, security policy ve domain bilgisini yöneten ayrı bir context manager katmanının gerektiğini savunuyor.
- **why_it_matters:** Model çıktısı, yalnızca vektör aramasının bulduğu dokümana değil, hangi bağlamın hangi yetkiyle modele verildiğine bağlıdır. Bu katman yoksa güvenlik, tutarlılık ve audit problemi doğar.
- **java_spring_relevance:** Spring Security, controller/service katmanı, domain repository'leri ve Spring AI `ChatClient` arasında açık bir context assembly sözleşmesi kurmayı gerektirir. Bu, enterprise Spring AI uygulamalarında temel mimari karar haline gelir.
- **actionability:** `design-now`
- **impact_level:** `high`
- **opportunities:** Authorization-aware RAG, daha iyi açıklanabilirlik, tenant izolasyonu, daha temiz prompt assembly, policy testleri.
- **risks:** Prompt içinde kontrolsüz policy taşıma, context bloat, PII sızıntısı, stale session data, retrieval ve authorization katmanlarının karışması.
- **migration_notes:** Mevcut RAG PoC'lerinde prompt'a eklenen tüm context kaynaklarını envantere alın. User/session/tenant/domain/security context'i ayrı nesne ve servislerle üretin; model çağrısı öncesi hangi bağlamın neden eklendiğini loglanabilir hale getirin.

### 3. JavaClaw agent workflow için Spring tabanlı deneysel bir referans sunuyor

- **title:** `JavaClaw: Spring AI + JobRunr + Spring Modulith ile agent workflow denemesi`
- **source:** [This Week in Spring, 7 Nisan 2026](https://spring.io/blog/2026/04/07/this-week-in-spring-april-07-2026/), [jobrunr/JavaClaw GitHub](https://github.com/jobrunr/javaclaw)
- **author:** `Josh Long; JobRunr community`
- **date:** `7 Nisan 2026`
- **category:** `agent-workflow-runtime`
- **tags:** `javaclaw`, `spring-ai`, `spring-boot`, `jobrunr`, `spring-modulith`, `spring-events`, `agentic-workflow`
- **summary:** JavaClaw, OpenClaw benzeri bir Java agent denemesi olarak Spring Boot, Spring AI, Spring Events, Spring Modulith ve JobRunr bileşenlerini birleştiriyor. GitHub üzerinde ilgi görse de release yayımlanmamış durumda.
- **why_it_matters:** Agent uygulamaları yalnızca senkron model çağrısı değil; uzun süren işler, event akışı, modül sınırları, retry ve background execution gerektiriyor.
- **java_spring_relevance:** Bu deneme, Spring ekosistemindeki mevcut building block'ların agent runtime için nasıl bir araya getirilebileceğini gösteriyor. Özellikle Spring Modulith ve JobRunr kullanan ekipler için mimari fikir üretir.
- **actionability:** `monitor-architecture`
- **impact_level:** `medium`
- **opportunities:** Agent workflow'larını Spring-native event ve job modeline oturtmak; PoC'lerde modüler sınır ve async execution tasarımı için referans almak.
- **risks:** Release olmaması, bakım belirsizliği, agent güvenliği, tool execution sınırları, job retry ile LLM idempotency sorunları.
- **migration_notes:** Platform standardı yapmayın. Kodunu mimari referans olarak okuyun; production agent akışları için idempotency key, retry policy, compensation, audit ve tool allowlist tasarımını ayrıca kurun.

### 4. Trivago GraalVM üretim deneyimi native image kararını ölçülebilir hale getiriyor

- **title:** `Spring Boot + GraalVM Native Image ile GraphQL gateway optimizasyonu`
- **source:** [This Week in Spring, 7 Nisan 2026](https://spring.io/blog/2026/04/07/this-week-in-spring-april-07-2026/), [Inside trivago's GraalVM Migration: Native Image for GraphQL at Scale](https://medium.com/graalvm/inside-trivagos-graalvm-migration-native-image-for-graphql-at-scale-912bca9df841)
- **author:** `Alina Yurenko; Hans Puac ve Ayush Chaubey katkılarıyla`
- **date:** `Nisan 2026`
- **category:** `runtime-performance-and-cost`
- **tags:** `graalvm`, `native-image`, `spring-boot`, `graphql`, `gateway`, `startup`, `cpu`, `kubernetes`
- **summary:** Trivago'nun Spring Boot tabanlı GraphQL gateway'ini GraalVM Native Image ile çalıştırma deneyimi, warm-up ortadan kalkması, replica sayısı ve CPU tüketimi gibi üretim metrikleri üzerinden değerlendiriliyor.
- **why_it_matters:** Native image geçişi ancak gerçek trafik, tail latency, CPU, memory, replica ve build/deploy maliyeti birlikte ölçülürse doğru karar olur.
- **java_spring_relevance:** Spring Boot 3.x ve 4.x hattı native image desteğini olgunlaştırdı; ancak her servis uygun aday değildir. Gateway ve kısa ömürlü workload'lar daha iyi aday olabilir.
- **actionability:** `targeted-pilot`
- **impact_level:** `high`
- **opportunities:** Daha düşük warm-up, daha az replica, CPU maliyetinde düşüş, daha hızlı pod readiness, yoğun scale-out senaryolarında daha iyi kapasite kullanımı.
- **risks:** Build süresi, reflection/serialization hint eksikleri, observability farkları, debugging zorluğu, üçüncü parti library uyumsuzluğu.
- **migration_notes:** Önce yüksek warm-up veya yüksek CPU maliyeti olan tek bir servis seçin. JVM baseline, native image ve gerekirse Leyden/jlink varyantlarını aynı yük testiyle kıyaslayın. Runtime hints, actuator, metrics, logging, tracing ve fallback rollout planını test tamamlanmadan standarda dönüştürmeyin.

### 5. JDK 27 post-quantum hibrit TLS Spring servisleri için izlenmeli

- **title:** `JEP 527 ile TLS 1.3 post-quantum hibrit key exchange`
- **source:** [OpenJDK JDK 27](https://openjdk.org/projects/jdk/27/), [JEP 527](https://openjdk.org/jeps/527)
- **author:** `OpenJDK security contributors`
- **date:** `JDK 27 hedef hattı; 8 Nisan 2026 taraması`
- **category:** `jdk-security-and-tls`
- **tags:** `jdk-27`, `tls-1.3`, `post-quantum`, `jsse`, `spring-boot`, `webclient`, `mtls`, `security`
- **summary:** JDK 27 için hedeflenen JEP 527, TLS 1.3 anahtar değişiminde post-quantum hibrit yaklaşımı Java TLS stack'ine getirmeyi hedefliyor.
- **why_it_matters:** TLS davranışı çoğu Java uygulamasında JVM tarafından sağlanır. Güvenlik default'ları değiştiğinde uygulama kodu aynı kalsa bile bağlantı uyumluluğu ve handshake karakteristiği değişebilir.
- **java_spring_relevance:** Spring Boot servisleri outbound HTTP, JDBC, Kafka/RabbitMQ, mTLS gateway ve kurumsal proxy entegrasyonlarında JSSE veya JVM TLS ayarlarına dayanır. JDK upgrade planları bu değişikliği hesaba katmalı.
- **actionability:** `monitor-and-test-ea`
- **impact_level:** `medium-high`
- **opportunities:** Post-quantum hazırlığına uygulama seviyesinde büyük refactor olmadan yaklaşmak; güvenlik test matrisini erkenden güncellemek.
- **risks:** Legacy TLS terminator uyumsuzluğu, daraltılmış `jdk.tls.namedGroups` ayarları, appliance/proxy handshake hataları, düşük görünürlüklü staging farkları.
- **migration_notes:** Şimdilik üretim aksiyonu değil. JDK 27 EA testlerinde TLS kullanan kritik entegrasyonları, özellikle custom truststore/keystore, mTLS ve kurumsal proxy kombinasyonlarını test edin. TLS named group ayarlarını gereksiz daraltmayın.

### 6. Kotlin + Spring Data JPA pratikleri entity modelinde dikkat gerektiriyor

- **title:** `Spring Data JPA with Kotlin üretim checklist'i`
- **source:** [JetBrains IntelliJ IDEA Blog](https://blog.jetbrains.com/idea/2026/03/using-spring-data-jpa-with-kotlin/)
- **author:** `Teodor Irkhin; Thorben Janssen katkısıyla`
- **date:** `Mart 2026; 7 Nisan Spring derlemesinde tekrar öne çıktı`
- **category:** `data-access-and-kotlin`
- **tags:** `spring-data-jpa`, `kotlin`, `hibernate`, `jakarta-persistence`, `dto-projection`, `all-open`, `no-arg`
- **summary:** Yazı, Kotlin'in Spring Data JPA ile kullanılabileceğini; ancak `no-arg`, `all-open`, `kotlin-reflect`, regular class entity modeli ve DTO projection gibi pratiklerin doğru kurulması gerektiğini anlatıyor.
- **why_it_matters:** Kotlin'e parça parça geçen Spring ekiplerinde JPA entity modelini yanlış kurmak lazy loading, proxy, dirty checking, equals/hashCode ve migration sorunlarını büyütür.
- **java_spring_relevance:** Spring Boot + Hibernate kullanan Kotlin servislerinde bu ayarlar doğrudan build dosyası, entity tasarımı, repository API'si ve production logging davranışını etkiler.
- **actionability:** `immediate-for-kotlin-teams`
- **impact_level:** `medium`
- **opportunities:** Daha okunabilir repository ve DTO projection kodu; entity/API ayrımının netleşmesi; IntelliJ IDEA 2026.1 otomatik plugin desteğinden yararlanma.
- **risks:** Entity'leri data class yapmak, prod ortamda SQL bind trace logging bırakmak, Kotlin plugin ayarlarını IDE otomasyonuna fazla güvenerek CI'da kaçırmak.
- **migration_notes:** Kotlin kullanan Spring Data JPA projelerinde build dosyasında `kotlin("plugin.spring")`, `kotlin("plugin.jpa")`, `allOpen/noArg` etkisini CI ile doğrulayın. Entity'leri API DTO'larından ayırın; DTO projection'ı read-heavy endpoint'lerde ölçerek kullanın.

### 7. TornadoVM 4.0 JVM üzerinde heterojen compute için düşük öncelikli izleme sinyali

- **title:** `TornadoVM 4.0 ve Java GPU/heterogeneous compute hattı`
- **source:** [InfoQ Java News Roundup](https://www.infoq.com/news/2026/04/java-news-roundup-mar30-2026/)
- **author:** `Michael Redlich`
- **date:** `6 Nisan 2026`
- **category:** `jvm-compute-tooling`
- **tags:** `tornadovm`, `java`, `gpu`, `heterogeneous-compute`, `batch`, `analytics`, `low-priority`
- **summary:** TornadoVM 4.0 release sinyali, Java kodunun GPU ve farklı hızlandırıcı backend'lerde çalıştırılması alanının aktif kaldığını gösteriyor.
- **why_it_matters:** Çoğu Spring microservice için öncelikli değil; ancak Java tabanlı analytics, batch, image/data processing veya düşük gecikmeli compute işlerinde JVM dışına çıkmadan hızlandırma arayan ekipler için takip edilebilir.
- **java_spring_relevance:** Spring Boot servislerinin büyük çoğunluğu için doğrudan aksiyon yok. Relevance, daha çok Spring Batch veya Java tabanlı compute pipeline içinde CPU-bound workload çalıştıran ekiplerde ortaya çıkar.
- **actionability:** `low-priority-monitor`
- **impact_level:** `low-medium`
- **opportunities:** Compute-heavy Java job'larında laboratuvar benchmark'ı; JVM ekosistemi içinde accelerator kullanımını izleme.
- **risks:** Operasyonel karmaşıklık, donanım bağımlılığı, container scheduling zorluğu, ekip uzmanlığı maliyeti.
- **migration_notes:** Genel Spring platform standardı yapmayın. Sadece CPU-bound ve ölçülebilir darboğazı olan batch/analytics workload için izole benchmark düşünün.

## Sonuç

8 Nisan taramasının ana sonucu, Java/Spring ekosisteminde yeni değerli sinyalin framework release'inden çok üretim mimarisi katmanında gelmesi. Spring AI tarafında memory, context ve workflow sınırları daha belirginleşiyor; bu da agent uygulamalarını basit API entegrasyonundan platform tasarımına taşıyor. GraalVM native image vakaları artık teorik değil, kapasite ve maliyet kararı haline geliyor. OpenJDK JDK 27 TLS yönü ise JVM upgrade'lerinin güvenlik altyapısı üzerinde uygulama kodu değişmeden etkili olabileceğini hatırlatıyor.
