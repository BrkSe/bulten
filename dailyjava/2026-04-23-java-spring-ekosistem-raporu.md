# Günlük Java / Spring Ekosistem Raporu

Tarih: 23 Nisan 2026  
Odak: Java, JVM, Spring Boot, Spring Framework, Spring Cloud, mesajlaşma altyapıları, üretim uyumluluğu ve geçiş riskleri

## Öne Çıkan Başlıklar

Bugünün en net sinyali Spring ekosistemindeki mesajlaşma katmanından geldi. Spring for Apache Kafka 4.1.0-RC1, 4.0.5 ve 3.3.15 yayınları; Kafka share consumer semantiği, async commit kontrolü, lifecycle event görünürlüğü ve Kafka Streams hata işleme modelinin Kafka 4.2 KIP'leriyle hizalanması açısından önemli. Bu, özellikle yüksek hacimli event-driven Spring servislerinde sadece kütüphane güncellemesi değil, tüketici semantiği ve hata kurtarma stratejisi güncellemesi olarak ele alınmalı.

Spring for Apache Pulsar 1.2.17 ve 2.0.5 de aynı gün Maven Central'a çıktı. İçerik açısından Kafka kadar büyük bir özellik sinyali vermiyor, fakat Spring Boot 3.5.14, 4.0.6 ve 4.1.0-RC1 içine alınacak olması Boot BOM tabanlı yükseltme disiplinini güçlendiriyor.

OpenJDK, Inside Java, Oracle Java ve güvenlik kanallarında dünkü raporda ele alınan April 2026 CPU, JDK 27 kalite uyarıları ve Spring Security/Spring Authorization Server CVE dalgasının üzerine bugün yeni, ayrı bir kritik sinyal bulunmadı. Bu nedenle bu başlıklar tekrar detaylandırılmadı; ancak patch ve erken uyumluluk testleri hâlâ aktif takip konusu.

## Kritik Güncellemeler

### Spring for Apache Kafka 4.1.0-RC1, 4.0.5 ve 3.3.15

Spring Kafka'nın 4.1.0-RC1 hattı share consumer API yüzeyini netleştiriyor. `ShareAckMode` enum'u, deprecated boolean yapılandırmanın yerini alıyor; share container async acknowledgement commit destekliyor; lifecycle stop/failure event'leri ekleniyor. Kafka Streams tarafında `groupProtocol` seçimi görünür hale geliyor ve Kafka 4.2 KIP-1034 ile gelen native DLQ / exception handler yaklaşımına Spring tarafında uyum sağlanıyor.

Bu, Kafka kullanan Spring ekipleri için yüksek öncelikli bir RC sinyali. Özellikle share consumer, async commit, filtering listener, Kafka Streams retry/DLQ ve `StreamsBuilderFactory` immutability kullanan servisler staging ortamında test edilmeli.

