# Günlük Java / Spring Ekosistem Raporu

Tarih: 1 Nisan 2026

Bu rapor, 1 Nisan 2026 itibarıyla Java, JVM, Spring, Spring Boot, Spring Cloud, Spring AI ve yakın ekosistemde üretim kararlarını etkileyebilecek sinyalleri özetler. Bu turda odak, 23-31 Mart 2026 arasında yayımlanan resmi Spring release ve advisory'leri, `JDK 26` resmi notlarını ve ekosistemin Boot 4 / Framework 7 geçişine dair güvenilir ikincil sinyallerini birlikte okumaktır.

## Öne Çıkan Başlıklar

- `Spring Security CVE-2026-22732` kritik seviyede: bazı servlet senaryolarında güvenlik header'ları yazılmayabiliyor. `6.5.9` ve `7.0.4` altındaki hatlar mümkün olan en kısa sürede patch edilmeli.
- `Spring AI 1.1.4 / 1.0.5 / 2.0.0-M4`, sadece feature release değil; `SimpleVectorStore`, `BedrockProxyChatModel`, `Neo4jVectorStore` ve `RedisVectorStore` için dört ayrı güvenlik düzeltmesi taşıyor. AI katmanı artık “sonra bakarız” alanı değil.
- `Spring Boot 4.1.0-M4`, `M3`te gelen Rabbit/AMQP değişikliklerini geri aldı. Bu, `Boot 4.1` milestone hattının ciddi pilot zemini olduğunu ama sözleşme açısından hâlâ oynak kaldığını gösteriyor.
- `Spring Cloud Config CVE-2026-22739` hâlâ yüksek operasyonel önem taşıyor: profil substitüsyonu üzerinden hem istem dışı dosya erişimi hem de SSRF riski var.
- `JDK 26`, Spring ekipleri için teorik bir JDK sürümü değil; `HttpClient` timeout semantiği, `Thread.stop()` kaldırılması, keystore uyarıları, TLS trust değişiklikleri ve reflection/final alan davranışı nedeniyle gerçek migration checklist’i gerektiriyor.

## Kritik Güncellemeler

