const fs = require('fs');
const path = require('path');

try {
  require('./apply-v0312-fixes');
} catch (err) {
  console.warn('v0.3.12 base fixes could not run:', err && err.message ? err.message : err);
}

const appPath = path.join(__dirname, '..', 'App.js');
let src = fs.readFileSync(appPath, 'utf8');
const original = src;

function replaceExact(from, to) {
  if (!src.includes(to) && src.includes(from)) src = src.replace(from, to);
}

replaceExact("const VERSION = 'v0.3.12';", "const VERSION = 'v0.3.13';");
replaceExact('v0.3.12 birikim ve borç', 'v0.3.13 favori düzeltme');

replaceExact(
  "const patchItem = (id, patch) => save({ ...data, items: data.items.map((x) => x.id === id ? { ...x, ...patch, status: patch.status ? normalizeItemStatus(patch.status) : normalizeItemStatus(x.status) } : x) });",
  "const patchItem = (id, patch) => { const manualClear = patch.favorite === false || patch.status === 'Planlandı'; let next = { ...data, items: data.items.map((x) => { if (x.id !== id) return x; const merged = { ...x, ...patch, status: patch.status ? normalizeItemStatus(patch.status) : normalizeItemStatus(x.status) }; return manualClear ? { ...merged, favorite: patch.favorite === false ? false : merged.favorite, savedAmount: 0, status: patch.status === 'Planlandı' ? 'Planlandı' : merged.status } : merged; }) }; if (manualClear) next.savings = (next.savings || []).map((s) => ({ ...s, targetItemIds: Array.isArray(s.targetItemIds) ? s.targetItemIds.filter((targetId) => targetId !== id) : s.targetItemIds, targetItemId: s.targetItemId === id ? undefined : s.targetItemId })).filter((s) => !(Array.isArray(s.targetItemIds) && s.targetItemIds.length === 0 && !s.targetItemId && s.category === 'Günlük birikim')); save(manualClear ? rebuildItemSavingsFromSavings(next) : next); };"
);

if (src !== original) {
  fs.writeFileSync(appPath, src);
  console.log('DraBornLife v0.3.13 fixes applied.');
} else {
  console.log('DraBornLife v0.3.13 fixes already applied or patterns not found.');
}
