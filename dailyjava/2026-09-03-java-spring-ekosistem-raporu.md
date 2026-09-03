# Gunluk Java / Spring Ekosistem Raporu

Tarih: 03 Eylul 2026 Persembe  
Tarama zamani: 03 Eylul 2026 09:05 TSI  
Tekrar etmeme filtresi: 02 Eylul'deki `JDK + Spring patch cadence tek backlog` anlatisi; 16 Agustos `Spring AI/MCP contract governance`, 15 Agustos `runtime licensing/CSPU`, 14 Agustos `gateway/gRPC policy`, 13 Agustos `support matrix` ve 12 Agustos `editor/LSP guardrail` eksenleri bugunun ana temasi olarak dislandi.  
Odak: OpenJDK `JDK 27` artik release-candidate asamasinda; fakat [Spring Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html) 03 Eylul 2026 itibariyla resmi uyumu `Java 26` ile sinirli gosteriyor. Bu nedenle Java/Spring ekipleri JDK 27'ye kosmak yerine, destekli `JDK 26` lane'inde `final field mutation`, TLS named-group override, JSON thread-dump parser ve GC default varsayimlarini audit edip; `JDK 27 RC`yi ayri bir scout lane olarak kullanmali.

Tarama notu: 03 Eylul 2026 09:05 TSI itibariyla [Spring release sayfasi](https://spring.io/blog/category/releases), [Spring Projects](https://spring.io/projects), [Spring Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html), [Spring Boot 4.1.1](https://spring.io/blog/2026/08/20/spring-boot-4-1-1-available-now), [Spring Boot 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-boot-4-2-0-M1-available-now), [Spring Modulith 2.2 M1, 2.1.1, 2.0.8, and 1.4.13](https://spring.io/blog/2026/08/26/spring-modulith-2-2-m1-2-1-1-2-0-8-and-1-4-13-released), [Spring AMQP 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-amqp-4-2-0-m1-available), [Spring Integration 7.2.0-M1](https://spring.io/blog/2026/08/20/spring-integration-7-2-0-m1-released), [This Week in Spring - September 1st, 2026](https://spring.io/blog/2026/09/01/this-week-in-spring-september-1-2026), [OpenJDK JDK 27 Release-Candidate Builds](https://jdk.java.net/27/), [JEP 500](https://openjdk.org/jeps/500), [JEP 523](https://openjdk.org/jeps/523), [JEP 527](https://openjdk.org/jeps/527), [JEP 533](https://openjdk.org/jeps/533), [Inside Java heads-up list](https://inside.java/headsup/), [Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/), [JDK 27: Post-Quantum Hybrid Key Exchange for TLS 1.3](https://inside.java/2026/05/17/quality-heads-up/), [JDK 27: Numeric Fields in JSON Thread Dumps](https://inside.java/2026/05/20/quality-heads-up/), [JDK 27: Default G1 in All Environments](https://inside.java/2026/07/20/quality-heads-up/), [Oracle Java Releases API](https://java.oraclecloud.com/javaReleases?format=json) ve [InfoQ Java News Roundup - May 4, 2026](https://www.infoq.com/news/2026/05/java-news-roundup-may04-2026/) tarandi. [Gunnar Morling blogu](https://www.morling.dev/blog/) uzerindeki 31 Agustos 2026 tarihli Hardwood 1.1.0.Beta1 yazisi ile [Burak KUTBAY blogu](https://blog.burakkutbay.com/) uzerindeki Temmuz 2026 Spring/Java yazilari kontrol edildi; bugunun Spring backend kararlarini daha yuksek oncelikte degistiren yeni bir sinyal uretmediler.

## One Cikan Basliklar

- `JDK 27` icin release-candidate build'ler 20 Agustos 2026 tarihli `build 35` ile acik; artik "cok erken" mazereti kalmadi.
- Spring Boot `4.1.1` resmi olarak `Java 17` minimumunu koruyor ve uyumlulugu `Java 26`ya kadar yaziyor; 03 Eylul 2026 itibariyla `Java 27` icin ayni resmi ifade yok.
- `JEP 500` nedeniyle refleksiyonla `final field` mutasyonu bugunden sayilabilir bir teknik borca donustu; Spring ekipleri bunu JDK 26 uzerinde audit edebilir.
- `JDK 27`, TLS tarafinda hibrit post-quantum key exchange, thread dump tarafinda `formatVersion: 2` ve sayisal alanlar, GC tarafinda ise her ortamda `G1` default'u ile geliyor.
- Spring'in `4.2`/`7.2`/`2.2` milestone hattinda acilan yeni dalga, bu degisiklikleri test etmek icin dogal bir compatibility lane sunuyor; production default'u sunmuyor.

## Kritik Guncellemeler

### 1. JDK 27 artik release-candidate asamasinda; readiness isi ertelenmemeli

[OpenJDK JDK 27 Release-Candidate Builds](https://jdk.java.net/27/) sayfasi, 03 Eylul 2026 itibariyla `build 35 (2026/8/20)` bilgisini gosteriyor. Bu, JDK 27'nin soyut bir yol haritasi maddesi olmaktan ciktigini; gercek CI ve smoke-test lane'ine alinabilecek kadar somutlastigini gosteriyor.

Ancak ayni anda [Spring Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html) `4.1.1` icin resmi uyumlulugu "Java 26'ya kadar" sinirliyor. Yani dogru hareket `Boot 4.1.1 + JDK 27 RC` kombinasyonunu production baseline gibi sunmak degil; JDK 26'da destekli audit lane, JDK 27 RC'de ayri scout lane kurmak.

### 2. Final field mutation artik gelecek problemi degil; bugunun audit konusu

[JEP 500](https://openjdk.org/jeps/500) JDK 26 ile teslim edilmis durumda. JEP'in pratik anlami su:

- illegal reflektif `final field` yazimlari bugunden warning uretiyor
- `--illegal-final-field-mutation=debug` ile stack trace alinabiliyor
- JFR acikken `jdk.FinalFieldMutation` eventi uretiliyor
- ileride default davranis `deny` moduna yaklasiyor

[Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/) yazisi bunu daha operasyonel hale getiriyor: dependency injection, deserialization, cloning ve test/mocking kodu bu borcu tasiyabiliyor; constructor injection ise dogru cikis. Bu Spring ekipleri icin iyi haber, cunku Spring dunyasi zaten constructor injection'a dogru evrilmis durumda. Kotusu ise kurum ici serializer, test fixture, reflection helper ve eski field injection kodlari hala sessiz risk olabilir.

### 3. TLS named-group override'lari JDK 27'nin post-quantum faydasini sessizce kapatabilir

[JEP 527](https://openjdk.org/jeps/527) ve [Inside Java heads-up](https://inside.java/2026/05/17/quality-heads-up/) JDK 27 EA/RC build'lerinde hibrit TLS 1.3 key exchange'in entegre oldugunu soyluyor. `javax.net.ssl` kullanan uygulamalar varsayilan olarak bundan yararlanabiliyor. Fakat ayni heads-up'in kritik notu su: eger ekip `TLS named groups` listesini override ediyorsa bu faydayi kaybedebilir.

Spring tarafinda bunun etkisi yalnizca "raw TLS" degil:

- `RestClient` ve `WebClient` ile giden servis-cagrilari
- Gateway uzerinden servis-iletisimi
- broker/client baglantilari
- outbound allow-list ve proxy policy'leri

Bu nedenle `jdk.tls.namedGroups`, custom SSL parameter ve platform image icindeki TLS policy dosyalari ayri bir diff kontrolune girmeli.

### 4. JSON thread dump format degisimi operasyonda sessiz kirilma riski tasiyor

[JDK 27: Numeric Fields in JSON Thread Dumps](https://inside.java/2026/05/20/quality-heads-up/) yazisina gore `HotSpotDiagnosticMXBean.dumpThreads` ve `jcmd Thread.dump_to_file -format=json` artik `processId`, `tid` ve `threadCount` alanlarini string degil sayi olarak yaziyor; ustune bir de `formatVersion: 2` geliyor.

Bu, tipik Spring servisinde dogrudan kod degisikligi istemeyebilir. Ama:

- incident sirasinda thread dump parse eden script'ler
- observability pipeline'indaki JSON donusumleri
- SRE tarafindaki jq/regex tabanli araclar
- custom support tooling

icinde sessiz bozulma yaratabilir.

### 5. Default GC varsayimi kucuk container'larda degisiyor

[JEP 523](https://openjdk.org/jeps/523) ve [Inside Java: Default G1 in All Environments](https://inside.java/2026/07/20/quality-heads-up/) JDK 27 ile HotSpot'un her ortamda varsayilan olarak `G1` sececegini belirtiyor. Daha once tek CPU veya dusuk bellek gibi dar kosullarda `Serial GC` secilebiliyordu.

Bu degisiklik yalnizca su kosullarda etkili:

- uygulama GC secimini explicit yapmiyorsa
- kaynak kisitli ortamda calisiyorsa

Spring batch worker, sidecar benzeri yardimci servis, kucuk consumer pod'u veya kisa omurlu utility uygulamalar bu davranis farkini hissedebilir. Latency acisindan faydali olabilir; throughput ve footprint tarafinda ise benchmark gerektirir.

### 6. Spring'in sonraki minor hattinda degisen teknik yon belli, ama destek siniri hala net cizilmeli

[Spring Boot 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-boot-4-2-0-M1-available-now) `AMQP 1.0` ve `Image-Based Build Cache Support for Buildpacks` ile bir sonraki minor backlog'unu gostermis durumda. [Spring Modulith 2.2 M1](https://spring.io/blog/2026/08/26/spring-modulith-2-2-m1-2-1-1-2-0-8-and-1-4-13-released) acikca `Boot 4.2 M1` ve `Framework 7.1 M1` tabanina geciyor. [Spring AMQP 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-amqp-4-2-0-m1-available) `RestTemplateNodeLocator` yerine `RestClientNodeLocator`a geciyor ve SSL hostname verification'i fiilen zorunlu hale getiriyor. [Spring Integration 7.2.0-M1](https://spring.io/blog/2026/08/20/spring-integration-7-2-0-m1-released) ise `RestTemplate` tabanli HTTP outbound konfigurasyonlarini deprecated ediyor.

Buradaki kalici sinyal su: sonraki Spring hattina gecis yalnizca version bump degil; runtime, HTTP client ve delivery pipeline default'larinin sertlestigi bir modernizasyon.

## Trendler ve Sinyaller

### Trend Kumesi 1: Integrity by default teoriden release checklist'e indi

`JEP 500` artik yalnizca bir taslak degil. JDK 26'da warning ve JFR event'i var; JDK 27 RC kapida. Bu, Java/Spring ekiplerine somut bir siralama veriyor:

- once JDK 26 ile sessiz ihlalleri say
- sonra JDK 27 RC ile daha genis smoke test calistir
- en son framework milestone lane'inde modernizasyon etkisini gor

[InfoQ'nun 04 Mayis 2026 roundup'i](https://www.infoq.com/news/2026/05/java-news-roundup-may04-2026/) icindeki JobRunr `8.6.0` notu da bu sinyali dogruluyor: bazi JVM kutuphaneleri `--illegal-final-field-mutation=deny` ile uyumlu olmak icin simdiden final-field mutasyonlarini kaldiriyor.

### Trend Kumesi 2: JVM default'lari artik "dokunma gec" degil

JDK 27 ile ayni anda uc farkli default/format alaninda degisiklik goruyoruz:

- TLS named group default'u gucleniyor
- thread dump JSON sekli degisiyor
- GC secim default'u degisiyor

Bu desenin anlami su: uygulama kodu degismese bile platform default'u degistigi icin davranis degisebilir. Kurumsal Java ekiplerinin "BOM degismediyse problem yok" refleksi artik yetersiz.

### Trend Kumesi 3: Spring next-minor treni hazirlaniyor, ama production lane baska kalmali

[Spring Projects](https://spring.io/projects) sayfasinda 03 Eylul 2026 itibariyla `Boot 4.1.1`, `Framework 7.0.8`, `Cloud 2025.1.3`, `Integration 7.1.1`, `AMQP 4.1.1`, `Batch 6.0.5`, `Modulith 2.1.1` stabil cizgi olarak gorunuyor. Milestone hat ise baska bir is yapiyor: gelecegin API ve runtime varsayimlarini erken gosteriyor.

Bu nedenle tek lane yetmez:

- stabil production lane
- destekli audit lane
- milestone/scout lane

ayrimi artik daha mantikli.

### Gurultu mu, kalici deger mi?

- Kalici deger: `final field` auditini JDK 26/JFR ile bugunden baslatmak
- Kalici deger: `jdk.tls.namedGroups` override'larini ve custom SSL parametrelerini denetlemek
- Kalici deger: JSON thread dump parser'larini `formatVersion: 2` icin hazirlamak
- Kalici deger: kucuk container'larda GC secimini explicit hale getirmek
- Izleme: `Boot 4.2 M1`, `Modulith 2.2 M1`, `AMQP 4.2 M1`, `Integration 7.2 M1`
- Dusuk oncelik: `JEP 533 Structured Concurrency` hala yedinci preview; bugunun production API sozlesmesini bunun uzerine kurmak erken

## Araclar ve Kutuphaneler

- [OpenJDK JDK 27 RC Build 35](https://jdk.java.net/27/): compatibility lane icin hemen kullanilabilir scout runtime.
- [Spring Boot 4.1.1](https://spring.io/blog/2026/08/20/spring-boot-4-1-1-available-now): mevcut production lane; resmi Java 26 uyumu sayesinde destekli audit zemini sunuyor.
- [Spring Boot 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-boot-4-2-0-M1-available-now): buildpack image cache ve AMQP 1.0 ile sonraki minor'un yonunu acik ediyor.
- [Spring Modulith 2.2 M1](https://spring.io/blog/2026/08/26/spring-modulith-2-2-m1-2-1-1-2-0-8-and-1-4-13-released): `Boot 4.2 M1` ve `Framework 7.1 M1` cizgisine gecmis ilk guclu sinyallerden biri.
- [Spring AMQP 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-amqp-4-2-0-m1-available): `RestClientNodeLocator` ve SSL hostname verification sertlesmesi nedeniyle dikkat istiyor.
- [Spring Integration 7.2.0-M1](https://spring.io/blog/2026/08/20/spring-integration-7-2-0-m1-released): `RestTemplate` outbound config deprecation'i ile HTTP modernizasyonunu hizlandiriyor.
- Dusuk oncelik ama faydali sinyal: [JobRunr 8.6.0](https://www.jobrunr.io/en/blog/jobrunr-v8.6.0/) JDK 26 `deny` senaryosuna uyumlanmis durumda; JVM ekosisteminin JEP 500'e uyum saglayabildigini gosteren iyi bir referans.

## Java / Spring Gelistiricileri Icin Etkiler

- `Boot 4.1.1` uzerindeki servisler icin bir `JDK 26 audit lane` ac. Orada ya `--illegal-final-field-mutation=debug` kullan ya da JFR ile `jdk.FinalFieldMutation` event'lerini topla.
- Constructor injection disinda kalan field injection, reflection helper, test fixture ve custom serializer kodlarini say. Yalnizca "Spring zaten constructor injection kullaniyor" diyerek gecme.
- `jdk.tls.namedGroups`, `javax.net.ssl` parametre override'lari, custom trust/TLS wrapper'lari ve platform image'taki SSL ayarlarini inventory'ye al.
- Thread dump toplayan incident tooling'i `formatVersion: 2`, numerik `processId`, `tid` ve `threadCount` icin guncelle.
- Kucuk pod veya dusuk bellekli is yuklerinde GC secimini bilincli yap. Davranis farki istemiyorsan `Serial` secimini explicitlestir; daha dusuk latency istiyorsan `G1`i benchmark ile onayla.
- `Boot 4.2 M1` ve ilgili milestone'lari production patch backlog'una karistirma. Bunlari ayri bir `future compatibility` lane'inde tut.
- `JDK 27 RC`yi resmi destek varmis gibi sunma. Bu rapordaki "4.2 hattinda test et" yorumu kaynaklardan cikarimdir; resmi destek metni degildir.

## Firsatlar ve Riskler

- Firsat: destekli `JDK 26` lane'inde runtime-integrity borcunu sayip 27 GA oncesi temizlemek
- Firsat: TLS policy override'larini sadeleştirip hibrit post-quantum yoluna daha az surprizle gecmek
- Firsat: incident tooling'i simdiden guncelleyip yeni JSON thread dump formatini kriz aninda degil onceden almak
- Firsat: milestone lane'de HTTP client, messaging ve build cache modernizasyonunu kontrollu denemek
- Risk: `final field` warning'lerini "library'nin sorunu" diyerek gormezden gelmek
- Risk: `jdk.tls.namedGroups` pinlemeleri nedeniyle JDK 27'nin yeni TLS davranisini sessizce devre disi birakmak
- Risk: thread dump parser'larinin tip degisiminden dolayi sessizce bos veya hatali veri uretmesi
- Risk: dusuk kaynakli container'larda GC farkini fark etmeden latency/throughput regresyonu yasamak
- Risk: milestone Spring hatlarini destekli production matrisinin yerine koymak

## Izlenmesi Gereken Konular

- Spring Boot system requirements sayfasina `Java 27` ifadesinin ne zaman girdigi
- `JDK 27` GA release notlarinda ek migration riski cikup cikmadigi
- Spring `4.2` RC/GA notlarinin HTTP client, AMQP ve build cache konularini ne kadar sertlestirdigi
- JEP 500 uyumu icin JVM ekosisteminde baska hangi kritik kutuphanelerin release yayinladigi
- Spring ekiplerinin `RestClient` gecisi ve TLS default'lari icin daha acik migration recipe yayinlayip yayinlamadigi
- `JEP 533 Structured Concurrency` preview status'unden cikmadan once Spring ekosisteminde kalici API kararina donusup donusmedigi

## Kaynak Bazli Bulgular

### Bulgu 1

- `title`: JDK 27 release-candidate oldu; Spring Boot 4.1.1 ise resmi olarak hala Java 26 sinirinda
- `source`: [OpenJDK JDK 27 RC Builds](https://jdk.java.net/27/) | [Spring Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html) | [Spring Projects](https://spring.io/projects)
- `author`: OpenJDK toplulugu, Spring Boot team
- `date`: 20 Agustos 2026 RC build tarihi, 03 Eylul 2026 dogrulamasi
- `category`: `compatibility`, `runtime-governance`, `release-readiness`
- `tags`: `jdk27-rc-b35`, `boot-4.1.1`, `java-26`, `support-boundary`
- `summary`: OpenJDK tarafi JDK 27 icin RC build dagitiyor; buna karsin Spring Boot 4.1.1 resmi dokumanda Java 26'ya kadar uyumlu gorunuyor.
- `why_it_matters`: JDK 27 testleri gecikecek kadar erken degil, production default'u olacak kadar da resmi degil.
- `java_spring_relevance`: Spring Boot kullanan ekipler destekli lane ile scout lane'i ayirmak zorunda.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: 27 GA oncesi uyumluluk toplamak, destekli 26 lane'i kullanarak risk dusurmek
- `risks`: 27 RC'yi production matrisi gibi sunmak, 26 lane'ini audit icin kullanmamak
- `migration_notes`: `JDK 26`yi destekli audit lane, `JDK 27 RC`yi ayri scout lane yap; stabil release lane'i ile karistirma

### Bulgu 2

- `title`: JEP 500 final field mutation'i runtime warning ve JFR eventi haline getirdi
- `source`: [JEP 500](https://openjdk.org/jeps/500) | [Avoiding Final Field Mutation](https://inside.java/2026/04/27/avoiding-final-field-mutation/) | [InfoQ May 4 roundup](https://www.infoq.com/news/2026/05/java-news-roundup-may04-2026/)
- `author`: Ron Pressler, Alex Buckley, Nicolai Parlog, Michael Redlich
- `date`: JEP 26 teslimi, 27 Nisan 2026 rehberi, 11 Mayis 2026 InfoQ roundup
- `category`: `integrity`, `security`, `dependency-injection`, `diagnostics`
- `tags`: `jep-500`, `jdk.FinalFieldMutation`, `illegal-final-field-mutation`, `constructor-injection`, `jobrunr-8.6.0`
- `summary`: JDK 26 illegal final-field mutation'lari warning ve debug stack trace ile gosteriyor; JFR da kaynak kodu tespit etmeyi kolaylastiriyor. Ekosistemde JobRunr gibi projeler bu yuzeyi simdiden temizlemeye basladi.
- `why_it_matters`: Gelecekte `deny` default'una giden yol acildi; sessiz teknik borc bugunden olculebilir hale geldi.
- `java_spring_relevance`: Spring ekipleri constructor injection tarafinda avantajli, ama custom serializer, eski field injection, test/mocking ve reflection helper kodlari risk tasiyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: JFR tabanli dependency taramasi, field injection kalintilarini temizleme, constructor/factory standardizasyonu
- `risks`: warning'leri CI disina itmek, library kaynakli ihlalleri gozden kacirmak, `Serializable` istisnalarini yanlis guvenlik hissi icin kullanmak
- `migration_notes`: bir lane'de `--illegal-final-field-mutation=debug` calistir; ikinci lane'de JFR ile `jdk.FinalFieldMutation` event'lerini topla ve kalici olarak field injection'dan cik

### Bulgu 3

- `title`: JDK 27 hibrit TLS 1.3 key exchange getiriyor; named-group override'lari kritik hale geldi
- `source`: [JEP 527](https://openjdk.org/jeps/527) | [JDK 27: Post-Quantum Hybrid Key Exchange for TLS 1.3](https://inside.java/2026/05/17/quality-heads-up/)
- `author`: Jamil Nimeh, Ana-Maria Mihalceanu
- `date`: 17 Mayis 2026 heads-up, 03 Eylul 2026 dogrulamasi
- `category`: `security`, `tls`, `platform-defaults`, `service-communication`
- `tags`: `jep-527`, `X25519MLKEM768`, `tls-1.3`, `named-groups`, `javax.net.ssl`
- `summary`: JDK 27 EA/RC build'leri hibrit post-quantum key exchange'i default named-group listesine ekliyor; ancak custom named-group override'lari bu davranisi devre disi birakabiliyor.
- `why_it_matters`: Kod degistirmeden guvenlik kazanci almak mumkun, ama platform override'lari bu kazanci sessizce silebilir.
- `java_spring_relevance`: Spring servislerinin outbound HTTP, gateway, messaging ve internal TLS policy'leri dogrudan etkilenir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: TLS policy sadeleştirmesi, outbound SSL inventory'si, quantum-readiness icin erken test
- `risks`: `jdk.tls.namedGroups` pinleme, custom SSL wrapper'larin yeni default'lari bozmasi, staging'de gorulmeyen prod farklari
- `migration_notes`: `jdk.tls.namedGroups` ve SSLParameters override'larini envantere al; JDK 27 RC lane'inde handshake ve compatibility smoke test calistir

### Bulgu 4

- `title`: JSON thread dump formatVersion 2 operasyonel parser borcunu ortaya cikardi
- `source`: [JDK 27: Numeric Fields in JSON Thread Dumps](https://inside.java/2026/05/20/quality-heads-up/)
- `author`: Ana-Maria Mihalceanu
- `date`: 20 Mayis 2026
- `category`: `observability`, `serviceability`, `operations`
- `tags`: `formatVersion-2`, `thread-dump-json`, `processId`, `tid`, `threadCount`, `jcmd`
- `summary`: JDK 27 ile JSON thread dump'taki kimlik ve sayac alanlari string yerine sayi oluyor; ustune `formatVersion: 2` geliyor.
- `why_it_matters`: Uygulama degismese de olay aninda kullandigin parser bozulabilir.
- `java_spring_relevance`: JVM tabanli Spring servisleri icin incident response ve support tooling zincirini etkiler.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: parser'lari versiyonlamaya gore yazmak, incident aractlarini standardize etmek
- `risks`: regex veya string-varsayimli parser'larin sessiz hata vermesi, thread dump analizinin eksik kalmasi
- `migration_notes`: parser'lari numerik alan kabul edecek sekilde guncelle; `formatVersion` alanini future-proof branching icin kullan

### Bulgu 5

- `title`: JDK 27 ile constrained ortamlarin varsayilan GC'si G1 oluyor
- `source`: [JEP 523](https://openjdk.org/jeps/523) | [JDK 27: Default G1 in All Environments](https://inside.java/2026/07/20/quality-heads-up/)
- `author`: Thomas Schatzl, Nicolai Parlog
- `date`: 20 Temmuz 2026 heads-up, 03 Eylul 2026 dogrulamasi
- `category`: `garbage-collection`, `runtime-defaults`, `performance`
- `tags`: `jep-523`, `g1`, `serial-gc`, `containers`, `latency`
- `summary`: JDK 27, tek CPU veya dusuk bellekli ortamlar dahil her yerde varsayilan GC olarak G1'i seciyor; Serial GC halen mevcut ama artik default degil.
- `why_it_matters`: "GC secmedik, JVM halleder" varsayimi davranis degisikligi yaratabilir.
- `java_spring_relevance`: kucuk Spring worker, batch job, utility pod ve dusuk kaynakli servisler performans farki hissedebilir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: daha dusuk latency profili, explicit GC policy standardi, benchmark otomasyonu
- `risks`: throughput/footprint surprizi, capacity modelinin bozulmasi, env'ler arasi davranis farki
- `migration_notes`: GC secimi kritik uygulamalarda explicitlestir; aksi halde JDK 27 lane'inde latency ve throughput benchmark'i zorunlu yap

### Bulgu 6

- `title`: Spring'in 4.2/7.2/2.2 hattinda HTTP client ve delivery modernizasyonu hizlaniyor
- `source`: [Spring Boot 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-boot-4-2-0-M1-available-now) | [Spring Modulith 2.2 M1](https://spring.io/blog/2026/08/26/spring-modulith-2-2-m1-2-1-1-2-0-8-and-1-4-13-released) | [Spring AMQP 4.2.0-M1](https://spring.io/blog/2026/08/20/spring-amqp-4-2-0-m1-available) | [Spring Integration 7.2.0-M1](https://spring.io/blog/2026/08/20/spring-integration-7-2-0-m1-released)
- `author`: Phil Webb, Oliver Drotbohm, Glenn Renfro
- `date`: 20-26 Agustos 2026
- `category`: `framework-roadmap`, `http-clients`, `messaging`, `build`
- `tags`: `boot-4.2.0-m1`, `modulith-2.2.0-m1`, `restclient`, `amqp-1.0`, `image-build-cache`
- `summary`: Spring'in milestone hattinda build cache, AMQP 1.0, `RestClient` ve stricter SSL davranisi one cikiyor; Modulith ilk adimda `Boot 4.2 M1` ve `Framework 7.1 M1` tabanina gecmis durumda.
- `why_it_matters`: JVM runtime degisiklikleri ile Spring default modernizasyonu ayni doneme geliyor; ayni compatibility lane'de birlikte gorulmesi avantajli.
- `java_spring_relevance`: platform ekipleri icin gelecekteki Spring upgrade backlog'unun iskeletini cizer.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: gelecekteki HTTP/messaging/build degisimlerini erkenden gormek, modulith ve AMQP gecislerini ayri lane'de olcmek
- `risks`: milestone hattini destekli production lane sanmak, runtime ve framework degisimlerini ayni canary'de kontrolsuz toplamak
- `migration_notes`: bu bulgudaki "JDK 27 icin dogal test zemini" yorumu kaynaklardan cikarimdir; resmi support claim'i degildir. Milestone hattini yalnizca compatibility lane icin kullan

### Bulgu 7

- `title`: Structured Concurrency ilginc ama bugun icin dusuk oncelikli sinyal olmaya devam ediyor
- `source`: [JEP 533](https://openjdk.org/jeps/533) | [InfoQ May 4 roundup](https://www.infoq.com/news/2026/05/java-news-roundup-may04-2026/)
- `author`: Alan Bateman, Viktor Klang, Ron Pressler, Michael Redlich
- `date`: 19 Agustos 2026 JEP guncellemesi, 11 Mayis 2026 InfoQ roundup
- `category`: `concurrency`, `language-platform`, `preview-features`
- `tags`: `jep-533`, `structured-concurrency`, `preview`, `loom`
- `summary`: Structured Concurrency JDK 27'de yedinci preview olarak devam ediyor; ekosistem icin onemli ama hala kalici production API zemini degil.
- `why_it_matters`: Heyecan verici olsa da bugunun asil riski concurrency API tasarimi degil; runtime integrity, TLS ve observability default'lari.
- `java_spring_relevance`: Spring ekipleri bunu izlemeli ama request/worker contract'larini bugun bu preview etrafinda yeniden yazmamali.
- `actionability`: `izleme`
- `impact_level`: `orta`
- `opportunities`: future design spike'lari, Loom uyumlu helper API'ler
- `risks`: preview'yu kalici sozlesme gibi ele alip gereksiz API churn yaratmak
- `migration_notes`: spike yap ama production public API'yi buna kilitleme; once JDK 27'nin non-preview operasyonel etkilerine odaklan

## Sonuc

03 Eylul 2026 itibariyla bugunun asil haberi yeni bir Spring GA surumu degil; `JDK 27 readiness`in artik ertelenemeyecek kadar somut hale gelmesi. En dogru yol, `JDK 27 RC`yi production heyecani olarak sunmak degil; destekli `JDK 26` lane'inde `JEP 500` auditini baslatmak, TLS named-group ve JSON thread dump parser borcunu kapatmak, kucuk container'larda GC secimini explicitlestirmek ve milestone Spring hattini yalnizca compatibility lane icin kullanmak.

Kisa plan su: `Boot 4.1.1 + JDK 26` ile runtime-audit lane ac; `jdk.FinalFieldMutation` event'lerini topla; SSL/TLS override envanterini cikar; thread dump tooling'ini `formatVersion: 2` icin guncelle; daha sonra `JDK 27 RC` ve gerekirse `Boot 4.2 M1` tabanli ayri bir scout lane ile gelecekteki uyumlulugu kontrollu sekilde test et.
