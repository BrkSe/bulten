# Günlük Java / Spring Ekosistem Raporu

Tarih: 25 Mayıs 2026  
Tarama zamanı: 25 Mayıs 2026 09:06 TSİ  
Odak: kimlik/güvenlik katmanında yol değişiklikleri, JDK tarafında güvenlik ve bütünlük baskısı, event/messaging sınırlarının netleşmesi ve AOT/Leyden çizgisinin üretim gerçekliğine yaklaşması

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring release highlights](https://spring.io/projects/release-highlights/), [Spring Security advisories](https://spring.io/security/), [OpenJDK](https://openjdk.org/), [JDK 26](https://jdk.java.net/26/), [JDK 27 EA](https://jdk.java.net/27/), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long’un yazar sayfası](https://spring.io/authors/joshlong/), [Gunnar Morling’in blogu](https://www.morling.dev/blog/), ilgili GitHub/release/changelog sayfaları ve [Burak KUTBAY’ın blogu](https://blog.burakkutbay.com/) tarandı. Baeldung, Josh Long, Gunnar Morling ve Burak KUTBAY tarafında bugün üretim kararını tek başına değiştiren yeni bir release/advisory görünmedi; buna karşılık resmi Spring/OpenJDK/Oracle kanalları, önümüzdeki sprintlerde backlog’a girmesi gereken daha net migration ve platform sinyalleri üretti.

## Öne Çıkan Başlıklar

- [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/), yalnız bir patch yayını değil; [CVE-2026-22752](https://spring.io/security/cve-2026-22752) düzeltmesini içeriyor ve aynı anda ürün hattının [Spring Security 7.0](https://spring.io/projects/spring-authorization-server/) içine taşındığını netleştiriyor.
- [Spring Modulith 2.1 RC1](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/) event publication registry ve JobRunr transaction handling tarafında görünür iyileştirmeler getiriyor; modüler monolit kullanan ekipler için bu küçük değil.
- [Spring for Apache Pulsar 2.0.5](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available/) Boot 4.0.6 ve 4.1.0-RC1 hattına giriyor; ancak [reactive support’un kaldırılması](https://spring.io/blog/2025/10/29/spring-pulsar-reactive-discontinued/) artık eski bir dip not değil, gerçek migration sınırı.
- [JEP 527](https://openjdk.org/jeps/527) ile JDK 27, `javax.net.ssl` kullanan Java uygulamalarına varsayılan post-quantum hibrit TLS 1.3 desteği getiriyor; servisler arası TLS tarafında pilot zamanı geldi.
- [JEP 500](https://openjdk.org/jeps/500) ve [JDK 27 rampdown heads-up](https://inside.java/2026/05/22/quality-heads-up/) birlikte okunduğunda, reflective final-field mutasyonu artık “ileride bakarız” başlığı değil.
- [Java 26’daki JEP 516](https://blogs.oracle.com/java/the-arrival-of-java-26) ve [Netflix’in Leyden/AOT üretim anlatısı](https://inside.java/2026/05/23/java-aot-in-production-at-netflix/) aynı şeyi söylüyor: startup optimizasyonu feature demosundan çıkıp SDLC konusu haline geliyor.

## Kritik Güncellemeler

### 1. Spring Authorization Server hattı kapanmıyor ama yön değiştiriyor

[Spring Authorization Server 1.5.7 duyurusu](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/) ve [proje sayfasındaki not](https://spring.io/projects/spring-authorization-server/) birlikte şu tabloyu veriyor:

- `1.5.7`, `CVE-2026-22752` düzeltmesini içeriyor.
- `1.3.x` ve `1.4.x` açık kaynak destek hatları bitmiş durumda.
- `1.5.x`, Spring Authorization Server’ın son jenerasyonu.
- Yeni feature geliştirmeleri Spring Security 7.0 içine taşınıyor.

Bu neden kritik:

- Kendi OAuth2 / OIDC authorization server’ını Spring ile kuran ekipler için bu artık yalnız patch seviyesi işi değil; roadmap seviyesi mimari karar.
- Dynamic client registration kullanan sistemlerde güvenlik güncellemesi ertelenmemeli.
- Yeni yetenek yatırımı yapılacaksa bunun ayrı SAS jenerasyonuna değil Security 7 yönüne hizalanması daha doğru.

Kısa yorum: Authorization Server tarafında bugün asıl sinyal, versiyon numarasından çok ürün sınırının değişmiş olması.

### 2. Spring Modulith 2.1 RC1, modüler monolitlerde event teslimatını daha güvenilir hale getirmeye devam ediyor

[Spring Modulith 2.1 RC1 duyurusu](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/) şu kullanıcı görünür değişimleri öne çıkarıyor:

- `@ModuleSlicing`, explicit sınıflarda `@SpringBootApplication` tercihini daha doğru yapıyor.
- JobRunr entegrasyonunda transaction handling iyileştirmeleri var.
- Event publication registry üzerinde birden fazla refinement geliyor.

Bu neden kritik:

- Modulith kullanan ekiplerde en pahalı problemlerden biri, modül sınırları ile async teslimat davranışının sessizce kaymasıdır.
- JobRunr + event publication birleşiminde transaction sınırı problemi, üretimde tekrar işleme veya kaçan event maliyeti yaratır.
- Event publication registry’ye gelen ardışık iyileştirmeler, bu alanın artık “yardımcı özellik” değil çekirdek güvenilirlik katmanı olarak görüldüğünü gösteriyor.

Kısa yorum: Mikroservise geçmeden önce modüler monoliti sertleştirmek isteyen ekipler için bu RC önemli bir izleme noktası.

### 3. Spring Pulsar 2.0 çizgisi kullanılabilir hale geliyor ama reaktif yol artık resmi strateji değil

[Spring for Apache Pulsar 1.2.17 ve 2.0.5 duyurusu](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available/) ile:

- `2.0.5`, Spring Boot `4.0.6` ve `4.1.0-RC1` hattına giriyor.
- Proje sayfasında stabil hat olarak [2.0.5](https://spring.io/projects/spring-pulsar) görünüyor.

Ancak aynı anda [reactive support’un kaldırıldığı duyuru](https://spring.io/blog/2025/10/29/spring-pulsar-reactive-discontinued/) hâlâ geçerli:

- `spring-pulsar-reactive` modülü 2.0.0 ile kaldırıldı.
- Spring Boot tarafındaki reactive support da 4.0.0 ile kaldırıldı.

Bu neden kritik:

- Boot 4’e geçen Pulsar ekipleri için migration yalnız dependency güncellemesi değil; programlama modelinin de gözden geçirilmesi.
- Reactor tabanlı tüketim/üretim zinciri kurmuş ekipler resmi Spring Pulsar yolunda aynı deneyimi bulamayacak.
- Uzun ömürlü messaging altyapısında sürdürülebilirlik sinyali net: maintainers, daha dar ve daha yönetilebilir yüzeyi tercih ediyor.

Kısa yorum: Pulsar kullanıyorsanız teknik risk “Pulsar var mı?” değil, “hangi Spring programlama modeliyle sürdürülebiliriz?” sorusu.

### 4. JDK 27, TLS katmanında post-quantum hazırlığı varsayılan davranışa yaklaştırıyor

[JEP 527](https://openjdk.org/jeps/527) ve [Inside Java duyurusu](https://inside.java/2026/02/17/tls-post-quantum-hybrid-key-exchange/) şu noktaları doğruluyor:

- JDK 27, TLS 1.3 için hibrit post-quantum key exchange desteğini içeriyor.
- `javax.net.ssl` kullanan uygulamalar bu iyileştirmeden mevcut kod değişmeden yararlanabiliyor.
- Varsayılan tercih sırasının başına `X25519MLKEM768` geliyor.
- Gerekirse `jdk.tls.namedGroups` veya `SSLParameters::setNamedGroups` ile özelleştirme yapılabiliyor.

Bu neden kritik:

- Java/Spring microservice ekiplerinde outbound HTTP client, gateway, service mesh dışı TLS uçları ve legacy partner bağlantıları doğrudan etkilenebilir.
- “Harvest now, decrypt later” tehdidine karşı platform seviyesinde hazırlık artık pratik hale geliyor.
- Varsayılan named group değişimi, bazı ara katmanlarda veya kurumsal TLS cihazlarında interoperability testi gerektirebilir.

Kısa yorum: Bu başlık şimdilik prod default rollout konusu değil; ama staging seviyesinde handshake testi gerektiren net bir yatırım konusu.

### 5. Final-field mutasyonu ve integrity-by-default çizgisi, Spring uygulamalarını dolaylı ama ciddi biçimde etkileyecek

[JEP 500](https://openjdk.org/jeps/500), [Oracle’ın Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26) ve [JDK 27 rampdown heads-up](https://inside.java/2026/05/22/quality-heads-up/) birlikte değerlendirildiğinde:

- JDK 26, deep reflection ile `final` field mutasyonuna varsayılan warning üretiyor.
- `--illegal-final-field-mutation` ile `allow`, `warn`, `debug`, `deny` davranışları kontrol edilebiliyor.
- JFR tarafında `jdk.FinalFieldMutation` eventi ile suçlu çağrılar bulunabiliyor.
- OpenJDK kalite iletişimi, JDK 27 rampdown yaklaşırken bu konunun daha agresif test edilmesi gerektiğini açıkça söylüyor.

Bu neden kritik:

- Sorun çoğu zaman Spring çekirdeğinde değil; serialization, mocking, test, bytecode weaving veya eski framework uzantılarında çıkacak.
- Constructor injection ve immutable tasarıma zaten yaklaşmış ekipler daha rahat olacak; reflection ile nesne yamalayan kodlar zorlanacak.
- JDK yükseltmelerinde en tehlikeli senaryo, warning’i görmeyip daha sonraki deny davranışına hazırlıksız yakalanmak.

Kısa yorum: JDK 26/27 geçişinde “uygulama açıldı” testi yetmez; test ve yardımcı kütüphane zinciri de taranmalı.

### 6. AOT/Leyden artık yalnız laboratuvar konusu değil

[Oracle Java 26 duyurusu](https://blogs.oracle.com/java/the-arrival-of-java-26) içindeki [JEP 516](https://openjdk.org/jeps/516) vurgusu ve [Netflix’in Java AOT in Production](https://inside.java/2026/05/23/java-aot-in-production-at-netflix/) anlatısı birlikte okununca güçlü bir tekrar sinyali oluşuyor:

- Java 26, “Ahead-of-Time Object Caching with Any GC” ile startup ve warm-up süresini GC’den bağımsız iyileştirmeyi hedefliyor.
- Inside Java/JavaOne tarafında Netflix, Project Leyden kullanarak kritik servislerin startup süresini iyileştirdiğini ve bunun için gerekli SDLC/altyapıyı kurduğunu söylüyor.

Bu neden kritik:

- Soğuk başlatma süresi artık yalnız serverless problem değil; autoscaling, batch worker burst, canary startup ve test pipeline süresi de bu başlığın içinde.
- Spring Boot AOT/native image deneyleri ile platform düzeyi AOT/Leyden gelişmeleri aynı masaya gelmeye başlıyor.
- Asıl fark teknoloji seçiminden çok operasyon modelinde: build artifact yönetimi, cache invalidation, startup telemetry ve benchmarking disiplini.

Kısa yorum: AOT konuşması hype olmaktan çıkıyor; ama bunu üretime taşımak framework ayarı değil platform mühendisliği işi.

## Trendler ve Sinyaller

### Trend Kümesi 1: Güvenlik ve kimlik yetenekleri framework uzantısından platform standardına kayıyor

- Spring Authorization Server’ın yeni feature hattı Spring Security 7 içine taşınıyor.
- JDK 27, TLS tarafında post-quantum hibrit güvenliği varsayılan davranışa yaklaştırıyor.
- JDK 26/27 tarafında final-field mutasyonuna karşı integrity-by-default baskısı artıyor.

Bu küme kısa süreli gürültü değil. Güvenlik artık yalnız app-level config değil; framework ve runtime varsayılanlarının da değiştiği bir alan.

### Trend Kümesi 2: Event ve mesajlaşma tarafında “daha az sihir, daha açık kontrat” yaklaşımı güçleniyor

- Spring Modulith event publication registry ve transaction davranışını rafine ediyor.
- Spring Pulsar tarafı reactive kapsamı daraltıp daha sürdürülebilir çekirdek yüzeye dönüyor.

Bu çizgi, ekiplerin kendi yan soyutlamalarını azaltmasını ama hangi teslimat semantiğine güvendiğini daha açık yazmasını gerektiriyor.

### Trend Kümesi 3: Startup optimizasyonu artık benchmarking oyuncağı değil, platform yatırımı

- Java 26 AOT object caching
- Netflix’in Leyden’i kritik servislerde kullanması
- Spring tarafında devam eden AOT/native yönelim

aynı yere çıkıyor: startup süresi, dağıtım mimarisi ve işletme maliyeti üzerinde gerçek etki yaratıyor.

### Gürültü mü, kalıcı mı?

- Kalıcı mühendislik değeri yüksek: Spring Authorization Server yol değişimi, JEP 527, JEP 500 etkileri, Modulith event delivery refinements, Leyden/AOT operasyonelleşmesi.
- İzle ve planla: Spring Pulsar 2.0.5 adoption, Modulith 2.1 RC1’den 2.1 GA’ya giden değişimler, JDK 27 EA interoperability testleri.
- Düşük öncelik: [Spring Shell 4.0.2](https://spring.io/blog/2026/04/24/spring-shell-4-0-2-is-out), [Gunnar Morling’in Hardwood Beta2 yazısı](https://www.morling.dev/blog/) ve Baeldung’in açıklayıcı Boot 4 içerikleri. Bunlar faydalı ama bugün çoğu Spring backend ekibinin roadmap’ini tek başına değiştirmiyor.

## Araçlar ve Kütüphaneler

- [Spring Authorization Server 1.5.7](https://spring.io/projects/spring-authorization-server/): Çok yüksek öncelik. Güvenlik düzeltmesi ve ürün hattı değişimi nedeniyle.
- [Spring Modulith 2.1 RC1 / 2.0.6 / 1.4.11](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/): Yüksek öncelik. Özellikle event publication registry ve JobRunr kullanan ekipler için.
- [Spring for Apache Pulsar 2.0.5](https://spring.io/projects/spring-pulsar): Orta-yüksek öncelik. Pulsar kullanan ekiplerde Boot 4 hizası için anlamlı; reaktif kullananlarda migration maliyeti var.
- [JDK 27 EA + JEP 527](https://jdk.java.net/27/): Yüksek öncelik. Güvenli servisler arası iletişim ve kurumsal TLS standardı için.
- [Java 26 / JEP 516](https://blogs.oracle.com/java/the-arrival-of-java-26): Orta-yüksek öncelik. Startup hassasiyetli servislerde AOT pilotları için.
- [Spring Shell 4.0.2](https://spring.io/blog/2026/04/24/spring-shell-4-0-2-is-out/): Düşük öncelik. İç CLI araçları geliştiriyorsanız bakılabilir; genel Spring backend akışının ana gündemi değil.
- [Hardwood 1.0.0.Beta2](https://www.morling.dev/blog/): Düşük öncelik. Parquet ağırlıklı JVM veri işleme hatları için ilginç; geniş Spring kitlesi için niş.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Security/Authorization Server kullanan ekipler, authorization server yükseltmesini yalnız patch yönetimi olarak değil ürün sınırı ve destek hattı kararı olarak ele almalı.
- Modüler monolit kuran ekipler, Spring Modulith 2.1 RC1 ile event publication ve scheduled job transaction davranışını tekrar test etmeli.
- Pulsar tarafında Boot 4’e çıkıyorsanız `spring-pulsar-reactive` veya benzeri internal wrapper kullanımını envanterleyin; sürpriz migration maliyeti burada.
- JDK 27 pilotu yapacak ekipler, TLS named group davranışı ve partner sistem uyumunu staging’de ölçmeli.
- JDK 26/27 geçişi planlayan ekipler, test suite’lerini `--illegal-final-field-mutation=debug` veya `deny` ile çalıştırarak kırılgan bağımlılıkları erken yakalamalı.
- Soğuk başlatma süresi kritikse, Spring Boot AOT/native image ile JDK 26 AOT object caching/Leyden yaklaşımını karşılaştırmalı pilotlar yapılmalı.
- Java 26 bugün [Oracle’a göre](https://blogs.oracle.com/java/the-arrival-of-java-26) Eylül 2026’ya kadar güncelleme alacak mevcut GA hattı; JDK 27 özellikleri ise seçilmiş pilotlar için uygun, geniş üretim rollout’u için henüz erken.

## Fırsatlar ve Riskler

- Fırsat: Authorization Server feature yatırımlarını Spring Security 7 ekseninde sadeleştirmek.
- Fırsat: Modulith ile modüler monolitlerde outbox/event delivery doğruluğunu artırmak.
- Fırsat: JEP 527 ile servisler arası TLS’te geleceğe dönük kriptografik dayanıklılık pilotları başlatmak.
- Fırsat: JDK 26 AOT ve Leyden yönü sayesinde startup SLO’larını iyileştirmek.
- Risk: Spring Authorization Server 1.3.x/1.4.x veya gecikmiş 1.5.x patch kullanımı güvenlik ve destek boşluğu doğurur.
- Risk: Pulsar reactive kullanımını fark etmeden Boot 4’e çıkmak migration süresini patlatır.
- Risk: Final-field warning’lerini görmezden gelmek, sonraki JDK sürümlerinde deny davranışına hazırlıksız yakalanmak demek.
- Risk: Post-quantum TLS named group değişimleri, bazı legacy TLS uçlarında veya middlebox’larda uyum problemi yaratabilir.
- Risk: AOT/Leyden denemelerini sadece benchmark olarak görmek, gerçek build/release/telemetry maliyetini saklar.

## İzlenmesi Gereken Konular

- Spring Security 7 içinde authorization server özelliklerinin ne hızla genişlediği.
- Spring Modulith 2.1 GA öncesinde event publication registry değişimlerinin stabil hale gelip gelmediği.
- Spring Pulsar 2.0.x hattında 2.0.5 sonrası release notlarının ne kadar yön değişimi içerdiği.
- JDK 27 EA build’lerinde JEP 527’nin interoperability geri bildirimleri.
- Final-field mutasyonu konusunda JDK 27 sonrasında default davranışın daha ne kadar sertleşeceği.
- Java/Spring tarafında Leyden/AOT deneyimlerinin tekil konferans anlatısından tekrar üretilebilir saha örneklerine dönüp dönmediği.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Authorization Server 1.5.7, güvenlik düzeltmesiyle birlikte ürün hattı değişimini de netleştiriyor
- source: [Spring Blog](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/), [Spring Authorization Server Project Page](https://spring.io/projects/spring-authorization-server/), [CVE-2026-22752 Advisory](https://spring.io/security/cve-2026-22752)
- author: Joe Grandja / Spring team
- date: 21 Nisan 2026, 25 Mayıs 2026 taramasında yeniden doğrulandı
- category: security, identity, platform-roadmap
- tags: spring-authorization-server, spring-security-7, oauth2, oidc, cve-2026-22752, dynamic-client-registration
- summary: `1.5.7` güvenlik düzeltmesi içeriyor; `1.5.x` son jenerasyon olarak tanımlanıyor ve yeni feature hattı Spring Security 7 içine taşınıyor.
- why_it_matters: Bu değişiklik hem güvenlik açığı kapatma hem de ürün/ekip roadmap’ini yeniden hizalama gerektiriyor.
- java_spring_relevance: Authorization server, SSO veya internal IdP geliştiren Spring ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Security 7 ile yetenek setini tek çatı altında toplamak, auth stack’ini sadeleştirmek.
- risks: Eski SAS hatlarında kalmak destek ve güvenlik boşluğu yaratır.
- migration_notes: Dynamic client registration kullanan sistemleri hemen patch’leyin; yeni yetenek çalışmalarını Spring Security 7 tarafına kaydırın.

### Bulgu 2

- title: Spring Modulith 2.1 RC1, event publication ve arka plan iş transaction sınırlarını rafine ediyor
- source: [Spring Blog](https://spring.io/blog/2026/04/24/spring-modulith-2-1-rc1-2-0-6-and-1-4-11-released/)
- author: Oliver Drotbohm
- date: 24 Nisan 2026, 25 Mayıs 2026 taramasında doğrulandı
- category: modular-monolith, event-delivery, background-jobs
- tags: spring-modulith, module-slicing, jobrunr, event-publication-registry, modular-monolith
- summary: `@ModuleSlicing`, JobRunr transaction handling ve event publication registry üzerinde kullanıcı görünür iyileştirmeler var.
- why_it_matters: Modüler monolitlerde güvenilir event teslimatı ve scheduled/background iş semantiği doğrudan veri tutarlılığına bağlanır.
- java_spring_relevance: Spring Boot ile modüler monolit kuran ekipler için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Event delivery ve async orchestration davranışını daha şeffaf ve daha güvenilir hale getirmek.
- risks: RC sürüm olduğu için geniş rollout yerine kontrollü pilot gerekir.
- migration_notes: JobRunr ve event publication akışlarını staging’de yeniden test edin; 2.1 GA öncesi davranış farklarını not alın.

### Bulgu 3

- title: Spring Pulsar 2.0.5, Boot 4 hizasına giriyor ama reaktif destek resmi yol olmaktan çıkmış durumda
- source: [Spring Blog Release Post](https://spring.io/blog/2026/04/22/spring-for-apache-pulsar-1-2-17-and-2-0-5-are-now-available/), [Reactive Support Discontinuation Note](https://spring.io/blog/2025/10/29/spring-pulsar-reactive-discontinued/), [Spring for Apache Pulsar Project Page](https://spring.io/projects/spring-pulsar)
- author: Soby Chacko, Chris Bono
- date: 22 Nisan 2026 ve 29 Ekim 2025, 25 Mayıs 2026 taramasında birlikte değerlendirildi
- category: messaging, migration, platform-scope
- tags: spring-pulsar, boot-4, reactive, messaging, listener-container, migration
- summary: `2.0.5` Boot 4.0.6/4.1.0-RC1 hattına giriyor; buna karşın reactive modül ve ilgili Boot desteği 2.0/4.0 ile kaldırılmış durumda.
- why_it_matters: Pulsar migration’ı bazı ekipler için sürüm yükseltmesinden çok programlama modeli değişimi anlamına gelecek.
- java_spring_relevance: Pulsar kullanan veya Pulsar değerlendiren Spring ekipleri için orta-yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Daha sürdürülebilir ve daha dar Spring Pulsar yüzeyine geçmek.
- risks: Reaktif wrapper’lar, custom abstractions ve Boot auto-config beklentileri boşa çıkabilir.
- migration_notes: `spring-pulsar-reactive` kullanımını tarayın; imperative listener/template modeline veya ayrı Reactor altyapısına bilinçli geçiş planı yapın.

### Bulgu 4

- title: JDK 27, Java TLS istemcilerine varsayılan post-quantum hibrit anahtar değişimi getiriyor
- source: [JEP 527](https://openjdk.org/jeps/527), [Inside Java](https://inside.java/2026/02/17/tls-post-quantum-hybrid-key-exchange/), [JDK 27 EA Builds](https://jdk.java.net/27/)
- author: Jamil Nimeh / OpenJDK Security
- date: 17 Şubat 2026, 25 Mayıs 2026 taramasında doğrulandı
- category: security, transport, crypto
- tags: jdk-27, tls-1.3, post-quantum, ml-kem, jsse, named-groups
- summary: `javax.net.ssl` kullanan uygulamalar, JDK 27 ile varsayılan olarak hibrit post-quantum named group desteğinden yararlanabilecek.
- why_it_matters: Güvenli servisler arası iletişim ve uzun ömürlü şifreli veri için platform seviyesinde hazırlık sağlıyor.
- java_spring_relevance: WebClient, RestClient, gateway ve outbound TLS kullanan tüm Java/Spring servisleri için yüksek.
- actionability: izle_ve_test_et
- impact_level: yüksek
- opportunities: TLS yığınını gelecek kriptografik gereksinimlere daha hazır hale getirmek.
- risks: Bazı partner uçları veya middlebox katmanları ile interoperability sorunları görülebilir.
- migration_notes: Staging’de handshake ve named group davranışını ölçün; özel TLS ayarlarınız varsa `jdk.tls.namedGroups` kullanımını gözden geçirin.

### Bulgu 5

- title: Final-field mutasyonuna karşı warning dönemi başladı; sonraki adım deny yönü olacak
- source: [JEP 500](https://openjdk.org/jeps/500), [Inside Java Rampdown Heads-up](https://inside.java/2026/05/22/quality-heads-up/), [Oracle Java 26 Announcement](https://blogs.oracle.com/java/the-arrival-of-java-26)
- author: OpenJDK / Oracle Java team
- date: Mayıs 2026
- category: runtime-integrity, compatibility, migration
- tags: jdk-26, jdk-27, final-field-mutation, integrity-by-default, jfr, reflection
- summary: JDK 26, reflective final-field mutasyonuna warning üretiyor; OpenJDK kalite iletişimi bunun daha sertleşeceği yönü işaret ediyor.
- why_it_matters: Uygulama kodundan çok test, serialization ve yardımcı kütüphanelerde görünmeyen uyumsuzlukları açığa çıkarır.
- java_spring_relevance: Spring tabanlı uygulamaların bağımlılık zinciri için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Immutable tasarımı ve constructor injection pratiklerini güçlendirmek.
- risks: Eski framework eklentileri veya mocking/serialization araçları JDK yükseltmesinde gürültülü hale gelebilir.
- migration_notes: CI/test koşularını `--illegal-final-field-mutation=debug` ve mümkünse `deny` ile deneyin; JFR `jdk.FinalFieldMutation` eventlerini toplayın.

### Bulgu 6

- title: Java 26 AOT object caching ve Netflix’in Leyden kullanımı, startup optimizasyonunu platform konusu haline getiriyor
- source: [Oracle Java 26 Announcement](https://blogs.oracle.com/java/the-arrival-of-java-26), [Inside Java: Java AOT in Production at Netflix](https://inside.java/2026/05/23/java-aot-in-production-at-netflix/), [JavaOne Session Summary](https://dev.java/community/javaone-2026/sessions/lrn1329/)
- author: Sharat Chander, Martin Chalupa, Ian Brown
- date: 17 Mart 2026 ve 23 Mayıs 2026
- category: performance, startup, platform-engineering
- tags: java-26, leyden, aot, startup, warmup, object-caching, netflix
- summary: Java 26, GC’den bağımsız AOT object caching sunuyor; Netflix ise Leyden’i kritik servislerde startup iyileştirmesi için kullandığını paylaşıyor.
- why_it_matters: Startup süresi artık yalnız laboratuvar benchmark’ı değil, dağıtım hızı ve altyapı maliyetinin doğrudan girdisi.
- java_spring_relevance: Spring Boot servisleri, worker’lar ve ölçeklenebilir platformlar için orta-yüksek.
- actionability: pilotla
- impact_level: orta-yüksek
- opportunities: Soğuk başlatma ve warm-up sürelerini düşürmek, burst scaling verimini artırmak.
- risks: Build pipeline karmaşıklığı, cache yönetimi ve ölçüm disiplininin yetersiz kurulması.
- migration_notes: AOT/Leyden denemelerini gerçek startup SLO’su olan servislerde yapın; build artifact, telemetry ve rollback akışını birlikte tasarlayın.

## Sonuç

Bugünün en net mesajı şu: Java/Spring ekosistemi yalnız yeni feature eklemiyor, aynı zamanda bazı sınırları yeniden çiziyor. Authorization Server’ın Security 7 içine taşınması, Pulsar reactive yüzeyinin geri çekilmesi, JDK’nin TLS ve final-field bütünlüğünde daha agresif hale gelmesi ve AOT/Leyden’in üretim örneği üretmesi, ekiplerin “versiyon yükseltelim geçelim” yaklaşımını yetersiz bırakıyor.

En doğru kısa vadeli hareket; auth stack, messaging modeli, TLS davranışı ve JDK yardımcı kütüphane uyumluluğu için küçük ama gerçekçi pilot/backlog maddeleri açmak. En kalıcı değer bugün hype tarafında değil; güvenlik, teslimat semantiği, startup SLO’su ve sürdürülebilir platform yüzeyinde.
