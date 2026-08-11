# Günlük Java / Spring Ekosistem Raporu

Tarih: 11 Ağustos 2026 Salı  
Tarama zamanı: 11 Ağustos 2026 09:06 TSİ  
Odak: JDK taban seçiminin üç hatlı yönetime dönüşmesi; Spring 7 için `JDK 25` üretim tabanı, `JDK 26` doğrulama hattı, `JDK 27 EA` keşif hattı

Tarama notu: 11 Ağustos 2026 09:06 TSİ itibarıyla [Spring Blog](https://spring.io/blog), [Spring release sayfaları](https://spring.io/blog/category/releases), [Spring proje sayfaları](https://spring.io/projects/), [Spring Boot Supported Versions wiki](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions), [Spring Framework Supported Versions wiki](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Versions), [Spring Boot 4.1.1 milestone](https://github.com/spring-projects/spring-boot/milestone/425), [Spring Boot 4.2.0-M1 milestone](https://github.com/spring-projects/spring-boot/milestone/429), [OpenJDK JEP 401](https://openjdk.org/jeps/401), [OpenJDK JEP 535](https://openjdk.org/jeps/535), [jdk.java.net](https://jdk.java.net/), [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases), [Oracle Java security cadence yazısı](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/news/), [Baeldung Java Weekly 658](https://www.baeldung.com/java-weekly-658), Josh Long’un [This Week in Spring - August 4th, 2026](https://spring.io/blog/2026/08/04/this-week-in-spring-august-4-2026/) ve [Gregory Green bölümü](https://spring.io/blog/2026/08/06/a-bootiful-podcast-gregory-green/), Gunnar Morling’in kamusal yazıları ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) kontrol edildi. Bugünün güçlü sinyali yeni bir GA duyurusu değil; Spring tarafında JDK 25 merkezli üretim çizgisinin netleşmesi ve 18-20 Ağustos 2026 arasında JVM ile Spring patch akışlarının üst üste binmesi. Gunnar Morling’in son içerikleri şu an daha çok Parquet/Hardwood ekseninde; Baeldung ve Burak KUTBAY tarafında ise yararlı içerik var ama bugünün ana kararını değiştiren yeni bir ekosistem sinyali yok.

## Öne Çıkan Başlıklar

- Spring Framework 7 wiki yüzeyi, üretim hattını açık biçimde `7.0.x` olarak konumluyor ve `JDK 25 veya üzerini` öneriyor; bu, Spring 7 kullanan ekipler için `JDK 21 varsayılanı` alışkanlığını sorgulatıyor.
- Oracle’ın resmi Java yayın API’si 11 Ağustos 2026 itibarıyla `JDK 25.0.4 LTS` ve `JDK 26.0.2` çizgisini güncel gösteriyor; aynı zamanda Oracle, `18 Ağustos 2026` için ek bir Java güvenlik güncellemesi hedeflediğini duyurdu.
- Spring Boot `4.1.1` milestone’u `20 Ağustos 2026` tarihine ayarlı ve `Spring Framework 7.0.9`, `Spring Security 7.1.1`, `Spring Kafka 4.1.1`, `Spring Batch 6.0.5`, `Spring gRPC 1.1.1` gibi toplu patch yükseltmelerini içeriyor.
- Aynı gün hedeflenen `Spring Boot 4.2.0-M1`, `Spring Framework 7.1.0-M1`, `Reactor 2026.0.0-M1`, `Micrometer 1.18.0-M1`, `Spring Data 2026.1.0-M1` gibi bir sonraki minor hattın erken sinyalini veriyor.
- Regülasyonlu ortamlar için ayrı bir gerilim oluşuyor: [Oracle Jipher 10.37](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java), GraalVM for JDK 17/21 için planlanan son FIPS güncellemesi olduğunu söylüyor ve bu ekipleri Oracle JDK geçişine itiyor.

## Kritik Güncellemeler

### 1. Spring 7 artık fiilen `JDK 25+` üretim söylemine oturuyor

[Spring Framework Supported Versions wiki](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Versions), `7.0.x` hattını mevcut üretim çizgisi, `7.1.x` hattını ise `Kasım 2026` için gelecek feature branch olarak tanımlıyor. Aynı sayfa `Spring Framework 7.x` için `JDK 17-25+` aralığını veriyor ve üretim için `JDK 25 veya üzerini` öneriyor.

Bu kritik çünkü:

- Spring 7 kullanan ekipler için `JDK 21 yeterince yeni` yaklaşımı artık varsayılan mühendislik kararı olmamalı
- base image, JVM tuning, APM ajanı, container sertifikasyonu ve benchmark tabanı `25` etrafında yeniden düşünülmeli

### 2. Java güvenlik ritmi, Spring patch ritmiyle aynı haftaya sıkışıyor

[Oracle Java blogundaki resmi duyuru](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates), Java güvenlik güncellemelerini çeyreklik CPU ritminden daha sık bir akışa taşıma hedefini açıklıyor ve `18 Ağustos 2026` için ek bir Java CSPU planlandığını söylüyor. [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases) ise 11 Ağustos 2026 itibarıyla `25.0.4 LTS`, `21.0.12`, `17.0.20` ve `26.0.2` sürümlerini güncel gösteriyor.

Bu önemli çünkü:

- JDK patching artık çeyrekte bir yapılan platform işi olmaktan çıkıyor
- Spring ekipleri için JDK ve framework upgrade akışları ayrı sprintlere dağıtılamayabilir

### 3. Spring Boot 4.1.1 tekil bugfix değil, koordineli platform patch paketi gibi görünüyor

[Spring Boot 4.1.1 milestone’u](https://github.com/spring-projects/spring-boot/milestone/425), `20 Ağustos 2026` için planlanmış durumda ve açık iş listesinde `Spring Framework 7.0.9`, `Spring Security 7.1.1`, `Spring Integration 7.1.1`, `Spring Kafka 4.1.1`, `Spring AMQP 4.1.1`, `Spring Batch 6.0.5`, `Spring Session 4.1.1`, `Spring Pulsar 2.0.7`, `Spring gRPC 1.1.1`, `Micrometer 1.17.1`, `Micrometer Tracing 1.7.1` ve `Reactor Bom 2025.0.7` yükseltmelerini içeriyor.

Bu Java/Spring ekipleri için şunu söylüyor:

- yaklaşan patch dalgası sadece `Boot patch alalım` seviyesinde ele alınmamalı
- auth, metrics, messaging, tracing ve RPC yüzeyleri aynı anda yeniden test edilmeli

### 4. Spring Boot 4.2.0-M1, sonbahar minor hattının yönünü şimdiden açığa çıkarıyor

[Spring Boot 4.2.0-M1 milestone’u](https://github.com/spring-projects/spring-boot/milestone/429) da `20 Ağustos 2026` tarihini hedefliyor. Açık işlerde `Spring Framework 7.1.0-M1`, `Reactor 2026.0.0-M1`, `Micrometer 1.18.0-M1`, `Micrometer Tracing 1.8.0-M1`, `Spring Data Bom 2026.1.0-M1`, `Spring Integration 7.2.0-M1`, `Spring Kafka 4.2.0-M1`, `Spring Batch 6.1.0-M1` ve `Spring AMQP 4.2.0-M1` yükseltmeleri bulunuyor.

Buradaki güçlü sinyal:

- platform ekipleri için `sadece mevcut patch hattı` değil, bir sonraki minor kırılımı da aynı anda görünür hale geliyor
- internal starter, auto-configuration ve gözlemlenebilirlik katmanları için erkenden scout lane açmak mantıklı hale geliyor

### 5. Regülasyonlu Java dağıtımları için GraalVM/FIPS yolu daralıyor

[Oracle Jipher 10.37 duyurusu](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java), bu sürümün `CVE-2026-42770` düzeltmesini taşıdığını, ek FIPS 140-3 kısıtları getirdiğini ve `GraalVM for JDK 17` ile `GraalVM for JDK 21` desteği sunan planlı son güncelleme olduğunu belirtiyor. Oracle, FIPS sertifikalı iş yüklerinde müşterilerin Oracle JDK’ya geçmesini öneriyor.

Bu önemli çünkü:

- native-image veya GraalVM tabanlı regülasyonlu servisler için yol haritası tekrar açılmalı
- Spring Native veya GraalVM tabanlı dağıtımlarda `uzun vadede bu kombinasyonu sürdürebilir miyiz?` sorusu artık teorik değil

## Trendler ve Sinyaller

### Trend Kümesi 1: JDK seçimi artık kurulum tercihi değil, ürünleştirilmiş platform politikası

[Spring Framework wiki](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Versions), [Oracle Java yayın API’si](https://java.oraclecloud.com/currentJavaReleases) ve [jdk.java.net](https://jdk.java.net/) birlikte okunduğunda üç katmanlı bir tablo çıkıyor:

- üretim hattı için `JDK 25`
- kısa vadeli validasyon ve benchmark için `JDK 26`
- erken uyumluluk keşfi için `JDK 27 EA`

Bu kalıcı değer taşıyor; çünkü sürüm seçimi artık sadece dil özelliği değil, güvenlik ritmi, destek seviyesi ve framework test kapsamı kararı.

### Trend Kümesi 2: Ağustos ortası, JVM ve Spring için birleşik patch penceresine dönüşüyor

[Oracle CSPU planı](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) ile [Spring Boot 4.1.1 milestone’u](https://github.com/spring-projects/spring-boot/milestone/425) aynı haftaya bakıyor. Bu, özellikle platform takımı olan organizasyonlar için tek bir `release rehearsal` akışını daha mantıklı hale getiriyor.

Bu kısa vadeli gürültü değil; otomasyon, test matrisi ve rollback tasarımı üzerinde kalıcı etkisi var.

### Trend Kümesi 3: Patch hattı ile minor scout hattı birlikte yaşatılmalı

[Spring Boot 4.1.1](https://github.com/spring-projects/spring-boot/milestone/425) ve [4.2.0-M1](https://github.com/spring-projects/spring-boot/milestone/429) aynı güne hedeflenmiş durumda. Bu da olgun organizasyonların iki ayrı akış işletmesini gerektiriyor:

- `stabil patch hattı`: mevcut üretim uygulamalarını güvenli biçimde güncellemek
- `scout hattı`: sonbahar minor değişikliklerini erkenden CI’da yakalamak

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: Spring 7 kullanan servislerde `JDK 25` tabanını standartlaştırmak
- Kalıcı değer: `18-20 Ağustos 2026` haftası için birleşik JDK + Spring patch provası yapmak
- Kalıcı değer: `4.2.0-M1 + JDK 27 EA` için yalnızca CI/canary scout hattı açmak
- Düşük öncelik: [JEP 401](https://openjdk.org/jeps/401) ve [JEP 535](https://openjdk.org/jeps/535) bugünden prod backlog’una almak
- Düşük öncelik: Baeldung/InfoQ’daki genel haftalık toparlamaları yeni mühendislik sinyali gibi yorumlamak

## Araçlar ve Kütüphaneler

- [Oracle Java Releases API](https://java.oraclecloud.com/currentJavaReleases): runtime envanterini ve security baseline takibini otomasyona bağlamak için pratik resmi yüzey.
- [Spring Boot 4.1.1 milestone](https://github.com/spring-projects/spring-boot/milestone/425): patch dalgasında hangi bağımlılıkların birlikte hareket ettiğini şimdiden gösteriyor.
- [Spring Boot 4.2.0-M1 milestone](https://github.com/spring-projects/spring-boot/milestone/429): internal platform ekipleri için erken uyumluluk radarına dönüşmüş durumda.
- [Oracle Jipher 10.37](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java): FIPS iş yüklerinde JDK ve dağıtım stratejisini doğrudan etkiliyor.
- [JEP 401](https://openjdk.org/jeps/401) ve [JEP 535](https://openjdk.org/jeps/535): bugünün hemen uygulanacak araçları değil; ancak JVM kimlik semantiği ve GC varsayılanları açısından izlenmesi gereken resmi platform sinyalleri.

Bugün yeni “hemen alıp entegre edin” seviyesinde öne çıkan bir OSS araç yok. Asıl değer yeni kütüphane ismi değil, release ve runtime yönetimini daha disiplinli hale getirmekte.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Framework 7 veya Spring Boot 4.x kullanan servisler için resmi bir JDK politikası yazın: `prod=25`, `validation=26`, `scout=27-ea`.
- `18 Ağustos 2026` Oracle Java CSPU ile `20 Ağustos 2026` Spring Boot patch/milestone penceresini tek bir değişiklik takvimi gibi planlayın.
- `4.1.1` geldiğinde sadece Boot versiyonunu değil, `Security`, `Kafka`, `AMQP`, `Session`, `Tracing`, `Micrometer`, `gRPC` kombinasyonlarını da smoke-test edin.
- Internal starter veya platform BOM sahibiyseniz `4.2.0-M1` hattını prod’a taşımayın; fakat CI’da açıp deprecation ve uyumluluk sorunlarını erkenden toplayın.
- FIPS veya regülasyonlu native iş yükleriniz varsa `Jipher 10.37` notlarını okuyup GraalVM bağımlılığını açık backlog maddesine çevirin.

## Fırsatlar ve Riskler

- Fırsat: JDK 25’i ortak üretim tabanı yaparak performans, test ve destek politikasını sadeleştirmek
- Fırsat: Oracle API ve Spring milestone verisini kullanıp upgrade planlamasını daha öngörülebilir hale getirmek
- Fırsat: `4.2.0-M1` scout hattı sayesinde sonbahar minor sürprizlerini erken yakalamak
- Risk: ekiplerin bir kısmının `21`, bir kısmının `25`, bir kısmının `26` üzerinde kalması ve gözlemlenebilirlik/verim farklarının karışması
- Risk: `4.1.1` patch dalgasını küçük görmek ve `Security` veya `Kafka` davranış değişikliklerini aynı provada test etmemek
- Risk: GraalVM tabanlı FIPS dağıtımlarında Oracle JDK geçişini geç fark etmek
- Risk: JDK patch ritmi sıklaşırken hâlâ çeyreklik değişiklik süreciyle ilerlemeye çalışmak

## İzlenmesi Gereken Konular

- `18 Ağustos 2026`: Oracle Java CSPU içeriği ve bunun `JDK 25`, `21`, `17` hatlarına nasıl yansıyacağı
- `20 Ağustos 2026`: Spring Boot `4.1.1` ve `4.2.0-M1` gerçekten hangi içerikle çıkacak
- `Kasım 2026` yolunda Spring Framework `7.1.x` hattının JDK ve Jakarta beklentilerini daha da sertleştirip sertleştirmeyeceği
- [JEP 401](https://openjdk.org/jeps/401): değer nesneleri preview aşamasına ilerlerken kütüphane ve framework ekosistemindeki yansıması
- [JEP 535](https://openjdk.org/jeps/535): Shenandoah kullanan ekiplerde log, metrik ve servisability davranışı değişiklikleri
- Düşük öncelik: Baeldung Weekly 658’in öne çıkardığı sanal thread içerikleri hâlâ yararlı; ancak bugünün belirleyici kararı değil

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Framework 7 üretim hattı için `JDK 25+` önerisi netleşiyor
- `source`: [Spring Framework Supported Versions](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Versions) | [Spring Framework proje sayfası](https://spring.io/projects/spring-framework/)
- `author`: Spring team
- `date`: 11 Ağustos 2026 itibarıyla güncel wiki/proje yüzeyi
- `category`: platform-governance, runtime-baseline
- `tags`: spring-framework-7, jdk25, support-policy, production-baseline
- `summary`: Spring Framework 7, mevcut üretim hattı olarak konumlanıyor ve üretimde `JDK 25 veya üzeri` önerisini görünür kılıyor.
- `why_it_matters`: JDK seçimi artık framework destek politikasıyla daha sıkı bağlı; sürüm tercihi yalnız ekip alışkanlığına bırakılamaz.
- `java_spring_relevance`: Spring 7 üzerinde çalışan servislerin base image, test matrisi, APM ve performans tabanları doğrudan etkilenir.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: standart üretim tabanı; daha net benchmark; sadeleşen platform politikası
- `risks`: JDK 21 ataleti; ekipler arası parçalanmış runtime kullanımı
- `migration_notes`: `JDK 21` üzerinde kalan Spring 7 servislerini envanterleyin; blokajı olmayanları `25` hattına taşıyacak plan çıkarın.

### Bulgu 2

- `title`: Oracle, Java güvenlik güncellemelerini aylığa yaklaştırıyor
- `source`: [Transitioning Java to More Frequent Security Updates](https://blogs.oracle.com/java/transitioning-java-to-more-frequent-security-updates) | [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases)
- `author`: Oracle Java team
- `date`: 31 Temmuz 2026 duyurusu | 11 Ağustos 2026 itibarıyla geçerli release API verisi
- `category`: security-operations, release-engineering
- `tags`: cspu, jdk25, jdk26, patch-cadence, oracle-java
- `summary`: Oracle, `18 Ağustos 2026` için ek bir Java CSPU planlıyor ve 2027 içinde daha fazla aylık güncelleme öngörüyor; aynı anda `25.0.4 LTS` ve `26.0.2` güncel durumda.
- `why_it_matters`: Java patch yönetimi çeyreklik bakım işinden daha sık tekrarlanan operasyon disiplinine dönüşüyor.
- `java_spring_relevance`: Spring ekiplerinin framework patching ile JDK patching süreçlerini ayrık ele alma lüksü azalıyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: daha kısa güvenlik açığı maruziyeti; daha iyi release otomasyonu
- `risks`: patch yorgunluğu; yetersiz smoke test; eski change-window süreçleri
- `migration_notes`: JDK yayın bilgisini otomatik toplayın; `18-20 Ağustos` haftası için birleşik rollout provası planlayın.

### Bulgu 3

- `title`: Spring Boot 4.1.1, auth-metrics-messaging yüzeylerini birlikte hareket ettiren patch paketi oluyor
- `source`: [Spring Boot 4.1.1 milestone](https://github.com/spring-projects/spring-boot/milestone/425) | [Spring Boot Supported Versions wiki](https://github.com/spring-projects/spring-boot/wiki/Supported-Versions)
- `author`: Spring Boot team
- `date`: 11 Ağustos 2026 itibarıyla açık milestone
- `category`: spring-boot, dependency-governance
- `tags`: spring-boot-4-1-1, spring-security, spring-kafka, micrometer, reactor, spring-batch
- `summary`: `4.1.1`, `20 Ağustos 2026` için planlanmış durumda ve Framework, Security, Kafka, AMQP, Batch, Session, Pulsar, gRPC, Micrometer ve Reactor yükseltmelerini aynı dalgada topluyor.
- `why_it_matters`: patch sürümü küçük görünse de etkilediği yüzey geniş; tek bileşen testi yeterli değil.
- `java_spring_relevance`: özellikle platform katmanı, observability, auth ve messaging ağırlıklı Spring servisleri için doğrudan üretim etkisi var.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: toplu ve kontrollü upgrade; bağımlılık uyumunu tek seferde doğrulama
- `risks`: auth veya broker davranış farklarını gözden kaçırmak; parsiyel testle prod’a çıkmak
- `migration_notes`: smoke test setinize login akışları, Kafka/Rabbit bağlantısı, tracing ve metrics dashboard doğrulamasını ekleyin.

### Bulgu 4

- `title`: Spring Boot 4.2.0-M1, sonbahar minor değişimlerinin erken haritasını veriyor
- `source`: [Spring Boot 4.2.0-M1 milestone](https://github.com/spring-projects/spring-boot/milestone/429) | [Spring projeleri genel görünümü](https://spring.io/projects/)
- `author`: Spring Boot team
- `date`: 11 Ağustos 2026 itibarıyla açık milestone
- `category`: roadmap-signal, platform-evolution
- `tags`: spring-boot-4-2, spring-framework-7-1, reactor-2026, micrometer-1-18, spring-data-2026-1
- `summary`: `4.2.0-M1`, `Framework 7.1.0-M1`, `Reactor 2026.0.0-M1`, `Micrometer 1.18.0-M1`, `Spring Data 2026.1.0-M1`, `Kafka 4.2.0-M1` ve `Batch 6.1.0-M1` gibi erken bağımlılık eşleşmelerini görünür kılıyor.
- `why_it_matters`: internal platform sahipleri minor sürprizleri release gününde değil, milestone aşamasında toplamaya başlayabilir.
- `java_spring_relevance`: custom starter, auto-config, company BOM ve gözlemlenebilirlik eklentileri olan ekipler için yüksek değer taşır.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: erken uyumluluk yakalama; deprecation backlog’unu önceden açma
- `risks`: milestone’yu prod-ready sanmak; gereksiz erken tüketim
- `migration_notes`: prod tüketimi için değil, ayrı CI lane ve canary laboratuvarı için kullanın.

### Bulgu 5

- `title`: JDK 28 hazırlıkları kimlik semantiği ve GC varsayılanlarını değiştirmeye yaklaşıyor
- `source`: [JEP 401](https://openjdk.org/jeps/401) | [JEP 535](https://openjdk.org/jeps/535) | [InfoQ Java roundup](https://www.infoq.com/news/2026/08/java-news-roundup-aug03-2026/)
- `author`: OpenJDK contributors | Michael Redlich
- `date`: JEP 401 güncellemesi 7 Ağustos 2026 | JEP 535 güncellemesi 4 Ağustos 2026 | InfoQ 10 Ağustos 2026
- `category`: jvm-evolution, low-priority-watch
- `tags`: valhalla, value-objects, shenandoah, generational-gc, jdk28
- `summary`: `JEP 401` değer nesnelerini preview olarak `Release 28` için entegre etti; `JEP 535` ise Shenandoah’da generational mode’u varsayılan yapmayı hedefliyor.
- `why_it_matters`: bugün immediate migration konusu değil; ancak kimlik semantiği ve GC varsayılanları zamanla framework ve kütüphane beklentilerini etkileyebilir.
- `java_spring_relevance`: ORM, cache, serialization, proxy ve latency tuning yapan ileri seviye Spring/JVM ekipleri için izlemeye değer.
- `actionability`: `izleme`
- `impact_level`: `orta`
- `opportunities`: bellek yerelliği ve throughput kazanımları; daha belirgin immutable model
- `risks`: yanlış erken genelleme; preview özellikleri üretim yol haritasına erken sokmak
- `migration_notes`: yalnız araştırma hattında takip edin; prod policy’ye girmesi için daha erken.

### Bulgu 6

- `title`: Oracle Jipher 10.37, FIPS iş yüklerinde GraalVM’den Oracle JDK’ya yönelimi hızlandırıyor
- `source`: [Oracle Jipher 10.37 duyurusu](https://blogs.oracle.com/java/announcing-oracle-jipher-10-36-fips-140-3-cryptography-for-java)
- `author`: Poonam Parhar
- `date`: 3 Ağustos 2026
- `category`: security-compliance, runtime-distribution
- `tags`: jipher, fips-140-3, graalvm, oracle-jdk, cve-2026-42770
- `summary`: Jipher 10.37, FIPS modül güncellemesi ve yeni kısıtlar getiriyor; ayrıca GraalVM for JDK 17/21 destekli planlı son sürüm olduğunu söylüyor.
- `why_it_matters`: regülasyonlu iş yüklerinde runtime tercihi artık yalnız performans değil, sertifikasyon sürdürülebilirliği konusu.
- `java_spring_relevance`: Spring tabanlı native-image veya GraalVM dağıtımları kullanan güvenlik hassas servislerde doğrudan etkili.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: sertifikalı Oracle JDK yoluna daha net geçiş planı; daha açık compliance sınırı
- `risks`: geç fark edilen göç maliyeti; native dağıtım stratejisinin yeniden yazılması
- `migration_notes`: FIPS gerektiren servisleri ayırın; GraalVM bağımlılığı olanları Oracle JDK hedefli ayrı çalışma akışına alın.

## Sonuç

11 Ağustos 2026 için en önemli Java / Spring sinyali yeni bir özellik değil, taban seçim ve patch yönetim disiplinidir. Spring 7 tarafı üretimde `JDK 25+` yönünü netleştirirken Oracle Java tarafı güvenlik ritmini sıklaştırıyor; aynı anda Spring Boot `4.1.1` ve `4.2.0-M1` hatları `20 Ağustos 2026` penceresinde görünür durumda. Bu nedenle doğru teknik karar, tek bir “upgrade zamanı gelince bakarız” yaklaşımı değil; `prod=25`, `validation=26`, `scout=27-ea` şeklinde net runtime politikası yazmak, `18-20 Ağustos` haftasını birleşik patch provası olarak ele almak ve regülasyonlu dağıtımlarda GraalVM/FIPS yolunu ayrıca gözden geçirmek olmalı.
