---
tarih: 2026-04-26
rapor_tipi: gunluk_trend_radari
onceki_gun_product_hunt: 2026-04-25
uretim_zamani: 2026-04-26T09:07:01+0300
etiketler:
  - agent-memory-portability
  - enterprise-agent-governance
  - voice-agent-infrastructure
  - privacy-redaction-and-pqc
  - open-source-agent-access
  - skill-economy-cross-agent
  - vertical-ai-copilots
  - observability-for-agent-behavior
---

# Gunluk Trend Raporu - 26 Nisan 2026

## Kisa Ozet

- 25 Nisan 2026 Product Hunt leaderboard'u, AI urunlerinin genel-purpose chatbot katmanindan cikip dogrudan workflow yuzeylerine indigini gosteriyor: ZeroHuman ile "AI operator stack", Gemini Personal Intelligence ile kisiselemis context, Inro ile Instagram DM otomasyonu, Genspark ile Excel ici copilot, Euphony ile agent log gozlemi, Architecto ile cloud design review.
- 26 Nisan 2026 Hacker News akisi, capability anlatisi kadar guven, kalite ve kontrol ihtiyacini da buyutuyor. ChatGPT ile bir Erdos problemi cozulmesi ve bitmeyen yan projelerin AI ile yeniden canlandirilmasi ilgi toplarken, "Simulacrum of Knowledge Work", BrowserID geri donusu, GnuPG 2.5.19 ve iPhone'a sessiz app kurulumu tartismasi kalite proxy'leri ile platform guvenini yeniden gundeme tasiyor.
- GitHub Trending tarafinda acik kaynak talep dort cephede yogunlasiyor: ucretsiz/ucuz agent erisimi (`free-claude-code`), skill paketi ekosistemi (`skills`, `awesome-codex-skills`), agent-native gelistirme araclari (`ml-intern`, `Roo-Code`, `claude-code-templates`) ve cross-model/protocol shims (`ds2api`, `DeepEP`).
- Resmi bloglar ayni resmi kurumsal dille dogruluyor. OpenAI, Codex'i 4 milyon haftalik gelistiriciye ve enterprise rollout'a tasirken ayni anda Privacy Filter ile guvenlik katmani aciyor. GitHub, cloud agent'i secilebilir model, secici rollout, Jira baglami, data residency ve usage metrics ile yonetilen bir platforma cevriyor. Anthropic Opus 4.7 ile uzun kosan agent kalitesine yukleniyor. Inside Java ise JDK 27 ve PQC ile altyapinin hala belirleyici oldugunu hatirlatiyor.
- En net okuma su: pazar artik "en iyi model" yerine "en iyi agent isletim sistemi" ariyor. Kazanan katman memory, policy, workflow context, observability, security ve cost-control'u birlikte veren katman olacak.

## One Cikan Kaliplar

### 1. Memory ve context portability, agent urununun cekirdegine tasiniyor

Gemini Personal Intelligence Google uygulamalari ve gecmis sohbetleri okuyor; Clawdi memory, API key ve skills'i agent engine'den ayiriyor; Euphony sohbet ve Codex loglarini gozle gorulur hale getiriyor; OpenAI ise Codex'e memory ve surekli is akisi ekliyor. Deger artik tek seferlik prompt'ta degil, tekrar kullanilabilir baglamda birikiyor.

- Neden onemli: Model degistirmek kolaylasirken kurumlar ve guclu bireysel kullanicilar "baglam tasinabilirligi" ariyor.
- Firsat: Agent'lar arasi memory/skills/provenance tasiyan "context portability layer".

### 2. Voice, arayuz degil altyapi katmani haline geliyor

MiMo-V2.5 Voice ve Grok Voice Think Fast 1.0 birlikte okundugunda ses pazari "gosteri demosu"ndan "API-first workflow surface"e kayiyor. Biri acik kaynak ASR tarafinda cok dilli ve code-switching odakli, digeri kompleks multi-step ses agent'i vaad ediyor.

- Neden onemli: Voice agent kalite problemi artik yalnizca WER degil; latency, turn-taking, policy, loglama ve evaluation sorunu.
- Firsat: Voice agent eval, QA, compliance ve call replay katmani.

### 3. Enterprise agent rollout'u artik urunun kendisi

