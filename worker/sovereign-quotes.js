const sovereignYieldSeed = [
  {
    "series": "DGS2",
    "symbol": "US02Y",
    "name": "U.S. 2-year",
    "so": "Maraykanka · 2 sano",
    "unit": "%",
    "price": 4.83,
    "previous": 4.88,
    "asOf": "2026-11-16",
    "frequency": "daily",
    "source": "Federal Reserve · FRED",
    "url": "https://fred.stlouisfed.org/series/DGS2",
    "history": [
      4.77,
      4.79,
      4.81,
      4.65,
      4.69,
      4.68,
      4.7,
      4.67,
      4.61,
      4.56,
      4.59,
      4.61,
      4.58,
      4.46,
      4.51,
      4.56,
      4.73,
      4.86,
      4.88,
      4.83
    ]
  },
  {
    "series": "DGS10",
    "symbol": "US10Y",
    "name": "U.S. 10-year",
    "so": "Maraykanka · 10 sano",
    "unit": "%",
    "price": 5.12,
    "previous": 5.15,
    "asOf": "2026-11-16",
    "frequency": "daily",
    "source": "Federal Reserve · FRED",
    "url": "https://fred.stlouisfed.org/series/DGS10",
    "history": [
      5.15,
      5.12,
      5.13,
      4.96,
      5.0,
      5.0,
      4.99,
      5.05,
      4.98,
      4.94,
      4.91,
      4.95,
      4.9,
      4.84,
      4.86,
      4.88,
      4.98,
      5.1,
      5.15,
      5.12
    ]
  },
  {
    "series": "IRLTLT01DEM156N",
    "symbol": "DE10Y",
    "name": "Germany 10-year",
    "so": "Jarmalka · 10 sano",
    "unit": "%",
    "price": 3.4159090909,
    "previous": 3.4740909091,
    "asOf": "2026-10-01",
    "frequency": "monthly",
    "source": "OECD · FRED",
    "url": "https://fred.stlouisfed.org/series/IRLTLT01DEM156N",
    "history": [
      2.74142857142857,
      2.5105,
      2.56285714285714,
      2.51904761904762,
      2.63130434782609,
      2.67333333333333,
      2.69318181818182,
      2.61782608695652,
      2.6575,
      2.81421052631579,
      2.80666666666667,
      2.745,
      2.91,
      3.001,
      3.0465,
      2.96409090909091,
      3.0704347826087,
      3.18571428571429,
      3.4740909091,
      3.4159090909
    ]
  },
  {
    "series": "IRLTLT01GBM156N",
    "symbol": "GB10Y",
    "name": "UK 10-year",
    "so": "Boqortooyada Midowday · 10 sano",
    "unit": "%",
    "price": 5.3393,
    "previous": 5.2421,
    "asOf": "2026-10-01",
    "frequency": "monthly",
    "source": "OECD · FRED",
    "url": "https://fred.stlouisfed.org/series/IRLTLT01GBM156N",
    "history": [
      4.6448,
      4.5762,
      4.6004,
      4.5248,
      4.5924,
      4.6369,
      4.6885,
      4.5721,
      4.4985,
      4.4826,
      4.451,
      4.4324,
      4.7007,
      4.8207,
      4.9416,
      4.796,
      4.9318,
      4.9886,
      5.2421,
      5.3393
    ]
  },
  {
    "series": "IRLTLT01JPM156N",
    "symbol": "JP10Y",
    "name": "Japan 10-year",
    "so": "Jabaan · 10 sano",
    "unit": "%",
    "price": 2.755,
    "previous": 3.05,
    "asOf": "2026-10-01",
    "frequency": "monthly",
    "source": "OECD · FRED",
    "url": "https://fred.stlouisfed.org/series/IRLTLT01JPM156N",
    "history": [
      1.485,
      1.31,
      1.5,
      1.42,
      1.545,
      1.6,
      1.645,
      1.655,
      1.805,
      2.06,
      2.24,
      2.11,
      2.345,
      2.515,
      2.65,
      2.67,
      2.79,
      2.94,
      3.05,
      2.755
    ]
  }
];

let sovereignYieldRows = sovereignYieldSeed;
let sovereignYieldRefresh;
let sovereignYieldExpires = 0;

function initialBondQuotes() {
  return sovereignYieldRows;
}

async function fetchSovereignYield(row) {
  const today = new Date();
  const start = new Date(today.getTime() - (row.frequency === 'daily' ? 60 : 730) * 86400000);
  const params = new URLSearchParams({id:row.series, cosd:start.toISOString().slice(0,10)});
  const response = await fetch('https://fred.stlouisfed.org/graph/fredgraph.csv?'+params, {signal:AbortSignal.timeout(3500)});
  if (!response.ok) throw Error('Yield provider unavailable');
  const [header,...lines] = (await response.text()).trim().split(/\r?\n/);
  if (header.split(',')[1] !== row.series) throw Error('Unexpected FRED series');
  const observations = lines.flatMap(line=>{
    const [date,raw] = line.split(',');
    if (!/^\d{4}-\d\d-\d\d$/.test(date) || !raw?.trim() || !Number.isFinite(Number(raw))) return [];
    return [{date,value:Number(raw)}];
  }).sort((a,b)=>a.date.localeCompare(b.date)).slice(-20);
  if (observations.length < 2 || observations.at(-1).date < row.asOf) return row;
  return {...row, price:observations.at(-1).value, previous:observations.at(-2).value,
    asOf:observations.at(-1).date, history:observations.map(o=>o.value)};
}

function loadBondQuotes() {
  if (Date.now()<sovereignYieldExpires) return Promise.resolve(sovereignYieldRows);
  if (!sovereignYieldRefresh) {
    sovereignYieldRefresh = Promise.all(sovereignYieldRows.map(row=>fetchSovereignYield(row).catch(()=>row)))
      .then(rows=>{
        sovereignYieldRows=rows;
        sovereignYieldExpires=Date.now()+900000;
        return rows;
      }).finally(()=>{sovereignYieldRefresh=undefined;});
  }
  return sovereignYieldRefresh;
}
