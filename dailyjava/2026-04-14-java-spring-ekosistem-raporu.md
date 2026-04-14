# Günlük Java / Spring Ekosistem Raporu

Tarih: `14 Nisan 2026, 09:01 TRT`

Kapsam: `13 Nisan 2026 09:46 TRT` ile `14 Nisan 2026 09:01 TRT` arasındaki günlük tarama.

Odak kaydırma notu: Önceki raporlarda ayrıntılı işlendiği için `Spring AI memory/context`, `Boot actuator CVE`, `Spring Data typed paths`, `Spring Kafka/Modulith` ve `JDK 27 PQC/TLS` bugün tekrar ana bulgu yapılmadı.

Kaynak tarama notu: [Spring Blog](https://spring.io/blog/), [Spring proje sayfaları](https://spring.io/projects), [Spring Security advisory sayfaları](https://spring.io/security), [Spring Security referans dokümantasyonu](https://docs.spring.io/spring-security/reference/index.html), [OpenJDK proje sayfaları](https://openjdk.org/projects/), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), Josh Long’un güncel Spring içerikleri, Gunnar Morling’in blog akışı, ilgili GitHub/release kaynakları ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandı. Baeldung, Gunnar Morling ve Burak KUTBAY tarafında bugün öncelik sırasını değiştiren yeni birinci seviye release/security duyurusu çıkmadı; bu nedenle rapor üretim etkisi daha yüksek resmi sinyallere odaklandı.

## Öne Çıkan Başlıklar

- [CVE-2026-22750](https://spring.io/security/cve-2026-22750), Spring Cloud Gateway `4.2.0` için yüksek öncelikli bir konfigürasyon güvenliği sorunu: `spring.ssl.bundle` ayarı sessizce yok sayılabiliyor ve varsayılan SSL yapılandırmasına düşülüyor.
- Spring Security `7.0.4` dokümantasyonu artık MFA’yı ek özelleştirme değil, `FactorGrantedAuthority`, `AuthorizationManagerFactory` ve `@EnableMultiFactorAuthentication` ile resmi güvenlik deseni olarak konumluyor.
- [Inside Java, 13 Nisan 2026](https://inside.java/2026/04/13/quality-heads-up/) JDK 27 heads-up yayımladı: bakım dışı çeviri kaynakları kaldırılıyor. Oracle JDK etkilenmiyor; fakat varsayılan OpenJDK build’lerinde locale-specific JDK mesajlarına yaslanan testler İngilizceye düşebilir.
- [Spring I/O 2026 resmi programı](https://spring.io/blog/2026/04/10/spring-io-2026-broadcom-speakers) artık sadece konferans duyurusu değil, maintainer öncelik haritası gibi okunmalı: Boot 4 restructuring, Security 7 MFA/OAuth2, resilience, observability, gRPC, Kotlin idiom’ları ve Loom/streaming aynı kümeye sıkışmış durumda.

## Kritik Güncellemeler

1. Spring Cloud Gateway tarafında “güvenli sanıyordum” tipi bir risk açığa çıktı. [Spring Security advisory](https://spring.io/security/cve-2026-22750) açıkça söylüyor: `spring.ssl.bundle` konfigürasyonu `4.2.0` sürümünde sessizce yok sayılabiliyor. Bu, özellikle outbound TLS, mTLS, özel truststore/keystore ve compliance kontrollü gateway kurulumlarında, beklenen sertifika zinciri yerine default SSL davranışının devreye girmesi demek. Bu bug sıradan feature regression değil, operasyonel güvenlik riski.

2. Spring Security 7 için ana hikaye artık sadece DSL göçü değil. Resmi [“What’s New in Spring Security 7.0”](https://docs.spring.io/spring-security/reference/whats-new.html) ve [MFA referansı](https://docs.spring.io/spring-security/reference/7.0-SNAPSHOT/servlet/authentication/mfa.html), MFA desteğini çekirdek feature olarak koyuyor. Yani Security 7 yükseltmesi yapan ekipler için mesele yalnızca `authorizeRequests` -> `authorizeHttpRequests` ya da matcher değişimi değil; step-up auth ve factor tabanlı yetkilendirme modellerini kod tabanına nasıl oturtacakları.

3. JDK 27 tarafında düşük görünür ama gerçek bir CI/uyumluluk başlığı var. [Inside Java Quality Outreach heads-up](https://inside.java/2026/04/13/quality-heads-up/), Oracle dışı build’lerde bakımı yapılmayan çeviri resource’larının kaldırıldığını duyuruyor. Uygulama davranışı çoğu ekipte değişmeyecek; ancak belirli locale’lerde tam hata mesajı assert eden testler, snapshot log kıyasları ve tool parsing kodu İngilizceye düşen mesajlar yüzünden sapabilir.

4. Bugün yeni bir Spring Boot / Spring Framework / Spring Cloud GA duyurusu çıkmadı. Bu da başlı başına sinyal: bugünün değeri yeni artifact sürümünden çok mevcut konfigürasyonların güvenlik doğruluğu ve 2026 yol haritasının maintainer anlatısıyla kesişmesinde.

## Trendler ve Sinyaller

1. Yığın genelinde “örtük varsayımlar” temizleniyor. Gateway advisory sessizce ignored edilen SSL ayarını görünür kılıyor. Security 7, auth factor’larını açık yetki nesnelerine dönüştürüyor. JDK 27 ise bakımı yapılmayan locale resource’larını temizleyip belirsiz davranışları azaltıyor. Ortak sinyal şu: çalışan ama ne yaptığı tam belli olmayan konfigürasyonlara tolerans azalıyor.

2. Spring tarafında 2026 gündemi yeni annotation eklemekten çok runtime davranışını sertleştirmek. Spring I/O 2026 programında öne çıkan başlıklar `resilience`, `observability`, `Boot 4 restructuring`, `Security 7`, `gRPC`, `Kotlin idioms`, `Loom/streaming`. Bu, portföyün şu anda “daha fazla feature” yerine “daha öngörülebilir runtime” peşinde olduğunu gösteriyor.

3. Güvenlik artık sadece edge concern değil, framework API tasarımına giriyor. MFA faktörleri, missing authority routing, relative redirect davranışı, SSL bundle kullanımı ve custom client trust materyali artık config dosyasında unutulacak detaylar değil; mimari kararlar.

## Araçlar ve Kütüphaneler

Bugün yeni birinci seviye JVM/Spring OSS release dalgası öne çıkmadı. Dikkat edilmesi gereken yüzeyler daha çok mevcut araçların doğru kullanımı tarafında:

- `Spring Cloud Gateway`: Yeni kütüphane değil; ama [CVE-2026-22750](https://spring.io/security/cve-2026-22750) nedeniyle sürüm hattı seçimi kritik. OSS kullanıcıları için desteklenen hedef artık `5.0.2` veya `5.1.1`; `4.2.0` hattında kalmak savunulamaz hale geliyor.
- `Spring Security 7 MFA API'leri`: [Resmi referans](https://docs.spring.io/spring-security/reference/7.0-SNAPSHOT/servlet/authentication/mfa.html) ile birlikte `FactorGrantedAuthority`, `@EnableMultiFactorAuthentication`, `AuthorizationManagerFactory` ve `oneTimeTokenLogin()` artık niş feature değil, gerçek seçenek.
- `Baeldung` ve `Burak KUTBAY` tarafı: Bugün öncelik sırasını değiştiren yeni release haberi yok. Buna karşılık öğretici içeriklerin giderek daha çok test, runtime config ve JDK iç mekanikleri çevresinde yoğunlaşması dikkat çekiyor; ancak bu bugünün ana aksiyon maddesi değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Eğer `Spring Cloud Gateway 4.2.0` kullanıyorsanız, config review beklememeli. `spring.ssl.bundle` ile gerçekten hangi trust/key materyalinin yüklendiğini integration test veya startup assertion ile doğrulayın. Sadece YAML okumak yetmez.
- Security 7/Boot 4 planlayan ekipler MFA’yı ayrı ürün talebi gelince yapılacak custom flow olarak değil, yetki modeli tasarımının parçası olarak düşünmeli. `ROLE_*` ile `FACTOR_*` birlikte evrilecek.
- JDK 27’yi erkenden deneyen ekipler testlerde tam exception mesajı kıyaslama, locale-sensitive snapshot ve parser mantığını azaltmalı. Hata türünü, kodunu veya davranışı assert etmek daha dayanıklı.
- Spring I/O konuşmaları yayımlandığında backlog çıkarımı yapın: `Boot 4 restructuring`, `Security 7`, `observability`, `gRPC`, `Loom` ve `Kotlin` başlıkları için ayrı spike’lar daha verimli olur; tek büyük “Spring 2026 araştırması” işi genelde verimsizdir.

## Fırsatlar ve Riskler

Fırsatlar:

- Gateway/SSL katmanında config smoke testlerini standartlaştırmak.
- Security 7 ile factor-based auth ve step-up auth modelini custom filter yazmadan kurmak.
- JDK 27 EA build’lerini CI’ye erken alıp locale/test coupling borcunu temizlemek.
- Spring I/O içeriğini eğitim değil, roadmap girdi seti olarak kullanmak.

Riskler:

- `spring.ssl.bundle` tanımlı olduğu için gateway’nin doğru sertifika materyaliyle çalıştığını varsaymak.
- Security 7 migration’ını sadece DSL refactor olarak görüp MFA, redirect ve matcher etkilerini gözden kaçırmak.
- OpenJDK/Temurin/Oracle JDK farklarını “mesaj metni zaten aynı kalır” diye varsaymak.
- Konferans oturumlarını ürün olgunluğu ile karıştırıp erken feature’ları platform standardı ilan etmek.

## İzlenmesi Gereken Konular

- Spring tarafında `CVE-2026-22750` sonrası ek advisory, patch guidance veya Cloud Gateway release notu geliyor mu?
- Spring I/O 2026 sonrası `Boot 4 restructuring`, `Security 7 MFA`, `observability`, `gRPC`, `Loom` oturumlarının video/slayt ve örnek repo yayınları.
- Spring Security `7.1.0-M3` sonrası MFA ve missing authority redirect davranışında API sadeleşmesi olup olmayacağı.
- JDK 27 Quality Outreach kanalından gelecek yeni compatibility heads-up’lar.
- Spring Cloud takımlarında SSL bundle kullanımı için config doğrulama/test pattern’lerinin standardize edilip edilmediği.

## Kaynak Bazlı Bulgular

### 1. Spring Cloud Gateway 4.2.0’da SSL bundle ayarı sessizce devre dışı kalabiliyor

- **title:** `Spring Cloud Gateway için sessiz SSL bundle bypass açığı`
- **source:** [Spring Security Advisory: CVE-2026-22750](https://spring.io/security/cve-2026-22750), [InfoQ Java Roundup, 13 Nisan 2026](https://www.infoq.com/news/2026/04/java-news-roundup-apr06-2026/)
- **author:** `Spring advisory` / `Michael Redlich`
- **date:** `9 Nisan 2026`
- **category:** `security-update`
- **tags:** `spring-cloud-gateway`, `ssl-bundle`, `tls`, `configuration`, `cve-2026-22750`, `gateway`
- **summary:** `Spring Cloud Gateway 4.2.0`, `spring.ssl.bundle` konfigürasyonunu sessizce yok sayıp varsayılan SSL yapılandırmasına dönebiliyor.
- **why_it_matters:** Bu tür sessiz düşüşler yanlış truststore/keystore kullanımı, mTLS sapması ve compliance ihlali yaratabilir; üstelik log veya startup hatası vermeden gerçekleşmesi riski büyütür.
- **java_spring_relevance:** Spring Cloud Gateway kullanan Java ekipleri için konu doğrudan edge ve outbound client güvenliği. Özellikle gateway üzerinden arka sistemlere TLS yapan kurulumlar etkilenebilir.
- **actionability:** `immediate`
- **impact_level:** `high`
- **opportunities:** Supported hatlara geçişi hızlandırmak, gateway startup smoke test’lerine TLS materyali doğrulaması eklemek.
- **risks:** Güvenli sanılan bağlantıların default SSL ile çalışması, audit sırasında görünmeyen zafiyet, unsupported `4.2.x` hattında kalma maliyeti.
- **migration_notes:** Advisory’ye göre enterprise olmayan kullanıcılar `4.2.0` yerine `5.0.2` veya `5.1.1` gibi desteklenen OSS sürümlere geçmeli; enterprise müşteriler `4.2.1+` hattına çıkmalı.

### 2. Spring Security 7 MFA’yı resmi güvenlik modeli haline getiriyor

- **title:** `Spring Security 7 ile factor-based MFA artık first-class`
- **source:** [What’s New in Spring Security 7.0](https://docs.spring.io/spring-security/reference/whats-new.html), [Spring Security MFA Reference](https://docs.spring.io/spring-security/reference/7.0-SNAPSHOT/servlet/authentication/mfa.html), [Spring I/O 2026 resmi programı](https://spring.io/blog/2026/04/10/spring-io-2026-broadcom-speakers), [Baeldung: Multi-Factor Authentication in Spring Security 7](https://www.baeldung.com/spring-security-7-mfa)
- **author:** `Spring Security Team`, `Jason Konicki`, `Sagar Verma`
- **date:** `10 Nisan 2026`
- **category:** `security-architecture`
- **tags:** `spring-security-7`, `mfa`, `factorgrantedauthority`, `authorizationmanagerfactory`, `oauth2`, `boot-4`
- **summary:** Spring Security 7, MFA’yı ayrı bir eklenti veya custom filter seti olarak değil; auth factor’ları, authorization manager’ları ve login akışlarını kapsayan resmi framework yüzeyi olarak sunuyor.
- **why_it_matters:** Kurumsal ekipler step-up auth, kritik endpoint koruması ve kısa süreli re-auth desenlerini daha az custom kodla kurabilir. Bu, güvenlik modelini sadeleştirebilir ama auth mimarisini de yeniden düşünmeyi gerektirir.
- **java_spring_relevance:** Boot 4 + Security 7 hattına geçecek Spring uygulamaları için bu doğrudan domain/security tasarım kararıdır. `ROLE_*` tabanlı yetkilendirme tek başına yeterli olmayabilir.
- **actionability:** `near-term-pilot`
- **impact_level:** `medium-high`
- **opportunities:** Admin, ödeme, profil güncelleme, kritik operasyon ekranlarında factor-based policy tasarlamak; custom MFA akışlarını azaltmak.
- **risks:** Eski matcher/redirect varsayımlarıyla yeni factor modelini karıştırmak, migration’ı sadece DSL temizliği sanmak, UX akışını test etmeden canlıya çıkmak.
- **migration_notes:** Spring Security migration rehberiyle birlikte düşünülmeli; Boot 4 son patch seviyesi, `authorizeHttpRequests`, `PathPatternRequestMatcher`, relative redirect ve Jackson 3 uyumu birlikte ele alınmalı.

### 3. JDK 27 locale-sensitive testleri sessizce bozabilecek bir temizlik yapıyor

- **title:** `JDK 27 bakım dışı çeviri kaynaklarını kaldırıyor`
- **source:** [Inside Java: Quality Outreach Heads-up - JDK 27](https://inside.java/2026/04/13/quality-heads-up/), [OpenJDK JDK 27 project page](https://openjdk.org/projects/jdk/27/)
- **author:** `David Delabassee`
- **date:** `13 Nisan 2026`
- **category:** `compatibility-testing`
- **tags:** `jdk-27`, `quality-outreach`, `locale`, `i18n`, `ci`, `oracle-jdk`, `openjdk`
- **summary:** JDK 27, bakım yapılmayan locale resource’larını kaldırıyor; Oracle JDK zaten bunları build aşamasında dışlıyordu, fakat varsayılan OpenJDK build’lerinde davranış farklılaşabiliyor.
- **why_it_matters:** Kodunuz değil ama testleriniz kırılabilir. Özellikle locale-specific exception text, tool output veya snapshot log kıyasları yapan ekipler için bu gerçek bir bakım konusu.
- **java_spring_relevance:** Spring Boot servisleri çok sayıda integration test, container test ve farklı vendor JDK kombinasyonu kullanıyor. Build vendor’ı değiştiğinde “aynı hata mesajı” varsayımı artık daha kırılgan.
- **actionability:** `monitor-and-test`
- **impact_level:** `low-medium`
- **opportunities:** Testlerde metin bağımlılığını azaltmak, JDK vendor çeşitliliğini CI’ye taşımak, assertion stratejilerini sağlamlaştırmak.
- **risks:** Locale metni parse eden eski test/util kodunun sessiz bozulması, farklı JDK dağıtımlarında tutarsız test sonucu.
- **migration_notes:** Full message assert’leri yerine exception type, code veya davranış bazlı assertion’a geçmek daha doğru; Temurin/OpenJDK EA test hattı eklemek faydalı.

### 4. Spring I/O 2026 programı maintainer önceliklerini üretim gündemine çeviriyor

- **title:** `Spring I/O 2026, 2026 backlog’unun ana başlıklarını netleştiriyor`
- **source:** [Spring Blog: Catch the Spring Team at Spring I/O 2026](https://spring.io/blog/2026/04/10/spring-io-2026-broadcom-speakers), [Spring Boot project page](https://spring.io/projects/spring-boot), [Spring Security project page](https://spring.io/projects/spring-security)
- **author:** `Jason Konicki`
- **date:** `10 Nisan 2026`
- **category:** `ecosystem-roadmap-signal`
- **tags:** `spring-io`, `spring-boot-4`, `spring-security-7`, `resilience`, `observability`, `grpc`, `loom`, `kotlin`
- **summary:** Resmi programda `Bootiful Spring Boot 4`, `Core Resilience Features in Spring Framework 7`, `New in Spring Security 7`, `Demystifying Observability`, `Inside Spring Boot 4: Restructuring for the Future`, `Bootiful gRPC`, `Idiomatic Kotlin applications with Spring Boot 4` ve `Concurrency and Streaming in the Age of Loom` gibi başlıklar öne çıkıyor.
- **why_it_matters:** Bu başlıklar release notu değil; fakat hangi alanların önümüzdeki haftalarda örnek, blog, demo repo ve migration anlatısıyla destekleneceğini gösteriyor.
- **java_spring_relevance:** Enterprise Spring ekipleri için eğitim/backlog yatırımı nereye yapılmalı sorusuna pratik cevap veriyor: Boot 4 yapı değişiklikleri, Security 7, gözlemlenebilirlik, gRPC ve Loom.
- **actionability:** `roadmap-planning`
- **impact_level:** `medium`
- **opportunities:** Teknoloji radarını konuşma başlıklarına göre bölmek; migration spike’larını daha hedefli açmak; ekip içi enablement planını erkenden kurmak.
- **risks:** Konferans sinyalini ürün olgunluğu ile karıştırmak; henüz ekipte ihtiyaç netleşmeden her konuşma başlığını standarda dönüştürmek.
- **migration_notes:** Video/slayt/örnek repo yayınları geldikçe değerlendirilmelidir; özellikle Boot 4 restructuring ve Security 7 başlıkları doğrudan migration checklist’ine çevrilebilir.

## Sonuç

Bugünün en güçlü mühendislik mesajı şu: Java/Spring ekosistemi yeni feature sayısını artırmaktan çok, gizli varsayımları görünür kılmaya ve runtime davranışını daha açık hale getirmeye çalışıyor. Spring Cloud Gateway advisory, Spring Security 7 MFA modeli ve JDK 27 quality heads-up aynı yönde konuşuyor.

Senior Java / Spring ekipleri için kısa vadede en doğru hamle; gateway TLS konfigürasyonlarını doğrulamak, Security 7 migration’ını factor-based auth boyutuyla ele almak ve JDK 27 EA hattını locale/test coupling açısından erkenden denemek. Bahar 2026 roadmap’inde gürültü çok; ama üretim etkisi en yüksek işler hâlâ güvenlik doğruluğu, migration hazırlığı ve test sağlamlığı.
