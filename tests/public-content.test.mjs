import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchPublicHome, getGoogleMapsLinks, safePublicHref, isPublicCtaAllowed, parsePublicBlocks, getPublicNavigation } from '../src/lib/public-content.ts';

test('backend errors do not silently substitute sample business data', async () => {
  for (const status of [404, 500, 503]) {
    assert.deepEqual(await fetchPublicHome('http://localhost', async () => new Response('', {status})), {blocks:[],unavailable:true});
  }
});
test('network failures and request cancellation produce a recoverable unavailable state', async () => {
  for (const failure of [new TypeError('Failed to fetch'), new DOMException('Timeout', 'TimeoutError')]) {
    assert.deepEqual(await fetchPublicHome('http://localhost', async () => { throw failure; }), {blocks:[],unavailable:true});
  }
});
test('invalid JSON and malformed payloads produce an error, not a successful empty page', async () => {
  for (const body of ['not-json', '{}', '{"blocks":null}']) {
    assert.deepEqual(await fetchPublicHome('http://localhost', async () => new Response(body)), {blocks:[],unavailable:true});
  }
});
test('an intentionally empty publication stays empty', async () => {
  assert.deepEqual(await fetchPublicHome('http://localhost', async () => Response.json({blocks:[]})), {blocks:[],unavailable:false});
});
test('published CMS content is preserved and requested with an abort signal', async () => {
  const blocks = [{type:'contact',order:0,enabled:true,content:{phone:'original value'}}];
  const result = await fetchPublicHome('http://localhost/', async (url, options) => {
    assert.equal(url, 'http://localhost/api/v1/public/pages/home');
    assert.equal(options.cache, 'no-store');
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({blocks});
  });
  assert.deepEqual(result, {blocks,unavailable:false});
});

test('CMS iframe is extracted without encoding HTML as a search', () => {
  const result = getGoogleMapsLinks('<iframe src="https://www.google.com/maps/embed?pb=test&amp;hl=tr" width="600"></iframe>');
  assert.equal(result.embedUrl, 'https://www.google.com/maps/embed?pb=test&hl=tr');
  assert.equal(result.directionsUrl, result.embedUrl);
  assert.ok(!result.directionsUrl.includes('iframe'));
});
test('map embeds reject executable and non-Google sources', () => {
  for (const source of ['javascript:alert(1)', 'https://google.com.evil.test/maps/embed', '<iframe src="https://evil.test/maps/embed"></iframe>', 'https://user:pass@google.com/maps/embed']) {
    assert.deepEqual(getGoogleMapsLinks(source), {embedUrl:null,directionsUrl:null});
  }
});
test('addresses, place URLs and short links keep a usable maps destination', () => {
  assert.ok(getGoogleMapsLinks('', 'İstanbul mağaza').embedUrl.includes('%C4%B0stanbul'));
  assert.ok(getGoogleMapsLinks('https://www.google.com/maps/place/Optik+Ma%C4%9Faza/').embedUrl.includes('Optik%20Ma%C4%9Faza'));
  assert.equal(getGoogleMapsLinks('https://maps.app.goo.gl/example').embedUrl, null);
  assert.equal(getGoogleMapsLinks('https://maps.app.goo.gl/example').directionsUrl, 'https://maps.app.goo.gl/example');
});
test('public links exclude panel routes, unsafe schemes and obfuscation', () => {
  for (const href of ['javascript:alert(1)', 'java\nscript:alert(1)', 'data:text/html,hi', '//evil.test', '/\\evil.test', '/login?next=/', '/%61dmin', 'https://panel.optimaxx.com.tr/', '/sales/repairs', '/randevu']) assert.equal(safePublicHref(href), null, href);
  for (const href of ['#contact', 'tel:+905551234567', 'mailto:store@example.com', 'https://example.com/frames']) assert.equal(safePublicHref(href), href);
  assert.equal(isPublicCtaAllowed('Randevu al', '#contact'), false);
});
test('invalid and disabled blocks cannot break the page or expose dead navigation', () => {
  const source = [{type:'contact',order:2,enabled:true,content:{}},{type:'services',order:0,enabled:true,content:{}},{type:'hours',order:1,enabled:false,content:{}},null,{type:'hero',enabled:true,content:[]},{type:'contact',order:3,enabled:true,content:{}}];
  const blocks = parsePublicBlocks(source);
  assert.deepEqual(blocks.map(b=>b.type), ['services','contact']);
  assert.deepEqual(getPublicNavigation(blocks).map(n=>n.href), ['#services','#contact']);
  assert.equal(source[0].type,'contact');
});
