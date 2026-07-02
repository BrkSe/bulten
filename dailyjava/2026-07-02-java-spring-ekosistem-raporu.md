# Günlük Java / Spring Ekosistem Raporu

Tarih: 2 Temmuz 2026  
Tarama zamanı: 2 Temmuz 2026 09:07 TSİ  
Odak: release yüzeyi sakinleşirken contract-first Spring AI akışları, Boot `4.1` ile batch state modernizasyonu, stateful agent operasyonları ve JVM tarafında diagnostik politika denemeleri

Tarama notu: Resmi [Spring Blog](https://spring.io/blog), [Spring Security advisories feed](https://spring.io/security.atom), [Spring proje sayfaları](https://spring.io/projects), ilgili Spring GitHub release yüzeyleri, [OpenJDK JDK 27 EA sayfası](https://jdk.java.net/27/), [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/news/), [Josh Long'un haftalık özeti](https://spring.io/blog/2026/06/30/this-week-in-spring-june-30-2026), [bugünkü Josh Long / Sébastien Deleuze podcast duyurusu](https://spring.io/blog/2026/07/02/a-bootiful-podcast-sebastien-deleuze), [Gunnar Morling feed'i](https://www.morling.dev/index.xml), [Burak KUTBAY blog feed'i](https://blog.burakkutbay.com/feed/), [Foojay](https://foojay.io/) ve [Asymm Systems](https://asymm.systems/) tarandı. 2 Temmuz 2026 itibarıyla Spring security feed'inde yeni advisory görünmüyor. [Baeldung Java Weekly](https://www.baeldung.com/java-weekly) doğrudan erişimde Cloudflare `403` verdiği için bugünkü raporda erişilebilen primary kaynaklar ve açık secondary kaynaklar kullanıldı. Gunnar Morling tarafında en yeni yüksek sinyal hâlâ `Hardwood 1.0`; Burak KUTBAY tarafında da bugünkü karar yüzeyini değiştiren yeni Java/Spring yazısı görünmüyor.

## Öne Çıkan Başlıklar

- Bugünün en güçlü Spring sinyali yeni bir patch değil, AI kontrat güvenilirliği: [Spring AI `2.0` structured output yazısı](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output) `validateSchema()` ve `useProviderStructuredOutput()` ile LLM cevabını doğrudan tipli, retry-aware bir uygulama kontratına çeviriyor.
- [Spring Boot `4.1` + Spring Batch MongoDB starter](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch), batch metadata için zorunlu JDBC yan taşıma borcunu kırıyor; Mongo kullanan ekipler artık sadece `JobRepository` için ayrı SQL taşıma zorunluluğunu sorgulayabilir.
- AI ajan tarafında daha kalıcı sinyal, "yeni runtime" değil "mevcut Spring operasyon modelini ajan yürütmeye bağlamak": [AgentFlow4J yaklaşımı](https://foojay.io/today/spring-ai-agents-no-second-runtime/) ve [MongoDB tabanlı checkpoint örneği](https://foojay.io/today/building-an-ai-powered-operations-assistant-with-spring-ai-and-mongodb-atlas-part-3-stateful-workflows-and-human-in-the-loop/) governance, checkpoint ve approval katmanını JVM içinde tutuyor.
- JVM tarafında resmi feature yüzeyi bugün sakin: [JDK `27` EA build `28`](https://jdk.java.net/27/) yalnız incremental bir build. Daha ilginç yeni deney, [Eliya](https://asymm.systems/) tarafında tek flag ile üretim diagnostik politikasını paketleyen distribution yaklaşımı.

## Kritik Güncellemeler

### 1. Spring AI `2.0`, "best-effort JSON parse" döneminden "uygulama kontratı" dönemine geçiyor

[Christian Tzolov'un Spring AI yazısı](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output), mevcut `.entity(...)` akışının üstüne iki kritik katman ekliyor:

- `validateSchema()`: cevabı şemaya göre doğruluyor, hata varsa modele validasyon hatasını geri verip yeniden deniyor.
- `useProviderStructuredOutput()`: şemayı prompt içine gömmek yerine model sağlayıcısının API seviyesine taşıyor.

Bu, özellikle tool-calling sonrası veri kalıcılığı, workflow routing veya yan etki üreten işlemlerde önemli. Typed output artık yalnız geliştirici ergonomisi değil, incident önleyici bir güvenilirlik katmanı. [Josh Long'un 30 Haziran özeti](https://spring.io/blog/2026/06/30/this-week-in-spring-june-30-2026) bu yazıyı haftanın öne çıkan üretim içeriği olarak özellikle işaret ediyor.

Pratik sınırlar da net:

- `.entity(...)` yalnız `.call()` akışında çalışıyor, streaming tarafında yok.
- OpenAI native structured outputs top-level array kabul etmiyor; wrapper record gerekebiliyor.
- Bazı sağlayıcılarda native schema desteği kısmi; bu yüzden `useProviderStructuredOutput()` ile `validateSchema()` birlikte düşünülmeli.

### 2. Spring Boot `4.1`, batch state yönetimini SQL zorunluluğundan ayırıyor

[Josh Long'un Boot `4.1` / Spring Batch yazısı](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch), `spring-boot-starter-batch-data-mongodb` ile `JobRepository` metadata'sını MongoDB'de tutan ilk sınıf auto-configuration deneyimini gösteriyor. Asıl mesaj özellik demosu değil; mimari varsayım değişimi:

- Spring Batch state'i artık "varsayılan olarak JDBC" değil, "durable repository abstraction" olarak konuşuluyor.
- Mongo kullanan ekipler sadece batch metadata için ayrı Postgres/MySQL taşıma zorunluluğunu sorgulayabiliyor.
- Operasyonel caveat açık: transaction için replica set gerekiyor.

Bu, batch işi yapan ama uygulama verisini document-store veya polyglot persistence ile yöneten ekipler için gerçek bir altyapı sadeleştirme fırsatı. Öte yandan yalnız starter geldi diye doğrudan göç edilmemeli; replay, restartability, cleanup ve transaction davranışı regression testi ister.

### 3. Stateful agent yürütme, Spring ekosisteminde "demo"dan "operasyon modeli"ne kayıyor

Bugünün resmi Spring release yüzeyi sakin olsa da açık Java topluluğunda daha güçlü sinyal bu tarafta. İki kaynak birlikte okununca anlamlı:

- [Why Spring Teams Don't Need a Second Runtime for AI Agents](https://foojay.io/today/spring-ai-agents-no-second-runtime/)
- [Building an AI-Powered Operations Assistant with Spring AI and MongoDB Atlas — Part 3](https://foojay.io/today/building-an-ai-powered-operations-assistant-with-spring-ai-and-mongodb-atlas-part-3-stateful-workflows-and-human-in-the-loop/)

Ortak desenler:

- checkpoint state'i veritabanında tutmak
- approval gate ve tool allowlist'i explicit tanımlamak
- token/cost bütçesini retry politikasıyla birlikte düşünmek
- sunucu restart olsa bile task state'ini yeniden hydrate etmek
- operasyonel gözlemlenebilirliği mevcut Spring stack ile tutmak

Buradaki kalıcı değer belirli bir kütüphane değil; agent orkestrasyonunun yeni bir platform değil, mevcut Spring governance modelinin uzantısı olarak ele alınması. Kütüphane tarafı hâlâ erken; desen tarafı ise güçlü.

### 4. Diagnostik politika, JVM distribution seviyesinde yeniden paketleniyor

[Asymm Systems ana sayfası](https://asymm.systems/) ve [Foojay'deki Eliya yazısı](https://foojay.io/today/where-production-policy-belongs-building-eliya-in-public/) birlikte okunduğunda yeni sinyal şu: bazı ekipler artık "hangi JVM flag'leri açalım?" sorusunu dağıtık dokümantasyonla değil, distribution-level policy ile çözmeye çalışıyor.

`-XX:EliyaProfile=Production` bugün için şunları tek profile altında topluyor:

- OOM'de heap dump
- OOM sonrası exit
- `Native Memory Tracking` summary modu
- predictable `hs_err` crash log path
- diagnostik VM options açılması

Bu yaklaşım özellikle regüle veya incident-heavy ortamlarda ilginç. Ama bugünden üretim önerisi değil; yeni bir JDK distribution, yeni supply-chain ve support değerlendirmesi demek.

## Trendler ve Sinyaller

### Trend Kümesi 1: Contract-first yaklaşım, HTTP payload'dan LLM payload'a genişliyor

Tekrarlayan sinyal:

- [Spring AI structured output](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output)
- [Inside Java immutable-data konuşması](https://inside.java/2026/06/21/better-tools-immutable-data/)
- [Josh Long / Sébastien Deleuze podcast duyurusu](https://spring.io/blog/2026/07/02/a-bootiful-podcast-sebastien-deleuze)

Çıkarım:

- Kısa vadeli hype, "ajan" kelimesinin kendisinde.
- Kalıcı mühendislik değeri, tipli veri şekli, immutable model ve enforce edilen kontrat katmanında.

### Trend Kümesi 2: State ve kanıt, proses içinde değil durable yüzeylerde tutuluyor

Tekrarlayan sinyal:

- [MongoDB-backed Batch JobRepository](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch)
- [MongoDB tabanlı workflow checkpointing](https://foojay.io/today/building-an-ai-powered-operations-assistant-with-spring-ai-and-mongodb-atlas-part-3-stateful-workflows-and-human-in-the-loop/)
- [Eliya diagnostik path ve policy yaklaşımı](https://foojay.io/today/where-production-policy-belongs-building-eliya-in-public/)

Çıkarım:

- Batch state, agent state ve crash evidence aynı yöne işaret ediyor: durable state'i dışsallaştırmak.
- Bu, özellikle restart, horizontal scale ve audit beklentisi olan Spring ekipleri için doğrudan operasyonel değer taşıyor.

### Trend Kümesi 3: Release yüzeyi sakinleşince gerçek karar sinyali mimari desenlerde çıkıyor

Tekrarlayan sinyal:

- [Spring security feed](https://spring.io/security.atom) bugün yeni advisory üretmiyor
- [Oracle currentJavaReleases](https://java.oraclecloud.com/currentJavaReleases) hâlâ aynı destekli tabanı gösteriyor
- [JDK `27` EA build `28`](https://jdk.java.net/27/) yalnız issue-fix ağırlıklı

Çıkarım:

- Bugün "hemen patch koşusu" değil, orta vadeli üretim deseni seçimi günü.
- Bu tür günlerde düşük sinyalli sürüm kalabalığına değil, geliştirici davranışını değiştirecek operational pattern'lere odaklanmak daha değerli.

## Araçlar ve Kütüphaneler

- [Spring AI `2.0` structured output araçları](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output): `StructuredOutputValidationAdvisor`, `validateSchema()`, `useProviderStructuredOutput()` ile AI akışlarında kontrat disiplini kurulabiliyor.
- [spring-boot-starter-batch-data-mongodb](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch): Mongo kullanan batch ekipleri için izlenmesi gereken yeni starter.
- [AgentFlow4J](https://foojay.io/today/spring-ai-agents-no-second-runtime/): resmi Spring projesi değil; bu yüzden doğrudan standartlaştırma yerine PoC ve desen inceleme aracı olarak değerlendirilmeli.
- [Eliya JDK](https://asymm.systems/): üretim diagnostik policy packaging için izlenmeye değer ama düşük öncelikli bir runtime deneyi.
- Bugün yeni ve yüksek öncelikli observability/test kütüphanesi sinyali zayıf. Güçlü sinyal daha çok runtime policy, state management ve AI kontrat katmanında.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI kullanıyorsanız, state-changing veya veri persist eden akışlarda `.content()` yerine typed `.entity(...)` + `validateSchema()` kombinasyonunu temel yaklaşım yapmanız daha doğru.
- OpenAI native structured output kullanan ekipler top-level array kısıtını ve provider-specific schema limitlerini tasarım aşamasında hesaba katmalı.
- Spring Batch işlerini Mongo ağırlıklı bir platform üzerinde çalıştırıyorsanız, yalnız metadata için ayrı SQL taşımanın hâlâ gerekli olup olmadığını yeniden değerlendirebilirsiniz.
- Agent mimarisi kuruyorsanız, approval, budget, tool policy, checkpoint ve audit trail'i "sonradan eklenen guardrail" değil, ilk sınıf runtime davranışı olarak düşünmelisiniz.
- JDK tarafında bugün yeni feature baskısı yok; destekli hatlarda kalıp JDK `27` denemelerini ayrı bir PoC/benchmark şeridinde tutmak daha doğru.

## Fırsatlar ve Riskler

- Fırsat: Spring AI structured output katmanı, LLM cevabını doğrudan domain kontratına yaklaştırdığı için özellikle orchestration ve automation servislerinde hata maliyetini düşürebilir.
- Risk: Provider-native structured output her sağlayıcıda aynı davranmadığı için "tek switch ile her şey garanti" varsayımı yanlış.
- Fırsat: Batch metadata'nın Mongo'ya taşınabilmesi, platform sadeleştirmesi ve operasyonel maliyet düşüşü sağlayabilir.
- Risk: Mongo tarafında transaction/replica set gerçeği göz ardı edilirse, sadeleşme hedefi yeni operasyonel kırılganlık üretir.
- Fırsat: Stateful agent checkpoint deseni, restart sonrası yeniden başlatma ve insan onayı gerektiren iş akışlarında büyük değer üretir.
- Risk: Erken dönem agent runtime kütüphanelerini resmi Spring standardı gibi görmek, governance kazanımından çok bakım borcu üretebilir.
- Fırsat: Diagnostik politika paketleyen JDK distribution'lar, incident forensics ve audit taleplerini standartlaştırabilir.
- Risk: Yeni JDK distribution seçimi, mevcut JDK standardizasyonunuzu ve supply-chain politikanızı bozabilir.

## İzlenmesi Gereken Konular

- Spring AI tarafında provider-native structured output destek matrisi ve sınırları daha görünür hale gelecek mi?
- Spring Batch Mongo metadata desteği çevresinde migration guide veya gerçek üretim vaka paylaşımı gelecek mi?
- Spring ekosisteminde checkpoint/approval/budget deseni resmi proje veya referans mimari seviyesine taşınacak mı?
- Eliya'nın planladığı continuous JFR ve FIPS doğrulamalı varyant gerçekten ürünleşecek mi?
- JDK `27` sonraki EA build'lerinde incremental fix'lerin ötesinde Java backend ekiplerini etkileyen yeni bir compatibility veya runtime yönü çıkacak mı?

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring AI `2.0`, structured output'u gerçek bir uygulama kontratına dönüştürüyor
- `source`: [Self-Correcting Structured Output in Spring AI 2.0](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output) | [This Week in Spring - June 30th, 2026](https://spring.io/blog/2026/06/30/this-week-in-spring-june-30-2026)
- `author`: Christian Tzolov | Josh Long
- `date`: 23 Haziran 2026 / 30 Haziran 2026
- `category`: ai-platform, api-contract, reliability, developer-productivity
- `tags`: spring-ai-2.0, validateSchema, useProviderStructuredOutput, structured-output, typed-response, top-level-array
- `summary`: Spring AI artık LLM çıktısını yalnız parse etmiyor; schema doğruluyor, gerekirse retry ediyor ve uygun sağlayıcılarda schema'yı API seviyesinde enforce ediyor.
- `why_it_matters`: Model cevabı üzerinden routing, state update veya kalıcılık yapan servislerde serbest metin yerine enforce edilen veri şekli gerekir.
- `java_spring_relevance`: Spring Boot tabanlı AI servisleri, tool-calling akışları, arka plan otomasyonları ve typed domain object kullanan Java ekipleri için doğrudan etkili.
- `actionability`: `planli_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: daha az parse hatası, daha güvenilir orchestration, typed domain model ile daha temiz servis katmanı
- `risks`: provider davranış farkları, top-level array kısıtı, streaming akışında aynı kontratın olmaması
- `migration_notes`: `.content()` ağırlıklı akışlarda `.entity(...)` ve kritik yerlerde `validateSchema()` temel varsayım haline getirilmeli; OpenAI native structured output için array wrapper record düşünülmeli.

### Bulgu 2

- `title`: Spring Boot `4.1`, Spring Batch metadata'yı JDBC zorunluluğundan ayırıyor
- `source`: [MongoDB-backed Spring Batch jobs and more in Spring Boot 4.1](https://spring.io/blog/2026/06/21/spring-boot-41-and-spring-batch/)
- `author`: Josh Long
- `date`: 21 Haziran 2026
- `category`: batch, data-access, operations, platform-modernization
- `tags`: spring-boot-4.1, spring-batch, mongodb, jobrepository, autoconfiguration, transactions
- `summary`: Yeni MongoDB starter ile Spring Batch `JobRepository` metadata'sı ilk sınıf auto-configuration deneyimiyle Mongo'da tutulabiliyor.
- `why_it_matters`: Sırf batch metadata için ayrı relational database taşıma zorunluluğu birçok ekipte gizli operasyon maliyeti yaratıyordu.
- `java_spring_relevance`: ETL, scheduled job, retryable import/export ve chunk-based processing yapan Spring ekipleri için doğrudan mimari etki taşır.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: polyglot persistence ile daha tutarlı platform, daha az altyapı parçası, batch state'in uygulama veri topolojisine daha doğal oturması
- `risks`: Mongo transaction gereksinimi, replica set zorunluluğu, restart/replay davranışında beklenmeyen farklar
- `migration_notes`: Mevcut JDBC tabanlı Batch kurulumlarında kör göç yapılmamalı; restartability, job instance semantics, cleanup ve transaction davranışı birlikte test edilmeli.

### Bulgu 3

- `title`: Governed ve stateful agent yürütme, mevcut Spring operasyon modeline oturuyor
- `source`: [Why Spring Teams Don't Need a Second Runtime for AI Agents](https://foojay.io/today/spring-ai-agents-no-second-runtime/) | [Building an AI-Powered Operations Assistant with Spring AI and MongoDB Atlas — Part 3](https://foojay.io/today/building-an-ai-powered-operations-assistant-with-spring-ai-and-mongodb-atlas-part-3-stateful-workflows-and-human-in-the-loop/)
- `author`: Sekka | Matteo Rossi
- `date`: 10 Haziran 2026 / 29 Haziran 2026
- `category`: ai-platform, workflow, governance, operations
- `tags`: spring-ai, agentflow4j, checkpoint, approval-gate, budget-policy, tool-policy, mongodb, micrometer, actuator
- `summary`: Spring tabanlı ajan akışları için kalıcı sinyal, yeni bir AI runtime kurmak değil; checkpoint, onay, bütçe ve audit davranışını mevcut Spring operasyon yüzeyine bağlamak.
- `why_it_matters`: Production agent sistemleri çoğunlukla model kalitesinden değil, state kaybı, izlenemeyen tool çağrısı ve governance eksikliğinden kırılır.
- `java_spring_relevance`: Internal ops assistant, approval-heavy workflow, arka plan otomasyonu veya multi-step tool flow kuran Java/Spring ekipleri için yüksek değer taşır.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: Micrometer, Spring Security, Actuator ve mevcut datasource ile tek operasyon modeli; restart sonrası resume; daha net approval ve audit akışı
- `risks`: Erken dönem community runtime'ları fazla erken standartlaştırmak; governance desenini ürünle değil yalnız kütüphane seçimiyle karıştırmak
- `migration_notes`: Buradaki dayanıklı karar belirli kütüphane değil; checkpoint store, approval gate, tool allowlist ve cost-aware retry deseninin kendi platformunuza nasıl oturacağıdır.

### Bulgu 4

- `title`: Eliya `25.0.3`, JVM diagnostik politikasını distribution seviyesinde paketliyor
- `source`: [Asymm Systems](https://asymm.systems/) | [Where production policy belongs: building Eliya in public](https://foojay.io/today/where-production-policy-belongs-building-eliya-in-public/) | [InfoQ Eliya haberi](https://www.infoq.com/news/2026/06/eliya-jvm-diagnostic-profile/)
- `author`: Asymm Systems | Fahim Farook | A N M Bazlur Rahman
- `date`: Haziran 2026 / 19 Haziran 2026 / 29 Haziran 2026
- `category`: runtime, observability, platform-engineering, compliance
- `tags`: eliya, openjdk-25, diagnostic-policy, heap-dump, nmt, hs_err, jfr, compliance
- `summary`: Eliya, `-XX:EliyaProfile=Production` ile OOM dump, NMT, crash log path ve diagnostik seçenekleri tek bir üretim profiline topluyor.
- `why_it_matters`: JVM operasyon politikaları birçok ekipte wiki ve startup script dağınıklığıyla yaşıyor; bunu distribution seviyesine çekme denemesi yeni bir platform fikri üretiyor.
- `java_spring_relevance`: Regüle ortamlarda çalışan Spring servisleri, yoğun incident analizi yapan platform ekipleri ve audit gereksinimi olan Java operasyonları için ilgi çekici.
- `actionability`: `izlemelik`
- `impact_level`: `orta`
- `opportunities`: üretim diagnostik standartlarını netleştirmek, incident sonrası kanıt üretimini daha öngörülebilir kılmak
- `risks`: yeni JDK distribution bağımlılığı, support/supply-chain değerlendirmesi, upstream'den sapma riski
- `migration_notes`: Üretim standardı adayı olarak değil, kontrollü PoC olarak ele alınmalı; mevcut JDK standardizasyonu ve container image politikası ile birlikte değerlendirilmelidir.

### Bulgu 5

- `title`: JDK `27` EA build `28`, şimdilik yalnız watchlist seviyesi bir hareket
- `source`: [OpenJDK JDK 27 Early-Access Builds](https://jdk.java.net/27/) | [Oracle currentJavaReleases API](https://java.oraclecloud.com/currentJavaReleases)
- `author`: OpenJDK / Oracle Java update channels
- `date`: 25 Haziran 2026 / 2 Temmuz 2026 itibarıyla kontrol edildi
- `category`: jvm, release-governance, watchlist
- `tags`: jdk27, early-access, build28, oracle-java, java-25.0.3, java-21.0.11, java-17.0.19, java-26.0.1
- `summary`: Resmi yüzeyde JDK `27` build `28` erişilebilir durumda, fakat bugün üretim ekiplerini hemen hareket ettirecek yeni bir feature veya destek tabanı değişimi görünmüyor.
- `why_it_matters`: Erken erişim build'leriyle destekli runtime tabanını karıştırmak kolay; bugünkü net mesaj bu ikisinin ayrı tutulması gerektiği.
- `java_spring_relevance`: Spring Boot servislerinde runtime standardizasyonu yapan ekiplerin deney, benchmark ve prod tabanını bilinçli ayırması gerekiyor.
- `actionability`: `izlemelik`
- `impact_level`: `dusuk-orta`
- `opportunities`: JDK `27` denemelerini kontrollü benchmark hattına almak, GA öncesi compatibility sorularını erken yakalamak
- `risks`: EA build'i prod-ready sanmak, güvenlik ve support beklentisini yanlış kurmak
- `migration_notes`: Üretim baseline olarak destekli `25.0.3` / `21.0.11` / `17.0.19` / `26.0.1` hatları korunmalı; JDK `27` yalnız PoC ve benchmark şeridinde tutulmalı.

## Sonuç

2 Temmuz 2026 radarının ana mesajı yeni bir patch dalgası değil, Java/Spring ekiplerinin veri şekli, state ve operasyon politikasını daha bilinçli tasarlaması gerektiği. Spring AI tarafında typed structured output artık "güzel API" değil, doğrudan güvenilirlik mekanizması. Boot `4.1`, Batch state'ini eski SQL varsayımından çıkararak altyapı kararlarını yeniden açıyor. Agent tarafında kalıcı değer yeni bir framework yarışı değil, checkpoint, approval ve cost governance desenlerinin mevcut Spring operasyon modeline gömülmesi. JVM tarafında ise bugün acil migration alarmı yok; asıl tartışma hangi distribution ve hangi politikayla üretim kanıtı toplayacağınızda.
