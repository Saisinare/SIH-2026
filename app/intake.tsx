import React, { useState } from 'react';
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
import { villageRepo, verdictEngine } from '../src/core/di';
import { Village } from '../src/domain/models/village';
import { AppConstants } from '../src/core/constants/app-constants';

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
  } = useAppStore();

  const [villageQuery, setVillageQuery] = useState(selectedVillage?.name ?? '');
  const [suggestions, setSuggestions] = useState<Village[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
    } else {
      setSuggestions([]);
    }
  };

  const applyPreset = async (opts: {
    villageId?: string;
    villageName: string;
    sector: string;
    loanAmount: number;
    capital: number;
  }) => {
    setSector(opts.sector);
    setLoanAmount(opts.loanAmount);
    setAvailableCapital(opts.capital);
    if (opts.villageId) {
      const byId = await villageRepo.findById(opts.villageId);
      if (byId.success) {
        setVillage(byId.data);
        setVillageQuery(byId.data.name);
        setSuggestions([]);
        return;
      }
    }
    const search = await villageRepo.searchByName(opts.villageName);
    if (search.success && search.data.length > 0) {
      setVillage(search.data[0]);
      setVillageQuery(search.data[0].name);
      setSuggestions(search.data.length > 1 ? search.data : []);
    }
  };

  const handleAnalyze = async () => {
    let village = selectedVillage;
    if (!village) {
      const search = await villageRepo.searchByName(villageQuery || 'Nimgaon');
      if (search.success && search.data.length > 0) {
        village = search.data[0];
        setVillage(village);
      } else {
        // Fallback default village for demo
        village = {
          id: 'V014',
          name: villageQuery || 'Nimgaon',
          district: 'Satvara',
          taluka: 'Yeola',
          state: 'Maharashtra',
          population: 4200,
          households: 850,
          electrified: true,
          bankBranchAvailable: true,
          pavedRoadAccess: true,
        };
        setVillage(village);
      }
    }

    setIsLoading(true);
    const result = await verdictEngine.evaluate(
      village,
      sector,
      loanAmount,
      availableCapital,
      isWoman,
      isScSt
    );
    setIsLoading(false);

    if (result.success) {
      setVerdict(result.data);
      router.push('/results');
    } else {
      Alert.alert('Engine Error', result.error.message);
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
        {/* ── PRESETS CARD (Matching Image 1) ───────────────────────── */}
        <View style={styles.card}>
          <View style={styles.presetHeaderRow}>
            <Ionicons name="flash" size={16} color="#BD5D38" />
            <Text style={styles.presetTitle}>Quick Demo Presets</Text>
          </View>

          <View style={styles.presetList}>
            <TouchableOpacity
              style={styles.presetItem}
              activeOpacity={0.8}
              onPress={() =>
                applyPreset({
                  villageId: 'V001',
                  villageName: 'Rampur',
                  sector: 'Kirana Store',
                  loanAmount: 300000,
                  capital: 60000,
                })
              }
            >
              <Ionicons name="basket-outline" size={16} color="#BD5D38" />
              <Text style={styles.presetText}>Kirana (Saturated)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetItem}
              activeOpacity={0.8}
              onPress={() =>
                applyPreset({
                  villageId: 'V014',
                  villageName: 'Nimgaon',
                  sector: 'Dairy',
                  loanAmount: 100000,
                  capital: 40000,
                })
              }
            >
              <Ionicons name="water-outline" size={16} color="#0D6B6E" />
              <Text style={styles.presetText}>Dairy (High Viability)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetItem}
              activeOpacity={0.8}
              onPress={() =>
                applyPreset({
                  villageId: 'V023',
                  villageName: 'Wanjarwadi',
                  sector: 'Poultry',
                  loanAmount: 250000,
                  capital: 15000,
                })
              }
            >
              <Ionicons name="egg-outline" size={16} color="#D97706" />
              <Text style={styles.presetText}>Poultry (Over-borrow)</Text>
            </TouchableOpacity>
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
              placeholder="e.g. Rampur, Nandgaon..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={styles.micInputBtn} activeOpacity={0.8}>
            <Ionicons name="mic" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {isSearching ? <ActivityIndicator style={{ marginTop: 8 }} color="#BD5D38" /> : null}

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
        <View style={styles.chipsContainer}>
          {AppConstants.businessSectors.map((s) => {
            const isActive = sector === s;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.sectorChip, isActive && styles.sectorChipActive]}
                activeOpacity={0.8}
                onPress={() => setSector(s)}
              >
                {isActive ? (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                ) : null}
                <Text style={[styles.sectorChipText, isActive && styles.sectorChipTextActive]}>
                  {s}
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
