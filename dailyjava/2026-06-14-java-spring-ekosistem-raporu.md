# Günlük Java / Spring Ekosistem Raporu

Tarih: 14 Haziran 2026  
Tarama zamanı: 14 Haziran 2026 22:33 TSİ  
Odak: Spring AI `2.0.0` GA, Spring Cloud release-train baskısı, Spring Modulith `2.1`, JDK `26` çalışma zamanı iyileştirmeleri ve compliance odaklı Java kriptografi değişimleri

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security/), [Spring AI upgrade notes](https://docs.spring.io/spring-ai/reference/upgrade-notes.html), [Spring Cloud supported versions wiki](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions), ilgili GitHub release/changelog sayfaları, [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java/Spring](https://www.infoq.com/java/), [Baeldung Java Weekly 650](https://www.baeldung.com/java-weekly-650), [Josh Long’un 9 Haziran 2026 haftalık özeti](https://spring.io/blog/2026/06/09/this-week-in-spring-june-9-2026), [Gunnar Morling’in blogu](https://www.morling.dev/) ve [Burak KUTBAY’ın Haziran 2026 arşivi](https://blog.burakkutbay.com/2026/06/) tarandı. 14 Haziran 2026 akşamı itibarıyla Josh Long tarafında yeni ayrı bir release özeti yok; Gunnar Morling ve Burak KUTBAY tarafında da bugünkü karar setini değiştirecek yeni bir Java/Spring release yazısı görünmedi. Bu yüzden rapor, resmi release notları ve üretim etkisi net olan teknik değişimlere yaslandı.

## Öne Çıkan Başlıklar

- [Spring AI `2.0.0` GA](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now), Spring Boot `4.x` ve Spring Framework `7` tabanına oturup tool-calling, MCP ve null-safety modelini yeniden çizdi; bu, `1.1.x` kullanıcıları için yalnız sürüm yükseltmesi değil, gerçek migrasyon konusu.
- [Spring Cloud `2025.1.2` (Oakwood)](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released) Spring Boot `4.1.0` uyumluluğunu açtı; [Spring Cloud `2025.0.3` (Northfields)](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released) ise 30 Haziran 2026’da bitecek son OSS durağa dönüştü.
- [CVE-2026-47825](https://spring.io/security/cve-2026-47825) nedeniyle Spring Cloud Gateway tarafında yalnız patch değil, proxy güven modeli ve `NettyServerCustomizer` davranışı da gözden geçirilmeli.
- [Spring Modulith `2.1` GA](https://spring.io/blog/2026/06/11/spring-modulith-2-1-ga-2-0-7-and-1-4-12-released) ile outbox, modül testi ve observability tarafında “modüler monolit + olay dışsallaştırma” yaklaşımı daha kurumsal hale geldi.
- [JDK 26 performans notları](https://inside.java/2026/06/09/jdk-26-performance-improvements/) bulut üstünde çalışan servisler için startup, warmup, G1 throughput ve virtual thread ölçeklenebilirliğinde sessiz ama kalıcı iyileştirmeler getiriyor.
- [Oracle Jipher `10.36`](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java) FIPS 140-3 uyumlu Java kriptografisi sunuyor; ama DSA, Triple DES, TLS 1.2 EMS ve PBKDF2 tarafında kırılma potansiyeli taşıyor.

## Kritik Güncellemeler

### 1. Spring AI `2.0.0` GA, “Spring içinde AI” yaklaşımını deneysel olmaktan çıkarıp platform seviyesine taşıdı

[Spring AI `2.0.0` GA](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now) ile birlikte şu eksenler aynı anda değişti:

- Spring Boot `4.0`/`4.1` ve Spring Framework `7.0` tabanı
- Jackson `3` ve JSpecify tabanlı null-safety
- `ChatClient` merkezli, birleşik tool-calling akışı
- MCP Java SDK `2.0.0` hizalanması
- Spring’in resmi OpenAI SDK geçişi ve MCP taşımalarının sadeleşmesi

En kritik nokta: Bu release “daha fazla model connector” haberi değil. `2.0.0`, Spring AI’nın API ve paket yapısını üretim kullanımına göre sıfırlıyor. [Upgrade notes](https://docs.spring.io/spring-ai/reference/upgrade-notes.html) tarafında `spring-ai-azure-openai` ve `spring-ai-openai-sdk` modüllerinin kaldırılması, MCP şema doğrulamasının varsayılan açılması, `Tool.inputSchema()` dönüş tipinin değişmesi ve transport builder API’sinin kırılması bu yüzden önem taşıyor.

Bu ne anlama geliyor:

- `1.1.x` hattında çalışan PoC’ler doğrudan “dependency bump” ile güvenli şekilde `2.0.0`’a geçmeyecek.
- Spring içinde agent/tool altyapısı kurmak isteyen ekipler için ise artık ayrı runtime veya dağınık wrapper’lar yerine daha birleşik bir yol var.
- AI kullanan Java ekiplerinde bu karar artık mimari karar: `Boot 3.5 + Spring AI 1.1.x` bakım hattında mı kalınacak, yoksa `Boot 4.x + Spring AI 2.0` tabanına mı geçilecek?

### 2. Spring Cloud tarafında takvim baskısı somutlaştı: Oakwood ilerleme hattı, Northfields son OSS durak

[Spring Cloud `2025.1.2` (Oakwood)](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released) Spring Boot `4.0.7` ile uyumlu ve Spring Boot `4.1.0` desteğini açıyor. Aynı release içinde:

- Spring Cloud Gateway için [CVE-2026-47825](https://spring.io/security/cve-2026-47825) düzeltmesi
- Kubernetes Fabric8 discovery iyileştirmeleri
- Config tarafında S3 multi-document YAML içinde negated profile düzeltmesi

[Spring Cloud `2025.0.3` (Northfields)](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released) ise daha önemli bir sinyal taşıyor: bu, `2025.0.x` hattının son açık kaynak release’i ve resmi bloga göre OSS desteği 30 Haziran 2026’da bitiyor.

[Supported Versions](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions) sayfası da bu tabloyu netleştiriyor:

- `2025.1 (Oakwood)` hattı Spring Boot `4.0.x`
- `2025.0 (Northfields)` hattı Spring Boot `3.5.x`

Yani konu yalnız versiyon isimleri değil. Spring Cloud kullanıcıları için Haziran 2026 itibarıyla gerçek soru şu:

- `3.5.x` üstünde kalıp Northfields’i son OSS patch ile dondurmak mı?
- Yoksa Oakwood hattına geçip Boot `4.x` standardizasyonunu başlatmak mı?

### 3. Spring Cloud Gateway CVE düzeltmesi güvenlikten fazlası: edge davranışı değişiyor

[CVE-2026-47825](https://spring.io/security/cve-2026-47825), Spring Cloud Gateway’in bazı konfigürasyon senaryolarında `X-Forwarded-For` ve `Forwarded` başlıklarını güvenilmeyen proxy’lerden iletebilmesi sorununu kapatıyor. Bu hem WebMVC hem WebFlux gateway server’larını etkiliyor.

Önemli operasyonel not:

- Fix yalnız patch değil; WebFlux tarafında `NettyServerCustomizer` artık varsayılan olarak kapalı geliyor.
- İhtiyaç varsa özelliğin property ile yeniden açılması gerekiyor.

Bu nedenle edge servislerinde yapılacak iş sadece dependency yükseltmesi değil:

- reverse proxy zinciri
- trusted proxy varsayımları
- gerçek istemci IP’si türetimi
- rate limiting / audit / geo policy gibi başlık bağımlı güvenlik kontrolleri

yeniden test edilmeli.

### 4. Spring Modulith `2.1` GA, modüler monolit yaklaşımını “şık fikir” seviyesinden operasyonel araca taşıyor

[Spring Modulith `2.1` GA](https://spring.io/blog/2026/06/11/spring-modulith-2-1-ga-2-0-7-and-1-4-12-released) ile gelen ana yenilikler:

- Namastack ve JobRunr ile event externalization outbox desteği
- Boot slice test desteği ile modül testi
- `PublishedEvents` ve `Scenario` tarafında thread sınırları ötesi görünürlük
- observability altyapısının sadeleştirilmesi

Bu release’in değeri, “monolit mi mikroservis mi” tartışmasında yeni slogan üretmesi değil. Gerçek değer, olay tabanlı akışların aynı kod tabanı içinde daha kontrollü modellenebilmesi:

- outbox/desenini elle kurma ihtiyacını azaltıyor
- modül sınırlarını testte görünür kılıyor
- event akışlarının observability yüzeyini güçlendiriyor

Özellikle domain’i bölünmüş ama deploy topolojisi henüz parçalanmak zorunda olmayan ekipler için bu artık ciddi bir ara mimari seçeneği.

### 5. JDK `26`, bulut üstü servislerde sessiz ama kalıcı runtime kazançları getiriyor

[Inside Java’nın 9 Haziran 2026 tarihli JDK 26 performans özeti](https://inside.java/2026/06/09/jdk-26-performance-improvements/) şu başlıklarda pratik kazanç gösteriyor:

- varsayılan `InitialHeapSize` artık `MinHeapSize`: explicit `-Xms` verilmeyen servislerde daha hızlı startup
- [JEP 522](https://openjdk.org/jeps/522): G1 throughput iyileştirmesi, referans yoğun iş yüklerinde kayda değer kazanç
- [JEP 516](https://openjdk.org/jeps/516): AOT cache artık herhangi bir GC ile çalışabiliyor
- C2 artık çok parametreli metotları daha iyi optimize ediyor
- class initialization beklerken virtual thread’lerin carrier thread’i bloklamaması sayesinde ölçeklenebilirlik artıyor

Bu haber “yeni language feature” türü gürültü değil. Özellikle container içinde çalışan, startup/warmup kritik, vthread kullanan ya da G1/ZGC tercih eden backend servisler için doğrudan benchmark konusu.

### 6. Oracle Jipher `10.36`, regülasyonlu ortamlarda faydalı ama uyumluluk riski taşıyan bir güvenlik sürümü

[Oracle Jipher `10.36`](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java), OpenSSL `3.5.4` tabanlı FIPS 140-3 onaylı Java kriptografisi sunuyor. Ancak gelen değişiklikler salt “sertifikasyon” haberi değil:

- DSA key/signature generation artık yok
- TLS `1.2` için Extended Master Secret zorunlu
- Triple DES üretim ve encryption desteği kalkıyor
- RSA-PSS ve RSA padding kullanımlarında kısıtlar geliyor
- PBKDF2 iterasyon ve parola politikaları sıkılaşıyor

Bu başlık genel Spring ekipleri için düşük öncelikli olabilir; ama bankacılık, kamu, savunma veya FIPS şartlı dağıtımlar için test edilmeden geçilemeyecek kadar önemli.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring tarafında “yenilik” artık yeni API değil, yeni taban seçimi

Tekrarlayan sinyal:

- Spring AI `2.0.0` -> Boot `4.x` / Framework `7` tabanı
- Spring Cloud `2025.1.2` -> Boot `4.1.0` uyumluluğu
- Northfields `2025.0.3` -> son OSS release

Çıkarım: 2026 yazında asıl karar “özelliği istiyor muyuz?” değil, “hangi taban üzerinde kalacağız?” sorusu.

### Trend Kümesi 2: AI entegrasyonu Spring içinde ayrı bir yan yol olmaktan çıkıyor

Tekrarlayan sinyal:

- Spring AI `2.0.0` ile tool loop, advisor chain ve MCP birinci sınıf vatandaş oluyor
- resmi OpenAI SDK geçişi
- InfoQ’daki [Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) söyleşisinde Spring tarafının AI-ready tooling üzerine aktif araştırma yaptığını açıkça söylemesi

Çıkarım: Java/Spring ekipleri için “AI için ikinci runtime gerekir” argümanı zayıflıyor. Kalıcı değer, AI özelliğinin Spring’in mevcut konfigürasyon, test ve operasyon modeline oturabilmesinde.

### Trend Kümesi 3: Mimari tartışma mikroservis sayısından çok olay dışsallaştırma kalitesine kayıyor

Tekrarlayan sinyal:

- Modulith `2.1` outbox
- event görünürlüğü
- observability sadeleştirmesi

Çıkarım: İç modüller arası sözleşme, testlenebilirlik ve event akışının izlenebilirliği, “mikroservise bölündü mü?” sorusundan daha değerli hale geliyor.

### Trend Kümesi 4: JVM ergonomisi özellikle bulut-native servis davranışına oynuyor

Tekrarlayan sinyal:

- küçük varsayılan heap ile hızlı açılış
- GC bağımsız AOT cache
- G1 throughput artışı
- virtual thread taşıyıcı blokajının azalması

Çıkarım: JDK `26`, backend ekiplerinde “bir gün geçeriz” seviyesinden çıkıp kontrollü benchmark adayı haline geldi.

### Gürültü mü, kalıcı değer mi?

- Kalıcı mühendislik değeri çok yüksek: Spring AI `2.0.0`, Spring Cloud Oakwood/Northfields kararı, Gateway CVE düzeltmesi, JDK `26` runtime iyileştirmeleri
- Hedefli ama kalıcı değer: Spring Modulith `2.1`, Micrometer `1.17.0`
- Bağlama bağlı, düşük öncelik: Oracle Jipher `10.36` genel ekipler için; FIPS zorunlu ortamlarda ise yüksek öncelik
- İzlemelik ama bugünün ana kararı değil: Inside Java’nın 14 Haziran 2026 tarihli agentic coding / Java migration oturumu

## Araçlar ve Kütüphaneler

- [Spring AI `2.0.0`](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now): Spring içi agent/tool mimarisi için yeni ana hat.
- [Spring AI `1.1.8` ve `1.0.9`](https://spring.io/blog/2026/06/12/spring-ai-1-1-8-1-0-9-avaialble-now): Boot `3.5.15` üstünde kalacak ekipler için bakım hattı.
- [Spring Cloud `2025.1.2`](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released): Boot `4.1.0` uyumlu yeni release-train patch’i.
- [Spring Cloud `2025.0.3`](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released): 30 Haziran 2026’dan önce alınması gereken son OSS Northfields patch’i.
- [Spring Modulith `2.1`](https://spring.io/blog/2026/06/11/spring-modulith-2-1-ga-2-0-7-and-1-4-12-released): outbox ve modül testi tarafında güçlü aday.
- [Micrometer `1.17.0`](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0): HTTP server ve gRPC instrumentation allocation azaltmaları ile observability tarafında düşük riskli ama yararlı güncelleme.
- [Oracle Jipher `10.36`](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java): compliance odaklı kriptografi sağlayıcısı.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI kullanan ekipler önce dependency envanteri çıkarmalı: `spring-ai-azure-openai`, `spring-ai-openai-sdk`, MCP transport kullanımı, doğrudan şema API erişimi ve custom tool-loop kodları listelenmeden `2.0.0` yükseltmesi başlatılmamalı.
- Spring Cloud `2025.0.x` kullanan ekipler 30 Haziran 2026’yı resmi OSS sınırı olarak roadmap’e koymalı. Bu tarihten sonra “aynı hattan devam ederiz” yaklaşımı savunulamaz hale geliyor.
- Spring Cloud Gateway kullanan ekipler patch’i aldıktan sonra `Forwarded` ve `X-Forwarded-For` türetimini integration test seviyesinde doğrulamalı; özellikle ingress, API gateway ve service mesh kombinasyonlarında.
- Modüler monolit veya iç event akışı kuran ekipler Spring Modulith `2.1` ile “outbox + test + gözlemlenebilirlik” üçlüsünü yeniden değerlendirmeli; elle yazılmış event relay kodları sadeleşebilir.
- JDK `26` denemeleri özellikle explicit `-Xms` vermeyen servislerde, virtual thread kullanan akışlarda ve G1/ZGC farkı olan uygulamalarda performans laboratuvarına alınmalı.
- FIPS veya benzeri kısıtlı ortamlarda çalışan Java servisleri Jipher `10.36` benzeri sağlayıcı güncellemelerinde TLS handshake ve anahtar türetim testlerini CI seviyesine taşımalı.

## Fırsatlar ve Riskler

- Fırsat: Spring AI `2.0.0` ile agent/tool akışını Spring’in doğal test ve konfigürasyon modeline oturtmak
- Fırsat: Oakwood hattına geçip Spring Cloud ile Boot `4.1` standardizasyonunu başlatmak
- Fırsat: Spring Modulith `2.1` ile mikroservise erken bölünmeden event-driven modülerleşme kurmak
- Fırsat: JDK `26` ile startup ve warmup maliyetlerini explicit tuning yapmadan bir miktar düşürmek
- Risk: Spring AI `2.0.0`’ı minor upgrade gibi ele alıp compile-time ve runtime kırılmalarla karşılaşmak
- Risk: Northfields’in son OSS release olduğunu göz ardı edip güvenlik ve bakım borcunu yaz sonrasına taşımak
- Risk: Gateway CVE fix’ini alıp proxy zinciri davranışını test etmeden üretime çıkmak
- Risk: Jipher benzeri compliance güncellemelerinde eski TLS/crypto varsayımlarının sessizce kırılması
- Risk: JDK `26` iyileştirmelerini “otomatik kazanç” sanıp mevcut `-Xms`, GC ve startup tuning kararlarını yeniden ölçmemek

## İzlenmesi Gereken Konular

- Spring AI `2.0.1` ve ilk toplu migration reçeteleri ne kadar hızlı geliyor
- Oakwood hattında Gateway CVE sonrası yeni hardening veya config uyarıları yayımlanıyor mu
- Northfields sonrası başka Spring alt projeleri de “son OSS hat” duyurusu yapıyor mu
- Micrometer `1.17.x` ile Boot `4.1.x` arasındaki pratik observability uyumu sahada nasıl karşılık buluyor
- JDK `26` için containerized Java servislerinden daha somut saha benchmark’ları geliyor mu
- Spring maintainers tarafında AI-ready project metadata veya Spring Tools 5 yönünde daha somut bir teknik yol haritası açıklanıyor mu

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring AI `2.0.0`, Spring içi AI geliştirmeyi yeni bir ana hatta taşıdı; `1.1.x` kullanıcıları için migrasyon maliyeti gerçek
- source: [Spring AI 2.0.0 GA Available Now](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now), [Spring AI Upgrade Notes](https://docs.spring.io/spring-ai/reference/upgrade-notes.html), [Spring AI 1.0.9, 1.1.8 Available Now](https://spring.io/blog/2026/06/12/spring-ai-1-1-8-1-0-9-avaialble-now)
- author: Christian Tzolov; Spring AI Team; Ilayaperumal Gopinathan
- date: 12 Haziran 2026
- category: ai-platform, migration, developer-productivity
- tags: spring-ai-2.0, boot-4, jspecify, mcp, tool-calling, openai-sdk
- summary: Spring AI `2.0.0`, Boot `4.x` ve Framework `7` tabanına geçerek null-safety, options modeli, tool-calling ve MCP entegrasyonunu yeniden şekillendirdi. `1.1.8` ve `1.0.9` ise Boot `3.5.15` üstünde bakım hattını sürdürüyor.
- why_it_matters: Bu sürüm yeni model bağlayıcıları eklemekten çok API yüzeyini sadeleştiriyor ve üretim standardı koyuyor.
- java_spring_relevance: Spring Boot içinde AI özelliği geliştiren ekipler için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: çok-yüksek
- opportunities: Ayrı runtime kurmadan tool-calling, MCP ve Spring-native AI akışları kurmak.
- risks: Kaldırılan modüller, MCP doğrulama değişimleri ve şema API kırıkları nedeniyle yükseltmenin sürpriz üretmesi.
- migration_notes: `spring-ai-azure-openai` ve `spring-ai-openai-sdk` kaldırıldı; MCP Java SDK `2.0.0` ile schema doğrulaması varsayılan açık; `Tool.inputSchema()` artık `Map<String, Object>` dönüyor; `customizeRequest()` kullanımları değiştirilmeli.

### Bulgu 2

- title: Spring Cloud `2025.1.2` Boot `4.1` uyumluluğunu açarken `2025.0.3` Northfields hattını son OSS durağa çevirdi
- source: [Spring Cloud 2025.1.2 (Oakwood) Has Been Released](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released), [Spring Cloud 2025.0.3 (Northfields) Has Been Released](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released), [Supported Versions](https://github.com/spring-cloud/spring-cloud-release/wiki/Supported-Versions), [CVE-2026-47825](https://spring.io/security/cve-2026-47825)
- author: Ryan Baxter; Spring Cloud Team
- date: 11 Haziran 2026
- category: cloud-native, security, migration
- tags: spring-cloud, oakwood, northfields, gateway, boot-4.1, boot-3.5, support-window
- summary: Oakwood `2025.1.2`, Boot `4.1.0` uyumluluğunu getirirken Gateway CVE düzeltmesini ve bazı Kubernetes/Config iyileştirmelerini içeriyor. Northfields `2025.0.3` ise son OSS release ve desteği 30 Haziran 2026’da bitiyor.
- why_it_matters: Spring Cloud kullanan ekipler için sürüm seçimi artık yalnız özellik değil, açık kaynak destek süresi ve güvenlik seviyesi kararı.
- java_spring_relevance: Spring Cloud Config, Gateway, OpenFeign, Stream, Kubernetes veya Contract kullanan tüm ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Oakwood ile Boot `4.1` standardizasyonunu başlatmak; Kubernetes ve Config tarafındaki düzeltmeleri almak.
- risks: Northfields’te kalıp yaz sonunda OSS patch akışını kaybetmek; Gateway başlık güven modelini yanlış varsaymak.
- migration_notes: Kısa vadede `2025.0.3` patch’i alınmalı veya Oakwood’a geçiş planı hazırlanmalı; Gateway fix sonrası `NettyServerCustomizer` varsayılan kapalı olduğu için başlık/proxy davranışı yeniden test edilmeli.

### Bulgu 3

- title: Spring Modulith `2.1` GA, outbox ve modül testiyle “modüler monolit” yaklaşımını operasyonel olarak güçlendirdi
- source: [Spring Modulith 2.1 GA, 2.0.7, and 1.4.12 released](https://spring.io/blog/2026/06/11/spring-modulith-2-1-ga-2-0-7-and-1-4-12-released)
- author: Oliver Drotbohm
- date: 11 Haziran 2026
- category: architecture, event-driven, testing, observability
- tags: spring-modulith, outbox, jobrunr, namastack, module-testing, observability
- summary: Spring Modulith `2.1`, event externalization outbox, Boot slice test uyumu, thread’ler arası event görünürlüğü ve sadeleştirilmiş observability altyapısı ile geldi.
- why_it_matters: Bu sürüm, modüller arası sözleşme ve olay dışsallaştırma işini elle yazılmış glue code’dan çıkarıp çerçeve düzeyine taşıyor.
- java_spring_relevance: Domain’i parçalayan ama her şeyi mikroservise bölmek istemeyen Spring Boot ekipleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Outbox desenini sadeleştirmek; modül sınırlarını testlerde görünür kılmak; event akışlarını daha iyi izlemek.
- risks: Çerçevenin sağladığı garantileri anlamadan mevcut custom event/outbox implementasyonlarıyla çakışmak.
- migration_notes: Özellikle JobRunr, event publication ve modül testleri için mevcut iç araçlar ile Modulith `2.1` yetenekleri karşılaştırılmalı.

### Bulgu 4

- title: JDK `26`, startup, throughput ve virtual thread ölçeklenebilirliğinde backend servisleri doğrudan ilgilendiren iyileştirmeler taşıyor
- source: [Performance Improvements in JDK 26](https://inside.java/2026/06/09/jdk-26-performance-improvements), [Java Weekly 650](https://www.baeldung.com/java-weekly-650)
- author: Ana-Maria Mihalceanu, Per-Ake Minborg; Baeldung editoryal ekip
- date: 9 Haziran 2026 ve 12 Haziran 2026
- category: jvm, performance, runtime
- tags: jdk-26, g1, aot-cache, virtual-threads, startup, c2
- summary: JDK `26`, daha küçük varsayılan başlangıç heap’i, GC bağımsız AOT cache, G1 throughput iyileştirmeleri, C2 derleyici kazanımları ve virtual thread bekleme davranışı iyileştirmeleri getiriyor.
- why_it_matters: Bunlar framework değişikliği gerektirmeden uygulama davranışını etkileyen sessiz performans kazanımları.
- java_spring_relevance: Spring Boot servisleri, container workload’ları ve virtual thread kullanan Java backend’ler için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Daha hızlı açılış, daha iyi warmup ve daha iyi thread ölçeklenebilirliği.
- risks: Mevcut `-Xms`, GC ve startup tuning varsayımlarının geçerliliğini yitirmesi; üretim öncesi ölçüm yapılmaması.
- migration_notes: Explicit heap ayarları olmayan servisler ayrıca ölçülmeli; G1/ZGC ve AOT cache denemeleri staging ortamında workload bazlı benchmark ile yapılmalı.

### Bulgu 5

- title: Oracle Jipher `10.36`, FIPS 140-3 için güçlü ama uyumluluk tarafında sert bir güvenlik çizgisi çekiyor
- source: [Announcing Oracle Jipher 10.36: FIPS 140-3 Cryptography for Java](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java)
- author: Poonam Parhar
- date: 4 Haziran 2026
- category: security, cryptography, compliance
- tags: jipher, fips-140-3, tls-1.2, pbkdf2, rsa-pss, tripledes
- summary: Jipher `10.36`, FIPS 140-3 gereksinimlerine uyum için DSA üretimi, Triple DES kullanımı, TLS 1.2 key derivation ve PBKDF2 parametreleri üzerinde daha katı kurallar getiriyor.
- why_it_matters: Kriptografi sağlayıcısı değişimleri genelde build’de değil, runtime handshake ve key derivation akışlarında patlar.
- java_spring_relevance: Regüle sektörlerde Spring Security/TLS kullanan Java servisleri için orta-yüksek; genel ekipler için düşük-orta.
- actionability: izlemelik
- impact_level: orta
- opportunities: FIPS uyumlu standartlaşmış Java crypto katmanı kurmak.
- risks: Eski TLS 1.2, DSA, Triple DES veya gevşek PBKDF2 varsayımlarına dayanan sistemlerin sessizce bozulması.
- migration_notes: Compliance zorunluluğu olan ortamlarda TLS handshake, sertifika, PBKDF2 ve anahtar üretim testleri zorunlu hale getirilmeli.

### Bulgu 6

- title: Micrometer `1.17.0`, düşük gürültüyle yüksek fayda üreten gözlemlenebilirlik bakımı sundu
- source: [Micrometer 1.17.0 release](https://github.com/micrometer-metrics/micrometer/releases/tag/v1.17.0)
- author: Micrometer maintainers
- date: 8 Haziran 2026
- category: observability, library, maintenance
- tags: micrometer, grpc, http-server, prometheus, allocations
- summary: `1.17.0`, HTTP server instrumentation ve gRPC server convention tarafında allocation azaltımları, LongTaskTimer ve registry kapanış davranışında düzeltmeler, bazı bağımlılık güncellemeleri içeriyor.
- why_it_matters: Observability kütüphanelerindeki küçük allocation iyileştirmeleri yüksek trafikli servislerde görünür maliyet farkı yaratabilir.
- java_spring_relevance: Actuator/Micrometer kullanan Spring Boot servisleri için orta.
- actionability: planlı_aksiyon
- impact_level: orta
- opportunities: Düşük riskli bakım yükseltmesi ile gözlemlenebilirlik overhead’ini azaltmak.
- risks: Çok kritik bir kırılma sinyali yok; fakat Prometheus ve registry davranışı değişiklikleri test edilmeden alınmamalı.
- migration_notes: Öncelik düşük; ancak yüksek trafikli HTTP/gRPC servislerinde staging metriği ile karşılaştırmalı ölçüm yapmaya değer.

## Sonuç

14 Haziran 2026 itibarıyla Java/Spring ekosistemindeki en anlamlı tablo şu: Spring tarafında büyük karar artık “hangi feature’ı alalım?” değil, “hangi platform hattında yaşayacağız?” sorusu. Spring AI `2.0.0` ve Spring Cloud Oakwood/Northfields ayrımı, Boot `4.x` geçişini erteleyen ekiplerin karar maliyetini yükseltiyor. Aynı anda JDK `26`, sessiz ama gerçek runtime kazanımlarıyla backend ekipleri için benchmark yapılması gereken bir taban haline geliyor.

Bugün en akıllı teknik hareket sırası şu olur: Spring Cloud kullanıcıları destek penceresini netleştirsin, Spring AI kullanan ekipler `2.0.0` migrasyon envanterini çıkarsın, gateway ve proxy katmanları güvenlik regression test’ine alınsın, JDK `26` ise kontrollü performans laboratuvarına sokulsun. Gürültü az, karar etkisi yüksek başlıklar bunlar.
