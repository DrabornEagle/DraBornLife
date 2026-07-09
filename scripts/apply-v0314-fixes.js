const fs = require('fs');
const path = require('path');

try {
  require('./apply-v0313-fixes');
} catch (err) {
  console.warn('v0.3.13 base fixes could not run:', err && err.message ? err.message : err);
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

replaceExact("const VERSION = 'v0.3.13';", "const VERSION = 'v0.3.14';");
replaceExact('v0.3.13 favori düzeltme', 'v0.3.14 finans düzeni');

replaceRegex(
  /function MetricGrid\([\s\S]*?function BuyReport/,
  "function MetricGrid({ stats }) { return <View style={styles.metricGrid}><Metric colors={['#2563EB', '#0EA5E9']} icon=\"calendar-month\" label=\"Aylık gelir\" value={money(stats.monthIncome)} /><Metric colors={['#E11D48', '#F97316']} icon=\"calendar-month\" label=\"Aylık gider\" value={money(stats.monthExpense)} /><Metric colors={['#059669', '#2563EB']} icon=\"star\" label=\"Favori hedef\" value={money(stats.favoriteTotal)} /><Metric colors={['#10B981', '#0EA5E9']} icon=\"piggy-bank\" label=\"Birikim\" value={money(stats.saving)} /></View>; }\nfunction BuyReport"
);

replaceRegex(
  /function Finance\([\s\S]*?function DebtPaymentPicker/,
  `function Finance({ theme, data, stats, mode, open, setMode, form, setForm, add, remove, savingTargetItemIds, setSavingTargetItemIds }) { const key = mode === 'income' ? 'incomes' : mode === 'expense' ? 'expenses' : mode === 'saving' ? 'savings' : 'debts'; const list = data[key] || []; return <ScrollView contentContainerStyle={styles.scroll}><Title theme={theme} title="Finans" sub="Formlar kapalı başlar, dokununca açılır" /><View style={styles.metricGrid}><Metric colors={['#2563EB', '#0EA5E9']} icon="calendar-today" label="Bugün" value={money(mode === 'income' ? stats.todayIncome : mode === 'expense' ? stats.todayExpense : 0)} /><Metric colors={['#059669', '#2563EB']} icon="calendar-week" label="7 gün" value={money(mode === 'income' ? stats.weekIncome : mode === 'expense' ? stats.weekExpense : stats.weekly)} /><Metric colors={['#F97316', '#DB2777']} icon="calendar-month" label="Bu ay" value={money(mode === 'income' ? stats.monthIncome : mode === 'expense' ? stats.monthExpense : stats.monthSavings)} /><Metric colors={['#7C3AED', '#DB2777']} icon="chart-bar" label="Kalan borç" value={money(stats.debtLeft)} /></View>{financeModes.map(([id, label, icon, colors]) => <Card key={id} theme={theme}><Pressable onPress={() => setMode(id)} style={styles.row}><Badge icon={icon} colors={mode === id ? colors : ['#334155', '#1E293B']} /><View style={styles.flex}><Text style={[styles.cardTitle, { color: theme.text }]}>{label}</Text><Text style={[styles.muted, { color: theme.muted }]}>{open === id ? 'Kapatmak için dokun' : 'Açmak için dokun'}</Text></View><MaterialCommunityIcons name={open === id ? 'chevron-up' : 'chevron-down'} size={28} color={theme.muted} /></Pressable>{open === id ? <View style={styles.accordionBody}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>{categoryMap[id].map((c) => <Pill key={c} theme={theme} active={form.category === c} label={c} onPress={() => setForm({ ...form, category: c })} />)}</ScrollView><Input theme={theme} label={id === 'debt' || form.category === 'Diğer' ? 'Başlık' : 'Başlık opsiyonel'} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} /><Input theme={theme} label="Tutar" value={form.amount} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, amount: v })} />{id === 'saving' ? <SavingTargetPicker theme={theme} items={data.items} selected={savingTargetItemIds} setSelected={setSavingTargetItemIds} amount={form.amount} /> : null}{id === 'expense' && form.category === 'Borç Tahsilatı' ? <DebtPaymentPicker theme={theme} debts={data.debts} selected={form.debtId} setSelected={(debtId) => setForm({ ...form, debtId })} /> : null}{id === 'debt' ? <Input theme={theme} label="Ödenen" value={form.paid} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, paid: v })} /> : null}<Input theme={theme} label="Tarih" value={today()} editable={false} onChangeText={() => {}} /><Input theme={theme} label="Not" value={form.note} onChangeText={(v) => setForm({ ...form, note: v })} /><Button label="Kaydet" colors={colors} onPress={add} /></View> : null}</Card>)}{list.map((x) => <Record key={x.id} theme={theme} title={x.title} sub={\`${x.category || 'Genel'} • ${x.date || ''}\`} value={money(mode === 'debt' ? num(x.amount) - num(x.paid) : x.amount)} onDelete={() => remove(key, x.id)} />)}</ScrollView>; }\nfunction DebtPaymentPicker`
);

if (src !== original) {
  fs.writeFileSync(appPath, src);
  console.log('DraBornLife v0.3.14 fixes applied.');
} else {
  console.log('DraBornLife v0.3.14 fixes already applied or patterns not found.');
}