OpenAI'nin Codex Labs ve enterprise rollout anlatisi, GitHub'in per-org enablement, data residency, usage metrics ve Jira custom instruction akislariyla birebir ortusuyor. Anthropic'in task budget ve `/ultrareview` cizgisi de ayni yone gidiyor: agent kullanimi artik deneme degil, yonetilmesi gereken operasyon.

- Neden onemli: Agent adoption buyudukce admin control, audit, policy ve butce yonetimi product requirement oluyor.
- Firsat: Agent rollout console; org bazli enablement, budget policy, evaluation gate ve usage analytics.

### 4. Skill ekonomisi ve cross-agent standardizasyon hizlaniyor

GitHub `gh skill` ile skill dagitimini paket yonetimi kadar ciddi ele aliyor. GitHub Trending'de `mattpocock/skills`, `claude-code-templates` ve `awesome-codex-skills` ayni anda one cikiyor. Bu, promptun yerini daha tasinabilir "instruction bundles" ve execution recipes'in aldigini gosteriyor.

- Neden onemli: Ayni gorevi tekrarli ve denetlenebilir bicimde calistirmanin yolu skill standardizasyonundan geciyor.
- Firsat: Skill registry + approval + version pinning + provenance denetimi sunan enterprise store.

### 5. Open-source ve protocol shim dalgasi gucleniyor

`free-claude-code`, `ds2api`, `DeepEP`, `Roo-Code` ve `ml-intern` birlikte acik bir baski olusturuyor: kullanici hem daha ucuz erisim hem de vendor degistirme esnekligi istiyor. DeepSeek gunleriyle birlikte model protokollerini birbirine ceviren katmanlar daha degerli hale geliyor.

- Neden onemli: Vendor lock-in korkusu ile fiyat/limit baskisi ayni anda buyuyor.
- Firsat: Multi-model router, protocol translator ve eval replay katmani.

### 6. Security ve trust, prompt injection tartismasinin otesine geciyor

OpenAI Privacy Filter, GitHub data residency/FedRAMP, GnuPG 2.5.19, Inside Java PQC ve HN'deki sessiz iPhone app kurulumu ayni yone isaret ediyor: agent guvenligi yalnizca prompt hijacking degil; data siniri, runtime uyumlulugu, credential hijyeni ve platform guveni de bunun parcasi.

- Neden onemli: Agent'lar her yere baglandikca legal/compliance bariyeri UX sorunu olmaktan cikip deployment kilidine donusuyor.
- Firsat: PII redaction + secret hygiene + residency/policy + replay loglarini tek yerde toplayan trust stack.

### 7. Dikey copilot'lar, generic assistant'lardan daha hizli urunlesiyor

Inro, Genspark for Excel, Architecto ve GitHub Copilot for Jira iyice net bir sey soyluyor: genel asistan yerine yuzeye gomulu, o yuzeyin verisini bilen, o yuzeyin kurallarini uygulayan agent daha hizli deger uretiyor.

- Neden onemli: Genel model anlatisi doygunlasiyor; yatay kazanci dikey workflow bilgisi topluyor.
- Firsat: Review/approval katmani eklenmis Excel, CRM, Jira, architecture, DM ops copilot'lari.

## Product Hunt - 25 Nisan 2026 Leaderboard'da One Cikanlar

Kaynak:
Tikla: https://www.producthunt.com/leaderboard/daily/2026/4/25/all

### #1 ZeroHuman.

AI co-founder anlatisini daha moduler bir "operator stack"e ceviriyor: validate et, task yonet, kod yaz, viral dagitim yap. Solo founder ve mikro-ekip segmentinde "tek agent" yerine "agent paketi" satiliyor.

Tikla: https://www.producthunt.com/products/zerohuman
Site: https://zerohuman.inc

### #2 Gemini Personal Intelligence

Google uygulamalarindaki veri ve gecmis sohbetleri okuyarak cevap veren personalization layer. Kisisel work graph pazari yeniden gucleniyor.

Tikla: https://www.producthunt.com/products/gemini-personal-intelligence
Site: https://gemini.google

### #3 Inro

Instagram DM otomasyonu, lead qualification, satis ve follow-up'lari MCP/API entegrasyonlariyla tek urunde topluyor. Sosyal kanal otomasyonu artik sadece bot degil, AI-native revenue ops'e kayiyor.

