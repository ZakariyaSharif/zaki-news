const novemberMarketStories=[];
function novemberStory(category,image,sources,en,so,date='2026-11-21T12:00:00.000Z'){
  for(const [language,entry,other] of [['en',en,so],['so',so,en]]){
    const [slug,title,summary,body]=entry;
    novemberMarketStories.push({slug,title,summary,category,language,translationSlug:other[0],author:'Zaki News',image:'/images/'+image+'.webp',image_alt:'',published_at:date,updated_at:date,body:body+'\n\n## '+(language==='en'?'Sources':'Ilaha')+'\n\n'+sources.map(([label,url])=>'['+label+']('+url+')').join(' · ')});
  }
}
novemberStory('Stocks','anthropic-debut',[
  ['Reuters · IPO','https://www.investing.com/news/stock-market-news/anthropics-blockbuster-debut-tests-wall-streets-faith-in-ai-boom-5041688'],
  ['MarketWatch · Friday close','https://www.marketwatch.com/story/chip-stocks-see-2-3-trillion-weekly-wipeout-as-panic-grips-the-ai-trade-371f2f03']
],['anthropic-ipo-first-week','Anthropic ends its first week at $88.91 after opening above $111','Two investors could have bought Anthropic on its first day and ended Friday with very different returns.',`Anthropic shares closed Friday, November 20, at $88.91. That left the AI developer above its $83 offering price, even after a sharp reversal from Thursday’s opening trade of $111.50. The stock had finished its first session at $97.17.

## One IPO, two entry prices

Some investors received shares in the offering before public trading began. Someone allocated ten shares at $83 paid $830. Those shares were worth $889.10 at Friday’s close, a gain of $59.10 before costs. A buyer who picked up the same ten shares at Thursday’s opening price paid $1,115 and ended Friday down $225.90.

That gap explains how headlines about a successful offering and losses for early buyers can both describe the same debut. The offering price measures the terms on which the company sold shares. The opening price records what buyers and sellers agreed once those shares began trading on Nasdaq.`],
['anthropic-ipo-usbuucii-koowaad','Saamiga Anthropic oo usbuuciisii koowaad ku xiray $88.91','Maalgashadihii saamiga ku helay qiimaha IPO-ga iyo kii iibsaday markii Nasdaq furmay waxay Jimcihii heleen natiijooyin kala duwan.',`Saamiga shirkadda sirdoonka macmalka ah ee Anthropic ayaa Jimcihii, 20 Nofeembar, ku xiray $88.91. Shirkaddu saamiga waxay markii hore ku bixisay $83. Markii ganacsigu Nasdaq ka billowday Khamiistii, iibkii ugu horreeyay wuxuu ku dhacay $111.50. Isla maalintaas saamigu wuxuu ku xiray $97.17.

## Farqiga uu sameeyay waqtiga iibsigu

Qofkii qoondada IPO-ga ka helay toban saami wuxuu bixiyay $830. Jimcihii waxay u joogeen $889.10, faa’iido dhan $59.10 ka hor khidmadaha. Qofkii isla tobankaas saami iibsaday markii suuqu furmay wuxuu bixiyay $1,115. Jimcihii qiimahoodu wuxuu ka yaraa lacagtii uu bixiyay $225.90.

Sidaas darteed, marka aad akhrido in saamigu kor u kacay tan iyo IPO-ga, eeg qiimaha laga soo bilaabay xisaabta. Qiimihii shirkaddu ku bixisay saamiyada iyo kii ay dadweynuhu suuqa ka heleen waxaa u dhexeeyay $28.50 saamigiiba.`]);
novemberStory('Markets','gold-session',[
  ['Kitco · Metals report','https://www.kitco.com/news/article/2026-11-20/gold-falls-toward-3500-silver-slides-stock-markets-enter-correction'],
  ['Corgano · November 20 prices','https://corgano.com/evening-market-recap-2026-11-20/']
],['gold-nears-3500','Gold approaches $3,500 as selling spreads beyond stocks','Gold touched $3,503.49 an ounce on Friday. Silver suffered a steeper percentage loss.',`Gold came within $3.49 of the $3,500 mark on November 20. By 5:30 p.m. New York time, Corgano put the metal at $3,534.42 a troy ounce, down 2.45% from the previous New York reference close. A buyer checking the evening quote would have seen a price about $31 above the day’s low.

## Why gold and equities fell together

Kitco reported that expectations of further Federal Reserve rate increases weighed on precious metals as technology shares sold off. Gold pays no interest. When investors expect cash or short-term debt to offer higher returns, holding bullion can become less attractive. That helps explain the pressure, though a daily price series cannot identify any one seller’s motive.

Silver added perspective. At the same evening observation it was $41.20 an ounce, down 3.81%. Both metals lost ground, but the percentage decline in silver was more than a full point larger.`],
['dahabka-3500','Dahabka oo ku dhowaaday $3,500 halkii wiqiyad','Qiimaha dahabku Jimcihii wuxuu gaaray $3,503.49. Qalinka ayaa boqolkiiba ahaan ka khasaare badnaa.',`Jimcihii 20 Nofeembar, dahabka waxaa heerka $3,500 u jiray $3.49 oo keliya halkii wiqiyad ee troy. Markii New York ay ahayd 5:30 galabnimo, Corgano waxay qiimaha ku diiwaangelisay $3,534.42. Wuxuu 2.45% ka hooseeyay xiritaankii tixraaca ee maalintii hore, inkastoo uu markaas qiyaastii $31 ka soo kacay meeshii ugu hooseysay maalintaas.

## Maxaa cadaadis saaray dahabka?

Kitco waxay sheegtay in filashada koror kale oo ku yimaadda dulsaarka Maraykanka ay culays saartay biraha qaaliga ah xilli saamiyada tignoolajiyaduna hoos u dhacayeen. Dahabka la hayo dulsaar kama soo baxo. Marka maalgashaduhu filayo inuu dakhli badan ka helayo deyn muddo gaaban ah, waxaa kordha waxa uu dhaafayo haddii uu dahab haysto.

Isla waqtigaas qalinku wuxuu joogay $41.20 halkii wiqiyad, isaga oo lumiyay 3.81%. Labada birba way jabeen, balse qalinka ayaa boqolkiiba ahaan hoos u dhacay in ka badan hal dhibic oo dheeraad ah.`]);
novemberStory('Bitcoin','btc-session',[
  ['Corgano · Friday evening market data','https://corgano.com/evening-market-recap-2026-11-20/'],
  ['Amber Markets · Friday morning report','https://ambermarkets.com/daily-report/nov-20th-2026/']
],['bitcoin-below-60000','Bitcoin slips below $60,000 in Friday trading','An evening market reading put BTC at $59,011 after a decline of nearly 5% over 24 hours.',`Bitcoin was trading around $62,000 in Amber Markets’ early report on November 20. By 5:30 p.m. in New York, Corgano recorded $59,011 per coin. The evening reading put Bitcoin $989 below the round number that traders had been watching.

## Two ways to measure the fall

Measured from 7 a.m. in New York, Bitcoin lost $2,720 by the evening reading. Measured over the full 24 hours ending at that same moment, it lost $3,085, or 4.97%. The ending price is identical in both calculations. The difference comes from where Bitcoin traded at the start of each window.

For readers following the move over the weekend, the timestamp matters as much as the headline. Bitcoin keeps trading after the US stock market closes. Friday’s $59,011 is a dated observation that can be compared with a later quote, even if the live price has already crossed $60,000 again.`],
['bitcoin-ka-hooseeya-60000','Bitcoin oo Jimcihii hoos uga dhacay $60,000','Xogtii fiidkii waxay BTC ku qiyaastay $59,011, kaddib hoos u dhac ku dhow 5% muddo 24 saac ah.',`Warbixintii hore ee Amber Markets ee 20 Nofeembar waxay Bitcoin ku sheegtay qiyaastii $62,000. Markii New York ay ahayd 5:30 galabnimo, Corgano waxay halkii BTC ku diiwaangelisay $59,011. Taasi waxay $989 ka hooseysay heerka $60,000.

## Intee ayuu dhab ahaan lumiyay?

Laga bilaabo toddobadii subaxnimo ee New York ilaa waqtigaas galabtii, qiimuhu wuxuu lumiyay $2,720. Haddii la barbar dhigo qiimihii isla waqtigaas maalintii ka horreysay, khasaaruhu wuxuu ahaa $3,085, oo u dhiganta 4.97%. Labada xisaaboodba waxay ku dhammaanayaan $59,011. Waxa kala duwaya waa waqtiga iyo qiimaha laga bilaabay cabbirka.

Arrintan waxay muhiim u tahay qofka dabagal ku haya suuqa dhammaadka usbuuca. Ganacsiga Bitcoin wuu sii socdaa marka suuqyada saamiyada Maraykanku xirmaan. Haddii aad qiimaha ku eegto jaantus, barbar dhig isla saacaddii iyo isla muddadii lagu cabbiray hoos u dhaca.`]);
novemberStory('Stocks','nasdaq-session',[
  ['Reuters · US market close','https://www.fidelity.com/news/article/top-news/202611200536RTRSNEWSCOMBINED_KCN3WV14F-OUSBS_1'],
  ['Reuters · Technology shares','https://www.reuters.com/business/view-nasdaq-plunges-5-day-after-anthropic-debut-investors-still-believe-ai-2026-11-20/']
],['nasdaq-friday-selloff','Nasdaq drops 5.28% as chip shares lead Wall Street lower','The sell-off reached all three major US indexes. The technology-heavy Nasdaq took the largest hit.',`The Nasdaq Composite lost 1,261.47 points on Friday, November 20, closing at 22,617.73. The S&P 500 fell 3.70% to 6,910.42, while the Dow Jones Industrial Average shed 1.93% to finish at 48,147.33, according to Reuters’ closing report.

## Where the damage was concentrated

The Philadelphia semiconductor index lost about 11% on Friday, roughly twice the Nasdaq’s percentage decline. Chipmakers’ larger losses help explain why the three headline indexes tell different stories about the same trading day. An investor tracking the Dow experienced a much smaller benchmark decline than one tracking the Nasdaq.

Friday also marked the S&P 500’s seventh consecutive down session. By the close, both the Dow and the S&P stood more than 10% below their respective record closing highs. That is the drawdown traders call a correction. The 10% figure measures the accumulated loss since each peak, while Friday’s daily figures measure just one session.`],
['nasdaq-hoos-u-dhac','Nasdaq oo lumiyay 5.28% iyadoo saamiyada shirkadaha chip-ku horseedeen hoos u dhaca','Saddexda tusmo ee waaweyn ee Maraykanku way wada dhaceen. Nasdaq ayaa ugu khasaare badnaa.',`Tusmada Nasdaq Composite waxay Jimcihii 20 Nofeembar lumisay 1,261.47 dhibcood, iyadoo ku xirtay 22,617.73. Sida ay Reuters ku sheegtay warbixintii xiritaanka, S&P 500 wuxuu dhacay 3.70% oo ku xiray 6,910.42. Dow Jones wuxuu lumiyay 1.93%, wuxuuna ku dhammaaday 48,147.33.

## Shirkadahee ayaa ugu khasaare badnaa?

Tusmada Philadelphia ee shirkadaha sameeya chip-yada ayaa Jimcihii dhacday qiyaastii 11%. Hoos u dhacaasi wuxuu ku dhowaad laba jibbaar ka badnaa kii Nasdaq boqolkiiba ahaan. Qofka la socday Dow Jones wuxuu sidaas suuqa uga arkayay hoos u dhac aad uga yar kii uu arkayay qofka la socday saamiyada tignoolajiyada.

S&P 500 waxaa u ahayd maalintii toddobaad oo xiriir ah ee uu hoos u xirmo. Dow iyo S&P labaduba waxay hadda in ka badan 10% ka hooseeyeen heerarkoodii xiritaan ee ugu sarreeyay. Marka laga hadlayo sixitaanka suuqa, boqolleydaas waxaa laga xisaabiyaa heerkii ugu sarreeyay. Khasaaraha Jimcaha keliya wuxuu ka bilaabmaa xiritaankii Khamiista.`]);
novemberStory('Economy','uk-retail',[
  ['Office for National Statistics · October retail sales','https://www.ons.gov.uk/businessindustryandtrade/retailindustry/bulletins/retailsales/october2026'],
  ['ONS · Release details','https://www.ons.gov.uk/releases/retailsalesgreatbritainoctober2026']
],['britain-october-retail-sales','British retail sales rebound as shoppers stock up on pantry staples','October sales volumes rose 0.7%. Supermarkets reported stronger demand for tinned food and long-life milk.',`Shoppers in Great Britain bought more goods in October, reversing a September decline. The Office for National Statistics published its first October estimate on November 20. Sales volumes rose 0.7% from the previous month, with food retailers reporting stronger purchases of products that households can store.

## What went into the shopping basket

Supermarkets told the ONS that customers bought more canned goods and long-life milk following government advice. Clothing shops and art galleries also reported gains. The volume measure adjusts for changes in prices, so a higher reading means people bought a greater quantity of goods.

The monthly picture is uneven. September’s fall was revised to 0.6%, compared with an initial estimate of 0.4%. Looking across three months smooths some of those swings. Volumes in August through October rose 0.4% compared with May through July. That distinction matters when interpreting stocking up: buying extra tins this month can bring forward purchases a household would otherwise have made next month.`],
['iibka-dukaamada-britain-oktoobar','Iibka dukaamada Britain oo soo kabtay iyadoo qoysasku kaydsadeen raashin','Tirada badeecadaha la iibsaday waxay Oktoobar kordhay 0.7%. Suuqyada waaweyn ayaa sheegay in la dalbaday cunto qasacadaysan iyo caano muddo dheer jira.',`Macaamiisha Great Britain waxay Oktoobar iibsadeen badeecooyin ka badan kuwii Sebtembar. Xafiiska Tirakoobka Qaranka ee ONS ayaa 20 Nofeembar soo saaray qiyaastiisii koowaad ee bisha. Tirada badeecadaha la iibsaday waxay bishii hore ka korortay 0.7%, kaddib hoos u dhac Sebtembar dhacay.

## Maxay qoysasku soo iibsadeen?

Suuqyada waaweyn ayaa ONS u sheegay in dadku kordhiyeen iibsiga cuntada qasacadaysan iyo caanaha muddo dheer la kaydin karo, kaddib talo ay dowladdu bixisay. Dukaamada dharka iyo goobaha farshaxanka lagu iibiyo iyaguna koror ayay sheegeen. Cabbirkani wuxuu tixgeliyaa isbeddelka qiimaha si loo ogaado tirada badeecadaha dhab ahaan la iibsaday.

ONS waxay sidoo kale dib u saxday qiyaastii Sebtembar. Hoos u dhacii markii hore lagu sheegay 0.4% wuxuu noqday 0.6%. Marka saddex bilood la isu geeyo, iibka Agoosto ilaa Oktoobar wuxuu 0.4% ka sarreeyay kii May ilaa Luulyo. Qoys maanta raashin badan kaydsaday waxaa dhici karta in uu bisha soo socota wax ka yar soo iibsado. Sidaas awgeed xogta dhowr bilood ayaa sawir ka buuxa bixinaysa.`]);

