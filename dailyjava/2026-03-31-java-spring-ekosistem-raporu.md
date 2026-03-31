# Günlük Java / Spring Ekosistem Raporu

Tarih: 31 Mart 2026

Bu rapor, 31 Mart 2026 itibarıyla Java, JVM, Spring Boot, Spring Framework, Spring Cloud, Spring AI ve yakın ekosistemde üretim kararlarını etkileyebilecek sinyalleri özetler. Bu turda öncelik özellikle 26-31 Mart 2026 arasında yayımlanan release ve advisory'lere verildi; daha eski içerikler ise yalnızca bugün için hâlâ yüksek etkili ve çoklu güvenilir kaynak tarafından tekrar edilen konular olduğu için dahil edildi.

## Öne Çıkan Başlıklar

- `Spring Boot 4.1.0-M4`, `M3`teki Rabbit/AMQP yönünü geri alıp `4.2` hattına erteledi. Bu, `Boot 4` milestone'larında sözleşme oynaklığının sürdüğünü gösteriyor.
- `Spring AI 2.0.0-M4 / 1.1.4 / 1.0.5`, dört CVE düzeltmesi, dynamic structured output control ve provider deprecation sinyalleri getirdi. AI katmanında hem fırsat hem migration riski büyüyor.
- `Spring Security 6.5.9 / 7.0.4 / 7.1.0-M3`, `CVE-2026-22732` advisory zinciriyle birlikte okununca hemen patch gerektiren başlık olarak öne çıkıyor.
- `Spring Tools 5.1.0`, `Framework 7 API versioning`, `JDBC @Query SQL Intelligence` ve `AOT repository` desteğiyle Boot 4 geçişini doğrudan geliştirici akışına taşıyor.
- `Spring Data 2026.0.0-M2`, Redis Pub/Sub ve Mongo bulk API tarafında daha deklaratif, daha pratik bir veri katmanı yönüne işaret ediyor.
- Java tarafında yeni bir GA sinyali yok; fakat Oracle, Inside Java, OpenJDK ve InfoQ aynı mesajı veriyor: `JDK 26` geçişi dil seviyesinden çok runtime/operasyon seviyesi bir iş.

## Kritik Güncellemeler

- `Spring Boot 4.1.0-M4`, `M3`te gelen Rabbit/AMQP değişikliklerini `4.2` hattına taşıdı ve `application.properties` / `application.yaml` işleme regresyonunu düzeltti.
- `Spring Boot 3.5.13` ve `4.0.5`, stabil hatlarda bug fix ve dependency upgrade tabanını güncelledi. Erken üretim ekipleri için daha mantıklı default taban hâlâ bu iki hat.
- `Spring AI 2.0.0-M4 / 1.1.4 / 1.0.5`, `CVE-2026-22738`, `CVE-2026-22742`, `CVE-2026-22743` ve `CVE-2026-22744` düzeltmelerini taşıyor.
- `Spring Security 6.5.9 / 7.0.4 / 7.1.0-M3`, dış güvenlik indekslerinde `CVE-2026-22732` ile ilişkilendiriliyor. Detay mekanizma rollout öncesi resmi advisory'den okunmalı, fakat patch aciliyeti net.
- Yeni bir Spring Cloud advisory görünmedi; ancak 23 Mart tarihli Config Server CVE düzeltmesi hâlâ aksiyon listesinde olmalı. Dün yükseltmeyen ekipler için konu kapanmış sayılmaz.

## Trendler ve Sinyaller

### 1. `Boot 4` hattı hızlı ilerliyor ama milestone davranışı hâlâ oynak

`Boot 4.1.0-M4`ün `M3`te gelen Rabbit/AMQP değişikliklerini geri alması önemli bir sinyal: Boot 4 hattı artık ciddi pilot adayı, fakat milestone sürümler hâlâ API ve starter sözleşmesi açısından nihai değil. Bu, “özellik var, o halde standardize edelim” yaklaşımının erken olduğunu gösteriyor.

Değerlendirme: Bu gürültü değil. 2026 platform planı için kalıcı bir yönetim sinyali.

