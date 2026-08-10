# Günlük Java / Spring Ekosistem Raporu

Tarih: 10 Ağustos 2026 Pazartesi  
Tarama zamanı: 10 Ağustos 2026 09:08 TSİ  
Odak: TLS, trust store ve sertifika malzemesinin Java ve Spring tarafında bağımsız ayar olmaktan çıkıp sürümlenen deployment sözleşmesine dönüşmesi

Tarama notu: 10 Ağustos 2026 09:08 TSİ itibarıyla [Spring Blog](https://spring.io/blog), [Spring release sayfaları](https://spring.io/blog/category/releases), [Spring proje sayfaları](https://spring.io/projects), [Spring Boot SSL dokümantasyonu](https://docs.spring.io/spring-boot/reference/features/ssl.html), [Spring Boot REST client dokümantasyonu](https://docs.spring.io/spring-boot/reference/io/rest-client.html), [Spring Boot Actuator metrics dokümantasyonu](https://docs.spring.io/spring-boot/reference/actuator/metrics.html), [Spring Boot development-time services dokümantasyonu](https://docs.spring.io/spring-boot/reference/features/dev-services.html), [Spring Boot endpoints dokümantasyonu](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html), [Spring Boot AMQP dokümantasyonu](https://docs.spring.io/spring-boot/reference/messaging/amqp.html), [Spring Cloud Gateway MVC TLS/SSL dokümantasyonu](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway-server-webmvc/tls-and-ssl.html), [Spring Cloud Gateway WebFlux TLS/SSL dokümantasyonu](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway-server-webflux/tls-and-ssl.html), [Inside Java akışı](https://inside.java/feed.xml), [Inside Java PQC yazısı](https://inside.java/2026/08/07/post-quantum-cryptography-in-long-term-support-jdk-releases/), [OpenJDK JEP 527](https://openjdk.org/jeps/527), [OpenJDK Quality Outreach: JDK 28 cacerts jlink plugin](https://inside.java/2026/07/28/quality-heads-up/), [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases), [Oracle Java Releases Public APIs](https://blogs.oracle.com/java/oracle-java-releases-public-apis), Josh Long’un [This Week in Spring - August 4th, 2026](https://spring.io/blog/2026/08/04/this-week-in-spring-august-4-2026/) ve [A Bootiful Podcast: Gregory Green](https://spring.io/blog/2026/08/06/a-bootiful-podcast-gregory-green) paylaşımları, [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), Gunnar Morling’in kamusal yüzeyi ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. 10 Ağustos 2026 itibarıyla yeni büyük Spring GA dalgası görünmüyor; güçlü sinyal yeni sürüm değil, güvenli iletişim ve trust yönetiminin framework ile runtime boyunca daha açık ve ölçülebilir hale gelmesi.

## Öne Çıkan Başlıklar

- OpenJDK [JEP 527](https://openjdk.org/jeps/527), TLS 1.3 için post-quantum hibrit anahtar değişimini `javax.net.ssl` kullanan mevcut uygulamalara varsayılan olarak taşıyor; JDK 27 ile kod değiştirmeden kazanım hedefleniyor.
- OpenJDK tarafında [JDK-8377102](https://bugs.openjdk.org/browse/JDK-8377102) ile `jlink` için yeni `cacerts` eklentisinin JDK 28’e sabitlendiği görülüyor; özel runtime imajlarındaki CA seti artık bilinçli tasarım kararı olacak.
- Spring Boot 4.1, `spring.ssl.bundle` ile JKS/PKCS12 ve PEM trust malzemesini isimli bundle’lar halinde topluyor; aynı bundle hem sunucu, hem `WebClient`/`RestClient`, hem de mesajlaşma ve gRPC bağlantılarında kullanılabiliyor.
- Spring Boot Actuator, `ssl.chain.expiry` metriği ve `SslInfoContributor` ile sertifika son kullanımı ve bundle görünürlüğünü operasyona taşıyor; TLS artık yalnız bağlantı kurulursa “çalışıyor” denilen bir alan değil.
- Spring Cloud Gateway dokümantasyonu, MVC tarafında proje-özel TLS ayarını Boot’un genel `spring.http.client.ssl.bundle` yüzeyine doğru topluyor; WebFlux tarafı ise `useInsecureTrustManager` seçeneğinin üretim için uygun olmadığını açıkça söylüyor.

## Kritik Güncellemeler

### 1. JDK 27 yolunda post-quantum hibrit TLS varsayılan fayda olarak geliyor

[JEP 527](https://openjdk.org/jeps/527), TLS 1.3 için ML-KEM ile klasik ECDHE’yi birleştiren hibrit anahtar değişimlerini JDK’nin TLS katmanına eklemeyi hedefliyor. JEP metni, `javax.net.ssl` kullanan uygulamaların mevcut kodlarını değiştirmeden bundan yararlanacağını; istemci tarafında `X25519MLKEM768` adlı hibrit grubun varsayılan tercih sırasının başına alınacağını söylüyor.

Bu kritik çünkü:

- kuantum dayanımlı geçiş “ileride eklenir” diye ertelenen araştırma konusu olmaktan çıkıp standart Java TLS davranışına yaklaşıyor
- `jdk.tls.namedGroups` veya kütüphane düzeyinde sert pinleme yapan ekipler, istemeden bu varsayılan kazancı devre dışı bırakabilir

### 2. `jlink --cacerts` ile runtime trust store küçültme artık resmi yol haline geliyor

[Inside Java Quality Outreach notu](https://inside.java/2026/07/28/quality-heads-up/) ve [JDK-8377102](https://bugs.openjdk.org/browse/JDK-8377102), JDK 28 için `cacerts jlink plugin` geliştirmesinin `Fixed` durumunda olduğunu gösteriyor. Açıklanan davranış, özel runtime imajına yalnız uygulamanın ihtiyaç duyduğu CA sertifikalarının eklenebilmesini sağlıyor.

Bu Java/Spring ekipleri için önemli:

- distroless ya da jlink tabanlı image üreten ekipler artık trust store’u sadece “JVM ile gelen dosya” gibi ele alamaz
- CA azaltımı güvenlik yüzeyini küçültür, ancak eksik kök sertifika veya yanlış environment ayrımı üretimde kesinti yaratabilir

### 3. Spring Boot 4.1 SSL bundle’ları merkezi trust sözleşmesine dönüştürüyor

[Spring Boot SSL referansı](https://docs.spring.io/spring-boot/reference/features/ssl.html), `spring.ssl.bundle` altında isimli trust malzemesi tanımlamayı; bunların `SslBundles` bean’i üzerinden `KeyStore`, `TrustManagerFactory` veya doğrudan `SSLContext` olarak kullanılmasını destekliyor. Aynı doküman, bundle’ların JKS/PKCS12 ya da PEM tabanlı tanımlanabildiğini ve client-side bağlantılarda doğrudan trust store olarak uygulanabildiğini gösteriyor.

Bu önemli çünkü:

- uygulama içindeki her istemci için ayrı ayrı `javax.net.ssl.trustStore` veya özel fabrika kodu yazma ihtiyacı azalıyor
- trust yönetimi artık application-level adlandırılmış bileşenler üzerinden yapılabildiği için audit ve refactor daha yönetilebilir hale geliyor

### 4. TLS malzemesi sadece konfigürasyon değil, gözlemlenebilir runtime durumu haline geliyor

[Spring Boot metrics dokümantasyonu](https://docs.spring.io/spring-boot/reference/actuator/metrics.html), `ssl.chain.expiry` metriğinin keystore ve truststore zincirlerindeki en erken bitecek sertifikayı yayınladığını söylüyor. [Endpoints dokümantasyonu](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html) ise `info` endpoint’inin SSL bundle sertifika bilgisini yayınlayabildiğini ve `SslInfoContributor` bulunduğunu belirtiyor. [SSL referansı](https://docs.spring.io/spring-boot/reference/features/ssl.html) ayrıca PEM bundle’larda `reload-on-update=true` ile Tomcat ve Netty tarafında restart’sız sertifika yenilemeye izin veriyor.

Buradaki güçlü sinyal:

- sertifika bitişi ve yenileme davranışı artık dış sistem script’lerinden çok framework içinden ölçülebilir
- Let’s Encrypt veya benzeri otomatik yenileme süreçleri için “restart gerekiyor mu?” sorusu bazı tüketicilerde ortadan kalkıyor

### 5. Spring’in client ve gateway yüzeyleri ortak TLS diline yaklaşıyor

[Spring Boot REST client referansı](https://docs.spring.io/spring-boot/reference/io/rest-client.html), `WebClientSsl` ve `RestClientSsl` üzerinden aynı isimli SSL bundle’ın `WebClient`, `RestClient` ve dolaylı olarak diğer HTTP client yapılandırmalarına uygulanabildiğini gösteriyor. [Spring Cloud Gateway MVC dokümantasyonu](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway-server-webmvc/tls-and-ssl.html), `spring.cloud.gateway.mvc.http-client.ssl-bundle` alanının 4.2.0’dan beri `spring.http.client.ssl.bundle` lehine deprecated olduğunu açıkça yazıyor. [Gateway WebFlux dokümantasyonu](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway-server-webflux/tls-and-ssl.html) ise `useInsecureTrustManager: true` seçeneğinin üretim için uygun olmadığını söyleyip bilinen sertifikaları tanımlamayı öneriyor.

Bu mimari açıdan önemli:

- edge katmanı, servis istemcileri ve framework çekirdeği tek bir TLS sözlüğüne doğru ilerliyor
- “testte herkes her şeye güvensin” yaklaşımı artık resmi dokümantasyonda açıkça kırmızı bayrak olarak gösteriliyor

## Trendler ve Sinyaller

### Trend Kümesi 1: Trust store artık JVM detayı değil, platform artefaktı

[JEP 527](https://openjdk.org/jeps/527), [JDK-8377102](https://bugs.openjdk.org/browse/JDK-8377102) ve [Spring Boot SSL bundle referansı](https://docs.spring.io/spring-boot/reference/features/ssl.html) birlikte okunduğunda aynı desen çıkıyor:

- TLS algoritması daha çevik hale geliyor
- CA seti daha daraltılabilir hale geliyor
- uygulamanın hangi trust malzemesiyle konuştuğu daha açık bir sözleşmeye bağlanıyor

Bu kısa vadeli gürültü değil; doğrudan container image, runtime davranışı ve sertifika operasyonu üzerinde kalıcı etkisi var.

### Trend Kümesi 2: Spring TLS’i sunucu ayarı olmaktan çıkarıp tüm bağlantı yüzeyine yayıyor

Bugünün en değerli Spring sinyali yeni bir starter değil. Daha önemli olan, aynı SSL bundle modelinin aşağıdaki yüzeylerde görünmesi:

- embedded web server
- `WebClient`, `RestClient`, `RestTemplate` altyapısı
- Spring Cloud Gateway
- RabbitMQ Streams
- gRPC
- Docker Compose service connections

Bu, Spring ekiplerinin güvenli bağlantıyı yan konu değil platform seviyesi çapraz kesen bir kabiliyet olarak ele aldığını gösteriyor.

### Trend Kümesi 3: Operasyonel doğrulama sertifika yenileme kadar önemli hale geliyor

`ssl.chain.expiry`, `SslInfoContributor`, reloadable bundle’lar ve gateway handshake timeout yüzeyleri birlikte şu mesajı veriyor:

- sertifikanın varlığı yetmez
- biteceği zaman, kim tarafından kullanıldığı ve yenilendiğinde uygulamanın nasıl davrandığı da izlenmelidir

Yani bu alan artık yalnız security ekibinin değil, platform ve servis ownership ekiplerinin günlük backlog’una giriyor.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: isimli SSL bundle’ları servisler arası güven sınırlarına göre standardize etmek
- Kalıcı değer: JDK 27 öncesi `jdk.tls.namedGroups`, özel `SSLContext` ve trust store override’larını envanterlemek
- Kalıcı değer: jlink kullanan imajlarda CA allow-list stratejisi oluşturmak
- Düşük öncelik: gateway üzerinde `useInsecureTrustManager` ile geçici test çözümünü kalıcıya çevirmek
- Düşük öncelik: sertifika yenilemesini “dosya değiştiyse tamamdır” seviyesinde bırakmak, expiry metriği ve handshake doğrulaması yapmamak

## Araçlar ve Kütüphaneler

- [Spring Boot SSL Bundles](https://docs.spring.io/spring-boot/reference/features/ssl.html): JKS/PKCS12 ve PEM tabanlı isimli trust/key bundle modeli.
- [Spring Boot RestClient/WebClient SSL desteği](https://docs.spring.io/spring-boot/reference/io/rest-client.html): `WebClientSsl`, `RestClientSsl` ve `HttpClientSettings` ile ortak TLS uygulama modeli.
- [Spring Boot Actuator SSL metrics](https://docs.spring.io/spring-boot/reference/actuator/metrics.html): `ssl.chain.expiry` metriği ile sertifika son kullanımı görünürlüğü.
- [Spring Boot Dev Services SSL desteği](https://docs.spring.io/spring-boot/reference/features/dev-services.html): Cassandra, Elasticsearch, MongoDB, RabbitMQ, RabbitMQ Streams ve Redis için SSL bundle tabanlı bağlantı etiketleri.
- [Spring Cloud Gateway TLS/SSL](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway-server-webmvc/tls-and-ssl.html): gateway istemcilerini Boot’un ortak SSL bundle yüzeyine yaklaştıran dokümantasyon.
- [OpenJDK JEP 527](https://openjdk.org/jeps/527): Java TLS katmanında post-quantum hibrit anahtar değişimi.
- [JDK-8377102](https://bugs.openjdk.org/browse/JDK-8377102): JDK 28 için `cacerts jlink plugin`.

Bugün yeni framework ismi ya da yeni hype kütüphanesi tarafında daha güçlü bir sinyal yok. Değerli yenilik, mevcut yığının daha açık güven sözleşmeleri üretmesi.

## Java / Spring Geliştiricileri İçin Etkiler

- `javax.net.ssl.trustStore` gibi global JVM ayarlarını nerede hâlâ kullandığınızı envanterleyin; bunların hangileri bundle modeline taşınabilir bakın.
- `WebClient`, `RestClient`, gateway, gRPC ve broker bağlantıları için trust sınırlarını domain bazlı isimli bundle’lara bölün. Tek büyük trust store yaklaşımı audit ve blast radius açısından zayıf kalıyor.
- Eğer `jdk.tls.namedGroups` ya da düşük seviye TLS pinleme kullanıyorsanız, JDK 27 ile gelecek hibrit varsayılanı bilerek mi engellediğinizi doğrulayın.
- PEM tabanlı bundle + `reload-on-update` akışı, restart’sız sertifika yenilemesi için pratik değer taşıyor; özellikle ingress arkasında fakat yine de doğrudan TLS sonlandıran Spring servislerinde pilot uygun.
- `management.info.ssl.enabled=true` ve `ssl.chain.expiry` izleme entegrasyonu, sertifika bitişlerinin “bize PagerDuty geldiğinde fark ederiz” modelinden çıkması için düşük maliyetli adım.
- jlink ya da özel JRE image kullanan ekipler, CA azaltımını güvenlik başarısı sanıp test matrisini küçültmemeli; staging/prod ayrışan kurumsal kök sertifikalar çoğu zaman asıl risk noktasıdır.

## Fırsatlar ve Riskler

- Fırsat: JDK 27 ile mevcut Java TLS istemcilerinde kod değiştirmeden daha dayanıklı anahtar değişimi elde etmek
- Fırsat: SSL bundle’lar sayesinde HTTP, gateway, broker ve gRPC istemcilerinde ortak güven sözleşmesi kurmak
- Fırsat: `ssl.chain.expiry` ve `SslInfoContributor` ile sertifika takibini build-time kontrol listesinden runtime görünürlüğe taşımak
- Fırsat: `jlink --cacerts` yaklaşımıyla daraltılmış kurumsal runtime imajları üretmek
- Risk: `namedGroups` pinleme, eski reverse proxy davranışları veya middlebox’lar nedeniyle hibrit TLS geçişinde beklenmeyen handshake sorunları yaşamak
- Risk: CA allow-list’i aşırı daraltıp yalnız bazı environment’larda görünen outbound TLS hataları üretmek
- Risk: gateway veya test profillerinde `useInsecureTrustManager` kalıntılarını üretime taşımak
- Risk: Sertifika yenilemesini dosya güncellendi diye tamam sayıp uygulama tarafında reload ve handshake sonuçlarını gözlemlememek

## İzlenmesi Gereken Konular

- [JEP 527](https://openjdk.org/jeps/527) JDK 27 finaline yaklaşırken varsayılan named group sırası veya uyumluluk notlarında değişiklik olup olmayacağı
- [JDK-8377102](https://bugs.openjdk.org/browse/JDK-8377102) etrafında buildpack, jlink ve kurumsal base image üreticilerinin ne kadar hızlı örnek akış yayımlayacağı
- Spring Cloud’un diğer istemci yüzeylerinde de Boot’un ortak `spring.http.client.ssl.bundle` modeline daha fazla yakınsayıp yakınsamayacağı
- `ssl.chain.expiry` ve `SslInfoContributor` kullanımının Micrometer dashboard, alert ve operasyon runbook’larına ne kadar hızlı gireceği
- Düşük öncelik: Josh Long’un 6 Ağustos 2026 tarihli Gregory Green bölümü veri platformu, RabbitMQ Streams ve Valkey açısından ilginç; ancak bugünün ana kararını değiştiren sinyal güvenli bağlantı standardizasyonu olduğu için ikinci planda

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: JDK 27, post-quantum hibrit TLS’i varsayılan istemci yoluna taşıyor
- `source`: [OpenJDK JEP 527](https://openjdk.org/jeps/527) | [Inside Java PQC yazısı](https://inside.java/2026/08/07/post-quantum-cryptography-in-long-term-support-jdk-releases/)
- `author`: OpenJDK Security Libraries contributors | Oracle Java team
- `date`: 10 Ağustos 2026 itibarıyla güncel JEP ve 7 Ağustos 2026 Inside Java yazısı
- `category`: security, jdk-runtime
- `tags`: jdk27, tls13, pqc, ml-kem, named-groups, javax-net-ssl
- `summary`: JEP 527, TLS 1.3 için ML-KEM ve ECDHE birleşimli hibrit anahtar değişimini JDK’ya ekliyor ve istemci tarafında `X25519MLKEM768` grubunu varsayılan tercih sırasının başına getiriyor.
- `why_it_matters`: Java istemcileri için kuantum dayanımlı geçiş kod değişikliği gerektirmeden standart runtime davranışına dönüşüyor.
- `java_spring_relevance`: Spring Boot servisleri çoğu zaman JDK’nin TLS katmanına dayanır; outbound HTTPS, gateway, broker ve servis çağrıları doğrudan etkilenir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: harvest-now-decrypt-later riskine karşı daha iyi duruş; mevcut kodu koruyarak TLS güçlendirme
- `risks`: `jdk.tls.namedGroups` pinleme; eski TLS altyapısıyla handshake uyumsuzluğu
- `migration_notes`: TLS named group override’larını ve özel `SSLContext` kurulumlarını envanterleyin; JDK 27 EA/GA öncesi staging handshake testleri planlayın.

### Bulgu 2

- `title`: JDK 28 için `cacerts jlink plugin` sabitlenmiş görünüyor
- `source`: [Inside Java Quality Outreach](https://inside.java/2026/07/28/quality-heads-up/) | [JDK-8377102](https://bugs.openjdk.org/browse/JDK-8377102)
- `author`: OpenJDK Quality Group | OpenJDK contributors
- `date`: 28 Temmuz 2026 | 10 Ağustos 2026 itibarıyla bug durumu `Fixed`
- `category`: platform-engineering, runtime-packaging
- `tags`: jlink, cacerts, custom-runtime, truststore, jdk28, distroless
- `summary`: Yeni `jlink` eklentisi, özel runtime image içine yalnız ihtiyaç duyulan CA sertifikalarının alınabilmesini hedefliyor ve ilgili geliştirme JDK 28 için `Fixed` durumda.
- `why_it_matters`: Trust store seçimi ilk kez belirgin biçimde runtime image tasarımının bir parçası oluyor.
- `java_spring_relevance`: Spring Boot servislerini jlink veya özel JRE ile paketleyen ekiplerde outbound TLS başarısı artık image içeriğine doğrudan bağlı hale geliyor.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: daha küçük güven yüzeyi; daha kontrollü kurumsal CA dağıtımı; daha ince base image’lar
- `risks`: eksik kök sertifika; environment’a göre farklı CA ihtiyacı; staging/prod drift
- `migration_notes`: bugün jlink kullanmıyorsanız bile trust store kaynaklarını kataloglayın; kullanan ekiplerde CA allow-list testlerini pipeline’a koyun.

### Bulgu 3

- `title`: Spring Boot 4.1, SSL bundle’ları merkezi trust sözleşmesi olarak konumluyor
- `source`: [Spring Boot SSL](https://docs.spring.io/spring-boot/reference/features/ssl.html) | [Spring Boot REST clients](https://docs.spring.io/spring-boot/reference/io/rest-client.html)
- `author`: Spring Boot team
- `date`: 10 Ağustos 2026 itibarıyla güncel referans dokümantasyonu
- `category`: spring-boot, security-configuration
- `tags`: spring-ssl-bundle, jks, pkcs12, pem, webclient, restclient, sslcontext
- `summary`: `spring.ssl.bundle` ile isimli JKS/PKCS12 veya PEM bundle’lar tanımlanabiliyor; `SslBundles` bean’i ve `WebClientSsl`/`RestClientSsl` üzerinden aynı trust malzemesi farklı istemci yüzeylerine uygulanabiliyor.
- `why_it_matters`: TLS yapılandırması kopyala-yapıştır factory kodundan çıkıp yeniden kullanılabilir, adlandırılmış bir domain modeline dönüşüyor.
- `java_spring_relevance`: Mikroservis, gateway ve entegrasyon servislerinde outbound TLS yönetimi sadeleşiyor; global JVM ayarına bağımlılık azalıyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: ortak TLS standardı; kod sadeleşmesi; environment bazlı güven sınırı tanımı
- `risks`: tek bundle’a aşırı yüklenme; yanlış bundle ismi veya yanlış trust sınırı nedeniyle bağlantı sorunları
- `migration_notes`: servis istemcilerini iş alanı veya güven sınırına göre ayrı bundle’lara bölün; legacy `RestTemplate` ve yeni `RestClient` geçişini aynı anda temizleyin.

### Bulgu 4

- `title`: Spring Boot, sertifika ömrünü ve yenilemeyi operasyon yüzeyine taşıyor
- `source`: [Spring Boot SSL](https://docs.spring.io/spring-boot/reference/features/ssl.html) | [Spring Boot Metrics](https://docs.spring.io/spring-boot/reference/actuator/metrics.html) | [Spring Boot Endpoints](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html)
- `author`: Spring Boot team
- `date`: 10 Ağustos 2026 itibarıyla güncel referans dokümantasyonu
- `category`: observability, security-operations
- `tags`: ssl-chain-expiry, sslinfo, certificate-rotation, lets-encrypt, tomcat, netty
- `summary`: PEM bundle’lar `reload-on-update` ile Tomcat ve Netty tarafında yeniden yüklenebiliyor; Actuator `ssl.chain.expiry` metriği ile sertifika son kullanımı, `SslInfoContributor` ile de sertifika bilgisi görülebiliyor.
- `why_it_matters`: Sertifika yönetimi restart ve manuel kontrol bağımlılığından çıkarak ölçülebilir operasyon akışına yaklaşıyor.
- `java_spring_relevance`: Kendi TLS sonlandırmasını yapan ya da iç ağda mTLS kullanan Spring servisleri için doğrudan runtime avantajı var.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: restart’sız sertifika rotasyonu; erken uyarı; TLS sağlığını dashboard’a taşıma
- `risks`: reload’u desteklemeyen tüketicilerde yanlış beklenti; `info` endpoint’ini gereğinden fazla açığa çıkarmak
- `migration_notes`: üretim ortamında expiry alarmı tanımlayın; `management.info.ssl.enabled` kullanımında endpoint erişimini Spring Security veya ağ katmanıyla sınırlandırın.

### Bulgu 5

- `title`: Spring Boot dev services ve mesajlaşma yüzeyleri SSL bundle modeline bağlanıyor
- `source`: [Spring Boot Development-time Services](https://docs.spring.io/spring-boot/reference/features/dev-services.html) | [Spring Boot AMQP](https://docs.spring.io/spring-boot/reference/messaging/amqp.html) | [Spring Boot gRPC](https://docs.spring.io/spring-boot/reference/io/grpc.html)
- `author`: Spring Boot team
- `date`: 10 Ağustos 2026 itibarıyla güncel referans dokümantasyonu
- `category`: developer-productivity, messaging, platform-engineering
- `tags`: docker-compose, rabbitmq-streams, grpc, redis, mongodb, cassandra, sslbundle
- `summary`: Docker Compose service connection’larda SSL etiketleri; RabbitMQ Streams için `spring.rabbitmq.stream.ssl.bundle`; gRPC sunucular için `spring.grpc.server.ssl.bundle` desteği aynı güven modelini geliştirme ve entegrasyon akışına yayıyor.
- `why_it_matters`: Geliştirme, test ve üretim arasında farklı TLS kurulumları taşımak yerine aynı modelle ilerlemek mümkün oluyor.
- `java_spring_relevance`: Olay güdümlü sistemler, broker kullanan servisler ve iç RPC katmanları için konfigürasyon uyumu artıyor.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: dev/prod TLS parity; daha az el yapımı test ayarı; standart bağlantı sözleşmesi
- `risks`: Compose etiketlerinin gerçek üretim güvenlik politikasıyla karıştırılması; demo sertifikalarının yanlış taşınması
- `migration_notes`: test ve local compose dosyalarında kullanılan CA/sertifika malzemesini üretim bundle adlarıyla uyumlu hale getirin ama dosya içeriğini ayrı tutun.

### Bulgu 6

- `title`: Spring Cloud Gateway, TLS konfigürasyonunu ortaklaştırırken güvensiz kısa yolları açıkça dışlıyor
- `source`: [Spring Cloud Gateway MVC TLS/SSL](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway-server-webmvc/tls-and-ssl.html) | [Spring Cloud Gateway WebFlux TLS/SSL](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway-server-webflux/tls-and-ssl.html)
- `author`: Spring Cloud team
- `date`: 10 Ağustos 2026 itibarıyla güncel referans dokümantasyonu
- `category`: spring-cloud, edge-security
- `tags`: gateway, ssl-bundle, deprecation, trust-manager, handshake-timeout, webflux, webmvc
- `summary`: MVC gateway dokümantasyonu eski proje-özel SSL bundle ayarını Boot’un genel `spring.http.client.ssl.bundle` alanına taşıyor; WebFlux gateway ise `useInsecureTrustManager` seçeneğinin üretimde kullanılmaması gerektiğini açıkça belirtiyor ve bilinen sertifikalar ile handshake timeout yapılandırmasını öne çıkarıyor.
- `why_it_matters`: Edge katmanındaki TLS pratikleri framework genelindeki ortak dile yaklaşıyor ve tehlikeli kısa yollar dokümantasyon düzeyinde açıkça işaretleniyor.
- `java_spring_relevance`: Spring Cloud Gateway kullanan platform ekipleri için TLS standardizasyonu ve güvenli varsayılanlar daha belirgin hale geliyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: edge ve servis istemcilerinde ortak konfigürasyon; daha temiz migration backlog’u
- `risks`: deprecated property’lerin sessizce kalması; insecure trust manager’ın prod profile sızması
- `migration_notes`: gateway konfigürasyonlarını tarayıp eski MVC property kullanımını kaldırın; WebFlux tarafında güvenilen sertifika listesi ve timeout’ları açıkça yönetin.

## Sonuç

10 Ağustos 2026 için en değerli Java / Spring sinyali yeni sürüm numarası değil. Asıl sinyal şu: Java platformu TLS algoritmasını daha çevik hale getirirken, Spring ekosistemi trust malzemesini uygulama, gateway, broker ve dev service yüzeylerinde adlandırılmış, yeniden kullanılabilir ve ölçülebilir bileşenlere çeviriyor. Bu yüzden doğru teknik karar, TLS’i “ops ekibi bir truststore koyar” seviyesinde bırakmak değil; named group override’larından CA allow-list stratejisine, SSL bundle standardından expiry alarmlarına kadar bunu doğrudan platform sözleşmesi olarak ele almak. Bugünün backlog’u nettir: trust malzemesini envanterleyin, bundle standardı tanımlayın, expiry metriğini ve info görünürlüğünü güvenli biçimde açın, jlink kullanan image’lerde CA test matrisini yazın, JDK 27 hibrit TLS geçişine engel olabilecek pinleme ve legacy override’ları temizleyin.
