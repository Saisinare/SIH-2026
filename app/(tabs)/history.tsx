import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAppStore } from '../../src/presentation/store/app-store';

const PRIMARY = '#0F766E';
const BG = '#F0FDFA';

const VERDICT_COLORS: Record<string, string> = {
  Proceed: '#10B981',
  Adjust: '#F59E0B',
  Reconsider: '#EF4444',
};

export default function HistoryScreen() {
  const { history, clearHistory, loadHistoryFromStorage } = useAppStore();

  useEffect(() => { loadHistoryFromStorage(); }, []);

  const handleClear = () => {
    Alert.alert(
      'Clear History?',
      'Delete all saved assessment records?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: clearHistory },
      ],
    );
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🕓 Assessment History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No past assessments</Text>
          <Text style={styles.emptySub}>Run your first analysis from the Home tab.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {history.map((item) => {
            const color = VERDICT_COLORS[item.verdict] ?? '#64748B';
            const date = new Date(item.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            });
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.sector}>{item.sector}</Text>
                  <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '55' }]}>
                    <Text style={[styles.badgeText, { color }]}>{item.verdict}</Text>
                  </View>
                </View>
                <Text style={styles.village}>{item.villageName} • {item.district}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.meta}>Capital: ₹{item.availableCapital.toLocaleString('en-IN')}</Text>
                  <Text style={styles.meta}>{date}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  header: {
    backgroundColor: PRIMARY, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 24,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FEF3C7' },
  clearBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  clearBtnText: { color: '#FEF3C7', fontSize: 13, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sector: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  badge: {
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  village: { fontSize: 13, color: '#64748B', marginBottom: 10 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { fontSize: 12, color: '#94A3B8' },
});
