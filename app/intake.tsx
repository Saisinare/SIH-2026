import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,

  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../src/presentation/store/app-store';
import { villageRepo, runAssessment } from '../src/core/di';
import { Village } from '../src/domain/models/village';
import { ApiSector } from '../src/data/services/api-client';
import { loadSectors, sectorLabel, sectorIcon } from '../src/data/services/sector-catalog';

const COLORS = {
  bg: '#FAF0E6',
  cardBg: '#FFFFFF',
  cardBorder: '#EAE1D2',
  textPrimary: '#2B231F',
  textSecondary: '#5A4E44',
  textMuted: '#8A7B6F',
  accent: '#BD5D38',
  accentLight: '#F3E8DA',
  green: '#10B981',
  headerBg: '#BD5D38', // Teal green top header like image
};

/**
 * Sector ids here are the backend's own (/sectors); the amounts are just
 * convenient starting points, not claims about any village.
 */
const QUICK_FILLS = [
  { label: 'Kirana store · ₹3L', sector: 'kirana_retail', loanAmount: 300000, capital: 60000 },
  { label: 'Dairy (buffalo) · ₹1.8L', sector: 'dairy_buffalo', loanAmount: 180000, capital: 40000 },
  { label: 'Goat rearing · ₹1.25L', sector: 'goat_rearing', loanAmount: 125000, capital: 30000 },
  { label: 'Backyard poultry · ₹35k', sector: 'backyard_poultry', loanAmount: 35000, capital: 10000 },
];

