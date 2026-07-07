import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const KEY = 'drabornlife-v01';
const VERSION = 'v0.1';
const defaultData = {
  settings: { targetBudget: 650000, targetDate: '2026-10-31', motorcycleTarget: 130000, theme: 'dark' },
  savings: [],
  items: [
    { id: 'rent', name: 'Kira + depozito', estimate: 105000, status: 'Planlandı' },
    { id: 'home', name: 'Beyaz eşya + mobilya', estimate: 220000, status: 'Planlandı' },
    { id: 'life', name: 'İlk ay yaşam gideri', estimate: 70000, status: 'Planlandı' },
    { id: 'gta', name: 'GTA 6 / PS5 Pro / TV', estimate: 95000, status: 'Planlandı' },
    { id: 'motor', name: 'Sıfır motosiklet', estimate: 130000, status: 'Planlandı' }
  ]
};
const money = (v) => `${Math.round(Number(v || 0)).toLocaleString('tr-TR')} TL`;
const pct = (a, b) => (!b ? 0 : Math.max(0, Math.min(100, Math.round((a / b) * 100))));
const daysLeft = () => Math.max(0, Math.ceil((new Date('2026-10-31T23:59:59').getTime() - Date.now()) / 86400000));

export default function App() {
  const [data, setData] = useState(defaultData);
  const [tab, setTab] = useState('panel');
  const [amount, setAmount] = useState('');

  useEffect(() => { AsyncStorage.getItem(KEY).then((raw) => raw && setData(JSON.parse(raw))).catch(() => {}); }, []);
  useEffect(() => { AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {}); }, [data]);

  const stats = useMemo(() => {
    const saved = data.savings.reduce((s, x) => s + Number(x.amount || 0), 0);
    const target = Number(data.settings.targetBudget || 0);
    return { saved, target, left: Math.max(0, target - saved), progress: pct(saved, target), days: daysLeft() };
  }, [data]);

  function addSaving() {
    const value = Number(String(amount).replace(',', '.')) || 0;
    if (!value) return;
    setData({ ...data, savings: [{ id: String(Date.now()), amount: value, date: new Date().toISOString() }, ...data.savings] });
    setAmount('');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#070A16', '#101735']} style={StyleSheet.absoluteFillObject} />
      <View style={styles.header}>
        <View><Text style={styles.title}>DraBornLife</Text><Text style={styles.subtitle}>Antalya yeni hayat kontrol merkezi</Text></View>
        <View style={styles.badge}><Text style={styles.badgeText}>{VERSION}</Text></View>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'panel' && <Panel stats={stats} />}
        {tab === 'liste' && <Items data={data} setData={setData} />}
        {tab === 'ayar' && <Settings data={data} setData={setData} />}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Birikim ekle</Text>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="Tutar" placeholderTextColor="#818AA6" style={styles.input} />
          <Pressable onPress={addSaving} style={styles.button}><Text style={styles.buttonText}>Kaydet</Text></Pressable>
        </View>
      </ScrollView>
      <View style={styles.nav}>{[['panel','Panel','home-variant'],['liste','Liste','cart'],['ayar','Ayar','cog']].map(([id,label,icon]) => <Pressable key={id} onPress={() => setTab(id)} style={styles.navItem}><MaterialCommunityIcons name={icon} size={25} color={tab===id?'#8A78FF':'#A9B1C7'} /><Text style={[styles.navText, tab===id && { color:'#8A78FF' }]}>{label}</Text></Pressable>)}</View>
    </SafeAreaView>
  );
}

function Panel({ stats }) {
  return <LinearGradient colors={['#1A2050', '#111833']} style={styles.hero}><Text style={styles.kicker}>ANTALYA HEDEFİ</Text><Text style={styles.heroTitle}>{stats.progress}% tamamlandı</Text><Text style={styles.body}>{stats.days} gün kaldı. Hedef: {money(stats.target)} • Birikim: {money(stats.saved)} • Kalan: {money(stats.left)}</Text><View style={styles.track}><LinearGradient colors={['#6D5BFF','#13B8FF','#22CFA0']} style={[styles.fill,{width:`${Math.max(5,stats.progress)}%`}]} /></View></LinearGradient>;
}

function Items({ data, setData }) {
  return <>{data.items.map((x) => <View key={x.id} style={styles.card}><Text style={styles.cardTitle}>{x.name}</Text><Text style={styles.body}>{money(x.estimate)} • {x.status}</Text><Pressable onPress={() => setData({ ...data, items: data.items.map((i) => i.id === x.id ? { ...i, status: i.status === 'Planlandı' ? 'Parası Birikti' : i.status === 'Parası Birikti' ? 'Satın Alındı' : 'Kuruldu' } : i) })} style={styles.smallButton}><Text style={styles.buttonText}>Durumu ilerlet</Text></Pressable></View>)}</>;
}

function Settings({ data, setData }) {
  return <View style={styles.card}><Text style={styles.cardTitle}>Ayarlar</Text><TextInput value={String(data.settings.targetBudget)} onChangeText={(v) => setData({ ...data, settings: { ...data.settings, targetBudget: Number(v) || 0 } })} keyboardType="numeric" style={styles.input} /><Text style={styles.body}>APK hedefi: v1.0 • Bu sürüm Expo Go test içindir.</Text></View>;
}

const styles = StyleSheet.create({ safe:{flex:1,backgroundColor:'#070A16'}, header:{paddingHorizontal:22,paddingTop:18,paddingBottom:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}, title:{color:'#F8FAFF',fontSize:30,fontWeight:'900'}, subtitle:{color:'#A9B1C7',fontSize:13,fontWeight:'700',marginTop:3}, badge:{backgroundColor:'#6D5BFF',borderRadius:16,paddingHorizontal:12,paddingVertical:8}, badgeText:{color:'white',fontWeight:'900'}, scroll:{padding:18,paddingBottom:120}, hero:{borderRadius:30,padding:20,marginBottom:14}, kicker:{color:'#36C2FF',fontWeight:'900',letterSpacing:1}, heroTitle:{color:'#F8FAFF',fontSize:40,fontWeight:'900',marginTop:10}, body:{color:'#A9B1C7',fontSize:14,lineHeight:21,fontWeight:'700',marginTop:8}, track:{height:13,borderRadius:99,backgroundColor:'rgba(255,255,255,0.12)',overflow:'hidden',marginTop:18}, fill:{height:'100%',borderRadius:99}, card:{backgroundColor:'rgba(18,23,43,0.88)',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,borderRadius:26,padding:16,marginBottom:12}, cardTitle:{color:'#F8FAFF',fontSize:18,fontWeight:'900'}, input:{minHeight:50,borderRadius:18,borderWidth:1,borderColor:'rgba(255,255,255,0.1)',backgroundColor:'#12172B',color:'#F8FAFF',paddingHorizontal:14,marginTop:12,fontWeight:'800'}, button:{height:52,borderRadius:20,backgroundColor:'#6D5BFF',alignItems:'center',justifyContent:'center',marginTop:14}, smallButton:{height:44,borderRadius:16,backgroundColor:'#6D5BFF',alignItems:'center',justifyContent:'center',marginTop:12}, buttonText:{color:'white',fontWeight:'900'}, nav:{position:'absolute',left:14,right:14,bottom:14,height:74,borderRadius:28,backgroundColor:'rgba(14,18,35,0.96)',borderWidth:1,borderColor:'rgba(255,255,255,0.1)',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}, navItem:{flex:1,alignItems:'center'}, navText:{color:'#A9B1C7',fontSize:11,fontWeight:'900',marginTop:4} });
