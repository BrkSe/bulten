# Günlük Java / Spring Ekosistem Raporu

Tarih: 14 Mayıs 2026  
Tarama zamanı: 14 Mayıs 2026 09:02 TSİ  
Odak: Mayıs release-train kayması, Spring güvenlik/support sınırı, Boot 4 migration lane'i, Spring Cloud sürüm hizası ve JDK 27 runtime uyumluluğu

Tarama notu: Bu rapor hazırlanırken önce [Official Spring Blog](https://spring.io/blog/), [Spring Projects](https://spring.io/projects/), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud), [Spring Cloud release/support matrix](https://docs.spring.io/spring-cloud-release/reference/spring-projects.html) ve [Supported Versions wiki](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions), [Spring Boot proje sayfası](https://spring.io/projects/spring-boot), [Spring Boot 4.0 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes), [Spring Boot 4.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide), [Inside Java](https://inside.java/), [OpenJDK JEP Index](https://openjdk.org/jeps/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung'in Boot 4 / Framework 7 özeti](https://www.baeldung.com/spring-boot-4-spring-framework-7), [Josh Long'un güncellemeleri](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026), [Gunnar Morling'in son yazıları](https://www.morling.dev/), ilgili GitHub release/wiki sayfaları ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. 13 Mayıs 2026 raporundaki Spring Cloud Config/Function advisory kümesi ve Spring AI M6 migration ayrıntıları tekrar ana başlık yapılmadı. Bugünün daha kalıcı sinyali; patch/support sınırının sertleşmesi, release takviminin ötelenmesi ve Boot 4 ile JDK 27 uyumluluk işlerinin somutlaşması. Baeldung, Gunnar Morling ve Burak KUTBAY kaynakları bağlam sağladı; fakat bugünün birincil üretim etkisi resmi Spring ve OpenJDK kaynaklarından geldi.

## Öne Çıkan Başlıklar

- [11 Mayıs 2026 tarihli resmi Spring duyurusu](https://spring.io/blog/2026/05/11/may-train-shift/), Mayıs OSS release-train takviminin `1-5 Haziran 2026` aralığına kaydığını söylüyor. Bu, Spring Boot `4.1` ve eşlik eden patch/minor sürümlerin takvimini doğrudan öteler.
- [Spring Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/) ve [Spring Framework 7.0.7 / 6.2.18](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/) hattı yalnız bugfix değil; güvenlik ve OSS destek sınırı aynı anda sıkılaştı. Özellikle Framework `5.3.x` ve `6.1.x` artık OSS dışı.
- [Spring Cloud support matrix](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions) artık Boot/Cloud hizasının opsiyon değil zorunluluk olduğunu daha açık gösteriyor: `2025.1.x (Oakwood)` hattı Boot `4.0.x` için ana yol; `2024.0` ve daha eski nesiller wiki üzerinde OSS politika dışı olarak işaretlenmiş.
- [InfoQ'nun Spring 7 / Boot 4 paneli](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Boot 4 release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes) ve [migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide) birlikte okunduğunda göçün bir `parent version` yükseltmesi olmadığı net: modüler auto-config, Jackson 3, yerleşik retry/throttling ve API versioning gerçek migration iş çıkarıyor.
- JVM tarafında [Inside Java'nın 13 Mayıs 2026 heads-up'ı](https://inside.java/2026/05/13/quality-heads-up/) düşük sesli ama önemli: JDK 27 ile `-noverify`, `-Xverify:none`, `-verifyremote` ve `-noclassgc` artık hata ile fail edecek.

## Kritik Güncellemeler

### 1. Mayıs release-train artık Haziran başına kaydı

[Spring'in resmi duyurusu](https://spring.io/blog/2026/05/11/may-train-shift/) Mayıs release-train penceresinin `11-22 Mayıs 2026` yerine `1-5 Haziran 2026` aralığına taşındığını açıkladı. Bu yalnız takvimsel bir detay değil. Boot `4.1`, portföydeki yeni minor sürümler ve planlanan OSS patch'ler aynı koordineli pencerede çıkacağı için kurum içi yükseltme planları, "GA geldiğinde alırız" yaklaşımıyla değil RC/test lane'i uzatacak şekilde güncellenmeli.

### 2. Boot 4.0.6 ve Framework 7.0.7 güvenlik tabanını yeniden çizdi

[Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/) sekiz ayrı CVE ile geldi; bunlar SSL bundle ile hostname verification kapanması, DevTools remote secret timing attack, zayıf PRNG ile secret üretimi ve varsayılan security chain davranışı gibi doğrudan üretim yüzeylerine dokunuyor.  
[Framework 7.0.7 ve 6.2.18](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/) ise WebFlux multipart temp file DoS, static resource cache poisoning ve Windows static resource handling DoS açıklarını kapatırken `5.3.x` ve `6.1.x` hatlarının OSS desteğinin bittiğini açıkça hatırlatıyor.

### 3. Spring Cloud artık BOM hizasını daha sert dayatıyor

[Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud) ve [support matrix wiki](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions) birlikte okunduğunda mesaj açık: Boot `4.0.x` kullanıyorsanız hedefiniz `2025.1.x (Oakwood)` olmalı. Release-train desteği artık büyük ölçüde bağlı olduğu Spring Boot hattının ömrüne göre yorumlanıyor. Yani "Cloud'u bir süre daha eski trende bırakalım" yaklaşımı güvenlik ve bakım borcunu görünür biçimde artırıyor.

### 4. JDK 27 bazı eski launcher flag'lerini sessizce değil sert biçimde kıracak

[Inside Java Quality Outreach notu](https://inside.java/2026/05/13/quality-heads-up/) JDK 27'de `-noclassgc`, `-verifyremote`, `-noverify` ve `-Xverify:none` seçeneklerinin artık tanınmayan option olarak hata vereceğini duyurdu. Eski container image'ları, IDE run config'leri, test harness'leri ve `JAVA_TOOL_OPTIONS` zincirleri için bu gerçek bir startup failure riski.

## Trendler ve Sinyaller

Kurumsal önem sırası:

1. Güvenlik + support boundary
2. Boot/Cloud release-train hizası
3. Boot 4 migration internals
4. JDK 27 runtime uyumluluğu
5. Dağıtık kilitleme ve modüler event yayını güvenilirliği
6. Tooling ve native/AOT üretkenliği

### 1. Platform bileşenleri artık "altyapı detayı" değil, doğrudan uygulama riski

- Tekrarlayan sinyal: Boot, Framework ve Cloud kaynakları aynı anda güvenlik patch'i, destek sınırı ve sürüm hizası mesajı veriyor.
- Kalıcı değer: Config, gateway, discovery, starter ve framework hattını uygulama servislerinden daha yavaş yükseltme alışkanlığı kırılmalı.
- Gürültü: Sadece iş kodunu ve uygulama bağımlılıklarını tarayıp platform katmanını "sonra bakarız" diye ertelemek.

### 2. Boot 4 göçü artık salt API değişikliği değil, platform lane yönetimi

- Tekrarlayan sinyal: [Boot release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes), [migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide) ve [InfoQ paneli](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) aynı yere işaret ediyor.
- Kalıcı değer: Kurum içi starter'lar, `EnvironmentPostProcessor`, `spring.factories`, `HttpMessageConverters`, Jackson 3 uyumu ve API versioning tercihi ayrı bir upgrade akışıyla ele alınmalı.
- Gürültü: `pom.xml` içindeki parent sürümünü yükseltip davranış farklarını entegrasyon testinin "doğal olarak" bulmasını beklemek.

### 3. Tooling ve native/AOT hattı sessiz ama anlamlı biçimde olgunlaşıyor

- Tekrarlayan sinyal: [Spring Tools 5.1.0](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released/) Boot 4/Framework 7 quick-fix'leri getiriyor; [Josh Long'un 5 Mayıs notu](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026/) Spring Shell `4.0.2` ile native image derleme yolunun yeniden güçlendiğini söylüyor; [Inside Java'nın FFM yazısı](https://inside.java/2026/05/12/javaone-post-native-interop/) JNI dışı native entegrasyonu daha gerçekçi hale getiriyor.
- Kalıcı değer: Migration ve native/AOT yolculuğunu yalnız framework ile değil IDE, build ve runtime aracı zinciriyle birlikte düşünmek.
- Gürültü: Her native/AI başlığını kısa vadeli üretim şartı sanmak.

### 4. Dağıtık koordinasyon ve modüler event yayını framework primitive'lerine yaklaşıyor

- Tekrarlayan sinyal: [Spring Integration 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/) Redis lock davranışını iyileştiriyor; [Spring Modulith 2.1 RC1 / 2.0.6](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/) event publication registry ve JobRunr transaction handling üzerinde çalışıyor.
- Kalıcı değer: Özellikle event-driven ve scheduling yoğun sistemlerde framework seviyesindeki güvenilirlik iyileştirmeleri ciddi operasyon maliyeti azaltabilir.
- Gürültü: RC sürümlerini hedefli pilot yerine tüm portföye yaymak.

## Araçlar ve Kütüphaneler

- [Spring Tools 5.1.0](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released/): SQL intelligence, AOT repository desteği, Framework 7 API versioning doğrulaması, otomatik quick-fix'ler ve JDK 25 CDS tabanlı daha hızlı language server startup ile bugün en somut üretkenlik kazancı veren araç güncellemesi.
- [Spring Integration 7.1.0-RC1](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/): Redis `CAS/CAD` tabanlı lock yenileme/bırakma, Redis Java DSL ve `JmsChannelFactoryBean` özelleştirmesi ile entegrasyon altyapısında anlamlı ilerleme.
- [Spring Modulith 2.1 RC1 / 2.0.6](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/): Özellikle event publication registry ve JobRunr transaction handling tarafı, modüler monolith kullanan ekipler için izlemeye değer.
- Düşük öncelik ama izlenebilir: [Spring Shell 4.0.2](https://spring.io/blog/2026/04/24/spring-shell-4-0-2-is-out/) ve Josh Long'un belirttiği native image derleme iyileştirmesi, CLI/ops araçları yazan Java ekipleri için yararlı.
- Düşük öncelik: [JDK 25 FFM API](https://inside.java/2026/05/12/javaone-post-native-interop/) tipik CRUD servisleri için bugün zorunlu değil; ama JNI, ONNX Runtime veya performans-kritik native köprüler için pilot aday.
- Kubernetes, observability ve container orchestration tarafında bugün Spring/JVM ekseninde üretim kararını tek başına değiştirecek yeni resmi duyuru görmedim.

## Java / Spring Geliştiricileri İçin Etkiler

- Boot `3.5`ten `4.x`e geçiş için ayrı bir compatibility lane açın. Özellikle kurum içi starter'lar, `spring.factories`, `EnvironmentPostProcessor`, `HttpMessageConverters`, Jackson 3 ve API versioning tercihleri hedefli test ister.
- Boot `4.0.6` ve Framework `7.0.7` patch'lerini ertelemeyin. Özellikle SSL bundle kullanan auto-config, statik resource sunumu, WebFlux multipart işleme ve DevTools remote kullanan ortamlarda yamalar doğrudan risk düşürüyor.
- Spring Cloud kullanan takımlar BOM hizasını explicit yönetsin. Boot `4.0.x` ise Oakwood `2025.1.x`; Boot `3.5.x` ise Northfields `2025.0.x` hedefi net tanımlanmalı.
- Dockerfile, Helm chart, buildpack env, IDE run config ve test launcher'larında JDK 27 ile kırılacak eski JVM flag'leri aratın. Özellikle `JAVA_TOOL_OPTIONS`, `MAVEN_OPTS`, Gradle daemon ve legacy startup script'leri taranmalı.
- Redis tabanlı lock renewal, scheduled job orchestration veya event publication garantileri sizin için kritikse Spring Integration `7.1` ve Modulith `2.1` RC hattı kontrollü pilot için anlamlı.
- IDE/eklentileri güncellemek bugün gerçek hız kazandırır. Spring Tools `5.1.0`, Boot 4 migration işini elle yapılan property ve annotation düzeltmelerinden önemli ölçüde kurtarıyor.

## Fırsatlar ve Riskler

- Fırsat: Release-train kayması, Boot `4.1` ve yan projeleri daha temiz bir kurumsal test penceresinde doğrulama şansı veriyor.
- Fırsat: Framework 7'nin yerleşik retry ve concurrency throttling yaklaşımı, dış bağımlılıkları sadeleştirip davranışı standartlaştırabilir.
- Fırsat: Spring Tools `5.1.0` ve native/AOT hattındaki iyileştirmeler, upgrade ve ops CLI geliştirme maliyetini düşürebilir.
- Fırsat: JDK 25 FFM ile JNI köprülerini azaltmak, özellikle ML/runtime entegrasyonlarında Java tarafını sadeleştirebilir.
- Risk: `5.3.x`, `6.1.x` ve OSS sınırının dışına düşen Cloud/Boot kombinasyonları, güvenlik açığını yalnız teknik değil tedarik ve destek riski haline getiriyor.
- Risk: Haziran başına kayan release-train, "Mayıs ortasında GA alırız" diye planlanan iç teslimleri zincirleme geciktirebilir.
- Risk: JDK 27'de kaldırılacak eski launcher flag'leri, görünürde sorunsuz olan servisleri startup aşamasında düşürebilir.
- Risk: Boot 4 migration sırasında kurum içi starter ve framework extension'ları, uygulama kodundan daha fazla kırılma çıkarabilir.
- Risk: RC sürümlerinin geniş portföyde erken benimsenmesi, faydadan çok entegrasyon maliyeti üretebilir.

## İzlenmesi Gereken Konular

- `1-5 Haziran 2026` aralığındaki Spring OSS release-train: Boot `4.1`, portföy minor/patch sürümleri ve release calendar güncellemeleri.
- Spring Cloud Oakwood `2025.1.x` hattının stabilizasyonu ve `2025.1.2-SNAPSHOT` sonrası gelen ek düzeltmeler.
- Kurum içi starter'larda Boot 4 migration guide'da işaret edilen `EnvironmentPostProcessor` ve `HttpMessageConverters` etkileri.
- JDK 27 EA testlerinde launcher flag temizliği ve muhtemel ek kaldırma/uyumluluk uyarıları.
- Spring Integration `7.1` ve Modulith `2.1` GA sürümlerinde RC seviyesindeki davranışların korunup korunmadığı.
- Spring AI tarafında kısa vadede yeni büyük migration alarmı görmedim; fakat [Spring AI Session yazısı](https://spring.io/blog/2026/04/15/spring-ai-session-management/) nedeniyle `ChatMemory` geleceği orta vadede izlenmeli.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Mayıs Spring OSS release-train penceresi 1-5 Haziran 2026'ya kaydı
- source: [May Release Train Date Changes](https://spring.io/blog/2026/05/11/may-train-shift/)
- author: Michael Minella
- date: 11 Mayıs 2026
- category: release-management, platform-governance
- tags: spring-release-train, spring-boot-4-1, ga-takvimi, koordinasyon, minor-release
- summary: Spring portföyündeki OSS minor ve patch sürümlerinin Mayıs penceresi resmi olarak Haziran başına kaydırıldı; bu değişiklik Boot `4.1` dahil koordineli portföy sürümlerini etkiliyor.
- why_it_matters: Ekiplerin GA, patch ve regression test takvimleri resmi release-train'e bağlıysa bir haftalık değil, tüm teslim zincirini etkileyen bir plan kayması oluşur.
- java_spring_relevance: Spring Boot tabanlı kurumsal platform ekipleri ve iç starter yöneten organizasyonlar için çok yüksek.
- actionability: planli_aksiyon
- impact_level: yüksek
- opportunities: RC ve pre-GA doğrulama için daha gerçekçi ek süre kazanmak.
- risks: İç roadmap ve bağımlı servis geçişlerinin gecikmesi; yanlış GA beklentisiyle erken donmuş planlar.
- migration_notes: Boot `4.1` veya bağlı minor sürümler için iç upgrade pencereleri `1-5 Haziran 2026` sonrasına göre güncellenmeli.

### Bulgu 2

- title: Spring Boot 4.0.6 ve Spring Framework 7.0.7 güvenlik yaması ile support boundary aynı anda sertleşti
- source: [Spring Boot 4.0.6 available now](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now/), [Spring Framework 6.2.18 and 7.0.7 Available Now](https://spring.io/blog/2026/04/17/spring-framework-6-2-18-and-7-0-7-available-now/), [Spring Boot project page](https://spring.io/projects/spring-boot)
- author: Andy Wilkinson; Stéphane Nicoll
- date: 17 Nisan 2026 ve 23 Nisan 2026
- category: security, support-policy, platform-release
- tags: spring-boot-4-0-6, spring-framework-7-0-7, cve, ssl-bundles, webflux, static-resources, oss-support
- summary: Boot `4.0.6` sekiz CVE kapatırken Framework `7.0.7` ve `6.2.18` üç ayrı Web/Static Resource güvenlik sorununu düzeltti; ayrıca Framework `5.3.x` ve `6.1.x` OSS desteğinin bittiği net biçimde tekrarlandı.
- why_it_matters: Bu kombinasyon upgrade'i "isteğe bağlı patch" olmaktan çıkarıp doğrudan risk azaltma işine dönüştürüyor.
- java_spring_relevance: Spring MVC, WebFlux, Boot auto-config, Actuator ve SSL bundle kullanan servisler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Güvenlik yamasını alırken aynı anda desteklenen hatlara geçerek gelecekteki patch akışını sadeleştirmek.
- risks: Hostname verification, DevTools remote secret kıyası, temp file ve static resource yüzeylerinde üretim açığı; destek dışı nesillerde kalma.
- migration_notes: OSS kullanıcıları desteklenen hatlara yükselmeli; ticari destek kullanan ekipler için hotfix yolu var ama bu orta vadeli kalış stratejisi yerine geçmez.

### Bulgu 3

- title: Spring Cloud support matrix, Boot ve Cloud BOM hizasını zorunlu hale getiriyor
- source: [Spring Cloud project page](https://spring.io/projects/spring-cloud), [Spring Cloud Release 2025.1.1 docs](https://docs.spring.io/spring-cloud-release/reference/spring-projects.html), [Supported Versions wiki](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions)
- author: Spring Cloud team; Spencer Gibb
- date: 2026 güncel proje sayfaları, wiki düzenleme 19 Mart 2026
- category: compatibility, microservices, support-policy
- tags: spring-cloud, oakwood, northfields, bom, compatibility-matrix, boot-cloud-alignment
- summary: Spring Cloud `2025.1.x (Oakwood)` hattı Boot `4.0.x` ile eşleşiyor; support matrix, eski release-train'lerin OSS politika dışına düştüğünü daha görünür hale getiriyor ve destek ömrünü Spring Boot hattına bağlayarak yorumluyor.
- why_it_matters: Cloud sürüm kararı artık yalnız dependency seçimi değil, destek ve güvenlik politikasının bir parçası.
- java_spring_relevance: Spring Cloud Config, Gateway, OpenFeign, Stream, Discovery ve benzeri bileşenlerle mikroservis yöneten ekipler için çok yüksek.
- actionability: planli_aksiyon
- impact_level: yüksek
- opportunities: Tek bir BOM stratejisiyle sürüm uyumsuzluğu ve upgrade kaosunu azaltmak.
- risks: Boot/Cloud uyumsuz hatlarda kalmak; üçüncü taraf bağımlılıkların Spring Cloud patch'lerinden daha hızlı EOL olması.
- migration_notes: Boot `4.0.x` için Oakwood `2025.1.x`; Boot `3.5.x` için Northfields `2025.0.x` hedefi net olarak standardize edilmeli.

### Bulgu 4

- title: Boot 4 migration işi parent sürüm yükseltmesinden daha büyük
- source: [Spring Boot 4.0 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes), [Spring Boot 4.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide), [The Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Baeldung: Spring Boot 4 & Spring Framework 7 – What's New](https://www.baeldung.com/spring-boot-4-spring-framework-7)
- author: Phil Webb ve Spring Boot ekibi; Karsten Silz ve Spring paneli; Ralf Ueberfuhr
- date: 23 Ocak 2026, Nisan 2026, son güncellemesi iki hafta önce görülen migration guide
- category: migration, architecture, framework-evolution
- tags: spring-boot-4, spring-framework-7, jackson-3, api-versioning, retry, concurrency-limit, autoconfiguration, migration-guide
- summary: Boot 4; modüler auto-configuration, API versioning auto-config'i, HTTP Service Clients ve Framework 7 ile gelen yerleşik retry/concurrency throttling gibi alanlarda büyük değer sunuyor; fakat migration guide aynı anda `EnvironmentPostProcessor` paket değişimi ve `HttpMessageConverters` deprecation gibi altyapı kırılmalarını işaret ediyor.
- why_it_matters: Gerçek kırılma çoğu zaman uygulama kodunda değil, kurum içi starter, extension ve platform entegrasyonlarında çıkar.
- java_spring_relevance: İç platform, starter, shared library ve framework extension yöneten Java/Spring ekipleri için çok yüksek.
- actionability: planli_aksiyon
- impact_level: yüksek
- opportunities: Daha küçük jar'lar, daha az classpath kontrolü, standart retry/throttling ve yerleşik API versioning ile daha tutarlı platform davranışı.
- risks: Jackson 3 ve framework-internals değişimleri nedeniyle shared library kırılması; eski `spring.factories` ve boot internals kullanımının sessizce çürümesi.
- migration_notes: Önce Boot `3.5` tabanını stabilize etmek, sonra Boot `4.x` için ayrı bir compatibility lane açmak en pratik yol.

### Bulgu 5

- title: Spring Tools 5.1.0, Boot 4 ve Framework 7 geçişini IDE seviyesinde hızlandırıyor
- source: [Spring Tools 5.1.0 released](https://spring.io/blog/2026/03/11/spring-tools-5-1-0-released/)
- author: Martin Lippert
- date: 11 Mart 2026
- category: tooling, developer-productivity, ide
- tags: spring-tools, sts4, api-versioning, aot, sql-intelligence, jdk-25-cds, quick-fix
- summary: Spring Tools `5.1.0`; SQL intelligence, modern query conversion, AOT repository desteği, Framework 7 API versioning doğrulamaları, otomatik quick-fix'ler ve JDK 25 AOT Cache/CDS ile daha hızlı language server startup getiriyor.
- why_it_matters: Migration maliyeti yalnız kod değişikliği değildir; doğru tooling, property ve annotation kaynaklı sürtünmeyi ciddi biçimde düşürür.
- java_spring_relevance: VS Code, Cursor, Eclipse veya Theia üzerinde çalışan Spring ekipleri için yüksek.
- actionability: hizli_kazanc
- impact_level: orta-yüksek
- opportunities: Upgrade işini manuel diff ve wiki takibi yerine IDE destekli hale getirmek.
- risks: Eski araç zinciriyle property/annotation değişimlerini kaçırmak ve gereksiz insan emeği harcamak.
- migration_notes: Ekip standardı olarak Spring Tools `5.1.x` veya üstüne çıkmak, Boot 4 geçişinde iyi bir yan yatırım.

### Bulgu 6

- title: Spring Integration 7.1.0-RC1, Redis lock semantiğini ve entegrasyon DSL'ini iyileştiriyor
- source: [Spring Integration 7.1.0-RC1 Available](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/)
- author: Glenn Renfro
- date: 21 Nisan 2026
- category: integration, messaging, distributed-locking
- tags: spring-integration, redislockregistry, redis-8-4, cas, cad, jms, dsl
- summary: Redis `8.4+` için native `CAS/CAD` komutlarıyla lock renewal/release, Redis modülü için Java DSL ve `JmsChannelFactoryBean` özelleştirme desteği geldi; eski Redis sürümleri için Lua fallback sürüyor.
- why_it_matters: Dağıtık lock ve entegrasyon katmanı hataları çoğu zaman nadir ama pahalı üretim arızaları üretir.
- java_spring_relevance: Spring Integration, Redis tabanlı koordinasyon ve JMS altyapısı kullanan ekipler için yüksek.
- actionability: pilot_aksiyon
- impact_level: orta-yüksek
- opportunities: Daha temiz lock davranışı ve daha okunabilir integration DSL ile operabiliteyi artırmak.
- risks: RC sürümde kırılma veya migration guide'daki değişimleri gözden kaçırmak.
- migration_notes: Redis `8.4+` davranışı ile mevcut Lua fallback'i yan yana test etmek; önce pilotta doğrulamak mantıklı.

### Bulgu 7

- title: Spring Modulith 2.1 RC1 ve 2.0.6, modüler monolith güvenilirliğini hedefliyor
- source: [Spring Modulith 2.1 RC1, 2.0.6, and 1.4.11 released](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/)
- author: Oliver Drotbohm
- date: 24 Nisan 2026
- category: architecture, modulith, eventing
- tags: spring-modulith, module-slicing, jobrunr, transaction-handling, event-publication-registry
- summary: `2.1 RC1`; `@ModuleSlicing` davranışı, JobRunr transaction handling ve event publication registry üzerinde kullanıcı-görünür iyileştirmeler getiriyor; `2.0.6` ise daha güvenli stabil hat seçeneği sunuyor.
- why_it_matters: Modüler monolith kullanan ekiplerde gerçek değer, modül sınırı çizmekten çok event publication ve transaction semantiğini tutarlı kılmaktan gelir.
- java_spring_relevance: Spring Modulith veya benzer domain-modüllü Spring Boot mimarileri kullanan ekipler için orta-yüksek.
- actionability: izle_ve_pilotla
- impact_level: orta
- opportunities: Event yayın güvenilirliğini artırmak ve JobRunr tabanlı iş akışlarını daha sağlam hale getirmek.
- risks: RC'nin geniş portföyde erken kullanılması; modül sınırı araçlarını mimari disiplin yerine sihirli çözüm sanmak.
- migration_notes: Yenilikleri denemek isteyen ekipler `2.1 RC1`i pilotlayabilir; daha temkinli ekipler `2.0.6`da kalıp GA'yı beklemeli.

### Bulgu 8

- title: JDK 27, yıllardır taşınan bazı launcher option'larını artık hata ile reddedecek
- source: [Quality Outreach Heads-up - JDK 27: Removal of Deprecated Java Launcher Options](https://inside.java/2026/05/13/quality-heads-up/)
- author: Billy Korando
- date: 13 Mayıs 2026
- category: jdk, runtime-compatibility, operations
- tags: jdk-27, launcher-options, noverify, xverify-none, verifyremote, noclassgc, startup-failure
- summary: `-noclassgc`, `-verifyremote`, `-noverify` ve `-Xverify:none` JDK 27 ile artık yalnız warning üretmeyecek; tanınmayan option olarak proses başlangıcını fail ettirecek.
- why_it_matters: Bu tip sorunlar kod derlemesini değil deployment anını kırar; çoğu ekip bunu testte değil prod rollout sırasında fark eder.
- java_spring_relevance: Java process'lerini container, buildpack, shell script veya IDE config ile başlatan tüm Spring ekipleri için yüksek.
- actionability: hemen_aksiyon
- impact_level: orta-yüksek
- opportunities: Eski JVM startup alışkanlıklarını temizleyip runtime sözleşmesini sadeleştirmek.
- risks: Gizli env var zincirleri veya eski run config'ler nedeniyle servislerin ayağa kalkmaması.
- migration_notes: JDK 27 EA denemelerinde startup flag envanteri çıkarılmalı; gerekiyorsa `-Xverify:remote` ve `-Xnoclassgc` gibi halen geçerli alternatifler bilinçli şekilde kullanılmalı.

### Bulgu 9

- title: JDK 25 FFM API, JNI dışı native entegrasyonu ilk geniş LTS bağlamında daha ciddi hale getiriyor
- source: [Native Interoperability with JDK 25 and the FFM API](https://inside.java/2026/05/12/javaone-post-native-interop/)
- author: Per-Ake Minborg
- date: 12 Mayıs 2026
- category: jdk, native-interop, performance
- tags: jdk-25, ffm, jextract, jni, onnx-runtime, native-memory
- summary: Inside Java, FFM API'nin JDK 22'de finalize edildikten sonra performans kazandığını ve JDK 25'in bu API'yi geniş LTS kullanımı bağlamında daha gerçekçi hale getirdiğini vurguluyor; örnek olarak `jextract` ile ONNX Runtime binding üretimi gösteriliyor.
- why_it_matters: JNI/ByteBuffer köprüleri bakım maliyeti ve hata yüzeyi yüksek; FFM bunların bir kısmını daha doğal Java koduna çevirebilir.
- java_spring_relevance: Tipik CRUD servisleri için orta-düşük; yüksek performanslı native entegrasyon, inference sidecar veya özel kütüphane köprüleri kullanan ekipler için anlamlı.
- actionability: izle
- impact_level: düşük-orta
- opportunities: Native ML/runtime entegrasyonlarında Java tarafını sadeleştirmek ve JNI bağımlılığını azaltmak.
- risks: Erken benimsemede ek öğrenme eğrisi; yanlış beklentiyle genel web servislerine gereksiz karmaşıklık taşımak.
- migration_notes: Uygun kullanım alanı pilot sidecar'lar, yardımcı servisler veya performans-kritik native köprülerdir; genel backend portföyüne yaymadan önce ölçüm gerekir.

## Sonuç

14 Mayıs 2026 itibarıyla en güçlü sinyal yeni feature duyurusu değil; Spring ekosisteminde desteklenen hat, güvenlik yaması ve release-train yönetiminin artık aynı konuşmanın parçası haline gelmesi. Spring Boot `4.0.6`, Framework `7.0.7`, Spring Cloud support matrix ve Haziran başına kayan release-train birlikte okunduğunda, kıdemli Java/Spring ekipleri için en değerli iş; sürüm hizasını sıkılaştırmak, upgrade işini ayrı bir platform lane olarak yönetmek ve destek dışı kombinasyonları kapatmaktır.

JVM tarafında da benzer bir olgunlaşma var. JDK 27 launcher option temizliği ve JDK 25 FFM olgunlaşması, bir yandan eski alışkanlıkları kırarken öte yandan daha temiz native entegrasyon yolları açıyor. Kısa vadede odak; patch almak, Boot/Cloud hizasını standardize etmek ve JDK 27 startup uyumluluğunu erkenden test etmek olmalı.
