# Günlük Java / Spring Ekosistem Raporu

Tarih: 15 Temmuz 2026  
Tarama zamanı: 15 Temmuz 2026 21:18 TSİ  
Odak: agent davranışını, mimari sınırları ve rollout kararlarını görünür kontratlara dönüştüren pratikler

Tarama notu: Bugün [Spring Blog](https://spring.io/blog.atom), [Spring Security advisories feed](https://spring.io/security.atom), [Spring project pages](https://spring.io/projects), [Spring Release Highlights](https://spring.io/projects/release-highlights), [This Week in Spring - July 14th, 2026](https://spring.io/blog/2026/07/14/this-week-in-spring-july-14-2026), [Spring Office Hours S5E18](https://spring.io/blog/2026/07/13/spring-office-hours-podcast-S5E18), [A Bootiful Podcast: Moritz Halbritter](https://spring.io/blog/2026/07/09/a-bootiful-podcast-moritz-halbritter), [Spring AI Advisors API](https://docs.spring.io/spring-ai/reference/api/advisors.html), [Spring AI Tool Calling docs](https://docs.spring.io/spring-ai/reference/api/tools.html), [SafeGuardAdvisor API](https://docs.spring.io/spring-ai/docs/current/api/org/springframework/ai/chat/client/advisor/SafeGuardAdvisor.html), [Spring AI observability docs](https://docs.spring.io/spring-ai/reference/observability/index.html), [Inside Java feed](https://inside.java/feed.xml), [OpenJDK JEP Index](https://openjdk.org/jeps/0), [JDK 27 EA page](https://jdk.java.net/27/), [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases), [InfoQ - Scaling Java-Based Real-Time Systems](https://www.infoq.com/articles/tradeoffs-event-driven-design/), [InfoQ - Beyond RAG](https://www.infoq.com/articles/beyond-rag-context-aware/), [Baeldung - LLM Tool Call Reasoning Using Embabel](https://www.baeldung.com/java-embabel-ai-agent-tool-call-reasoning), [Embabel `1.0.0-RC1` release](https://github.com/embabel/embabel-agent/releases/tag/v1.0.0-RC1), [JobRunr `9.0.0-beta.0` migration guide](https://www.jobrunr.io/en/guides/migration/v9/), [Craig Walls’ın Spring AI Recipes sayfası](https://www.habuma.com/springairecipes/), [Gunnar Morling feed’i](https://www.morling.dev/index.xml) ve [Burak KUTBAY blog feed’i](https://blog.burakkutbay.com/feed/) yeniden kontrol edildi. 15 Temmuz 2026 itibarıyla kontrol edilen resmi Spring release yüzeylerinde 7 Temmuz sonrası yeni GA/servis duyurusu görünmüyor; [Spring Security advisories feed](https://spring.io/security.atom) ise 12 Haziran 2026’dan daha yeni bir kayıt göstermiyor. Oracle blog HTML tarafı bu ortamdan `403` verdiği için resmi Java update gerçeği [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases) ve [JDK 27 EA](https://jdk.java.net/27/) sayfası üzerinden doğrulandı. Burak KUTBAY blogunda ise bugün iki taze pratik sinyal öne çıktı: [11 Temmuz tarihli ArchUnit yazısı](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html) ve [15 Temmuz tarihli Feature Flag + Unleash yazısı](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html).

## Öne Çıkan Başlıklar

- Resmi Spring patch yüzeyi bugün sessiz: kontrol edilen kaynaklarda 7 Temmuz 2026 sonrası yeni release/advisory görünmüyor. Bu yüzden bugünün yüksek değerli sinyali sürüm numarası değil, mevcut sistemi daha yönetilebilir hale getiren mühendislik pratikleri.
- Spring AI tarafında input guardrail, output filtering, semantic guardrail, tool reasoning ve advisor observability birleşerek agent akışını “prompt”tan çıkarıp kontrol düzlemine taşıyor.
- [Embabel `1.0.0-RC1`](https://github.com/embabel/embabel-agent/releases/tag/v1.0.0-RC1) ve [Baeldung’in yeni Embabel yazısı](https://www.baeldung.com/java-embabel-ai-agent-tool-call-reasoning), JVM agent çerçevelerinde reasoning, MCP health, graceful shutdown ve tool hata görünürlüğünün öne çıktığını gösteriyor.
- [InfoQ’nun gerçek zamanlı event-driven retrospective’i](https://www.infoq.com/articles/tradeoffs-event-driven-design/) Java/Kafka/Spring ekiplerine net bir uyarı veriyor: eventual consistency, bazı kritik patikalarda “gecikme” değil doğrudan “arıza” etkisi üretir.
- [Burak KUTBAY’ın ArchUnit](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html) ve [Feature Flag + Unleash](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html) içerikleri, Spring ekipleri için mimari kural ve rollout kuralını tekrar kod içine çekme ihtiyacını destekliyor.

## Kritik Güncellemeler

### 1. Resmi Spring yüzeyi bugün zorunlu patch alarmı vermiyor

[Spring Blog](https://spring.io/blog.atom), [Spring project pages](https://spring.io/projects), [Release Highlights](https://spring.io/projects/release-highlights) ve ana Spring GitHub release yüzeyleri tekrar kontrol edildi. 15 Temmuz 2026 itibarıyla 7 Temmuz sonrası yeni bir Spring GA/servis release duyurusu görünmüyor. [Spring Security advisories feed](https://spring.io/security.atom) de 12 Haziran 2026’dan sonra yeni advisory üretmemiş durumda.

Bu şu anlama geliyor:

- Bugünün ana işi “yeni patch’i yakala” değil.
- Ekipler dikkatini mevcut platformun rollout, observability, AI kontrolü ve mimari yönetişim tarafına kaydırabilir.
- Ama bu sessizlik, `3.5.x` ya da eski Cloud/Data/Security hatlarında kalmayı güvenli sanmak için bahane değil; sadece bugün yeni bir alarm yok.

### 2. Spring AI tarafında asıl haber yeni model değil, yeni kontrol yüzeyi

[Advisors API](https://docs.spring.io/spring-ai/reference/api/advisors.html), [SafeGuardAdvisor](https://docs.spring.io/spring-ai/docs/current/api/org/springframework/ai/chat/client/advisor/SafeGuardAdvisor.html), [Tool Argument Augmentation](https://docs.spring.io/spring-ai/reference/api/tools.html) ve [advisor observability](https://docs.spring.io/spring-ai/reference/observability/index.html) zaten resmi zemini hazırlamıştı. Son bir haftada [Craig Walls’ın tarifleri](https://www.habuma.com/springairecipes/) bu zemini daha operasyonel hale getiriyor:

- `6 Temmuz`: input guardrail
- `9 Temmuz`: output filtering
- `13 Temmuz`: semantic guardrail
- `2 Temmuz`: resilient structured output

[Spring Office Hours S5E18](https://spring.io/blog/2026/07/13/spring-office-hours-podcast-S5E18) ve [Josh Long’un 14 Temmuz haftalık özeti](https://spring.io/blog/2026/07/14/this-week-in-spring-july-14-2026) da bu yönü kuvvetlendiriyor. Mesaj net: Spring AI kullanan ekipler artık sadece “doğru prompt” aramamalı; giriş, çıkış, tool seçimi ve reasoning görünürlüğünü ayrı politika katmanları olarak kurmalı.

### 3. JVM agent çerçeveleri demo aşamasından operasyon aşamasına yaklaşıyor

[Embabel `1.0.0-RC1`](https://github.com/embabel/embabel-agent/releases/tag/v1.0.0-RC1) içindeki değişiklikler yalnız özellik ekleme değil:

- generic media/document desteği
- deprecated API temizliği
- Netty güvenlik düzeltmesi
- MCP SSE bağlantılarını Tomcat graceful shutdown öncesi kapatma
- MCP server health bilgisini Spring Boot Actuator üzerinden açma
- tool hatalarını istemciye `isError` mantığında taşıma

Buna paralel olarak [Baeldung’in 12 Temmuz tarihli Embabel yazısı](https://www.baeldung.com/java-embabel-ai-agent-tool-call-reasoning), Spring AI tarafındaki `Tool Argument Augmenter` modelini reasoning yakalama açısından değerlendiriyor ve schema tabanlı reasoning ile prompt tabanlı reasoning arasındaki gerçek mühendislik trade-off’larını açıkça koyuyor.

### 4. Java update kanalı değişmedi; deney hattı ile prod hattı ayrımı korunmalı

[Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases) bugün hâlâ `26.0.1`, `25.0.3`, `21.0.11` ve `17.0.19` sürümlerini destekli taban olarak gösteriyor. [JDK 27 EA sayfası](https://jdk.java.net/27/) ise `9 Temmuz 2026` tarihli `build 30` seviyesinde.

Bu da şu pratik sonucu veriyor:

- agent/observability deneyleri için `JDK 27` izleme hattı mantıklı
- ama prod baseline kararı için hâlâ resmi destekli hatlardan kopmamak gerekiyor

### 5. Adjacent watch: JobRunr `9.0.0-beta.0`

[JobRunr `v9` migration guide](https://www.jobrunr.io/en/guides/migration/v9/) `14 Temmuz` tarihli beta sürümde birkaç önemli sinyal veriyor:

- breaking changes var
- Pro tarafta `EventBus` ile daha düşük gecikmeli server-to-server bildirim modeli geliyor
- batch job pause/resume yeteneği genişliyor
- test fixtures için `JDK 17+` şartı netleşiyor

Spring Boot ekipleri için bu bugün geçilecek sürüm değil; ama arka plan işleme altyapısında concurrency ve cluster koordinasyonu önemliyse izlenmesi gereken bir dalga.

## Trendler ve Sinyaller

### Trend Kümesi 1: Constraint-as-code geri dönüyor

Bugün farklı kaynaklar aynı şeyi söylüyor:

- [ArchUnit](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html) ile mimari kural testleşiyor
- [Feature Flag + Unleash](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html) ile rollout kuralı runtime kontrolüne dönüşüyor
- [Spring AI advisors](https://docs.spring.io/spring-ai/reference/api/advisors.html) ile model sınırı politika katmanına dönüşüyor

Yani “dokümanda yazıyor” artık yeterli değil. Mimari kural, rollout kuralı ve AI güvenlik kuralı çalıştırılabilir kontrata dönüyor.

### Trend Kümesi 2: Agentic Java ekosistemi observability-first ilerliyor

[Baeldung’in Embabel yazısı](https://www.baeldung.com/java-embabel-ai-agent-tool-call-reasoning), [Spring AI tool docs](https://docs.spring.io/spring-ai/reference/api/tools.html), [advisor observability](https://docs.spring.io/spring-ai/reference/observability/index.html) ve [Embabel RC1 release notları](https://github.com/embabel/embabel-agent/releases/tag/v1.0.0-RC1) birlikte okunduğunda ortak sinyal şu:

- reasoning görünürlüğü
- tool hata propagasyonu
- health endpoint
- graceful shutdown
- structured output doğrulama

Bunlar artık “nice to have” değil; agent çerçevesinin üretimde ciddiye alınabilmesi için minimum işletme yüzeyi haline geliyor.

### Trend Kümesi 3: Event-driven mimari, kritik patika farkındalığı olmadan pahalıya patlıyor

[InfoQ retrospective’i](https://www.infoq.com/articles/tradeoffs-event-driven-design/) önemli çünkü soyut prensip anlatmıyor; “hangi Java/Kafka deseni üretimde nerede kırıldı” sorusunu cevaplıyor. Spring Boot ekipleri için ana ders:

- eventual consistency her yerde kabul edilebilir değil
- consumer thread içinde blocking I/O zincirleme lag üretebilir
- local cache ile gerçek state birbirinden kopabilir
- kritik patikada Redis/gRPC gibi daha direkt modeller gerekebilir

### Trend Kümesi 4: AI mimarisinde bağlam ve politika tekrar uygulama katmanına çekiliyor

[InfoQ’nun CAG makalesi](https://www.infoq.com/articles/beyond-rag-context-aware/) RAG’i çöpe atmıyor; onun üstüne context manager ekliyor. Bu yaklaşım Spring ekipleri için doğal çünkü kullanıcı bağlamı, oturum geçmişi, authorization ve policy zaten çoğu kez uygulama katmanında yaşıyor. Bu da AI mimarisinde “vector store merkezli” değil “uygulama merkezli” bir yön olduğunu gösteriyor.

### Hype vs kalıcı değer

- Kalıcı değer: advisor zinciri, executable architecture rules, controlled rollout, context manager, kritik patikada selective synchrony
- İzlenmesi gereken ama dikkatli yaklaşılması gereken alan: Embabel RC1, JobRunr 9 beta, JDK 27 EA
- Hype riski: guardrail’i yalnız prompt cümlesi sanmak; reasoning alanlarını denetimsiz log gürültüsüne çevirmek; event-driven mimariyi tüm iş akışlarına otomatik iyi cevap saymak

## Araçlar ve Kütüphaneler

- [Spring AI Advisors API](https://docs.spring.io/spring-ai/reference/api/advisors.html): yüksek öncelik. Guardrail, retrieval, moderation ve gözlemlenebilirlik için resmi genişleme noktası.
- [SafeGuardAdvisor](https://docs.spring.io/spring-ai/docs/current/api/org/springframework/ai/chat/client/advisor/SafeGuardAdvisor.html): orta-yüksek öncelik. Tek başına yeterli değil ama giriş filtresi için hızlı bir ilk katman.
- [Tool Argument Augmentation](https://docs.spring.io/spring-ai/reference/api/tools.html): yüksek öncelik. Tool reasoning, metadata ve long-term memory çıkarımı için yararlı; fakat LLM-facing schema ile runtime contract arasındaki fark mutlaka belgelenmeli.
- [Embabel `1.0.0-RC1`](https://github.com/embabel/embabel-agent/releases/tag/v1.0.0-RC1): orta-yüksek öncelik. Agent operasyonelliğini ciddiye alan JVM ekipleri için pilot seviyesinde izlenmeli.
- [ArchUnit](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html): yüksek öncelik. Katman bağımlılıkları ve modül sınırları için çok düşük maliyetli, yüksek değerli bir test katmanı.
- [Unleash / Feature Flag yaklaşımı](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html): orta-yüksek öncelik. Deploy ile release’i ayırmak isteyen Spring Boot ekipleri için pratik.
- [JobRunr `9.0.0-beta.0`](https://www.jobrunr.io/en/guides/migration/v9/): düşük-orta öncelik. Major upgrade watchlist; bugün prod geçiş değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI kullanan ekipler, prompt metnini tek güvenlik katmanı gibi görmekten çıkmalı; input, output, reasoning ve observability için advisor zinciri tasarlamalı.
- Spring Kafka veya event-driven akış kullanan ekipler, “bu yol gerçekten eventual consistency kaldırıyor mu?” sorusunu akış bazında sormalı. Cevap hayırsa sync veya near-sync alternatifler düşünülmeli.
- Katmanlı monolit, modüler monolit veya servis kümesinde mimari kural ihlalleri tekrar eden problemse, ArchUnit artık “güzel fikir” değil; CI’nin bir parçası olmalı.
- Sık deploy yapan ekipler için feature flag, rollback yerine kill-switch ve controlled rollout ile daha düşük riskli yayın modeli sağlayabilir.
- JDK yükseltme kararlarında agent/AI deneyleri yüzünden prod baseline erken ileri çekilmemeli; destekli JDK hattı ile EA/feature lane ayrımı korunmalı.

## Fırsatlar ve Riskler

- Fırsat: Spring AI advisor zinciri ile güvenlik, doğrulama ve observability’yi framework seviyesinde standartlaştırmak.
- Risk: guardrail mantığını sadece blacklist kelimelere bırakmak; dolaylı veya model kaynaklı sızıntıları kaçırmak.
- Fırsat: ArchUnit ile katman ve modül kurallarını PR öncesinde otomatik yakalamak.
- Risk: feature flag kullanıp sahiplik, TTL ve temizleme politikası koymamak; rollout borcunu config borcuna çevirmek.
- Fırsat: event-driven kritik patikaları yeniden sınıflandırıp bazı yolları daha deterministik hale getirmek.
- Risk: blocking REST çağrılarını consumer thread içinde bırakmak; consumer lag, cache sapması ve görünmez yanlışlık üretmek.
- Fırsat: CAG/context manager ile mevcut Spring AI RAG hattını yıkmadan daha güvenilir kurumsal davranış elde etmek.
- Risk: bağlamı prompt şablonları ve controller kodu arasında dağınık tutmak; policy drift yaratmak.

## İzlenmesi Gereken Konular

- Resmi Spring AI doküman ve örneklerinde Craig Walls’ın semantic/output guardrail pratiklerinin first-party örneğe dönüşüp dönüşmeyeceği
- [Embabel `1.0.0-RC1`](https://github.com/embabel/embabel-agent/releases/tag/v1.0.0-RC1) sonrası `1.0 GA` yolunda MCP health, shutdown ve tool failure davranışının ne kadar stabil kalacağı
- [JobRunr `9.0.0-beta.0`](https://www.jobrunr.io/en/guides/migration/v9/) major geçiş notlarının Spring Boot starter kullanıcıları için netleşmesi
- Yaz ortası Spring patch dalgasında yeni Security advisory veya servis release’lerinin gelip gelmeyeceği
- [JDK 27 EA](https://jdk.java.net/27/) build ilerleyişi ve Eylül 2026 GA öncesinde hangi preview/incubator maddelerinin sabit kalacağı
- [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) tarafında `26.0.1` destek penceresi kısalırken prod baseline kararlarının tekrar `25.0.3` / `21.0.11` çevresinde nasıl şekilleneceği

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Resmi Spring release yüzeyi sakin; bugün asıl sinyal yeni patch değil operasyonel yönetişim
- `source`: [Spring Blog](https://spring.io/blog.atom) | [Spring Security advisories feed](https://spring.io/security.atom) | [Spring project pages](https://spring.io/projects) | [Spring Release Highlights](https://spring.io/projects/release-highlights)
- `author`: Josh Long | Spring team
- `date`: 14-15 Temmuz 2026 kontrolü
- `category`: release-operations, support-policy, risk-triage
- `tags`: spring-blog, spring-security-feed, no-new-advisory, release-surface, triage
- `summary`: Kontrol edilen resmi Spring yüzeylerinde 7 Temmuz 2026 sonrası yeni GA/servis release duyurusu görünmüyor. Security advisories feed de 12 Haziran 2026’dan daha yeni kayıt göstermiyor.
- `why_it_matters`: Ekiplerin bugün sürüm kovalamak yerine mevcut sistemlerde rollout, observability, AI kontrolü ve mimari hijyene odaklanması daha rasyonel.
- `java_spring_relevance`: Spring Boot ve Spring Cloud ekipleri için yanlış “bugün bir şey kaçırdık mı?” alarmını söndürüp gerçek backlog önceliğini netleştiriyor.
- `actionability`: `izlemelik`
- `impact_level`: `orta`
- `opportunities`: sakin release günlerini mimari borç, rollout disiplini ve AI guardrail standardizasyonu için kullanmak
- `risks`: sessiz yüzeyi güvenli zemin sanıp eski hatlarda gereğinden uzun kalmak
- `migration_notes`: mevcut patch seviyeleri korunmalı; ama `3.5.x` veya daha eski hatlarda kalan ekipler yeni advisory gelmeden önce dahi uplift planını geciktirmemeli.

### Bulgu 2

- `title`: Spring AI advisor katmanı, input/output/semantic guardrail ve tool reasoning için gerçek kontrol düzlemine dönüşüyor
- `source`: [Advisors API](https://docs.spring.io/spring-ai/reference/api/advisors.html) | [Tool Calling docs](https://docs.spring.io/spring-ai/reference/api/tools.html) | [SafeGuardAdvisor API](https://docs.spring.io/spring-ai/docs/current/api/org/springframework/ai/chat/client/advisor/SafeGuardAdvisor.html) | [Craig Walls’ın Spring AI Recipes sayfası](https://www.habuma.com/springairecipes/) | [Spring Office Hours S5E18](https://spring.io/blog/2026/07/13/spring-office-hours-podcast-S5E18)
- `author`: Spring AI team | Craig Walls | Dan Vega | DaShaun Carter
- `date`: 6-14 Temmuz 2026
- `category`: ai-platform, security, observability, developer-productivity
- `tags`: spring-ai, advisors, safeguardadvisor, tool-argument-augmentation, semantic-guardrails, output-filtering, structured-output
- `summary`: Spring AI’nin resmi advisor ve tool schema yüzeyi, son bir haftada Craig Walls’ın input guardrail, output filtering, semantic guardrail ve resilient structured output tarifleriyle daha operasyonel hale geldi.
- `why_it_matters`: Java ekipleri model sınırını yalnız prompt ile değil, uygulama içinde ölçülebilir ve tekrarlanabilir politika katmanlarıyla yönetebilir.
- `java_spring_relevance`: Spring AI kullanan Spring Boot servislerinde moderation, output sanitization, reasoning capture ve audit pipeline’ları için doğrudan uygulanabilir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: advisor zinciri üzerinden güvenlik, doğrulama ve tracing standardı koymak; reasoning alanlarını analitik ve inceleme süreçlerine taşımak
- `risks`: keyword filtresini yeterli sanmak; schema augmentation ile runtime tool contract farkını belgesiz bırakmak
- `migration_notes`: input/output guardrail katmanlarını ayrı advisor olarak tasarlayın; `Tool Argument Augmenter` kullanımını yalnız gerçek ölçüm veya denetim ihtiyacı olan tool’larda açın; `spring.ai.advisor` metriklerini gözlemleyin.

### Bulgu 3

- `title`: Embabel `1.0.0-RC1`, JVM agent operasyonlarını reasoning’den health ve graceful shutdown seviyesine indiriyor
- `source`: [Embabel `1.0.0-RC1` release](https://github.com/embabel/embabel-agent/releases/tag/v1.0.0-RC1) | [Baeldung - LLM Tool Call Reasoning Using Embabel](https://www.baeldung.com/java-embabel-ai-agent-tool-call-reasoning)
- `author`: Alexander Hein-Heifetz ve Embabel katkıcıları | Igor Dayen
- `date`: 12-13 Temmuz 2026
- `category`: ai-platform, agent-framework, operations, mcp
- `tags`: embabel, mcp, actuator, graceful-shutdown, tool-reasoning, error-propagation, spring-boot
- `summary`: Embabel RC1 generic media/document desteği, MCP server health’in Spring Boot Actuator üzerinden açılması, tool hata propagasyonu ve Tomcat graceful shutdown öncesi MCP SSE kapatma gibi üretim odaklı değişiklikler getiriyor. Baeldung’in yeni yazısı da reasoning yakalamayı Spring AI `Tool Argument Augmenter` ile karşılaştırmalı değerlendiriyor.
- `why_it_matters`: Agent çerçevesi seçimi artık yalnız model desteğiyle değil, shutdown davranışı, health yüzeyi, observability ve tool kontratıyla yapılmalı.
- `java_spring_relevance`: Spring Boot üzerinde agent servisleri, MCP sunucuları veya tool-loop tabanlı akışlar kuran ekipler için doğrudan ilgili.
- `actionability`: `izlemelik`
- `impact_level`: `orta-yuksek`
- `opportunities`: reasoning + tool observability + health endpoint kombinasyonu ile daha denetlenebilir agent servisleri kurmak
- `risks`: RC sürümünü prod tabanı yapmak; framework churn nedeniyle contract ve logging davranışlarında sürpriz yaşamak
- `migration_notes`: RC1 yalnız pilot hatta denenmeli; MCP shutdown, Actuator health, tool failure semantics ve model-provider kombinasyonları regresyon testiyle doğrulanmalı.

### Bulgu 4

- `title`: Gerçek zamanlı Java sistemlerinde event-driven mimari, kritik patikalar için varsayılan çözüm değil
- `source`: [InfoQ - Scaling Java-Based Real-Time Systems: the Hidden Tradeoffs of Event-Driven Design](https://www.infoq.com/articles/tradeoffs-event-driven-design/)
- `author`: Sagar Deepak Joshi
- `date`: 30 Haziran 2026
- `category`: architecture, event-driven, performance, operations
- `tags`: kafka, redis, grpc, real-time, spring-boot, cache-divergence, consumer-lag
- `summary`: Makale, gerçek zamanlı iletişim sistemlerinde eventual consistency’nin fiilen arıza etkisi yaratabildiğini; Kafka replay sırasında boot-storm oluşabildiğini; RocksDB compaction gecikmelerinin kritik patikalara zarar verdiğini; consumer thread içindeki tek bir blocking REST çağrısının devasa lag üretebildiğini gösteriyor.
- `why_it_matters`: Event-driven mimari genel faydalar sunsa da bazı path’lerde sync veya near-sync çözüm şart olabilir.
- `java_spring_relevance`: Spring Kafka, Spring Boot ve Redis/gRPC kullanan mikroservis mimarileri için doğrudan pratik sonuç üretiyor.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: kritik state’i Redis benzeri authoritative store’a taşımak; blocking çağrıları consumer yolundan çıkarmak; async/sync sınırını iş akışı bazında yeniden tanımlamak
- `risks`: sessiz yanlışlık, stuck UI, consumer lag zinciri, autoscaling verimsizliği
- `migration_notes`: consumer thread’lerde blocking I/O taraması yapın; Kafka Global State Store kullanan kritik path’leri yeniden ölçün; “eventual consistency kabul edilebilir mi?” sorusunu akış bazlı ADR’ye dönüştürün.

### Bulgu 5

- `title`: Context-Augmented Generation, Spring Boot içinde bağlam ve politikayı tekrar uygulama katmanına çekiyor
- `source`: [InfoQ - Beyond RAG: Architecting Context-Aware AI Systems with Spring Boot](https://www.infoq.com/articles/beyond-rag-context-aware/) | [Spring AI RAG docs](https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html) | [This Week in Spring - July 14th, 2026](https://spring.io/blog/2026/07/14/this-week-in-spring-july-14-2026)
- `author`: Syed Danish Ali | Spring AI team | Josh Long
- `date`: 2 Nisan 2026, 14 Temmuz 2026’da yeniden öne çıktı
- `category`: ai-architecture, spring-boot, context-management, policy
- `tags`: spring-boot, rag, cag, context-manager, session, authorization, policy
- `summary`: CAG yaklaşımı, retriever ve LLM katmanını bozmadan yukarıya bir `context manager` ekliyor; kullanıcı rolü, oturum geçmişi ve policy bağlamı burada normalize edilip sonra RAG hattına taşınıyor.
- `why_it_matters`: Bağlam mantığını prompt şablonlarına veya controller’lara saçmadan daha test edilebilir ve denetlenebilir AI akışları kurmayı kolaylaştırıyor.
- `java_spring_relevance`: Spring Security, session, workflow metadata ve domain policy zaten uygulama katmanında yaşayan Spring ekipleri için çok doğal bir desen.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: mevcut RAG yatırımını çöpe atmadan policy-aware ve user-aware cevaplar üretmek
- `risks`: bağlamı dağınık bırakmak; farklı endpoint’lerde tutarsız veya fazla yetkili davranış üretmek
- `migration_notes`: controller ile retriever/LLM arasına açık bir `context manager` bileşeni koyun; normalize edilmiş context DTO’su üretin; retrieval ve prompt inşasını bu DTO üzerinden sürün.

### Bulgu 6

- `title`: ArchUnit ve Unleash yaklaşımı, Spring ekiplerinde mimari ve rollout kurallarını çalıştırılabilir kontrata dönüştürüyor
- `source`: [ArchUnit ile Proje Mimarisini Test Edin](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html) | [Feature Flag ile Güvenli Dağıtım | Spring Boot + Unleash](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html)
- `author`: Burak KUTBAY
- `date`: 11-15 Temmuz 2026
- `category`: architecture-governance, ci-cd, progressive-delivery
- `tags`: archunit, unleash, feature-flag, canary-release, controlled-rollout, spring-boot
- `summary`: Burak KUTBAY’ın ArchUnit yazısı controller’ın repository’e doğrudan erişmemesi gibi kuralların test koduna taşınmasını öneriyor. Aynı haftadaki Unleash/feature flag içeriği ise controlled rollout, canary release, deploy-bağımsız feature yönetimi ve rollback olmadan özellik kapatma yönünü vurguluyor.
- `why_it_matters`: Spring ekipleri mimari sınırı ve rollout sınırını insan disiplini yerine kod ve runtime kontratı ile koruyabilir.
- `java_spring_relevance`: katmanlı Spring Boot servisleri, modüler monolitler ve sık deploy yapan mikroservis takımları için yüksek pratik değer taşıyor.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: daha hızlı kod inceleme, daha güvenli yayın, daha düşük blast radius
- `risks`: testleşmemiş mimari kural drift’i; sahipliği olmayan flag birikimi
- `migration_notes`: önce küçük bir ArchUnit smoke-rule seti ile başlayın; feature flag için sahiplik, TTL, temizleme ve rollout sorumluluğunu ayrı alan olarak tanımlayın.

### Bulgu 7

- `title`: Java prod baseline değişmedi; JDK `27` hâlâ laboratuvar hattı
- `source`: [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases) | [JDK 27 EA page](https://jdk.java.net/27/) | [OpenJDK JEP Index](https://openjdk.org/jeps/0)
- `author`: Oracle Java platform team | OpenJDK
- `date`: 15 Temmuz 2026 doğrulaması, `JDK 27` build `30` tarihi `9 Temmuz 2026`
- `category`: jvm, runtime-governance, support-policy
- `tags`: currentjavareleases, jdk27, ea-build-30, jdk26, jdk25, support-baseline
- `summary`: Destekli resmi hat bugün hâlâ `26.0.1`, `25.0.3`, `21.0.11` ve `17.0.19`. JDK `27` EA ise `build 30` seviyesinde ilerliyor ama üretim baseline’ı değil.
- `why_it_matters`: yeni AI/agent kütüphaneleri ve observability denemeleri yüzünden JDK seçiminde acelecilik yapmak gereksiz risk üretir.
- `java_spring_relevance`: Spring Boot servislerinin build, container, test matrisi ve destek politikasını etkiler.
- `actionability`: `izlemelik`
- `impact_level`: `orta`
- `opportunities`: EA hat üzerinde hedefli benchmark ve uyumluluk testi yapmak
- `risks`: destekli runtime ile deney runtime’ını karıştırmak; platform kararını framework merakına bağlamak
- `migration_notes`: prod container tabanları destekli sürümlerde tutulmalı; `JDK 27` yalnız canary/benchmark lane’de kullanılmalı; yeni tooling ya da agent framework gereksinimleri için ayrı JDK matrisi hazırlanmalı.

## Sonuç

15 Temmuz 2026 radarında en güçlü mesaj yeni bir Spring patch değil. Bunun yerine Java/Spring ekosistemi, kritik sınırları tekrar görünür kontratlara çeviriyor:

- model sınırı için advisor/guardrail
- tool sınırı için reasoning ve hata propagasyonu
- mimari sınır için ArchUnit
- rollout sınırı için feature flag
- dağıtık kritik patika için selective synchrony

Bugün bir ekip için en mantıklı aksiyon sırası şu olur:

1. Spring AI kullanılıyorsa advisor zincirini giriş/çıkış/reasoning açısından gözden geçirmek
2. Spring Kafka veya event-driven kritik patikaları “eventual consistency gerçekten kabul edilebilir mi?” sorusuyla yeniden sınıflandırmak
3. Mimari kural ve rollout kuralını tekrar kod içine almak
4. JDK prod baseline’ını sabit tutup yeni agent/tooling deneylerini ayrı laboratuvar hattında yürütmek

Bugünün kalıcı değeri buradan geliyor: daha çok özellik değil, daha net sınırlar.