novemberStory('Central Banks','ecb-october-account',[
  ['ECB · Monetary policy accounts','https://www.ecb.europa.eu/press/accounts/html/index.en.html'],
  ['ECB · Monetary policy statements','https://www.ecb.europa.eu/press/press_conference/monetary-policy-statement/html/index.en.html']
],['ecb-october-account','What to look for in the ECB’s November 26 meeting account','Thursday’s release will explain the discussion behind the October decision on euro-area monetary policy.',`The European Central Bank is scheduled to publish its account of the October 28–29 Governing Council meeting on November 26. The decision itself was announced on October 29. Thursday’s document gives readers a second look at how policymakers reached it.

## How to read the two documents together

Start with the October statement to see what the Council decided. Then look in the account for the evidence members weighed: did they put more emphasis on recent prices or on the outlook for inflation? A risk discussed in October and a commitment to change interest rates at the next meeting are two different things. The date on the account tells you when it became public; the meeting dates tell you which information policymakers had at the time.`],
['ecb-dooddii-oktoobar','Maxaa laga eegi karaa warbixinta ECB ee 26-ka Nofeembar?','Khamiista ayaa la filayaa faahfaahinta doodda ka horreysay go’aankii siyaasadda lacagta ee Oktoobar.',`Bangiga Dhexe ee Yurub (ECB) ayaa 26-ka Nofeembar lagu wadaa inuu daabaco warbixinta kulankii golihiisa ee 28-kii iyo 29-kii Oktoobar. Go’aanka waxaa la shaaciyey 29-kii Oktoobar. Warbixinta Khamiistu waxay faahfaahinaysaa sida xubnuhu ku gaareen go’aankaas.

## Sida loo wada akhriyo labada qoraal

Marka hore eeg bayaankii Oktoobar si aad u ogaato waxa la go’aamiyey. Marka xigta, ka eeg warbixinta waxa xubnuhu miisaanka siiyeen. Ma qiimayaashii dhowaan la diiwaangeliyey baa doodda ku cuslaa, mise saadaasha sicir-bararka? Haddii xubin ka digtay khatar, taas keligeed lagama soo saari karo in goluhu ballanqaaday inuu dulsaarka beddeli doono. Taariikhda kulanka ayaa kuu sheegaysa xogta markaas miiska saarnayd.`],'2026-11-22T12:00:00Z');

novemberStory('Tech','zk-batch-proof',[['Ethereum.org · ZK-rollups','https://ethereum.org/developers/docs/scaling/zk-rollups/']],
['ethereum-batch-proof','How Ethereum checks a batch of payments with one proof','A ZK-rollup processes transfers together and sends Ethereum a compact proof of the resulting balances.',`Imagine three people sending tokens to each other. Each transfer changes at least two balances. A ZK-rollup can calculate the transfers outside Ethereum’s main chain, group them into a batch and submit the result with a cryptographic proof.

## What the proof establishes

A verifier contract on Ethereum checks the proof against the rules for updating balances. For example, a transfer cannot spend more tokens than the sender holds. If the proposed result breaks those rules, it cannot pass that check with a valid proof.

Batching spreads the cost of verification across multiple transfers. Users still have fees, and the final cost depends partly on how much data the rollup must publish to Ethereum. The practical difference is that the main chain can verify the batch without redoing every calculation.`],
['ethereum-caddeynta-wareejinta','Sidee Ethereum hal caddeyn ugu hubiyaa wareejinno badan?','ZK-rollup wuxuu isku daraa wareejinno badan, dabadeedna Ethereum ayuu u diraa caddeyn muujinaysa in xisaabtu sax tahay.',`Bal qiyaas saddex qof oo isu diraya tokenno. Wareejin kasta waxay beddeshaa ugu yaraan laba haraaga xisaabeed. Habka ZK-rollup wuxuu wareejinnada ku xisaabiyaa meel ka baxsan shabakadda weyn ee Ethereum, kaddibna natiijada ayuu u diraa shabakadda isagoo raacinaya caddeyn xisaabeed.

## Maxay caddeyntu xaqiijisaa?

Barnaamij ku shaqeeya Ethereum ayaa hubiya in haraagyada cusub ay waafaqsan yihiin xeerarka. Tusaale ahaan, qofku ma diri karo tokenno ka badan inta uu haysto. Natiijo jebinaysa xeerkaas ma heli karto caddeyn sax ah oo ka gudubta hubinta.

Kharashka hubinta waxaa wadaaga wareejinnada la isku geeyey. Isticmaaluhu weli khidmad ayuu bixiyaa, waxaana qiimaheeda saameeya inta xog ee lagu daabacayo Ethereum. Faa’iidada ayaa ah in shabakadda weyn ay hubin karto natiijada iyada oo aan dib u samayn xisaab kasta.`],'2026-11-22T12:00:00Z');

