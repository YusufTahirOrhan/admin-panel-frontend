import test from 'node:test';
import assert from 'node:assert/strict';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import { installAuthRefreshInterceptor } from '../src/lib/auth-interceptors.ts';

function setup(adapter, refresh) {
  let token = 'old'; let expired = 0; let refreshes = 0;
  const client = axios.create({adapter,headers:{Authorization:'Bearer old'}});
  installAuthRefreshInterceptor(client, {refresh:async()=>{refreshes++;return refresh();},getAccessToken:()=>token,setAccessToken:t=>{token=t;},onSessionExpired:()=>{expired++;}});
  return {client,stats:()=>({token,expired,refreshes})};
}
function fail(config,status) { return Promise.reject(new AxiosError('test','ERR_BAD_RESPONSE',config,null,{status,statusText:'test',data:{},headers:new AxiosHeaders(),config})); }
function ok(config) { return Promise.resolve({status:200,statusText:'OK',data:{ok:true},headers:new AxiosHeaders(),config}); }
test('403 permission rejection preserves the session', async()=>{
  const {client,stats}=setup(c=>fail(c,403),async()=> 'new');
  await assert.rejects(client.get('/api/v1/admin/users'));
  assert.deepEqual(stats(),{token:'old',expired:0,refreshes:0});
});
test('simultaneous 401 requests share one refresh and retry with the new token', async()=>{
  let release; const pending=new Promise(resolve=>{release=resolve;});
  const {client,stats}=setup(c=>c.headers.get('Authorization')==='Bearer new'?ok(c):fail(c,401),()=>pending);
  const requests=Promise.all([client.get('/api/v1/sales/customers'),client.get('/api/v1/sales/repairs')]);
  await new Promise(resolve=>setImmediate(resolve)); release('new');
  assert.equal((await requests).length,2);
  assert.deepEqual(stats(),{token:'new',expired:0,refreshes:1});
});
test('a retried 401 cannot start an infinite refresh loop', async()=>{
  let attempts=0; const {client,stats}=setup(c=>{attempts++;return fail(c,401);},async()=> 'new');
  await assert.rejects(client.get('/api/v1/sales/customers'));
  assert.equal(attempts,2); assert.equal(stats().refreshes,1);
});
test('public and login failures never trigger token refresh', async()=>{
  const {client,stats}=setup(c=>fail(c,401),async()=> 'new');
  await Promise.allSettled([client.get('/api/v1/public/pages/home'),client.post('/api/v1/auth/login')]);
  assert.equal(stats().refreshes,0);
});
test('failed shared refresh expires the session once', async()=>{
  let release; const pending=new Promise((_,reject)=>{release=reject;});
  const {client,stats}=setup(c=>fail(c,401),()=>pending);
  const requests=Promise.allSettled([client.get('/api/v1/sales/customers'),client.get('/api/v1/sales/repairs')]);
  await new Promise(resolve=>setImmediate(resolve));release(new Error('expired'));await requests;
  assert.equal(stats().expired,1);assert.equal(stats().refreshes,1);
});
