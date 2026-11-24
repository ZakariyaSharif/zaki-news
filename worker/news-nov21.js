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
