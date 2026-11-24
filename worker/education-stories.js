const educationPhotos = [
  ['Ethereum_Crypto_Sustainability.jpg','Edwin.images','by-sa/4.0'],
  ['Trezor_display_transaction.jpg','Stickac','by-sa/4.0'],
  ['Mining_rig-a61ELON.jpg','Vysulo','by-sa/4.0']
];
const lessonPairs = [
  {
    image:'coin-and-token',
    sources:[
      ['Bitcoin.org','https://bitcoin.org/en/how-it-works'],
      ['Ethereum · ERC-20','https://ethereum.org/developers/docs/standards/tokens/erc-20/'],
      ['Ethereum · Gas','https://ethereum.org/developers/docs/gas/']
    ],
    so:{
      slug:'farqiga-coin-iyo-token',
      title:'Coin iyo token maxay ku kala duwan yihiin?',
      summary:'Laba lacagood ayaa hal boorso ku wada jiri kara, mid walbana shaqo gaar ah ayay qaban kartaa. ETH iyo token ku shaqeeya Ethereum ayaa tusaale kuu ah.',
      alt:'Qadaadiic astaan u ah Ethereum oo dhex taalla dhir',
      body:`## Lacagta ay shabakaddu leedahay

Bitcoin wuxuu leeyahay BTC, Ethereum-na wuxuu leeyahay ETH. Haddii aad BTC ku dirto shabakadda Bitcoin, khidmaddu waxay ku baxdaa BTC. Ethereum marka aad isticmaasho, shaqada ay shabakaddu qabato waxaa lagu cabbiraa gas, kharashkeedana waxaa lagu bixiyaa ETH.

## Halkee ayuu token-ku ka yimaadaa?

Ethereum gudaheeda waxaad ku abuuri kartaa token adigoo adeegsanaya qandaraas caqli leh, oo ah barnaamij ku shaqeeya shabakadda. Heerka ERC-20 wuxuu qeexaa sida barnaamijyadu u weydiin karaan haraaga qofka ama u codsan karaan wareejin. Cinwaanka qandaraaska iyo shabakadda ayaa kuu sheegaya token-ka aad eegayso. Laba token ayaa yeelan kara isku magac ama isku sumad.

## Tusaale boorso

Sahra waxay boorsadeeda Ethereum ku haysataa 30 token, haraageeda ETH-na waa eber. Waxay arki kartaa dhammaan 30-ka token. Haddii ay rabto inay 5 token ku dirto macaamil caadi ah oo ay iyadu khidmaddiisa bixinayso, waxay u baahan tahay ETH ay kharashka shabakadda ku daboosho. Kahor dirista, waxay hubisaa shabakadda, cinwaanka qandaraaska iyo qiyaasta khidmadda ee boorsadu muujiso.

## Sidee loo kala gartaa laba token oo isku magac ah?

Boorsadaada waxaa ka soo muuqday laba token oo isku summad ah. Fur xogta mid kasta oo qor shabakadda iyo cinwaanka qandaraaska. Barbar dhig cinwaanka ku qoran dukumentiga soo saaraha. Qof ayaa samayn kara token magac iyo sawir hore u jiray wata. Cinwaanka iyo shabakadda ayaa kuu kala saaraya labadaas hanti.

## Maxaa ku dhacaya khidmadda?

Haddii aad 25 token dirto, qofka qaataha ahi wuxuu heli karaa 25 halka haraaga ETH ee boorsadaadu yaraado. Akhri labada isbeddel. Mid wuxuu ka dhashay wareejinta token-ka, kan kalena wuxuu ka dhashay khidmadda shabakadda.`
    },
    en:{
      slug:'native-coins-and-tokens',
      title:'What is the difference between a coin and a token?',
      summary:'A wallet can hold two assets with different jobs. ETH and a token issued on Ethereum show how network fees and token balances fit together.',
      alt:'An Ethereum medallion resting among green plants',
      body:`## The network’s own currency

Bitcoin has BTC and Ethereum has ETH. When you send BTC on the Bitcoin network, the fee is paid in BTC. On Ethereum, the network measures computational work in gas and charges for it in ETH.

## Where a token comes from

On Ethereum, a developer can issue a token through a smart contract, a program that runs on the network. The ERC-20 standard defines how other programs can query a balance or request a transfer. To identify a particular token, check the network and the contract address. Different issuers can use the same name or ticker.

## A wallet example

Sahra has 30 tokens in her Ethereum wallet and an ETH balance of zero. She can see all 30 tokens. To send five in a regular transaction for which she pays the fee herself, she needs enough ETH to cover the network charge. Before sending, she checks the network, the token’s contract address and the fee estimate shown by her wallet.

## How do you distinguish two tokens with the same name?

Suppose two entries in a wallet share a symbol and logo. Open the asset details for each and record the network and contract address. Compare them with the address published by the issuer. Anyone can reuse a familiar name in a new token contract. The same display name can therefore point to two separate balance records.

## Reconcile a transfer

A wallet sends 25 tokens. The recipient receives 25, while the sender’s ETH balance also falls slightly. Account for those movements separately. The token contract recorded a transfer between holders. The network charged the fee payer for including and executing the transaction.`
    }
  },
  {
    image:'transaction-hash',
    sources:[['Ethereum · Block explorers','https://ethereum.org/developers/docs/data-and-analytics/block-explorers/'],['Ethereum · Transactions','https://ethereum.org/developers/docs/transactions/']],
    so:{
      slug:'sida-loo-hubiyo-macaamil-blockchain',
      title:'Sida aad lambarka macaamilka ugu hubin karto lacag la diray',
      summary:'Raac macaamil Ethereum ah adigoo eegaya shabakadda, xaaladda, qadarka iyo cinwaanka qaataha. Waxaad ku tababaran kartaa macaamil dadweyne.',
      alt:'Shaashad boorso qalab ah oo muujinaysa faahfaahinta macaamil Bitcoin ah',
      body:`## Ku bilow aqoonsiga macaamilka

Marka boorso macaamil dirto, waxay ku tusi kartaa aqoonsi loo yaqaan transaction hash ama TxID. Ka soo guuri taariikhda macaamillada boorsada. Fur bogga xogta shabakaddaas lagu baaro, oo loo yaqaan block explorer, kadibna geli aqoonsiga raadinta. Eegista xogtan dadweynaha ah uma baahna inaad boorso ku xirto.

## Maxaa shaashadda laga akhriyaa?

Haddii aad aragto Pending, macaamilku weli wuxuu sugayaa in lagu daro baloog. Marka lagu daro, eeg lambarka baloogga iyo natiijada fulinta. Macaamil Ethereum ah oo calaamaddiisu tahay Failed wuu geli karaa baloog, khidmadna way ku bixi kartaa, iyadoo wareejintii la rabay fashilantay.

## Tijaabi adigoon lacag dirin

Fur macaamil hore oo token ERC-20 ah. Eeg qaybta Token Transfers oo ka akhri cinwaanka qaataha, qaddarka iyo token-ka. Dabadeed eeg Value. Halkaas waxaa ka muuqan kara 0 ETH iyadoo token-no la wareejiyey, sababtoo ah Value wuxuu cabbiraa ETH-ga asalka ah ee lala diray macaamilka. Haddii aad sugayso lacag, barbar dhig faahfaahinta wareejinta iyo cinwaankaaga oo dhan.

## Rasiid guulaystay, laakiin akoonku weli ma buuxsamin?

Haddii aad sarifle lacag u dirtay, shabakaddu way xaqiijin kartaa ka hor inta uusan sarifluhu akoonkaaga ku darin. Qor shabakadda, cinwaanka lacag-dhigista iyo tirada xaqiijimaha. Kaddib eeg shuruudaha lacag-dhigista ee adeegga. Rasiidka iyo warbixinta akoonku waxay tilmaamayaan laba marxaladood oo kala duwan.

## Sidee qof kale loogu tusaa waxa dhacay?

La wadaag lambarka macaamilka iyo magaca shabakadda. Qofka kale wuxuu si madax-bannaan u furi karaa rasiidka oo u eegi karaa qaddarka iyo cinwaanka. Furaha gaarka ah wax shaqo ah kuma laha raadinta rasiid dadweyne.`
    },
    en:{
      slug:'how-to-check-a-transaction-hash',
      title:'How to check a payment with its transaction hash',
      summary:'Follow an Ethereum transaction from its hash to its status, recipient and transfer amount. You can practise with a public transaction.',
      alt:'A hardware wallet screen displaying details of a Bitcoin transaction',
      body:`## Start with the transaction ID

After a wallet broadcasts a transaction, it can show a transaction hash, also called a TxID. Copy it from the wallet’s activity history. Open a block explorer for the same network and paste the hash into its search box. You can read this public record without connecting a wallet.

## Read the result

Pending means the transaction is waiting to enter a block. Once included, look for its block number and execution status. An Ethereum transaction marked Failed can appear in a block and incur a network fee even though the intended transfer did not go through.

## Try it without sending funds

Open a past ERC-20 transfer. In Token Transfers, find the recipient, amount and asset. Now check the Value field. It can show 0 ETH even when tokens moved, because it measures the native ETH sent with the transaction. If you are checking a payment, compare the transfer details with the full address you supplied.

## Why might a confirmed deposit still be missing?

An exchange can credit a customer’s account after the network has already included the payment. Record the destination address, network, amount and confirmation count. Then check the receiving service’s deposit instructions. A block explorer answers whether funds moved on-chain. The exchange’s account history answers whether it has credited its customer.

## Show someone the evidence

Share the transaction ID together with the network name. The recipient can independently open a public explorer and compare the amount and destination. A screenshot of a wallet’s Send screen captures intent. The confirmed receipt records what actually executed.`
    }
  },
  {
    image:'etc-mining',
    sources:[['Ethereum Classic · FAQ','https://ethereumclassic.org/faqs/users/'],['Ethereum Foundation · July 2016','https://blog.ethereum.org/en/2016/07/20/hard-fork-completed'],['Ethereum · The Merge','https://ethereum.org/roadmap/merge/']],
    so:{
      slug:'waa-maxay-ethereum-classic-etc',
      title:'Ethereum Classic (ETC) iyo Ethereum (ETH) maxay ku kala duwan yihiin?',
      summary:'Labada shabakad waxay wadaagaan taariikh hore. Baro halka ay ku kala bexeen, sida baloog kasta loo abuuro iyo khidmadda lagu bixiyo shabakad kasta.',
      alt:'Qalab kombiyuutar oo ku rakiban xarun yar oo macdanta crypto lagu qodo',
      body:`## Hal taariikh oo laba waddo u kala baxday

Bishii Luulyo 2016, bulshada Ethereum waxay ku kala aragti duwanaatay sidii wax looga qaban lahaa hantidii ka baxday mashruuc la oran jiray The DAO. Qayb ka mid ah bulshada waxay qaadatay wax ka beddel suurtogeliyey in lacagihii loo raro qandaraas dadka ay khusaysay ay ka soo ceshan karaan. Qayb kale waxay sii waday taariikhdii shabakadda iyadoo aan qaadan isbeddelkaas. Silsiladdaas waxaa maanta loo yaqaan Ethereum Classic.

## Yaa soo saara baloogga xiga?

Ethereum Classic wuxuu adeegsadaa proof-of-work. Dadka qalabka wax ku qoda waxay isticmaalaan awood xisaabeed si ay ugu tartamaan soo saaridda baloog. Ethereum wuxuu sannadkii 2022 u wareegay proof-of-stake. Xaqiijiyeyaashiisu waxay dammaanad ahaan u dhigtaan ETH si ay uga qaybqaataan soo jeedinta iyo xaqiijinta baloogyada.

## Waxa ay tani uga dhigan tahay boorsadaada

Shabakadda Ethereum Classic waxaa khidmadaha lagu bixiyaa ETC. Ethereum mainnet waxaa lagu bixiyaa ETH. Haddii qof kuu soo diro cinwaan ku bilaabma 0x, muuqaalkiisa oo keliya kama garan kartid shabakadda uu qaatahu taageero. Marka hore isla xaqiiji shabakadda lagu heshiiyey. Tusaale ahaan, deebaaji ku qoran Ethereum Classic (ETC) wuxuu u baahan yahay wareejin ku socota shabakadda Ethereum Classic.

## Muxuu cinwaan isku eg kuu sheegi karaa?

Ka soo qaad in isla furahaagu maamulo cinwaan ku yaal Ethereum iyo Ethereum Classic. Cinwaanku labada dhinac wuu isku ekaan karaa, laakiin xisaabtu waxay ku jirtaa laba diiwaan. Wareejin ETC ah cinwaankaas ugu dhacday waxay ka muuqan doontaa diiwaanka Ethereum Classic. Boorsada oo Ethereum keliya ku furan waxay weli muujin kartaa haraag eber ah.

## Tijaabo aad samayn karto

Eeg shaashadda lacag-dhigista adeeg aad isticmaasho. Raadi summadda lacagta, magaca shabakadda iyo tilmaamaha xaqiijinta. Qor saddexdaas waxyaalood. Haddii aad haysato cinwaanka oo keliya, weli macluumaad ayaa kaa maqan.`
    },
    en:{
      slug:'ethereum-classic-etc-and-ethereum-eth',
      title:'How does Ethereum Classic (ETC) differ from Ethereum (ETH)?',
      summary:'The chains share an early history. Learn where they split, who produces their blocks and which currency pays the fees on each network.',
      alt:'Computer hardware assembled in a small cryptocurrency mining rig',
      body:`## One history, two paths

In July 2016, the Ethereum community disagreed over how to handle funds taken from a project called The DAO. Some participants adopted a change that moved the affected funds into a withdrawal contract for eligible holders. Others continued running the chain without that change. The latter chain became known as Ethereum Classic.

## Who produces the next block?

Ethereum Classic uses proof of work. Miners commit computing power to compete to produce a block. Ethereum moved to proof of stake in 2022. Its validators put ETH at stake to participate in proposing blocks and attesting to them.

## What this means for your wallet

Ethereum Classic charges network fees in ETC. Ethereum mainnet charges them in ETH. A receiving address starting with 0x can look the same on either network. Verify which chain the recipient supports before sending. For example, a deposit explicitly labelled Ethereum Classic (ETC) calls for a transfer on the Ethereum Classic network.

## What can an identical address tell you?

Imagine that the same key controls an address on both networks. Although the text of the address matches, its balance belongs to a particular chain. A transfer of ETC changes the Ethereum Classic ledger. A wallet looking only at Ethereum may still show a zero balance. Switching the network view changes which ledger the software reads.

## Check a deposit screen

Find the asset ticker, network name and confirmation instructions on a deposit page. Write down all three before comparing it with a wallet receipt. A matching address alone leaves open the question of which chain the receiving service monitors.`
    }
  }
];
const educationStories = lessonPairs.flatMap((lesson,index)=>['so','en'].map(language=>{
  const entry=lesson[language], other=lesson[language==='so'?'en':'so'];
  const [file,photographer,license]=educationPhotos[index];
  const credit='['+photographer+'](https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file)+')'+(index===0?' · [Bybit](https://www.bybit.com/en-US/)':'')+' · [CC BY-SA 4.0](https://creativecommons.org/licenses/'+license+'/).';
  return {slug:entry.slug,title:entry.title,summary:entry.summary,category:'Education',language,
    translationSlug:other.slug,author:'Zaki News',image:'/images/'+lesson.image+'.webp',image_alt:entry.alt,
    published_at:'2026-11-18T14:00:00.000Z',updated_at:'2026-11-18T14:00:00.000Z',
    body:entry.body+'\n\n## '+(language==='en'?'Sources':'Ilaha')+'\n\n'+lesson.sources.map(([label,url])=>'['+label+']('+url+')').join(' · ')+'\n\n'+(language==='en'?'Photo resized for the web by Zaki News. Original by ':'Zaki News ayaa sawirka u yareeyey webka. Sawirkii asalka ahaa waxaa qaaday ')+credit};
}));