### 2. `Spring AI` tarafında yetenekler genişlerken provider yüzeyi daralıyor

Bir yandan dynamic structured output control gibi pratik yetenekler geliyor, öte yandan `Vertex AI`, `ZhiPu AI` ve `OCI GenAI` entegrasyon sınıfları deprecated ediliyor. Bu birlikte okunduğunda, Spring AI’nin “her provider’ı kalıcı abstraction altında saklayalım” çizgisinden çok, hızla evrilen bir orchestration katmanı gibi davrandığı görülüyor.

Değerlendirme: Kalıcı değer potansiyeli yüksek, sürüm istikrarı orta.

### 3. Güvenlik yüzeyi sadece `Spring Cloud Config` değil, uygulama güvenlik zinciri de

Geçen haftaki Config Server CVE’sinden sonra bu turda `Spring Security` bakım sürümlerinin öne çıkması, güvenliğin yönetim düzlemi ile runtime authorization katmanında birlikte ele alınması gerektiğini tekrar gösteriyor. Aynı dönemde Spring AI tarafında da güvenlik fixleri gelmesi, “AI yan ürün, güvenlik sonra bakılır” yaklaşımını geçersiz kılıyor.

Değerlendirme: Kısa vadede en yüksek öncelikli operasyon sinyali.

### 4. Tooling artık sadece framework’ü takip etmiyor, göçü hızlandırıyor

`Spring Tools 5.1.0` içindeki `Framework 7 API Versioning`, `JDBC @Query` SQL doğrulama ve `AOT` repository desteği, araç zincirinin Boot 4/Framework 7 geçişine hazırlıklı hale geldiğini gösteriyor. Bu, ekosistemin “sadece release yayınlandı” aşamasını geçtiğini anlatan güçlü bir dolaylı sinyal.

Değerlendirme: Dayanıklı değer. Özellikle büyük ekiplerde rollout maliyetini düşürür.

### 5. Data access API’leri daha güvenli, daha deklaratif, daha az string-temelli hale geliyor

`Spring Data` tarafında type-safe property path yatırımı ve `2026.0.0-M2` ile gelen annotation-driven Redis Pub/Sub ve yeni Mongo bulk API, data access katmanında ergonomi ve correctness odağının arttığını gösteriyor. Bu tema Baeldung ve topluluk içeriklerinde de “nasıl kullanılır” seviyesine inmiş durumda.

Değerlendirme: Hype değil. Orta vadede üretim kod tabanında bakım maliyetini azaltır.

### Tekrarlanan sinyal kümeleri

- Resmi Spring release post’ları, `This Week in Spring`, Baeldung ve Burak KUTBAY içerikleri birlikte okunduğunda `Boot 4 / Framework 7` artık konsept değil, pratik göç gündemi.
- Oracle Java Blog, Inside Java, OpenJDK JEP’leri ve InfoQ, `JDK 26`yı performans, operasyon ve güvenlik davranışlarıyla okuyor; bu tek kaynak gürültüsü değil.
- Resmi release sayfaları, Spring AI ve Security tarafında “feature velocity + security hygiene” ikilisinin aynı anda yönetilmesi gerektiğini tekrar ediyor.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: güvenlik patch disiplini, Boot milestone oynaklığına karşı kontrollü pilot yaklaşımı, JDK 26 upgrade checklist, tooling yatırımı, type-safe data API’leri.
- İzlenmeli ama hemen standardize edilmemeli: Spring AI provider stratejisi, Redis 8.4 conditional operations, Boot 4.2’ye ertelenen AMQP yönü.
- Düşük öncelik: üçüncü taraf tarafta bugün hemen standardize edilmesi gereken yeni bir JVM backend kütüphanesi görünmedi; Gunnar Morling tarafında önceki `Hardwood` sinyali hâlâ niş ve izleme seviyesinde.

## Araçlar ve Kütüphaneler

