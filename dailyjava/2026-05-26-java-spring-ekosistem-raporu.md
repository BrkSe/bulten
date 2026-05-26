# Günlük Java / Spring Ekosistem Raporu

Tarih: 26 Mayıs 2026  
Tarama zamanı: 26 Mayıs 2026 09:08 TSİ  
Odak: JDK 27 rampdown öncesi operasyon ve güvenlik odaklı JEP seti, Java 26'nın ağ katmanı etkileri ve Spring entegrasyon yüzeyindeki daha dar ama gerçek davranış değişimleri

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), Spring projelerinin GitHub release notları ve changelog'ları, [OpenJDK JEP sayfaları](https://openjdk.org/jeps/0), [JDK 27 Early Access](https://jdk.java.net/27/), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/), [dev.java](https://dev.java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long'un sayfası](https://spring.io/authors/joshlong/), [Gunnar Morling'in blogu](https://www.morling.dev/blog/), ilgili GitHub release sayfaları ve [Burak KUTBAY'ın blogu](https://blog.burakkutbay.com/) tarandı. Bugün Spring Boot, Spring Security veya Spring AI tarafında dünkü seviyede yeni bir GA/advisory çıkmadı; en güçlü yeni sinyal OpenJDK'nin JDK 27'ye doğru ilerleyen operasyonel JEP'lerinden ve Spring GraphQL, Spring LDAP, JobRunr gibi daha dar ama üretim etkisi olan yüzeylerden geldi.

## Öne Çıkan Başlıklar

- [JEP 536](https://openjdk.org/jeps/536), JDK Flight Recorder kayıtlarından komut satırı argümanlarını, environment variable'ları ve system property değerlerini süreç içinde redakte etmeyi hedefliyor. Bu, observability ile sır yönetimi arasındaki sürtünmeyi doğrudan azaltıyor.
- [JEP 538](https://openjdk.org/jeps/538), PEM API'sini JDK 27'de finalize etmeye yaklaştırıyor; anahtar, sertifika ve CRL işleme için custom Base64/PEM glue koduna olan ihtiyacı azaltabilir.
- [JEP 534](https://openjdk.org/jeps/534), compact object headers özelliğini JDK 27'de varsayılan hale getirerek bellek yoğunluğu ve heap maliyetinde sessiz ama büyük bir değişim yaratabilir.
- [JEP 517](https://openjdk.org/jeps/517) ile Java 26'da gelen HTTP/3 desteği, JDK `HttpClient` tabanlı outbound çağrılar için artık gerçek pilot konusu.
- [Spring GraphQL 2.0.3](https://github.com/spring-projects/spring-graphql/releases/tag/v2.0.3), SSE keep-alive davranışını değiştiriyor; uzun ömürlü subscription akışları ve proxy/gateway katmanlarında bu küçük görünmeyen bir değişiklik.
- [JobRunr 8.6.0](https://github.com/jobrunr/jobrunr/releases/tag/v8.6.0), `--illegal-final-field-mutation=deny` ile JDK 26 uyumunu ilan ediyor; JEP 500 baskısının ekosistemde gerçek sonuç verdiğini gösteriyor.

## Kritik Güncellemeler

### 1. JFR redaction, support dump paylaşımını daha güvenli hale getirmeye yaklaşıyor

[JEP 536](https://openjdk.org/jeps/536) ve [Inside Java'nın 22 Mayıs 2026 tarihli JDK 27 notu](https://inside.java/2026/05/22/quality-heads-up/) birlikte okunduğunda şu netleşiyor:

- JFR, komut satırı argümanlarını ve başlangıçtaki environment variable/system property değerlerini kayıt dosyasına bugün doğrudan yazabiliyor.
- Önerilen değişiklik, bu veriyi süreç dışına çıkmadan önce redakte etmeyi hedefliyor.
- Özellikle `-D...password=...`, token içeren environment variable'lar ve gizli parametreleri CLI üzerinden alan uygulamalar için bu önemli.

Bu neden kritik:

- Spring Boot servisleri genelde secrets'ı tam anlamıyla CLI üzerinden taşımıyor olsa da, staging ve iç araç dünyasında hâlâ `-D`, `SPRING_*` veya container env üzerinden kritik veri akıyor.
- JFR dump'ları incident, performance analizi veya vendor destek süreçlerinde çok paylaşıldığı için veri sızıntısı riski pratik bir problem.
- Bu başlık syntax yeniliği değil; kurum içi tanılama verisinin nasıl paylaşılacağına dair güvenlik sınırını değiştiriyor.

Kısa yorum: JDK 27'nin en değerli yeni sinyallerinden biri, gözlemlenebilirlik verisini daha güvenli hale getirmeye çalışması.

### 2. PEM API'sinin finalize edilmesi, Java güvenlik altyapısındaki el yapımı glue kodu azaltabilir

[JEP 538](https://openjdk.org/jeps/538), JDK 25 ve JDK 26 preview'lerinden sonra PEM API'sini JDK 27 için finalize etmeyi öneriyor:

- PEM metni ile PKCS#8 / X.509 nesneleri arasında dönüşüm için standart API sağlanıyor.
- API'de preview turlarından sonra isim ve tip sadeleştirmeleri yapılıyor.
- `EncryptedPrivateKeyInfo` ve decoder/factory yüzeyi daha pratik hale getiriliyor.

Bu neden kritik:

- Java/Spring servislerinde mTLS, özel CA, imza doğrulama, key rotation ve sertifika import/export akışları çoğu zaman ya BouncyCastle'a ya da custom parser koduna dayanıyor.
- Standart API'nin finalize olması, güvenlik kodunun daha taşınabilir ve daha az hata üretir hale gelmesini sağlayabilir.
- Özellikle platform ekipleri için PEM işleme kodunu standart JDK yüzeyine çekmek, bakım ve uyumluluk maliyetini düşürür.

Kısa yorum: Bu özellik "crypto merakı" değil; sertifika ve anahtar yönetimi yapan her kurumsal Java ekibi için zamanla baseline haline gelebilir.

### 3. Compact object headers'ın varsayılan olması, JDK 27 geçişlerinde ölçüm gerektirecek

[JEP 534](https://openjdk.org/jeps/534), daha önce opsiyonel olan compact object headers özelliğini JDK 27'de varsayılan hale getirmeyi hedefliyor:

- 64-bit sistemlerde object header alanı 96 bitten 64 bite düşüyor.
- Hedef, daha düşük heap kullanımı, daha iyi deployment density ve daha iyi data locality.
- JEP metni, bu özelliğin Oracle, Amazon ve SAP tarafında ciddi testlerden geçtiğini söylüyor.

Bu neden kritik:

- Spring Boot servisleri yoğun nesne tahsisi yapan, cache kullanan veya container başına bellek bütçesi sınırlı iş yüklerinde doğrudan kazanç görebilir.
- Buna karşılık, JVM agent'ları, profiler'lar, native kancalar veya düşük seviyeli object layout varsayımlarına yaslanan araçlar test edilmeden bırakılmamalı.
- "Default" değişimleri en tehlikeli olanlardır; takım fark etmese bile davranış zemini değişir.

Kısa yorum: Bu başlık JDK 27 tarafında yeni syntax'tan daha önemli; çünkü herkes için sessizce çalışmaya başlayacak türden bir runtime değişimi.

### 4. Java 26'da HTTP/3 artık resmi istemci yüzeyi; mikroservis çağrıları için pilot zamanı geldi

[JEP 517](https://openjdk.org/jeps/517) ve [Oracle'ın Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26) şunu net söylüyor:

- JDK `HttpClient` artık HTTP/3 ile konuşabiliyor.
- Varsayılan protokol HTTP/2 olarak kalıyor; HTTP/3 opt-in modelinde.
- Amaç, uygulama kodunda minimum değişiklikle HTTP/3 endpoint'lerine erişim sağlamak.

Bu neden kritik:

- İç servis çağrıları, edge gateway entegrasyonları ve harici API istemcileri için daha düşük latency ve daha dayanıklı bağlantı davranışı mümkün.
- Spring ekipleri doğrudan `java.net.http.HttpClient` kullanıyorsa konu hemen pratik; `RestClient`, `HttpServiceClient` veya özel outbound adaptörleriniz JDK client üzerine kuruluyorsa da aynı şekilde.
- Ancak bu değişiklik otomatik fayda sağlamaz; load balancer, proxy, observability ve timeout politikaları yeniden test edilmelidir.

Kısa yorum: Java 26'ya çıkan ekipler için HTTP/3 artık "gelecek fikir" değil, sınırlı scope ile pilotlanabilecek gerçek bir ağ özelliği.

## Trendler ve Sinyaller

### Trend Kümesi 1: JDK 27, dil yeniliğinden çok operasyon güvenliği ve runtime varsayılanlarına yükleniyor

- JFR redaction,
- PEM API finalization,
- compact object headers'ın default olması

aynı tabloyu veriyor: JDK 27'nin en değerli sinyalleri syntax'ta değil, production diagnostics, secrets hygiene ve bellek davranışında.

### Trend Kümesi 2: Java ekosistemi JEP 500 sonrası reflection borcunu kapatmaya başladı

- [JobRunr 8.6.0](https://github.com/jobrunr/jobrunr/releases/tag/v8.6.0), final field mutation'ı kaldırarak JDK 26 uyumuna geçti.
- Bu, önceki günlerde gördüğümüz JDK 26/JDK 27 final-field warning çizgisinin ekosistemde karşılık bulduğunu gösteriyor.
- Sıradaki soru artık "JEP 500 var mı?" değil, "hangi kütüphane hâlâ reflection borcu taşıyor?".

### Trend Kümesi 3: Spring tarafında büyük çatı release yerine entegrasyon kontratları sıkılaşıyor

- Spring GraphQL 2.0.3 SSE keep-alive davranışını değiştiriyor.
- Spring LDAP 4.1 RC1, `LdapClient` API'sini `JdbcClient` çizgisine yaklaştırıyor.

Bu çizgi, "framework'te yeni büyük modül" yerine mevcut entegrasyon yüzeylerinin daha tutarlı ve daha operasyona uygun hale getirildiğini gösteriyor.

### Gürültü mü, kalıcı mı?

- Kalıcı mühendislik değeri yüksek: JFR redaction, PEM API finalization, compact object headers default, JobRunr'ın JDK 26 uyumu.
- İzle ve test et: Java 26 HTTP/3 outbound kullanımı, Spring GraphQL 2.0.3 SSE davranışı, Spring LDAP 4.1 RC1.
- Düşük öncelik: [JEP 537](https://openjdk.org/jeps/537) Vector API'nin on ikinci inkübasyonu, Josh Long tarafındaki podcast içerikleri, Baeldung'deki günlük how-to yazıları. Bunlar faydalı ama bugün çoğu Spring backend ekibinin yol haritasını tek başına değiştirmiyor.

## Araçlar ve Kütüphaneler

- [JDK 27 EA Build 23](https://jdk.java.net/27/): Yüksek öncelik. JDK 27 pilotu yapan ekiplerin feature freeze öncesi davranış testi için kullanması gereken referans build.
- [Spring GraphQL 2.0.3](https://github.com/spring-projects/spring-graphql/releases/tag/v2.0.3): Orta-yüksek öncelik. Özellikle subscription/SSE ve gateway arkasında çalışan GraphQL servisleri için.
- [JobRunr 8.6.0](https://github.com/jobrunr/jobrunr/releases/tag/v8.6.0): Yüksek öncelik. JDK 26 + background jobs kombinasyonunda hemen anlamlı.
- [Spring LDAP 4.1.0-RC1](https://github.com/spring-projects/spring-ldap/releases/tag/4.1.0-RC1): Orta öncelik. LDAP/Active Directory entegrasyonu olan kurumlarda lokal önemi yüksek.
- [Java 26 HTTP/3 desteği](https://openjdk.org/jeps/517): Orta-yüksek öncelik. Modern ağ altyapısına çıkan outbound istemci katmanları için.
- Not: Bugün Spring Boot/Security çekirdeğinde dünkü seviyede yeni bir GA veya kritik advisory görünmedi; sinyal kenar entegrasyonlara ve JDK runtime davranışına kaymış durumda.

## Java / Spring Geliştiricileri İçin Etkiler

- JDK 27 pilotu açıyorsanız, JFR dump paylaşım politikası ve redaction beklentisini şimdiden gündeme alın; bu değişiklik gözlemlenebilirlik akışlarını güvenlik yönetişimiyle daha uyumlu hale getirebilir.
- Sertifika, private key ve CRL işleme yapan servisler için PEM API'nin finalize olması, custom parser/helper katmanlarını azaltma fırsatı veriyor.
- Java 27'de compact object headers varsayılan olduğunda, sadece uygulamayı değil APM ajanlarını, heap dump araçlarını ve low-level profiler'ları da test etmek gerekecek.
- Java 26 üzerinde JDK `HttpClient` kullanan istemciler için HTTP/3 denemeleri küçük kapsamlı ama gerçek latency/dayanıklılık kazanımı çıkarabilir.
- Spring GraphQL kullanan ekipler, SSE keep-alive davranışını reverse proxy ve browser/client kombinasyonlarıyla tekrar doğrulamalı.
- JobRunr kullanan ekipler, JDK 26 geçişini daha rahat planlayabilir; ancak release notundaki multi-cluster dashboard kırılımı ve migration ayrıntısı gözden kaçırılmamalı.
- LDAP entegrasyonu olan ekipler için Spring LDAP 4.1 RC1 düşük görünürlükte ama anlamlı bir modernizasyon sinyali veriyor; genel kitle için düşük öncelik, ilgili ekipler için yüksek lokal değer.

## Fırsatlar ve Riskler

- Fırsat: JFR redaction sayesinde support dump paylaşımını daha güvenli hale getirmek.
- Fırsat: PEM API finalizasyonu ile sertifika ve anahtar işleme kodunu standartlaştırmak.
- Fırsat: Compact object headers sayesinde container yoğunluğunu ve heap verimliliğini artırmak.
- Fırsat: HTTP/3 pilotları ile outbound servis çağrılarında daha iyi ağ davranışı elde etmek.
- Fırsat: JobRunr 8.6.0 ile JDK 26 geçişini background job altyapısında erken açmak.
- Risk: Compact object headers'ı ölçmeden üretime almak, ajan veya native entegrasyon sürprizleri doğurabilir.
- Risk: HTTP/3 desteğini yalnız istemci özelliği gibi düşünüp proxy, observability ve retry katmanını test etmemek.
- Risk: JobRunr release notundaki dashboard ve recurring job migration ayrıntılarını atlamak.
- Risk: Spring GraphQL keep-alive değişimini küçük görüp subscription bağlantı davranışındaki değişimi gözden kaçırmak.
- Risk: LDAP entegrasyonunu düşük öncelikli sanıp, kurumsal kimlik altyapısındaki kod kalıplarını gereksiz yere eski DSL'lerde bırakmak.

## İzlenmesi Gereken Konular

- JDK 27 için [JEP 536](https://openjdk.org/jeps/536) ve [JEP 538](https://openjdk.org/jeps/538) review/targeleme sürecinin resmileşmesi.
- [JDK 27 EA](https://jdk.java.net/27/) build'lerinde compact object headers default davranışının saha geri bildirimleri.
- Java 26 kullanan ekiplerde HTTP/3 pilotlarının gerçek latency ve error-budget sonuçları.
- Spring GraphQL 2.0.x hattında SSE/subscription davranışına dair ek patch'ler.
- JobRunr tarafında `--illegal-final-field-mutation=deny` uyumunun dashboard dahil tüm yüzeylere ne hızla yayıldığı.
- Spring LDAP 4.1 GA öncesi `LdapClient` API yüzeyinin ne kadar sabitlendiği.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: JFR In-Process Data Redaction, JDK 27 öncesi tanılama verisindeki sır sızıntısı riskini daraltıyor
- source: [JEP 536](https://openjdk.org/jeps/536), [JDK 27 EA](https://jdk.java.net/27/), [Inside Java - JDK 27 Approaches Rampdown](https://inside.java/2026/05/22/quality-heads-up/)
- author: Erik Gahlin
- date: 19 Mayıs 2026 güncellemesi, 26 Mayıs 2026 taramasında doğrulandı
- category: observability, security, compliance
- tags: jfr, jdk-27, redaction, secrets, diagnostics, compliance
- summary: JFR kayıtlarından komut satırı argümanları ile başlangıç environment/system property değerlerinin süreç içinde redakte edilmesi hedefleniyor.
- why_it_matters: Prod dump paylaşımında gizli veri sızdırma riski uygulama kodundan bağımsız olarak azaltılabilir.
- java_spring_relevance: Spring Boot servisleri sık sık env/system property bazlı konfigürasyon kullandığı için yüksek.
- actionability: planlı_aksiyon
- impact_level: çok-yüksek
- opportunities: Support ve performans analiz süreçlerini güvenlik ekibiyle daha az sürtünmeli hale getirmek.
- risks: Ekiplerin JFR paylaşımını bugün zaten güvenli varsayması ve politikayı geç güncellemesi.
- migration_notes: JDK 27 pilotlarında JFR event içeriğini örnekleyin; sır taşıyan startup parametrelerinizi ayrıca envanterleyin.

### Bulgu 2

- title: PEM API'nin finalize edilmesi, Java güvenlik kodunda standartlaşma fırsatı yaratıyor
- source: [JEP 538](https://openjdk.org/jeps/538)
- author: Anthony Scarpino
- date: 20 Mayıs 2026 güncellemesi, 26 Mayıs 2026 taramasında doğrulandı
- category: security, crypto, platform-api
- tags: pem, certificates, private-key, x509, pkcs8, jdk-27
- summary: JDK 25 ve 26 preview'lerinden sonra PEM encode/decode API'si JDK 27 için finalize edilmeye hazırlanıyor.
- why_it_matters: Sertifika ve anahtar işleme kodunu JDK standardına çekmek, custom parser ve üçüncü taraf bağımlılık baskısını azaltır.
- java_spring_relevance: mTLS, outbound client cert, signing, trust-store yönetimi yapan Spring ekipleri için yüksek.
- actionability: izle_ve_test_et
- impact_level: yüksek
- opportunities: Güvenlik altyapısındaki yardımcı kodları azaltmak, standardize etmek ve bakım maliyetini düşürmek.
- risks: Preview API'lere gömülü kalmış deneme kodlarının finalize edilmiş yüzeye uyarlanmaması.
- migration_notes: Eğer bugün custom PEM parsing kodu kullanıyorsanız, JDK 27 sonrası sadeleştirme backlog'u açın; preview API kullandıysanız isim ve imza değişimlerini kontrol edin.

### Bulgu 3

- title: Compact object headers'ın varsayılan olması, JDK 27 ile bellek ekonomisini sessizce değiştirebilir
- source: [JEP 534](https://openjdk.org/jeps/534), [InfoQ OpenJDK roundup](https://www.infoq.com/news/2026/05/jdk-news-roundup-may18-2026/)
- author: Roman Kennke
- date: 20 Mayıs 2026 güncellemesi, 26 Mayıs 2026 taramasında doğrulandı
- category: runtime, performance, memory
- tags: compact-object-headers, heap, density, jdk-27, hotspot
- summary: JDK 24 ve 25'te kademeli gelen compact object headers özelliği, JDK 27'de default object header düzeni olmaya hazırlanıyor.
- why_it_matters: Bu, uygulama koduna dokunmadan bellek ayak izini ve GC davranışını etkileyebilecek türde bir runtime default değişimi.
- java_spring_relevance: Container sınırları içinde çalışan Spring Boot servisleri ve heap yoğun iş yükleri için yüksek.
- actionability: izle_ve_test_et
- impact_level: yüksek
- opportunities: Daha az heap, daha iyi yoğunluk, daha düşük altyapı maliyeti.
- risks: Ajan, profiler veya native entegrasyonların object layout varsayımlarıyla uyumsuzluk.
- migration_notes: JDK 27 pilotlarında heap ölçümü ve APM/diagnostic araç uyumluluğunu birlikte test edin; yalnız benchmark değil gerçek prod benzeri yük kullanın.

### Bulgu 4

- title: Java 26 HTTP/3 desteği, outbound istemci katmanını yeniden test etmeyi gerektiriyor
- source: [JEP 517](https://openjdk.org/jeps/517), [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26)
- author: Daniel Fuchs / Sharat Chander
- date: JEP 26 için teslim edildi, 17 Mart 2026 GA; 26 Mayıs 2026 taramasında yeniden değerlendirildi
- category: networking, cloud-native, api-clients
- tags: http3, quic, java26, httpclient, outbound, microservices
- summary: JDK `HttpClient`, HTTP/3 sunucularıyla minimum kod değişikliğiyle konuşabilecek hale geldi; varsayılan ise hâlâ HTTP/2.
- why_it_matters: Servisler arası ve harici API çağrılarında latency, bağlantı davranışı ve hata modeli değişebilir.
- java_spring_relevance: JDK `HttpClient` kullanan veya onu saran Spring tabanlı outbound katmanlarda orta-yüksek.
- actionability: pilotla
- impact_level: orta-yüksek
- opportunities: Modern edge ve API altyapısında daha iyi ağ davranışı, düşük gecikme, daha esnek bağlantı kurma.
- risks: Proxy, gateway, timeout, tracing ve retry davranışlarının eksik test edilmesi.
- migration_notes: Trafik benzeri küçük bir pilotta HTTP/3'ü etkinleştirin; bağlantı kurulumu, fallback, observability ve hata bütçesi etkisini ölçün.

### Bulgu 5

- title: Spring GraphQL 2.0.3, SSE keep-alive davranışını değiştirerek subscription akışlarını etkileyebilir
- source: [Spring GraphQL 2.0.3 release notes](https://github.com/spring-projects/spring-graphql/releases/tag/v2.0.3), [Spring GraphQL project page](https://spring.io/projects/spring-graphql)
- author: belirtilmemiş / Spring GraphQL ekibi
- date: 21 Nisan 2026, 26 Mayıs 2026 taramasında doğrulandı
- category: api, graphql, streaming
- tags: spring-graphql, sse, keep-alive, subscriptions, gateway, jackson3
- summary: 2.0.3 sürümü, keep-alive mesajlarını boş SSE comment'leri olarak göndermeye geçiyor ve aynı zamanda Jackson 3.1.2, Micrometer 1.16.5 ve Spring Security 7.0.5 hizasına geliyor.
- why_it_matters: Uzun ömürlü subscription/SSE akışlarında küçük wire-format değişimleri proxy, browser ve gateway davranışını gerçekten etkiler.
- java_spring_relevance: GraphQL subscription veya SSE kullanan Spring ekipleri için yüksek; diğer ekipler için düşük.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Daha standart keep-alive davranışı ve bağımlılık hizası.
- risks: Idle connection yönetimi, heartbeat beklentileri ve client parser davranışında sürprizler.
- migration_notes: Reverse proxy arkasında çalışan GraphQL subscription testlerini tekrar koşturun; özellikle idle timeout ve connection liveness senaryolarını doğrulayın.

### Bulgu 6

- title: JobRunr 8.6.0, JDK 26 final-field kısıtlarına uyum sağlayarak erken ekosistem sinyali veriyor
- source: [JobRunr 8.6.0 release notes](https://github.com/jobrunr/jobrunr/releases/tag/v8.6.0), [InfoQ Java roundup](https://www.infoq.com/news/2026/05/java-news-roundup-may04-2026/)
- author: JobRunr maintainers
- date: 6 Mayıs 2026
- category: background-jobs, compatibility, runtime-integrity
- tags: jobrunr, jdk26, final-field-mutation, recurring-jobs, spring-boot, dashboard
- summary: JobRunr 8.6.0, `--illegal-final-field-mutation=deny` ile uyum için reflection tabanlı final field mutasyonunu kaldırdı; aynı sürümde recurring jobs ve database metadata tarafında performans iyileştirmeleri de var.
- why_it_matters: JEP 500 baskısının yalnız JDK seviyesinde kalmayıp popüler job altyapılarında gerçek kod değişimi yarattığını gösteriyor.
- java_spring_relevance: Spring Boot içinde JobRunr kullanan ekipler için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: JDK 26 geçişini background processing katmanında daha rahat açmak; büyük tablo sayısı olan veritabanlarında ek performans kazanımı.
- risks: Multi-cluster dashboard için yeni `clusterId` gereksinimi ve recurring job migration adımının gözden kaçması.
- migration_notes: JDK 26 planınız varsa JobRunr sürümünüzü kontrol edin; dashboard ve recurring job migration notlarını release notundan bire bir takip edin.

### Bulgu 7

- title: Spring LDAP 4.1 RC1, LdapClient API'sini JdbcClient çizgisine yaklaştırıyor
- source: [Spring LDAP 4.1.0-RC1 release notes](https://github.com/spring-projects/spring-ldap/releases/tag/4.1.0-RC1), [Spring LDAP project page](https://spring.io/projects/spring-ldap), [InfoQ Spring roundup](https://www.infoq.com/news/2026/04/spring-news-roundup-apr20-2026/)
- author: belirtilmemiş / Spring LDAP ekibi
- date: 16 Nisan 2026, 26 Mayıs 2026 taramasında değerlendirildi
- category: enterprise-integration, directory-services, api-design
- tags: spring-ldap, ldapclient, jdbcclient, active-directory, fluent-api
- summary: RC1 sürümü, `LdapClient` yüzeyini `JdbcClient` stiline hizalıyor ve tekil/optional/list/stream odaklı daha modern çağrı biçimleri getiriyor.
- why_it_matters: LDAP/AD entegrasyonları hâlâ birçok kurumda kritik; daha tutarlı client DSL'i bu kodun bakımını kolaylaştırabilir.
- java_spring_relevance: Genel Spring kitlesi için düşük-orta, kurumsal kimlik entegrasyonu olan ekipler için yüksek.
- actionability: düşük-öncelik
- impact_level: orta
- opportunities: Eski `LdapTemplate` tabanlı kodu daha okunabilir ve daha standart istemci kalıbına yaklaştırmak.
- risks: RC yüzeyine erken yatırım yapıp GA öncesi API oynaklığını taşımak.
- migration_notes: LDAP entegrasyonu sizin için kritikse küçük bir spike açın; aksi halde GA'yı beklemek daha mantıklı.

## Sonuç

26 Mayıs 2026 itibarıyla en güçlü Java/Spring sinyali yeni bir büyük Spring release değil, JDK 27'nin production davranışını sessizce değiştiren feature seti. JFR redaction, PEM API finalization ve compact object headers default kararı; güvenlik, diagnostics ve altyapı maliyeti tarafında orta vadeli ama kalıcı etkiler üretecek.

Spring tarafında ise bugün değerli olan başlıklar daha niş ama daha uygulanabilir: Spring GraphQL 2.0.3'ün SSE davranışı, Spring LDAP 4.1 RC1'in modern client çizgisi ve JobRunr 8.6.0'ın JDK 26 uyumu. Kısa vadede en mantıklı aksiyon; JDK 27 için observability ve agent test backlog'u açmak, JDK 26 üzerinde HTTP/3 ve JobRunr uyumunu pilotlamak, GraphQL subscription altyapınız varsa 2.0.3 davranışını doğrulamak.
