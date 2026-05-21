# Günlük Java / Spring Ekosistem Raporu

Tarih: 21 Mayıs 2026  
Tarama zamanı: 21 Mayıs 2026 09:09 TSİ  
Odak: gRPC güvenliği, batch operasyonları, JDK tanılama formatı, generic AMQP 1.0 ve Spring Boot 4.1'in genişleyen platform yüzeyi

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Security advisory sayfaları](https://spring.io/security), [Spring Batch referans dokümantasyonu](https://docs.spring.io/spring-batch/reference/6.0/), [Inside Java](https://inside.java/), [OpenJDK Quality Outreach bağlantıları](https://wiki.openjdk.java.net/display/quality/Quality+Outreach), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’un 19 Mayıs 2026 tarihli This Week in Spring yazısı](https://spring.io/blog/2026/05/19/this-week-in-spring-may-19-2026), [Gunnar Morling’in blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY’ın blogu](https://blog.burakkutbay.com/) tarandı. Bugün Baeldung, Gunnar Morling ve Burak KUTBAY tarafında doğrudan üretim kararını değiştiren yeni bir sinyal görünmedi; bu yüzden raporu zayıf tutorial trafiğiyle doldurmak yerine, prod etkisi daha yüksek olan gRPC güvenlik düzeltmesi, Spring Batch 6 operasyonel yetenekleri, JDK 27 JSON thread dump format değişimi ve Spring AMQP 4.1 yön değişimine kaydırdım.

## Öne Çıkan Başlıklar

- [Spring gRPC için CVE-2026-40968 düzeltmesi](https://spring.io/security/cve-2026-40968), yetki reddi sonrası `SecurityContext` bilgisinin aynı worker thread üzerinde bir sonraki isteğe sızabilmesi riskini kapatıyor. gRPC denemeleri artık yalnız performans konusu değil, açık bir güvenlik konusu.
- [Spring Batch 6.0.3](https://docs.spring.io/spring-batch/reference/6.0/) ve ilgili “What’s New” dokümantasyonu, batch işlerini eski usul cron+log akışından daha operasyonel bir modele taşıyor: yeni concurrency modeli, `recover`, graceful shutdown, local chunking ve JFR event’leri aynı pakette.
- [JDK 27 Quality Outreach uyarısı](https://inside.java/2026/05/20/quality-heads-up/), JSON thread dump alanlarının artık string değil numeric üretileceğini söylüyor. JVM tanılama çıktısını JSON olarak parse eden iç araçlar ve observability pipeline’ları buna hazırlanmalı.
- [Spring AMQP 4.1.0-M3](https://spring.io/blog/2026/03/18/spring-amqp-4-1-0-m3-available), generic AMQP 1.0 istemci tarafında `@AmqpListener` seviyesine gelerek yalnız Rabbit odaklı değil, daha genel bir protokol soyutlaması aradığını gösteriyor.
- [Spring Office Hours S5E16](https://spring.io/blog/2026/05/19/spring-office-hours-podcast-S5E16), Boot 4.1’in tek yeniliğinin gRPC olmadığını netleştiriyor: OpenTelemetry, OAuth2 resource server, Spring Batch için MongoDB desteği, Log4j rotasyonu ve AMQP 1.0 aynı release treninde şekilleniyor.

## Kritik Güncellemeler

### 1. Spring gRPC 1.0.3 güvenlik düzeltmesi, yetki reddi akışlarında thread-local sızıntıyı kapatıyor

[CVE-2026-40968](https://spring.io/security/cve-2026-40968) uyarısına göre, kimliği doğrulanmış bir kullanıcı bir gRPC metoda erişemediğinde onun kimlik bilgisi worker thread üzerinde bağlı kalabiliyor ve aynı thread’e düşen sonraki isteğe miras kalabiliyor. Advisory, etkilenen sürümleri `1.0.0 - 1.0.2`, düzeltme sürümünü ise `1.0.3` olarak veriyor.

Bu bulgu neden önemli:

- Spring Boot 4.1 ile gRPC daha görünür ve resmi hale gelirken güvenlik sınırı da aynı anda sertleşiyor.
- Sorun “gRPC çalışıyor mu?” testiyle değil, özellikle “authenticated ama forbidden” akışıyla ortaya çıkıyor.
- Yetki hatası sonrası thread reuse yapan yük altında gerçek kullanıcı sınırını bozabildiği için impact seviyesi orta değil, yükseğe yakın.

Pratik yorum: gRPC pilotu açan ekipler, sadece starter ve health-check eklemekle yetinmemeli; yetki reddi, thread reuse ve ardışık istek senaryolarını test setine eklemeli.

### 2. Spring Batch 6 artık batch altyapısını platform yeteneği gibi ele alıyor

[Spring Batch 6.0 GA duyurusu](https://spring.io/blog/2025/11/19/spring-batch-6-0-0-ga) ve [6.0.3 referans dokümantasyonu](https://docs.spring.io/spring-batch/reference/whatsnew.html) birlikte okunduğunda dört güçlü sinyal çıkıyor:

- yeni concurrency modeli,
- `CommandLineJobOperator`,
- `recover` ile failed execution kurtarma,
- graceful shutdown ve JFR tabanlı observability.

Doküman ayrıca local chunking, Spring Integration message channels ile SEDA tarzı işlem, Jackson 3 desteği ve Spring Framework 7 / Spring Data 4 hizasını da öne çıkarıyor.

Bu neden kritik:

- Batch işlerini “arka planda akan teknik borç” olmaktan çıkarıp restartability ve gözlemlenebilirlik eksenine çekiyor.
- Özellikle gecelik ETL, settlement, dosya işleme veya uzun süren orchestrasyon akışlarında stop/restart davranışı artık ilk sınıf bir konu.
- JFR event’leri sayesinde batch performans ve hata analizi sadece log satırı taramasıyla sınırlı kalmıyor.

Buradaki ana risk, Spring Batch 6’yı yalnız küçük bir minor upgrade gibi görmek. Bu çizgi Jackson 3, Spring Framework 7, nullability ve concurrency varsayımlarını birlikte getiriyor.

### 3. JDK 27 JSON thread dump alanları tip değiştiriyor; parser’lar sessiz kırılabilir

[Inside Java üzerindeki Quality Outreach notu](https://inside.java/2026/05/20/quality-heads-up/) kritik ama kolay gözden kaçacak bir uyumluluk değişimi anlatıyor: `HotSpotDiagnosticMXBean.dumpThreads` ve `jcmd Thread.dump_to_file -format=json` çıktısında thread identifier, thread count ve process id gibi alanlar string yerine numeric JSON value olarak yazılacak.

Bu değişiklik neden gerçek dünya etkisi taşır:

- Birçok kurum JSON thread dump çıktısını kendi incident bot’ları, parser’ları, dashboard’ları veya offline analiz araçlarıyla işliyor.
- Tip beklentisi string ise sessiz parse hatası, yanlış indeksleme veya bozuk alert kuralı üretilebilir.
- Spring uygulamasının kendisi kod olarak etkilenmeyebilir, ama platformun tanılama zinciri etkilenir.

En doğru aksiyon, JDK 27 EA veya test build’leriyle thread dump pipeline’ını bugünden çalıştırmak ve JSON schema/serde mantığını type-tolerant hale getirmek.

### 4. Bugün dünkü ölçekte yeni bir Spring Cloud veya Spring Security kırıcı duyuru görünmüyor

19 ve 20 Mayıs raporlarının merkezindeki Spring Cloud Config/Function CVE hattı, Spring AI conversation memory değişimi ve Authorization Server destek yön kayması seviyesinde yeni bir resmi alarm bugün görünmedi. Bu boşluğu zayıf haberlerle doldurmak yerine, yukarıdaki daha üretim etkili sinyallere odaklanmak daha doğru.

## Trendler ve Sinyaller

- `Operasyonel davranış artık framework özelliği oluyor.` Spring Batch 6’daki `recover`, graceful shutdown ve JFR event’leri; Boot 4.1 tarafındaki OpenTelemetry ve Log4j rotasyonu; JDK 27 tarafındaki daha düzenli JSON tanılama çıktıları aynı yönde ilerliyor.
- `HTTP dışı iletişim Spring içinde daha ciddi bir yatırım alanı.` Gündem artık sadece REST değil: Spring gRPC güvenlik ve starter olgunlaşması, Spring AMQP generic 1.0 soyutlaması ve Batch tarafındaki MongoDB desteği sinyali bunun göstergesi.
- `Yükseltme işi uygulama takımının lokal problemi olmaktan çıkıyor.` Boot 4.1 release-train kayması, Boot 3.5’in daralan OSS penceresi ve yeni protokol/yetki/observability özellikleri; upgrade planını platform seviyesi karar haline getiriyor.
- `Kalıcı değer ile gürültü ayrımı net.` Baeldung ve kişisel blog tarafında faydalı içerik akışı sürüyor, ama bugünkü karar kalitesini değiştiren şey release/advisory/doc seviyesindeki değişimler.

## Araçlar ve Kütüphaneler

- [Spring gRPC 1.0.3](https://spring.io/projects/spring-grpc): Yüksek öncelik. Eğer gRPC denemesi ya da prod kullanımı varsa, 1.0.3 altına inmemek gerekir.
- [Spring Batch 6.0.3](https://docs.spring.io/spring-batch/reference/6.0/): Yüksek öncelik. Batch iş yükü olan ekipler için artık gerçek bir platform upgrade adayı.
- [Spring AMQP 4.1.0-M3](https://spring.io/blog/2026/03/18/spring-amqp-4-1-0-m3-available): Orta öncelik. Generic AMQP 1.0 ve `@AmqpListener` çizgisi umut verici, ama milestone olduğu için geniş rollout için erken.
- [JDK `jcmd Thread.dump_to_file -format=json`](https://inside.java/2026/05/20/quality-heads-up/): Orta öncelik. Kütüphane değil ama observability ve incident tooling tarafında doğrudan etkisi var.
- [Spring Boot 4.1 release notes işaretleri](https://spring.io/blog/2026/05/19/spring-office-hours-podcast-S5E16): Orta-yüksek öncelik. OTel, OAuth2 resource server, Batch+MongoDB ve AMQP 1.0 aynı release konuşmasının içinde.

## Java / Spring Geliştiricileri İçin Etkiler

- `spring-grpc` kullanan servislerde 1.0.3’e çıkın ve özellikle “authenticated -> forbidden -> next request” akışını concurrency altında test edin.
- Batch kullanan ekipler, Spring Batch 6’yı yalnız API upgrade diye değil, stop/restart/observability yatırımı olarak değerlendirsin.
- JDK 27 denemelerinde thread dump JSON tüketen iç araçlarınızı regression test’e alın; tip dönüşümünü string’e kilitlemiş parser’lar sessiz bozulabilir.
- Boot 4.1 pilotu açıyorsanız, aynı sprintte gRPC, OTel, OAuth2 RS, Batch MongoDB ve AMQP 1.0’ı birlikte denemeyin; bir veya iki capability seçin.
- Messaging tarafında Rabbit dışı veya broker-agnostic AMQP 1.0 ihtiyacı olan ekipler, Spring AMQP 4.1 hattını izlemeye başlasın; ama milestone sürümü doğrudan prod standardı yapmayın.

## Fırsatlar ve Riskler

- Fırsat: gRPC ve generic AMQP 1.0 yatırımları, kurum içi iletişim protokollerini Spring’in security, config ve observability standartlarıyla hizalayabilir.
- Fırsat: Spring Batch 6 ile batch işleri için restartability, shutdown disiplini ve JFR tabanlı gözlemlenebilirlik standardize edilebilir.
- Fırsat: JDK tanılama formatının daha tipli hale gelmesi, uzun vadede incident tooling tarafında daha temiz veri modeli kurmayı kolaylaştırır.
- Risk: gRPC yetki reddi gibi “happy path” dışında kalan güvenlik akışları test edilmezse, thread-local kaynaklı yetki sızıntıları geç fark edilir.
- Risk: JSON thread dump tip değişimi, uygulamayı değil ama operasyon otomasyonunu kırarak incident anında görünmez maliyet yaratır.
- Risk: Spring Batch 6 geçişi sırasında Jackson 2 varsayımları, eski job operator script’leri veya durdurma/yeniden başlatma davranışları beklenenden daha fazla iş çıkarabilir.
- Risk: Spring AMQP generic AMQP 1.0 çizgisi umut verici olsa da henüz milestone; geniş organizasyonel standarda erken çevrilmesi geri dönüş maliyeti üretir.

## İzlenmesi Gereken Konular

- [May Release Train Date Changes](https://spring.io/blog/2026/05/11/may-train-shift) nedeniyle Spring Boot 4.1 GA penceresi artık 1-5 Haziran 2026; roadmap planlarını Mayıs ortasına göre kurmayın.
- [InfoQ’daki Spring team röportajı](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), Spring Boot 3.5’in son ücretsiz OSS bakım sürümünün Haziran 2026 içinde beklendiğini hatırlatıyor; bu, yükseltme temposunu etkileyebilir.
- Spring AMQP 4.1 hattında generic `@AmqpListener` yaklaşımının RC ve GA aşamasında ne kadar stabil kaldığı izlenmeli.
- JDK 27 tarafında JSON diagnostics ve observability formatında benzer başka tip/şema değişiklikleri gelip gelmeyeceği takip edilmeli.
- Baeldung, Gunnar Morling ve Burak KUTBAY tarafında bugün prod yönünü değiştirecek yeni bir içerik görünmedi; bu kaynaklar yine değerli ama bugünün ana kararı release/advisory/dokümantasyon tarafında şekilleniyor.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring gRPC 1.0.3, yetki reddi sonrası `SecurityContext` sızıntısını kapatıyor
- source: [CVE-2026-40968 advisory](https://spring.io/security/cve-2026-40968), [Spring gRPC proje sayfası](https://spring.io/projects/spring-grpc)
- author: belirtilmemiş
- date: 28 Nisan 2026
- category: security, grpc, authorization
- tags: spring-grpc, grpc, securitycontext, authorization, cve, thread-reuse
- summary: Yetkilendirme başarısız olduğunda kimliği doğrulanmış kullanıcının kimliği worker thread üzerinde kalabiliyor; 1.0.3 bu davranışı düzeltiyor.
- why_it_matters: Thread reuse yapılan ortamlarda bir isteğin güvenlik bağlamı sonraki isteğe sızabiliyorsa etki alanı yalnız bir endpoint bug’ı değil, izin sınırı bozulmasıdır.
- java_spring_relevance: Spring Boot 4.1 ile gRPC’yi ciddi değerlendiren veya mevcutta `spring-grpc` kullanan ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: gRPC security regression testlerini daha disiplinli hale getirmek ve authz failure akışlarını standart test paketine almak.
- risks: Sadece success-path testleriyle ilerleyen ekipler production’da izin sızıntısını geç fark edebilir.
- migration_notes: `1.0.0 - 1.0.2` kullananlar `1.0.3`e yükseltmeli; deny edilen çağrıdan hemen sonra gelen anonymous/başka kullanıcı isteği özellikle test edilmeli.

### Bulgu 2

- title: Spring Batch 6, batch iş yüklerini daha restartable ve gözlemlenebilir hale getiriyor
- source: [Spring Batch 6.0.0 GA is out](https://spring.io/blog/2025/11/19/spring-batch-6-0-0-ga), [What’s new in Spring Batch 6](https://docs.spring.io/spring-batch/reference/whatsnew.html), [Spring Batch 6.0.3 Reference](https://docs.spring.io/spring-batch/reference/6.0/)
- author: Mahmoud Ben Hassine
- date: 19 Kasım 2025 ve güncel 6.0.3 referansı
- category: batch, operations, observability
- tags: spring-batch, commandlinejoboperator, recover, graceful-shutdown, jfr, local-chunking, jackson3
- summary: Yeni concurrency modeli, `CommandLineJobOperator`, failed execution recovery, graceful shutdown, local chunking ve JFR event’leri Spring Batch 6’yı daha ciddi bir üretim platformu haline getiriyor.
- why_it_matters: Batch işleri uzun ömürlü, tekrar başlatılabilir ve ölçülebilir hale getirmek çoğu kurumda doğrudan para ve operasyon maliyetiyle ilişkilidir.
- java_spring_relevance: ETL, settlement, raporlama, dosya işleme veya scheduled data pipeline yürüten Spring ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: restart senaryolarını standartlaştırmak, JFR ile performans darboğazlarını görünür kılmak ve batch işlerini daha modüler yönetmek.
- risks: Jackson 3 ve Spring Framework 7 hizası küçümsenirse migration maliyeti beklenenden büyük çıkabilir.
- migration_notes: Önce bir kritik batch akışında pilot yapın; eski stop/restart script’leri, serializer beklentileri ve job repository davranışları yeniden doğrulanmalı.

### Bulgu 3

- title: JDK 27, JSON thread dump alanlarını numeric hale getiriyor
- source: [Inside Java - Quality Outreach Heads-up](https://inside.java/2026/05/20/quality-heads-up/)
- author: belirtilmemiş
- date: 20 Mayıs 2026
- category: diagnostics, observability, compatibility
- tags: jdk27, thread-dump, jcmd, json, parser, observability
- summary: `dumpThreads` ve `jcmd Thread.dump_to_file -format=json` çıktısındaki bazı alanlar string yerine numeric JSON value olacak.
- why_it_matters: Tanılama pipeline’ları çoğu zaman uygulama kadar kritik ama daha az test edilir; schema değişikliği burada sessiz hata üretebilir.
- java_spring_relevance: JVM tabanlı üretim servislerini kurumsal araçlarla izleyen Spring ekipleri için orta-yüksek.
- actionability: izle_ve_test_et
- impact_level: orta-yüksek
- opportunities: Thread dump işleme araçlarını daha tip güvenli ve schema-tolerant tasarlamak.
- risks: Olay anında parser bozulması nedeniyle eksik ya da yanlış incident verisi oluşabilir.
- migration_notes: JDK 27 test ortamında JSON thread dump örnekleri üretilmeli; serde katmanı numeric ve string varyantlarını tolere etmeli.

### Bulgu 4

- title: Spring AMQP 4.1, generic AMQP 1.0 için `@AmqpListener` seviyesine geliyor
- source: [Spring AMQP 4.1.0-M2 Available](https://spring.io/blog/2026/02/19/spring-amqp-4-1-0-m2-available), [Spring AMQP 4.1.0-M3 Available](https://spring.io/blog/2026/03/18/spring-amqp-4-1-0-m3-available), [Spring AMQP proje sayfası](https://spring.io/projects/spring-amqp/)
- author: Artem Bilan
- date: 19 Şubat 2026 ve 18 Mart 2026
- category: messaging, protocol, developer-productivity
- tags: spring-amqp, amqp1.0, amqplistener, messaging, listener-container
- summary: `spring-amqp-client` ile başlayan generic AMQP 1.0 yönü, M3’te `@AmqpListener` desteğine kadar taşınmış durumda.
- why_it_matters: Messaging soyutlaması Rabbit’e sıkı bağlı olmayan ama Spring ergonomisi isteyen ekipler için genişliyor.
- java_spring_relevance: AMQP tabanlı eventing veya kuyruk entegrasyonu kullanan Spring ekipleri için orta.
- actionability: izle_ve_pilotla
- impact_level: orta
- opportunities: Broker bağımlılığını azaltan veya daha genel bir AMQP 1.0 katmanı isteyen platform ekipleri için yeni seçenek.
- risks: Milestone sürüm olduğundan API ve davranış değişimi olasılığı hâlâ yüksek.
- migration_notes: Geniş rollout yerine lab ortamında `@EnableAmqp`, listener factory ve broker uyumluluğu sınırlı bir pilotla denenmeli.

### Bulgu 5

- title: Spring Boot 4.1, gRPC’nin ötesinde observability, auth ve batch yüzeyini de genişletiyor
- source: [Spring Office Hours Podcast S5E16](https://spring.io/blog/2026/05/19/spring-office-hours-podcast-S5E16), [May Release Train Date Changes](https://spring.io/blog/2026/05/11/may-train-shift)
- author: Dan Vega, DaShaun Carter
- date: 19 Mayıs 2026 ve 11 Mayıs 2026
- category: roadmap, platform, upgrade-planning
- tags: spring-boot-4.1, opentelemetry, oauth2-resource-server, spring-batch, mongodb, amqp1.0, log4j
- summary: Boot 4.1 konuşması artık sadece gRPC değil; OTel iyileştirmeleri, OAuth2 resource server geliştirmeleri, Spring Batch için MongoDB desteği, Log4j file rotation stratejileri ve AMQP 1.0 aynı release sohbetinin parçası.
- why_it_matters: Upgrade pilotunun kapsamı büyüyor; ekipler birden fazla platform yeteneğini aynı sürüm dalında değerlendirmek zorunda kalabilir.
- java_spring_relevance: Boot 4.1 planı yapan platform ve uygulama ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Observability, auth ve non-HTTP integration yatırımlarını ayrı POC’lar yerine aynı platform modernizasyon dalgasında toplamak.
- risks: Çok fazla capability’yi tek upgrade paketine koymak test yüzeyini gereksiz büyütebilir.
- migration_notes: 4.1 pilotu bir capability sepeti değil, bilinçli seçilmiş 1-2 hedef üzerinden ilerlemeli; release train tarihi 1-5 Haziran 2026’ya kaydığı için takvim buna göre güncellenmeli.

## Sonuç

21 Mayıs 2026 itibarıyla bugünün en güçlü üç sinyali şunlar: Spring gRPC tarafında güvenlik sınırı somut biçimde düzeltildi; Spring Batch 6 operasyonel olarak gerçek bir platform adayı haline geldi; JDK 27 ise uygulama kodunu değil tanılama zincirini etkileyebilecek sessiz bir JSON schema değişikliği getiriyor.

En doğru kısa vadeli aksiyon seti, gRPC kullanan servisleri 1.0.3’e çekmek, batch iş yükü olan ekiplerde Spring Batch 6 pilotunu başlatmak ve JDK 27 thread dump parser’larını şimdiden test etmektir. Messaging ve Boot 4.1 tarafındaki AMQP 1.0 / observability / auth açılımları ise hemen geniş rollout değil, dikkatli kapsamlama gerektiren orta vadeli fırsatlardır.
