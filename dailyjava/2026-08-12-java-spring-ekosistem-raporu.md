# Günlük Java / Spring Ekosistem Raporu

Tarih: 12 Ağustos 2026 Çarşamba  
Tarama zamanı: 12 Ağustos 2026 09:06 TSİ  
Odak: Java/Spring inner-loop'unun `tek IDE` yaklaşımından `editor-agnostik, LSP ve agent` akışlarına kayması; bu kaymanın güvenlik, tanılama ve mimari sınırlar üzerindeki etkileri

Tarama notu: 12 Ağustos 2026 09:06 TSİ itibarıyla [Spring Blog](https://spring.io/blog), [Spring release sayfaları](https://spring.io/blog/category/releases/), [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security), [Spring Tools 5.3.0 release duyurusu](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/), [This Week in Spring - August 11th, 2026](https://spring.io/blog/2026/08/11/this-week-in-spring-august-11-2026/), [Inside Java](https://inside.java/), [Oracle Java Platform Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Oracle.oracle-java), [IntelliJ IDEA Goes LSP](https://blog.jetbrains.com/idea/2026/08/intellij-idea-goes-lsp/), [Java Annotated Monthly - August 2026](https://blog.jetbrains.com/idea/2026/08/java-annotated-monthly-august-2026/), [Baeldung Java Weekly 658](https://www.baeldung.com/java-weekly-658), [The Economic Benefit of Refactoring](https://martinfowler.com/articles/exploring-gen-ai/refactoring-economic-benefit.html), [Gunnar Morling blogu](https://www.morling.dev/blog/), [Burak KUTBAY blogu](https://blog.burakkutbay.com/blog/) ve [jdk.java.net](https://jdk.java.net/) kontrol edildi. 12 Ağustos 2026 itibarıyla yeni bir Spring Boot/Framework GA ya da yeni bir Spring Security advisory görünmüyor. Bugünün daha güçlü ve tekrarsız sinyali, Java/Spring geliştirmenin `VS Code/Cursor/terminal-agent` eksenine taşınırken bunun beraberinde getirdiği güvenlik, lisanslama, workspace trust ve tanılama disiplinleri.

Gunnar Morling'in son yazıları ağırlıkla Parquet/Hardwood performansına odaklanıyor; Burak KUTBAY tarafında ise son dönemde `Feature Flag` ve `ArchUnit` içerikleri dikkat çekiyor. Bunlar değerli, ancak bugünün ana kararı `yeni framework özelliği` değil `geliştirici platformu standardı` tarafında şekilleniyor.

## Öne Çıkan Başlıklar

- [Spring Tools 5.3.0](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/) artık yalnızca bir IDE eklentisi güncellemesi değil; `VS Code`, `Cursor`, `Eclipse`, `Theia` ve `Claude Code` kullanan Spring ekipleri için güvenlik baseline'ı. Sürüm altı CVE kapatıyor.
- [JetBrains'in 4 Ağustos 2026 tarihli LSP hamlesi](https://blog.jetbrains.com/idea/2026/08/intellij-idea-goes-lsp/) Java/Kotlin dil zekasını `VS Code`, `Cursor` ve terminal ajan akışlarına taşıyor. Bu, Java inner-loop'unun IDE kabuğundan ayrıştığını gösteriyor.
- [Oracle Java Platform Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Oracle.oracle-java) tarafında `edit-compile-debug-test`, `Maven/Gradle`, `JShell`, `Java notebook`, `JDK downloader`, `preview feature` ve `EA JDK` akışları resmi destek seviyesine çıkmış durumda.
- [Inside Java'nın 11 Ağustos 2026 tarihli JFR oturumu](https://inside.java/2026/08/11/efficient-java-apps-profiling-troubleshooting/) editörden bağımsız, düşük overhead'li tanılamanın hâlâ en güvenilir Java gerçeği olduğunu hatırlatıyor.
- [Martin Fowler/Thoughtworks deneyi](https://martinfowler.com/articles/exploring-gen-ai/refactoring-economic-benefit.html), tek bir 17.155 satırlık dosyayı ayrıştırmanın aynı görev için giriş token maliyetini `159.564`'ten `27.360`'a düşürdüğünü gösteriyor. Agent çağında modülerlik artık sadece estetik değil, ekonomik bir karar.

## Kritik Güncellemeler

### 1. Spring Tools 5.3.0, agent destekli Spring geliştirme için güvenlik ve stabilite eşiği oldu

[Spring Tools 5.3.0 release notu](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/) bu sürümün `VS Code`, `Cursor`, `Eclipse`, `Theia` ve `Claude Code` için yayınlandığını söylüyor. Aynı duyuru şu altı güvenlik problemini kapattığını açıkça belirtiyor:

- `CVE-2026-47858`
- `CVE-2026-47873`
- `CVE-2026-47882`
- `CVE-2026-59326`
- `CVE-2026-59327`
- `CVE-2026-59328`

Ek olarak sürüm, `Boot MCP startup crash`, `Eclipse AOT` hataları ve `JMX` bağlantı problemleri gibi stabilite alanlarını da temizliyor.

Pratik anlamı şu:

- `JDWP`, `JMX`, proxy credential ve devtools secret yüzeyleri artık sadece üretim uygulamasının değil geliştirme aracının da güvenlik parçası
- Spring ekibi, agent tabanlı çalışma biçimini yan yüzey olarak değil, resmi araç hedefi olarak görüyor

### 2. JetBrains, Java/Kotlin dil servislerini doğrudan VS Code ve Cursor'a taşıdı

[JetBrains'in 4 Ağustos 2026 tarihli duyurusu](https://blog.jetbrains.com/idea/2026/08/intellij-idea-goes-lsp/) Java ve Kotlin zekasının `LSP` formatında `VS Code` ve `Cursor` için preview olarak sunulduğunu belirtiyor. JetBrains ayrıca bunun `Claude Code` ve `Codex` benzeri terminal tabanlı agent akışlarında da denendiğini, token tüketimini düşürmeye yardımcı olabileceğine dair iç testler yaptığını söylüyor.

Ama burada önemli iki pratik not var:

- test sırasında `Red Hat` ve `Oracle` Java eklentileriyle çakışmaması için bu uzantıların kapatılması öneriliyor
- preview sonrası kullanım `IntelliJ IDEA Ultimate` lisansı gerektirecek

Bu yüzden bu gelişme "harika, herkes Cursor'a geçsin" haberi değil; daha çok `editor standardı, extension matrisi ve lisans politikası` yazma gereği doğuruyor.

### 3. Oracle'ın VS Code eklentisi, Java inner-loop'unu ciddi biçimde taşıyabilir hale geldi

[Oracle Java Platform Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Oracle.oracle-java) artık şu kabiliyetleri aynı yüzeyde topluyor:

- tam `edit-compile-debug-test` döngüsü
- `Maven` ve `Gradle` proje desteği
- `Java notebook` ve `JShell`
- `JDK downloader`
- `preview feature` etkinleştirme
- `early access JDK` kullanma adımları
- workspace trust ve ek trust kararı

Bu önemli çünkü Java/Spring geliştirme artık "hafif editor = hafif destek" varsayımıyla ilerlemiyor. Oracle tarafı bile `VS Code`'u ikincil oyuncu gibi davranmıyor.

### 4. JFR, parçalanan toolchain dünyasında ortak tanılama zemini olarak öne çıkıyor

[Inside Java'daki 11 Ağustos 2026 tarihli JFR oturumu](https://inside.java/2026/08/11/efficient-java-apps-profiling-troubleshooting/) JDK Flight Recorder'ı `lightweight, always-on observability` aracı olarak konumluyor ve performans, bellek, thread sorunları ile üretim tanılamasında düşük overhead'li yol olduğunu vurguluyor.

Buradan yaptığım çıkarım şu: editor çeşitliliği arttıkça ekiplerin ortak gerçeği IDE logları değil `JFR`, thread dump, heap analizi ve build çıktısı olmalı.

## Trendler ve Sinyaller

### Trend Kümesi 1: Java dil zekası IDE'den ayrışıp servis katmanına dönüşüyor

Tek bir kaynaktan değil, birden fazla güçlü yüzeyden aynı sinyal geliyor:

- Spring Tools `Cursor` ve `Claude Code` adını doğrudan kullanıyor
- JetBrains, IntelliJ zekasını `LSP` olarak dışarı açıyor
- Oracle, `VS Code` için tam Java platform eklentisini büyütüyor
- [Baeldung Weekly 658](https://www.baeldung.com/java-weekly-658) ve [Java Annotated Monthly - August 2026](https://blog.jetbrains.com/idea/2026/08/java-annotated-monthly-august-2026/) bunu ekosistem çapında öne çıkarıyor

Bu kısa vadeli gürültü değil. Kalıcı değer tarafı, "hangi IDE kullanılıyor?" sorusunun yerini "hangi language intelligence, hangi extension kombinasyonu, hangi policy ile kullanılıyor?" sorusunun alması.

### Trend Kümesi 2: Geliştirici aracı da artık açık bir güvenlik yüzeyi

Spring Tools CVE'leri ve Oracle extension'ın workspace trust akışı bir şeyi net söylüyor: `devtools secret`, `JDWP`, `JMX`, proxy credential, workspace settings ve extension çakışmaları artık platform ekibinin radarında olmalı.

Yani "sadece local geliştirme" bahanesiyle kontrolsüz port, secret ya da auto-config yüzeyleri bırakmak artık teknik borç değil, doğrudan güvenlik ve uyumluluk konusu.

### Trend Kümesi 3: Agent verimi, kod tabanı şekline bağlı

[Martin Fowler/Thoughtworks makalesi](https://martinfowler.com/articles/exploring-gen-ai/refactoring-economic-benefit.html), 17.155 satırlık bir veri erişim dosyasını ayrıştırdıkça aynı görev için giriş token maliyetinin `159.564`'ten `27.360`'a düştüğünü, yani `%83` azaldığını gösteriyor. [Burak KUTBAY'ın son ArchUnit yazısı](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/) ise mimari kuralların test altyapısının parçası yapılmasını savunuyor.

Bu iki kaynağın ortak mesajı:

- küçük, net, sınırları korunmuş modüller sadece insan okunabilirliğini değil agent etkinliğini de artırıyor
- mimari kurallar dokümanda değil testte yaşarsa editor ve agent çeşitliliği altında bile yapı bozulması daha erken yakalanıyor

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: editor/extension standardı yazmak
- Kalıcı değer: JFR tabanlı ortak tanılama akışı kurmak
- Kalıcı değer: büyük Spring modüllerini ve starter'ları daha küçük bağlamlara bölmek
- Kalıcı değer: ArchUnit benzeri kurallarla mimari sınırları test etmek
- Düşük öncelik: [This Week in Spring](https://spring.io/blog/2026/08/11/this-week-in-spring-august-11-2026/) içinde geçen `Spring AI AgentCore 2.1.0` ve benzeri agent haberleri, eğer ekip aktif olarak AI ajan inşa etmiyorsa bugün için izlemede kalmalı

## Araçlar ve Kütüphaneler

- [Spring Tools 5.3.0](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/): Spring odaklı editor deneyimini güvenlik ve stabilite açısından güncelleyen ana paket.
- [Java & Kotlin by IntelliJ IDEA](https://blog.jetbrains.com/idea/2026/08/intellij-idea-goes-lsp/): `VS Code`/`Cursor` için preview dil zekası; güçlü ama extension çakışması ve lisans maliyeti var.
- [Oracle Java Platform Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Oracle.oracle-java): Oracle'ın resmen desteklediği edit-compile-debug-test yüzeyi.
- [JDK Flight Recorder](https://inside.java/2026/08/11/efficient-java-apps-profiling-troubleshooting/): editor bağımsız, düşük overhead'li tanılama standardı.
- [ArchUnit](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html): agent çağında bile mimari sınırları korumak için düşük maliyetli ama yüksek getirili test katmanı.

Bugün "hemen alın" seviyesinde yeni bir Spring runtime kütüphanesi görünmüyor. Değer, bu kez kütüphaneden çok geliştirici platformunun nasıl standartlaştırıldığı tarafında.

## Java / Spring Geliştiricileri İçin Etkiler

- Ekip bazında değil organizasyon bazında `desteklenen editor + extension` matrisi tanımlayın.
- `VS Code/Cursor` kullanıyorsanız Spring Tools, Oracle ve JetBrains uzantılarının birlikte mi ayrı mı kullanılacağını açık politika haline getirin.
- `JDWP`, `JMX`, devtools secret ve local proxy credential akışlarını "sadece local" diyerek görmezden gelmeyin; bunları güvenlik checklist'ine alın.
- Agent kullanan ekiplerde çok büyük `starter`, `config`, `repository` ve `service` dosyalarını sistematik biçimde küçültün; bu sadece bakım kolaylığı değil bağlam maliyeti kazancı da getiriyor.
- Tanılama standardını editor'a değil JVM'e bağlayın: `JFR`, thread dump, heap dump, build log ve test raporu ortak doğruluk kaynağı olsun.
- Mimari sınırları sadece wiki'de değil testte yaşatın; `ArchUnit` bunun için uygun ve hafif bir başlangıç noktası.

## Fırsatlar ve Riskler

- Fırsat: Daha hafif editor'lerde de ciddi Java/Spring üretkenliği elde etmek
- Fırsat: Agent kullanan ekiplerde daha küçük bağlamla daha hızlı ve daha ucuz değişiklik üretmek
- Fırsat: JFR ve tanılama standartlarıyla editor bağımsız ortak işletim modeli kurmak
- Risk: JetBrains, Oracle ve Spring Tools uzantılarını çakışmalı şekilde kurup teşhis edilmesi zor semptomlar üretmek
- Risk: Toolchain güvenliğini yok sayıp `JDWP`, `JMX`, secret ve workspace trust konularında açık bırakmak
- Risk: Çok büyük modüller ve belirsiz paket sınırları yüzünden agent verimini ve insan inceleme kalitesini aynı anda düşürmek
- Risk: Preview lisans ve destek modelini netleştirmeden organizasyon çapında editor değişimine gitmek

## İzlenmesi Gereken Konular

- [Spring Tools 5.4.0](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/) için verilen `Eylül ortası 2026` hedefinde güvenlik/stabilite çizgisinin devam edip etmeyeceği
- JetBrains LSP preview ürününün `1.0` öncesinde extension çakışması, lisans ve terminal-agent entegrasyonunda hangi noktaya geleceği
- Oracle Java Platform Extension'ın `JDK 27 EA` ve workspace trust akışlarını daha da olgunlaştırıp olgunlaştırmayacağı
- Spring ekibinin resmi dokümantasyonda `Cursor`, `Claude Code`, `Codex` benzeri akışlara daha doğrudan rehber verip vermeyeceği
- Düşük öncelik: Spring AI AgentCore hattının demo seviyesinden kurumsal operasyon rehberine geçip geçmeyeceği

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring Tools 5.3.0, Spring ekipleri için toolchain güvenlik baseline'ı haline geliyor
- `source`: [Spring Tools 5.3.0 released](https://spring.io/blog/2026/06/30/spring-tools-5-3-0-released/)
- `author`: Martin Lippert
- `date`: 30 Haziran 2026
- `category`: developer-tooling, security, spring-toolchain
- `tags`: spring-tools, vscode, cursor, claude-code, cve, jdwp, jmx, devtools
- `summary`: Spring Tools 5.3.0; `VS Code`, `Cursor`, `Eclipse`, `Theia` ve `Claude Code` için yayınlandı, altı CVE düzeltti ve Boot MCP/JMX/AOT stabilite sorunlarını temizledi.
- `why_it_matters`: Tooling artık yalnız üretkenlik konusu değil; local geliştirme aracı da güvenlik yüzeyi.
- `java_spring_relevance`: Spring Boot ve Spring Framework ekiplerinin günlük inner-loop güvenliği ve stabilitesi doğrudan etkileniyor.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: daha güvenli editor standardı; daha az local crash ve false positive; agent destekli akışlara daha temiz giriş
- `risks`: eski Spring Tools sürümlerinde JDWP/JMX/secret yüzeylerinin açık kalması
- `migration_notes`: `VS Code/Cursor/Eclipse` kullanan ekiplerde minimum kabul edilen sürümü `5.3.0` ve üstü olarak sabitleyin.

### Bulgu 2

- `title`: JetBrains, Java/Kotlin dil zekasını LSP ile VS Code, Cursor ve terminal-agent akışlarına taşıyor
- `source`: [IntelliJ IDEA Goes LSP](https://blog.jetbrains.com/idea/2026/08/intellij-idea-goes-lsp/) | [Java Annotated Monthly - August 2026](https://blog.jetbrains.com/idea/2026/08/java-annotated-monthly-august-2026/) | [Baeldung Java Weekly 658](https://www.baeldung.com/java-weekly-658)
- `author`: Marco Behler | Irina Mariasova | Baeldung
- `date`: 4 Ağustos 2026 | Ağustos 2026 | 8 Ağustos 2026
- `category`: developer-productivity, ide-platform, agentic-workflows
- `tags`: lsp, intellij, vscode, cursor, codex, claude-code, token-consumption
- `summary`: JetBrains, IntelliJ dil teknolojisini `VS Code` ve `Cursor` için preview uzantı olarak açtı; terminal tabanlı agent akışları için de deneyler yaptığını duyurdu.
- `why_it_matters`: Java dil zekası IDE kabuğundan ayrışıyor; artık hangi editör değil hangi dil servisi kullanıldığı belirleyici hale geliyor.
- `java_spring_relevance`: Spring servisleri üzerinde çalışan ekipler, refactor/navigation/analysis kalitesini IDE bağımsız kullanabilecek ama support ve lisans kararlarını merkezi almak zorunda kalacak.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: hafif editor'lerde güçlü analiz; büyük monorepo ve agent akışlarında ortak dil zekası
- `risks`: Oracle/Red Hat uzantılarıyla çakışma; preview sonrası lisans sürprizi; vendor lock-in
- `migration_notes`: pilot ekipte deneyin; çakışan Java uzantılarını kapatmadan geniş rollout yapmayın.

### Bulgu 3

- `title`: Oracle'ın VS Code Java eklentisi, resmi tam geliştirme yüzeyi seviyesine geliyor
- `source`: [Oracle Java Platform Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Oracle.oracle-java) | [Inside Java](https://inside.java/)
- `author`: Oracle Java team | Arvind Aprameya
- `date`: 5 Ağustos 2026 itibarıyla görünür 26.0.1 hattı
- `category`: developer-tooling, official-java-tooling
- `tags`: oracle-java, vscode, maven, gradle, jshell, notebooks, early-access-jdk, workspace-trust
- `summary`: Oracle eklentisi; `Maven/Gradle`, test, debug, JShell, Java notebook, JDK indirici, preview feature ve EA JDK akışlarını aynı üründe topluyor.
- `why_it_matters`: Oracle'ın resmi pozisyonu, VS Code tabanlı Java geliştirmeyi yan yol olmaktan çıkarıyor.
- `java_spring_relevance`: Spring servisleri için build/test/debug sürecinin klasik IDE dışında da resmi destekle yönetilebilmesini sağlıyor.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: onboarding hızlanması; JDK kurulumunun sadeleşmesi; scout lane için EA JDK denemeleri
- `risks`: workspace trust ihlalleri; büyük workspace performans sorunları; heterojen extension davranışı
- `migration_notes`: desteklenen workspace boyutu, JDK politikası ve trust kararlarını belgeleyin; `home directory` benzeri geniş workspace'leri açmayın.

### Bulgu 4

- `title`: JDK Flight Recorder, parçalı editor dünyasında ortak doğruluk kaynağı olarak öne çıkıyor
- `source`: [The Power of JDK Flight Recorder](https://inside.java/2026/08/11/efficient-java-apps-profiling-troubleshooting/)
- `author`: Mikael Vidstedt
- `date`: 11 Ağustos 2026
- `category`: observability, serviceability, jvm-diagnostics
- `tags`: jfr, profiling, troubleshooting, low-overhead, production-diagnostics
- `summary`: Oracle, JFR'ı düşük overhead'li ve sürekli kullanılabilir JVM telemetry aracı olarak yeniden öne çıkarıyor.
- `why_it_matters`: Editor çeşitliliği arttıkça ekiplerin tanılama standardını IDE eklentilerine değil JVM'in kendi telemetry yüzeyine yaslaması daha güvenli.
- `java_spring_relevance`: Spring Boot servislerinde thread, memory, startup ve latency sorunlarının ortak biçimde incelenmesini kolaylaştırır.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: editor bağımsız troubleshooting; daha tutarlı performans incelemesi; prod-safe observability
- `risks`: local IDE davranışına aşırı güvenip JFR/JVM telemetry toplamayı ihmal etmek
- `migration_notes`: standart JFR capture profilleri oluşturun; incident runbook'larına JFR adımı ekleyin.

### Bulgu 5

- `title`: Refactoring artık agent kullanan ekipler için doğrudan token ve bağlam maliyeti optimizasyonu
- `source`: [The Economic Benefit of Refactoring](https://martinfowler.com/articles/exploring-gen-ai/refactoring-economic-benefit.html)
- `author`: Giles Edwards-Alexander
- `date`: 30 Temmuz 2026
- `category`: architecture, refactoring, agentic-productivity
- `tags`: refactoring, token-cost, context-size, modularity, large-files
- `summary`: 17.155 satırlık tek veri erişim dosyasını kademeli refactor etmek, aynı görev için giriş token maliyetini `159.564`'ten `27.360`'a düşürdü; bu yaklaşık `%83` azalma demek.
- `why_it_matters`: Agent kullanan geliştirme akışında dosya boyutu ve modül sınırları doğrudan maliyet ve doğruluk etkisi üretmeye başlıyor.
- `java_spring_relevance`: büyük `configuration`, `repository`, `service`, `mapper` ve `starter` sınıfları olan Spring kod tabanlarında somut fayda beklenir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: daha ucuz ve hızlı agent yardımı; daha okunabilir modüller; daha az bağlam kirliliği
- `risks`: büyük dosyaları korumaya devam edip agent sonuç kalitesini ve inceleme hızını düşürmek
- `migration_notes`: en büyük Spring sınıflarını ve paketlerini envanterleyin; önceliği çok kullanılan ama sınırları belirsiz modüllere verin.

### Bulgu 6

- `title`: ArchUnit benzeri mimari kurallar, agent çağında yaşayan dokümantasyona dönüşüyor
- `source`: [ArchUnit ile Proje Mimarisini Test Edin](https://blog.burakkutbay.com/archunit-ile-proje-mimarisini-test-edin.html/)
- `author`: Burak KUTBAY
- `date`: 11 Temmuz 2026
- `category`: architecture-governance, testing, code-quality
- `tags`: archunit, architecture-tests, living-documentation, package-boundaries, spring
- `summary`: ArchUnit; paket bağımlılıkları, katman erişim kuralları, döngüsel bağımlılıklar ve anotasyon kullanım kurallarını test seviyesinde doğrulamanın pratik yolunu sunuyor.
- `why_it_matters`: Çoklu editor ve agent akışlarında yapısal kaliteyi yalnız review ile korumak zorlaşır; executable architecture daha dayanıklıdır.
- `java_spring_relevance`: tipik Spring katmanlı mimarilerde `controller -> service -> repository` sınırlarını ve modül kurallarını otomatik doğrulamak için uygundur.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: erken ihlal tespiti; daha güvenli refactor; agent üretimini daha kontrollü tutma
- `risks`: mimari sınırların sadece wiki'de kalması; modül erozyonunun geç fark edilmesi
- `migration_notes`: önce 3-5 kritik kural ile başlayın; tüm mimariyi tek seferde kodlamaya çalışmayın.

## Sonuç

12 Ağustos 2026 için en güçlü Java / Spring sinyali yeni bir runtime özelliği değil, geliştirici platformunun yeniden şekillenmesidir. Spring, JetBrains ve Oracle aynı anda Java/Spring inner-loop'unu `VS Code`, `Cursor` ve terminal-agent akışlarına taşıyor. Fakat bunun kalıcı mühendislik değeri, "AI destekli editor geldi" heyecanında değil; `Spring Tools 5.3.0` gibi güvenlik baseline'larında, `JFR` gibi editor bağımsız tanılamada, modülleri küçülten refactoring disiplininde ve `ArchUnit` benzeri çalıştırılabilir mimari kurallarda yatıyor.

Bugün verilmesi gereken teknik karar, hangi editor'ün daha havalı olduğu değil; hangi dil servisi, hangi extension kombinasyonu, hangi tanılama standardı ve hangi mimari guardrail ile Java/Spring geliştireceğinizdir.
