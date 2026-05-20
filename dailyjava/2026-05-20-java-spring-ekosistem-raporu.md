# Günlük Java / Spring Ekosistem Raporu

Tarih: 20 Mayıs 2026  
Tarama zamanı: 20 Mayıs 2026 09:09 TSİ  
Odak: Authorization Server güvenlik ve destek sınırı, JDK 26 reflection kırılımı, Spring Boot 4.1 gRPC hattı, modulith/integration/paketo eksenindeki yeni üretim sinyalleri

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), [Spring proje sayfaları](https://spring.io/projects), [Spring Boot 4.1 gRPC referansı](https://docs.spring.io/spring-boot/4.1/reference/io/grpc.html), [Spring gRPC proje sayfası](https://spring.io/projects/spring-grpc), [Spring Authorization Server proje sayfası](https://spring.io/projects/spring-authorization-server), [Inside Java](https://inside.java/), [OpenJDK JEP 500](https://openjdk.org/jeps/500), [Oracle Java Blog](https://blogs.oracle.com/java), [InfoQ Java/Spring](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’un 19 Mayıs 2026 tarihli This Week in Spring yazısı](https://spring.io/blog/2026/05/19/this-week-in-spring-may-19-2026), [Gunnar Morling’in blogu](https://www.morling.dev/blog/), [Burak KUTBAY’ın blogu](https://blog.burakkutbay.com/) ve ilgili GitHub release/repo sayfaları tarandı. 19 Mayıs raporunda merkezde olan Spring AI bellek değişimi, Spring Cloud Config/Function CVE hattı ve Spring Data RC1 sinyalini tekrar büyütmek yerine bugün odağı kimlik/yetkilendirme, JVM bütünlüğü, protokol desteği ve platform mühendisliği tarafına kaydırdım. Gunnar Morling tarafında en güncel yazılar hâlâ Hardwood/Parquet ekseninde; bugünkü Spring üretim kararlarını doğrudan değiştiren yeni bir gönderi görünmüyor. Burak KUTBAY tarafında en güncel pratik içerik hâlâ [HTTP Service Client](https://blog.burakkutbay.com/http-service-client-nedir-spring-boot-4-0.html/) ve [API versiyonlama](https://blog.burakkutbay.com/api-versiyonlama-spring-framework-7.html/) hattında.

## Öne Çıkan Başlıklar

- [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now) yalnız bir CVE yaması değil; aynı zamanda `1.5.x` hattının son nesil olduğu ve yeni özelliklerin [Spring Security 7.0](https://spring.io/projects/spring-authorization-server) içine taşındığı netleşti.
- [JDK 26 final field mutation uyarıları](https://inside.java/2026/05/15/quality-heads-up/) artık teorik değil; varsayılan davranış warning, gelecek sürümlerde ise error yönüne gidiyor. Reflection yoğun serializer, mapper, test ve legacy altyapılar için bu doğrudan uyumluluk işi.
- [Spring Boot 4.1 gRPC desteği](https://docs.spring.io/spring-boot/4.1/reference/io/grpc.html) resmi referansta ilk sınıf vatandaş gibi duruyor: starter, health bridge, SSL bundle, Spring Security, OAuth2 Resource Server uyumu ve test desteği aynı pakette.
- [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released) ile [Spring Integration 7.1.0-M3](https://spring.io/blog/2026/03/18/spring-integration-7-1-0-m3-available), “mikroservis zorunlu değil; sınırları kuvvetli tek deployable daha da güçleniyor” sinyalini sürdürüyor.
- [Paketo spring-boot buildpack 2026 yazısı](https://blog.paketo.io/posts/spring-boot-performance/) build aşamasını destek durumu, service binding politikası ve startup optimizasyonları için gerçek bir kontrol noktasına çeviriyor.

## Kritik Güncellemeler

### 1. Authorization Server tarafında hem güvenlik hem yol haritası değişti

[Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now), `CVE-2026-22752` ile dynamic client registration endpoint’lerinde client metadata doğrulama açığını kapatıyor. Fakat daha kritik sinyal, proje sayfasındaki yön değişimi: [Spring Authorization Server artık Spring Security 7.0’a taşındı](https://spring.io/projects/spring-authorization-server) ve `1.5.x` son nesil. Bu, in-house IdP ya da OAuth2/OIDC yetkilendirme sunucusu işleten ekipler için iki kat anlam taşıyor:

- Patch seviyesi yükseltilmeli.
- Orta vadeli platform kararı artık “SAS’te kalalım mı?” değil, “Security 7 çizgisine ne zaman hizalanıyoruz?” sorusu.

### 2. JDK 26, deep reflection tabanlı final field mutasyonuna fiilen sayaç başlattı

[Inside Java Quality Outreach notu](https://inside.java/2026/05/15/quality-heads-up/) ve [JEP 500](https://openjdk.org/jeps/500) birlikte okunduğunda mesaj açık:

- `Field::set` ile final field mutasyonu JDK 26’da varsayılan olarak warning üretiyor.
- Gelecekte varsayılan davranış `deny` tarafına kayacak.
- Yeni `--enable-final-field-mutation` ve `--illegal-final-field-mutation` seçenekleri geçiş dönemi için verildi.
- JFR üzerinde `jdk.FinalFieldMutation` eventi ile suçlu kodu yakalamak mümkün.

Bu konu “JDK notları arasında küçük bir satır” değil. Spring uygulamasının kendisi derlenmeye devam etse bile, çevredeki reflection kullanan serializer, mapper, test-double, bytecode ve legacy entegrasyon katmanları yüzünden üretim veya CI’de sürpriz yaşanabilir.

### 3. Spring Boot 4.1 hattında gRPC artık yan entegrasyon değil, platform parçası

[Spring Office Hours 19 Mayıs 2026 bölümü](https://spring.io/blog/2026/05/19/spring-office-hours-podcast-S5E16), Boot 4.1 tarafında gRPC’nin öne çıkan başlıklardan biri olduğunu söylüyor. Bu artık yalnız bir podcast cümlesi de değil; [resmi Boot 4.1 referansı](https://docs.spring.io/spring-boot/4.1/reference/io/grpc.html) şu alanları belge düzeyinde kapsıyor:

- `spring-boot-starter-grpc-server` ve `spring-boot-starter-grpc-client`
- Netty ve servlet container seçenekleri
- SSL bundle tabanlı TLS yapılandırması
- gRPC standard health service ile Spring Boot health bridge’i
- Spring Security ve OAuth2 Resource Server uyumu
- `@LocalGrpcServerPort` ile test desteği

Ek olarak [Spring gRPC proje sayfası](https://spring.io/projects/spring-grpc) bugün `1.0.3` stable ve `1.1.0-RC1` preview gösteriyor. Bu, internal RPC kullanan ekipler için “gRPC istersek ayrı bir teknik adacık kurarız” yaklaşımının zayıfladığını gösteriyor.

### 4. Bugün dünkü raporu aşan yeni Spring AI veya Spring Cloud kırıcı duyuru görünmedi

Bu kategorilerde yeni prod etkili sinyal, 19 Mayıs raporundaki Spring AI memory değişimi ve Spring Cloud Config/Function güvenlik hattının üzerine çıkmadı. Bugünkü dikkat daha çok identity, runtime integrity ve platform araçlarına kaymalı.

## Trendler ve Sinyaller

- `Destek sınırı artık bakım detayı değil, ürün kararı.` Spring Authorization Server `1.5.x` son nesil, daha eski hatlar OSS dışı, yeni özellikler Security 7’ye gidiyor. Bu aynı zamanda dünkü Spring Framework/Security destek sınırı sinyalleriyle de uyumlu.
- `Sözleşme ve protokol yönetimi framework içine çekiliyor.` Boot 4.1 gRPC, OAuth2 resource server uyumu, Spring Integration’daki MQTTv5/SFTP iyileştirmeleri ve küçük topluluk starter’larında görülen sunset/idempotency odakları aynı doğrultuya işaret ediyor.
- `Modüler monolith yaklaşımı ölmedi; aksine araç kalitesi artıyor.` Spring Modulith’in event publication registry ve JobRunr transaction handling iyileştirmeleri, mikroservis yerine tek deployable içinde sınır ve güvenilirlik kurmak isteyen ekipler için anlamlı.
- `Build pipeline artık governance yüzeyi.` Paketo’nun Spring jenerasyon ömrünü build log’unda uyarması ve `spring-cloud-bindings` jar’ını otomatik eklemesi, container image üretimini yalnız paketleme adımı olmaktan çıkarıyor.
- `Dayanıklı değer ile gürültüyü ayırmak kolaylaşıyor.` JDK 26 bütünlük kısıtları, Auth Server destek kayması ve Boot 4.1 gRPC kalıcı sinyal; küçük community starter’ları ve blog çevresindeki erken araçlar ise şimdilik düşük öncelikli izleme alanı.

## Araçlar ve Kütüphaneler

- [Spring gRPC](https://spring.io/projects/spring-grpc): `1.0.3` stable, `1.1.0-RC1` preview. Spring Boot ile güvenlik, health ve test tarafında gerçek entegrasyon sağlıyor.
- [Spring Modulith](https://spring.io/projects/spring-modulith): `2.0.6` stable; `2.1 RC1` tarafında `@ModuleSlicing`, event registry ve JobRunr iyileştirmeleri var.
- [Spring Integration 7.1.0-M3](https://spring.io/blog/2026/03/18/spring-integration-7-1-0-m3-available): SFTP, MQTTv5 ve nullability tarafında somut kalite artışı getiriyor.
- [Paketo spring-boot buildpack](https://blog.paketo.io/posts/spring-boot-performance/): Spring ömür takibini build aşamasına çekmesi ve AOT/CRaC/AOT Cache seçeneklerini aynı çerçevede toplaması nedeniyle platform ekipleri için önemli.
- Düşük öncelik: [spring-api-sunset](https://github.com/Atlancia-Labs/spring-api-sunset) ve [spring-idempotency-kit](https://github.com/Atlancia-Labs/spring-idempotency-kit). İkisi de gerçek problemi hedefliyor ama bakım derinliği ve saha olgunluğu henüz sınırlı.

## Java / Spring Geliştiricileri İçin Etkiler

- Kimlik ve yetkilendirme ürününüz Spring Authorization Server üstündeyse, bu artık yalnız dependency bump işi değil. `1.5.7` patch’i kısa vadeli zorunluluk; Security 7 hizalaması ise orta vadeli platform işi.
- JDK 26 denemelerini “uygulama ayağa kalktı mı?” seviyesinde bırakmayın. `--illegal-final-field-mutation=deny` ve JFR ile kütüphane tabanlı reflection ihlallerini görünür hale getirin.
- Boot 4.1 ile gRPC deneyecekseniz yalnız proto ve stub üretimini değil; TLS, health check, auth, HTTP/2 load balancer ve observability akışını birlikte tasarlayın.
- Modulith kullanan ya da mikroservise bölme baskısı yaşayan ekipler için, event externalization ve transaction handling iyileştirmeleri ciddi bir pilot sebebi.
- OCI image üreten ekiplerde Paketo logları artık destek durumu ve runtime davranışı için sinyal taşıyor; CI bu logları parse etmiyorsa değer boşa gidiyor.

## Fırsatlar ve Riskler

- Fırsat: gRPC’nin Spring Boot içine yerleşmesi, internal servis iletişiminde framework ve operasyon standardını sadeleştirebilir.
- Risk: gRPC adoption sırasında HTTP/2, Netty çakışmaları, TLS terminasyonu ve tracing beklentileri küçümsenirse entegrasyon maliyeti hızla artar.
- Fırsat: Spring Authorization Server’dan Security 7 yönüne geçiş, auth yığını parçalanmasını azaltabilir.
- Risk: `1.3.x` ve `1.4.x` gibi artık OSS dışı hatlarda kalmak, güvenlik açıklarını daha pahalı hale getirir.
- Fırsat: JDK 26 bütünlük kısıtları, gizli reflection borcunu bugünden ortaya çıkarabilir.
- Risk: Bu tespit geç yapılırsa gelecek JDK sürümünde warning’den error’a geçiş doğrudan release blocker olur.
- Fırsat: Paketo üzerinden build-time EOL uyarıları ve AOT Cache/CRaC denemeleri, startup ve governance kazanımı getirebilir.
- Risk: Otomatik `spring-cloud-bindings` enjeksiyonu ya da performans optimizasyonları ölçülmeden kullanılırsa davranış farkları yanlış yorumlanabilir.

## İzlenmesi Gereken Konular

- 1-5 Haziran 2026 Spring OSS release train penceresi. Özellikle Boot 4.1 final release notes, Spring Security 7.1 ve Spring Integration 7.1 GA içerikleri yakından izlenmeli.
- JDK 26 ile çalışan serializer, test, mapping ve bytecode araçlarında final field warning üretip üretmediği.
- Spring Authorization Server’dan Spring Security 7’ye geçiş için resmi migration guidance ve ilk saha örnekleri.
- gRPC’nin Spring Boot 4.1 hattında OpenTelemetry, OAuth2 ve actuator/health dünyasıyla nasıl standartlaşacağı.
- Düşük öncelik: `spring-api-sunset` ve `spring-idempotency-kit` gibi küçük starter’ların release sıklığı, contributor artışı ve gerçek saha adaptasyonu.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Authorization Server 1.5.7 güvenlik yaması aynı anda ürün hattı kapanış sinyali veriyor
- source: [Spring Authorization Server 1.5.7 Available Now](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now), [Spring Authorization Server proje sayfası](https://spring.io/projects/spring-authorization-server)
- author: Joe Grandja; Spring team
- date: 21 Nisan 2026
- category: security, identity, support-policy
- tags: spring-authorization-server, oauth2, oidc, dynamic-client-registration, cve, spring-security-7
- summary: `1.5.7` sürümü `CVE-2026-22752` açığını kapatıyor; proje sayfası ise `1.5.x` hattının son nesil olduğunu ve yeni özelliklerin Spring Security 7.0’a taşındığını söylüyor.
- why_it_matters: Bu iki bilgi birlikte okunduğunda konu basit patch olmaktan çıkıyor; auth server sahipliği olan ekipler için güvenlik ve yol haritası aynı anda karar gerektiriyor.
- java_spring_relevance: OAuth2/OIDC yetkilendirme sunucusu işleten Spring ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Security 7 çizgisine geçişle kimlik katmanını daha standart ve daha az parçalı hale getirmek.
- risks: `1.3.x` ve `1.4.x` gibi artık OSS dışı hatlarda kalıp güvenlik açığı yönetimini pahalılaştırmak.
- migration_notes: `1.5.x` kullananlar kısa vadede `1.5.7`’ye çıkmalı; daha eski hatlar için Security 7 yol haritası ayrıca planlanmalı.

### Bulgu 2

- title: JDK 26 final field mutasyonu için warning dönemi başladı; sonraki durak error
- source: [Quality Outreach Heads-up - JDK 26: Warnings About Final Field Mutation](https://inside.java/2026/05/15/quality-heads-up/), [JEP 500](https://openjdk.org/jeps/500), [Java 26: Better Language, Better APIs, Better Runtime](https://inside.java/2026/05/19/javaone-better-jdk26/)
- author: Nicolai Parlog; OpenJDK
- date: 15 Mayıs 2026 ve 19 Mayıs 2026
- category: jdk, compatibility, runtime-integrity
- tags: jdk26, final-field, reflection, jfr, illegal-final-field-mutation, compatibility
- summary: JDK 26’da reflective final field mutation varsayılan olarak warning üretmeye başladı; `--enable-final-field-mutation`, `--illegal-final-field-mutation` ve JFR event’leri geçişi yönetmek için sunuluyor.
- why_it_matters: Uygulama kodundan çok çevredeki kütüphaneler etkilenebilir; bu yüzden risk yüzeyi gizli ve organizasyonlar genelde geç fark ediyor.
- java_spring_relevance: Spring uygulamalarının serializer, mapper, test, proxy ve legacy entegrasyon katmanları için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Reflection borcunu erken tespit edip daha temiz, daha öngörülebilir JDK upgrade yolu kurmak.
- risks: Warning’leri görmezden gelip bir sonraki JDK dalgasında error ile release pipeline kırmak.
- migration_notes: CI ve staging’de `--illegal-final-field-mutation=deny` ile deneme yapılmalı; JFR ile `jdk.FinalFieldMutation` event’leri toplanmalı.

### Bulgu 3

- title: Spring Boot 4.1, gRPC’yi ilk sınıf platform kabiliyeti haline getiriyor
- source: [Spring Office Hours Podcast: S5E16](https://spring.io/blog/2026/05/19/spring-office-hours-podcast-S5E16), [Spring Boot 4.1 gRPC referansı](https://docs.spring.io/spring-boot/4.1/reference/io/grpc.html), [Spring gRPC proje sayfası](https://spring.io/projects/spring-grpc)
- author: Dan Vega; Spring Boot docs team; Spring gRPC team
- date: 19 Mayıs 2026
- category: architecture, protocol, cloud-native
- tags: spring-boot-4-1, grpc, spring-grpc, oauth2, ssl-bundles, health-checks, testing
- summary: Boot 4.1 referansı gRPC için server/client starter’ları, SSL bundle yapılandırmasını, health bridge’i, Spring Security/OAuth2 uyumunu ve test desteğini resmi akışın parçası haline getiriyor; proje sayfası `1.0.3` stable ve `1.1.0-RC1` preview gösteriyor.
- why_it_matters: gRPC artık “ekstra kütüphane” gibi değil; Boot üzerinden operasyonel ve güvenlik standartlarıyla birlikte gelen bir iletişim seçeneğine dönüşüyor.
- java_spring_relevance: İç servis iletişimi, yüksek performanslı RPC veya çok dilli sistemlerle çalışan ekipler için yüksek.
- actionability: izle_ve_pilotla
- impact_level: yüksek
- opportunities: REST dışındaki internal protocol katmanını Spring’in health, auth ve config dünyasıyla birleştirmek.
- risks: HTTP/2 altyapısı, load balancer davranışı, Netty çakışmaları ve observability beklentileri hesaba katılmazsa geçiş maliyeti artar.
- migration_notes: Önce tek bir internal servis üzerinde pilot yapılmalı; Netty mi servlet mi kullanılacağı, TLS ve health mapping ile birlikte test edilmeli.

### Bulgu 4

- title: Spring Modulith 2.1 RC1, modüler monolith ve event güvenilirliği hikayesini güçlendiriyor
- source: [Spring Modulith 2.1 RC1, 2.0.6, and 1.4.11 released](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released), [Spring Modulith proje sayfası](https://spring.io/projects/spring-modulith), [InfoQ Spring News Roundup](https://www.infoq.com/news/2026/04/spring-news-roundup-apr20-2026/)
- author: Oliver Drotbohm; Michael Redlich
- date: 24 Nisan 2026 ve 27 Nisan 2026
- category: architecture, modularity, events
- tags: spring-modulith, module-slicing, jobrunr, event-publication, modular-monolith
- summary: `2.1 RC1`, `@ModuleSlicing` davranışını iyileştiriyor, JobRunr entegrasyonunda transaction handling’i güçlendiriyor ve event publication registry tarafında birden fazla iyileştirme getiriyor.
- why_it_matters: Mikroservise bölmeden önce tek deployable içinde sınır, test ve event güvenilirliği arayan ekipler için araç seti olgunlaşıyor.
- java_spring_relevance: Domain-driven tasarım, event externalization veya background job kullanan Spring ekipleri için orta-yüksek.
- actionability: izle_ve_pilotla
- impact_level: orta-yüksek
- opportunities: Modül sınırlarını doğrulamak, async/event akışlarını daha güvenilir hale getirmek, testleri bounded context düzeyine çekmek.
- risks: RC hattını kritik üretim yoluna erken sokmak veya zayıf domain sınırlarıyla araçtan mucize beklemek.
- migration_notes: JobRunr veya event externalization kullanan tek bir bounded context üzerinde pilot başlatmak en mantıklı giriş yolu.

### Bulgu 5

- title: Spring Integration 7.1.0-M3, mesajlaşma ve dosya adaptörlerinde saha uyumunu artırıyor
- source: [Spring Integration 7.1.0-M3 Available](https://spring.io/blog/2026/03/18/spring-integration-7-1-0-m3-available)
- author: Glenn Renfro
- date: 18 Mart 2026
- category: integration, messaging, operations
- tags: spring-integration, mqttv5, sftp, header-enricher, nullability
- summary: SFTP metadata key’inin tam remote path olması, MQTTv5 shared subscription pattern desteği ve `HeaderEnricher` nullability iyileştirmeleri gerçek saha kullanımlarına dönük kalite artışı getiriyor.
- why_it_matters: Integration katmanındaki küçük davranış farkları çoğu zaman ancak üretimde görünür; bu tip değişiklikler veri korelasyonu ve broker uyumluluğu açısından önemlidir.
- java_spring_relevance: Spring Integration, MQTT, SFTP veya dosya tabanlı akış kullanan ekipler için orta.
- actionability: izle_ve_test_et
- impact_level: orta
- opportunities: Broker ve uzak dosya sistemi davranışlarını daha az hack ile yönetmek.
- risks: Özellikle eski SFTP metadata key varsayımlarına dayanan akışlarda sessiz davranış farkı oluşabilir.
- migration_notes: Remote filename bazlı correlation/dedup yapan akışlar ve shared subscription kullanan MQTT topolojileri regression test’ten geçirilmeli.

### Bulgu 6

- title: Paketo spring-boot buildpack, destek borcu ve startup optimizasyonunu build aşamasına taşıyor
- source: [From deprecation warnings to Spring Boot performance - the spring-boot buildpack in 2026](https://blog.paketo.io/posts/spring-boot-performance/)
- author: Anthony Dahanne
- date: 4 Mayıs 2026
- category: platform-engineering, build, operations
- tags: paketo, buildpacks, spring-boot, support-lifecycle, service-bindings, aot-cache, crac, container
- summary: Buildpack, Spring jenerasyonlarının OSS ömürlerini build log’unda görünür kılıyor; `spring-cloud-bindings` jar’ını otomatik enjekte ediyor ve extract/AOT/CRaC/native/AOT Cache seçeneklerini tek hat üzerinde tartışıyor.
- why_it_matters: Container image üretimi artık yalnız artifact paketleme değil; support posture, runtime classpath ve startup stratejisinin de kontrol noktası.
- java_spring_relevance: Spring Boot image build eden platform ve uygulama ekipleri için orta-yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: CI seviyesinde destek borcunu erken görünür yapmak ve cold-start optimizasyonlarını sistematik test etmek.
- risks: Otomatik eklenen kütüphaneleri veya performans flag’lerini fark etmeden kullanmak, davranış farklarını yanlış teşhis ettirebilir.
- migration_notes: `BP_SPRING_CLOUD_BINDINGS_DISABLED` politikası bilinçli belirlenmeli; extract layout ve AOT Cache etkisi uygulama bazında ölçülmeli.

### Bulgu 7

- title: Düşük öncelikli ama anlamlı sinyal: API sunset ve idempotency için küçük Spring starter dalgası var
- source: [This Week in Spring - May 19th, 2026](https://spring.io/blog/2026/05/19/this-week-in-spring-may-19-2026), [spring-api-sunset](https://github.com/Atlancia-Labs/spring-api-sunset), [spring-idempotency-kit](https://github.com/Atlancia-Labs/spring-idempotency-kit)
- author: Josh Long; Atlancia Labs
- date: 19 Mayıs 2026 ve 15 Mayıs 2026
- category: api-governance, resilience
- tags: api-sunset, idempotency, redis, micrometer, boot-starter
- summary: `spring-api-sunset`, RFC tabanlı deprecation/sunset header yönetimini hedefliyor; `spring-idempotency-kit` ise Redis tabanlı distributed lock, WAIT/REJECT stratejileri ve Micrometer metriği sunuyor.
- why_it_matters: Bu araçlar kendi başına henüz büyük haber değil, fakat Spring topluluğunda API lifecycle ve retry safety problemlerinin daha görünür hale geldiğini gösteriyor.
- java_spring_relevance: API platform takımı olan ekipler için düşük-orta; genel backend ekipleri için düşük öncelik.
- actionability: izle_ve_degerlendir
- impact_level: düşük
- opportunities: Doğrudan dependency almadan önce fikirleri kurumsal internal starter veya API gateway politikalarına taşımak.
- risks: Küçük maintainer havuzu ve sınırlı saha kanıtı nedeniyle erken production adoption hatalı olabilir.
- migration_notes: Şimdilik doğrudan prod dependency yerine kavramsal benchmark veya internal PoC seviyesi daha doğru.

## Sonuç

20 Mayıs 2026 itibarıyla en kalıcı üç sinyal şunlar: Spring Authorization Server tarafında destek ve ürün sınırı artık değişti; JDK 26 reflection temelli final field mutasyonuna fiilen savaş açtı; Spring Boot 4.1 ise gRPC’yi resmi platform konuşmasının içine aldı. Bunların üçü de kısa vadede dependency güncellemesi gibi görünse de orta vadede mimari, test ve platform standardı kararı gerektiriyor.

Bugünün en doğru aksiyon seti, auth server patch/roadmap ayrımını netleştirmek, JDK 26 uyumluluk testlerini `deny` moduyla sertleştirmek ve Boot 4.1 gRPC hattını tek bir servis üzerinde pilotlamaktır. Modulith, Integration ve Paketo sinyalleri ise mikroservis, event ve container stratejisini daha disiplinli hale getirmek isteyen ekipler için yüksek değerli takip alanlarıdır.