Tikla: https://www.producthunt.com/products/inro
Site: https://www.inro.social

### #4 Clawdi

Memory, API key ve skills'i agent engine'den ayiran "best home for all AI agents" anlatisi, agent portability sorununu dogrudan hedefliyor.

Tikla: https://www.producthunt.com/products/clawdi
Site: https://clawdi.ai

### #6 MiMo-V2.5 Voice

Xiaomi'nin acik kaynak 8B ASR modeli; lehce, code-switching ve sarki sozleri gibi zor sinyallere oynuyor. Voice stack'in alt katmani hizla commoditize oluyor.

Tikla: https://www.producthunt.com/products/mimo-v2-5-voice
Site: https://platform.xiaomimimo.com

### #7 Grok Voice Think Fast 1.0

Ses agent'ini API urunu olarak konumluyor. Yalnizca "sesli asistan" degil, multi-step workflow agent'i olarak pazarlaniyor.

Tikla: https://www.producthunt.com/products/grok-voice-think-fast-1-0
Site: https://x.ai

### #9 Genspark for Excel

Excel'e gomulu formul, grafik, arastirma ve veri analizi yardimcisi. Spreadsheet, AI adoption icin en verimli dikey yuzeylerden biri olmaya devam ediyor.

Tikla: https://www.producthunt.com/products/genspark-for-excel
Site: https://www.genspark.ai

### #10 Euphony

AI sohbet verisi ve Codex loglarini tarayici icinde timeline'a ceviriyor. Agent observability artik niche degil; gelistirici akisina giriyor.

Tikla: https://www.producthunt.com/products/euphony-2
Site: https://openai.github.io

### #11 Architecto

Cloud architecture uretiyor, security/cost analizi yapiyor ve teknik dokumani cikartiyor. "Architecture review as software" cizgisi gucleniyor.

Tikla: https://www.producthunt.com/products/architecto
Site: https://architecto.dev

## Hacker News - 26 Nisan 2026 Akisindan Okunmasi Gerekenler

Kaynak:
Tikla: https://news.ycombinator.com/news

### Amateur armed with ChatGPT solves an Erdos problem

AI'nin arastirma yardimcisi rolunden "yeni yontem oneren problem cozuce" rolune kaydigi goruluyor. Ancak insan uzman filtresi hala zorunlu.

Tikla: https://www.scientificamerican.com/article/amateur-armed-with-chatgpt-vibe-maths-a-60-year-old-problem/

### OpenAI Privacy Filter

HN'de ilgi gormesi, guvenlik/privacy altyapisinin artik sadece enterprise procurement konusu olmadigini; gelistirici toplulugunun da aktif ilgi alani oldugunu gosteriyor.

Tikla: https://openai.com/index/introducing-openai-privacy-filter/

### DeepSeek-V4 on Day 0: From Fast Inference to Verified RL with SGLang and Miles

Acik model yarisi model kartindan ibaret degil; day-0 inference ve RL egitim stack'iyle birlikte geliyor. Serving ve training orchestration trendin kendisi haline geliyor.

Tikla: https://www.lmsys.org/blog/2026-04-25-deepseek-v4/

### It's OK to Use Coding Assistance Tools To Revive The Projects You Never Were Going To Finish

AI coding'in en guclu kullanimi bazen "net spec + yarim kalmis proje" senaryosu. Greenfield hype'in yaninda brownfield tamamlama pazari buyuyor.

Tikla: https://blog.matthewbrunelle.com/its-ok-to-use-coding-assistance-tools-to-revive-the-projects-you-never-were-going-to-finish/

### Simulacrum of Knowledge Work

Toplulukta output kalitesi icin yeni bir gerilim var: yuzeysel kalite proxy'leri bozulurken, dogruluk denetimi daha pahali hale geliyor. Bu dogrudan review, observability ve provenance urunlerine talep yaratir.

Tikla: https://blog.happyfellow.dev/simulacrum-of-knowledge-work/

### Reviving BrowserID in 2026

Federated identity ve lightweight login fikirleri geri donuyor. Kimlik katmani yeniden "developer ergonomics + privacy" ekseninde tartisiliyor.

Tikla: https://wakamoleguy.com/p/reviving-browserid-in-2026

### GnuPG 2.5.19 released

Crypto araclari hala aktif sekilde evriliyor; agent guvenligi konusulurken temel secure tooling cephesini ihmal etmemek gerekiyor.

