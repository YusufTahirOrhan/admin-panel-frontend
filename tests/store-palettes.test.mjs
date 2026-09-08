import test from 'node:test';
import assert from 'node:assert/strict';
import { storePalettes, getStorePalette, paletteStyle } from '../src/lib/store-palettes.ts';
import { resolveStoreTheme } from '../src/lib/store-theme.ts';
import { parsePublicBlocks, getPublicNavigation } from '../src/lib/public-content.ts';

test('appearance survives parsing without becoming a navigation section', () => {
  const blocks = parsePublicBlocks([{ type:'appearance', enabled:true, order:-1, content:{palette:'clay',defaultTheme:'dark'} }]);
  assert.equal(getStorePalette(blocks), 'clay');
  assert.equal(resolveStoreTheme(undefined, blocks), 'dark');
  assert.deepEqual(getPublicNavigation(blocks), []);
});
test('appearance is independent of hero and retains visitor mode precedence', () => {
  const blocks = [{type:'appearance',enabled:true,content:{palette:'ocean',defaultTheme:'system'}},{type:'hero',enabled:true,content:{defaultTheme:'dark'}}];
  assert.equal(resolveStoreTheme(undefined, blocks), 'system');
  assert.equal(resolveStoreTheme('light', blocks), 'light');
  assert.equal(getStorePalette(blocks), 'ocean');
  assert.equal(getStorePalette([{type:'appearance',enabled:true,content:{palette:'__proto__'}}]), 'forest');
  assert.equal(getStorePalette([]), 'forest');
});
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(x => parseInt(x,16)/255).map(x => x <= .04045 ? x/12.92 : ((x+.055)/1.055)**2.4);
  return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
}
function contrast(a,b) { const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
test('every palette provides readable body text and primary actions in both modes', () => {
  for (const [id,palette] of Object.entries(storePalettes)) {
    assert.ok(paletteStyle(id)['--store-accent'].startsWith('light-dark('));
    for (const mode of ['light','dark']) {
      const [ink,muted,accent,surface,raised] = palette[mode];
      for (const background of [surface,raised]) {
        assert.ok(contrast(ink,background)>=4.5, `${id} ${mode} body`);
        assert.ok(contrast(muted,background)>=4.5, `${id} ${mode} secondary`);
      }
      assert.ok(contrast(accent, mode==='light' ? '#ffffff':'#141418')>=4.5, `${id} ${mode} button`);
    }
  }
});
