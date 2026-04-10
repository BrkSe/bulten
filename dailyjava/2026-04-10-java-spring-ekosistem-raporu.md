# Günlük Java / Spring Ekosistem Raporu

Tarih: `10 Nisan 2026, 09:00 TRT`

Kapsam: `9 Nisan 2026 09:00 TRT` ile `10 Nisan 2026 09:00 TRT` arasındaki günlük tarama. Önceki raporlarda ayrıntılı işlendiği için `Spring Cloud 2025.0.2 / CVE-2026-22739`, genel `JDK 26` özellik listesi, `Project Leyden`, `JDK 27 Post-Quantum TLS`, `Spring AI AutoMemoryTools`, `JavaClaw` ve `Spring Data` typed property paths bu raporda yeni bulgu gibi tekrar edilmedi.

Kaynak tarama notu: [Spring Blog](https://spring.io/blog/), Spring proje ve güvenlik sayfaları, Spring release notları / GitHub release akışları, [OpenJDK](https://openjdk.org/), [Inside Java](https://inside.java/), Oracle Java kaynakları ve [Ops.java](https://ops.java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), Josh Long'un güncel Spring içerikleri, Gunnar Morling'in blog/GitHub akışı, Spring maintainer duyuruları ve Burak KUTBAY blogu kontrol edildi. Gunnar Morling ve Burak KUTBAY tarafında bugünkü öncelik sıralamasını değiştiren yeni yüksek etkili Java/Spring bulgusu tespit edilmedi.

## Öne Çıkan Başlıklar

- En kritik yeni madde, [CVE-2026-22750](https://spring.io/security/cve-2026-22750/): `Spring Cloud Gateway 4.2.0` içinde `spring.ssl.bundle` ile yapılan SSL bundle konfigürasyonu sessizce yok sayılıp varsayılan SSL konfigürasyonuna düşebiliyor. Bu, Gateway üzerinden mTLS / özel truststore / keystore varsayımı yapan ekipler için doğrudan üretim güvenliği riski.
- [Ops.java](https://ops.java/) tarafında sıradaki Oracle Critical Patch Update tarihi `21 Nisan 2026` olarak görünüyor. Java servis filolarında `26.0.1`, `25.0.3`, `21.0.11`, `17.0.19`, `11.0.31`, `8u491` patch hazırlığı için test matrisi şimdiden hazırlanmalı.
- [Baeldung'un 7 Nisan 2026 tarihli Spring Security 7 MFA yazısı](https://www.baeldung.com/spring-security-7-mfa), MFA'nın Spring Security 7'de `FactorGrantedAuthority`, `@EnableMultiFactorAuthentication` ve `AuthorizationManagerFactory` üzerinden uygulama mimarisine daha yerleşik girdiğini gösteriyor.
- [InfoQ Java roundup](https://www.infoq.com/news/2026/03/java-news-roundup-mar23-2026/) GraalVM Native Build Tools 1.0.0 GA, EclipseLink 5.0.0 GA, Open Liberty 26.0.0.3, Quarkus 3.34.x ve Infinispan 16.2.0 development hattını aynı haftada işaret ediyor. Spring ekipleri için bu, doğrudan "hemen geç" sinyali değil; Jakarta EE 11, native-image build olgunluğu ve alternatif runtime ekosisteminde bakım hızının arttığını gösteren orta öncelikli izleme sinyali.
- [JetBrains Java Annotated Monthly - April 2026](https://blog.jetbrains.com/idea/2026/04/java-annotated-monthly-april-2026/) ve [Java 26 in IntelliJ IDEA](https://blog.jetbrains.com/idea/2026/03/java-26-in-intellij-idea/) içerikleri, Java 26 desteğinin sadece dil seviyesi değil, virtual thread debugger, Spring Data, Spring Debugger, Gradle ve AI-agent destekli geliştirici iş akışlarıyla birlikte ele alındığını gösteriyor.

## Kritik Güncellemeler

1. `Spring Cloud Gateway 4.2.0` için yüksek seviyeli güvenlik duyurusu yayınlandı.
   [Spring Security Advisories](https://spring.io/security/cve-2026-22750/) duyurusuna göre `spring.ssl.bundle` ile yapılandırılan SSL bundle sessizce uygulanmayıp default SSL konfigürasyonu kullanılabiliyor. Açık kaynak destek dışı `4.2.x` hattında kalan ekipler için pratik karar ikiye ayrılıyor: enterprise destekle `4.2.1+` düzeltmesini almak veya açık kaynak destekli `5.0.2` / `5.1.1` hattına geçiş planlamak.

2. Java CPU hazırlığı artık kısa vadeli operasyon maddesi.
   [Ops.java](https://ops.java/) güncel Java sürümlerini `26`, `25.0.2`, `21.0.10`, `17.0.18`, `11.0.30`, `8u481` olarak listeliyor ve sonraki CPU setini `21 Nisan 2026` için işaret ediyor. Spring Boot servisleri için bu, "çıktığı gün bakarız" değil, container base image, CI cache, JDK vendor uyumluluğu, TLS regression ve smoke test penceresini bugünden açma konusu.

3. Spring Security 7 MFA uygulama kodu seviyesinde daha somut hale geliyor.
   [Baeldung MFA yazısı](https://www.baeldung.com/spring-security-7-mfa), MFA'nın ayrı bir filtre hack'i olarak değil, authentication factor authority modeliyle authorization katmanına taşındığını gösteriyor. `Boot 4 / Spring Security 7` pilotu yapan ekiplerde admin endpoint, ödeme/hesap endpoint'i ve privileged operation akışları için incelenmeli.

## Trendler ve Sinyaller

### 1. Konfigürasyon güvenliği yeniden birinci sınıf risk

`CVE-2026-22750`, doğrudan kod açığından çok "konfigürasyonun sessizce beklenenden farklı uygulanması" sınıfında. Bu, Spring Cloud Gateway gibi edge bileşenlerinde tehlikeli: uygulama çalışır, health check geçer, fakat TLS güvenlik varsayımı yanlış olur. Üretim mimarisi açısından en kalıcı değer, Gateway konfigürasyonlarının sadece unit/integration test değil, canlı TLS handshake ve sertifika doğrulama smoke testleriyle doğrulanması.

### 2. Güvenlik bakımı iki hattan ilerliyor: framework patch ve platform CPU

Spring Cloud Gateway CVE'si ile 21 Nisan Java CPU penceresi birlikte okunmalı. Bir mikroservis platformu için sadece Spring BOM güncellemek yetmez; JDK patch, base image, truststore, FIPS / crypto policy ve Gateway TLS davranışı aynı release takviminde test edilmeli.

### 3. Spring Security 7 ile authorization modeli genişliyor

MFA desteği `AuthorizationManager` çizgisini güçlendiriyor. Bu, Spring Security 6'dan 7'ye geçişte eski `AccessDecisionManager`, `AccessDecisionVoter`, `FilterSecurityInterceptor` tabanlı custom güvenlik kodlarının daha fazla teknik borç haline geleceği anlamına geliyor. Uzun vadeli değer, custom filter / ad hoc session bayrağı yerine factor-based authorization modeline yaklaşmakta.

### 4. Java tooling artık runtime teşhisiyle birleşiyor

JetBrains'in Java 26, virtual thread debugger, Spring Debugger, Spring Data ve Gradle vurguları, IDE'nin sadece editör değil, runtime davranışı ve migration feedback mekanizması haline geldiğini gösteriyor. Bu sinyal kalıcı: virtual thread, structured concurrency, AOT, Spring Data mapping ve remote Spring Boot debugging gibi konular IDE, build ve observability araçları arasında daha fazla bağ kuracak.

### 5. Adjacent JVM ekosistemi hızlı bakım döngüsünde

InfoQ roundup'ında GraalVM Native Build Tools, EclipseLink, Open Liberty, Quarkus ve Infinispan'ın aynı dönemde release üretmesi, Spring dışı ama JVM üretim ekipleri için önemli. Kısa vadede Spring standardını değiştirmez; uzun vadede Jakarta Persistence 3.2, native-image build olgunluğu, Open Liberty startup optimizasyonu ve Infinispan RESP/OpenAPI yönü karşılaştırmalı mimari kararları etkileyebilir.

## Araçlar ve Kütüphaneler

- `Spring Cloud Gateway`: `4.2.0` için `CVE-2026-22750`; SSL bundle doğrulaması yapılmalı, `4.2.x` açık kaynak destek dışı olduğu için upgrade yolu netleştirilmeli.
- `Spring Security 7`: MFA için `FactorGrantedAuthority`, `@EnableMultiFactorAuthentication`, `AuthorizationManagerFactory` ile global, endpoint bazlı, zaman bazlı ve kullanıcı bazlı policy yazımı daha standart hale geliyor.
- `Java / JDK`: 21 Nisan CPU penceresi; `21.0.11` ve `17.0.19` özellikle LTS servis filoları için erken regression hazırlığı gerektiriyor.
- `IntelliJ IDEA 2026.1`: Java 26 desteği, virtual thread debugger iyileştirmeleri, Spring Data / Spring Debugger akışları, Git worktrees ve AI-agent entegrasyonları geliştirme ortamı standardizasyonuna girebilir.
- `GraalVM Native Build Tools 1.0.0`: GA olması Spring Boot native-image pilotlarında build plugin olgunluğu açısından olumlu, ancak önceki rapordaki uyarı geçerli: native kararını cold start, RSS, CPU, tail latency, build süresi ve rollback planıyla ölçmeden platform standardına çevirmeyin.
- `EclipseLink 5.0.0`: Jakarta Persistence 3.2 / Jakarta EE 11 desteği Spring Boot ekipleri için doğrudan varsayılan JPA provider değişimi anlamına gelmez; ancak JPA standardının yönünü izlemek için değerli.
- `Open Liberty 26.0.0.3`, `Quarkus 3.34.x`, `Infinispan 16.2.0.Dev01`: Alternatif runtime ve data-grid dünyasında bakım hızı yüksek; Spring ekipleri için rekabetçi benchmark ve entegrasyon sinyali olarak izlenmeli.

## Java / Spring Geliştiricileri İçin Etkiler

- Gateway kullanan ekipler `spring.ssl.bundle` konfigürasyonlarını sadece property varlığıyla değil, gerçek TLS davranışıyla doğrulamalı. Özellikle outbound route'larda özel truststore/keystore, internal CA, mTLS veya partner API sertifika pinleme akışları varsa bu bug üretimde sessiz risk yaratabilir.
- `Spring Cloud Gateway 4.2.0` kullanan bir sistem varsa, karar "patch mi major upgrade mi" olarak ele alınmalı. `4.2.x` açık kaynak destek dışı olduğu için açık kaynak kullanıcılarının `5.0.2` veya `5.1.1` hattını değerlendirmesi gerekiyor.
- Java LTS filoları için `21.0.11` / `17.0.19` CPU öncesi staging testleri bugünden planlanmalı. Sadece uygulama testleri değil, image rebuild, SBOM, TLS handshake, keystore/truststore ve JVM flags de kontrol edilmeli.
- Spring Security 7'ye geçiş planlayan ekipler MFA'yı mevcut custom 2FA kodlarını birebir taşıma işi olarak görmemeli. Model, authentication factor authority üzerinden authorization policy yazmaya kayıyor.
- IDE ve build araçları, Java 26 ve Spring Boot 4 hattı için migration feedback loop'unun parçası olmalı. Takım standardı olarak JDK 26 language level, preview feature kapısı, virtual thread debugger görünürlüğü ve Gradle/Maven plugin uyumu belgelenmeli.

## Fırsatlar ve Riskler

### Fırsatlar

- Gateway TLS konfigürasyonlarına otomatik smoke test ekleyerek güvenlik varsayımlarını deploy sonrası doğrulamak.
- Spring Security 7 MFA modelini admin, ödeme, kişisel veri ve production operation endpoint'lerinde pilotlamak.
- 21 Nisan CPU öncesi JDK patch pipeline'ını prova ederek base image ve regression süresini azaltmak.
- Java 26 / IntelliJ IDEA 2026.1 desteğini kullanarak virtual thread ve structured concurrency debug deneyimini standardize etmek.
- GraalVM Native Build Tools 1.0.0 ile native-image pilotlarında plugin kaynaklı sürtünmeyi azaltmak.

### Riskler

- `Spring Cloud Gateway 4.2.0` üzerinde kalıp SSL bundle'ın uygulandığını varsaymak.
- `4.2.x` destek durumunu göz ardı edip sadece minor patch beklemek; açık kaynak destekli hat ile enterprise support hattını karıştırmak.
- Java CPU çıktığında test edilmemiş JDK patch'ini tüm servis filosuna aynı anda basmak.
- MFA'yı kullanıcı deneyimi, session yenileme, remember-me, OIDC / IdP entegrasyonu ve audit log senaryolarını test etmeden yaygınlaştırmak.
- Native-image veya Jakarta EE 11 sinyallerini "Spring platform standardı değişti" diye fazla hızlı yorumlamak.

## İzlenmesi Gereken Konular

- `Spring Cloud Gateway 4.2.0` kullanan servislerde `spring.ssl.bundle` gerçek kullanımı ve upgrade kararı.
- `Spring Cloud Gateway 5.0.2` / `5.1.1` geçiş notlarında Boot / Cloud train uyumluluğu ve route filter davranışları.
- `21 Nisan 2026` Java CPU sonrasında JDK `21.0.11` ve `17.0.19` için TLS, timezone, crypto policy ve container image regressions.
- Spring Security 7 MFA örneklerinin OIDC, passkey/WebAuthn, X.509 ve enterprise IdP pratikleriyle nasıl birleşeceği.
- Spring I/O ve Java Day Istanbul döneminde Spring AI, Spring Security 7, Boot 4 ve Java 26 etrafında gelecek yeni maintainer anlatıları.
- GraalVM Native Build Tools 1.0.0 sonrası Spring Boot native image plugin ve CI cache davranışlarında raporlanacak gerçek üretim deneyimleri.

## Kaynak Bazlı Bulgular

### 1. Spring Cloud Gateway `CVE-2026-22750`: SSL bundle konfigürasyonu sessizce bypass edilebiliyor

- **title:** `Spring Cloud Gateway 4.2.0` için SSL bundle bypass güvenlik duyurusu
- **source:** [Spring Security Advisory: CVE-2026-22750](https://spring.io/security/cve-2026-22750/)
- **author:** Spring Security Advisories; raporlayan: Otmane Omry
- **date:** `9 Nisan 2026`
- **category:** Güvenlik / Spring Cloud Gateway / TLS konfigürasyonu
- **tags:** `spring-cloud-gateway`, `ssl-bundle`, `tls`, `mTLS`, `CVE-2026-22750`, `configuration-risk`, `spring-cloud`
- **summary:** `Spring Cloud Gateway 4.2.0` içinde `spring.ssl.bundle` ile verilen SSL bundle konfigürasyonu uygulanmayıp default SSL konfigürasyonu kullanılabiliyor. Duyuru `HIGH` olarak işaretlenmiş; etki özellikle integrity tarafında yüksek.
- **why_it_matters:** Gateway katmanı çoğu mimaride servis trafiğinin güvenlik sınırı. SSL bundle'ın sessizce yok sayılması, deploy başarılı görünürken yanlış truststore/keystore ile trafik çıkılması anlamına gelebilir.
- **java_spring_relevance:** Spring Cloud Gateway kullanan Spring Boot mikroservis platformları için doğrudan ilgili. Özellikle internal CA, partner API, outbound mTLS, private PKI veya route bazlı TLS konfigürasyonu olan takımlar kontrol etmeli.
- **actionability:** Hemen aksiyon alınmalı.
- **impact_level:** Yüksek.
- **opportunities:** Gateway TLS testlerini otomatikleştirmek; Spring Cloud Gateway major/minor upgrade politikasını netleştirmek; SSL konfigürasyonunu deploy sonrası gerçek handshake ile doğrulamak.
- **risks:** `4.2.0` üzerinde kalmak; `4.2.x` açık kaynak destek durumunu yanlış varsaymak; sadece property dosyasına bakıp gerçek TLS davranışını test etmemek.
- **migration_notes:** `4.2.0` kullanan servisleri envanterleyin. Enterprise destek varsa `4.2.1+` düzeltmesini değerlendirin; yoksa duyurudaki öneriye uygun olarak açık kaynak destekli `5.0.2` veya `5.1.1` hattına geçiş için Boot / Cloud uyumluluğu, route filter davranışı, actuator endpoint'leri ve gateway integration testlerini çalıştırın.

### 2. Java CPU takvimi 21 Nisan penceresine yaklaşıyor

- **title:** Java servis filoları için `21 Nisan 2026` CPU hazırlığı
- **source:** [Ops.java](https://ops.java/)
- **author:** Oracle Java / Java administration kaynakları
- **date:** `10 Nisan 2026` taramasında güncel
- **category:** Java platformu / güvenlik bakımı / operasyon
- **tags:** `jdk`, `oracle-cpu`, `java-21`, `java-17`, `container-image`, `tls`, `security-patching`
- **summary:** Ops.java güncel Java sürümlerini `26`, `25.0.2`, `21.0.10`, `17.0.18`, `11.0.30`, `8u481` olarak listeliyor; sonraki CPU için `26.0.1`, `25.0.3`, `21.0.11`, `17.0.19`, `11.0.31`, `8u491` setini `21 Nisan 2026` penceresine koyuyor.
- **why_it_matters:** Java patch güncellemeleri sadece JVM binary güncellemesi değildir; container base image, TLS, crypto policy, timezone data, monitoring agent ve CI cache etkileri olabilir.
- **java_spring_relevance:** Spring Boot servislerinin çoğu Java 17 veya 21 LTS üzerinde koşuyor. CPU geldiğinde BOM değişmese bile runtime davranışı değişebilir.
- **actionability:** Hemen hazırlık yapılmalı; patch çıkışı beklenmeli.
- **impact_level:** Orta-yüksek.
- **opportunities:** JDK patch pipeline'ını standartlaştırmak; base image rebuild süresini kısaltmak; TLS ve observability smoke testlerini güvenlik takvimine bağlamak.
- **risks:** Patch günü tüm filoyu test etmeden yükseltmek; farklı JDK vendor'larını karıştırmak; staging ve production image digest'lerinin ayrışması; eski güvenlik provider / agent uyumsuzlukları.
- **migration_notes:** `21` ve `17` LTS kullanan servisleri önceliklendirin. JDK vendor, image tag, Maven/Gradle toolchain, JVM flags, truststore ve monitoring agent versiyonlarını tek tabloda çıkarın. CPU yayınlandığında önce canary image, sonra gateway/auth/payment gibi hassas servisler için targeted regression çalıştırın.

### 3. Spring Security 7 MFA, authorization modeline daha yerleşik giriyor

- **title:** Spring Security 7 MFA için pratik uygulama modeli netleşiyor
- **source:** [Baeldung: Multi-Factor Authentication in Spring Security 7](https://www.baeldung.com/spring-security-7-mfa), [Spring Blog: Multi-Factor Authentication in Spring Security 7](https://spring.io/blog/2025/10/21/multi-factor-authentication-in-spring-security-7)
- **author:** Sagar Verma; Spring tarafında Josh Cummings
- **date:** Baeldung yazısı `7 Nisan 2026`; resmi Spring arka plan yazısı `21 Ekim 2025`
- **category:** Uygulama güvenliği / Spring Security / kimlik doğrulama
- **tags:** `spring-security-7`, `mfa`, `FactorGrantedAuthority`, `AuthorizationManagerFactory`, `spring-boot-4`, `security-testing`
- **summary:** Baeldung yazısı Spring Security 7 MFA desteğini global, endpoint bazlı, zaman bazlı ve kullanıcı bazlı policy örnekleriyle açıklıyor. Temel model, başarılı her faktörün authentication nesnesine authority olarak eklenmesi ve authorization katmanında doğrulanması.
- **why_it_matters:** Kurumsal uygulamalarda MFA çoğu zaman custom filtre, session attribute veya IdP dışı workaround ile uygulanıyor. Spring Security 7 modeli, uygulama içi authorization politikasına daha tutarlı bir MFA semantiği getiriyor.
- **java_spring_relevance:** Boot 4 / Spring Security 7 migration pilotları için yüksek ilgili. Admin endpoint'leri, hesap ayarları, ödeme, kişisel veri ve production operation akışları ilk adaylar.
- **actionability:** Boot 4 pilotlarında hemen değerlendirin; geniş üretim geçişi için izleyin.
- **impact_level:** Orta-yüksek.
- **opportunities:** Eski custom 2FA kodunu sadeleştirmek; factor bazlı test yazmak; hassas endpoint'lerde recent authentication policy uygulamak; authorization kurallarını daha okunabilir hale getirmek.
- **risks:** Mevcut IdP/OIDC akışlarıyla çakışma; kullanıcı deneyimi bozulması; remember-me / session fixation / logout davranışlarının eksik test edilmesi; eski `AccessDecision*` custom kodlarının migration maliyeti.
- **migration_notes:** Önce `AuthorizationManager` kullanımını ve eski Access API bağımlılıklarını envanterleyin. MFA'yı tüm uygulamaya yaymadan önce admin veya profile endpoint gibi dar bir kapsamda `MockMvc` / security testleriyle factor authority beklentisini doğrulayın.

### 4. IntelliJ IDEA 2026.1, Java 26 ve Spring geliştirme geri bildirim döngüsünü güçlendiriyor

- **title:** IDE tarafında Java 26, Spring Debugger ve virtual thread görünürlüğü birleşiyor
- **source:** [Java 26 in IntelliJ IDEA](https://blog.jetbrains.com/idea/2026/03/java-26-in-intellij-idea/), [Java Annotated Monthly - April 2026](https://blog.jetbrains.com/idea/2026/04/java-annotated-monthly-april-2026/), [What's New in IntelliJ IDEA 2026.1](https://www.youtube.com/watch?v=FVsMsCFtlOs)
- **author:** Marit van Dijk, Andrei Kogun, Irina Mariasova; JetBrains IntelliJ IDEA ekibi
- **date:** Mart/Nisan 2026
- **category:** Developer productivity / Java tooling / Spring debugging
- **tags:** `intellij-idea-2026.1`, `java-26`, `virtual-threads`, `spring-debugger`, `spring-data`, `gradle`, `ai-agents`
- **summary:** JetBrains içerikleri Java 26 desteğini IDE language level, preview/incubator feature desteği, virtual thread debugger görünürlüğü, Spring Data, Spring Debugger, Gradle pratikleri ve AI-agent entegrasyonlarıyla birlikte sunuyor.
- **why_it_matters:** Java 26 ve Boot 4 döneminde migration geri bildirimi sadece CI'dan gelmemeli. IDE, kod seviyesinde preview feature uyarısı, runtime debug görünürlüğü ve Spring mapping hatalarını erken yakalama katmanı haline geliyor.
- **java_spring_relevance:** Spring Boot ekipleri için özellikle virtual thread, Spring Data repository/mapping, Kotlin + JPA, remote Spring Boot debugging ve Gradle build hygiene başlıklarında pratik değer var.
- **actionability:** Takım araç standardı içinde değerlendirilmeli.
- **impact_level:** Orta.
- **opportunities:** Java 26 denemelerini daha kontrollü yapmak; virtual thread davranışını daha görünür kılmak; Spring Data ve Spring Debugger ile local feedback süresini kısaltmak; Git worktree kullanan paralel migration akışlarını rahatlatmak.
- **risks:** IDE davranışına fazla güvenip CI/build toolchain tutarlılığını ihmal etmek; preview feature'ları production koduna yanlışlıkla taşımak; ekipte farklı IDE/JDK ayarlarıyla tutarsız sonuçlar almak.
- **migration_notes:** Repo seviyesinde `.sdkmanrc`, Gradle/Maven toolchain ve IDE language level beklentisini belgeleyin. Java 26 preview/incubator kullanımını ayrı branch veya playground ile sınırlayın. Debugger iyileştirmelerini production observability yerine değil, local/staging teşhis desteği olarak konumlandırın.

### 5. InfoQ roundup, Spring dışı JVM ekosisteminde bakım hızının yüksek olduğunu gösteriyor

- **title:** GraalVM Build Tools, EclipseLink, Open Liberty, Quarkus ve Infinispan aynı dönemde güncellendi
- **source:** [InfoQ: Java News Roundup - GraalVM Build Tools, EclipseLink, Spring Milestones, Open Liberty, Quarkus](https://www.infoq.com/news/2026/03/java-news-roundup-mar23-2026/)
- **author:** Michael Redlich
- **date:** `30 Mart 2026`
- **category:** JVM ekosistemi / Jakarta EE / native image / alternatif runtime
- **tags:** `graalvm-native-build-tools`, `eclipselink-5`, `jakarta-persistence-3.2`, `open-liberty`, `quarkus`, `infinispan`, `spring-ai`, `spring-boot-4.1`
- **summary:** Roundup; GraalVM Native Build Tools 1.0.0 GA, EclipseLink 5.0.0 GA, Open Liberty 26.0.0.3, Quarkus 3.34.x, Infinispan 16.2.0.Dev01 ve Spring milestone akışlarını aynı haftada topluyor.
- **why_it_matters:** Spring ekipleri genellikle doğrudan bu runtime'lara geçmez, ancak ekosistem sinyali önemlidir: native-image build aracı olgunlaşıyor, Jakarta Persistence 3.2 ilerliyor, data-grid ve alternatif microservice runtime'ları hızlı bakım üretiyor.
- **java_spring_relevance:** Spring Boot native image, JPA standardı, cache/data-grid, Kubernetes runtime footprint ve alternatif framework benchmark'larıyla ilgilenen ekipler için orta düzeyde ilgili.
- **actionability:** İzlenmeli; sadece ölçülebilir ihtiyaç varsa pilotlanmalı.
- **impact_level:** Orta.
- **opportunities:** Native-image build pipeline'ında plugin olgunluğunu değerlendirmek; Jakarta Persistence 3.2 özelliklerini izlemek; Infinispan RESP/OpenAPI gelişmelerini cache/data-grid mimarisinde not etmek; Open Liberty/Quarkus benchmark'larını Spring Boot baseline ile kıyaslamak.
- **risks:** Spring standardını acele değiştirmek; milestone release'leri production standardı gibi görmek; native-image kararını yalnızca araç GA oldu diye almak.
- **migration_notes:** Bu bulgu doğrudan migration emri değil. Native-image veya JPA provider değişimi için önce tek servis, kontrollü benchmark, rollback planı, observability uyumu ve build süresi ölçümü yapılmalı.

### 6. Josh Long'un AI orchestration sohbeti, Spring topluluğunda agent mimarisi ilgisinin sürdüğünü gösteriyor

- **title:** AI orchestration konusu Spring topluluğunda izlenmeye devam ediyor
- **source:** [A Bootiful Podcast: Mark Kropf on AI orchestration](https://spring.io/blog/2026/04/09/a-bootiful-podcast-ana-mark-kropf)
- **author:** Josh Long; konuk: Mark Kropf
- **date:** `9 Nisan 2026`
- **category:** AI uygulama mimarisi / topluluk sinyali
- **tags:** `ai-orchestration`, `spring-community`, `agentic-applications`, `spring-ai`, `low-priority`
- **summary:** Josh Long, Mark Kropf ile AI orchestration üzerine kısa bir podcast yayınladı. Duyuru metni bunun doğrudan JVM veya Spring ile ilgili olmadığını belirtiyor; bu nedenle bulgu düşük öncelikli ama Spring topluluğunda AI orchestration ilgisinin sürdüğünü teyit ediyor.
- **why_it_matters:** Spring AI ve agentic Java akışları önceki raporlarda işlendi. Bu yeni içerik teknik release değil, ancak "chat UI" dışındaki orchestration, memory, security ve workflow konularının topluluk gündeminde kalıcılaştığını gösteriyor.
- **java_spring_relevance:** Doğrudan framework migration etkisi yok. Relevance, Spring AI / MCP / agent workflow pilotları yapan ekiplerin kavram ve mimari tartışmaları izlemesiyle sınırlı.
- **actionability:** Bilgilendirici; düşük öncelikle izlenmeli.
- **impact_level:** Düşük-orta.
- **opportunities:** AI orchestration tasarımlarında framework bağımlılığından önce workflow, güvenlik, gözlemlenebilirlik ve veri sınırlarını tartışmak.
- **risks:** Her AI orchestration içeriğini üretim standardı veya Spring roadmap işareti gibi yorumlamak; önceki raporlarda işlenen deneysel agent araçlarını aceleyle production'a taşımak.
- **migration_notes:** Migration yok. AI orchestration POC'lerinde sadece teknik demo değil, audit log, prompt/tool policy, secret handling, rate limiting ve rollback kriterleri belirlenmeli.

## Sonuç

Bugünün ana aksiyonu nettir: `Spring Cloud Gateway 4.2.0` kullanan sistemlerde `CVE-2026-22750` etkisi incelenmeli ve SSL bundle davranışı gerçek TLS testleriyle doğrulanmalı. İkinci operasyon başlığı, `21 Nisan 2026` Java CPU penceresi için JDK patch hazırlığını bugünden başlatmak.

Spring Security 7 MFA, Boot 4 migration pilotları için değerli ama kontrollü bir fırsat. InfoQ ve JetBrains sinyalleri ise Spring dışı JVM bakım hızının ve Java tooling feedback loop'unun güçlendiğini gösteriyor. Bugünkü raporda hype tarafı özellikle dar tutuldu: AI orchestration içerikleri izlenmeli, ancak üretim roadmap'ini belirleyen asıl gelişme güvenlik ve platform bakım hattı.