- `26 Mart 2026`: [`Spring Boot 4.1.0-M4`](https://spring.io/blog/2026/03/26/spring-boot-4-1-0-M4-available-now) yayımlandı. `M3`teki Rabbit/AMQP değişiklikleri `4.2` hattına ertelendi; `application.properties` / `application.yaml` işleme regresyonu düzeltildi.
- `26 Mart 2026`: [`Spring Boot 3.5.13`](https://spring.io/blog/2026/03/26/spring-boot-3-5-13-available-now) ve [`4.0.5`](https://spring.io/blog/2026/03/26/spring-boot-4-0-5-available-now) yayımlandı. Yeni özellik değil, daha güvenli bakım tabanı sunuyorlar.
- `26 Mart 2026`: [`Spring AI 2.0.0-M4 / 1.1.4 / 1.0.5`](https://spring.io/blog/2026/03/26/spring-ai-2-0-0-M4-and-1-1-4-and-1-0-5-available) yayımlandı. Dört CVE düzeltildi, `dynamic structured output control` eklendi, `Vertex AI`, `ZhiPu AI` ve `OCI GenAI` entegrasyon sınıfları deprecated edildi.
- `27 Mart 2026`: [`Spring Modulith 2.1 M4`](https://spring.io/blog/2026/03/27/spring-modulith-2-1-m4-2-0-5-and-1-4-10-released) ile `JobRunr` tabanlı event externalization ve daha iyi AOT desteği geldi.
- `23 Mart 2026`: [`Spring Cloud Config` CVE-2026-22739](https://spring.io/security/cve-2026-22739) için fix release zinciri yayımlandı.
- `19 Mart 2026`: [`Spring Security CVE-2026-22732`](https://spring.io/security/cve-2026-22732) ve `Spring Boot` Actuator odaklı [`CVE-2026-22731`](https://spring.io/security/cve-2026-22731) / [`CVE-2026-22733`](https://spring.io/security/cve-2026-22733) advisories yayımlandı.
- `17 Mart 2026`: [`JDK 26`](https://blogs.oracle.com/java/the-arrival-of-java-26) GA oldu; resmi [`release notes`](https://jdk.java.net/26/release-notes) Spring ekipleri için somut davranış değişiklikleri listeliyor.

## Trendler ve Sinyaller

### 1. Güvenlik yüzeyi artık sadece HTTP endpoint’leri değil; config, AI ve veri filtreleri de aynı önemde

Bu turda en net tekrar eden sinyal, güvenlik açıklıklarının artık yalnızca klasik web katmanında çıkmaması. `Spring Security` header yazımı, `Spring Boot` Actuator path eşleşmeleri, `Spring Cloud Config` profile substitüsyonu ve `Spring AI` vector store / multimodal URL işleme açıkları aynı haftada üst üste geldi. Bu, Java/Spring ekiplerinin patch sürecini ürün bazlı değil platform bazlı yönetmesi gerektiğini gösteriyor.

Değerlendirme: Bu kısa vadeli gürültü değil. 2026 boyunca kalıcı bir operasyon pratiği gerektiriyor.

### 2. `Boot 4` göçü için uyumluluk hattı netleşti, ama `4.1` milestone sözleşmesi henüz sabit değil

[`Spring Cloud` proje sayfası](https://spring.io/projects/spring-cloud/) açık biçimde `2025.1.x (Oakwood) -> Boot 4.0.x`, `2025.0.x (Northfields) -> Boot 3.5.x` eşleşmesini veriyor. [`Spring Cloud 2025.1.1`](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released) ise `Boot 4.0.1+` uyumluluğunu düzeltti. Buna karşılık `Boot 4.1.0-M4`ün `M3` değişikliklerini geri alması, `4.1` milestone’larının hâlâ “pilot” olarak ele alınması gerektiğini gösteriyor.

Değerlendirme: Dayanıklı değer yüksek; fakat `4.1.x` milestone’ları production contract gibi ele alınmamalı.

### 3. `Boot 4 / Framework 7` artık sadece release note konusu değil; eğitim ve göç anlatısı haline geldi

[`Baeldung`](https://www.baeldung.com/spring-boot-4-spring-framework-7), [`Burak KUTBAY` API versiyonlama yazısı](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html), [`Burak KUTBAY` HTTP Service Client yazısı](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html) ve [`Josh Long`un 31 Mart 2026 tarihli özeti](https://spring.io/blog/2026/03/31/this-week-in-spring-march-31st-2026) birlikte okunduğunda Boot 4 / Framework 7 göçü artık “erken haber” değil, ekiplerin eline alınabilir öğrenme ve pilot konusu haline gelmiş durumda.

Değerlendirme: Göçün keşif aşamasından planlama aşamasına geçildiğini gösteren güçlü bir sinyal.

### 4. Modüler monolit + durable background jobs + AOT üçlüsü güçleniyor

`Spring Modulith 2.1 M4` içindeki `JobRunr` event externalization ve `MomentsJacksonModule` AOT iyileştirmesi, mikroservis dışındaki mimari seçeneklerin de Spring ekosisteminde olgunlaştığını gösteriyor. Ayrıca [`JobRunr` dokümantasyonu](https://www.jobrunr.io/en/documentation/configuration/carbon-aware/) `carbon-aware` scheduling’i Spring Boot özellikleriyle doğrudan yapılandırılabilir hale getiriyor; bu, esnek batch işleri için maliyet/enerji optimizasyonu perspektifi sunuyor.

Değerlendirme: Hype değil; fakat etkisi belirli kullanım senaryolarında yüksek.

## Araçlar ve Kütüphaneler

- `Spring Modulith 2.1 M4`, `JobRunr` ile event externalization ve daha iyi AOT desteği nedeniyle bugünün en anlamlı mimari araç sinyali.
- `JobRunr` tarafında `CarbonAwareJobProcessingConfiguration` ile bölge kodu (`BE`, `US-CA`, `IT-NO` vb.) bazlı zamanlama yapılabiliyor; ama bunun için `api.jobrunr.io` erişimi gerekiyor ve servis erişilemiyorsa normal scheduling’e fallback ediliyor. Düşük öncelikli, ama batch ve raporlama işleri için ilginç.
- [`Spring AI MCP Security`](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-security.html) dokümanları, MCP server/client güvenliğini Spring Security ile çözmeye başlıyor; fakat doküman açıkça “work in progress” diyor. Bu modül şu an `1.1.x` hattına, WebMVC sunucularına ve JWT temelli akışlara daha uygun; WebFlux server ve opaque token senaryoları sınırlı.
- Bugünkü taramada tipik Spring backend ekiplerinin hemen standardize etmesi gereken yeni bağımsız bir OSS HTTP, ORM veya messaging kütüphanesi sinyali yok.
- Gunnar Morling tarafında bu turda önceki `Hardwood` duyurusu dışında yeni ve yüksek öncelikli bir Spring/JVM üretim sinyali görünmüyor; bu nedenle düşük öncelik seviyesinde bırakıldı.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Security` kullanan servlet uygulamalarında patch seviyesi sıradan bakım işi gibi ele alınmamalı. `6.5.9` / `7.0.4` geçişi sonrası özellikle cache control, HSTS, CSP, X-Frame-Options ve custom header writer akışları regresyon testine alınmalı.
- `Spring AI` kullanan ekipler, `1.1.4` veya `1.0.5` altındaki hatlarda kalıyorsa user-controlled filtre anahtarları, RediSearch TAG filtre değerleri ve multimodal medya URL’leri için uygulama seviyesinde ek güvenlik kontrolleriyle yetinmeyip patch’e çıkmalı.
- `Boot 4.1.0-M3` deneyen ekipler `M4`e geçerken Rabbit/AMQP starter seçimlerini yeniden doğrulamalı. `M3`te işe yarayan dependency topolojisi `M4`te geçerli olmayabilir.
- `Spring Cloud Config Server` kullanan ekipler profile substitüsyonunu, native backend path sınırlarını ve repo backend URL parametreleşmesini threat model içine yeniden almalı.
- `JDK 26` için migration planı sadece benchmark içermemeli. `HttpRequest.timeout()` davranışı artık response body tüketimini de kapsıyor; `Thread.stop()` artık yok; `JKS/JCEKS` kullanımı geleceğe dönük uyarı alıyor; bazı TLS trust politikaları değişmiş durumda.
- `Boot 4`e geçecek Spring Cloud ekipleri için doğru eşleştirme hattı net: `Boot 4.0.x` ile `Spring Cloud 2025.1.x`, `Boot 3.5.x` ile `Spring Cloud 2025.0.x`.

## Fırsatlar ve Riskler

### Fırsatlar

- `Boot 4.0.5` + `Spring Cloud 2025.1.x` ile daha temiz bir `Boot 4` pilot ring’i kurmak.
- `Spring AI 1.1.4` içindeki `dynamic structured output control` ile LLM çıktısını daha öngörülebilir şemalara zorlamak.
- `Spring Modulith 2.1 M4` ile modüler monolitlerde event publication ve background processing çizgisini sadeleştirmek.
- `JDK 26`nın `HttpClient` ve JDBC 4.5 yenilikleriyle dosya upload, JSON veri tipleri ve ağ davranışlarını daha temiz modellemek.

### Riskler

- `Spring Security` patch’ini ertelemek, uygulamanın yanıt header’larına güvenen savunma katmanlarını sessizce etkisiz bırakabilir.
- `Spring AI`yi user input ile çalışan vector filter veya multimodal URL akışlarında patch’siz bırakmak, SSRF ve hatta RCE sınıfı açıklar doğurabilir.
- `Boot 4.1` milestone’larını production contract gibi ele almak, geri alınan starter değişiklikleri nedeniyle ek refactor maliyeti yaratır.
- `Spring Cloud Config` açığını “yalnızca iç ağda çalışıyor” diyerek küçümsemek, repo backend ve dosya sistemi arka planı kullanan ortamlarda gereksiz risk bırakır.
- `JDK 26`yı yalnızca performans testiyle değerlendirmek, gerçek trafik altındaki timeout, TLS ve legacy API kırılmalarını gözden kaçırır.

## İzlenmesi Gereken Konular

- `Spring Boot 4.1` hattında Rabbit/AMQP yönünün `4.2` tarafında nasıl finalleşeceği.
- `Spring AI` için deprecated edilen `Vertex AI`, `ZhiPu AI` ve `OCI GenAI` entegrasyonları adına resmi replacement path veya yeni sağlayıcı stratejisinin netleşmesi.
- `Spring AI MCP Security` modülünün `1.1.x` dışına ne zaman taşacağı ve WebFlux / opaque token desteğinin gelip gelmeyeceği.
- `JDK 27` tarafında OpenJDK Quality Outreach tarafından duyurulan removal heads-up’ların kurumsal kütüphanelere nasıl yansıyacağı.
- `Spring Cloud 2025.1.x` ve `2025.0.x` servis release’lerinde ek güvenlik ve compatibility güncellemeleri olup olmayacağı.
- `Baeldung`, `Josh Long` ve topluluk yazarlarında `Boot 4 / Framework 7` içeriklerinin “deneme” seviyesinden “migrate ettiğimiz şeyler” seviyesine geçip geçmeyeceği.

## Kaynak Bazlı Bulgular

### 1. `Spring Security` response header yazımı açığı doğrudan patch gerektiriyor

- **title:** `Spring Security CVE-2026-22732` response security headers zincirini kritik biçimde etkiliyor
- **source:** [`Spring Security advisory`](https://spring.io/security/cve-2026-22732)
- **author:** Spring Security Team
- **date:** 19 Mart 2026
- **category:** Güvenlik / HTTP response handling
- **tags:** `spring-security`, `cve-2026-22732`, `servlet`, `headers`, `caching`
- **summary:** Bazı servlet uygulamalarında Spring Security’nin yazması gereken HTTP security header’ları hiç yazılmayabiliyor. Bu durum cache tabanlı veri sızıntısı dahil çeşitli saldırı yüzeylerini açabiliyor.
- **why_it_matters:** Header tabanlı savunmalar görünmez savunma katmanıdır; bozulduğunda çoğu ekip bunu hemen fark etmez.
- **java_spring_relevance:** Servlet tabanlı Spring Boot servislerinin önemli bir kısmı `HttpSecurity.headers()` veya varsayılan header writer’lara dayanır.
- **actionability:** Hemen aksiyon
- **impact_level:** Yüksek
- **opportunities:** Security regression testlerini olgunlaştırmak, header policy’lerini merkezi doğrulamak.
- **risks:** HSTS, cache-control, CSP gibi savunmaların sessizce devre dışı kalması.
- **migration_notes:** Uygun hatta `6.5.9` veya `7.0.4`e çıkın. Patch sonrası reverse proxy arkası davranışı, static content ve login akışlarında header varlığını entegrasyon testiyle doğrulayın.

### 2. `Spring AI` artık sadece özellik değil, doğrudan güvenlik ve provider yaşam döngüsü konusu

- **title:** `Spring AI 2.0.0-M4 / 1.1.4 / 1.0.5` dört CVE düzeltmesi ve provider deprecation sinyali taşıyor
- **source:** [`Release announcement`](https://spring.io/blog/2026/03/26/spring-ai-2-0-0-M4-and-1-1-4-and-1-0-5-available), [`CVE-2026-22738`](https://spring.io/security/cve-2026-22738), [`CVE-2026-22742`](https://spring.io/security/cve-2026-22742), [`CVE-2026-22743`](https://spring.io/security/cve-2026-22743), [`CVE-2026-22744`](https://spring.io/security/cve-2026-22744)
- **author:** Ilayaperumal Gopinathan, Spring AI Team
- **date:** 26 Mart 2026
- **category:** AI platform / güvenlik / sağlayıcı stratejisi
- **tags:** `spring-ai`, `vector-store`, `bedrock`, `neo4j`, `redis`, `structured-output`
- **summary:** Release, `SimpleVectorStore` için SpEL tabanlı RCE, `BedrockProxyChatModel` için SSRF, `Neo4jVectorStore` için SSRF/Cypher injection ve `RedisVectorStore` için RediSearch sorgu enjeksiyonu düzeltmelerini içeriyor. Ayrıca `dynamic structured output control` eklendi ve `Vertex AI`, `ZhiPu AI`, `OCI GenAI` entegrasyon sınıfları deprecated edildi.
- **why_it_matters:** AI katmanı, klasik web katmanından daha hızlı değişiyor; güvenlik açığı ve provider yaşam döngüsü aynı sprintte yönetilmek zorunda kalıyor.
- **java_spring_relevance:** Spring tabanlı RAG, agent, tool-calling, vector search veya Bedrock/Gemini/Anthropic/OpenAI entegrasyonu yapan ekipler için doğrudan ilgili.
- **actionability:** Hemen patch + mimari envanter
- **impact_level:** Yüksek
- **opportunities:** Structured output ile çıktıyı daha deterministik hale getirmek, provider bağımlılıklarını soyutlayarak gelecekteki geçiş maliyetini azaltmak.
- **risks:** User-controlled filtre veya medya URL’leriyle çalışan servislerde SSRF/RCE; deprecated provider sınıflarına doğrudan bağımlı kodda migration borcu.
- **migration_notes:** `1.1.x` için `1.1.4`, `1.0.x` için `1.0.5`e çıkın. Uygulama kodunda provider adapter katmanı kullanın; filter expression ve multimodal URL girişlerini ayrıca doğrulayın.

### 3. `Boot 4` pilotları için doğru mesaj: `4.0.5` güvenli taban, `4.1.0-M4` kontrollü deney alanı

- **title:** `Spring Boot 4.1.0-M4` geri alınan AMQP değişiklikleriyle milestone oynaklığını gösteriyor
- **source:** [`Spring Boot 4.1.0-M4`](https://spring.io/blog/2026/03/26/spring-boot-4-1-0-M4-available-now), [`Spring Boot 4.0.5`](https://spring.io/blog/2026/03/26/spring-boot-4-0-5-available-now), [`Spring Boot 3.5.13`](https://spring.io/blog/2026/03/26/spring-boot-3-5-13-available-now), [`Spring Cloud 2025.1.1`](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released), [`Spring Cloud project page`](https://spring.io/projects/spring-cloud/)
- **author:** Andy Wilkinson, Ryan Baxter, Spring Boot / Spring Cloud Team
- **date:** 26 Mart 2026
- **category:** Platform release / uyumluluk / migration
- **tags:** `spring-boot-4`, `boot-4.1`, `oakwood`, `rabbitmq`, `amqp`, `compatibility`
- **summary:** `Boot 4.1.0-M4`, `M3`te gelen Rabbit/AMQP değişikliklerini `4.2`ye erteledi ve config processing regresyonunu düzeltti. Aynı gün gelen `4.0.5` ve `3.5.13`, yeni özellikten çok güvenli bakım tabanı rolünde. `Spring Cloud` tarafı da `Oakwood 2025.1.x -> Boot 4.0.x` eşleşmesini net veriyor.
- **why_it_matters:** Erken göçlerde asıl maliyet derleme hatasından çok yanlış release train ve yanlış beklentidir.
- **java_spring_relevance:** Spring Boot ve Spring Cloud kullanan tüm mikroservis takımları için doğrudan ilgili.
- **actionability:** Hemen karar verilebilir
- **impact_level:** Orta-Yüksek
- **opportunities:** `4.0.5 + Oakwood` ile daha temiz pilot kurmak, `4.1` hattını ayrı deney alanı olarak değerlendirmek.
- **risks:** `M3`e göre kurulmuş Rabbit/AMQP dependency yapısının `M4`te kırılması; yanlış Spring Cloud hattı seçilirse uyumsuzluk yaşanması.
- **migration_notes:** `Boot 4` hedefleyen ekipler stabil pilotta `4.0.5 + 2025.1.x` eşleşmesini tercih etmeli. `4.1.0-M3`ten gelen ekipler starter POM ve autoconfiguration davranışlarını yeniden doğrulamalı.

### 4. `Spring Cloud Config` açığı hâlâ yüksek öncelikli operasyon başlığı

- **title:** `CVE-2026-22739` Config Server profil substitüsyonu üzerinden dosya erişimi ve SSRF riski getiriyor
- **source:** [`Spring Cloud Config advisory`](https://spring.io/security/cve-2026-22739), [`release announcement`](https://spring.io/blog/2026/03/23/spring-cloud-config-5-0-2-4-3-2-4-2-6-4-1-9-3-1-13-released)
- **author:** Ryan Baxter, Spring Cloud Team
- **date:** 23 Mart 2026
- **category:** Güvenlik / konfigürasyon altyapısı
- **tags:** `spring-cloud-config`, `cve-2026-22739`, `ssrf`, `config-server`, `native-backend`
- **summary:** `profile` parametresi substitüsyonundan ötürü native file system backend’de tanımlı dizinlerin dışına erişim ve source-control backend’de SSRF mümkün olabiliyor.
- **why_it_matters:** Config Server çoğu ekipte “kontrol düzlemi” olarak çalışır; buradaki bir açık geniş etki alanı yaratır.
- **java_spring_relevance:** Merkezi konfigürasyon, Git-backed config veya native backend kullanan Spring Cloud ekipleri için doğrudan ilgili.
- **actionability:** Hemen aksiyon
- **impact_level:** Yüksek
- **opportunities:** Config Server saldırı yüzeyini küçültmek, profile girişlerini sıkılaştırmak, backend seçimlerini yeniden değerlendirmek.
- **risks:** İstem dışı dosya erişimi, iç servislere SSRF, konfigürasyon altyapısı üzerinden lateral hareket.
- **migration_notes:** `5.0.x -> 5.0.2`, `4.3.x -> 4.3.2` ve uygun diğer fix sürümlerine geçin. Native backend arama dizinlerini ve repo URL template kullanımını ayrıca audit edin.

### 5. `Spring Modulith 2.1 M4`, modüler monolit mimarisini daha operasyonel hale getiriyor

- **title:** `Spring Modulith 2.1 M4` ile `JobRunr` event externalization ve AOT desteği güçlendi
- **source:** [`Spring Modulith 2.1 M4 release`](https://spring.io/blog/2026/03/27/spring-modulith-2-1-m4-2-0-5-and-1-4-10-released)
- **author:** Oliver Drotbohm
- **date:** 27 Mart 2026
- **category:** Mimari desenler / araçlar
- **tags:** `spring-modulith`, `jobrunr`, `eventing`, `aot`, `modular-monolith`
- **summary:** `2.1 M4`, event externalization için `JobRunr` desteği, Event Publication Registry tetikleyici anotasyonunun açık tanımı, `MomentsJacksonModule` için daha iyi AOT desteği ve named interface merge iyileştirmeleri getiriyor.
- **why_it_matters:** Spring ekosisteminde ölçeklenebilirlik artık sadece mikroservis yaymakla ölçülmüyor; modüler monolit içinde event publication ve background processing’i yönetmek de kritik.
- **java_spring_relevance:** Dağıtık sistem karmaşıklığını sınırlamak isteyen ama olay güdümlü sınırları korumak isteyen Spring ekipleri için güçlü bir aday.
- **actionability:** Yakın vadeli pilot
- **impact_level:** Orta
- **opportunities:** Daha sade dağıtım modeliyle olay güdümlü akış kurmak, AOT/natif senaryoları daha rahat test etmek.
- **risks:** Milestone API’lerine erken bağımlılık, JobRunr entegrasyonunu operasyonel olarak hafife almak.
- **migration_notes:** Modüler monolit veya domain event kullanan pilot servislerde `2.1 M4`ü deneyin. Retry, idempotency ve publication registry davranışını özellikle test edin.

### 6. `JDK 26` release notes doğrudan Spring backend migration checklist’i üretiyor

- **title:** `JDK 26` dil seviyesinden çok runtime, güvenlik ve operasyon davranışını değiştiriyor
- **source:** [`Oracle Java 26 announcement`](https://blogs.oracle.com/java/the-arrival-of-java-26), [`JDK 26 release notes`](https://jdk.java.net/26/release-notes), [`Inside Java - HTTP Client Updates in Java 26`](https://inside.java/2026/03/04/jdk-26-http-client/), [`InfoQ - Java 26 released`](https://www.infoq.com/news/2026/03/java26-released/), [`JDK 26 Security Enhancements`](https://seanjmullan.org/blog/2026/03/16/jdk26)
- **author:** Sharat Chander, Billy Korando, Michael Redlich, Sean Mullan
- **date:** 17 Mart 2026
- **category:** JDK / JVM / runtime davranışı
- **tags:** `jdk-26`, `httpclient`, `thread-stop`, `keystore`, `jdbc-4.5`, `tls`
- **summary:** `JDK 26`, `HTTP/3`, response body’yi de kapsayan timeout davranışı, region-based file upload, `JDBCType.JSON` ve `DECFLOAT`, `Thread.stop()` kaldırılması, `JKS/JCEKS` uyarıları, yeni/çıkarılan root CA’lar ve future-facing final field uyarıları gibi değişiklikler getiriyor.
- **why_it_matters:** Bu değişikliklerin çoğu compile time’da değil gerçek trafik, gerçek TLS zinciri ve gerçek kütüphane davranışı altında ortaya çıkar.
- **java_spring_relevance:** `RestClient`, `WebClient`, gateway, batch upload, JDBC yoğun servisler, eski agent/library kullanan uygulamalar ve güvenlik ekipleri için doğrudan ilgili.
- **actionability:** Lab + pre-prod checklist
- **impact_level:** Yüksek
- **opportunities:** Daha modern HTTP yetenekleri, daha iyi upload davranışı, JDBC JSON türüyle daha temiz veri modelleri, daha sıkı güvenlik tabanı.
- **risks:** Timeout sürprizleri, `Thread.stop()` kullanan legacy kodun compile/runtime kırılması, keystore ve TLS trust değişikliklerinin rollout sonrası sorun çıkarması.
- **migration_notes:** `HttpClient` timeout varsayımlarını test edin; `Thread.stop()` ve eski keystore kullanımlarını tarayın; CA trust ve keystore formatını güvenlik ekipleriyle doğrulayın; reflection/final-field warning’leri görünür kılın.

### 7. `Boot 4 / Framework 7` göçü ekosistemin bilgi üretim merkezine taşındı

- **title:** Topluluk ve eğitim içerikleri, `Boot 4 / Framework 7` geçişinin artık pratik gündem olduğunu gösteriyor
- **source:** [`Baeldung - Spring Boot 4 & Spring Framework 7`](https://www.baeldung.com/spring-boot-4-spring-framework-7), [`Burak KUTBAY - API Versiyonlama`](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html), [`Burak KUTBAY - HTTP Service Client`](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html), [`Josh Long - This Week in Spring, 31 March 2026`](https://spring.io/blog/2026/03/31/this-week-in-spring-march-31st-2026)
- **author:** Ralf Ueberfuhr, Burak KUTBAY, Josh Long
- **date:** 4 Mart 2026 - 31 Mart 2026
- **category:** Trend / ekosistem olgunluğu / geliştirici deneyimi
- **tags:** `boot-4`, `framework-7`, `api-versioning`, `http-service-client`, `ecosystem-signal`
- **summary:** Resmi release’lere ek olarak topluluk ve eğitim içeriklerinde `API versioning`, `HTTP Service Clients`, `Spring AI`, `Spring Modulith` gibi konuların artması, göçün erken haber safhasını geçtiğini gösteriyor.
- **why_it_matters:** Ekosistemde öğretilebilir içerik çoğalmadan büyük sürüm geçişleri yaygınlaşmaz.
- **java_spring_relevance:** Kurumsal ekipler için bu, “şimdi öğren, sonra uygula” aşamasının başladığı anlamına gelir.
- **actionability:** Yakın vadeli öğrenme ve pilot planlama
- **impact_level:** Orta
- **opportunities:** Ekip içi enablement süresini kısaltmak, migration spike’larını daha düşük riskle başlatmak.
- **risks:** Eğitim içeriği bolluğunu release stabilitesiyle karıştırmak; milestone ve GA ayrımını kaybetmek.
- **migration_notes:** Öğrenme içeriklerini kullanın ama rollout kararını yalnızca release notes, support matrix ve kendi entegrasyon testleriniz üzerinden verin.

## Sonuç

Bugünün en net mühendislik kararı, güvenlik patch’lerini ürün bazında değil platform bazında ele almak: `Spring Security`, `Spring Cloud Config`, `Spring Boot Actuator` ve `Spring AI` aynı haftada ayrı ayrı risk üretti. İkinci net karar ise `Boot 4` göçünü iki hatta ayırmak: `4.0.5 + Oakwood` tarafını güvenli pilot tabanı, `4.1.0-M4` tarafını ise sözleşmesi değişebilen deney alanı olarak görmek.

Orta vadede baskın tema değişmedi: `JDK 26` geçişi klasik bir “minor JDK bump” değil; runtime, TLS, keystore, timeout ve legacy API davranışlarını birlikte doğrulamak gerekiyor. Mimari tarafta ise `Spring Modulith + JobRunr` çizgisi, mikroservis dışında da ciddi bir Spring mimari alternatifi olmaya devam ediyor.
