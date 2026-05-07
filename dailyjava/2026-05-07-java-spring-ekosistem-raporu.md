# Günlük Java / Spring Ekosistem Raporu

Tarih: 7 Mayıs 2026  
Tarama zamanı: 7 Mayıs 2026 09:11 TSİ  
Odak: Spring Cloud Config güvenlik dalgası, Spring Cloud release-train baskısı, Oracle JDK patch takvimi, JDK 26 bütünlük sinyalleri, Spring AI 2.0 migrasyonları

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring Security Advisories](https://spring.io/security), [Spring Cloud proje sayfası](https://spring.io/spring-cloud), [Spring Cloud Supported Versions wiki](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions), [Spring Cloud 2025.0 release notes](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-2025.0-Release-Notes), [Oracle Security Blog](https://blogs.oracle.com/security/update-monthly-critical-security-patch-updates-cspus-begin-may-28-2026), [Oracle Java Blog](https://blogs.oracle.com/java/the-arrival-of-java-26), [Inside Java](https://inside.java/2026/04/27/avoiding-final-field-mutation/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/spring-ai-series), [Josh Long - This Week in Spring, 5 Mayıs 2026](https://spring.io/blog/2026/05/05/this-week-in-spring-may-05-2026/), [Spring AI release duyurusu](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/), [Gunnar Morling’in son yazıları](https://www.morling.dev/), [Burak KUTBAY blogu](https://blog.burakkutbay.com/) ve ilgili GitHub release/release-note sayfaları kontrol edildi. Gunnar Morling ve Burak KUTBAY tarafında bugün mikroservis/Spring backlog’unu tek başına değiştirecek yeni bir incident veya release duyurusu görünmüyor; buna karşın Spring Cloud Config advisories ve Oracle’ın patch cadence değişikliği doğrudan operasyonel öncelik üretiyor.

## Öne Çıkan Başlıklar

- 6 Mayıs 2026 tarihli dört ayrı [Spring Cloud Config advisory](https://spring.io/security), Config Server’ı bu haftanın en kritik Java/Spring kontrol düzlemi konusu haline getirdi. Özellikle OSS kullanan ekipler için hedef sürümler `4.3.3` ve `5.0.3`.
- [Oracle’ın 4 Mayıs 2026 duyurusu](https://blogs.oracle.com/security/update-monthly-critical-security-patch-updates-cspus-begin-may-28-2026), Oracle JDK kullanan kurumlar için patch sürecini çeyreklikten aylığa çekiyor. İlk aylık kritik güncelleme 28 Mayıs 2026.
- [Spring Cloud resmi destek matrisi](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions), aktif OSS eksenini fiilen `2025.1` ve `2025.0` train’lerine daraltıyor. `2024.0` ve `2023.0` artık rahat bölgede değil.
- [JDK 26](https://blogs.oracle.com/java/the-arrival-of-java-26) ve [Inside Java’nın final field mutation uyarıları](https://inside.java/2026/04/27/avoiding-final-field-mutation/) birlikte okunduğunda Java platformu “integrity by default” yönünde ilerliyor. Bu, özellikle reflection kullanan framework ve kütüphaneler için laboratuvar zamanı demek.
- [Spring AI 2.0.0-M5 / 1.1.5 / 1.0.6](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/) yeni feature’dan çok provider sadeleştirme ve migration işi getiriyor.

## Kritik Güncellemeler

### Spring Cloud Config tarafında toplu güvenlik baskısı var

6 Mayıs 2026’da yayımlanan advisory seti, Config Server kullanan ekipler için artık yalnız “konfigürasyon servisi” değil, gerçek bir kontrol düzlemi risk yüzeyi olduğunu hatırlatıyor:

- [CVE-2026-40982](https://spring.io/security/cve-2026-40982): specially crafted URL ile directory traversal
- [CVE-2026-40981](https://spring.io/security/cve-2026-40981): Google Secrets Manager backend’inde yanlış project sınırından secret erişimi
- [CVE-2026-41002](https://spring.io/security/cve-2026-41002): `spring.cloud.config.server.git.basedir` için TOCTOU saldırı yüzeyi
- [CVE-2026-41004](https://spring.io/security/cve-2026-41004): trace logging açıkken hassas bilgilerin düz metin loglanması

En kritik nokta şu: etkilenen hatlar `3.1.x`, `4.1.x`, `4.2.x`, `4.3.x`, `5.0.x`. OSS tarafta fix sürümleri `4.3.3` ve `5.0.3`; daha eski hatlar için fix sürümleri `3.1.14`, `4.1.10`, `4.2.7`, ancak bunlar enterprise-only olarak işaretlenmiş. Spring Cloud Config dokümantasyon sayfası hâlâ `5.0.2` stable gösterdiği için, güvenlik patch seviyesi doğrulamasında dokümantasyon ekranına değil advisory sayfasına ve artifact deposuna bakmak daha doğru.

### Oracle JDK kullanan ekipler için patch takvimi değişiyor

[Oracle Security Blog](https://blogs.oracle.com/security/update-monthly-critical-security-patch-updates-cspus-begin-may-28-2026) 4 Mayıs 2026’da, aylık Critical Security Patch Update modeline geçileceğini açıkladı. Açıklanan takvim:

- 28 Mayıs 2026: CSPU
- 16 Haziran 2026: CSPU
- 21 Temmuz 2026: CPU
- 18 Ağustos 2026: CSPU

Bu, Oracle JDK kullanan kurumsal filolarda patch penceresi, regresyon test otomasyonu ve CAB/onay süreçlerinin yeniden düşünülmesi gerektiği anlamına geliyor. Spring servisleri çoğu kurumda JDK patch seviyesine bağımlı risk değerlendirmesiyle yayımlandığı için bu yalnız platform ekibinin konusu değil.

### Spring Cloud upgrade artık yalnız versiyon bump değil

[Spring Cloud resmi proje sayfası](https://spring.io/spring-cloud) ve [supported versions wiki](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions) iki şeyi net söylüyor:

- `2025.1.x` = Spring Boot `4.0.x`
- `2025.0.x` = Spring Boot `3.5.x`

Aynı tabloda `2024.0` ve `2023.0` train’leri strikethrough ile gösteriliyor. Buna ek olarak [2025.0 release notes](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-2025.0-Release-Notes) Spring Cloud Gateway için modül/starter rename ve property prefix geçişi getiriyor. Yani özellikle Gateway kullanan ekiplerde train upgrade’i, config compatibility review olmadan yapılmamalı.

## Trendler ve Sinyaller

### 1. Güvenlik yüzeyi application code’dan control plane’e kayıyor

Bu haftanın en güçlü sinyali web controller veya auth chain değil, Config Server. Java/Spring ekipleri için risk yüzeyi artık:

- outbound HTTP ve gateway
- centralized config
- secret backends
- temp filesystem ve local clone alanları
- trace log davranışı

gibi “operasyon katmanı” bileşenlerinde yoğunlaşıyor.

### 2. Release-train disiplini leaf dependency yönetiminin önüne geçiyor

Spring Cloud tarafında Boot nesli ile Cloud train’i yanlış eşlemek artık küçük uyumsuzluk değil, doğrudan destek ve security response problemi. Bu durum özellikle çok servisli filolarda “tek servis güncelle, sonra bakarız” yaklaşımını zayıflatıyor.

### 3. Java platformu daha sıkı bütünlük kuralları yönüne gidiyor

[Inside Java’daki final field mutation yazısı](https://inside.java/2026/04/27/avoiding-final-field-mutation/) ve [Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26) birlikte okununca yön net: reflection ile `final` alanları bozma gibi eski pratikler gittikçe daha görünür ve daha az tolere edilir hale geliyor. Bu, özellikle eski serialization/deserialization, proxy ve test yardımcıları için orta vadeli uyumluluk baskısı demek.

### 4. Java AI ekosistemi genişlemekten çok sadeleşiyor

[Spring AI release duyurusu](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/) ve repo uyumluluk notları, ana eğilimin yeni provider eklemekten çok desteklenen yüzeyi sadeleştirmek olduğunu gösteriyor. Bunun kalıcı değeri var; çünkü kurumsal ekipler için sürdürülebilirlik, “her modeli destekleme”den daha önemli.

## Araçlar ve Kütüphaneler

- [Spring AI 2.0.0-M5 / 1.1.5 / 1.0.6](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/): Yüksek öncelik, ama yalnız Spring AI kullanan ekipler için. Özellikle 2.x hattında provider modül kaldırmaları migration gerektiriyor.
- [Spring Framework 7.0.7](https://github.com/spring-projects/spring-framework/releases): Orta öncelik. `LazyConnectionDataSourceProxy` ile Hibernate multi-tenancy etkileşimi, `RestClient`, validation ve Micrometer/Reactor bağımlılıkları tarafında bakım sinyali taşıyor.
- [Spring Cloud 2025.0 release notes](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-2025.0-Release-Notes): Yüksek öncelik. Özellikle Gateway artifact/property rename’leri yüzünden.
- [Gunnar Morling’in Hardwood çalışmaları](https://www.morling.dev/): Düşük-orta öncelik. Parquet, S3 ve predicate pushdown ekseninde ilginç; fakat tipik Spring Boot mikroservis backlog’unu bugün değiştirecek güçte değil.

Bugün Kubernetes, test otomasyonu veya observability tarafında tek başına backlog önceliğini değiştirecek bağımsız yeni bir Java/Spring release sinyali görünmüyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Config Server kullanıyorsanız önce deployment envanteri çıkarın: hangi backend’ler aktif, `trace` log açık mı, Google Secrets Manager kullanılıyor mu, `git.basedir` nereye yazıyor, static/binary resource servis ediliyor mu?
- Spring Cloud kullanan ekipler BOM seçimini servis bazında değil filo bazında doğrulamalı. Boot `3.5.x` ve `4.0.x` ayrımı artık doğrudan release-train kararı.
- Oracle JDK kullanan kurumlarda aylık patch modeli, Spring servislerinin smoke/regresyon otomasyonunu sıklaştırmayı gerektirir. “Quarterly JVM patch” varsayımı teknik olarak eskidi.
- JDK 26 için hemen üretim upgrade çağrısı yok. Ama Java 26 laboratuvarında reflection-heavy kütüphaneler, JSON binding, ORM, test doubles ve bytecode tooling özellikle denenmeli.
- Spring AI kullanan ekipler için esas soru artık “hangi modeli ekleyelim?” değil, “hangi integration’lar ana repo dışında kaldı ve hangi starter’ları değiştirmemiz gerekiyor?” olmalı.

## Fırsatlar ve Riskler

### Fırsatlar

- Spring Cloud güvenlik dalgası, config/secret kontrol düzlemi için daha net bir hardening checklist çıkarmak için doğru zaman.
- Oracle’ın aylık CSPU modeli, JDK patch uygulamasını daha küçük ama daha sık adımlara bölerek blast radius azaltabilir.
- Spring Cloud train netliği, eski servislerde dağılmış dependency yönetimini standart BOM politikalarına toplamak için fırsat sunuyor.
- JDK 26 integrity sinyalleri, reflection bağımlılığını azaltıp daha öngörülebilir çalışma zamanı davranışına geçiş için erken uyarı niteliğinde.
- Spring AI sadeleşmesi, ilk parti desteklenen entegrasyonlara odaklanarak operasyon maliyetini düşürebilir.

### Riskler

- Config Server açıkları, yanlış varsayılanlarla çalışan ama dışarıya açık servislerde doğrudan veri sızıntısı veya dosya erişimi riskine dönüşebilir.
- OSS dışına düşen Spring Cloud hatlarında kalmak, bir sonraki advisory dalgasında “fix var ama sana yok” problemine yol açar.
- Aylık Oracle patch akışı, regresyon otomasyonu zayıf ekiplerde patch gecikmesine ve güvenlik borcuna neden olabilir.
- JDK 26 ile gelen warning’ler bugün yalnız uyarı olsa da, gelecekte sertleşecek davranışların habercisi olabilir.
- Spring AI 2.x migration’ı, provider bağımlılıkları dağınık ekiplerde compile-time ve runtime kırılma riski taşır.

## İzlenmesi Gereken Konular

- Spring Cloud Config `5.0.3` ve `4.3.3` için blog/release-note görünürlüğünün ne zaman netleşeceği; advisory ile dokümantasyon arasındaki fark kapanmalı.
- `2025.1.x` train’inde benzer güvenlik dalgasının Gateway, OpenFeign, Stream veya Commons bileşenlerine sıçrayıp sıçramayacağı.
- Oracle CSPU modelinin ilk gerçek etkisi 28 Mayıs 2026’dan sonra görülecek. Kurumsal Java filolarında patch lead time ölçülmeli.
- JDK 27 heads-up içeriklerinin final field mutation ve eski API kaldırımları tarafında nasıl sertleşeceği.
- Spring AI `2.0.0-RC1` ve GA hattında 2.x upgrade guide’ın ne kadar netleşeceği.
- [Burak KUTBAY blogundaki](https://blog.burakkutbay.com/) mevcut Spring Boot 4 / Spring Framework 7 içerikleri öğrenme kaynağı olarak faydalı; ancak bugün yeni release-trend sinyali üretmiyor.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Cloud Config için 6 Mayıs 2026 güvenlik paketi doğrudan üretim önceliği
- source: [CVE-2026-40982](https://spring.io/security/cve-2026-40982), [CVE-2026-40981](https://spring.io/security/cve-2026-40981), [CVE-2026-41002](https://spring.io/security/cve-2026-41002), [CVE-2026-41004](https://spring.io/security/cve-2026-41004), [Spring Security Advisories](https://spring.io/security)
- author: mevcut değil
- date: 6 Mayıs 2026
- category: security, spring-cloud, config-server, operations
- tags: spring-cloud-config, cve, directory-traversal, gcp-secret-manager, toctou, trace-logging
- summary: Spring Cloud Config Server için aynı gün içinde yayımlanan dört advisory; directory traversal, Google Secrets Manager proje sınırı ihlali, `git.basedir` TOCTOU ve trace log ile secret sızıntısı risklerini kapatıyor. OSS fix sürümleri `4.3.3` ve `5.0.3`.
- why_it_matters: Config Server çoğu ekipte “yardımcı servis” gibi görülüyor; oysa bu açıklar config düzleminin doğrudan saldırı yüzeyi olduğunu gösteriyor.
- java_spring_relevance: Spring Cloud Config kullanan tüm Java/Spring ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Config/secret hardening checklist’i çıkarma, backend bazlı erişim politikalarını sıkılaştırma, trace logging standardını gözden geçirme.
- risks: secret sızıntısı, dosya erişimi, yanlış GCP project secret okunması, local clone alanı suistimali.
- migration_notes: `5.0.x` için `5.0.3`, `4.3.x` için `4.3.3` hedeflenmeli; upgrade mümkün değilse `spring.cloud.config.server.gcp-secret-manager.token-mandatory=true` değerlendirilmeli; `git.basedir` ve trace log ayarları audit edilmeli.

### Bulgu 2

- title: Spring Cloud destek matrisi artık yalnız iki aktif OSS eksene işaret ediyor
- source: [Spring Cloud proje sayfası](https://spring.io/spring-cloud), [Supported Versions wiki](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions), [Spring Cloud 2025.0 Release Notes](https://github.com/spring-cloud/spring-cloud-release/wiki/Spring-Cloud-2025.0-Release-Notes)
- author: Spring Cloud Team, Spencer Gibb, spring-builds
- date: 19 Mart 2026 ve 2 Nisan 2026
- category: migration, compatibility, cloud, gateway
- tags: spring-cloud, boot-compatibility, bom, gateway, release-train, support-policy
- summary: Aktif OSS trenleri fiilen `2025.1` (Boot `4.0.x`) ve `2025.0` (Boot `3.5.x`). `2024.0` ve `2023.0` artık destek rahatlığında değil. Ayrıca Spring Cloud Gateway tarafında yeni artifact isimleri ve property prefix geçişleri var.
- why_it_matters: Spring Cloud upgrade’i artık tek dependency bump değil; BOM, starter adı ve property yüzeyi birlikte ele alınmalı.
- java_spring_relevance: Spring Cloud, Gateway, OpenFeign, Stream veya Config kullanan mikroservis filoları için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: BOM standardizasyonu, deprece olmuş Gateway starter’larından temiz çıkış, upgrade backlog’unu release-train temelli yönetmek.
- risks: yanlış Boot-Cloud eşleşmesi, deprecated starter uyarıları, property rename kaynaklı sessiz davranış değişiklikleri.
- migration_notes: kullanılan train’i netleştir; `spring-cloud-starter-gateway` ve türevleri için yeni artifact/prefix isimlerini audit et; her servis yerine platform çapında hedef train belirle.

### Bulgu 3

- title: Oracle JDK için aylık kritik patch dönemi 28 Mayıs 2026’da başlıyor
- source: [Update: Monthly Critical Security Patch Updates (CSPUs) Begin May 28, 2026](https://blogs.oracle.com/security/update-monthly-critical-security-patch-updates-cspus-begin-may-28-2026)
- author: Integrated Cyber Center (ICC)
- date: 4 Mayıs 2026
- category: jdk, security, operations, governance
- tags: oracle-jdk, cspu, cpu, patching, enterprise-java
- summary: Oracle, kritik güvenlik düzeltmelerini artık yalnız çeyreklik CPU ile değil, aylık CSPU modeliyle de yayımlayacak. İlk tarihler 28 Mayıs 2026, 16 Haziran 2026, 21 Temmuz 2026 ve 18 Ağustos 2026 olarak duyuruldu.
- why_it_matters: Java runtime patch yönetimi daha sık döngüye geçiyor; bu doğrudan release engineering ve regresyon kapasitesi konusu.
- java_spring_relevance: Oracle JDK üzerinde çalışan Spring servis filoları için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: küçük ama sık patch akışıyla maruziyet süresini düşürmek, otomatik smoke/regresyon yatırımını meşrulaştırmak.
- risks: patch yorgunluğu, zayıf test otomasyonu olan ekiplerde sürüm geride kalma, CAB süreçlerinin darboğaz yaratması.
- migration_notes: patch takvimi aylık olacak şekilde güncellenmeli; CI/CD pipeline’larına JDK patch smoke testi eklenmeli; JDK tedarikçisine göre süreç ayrıştırılmalı.

### Bulgu 4

- title: JDK 26 final field mutation warning’leriyle framework uyumluluğunu öne çekiyor
- source: [Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/), [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [JEP Index](https://openjdk.org/jeps/)
- author: Nicolai Parlog, Sharat Chander, OpenJDK
- date: 17 Mart 2026 ve 27 Nisan 2026
- category: jdk, compatibility, integrity, runtime
- tags: java-26, integrity-by-default, reflection, final-fields, jep-500
- summary: JDK 26, reflection ile `final` alanların değiştirilmesine warning üretmeye başlıyor. Inside Java bu davranışı geçici bir uyarı olarak değil, daha sıkı bütünlük modeline geçişin başlangıcı olarak çerçeveliyor.
- why_it_matters: Sorun uygulama kodunda görünmeyebilir; asıl etki serialization, ORM, test, proxy ve bytecode katmanlarında ortaya çıkabilir.
- java_spring_relevance: Spring ekosisteminde Jackson, Hibernate, test yardımcıları ve çeşitli reflection-heavy kütüphaneler kullanan ekipler için orta-yüksek.
- actionability: izlemeye_deger_ve_lab
- impact_level: orta-yüksek
- opportunities: reflection bağımlılığını azaltmak, immutability odaklı tasarımları güçlendirmek, Java 26 uyumluluk testlerini erken başlatmak.
- risks: runtime warning gürültüsü, gelecekte daha sert default’lara geçildiğinde beklenmedik kırılmalar.
- migration_notes: Java 26 ile test matrisi çalıştır; warning üreten bileşenleri envanterle; `--enable-final-field-mutation` ve `--illegal-final-field-mutation` bayraklarına ihtiyaç duyuluyorsa bunu geçici borç olarak işaretle.

### Bulgu 5

- title: Spring AI 2.0.0-M5 yeni API’den çok migration yükü getiriyor
- source: [Spring AI 1.0.6, 1.1.5, 2.0.0-M5 Available Now](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now/), [spring-projects/spring-ai](https://github.com/spring-projects/spring-ai)
- author: Ilayaperumal Gopinathan, Spring AI Team
- date: 27 Nisan 2026
- category: ai, release, migration, breaking-change
- tags: spring-ai, 2.0.0-m5, boot-4, provider-removal, chatclient, mcp
- summary: 2.0.0-M5; Azure OpenAI modüllerini ana depodan çıkarıyor, Vertex AI model/autoconfiguration modüllerini kaldırıyor, ZhipuAI ve OCI GenAI entegrasyonlarını ayırıyor, option merging davranışını `ChatClient.combineWith()` tarafına taşıyor. Aynı repo `2.x -> Boot 4.x`, `1.1.x -> Boot 3.5.x` uyumluluğunu açıkça belirtiyor.
- why_it_matters: Spring AI kullanan ekiplerde iş yalnız dependency bump değil; starter, import, config ve provider seçimi yeniden gözden geçirilmeli.
- java_spring_relevance: Spring AI kullanan veya planlayan Spring Boot ekipleri için yüksek; diğer ekipler için düşük öncelik.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: provider sprawl’ını azaltmak, ilk parti desteklenen abstractions üzerine standardizasyon kurmak, ChatClient merkezli tasarımı netleştirmek.
- risks: compile-time kırıklar, runtime config sapmaları, kaldırılan modüllere sessiz bağımlılık.
- migration_notes: kullanılan AI starter ve import’ları envanterle; Azure OpenAI için standart `spring-ai-openai` yoluna geçişi test et; `ModelOptionUtils.merge()` benzeri kullanımları `combineWith()` ile gözden geçir; 2.x planı varsa Boot 4 uplift’i beraber düşün.

## Sonuç

7 Mayıs 2026 itibarıyla en yüksek sinyal yeni framework özelliği değil, konfigürasyon kontrol düzlemi güvenliği ve platform patch yönetişimi. Öncelik sırası net olmalı: önce Spring Cloud Config filolarını ve fix sürümlerini doğrula, ardından Spring Cloud train/BOM durumunu temizle, sonra Oracle JDK patch akışını aylık modele göre yeniden planla. JDK 26 ve Spring AI 2.x tarafı ise hemen üretime alınacak yenilikten çok, uyumluluk laboratuvarı ve migration tasarımı isteyen alanlar olarak görülmeli.
