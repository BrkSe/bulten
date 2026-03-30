# Günlük Java / Spring Ekosistem Raporu

Tarih: 30 Mart 2026

Bu rapor, 30 Mart 2026 itibarıyla Java, JVM, Spring Boot, Spring Framework, Spring Cloud, Spring AI ve yakın ekosistemde üretim kararlarını etkileyebilecek sinyalleri özetler. Bu turda öncelik; güvenlik, release-train hizalanması, JDK 26 geçiş etkileri ve mimari olarak kalıcı değer taşıyan değişimlere verildi.

## Öne Çıkan Başlıklar

- En acil konu, `Spring Cloud Config Server` için yayımlanan `CVE-2026-22739`. Özellikle native file system veya source control backend kullanan Config Server kurulumlarında dosya dışına erişim ve SSRF riski oluşuyor.
- `Spring Boot 4.1.0-M3` tek başına bir milestone haberi değil; `Boot 4.0.4`, `Boot 3.5.12`, `Security 6.5.9/7.0.4/7.1.0-M3`, `Batch 6.0.3/5.2.5`, `Integration 7.1.0-M3` ve `AMQP 4.1.0-M3` ile birlikte okununca ekosistem hizalanmasının güçlendiği görülüyor.
- `JDK 26`, sadece yeni JEP listesiyle değil, `HttpClient` davranış değişiklikleri, GC throughput kazanımları, heap ergonomisi değişimleri ve `final` alan mutasyon uyarılarıyla gerçek upgrade checklist’i gerektiren bir sürüm.
- `Spring AI 2.0.0-M3`, kırıcı değişiklikler ve CVE düzeltmeleri içerirken; agent skills, ask-user, todo, subagent ve A2A desenleri Java tarafında daha ciddi bir agent platformu zemini oluşturuyor.
- `Spring Modulith 2.1 M2` ile gelen outbox tabanlı event externalization, modüler monolith ile güvenilir event yayınlama arasındaki boşluğu kapatma yönünde güçlü bir mühendislik sinyali.

## Kritik Güncellemeler

- `Spring Cloud Config 5.0.2 / 4.3.2 / 4.2.6 / 4.1.9 / 3.1.13` sürümleri `CVE-2026-22739` düzeltmesini içeriyor. OSS tarafında özellikle `5.0.2` ve `4.3.2`, enterprise support tarafında `4.2.6`, `4.1.9`, `3.1.13` hedef sürümler.
- `Spring Boot 3.5.12`, daha önce duyurulan iki ayrı Actuator auth bypass CVE’sini kapatıyor. `Boot 4.0.4` aynı dal için bakım tabanı sağlıyor.
- `Spring Boot 4.1.0-M3`, `Spring gRPC`, `OpenTelemetry` iyileştirmeleri, `Log4j` file rotation, `Spring Batch + MongoDB`, `RabbitMQ Streams SSL` ve `AMQP 1.0` desteğiyle platform yönünü daha net hale getiriyor.
- `JDK 26` GA ile `HTTP/3`, `AOT cache with any GC`, `G1 throughput` iyileştirmesi ve `final field` mutasyon uyarıları artık teorik değil, doğrudan upgrade etkisi taşıyan başlıklar.
- `Spring AI 2.0.0-M3`, hem güvenlik düzeltmeleri hem de `MCP` paket taşınmaları, `Jackson 3` geçişi ve `ToolContext` davranış değişimi nedeniyle kontrollü yükseltme gerektiriyor.

## Trendler ve Sinyaller

### 1. Konfigürasyon düzlemi tekrar güvenlik odağına girdi

Bu turdaki en güçlü kısa vadeli sinyal, merkezi konfigürasyon altyapısının sadece “internal-only yardımcı servis” gibi düşünülmemesi gerektiği. `Spring Cloud Config` için yeni CVE ve kısa süre önce `Spring Boot Actuator` tarafında görülen auth bypass açıkları birlikte okunduğunda, yönetim ve konfigürasyon yüzeyinin tekrar yüksek öncelikli tehdit modeli alanı olduğu görülüyor.

