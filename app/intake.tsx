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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../src/presentation/store/app-store';
import { villageRepo, verdictEngine } from '../src/core/di';
import { Village } from '../src/domain/models/village';
import { AppConstants } from '../src/core/constants/app-constants';

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
      const search = await villageRepo.searchByName(villageQuery);
      if (!search.success || search.data.length === 0) {
        Alert.alert('Village not found', `No village matching "${villageQuery}" in census mock data.`);
        return;
      }
      if (search.data.length > 1) {
        setSuggestions(search.data);
        Alert.alert(
          'Confirm village',
          'Multiple villages matched. Pick the exact district/taluka from the list.'
        );
        return;
      }
      village = search.data[0];
      setVillage(village);
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
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.headerTitle}>New Assessment</Text>
      <Text style={styles.caption}>
        Village, sector, and scheme data come from the census / NABARD / Agmarknet mock datasets.
      </Text>

      <View style={styles.card}>
        <Text style={styles.presetTitle}>Quick Demo Presets</Text>
        <View style={styles.presetRow}>
          <TouchableOpacity
            style={styles.presetChip}
            onPress={() =>
              applyPreset({
                villageId: 'V001',
                villageName: 'Rampur',
                sector: 'Kirana Store',
                loanAmount: 60000,
                capital: 20000,
              })
            }
          >
            <Text style={styles.presetText}>Kirana (Saturated)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetChip}
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
            <Text style={styles.presetText}>Dairy (High Viability)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.presetChip}
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
            <Text style={styles.presetText}>Poultry (Over-borrow)</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>1. Village Name</Text>
        <TextInput
          style={styles.input}
          value={villageQuery}
          onChangeText={onSearchChanged}
          placeholder="e.g. Rampur, Nimgaon, Yeola..."
        />
        {isSearching ? <ActivityIndicator style={{ marginTop: 8 }} color="#0D6B6E" /> : null}

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
            Selected: {selectedVillage.name} ({selectedVillage.district})
          </Text>
        ) : null}

        <Text style={styles.label}>2. Business Sector</Text>
        <View style={styles.villageContainer}>
          {AppConstants.businessSectors.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.villageChip, sector === s && styles.villageChipActive]}
              onPress={() => setSector(s)}
            >
              <Text style={[styles.villageText, sector === s && styles.villageTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>3. Requested Loan (₹{loanAmount.toFixed(0)})</Text>
        <TextInput
          style={styles.input}
          value={String(loanAmount)}
          onChangeText={(text) => setLoanAmount(Number(text) || 0)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>4. Own Capital (₹{availableCapital.toFixed(0)})</Text>
        <TextInput
          style={styles.input}
          value={String(availableCapital)}
          onChangeText={(text) => setAvailableCapital(Number(text) || 0)}
          keyboardType="numeric"
        />

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>Women Entrepreneur</Text>
            <Text style={styles.switchSub}>Stand-Up India / women subsidy</Text>
          </View>
          <Switch value={isWoman} onValueChange={setIsWoman} trackColor={{ true: '#0D6B6E' }} />
        </View>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>SC/ST Beneficiary</Text>
            <Text style={styles.switchSub}>Special credit benefits</Text>
          </View>
          <Switch value={isScSt} onValueChange={setIsScSt} trackColor={{ true: '#0D6B6E' }} />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleAnalyze} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Analyze Viability</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/insights')}>
          <Text style={styles.linkBtnText}>View Mandi, Credit Plan & Schemes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F2EB',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D6B6E',
    marginBottom: 8,
  },
  caption: {
    fontSize: 13,
    color: '#5A5A72',
    marginBottom: 16,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  presetTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D6B6E',
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#E0F4F4',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  presetText: {
    fontSize: 12,
    color: '#0D6B6E',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0DDD6',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#0D6B6E',
    backgroundColor: '#F8FAFC',
  },
  villageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  villageChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F0EDE6',
    borderWidth: 1,
    borderColor: '#E0DDD6',
  },
  villageChipActive: {
    backgroundColor: '#0D6B6E',
    borderColor: '#0D6B6E',
  },
  villageText: {
    fontSize: 14,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  villageTextActive: {
    color: '#FFFFFF',
  },
  suggestionBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0DDD6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  suggestionRow: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE6',
  },
  suggestionActive: {
    backgroundColor: '#E0F4F4',
  },
  suggestionTitle: {
    fontWeight: '700',
    color: '#1A1A2E',
  },
  suggestionSub: {
    fontSize: 12,
    color: '#5A5A72',
    marginTop: 2,
  },
  selectedHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#0D6B6E',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  switchSub: {
    fontSize: 11,
    color: '#8A8A9E',
  },
  submitBtn: {
    backgroundColor: '#0D6B6E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkBtn: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkBtnText: {
    color: '#0D6B6E',
    fontWeight: '600',
  },
});