export default function IntakeScreen() {
  const router = useRouter();
  const {
    sector,
    setSector,
    loanAmount,
    setLoanAmount,
    availableCapital,
    setAvailableCapital,
    isWoman,
    setIsWoman,
    isScSt,
    setIsScSt,
    setVerdict,
    isLoading,
    setIsLoading,
    selectedVillage,
    setVillage,
    locale,
  } = useAppStore();

  const [villageQuery, setVillageQuery] = useState(selectedVillage?.name ?? '');
  const [suggestions, setSuggestions] = useState<Village[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sectors, setSectors] = useState<ApiSector[]>([]);
  const [sectorsError, setSectorsError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // The picker offers exactly the sectors the engine can assess. Loading them
  // from the backend rather than a local list means a chip can never promise a
  // verdict the server cannot produce.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await loadSectors();
      if (cancelled) return;
      if (res.success) {
        setSectors(res.data);
        setSectorsError(null);
        // Keep the stored sector valid: an old saved value (or the default)
        // may not be one of the ids the backend accepts.
        if (!res.data.some((s2) => s2.sector_id === sector) && res.data.length > 0) {
          setSector(res.data[0].sector_id);
        }
      } else {
        setSectorsError(res.error.message);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearchChanged = async (query: string) => {
    setVillageQuery(query);
    if (selectedVillage && query !== selectedVillage.name) {
      setVillage(null);
    }
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    const result = await villageRepo.searchByName(query);
    setIsSearching(false);
    if (result.success) {
      setSuggestions(result.data.slice(0, 8));
      setSearchError(null);
    } else {
      // A failed lookup used to render as an empty suggestion list, which is
      // indistinguishable from "no such village" — say which it was.
      setSuggestions([]);
      setSearchError(result.error.message);
    }
  };

  /**
   * Quick-fill only sets the sector and the amounts. It deliberately does NOT
   * pick a village: the earlier presets pointed at sample villages ("Rampur",
   * "Nimgaon", ids V001/V014/V023) that do not exist in the real register, so
   * they either failed silently or put a verdict on a fictional place.
   */
  const applyPreset = (opts: { sector: string; loanAmount: number; capital: number }) => {
    setSector(opts.sector);
    setLoanAmount(opts.loanAmount);
    setAvailableCapital(opts.capital);
  };

  const handleAnalyze = async () => {
    let village = selectedVillage;
    if (!village) {
      if (!villageQuery.trim()) {
        Alert.alert('Village needed', 'Enter your village name so the assessment uses real local data.');
        return;
      }
      const search = await villageRepo.searchByName(villageQuery);
      if (search.success && search.data.length > 0) {
        village = search.data[0];
        setVillage(village);
      } else {
        // No invented fallback village — a name we cannot resolve against the
        // real village register is a name we must not put a verdict on.
        Alert.alert(
          'Village not found',
          `We could not find "${villageQuery}" in the village register. Check the spelling, or pick one of the suggestions.`
        );
        return;
      }
    }

    setIsLoading(true);
    const result = await runAssessment({
      village,
      sector,
      requestedLoanAmount: loanAmount,
      availableCapital,
      // SC/ST is the backend's own target-group term; women-headed is not a
      // separate group in the committed NBCFDC rules, so it is not faked here.
      targetGroup: isScSt ? 'SC' : 'OBC',
      lang: locale === 'en' ? 'en' : 'mr',
    });
    setIsLoading(false);

    if (result.success) {
      setVerdict(result.data);
      router.push('/results');
    } else {
      Alert.alert('Assessment unavailable', result.error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#BD5D38" />

      {/* ── TOP HEADER (Matching Image 1 & 2) ─────────────────────────── */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>व्यवसाय तपशील</Text>

        <View style={styles.headerRightIcons}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/history')}
          >
            <Ionicons name="time-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── QUICK FILL CARD ───────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.presetHeaderRow}>
            <Ionicons name="flash" size={16} color="#BD5D38" />
            <Text style={styles.presetTitle}>Quick fill</Text>
          </View>
          <Text style={styles.presetCaption}>
            Fills the sector and amounts only — enter your own village below.
          </Text>

          <View style={styles.presetList}>
            {QUICK_FILLS.map((q) => (
              <TouchableOpacity
                key={q.sector}
                style={styles.presetItem}
                activeOpacity={0.8}
                onPress={() => applyPreset(q)}
              >
                <Ionicons name={sectorIcon(q.sector) as any} size={16} color="#BD5D38" />
                <Text style={styles.presetText}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 1. VILLAGE NAME (१. गावाचे नाव) ────────────────────────── */}
        <Text style={styles.sectionLabel}>१. गावाचे नाव</Text>
        <View style={styles.inputRowContainer}>
          <View style={styles.inputBox}>
            <Ionicons name="location-outline" size={20} color="#BD5D38" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={villageQuery}
              onChangeText={onSearchChanged}
              placeholder="e.g. Nimgaon, Sangamner..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={styles.micInputBtn} activeOpacity={0.8}>
            <Ionicons name="mic" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {isSearching ? <ActivityIndicator style={{ marginTop: 8 }} color="#BD5D38" /> : null}

        {searchError ? <Text style={styles.errorHint}>{searchError}</Text> : null}

        {!isSearching && !searchError && villageQuery.trim().length > 1 && suggestions.length === 0 && !selectedVillage ? (
          <Text style={styles.selectedHint}>
            No village matching “{villageQuery.trim()}” in the register.
          </Text>
        ) : null}

        {suggestions.length > 0 ? (
          <View style={styles.suggestionBox}>
            {suggestions.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.suggestionRow,
                  selectedVillage?.id === v.id && styles.suggestionActive,
                ]}
                onPress={() => {
                  setVillage(v);
                  setVillageQuery(v.name);
                  setSuggestions([]);
                }}
              >
                <Text style={styles.suggestionTitle}>{v.name}</Text>
                <Text style={styles.suggestionSub}>
                  {v.taluka}, {v.district} • Pop {v.population}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {selectedVillage ? (
          <Text style={styles.selectedHint}>
            ✓ निवडलेले गाव: {selectedVillage.name} ({selectedVillage.district})
          </Text>
        ) : null}

        {/* ── 2. BUSINESS SECTOR (२. व्यवसाय प्रकार) ────────────────────── */}
        <Text style={styles.sectionLabel}>२. व्यवसाय प्रकार</Text>
        {sectorsError ? (
          <Text style={styles.errorHint}>
            Could not load the sector list from the server ({sectorsError}). An assessment
            needs the server, so try again once it is reachable.
          </Text>
        ) : null}
        {sectors.length === 0 && !sectorsError ? (
          <ActivityIndicator color="#BD5D38" style={{ alignSelf: 'flex-start' }} />
        ) : null}
        <View style={styles.chipsContainer}>
          {sectors.map((s) => {
            const isActive = sector === s.sector_id;
            return (
              <TouchableOpacity
                key={s.sector_id}
                style={[styles.sectorChip, isActive && styles.sectorChipActive]}
                activeOpacity={0.8}
                onPress={() => setSector(s.sector_id)}
              >
                <Ionicons
                  name={(isActive ? 'checkmark' : sectorIcon(s.sector_id)) as any}
                  size={16}
                  color={isActive ? '#FFFFFF' : '#BD5D38'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.sectorChipText, isActive && styles.sectorChipTextActive]}>
                  {sectorLabel(s, locale)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── 3. EXPECTED LOAN AMOUNT (३. अपेक्षित कर्ज रक्कम) ─────────── */}
        <View style={styles.amountHeaderRow}>
          <Text style={styles.sectionLabelNoMargin}>३. अपेक्षित कर्ज रक्कम</Text>
          <Text style={styles.amountDisplay}>₹{loanAmount.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.sliderContainer}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setLoanAmount(Math.max(10000, loanAmount - 25000))}
          >
            <Ionicons name="remove" size={18} color="#BD5D38" />
          </TouchableOpacity>

          <TextInput
            style={styles.numericAmountInput}
            value={String(loanAmount)}
            onChangeText={(t) => setLoanAmount(Number(t) || 0)}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setLoanAmount(loanAmount + 25000)}
          >
            <Ionicons name="add" size={18} color="#BD5D38" />
          </TouchableOpacity>
        </View>

        {/* ── 4. OWN CAPITAL (४. स्वतःचे भांडवल) ────────────────────────── */}
        <View style={styles.amountHeaderRow}>
          <Text style={styles.sectionLabelNoMargin}>४. स्वतःचे भांडवल</Text>
          <Text style={[styles.amountDisplay, { color: '#BD5D38' }]}>
            ₹{availableCapital.toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.sliderContainer}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setAvailableCapital(Math.max(5000, availableCapital - 10000))}
          >
            <Ionicons name="remove" size={18} color="#BD5D38" />
          </TouchableOpacity>

          <TextInput
            style={styles.numericAmountInput}
            value={String(availableCapital)}
            onChangeText={(t) => setAvailableCapital(Number(t) || 0)}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setAvailableCapital(availableCapital + 10000)}
          >
            <Ionicons name="add" size={18} color="#BD5D38" />
          </TouchableOpacity>
        </View>

        {/* ── SWITCHES CARD (Matching Image 2) ──────────────────────── */}
        <View style={styles.switchesCard}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>महिला उद्योजक</Text>
              <Text style={styles.switchSub}>Stand-Up India / Women subsidy schemes</Text>
            </View>
            <Switch
              value={isWoman}
              onValueChange={setIsWoman}
              trackColor={{ false: '#E5D6C7', true: '#BD5D38' }}
              thumbColor={isWoman ? '#FFFFFF' : '#F4F4F5'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>SC / ST लाभार्थी</Text>
              <Text style={styles.switchSub}>NBCFDC / Special credit benefits</Text>
            </View>
            <Switch
              value={isScSt}
              onValueChange={setIsScSt}
              trackColor={{ false: '#E5D6C7', true: '#BD5D38' }}
              thumbColor={isScSt ? '#FFFFFF' : '#F4F4F5'}
            />
          </View>
        </View>

        {/* ── ANALYZE BUTTON (व्यवसाय शक्यता तपासा) ────────────────── */}
        <TouchableOpacity
          style={styles.analyzeBtn}
          activeOpacity={0.88}
          onPress={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.analyzeBtnContent}>
              <Ionicons name="analytics" size={20} color="#FFFFFF" />
              <Text style={styles.analyzeBtnText}>व्यवसाय शक्यता तपासा</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  topHeader: {
    backgroundColor: '#BD5D38',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 12) + 8 : 14,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    padding: 6,
  },

  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  // Preset Card
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginBottom: 20,
    shadowColor: '#4A3B2C',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  presetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  presetTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  presetList: {
    gap: 8,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7EFE6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EADECE',
  },
  presetCaption: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: -6,
    marginBottom: 10,
  },
  errorHint: {
    fontSize: 12,
    color: '#B3261E',
    marginTop: 8,
    marginBottom: 10,
    lineHeight: 17,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  // Section Labels
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 14,
    marginBottom: 10,
  },
  sectionLabelNoMargin: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  // Village Input Row
  inputRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  micInputBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#BD5D38',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#BD5D38',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  suggestionBox: {
    marginTop: 8,
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  suggestionRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE6',
  },
  suggestionActive: {
    backgroundColor: '#F3E8DA',
  },
  suggestionTitle: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  suggestionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  selectedHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BD5D38',
    marginTop: 6,
  },

  // Chips
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  sectorChipActive: {
    backgroundColor: '#BD5D38',
    borderColor: '#BD5D38',
  },
  sectorChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectorChipTextActive: {
    color: '#FFFFFF',
  },

  // Amount Controls
  amountHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  amountDisplay: {
    fontSize: 18,
    fontWeight: '800',
    color: '#BD5D38',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    height: 52,
    justifyContent: 'space-between',
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3E8DA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numericAmountInput: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    minWidth: 120,
  },

  // Switches Card
  switchesCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginTop: 24,
    marginBottom: 24,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EDE6',
    marginVertical: 12,
  },

  // Analyze Button
  analyzeBtn: {
    backgroundColor: '#BD5D38',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#BD5D38',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  analyzeBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  analyzeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
