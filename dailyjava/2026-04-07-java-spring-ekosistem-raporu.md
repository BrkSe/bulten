# Günlük Java / Spring Ekosistem Raporu

Tarih: `7 Nisan 2026`

Kapsam: `6 Nisan 2026 09:00 TRT` ile `7 Nisan 2026 09:00 TRT` arasındaki günlük tarama. Önceki raporlarda ayrıntılı işlendiği için `Spring Cloud 2025.0.2 / CVE-2026-22739`, `Spring Security` patch dalgası, `Boot 4.1` preview oynaklığı, `Tomcat / Log4j` bakım hattı, `Spring Data` typed property paths ve genel `JDK 26` operability anlatısı bu raporda tekrar merkez yapılmadı.

Kaynak tarama notu: [Spring Blog](https://spring.io/blog/), Spring proje ve release sayfaları, [OpenJDK JEP Index](https://openjdk.org/jeps/0), [jdk.java.net](https://jdk.java.net/), [Inside Java](https://inside.java/), Oracle Java kaynakları, [InfoQ Java](https://www.infoq.com/java/), Baeldung arşivi, Josh Long'un Spring içerikleri, Gunnar Morling'in blog/GitHub akışı, ilgili GitHub release sayfaları ve Burak KUTBAY blogu kontrol edildi. Bugün yüksek sinyal Spring tarafında yeni bir büyük duyurudan değil, JDK uyumluluğu, runtime paketleme, Jakarta EE standardizasyonu, scheduler politikaları ve üretim operasyon pratiklerinden geldi.

## Öne Çıkan Başlıklar

- Resmi Spring akışında 7 Nisan sabahı itibarıyla yeni, yüksek etkili bir Spring Framework / Boot / Cloud duyurusu görünmüyor. Bu nedenle bugün Spring ekipleri için en doğru aksiyon yeni başlık kovalamak değil, mevcut `Boot 3.5.x / 4.0.x` ve `Cloud 2025.0.x` bakım hattında upgrade testlerini disipline etmek.
- `Project Leyden` çevresindeki AOT cache, AOT method profiling, `jlink` ve `jmod` pratikleri Spring Boot servisleri için daha somut bir ara yol oluşturuyor: GraalVM native image kadar agresif olmayan, ama container boyutu, cold start ve startup stabilitesi için pilot edilebilir bir JVM yolu.
- `JDK 27` tarafında `java.locale.useOldISOCodes` sistem özelliğinin kaldırılacak olması, eski `iw / in / ji` dil kodlarına bağımlı servislerde API sözleşmesi, test datası, raporlama ve lokalizasyon regresyonu riski yaratıyor.
- `Jakarta EE 12` çevresindeki güvenlik spesifikasyonları tartışması, özellikle Authorization'ın Web Profile'a alınması yönüyle Spring Security kullanan ekipler için doğrudan geçiş zorunluluğu değil, ancak Jakarta Servlet / Security ekosistemiyle uyumluluk açısından izlenmesi gereken bir standart sinyali.
- JobRunr'ın karbon duyarlı scheduling hattı, arka plan işlerinde yalnızca cron doğruluğu değil, enerji yoğunluğu, coğrafya, maliyet ve SLO politikasının birlikte düşünülmeye başladığını gösteriyor. Bu sinyal hemen standart yapılacak kadar olgun değil, ama batch ve raporlama yükleri için izlemeye değer.

## Kritik Güncellemeler

Bugün yeni bir kritik Spring güvenlik duyurusu veya Spring Boot GA çıkışı tespit edilmedi. [Spring Blog](https://spring.io/blog/) üzerinde son görünen ana akış, [This Week in Spring, 31 Mart 2026](https://spring.io/blog/2026/03/31/this-week-in-spring-march-31st-2026) ve [Spring Cloud 2025.0.2 duyurusu](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released/) etrafında duruyor. Bunlar önceki raporlarda işlendiği için bu raporda tekrar açılmadı.

`JDK 27` uyumluluğu tarafında `java.locale.useOldISOCodes` özelliğinin kaldırılması daha somut bir risk. [Inside Java'nın 10 Mart 2026 kalite uyarısı](https://inside.java/2026/03/10/quality-heads-up/) JDK 17'den beri BCP 47 kodlarına geçişin beklenen davranış olduğunu, JDK 25'te eski özelliğin deprecated olduğunu ve JDK 27'de artık yok sayılacağını belirtiyor. Bu, Spring MVC / WebFlux endpoint'lerinde `Locale`, mesaj kaynakları, raporlama ve dış sistem entegrasyonları için test edilmesi gereken düşük görünürlüklü bir uyumluluk başlığı.

`Jakarta EE 12` tarafında [InfoQ'nun 6 Nisan 2026 Java roundup'ı](https://www.infoq.com/news/2026/04/java-news-roundup-mar30-2026/), Jakarta security spesifikasyonlarının nasıl konumlanacağına dair güncel tartışmayı öne çıkarıyor. Bu Spring uygulamaları için hemen kod değişikliği anlamına gelmiyor, ancak Spring Framework ve Spring Security'nin Jakarta namespace ve Servlet ekosistemiyle yaşadığı uyumluluk ilişkisi nedeniyle izlenmeli.

## Trendler ve Sinyaller

1. Runtime optimizasyonu artık yalnızca native image konuşması değil.
   `JEP 514`, `JEP 515`, `jlink` ve `jmod` pratikleri, Spring Boot servislerinde daha küçük runtime imajları, daha kontrollü startup davranışı ve eğitim koşularıyla ölçülebilir warmup iyileştirmeleri için ara seçenek oluşturuyor. Bu, GraalVM native image'a geçemeyen ama cold start veya container imajı sorunu yaşayan ekipler için daha gerçekçi bir pilot alanı.

2. Java upgrade riski giderek daha fazla "küçük semantik değişiklik" şeklinde geliyor.
   `java.locale.useOldISOCodes` örneği, compile hatası üretmeyen ama veri sözleşmesi ve test datası üzerinde etkisi olan bir uyumluluk riski. Java 21 sonrası düzenli JDK yükselten ekiplerde bu tür kontroller upgrade checklist'ine girmeli.

3. Standart ve framework katmanı tekrar yakınlaşıyor.
   Jakarta EE 12 güvenlik profili tartışması, Spring Security kullanan ekipleri bugün değiştirmese de Jakarta Servlet, Security, Authorization ve Authentication tarafındaki yönü izlemeyi değerli kılıyor. Özellikle full-profile app server ile Spring Boot servislerini aynı kurum içinde çalıştıran ekiplerde bu tür farklar governance konusuna dönüşebilir.

4. Scheduler politikası SLO, maliyet ve sürdürülebilirlik eksenine genişliyor.
   JobRunr'ın karbon duyarlı scheduling sinyali, batch ve arka plan işlerinin "ne zaman çalışmalı" sorusunu artık yalnızca cron veya worker kapasitesiyle cevaplamıyor. Spring ekipleri için bu, ertelenebilir job sınıflandırması, iş öncelikleri ve region bağımlılıklarının daha açık modellenmesi demek.

5. Supply-chain ve platform operasyonu Java ekipleri için hala yüksek öncelikli.
   InfoQ tarafındaki Log4Shell sonrası güvenlik hazırlığı ve Duolingo Kubernetes geçiş vaka çalışması, Java/Spring ekiplerinin dependency firewall, SBOM, GitOps, hücresel mimari ve AWS limitleri gibi konuları uygulama mimarisinden ayrı düşünemeyeceğini tekrar gösteriyor.

## Araçlar ve Kütüphaneler

- `OpenJDK / Project Leyden`: [JEP 514: Ahead-of-Time Command-Line Ergonomics](https://openjdk.org/jeps/514) ve [JEP 515: Ahead-of-Time Method Profiling](https://openjdk.org/jeps/515), JVM üzerinde AOT tabanlı startup/warmup çalışmalarını daha kullanılabilir hale getiren parçalar olarak izlenmeli.
- `jlink / jmod`: [Oracle jmod dokümantasyonu](https://docs.oracle.com/en/java/javase/25/docs/specs/man/jmod.html) ve JDK runtime image araçları, özellikle slim container image ve kontrollü JVM dağıtımı isteyen platform ekipleri için anlamlı.
- `JobRunr`: Josh Long'un [This Week in Spring](https://spring.io/blog/2026/03/31/this-week-in-spring-march-31st-2026) akışında işaret ettiği karbon duyarlı scheduling hattı, Spring tabanlı batch ve arka plan işlerinde izlenecek düşük-orta öncelikli bir araç sinyali.
- `Jakarta EE 12`: [InfoQ roundup](https://www.infoq.com/news/2026/04/java-news-roundup-mar30-2026/) içinde geçen milestone ve güvenlik profili tartışmaları, Spring'e doğrudan bağımlı olmasa da Jakarta tabanlı API yüzeyleri için izlenmeli.
- `Baeldung / Burak KUTBAY / Gunnar Morling`: Bugünkü taramada önceki iki raporun öncelik sıralamasını değiştirecek yeni yüksek etkili Spring/JVM bulgusu üretmedi. Gunnar Morling'in `Hardwood` başlığı 5 Nisan raporunda işlendiği için tekrar edilmedi.

## Java / Spring Geliştiricileri İçin Etkiler

Spring Boot ekipleri için bugün en pratik çıkarım, upgrade çalışmasını yalnızca Spring sürümüyle sınırlamamak. `JDK 27` locale değişikliği gibi küçük görünen runtime semantik başlıkları, `Locale` tabanlı API çıktısı, cache key, raporlama dosyası, arama indeksi veya audit kaydı üreten servislerde gerçek veri farkına neden olabilir.

AOT ve custom runtime image tarafında aceleci bir standartlaşma önerilmez. Ancak yüksek QPS, kısa ömürlü pod, yoğun scale-to-zero veya sık deploy yapan Spring servislerinde `jlink`, AOT cache ve method profiling için bir laboratuvar branch'i açmak artık daha anlamlı. Bu çalışma, native image geçişinin operasyonel maliyetini üstlenmeden startup ve imaj boyutu üzerinde veri üretir.

Jakarta EE 12 güvenlik tartışması, Spring Security kullanan ekipler için hemen migration konusu değil. Yine de kurum içinde Spring Boot servisleri, Jakarta EE app server uygulamaları ve ortak security library'leri beraber yaşıyorsa, Authorization / Authentication / Security spesifikasyon ayrımlarının değişmesi ortak abstraction tasarımını etkileyebilir.

Arka plan işleri tarafında JobRunr sinyali, scheduler tasarımını yeniden düşünmek için iyi bir uyarı. Her job cron'a bağlanmamalı; bazı işler acil, bazıları ertelenebilir, bazıları region'a bağımlı, bazıları ise maliyet veya karbon yoğunluğu düşük pencerelere kaydırılabilir. Bunu kodda açık bir policy modeli olarak tutmak, daha sonra araç değişse bile faydalı kalır.

## Fırsatlar ve Riskler

Fırsatlar:

- Spring Boot servislerinde `jlink` ve AOT cache pilotu ile cold start, container image boyutu ve JVM warmup süresi için ölçülebilir veri üretmek.
- `Locale` bağımlı endpoint ve batch çıktılarında JDK 27 öncesi kontrat testi eklemek.
- Ertelenebilir batch işlerini JobRunr, Quartz veya platform scheduler bağımsız şekilde policy bazlı sınıflandırmak.
- SBOM, dependency firewall ve dependency confusion kontrollerini Maven/Gradle pipeline'ında otomatik gate haline getirmek.
- Kubernetes geçişlerinde GitOps, hücresel izolasyon ve cloud provider limitlerini uygulama roadmap'inin parçası yapmak.

Riskler:

- AOT / custom runtime image pilotlarını ölçmeden standartlaştırmak, debug edilebilirliği ve operasyonel basitliği azaltabilir.
- `java.locale.useOldISOCodes` davranışına gizli bağımlılık varsa JDK 27 testleri yeşil görünürken dış sistem sözleşmeleri bozulabilir.
- Jakarta EE 12 güvenlik profilindeki değişimler, full-profile uygulamalarla Spring Security tabanlı servisler arasında kavramsal uyumsuzluk yaratabilir.
- Karbon duyarlı scheduling, SLO ve veri yerleşimi kısıtları modellenmeden uygulanırsa gecikme, bölgesel uyumluluk veya maliyet sürprizleri üretebilir.
- SBOM üretmek tek başına yeterli değildir; dependency policy, bloklama ve incident runbook olmadan tedarik zinciri riski düşmez.

## İzlenmesi Gereken Konular

- Spring Blog'da yeni `This Week in Spring` ve olası Nisan başı release duyuruları.
- Spring Boot `4.1` milestone akışında preview API'lerin stabilizasyon durumu.
- `JDK 27` EA notlarında locale, TLS, GC ve diagnostic değişikliklerinin FOSS proje testlerinden çıkacak regresyonları.
- `Project Leyden` ile Spring Boot arasında gerçek dünya benchmark ve migration anlatıları.
- Jakarta EE 12 milestone 2 ve güvenlik spesifikasyonlarının Web Profile'a etkisi.
- JobRunr karbon duyarlı scheduling'in açık kaynak / ticari kapsamı, API kararlılığı ve Spring entegrasyon maliyeti.
- Java supply-chain güvenliğinde SBOM, dependency firewall ve build provenance kontrollerinin CI/CD standardına dönüşme hızı.

## Kaynak Bazlı Bulgular

### 1. Project Leyden ve runtime image hattı Spring Boot için pratik pilot alanına dönüşüyor

- **title:** `Project Leyden + jlink/jmod ile JVM startup ve imaj optimizasyonu`
- **source:** [OpenJDK JEP 514](https://openjdk.org/jeps/514), [OpenJDK JEP 515](https://openjdk.org/jeps/515), [Oracle jmod dokümantasyonu](https://docs.oracle.com/en/java/javase/25/docs/specs/man/jmod.html), [OpenJDK JEP Index](https://openjdk.org/jeps/0)
- **author:** `OpenJDK contributors / Oracle Java platform team`
- **date:** `JDK 25 teslim hattı; 2026-03-11 OpenJDK JEP Index güncellemesi ve 2026-04-07 taraması`
- **category:** `runtime-performance-and-packaging`
- **tags:** `project-leyden`, `aot-cache`, `aot-method-profiling`, `jlink`, `jmod`, `spring-boot`, `containers`, `startup`
- **summary:** JVM tarafında AOT cache, method profiling ve custom runtime image araçları daha uygulanabilir bir hatta ilerliyor. Bu başlık, Spring Boot servisleri için native image dışındaki optimizasyon yolunu güçlendiriyor.
- **why_it_matters:** Startup ve warmup maliyeti, Kubernetes ortamında yatay ölçekleme, pod churn ve kısa ömürlü workload'larda doğrudan operasyon maliyetine dönüşüyor.
- **java_spring_relevance:** Spring Boot uygulamaları reflection, auto-configuration ve classpath yoğunluğu nedeniyle startup optimizasyonundan doğrudan etkilenir. Leyden ve `jlink` pilotu, native image'ın tüm kısıtlarını taşımadan veri üretmeye yarar.
- **actionability:** `pilot`
- **impact_level:** `medium-high`
- **opportunities:** Cold start ölçümü, daha küçük runtime image, kontrollü JVM dağıtımı, platform ekipleri için standart base image deneyi.
- **risks:** Yanlış eğitim koşuları, debug zorluğu, farklı environment'larda ölçüm yanıltması, CI süresinin artması.
- **migration_notes:** Önce bir veya iki stateless Spring Boot servisi seçin; baseline JVM, `jlink` runtime image ve AOT cache varyantlarını aynı yük testiyle karşılaştırın. Üretim standardı yapmadan önce observability, heap dump, JFR ve rollback prosedürlerini doğrulayın.

### 2. JDK 27 `java.locale.useOldISOCodes` kaldırması veri sözleşmesi riski yaratıyor

- **title:** `JDK 27 eski ISO dil kodu geri dönüş seçeneğini kaldırıyor`
- **source:** [Inside Java kalite uyarısı](https://inside.java/2026/03/10/quality-heads-up/)
- **author:** `Nicolai Parlog`
- **date:** `10 Mart 2026`
- **category:** `jdk-compatibility`
- **tags:** `jdk-27`, `locale`, `bcp-47`, `i18n`, `compatibility`, `spring-mvc`, `spring-webflux`
- **summary:** `java.locale.useOldISOCodes` sistem özelliği JDK 27'de desteklenmeyecek ve ayarlansa bile yok sayılacak. Uygulamalar `iw`, `in`, `ji` gibi eski ISO 639 kodlarına değil, `he`, `id`, `yi` gibi BCP 47 kodlarına tutarlı şekilde hazırlanmalı.
- **why_it_matters:** Bu tür değişiklikler compile hatası üretmez; API yanıtı, dosya adı, cache key, mesaj kaynağı, test fixture veya dış sistem entegrasyonunda davranış farkı üretir.
- **java_spring_relevance:** Spring uygulamalarında `LocaleResolver`, `MessageSource`, raporlama, çok dilli API çıktısı ve request locale işleme akışı bu davranışa temas edebilir.
- **actionability:** `immediate-inventory`
- **impact_level:** `medium`
- **opportunities:** JDK upgrade checklist'ine düşük maliyetli kontrat testi eklemek ve locale davranışını normalize etmek.
- **risks:** Eski dil kodlarına bağlı sözleşmelerde sessiz regresyon; test datasının gerçek üretim datasını yakalamaması.
- **migration_notes:** Kodda ve konfigürasyonda `java.locale.useOldISOCodes`, `iw`, `in`, `ji` araması yapın. Locale üreten endpoint ve batch çıktıları için JDK 21/25/27 EA karşılaştırmalı snapshot testi çalıştırın.

### 3. Jakarta EE 12 güvenlik profili tartışması Spring ekipleri için izleme sinyali

- **title:** `Jakarta EE 12 Authorization / Web Profile yönü`
- **source:** [InfoQ Java News Roundup, 6 Nisan 2026](https://www.infoq.com/news/2026/04/java-news-roundup-mar30-2026/)
- **author:** `Michael Redlich; kaynak olarak Ivar Grimstad güncellemesi`
- **date:** `6 Nisan 2026`
- **category:** `standards-and-security`
- **tags:** `jakarta-ee-12`, `jakarta-security`, `jakarta-authorization`, `web-profile`, `spring-security`, `servlet`
- **summary:** Jakarta EE 12 çevresinde Jakarta Authorization'ın Web Profile'a dahil edilmesi ve güvenlik spesifikasyonlarının ilişkisinin netleşmesi tartışılıyor.
- **why_it_matters:** Jakarta standartları, Spring dışı app server kullanan kurumlarda güvenlik modeli, ortak library tasarımı ve API uyumluluğu için referans oluşturuyor.
- **java_spring_relevance:** Spring Security doğrudan Jakarta EE güvenlik spesifikasyonlarına bağlı bir uygulama modeli sunmasa da Spring Framework, Servlet API ve Jakarta namespace ekosistemiyle birlikte yaşar. Karma platformlarda kavramsal uyumsuzluk mimari kararlara yansıyabilir.
- **actionability:** `monitor`
- **impact_level:** `medium`
- **opportunities:** Spring Boot ve Jakarta EE uygulamaları arasında ortak authentication/authorization sözleşmelerini erken gözden geçirmek.
- **risks:** Kurum içi platformlarda farklı güvenlik abstraction'larının birbirinden uzaklaşması; app server ve Boot tabanlı servisler arasında policy tekrarları.
- **migration_notes:** Hemen kod değişikliği gerekmiyor. Ancak Jakarta EE 12 milestone notları ve Spring Security uyumluluk duyuruları aynı migration panosunda izlenmeli.

### 4. JobRunr karbon duyarlı scheduling, batch işlerinde yeni policy katmanı sinyali veriyor

- **title:** `Karbon duyarlı scheduling arka plan işleri için izlemeye değer`
- **source:** [This Week in Spring, 31 Mart 2026](https://spring.io/blog/2026/03/31/this-week-in-spring-march-31st-2026), JobRunr public update akışı
- **author:** `Josh Long; JobRunr maintainers`
- **date:** `31 Mart 2026`
- **category:** `scheduler-and-platform-efficiency`
- **tags:** `jobrunr`, `spring-boot`, `background-jobs`, `batch`, `scheduling`, `carbon-aware`, `slo`
- **summary:** JobRunr çevresinde karbon yoğunluğuna duyarlı scheduling sinyali görünür hale geldi. Bu, ertelenebilir işlerin zamanlamasında enerji, maliyet, bölge ve SLO boyutlarını birlikte düşünme eğilimini güçlendiriyor.
- **why_it_matters:** Batch ve arka plan işleri çoğu kurumda büyüdükçe cron tabanlı basit model operasyonel olarak yetersiz kalıyor. SLO, worker kapasitesi, bölgesel veri kısıtı ve maliyet pencereleri daha açık modellenmeli.
- **java_spring_relevance:** Spring Boot servisleri sıkça `@Scheduled`, Quartz, Spring Batch veya JobRunr ile arka plan işlerini çalıştırıyor. Bu alan, uygulama kodu ile platform politikası arasındaki sınırın netleşmesini gerektiriyor.
- **actionability:** `monitor-pilot`
- **impact_level:** `low-medium`
- **opportunities:** Ertelenebilir raporlama, veri zenginleştirme ve düşük öncelikli maintenance job'larını policy bazlı sınıflandırmak.
- **risks:** SLO ihlali, veri yerleşimi kısıtlarının ihlali, region bağımlı maliyet sürprizleri, ticari özellik bağımlılığı.
- **migration_notes:** Bugün standartlaştırmayın. Önce job envanterini `kritik`, `ertelenebilir`, `region-bound`, `cost-sensitive` şeklinde etiketleyin; sonra araç bağımsız bir scheduling policy modeli çıkarın.

### 5. Java supply-chain güvenliği hala Log4Shell sonrası üretim olgunluğu meselesi

- **title:** `SBOM ve dependency firewall Java ekipleri için operasyonel zorunluluğa yaklaşıyor`
- **source:** [InfoQ: Are We Ready for the Next Cyber Security Crisis Like Log4shell?](https://www.infoq.com/presentations/cyber-security-log4shell/)
- **author:** `Soroosh Khodami`
- **date:** `30 Mart 2026`
- **category:** `supply-chain-security`
- **tags:** `log4shell`, `sbom`, `dependency-confusion`, `maven`, `gradle`, `devsecops`, `spring-boot`
- **summary:** InfoQ'nun öne çıkardığı Log4Shell sonrası güvenlik anlatısı, SBOM, dependency firewall ve shift-left kontrollerinin modern Java ekipleri için hâlâ açık bir olgunluk alanı olduğunu tekrar gösteriyor.
- **why_it_matters:** Java ekosistemi yoğun transitive dependency kullanıyor. Spring Boot starter'ları bu yükü yönetilebilir kılar, ancak görünmeyen bağımlılık riskini de artırır.
- **java_spring_relevance:** Maven/Gradle pipeline'ı, Spring Boot BOM'ları, container imajı ve deployment artifact'ı aynı supply-chain kontrol modelinde ele alınmalı.
- **actionability:** `immediate-review`
- **impact_level:** `high`
- **opportunities:** SBOM üretimini release artifact'ına bağlamak; dependency confusion ve repository policy kontrollerini CI gate yapmak; incident runbook'larını güçlendirmek.
- **risks:** SBOM üretip policy uygulamamak; false-positive yorgunluğu; transitive dependency istisnalarının kontrolsüz büyümesi.
- **migration_notes:** `cyclonedx-maven-plugin` veya Gradle eşdeğeriyle SBOM üretimini standartlaştırın. İç artifact repository policy'si, dependency allow/deny listesi ve CVE exception süresi belirleyin.

### 6. Kubernetes geçiş vaka çalışmaları Spring Cloud ekipleri için platform gerçeğini hatırlatıyor

- **title:** `GitOps, hücresel mimari ve cloud limitleri microservice geçişinde belirleyici`
- **source:** [InfoQ: Duolingo's Kubernetes Leap](https://www.infoq.com/presentations/duolingo-eks-kubernetes/)
- **author:** `Franka Passing`
- **date:** `6 Nisan 2026`
- **category:** `platform-engineering`
- **tags:** `kubernetes`, `gitops`, `argo-cd`, `cellular-architecture`, `ipv6`, `spring-cloud`, `microservices`, `aws-limits`
- **summary:** Duolingo'nun yüzlerce backend servisli Kubernetes geçişi, GitOps, IPv6-only pod yaklaşımı, hücresel mimari ve AWS rate limitleri gibi üretim ayrıntılarını öne çıkarıyor.
- **why_it_matters:** Kubernetes geçişi yalnızca manifest veya Helm chart işi değil; servis sınırları, deployment güveni, blast radius, network modeli ve cloud limitleri birlikte yönetilmeli.
- **java_spring_relevance:** Spring Cloud ve Spring Boot microservice ekipleri Kubernetes'e geçerken config, discovery, retry, observability ve rollout davranışlarını platform tasarımıyla birlikte ele almalı.
- **actionability:** `monitor-apply-selectively`
- **impact_level:** `medium`
- **opportunities:** GitOps standardı, hücresel izolasyon, daha küçük blast radius, platform self-service ve üretim öncesi kapasite testi.
- **risks:** Developer trust kaybı, cloud provider rate limitleri, IPv6 ve servis mesh sürprizleri, erken adopter servislerde yüksek operasyon yükü.
- **migration_notes:** Spring servisleri için Kubernetes'e geçiş checklist'ine cloud API limitleri, namespace/cell izolasyonu, rollback modeli, Argo CD sync politikası ve observability kabul kriterleri ekleyin.

## Sonuç

Bugünün en değerli sinyali yeni bir Spring duyurusu değil, Java/Spring ekiplerinin üretim gerçekliğini etkileyen yan eksenlerde. `Project Leyden` ve runtime image pratikleri startup ve imaj stratejisini yeniden ölçmeye değer kılıyor. `JDK 27` locale değişikliği küçük ama sessiz bir uyumluluk riski. Jakarta EE 12 güvenlik yönü, JobRunr scheduling politikası, supply-chain kontrolleri ve Kubernetes vaka çalışmaları ise Spring tabanlı sistemlerde mimari kararların artık framework API'lerinden çok runtime, platform ve operasyon sözleşmeleriyle birlikte verildiğini gösteriyor.