- `Spring Tools 5.1.0`, özellikle `JDBC @Query` SQL Intelligence, API versioning quick-fix’leri ve language server startup optimizasyonu ile bugün en pratik araç sinyali.
- `Spring Data 2026.0.0-M2`, Redis Pub/Sub anotasyon modeli ve Mongo toplu yazma API’si nedeniyle veri ağırlıklı servisler için değerli bir pilot adayı.
- `Spring AI 1.1.4` içindeki dynamic structured output control, LLM çıktısını şema kontrollü kullanmak isteyen ekipler için pratik değer taşıyor.
- Ekosistem dışında bugün “hemen geçin” denecek kadar güçlü yeni bir OSS kütüphane sinyali yok. Bu, zayıf içerik üretmemek için bilinçli olarak boş bırakılan bir alan.

## Java / Spring Geliştiricileri İçin Etkiler

- `Boot 4.1.0-M3` üzerinde Rabbit/AMQP yeniliklerini deneyen ekipler, `M4`e geçerken dependency ve starter seçimlerini yeniden doğrulamalı. Milestone sürümlerde “bir kez çalıştı, artık kaldı” varsayımı güvenli değil.
- `Spring AI` kullanan ekipler, provider bağımlılıklarını envanterlemeli. Deprecated olan `Vertex AI`, `ZhiPu AI` ve `OCI GenAI` sınıflarına doğrudan uygulama kodu bağlamak, orta vadede gereksiz migration maliyeti üretir.
- `Spring Security` güncellemesi, sıradan bir bakım sürümü gibi ele alınmamalı. Özellikle custom filter chain, method security ve resource server akışları olan servislerde patch sonrası regresyon testi yapılmalı.
- Redis veya Mongo yoğun sistemlerde `Spring Data 2026.0.0-M2` ile gelen API’ler, daha az round-trip ve daha net listener modelleri nedeniyle somut verimlilik üretebilir.
- IDE ve tooling tarafı artık geçişi kolaylaştırdığı için Boot 4 / Framework 7 pilotlarını “araçlar yetersiz” gerekçesiyle ertelemek daha az savunulabilir.
- `JDK 26` hâlâ gündemde kalmalı. Bu turda yeni JDK release çıkmadı; fakat resmi Java kaynaklarının ortak mesajı değişmedi: ağ, heap, reflection ve observability davranışlarını gerçek ortamda test etmeden yükseltme yapılmamalı.

## Fırsatlar ve Riskler

### Fırsatlar

- `Boot 4.0.5` ve `3.5.13` ile stabil bakım tabanını güncelleyip `4.1` hattını ayrı pilot ring’de denemek.
- `Spring AI 1.1.4` ile structured output control kullanarak tool-calling ve JSON çıktı kalitesini iyileştirmek.
- `Spring Tools 5.1.0` ile geliştirici onboarding ve migration verimliliğini artırmak.
- `Spring Data`nin type-safe ve annotation-driven özellikleriyle repository ve query kodunda string kaynaklı hata payını azaltmak.

### Riskler

- `Boot 4.1` milestone’larını production contract gibi ele almak, starter ve entegrasyon katmanında beklenmedik geri dönüş maliyeti yaratır.
- `Spring AI`de deprecated provider sınıflarına doğrudan bağlanmak, birkaç sprint içinde refactor zorunluluğu doğurabilir.
- `Spring Security` patch’lerini ertelemek, authorization ve authentication zincirini yüksek etkili bir açıkla çalıştırmaya devam etmek anlamına gelebilir.
- `JDK 26`yı yalnızca benchmark ile değerlendirmek, gerçek trafik altındaki timeout, proxy ve memory ergonomisi farklarını kaçırır.
- Spring Data milestone API’lerini çekirdek shared library’lere erken sabitlemek, RC ve GA aşamasında yaygın revizyon ihtiyacı doğurabilir.

## İzlenmesi Gereken Konular

