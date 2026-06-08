# Günlük Java / Spring Ekosistem Raporu

Tarih: 7 Haziran 2026  
Tarama zamanı: 7 Haziran 2026 14:45 TSİ  
Odak: Spring AI 2.0.0-RC1 sözleşme değişimleri, 8-14 Haziran güvenlik patch penceresi, Spring AI güvenlik fix'lerinin uygulama kontratına etkisi ve JDK 27'nin güvenlik/operasyon kabiliyetleri

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security/), Spring AI GitHub release kayıtları, [OpenJDK JEP sayfaları](https://openjdk.org/jeps/0), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), [Josh Long'un This Week in Spring yazısı](https://spring.io/blog/2026/06/02/this-week-in-spring-june-2-2026/), [Gunnar Morling'in blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY'ın blogu](https://blog.burakkutbay.com/) kontrol edildi. Baeldung, Gunnar Morling ve Burak KUTBAY tarafında ilginç topluluk içerikleri vardı; ancak 7 Haziran 2026 için en yüksek üretim etkisi Spring AI release/advisory yüzeyi ile JDK 27 JEP durumlarında toplandı. 7 Haziran 2026 itibarıyla Spring Boot, Spring Framework, Spring Security ve Spring Cloud tarafında 29 Mayıs sonrasına ait yeni bir GA/patch blog duyurusu görünmüyor; bu da bugünün ana aksiyonunun yeni özellikten çok yaklaşan güvenlik patch dalgasına hazırlık olduğunu gösteriyor.

## Öne Çıkan Başlıklar

- [Spring AI 2.0.0-RC1](https://spring.io/blog/2026/06/06/spring-ai-2-0-0-RC1-available-now/) 6 Haziran 2026'da yayınlandı; `ChatModel` içi tool execution kaldırıldı, bean-adı tabanlı tool çözümleme bitti ve `ChatClient` merkezli explicit orchestration varsayılan hale geldi.
- [Spring and Security In The Times Of AI](https://spring.io/blog/2026/06/01/spring_and_security_in_the_times_of_ai/) yazısı, Mayıs release train'inin güvenlik baskısı nedeniyle 8-14 Haziran 2026 aralığına kaydığını ve portföyün büyük kısmında yeni patch gerekeceğini açıkça söylüyor.
- Spring AI'nin güvenlik fix'leri sadece CVE kapatmıyor; özellikle [CVE-2026-41712](https://spring.io/security/cve-2026-41712/) ile implicit `DEFAULT_CONVERSATION_ID` kaldırıldığı için memory kullanan uygulamalarda upgrade sonrası davranış değişimi geliyor.
- [JEP 536](https://openjdk.org/jeps/536) artık JDK 27 için entegre; JFR kayıtlarında komut satırı argümanları, environment variable'lar ve system property'lerdeki hassas veriler process içinden redakte edilebilecek.
- [JEP 538](https://openjdk.org/jeps/538), 5 Haziran 2026 itibarıyla JDK 27 için üçüncü preview olarak entegre edildi; PEM API yararlı yönde ilerliyor ama final değil.
- [JEP 528](https://openjdk.org/jeps/528) ise 7 Haziran 2026 itibarıyla hâlâ `Candidate`; post-mortem `jcmd` kabiliyetini JDK 27 planına bağlamak için erken.

## Kritik Güncellemeler

### 1. Spring AI 2.0.0-RC1, agent/tool-calling mimarisini sert biçimde yeniden tanımlıyor

[Spring AI 2.0.0-RC1 duyurusu](https://spring.io/blog/2026/06/06/spring-ai-2-0-0-RC1-available-now/) ve [GitHub release notları](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-RC1) birlikte okunduğunda çıkan tablo şu:

- Dahili tool execution loop'ları bütün `ChatModel` implementasyonlarından kaldırıldı.
- Tool execution artık `ChatClient` üstünde `ToolCallingAdvisor` ya da kullanıcı kontrollü `DefaultToolCallingManager` ile yürütülmeli.
- `toolNames()` API ve `SpringBeanToolCallbackResolver` kaldırıldı; bean adıyla geç çözümleme yerine explicit `ToolCallback` bean'leri ve `.tools()` kullanımı geliyor.
- `ToolCallAdvisor`, `ToolCallingAdvisor` olarak yeniden adlandırıldı; geri uyumluluk shim'i var ama esas akış değişmiş durumda.
- `ToolSearchToolCallingAdvisor`, araçların talep üzerine keşfini mümkün kılıyor; vektör store, Lucene ve regex indeksleri destekleniyor.
- Memory advisor'ların precedence'ı değişti; tool-call loop içine gömülmek yerine dış katmana taşınıyor.
- `OpenAiChatModel.stream()` artık tüm cevabı buffer'lamıyor; yalnız tool-call segmentleri buffer'lanıyor.
- Mistral model listesi güncellendi, `Pixtral Large` çıkarıldı, MiniMax özel desteği kaldırıldı.
- Release, [README uyumluluk tablosuna](https://github.com/spring-projects/spring-ai/blob/main/README.md) göre hâlâ `Spring Boot 4.x` hattına ait.

Bu neden kritik:

- `M7/M8` üstünde yazılmış agent kodu, RC1 ile sıradan dependency bump mantığıyla geçemez.
- Tool keşfi, tool kayıt şekli, streaming davranışı ve memory etkileşimi birden fazla katmanda değişiyor.
- RC1 "artık kırıcı değişiklik kalmadı" garantisi vermiyor; ama API sertleşmesinin başladığını gösteriyor. Bu yüzden geç kalmış migration ekipleri için pencere daralıyor.

Net yorum: Spring AI `2.x` kullanan ekiplerde bugünün en güçlü sinyali yeni model desteği değil, orkestrasyon kontratının merkezileşmesi.

### 2. Spring portföyünde asıl gündem yeni feature değil, 8-14 Haziran 2026 güvenlik patch penceresi

[Spring and Security In The Times Of AI](https://spring.io/blog/2026/06/01/spring_and_security_in_the_times_of_ai/) ve [This Week in Spring - June 2nd, 2026](https://spring.io/blog/2026/06/02/this-week-in-spring-june-2-2026/) aynı mesajı tekrar ediyor:

- Mayıs Spring release train'i 8-14 Haziran 2026 aralığına kaydı.
- Portföyün büyük kısmında yeni güvenlik patch'leri gelecek.
- Mart 2026'da 55 yeni güvenlik raporu geldi ve bu raporlar Nisan'da 26 CVE'ye dönüştü.
- Nisan 2026'da 65 taranan proje için 482 yeni güvenlik raporu açıldı; bunun 370'i iç tarama, 112'si topluluk kaynaklıydı.
- Mayıs 2026'da da topluluk kaynaklı rapor sayısı 72 olarak yüksek kalmaya devam etti.

Bu neden kritik:

- Bu, "yakında birkaç CVE blog postu daha gelir" seviyesi değil; sürüm tüketim hızının güvenlik baskısıyla kalıcı biçimde arttığı bir dönem.
- Takımların 8-14 Haziran haftasını normal sprint haftası gibi planlaması riskli.
- Ortak parent BOM, platform starter, golden image ve governance süreçleri zayıf olan ekipler aynı anda birden fazla bağımlılık katmanında borç görecek.

Net yorum: 7 Haziran 2026 itibarıyla en doğru refleks yeni özellik kovalamak değil, patch penceresi için kapasite ve rollout disiplini ayırmak.

### 3. Spring AI güvenlik fix'leri uygulama davranışını değiştiriyor; özellikle memory tarafı sessiz kırılabilir

[CVE-2026-41705](https://spring.io/security/cve-2026-41705/), [CVE-2026-41712](https://spring.io/security/cve-2026-41712/), [CVE-2026-41713](https://spring.io/security/cve-2026-41713/) ve [CVE-2026-41863](https://spring.io/security/cve-2026-41863/) birlikte okunduğunda şu tablo çıkıyor:

- `MilvusVectorStore#doDelete(List)` tarafında expression injection var; fix sürümleri `1.0.7` ve `1.1.6`.
- `PromptChatMemoryAdvisor` tarafında memory poisoning ile prompt injection riski var; fix sürümleri `1.0.7` ve `1.1.6`.
- Chat memory bileşenindeki implicit `DEFAULT_CONVERSATION_ID`, cross-user veri sızıntısına yol açabiliyor; fix sürümleri `1.0.7` ve `1.1.6`.
- Anthropic Skills API desteğinde LLM etkisindeki filename `Path.resolve` içine kontrolsüz girebiliyor; fix sürümü `1.1.7`.

En önemli migration notu doğrudan advisory'de yazıyor:

- `DEFAULT_CONVERSATION_ID` fix'i sonrası, memory advisor kullanan `ChatClient` çağrıları explicit `conversationId` geçmiyorsa exception fırlatacak.

Bu neden kritik:

- Bu, klasik "patch geç ve geç" durumu değil; çok kiracılı agent/chat uygulamalarında memory isolation politikasını kod düzeyinde açık hale getirmeyi zorunlu kılıyor.
- Upgrade'in kendisi yeni hata üretebilir; ama upgrade yapmamak cross-user memory leakage ve prompt poisoning riskini taşıyor.

Net yorum: Spring AI kullanan ekipler için güvenlik fix backlog'u ile uygulama kontratı backlog'u artık aynı iş kalemi.

### 4. JDK 27'de JFR artık support ve compliance için daha gerçekçi hale geliyor

[JEP 536](https://openjdk.org/jeps/536), 3 Haziran 2026 güncellemesiyle JDK 27 için `Integrated` durumda. JEP'in özü:

- JFR kayıtlarına giden komut satırı argümanları, environment variable'lar ve system property'ler process içinden redakte edilebiliyor.
- Varsayılan davranış, birçok hassas veriyi ek konfigürasyon olmadan redakte etmeye odaklanıyor.
- İhtiyaca göre `-XX:FlightRecorderOptions` altında `redact-argument` ve `redact-key` filtreleri verilebiliyor.

Bu neden kritik:

- Bugün birçok ekip JFR kullanımıyla ilgili asıl çekinceyi performans değil, gizli verinin dump içine sızması olarak yaşıyor.
- Bu özellik, JFR'yi support ticket, vendor paylaşımı ve iç adli inceleme akışlarında daha uygulanabilir hale getiriyor.
- Spring Boot servisleri için özellikle container env var, system property ve CLI argüman üstünden secret taşıyan platformlarda doğrudan değerli.

Net yorum: JDK 27'nin günlük Spring backend geliştiricisi için en pratik platform kazanımlarından biri bu olabilir.

### 5. PEM API final değil; JDK 27'ye üçüncü preview olarak giriyor

[Inside Java duyurusu](https://inside.java/2026/06/05/jep538-target-jdk27/) ve [JEP 538](https://openjdk.org/jeps/538) birlikte şu resmi veriyor:

- 5 Haziran 2026 itibarıyla JEP 538, JDK 27 için üçüncü preview olarak entegre edildi.
- `PEM` artık record değil, normal class.
- `DEREncodable` adı `BinaryEncodable` oldu.
- `EncryptedPrivateKeyInfo` tarafında yeni `getKeyPair` varyasyonları geldi.
- `PEMDecoder.withFactory(...)` adı `withFactoriesOf(...)` olarak değişti.
- Runtime kripto işleme hataları için yeni `CryptoException` sınıfı geliyor.

Bu neden kritik:

- Java ekiplerinin yıllardır el yazısı PEM parse/encode glue kodu yazdığı bir alan standardize oluyor.
- Ancak üçüncü preview demek, API'nin hâlâ şekil değiştirdiği anlamına geliyor. Bu yüzden altyapı kütüphanesi seviyesinde erken sabitleme pahalı olabilir.

Net yorum: Fırsat güçlü, ama bu aşamada en doğru kullanım alanı public platform API değil; adapter katmanı ve kontrollü pilot.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring AI, "AI starter" olmaktan çıkıp açık sözleşme ve platform yönetimi problemine dönüştü

Tekrarlayan desen açık:

- RC1'de tool execution akışı merkezileşiyor.
- Tool registration implicit değil explicit oluyor.
- Memory katmanındaki güvenlik fix'leri artık conversation boundary'yi uygulama geliştiricisine açıkça yükümlülük olarak geri veriyor.
- Community içerikleri de çok-agent, MCP, tool discovery gibi başlıklara kayıyor.

Çıkarım: Spring AI kullanan ekiplerde asıl iş model provider seçimi değil; tool surface, tenant isolation, memory policy ve observability zincirini doğru tanımlamak.

### Trend Kümesi 2: Spring sürüm yönetimi artık güvenlik operasyonu

- Spring takımı release train tarihini doğrudan güvenlik raporu hacmine göre kaydırıyor.
- Josh Long'un haftalık özeti, feature heyecanı yerine güvenlik çıkışını öne taşıyor.
- Portföyde yeni release sessizliği var; ama bu sessizlik rahatlık değil, yaklaşan yoğun patch dalgasının habercisi.

Çıkarım: Kurumsal Spring ekipleri "ayda bir dependency refresh" refleksiyle yetinemez. Daha sık ve daha otomasyonlu patch tüketimi normalleşiyor.

### Trend Kümesi 3: JDK 27'nin gerçek değeri sözdiziminden çok güvenlik ve işletilebilirlikte

- JFR redaction entegre edildi.
- PEM API final değil ama standardize olma yönünde ilerliyor.
- `jcmd` post-mortem analizi ise henüz teslim edilmiş özellik değil.

Çıkarım: JDK 27 hazırlığında geliştirici sunumlarında öne çıkanlardan çok, support ve security runbook'larına dokunan değişiklikler daha kalıcı değer taşıyor.

### Hype mı, kalıcı mı?

- Kalıcı mühendislik değeri yüksek: Spring AI RC1 migration işi, explicit `conversationId` zorunluluğu, 8-14 Haziran güvenlik penceresi, JFR redaction.
- İzle ama kontrollü ilerle: PEM API üçüncü preview, `ToolSearchToolCallingAdvisor`, post-mortem `jcmd` hikayesi.
- Düşük öncelik / topluluk gürültüsü: [Baeldung'in Spring AI subagent orchestration yazısı](https://www.baeldung.com/spring-ai-subagent-orchestration) ve [MCP içine HTML UI gömme yazısı](https://www.baeldung.com/spring-ai-embed-mcp-server-html-ui) öğretici ama bugün doğrudan production kararını tek başına değiştirmiyor. [Inside Java'nın JFR + AI oturumu](https://inside.java/2026/06/02/jfr-ai-monitor/) da yön gösterici; fakat henüz runbook ve ölçüme dayalı kurumsal pratik yerine daha çok yönelim sinyali.

## Araçlar ve Kütüphaneler

- [Spring AI 2.0.0-RC1](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-RC1): Bugünün en yüksek öncelikli araç sinyali. Özellikle tool-calling, memory ve tracing hattı için.
- [ToolSearchToolCallingAdvisor](https://spring.io/blog/2026/06/06/spring-ai-2-0-0-RC1-available-now/): Agent yüzeyi büyüyen ekipler için dikkat çekici; ancak önce explicit tool registration ve güvenlik sınırları oturtulmalı.
- [JFR In-Process Data Redaction](https://openjdk.org/jeps/536): Ayrı bir kütüphane değil, doğrudan platform kabiliyeti. Support/observability takımları için yüksek değer.
- [PEM Encodings API](https://openjdk.org/jeps/538): Kripto ve sertifika işleme kodunu sadeleştirme potansiyeli var; ama preview olduğu için izole adaptörle kullanılmalı.
- Bugün bağımsız OSS araç tarafında yüksek etkili yeni bir Java/Spring backend sinyali çıkmadı. Gunnar Morling tarafındaki en güncel içerikler daha çok Hardwood/Parquet ekseninde; tipik Spring Boot mikroservis yol haritası için düşük öncelik.

## Java / Spring Geliştiricileri İçin Etkiler

- `Spring Boot 4.x + Spring AI 2.x` hattındaysanız, `M7/M8` üstünden RC1'e geçiş için ayrı migration branch açın. Özellikle `toolNames`, `SpringBeanToolCallbackResolver`, model içi tool execution ve streaming/tracing davranışlarını yeniden test edin.
- Memory advisor kullanan Spring AI uygulamalarında, güvenlik fix'lerinden önce tüm çağrılarda explicit `conversationId` geçirilip geçirilmediğini tarayın. Bu iş, upgrade sonrası production exception yakalamaya bırakılmamalı.
- 8-14 Haziran 2026 haftası için patch kapasitesi ayırın. Bu pencereyi feature rollout ile karıştırmak sürüm doğrulama kalitesini düşürür.
- JDK 27 pilotu planlıyorsanız, JFR redaction'ı observability ve support ekipleriyle birlikte test edin. Paylaşılabilir JFR kayıtları compliance süreçlerini kolaylaştırabilir.
- Sertifika/anahtar akışında custom PEM kodunuz varsa JEP 538'i izleyin; ama preview API'yi doğrudan ortak kütüphane sözleşmesine sokmayın.
- `jcmd` post-mortem analizi ilginç ama henüz teslim edilmiş bir üretim kabiliyeti değil. Crash analizi için mevcut `jhsdb`, core dump ve `hs_err` pratiklerini terk etmeyin.

## Fırsatlar ve Riskler

- Fırsat: Spring AI tool katmanını explicit hale getirerek agent yüzeyini daha denetlenebilir ve test edilebilir yapmak.
- Fırsat: JFR redaction ile prod dump paylaşımını daha güvenli ve daha sık kullanılabilir hale getirmek.
- Fırsat: PEM API olgunlaşınca sertifika/anahtar işleme kodunda custom glue'yu azaltmak.
- Risk: RC1'i "küçük pre-release bump" sanıp tool-calling kontratındaki kırıkları production'a taşımak.
- Risk: Spring AI security fix'leri sonrası explicit `conversationId` geçmeyen kod yollarında runtime exception üretmek.
- Risk: 8-14 Haziran patch dalgasını kapasite ayırmadan karşılayıp sürüm geçişlerini parça parça ve düzensiz yapmak.
- Risk: Preview PEM API'yi kurumsal ortak kütüphaneye sabitlemek.
- Risk: `jcmd` post-mortem analizi gelir varsayımıyla mevcut crash inceleme runbook'larını gevşetmek.

## İzlenmesi Gereken Konular

- 8-14 Haziran 2026 arasında hangi Spring projelerinin hangi fix sürümlerini yayınlayacağı.
- Spring AI `2.0.0-GA` öncesinde RC1 sonrası ek kontrat değişikliği gelip gelmeyeceği.
- Spring AI için resmi migration rehberinin RC1 -> GA arasında ne kadar netleşeceği.
- JEP 538 preview yüzeyinde yeni isim/kontrat değişikliği olup olmayacağı.
- JEP 528'in `Candidate` durumundan ne zaman çıkarılacağı ve hangi JDK hedefini alacağı.
- Spring Boot, Spring Security ve Spring Cloud tarafında yaklaşan patch'lerin version mapping etkisi.

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring AI 2.0.0-RC1, tool-calling ve memory akışını `ChatClient` merkezine çekiyor
- source: [Spring AI 2.0.0-RC1 Available Now](https://spring.io/blog/2026/06/06/spring-ai-2-0-0-RC1-available-now/), [Spring AI 2.0.0-RC1 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-RC1), [Spring AI README compatibility](https://github.com/spring-projects/spring-ai/blob/main/README.md)
- author: Ilayaperumal Gopinathan ve Spring AI maintainers
- date: 6 Haziran 2026
- category: ai-platform, tool-calling, chat-client, migration
- tags: spring-ai-2-0-rc1, spring-boot-4, toolcallingadvisor, toolcallback, mcp, chatclient
- summary: RC1 ile model içi tool execution kaldırıldı; explicit `ToolCallback` bean'leri, `ChatClient.tools(...)`, `ToolCallingAdvisor`, yeni tool search advisor ve değişen memory precedence varsayılan hale geldi.
- why_it_matters: Bu değişiklikler agent uygulamasının iskeletini etkiliyor; eski helper API'ler ve bean-name çözümleme akışı artık güvenli dayanak değil.
- java_spring_relevance: Spring Boot 4 tabanlı AI/agent servisleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Tool yüzeyini daha test edilebilir, auditable ve provider-agnostic hale getirmek.
- risks: M7/M8 üstündeki implicit akış varsayımlarının RC1'de kırılması; tracing, streaming ve memory davranışında regresyon.
- migration_notes: `toolNames`, `SpringBeanToolCallbackResolver`, `internalToolExecutionEnabled` ve eski `ToolCallAdvisor` akışları gözden geçirilmeli. RC1 geçişinde streaming, tracing, multi-turn memory ve tool recursion testleri zorunlu.

### Bulgu 2

- title: Spring portföyü, AI kaynaklı güvenlik raporu patlaması yüzünden 8-14 Haziran patch penceresine girdi
- source: [Spring and Security In The Times Of AI](https://spring.io/blog/2026/06/01/spring_and_security_in_the_times_of_ai/), [This Week in Spring - June 2nd, 2026](https://spring.io/blog/2026/06/02/this-week-in-spring-june-2-2026/), [Spring Security Advisories](https://spring.io/security/)
- author: Michael Minella, Josh Long
- date: 1-2 Haziran 2026
- category: security, release-management, cve-pressure
- tags: spring-security, june-8-14, release-train, ai-generated-reports, cve, patch-window
- summary: Mayıs release train'i 8-14 Haziran'a kaydı. Mart 2026'da 55 güvenlik raporu 26 CVE'ye dönüştü; Nisan'da 65 projeye yayılan 482 yeni güvenlik raporu geldi; Mayıs'ta da topluluk rapor hacmi yüksek kaldı.
- why_it_matters: Spring takımı yayın takvimini doğrudan güvenlik hacmine göre kaydırıyorsa, kullanıcı ekiplerin de patch operasyonunu normal bakım işi gibi görmemesi gerekir.
- java_spring_relevance: Spring tabanlı kurumsal sistemler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Patch otomasyonu, version mapping doğrulaması ve merkezi upgrade governance yatırımlarını hızlandırmak.
- risks: Sürüm geçişlerini sprint sonuna sıkıştırmak, kapasite ayırmamak ve farklı servislerde tutarsız patch seviyeleri bırakmak.
- migration_notes: 8-14 Haziran haftası için test kapasitesi, rollout penceresi ve rollback planı önceden ayrılmalı. Ortak BOM/starter kullanan ekipler merkezi koordinasyonla hareket etmeli.

### Bulgu 3

- title: Spring AI güvenlik fix'leri, memory isolation ve dosya yazma davranışını açık kontrata dönüştürüyor
- source: [CVE-2026-41705](https://spring.io/security/cve-2026-41705/), [CVE-2026-41712](https://spring.io/security/cve-2026-41712/), [CVE-2026-41713](https://spring.io/security/cve-2026-41713/), [CVE-2026-41863](https://spring.io/security/cve-2026-41863/)
- author: Spring Security Advisory Team
- date: 8 Mayıs 2026 ve 23 Mayıs 2026; operasyonel öncelik 7 Haziran 2026 itibarıyla çok yüksek
- category: ai-security, memory-isolation, file-write, vector-store
- tags: spring-ai, chatmemory, conversation-id, prompt-injection, milvus, anthropic-skills
- summary: Spring AI fix'leri arasında memory poisoning, cross-user chat memory leakage, Milvus delete injection ve Anthropic Skills API tarafında path traversal benzeri dosya yazma riski bulunuyor. Özellikle `DEFAULT_CONVERSATION_ID` fix'i sonrası explicit `conversationId` zorunlu.
- why_it_matters: Çok kullanıcılı agent/chat servislerinde en pahalı hata sınıfı sessiz tenant boundary ihlalidir; burada risk yalnız güvenlik değil, aynı zamanda upgrade sonrası davranış değişimidir.
- java_spring_relevance: Spring AI kullanan tüm production servisler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Tenant isolation, memory policy ve tool/file boundary testlerini kalıcı hale getirmek.
- risks: Upgrade sonrası exception üretmek, upgrade yapmamak durumunda ise cross-user leakage ve prompt poisoning riskini taşımak.
- migration_notes: `ChatMemory.CONVERSATION_ID` her memory-backed akışta explicit geçirilmeli. `1.0.x` kullanıcıları en az `1.0.7`, `1.1.x` kullanıcıları en az `1.1.6` ve Anthropic Skills API kullananlar `1.1.7` seviyesine çıkmalı.

### Bulgu 4

- title: JFR in-process redaction, JDK 27'de support süreçlerini daha güvenli hale getiriyor
- source: [JEP 536: JFR In-Process Data Redaction](https://openjdk.org/jeps/536)
- author: Erik Gahlin
- date: JDK 27 için entegrasyon durumu 3 Haziran 2026 itibarıyla görünür
- category: observability, security, compliance
- tags: jdk-27, jfr, redaction, flightrecorderoptions, secrets, support
- summary: JEP 536 ile JFR, komut satırı argümanları ve ilk environment/system property değerlerindeki hassas bilgileri process içinden redakte edebiliyor; ek filtreler `-XX:FlightRecorderOptions` ile verilebiliyor.
- why_it_matters: Prod JFR kayıtlarının paylaşımı bugüne kadar çoğu ekipte güvenlik çekincesiyle sınırlanıyordu; bu özellik doğrudan support ve adli inceleme süreçlerini iyileştirir.
- java_spring_relevance: Spring Boot mikroservisleri, platform ekipleri ve SRE süreçleri için yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Daha fazla JFR kullanımını güvenli hale getirmek, incident response sırasında daha zengin veri toplamak.
- risks: Varsayılan redaction'a aşırı güvenip özel secret key kalıplarını filtrelememek.
- migration_notes: JDK 27 pilotlarında JFR profil setleri ve `jfr print` doğrulamaları yapılmalı; özel secret naming convention'ları varsa ek `redact-key` filtreleri tanımlanmalı.

### Bulgu 5

- title: JEP 538, PEM API'yi finalize etmek yerine üçüncü preview'a taşıdı
- source: [Inside Java: JEP targeted to JDK 27: 538](https://inside.java/2026/06/05/jep538-target-jdk27/), [JEP 538](https://openjdk.org/jeps/538), [InfoQ Java News Roundup - June 1, 2026](https://www.infoq.com/news/2026/06/java-news-roundup-may25-2026/)
- author: Anthony Scarpino; ikincil özet Michael Redlich
- date: 5 Haziran 2026
- category: crypto-api, preview, migration
- tags: jdk-27, pem, binaryencodable, cryptoexception, certificates, preview
- summary: PEM API üçüncü preview olarak JDK 27'ye entegre edildi. `PEM` class'a dönüştü, `DEREncodable` -> `BinaryEncodable` oldu, `withFactory` adı değişti ve yeni kripto yardımcıları geldi.
- why_it_matters: Kripto nesneleri ve PEM metni arasındaki dönüşüm sonunda standart JDK yüzeyine yaklaşsa da API'nin hâlâ oynuyor olması ortak kütüphane tasarımı için dikkat gerektiriyor.
- java_spring_relevance: TLS, sertifika, PKI, secrets ve custom credential yükleme akışları olan Java backend ekipleri için orta-yüksek.
- actionability: izle_ve_test_et
- impact_level: orta-yüksek
- opportunities: OpenSSL tarzı glue kodunu zamanla azaltmak, standardize edilmiş PEM akışına yaklaşmak.
- risks: Preview API'yi erken sabitleyip sonraki preview/final değişikliklerinde migration yükü almak.
- migration_notes: Public API yerine iç adaptör katmanında deneyin. Public platform modüllerinde JDK preview bağımlılığıyla dikkatli olun.

### Bulgu 6

- title: Post-mortem `jcmd` hikayesi hâlâ watchlist'te; resmi JEP sayfası 7 Haziran 2026'da da `Candidate`
- source: [JEP 528: Post-Mortem Crash Analysis with jcmd](https://openjdk.org/jeps/528), [InfoQ Java News Roundup - June 1, 2026](https://www.infoq.com/news/2026/06/java-news-roundup-may25-2026/)
- author: Kevin Walls; ikincil özet Michael Redlich
- date: 1-7 Haziran 2026
- category: serviceability, incident-response, roadmap
- tags: jcmd, jhsdb, core-dump, serviceability, candidate, roadmap
- summary: `jcmd` ile post-mortem core dump inceleme fikri güçlü; ancak 7 Haziran 2026 itibarıyla resmi JEP sayfasında durum hâlâ `Candidate`. Yani bu özellik henüz güvenle plan yapılacak teslim edilmiş yüzey değil.
- why_it_matters: JVM crash runbook'larını gelecekte gelecek bir araca erken bağlamak operasyon riski yaratır.
- java_spring_relevance: JNI, native client, agent, profiler veya düşük seviye crash yüzeyi olan Java platform ekipleri için orta.
- actionability: izle
- impact_level: orta
- opportunities: Şimdiden core dump + `libjvm` saklama disiplinini kurup gelecekte `jcmd` için hazır olmak.
- risks: Mevcut `jhsdb`/Serviceability Agent akışlarını zayıflatmak veya belgelemeyi bırakmak.
- migration_notes: Crash analizi süreçleri bugün için mevcut araçlarla devam etmeli. Olası `jcmd` teslimatı ayrı bir iyileştirme olarak ele alınmalı.

## Sonuç

7 Haziran 2026 için en güçlü Java/Spring sinyali, yeni framework özelliği değil; AI entegrasyonlarının artık açık kontrat, güvenlik izolasyonu ve patch operasyonu problemi haline gelmiş olması. Spring AI `2.0.0-RC1`, agent mimarisini sertleştiriyor; aynı anda Spring takımı, AI destekli güvenlik raporu hacmi yüzünden tüm portföy için sıkıştırılmış bir patch haftasına hazırlanıyor.

JVM tarafında da benzer bir olgunlaşma var: JDK 27 hikayesi bugün daha çok JFR redaction gibi operasyonel güvenlik kazanımları ve PEM API gibi kontrollü standardizasyon adımları üzerinden değer üretiyor. Kısa vadede en doğru aksiyon; Spring AI memory/tool sınırlarını explicit hale getirmek, 8-14 Haziran güvenlik penceresine kapasite ayırmak ve JDK 27 pilotlarında support/compliance kazanımlarını ölçmek.