Tikla: https://lists.gnupg.org/pipermail/gnupg-announce/2026q2/000504.html

### Tell HN: An app is silently installing itself on my iPhone every day

Platform trust tek bir bug ile asiniyor. Agent'larin daha fazla cihaz ve uygulamaya dokundugu dunyada "beklenmeyen aksiyon" korkusu buyuk bir adoption freni.

Tikla: https://news.ycombinator.com/item?id=47906253

## GitHub Trending - 26 Nisan 2026

Kaynak:
Tikla: https://github.com/trending?since=daily

### Alishahryar1/free-claude-code

4,007 yildiz/gun. Ucretsiz agent erisimi icin yogun bir golge talep oldugunu gosteriyor; lisanslama ve fiyatlama baskisi buyuk.

Tikla: https://github.com/Alishahryar1/free-claude-code

### mattpocock/skills

1,139 yildiz/gun. Skill klasorleri agent davranisinin yeni paket formu haline geliyor.

Tikla: https://github.com/mattpocock/skills

### huggingface/ml-intern

1,240 yildiz/gun. Paper oku, model egit, ship et zincirini agent'a devretme fikri ciddi ilgi cekiyor.

Tikla: https://github.com/huggingface/ml-intern

### davila7/claude-code-templates

Konfigure etme ve izleme ihtiyaci agent kullaniminda ikinci katman bir pazar dogurdugunu gosteriyor.

Tikla: https://github.com/davila7/claude-code-templates

### RooCodeInc/Roo-Code

"Editor icinde tam bir dev team" anlatisi, multi-agent gelistirme yuzeylerinin kalici oldugunu kanitliyor.

Tikla: https://github.com/RooCodeInc/Roo-Code

### CJackHwang/ds2api

DeepSeek istemcilerini evrensel API formatlarina ceviren middleware. Protocol translation katmani somut bir ihtiyac.

Tikla: https://github.com/CJackHwang/ds2api

### deepseek-ai/DeepEP

Expert-parallel iletisim kutuphanesi de tek basina trend olabiliyor. Model kadar inference altyapisi da rekabet alani.

Tikla: https://github.com/deepseek-ai/DeepEP

### ComposioHQ/awesome-codex-skills

Codex icin pratik skill kataloglarinin ayrica trend olmasi, agent adoption'in artik "workflow recipe" seviyesine indigini gosteriyor.

Tikla: https://github.com/ComposioHQ/awesome-codex-skills

### PostHog/posthog

Analytics, experimentation, CDP ve AI assistant'i birlestiren bir platformun yukselmesi, urun analitigi ile agent davranisinin daha yakin birlestigini gosteriyor.

Tikla: https://github.com/PostHog/posthog

## Tech Blog Sinyalleri

### OpenAI: Codex, enterprise-wide work OS'e donusuyor

21 Nisan tarihli "Scaling Codex to enterprises worldwide" yazisinda OpenAI, Codex'in iki hafta icinde 3 milyondan 4 milyon haftalik gelistiriciye ciktigini ve artik browser-based work, image generation, memory ve ongoing work gibi coding disi islere de kaydigini acikca soyluyor. 16 Nisan tarihli "Codex for (almost) everything" guncellemesi, background computer use, in-app browser, image generation ve 90+'tan fazla plugin ile bunu urun seviyesinde detaylandiriyor. 22 Nisan tarihli Privacy Filter ise bu genislemeye privacy altyapisini ekliyor.

Tikla: https://openai.com/index/scaling-codex-to-enterprises-worldwide/
Tikla: https://openai.com/index/codex-for-almost-everything/
Tikla: https://openai.com/index/introducing-openai-privacy-filter/

### GitHub: Agent'lar, yonetilen enterprise substrate'e cevriliyor

GitHub Nisan 2026 changelog'u tek tek incelendiginde resim net: 14 Nisan'da Claude ve Codex agent'lari icin model secimi geliyor; 15 Nisan'da Copilot cloud agent belirli organizasyonlara secici acilabiliyor; 13 Nisan'da US/EU data residency ve FedRAMP destekleri geliyor; 22 Nisan'da Jira ticket icinden custom agent, custom field ve custom instruction akisi ekleniyor; 16 Nisan'da `gh skill` cikiyor. Bu, agent'i "copilot ozelligi"nden "kurumsal calisma katmani"na ceviriyor.

