# Günlük Java / Spring Ekosistem Raporu

Tarih: 29 Haziran 2026  
Tarama zamanı: 29 Haziran 2026 09:11 TSİ  
Odak: yeni bir Spring major duyurusundan çok, mevcut Java ve Spring hatlarında rewrite yerine kontrollü modernizasyonu hızlandıran kabiliyetler; özellikle servis kenarında API versiyonlama, HTTP client yenilenmesi, güvenlik bağımlılık zemini ve JDK seviyesinde sertifika/anahtar işleme

Tarama notu: [Spring Blog](https://spring.io/blog/), [Spring proje sayfaları](https://spring.io/projects), ilgili [Spring GitHub release yüzeyleri](https://github.com/spring-projects), [OpenJDK JEP 538](https://openjdk.org/jeps/538), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/news/), [Josh Long tarafındaki güncel Spring yayınları](https://spring.io/blog/2026/06/23/this-week-in-spring-june-23-2026/), [Gunnar Morling feed'i](https://www.morling.dev/index.xml) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandı. [Oracle Java Blog](https://blogs.oracle.com/java/) yüzeyi bu taramada teknik hata verdi; Oracle tarafındaki Java sinyalleri bu yüzden [Inside Java](https://inside.java/) ve [OpenJDK](https://openjdk.org/) ile çaprazlandı. Baeldung yüzeyi bu ortamda Cloudflare kısıtına girdiği için yalnız açık arama yüzeyi ve birincil kaynak karşılaştırması kullanıldı. Resmi Spring yüzeylerinde 29 Haziran 2026 itibarıyla [Spring Boot `3.5.16`](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/), [Spring Data `2025.0.13`](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/) ve [Spring Cloud `2025.1.2`](https://spring.io/projects/spring-cloud) sonrasına geçen yeni bir kritik bakım alarmı görünmüyor; bu sonuç blog, proje sayfası ve GitHub release yüzeylerinin birlikte değerlendirilmesinden çıkarılmıştır.

## Öne Çıkan Başlıklar

- Bugünün asıl sinyali yeni patch değil; Spring ekosisteminde servis kenarının daha açık sözleşmelerle yönetilmeye başlanması: API versiyonlama artık framework desteği alıyor, HTTP client tarafında da `RestTemplate` sonrası yol netleşiyor.
- [Spring Security `7.1.0`](https://github.com/spring-projects/spring-security/releases/tag/7.1.0), yalnız bir bug fix sürümü gibi görünse de arkasında Reactor, Micrometer, Jackson, Hibernate ve Spring Data BOM zeminini yukarı taşıyan ciddi bir bağımlılık dalgası getiriyor.
- [JEP 538](https://openjdk.org/jeps/538) ile PEM formatı JDK `27` hattında bir kez daha ilk sınıf API olarak güçleniyor; bu, sertifika ve anahtar işleme kodunun uygulama içi yardımcı sınıflardan çıkıp platforma yaklaşması demek.
- [Inside Java'nın agentic coding oturumu](https://inside.java/2026/06/14/cline-migrate-java-oca/), Java yükseltmelerinde "API derleniyor mu?" kontrolünden daha ileri, güvenlik ve operasyon faydası üreten yarı-otomatik upgrade pratiğini öne çıkarıyor.
- Burak KUTBAY tarafında Haziran 2026 içinde yeni bir doğrudan Java/Spring yazısı görünmüyor; görünür son ilgili yazılar hâlâ [HTTP Service Client - Spring Boot 4.0](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/) ve [API Versiyonlama - Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/) ekseninde.

## Kritik Güncellemeler

### 1. Resmi Spring bakım zemini bugün değişmedi

Bugün yeni bir Spring security advisory veya yeni bir yüksek öncelikli bakım sürümü görünmüyor. Resmi yüzeyler hâlâ:

- [Spring Boot `3.5.16`](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/)
- [Spring Data `2025.0.13`](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/)
- [Spring Cloud `2025.1.2`](https://spring.io/projects/spring-cloud)

çizgisini gösteriyor.

Bu önemli; çünkü bugün ekiplerin odağı "yeni acil patch geldi mi?" değil, zaten önlerinde duran modernizasyon işlerini ne zaman ve hangi sırayla yapacakları olmalı.

### 2. Spring Security `7.1.0`, güvenlik katmanını daha geniş bir bağımlılık yükseltme penceresine bağlıyor

[Spring Security `7.1.0` release notları](https://github.com/spring-projects/spring-security/releases/tag/7.1.0) tek satırlık bir bug fix ile açılıyor: opaque token introspector tarafında boş credential kabulü kapanıyor. Fakat aynı sürüm:

- Reactor `2025.0.6`
- Micrometer `1.17.0`
- Spring Framework `7.0.8`
- Spring Data BOM `2026.0.0`
- Hibernate `7.4.0`
- Jackson `2.22.0` ve `3.2.0`

gibi bağımlılıkları da çekiyor.

Bu yüzden Security `7.1` yükseltmesini yalnız auth regression testi olarak değil, observability, serialization ve veri erişimi etkisi olan bir platform yükseltmesi olarak ele almak gerekir.

### 3. JDK `27` hattında PEM işleme platform primitive'ine daha da yaklaşıyor

[JEP 538](https://openjdk.org/jeps/538), kriptografik anahtarları, sertifikaları ve CRL nesnelerini PEM metnine çevirip geri alacak bir API'yi üçüncü preview olarak tanımlıyor. [Inside Java notu](https://inside.java/2026/06/05/jep538-target-jdk27/) bunun JDK `27` hedefine girdiğini açıkça işaret ediyor.

Spring Security, Vault, mTLS, secret rotation ve Kubernetes certificate mount kullanan ekipler için bu, el yapımı Base64/PEM ayrıştırma yardımcılarının zamanla gereksiz hale gelmesi demek.

## Trendler ve Sinyaller

### Trend Kümesi 1: Rewrite yerine kontrollü modernizasyon

Tekrarlayan sinyal:

- [agentic coding ile Java migrasyonu](https://inside.java/2026/06/14/cline-migrate-java-oca/)
- Spring tarafında [API versioning](https://spring.io/blog/2025/09/16/api-versioning-in-spring) ve [HTTP client modernizasyonu](https://spring.io/blog/2025/09/30/the-state-of-http-clients-in-spring)
- Security `7.1.0` ile daha geniş platform BOM kayması

Çıkarım:

- Büyük Java/Spring filolarında "sıfırdan yazalım" yaklaşımı yerine sözleşme, istemci, güvenlik ve upgrade otomasyonu katmanlarını kontrollü biçimde yenilemek daha gerçekçi ana yol haline geliyor.

### Trend Kümesi 2: Servis kenarı artık framework seviyesinde yönetiliyor

Tekrarlayan sinyal:

- `ApiVersionStrategy`
- `ApiVersionInserter`
- `RestClient`, HTTP Interface Client grupları ve `RestTestClient`
- `RestTemplate` için resmi deprecation kararı

Çıkarım:

- Spring ekipleri için dış dünya ile konuşma katmanı artık yalnız annotation ve helper class kombinasyonu değil; frameworkün ilk sınıf modernizasyon alanı.

### Trend Kümesi 3: Güvenlik yükseltmeleri artık bağımlılık topolojisi meselesi

Tekrarlayan sinyal:

- Spring Security `7.1.0` içinde tek bir auth düzeltmesinin arkasına geniş BOM yükseltmeleri eklenmesi
- JDK tarafında PEM gibi güvenlik primitive'lerinin platforma taşınması

Çıkarım:

- Güvenlik yamalarını ayrı bir "security squad" konusu gibi değil, platform engineering ve dependency governance konusu gibi yönetmek gerekiyor.

## Araçlar ve Kütüphaneler

- [RestClient ve HTTP Interface Client grupları](https://spring.io/blog/2025/09/30/the-state-of-http-clients-in-spring): aynı `RestClient` ile birden çok interface client yönetebilmek, yeni Spring Boot `4.0` client starter'ları ve `RestTemplate` sonrası yol haritası açısından yüksek değer taşıyor.
- [ApiVersionStrategy](https://spring.io/blog/2025/09/16/api-versioning-in-spring): header, path, media type veya query param tabanlı versiyonlamayı ortak bir çatı altında topluyor; dağınık custom filter ve interceptor yükünü azaltabilir.
- [JDK `27` PEM API hattı](https://openjdk.org/jeps/538): sertifika/anahtar işleme için custom parser ve shell-out bağımlılığını azaltma potansiyeli var.
- Düşük öncelik: [Oracle Java Extension for VS Code `26.0.0`](https://inside.java/2026/06/08/java-vscode-extension-update/) artık Apache NetBeans `29` tabanlı; `settings.xml`, formatter ve run configuration tarafındaki iyileştirmeler geliştirici ergonomisini artırıyor ama bugünün üretim kararını belirleyen ana başlık değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Boot `3.x` veya `4.x` servisleri arasında uzun ömürlü public API yayıyorsanız, kendi `X-API-Version` filtresi veya controller çoğaltma yaklaşımını yeniden değerlendirmenin zamanı geldi.
- Yeni HTTP entegrasyonlarında `RestTemplate` ile başlamak artık savunulması daha zor bir tercih; `RestClient` veya HTTP Interface Client tabanlı yapı ana yol haline geliyor.
- Opaque token introspection kullanan resource server'larda Spring Security `7.1.0` testleri yalnız auth success/fail senaryolarıyla bitmemeli; dependency kayması nedeniyle serialization, tracing ve ORM entegrasyonları da regression setine girmeli.
- Sertifika ve anahtar işleme yoğun servislerde JDK `27` pilotları açıldığında PEM API hattı özellikle secret rotation, mTLS bootstrap ve trust material parsing kodlarını sadeleştirebilir.
- Java yükseltmesini hâlâ yalnız derleme uyumu olarak yönetiyorsanız, agentic coding ve otomatik upgrade yardımı kısa vadede roadmap hızını doğrudan etkileyebilir.

## Fırsatlar ve Riskler

- Fırsat: API versiyonlama ve client-side version insertion, çok nesilli REST API'leri tek uygulama içinde daha disiplinli taşıyabilir.
- Risk: Versiyonlama desteği gelmiş olması, her endpoint için yeni versiyon açmayı meşrulaştırmaz; versiyon şişmesi ve bakım maliyeti hızla büyür.
- Fırsat: `RestClient` grupları ve Boot `4.0` starter ayrımı, istemci niyetini build seviyesinde daha görünür hale getirir.
- Risk: `RestTemplate` göçü sadece API değişimi değildir; test katmanı, retry/timeout politikası ve message converter davranışı tekrar gözden geçirilmelidir.
- Fırsat: PEM API ile security bootstrap kodu küçülebilir ve operasyonel tutarlılık artabilir.
- Risk: JDK `27` preview yüzeyine erken bağlanmak, API son şekli değişirse gereksiz kod churn üretebilir.
- Fırsat: Agentic coding, yüzlerce serviste JDK/Spring upgrade backlog'unu daha hızlı kapatabilir.
- Risk: Yeterli guardrail olmadan yapılan yarı-otomatik modernizasyon, özellikle güvenlik ve veri erişimi kodunda sessiz davranış değişikliği üretebilir.

## İzlenmesi Gereken Konular

- Spring tarafında `RestTemplate` deprecation sonrası resmi göç kılavuzları daha sertleşiyor mu?
- Spring Boot `4.x` ile `spring-boot-starter-restclient` ve `spring-boot-starter-webclient` ayrımı daha fazla auto-configuration davranışını etkiliyor mu?
- JEP `538` preview sürecinde PEM API kapsamı sertifika zinciri ve şifreli private key kullanımında başka sadeleştirmeler alıyor mu?
- Spring Security `7.1.x` hattında mevcut dependency yükseltme dalgasına bağlı ek regression veya patch notları geliyor mu?
- Java migrasyonunda agentic coding için Oracle/Spring tarafında daha somut guardrail veya referans workflow yayımlanıyor mu?
- Burak KUTBAY tarafında Spring `7` veya Boot `4.x` çizgisini Türkçe örneklerle devam ettiren daha güncel bir seri geliyor mu?

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Resmi Spring bakım yüzeyi bugün yeni acil patch üretmedi; mevcut zemin hâlâ Boot `3.5.16`, Data `2025.0.13` ve Cloud `2025.1.2`
- `source`: [Spring Boot `3.5.16 available now`](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/) | [Spring Data `2025.0.13 released`](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/) | [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud) | [Spring Boot GitHub release `v3.5.16`](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.16)
- `author`: Andy Wilkinson | Mark Paluch | Spring Cloud team
- `date`: 12-25 Haziran 2026, 29 Haziran 2026 tarama doğrulaması
- `category`: release-monitoring, maintenance, platform
- `tags`: spring-boot-3.5.16, spring-data-2025.0.13, spring-cloud-2025.1.2, patch-floor, release-surface
- `summary`: 29 Haziran 2026 sabahı resmi Spring blog, proje sayfaları ve release yüzeylerinde yeni bir yüksek öncelikli bakım duyurusu görünmüyor; mevcut güvenli zemin geçen haftaki sürümler olmaya devam ediyor.
- `why_it_matters`: Günlük radarın değeri yalnız yeni haber bulmak değil, "henüz yeni alarm yok" sonucunu da doğrulamaktır. Bu sayede ekipler upgrade sıralamasını sürekli değiştirmez.
- `java_spring_relevance`: Spring Boot ve Spring Data kullanan ekipler için acil patch zorunluluğu bugün artmadı; planlanan modernizasyon işleri için zaman penceresi korunuyor.
- `actionability`: `izlemelik`
- `impact_level`: `orta`
- `opportunities`: planlı geçişlerin panik olmadan sürdürülmesi, upgrade backlog'unun mimari sıraya göre yönetilmesi
- `risks`: yeni alarm yok diye mevcut upgrade borcunun ertelenmesi
- `migration_notes`: Boot `3.5.16` ve Data `2025.0.13` altındaki sistemler için patch floor hâlâ güncel; fakat bunu "bekleyelim" bahanesine çevirmemek gerekir.

### Bulgu 2

- `title`: Spring Security `7.1.0`, tek bug fix görünümünün altında geniş bir bağımlılık tabanı kayması taşıyor
- `source`: [Spring Security `7.1.0` release notları](https://github.com/spring-projects/spring-security/releases/tag/7.1.0)
- `author`: Spring Security team
- `date`: 9 Haziran 2026
- `category`: security, dependency-management, observability, platform
- `tags`: spring-security-7.1.0, opaque-token, micrometer-1.17.0, reactor-2025.0.6, jackson-2.22.0, hibernate-7.4.0
- `summary`: Sürüm, boş credential kabul eden opaque token introspector davranışını düzeltirken aynı anda Reactor, Micrometer, Spring Framework, Spring Data BOM, Jackson ve Hibernate gibi çekirdek bağımlılıkları da ileri taşıyor.
- `why_it_matters`: Güvenlik yükseltmeleri artık çoğu ekipte salt auth konusu değil; gözlemlenebilirlik, JSON dönüşümü ve ORM davranışı gibi yan alanlara da dokunuyor.
- `java_spring_relevance`: Resource server, OIDC ve method security kullanan Spring ekipleri bu tür sürümleri izole security patch gibi değerlendiremez.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: daha güncel tracing ve serialization zemini, auth katmanında daha sağlam credential doğrulaması
- `risks`: bağımlılık kaymasına bağlı sessiz regression, test matrisinin yetersiz kalması
- `migration_notes`: `7.1.0` denemeleri auth smoke test ile sınırlı olmamalı; tracing, JSON, ORM ve data-access senaryoları da regression setine eklenmeli.

### Bulgu 3

- `title`: Spring Framework `7`, API versiyonlamayı ad hoc anotasyon kombinasyonundan çıkarıp ortak strateji nesnesine taşıyor
- `source`: [API Versioning in Spring](https://spring.io/blog/2025/09/16/api-versioning-in-spring) | [API Versiyonlama - Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/)
- `author`: belirtilmemiş | Burak KUTBAY
- `date`: 16 Eylül 2025 ve 11 Ekim 2025, 29 Haziran 2026 üretim perspektifiyle yeniden önem kazanan kabiliyet
- `category`: api-design, framework, migration, governance
- `tags`: api-versioning, apiversionstrategy, requestmapping-version, header-versioning, path-versioning, deprecation-hints
- `summary`: Spring `7` ile `ApiVersionStrategy`, `@RequestMapping(version=...)`, functional endpoint predicate'leri ve client-side version insertion gibi yapı taşları geliyor; header, path, media type ve query param bazlı stratejiler ortak zemine taşınıyor.
- `why_it_matters`: Bugüne kadar çoğu ekip versiyonlamayı kendi filter/interceptor kombinasyonuyla taşıdı; bu da davranış farkı, deprecation bilgisinin dağılması ve test yükü üretti.
- `java_spring_relevance`: Uzun ömürlü REST API yayımlayan Spring Boot servisleri için bu doğrudan contract governance konusu.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: ortak versiyon çözümleme, response içinde daha tutarlı deprecation sinyalleri, controller katmanında daha okunur kontrat
- `risks`: framework desteği geldi diye her endpoint için agresif versiyon çoğaltma yapılması
- `migration_notes`: mevcut custom version resolver'lar envantere alınmalı; header mı path mi media type mı seçildiği tekrar gerekçelendirilmeli ve mümkünse ortak `ApiVersionStrategy` altına toplanmalı.

### Bulgu 4

- `title`: Spring tarafında HTTP client modernizasyonu resmileşti; `RestTemplate` artık yeni yatırım alanı değil
- `source`: [The state of HTTP clients in Spring](https://spring.io/blog/2025/09/30/the-state-of-http-clients-in-spring) | [HTTP Service Client Nedir - Spring Boot 4.0](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/)
- `author`: belirtilmemiş | Burak KUTBAY
- `date`: 30 Eylül 2025 ve 7 Aralık 2025, 29 Haziran 2026 adoption sinyali
- `category`: http, client, developer-productivity, testing, migration
- `tags`: restclient, resttemplate, http-interface-client, resttestclient, starter-restclient, starter-webclient, importhttpservices
- `summary`: Spring ekibi `RestTemplate` için resmi deprecation yönünü ilan ederken `RestClient`, HTTP Interface Client grupları, `RestTestClient` ve Boot `4.0` client starter ayrımıyla yeni ana yolu netleştiriyor.
- `why_it_matters`: İstemci tarafı çoğu backend ekipte yıllarca arka planda kaldı; artık autoconfiguration niyeti, test API'si ve security entegrasyonu açısından yeni varsayılanlar oluşuyor.
- `java_spring_relevance`: Dış servis çağrısı yapan her Spring Boot uygulaması doğrudan etkilenir; özellikle çok sayıda upstream/downstream entegrasyonu olan mikroservislerde daha da önemlidir.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: daha okunur declarative client tanımları, ortak `RestClient` paylaşımı, daha net test API'si, istemci niyetinin starter seviyesinde ifade edilmesi
- `risks`: `RestTemplate` göçünü yalnız mekanik API dönüşümü sanmak, timeout/retry/message conversion farklarını gözden kaçırmak
- `migration_notes`: yeni kodda `RestTemplate` açmamak iyi varsayılan; mevcut kullanımda önce düşük riskli client'lar `RestClient` veya HTTP Interface Client hattına pilotlanmalı.

### Bulgu 5

- `title`: JEP `538`, PEM işleme işini uygulama yardımcı sınıflarından JDK primitive'ine yaklaştırıyor
- `source`: [JEP 538: PEM Encodings of Cryptographic Objects (Third Preview)](https://openjdk.org/jeps/538) | [Inside Java: JEP targeted to JDK 27 - 538](https://inside.java/2026/06/05/jep538-target-jdk27/)
- `author`: Anthony Scarpino | Inside Java editorial note
- `date`: 5 Haziran 2026 ve 17 Haziran 2026 güncelleme
- `category`: jdk, security, cryptography, platform
- `tags`: jdk27, pem, x509, pkcs8, encrypted-private-key, certificate, preview-api
- `summary`: JEP `538`, anahtar, sertifika ve sertifika iptal listelerini PEM metnine çevirip geri açan bir API tanımlıyor; PKCS#8, X.509 ve ilgili standart temsilleri hedefliyor.
- `why_it_matters`: Pek çok Java servisi hâlâ PEM içeriğini custom util, OpenSSL çağrısı veya üçüncü parti yardımcılarla işliyor; bu alan hata ve güvenlik borcu biriktiriyor.
- `java_spring_relevance`: Spring Security, Spring Vault, mTLS, Kubernetes secret mount ve certificate rotation kullanan servislerde doğrudan pratik değeri var.
- `actionability`: `izlemelik`
- `impact_level`: `orta-yüksek`
- `opportunities`: daha az custom parser, daha sade bootstrap kodu, platform desteğine daha yakın güvenlik altyapısı
- `risks`: preview API'ye erken bağlanmak, JDK `27` öncesi üretim standartlarına fazla hızlı yansıtmak
- `migration_notes`: JDK `27` pilotu açıldığında mevcut PEM yardımcı sınıfları envantere alınmalı; ancak doğrudan prod refactor yerine önce certificate bootstrap ve test utility'lerinde denenmeli.

### Bulgu 6

- `title`: Agentic coding, Java yükseltmesini sadece derleme uyumu değil güvenlik ve operasyon iyileştirmesi olarak ele alma yönü veriyor
- `source`: [How Agentic Coding Can Help You Migrate Java Applications Faster](https://inside.java/2026/06/14/cline-migrate-java-oca/)
- `author`: Mahdi Kefayati | Saoud Rizwan (guest)
- `date`: 14 Haziran 2026
- `category`: migration, developer-productivity, modernization, ai-assisted-engineering
- `tags`: agentic-coding, java-migration, lts-upgrade, modernization, guardrails, productivity
- `summary`: Inside Java oturumu, son LTS'e geçişi yalnız API uyumu kontrolü değil; güvenlik, performans ve operasyon sadeleşmesi üreten daha kapsamlı bir modernizasyon akışı olarak konumluyor ve agentic coding'i akıllı eşlikçi olarak sunuyor.
- `why_it_matters`: Çok servisli Java filolarında upgrade backlog'u genelde insan kapasitesine takılır; yarı-otomatik yardım bu darboğazı azaltabilir.
- `java_spring_relevance`: Spring Boot ve Spring Cloud filolarında framework/JDK yükseltmeleri çoğu zaman birlikte yürür; burada kazanılan hız doğrudan teslim takvimine yansır.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: upgrade hazırlığını hızlandırmak, boilerplate değişiklikleri otomatikleştirmek, ekip kapasitesini kritik review alanlarına kaydırmak
- `risks`: zayıf prompt ve guardrail ile sessiz davranış değişikliği, özellikle config ve security katmanında yanlış öneri
- `migration_notes`: önce iç araç veya tek servis pilotu açılmalı; agentic coding çıktıları zorunlu test, diff review ve güvenlik checklist'i ile birlikte kullanılmalı.

## Sonuç

29 Haziran 2026 radarının en güçlü mesajı yeni bir Spring alarmı değil; Java ve Spring tarafında kontrollü modernizasyonun artık daha somut primitive'lerle yapılabiliyor olması. Senior bir Java/Spring ekip için bugünün rasyonel aksiyonu, mevcut patch zeminini korurken API versiyonlama ve HTTP client yenilenmesini roadmap'e almak, Security `7.1` yükseltmelerini dependency-topology gözüyle test etmek ve JDK `27` pilotlarında PEM işleme ile upgrade otomasyonunu birlikte değerlendirmektir.
