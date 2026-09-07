import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, ScrollView, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../src/presentation/store/app-store';
import { verdictEngine, villageRepo } from '../../src/core/di';
import { Village } from '../../src/domain/models/village';

const SECTORS = [
  'Kirana Store', 'Dairy', 'Poultry',
  'Tailoring', 'Handicrafts', 'Agri-Input Shop', 'Flour Mill',
];

const PRESETS = [
  { label: '🛒 Kirana (Saturated)', village: 'Rampur',   sector: 'Kirana Store', loan: 60000,  capital: 20000 },
  { label: '🥛 Dairy (Viable)',     village: 'Nandgaon', sector: 'Dairy',        loan: 100000, capital: 40000 },
  { label: '🐣 Poultry (Risk)',      village: 'Shivpur',  sector: 'Poultry',      loan: 250000, capital: 15000 },
];

const PRIMARY = '#0F766E';
const AMBER   = '#F59E0B';
const BG      = '#F0FDFA';

export default function HomeScreen() {
  const router = useRouter();
  const {
    selectedVillage, setVillage,
    sector, setSector,
    loanAmount, setLoanAmount,
    availableCapital, setAvailableCapital,
    isWoman, setIsWoman,
    isScSt, setIsScSt,
    isLoading, setIsLoading,
    setVerdict,
  } = useAppStore();

  const [villages, setVillages] = useState<Village[]>([]);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<Village[]>([]);

  useEffect(() => {
    villageRepo.getVillagesInRadius(19.85, 75.32, 200).then((res) => {
      if (res.success) setVillages(res.data);
    });
  }, []);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.trim().length < 2) { setSuggestions([]); return; }
    const res = await villageRepo.searchByName(text);
    if (res.success) setSuggestions(res.data.slice(0, 5));
  };

  const selectVillage = (v: Village) => {
    setVillage(v);
    setSearchText(v.name);
    setSuggestions([]);
  };

  const applyPreset = async (p: typeof PRESETS[0]) => {
    setSearchText(p.village);
    setSector(p.sector);
    setLoanAmount(p.loan);
    setAvailableCapital(p.capital);
    const res = await villageRepo.searchByName(p.village);
    if (res.success && res.data.length > 0) setVillage(res.data[0]);
  };

  const handleAnalyze = async () => {
    if (!selectedVillage) { Alert.alert('Error', 'Please select a village'); return; }
    setIsLoading(true);
    const result = await verdictEngine.evaluate(
      selectedVillage, sector, loanAmount, availableCapital, isWoman, isScSt,
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
    <ScrollView style={styles.root} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>उद्यम सारथी</Text>
        <Text style={styles.headerSub}>Business Viability Advisor</Text>
      </View>

      {/* Quick Demo Presets */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ Quick Demo Presets</Text>
        <View style={styles.presetRow}>
          {PRESETS.map((p) => (
            <TouchableOpacity key={p.label} style={styles.presetChip} onPress={() => applyPreset(p)}>
              <Text style={styles.presetText}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Village Search */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>1. Village Name</Text>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={handleSearch}
          placeholder="e.g. Rampur, Nandgaon..."
          placeholderTextColor="#94A3B8"
        />
        {suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            {suggestions.map((v) => (
              <TouchableOpacity key={v.id} style={styles.suggestionItem} onPress={() => selectVillage(v)}>
                <Text style={styles.suggestionName}>📍 {v.name}</Text>
                <Text style={styles.suggestionSub}>{v.taluka}, {v.district}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {selectedVillage && (
          <View style={styles.selectedVillage}>
            <Text style={styles.selectedVillageText}>✅ {selectedVillage.name} • {selectedVillage.district}</Text>
          </View>
        )}
      </View>

      {/* Sector Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>2. Business Sector</Text>
        <View style={styles.chipRow}>
          {SECTORS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, sector === s && styles.chipActive]}
              onPress={() => setSector(s)}
            >
              <Text style={[styles.chipText, sector === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Loan Amount */}
      <View style={styles.section}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sectionLabel}>3. Requested Loan</Text>
          <Text style={styles.sliderValue}>₹{loanAmount.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.sliderButtons}>
          {[50000, 100000, 150000, 200000, 300000, 500000].map((amt) => (
            <TouchableOpacity
              key={amt}
              style={[styles.amtBtn, loanAmount === amt && styles.amtBtnActive]}
              onPress={() => setLoanAmount(amt)}
            >
              <Text style={[styles.amtBtnText, loanAmount === amt && styles.amtBtnTextActive]}>
                ₹{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Capital */}
      <View style={styles.section}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sectionLabel}>4. Own Capital</Text>
          <Text style={[styles.sliderValue, { color: AMBER }]}>₹{availableCapital.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.sliderButtons}>
          {[0, 10000, 20000, 40000, 75000, 100000].map((amt) => (
            <TouchableOpacity
              key={amt}
              style={[styles.amtBtn, availableCapital === amt && styles.amtBtnActive]}
              onPress={() => setAvailableCapital(amt)}
            >
              <Text style={[styles.amtBtnText, availableCapital === amt && styles.amtBtnTextActive]}>
                {amt === 0 ? '₹0' : amt >= 100000 ? `₹${amt / 100000}L` : `₹${amt / 1000}k`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Toggles */}
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleLabel}>Women Entrepreneur</Text>
            <Text style={styles.toggleSub}>Stand-Up India / Women subsidy</Text>
          </View>
          <Switch value={isWoman} onValueChange={setIsWoman} trackColor={{ true: PRIMARY }} />
        </View>
        <View style={[styles.toggleRow, { marginTop: 12 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleLabel}>SC/ST Beneficiary</Text>
            <Text style={styles.toggleSub}>NBCFDC / Special credit benefits</Text>
          </View>
          <Switch value={isScSt} onValueChange={setIsScSt} trackColor={{ true: PRIMARY }} />
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleAnalyze} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>📊 Analyze Viability</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  container: { paddingBottom: 32 },
  header: {
    backgroundColor: PRIMARY, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 24,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#FEF3C7' },
  headerSub: { fontSize: 14, color: '#99F6E4', marginTop: 2 },
  card: {
    backgroundColor: '#fff', margin: 16, marginBottom: 0,
    borderRadius: 16, padding: 16,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: PRIMARY, marginBottom: 10 },
  presetRow: { gap: 8 },
  presetChip: {
    backgroundColor: '#F0FDFA', borderWidth: 1, borderColor: '#99F6E4',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  presetText: { fontSize: 13, color: PRIMARY, fontWeight: '600' },
  section: { marginHorizontal: 16, marginTop: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 15, color: '#1E293B',
  },
  suggestionBox: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 12, marginTop: 4, overflow: 'hidden',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
  },
  suggestionItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  suggestionName: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  suggestionSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  selectedVillage: {
    marginTop: 8, backgroundColor: '#DCFCE7', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  selectedVillageText: { fontSize: 13, color: '#166534', fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
  },
  chipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sliderValue: { fontSize: 18, fontWeight: '800', color: PRIMARY },
  sliderButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amtBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
  },
  amtBtnActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  amtBtnText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  amtBtnTextActive: { color: '#fff', fontWeight: '700' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  toggleSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  submitBtn: {
    backgroundColor: PRIMARY, margin: 16, marginTop: 20,
    borderRadius: 16, paddingVertical: 16, alignItems: 'center',
    elevation: 4, shadowColor: PRIMARY, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
