# Günlük Java / Spring Ekosistem Raporu

Tarih: 21 Haziran 2026  
Tarama zamanı: 21 Haziran 2026 09:02 TSİ  
Odak: Spring Boot 4.1 tabanının gerçek etkisi, Spring Cloud release-train desteğinde yaklaşan karar penceresi ve gRPC/secrets/GraphQL yüzeylerinde yeni mimari-göç baskısı

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Boot 4.1.0 duyurusu](https://spring.io/blog/2026/06/10/spring-boot-4/), [Spring Boot 4.1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes), [Spring Cloud 2025.1.2 (Oakwood)](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) ve [Spring Cloud 2025.0.3 (Northfields)](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/) release duyuruları, [Spring gRPC 1.1.0 duyurusu](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now), [Spring gRPC 1.1 migration guide](https://github.com/spring-projects/spring-grpc/wiki/Spring-gRPC-1.1-Migration-Guide), [Spring Vault 4.1 GA duyurusu](https://spring.io/blog/2026/06/10/spring-vault-4-1-available), [Evolving Spring Vault: Introducing VaultClient](https://spring.io/blog/2025/12/26/evolving-spring-vault), [Spring Integration 7.1.0 duyurusu](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/), [Spring for GraphQL 1.4.6 ve 2.0.4 duyurusu](https://spring.io/blog/2026/06/10/spring-for-graphql-1-4-6-and-2-0-4-released/), [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [Inside Java Quality Outreach Heads-up](https://inside.java/headsup/), Oracle Java resmi güncelleme kanalları, [InfoQ Java](https://www.infoq.com/java/), [Baeldung Java Weekly 651](https://www.baeldung.com/java-weekly-651), Josh Long’un [This Week in Spring - 16 Haziran 2026](https://spring.io/blog/2026/06/16/this-week-in-spring-june-16-2026) yazısı, Gunnar Morling’in blog akışı ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. OpenJDK/Oracle/Inside Java tarafında 21 Haziran 2026 itibarıyla dünkü öncelik sırasını değiştiren daha güçlü yeni bir üretim sinyali görünmüyor; bugünün asıl baskısı Spring platform tabanında ve destek pencerelerinde. Bu son cümle, taranan kaynakların karşılaştırılmasından yapılan çıkarımdır.

## Öne Çıkan Başlıklar

- [Spring Boot 4.1.0](https://spring.io/blog/2026/06/10/spring-boot-4/), yalnız feature release değil; gRPC, outbound SSRF filtresi, `@Async` context propagation, OpenTelemetry kontrol yüzeyi ve lazy JDBC connection fetching ile uygulama tabanını fiilen yeniden tanımlıyor.
- [Spring Cloud 2025.1.2](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) artık Spring Boot `4.1.0` ile uyumlu; buna karşılık [Spring Cloud 2025.0.3](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/) hattı 30 Haziran 2026’da OSS desteğini kapatıyor. Bu, mikroservis ekipleri için doğrudan BOM ve destek planı kararı demek.
- [Spring gRPC 1.1.0](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now) ve [Spring Integration 7.1.0](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/) birlikte okunduğunda mesaj net: gRPC artık Spring dünyasında “yan protokol” değil, ilk sınıf uygulama yolu.
- [Spring Vault 4.1](https://spring.io/blog/2026/06/10/spring-vault-4-1-available), `VaultClient`, `ManagedSecret`, `ManagedCertificate` ve `CertificateContainer` ile secret rotation işini “ops runbook”tan “uygulama sözleşmesi” düzeyine taşıyor.
- [Spring for GraphQL 1.4.6 / 2.0.4](https://spring.io/blog/2026/06/10/spring-for-graphql-1-4-6-and-2-0-4-released/) tarafındaki üç yüksek CVE ve `1.4.x` hattının son OSS sürümü olması, GraphQL kullanan ekipler için beklemeyi savunulamaz hale getiriyor.

## Kritik Güncellemeler

### 1. Spring Boot 4.1, “framework upgrade”ten çok yeni platform sözleşmesi

[Spring Boot 4.1.0](https://spring.io/blog/2026/06/10/spring-boot-4/) duyurusu ilk bakışta beş başlık veriyor: gRPC, Jackson ayarları, `InetAddressFilter`, observability ve Log4j file rotation. Ancak [4.1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) daha önemli bir üretimsel tablo gösteriyor:

- gRPC sunucu/istemci desteği doğrudan Boot içine alındı
- `spring.datasource.connection-fetch=lazy` ile fiziksel JDBC connection daha geç alınabiliyor
- `@Async` çalışan işlere context propagation geliyor
- OpenTelemetry tarafında `management.opentelemetry.enabled`, sampler, limits ve environment variable mapping genişliyor
- `spring.data.jpa.repositories.bootstrap-mode` davranışı sertleşiyor; `deferred` ve `lazy` modlarında eski “sessiz tolerans” azalıyor
- Derby desteği emeklilik nedeniyle deprecated, layertools jar mode kaldırılmış durumda
- desteklenen jOOQ sürümü `3.20+` olduğu için Java `21+` gereksinimi doğuyor

Buradaki ana nokta şu: Boot 4.1’i yalnız “yeni convenience feature’lar” diye okumak yanlış olur. Bu sürüm, uygulamanın ağ sınırı, veri erişim maliyeti, telemetri kontrol modeli ve bağımlılık tabanını aynı anda etkiliyor.

### 2. Spring Cloud tarafında artık “hangi train’i kullanıyoruz?” sorusu takvim baskısı taşıyor

[Spring Cloud 2025.1.2 Oakwood](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) iki kritik sinyal veriyor:

- Spring Boot `4.1.0` uyumluluğu resmi olarak geldi
- Kubernetes discovery tarafında `listers` yaklaşımı ve `service-labels` filtresi ile discovery davranışı daha kontrollü hale geliyor

Aynı haftadaki [Spring Cloud 2025.0.3 Northfields](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/) duyurusu ise daha keskin:

- `2025.0.x` hattının bu sürümü son OSS sürüm
- açık kaynak desteği 30 Haziran 2026’da bitiyor
- bu hat Spring Boot `3.5.15` tabanında kalıyor

Bu iki duyuru birlikte şunu söylüyor: “sonraki çeyrekte bakarız” yaklaşımı artık teknik borç değil, destek riski. Eğer ekip hâlâ `2025.0.x` üzerindeyse karar artık sadece feature kararı değil; bakım penceresi ve security response zamanı kararı.

### 3. gRPC, Spring ekosisteminde deneysel kenardan ana yola geçti

[Spring gRPC 1.1.0](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now) ile ana değişiklik autoconfiguration’ın Spring Boot `4.1.0` içine taşınması. Ancak [migration guide](https://github.com/spring-projects/spring-grpc/wiki/Spring-gRPC-1.1-Migration-Guide) kırılma yüzeyini açık gösteriyor:

- starter koordinatları `org.springframework.boot` altına taşındı
- servlet tabanlı gRPC için `server.http2.enabled=true` artık explicit isteniyor
- `.proto` generated client bean’leri için otomatik tarama yok; `@ImportGrpcClients` explicit hale geldi
- health check tarafı artık HTTP Actuator bağımlılığı değil, doğrudan `HealthIndicator` üzerine oturuyor

Buna [Spring Integration 7.1.0](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/) tarafındaki yeni `spring-integration-grpc` ve `spring-integration-cloudevents` modülleri eklendiğinde desen belirginleşiyor: HTTP/JSON tek taşıyıcı olmaktan çıkıyor; gRPC ve event zarfı artık resmi Spring yüzeyleri.

### 4. Spring Vault 4.1, secret rotation’ı API tasarımı konusu yapıyor

[Spring Vault 4.1 GA](https://spring.io/blog/2026/06/10/spring-vault-4-1-available) kısa bir duyuru olmasına rağmen yön net:

- fluent `VaultClient`
- `ManagedSecret` ve `ManagedCertificate`
- `CertificateContainer`
- credential rotation dokümantasyonu

Asıl önemli bağlam ise [Evolving Spring Vault: Introducing VaultClient](https://spring.io/blog/2025/12/26/evolving-spring-vault) yazısında. Bu yazı, yeni istemci mimarisinin neden geldiğini net anlatıyor:

- relative path zorlaması ile yanlışlıkla absolute URI hedefleme riskini azaltmak
- `RestTemplate` seviyesindeki kaçış noktalarını azaltmak
- Vault özelleştirmelerini `RestTemplateCustomizer` yerine `VaultClientCustomizer` / `RestClientCustomizer` modeline taşımak

Bu, özellikle platform ekipleri için önemli. Çünkü secret yönetimi artık sadece “Vault’a bağlanalım” işi değil; connection pool, sertifika yenileme ve runtime kimlik bilgisi rotasyonu ile birlikte bir uygulama sözleşmesi haline geliyor.

### 5. Spring GraphQL tarafında hem güvenlik hem destek sınırı aynı anda daraldı

[Spring for GraphQL 1.4.6 ve 2.0.4](https://spring.io/blog/2026/06/10/spring-for-graphql-1-4-6-and-2-0-4-released/) üç yüksek etkili CVE kapatıyor:

- `CVE-2026-41699`: unsafe deserialization
- `CVE-2026-41700`: cross-site WebSocket hijacking
- `CVE-2026-41856`: annotation detection vulnerability

Daha kritik ikinci sinyal ise aynı duyuruda açıkça yazıyor: `1.4.6`, `1.4.x` hattının son OSS sürümü. Üstelik [Spring Boot 4.1 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) yönetilen bağımlılıklar içinde Spring GraphQL `2.0.4`’ü getiriyor. Yani GraphQL kullanan ekipler için upgrade path artık daha net ama daha acil:

- Boot 4.1 çizgisine yaklaşıyorsan GraphQL 2.0’a geç
- Boot 3.5.x üzerinde kalıyorsan bile `1.4.x` için OSS son pencerede olduğunu kabul et

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring tabanı, Boot 4.1 etrafında yeniden hizalanıyor

Tekrarlayan sinyaller:

- Boot 4.1 resmi release notları
- Spring Cloud Oakwood’un Boot 4.1 uyumluluğu
- Spring gRPC autoconfiguration’ın Boot içine taşınması
- Boot 4.1 BOM’unda GraphQL `2.0.4`, Integration `7.1.0`, gRPC `1.1.0`, Data `2026.0.0`

Çıkarım:

- “Spring Framework 7 / Boot 4 zaten çıktı, sonra geçeriz” yaklaşımı zayıflıyor.
- Yeni taban yalnız API farkı üretmiyor; transport, telemetry, data access ve managed dependency matrisini aynı anda değiştiriyor.

### Trend Kümesi 2: Güvenlik sınırı artık inbound request kadar outbound çağrı ve framework wiring’inde

Tekrarlayan sinyaller:

- Boot 4.1 `InetAddressFilter` ile outbound SSRF azaltımı
- Spring Cloud Gateway `CVE-2026-47825` ve `StripContextPath`
- Spring Vault’ta relative-path odaklı istemci modeli
- Spring GraphQL’de deserialization ve WebSocket hijacking düzeltmeleri
- Spring Integration 7.1’de `AllowListMessageHeaderSelector`

Çıkarım:

- Güvenlik baskısı yalnız controller endpoint’lerinde değil.
- İstemci HTTP çağrıları, gateway path rewrites, message metadata ve secret istemcileri artık aynı threat-model içinde ele alınmalı.

### Trend Kümesi 3: gRPC ve event zarfı, Spring’in resmi iletişim dili olmaya yaklaşıyor

Tekrarlayan sinyaller:

- Boot 4.1 gRPC desteği
- Spring gRPC 1.1 migration guide’daki explicit yapılandırma modeli
- Spring Integration 7.1’de gRPC ve CloudEvents modülleri

Çıkarım:

- gRPC artık “Spring dışı özel alan” değil.
- Ancak bu alan daha güçlü hale geldikçe konfigurasyon explicitleşiyor; otomatik tarama ve gizli default’lar azalıyor.

### Gürültü mü, kalıcı değer mi?

- Çok yüksek kalıcı değer: Boot `4.1` taban değişimi, Cloud train kararı, GraphQL destek sınırı.
- Yüksek kalıcı değer: Vault `4.1` ile secret rotation API’leşmesi, gRPC’nin resmi Boot yüzeyine taşınması.
- Orta kalıcı değer: Integration `7.1` ile CloudEvents/gRPC modülleri.
- Düşük öncelik: Oracle/Inside Java/OpenJDK tarafında bugün yeni ama yol değiştirici bir sinyal yok; JDK `27` heads-up hattı izlenmeli fakat bugünkü karar eksenini değiştirmiyor.

## Araçlar ve Kütüphaneler

- [Spring Boot 4.1.0](https://spring.io/blog/2026/06/10/spring-boot-4/): gRPC, SSRF filtresi, OpenTelemetry kontrolü, lazy JDBC connection fetching ve migration kırılmalarıyla bugün en güçlü platform sinyali.
- [Spring Cloud 2025.1.2](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/): Boot `4.1.0` uyumluluğu ve Cloud Gateway/Kubernetes iyileştirmeleri nedeniyle mikroservis ekipleri için doğrudan önemli.
- [Spring gRPC 1.1.0](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now): protokol desteğinden çok, Boot ile hizalanmış resmi yapılandırma modeli nedeniyle değerli.
- [Spring Vault 4.1](https://spring.io/blog/2026/06/10/spring-vault-4-1-available): secret rotation ve sertifika yaşam döngüsünü uygulama koduna daha güvenli taşımak isteyen ekipler için dikkat çekici.
- [Spring Integration 7.1.0](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/): CloudEvents, gRPC, allow-list ve protocol adapter güncellemeleriyle “entegrasyon katmanı”nı yeniden önemsetiyor.
- [Spring for GraphQL 2.0.4](https://spring.io/blog/2026/06/10/spring-for-graphql-1-4-6-and-2-0-4-released/): güvenlik ve destek çizgisi nedeniyle artık ertelenmemesi gereken upgrade hedefi.

Bugün bunların dışında, ortalama bir Java/Spring üretim ekibinin önceliğini yukarıdaki kadar değiştiren yeni bir araç sinyali görünmüyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Eğer ekip Spring Boot `3.5.x` üstünde kalıyorsa, bir sonraki planlama döngüsünde Boot `4.1` geçişini yalnız kod uyumluluğu değil; gRPC, OTel, datasource ve dependency baseline kararı olarak açmalı.
- Eğer ekip Spring Cloud `2025.0.x` kullanıyorsa, 30 Haziran 2026 OSS destek bitişi nedeniyle Oakwood’a geçiş backlog’u artık “nice to have” değil.
- Eğer ekip gRPC düşünüyorsa, protokol seçimi kadar yeni Boot starter koordinatları, explicit HTTP/2, `@ImportGrpcClients` ve health wiring modeli de mimari karara dahil edilmeli.
- Eğer ekip Vault kullanıyorsa, secret rotation ve sertifika yenilemeyi dış otomasyonla çözmek yerine `ManagedSecret` / `CertificateContainer` tabanlı uygulama entegrasyonunu değerlendirmeli.
- Eğer ekip GraphQL kullanıyorsa, `1.4.x` hattında kalmanın bedeli artık sadece patch kaçırmak değil; OSS pencerenin kapanması.

## Fırsatlar ve Riskler

- Fırsat: Boot `4.1` ile transport, telemetry ve data erişim davranışlarını tek bir modernizasyon dalgasında toparlamak mümkün.
- Risk: Aynı dalgada Cloud train, GraphQL line ve gRPC starter koordinatları değiştiği için “tek dependency bump” yaklaşımı kırılabilir.
- Fırsat: Spring Vault `4.1`, secret/certificate rotation’ı uygulama yaşam döngüsüne güvenli biçimde dahil etmeyi kolaylaştırıyor.
- Risk: Eski `RestTemplate` temelli Vault özelleştirmeleri ve kaçış noktaları yeni modele taşınmazsa migration yarım kalabilir.
- Fırsat: gRPC ve CloudEvents’in resmi Spring yüzeyine taşınması, servisler arası iletişimde daha net sözleşmeler kurma şansı veriyor.
- Risk: Explicit config artışı nedeniyle daha önce “kendiliğinden çalışan” ayarların sessizce kaybolması mümkündür; özellikle servlet tabanlı gRPC ve client scanning tarafında.
- Fırsat: Spring GraphQL `2.0.x` çizgisine yaklaşmak, güvenlik ve destek riskini aynı anda azaltır.
- Risk: `1.4.x` üzerinde beklemek, yüksek CVE’ler ve kapanan OSS penceresi nedeniyle savunması zor bir karar haline geldi.

## İzlenmesi Gereken Konular

- Spring Cloud destek matrisi ve özellikle `2025.0.x` sonrası resmi yönlendirme; 30 Haziran 2026 sonrası ekiplerin hangi standarda çekileceği.
- Boot `4.1.x` servis sürümlerinin gRPC, OpenTelemetry ve HTTP client alanlarında ek düzeltme getirip getirmeyeceği.
- Spring gRPC migration guide’ın preview dilinden tamamen final kullanım notlarına ne zaman geçeceği.
- Spring Vault tarafında `VaultClientCustomizer` ve secret rotation örneklerinin Spring Cloud Vault çizgisine nasıl yansıyacağı.
- Spring GraphQL `2.0.x` hattında güvenlik sonrası ilk bakım sürümlerinin ne kadar hızlı geleceği.
- OpenJDK/Inside Java tarafında JDK `27` rampdown hattından gelecek yeni heads-up’ların Spring Boot `4.1` kullanan ekipler için yeni bir test konusu açıp açmayacağı.

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Boot 4.1, yeni uygulama tabanını fiilen tanımlıyor
- `source`: [Spring Boot 4.1.0 available now](https://spring.io/blog/2026/06/10/spring-boot-4/) | [Spring Boot 4.1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) | [This Week in Spring - June 16th, 2026](https://spring.io/blog/2026/06/16/this-week-in-spring-june-16-2026)
- `author`: Andy Wilkinson | Spring Boot Team | Josh Long
- `date`: 10 Haziran 2026 | 16 Haziran 2026
- `category`: platform, runtime, observability, migration
- `tags`: spring-boot-4.1, grpc, ssrf, opentelemetry, lazy-datasource, jpa-bootstrap, migration
- `summary`: Boot `4.1`, gRPC desteği, outbound SSRF azaltımı, `@Async` context propagation, lazy JDBC connection fetching ve dependency baseline güncellemeleri ile uygulama çatısını yeniden çiziyor.
- `why_it_matters`: Bu değişiklikler aynı anda ağ güvenliği, veri erişim davranışı, telemetry maliyeti ve upgrade riskini etkiliyor.
- `java_spring_relevance`: Spring Boot tabanlı servislerin hemen tamamı bu yüzeylerden en az birini kullanıyor.
- `actionability`: `planli_aksiyon`
- `impact_level`: `çok_yüksek`
- `opportunities`: Tek modernizasyon dalgasında gRPC, OTel ve datasource davranışını iyileştirme fırsatı.
- `risks`: Derby/layertools kaldırımları, jOOQ Java `21+` gereksinimi ve JPA bootstrap davranış farkları sessiz kırılma üretebilir.
- `migration_notes`: Boot `4.0.x` ve `3.5.x` kullanan ekipler, property diff ve starter/BOM diff çalışmasını önceden çıkarmalı.

### Bulgu 2

- `title`: Spring Cloud release train seçimi artık destek takvimi kararı
- `source`: [Spring Cloud 2025.1.2 (Oakwood) Has Been Released](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) | [Spring Cloud 2025.0.3 (Northfields) Has Been Released](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/) | [spring-cloud-release 2025.1.2 GitHub release](https://github.com/spring-cloud/spring-cloud-release/releases/tag/v2025.1.2)
- `author`: Ryan Baxter | Spring Cloud Team
- `date`: 11 Haziran 2026 | 12 Haziran 2026
- `category`: microservices, platform, support, gateway, kubernetes
- `tags`: spring-cloud, oakwood, northfields, boot-4.1, support-window, gateway, kubernetes, config
- `summary`: Oakwood hattı Boot `4.1.0` uyumluluğunu getirirken Northfields hattı 30 Haziran 2026’da OSS desteğini kapatıyor.
- `why_it_matters`: Mikroservis ekipleri için sürüm seçimi artık yalnız dependency yönetimi değil; destek, CVE response ve upgrade temposu kararı.
- `java_spring_relevance`: Spring Cloud Config, Gateway, Kubernetes, OpenFeign ve discovery kullanan ekipler doğrudan etkileniyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok_yüksek`
- `opportunities`: Oakwood ile Boot `4.1` çizgisine geçip yeni Gateway/Kubernetes davranışlarını standartlaştırmak.
- `risks`: `2025.0.x` üzerinde kalmak, Temmuz 2026’dan itibaren açık kaynak destek boşluğu yaratır.
- `migration_notes`: Önce Boot sürümü, sonra Cloud BOM seçimi netleştirilmeli; Gateway path rewrite ve Kubernetes discovery davranışları regression test’e alınmalı.

### Bulgu 3

- `title`: gRPC, Spring dünyasında resmi ana yol haline geliyor
- `source`: [Spring gRPC 1.1.0 available now](https://spring.io/blog/2026/06/10/spring-grpc-1-1-0-available-now) | [Spring gRPC 1.1 Migration Guide](https://github.com/spring-projects/spring-grpc/wiki/Spring-gRPC-1.1-Migration-Guide) | [Spring Boot 4.1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes) | [Spring Integration 7.1.0 Available](https://spring.io/blog/2026/06/10/spring-integration-7-1-0-released/)
- `author`: Dave Syer | Spring gRPC Team | Glenn Renfro
- `date`: 10 Haziran 2026
- `category`: service-communication, grpc, integration, testing
- `tags`: grpc, spring-grpc, spring-boot, spring-integration, cloudevents, http2, health
- `summary`: Boot içine alınan gRPC autoconfiguration ve Integration `7.1` modülleri, Spring ekosisteminde gRPC’yi yan araç değil temel taşıyıcı haline getiriyor.
- `why_it_matters`: Transport seçimi artık doğrudan framework desteğiyle hizalı; üretim ve test altyapısı daha standardize olabilir.
- `java_spring_relevance`: Servisler arası iletişim, edge-to-core çağrıları ve event zarfı tasarlayan Java ekipleri için mimari etkisi yüksek.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: HTTP/JSON ağırlıklı servisler için daha sıkı tip sözleşmesi ve daha net health/observation modeli kurma fırsatı.
- `risks`: Starter koordinatları, explicit HTTP/2 ve `@ImportGrpcClients` gereksinimi migration sırasında sessiz kırılmalar üretebilir.
- `migration_notes`: Spring gRPC `1.0` kullanan ekipler starter adlarını, property yapısını ve health wiring modelini birebir gözden geçirmeli.

### Bulgu 4

- `title`: Spring Vault 4.1 ile secret rotation uygulama sözleşmesine yaklaşıyor
- `source`: [Spring Vault 4.1 Generally Available](https://spring.io/blog/2026/06/10/spring-vault-4-1-available) | [Evolving Spring Vault: Introducing VaultClient](https://spring.io/blog/2025/12/26/evolving-spring-vault) | [Spring Vault 4.1.0 release notes](https://github.com/spring-projects/spring-vault/releases/tag/4.1.0)
- `author`: Mark Paluch | Spring Vault Team
- `date`: 10 Haziran 2026 | 26 Aralık 2025
- `category`: security, platform-engineering, secrets-management, certificates
- `tags`: spring-vault, vaultclient, managedsecret, managedcertificate, certificatecontainer, credential-rotation
- `summary`: Yeni `VaultClient` ve yönetilen secret/certificate soyutlamaları, secret lifecycle yönetimini güvenli ve programatik hale getirmeyi amaçlıyor.
- `why_it_matters`: Secret rotation, sertifika yenileme ve istemci güvenliği artık dış script katmanından çıkarılıp uygulama tasarımına taşınabiliyor.
- `java_spring_relevance`: Vault, Spring Cloud Vault veya dinamik credential kullanan backend ekipleri için doğrudan önemli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: Dynamic secrets ve certificate rotation’ı uygulama yaşam döngüsüyle daha tutarlı yönetmek.
- `risks`: Eski `RestTemplate` temelli özelleştirmeler yeni istemci modeline uyarlanmazsa hem güvenlik hem bakım maliyeti kalır.
- `migration_notes`: `RestTemplateCustomizer` tabanlı Vault özelleştirmeleri kademeli olarak `VaultClientCustomizer` / `RestClientCustomizer` tarafına taşınmalı.

### Bulgu 5

- `title`: Spring GraphQL tarafında CVE baskısı, destek sınırıyla birleşti
- `source`: [Spring for GraphQL 1.4.6 and 2.0.4 released](https://spring.io/blog/2026/06/10/spring-for-graphql-1-4-6-and-2-0-4-released/) | [Spring Boot 4.1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes)
- `author`: Brian Clozel | Spring Boot Team
- `date`: 10 Haziran 2026
- `category`: security, api, graphql, support-policy
- `tags`: spring-graphql, cve-2026-41699, cve-2026-41700, cve-2026-41856, support-window, boot-4.1
- `summary`: Üç yüksek CVE kapatıldı ve `1.4.6`, `1.4.x` hattının son OSS sürümü olarak ilan edildi.
- `why_it_matters`: Güvenlik açığı ve support boundary aynı anda geldiğinde “şimdilik bekleyelim” maliyeti hızla artar.
- `java_spring_relevance`: GraphQL endpoint, WebSocket subscription veya annotation tabanlı schema wiring kullanan Spring ekipleri için doğrudan etkili.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok_yüksek`
- `opportunities`: Boot `4.1` ile hizalanmış `2.0.x` çizgisine geçip uzun ömürlü taban oluşturmak.
- `risks`: `1.4.x` üstünde kalmak hem açık riskini hem de destek boşluğunu büyütür.
- `migration_notes`: GraphQL transport ve subscription davranışları, `2.0.x` geçişinden önce güvenlik regression test’leriyle birlikte ele alınmalı.

## Sonuç

21 Haziran 2026 itibarıyla en güçlü yeni sinyal güvenlik advisory yağmurundan değil, Spring tabanının nasıl yeniden hizalandığından geliyor. Spring Boot `4.1`, Spring Cloud Oakwood, Spring gRPC `1.1`, Spring Vault `4.1` ve Spring GraphQL `2.0.4` birlikte okunduğunda mesaj açık: Java/Spring ekipleri için bir sonraki doğru adım tek tek patch atmak değil; runtime tabanı, iletişim protokolü, secret yönetimi ve destek penceresini aynı çerçevede yeniden planlamak.

Bugün için en net mühendislik önceliği şu sırayla görünüyor: Cloud train kararını netleştir, Boot `4.1` migration yüzeyini çıkar, GraphQL ve gRPC kullanan servisleri ayrı risk kümesi olarak ele al, Vault tarafında secret rotation tasarımını uygulama sözleşmesine taşı. OpenJDK tarafı izlenmeli; fakat bugünün üretim kararı Spring platform tabanında veriliyor.
