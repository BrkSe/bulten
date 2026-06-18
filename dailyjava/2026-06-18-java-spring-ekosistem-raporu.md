# Günlük Java / Spring Ekosistem Raporu

Tarih: 18 Haziran 2026  
Tarama zamanı: 18 Haziran 2026 09:10 TSİ  
Odak: Spring AI'da kompozisyon tabanlı tool-calling mimarisi, dün gölgede kalan Pulsar/SOAP/Web Flow güvenlik yüzeyleri ve JDK 27'nin kripto-performans yönü

Tarama notu: Bu rapor hazırlanırken [Official Spring Blog](https://spring.io/blog/), ilgili [Spring proje sayfaları](https://spring.io/projects), [Spring Security Advisories](https://spring.io/security/), Spring AI / Web Services / Web Flow / Apache Pulsar release yazıları ve advisory sayfaları, [OpenJDK JDK 27 proje sayfası](https://openjdk.org/projects/jdk/27/), [JEP 527](https://openjdk.org/jeps/527), [JEP 538](https://openjdk.org/jeps/538), [Inside Java](https://inside.java/), [InfoQ Java](https://www.infoq.com/java/), [Baeldung Java Weekly 650](https://www.baeldung.com/java-weekly-650), Josh Long'un [This Week in Spring - 16 Haziran 2026](https://spring.io/blog/2026/06/16/this-week-in-spring-june-16-2026), Gunnar Morling'in [Hardwood 1.0.0.CR1 yazısı](https://www.morling.dev/blog/improved-column-reader-api-geospatial-support-hardwood-1-0-0-cr1-available/) ve [Burak KUTBAY blog feed'i](https://blog.burakkutbay.com/feed/) kontrol edildi. [Oracle Java Blog](https://blogs.oracle.com/java/) bu tarama sırasında teknik hata sayfası döndürdüğü için oradan yeni sinyal alınamadı; Oracle tarafındaki güncel üretim sinyali [Inside Java](https://inside.java/) ve [OpenJDK](https://openjdk.org/) üzerinden çapraz kontrol edildi. InfoQ ve Baeldung tarafı bu hafta resmi Spring release/advisory hattının dışına çıkan daha güçlü bir karar sinyali üretmiyor.

## Öne Çıkan Başlıklar

- [Spring AI 2.0 tool-calling mimarisi](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling), tool yürütme döngüsünü model implementasyonlarının içinden çıkarıp `advisor chain` içine taşıyor; bu, Spring AI kullanan ekipler için gerçek bir production tasarım sinyali.
- [Spring Web Services 5.0.2 ve 4.1.4](https://spring.io/blog/2026/06/10/spring-ws-5-0-2-and-4-1-4-available-now), tek bug fix değil; WS-Security default'ları, X.509 hesap kontrolleri, XXE, SSRF ve replay cache dahil yedi parçalı bir güvenlik paketi.
- [Spring for Apache Pulsar 1.2.18 ve 2.0.6](https://spring.io/blog/2026/06/10/spring-for-apache-pulsar-1-2-18-and-2-0-6-are-now-available), header mapper tarafındaki trusted-package davranışını daraltıyor; mesaj header'ı artık doğrudan güven sınırı olarak ele alınmalı.
- [Spring Web Flow 3.0.2 ve 4.0.1](https://spring.io/blog/2026/06/10/spring-webflow-4-0-1-and-3-0-2-available-now), eski ama yaşayan Web Flow yüzeylerinde EL binding ve JS remoting kaynaklı açıkları kapatıyor.
- [JDK 27](https://openjdk.org/projects/jdk/27/) tarafında [hibrit post-quantum TLS 1.3](https://openjdk.org/jeps/527) ve [PEM API](https://openjdk.org/jeps/538) şekilleniyor; [Inside Java'daki yeni benchmark](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/) ise Java mikroservis performansı tartışmasını dil savaşından runtime şekline çekiyor.

## Kritik Güncellemeler

### 1. Spring AI 2.0 artık "tool çağıran wrapper" değil, kompozisyon yüzeyi

[Tool Calling in Spring AI 2.0](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling) yazısındaki asıl sinyal yeni annotation veya provider desteği değil; tool yürütme döngüsünün model adaptörlerinin içinden çıkarılıp `advisor chain` içine taşınması.

Pratikte bu ne demek:

- `ToolCallingAdvisor`, tool çağrılarını recursive bir loop olarak yönetiyor.
- Aynı zincir, tool loop dışında structured output retry ve evaluation loop gibi desenleri de taşıyabiliyor.
- Tool tanımı `@Tool`, `@McpTool`, `Function` veya `ToolCallback` üzerinden yapılabiliyor.
- Memory advisor'ın tool loop'un içinde mi dışında mı durduğu, hangi ara adımların kalıcı hafızaya gideceğini değiştiriyor.
- Aynı mimari hem blocking hem streaming akışları destekliyor.

Bu, Spring AI 2.0'ı "LLM çağrısı yapan framework"ten çıkarıp, guardrail, tracing, policy, retry ve memory kompozisyonu yapılabilen bir runtime kontratına dönüştürüyor. 14 Haziran raporunda odak GA geçiş ve migration notlarıydı; bugünkü yeni sinyal ise production-grade orchestration yüzeyinin netleşmesi.

### 2. Spring Web Services 5.0.2 / 4.1.4: SOAP takımları için doğrudan hardening sprinti

[Spring Web Services 5.0.2 ve 4.1.4](https://spring.io/blog/2026/06/10/spring-ws-5-0-2-and-4-1-4-available-now), tek bir CVE düzeltmesi değil; aynı release penceresinde birikmiş protokol seviyesi güvenlik borcunu kapatıyor. Release yazısı şu advisory kümesini işaret ediyor:

- [CVE-2026-40994](https://spring.io/security/cve-2026-40994): BSP validation default dışı kalabiliyor.
- [CVE-2026-40995](https://spring.io/security/cve-2026-40995): X.509 auth akışında hesap durumu kontrolleri atlanabiliyor.
- [CVE-2026-40996](https://spring.io/security/cve-2026-40996): `rsa-1_5` key transport kabul edilebiliyor.
- [CVE-2026-40997](https://spring.io/security/cve-2026-40997): hesap durumu istisnaları enumeration'a alan açabiliyor.
- [CVE-2026-40998](https://spring.io/security/cve-2026-40998): XPath `InputSource` tarafında XXE.
- [CVE-2026-40999](https://spring.io/security/cve-2026-40999): `ReplyTo` / `FaultTo` üstünden SSRF.
- [CVE-2026-41000](https://spring.io/security/cve-2026-41000): replay cache beklenildiği gibi bağlanmıyor.

Neden kritik:

- Bunlar business logic bug'ı değil, güvenli varsayılanların bozulduğu protokol kontratı hataları.
- SOAP/WS-* kullanan ekipler çoğu zaman bu katmanı "legacy ama stabil" sayıyor; tam tersine, zafiyetler çoğunlukla sessiz default'lardan çıkıyor.
- `4.0.x` ve `3.1.x` gibi eski hatlarda fix erişimi enterprise-only seviyeye kayıyor; support boundary yine güvenlik kararı haline geliyor.

### 3. Spring for Apache Pulsar: mesaj header'ı artık serialization güvenlik sınırı

[Spring for Apache Pulsar 1.2.18 ve 2.0.6](https://spring.io/blog/2026/06/10/spring-for-apache-pulsar-1-2-18-and-2-0-6-are-now-available), görünürde dependency update release'i. Fakat içindeki asıl sinyal [CVE-2026-41732](https://spring.io/security/cve-2026-41732):

- `JsonPulsarHeaderMapper`, trusted package eşleşmesini prefix mantığıyla yaptığı için alt paketleri de fazla geniş biçimde güvenli sayabiliyordu.
- Boş trusted-packages konfigürasyonu güvenli bir allow-list'e düşmek yerine tüm paketleri güvenli kabul edebiliyordu.
- Sonuç olarak saldırgan üretici, consumer tarafında yan etkili JDK tiplerinin deserialize edilmesine zemin hazırlayabiliyordu.

Bu başlığın önemi iki nedenle yüksek:

- Pulsar header'ları çoğu ekipte veri taşıma detayı gibi görülüyor; oysa burada doğrudan deserialization boundary.
- `2.0.6`, Apache Pulsar client `4.2.1` ile birlikte geliyor ve Boot `4.0.7` / `4.1.0` hattına oturuyor; Boot yönetilen versiyonla gerçek fix seviyesi mutlaka eşleştirilmeli.

### 4. Web Flow ve JDK 27: iki farklı ama aynı derecede "sessizce sizi yakalar" hikayesi

[Spring Web Flow 3.0.2 ve 4.0.1](https://spring.io/blog/2026/06/10/spring-webflow-4-0-1-and-3-0-2-available-now) küresel öncelik olarak düşük-orta seviyede, fakat halen Web Flow kullanan ekiplerde anlık aksiyon konusu:

- [CVE-2026-40985](https://spring.io/security/cve-2026-40985): `WebFlowELExpressionParser` ve gevşek binding kombinasyonunda kötü niyetli Unified EL ifadeleri çalışabiliyor.
- [CVE-2026-40986](https://spring.io/security/cve-2026-40986): `spring-js-resources` / Dojo kullanan akışta non-HTML response body HTML gibi render edilip script saldırısına dönebiliyor.

JDK tarafında ise yakın dönem karar sinyali farklı bir yerde:

- [JEP 527](https://openjdk.org/jeps/527), TLS 1.3 için hibrit post-quantum key exchange'i `javax.net.ssl` kullanan uygulamalara varsayılan fayda verecek şekilde getiriyor.
- [JEP 538](https://openjdk.org/jeps/538), PEM encode/decode işini standart JDK API yüzeyine yaklaştırıyor.
- [Inside Java benchmark yazısı](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/), Java 26 + Helidon + virtual thread + Leyden AOT kombinasyonunun belirli yüklerde Go'yu geçtiğini gösterirken asıl dersi `tcpNoDelay(true)` gibi operasyonel ayarların sonucu dramatik değiştirebilmesi üzerinden veriyor.

Mesaj şu: hem legacy framework'lerde hem yeni JDK hattında, "varsayılanlar ne yapıyor?" sorusu tekrar masada.

## Trendler ve Sinyaller

### Trend Kümesi 1: Spring AI tarafında değer artık provider entegrasyonundan değil, kompozisyon kontratından geliyor

Tekrarlayan sinyal:

- [Spring AI 2.0 GA](https://spring.io/blog/2026/06/12/spring-ai-2-0-0-GA-available-now) ile genel platform çizgisi netleşti.
- [Tool-calling yazısı](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling), bunun production orchestration modelini açtı.

Çıkarım:

- Java/Spring ekipleri için kazanç, model ismini değiştirmekten çok tool loop, memory, retry ve policy yerleşimini kontrol etmekte olacak.
- "Agent" tasarımı artık controller/service katmanına değil, advisor zincirine oturuyor.

### Trend Kümesi 2: Spring'in uzun kuyruğundaki protokol/framework yüzeyleri yeniden risk üretiyor

Tekrarlayan örnekler:

- Pulsar header deserialization
- Spring Web Services WS-Security default'ları
- Spring Web Flow EL binding ve JS remoting

Çıkarım:

- "Kimse bunu artık kullanmıyor" varsayımı teknik olarak tehlikeli.
- Kurum içi eski SOAP, Web Flow veya eventing servisleri çoğu zaman dış güvenlik taramasında görünmese de içeride yaşamaya devam ediyor.

### Trend Kümesi 3: Java performans tartışması dil seçimi değil runtime şekli tartışmasına kayıyor

Tekrarlayan sinyal:

- [JDK 26 performans iyileştirmeleri](https://inside.java/2026/06/09/jdk-26-performance-improvements/)
- [Java vs Go benchmark güncellemesi](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/)
- [JDK 27 kripto JEP'leri](https://openjdk.org/projects/jdk/27/)

Çıkarım:

- Virtual thread, AOT/Leyden, socket ayarı, TLS şekli ve observability maliyeti, ham dil algısından daha belirleyici hale geliyor.
- "Java ağırdır, Go hafiftir" ezberi gerçek kapasite planlaması için artık zayıf bir model.

### Gürültü mü, kalıcı değer mi?

- Çok yüksek kalıcı değer: Spring AI advisor-chain tool loop, Spring Web Services multi-CVE hardening
- Yüksek kalıcı değer: Spring for Apache Pulsar header güvenliği, JDK 27 PQ TLS yönü
- Orta kalıcı değer: Spring Web Flow patch'leri
- Düşük öncelik: [Hardwood 1.0.0.CR1](https://www.morling.dev/blog/improved-column-reader-api-geospatial-support-hardwood-1-0-0-cr1-available/) ilginç, fakat bugün tipik Spring Boot mikroservis yol haritasını tek başına değiştirmiyor

## Araçlar ve Kütüphaneler

- [Spring AI 2.0 tool-calling mimarisi](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling): Yeni "araç" tek başına bir dependency değil; `advisor chain` üstünden policy, memory, tracing ve tool orchestration kurgulama biçimi.
- [Spring for Apache Pulsar 2.0.6 / 1.2.18](https://spring.io/blog/2026/06/10/spring-for-apache-pulsar-1-2-18-and-2-0-6-are-now-available): Pulsar client `4.2.1` ve header deserialization hardening ile event-driven takımlar için üretimsel öneme sahip bakım sürümü.
- [Spring Web Services 5.0.2 / 4.1.4](https://spring.io/blog/2026/06/10/spring-ws-5-0-2-and-4-1-4-available-now): Yeni özellik değil; fakat WS-* katmanını güvenli varsayılanlara geri çeken kritik altyapı sürümü.
- [go-java-go-2026 benchmark deposu](https://github.com/markxnelson/go-java-go-2026): Mimari tartışmayı slogan yerine tekrar üretilebilir ölçüme çeken faydalı referans.
- Düşük öncelik: [Hardwood 1.0.0.CR1](https://www.morling.dev/blog/improved-column-reader-api-geospatial-support-hardwood-1-0-0-cr1-available/), Parquet okuma ve geospatial kolonlar için güçlü bir Java veri aracı sinyali; ama tipik Spring backend ekipleri için kısa vadeli zorunlu aksiyon değil.

## Java / Spring Geliştiricileri İçin Etkiler

- Spring AI ile agent/workflow kurgulayan ekipler, tool execution'ı service metodunun içinde değil `advisor` sıralamasında düşünmeli; memory ve audit konumlandırması mimari karar haline geldi.
- SOAP/WS-Security kullanan ekipler, `Wss4jSecurityInterceptor`, `ReplyTo` / `FaultTo`, X.509 auth ve replay cache kullanımını env/env envanterine dökmeli.
- Pulsar kullanan ekipler, "trusted packages" ve header mapper konfigürasyonlarını deserialization politikası olarak ele almalı; yalnız version bump yeterli değil.
- Web Flow kullanan ekiplerde custom EL parser veya eski `spring-js-resources` kullanımı varsa risk görünenden yüksek; bu başlık sadece "legacy cleanup" değil.
- JDK 27 test hattı olan ekipler, PQ TLS ve PEM API'lerini ayrı bir güvenlik/uyumluluk izi olarak izlemeli; sadece benchmark değil PKI, gateway ve service mesh uyumu da ölçülmeli.
- Performans tartışmalarında dil yerine runtime shape'e bakmak gerekiyor: virtual threads, AOT/Leyden, socket ayarları, payload büyüklüğü ve concurrency matrisi birlikte ölçülmeli.

## Fırsatlar ve Riskler

- Fırsat: Spring AI advisor zinciri üzerinden tool guardrail, observability ve memory katmanını standartlaştırmak.
- Fırsat: JDK 27 ile TLS ve PEM işlemlerinde uygulama-özel yardımcı kodları azaltmak.
- Fırsat: SOAP ve Web Flow gibi eski yüzeyleri "bir daha ellemeyelim" alanı olmaktan çıkarıp net bir modernizasyon backlog'una bağlamak.
- Risk: Pulsar veya benzeri messaging katmanlarında header'ı iş kuralı detayı sanıp serialization güvenlik sınırı olarak ele almamak.
- Risk: Web Services tarafında enterprise-only fix sınırına takılıp `4.0.x` / `3.1.x` hatlarında görünmez güvenlik borcu biriktirmek.
- Risk: Java-vs-Go benchmark'ını kendi ağ, TLS, JSON, container ve observability yükünüz olmadan genellemek.
- Risk: Oracle Java Blog tarafındaki erişim sorunları yüzünden resmi Java güncelleme sinyalini atlamak; Inside Java ve OpenJDK ile çapraz doğrulama alışkanlığı korunmalı.

## İzlenmesi Gereken Konular

- Spring AI advisor zinciri etrafında resmi guardrail, eval ve policy eklentilerinin çıkıp çıkmayacağı
- Spring Web Services ve Web Flow için follow-up patch veya enterprise-only backport akışı
- Boot `3.5.x` / `4.0.x` / `4.1.x` yönetilen dependency haritasında Pulsar ve benzeri düzeltmelerin tam olarak hangi patch tabanında sabitlendiği
- JDK 27 GA'ya yaklaşırken [JEP 527](https://openjdk.org/jeps/527) ve [JEP 538](https://openjdk.org/jeps/538) etrafında uyumluluk notları
- [Hardwood 1.0 Final](https://www.morling.dev/blog/improved-column-reader-api-geospatial-support-hardwood-1-0-0-cr1-available/) sonrası Java veri platformu tarafında gerçek benimsenme oluşup oluşmayacağı

## Kaynak Bazlı Bulgular

### Bulgu 1

- title: Spring AI 2.0, tool loop'u `advisor chain` içine taşıyarak agent orchestration'ı bir runtime kontratına dönüştürüyor
- source: [Tool Calling in Spring AI 2.0: A Composable, Agentic Architecture](https://spring.io/blog/2026/06/15/spring-ai-composable-tool-calling), [This Week in Spring - June 16th, 2026](https://spring.io/blog/2026/06/16/this-week-in-spring-june-16-2026)
- author: Christian Tzolov; Josh Long
- date: 15-16 Haziran 2026
- category: ai-platform, architecture, developer-productivity
- tags: spring-ai, tool-calling, advisor-chain, chatclient, mcp, memory, streaming
- summary: Tool execution artık model implementasyonlarının içinde saklı değil; `ToolCallingAdvisor` üzerinden zincire ekleniyor. Aynı mimari tool loop, retry ve evaluation döngülerini aynı yerde birleştiriyor.
- why_it_matters: Bu değişiklik, Spring AI tabanlı agent'larda memory, tracing, guardrail ve policy'yi framework'ün resmi extension noktalarına yerleştirmeyi mümkün kılıyor.
- java_spring_relevance: Spring AI ile LLM workflow, MCP entegrasyonu veya iç araç otomasyonu yazan Java/Spring ekipleri için çok yüksek.
- actionability: planlı_aksiyon
- impact_level: yüksek
- opportunities: Advisor tabanlı standard guardrail katmanı, merkezi tool telemetry, memory stratejisi ve retry politikası tasarlamak.
- risks: Tool loop'un yanlış tarafına memory/policy yerleştirip ara adımları kaybetmek; 1.x zihniyetiyle kapalı model adapter mantığında kalmak.
- migration_notes: `advisor` sıralamasını gözden geçirin; memory'nin loop içi mi dışı mı olacağına bilinçli karar verin; streaming ve retry akışlarını birlikte test edin.

### Bulgu 2

- title: Spring Web Services 5.0.2 ve 4.1.4, WS-Security default'larından SSRF'ye uzanan çok parçalı güvenlik borcunu kapatıyor
- source: [Spring Web Services 5.0.2 and 4.1.4 available now](https://spring.io/blog/2026/06/10/spring-ws-5-0-2-and-4-1-4-available-now), [CVE-2026-40994](https://spring.io/security/cve-2026-40994), [CVE-2026-40996](https://spring.io/security/cve-2026-40996), [CVE-2026-40999](https://spring.io/security/cve-2026-40999), [CVE-2026-41000](https://spring.io/security/cve-2026-41000)
- author: Stéphane Nicoll; Spring Security Advisory Team
- date: 10 Haziran 2026
- category: security, integration, soap, support-policy
- tags: spring-ws, wss4j, x509, replyto, faultto, replay-cache, xxe, rsa-1_5
- summary: Release, SOAP/WS-* katmanında BSP enforcement, RSA v1.5 key transport, X.509 auth, XXE, SSRF ve replay cache gibi birden fazla güvenlik varsayımını düzeltiyor.
- why_it_matters: Tek bir patch değil; enterprise SOAP servislerinde çoğu zaman görünmez kalan protokol seviyesi güvenlik açıklarını aynı anda kapatıyor.
- java_spring_relevance: Spring WS, kurum içi SOAP entegrasyonları, B2B gateway'ler ve güvenli mesajlaşma kullanan Java ekipleri için çok yüksek.
- actionability: hemen_aksiyon
- impact_level: çok-yüksek
- opportunities: WS-Security konfigürasyonlarını sadeleştirmek, egress allow-list ve replay politikalarını merkezileştirmek.
- risks: Eski `4.0.x` / `3.1.x` hatlarında kalıp enterprise-only fix duvarına çarpmak; `ReplyTo` / `FaultTo` ile iç ağa SSRF açmak.
- migration_notes: `5.0.2` veya `4.1.4` seviyesine çıkın; `Wss4jSecurityInterceptor`, `WebServiceMessageSender` ve X.509 akışlarını negatif testlerle yeniden doğrulayın.

### Bulgu 3

- title: Spring for Apache Pulsar, header mapper trusted-package davranışını daraltarak deserialization sınırını görünür kıldı
- source: [Spring for Apache Pulsar 1.2.18 and 2.0.6 are now available](https://spring.io/blog/2026/06/10/spring-for-apache-pulsar-1-2-18-and-2-0-6-are-now-available), [CVE-2026-41732](https://spring.io/security/cve-2026-41732)
- author: Soby Chacko; Spring Security Advisory Team
- date: 10 Haziran 2026
- category: messaging, security, serialization, dependency-management
- tags: spring-pulsar, header-mapper, trusted-packages, deserialization, boot-3.5.15, boot-4.0.7, boot-4.1.0
- summary: Prefix bazlı trusted package kontrolü ve boş konfigürasyonda güvenli default'a dönmeme davranışı, tüketicide saldırgan kontrollü JDK tiplerinin deserialize edilmesine alan açıyordu.
- why_it_matters: Mesaj header'ları çoğu zaman iş kuralları seviyesi veri gibi algılansa da burada doğrudan güvenlik kontratı haline geliyor.
- java_spring_relevance: Pulsar tabanlı event-driven Spring servisleri, message bridge'leri ve custom header kullanan tüketiciler için yüksek.
- actionability: hemen_aksiyon
- impact_level: yüksek
- opportunities: Header allow-list, serializer policy ve messaging boundary testlerini standartlaştırmak.
- risks: "Bakım sürümü" diyerek geçip fix'i kaçırmak; Boot'un yönettiği versiyonun gerçek düzeltme seviyesiyle eşleştiğini varsaymak.
- migration_notes: `1.2.18` veya `2.0.6`'ya geçin; header mapper özelleştirmelerini tarayın; boş trusted-package veya geniş wildcard mantığını kaldırın.

### Bulgu 4

- title: Spring Web Flow 3.0.2 ve 4.0.1, unutulmuş EL binding ve JS remoting yüzeylerini tekrar risk alanına taşıdı
- source: [Spring Web Flow 3.0.2 and 4.0.1 Available Now](https://spring.io/blog/2026/06/10/spring-webflow-4-0-1-and-3-0-2-available-now), [CVE-2026-40985](https://spring.io/security/cve-2026-40985), [CVE-2026-40986](https://spring.io/security/cve-2026-40986)
- author: Rossen Stoyanchev; Spring Security Advisory Team
- date: 10 Haziran 2026
- category: security, web, legacy-framework, ui
- tags: spring-web-flow, unified-el, binding, spring-js-resources, dojo, xss
- summary: Custom `WebFlowELExpressionParser` ve gevşek binding kombinasyonu kötü niyetli EL ifadelerine alan açabiliyor; `JS RemotingHandler` ise non-HTML response'u HTML gibi render ederek script saldırısına dönüşebiliyor.
- why_it_matters: Global ölçekte düşük öncelik gibi görünse de halen Web Flow kullanan ekipler için risk yüksek ve çoğu zaman envanter dışında kalıyor.
- java_spring_relevance: Web Flow, eski Spring MVC akışları ve `spring-js-resources` / Dojo tabanlı ekranları olan ekipler için hedefli biçimde yüksek.
- actionability: hemen_aksiyon
- impact_level: orta
- opportunities: Kalan Web Flow yüzeylerini azaltmak, binding tanımlarını açık hale getirmek ve frontend remoting bağımlılıklarını sökmek.
- risks: "Legacy ama içeride çalışıyor" diye unutulan modüllerde sessiz XSS veya expression exploitation yüzeyi bırakmak.
- migration_notes: `3.0.2` veya `4.0.1`'e geçin; custom EL parser kullanımını ve `spring-js-resources` bağımlılığını tarayın; `<binding>` tanımlarını netleştirin.

### Bulgu 5

- title: JDK 27, hibrit post-quantum TLS ve standart PEM API ile güvenlik katmanını uygulama kodundan JDK'ya çekiyor
- source: [JDK 27 Project Page](https://openjdk.org/projects/jdk/27/), [JEP 527](https://openjdk.org/jeps/527), [JEP 538](https://openjdk.org/jeps/538)
- author: OpenJDK
- date: 4-5 Haziran 2026
- category: jvm, security, cryptography, api-evolution
- tags: jdk27, tls13, post-quantum, mlkem, pem, certificates, pki, javax-net-ssl
- summary: JDK 27 hattı, TLS 1.3 için hibrit post-quantum key exchange ve PEM encode/decode için standart API'yi aynı güvenlik ekseninde şekillendiriyor.
- why_it_matters: TLS ve sertifika işlemleri için uygulama-özel yardımcı kodların bir kısmı zamanla gereksiz hale gelebilir; fakat uyumluluk ve kurumsal PKI testleri erkene çekilmeli.
- java_spring_relevance: Spring Boot istemci/server TLS kullanımı, custom PEM yükleme kodu, service mesh ve kurum içi CA zincirleri olan ekipler için yüksek.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: PEM parse/emit işini JDK standardına yaklaştırmak; gelecekteki TLS sertleşmesini kademeli test etmek.
- risks: LB, WAF, corporate TLS scanner veya HSM entegrasyonlarında beklenmeyen uyumluluk sorunları; erken test yapılmazsa prod sürprizi.
- migration_notes: JDK 27 EA hattı açın; TLS handshake uyumunu ve mevcut PEM yardımcı kodlarınızı karşılaştırmalı test edin; JSSE policy farklarını belgeleyin.

### Bulgu 6

- title: Inside Java benchmark'i, Java mikroservis performansı tartışmasını dilden runtime şekline taşıyor
- source: [Can Java Microservices Be As Fast As Go? A 2026 Benchmark Update](https://inside.java/2026/06/15/java-microservices-fast-go-2026-benchmark/), [Medium/Helidon article mirror](https://medium.com/helidon/can-java-microservices-be-as-fast-as-go-a-2026-benchmark-update-e16a2e262fc4), [go-java-go-2026 repository](https://github.com/markxnelson/go-java-go-2026)
- author: Mark Nelson
- date: 8-15 Haziran 2026
- category: performance, microservices, runtime, benchmarking
- tags: java26, helidon, virtual-threads, leyden, golang, tcpnodelay, throughput
- summary: Oracle JDK 26.0.1 + Helidon SE 4.4.1, belirli payload ve concurrency seviyelerinde Go 1.26.3'ü yakalıyor hatta geçiyor; Leyden AOT varyantı yüksek concurrency'de daha da öne çıkıyor. Sonucu belirgin değiştiren ayrıntılardan biri `tcpNoDelay(true)` oldu.
- why_it_matters: Performans kararı artık dil klişesiyle değil, runtime ayarı, socket davranışı, warmup, payload ve concurrency matrisiyle verilmeli.
- java_spring_relevance: Spring Boot veya başka Java web stack'leriyle yüksek concurrency servis işleten ekipler için mimari argüman ve benchmark yöntemi açısından değerli.
- actionability: planlı_aksiyon
- impact_level: orta-yüksek
- opportunities: Kendi servisinizde virtual thread, AOT/CDS/Leyden ve socket ayarlarının etkisini ölçmek; kapasite planını veriyle tartışmak.
- risks: Sentetik benchmark'ı prod gerçeği yerine koymak; startup, RSS, CPU, GC ve observability maliyetlerini görmezden gelmek.
- migration_notes: Kendi iş yükünüzde tekrar üretin; TLS, JSON, logging ve container limitlerini dahil edin; JFR ve GC loglarını benchmark protokolüne ekleyin.

## Sonuç

Bugünün en değerli sinyali, Spring AI tarafında agent davranışının artık framework'ün resmi kompozisyon yüzeyine taşınması. Bu, Java/Spring ekipleri için LLM entegrasyonunu "demo feature" olmaktan çıkarıp gerçek production tasarımı konusu yapıyor.

İkinci güçlü tema ise, Spring'in daha az görünen fakat kurumsal sistemlerde yaşamaya devam eden yüzeylerinde biriken güvenlik borcu: Pulsar header mapping, SOAP/WS-Security ve Web Flow. JDK 27 tarafı da buna paralel biçimde kripto ve runtime katmanını yeniden şekillendiriyor. Kısa öneri net: tool orchestration, legacy protocol surfaces ve JDK 27 test hattını aynı backlog içinde görünür hale getirin.
