export const categories = ['Bitcoin', 'Ethereum', 'Markets', 'Regulation', 'Guides', 'Solana', 'XRP', 'BNB', 'Cardano', 'Dogecoin', 'Tether', 'Crypto', 'Stocks', 'Forex', 'Economy', 'Central Banks', 'Tech', 'Politics', 'Halal', 'Haram', 'Mashbooh', 'Education'];
export const categoryLabels = {Bitcoin:'Bitcoin', Ethereum:'Ethereum', Markets:'Suuqyada', Regulation:'Xeerarka', Guides:'Hagayaasha', Solana:'Solana', XRP:'XRP', BNB:'BNB', Cardano:'Cardano', Dogecoin:'Dogecoin', Tether:'Tether', Crypto:'Crypto', Stocks:'Saamiyada', Forex:'Forex', Economy:'Dhaqaalaha', 'Central Banks':'Bangiyada Dhexe', Tech:'Tignoolajiyada', Politics:'Siyaasadda', Halal:'Xalaal', Haram:'Xaaraan', Mashbooh:'Mashbooh',Education:'Waxbarasho'};
export const imageNames = ['bitcoin', 'ethereum', 'security', 'markets', 'regulation-capitol'];
const sample = (slug, title, summary, category, image, image_alt, body) => ({
  slug, title, summary, category, image: '/images/' + image + '.webp', image_alt,
  body, author: 'Zaki News', sample: true, published_at: null
});
export const samples = [
  sample('how-to-read-bitcoin-market-cycles', 'Sida loo fahmo wareegyada suuqa Bitcoin', 'Qiimuhu wuxuu sheegaa qayb ka mid ah sheekada. Eeg mugga ganacsiga, amaahda iyo dareenka suuqa si aad u hesho sawir dhammaystiran.', 'Bitcoin', 'bitcoin', 'Qadaadiic Bitcoin ah oo la sawiray', `Marka qiimaha Bitcoin kor u kaco, waxaa sababi kara dalab badan, amarro iib oo yar ama ganacsato xiraysa boosaskii ay hoos u dhaca ku saadaaliyeen. Jaantuska qiimaha oo keliya sababta ma sheego.

## Ka bilow ganacsiga tooska ah
Isbarbar dhig mugga ganacsiga ee dhowr suuq. Koror ka muuqda suuqyo badan iyo mid ku kooban hal suuq oo ganacsigiisu yar yahay waxay xambaarsan yihiin macne kala duwan. Hubi sida il kasta u ururiso xogta.

## Eeg amaahda iyo khidmadaha maalgelinta
Tirada heshiisyada weli furan waxay muujisaa hawsha ka socota suuqa heshiisyada ka farcama hantida. Khidmadaha maalgelintu waxay kaa caawin karaan inaad fahanto jihada ay ganacsatadu u badan yihiin. Habka xisaabintu suuqa ayuu ku kala duwan yahay.

## Isbarbar dhig waqtiyo isku dherer ah
Eeg isla cabbirrada toddobaadba toddobaadka ka dambeeya. Wareegyadii hore waxay kaa caawin karaan inaad weydiiso su’aalo wanaagsan, balse ma saadaaliyaan goorta qiimuhu dhaqaaqi doono.

## Sidee laba koror oo isku eg u kala duwanaan karaan?

Qiyaas in BTC laba maalmood oo kala duwan uu midkiiba 5% kacay. Isniintii mugga ganacsiga tooska ahi dhowr suuq ayuu ku labanlaabmay. Jimcihii dhaqdhaqaaqa ugu badan wuxuu ka yimid heshiisyada futures. Jaantusku labada maalmood isku si ayuu u ekaan karaa. Jimcaha waxaa habboon in la eego khidmadaha maalgelinta iyo boosaska khasabka lagu xiray ka hor inta aan kororka loo aanayn dad bitcoin urursanaya.

## Samee isbarbardhig aad ku celin karto

Dooro hal suuq, hal lammaane iyo hal waqti oo aad xogta qorto. Saddex maalmood isku xiga diiwaangeli qiimaha, mugga ganacsiga tooska ah iyo heshiisyada furan. Qor waxa isbeddelay iyo hal su’aal oo aysan tirooyinku weli ka jawaabin.`),
  sample('ethereum-layer-2-explained', 'Lakabka labaad ee Ethereum oo la sharaxay', 'Baro sida macaamillada la isugu geeyo iyo waxa la hubiyo ka hor inta aadan hanti u wareejin shabakad kale.', 'Ethereum', 'ethereum', 'Gacan haysa qadaadiic Bitcoin ah', `Shabakadaha lakabka labaad waxay macaamillo ka fuliyaan meel ka baxsan lakabka ugu weyn ee Ethereum. Waxay Ethereum u adeegsadaan diiwaangelinta ama xaqiijinta qaybo ka mid ah macaamillada. Habku shabakad kasta wuu ku kala duwan yahay.

## Sidee ayay rollups u shaqeeyaan?
Rollups waxay isu geeyaan macaamillo badan, dabadeedna xog ama raad xaqiijin ah ayay ku daabacaan Ethereum. Qaar waxay oggolaadaan in natiijo khaldan laga doodo. Qaar kalena waxay soo gudbiyaan caddayn xisaabeed. Eeg halka xogta lagu kaydiyo iyo cidda wax ka beddeli karta nidaamka.

## Ka hor inta aadan hanti wareejin
Hubi shabakadda aad u socoto, cinwaanka qandaraaska token-ka iyo habka lacagta loogala baxo. Tijaabo yar ku xaqiiji jidka ka hor inta aadan wareejin qaddar ka badan.

## Raac lacag kala bixid

Aamina saaxiib ayay lacag ugu dirtay rollup, kaddibna wixii haray waxay u celisay mainnet. Boorsadu waxay muujin kartaa in lacag-bixintii dhammaatay inta aysan buundadu weli u oggolaan inay kala bixidda dhammaystirto. Qor tallaabada ay sugayso. Lacag loo diro qof isla L2 jooga iyo lacag loo soo celiyo L1 waxay maraan jid kala duwan.

## Xisaabi kharashka safarka oo dhan

Tusaale ahaan, gelidda shabakaddu waa saddex doollar, wareejintu waa toban senti, soo noqoshaduna waa afar doollar. Hal safar iyo hal wareejin waxay ku kacayaan $7.10. Haddii dhowr wareejin la sameeyo inta lacagtu halkaas taallo, waxay wadaagaan kharashkii gelidda iyo ka bixidda.`),
  sample('wallet-security-basics', 'Waxa ay u baahan tahay inaad adigu maamusho boorsadaada crypto', 'Sida loo ilaaliyo ereyada soo kabashada, loo hubiyo oggolaanshaha loona diyaariyo kaydka boorsada.', 'Guides', 'security', 'Qadaadiic Bitcoin ah oo quful la ag dhigay', `Markaad adigu maamusho furayaasha boorsadaada, adiga ayaa oggolaada macaamillada. Adiga ayaana mas’uul ka ah soo celinta helitaanka boorsada haddii qalabkaagu lumo. Diyaari qorshaha soo kabashada ka hor inta aadan hanti ku kaydin.

## Ilaali ereyada soo kabashada
Raac tilmaamaha rasmiga ah ee soo saaraha boorsada. Ka fogee ereyada soo kabashada iimaylka, fariimaha iyo qoraallada daruurta lagu kaydiyo. Haddii qof kaa codsado ereyadaas, tilmaamaha si toos ah uga hubi bogga rasmiga ah.

## Akhri waxa aad saxiixayso
Oggolaanshaha token-ku wuxuu barnaamij siin karaa awood uu hantidaada ku isticmaalo mar dambe. Hubi shabakadda, qandaraaska iyo xaddiga aad oggolaanayso. Tijaabi qorshaha soo kabashada inta aad weli heli karto boorsada.

## Ka fikir haddii telefoonku kaa lumo

Haddii telefoonkaagu caawa xumaado, boorsadee ayaad adeegsanaysay? Halkee ka heli kartaa tilmaamaha soo celinta? Ma gaari kartaa kaydkaaga telefoonka la’aantiis? Warqad ku qor tallaabooyinka aad raacayso, kana reeb ereyada sirta ah. Qofka qorshaha akhriya waa inuu fahmi karaa habka isagoo aan awood u helin boorsada.

## U akhri oggolaanshaha sidii fasax

Boorsadu waxay ku weydiin kartaa inaad fasaxdo in token hadhow lagaa wareejiyo. Raadi magaca token-ka, cinwaanka loo fasaxayo iyo xadka qaddarka. Lacag yar oo tijaabo ah waxay hubisaa cinwaanka iyo shabakadda. Oggolaansho gaar ah oo kale wuxuu yeelan karaa saameyn ka duwan tan wareejintaas.`),
  sample('reading-crypto-market-liquidity', 'Sida loo fahmo awoodda wax lagu kala iibsan karo suuqa crypto', 'Amarrada jira iyo farqiga u dhexeeya dalabka iyo iibku waxay saameeyaan qiimaha macaamilkaaga.', 'Markets', 'markets', 'Dhismaha New York Stock Exchange', `Qiimaha ugu dambeeyay wuxuu kuu sheegaa halka uu ka dhacay macaamilkii ugu dambeeyay. Amarrada jira waxay kuu sheegaan qaddarka lagu kala iibsan karo meel u dhow qiimahaas.

## Eeg farqiga qiimaha iyo tirada amarrada
Farqigu waa masaafada u dhexeysa qiimaha iibsiga ee ugu sarreeya iyo qiimaha iibka ee ugu hooseeya. Si aad u qiyaasto inta amarkaagu u dhaqaajin karo qiimaha, eeg qaddarka laga heli karo dhowr heer oo qiime.

## Isbarbar dhig suuqyada
Khidmadaha, lacagta qiimaha lagu cabbiro iyo xaddidaadaha kala bixistu waxay beddeli karaan qiimaha aad dhab ahaan hesho. Isku waqti iyo isku lacag ku cabbir marka aad suuqyo isbarbar dhigto.

## Tusaale ka soo qaado buugga amarrada

Laba token ayaa midkiiba lagu bixinayaa $10, afarta xigtana $11. Iibsade dalbaday shan token wuxuu laba ku helayaa $10, saddexna $11. Wuxuu bixinayaa $53 khidmadaha ka hor. Celcelisku waa $10.60. Qiimaha ugu horreeyey ee shaashadda ka muuqday wuxuu ku filnaa qayb ka mid ah dalabka.

## Maxaa isbeddelaya haddii aad qiimaha xaddiddo?

Haddii xadka iibsigu yahay $10, laba token ayaa lagu heli karaa. Saddexda kale way sugi karaan haddii iibiyayaashu weli dalbanayaan $11. Marka aad rasiidka akhrinayso, isbarbar dhig tirada la dalbaday, tirada la helay iyo celceliska qiimaha.`),
  sample('reading-crypto-policy-updates', 'Sida loo akhriyo wararka ku saabsan xeerarka crypto', 'Hubi heerka go’aanka, cidda uu khuseeyo iyo goorta uu dhaqan gelayo.', 'Regulation', 'regulation-capitol', 'Dhismaha Capitol-ka Maraykanka xilliga fiidkii', `Cinwaannada wararku waxay mararka qaar isku ekaysiiyaan soo jeedin, codbixin iyo go’aan dhaqan galay. Ka bilow dukumentiga rasmiga ah oo hubi nooca tallaabada la qaaday.

## Hubi cidda uu khuseeyo
Akhri qeexitaannada. Eeg waddanka ama gobolka, hay’adaha iyo hawlaha uu xeerku daboolayo. Raadi ka-dhaafitaannada iyo xadka uu xeerku ka bilaabmo.

## Hel taariikhda uu dhaqan gelayo
Taariikhda daabacaadda, taariikhda codbixinta iyo taariikhda dhaqan-galku way kala duwanaan karaan. Kaydi xiriirka dukumentiga asalka ah iyo taariikhda cusboonaysiintiisa.

## Saddex taariikhood saf u dhig

Qiyaas in la-tashi furmay Maarso, faallooyinku xirmeen Maajo, go’aankii u dambeeyeyna soo baxay Sebtembar. War Maarso qoray fikradaha dadweynaha kama soo saari kartid waxa go’aankii ugu dambeeyey farayo. Akhri dukumentigii jiray maalintii warka, dabadeed raadi go’aannadii ama wax-ka-beddelladii ka dambeeyey.

## Qor weedh ay ishu taageerayso

Ogeysiiska asalka ah ka raadi hay’adda soo saartay, dadka lala hadlayo, tallaabada la doonayo iyo waqtiga loo qabtay. Haddii ay hay’addu codsanayso faallo, sidaas u sheeg. Haddii ay waajibinayso tallaabo, xigso qaybta sheegaysa waqtiga loo qabtay. Meesha aan jawaab cad laga helin su’aal ahaan u dhaaf.`)
];

