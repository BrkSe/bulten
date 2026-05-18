# Günlük Java / Spring Ekosistem Raporu

Tarih: 18 Mayıs 2026  
Tarama zamanı: 18 Mayıs 2026 09:09 TSİ  
Odak: Spring Boot ve Spring Security güvenlik düzeltmelerinin üretim etkisi, JDK 26-27 hardening sinyalleri, Boot 4 ve Spring Cloud hattında uyumluluk ve build-time yönelimi

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects/), Spring release duyuruları, [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud), [Spring Modulith duyurusu](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released), [OpenJDK JEP sayfaları](https://openjdk.org/jeps/0), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’un güncel Spring paylaşımları](https://spring.io/blog/2026/05/12/this-week-in-spring-may-12-2026), [Gunnar Morling’in blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY’ın blogu](https://blog.burakkutbay.com/) tarandı. 18 Mayıs 2026 itibarıyla Spring tarafında dünkü taramaya göre yeni büyük GA duyurusu görünmüyor; bu nedenle bugün rapor “yeni post hacmi” yerine son birkaç günde yayımlanmış ama prod etkisi yüksek resmi düzeltmeler ve 13-17 Mayıs arası OpenJDK kalite uyarılarına odaklanıyor. Gunnar Morling tarafında güncel içerik hâlâ Hardwood/Parquet ekseninde; Burak KUTBAY tarafında son doğrudan Spring Boot 4 sinyali Aralık 2025 tarihli HTTP Service Client yazısı olarak kalıyor. Bunlar bugün için izleme notu, ama acil üretim alarmı değil.

## Öne Çıkan Başlıklar

- [Spring Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now) ve [3.5.14](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now) çoklu güvenlik yamaları içeriyor; özellikle SSL hostname verification, zayıf `random.*` kullanımı ve Actuator/DevTools yüzeyleri küçük patch gibi değerlendirilmemeli.
- [Spring Security 6.5.10, 7.0.5 ve 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-security-releases) ile hem yeni güvenlik düzeltmeleri geldi hem de 5.7, 5.8, 6.3 ve 6.4 OSS destek çizgileri kapandı. Bu, yalnız patch değil destek stratejisi kararı.
- [JDK 27 için Post-Quantum Hybrid Key Exchange](https://openjdk.org/jeps/527) artık varsayılan; TLS termination, proxy, mTLS ve network middlebox zincirleri olan Java servisleri için laboratuvar testi gerektiriyor.
- [JDK 26 final field mutation uyarıları](https://openjdk.org/jeps/500) ve [JDK 27’de eski launcher option’larının kaldırılması](https://inside.java/2026/05/17/quality-heads-up/) “çalışıyordu” diye bırakılmış reflection ve JVM startup alışkanlıklarını kırmaya başlıyor.
- Spring ekosisteminde kalıcı sinyal “daha fazla explicitlik ve daha fazla build-time işleme”: [Spring Cloud 2025.1.1 uyumluluk matrisi](https://spring.io/projects/spring-cloud), [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released) ve [Spring Data AOT Repositories](https://www.baeldung.com/spring-data-aot-repositories) aynı yöne işaret ediyor.

## Kritik Güncellemeler

### 1. Spring Boot 4.0.6 ve 3.5.14 güvenlik hattı doğrudan üretim sertleştirmesi

23 Nisan 2026 tarihli Spring Boot sürümlerinde birden fazla kritik ve yüksek etkili güvenlik düzeltmesi birlikte geldi:

- `CVE-2026-40975`: `random.*` konfigürasyonu kriptografik secret üretiminde zayıf PRNG kullanabiliyor.
- `CVE-2026-40971`: `spring-boot-devtools` remote secret karşılaştırması timing attack yüzeyi oluşturabiliyor.
- `CVE-2026-40974`: `spring.pid.file` symlink edilirse yetkisiz dosya yazımına gidilebiliyor.
- `CVE-2026-40972`: Actuator `ManagementWebSecurityAutoConfiguration` özel security chain ile beklenenden farklı davranabiliyor.
- `CVE-2026-40973`: `spring.application.temp` predictable directory yaratabiliyor.
- Boot `4.0.6` hattına ek olarak `CVE-2026-40970` ve `CVE-2026-40976` ile RabbitMQ, Cassandra, Elasticsearch auto-configuration’da SSL bundle kullanırken hostname verification pasif kalabiliyor.

Bu setin önemi şu: sorunlar tek bir feature’a sıkışmıyor. Konfigürasyon, startup, yerel dosya sistemi, yönetim endpoint güvenliği ve TLS doğrulaması aynı anda etkileniyor. Özellikle platform ekipleri için “biz sadece starter kullanıyoruz” savunması burada zayıf; zafiyetlerin çoğu tam da starter ve auto-config rahatlığından doğuyor.

### 2. Spring Security tarafında yalnız patch değil, destek penceresi kapanışı da var

[21 Nisan 2026 Spring Security duyurusu](https://spring.io/blog/2026/04/21/spring-security-releases) üç düzeltme hattını aynı anda ilerletiyor:

- `6.5.10`
- `7.0.5`
- `7.1.0-RC1`

Kapatılan başlıklar arasında şunlar dikkat çekiyor:

- `JdbcOneTimeTokenService` üzerinde çoklu session ve token handling sorunları
- X.509 sertifikalarında subject/SAN alanları ile impersonation riski
- `issuer-location` kullanımıyla metadata yükleme zafiyeti
- `PathPatternRequestMatcher` eşleştirme hataları
- Dynamic Client Registration metadata doğrulama açıkları

Daha kritik olan ikinci mesaj ise sürüm politikası: 5.7, 5.8, 6.3 ve 6.4 OSS desteği sona ermiş durumda. Bu nedenle bazı ekipler için asıl sorun “bu CVE beni vuruyor mu?” değil, “artık hangi dal güvenlik düzeltmesi alıyor?” sorusu.

### 3. JDK 27’de post-quantum hibrit TLS varsayılan hale geliyor

[JEP 527](https://openjdk.org/jeps/527), [Inside Java Newscast #112](https://inside.java/2026/05/14/newscast-112/) ve [17 Mayıs Quality Outreach notu](https://inside.java/2026/05/17/quality-heads-up/) birlikte okunduğunda net tablo şu:

- JDK 27, TLS 1.3 için `X25519MLKEM768` hibrit key exchange’i varsayılan named group setine ekliyor.
- Bu, klasik ECDHE’ye göre daha büyük handshake payload’ları ve farklı middlebox davranışları anlamına gelebilir.
- Sorun beklenen yer uygulama kodu değil; load balancer, service mesh, WAF, TLS inspection kutuları ve kurumsal proxy’ler.

Java servisleri açısından bu değişiklik “JDK yükseltince otomatik daha güvenliyiz” kadar basit değil. Özellikle Spring Boot servislerinde JDBC over TLS, Kafka, RabbitMQ, REST client, service-to-service mTLS gibi farklı katmanlarda interop test planı gerektiriyor.

### 4. JDK 26 ve 27, eski reflection ve startup alışkanlıklarını daraltıyor

İki ayrı resmi sinyal burada birleşiyor:

- [JEP 500](https://openjdk.org/jeps/500): JDK 26’da `final` field’ları reflection ile mutate eden kodlar uyarı almaya başlıyor.
- [Inside Java Quality Heads-Up](https://inside.java/2026/05/17/quality-heads-up/): JDK 27’de `-noclassgc`, `-verifyremote`, `-noverify`, `-Xverify:none` gibi uzun süredir terk edilmesi beklenen launcher option’ları hata üretecek.

Bu ikili özellikle şu ekipler için gerçek maliyet çıkarır:

- eski test yardımcıları ve bytecode araçları
- reflection tabanlı mapper/serializer eklentileri
- custom startup script’leri olan container image’lar
- “bir zamanlar JVM’i hızlandırıyor” diye kalan argüman setleri

Spring’in kendisi çoğu yerde bu dönüşüme hazırlıklı olsa da, kurumsal projelerde çevreleyen kütüphaneler ve shell script’ler genellikle aynı disiplinde olmuyor.

## Trendler ve Sinyaller

### 1. Secure-by-default ve integrity-by-default çizgisi hızlanıyor

Boot’un SSL ve PRNG yamaları, Spring Security’nin matcher ve metadata doğrulama düzeltmeleri, JDK’nin final field mutation ve launcher option daraltmaları aynı ana mesaja çıkıyor: ekosistem, “eski rahatlıklar” yerine daha katı ama daha güvenli davranışları tercih ediyor.

### 2. Build-time üretim ve explicit konfigürasyon yükseliyor

[Spring Data AOT Repositories](https://www.baeldung.com/spring-data-aot-repositories) ile repository implementasyonunun build-time üretilmesi, [Spring Modulith](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released) ile modül sınırlarının kod seviyesinde görünür hale gelmesi ve JDK tarafında named group / mutation izinlerinin explicit olması aynı yönde ilerliyor: geç keşfedilen runtime sürprizleri yerine daha erken doğrulama.

### 3. Boot 4 dönemi sürüm uyumluluğunu aktif yönetim problemi yapıyor

[Spring Cloud proje sayfasındaki](https://spring.io/projects/spring-cloud) mevcut matris, `2025.1.x` satırını Boot `4.0.x` ile, `2025.0.x` satırını Boot `3.5.x` ile eşliyor. Yani Boot 4 pilotu açan ekipler için “uygun Cloud train”, “uygun Security line” ve “destek alan JDK” birlikte ele alınmalı; tekil dependency yükseltmeleri burada yeterli değil.

### 4. AI ve agent tarafında hype’tan ziyade protokol ve mimari disiplin öne çıkıyor

[InfoQ’nun MCP ve Java mimarisi yazısı](https://www.infoq.com/articles/mcp-java-architectural-strategy-llm-integrations/) doğrudan Spring AI duyurusu değil; ancak Java tarafında agent entegrasyonlarının framework büyüsünden çok protokol, tool governance ve context boundary meselesi haline geldiğini gösteriyor. Bu, dün öne çıkan Spring AI güvenlik sertleşmesiyle aynı uzun vadeli hatta oturuyor.

## Araçlar ve Kütüphaneler

- [Spring Modulith 2.1 RC1 / 2.0.6 / 1.4.11](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released): Düşük-orta öncelik. Event publication registry ve JobRunr integration iyileştirmeleri, modüler monolith stratejisini ciddiye alan ekipler için değerli.
- [Spring Data AOT Repositories](https://www.baeldung.com/spring-data-aot-repositories): Orta öncelik. Build-time generated repository implementasyonları Boot 4 ve native/AOT odağında izlenmeli; ama henüz her ekip için default tercih değil.
- [MCP ve Java mimarisi](https://www.infoq.com/articles/mcp-java-architectural-strategy-llm-integrations/): Düşük-orta öncelik. Özellikle Spring AI veya Java tabanlı tool-calling katmanları kuracak ekiplerde protokol tabanlı düşünmeyi teşvik ediyor.
- Bugün Micrometer, Reactor, Kubernetes Java client veya messaging altyapılarında aynı ağırlıkta yeni resmi üretim alarmı görünmedi. Bu alanlarda zayıf sinyalleri şişirmemek daha doğru.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Boot kullanan servislerde `random.*` kullanımını secret üretimi için tekrar denetleyin. Özellikle API key, token, invite code ve reset secret üretimi için bu pattern varsa doğrudan müdahale edin.
- RabbitMQ, Cassandra veya Elasticsearch için `SslBundle` kullanan Boot servislerinde hostname verification’ın gerçekten aktif olduğunu test edin; yalnız config review yeterli değil.
- DevTools remote restart kullanan ortamlarda bu özelliğin prod/staging’de kaldığını varsaymayın; pipeline, compose ve eski startup script’lerini tarayın.
- Spring Security 5.7, 5.8, 6.3 veya 6.4 hattında kalan servisleri “destek dışı güvenlik yüzeyi” olarak sınıflandırın. Teknik borç değil, platform riski.
- JDK 26/27 denemelerinde uygulama log’larında illegal final field mutation warning’lerini toplayın; bunlar ileride hata seviyesine dönecek migration borcudur.
- Dockerfile, Helm values, init script ve JVM arg dosyalarında `-noverify`, `-Xverify:none`, `-verifyremote`, `-noclassgc` kalıntılarını arayın.
- Boot 4 pilotu açıyorsanız Spring Cloud trenini bağımsız yükseltmeyin; `2025.1.x` ile `4.0.x` hizası korunmalı.

## Fırsatlar ve Riskler

- Fırsat: Güvenlik yamalarını yalnız “patch day” faaliyeti gibi değil, config/TLS/startup standartlarını topluca düzeltme fırsatı olarak kullanmak.
- Fırsat: JDK 27 post-quantum hibrit TLS testleri, kurum içi PKI ve network appliance envanterini görünür kılabilir.
- Fırsat: Spring Modulith ve AOT repository yaklaşımı, büyük ama tek deploy edilen sistemlerde startup ve modül sınırı disiplinini artırabilir.
- Risk: Boot patch’lerini küçük sürüm diye ertelemek, TLS ve random üretimi gibi görünmez ama pahalı güvenlik hatalarını açık bırakır.
- Risk: Spring Security destek bitişlerini yalnız “OSS detay” saymak, audit ve vulnerability management tarafında yanlış güvenlik hissi yaratır.
- Risk: JDK 26/27 geçişini yalnız bytecode uyumu olarak görmek, startup script ve reflection tabanlı yan kütüphanelerde sürpriz kırılımlar üretir.
- Risk: Spring Data AOT Repositories veya RC düzeyindeki Modulith özelliklerini geniş prod rollout ile denemek, erken özellik maliyetini artırabilir.

## İzlenmesi Gereken Konular

- 1-5 Haziran 2026 aralığına kayan Spring OSS release train’in özellikle Boot `4.1.x` ve Cloud/Security kombinasyonlarına nasıl yansıyacağı
- JDK 27 EA sürecinde `X25519MLKEM768` için middlebox ve load balancer ekosisteminden gelecek uyumluluk raporları
- JDK 26 final field mutation warnings’in hangi popüler mapper, serializer ve test araçlarında görünmeye başladığı
- Spring Data AOT Repositories’in resmi Spring dokümantasyonunda ve gerçek benchmark’larda ne kadar olgunlaşacağı
- Josh Long, Gunnar Morling ve Burak KUTBAY tarafında bu hafta güvenlik sertleşmesi, migration otomasyonu veya Boot 4 pratikleriyle ilgili yeni içerik gelip gelmeyeceği

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Boot 4.0.6 ve 3.5.14 çoklu güvenlik düzeltmeleri “küçük patch” değil
- source: [Spring Boot 4.0.6 available now](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now), [Spring Boot 3.5.14 available now](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now)
- author: Andy Wilkinson; Spring Security Advisory Team
- date: 23 Nisan 2026
- category: security, runtime, configuration
- tags: spring-boot, ssl, hostname-verification, actuator, devtools, prng, temp-dir, pid-file
- summary: Boot 4.0.6 ve 3.5.14 birden fazla güvenlik açığını birlikte kapatıyor; özellikle SSL bundle auto-configuration, `random.*`, DevTools ve Actuator yüzeylerinde etkili.
- why_it_matters: Bu açıklar uygulama business logic’inde değil, framework konfigürasyon ergonomisinde bulunuyor; dolayısıyla ekiplerin gözünden kaçma ihtimali yüksek.
- java_spring_relevance: Spring Boot kullanan tüm ekipler için yüksek; `SslBundle`, Actuator ve remote DevTools kullananlar için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Tek seferde TLS, startup ve config güvenliği standardını yükseltmek.
- risks: Patch’i ertelemek; starter güvenliğini varsayıp TLS doğrulamasını test etmemek.
- migration_notes: `random.*` ile üretilen secret benzeri alanlar incelenmeli. RabbitMQ, Cassandra ve Elasticsearch TLS istemcileri hostname verification testiyle doğrulanmalı.

### Bulgu 2

- title: Spring Security 2026.04 sürümleri hem açık kapatıyor hem destek dışı çizgileri netleştiriyor
- source: [Spring Security Releases](https://spring.io/blog/2026/04/21/spring-security-releases)
- author: Josh Cummings
- date: 21 Nisan 2026
- category: security, identity, support-policy
- tags: spring-security, x509, one-time-token, oauth2, oidc, path-matching, support
- summary: `6.5.10`, `7.0.5` ve `7.1.0-RC1` ile birden fazla güvenlik sorunu düzeltildi; aynı duyuruda 5.7, 5.8, 6.3 ve 6.4 OSS desteklerinin bittiği belirtildi.
- why_it_matters: Güvenlik ekosisteminde destek dışı kalmak çoğu zaman spesifik bir CVE’den daha büyük operasyonel risk oluşturur.
- java_spring_relevance: Spring Security ile authentication, authorization, OAuth2/OIDC veya X.509 yapan tüm servisler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Destek alan sürümlere geçerek güvenlik düzeltmelerini yeniden akışa almak.
- risks: Güvenlik hatlarını yamalamadan destek dışı dalda kalmak; path matcher ve metadata işleme gibi düşük görünürlüklü alanları kaçırmak.
- migration_notes: Sürüm kararı yalnız patch seviyesinde verilmemeli; destek alan çizgiye çıkış planı yapılmalı. RC hattı prod için değil, ileri test için düşünülmeli.

### Bulgu 3

- title: JDK 27, post-quantum hibrit TLS anahtar değişimini varsayılan yapıyor
- source: [JEP 527: Post-Quantum Hybrid Key Exchange for TLS v1.3](https://openjdk.org/jeps/527), [Inside Java Newscast #112](https://inside.java/2026/05/14/newscast-112/), [Quality heads-up for JDK 27 changes](https://inside.java/2026/05/17/quality-heads-up/)
- author: Jamil Nimeh, Ana-Maria Mihalceanu, Nicolai Parlog
- date: 14-17 Mayıs 2026
- category: jdk, security, tls
- tags: jdk27, tls13, post-quantum, ml-kem, x25519mlkem768, mTLS
- summary: JDK 27, `X25519MLKEM768` hibrit anahtar değişimini varsayılan named group listesine ekliyor; amaç post-quantum hazırlığını klasik TLS ile uyumlu başlatmak.
- why_it_matters: Uygulama kodu değişmese bile TLS handshake boyutu, appliance uyumu ve proxy davranışı değişebilir.
- java_spring_relevance: Spring Boot tabanlı HTTP client/server, Kafka, AMQP, JDBC-over-TLS ve service mesh kullanan ekipler için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Geleceğe dönük kriptografi hazırlığını erkenden test etmek; network zincirindeki görünmez bağımlılıkları açığa çıkarmak.
- risks: Middlebox uyumsuzlukları, beklenmedik handshake hataları ve performans varyasyonları.
- migration_notes: JDK 27 EA ile staging testleri açılmalı. Gerekirse named group override stratejisi belgelenmeli; ancak kalıcı çözüm olarak değil geçiş aracı olarak düşünülmeli.

### Bulgu 4

- title: JDK 26 final field mutation uyarıları reflection tabanlı kodu görünür biçimde baskılıyor
- source: [JEP 500: Prepare to Make Final Mean Final](https://openjdk.org/jeps/500), [Inside Java - Final field mutation restrictions in JDK 26](https://inside.java/2026/05/15/final-field-mutation-jdk26/)
- author: Ron Pressler, Alex Buckley, Billy Korando
- date: 15 Mayıs 2026
- category: jdk, compatibility, runtime-integrity
- tags: jdk26, reflection, final-field, serialization, frameworks, warnings
- summary: JDK 26, reflection ile `final` field mutate eden kodlarda uyarı üretmeye başlıyor; sonraki adım hata seviyesine gidişin yolu olarak tanımlanıyor.
- why_it_matters: Birçok eski framework uzantısı ve yardımcı kütüphane bu davranışa sessizce dayanıyor; uyarılar gelecek kırılımların erken habercisi.
- java_spring_relevance: Spring tabanlı servislerde doğrudan framework çekirdeğinden çok çevresel mapper, serializer, test utility ve legacy entegrasyon katmanları için önemli.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Reflection tabanlı gizli bağımlılıkları temizlemek; immutable model tasarımını gerçekten uygulamak.
- risks: JDK yükseltmesi sonrası log kirliliği, gelecekte runtime error’a dönüşecek davranışlar, üretim-debug ayrışması.
- migration_notes: JDK 26 testlerinde warning’ler merkezi toplanmalı. `--illegal-final-field-mutation` yalnız geçici teşhis aracı olarak kullanılmalı; kalıcı çözüm kodun veya kütüphanenin uyarlanması.

### Bulgu 5

- title: JDK 27, eski launcher option’ları fiilen kırıyor
- source: [Quality heads-up for JDK 27 changes](https://inside.java/2026/05/17/quality-heads-up/)
- author: Billy Korando
- date: 17 Mayıs 2026
- category: operations, ci-cd, runtime
- tags: jdk27, jvm-args, docker, startup-scripts, noverify, xverify
- summary: `-noclassgc`, `-verifyremote`, `-noverify` ve `-Xverify:none` seçenekleri JDK 27’de artık hata oluşturacak; sessizce kabul edilme dönemi kapanıyor.
- why_it_matters: Sorun uygulama kodunda değil, çoğu zaman yıllardır kopyalanan Dockerfile, init script ve JVM arg setlerinde ortaya çıkacak.
- java_spring_relevance: Container tabanlı Spring Boot servisleri ve kurumsal Java runtime standardı olan ekipler için orta-yüksek.
- actionability: izle_ve_test_et
- impact_level: orta-yüksek
- opportunities: JVM başlangıç parametrelerini sadeleştirmek ve gerçek ihtiyaçları yeniden belgelendirmek.
- risks: JDK 27 geçişinde beklenmedik startup failure; eski Helm chart veya argfile kalıntılarının prod rollout’u bozması.
- migration_notes: Kod yerine repo çapında `rg 'noverify|verifyremote|noclassgc|Xverify:none'` benzeri taramalar öncelik olmalı. Base image ve launcher script katmanı birlikte gözden geçirilmeli.

### Bulgu 6

- title: Spring Cloud 2025.1.1 uyumluluk matrisi Boot 4 geçişini bağımlı karar haline getiriyor
- source: [Spring Cloud project page](https://spring.io/projects/spring-cloud)
- author: Spring Team
- date: 18 Mayıs 2026 itibarıyla proje sayfası
- category: compatibility, cloud, migration
- tags: spring-cloud, oakwood, northfields, spring-boot-4, bom, support
- summary: Mevcut proje sayfası `2025.1.1` sürümünü güncel hat olarak gösteriyor ve `2025.1.x` train’ini Boot `4.0.x`, `2025.0.x` train’ini Boot `3.5.x` ile eşliyor; daha eski train’lerin çoğu EOL.
- why_it_matters: Spring Cloud yükseltmesi bağımsız bir karar değil; Boot çizgisiyle senkron yönetilmesi gereken bir platform bağımlılığı.
- java_spring_relevance: Spring Cloud Config, Gateway, OpenFeign, Stream, CircuitBreaker veya LoadBalancer kullanan ekipler için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: BOM disiplinini güçlendirmek ve upgrade lane’leri daha temiz ayırmak.
- risks: Boot 4 pilotu açıp eski Cloud train ile devam etmeye çalışmak; destek ve compatibility sınırlarını ihlal etmek.
- migration_notes: `2025.1.x` pilotları ayrı lane’de yürütülmeli. Cloud ve Boot versiyonları tek backlog maddesi olarak ele alınmalı.

### Bulgu 7

- title: Spring Modulith 2.1 RC1, modüler monolith yaklaşımını düşük gürültüyle olgunlaştırıyor
- source: [Spring Modulith 2.1 RC1, 2.0.6 and 1.4.11 released](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released)
- author: Oliver Drotbohm
- date: 24 Nisan 2026
- category: architecture, tooling
- tags: spring-modulith, modular-monolith, jobrunr, events, transaction-boundary
- summary: Spring Modulith yeni RC ve patch sürümleriyle event publication registry ve JobRunr tabanlı senaryolarda iyileştirmeler getiriyor. Bu, mikrosservis olmayan ama modül sınırı güçlü sistemler için sessizce değer üretiyor.
- why_it_matters: Her dağıtık problem mikroservis gerektirmiyor; modulith yaklaşımı ekipler için daha düşük operasyon maliyetiyle güçlü sınırlar sunabilir.
- java_spring_relevance: Özellikle çok modüllü Spring Boot monolith veya aşamalı ayrıştırma yapan ekipler için orta.
- actionability: izle_ve_pilotla
- impact_level: orta
- opportunities: İş akışlarını tek deploy içinde tutup mimari sınırları kod seviyesinde test etmek.
- risks: RC hattını doğrudan prod standardı yapmak; mikroservis problemini yalnız packaging kararı sanmak.
- migration_notes: 2.1 RC1 araştırma/pilot için uygun, geniş prod rollout için 2.0.x stabil hattı daha güvenli. JobRunr ve event publication entegrasyonları olan ekipler önce burada test etmeli.

### Bulgu 8

- title: Spring Data AOT Repositories, repository katmanını build-time’a çekme yönünü güçlendiriyor
- source: [Spring Data AOT Repositories - Baeldung](https://www.baeldung.com/spring-data-aot-repositories)
- author: belirtilmemiş
- date: Mayıs 2026
- category: performance, developer-productivity, aot
- tags: spring-data, aot, repositories, build-time, startup, boot4
- summary: Yeni yaklaşım repository implementasyonlarını çalışma anında proxy üretmek yerine derleme sırasında oluşturarak compile-time doğrulama ve daha iyi startup süresi hedefliyor.
- why_it_matters: Bu yönelim, Boot 4 ve native/AOT odaklı sistemlerde runtime sürprizlerini azaltabilir; ancak build maliyeti ve olgunluk seviyesi dikkatle değerlendirilmeli.
- java_spring_relevance: Spring Data JPA/Mongo/Reactive repository kullanan ve startup performansını önemseyen ekipler için orta.
- actionability: pilot
- impact_level: orta
- opportunities: Daha hızlı cold start, daha erken query hatası yakalama, native image senaryolarında daha net davranış.
- risks: Makaledeki benchmark’ların ortam bağımlı olması; build sürelerinin uzaması; henüz her repo deseni için aynı kazancın görülmemesi.
- migration_notes: Üretim kararı vermeden önce kurum içi benchmark yapılmalı. Özellikle CI süresi, incremental build etkisi ve repository karmaşıklığı birlikte ölçülmeli.

### Bulgu 9

- title: MCP, Java tarafında framework trendi değil mimari arayüz kararı olarak şekilleniyor
- source: [MCP and Java: Architectural Strategy for LLM Integrations - InfoQ](https://www.infoq.com/articles/mcp-java-architectural-strategy-llm-integrations/)
- author: Frank Greco
- date: 12 Mayıs 2026
- category: ai, architecture, integration
- tags: mcp, java, spring-ai, tool-calling, governance, protocol
- summary: InfoQ analizi, Java ekosisteminde MCP’nin yalnız yeni bir SDK merakı değil; araç, bağlam ve güvenlik sınırlarını standardize eden mimari karar olarak ele alınması gerektiğini savunuyor.
- why_it_matters: Java ve Spring ekipleri agent/tool-calling tarafına girerken asıl maliyet model entegrasyonundan çok erişim sınırı, auditability ve tool governance’de oluşuyor.
- java_spring_relevance: Spring AI, Java SDK veya kurum içi agent altyapısı kuracak ekipler için orta; klasik CRUD servisler için düşük.
- actionability: düşük_öncelik_ama_izle
- impact_level: düşük-orta
- opportunities: Erken standardizasyon ile vendor-lock ve tool karmaşasını azaltmak.
- risks: Henüz problem olgunlaşmadan aşırı soyutlama üretmek; protokol trendini ürün ihtiyacının önüne koymak.
- migration_notes: Bu bulgu hemen implementasyon çağrısı değil. Ancak Spring AI veya agent katmanı planlayan ekipler protokol seviyesinde karar almalı, framework seviyesinde değil.

## Sonuç

Bugünün en güçlü sinyali “yeni bir parlak framework” değil; güvenlik, bütünlük ve uyumluluk disiplininin sertleşmesi. Spring Boot ve Spring Security tarafında geciktirilmemesi gereken yamalar ve destek penceresi kararları var. JDK 26 ve 27 tarafı ise legacy reflection alışkanlıklarını, eski JVM argümanlarını ve network/TLS zincirlerini görünür biçimde sınamaya başlıyor.

Kısa vadede en doğru hareket üç parçalı: Boot/Security patch ve support envanterini netleştirmek, JDK 26/27 laboratuvar testlerinde warning ve startup arg kırılımlarını toplamak, Boot 4 pilotlarını Spring Cloud uyumluluk matrisiyle birlikte yönetmek. Düşük öncelikli ama uzun vadede değer üretebilecek sinyaller ise Modulith, AOT repositories ve MCP tarafında build-time/protokol odaklı mimari disiplin olarak izlenmeli.
