# Günlük Java / Spring Ekosistem Raporu

Tarih: 4 Ağustos 2026 Salı  
Tarama zamanı: 4 Ağustos 2026 09:06 TSİ  
Odak: platform yaşam döngüsü kontratları; JDK patch ritmi; Spring destek çizgileri; regüle runtime çıkışları

Tarama notu: 4 Ağustos 2026 Salı 09:06 TSİ itibarıyla [Spring Blog](https://spring.io/blog), [Spring proje sayfaları](https://spring.io/projects), [Spring release duyuruları](https://spring.io/blog/category/releases), ilgili GitHub release sayfaları, [Spring Framework Versions wiki](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Versions), [Spring Boot Supported Versions wiki](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java/Spring haberleri](https://www.infoq.com/java/news/), [Baeldung](https://www.baeldung.com/), Josh Long’un güncel gönderileri, Gunnar Morling’in son yazıları ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandı. 4 Ağustos 2026 itibarıyla Spring tarafında 30 Temmuz 2026 sonrası yeni büyük GA dalgası görünmüyor; güncel production çizgisi hâlâ Spring Boot `4.1.0` / `4.0.7` / `3.5.16`, Spring Framework `7.0.8` / `6.2.19` ve Spring Cloud `2025.1.2`. Bugünün güçlü sinyali yeni feature değil: 18 Ağustos 2026 hedefli ilk ek Java CSPU, 3 Ağustos 2026 tarihli Oracle Jipher `10.37`, Spring Framework 7’nin JDK 25+ üretim önerisi ve Spring Boot minor destek pencerelerinin zaman kutulu olması.

## Öne Çıkan Başlıklar

- Java güvenlik güncellemesi üç aylık CPU ritminden çıkıyor; Oracle, 18 Ağustos 2026 için ek Java CSPU planlıyor.
- Oracle Jipher `10.37`, FIPS davranışını sıkılaştırırken GraalVM for JDK 17/21 desteğinin son planlı güncellemesi olduğunu net söylüyor.
- Spring Framework 7.x destek dokümanı, üretimde JDK 25 veya üzerini öneriyor; Spring Framework 6.2.x OSS desteği Haziran 2026’da bitti.
- Spring Boot’un resmi destek politikası, minor sürümleri “uygun olunca geçeriz” kategorisinden çıkarıyor; en az 12 aylık destek penceresi, ertelemeyi daha pahalı hale getiriyor.
- Bugün yeni kritik Spring GA release yok; karar alanı feature avcılığı değil patch, support ve release governance.

## Kritik Güncellemeler

### 1. Java security update ritmi 18 Ağustos 2026 ile sıklaşıyor

Oracle’ın 20 Temmuz 2026 tarihli duyurusuna göre Java güvenlik güncellemeleri, yalnız Ocak/Nisan/Temmuz/Ekim CPU döngüsüne bağlı kalmayacak. Oracle, 18 Ağustos 2026 için ek bir Java CSPU hedeflediğini ve 2027 içinde birden fazla aylık güvenlik güncellemesi planladığını açıkça yazıyor.

Bu değişiklik sadece Oracle takvimi haberi değil. JDK veya JRE’yi uygulama ile birlikte paketleyen ekipler artık patch uptake sürecini çeyreklik operasyon gibi değil, aylık tekrarlayan teslimat hattı gibi ele almak zorunda. Build, test, release ve deploy zinciri bu ritme dayanıklı değilse güvenlik açığı değil süreç darboğazı oluşacak.

### 2. Oracle Jipher 10.37, FIPS ekipleri için “dar ama gerçek” migration backlog’u açıyor

3 Ağustos 2026 tarihli Oracle Jipher `10.37` duyurusu iki şeyi aynı anda yapıyor: OpenSSL FIPS modülünü `3.5.7` seviyesine çekerek `CVE-2026-42770` için düzeltme getiriyor ve Jipher `10.36` ile başlayan FIPS 140-3 davranış kısıtlarını koruyor. DSA key/signature generation kaldırılmış durumda; TLS 1.2 için Extended Master Secret zorunlu; Triple DES encryption kapalı; RSA/ECB/NoPadding ve RSA/ECB/PKCS1Padding kaldırılmış; PBKDF2 limitleri sertleşmiş durumda.

Daha önemlisi, Oracle bu sürümün GraalVM for JDK 17 ve 21 destekleyen son planlı güncelleme olduğunu söylüyor. FIPS gerektiren native-image veya GraalVM tabanlı Java/Spring kurulumlarında “sonra bakarız” denecek bir detay değil; ayrı runtime standardı kararı gerektiriyor.

### 3. Spring Framework 7, pratikte JDK 25+ üretim tabanını öne çekiyor

Spring Framework Versions wiki, 7.x için JDK aralığını `17-25+` olarak veriyor ama öneri cümlesi daha önemli: üretimde Spring Framework 7.x için JDK 25 veya üzeri tavsiye ediliyor. Aynı doküman 6.2.x OSS desteğinin Haziran 2026’da bittiğini ve 7.0.x’in mevcut production line olduğunu belirtiyor.

Bu, “JDK 17 ile de çalışıyor” rahatlığının yerini “hangi JDK’yı gerçekten standardize edeceğiz?” sorusuna bırakıyor. Spring 7/Boot 4 yol haritası olan ekipler için JDK 25 testleri artık isteğe bağlı keşif değil migration rehearsal haline gelmeli.

### 4. Spring Boot destek politikası, minor upgrade’leri takvim disiplini haline getiriyor

Spring Boot wiki’ye göre major sürümler en az 3 yıl, minor sürümler en az 12 ay destek alıyor; patch release’ler ihtiyaç oldukça geliyor. Aynı anda güncel release çizgisine bakıldığında 4 Ağustos 2026 itibarıyla `4.1.0`, `4.0.7` ve `3.5.16` aktif çizgi olarak öne çıkıyor.

Bu bilgi tek başına yeni değil; ama bugün onu yeni yapan şey Oracle’ın patch ritmini sıklaştırması ve Spring Framework 7’nin JDK 25+ yönünü resmileştirmesi. Boot minor upgrade’ini sürekli erteleyen ekipler, hem Spring destek penceresi hem de üçüncü taraf bağımlılık EOL’leri yüzünden kısa sürede iki taraftan baskı görecek.

## Trendler ve Sinyaller

### Trend Kümesi 1: Runtime sahipliği uygulama ekibinden platform ekibine kayıyor

Tekrarlayan sinyal:

- Oracle daha sık güvenlik güncellemesi planlıyor.
- Spring Framework 7 üretim için JDK 25+ öneriyor.
- Regüle/FIPS kurulumları için Jipher ayrı bir runtime politikası gerektiriyor.

Bu, uygulama ekibinin yalnız `pom.xml` güncellemesiyle çözeceği konu değil. JDK paketleme, patch yayılımı, smoke test, rollout ve rollback akışı platform seviyesi iş haline geliyor.

### Trend Kümesi 2: Support policy artık mimari kararı etkiliyor

Tekrarlayan sinyal:

- Spring Framework 6.2.x OSS desteği kapandı.
- Spring Boot minor sürümleri zaman kutulu.
- Boot 4.1 ve Framework 7 çizgisi daha yeni JDK tabanına yaslanıyor.

Destek çizgisi yalnız procurement veya compliance başlığı değil; kütüphane seçimi, JVM standardı ve migration sırası üzerinde doğrudan etkili.

### Trend Kümesi 3: Regüle runtime yolu, genel Java yolundan ayrışıyor

Tekrarlayan sinyal:

- Jipher tarafında algoritma ve kullanım kısıtları sertleşiyor.
- GraalVM destek çıkışı, FIPS isteyen ekipleri ayrı karar noktasına getiriyor.
- TLS/mTLS ve password-based crypto mirası olan entegrasyonlar sessiz kırılma riski taşıyor.

Bu hat herkes için yüksek öncelik değil; fakat bankacılık, kamu, savunma veya sert compliance ortamlarında merkezi backlog maddesi olmalı.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: JDK patch sürecini aylık cadence’e hazır hale getirmek.
- Kalıcı değer: Spring 7/Boot 4 için JDK 25 standardını erkenden test etmek.
- Kalıcı değer: FIPS/GraalVM kullanan iş yükleri için runtime standardını açıkça yazmak.
- Düşük öncelik: Yeni genel amaçlı framework dalgası beklemek; bugün güçlü sinyal feature değil lifecycle.

## Araçlar ve Kütüphaneler

Bugün yeni yüksek öncelikli genel amaçlı Spring kütüphanesi sinyali yok. Dikkat çekici ama kapsamı dar başlıklar:

- `Oracle Jipher 10.37`: Sadece FIPS-regulated kurulumlar için kritik; genel Spring backlog’u için değil.
- [Baeldung - A Guide to Ahead-of-Time Cache in the Java](https://www.baeldung.com/java-ahead-of-time-cache): JDK 26 AOT cache’i denemek isteyen ekipler için pratik başlangıç; değerli ama feature değil operasyon tekniği.
- Gunnar Morling’in Parquet/Hardwood hattı: veri-yoğun yan servisler için ilginç, klasik Spring backend backlog’u için bugün düşük öncelik.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Framework 7 veya Spring Boot 4 planınız varsa, JDK 25 testlerini ayrı bir spike değil resmi migration rehearsal olarak ele alın.
- Uygulama ile birlikte JDK/JRE paketliyorsanız, 18 Ağustos 2026 Java CSPU’su için aylık smoke-test yolu tanımlayın.
- FIPS veya GraalVM kullanan servislerde, Jipher `10.37` sonrası destek matrisi ve kabul edilen algoritmalar yeniden doğrulanmalı.
- Spring Boot minor upgrade’lerini uzun süre bekletmek, sadece Spring desteği değil Kafka/Jackson/SSL/TLS gibi üçüncü taraf çizgilerde de birikmiş risk yaratır.
- Bugün yeni feature baskısı düşük olduğu için, mevcut backlog’u “hangi yeni özelliği alalım?” yerine “hangi destek/paketleme kararını resmileştirelim?” diye yeniden sıralamak daha verimli.

## Fırsatlar ve Riskler

- Fırsat: JDK patch zincirini aylık ritme uygun hale getirip güvenlik uptake süresini kurumsal avantaj haline getirmek
- Risk: Quarterly CPU alışkanlığını sürdürüp Ağustos 2026 CSPU sonrasında patch birikimi oluşturmak
- Fırsat: Spring 7/Boot 4 geçişini JDK 25 standardizasyonu ile birlikte planlayıp tek seferde daha temiz platform tabanı kurmak
- Risk: Spring upgrade ve JDK upgrade backlog’larını ayrı ekiplerde tutup uyumsuzluk üretmek
- Fırsat: FIPS iş yükleri için Oracle JDK standardına net geçiş kararı almak
- Risk: GraalVM/FIPS kombinasyonunda destek sonu baskısını geç fark etmek
- Fırsat: Bugünkü sakin release gününü kullanıp support matrix, dependency EOL ve runtime policy envanteri çıkarmak
- Risk: Yeni büyük release gelmedi diye lifecycle baskısını düşük öncelik sanmak

## İzlenmesi Gereken Konular

- 18 Ağustos 2026 Java CSPU gerçekten yayınlandığında hangi JDK hatlarını ve hangi güvenlik/stabilite düzeltmelerini taşıdığı
- Oracle’ın Ekim 2026 CPU öncesinde aylık Java güvenlik ritmine dair ek detay verip vermeyeceği
- Spring Framework 7 ve Spring Boot 4 belgelerinde JDK 25/26/27 önerilerinin ne kadar somutlaştığı
- Kasım 2026’daki bir sonraki Spring major/minor penceresine kadar Boot 4.1 adoption geri bildirimlerinin ne yönde geldiği
- FIPS zorunlu iş yüklerinde Jipher sonrası GraalVM’den Oracle JDK’ya geçiş örneklerinin ortaya çıkıp çıkmadığı
- Düşük öncelik: AOT cache gibi runtime optimizasyonlarının daha geniş Spring rehberlerine girip girmediği

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Java güvenlik güncellemeleri, üç aylık CPU çizgisinden daha sık bir cadence’e geçiyor
- `source`: [Transitioning Java to more frequent security updates](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) | [Inside Java özeti](https://inside.java/2026/07/31/transitioning-java-to-more-frequent-security-updates/)
- `author`: Donald Smith | Oracle Java Platform Group
- `date`: 20 Temmuz 2026 | 31 Temmuz 2026
- `category`: security-updates, release-engineering, platform-operations
- `tags`: oracle-jdk, cpu, cspu, monthly-updates, patch-cadence, bundled-jre
- `summary`: Oracle, mevcut üç aylık CPU düzenine ek olarak 18 Ağustos 2026 için bir Java CSPU planlıyor ve 2027 içinde birden fazla aylık update hedeflediğini söylüyor.
- `why_it_matters`: Güvenlik güncellemesi artık çeyreklik rutin değil, daha sık tekrarlanan teslimat pratiğine dönüşüyor.
- `java_spring_relevance`: JDK/JRE paketleyen Spring Boot ekipleri için build, smoke test, deploy ve rollback hattını doğrudan etkiler.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: patch uptake süresini azaltmak; güvenlik baseline’ını daha sık korumak; runtime operasyonunu standartlaştırmak
- `risks`: quarterly alışkanlıkla ilerlemek; test borcu yüzünden patch geciktirmek; bundled runtime sahipliğini belirsiz bırakmak
- `migration_notes`: Ağustos 18, 2026 CSPU için ayrı smoke path tanımlayın; JDK bump’ını uygulama dependency bump’larından bağımsız izleyin; patch rollout ve rollback sürelerini ölçün.

### Bulgu 2

- `title`: Oracle Jipher 10.37, FIPS davranışını sıkılaştırıyor ve GraalVM yolunu daraltıyor
- `source`: [Announcing Oracle Jipher 10.37: FIPS 140-3 Cryptography for Java](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java)
- `author`: Poonam Parhar
- `date`: 3 Ağustos 2026
- `category`: security, cryptography, compliance, runtime-policy
- `tags`: jipher, fips-140-3, openssl, graalvm, tls-1.2, pbkdf2, rsa-pss
- `summary`: Oracle Jipher `10.37`, OpenSSL FIPS modülünü `3.5.7` seviyesine çekiyor, `CVE-2026-42770` düzeltmesini içeriyor, FIPS 140-3 kısıtlarını sürdürüyor ve GraalVM for JDK 17/21 desteğinin son planlı update’i olduğunu söylüyor.
- `why_it_matters`: Regüle Java iş yüklerinde provider değişikliği uygulama davranışını framework patch’leri kadar sert etkileyebilir.
- `java_spring_relevance`: Spring Security, mTLS, legacy TLS 1.2 partnerleri ve FIPS zorunluluğu olan Java backend ekipleri için doğrudan üretim riski taşır.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: runtime standardını sadeleştirmek; FIPS kabul kriterlerini netleştirmek; legacy crypto kullanımını erken temizlemek
- `risks`: DSA, Triple DES, RSA padding ve PBKDF2 sınırlarının sessiz kırılma yaratması; GraalVM/FIPS desteği için geç kalınması
- `migration_notes`: Kabul edilen algoritmaları envantere çıkarın; TLS 1.2 Extended Master Secret ve PBKDF2 parametrelerini doğrulayın; FIPS gerektiren GraalVM iş yükleri için Oracle JDK geçiş planını ayrı backlog maddesi yapın.

### Bulgu 3

- `title`: Spring Framework 7, üretimde JDK 25+ standardını fiilen öne çekiyor
- `source`: [Spring Framework Versions wiki](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Versions) | [Spring Framework 7.0.8 release](https://github.com/spring-projects/spring-framework/releases/tag/v7.0.8)
- `author`: Spring Framework team
- `date`: 5 Şubat 2026 | 8 Haziran 2026
- `category`: framework-baseline, migration, runtime-governance
- `tags`: spring-framework-7, jdk-25, ee-11, support-policy, migration-baseline
- `summary`: Resmi Spring Framework sürüm dokümanı, 7.x için JDK aralığını `17-25+` olarak veriyor ve üretim için JDK 25 veya üzerini öneriyor; 6.2.x OSS desteği ise Haziran 2026’da sona ermiş durumda.
- `why_it_matters`: “Destekleniyor” ile “önerilen üretim tabanı” artık aynı şey değil; ekipler gerçek runtime standardını seçmek zorunda.
- `java_spring_relevance`: Spring 7 veya Boot 4 planlayan Java ekipleri için JDK seçimi, uyumluluk ve test sırası doğrudan etkilenir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: Spring 7 migration’ını daha yeni JDK standardı ile aynı fazda çözmek; Jakarta EE 11 tabanını netleştirmek
- `risks`: Spring upgrade ile JDK upgrade’i ayrı backlog’lara bölmek; JDK 17 üzerinde “şimdilik çalışıyor” rahatlığıyla gecikmek
- `migration_notes`: Spring 7 hedefleyen servisleri listeleyin; JDK 25 CI lane’i açın; framework bump, JVM bump ve container/base-image değişimini aynı rehearsal içinde ölçün.

### Bulgu 4

- `title`: Spring Boot minor sürümleri artık gevşek backlog değil, zaman kutulu destek penceresi
- `source`: [Spring Boot Supported Versions wiki](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions) | [Spring Boot releases](https://github.com/spring-projects/spring-boot/releases) | [Spring Boot 4.1 Adds gRPC Auto-Configuration, SSRF Mitigation, and Kotlin 2.3 Support](https://www.infoq.com/news/2026/06/spring-boot-4-1/)
- `author`: Andy Wilkinson | Spring Boot team | Karsten Silz
- `date`: 7 Aralık 2023 | 10-25 Haziran 2026
- `category`: support-policy, release-management, platform-planning
- `tags`: spring-boot, support-window, minor-releases, dependency-eol, upgrade-governance
- `summary`: Spring Boot destek politikası minor release’ler için en az 12 aylık pencere tanımlıyor; 4 Ağustos 2026 itibarıyla aktif çizgiler `4.1.0`, `4.0.7` ve `3.5.16`. InfoQ analizi, Boot 4.1 takviminin Mayıs’tan Haziran’a iki kez kaydığını hatırlatıyor.
- `why_it_matters`: Ekipler minor upgrade’i süresiz erteleyemez; üstelik upstream takvimler düzenli olsa da deterministik değildir.
- `java_spring_relevance`: Enterprise Spring Boot platformlarında upgrade sprintleri, procurement ve third-party EOL kararları için doğrudan önemlidir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: upgrade takvimini şeffaflaştırmak; dependency EOL riskini düşürmek; release windows için buffer tasarlamak
- `risks`: upstream release tarihlerini mutlak kabul etmek; support window ve dependency support mismatch üretmek; 3.5/4.0/4.1 hatlarını uzun süre paralel taşımak
- `migration_notes`: Aktif Boot minor’larını ve bitiş tarihlerini envantere alın; her minor için “adopt / hold / exit” kararı yazın; JDK patch cadence ile Boot upgrade takvimini aynı platform takvimine bağlayın.

### Bulgu 5

- `title`: Bugünün en güçlü sinyali yeni feature değil, adoption polish ve lifecycle governance
- `source`: [Spring Blog atom feed](https://spring.io/blog.atom) | [A Bootiful Podcast: Spring Boot founder and lead Phil Webb](https://spring.io/blog/2026/07/30/a-bootiful-podcast-phil-webb/) | [This Week in Spring - July 28th, 2026](https://spring.io/blog/2026/07/28/this-week-in-spring-july-28-2026/)
- `author`: Josh Long | Phil Webb
- `date`: 28 Temmuz 2026 | 30 Temmuz 2026
- `category`: maintainer-signal, adoption, ecosystem-governance
- `tags`: spring-blog, josh-long, phil-webb, boot-4.1, adoption-polish, platform-focus
- `summary`: 4 Ağustos 2026 itibarıyla Spring Blog akışında yeni bir büyük release dalgası yok; son maintainer sinyalleri de yeni train ilanı yerine Boot 4.1’in gRPC, MongoDB batch, security, observability ve service connection yüzeylerinin sahadaki kullanımına odaklanıyor.
- `why_it_matters`: Upstream’in kendi ilgisi yeni headline üretmekten çok mevcut çizgiyi üretime taşımaya dönmüşken, ekiplerin de backlog’unu aynı olgunluk seviyesine çekmesi gerekir.
- `java_spring_relevance`: Spring Boot 4.1 adoption aşamasındaki ekipler için “hangi yeni özelliği bekleyelim?” yerine “mevcut çizgiyi nasıl standardize ederiz?” sorusu daha doğrudur.
- `actionability`: `izle_ve_planla`
- `impact_level`: `orta`
- `opportunities`: platform backlog’unu sadeleştirmek; observability/service connection/security polish işlerini öne almak; gereksiz feature chase’i azaltmak
- `risks`: yeni release yok diye teknik riskin azaldığını sanmak; adoption polish işlerini ertelemek; support/lifecycle kararlarını feature backlog’una gömmek
- `migration_notes`: Yeni feature araştırma kapasitesinin bir bölümünü support matrix, runtime policy ve upgrade rehearsal işlerine kaydırın; Boot 4.1 adoption checklist’ini release-notes bazlı değil platform-policy bazlı yazın.

## Sonuç

4 Ağustos 2026 Salı gününün ana kararı şu: Java/Spring tarafında bugün değer üreten şey yeni bir framework dalgası kovalamak değil, yaşam döngüsü kontratlarını yazılı hale getirmek. 18 Ağustos 2026 Java CSPU hazırlığı, Jipher `10.37` ile FIPS/GraalVM ayrışması, Spring Framework 7’nin JDK 25+ yönü ve Boot minor destek pencereleri birlikte okunduğunda, platform ekiplerinin runtime standardı, patch cadence ve upgrade takvimini aynı masa üzerinde yönetmesi gerektiği netleşiyor.
