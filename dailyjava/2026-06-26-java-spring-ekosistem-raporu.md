# Gunluk Java / Spring Ekosistem Raporu

Tarih: 26 Haziran 2026  
Tarama zamani: 26 Haziran 2026 09:05 TSI  
Odak: Spring Boot `3.5.x` OSS hattinin kapanisi, Spring Cloud release-train gecisinin artik ertelenemez hale gelmesi, kimlik katmaninin Spring Security `7.0` altinda toplanmasi ve JDK `26` runtime iyilestirmelerinin gercek benchmark backlog'una donusmesi

Tarama notu: Bu rapor hazirlanirken [Spring Boot 3.5.16 available now](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/), [Spring Data 2025.0.13 released](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/), [Spring Cloud 2025.0.3 (aka Northfields) Has Been Released](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/), [Spring Cloud 2025.1.2 (aka Oakwood) Has Been Released](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/), [Spring Boot project page](https://spring.io/projects/spring-boot/), [Spring Cloud project page](https://spring.io/projects/spring-cloud/), [Spring Authorization Server project page](https://spring.io/projects/spring-authorization-server/), [Spring Authorization Server moving to Spring Security 7.0](https://spring.io/blog/2025/09/11/spring-authorization-server-moving-to-spring-security-7-0/), [Spring Security advisories](https://spring.io/security), [Spring Boot `v3.5.16` release](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.16), [Spring Data Commons `3.5.13`](https://github.com/spring-projects/spring-data-commons/releases/tag/3.5.13), [Spring Data JPA `3.5.13`](https://github.com/spring-projects/spring-data-jpa/releases/tag/3.5.13), [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12), [Performance Improvements in JDK 26](https://inside.java/2026/06/09/jdk-26-performance-improvements/), [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26), [InfoQ Java News](https://www.infoq.com/java/news/), [Dynamic Authorization Scopes in Spring Authorization Server](https://www.baeldung.com/java-spring-dynamic-authorization-scopes), [This Week in Spring - June 23rd, 2026](https://spring.io/blog/2026/06/23/this-week-in-spring-june-23-2026/), [Gunnar Morling blogu](https://www.morling.dev/), ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandi. 25 Haziran 2026 raporundaki Spring Data `3.5.x` kapanis hikayesi, JDK `26` HttpClient davranis degisikligi ve JDK `27` final-field uyarilari bugun aynen tekrar edilmedi; bugunun ana ekseni support-line kapanisinin fiilen migration takvimine donusmesi oldu. InfoQ, Josh Long, Gunnar Morling, Baeldung ve Burak KUTBAY tarafinda bugunun kararini resmi Spring release/support sinyalinin onune geciren daha kuvvetli yeni bir production sinyali gorunmedi. Bu son cumle, taranan kaynaklarin birlikte degerlendirilmesinden yapilan cikarimdir.

## One Cikan Basliklar

- [Spring Boot `3.5.16`](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/) yayinlandi ve Spring ekibi bunu acikca `3.5.x` jenerasyonunun son OSS surumu olarak isaretledi.
- Bu tek basina bir Boot patch haberi degil; [Spring Cloud `2025.0.3` Northfields](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/) zaten son OSS `2025.0.x` hatti ve OSS destegi 30 Haziran 2026'da bitiyor.
- [Spring Cloud `2025.1.2` Oakwood](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) Boot `4.0.7` ile uyumlu ve Boot `4.1.0` uyumlulugunu getiriyor; yani Cloud kullanan ekiplerde "sonra bakariz" alani daha da daraldi.
- Boot `3.5.16`, [Spring Data `2025.0.13`](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/) ve [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12) gibi uretim etkisi olan duzeltmeleri iceri aliyor; bu nedenle "zaten migration yapacagiz" diyerek patch atlamak pahali olabilir.
- [Spring Authorization Server proje sayfasi](https://spring.io/projects/spring-authorization-server/) `1.5.x` kolunun son jenerasyon oldugunu, yeni ozelliklerin Spring Security `7.0` altina tasindigini acik soyluyor.
- [JDK 26 performans yazisi](https://inside.java/2026/06/09/jdk-26-performance-improvements/) artik teori degil; G1 throughput, AOT cache, kuculen varsayilan heap ve virtual thread davranisi Spring servisleri icin olculebilir kazanc alanlari sunuyor.

## Kritik Guncellemeler

### 1. Spring Boot `3.5.16`, `3.5.x` icin son OSS zemin oldu

[Andy Wilkinson'in duyurusu](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/) yalniz yeni surumu degil, ayni zamanda su karari da netlestiriyor:

- `3.5.16`, `3.5.x` jenerasyonunun son OSS surumu.
- OSS destegi icin onerilen yon artik `4.0.x` veya `4.1.x`.
- Bu release yalniz "bakim patch'i" gibi okunmamali; support sarti degisti.

Bu, 25 Haziran 2026 itibariyla dunun "pickup bekleniyor" durumunu bitirdi. Artik soru "3.5.16 cikar mi?" degil, "3.5.16'yi gecici emniyet zemini olarak alip hangi `4.x` hattina ne kadar hizli gececegiz?" olmali.

### 2. Boot `3.5.x` sonu, Spring Cloud ekipleri icin de takvim baskisi yaratiyor

[Northfields `2025.0.3`](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/) iki kritik sey soyluyor:

- `2025.0.x`, son OSS Spring Cloud release-train'i ve OSS destek bitisi 30 Haziran 2026.
- Bu train, Spring Boot `3.5.15` tabanli.

Buna karsilik [Oakwood `2025.1.2`](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) su sinyali veriyor:

- Boot `4.0.7` ile uyumlu.
- Boot `4.1.0` uyumlulugunu da getiriyor.

Buradan cikan pratik sonuc su: Spring Cloud kullanan ekiplerde Boot `3.5.16` almak sadece patch karari degil; ayni zamanda Northfields'te ne kadar kisa kalinacagi kararidir. Cloud kullanmayan bir Boot servisi ile Cloud release-train'i uzerine oturan bir filo artik ayni migration takvimine sahip degil.

### 3. `3.5.16` altindaki veri ve mesajlasma duzeltmeleri "son patch" psikolojisiyle kucumsenmemeli

[Boot `v3.5.16` GitHub release](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.16) bu surumun su paketleri yukselttigini gosteriyor:

- Spring Data BOM `2025.0.13`
- Spring AMQP `3.2.12`
- Spring Integration `6.5.10`

[Spring Data `2025.0.13`](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/) zaten `3.5.x` icin son OSS hat olarak duyurulmustu. Alt modullerdeki etkiler de ciddi:

- [Spring Data Commons `3.5.13`](https://github.com/spring-projects/spring-data-commons/releases/tag/3.5.13), `TypeDiscoverer` tarafinda superclass/subclass field masking davranisini duzeltiyor.
- [Spring Data JPA `3.5.13`](https://github.com/spring-projects/spring-data-jpa/releases/tag/3.5.13), `MEMBER OF` icinde tek karakterli string literal parse hatasini duzeltiyor ve Hibernate `6.6.53.Final` seviyesine cikiyor.

Mesajlasma tarafinda [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12) su sorunlari kapatiyor:

- malformed `x-death` header durumunda `ClassCastException`
- `3.2.11` regresyonu nedeniyle RabbitMQ `3.13` classic queue deklarasyonunun `x-queue-leader-locator` ile bozulmasi

Yani son `3.5.x` patch'i "sadece destek icin alinacak" bir build degil; correctness ve messaging davranisi acisindan da gercek bir patch-floor.

### 4. Spring Authorization Server'da yeni feature hattinin adresi artik Security `7.0`

[Spring Authorization Server proje sayfasi](https://spring.io/projects/spring-authorization-server/) ve [resmi tasinma duyurusu](https://spring.io/blog/2025/09/11/spring-authorization-server-moving-to-spring-security-7-0/) birlikte okundugunda dort sey net:

- Spring Authorization Server `1.5.x`, son jenerasyon.
- Yeni ozellikler Spring Security `7.0` altina tasiniyor.
- Kaynak kod, dokumantasyon ve issue akisi Spring Security etrafinda birlesiyor.
- Maven koordinatlari buyuk olcude korunuyor; migration etkisinin goreli dusuk tutulmasi hedefleniyor.

Bu ozellikle authorization server tarafinda yeni consent, custom grant, dynamic scope, MFA veya tenant bazli ozellestirme planlayan ekipler icin kritik. Bugun yeni is yazacaksaniz hedef API'nin yasadigi yerle hat kapama takvimini ayri dusunemezsiniz.

### 5. JDK `26`, Spring servisleri icin olculebilir runtime kazanci vaat ediyor

[Inside Java performans derlemesi](https://inside.java/2026/06/09/jdk-26-performance-improvements/) ve [Oracle Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26) bugun icin su alanlari one cikariyor:

- [JEP 522](https://openjdk.org/jeps/522): G1 yazma bariyeri senkronizasyonunu azaltarak referans-agir is yuklerinde `5-15%` throughput kazanci potansiyeli
- [JEP 516](https://openjdk.org/jeps/516): AOT object cache'in artik her GC ile, ZGC dahil, calisabilmesi
- `JDK-8371986`: varsayilan baslangic heap'inin `MinHeapSize`'a cekilmesiyle startup maliyetinin dusmesi
- `JDK-8369238`: class initialization bekleyen virtual thread'lerin carrier'dan ayrilabilmesi

Bu listeyi sadece "JDK ilginc hale geliyor" diye okumak eksik olur. Ozellikle:

- cok sayida sanal thread acan servisler
- buyuk heap ama kisa startup beklentisi olan deployment'lar
- G1 uzerinde referans yogunlugu yuksek event-driven uygulamalar
- ZGC kullanirken CDS/AOT avantajlarindan mahrum kalan ekipler

icin JDK `26` artik backlog'da lab-lane degil, olculecek aday baseline.

## Trendler ve Sinyaller

### Trend Kumesi 1: Support-line kapanisi artik teknik borc degil takvimsel zorunluluk

Tekrarlayan resmi sinyaller:

- Boot `3.5.16`, son OSS `3.5.x`
- Spring Data `2025.0.13`, son OSS `3.5.x`
- Spring Cloud `2025.0.3`, son OSS `2025.0.x` ve 30 Haziran 2026 bitis
- Spring Authorization Server `1.5.x`, son jenerasyon

Cikarin:

- Spring ekosisteminde birden fazla katmanda ayni anda "terminal maintenance line" durumuna girildi.
- Bu bir hype konusu degil; dogrudan platform, guvenlik, destek ve migration maliyeti konusu.

### Trend Kumesi 2: Yeni feature'lar tek tek projelerde degil daha buyuk cati altinda toplanıyor

Tekrarlayan resmi sinyaller:

- Authorization Server ozellikleri Spring Security `7.0` altinda toplanıyor.
- Spring Cloud yeni ana hat olarak Boot `4.0/4.1` ile konusuyor.
- Spring Cloud proje sayfasi, baslangic noktasinda Boot secimine gore BOM secilmesini oneren bir model sergiliyor.

Cikarin:

- Yeni is gelistirme ile legacy hatta patch alma karari birbirinden ayrilmali.
- "Mevcut hatta kalirken ayni anda yeni feature de oraya ekleriz" yaklasimi her gecen hafta daha pahali hale geliyor.

### Trend Kumesi 3: JDK upgrade'i yalniz uyumluluk cezasi degil performans firsati da sunuyor

Tekrarlayan resmi sinyaller:

- G1 throughput iyilesmesi
- AOT cache'in GC-bagimsiz hale gelmesi
- daha dusuk varsayilan startup maliyeti
- virtual thread scheduler davranisinin iyilesmesi

Cikarin:

- Java `26` icin rollout motivasyonu sadece "sonra lazim olur" degil.
- Ozellikle Spring Boot uzerinde startup maliyeti, thread yogunlugu ve event/caching profili one cikan servislerde net kazanc ihtimali var.

## Araclar ve Kutuphaneler

- [Spring Boot `3.5.16`](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/): `3.5.x` kullanan ekipler icin alinmasi gereken son OSS taban.
- [Spring Cloud `2025.1.2` Oakwood](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/): Boot `4.0.7` ve `4.1.0` ile uyumluluk cizgisini netlestiriyor.
- [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12): RabbitMQ `3.13` kullanan veya `x-death` header'ina yaslanan servislerde gercek davranis duzeltmesi tasiyor.
- [Spring Authorization Server](https://spring.io/projects/spring-authorization-server/): yeni ozellik adresi fiilen Security `7.0`; `1.5.x` sadece mevcut hatta kontrollu yasam destegi gozuyle ele alinmali.
- Dusuk oncelik ama pratik: [Baeldung'in dynamic authorization scopes yazisi](https://www.baeldung.com/java-spring-dynamic-authorization-scopes), SAS ozellestirmesinin nasil yapilabilecegini gosteriyor; ancak bu tarz yeni feature yatirimlari Security `7.0` konsolidasyonuna gore planlanmali.
- Bugun yeni production-grade OSS kutuphane patlamasi yok; asil sinyal yeni kutuphane degil, mevcut hatlarin omur sonu ve gecis rotasi.

## Java / Spring Gelistiricileri Icin Etkiler

- Spring Boot `3.5.x` kullaniyorsaniz `3.5.16` artik opsiyon degil gecici minimum zemin.
- Spring Cloud kullaniyorsaniz, Boot `3.5.16` almak sorunu cozmez; Northfields `2025.0.x` OSS bitisi 30 Haziran 2026 oldugu icin Oakwood / Boot `4.x` rotasi da ayni anda planlanmali.
- Yeni authorization server feature isleri aciliyorsa hedef platformun Security `7.0` oldugu varsayilmali.
- Spring Data JPA veya Commons tarafinda sessiz correctness bug'lari tasiyan ekipler migration beklerken bile patch gecmeli.
- RabbitMQ `3.13` kullanan servislerde AMQP `3.2.11` regressions etkilenme ihtimali varsa `3.2.12` acil test backlog'una alinmali.
- JDK `26` icin benchmark, sadece HttpClient degil G1, CDS/AOT, virtual threads ve startup metrigi etrafinda yeniden tasarlanmali.

## Firsatlar ve Riskler

- Firsat: `3.5.16`, `4.x` migration'i oncesi temiz bir son OSS inis pisti sagliyor.
- Risk: Bu surumu "bir sure daha hicbir sey yapmayiz" lisansi gibi okumak, ayni anda Boot, Data ve Cloud tarafinda kapanan support pencerelerini gozden kacirmaya yol acar.
- Firsat: Security `7.0` altinda toplanan authorization server deneyimi, daha sade issue/dokumantasyon akisina gecis saglayabilir.
- Risk: Yeni authorization feature yatirimini `1.5.x` kolunda derinlestirmek, yakinda ikinci bir tasinma maliyeti dogurabilir.
- Firsat: JDK `26`, ayni uygulama koduyla startup ve throughput kazanclari verebilir.
- Risk: Bu kazanclar yalniz hedefli benchmark ile gorulebilir; kor benchmark acmadan "JDK `26` hizli" karari vermek kolay ama savunmasiz olur.
- Firsat: Cloud `2025.1.x` ile Boot `4.1` uyumlulugu, yeni feature backlog'unu legacy hatlardan ayirmayi kolaylastirir.
- Risk: Northfields ve Oakwood'u ayni repo/organizasyon icinde karistirmak test matrisi ve artifact politikalarini sisirir.

## Izlenmesi Gereken Konular

- Spring Boot `4.0.x` ve `4.1.x` ilk takip patch'leri ne zaman gelecek ve `3.5.16` sonrasinda migration hizini nasil etkileyecek?
- Spring Cloud proje / version mapping yuzeyleri Boot `4.1` uyumlulugunu daha gorunur ve daha acik hale getirecek mi?
- Spring Security `7.0` altinda Authorization Server migration notlari ne kadar hizli olgunlasacak?
- JDK `26` testlerinde G1, AOT cache ve virtual thread kazanclari sizin gercek is yukunuzde ne kadar tekrarlanabilir?
- Bugun yeni ust seviye Spring security advisory gorunmedi; ancak kimlik, Cloud Gateway ve legacy support-line baskisi hala kapanmis degil.
- Burak KUTBAY blogunda bugunun karar eksenini degistirecek kadar taze Java/Spring odakli yeni bir production makalesi gorunmedi.

## Kaynak Bazli Bulgular

### Bulgu 1

- `title`: Spring Boot `3.5.16`, `3.5.x` jenerasyonunun son OSS surumu olarak cizgiyi cekti
- `source`: [Spring Boot 3.5.16 available now](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/) | [Spring Boot `v3.5.16` release](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.16) | [Spring Boot project page](https://spring.io/projects/spring-boot/)
- `author`: Andy Wilkinson | Spring Boot maintainers
- `date`: 25 Haziran 2026
- `category`: platform, maintenance, support-policy, release-management
- `tags`: boot-3.5.16, final-oss, boot-3.5, boot-4.0, boot-4.1, support
- `summary`: Spring Boot `3.5.16` yayinda ve Spring ekibi bunu `3.5.x` hattinin son OSS surumu olarak tanimliyor.
- `why_it_matters`: Bu, normal bir service release haberinden daha buyuk; support cizgisi resmen kapanmis durumda.
- `java_spring_relevance`: Boot `3.5.x` uzerindeki tum servlet, reactive, batch ve cloud-native servislerin taban karari etkileniyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: Son OSS patch'i alip kontrollu `4.0.x` veya `4.1.x` gecisi planlamak icin net bir zemin sunuyor.
- `risks`: `3.5.16` sonrasinda ayni hatta kalmak, guvenli limanda kalmak degil aktif support-disina cikmak anlamina geliyor.
- `migration_notes`: Yeni feature yatirimi icin `4.x`, kisa sureli stabilizasyon icin `3.5.16` kullanilmali; bu iki niyet birbirine karistirilmamali.

### Bulgu 2

- `title`: Spring Cloud `2025.0.x` bitis tarihi, Boot `3.5` kullanan ekiplerde migration'i takvim problemine ceviriyor
- `source`: [Spring Cloud 2025.0.3 (aka Northfields) Has Been Released](https://spring.io/blog/2026/06/11/spring-cloud-2025-0-3-aka-northfields-has-been-released/) | [Spring Cloud 2025.1.2 (aka Oakwood) Has Been Released](https://spring.io/blog/2026/06/11/spring-cloud-2025-1-2-aka-oakwood-has-been-released/) | [Spring Cloud project page](https://spring.io/projects/spring-cloud/)
- `author`: Ryan Baxter | Spring Cloud maintainers
- `date`: 11-26 Haziran 2026
- `category`: cloud-native, support-policy, compatibility, migration
- `tags`: spring-cloud, northfields, oakwood, boot-3.5, boot-4.0, boot-4.1, release-train
- `summary`: Northfields `2025.0.3` son OSS `2025.0.x` train'i ve destegi 30 Haziran 2026'da bitiyor; Oakwood `2025.1.2` ise Boot `4.0.7` ve `4.1.0` tarafina hizalaniyor.
- `why_it_matters`: Cloud kullanan ekiplerde Boot patch karari ile release-train karari artik ayrilamaz hale geldi.
- `java_spring_relevance`: Config, Gateway, OpenFeign, Stream, Vault, Contract ve discovery katmanlari ayni anda etkileniyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: Boot `4.1` + Oakwood'a gecis, yeni Cloud feature islerini legacy hattan temiz ayirmayi saglar.
- `risks`: `2025.0.x` uzerinde plansiz kalmak, ay sonundan sonra hem support hem security hikayesini zayiflatir.
- `migration_notes`: Cloud filosu olan ekipler icin `3.5.16` yalniz kisa sureli landing zone olarak gorulmeli; asagidaki hedef daha yeni train olmali.

### Bulgu 3

- `title`: Boot `3.5.16`, Spring Data ve AMQP tarafinda correctness ile messaging patch-floor'unu yukseltiyor
- `source`: [Spring Boot `v3.5.16` release](https://github.com/spring-projects/spring-boot/releases/tag/v3.5.16) | [Spring Data 2025.0.13 released](https://spring.io/blog/2026/06/24/spring-data-2025-0-13-released/) | [Spring Data Commons `3.5.13`](https://github.com/spring-projects/spring-data-commons/releases/tag/3.5.13) | [Spring Data JPA `3.5.13`](https://github.com/spring-projects/spring-data-jpa/releases/tag/3.5.13) | [Spring AMQP `3.2.12`](https://github.com/spring-projects/spring-amqp/releases/tag/v3.2.12)
- `author`: Andy Wilkinson, Mark Paluch ve ilgili proje maintainers
- `date`: 24-25 Haziran 2026
- `category`: data-access, messaging, correctness, maintenance
- `tags`: spring-data, spring-data-jpa, spring-data-commons, spring-amqp, rabbitmq-3.13, hibernate-6.6.53, x-death
- `summary`: Boot `3.5.16`, son Spring Data `3.5.x` duzeltmelerini ve RabbitMQ davranisini etkileyen Spring AMQP `3.2.12` fixlerini beraber getiriyor.
- `why_it_matters`: Support sonu hikayesi tek basina yeterli degil; bu patch set ayni zamanda dogruluk ve operasyonel davranis duzeltmesi de tasiyor.
- `java_spring_relevance`: Spring Data repository katmani, Hibernate tabanli servisler ve RabbitMQ ile event-driven entegrasyonlar dogrudan etkileniyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: Migration oncesi daha temiz query/mapping zemini ve RabbitMQ uyumluluk tabani elde edilebilir.
- `risks`: Patch alinmazsa sessiz query parse hatalari, field resolution yanlislari veya queue declaration regressions uretimde tasinabilir.
- `migration_notes`: Bu patch'i almak migration'i iptal etmek degil; migration'i daha az kirik zeminde yapmak demek.

### Bulgu 4

- `title`: Spring Authorization Server `1.5.x`, yeni feature adresi olmaktan cikti; gelecek Spring Security `7.0`
- `source`: [Spring Authorization Server project page](https://spring.io/projects/spring-authorization-server/) | [Spring Authorization Server moving to Spring Security 7.0](https://spring.io/blog/2025/09/11/spring-authorization-server-moving-to-spring-security-7-0/)
- `author`: Joe Grandja | Spring Security team
- `date`: 11 Eylul 2025 ve 26 Haziran 2026 proje durumu
- `category`: identity, security, platform-consolidation, migration
- `tags`: spring-authorization-server, spring-security-7.0, oauth2, oidc, identity, consolidation
- `summary`: Spring Authorization Server `1.5.x` son jenerasyon; yeni ozellikler ve merkezi deneyim Spring Security `7.0` altina tasiniyor.
- `why_it_matters`: Kimlik katmaninda bugun yapilacak yeni yatirimlarin omru, artik hangi koordinati kullandiginizdan cok hangi platform hattina oturdugunuza bagli.
- `java_spring_relevance`: OAuth2 Authorization Server, OIDC, custom grant, consent ve dynamic scope kullanan ekipler icin dogrudan mimari karar konusu.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: Security `7.0` ile daha birlesik dokumantasyon, issue akisi ve gelistirici deneyimi elde edilebilir.
- `risks`: `1.5.x` uzerine buyuk yeni feature yatirimi yapmak yakin vadede ikinci migration maliyeti yaratabilir.
- `migration_notes`: Resmi duyuru, koordinatlarin buyuk olcude sabit kalacagini ve sinif isimlerinin korunacagini soyluyor; bu, gecisi teknik olarak kolaylastirir ama stratejik karari ortadan kaldirmaz.

### Bulgu 5

- `title`: JDK `26`, G1, AOT cache, heap ve virtual thread davranisiyla backend ekipleri icin gercek benchmark adayi
- `source`: [Performance Improvements in JDK 26](https://inside.java/2026/06/09/jdk-26-performance-improvements/) | [The Arrival of Java 26](https://blogs.oracle.com/java/the-arrival-of-java-26)
- `author`: Ana-Maria Mihalceanu, Per-Ake Minborg | Oracle Java team
- `date`: 9 Haziran 2026 ve 17 Mart 2026
- `category`: jvm, performance, runtime, concurrency
- `tags`: jdk26, g1, aot-cache, zgc, virtual-threads, startup, minheapsize
- `summary`: JDK `26`, referans-agir G1 is yuklerinde throughput kazanci, her GC ile AOT cache, daha kucuk varsayilan baslangic heap'i ve daha iyi virtual-thread tasinabilirligi sunuyor.
- `why_it_matters`: Bunlar sadece JDK notlari degil; deployment hizi, CPU maliyeti ve throughput icin dogrudan olculebilir fark yaratabilir.
- `java_spring_relevance`: Spring Boot servisleri, event-driven uygulamalar, virtual-thread kullanan API katmanlari ve startup hassas platform ekipleri icin ozellikle ilgili.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: Kod degistirmeden startup ve throughput kazanci elde etme ihtimali var.
- `risks`: Hedefli benchmark olmadan fayda varsaymak veya GC/AOT secimini gelisiguzel yapmak yanlis kapasite planina yol acabilir.
- `migration_notes`: JDK `26` degerlendirmesi, yalniz sentetik microbenchmark ile degil; startup, traffic warmup, thread fan-out ve heap buyume profiliyle birlikte yapilmali.

### Bulgu 6

- `title`: Dusuk oncelik: Dynamic authorization scopes, ileri SAS ozellestirmesini mumkun kiliyor ama terminal hatta yapilacak yatirim dikkat istiyor
- `source`: [Dynamic Authorization Scopes in Spring Authorization Server](https://www.baeldung.com/java-spring-dynamic-authorization-scopes) | [Spring Authorization Server project page](https://spring.io/projects/spring-authorization-server/)
- `author`: Philippe Sevestre
- `date`: 24 Haziran 2026
- `category`: security-patterns, authorization, implementation-practice
- `tags`: dynamic-scopes, consent, spring-authorization-server, boot-4.1, customization
- `summary`: Baeldung, Spring Authorization Server uzerinde dynamic scope validation ve consent akislarini nasil ozellestirebileceginizi gosteriyor.
- `why_it_matters`: Ozellikle tekil islem scope'u, islem bazli izin veya daha ince taneli OAuth tasarimi dusunen ekipler icin uygulanabilir bir pattern sunuyor.
- `java_spring_relevance`: Authorization Server kullanan Spring ekipleri icin dogrudan teknik ornek degeri tasiyor.
- `actionability`: `izlemelik`
- `impact_level`: `dusuk-orta`
- `opportunities`: Daha ince taneli OAuth yetkilendirme modelini mevcut Spring stack ile kurma yolu aciyor.
- `risks`: Bu pattern'i `1.5.x` hattinda derinlestirmek, Security `7.0` konsolidasyonu yakin iken iki asamali migration yaratabilir.
- `migration_notes`: Yeni implementation dusunen ekipler, ornegin mimarisini alirken hedef runtime ve kalici API hattini Security `7.0` cevresinde secmeli.

## Sonuc

Bugunun en guclu mesaji yeni bir framework ozelligi degil: Boot `3.5.x`, Data `3.5.x`, Cloud `2025.0.x` ve Authorization Server `1.5.x` ayni anda "son duz cizgi" noktasina gelmis durumda. `3.5.16` alinmali, ama bu karar migration'i ertelemenin bahanesi degil; tersine hangi servisin Boot `4.0/4.1`, hangi filonun Cloud `2025.1.x`, hangi kimlik katmaninin Security `7.0` hedefine gidecegini aciklastirma zorunlulugu.

JDK `26` tarafinda ise hikaye daha olumlu: bu dalga yalniz support baskisi degil, ayni zamanda startup, throughput ve virtual-thread verimi icin olculebilir kazanclar sunuyor. Teknik olarak en dogru hamle, son `3.5.x` patch zemini uzerinde kisa sureli stabilizasyon yapmak ve hemen ardindan `4.x` + JDK `26` + gerekiyorsa Oakwood rotasini kontrollu benchmark ile acmak.
