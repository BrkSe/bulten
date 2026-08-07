# Günlük Java / Spring Ekosistem Raporu

Tarih: 7 Ağustos 2026 Cuma  
Tarama zamanı: 7 Ağustos 2026 09:06 TSİ  
Odak: aktif çekirdek projelere dönüş; veri ve mesajlaşma portföyünde sahiplik netleşmesi; event-driven karmaşıklığın uygulama ekiplerine geri dönmesi

Tarama notu: 7 Ağustos 2026 09:06 TSİ itibarıyla [Spring Blog](https://spring.io/blog), [Spring proje sayfaları](https://spring.io/projects), ilgili proje/dokümantasyon yüzeyleri, [Spring Cloud Data Flow End of Open-Source](https://spring.io/blog/2025/04/21/spring-cloud-data-flow-commercial/), [Reactor Kafka Project Will Be Discontinued](https://spring.io/blog/2025/05/20/reactor-kafka-discontinued/), [Reactive Support in Spring for Apache Pulsar Will Be Discontinued](https://spring.io/blog/2025/10/29/spring-pulsar-reactive-discontinued/), [Spring Cloud Stream referans dokümantasyonu](https://docs.spring.io/spring-cloud-stream/reference/spring-cloud-stream.html), [Spring AMQP RabbitMQ Stream dokümantasyonu](https://docs.spring.io/spring-amqp/reference/stream.html), [Spring Boot AMQP dokümantasyonu](https://docs.spring.io/spring-boot/reference/messaging/amqp.html), [MongoDB-backed Spring Batch jobs and more in Spring Boot 4.1](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/), [Inside Java](https://inside.java/), [OpenJDK](https://openjdk.org/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), Josh Long’un son yayınları, Gunnar Morling’in güncel blog akışı ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Bugün yeni bir büyük Spring GA dalgası veya önceki günleri aşan yeni bir JDK platform kırılımı yok. Günün güçlü sinyali sürüm değil: Spring’in aktif çekirdek projeleri ile artık attic, enterprise-only veya discontinue edilen entegrasyon yüzeyleri arasındaki sınırın artık çok net görünmesi.

## Öne Çıkan Başlıklar

- [spring.io/projects](https://spring.io/projects) artık canlı çekirdek ile attic projeleri aynı ekranda çok açık ayırıyor; bu, eski Spring alışkanlıklarıyla seçilen birçok entegrasyonun artık varsayılan güvenli yol olmadığını gösteriyor.
- [Spring Cloud Data Flow](https://spring.io/blog/2025/04/21/spring-cloud-data-flow-commercial/) ve ilişkili control-plane hattı açık kaynakta durmuş durumda; bugünkü pratik karar, “Tanzu mu, kendi orchestration/backfill/backpressure modelimiz mi?” sorusunu ertelememek.
- [Reactor Kafka](https://spring.io/blog/2025/05/20/reactor-kafka-discontinued/) ve [Spring for Apache Pulsar reactive yüzeyi](https://spring.io/blog/2025/10/29/spring-pulsar-reactive-discontinued/) için gelen resmi daralma, Spring’in mesajlaşma portföyünde “çekirdek soyutlama + uygulama içi sahiplik” yönünü güçlendiriyor.
- Buna karşılık bakım alan hatlar canlı: [Spring Cloud Stream 5.0.2](https://docs.spring.io/spring-cloud-stream/reference/spring-cloud-stream.html), [Spring AMQP 4.1.0 RabbitMQ Streams](https://docs.spring.io/spring-amqp/reference/stream.html), [Spring for Apache Kafka 4.1.0](https://spring.io/projects) ve [Spring Batch 6.0.4 / Boot 4.1 Mongo JobRepository](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/) yatırım almaya devam ediyor.
- Dış kaynaklar aynı noktayı destekliyor: InfoQ’nun son event-driven yazıları, framework seçiminin tek başına yeterli olmadığını; schema, cache, lag ve idempotency disiplininin artık uygulama ekibinin asli sorumluluğu olduğunu gösteriyor.

## Kritik Güncellemeler

### 1. Spring portföyünde “aktif çekirdek” ile “yan proje” ayrımı artık saklı değil

[Spring Projects](https://spring.io/projects) sayfası bugün itibarıyla aktif satırda `Spring Cloud Stream`, `Spring Batch`, `Spring AMQP`, `Spring for Apache Kafka`, `Spring for Apache Pulsar`, `Spring Integration` ve çekirdek platform projelerini listelerken; aynı sayfadaki `Projects in the Attic` bölümü `Spring Cloud Data Flow`, `Spring Cloud Skipper`, `Spring Cloud Stream Kafka Binder`, `Spring Cloud Stream Rabbit Binder` ve başka tarihsel yan projeleri açıkça attic olarak gösteriyor.

Bu önemli çünkü birçok kurumsal kod tabanında “Spring” etiketi taşıyan her bileşen hâlâ eşit derecede canlı kabul ediliyor. Artık bu varsayım savunulamaz. Proje adı tanıdık diye seçilen her katman için bugünkü gerçek soru şu: aktif çekirdek mi, attic mi, enterprise-only mi?

### 2. Data Flow control-plane kararı artık teknik merak değil, sahiplik kararı

[Spring Cloud Data Flow End of Open-Source](https://spring.io/blog/2025/04/21/spring-cloud-data-flow-commercial/) duyurusu, `Spring Cloud Data Flow 2.11.x`, `Spring Cloud Deployer 2.9.x` ve `Spring Statemachine 4.0.x` çizgisinin son açık kaynak hatlar olduğunu açık yazıyor. Bugünkü [enterprise proje sayfası](https://enterprise.spring.io/projects/spring-cloud-dataflow/) ise `Spring Cloud Data Flow 2.11.16` sürümünü yalnız enterprise yüzeyde gösteriyor.

Bu, veri pipeline ve batch orchestration tarafında iki net yol bıraktı:

- Tanzu/Spring Enterprise hattını bilinçli satın almak
- Ya da uygulama içi `Spring Batch`, `Spring Cloud Stream`, `Spring Cloud Task`, Kubernetes job/cron/queue primitive’leri ile daha ince ama tamamen sahip olunan bir çözüm kurmak

Ara yol varsayımı artık riskli.

### 3. Reactive mesajlaşma convenience katmanları daralıyor

[Reactor Kafka Project Will Be Discontinued](https://spring.io/blog/2025/05/20/reactor-kafka-discontinued/) duyurusu yalnız bir repo kapanışı değil. Duyuru, `Reactor Kafka`’nın Reactor BOM’dan çıkacağını, `Spring Cloud Stream - Reactor Kafka Binder` hattının future removal için deprecate edildiğini ve `Spring for Apache Kafka` içindeki reactive template’in de çıkış yoluna girdiğini söylüyor. Benzer biçimde [Spring for Apache Pulsar reactive desteğinin kaldırılması](https://spring.io/blog/2025/10/29/spring-pulsar-reactive-discontinued/) kararı, `spring-pulsar-reactive` modülünü `2.0.0` ile, Boot desteğini de `4.0.0` ile kapatıyor.

Spring burada reactive felsefeyi değil, düşük benimsenen wrapper yüzeylerini buduyor. Sonuç olarak ekipler, “reactive adapter hazır diye” seçim yapma konforunu kaybediyor; iş yükü semantiğini gerçekten savunmaları gerekiyor.

### 4. Yatırım alan yön: uygulama içi protokol, state ve runtime sahipliği

Canlı yüzeylerde yatırım net:

- [Spring Cloud Stream](https://docs.spring.io/spring-cloud-stream/reference/spring-cloud-stream.html) hâlâ stabil ve fonksiyonel mesajlaşma modeli, partitioning, observability ve error handling üzerine kurulu.
- [Spring AMQP RabbitMQ Stream desteği](https://docs.spring.io/spring-amqp/reference/stream.html) `RabbitStreamTemplate`, `StreamListenerContainer` ve `Super Streams` gibi doğrudan protokol seviyesinde özellikler sunuyor.
- [Spring Boot AMQP dokümantasyonu](https://docs.spring.io/spring-boot/reference/messaging/amqp.html) RabbitMQ Streams için SSL bundle yönetimini doğrudan çerçeveye taşıyor.
- [Spring Boot 4.1 + Spring Batch Mongo JobRepository](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/) ise batch metadata’yı artık zorunlu JDBC eklentisi olmadan, uygulamanın seçtiği state store ile tutmayı mümkün kılıyor.

Yani Spring ekosistemi “ayrı control plane ekle” değil, “uygulamanın içindeki entegrasyon katmanını daha güçlü kur” yönünde ilerliyor.

## Trendler ve Sinyaller

### Trend Kümesi 1: Portföy küçülüyor, çekirdek soyutlamalar güçleniyor

Aktif projeler ile attic/discontinued/enterprise-only yüzeyler arasındaki fark artık daha sert. Bu, özellikle event-driven ve data tooling tarafında “daha az proje adı, daha çok çekirdek soyutlama” dönemine girildiğini gösteriyor.

### Trend Kümesi 2: Event-driven mimaride asıl yük framework seçiminden değil state ve şema yönetiminden geliyor

[InfoQ’nun gerçek zamanlı Java sistemleri yazısı](https://www.infoq.com/articles/tradeoffs-event-driven-design/) ve [schema proliferation analizi](https://www.infoq.com/articles/schema-proliferation-problem/) aynı dersleri veriyor: cache uyuşmazlığı, consumer lag, schema çoğalması, deduplication ve read-your-writes beklentisi gibi sorunlar üretimde framework’ten daha baskın hale geliyor.

Bu Spring ekipleri için şu anlama geliyor: artık “hangi binder?” sorusundan çok “hangi state modeli, hangi schema evrimi, hangi kritik yol synchronous kalmalı?” sorusu önde.

### Trend Kümesi 3: Uygulama içi orchestration, platform ürünlerine alternatif değil; bilinçli bir sahiplik tercihi

SCDF açık kaynak hattının kapanmasıyla birlikte uygulama içi `Batch + Task + Cloud Stream + broker + K8s` bileşimi yalnız geçici workaround değil, ciddi bir mimari seçenek haline geldi. Ama bunun bedeli deployment history, rollback, topology, replay ve backfill operasyonlarını ekibin sahiplenmesi.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: aktif çekirdek ve attic/commercial yüzeyleri envanterlemek
- Kalıcı değer: event-driven sistemlerde schema/state/lag bütçesini mimari karar olarak ele almak
- Kalıcı değer: maintained core etrafında sadeleştirme yapmak
- Düşük öncelik: sadece yeni bir broker veya cache demosu gördüğü için yeni control-plane katmanı eklemek
- Düşük öncelik: eski “Spring adı var, bakımı da vardır” varsayımıyla teknoloji seçmek

## Araçlar ve Kütüphaneler

- [Spring Cloud Stream 5.0.2](https://docs.spring.io/spring-cloud-stream/reference/spring-cloud-stream.html): Fonksiyonel mesajlaşma, binder soyutlaması, partitioning ve observability için hâlâ en güçlü çekirdek yüzeylerden biri.
- [Spring AMQP 4.1.0 RabbitMQ Stream desteği](https://docs.spring.io/spring-amqp/reference/stream.html): `RabbitStreamTemplate`, `StreamListenerContainer` ve `Super Streams` ile yüksek hacimli event akışlarında doğrudan değerlendirilmeli.
- [Spring Boot 4.1 + MongoDB tabanlı Batch metadata](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/): SQL zorunluluğunu kırdığı için doküman/veri odaklı batch servisleri için ciddi sadeleşme getiriyor.
- [Spring Cloud AWS 3.3.0 ile DynamoDB entegrasyonu](https://www.baeldung.com/spring-data-dynamodb): AWS yoğun ekipler için güncel ve pratik; `DynamoDbTemplate`, BOM yönetimi ve Testcontainers/LocalStack inner-loop’u ile anlamlı.
- [Hardwood 1.0](https://www.morling.dev/blog/): Düşük öncelikli ama izlenebilir bir sinyal. Gunnar Morling’in Java 21+ için hafif Parquet okuyucusu, Spring Batch veya veri işleyen JVM servislerinde niş ama gerçek kullanım alanı bulabilir.
- Bugün yeni ve kritik bir Java/Spring GA araç patlaması yok. Değer yeni artifact bolluğunda değil, hangi yüzeylerin gerçekten yaşadığına karar verebilmekte.

## Java / Spring Geliştiricileri İçin Etkiler

- Kod tabanınızda `Spring Cloud Data Flow`, `Skipper`, `Reactor Kafka`, `spring-pulsar-reactive` veya attic’te listelenen başka projeler varsa, bunları “ileride bakarız” değil aktif risk kaydı olarak ele alın.
- Mesajlaşma tarafında mümkün olduğunca aktif çekirdeğe yaslanın: `Spring for Apache Kafka`, `Spring AMQP`, `Spring Cloud Stream`, gerekirse doğrudan broker protokol özellikleri.
- Batch ve veri işlemeyi control-plane ürününe bağlamak yerine, uygulama içinde sahiplenilecek kadar basitse `Spring Batch` ve `Spring Cloud Task` kombinasyonunu yeniden değerlendirin.
- Event-driven sistemlerde şema versiyonlama, replay/backfill, idempotency, lag bütçesi ve cache tutarlılığı için platform seviyesinde standart tanımlayın; bu başlıklar artık framework’ün sizden gizlediği detaylar değil.
- Reactive seçiminde “wrapper var” mantığı yerine iş yükü semantiğini baz alın. Düşük latency kritik yolu, backpressure ihtiyacı ve state modelini ayrı ayrı savunun.

## Fırsatlar ve Riskler

- Fırsat: Daha az katman, daha net sahiplik, daha öngörülebilir destek matrisi
- Fırsat: Uygulama içi orchestration ile daha taşınabilir, daha testlenebilir veri ve batch akışları kurmak
- Fırsat: RabbitMQ Streams, Cloud Stream ve modern Batch state store seçenekleriyle daha sade ama güçlü veri akışları kurmak
- Risk: Attic veya discontinue edilmiş yüzeylerin BOM içinde sessizce yaşamaya devam etmesi
- Risk: SCDF benzeri operational capability’leri kaybederken backfill, replay ve rollback ihtiyaçlarını hafife almak
- Risk: Event-driven tasarımı yalnız broker seçimine indirgemek; schema, lag ve cache tutarlılığı disiplinini kurmamak
- Risk: Reactive adapter çıkarken üretim workload’ını yanlışlıkla blocking ya da yanlış abstraction katmanına taşımak

## İzlenmesi Gereken Konular

- Spring Cloud Stream `5.x` hattında binder sahipliği ve attic mirasının dokümantasyon/refactoring etkileri
- Spring for Apache Pulsar `2.x` sonrası reactive yüzeysiz kullanım desenlerinin ne kadar olgunlaştığı
- Spring Cloud Data Flow enterprise hattının yeni release ve support ritmi
- RabbitMQ Streams ve `Super Streams` için Spring tabanlı gerçek üretim referanslarının artıp artmadığı
- Düşük öncelik: Gunnar Morling’in Hardwood hattı ve Baeldung’in DynamoDB pratiklerinin Spring Batch / veri servislerine ne kadar girdiği

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Aktif Spring çekirdeği ile attic/commercial yüzeyler arasındaki sınır artık üretim kararı düzeyinde görünür
- `source`: [Spring Projects](https://spring.io/projects) | [Spring Cloud Skipper proje sayfası](https://spring.io/projects/spring-cloud-skipper/) | [Spring Cloud Data Flow enterprise sayfası](https://enterprise.spring.io/projects/spring-cloud-dataflow/)
- `author`: Spring team / proje sayfası
- `date`: 7 Ağustos 2026 itibarıyla güncel proje sayfaları
- `category`: portfolio-governance, messaging, batch
- `tags`: spring-projects, attic, dataflow, skipper, ownership, support, portfolio
- `summary`: Güncel Spring proje kataloğu canlı çekirdeği ve attic projeleri aynı yerde açıkça ayırıyor. Data Flow ve Skipper artık açık kaynak varsayılan yol değil; aktif mesajlaşma ve veri yüzeyi daha dar ama daha net.
- `why_it_matters`: Teknik seçim artık sadece API ergonomisi değil, bakım sahipliği ve destek ömrü kararı.
- `java_spring_relevance`: Spring tabanlı entegrasyon, batch ve event-driven sistem kuran ekipler için doğrudan roadmap etkisi var.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: teknoloji yığınını sadeleştirmek; destek matrisini netleştirmek; gereksiz katmanları kaldırmak
- `risks`: attic veya enterprise-only yüzeylere yanlışlıkla stratejik bağımlılık kurmak
- `migration_notes`: BOM, starter, yan repo ve operasyon araçlarınızı aktif/attic/commercial olarak sınıflandırın; sahipliği belirsiz katmanları 2026 backlog’una alın.

### Bulgu 2

- `title`: Reactor Kafka ve Pulsar reactive çıkışları, convenience wrapper döneminin daraldığını resmileştiriyor
- `source`: [Reactor Kafka Project Will Be Discontinued](https://spring.io/blog/2025/05/20/reactor-kafka-discontinued/) | [Reactive Support in Spring for Apache Pulsar Will Be Discontinued](https://spring.io/blog/2025/10/29/spring-pulsar-reactive-discontinued/) | [Spring Projects](https://spring.io/projects)
- `author`: Jason Konicki | Chris Bono | Spring team
- `date`: 20 Mayıs 2025 | 29 Ekim 2025 | 7 Ağustos 2026’da doğrulanan aktif proje listesi
- `category`: messaging, reactive, deprecation
- `tags`: reactor-kafka, spring-pulsar-reactive, deprecation, reactive-template, binder, migration
- `summary`: Reactor Kafka’nın future maintenance hattı kapanıyor; Spring Cloud Stream Reactor Kafka binder ve Spring for Apache Kafka reactive template future removal yoluna giriyor. Pulsar tarafında da reactive modül `2.0.0` ile kaldırılıyor ve Boot `4.0.0` sonrası desteği bitiyor.
- `why_it_matters`: Reactive modelin kendisi değil, düşük benimsenen adapter yüzeyleri eleniyor; ekipler semantiği savunmak zorunda kalıyor.
- `java_spring_relevance`: Kafka/Pulsar tabanlı Spring servislerde client seçimi, hata modeli ve migration planı doğrudan etkileniyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: daha az özel katman; daha doğrudan ve daha uzun ömürlü çekirdek entegrasyonlar
- `risks`: reactive wrapper’a gömülü kodun sessizce teknik borca dönüşmesi
- `migration_notes`: `reactor-kafka`, `spring-pulsar-reactive` ve ilgili starter/template kullanımlarını tarayın; mümkünse `Spring for Apache Kafka`, `Spring AMQP` veya `Spring Cloud Stream` çekirdeğine dönüş planı çıkarın.

### Bulgu 3

- `title`: Spring Cloud Data Flow artık açık kaynak varsayımıyla değil, bilinçli ürün tercihiyle ele alınmalı
- `source`: [Spring Cloud Data Flow End of Open-Source](https://spring.io/blog/2025/04/21/spring-cloud-data-flow-commercial/) | [Spring Cloud Data Flow enterprise sayfası](https://enterprise.spring.io/projects/spring-cloud-dataflow/) | [Spring Cloud Stream reference](https://docs.spring.io/spring-cloud-stream/reference/spring-cloud-stream.html) | [Spring Boot 4.1 and Spring Batch](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/)
- `author`: Michael Minella | Spring team | Josh Long
- `date`: 21 Nisan 2025 | 7 Ağustos 2026’da görünen enterprise yüzey | 21 Haziran 2026
- `category`: batch, stream-processing, platform-strategy
- `tags`: spring-cloud-data-flow, batch, cloud-stream, spring-cloud-task, orchestration, tanzu
- `summary`: Data Flow’ın açık kaynak hattı kapanmış durumda; buna karşılık Cloud Stream ve Batch gibi uygulama içi çekirdekler aktif kalıyor. Bu, orchestration ve topology yönetimini ürün kararı haline getiriyor.
- `why_it_matters`: Batch/stream platformu için “ücretsiz ama uzun ömürlü” varsayımı artık yok; ya satın alınacak ya da sahiplenilecek.
- `java_spring_relevance`: Spring Batch, Task ve Cloud Stream kullanan veri akışı ekipleri için doğrudan mimari etki var.
- `actionability`: `planli_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: daha taşınabilir uygulama mimarisi; daha ince ama kontrol edilen veri akışları
- `risks`: replay, rollback, topology visibility ve backfill gibi operational capability’leri kaybetmek
- `migration_notes`: SCDF kullanım alanlarını ayırın: topology tasarımı, deployment history, stream edit, batch launch, replay. Her biri için Tanzu mı, K8s + uygulama içi kod mu kararını ayrı verin.

### Bulgu 4

- `title`: Canlı yatırım uygulama içi protokol ve state entegrasyonuna gidiyor
- `source`: [Spring Cloud Stream reference](https://docs.spring.io/spring-cloud-stream/reference/spring-cloud-stream.html) | [Spring AMQP RabbitMQ Streams](https://docs.spring.io/spring-amqp/reference/stream.html) | [Spring Boot AMQP docs](https://docs.spring.io/spring-boot/reference/messaging/amqp.html) | [MongoDB-backed Spring Batch jobs and more in Spring Boot 4.1](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/) | [A Bootiful Podcast: Gregory Green](https://spring.io/blog/2026/08/06/a-bootiful-podcast-gregory-green)
- `author`: Spring team | Gary Russell and contributors | Spring Boot team | Josh Long
- `date`: 7 Ağustos 2026’da güncel dokümantasyon | 21 Haziran 2026 | 6 Ağustos 2026
- `category`: messaging, data-infrastructure, runtime
- `tags`: spring-cloud-stream, rabbitmq-streams, super-streams, spring-batch, mongodb, ssl-bundles, valkey
- `summary`: Spring’in canlı yatırım alanı ayrı kontrol düzlemleri değil; uygulama içindeki mesajlaşma, stream protokolü, state store ve runtime güvenlik entegrasyonu. Cloud Stream fonksiyonel model, RabbitMQ Streams, SSL bundle yönetimi ve Mongo JobRepository bunu gösteriyor.
- `why_it_matters`: Uzun ömürlü yol, daha fazla ara katman değil; daha güçlü çekirdek soyutlama ve daha açık uygulama sahipliği.
- `java_spring_relevance`: Broker, batch ve cache/state entegrasyonlarını Spring Boot servislerinin içinde kuran ekipler için doğrudan seçim değeri var.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: daha sade deployment; daha net güvenlik/SSL yönetimi; store seçimini işe göre yapabilme
- `risks`: control-plane yeteneklerinin yerini tutacak operasyon standardını kurmamak
- `migration_notes`: Yeni projelerde önce çekirdek aktif yüzeyi deneyin: Cloud Stream function modeli, Kafka/AMQP çekirdeği, Batch JobRepository store seçimi, broker SSL bundle standardı.

### Bulgu 5

- `title`: Event-driven mimaride gerçek maliyet framework değil, schema ve state disiplinidir
- `source`: [Scaling Java-Based Real-Time Systems: the Hidden Tradeoffs of Event-Driven Design](https://www.infoq.com/articles/tradeoffs-event-driven-design/) | [The Schema Proliferation Problem in Kafka and Flink Pipelines](https://www.infoq.com/articles/schema-proliferation-problem/) | [Integrating Amazon DynamoDB With Spring Boot Using Spring Cloud AWS](https://www.baeldung.com/spring-data-dynamodb) | [Gunnar Morling blog](https://www.morling.dev/blog/)
- `author`: Sagar Deepak Joshi | Spoorthi Basu | Hardik Singh Behl | Gunnar Morling
- `date`: 30 Haziran 2026 | 25 Mayıs 2026 | 29 Temmuz 2026 güncellemesi | 22 Temmuz 2026 ve 25 Haziran 2026
- `category`: architecture, data-engineering, operational-risk
- `tags`: event-driven, schema-governance, cache-consistency, consumer-lag, dynamodb, parquet
- `summary`: Dış kaynaklar aynı sonuca gidiyor: event-driven tasarımın asıl zorluğu framework seçimi değil; schema çoğalması, cache/state uyuşmazlığı, consumer lag ve veri erişim desenlerinin disiplinli yönetimi. Yeni veri araçları yalnız bu disiplini desteklediği kadar değerli.
- `why_it_matters`: Spring soyutlamaları daraldıkça mimari hataları framework saklamıyor; doğrudan operasyon problemi olarak geri dönüyor.
- `java_spring_relevance`: Kafka, Batch, cache, NoSQL ve veri taşıma işleri yapan Spring ekipleri için bu sorunlar doğrudan üretim incident kaynağı.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: daha az schema yüzeyi; daha testlenebilir adapter katmanı; store seçimini iş yüküne göre optimize etmek
- `risks`: event katalog patlaması; stale cache; uzun consumer lag; replay/backfill sırasında tutarsızlık
- `migration_notes`: Schema konsolidasyonu, idempotent consumer tasarımı, state-store stratejisi ve kritik synchronous yol tanımını mimari checkliste alın; yalnız broker migrasyonu ile çözüm beklemeyin.

## Sonuç

7 Ağustos 2026 için ana mühendislik kararı şu: Spring veri ve mesajlaşma ekosisteminde artık “Spring etiketi taşıyor, o halde yaşar” yaklaşımıyla ilerlenemez. Canlı çekirdek daha net, daha güçlü ve daha dar; attic, enterprise-only ve discontinue edilen yüzeyler ise artık gizli değil. Güçlü ekiplerin bundan çıkaracağı sonuç, control-plane romantizmini bırakıp aktif çekirdeğe yaslanan, state/schema/idempotency sahipliğini açıkça üstlenen daha sade mimarilere geçmek olmalı. Bugünün backlog değeri yeni broker denemesi değil; mevcut Spring bağımlılıklarının gerçek bakım statüsünü netleştirmek.
