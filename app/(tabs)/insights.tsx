import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bg:           '#FAF0E6',
  cardBg:       '#FFFFFF',
  cardBorder:   '#EAE1D2',
  textPrimary:  '#2B231F',
  textSecondary:'#5A4E44',
  textMuted:    '#8A7B6F',
  accent:       '#BD5D38',
  accentBg:     'rgba(189,93,56,0.10)',
};

export default function InsightsScreen() {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── Header ─────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market Insights</Text>
        <Text style={styles.headerSub}>Mandi prices, NABARD credit plans & scheme directory</Text>
      </View>

      {/* ── Placeholder Card ────────────────────────── */}
      <View style={styles.placeholderCard}>
        <View style={styles.iconWrap}>
          <Ionicons name="bar-chart-outline" size={28} color={COLORS.accent} />
        </View>
        <Text style={styles.placeholderTitle}>Insights Coming Soon</Text>
        <Text style={styles.placeholderSub}>
          This screen will show Agmarknet mandi prices, NABARD district credit plans, and the full
          government scheme directory with bookmarking.
        </Text>
      </View>

      {/* ── Teaser Rows ─────────────────────────────── */}
      {[
        { icon: 'trending-up-outline' as const, label: 'Mandi Prices', desc: 'Live agri commodity rates' },
        { icon: 'documents-outline' as const,   label: 'Scheme Directory', desc: 'PM schemes & NABARD plans' },
        { icon: 'bookmark-outline' as const,    label: 'Saved Schemes', desc: 'Your bookmarked schemes' },
      ].map((item) => (
        <View key={item.label} style={styles.teaserRow}>
          <View style={styles.teaserIconWrap}>
            <Ionicons name={item.icon} size={20} color={COLORS.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.teaserLabel}>{item.label}</Text>
            <Text style={styles.teaserDesc}>{item.desc}</Text>
          </View>
          <Ionicons name="lock-closed-outline" size={16} color={COLORS.textMuted} />
        </View>
      ))}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingBottom: 32 },

  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 44) + 8 : 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: COLORS.bg,
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
    lineHeight: 20,
  },

  placeholderCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#4A3B2C',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.accentBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  placeholderSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  teaserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    padding: 14,
    gap: 14,
    shadowColor: '#4A3B2C',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  teaserIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.accentBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teaserLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  teaserDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
