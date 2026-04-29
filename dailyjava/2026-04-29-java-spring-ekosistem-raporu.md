# Günlük Java / Spring Ekosistem Raporu

Tarih: 29 Nisan 2026  
Odak: Spring AI güvenlik ve API yüzeyi değişimleri, Spring gRPC advisory’leri, Spring Boot patch hatları, JDK integrity/TLS hazırlığı, Spring Data AOT

Tarama notu: Bugünkü taramada [Spring Blog](https://spring.io/blog/), [Spring Projects](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security), [Spring AI 1.0.6 / 1.1.5 / 2.0.0-M5 duyurusu](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now), [Spring Boot 3.5.14](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now), [Spring Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now), [Spring Shell 4.0.2](https://spring.io/blog/2026/04/24/spring-shell-4-0-2-is-out), [Spring gRPC advisory 1](https://spring.io/security/cve-2026-40968), [Spring gRPC advisory 2](https://spring.io/security/cve-2026-40969), [Spring gRPC docs](https://docs.spring.io/spring-grpc/reference/getting-started.html), [Inside Java](https://inside.java/), [JEP 500](https://openjdk.org/jeps/500), [JEP 527](https://openjdk.org/jeps/527), [JDK 27 EA release notes](https://jdk.java.net/27/release-notes), [InfoQ Java roundup - 28 Nisan 2026](https://www.infoq.com/news/2026/04/java-news-roundup-apr20-2026/), [InfoQ Spring roundup - 27 Nisan 2026](https://www.infoq.com/news/2026/04/spring-news-roundup-apr20-2026/), [Baeldung Java Weekly 643](https://www.baeldung.com/java-weekly-643), [Baeldung Spring Data AOT Repositories](https://www.baeldung.com/spring-data-aot-repositories), [AWS Spring AI AgentCore GA](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-machine-learning/), [Gunnar Morling - Hardwood Beta](https://www.morling.dev/blog/hardwood-reaches-beta-s3-predicate-push-down-cli/), [Burak KUTBAY blogu](https://blog.burakkutbay.com/) ve ilgili resmi dokümantasyonlar kontrol edildi. Burak KUTBAY tarafında bugün yeni üretim-kritik release sinyali yok; Baeldung tarafında en değerli yeni sinyal AOT repository yaklaşımının pratik etkisi; Gunnar Morling tarafında ise `Hardwood` hâlâ düşük öncelikli ama izlemeye değer bir JVM veri aracı sinyali üretiyor.

## Öne Çıkan Başlıklar

- `Spring AI 1.0.6` ve `1.1.5`, yalnızca bug fix değil; çok kiracılı bellek izolasyonu, filter expression injection, Cosmos SQL injection, ONNX cache exposure ve attacker-controlled PDF OOM gibi gerçek üretim risklerini kapatıyor. `2.0.0-M5` ise aynı anda migration maliyeti getiriyor.
- `Spring gRPC` için 28 Nisan 2026’da iki advisory yayımlandı. `1.0.0`-`1.0.2` aralığında authorization failure sonrası `SecurityContext` sızıntısı ve hata mesajı yansıması var; fix seviyesi `1.0.3`.
- Geçen haftaki Spring Boot advisory dalgası artık “izle” statüsünde değil. `Spring Boot 3.5.14` ve özellikle `4.0.6`, deploy edilmesi gereken patch baselines haline geldi.
- Java platform tarafında en kalıcı sinyal yeni syntax değil; `final field` mutasyonunun kısıtlanması ve `TLS 1.3` için post-quantum hibrit anahtar değişiminin yaklaşması. İkisi de test backlog’una girmeli.
- `Spring Data AOT Repositories`, newsletter malzemesi olmanın ötesine geçiyor. Özellikle startup süresi, native image ve sorgu görünürlüğü önemliyse gerçek mühendislik değeri taşıyor.

## Kritik Güncellemeler

### Spring AI’de patch zorunluluğu ile API kırılması aynı pakette geliyor

[Spring AI 1.0.6 / 1.1.5 / 2.0.0-M5 duyurusu](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now), iki ayrı mesaj veriyor:

- `1.0.6` ve `1.1.5`, beş ayrı güvenlik problemini kapatıyor.
- `2.0.0-M5`, aynı anda kırıcı migration başlıkları getiriyor.

Güvenlik tarafında öne çıkanlar:

- [`CVE-2026-40966`](https://spring.io/security/cve-2026-40966): `VectorStoreChatMemoryAdvisor` conversation scoping zafiyeti, cross-tenant memory exfiltration riski taşıyor.
- [`CVE-2026-40967`](https://spring.io/security/cve-2026-40967): çeşitli `FilterExpressionConverter` implementasyonlarında injection riski var.
- [`CVE-2026-40978`](https://spring.io/security/cve-2026-40978): `CosmosDBVectorStore.doDelete()` içinde SQL injection.
- [`CVE-2026-40979`](https://spring.io/security/cve-2026-40979): ONNX model cache için varsayılan world-writable `/tmp` kullanımı.
- [`CVE-2026-40980`](https://spring.io/security/cve-2026-40980): attacker-controlled PDF ile OOM.

`2.0.0-M5` tarafında ise platform ekiplerini ilgilendiren esas nokta güvenlik değil, bağımlılık topolojisi:

- Azure OpenAI modülleri kaldırıldı; standart `spring-ai-openai` modülü içine taşındı.
- `Vertex AI` model ve auto-configuration modülleri kaldırıldı; yalnız embedding modülü kaldı.
- `ZhipuAI` ve `OCI GenAI` ana repodan çıkarıldı; ayrı entegrasyon reposuna gidildi.
- Option merging davranışı model seviyesinden `ChatClient` seviyesine taşındı.
- `spring-ai-openai`, artık resmi `openai-java` SDK’sını temel alıyor.

Bu birleşim kritik: prod’da `1.0.x/1.1.x` kullanan ekipler için mesaj “hemen patchle”; `2.0.0-M5` düşünen ekipler için mesaj ise “önce migration envanteri çıkar”.

### Spring gRPC yeni ama artık security ownership gerektiriyor

28 Nisan 2026’da Spring tarafında iki yeni gRPC advisory yayımlandı:

- [`CVE-2026-40968`](https://spring.io/security/cve-2026-40968): authorization failure sonrası `SecurityContext` thread üzerinde kalabiliyor ve sonraki unauthenticated isteğe taşınabiliyor.
- [`CVE-2026-40969`](https://spring.io/security/cve-2026-40969): `AuthenticationException` mesajı remote client’a yansıyabiliyor.

Fix seviyesi `Spring gRPC 1.0.3`. Bu özellikle önemli çünkü [Spring gRPC getting started dokümanı](https://docs.spring.io/spring-grpc/reference/getting-started.html), `1.0.x` hattını doğrudan Spring Boot 4 tabanlı geliştirme akışına yerleştiriyor. Yani konu “deneysel kenar proje” olmaktan çıkıyor.

Pratik etki:

- `@PreAuthorize` kullanan gRPC servislerinde negatif auth testleri artık zorunlu.
- Thread-local temizliği ve interceptor sırası, HTTP stack’te alışılmış güvenlik varsayımlarıyla aynı kabul edilmemeli.
- Exception mesajları observability/logging için faydalı olsa da remote surface’e taşınmamalı.

### Spring Boot 3.5.14 ve 4.0.6, artık minimum güvenli baseline

[Spring Boot 3.5.14](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now) ve [Spring Boot 4.0.6](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now), geçen haftaki advisory listesini gerçek patch seviyesine dönüştürdü. Buradaki kritik detay, iki hattın aynı risk setini taşımaması:

- `4.0.6`, `CVE-2026-40976` ile default security filter chain boşluğunu kapatıyor. Bu açık, belirli koşullarda yetkisiz erişime kadar gidebiliyor.
- `4.0.6`, ayrıca Elasticsearch/RabbitMQ/Cassandra hostname verification, weak PRNG, predictable temp directory ve PID symlink risklerini de düzeltiyor.
- `3.5.14`, aynı kümenin önemli bölümünü kapatıyor ama `4.0.x` hattına özgü tüm riskleri taşımıyor.

Buradan çıkan sonuç net: “biz 3.5.x’teyiz, o zaman 4.0.6’daki kritikler bizi bağlamaz” gibi yüzeysel okumalar yanlış olabilir; advisory’leri branch bazında okumak gerekiyor.

### JDK tarafında “final mean final” ve PQ TLS artık gerçek hazırlık işi

[Inside Java’daki 27 Nisan 2026 tarihli yazı](https://inside.java/), [`JEP 500`](https://openjdk.org/jeps/500) ile birlikte düşünüldüğünde şunu söylüyor: reflective `final field` mutasyonu artık “ileri bir gün teknik borç” değil, bugünden ölçülmesi gereken bir uyumluluk konusu.

Paralelde [`JEP 527`](https://openjdk.org/jeps/527) ve [JDK 27 EA release notes](https://jdk.java.net/27/release-notes), `TLS 1.3` için hibrit post-quantum key exchange’i öne çıkarıyor. Varsayılan istemci davranışında `X25519MLKEM768` üst sıralara çıkıyor.

[InfoQ’nun 28 Nisan 2026 roundup’ı](https://www.infoq.com/news/2026/04/java-news-roundup-apr20-2026/) da `JDK 27` takvimini netleştiriyor:

- Rampdown Phase One: 4 Haziran 2026
- Rampdown Phase Two: 16 Temmuz 2026
- Initial RC: 6 Ağustos 2026
- Final RC: 20 Ağustos 2026
- GA: 14 Eylül 2026

Bu tarihler nedeniyle “daha çok var” yaklaşımı zayıf kalıyor. Özellikle servis mesh, outbound proxy, özel TLS named group ayarı ve legacy serialization/reflection davranışları olan ekipler bugünden smoke test yazmalı.

## Trendler ve Sinyaller

### 1. Spring AI dünyası prototip fazını geçiyor ama stabil abstraction dönemi başlamadı

Spring AI release’leri, advisory’ler ve [AWS’nin Spring AI AgentCore GA duyurusu](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-machine-learning/) birlikte okunduğunda iki zıt sinyal geliyor:

- Ekosistem hızla üretime taşınıyor.
- Aynı anda güvenlik yüzeyi ve provider/maven module churn artıyor.

Bu nedenle burada kalıcı değer “LLM bağladık” değil; provider sınırı, tool exposure, vector store filtreleme, tenant isolation ve ingestion hardening disiplinidir.

### 2. Secure-by-default baskısı framework katmanından JVM katmanına kadar iniyor

Spring Boot advisory bundle, Spring gRPC auth thread hijyeni ve JDK `final field` kısıtlamaları aynı hikayeyi anlatıyor: framework ekipleri eskiden sessizce tolere edilen davranışları artık tolere etmek istemiyor.

Bu, özellikle platform ekipleri için önemlidir. Çünkü riskler artık business logic’te değil:

- default config’te,
- auto-configuration’da,
- transport/security interceptor zincirinde,
- build/runtime davranış sözleşmesinde toplanıyor.

### 3. “Daha az runtime sihri, daha çok build-time explicitlik” kalıcı mühendislik yönü gibi görünüyor

`Spring Data AOT Repositories`, `ChatClient` seviyesinde option composition ve `final field` mutasyonunun kısıtlanması birbirinden bağımsız değil. Ortak yön:

- çalışma zamanı sürprizlerini azaltmak,
- davranışı daha görünür kılmak,
- optimize edilebilir ve test edilebilir bir execution modeli üretmek.

Bu kısa vadeli hype değil; özellikle büyük monorepo ve çok servisli platformlar için kalıcı değer taşıyor.

## Araçlar ve Kütüphaneler

- `Spring Data AOT Repositories`: Yüksek izleme değeri. [Resmi dokümantasyon](https://docs.spring.io/spring-data/relational/reference/data-commons/aot.html) ve [Baeldung yazısı](https://www.baeldung.com/spring-data-aot-repositories) birlikte okunduğunda, derived/annotated/named query implementasyonlarının build-time üretilmesi sayesinde startup ve memory tarafında gerçek kazanç potansiyeli var. Reaktif repository’ler için genellememek gerekir.
- `Spring Shell 4.0.2`: Düşük-orta öncelik. [Resmi duyuru](https://spring.io/blog/2026/04/24/spring-shell-4-0-2-is-out), v3 ile hizalama farklarını ve stabilite/perf iyileştirmelerini vurguluyor. İç platform CLI’ları yazan ekipler için faydalı.
- `Spring AI SDK for Amazon Bedrock AgentCore`: Orta öncelik. AWS-heavy ekipler için yönetilen agent runtime tarafında Spring AI tabanlı üretimleştirme seçeneği güçleniyor.
- `Hardwood 1.0.0.Beta1`: Düşük öncelik. [Gunnar Morling’in duyurusu](https://www.morling.dev/blog/hardwood-reaches-beta-s3-predicate-push-down-cli/) özellikle S3 üzerinden Parquet okuma, predicate pushdown ve CLI ile veri yoğun JVM servisleri için ilginç; tipik CRUD mikroservis için ana gündem değil.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring AI` kullanıyorsanız, özellikle user-controlled `conversationId`, `filterExpression`, `documentId`, PDF ingestion ve local ONNX cache kullanan akışlar için `1.0.6` veya `1.1.5` seviyesine çıkmak ertelenmemeli.
- `Spring AI 2.0.0-M5`, “bakıp geçilecek milestone” değil; provider modülü ve builder davranışı değiştiği için gerçek migration denemesi gerektiriyor.
- `Spring gRPC` kullanan ekipler, `1.0.3` yükseltmesine ek olarak auth-deny sonrası anonim istek testi, thread reuse testi ve status-description sızıntı testi eklemeli.
- `Spring Boot 4.0.x` üzerinde olup `spring-boot-actuator-autoconfigure` kullanan ve security’yi default chain’e bırakan uygulamalar, branch’e özgü `CVE-2026-40976` koşullarını doğrulamalı.
- JDK geçişi planlayan ekipler, CI’de en az bir job’ı `--illegal-final-field-mutation=debug` veya `deny` ile çalıştırıp hangi kütüphanelerin kırılacağını erkenden görmeli.
- `Spring Data AOT`, özellikle imperative repository kullanan, startup budget’ı dar olan ya da native image hedefleyen servislerde pilotlanmalı; tüm repo tipleri için otomatik kazanç varsayılmamalı.

## Fırsatlar ve Riskler

### Fırsatlar

- `Spring AI` içinde resmi `openai-java` SDK’ya geçiş, custom adapter ve provider-specific shim maliyetini azaltabilir.
- `Spring Data AOT Repositories`, startup süresi ve query görünürlüğü sorunlarını aynı anda iyileştirebilir.
- `AgentCore` benzeri yönetilen runtime’lar, Spring AI prototiplerini şirket içi “agent platform” yazmadan üretime taşıma fırsatı sunabilir.
- `Spring Shell 4.0.2`, platform ekiplerinin operasyonel CLI araçlarını daha stabil bir temele taşıyabilir.

### Riskler

- `Spring AI 2.0.0-M5` modül kaldırmaları, BOM güncellemesi sırasında sessiz build kırılmalarına veya davranış farklarına yol açabilir.
- `Spring gRPC` advisory’leri, auth hatalarının yalnızca “kullanıcı 403 aldı” seviyesinde kalmadığını; thread üstünde yetki artığı bırakabileceğini gösteriyor.
- `JDK 27` hibrit TLS varsayılanları, eski proxy/middlebox veya sert named-group pin’leri olan ortamlarda beklenmedik interoperabilite sorunları çıkarabilir.
- `Spring Boot 4.0.x` ile `3.5.x` arasında risk seti aynı olmadığı için “iki branch de patchlendi, tamamdır” düşüncesi hatalı olabilir.

## İzlenmesi Gereken Konular

- `Spring AI 2.0` GA yolunda provider modül ayrışması daha da büyüyecek mi?
- `Spring gRPC 1.0.3` sonrası ilave design/security notları veya `1.1.x` güvenlik düzeltmeleri gelecek mi?
- `JDK 27` takvimi ilerledikçe hibrit TLS için yeni interoperability notları yayınlanacak mı?
- `Spring Data AOT` kapsamı reactive repository tarafına genişleyecek mi, yoksa esasen imperative çizgide mi kalacak?
- Patch kararları için `spring.io/projects` veya dokümantasyon overview sayfalarının değil, release/advisory akışının esas alınması gerekecek gibi görünüyor; bu gecikme devam edecek mi?

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring AI patch release’leri güvenlik borcunu kapatırken 2.0.0-M5 gerçek migration maliyeti getiriyor
- source: [Spring AI 1.0.6, 1.1.5, 2.0.0-M5 Available Now](https://spring.io/blog/2026/04/27/spring-ai-1-0-6-1-1-5-2-0-0-M5-available-now), [CVE-2026-40966](https://spring.io/security/cve-2026-40966), [CVE-2026-40967](https://spring.io/security/cve-2026-40967), [CVE-2026-40978](https://spring.io/security/cve-2026-40978), [CVE-2026-40979](https://spring.io/security/cve-2026-40979), [CVE-2026-40980](https://spring.io/security/cve-2026-40980)
- author: Ilayaperumal Gopinathan, Spring Security Team
- date: 27 Nisan 2026
- category: ai-platform, security, migration
- tags: spring-ai, vector-store, openai-java, azure-openai, cosmosdb, pdf, onnx, chat-memory
- summary: `1.0.6` ve `1.1.5`, multi-tenant memory isolation, filter injection, SQL injection, model cache exposure ve PDF OOM dahil beş açığı kapatıyor. `2.0.0-M5` ise provider modüllerini yeniden şekillendirip migration gerektiriyor.
- why_it_matters: Prod’daki AI servislerinde risk sadece model yanıtı değil; bellek, belge işleme, vector sorgu ve provider adaptörü katmanları da saldırı yüzeyi.
- java_spring_relevance: Spring AI tabanlı RAG, agent, tool-calling veya vector store kullanan tüm Java/Spring ekipleri için doğrudan ilgili.
- actionability: hemen_patchle_ve_m5_migration_envanteri_cikar
- impact_level: çok_yüksek
- opportunities: Resmi OpenAI SDK birleşmesiyle provider entegrasyonlarını sadeleştirmek; AI platform katmanını daha net sınırlarla yeniden düzenlemek.
- risks: Cross-tenant veri sızıntısı, query manipulation, SQL injection, OOM ve provider modül kırılmaları.
- migration_notes: `1.0.x/1.1.x` kullanıcıları güvenlik için hızla patchlemeli; `2.0.0-M5` ise ayrı migration branch’i ve dependency envanteriyle ele alınmalı.

### Bulgu 2

- title: Spring gRPC 1.0.x hattında auth failure sonrası SecurityContext sızıntısı ve hata mesajı ifşası var
- source: [CVE-2026-40968](https://spring.io/security/cve-2026-40968), [CVE-2026-40969](https://spring.io/security/cve-2026-40969), [Spring gRPC Getting Started](https://docs.spring.io/spring-grpc/reference/getting-started.html)
- author: belirtilmemiş
- date: 28 Nisan 2026
- category: rpc-security
- tags: spring-grpc, grpc, spring-security, securitycontext, thread-reuse, authentication
- summary: `1.0.0`-`1.0.2` aralığında authorization failure sonrası authenticated identity thread’de kalabiliyor; ayrıca `AuthenticationException` mesajları remote client’a yansıyabiliyor.
- why_it_matters: Bu, gRPC güvenliğinde failure path’lerin de request path kadar önemli olduğunu gösteriyor.
- java_spring_relevance: Spring Boot 4 ile gRPC kullanan ya da kullanmayı planlayan ekipler için yüksek önemde.
- actionability: 1_0_3e_yukselt_ve_negatif_auth_testleri_ekle
- impact_level: yüksek
- opportunities: Auth-deny test stratejisini HTTP ve gRPC arasında ortaklaştırmak; interceptor zincirini daha görünür hale getirmek.
- risks: Yetki sızıntısı, bilgi ifşası ve thread-local güvenlik varsayımlarının bozulması.
- migration_notes: `1.0.3` fix seviyesi hedeflenmeli; auth error path’leri ve anonymous follow-up request senaryoları regression testlerine eklenmeli.

### Bulgu 3

- title: Spring Boot 3.5.14 ve 4.0.6, advisory listesini gerçek patch baseline’a dönüştürüyor
- source: [Spring Boot 3.5.14 available now](https://spring.io/blog/2026/04/23/spring-boot-3-5-14-available-now), [Spring Boot 4.0.6 available now](https://spring.io/blog/2026/04/23/spring-boot-4-0-6-available-now), [CVE-2026-40976](https://spring.io/security/cve-2026-40976), [CVE-2026-40974](https://spring.io/security/cve-2026-40974), [CVE-2026-40977](https://spring.io/security/cve-2026-40977)
- author: Andy Wilkinson
- date: 23 Nisan 2026
- category: platform-security, patching
- tags: spring-boot, actuator, default-security, ssl-bundle, rabbitmq, cassandra, pidfile
- summary: Yeni stable patch’ler advisory’leri uygulanabilir sürüm seviyesine taşıdı. Özellikle `4.0.6`, `CVE-2026-40976` ile branch’e özgü kritik bir default security açığını kapatıyor.
- why_it_matters: Güvenlik tavsiyesi ile deploy edilebilir fix sürümü arasındaki boşluk kapandı; artık “bekleyelim” bahanesi zayıf.
- java_spring_relevance: Spring Boot tabanlı tüm servisler için doğrudan uygulanabilir.
- actionability: branch_bazli_hizli_patch
- impact_level: çok_yüksek
- opportunities: Config hardening checklist’ini release branch’lere göre standartlaştırmak.
- risks: Yanlış branch karşılaştırması, default security chain’e aşırı güven ve TLS hostname verification boşlukları.
- migration_notes: `4.0.x` ve `3.5.x` aynı risk seti gibi davranılmamalı; özellikle Actuator/Security kombinasyonları branch bazında test edilmeli.

### Bulgu 4

- title: Final field mutasyonu artık soyut JVM tartışması değil, kısa vadeli uyumluluk işi
- source: [Inside Java](https://inside.java/), [JEP 500: Prepare to Make Final Mean Final](https://openjdk.org/jeps/500)
- author: Nicolai Parlog, Ron Pressler, Alex Buckley
- date: 27 Nisan 2026 ve JDK 26 teslimatı
- category: jdk-compatibility, runtime-integrity
- tags: jdk26, jep500, reflection, serialization, final-field, integrity-by-default
- summary: JDK 26 ile reflective `final field` mutasyonları için uyarı dönemi başlamış durumda; gelecekte bu davranış varsayılan olarak exception’a dönecek.
- why_it_matters: Birçok eski kütüphane veya custom serialization/deserialization kodu bunu sessizce kullanıyor olabilir.
- java_spring_relevance: Spring ekosistemi doğrudan suçlu olmasa bile, Java backend uygulamalarının dependency zinciri bu davranışa dayanabilir.
- actionability: cide_debug_ve_deny_modu_ekle
- impact_level: yüksek
- opportunities: Gizli reflection bağımlılıklarını temizlemek, immutable model ve safer startup davranışı kazanmak.
- risks: Upgrade sırasında geç fark edilen runtime kırılmaları, serialization hack’leri ve framework dışı kütüphane uyumsuzlukları.
- migration_notes: CI’de `--illegal-final-field-mutation=debug` veya `deny` denenmeli; kırılan kütüphaneler ayrı backlog maddesi haline getirilmeli.

### Bulgu 5

- title: JDK 27 hibrit TLS 1.3 ve netleşen takvim, ağ katmanı smoke test’lerini erkene çekiyor
- source: [JEP 527: Post-Quantum Hybrid Key Exchange for TLS 1.3](https://openjdk.org/jeps/527), [JDK 27 Early-Access Release Notes](https://jdk.java.net/27/release-notes), [InfoQ Java News Roundup - 28 Nisan 2026](https://www.infoq.com/news/2026/04/java-news-roundup-apr20-2026/)
- author: Jamil Nimeh, OpenJDK, Michael Redlich
- date: 28 Nisan 2026 bağlam kontrolü
- category: jdk-security, networking
- tags: jdk27, tls13, post-quantum, ml-kem, named-groups, jsse
- summary: `JDK 27`, hibrit post-quantum TLS 1.3 key exchange’i öne çıkarıyor ve yayın takvimi artık net. Varsayılan named group davranışı ağ katmanında beklenmedik etki üretebilir.
- why_it_matters: Kod değişmeden gelen güvenlik iyileştirmeleri, çoğu zaman proxy, mesh ve middlebox katmanında sürpriz doğurur.
- java_spring_relevance: mTLS, outbound HTTPS, service mesh ve sert TLS policy kullanan Spring servisleri için doğrudan ilgili.
- actionability: early_access_tls_smoke_test
- impact_level: orta-yüksek
- opportunities: PQ hazırlığını erken doğrulamak; TLS policy envanterini temizlemek.
- risks: Middlebox uyumsuzluğu, named group override çakışmaları ve zor tanınan bağlantı sorunları.
- migration_notes: Özellikle `jdk.tls.namedGroups` override eden sistemler JDK 27 EA üzerinde test edilmeli.

### Bulgu 6

- title: Spring Data AOT Repositories, Boot 4 döneminde gerçek startup/perf kaldıraçlarından biri olabilir
- source: [Spring Data AOT docs](https://docs.spring.io/spring-data/relational/reference/data-commons/aot.html), [Baeldung - Introduction to Spring Data AOT Repositories](https://www.baeldung.com/spring-data-aot-repositories), [Spring Data Ahead of Time Repositories - Part 2](https://spring.io/blog/2025/11/25/spring-data-ahead-of-time-repositories-part-2)
- author: Spring Data Team, Stelios Anastasakis, Christoph Strobl
- date: 29 Nisan 2026 bağlam kontrolü
- category: performance, build-time-optimization
- tags: spring-data, aot, native-image, startup, repositories, query-metadata
- summary: Spring Data AOT, derived/annotated/named query implementasyonlarını build-time üretip runtime reflection maliyetini azaltıyor; ayrıca query metadata üretimi sağlıyor.
- why_it_matters: Bu, yalnız native image konusu değil; JVM startup ve repository görünürlüğü için de değer taşıyor.
- java_spring_relevance: Spring Data JPA, JDBC, MongoDB ve Cassandra kullanan ekipler için özellikle ilgili.
- actionability: secili_servislerde_pilot
- impact_level: orta-yüksek
- opportunities: Daha hızlı startup, daha düşük runtime analiz maliyeti, query görünürlüğü ve native hazırlığı.
- risks: Tüm repository tipleri için eşit fayda beklentisi, reactive kullanım senaryolarına yanlış genelleme ve build pipeline karmaşıklığı.
- migration_notes: AOT repository’ler iç optimizasyon olarak ele alınmalı; generated sınıflara doğrudan bağımlılık kurulmadan, seçili servislerde pilot yapılmalı.

### Bulgu 7

- title: AWS, Spring AI etrafında yönetilen agent runtime hikayesini resmileştiriyor
- source: [AWS - Spring AI SDK for Amazon Bedrock AgentCore is now Generally Available](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-machine-learning/), [Josh Long - This Week in Spring - April 28th, 2026](https://spring.io/blog/2026/04/28/this-week-in-spring-april-28-2026)
- author: Andrei Shakirin, Yuriy Bezsonov, James Ward ve diğerleri; Josh Long
- date: 14 Nisan 2026 ve 28 Nisan 2026
- category: ai-platform, cloud-runtime
- tags: spring-ai, aws, bedrock, agentcore, managed-runtime, agents
- summary: AWS, Spring AI tabanlı agent uygulamaları için yönetilen runtime, memory ve tooling katmanını ürünleştiriyor; Josh Long’un haftalık özetinde de bu sinyal öne çıkarılıyor.
- why_it_matters: Spring AI’nin yalnız kütüphane değil, çevresinde platform ekosistemi oluştuğunu gösteriyor.
- java_spring_relevance: AWS üzerinde agentic uygulama kuran Spring ekipleri için mimari karar değeri taşıyor.
- actionability: aws_agirlikli_ekiplerde_izle_ve_poc_yap
- impact_level: orta
- opportunities: Agent runtime altyapısını sıfırdan yazmadan üretimleştirmek.
- risks: Vendor lock-in, Spring AI core ile managed runtime varsayımlarının karışması, operasyonel sorumluluğun bulut sağlayıcıya aşırı devri.
- migration_notes: Şimdilik POC/karşılaştırma seviyesi uygun; core iş akışını provider-agnostic tutmak uzun vadede daha güvenli.

### Bulgu 8

- title: JVM veri araçlarında düşük öncelikli ama ilginç bir sinyal: Hardwood Beta1
- source: [Hardwood Reaches Beta: S3, Predicate Push-Down, CLI, and More](https://www.morling.dev/blog/hardwood-reaches-beta-s3-predicate-push-down-cli/)
- author: Gunnar Morling
- date: 2 Nisan 2026
- category: tooling, data-engineering
- tags: parquet, s3, predicate-pushdown, cli, java, performance
- summary: Yeni Parquet parser’ı `Hardwood`, S3 backend, predicate pushdown, Avro binding ve CLI ile beta seviyesine ulaştı.
- why_it_matters: Java ile veri yoğun backend/ingestion işleri yapan ekipler için bağımlılık hafifliği ve performans odağı ilginç.
- java_spring_relevance: Tipik Spring CRUD servisinden çok veri erişim/ingestion hattı yazan JVM ekipleri için anlamlı.
- actionability: dusuk_oncelikli_takip
- impact_level: düşük
- opportunities: S3 üstünden Parquet inceleme ve hafif araç zinciri kurma.
- risks: Beta olgunluğu, sınırlı adoption ve henüz kanıtlanmamış production ergonomisi.
- migration_notes: Mevcut Parquet stack’ini değiştirmek için erken; ama veri platformu ekipleri radarına alabilir.

## Sonuç

Bugünün en güçlü mesajı, Spring ekosisteminde “özellik ekleme” ile “güvenli üretim davranışı”nın artık ayrılmadığı. `Spring AI` ve `Spring gRPC` bunu çok net gösteriyor: yeni kabiliyetler gelirken saldırı yüzeyi, provider sınırları ve migration maliyeti de birlikte geliyor.

Java/Spring ekipleri için pratik öncelik sırası şu olmalı: `Spring AI 1.0.6/1.1.5` ve `Spring gRPC 1.0.3` patch seviyelerini değerlendirmek, `Spring Boot 3.5.14/4.0.6` rollout planını tamamlamak, JDK tarafında `final field` ve hibrit TLS testlerini CI/backlog’a almak ve `Spring Data AOT` gibi build-time optimizasyonları seçili servislerde bilinçli şekilde pilotlamak.
