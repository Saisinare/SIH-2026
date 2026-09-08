import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/presentation/store/app-store';

const COLORS = {
  bg:            '#FAF0E6',
  cardBg:        '#FFFFFF',
  cardBorder:    '#EAE1D2',
  subCardBg:     '#FAF6EF',
  textPrimary:   '#2B231F',
  textSecondary: '#5A4E44',
  textMuted:     '#8A7B6F',
  accent:        '#BD5D38',
  accentBg:      'rgba(189,93,56,0.10)',
  divider:       '#EAE1D2',
  success:       '#10B981',
  warning:       '#D97706',
  error:         '#EF4444',
};

const VERDICT_COLORS: Record<string, string> = {
  Proceed:    COLORS.success,
  Adjust:     COLORS.warning,
  Reconsider: COLORS.error,
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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── Header ─────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>History</Text>
          <Text style={styles.headerSub}>Past business assessments</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={14} color={COLORS.accent} />
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        /* ── Empty State ──────────────────────────── */
        <View style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="time-outline" size={28} color={COLORS.accent} />
          </View>
          <Text style={styles.emptyTitle}>No past assessments</Text>
          <Text style={styles.emptySub}>Run your first analysis from the Home tab.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {history.map((item) => {
            const color = VERDICT_COLORS[item.verdict] ?? COLORS.textMuted;
            const date = new Date(item.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            });
            return (
              <View key={item.id} style={styles.card}>
                {/* Top row */}
                <View style={styles.cardTop}>
                  <Text style={styles.sector}>{item.sector}</Text>
                  <View style={[styles.verdictBadge, {
                    backgroundColor: color + '18',
                    borderColor: color + '55',
                  }]}>
                    <Text style={[styles.verdictText, { color }]}>{item.verdict}</Text>
                  </View>
                </View>

                {/* Location */}
                <Text style={styles.village}>{item.villageName} • {item.district}</Text>

                {/* Bottom row */}
                <View style={styles.cardBottom}>
                  <View style={styles.metaChip}>
                    <Ionicons name="cash-outline" size={12} color={COLORS.textMuted} />
                    <Text style={styles.meta}>₹{item.availableCapital.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
                    <Text style={styles.meta}>{date}</Text>
                  </View>
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
  root: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 44) + 8 : 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 4,
  },
  clearBtnText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '700',
  },

  // Empty state
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.accentBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // List
  list: { padding: 20, gap: 12, paddingBottom: 100 },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    padding: 16,
    shadowColor: '#4A3B2C',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sector: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  verdictBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  verdictText: { fontSize: 12, fontWeight: '700' },
  village: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 },
  cardBottom: { flexDirection: 'row', gap: 12 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.subCardBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  meta: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
});
