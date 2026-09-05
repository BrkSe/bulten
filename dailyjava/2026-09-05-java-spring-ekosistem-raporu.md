# Günlük Java / Spring Ekosistem Raporu

Tarih: 5 Eylül 2026 Cumartesi  
Tarama zamanı: 5 Eylül 2026 13:57 TSİ  
Tekrar etmeme filtresi: 3 Eylül'deki `JDK 27 RC / final-field mutation / PQC TLS / JSON thread dump / GC default` ekseni ile 2 Eylül'deki toplu patch koreografisi bugünün ana teması olarak dışlandı.  
Odak: Spring Boot container üretiminde güvenlik sınırı artık yalnızca uygulama JAR'ı veya `Dockerfile` değildir. Builder, buildpack, run image, JVM dağıtımı, SBOM ve rebase işlemi birlikte sürümlenen bir platform sözleşmesidir.

Tarama notu: [Spring Blog](https://spring.io/blog/), [Spring Projects](https://spring.io/projects), [Spring release akışı](https://spring.io/blog/category/releases), [Spring Security advisories](https://spring.io/security/), Spring Boot `4.1.1` dokümantasyonu ve GitHub release yüzeyleri; [OpenJDK](https://openjdk.org/), [Inside Java](https://inside.java/), Oracle Java resmi sürüm/dokümantasyon kanalları, [InfoQ Java](https://www.infoq.com/java/), [Baeldung](https://www.baeldung.com/), Josh Long'un Spring akışı, [Gunnar Morling](https://www.morling.dev/blog/) ve [Burak KUTBAY](https://blog.burakkutbay.com/) 5 Eylül 2026 itibarıyla kontrol edildi. Oracle blog RSS'i `403` verdiği için resmi Oracle dokümantasyonu ve sürüm yüzeylerine dönüldü. Gunnar Morling ve Burak KUTBAY tarafında bugünün container yönetişimi kararını değiştiren daha yeni bir bulgu görülmedi.

## Öne Çıkan Başlıklar

- Spring Blog'un 3 Eylül'deki [BellSoft ile hardened runtime images konuşması](https://spring.io/blog/2026/09/03/a-bootiful-podcast-catherine-edelvais), container taban imajını Java/Spring ekiplerinin doğrudan yönettiği bir güvenlik ve operasyon konusu haline getiriyor.
- Spring Boot `4.1.1` Maven eklentisinin varsayılan builder'ı `paketobuildpacks/builder-noble-java-tiny:latest`; bu kolaylık aynı zamanda mutable tag, builder güveni ve yeniden üretilebilirlik kararıdır.
- Cloud Native Buildpacks, build image ile run image'ı ayırır. `rebase`, uygulamayı yeniden derlemeden run-image katmanlarını değiştirebilir; fakat bunun güvenli rollout, imza, test ve geri alma politikası olmadan otomatikleştirilmesi doğru değildir.
- Paketo ve Spring Boot iki tamamlayıcı SBOM yüzeyi sunar: image içindeki JVM/OS/buildpack bağımlılıkları ile uygulama dependency SBOM'u birlikte saklanmalıdır.
- BellSoft hardened/minimal imajları saldırı yüzeyini küçültme adayıdır; “hardened” etiketi tek başına kanıt değildir. `musl`/`glibc`, CA store, font/locale, native library, JFR ve debug gereksinimleri ayrı ayrı doğrulanmalıdır.
- 5 Eylül itibarıyla 3 Eylül raporundan sonra yeni Spring Boot/Framework/Cloud GA veya yeni Spring advisory görünmüyor. Günün kalıcı değeri sürüm kovalamak değil, image supply-chain sahipliğini netleştirmektir.

## Kritik Güncellemeler

### 1. Spring'in güncel sinyali: güvenli dağıtım JAR'dan önce runtime image kararıdır

Josh Long'un 3 Eylül tarihli [BellSoft söyleşisi](https://spring.io/blog/2026/09/03/a-bootiful-podcast-catherine-edelvais), buildpacks ve hardened runtime image'ların Spring Boot uygulamalarını daha az Dockerfile yüküyle dağıtma rolünü öne çıkarıyor. Bu bir ürün doğrulaması değil; ancak Spring'in resmi akışında container security, JRE ve buildpack'in aynı konuşmada buluşması önemli bir yön sinyali.

Kalıcı mühendislik sonucu şudur: uygulama ekibi yalnızca Maven/Gradle dependency'lerini değil, aşağıdaki zinciri de sahiplenmelidir:

`builder digest -> buildpack sürümleri -> build image -> run image -> JVM dağıtımı -> app katmanları -> SBOM/provenance`

### 2. Spring Boot varsayılanı kolaylık sağlıyor; ancak `latest` platform politikası değildir

[Spring Boot 4.1.1 OCI image dokümantasyonu](https://docs.spring.io/spring-boot/maven-plugin/build-image.html), varsayılan builder olarak `paketobuildpacks/builder-noble-java-tiny:latest` değerini gösteriyor. Eklenti ayrıca `builder`, `runImage`, `pullPolicy`, `imagePlatform`, `buildpacks`, `bindings`, `network`, `securityOptions`, `createdDate` ve `trustBuilder` ayarlarını görünür kılıyor.

Bu yüzeylerin üretim anlamı:

- CI'da builder ve mümkünse run image digest ile sabitlenmeli.
- `pullPolicy=ALWAYS`, güncellik sağlar fakat aynı kaynak commit'in farklı zamanda farklı image üretmesine yol açabilir.
- `createdDate` için sabit değer yeniden üretilebilirliği destekler; `now` kullanımı bilinçli olmalıdır.
- Özel builder kullanmak `trustBuilder=true` demeyi otomatik olarak haklı çıkarmaz; builder kaynağı, imzası ve içerdiği buildpack'ler doğrulanmalıdır.
- `bindings` ve build network'ü supply-chain erişim yüzeyidir; secret'lar image layer veya build log'una sızmamalıdır.

### 3. Run image yamaları uygulama rebuild'inden ayrılabilir, rollout doğrulamasından ayrılamaz

[Cloud Native Buildpacks rebase](https://buildpacks.io/docs/for-app-developers/concepts/rebase/) modeli, yeni run image katmanlarını uygulama katmanlarını yeniden derlemeden image'a bağlayabilir. Bu, kritik OS/JRE taban image yamasının yüzlerce Spring servisinde hızla yayılması için ciddi fırsattır.

Ancak rebase sonrasında ortaya yeni bir image digest çıkar. Bu nedenle en az şu kontroller gerekir:

- image imzası ve provenance yeniden üretilmeli
- SBOM/image scan yeniden çalışmalı
- `java -version`, CA/trust store ve locale/font/native library smoke testleri yapılmalı
- Spring Boot health/readiness, outbound TLS ve observability agent'ları doğrulanmalı
- canary ve geri alma için önceki digest korunmalı

`pack rebase --force` normal yol haline getirilmemeli; CNB'nin uyumluluk doğrulamalarını aşar.

### 4. Uygulama SBOM'u ile runtime SBOM'u tek belge sanılmamalı

[Spring Boot build rehberi](https://docs.spring.io/spring-boot/how-to/build.html) CycloneDX uygulama SBOM'u üretimini, [Actuator SBOM endpoint'i](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.sbom) ise uygulama ve ek sistem SBOM'larını sunmayı destekliyor. [Paketo SBOM dokümantasyonu](https://paketo.io/docs/concepts/sbom/) JVM ve buildpack tarafından eklenen bileşenler dahil image katmanlarının SBOM bilgisini üretiyor.

Üretim politikası iki envanteri birleştirmeli:

- uygulama: Spring, Jackson, Netty, JDBC sürücüsü ve diğer Maven/Gradle bileşenleri
- runtime: JRE/JDK, libc, CA paketi, OS paketleri, buildpack ve agent katmanları

Yalnızca `/actuator/sbom` açmak container'ın tamamını bildiğiniz anlamına gelmez. Endpoint ayrıca varsayılan olarak internete açılmamalı; registry/artifact-store kopyası esas kayıt olmalıdır.

### 5. Minimal ve hardened image arasında işlevsel uyumluluk bütçesi vardır

[BellSoft Alpaquita container kataloğu](https://bell-sw.com/alpaquita-containers/) ve [hardened image rehberi](https://docs.bell-sw.com/alpaquita-linux/latest/how-to/images-getting-started-guide/) minimal, distroless, `musl` ve `glibc` seçenekleri sunuyor. Daha az paket genellikle daha küçük saldırı ve CVE tarama yüzeyi sağlar. Fakat uygulama uyumluluğu otomatik değildir.

Özellikle şu Spring/JVM iş yükleri pilotta doğrulanmalı:

- JNI/JNA veya vendor native driver kullanan servisler
- font ve locale isteyen PDF/raporlama işleri
- özel CA veya mTLS kullanan outbound client'lar
- shell tabanlı Kubernetes probe/debug alışkanlıkları
- JFR, `jcmd`, heap/thread dump ve incident araçları
- CRaC veya native image kullanan servisler

Vendor'ın “near-zero CVE” veya “hardened” söylemi, kurumun kendi scanner sonucu, patch SLA'sı, imza ve exploitability değerlendirmesiyle doğrulanmadan kabul edilmemelidir.

## Trendler ve Sinyaller

### Trend Kümesi 1: Container tabanı uygulama ekiplerinden platform ürününe kayıyor

Spring Boot build plugin'i image üretimini kolaylaştırıyor; CNB builder/run-image ayrımı ise merkezi platform ekibine standardizasyon yüzeyi veriyor. Her servisin farklı Dockerfile bakımını yapması yerine onaylı builder, run image ve JVM hattı yönetilebilir. Kalıcı değer burada; belirli bir vendor etiketinde değil.

### Trend Kümesi 2: Patch hızı ile yeniden üretilebilirlik arasında açık bir seçim gerekiyor

Mutable `latest` hızlı güncel kalır; digest pinning aynı girdiden aynı çıktıyı üretmeyi kolaylaştırır. Sağlıklı model ikisini ayırır:

- production build'leri onaylı digest'e pinle
- bir bot/job yeni builder ve run-image digest'lerini izleterek PR açsın
- scan, SBOM diff ve smoke testten sonra promotion yapılsın
- kritik run-image yamasında kontrollü rebase yolu kullanılsın

### Trend Kümesi 3: SBOM rapor olmaktan çıkıp promotion kapısına dönüşüyor

SBOM'un değeri dosyanın varlığında değil, önceki image ile farkının okunmasındadır. JVM, OS veya agent katmanı beklenmedik biçimde değiştiyse uygulama dependency diff'i boş olsa bile release durdurulabilmelidir.

### Gürültü mü, kalıcı değer mi?

- Kalıcı değer: builder ve run image digest'lerini sürümlemek
- Kalıcı değer: app ve runtime SBOM'larını birlikte arşivleyip diff etmek
- Kalıcı değer: rebase'i testli, imzalı ve geri alınabilir bir güvenlik operasyonuna dönüştürmek
- İzleme: Spring Boot `4.2` image-based build cache desteğinin CI izolasyonu ve cache poisoning sınırları
- Düşük öncelik: yalnızca image boyutunu küçülttüğü için dağıtım modelini değiştirmek
- Pazarlama sinyali: “hardened” veya “sıfıra yakın CVE” ifadesini bağımsız kontrol olmadan güvenlik sonucu saymak

## Araçlar ve Kütüphaneler

- [Spring Boot Build Image Maven Plugin 4.1.1](https://docs.spring.io/spring-boot/maven-plugin/build-image.html): builder, run image, platform, cache, registry ve trust ayarlarının merkezi yüzeyi.
- [Paketo Java buildpacks](https://paketo.io/docs/howto/java/): JRE/JDK seçimi, JLink, JFR/NMT, APM ve Spring Boot katmanları için üretim hattı.
- [Cloud Native Buildpacks rebase](https://buildpacks.io/docs/for-app-developers/concepts/rebase/): run-image patch'ini app rebuild'inden ayıran mekanizma.
- [Paketo SBOM](https://paketo.io/docs/concepts/sbom/): CycloneDX, SPDX ve Syft formatlarında runtime/image bileşen görünürlüğü.
- [Spring Boot Actuator SBOM](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.sbom): uygulama SBOM'una runtime sırasında kontrollü erişim.
- [BellSoft Alpaquita/Hardened images](https://bell-sw.com/alpaquita-containers/): `musl`/`glibc`, JRE/JDK, native image ve distroless seçenekleri; pilot ve doğrulama gerektirir.

## Java / Spring Geliştiricileri İçin Etkiler

- `spring-boot:build-image` veya Gradle eşdeğerini kullanan her servis için gerçek builder ve run-image digest'ini build çıktısına yazdır.
- Platform BOM'una yalnızca Java dependency'lerini değil, onaylı builder/run-image/JVM politikasını da ekle.
- App SBOM ile runtime SBOM'u registry yanında immutable artifact olarak sakla; release'ler arasında diff üret.
- Kritik base-image patch'i için `rebuild` ve `rebase` akışlarını ayrı runbook olarak yaz; ikisinde de canary test uygula.
- Minimal image pilotunda yalnızca uygulamanın açılmasını değil, TLS, DNS, locale, native library, JFR ve incident-dump akışını test et.
- Debug ihtiyacını production image'a shell ekleyerek çözme; ephemeral debug container veya ayrı teşhis image'ı tasarla.
- `/actuator/sbom` erişimini management security policy'sine bağla; public endpoint yapma.

## Fırsatlar ve Riskler

### Fırsatlar

- Ortak run image ile yüzlerce serviste taban CVE yamalarını daha hızlı yaymak
- Dockerfile çeşitliliğini azaltıp JVM parametreleri, CA ve observability agent'larını standartlaştırmak
- SBOM diff ile beklenmedik runtime değişikliklerini deployment öncesi yakalamak
- Rebase sayesinde uygulama derlemesini beklemeden acil OS katmanı yaması yapmak
- Minimal runtime ile gereksiz paket ve araçları production yüzeyinden çıkarmak

### Riskler

- `latest` builder tag'iyle aynı commit'ten denetlenmeden farklı image üretmek
- builder'ı güvenilir ilan edip build sırasında source, token veya binding secret'larını sızdırmak
- yalnızca Maven SBOM'una bakıp JVM/OS/agent CVE'lerini kaçırmak
- rebase sonrası uygulama testi, imza veya provenance üretmeden image'ı doğrudan promote etmek
- `musl`/distroless geçişinde native library, DNS, CA, locale veya teşhis yeteneklerini kırmak
- vendor güvenlik iddiasını exploitability ve kurum scanner'ı ile doğrulamamak

## İzlenmesi Gereken Konular

- Spring Boot `4.1.2` veya `4.2` hattında varsayılan builder/run-image politikasının değişip değişmediği
- Spring Boot `4.2` image-based build cache için izolasyon, anahtarlandırma ve cache provenance ayrıntıları
- Paketo Noble/Resolute builder hatlarının sürüm, imza ve lifecycle metadata değişimleri
- BellSoft hardened image'ların kamuya açık patch SLA, imza/provenance ve CVE karşılaştırma verileri
- CNB rebase sonrasında SBOM ve attestation yenilemesini otomatikleştiren registry/platform entegrasyonları
- Oracle/OpenJDK container ergonomics değişikliklerinin yeni LTS ve non-LTS JVM image'larına yansıması

## Kaynak Bazlı Bulgular

### Bulgu 1

- `title`: Spring ekosisteminde hardened runtime image, platform güvenliği konusu olarak öne çıktı
- `source`: [Spring Blog podcast](https://spring.io/blog/2026/09/03/a-bootiful-podcast-catherine-edelvais) | [BellSoft container kataloğu](https://bell-sw.com/alpaquita-containers/)
- `author`: Josh Long, Catherine Edelveis; BellSoft
- `date`: 3 Eylül 2026; 5 Eylül 2026 doğrulaması
- `category`: `container-security`, `runtime-distribution`, `platform-engineering`
- `tags`: `spring-boot`, `buildpacks`, `hardened-image`, `alpaquita`, `liberica`, `distroless`
- `summary`: Spring'in resmi akışı buildpacks, hardened image, JRE ve container security'yi aynı production konuşmasında birleştirdi.
- `why_it_matters`: Container tabanı uygulama kodundan bağımsız bir patch ve risk yüzeyidir.
- `java_spring_relevance`: Spring Boot servisleri çoğunlukla JVM ve framework katmanının yanında OS/run-image katmanını da taşır.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: standart image ailesi, daha küçük saldırı yüzeyi, merkezi patch süreci
- `risks`: vendor iddiasını kanıt sanmak, minimal image uyumluluk kaybı, teşhis kabiliyetinin azalması
- `migration_notes`: bir düşük riskli serviste glibc/musl, CA, locale, native library ve JFR matrisiyle pilot yap; digest ve scanner sonuçlarını kaydet

### Bulgu 2

- `title`: Spring Boot build-image varsayımları supply-chain politikası gerektiriyor
- `source`: [Spring Boot Maven Plugin 4.1.1](https://docs.spring.io/spring-boot/maven-plugin/build-image.html)
- `author`: Spring Boot team
- `date`: 20 Ağustos 2026 sürümü, 5 Eylül 2026 doğrulaması
- `category`: `build-security`, `reproducibility`, `ci-cd`
- `tags`: `builder-noble-java-tiny`, `latest`, `trustBuilder`, `pullPolicy`, `createdDate`, `bindings`
- `summary`: Boot'un kolaylaştırdığı OCI image üretimi builder trust, mutable tag, network, secret binding ve platform mimarisi kararlarını da içeriyor.
- `why_it_matters`: Kaynak commit sabitken build zincirinin başka bir parçası sessizce değişebilir.
- `java_spring_relevance`: `spring-boot:build-image` kullanan her servis bu varsayımları devralır.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: merkezi builder politikası, digest pinning, otomatik SBOM/provenance
- `risks`: mutable build, gereksiz builder trust, build secret sızıntısı
- `migration_notes`: mevcut image metadata'sından builder/run image digest'lerini çıkar; CI konfigürasyonunu onaylı digest ve kontrollü update PR akışına geçir

### Bulgu 3

- `title`: CNB rebase taban image yamasını hızlandırıyor, yeni release artefaktı üretiyor
- `source`: [CNB rebase açıklaması](https://buildpacks.io/docs/for-app-developers/concepts/rebase/) | [pack rebase referansı](https://buildpacks.io/docs/for-platform-operators/how-to/integrate-ci/pack/cli/pack_rebase/)
- `author`: Cloud Native Buildpacks project
- `date`: 5 Eylül 2026 doğrulaması
- `category`: `patch-management`, `container-runtime`, `release-engineering`
- `tags`: `cnb`, `pack-rebase`, `run-image`, `digest`, `canary`, `rollback`
- `summary`: Rebase, uygulama katmanlarını yeniden derlemeden run image'ı güncelleyebilir.
- `why_it_matters`: Kritik OS/JRE image yamalarının yayılma süresini azaltabilir.
- `java_spring_relevance`: Çok sayıda Spring Boot microservice aynı run image hattını paylaşabilir.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `yüksek`
- `opportunities`: hızlı fleet patch, düşük build maliyeti, ortak base-image yönetimi
- `risks`: smoke test olmadan promotion, eski attestation/SBOM, `--force` kötüye kullanımı
- `migration_notes`: rebase sonrasını yeni release olarak ele al; scan, SBOM, imza, health/TLS smoke test ve canary şartlarını pipeline'a ekle

### Bulgu 4

- `title`: App ve runtime SBOM'ları ayrı kaynaklardan birleşmeli
- `source`: [Spring Boot SBOM üretimi](https://docs.spring.io/spring-boot/how-to/build.html) | [Actuator SBOM](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.sbom) | [Paketo SBOM](https://paketo.io/docs/concepts/sbom/)
- `author`: Spring Boot team, Paketo Buildpacks project
- `date`: 5 Eylül 2026 doğrulaması
- `category`: `software-supply-chain`, `observability`, `compliance`
- `tags`: `cyclonedx`, `spdx`, `syft`, `actuator-sbom`, `runtime-sbom`, `sbom-diff`
- `summary`: Boot uygulama dependency'lerini, Paketo ise JVM ve image katmanlarını görünür kılan tamamlayıcı SBOM yüzeyleri sağlıyor.
- `why_it_matters`: Tek SBOM kaynağı container'ın gerçek risk yüzeyini eksik gösterebilir.
- `java_spring_relevance`: Java dependency CVE'leri ile JRE/OS CVE'leri farklı patch sahiplerine ve SLA'lara sahiptir.
- `actionability`: `hemen_aksiyon`
- `impact_level`: `çok-yüksek`
- `opportunities`: promotion gate, fleet inventory, hızlı etki analizi
- `risks`: endpoint'i public açmak, eski SBOM'u yeni digest ile eşlemek, yalnızca dosya varlığını kontrol etmek
- `migration_notes`: her image digest'i için app ve runtime SBOM'u immutable sakla; önceki production digest'iyle diff'i release kanıtına ekle

### Bulgu 5

- `title`: Minimal image seçimi boyut optimizasyonundan önce uyumluluk testidir
- `source`: [Alpaquita container images](https://bell-sw.com/alpaquita-containers/) | [BellSoft hardened image rehberi](https://docs.bell-sw.com/alpaquita-linux/latest/how-to/images-getting-started-guide/) | [Paketo stacks](https://paketo.io/docs/concepts/stacks/)
- `author`: BellSoft, Paketo Buildpacks project
- `date`: 5 Eylül 2026 doğrulaması
- `category`: `runtime-compatibility`, `container-hardening`, `operations`
- `tags`: `musl`, `glibc`, `distroless`, `jfr`, `jni`, `ca-certificates`, `debugging`
- `summary`: Tiny, minimal, distroless ve hardened tabanlar daha küçük yüzey sunabilir; ancak libc, CA, locale, native code ve operasyon araçlarını etkiler.
- `why_it_matters`: Image boyutu azalırken incident müdahalesi veya uygulama davranışı bozulabilir.
- `java_spring_relevance`: JVM agent'ları, JNI sürücüleri, TLS ve raporlama kütüphaneleri taban image ayrıntılarına duyarlıdır.
- `actionability`: `planlı_aksiyon`
- `impact_level`: `orta-yüksek`
- `opportunities`: daha az paket, daha hızlı transfer, daha dar saldırı yüzeyi
- `risks`: DNS/TLS/native kırılması, shell'e dayalı probe, JFR/jcmd kaybı
- `migration_notes`: production-benzeri pilotta uygulama açılışı dışında TLS, DNS, locale, JNI, agent ve dump senaryolarını doğrula; teşhis için ayrı debug image tasarla

### Bulgu 6

- `title`: 5 Eylül'de yeni core Spring yayını yok; image yönetişimi sürüm gürültüsünden daha değerli
- `source`: [Spring releases](https://spring.io/blog/category/releases) | [Spring Security advisories](https://spring.io/security/) | [Spring Projects](https://spring.io/projects)
- `author`: Spring teams
- `date`: 5 Eylül 2026
- `category`: `release-monitoring`, `signal-quality`
- `tags`: `spring-boot-4.1.1`, `spring-framework-7.0.9`, `spring-cloud-2025.1.3`, `no-new-advisory`
- `summary`: 3 Eylül raporundan sonra yeni Boot/Framework/Cloud GA veya yeni advisory bulunmadı.
- `why_it_matters`: Zayıf haber üretmek yerine mevcut platform yüzeyinden uygulanabilir karar çıkarmak daha değerlidir.
- `java_spring_relevance`: Ekipler acil version bump yerine image inventory ve pipeline kontrolü yapabilir.
- `actionability`: `bilgi`
- `impact_level`: `orta`
- `opportunities`: bakım penceresini supply-chain görünürlüğüne ayırmak
- `risks`: yayın yokken eski başlıkları tekrar etmek veya milestone'u GA gibi sunmak
- `migration_notes`: mevcut stabil hatları koru; yeni release/advisory çıkana kadar builder, run image ve SBOM envanterini tamamla

## Sonuç

Bugünün ana kararı yeni bir Spring veya JDK sürümüne geçmek değil, Spring Boot container'ını oluşturan zinciri görünür ve sahipli hale getirmektir. Builder ile run image digest'lerini sabitlemek, app ve runtime SBOM'larını birlikte diff etmek, rebase'i imzalı/testli bir release operasyonuna dönüştürmek ve minimal/hardened image'ı gerçek uyumluluk pilotundan geçirmek en yüksek getirili işlerdir. `Hardened` etiketi başlangıç noktasıdır; güvenlik sonucu ancak doğrulanmış içerik, hızlı patch, provenance ve çalışan operasyon testleriyle oluşur.
