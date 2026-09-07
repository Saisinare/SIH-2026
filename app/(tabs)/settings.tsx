import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useAppStore } from '../../src/presentation/store/app-store';

const PRIMARY = '#0F766E';
const BG = '#F0FDFA';

const LANGUAGES = [
  { code: 'hi' as const, label: 'हिन्दी (Hindi)' },
  { code: 'mr' as const, label: 'मराठी (Marathi)' },
  { code: 'en' as const, label: 'English' },
];

export default function SettingsScreen() {
  const { locale, setLocale, officerMode, setOfficerMode, bookmarkedSchemes, toggleBookmark, loadBookmarksFromStorage } = useAppStore();

  useEffect(() => { loadBookmarksFromStorage(); }, []);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Settings</Text>
        <Text style={styles.headerSub}>Language, mode & saved schemes</Text>
      </View>

      {/* Language */}
      <Text style={styles.sectionTitle}>Language / भाषा / भाषा</Text>
      <View style={styles.card}>
        {LANGUAGES.map((lang, idx) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.langRow, idx < LANGUAGES.length - 1 && styles.divider]}
            onPress={() => setLocale(lang.code)}
          >
            <Text style={styles.langLabel}>{lang.label}</Text>
            <View style={[styles.radio, locale === lang.code && styles.radioActive]}>
              {locale === lang.code && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Officer Mode */}
      <Text style={styles.sectionTitle}>Institutional Mode</Text>
      <View style={styles.card}>
        <View style={styles.officerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.officerLabel}>🏦 Bank Officer View</Text>
            <Text style={styles.officerSub}>Branch manager & loan review simulation</Text>
          </View>
          <Switch
            value={officerMode}
            onValueChange={setOfficerMode}
            trackColor={{ true: PRIMARY }}
          />
        </View>
        {officerMode && (
          <View style={styles.applicantList}>
            {[
              { name: 'Suresh Patil',   sector: 'Dairy',    village: 'Nimgaon', amount: '₹50,000',  verdict: 'Proceed',    color: '#10B981' },
              { name: 'Anita Devi',     sector: 'Kirana',   village: 'Rampur',  amount: '₹80,000',  verdict: 'Adjust',     color: '#F59E0B' },
              { name: 'Ramesh Shinde',  sector: 'Poultry',  village: 'Kavathe', amount: '₹1,50,000', verdict: 'Reconsider', color: '#EF4444' },
            ].map((a) => (
              <View key={a.name} style={styles.applicant}>
                <View>
                  <Text style={styles.applicantName}>{a.name}</Text>
                  <Text style={styles.applicantSub}>{a.sector} • {a.village}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.applicantAmt}>{a.amount}</Text>
                  <View style={[styles.badge, { backgroundColor: a.color + '22' }]}>
                    <Text style={[styles.badgeText, { color: a.color }]}>{a.verdict}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Bookmarks */}
      <Text style={styles.sectionTitle}>Bookmarked Schemes</Text>
      <View style={styles.card}>
        {bookmarkedSchemes.length === 0 ? (
          <Text style={styles.emptyText}>No bookmarks yet. Save schemes from the Insights tab.</Text>
        ) : (
          bookmarkedSchemes.map((s) => (
            <View key={s} style={styles.bookmarkRow}>
              <Text style={styles.bookmarkIcon}>🔖</Text>
              <Text style={styles.bookmarkName}>{s}</Text>
              <TouchableOpacity onPress={() => toggleBookmark(s)}>
                <Text style={styles.removeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* About */}
      <View style={styles.about}>
        <Text style={styles.aboutTitle}>उद्यम सारथी (Udyam Saarthi)</Text>
        <Text style={styles.aboutSub}>Smart India Hackathon 2026 • Problem #26091{'\n'}Theme: Agriculture / FoodTech / Rural Development</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  container: { paddingBottom: 40 },
  header: { backgroundColor: PRIMARY, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 24 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#FEF3C7' },
  headerSub: { fontSize: 13, color: '#99F6E4', marginTop: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginHorizontal: 16, marginTop: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: {
    backgroundColor: '#fff', marginHorizontal: 16,
    borderRadius: 16, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  langRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  langLabel: { fontSize: 15, color: '#1E293B', fontWeight: '500' },
  divider: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: PRIMARY },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: PRIMARY },
  officerRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  officerLabel: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  officerSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  applicantList: { borderTopWidth: 1, borderTopColor: '#F1F5F9', padding: 12, gap: 8 },
  applicant: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12 },
  applicantName: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  applicantSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  applicantAmt: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginRight: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  emptyText: { fontSize: 13, color: '#94A3B8', padding: 16, textAlign: 'center' },
  bookmarkRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  bookmarkIcon: { fontSize: 16, marginRight: 10 },
  bookmarkName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1E293B' },
  removeBtn: { fontSize: 14, color: '#94A3B8', paddingHorizontal: 4 },
  about: { margin: 24, alignItems: 'center' },
  aboutTitle: { fontSize: 14, fontWeight: '700', color: PRIMARY },
  aboutSub: { fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 4, lineHeight: 16 },
});
