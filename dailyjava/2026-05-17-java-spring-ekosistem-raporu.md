# Günlük Java / Spring Ekosistem Raporu

Tarih: 17 Mayıs 2026  
Tarama zamanı: 17 Mayıs 2026 09:07 TSİ  
Odak: Spring Cloud güvenlik yamalarının operasyonel karşılığı, Spring AI bellek modelindeki güvenlik-kaynaklı kırılımlar, Boot 4 yükseltme hattında otomasyon ve destek penceresi baskısı

Tarama notu: Bu rapor hazırlanırken önce [Official Spring Blog](https://spring.io/blog/), [Spring project pages](https://spring.io/projects/), ilgili Spring release duyuruları ve güvenlik advisory sayfaları, [Spring Cloud Config proje sayfası](https://spring.io/projects/spring-cloud-config), [Spring Cloud Function proje sayfası](https://spring.io/projects/spring-cloud-function), [Spring AI proje sayfası](https://spring.io/projects/spring-ai), [OpenJDK JEP indeksi](https://openjdk.org/jeps/0), [Inside Java](https://inside.java/), [Oracle Java Blog](https://blogs.oracle.com/java/the-arrival-of-java-26), [InfoQ Java/Spring içeriği](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Josh Long’un 12 Mayıs 2026 haftalık notu](https://spring.io/blog/2026/05/12/this-week-in-spring-may-12-2026), [Dan Vega’nın 11 Mayıs 2026 tarihli Spring Office Hours bölümü](https://spring.io/blog/2026/05/11/spring-office-hours-podcast-S5E15), [Gunnar Morling’in blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY RSS akışı](https://blog.burakkutbay.com/feed/) kontrol edildi. Gunnar Morling tarafında bugün yeni üretim-kritik Java/Spring içeriği görünmedi; Burak KUTBAY tarafında son doğrudan Spring/JVM içerikleri hâlâ 2025 sonu ve 2025 ortası ekseninde kalıyor. Baeldung ve Oracle tarafı tarandı; bugün üretim kararını hemen değiştirecek yeni bir Java platform alarmı yerine, mevcut migration ve güvenlik başlıklarının derinleştiği görüldü.

## Öne Çıkan Başlıklar

- [Spring Cloud Config 5.0.3](https://spring.io/projects/spring-cloud-config) ve [Spring Cloud Function 5.0.2](https://spring.io/projects/spring-cloud-function) yalnız rutin patch değil; Config Server ve Function routing katmanında doğrudan OOM, secret exposure, directory traversal ve log leak sınıfı riskleri kapatıyor.
- [Spring AI 1.0.7, 1.1.6 ve 2.0.0-M6](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now) ile “implicit conversation state” dönemi fiilen kapanıyor. `conversationId` artık opsiyonel ergonomi değil, güvenlik sınırı.
- [Spring ekibinin InfoQ paneli](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) ve [Spring Office Hours](https://spring.io/blog/2026/05/11/spring-office-hours-podcast-S5E15) birlikte okununca ana mesaj net: Boot 4 yükseltmesi manuel refactor işi olarak değil, recipe-driven ve güvenlik odaklı operasyon olarak yönetilmeli.
- [Mayıs OSS release train kaymasının](https://spring.io/blog/2026/05/11/may-train-shift) 11-22 Mayıs 2026 yerine 1-5 Haziran 2026 aralığına alınması, özellikle Boot 4.1 çevresinde bekleyen ekiplerin pilot ve freeze takvimini yeniden ayarlamasını gerektiriyor.

## Kritik Güncellemeler

### 1. Spring Cloud Config ve Spring Cloud Function güvenlik sürümleri gerçek prod riski kapatıyor

[8 Mayıs 2026 tarihli Spring duyurusu](https://spring.io/blog/2026/05/08/spring-cloud-april-releases) ile yayımlanan sürümler:

- Spring Cloud Config: `5.0.3`, `4.3.3`
- Spring Cloud Function: `5.0.2`, `4.3.3`

Config tarafında dört ayrı güvenlik problemi aynı dalgada kapatıldı:

- [CVE-2026-40982](https://spring.io/security/cve-2026-40982): `spring-cloud-config-server` için kritik directory traversal
- [CVE-2026-40981](https://spring.io/security/cve-2026-40981): Google Secrets Manager backend kullanılırken yanlış projelerden secret okunabilmesi
- [CVE-2026-41002](https://spring.io/security/cve-2026-41002): `spring.cloud.config.server.git.basedir` üzerinde TOCTOU saldırı yüzeyi
- [CVE-2026-41004](https://spring.io/security/cve-2026-41004): trace logging açıkken hassas bilginin düz metin loglara düşmesi

Function tarafında iki advisory daha çok availability ve abuse yönünde kritik:

- [CVE-2026-40989](https://spring.io/security/cve-2026-40989): self-routing guard bypass ile infinite recursion ve OOM
- [CVE-2026-40990](https://spring.io/security/cve-2026-40990): function definition cache büyümesi üzerinden OOM

Buradaki önemli nokta, risklerin “yalnız kütüphane içi bug” olmaması. Bunlar doğrudan config plane, secret erişimi, routing ve memory pressure alanına dokunuyor. Config Server kullanan Spring Cloud ekipleri için bu, platform katmanını patch backlog’unda aşağıda tutamayacakları anlamına geliyor.

### 2. Spring AI memory modeli güvenlik gerekçesiyle bilinçli biçimde kırılıyor

[Spring AI release duyurusu](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now) ve advisory’ler birlikte okunduğunda iki net karar görülüyor:

- [CVE-2026-41712](https://spring.io/security/cve-2026-41712): varsayılan `DEFAULT_CONVERSATION_ID` cross-user veri sızıntısına yol açabiliyor
- [CVE-2026-41713](https://spring.io/security/cve-2026-41713): `PromptChatMemoryAdvisor` memory poisoning / prompt injection yüzeyi oluşturabiliyor

Bunun sonucu sürüm notlarına doğrudan yansımış durumda:

- `conversationId` artık açıkça verilmek zorunda
- `PromptChatMemoryAdvisor` önce deprecated edildi, `2.0.0-M6` hattında kaldırıldı
- OpenAI property sınıfları ve option nesneleri builder-pattern / immutable modele çekildi
- SAP HANA DB ve Infinispan vector store modülleri `2.0.0-M6` içinde kaldırıldı

Bu yalnız Spring AI kullanan ekipleri ilgilendirmiyor. Spring ekosisteminin AI tarafında “konforlu default” yerine “explicit state boundary” çizgisine geçtiğini gösteriyor. Session sınırı, memory scope ve tool options artık güvenlik sözleşmesinin parçası.

### 3. Boot 4 yükseltmesi için ana sinyal: otomasyon kullanmayan ekip gereksiz maliyet ödeyecek

[InfoQ’daki Spring 7 / Boot 4 paneli](https://www.infoq.com/articles/spring-team-spring-7-boot-4/) ile [Spring Office Hours S5E15](https://spring.io/blog/2026/05/11/spring-office-hours-podcast-S5E15) aynı eksene işaret ediyor:

- Spring Boot 4 auto-configuration modülerleşmesi startup ve jar boyutuna yardımcı oluyor
- Spring Framework 7 retry ve concurrency throttling’i çekirdeğe alıyor
- Boot 4 geçişinde Jackson 2 compatibility module, property migration tooling ve [OpenRewrite tarifleri](https://docs.openrewrite.org/) temel araç haline geliyor
- Spring Tools 5 için AI-ready yön açık biçimde tarif ediliyor
- Boot `3.5` açık kaynak bakım penceresi Haziran 2026’da bitiyor

Bu çok önemli çünkü kurumsal portföylerde risk artık yalnız “kod derleniyor mu?” değil:

- support window baskısı
- dependency güvenliği
- renamed property ve Jackson 3 etkileri
- manuel upgrade işçilik maliyeti

Kısacası, çok servisli organizasyonlarda Boot 4’e geçiş için “tek tek takım düzeltir” modeli zayıf kalıyor. Merkezi recipe, envanter ve migration lane kurmayan ekipler daha fazla zaman ve daha fazla regresyon riski taşıyacak.

### 4. Mayıs release train kayması roadmap takvimini etkiliyor

[11 Mayıs 2026 tarihli Spring duyurusu](https://spring.io/blog/2026/05/11/may-train-shift) Mayıs OSS takviminin `11-22 Mayıs 2026` aralığından `1-5 Haziran 2026` aralığına taşındığını duyurdu. Bu duyuru yalnız tarih bilgisi değil:

- Boot `4.1` bekleyen ekipler için pilot penceresi öteleniyor
- release-candidate test hattı daha uzun yaşayacak
- “GA gelince yükseltiriz” yaklaşımında sprint planı kayıyor
- patch release bekleyen platform ekipleri için maintenance window yeniden hesaplanmalı

Eğer ekip içinde “Haziran başında Boot 4.1 / yeni minor train ile karar veririz” varsayımı varsa, bu artık somut takvim girdisi.

## Trendler ve Sinyaller

### 1. Spring tarafında güvenlik artık framework ergonomisini doğrudan şekillendiriyor

Bugünün ortak deseni şu:

- Config Server için saldırı yüzeyi küçülüyor
- Function routing için resource exhaustion sınırları sertleşiyor
- Spring AI memory modeli explicit hale getiriliyor

Bu, “security fix” ile “API davranışı” arasındaki çizginin inceldiğini gösteriyor. Güvenlik artık yalnız patch seviyesi konu değil; default davranışları yeniden tasarlıyor.

### 2. Upgrade yönetimi operasyonel bir ürün yeteneğine dönüşüyor

Josh Long’un haftalık notu, Dan Vega’nın OSS security odaklı bölümü ve InfoQ paneli birlikte şunu doğruluyor:

- upgrade işini sırf bakım faaliyeti gibi yönetmek yetersiz
- recipe-driven otomasyon, dependency remediation ve AI-assisted guidance ekosistemin doğal yönü haline geliyor
- migration rehberi tek başına yetmez; kurumsal tekrar üretilebilir süreç gerekir

### 3. 2026 ilk yarısında gürültüden çok migration cost öne çıkıyor

Bugün yeni bir dev JVM özelliği veya yeni bir “oyun değiştiren” observability aracı çıkmadı. Yüksek sinyal, şu sorularda toplandı:

- hangi default davranışlar artık güvenli değil
- hangi sürüm geçişleri manuel yapılırsa pahalıya patlar
- hangi platform bileşenleri patch gecikmesini kaldırmaz

Bu, deneyimli Java/Spring ekipleri için sağlıklı bir sinyal. Şu an değer, yeni framework peşinde koşmaktan çok mevcut yükseltme hattını disipline etmekte.

## Araçlar ve Kütüphaneler

- [Spring Cloud Config 5.0.3](https://spring.io/projects/spring-cloud-config): Yüksek öncelik. Config plane kullanıyorsanız patch sürümü olarak değerlendirilmemeli; güvenlik düzeltmesi olarak ele alınmalı.
- [Spring Cloud Function 5.0.2](https://spring.io/projects/spring-cloud-function): Orta-yüksek öncelik. Özellikle function composition veya dinamik routing kullanan serverless/adapter tabanlı servisler için önemli.
- [Spring AI 1.0.7 / 1.1.6 / 2.0.0-M6](https://spring.io/projects/spring-ai): Kullanıyorsanız yüksek öncelik. Kullanmıyorsanız izleme düzeyinde. `2.0.0-M6` pre-release olduğu için prod standardı değil.
- [OpenRewrite recipes](https://docs.openrewrite.org/) ve gelecekteki Spring Tools 5 AI-ready yönü: Orta öncelik. Bugün kurulup yarın her şeyi çözmez; ama Boot 4 portföy geçişinde merkezi leverage noktası.
- Bugün yeni ve güçlü bir Kubernetes, observability, Kafka client veya testing aracı sinyali öne çıkmadı. Bu kategorilerde zayıf başlık üretmektense mevcut migration backlog’una odaklanmak daha doğru.

## Java / Spring Geliştiricileri İçin Etkiler

- Config Server kullanıyorsanız, yalnız sürümü yükseltmek değil kullanım şeklini de gözden geçirin. Özellikle Google Secrets Manager backend’i, `git.basedir` kullanımı ve trace log politikası tekrar denetlenmeli.
- Spring AI kullanıyorsanız her memory-enabled çağrı için açık `conversationId` zorunluluğunu uygulama seviyesinde tasarlayın. Bu, controller veya service seviyesinde tek satırlık düzeltme değil; tenant/session modelinin bir parçası.
- Boot 4 planı olan ekipler, migration’ı sadece kod uyarlaması olarak değil envanter + recipe + CI lane problemi olarak ele almalı.
- Haziran 2026 başındaki Spring release train’i bekleyen ekipler staging/pilot takvimini bugünden kaydırmalı; aksi halde gereksiz sprint sıkışması oluşur.

## Fırsatlar ve Riskler

- Fırsat: Config ve Function yamaları sayesinde platform katmanında görünmez ama pahalı güvenlik borçları temizlenebilir.
- Fırsat: Spring AI’nin explicit memory modeli, çok kullanıcılı agent/chat akışlarında daha doğru isolation tasarımına zorlayarak uzun vadeli kaliteyi artırabilir.
- Fırsat: OpenRewrite ve property migrator odaklı yükseltme hattı, çok servisli Spring Boot portföylerinde gerçek maliyet azaltımı sağlar.
- Risk: Spring AI upgrade’inde `conversationId` zorunluluğunu sonradan fark etmek runtime exception ve davranış değişikliği doğurur.
- Risk: Config Server tarafında “biz trace açmıyoruz” veya “biz GCP secret backend kullanmıyoruz” varsayımıyla genel patch’i ertelemek, diğer CVE sınıflarını da geciktirmiş olur.
- Risk: Release train kaymasını yalnız tarih kayması sanmak, GA bekleyen takım planlarında yanlış güven duygusu üretir.

## İzlenmesi Gereken Konular

- 1-5 Haziran 2026 aralığında gelecek Spring OSS release train artefact’larının gerçekten hangi minor ve patch kombinasyonlarını içerdiği
- Spring AI `2.0.0-M6` içindeki property/options refactor’larının GA hattına hangi son şekille taşınacağı
- Spring Tools 5 tarafında Spring’e özel AI context / migration yardımı ne kadar somutlaşacağı
- Boot `3.5` açık kaynak bakımının Haziran 2026 sonunda bitmesine karşı kurumların nasıl bir upgrade veya paid support stratejisi seçeceği
- Burak KUTBAY ve Gunnar Morling tarafında bu hafta release train, upgrade automation veya security-hardening eksenine bağlanan yeni içerik gelip gelmeyeceği

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring Cloud Config ve Spring Cloud Function güvenlik sürümleri patch değil platform düzeltmesi
- source: [Spring duyurusu](https://spring.io/blog/2026/05/08/spring-cloud-april-releases), [Spring Cloud Config proje sayfası](https://spring.io/projects/spring-cloud-config), [Spring Cloud Function proje sayfası](https://spring.io/projects/spring-cloud-function), [CVE-2026-40982](https://spring.io/security/cve-2026-40982), [CVE-2026-40981](https://spring.io/security/cve-2026-40981), [CVE-2026-41002](https://spring.io/security/cve-2026-41002), [CVE-2026-41004](https://spring.io/security/cve-2026-41004), [CVE-2026-40989](https://spring.io/security/cve-2026-40989), [CVE-2026-40990](https://spring.io/security/cve-2026-40990)
- author: Ryan Baxter; Spring Security Advisory ekibi
- date: 8 Mayıs 2026
- category: security, cloud, configuration
- tags: spring-cloud-config, spring-cloud-function, cve, config-server, secrets-manager, routing, oom
- summary: Spring Cloud Config `5.0.3` ve Spring Cloud Function `5.0.2` birden fazla güvenlik açığını kapatıyor; bunlar doğrudan secret erişimi, directory traversal, log sızıntısı ve OOM senaryolarına dokunuyor.
- why_it_matters: Güvenlik etkisi uygulama kenarında değil platform katmanında. Etkilenen servis sayısı az olsa bile blast radius büyük olabilir.
- java_spring_relevance: Spring Cloud Config Server, Spring Cloud Function veya serverless adapter kullanan ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: Config plane ve function routing katmanında gecikmiş güvenlik borçlarını toplu temizlemek.
- risks: Patch’i küçük bakım sürümü sanıp ertelemek; GCP Secrets Manager ve trace logging gibi kenar kullanımları görünmez kabul etmek.
- migration_notes: `token-mandatory` benzeri geçici azaltımlar olsa da kalıcı çözüm fix sürümüne çıkmak. Config Server çalışma dizini, log seviyesi ve secret backend konfigürasyonu yeniden denetlenmeli.

### Bulgu 2

- title: Spring AI bellek güvenliği artık explicit conversation sınırı gerektiriyor
- source: [Spring AI 1.0.7, 1.1.6, 2.0.0-M6 duyurusu](https://spring.io/blog/2026/05/08/spring-ai-1-0-7-1-1-6-2-0-0-M6-available-now), [Spring AI proje sayfası](https://spring.io/projects/spring-ai), [CVE-2026-41712](https://spring.io/security/cve-2026-41712), [CVE-2026-41713](https://spring.io/security/cve-2026-41713), [Spring AI 2.0.0-M6 release notes](https://github.com/spring-projects/spring-ai/releases/tag/v2.0.0-M6)
- author: Ilayaperumal Gopinathan; Spring Security Advisory ekibi
- date: 8 Mayıs 2026
- category: ai, security, api-contract
- tags: spring-ai, conversation-id, chat-memory, prompt-injection, memory-poisoning, breaking-change
- summary: Spring AI, implicit default conversation state modelinden geri çekiliyor; `conversationId` explicit hale geliyor ve `PromptChatMemoryAdvisor` kaldırma yoluna giriyor.
- why_it_matters: Çok kullanıcılı agent/chat uygulamalarında en pahalı hatalar çoğu zaman model kalitesinden değil state isolation kırılmasından çıkar.
- java_spring_relevance: Spring Boot üzerinde chat, assistant, agent veya retrieval akışları kuran ekipler için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Session/tenant sınırını daha net modelleyerek AI özelliklerini daha güvenli hale getirmek.
- risks: Upgrade sonrası runtime exception, cross-user state sızıntısı veya PromptChatMemoryAdvisor bağımlılıklarının kırılması.
- migration_notes: Tüm memory advisor kullanım noktalarında açık `conversationId` geçirilmesi zorunlu. `PromptChatMemoryAdvisor` yerine yeni advisor API’leri ve immutable options/builder yaklaşımı benimsenmeli. `2.0.0-M6` pre-release olduğu için prod standardı yapılmamalı.

### Bulgu 3

- title: Boot 4 yükseltmesinde kazanan yaklaşım manuel değil recipe-driven otomasyon olacak
- source: [The Spring Team on Spring Framework 7 and Spring Boot 4 - InfoQ](https://www.infoq.com/articles/spring-team-spring-7-boot-4/), [Spring Office Hours S5E15](https://spring.io/blog/2026/05/11/spring-office-hours-podcast-S5E15), [This Week in Spring - May 12th, 2026](https://spring.io/blog/2026/05/12/this-week-in-spring-may-12-2026), [OpenRewrite docs](https://docs.openrewrite.org/)
- author: Karsten Silz, Phil Webb, Sam Brannen, Rossen Stoyanchev, Mark Pollack, Martin Lippert, Michael Minella; Dan Vega
- date: 11-12 Mayıs 2026 ve 13 Nisan 2026 panel içeriği
- category: migration, developer-productivity, architecture
- tags: spring-boot-4, spring-framework-7, openrewrite, jackson3, property-migrator, retry, concurrency-limit
- summary: Spring ekibi Boot 4 yükseltmesini desteklemek için Jackson 2 compatibility module, property migrator, OpenRewrite tarifleri ve AI-ready tooling yönünü öne çıkarıyor; aynı anda Boot 3.5 açık kaynak destek penceresi Haziran 2026 sonunda kapanıyor.
- why_it_matters: Zor yükseltmelerde teknik zorluk kadar süreç maliyeti de belirleyicidir. Araçsız yükseltme, portföy büyüdükçe doğrusal değil katlanarak pahalılaşır.
- java_spring_relevance: Çok servisli Spring Boot portföyü yöneten tüm ekipler için yüksek.
- actionability: planli_aksiyon
- impact_level: yüksek
- opportunities: Merkezi migration lane, recipe envanteri ve renamed-property kontrolü kurmak; concurrency throttling ve built-in retry gibi yeni çekirdek yetenekleri kontrollü biçimde benimsemek.
- risks: Boot 4 geçişini salt kod refactor işi sanmak; OSS support sonuna kadar bekleyip sıkışık yükseltme yapmak.
- migration_notes: Boot 4 pilotu için Jackson 3 etkisi, property rename taraması, starter uyumu ve otomatik refactor recipe’leri birlikte ele alınmalı. Bu bulgudan “her servis şimdi yükseltilmeli” sonucu çıkmıyor; ama otomasyon hattı şimdi kurulmalı.

### Bulgu 4

- title: Mayıs Spring OSS release train kayması doğrudan takvim girdisi haline geldi
- source: [May Release Train Date Changes](https://spring.io/blog/2026/05/11/may-train-shift), [This Week in Spring - May 12th, 2026](https://spring.io/blog/2026/05/12/this-week-in-spring-may-12-2026)
- author: Michael Minella; Josh Long
- date: 11-12 Mayıs 2026
- category: release-management
- tags: release-train, spring-boot-4.1, schedule, ga-planning
- summary: Mayıs OSS release train 11-22 Mayıs 2026 aralığından 1-5 Haziran 2026 aralığına taşındı; bu, yeni minor ve patch sürümlerin tamamını etkiliyor.
- why_it_matters: Takvim kaymaları özellikle GA bekleyen kurumsal ekiplerde pilot, freeze ve upgrade kararlarını zincirleme etkiler.
- java_spring_relevance: Spring Boot `4.1` veya eşlik eden portföy güncellemelerini bekleyen ekipler için orta-yüksek.
- actionability: izle_ve_takvimi_guncelle
- impact_level: orta
- opportunities: RC test penceresini uzatıp daha güvenli validation yapmak.
- risks: GA tarihini eski sprint planlarında varsayım olarak bırakmak; bağımlı ekipleri yanlış tarihe kilitlemek.
- migration_notes: Release train bekleyen backlog kalemleri ve pilot ortam rezervasyonları Haziran 2026 başına göre revize edilmeli.

## Sonuç

Bugünün en güçlü sinyali yeni bir framework fantezisinden değil, güvenlik ve yükseltme operasyonundan geldi. Spring Cloud tarafında patch gecikmesi kaldırmayan açıklar var; Spring AI tarafında güvenlik gerekçesiyle API sözleşmesi sertleşiyor; Boot 4 tarafında ise manuel geçiş yaklaşımı giderek daha pahalı hale geliyor.

Kısa vadede en doğru hareket, Config/Function kullanan platformlarda patch penceresini açmak, Spring AI kullanan kodlarda explicit `conversationId` envanteri çıkarmak ve Boot 4 için merkezi migration otomasyonu kurmak. Haziran 2026 başındaki release train de bu hazırlıkları üretim takvimine bağlayacak ana dış bağımlılık olarak izlenmeli.