Değerlendirme: Bu gürültü değil. Kalıcı mühendislik değeri taşıyan bir operasyonel uyarı.

### 2. Boot 4 hattı artık tekil milestone değil, release-train hizalanması sinyali

Bu, kaynaklardan çıkardığım bir çıkarım: `Boot 4.1.0-M3`, `Framework 7`, `Security 7.1.0-M3`, `Integration 7.1.0-M3`, `Batch 6`, `AMQP 4.1.0-M3` ve toplulukta `Boot 4 / Framework 7` üzerine artan öğretici içerikler birlikte okunduğunda, ekosistemin yeni platform hattını etrafında toplamaya başladığı görülüyor.

Değerlendirme: Kısa vadede üretime toplu göç anlamına gelmez; ama 2026 platform planlarında artık “bekleyelim, çok erken” demek zorlaşıyor.

### 3. JDK 26 bir dil sürümünden çok operasyon sürümü gibi davranıyor

`HTTP/3`, timeout davranışı değişimi, `Content-Length` davranışındaki RFC uyumu, `InitialRAMPercentage` varsayılanının kalkması ve G1 throughput kazanımları; bu sürümü özellikle container, proxy, ağ ve gözlemlenebilirlik ekseninde önemli hale getiriyor.

Değerlendirme: Dayanıklı değer. Özellikle platform mühendisliği ve SRE ile ortak çalışan Java ekipleri için yüksek öncelik.

### 4. Spring AI tarafında değer artıyor, istikrar hâlâ düşük

Resmi release duyuruları ve mühendislik yazıları, Spring AI’nin artık sadece model çağrısı sarmalayan bir katman değil; agent skills, insan-onaylı akışlar, görev listeleri, alt ajanlar ve A2A gibi desenlerle platformlaşmaya gittiğini gösteriyor. Buna karşılık, sürüm hattı hâlâ hızlı kırılıyor.

Değerlendirme: Orta vadede kalıcı değer potansiyeli yüksek; kısa vadede kontrollü PoC alanı.

### 5. Modüler monolith ile güvenilir event yayınlama arasındaki boşluk kapanıyor

`Spring Modulith` içindeki outbox tabanlı externalization desteği, modüler monolith kullanan ekiplerde “domain event yazdık ama dış dünyaya güvenilir nasıl çıkaracağız?” sorusuna daha ürünleşmiş bir cevap veriyor.

Değerlendirme: Hype değil. Özellikle event-driven geçiş yapan ekipler için pratik değer taşıyor.

### Relevans sıralaması

1. `Spring Cloud Config` CVE düzeltmesi
2. `JDK 26` upgrade etkileri
3. `Boot 4.1` ve ilişkili Spring release-train hizalanması
4. `Spring AI` kırıcı değişimler + platformlaşma
5. `Spring Modulith` outbox desteği
6. Düşük öncelik: yeni OSS araç sinyalleri (`Hardwood` gibi daha niş alanlar)

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: güvenlik yamaları, JDK 26 runtime davranışları, Boot 4 ekosistem hizası, Modulith outbox yaklaşımı.
- İzlenmeli ama hemen standardize edilmemeli: Spring AI agentic patterns, AMQP 1.0 on RabbitMQ, HTTP/3 istemci kullanımı.
- Düşük öncelik: vendor paketleme haberleri veya henüz zayıf doğrulanan topluluk release sinyalleri.

## Araçlar ve Kütüphaneler

