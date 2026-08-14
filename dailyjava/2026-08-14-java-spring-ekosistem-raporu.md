# Günlük Java / Spring Ekosistem Raporu

Tarih: 14 Ağustos 2026 Cuma  
Tarama zamanı: 14 Ağustos 2026 09:06 TSİ  
Odak: Bugünün güçlü sinyali yeni bir Spring GA dalgası değil; Spring servis iletişiminin `REST-only` yaklaşımdan `HTTP interface + gRPC + gateway tabanlı protokol/politika yönetimi` modeline kayması

Tarama notu: 14 Ağustos 2026 09:06 TSİ itibarıyla [Spring Blog](https://spring.io/blog), [Spring release sayfaları](https://spring.io/blog/category/releases/), [Spring Projects](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security), [Spring Boot 4.1.0 duyurusu](https://spring.io/blog/2026/06/10/spring-boot-4/), [Spring Cloud 2025.1.2 duyurusu](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/), [Spring Cloud Gateway proje sayfası](https://spring.io/projects/spring-cloud-gateway/), [Spring gRPC proje sayfası](https://spring.io/projects/spring-grpc/), [Spring gRPC referans dokümantasyonu](https://docs.spring.io/spring-grpc/reference/getting-started.html), [Spring Cloud Gateway referans dokümantasyonu](https://docs.spring.io/spring-cloud-gateway/reference/appendix.html), [Spring Cloud Gateway CVE-2026-47825 advisory](https://spring.io/security/cve-2026-47825), [Inside Java](https://inside.java/), [Oracle Java güvenlik güncelleme takvimi yazısı](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), [JDK 27 EA sayfası](https://jdk.java.net/27/), [JDK 27 EA release notes](https://jdk.java.net/27/release-notes), [InfoQ Spring Boot 4.1 analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/), [Baeldung Java Weekly 658](https://www.baeldung.com/java-weekly-658), [Josh Long’un güncel Spring akışı](https://spring.io/blog/2026/08/11/this-week-in-spring-august-11-2026), [Gunnar Morling blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/) tarandı. 14 Ağustos 2026 itibarıyla yeni bir Boot/Framework/Cloud GA ya da yeni bir Ağustos security advisory görünmüyor. Güçlü sinyal, iletişim katmanının daha fazla protokol, daha fazla güvenlik varsayımı ve daha fazla gözlemlenebilirlik sözleşmesi istemesi.

## Öne Çıkan Başlıklar

- [Spring Cloud Gateway 5.0.2](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) hattı, [CVE-2026-47825](https://spring.io/security/cve-2026-47825) ile `Forwarded` ve `X-Forwarded-*` güven sınırını doğrudan platform meselesine çevirdi. Bu düzeltme sadece patch değil; default davranış ve ingress varsayımı değişikliği.
- [Spring Boot 4.1](https://spring.io/blog/2026/06/10/spring-boot-4/) gRPC’yi artık “üçüncü taraf entegrasyon” değil, resmi Spring iletişim yüzeyi olarak taşıyor. Ancak [Spring gRPC docs](https://docs.spring.io/spring-grpc/reference/appendix.html) bunun beraberinde deadline, keepalive, health, reflection, observation ve mesaj boyutu gibi doğrudan operasyonel kararlar getirdiğini gösteriyor.
- [Spring Cloud Gateway docs](https://docs.spring.io/spring-cloud-gateway/reference/appendix.html) artık `JSON to gRPC`, API versiyon çıkarımı, `trusted-proxies`, route seviyesinde telemetry anahtarları ve hem `WebFlux` hem `Web MVC` gateway modellerini aynı çatı altında görünür kılıyor. Gateway artık sadece reverse proxy değil.
- [Spring gRPC proje sayfası](https://spring.io/projects/spring-grpc/) ile varsayılan [referans dokümantasyonu](https://docs.spring.io/spring-grpc/reference/system-requirements.html) arasında sürüm/destek satırlarında hizasızlık var. Bu, doğrudan üretim riski değil; fakat göç kararını tek bir public sayfaya bakarak verme riskini artırıyor.
- [InfoQ analizine](https://www.infoq.com/news/2026/06/spring-boot-4-1/) göre `spring-boot-amqp` ve `AMQP 1.0` desteği Boot 4.2 hedefinde. Bu, sync iletişim backlog’unu bugün, broker/protokol genişlemesini ise ayrı bir iş akışında planlama gerektiğini söylüyor.

## Kritik Güncellemeler

### 1. Gateway katmanında güven sınırı değişti; patch atmak yetmez

[Spring Cloud Gateway advisory’si](https://spring.io/security/cve-2026-47825), belirli senaryolarda `X-Forwarded-For` ve `Forwarded` başlıklarının güvenilmeyen proxy’lerden iletilebildiğini söylüyor. Etki alanı hem `WebFlux` hem `Web MVC` gateway server’larını kapsıyor.

Asıl önemli nokta şu: düzeltme sadece versiyon yükseltmesi değil. Advisory, fix kapsamında `NettyServerCustomizer`’ın default olarak kapatıldığını ve ihtiyaç varsa property ile bilinçli biçimde yeniden açılması gerektiğini açıkça söylüyor.

Bu nedenle gateway upgrade’i için minimum kontrol listesi:

- ingress / load balancer / WAF zincirinde hangi header’ların trusted olduğunu yazılı hale getirmek
- `X-Forwarded-*` davranışını canary ortamda yeniden doğrulamak
- uygulama içi IP allow-list, audit log ve rate-limit kurallarının patch sonrası hâlâ doğru çalıştığını test etmek

### 2. Boot 4.1 ile gRPC artık “ek bir starter” değil, platform sözleşmesi

[Spring Boot 4.1 duyurusu](https://spring.io/blog/2026/06/10/spring-boot-4/) gRPC desteğini öne çıkan başlık olarak veriyor. [Spring gRPC appendix’i](https://docs.spring.io/spring-grpc/reference/appendix.html) ise bunun arkasında oldukça geniş bir operasyon yüzeyi açıldığını gösteriyor:

- default deadline yönetimi
- keepalive zamanları ve izinleri
- client-side health check
- Actuator health indicator’larını gRPC health check’e bağlama
- client/server observation açma
- default `4MiB` inbound message ve `8KiB` metadata limitleri
- reflection’ın varsayılan açık gelmesi

Pratik anlamı şu: gRPC’yi prod’a almak için `.proto` üretmek yetmez. `deadline`, `retry`, `health`, `message-size`, `keepalive`, `reflection` ve telemetry kararı ilk gün verilmelidir.

### 3. Gateway artık protocol mediation katmanı haline geliyor

[Spring Cloud 2025.1.2 duyurusu](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) üç önemli Gateway sinyali veriyor:

- `StripContextPath` filtresi
- body filter codec encoding özelleştirmesi
- Gateway tarafındaki güvenlik düzeltmesi

[Spring Cloud Gateway proje sayfası](https://spring.io/projects/spring-cloud-gateway/) ve [referans docs](https://docs.spring.io/spring-cloud-gateway/reference/appendix.html) bu resmi daha da büyütüyor:

- aynı gateway fikri hem `WebFlux` hem `Web MVC` üzerinde koşabiliyor
- `JSON to gRPC` filtresi artık görünür bir kapasiteler kümesinin parçası
- API versiyonu header, media type, path segment veya request param üzerinden çıkarılabiliyor
- route telemetry’si `route.id` ve `route.uri` ile standartlaşıyor

Bu, API gateway’in sadece yönlendirme katmanı olmaktan çıkıp protokol dönüştürme, versiyonlama ve gözlemlenebilirlik kontrol noktası haline geldiğini gösteriyor.

### 4. Spring gRPC public yüzeylerinde hizasızlık var; bu bir dokümantasyon-göç riski

Bu bulgu bir **çıkarımdır**: [Spring gRPC proje sayfası](https://spring.io/projects/spring-grpc/) bugün `1.1.0` stabil sürümünü gösterirken, varsayılan [referans doküman](https://docs.spring.io/spring-grpc/reference/system-requirements.html) tarafında `1.0.3` ve `Boot 4.0.x` desteği öne çıkıyor.

Bu fark tek başına “ürün uyumsuz” demek değil; ancak şu riski doğuruyor:

- ekipler yanlış public sayfaya bakıp yanlış destek varsayımı yapabilir
- migration kartları `Boot 4.1 + gRPC` kombinasyonunu eksik doğrulayabilir
- test ortamında geçen bir kombinasyon, resmi support beklentisiyle karıştırılabilir

Doğru yaklaşım: sürümü `BOM`, release notes ve gerçek starter kombinasyonu ile kilitlemek; public sayfa metinlerini sadece keşif girdisi olarak görmek.

### 5. AMQP 1.0 ikinci dalga; bugünün kararı sync iletişim politikasını netleştirmek

[InfoQ’nun Boot 4.1 analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/) Boot 4.2 için `spring-boot-amqp` modülü ve `QPid Proton` tabanlı `AMQP 1.0` desteğini işaret ediyor.

Bu önemli ama hemen bugünün ana aksiyonu değil. Bugünün ana kararı:

- REST çağrıları için `Http Service Client` / `@HttpExchange` yeterli mi?
- hangi sınırda gRPC daha mantıklı?
- gateway hangi protokolleri sonlandıracak ve hangi telemetry/egress policy’yi uygulayacak?

Broker/protokol genişlemesi ikinci iş akışı olarak planlanmalı.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring servisleri tek protokole indirgenmiyor, çoğullaşıyor

Tekrarlayan sinyal şu:

- klasik REST istemcileri için interface tabanlı yaklaşım güçlendi
- gRPC Spring portföyünde birinci sınıf vatandaş oldu
- gateway katmanı protokol farklarını saklamak yerine yönetir hale geliyor

Kalıcı değer burada. Bu hype değil; platform mimarisi kararı.

### Trend Kümesi 2: Güvenlik ve telemetri artık iletişim tasarımının içinde

Özellikle üç yüzey bunu tekrar ediyor:

- Boot 4.1: outbound HTTP ve observability iyileştirmeleri
- gRPC docs: deadline, health, observation, reflection, SSL bundle
- Gateway docs ve advisory: trusted proxy sınırı, route telemetry, filter policy

Bu yüzden “önce endpoint’i açalım, sonra hardening yaparız” yaklaşımı zayıflıyor.

### Trend Kümesi 3: Sync ve async backlog’ları ayrışıyor

Boot 4.1 sync iletişim ve gateway katmanını güçlendirirken, AMQP 1.0 çizgisi Boot 4.2’ye kaymış görünüyor. Yani:

- senkron servis iletişimini bugün standardize etmek gerekiyor
- asenkron protokol genişlemesini bu standardizasyonu bekletmeden ayrı planlamak gerekiyor

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: gateway ve gRPC default’larını platform standardı haline getirmek
- Kalıcı değer: her servis için iletişim matrisi çıkarmak
- Kalıcı değer: `trusted-proxies`, `deadline`, `health`, `route.id` telemetry gibi sınırları tasarım girdisi yapmak
- Düşük öncelik: bugün yeni büyük bir Spring GA çıkmadığı için günlük haber gürültüsü düşük; değer mimari sinyallerde

## Araçlar ve Kütüphaneler

- [Spring Cloud Gateway 5.0.2](https://spring.io/projects/spring-cloud-gateway/): `WebFlux` ve `Web MVC` üzerinde ortak gateway modeli, route filter/predicate yapısı, rate limiting ve path rewriting ile birlikte güvenlik düzeltmesi taşıyor.
- [Spring gRPC](https://spring.io/projects/spring-grpc/): resmi Spring iletişim yüzeyine girmiş durumda. Ancak sürüm/destek metinleri public yüzeylerde tam hizalı görünmediği için `starter + BOM + smoke test` üçlüsüyle kullanılmalı.
- [HTTP Service Client / @HttpExchange](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/): REST tarafında interface tabanlı client modeli hâlâ en düşük sürtünmeli seçeneklerden biri. Her servisi gRPC’ye çevirmek zorunlu değil.
- `spring-boot-amqp` / `AMQP 1.0` (izleme): [InfoQ](https://www.infoq.com/news/2026/06/spring-boot-4-1/) bunu Boot 4.2 yol haritası olarak gösteriyor; broker standardizasyonu için önemli.
- [Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/): veri ağırlıklı JVM servislerinde Parquet okuma maliyetini düşürmek için ilginç; tipik Spring CRUD servisleri için bugün düşük öncelikli.

## Java / Spring Geliştiricileri İçin Etkiler

- Her servis için `inbound protocol`, `outbound protocol`, `gateway path`, `trusted proxy`, `client timeout/deadline`, `health`, `telemetry`, `message size` alanlarını içeren bir iletişim matrisi çıkarın.
- gRPC pilotu başlatıyorsanız ilk gün şu kararları verin: reflection prod’da açık mı kapalı mı, default deadline ne, health check kime bağlı, max message size ne, keepalive kimde açık.
- Spring Cloud Gateway kullanan servislerde `CVE-2026-47825` fix’ini sadece patch olarak görmeyin; ingress header davranışını regresyon testiyle doğrulayın.
- REST ağırlıklı ekiplerde `@HttpExchange` tabanlı istemcileri daha geniş kullanıp gRPC’yi sadece gerçekten contract-first, latency-sensitive veya streaming ihtiyacı olan sınırlar için seçin.
- Telemetry’de en azından `route.id`, `route.uri`, HTTP/gRPC error oranı, timeout ve retry sinyallerini tek dashboard’da toplayın.

## Fırsatlar ve Riskler

- Fırsat: gateway, gRPC ve REST istemcilerinde dağınık custom kodu azaltıp ortak platform standardı kurmak
- Fırsat: gRPC’nin Actuator/Observation entegrasyonunu kullanarak servis health ve latency görünürlüğünü iyileştirmek
- Fırsat: REST için `Http Service Client`, gRPC için resmi starter, gateway için standart filter/policy yaklaşımıyla entegrasyon kodunu sadeleştirmek
- Risk: Gateway security fix sonrası `Forwarded` davranış değişikliğini prod’da geç fark etmek
- Risk: gRPC’de deadline ve message-size kararlarını vermeden pilot açmak
- Risk: Spring gRPC public sayfalarındaki sürüm/destek hizasızlığı yüzünden yanlış kombinasyonu “destekli” sanmak
- Risk: Boot 4.2’de gelecek AMQP 1.0’ı beklerken bugünün sync iletişim standardizasyonunu ertelemek

## İzlenmesi Gereken Konular

- [Spring Boot 4.1.1](https://docs.spring.io/spring-boot/system-requirements.html) ve [Boot 4.2](https://www.infoq.com/news/2026/06/spring-boot-4-1/) hattında gRPC / AMQP / observability tarafında ek değişiklikler gelip gelmeyeceği
- [Oracle’ın 18 Ağustos 2026 hedefli ek Java güvenlik güncellemesi](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates)
- [JDK 27 EA build 34](https://jdk.java.net/27/) ve [7 Ağustos 2026 güncellenmiş release notes](https://jdk.java.net/27/release-notes); özellikle iletişim, GC ve servis davranışını etkileyebilecek değişiklikler
- Spring gRPC için `1.1.x` docs/support sayfalarının public yüzeylerde net biçimde hizalanıp hizalanmayacağı
- Spring Cloud Gateway tarafında yeni advisory, `5.0.3-SNAPSHOT` veya header/gateway filter davranışını etkileyen ilave değişiklikler

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Cloud Gateway güvenlik düzeltmesi header güven sınırını ve bazı default davranışları değiştirdi
- `source`: [CVE-2026-47825](https://spring.io/security/cve-2026-47825) | [Spring Cloud 2025.1.2 duyurusu](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/)
- `author`: Spring team | Ryan Baxter
- `date`: 11 Haziran 2026
- `category`: `security`, `gateway`, `platform-governance`
- `tags`: `spring-cloud-gateway`, `cve-2026-47825`, `forwarded-headers`, `trusted-proxies`, `nettyservercustomizer`
- `summary`: Spring Cloud Gateway, güvenilmeyen proxy’lerden gelen `Forwarded` ve `X-Forwarded-*` başlıklarını belirli konfigürasyonlarda iletebildiği için düzeltildi; düzeltme bazı default davranışları da etkiliyor.
- `why_it_matters`: Bu bir edge-security ve ingress-contract problemi; patch sonrası davranışın test edilmemesi erişim kontrolü ve audit mantığını bozabilir.
- `java_spring_relevance`: Spring Cloud Gateway kullanan tüm Spring mikroservis platformları etkilenir.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: trusted-proxy ve forwarded-header politikasını standardize etmek; gateway güvenlik kontratını dokümante etmek
- `risks`: ingress zinciriyle uygulama beklentisinin ayrışması; yanlış IP/log/origin kararları
- `migration_notes`: upgrade sonrası header forwarding, rate limit, origin/IP bazlı kural ve audit kayıtları regresyon testinden geçirilmeli

### Bulgu 2

- `title`: Spring Boot 4.1 ile gRPC resmi iletişim yüzeyine taşındı; operasyonel kararlar config yüzeyinde görünür oldu
- `source`: [Spring Boot 4.1 duyurusu](https://spring.io/blog/2026/06/10/spring-boot-4/) | [Spring gRPC properties appendix](https://docs.spring.io/spring-grpc/reference/appendix.html)
- `author`: Andy Wilkinson | Spring gRPC team
- `date`: 10 Haziran 2026 ve 14 Ağustos 2026 doğrulaması
- `category`: `service-communication`, `microservices-platform`, `observability`
- `tags`: `spring-boot-4.1`, `spring-grpc`, `deadline`, `keepalive`, `actuator-health`, `reflection`, `message-size`
- `summary`: Boot 4.1 gRPC desteğini öne çıkarıyor; Spring gRPC docs ise deadline, keepalive, health, observation, reflection ve inbound limitler gibi kararların artık platform seviyesinde verilmesi gerektiğini gösteriyor.
- `why_it_matters`: gRPC adoption kararı artık sadece performans veya schema kararı değil; hata modeli ve operasyon modeli kararı da.
- `java_spring_relevance`: Spring Boot ile yeni servis iletişim protokolü seçen ekipler için doğrudan etkili.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: ortak gRPC starter/policy seti kurmak; telemetry ve health standardını iyileştirmek
- `risks`: deadlinesiz veya ölçümsüz gRPC kullanımının prod’da tail-latency ve retry sorunları üretmesi
- `migration_notes`: reflection, deadline, health ve max message size için environment bazlı açık policy yazılmalı

### Bulgu 3

- `title`: Spring Cloud Gateway protocol mediation ve route observability katmanına evriliyor
- `source`: [Spring Cloud 2025.1.2 duyurusu](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) | [Spring Cloud Gateway proje sayfası](https://spring.io/projects/spring-cloud-gateway/) | [Spring Cloud Gateway docs](https://docs.spring.io/spring-cloud-gateway/reference/appendix.html)
- `author`: Ryan Baxter | Spring Cloud team
- `date`: 11 Haziran 2026 ve 14 Ağustos 2026 doğrulaması
- `category`: `api-gateway`, `service-communication`, `observability`
- `tags`: `stripcontextpath`, `json-to-grpc`, `api-versioning`, `route-id`, `route-uri`, `webflux`, `webmvc`
- `summary`: Gateway tarafında `StripContextPath`, body codec özelleştirmesi, JSON-to-gRPC yeteneği, API versiyon çıkarımı ve route-level telemetry yüzeyi görünür biçimde büyüyor.
- `why_it_matters`: gateway artık sadece yönlendirme değil; protokol dönüştürme, versiyonlama ve gözlemlenebilirlik noktası.
- `java_spring_relevance`: Spring Cloud Gateway, Config, Discovery ve edge servisleri kullanan ekipleri doğrudan etkiler.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: route telemetry standardı kurmak; protocol mediation işini backend servislerden gateway’e taşımak
- `risks`: gateway’de protokol dönüşümünü kontrolsüz büyütmek; policy ve ownership’i netleştirmemek
- `migration_notes`: gateway route tasarımına `protocol`, `versioning`, `telemetry`, `security-owner` alanları eklenmeli

### Bulgu 4

- `title`: Spring gRPC public yüzeylerinde sürüm ve destek metni tam hizalı görünmüyor
- `source`: [Spring gRPC proje sayfası](https://spring.io/projects/spring-grpc/) | [Spring gRPC system requirements](https://docs.spring.io/spring-grpc/reference/system-requirements.html) | [Spring gRPC getting started](https://docs.spring.io/spring-grpc/reference/getting-started.html)
- `author`: Spring gRPC team
- `date`: 14 Ağustos 2026 doğrulaması
- `category`: `compatibility`, `migration-governance`, `documentation-risk`
- `tags`: `spring-grpc-1.1.0`, `spring-grpc-1.0.3`, `boot-4.0.x`, `boot-4.1`, `public-doc-drift`
- `summary`: Proje sayfası `1.1.0` stabil sürümü gösterirken varsayılan docs tarafında `1.0.3` ve `Boot 4.0.x` desteği öne çıkıyor.
- `why_it_matters`: **Bu bir çıkarımdır**; resmi yüzeyler arası hizasızlık yanlış upgrade varsayımları üretebilir.
- `java_spring_relevance`: gRPC’yi Boot 4.1 tabanında devreye almak isteyen Spring ekipleri için önemlidir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: BOM, starter ve smoke-test disiplinini sıkılaştırmak
- `risks`: ekiplerin tek bir web sayfasına bakıp destekli kombinasyonu yanlış okuması
- `migration_notes`: target kombinasyonunu `dependency tree + integration test + release note` ile doğrulayın; docs metnini tek başına karar kaynağı yapmayın

### Bulgu 5

- `title`: Boot 4.2 için AMQP 1.0 hattı görünüyor; sync ve async iletişim backlog’ları ayrılmalı
- `source`: [InfoQ Spring Boot 4.1 analizi](https://www.infoq.com/news/2026/06/spring-boot-4-1/) | [Spring Projects](https://spring.io/projects)
- `author`: Karsten Silz | Spring ecosystem pages
- `date`: 15 Haziran 2026 ve 14 Ağustos 2026 doğrulaması
- `category`: `messaging`, `roadmap`, `architecture-planning`
- `tags`: `spring-boot-4.2`, `spring-boot-amqp`, `amqp-1.0`, `qpid-proton`, `async-architecture`
- `summary`: Boot 4.2 için `spring-boot-amqp` ve `QPid Proton` tabanlı `AMQP 1.0` desteği bekleniyor; bugünün kararı ise mevcut sync iletişim katmanını netleştirmek.
- `why_it_matters`: ekipler sync protokol standardizasyonunu gelecekteki broker planına bağlayıp gereksiz gecikme yaratmamalı.
- `java_spring_relevance`: messaging ağırlıklı Spring platformları ve entegrasyon ekipleri için önemlidir.
- `actionability`: `izleme`
- `impact_level`: `orta-yüksek`
- `opportunities`: broker standardını temiz bir ikinci faz olarak planlamak
- `risks`: bugün yapılması gereken HTTP/gRPC/gateway standardizasyonunu ertelemek
- `migration_notes`: sync edge standardı ile broker yol haritasını ayrı epic’lere bölmek daha güvenli olur

### Bulgu 6

- `title`: Gunnar Morling’in Hardwood çizgisi veri-ağır JVM servisleri için ilginç, tipik Spring CRUD servisleri için düşük öncelikli
- `source`: [Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/) | [Fixed-Length Lists in Parquet](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/)
- `author`: Gunnar Morling
- `date`: 25 Haziran 2026 ve 22 Temmuz 2026
- `category`: `libraries`, `performance`, `data-engineering`
- `tags`: `hardwood`, `parquet`, `vector-embeddings`, `jvm-performance`, `low-priority`
- `summary`: Hardwood, Parquet okuma maliyetini düşürmeyi hedefleyen hafif bir JVM kütüphanesi; son yazılar fixed-length list ve embedding benzeri veri şekillerinde belirgin hız kazancı iddiası taşıyor.
- `why_it_matters`: veri servisleri ve embedding/analytics ağırlıklı JVM iş yükleri için faydalı olabilir; ama genel Spring mikroservis ekipleri için bugünün ana kararı değil.
- `java_spring_relevance`: Spring ekosisteminin veri yoğun alt kümesi için anlamlı; standart web/microservice ekipleri için düşük öncelik.
- `actionability`: `bilgi`
- `impact_level`: `düşük-orta`
- `opportunities`: Hadoop bağımlılığı taşımak istemeyen veri servislerinde daha hafif Parquet okuma katmanı denemek
- `risks`: genel amaçlı Spring platform roadmap’ine gereksiz erken almak
- `migration_notes`: ancak gerçek Parquet darboğazı olan servislerde PoC açılmalı

## Sonuç

14 Ağustos 2026 itibarıyla Java/Spring tarafında yeni büyük bir release dalgası yok; ama iletişim katmanı belirgin biçimde daha karmaşık ve daha “platform-owned” hale geliyor. Spring Boot 4.1’in gRPC desteği, Spring Cloud Gateway’in güvenlik ve protocol-mediation genişlemesi ve Boot 4.2’de görünen AMQP 1.0 hattı birlikte okunduğunda, senior Spring ekiplerinin artık her servis için `hangi protokol`, `hangi edge policy`, `hangi telemetry`, `hangi trust boundary` sorularını yazılı hale getirmesi gerekiyor.

Bugünün pratik kararı şu: `REST mi gRPC mi?` sorusunu soyut tartışma olarak bırakmayın. `@HttpExchange` tabanlı HTTP client, resmi Spring gRPC starter’ı ve Gateway policy katmanını aynı iletişim standart belgesinde birleştirin; patch ve framework yükseltmelerini de bu belgeye göre test edin.
