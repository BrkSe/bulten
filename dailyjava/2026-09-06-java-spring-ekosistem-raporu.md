# Günlük Java / Spring Ekosistem Raporu

**Tarih:** 6 Eylül 2026 · **Odak:** JVM bellek teşhisi, reaktif tampon sahipliği ve veri okuma sırasında heap sınırları.

Bu rapor yeni yayınlarla mevcut teknik referansları ayırır. Yeni tetikleyici Inside Java'nın 4 Eylül yayınıdır; operasyon önerileri aşağıdaki resmi dokümanlardan çıkarılan mühendislik değerlendirmeleridir. Dün işlenen image tedarik zinciri ve önceki JDK geçiş gündemi tekrar açılmamıştır.

## Öne Çıkan Başlıklar

- **Bellek ve CPU birlikte ölçülmeli.** Ron Pressler'ın yeni konuşma duyurusu, GC değerlendirmesinde RAM–CPU ilişkisini öne çıkarıyor. Sadece heap yüzdesine göre kapasite azaltmak için yeterli gerekçe yok. [Inside Java](https://inside.java/2026/09/04/memory-management-principles-java/)
- **Heap sakin görünürken süreç belleği büyüyebilir.** NMT, JVM içi native tahsisleri sınıflandırır; bütün native belleği kapsamaz. Teşhis, JVM ve işletim sistemi ölçümlerini birleştirmeli. [Oracle NMT](https://docs.oracle.com/en/java/javase/25/vm/native-memory-tracking.html)
- **Reaktif iptal yolları bellek testinin parçasıdır.** Özel WebFlux/Gateway tampon işlemlerinde hata ve iptal sırasında serbest bırakma sahipliği açık olmalı. [Spring DataBuffer](https://docs.spring.io/spring-framework/reference/core/databuffer-codec.html)
- **Hardwood 1.1.0.Beta1'de önemli doğruluk düzeltmesi var:** çok elemanlı liste sütunlarının batch boyutunu aşarak heap tüketmesine yönelik düzeltme, yeni yazma API'si kadar önemli. Bu bir beta; genel üretim geçişi önerilmiyor. [GitHub sürümü](https://github.com/hardwood-hq/hardwood/releases/tag/v1.1.0.Beta1)

## Kritik Güncellemeler

Kontrol edilen [Spring Boot sürüm listesi](https://github.com/spring-projects/spring-boot/releases) hâlâ `4.1.1` kararlı sürümünü ve `4.2.0-M1` ön sürümünü gösteriyor. Bu taramada yeni bir Boot GA doğrulanmadı. [Spring güvenlik sayfası](https://spring.io/security/) kontrol edildi; bugün için ayrıca doğrulanmış yeni bir güvenlik duyurusu rapora eklenmedi. Bu, bütün bağımlılıkların güvenlik durumuna ilişkin bir garanti değildir.

Hardwood'un 31 Ağustos sürümü, liste elemanı çoğalmasını batch hesabına dahil ediyor. Aynı notlarda grup adına yöneltilen filtrenin yanlış satırlar döndürebildiği ve artık okuyucu oluşturulurken reddedildiği belirtiliyor. Mevcut kullanıcı için ilk iş performans karşılaştırmasından önce nested veri ve filtre doğruluğunu sınamak. [Sürüm notları](https://github.com/hardwood-hq/hardwood/releases/tag/v1.1.0.Beta1)

## Trendler ve Sinyaller

| Öncelik | Küme | Birleşen kanıt | Kalıcı değer |
|---|---|---|---|
| 1 | Bellek teşhisinde birden fazla ölçüm | Inside Java, Oracle NMT, Spring Actuator, Kubernetes | Heap, süreç belleği, CPU ve gecikmeyi aynı yük altında karşılaştırmak |
| 2 | Veri akışında kaynak sahipliği | Spring DataBuffer ve Netty | Başarı kadar iptal ve hata yollarında da kaynak ömrünü sınamak |
| 3 | Veri biçimi düzeyinde kapasite kontrolü | Hardwood duyurusu ve GitHub düzeltmeleri | Satır sayısının yanında liste genişliğini ve batch belleğini ölçmek |

Bunlar yeni bir endüstri standardı ilanı değildir; kaynakların birlikte okunmasından çıkan teknik kümelerdir. “Daha küçük heap her zaman daha ucuzdur” ve “reaktif API kullanınca bellek otomatik sınırlanır” varsayımları yerine iş yüküne özgü kanıt aranmalı.

## Araçlar ve Kütüphaneler

**NMT ve `jcmd`:** Yeni araç değil, mevcut teşhis yeteneği. Kontrollü bir ortamda JVM'yi `-XX:NativeMemoryTracking=summary` ile başlatıp ısınma sonrasında karşılaştırma alınabilir:

```sh
jcmd <pid> VM.native_memory baseline
# Temsilî yük ve soğuma evresi sonrasında:
jcmd <pid> VM.native_memory summary.diff scale=MB
```

NMT sonradan başlatılamaz; açılış planı gerekir. Oracle rehberi yüzde 5–10 performans maliyeti belirtir; gerçek iş yükünde ayrıca ölçülmeli. NMT çıktısındaki reserved/committed değerleri RSS ile eşit kabul edilmemeli. [Oracle NMT rehberi](https://docs.oracle.com/en/java/javase/25/vm/native-memory-tracking.html)

**Hardwood 1.1.0.Beta1:** Parquet yazımı için satır ve sütun odaklı API'ler, okumada Bloom filtresi ve sözlük üzerinden satır grubu eleme sunuyor. Yazarın duyurusuna göre yazıcı tek iş parçacıklı ve doğrudan S3 yazımı henüz yok. Kuluçka aşamasındaki sütun okuyucu API'sinde kırıcı değişiklikler bulunuyor. Parquet kullanmayan servisler için düşük öncelikli. [Gunnar Morling](https://www.morling.dev/blog/parquet-file-write-support-bloom-filters-improved-performance-hardwood-1-1-0-beta1/)

## Java / Spring Geliştiricileri İçin Etkiler

Aşağıdaki çalışma planı bu raporun önerisidir; burada bir uygulama üzerinde benchmark çalıştırılmadı.

1. Bir MVC servisi veya reaktif ağ geçidi seçin. Trafik şekli, veri boyutu ve bağımlılık gecikmeleri sabit kalacak bir yük senaryosu hazırlayın.
2. Heap/buffer pool, GC ve thread metriklerini Actuator üzerinden toplayın; Kubernetes bellek kullanımı, restart nedeni ve CPU kısıtlama verisini aynı zaman eksenine ekleyin. Actuator JVM metrikleri `jvm.` altında sunulur; container görünürlüğü ayrıca gerekir. [Spring Boot metrikleri](https://docs.spring.io/spring-boot/reference/actuator/metrics.html)
3. Aynı JVM ve GC ile iki heap bütçesini karşılaştırın. Başarı ölçütü yalnızca düşük bellek değil; kabul edilen hata oranı, p99 gecikme ve başarılı istek başına kaynak maliyeti olsun.
4. Yavaş tüketici, büyük gövde, bağlantı kesilmesi ve timeout senaryolarını çalıştırın. Yük durduğunda tutulan belleğin davranışını inceleyin; havuzların belleği hemen işletim sistemine vermemesi tek başına sızıntı kanıtı değildir.
5. Parquet işi varsa satır sayısını sabit tutup liste elemanı sayısını artırın. Sonuç doğruluğunu bağımsız bir okuyucuyla ve tepe bellek ölçümüyle denetleyin.

Kubernetes CPU limitini kısıtlama yoluyla, bellek limitini ise bellek baskısında OOM mekanizmasıyla uygular. Bu nedenle JVM heap alarmı, container sonlandırma nedenini tek başına açıklamayabilir. [Kubernetes kaynak yönetimi](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

## Fırsatlar ve Riskler

| Karar | Fırsat | Risk / geçiş maliyeti |
|---|---|---|
| Heap ve container ölçümünü eşleştirmek | Yanlış heap artırımlarını azaltmak | Farklı bellek ölçümlerini aynı anlamdaymış gibi toplamak |
| Kontrollü NMT profili | Native büyümeyi alt sistemlere ayırmak | Kapsama boşlukları ve ölçüm maliyeti |
| Özel tampon zincirini gözden geçirmek | İptal altında biriken kaynakları bulmak | Sahipliği devredilmiş tamponu yeniden serbest bırakmak |
| Hardwood beta pilotu | Nested veri ve dosya üretiminde yeni seçenek | API değişimi, dosya uyumluluğu ve yazıcı kapasitesi |

Netty'de referans sayımı GC'den ayrı bir yaşam döngüsü taşır. `release()` çağrısını her noktaya eklemek çözüm değildir; sahiplik devrini izlemek gerekir. Gelişmiş sızıntı algılama kontrollü teşhiste kullanılmalı, maliyeti ölçülmelidir. [Netty kaynak sahipliği](https://netty.io/wiki/reference-counted-objects.html)

## İzlenmesi Gereken Konular

- Hardwood sonraki betalarında yazıcı paralelliği, S3 yazımı ve kuluçka API değişimlerinin netleşmesi.
- Seçilen servis için yük sonrası heap ile native bellek eğrilerinin ayrışıp ayrışmadığı.
- Boot/Framework yükseltmelerinde özel codec ve Gateway filtrelerinin iptal testleri.
- [OpenJDK JDK 27](https://openjdk.org/projects/jdk/27/) sayfası RC aşamasını ve 15 Eylül hedefini gösteriyor; önceki rapordaki geçiş incelemesi bugün yeniden anlatılmıyor.

## Kaynak Bazlı Bulgular

### 1. RAM–CPU ilişkisini performans kararına dahil etmek

- **Başlık (title):** Java bellek yönetimi ilkeleri gündemde.
- **Kaynak (source):** [Inside Java konuşma duyurusu](https://inside.java/2026/09/04/memory-management-principles-java/)
- **Yazar (author):** Ron Pressler.
- **Tarih (date):** 2026-09-04; tarama 2026-09-06.
- **Kategori (category):** JVM performansı.
- **Etiketler (tags):** JVM, GC, bellek, CPU, kapasite.
- **Özet (summary):** Duyuru, Java GC tasarım tercihleri ile RAM–CPU ilişkisini konu ediyor. Video tam metni incelenmedi; sayfadaki açıklama esas alındı.
- **Önemi (why_it_matters):** Bellek azaltımının toplam çalışma maliyetine etkisi ölçülmeli.
- **Java/Spring ilişkisi (java_spring_relevance):** Servis kaynak bütçeleri için deney tasarımını etkiler.
- **Aksiyon (actionability):** Planlı ölçüm.
- **Etki (impact_level):** Yüksek.
- **Fırsatlar (opportunities):** Aynı SLO altında daha iyi kapasite seçimi.
- **Riskler (risks):** Konuşma duyurusunu sayısal performans kanıtı saymak.
- **Geçiş notları (migration_notes):** Sürüm yükseltmesi gerektirmez; önce mevcut ortamda baz ölçüm alın.

### 2. NMT'nin kapsamını bilerek native bellek teşhisi

- **Başlık (title):** NMT bütün süreç belleğini açıklamaz.
- **Kaynak (source):** [Oracle Java 25 NMT](https://docs.oracle.com/en/java/javase/25/vm/native-memory-tracking.html)
- **Yazar (author):** Oracle dokümantasyon ekibi.
- **Tarih (date):** Yayın tarihi belirtilmemiş; kontrol 2026-09-06.
- **Kategori (category):** Operasyon ve teşhis.
- **Etiketler (tags):** HotSpot, NMT, jcmd, native-bellek.
- **Özet (summary):** JVM içi kullanım izlenir; üçüncü taraf native kod ve bazı JDK kütüphane tahsisleri kapsam dışıdır.
- **Önemi (why_it_matters):** Eksik ölçüm yanlış sızıntı teşhisine yol açabilir.
- **Java/Spring ilişkisi (java_spring_relevance):** Agent ve native kütüphane kullanan servislerde yararlı.
- **Aksiyon (actionability):** Kontrollü pilot.
- **Etki (impact_level):** Yüksek.
- **Fırsatlar (opportunities):** Yük öncesi/sonrası alt sistem farkı.
- **Riskler (risks):** NMT toplamını container belleği sanmak.
- **Geçiş notları (migration_notes):** Başlangıç bayrağı ve yeniden başlatma planı gerekir.

### 3. Reaktif tamponların iptal sırasında yaşam döngüsü

- **Başlık (title):** Özel DataBuffer kodunda discard yollarını doğrulayın.
- **Kaynak (source):** [Spring Framework referansı](https://docs.spring.io/spring-framework/reference/core/databuffer-codec.html), [Netty rehberi](https://netty.io/wiki/reference-counted-objects.html)
- **Yazar (author):** Spring ve Netty bakım ekipleri.
- **Tarih (date):** Sürekli güncellenen belgeler; kontrol 2026-09-06.
- **Kategori (category):** Reaktif programlama, kaynak yönetimi.
- **Etiketler (tags):** WebFlux, Gateway, DataBuffer, iptal, Netty.
- **Özet (summary):** Özel decoder zincirlerinde tampon atabilen operatörler için uygun `doOnDiscard(DataBuffer.class, DataBufferUtils::release)` işlemi gerekir.
- **Önemi (why_it_matters):** Başarı testi hata ve iptal yollarını kapsamaz.
- **Java/Spring ilişkisi (java_spring_relevance):** Gövde işleyen özel filtreler doğrudan etkilenir.
- **Aksiyon (actionability):** Hemen kod incelemesi.
- **Etki (impact_level):** Yüksek; özel tampon kodu varsa.
- **Fırsatlar (opportunities):** İptal altında kaynak kararlılığı.
- **Riskler (risks):** Çift serbest bırakma veya elde tutulan tamponlar.
- **Geçiş notları (migration_notes):** Standart codec akışına körlemesine release eklemeyin; sahipliği belirleyin.

### 4. JVM metriklerini container kanıtıyla birleştirmek

- **Başlık (title):** Tek heap grafiği yerine ortak teşhis görünümü.
- **Kaynak (source):** [Spring Boot Actuator](https://docs.spring.io/spring-boot/reference/actuator/metrics.html), [Kubernetes](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- **Yazar (author):** Spring ve Kubernetes dokümantasyon ekipleri.
- **Tarih (date):** Yayın tarihi belirtilmemiş; kontrol 2026-09-06.
- **Kategori (category):** Gözlemlenebilirlik.
- **Etiketler (tags):** Actuator, Micrometer, Kubernetes, OOM, GC.
- **Özet (summary):** JVM bellek, buffer pool ve GC verileri ile container kaynak davranışı farklı katmanları açıklar.
- **Önemi (why_it_matters):** Olayın hangi katmanda başladığını ayırmayı sağlar.
- **Java/Spring ilişkisi (java_spring_relevance):** Mevcut Actuator kurulumunun teşhis değerini artırır.
- **Aksiyon (actionability):** Hemen pano ve alarm incelemesi.
- **Etki (impact_level):** Yüksek.
- **Fırsatlar (opportunities):** Daha kısa olay teşhisi.
- **Riskler (risks):** Zaman aralığı ve ölçüm anlamı farklı verileri yanlış karşılaştırmak.
- **Geçiş notları (migration_notes):** Gerçek registry'de bulunan meter adlarını doğrulayın; container ölçümlerini ayrıca sağlayın.

### 5. Hardwood beta: yazma desteği ve nested veri güvenilirliği

- **Başlık (title):** Hardwood 1.1.0.Beta1 kontrollü denemeye değer.
- **Kaynak (source):** [Yazar duyurusu](https://www.morling.dev/blog/parquet-file-write-support-bloom-filters-improved-performance-hardwood-1-1-0-beta1/), [etiketli sürüm](https://github.com/hardwood-hq/hardwood/releases/tag/v1.1.0.Beta1)
- **Yazar (author):** Gunnar Morling ve Hardwood katkıcıları.
- **Tarih (date):** 2026-08-31; kontrol 2026-09-06.
- **Kategori (category):** Veri işleme ve kütüphane sürümü.
- **Etiketler (tags):** Hardwood, Parquet, Spring-Batch, nested-list, heap, beta.
- **Özet (summary):** Yeni yazma API'lerine ek olarak batch belleği ve filtre doğruluğu düzeltmeleri yayımlandı.
- **Önemi (why_it_matters):** Dosya şekli kaynak tüketimini ve doğru sonuç üretimini etkiliyor.
- **Java/Spring ilişkisi (java_spring_relevance):** Parquet işleyen Java batch ve arşiv servisleri için anlamlı; hazır Spring entegrasyonu iddiası yok.
- **Aksiyon (actionability):** Parquet kullanıcılarında pilot; diğerlerinde izleme.
- **Etki (impact_level):** Orta; ilgili mevcut kullanıcıda yüksek.
- **Fırsatlar (opportunities):** Okuma/yazma alternatifini aynı veri setinde değerlendirmek.
- **Riskler (risks):** Beta API değişimi ve henüz tamamlanmamış yazıcı yetenekleri.
- **Geçiş notları (migration_notes):** Bağımsız okuyucuyla çıktı karşılaştırması, nested liste yükü ve geri dönüş dosyaları hazırlayın.

### Tarama kapsamı ve kanıt sınırları

[Spring Blog](https://spring.io/blog/), [proje sayfaları](https://spring.io/projects), Boot GitHub sürüm notları ve güvenlik akışı başlangıçta kontrol edildi. [Josh Long'un 1 Eylül yazısı](https://spring.io/blog/2026/09/01/this-week-in-spring-september-1-2026/) üzerinden bakım ekibi ve topluluk gündemi incelendi. [Oracle Java Blog](https://blogs.oracle.com/java/) ile OpenJDK ve Inside Java kontrol edildi; OpenJDK tarayıcı erişimi hata verince sayfa `curl` ile doğrulandı.

[InfoQ Java](https://www.infoq.com/java/) ve [Baeldung](https://www.baeldung.com/) keşif için tarandı; teknik sonuçlar birincil kaynaklara dayandırıldı. Baeldung'un tarayıcı çıktısı okunabildi, doğrudan HTTP isteği challenge döndürdü. [Burak KUTBAY](https://blog.burakkutbay.com/) üzerindeki güncel görünür başlıklar kontrol edildi; bugünün kararını değiştiren yeni bir bulgu seçilmedi. Tarama Netty, Kubernetes ve Hardwood resmi kaynaklarıyla genişletildi.

Hardwood dokümantasyonunun arama aracındaki `latest/release-notes` görünümü Nisan sürümlerinde kalıyordu. Ağustos beta varlığı etiketli GitHub sürümü ve yazar duyurusuyla doğrulandı. Duyuru ile sürüm notlarının ayrıntıları arasında farklılık bulunduğundan henüz desteklenmeyen özelliklerin tam listesi çıkarılmadı; benimseme öncesinde kullanılan artefaktın API'si sınanmalı.

## Sonuç

Bugünün en yüksek getirili işi, bir serviste heap, native bellek, container sınırı ve gecikmeyi aynı yük deneyi içinde görünür kılmak. Özel reaktif kodda iptal yollarını, Parquet işlerinde liste genişliğini test kapsamına alın. Yeni kütüphane denemesinde hızdan önce doğru sonuç ve sınırlı kaynak tüketimi kanıtı arayın.
