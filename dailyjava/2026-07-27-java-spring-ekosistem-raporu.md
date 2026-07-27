# Günlük Java / Spring Ekosistem Raporu

Tarih: 27 Temmuz 2026 Pazartesi  
Tarama zamanı: 27 Temmuz 2026 09:06 TSİ  
Odak: patch seviyesi yönetişimi; Spring güvenlik düzeltmelerinin default/API etkileri, Spring Cloud release-train floor'ları ve JDK 27 servisability format değişikliği

Tarama notu: 27 Temmuz 2026 Pazartesi günü [Spring Blog](https://spring.io/blog), [Spring blog RSS](https://spring.io/blog.atom), [Spring Security Advisories](https://spring.io/security), [Spring Cloud release `v2025.1.2`](https://github.com/spring-cloud/spring-cloud-release/releases/tag/v2025.1.2), [Spring Cloud release `v2025.0.3`](https://github.com/spring-cloud/spring-cloud-release/releases/tag/v2025.0.3), [Spring Cloud Gateway `v5.0.2`](https://github.com/spring-cloud/spring-cloud-gateway/releases/tag/v5.0.2), [Spring Cloud Gateway CVE-2026-47825](https://spring.io/security/cve-2026-47825), [Spring Security CVE-2026-47838](https://spring.io/security/cve-2026-47838), [Spring Boot `v3.5.15`](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.15), [Spring Boot CVE-2026-40992](https://spring.io/security/cve-2026-40992), [Spring Boot CVE-2026-41001](https://spring.io/security/cve-2026-41001), [Spring Data REST CVE-2026-41729](https://spring.io/security/cve-2026-41729), [Spring Modulith `2.1.0`](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0), [Inside Java: Numeric Fields in JSON Thread Dumps](https://inside.java/2026/05/20/quality-heads-up/), [JEP 540](https://openjdk.org/jeps/540), [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases), [InfoQ Spring News Roundup](https://www.infoq.com/news/2026/06/spring-news-roundup-jun08-2026/), [Baeldung: A Guide to Agent Skills in Spring AI](https://www.baeldung.com/spring-ai-agent-skills), [Gunnar Morling: Fixed-Length Lists in Parquet](https://www.morling.dev/blog/fast-path-for-fixed-length-lists-in-parquet/), [Burak KUTBAY: ArchUnit](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html) ve [Burak KUTBAY: Feature Flag + Unleash](https://blog.burakkutbay.com/burak-kutbay-feature-flag-ile-guvenli-dagitim-spring-boot-unleash-ile-deploy-bagimsiz-feature-yonetim.html) kontrol edildi. 27 Temmuz 2026 itibarıyla resmi Spring blog/release yüzeyinde yeni bir Temmuz GA dalgası görünmüyor; buna rağmen Haziran security wave'inin teknik anlamı kapanmış değil. Bugünün en güçlü sinyali, birkaç fix'in artık yalnız versiyon yükseltmesi değil; default davranış, property namespace, extractor seçimi ve JSON şema beklentisini de değiştirmesi.

## Öne Çıkan Başlıklar

- Spring Cloud Gateway düzeltmesi, yalnız CVE kapatmıyor; WebFlux `NettyServerCustomizer` default kapalı geliyor ve property anahtarı branch'e göre değişiyor.
- Spring Cloud kullanıcıları için karar noktası “Cloud 2025.1 kullanıyoruz” cümlesi değil; en az `v2025.1.2` veya `v2025.0.3` seviyesinde olup olmadığınız.
- Spring Security X.509 pre-auth tarafında `SubjectDnX509PrincipalExtractor` artık teknik borç; CVE ile birlikte deprecate edilip `SubjectX500PrincipalExtractor` öneriliyor.
- Spring Boot'un Haziran güvenlik düzeltmeleri, çoğu ekipte gözden kaçan iki yüzeye vuruyor: embedded Artemis veri dizini ve mail tarafında TLS hostname verification.
- JDK 27 JSON thread dump formatı `formatVersion: 2` ve numeric `processId` / `tid` / `threadCount` alanlarıyla geliyor; parser ve SIEM pipeline'ları buna hazır değilse sessiz kırılma riski var.
- Spring Modulith `2.1.0`, outbox, JobRunr externalization ve Boot slice test desteğiyle olgunlaşıyor; aciliyeti security backlog kadar yüksek değil ama 2026'nın mimari yönü için izlemeye değer.

## Kritik Güncellemeler

### 1. Spring Cloud tarafında “release-train adı” değil patch floor yönetimi önemli hale geldi

[Spring Cloud `v2025.1.2`](https://github.com/spring-cloud/spring-cloud-release/releases/tag/v2025.1.2) release notları, aynı gün yayınlanan güvenlik/fix dalgasını doğrudan BOM içine topluyor: Gateway `5.0.2`, Config `5.0.4`, Function `5.0.3`. Benzer şekilde [Spring Cloud `v2025.0.3`](https://github.com/spring-cloud/spring-cloud-release/releases/tag/v2025.0.3), Gateway `4.3.5` ile geliyor. Bunun pratik anlamı açık: `v2025.1.1` veya `v2025.0.2` gibi daha eski train tag'leri, tarih olarak bu Haziran düzeltmelerinden önce olduğu için ilgili fix'leri içeremez.

Bu, özellikle merkezi BOM kullanan platform ekipleri için kritik. Sorun çoğu zaman “artifact override yapmadık, güvendeyiz” varsayımıyla başlıyor. Oysa güvenli olup olmadığınız, train ailesinden çok tam patch etiketi ve repo içindeki override'lara bağlı.

### 2. Gateway düzeltmesi davranış değiştiriyor; upgrade sonrası config doğrulaması şart

[CVE-2026-47825](https://spring.io/security/cve-2026-47825), Spring Cloud Gateway'in belirli konfigürasyon senaryolarında güvenilmeyen proxy'lerden gelen `X-Forwarded-For` ve `Forwarded` header'larını iletebildiğini söylüyor. Etkilenen satırlar geniş:

- `5.0.0 - 5.0.1`
- `4.3.0 - 4.3.4`
- `4.2.0 - 4.2.8`
- `4.1.0 - 4.1.12`
- `3.1.0 and earlier`

Ama asıl operasyonel detay şu: fix ile birlikte WebFlux `NettyServerCustomizer` default kapalı hale geliyor. Eğer buna ihtiyaç varsa branch'e göre property anahtarı da değişiyor. Yani “sadece patch geçtim” yaklaşımı yetmez; proxy chain, forwarded header güven modeli ve customizer davranışı regression testi gerektirir.

### 3. X.509 sertifika tabanlı pre-auth kullanan ekiplerde gerçek migration işi var

[CVE-2026-47838](https://spring.io/security/cve-2026-47838), `SubjectDnX509PrincipalExtractor`'ın hatalı `CN` ayrıştırması nedeniyle yanlış kullanıcı adı seçebilmesini anlatıyor. Spring ekibi bu düzeltmeyi defense-in-depth olarak çerçeveliyor; ancak önemli olan teknik karar şu: bileşen artık deprecate ve yerine `SubjectX500PrincipalExtractor` öneriliyor.

Bu, özellikle kurumsal reverse proxy veya mTLS zinciri arkasında çalışan eski servlet tabanlı güvenlik katmanları için önem taşıyor. Kod tabanında extractor bean'i aratmadan bu işi “sonraya bırakılmış patch” gibi görmek doğru değil.

### 4. Spring Boot security floor'ları, “güvenli varsaydığımız ortam” kabullerini kapatıyor

[Spring Boot `v3.5.15`](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.15) ve advisory yüzeyi iki düşük görünür ama yüksek pratik etkiye sahip alanı temizliyor:

- [CVE-2026-41001](https://spring.io/security/cve-2026-41001): embedded Artemis için predictable temp directory
- [CVE-2026-40992](https://spring.io/security/cve-2026-40992): `MailSender` auto-configuration tarafında SSL hostname verification eksikliği

Artemis tarafı özellikle test/worker/edge ortamlarında “aynı host güvenli zaten” varsayımını zayıflatıyor. Mail tarafı ise TLS kullandığını sanan ama peer doğrulamasını pratikte eksik bırakan uygulamalar için daha ciddi. Bu ikisi, config explicit değilse security posture'un framework default'una fazla yaslandığını gösteriyor.

### 5. Spring Data REST JSON Patch yüzeyi hâlâ prod riski üretebiliyor

[CVE-2026-41729](https://spring.io/security/cve-2026-41729), `application/json-patch+json` üzerinden `Map` tipli alanları patch ederken SpEL injection yolunu açabiliyor. Problem teorik değil; advisory, saldırganın map key segment'ini SpEL bağlamına sızdırabildiğini açıkça yazıyor.

Bu, “Spring Data REST sadece iç sistemde kullanılıyor” diye rahatlatılan ekipler için önemli. Eğer PATCH açık ve map-typed persistent property'ler mevcutsa, yetkili ama kötü niyetli bir kullanıcı veya lateral movement senaryosu için gerçek risk yüzeyi var.

### 6. JDK 27 thread dump JSON formatı tooling kontratını değiştiriyor

[Inside Java'nın 20 Mayıs 2026 tarihli heads-up yazısı](https://inside.java/2026/05/20/quality-heads-up/) ve [JEP 540](https://openjdk.org/jeps/540), JSON thread dump'ların artık numeric alanlar kullandığını ve `formatVersion: 2` ile versiyonlandığını gösteriyor. `processId`, `tid` ve `threadCount` alanlarını string bekleyen parser'lar JDK 27'de kırılabilir.

Bu, Spring uygulamasının kendisinden çok etrafındaki observability zincirini etkiliyor: destek script'leri, custom dump parser'ları, incident automation, log enrichment ve JSON schema validation kuralları buna dahil.

## Trendler ve Sinyaller

### Trend Kümesi 1: Güvenlik düzeltmeleri artık runtime davranışı da taşıyor

Gateway tarafında customizer default'u değişiyor; X.509 tarafında extractor önerisi değişiyor; Boot tarafında implicit TLS ve local temp path kabulleri kapanıyor. Ortak sonuç: security fix backlog'unu yalnız “hangi sürüme çıkacağız?” diye değil, “hangi runtime davranışını yeniden doğrulayacağız?” diye yönetmek gerekiyor.

### Trend Kümesi 2: Branch ve support-line ayrımı daha operasyonel hale geldi

Birçok advisory satırında OSS ve enterprise-only fix seviyeleri ayrışıyor. Bu, özellikle `4.3.x`, `4.2.x`, `5.8.x`, `3.3.x`, `2.7.x` gibi uzun kuyruk branch'lerde karar maliyetini artırıyor. Ekipler artık yalnız “destekli miyiz?” diye değil, “OSS floor'da mıyız, enterprise floor'da mıyız, yoksa pre-fix branch'te mi kaldık?” diye sormalı.

### Trend Kümesi 3: Diagnostik çıktı formatı bir API sözleşmesi haline geliyor

JDK 27'nin thread dump değişikliği, observability/servisability araçlarının Java sürümünden bağımsızmış gibi düşünülemeyeceğini hatırlatıyor. JSON output artık insan-gözle bakılan text değil, parse edilen makine sözleşmesi.

### Trend Kümesi 4: Mimari araçlar “wiki bilgisi” olmaktan çıkıyor

[Spring Modulith `2.1.0`](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0), outbox, event externalization ve slice-test desteğiyle modüler mimariyi daha yürütülebilir hale getiriyor. [Burak KUTBAY'ın ArchUnit yazısı](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html) ve feature-flag yazısı da aynı çizgiyi tamamlıyor: kuralı belgelemek değil, executable hale getirmek.

## Araçlar ve Kütüphaneler

- `Spring Cloud v2025.1.2 / v2025.0.3`: yüksek öncelik. BOM kullanıcıları için patch floor'u netleştiriyor; özellikle Gateway kullanan servislerde tercih edilen güvenli taban.
- `Spring Modulith 2.1.0`: orta-yüksek öncelik. Namastack outbox, JobRunr externalization, JDBC EPR schema init ve Boot slice-test uyumu ile modüler monolith ekipleri için üretim değeri artıyor.
- JDK 27 JSON thread dump parser güncellemeleri: yüksek öncelik. Kütüphane değil ama build/test/incident otomasyonunda doğrudan güncelleme isteyen araç yüzeyi.
- `ArchUnit` + feature-flag/distribution pratiği: orta öncelik. Kod sınırları ve rollout kararlarını test/operasyon katmanına taşıyor.
- Gunnar Morling'in `Hardwood`/Parquet çizgisi: düşük-orta öncelik. Vector/embedding veya kolonlu veri işleyen JVM servisleri için anlamlı; klasik CRUD mikroservisleri için bugünün ana kararı değil.
- Baeldung'in son Spring AI community içerikleri: düşük öncelik. Öğretici değer taşıyor, fakat bugün resmi security/release yüzeyinden daha acil bir prod kararı üretmiyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Cloud Gateway kullanan ekipler, patch sonrası forwarded header akışını ve `NettyServerCustomizer` ihtiyacını explicitly test etmeli.
- Spring Cloud BOM kullanan ekipler, train adını değil tam tag'i (`v2025.1.2`, `v2025.0.3`) policy nesnesi yapmalı.
- Kurumsal sertifika tabanlı authentication akışlarında `SubjectDnX509PrincipalExtractor` araması yapmadan güvenlik işi kapatılmış sayılmamalı.
- Spring Boot uygulamalarında embedded Artemis ve mail TLS kullanımı, “framework halleder” varsayımından çıkarılıp explicit config denetimine alınmalı.
- Spring Data REST kullanan servislerde JSON Patch endpoint'leri için negatif güvenlik testleri eklenmeli; map alanları özellikle incelenmeli.
- SRE/platform ekipleri, JDK 27 EA ile JSON thread dump parser'larını şimdiden smoke test etmeli; GA gününü beklemek gereksiz risk.

## Fırsatlar ve Riskler

- Fırsat: security patch sürecini davranış değişikliği checklist'i ile zenginleştirip sessiz regression riskini düşürmek.
- Risk: “biz 2025.1'deyiz” veya “biz 3.5'teyiz” gibi eksik sürüm ifadeleriyle pre-fix patch'lerde kalmak.
- Fırsat: Spring Modulith outbox ve JobRunr externalization ile event teslimatını daha denetlenebilir hale getirmek.
- Risk: JDK 27 dump parser'larında numeric alanları karşılayamayıp incident anında kırık tooling ile kalmak.
- Fırsat: ArchUnit ve feature flag yaklaşımıyla security/migration kararlarını executable policy'ye çevirmek.
- Risk: advisory metnini okurken OSS ve enterprise-only fix satırlarını karıştırıp yanlış güvenlik baseline'ı varsaymak.

## İzlenmesi Gereken Konular

- Spring tarafında Temmuz sonu veya Ağustos başında, Haziran CVE dalgasını takip eden yeni patch round gelip gelmeyeceği
- JDK 27 RC aşamalarında JSON thread dump veya serviceability yüzeyinde ek format değişikliği olup olmayacağı
- Spring Cloud Gateway fix'inin ardından proxy/header güven modeli için yeni rehber veya ek advisory çıkıp çıkmayacağı
- Spring Data REST tarafında JSON Patch için ek örnek test, rehber veya hardening notu yayınlanıp yayınlanmayacağı
- Spring Modulith `2.1.x` hattında outbox ve transaction externalization tarafında erken kullanım geri bildirimleri

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Cloud release-train patch floor'u güvenlik kararının ana girdisine dönüştü
- `source`: [Spring Cloud `v2025.1.2`](https://github.com/spring-cloud/spring-cloud-release/releases/tag/v2025.1.2) | [Spring Cloud `v2025.0.3`](https://github.com/spring-cloud/spring-cloud-release/releases/tag/v2025.0.3) | [Spring Cloud Gateway CVE-2026-47825](https://spring.io/security/cve-2026-47825)
- `author`: Spring Cloud maintainers
- `date`: 11-12 Haziran 2026 sürümleri; 27 Temmuz 2026'da doğrulandı
- `category`: security, release-management, spring-cloud
- `tags`: spring-cloud, release-train, bom, gateway, patch-floor, fleet-governance
- `summary`: `v2025.1.2` ve `v2025.0.3`, Haziran güvenlik/fix dalgasını BOM içine alan ilk Cloud train etiketleri. Daha eski `v2025.1.1` ve `v2025.0.2` tarihsel olarak bu düzeltmelerden önce geliyor.
- `why_it_matters`: “Cloud 2025.1 kullanıyoruz” ifadesi tek başına güvenlik garantisi vermiyor; tam patch tag'i belirleyici.
- `java_spring_relevance`: Spring Cloud BOM yöneten tüm platform ve servis ekipleri için doğrudan önemli.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: platform policy'yi train ailesinden patch floor'a çekmek; override envanterini sadeleştirmek
- `risks`: eski train tag'lerinde kalmak; bireysel artifact override ile BOM güvenini bozmak
- `migration_notes`: repo ve parent POM'larda exact Cloud train tag'lerini çıkarın; `v2025.1.2` / `v2025.0.3` altı etiketleri risk listesine alın; local override varsa ayrıca doğrulayın.

### Bulgu 2

- `title`: Gateway fix'i sadece CVE kapatmıyor; default davranışı ve config anahtarını da değiştiriyor
- `source`: [Spring Cloud Gateway CVE-2026-47825](https://spring.io/security/cve-2026-47825) | [Spring Cloud Gateway `v5.0.2`](https://github.com/spring-cloud/spring-cloud-gateway/releases/tag/v5.0.2)
- `author`: Spring team | Spring Cloud Gateway maintainers
- `date`: 11 Haziran 2026; 27 Temmuz 2026'da doğrulandı
- `category`: security, proxying, runtime-behavior, spring-cloud-gateway
- `tags`: gateway, forwarded-headers, proxy-trust, nettyservercustomizer, webflux, config-regression
- `summary`: Fix ile birlikte WebFlux `NettyServerCustomizer` default kapalı hale geliyor. Ayrıca enable etmek için kullanılacak property adı branch ve property namespace geçişine göre değişiyor.
- `why_it_matters`: Güvenlik düzeltmesi sonrası trafik yönlendirme veya proxy davranışı sessizce değişebilir; regression ihtimali yalnız compile-time seviyesinde görünmez.
- `java_spring_relevance`: API gateway, edge proxy veya internal routing gateway işleten Spring ekipleri için çok kritik.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: proxy trust modelini sadeleştirmek; header forwarding davranışını testlerle belgelemek
- `risks`: upgrade sonrası beklenmeyen forwarded-header davranışı; yanlış property ile customizer'ı kapalı bırakmak veya yanlışlıkla yeniden açmak
- `migration_notes`: route ve proxy zinciri için smoke/regression test yazın; branch'e uygun property anahtarını netleştirin; prod rollout'ta header ve source IP gözlemlerini izleyin.

### Bulgu 3

- `title`: X.509 pre-auth zincirlerinde extractor seçimi artık güvenlik borcu
- `source`: [Spring Security CVE-2026-47838](https://spring.io/security/cve-2026-47838) | [Spring Security `7.0.6`](https://github.com/spring-projects/spring-security/releases/tag/7.0.6)
- `author`: Spring Security team
- `date`: 9 Haziran 2026; 27 Temmuz 2026'da doğrulandı
- `category`: security, authentication, x509, migration
- `tags`: x509, pre-auth, principal-extractor, deprecation, subjectdnx509principalextractor, subjectx500principalextractor
- `summary`: `SubjectDnX509PrincipalExtractor`, hatalı `CN` ayrıştırması yüzünden yanlış kullanıcı adı seçebiliyor. Advisory ile birlikte deprecate edilip `SubjectX500PrincipalExtractor` öneriliyor.
- `why_it_matters`: Bu konu yalnız patch numarası değil; bean düzeyinde API ve extractor kararı gerektiriyor.
- `java_spring_relevance`: mTLS, reverse proxy pre-auth veya legacy X.509 auth zinciri işleten Spring Security ekipleri için doğrudan etkili.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: sertifika tabanlı auth katmanını sadeleştirmek; extractor ve DN parsing testlerini yenilemek
- `risks`: eski extractor ile sessiz yanlış eşleşme; defense-in-depth notunu “önemsiz” diye yorumlayıp migration'ı ertelemek
- `migration_notes`: kod tabanında `SubjectDnX509PrincipalExtractor` arayın; `SubjectX500PrincipalExtractor` geçişini planlayın; malformed certificate senaryolarını test setine ekleyin.

### Bulgu 4

- `title`: Spring Boot security floor'ları implicit güvenlik varsayımlarını kapatıyor
- `source`: [Spring Boot `v3.5.15`](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.15) | [CVE-2026-40992](https://spring.io/security/cve-2026-40992) | [CVE-2026-41001](https://spring.io/security/cve-2026-41001)
- `author`: Spring Boot team
- `date`: 10 Haziran 2026; 27 Temmuz 2026'da doğrulandı
- `category`: security, configuration, messaging, mail, runtime-hygiene
- `tags`: spring-boot, artemis, mail, hostname-verification, temp-directory, auto-configuration
- `summary`: `v3.5.15`, embedded Artemis data path ve mail hostname verification gibi çoğu uygulamada explicitly düşünülmeyen iki yüzeye güvenlik düzeltmesi getiriyor.
- `why_it_matters`: Framework default'u ile sessizce taşınan güvenlik açıkları, uygulamanın kendi kodunda görünmese de prod posture'u etkiliyor.
- `java_spring_relevance`: Spring Boot tabanlı neredeyse tüm servislerde etkili; özellikle embedded broker veya SMTP kullanan uygulamalarda daha kritik.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: config audit sürecini sıkılaştırmak; “implicit secure default” varsayımlarını envantere almak
- `risks`: test ortamı veya yan servislerde güvenlik açıklarını gözden kaçırmak; hostname verification'ın etkin olduğunu sanmak
- `migration_notes`: Boot patch floor'unuzu doğrulayın; embedded Artemis kullanıyorsanız explicit path ve izin modelini kontrol edin; mail TLS tarafında hostname verification davranışını smoke test edin.

### Bulgu 5

- `title`: Spring Data REST PATCH yüzeyinde map key kaynaklı SpEL injection hâlâ gerçek prod riski
- `source`: [Spring Data REST CVE-2026-41729](https://spring.io/security/cve-2026-41729) | [Spring Data REST `5.0.6`](https://github.com/spring-projects/spring-data-rest/releases/tag/5.0.6)
- `author`: Spring Data team
- `date`: 9 Haziran 2026; 27 Temmuz 2026'da doğrulandı
- `category`: security, rest, spel, data-access
- `tags`: spring-data-rest, json-patch, spel-injection, map-typed-properties, patch-endpoints
- `summary`: JSON Patch kullanan ve map-typed property expose eden Spring Data REST uygulamaları, map key segment'i üzerinden SpEL injection'a açık olabiliyor.
- `why_it_matters`: Bu açık, “sadece admin kullanıyor” veya “iç servis” varsayımıyla bırakılan REST yüzeylerinde ciddi lateral movement riski üretir.
- `java_spring_relevance`: Spring Data REST ile CRUD/patch endpoint'i sunan ekipler için yüksek öncelikli.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: PATCH politikalarını daraltmak; map alanları için explicit DTO veya controller yüzeyi kullanmak
- `risks`: patch endpoint'lerini standart CRUD rahatlığıyla yönetmek; map alanlarını fark etmeden saldırı yüzeyi bırakmak
- `migration_notes`: JSON Patch endpoint'lerini envanterleyin; map-typed alanlar için negatif güvenlik testleri yazın; mümkünse patch yüzeyini DTO veya custom controller ile daraltın.

### Bulgu 6

- `title`: JDK 27 JSON thread dump formatı, observability araçları için breaking-adjacent kontrat değişikliği getiriyor
- `source`: [Inside Java: Numeric Fields in JSON Thread Dumps](https://inside.java/2026/05/20/quality-heads-up/) | [JEP 540](https://openjdk.org/jeps/540)
- `author`: Ana-Maria Mihalceanu | Naoto Sato | Paul Sandoz | Justin Lu | Stuart Marks
- `date`: 20 Mayıs 2026 ve 23 Temmuz 2026 güncellenen JEP; 27 Temmuz 2026'da doğrulandı
- `category`: jdk, serviceability, observability, tooling
- `tags`: jdk27, thread-dump, json, formatversion2, parser-compatibility, serviceability
- `summary`: JDK 27'de JSON thread dump alanları `processId`, `tid` ve `threadCount` için string yerine numeric değerler kullanıyor ve `formatVersion: 2` ile versiyonlanıyor.
- `why_it_matters`: Java yükseltmesi tek başına uygulama kodunu değil; debug script'lerini, observability parser'larını ve incident otomasyonunu da etkiliyor.
- `java_spring_relevance`: Spring servislerinin kendisini değil, onların etrafındaki platform/SRE araç zincirini etkilediği için dolaylı ama çok önemli.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: dump parser'larını versiyon farkındalıklı hale getirmek; JDK upgrade canary sürecini olgunlaştırmak
- `risks`: prod incident sırasında bozuk parser veya yanlış schema doğrulamasıyla karşılaşmak
- `migration_notes`: JSON thread dump parse eden tüm script ve tool'ları bulun; numeric alanları kabul edecek şekilde güncelleyin; `formatVersion` üzerinden ayrım yapın; JDK 27 EA ile şimdiden smoke test çalıştırın.

### Bulgu 7

- `title`: Spring Modulith `2.1.0`, event externalization ve modül testlerini daha operasyonel hale getiriyor
- `source`: [Spring Modulith `2.1.0`](https://github.com/spring-projects/spring-modulith/releases/tag/2.1.0) | [InfoQ Spring News Roundup](https://www.infoq.com/news/2026/06/spring-news-roundup-jun08-2026/) | [Burak KUTBAY: ArchUnit](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html)
- `author`: Spring Modulith team | Michael Redlich | Burak KUTBAY
- `date`: 11 Haziran 2026 ve Temmuz 2026 community içerikleri; 27 Temmuz 2026'da doğrulandı
- `category`: modularity, architecture, testing, eventing
- `tags`: spring-modulith, outbox, jobrunr, module-slicing, boot-slice-tests, archunit
- `summary`: `2.1.0`, Namastack outbox, JobRunr externalization, JDBC EPR schema init ve Boot slice-test uyumuyla modüler monolith ve event publication tarafını daha uygulanabilir kılıyor.
- `why_it_matters`: Büyük mikroservisleşme baskısına alternatif olarak, modüler monolith + güvenilir event externalization hattını daha ciddi bir seçenek haline getiriyor.
- `java_spring_relevance`: Spring Boot üzerinde modüler monolith, domain event veya bounded-context ayrımı kuran ekipler için anlamlı.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta`
- `opportunities`: event publication reliability katmanını güçlendirmek; mimari sınırları testle doğrulamak
- `risks`: mimari yönetişimi yine dökümana bırakmak; outbox/externalization operasyonunu elle yönetmek
- `migration_notes`: event publication registry ve outbox ihtiyacı olan servislerde `2.1.0` PoC açın; ArchUnit ile paket sınırlarını birlikte düşünün; önce security backlog'u kapatın, sonra mimari modernizasyon kulvarına alın.

## Sonuç

27 Temmuz 2026 için en anlamlı Java/Spring sinyali yeni özellik değil, patch seviyesinin artık davranış değişikliği taşıması. Spring Cloud Gateway, Spring Security X.509, Spring Boot'un implicit güvenlik yüzeyleri ve Spring Data REST PATCH davranışı birlikte okunduğunda, ekiplerin version bump işini “geçtik tamam” çizgisinden çıkarıp testli ve checklist'li bir upgrade pratiğine çevirmesi gerekiyor.

JDK 27 tarafında ise uygulama kodundan önce tooling zincirini hazırlamak daha rasyonel. Bugün yapılacak en yüksek değerli iş: exact patch floor envanteri çıkarmak, Gateway/X.509/PATCH/Boot config yüzeylerinde hedefli testler yazmak ve JDK 27 thread dump parser'larını EA build'lerle doğrulamak.
