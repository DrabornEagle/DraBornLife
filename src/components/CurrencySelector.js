import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CURRENCY_OPTIONS, getCurrency } from '../utils/lifeSummary';

export function CurrencySelector({ lifeData, onSave }) {
  const activeCurrency = getCurrency(lifeData);

  function pickCurrency(currency) {
    onSave({
      ...lifeData,
      settings: {
        ...(lifeData?.settings || {}),
        currency,
      },
    });
  }

  return (
    <View style={card}>
      <Text style={mini}>PARA BİRİMİ</Text>
      <Text style={title}>Gösterilecek para birimi</Text>
      <Text style={desc}>Tüm tutarlar aynı kayıt değerleriyle gösterilir; sadece ekrandaki para birimi etiketi değişir.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
        {CURRENCY_OPTIONS.map((item) => {
          const active = activeCurrency === item.key;
          return (
            <TouchableOpacity key={item.key} onPress={() => pickCurrency(item.key)} style={[chip, active && chipActive]}>
              <Text style={[chipText, active && chipTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const card = { marginTop: 14, padding: 16, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4F2F1' };
const mini = { color: '#FF7A59', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 };
const title = { marginTop: 5, color: '#102A35', fontSize: 19, fontWeight: '900' };
const desc = { marginTop: 6, color: '#315661', fontSize: 13, lineHeight: 19, fontWeight: '800' };
const chip = { marginRight: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, backgroundColor: '#E7F4F4', borderWidth: 1, borderColor: '#CFECEE' };
const chipActive = { backgroundColor: '#2DE2E6', borderColor: '#2DE2E6' };
const chipText = { color: '#06202A', fontSize: 12, fontWeight: '900' };
const chipTextActive = { color: '#06202A' };