- `Spring Boot 4.1` hattında `M5/RC` aşamasına giderken Rabbit/AMQP yönünün tam olarak nereye oturacağı.
- `Spring AI` tarafında deprecated provider entegrasyonları için resmi replacement veya recommended path yayımlanıp yayımlanmayacağı.
- `Spring Security` için `CVE-2026-22732` advisory detaylarının ve olası follow-up release notlarının netleşmesi.
- `Spring Data 2026.0.0` RC sürecinde Redis listener ve Mongo bulk API ergonomisinin ne kadar korunacağı.
- `JDK 26` altında `final field mutation` warning üreten popüler kütüphanelerin görünürlüğünün artıp artmayacağı.
- Burak KUTBAY, Baeldung ve Josh Long tarafında `Boot 4 / Framework 7` göç deneyimlerinin daha production-odaklı örneklere dönüp dönmeyeceği.
- Gunnar Morling cephesinde `Hardwood` veya benzeri performans odaklı JVM araçlarının Spring Batch ve veri servisleri için daha somut benchmark üretip üretmeyeceği.

## Kaynak Bazlı Bulgular

### 1. `Spring Boot 4.1.0-M4`, milestone hattındaki oynaklığı yeniden gösterdi

- **title:** `Spring Boot 4.1.0-M4`, `4.0.5` ve `3.5.13` ile release hattı ayrıştı
- **source:** [Spring Boot 4.1.0-M4 available now](https://spring.io/blog/2026/03/26/spring-boot-4-1-0-M4-available-now/), [Spring Boot 4.0.5 available now](https://spring.io/blog/2026/03/26/spring-boot-4-0-5-available-now/), [Spring Boot 3.5.13 available now](https://spring.io/blog/2026/03/26/spring-boot-3-5-13-available-now/), [This Week in Spring - March 24th, 2026](https://spring.io/blog/2026/03/24/this-week-in-spring-march-24th-2026), [Spring Boot 4 & Spring Framework 7](https://www.baeldung.com/spring-boot-4-spring-framework-7), [API Versiyonlama - Spring Framework 7](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/)
- **author:** Andy Wilkinson, Josh Long, Ralf Ueberfuhr, Burak KUTBAY
- **date:** 24-26 Mart 2026
- **category:** Platform evrimi / release-train yönetimi
- **tags:** `spring-boot`, `spring-framework-7`, `boot-4.1`, `amqp`, `rabbitmq`, `migration`
- **summary:** `Boot 4.1.0-M4`, `M3`te gelen Rabbit/AMQP değişikliklerini `4.2` hattına erteledi ve `application.properties` / `application.yaml` işleme regresyonunu düzeltti. Aynı gün çıkan `4.0.5` ve `3.5.13` ise stabil bakım çizgisini güncel tuttu.
- **why_it_matters:** Milestone sürümlerde yön değişimi hâlâ mümkün. Bu, `Boot 4.1` pilotlarının dependency sözleşmesini dikkatle yönetmesi gerektiğini gösteriyor.
- **java_spring_relevance:** `Boot 4`ü pilotlayan veya `Framework 7` özelliklerine erken geçen Spring ekipleri için doğrudan kritik.
- **actionability:** Kontrollü yükseltme ve pilot doğrulaması
- **impact_level:** Yüksek
- **opportunities:** Daha temiz pilot hattı kurmak, stabil üretim ring’ini `3.5.13` ve `4.0.5` üstüne oturtmak, `Framework 7` özelliklerini araç desteğiyle denemek.
- **risks:** `M3 -> M4` geçişinde starter veya POM farkları, messaging entegrasyonlarında beklenmedik davranış değişimi, config parsing regresyonlarının gözden kaçması.
- **migration_notes:** `M3`te Rabbit/AMQP değişikliklerine göre yaptığınız POM veya starter düzeltmelerini `M4`te yeniden gözden geçirin. `application.yaml` ve `application.properties` işleme akışını test edin. Üretim adayları için `3.5.13` veya `4.0.5` daha rasyonel taban.

### 2. `Spring AI` sürüm hattı aynı anda hem güvenlik hem provider stratejisi değişikliği taşıyor

- **title:** `Spring AI 2.0.0-M4 / 1.1.4 / 1.0.5` güvenlik ve provider değişimlerini birlikte getirdi
- **source:** [Spring AI 2.0.0-M4, 1.1.4 and 1.0.5 are available now](https://spring.io/blog/2026/03/26/spring-ai-2-0-0-M4-and-1-1-4-and-1-0-5-available), [Building Effective Agents with Spring AI](https://www.baeldung.com/spring-ai-building-effective-agents), [This Week in Spring - March 24th, 2026](https://spring.io/blog/2026/03/24/this-week-in-spring-march-24th-2026)
- **author:** Ilayaperumal Gopinathan, Stelios Anastasakis, Josh Long
- **date:** 24-26 Mart 2026
- **category:** AI platformu / uygulama altyapısı
- **tags:** `spring-ai`, `structured-output`, `provider-deprecation`, `vertex-ai`, `oci-genai`, `cve`
- **summary:** Sürümler toplam `51` iyileştirme ve hata düzeltmesi içeriyor; ayrıca `CVE-2026-22738`, `22742`, `22743` ve `22744` düzeltmeleri geliyor. `1.1.4`te dynamic structured output control var; `2.0.0-M4`te `Vertex AI`, `ZhiPu AI` ve `OCI GenAI` model entegrasyon sınıfları deprecated edildi.
- **why_it_matters:** Spring AI artık sadece feature ekleyen bir kütüphane değil; security hygiene ve provider portföyü de hızlı değişiyor.
- **java_spring_relevance:** Java ve Spring tabanlı LLM, agent, RAG veya tool-calling altyapısı kuran ekipler için doğrudan ilgili.
- **actionability:** Kontrollü yükseltme ve provider envanteri çıkar
- **impact_level:** Yüksek
- **opportunities:** Structured output kalitesini artırmak, model entegrasyonlarında hata düzeltmelerinden faydalanmak, AI katmanını daha disiplinli soyutlamak.
- **risks:** Deprecated provider sınıflarına bağlanmış kodun kısa vadede migration yükü üretmesi, milestone sürümlerde API davranış değişimi, güvenlik yamalarının kaçırılması.
- **migration_notes:** `Vertex AI`, `ZhiPu AI` ve `OCI GenAI` kullanımlarını tespit edin. Uygulama kodunu provider adapter’larından ayırın. `1.1.4`te vector store, streaming ve caching akışlarını smoke test ile doğrulayın.

### 3. `Spring Security` bakım sürümleri patch aciliyeti taşıyor

- **title:** `Spring Security 6.5.9 / 7.0.4 / 7.1.0-M3` güvenlik düzeltmesi odaklı okunmalı
- **source:** [Spring release listing](https://spring.io/blog/category/releases/page-286), [BSI indeksli güvenlik haberi](https://www.news.de/technik/859450630/vmware-tanzu-spring-security-gefaehrdet-bsi-meldung-zur-it-sicherheit-unix-und-windows-betroffen-schwachstelle-ermoeglicht-umgehen-von-sicherheitsvorkehrungen/1/), [Resmi advisory bağlantısı](https://spring.io/security/cve-2026-22732), [Resmi release bağlantısı](https://spring.io/blog/2026/03/19/spring-security-6-5-9-and-7-0-4-and-7-1-0-M3-available-now)
- **author:** Rob Winch, Spring Security Team
- **date:** 19-21 Mart 2026
- **category:** Güvenlik / kimlik doğrulama ve yetkilendirme
- **tags:** `spring-security`, `cve-2026-22732`, `security`, `authz`, `patching`
- **summary:** Resmi release girdisi yeni bakım sürümlerini duyuruyor. Dış güvenlik indeksleri ve BSI tabanlı haber, bu sürümleri `CVE-2026-22732` ile ilişkilendiriyor ve etkisini “güvenlik önlemlerini atlatma” olarak özetliyor. Advisory teknik detayını arama indeksinde tam göremediğim için saldırı mekanizması kısmı burada bu kaynaklardan türetilmiş bir özet olarak ele alınmalı.
- **why_it_matters:** Güvenlik zincirindeki bakım sürümleri, çoğu zaman feature release’lerden daha önemlidir. Özellikle uzaktan erişilebilir uygulamalarda patch gecikmesi doğrudan risk üretir.
- **java_spring_relevance:** `Spring Security` kullanan neredeyse tüm Boot servisleri için yüksek ilgili.
- **actionability:** Hemen aksiyon
- **impact_level:** Yüksek
- **opportunities:** Güvenlik tabanını güncellemek, filter chain ve authorization konfigürasyonlarını yeniden gözden geçirmek.
- **risks:** Authorization veya authentication katmanında exploit penceresi, özellikle custom security config kullanan servislerde görünmeyen zafiyet devamı.
- **migration_notes:** Uygun hatta `6.5.9` veya `7.0.4`e çıkın. Patch sonrası login, token validation, resource server, method security ve custom filter chain akışlarını regresyon testinden geçirin. Advisory detay metni rollout öncesi ayrıca okunmalı.

### 4. `Spring Tools 5.1.0`, Boot 4 / Framework 7 göçünü geliştirici deneyimine taşıdı

- **title:** `Spring Tools 5.1.0` ile API versioning, SQL Intelligence ve AOT workflow desteği güçlendi
- **source:** [Spring Tools 5.1.0 released](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released), [Spring Tools 5.1.0 release notes](https://github.com/spring-projects/spring-tools/releases/tag/5.1.0.RELEASE), [Spring Tools project page](https://spring.io/tools/)
- **author:** Martin Lippert
- **date:** 11 Mart 2026
- **category:** Geliştirici verimliliği / tooling
- **tags:** `spring-tools`, `framework-7`, `api-versioning`, `jdbc`, `aot`, `language-server`
- **summary:** `JDBC @Query` için syntax highlighting ve validation, query’leri Java text block’a çeviren modernizasyon, `AOT repository` desteği, `Framework 7 API versioning` quick-fix’leri ve `JDK 25 AOT Cache (CDS)` ile daha hızlı language server startup öne çıkan iyileştirmeler.
- **why_it_matters:** Framework geçişlerinde asıl maliyet kod değişiminden çok geliştirici akışı ve geri bildirim döngüsünde çıkar. Tooling olgunluğu bu maliyeti düşürür.
- **java_spring_relevance:** VS Code, Cursor, Eclipse veya Theia kullanan Spring ekipleri için doğrudan verimlilik etkisi taşır.
- **actionability:** Yakın vadeli deneme ve ekip içi rollout
- **impact_level:** Orta-Yüksek
- **opportunities:** API versiyonlama geçişlerini hızlandırmak, query hatalarını IDE seviyesinde yakalamak, AOT senaryolarında sembol ve annotation sorunlarını daha erken görmek.
- **risks:** Yeni tooling özelliklerine aşırı güvenip runtime davranışını ikinci plana atmak; ekip içinde IDE sürüm parçalanması.
- **migration_notes:** `Framework 7` veya `Boot 4` pilot ekibinde `5.1.0`u standartlaştırın. CDS ve AOT cache ayarlarını merkezi dokümana ekleyin. Query formatting quick-fix’lerinin büyük diff üretip üretmediğini gözlemleyin.

### 5. `Spring Data 2026.0.0-M2`, Redis ve Mongo tarafında daha deklaratif API’ler sunuyor

- **title:** `Spring Data 2026.0.0-M2` veri erişim katmanında pratik kazanımlar getiriyor
- **source:** [Spring Data 2026.0.0-M2 released](https://spring.io/blog/2026/03/13/spring-data-2026-0-0-M2-released), [Spring Data 2026.0.0-M1 released](https://spring.io/blog/2026/02/13/spring-data-2026-0-0-m1-released)
- **author:** Mark Paluch
- **date:** 13 Mart 2026
- **category:** Veri erişimi / kütüphane evrimi
- **tags:** `spring-data`, `redis`, `mongodb`, `pubsub`, `bulkwrite`, `type-safe-property-path`
- **summary:** `M2`; annotation-driven Redis Pub/Sub listener’ları, Redis 8.4 için conditional `SET/DEL`, yeni `MongoOperations.bulkWrite` API’si ve Boot 4.1 hattıyla hizalı bir milestone yayınladı. `M1`de gelen type-safe property path desteğiyle birlikte okunduğunda veri katmanında string-temelli API’lerden uzaklaşma netleşiyor.
- **why_it_matters:** Redis ve Mongo kullanan ekipler için hem correctness hem ergonomi artıyor; ayrıca cross-collection bulk write gibi kabiliyetler servis içi veri operasyonlarını sadeleştirebilir.
- **java_spring_relevance:** Eventing, cache, queue benzeri Redis kullanımı veya belge ve veri yoğun Mongo servisleri olan Spring Boot ekipleri için yüksek ilgili.
- **actionability:** Seçili pilot ve compatibility testi
- **impact_level:** Orta-Yüksek
- **opportunities:** Daha az round-trip, daha okunabilir listener kodu, type-safe query construction, daha güçlü toplu veri işlemleri.
- **risks:** Milestone API’lerine erken bağımlılık, converter ve MIME type davranışlarını yanlış varsayma, Redis 8.4 bağımlılığı olan senaryolarda ortama göre uyumsuzluk.
- **migration_notes:** `@EnableRedisListeners` ile listener modelini sandbox’ta deneyin. JSON converter seçiminizi ve header kullanımınızı test edin. Mongo 8.0+ kullanıyorsanız multi-collection bulk davranışını gerçek transaction ve consistency beklentilerinizle karşılaştırın.

### 6. `JDK 26` için resmi Java kaynakları aynı uyarıyı tekrar ediyor: upgrade checklist şart

- **title:** `JDK 26` hâlâ runtime davranışı odaklı ele alınmalı
- **source:** [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [HTTP Client Updates in Java 26](https://inside.java/2026/03/04/jdk-26-http-client/), [Inside Java tags page](https://inside.java/tags), [JEP 500](https://openjdk.org/jeps/500), [JDK 26 - InfoQ](https://www.infoq.com/jdk26/)
- **author:** Sharat Chander, Billy Korando, Ron Pressler, Michael Redlich
- **date:** 2-18 Mart 2026
- **category:** JDK / JVM / runtime davranışı
- **tags:** `jdk-26`, `http3`, `httpclient`, `final-fields`, `g1gc`, `devops`
- **summary:** Resmi Java kanallarında bu turda yeni bir JDK sürümü çıkmış değil; ancak `JDK 26` için `HTTP/3`, `HttpClient` timeout ve body kapsamı, `Content-Length` davranışı, `final field mutation` warning modeli ve DevOps etkileri tekrar tekrar vurgulanıyor.
- **why_it_matters:** Bu başlıkların etkisi derleme anında değil, gerçek network, proxy, container ve observability koşullarında ortaya çıkar.
- **java_spring_relevance:** `RestClient`, `WebClient`, gateway, reverse proxy, container memory tuning ve reflection kullanan kütüphaneler nedeniyle Spring ekipleri doğrudan etkilenir.
- **actionability:** Lab testi ve pre-prod checklist
- **impact_level:** Yüksek
- **opportunities:** Daha iyi ağ verimi, daha modern HTTP yetenekleri, potansiyel throughput artışı, bellek ve startup optimizasyonları.
- **risks:** Proxy uyumsuzlukları, timeout sürprizleri, legacy endpoint’lerde `Content-Length` beklentisi, reflection kullanan kütüphanelerde warning veya gelecekte kırılma.
- **migration_notes:** Proxy ve load balancer zinciriyle test yapın. `--illegal-final-field-mutation=debug` veya JFR ile uyarı kaynaklarını görünür kılın. Timeout ve memory tuning varsayımlarınızı `JDK 26` altında yeniden kalibre edin.

## Sonuç

Bugünün en yüksek öncelikli kararı, `Spring Security` yamalarını bekletmemek ve `Spring AI` kullanan ekiplerde güvenlik ile provider bağımlılığı envanterini birlikte çıkarmak. Hemen ardından gelen ikinci net karar, `Boot 4.1` milestone’larını üretim kontratı gibi değil, kontrollü pilot zemini gibi ele almak.

Orta vadede ise üç tema baskın: tooling olgunlaştıkça `Boot 4 / Framework 7` geçişi hızlanacak, veri erişim API’leri daha type-safe ve deklaratif hale gelecek ve `JDK 26` geçişi klasik “minor upgrade” gibi yönetilemeyecek. Bugün gürültüden çok mühendislik sinyali vardı; bu nedenle rapor özellikle patching, migration maliyeti ve üretim etkisine odaklandı.