novemberStory('Politics','mica-provider-register',[['ESMA · MiCA and crypto service providers','https://www.esma.europa.eu/sites/default/files/2026-06/ESMA75-113276571-1710_Public_Statement_MiCA_transitional_period_ends.pdf']],
['eu-crypto-provider-register','How to check a crypto platform’s EU authorisation','The EU securities regulator points customers to its MiCA register to verify the company behind a trading app.',`When a crypto platform says it is authorised in the European Union, the first detail to check is the legal name of the company serving you. A brand on an app can be shared by several companies. The terms of service or account agreement should identify which one holds your account.

## What to compare

The European Securities and Markets Authority (ESMA) directs customers to its MiCA register to verify a provider’s authorisation. Search for the legal entity and compare its details and authorised services with those offered to you. If the names differ, ask the provider to identify the relevant entry before relying on its claim.

The register answers a specific question about a service provider. It does not establish that a token listed by that provider is safe or that its price will hold.`],
['ruqsadda-shirkadaha-crypto-yurub','Sidee loo hubiyaa ruqsadda shirkad crypto oo Yurub ka shaqaysa?','Hay’adda ESMA waxay macaamiisha u tilmaamaysaa diiwaanka MiCA si ay u hubiyaan shirkadda maamusha akoonkooda.',`Marka madal crypto sheegato inay ruqsad ku leedahay Midowga Yurub, ka bilow magaca sharciyeed ee shirkadda aad heshiiska la gashay. Magaca ku qoran app-ka waxaa wada isticmaali kara shirkado kala duwan. Ka eeg heshiiska akoonka ama shuruudaha adeegga shirkadda adiga kuu adeegta.

## Maxaa la isbarbardhigayaa?

Hay’adda Yurub ee kormeerta suuqyada maaliyadda (ESMA) waxay macaamiisha u tilmaamaysaa diiwaanka MiCA. Raadi magaca shirkadda, dabadeed isbarbardhig faahfaahinteeda iyo adeegyada ay ruqsadda u haysato iyo kuwa laguu soo bandhigay. Haddii magacyadu kala duwan yihiin, weydii shirkadda inay ku tusto halka ay diiwaanka kaga jirto.

Diiwaanku wuxuu ka jawaabaa su’aal ku saabsan ruqsadda adeeg-bixiyaha. Ruqsaddu ma dammaanadqaaddo in token kasta oo madashu iibiso uu ammaan yahay ama in qiimihiisu joogto ahaan doono.`],'2026-11-22T12:00:00Z');

novemberStory('Bitcoin','btc-rebound-23',[
  ['CoinDesk','https://www.coindesk.com/markets/2026/11/23/bitcoin-rebounds-from-2-year-low-as-wall-street-futures-recover'],
  ['Barron’s','https://www.barrons.com/articles/bitcoin-prices-crypto-stock-strategy-robinhood-e5388148']
],['bitcoin-rebound-63380','Bitcoin rebounds from $55,500 to $63,380','Bitcoin recovered nearly $7,900 from its weekend low.','Bitcoin rose to $63,380 during US trading on Monday after touching roughly $55,500 on Saturday, its lowest level in more than two years.\n\nSpot bitcoin funds provide another measure of demand. Nearly $3 billion had left those ETFs in November, according to CoinDesk. Investors are watching whether the rebound in price brings buyers back to the funds.\n\n## Measuring the bounce\n\nFrom Saturday’s low to Monday’s reported price, Bitcoin gained about 14.2%. The starting point matters. A reader who saw a smaller 24-hour percentage on a trading screen could still be looking at the same rally. A rolling daily return uses the price exactly one day earlier, while the weekend comparison starts at the lowest trade reported on Saturday.\n\nETF flows answer a different question. The nearly $3 billion figure covers money leaving funds over several weeks. Monday’s price records a moment in trading. One way to follow the recovery is to compare each trading day’s net ETF deposits or withdrawals with the price move over that same day. That would show whether demand through those funds strengthened alongside the rebound.'],
['bitcoin-dhaafay-63000','Bitcoin oo ka soo kacay $55,500, mar kalena dhaafay $63,000','Bitcoin wuxuu ku dhowaad $7,900 ka soo kacay halkii uu Sabtidii joogay.','Bitcoin ayaa Isniintii ka soo kabtay hoos u dhacii dhammaadka toddobaadka. Sabtidii, qiimuhu wuxuu gaaray ku dhowaad $55,500, heerkii ugu hooseeyay in ka badan laba sano. Isniintii, intii uu socday ganacsiga Maraykanku, Bitcoin wuxuu gaaray $63,380.\n\nWaxa hadda indhaha lagu hayaa lacagta gasha ama ka baxda sanduuqyada Maraykanka ee Bitcoin si toos ah u haysta. Sida ay sheegtay CoinDesk, intii lagu jiray Nofeembar waxaa sanduuqyadan ka baxay ku dhowaad $3 bilyan. Maalgashadayaashu waxay eegayaan in soo kabashada qiimuhu ay iibsadayaasha dib ugu soo celin doonto sanduuqyadan.\n\n## Sidee loo cabbiraa soo kabashada?\n\nMarka laga soo xisaabiyo qiimihii ugu hooseeyay Sabtidii, kororku wuxuu ahaa qiyaastii 14.2%. Haddii aad isla maalintaas shaashadda suuqa ku aragtay boqolkiiba intaas ka yar, eeg saacadda xisaabtu ka bilaabatay. Isbeddelka 24-ka saac wuxuu ku salaysan yahay qiimihii jiray maalin ka hor, halka 14.2% laga soo tiriyay hooskii Sabtida.\n\nLacagta ka baxday sanduuqyada Bitcoin waxay iftiiminaysaa dhinac kale. Ku dhowaad $3 bilyan ayaa ka baxay muddo toddobaadyo ah, halka $63,380 uu ahaa qiime la arkay xilli gaar ah Isniintii. Si loo ogaado in iibsadayaasha sanduuqyadu qayb ka ahaayeen soo kabashada, waxaa habboon in lacagta maalin kasta gashay ama baxday lala barbar dhigo isbeddelka qiimaha ee isla maalintaas.'],'2026-11-23T18:00:00.000Z');
novemberStory('Stocks','nvda-return-23',[
 ['Nvidia','https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Board-Reinstates-Jensen-Huang-as-President-CEO-and-Board-Director/default.aspx'],
 ['Reuters','https://www.reuters.com/business/wall-street-futures-rebound-after-rough-week-ai-linked-shares-2026-11-23/']
],['nvidia-huang-returns','Nvidia shares surge as Jensen Huang returns as CEO','Directors voted unanimously to reinstate Huang, effective immediately.','Nvidia reinstated Jensen Huang as chief executive and a director on Monday. Its shares jumped 32.2% during US trading.\n\nThe rally spread to other companies supplying the AI industry. CoreWeave rose 21.5%. At 12:02 p.m. in New York, the Nasdaq Composite was up 6.69% and the S&P 500 had gained 4.85%.\n\n## Why the rally spread beyond Nvidia\n\nNvidia’s chips and CoreWeave’s computing services sit at different points in the same business. A company building an AI model can rent computing capacity from a provider that has invested in chips. That connection helps explain why investors watching Nvidia’s leadership announcement were also watching the companies that buy and operate its hardware.\n\nThe size of the moves varied sharply. For every $100 of Nvidia shares held before a 32.2% rise, the quoted value reached about $132.20. The equivalent move in CoreWeave took $100 to $121.50. The index figures describe broader groups of companies and were recorded during the session. Readers comparing them with closing prices should use the same observation time.'],
['nvidia-huang-soo-laabtay','Jensen Huang oo ku soo laabtay hoggaanka Nvidia, saamiguna kacay 32%','Guddiga Nvidia ayaa si wadajir ah ugu codeeyay in Huang dib loogu magacaabo madaxa fulinta.','Guddiga maamulka Nvidia ayaa Isniintii dib ugu magacaabay Jensen Huang madaxa fulinta shirkadda. Go’aanka ayaa isla markiiba dhaqan galay, Huang-na wuxuu dib ugu biiray guddiga maamulka. Saamiga Nvidia ayaa warka ka dib kor u kacay 32.2% intii suuqu furnaa.\n\nKororku wuxuu gaaray shirkado kale oo ka shaqeeya sirdoonka macmalka ah. Saamiga CoreWeave, oo bixisa awoodda xisaabinta ee xarumaha xogta, ayaa kacay 21.5%. Markii ay New York saacaddu ahayd 12:02 duhurnimo, tusmada Nasdaq Composite waxay sare u kacday 6.69%, halka S&P 500 uu kordhay 4.85%.\n\n## Maxay shirkadaha kale saamayntu u gaartay?\n\nNvidia waxay samaysaa chip-yada loo adeegsado tababarka moodooyinka AI. Shirkad sida CoreWeave ahna waxay macaamiisha ka kiraysaa awoodda kombiyuutarrada ay chip-yadaasi ku rakiban yihiin. Xiriirkaas ganacsi ayaa sharxaya sababta dadka la socday go’aanka Nvidia ay isla maalintaas indhaha ugu hayeen shirkadaha qalabkeeda iibsada ee ka shaqaysiiya.\n\nHeerka kororku shirkad kasta wuu ka duwanaa. Tusaale ahaan, saami Nvidia ah oo markii hore qiimihiisu ahaa $100 wuxuu gaarayay $132.20 marka lagu xisaabiyo kororka la soo sheegay. Isla $100 oo CoreWeave ah wuxuu gaarayay $121.50. Tirada Nasdaq-na waxay ka tarjumaysay shirkado badan. Maadaama tirooyinkan la diiwaangeliyay intii ganacsigu socday, saacadda cabbirku waa muhiim marka lala barbar dhigayo qiimaha xiritaanka.'],'2026-11-23T18:02:00.000Z');
novemberStory('Tech','zscaler-deal-23',[
 ['CrowdStrike','https://ir.crowdstrike.com/news-releases/news-release-details/crowdstrike-acquire-zscaler-bringing-network-security-and-zero/'],
 ['Reuters','https://www.reuters.com/business/wall-street-futures-rebound-after-rough-week-ai-linked-shares-2026-11-23/']
],['crowdstrike-zscaler-deal','CrowdStrike agrees to acquire Zscaler in $43.9 billion deal','The two cybersecurity companies announced an all-stock agreement on Monday.','The boards of CrowdStrike and Zscaler approved an agreement that values Zscaler at approximately $43.9 billion on an enterprise-value basis, using CrowdStrike’s November 20 closing share price.\n\nIf the deal closes, CrowdStrike plans to bring Zscaler’s network security services to Falcon. Zscaler shares rose 15.3% while CrowdStrike fell 10.5% during Monday trading. The dollar value of the share consideration can move with CrowdStrike’s stock.\n\n## What shareholders are being offered\n\nAn all-stock agreement ties the value of the offer to the buyer’s shares. Consider a simplified example: a package of shares worth $100 at announcement would be worth $90 after a 10% drop in the buyer’s price, assuming the number of shares stays fixed. That is why the companies identified November 20 as the reference date for their valuation.\n\nThe announcement also gives customers a concrete question to follow. CrowdStrike says it wants Zscaler’s network security services inside Falcon. For a business already using both services, the practical test will be which tools its security team can manage together after completion. Board approval establishes that the directors support the agreement. The announcement describes integration as a future step.'],
['crowdstrike-heshiiska-zscaler','CrowdStrike oo heshiis $43.9 bilyan ah ku iibsanaysa Zscaler','Labada guddi maamul ayaa ansixiyay heshiiska, waxaana lagu bixin doonaa saamiyada CrowdStrike.','Shirkadda amniga internetka ee CrowdStrike ayaa Isniintii ku dhawaaqday heshiis ay ku iibsanayso Zscaler. Marka lagu saleeyo qiimihii saamiga CrowdStrike ku xirmay 20-kii Nofeembar, heshiisku wuxuu ganacsiga Zscaler ku qiimeeyay qiyaastii $43.9 bilyan.\n\nHaddii iibku dhammaado, CrowdStrike waxay adeegyada Zscaler ee ilaalinta shabakadaha ku dari doontaa barnaamijkeeda Falcon. Intii uu socday ganacsigii Isniinta, saamiga Zscaler wuxuu kacay 15.3%, halka kan CrowdStrike uu dhacay 10.5%. Maadaama iibka saamiyo lagu bixinayo, isbeddelka qiimaha saamiga CrowdStrike wuxuu beddeli karaa qiimaha heshiiska marka dollar lagu cabbiro.\n\n## Maxaa saamileyda loo soo bandhigay?\n\nMarka shirkad lagu iibsado saamiyo, qiimaha waxa uu iibiyuhu helayo wuxuu ku xiran yahay saamiga shirkadda iibsanaysa. Tusaale ahaan, xirmo saamiyo ah oo maanta u dhiganta $100 waxay berri u dhigmi kartaa $90 haddii saamigu dhaco 10% oo tirada saamiyadu sideedii ahaato. Sidaas darteed ayay labada shirkadood u cayimeen 20-kii Nofeembar inay tahay taariikhda qiimaynta.\n\nMacaamiisha labada shirkadood adeegooda wada isticmaasha waxay rabaan inay ogaadaan sida qalabku ugu wada shaqayn doono Falcon. Kooxda amniga ee shirkad macaamiil ah, su’aasha u muhiimsani waxay tahay hawlaha ay hal meel ka maamuli karto marka iibku dhammaado. Ansixinta ay bixiyeen guddiyada maamulku waxay muujinaysaa taageerada agaasimayaasha. Isku darka adeegyada waxaa lagu sheegay qorshe la fulin doono marka heshiisku hirgalo.'],'2026-11-23T17:58:00.000Z');

