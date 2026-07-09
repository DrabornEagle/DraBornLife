const fs = require('fs');
const path = require('path');

try {
  require('./apply-v0311-fixes');
} catch (err) {
  console.warn('v0.3.11 base fixes could not run:', err && err.message ? err.message : err);
}

const appPath = path.join(__dirname, '..', 'App.js');
let src = fs.readFileSync(appPath, 'utf8');
const original = src;

function replaceExact(from, to) {
  if (!src.includes(to) && src.includes(from)) src = src.replace(from, to);
}

function replaceRegex(regex, to) {
  src = src.replace(regex, to);
}

replaceExact("const VERSION = 'v0.3.11';", "const VERSION = 'v0.3.12';");
replaceExact('v0.3.11 rapor düzeltme', 'v0.3.12 birikim ve borç');
replaceExact("income: ['Günlük kazanç', 'Ek gelir', 'Satış geliri', 'Borç tahsilatı', 'Diğer'],", "income: ['Günlük kazanç', 'Ek gelir', 'Satış geliri', 'Diğer'],");
replaceExact("expense: ['Kira', 'Market', 'Ulaşım', 'Çocuk', 'Diğer'],", "expense: ['Kira', 'Market', 'Ulaşım', 'Çocuk', 'Borç Tahsilatı', 'Diğer'],");

const groupFavorite = "function groupFavoriteSavings(items) { const out = {}; items.forEach((x) => { const k = normalizeCategory(x.category || 'Manuel'); if (!out[k]) out[k] = { name: k, total: 0, covered: 0 }; const price = itemPrice(x); out[k].total += price; out[k].covered += Math.min(price, Math.max(0, num(x.savedAmount))); }); return Object.values(out).sort((a, b) => b.total - a.total); }";
const rebuild = "function rebuildItemSavingsFromSavings(source) { const items = (source.items || []).map((x) => ({ ...x, category: normalizeCategory(x.category), priority: normalizePriority(x.priority), favorite: !!x.favorite, savedAmount: 0, status: normalizeItemStatus(x.status) === 'Satın Alındı' ? 'Satın Alındı' : 'Planlandı' })); const index = {}; items.forEach((x, i) => { index[x.id] = i; }); [...(source.savings || [])].reverse().forEach((row) => { let remaining = num(row.amount); const targets = Array.isArray(row.targetItemIds) ? row.targetItemIds : row.targetItemId ? [row.targetItemId] : []; targets.forEach((id) => { const i = index[id]; if (i === undefined || remaining <= 0) return; const item = items[i]; const price = itemPrice(item); const need = Math.max(0, price - num(item.savedAmount)); const add = Math.min(remaining, need); if (add > 0) { item.savedAmount = num(item.savedAmount) + add; item.favorite = true; remaining -= add; } }); }); items.forEach((x) => { if (normalizeItemStatus(x.status) === 'Satın Alındı') return; const price = itemPrice(x); x.status = price && num(x.savedAmount) >= price ? 'Parası Birikti' : 'Planlandı'; }); return { ...source, items }; }";
if (!src.includes('function rebuildItemSavingsFromSavings(source)')) {
  replaceExact(groupFavorite, groupFavorite + '\n' + rebuild);
}
replaceExact('function statsOf(data) {\n  const sum', 'function statsOf(data) {\n  data = rebuildItemSavingsFromSavings(data);\n  const sum');
replaceExact('  const dailyRef = useRef(false);\n  const float', '  const dailyRef = useRef(false);\n  const normalizedRef = useRef(false);\n  const float');
replaceExact('  useEffect(() => { if (ready) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {}); }, [ready, data]);', '  useEffect(() => { if (ready) AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {}); }, [ready, data]);\n  useEffect(() => { if (!ready || normalizedRef.current) return; normalizedRef.current = true; setData((prev) => rebuildItemSavingsFromSavings(prev)); }, [ready]);');

