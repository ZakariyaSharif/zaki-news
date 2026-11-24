export function database(query) {
  return {prepare(sql) {
    return {bind(...params) {
      return {
        all: () => query(sql,params),
        first: async () => (await query(sql,params)).results[0] ?? null,
        run: () => query(sql,params)
      };
    }};
  }};
}

export function hostedDatabase(env) {
  const {D1_ACCOUNT_ID, D1_DATABASE_ID, D1_API_TOKEN} = env;
  if (!D1_ACCOUNT_ID || !D1_DATABASE_ID || !D1_API_TOKEN) throw Error('Configure the D1 connection');
  const endpoint = 'https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(D1_ACCOUNT_ID)+'/d1/database/'+encodeURIComponent(D1_DATABASE_ID)+'/query';
  return database(async (sql,params) => {
    const response = await fetch(endpoint,{method:'POST',headers:{authorization:'Bearer '+D1_API_TOKEN,'content-type':'application/json'},body:JSON.stringify({sql,params})});
    if (!response.ok) throw Error('D1 request failed ('+response.status+')');
    const data = await response.json();
    if (!data.success || !data.result?.[0]?.success) throw Error('D1 query failed');
    return data.result[0];
  });
}

export function emptyDatabase() {
  return database(async () => ({results:[],meta:{changes:0}}));
}

export function resolveDatabase(env) {
  if (env.D1_ACCOUNT_ID && env.D1_DATABASE_ID && env.D1_API_TOKEN) return hostedDatabase(env);
  return emptyDatabase();
}
