# Günlük Java / Spring Ekosistem Raporu

Tarih: 5 Nisan 2026

Kapsam: 4 Nisan 2026 09:00 TRT ile 5 Nisan 2026 09:00 TRT arasındaki günlük tarama. Etkisi süren son 7-14 günlük resmi sürümler ve güçlü teknik sinyaller yalnızca bugün için anlamlı bir karar bağlamı üretiyorsa dahil edildi.

Not: Bu koşuda önceki raporlarda ayrıntılı işlendiği için `Northfields 2025.0.2`, `Boot 4.0 release highlights` ve `JDK 26` genel özellik listesi tekrar edilmedi. Odak, bugün daha güçlü hale gelen veya yeni açıdan önemli görünen sinyallerde tutuldu.

## Öne Çıkan Başlıklar

- En güçlü yeni Spring sinyali, tek bir büyük GA duyurusundan çok bakım ve preview hatlarının nasıl davrandığı oldu: `Spring Security` bakım sürümleri, `Boot 4.1` mesajlaşma hattındaki geri alma ve `Spring AI` tarafındaki deprecation/testability baskısı birlikte okunmalı.
- `Boot 4.1` preview hattı özellikle `Rabbit/AMQP` ve `Spring gRPC` alanında hâlâ hareketli. `M3` ile denenen bazı değişikliklerin `M4` sonrasında `4.2` hattına ötelenmesi, mesajlaşma altyapısında erken standardizasyonun riskli olduğunu gösteriyor.
- `Spring AI` cephesinde dikkat artık yeni demo feature’lardan çok bakım yüküne kayıyor: structured output kontrolü, provider bazlı deprecated entegrasyonlar ve MCP araçlarının test edilmesi bu alanın normal backend mühendisliğine yaklaştığını gösteriyor.
- Java tarafında en anlamlı farklılaşma, `JDK 26`’nın operasyonel yönü. Inside Java ve Oracle içerikleri artık dil/JEP anlatmaktan çok crash analizi, `HttpClient` davranışı, güvenlik ve runbook disiplinine odaklanıyor.
- Event-driven sistemlerde toplu mesaj tüketimi ve workflow güvenilirliği yeniden öne çıkıyor. Kafka offset commit semantiği, saga/workflow pratikleri ve durable async desenler aynı problem kümesini işaret ediyor: teslimat garantileri hâlâ mimarinin en pahalı hata alanlarından biri.

## Kritik Güncellemeler

- `Spring Security 6.5.9`, `7.0.4` ve `7.1.0-M3` hattı bu koşunun en önemli güvenlik/bakım sinyallerinden biri. İkincil kaynaklar, bu sürümlerin `CVE-2026-22732` düzeltmesini ve birkaç yeni güvenlik API iyileştirmesini taşıdığını vurguluyor. Güvenlik başlıkları ve cache/header davranışı olan ekiplerde bekletilmemeli.
- `Spring Cloud Config` için `CVE-2026-22739` düzeltmesini taşıyan `Spring Cloud 2025.0.2` hâlâ haftanın en net “hemen ele alınacak” bakım konusu. Bu raporda tekrar merkezde tutulmadı, ancak önem seviyesi düşmüş değil.
- `Spring Boot 4.1.0-M4`, `M3` içinde gelen bazı `Rabbit/AMQP` ve `application.properties` tabanlı `Spring gRPC` davranışlarını `4.2`’ye öteledi. Preview kullanıcıları için bu, “çalıştıysa tamamdır” değil “her milestone’da yeniden doğrula” anlamına geliyor.
- `Spring AI 2.0.0-M4`, `1.1.4` ve `1.0.5` aynı anda yayımlandı. Bu durum, AI entegrasyonlarının artık yan proje değil düzenli patch, dependency ve deprecation takibi gerektiren ana bağımlılık seti olduğunu teyit ediyor.
- `JDK 26` tarafında bugün öne çıkan nokta yeni API sayısı değil; runtime davranışı, güvenlik ve tanı araçlarının üretim runbook’larına taşınması gerekliliği.

## Trendler ve Sinyaller

### 1. Spring preview hatları artık “erken özellik kataloğu” değil, gerçek uyumluluk riski taşıyan keşif alanı

