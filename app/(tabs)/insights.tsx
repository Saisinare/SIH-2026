import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { schemeRepo, apiClient } from '../../src/core/di';
import { SchemeRule } from '../../src/domain/models/scheme-rule';
import { PlpSectionsResponse } from '../../src/data/services/api-client';
import { loadSectors, sectorLabel } from '../../src/data/services/sector-catalog';
import { useAppStore } from '../../src/presentation/store/app-store';
import { Ionicons } from '@expo/vector-icons';

/**
 * Insights = the two reference libraries the backend actually holds:
 * the committed scheme rules, and the NABARD Potential Linked Credit Plan.
 *
 * The old "Mandi Prices" tab is gone. It read from a sample price file, and
 * the product states plainly that Agmarknet publishes no milk price series —
 * showing an invented one would contradict the one promise the app makes.
 */

const COLORS = {
  bg: '#FAF0E6',
  card: '#FFFFFF',
  border: '#EAE1D2',
  ink: '#2B231F',
  ink2: '#5A4E44',
  muted: '#8A7B6F',
  accent: '#BD5D38',
};

type Tab = 'schemes' | 'plp';

export default function InsightsScreen() {
  const router = useRouter();
  const { locale, bookmarkedSchemes, toggleBookmark, loadBookmarksFromStorage } = useAppStore();

  useEffect(() => {
    loadBookmarksFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [tab, setTab] = useState<Tab>('schemes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [schemes, setSchemes] = useState<SchemeRule[]>([]);
  const [schemeQuery, setSchemeQuery] = useState('');

  const [plp, setPlp] = useState<PlpSectionsResponse | null>(null);
  const [sectorNames, setSectorNames] = useState<Record<string, string>>({});
  const [openSector, setOpenSector] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [schemeRes, plpRes, sectorRes] = await Promise.all([
        schemeRepo.loadAll(),
        apiClient.plpSections(),
        loadSectors(),
      ]);
      if (cancelled) return;

      if (schemeRes.success) setSchemes(schemeRes.data);
      if (plpRes.success) setPlp(plpRes.data);
      if (sectorRes.success) {
        const map: Record<string, string> = {};
        sectorRes.data.forEach((s) => {
          map[s.sector_id] = sectorLabel(s, locale);
        });
        setSectorNames(map);
      }

      // Only report a failure if we genuinely have nothing to show.
      if (!schemeRes.success && !plpRes.success) {
        setError(schemeRes.error.message);
      } else {
        setError(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const filteredSchemes = schemes.filter((s) => {
    const q = schemeQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.shortName.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {router.canGoBack() ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.headerTitle}>Schemes & District Plan</Text>
      <Text style={styles.caption}>
        Scheme terms as committed in the backend rule set, and the NABARD Potential Linked
        Credit Plan — the same two sources the assessment cites.
      </Text>

      <View style={styles.tabs}>
        {([
          ['schemes', 'Schemes'],
          ['plp', 'District plan'],
        ] as [Tab, string][]).map(([t, label]) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <ActivityIndicator color={COLORS.accent} style={{ marginTop: 24 }} /> : null}

      {!loading && error ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cannot reach the server</Text>
          <Text style={styles.muted}>{error}</Text>
          <Text style={styles.muted}>
            Scheme terms and the district plan are read live so they always match what the
            assessment used. Nothing is cached on the device to stand in for them.
          </Text>
        </View>
      ) : null}

      {/* ── SCHEMES ─────────────────────────────────────────────────── */}
      {!loading && tab === 'schemes' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Search schemes..."
            placeholderTextColor="#9CA3AF"
            value={schemeQuery}
            onChangeText={setSchemeQuery}
          />
          {filteredSchemes.length === 0 ? (
            <Text style={styles.muted}>No scheme matches “{schemeQuery}”.</Text>
          ) : null}
          {filteredSchemes.map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={styles.schemeTitleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{s.name}</Text>
                  <Text style={styles.shortName}>{s.shortName}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleBookmark(s.name)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={bookmarkedSchemes.includes(s.name) ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={COLORS.accent}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.statRow}>
                <Stat label="Cap" value={`₹${(s.maxLoanAmount / 100000).toFixed(1)}L`} />
                <Stat label="Tenure" value={`${s.tenureYears} yrs`} />
                <Stat label="From" value={`${s.interestRatePercent.toFixed(1)}%`} />
              </View>
              <Text style={styles.muted}>{s.description}</Text>
            </View>
          ))}
          {filteredSchemes.length > 0 ? (
            <Text style={styles.sourceNote}>Source: {schemeRepo.sourceMeta}</Text>
          ) : null}
        </>
      ) : null}

      {/* ── PLP ─────────────────────────────────────────────────────── */}
      {!loading && tab === 'plp' && plp ? (
        plp.available ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{plp.document}</Text>
              <Text style={styles.muted}>
                {plp.total_chunks} indexed passages · {(plp.sections ?? []).length} sections
              </Text>
              {plp.note ? <Text style={styles.muted}>{plp.note}</Text> : null}
            </View>

            <Text style={styles.groupHeading}>What the plan says about each sector</Text>
            {(plp.by_sector ?? []).map((b) => {
              const open = openSector === b.sector_id;
              const name = sectorNames[b.sector_id] ?? b.sector_name?.en ?? b.sector_id;
              return (
                <View key={b.sector_id} style={styles.card}>
                  <TouchableOpacity
                    onPress={() => setOpenSector(open ? null : b.sector_id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cardTitle}>{name}</Text>
                    <Text style={styles.muted}>
                      {b.sections.length} passage{b.sections.length === 1 ? '' : 's'} ·{' '}
                      {open ? 'tap to collapse' : 'tap to read'}
                    </Text>
                  </TouchableOpacity>
                  {open
                    ? b.sections.map((sec, i) => (
                        <View key={i} style={styles.excerptBox}>
                          <Text style={styles.excerptHeading}>{sec.heading}</Text>
                          <Text style={styles.excerpt}>{sec.excerpt}</Text>
                          <Text style={styles.pageRef}>Page {sec.page}</Text>
                        </View>
                      ))
                    : null}
                </View>
              );
            })}

            <Text style={styles.groupHeading}>Full section index</Text>
            {(plp.sections ?? []).map((sec, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.sectionHeading}>{sec.heading}</Text>
                <Text style={styles.pageRef}>
                  Pages {sec.page_start}
                  {sec.page_end !== sec.page_start ? `–${sec.page_end}` : ''}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>District plan not indexed</Text>
            <Text style={styles.muted}>
              {plp.note ?? 'The PLP document is not loaded on this server.'}
            </Text>
          </View>
        )
      ) : null}
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.bg,
    padding: 20,
    paddingTop: 56,
    paddingBottom: 120,
  },
  back: {
    color: COLORS.accent,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.ink,
  },
  caption: {
    fontSize: 12,
    color: COLORS.ink2,
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ink2,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.ink,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ink,
  },
  groupHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.ink2,
    marginTop: 10,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  muted: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
    lineHeight: 18,
  },
  schemeTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  shortName: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 12,
    marginTop: 2,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 4,
  },
  stat: {
    flex: 1,
    backgroundColor: '#F7EFE6',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.ink,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  excerptBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0EDE6',
  },
  excerptHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.ink2,
  },
  excerpt: {
    fontSize: 12,
    color: COLORS.ink2,
    lineHeight: 19,
    marginTop: 6,
  },
  pageRef: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 6,
    fontWeight: '600',
  },
  sourceNote: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.card,
    marginBottom: 12,
    color: COLORS.ink,
  },
});
