# Günlük Java / Spring Ekosistem Raporu

Tarih: 15 Ağustos 2026 Cumartesi  
Tarama zamanı: 15 Ağustos 2026 09:04 TSİ  
Odak: Bugünün güçlü sinyali yeni bir Spring GA dalgası değil; Oracle JDK/GraalVM 21'in ücretsiz lisans penceresinin kapanışı, 18 Ağustos 2026 hedefli Java CSPU ve Spring Boot 4.1'in Java 25/GraalVM 25 yolunu resmi çalışma hattı haline getirmesi nedeniyle `runtime dağıtımı`nın doğrudan platform sözleşmesine dönüşmesi

Tarama notu: 15 Ağustos 2026 09:04 TSİ itibarıyla [Spring Blog](https://spring.io/blog), [Spring release sayfaları](https://spring.io/blog/category/releases/), [Spring Projects](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security), [Spring Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html), [Spring Framework supported versions](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Versions), [Oracle Java Blog: JDK 21 approaches end-of-permissive license](https://blogs.oracle.com/java/jdk-21-approaches-end-of-permissive-license), [Oracle Java Blog: Transitioning Java to more frequent security updates](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), [Oracle Java Releases Public APIs](https://blogs.oracle.com/java/oracle-java-releases-public-apis), [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases), [Oracle javaVersions API](https://java.oraclecloud.com/javaVersions), [Inside Java](https://inside.java/), [dev.java news](https://dev.java/news/), [Spring Boot milestones](https://github.com/spring-projects/spring-boot/milestones), [Spring Cloud release milestones](https://github.com/spring-cloud/spring-cloud-release/milestones), [InfoQ Java News](https://www.infoq.com/java/news/), [Baeldung Java Weekly 658](https://www.baeldung.com/java-weekly-658), [Josh Long - This Week in Spring - August 11th, 2026](https://spring.io/blog/2026/08/11/this-week-in-spring-august-11-2026), [Gunnar Morling blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandı. 15 Ağustos 2026 itibarıyla yeni bir Spring Boot/Framework/Cloud GA ya da yeni Ağustos security advisory görünmüyor. Güçlü sinyal sürüm değil; runtime vendor, lisans, native-image toolchain ve patch temposunun artık kodlanmış platform politikası gerektirmesi.

## Öne Çıkan Başlıklar

- Oracle, [14 Ağustos 2026 tarihli duyurusunda](https://blogs.oracle.com/java/jdk-21-approaches-end-of-permissive-license) Oracle JDK 21 güncellemelerinin `Eylül 2026` sonuna kadar `NFTC`, `Ekim 2026 CPU` ile birlikte ise `OTN` lisansına geçeceğini; aynı dönemde `GraalVM for JDK 21` güncellemelerinin de lisans değişimine gireceğini netleştirdi.
- Oracle’ın [31 Temmuz 2026 duyurusu](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) `18 Ağustos 2026` için ek bir Java `CSPU` hedefliyor ve `2027` içinde daha sık, fiilen aylıklaşan güvenlik güncelleme temposuna hazırlık istiyor.
- Oracle’ın makinece okunabilir [currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) verisi bugün `21.0.12` ve `25.0.4` için `NFTC`, `17.0.20` için `OTN`, `26.0.2` için ise kısa ömürlü non-LTS çizgisini gösteriyor. Bu, runtime envanterinin artık wiki sayfası değil API ile yönetilmesi gerektiğini söylüyor.
- [Spring Boot 4.1 system requirements](https://docs.spring.io/spring-boot/system-requirements.html) resmi olarak `Java 17+`, `Java 26` uyumluluğu ve `GraalVM Community 25` desteğini veriyor. Yani Spring tarafında JDK 25 ve yeni native-image hattına geçiş için resmi bir çalışma zemini var.
- GitHub üzerindeki resmi milestone yüzeyleri, `Spring Boot 4.1.1`, `4.0.8` ve `4.2.0-M1` hatlarının `20 Ağustos 2026` penceresine yığıldığını; `Spring Cloud 2025.1.3` milestone’unun ise `0 open / 9 closed / %100 complete` durumda aynı tarihe hedeflendiğini gösteriyor. Önümüzdeki hafta tek değişkenli rollout yapmak zorlaşacak.

## Kritik Güncellemeler

### 1. Oracle JDK 21'in ücretsiz kullanım penceresi kapanıyor; bu lisans detayı değil platform kararı

[Oracle’ın 14 Ağustos 2026 tarihli yazısı](https://blogs.oracle.com/java/jdk-21-approaches-end-of-permissive-license), Oracle JDK 21 güncellemelerinin `Eylül 2026` sonuna kadar `NFTC` altında kalacağını, ancak `Ekim 2026 CPU` ile birlikte yeni güncellemelerin `OTN` lisansına geçmesinin planlandığını açıkça söylüyor. Aynı yazıda `GraalVM for JDK 21` için de benzer geçişten söz ediliyor.

Bu, “hangi JDK sürümünü kullanıyoruz?” sorusunu “hangi vendor/lisans/model altında güncel kalacağız?” sorusuna çeviriyor. Etki her ekip için aynı değil: Oracle subscription kullananlar, OCI üzerinde koşanlar veya kişisel/dev/test/prototipleme senaryoları bu değişimi farklı yaşayacak. Ama `Oracle JDK 21 + ücretsiz prod güncelleme beklentisi` ile yürüyen ekipler için takvim artık net.

### 2. 18 Ağustos 2026 CSPU, Java patch sürecini Spring release engineering'in içine çekiyor

[Oracle’ın daha sık güvenlik güncellemesi duyurusu](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), `18 Ağustos 2026` için ek bir Java CSPU hedeflediğini ve `2027` içinde daha fazla aylık güncelleme beklendiğini söylüyor. Metin özellikle `build`, `test`, `release` ve `deployment` süreçlerinin buna uyarlanması gerektiğini vurguluyor.

Spring ekipleri açısından kritik sonuç şu: container imajına JDK gömen, buildpack kullanan veya base image pinleyen servisler artık sadece üç ayda bir JVM patch bakımı yapamaz. Runtime yenileme, framework patch’lerinden ayrı izlenebilir bir release işi haline geliyor.

### 3. Oracle Java release API'leri artık “nice to have” değil; runtime policy-as-code girdisi

[Oracle Java Releases Public APIs](https://blogs.oracle.com/java/oracle-java-releases-public-apis) ve canlı [currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) / [javaVersions](https://java.oraclecloud.com/javaVersions) uçları, sürüm, lisans tipi, destek durumu, yayın tarihi ve destek bitiş tarihlerini makinece okunabilir biçimde veriyor.

Bugünkü fotoğraf özellikle anlamlı:

- `21.0.12` hâlâ `NFTC`
- `25.0.4` güncel `LTS` ve `NFTC`
- `17.0.20` güncel ama `OTN`
- `26.0.2` destekli fakat `non-LTS` ve destek ömrü `17 Eylül 2026`

Buradan çıkan pratik sonuç şudur: Java 26, JDK 21 lisans eşiğinden kaçış için uzun vadeli çözüm değildir. Eğer hedef ücretsiz ve uzun soluklu Oracle hattıysa, resmi veri JDK 25'i daha doğal aday yapıyor. Eğer hedef vendor bağımsız açık JDK ise bu seçim yine açıkça kodlanmalı; varsayım olarak bırakılmamalı.

### 4. Spring Boot 4.1 resmi uyumluluk zemini veriyor; ama gelecek hafta değişiklik yoğunluğu artıyor

[Spring Boot 4.1 system requirements](https://docs.spring.io/spring-boot/system-requirements.html), `Java 17` minimumunu, `Java 26` uyumluluğunu ve native image için `GraalVM Community 25` desteğini açıkça veriyor. Bu, özellikle Boot 4.x ve native-image kullanan ekipler için JDK 25/GraalVM 25 yolunu teknik olarak meşrulaştırıyor.

Öte yandan resmi GitHub milestone yüzeyleri başka bir gerçeği gösteriyor:

- `Spring Boot 4.2.0-M1`: `165/181`, `%91`, hedef `20 Ağustos 2026`
- `Spring Boot 4.1.1`: `155/171`, `%90`, hedef `20 Ağustos 2026`
- `Spring Boot 4.0.8`: `108/123`, `%87`, hedef `20 Ağustos 2026`
- `Spring Cloud 2025.1.3`: `0 open / 9 closed / %100`, hedef `20 Ağustos 2026`, açıklamada `Boot 4.0.x` tabanlı ama `4.1.x` ile uyumlu

Yani lisans/vendor/runtime kararı, tam release penceresinin öncesine denk geliyor. Bu, “tek bakım penceresinde her şeyi birlikte geçiririz” yaklaşımını daha riskli hale getiriyor.

### 5. Topluluk sinyalleri canlı, ama bugünün kararını değiştiren ana eksen değiller

[Josh Long’un 11 Ağustos 2026 akışı](https://spring.io/blog/2026/08/11/this-week-in-spring-august-11-2026), Spring AI AgentCore 2.1.0, RabbitMQ/Data Flow ve topluluk videolarını öne çıkarıyor. [InfoQ Java News](https://www.infoq.com/java/news/) tarafında `JEP 535`, Shenandoah ve genel Java roundup öne çıkıyor. [Baeldung 658](https://www.baeldung.com/java-weekly-658) sanal thread üretim tecrübelerini işaret ediyor. [Gunnar Morling’in 2026 yazıları](https://www.morling.dev/blog/) Hardwood/Parquet ekseninde, [Burak KUTBAY blogu](https://blog.burakkutbay.com/) ise son görünür yüzeyde `Java 24 Stream Gatherers`, `Spring Cloud Bus`, `ArchUnit` ve `HTTP Service Client` gibi başlıkları taşıyor.

Bunların hiçbiri önemsiz değil; ancak 15 Ağustos 2026 itibarıyla üretim kararını en çok etkileyen değişken, resmi kaynaklardaki runtime lisans ve cadence sinyali.

## Trendler ve Sinyaller

### Trend Kümesi 1: Runtime procurement artık CI/CD ve platform mühendisliği konusu

Tekrarlayan sinyal şu:

- Oracle lisans modeli runtime seçiminde doğrudan etkili
- CSPU temposu runtime patch işini hızlandırıyor
- release metadata artık API ile çekilebiliyor

Bu kombinasyon, JDK seçimini mimari dokümandan çıkarıp otomatik kontrole taşımayı gerektiriyor.

### Trend Kümesi 2: Native-image ekipleri için JDK ve GraalVM kararları ayrışıyor

JDK 21 üzerinde kalmak ile GraalVM 21 üzerinde kalmak aynı karar değil. [Oracle lisans duyurusu](https://blogs.oracle.com/java/jdk-21-approaches-end-of-permissive-license) GraalVM 21 tarafında da değişim işaret ederken, [Spring Boot 4.1](https://docs.spring.io/spring-boot/system-requirements.html) resmi destekli native yol olarak `GraalVM 25` çizgisini veriyor. Native servis sahipleri bu iki kararı ayrı backlog maddeleri olarak yönetmeli.

### Trend Kümesi 3: Ağustos ortası patch ve release pencereleri üst üste biniyor

`18 Ağustos 2026` Java CSPU ve `20 Ağustos 2026` hedefli Spring Boot / Spring Cloud penceresi birlikte okunmalı. Bu, operasyon için şu anlama geliyor:

- aynı hafta içinde runtime ve framework değişikliği birikebilir
- rollback ve canary planı daha önemli hale gelir
- “uyumlu” ifadesi, “aynı release dalgasında güvenle toplu geçilir” anlamına gelmez

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: runtime lisans, support ve release metadata’sını otomatik yönetime almak
- Kalıcı değer: native-image hattını destekli GraalVM sürümüne sabitlemek
- Kalıcı değer: Java patch’lerini Spring patch’lerinden bağımsız izlenebilir release akışı yapmak
- Düşük öncelik: bugünkü topluluk içerikleri ve genel JVM haberleri, resmi runtime/lisans sinyalinin önüne geçmiyor

## Araçlar ve Kütüphaneler

- [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases): Bugünün en yüksek operasyonel değere sahip aracı. Runtime envanteri, lisans tipi ve security baseline kontrolü için doğrudan kullanılmalı.
- [Oracle javaVersions API](https://java.oraclecloud.com/javaVersions): Destek bitiş tarihlerini ve LTS durumunu otomatik değerlendirmek için uygun.
- [Spring Boot 4.1 system requirements](https://docs.spring.io/spring-boot/system-requirements.html): Java/GraalVM sınırlarını resmi olarak sabitleyen temel referans.
- [Spring Cloud 2025.1.3 milestone](https://github.com/spring-cloud/spring-cloud-release/milestones): Yaklaşan patch penceresi için release readiness göstergesi.
- Düşük öncelik: [Hardwood 1.0](https://www.morling.dev/blog/hardwood-1-0-fast-lightweight-apache-parquet-reader-for-the-jvm/) veri-ağırlıklı JVM servisleri için ilginç; ama tipik Spring backend ekiplerinde bugün lisans ve patch yönetişiminin önüne geçmiyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Her servis için `jdk vendor`, `jdk version`, `license model`, `image build path`, `native-image yes/no`, `base image source`, `patch owner` alanlarını içeren gerçek bir runtime matrisi çıkarın.
- Oracle JDK 21 kullanan prod servisleri üçe ayırın: `subscription/OCI istisnalı`, `ücretsiz kullanım varsayımıyla giden`, `taşınabilir vendor kararına açık`.
- Native-image kullanan Boot 4.x servislerinde `GraalVM 25` pilotunu şimdi açın; `GraalVM for JDK 21` hattını sonbahara bırakmayın.
- `currentJavaReleases` verisini CI/CD veya günlük envanter job’ına bağlayın; en azından kullanılan JDK major’ı, son security release’i ve lisans tipini raporlayın.
- `18 Ağustos 2026` Java CSPU ile `20 Ağustos 2026` Spring patch dalgasını aynı canary’de toplamayın; mümkünse önce runtime, sonra framework veya tersi olacak biçimde tek değişkenli rollout planlayın.
- Boot 3.x hattında kalan ekipler, kendi kullandıkları minor hattın Java 25 ve native-image gereksinimlerini ayrıca doğrulamalı. [Boot 4.1 system requirements](https://docs.spring.io/spring-boot/system-requirements.html) 4.x için nettir; 3.x için otomatik varsayım yapılmamalı.

## Fırsatlar ve Riskler

- Fırsat: runtime envanterini manuel tablo yerine API tabanlı policy-as-code işine dönüştürmek
- Fırsat: JDK 25 ve GraalVM 25 hattına geçerek hem lisans belirsizliğini hem native toolchain drift’ini azaltmak
- Fırsat: Java CSPU için ayrı smoke test hattı kurup framework release günlerinden bağımsız güvenlik yenilemesi yapabilmek
- Risk: Oracle JDK 21 üzerinde “sonra bakarız” yaklaşımıyla Ekim 2026’da lisans/compliance sürprizi yaşamak
- Risk: `Java 26 uyumlu` bilgisini yanlış okuyup kısa ömürlü non-LTS hattı kalıcı çözüm sanmak
- Risk: runtime vendor değişikliği, JDK yükseltmesi, Boot patch’i ve Cloud patch’ini aynı bakım penceresinde birleştirip regresyon yüzeyini büyütmek
- Risk: runtime borcunun yanına eski Spring destek hattı borcu eklemek; [Spring Framework wiki’sinin](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Versions) gösterdiği gibi `6.2.x` OSS desteği Haziran 2026’da bittiği için bazı ekiplerde ticari destek baskısı iki taraftan birikebilir

## İzlenmesi Gereken Konular

- [18 Ağustos 2026 Java CSPU](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) içeriği ve hangi major hatlara nasıl dağıtılacağı
- [Spring Boot 4.1.1](https://github.com/spring-projects/spring-boot/milestones), [4.0.8](https://github.com/spring-projects/spring-boot/milestones) ve [4.2.0-M1](https://github.com/spring-projects/spring-boot/milestones) gerçek release notları
- [Spring Cloud 2025.1.3](https://github.com/spring-cloud/spring-cloud-release/milestones) için fiili yayın ve Cloud bileşen fix seviyeleri
- Oracle’ın `Ekim 2026 CPU` öncesinde aylık update temposu hakkında ek yönlendirmeleri
- Native-image kullanan servislerde GraalVM 25 geçişinin build time, startup, image size ve CVE patch temposu üzerindeki yan etkileri

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Oracle JDK 21 ve GraalVM 21 için ücretsiz güncelleme varsayımı sonbaharda değişiyor
- `source`: [Oracle JDK 21 lisans duyurusu](https://blogs.oracle.com/java/jdk-21-approaches-end-of-permissive-license) | [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases)
- `author`: Donald Smith
- `date`: 14 Ağustos 2026
- `category`: `runtime-distribution`, `licensing`, `native-image`
- `tags`: `jdk-21`, `graalvm-21`, `nftc`, `otn`, `october-2026`, `compliance`
- `summary`: Oracle JDK 21 güncellemeleri `Eylül 2026` sonuna kadar `NFTC`; `Ekim 2026 CPU` ile yeni JDK 21 güncellemeleri `OTN` lisansına geçecek şekilde planlanıyor. Aynı tarihte GraalVM for JDK 21 güncellemeleri de lisans değişimine giriyor.
- `why_it_matters`: Bu, sadece mali veya hukuki dipnot değil; güncel ve güvenli JDK üzerinde kalma stratejisinin yeniden yazılması demek.
- `java_spring_relevance`: Uzun ömürlü Spring Boot servisleri, OCI dışı Oracle JDK 21 kullanıcıları ve native-image hattı olan ekipler doğrudan etkilenir.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: JDK vendor ve lisans politikasını standardize etmek; native-image hattını destekli sürüme taşımak
- `risks`: Ekim 2026’da beklenmedik lisans/compliance baskısı; GraalVM 21 üzerinde sessiz toolchain borcu
- `migration_notes`: Oracle JDK 21 kullanan iş yükleri istisna koşullarına göre sınıflandırılmalı; `JDK 25`, `Oracle OpenJDK` veya ticari Oracle hattı için karar son çeyreğe bırakılmamalı

### Bulgu 2

- `title`: Aylık Java CSPU temposu, Spring release engineering varsayımlarını değiştiriyor
- `source`: [Oracle CSPU duyurusu](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) | [dev.java news](https://dev.java/news/)
- `author`: Donald Smith
- `date`: 31 Temmuz 2026
- `category`: `security-operations`, `release-engineering`, `platform-governance`
- `tags`: `cspu`, `monthly-patching`, `august-18-2026`, `security-baseline`, `container-images`
- `summary`: Oracle, `18 Ağustos 2026` için ek Java CSPU hedefliyor ve `2027` içinde daha sık, çoklu aylık update temposu beklendiğini söylüyor.
- `why_it_matters`: JVM patch’i artık framework patch’iyle aynı üç aylık ritimde yönetilemez; daha sık runtime rebuild/test/deploy gerekecek.
- `java_spring_relevance`: Spring uygulamalarını container içinde paketleyen, buildpack kullanan veya base image pinleyen tüm ekipleri etkiler.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: ayrı bir `runtime security refresh` pipeline kurmak; JDK patch smoke testlerini otomatikleştirmek
- `risks`: patch borcunun birikmesi; framework ve runtime değişikliklerinin tek release’te karışması
- `migration_notes`: JDK yenilemesi için framework upgrade’den bağımsız, rollback’li ve hızlı çalışan bir test zinciri hazırlanmalı

### Bulgu 3

- `title`: Oracle release API'leri runtime politikasını kodlamak için yeterli olgunlukta
- `source`: [Oracle Java Releases Public APIs](https://blogs.oracle.com/java/oracle-java-releases-public-apis) | [currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) | [javaVersions](https://java.oraclecloud.com/javaVersions)
- `author`: Sanju Nair
- `date`: 6 Ağustos 2024 duyurusu, 15 Ağustos 2026 doğrulaması
- `category`: `platform-automation`, `compliance`, `developer-productivity`
- `tags`: `currentjavareleases`, `javaversions`, `policy-as-code`, `inventory`, `support-eol`
- `summary`: Oracle’ın açık API’leri sürüm, lisans, security status ve end-of-support verilerini canlı sunuyor; bugünkü veri `17=OTN`, `21=NFTC`, `25=NFTC`, `26=non-LTS` ayrımını makinece okunabilir kılıyor.
- `why_it_matters`: Runtime kararlarını wiki sayfası, spreadsheet veya sözlü bilgiyle değil otomatik kontrolle yönetmek artık mümkün.
- `java_spring_relevance`: Çok sayıda Spring servisini merkezi platformla yöneten ekiplerde en yüksek karşılığı bulur.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: deployment öncesi JDK policy check, nightly inventory raporu, güvenlik baseline dashboard’u
- `risks`: manuel takip yüzünden vendor/lisans/sürüm tutarsızlığının görünmemesi
- `migration_notes`: API verisi imaj metadata’sı, SBOM veya environment inventory ile birleştirilmeli; `Java 26` kısa ömürlü olduğundan kalıcı lane gibi işaretlenmemeli

### Bulgu 4

- `title`: Spring Boot 4.1 resmi JDK 25/GraalVM 25 zeminini veriyor; ama gelecek hafta çoklu değişiklik penceresi yaratıyor
- `source`: [Spring Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html) | [Spring Boot milestones](https://github.com/spring-projects/spring-boot/milestones) | [Spring Cloud milestones](https://github.com/spring-cloud/spring-cloud-release/milestones) | [Spring Framework supported versions](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Versions)
- `author`: Spring team, Andy Wilkinson, Ryan Baxter ve Spring maintainers
- `date`: 15 Ağustos 2026 doğrulaması
- `category`: `compatibility`, `release-planning`, `native-image`, `spring-platform`
- `tags`: `spring-boot-4.1`, `java-26`, `graalvm-25`, `spring-framework-7.0.x`, `spring-cloud-2025.1.3`, `boot-4.1.1`, `boot-4.0.8`, `boot-4.2.0-m1`
- `summary`: Spring Boot 4.1, Java 17 minimumu, Java 26 uyumluluğu ve GraalVM 25 desteği veriyor. Aynı anda Boot `4.1.1`, `4.0.8`, `4.2.0-M1` ve Cloud `2025.1.3` Ağustos sonu penceresine sıkışmış durumda.
- `why_it_matters`: Teknik geçiş yolu açık; ama release yoğunluğu yüzünden hangi değişkenin neyi bozduğunu ayırmak zorlaşacak.
- `java_spring_relevance`: Boot/Cloud tabanlı mikroservis platformları için doğrudan yol haritası etkisi var.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: JDK 25 ve GraalVM 25 pilotunu resmi destekli zeminde yapmak; Boot patch ile uyumluluğu canary’de erken görmek
- `risks`: runtime vendor değişimi ile framework patch’ini aynı anda geçirip hata ayıklama maliyetini büyütmek
- `migration_notes`: rollout planında tekil değişken yaklaşımı tercih edilmeli; native servislerde önce toolchain, sonra framework patch veya tersi biçiminde ayrıştırılmış geçiş yapılmalı

## Sonuç

15 Ağustos 2026 itibarıyla Java/Spring ekipleri için asıl gündem yeni bir framework özelliği değil; `runtime dağıtımı, lisans modeli ve patch temposu`nun yazılı platform politikasına dönüşmesi. Oracle JDK 21’in `NFTC` penceresi `Eylül 2026` sonunda kapanırken, `18 Ağustos 2026` Java CSPU ve `20 Ağustos 2026` Spring release penceresi çok yakın.

En doğru kısa vadeli hareket, Oracle JDK 21 ve GraalVM 21 kullanan prod iş yüklerini envanterlemek, `currentJavaReleases` verisini otomatik rapora bağlamak ve Spring Boot 4.x/native hatlarında `JDK 25 + GraalVM 25` pilotunu ayrı bir rollout olarak başlatmak. Bugünün kalıcı mühendislik değeri burada; geri kalan sinyaller bunu destekleyen ikincil gürültü seviyesinde.
