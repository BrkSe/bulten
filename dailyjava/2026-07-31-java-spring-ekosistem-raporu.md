# Günlük Java / Spring Ekosistem Raporu

Tarih: 31 Temmuz 2026 Cuma  
Tarama zamanı: 31 Temmuz 2026 09:09 TSİ  
Odak: Spring 3.5/6.2 hattında daralan OSS destek penceresi; Spring geliştirici araç zincirinin güvenlik yüzeyi; geçiş öncesi startup görünürlüğü; düşük öncelikli JVM hızlandırma sinyalleri

Tarama notu: 31 Temmuz 2026 itibarıyla [Spring Blog](https://spring.io/blog), [Spring release duyuruları](https://spring.io/blog/category/releases), [Spring Security advisories](https://spring.io/security), [Spring Tools 5.3.0 release notu](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/), [Spring Boot 3.5.16 duyurusu](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/), [Spring Data 2025.0.13 duyurusu](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/), [Spring Framework 7.0.8 ve 6.2.19 duyurusu](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now/), [Spring Boot startup tracking referansı](https://docs.spring.io/spring-boot/reference/features/spring-application.html), [Spring Boot `startup` actuator endpoint dokümantasyonu](https://docs.spring.io/spring-boot/api/rest/actuator/startup.html), [Inside Java](https://inside.java/), [Under the HAT: Empowering GPU Acceleration for Java](https://inside.java/2026/07/30/under-the-hat-empowering-gpu-acceleration-for-java/), [Oracle Java blog](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), [This Week in Spring - July 28th, 2026](https://spring.io/blog/2026/07/28/this-week-in-spring-july-28-2026/), [InfoQ Java roundup 27 Temmuz 2026](https://www.infoq.com/news/2026/07/java-news-roundup-jul20-2026/), [Baeldung - Application Startup Tracking in Spring](https://www.baeldung.com/spring-application-startup-tracking), [Gunnar Morling blog index](https://www.morling.dev/blog/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Bugün resmi Spring uygulama katmanında yeni büyük bir GA dalgası yok. Asıl sinyal, üretim kodundan önce platform politikasında ve geliştirici makinesinde: hangi branch'lerin OSS olarak kapandığı ve IDE/devtools yüzeyinin artık açıkça bir güvenlik sınırı haline gelmesi.

## Öne Çıkan Başlıklar

- [Spring Boot 3.5.16](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/) açıkça `3.5.x` hattının son OSS sürümü olarak duyuruldu; [Spring Data 2025.0.13](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/) da `3.5.x` neslinin son açık kaynak sürümü olarak konumlandı; [Spring Framework 6.2.19](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now/) ise "most probably" son `6.2.x` OSS sürümü.
- [Spring Tools 5.3.0](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/) sıradan bir IDE güncellemesi değil; [JMX tabanlı RCE](https://spring.io/security/cve-2026-47858/), [0.0.0.0 üstünden JDWP/JMX port yayımı](https://spring.io/security/cve-2026-47873/), [proxy credential sızıntısı](https://spring.io/security/cve-2026-59326/), [weak PRNG ile DevTools secret üretimi](https://spring.io/security/cve-2026-47882/) ve [cleartext launch config secret saklama](https://spring.io/security/cve-2026-59327/) gibi zafiyetleri kapatıyor.
- [Spring Boot `ApplicationStartup`](https://docs.spring.io/spring-boot/reference/features/spring-application.html) ve [`/actuator/startup`](https://docs.spring.io/spring-boot/api/rest/actuator/startup.html) yüzeyi, 4.x geçişleri için artık performans merakı değil doğrulama aracı gibi ele alınmalı.
- [OpenJDK HAT](https://inside.java/2026/07/30/under-the-hat-empowering-gpu-acceleration-for-java/) gerçek bir teknik yön sinyali veriyor; ama klasik Spring REST/microservice ekipleri için bugün düşük öncelikli.

## Kritik Güncellemeler

### 1. Spring geliştirici araç zinciri, açıkça DevSecOps kapsamına girdi

[Spring Tools 5.3.0 release notu](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/) yalnız lint ve stabilite düzeltmeleri duyurmuyor; aynı not içinde beş ayrı CVE'ye atıf yapıyor. En kritik olanı [CVE-2026-47858](https://spring.io/security/cve-2026-47858/): live information mode ile başlatılan Spring Boot uygulamalarında JMX üzerinden remote code execution yüzeyi açılabiliyor. Buna [CVE-2026-47873](https://spring.io/security/cve-2026-47873/) ile Docker entegrasyonunun debug/JMX portlarını tüm arayüzlere açması, [CVE-2026-59326](https://spring.io/security/cve-2026-59326/) ile proxy credential'larının log dosyasına düz metin düşmesi ve DevTools secret yönetimindeki iki ayrı zafiyet ekleniyor.

Buradaki karar değeri şu: IDE, Boot Dashboard, language server ve local dev container akışı artık "yalnız geliştirici konforu" katmanı değil. Spring ekipleri bunları güvenlik envanterine dahil etmek zorunda.

### 2. Spring 3.5/6.2 hattında OSS pencere kapanıyor

[Spring Boot 3.5.16 duyurusu](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/), bunun `3.5.x` neslinin son OSS sürümü olduğunu net söylüyor ve `4.0.x` veya `4.1.x`'e geçişi öneriyor. [Spring Data 2025.0.13 duyurusu](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/) da aynı şekilde `3.5.x` neslinin son açık kaynak sürümü olduğunu belirtiyor. [Spring Framework 6.2.19 duyurusu](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now/) ise `6.2.x` için büyük olasılıkla son OSS sürümü ifadesini kullanıyor.

Bu tablo, 2026 yazı itibarıyla "3.5'te biraz daha kalalım" kararını teknik borç değil doğrudan destek politikası kararı haline getiriyor. Özellikle Boot 3.5 + Data 3.5 + Framework 6.2 kombinasyonu kullanan ekipler için 4.x migration backlog'u artık isteğe bağlı değil.

### 3. Startup görünürlüğü, migration rehearsal'ın zorunlu parçası olmalı

[Spring Boot referansı](https://docs.spring.io/spring-boot/reference/features/spring-application.html), `ApplicationStartup` ile startup adımlarının `StartupStep` nesneleri olarak izlenebildiğini; `BufferingApplicationStartup` ve `FlightRecorderApplicationStartup` ile bunun hem JSON hem JFR olarak toplanabildiğini açıkça tanımlıyor. [`/actuator/startup` endpoint'i](https://docs.spring.io/spring-boot/api/rest/actuator/startup.html) hem snapshot (`GET`) hem drain (`POST`) modunda startup timeline verebiliyor. [Baeldung'in 25 Temmuz 2026 tarihli yazısı](https://www.baeldung.com/spring-application-startup-tracking) bunu yeniden görünür hale getiriyor.

Bugün bu yeni bir framework özelliği değil; yeni olan, migration ve performans doğrulamasında tekrar merkezî hale gelmesi. 3.5'ten 4.x'e geçen ekipler için startup görünürlüğü olmadan canary karşılaştırması eksik kalır.

## Trendler ve Sinyaller

### Trend Kümesi 1: OSS destek yaşam döngüsü, mimari yol haritasını zorluyor

Tekrarlayan sinyal şu:

- Boot `3.5.x` açık kaynakta kapanmış durumda.
- Spring Data `2025.0.x` açık kaynakta kapanmış durumda.
- Framework `6.2.x` hattı da kapanış eşiğinde.

Bu üçü birlikte okunduğunda, Spring ekiplerinin 4.x'e geçiş kararı artık tek bir repo ya da servis bazında değil platform seviyesi governance konusu.

### Trend Kümesi 2: Inner-loop araçları, artık saldırı yüzeyi

Spring Tools advisories'nin ortak mesajı çok net:

- local debug/JMX yüzeyi ağdan erişilebilir hale gelebiliyor
- local loglar kimlik bilgisi sızdırabiliyor
- IDE launch metadata'si sır taşıyabiliyor
- live information ve remote restart gibi "geliştirici kolaylığı" özellikleri RCE zincirine dönüşebiliyor

Bu, developer workstation güvenliğinin Spring ekipleri için soyut bir kurumsal politika değil pratik mühendislik konusu olduğunu gösteriyor.

### Trend Kümesi 3: Migration doğrulaması, startup seviyesine iniyor

Son haftalarda güvenlik, davranış değişikliği ve support-window baskısı zaten artmıştı. Bugün buna eklenecek pratik sinyal şu: rollout öncesi doğrulama yalnız integration test, smoke test ve log analizi ile sınırlı tutulmamalı. Startup timeline, bean yaratım sırası, JFR izi ve actuator startup verisi de standart karşılaştırma materyali haline gelmeli.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: Spring 3.5/6.2 support-window baskısı
- Kalıcı değer: Spring Tools ve Boot Dashboard yüzeyini güvenlik kapsamına almak
- Kalıcı değer: startup telemetry'yi migration gate'i yapmak
- İzlenmeli ama bugün düşük öncelik: [OpenJDK HAT](https://inside.java/2026/07/30/under-the-hat-empowering-gpu-acceleration-for-java/) ve GPU offload hattı
- Düşük öncelik: bugün yeni bir "yarın tüm ekipler eklesin" sınıfında evrensel OSS backend kütüphanesi sinyali yok

## Araçlar ve Kütüphaneler

- [Spring Tools 5.3.0](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/): yeni bir productivity artısından çok güvenlik ve stabilite taban sürümü gibi ele alınmalı. Özellikle Eclipse, VS Code, Cursor ve Theia kullanan karma ekiplerde versiyon drift'i bırakılmamalı.
- [`BufferingApplicationStartup`](https://docs.spring.io/spring-boot/reference/features/spring-application.html) ve [`/actuator/startup`](https://docs.spring.io/spring-boot/api/rest/actuator/startup.html): yeni kütüphane değil, fakat 4.x migration ve cold-start diagnostiklerinde kullanılmayan ekipler için doğrudan değer üretiyor.
- [`FlightRecorderApplicationStartup`](https://docs.spring.io/spring-boot/reference/features/spring-application.html): JVM olayları ile Spring bean lifecycle'ını aynı JFR izleğine bağladığı için performans regresyonu arayan ekipler için daha ciddi kullanılmalı.
- [OpenJDK HAT](https://inside.java/2026/07/30/under-the-hat-empowering-gpu-acceleration-for-java/): veri-paralel Java iş yüklerinde izlenmesi gereken bir araç hattı, ancak klasik CRUD/microservice ekipleri için bugünün ana yatırım alanı değil.

Bugün için yeni bir "hemen stack'e ekleyin" mesajı veren bağımsız OSS backend bileşeni çıkmıyor. Asıl değer, mevcut stack'i daha güvenli ve daha görünür işletmekte.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Boot 3.5.x` üzerinde kalan ekipler, bunu artık geçici teknik durum değil bilinçli support trade-off olarak belgelemeli.
- `Spring Data 3.5.x` kullanan servislerde repository davranışı kadar bakım penceresi de roadmap girdisi olmalı; aksi halde veri katmanı upgrade'i son dakikaya kalır.
- IDE ve Boot Dashboard kullanan ekiplerde `Spring Tools 5.3.0` ve `VSCode/Cursor/Theia 2.3.0` sürüm tabanı zorunlu tutulmalı.
- Geliştirici makinelerinde `.launch` dosyaları, proxy env var'ları ve local log artefact'ları artık hassas veri kapsamına alınmalı.
- 4.x migration öncesi ve sonrası startup timeline karşılaştırması yapılmadan "performans aynı" kararı verilmemeli.
- K8s üzerinde çalışan servislerde readiness gecikmesi, lazy init ve bean yaratım dalgalanmaları için `startup` endpoint veya JFR tabanlı kayıt alınmalı.

## Fırsatlar ve Riskler

- Fırsat: Spring platform upgrade'lerini support-window baskısı gelmeden planlayıp daha kontrollü 4.0/4.1 geçişi yapmak.
- Risk: 3.5/6.2 üzerinde kalıp güvenlik ya da hata düzeltmesi ihtiyacını ticari destek almadan karşılayamayacak noktaya gelmek.
- Fırsat: Inner-loop güvenliğini standardize edip IDE/devtools kaynaklı sızıntıları erken kapatmak.
- Risk: Geliştirici konforu özelliklerini güven varsayımıyla kullanıp debug/JMX/remote restart yüzeylerini görünmez bırakmak.
- Fırsat: `ApplicationStartup` ve JFR ile startup regresyonlarını deployment öncesi yakalamak.
- Risk: Performans veya hazır olma problemlerini yalnız uygulama loglarından anlamaya çalışıp kök neden seviyesini kaçırmak.
- Fırsat: Platform ekiplerinin "minimum Spring baseline" politikasını açık sürüm sözleşmesi haline getirmesi.
- Risk: Upgrade kararını servis takımlarına dağınık bırakıp kurumsal sürüm uyumsuzluğu üretmek.

## İzlenmesi Gereken Konular

- `Spring Tools 5.3.0` sonrası benzer advisories'nin language server, Boot Dashboard veya MCP/agent entegrasyonu çevresinde devam edip etmeyeceği
- `Spring Boot 3.5.x` kullanan portföylerde 4.0.x mi yoksa 4.1.x mi hedefleneceğine dair kurumsal standart kararı
- `Spring Framework 6.2.x` sonrası 7.0.x geçişinde servlet, reactive ve security katmanlarında ek davranış farkı notları
- `startup` endpoint ve JFR tabanlı startup profiling'in CI/perf ortamlarında kalıcı gate'e dönüşüp dönüşmeyeceği
- [OpenJDK HAT](https://inside.java/2026/07/30/under-the-hat-empowering-gpu-acceleration-for-java/) hattının Project Babylon ile ne kadar hızlı olgunlaşacağı

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Tools 5.3.0, geliştirici makinesini doğrudan güvenlik sınırı olarak yeniden tanımlıyor
- `source`: [Spring Tools 5.3.0 released](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/) | [CVE-2026-47858](https://spring.io/security/cve-2026-47858/) | [CVE-2026-47873](https://spring.io/security/cve-2026-47873/) | [CVE-2026-59326](https://spring.io/security/cve-2026-59326/) | [CVE-2026-47882](https://spring.io/security/cve-2026-47882/) | [CVE-2026-59327](https://spring.io/security/cve-2026-59327/)
- `author`: Martin Lippert | Spring Security Advisory Team
- `date`: 30 Haziran 2026 duyuru; 29 Temmuz 2026 advisory/fix doğrulaması
- `category`: developer-tooling, security, devsecops
- `tags`: spring-tools, boot-language-server, boot-dashboard, jmx, jdwp, proxy, devtools, secrets
- `summary`: Spring Tools 5.3.0, local Spring geliştirme akışında biriken beş farklı güvenlik sorununu kapatıyor. Bunlar arasında live information modunda JMX tabanlı RCE, Docker entegrasyonunda herkese açık debug/JMX portları, proxy credential sızıntısı ve DevTools remote secret yönetimi kusurları var.
- `why_it_matters`: Local araç zinciri artık yalnız geliştirici ergonomisi konusu değil; yanlış yapılandırma ya da eski sürüm doğrudan credential disclosure veya remote code execution zinciri oluşturabiliyor.
- `java_spring_relevance`: Spring Boot uygulamalarını IDE'den çalıştıran, Boot Dashboard kullanan veya language server tabanlı editörlerle çalışan ekipler için doğrudan etkili.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: Ortak IDE baseline'ı zorunlu hale getirmek; local log ve launch artefact'larını hassas veri sınıfına almak; devtools kullanımını daha bilinçli hale getirmek
- `risks`: Eski Spring Tools sürümlerinde local RCE, açık debug portları, paylaşılan launch dosyalarında secret sızıntısı ve proxy credential disclosure
- `migration_notes`: Eclipse için `5.3.0`, VS Code/Cursor/Theia için `2.3.0` altına düşmeyin; paylaşılmış `.launch` dosyalarını tarayın; eski sürümlerde live information ve remote DevTools kullanımını kapatın; proxy env var'larını log paylaşımı öncesi hassas veri kabul edin.

### Bulgu 2

- `title`: Spring Boot 3.5, Spring Data 2025.0 ve Framework 6.2 hattında OSS süreleri kapanıyor
- `source`: [Spring Boot 3.5.16 available now](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/) | [Spring Data 2025.0.13 released](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/) | [Spring Framework 7.0.8 and 6.2.19 Available Now](https://spring.io/blog/2026/06/08/spring-framework-7-0-8-and-6-2-19-available-now/)
- `author`: Andy Wilkinson | Mark Paluch | Rossen Stoyanchev
- `date`: 8-25 Haziran 2026; 31 Temmuz 2026 itibarıyla hâlâ geçerli temel lifecycle sinyali
- `category`: release-management, support-policy, migration
- `tags`: spring-boot-3.5, spring-data-3.5, spring-framework-6.2, lifecycle, oss-support, upgrade-policy
- `summary`: Spring'in üç kritik hattı aynı dönemde daralıyor: Boot `3.5.x` son OSS sürümünü aldı, Spring Data `2025.0.13` açık kaynakta final `3.5.x` çizgisi olarak duyuruldu, Framework `6.2.19` ise büyük olasılıkla son OSS `6.2.x` sürümü olarak işaretlendi.
- `why_it_matters`: Bu artık sürüm tercihinden çok bakım sözleşmesi konusu. Eski hatta kalmak, yeni framework özelliklerinden geri kalmak kadar patch ve hata düzeltmesi erişimini de sınırlıyor.
- `java_spring_relevance`: Spring Boot + Spring Data + Spring Framework kombinasyonunu platform baseline olarak kullanan tüm ekipleri etkiliyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: 4.0.x ve 4.1.x için net hedef sürüm politikası belirlemek; upgrade işini reaktif değil planlı yapmak; platform takımı ile servis takımı arasında ortak takvim kurmak
- `risks`: Destek penceresi kapandıktan sonra zorunlu ve daha pahalı migration yapmak; güvenlik/hata düzeltmelerinde ticari destek olmadan açıkta kalmak; portföyde sürüm parçalanması üretmek
- `migration_notes`: 3.5/6.2 üzerinde kalan servisleri envanterleyin; 4.0.x ve 4.1.x arasında ortak hedef seçin; bağımlılık matrisi, integration test ve startup/profile karşılaştırmalarını migration planına erken ekleyin.

### Bulgu 3

- `title`: `ApplicationStartup` ve `startup` endpoint'i, 4.x geçişlerinde zorunlu gözlem yüzeyine dönüşüyor
- `source`: [Spring Boot `SpringApplication` referansı](https://docs.spring.io/spring-boot/reference/features/spring-application.html) | [Spring Boot `startup` actuator endpoint dokümantasyonu](https://docs.spring.io/spring-boot/api/rest/actuator/startup.html) | [Baeldung - Application Startup Tracking in Spring](https://www.baeldung.com/spring-application-startup-tracking)
- `author`: Spring Boot Team | Michael Krimgen
- `date`: resmi dokümantasyon güncel; ekosistem hatırlatma yazısı 25 Temmuz 2026
- `category`: observability, performance, migration-practice
- `tags`: applicationstartup, bufferingapplicationstartup, flightrecorderapplicationstartup, actuator-startup, jfr, startup-regression
- `summary`: Spring Boot, startup dizisini `StartupStep` seviyesinde izleyecek resmi yüzeyi zaten sunuyor. `BufferingApplicationStartup` ile JSON timeline, `FlightRecorderApplicationStartup` ile JFR korelasyonu ve `/actuator/startup` ile snapshot/drain erişimi mümkün.
- `why_it_matters`: Büyük sürüm geçişlerinde sorun çoğu zaman request path'te değil uygulamanın ayağa kalkış biçiminde görünür. Bean yaratım sırası, süreler ve startup workload'u ölçülmeden "upgrade temiz" demek erken olur.
- `java_spring_relevance`: Boot 4.x geçişi yapan, K8s üzerinde cold-start hassasiyeti yaşayan veya startup süresi/ready state dalgalanan tüm ekipler için doğrudan pratik değer taşır.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: Migration rehearsal'lara startup timeline eklemek; JFR ve actuator verisini canary karşılaştırmalarında kullanmak; bean bazlı gecikme noktalarını erken yakalamak
- `risks`: Startup regresyonunu yalnız log ve readiness timeout üzerinden okumak; lazy init veya bean wiring farklarını gözden kaçırmak; geç fark edilen pod warmup sorunları
- `migration_notes`: Kritik servislerde `BufferingApplicationStartup` veya `FlightRecorderApplicationStartup` açın; `/actuator/startup` endpoint'ini iç ağ veya test ortamı ile sınırlandırın; 3.5 ve 4.x karşılaştırmasını aynı trafik profili altında kaydedin.

### Bulgu 4

- `title`: OpenJDK HAT, Java'da GPU offload için somut ama niş bir yol açıyor
- `source`: [Under the HAT: Empowering GPU Acceleration for Java](https://inside.java/2026/07/30/under-the-hat-empowering-gpu-acceleration-for-java/) | [Inside Java ana akışı](https://inside.java/)
- `author`: Juan Fumero
- `date`: 30 Temmuz 2026
- `category`: jvm, performance, experimental
- `tags`: openjdk, project-babylon, hat, gpu, cuda, opencl, parallel-workloads
- `summary`: Heterogenous Accelerator Toolkit, Project Babylon code-reflection API'leri üstünden Java'nın veri-paralel iş yüklerini GPU'lara offload etmeyi hedefleyen deneysel bir çerçeve olarak tanıtıldı.
- `why_it_matters`: Java'nın yalnız CPU-bound servis dili olmadığına dair daha güçlü bir platform yönü gösteriyor. Özellikle inference, vector search veya analitik iş yükleri olan JVM ekipleri için orta vadeli seçenek üretebilir.
- `java_spring_relevance`: Klasik Spring MVC veya microservice ekipleri için bugün düşük öncelikli; fakat Spring tabanlı veri platformu veya inference servisi kuran ekipler için izlemeye değer.
- `actionability`: `izle_ve_pilotla`
- `impact_level`: `düşük-orta`
- `opportunities`: JVM ekosisteminden çıkmadan hızlandırılmış veri-paralel iş yükleri denemek; Java + GPU prototiplerini tek dil çevresinde toplamak
- `risks`: Erken olgunlukta API'lere aşırı güvenmek; operasyonel karmaşıklığı küçümsemek; klasik backend servislerde gereksiz teknoloji ilgisi üretmek
- `migration_notes`: Üretim roadmap'ine hemen koymayın; laboratuvar seviyesi PoC ile sınırlayın; yalnız hesaplama yoğun kullanım durumlarında değerlendirin.

## Sonuç

Bugünün ana kararı, yeni özellik kovalamaktan çok sınırları yeniden çizmek. Spring ekipleri için iki gerçek baskın hale geliyor: eski `3.5/6.2` hatlarında açık kaynak bakım penceresi kapanıyor ve geliştirici araç zinciri artık doğrudan güvenlik yüzeyi sayılmalı. Bu nedenle en doğru kısa vadeli yatırım, `Spring Tools` taban sürümünü yükseltmek, 4.x migration takvimini resmileştirmek ve startup telemetry'yi rollout kapısına dönüştürmek.
