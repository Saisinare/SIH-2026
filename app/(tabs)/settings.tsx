import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Switch, TouchableOpacity, Platform, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/presentation/store/app-store';
import { apiClient, ApiRun } from '../../src/data/services/api-client';

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
  warning:       '#F59E0B',
  error:         '#EF4444',
};

const LANGUAGES = [
  { code: 'hi' as const, label: 'हिन्दी (Hindi)' },
  { code: 'mr' as const, label: 'मराठी (Marathi)' },
  { code: 'en' as const, label: 'English' },
];

export default function SettingsScreen() {
  const {
    locale, setLocale,
    officerMode, setOfficerMode,
    bookmarkedSchemes, toggleBookmark,
    loadBookmarksFromStorage,
  } = useAppStore();

  useEffect(() => { loadBookmarksFromStorage(); }, []);

  // Officer view lists the backend's own run log. It previously showed three
  // invented applicants ("Suresh Patil", "Anita Devi", …) with invented
  // villages, amounts and verdicts — a review queue of people who do not
  // exist is the worst possible thing to put in front of a loan officer.
  const [runs, setRuns] = useState<ApiRun[] | null>(null);
  const [runsError, setRunsError] = useState<string | null>(null);

  useEffect(() => {
    if (!officerMode) return;
    let cancelled = false;
    (async () => {
      const res = await apiClient.runs(20);
      if (cancelled) return;
      if (res.success) { setRuns(res.data.runs); setRunsError(null); }
      else { setRuns(null); setRunsError(res.error.message); }
    })();
    return () => { cancelled = true; };
  }, [officerMode]);

  const verdictColor = (v: string) =>
    v === 'PROCEED' ? COLORS.success : v === 'PROCEED_WITH_CHANGES' ? COLORS.warning : COLORS.error;
  const verdictLabel = (v: string) =>
    v === 'PROCEED' ? 'Proceed' : v === 'PROCEED_WITH_CHANGES' ? 'Adjust' : 'Reconsider';

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── Header ─────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSub}>Language, mode & saved schemes</Text>
      </View>

      {/* ── Language ──────────────────────────────── */}
      <Text style={styles.sectionLabel}>Language / भाषा / भाषा</Text>
      <View style={styles.card}>
        {LANGUAGES.map((lang, idx) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.row, idx < LANGUAGES.length - 1 && styles.divider]}
            onPress={() => setLocale(lang.code)}
          >
            <Text style={styles.rowLabel}>{lang.label}</Text>
            <View style={[styles.radio, locale === lang.code && styles.radioActive]}>
              {locale === lang.code && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Institutional Mode ────────────────────── */}
      <Text style={styles.sectionLabel}>Institutional Mode</Text>
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchRowIcon}>
            <Ionicons name="business-outline" size={18} color={COLORS.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>Bank Officer View</Text>
            <Text style={styles.rowSub}>Branch manager & loan review simulation</Text>
          </View>
          <Switch
            value={officerMode}
            onValueChange={setOfficerMode}
            trackColor={{ false: COLORS.cardBorder, true: COLORS.accent }}
            thumbColor="#FFFFFF"
          />
        </View>

        {officerMode && (
          <View style={styles.applicantList}>
            {runsError ? (
              <Text style={styles.rowSub}>
                Cannot reach the server ({runsError}). The review queue is read live from the
                backend run log; nothing is cached on the device to stand in for it.
              </Text>
            ) : runs === null ? (
              <ActivityIndicator color={COLORS.accent} />
            ) : runs.length === 0 ? (
              <Text style={styles.rowSub}>
                No assessments have been run against this server yet.
              </Text>
            ) : (
              runs.map((r) => (
                <View key={r.run_id} style={styles.applicant}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.applicantName}>{r.village}</Text>
                    <Text style={styles.applicantSub}>
                      {r.sector.replace(/_/g, ' ')} • {r.confidence} confidence • run {r.run_id.slice(0, 8)}
                    </Text>
                  </View>
                  <Text style={styles.applicantAmt}>
                    ₹{Math.round(r.capital_inr).toLocaleString('en-IN')}
                  </Text>
                  <View
                    style={[
                      styles.verdictBadge,
                      {
                        backgroundColor: verdictColor(r.verdict) + '18',
                        borderColor: verdictColor(r.verdict) + '55',
                      },
                    ]}
                  >
                    <Text style={[styles.verdictText, { color: verdictColor(r.verdict) }]}>
                      {verdictLabel(r.verdict)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </View>

      {/* ── Bookmarked Schemes ────────────────────── */}
      <Text style={styles.sectionLabel}>Bookmarked Schemes</Text>
      <View style={styles.card}>
        {bookmarkedSchemes.length === 0 ? (
          <View style={styles.emptyRow}>
            <Ionicons name="bookmark-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No bookmarks yet. Save schemes from the Insights tab.</Text>
          </View>
        ) : (
          bookmarkedSchemes.map((s) => (
            <View key={s} style={[styles.bookmarkRow, styles.divider]}>
              <Ionicons name="bookmark" size={16} color={COLORS.accent} style={{ marginRight: 10 }} />
              <Text style={styles.bookmarkName}>{s}</Text>
              <TouchableOpacity onPress={() => toggleBookmark(s)}>
                <Ionicons name="close-outline" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* ── Onboarding & Account ─────────────────── */}
      <Text style={styles.sectionLabel}>Onboarding & Account</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => { useAppStore.getState().resetOnboarding(); }}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowLabel, { color: COLORS.error }]}>Reset Onboarding Flow</Text>
            <Text style={styles.rowSub}>Clear saved onboarding answers & restart sign-up</Text>
          </View>
          <Ionicons name="refresh-outline" size={18} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      {/* ── About ────────────────────────────────── */}
      <View style={styles.about}>
        <Text style={styles.aboutTitle}>उद्यम सारथी (Udyam Saarthi)</Text>
        <Text style={styles.aboutSub}>
          Smart India Hackathon 2026 • Problem #26091{'\n'}Theme: Agriculture / FoodTech / Rural Development
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingBottom: 100 },

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
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    shadowColor: '#4A3B2C',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '600', flex: 1 },
  rowSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.accent },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.accent },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  switchRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.accentBg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  applicantList: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    padding: 12,
    gap: 8,
  },
  applicant: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.subCardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 8,
  },
  applicantName: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  applicantSub:  { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  applicantAmt:  { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginRight: 4 },
  verdictBadge:  { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  verdictText:   { fontSize: 11, fontWeight: '700' },

  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  emptyText: { fontSize: 13, color: COLORS.textMuted, flex: 1 },

  bookmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bookmarkName: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },

  about: { margin: 24, alignItems: 'center' },
  aboutTitle: { fontSize: 14, fontWeight: '700', color: COLORS.accent },
  aboutSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
});
