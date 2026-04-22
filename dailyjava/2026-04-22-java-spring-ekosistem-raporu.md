# Günlük Java / Spring Ekosistem Raporu

Tarih: 22 Nisan 2026  
Kapsam: Java, JVM, Spring Framework, Spring Boot, Spring Security, Spring Authorization Server, Spring Integration, Spring Vault, OpenJDK, Oracle Java SE, Vault, üretim mimarisi

## Öne Çıkan Başlıklar

Bugünün en güçlü sinyali güvenlik ve patch yönetimi tarafında. Spring Security `6.5.10`, `7.0.5` ve `7.1.0-RC1` aynı anda yayımlandı ve yedi CVE düzeltmesi içeriyor. Bunların içinde Spring Authorization Server Dynamic Client Registration için kritik seviyeli `CVE-2026-22752` ve Spring Security 7 servlet path matcher davranışı için iki yüksek seviyeli authorization bypass riski öne çıkıyor.

Oracle Java SE tarafında April 2026 CPU ile `26.0.1`, `25.0.3`, `21.0.11`, `17.0.19`, `11.0.31` ve `8u491` güvenlik baseline'ı oluştu. Spring Boot servisleri için yalnızca CVE kapatma değil, özellikle JDK 21.0.11'deki G1 `UseGCOverheadLimit`, JSSE/TLS ve kripto politika değişiklikleri de regression testi gerektiriyor.

Spring Integration `7.1.0-RC1`, Redis 8.4+ native CAS/CAD komutlarıyla distributed lock yenileme ve release davranışını güçlendiriyor. Spring Vault `4.1.0-RC1` ise Vault `2.0.0` uyumluluğuna yaklaşırken HashiCorp Vault 2.0.0'ın güvenlik ve breaking-change yüzeyi Spring tabanlı secret platformları için ayrı izlenmeli.

Genel tablo: Enterprise Java ekipleri için bu hafta "yeni özellik deneme" haftasından çok "runtime, identity, secret, authorization ve integration altyapısını envanterleme" haftası.

## Kritik Güncellemeler

1. `Spring Security 6.5.10`, `7.0.5`, `7.1.0-RC1` ve `Spring Authorization Server 1.5.7` güvenlik düzeltmeleri yayımlandı. En acil kontroller: Dynamic Client Registration açık mı, `securityMatchers(String)` servlet path ile kullanılıyor mu, XML authorization rule var mı, `withIssuerLocation` varsayımları doğru mu, `JdbcOneTimeTokenService` kullanılıyor mu?
2. Oracle Java SE April 2026 CPU yayımlandı. JDK baseline'ı `26.0.1`, `25.0.3`, `21.0.11`, `17.0.19`, `11.0.31`, `8u491` oldu. Container image, buildpack, CI runner ve production runtime'lar aynı anda kontrol edilmeli.
3. JDK 21.0.11'de G1 artık belirli koşullarda GC overhead limit nedeniyle `OutOfMemoryError` davranışını Parallel GC'ye benzer şekilde uyguluyor. Bu, bellek baskısı altındaki Spring servislerinde "uzun süre thrash ederek yaşama" yerine daha erken fail-fast davranışına dönebilir.
4. Spring Integration `7.1.0-RC1`, Redis lock yenileme/release tarafında Redis 8.4+ native CAS/CAD kullanımına geçti; eski Redis sürümleri Lua fallback ile çalışıyor.
5. Spring Vault `4.1.0-RC1`, Vault `2.0.0` ile build ediliyor ve Jackson 2/3 uyumluluk yüzeyinde initialization risklerini azaltıyor. Vault 2.0.0 tarafındaki canonical path, authenticated rekey/generate-root ve token header limit değişiklikleri operasyonel test istiyor.

## Trendler ve Sinyaller

### 1. Güvenlik yamaları framework seviyesinden platform seviyesine genişliyor

Son birkaç günlük Spring Framework, Tomcat, Spring Security, Spring Authorization Server, Oracle Java SE ve Vault sinyalleri aynı yönde birleşiyor: artık patch yönetimi yalnızca Maven dependency upgrade işi değil. Authorization matcher, issuer validation, client registration, TLS trust anchor, G1 fail-fast davranışı, Vault administrative endpoint authentication ve secret path canonicalization gibi runtime sözleşmeleri uygulama davranışını doğrudan değiştirebiliyor.