Tikla: https://github.blog/changelog/2026-04-14-model-selection-for-claude-and-codex-agents-on-github-com/
Tikla: https://github.blog/changelog/2026-04-15-enable-copilot-cloud-agent-via-custom-properties/
Tikla: https://github.blog/changelog/2026-04-13-copilot-data-residency-in-us-eu-and-fedramp-compliance-now-available/
Tikla: https://github.blog/changelog/2026-04-22-github-copilot-for-jira-our-latest-enhancements/
Tikla: https://github.blog/changelog/2026-04-16-manage-agent-skills-with-github-cli/
Tikla: https://github.blog/changelog/2026-04-23-copilot-cloud-agent-fields-added-to-usage-metrics/

### Anthropic: Uzun kosan ve daha guvenilir agent execution

16 Nisan'daki Claude Opus 4.7 duyurusu, daha guclu multi-step task performansi, daha iyi uzun sureli reasoning, daha yuksek goruntu fidelity, file system-based memory gelisimi, `xhigh` effort, task budget public beta ve `/ultrareview` ile agent kalitesini "benchmark + runtime behavior" olarak beraber satiyor.

Tikla: https://www.anthropic.com/news/claude-opus-4-7

### Inside Java: AI rollout'un alttaki runtime gercegi

21 Nisan'da JDK 27 translation resource temizligi icin compatibility heads-up, 8 Nisan'da Java ve post-quantum cryptography vurgusu, 14 Nisan'da Java VS Code extension guncellemesi var. Agent urunleri ustte hizla degisse de enterprise deployment zemini hala runtime, migration ve crypto hazirligi.

Tikla: https://inside.java/
Tikla: https://inside.java/2026/04/21/quality-heads-up/
Tikla: https://inside.java/2026/04/08/javaone-post-quantum-cryptography/
Tikla: https://inside.java/2026/04/14/java-vscode-extension-update/

## Firsat Haritasi

### 1. Agent memory portability plane

Farkli agent host'lari arasinda memory, skills, secret referanslari ve provenance metadatasini tasiyan katman.

### 2. Voice agent QA ve compliance stack

ASR, latency, interruption, hallucination, policy ve call-level replay icin evaluation/approval urunu.

### 3. Enterprise agent rollout console

Secici enablement, butce, approval gate, review mode, usage analytics ve regional policy'leri tek panelde toplayan yonetim katmani.

### 4. Skill registry ve provenance store

Skill paketlerini version pinning, approval, risk scoring ve audit trail ile sunan kurumsal katalog.

### 5. Agent observability ve behavior drift urunu

Euphony benzeri timeline + replay + diff + "davranis degisti mi?" analizi sunan kalite/governance katmani.

### 6. Vertical workflow copilots + review layer

Excel, Instagram DM, architecture design ve Jira gibi yuzeylere gomulu copilot'larin ustune human approval, policy check ve ROI olcumu ekleyen urun.

### 7. Java AI readiness denetimi

JDK 27, PQC, locale davranisi, secret hygiene ve runtime diagnostics hazirligini olcen enterprise paketi.

## Izlenecek Zayif Sinyaller

- Agent loglarini tarayicida timeline'a ceviren araclar, yakin vadede default debug surface olabilir.
- Spreadsheet icine gomulu AI yardimcilari, ERP/finance/ops dunyasina agent adoption'i beklenenden hizli tasiyabilir.
- Skill standardizasyonu, prompt engineering'in yerini kademeli olarak "workflow packaging"e birakiyor.
- Voice tarafinda acik kaynak model kalitesi artarken asil marj, eval/compliance/orchestration katmaninda olabilir.
- "Beklenmeyen aksiyon" korkusu, agent UX'inde trust preview, dry-run ve replay arayuzlerini zorunlu hale getirebilir.
- Enterprise AI rollout'larinda data residency ve regional model availability, capability kadar belirleyici bir satis argumani oluyor.

## Kaynaklar