novemberStory('Markets','eth-flows-nov24',[
 ['Data provided by Nansen','https://www.nansen.ai/'],['Nansen · Smart Money netflows','https://docs.nansen.ai/api/smart-money/netflows']
],['ethereum-smart-money-nov24','NKP leads Ethereum Smart Money inflows, nearly four times TAC’s total','Only three of the five highest-ranked tokens had positive net flows in Nansen’s 24-hour reading.',
`NKP accounted for about 76% of the combined net inflow among the three tokens with positive readings. At 09:23 UTC on November 24, Nansen’s rolling 24-hour Ethereum ranking showed roughly $6,893 flowing into NKP on balance, followed by TAC at $1,723 and REKT at $501.

## Where the ranking turns flat

CFG and HASHAI rounded out the five results returned, both at $0 net. A zero balance can reflect offsetting flows or no activity. It gives no basis for calling either token a net purchase.

The figures measure flows associated with wallets Nansen labels Smart Money on Ethereum. The roughly $9,117 combined inflow across the three leaders measures dollar movement. It does not establish how many wallets participated or whether the tokens rose in price.

## How concentrated was the flow?

TAC and REKT together attracted roughly $2,224 on balance. NKP alone took in about $4,669 more than those two combined. That gap explains why the headline focuses on one token even though the query asked for five. It also puts the scale in perspective: leading this particular group required less than $7,000 of net inflow during the period.

The ranking is a snapshot of a rolling window. An inflow can drop out of tomorrow’s calculation simply because it is more than 24 hours old, even if the wallet still holds the tokens. To see whether interest persists, a useful follow-up is to compare the next window at the same UTC hour and examine individual trades for evidence of repeat activity.`],
['ethereum-smart-money-24-nofeembar','NKP oo hoggaamisay qulqulka Smart Money ee Ethereum, kuna dhow afar jibbaarka TAC','Shantii token ee ugu sarreeyay, saddex keliya ayay lacagta soo gashay ka badatay tii ka baxday.',
`NKP waxay heshay qiyaastii 76% lacagta saafiga ah ee u soo gashay saddexda token ee hoggaanka qabtay. Markii xogta Nansen la eegay 24-kii Nofeembar 09:23 UTC, lacagta NKP soo gashay 24-kii saac ee ka horreeyay ayaa tii ka baxday ka badnayd qiyaastii $6,893. Waxaa ku xigay TAC oo heshay $1,723 iyo REKT oo heshay $501.

## Maxay ka dhigan tahay eber?

CFG iyo HASHAI ayaa dhammaystiray shanta natiijo ee Nansen soo celisay. Labaduba waxay muujiyeen $0 marka lacagta baxday laga jaro tii soo gashay. Taasi waxay dhici kartaa marka labada dhinac isu dhigmaan ama wax dhaqdhaqaaq ahi uusan jirin.

Xogtu waxay ku kooban tahay shabakadda Ethereum iyo boorsooyinka Nansen ku tilmaanto Smart Money. Saddexda token ee hore waxaa isu geyntii u soo galay qiyaastii $9,117 oo saafi ah. Tiradani keligeed ma sheegeyso inta boorso ee ka qayb qaadatay ama sida qiimaha tokennadu isu beddelay.

## Intee ayuu NKP ka horreeyay labada kale?

Marka la isku daro TAC iyo REKT, lacagta saafiga ah ee u soo gashay waxay ahayd qiyaastii $2,224. NKP keligiis waxaa u soo galay qiyaastii $4,669 oo ka badan wadarta labadaas. Farqigaasi wuxuu sharxayaa sababta hal token cinwaanka u qabsaday, inkastoo baaritaanku raadinayay shanta ugu sarreeya. Waxa kale oo uu muujinayaa baaxadda lacagta: wax ka yar $7,000 ayaa ku filnaa kaalinta koowaad muddadan.

Kala sarreyntani way is beddeshaa marka saacaduhu socdaan. Lacag maanta lagu daray xisaabta berri way ka bixi kartaa, sababtoo ah waxaa laga joogaa in ka badan 24 saac, xitaa haddii tokennadu weli ku jiraan isla boorsadii. Si loo eego in dhaqdhaqaaqu sii socdo, waxaa waxtar leh in berri isla saacadda UTC la barbar dhigo natiijada, dabadeedna la eego macaamillada soo noqnoqday.`],'2026-11-24T09:23:32.335Z');