### 2. Spring Boot BOM'u güvenli varsayılan ama patch gecikmesi envanter gerektiriyor

Spring Security ve Spring Authorization Server düzeltmeleri yayımlandı; Spring Boot proje sayfası tarama anında hâlâ `4.0.5` gösteriyor ve önceki Framework açıklaması Boot `3.5.14`/`4.0.6` için "next week" beklentisi veriyordu. Bu, Boot kullanan ekiplerin iki seçeneği netleştirmesi gerektiği anlamına gelir: kısa vadede kontrollü dependency override mı, yoksa Boot patch release bekleme mi? Cevap, etkilenen CVE yüzeyine göre servis bazında verilmeli.

### 3. Authorization artık path matching ayrıntılarına fazla bağımlı

Spring Security 7 tarafındaki servlet path matcher CVE'leri, "authorization rule yazdım, bitti" varsayımının tehlikeli olduğunu gösteriyor. `spring.mvc.servlet.path`, gateway path rewrite, context path, reverse proxy prefix ve security filter chain eşleşmesi aynı test senaryosunda doğrulanmalı.

### 4. Distributed lock ve messaging katmanı daha fazla veri deposu semantiği kullanıyor

Spring Integration'ın Redis 8.4+ CAS/CAD komutlarını kullanması, entegrasyon framework'lerinin artık yalnızca mesaj kanal soyutlaması değil, alttaki sistemin atomicity ve concurrency özelliklerini de aktif kullandığını gösteriyor. Bu iyi bir yön; fakat Redis sürüm farkı, fallback davranışı ve lock timeout senaryoları test edilmeden production güveni oluşturmaz.

### 5. AI başlığı var ama kalıcı değer governance ve context kontrolünde

Josh Long'un haftalık derlemesindeki Spring AI memory sessions, A2A, TodoWriteTool, Netflix'in Java/Spring Boot/Spring AI kullanımı ve branch-aware contract governance bağlantıları aynı sinyali veriyor: AI uygulamalarında kalıcı değer model çağrısından çok session, memory, contract, null-safety, test ve governance disiplininde.

### 6. Niş ama önemli üretim dersi: belirsiz girdide doğrulanabilirlik

InfoQ'nun Java ile bankacılık PDF table extraction yazısı, genel Java backend ekipleri için bile anlamlı bir mimari dersi taşıyor: ML veya tek parser stratejisi yeterli değil; scoring, validation, explicit fallback ve audit-friendly output contract gerekiyor. Bu, finansal doküman ingest'i kadar RAG, ETL, event enrichment ve dosya tabanlı backend akışları için de geçerli.

## Araçlar ve Kütüphaneler

- `Spring Security 6.5.10 / 7.0.5 / 7.1.0-RC1`: CVE düzeltmeleri nedeniyle yüksek öncelikli.
- `Spring Authorization Server 1.5.7`: Dynamic Client Registration kullanan authorization server'lar için kritik.
- `JDK 26.0.1 / 25.0.3 / 21.0.11 / 17.0.19 / 11.0.31 / 8u491`: April 2026 CPU baseline.
- `Spring Integration 7.1.0-RC1`: Redis lock semantiği, Redis DSL ve JMS customization.
- `Spring Vault 4.1.0-RC1 / 4.0.2`: Vault 2.0.0 uyumluluğu ve Jackson compatibility düzeltmeleri.
- `Vault 2.0.0`: Secret platformu yöneten ekipler için güvenlik, endpoint authentication ve path canonicalization değişiklikleri.
- `ExtractPDF4J`: InfoQ yazısında anlatılan Java-first doküman ingest mimarisinin aracı; genel Spring ekipleri için düşük/orta öncelikli, domain'i uygunsa izlenebilir.

## Java / Spring Geliştiricileri İçin Etkiler

Spring Security kullanan her ekip dependency tree üzerinden gerçek `spring-security-*` ve `spring-authorization-server` sürümünü çıkarmalı. Özellikle Boot 4 / Spring Security 7 pilotları, servlet path ve matcher davranışını integration test seviyesine indirmeli. "Endpoint çalışıyor" testi yeterli değil; "yanlış kullanıcı erişemiyor" ve "servlet path prefix varken doğru filter chain çalışıyor" testleri gerekiyor.