- `Spring Boot 4.1.0-M3`, yeni servis platformu deneyleri için şu anda en güçlü resmi aday. Özellikle `gRPC`, `OpenTelemetry`, mesajlaşma ve batch tarafını tek platform altında topluyor.
- `Spring Modulith 2.1.0-M2`, outbox tabanlı event externalization ve gelişmiş modül testleriyle mimari araç setini güçlendiriyor.
- `Spring Integration 7.1.0-M3`, `SFTP` metadata anahtar davranışı, `MQTTv5` shared subscription pattern desteği ve nullability iyileştirmeleriyle entegrasyon ekipleri için anlamlı bir milestone.
- `Spring AI` çevresindeki `spring-ai-agent-utils` desenleri, Java tarafında agentik iş akışlarını ürünleştirmek isteyen ekipler için dikkat çekici.
- Düşük öncelik: Gunnar Morling’in `Hardwood` duyurusu, Parquet işleyen JVM servisleri için ilginç; tipik Spring Boot CRUD/microservice ekipleri için doğrudan öncelikli değil.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Cloud Config Server` kullanıyorsanız, bunu sadece dependency upgrade olarak değil, bir saldırı yüzeyi envanteri işi olarak ele almalısınız.
- `Boot 3.5.x` hattında kalan ekipler için mantıklı temel hareket hâlâ güvenlik yamalı tabana oturmak; yeni özellikleri bunun üstüne değerlendirmek.
- `Boot 4` ve `Framework 7` artık sadece keşif değil, pilot planlama aşamasına geçti. Ama bu göç; `Cloud`, `Security`, `Messaging`, `Observability`, `Jackson`, test altyapısı ve kurumsal starter’larla birlikte ele alınmalı.
- `JDK 26` denemeleri benchmark ile sınırlı kalmamalı; timeout, heap ergonomisi, proxy davranışı, reflection ve observability tarafı birlikte test edilmeli.
- `Spring AI` denemeleri yapacaksanız, bunu platform deney katmanında izole tutmak daha rasyonel. M3 düzeyindeki kırıcı değişimleri core servislerin içine gömmek gereksiz risk üretir.

## Fırsatlar ve Riskler

### Fırsatlar

- `Boot 4.1` ile gRPC, OTel ve mesajlaşma tarafında daha bütünlüklü bir platform standardı oluşturmak.
- `JDK 26` ile startup, tail latency ve ağ davranışını daha bilinçli optimize etmek.
- `Spring Modulith` ile modüler monolith içinde güvenilir event externalization elde ederek özel outbox kodunu azaltmak.
- `Spring AI` ile açıklanabilir, insan geri bildirimli ve çok ajanlı iş akışlarını Java ekosisteminde daha doğal kurmak.

### Riskler

- Config Server yükseltmesini ertelemek, merkezi konfigürasyon düzlemini SSRF veya istenmeyen dosya erişimi riski altında bırakabilir.
- `JDK 26` geçişinde timeout kapsamı, `Content-Length` beklentisi ve heap ergonomisi değişimleri sessiz davranış farkları yaratabilir.
- `Boot 4` göçünde release-train hizası kaçarsa en büyük maliyet framework değil, bağımlılık zinciri ve test altyapısı olur.
- `Spring AI 2.0.0-M3`’e hazırlıksız geçiş, `MCP` artifact taşınmaları ve `Jackson 3` nedeniyle build/runtime kırıkları doğurabilir.
- Milestone seviyesindeki projelerde erken standardizasyon, geri alma maliyetini yükseltir.

## İzlenmesi Gereken Konular

- `Spring Cloud Config` CVE düzeltmesinden sonra ek mitigation veya follow-up advisory gelip gelmeyeceği.
- `Boot 4.1.0-M4/RC` sürecinde `gRPC`, `OTel`, `AMQP 1.0` ve `RabbitMQ Streams SSL` desteğinin ne kadar stabilize olacağı.
- `JDK 26` için framework ve kütüphane ekosisteminin `final field mutation` uyarılarına nasıl adapte olacağı.
- `Spring AI 2.0.0-M4` ile `JSpecify/null-safety` ve upgrade notlarının nereye oturacağı.
- `Spring Modulith 2.1` hattının RC/GA aşamasında outbox desteğinin operasyonel olgunluğunun nasıl netleşeceği.
- `Spring Data Valkey` tarafındaki sürüm/konumlandırma görünürlüğü. Bu taramada Josh Long özetinde geçen sinyali destekleyen güçlü resmi release notu görünürlüğü sınırlı kaldı; tekrar doğrulanmalı.

## Kaynak Bazlı Bulgular

### 1. Spring Cloud Config Server için yeni güvenlik açığı merkezi konfigürasyon düzlemini hedefliyor

- **title:** Spring Cloud Config `CVE-2026-22739` düzeltmesi
- **source:** [Spring advisory](https://spring.io/security/cve-2026-22739), [release post](https://spring.io/blog/2026/03/23/spring-cloud-config-5-0-2-4-3-2-4-2-6-4-1-9-3-1-13-released)
- **author:** Spring Security Team; Ryan Baxter
- **date:** 23 Mart 2026
- **category:** Güvenlik / Konfigürasyon yönetimi
- **tags:** `spring-cloud-config`, `cve`, `ssrf`, `config-server`, `security`
- **summary:** Profil parametresi substituion akışı, native file system backend’de tanımlı arama dizinleri dışına erişimi; source control backend’de ise repository URL’si üzerinden SSRF senaryolarını mümkün kılabiliyor.
- **why_it_matters:** Config Server çoğu mikroservis topolojisinde bir kontrol düzlemidir. Buradaki zafiyet, tek bir servis bug’ından daha geniş etki alanı üretir.
- **java_spring_relevance:** `Spring Cloud Config Server` kullanan tüm Spring ekipleri için doğrudan ilgili. Özellikle native veya git backend kullanan kurulumlarda etkisi yüksek.
- **actionability:** Hemen aksiyon
- **impact_level:** Yüksek
- **opportunities:** Config plane hardening, network segmentation, authentication, audit ve config repo erişim modelini yeniden gözden geçirmek için güçlü bir tetikleyici.
- **risks:** Dosya sızıntısı, SSRF pivot’u, merkezi konfigürasyon zincirinin saldırı yüzeyine dönüşmesi.
- **migration_notes:** `5.0.x -> 5.0.2`, `4.3.x -> 4.3.2` OSS tarafında yükseltilmeli. Enterprise support hatları için `4.2.6`, `4.1.9`, `3.1.13` hedeflenmeli. Yükseltme sonrası custom placeholder/profil kullanım senaryoları regresyon testinden geçirilmeli.

### 2. Spring Boot 4.1 M3 ve eşlik eden release dalgası yeni platform hattının etrafında hizalanma sinyali veriyor

- **title:** `Boot 4.1` çevresinde release-train hizalanması güçleniyor
- **source:** [Boot 4.1.0-M3](https://spring.io/blog/2026/03/20/spring-boot-4-1-0-M3-available-now), [Boot 3.5.12](https://spring.io/blog/2026/03/19/spring-boot-3-5-12-available-now), [Framework 6.2.17 / 7.0.6](https://spring.io/blog/2026/03/13/spring-framework-6-2-17-and-7-0-6-available-now), [Spring Batch 6.0.3 / 5.2.5](https://spring.io/blog/2026/03/18/spring-batch-6-0-3-and-5-2-5-available-now), [Spring Integration 7.1.0-M3](https://spring.io/blog/2026/03/18/spring-integration-7-1-0-m3-available), [This Week in Spring - March 24th, 2026](https://spring.io/blog/2026/03/24/this-week-in-spring-march-24th-2026), [Baeldung: Boot 4 & Framework 7](https://www.baeldung.com/spring-boot-4-spring-framework-7), [Burak KUTBAY: API Versiyonlama – Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/)
- **author:** Phil Webb; Moritz Halbritter; Brian Clozel; Mahmoud Ben Hassine; Glenn Renfro; Josh Long; Ralf Ueberfuhr; Burak KUTBAY
- **date:** 13 Mart 2026 - 24 Mart 2026
- **category:** Platform evrimi / Release-train hizalanması
- **tags:** `spring-boot-4`, `spring-framework-7`, `spring-security`, `spring-batch`, `spring-integration`, `grpc`, `otel`
- **summary:** `Boot 4.1.0-M3`; `Spring gRPC`, `OpenTelemetry` iyileştirmeleri, `Log4j` file rotation, `Spring Batch MongoDB`, `RabbitMQ Streams SSL` ve `AMQP 1.0` desteği getiriyor. Aynı dönemde bakım ve milestone sürümlerinin yığılması, yeni platform hattının çevresinin de toparlandığını gösteriyor.
- **why_it_matters:** Büyük platform geçişlerinde asıl kritik eşik, çekirdek framework’ten çok çevresindeki release-train ve araç desteğinin olgunlaşmasıdır.
- **java_spring_relevance:** Yeni servis standardı belirleyen, 2026 platform yol haritası hazırlayan veya `Boot 4` pilotu planlayan ekipler için yüksek ilgili.
- **actionability:** Pilot / planla
- **impact_level:** Yüksek
- **opportunities:** gRPC, OTel, API versioning ve daha güçlü mesajlaşma desteğini tek platform standardı altında birleştirmek.
- **risks:** Milestone sürümler nedeniyle davranış değişimi; bağımlılık uyumsuzluğu; kurum içi starter, test ve observability zincirinde kırılma.
- **migration_notes:** Brownfield servislerde önce güvenlik yamalı `Boot 3.5.12` tabanına oturmak mantıklı. Greenfield veya sınırlı pilotlarda `Boot 4.1` değerlendirilebilir. `Cloud`, `Security`, `Messaging`, `Jackson`, test altyapısı ve custom starter uyumluluk envanteri çıkarılmalı.

### 3. JDK 26 geçişi davranışsal farklılıklar nedeniyle ciddi bir test turu gerektiriyor

- **title:** `JDK 26`, runtime ve operasyon davranışını doğrudan değiştiriyor
- **source:** [Oracle: The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [Inside Java: HTTP Client Updates in Java 26](https://inside.java/2026/03/04/jdk-26-http-client/), [Inside Java: Java 26 for DevOps](https://inside.java/2026/03/02/jdk-26-rn-ops/), [JEP 517](https://openjdk.org/jeps/517), [JEP 516](https://openjdk.org/jeps/516), [JEP 522](https://openjdk.org/jeps/522), [JEP 500](https://openjdk.org/jeps/500), [InfoQ: Java 26 released](https://www.infoq.com/news/2026/03/java26-released/)
- **author:** Sharat Chander; Billy Korando; Daniel Fuchs; Erik Österlund; Ivan Walulya; Ron Pressler; Michael Redlich
- **date:** 2 Mart 2026 - 18 Mart 2026
- **category:** JDK / Runtime / Operasyon
- **tags:** `jdk-26`, `http3`, `g1gc`, `aot-cache`, `final-fields`, `container`, `httpclient`
- **summary:** `HTTP/3` opt-in desteği geldi; `HttpClient` timeout’u artık body tüketimini de kapsıyor; body’siz `POST/PUT` dışı isteklerde `Content-Length` artık gönderilmiyor; `G1` için %5-15 throughput artışı gözlemleniyor; `InitialRAMPercentage` varsayılanı kaldırılıyor; `final` alanları deep reflection ile mutasyona uğratan kullanım desenleri uyarı üretmeye başlıyor.
- **why_it_matters:** Bu değişiklikler kod derlenirken değil, gerçek ortamda ağ, heap, timeout ve reflection davranışı üzerinden sürpriz yaratır.
- **java_spring_relevance:** Spring Boot servisleri, `RestClient`/`WebClient` ekosistemi, container limitleri, reflection kullanan kütüphaneler ve modern observability stack’leri doğrudan etkilenir.
- **actionability:** Laboratuvar testi başlat / upgrade checklist çıkar
- **impact_level:** Yüksek
- **opportunities:** Daha iyi startup, daha iyi ağ verimi, daha düşük tail latency, G1 ile daha yüksek throughput.
- **risks:** Proxy veya ara katmanlarla HTTP/3 davranış farkları, büyük response body’lerde timeout sürprizleri, `Content-Length` beklentisi olan legacy uçlar, reflection tabanlı kütüphanelerde warning/future breakage.
- **migration_notes:** Ağ testleri gerçek proxy/load balancer zinciriyle yapılmalı. Timeout değerleri büyük body senaryoları için tekrar kalibre edilmeli. Heap yönetimi `-Xms/-Xmx` veya explicit yüzde ayarları ile yeniden gözden geçirilmeli. `final` field mutasyonu yapan kütüphaneler erken tespit edilmeli.

### 4. Spring AI tarafında platform yüzeyi genişliyor, ancak yükseltme disiplini zorunlu

- **title:** Spring AI’de aynı anda hem güvenlik düzeltmesi hem de mimari genişleme var
- **source:** [Spring AI 2.0.0-M3 / 1.1.3 / 1.0.4](https://spring.io/blog/2026/03/17/spring-ai-2-0-0-M3-and-1-1-3-and-1-0-4-available), [Agent Skills](https://spring.io/blog/2026/01/13/spring-ai-generic-agent-skills/), [AskUserQuestionTool](https://spring.io/blog/2026/01/16/spring-ai-ask-user-question-tool), [TodoWrite](https://spring.io/blog/2026/01/20/spring-ai-agentic-patterns-3-todowrite/), [Subagent Orchestration](https://spring.io/blog/2026/01/27/spring-ai-agentic-patterns-4-task-subagents/), [A2A Integration](https://spring.io/blog/2026/01/29/spring-ai-agentic-patterns-a2a-integration), [Baeldung: Explainable AI Agents with Spring AI](https://www.baeldung.com/spring-ai-explainable-agents-capture-llm-tool-call-reasoning)
- **author:** Christian Tzolov; Ilayaperumal Gopinathan; Kostiantyn Ivanov
- **date:** 13 Ocak 2026 - 17 Mart 2026
- **category:** AI platformu / Agentik uygulama mimarisi
- **tags:** `spring-ai`, `mcp`, `jackson-3`, `a2a`, `subagents`, `explainability`
- **summary:** `Spring AI 2.0.0-M3`, `CVE-2026-22729` ve `CVE-2026-22730` düzeltmeleriyle birlikte geldi; ama aynı sürümde `MCP` annotation/package taşınmaları, `MCP transport` artifact relocation, `Jackson 3` geçişi ve `ToolContext` davranış değişimi gibi kırıcı farklar da var. Resmi mühendislik içerikleri ise agent skills, insanla netleştirme, görev takibi, subagent ve A2A gibi daha olgun desenlere işaret ediyor.
- **why_it_matters:** Java ekipleri için AI tarafında gerçek risk, model entegrasyonu değil; hızla evrilen API yüzeyi, güvenlik sınırları ve operasyonel gözlemlenebilirliktir.
- **java_spring_relevance:** Spring ekosisteminde LLM/agent yetenekleri kurmak isteyen ekipler için doğrudan ilgili; ama klasik Spring projelerine göre sürüm istikrarı daha düşük.
- **actionability:** Kontrollü PoC / sıkı versiyon yönetimi
- **impact_level:** Orta-Yüksek
- **opportunities:** Vendor-agnostic AI katmanı, insan-onaylı akışlar, çok ajanlı mimari, araç çağrısı açıklanabilirliği ve yerel model kullanım desenleri.
- **risks:** Kırıcı API değişimleri, hızlı paket taşınmaları, güvenlik yamalarını kaçırma, audit ve debug görünürlüğünün zayıf kalması.
- **migration_notes:** `2.0.0-M3` yükseltmesi upgrade notları okunmadan yapılmamalı. AI entegrasyonları mümkünse ayrı bounded context veya ayrı deployment içinde tutulmalı. Tool-call audit/log akışı baştan tasarlanmalı.

### 5. Spring Modulith 2.1 M2, outbox tabanlı event externalization ile mimari boşluğu kapatıyor

- **title:** Spring Modulith’te güvenilir dış olay yayını artık daha ürünleşmiş
- **source:** [Spring Modulith 2.1 M2 release post](https://spring.io/blog/2026/02/19/spring-modulith-2-1-m2-2-0-3-and-1-4-8-released), [Spring Modulith 2.1 docs](https://docs.spring.io/spring-modulith/reference/2.1/index.html), [Appendix / compatibility](https://docs.spring.io/spring-modulith/reference/2.1/appendix.html)
- **author:** Oliver Drotbohm
- **date:** 19 Şubat 2026
- **category:** Mimari / Event-driven / Modüler monolith
- **tags:** `spring-modulith`, `outbox`, `event-externalization`, `modular-monolith`, `testing`
- **summary:** `Spring Modulith 2.1 M2`, `Namastack Outbox` ile outbox tabanlı event externalization desteği getiriyor. Bu yaklaşım, çok instance’lı yapılarda sıralı yayınlama ihtiyacına daha doğrudan cevap veriyor. Ayrıca modül testleri ile Spring Boot yatay slice testlerinin birleştirilebilmesi ve event yakalama davranışındaki iyileştirmeler dikkat çekiyor.
- **why_it_matters:** Modüler monolith kullanan ekiplerin en zorlandığı yerlerden biri, iç domain event’leri güvenilir şekilde dış sistemlere taşımaktır.
- **java_spring_relevance:** DDD, domain events, outbox pattern veya modüler monolith kullanan Spring Boot ekipleri için çok ilgili.
- **actionability:** Seçili pilot / mimari değerlendirme
- **impact_level:** Orta-Yüksek
- **opportunities:** Kendi outbox altyapısını sıfırdan yazma ihtiyacını azaltmak, modül sınırlarını daha güvenilir test etmek, event-driven geçişi daha kontrollü yapmak.
- **risks:** Milestone sürüm kullanımı, operasyonel bağımlılıklar, sıra garantisi ve idempotency tasarımını yanlış varsaymak.
- **migration_notes:** Halihazırda domain event kullanan ekipler için iyi bir pilot adayı. Outbox şeması, retry, delivery semantics ve tüketici idempotency stratejileri birlikte değerlendirilmeli.

### 6. Düşük öncelikli ama izlenebilir araç sinyali: Hardwood

- **title:** `Hardwood`, Java 21+ için yeni bir Parquet parser olarak ortaya çıktı
- **source:** [Hardwood: A New Parser for Apache Parquet](https://www.morling.dev/blog/hardwood-new-parser-for-apache-parquet/)
- **author:** Gunnar Morling
- **date:** 26 Şubat 2026
- **category:** OSS araç / Veri işleme
- **tags:** `java-21`, `parquet`, `performance`, `data-processing`, `gunnar-morling`
- **summary:** `Hardwood`, minimal bağımlılık ve performans odağıyla yeni bir Parquet parser olarak duyuruldu. Tüm temel Parquet kolon tipleri, encoding ve compression tipleri destekleniyor; predicate push-down ve `parquet-java` uyumluluk katmanı ise roadmap’te.
- **why_it_matters:** JVM üzerinde Parquet işleyen veri servisleri için daha hafif ve potansiyel olarak daha performanslı alternatifler doğuyor.
- **java_spring_relevance:** Tipik Spring Boot CRUD/microservice ekipleri için düşük öncelik; ama `Spring Batch`, veri platformu veya object storage tabanlı iş akışlarında ilgili olabilir.
- **actionability:** İzle / düşük öncelik
- **impact_level:** Düşük-Orta
- **opportunities:** Daha düşük dependency footprint, veri işleme servislerinde daha kontrollü performans denemeleri.
- **risks:** `Alpha1` olgunluğu, predicate push-down eksikliği, üretim kullanımında erken davranma maliyeti.
- **migration_notes:** Kritik üretim hattında hemen standardize etmek yerine benchmark ve uyumluluk testi yapılmalı. Mevcut `parquet-java` kullanımına göre gerçek dosya setleriyle karşılaştırma gerekir.

## Sonuç

Bugünün en net mühendislik kararı, `Spring Cloud Config` kullanan ekiplerin `CVE-2026-22739` düzeltmesini bekletmemesi. Hemen arkasından gelen ikinci önemli başlık, `JDK 26` geçişinin klasik “minor release” zihniyetiyle ele alınmaması gerektiği.

Orta vadede ise üç kuvvetli tema öne çıkıyor: `Boot 4` ekosistem hizasının güçlenmesi, `Spring AI` tarafında kontrollü ama ciddi bir platform arayışının hızlanması ve `Spring Modulith` ile event externalization gibi daha önce ekiplerin kendisinin çözmek zorunda kaldığı sorunların ürünleşmeye başlaması.