novemberStory('Bitcoin','btc-drop-24',[
  ['CoinDesk','https://www.coindesk.com/markets/2026/11/24/bitcoin-hands-back-monday-s-nvidia-driven-gains-liquidations-triple'],
  ['The Block','https://www.theblock.co/news/markets/2026-11-24-bitcoin-etfs-another-570-million-net-outflows-november-total-nears-5-billion-btc-dips-below-60k-445548']
],['bitcoin-below-60000-tuesday','Bitcoin slips back below $60,000 after Monday’s Nvidia-led rally','The price gave back Monday’s jump toward $64,500. CoinGlass recorded $844 million in futures liquidations over 24 hours.',`Bitcoin slipped below $60,000 on Tuesday, 24 November, giving back the rebound that followed Nvidia’s decision on Monday to reinstate Jensen Huang as chief executive.

CoinDesk, writing on Tuesday morning in the United States, said Bitcoin had dropped 2.2% since midnight UTC to around $59,900. The same report said the price had swung from $64,500 on Monday to below $60,000. The Block later said Bitcoin finished Monday roughly flat after that intra-day high, then fell back below $60,000 on Tuesday morning, when it was trading around $60,300 on The Block’s prices page.

## What moved with the price

CoinDesk, citing CoinGlass, said traders had $844 million of crypto futures positions liquidated over the previous 24 hours, up 217% from the day before. Bitcoin accounted for $357 million of that total and ether for $176 million. According to Coinalyze, as cited by CoinDesk, Bitcoin liquidations were evenly split between traders betting on a rise and those betting on a fall.

Ether fell 1.6% and the CoinDesk 20 Index lost 1.3% in the same CoinDesk snapshot. Nasdaq-100 futures were down 0.7% and S&P 500 futures 0.2% at the time of that report. Joshua Lim of FalconX told CoinDesk that Nvidia had recovered more than 80% of its losses since Huang stepped down, while Bitcoin had regained only about 25% of its slide to below $56,000.

The figures record prices and derivatives activity at the time each outlet published. They are not a forecast of where Bitcoin will trade next.

This article is for information and education. It is not investment, financial, tax or legal advice.`],
['bitcoin-hoos-60000-talaado','Bitcoin oo Talaadadii hoos uga dhacay $60,000 kadib kororkii Nvidia','Qiimuhu wuxuu dib u celiyay kororkii Isniinta ee ku dhowaaday $64,500. CoinGlass waxay diiwaangelisay $844 milyan oo likwideyn futures ah.',`Bitcoin ayaa Talaadadii, 24 Nofeembar, hoos uga dhacay $60,000. Taasi waxay ka dhigtay inuu lumiyo kororkii Isniinta, kadib markii Nvidia ay dib u soo ceshatay Jensen Huang inuu noqdo madaxa fulinta.

CoinDesk, iyadoo qortay subaxdii Talaadada ee Maraykanka, waxay sheegtay in Bitcoin uu hoos u dhacay 2.2% tan iyo saqda dhexe UTC, isagoo ku yaallay ku dhowaad $59,900. Isla warbixinta ayaa sheegtay in qiimuhu Isniintii ka soo kacay $64,500, ka dibna uu ka hooseeyay $60,000. The Block markii dambe waxay sheegtay in Bitcoin Isniintii ku dhammaaday si ku dhow isku mid, ka dib heerkaas maalinlaha ah, dabadeedna Talaadadii subaxdii uu hoos uga dhacay $60,000. Markaas The Block waxay qiimaha ku qortay ku dhowaad $60,300.

## Maxaa la socday qiimaha?

CoinDesk, iyadoo tixraacaysa CoinGlass, waxay sheegtay in 24-kii saac ee ka horreeyay lagu likwideeyay $844 milyan oo jagooyin futures ah, taasoo 217% ka badan maalintii hore. Bitcoin ayaa ka mid ahaa $357 milyan, ether-na $176 milyan. Sida Coinalyze ugu sheegtay CoinDesk, likwideeynta Bitcoin waxay u qaybsanayd si siman u dhexaysa kuwa ku tartamayay inuu kaco iyo kuwa ku tartamayay inuu dhaco.

Ether wuxuu hoos u dhacay 1.6%, CoinDesk 20 Index-na 1.3%, markii CoinDesk xogta qortay. Nasdaq-100 futures-kii waxay hoos u dhacayeen 0.7%, kuwa S&P 500-na 0.2%. Joshua Lim oo ka tirsan FalconX ayaa u sheegay CoinDesk in Nvidia ay soo ceshatay in ka badan 80% khasaarihii tan iyo markii Huang xilka ka degay, halka Bitcoin soo ceshatay kaliya qiyaastii 25% hoos u dhicii inuu ka hooseeyay $56,000.

Tirooyinkani waxay qorayaan qiimaha iyo dhaqdhaqaaqa derivatives-ka waqtiga warbaahintu daabacday. Maahan saadaalin ku saabsan halka Bitcoin ku xirman doono.

Maqaalkani waa xog iyo waxbarasho. Ma aha talo maalgashi, maaliyadeed, canshuureed ama sharci.`],'2026-11-24T18:00:00.000Z');

novemberStory('Markets','btc-etf-outflows-24',[
  ['CoinDesk','https://www.coindesk.com/daybook-us/2026/11/24/bitcoin-drops-as-november-spot-etf-outflows-increase-to-record-usd4-71-billion'],
  ['The Block','https://www.theblock.co/news/markets/2026-11-24-bitcoin-etfs-another-570-million-net-outflows-november-total-nears-5-billion-btc-dips-below-60k-445548'],
  ['Cointelegraph','https://cointelegraph.com/markets/bitcoin-etfs-bleed-ibit-shares-gain']
],['bitcoin-etf-outflows-november-record','Bitcoin ETFs lose $570 million, taking November outflows to a record $4.71 billion','Monday was a fifth straight session of net withdrawals from U.S. spot bitcoin funds, led by BlackRock’s IBIT.',`U.S. spot bitcoin ETFs recorded $569.7 million in net outflows on Monday, 23 November, a fifth straight trading session of withdrawals.

The Block, citing its compiled fund-flow data, and Cointelegraph, citing SoSoValue, both put Monday’s net figure at $569.7 million. BlackRock’s iShares Bitcoin Trust, IBIT, accounted for $509.3 million of that total. The Block said Grayscale’s BTC fund had $61.1 million of outflows and Bitwise’s BITB $12.6 million, while Fidelity’s FBTC was the only fund with a net inflow, of $13.3 million. The remaining funds posted no flows for the day.

## A record month so far

November’s net withdrawals reached $4.71 billion, according to a CoinDesk daily market report and to Cointelegraph. Cointelegraph, citing SoSoValue, said that total had surpassed June’s record of $4.51 billion, and that the five-session outflow came to $2.37 billion, with IBIT accounting for $1.95 billion of that amount. As of Monday, Cointelegraph put combined net assets of the U.S. spot bitcoin ETFs at $73.6 billion, with IBIT holding $45.64 billion.

The Block, citing Nansen senior research analyst Nicolai Sondergaard, said the selling looked like a cyclical reduction in risk rather than a structural exit from the funds. Despite nearly $5 billion leaving in November, cumulative net inflows remained around $52 billion, or about 83% of their October 2025 peak, Sondergaard said. Nansen data cited in the same report showed little evidence that large holders were absorbing the ETF selling: wallets that rarely move coins received a net 10,000 BTC from exchanges over the past month, compared with about 70,000 BTC sold by ETFs in November.

ETF flow figures measure money entering or leaving the funds on a given trading day. They are not the same as Bitcoin’s price at a single moment, and they do not by themselves say whether any one investor should buy or sell.

This article is for information and education. It is not investment, financial, tax or legal advice.`],
['etf-bitcoin-nofeembar-471-bilyan','ETF-yada Bitcoin oo Isniintii ka baxay $570 milyan, Nofeembarna gaaray $4.71 bilyan','Isniintu waxay ahayd shanaad ee isku xigta oo lacag laga saaro sanduuqyada Maraykanka ee Bitcoin si toos ah u haysta, IBIT ayaana horseedday.',`ETF-yada Maraykanka ee Bitcoin si toos ah u haysta waxaa Isniintii, 23 Nofeembar, ka baxay $569.7 milyan oo saafi ah. Taasi waxay ahayd shanaad ee maalmaha ganacsiga oo lacag laga saaro sanduuqyadan.

The Block, iyadoo tixraacaysa xogteeda qulqulka sanduuqyada, iyo Cointelegraph, iyadoo tixraacaysa SoSoValue, labaduba waxay Isniinta ku qoreen $569.7 milyan. BlackRock iShares Bitcoin Trust, IBIT, ayaa ka mid ahaa $509.3 milyan. The Block waxay sheegtay in sanduuqa Grayscale ee BTC ka baxay $61.1 milyan, kan Bitwise ee BITB-na $12.6 milyan, halka Fidelity FBTC uu ahaa kan kaliya ee lacag saafi ah soo gashay, $13.3 milyan. Inta kale maalintaas ma aysan qorin qulqul.

## Rikoor bishiibaa ilaa hadda

Lacagta saafiga ah ee Nofeembar laga saaray ayaa gaartay $4.71 bilyan, sida ay sheegeen warbixin maalinle ah oo CoinDesk ah iyo Cointelegraph. Cointelegraph, iyadoo tixraacaysa SoSoValue, waxay tiri wadartaas way dhaaftay rikoorkii Juun ee $4.51 bilyan, waxayna sheegtay in shanta maalmood laga saaray $2.37 bilyan, IBIT-na uu ka mid ahaa $1.95 bilyan. Ilaa Isniinta, Cointelegraph waxay hantida saafiga ah ee ETF-yadan ku qortay $73.6 bilyan, IBIT-na wuxuu haystay $45.64 bilyan.

The Block, iyadoo soo xigatay Nicolai Sondergaard oo ah falanqeeye sare oo ka tirsan Nansen, waxay sheegtay in iibku u eg yahay dhimis khatar oo ku xiran wareegga suuqa, ee aan ahayn ka bax rasmi ah oo ka yimid sanduuqyada. In kasta oo ku dhowaad $5 bilyan Nofeembar ka baxay, lacagta saafiga ah ee waligii soo gashay waxay ku hadhay ku dhowaad $52 bilyan, ama qiyaastii 83% heerkii ugu sarreeyay ee Oktoobar 2025, ayuu yiri Sondergaard. Xogta Nansen ee isla warbixinta ku jirta ma muujin in haystayaal waaweyn ay iibka ETF-yada la wareegayeen: boorsooyin aan sida caadiga ah dhaqaajin lacagta waxaa 30-kii maalmood ee la soo dhaafay kala soo wareegay 10,000 BTC oo saafi ah, iyadoo ETF-yadu Nofeembar iibiyeen qiyaastii 70,000 BTC.

Tirooyinka qulqulka ETF-yadu waxay cabbirayaan lacagta maalinta ganacsiga gasha ama ka baxda sanduuqyada. Iyagu ma aha qiimaha Bitcoin ee daqiiqad keliya, kaligoodna ma sheegayaan in qof iibsado ama iibiyo.

Maqaalkani waa xog iyo waxbarasho. Ma aha talo maalgashi, maaliyadeed, canshuureed ama sharci.`],'2026-11-24T16:30:00.000Z');