JDK CPU güncellemesi container image pipeline'ına girmeli. Runtime base image, buildpack builder/run image, CI test JDK'sı ve developer SDK'ları aynı security baseline'a taşınmadığında aynı kod farklı trust store, TLS ve GC davranışı gösterebilir.

Vault kullanan Spring Cloud Vault veya Spring Vault tabanlı servislerde yalnızca client library değil, Vault cluster sürümü ve operasyon prosedürleri de değerlendirilmeli. Vault 2.0.0 güvenlik açısından önemli ama canonical path, authenticated admin endpoint ve plugin/packaging değişiklikleri staging doğrulaması ister.

Spring Integration kullanan ekipler Redis distributed lock davranışını üretim yüküne benzeyen senaryolarla test etmeli: lock renewal, failover, Redis eski sürüm fallback'i, network partition, timeout ve process crash senaryoları.

AI özellikleri geliştiren Spring ekipleri için bugünkü ders, framework seçimi yarışından çok operasyonel sözleşme tasarımıdır: memory lifecycle, tool approval, contract test, context compaction, null-safety ve deterministik testler olmadan Spring AI veya başka bir Java AI framework'ü production olgunluğu sağlamaz.

## Fırsatlar ve Riskler

Fırsatlar:

- Spring Security patch dalgasını kullanarak authorization test kapsamını gerçek path/context/gateway senaryolarına genişletmek.
- JDK CPU geçişini yalnızca güvenlik yaması değil, runtime davranış testi olarak ele almak: G1 OOME, TLS session ticket, CA distrust ve crypto policy kontrollerini aynı pipeline'a koymak.
- Spring Integration `7.1.0-RC1` ile Redis lock davranışını Lua script bağımlılığından Redis native atomik komutlara yaklaştırmak.
- Vault 2.0.0 geçiş hazırlığında secret path canonicalization, admin endpoint auth ve token header sınırlarını platform runbook'una işlemek.
- AI ve contract governance başlıklarını tek bir platform kalite konusu olarak ele almak: branch-aware contract, JSpecify enforcement ve memory/session disiplinini birlikte tasarlamak.

Riskler:

- Boot BOM beklemeden tüm servislerde kör dependency override yapmak regresyon üretebilir.
- Spring Security CVE'lerini "sadece Security 7 etkileniyor" diye genelleyip `withIssuerLocation`, one-time token veya DaoAuthenticationProvider risklerini kaçırmak mümkün.
- JDK 21.0.11 sonrası G1'in yeni OOME davranışı, bellek baskısı altındaki servislerde incident semantiğini değiştirebilir.
- Vault 2.0.0'ın güvenlik kazanımları, migration testi yapılmadan alınırsa rekey/generate-root prosedürlerinde ve KVv2 path kullanan otomasyonlarda kırılma görülebilir.
- Düşük güvenilirlikteki doküman/AI/ML çıktısını doğrulama olmadan downstream sistemlere aktarmak, sessiz veri bozulmasına neden olur.

## İzlenmesi Gereken Konular

- Spring Boot `3.5.14`, `4.0.6` ve `4.1.0-RC1` duyuruları: Spring Framework, Spring Security, Spring Data ve Integration/Vault sürümlerini hangi kombinasyonla taşıyacak?
- Spring Security `7.1.0` GA: RC1'deki yeni feature set ile CVE düzeltmelerinin Boot 4.1 hattına etkisi.
- Oracle/OpenJDK vendor dağıtımları: Temurin, Corretto, Liberica, Microsoft Build of OpenJDK ve container image'ların April CPU'yu ne zaman taşıdığı.
- Vault 2.0.0 adoption raporları: canonical path enforcement ve authenticated admin endpoint değişikliklerinin gerçek operasyonlara etkisi.
- Spring I/O sonrası paylaşılan session kayıtları: Spring Cloud Contract 5, Spring AI agent/session, Boot 4 migration ve resilience oturumlarının örnek repo ve slide çıktıları.
- JDK 27 EA hattı: Önceki günlerde izlenen Compact Object Headers, Structured Concurrency ve PQC başlıklarına ek olarak JDK 27 locale/translation compatibility heads-up'ları CI testlerinde görünür tutulmalı.

