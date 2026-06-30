import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { textPresets, theme } from '../theme';
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
      <Text style={desc}>Tutarlar aynı kalır; ekranda görünen para birimi etiketi değişir.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 11 }}>
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

const card = { marginTop: 14, padding: 16, borderRadius: theme.radius.lg, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.borderSoft, ...theme.shadow.card };
const mini = { ...textPresets.eyebrow, fontSize: 11 };
const title = { ...textPresets.sectionTitle, marginTop: 5, fontSize: 19, lineHeight: 24 };
const desc = { ...textPresets.body, marginTop: 6 };
const chip = { marginRight: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: theme.radius.md, backgroundColor: '#E7F4F4', borderWidth: 1, borderColor: '#CFECEE' };
const chipActive = { backgroundColor: theme.colors.aqua, borderColor: theme.colors.aqua };
const chipText = { color: theme.colors.oceanDeep, fontSize: theme.fontSize.label, fontWeight: theme.fontWeight.black };
const chipTextActive = { color: theme.colors.oceanDeep };
