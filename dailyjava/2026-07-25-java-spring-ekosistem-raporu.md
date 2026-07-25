# Günlük Java / Spring Ekosistem Raporu

Tarih: 25 Temmuz 2026 Cumartesi  
Tarama zamanı: 25 Temmuz 2026 09:07 TSİ  
Odak: kontrat/test altyapısının üretim sınırına dönüşmesi, kullanıcı kontrollü metadata yüzeylerinin sertleşmesi ve JDK 27 canary hazırlığı

Tarama notu: 25 Temmuz 2026 Cumartesi günü [Spring Blog](https://spring.io/blog), [Spring Security Advisories](https://spring.io/security), [Spring Cloud Contract’in Stubborn.sh duyurusu](https://spring.io/blog/2026/07/06/spring-cloud-contract-transition-to-stubbornsh), [Spring Cloud Supported Versions wiki](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions), [Spring Integration 7.1 What’s New](https://docs.spring.io/spring-integration/reference/7.1.0/whats-new.html), [Spring AMQP 4.1.0 duyurusu](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available), [OpenJDK JDK 27 sayfası](https://openjdk.org/projects/jdk/27/), [Inside Java feed’i](https://inside.java/feed.xml), [Quality Outreach: JDK 27 default G1](https://inside.java/2026/07/20/quality-heads-up/), [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases), [Josh Long’un Billy Korando yayını](https://spring.io/blog/2026/07/23/a-bootiful-podcast-billy-korando), [InfoQ Java yüzeyi](https://www.infoq.com/java/news/), [Baeldung LM Studio + Spring AI yazısı](https://www.baeldung.com/spring-integrating-local-llms-spring-ai-lm-studio), [Gunnar Morling’in Hardwood yazısı](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/) ve [Burak KUTBAY’ın feature-flag yazısı](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html/) kontrol edildi. Bugün yeni bir büyük Spring GA/patch ilanı yok; en güçlü sinyal, ekiplerin uzun süredir “yardımcı katman” diye gördüğü kontrat, dokümantasyon testi, header mapleme ve filtreleme yüzeylerinin artık doğrudan güvenlik ve bakım konusu haline gelmiş olması.

## Öne Çıkan Başlıklar

- Spring Cloud Contract artık Spring Cloud release train güvence alanında değil; 6 Temmuz 2026 duyurusu, Stubborn.sh göçünü teknik borç değil takvimli geçiş işi haline getirdi.
- Spring REST Docs için yayımlanan `CVE-2026-40991`, dokümantasyon üreten testlerin bile saldırı yüzeyi olabileceğini açıkça gösterdi.
- Haziran güvenlik dalgasının en öğretici ortak deseni, kullanıcı kontrollü header, property path, `Sort`, Querydsl filter ve retry metadata’sının artık “pasif veri” değil aktif güvenlik sınırı olması.
- Spring tarafının cevabı da buna göre sertleşiyor: AMQP tarafında “trust no one” default’u, Integration `7.1` tarafında CloudEvents/gRPC modülleri ve `RestClient` yönü, daha kapalı ve daha tanımlı entegrasyon kontratlarına işaret ediyor.
- JDK 27, 25 Temmuz 2026 itibarıyla hâlâ izlemelik değil; özellik seti donmuş durumda ve default G1 değişimi nedeniyle constrained-environment canary planı gerektiriyor.

## Kritik Güncellemeler

### 1. Spring Cloud Contract için release-train varsayımı bitti

[Spring’in 6 Temmuz 2026 duyurusu](https://spring.io/blog/2026/07/06/spring-cloud-contract-transition-to-stubbornsh), Spring Cloud Contract’in bakım, destek ve sahipliğinin Stubborn.sh çatısına taşındığını; projenin gelecekteki Spring Cloud release train’lerinden çıkarılacağını ve aktif train’lerde de Spring tarafının yeni bakım sunmayacağını açıkça söylüyor. Buna karşılık [Spring Cloud Supported Versions wiki](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions) hâlâ `spring-cloud-contract` satırını Oakwood ve Northfields tablolarında gösteriyor.

Bu iki resmi yüzey birlikte okunduğunda kritik sonuç şu: sadece BOM veya train tablosuna bakarak “hala doğal olarak destekleniyor” varsayımı yapmak artık riskli. Kontrat testi altyapısı release-train’in gölgesinden çıktı; sahiplik ve yaşam döngüsü kararı ekipte.

### 2. Spring REST Docs, test yardımcı kütüphanesi olmaktan çıkıp güvenlik sınırına dönüştü

[CVE-2026-40991](https://spring.io/security/cve-2026-40991), `spring-restdocs-webtestclient` veya `spring-restdocs-restassured` ile uzaktaki bir API’yi dokümante ederken, ele geçirilmiş ya da kötü niyetli bir API’nin sonraki test çalıştırmasında XXE tetikleyebileceğini söylüyor. Etkilenen hatlar `4.0.0`, `3.0.0-3.0.5` ve `2.0.8.RELEASE` ve önlem doğrudan yükseltme.

Bu bulgu önemli çünkü birçok ekip REST Docs’u “build-time araç” gibi görüyor. Oysa burada build pipeline, dış sistemden gelen XML’i parse eden bir güven zinciri elemanı haline geliyor.

### 3. Header ve filtre metadata’sı artık güven sınırı

25 Temmuz 2026 itibarıyla Spring advisories sayfasındaki en güçlü tekrar eden desen şu:

- [Spring Kafka `CVE-2026-41731`](https://spring.io/security/cve-2026-41731): header mapper, trusted package prefix’lerini fazla geniş yorumlayabiliyor.
- [Spring Kafka `CVE-2026-41727`](https://spring.io/security/cve-2026-41727): sahte retry header’ları routing ve backoff davranışını bozabiliyor.
- [Spring Pulsar `CVE-2026-41732`](https://spring.io/security/cve-2026-41732): Pulsar header mapper da benzer şekilde aşırı geniş trusted-package eşleşmesi yapabiliyor.
- [Spring Data Commons `CVE-2026-41716`](https://spring.io/security/cve-2026-41716): attacker-supplied property names ile heap büyütülebiliyor.
- [Spring Data REST `CVE-2026-41837`](https://spring.io/security/cve-2026-41837): Jackson ile gizlenmiş alanlar Querydsl filtre anahtarı olarak kullanılabiliyor.

Ortak mesaj net: “stringly typed” metadata artık sadece taşınan veri değil; deserialize edilen, route edilen, cache’e giren ve davranış değiştiren kontrol yüzeyi.

### 4. Spring’in cevabı: daha dar trust sınırları, daha net protokol primitive’leri

[Spring AMQP 4.1.0 duyurusu](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available) üç önemli sinyal taşıyor:

- JSON converter’lar artık varsayılan olarak “trust no one”
- generic `AMQP 1.0` desteği için ayrı `spring-amqp-client` modülü var
- `3.2.11` ve `4.0.4` hatlarında ayrıca bug ve CVE düzeltmeleri var

[Spring Integration 7.1 What’s New](https://docs.spring.io/spring-integration/reference/7.1.0/whats-new.html) ise yeni `spring-integration-cloudevents` ve `spring-integration-grpc` modüllerini, ayrıca HTTP tarafında `RestClient` yönünü ve `RestTemplate` yapılandırmasının deprecated olduğunu doğruluyor.

Bu, entegrasyon katmanının “esnek helper kod” yerine daha tanımlı protokol modülleri ve daha dar güven varsayımlarıyla şekillendiğini gösteriyor.

### 5. JDK 27 için test penceresi açıldı, tartışma aşaması geride kaldı

[OpenJDK JDK 27 sayfası](https://openjdk.org/projects/jdk/27/) 25 Temmuz 2026 itibarıyla JDK 27’nin `Rampdown Phase Two` aşamasında olduğunu, özellik setinin donduğunu ve genel erişim tarihinin `15 Eylül 2026` olduğunu gösteriyor. [Inside Java Quality Outreach notu](https://inside.java/2026/07/20/quality-heads-up/) ise JDK 27 ile G1’in tüm ortamlarda varsayılan GC olacağını ve single-CPU / düşük bellek ortamlarında artık açık benchmark önerildiğini söylüyor. [Josh Long’un 23 Temmuz 2026 tarihli Billy Korando yayını](https://spring.io/blog/2026/07/23/a-bootiful-podcast-billy-korando) da Spring topluluğunun Java 27 hazırlığını hızlandırdığını gösteren yumuşak ama anlamlı bir topluluk sinyali.

Bu konu bugün önemli çünkü birçok Spring servisinde GC explicit seçilmez. Dolayısıyla davranış değişimi uygulama kodundan değil, runtime default’undan gelebilir.

## Trendler ve Sinyaller

### Trend Kümesi 1: Yardımcı test araçları artık trusted computing base’in parçası

Spring REST Docs XXE bulgusu ile Spring Cloud Contract’in Spring dışına taşınması birlikte okunduğunda, “test/verification katmanı uygulama dışında” varsayımı geçerliliğini kaybediyor. Kontrat testi, dokümantasyon üretimi ve entegrasyon doğrulaması artık platform güvenliği ve bakım planının parçası.

### Trend Kümesi 2: Metadata kanalları güvenlik sınırına dönüştü

Header mapper’lar, retry header’ları, property path çözümleyicileri ve Querydsl filter anahtarları aynı şeyi söylüyor: ekipler request body kadar request metadata’sını da allow-list ve normalize etmek zorunda.

### Trend Kümesi 3: Resmi kaynaklar arasında bile lifecycle drift’i olabilir

Spring Cloud Contract örneğinde blog duyurusu ile support matrisi farklı bir operasyonel gerçeklik ima ediyor. Bu, release train tablosunu tek başına kaynak kabul eden otomasyonların ve mimari kararların gözden geçirilmesi gerektiği anlamına geliyor.

### Trend Kümesi 4: JVM yükseltmeleri için “bekleyelim GA çıksın” yaklaşımı geç kaldı

JDK 27’nin feature-freeze’e girmesiyle asıl iş yeni özellik okumak değil; küçük pod, düşük CPU ve kısa ömürlü worker iş yüklerinde default G1 etkisini önceden ölçmek.

## Araçlar ve Kütüphaneler

- `Stubborn.sh`: yüksek öncelik. Spring Cloud Contract kullanan ekipler için artık alternatif değil, fiili devam hattı.
- `spring-amqp-client` ve AMQP `1.0` desteği: orta-yüksek öncelik. Özellikle protocol diversity olan platform ekipleri için yeni standartlaşma kapısı açıyor.
- `spring-integration-cloudevents` ve `spring-integration-grpc`: orta-yüksek öncelik. Event ve RPC entegrasyonlarını daha açık primitive’lere taşıyor.
- `Hardwood` fixed-list fast path: düşük-orta öncelik. [Gunnar Morling’in 22 Temmuz 2026 yazısı](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/) özellikle embedding veya sabit boyutlu vektör okuyorsanız anlamlı.
- `LM Studio + Spring AI`: düşük öncelik. [Baeldung’in 23 Temmuz 2026 yazısı](https://www.baeldung.com/spring-integrating-local-llms-spring-ai-lm-studio), lokal model denemeleri için faydalı; genel backend portföyü için çekirdek üretim standardı değil.
- `Unleash tabanlı controlled rollout`: orta öncelik pratik. [Burak KUTBAY’ın 15 Temmuz 2026 feature-flag yazısı](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html), JDK 27 ve protokol değişimleri gibi riskli geçişler için iyi bir rollout disiplini hatırlatıyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Cloud Contract kullanan ekipler bu çeyrekte migration envanteri çıkarmalı; “bir sonraki release train ile toparlarız” yaklaşımı artık geçerli değil.
- REST Docs kullanan CI pipeline’ları dış sistemden gelen XML’i güvenli veri kabul etmemeli; özellikle remote API dokümantasyonu yapan job’lar patch seviyesi ve izolasyon açısından gözden geçirilmeli.
- Kafka, Pulsar, AMQP ve Data REST kullanan servislerde header, filter key, property path ve `Sort` girişleri açık allow-list olmadan bırakılmamalı.
- Spring Integration ve AMQP tarafındaki yeni modüller, custom adapter/helper katmanını azaltma fırsatı veriyor; ancak bu geçişler için explicit contract testleri gerekiyor.
- Java 27 canary’lerinde default GC’yi “framework halleder” diye bırakmak zayıf yaklaşım; G1 ve gerekirse Serial için karşılaştırmalı benchmark gerekli.

## Fırsatlar ve Riskler

- Fırsat: kontrat testi sahipliğini release train’e bırakmak yerine ekip kontrolüne almak ve daha bağımsız bir doğrulama hattı kurmak.
- Risk: Spring Cloud Contract’i mevcut haliyle bırakıp bakım/patch beklentisini sürdürmek.
- Fırsat: metadata allow-listing ile hem güvenlik yüzeyini hem de debug maliyetini azaltmak.
- Risk: trusted package, Querydsl filter ve retry header kararlarını framework default’una bırakmak.
- Fırsat: Integration `7.1` ve AMQP `4.1` ile protokol sınırlarını daha anlaşılır primitive’lere taşımak.
- Risk: legacy helper katmanı ile yeni framework primitive’lerini yan yana taşıyıp iki farklı sözleşme standardı üretmek.
- Fırsat: Java 27’yi controlled rollout ve feature-flag disipliniyle erken ölçmek.
- Risk: default G1 etkisini ilk kez prod’da görmek.

## İzlenmesi Gereken Konular

- Stubborn.sh tarafında Spring Cloud Contract göç rehberlerinin ve sürüm ritminin nasıl netleşeceği
- Spring Cloud support wiki ile Contract duyurusu arasındaki lifecycle drift’in ne kadar hızlı kapanacağı
- Spring Data ve messaging advisories sonrası ek “secure by default” davranışların hangi projelere geri taşınacağı
- JDK 27 için `6 Ağustos 2026` ilk RC ve `20 Ağustos 2026` final RC çıktılarında serviceability / GC sürprizi olup olmayacağı
- `15 Eylül 2026` JDK 27 GA öncesi container benchmark sonuçlarının özellikle küçük pod’larda nasıl şekilleneceği
- `18 Ağustos 2026` Java CSPU dalgasının takım içi patch otomasyonlarına etkisi

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Cloud Contract için Spring release-train dönemi kapanıyor; Stubborn.sh göçü takvimli iş haline geldi
- `source`: [Spring Cloud Contract geçiş duyurusu](https://spring.io/blog/2026/07/06/spring-cloud-contract-transition-to-stubbornsh) | [Spring Cloud Supported Versions wiki](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions)
- `author`: Jason Konicki | Spring Cloud wiki maintainers
- `date`: 6 Temmuz 2026; 25 Temmuz 2026 itibarıyla doğrulandı
- `category`: contract-testing, support-policy, migration
- `tags`: spring-cloud-contract, stubbornsh, release-train, support-drift, consumer-driven-contracts
- `summary`: Spring, Spring Cloud Contract’in bakım ve sahipliğini Stubborn.sh ekosistemine devrettiğini; projenin gelecekteki release train’lerden çıkarılacağını ve aktif train’lerde de Spring tarafının yeni bakım sunmayacağını açıkladı. Buna rağmen support wiki tablosu hâlâ SCC satırını gösteriyor.
- `why_it_matters`: Bu durum, BOM veya support matrisi tek başına okununca yanlış güven hissi yaratabilir. Lifecycle kararı artık ekiplerin migration planına dönüştürülmeli.
- `java_spring_relevance`: Spring Cloud ve consumer-driven contract test kullanan mikroservis ekipleri için doğrudan kritik.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: kontrat test altyapısını release-train’den bağımsızlaştırmak; sahiplik ve upgrade kararlarını sadeleştirmek
- `risks`: bakım beklentisini yanlış okumak; patch veya uyumluluk sorunlarını release-train çözecek sanmak
- `migration_notes`: repo çapında SCC kullanımını, plugin/DSL bağımlılıklarını ve pipeline adımlarını envanterleyin; Stubborn.sh uyumluluğunu domain bazında pilot edin; release-train bağımlı varsayımları CI belgelerinden çıkarın.

### Bulgu 2

- `title`: Spring REST Docs XXE bulgusu, dokümantasyon testlerini güvenlik zincirinin parçası yapıyor
- `source`: [CVE-2026-40991](https://spring.io/security/cve-2026-40991)
- `author`: Spring Security Advisories
- `date`: 9 Haziran 2026
- `category`: security, testing, documentation, build-pipeline
- `tags`: spring-restdocs, xxe, webtestclient, restassured, ci, remote-api
- `summary`: Uzak bir API’yi dokümante eden REST Docs testleri, kötü niyetli veya ele geçirilmiş bir API’den gelen XML nedeniyle sonraki test koşusunda XXE tetikleyebiliyor. Etkilenen hatlar `4.0.0`, `3.0.0-3.0.5` ve `2.0.8.RELEASE` ve çözüm doğrudan fixed version’a çıkmak.
- `why_it_matters`: Test kodu çoğu ekipte üretim güvenlik modeli dışında düşünülür. Bu advisory, build ve docs job’larının da güven sınırı olduğunu gösteriyor.
- `java_spring_relevance`: Spring REST Docs, WebTestClient veya RestAssured kullanan API ekipleri için doğrudan etkili.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: CI job izolasyonunu ve dış sistemlerden veri kabul kurallarını netleştirmek
- `risks`: dokümantasyon testlerini güvenli iç trafik sanmak; remote API dokümantasyonunu patch seviyesi eski job’larda sürdürmek
- `migration_notes`: REST Docs sürümünü fixed line’a yükseltin; remote API dokümantasyon job’larını ayrı güven profiline alın; XML içeriğini build-time trusted input varsayımından çıkarın.

### Bulgu 3

- `title`: Kafka ve Pulsar advisories, message header’larının artık yalnız metadata değil kontrol yüzeyi olduğunu gösteriyor
- `source`: [CVE-2026-41731](https://spring.io/security/cve-2026-41731) | [CVE-2026-41727](https://spring.io/security/cve-2026-41727) | [CVE-2026-41732](https://spring.io/security/cve-2026-41732)
- `author`: Spring Security Advisories
- `date`: 9 Haziran 2026
- `category`: messaging, deserialization, reliability, security
- `tags`: spring-kafka, spring-pulsar, trusted-packages, retry-headers, backoff, deserialization
- `summary`: Kafka ve Pulsar header mapper’larında trusted package prefix kontrolü fazla geniş kalabiliyor; Kafka retry topic header’ları ise sahte deneme sayısı veya backoff timestamp ile routing ve pause davranışını bozabiliyor.
- `why_it_matters`: Header’lar çoğu zaman göz ardı edilen string anahtarlar gibi ele alınır. Oysa burada deserialize edilen tip, retry sırası ve dinleyici davranışı header’dan etkileniyor.
- `java_spring_relevance`: Spring Boot ile Kafka/Pulsar consumer çalışan, retry topic ve custom header mapper kullanan ekipler için çok kritik.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: message boundary’lerinde header allow-listing, normalization ve sanitation standardı oluşturmak
- `risks`: wildcard trusted-package veya kontrolsüz header forwarding nedeniyle RCE/DoS/durability sorunları yaşamak
- `migration_notes`: fixed version’lara yükseltin; `trustedPackages=*` veya geniş prefix’leri kaldırın; retry header’larını inbound sınırda normalize edin; consumer telemetry’de anormal pause/backoff desenlerini görünür kılın.

### Bulgu 4

- `title`: Spring Data tarafında property path, Querydsl ve `Sort` parametreleri aktif saldırı yüzeyi
- `source`: [CVE-2026-41716](https://spring.io/security/cve-2026-41716) | [CVE-2026-41695](https://spring.io/security/cve-2026-41695) | [CVE-2026-41837](https://spring.io/security/cve-2026-41837) | [CVE-2026-41711](https://spring.io/security/cve-2026-41711)
- `author`: Spring Security Advisories
- `date`: 9 Haziran 2026
- `category`: data-access, api-surface, security, query-governance
- `tags`: spring-data, spring-data-rest, querydsl, propertypath, sort, projectedpayload, allowlist
- `summary`: Spring Data Commons ve Spring Data REST advisories, attacker-controlled property path, filter key ve `Sort` parametrelerinin heap tüketimi, `StackOverflowException` ve Jackson ile gizlenmiş alanlara erişim gibi etkilere yol açabileceğini gösteriyor. Özellikle Querydsl web bindings ve `@ProjectedPayload` desenleri riskli.
- `why_it_matters`: Bu desenler birçok ekipte “esnek filtreleme” veya “otomatik binding” kolaylığı olarak kullanılıyor. Ancak kontrolsüz bırakıldığında framework, kullanıcıdan gelen string’leri repository davranışına çeviriyor.
- `java_spring_relevance`: Spring Data REST, Querydsl predicate binding veya Data Web Support kullanan servisler için doğrudan kritik.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: filtreleme ve sıralama kontratını açık allow-list ile daha yönetilebilir hale getirmek
- `risks`: permit-all görünürlük, recursive property graph ve sanitizer eksikliği nedeniyle DoS veya veri sızıntısı yaşamak
- `migration_notes`: Spring Data fixed patch seviyelerine yükseltin; `QuerydslBinderCustomizer` ile `excludeUnlistedProperties(true)` kullanın; `Sort` ve property path girişlerini allow-list dışına kapatın; `@ProjectedPayload` kullanan controller’ları ayrıca tarayın.

### Bulgu 5

- `title`: Spring Integration `7.1` ve Spring AMQP `4.1`, entegrasyon katmanını daha kapalı ve daha tanımlı kontratlara itiyor
- `source`: [Spring Integration 7.1 What’s New](https://docs.spring.io/spring-integration/reference/7.1.0/whats-new.html) | [Spring AMQP 4.1.0 Available](https://spring.io/blog/2026/06/09/spring-amqp-4-1-0-available)
- `author`: Spring Integration team | Artem Bilan
- `date`: 9-10 Haziran 2026; 25 Temmuz 2026 itibarıyla doğrulandı
- `category`: integration, messaging, protocol, migration
- `tags`: spring-integration, cloudevents, grpc, restclient, resttemplate, spring-amqp, amqp-1.0, trust-no-one
- `summary`: Spring Integration `7.1`, yeni CloudEvents ve gRPC modüllerini ve HTTP tarafında `RestClient` yönünü getiriyor; `RestTemplate` yapılandırması deprecated hale geliyor. Spring AMQP `4.1` ise ayrı `spring-amqp-client` modülü ile AMQP `1.0` desteği getirirken JSON converter’ları varsayılan olarak “trust no one” moduna çekiyor.
- `why_it_matters`: Framework, entegrasyon yüzeyinde daha az implicit davranış ve daha çok named primitive istiyor. Bu, helper katmanlarını azaltabilir ama yarım geçişte çift standart riski yaratır.
- `java_spring_relevance`: Çoklu protokol kullanan Spring Boot mikroservisleri, event-driven sistemler ve platform ekipleri için yüksek önem taşır.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: custom adapter/helper katmanını küçültmek; CloudEvents, gRPC ve AMQP `1.0` için daha resmi kontratlar kullanmak
- `risks`: legacy `RestTemplate` ve eski trust varsayımlarını aynı uygulamada sürdürmek; migration’ı test etmeden yapmak
- `migration_notes`: `RestTemplate` tabanlı outbound entegrasyonları envanterleyin; `RestClient`, CloudEvents ve gRPC modüllerini yeni işlerde varsayılan aday yapın; AMQP converter trust ayarlarını explicit belgeleyin.

### Bulgu 6

- `title`: JDK 27 için benchmark penceresi açıldı; default G1 artık küçük ortamlarda da kaçınılmaz aday
- `source`: [JDK 27 Project Page](https://openjdk.org/projects/jdk/27/) | [Quality Outreach Heads-up](https://inside.java/2026/07/20/quality-heads-up/) | [A Bootiful Podcast: Billy Korando on Java 27 and Beyond](https://spring.io/blog/2026/07/23/a-bootiful-podcast-billy-korando) | [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases)
- `author`: OpenJDK | Nicolai Parlog | Josh Long
- `date`: 20-25 Temmuz 2026
- `category`: jvm, gc, runtime-governance, release-planning
- `tags`: jdk27, rdp2, g1-default, serial-gc, canary, currentjavareleases
- `summary`: JDK 27, 25 Temmuz 2026 itibarıyla `Rampdown Phase Two` aşamasında; özellik seti donmuş durumda ve GA tarihi `15 Eylül 2026`. Quality Outreach notu, constrained ortamlarda da default GC’nin G1 olacağını ve explicit benchmark önerildiğini söylüyor. Oracle currentJavaReleases yüzeyi de mevcut üretim baseline’larının `26.0.2`, `25.0.4`, `21.0.12`, `17.0.20` olduğunu doğruluyor.
- `why_it_matters`: Runtime default değişiklikleri çoğu Spring serviste uygulama kodundan daha sessiz ama daha yaygın etki yaratır.
- `java_spring_relevance`: Container üstünde çalışan, explicit GC seçmeyen ve operasyonel predictability isteyen Spring ekipleri için önemlidir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: Java 27 canary standardı kurmak; rollout kararlarını ölçüme bağlamak
- `risks`: küçük pod’larda gecikme/throughput farkını prod’da ilk kez görmek; GC seçiminde varsayılan davranışa aşırı güvenmek
- `migration_notes`: düşük CPU ve düşük bellek profillerinde Java 27 benchmark lane açın; G1 ve gerekirse Serial karşılaştırmasını ölçün; rollout’u feature flag veya kademeli trafik stratejisiyle bağlayın.

### Bulgu 7

- `title`: Local AI ve veri-yoğun JVM tooling hattı canlı, ama çoğu ekip için hâlâ yan kulvar
- `source`: [Baeldung LM Studio + Spring AI](https://www.baeldung.com/spring-integrating-local-llms-spring-ai-lm-studio) | [This Week in Spring - July 21st, 2026](https://spring.io/blog/2026/07/21/this-week-in-spring-july-21-2026) | [Gunnar Morling: A Fast Path for Fixed-Length Lists in Parquet](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/) | [Burak KUTBAY Feature Flag yazısı](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html)
- `author`: Manfred Ng | Josh Long | Gunnar Morling | Burak KUTBAY
- `date`: 15-23 Temmuz 2026
- `category`: ai-platform, tooling, data-performance, rollout-practice
- `tags`: spring-ai, lm-studio, capstead, hardwood, parquet, embeddings, unleash, feature-flags
- `summary`: Baeldung, Spring AI `2.0` ile LM Studio üzerinden lokal model entegrasyonunu pratik bir çizgide anlatıyor. Josh Long’un haftalık özetinde Capstead gibi governance/observability araçları görünüyor. Gunnar Morling’in Hardwood optimizasyonu ise fixed-length list ve embedding verilerinde anlamlı performans sıçraması sağlıyor. Burak KUTBAY’ın feature-flag içeriği de bu tip deneysel veya riskli geçişler için rollout disiplinini hatırlatıyor.
- `why_it_matters`: JVM ekosisteminde AI ve veri tooling’i hareketli; fakat çoğu kurumsal Spring portföyü için bunlar çekirdek platform standardından çok lab veya niş veri hattı konusu.
- `java_spring_relevance`: Local LLM, embedding, Parquet veya kontrollü rollout ihtiyacı olan ekipler için anlamlı; genel CRUD/mikroservis portföyü için ikincil.
- `actionability`: `izlemelik`
- `impact_level`: `düşük-orta`
- `opportunities`: privacy-sensitive PoC’ler; vektör/Parquet iş yüklerinde ölçülebilir hız; controlled rollout kalitesini artırmak
- `risks`: niş laboratuvar araçlarını gereksiz yere ana platform standardı yapmak
- `migration_notes`: lokal model ve JVM veri araçlarını prod standardı değil ölçümlü deney kulvarı olarak tutun; rollout için feature-flag ve canary mekanizmalarını zorunlu pratik haline getirin.

## Sonuç

25 Temmuz 2026 Cumartesi gününün yüksek değerli Java/Spring mesajı yeni bir release etiketi değil; güven sınırlarının yer değiştirmesi. Kontrat testi artık release train’e emanet edilemez, dokümantasyon testleri artık “zararsız build step” değildir, header ve filter metadata’sı artık yalnız taşınan veri sayılmaz. Kısa vadede en doğru hamleler: Spring Cloud Contract göçünü resmileştirmek, REST Docs ve Spring Data/Web yüzeylerini patch ve allow-list açısından taramak, messaging header politikalarını sıkılaştırmak ve JDK 27 için küçük ortam benchmark lane’i açmaktır.
