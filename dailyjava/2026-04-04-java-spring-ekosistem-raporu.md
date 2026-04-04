# Günlük Java / Spring Ekosistem Raporu

Tarih: 4 Nisan 2026

Kapsam: 3 Nisan 2026 09:00 TRT ile 4 Nisan 2026 09:00 TRT arasındaki günlük tarama. Karar bağlamını tamamlamak için son 7-14 gündeki etkisi devam eden resmi sürümler ve release train sinyalleri de dahil edildi.

## Öne Çıkan Başlıklar

- Bu günlük pencerede Spring tarafında dünkü kadar büyük yeni bir GA duyurusu görünmedi; ancak Mart sonundaki patch ve milestone dalgası hâlâ üretim kararlarını belirliyor.
- `Spring Boot 4.1.0-M4`, preview hattının hâlâ hareketli olduğunu gösterdi. `M3` içinde gelen bazı `Rabbit/AMQP` ve `application.properties` tabanlı `Spring gRPC` değişiklikleri `4.2` hattına ertelendi.
- Üretim hattında en güçlü kısa vadeli sinyal değişmedi: `Spring Cloud Config` için `CVE-2026-22739` düzeltmesi ve bunu taşıyan `Spring Cloud 2025.0.2` ile güncel `Boot 3.5.x` hattı en kritik bakım yolu.
- `Spring AI` üç ayrı release stream (`1.0.x`, `1.1.x`, `2.0.0-M4`) boyunca aynı anda güncellendi. Bu, AI entegrasyonlarının artık “yan proje” değil, düzenli bakım gerektiren ana bağımlılık seti olduğunu gösteriyor.
- `JDK 26` tarafında kritik nokta yeni API sayısı değil; `HttpClient` timeout kapsamı, çıktı formatı farkları ve runtime davranış değişiklikleri. Yükseltme, derleme başarısından daha fazlasını gerektiriyor.
- `Spring Modulith 2.1 M4`, `JobRunr` ile event externalization desteğini öne taşıyarak modüler monolith ve event-driven workflow’lar için daha pratik bir araç zinciri sinyali veriyor.

## Kritik Güncellemeler