## Kaynak Bazlı Bulgular

### 1. Spring Security ve Spring Authorization Server güvenlik düzeltmeleri bugünün en kritik Spring başlığı

- **title:** Spring Security 2026.04 release seti ve Authorization Server 1.5.7, identity/authorization yüzeyinde acil patch gerektiriyor
- **source:** [Spring Security 2026.04 Releases](https://spring.io/blog/2026/04/21/spring-security-releases/), [Spring Authorization Server 1.5.7](https://spring.io/blog/2026/04/21/spring-authorization-server-1-5-7-available-now/), [CVE-2026-22752](https://spring.io/security/cve-2026-22752/), [CVE-2026-22753](https://spring.io/security/cve-2026-22753/), [CVE-2026-22754](https://spring.io/security/cve-2026-22754/), [CVE-2026-22748](https://spring.io/security/cve-2026-22748/), [CVE-2026-22751](https://spring.io/security/cve-2026-22751/)
- **author:** `Josh Cummings`, `Joe Grandja`, Spring Security advisory team
- **date:** `20-21 Nisan 2026`
- **category:** `security-platform-release`
- **tags:** `spring-security`, `spring-authorization-server`, `oauth2`, `dynamic-client-registration`, `servlet-path`, `jwt`, `x509`, `one-time-token`, `daoauthenticationprovider`
- **summary:** Spring Security `6.5.10`, `7.0.5`, `7.1.0-RC1` ve Spring Authorization Server `1.5.7` yayımlandı. Release seti yedi CVE kapatıyor. En kritik olan `CVE-2026-22752`, Dynamic Client Registration endpoint'lerinde metadata validation eksikliğine bağlı Stored XSS, privilege escalation veya SSRF doğurabiliyor. `CVE-2026-22753` ve `CVE-2026-22754`, Spring Security 7'de servlet path'in matcher/authorization rule hesaplamasına dahil edilmemesiyle authorization kontrollerinin devre dışı kalmasına yol açabiliyor.
- **why_it_matters:** Bu açıklar authentication library iç detayı değil, doğrudan authorization sınırı, JWT issuer validation ve auth server client onboarding yüzeyi. Kurumsal sistemlerde bu katmanlar gateway, BFF, resource server ve identity platformunun ortak güvenlik sınırıdır.
- **java_spring_relevance:** Spring Boot servisleri Spring Security'yi genellikle auto-configuration ile tüketir. Ekipler çoğu zaman `securityMatchers`, `spring.mvc.servlet.path`, `NimbusJwtDecoder.withIssuerLocation`, X.509 pre-auth, one-time token login veya SAS Dynamic Client Registration kullanımını merkezi envanterde tutmaz. Bu CVE seti bu eksikliği görünür kılıyor.
- **actionability:** `hemen_envanter_ve_patch_karari`
- **impact_level:** `yüksek`
- **opportunities:** Authorization integration testlerini gerçek servlet path/gateway prefix senaryolarına genişletmek; Dynamic Client Registration için metadata allowlist ve approval modelini gözden geçirmek; JWT decoder kurulumlarında issuer validator'ı açıkça doğrulamak.
- **risks:** Boot patch beklerken etkilenmiş auth server veya Security 7 servislerini açık bırakmak; dependency override'ı test etmeden yaymak; `withIssuerLocation` artık issuer validation eklediğinde tenant veya test issuer senaryolarının kırılmasını migration planına almamak.
- **migration_notes:** Önce dependency tree çıkarın. `org.springframework.security:*` için `6.5.10` veya `7.0.5`, SAS için `1.5.7` hedefini belirleyin. Boot BOM dışına çıkılacaksa security, MVC/WebFlux, servlet path, gateway prefix, JWT issuer, Dynamic Client Registration, X.509 ve one-time token testleri birlikte koşturulmalı. Dynamic Client Registration endpoint'i açık değilse risk azalır ama yine de sürüm takibi kapatılmamalı.

### 2. Oracle Java SE April 2026 CPU, JDK runtime baseline'ını değiştiriyor

- **title:** April 2026 CPU ile JDK 26.0.1, 25.0.3, 21.0.11, 17.0.19, 11.0.31 ve 8u491 security baseline oldu
- **source:** [Oracle Critical Patch Update Advisory - April 2026](https://www.oracle.com/security-alerts/cpuapr2026.html), [Oracle Java Management CPU note](https://docs.oracle.com/iaas/releasenotes/java-management/jdk-cpu-april-2026.htm), [JDK 26.0.1 release notes](https://www.oracle.com/java/technologies/javase/26-0-1-relnotes.html), [JDK 21.0.11 release notes](https://www.oracle.com/java/technologies/javase/21-0-11-relnotes.html), [OpenJDK 17u timeline](https://wiki.openjdk.org/display/JDKUpdates/JDK%2B17u), [GraalVM release calendar](https://www.graalvm.org/release-calendar/)
- **author:** Oracle Java SE / Oracle Security / OpenJDK Updates maintainers
- **date:** `21 Nisan 2026`
- **category:** `jdk-security-runtime`
- **tags:** `jdk`, `oracle-cpu`, `openjdk`, `graalvm`, `spring-boot`, `g1`, `tls`, `jsse`, `jaxp`, `container`, `timezone`
- **summary:** Oracle April 2026 CPU, aktif Java aileleri için yeni security baseline'ları yayımladı. Risk matrisinde Java SE/GraalVM tarafında JAXP, Networking, JSSE, Security, JGSS ve client-libs bileşenlerine ait CVE'ler var. JDK 21.0.11 release notes ayrıca TLSv1.3 session ticket count property, keytool/jarsigner password handling iyileştirmesi, yeni `jdk.crypto.disabledAlgorithms` güvenlik property'i, Chunghwa root CA distrust politikası ve G1 `UseGCOverheadLimit` davranışı içeriyor.
- **why_it_matters:** JDK güncellemesi çoğu Spring servisinde "base image değişti" gibi ele alınır; fakat trust store, XML/JAXP, networking, TLS, GC ve container detection gibi alanlar doğrudan runtime davranışı üretir.
- **java_spring_relevance:** Spring Boot uygulamaları XML parse, TLS outbound/inbound, JWT/JWKS çağrıları, JDBC TLS, Kafka TLS, actuator metrics, GC davranışı ve container memory limitleriyle JDK'ya sıkı bağlıdır. JDK 21 LTS kullanan servislerde G1'in GC overhead limit OOME davranışı özellikle dikkat ister.
- **actionability:** `hemen_runtime_patch_ve_regression_test`
- **impact_level:** `yüksek`
- **opportunities:** JDK image refresh sürecini standardize etmek; JVM security baseline dashboard'u oluşturmak; G1 fail-fast davranışını bellek baskısı testlerine eklemek; TLS trust store değişikliklerini dış bağımlılık taramasıyla doğrulamak.
- **risks:** Vendor JDK ve container image'ların farklı hızda güncellenmesi; sadece build JDK'sını yükseltip runtime image'ı eski bırakmak; yeni CA distrust veya crypto policy davranışını production'da ilk kez görmek; bellek baskısı altındaki servislerde beklenmedik OOME alarmı almak.
- **migration_notes:** CI, local dev, buildpack, container base image ve Kubernetes runtime image'larını aynı baseline'a taşıyın. JDK 21.0.11 için heap stress, TLS handshake, XML/JAXP parse, timezone-sensitive test, keytool automation ve cgroup/container limit testleri çalıştırın. GraalVM native image kullanan servislerde CPU takvimine göre `25.0.3` hizasını ayrıca takip edin.

### 3. Spring Integration 7.1.0-RC1, Redis ve JMS entegrasyonlarında operasyonel doğruluğu artırıyor

- **title:** Spring Integration 7.1 RC1, Redis lock yenileme/release için native CAS/CAD ve Redis DSL getiriyor
- **source:** [Spring Integration 7.1.0-RC1 Available](https://spring.io/blog/2026/04/21/spring-integration-7-1-0-rc1-available/), [Spring Integration 7.0 to 7.1 Migration Guide](https://github.com/spring-projects/spring-integration/wiki/Spring-Integration-7.0-to-7.1-Migration-Guide)
- **author:** `Glenn Renfro`, Spring Integration maintainers
- **date:** `21 Nisan 2026`
- **category:** `integration-messaging`
- **tags:** `spring-integration`, `redis`, `distributed-lock`, `cas`, `cad`, `redis-8.4`, `jms`, `java-dsl`, `spring-boot-4.1`
- **summary:** `7.1.0-RC1`, `RedisLockRegistry` için lock renewal ve release aşamalarında Redis 8.4+ native CAS/CAD komutlarını kullanıyor; eski Redis sürümlerinde Lua script fallback'i var. Redis modülü için `org.springframework.integration.redis.dsl.Redis` Java DSL factory eklendi. `JmsChannelFactoryBean`, default yerine custom `JmsTemplate` verilmesine izin veriyor.
- **why_it_matters:** Distributed lock, message orchestration ve JMS channel konfigürasyonu integration katmanında üretim doğruluğunu belirler. Redis'in native atomic komutlarını kullanmak doğru yönde bir adım; ancak Redis sürümüne bağlı davranış farkı yönetilmelidir.
- **java_spring_relevance:** Spring Boot servisleri Spring Integration'ı batch, event-driven, file polling, distributed lock, scheduler coordination ve JMS akışlarında kullanır. Redis lock davranışı yanlışsa duplicate processing, stuck lock veya lost work üretilebilir.
- **actionability:** `rc_pilot_ve_lock_senaryo_testi`
- **impact_level:** `orta-yüksek`
- **opportunities:** Redis 8.4+ kullanan platformlarda lock semantiğini daha açık ve native komutlara dayalı hale getirmek; JMS channel'larında kurum standardı `JmsTemplate` ayarlarını merkezi kullanmak; Redis DSL ile integration flow okunabilirliğini artırmak.
- **risks:** RC sürümünü geniş production standardı yapmak erken; Redis 8.4+ ve eski Redis fallback davranışını aynı varsaymak; lock TTL, renewal ve network partition senaryolarını test etmemek.
- **migration_notes:** GA Mayıs 2026 hedefi öncesi düşük riskli servislerde POC açın. Redis sürümünü, lock TTL'lerini, failover davranışını, process kill senaryosunu, renewal race'lerini ve Lua fallback'i ayrı test edin. `TestUtils.getPropertyValue` deprecation gibi migration guide notlarını test yardımcı kodlarında temizleyin.

### 4. Spring Vault 4.1 RC1 ve Vault 2.0.0, secret platformlarında client-server uyumluluğunu gündeme taşıyor

- **title:** Spring Vault 4.1.0-RC1 Vault 2.0.0'a hazırlanırken Vault 2.0.0 güvenlik ve breaking-change yüzeyi büyüyor
- **source:** [Spring Vault 4.1.0-RC1 and 4.0.2 released](https://spring.io/blog/2026/04/20/spring-vault-4-0-rc1-4-0-2-released/), [Spring Vault 4.1.0-RC1 GitHub release](https://github.com/spring-projects/spring-vault/releases/tag/4.1.0-RC1), [Vault v2.0.0 release](https://github.com/hashicorp/vault/releases/tag/v2.0.0), [HCSEC-2026-08](https://discuss.hashicorp.com/t/hcsec-2026-08-vault-vulnerable-to-denial-of-service-via-unauthenticated-root-token-generation-rekey-operations/77345), [HCSEC-2026-05](https://discuss.hashicorp.com/t/hcsec-2026-05-vault-kvv2-metadata-and-secret-deletion-policy-bypass-denial-of-service/77342)
- **author:** `Mark Paluch`, Spring Vault maintainers, HashiCorp Vault maintainers
- **date:** `16-20 Nisan 2026`
- **category:** `secrets-security-platform`
- **tags:** `spring-vault`, `spring-cloud-vault`, `vault-2.0`, `secrets`, `kvv2`, `rekey`, `generate-root`, `jackson-3`, `canonical-path`, `token-header`
- **summary:** Spring Vault `4.1.0-RC1`, Vault `2.0.0` ile build ediliyor, Spring Framework `7.0.7` ve Spring Data `2026.0.0-RC1` ile hizalanıyor, ayrıca Jackson compatibility kaynaklı Jackson 2 initialization risklerini düzeltiyor. HashiCorp Vault `2.0.0` ise root token generation/rekey DoS ve KVv2 policy bypass DoS gibi güvenlik düzeltmelerini, canonical path enforcement'ı, authenticated admin endpoint davranışını ve token header size limitini içeriyor.
- **why_it_matters:** Secret platformu uygulama runtime'ının dışındaymış gibi görünür, ama config import, dynamic credentials, database secret rotation, PKI ve Kubernetes auth üzerinden Spring servislerinin availability ve startup davranışını belirler.
- **java_spring_relevance:** Spring Cloud Vault veya Spring Vault kullanan servisler Vault API davranışındaki canonical path, auth endpoint, token header ve KVv2 değişikliklerinden etkilenebilir. Jackson 2/3 geçiş yüzeyi ise Boot 4/Jackson 3 planlarıyla kesişiyor.
- **actionability:** `platform_staging_testi_ve_runbook_guncelle`
- **impact_level:** `orta-yüksek`
- **opportunities:** Vault 2.0 geçişiyle admin endpoint güvenliğini güçlendirmek; KVv2 policy testlerini otomatikleştirmek; secret client/server uyumluluğunu Spring Boot 4 migration planına dahil etmek; token header limitini abuse protection olarak standartlaştırmak.
- **risks:** Vault 2.0 breaking changes nedeniyle existing automation, Terraform, pipeline veya rekey runbook'larının kırılması; canonical path enforcement'ın custom client kodunu etkilemesi; Spring Vault RC sürümünü Boot BOM stratejisinden bağımsız yaymak.
- **migration_notes:** Önce Vault cluster ve client library envanteri çıkarın. KVv2 data/metadata path access, config import startup, Kubernetes auth, database credential rotation, PKI certificate renewal, rekey/generate-root runbook ve Terraform/provider akışlarını staging'de test edin. Vault 2.0'a geçmeden önce Spring Vault/Spring Cloud Vault sürüm uyumluluğunu doğrulayın.

### 5. Josh Long'un haftalık derlemesi, Spring ekiplerinde governance ve null-safety yönünü güçlendiriyor

- **title:** Spring ekosistem sinyalleri branch-aware contract, JSpecify enforcement ve AI session governance etrafında birleşiyor
- **source:** [This Week in Spring - April 21st, 2026](https://spring.io/blog/2026/04/21/this-week-in-spring-april-21-2026/), [Netflix Java 2026 session notes](https://www.selikoff.net/2026/03/17/javaone-2026-how-netflix-uses-java-2026-edition/), [Spring Cloud project page](https://spring.io/projects/spring-cloud/)
- **author:** `Josh Long`, `Jeanne Boyarsky`, `Paul Bakker`, linked Spring community authors
- **date:** `17 Mart 2026`, `21 Nisan 2026`
- **category:** `developer-productivity-architecture-governance`
- **tags:** `spring-ai`, `spring-cloud-contract`, `jspecify`, `null-safety`, `spring-boot-4`, `netflix`, `contract-testing`, `ai-governance`
- **summary:** Josh Long'un 21 Nisan derlemesi; Spring AI long-lived memory sessions, A2A communication, TodoWriteTool, Maven ile JSpecify compliance enforcement, Netflix'in Java/Spring Boot/Spring AI kullanımı, branch-aware contract governance ve Spring Framework 7.1 SpEL Optional desteği gibi bağlantıları öne çıkarıyor. Netflix notlarında Spring Boot 4 migration için AI destekli tooling, ZGC default tercihi ve virtual thread denemelerinin temkinli ilerlediği görülüyor.
- **why_it_matters:** Bunlar tek başına release kadar acil değil, ancak tekrarlayan yön sinyali veriyor: büyük Java/Spring organizasyonları migration, contract testing, null-safety ve AI entegrasyonunu platform mühendisliği disiplini olarak ele alıyor.
- **java_spring_relevance:** Spring Cloud Contract, JSpecify, Boot 4 migration ve Spring AI session/memory konuları doğrudan Spring ekiplerinin kod kalitesi, API compatibility ve AI production readiness gündemine giriyor.
- **actionability:** `izle_ve_hedefli_platform_poc`
- **impact_level:** `orta`
- **opportunities:** Contract testleri branch ve deployment kararına bağlamak; JSpecify kurallarını Maven/CI'da kademeli enforce etmek; Spring AI memory/session davranışını test edilebilir platform standardı yapmak; Boot 4 migration'da AI araçlarını sadece öneri üreten yardımcı olarak konumlamak.
- **risks:** AI tooling'i migration doğrulamasının yerine koymak; null-safety enforcement'ı tüm repo için bir anda açıp build kırılımı üretmek; contract governance olmadan çok servisli branch geliştirmede entegrasyon drift'ini büyütmek.
- **migration_notes:** Önce kritik servis çiftlerinde branch-aware contract pilotu yapın. JSpecify için warning-only veya module-level gate ile başlayın. AI destekli migration çıktısını OpenRewrite, integration test ve security testleriyle doğrulamadan merge etmeyin.

### 6. Java ile production PDF extraction yazısı, belirsiz girdilerde doğrulanabilir mimari dersleri veriyor

- **title:** Java-first doküman ingest mimarisinde tek parser yerine validation, scoring ve fallback ön plana çıkıyor
- **source:** [InfoQ - Redesigning Banking PDF Table Extraction](https://www.infoq.com/articles/redesign-pdf-table-extraction/)
- **author:** `Mehuli Mukherjee`, review: `Michael Redlich`
- **date:** `21 Nisan 2026`
- **category:** `data-ingestion-architecture`
- **tags:** `java`, `pdf`, `ocr`, `validation`, `scoring`, `fallback`, `financial-services`, `ml-guardrails`, `extractpdf4j`
- **summary:** Yazı, bankacılık PDF table extraction problemini kütüphane seçimi değil üretim mimarisi problemi olarak ele alıyor. Stream parsing, lattice/OCR ve ML-assisted layout detection yalnızca aday stratejiler; asıl güvenilirlik validation, confidence scoring, explicit fallback, non-sensitive diagnostics ve audit-friendly output contract ile geliyor.
- **why_it_matters:** Enterprise backend sistemlerinde belirsiz girdi yalnızca PDF değildir. E-posta, dosya, event payload, LLM/tool output, OCR, partner API ve legacy batch verisi benzer sessiz bozulma riski taşır.
- **java_spring_relevance:** Spring Batch, Spring Integration, Spring Boot REST ingest ve RAG preprocessing yapan ekipler için bu yaklaşım doğrudan uygulanabilir: çıktı şemasına `strategyUsed`, `confidenceScore`, `warnings` ve `diagnostics` gibi alanlar eklemek downstream güvenliğini artırır.
- **actionability:** `dusuk_orta_oncelik_domain_uygunsa_uygula`
- **impact_level:** `düşük-orta`
- **opportunities:** Belirsiz input pipeline'larında deterministic validation standardı kurmak; ML'i "truth extractor" değil "candidate region/strategy selector" olarak konumlamak; audit ve manual review akışlarını teknik sözleşmeye eklemek.
- **risks:** Domain dışı ekipler için önceliği düşük; fakat ilgili domainlerde düşük confidence çıktıyı sessizce normal veri gibi aktarmak finansal/regülasyonel risk doğurur.
- **migration_notes:** Mevcut dosya/LLM/OCR ingest akışlarında output contract'ı zenginleştirin. Confidence threshold, failure reason, partial output flag, manual review queue ve drift metriği eklenmeden ML-assisted extraction'ı production'a almayın.

## Sonuç

22 Nisan taramasında tekrar eden Spring Data RC1, JDK 27 Compact Object Headers, Structured Concurrency, Camel 4.19 ve önceki Framework/Tomcat CVE başlıkları yeniden genişletilmedi. Bugünün kararı net: Java/Spring ekipleri Spring Security ve SAS patch envanterini hemen çıkarmalı, April 2026 JDK CPU'yu runtime pipeline'ına almalı, Vault/Spring Vault geçişini platform runbook düzeyinde test etmeli ve Integration/contract/null-safety başlıklarını üretim doğruluğu disiplini olarak ele almalı.

En yüksek öncelikli aksiyonlar: Spring Security/SAS dependency tree, etkilenen CVE kullanım matrisi, JDK runtime image baseline, Vault 2.0 staging testi ve Spring Boot patch release takibi.
