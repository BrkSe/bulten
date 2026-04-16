# Günlük Java / Spring Ekosistem Raporu

Tarih: `16 Nisan 2026, 09:08 TRT`

Kapsam: `15 Nisan 2026 09:05 TRT` ile `16 Nisan 2026 09:08 TRT` arasındaki günlük tarama.

Tekrar azaltma notu: Önceki raporlarda ayrıntılı işlendiği için `RestTemplate -> RestClient` yönü, `Spring Cloud Data Flow` açık kaynak çizgisinin kapanması, `Spring Security 7 MFA`, `Spring Boot configuration properties at scale` ve genel `Boot 4 / Oakwood` tanıtım anlatısı bugün yeniden ana bulgu yapılmadı. Bugünkü rapor, farklı kaynaklardan gelen yeni ve daha az tekrar eden sinyallere odaklanır.

Kaynak tarama notu: [Spring Blog](https://spring.io/blog/), [Spring Releases](https://spring.io/blog/category/releases/), [Spring Cloud release docs](https://docs.spring.io/spring-cloud-release/reference/index.html), [Spring Cloud 2025.0.2](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released/), [Spring Cloud 2025.1.1](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released/), [Spring AI Session API yazısı](https://spring.io/blog/2026/04/15/spring-ai-session-management/), [Spring Modulith 2.1 M4 duyurusu](https://spring.io/blog/2026/03/27/spring-modulith-2-1-m4-2-0-5-and-1-4-10-released/), [OpenJDK JEP 522](https://openjdk.org/jeps/522), [OpenJDK JEP 527](https://openjdk.org/jeps/527), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’un haftalık özeti](https://spring.io/blog/2026/04/14/this-week-in-spring-april-14-2026/), [Gunnar Morling](https://www.morling.dev/), ilgili GitHub/dokümantasyon sayfaları ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandı. `Baeldung` ve `Burak KUTBAY` tarafında bugünün mimari karar kalitesini anlamlı biçimde değiştiren yeni birinci seviye sinyal görülmedi. `Oracle Java Blog` tarafında `Oracle Java Verified Portfolio / JavaFX` duyurusu izlendi, ancak bugünkü Spring backend kararlarına doğrudan etkisi sınırlı olduğu için ana bulgu yapılmadı.

## Öne Çıkan Başlıklar

- `Spring AI`, düz mesaj listesi mantığından çıkıp `event-sourced`, sıkıştırılabilir ve çok ajanlı kullanıma uygun yeni bir `Session API` yönüne gidiyor. Bu, `ChatMemory` kullanan ekipler için mimari bir yön değişimi.
- `Spring Cloud` artık pratikte tek bir “güncel stabil” hat değil. Resmi dökümantasyon aynı anda `2025.0.2 / Boot 3.5.13` ve `2025.1.1 / Boot 4.0.2` stabil hatlarını gösteriyor. Platform ekipleri bilinçli hat seçimi yapmak zorunda.
- `InfoQ` üzerindeki Spring team söyleşisi, `Spring Boot 3.5` için son ücretsiz açık kaynak yayın penceresini `Haziran 2026` olarak çerçeveliyor. Bu, 2026 yol haritası için takvim baskısı yaratıyor.
- `JDK 26`, varsayılan `G1` toplayıcı kullanan servislerde anlamlı throughput artışı vadeden somut bir runtime değişikliği getiriyor; `JDK 27` ise `TLS 1.3` tarafında post-quantum hybrid key exchange’i platform seviyesine taşıyor.
- `Spring Modulith` ve `Hardwood` tarafındaki sinyaller, Java backend araçlarının daha operasyonel, daha hafif ve daha modüler bir yöne kaydığını gösteriyor.

## Kritik Güncellemeler

1. Son 24 saatte yeni bir `Spring Boot`, `Spring Framework`, `Spring Security` veya `JDK` GA duyurusu çıkmadı. Buna rağmen karar kalitesi yüksek dört net güncelleme var.

2. `Spring AI Session API`, `ChatMemory` yerine geçecek yeni bir soyutlama olarak çerçeveleniyor. Hedef sürüm `Spring AI 2.1` ve yazıda açıkça `ChatMemory` için ileride deprecation sinyali veriliyor.

3. `Spring Cloud 2025.0.2`, `Spring Boot 3.5.13` tabanlı stabil hat olarak güncel kalırken `Spring Cloud` referans dokümanı `2025.1.1` hattını `Spring Boot 4.0.2` ile birlikte stabil gösteriyor. Bu, tek çizgili değil çift çizgili bir platform gerçekliği oluşturuyor.

4. `InfoQ` söyleşisindeki en kritik planlama mesajı, `Spring Boot 3.5` için son ücretsiz açık kaynak sürüm penceresinin `Haziran 2026` olması. Bu bilgi, `Boot 4` geçişini “bir gün bakarız” seviyesinde bırakan ekipler için artık takvimsel bir risk.

5. `JDK 26` ve `JDK 27` sinyalleri yalnızca dil/JEP haberi değil. Biri doğrudan üretim throughput’una, diğeri doğrudan TLS güvenlik varsayılanlarına dokunuyor.

## Trendler ve Sinyaller

1. `Spring AI` tarafında “bellek” artık demo seviyesi bir sohbet geçmişi özelliği değil; sıkıştırma, geri çağırma, dallanma izolasyonu ve kalıcı saklama içeren gerçek bir runtime katmanına dönüşüyor. Bu kalıcı değer üreten bir sinyal.

2. `Spring Cloud` ve `Spring Boot` dünyasında sürüm seçimi giderek “en güncel olanı al” refleksinden çıkıyor. Artık hangi servis grubunun `Boot 3.5` hattında, hangisinin `Boot 4.0` hattında kalacağı platform kararı haline geliyor.

3. `JDK` yol haritası üç yönlü ilerliyor: daha yüksek throughput, daha güçlü varsayılan güvenlik ve eski yüzeylerin temizlenmesi. Bu da `EA`/erken test sürecini büyük ekipler için opsiyon olmaktan çıkarıyor.

4. `Spring Modulith` ile gelen `JobRunr` tabanlı event externalization ve benzeri araçlar, “mikroservis ya da hiçbir şey” ikiliğini zayıflatıyor. Modüler monolit içinde güvenilir asenkron çalışma akışları daha uygulanabilir hale geliyor.

5. Gürültü ile kalıcı değer ayrımı bugün net:
- Kalıcı değer: `Session API`, `Spring Cloud` hat ayrımı, `Boot 3.5 -> 4` takvim baskısı, `JDK 26 G1`, `JDK 27 PQC`, `Modulith` entegrasyonları.
- Düşük öncelik: genel tutorial içerikleri, `Maven TUI` gibi henüz çevresel etkisi sınırlı araçlar, konferans promosyonları.

## Araçlar ve Kütüphaneler

- `Spring Modulith 2.1 M4`, `JobRunr` ile event externalization desteği ekliyor. Bu, transaction sonrası domain event’leri daha güvenilir şekilde dışsallaştırmak isteyen ekipler için dikkate değer.
- `Hardwood 1.0.0.Beta1`, `Parquet` okuma tarafında `S3 backend`, `predicate push-down`, `Avro bindings` ve `CLI` getiriyor. Genel Spring kitlesi için ana akım değil, ancak veri odaklı batch/ETL servisleri için izlenmeye değer.
- `Spring Cloud 2025.0.2` içindeki `OpenFeign 13.6.1`, `Fabric8 7.3.2` ve `Eureka 2.0.6` güncellemeleri, altyapı kütüphanelerinin yavaş ama istikrarlı biçimde güncellendiğini gösteriyor.
- Bugün yeni ve yüksek etkili bağımsız OSS kütüphane patlaması yok. Araç tarafındaki esas sinyal, mevcut çerçevelerin daha operasyonel use-case’lere doğru genişlemesi.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring AI` kullanan ekipler, bellek katmanını artık elle yazılmış `List<Message>` veya basit `ChatMemory` adaptörleri etrafında kurmamalı. Kısa vadede en azından bu soyutlama değişikliğine hazırlık için kod envanteri çıkarılmalı.
- `Spring Cloud` kullanan kurumsal platformlarda tek BOM ve tek yükseltme takvimi yaklaşımı zayıflıyor. `Boot 3.5` tabanlı servisler ile `Boot 4` denemeleri aynı release train üzerinde düşünülmemeli.
- `Boot 3.5` üzerinde kalmayı planlayan ekipler için `Haziran 2026` artık gerçek bir yol ayrımı. Ya `Boot 4` pilotu başlayacak ya da ücretli destek / uzatılmış yaşam stratejisi netleşecek.
- `Java 26` değerlendiren ekipler için performans haberi bu kez akademik değil; varsayılan `G1` üzerinde doğrudan yük testi yapılabilecek kadar pratik. Özellikle yazma yoğun, nesne grafiği hareketli servislerde karşılığı olabilir.
- Güvenlik tarafında `JDK 27` ile birlikte TLS stack davranışı daha da önemli hale geliyor. Kod değiştirmeden fayda almak mümkün, ancak bunun bedeli edge cihazları ve kurumsal TLS politikalarıyla daha erken test ihtiyacı.

## Fırsatlar ve Riskler

Fırsatlar:

- `Spring AI` tabanlı uygulamalarda ortak oturum yönetimi, context compaction ve recall araması için standart bir çerçeveye yaklaşmak.
- `Spring Cloud` servislerini iş kritikliğine göre iki sürüm hattına ayırıp yükseltme riskini kademeli yönetmek.
- `Boot 4` geçişini `OpenRewrite`, `Jackson 2` uyumluluk katmanı ve migration guide ile kontrollü bir modernizasyon projesine dönüştürmek.
- `Java 26` ile aynı collector üzerinde throughput kazanımı alıp GC stratejisini sade tutmak.
- `Modulith` ve `JobRunr` kombinasyonuyla modüler monolit içinde daha güvenilir event yayın akışları kurmak.

Riskler:

- `ChatMemory` kullanan kodu yaymaya devam edip kısa süre sonra ikinci bir mimari göç işi çıkarmak.
- `Spring Cloud` sürüm hattını yanlış seçip `Boot 4.0.x` ile uyumsuz BOM kombinasyonlarına düşmek.
- `Haziran 2026` takvimini görmezden gelip `Boot 3.5` üstünde sıkışık ve reaktif bir yükseltme takvimine mahkum olmak.
- `JDK 26 G1` kazançlarını genelleyip kendi workload’unda doğrulamadan performans beklentisi oluşturmak.
- `JDK 27` PQC/TLS tarafında edge proxy, ingress, load balancer ve kurumsal güvenlik cihazı uyumluluğunu geç test etmek.
- `Modulith` milestone sürümünü üretime erken taşımak ve `JobRunr` entegrasyonunu gerçek teslimat garantisi yerine koymak.

## İzlenmesi Gereken Konular

- `Spring AI 2.1` takviminde `Session API` ne hızda olgunlaşıyor ve `ChatMemory` için resmi deprecation ne zaman netleşiyor?
- `Spring Cloud 2025.1.2-SNAPSHOT` ve `2025.0.3-SNAPSHOT` hatlarında `Boot 4.0.x` ile `3.5.x` ayrımı nasıl şekilleniyor?
- `Spring team` veya topluluk tarafında `Boot 4` için olgun `OpenRewrite` reçeteleri hangi düzeye geliyor?
- `JDK 27` erken testlerinde `ThreadPoolExecutor.finalize()` kaldırılması ve eski locale çeviri kaynaklarının temizlenmesi gibi Quality Outreach başlıkları kurumsal kod tabanlarında sürpriz üretiyor mu?
- `PQC` desteğinin gerçek etkisi, Java uygulamasından çok TLS uçlarındaki cihaz ve platform uyumluluğuna bağlı olacak. Bu yüzden uygulama ekipleri ile platform/network ekiplerinin birlikte test yapması gerekebilir.
- `Hardwood` tarafında `1.0.0.Final` ve yazma desteği (`write support`) geldiğinde Java batch/veri servislerinde daha ciddi bir alternatif oluşabilir.

## Kaynak Bazlı Bulgular

### 1. `Spring AI` tarafında bellek katmanı `Session API` ile yeniden tanımlanıyor

- **title:** `Spring AI Session API`, düz mesaj geçmişinden event-sourced oturum modeline geçiş sinyali veriyor
- **source:** [Spring AI Agentic Patterns (Part 7): Session API — Event-Sourced Short-Term Memory with Context Compaction](https://spring.io/blog/2026/04/15/spring-ai-session-management/)
- **author:** `Christian Tzolov`
- **date:** `15 Nisan 2026`
- **category:** `agentik-mimari`
- **tags:** `spring-ai`, `session-api`, `chatmemory`, `context-compaction`, `multi-agent`, `jdbc`
- **summary:** Yeni `Session API`, her mesajı, tool çağrısını ve tool sonucunu `SessionEvent` olarak saklıyor; turn-boundary tabanlı compaction, çok ajanlı branch izolasyonu, keyword ile geri çağırma ve `JDBC` kalıcılığı sunuyor. Yazıda bunun `Spring AI 2.1` hedefli olduğu ve `ChatMemory`nin zamanla bunun lehine deprecated edileceği açıkça belirtiliyor.
- **why_it_matters:** Tool kullanan ve uzun bağlamlı ajan akışlarında basit mesaj listesini kısaltmak çoğu zaman bağlamı bozar. Burada framework düzeyinde daha sağlam bir bellek modeli geliyor.
- **java_spring_relevance:** `Spring AI` ile agent, copilot, internal assistant, workflow automation veya tool-calling yapan Java ekipleri doğrudan etkilenir.
- **actionability:** `yakın_vade_poc`
- **impact_level:** `yüksek`
- **opportunities:** Elle yazılmış memory adapter’larını azaltmak; session persistence ve recall aramasını standartlaştırmak; çok ajanlı akışlarda daha güvenli state yönetimi kurmak.
- **risks:** Topluluk organizasyonunda gelişen ve henüz ana ürün çizgisine tam girmemiş bir modülü çok erken üretime almak; şema ve API evrimi nedeniyle erken kilitlenmek.
- **migration_notes:** `ChatMemory` kullanım envanterini çıkarın. Memory erişimini soyutlayın. Kritik olmayan bir ajan akışında `SessionMemoryAdvisor` ve `JDBC` repository ile pilot yapın. Üretim kararı için `2.1` yol haritasını beklemek daha güvenli olabilir.

### 2. `Spring Cloud` artık iki stabil hatta bölünmüş durumda

- **title:** `Spring Cloud` için resmi sinyal: `2025.0.2 / Boot 3.5.13` ve `2025.1.1 / Boot 4.0.2` aynı anda stabil
- **source:** [Spring Cloud 2025.0.2 (aka Northfields) Has Been Released](https://spring.io/blog/2026/04/02/spring-cloud-2025-0-2-aka-northfields-has-been-released/), [Spring Cloud 2025.1.1 (aka Oakwood) Has Been Released](https://spring.io/blog/2026/01/29/spring-cloud-2025-1-1-aka-oakwood-has-been-released/), [Spring Cloud Train Reference Documentation](https://docs.spring.io/spring-cloud-release/reference/index.html)
- **author:** `Ryan Baxter`
- **date:** `2 Nisan 2026`, `29 Ocak 2026`, `16 Nisan 2026 erişim`
- **category:** `sürüm-treni-stratejisi`
- **tags:** `spring-cloud`, `northfields`, `oakwood`, `spring-boot-3.5`, `spring-boot-4.0`, `microservices`, `config`
- **summary:** Resmi kaynaklar birlikte okunduğunda iki stabil hat açıkça görülüyor: `2025.0.2` hattı `Spring Boot 3.5.13` üstünde ve `Spring Cloud Config` için `CVE-2026-22739` düzeltmesini içeriyor; `2025.1.1` hattı ise `Spring Boot 4.0.2` için stabil dokümante ediliyor ve `2025.0.0` hattının `Boot 4.0.1+` ile uyumsuzluğunu çözmek için çıkarılmış. Bu sonuç, resmi release yazıları ve reference sayfasından yapılan bir çıkarımdır.
- **why_it_matters:** Release train seçimi artık sadece patch seviyesi karar değil; tüm mikroservis filosunun uyumluluk, CVE alımı ve yükseltme maliyetini belirleyen bir platform kararı.
- **java_spring_relevance:** `Spring Cloud Config`, `Gateway`, `OpenFeign`, `Kubernetes`, `Netflix`, `Stream` ve `Contract` kullanan ekipler doğrudan etkilenir.
- **actionability:** `hemen_envanter_ve_hat_secimi`
- **impact_level:** `yüksek`
- **opportunities:** Kritik eski servisleri `Boot 3.5` hattında stabil tutarken yeni servisleri `Boot 4` ile daha kontrollü açmak; yükseltmeleri tek dalga yerine bölünmüş dalgalar halinde yönetmek.
- **risks:** `Boot 4.0.x` ile yanlış `2025.0.x` kombinasyonuna düşmek; tek BOM ile tüm servisleri sürdürmeye çalışmak; `Config` tarafındaki güvenlik düzeltmesini geciktirmek.
- **migration_notes:** Servis portföyünü hangi hat üzerinde kalacağına göre sınıflandırın. BOM sürümünü platform bazında sabitleyin. `Boot 4` pilotları için `2025.1.x` dışında kombinasyon denemeyin. `Config` kullanan servislerde `2025.0.2` veya üstünü plan dışına itmeyin.

### 3. `Spring Boot 3.5` için zaman penceresi daralıyor

- **title:** `InfoQ` söyleşisi, `Spring Boot 3.5` için son ücretsiz OSS sürüm penceresini `Haziran 2026` olarak konumluyor
- **source:** [The Spring Team on Spring Framework 7 and Spring Boot 4](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [This Week in Spring - April 14th, 2026](https://spring.io/blog/2026/04/14/this-week-in-spring-april-14-2026/)
- **author:** `Karsten Silz`, `Phil Webb`, `Sam Brannen`, `Rossen Stoyanchev`, `Mark Pollack`, `Martin Lippert`, `Michael Minella`, `Josh Long`
- **date:** `Nisan 2026`, `14 Nisan 2026`
- **category:** `migration-path`
- **tags:** `spring-boot-4`, `spring-boot-3.5`, `jackson-3`, `openrewrite`, `support-window`
- **summary:** Spring team ile yapılan InfoQ söyleşisine göre `Spring Boot 3.5`, `Haziran 2026` içinde son ücretsiz açık kaynak sürümünü alacak. Aynı söyleşi, `Boot 4` geçişinin `Jackson 2` uyumluluk modülü, migration guide, config rename yardımları ve topluluk `OpenRewrite` reçeteleri ile yönetilebilir olacağını vurguluyor. Josh Long da haftalık özetinde bu içeriği özellikle öne çıkarıyor.
- **why_it_matters:** Bu artık teknik değil takvimsel bir problem. 2026 içinde `Boot 4` planı olmayan ekipler, ücretsiz güncelleme penceresinin kapanmasını yönetmek zorunda kalacak.
- **java_spring_relevance:** `Spring Boot` tabanlı kurumsal servisler, JSON serileştirme davranışı, starter uyumluluğu ve upgrade bütçesi açısından doğrudan ilgili.
- **actionability:** `bu_ceyrekte_planla`
- **impact_level:** `orta-yüksek`
- **opportunities:** Göçü son dakikaya bırakmadan pilot servis seçmek; `OpenRewrite` ile mekanik değişiklikleri ucuzlatmak; `Jackson 3` etkisini erken görmek.
- **risks:** `Haziran 2026` sonrasına kadar bekleyip yükseltmeyi sıkışık takvimde yapmak; `Jackson 3` ve üçüncü parti starter etkisini küçümsemek; destek modelini iş birimleriyle konuşmadan bırakmak.
- **migration_notes:** En az bir pilot servisi `Boot 4` hattına çıkarın. `ObjectMapper` özelleştirmeleri, custom module’lar ve JSON testlerini ayrı inceleyin. Üçüncü parti starter’ların `Boot 4` uyumluluk durumunu şimdiden doğrulayın.

### 4. `JDK 26`, varsayılan `G1` için gerçek throughput kazanımı vaat ediyor

- **title:** `JEP 522`, `G1` kullanan uygulamalarda senkronizasyon maliyetini düşürerek anlamlı throughput artışı hedefliyor
- **source:** [JEP 522: G1 GC: Improve Throughput by Reducing Synchronization](https://openjdk.org/jeps/522), [Inside Java Podcast Episode 54: How JDK 26 Improves G1's Throughput](https://inside.java/2026/04/09/podcast-054/)
- **author:** `Ivan Walulya`, `Thomas Schatzl`, `Nicolai Parlog`, `Stefan Johansson`
- **date:** `21 Ocak 2026 güncelleme`, `9 Nisan 2026`
- **category:** `jvm-performans`
- **tags:** `jdk26`, `g1`, `gc`, `throughput`, `latency`, `spring-boot`
- **summary:** `JEP 522`, uygulama thread’leri ile GC thread’leri arasındaki koordinasyonu azaltmak için ikinci card-table yaklaşımı getiriyor. Resmi JEP metni, referans güncellemesi yoğun workload’larda `yüzde 5-15` arası throughput kazanımı ve hafif pause-time iyileşmesi gözlendiğini aktarıyor.
- **why_it_matters:** Birçok Spring Boot servisi varsayılan collector olan `G1` ile çalışıyor ve collector seçimini sık değiştirmiyor. Bu yüzden aynı collector üzerinde gelen kazanç pratik değere sahip.
- **java_spring_relevance:** Yüksek istek hacimli REST servisleri, cache/ORM yoğun backend’ler, messaging worker’ları ve genel amaçlı Boot servisleri için anlamlı.
- **actionability:** `benchmarkle_izle`
- **impact_level:** `orta-yüksek`
- **opportunities:** Collector değiştirmeden throughput kazanmak; `G1`i daha fazla serviste güvenli default olarak tutmak; CPU verimliliğini artırmak.
- **risks:** JEP metnindeki kazançları kendi workload’una bire bir taşımak; sadece throughput’a bakıp p99 latency ve native memory davranışını ihmal etmek.
- **migration_notes:** `Java 26` değerlendiren servislerde aynı trafik profiliyle A/B yük testi yapın. `throughput`, `p99`, `CPU`, `GC pause` ve native memory metriklerini birlikte kıyaslayın.

### 5. `JDK 27`, `TLS 1.3` için post-quantum hazırlığını platform varsayılanına yaklaştırıyor

- **title:** `JEP 527`, `javax.net.ssl` kullanan uygulamalara kod değiştirmeden post-quantum hybrid TLS faydası getirebilir
- **source:** [JEP 527: Post-Quantum Hybrid Key Exchange for TLS 1.3](https://openjdk.org/jeps/527), [Java and Post-Quantum Cryptography](https://inside.java/2026/04/08/javaone-post-quantum-cryptography/)
- **author:** `Jamil Nimeh`, `Sean Mullan`
- **date:** `9 Şubat 2026 güncelleme`, `8 Nisan 2026`
- **category:** `güvenlik-platformu`
- **tags:** `jdk27`, `tls13`, `pqc`, `ml-kem`, `javax-net-ssl`, `security`
- **summary:** `JDK 27`, `TLS 1.3` için hybrid key exchange şemalarını ekliyor ve `X25519MLKEM768` grubunu istemci tercih sırasının başına koyuyor. Resmi JEP’e göre `javax.net.ssl` kullanan uygulamalar, karşı uç desteklediğinde kod değişmeden daha güçlü el sıkışma şemasından yararlanabilecek.
- **why_it_matters:** Servisler arası trafik, gateway bağlantıları, dış servis çağrıları ve TLS kullanan Java istemcileri Spring sistemlerinin temelidir.
- **java_spring_relevance:** `RestClient`, `WebClient`, `Kafka`, `JDBC over TLS`, gateway ve internal service communication kullanan Java/Spring ekipleri için doğrudan ilgili.
- **actionability:** `orta_vade_lab_test`
- **impact_level:** `orta`
- **opportunities:** Geleceğe dönük güvenlik hazırlığını platform seviyesinde almak; hassas veriyi uzun ömürlü tehdit modellerine karşı daha güçlü korumak.
- **risks:** Eski proxy/load balancer/güvenlik cihazı uyumluluğu; named group politikalarını elle kitlemiş ortamlarda beklenmeyen handshake sorunları.
- **migration_notes:** `JDK 27 EA` ile ingress/proxy/lb uyumluluk testleri planlayın. TLS handshake gözlemlenebilirliğini artırın. Named group veya TLS policy override’larınızı envanterleyin.

### 6. `Spring Modulith`, asenkron event dışsallaştırmasını daha operasyonel hale getiriyor

- **title:** `Spring Modulith 2.1 M4`, `JobRunr` tabanlı event externalization desteği getiriyor
- **source:** [Spring Modulith 2.1 M4, 2.0.5, and 1.4.10 released](https://spring.io/blog/2026/03/27/spring-modulith-2-1-m4-2-0-5-and-1-4-10-released/)
- **author:** `Oliver Drotbohm`
- **date:** `27 Mart 2026`
- **category:** `architecture-tooling`
- **tags:** `spring-modulith`, `jobrunr`, `event-publication-registry`, `aot`, `modular-monolith`
- **summary:** `2.1 M4`, `JobRunr` üzerinden event externalization desteği ekliyor; ayrıca `Event Publication Registry` için explicit annotation tetikleme ve `MomentsJacksonModule` için daha iyi `AOT` desteği getiriyor.
- **why_it_matters:** Transaction sonrası domain event’lerinin güvenilir ve gözlemlenebilir biçimde dışarı taşınması, modüler monolit mimarilerinde en zor operasyonel noktalardan biri.
- **java_spring_relevance:** `Spring Modulith` kullanan veya modüler monolit içinde daha sağlam event akışı kurmak isteyen ekipler için önemli.
- **actionability:** `uygun_takimlarda_deneme`
- **impact_level:** `orta`
- **opportunities:** Modüler monolitleri “yalnızca in-process event” sınırından çıkarmak; job-runner tabanlı daha operasyonel bir teslim modeli kurmak.
- **risks:** Milestone sürüm olgunluğu; `JobRunr` entegrasyonunu outbox/sevk garantilerinin tam eşleniği sanmak; erken üretim kullanımı.
- **migration_notes:** Sadece `Modulith` kullanan veya değerlendiren ekiplerde pilotlayın. Üretim kararından önce retry, idempotency ve event ordering beklentilerini açık testlerle doğrulayın.

### 7. Düşük öncelik ama ilginç araç sinyali: `Hardwood`

- **title:** Düşük öncelik: `Hardwood 1.0.0.Beta1`, Parquet okuma için hafif bağımlılık ve doğrudan obje depolama erişimi vadediyor
- **source:** [Hardwood Reaches Beta: S3, Predicate Push-Down, CLI, and More](https://www.morling.dev/blog/hardwood-reaches-beta-s3-predicate-push-down-cli/)
- **author:** `Gunnar Morling`
- **date:** `2 Nisan 2026`
- **category:** `oss-tooling`
- **tags:** `hardwood`, `parquet`, `s3`, `predicate-pushdown`, `java`, `performance`, `cli`
- **summary:** `Hardwood 1.0.0.Beta1`, `S3 backend`, `predicate push-down`, `Avro bindings` ve `CLI` ile geliyor. Yazıya göre kütüphane ağır zorunlu bağımlılıklar yerine Java’nın yerleşik `HTTP client`ını kullanarak minimal footprint hedefliyor.
- **why_it_matters:** Veri gölü veya obje depolama üstünden `Parquet` okuyan Java servislerinde Hadoop/SDK ağırlığını azaltma fikri ilginç ve maliyetli batch işlerinde karşılık bulabilir.
- **java_spring_relevance:** Batch, ETL, raporlama, veri zenginleştirme veya analitik kenar servisleri yazan Spring ekipleri için niş ama anlamlı.
- **actionability:** `nis_kullanimda_izle`
- **impact_level:** `düşük-orta`
- **opportunities:** Hafif veri erişimi; doğrudan obje depolama okuma; sınırlı veri seçimiyle ağ I/O azaltma.
- **risks:** Erken sürüm olgunluğu; `parquet-java` kadar geniş saha kanıtı olmaması; gözlemlenebilirlik ve edge-case uyumluluğunun henüz sınırlı olması.
- **migration_notes:** Yalnızca izole batch işlerinde pilotlayın. Doğruluk, schema uyumu, maliyet ve gözlemlenebilirlik tarafını üretim öncesi doğrulamadan yaymayın.

## Sonuç

Bugünün en değerli çıktısı yeni bir “release yağmuru” değil; `Java / Spring` yol haritasında hangi başlıkların gerçekten platform kararına dönüştüğünün netleşmesi.

En yüksek öncelikli üç sonuç şunlar: `Spring AI` için bellek katmanının `Session API` ile değişiyor olması, `Spring Cloud` tarafında artık tek bir stabil hattın değil iki ayrı üretim hattının fiilen var olması ve `Spring Boot 3.5` ücretsiz OSS penceresinin `Haziran 2026` içinde kapanacak olması. Bunlar yalnızca bilgi notu değil; roadmap, mimari yatırım ve yükseltme planı gerektiren başlıklar.

JDK tarafında ise `Java 26` ve `Java 27`, backend ekiplerine “yalnızca yeni syntax” değil, doğrudan runtime davranışı ve güvenlik varsayımı değişikliği getiriyor. Bu yüzden `EA` testleri, 2026 boyunca ciddi Java ekipleri için opsiyonel lüks değil, erken uyarı mekanizması haline geliyor.