export const englishSamples = [
  sample('how-to-read-bitcoin-market-cycles-en', 'How to read Bitcoin’s market cycles', 'Price tells only part of the story. Here’s a framework for reading liquidity, leverage and sentiment together.', 'Bitcoin', 'bitcoin', 'Photographed Bitcoin medallions', `A rising Bitcoin price can reflect a burst of demand, a thin order book, or a wave of short positions being closed. The price chart alone cannot tell you which one is driving a move. Before attaching a story to a candle, look at the market around it.

## Start with spot trading
Compare the move with trading volume across several venues. A broad rise in spot activity carries a different signal from a sharp move on one thinly traded exchange. Volume can also be unreliable, so check how each source collects and filters its data.

## Check leverage and funding
Open interest measures outstanding derivative positions. Funding rates on perpetual futures can show how traders are positioned, though the rates and formulas vary by exchange. An abrupt move that coincides with large liquidations can reflect forced orders as well as changes in demand.

## Treat cycles as a framework
Compare the same metrics over consistent time windows and record what would change your interpretation. Past price cycles can suggest questions to ask. They cannot establish a timetable for the next move.

## What would two similar rallies look like?

Imagine BTC rises 5% on two different days. On Monday, several spot markets trade twice their usual volume. On Friday, most of the extra activity appears in perpetual futures. The price chart looks similar. On Friday you have a stronger reason to examine funding rates and forced closures before attributing the rise to buyers accumulating bitcoin.

## Build a comparison you can repeat

Pick one exchange, one currency pair and one closing time. For three consecutive days, record price, spot volume and open interest from the same sources. Write a sentence about what changed and a second sentence about what you still cannot explain. The second sentence keeps a plausible story from turning into a claim the data cannot support.`),
  sample('ethereum-layer-2-explained-en', 'Ethereum’s layer-2 ecosystem, explained', 'A practical guide to rollups, settlement and what to check before moving funds across networks.', 'Ethereum', 'ethereum', 'Hand holding a Bitcoin medallion', `Layer-2 networks process transactions outside Ethereum’s main execution layer and use Ethereum for parts of settlement or verification. The details differ by network, so the label alone tells you little about how a specific deposit or withdrawal works.

## Where rollups fit
Rollups group transactions and post data or commitments to Ethereum. Optimistic and validity rollups use different methods for verifying state changes. The data availability design and the way the system can be upgraded also matter.

## Before you bridge
Check the destination network and the token contract. Review the official withdrawal process, expected wait times and what happens if an operator goes offline. A small test transaction can confirm the route before you send a larger amount.

## Follow a withdrawal

Amina pays a friend on a rollup and later withdraws the rest to mainnet. The wallet can mark the payment complete well before the bridge lets her claim the withdrawal. Write down which action she is waiting for. A payment to another L2 user and a claim on L1 follow different paths.

## Estimate the cost of the round trip

Suppose the bridge into a network costs three dollars, an example transfer costs ten cents and the return journey costs four dollars. One visit and one transfer would cost $7.10 under those assumptions. Several transfers during the same visit share the entry and exit costs. Replace each example fee with the wallet’s estimate before comparing routes.`),
  sample('wallet-security-basics-en', 'What self-custody actually requires', 'A security checklist for recovery phrases, transaction approvals and hardware wallets.', 'Guides', 'security', 'Bitcoin medallion and padlock', `Self-custody gives you control of the keys used to authorize transactions. It also makes recovery your responsibility. Plan how you will restore access before you store funds.

## Protect recovery information
Follow the wallet manufacturer’s verified backup instructions. Keep recovery words out of chat, email and cloud notes. Verify instructions directly through the manufacturer’s official site when someone claims you must enter your recovery words.

## Read what you sign
A token approval can give an application permission to spend an asset later. Verify the network, contract and approval amount on the device where possible. Keep a tested recovery plan that someone you trust can follow if you become unable to use the wallet.

## Walk through a lost-phone scenario

Imagine your phone stops working tonight. Which wallet did you use? Where are its documented recovery instructions? Could you find the backup without the phone? Write down the recovery steps on paper and leave the secret words out of that plan. Someone reading the plan should understand the process without gaining control of the wallet.

## Read an approval as a permission

A wallet prompt may ask for permission to spend a token later. Look for the token, the spender address and the maximum allowance. Sending a small test payment checks an address and network. It does not tell you what a separate approval will allow tomorrow.`),
  sample('reading-crypto-market-liquidity-en', 'Why liquidity matters more than a headline price', 'Order-book depth and spreads can change the price you actually receive when an order executes.', 'Markets', 'markets', 'New York Stock Exchange building', `The last price tells you where the most recent trade occurred. Order-book depth tells you how much could trade near that price at a particular moment. Both are useful, especially when comparing the same asset across exchanges.

## Look at spreads and depth
The spread is the gap between the best bid and offer. To estimate how much an order might move the market, examine the size available across several price levels. Liquidity can disappear quickly when market conditions change.

## Compare venues carefully
Quote currencies, fees and withdrawal constraints affect the price you can realize. Compare depth at the same time and in the same currency where possible. A single screenshot is a snapshot of conditions at one venue.

## Work through an order book

Imagine two tokens are offered at $10 each and the next four at $11. A market buy for five tokens takes two at $10 and three at $11. The buyer pays $53 before fees, an average of $10.60. The first displayed offer was available for only part of the order.

## What changes with a limit order?

A buy limit of $10 would allow the first two tokens to fill. The other three could remain unfilled if sellers keep asking $11. To read an execution report, compare the quantity requested, the quantity filled and the average price. Each answers a different question about the trade.`),
  sample('reading-crypto-policy-updates-en', 'How to read a crypto policy update', 'A five-minute guide to checking status, scope and dates in a regulatory announcement.', 'Regulation', 'regulation-capitol', 'United States Capitol at dusk', `Headlines often compress proposals, votes and enforcement decisions into the same language. Start with the official document and identify what action it records.

## Check its scope
Read the definitions and identify the jurisdiction, entities and activities covered. Look for exemptions and thresholds before applying a rule broadly.

## Find the effective date
Publication dates, vote dates and effective dates can differ. Keep a link to the primary document and note when it was published or last updated.

## Put three dates on a timeline

Imagine a consultation opens in March, comments close in May and the regulator publishes a final decision in September. A March story reporting public feedback cannot establish what the final rule requires. Read the document available on the date of the story and then look for later decisions or amendments.

## Write a sentence the source supports

Try completing this sentence from the original notice. The issuing authority asks a particular group to take a particular action by a particular date. If the document asks for comments, use that verb. If it sets a deadline for compliance, name the section that sets it. Keep unresolved points as questions for your next reading.`)
].map(article=>({...article,language:'en'}));

