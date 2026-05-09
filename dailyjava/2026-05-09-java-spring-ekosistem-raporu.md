# Günlük Java / Spring Ekosistem Raporu

Tarih: 9 Mayıs 2026  
Tarama zamanı: 9 Mayıs 2026 09:00 TSİ  
Odak: Spring AI M6 dalgası, Oracle Java Nisan CPU hattı, JDK 26 bütünlük/sıkılaştırma değişiklikleri, Spring AI bellek mimarisi, Boot 4.1 öncesi release-train uyumluluğu

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring AI 1.0.7 / 1.1.6 / 2.0.0-M6 duyurusu](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/), [Spring AI Session API yazısı](https://spring.io/blog/2026/04/15/spring-ai-session-management), [Spring Data 2026.0.0-RC1 duyurusu](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud), [Spring Cloud Release referansı](https://docs.spring.io/spring-cloud-release/reference/index.html), [This Week in Spring - 5 Mayıs 2026](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026/), [Oracle Java Blog](https://blogs.oracle.com/java/the-arrival-of-java-26), [Oracle Java Nisan 2026 CPU duyurusu](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm), [JDK 21.0.11 release notes](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html), [JDK 25 consolidated release notes](https://www.oracle.com/java/technologies/javase/25all-relnotes.html), [JDK 26 consolidated release notes](https://www.oracle.com/java/technologies/javase/26all-relnotes.html), [JEP 500](https://openjdk.org/jeps/500), [JEP 527](https://openjdk.org/jeps/527), [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [Inside Java - Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/), [Inside Java - Quality Outreach Heads-up: JDK 27 Obsolete Translation Resources Removed](https://inside.java/2026/04/21/quality-heads-up/), [InfoQ Java sayfası](https://www.infoq.com/java/), [InfoQ - JobRunr Introduces ClawRunr](https://www.infoq.com/news/2026/05/clawrunr/), [Baeldung Java Weekly 644](https://www.baeldung.com/java-weekly-644), [IK.AM Nullability Maven Plugin yazısı](https://ik.am/entries/900/en), [Gunnar Morling - Hardwood Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/), [JobRunr ClawRunr duyurusu](https://www.jobrunr.io/en/blog/clawrunr/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Baeldung ve Burak KUTBAY tarafında bugün için doğrudan yeni release ya da kırıcı değişiklik sinyali yok; resmi Spring/Oracle/OpenJDK kaynakları belirleyici oldu.

## Öne Çıkan Başlıklar

- [Spring AI 1.0.7, 1.1.6 ve 2.0.0-M6](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/) yayımlandı. En kritik değişiklik, bellek kapsamının artık örtük değil açık hale gelmesi: `PromptChatMemoryAdvisor` kaldırılıyor veya kullanım dışına düşüyor; konuşma kimliği artık explicit verilmeli.
- Oracle’ın [21 Nisan 2026 CPU hattı](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm) hâlâ bugünün en somut operasyonel işi: `26.0.1`, `25.0.3`, `21.0.11`, `17.0.19`, `11.0.31`, `8u491` güvenlik ve bakım çizgisini tanımlıyor.
- [JEP 500](https://openjdk.org/jeps/500) ile gelen “final gerçekten final olsun” yönü artık soyut bir gelecek planı değil; [Inside Java](https://inside.java/2026/04/27/avoiding-final-field-mutation/) ekosistemi bugünden test etmeye çağırıyor. Reflective field mutation kullanan test, mock, serialization ve framework kodları görünür teknik borç haline geliyor.
- Spring AI tarafında [Session API](https://spring.io/blog/2026/04/15/spring-ai-session-management) ve M6 release birlikte okunduğunda, agent uygulamalarında mesaj geçmişi yerine “explicit memory scope + event-sourced session” yaklaşımı norm haline geliyor.
- Boot 4.1’e giden hatta [Spring Data 2026.0.0-RC1](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC) hâlâ RC seviyesinde; [Spring Cloud](https://spring.io/projects/spring-cloud) ise release-train eşleşmesini sıkı tutuyor. Yani Boot 4.1 laboratuvarı tek dependency değil, release-train egzersizi olarak ele alınmalı.

## Kritik Güncellemeler

### Spring AI M6 hattı artık gerçek migration maliyeti taşıyor

[Spring AI 1.0.7 / 1.1.6 / 2.0.0-M6 release notu](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/) bugünün en yeni ve en doğrudan Spring sinyali. Bu sürüm yalnız hata düzeltmesi değil:

- `PromptChatMemoryAdvisor` artık kaldırılıyor veya deprecated hale geliyor.
- Chat memory advisor kullanımında explicit `conversation ID` zorunlu hale geliyor.
- `OpenAiConnectionProperties`, `OpenAiCommonProperties` olarak yeniden adlandırılıyor.
- Bazı option sınıflarında setter yaklaşımı kaldırılıp builder/constructor yönü güçleniyor.
- SAP HANA DB ve Infinispan vector store entegrasyonları Spring AI projesinden çıkarılıyor.
- Release, `CVE-2026-41705`, `CVE-2026-41712` ve `CVE-2026-41713` güvenlik düzeltmelerini de içeriyor.

Bu, Spring AI kullanan ekipler için “demo API parlatması” değil; bellek modeli, provider entegrasyonu ve kod seviyesi API beklentisi değişiyor.

### Oracle Java CPU hattı kısa vadede feature adoption’dan daha önemli

[Oracle Java Nisan 2026 CPU duyurusu](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm) ve ilgili release note’lar üretim ekipleri için hâlâ birinci öncelik. Özellikle:

- [JDK 21.0.11](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html) güncel LTS patch çizgisini veriyor.
- [JDK 25.0.3](https://www.oracle.com/java/technologies/javase/25all-relnotes.html) yeni LTS hattının güncel bakım sürümü.
- [JDK 26.0.1](https://www.oracle.com/java/technologies/javase/26all-relnotes.html) feature release kullanan laboratuvarlar için ilk bakım noktası.
- [Oracle GraalVM for JDK 21.0.11](https://docs.oracle.com/en/graalvm/jdk/21/docs/release-notes/) native-image kullanan ekipler için CPU hizalaması sağlıyor.

Bugün için pratik gerçek şu: birçok ekip hâlâ 21 veya 17 üstünde Spring Boot servisleri çalıştırıyor. Bu ekiplerde “26’ya ne zaman geçelim?” sorusundan önce “LTS patch seviyemiz Nisan CPU ile hizalı mı?” sorusu sorulmalı.

### JDK 26 bütünlük sıkılaştırması artık CI sinyali üretmeli

[JEP 500](https://openjdk.org/jeps/500) ve [Inside Java rehberi](https://inside.java/2026/04/27/avoiding-final-field-mutation/) birlikte okunduğunda mesaj net:

- Derin reflection ile `final` alan mutasyonu artık görünmez kalmayacak.
- JDK 26 varsayılan olarak warning üretiyor.
- Gelecek sürümlerde bunun default exception rejimine evrilmesi hedefleniyor.
- Tanılama için `--illegal-final-field-mutation=debug`, ön hazırlık için `deny`, izleme için JFR `jdk.FinalFieldMutation` eventi öneriliyor.

Spring ekosisteminin çekirdeği büyük ölçüde constructor injection ve daha temiz modelleme yönüne geçmiş olsa da; test yardımcıları, mocking araçları, serializer’lar ve bazı legacy mapping katmanları bu değişimden etkilenebilir.

## Trendler ve Sinyaller

### 1. Spring AI’de örtük durum yönetimi bitiyor

[Session API yazısı](https://spring.io/blog/2026/04/15/spring-ai-session-management) ile [M6 release notları](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/) aynı yöne işaret ediyor:

- Konuşma durumu ayrı bir altyapı meselesi haline geliyor.
- Kısa dönem hafıza için event-sourced session yaklaşımı öne çıkıyor.
- Uzun dönem hafıza için explicit memory tooling öneriliyor.
- Multi-agent branch isolation ve turn-safe compaction gibi konular artık “ileri seviye” değil, beklenen davranış olarak ele alınıyor.

Bu, Spring AI’nin hızlı prototip kütüphanesinden daha üretim odaklı bir uygulama çatısına doğru ilerlediğini gösteriyor.

### 2. JVM tarafında “integrity by default” çizgisi sertleşiyor

[JEP 500](https://openjdk.org/jeps/500), [Inside Java final field mutation yazısı](https://inside.java/2026/04/27/avoiding-final-field-mutation/) ve [Baeldung Java Weekly 644](https://www.baeldung.com/java-weekly-644) aynı deseni yansıtıyor: platform, yıllardır tolere edilen ama semantik olarak zayıf alanları daraltıyor.

Bu çizgi yalnız reflection ile sınırlı değil. [JDK 27 heads-up yazıları](https://inside.java/2026/04/21/quality-heads-up/) locale resource davranışı gibi daha küçük görünen ama testleri etkileyebilecek uyumluluk değişikliklerini de erkenden duyuruyor.

### 3. Release-train disiplini yeniden önem kazanıyor

[Spring Data 2026.0.0-RC1](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC), [Spring Cloud proje sayfası](https://spring.io/projects/spring-cloud) ve [Spring Cloud release referansı](https://docs.spring.io/spring-cloud-release/reference/index.html) birlikte şunu söylüyor:

- Boot 4.1 denemek tek başına yeterli değil.
- Data, Cloud, native-image, AI starter ve üçüncü parti starter’lar birlikte değerlendirilmeli.
- Cloud tarafında `2025.1.x` hattı Boot `4.0.x`, `2025.0.x` hattı ise Boot `3.5.x` ile hizalı.
- EOL olan eski Cloud trenlerinde kalmak yalnız features değil, destek ve güvenlik açısından da risk.

### 4. JVM üstünde uzun yaşayan ajan çalışma zamanları görünür hale geliyor

[InfoQ’nun ClawRunr haberi](https://www.infoq.com/news/2026/05/clawrunr/), [JobRunr’ın resmi duyurusu](https://www.jobrunr.io/en/blog/clawrunr/) ve [Josh Long’un Ronald Dehuysser sohbeti](https://spring.io/blog/2026/04/30/a-bootiful-podcast-ronald-dehuysser) birlikte yeni bir yan trend gösteriyor:

- Ajan akışları artık yalnız prompt zinciri değil, schedule/retry/persistence/monitoring problemi olarak ele alınıyor.
- Spring Boot, Spring AI, Spring Modulith ve JobRunr kombinasyonu bu alan için referans mimari olmaya aday.

Bu henüz çekirdek kurumsal standart değil; fakat durable execution ile agent runtime kesişimi JVM tarafında artık izlemeye değer.

## Araçlar ve Kütüphaneler

- [Spring AI 2.0.0-M6](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/): Yüksek öncelik. Spring AI kullanan ekiplerde derhal envanter çıkarılmalı.
- [Oracle GraalVM for JDK 21.0.11](https://docs.oracle.com/en/graalvm/jdk/21/docs/release-notes/): Orta-yüksek öncelik. Native-image/AOT kullanan Spring servislerinde CPU hizalaması için önemli.
- [Nullability Maven Plugin](https://ik.am/entries/900/en): Orta öncelik. Spring Framework 7 ve JSpecify benimseyen Maven tabanlı ekiplerde build-time nullability enforcement’i sadeleştirebilir.
- [ClawRunr](https://www.jobrunr.io/en/blog/clawrunr/): Düşük-orta öncelik. Üretim standardı değil; ancak JVM üzerinde kalıcı ajan/scheduler tasarımı için izlenmeye değer.
- [Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/variant-support-interactive-parquet-file-tui-hardwood-1.0.0.beta2-is-out/): Düşük öncelik. Veri gölü, S3 ve Parquet yoğun Java servisleri için ilginç; tipik Spring CRUD servisleri için öncelik değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI kullanan ekipler `PromptChatMemoryAdvisor`, implicit conversation scope ve proje içi özel memory wrapper’larını hemen envanterlemeli.
- Java 21/17/11 LTS kullanan Spring Boot filolarında önce CPU hizası kapatılmalı; feature-release denemeleri ikinci sıraya konmalı.
- JDK 26’yı hedefleyen ekipler, özellikle test ve serialization katmanında final-field mutation taraması için ayrı bir CI lane açmalı.
- Boot 4.1 laboratuvarı, Data/Cloud/native-image uyumluluğunu birlikte test eden release-train seviyesinde bir çalışma olarak kurgulanmalı.
- JSpecify ve nullability disiplini, Spring 7 çağında opsiyonel kalite iyileştirmesi değil; zamanla takım standartı haline gelebilir.

## Fırsatlar ve Riskler

- Fırsat: Spring AI tarafında explicit memory scope, çok ajanlı veya uzun oturumlu iş akışlarında daha öngörülebilir davranış sağlayabilir.
- Fırsat: JDK 26 final-field uyarıları, gelecekte daha pahalı olacak reflection borcunu bugünden görünür kılma şansı veriyor.
- Fırsat: CPU hizalı JDK ve GraalVM sürümleri, özellikle native-image kullanan Spring servislerinde daha temiz destek matrisi sağlar.
- Risk: Spring AI 2.0.0-M6’daki vector store çıkarımları ve property rename’leri sessiz compile/runtime kırıkları üretebilir.
- Risk: `conversation ID` zorunluluğunu ciddiye almayan ekiplerde cross-session memory bleed veya yanlış kullanıcı bağlamı oluşabilir.
- Risk: Cloud/Data/Boot train’lerini karıştırarak yükseltme yapmak, tekil dependency upgrade’lerinden daha zor teşhis edilen starter ve auto-config uyumsuzlukları doğurabilir.
- Risk: JDK güvenlik güncellemelerindeki sertifika güvensizleştirme kararları, nadir de olsa kurumsal uç nokta veya özel CA zincirlerinde beklenmedik bağlantı sorunları yaratabilir.

## İzlenmesi Gereken Konular

- [Spring Data 2026.0 GA](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC) Mayıs içinde yayımlandığında Boot 4.1 geçiş maliyeti daha netleşecek.
- [JDK 27](https://openjdk.org/projects/jdk/27/) tarafında şu anda görünür en güçlü resmi sinyal [JEP 527](https://openjdk.org/jeps/527); ek hedefli JEP’ler ve uyumluluk başlıkları izlenmeli.
- Spring AI 2.0 hattında memory/session API’lerinin RC seviyesinde ne kadar stabilize olacağı önemli olacak.
- Native-image kullanan ekipler için GraalVM CPU ritmi ile Spring Boot 4.1 hattının ne kadar senkron ilerleyeceği izlenmeli.
- Spring Cloud release-train eşleşmelerinde Boot 4.1 sonrası yeni resmi hizalama geldiğinde upgrade planları güncellenmeli.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring AI M6 hattı explicit memory scope ve gerçek migration gereksinimi getiriyor
- source: [Spring AI 1.0.7, 1.1.6, 2.0.0-M6 Available Now](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/)
- author: Ilayaperumal Gopinathan
- date: 8 Mayıs 2026
- category: ai, release, migration, security
- tags: spring-ai, promptchatmemoryadvisor, conversation-id, vector-store, openai-sdk, breaking-change
- summary: Spring AI’nin üç sürüm hattı birden güncellendi; güvenlik düzeltmeleriyle birlikte explicit conversation ID zorunluluğu, provider/property değişiklikleri ve bazı vector store entegrasyonlarının çıkarılması geldi.
- why_it_matters: Bu sürüm yalnız incremental iyileştirme değil; state management ve API sözleşmesi değişikliği taşıyor.
- java_spring_relevance: Spring AI tabanlı Java servisleri için çok yüksek, diğer Spring ekipleri için orta-düşük.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Daha güvenli memory scoping, daha temiz provider standardizasyonu, daha öngörülebilir agent davranışı.
- risks: Compile kırıkları, config drift, memory bleed, çıkarılan modüllere sessiz bağımlılık.
- migration_notes: `PromptChatMemoryAdvisor` kullanımları kaldırılmalı; explicit `conversation ID` akışı eklenmeli; `OpenAiConnectionProperties` yeniden adlandırması ve vector store envanteri doğrulanmalı.

### Bulgu 2

- title: Nisan 2026 Oracle Java CPU hattı üretim Spring filoları için hâlâ birinci öncelik
- source: [Oracle Critical Patch Update April 2026 for Oracle Java SE](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm), [JDK 21.0.11 Release Notes](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html), [JDK 25 Consolidated Release Notes](https://www.oracle.com/java/technologies/javase/25all-relnotes.html), [Oracle GraalVM for JDK 21.0.11 Release Notes](https://docs.oracle.com/en/graalvm/jdk/21/docs/release-notes/)
- author: Oracle Java Management / Oracle Java Team
- date: 21 Nisan 2026
- category: jdk, security, runtime, operations, native
- tags: jdk-21, jdk-25, jdk-26, cpu, graalvm, tls, tzdata
- summary: Oracle tarafı `26.0.1`, `25.0.3`, `21.0.11`, `17.0.19`, `11.0.31`, `8u491` patch dalgasını yayımladı; GraalVM de 21.0.11 CPU ile hizalandı.
- why_it_matters: Kurumsal Spring servislerinde güvenlik, sertifika zinciri, timezone ve vendor support açısından patch hizası feature adoption’dan önce gelir.
- java_spring_relevance: JVM üzerinde çalışan tüm Spring servisleri için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Tekil vendor/JDK standardizasyonu, native-image hatlarında daha temiz destek matrisi, merkezi runtime lifecycle yönetimi.
- risks: Geri kalmış runtime sürümleri, sertifika güven zinciri değişiklikleri, native-image ile taban JDK arasında sürüm ayrışması.
- migration_notes: En az LTS hatlarında `21.0.11`, `17.0.19`, `11.0.31` ve vendor eşleniği sürümlere çıkılmalı; GraalVM tabanlı servisler CPU ile birlikte güncellenmeli.

### Bulgu 3

- title: JDK 26 final-field mutation uyarıları reflection tabanlı gizli borcu açığa çıkarıyor
- source: [JEP 500](https://openjdk.org/jeps/500), [Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/), [Baeldung Java Weekly 644](https://www.baeldung.com/java-weekly-644)
- author: Ron Pressler, Alex Buckley, Nicolai Parlog
- date: 27 Nisan 2026
- category: jdk, compatibility, reflection, testing
- tags: jdk-26, final-field-mutation, reflection, serialization, jfr, integrity-by-default
- summary: JDK 26, derin reflection ile `final` alan mutasyonunu warning seviyesinde görünür hale getiriyor; gelecek sürümlerde bu davranışın varsayılan olarak exception’a dönüşmesi planlanıyor.
- why_it_matters: Bugün sessiz çalışan test, mock, serializer veya yardımcı kütüphane kodu yarın varsayılan olarak kırılabilir.
- java_spring_relevance: Özellikle Spring test altyapısı, serialization, mapper ve legacy utility katmanları için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Constructor injection ve immutable modellemeyi güçlendirmek, reflection borcunu ölçmek, gelecekteki JDK geçişlerini ucuzlatmak.
- risks: Test kırıkları, üçüncü parti kütüphane sürprizleri, JDK 26/27 laboratuvarlarında beklenmedik warning gürültüsü.
- migration_notes: CI’da `--illegal-final-field-mutation=debug` ve seçili hatlarda `deny` denenmeli; JFR `jdk.FinalFieldMutation` eventi ile kaynaklar tespit edilmeli.

### Bulgu 4

- title: Spring AI bellek mimarisi event-sourced session ve explicit scope yönünde kurumsallaşıyor
- source: [Spring AI Session API](https://spring.io/blog/2026/04/15/spring-ai-session-management), [Spring AI 1.0.7, 1.1.6, 2.0.0-M6 Available Now](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now/)
- author: Christian Tzolov, Ilayaperumal Gopinathan
- date: 15 Nisan 2026 / 8 Mayıs 2026
- category: architecture, ai, state-management
- tags: session-api, automemorytools, event-sourcing, multi-agent, conversation-scope
- summary: Spring AI, kısa dönem hafızayı event-sourced session ile; uzun dönem hafızayı ayrı memory tooling ile; aktif konuşma kapsamını da explicit ID ile yönetme yönüne gidiyor.
- why_it_matters: Üretim ajanlarında en pahalı sorunlar çoğu zaman model kalitesinden değil, yanlış state/memory izolasyonundan gelir.
- java_spring_relevance: Spring AI ile chat, copilot, agent ya da assistant geliştiren ekipler için yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Çok ajanlı akışlar, daha güvenli kullanıcı bağlamı, daha iyi context compaction ve audit edilebilir konuşma geçmişi.
- risks: Yanlış memory partitioning, session büyümesi, tool-call dizilerinin yanlış kırpılması, implicit state varsayımlarının taşınması.
- migration_notes: Session sınırları uygulama seviyesinde tanımlanmalı; `conversation ID` request zincirinin birinci sınıf verisi haline getirilmeli; memory index ve uzun-kısa dönem ayrımı netleştirilmeli.

### Bulgu 5

- title: Boot 4.1 öncesi release-train uyumluluğu hâlâ tam kapanmış değil
- source: [Spring Data 2026.0.0-RC1 enters release candidate phase](https://spring.io/blog/2026/04/17/spring-data-2026-0-0-goes-RC), [Spring Cloud Project Page](https://spring.io/projects/spring-cloud), [Spring Cloud Release Reference](https://docs.spring.io/spring-cloud-release/reference/index.html)
- author: Mark Paluch, Spring Team
- date: 17 Nisan 2026 ve güncel proje sayfaları
- category: platform, compatibility, data, cloud
- tags: spring-boot-4.1, spring-data, spring-cloud, release-train, compatibility
- summary: Spring Data `2026.0.0` hâlâ RC seviyesinde; Spring Cloud tarafı ise Boot nesline göre sıkı release-train eşleşmesi uyguluyor ve eski trenleri EOL olarak işaretliyor.
- why_it_matters: Boot 4.1 denemeleri, uygulama kodundan çok release-train uyumluluğu yüzünden başarısız olabilir.
- java_spring_relevance: Spring Boot + Spring Data + Spring Cloud kombinasyonu kullanan kurumsal mikroservis ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Daha disiplinli platform matrisi, desteklenen sürümlere konsolidasyon, upgrade testlerinin otomasyonu.
- risks: Uyumsuz starter zinciri, RC üstüne fazla erken çıkış, Cloud/Data trenlerinin yanlış karıştırılması.
- migration_notes: Boot 4.1 laboratuvarı kurulurken Spring Data GA beklenmeli veya RC riski açıkça kabul edilmeli; Cloud BOM sürümü Boot nesliyle birebir hizalanmalı.

## Sonuç

9 Mayıs 2026 itibarıyla en yüksek değerli yeni sinyal, Spring AI’nin artık yalnız yeni model/provider ekleyen bir proje gibi davranmaması; memory scope, session modeli ve kırıcı migration yüzeyi oluşturan daha ciddi bir platform katmanına dönüşmesi. Buna paralel olarak Java tarafında asıl kısa vadeli iş hâlâ runtime patch disiplini ve JDK 26’nın bütünlük sıkılaştırmalarına erkenden hazırlanmak.

Pratik öncelik sırası net: önce JDK patch ve vendor hizası, sonra Spring AI memory/API envanteri, ardından Boot 4.1 için release-train bazlı laboratuvar. İzlemeye değer yan trend ise JVM üzerinde kalıcı ajan runtime’ları ve build-time nullability disiplininin daha görünür hale gelmesi.
