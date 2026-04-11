# Günlük Java / Spring Ekosistem Raporu

Tarih: `11 Nisan 2026, 09:05 TRT`

Kapsam: `10 Nisan 2026 09:00 TRT` ile `11 Nisan 2026 09:05 TRT` arasındaki günlük tarama.

Kaynak tarama notu: [Spring Blog](https://spring.io/blog/), Spring proje/dokümantasyon sayfaları, Spring release notları ve changelog'lar, [OpenJDK](https://openjdk.org/), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), Josh Long içerikleri, Gunnar Morling'in güncel yazıları, Spring maintainer release duyuruları, ilgili GitHub/Wiki release notları ve Burak KUTBAY blogu kontrol edildi. Dün ayrıntılı işlendiği için `Spring Cloud Gateway CVE-2026-22750`, `21 Nisan Java CPU hazırlığı` ve `Spring Security 7 MFA` bugünkü raporda tekrar edilmedi. Bugün Burak KUTBAY blogunda ve Spring security advisories tarafında yeni yüksek etkili bir günlük değişiklik tespit edilmedi. Baeldung ve InfoQ tarandı; bugünkü öncelik sırasını değiştiren yeni birinci seviye Java/Spring bulgu çıkmadı.

## Öne Çıkan Başlıklar

- `JDK 26` içindeki [JEP 522](https://openjdk.org/jeps/522), G1 kullanan Java servislerinde en somut platform sinyalini veriyor: yoğun referans yazan iş yüklerinde `5-15%` throughput artışı, daha hafif write barrier ve hafif pause-time iyileşmesi.
- `JDK 27` için iki erken uyumluluk uyarısı öne çıkıyor: `java.locale.useOldISOCodes` tamamen kaldırılıyor ve `ThreadPoolExecutor.finalize()` siliniyor. İlki locale/etiketleme davranışını, ikincisi ise bazı özel executor türevlerinde derleme sürecini etkileyebilir.
- [Spring Boot 4.1.0-M4](https://spring.io/blog/2026/03/26/spring-boot-4-1-0-M4-available-now) çizgisi, preview hattında “yeni özellik eklemek”ten çok “M3 regresyonlarını geri almak, JPA bootstrap davranışını netleştirmek ve gRPC observability entegrasyonunu sıkılaştırmak” yönünde ilerliyor.
- [Spring Framework 7 current API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/resilience/annotation/EnableResilientMethods.html), core resilience kabiliyetlerini artık somut bir yüzey alanına taşımış durumda: `@Retryable`, `@ConcurrencyLimit` ve `@EnableResilientMethods`.
- [Spring Modulith 2.1 M4](https://spring.io/blog/2026/03/27/spring-modulith-2-1-m4-2-0-5-and-1-4-10-released) ve [Spring AI 2.0.0-M4 / 1.1.4 / 1.0.5](https://spring.io/blog/2026/03/26/spring-ai-2-0-0-M4-and-1-1-4-and-1-0-5-available) duyuruları, ekosistemin modüler mimari ve AI tarafında “demo” yerine “operasyonel kabiliyet + migration disiplini” aradığını gösteriyor.

## Kritik Güncellemeler

1. `JDK 26` performans tarafında teorik değil, ölçülebilir bir kazanç getiriyor.
   [OpenJDK JEP 522](https://openjdk.org/jeps/522), G1'in senkronizasyon maliyetini azaltıp yazma bariyerini küçültüyor. [Inside Java podcast](https://inside.java/2026/03/12/podcast-051/) ve [Oracle Java 26 GA yazısı](https://blogs.oracle.com/java/the-arrival-of-java-26) bunu doğrudan JDK 26'nın öne çıkan runtime kazanımı olarak işaret ediyor.

2. `JDK 27` uyumluluk kırılımları bugünden test edilmesi gereken sınıfa girdi.
   [Inside Java heads-up](https://inside.java/headsup/) akışında iki madde özellikle öne çıkıyor: [locale legacy kod property’sinin kaldırılması](https://inside.java/2026/03/10/quality-heads-up/) ve [ThreadPoolExecutor.finalize() kaldırımı](https://inside.java/2026/02/10/quality-heads-up/). Bunlar “release note okuruz” seviyesini geçti; EA lane ile erkenden taranmalı.

3. `Spring Boot 4.1.0-M4`, preview kullanan ekipler için upgrade notu niteliğinde.
   [Resmi duyuru](https://spring.io/blog/2026/03/26/spring-boot-4-1-0-M4-available-now) ve [release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-M4-Release-Notes), M3'te gelen Rabbit/AMQP değişikliklerinin geri alındığını, `application.properties` / `application.yaml` regresyonunun düzeltildiğini, `spring.jpa.bootstrap` ayarının eklendiğini ve gRPC observation entegrasyonunun sıkılaştırıldığını gösteriyor.

4. Bugün yeni bir Spring güvenlik advisories dalgası yok.
   Dünkü Gateway/TLS bulgusu halen kritik başlık. Bugünkü taramada yeni bir Spring CVE veya kırıcı güvenlik duyurusu öne çıkmadı; bu nedenle öncelik “yeni alarm” değil, mevcut güvenlik ve migration işlerinin tamamlanması.

## Trendler ve Sinyaller

### 1. Java platformunda “özellik listesi” yerine “iş yükü etkisi” dönemi

JDK 26 ve JDK 27 sinyalleri birlikte okunduğunda en değerli bilgi yeni syntax değil, üretim davranışı. G1 throughput artışı, locale davranışı ve finalizer temizliği doğrudan servis davranışını, test matrisini ve operasyon maliyetini etkiliyor.

### 2. Spring portföyü daha fazla altyapı primitive’ini kendi içine çekiyor

Bu bir çıkarımdır: [Spring Framework 7 resilience API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/resilience/annotation/EnableResilientMethods.html), [Spring Boot 4.1 gRPC paketleri](https://docs.spring.io/spring-boot/4.1/api/java/org/springframework/boot/grpc/server/package-summary.html) ve [Spring Modulith 2.1 M4](https://spring.io/blog/2026/03/27/spring-modulith-2-1-m4-2-0-5-and-1-4-10-released) birlikte okunduğunda; retry, concurrency limiting, event externalization ve gRPC desteği artık “dış kütüphane takarsın” seviyesinden çıkıp resmi platform yönü haline geliyor.

### 3. AI tarafında yenilik kadar migration disiplinine de baskı var

[Spring AI 2.0.0-M4 / 1.1.4 / 1.0.5](https://spring.io/blog/2026/03/26/spring-ai-2-0-0-M4-and-1-1-4-and-1-0-5-available) sadece yeni özellik değil; provider bazlı entegrasyonları deprecate ediyor ve structured output davranışını olgunlaştırıyor. Bu, AI entegrasyonlarının artık “oyuncak POC” değil, uzun ömürlü destek/migration konusu olduğunu gösteriyor.

### 4. Spring maintainer mesajı ile konferans gündemi hizalı

[Josh Long’un 31 Mart This Week in Spring yazısı](https://spring.io/blog/2026/03/31/this-week-in-spring-march-31st-2026), aynı hafta çıkan Boot, Modulith ve Spring AI sürümlerini toparlıyor. [Spring I/O 2026 programındaki](https://2026.springio.net/sessions/building-durable-production-ready-agents-with-spring-ai-and-temporal-workshop/) durable agents/operasyonel AI temaları ile birlikte okunduğunda, topluluk yönü “yeni oyuncaklar” yerine üretim sertliği olan desenlere kayıyor.

## Araçlar ve Kütüphaneler

- `Spring Boot 4.1.0-M4`: Preview kullanan ekipler için M3 kaynaklı Rabbit/AMQP ve config regressions sonrası daha güvenli bir baseline.
- `Spring Framework 7 resilience`: `@Retryable`, `@ConcurrencyLimit`, `@EnableResilientMethods` ile çekirdek retry ve concurrency limiting.
- `Spring gRPC / Boot 4.1`: [server](https://docs.spring.io/spring-boot/4.1/api/java/org/springframework/boot/grpc/server/package-summary.html), [client auto-config](https://docs.spring.io/spring-boot/4.1/api/java/org/springframework/boot/grpc/client/autoconfigure/package-summary.html), [health](https://docs.spring.io/spring-boot/4.1/api/java/org/springframework/boot/grpc/server/autoconfigure/health/GrpcServerHealthProperties.html) ve observation katmanı artık resmi Boot API yüzeyinde.
- `Spring Modulith 2.1 M4`: JobRunr tabanlı event externalization, Event Publication Registry tetik anotasyonu ve daha iyi AOT desteği.
- `Spring AI 1.1.4 / 2.0.0-M4`: Dynamic structured output, model/provider bugfix’leri ve bazı provider entegrasyonları için deprecation sinyali.
- `Hardwood 1.0.0.Beta1`: [Gunnar Morling](https://www.morling.dev/blog/hardwood-reaches-beta-s3-predicate-push-down-cli/) tarafında yeni, hızlı ve minimal bağımlılıklı Parquet okuma aracı. Düşük öncelikli ama veri ağırlıklı Java backend ekipleri için izlemeye değer.

## Java / Spring Geliştiricileri İçin Etkiler

- `JDK 26` testlerinde sadece unit/integration değil, GC log ve throughput karşılaştırması yapın. Özellikle G1 kullanan API servisleri, queue consumer’lar ve event processor’lar için canary ölçümü mantıklı.
- `JDK 27 EA` lane’i açın. `Locale` etiketleri, eski `iw/in/ji` beklentileri, özel executor kalıtımları ve `finalize()` kalıntıları erken kırılım verebilir.
- `Boot 4.1.0-M3` denediyseniz, `M4` upgrade notlarını boş geçmeyin. Özellikle AMQP starter POM’ları, config parsing ve `spring.data.jpa.repositories.bootstrap-mode` davranışı tekrar doğrulanmalı.
- `Framework 7` ile gelen core resilience özelliklerini, mevcut `Resilience4j` kullanımını körlemesine sökmek için değil, basit retry ve concurrency limit senaryolarını platforma yaklaştırmak için değerlendirin.
- `Spring AI` kullanan ekipler provider entegrasyonlarını soyutlamadan production’a çıkmamalı. Deprecation sinyali artık somut.
- `Spring Modulith` tarafı, modüler monolitten event-driven kırılıma geçen ekipler için “outbox ve publication tracking” disiplinini kolaylaştırıyor.

## Fırsatlar ve Riskler

### Fırsatlar

- `JDK 26` ile donanım artırmadan throughput kazanımı alma ihtimali.
- `Boot 4.1` gRPC ve observation yüzeyi ile iç servis iletişimini daha standart kurabilme fırsatı.
- `Modulith 2.1 M4` ile event publication süreçlerini JobRunr üzerinden operasyonel hale getirme imkanı.
- `Spring AI` structured output ve provider soyutlamasıyla daha kontrollü AI entegrasyonları kurma fırsatı.

### Riskler

- `JDK 27` kırılımları, düşük görünürlükteki locale ve executor kodlarında sessiz uyumsuzluk yaratabilir.
- `Boot 4.1` hâlâ preview; erken adaptasyon varsa regressions ve upgrade churn riski var.
- Core resilience API’lerini tam circuit breaker/bulkhead alternatifi sanmak yanlış mimari sadeleştirme kararlarına yol açabilir.
- `Spring AI` provider deprecations, belirli vendor’a sıkı bağlanmış uygulamalarda migration maliyeti yaratır.

## İzlenmesi Gereken Konular

- `Spring Boot 4.1.0-RC1` ve final release notları.
- `JDK 27` EA ile locale/finalizer başlıklarında gerçek proje kırılımları.
- Spring I/O 2026 sonrası yayınlanacak `Boot 4`, `Framework 7`, `observability`, `gRPC` ve `durable agents` oturum özetleri.
- `Spring AI` tarafında deprecated provider’lar için önerilecek resmi geçiş rotaları.
- `Hardwood` tarafında `1.0.0.Final` ve performans benchmark’ları.
- Burak KUTBAY blogu ve Gunnar Morling tarafında bu başlıkları doğrudan etkileyen yeni pratik içerikler.

## Kaynak Bazlı Bulgular

### 1. JDK 26 ile G1 GC tarafında gerçek throughput kazanımı geliyor

- **title:** JDK 26 G1 iyileştirmesi Spring Boot servislerinde ölçülebilir runtime kazanımı sunuyor
- **source:** [OpenJDK JEP 522](https://openjdk.org/jeps/522), [Inside Java: Episode 51 “Unboxing Java 26 for Developers”](https://inside.java/2026/03/12/podcast-051/), [Oracle Java Blog: The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26)
- **author:** OpenJDK tarafında Ivan Walulya ve Thomas Schatzl; Inside Java tarafında Billy Korando; Oracle tarafında Sharat Chander
- **date:** `12 Mart 2026` / `17 Mart 2026`
- **category:** JVM performansı / GC / runtime
- **tags:** `jdk-26`, `g1-gc`, `throughput`, `latency`, `spring-boot`, `performance`
- **summary:** JEP 522, G1 ile uygulama thread’leri ve GC thread’leri arasındaki senkronizasyonu azaltıyor. OpenJDK ölçümleri, yoğun referans yazan iş yüklerinde `5-15%` throughput artışı; daha genel iş yüklerinde de write barrier sadeleşmesinden gelen ek kazanç gösteriyor.
- **why_it_matters:** Bu, dil özelliği değil; üretim CPU tüketimi ve kapasite planlaması üzerinde etkisi olabilecek bir runtime değişikliği.
- **java_spring_relevance:** Varsayılan G1 kullanan Spring Boot servislerinde, özellikle allocation-heavy API, messaging ve batch iş yüklerinde doğrudan ilgili.
- **actionability:** Hemen canary ve benchmark ile ölçülmeli.
- **impact_level:** Yüksek.
- **opportunities:** Aynı donanımda daha fazla iş yükü; GC tuning ihtiyacının azalması; p95/p99 iyileşmesi.
- **risks:** Native memory kullanımında küçük artış; bazı iş yüklerinde beklenen kazancın görülmemesi; JDK upgrade regression riski.
- **migration_notes:** `JDK 21/25 -> 26` geçişinde GC log, CPU, RSS ve latency metriklerini birebir karşılaştırın. G1 dışı collector kullanıyorsanız bu bulgunun etkisi düşer.

### 2. JDK 27 iki sessiz uyumluluk kırılımı getiriyor

- **title:** Locale legacy kodları ve ThreadPoolExecutor.finalize() için JDK 27 erken uyarısı
- **source:** [Inside Java heads-up index](https://inside.java/headsup/), [JDK 27: Removal of 'java.locale.useOldISOCodes' System Property](https://inside.java/2026/03/10/quality-heads-up/), [JDK 27: Removal of ThreadPoolExecutor.finalize()](https://inside.java/2026/02/10/quality-heads-up/)
- **author:** Nicolai Parlog
- **date:** `10 Mart 2026` / `10 Şubat 2026`
- **category:** JDK uyumluluğu / migration / breaking change
- **tags:** `jdk-27`, `locale`, `finalize`, `threadpoolexecutor`, `migration`, `compatibility`
- **summary:** `java.locale.useOldISOCodes` property’si tamamen kaldırılıyor; `iw/in/ji` gibi eski ISO beklentileri artık desteklenmeyecek. Ayrıca `ThreadPoolExecutor.finalize()` kaldırıldığı için bazı alt sınıflarda `super.finalize()` çağrıları derleme hatasına dönüşebilir.
- **why_it_matters:** Bu tip değişiklikler test kapsamı dar projelerde kolayca gözden kaçar ve üretimde “niye farklı davranıyor?” seviyesinde sessiz hata üretir.
- **java_spring_relevance:** Spring MVC locale çözümleme, i18n mesajları, JSON serialization ve özel executor wrapper’ları olan kurumsal servislerde orta-yüksek ilgili.
- **actionability:** İzlemek yetmez; EA lane ile otomatik test çalıştırılmalı.
- **impact_level:** Orta-yüksek.
- **opportunities:** Eski locale/finalizer teknik borcunu temizlemek; JDK 27 hazırlığını erken başlatmak.
- **risks:** Locale etiketlerinde davranış farkı; özel executor implementasyonlarında compile failure; eksik regression testi.
- **migration_notes:** `ripgrep` ile `useOldISOCodes`, `finalize(` ve `extends ThreadPoolExecutor` tarayın. JDK 27 EA ile CI smoke lane açın.

### 3. Spring Boot 4.1.0-M4 preview hattını stabilize ediyor

- **title:** Spring Boot 4.1.0-M4, M3 geri dönüşleri ve bootstrap/gRPC düzeltmeleriyle daha güvenli bir preview tabanı sunuyor
- **source:** [Spring Boot 4.1.0-M4 available now](https://spring.io/blog/2026/03/26/spring-boot-4-1-0-M4-available-now), [Spring Boot 4.1.0-M4 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1.0-M4-Release-Notes)
- **author:** Andy Wilkinson
- **date:** `26 Mart 2026`
- **category:** Spring Boot / preview release / upgrade
- **tags:** `spring-boot-4.1.0-m4`, `jpa-bootstrap`, `grpc`, `amqp`, `config-processing`, `preview`
- **summary:** M4, M3'te yapılan Rabbit/AMQP değişikliklerini geri alıyor, config processing regresyonunu düzeltiyor, `spring.jpa.bootstrap` ayarını ekliyor ve gRPC server-side observation convention entegrasyonunu iyileştiriyor.
- **why_it_matters:** Preview sürüm kullanan ekipler için “özellik” kadar “hangi regresyon düzeldi, ne geri alındı, neyi tekrar test etmeliyim?” sorusu önemli.
- **java_spring_relevance:** Boot 4.1 pilotu, async JPA bootstrap, AMQP kullanan servisler ve gRPC observability isteyen ekipler için yüksek ilgili.
- **actionability:** Preview kullananlar için hemen uygulanabilir; diğerleri için izleme.
- **impact_level:** Yüksek.
- **opportunities:** Boot 4.1 pilotunu daha kontrollü yürütmek; JPA startup süresini arka planda yönetmek; gRPC ölçümlerini daha standart hale getirmek.
- **risks:** Preview churn; M3’ten gelen konfigurasyon farkları; async bootstrap yanlış executor ile beklenmedik startup davranışı.
- **migration_notes:** M3 kullanıcıları AMQP starter POM’larını geri kontrol etmeli. `spring.data.jpa.repositories.bootstrap-mode=deferred` kullanıyorsanız uygun `AsyncTaskExecutor` tanımını doğrulayın.

### 4. Spring Framework 7, retry ve concurrency limiting’i çekirdeğe taşıyor

- **title:** Spring Framework 7 core resilience yüzeyi artık resmi ve okunabilir
- **source:** [EnableResilientMethods API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/resilience/annotation/EnableResilientMethods.html)
- **author:** Juergen Hoeller
- **date:** `current API, 2026 itibarıyla Spring Framework 7.0.x`
- **category:** Spring Framework / resilience / architecture
- **tags:** `spring-framework-7`, `resilience`, `retryable`, `concurrencylimit`, `aop`, `architecture`
- **summary:** Spring Framework 7 current API, `@EnableResilientMethods` ile `@Retryable` ve `@ConcurrencyLimit` anotasyonlarını resmi çekirdek resilience özellikleri olarak sunuyor.
- **why_it_matters:** Retry ve concurrency limiting için her zaman ek kütüphane şartı azalıyor; basit senaryolar platform içine taşınabiliyor.
- **java_spring_relevance:** Spring Boot 4 / Framework 7 planlayan ekiplerde, özellikle IO-bound entegrasyonlar ve aşırı yük koruması için pratik değer taşıyor.
- **actionability:** Hemen değerlendirilir ama seçici kullanılmalı.
- **impact_level:** Orta-yüksek.
- **opportunities:** Basit retry/concurrency limit senaryolarında bağımlılık sadeleşmesi; davranışın framework seviyesinde standartlaşması.
- **risks:** Core resilience’ı full circuit breaker veya bulkhead eşdeğeri sanmak; AOP/proxy sınırlarını yanlış okumak.
- **migration_notes:** Mevcut Resilience4j kullanımını bütünüyle sökmeyin. Önce düşük karmaşıklıklı retry/concurrency senaryolarında pilotlayın.

### 5. Spring Modulith 2.1 M4 operasyonel event akışlarını güçlendiriyor

- **title:** Spring Modulith 2.1 M4, JobRunr tabanlı event externalization ve AOT tarafını ilerletiyor
- **source:** [Spring Modulith 2.1 M4, 2.0.5, and 1.4.10 released](https://spring.io/blog/2026/03/27/spring-modulith-2-1-m4-2-0-5-and-1-4-10-released), [This Week in Spring - March 31st, 2026](https://spring.io/blog/2026/03/31/this-week-in-spring-march-31st-2026)
- **author:** Oliver Drotbohm; derleme sinyali olarak Josh Long
- **date:** `27 Mart 2026` / `31 Mart 2026`
- **category:** Modüler mimari / event-driven / Spring Modulith
- **tags:** `spring-modulith`, `jobrunr`, `event-publication-registry`, `aot`, `modular-monolith`
- **summary:** 2.1 M4; JobRunr ile event externalization, Event Publication Registry için explicit annotation tanımı ve `MomentsJacksonModule` için daha iyi AOT desteği getiriyor.
- **why_it_matters:** Modulith yalnızca “paketleri düzenleme” aracı olmaktan çıkıp operasyonel event publication ve geçiş mimarisi tarafında daha somut hale geliyor.
- **java_spring_relevance:** Modüler monolit, domain event, outbox benzeri publication tracking ve gelecekte ayrışabilecek bounded context’ler için yüksek pratik değer taşıyor.
- **actionability:** Mimari pilotlar için değerlendirilmeli.
- **impact_level:** Orta.
- **opportunities:** Modüler monolitten event-driven geçişi yumuşatmak; publication takibini güvenilir hale getirmek; AOT uyumunu artırmak.
- **risks:** Erken milestone kullanımı; JobRunr bağımlılığıyla operasyonel karmaşıklık; domain event tasarımının zayıf kalması.
- **migration_notes:** Mevcut outbox/event publication mekanizmanız varsa doğrudan değiştirmeyin. Önce düşük kritik bir bounded context’te pilotlayın.

### 6. Spring AI sürümleri artık migration yükü de üretiyor

- **title:** Spring AI 2.0.0-M4 ve servis hatları, provider bağımlılığı için net deprecation sinyali veriyor
- **source:** [Spring AI 2.0.0-M4, 1.1.4 and 1.0.5 are available now](https://spring.io/blog/2026/03/26/spring-ai-2-0-0-M4-and-1-1-4-and-1-0-5-available)
- **author:** Ilayaperumal Gopinathan
- **date:** `26 Mart 2026`
- **category:** Spring AI / release / migration
- **tags:** `spring-ai`, `structured-output`, `vertex-ai`, `oci-genai`, `zhipu-ai`, `deprecation`
- **summary:** 1.1.4 dinamik structured output control ekliyor; 2.0.0-M4 ise Vertex AI, ZhiPu AI ve OCI GenAI model integration sınıfları için deprecation ilan ediyor ve gelecekte kaldırılacağını söylüyor.
- **why_it_matters:** AI katmanında vendor seçimi artık framework seviyesinde de maliyet üretmeye başladı; yanlış soyutlama üretim migration’ını pahalılaştırır.
- **java_spring_relevance:** Spring AI kullanan veya planlayan Java ekipleri için doğrudan ilgili.
- **actionability:** Aktif Spring AI kullanan ekipler için hemen değerlendirilmeli.
- **impact_level:** Orta.
- **opportunities:** Provider soyutlama katmanını güçlendirmek; structured output akışlarını daha güvenli hale getirmek.
- **risks:** Deprecated provider’lara sıkı bağlanma; release hattı hızından dolayı sürekli migration baskısı; model SDK sürüm uyumsuzlukları.
- **migration_notes:** Provider bağımlı adapter’ları uygulama çekirdeğinden ayırın. Prompt, output schema ve tool wiring’i model sağlayıcısından bağımsız tutmaya çalışın.

### 7. Gunnar Morling’in Hardwood Beta sürümü veri ağırlıklı Java servisleri için düşük öncelikli ama sağlam bir sinyal

- **title:** Hardwood 1.0.0.Beta1, minimal bağımlılıklı Parquet erişimi için izlemeye değer
- **source:** [Hardwood Reaches Beta: S3, Predicate Push-Down, CLI, and More](https://www.morling.dev/blog/hardwood-reaches-beta-s3-predicate-push-down-cli/)
- **author:** Gunnar Morling
- **date:** `2 Nisan 2026`
- **category:** OSS araç / veri işleme / Java library
- **tags:** `hardwood`, `parquet`, `s3`, `predicate-pushdown`, `cli`, `low-priority`
- **summary:** Hardwood 1.0.0.Beta1; S3 backend, predicate push-down, Avro bindings ve CLI getiriyor. Minimal bağımlılık ve Java built-in HTTP client kullanımı dikkat çekiyor.
- **why_it_matters:** Her Spring ekibi için ana öncelik değil; ama veri lake, batch, analytics veya dosya tabanlı işleyen Java servisleri için performans/bağımlılık açısından ilginç.
- **java_spring_relevance:** Düşük-orta. Tipik CRUD mikroservisler için düşük; veri yoğun servisler için anlamlı.
- **actionability:** Düşük öncelikle izlenmeli.
- **impact_level:** Düşük.
- **opportunities:** Parquet okuma tarafında hafif ve hızlı alternatif denemek; S3 üstünden gereksiz IO’yu azaltmak.
- **risks:** Beta sürüm olması; ekosistem olgunluğunun henüz erken safhada olması.
- **migration_notes:** Üretim standardı yapmadan önce benchmark, schema uyumu ve hata gözlemlenebilirliği test edilmeli.

## Sonuç

Bugünün en kalıcı teknik sinyali `JDK 26 G1` kazancı ve `JDK 27` uyumluluk başlıkları. Java backend ekipleri için asıl iş, yeni dil özelliği okumak değil; `JDK 26` canary ölçümü ve `JDK 27 EA` uyumluluk taramasını açmak.

Spring tarafında ise `Boot 4.1`, `Framework 7`, `Modulith` ve `Spring AI` birlikte okunduğunda ortak yön net: platform daha fazla altyapı primitive’ini kendi içine alıyor, ama bunun bedeli preview churn ve migration disiplini. Kısa vadede en doğru hareket; preview hatlarını seçici pilotlamak, gRPC/resilience/modulith kabiliyetlerini kontrollü denemek ve AI/provider soyutlamasını şimdiden sıkı kurmak.