novemberStory('Ethereum','eth-1700-24',[
  ['The Block','https://www.theblock.co/news/markets/2026-11-24-bitcoin-etfs-another-570-million-net-outflows-november-total-nears-5-billion-btc-dips-below-60k-445548'],
  ['crypto.news','https://crypto.news/ethereum-price-etf-outflows-bitmine-1700-support/'],
  ['CoinDesk','https://www.coindesk.com/markets/2026/11/24/bitcoin-hands-back-monday-s-nvidia-driven-gains-liquidations-triple']
],['ethereum-near-1700-etf-outflows','Ethereum trades near $1,700 as spot ether ETFs post $85 million in outflows','BlackRock’s ETHA led Monday’s withdrawals. Ether also gave back part of Monday’s bounce.',`Ethereum traded near $1,700 on Tuesday, 24 November, as U.S. spot ether ETFs recorded further net outflows.

crypto.news, citing its market data, said ether changed hands at $1,702.20 on 24 November, down 1.61% over 24 hours, after trading as low as $1,669.25 and as high as $1,842.19 earlier in the session. CoinDesk, in a Tuesday morning snapshot, put ether at about $1,683.94, down 1.6%. The Block said ether had also jumped with Bitcoin on Monday before ending that session 0.8% lower, and later showed a price near $1,670 on its live board.

## ETF withdrawals on Monday

The Block said U.S. spot ether ETFs generated $84.9 million in net outflows on Monday, led by BlackRock’s ETHA. crypto.news, citing SoSoValue, put the same session’s net figure at $84.96 million and said Fidelity’s FETH attracted $5.58 million in net inflows, which partly offset other withdrawals.

Those fund flows are for Monday’s session. Tuesday’s prices moved through the day, which is why outlets published slightly different snapshots. A lower print near $1,700 records a moment in trading. It does not, on its own, say where ether will close or whether demand through the ETFs will turn.

This article is for information and education. It is not investment, financial, tax or legal advice.`],
['ethereum-1700-etf-qulqulka','Ethereum oo ku dhow $1,700 iyadoo ETF-yada ether ka baxay $85 milyan','BlackRock ETHA ayaa horseeday lacagta Isniinta laga saaray. Ether sidoo kale wuxuu lumiyay qayb ka mid ah soo kabashadii Isniinta.',`Ethereum ayaa Talaadadii, 24 Nofeembar, ku ganacsanayay agagaarka $1,700, iyadoo ETF-yada Maraykanka ee ether si toos ah u haysta ay weli lacag saafi ah laga saarayay.

crypto.news, iyadoo tixraacaysa xogteeda suuqa, waxay sheegtay in ether 24 Nofeembar lagu kala iibsaday $1,702.20, oo 1.61% ka hooseeya 24-kii saac ee ka horreeyay, kadib markii uu hoos u dhacay ilaa $1,669.25 una kacay ilaa $1,842.19 horraantii fadhigga. CoinDesk, markii ay subaxdii Talaadada qortay, waxay ether ku qortay ku dhowaad $1,683.94, oo 1.6% hoos u dhacay. The Block waxay tiri ether Isniintii wuxuu la kacay Bitcoin, ka dibna maalintaas ku dhammaaday 0.8% hoos, markii dambena shaxankeeda tooska ah wuxuu muujiyay ku dhowaad $1,670.

## Lacagta ETF-yada ee Isniinta

The Block waxay sheegtay in ETF-yada Maraykanka ee ether si toos ah u haysta Isniintii laga saaray $84.9 milyan oo saafi ah, iyadoo BlackRock ETHA horseedday. crypto.news, iyadoo tixraacaysa SoSoValue, waxay isla fadhigga ku qortay $84.96 milyan, waxayna tiri Fidelity FETH waxaa soo galay $5.58 milyan oo saafi ah, taasoo qayb ka ahayd inay yareyso lacagta kale ee baxday.

Qulqulka sanduuqyadu waa kan fadhigga Isniinta. Qiimaha Talaadada wuu isbeddelayay maalintii oo dhan, waana sababta warbaahintu u qortay tirooyin waxyar kala duwan. Qiime ku dhow $1,700 wuxuu qorayaa daqiiqad ganacsi. Kaligiis ma sheegayo halka ether ku xirman doono ama in iibsiga ETF-yadu uu soo noqon doono.

Maqaalkani waa xog iyo waxbarasho. Ma aha talo maalgashi, maaliyadeed, canshuureed ama sharci.`],'2026-11-24T16:00:00.000Z');

novemberStory('Regulation','doj-binance-24',[
  ['U.S. Department of Justice','https://www.justice.gov/opa/pr/united-states-files-action-recover-more-1-billion-cryptocurrency-assets-stolen-north-korean'],
  ['CoinDesk','https://www.coindesk.com/policy/2026/11/24/u-s-seeks-usd1-1-billion-seized-in-binance-hack-as-north-korean-funds-keep-moving'],
  ['The Block','https://www.theblock.co/newsletters/the-daily/2026-11-24-doj-binance-hack-strategy-bitcoin-more-crypto-news-445430']
],['doj-usdc-binance-hack-forfeiture','U.S. files to recover more than $1.1 billion in USDC from the Binance hack','The Justice Department announced a civil forfeiture action on Monday over funds already frozen after the 29 October theft.',`The U.S. Department of Justice said on Monday, 23 November, that it had filed a civil action to forfeit more than $1.1 billion in cryptocurrency criminally obtained by North Korean actors in the 29 October hack of Binance.

The official announcement said the filing was part of a wider effort to help Binance recover more than $6 billion in stolen assets. To date, the United States had assisted in freezing, seizing or returning more than $2.9 billion of cryptocurrency from multiple sources since the theft, the department said. CoinDesk, reporting on Tuesday, put the stolen total at roughly $6.3 billion. The Block, which said it had seen the complaint, described about $1.17 billion in USDC held across 36 addresses on 18 blockchains, and said Binance estimated its losses at $6.34 billion and had fully replenished the affected assets.

## What the court action covers

The Justice Department said the claim targets more than $1.1 billion of USDC, the stablecoin issued by Circle Internet Financial, and that the assets had already been subject to a government-requested restraining order. CoinDesk reported that the new filing seeks to transfer legal ownership of funds that are already frozen, and does not represent a new freeze. The Block said Circle has blocked access to the USDC but cannot move the original tokens from the affected addresses, and has agreed to issue an equivalent amount of new USDC to the United States if the court orders forfeiture.

CoinDesk, citing Elliptic, said about $2.35 billion remained in wallets linked to the theft as of Monday. Brett Leatherman, operations director of the FBI’s Cyber Branch, said in the Justice Department announcement that North Korea depends on sophisticated laundering techniques to convert stolen cryptocurrency into funds that support the regime’s illicit activities.

A court filing is a request. It is not, by itself, a final ruling that the assets have been returned.

This article is for information and education. It is not investment, financial, tax or legal advice.`],
['dacwadda-usdc-binance-hack','Maraykanku wuxuu gudbiyay in laga soo ceshado in ka badan $1.1 bilyan oo USDC ah oo laga xaday Binance','Wasaaradda Caddaaladda ayaa Isniintii ku dhawaaqday dacwad civil forfeiture ah oo ku saabsan lacago hore loo xayiray kadib xatooyadii 29 Oktoobar.',`Wasaaradda Caddaaladda ee Maraykanka ayaa Isniintii, 23 Nofeembar, sheegtay inay gudbisay dacwad madani ah si loo sameeyo civil forfeiture ee in ka badan $1.1 bilyan oo crypto ah oo ay si dambiyeed u heleen jilayaal Waqooyiga Kuuriya, kadib xatooyadii 29 Oktoobar ee Binance.

Ogeysiiska rasmiga ah wuxuu yiri dacwadda waa qayb ka mid ah dadaal ballaaran oo lagu caawinayo Binance inay soo ceshto in ka badan $6 bilyan oo hanti la xaday. Ilaa hadda, Maraykanku wuxuu ka caawiyay xayiraadda, qabashada ama soo celinta in ka badan $2.9 bilyan oo crypto ah oo ka timid ilo kala duwan tan iyo xatooyada, ayay tiri wasaaraddu. CoinDesk, iyadoo Talaadadii qortay, waxay wadarta la xaday ku qortay qiyaastii $6.3 bilyan. The Block, oo sheegatay inay aragtay dacwadda, waxay ku tilmaamtay ku dhowaad $1.17 bilyan oo USDC ah oo ku yaal 36 cinwaan oo ku yaal 18 blockchain, waxayna tiri Binance waxay khasaaraheeda ku qiyaastay $6.34 bilyan, una buuxisay hantidii saamaynta ku timaaday.

## Maxay dacwadda maxkamaddu quseysaa?

Wasaaradda Caddaaladda waxay tiri sheegashadu waxay ku wajahan tahay in ka badan $1.1 bilyan oo USDC ah, oo ah stablecoin ay soo saarto Circle Internet Financial, hantidana horay loogu soo rogay amar xayiraad oo ay dawladdu codsatay. CoinDesk waxay sheegtay in dacwadda cusubi ay doonayso in la wareejiyo lahaanshaha sharci ee lacagaha hore loo xayiray, oo aysan ahayn xayiraad cusub. The Block waxay tiri Circle way xayirtay gelitaanka USDC-da, laakiin kama dhaqaajin karto tokennadii asalka ahaa cinwaannada ay ku jiraan, waxayna oggolaatay inay u soo saarto qaddar u dhigma oo USDC cusub ah Maraykanka haddii maxkamaddu amarto forfeiture.

CoinDesk, iyadoo tixraacaysa Elliptic, waxay sheegtay in ku dhowaad $2.35 bilyan ay Isniintii weli ku jireen boorsooyin lala xiriiriyo xatooyada. Brett Leatherman, oo ah agaasimaha hawlgallada ee qaybta internetka ee FBI, ayaa ogeysiiska Wasaaradda Caddaaladda ku yiri in Waqooyiga Kuuriya ay ku tiirsan tahay farsamooyin dhaqan-dhaqaale oo casri ah si ay crypto-ga la xaday ugu beddesho lacag taageerta hawlo sharci darro ah.

Gudbinta dacwad maxkamadeed waa codsi. Kaligeed ma aha xukun kama dambays ah oo sheegaya in hantida la soo celiyay.

Maqaalkani waa xog iyo waxbarasho. Ma aha talo maalgashi, maaliyadeed, canshuureed ama sharci.`],'2026-11-24T15:30:00.000Z');

