# Günlük Java / Spring Ekosistem Raporu

Tarih: 17 Temmuz 2026  
Tarama zamanı: 17 Temmuz 2026 09:08 TSİ  
Odak: release takvimi sakin görünürken hangi support-line, migration ve platform kararlarının aslında hemen backlog'a girmesi gerektiğini ayırmak

Tarama notu: Bugün [Spring Blog](https://spring.io/blog/), [Spring Projects](https://spring.io/projects/), [Spring Security Advisories](https://spring.io/security/), [Spring Boot Supported Versions wiki](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions), [Spring Boot issue #50902](https://github.com/spring-projects/spring-boot/issues/50902), [Spring AI 2.0.0 GA duyurusu](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now), [Spring AI MCP Streamable HTTP dokümantasyonu](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-streamable-http-server-boot-starter-docs.html), [Spring AI issue #6347](https://github.com/spring-projects/spring-ai/issues/6347), [Spring AI issue #6629](https://github.com/spring-projects/spring-ai/issues/6629), [Inside Java feed](https://inside.java/), [Identifying JDK Value Class Candidates](https://inside.java/2026/07/16/identify-jdk-value-classes-candidates/), [OpenJDK core-libs-dev thread](https://mail.openjdk.org/archives/list/core-libs-dev@openjdk.org/thread/Y72NRXM7KYBX43OKYBQMVKOZDWKG4MHS/), [OpenJDK serviceability-dev thread](https://mail.openjdk.org/archives/list/serviceability-dev@openjdk.org/thread/Y2II7IQWBMASDFSJK6BZZTUIYPRX3G73/?sort=thread), [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases), [InfoQ Java/architecture yüzeyi](https://www.infoq.com/java/news/), [Airbnb Sitar-agent yazısı](https://medium.com/airbnb-engineering/sitar-agent-building-a-reliable-dynamic-configuration-sidecar-at-scale-b7e00c152068), [Josh Long'un 14 ve 16 Temmuz paylaşımları](https://spring.io/blog/2026/07/14/this-week-in-spring-july-14-2026), [Gunnar Morling feed'i](https://www.morling.dev/index.xml), [Burak KUTBAY blog feed'i](https://blog.burakkutbay.com/feed/) ve erişilebildiği kadar [dev.java/news](https://dev.java/news/) kontrol edildi. [Baeldung](https://www.baeldung.com/) arşiv yüzeyi bu ortamdan `403` verdi; yeni ve yüksek sinyalli bir Baeldung girdisi doğrulanamadı. Spring güvenlik yüzeyinde bugün görünen en yeni advisory halen 12 Haziran 2026 tarihli; yani yeni CVE kovalamak yerine destek penceresi, bakım hattı ve göç maliyeti okumak daha anlamlı.

## Öne Çıkan Başlıklar

- Spring Boot tarafında düzenli OSS patch ritmine güvenmek artık yeterli değil: 1 Temmuz 2026 tarihli maintainer yorumu bir sonraki `4.0.x` ve `4.1.x` turunu erken Ağustos'a itiyor, 13 Temmuz 2026 yorumu ise `3.5.x` hattında bundan sonra yalnız ticari müşterilere yayın yapılacağını netleştiriyor.
- Spring AI `2.0` sonrası en pratik sinyal yeni feature değil, gelecek kırılma yüzeyi: `2.1.x` için açılmış tracking issue, SSE tabanlı MCP transport'ların, eski constructor'ların ve `getDefaultOptions()` köprülerinin kaldırılmasını hedefliyor.
- Spring AI `1.1.8` hattında, Ollama stream çıktılarında `thinking` metadata'sını düzelten backport'un fiilen gelmediği ve issue'nin “not planned” kapandığı görülüyor; yani `1.1.x` kullanan ekipler feature parity varsaymamalı.
- OpenJDK tarafında Valhalla çizgisi soyut tartışma olmaktan çıkıyor: 16 Temmuz 2026 Inside Java yazısı ve 15 Temmuz 2026 core-libs-dev değerlendirmesi, hangi JDK sınıflarının değer sınıfına dönüşmeye daha yakın olduğunu somutlaştırıyor.
- Platform mühendisliği tarafında Airbnb'nin Java ile yeniden yazdığı `sitar-agent`, Spring Cloud Config benzeri merkezi konfigürasyon ihtiyaçlarında “uygulama içi kütüphane” yerine “yerel sidecar + snapshot bootstrap” modelinin neden tekrar güç kazandığını gösteriyor.

## Kritik Güncellemeler

### 1. Spring Boot OSS bakım hattı artık takvimden çok support-line yönetişimi işi

[Spring and Security In The Times Of AI](https://spring.io/blog/2026/06/01/spring_and_security_in_the_times_of_ai) yazısı, Mayıs release train'inin kaymasının temel sebebini 2026 baharında patlayan AI destekli security report hacmi olarak açıklıyor. Bunun pratik sonucu 1 Temmuz 2026'da [issue #50902](https://github.com/spring-projects/spring-boot/issues/50902) altında Andy Wilkinson tarafından somutlaştırıldı: bir sonraki `4.0.x` ve `4.1.x` patch turu için plan “erken Ağustos”. Aynı issue altında 13 Temmuz 2026'da Brian Clozel, [Spring Boot support policy](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions) ile uyumlu biçimde `3.5.x` hattında bundan sonraki sürümlerin yalnız ticari müşterilere geleceğini belirtti.

Bu, Java/Spring ekipleri için iki şeyi değiştiriyor:

- “Ay sonu patch alırız” refleksi artık güvenilir bir operasyon kuralı değil.
- `3.5.16` üzerinde kalan ekipler, yeni güvenlik/correctness backport'ları için OSS yerine ticari destek ya da daha yeni minor'a göç planı yapmak zorunda.

### 2. Spring AI `2.1.x` öncesi migration borcu bugünden görünür hale geldi

[Spring AI 2.0.0 GA duyurusu](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now), MCP tarafında Streamable HTTP'nin deprecated SSE transport'un yerine varsayılan olduğunu zaten söylemişti. Ancak [issue #6347](https://github.com/spring-projects/spring-ai/issues/6347) bu geçişin bundan sonra yalnız “öneri” değil, kaldırma takvimi olan bir migration borcu olduğunu gösteriyor.

Takip issue'sinde özellikle şunlar `2.1.x` hedefiyle kaldırma kuyruğuna alınmış görünüyor:

- `WebFluxSseServerTransportProvider`, `WebMvcSseServerTransportProvider`, `WebFluxSseClientTransport`
- `TokenTextSplitter` eski constructor'ları
- `SyncMcpToolCallbackProvider` / `AsyncMcpToolCallbackProvider` constructor'ları
- model implementasyonlarındaki `getDefaultOptions()` köprüleri

[Streamable HTTP server docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-streamable-http-server-boot-starter-docs.html) ve [MCP server starter docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html), yeni varsayılanın artık açık biçimde Streamable HTTP olduğunu doğruluyor.

### 3. Spring AI `1.1.x` hattında “otomatik backport gelir” varsayımı kırıldı

[Issue #6629](https://github.com/spring-projects/spring-ai/issues/6629), `spring-ai-ollama` `1.1.6`-`1.1.8` hattında stream edilen `ChatResponse` parçalarında `thinking` metadata'sının hâlâ eksik olduğunu ve ana hatta mevcut düzeltmenin `1.1.x`'e düşmediğini gösteriyor. Daha önemlisi, issue bugün “closed as not planned” durumda.

Bu bulgu küçük görünebilir; ancak etkisi nettir:

- `1.1.x` bakım hattı ile ana hat/`2.0.x` arasında davranış farkı kalabilir.
- “etikette auto-cherry-pick yazıyor” olması, pratikte patch parity garantisi değil.
- Özellikle model telemetry'si, reasoning trace'i veya tool orchestration diagnostic verileri üzerine ürün mantığı kuran ekipler için minor-line parity testleri şart.

### 4. Valhalla hattında hangi JDK sınıflarının ilk dalgada etkilenebileceği görünürleşti

[Inside Java yazısı](https://inside.java/2026/07/16/identify-jdk-value-classes-candidates/) ve bağlandığı [core-libs-dev tartışması](https://mail.openjdk.org/archives/list/core-libs-dev@openjdk.org/thread/Y72NRXM7KYBX43OKYBQMVKOZDWKG4MHS/) değer sınıfı göçünü soyut “ileride olur” tartışmasından çıkarıp somut aday setlerine indiriyor.

Öne çıkan noktalar:

- JEP `401` hattı için preview açıkken kullanılabilecek bir “starter kit” yaklaşımı var.
- `UUID`, `Currency`, `KeyPair`, `ValueRange` gibi bazı iyi adaylar `Serializable` bağı nedeniyle beklemek zorunda.
- `Runtime.Version`, `HexFormat`, `MathContext` gibi daha sade API'ler daha gerçekçi erken göç adayları olarak öne çıkıyor.

Bu, Spring geliştiricileri için yalnız JDK haberi değil. Çünkü değer sınıfına kayan tipler zamanla şu varsayımları zorlayacak:

- referans kimliği,
- proxy/bytecode enhancement beklentileri,
- reflection ile instance davranışı,
- serializer/deserializer ve ORM ekosistemi üzerindeki varsayımlar.

### 5. `jcmd` ile canlı JVM ayarlarını okuma yeteneği operasyon tarafında gerçek değer taşıyor

[serviceability-dev RFR 8380361](https://mail.openjdk.org/archives/list/serviceability-dev@openjdk.org/thread/Y2II7IQWBMASDFSJK6BZZTUIYPRX3G73/?sort=thread), `VM.show_settings` adlı yeni bir `jcmd` komutu öneriyor. Amaç, bugün yalnız JVM başlangıcında `-XshowSettings` ile görülebilen ayarları çalışan JVM'den alabilmek.

Thread'e göre komut şu bölümleri destekliyor:

- `vm`
- `properties`
- `locale`
- `security`
- `system`
- `security:tls` ve ilişkili alt bölümler

Bu henüz release olmuş bir özellik değil; ama yön çok değerli. Container içinde çalışan Spring servislerinde “hangi JVM ayarıyla ayağa kalktık?” sorusu için yeniden başlatma gerektirmeyen standart bir yol oluşuyor.

### 6. Airbnb'nin `sitar-agent` yeniden yazımı, konfigürasyon dağıtımında sidecar modelini yeniden ciddiye almamız gerektiğini söylüyor

[Airbnb'nin teknik yazısı](https://medium.com/airbnb-engineering/sitar-agent-building-a-reliable-dynamic-configuration-sidecar-at-scale-b7e00c152068) ve [InfoQ özeti](https://www.infoq.com/news/2026/07/sitar-agent-sidecar-config/), dinamik konfigürasyonun uygulama kütüphanesine gömülmesi yerine sidecar üzerinden yerel dosya/in-memory cache olarak sunulmasının neden tekrar popülerleştiğini net anlatıyor.

Özellikle dikkat çeken kararlar:

- agent'in Ruby'den Java'ya yeniden yazılması,
- pod startup sırasında S3 snapshot preload,
- sonrasında incremental sync,
- lokal store olarak Sparkey yerine SQLite seçimi,
- rollout güvenliği için shadow-read ve feature flag tabanlı kademeli geçiş.

Spring Cloud Config, merkezi feature flag veya tenant bazlı runtime config yöneten ekipler için bu doğrudan “alternatif tasarım kalıbı” sinyali.

## Trendler ve Sinyaller

### Trend Kümesi 1: Support-line yönetişimi, artık release note okumaktan daha kritik

Spring tarafında bugün en yüksek sinyal yeni sürüm değil, hangi hattın gerçekte yaşadığı. `3.5.x` için community sonrası döneme girilmiş olması ve `4.0.x`/`4.1.x` patch turunun takvim dışına kayması, Java ekiplerini support-line farkındalığına zorluyor.

Bu kısa vadeli gürültü değil; kurumsal backlog ve güvenlik SLA'lerini etkileyen kalıcı bir operasyon gerçeği.

### Trend Kümesi 2: Spring AI'da asıl risk yeni model değil, API/transport yüzeyinin hızla sertleşmesi

Temmuz ortasında yeni büyük Spring AI release yok; ama iki güçlü sinyal var:

- `2.1.x` için kaldırma kuyruğu birikiyor.
- `1.1.x` bakım hattı ile ana hat arasında davranış farkı kapanmayabiliyor.

Bu da AI entegrasyonunda “kod çalışıyor” seviyesinin yetmediğini, dependency line ve deprecated API envanterinin ayrıca yönetilmesi gerektiğini gösteriyor.

### Trend Kümesi 3: JVM ekosistemi geliştiricileri immutable/value semantiğine hazırlıyor

JDK value class adaylarının kamuya açık biçimde tartışılması, gelecekte hangi JDK API'lerinin referans kimliğinden uzaklaşabileceğine dair ilk somut haritayı veriyor. Bu doğrudan bugfix değil; ama Java kütüphane tasarımı, serialization ve framework entegrasyonları için uzun vadeli yön belirleyici.

### Trend Kümesi 4: Platform davranışı uygulama kütüphanesinden host-side bileşenlere kayıyor

Airbnb'nin config sidecar kararı, bazı çapraz-kesit altyapı yeteneklerinin uygulama içi SDK yerine ayrı çalışma zamanı bileşeni olarak verilmesinin tekrar güçlendiğini gösteriyor. Spring ekipleri için bu, config, feature flag, secret sync ve observability ajanlarında benzer yönleri yeniden düşünme çağrısı.

### Kısa ömürlü gürültü vs kalıcı değer

- Kalıcı değer: support-line disiplini, Streamable HTTP migration'ı, deprecated API temizliği, value-class hazırlığı, restart'sız JVM ayar görünürlüğü
- Orta vadeli izleme alanı: Spring AI `2.1.x` removal takvimi, `1.1.x` bakım hattındaki kalan parity açıkları, sidecar tabanlı config dağıtımının Java kurumsal standartlarına dönüşüp dönüşmeyeceği
- Gürültü riski: sessiz release günlerinde “önemli bir şey yok” deyip support ve migration borcunu görünmez bırakmak

## Araçlar ve Kütüphaneler

- [Spring AI Streamable HTTP server starter docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-streamable-http-server-boot-starter-docs.html): yüksek öncelik. MCP sunucusu kuran ekipler için SSE yerine varsayılan yol artık bu.
- [Spring AI MCP server starter docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html): yüksek öncelik. Hangi transport'un hangi davranış setini verdiğini netleştirmek için.
- [Spring Boot Supported Versions wiki](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions): yüksek öncelik. Teknik doküman değil, release programı ve support-line yönetimi için operasyon belgesi gibi ele alınmalı.
- [OpenJDK JEP 401](https://openjdk.org/jeps/401) ve [Inside Java value class candidates yazısı](https://inside.java/2026/07/16/identify-jdk-value-classes-candidates/): orta-yüksek öncelik. Kütüphane ve framework tasarımı yapan ekipler için.
- [Airbnb Sitar-agent yazısı](https://medium.com/airbnb-engineering/sitar-agent-building-a-reliable-dynamic-configuration-sidecar-at-scale-b7e00c152068): orta öncelik. Config delivery, bootstrap ve runtime isolation tasarımı yapan platform ekipleri için.

Bugün yeni bir “hemen al” OSS kütüphanesi yok. Sinyal daha çok mevcut stack'in hangi yönde sertleştiğiyle ilgili.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Boot `3.5.16` kullanan ekipler, bu hattı “yakında yine patch gelir” varsayımıyla değil “OSS kapanmış olabilir” varsayımıyla yönetmeli.
- Spring AI `2.0.x` kullanan ekipler, deprecated API ve transport envanterini şimdi çıkarmazsa `2.1.x` geldiğinde göç maliyeti birikmiş halde önlerine düşer.
- Spring AI `1.1.x` hattında stream reasoning metadata'sına dayalı gözlemleme yapan ekipler, patch parity'yi test etmeden release notuna güvenmemeli.
- Kütüphane/framework geliştiren Java ekipleri, `UUID`, `Runtime.Version`, `HexFormat` gibi tipler etrafında identity, equality ve serialization varsayımlarını daha görünür test etmeli.
- Operasyon tarafında, canlı JVM ayarlarını restart'sız okuma kabiliyeti geldiğinde bunu ilk benimsemesi gereken ekipler Spring Boot servislerini container içinde yöneten platform takımları olacak.
- Merkezi config veya feature flag dağıtımında sürekli baş ağrısı yaşayan ekipler, sidecar tabanlı local-read modelini yeniden değerlendirmeli; özellikle polyglot platformlarda.

## Fırsatlar ve Riskler

- Fırsat: Spring support-line kararlarını ADR seviyesinde görünür hale getirip sürüm yükseltmelerini “aylık rutin” yerine “destek sözleşmesi” olarak yönetmek.
- Risk: `3.5.x` hattında kalıp yeni güvenlik/backport beklentisini yanlış kurmak.
- Fırsat: Spring AI transport ve builder geçişlerini şimdi tamamlayıp `2.1.x` öncesi migrasyonu ucuzlatmak.
- Risk: deprecated SSE/MCP API'lerini üretimde bırakıp minor yükseltmeyi gereksiz pahalı hale getirmek.
- Fırsat: value-class yönüne hazırlanarak framework/SDK tasarımında daha az kimlik-bağımlı modeller kurmak.
- Risk: `Serializable`, proxy ve reflection varsayımlarını test etmeden JDK yeniliklerini yalnız dil özelliği gibi okumak.
- Fırsat: config delivery'de snapshot preload + local cache + sidecar kombinasyonuyla startup dayanıklılığını artırmak.
- Risk: sidecar desenini körü körüne kopyalayıp tek dilli sistemlerde gereksiz operasyon maliyeti yaratmak.

## İzlenmesi Gereken Konular

- [Spring Boot issue #50902](https://github.com/spring-projects/spring-boot/issues/50902) üzerinde erken Ağustos `4.0.x`/`4.1.x` planının kesin tarihe dönüp dönmediği
- `3.5.x` için community sonrası dönemde yeni bir güvenlik istisnası olup olmayacağı
- [Spring AI issue #6347](https://github.com/spring-projects/spring-ai/issues/6347) altındaki kaldırmaların ilk hangilerinin `2.1.x` milestone'una gerçekten alındığı
- [Spring AI issue #6629](https://github.com/spring-projects/spring-ai/issues/6629) sonrası `1.1.x` hattında benzer backport/parity açıklarının birikip birikmediği
- [OpenJDK JEP 401](https://openjdk.org/jeps/401) hattında “starter kit” dışındaki adayların ne zaman daha somut migrasyon planına kavuşacağı
- [JDK-8380361](https://bugs.openjdk.org/browse/JDK-8380361) ve ilgili `VM.show_settings` çalışmasının hangi release'e ineceği
- Airbnb benzeri sidecar tabanlı config dağıtım desenlerinin Spring/Java topluluğunda referans mimariye dönüşüp dönüşmeyeceği

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Boot bakım ritmi takvimsel refleks olmaktan çıkıyor; support-line kararı daha merkezi hale geliyor
- `source`: [Spring and Security In The Times Of AI](https://spring.io/blog/2026/06/01/spring_and_security_in_the_times_of_ai) | [Spring Boot Supported Versions wiki](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions) | [Spring Boot issue #50902](https://github.com/spring-projects/spring-boot/issues/50902) | [Spring Boot project page](https://spring.io/projects/spring-boot/)
- `author`: Michael Minella | Andy Wilkinson | Brian Clozel
- `date`: 1 Haziran 2026, 1 Temmuz 2026, 13 Temmuz 2026
- `category`: support-policy, release-governance, security-operations
- `tags`: spring-boot, support-line, 3.5.x, 4.1.x, patch-cadence, commercial-support, security-influx
- `summary`: Spring ekibi AI kaynaklı security raporu patlaması nedeniyle release takvimini sıkıştırdı; `4.0.x` ve `4.1.x` için bir sonraki patch turu erken Ağustos'a kaydı, `3.5.x` hattı ise topluluk için fiilen kapanmış durumda.
- `why_it_matters`: Takvim temelli upgrade planı yapan ekiplerde güvenlik SLA'si ve dependency override stratejisi bozulabilir.
- `java_spring_relevance`: Spring Boot kullanan her servis için doğrudan etkili; özellikle uzun yaşayan maintenance hatlarında kalan kurumsal ekipler için kritik.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: destekli minor'a geçişi hızlandırmak; upgrade playbook'unu release takviminden bağımsızlaştırmak
- `risks`: `3.5.x` üzerinde kalıp gelecekteki OSS backport'ları yanlış varsaymak; güvenlik düzeltmelerini geç almak
- `migration_notes`: `3.5.16`, `4.0.7`, `4.1.0` tabanlarını ayrı ayrı risk matrisiyle değerlendirin; topluluk dışı hatlarda kalacaksanız ticari destek veya hızlandırılmış minor yükseltme planı üretin.

### Bulgu 2

- `title`: Spring AI `2.1.x` öncesi kaldırma kuyruğu büyüyor; MCP transport ve builder geçişi ertelenmemeli
- `source`: [Spring AI 2.0.0 GA Available Now](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now) | [Streamable-HTTP MCP Servers](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-streamable-http-server-boot-starter-docs.html) | [MCP Server Boot Starter docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html) | [Spring AI issue #6347](https://github.com/spring-projects/spring-ai/issues/6347)
- `author`: Christian Tzolov | Spring AI team | GitHub issue contributor `kuntal1461`
- `date`: 12 Haziran 2026 ve 9 Haziran 2026 sonrası `2.1.x` tracking
- `category`: ai-platform, migration, transport, developer-productivity
- `tags`: spring-ai, mcp, streamable-http, sse-deprecation, builder-migration, getoptions, 2.1.x
- `summary`: Spring AI `2.0` ile Streamable HTTP varsayılan hale gelmişken, `2.1.x` için açılan tracking issue eski SSE transport'ları, bazı constructor tabanlı API'leri ve `getDefaultOptions()` köprülerini kaldırma hattına koyuyor.
- `why_it_matters`: Bugün çalışan kod, bir sonraki minor'da kırılmadan önce size düşük maliyetli bir göç penceresi bırakıyor.
- `java_spring_relevance`: Spring AI ile MCP sunucusu/istemcisi, tool callback veya model options API'leri kullanan Boot ekipleri için doğrudan önemli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: transport katmanını sadeleştirmek; builder tabanlı API'lere geçip minor yükseltmeleri ucuzlatmak
- `risks`: deprecated transport ve constructor'ları yaygınlaştırıp `2.1.x` geçişini pahalı hale getirmek
- `migration_notes`: `WebFluxSseServerTransportProvider`, `WebMvcSseServerTransportProvider`, `WebFluxSseClientTransport`, `TokenTextSplitter` constructor'ları ve `getDefaultOptions()` kullanımını repo çapında aratın; `Streamable HTTP` ve builder tabanlı API'lere geçiş planı çıkarın.

### Bulgu 3

- `title`: Spring AI `1.1.x` bakım hattında streaming reasoning metadata parity'si kapanmayabilir
- `source`: [Spring AI issue #6629](https://github.com/spring-projects/spring-ai/issues/6629)
- `author`: GitHub issue contributor `jankahnes`
- `date`: 15-16 Temmuz 2026
- `category`: ai-platform, maintenance-line, observability, compatibility
- `tags`: spring-ai-ollama, 1.1.x, thinking-metadata, streaming, backport-gap, parity
- `summary`: `spring-ai-ollama` `1.1.6`-`1.1.8` hattında stream edilen cevap parçalarına `thinking` metadata'sı eklenmiyor; ana hatta mevcut düzeltme `1.1.x`'e düşmemiş ve issue “not planned” kapatılmış görünüyor.
- `why_it_matters`: Maintenance line üzerinde kalmak, davranışsal feature parity kaybı anlamına gelebilir; bu da telemetry ve orchestration mantığını sessizce etkiler.
- `java_spring_relevance`: Spring AI + Ollama kullanan ve stream metadata'sını loglama, UX ya da reasoning görünürlüğü için tüketen ekipler için doğrudan ilgili.
- `actionability`: `izlemelik`
- `impact_level`: `orta`
- `opportunities`: `2.0.x` ana hat geçişini hızlandırmak; stream/non-stream parity testlerini standartlaştırmak
- `risks`: `1.1.x` üzerinde reasoning metadata'sına bağlı ürün mantığı kurup sessiz veri kaybı yaşamak
- `migration_notes`: `thinking` metadata'sı kritikse `1.1.x` üzerinde stream kullanımını test edin; gerekiyorsa `call()` yoluna dönün veya `2.0.x` göçünü öne çekin.

### Bulgu 4

- `title`: JDK value class aday listesi, gelecekte hangi kimlik varsayımlarının kırılacağını bugünden işaret ediyor
- `source`: [Identifying JDK Value Class Candidates](https://inside.java/2026/07/16/identify-jdk-value-classes-candidates/) | [OpenJDK core-libs-dev thread](https://mail.openjdk.org/archives/list/core-libs-dev@openjdk.org/thread/Y72NRXM7KYBX43OKYBQMVKOZDWKG4MHS/) | [JEP 401](https://openjdk.org/jeps/401)
- `author`: Dan Smith
- `date`: 15-16 Temmuz 2026
- `category`: jvm, language-evolution, library-design, compatibility
- `tags`: valhalla, jep-401, value-classes, uuid, runtime-version, hexformat, serializable
- `summary`: OpenJDK tarafı, preview açıkken “starter kit” değer sınıfları ve potansiyel sonraki adayları daha sistematik biçimde tartışıyor; `Serializable` ve public constructor gibi uyumluluk başlıkları öne çıkıyor.
- `why_it_matters`: Değer sınıfları yalnız dil düzeyi konu değil; framework entegrasyonları, reflection, serializer ve equality/identity varsayımlarını uzun vadede etkiliyor.
- `java_spring_relevance`: JPA/Hibernate yardımcıları, Jackson modülleri, custom cache key'leri, DSL ve proxy tabanlı araçlar yazan Java/Spring ekipleri için önemli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: kimlikten bağımsız tasarımlara yönelmek; equality ve serialization testlerini güçlendirmek
- `risks`: `==`, object identity, proxyability veya `Serializable` varsayımlarını gizli kontrat olarak bırakmak
- `migration_notes`: `UUID`, `Runtime.Version`, `HexFormat`, `MathContext` benzeri tipleri kullanan yardımcı kütüphanelerde referans kimliği varsayımlarını tarayın; serializer ve reflection tabanlı testleri JDK EA hattında çalıştırın.

### Bulgu 5

- `title`: `VM.show_settings` önerisi, canlı JVM ayar görünürlüğünü operasyonel bir primitive'e dönüştürüyor
- `source`: [OpenJDK serviceability-dev thread: RFR 8380361](https://mail.openjdk.org/archives/list/serviceability-dev@openjdk.org/thread/Y2II7IQWBMASDFSJK6BZZTUIYPRX3G73/?sort=thread) | [JDK-8380361](https://bugs.openjdk.org/browse/JDK-8380361)
- `author`: Kieran Farrell
- `date`: 1 Temmuz 2026
- `category`: jvm, serviceability, operations, diagnostics
- `tags`: jcmd, xshowsettings, vm.show_settings, runtime-diagnostics, security-tls, properties
- `summary`: Önerilen `VM.show_settings` komutu, `-XshowSettings` çıktısını çalışan JVM'den `jcmd` ile almayı hedefliyor; `vm`, `properties`, `locale`, `security`, `system` ve `security:tls` bölümleri destekleniyor.
- `why_it_matters`: JVM ayarlarını görmek için yeniden başlatma veya startup flag'lerine bağımlılık azalır; üretim tanılama maliyeti düşer.
- `java_spring_relevance`: Container içindeki Spring Boot servislerinde heap, property ve güvenlik ayarlarının runtime doğrulanması için doğrudan değerli.
- `actionability`: `izlemelik`
- `impact_level`: `orta-yuksek`
- `opportunities`: live diagnostics playbook'larını sadeleştirmek; incident response sırasında JVM ayar doğrulamasını hızlandırmak
- `risks`: özellik geldiğinde mevcut iç araçlar ve shell script'lerle çakışan iki ayrı teşhis yolunu yönetmek
- `migration_notes`: JVM teşhis araç setinizi `jcmd` merkezli düşünmeye başlayın; bu özellik release olduğunda startup log parse'ına dayalı check'leri kademeli azaltabilirsiniz.

### Bulgu 6

- `title`: Airbnb'nin Java tabanlı config sidecar'ı, merkezi konfigürasyonda yerel okuma modelini yeniden öne çıkarıyor
- `source`: [Sitar-agent: Building a reliable dynamic configuration sidecar at scale](https://medium.com/airbnb-engineering/sitar-agent-building-a-reliable-dynamic-configuration-sidecar-at-scale-b7e00c152068) | [InfoQ summary](https://www.infoq.com/news/2026/07/sitar-agent-sidecar-config/)
- `author`: Bo Teng, Cosmo Qiu, Siyuan Zhou, Ankur Soni, Xin Huang, Willis Harvey | Leela Kumili
- `date`: 4 Haziran 2026 ve 8 Temmuz 2026
- `category`: platform-engineering, cloud-native, config-management, distributed-systems
- `tags`: sidecar, dynamic-config, kubernetes, java, s3-snapshot, sqlite, feature-flag, startup-reliability
- `summary`: Airbnb, dinamik konfigürasyon dağıtımı için sidecar yaklaşımını koruyup agent'i Java'ya taşıdı; S3 snapshot preload, incremental pull sync ve SQLite tabanlı lokal store ile ölçek, güvenilirlik ve startup davranışını iyileştirdi.
- `why_it_matters`: Merkezi config servisi tek bağımlılık noktası olmaktan çıkarılabiliyor; uygulamalar config'i yerelden okuyor, platform katmanı teslimatı üstleniyor.
- `java_spring_relevance`: Spring Cloud Config, feature flag, secret/certificate sync veya tenant bazlı runtime config kullanan mikroservis platformları için doğrudan mimari alternatif.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: bootstrap güvenilirliğini artırmak; polyglot filolarda ortak config dağıtım katmanı kurmak; rollout riskini feature flag ve shadow-read ile azaltmak
- `risks`: sidecar maliyetini tek dilli veya küçük filolarda gereksiz yere taşımak; config freshness ihtiyacı gerçek zamanlı ise pull modelin sınırına çarpmak
- `migration_notes`: Spring Cloud Config benzeri topolojilerde “SDK mı sidecar mı?” kararını yeniden açın; sidecar düşünülüyorsa snapshot preload, shared filesystem, local cache invalidation ve kademeli rollout mekanizmalarını tasarımın başında ele alın.

## Sonuç

17 Temmuz 2026 itibarıyla en güçlü sinyal yeni release değil, destek ve migration gerçekliği. Spring Boot tarafında support-line yönetimi release takviminden daha önemli hale gelmiş durumda; Spring AI tarafında ise `2.1.x` öncesi kaldırma kuyruğu ve `1.1.x` parity açıkları aynı anda backlog'a girmeli. JVM tarafında value-class ve serviceability sinyalleri, 2026 sonu ve 2027 başı için framework ve platform ekiplerinin bugün hazırlık yapmasını gerektiriyor. Platform düzeyinde ise Airbnb örneği, config/flag dağıtımında sidecar + snapshot + local read modelinin Java ekosisteminde yeniden ciddi bir seçenek olduğunu gösteriyor.
