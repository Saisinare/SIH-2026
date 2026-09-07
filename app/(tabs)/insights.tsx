import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PRIMARY = '#0F766E';
const BG = '#F0FDFA';

export default function InsightsScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Market & Credit Insights</Text>
        <Text style={styles.headerSub}>Mandi prices, NABARD credit plans & scheme directory</Text>
      </View>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderIcon}>📈</Text>
        <Text style={styles.placeholderTitle}>Insights Coming Soon</Text>
        <Text style={styles.placeholderSub}>
          This screen will show Agmarknet mandi prices, NABARD district credit plans, and the full government scheme directory with bookmarking.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  container: { paddingBottom: 32 },
  header: { backgroundColor: PRIMARY, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 24 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FEF3C7' },
  headerSub: { fontSize: 13, color: '#99F6E4', marginTop: 4 },
  placeholder: { margin: 24, backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center', elevation: 2 },
  placeholderIcon: { fontSize: 48, marginBottom: 16 },
  placeholderTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  placeholderSub: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20 },
});