novemberStory('Solana','bullpen-24',[
  ['Decrypt','https://decrypt.co/383889/ansem-meme-coin-crashes-wallet-drain-bullpen-security-breach'],
  ['The Block','https://www.theblock.co/news/defi/2026-11-24-ansem-denies-involvement-2-57-million-wallet-drain-black-bull-creator-coin-plummets-55-445705']
],['bullpen-unauthorized-transfers-ansem','Bullpen confirms unauthorized transfers after $2.57 million leaves wallets linked to Ansem','The trading platform said 18 to 19 early beta accounts were affected and took the service offline.',`Bullpen, a crypto trading platform, said on Tuesday, 24 November, that it had identified unauthorized transfers involving accounts opened during an early beta between April and June 2024.

“On November 24, we identified unauthorized transfers involving Bullpen accounts opened during our early beta between April and June 2024,” the company said, according to Decrypt. “Our preliminary count is 18–19 affected accounts, including [Ansem’s].” Decrypt reported that the company also said it had taken the affected test service offline, would contact affected users, and would provide updates every three hours during its investigation. Bullpen said the affected accounts represented less than 0.005% of its registered user base. It had not, at the time of that report, disclosed the precise vulnerability, the total losses across all affected accounts, or whether it would compensate users.

## What on-chain reports showed

The statement followed reports earlier on Tuesday that wallets linked to the crypto personality known as Ansem, whom The Block identified as Zion Thomas, had sold meme coins and moved funds. The Block, citing Lookonchain, said a suspected attacker had sold meme coins from Ansem’s wallet and transferred $2.57 million in USDC to an Arbitrum address, where the funds remained at the time of publication. Decrypt, citing Bitquery, put the moved funds at $2.57 million in total, with about $2.1 million coming from meme coin sales.

Decrypt reported that The Black Bull, a Solana meme coin that trades as ANSEM, fell roughly 60% in less than an hour. The Block later said the token was down 55% on the day, to under $0.02, its lowest price since it launched in June. Ansem said on X that he believed a Solana wallet had been compromised through unauthorized access to his Bullpen profile, where a private key had been imported. The Block reported that he denied being behind the transactions and said he was conducting a security audit. Some on-chain analysts initially questioned the hack explanation. Those comments predated Bullpen’s confirmation of unauthorized transfers.

A company statement about unauthorized transfers is not a completed investigation, and it does not establish the final size of any losses.

This article is for information and education. It is not investment, financial, tax or legal advice.`],
['bullpen-wareejin-ansem','Bullpen oo xaqiijisay wareejinno aan oggolaansho lahayn kadib $2.57 milyan oo ka baxay boorsooyin la xiriira Ansem','Madashu waxay tiri 18 ilaa 19 akoon oo beta hore ah ayaa saameeyay, adeeggiina waa la xidhay.',`Bullpen, oo ah madal ganacsi crypto, ayaa Talaadadii, 24 Nofeembar, sheegtay inay ogaatay wareejinno aan oggolaansho lahayn oo ku saabsan akoonno la furay intii lagu jiray beta hore oo u dhexeysay Abriil iyo Juun 2024.

“On November 24, we identified unauthorized transfers involving Bullpen accounts opened during our early beta between April and June 2024,” ayay shirkaddu tiri, sida Decrypt u qortay. “Our preliminary count is 18–19 affected accounts, including [Ansem’s].” Decrypt waxay sheegtay in shirkaddu sidoo kale tiri inay xidhay adeegga tijaabada ee saameeyay, ay la xiriiri doonto isticmaalayaasha ay khusayso, ayna bixin doonto warbixino saddexdii saacba mar inta baaritaanku socdo. Bullpen waxay tiri akoonnada saameeyay waxay ka yaraayeen 0.005% isticmaalayaasha diiwaangashan. Waqtiga warbixintaas, mayan sheegin daldaloolka saxda ah, wadarta khasaaraha akoonnada oo dhan, ama inay magdhow bixinayso.

## Maxay warbixinada on-chain muujiyeen?

Ogeysiiska wuxuu yimid kadib warar horraantii Talaadada sheegayay in boorsooyin lala xiriiriyo shakhsiyadda crypto ee loo yaqaan Ansem, oo The Block u aqoonsatay Zion Thomas, ay iibiyeen meme coins una wareejiyeen lacag. The Block, iyadoo tixraacaysa Lookonchain, waxay tiri in looga shakisan yahay in weeraryahan ka iibiyay meme coins boorsada Ansem, una wareejiyay $2.57 milyan oo USDC ah cinwaan Arbitrum ah, halkaasoo lacagtu ku sii jirtay markii la daabacay. Decrypt, iyadoo tixraacaysa Bitquery, waxay wadarta lacagta la dhaqaajiyay ku qortay $2.57 milyan, iyadoo qiyaastii $2.1 milyan ka timid iibka meme coins.

Decrypt waxay sheegtay in The Black Bull, oo ah meme coin Solana ah oo loo yaqaan ANSEM, uu ku dhowaad 60% hoos u dhacay saacad ka yar. The Block markii dambe waxay tiri token-ku maalintaas wuxuu hoos u dhacay 55%, isagoo ka hooseeya $0.02, qiimihii ugu hooseeyay tan iyo markii Juun la bilaabay. Ansem wuxuu X ku sheegay inuu aaminsan yahay in boorso Solana ah laga soo dhex galay iyadoo loo soo galay akoonkiisa Bullpen si aan oggolaansho lahayn, halkaasoo furaha gaarka ah lagu soo dejiyay. The Block waxay sheegtay inuu beeniyay inuu ka danbeeyay wareejinnada, oo uu sheegay inuu wado baaritaan ammaan. Qaar ka mid ah falanqeeyayaasha on-chain ayaa markii hore ka shakiyay sheegashada in la jabsaday. Faallooyinkaas waxay horreeyeen xaqiijinta Bullpen ee wareejinnada aan oggolaanshaha lahayn.

Ogeysiiska shirkadeed ee wareejinnada aan oggolaanshaha lahayn ma aha baaritaan dhammaaday, mana caddaynayo cabbirka kama dambayska ah ee khasaaraha.

Maqaalkani waa xog iyo waxbarasho. Ma aha talo maalgashi, maaliyadeed, canshuureed ama sharci.`],'2026-11-24T17:30:00.000Z');

novemberStory('Markets','sol-xrp-etf-24',[
  ['The Block','https://www.theblock.co/news/markets/2026-11-24-bitcoin-etfs-another-570-million-net-outflows-november-total-nears-5-billion-btc-dips-below-60k-445548']
],['solana-xrp-etf-outflows-tuesday','Solana and XRP ETFs post outflows as both tokens trade lower','U.S. spot funds tied to the two assets recorded modest net withdrawals on Monday, according to The Block.',`U.S. spot ETFs tied to Solana and XRP also recorded net outflows on Monday, 23 November, on a day when bitcoin and ether funds saw much larger withdrawals.

The Block, citing SoSoValue data, said U.S. Solana ETFs had a combined $3.8 million in net outflows for the day, while spot XRP ETFs recorded $2.5 million in net outflows. Those figures sit beside the same report’s totals for bitcoin funds, $569.7 million, and ether funds, $84.9 million.

## Prices on Tuesday

The fund flows are Monday session totals. Token prices kept moving on Tuesday. The Block’s live board, at the time its ETF report and later pages were checked, showed Solana around $69.

A few million dollars leaving a fund is a small figure next to the bitcoin ETF withdrawals recorded the same day. It still records a net sale of shares in those products. It does not, by itself, explain every move in Solana or XRP, and it is not a signal to buy or sell either token.

This article is for information and education. It is not investment, financial, tax or legal advice.`],
['etf-solana-xrp-qulqulka','ETF-yada Solana iyo XRP oo lacag ka baxday iyadoo labada token hoos u dhaceen','Sanduuqyada Maraykanka ee labada hanti Isniintii waxaa laga saaray lacag saafi ah oo yar, sida The Block u qortay.',`ETF-yada Maraykanka ee si toos ah u haysta Solana iyo XRP ayaa iyagana Isniintii, 23 Nofeembar, lacag saafi ah laga saaray, maalintii sanduuqyada bitcoin iyo ether laga saaray lacag aad u badan.

The Block, iyadoo tixraacaysa xogta SoSoValue, waxay sheegtay in ETF-yada Solana ee Maraykanka maalintaas laga saaray $3.8 milyan oo saafi ah marka la isku daro, halka ETF-yada XRP laga saaray $2.5 milyan oo saafi ah. Tirooyinkaas waxay ku ag yaalliin wadaraha isla warbixinta: sanduuqyada bitcoin $569.7 milyan, kuwa ether-na $84.9 milyan.

## Qiimayaasha Talaadada

Qulqulka sanduuqyadu waa wadarta fadhigga Isniinta. Qiimaha token-rada Talaadadii wuu sii socday. Shaxanka tooska ah ee The Block, markii warbixinta ETF-yada iyo bogagga dambe la eegay, wuxuu Solana ku muujiyay ku dhowaad $69.

Dhowr milyan oo sanduuq laga saaro waa tiro yar marka loo eego lacagta laga saaray ETF-yada bitcoin isla maalintaas. Weli waxay qortaa iib saafi ah oo saamiyada badeecadahaas ah. Kaligeed ma sharaxdo dhaqdhaqaaq kasta oo Solana ama XRP, mana aha calaamad in la iibsado ama la iibiyo labada token.

Maqaalkani waa xog iyo waxbarasho. Ma aha talo maalgashi, maaliyadeed, canshuureed ama sharci.`],'2026-11-24T15:00:00.000Z');