- https://www.producthunt.com/leaderboard/daily/2026/4/25/all
- https://www.producthunt.com/products/zerohuman
- https://www.producthunt.com/products/gemini-personal-intelligence
- https://www.producthunt.com/products/inro
- https://www.producthunt.com/products/clawdi
- https://www.producthunt.com/products/mimo-v2-5-voice
- https://www.producthunt.com/products/grok-voice-think-fast-1-0
- https://www.producthunt.com/products/genspark-for-excel
- https://www.producthunt.com/products/euphony-2
- https://www.producthunt.com/products/architecto
- https://news.ycombinator.com/news
- https://www.scientificamerican.com/article/amateur-armed-with-chatgpt-vibe-maths-a-60-year-old-problem/
- https://www.lmsys.org/blog/2026-04-25-deepseek-v4/
- https://blog.matthewbrunelle.com/its-ok-to-use-coding-assistance-tools-to-revive-the-projects-you-never-were-going-to-finish/
- https://blog.happyfellow.dev/simulacrum-of-knowledge-work/
- https://wakamoleguy.com/p/reviving-browserid-in-2026
- https://lists.gnupg.org/pipermail/gnupg-announce/2026q2/000504.html
- https://news.ycombinator.com/item?id=47906253
- https://github.com/trending?since=daily
- https://github.com/Alishahryar1/free-claude-code
- https://github.com/mattpocock/skills
- https://github.com/huggingface/ml-intern
- https://github.com/davila7/claude-code-templates
- https://github.com/RooCodeInc/Roo-Code
- https://github.com/CJackHwang/ds2api
- https://github.com/deepseek-ai/DeepEP
- https://github.com/ComposioHQ/awesome-codex-skills
- https://github.com/PostHog/posthog
- https://openai.com/index/scaling-codex-to-enterprises-worldwide/
- https://openai.com/index/codex-for-almost-everything/
- https://openai.com/index/introducing-openai-privacy-filter/
- https://github.blog/changelog/2026-04-14-model-selection-for-claude-and-codex-agents-on-github-com/
- https://github.blog/changelog/2026-04-15-enable-copilot-cloud-agent-via-custom-properties/
- https://github.blog/changelog/2026-04-13-copilot-data-residency-in-us-eu-and-fedramp-compliance-now-available/
- https://github.blog/changelog/2026-04-22-github-copilot-for-jira-our-latest-enhancements/
- https://github.blog/changelog/2026-04-16-manage-agent-skills-with-github-cli/
- https://github.blog/changelog/2026-04-23-copilot-cloud-agent-fields-added-to-usage-metrics/
- https://www.anthropic.com/news/claude-opus-4-7
- https://inside.java/
- https://inside.java/2026/04/21/quality-heads-up/
- https://inside.java/2026/04/08/javaone-post-quantum-cryptography/
- https://inside.java/2026/04/14/java-vscode-extension-update/

## Aranabilir Hafiza Kaydi

- Tarih: 2026-04-26
- Ana trendler: agent-memory-portability, enterprise-agent-governance, voice-agent-infrastructure, privacy-redaction-and-pqc, open-source-agent-access, skill-economy-cross-agent, vertical-ai-copilots, observability-for-agent-behavior.
- Product Hunt sinyalleri: ZeroHuman, Gemini Personal Intelligence, Inro, Clawdi, MiMo-V2.5 Voice, Grok Voice Think Fast 1.0, Genspark for Excel, Euphony, Architecto.
- Hacker News sinyalleri: AI ile Erdos problemi cozumu, OpenAI Privacy Filter, DeepSeek-V4 day-0 inference/RL stack'i, coding assistance ile yarim kalmis proje tamamlama, output kalite/proxy tartismasi, BrowserID geri donusu, GnuPG 2.5.19, iPhone silent-install guven sorunu.
- GitHub trending sinyalleri: free-claude-code, skills, ml-intern, claude-code-templates, Roo-Code, ds2api, DeepEP, awesome-codex-skills, posthog.
- Blog sinyalleri: OpenAI Codex enterprise rollout + almost everything + Privacy Filter, GitHub model selection + selective enablement + data residency + Jira custom agents + gh skill + usage metrics, Anthropic Opus 4.7, Inside Java JDK 27 + PQC.
- En guclu okuma: Kazanan katman model degil; memory, policy, workflow context, observability ve guvenligi birlestiren agent isletim sistemi olacak.
- Firsatlar: agent memory portability plane, voice QA/compliance stack, enterprise rollout console, skill registry, agent observability urunu, vertical copilots + review layer, Java AI readiness denetimi.