`Spring AMQP 4.1.0-M3`, `Boot 4.1.0-M3` ve sonrasındaki `M4` değişimleri birlikte okunduğunda mesajlaşma hattının hâlâ şekillenmekte olduğu görülüyor. `RabbitMQ 4.0`, `AMQP 1.0`, stream SSL ve `Spring gRPC` tarafında pilot yapan ekipler, bu alanı henüz platform standardı olarak kodlamamalı.

### 2. Spring AI, hype fazından çıkıp bakım ve yönetişim fazına giriyor

Resmi `Spring AI` sürümü, bazı provider entegrasyonlarını deprecated ederek çıkarma yoluna girmiş durumda. Aynı dönemde Craig Walls’ın `MCP Apps` yazısı richer UI entegrasyonunu, Baeldung’in `MCP tool testing` yazısı ise test disiplinini öne çıkarıyor. Kalıcı değer artık “agent demo” değil; sözleşme testi, provider izolasyonu ve geri alma stratejisi.

### 3. JVM operasyonu uygulama ekiplerine daha fazla kayıyor

`Inside Java` içerikleri ve Oracle’ın `Java 26` duyuruları, Java yükseltmelerinin artık yalnızca platform ekibinin işi olmadığını gösteriyor. `jcmd`, `JFR`, core dump analizi, `HttpClient` timeout kapsamı ve güvenlik değişiklikleri, servis ekiplerinin kendi incident ve migration runbook’larına girmeli.

### 4. Event-driven doğruluk yeniden merkezde

Kafka offset commit davranışı, saga/workflow içerikleri ve `Spring Modulith` çevresindeki durable event externalization konuşmaları aynı sinyali veriyor: ekipler hâlâ teslimat garantilerini araç seviyesinde değil, tasarım seviyesinde çözmek zorunda. “Exactly once” söylemi pratikte hâlâ pahalı ve bağlam bağımlı.

### 5. Gürültü ile kalıcı değer ayrımı daha net

Baeldung, InfoQ, Josh Long ve Burak KUTBAY kaynakları bu hafta çoğunlukla aynı temayı doğruluyor: sadeleşen çekirdek Spring kabiliyetleri, daha sıkı runtime davranışı ve üretim disiplinine kayan AI/tooling kullanımı. Buna karşılık sırf yeni olduğu için öne çıkarılabilecek bazı OSS araçları bugün çoğu Spring backend takımı için düşük öncelikli kalıyor.

## Araçlar ve Kütüphaneler

