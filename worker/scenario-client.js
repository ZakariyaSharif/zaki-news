(()=>{
  const panel=document.querySelector('[data-scenario]');
  if(!panel)return;
  const en=document.documentElement.lang==='en',asset=panel.querySelector('[name=contract]'),days=panel.querySelector('[name=lookback]');
  const threshold=panel.querySelector('[name=intensity]'),note=panel.querySelector('[data-model-status]');
  let bars=JSON.parse(panel.querySelector('[data-contract-seed]').textContent),request=0;
  const format=new Intl.NumberFormat(en?'en-US':'so',{maximumSignificantDigits:5});
  function paint(){
    if(!bars.length)return;
    const rows=bars.slice(-Number(days.value)),last=rows.at(-1)[4],n=100;
    const low=Math.min(...rows.map(r=>r[3]))*.89,high=Math.max(...rows.map(r=>r[2]))*1.11,step=(high-low)/n;
    let active=[];const columns=[],leverage=[10,25,50];
    for(const row of rows){
      active=active.filter(p=>p.long?row[3]>p.level:row[2]<p.level);
      leverage.forEach((l,k)=>[true,false].forEach(long=>{
        const level=row[4]*(1+(long?-1:1)/l);
        active.push({long,level,k,bin:Math.max(0,Math.min(n-1,Math.floor((level-low)/step))),score:row[5]/6});
      }));
      const column=Array(n).fill(0);for(const p of active)column[p.bin]+=p.score;columns.push(column);
    }
    const scores=Array.from({length:n},()=>[0,0,0]);for(const p of active)scores[p.bin][p.k]+=p.score;
    const peak=Math.max(1,...columns.map(v=>Math.max(...v))),cut=Number(threshold.value)/100;
    panel.querySelector('output').textContent=threshold.value+'%';
    for(const canvas of panel.querySelectorAll('canvas')){
      const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)continue;
      const dpi=Math.min(2,devicePixelRatio||1);canvas.width=w*dpi;canvas.height=h*dpi;
      const c=canvas.getContext('2d');c.scale(dpi,dpi);const l=8,r=w-62,t=27,b=h-28,pw=r-l,ph=b-t;
      c.font='11px sans-serif';const txt=(s,x,y,color='#aeb9c6')=>{c.fillStyle=color;c.fillText(s,x,y);};
      const line=(x,y,xx,yy,color)=>{c.strokeStyle=color;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();};
      c.fillStyle='#161923';c.fillRect(0,0,w,h);
      if(canvas.dataset.model==='heat'){
        const palette=[[68,1,84],[59,82,139],[33,145,140],[94,201,98],[253,231,37]];
        const cw=pw/rows.length,ch=ph/n,py=v=>b-(v-low)/(high-low)*ph;
        c.fillStyle='#440154';c.fillRect(l,t,pw,ph);
        columns.forEach((col,i)=>col.forEach((v,j)=>{
          if(!v||v/peak<cut)return;
          const q=Math.sqrt(v/peak)*4,k=Math.min(3,Math.floor(q));
          c.fillStyle='rgb('+palette[k].map((a,idx)=>Math.round(a+(palette[k+1][idx]-a)*(q-k))).join(',')+')';
          c.fillRect(l+i*cw,b-(j+1)*ch,cw+.6,ch+.6);
        }));
        rows.forEach((row,i)=>{const x=l+(i+.5)*cw,color=row[4]>=row[1]?'#79ffaf':'#ff849c';
          line(x,py(row[2]),x,py(row[3]),color);c.fillStyle=color;c.fillRect(x-cw*.3,Math.min(py(row[1]),py(row[4])),Math.max(1,cw*.6),Math.max(1,Math.abs(py(row[1])-py(row[4]))));
        });
        for(let i=0;i<=4;i++){txt(format.format(low+i*(high-low)/4),r+4,b-ph*i/4+3);}
        for(let i=0;i<3;i++){const index=Math.round((rows.length-1)*i/2);txt(new Date(rows[index][0]).toISOString().slice(5,16).replace('T',' '),Math.min(r-66,l+index*cw),h-7);}
        txt(asset.value+' / USDT · 1H',l,16);
      }else{
        const px=v=>l+(v-low)/(high-low)*pw;
        const largest=Math.max(1,...scores.map(v=>v.reduce((s,x)=>s+x,0)));
        const leftSum=Array(n).fill(0),rightSum=Array(n).fill(0);
        for(const p of active)(p.long?leftSum:rightSum)[p.bin]+=p.score;
        for(let j=n-2;j>=0;j--)leftSum[j]+=leftSum[j+1];
        for(let j=1;j<n;j++)rightSum[j]+=rightSum[j-1];
        const total=Math.max(1,leftSum[0],rightSum[n-1]);
        for(const [series,color,fill,isLong] of [[leftSum,'#ed7886','#ed788635',true],[rightSum,'#69d6ad','#69d6ad35',false]]){
          const indices=series.map((_,j)=>j).filter(j=>isLong?low+(j+.5)*step<=last:low+(j+.5)*step>=last);if(!indices.length)continue;
          c.beginPath();indices.forEach((j,i)=>{const x=l+(j+.5)*pw/n,y=b-ph*series[j]/total;i?c.lineTo(x,y):c.moveTo(x,y);});
          c.strokeStyle=color;c.stroke();c.lineTo(l+(indices.at(-1)+.5)*pw/n,b);c.lineTo(l+(indices[0]+.5)*pw/n,b);c.closePath();c.fillStyle=fill;c.fill();
        }
        scores.forEach((bands,j)=>{let top=b;bands.forEach((v,k)=>{const size=ph*v/largest;c.fillStyle=['#539aff','#a78bfa','#ff9766'][k];c.fillRect(l+j*pw/n,top-size,Math.max(1,pw/n*.78),size);top-=size;});});
        c.setLineDash([4,3]);line(px(last),t,px(last),b,'#fff');c.setLineDash([]);
        txt((en?'Last close ':'Xiritaankii ')+format.format(last),Math.max(4,Math.min(w-119,px(last)-44)),15,'#fff');
        for(let i=0;i<=4;i++)txt(format.format(low+(high-low)*i/4),Math.max(2,px(low+(high-low)*i/4)-12),h-7);
        for(let i=0;i<=2;i++)txt(i*50+'%',r+4,b-ph*i/2+3);
      }
    }
    note.textContent=asset.value+'/USDT · Gate Futures · '+(en?'Latest candle ':'Shumacii ugu dambeeyey ')+new Date(rows.at(-1)[0]).toISOString().slice(0,16).replace('T',' ')+' UTC';
  }
  async function update(){
    const seq=++request;
    try{const res=await fetch('/data/liquidation-model?asset='+encodeURIComponent(asset.value));
      if(!res.ok)throw Error();const data=await res.json();if(seq!==request)return;
      if(!data.rows?.length)throw Error();bars=data.rows;paint();
    }catch{if(seq===request&&!bars.length)note.textContent=en?'Contract data unavailable.':'Xogta qandaraaska lama heli karo.';}
  }
  asset.addEventListener('change',()=>{bars=[];panel.querySelectorAll('canvas').forEach(c=>c.width=c.width);panel.querySelector('a').href='https://www.gate.com/futures/USDT/'+asset.value+'_USDT';note.textContent=en?'Loading…':'Soo rarid…';update();});
  threshold.addEventListener('input',paint);days.addEventListener('change',paint);
  new ResizeObserver(paint).observe(panel.querySelector('canvas'));paint();update();setInterval(()=>{if(!document.hidden)update();},60000);
})();