- `Spring Cloud 2025.0.2 (Northfields)` ve `Spring Cloud Config` patch hattı, `CVE-2026-22739` düzeltmesini üretim release train’ine taşıyor. `Config Server` kullanan ekipler için en acil konu bu. Kaynaklar: [Spring Cloud 2025.0.2](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released/), [Release Notes](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-2025.0-Release-Notes), [CVE-2026-22739](https://spring.io/security/cve-2026-22739)
- `Spring Boot 4.1.0-M4`, preview hatta geri alma ve stabilizasyon sinyali verdi. Bu, `4.1` pilotu yapan ekiplerin milestone bazlı davranış değişikliklerini dikkatle izlemesi gerektiğini gösteriyor. Kaynak: `Spring Boot 4.1.0-M4 available now` release announcement
- `Spring AI 2.0.0-M4`, `1.1.4` ve `1.0.5` birlikte yayınlandı. Üç ayrı stream boyunca güvenlik odaklı dependency upgrade’leri ve hata düzeltmeleri geldi. Kaynak: [Spring AI 2.0.0-M4, 1.1.4 and 1.0.5 are available now](https://spring.io/blog/2026/03/26/spring-ai-2-0-0-M4-and-1-1-4-and-1-0-5-available)
- `JDK 26` release notes, Java backend ekipleri için artık doğrudan migration checklist üretiyor. Özellikle `HttpClient` timeout kapsamı ve çıktı/uyumluluk davranışları önem kazandı. Kaynaklar: [JDK 26 Release Notes](https://jdk.java.net/26/release-notes), [The Arrival of Java 26](https://blogs.oracle.com/java/post/the-arrival-of-java-26)
- Bu günlük pencerede yeni bir kritik Spring security advisory görünmedi. Odak, Mart sonundaki patch dalgasını güvenli biçimde kapatmakta kalıyor.

## Trendler ve Sinyaller

### 1. Preview sürüm kullanımı hâlâ “ürün standardı” değil, kontrollü keşif alanı

`Spring Boot 4.1.0-M4` ile bazı `M3` değişikliklerinin geri alınması, milestone sürümlerinin “erken erişim kontratı” taşıdığını tekrar hatırlatıyor. `Spring gRPC`, `Rabbit/AMQP` ya da yeni konfigürasyon davranışlarını platform standardına çevirmeden önce her milestone’da yeniden smoke test yapılmalı.

### 2. Kalıcı değer, yeni annotation veya demo’dan değil, platform sadeleşmesinden geliyor

Resmi `Spring Boot 4.0 Release Highlights`, Baeldung’in `Boot 4 / Framework 7` özeti ve Burak KUTBAY’ın son dönem içeriklerinde aynı tema tekrarlanıyor: `HTTP Service Client`, `API versioning`, `OpenTelemetry`, çekirdeğe yaklaşan resilience ve sadeleşen entegrasyon modeli. Bu eksen hype değil; orta vadeli platform maliyetini gerçekten düşürebilir.

### 3. JDK yükseltmesi artık daha fazla “davranış testi” işi

`JDK 26` için en güçlü sinyal, `HttpClient`, formatlama ve güvenlik davranışlarındaki değişimlerin application-level regression ihtiyacını artırması. Bu sürümde “testler yeşil, geçelim” yaklaşımı zayıf kalır.

### 4. Spring AI düzenli ürünleşiyor, ama üretim değeri hâlâ bakım disiplinine bağlı

Üç ayrı `Spring AI` stream’inin eşzamanlı patch alması olumlu. Ancak kalıcı değer, MCP veya agent demosundan çok dependency hijyeni, provider uyumu, izlenebilirlik ve geri alma stratejisinde oluşacak.

### 5. Gürültü ve kalıcı değer ayrımı daha net

`Oracle Java Verified Portfolio` ve JavaFX ticari destek dönüşü Java ekosistemi için haber değeri taşıyor; ancak tipik Spring backend takımı için düşük öncelikli. Buna karşılık `Cloud Config` güvenlik düzeltmesi, `Boot 4.1` preview churn’ü ve `JDK 26` davranış değişiklikleri doğrudan üretim etkili.

## Araçlar ve Kütüphaneler

- `Spring Modulith 2.1 M4`: `JobRunr` tabanlı event externalization desteği, modüler monolith ile dayanıklı arka plan işlerini birleştiren ekipler için dikkat çekici.
- `Gunnar Morling / Hardwood`: `Java 21+` için hafif ve performans odaklı yeni `Parquet` parser. Tipik Spring mikroservis ekipleri için düşük öncelikli; veri yoğun servisler için izlemeye değer.
- `Java Operator SDK 5.3.0`: Bu günlük pencerede yeni sürüm çıkmadı; ancak güçlü cache tutarlılığı ve `MicrometerMetricsV2` nedeniyle Kubernetes operator yazan Java ekipleri için hâlâ yüksek sinyalli bir araç güncellemesi olarak kalıyor.
- `InfoQ` ve benzeri ikincil kaynaklarda görülen yan ekosistem haberleri (`JobRunr`, `Gradle`, `LangChain4j`, `Solr`) bilgi verici; fakat bugünün üretim açısından en baskın konusu Spring patch/migration hattı.

## Java / Spring Geliştiricileri İçin Etkiler

- `Boot 3.5.x + Spring Cloud` kullanan ekipler için kısa vadeli doğru hareket: `Config` düzeltmesini ve `Northfields 2025.0.2` hattını geciktirmeden planlamak.
- `Boot 4.1` milestone deneyen ekipler, `M3` üzerinde yaptıkları `AMQP`, `Rabbit` ve `Spring gRPC` prototiplerini `M4` ile tekrar doğrulamalı. Preview hattında “bir kere çalıştı” sonucu yeterli değil.
- `Spring AI` kullanan ekipler bağımlılık taramasını, model/provider entegrasyon testlerini ve observability katmanını normal backend release disiplini ile yönetmeli.
- `JDK 26` geçişi için en az şu testler gerekli: yavaş response body senaryoları, `HttpClient` timeout davranışı, formatlama snapshot testleri, TLS/sertifika doğrulamaları, sürücü uyumluluğu.
- `Spring Modulith` kullanan ekipler için `JobRunr` entegrasyonu, dış olay yayımı ve durable workflow alanında sade bir alternatif oluşturabilir; ama idempotency ve failure semantics netleştirilmeden standartlaştırılmamalı.

## Fırsatlar ve Riskler

### Fırsatlar

- Büyük mimari dönüşüm yapmadan, `Cloud` ve `Boot` bakım hatları üzerinden güvenlik kapanışı almak.
- `Boot 4 / Framework 7` ile bazı özel `HTTP client`, `versioning`, observability ve resilience katmanlarını sadeleştirmek.
- `JDK 26` ile daha doğru `HttpClient` timeout semantiği ve daha net runtime davranışı kazanmak.
- `Modulith + JobRunr` yaklaşımıyla modüler monolith/event-driven desenlerinde operasyonel güvenilirliği artırmak.

### Riskler

- Milestone özelliklerini kalıcı platform standardı gibi ele almak ve `4.1.0-M4` benzeri geri almalarda kırılmak.
- `Spring AI` bağımlılık güncellemelerini klasik backend paketlerinden ayrı değerlendirmek.
- `JDK 26` davranış değişikliklerini yalnızca derleme/test başarısı üzerinden onaylamak.
- `Cloud` ve `Boot` release train uyumunu karıştırmak veya `Config Server` güvenlik düzeltmesini geriye bırakmak.

## İzlenmesi Gereken Konular

- `Spring Boot 4.2` hattında `M4` ile ertelenen `AMQP/Rabbit` ve `Spring gRPC` değişikliklerinin nasıl geri döneceği
- `Spring Cloud 2025.0.x` hattında `Config` sonrası başka güvenlik veya uyumluluk düzeltmeleri gelip gelmeyeceği
- `Spring AI` release notelarında provider sadeleştirmesi, deprecated entegrasyonlar ve production guidance seviyesinin artıp artmayacağı
- `JDK 26` için gerçek dünya regresyon raporları: `HttpClient`, formatlama, güvenlik ve sürücü uyumu
- `Modulith 2.1` hattında `JobRunr` externalization’ın ilk üretim geri bildirimleri

## Kaynak Bazlı Bulgular

### 1. Preview hattı geri çekildi: `Spring Boot 4.1.0-M4`, `M3` yeniliklerinin bir kısmını `4.2`’ye erteledi

- **title:** `Spring Boot 4.1.0-M4`, milestone özelliklerinin geçici olabileceğini tekrar gösterdi
- **source:** `Spring Boot 4.1.0-M4 available now` release announcement
- **author:** Andy Wilkinson
- **date:** 26 Mart 2026
- **category:** Release / migration / preview stability
- **tags:** `spring-boot-4.1`, `milestone`, `spring-grpc`, `rabbitmq`, `amqp`, `migration`, `preview`
- **summary:** `4.1.0-M4`, `M3` içinde eklenen bazı `Rabbit/AMQP` ve `application.properties` tabanlı `Spring gRPC` davranışlarını geri alıp `4.2` hattına öteledi; ana hedef stabilizasyon oldu.
- **why_it_matters:** Bu, milestone sürümlerde API veya davranışın çok hızlı değişebileceğini somut biçimde gösteriyor.
- **java_spring_relevance:** `Boot 4.1` pilotu yapan, messaging veya `gRPC` kullanan Spring ekipleri için doğrudan ilgili.
- **actionability:** Hemen doğrulama
- **impact_level:** Yüksek
- **opportunities:** Preview hattı güvenli şekilde deneyip gelecek `4.2` değişikliklerine erken hazırlanmak.
- **risks:** `M3` prototiplerini kalıcı varsaymak; messaging ve config davranışlarında sessiz kırılmalar yaşamak.
- **migration_notes:** `4.1.0-M3` üstünde denenen `Rabbit`, `AMQP`, `Spring gRPC` ve config akışlarını `M4` ile yeniden smoke test edin; preview özellikleri platform standardı olarak duyurmayın.

### 2. `Cloud Config` güvenlik düzeltmesi hâlâ en kritik üretim işi

- **title:** `Spring Cloud Config` için `CVE-2026-22739` düzeltmesi, `Northfields 2025.0.2` ile yaygın dağıtıma girdi
- **source:** [Spring Cloud 2025.0.2](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released/), [Spring Cloud 2025.0 Release Notes](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-2025.0-Release-Notes), [CVE-2026-22739](https://spring.io/security/cve-2026-22739)
- **author:** Ryan Baxter, Spring Team
- **date:** 2 Nisan 2026
- **category:** Security / release train / compatibility
- **tags:** `spring-cloud`, `spring-cloud-config`, `northfields`, `cve-2026-22739`, `spring-boot-3.5`, `microservices`
- **summary:** `Northfields 2025.0.2`, `Spring Cloud Config` düzeltmesini resmi release train seviyesine taşıdı ve `Boot 3.5.13` tabanlı bakım hattını netleştirdi.
- **why_it_matters:** `Config Server` kullanan ekipler için bu konu yalnızca versiyon güncellemesi değil, doğrudan güvenlik ve işletim riski.
- **java_spring_relevance:** `Spring Cloud Config`, `Gateway`, `OpenFeign`, `Kubernetes` ve dağıtık konfigürasyon kullanan mikroservis ekipleri için yüksek öncelikli.
- **actionability:** Hemen aksiyon
- **impact_level:** Yüksek
- **opportunities:** Büyük migration başlatmadan, patch seviyesi güncelleme ile güvenlik kapanışı almak.
- **risks:** Release train uyumunu bozmak veya `Config` patch’ini ertelemek.
- **migration_notes:** `spring-cloud-dependencies` BOM’unu `2025.0.2` seviyesine çekin; özellikle `Config Server` ve konfigürasyon çekme akışlarında regression testi yapın.

### 3. `Spring AI`, üç release stream boyunca aynı anda bakım aldı

- **title:** `Spring AI 2.0.0-M4`, `1.1.4` ve `1.0.5`, AI bağımlılıklarının artık düzenli bakım gerektirdiğini gösteriyor
- **source:** [Spring AI 2.0.0-M4, 1.1.4 and 1.0.5 are available now](https://spring.io/blog/2026/03/26/spring-ai-2-0-0-M4-and-1-1-4-and-1-0-5-available)
- **author:** Ilayaperumal Gopinathan
- **date:** 26 Mart 2026
- **category:** Release / security / AI platform
- **tags:** `spring-ai`, `llm`, `dependency-upgrades`, `security`, `mcp`, `agentic-patterns`
- **summary:** Üç release stream toplam `51` iyileştirme ve hata düzeltmesi aldı; duyuru, birden fazla `CVE` için dependency upgrade’lerini özellikle vurguluyor.
- **why_it_matters:** `Spring AI` artık sadece deneysel demo alanı değil; güvenlik ve bakım pencereleri olan gerçek bir platform bağımlılığı.
- **java_spring_relevance:** `Spring Boot` üzerinde model client, agent, MCP veya AI workflow kuran ekipler için doğrudan ilgili.
- **actionability:** Yakın vadeli güncelleme
- **impact_level:** Orta-Yüksek
- **opportunities:** Tek seferlik PoC yerine sürdürülebilir AI entegrasyonu kurmak; patch disipliniyle operasyon riskini azaltmak.
- **risks:** AI bağımlılıklarını ana ürün bağımlılıklarından ayrı yönetmek; provider değişikliklerini test etmeden prod’a almak.
- **migration_notes:** Kullanılan release stream’e (`1.0.x`, `1.1.x`, `2.0.x`) göre güncelleme planı çıkarın; model/provider entegrasyonları ve tracing/observability akışlarını tekrar doğrulayın.

### 4. `Spring Modulith 2.1 M4`, dayanıklı event externalization için pratik bir yol açıyor

- **title:** `Spring Modulith 2.1 M4`, `JobRunr` destekli event externalization ile workflow tarafında güçleniyor
- **source:** `Spring Modulith 2.1 M4, 2.0.5, and 1.4.10 released` release announcement, [GH-1637 Support for externalizing events via JobRunr](https://github.com/spring-projects/spring-modulith/issues/1637)
- **author:** Spring Modulith Team, Oliver Drotbohm
- **date:** 27 Mart 2026
- **category:** Architecture / tooling / event-driven
- **tags:** `spring-modulith`, `jobrunr`, `event-externalization`, `modular-monolith`, `durable-jobs`
- **summary:** `2.1 M4` hattı, olayların `JobRunr` üzerinden dışsallaştırılması için resmi destek vererek modüler monolith ile dayanıklı arka plan işlerini daha yakınlaştırıyor.
- **why_it_matters:** Birçok kurum için “hemen mikroservis” yerine modüler monolith + sağlam integration boundary yaklaşımı daha maliyet-etkin.
- **java_spring_relevance:** `Spring Boot`, domain event, outbox benzeri desenler ve dayanıklı async iş akışı kullanan ekipler için yüksek ilgili.
- **actionability:** Pilot / teknik değerlendirme
- **impact_level:** Orta
- **opportunities:** Daha sade event publication zinciri, daha görünür retry davranışı, operational olarak daha yönetilebilir workflow.
- **risks:** `JobRunr` semantiğini idempotency ve delivery garantileri netleşmeden platform standardı haline getirmek.
- **migration_notes:** Mevcut outbox, scheduler veya custom retry mekanizmaları varsa `Modulith + JobRunr` ile karşılaştırmalı bir pilot yapın; retry, ordering ve poison message senaryolarını test edin.

### 5. `JDK 26`, `HttpClient` ve runtime davranışlarında gerçek migration etkisi yaratıyor

- **title:** `JDK 26` yükseltmesi, özellikle `HttpClient` timeout kapsamı nedeniyle gerçek trafik testleri gerektiriyor
- **source:** [JDK 26 Release Notes](https://jdk.java.net/26/release-notes), [The Arrival of Java 26](https://blogs.oracle.com/java/post/the-arrival-of-java-26)
- **author:** OpenJDK, Sharat Chander
- **date:** 17 Mart 2026
- **category:** JDK / runtime / networking
- **tags:** `jdk-26`, `httpclient`, `timeout`, `runtime-behavior`, `tls`, `jdbc`
- **summary:** `HttpRequest.Builder::timeout` artık yalnızca header alınana kadar değil, response body tüketimini de kapsıyor. Aynı release notes seti, başka ağ ve uyumluluk davranış değişikliklerini de içeriyor.
- **why_it_matters:** Bu tür değişiklikler derleme aşamasında görünmez; gerçek upstream/downstream davranışında latent sorunları açığa çıkarır.
- **java_spring_relevance:** `RestClient`, `WebClient`, `HttpClient`, gateway, proxy ve üçüncü taraf servis entegrasyonu yapan tüm Java/Spring ekipleri için doğrudan ilgili.
- **actionability:** Hemen test
- **impact_level:** Yüksek
- **opportunities:** Daha doğru timeout semantiği ve daha tutarlı ağ davranışı.
- **risks:** Yavaş response body tüketen uçlarda zaman aşımı sürprizleri; prod altında görülen geç regresyonlar.
- **migration_notes:** Yavaş downstream, büyük response body ve retry zinciri senaryolarını staging’de test edin; timeout budget’larını yeniden kalibre edin.

### 6. `Inside Java` kalite uyarısı, görünüşte küçük ama pahalı bir uyumluluk riskine işaret ediyor

- **title:** `DecimalFormat` davranış farkı, `JDK 26` geçişinde snapshot ve sözleşme testlerini kırabilir
- **source:** [Quality Outreach Heads-up - JDK 26: DecimalFormat Uses the Double.toString(double) Algorithm](https://inside.java/2026/02/09/quality-heads-up/)
- **author:** Ana-Maria Mihalceanu
- **date:** 9 Şubat 2026
- **category:** Compatibility / testing / JDK
- **tags:** `jdk-26`, `decimalformat`, `compatibility`, `formatting`, `regression-tests`
- **summary:** `DecimalFormat` ve ilgili formatlama çıktılarında bazı `double` değerler için farklı sonuçlar oluşabiliyor; bu değişim özellikle golden file ve snapshot testlerini etkileyebilir.
- **why_it_matters:** Finansal çıktı, raporlama, CSV üretimi, log karşılaştırma ve API sözleşme testlerinde sessiz kırılmalar yaratabilir.
- **java_spring_relevance:** Raporlama, seri hale getirme veya formatlı sayı çıktısı üreten Java backend servisleri için ilgili.
- **actionability:** Hemen izleme + test
- **impact_level:** Orta
- **opportunities:** Formatlama davranışını daha tutarlı hale getirmek; testleri daha bilinçli yazmak.
- **risks:** Küçük görünen çıktı farkları nedeniyle prod sonrası hata veya müşteri uyumsuzluğu yaşamak.
- **migration_notes:** Sayı formatlama içeren golden testleri tekrar üretmeden önce fark analizi yapın; kritik alanlarda açık locale/format kuralları tanımlayın.

### 7. `Oracle Java Verified Portfolio`, backend takımlar için düşük öncelikli bir sinyal

- **title:** Oracle’ın yeni `Java Verified Portfolio` duyurusu backend ekipleri için şimdilik stratejik değil
- **source:** [Announcing the Oracle Java Verified Portfolio including Helidon and reintroduction of JavaFX Commercial Support](https://blogs.oracle.com/java/announcing-jvp)
- **author:** Donald Smith
- **date:** 17 Mart 2026
- **category:** Vendor packaging / ecosystem signal
- **tags:** `oracle`, `javafx`, `helidon`, `vendor-support`, `low-priority`
- **summary:** Oracle, `Helidon`, `JavaFX` ve bazı JDK çevresi bileşenleri için yeni bir portföy ve destek modeli duyurdu.
- **why_it_matters:** Vendor packaging ve destek politikası açısından anlamlı; ancak tipik Spring backend takımı için günlük teknik kararları doğrudan değiştirmiyor.
- **java_spring_relevance:** Çoğu Spring mikroservis takımı için dolaylı ve düşük öncelikli.
- **actionability:** Çoğunluk için bilgilendirici
- **impact_level:** Düşük
- **opportunities:** Oracle destekli dağıtım veya `Helidon` kullanan hibrit kurumlarda tedarik/sözleşme netliği.
- **risks:** Backend açısından zayıf ilgili bir duyuruyu gereğinden fazla stratejik okumak.
- **migration_notes:** Spring odaklı ekipler için aktif migration konusu değil; yalnızca Oracle sözleşmesi veya dağıtım standardı bağlamında izlenmeli.

### 8. Düşük öncelikli ama ilginç araç sinyali: `Hardwood`

- **title:** Gunnar Morling’in `Hardwood` duyurusu, veri yoğun Java servisleri için yeni bir `Parquet` seçeneği sunuyor
- **source:** [Hardwood: A New Parser for Apache Parquet](https://www.morling.dev/blog/hardwood-new-parser-for-apache-parquet/)
- **author:** Gunnar Morling
- **date:** 26 Şubat 2026
- **category:** Library / data tooling
- **tags:** `parquet`, `java-21`, `performance`, `gunnar-morling`, `low-priority`
- **summary:** `Hardwood`, `Java 21+` gerektiren, düşük bağımlılıklı ve performans odaklı yeni bir `Parquet` parser olarak duyuruldu.
- **why_it_matters:** Spring merkezli tipik CRUD/mikroservis ekipleri için öncelik değil; ancak veri işleme servisleri için ilginç bir alternatif.
- **java_spring_relevance:** Spring backend ekipleri için dolaylı; veri platformu, ingestion veya analitik servisleri için daha ilgili.
- **actionability:** Bilgilendirici / laboratuvar değerlendirmesi
- **impact_level:** Düşük
- **opportunities:** Daha hafif veri işleme bağımlılık seti ve potansiyel performans kazanımı.
- **risks:** Yeni ve ekosistem olgunluğu sınırlı bir kütüphane olması.
- **migration_notes:** Gerçek `Parquet` parsing ihtiyacı olan servislerde kıyaslama amaçlı deneyin; genel platform standardına çevirmeyin.

## Sonuç

`4 Nisan 2026` taramasının ana resmi şu: bugün yeni büyük Spring GA çıkmasa da, Mart sonundaki patch ve milestone dalgası üretim kararlarını belirlemeye devam ediyor. En somut aksiyon, `Spring Cloud Config` güvenlik düzeltmesini ve ilgili `Cloud/Boot` bakım hattını kapatmak; en kritik dikkat noktası ise `Boot 4.1` preview hattını kontrollü pilot olarak tutmak.

Daha geniş düzlemde `Spring` ve `JDK` tarafı aynı mesajı veriyor: 2026’da kazanan ekipler, sadece “en yeni sürüme geçme” değil, release train uyumu, davranış testi, güvenlik patch hijyeni ve platform sadeleştirmesini birlikte yöneten ekipler olacak.
