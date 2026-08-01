# Günlük Java / Spring Ekosistem Raporu

Tarih: 1 Ağustos 2026 Cumartesi  
Tarama zamanı: 1 Ağustos 2026 09:07 TSİ  
Odak: Spring 7 / Boot 4 ile örtük kalıplardan açık sözleşmelere geçiş; API yönetişimi, interface tabanlı HTTP istemciler, çekirdeğe taşınan resilience, null-safety ve modülerleşmenin migration etkisi

Tarama notu: 1 Ağustos 2026 itibarıyla [Spring Blog](https://spring.io/blog), [Spring release duyuruları](https://spring.io/blog/category/releases), [Spring Security advisories](https://spring.io/security), [Spring Framework 7.0 GA](https://spring.io/blog/2025/11/13/spring-framework-7-0-general-availability/), [Spring Boot 4.0](https://spring.io/blog/2025/11/20/spring-boot-4-0-0-available-now/), [API Versioning dokümantasyonu](https://docs.spring.io/spring-framework/reference/web/webmvc-versioning.html), [HTTP client yön yazısı](https://spring.io/blog/2025/09/30/the-state-of-http-clients-in-spring/), [Core Spring resilience yazısı](https://spring.io/blog/2025/09/09/core-spring-resilience-features/), [Spring Tools 5.x yazıları](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released/), [Spring Cloud Oakwood release notu](https://spring.io/blog/2025/11/25/spring-cloud-2025-1-0-aka-oakwood-has-been-released/), [Spring AI 2.0 GA](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now/), [Inside Java](https://inside.java/), [Oracle Java blog](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases), [InfoQ Spring/Java kapsaması](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Baeldung API versioning yazısı](https://www.baeldung.com/spring-api-versioning), [Josh Long'un 7 Temmuz 2026 notları](https://spring.io/blog/2026/07/07/this-week-in-spring-july-07-2026/), [Gunnar Morling blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Resmi release akışında yeni büyük bir Spring GA dalgası yok; GitHub release çizgisi hâlâ Boot `3.5.16`, Framework `7.0.8`, Security `7.1.0`, Cloud `2025.1.2`, Data Commons `3.5.13`, Spring AI `2.0.0` seviyesinde. Bugünün güçlü sinyali yeni sürümden çok uygulama modelinde: Spring 4.x nesli ekipleri daha açık sözleşmelerle ve daha az yan-kütüphane ile çalışmaya itiyor.

## Öne Çıkan Başlıklar

- API versioning artık custom path/header hack’i değil; doğrulama, `400` davranışı ve `Deprecation`/`Sunset` başlıklarıyla framework özelliği.
- Outbound HTTP tarafında yön netleşti: interface tabanlı istemciler, `@ImportHttpServices`, grup kayıt modeli ve `RestTemplate`’ten planlı çıkış.
- Retry ve concurrency throttling artık Spring Retry etrafında dönen ek bağımlılıklar olmadan çekirdek Spring yeteneği; Spring Cloud da bu yöne hizalanıyor.
- JSpecify/null-safety artık tek proje özelliği değil; Framework, Boot, Cloud, AI ve Spring Tools hattında ortak sözleşme haline geliyor.
- Spring Boot 4 modülerleşmesi kozmetik değil; starter adları, test starter’ları, shared library ve custom starter tasarımı üzerinde gerçek migration maliyeti yaratıyor.

## Kritik Güncellemeler

### 1. API versioning, işletim kuralına dönüşmüş durumda

[Spring Framework dokümantasyonu](https://docs.spring.io/spring-framework/reference/web/webmvc-versioning.html), API versioning’in artık yalnız mapping sözdizimi olmadığını gösteriyor. Çerçeve; sürüm çözümleme, sürüm parse etme, desteklenen sürüm doğrulama ve deprecated sürümler için yanıt başlığı üretimini tek bir strateji altında topluyor. Header, query param, media type parametresi ve path segment çözümleme seçenekleri yerleşik geliyor. Daha önemlisi, `MissingApiVersionException` ve `InvalidApiVersionException` ile yanlış sürüm talepleri sessizce kaymıyor; `400` ile kırılıyor. `StandardApiVersionDeprecationHandler` ise `Deprecation`, `Sunset` ve `Link` başlıklarıyla API yaşam döngüsünü protokol seviyesine taşıyor.

Bu, özellikle aynı anda `v1` ve `v2` yürüten ekipler için önemlidir. Artık versiyonlama “gateway’de bir regex” ya da “controller içinde if bloğu” işi olmamalı.

### 2. Spring’in resmi HTTP istemci modeli artık interface-first

[The state of HTTP clients in Spring](https://spring.io/blog/2025/09/30/the-state-of-http-clients-in-spring/) yazısı, `RestTemplate`’in resmen deprecated edildiğini açıkça söylüyor. Ayrı bir [HTTP Service Client Enhancements](https://spring.io/blog/2025/09/23/http-service-client-enhancements/) yazısı ise bu değişimin nedenini somutlaştırıyor: `@HttpExchange` tabanlı interface istemciler, `HttpServiceProxyRegistry` ve `@ImportHttpServices` ile bean kayıt maliyetini düşürüyor; bir API’nin sözleşmesini Java tipi olarak merkezileştiriyor.

Burada ikincil ama önemli sinyal [RestTestClient](https://spring.io/blog/2025/09/30/the-state-of-http-clients-in-spring/) tarafında geliyor. Aynı API ile hem live-server hem mock akışında test yapabilmek, klasik `TestRestTemplate`/`MockMvc` ayrımını sadeleştiriyor. Bu, servisler arası istemci kodu ile entegrasyon test modelinin aynı düşünce tarzına oturmaya başladığını gösteriyor.

### 3. Resilience, yan proje olmaktan çıkıp çekirdeğe indi

[Core Spring Resilience Features](https://spring.io/blog/2025/09/09/core-spring-resilience-features/) ile gelen `@Retryable`, `@ConcurrencyLimit` ve yeni `RetryTemplate`, retry ve concurrency kontrolünü “opsiyonel eklenti” seviyesinden çıkarıyor. [InfoQ’nun Spring ekibiyle görüşmesi](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), bunun stratejik yön olduğunu doğruluyor: ekip, core resilience kalıplarını framework’ün içine alıyor.

[Spring Cloud 2025.1.0 Oakwood release notu](https://spring.io/blog/2025/11/25/spring-cloud-2025-1-0-aka-oakwood-has-been-released/) bunu daha da anlamlı hale getiriyor. Yeni bir circuit breaker modülü artık Framework 7 resilience desteğini kullanıyor; `spring-cloud-circuitbreaker-spring-retry` ise bakım moduna alınmış durumda. Bu, “retry için yine Spring Retry mı?” sorusunun giderek daha fazla “yalnız legacy ise” cevabına kayacağını gösteriyor.

### 4. Null-safety, compile-time sözleşmeye dönüşüyor

[Spring Framework 7 GA](https://spring.io/blog/2025/11/13/spring-framework-7-0-general-availability/) ve [Null-safe applications with Spring Boot 4](https://spring.io/blog/2025/11/12/null-safe-applications-with-spring-boot-4/) yazıları JSpecify’ı yalnız anotasyon değişikliği gibi sunmuyor; portföyün API yüzeyini daha açık hale getiren sözleşme değişimi olarak çerçeveliyor. [Spring AI 2.0 GA](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now/) ise bunun pratik sonucunu gösteriyor: kod tabanı tamamen JSpecify ile işaretlenmiş, opsiyonlar immutable builder modeline taşınmış, mandatory/optional ayrımı netleştirilmiş.

[Spring Cloud Oakwood](https://spring.io/blog/2025/11/25/spring-cloud-2025-1-0-aka-oakwood-has-been-released/) tarafında Gateway ve Commons public API’lerinde JSpecify genişliyor. [Josh Long’un 7 Temmuz 2026 notu](https://spring.io/blog/2026/07/07/this-week-in-spring-july-07-2026/) ise null pointer azaltımını hâlâ güncel bir ekip önceliği olarak işaret ediyor. Yani bu konu “geçen seneki Road to GA özelliği” değil; aktif portföy yönü.

### 5. Spring Boot 4 modülerleşmesi, asıl işi shared library katmanına taşıyor

[Modularizing Spring Boot](https://spring.io/blog/2025/10/28/modularizing-spring-boot/) yazısı, tek `spring-boot-autoconfigure` dünyasından küçük ve odaklı modüllere geçişi anlatıyor. Bu değişim tipik starter kullanan uygulamalarda daha yumuşak görünebilir; ancak `spring-boot-starter-web` -> `spring-boot-starter-webmvc`, yeni teknolojiye özel starter’lar, eşlenik test starter’lar ve package/import düzeyindeki değişimler custom starter veya shared dependency barındıran platform ekipleri için ek iş çıkarıyor.

Spring ekibinin “classic starter” köprüleri sunması bile bunun sıradan dependency bump olmadığını gösteriyor. En çok dikkat gerektiren yer uç servisler değil, şirket içi starter’lar ve ortak altyapı kütüphaneleri.

## Trendler ve Sinyaller

### Trend Kümesi 1: Örtük convention yerine framework-native sözleşmeler

Tekrarlayan sinyal:

- API versioning artık resmi sözleşme
- HTTP istemci kaydı ve gruplaması framework içinde
- deprecated API yaşam döngüsü response header’larına taşınıyor
- test istemcisi de aynı modele yakınsıyor

Bu kısa ömürlü hype değil. Özellikle çok takımlı mikroservis platformlarında davranış tutarlılığı ve sözleşme yönetimi doğrudan mühendislik verimi üretir.

### Trend Kümesi 2: “Shift-left correctness” portföy geneline yayılıyor

Tekrarlayan sinyal:

- JSpecify ile nullability görünür hale geliyor
- Spring AI opsiyon modeli immutable builder’a taşınıyor
- Spring Tools, API versioning ve JSpecify için doğrudan destek veriyor
- Spring Cloud public API’lerinde de aynı disiplin genişliyor

Bu eğilim, “runtime’da görürüz” kültürünü zayıflatıyor. Özellikle Java + Kotlin karışık kod tabanlarında bunun getirisi yüksek.

### Trend Kümesi 3: Spring Cloud, çekirdek framework yönünü takip ediyor

Cloud tarafındaki API versioning predicate, interface client entegrasyonları ve Framework 7 resilience’e yaslanan circuit breaker modülü, Spring Cloud’un bağımsız bir yön yerine çekirdekteki kararları hızla taşıdığını gösteriyor. Bu iyi haber; çünkü platform parçalanmasını azaltır. Aynı zamanda riskli; çünkü ekipler eski Cloud kalıplarını varsayım olarak taşıyorsa migration notlarını atlayabilir.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: API versioning, deprecation header’ları ve interface-first HTTP istemci modeli
- Kalıcı değer: Core resilience’in framework içine taşınması
- Kalıcı değer: JSpecify/null-safety ve Boot modülerleşmesi
- Düşük öncelik: [Hardwood](https://www.morling.dev/blog/hardwood-new-parser-for-apache-parquet/) gibi veri-yoğun JVM araçları
- Bugün ana sinyal değil: Oracle tarafında desteklenen baseline’lar güncel olsa da JDK cephesinde Spring ekiplerini dünkü raporlardan daha güçlü etkileyecek yeni bir uygulama-katmanı kırılması yok

## Araçlar ve Kütüphaneler

- [Spring Tools 5.0](https://spring.io/blog/2025/12/10/spring-tools-5-0-0-released/) ve [5.1.0](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released/): API versioning görünürlüğü, JSpecify null analizi ve AOT repository desteği ile upgrade branch’lerinde pratik kaldıraç sunuyor.
- [ArchUnit](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/): yeni bir kütüphane değil ama modülerleşme ve boundary discipline baskısının arttığı dönemde tekrar masaya gelmesi gereken mimari test aracı.
- [Hardwood](https://www.morling.dev/blog/hardwood-new-parser-for-apache-parquet/): Java 21+ üzerinde minimal bağımlılıklı hızlı Parquet okuma sunuyor. Klasik Spring CRUD servisleri için düşük öncelikli; data platformu, embedding veya analitik yan-servisler için izlenebilir.

Bugün “hemen her servise ekleyin” seviyesinde yeni bir OSS bileşen sinyali yok. Asıl değer, mevcut Spring uygulama modelini daha disiplinli hale getiren araçlarda.

## Java / Spring Geliştiricileri İçin Etkiler

- Aynı anda birden fazla public API versiyonu taşıyan ekipler, 4.x geçişiyle birlikte custom versiyonlama kalıplarını resmi `ApiVersionStrategy` etrafında toplamalı.
- Yeni outbound entegrasyonlarda varsayılan seçim `RestClient` veya `WebClient` üstünden interface tabanlı istemciler olmalı; yeni `RestTemplate` yatırımı rasyonel değil.
- Spring Cloud Circuit Breaker ve retry zincirleri olan ekipler, Spring Retry tabanlı katmanları “varsayılan” kabul etmeyi bırakmalı.
- NullAway/IDE null-check yatırımı artık lüks değil; upgrade sırasında çok daha fazla anlam taşıyor.
- En kritik Boot 4 migration işi, son servis kodunda değil; şirket içi starter, custom auto-config, paylaşılan test altyapısı ve ortak kütüphanelerde olacak.
- Test stratejisinde `RestTestClient` ve resmi versioning/test yüzeyi, eski `MockMvc` + el yapımı header setleri kadar değil, daha fazla değer üretmeye başlayacak.

## Fırsatlar ve Riskler

- Fırsat: API yaşam döngüsünü `Deprecation`/`Sunset` başlıklarıyla standartlaştırıp client iletişimini netleştirmek
- Risk: Servisten servise farklı versiyonlama alışkanlıkları taşımaya devam edip istemci davranışını tutarsız hale getirmek
- Fırsat: Interface-first HTTP istemcilerle sözleşmeyi kod tiplerine taşıyıp tekrarı azaltmak
- Risk: Yeni geliştirmelerde hâlâ `RestTemplate` veya dağınık client bean’leri üretmek
- Fırsat: Core resilience desteği ile ek bağımlılık yüzeyini küçültmek
- Risk: Retry/backoff/concurrency ayarlarını eski Spring Retry varsayımlarına göre bırakmak
- Fırsat: JSpecify ve ArchUnit ile davranış ve mimari regresyonu build aşamasına çekmek
- Risk: Boot 4 modülerleşmesini yalnız starter adı değişikliği sanıp custom starter/import kırılmalarını geç fark etmek

## İzlenmesi Gereken Konular

- `RestTemplate` ve `TestRestTemplate` için resmî deprecation-to-removal zaman çizelgesinin ne kadar sertleşeceği
- Spring Tools’un API versioning ve JSpecify için daha fazla otomatik migration quick-fix ekleyip eklemeyeceği
- Spring Cloud 2025.1.x / sonraki train’lerde interface client ve resilience entegrasyonlarının ne kadar genişleyeceği
- Spring AI’de görülen immutable options + açık mandatory/optional modeli benzer biçimde başka portföy projelerine taşınıp taşınmayacağı
- Oracle tarafında güncel desteklenen sürümler `26.0.2`, `25.0.4`, `21.0.12` ve `17.0.20`; fakat bugün bu baseline’ların üstünde, Spring ekipleri için ayrı bir acil uygulama modeli sinyali oluşmuş değil

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Framework 7 API versioning’i protokol seviyesinde yönetişim aracı haline getiriyor
- `source`: [API Versioning dokümantasyonu](https://docs.spring.io/spring-framework/reference/web/webmvc-versioning.html) | [API Versioning in Spring](https://spring.io/blog/2025/09/16/api-versioning-in-spring/) | [Baeldung API Versioning in Spring](https://www.baeldung.com/spring-api-versioning) | [Burak KUTBAY - API Versiyonlama](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/)
- `author`: Spring Framework Team | Brian Clozel | Baeldung | Burak KUTBAY
- `date`: resmi dokümantasyon güncel; ek açıklayıcı içerikler 2025 sonu - 2026 ilk yarı
- `category`: api-design, governance, backward-compatibility
- `tags`: spring-framework-7, api-versioning, deprecation, sunset, contract-governance
- `summary`: Spring MVC/WebFlux artık sürüm çözümleme, doğrulama, default sürüm, deprecated sürüm başlıkları ve controller mapping desteğini yerleşik olarak sunuyor.
- `why_it_matters`: API sürümleri artık yalnız URL isimlendirme tercihi değil; client iletişimi ve yaşam döngüsü bilgisini standartlaştıran çalışma zamanı sözleşmesi.
- `java_spring_relevance`: Çok takımlı microservice, public API veya partner entegrasyonu olan Spring ekipleri için doğrudan etkili.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: Ortak versiyonlama standardı kurmak; deprecated API’leri response header’larıyla yönetmek; testleri resmi sürüm modeline taşımak
- `risks`: Dağınık header/path stratejileri; client tarafında tutarsız fallback; sürüm olmayan isteklerin sessizce yanlış endpoint’e gitmesi
- `migration_notes`: 4.x branch’inde custom interceptor/filter tabanlı versiyonlama katmanlarını envanterleyin; `ApiVersionConfigurer` ile hedef modeli belirleyin; deprecated sürümler için `Deprecation`/`Sunset` planını önceden yazın.

### Bulgu 2

- `title`: Interface-first HTTP client modeli, Spring’in varsayılan service-to-service yönüne dönüşüyor
- `source`: [The state of HTTP clients in Spring](https://spring.io/blog/2025/09/30/the-state-of-http-clients-in-spring/) | [HTTP Service Client Enhancements](https://spring.io/blog/2025/09/23/http-service-client-enhancements/) | [Spring Boot 4.0](https://spring.io/blog/2025/11/20/spring-boot-4-0-0-available-now/) | [Burak KUTBAY - HTTP Service Client](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/)
- `author`: Brian Clozel | Rossen Stoyanchev | Andy Wilkinson | Burak KUTBAY
- `date`: Eylül - Kasım 2025; 1 Ağustos 2026 itibarıyla yön hâlâ geçerli
- `category`: service-communication, client-integration, testing
- `tags`: restclient, resttemplate, http-service-clients, importhttpservices, resttestclient
- `summary`: `RestTemplate` deprecated; Spring 7 ile interface tabanlı istemciler grup kaydı, otomatik bean üretimi ve test istemcisi tarafında bütünlüklü hale getirildi.
- `why_it_matters`: Servisler arası istemci kodu, en çok tekrar eden ve en hızlı kirlenen katmanlardan biridir. Resmi model bunu tip güvenli, tekrar az ve test edilebilir hale getiriyor.
- `java_spring_relevance`: Outbound REST çağrıları olan hemen her Spring Boot servisi için doğrudan relevant.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: Yeni istemcileri interface üstünden tanımlamak; client registry ile ortak HTTP ayarlarını merkezileştirmek; entegrasyon testlerini `RestTestClient` ile sadeleştirmek
- `risks`: Yeni kodda `RestTemplate` üretmeye devam etmek; her istemci için el yapımı bean wiring; test ve runtime istemci modelinin ayrışması
- `migration_notes`: Yeni entegrasyonları `@HttpExchange` + `@ImportHttpServices` ile başlatın; eski `RestTemplate` kodunu yalnız legacy bakım modunda tutun; `TestRestTemplate` kullanımını gözden geçirip `RestTestClient` ile karşılaştırmalı PoC yapın.

### Bulgu 3

- `title`: Retry ve concurrency guardrail’leri çekirdeğe indi; Spring Cloud buna göre yeniden şekilleniyor
- `source`: [Core Spring Resilience Features](https://spring.io/blog/2025/09/09/core-spring-resilience-features/) | [Spring Framework 7.0 GA](https://spring.io/blog/2025/11/13/spring-framework-7-0-general-availability/) | [Spring Cloud Oakwood](https://spring.io/blog/2025/11/25/spring-cloud-2025-1-0-aka-oakwood-has-been-released/) | [InfoQ Spring Team Interview](https://www.infoq.com/articles/spring-team-spring-7-boot-4/)
- `author`: Juergen Hoeller | Spring Cloud Team | InfoQ
- `date`: Eylül - Kasım 2025; etki 2026 release line’larında sürüyor
- `category`: resilience, cloud-native, operational-guardrails
- `tags`: retryable, concurrencylimit, retrytemplate, spring-cloud-circuitbreaker, spring-retry
- `summary`: `@Retryable`, `@ConcurrencyLimit` ve yeni `RetryTemplate`, çekirdek Spring özelliği olarak konumlandı; Spring Cloud da circuit breaker katmanını buna yaslayıp Spring Retry tabanlı modülü bakım moduna çekti.
- `why_it_matters`: Retry ve concurrency limit, üretim davranışını en kolay bozabilen ama en sık “sonradan eklenen” kalıplar arasındadır. Framework içine inmesi, bunların varsayılan mühendislik konusu haline gelmesi demek.
- `java_spring_relevance`: Mikroservis, mesajlaşma, remote call ve virtual-thread kullanan Java ekipleri için yüksek öncelikli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: Retry/backoff politikasını standardize etmek; concurrency limit’leri kod seviyesinde görünür hale getirmek; Spring Retry bağımlılık yüzeyini azaltmak
- `risks`: Legacy retry varsayımlarını yeni framework davranışıyla karıştırmak; Cloud circuit breaker yapılandırmalarını eski modül isimleriyle taşımak; concurrency limit’leri test etmeden üretime almak
- `migration_notes`: `spring-retry` ve `spring-cloud-circuitbreaker-spring-retry` kullanımını envanterleyin; `@Retryable` ve `RetryTemplate` karşılıklarını değerlendirin; özellikle virtual-thread veya yoğun I/O servislerinde `@ConcurrencyLimit` pilotu yapın.

### Bulgu 4

- `title`: JSpecify/null-safety portföy genelinde compile-time sözleşme üretmeye başladı
- `source`: [Spring Framework 7.0 GA](https://spring.io/blog/2025/11/13/spring-framework-7-0-general-availability/) | [Null-safe applications with Spring Boot 4](https://spring.io/blog/2025/11/12/null-safe-applications-with-spring-boot-4/) | [Spring AI 2.0 GA](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now/) | [Spring Cloud Oakwood](https://spring.io/blog/2025/11/25/spring-cloud-2025-1-0-aka-oakwood-has-been-released/) | [This Week in Spring - 7 Temmuz 2026](https://spring.io/blog/2026/07/07/this-week-in-spring-july-07-2026/) | [Spring Tools 5.0](https://spring.io/blog/2025/12/10/spring-tools-5-0-0-released/)
- `author`: Juergen Hoeller | Sébastien Deleuze | Spring Cloud Team | Josh Long | Martin Lippert
- `date`: Kasım 2025 - Temmuz 2026
- `category`: correctness, developer-productivity, api-design
- `tags`: jspecify, null-safety, nullaway, spring-ai, spring-cloud, spring-tools
- `summary`: Nullability bilgisi Framework’ten AI ve Cloud projelerine yayıldı; Spring AI tarafında immutable options ve mandatory/optional alan açıklığı gibi yan etkiler üretti; Spring Tools da bu modeli editör seviyesinde destekliyor.
- `why_it_matters`: Nullability açıkça ifade edilmedikçe büyük Java kod tabanlarında davranış farkı ve NPE sınıfı hatalar pahalı hale gelir. Bu geçiş, derleme ve IDE aşamasında daha fazla problem yakalama fırsatı sunuyor.
- `java_spring_relevance`: Java + Kotlin birlikte kullanan, config/option nesneleri yoğun olan ve Spring AI/Cloud tüketen ekipler için özellikle önemli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: NullAway veya IDE tabanlı null analizi eklemek; opsiyon nesnelerini daha açık hale getirmek; Kotlin interop’u iyileştirmek
- `risks`: Nullability değişimlerini “yalnız annotation” sanmak; migration sırasında optional/mandatory alan farklarını atlamak; generated client/config code’da yanlış varsayım taşımak
- `migration_notes`: Upgrade branch’inde null warning bütçesi ayırın; config/options nesnelerinde zorunlu alanları test edin; Spring AI kullanan projelerde builder/immutable model değişimlerini özellikle okuyun.

### Bulgu 5

- `title`: Spring Boot 4 modülerleşmesi, platform ekipleri için asıl migration yüzeyi
- `source`: [Spring Boot 4.0](https://spring.io/blog/2025/11/20/spring-boot-4-0-0-available-now/) | [Modularizing Spring Boot](https://spring.io/blog/2025/10/28/modularizing-spring-boot/) | [InfoQ Spring Team Interview](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) | [Spring Tools 5 - Ready for Boot 4 and Framework 7](https://spring.io/blog/2025/11/24/towards-spring-tools-5-part1/)
- `author`: Spring Boot Team | Andy Wilkinson | InfoQ | Martin Lippert
- `date`: Ekim - Kasım 2025; etki 2026 boyunca devam ediyor
- `category`: platform-engineering, migration, maintainability
- `tags`: spring-boot-4, modularization, starters, test-starters, shared-libraries, custom-starters
- `summary`: Auto-configuration parçalandı; yeni starter ve test starter düzeni geldi; classic starter’lar geçiş köprüsü olarak sunuldu. Bu, özellikle custom starter ve shared dependency kullanan organizasyonlar için gerçek migration backlog’u oluşturuyor.
- `why_it_matters`: Büyük ekiplerde framework upgrade maliyeti son uygulama kodunda değil, ortak altyapı katmanında patlar. Boot 4 bunu daha görünür hale getiriyor.
- `java_spring_relevance`: Platform ekibi olan, çok servisli, ortak dependency BOM’u ve starter’ı barındıran tüm Spring organizasyonları için yüksek öncelikli.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: Classpath’i inceltmek; daha seçici test bağımlılıkları kullanmak; custom starter’ları sadeleştirmek
- `risks`: `spring-boot-autoconfigure` veya eski starter isimlerine gömülü shared lib’lerin sessiz kırılması; test desteğinin eksik taşınması; upgrade maliyetinin yanlış tahmini
- `migration_notes`: Kurum içi starter ve shared library envanterini çıkarın; yeni starter/test starter eşleşmelerini belirleyin; classic starter’ları geçici köprü olarak düşünün, kalıcı çözüm olarak değil.

### Bulgu 6

- `title`: Mimari kural testleri, Boot 4 modülerleşmesi çağında yeniden anlam kazanıyor
- `source`: [Burak KUTBAY - ArchUnit ile Proje Mimarisini Test Edin](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/) | [Spring Tools 5](https://spring.io/blog/2025/12/10/spring-tools-5-0-0-released/) | [Modularizing Spring Boot](https://spring.io/blog/2025/10/28/modularizing-spring-boot/)
- `author`: Burak KUTBAY | Martin Lippert | Spring Boot Team
- `date`: Temmuz 2026 ve ilişkili 2025 geçiş içerikleri
- `category`: testing, architecture, team-governance
- `tags`: archunit, modular-monolith, package-rules, shared-libraries, regression-prevention
- `summary`: ArchUnit yeni değil; fakat boundary’lerin ve modüllerin daha görünür hale geldiği Boot 4 döneminde, paket erişimi ve katman kurallarını build aşamasında doğrulamak yeniden yüksek değer üretiyor.
- `why_it_matters`: Framework tarafı açık sözleşmelere giderken ekip içi mimari kurallar hâlâ wiki’de kalırsa gerçek fayda sınırlı kalır.
- `java_spring_relevance`: Çok modüllü monolith, ortak kütüphane ve büyük servis kod tabanı olan Java ekipleri için pratik ve düşük maliyetli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta`
- `opportunities`: Paket erişim kurallarını test etmek; cyclic dependency’leri erken yakalamak; migration sonrası boundary regressions’ı azaltmak
- `risks`: Yalnız manuel code review ile mimari kural korumaya çalışmak; shared library bağımlılıklarının katmanları delmesini geç fark etmek
- `migration_notes`: Upgrade branch’inde önce birkaç kritik boundary için ArchUnit kuralı ekleyin; özellikle yeni starter/import düzeninden etkilenen modülleri hedefleyin; tüm sistemi bir anda kapsamak yerine en riskli katmanlardan başlayın.

## Sonuç

Bugünün ana kararı, Spring 7 / Boot 4’ü yalnız “yeni major sürüm” diye okumamak gerektiği. Güçlü sinyal, framework’ün üç şeyi sistematik olarak içeri alması: sözleşme yönetişimi, istemci modeli ve correctness guardrail’leri. Java / Spring ekipleri için en doğru kısa vadeli yatırım; API versioning ve HTTP istemci modelini standardize etmek, retry/null-safety/modülerleşme backlog’unu platform seviyesinde görünür kılmak ve upgrade işini servis bazlı değil shared library bazlı planlamak.