const newAddFinance = [
  'function addFinance() {',
  "    if (!num(finance.amount)) return say('Tutar gir.');",
  "    const key = financeMode === 'income' ? 'incomes' : financeMode === 'expense' ? 'expenses' : financeMode === 'saving' ? 'savings' : 'debts';",
  "    const row = { id: uid(), title: finance.title || finance.category, amount: num(finance.amount), paid: financeMode === 'debt' ? num(finance.paid) : undefined, date: today(), category: finance.category, note: finance.note, targetItemIds: financeMode === 'saving' ? savingTargetItemIds : undefined, debtId: finance.debtId || undefined };",
  "    let next = { ...data, [key]: [row, ...(data[key] || [])] };",
  "    let msg = 'Kayıt eklendi.';",
  "    if (financeMode === 'expense' && finance.category === 'Borç Tahsilatı') {",
  "      if (!finance.debtId) return say('Ödenecek borcu seç.');",
  "      next.debts = data.debts.map((d) => d.id === finance.debtId ? { ...d, paid: Math.min(num(d.amount), num(d.paid) + num(finance.amount)) } : d);",
  "      msg = 'Borçtan düşüldü ve gider kaydedildi.';",
  "    }",
  "    if (financeMode === 'saving') {",
  "      if (savingTargetItemIds.length) { next = rebuildItemSavingsFromSavings(next); msg = 'Birikim seçilen ürünlere dağıtıldı ve rapora işlendi.'; } else { msg = 'Birikim kaydedildi.'; }",
  "    }",
  "    save(next);",
  "    setFinance({ title: '', amount: '', paid: '', date: today(), category: categoryMap[financeMode][0], note: '', debtId: '' });",
  "    setSavingTargetItemIds([]);",
  "    say(msg);",
  "  }"
].join('\n');
replaceRegex(/function addFinance\(\) \{[\s\S]*?\n  function addCatalogItem/, newAddFinance + '\n  function addCatalogItem');

replaceExact("const remove = (key, id) => save({ ...data, [key]: data[key].filter((x) => x.id !== id) });", "const remove = (key, id) => { const next = { ...data, [key]: data[key].filter((x) => x.id !== id) }; save(key === 'savings' ? rebuildItemSavingsFromSavings(next) : next); };");

replaceRegex(/function MetricGrid\([\s\S]*?function BuyReport/, "function MetricGrid({ stats }) { return <View style={styles.metricGrid}><Metric colors={['#2563EB', '#0EA5E9']} icon=\"calendar-month\" label=\"Aylık gelir\" value={money(stats.monthIncome)} /><Metric colors={['#E11D48', '#F97316']} icon=\"calendar-month\" label=\"Aylık gider\" value={money(stats.monthExpense)} /><Metric colors={['#059669', '#2563EB']} icon=\"star\" label=\"Favori hedef\" value={money(stats.favoriteTotal)} /><Metric colors={['#7C3AED', '#DB2777']} icon=\"target\" label=\"Eksik\" value={money(stats.left)} /></View>; }\nfunction BuyReport");

replaceExact('{id === \'saving\' ? <SavingTargetPicker theme={theme} items={data.items} selected={savingTargetItemIds} setSelected={setSavingTargetItemIds} amount={form.amount} /> : null}{id === \'debt\' ? <Input theme={theme} label="Ödenen" value={form.paid} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, paid: v })} /> : null}', '{id === \'saving\' ? <SavingTargetPicker theme={theme} items={data.items} selected={savingTargetItemIds} setSelected={setSavingTargetItemIds} amount={form.amount} /> : null}{id === \'expense\' && form.category === \'Borç Tahsilatı\' ? <DebtPaymentPicker theme={theme} debts={data.debts} selected={form.debtId} setSelected={(debtId) => setForm({ ...form, debtId })} /> : null}{id === \'debt\' ? <Input theme={theme} label="Ödenen" value={form.paid} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, paid: v })} /> : null}');

const debtPicker = "function DebtPaymentPicker({ theme, debts, selected, setSelected }) { const list = (debts || []).filter((d) => Math.max(0, num(d.amount) - num(d.paid)) > 0); return <View style={[styles.targetPicker, { backgroundColor: theme.card2, borderColor: theme.line }]}><View style={styles.row}><BadgeSmall icon=\"credit-card-check\" colors={['#F97316', '#DB2777']} /><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text }]}>Hangi borçtan düşülsün?</Text><Text style={[styles.muted, { color: theme.muted }]}>Ödenen tutar seçilen borcun kalanından düşer.</Text></View></View>{list.length === 0 ? <Text style={[styles.body, { color: theme.muted }]}>Kalan borç kaydı yok.</Text> : list.map((d) => { const left = Math.max(0, num(d.amount) - num(d.paid)); const active = selected === d.id; return <Pressable key={d.id} onPress={() => setSelected(d.id)} style={[styles.targetRow, { borderColor: active ? '#38BDF8' : theme.line, backgroundColor: active ? 'rgba(56,189,248,0.14)' : 'rgba(15,23,42,0.18)' }]}><View style={styles.flex}><Text style={[styles.itemTitle, { color: theme.text }]}>{d.title || d.category || 'Borç'}</Text><Text style={[styles.muted, { color: theme.muted }]}>Kalan: {money(left)} • Toplam: {money(d.amount)}</Text></View><Text style={[styles.targetAction, { color: active ? '#7DD3FC' : theme.muted }]}>{active ? 'Seçildi' : 'Seç'}</Text></Pressable>; })}</View>; }";
if (!src.includes('function DebtPaymentPicker({ theme, debts')) {
  replaceExact('function SavingTargetPicker(', debtPicker + '\nfunction SavingTargetPicker(');
}

if (src !== original) {
  fs.writeFileSync(appPath, src);
  console.log('DraBornLife v0.3.12 fixes applied.');
} else {
  console.log('DraBornLife v0.3.12 fixes already applied or patterns not found.');
}