Kaynaklar: [Spring Kafka yayın duyurusu](https://spring.io/blog/2026/04/22/spring-kafka-4/), [Spring Kafka proje sayfası](https://spring.io/projects/spring-kafka/), [Spring Kafka reference](https://docs.spring.io/spring-kafka/reference/whats-new.html)

### Spring Boot 3.5.14, 4.0.6 ve 4.1.0-RC1 İçin Mesajlaşma BOM Hazırlığı

Spring Kafka duyurusu, `3.3.15` sürümünün Spring Boot `3.5.14`, `4.0.5` sürümünün Spring Boot `4.0.6`, `4.1.0-RC1` sürümünün ise Spring Boot `4.1.0-RC1` ile entegre edileceğini belirtiyor. Spring Pulsar duyurusu da `1.2.17` için Boot `3.5.14`, `2.0.5` için Boot `4.0.6` ve `4.1.0-RC1` hattını işaret ediyor.

Bu, bağımlılıkları tek tek override etmek yerine Boot BOM üzerinden kontrollü yükseltme yapılması gerektiğini gösteren güçlü bir sinyal. Mesajlaşma altyapısı kullanan ekipler, Boot patch/RC geçişini sadece güvenlik yaması olarak değil, Kafka/Pulsar istemci davranışı ve listener container regresyon testi olarak planlamalı.

Kaynaklar: [Spring Kafka yayın duyurusu](https://spring.io/blog/2026/04/22/spring-kafka-4/), [Spring Pulsar yayın duyurusu](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available/), [Spring Boot dokümantasyon durumu](https://docs.spring.io/spring-boot/index.html)

### Spring for Apache Pulsar 1.2.17 ve 2.0.5

Spring for Apache Pulsar 1.2.17 ve 2.0.5 Maven Central üzerinde yayımlandı. Duyuru kısa; öne çıkan ana sinyal, bu sürümlerin yaklaşan Boot patch/RC hatlarına dahil edilmesi. Pulsar kullanan Spring ekipleri için bu, doğrudan özellik sıçramasından çok uyumluluk ve dependency hygiene konusu.

Spring ekosisteminde Pulsar'ın reaktif desteğinin daha önce sonlandırılacağı duyurulmuştu; bu nedenle Pulsar kullanan takımların klasik template/listener tabanlı kullanım, Boot BOM hizası ve reactive bağımlılık varsayımlarını birlikte gözden geçirmesi gerekir.

Kaynaklar: [Spring Pulsar yayın duyurusu](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available/), [Spring Pulsar proje sayfası](https://spring.io/projects/spring-pulsar/)

## Trendler ve Sinyaller

### Event-Driven Spring Stack Olgunlaşıyor

Kafka tarafındaki share consumer, async commit, lifecycle event ve Streams native DLQ uyumu; Spring'in event-driven uygulamalarda framework ergonomisinden operasyonel semantiklere doğru ilerlediğini gösteriyor. Bu, sadece daha kolay `@KafkaListener` yazmak anlamına gelmiyor. Commit politikası, hata kurtarma, tüketici lifecycle gözlemi ve broker/client protokol seçimi daha görünür hale geliyor.

### Boot BOM, Tekil Override'dan Daha Güvenli Hat

Spring Kafka ve Spring Pulsar duyurularının ikisi de yaklaşan Boot sürümlerine açıkça referans veriyor. Bu, kurumsal Spring ekipleri için dependency override stratejisini yeniden düşünme sinyali. Özellikle messaging, security, observability ve web runtime katmanlarında tekil artifact upgrade'i yerine Boot BOM yükseltmesiyle entegre test yapmak daha düşük riskli.

### JSpecify ve Null-Safety Küçük Ama Kalıcı Bir Sinyal

Spring Kafka 4.1.0-RC1'de consumer/producer factory tarafında JSpecify `@Nullable` iyileştirmeleri yer alıyor. Bu tek başına büyük bir haber değil; fakat Spring Framework 7, Reactor ve ekosistemde görülen null-safety yönüyle birleşince Java/Kotlin karışık kod tabanları için kalıcı bir kalite sinyali oluşturuyor.

### Kaynaklarda Tekrar Eden Ama Bugün Yeni Olmayan Sinyaller

Baeldung Java Weekly 642 ve InfoQ Java Roundup, Spring Framework 7 / Boot 4 yönünü, JDK 27 kalite uyarılarını, Spring AI Session API'yi, Quarkus reflection-free Jackson sinyalini, Micrometer JDK 25/26 metriklerini ve Camel 4.19'u tekrar öne çıkarıyor. Bunların çoğu önceki raporlarda detaylı işlendiği için bugün tekrar ana bulgu yapılmadı. Ancak bir trend olarak, ekosistem hâlâ Boot 4 geçişi, JDK 26/27 hazırlığı, null-safety, observability ve agentic AI etrafında kümeleniyor.

Kaynaklar: [Baeldung Java Weekly 642](https://www.baeldung.com/java-weekly-642), [InfoQ Java News Roundup Apr 13](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/)

## Araçlar ve Kütüphaneler

### Spring Kafka

Öncelik yüksek. Kafka tabanlı Spring servislerinde 4.1.0-RC1, Boot 4.1 RC testleri için değerli. Boot 3.5 hattında kalan ekipler ise 3.3.15'i doğrudan değil, Boot 3.5.14 ile birlikte izlemeli.

### Spring for Apache Pulsar

Öncelik orta-düşük. Pulsar kullanan ekipler için 1.2.17 ve 2.0.5 bir bakım ve BOM hizalama sinyali. Pulsar kullanmayan Spring ekipleri için doğrudan aksiyon yok.

### Spring Boot BOM

Öncelik yüksek. Bugünkü Kafka/Pulsar yayınları, yaklaşan Boot patch/RC sürümlerinin messaging dependency setini güncelleyeceğini gösteriyor. Platform ekipleri release train bazlı test matrisini hazır tutmalı.

### Baeldung / InfoQ Kürasyonları

Öncelik düşük-orta. Yeni bir teknik değişiklikten çok, tekrar eden ekosistem eğilimlerini doğruluyorlar. Karar verici değerleri, hangi başlıkların tekil haberden kalıcı trende dönüştüğünü göstermelerinde.

## Java / Spring Geliştiricileri İçin Etkiler

Kafka kullanan Spring ekipleri, 4.1.0-RC1'i "yeni sürüm çıktı" düzeyinde değil, tüketici semantiği değişiklikleri düzeyinde değerlendirmeli. Share consumer ack modu, async commit, lifecycle event ve Kafka Streams native DLQ entegrasyonu; retry, idempotency, offset yönetimi ve dead-letter operasyonlarını etkileyebilir.

Boot 3.5 veya Boot 4 kullanan platform ekipleri, yaklaşan Boot 3.5.14 / 4.0.6 / 4.1.0-RC1 geçişlerini messaging smoke testleriyle birlikte planlamalı. Özellikle `@KafkaListener`, Kafka Streams, `FilteringMessageListenerAdapter`, custom commit callback, testlerde Embedded Kafka ve Pulsar listener kullanım senaryoları regresyon paketine alınmalı.

Pulsar kullanan ekipler için aksiyon daha sınırlı: Boot BOM ile hizalı yükseltme, klasik listener/template kullanımının doğrulanması ve reactive destek varsayımlarının temizlenmesi yeterli olacaktır.

JDK tarafında bugün yeni kritik başlık yok; ancak April CPU ve JDK 27 kalite uyarıları hâlâ geçerli. Bu nedenle runtime patch, TLS/JAXP regresyon testleri, locale/translation kaynakları, reflection/final-field mutation ve erken erişim CI hattı önceki raporlardaki gibi takipte kalmalı.

## Fırsatlar ve Riskler

Fırsatlar:

- Kafka Streams hata kurtarma kodlarını Kafka 4.2 KIP-1034 ile daha doğal ve broker/client uyumlu hale getirmek.
- Share consumer kullanımında ack/commit davranışını daha açık konfigürasyonla yönetmek.
- Boot BOM yükseltmesini messaging, security ve observability bağımlılıklarını birlikte test eden kontrollü bir platform işi haline getirmek.
- JSpecify nullability sinyalini Kotlin ve Java karışık kod tabanlarında build-time kalite kontrolüne dönüştürmek.

Riskler:

- Share consumer ve async commit davranışı yanlış test edilirse duplicate processing, geç commit, beklenmeyen retry veya DLQ yönlendirme hataları oluşabilir.
- Spring Kafka'yı Boot BOM dışına çıkararak yükseltmek, Framework/Reactor/Micrometer/tracing uyumsuzluğu yaratabilir.
- Pulsar veya Kafka patch yükseltmesini sadece bağımlılık güncellemesi saymak, listener container lifecycle ve filtreleme davranışındaki küçük ama üretim etkili değişiklikleri kaçırabilir.
- Spring Security ve JDK CPU yamaları önceki günlerde ele alındığı için tekrar edilmedi; ancak patch planı ertelenirse güvenlik riski devam eder.

Migration notları:

- Boot 3.5 hattı için Spring Kafka 3.3.15 ve Spring Pulsar 1.2.17'yi Boot 3.5.14 ile birlikte test edin.
- Boot 4.0 hattı için Spring Kafka 4.0.5 ve Spring Pulsar 2.0.5'i Boot 4.0.6 ile birlikte bekleyin.
- Boot 4.1 pilotları için Kafka 4.1.0-RC1 ve Pulsar 2.0.5'i Boot 4.1.0-RC1 test matrisine alın.
- Kafka 4.x geçişinde ZooKeeper tabanlı test varsayımlarını, Embedded Kafka kullanımını ve retry API'lerini ayrıca kontrol edin.

## İzlenmesi Gereken Konular

- Spring Boot 3.5.14, 4.0.6 ve 4.1.0-RC1 resmi yayın duyuruları.
- Spring Kafka 4.1.0-RC1'den GA'ya giderken share consumer ve Streams DLQ davranışlarında ek değişiklik olup olmadığı.
- Spring Pulsar 2.x hattında reactive desteğin sonlandırılması sonrası klasik API kullanımının dokümantasyon ve Boot auto-configuration tarafında nasıl netleşeceği.
- Spring Security/Spring Authorization Server CVE yamalarının Boot hatlarına tam olarak nasıl taşınacağı.
- JDK 27 early-access build'lerinde locale/translation kaynakları, post-quantum TLS ve integrity-by-default uyarılarının framework/test tooling üzerinde etkisi.
- Baeldung ve InfoQ gibi kürasyon kaynaklarında Boot 4 migration, null-safety ve agentic AI başlıklarının tekrarlama sıklığı.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring for Apache Kafka 4.1.0-RC1, 4.0.5 ve 3.3.15 yayınlandı
- source: [Spring Blog](https://spring.io/blog/2026/04/22/spring-kafka-4/), [Spring Kafka proje sayfası](https://spring.io/projects/spring-kafka/), [Spring Kafka reference](https://docs.spring.io/spring-kafka/reference/whats-new.html)
- author: Soby Chacko
- date: 22 Nisan 2026
- category: messaging, release, event-driven architecture
- tags: spring-kafka, kafka, kafka-streams, share-consumer, async-commit, kip-1034, kip-1071, spring-boot
- summary: Spring Kafka 4.1.0-RC1 share consumer ack modelini enum ile netleştiriyor, async commit callback desteği ekliyor, lifecycle event görünürlüğünü artırıyor ve Kafka Streams hata işleme modelini Kafka 4.2 KIP-1034 ile hizalıyor. 4.0.5 ve 3.3.15 patch sürümleri ilgili branch'lere benzer düzeltmeleri taşıyor.
- why_it_matters: Bu değişiklikler yüksek hacimli event-driven sistemlerde offset, retry, DLQ ve consumer lifecycle davranışını etkileyebilir.
- java_spring_relevance: Spring Boot mikroservislerinde Kafka entegrasyonu yaygın olduğu için doğrudan üretim etkisi yüksek.
- actionability: yakın_vade_staging_testi
- impact_level: yüksek
- opportunities: Daha açık ack modeli, daha kontrollü async commit, Kafka Streams native DLQ ile daha temiz hata kurtarma tasarımı.
- risks: Yanlış commit politikası duplicate processing veya veri kaybı algısı yaratabilir; BOM dışı override uyumsuzluk doğurabilir.
- migration_notes: Boot 3.5, 4.0 ve 4.1 hatlarında Kafka sürümlerini Boot BOM ile birlikte test edin; share consumer ve Streams senaryolarını ayrı regresyon paketi yapın.

### Bulgu 2

- title: Kafka ve Pulsar yayınları yaklaşan Spring Boot patch/RC hatlarına bağlandı
- source: [Spring Kafka yayın duyurusu](https://spring.io/blog/2026/04/22/spring-kafka-4/), [Spring Pulsar yayın duyurusu](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available/), [Spring Boot dokümantasyonu](https://docs.spring.io/spring-boot/index.html)
- author: Soby Chacko, Spring Team
- date: 22 Nisan 2026
- category: release-train, dependency-management, platform-engineering
- tags: spring-boot, bom, dependency-management, spring-kafka, spring-pulsar, boot-3.5.14, boot-4.0.6, boot-4.1.0-rc1
- summary: Spring Kafka ve Spring Pulsar yayınları, yaklaşan Spring Boot 3.5.14, 4.0.6 ve 4.1.0-RC1 hatlarına dahil edilecek. Bu, messaging stack güncellemelerinin Boot release train üzerinden taşınacağını gösteriyor.
- why_it_matters: Kurumsal Spring ekiplerinde güvenli yükseltme çoğu zaman tekil artifact değil, BOM ve platform test matrisi sorunudur.
- java_spring_relevance: Spring Boot BOM kullanan ekipler, Kafka/Pulsar değişikliklerini güvenlik, observability ve runtime dependency değişiklikleriyle birlikte test edebilir.
- actionability: hemen_release_planina_ekle
- impact_level: orta-yüksek
- opportunities: Platform ekipleri tek upgrade penceresinde messaging dependency setini kontrollü test edebilir.
- risks: Tekil override ile ilerlemek Framework/Reactor/Micrometer/tracing hizasını bozabilir.
- migration_notes: Boot patch/RC duyuruları gelince canary servislerde listener, Streams, Pulsar template/listener ve integration testleri çalıştırılmalı.

### Bulgu 3

- title: Spring for Apache Pulsar 1.2.17 ve 2.0.5 bakım sürümleri çıktı
- source: [Spring Blog](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available/), [Spring Pulsar proje sayfası](https://spring.io/projects/spring-pulsar/)
- author: Soby Chacko
- date: 22 Nisan 2026
- category: messaging, maintenance-release
- tags: spring-pulsar, apache-pulsar, spring-boot, maven-central, bom
- summary: Spring for Apache Pulsar 1.2.17 ve 2.0.5 Maven Central'a çıktı. Duyurunun ana değeri, bu sürümlerin yaklaşan Boot hatlarına entegre edilecek olması.
- why_it_matters: Pulsar kullanan ekipler için dependency hygiene ve Boot compatibility korunuyor.
- java_spring_relevance: Spring Boot ile Pulsar kullanan servislerde BOM hizası, listener/template davranışı ve reactive destek varsayımları önem taşıyor.
- actionability: kullanan_ekipler_icin_izle_ve_test_et
- impact_level: orta
- opportunities: Boot ile birlikte temiz dependency alignment.
- risks: Pulsar kullanmayan ekipler için düşük değer; Pulsar kullanan ekiplerde reactive support varsayımları eski kalabilir.
- migration_notes: Boot 3.5 hattında 1.2.17, Boot 4 hattında 2.0.5 hedeflenmeli; reactive kullanım varsa plan ayrıca gözden geçirilmeli.

### Bulgu 4

- title: Baeldung ve InfoQ, Boot 4 / JDK 27 / null-safety / observability sinyallerini tekrar doğruluyor
- source: [Baeldung Java Weekly 642](https://www.baeldung.com/java-weekly-642), [InfoQ Java News Roundup Apr 13](https://www.infoq.com/news/2026/04/java-news-roundup-apr13-2026/)
- author: Baeldung editörleri, Michael Redlich
- date: 17 Nisan 2026, 20 Nisan 2026 haftası
- category: ecosystem-signal, curated-analysis
- tags: spring-boot-4, spring-framework-7, jdk-27, jspecify, micrometer, camel, spring-ai, quarkus
- summary: Kürasyon kaynakları Spring Framework 7 / Boot 4, JDK 27 kalite uyarıları, Spring AI Session API, Quarkus reflection-free Jackson, Micrometer JDK metrikleri ve Camel 4.19 gibi başlıkları tekrar öne çıkarıyor.
- why_it_matters: Tekil haberlerin dışında hangi konuların ekosistem gündeminde kalıcılaştığını gösteriyor.
- java_spring_relevance: Enterprise Spring ekipleri için Boot 4 migration, runtime gözlemlenebilirlik, null-safety ve AI entegrasyonları roadmap başlığı olmaya devam ediyor.
- actionability: izleme_ve_roadmap_girdisi
- impact_level: orta
- opportunities: Roadmap önceliklerini sadece vendor duyurularına değil, kaynaklar arası tekrar eden sinyallere göre düzenlemek.
- risks: Bu bulgu tek başına yeni aksiyon gerektirmez; tekrarlanan başlıkları gereksiz yere yeniden raporlamak gürültü oluşturabilir.
- migration_notes: Önceki raporlarda işlenen Spring AI Session API, JDK 27 heads-up, Micrometer 1.17 RC1 ve Camel 4.19 başlıkları tekrar edilmemeli; sadece roadmap trendi olarak izlenmeli.

### Taranan fakat bugün tekrar edilmeyen kaynaklar

- [Inside Java](https://inside.java/) ve [OpenJDK JDK 27](https://openjdk.org/projects/jdk/27/) tarafında yeni ana aksiyon sinyali bulunmadı; JDK 27 kalite uyarıları önceki raporlarda işlendi.
- [Oracle Java CPU April 2026](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm) dünkü raporda ele alındı; bugün yeni ek kırılım yok.
- [Gunnar Morling blogu](https://www.morling.dev/blog/) tarafında 2 Nisan Hardwood Beta sonrası yeni Java/Spring odaklı yazı bulunmadı; önceki raporda işlendi.
- [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarafında bugün yeni Spring/Java yazısı bulunmadı; Spring Framework 7 API versiyonlama yazısı önceki Spring 7 trendi için destekleyici kaynak olarak kalıyor.

## Sonuç

23 Nisan taramasında en yüksek karar değeri Spring Kafka 4.1.0-RC1 ve bunun yaklaşan Boot patch/RC hatlarına etkisinde. Event-driven Spring sistemleri için odak noktası artık sadece framework versiyonu değil; ack/commit semantiği, Kafka Streams hata kurtarma modeli, listener lifecycle gözlemi ve Boot BOM hizası olmalı.

Bugün JDK ve güvenlik tarafında yeni bir ana başlık yok; ancak önceki raporlardaki Oracle CPU, Spring Security/SAS CVE ve JDK 27 uyumluluk işleri hâlâ aktif teknik borç olarak takip edilmeli. Platform ekipleri için önerilen pratik adım, Boot 3.5.14 / 4.0.6 / 4.1.0-RC1 çıktığında messaging regresyon testlerini patch planının parçası yapmak.