const pceEn = ["bitcoin-falls-57209-after-pce", "Bitcoin falls to $57,209 after hot US inflation data, then rebounds toward $60,000", "October PCE inflation rose to 3.8% and core PCE to 3.3%, lifting bets on a December Fed rate hike as Bitcoin ETF outflows hit a monthly record.", "Bitcoin sold off sharply on Wednesday after the United States released inflation data that left core prices hotter than forecast, then won back most of the loss by evening in Europe.\n\nThe token fell as low as $57,209 on Bitstamp, down as much as 4.2% on the day, according to TradingView data cited by Cointelegraph. CoinGecko later showed a 24 hour range of $57,307.69 to $60,284.61, with Bitcoin trading near $59,849 late Wednesday evening in Brussels. Ethereum was near $1,680, slightly higher over 24 hours after an earlier slide toward $1,600.\n\nThe trigger was the October Personal Consumption Expenditures price index, the Federal Reserve's preferred inflation gauge. The US Bureau of Economic Analysis said the PCE price index rose 0.3% from September and 3.8% from a year earlier, up from 3.7% in September. Excluding food and energy, core PCE also rose 0.3% on the month and 3.3% from a year earlier.\n\nCNBC reported that the 3.8% headline figure matched the Dow Jones consensus, while core PCE came in 0.1 percentage point above the forecast. The reading is nearly twice the Fed's 2% target. Cointelegraph said the 3.8% annual rate was the second highest since April 2023.\n\nMarkets were already leaning toward a quarter point rate increase at the Fed's December 8 to 9 meeting, CNBC said, and the print kept that path in view.\n\nRisk assets moved together. Cointelegraph said the Nasdaq Composite Index fell 4.2% to 22,632 points and the S&P 500 was down 2.7% at 4:30 p.m. UTC, as traders also weighed reports of fresh US tariffs generally ranging between 15% and 20%. CoinDesk later said the Nasdaq had narrowed an early 4.5% decline to a loss of 0.7% by mid afternoon in New York, with the S&P 500 down just 0.35%, as Bitcoin retook $60,000.\n\nSelling in the funds that track Bitcoin did not let up. US spot Bitcoin ETFs recorded about $231.6 million in net outflows on Tuesday, a sixth straight session, according to SoSoValue data cited by Cointelegraph. November outflows reached $4.94 billion, above the previous monthly record of $4.51 billion set in June. BlackRock's IBIT accounted for $175.30 million of Tuesday's withdrawals, SoSoValue data showed.\n\nLeveraged traders were hit as the price dropped. CoinGlass recorded $512 million in crypto liquidations over 24 hours, including $416 million in long positions, Cointelegraph reported.\n\nSentiment among research desks also worsened. Galaxy withdrew its October call that Bitcoin's bear market had ended in June, CoinDesk reported. The firm is now watching a daily close below $58,525, the June 30 closing low, as a signal that a lower bottom could lie ahead. In seven earlier bear market cases, a break of that kind was followed by a further drop of at least 17%, which Galaxy said would point to roughly $48,500. Not every desk agrees. Matt Mena of 21Shares still sees a path toward $72,000 to $80,000 before year end if inflation cools, CoinDesk reported.\n\nWhat it means\n\nWednesday showed how tightly Bitcoin is still tied to US inflation and to the Fed. A hotter core PCE reading keeps the door open for higher borrowing costs, which has weighed on both tech stocks and crypto. The record November ETF outflows show large investors are still taking money out, and Galaxy's retreat from its bottom call raises the importance of the $58,525 closing level. The late bounce toward $60,000 shows buyers are still active on sharp dips, but the wider trend remains under pressure until inflation cools or the outflows slow.\n\nNot financial advice — DYOR"];
const pceSo = ["bitcoin-hoos-57209-kadib-pce", "Bitcoin oo hoos ugu dhacay $57,209 kadib sicir bararka Maraykanka, kadibna dib ugu soo noqday $60,000", "PCE-ga Oktoobar wuxuu gaaray 3.8%, core PCE-na 3.3%, taasoo xoojisay rajooyinka in Federal Reserve December kor u qaado dulsaarka, iyadoo ETF-yada Bitcoin ka baxay lacag rikoor ah bishii Nofeembar.", "Bitcoin si xoog leh ayey hoos ugu dhacday Arbacadii kadib xogta sicir bararka Maraykanka ee ka dhigtay qiimaha core-ka mid ka kulul sidii la saadaaliyay, kadibna wuxuu soo ceshaday inta badan khasaaraha fiidkii Europe.\n\nQiimaha ayaa hoos ugu dhacay ilaa $57,209 ee Bitstamp, hoos u dhac gaaraya 4.2% maalintaas, sida xogta TradingView uga soo xigtay Cointelegraph. CoinGecko ayaa markii dambe muujisay in 24 saacadood uu u dhexeeyay $57,307.69 iyo $60,284.61, iyadoo Bitcoin fiidkii Brussels lagu iibinayay ku dhawaad $59,849. Ethereum wuxuu ku dhawaaday $1,680, waxyar kor u kacay 24 saacadood kadib hoos u dhac hore oo ku wajahan $1,600.\n\nSababtu waxay ahayd tusmada qiimaha Personal Consumption Expenditures ee Oktoobar, oo ah cabbirka sicir bararka ee Federal Reserve ugu jecel yahay. US Bureau of Economic Analysis ayaa sheegtay in PCE price index-ka uu kor u kacay 0.3% Sebtembar iyo 3.8% sanadkii hore, kor uga kacay 3.7% Sebtembar. Marka laga reebo cuntada iyo tamarta, core PCE sidoo kale wuxuu kor u kacay 0.3% bishii iyo 3.3% sanadkii hore.\n\nCNBC ayaa sheegtay in 3.8% ay la mid tahay saadaasha Dow Jones, halka core PCE uu ka sareeyay saadaasha 0.1 percentage point. Akhrisku wuxuu ku dhow yahay labanlaab yoolka Fed-ka ee 2%. Cointelegraph ayaa sheegtay in 3.8% uu yahay kii labaad ee ugu sarreeya tan iyo Abriil 2023.\n\nSuuqyadu horay ayey u filayeen in dulsaarka kor loo qaado quarter point kulanka Fed-ka ee 8 ilaa 9 December, sida CNBC sheegtay.\n\nHantida khatarta leh si wada jir ah ayey u dhaqaaqday. Cointelegraph ayaa sheegtay in Nasdaq Composite Index uu hoos u dhacay 4.2% una gaaray 22,632 dhibic, S&P 500-na uu hoos u dhacay 2.7% markay ahayd 4:30 p.m. UTC, iyadoo ganacsatadu sidoo kale miisaamayeen tariffs cusub oo Maraykan ah oo u dhexeeya 15% iyo 20%. CoinDesk ayaa markii dambe sheegtay in Nasdaq uu hoos u dhicii hore ee 4.5% ka yareeyay 0.7% galabnimadii New York, S&P 500-na uu hoos u dhacay 0.35% keliya, iyadoo Bitcoin dib u qabsatay $60,000.\n\nIibinta ETF-yada Bitcoin ma joogsan. ETF-yada spot Bitcoin ee Maraykanka ayaa Talaadadii ka baxay ku dhawaad $231.6 milyan net, oo ah maalintii lixaad oo xiriir ah, sida xogta SoSoValue uga soo xigtay Cointelegraph. Qulqulka Nofeembar wuxuu gaaray $4.94 bilyan, oo ka sarreeya rikoorkii bishi hore ee $4.51 bilyan ee Juun. IBIT ee BlackRock ayaa Talaadadii ka baxday $175.30 milyan, sida xogta SoSoValue muujisay.\n\nGanacsatada leverage isticmaalaya ayaa la kulmay khasaare. CoinGlass waxay diiwaangelisay $512 milyan oo likwideyn crypto ah 24 saacadood, oo ay ku jiraan $416 milyan oo boosaska long ah, sida Cointelegraph sheegtay.\n\nGalaxy waxay ka noqotay baaqeedii Oktoobar ee ahaa in bear market-ka Bitcoin uu dhammaaday Juun, sida CoinDesk sheegtay. Shirkaddu hadda waxay daawanaysaa xiritaanka maalinlaha ee ka hooseeya $58,525, oo ah xiritaankii 30 Juun, calaamad ahaan in hoos kale uu imaan karo. Todoba xaaladood oo hore, jabinta noocaas ah waxaa ku xigay hoos u dhac kale oo ugu yaraan 17%, taasoo Galaxy tiri inay tilmaamayso ku dhawaad $48,500. Matt Mena oo ka tirsan 21Shares weli wuxuu arkayaa waddo ku wajahan $72,000 ilaa $80,000 kahor dhammaadka sanadka haddii sicir bararku qabooobo, sida CoinDesk sheegtay.\n\nWaxay ka dhigan tahay\n\nFadhiga Arbacada wuxuu muujiyay sidii Bitcoin ugu xidhan yahay sicir bararka Maraykanka iyo Fed-ka. Akhriska core PCE ee kulul wuxuu albaabka u furayaa kharashka deynta oo sareeya, taasoo cadaadis saartay saamiyada tech iyo crypto. Qulqulka rikoorka ah ee ETF-yada Nofeembar wuxuu muujinayaa in maalgashadayaasha waaweyn weli lacag ka qaadanayaan. Soo kabashadii dambe ee ku wajahan $60,000 waxay muujinaysaa in iibsadayaashu weli firfircoon yihiin marka hoos u dhac xooggan yimaado, laakiin jihada weyn weli cadaadis ayey ku jirtaa ilaa sicir bararku qabooobo ama qulqulku yaraado.\n\nNot financial advice — DYOR"];
for (const [language, entry, other] of [['en', pceEn, pceSo], ['so', pceSo, pceEn]]) {
  const [slug, title, summary, body] = entry;
  novemberMarketStories.push({
    slug, title, summary, category: 'Bitcoin', language, translationSlug: other[0],
    author: 'Zaki News', image: '/images/btc-pce-25.webp',
    image_alt: language === 'en'
      ? 'Bitcoin price graphic showing a low of $57,209 on 25 November 2026'
      : 'Jaantus qiimaha Bitcoin oo muujinaya hooska $57,209 25 Nofeembar 2026',
    published_at: '2026-11-25T20:40:00.000Z', updated_at: '2026-11-25T20:40:00.000Z', body
  });
}