const screeningDate='2026-11-18T09:00:00.000Z';
export const screeningPhotos=[
  ['Woman_holding_a_Bitcoin_physical_coin_and_showing_thumbs_up.jpg','Shixart1985','by/2.0','8/88'],
  ['Close-up_of_a_physical_Ethereum_coin_(51002904687).jpg','Ivan Radic','by/2.0','1/1d'],
  ['Dogecoin_gold_coin_black_background_1_-_tails.jpg','Cyril Ernst','by-sa/4.0','5/5d']
];
const screeningStory=(slug,title,summary,category,photo,image_alt,body)=>{
  const [file,photographer,license,folder]=screeningPhotos[photo];
  const image='https://upload.wikimedia.org/wikipedia/commons/thumb/'+folder+'/'+encodeURIComponent(file)+'/960px-'+encodeURIComponent(file);
  const credit='\n\nSawir: ['+photographer+'](https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file).replaceAll('(','%28').replaceAll(')','%29')+') · [CC '+license+'](https://creativecommons.org/licenses/'+license+'/).';
  return {slug,title,summary,category,image,image_alt,body:body+credit,author:'Zaki News',language:'so',published_at:screeningDate,updated_at:screeningDate};
};
export const screeningStories=[
  screeningStory('crypto-xalaal-bitcoin-ethereum-solana','Maxaa Bitcoin, Ethereum iyo Solana uga dhigay tusaalooyin crypto xalaal ah?','Sida loo baaro shaqada coin-ka, habka lagu iibsado iyo adeegyada lagu isticmaalo, iyadoo Bitcoin, Ethereum iyo Solana tusaale loo qaadanayo.','Halal',0,'Qof gacanta ku haya qadaadiic Bitcoin oo astaan ah',`## Waxa marka hore la baaro

Bitcoin (BTC) waxaa loo isticmaalaa in qiime lagu kala wareejiyo shabakaddiisa. Ethereum (ETH) iyo Solana (SOL) waxay sidoo kale leeyihiin lacag u gaar ah oo lagu bixiyo khidmadaha shabakadda. HalalScreener wuxuu saddexdan coin ku taxaa tusaalooyinkiisa xalaasha ah. Zaki News wuxuu u adeegsadaa liiskaas tixraac marka uu soo bandhigayo tusaalooyinka qaybta.

## Coin-ka iyo habka lagu isticmaalo

Marka coin la baarayo, kala saar shaqada uu qabto iyo heshiiska aad adigu galayso. Iibsashada coin-ka oo aad si toos ah u yeelanayso waxay leedahay shuruudo ka duwan qandaraas futures ah ama amaah dulsaar leh. Ethereum iyo Solana waxay martigelin karaan adeegyo kala duwan, sidaas darteed waa in adeeg kasta si gaar ah loo eego.

## Sida loo akhriyo calaamadda Xalaal

Eeg cidda samaysay baaritaanka, waxa ay qiimaysay iyo taariikhda. Kooxaha baaritaanka waxay ku kala duwanaan karaan sida ay u qiimeeyaan hanti gaar ah ama hab loo isticmaalo. Calaamadda boggan waxay soo koobaysaa habka baaritaanka ee isha la xusay. Su’aal ku saabsan heshiis gaar ah u gudbi qof ku takhasusay maaliyadda Islaamka.

## Tusaale laba adeeg oo isku coin adeegsada

Aamina waxay ETH ugu bixisay khidmadda shabakadda si ay token ugu dirto walaasheed. Maalin kale waxaa loo soo bandhigay heshiis ay ETH ku wareejinayso muddo cayiman oo ay ku helayso lacag dheeraad ah. Labada hawloodba magaca ETH ayaa ku jira. Si aad u fahamto kan labaad, qor cidda haysa lacagta, cidda bixinaysa wixii dheeriga ah iyo shuruudda lacagta lagu soo celinayo. Calaamadda coin-ka keliya kama jawaabayso su’aalaha heshiiska.

## Ilaha

[HalalScreener · Liiska crypto xalaasha ah](https://halalscreener.app/en/halal-crypto) · [Ethereum · Waa maxay ETH?](https://ethereum.org/en/eth/)`),
  screeningStory('crypto-xaaraan-defi-aave-compound','Waa maxay sababta Zaki News DeFi ugu daro qaybta Xaaraan?','Aave, Compound iyo Uniswap waxay tusaale u yihiin sababta loo eego waxa borotokoolku qabto ka hor inta aan la qiimayn token-kiisa.','Haram',1,'Qadaadiic astaan u ah Ethereum oo dul saaran lacag bir ah',`## Amaahda iyo dulsaarka

Qaar ka mid ah borotokoollada DeFi waxay isu keenaan amaah-bixiyeyaal iyo amaah-qaateyaal. Aave iyo Compound waxay tusaale u yihiin suuqyo ay heerarka dulsaarku isbeddeli karaan iyadoo la eegayo isticmaalka. Marka la baarayo ribada, su’aal muhiim ah ayaa ah in lacag dheeraad ah lagu leeyahay sababta oo ah heshiiska amaahda.

## Maxay xeerka Zaki News ku jiraan adeegyada kale?

Uniswap wuxuu bixiyaa is-weydaarsi ku shaqeeya barkado dareere ah. Zaki News wuxuu siyaasaddiisa tifaftirka ku daraa tokennada borotokoollada DeFi qaybta Xaaraan, oo ay ku jiraan AAVE, COMP iyo UNI. Siyaasaddaas waxay isticmaashaa kala-sooc guud. Aave iyo Uniswap waxay qabtaan hawlo kala duwan, sidaas darteed baaritaanka adeeg gaar ah wuxuu u baahan yahay in dib loo eego heshiiskiisa.

## Akhri dukumentiyada

Raadi halka khidmadaha iyo abaalmarintu ka yimaadaan. Hubi cidda bixisa, shuruudaha la raacayo iyo waxa dhacaya marka qiimaha dammaanaddu hoos u dhaco. Dukumentiyada borotokoolka ayaa kuu sheegaya sida adeeggu u shaqeeyo. Kala-soocidda halkan waa siyaasadda tifaftirka ee Zaki News.

## Laba bog oo isku eray adeegsada

Laba barnaamij ayaa shaashadda ku qoray “earn”. Mid wuxuu sharxayaa in isticmaalayaashu amaah bixiyaan. Kan kale wuxuu sheegaya in qayb ka mid ah khidmadaha sarifka loo qaybiyo dadka barkad maalgeliyey. Qor farqiga ka hor intaadan calaamadda Zaki News adeegsan. Labaduba waxay ku dhacayaan xeerka guud ee DeFi ee boggan, balse sababta iyo meesha lacagtu ka imanayso isku mid ma aha.

## Ilaha

[Aave · Dukumentiyada](https://aave.com/docs) · [Compound · Dukumentiyada](https://docs.compound.finance/) · [CoinGecko · Qaybta DeFi](https://www.coingecko.com/en/categories/decentralized-finance-defi)`),
  screeningStory('crypto-mashbooh-doge-shib-pepe','Maxaa DOGE, SHIB iyo PEPE uga dhigaya Mashbooh habka Zaki News?','Sida loo baaro meme coins marka qiimahooda iyo baahidoodu ku tiirsanaan karaan baraha bulshada iyo mala-awaalka suuqa.','Mashbooh',2,'Qadaadiic Dogecoin oo dahabi ah oo laga sawiray dhinaca dambe',`## Waa maxay Mashbooh?

Mashbooh waa calaamadda Zaki News u adeegsado coin u baahan baaritaan dheeraad ah. Siyaasadda boggu waxay meme coins ku dartaa qaybtan. Tusaalooyinka waxaa ka mid ah Dogecoin (DOGE), Shiba Inu (SHIB) iyo Pepe (PEPE). Saddexduba waxay leeyihiin taariikh, adeegyo iyo qaab qaybsi oo kala duwan.

## Maxaa u baahan baaritaan?

Isbeddel degdeg ah oo ka yimaadda faafitaanka baraha bulshada wuxuu adkayn karaa in la kala garto isticmaalka jira iyo dalabka mala-awaalka ah. Eeg sida sahaydu u qaybsan tahay, inta ka urursan cinwaanno gaar ah, sida token-ka looga bixi karo suuqa iyo waxa dukumentiyada mashruucu sheegayaan. Hubi cinwaanka qandaraaska iyo shabakadda haddii token-ku ku shaqeeyo qandaraas.

## Tusaale la fahmi karo

Dogecoin wuxuu leeyahay shabakad lacag lagu kala wareejiyo. Haddii mashruuc kale oo meme ah uu xayeysiiyo adeeg ama abaalmarin cusub, dukumentiyada iyo heshiisyada adeeggaas si gaar ah u eeg. Calaamadda Mashbooh ee Zaki News waxay muujinaysaa halka baaritaan dheeraad ahi ka bilaabmo.

## Hubi sheegasho ku dhex wareegaysa bulshada

Qof ayaa qoray in hal cinwaan haysto rubuc sahayda token-ka. Raadi shabakadda, cinwaanka token-ka iyo taariikhda xogta. Cinwaanka weyn wuxuu noqon karaa boorso sarifle oo lacag dad badan haysa. Wuxuu kaloo noqon karaa kayd uu hal qof maamulo. Diiwaanku wuxuu kuu sheegi karaa inta cinwaanka ku jirta, laakiin aqoonsiga milkiilayaasha u dambeeya wuxuu u baahan yahay caddeyn kale. Qor waxa aad xaqiijisay iyo waxa weli u baahan baaritaan.

## Ilaha

[Dogecoin · Bogga mashruuca](https://dogecoin.com/) · [CoinGecko · Qaybta meme coins](https://www.coingecko.com/en/categories/meme-token)`)
];