- `Hardwood 1.0.0.Beta1`: Gunnar Morling’in yeni `Parquet` parser’ı artık `S3` backend, predicate pushdown, `Avro` binding’leri ve CLI desteği taşıyor. Tipik CRUD/mikroservis takımı için düşük öncelikli; veri yoğun servisler, ingestion işleri ve backfill süreçleri için izlemeye değer.
- `Spring AMQP 4.1.0-M3`: `RabbitMQ 4.0` ve `AMQP 1.0` eksenindeki deneysel yön, event-driven takımlar için yüksek teknik ilgi taşıyor; fakat üretim standardı olarak erken.
- `Spring Integration 7.1.0-M3`: CloudEvents builder ve `Duration` odaklı API sadeleşmeleri, entegrasyon katmanında type-safe ve daha okunabilir konfigürasyon yönünü güçlendiriyor.
- `Kubernetes/operator` tarafında bugün yeni, yüksek etkili bir GA bulgusu çıkmadı. Bu koşuda platform engineering tarafı daha çok JVM operasyon ve event-delivery doğruluğu üzerinden anlamlı sinyal verdi.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Security` ve `Spring Cloud Config` kullanan ekipler için kısa vadeli doğru hareket, bakım sürümlerini bekletmemek ve özellikle response header/caching davranışlarını regression testlerle doğrulamak.
- `Boot 4.1` preview hattında mesajlaşma veya `Spring gRPC` kullanan ekipler, `M3` üstünde çalışan prototipleri `M4` ile yeniden denemeli. Preview sürümde “bir kez geçti” sonucu güvenilir değil.
- `Spring AI` kullanan ekipler provider bağımlılık envanteri çıkarmalı. Deprecated edilen entegrasyonlar varsa migration zamanı gelmeden abstraction katmanı ve test harness hazırlanmalı.
- `JDK 26` yükseltmesi planlayan ekipler, yalnızca compile/test yeşilliğine güvenmemeli. `HttpClient`, timeout bütçesi, core dump analizi, `jcmd/JFR` politikaları ve TLS davranışları ayrıca ele alınmalı.
- Kafka veya başka bir broker üzerinden event tüketen ekipler, offset/ack davranışını idempotency, retry, DLT ve side-effect sıralaması ile birlikte düşünmeli. Framework seçimi tek başına garanti üretmiyor.

## Fırsatlar ve Riskler

### Fırsatlar

- `Spring Security` ve `Cloud` bakım hatları üzerinden büyük mimari değişiklik yapmadan güvenlik riskini düşürmek.
- `Boot 4 / Framework 7` ile gelen sadeleşme yönünü kontrollü pilotlarda kullanıp özel wrapper katmanlarını azaltmak.
- `Spring AI` tarafında provider bağımlılıklarını ayrıştırıp test edilebilir bir araç/mcp mimarisi kurmak.
- Event-driven servislerde offset, retry ve idempotency disiplinini standartlaştırarak üretim sürprizlerini azaltmak.
- Veri odaklı JVM servislerinde `Hardwood` gibi daha hafif araçları laboratuvar ortamında değerlendirmek.

### Riskler

- `Spring Security` veya `Config` bakım sürümlerini yalnızca “küçük patch” diye ertelemek.
- `Boot 4.1` milestone davranışlarını kalıcı platform kararı gibi almak.
- `Spring AI` provider değişikliklerini PoC rahatlığıyla yönetmeye devam etmek.
- `JDK 26` geçişini yalnızca geliştirici laptop testleriyle onaylamak.
- Event tüketiminde offset commit ile iş yan etkilerini yanlış sırada işleyip sessiz veri kaybı veya duplicate üretmek.

## İzlenmesi Gereken Konular

- `Spring Security 7.1.x` hattında `M3` sonrasında gelecek yeni backport veya ek güvenlik düzeltmeleri
- `Boot 4.2` hattında `Rabbit/AMQP` ve `Spring gRPC` değişikliklerinin hangi kapsamla geri döneceği
- `Spring AI` tarafında deprecated provider entegrasyonlarının kaldırılma takvimi ve resmi production guidance seviyesi
- `JDK 26` için gerçek dünya regresyon raporları: timeout, TLS, crash analysis ve container diagnostics
- Kafka/Saga/async workflow tarafında Spring topluluğundan gelecek yeni referans mimari veya migration önerileri
- `Hardwood` gibi yeni veri odaklı JVM araçlarının beta sonrası olgunluk sinyalleri

## Kaynak Bazlı Bulgular

### 1. Güvenlik bakım hattı güçleniyor: `Spring Security` patch’leri bekletilmemeli

- **title:** `Spring Security 6.5.9 / 7.0.4 / 7.1.0-M3`, güvenlik bakımının bu hafta ertelenmemesi gereken başlığı
- **source:** [Spring Blog Releases sayfası](https://spring.io/blog/category/releases/page-9/), [Spring Security releases](https://github.com/spring-projects/spring-security/releases), [InfoQ Java News Roundup - March 24, 2026](https://www.infoq.com/news/2026/03/java-news-roundup-mar24-2026/)
- **author:** Rob Winch, Michael Redlich
- **date:** 19 Mart 2026, 23 Mart 2026
- **category:** Security / release / maintenance
- **tags:** `spring-security`, `cve-2026-22732`, `security-headers`, `authorization`, `maintenance`
- **summary:** `Spring Security` bakım sürümleri, güvenlik açığı düzeltmesiyle birlikte birkaç yeni yeteneği de taşıyan toplu bir bakım dalgası oluşturdu. Haber değeri sadece yeni sürüm numarası değil; güvenlik header/caching davranışlarının tekrar odak kazanması.
- **why_it_matters:** Güvenlik sorunları çoğu zaman framework kodundan çok proxy, cache ve response davranışıyla birleşince pahalı hale gelir. Bu tip açıklar patch gecikmesini daha riskli kılar.
- **java_spring_relevance:** `Spring Security`, servlet stack, gateway, CDN veya reverse proxy önünde çalışan Java/Spring servisleri için doğrudan ilgili.
- **actionability:** Hemen aksiyon
- **impact_level:** Yüksek
- **opportunities:** Bakım sürümünü erken alıp güvenlik yapılandırmasını sadeleştirmek; authorization tarafındaki yeni public API’leri kontrollü biçimde değerlendirmek.
- **risks:** Header/caching davranışını doğrulamadan prod’a çıkmak; güvenlik patch’ini küçük patch sanıp geciktirmek.
- **migration_notes:** Sürüm yükseltmesinden sonra response header setlerini, cache-control davranışını, login/logout akışlarını ve edge cache senaryolarını test edin.

### 2. `Boot 4.1` mesajlaşma hattı hâlâ oynuyor: preview sonuçlarına aşırı güvenilmemeli

- **title:** `Spring AMQP` ve `Boot 4.1` hattı, mesajlaşma tarafında erken standardizasyon için henüz yeterince stabil değil
- **source:** [This Week in Spring - March 24th, 2026](https://spring.io/blog/2026/03/24/this-week-in-spring-march-24th-2026), [Spring AMQP releases](https://github.com/spring-projects/spring-amqp/releases), [Spring Boot releases](https://github.com/spring-projects/spring-boot/releases), [InfoQ Java News Roundup - March 31, 2026](https://www.infoq.com/news/2026/03/java-news-roundup-mar31-2026/)
- **author:** Josh Long, Spring Team, Michael Redlich
- **date:** 24 Mart 2026, 31 Mart 2026
- **category:** Messaging / preview / migration
- **tags:** `spring-boot-4.1`, `spring-amqp`, `rabbitmq-4`, `amqp-1.0`, `spring-grpc`, `preview`
- **summary:** `M3` hattında görülen yeni mesajlaşma ve `gRPC` yönü, `M4` ile kısmen geri çekildi ve bazı davranışlar `4.2`’ye ötelenmiş oldu. Bu, mesajlaşma tarafında preview sözleşmesinin henüz sabitlenmediğini gösteriyor.
- **why_it_matters:** Messaging altyapısı genelde platform seviyesi bir standarttır. Burada erken verilen kararlar yüzlerce servis, test altyapısı ve operasyon runbook’unu etkileyebilir.
- **java_spring_relevance:** `RabbitMQ`, `AMQP`, stream tabanlı entegrasyonlar veya `Spring gRPC` pilotu yapan Spring ekipleri için yüksek ilgili.
- **actionability:** Hemen doğrulama
- **impact_level:** Yüksek
- **opportunities:** `Boot 4.2` gelmeden önce kırılma alanlarını erken görmek; yeni messaging kabiliyetlerini izole pilotlarda değerlendirmek.
- **risks:** Milestone davranışlarını kurumsal standarda çevirmek; prototip konfigürasyonlarını üretim şablonlarına kopyalamak.
- **migration_notes:** `M3` üstünde çalışan mesajlaşma/gRPC prototiplerini `M4` ile yeniden deneyin; property binding, broker uyumu, SSL ve integration test akışlarını milestone bazında yeniden doğrulayın.

### 3. `Spring AI` artık PoC rahatlığıyla yönetilemez

- **title:** `Spring AI` tarafında yeni gerçeklik: structured output kontrolü, provider deprecation’ları ve test edilebilir MCP araçları
- **source:** [Spring AI 2.0.0-M4, 1.1.4 and 1.0.5 are available now](https://spring.io/blog/2026/03/26/spring-ai-2-0-0-M4-and-1-1-4-and-1-0-5-available), [Blending Chat with Rich UIs with Spring AI and MCP Apps](https://spring.io/blog/2026/03/20/blending-chat-with-rich-uis-with-spring-ai-and-mcp-apps), [Testing MCP Tools with Spring AI](https://www.baeldung.com/spring-ai-test-mcp-tools)
- **author:** Ilayaperumal Gopinathan, Craig Walls, Baeldung
- **date:** 20 Mart 2026, 26 Mart 2026
- **category:** AI platform / maintenance / testing
- **tags:** `spring-ai`, `mcp`, `structured-output`, `provider-deprecation`, `tool-testing`, `agentic-systems`
- **summary:** Resmi `Spring AI` sürümü yeni structured output kontrolleri ve dependency güncellemeleri getirirken, bazı provider entegrasyonlarını deprecated ediyor. Eşzamanlı olarak topluluk içeriği richer UI entegrasyonlarını ve araç test etme pratiklerini öne taşıyor.
- **why_it_matters:** AI entegrasyonu kullanan ekipler için asıl maliyet model çağırmak değil; provider bağımlılığı, test determinismi, güvenlik ve bakım disiplinidir.
- **java_spring_relevance:** `Spring Boot` üstünde LLM entegrasyonu, tool calling, MCP veya AI destekli workflow kullanan ekipler için doğrudan ilgili.
- **actionability:** Yakın vadeli güncelleme
- **impact_level:** Orta-Yüksek
- **opportunities:** Provider soyutlama katmanını güçlendirmek; deterministic tool testing ile prod hata riskini azaltmak; chat dışı UI entegrasyonlarını kurumsal ürünlere taşımak.
- **risks:** Deprecated provider entegrasyonlarına bağımlı kalmak; tool çağrılarını sözleşme testi olmadan prod’a çıkmak.
- **migration_notes:** Kullanılan provider/adaptor listesini çıkarın. Deprecated modüller için çıkış planı hazırlayın. Tool/MCP akışlarını mock veya sabit cevap setleriyle entegrasyon testine alın.

### 4. `JDK 26` için asıl iş, yeni özellik saymak değil runbook yazmak

- **title:** `JDK 26`, Java ekiplerini daha güçlü tanı ve operasyon disiplinine zorluyor
- **source:** [JDK 26 Release Notes](https://jdk.java.net/26/release-notes), [The Arrival of Java 26](https://blogs.oracle.com/java/post/the-arrival-of-java-26), [Java 26 for DevOps](https://inside.java/2026/03/02/jdk-26-rn-ops/), [Analyzing Crashed JVMs - Inside Java Newscast #109](https://inside.java/2026/04/02/newscast-109/), [JDK 26 Security Enhancements](https://seanjmullan.org/blog/2026/03/16/jdk26)
- **author:** OpenJDK, Sharat Chander, Billy Korando, Nicolai Parlog, Sean Mullan
- **date:** 2 Mart 2026, 16-17 Mart 2026, 2 Nisan 2026
- **category:** JDK / runtime / operations / security
- **tags:** `jdk-26`, `httpclient`, `jfr`, `jcmd`, `core-dump`, `tls`, `security`, `devops`
- **summary:** `JDK 26` çevresindeki resmi içerikler bu hafta daha net bir operability anlatısı oluşturdu: crash sonrası analiz, `HttpClient` davranışı, güvenlik iyileştirmeleri ve runtime tanı araçları günlük geliştirme sorumluluğuna daha çok giriyor.
- **why_it_matters:** Üretimdeki pahalı sorunlar çoğu zaman özellik eksikliğinden değil, tanı eksikliğinden büyür. JDK kendi araçlarıyla bunu azaltmaya çalışıyor.
- **java_spring_relevance:** Container içinde çalışan Java servisleri, `HttpClient` kullanan uygulamalar, batch işleri ve yüksek trafik alan Spring API’leri için doğrudan ilgili.
- **actionability:** Yakın vadeli pilot
- **impact_level:** Orta-Yüksek
- **opportunities:** `JFR` ve `jcmd` tabanlı incident runbook’larını standartlaştırmak; core dump ve timeout analizini daha ucuz hale getirmek.
- **risks:** Yükseltmeyi yalnızca derleme ve smoke test ile onaylamak; tanı araçlarını kurum içinde yaygınlaştıramamak.
- **migration_notes:** Timeout budget testleri, `JFR` kayıt politikaları, crash dump prosedürleri ve TLS/driver uyumluluk senaryolarını yükseltme checklist’ine ekleyin.

### 5. Event-driven dünyada asıl problem hâlâ teslimat semantiği

- **title:** Kafka offset commit davranışı ve durable workflow tartışmaları, Spring ekiplerine aynı uyarıyı veriyor
- **source:** [Kafka Offset with Spring Boot](https://piotrminkowski.com/2026/03/27/kafka-offset-with-spring-boot/), [This Week in Spring - March 31st, 2026](https://spring.io/blog/2026/03/31/this-week-in-spring-march-31st-2026), [Spring Modulith issue GH-1637](https://github.com/spring-projects/spring-modulith/issues/1637)
- **author:** Piotr Minkowski, Josh Long, Spring Modulith maintainers
- **date:** 27 Mart 2026, 31 Mart 2026
- **category:** Event-driven architecture / reliability / messaging
- **tags:** `kafka`, `offset-commit`, `idempotency`, `saga`, `workflow`, `spring-modulith`, `jobrunr`
- **summary:** Son günlerdeki içeriklerin ortak noktası, event-driven sistemlerde esas zorluğun tüketim semantiği ve dayanıklı workflow tasarımı olduğunu hatırlatması. Offset commit ile iş yan etkilerinin sırası hâlâ en sık hata yapılan alanlardan biri.
- **why_it_matters:** Birçok üretim problemi, broker altyapısından değil uygulama tarafındaki commit/retry/idempotency modelinden kaynaklanır.
- **java_spring_relevance:** Kafka, RabbitMQ, outbox, saga veya async workflow kullanan Spring ekipleri için yüksek öncelikli.
- **actionability:** Hemen tasarım gözden geçirme
- **impact_level:** Yüksek
- **opportunities:** Idempotency key standardı, daha net ack stratejileri, observable retry zincirleri ve dayanıklı workflow tasarımı kurmak.
- **risks:** Sessiz veri kaybı, duplicate işleme, yanlış kompanzasyon akışları ve olay sonrası zor debug edilen hatalar.
- **migration_notes:** Consumer ack/commit modunu dokümante edin. Side-effect öncesi/sonrası commit sıralamasını netleştirin. DLT, retry ve idempotency kurallarını servis şablonlarına taşıyın.

### 6. Düşük öncelikli ama teknik olarak ilginç: `Hardwood` veri yoğun Java servisleri için yeni bir aday

- **title:** Gunnar Morling’in `Hardwood 1.0.0.Beta1` duyurusu, veri yoğun JVM iş yükleri için izlenmeye değer
- **source:** [Hardwood 1.0.0.Beta1 - New Features](https://www.morling.dev/blog/hardwood-beta1-new-features/)
- **author:** Gunnar Morling
- **date:** 2 Nisan 2026
- **category:** Library / data tooling
- **tags:** `parquet`, `java-21`, `s3`, `avro`, `cli`, `low-priority`
- **summary:** `Hardwood`, `Parquet` okuma tarafında `S3` backend, predicate pushdown, `Avro` binding’leri ve CLI desteği gibi yeteneklerle olgunlaşıyor.
- **why_it_matters:** Çoğu Spring mikroservis için öncelik değil; ancak veri platformu, ingestion veya raporlama servisleri için ilginç bir maliyet/performans alternatifi oluşturabilir.
- **java_spring_relevance:** Spring backend ekipleri için dolaylı; veri işleme yapan Java servisleri için orta ilgili.
- **actionability:** İzleme / laboratuvar değerlendirmesi
- **impact_level:** Düşük
- **opportunities:** Daha hafif veri işleme bağımlılık seti ve potansiyel daha sade operasyon profili.
- **risks:** Beta olgunluğu ve ekosistem adaptörü eksikliği.
- **migration_notes:** Sadece gerçek `Parquet` iş yükü olan servislerde benchmark ile değerlendirin; mevcut Hadoop/Spark ekosistemi bağımlılıklarıyla uyumu ayrıca kontrol edin.

## Sonuç

`5 Nisan 2026` taramasının en önemli mesajı, Java/Spring tarafında değerin artık “yeni feature” listesinden çok bakım, preview disiplini ve operasyon olgunluğunda biriktiğidir. Bugün alınabilecek en somut aksiyonlar: `Spring Security/Config` patch’lerini planlamak, `Boot 4.1` preview mesajlaşma prototiplerini tekrar doğrulamak ve `Spring AI` entegrasyonlarını normal backend bağımlılığı gibi yönetmeye başlamaktır.

Daha geniş resimde, `JDK 26` ve son dönem Spring içerikleri aynı noktaya gidiyor: başarılı ekipler framework sürümünü tek başına yükseltmeyecek; güvenlik, runbook, test edilebilirlik, event-delivery doğruluğu ve provider bağımlılığı gibi konuları birlikte yönetecek.
