# Günlük Java / Spring Ekosistem Raporu

Tarih: 16 Agustos 2026 Pazar  
Tarama zamanı: 16 Agustos 2026 09:06 TSI  
Odak: 16 Agustos 2026 itibariyla yeni bir Spring Boot / Framework / Cloud GA dalgasi yok; bugunun guclu sinyali Spring AI 2.0 ve MCP yuzeyinin artik "prompt demosu" degil, versiyonlu tool contract, typed output, stateless transport ve guvenlik yonetisimi gerektiren gercek backend entegrasyonuna donusmesi

Tarama notu: 16 Agustos 2026 09:06 TSI itibariyla [Spring release sayfasi](https://spring.io/blog/category/releases), [Spring Projects](https://spring.io/projects/), [Spring Security Advisories](https://spring.io/security), [Spring AI 2.0.0 GA duyurusu](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now/), [Tool Calling in Spring AI 2.0](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling/), [Self-Correcting Structured Output in Spring AI 2.0](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output/), [Spring AI MCP referansi](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html), [MCP Client Boot Starter docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-client-boot-starter-docs.html), [MCP Server Boot Starter docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html), [Stateless MCP server docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-stateless-server-boot-starter-docs.html), [MCP Security docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-security.html), [Tool Search Tool guide](https://docs.spring.io/spring-ai/reference/guides/dynamic-tool-search.html), [Inside Java - MCP migration](https://inside.java/2026/08/12/java-mcp-migration/), [dev.java news](https://dev.java/news/), [This Week in Spring - 11 Agustos 2026](https://spring.io/blog/2026/08/11/this-week-in-spring-august-11-2026/), [Apache Camel 4.22 MCP blogu](https://camel.apache.org/blog/2026/08/camel-ai-tools-mcp-422/), [InfoQ MCP Java analizi](https://www.infoq.com/articles/mcp-java-architectural-strategy-llm-integrations/), [Baeldung MCP annotations](https://www.baeldung.com/spring-ai-mcp-annotations), [Baeldung MCP OAuth2](https://www.baeldung.com/spring-ai-oath2-mcp-authorization), [Gunnar Morling blogu](https://www.morling.dev/blog/) ve [Burak KUTBAY blogu](https://blog.burakkutbay.com/) tarandi. 16 Agustos 2026 itibariyla Spring release sayfasinda son cekirdek yayinlar hala Haziran 2026 tarihli gorunuyor: Spring Tools 5.3.0 (30 Haziran), Spring Boot 3.5.16 (25 Haziran), Spring AI 2.0.0 GA ve 1.1.8/1.0.9 (12 Haziran), Spring Cloud 2025.1.2 (11 Haziran). Yeni Agustos core GA ya da yeni Agustos security advisory gorunmedigi icin bugunun esas degeri release sayisinda degil, Spring AI + MCP hattinin operasyonel olgunlugunda.

## Öne Çıkan Başlıklar

- Spring tarafinda bugun yeni bir Boot/Framework/Cloud GA yok; buna ragmen Spring AI 2.0 cizgisi, Java backend ekipleri icin dogrudan karar gerektiren yeni bir entegrasyon katmani olusturmus durumda.
- [Spring AI 2.0 GA](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now/) ile tool calling, model-spesifik yardimci kod olmaktan cikarak `advisor chain` icine alinmis kalici framework davranisina donustu.
- [Inside Java'nin 12 Agustos 2026 tarihli MCP migration yazisi](https://inside.java/2026/08/12/java-mcp-migration/) MCP `2026-07-28` spesifikasyonunun protokol cekirdegini stateless HTTP'ye tasidigini, `MCP-Protocol-Version` header'ini zorunlu hale getirdigini ve session-varsayimini kaldirdigini netlestiriyor.
- Spring AI dokumantasyonu artik [stateless MCP server](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-stateless-server-boot-starter-docs.html), [dynamic tool discovery](https://docs.spring.io/spring-ai/reference/guides/dynamic-tool-search.html) ve [self-correcting structured output](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output/) gibi uretim odakli mekanizmalari birinci sinif vatandas yapmis durumda.
- Guvenlik cozumleri var, ancak [MCP Security modulu](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-security.html) hala `work in progress`, topluluk odakli ve WebMVC ile sinirli; bu nedenle kurumsal ekipler Spring Security / Spring Authorization Server pratiklerini elle tasimak zorunda kalabilir.
- Disa acilan sinyal Spring ile sinirli degil: [Apache Camel 4.22](https://camel.apache.org/blog/2026/08/camel-ai-tools-mcp-422/) artik ayni tool tanimini Spring AI, OpenAI ve MCP istemcileri arasinda tekrar kullanilabilir hale getiriyor. Bu, MCP'nin Java ekosisteminde gercek standardizasyon adayi oldugunu gosteriyor.

## Kritik Güncellemeler

### 1. Bugunun buyuk haberi yeni release degil; AI entegrasyonunun backend sozlesmesine donusmesi

[Spring release kategorisi](https://spring.io/blog/category/releases) 16 Agustos 2026 itibariyla yeni bir Agustos cekirdek yayini gostermiyor. Bu sessizlik onemsiz degil: release akisinda yeni sayi olmamasi, ekosistemin bugun daha cok tasarim ve isletim kararlarini onde tuttugu anlamina geliyor.

[Spring Projects](https://spring.io/projects/) sayfasi Spring AI icin `2.0.0+`, Spring Security icin `7.1.0+`, Spring Authorization Server icin `1.5.8+`, Spring gRPC icin `1.1.0+`, Spring Cloud icin `2025.1.2+` cizgisini gosteriyor. Yani AI entegrasyonu artik lab ortami kenar basligi degil; cekirdek Spring platformunun görünür ve resmi parcasi.

### 2. Spring AI 2.0, tool calling'i model kabiliyeti degil uygulama sorumlulugu olarak sabitliyor

[Spring AI tool calling referansi](https://docs.spring.io/spring-ai/reference/api/tools.html), modelin sadece tool cagrisi isteyebildigini; gercek cagiriyi yapan, hatayi isleyen ve sonucu geri donen tarafin uygulama oldugunu acikca soyluyor. [GA duyurusu](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now/) ise `ToolCallingAdvisor`'un `ChatClient` tarafinda otomatik kayitli geldigini ve tum tool loop'unu framework'un yonettigini anlatiyor.

Bu degisiklik pratikte su anlama geliyor: Spring tabanli agent veya MCP istemcisi yazan ekipler artik prompt icinde "hangi tool ne zaman cagrilsin" gibi daginik mantiklar tasimak yerine, tool loop'unu kod ve observability seviyesiyle yonetebilir. Bu kalici degerdir; cunku test, timeout, audit, retry ve metrik toplama dogrudan Java/Spring yuzeyine geri geliyor.

### 3. MCP 2026-07-28 ile session-tabanli remote server varsayimi bitiyor

[Inside Java MCP migration yazisi](https://inside.java/2026/08/12/java-mcp-migration/) yeni spesifikasyonun cekirdegi stateless HTTP'ye tasidigini, `Mcp-Session-Id` ile `initialize/initialized` el sikismasini cikardigini ve her istekte `MCP-Protocol-Version: 2026-07-28` basliginin beklendigini soyluyor. Bu, remote MCP server'larin artik basit bir round-robin load balancer arkasinda calisabilmesi icin bilincli olarak tasarlanmis.

Spring AI bununla hizali bicimde [stateless Streamable-HTTP MCP server docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-stateless-server-boot-starter-docs.html) altinda `spring.ai.mcp.server.protocol=STATELESS` secenegini belgelemis durumda. Ancak bu yolun bir bedeli var: stateless server'lar `elicitation`, `sampling` ve benzeri client'a geri mesaj isteyen akislari desteklemiyor. Yani yatay olceklenebilirlik ile iki yonlu etkileşim kapasitesi arasinda acik bir mimari secim gerekiyor.

### 4. Tool sprawl icin resmi cevap geldi: dinamik tool discovery

[Tool Search Tool guide](https://docs.spring.io/spring-ai/reference/guides/dynamic-tool-search.html), Spring AI'nin yuzlerce tool ile calisirken `%34-%64` token azalmasi saglayabildigini ve sadece ilgili tool tanimlarini modele gonderdigini soyluyor. Bu sadece maliyet optimizasyonu degil; ayni zamanda buyuk tool setlerinde model karisikliligini azaltma girisimi.

Java ekipleri icin degerli nokta su: gercek kurumsal ortamlarda tek MCP server degil, birden fazla sistem, belge, API ve operasyon tool'u baglanacak. Bu noktada tum tool tanimlarini her istekte modele yuklemek, hem maliyet hem hata ayiklama acisindan kotu varsayim. Spring AI'nin bu problemi dokumante edip cekirdege almasi, mimarinin artik demo disina ciktigini gosteriyor.

### 5. Typed output ve schema validation, "iyi olur" degil domain siniri haline geliyor

[Self-Correcting Structured Output yazisi](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output/) ve [Structured Output Converter dokumani](https://docs.spring.io/spring-ai/reference/api/structured-output-converter.html), `.entity(...)`, `validateSchema()` ve provider-native structured output seceneklerini acik sekilde oneriyor. Spring AI ayni zamanda structured output'un "best effort" oldugunu, yani modelin her zaman kurala uymayabilecegini da acikca kabul ediyor.

Bu son derece önemli bir durustluk sinyali. Spring servisleri model ciktilarini artik sadece chat metni gibi degil, tipli `record` veya DTO girisi gibi ele almali. Ozellikle veri kalicilastiran, baska servislere yazan, mesaj kuyruguna is iten veya is kurali tetikleyen akislarda typed output + validation varsayilan hale gelmeli.

### 6. Guvenlikte isleyen bir yol var ama tam oturmus standart henuz yok

[MCP Security referansi](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-security.html), OAuth 2.0 resource server, API key auth ve MCP Authorization Server entegrasyonunu dokumante ediyor; fakat ayni sayfa bunun hala topluluk odakli ve `work in progress` oldugunu da belirtiyor. Ayrica server tarafi bugun WebMVC ile sinirli.

Bu nedenle Spring ekipleri icin ana mesaj su: MCP server yayinlamak, "bir iki tool acalim" kadar basit degil. Yetkilendirme, scope modeli, auditable tool listesi, timeout, hata sanitizasyonu ve isim cakismasi politikasi bastan tasarlanmali. [Baeldung'in OAuth2 ornegi](https://www.baeldung.com/spring-ai-oath2-mcp-authorization) bu ihtiyacin topluluk tarafinda da hizla ogretilebilir bir desene donustugunu gosteriyor; ama resmi platform olgunlugu henuz tam kapanmis degil.

## Trendler ve Sinyaller

### Trend Kumesi 1: Prompt-merkezli entegrasyondan contract-merkezli entegrasyona gecis

Tekrarlayan sinyal su:

- tool cagrisi uygulama tarafinda yonetiliyor
- MCP istekleri artik acik protokol versiyonu tasiyor
- model ciktilari schema ve typed object ile sinirlaniyor
- tool erisimi kesfedilebilir ama filtrelenebilir hale getiriliyor

Bu kombinasyon, "LLM ekledik" anlatisindan "versiyonlu backend contract'i kurduk" anlatimina gecisi temsil ediyor.

### Trend Kumesi 2: AI tool server'lari normal mikroservis sekillerine uyuyor

[Inside Java](https://inside.java/2026/08/12/java-mcp-migration/), [Spring AI stateless docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-stateless-server-boot-starter-docs.html) ve [Spring AI MCP server docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html) birlikte okundugunda, AI tool server'larin artik "ozel desktop plugin" degil, load balancer arkasinda calisan normal HTTP servisleri haline geldigi goruluyor.

Spring Cloud ve Kubernetes kullanan ekipler icin bu iyi haber. Mevcut ingress, rate limit, auth, rollout, autoscaling ve observability katmanlari yeniden kullanilabilir. Kotu haber ise su: state'i protokolde gizlemek yerine uygulamada acik handle veya id olarak modellemek gerekiyor.

### Trend Kumesi 3: Java ekosisteminde MCP standardizasyonu Spring ile sinirli degil

[Apache Camel 4.22](https://camel.apache.org/blog/2026/08/camel-ai-tools-mcp-422/) ayni tool'u Spring AI, OpenAI ve MCP istemcileri arasinda tekrar kullanilabilir hale getiriyor. [InfoQ](https://www.infoq.com/articles/mcp-java-architectural-strategy-llm-integrations/) MCP'yi ad-hoc tool calling yerine mimari kontrol duzlemi olarak yorumluyor. [Baeldung](https://www.baeldung.com/spring-ai-mcp-annotations) artik MCP annotations, OAuth2 ve subagent orkestrasyonu konularini ogretiyor.

Bu, hype'tan kalici deger ayrimi icin onemli: tek bir framework'ün pazarlama hikayesi degil, farkli Java yuzeylerinin ayni entegrasyon modeline hizalanmasi soz konusu.

### Gurultu mu, kalici deger mi?

- Kalici deger: versiyonlu MCP contract'lari, typed output, stateless deployment, tool filtering, OAuth2 tabanli guvenlik
- Kalici deger: Spring servislerini `@McpTool`, `@McpResource`, `@McpPrompt` ile kontrollu sekilde disa acmak
- Kalici deger: tool sayisi buyurken dynamic discovery ile token ve hata orani baskilamak
- Gurultu: sadece "multi-agent" veya "agent platform" demolarina bakip auth, audit, timeout ve schema validation'i ikinci plana atmak
- Dusuk oncelik: AI/LLM yol haritasi olmayan ekipler icin bugunun ekseni acil migrasyon konusu degil; simdilik izleme seviyesi yeterli

## Araçlar ve Kütüphaneler

- [Spring AI 2.0.0](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now/): Tool loop, MCP integration ve structured output guvenilirligini cekirdege alan mevcut stabil hat.
- [spring-ai-starter-mcp-client-webflux](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-client-boot-starter-docs.html): Uretim deployment icin Spring dokumantasyonunun acikca onerdigi istemci starter'i.
- [spring-ai-starter-mcp-server-webmvc](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html): `STREAMABLE` ve `STATELESS` protokollerini belgeleyen server tabani.
- [spring-ai-starter-tool-search-advisor](https://docs.spring.io/spring-ai/reference/guides/dynamic-tool-search.html): Buyuk tool koleksiyonlarinda token ve context yonetimi icin pratik aday.
- [spring-ai-mcp-annotations](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-annotations-overview.html): Tool, resource, prompt ve client callback handler'larini annotation ile tanimlama yuzeyi.
- [spring-ai-community/mcp-security](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-security.html): Ilginc ama henuz tam olgunlasmamis guvenlik katmani; dikkatli pilot konusu.
- [Apache Camel 4.22 `camel-ai-tool` ve `camel-mcp-server`](https://camel.apache.org/blog/2026/08/camel-ai-tools-mcp-422/): Spring AI kullanan entegrasyon agirlikli ekipler icin guclu komsu sinyali.

Bu baslik altinda yeni bir Spring Cloud, Reactor ya da Micrometer araci bugun one cikmiyor. Varsa da bugunun uretim degerini gecmiyor.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring Boot icindeki mevcut servisleri modele dogrudan acmak yerine, MCP server'i anti-corruption layer gibi kurgulayin. Tool'lar "arka API ne yapabiliyor"u degil, "modele neyi kontrollu olarak yaptirmak istiyoruz"u temsil etmeli.
- Remote MCP server kullaniyorsaniz `STATELESS` ve `STREAMABLE` secimini erken yapin. Sampling, elicitation veya baska geri-bildirimli akislar gerekiyorsa `STATELESS` cizgisi yeterli olmayabilir.
- `FunctionCallback` kullanan eski Spring AI kodlarini backlog'a alin. [Migration guide](https://docs.spring.io/spring-ai/reference/api/tools-migration.html), deprecated API'lerin bir sonraki milestone'da kaldirilacagini acikca soyluyor.
- Modele giden tool listesini filtresiz birakmayin. Birden fazla MCP server baglandiginda isim cakismasi, gereksiz network turu ve context bloat hizla buyur.
- `.content()` ile gelen ham metni is kurali girisi gibi kullanmayin. Persist, mesajlasma, entegrasyon veya komut veren akislarda `.entity(...)`, `validateSchema()` ve gerekiyorsa provider-native structured output kullanin.
- Spring Cloud ekipleri icin bu yeni bir "special snowflake" runtime degil. Timeout, retry, auth, tracing, canary ve audit gereksinimleri diger mikroservislerle ayni ciddiyetle ele alinmali.
- [Spring Boot generations sayfasi](https://spring.io/projects/generations/) halen `4.1.x` icin "No generations data available" diyor. Bu nedenle AI/Security/Authorization Server uyumunu su an project pages, referans docs ve release notlariyla elle capraz dogrulamak gerekiyor.

## Fırsatlar ve Riskler

- Firsat: Spring'in mevcut domain servislerini, repository'lerini ve guvenlik katmanlarini MCP server arkasinda tekrar kullanarak yeni bir AI entegrasyon yolu acmak
- Firsat: Dynamic Tool Discovery ile buyuk tool setlerinde anlamli token ve maliyet dususu elde etmek
- Firsat: Stateless MCP ile tool server'larini normal Kubernetes/Cloud rollout disiplinine almak
- Firsat: Camel 4.22 gibi komsu teknolojilerle ayni tool tanimini birden fazla AI framework'unde tekrar kullanmak
- Risk: Session-varsayimli tool tasarimi yeni MCP kontratiyla kirilabilir; state'i acik id/handle yapisina tasimak gerekir
- Risk: Guvenlik modulu henuz topluluk odakli ve WebMVC sinirli; erken kurumsal standardizasyon zor
- Risk: `FunctionCallback` borcunu ertelemek bir sonraki upgrade penceresinde gereksiz derleme ve davranis riski yaratir
- Risk: Typed output validation olmadan model cevabini dogrudan is akislarina baglamak sessiz veri bozulmasi uretebilir
- Risk: Tool name prefixing, filtering ve timeout politikalari tanimsiz birakilirsa coklu MCP server topolojisi hizla kaotik hale gelir

## İzlenmesi Gereken Konular

- Spring AI `2.0.1` veya `1.1.9` hattinda MCP `2026-07-28` spesifikasyonuna daha acik hizalama ve migration notlari gelip gelmeyecegi
- `spring-ai-community/mcp-security` modulunun resmi endorse durumu, WebFlux destegi ve surum uyumu
- [This Week in Spring](https://spring.io/blog/2026/08/11/this-week-in-spring-august-11-2026/) icinde gecen `Spring AI AgentCore 2.1.0` icin daha resmi release notu veya referans dokuman yayinlanip yayinlanmayacagi
- [Spring Boot generations](https://spring.io/projects/generations/) sayfasinin `4.1.x` uyum verisini ne zaman dolduracagi
- Core Spring release sayfasinda yeni Agustos patch/release dalgasinin acilip acilmayacagi
- Camel 4.22 MCP bridge'inin Spring Boot tarafindaki erken saha geri bildirimleri

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring AI 2.0, tool calling ve MCP entegrasyonunu cekirdek framework davranisina donusturdu
- `source`: [Spring AI 2.0.0 GA Available Now](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now/) | [Spring Projects](https://spring.io/projects/) | [Tool Calling docs](https://docs.spring.io/spring-ai/reference/api/tools.html)
- `author`: Christian Tzolov, Spring AI team
- `date`: 12 Haziran 2026, 16 Agustos 2026 dogrulamasi
- `category`: `framework-architecture`, `spring-ai`, `mcp`, `developer-platform`
- `tags`: `spring-ai-2.0.0`, `toolcallingadvisor`, `mcp-java-sdk`, `streamable-http`, `annotations`
- `summary`: Spring AI 2.0, tool loop'u `advisor chain` icine tasiyor; `ToolCallingAdvisor` otomatik kayitli geliyor, MCP Java SDK resmi hatta aliniyor ve `@McpTool` / `@McpResource` / `@McpPrompt` gibi annotation'lar cekirdege cekiliyor.
- `why_it_matters`: Bu, AI entegrasyonunu model-ozel yardimci kodlardan cikarip test edilebilir, gozlemlenebilir ve framework-politikalarina bagli bir Java katmanina tasiyor.
- `java_spring_relevance`: Spring Boot ile AI veya tool-backed assistant gelistiren ekipler icin dogrudan platform karari.
- `actionability`: `planli_aksiyon`
- `impact_level`: `cok-yuksek`
- `opportunities`: Ortak tool loop'u, standart MCP entegrasyonu, yeniden kullanilabilir annotation modeli
- `risks`: Eski custom tool loop'lar ve gecmisten kalan API kullanimi davranis farki yaratabilir
- `migration_notes`: Eski tool calling kurgulari ve `FunctionCallback` tabanli kod backlog'a alinmali; transport secimi `SSE` yerine `STREAMABLE` veya `STATELESS` olarak bilincli yapilmali

### Bulgu 2

- `title`: MCP `2026-07-28` kontrati remote tool server'lari stateless HTTP servislerine ceviriyor
- `source`: [Inside Java - Evolving a Java MCP Server During MCP Specification Upgrades](https://inside.java/2026/08/12/java-mcp-migration/) | [Stateless MCP Server docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-stateless-server-boot-starter-docs.html) | [MCP Server Boot Starter docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html)
- `author`: Ana-Maria Mihalceanu, Spring AI reference docs
- `date`: 12 Agustos 2026, 16 Agustos 2026 dogrulamasi
- `category`: `protocol`, `cloud-native`, `microservices`, `deployment`
- `tags`: `mcp-2026-07-28`, `stateless-http`, `mcp-protocol-version`, `load-balancing`, `state-handles`
- `summary`: Yeni MCP kontrati `Mcp-Session-Id` ve initialize el sikismasini cikartiyor; her istekte protokol versiyonu acikca tasiniyor ve server tarafi stateless HTTP ile yatay olceklendirilebilir hale geliyor.
- `why_it_matters`: AI tool server'lar artik "ozel ajan runtime" degil, normal HTTP mikroservisler gibi davranabilir; bu da load balancer, ingress ve rollout disiplinini geri kazandirir.
- `java_spring_relevance`: Spring Cloud, Gateway, Kubernetes veya platform ekipleri icin dogrudan mimari etkisi var.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: Session pinning olmadan yatay olceklenebilir tool server'lari, daha basit deployment modeli
- `risks`: Gizli session state'e dayanan eski tasarimlar yeni kontratla uyumsuz kalir; `STATELESS` secimi bazi iki yonlu yetenekleri kaybettirir
- `migration_notes`: State'i protokolde saklamak yerine acik kaynak kimlikleri, cursor'lar veya handle'lar ile uygulama modeline tasimak gerekir

### Bulgu 3

- `title`: Dynamic Tool Discovery, buyuk tool koleksiyonlarini yonetilebilir maliyet seviyesine indiriyor
- `source`: [Tool Search Tool guide](https://docs.spring.io/spring-ai/reference/guides/dynamic-tool-search.html) | [Spring AI 2.0.0 GA Available Now](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now/) | [Smart Tool Selection blogu](https://spring.io/blog/2025/12/11/spring-ai-tool-search-tools-tzolov/)
- `author`: Christian Tzolov, Spring AI team
- `date`: 11 Aralik 2025, 12 Haziran 2026, 16 Agustos 2026 dogrulamasi
- `category`: `cost-control`, `tool-governance`, `agentic-workflows`, `developer-productivity`
- `tags`: `tool-search-tool`, `34-64-token-reduction`, `recursive-advisors`, `tool-index`, `context-bloat`
- `summary`: Spring AI, butun tool tanimlarini her istekte modele yuklemek yerine arama-temelli secimli acilim modeli sunuyor ve dokumante edilmis orneklerde `%34-%64` token tasarrufu iddia ediyor.
- `why_it_matters`: Gercek kurumsal ortamlarda tool sayisi hizla buyur; bu noktada maliyet, gecikme ve yanlis tool secimi ayni anda problem olur.
- `java_spring_relevance`: Birden fazla MCP server, dahili API ve belge sistemi ile calisan Spring tabanli agent akislari icin kritik.
- `actionability`: `planli_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: Token maliyetini dusurmek, tool secim dogrulugunu artirmak, vendor-bagimsiz davranis saglamak
- `risks`: Tool arama stratejisi ve isimlendirme duzensizse kesif kalitesi dusebilir
- `migration_notes`: Buyuk tool setleri olan uygulamalarda varsayilan eager tool kaydi yerine `spring-ai-starter-tool-search-advisor` pilotu acilmali

### Bulgu 4

- `title`: Structured output artik chat konforu degil, domain-guvenilirlik katmani
- `source`: [Self-Correcting Structured Output in Spring AI 2.0](https://spring.io/blog/2026/06/23/spring-ai-self-correcting-structured-output/) | [Structured Output Converter docs](https://docs.spring.io/spring-ai/reference/api/structured-output-converter.html)
- `author`: Christian Tzolov
- `date`: 23 Haziran 2026, 16 Agustos 2026 dogrulamasi
- `category`: `typed-contracts`, `reliability`, `integration-safety`, `application-design`
- `tags`: `entity`, `validateschema`, `native-structured-output`, `json-schema`, `typed-records`
- `summary`: Spring AI 2.0, `.entity(...)` ile typed object donusunu koruyor; buna ek olarak `validateSchema()` ile self-correcting retry loop ve provider-native structured output secenekleri sunuyor.
- `why_it_matters`: Model cevabini metin olarak birakmak; persist, event yayinlama veya komut tetikleme gibi akislarda sessiz hata riskini buyutur.
- `java_spring_relevance`: Spring servislerinin tip guvenligi ve domain modeli ile AI entegrasyonunu ayni hizada tutar.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `yuksek`
- `opportunities`: DTO/record tabanli guvenli entegrasyon, daha az parse hatasi, daha acik test yuzeyi
- `risks`: Validation olmadan ham metin kullaniminda veri kalitesi ve is kurali bozulmasi riski
- `migration_notes`: Model cikisi baska sisteme yaziliyorsa `.content()` yerine `.entity(...)`; kritik akislarda `validateSchema()` ve gerekli yerde provider-native structured output tercih edilmeli

### Bulgu 5

- `title`: MCP guvenligi icin Spring tabanli yol var, ama resmi olgunluk henuz tam degil
- `source`: [MCP Security docs](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-security.html) | [Spring Projects](https://spring.io/projects/) | [Baeldung MCP Authorization with Spring AI and OAuth2](https://www.baeldung.com/spring-ai-oath2-mcp-authorization)
- `author`: Spring AI community, Spring team, Baeldung authors
- `date`: 16 Agustos 2026 dogrulamasi
- `category`: `security`, `oauth2`, `authorization`, `governance`
- `tags`: `mcp-security`, `oauth2-resource-server`, `spring-authorization-server`, `api-key`, `webmvc-only`
- `summary`: Spring AI MCP Security modulu OAuth2 resource server, client ve authorization server yardimcilari sagliyor; ancak dokumantasyon bunu hala work-in-progress ve topluluk odakli olarak tanimliyor.
- `why_it_matters`: AI tool server yayinlamak, klasik REST API yayinlamaktan daha gevsek bir is degil; aksine tool listesi, scope, audit ve hata sanitizasyonu daha merkezi hale geliyor.
- `java_spring_relevance`: Spring Security ve Spring Authorization Server kullanan ekipler, MCP'yi guvenli hale getirmek icin kendi standardini tasimak zorunda kalabilir.
- `actionability`: `planli_aksiyon`
- `impact_level`: `orta-yuksek`
- `opportunities`: Var olan OAuth2/JWT altyapisini MCP server'lara uyarlamak, kurumsal scope modeli kurmak
- `risks`: WIP modulun uzerine erken standart kurmak; WebFlux kullanan ekiplerde uyum boslugu; ad-hoc API key cozumlerine kayma
- `migration_notes`: Uretim rollout oncesi auth modeli, `aud`/scope politikasi, timeout, tool listesi ve hata maskeleme kurallari acikca belirlenmeli

### Bulgu 6

- `title`: Apache Camel 4.22, Java ekosisteminde tool tanimini Spring AI disina tasan ortak yuzeye ceviriyor
- `source`: [Camel Routes as AI Tools: Unified Tooling and MCP Server in Camel 4.22](https://camel.apache.org/blog/2026/08/camel-ai-tools-mcp-422/) | [InfoQ MCP in the Java World](https://www.infoq.com/articles/mcp-java-architectural-strategy-llm-integrations/)
- `author`: Zineb Bendhiba, Federico Mariani, Jiri Ondrusek; Matteo Rossi
- `date`: 7 Agustos 2026, 27 Nisan 2026
- `category`: `adjacent-ecosystem`, `integration`, `tool-reuse`, `mcp`
- `tags`: `camel-4.22`, `camel-ai-tool`, `camel-mcp-server`, `spring-ai`, `anti-corruption-layer`
- `summary`: Camel 4.22, bir route'u bir kez tool olarak tanimlayip Spring AI, OpenAI ve MCP istemcilerine birlikte acmayi hedefliyor; InfoQ de MCP'yi LLM entegrasyonlari icin anti-corruption layer ve governance boundary olarak yorumluyor.
- `why_it_matters`: Spring ekiplerinin etrafindaki entegrasyon dunyasi da ayni modele kayiyor; bu, MCP'nin gelip gecici moda degil, kalici standardizasyon adayi oldugunu gosteriyor.
- `java_spring_relevance`: Camel veya entegrasyon odakli platformlari kullanan Spring ekiplerinde yuksek; klasik CRUD servislerinde dusuk-orta.
- `actionability`: `izleme`
- `impact_level`: `dusuk-orta`
- `opportunities`: Tool tanimini framework'ler arasi yeniden kullanmak, entegrasyon katmanini merkezi hale getirmek
- `risks`: Erken donemde birden fazla framework katmanini ayni anda tasimanin karmasikligi
- `migration_notes`: Camel kullanan ekipler `camel-langchain4j-tools` ve kaldirilan `camel-spring-ai-tools` gecis notlarini incelemeli; Spring Boot tarafinda MCP bridge ile mevcut `@McpTool` yuzeyleri cakismayacak sekilde tasarlanmalı

## Sonuç

16 Agustos 2026 itibariyla Java/Spring ekipleri icin bugunun asil mesaji yeni bir core framework release'i degil; Spring AI 2.0 ve MCP cizgisinin artik "AI demosu" degil, versiyonlu backend entegrasyonu oldugu. Tool calling loop'unun framework'e alinmasi, MCP'nin stateless HTTP kontratina kaymasi, typed output ve schema validation'in resmi hale gelmesi ve guvenlik katmaninin ortaya cikmasi ayni yone isaret ediyor: AI entegrasyonlari artik yazilim mimarisi ve platform muhendisligi ciddiyetinde ele alinmali.

Kisa vadede en dogru hareket, AI yol haritasi olan Spring ekiplerinin su dordunu ayri backlog maddesi yapmasi: `FunctionCallback -> ToolCallback` gecisi, `STATELESS vs STREAMABLE` server secimi, typed output validation standartlari ve OAuth2 tabanli MCP guvenlik modeli. AI backlog'u olmayan ekipler icin ise konu bugun acil degil; fakat MCP'nin Java ekosisteminde Spring, Camel, InfoQ ve Baeldung seviyesinde ayni anda gorunur hale gelmesi orta vadeli izleme listesine kesinlikle girdi.
