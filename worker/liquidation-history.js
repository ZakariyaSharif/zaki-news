const okxRoot='https://www.okx.com/api/v5/public/';
const liquidationAssets=['BTC','ETH','SOL','XRP','DOGE','ADA','BNB','AVAX','LINK'];
function normalizeOKX(payload,asset,contractSize,minTime,maxTime){
  if(payload?.code!=='0'||!Array.isArray(payload.data))throw Error('Invalid OKX response');
  const result=[];
  for(const instrument of payload.data){
    if(instrument.instId!==asset+'-USDT-SWAP'||!Array.isArray(instrument.details))continue;
    for(const row of instrument.details){
      const time=Number(row.ts),size=Number(row.sz),price=Number(row.bkPx);
      const amount=size*contractSize*price;
      if(!Number.isSafeInteger(time)||time<minTime||time>maxTime||!Number.isFinite(amount)||amount<=0||!['long','short'].includes(row.posSide))continue;
      result.push(['okx:'+asset+':'+time+':'+row.posSide+':'+row.sz+':'+row.bkPx,asset,row.posSide,time,amount,price]);
    }
  }
  return result;
}
let okxContracts;
function contractSpecs(){
  if(okxContracts&&okxContracts.until>Date.now())return okxContracts.value;
  const request=remote(okxRoot+'instruments?instType=SWAP').then(payload=>{
    if(!Array.isArray(payload?.data))throw Error('Invalid OKX specs');
    const specs={};
    for(const asset of liquidationAssets){
      const item=payload.data.find(i=>i.instId===asset+'-USDT-SWAP'&&i.ctValCcy===asset&&i.ctType==='linear');
      const size=Number(item?.ctVal)*Number(item?.ctMult||1);
      if(Number.isFinite(size)&&size>0)specs[asset]=size;
    }
    return specs;
  }).catch(()=>{okxContracts=null;return liquidationSeed.specs;});
  okxContracts={until:Date.now()+3600000,value:request};
  return request;
}
function liquidationHistory(){
  return marketData('okx-liquidations',30,async()=>{
    const now=Date.now(),start=now-86400000;
    const [specs,feeds]=await Promise.all([contractSpecs(),Promise.allSettled(liquidationAssets.map(async asset=>{
      const url=okxRoot+'liquidation-orders?instType=SWAP&state=filled&uly='+asset+'-USDT';
      return [asset,await remote(url)];
    }))]);
    const events=[],available=[];
    for(const feed of feeds){
      if(feed.status!=='fulfilled')continue;
      const [asset,data]=feed.value;
      if(!specs[asset])continue;
      try{events.push(...normalizeOKX(data,asset,specs[asset],start,now+60000));available.push(asset);}catch{}
    }
    const saved=liquidationSeed.events.filter(r=>r[3]>=start);
    return {events:[...new Map([...saved,...events].map(row=>[row[0],row])).values()].sort((a,b)=>a[3]-b[3]),available,seedAt:liquidationSeed.checkedAt};
  });
}
