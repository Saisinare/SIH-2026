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
import { schemeRepo, marketDataRepo, creditPlanRepo } from '../src/core/di';
import { SchemeRule } from '../src/domain/models/scheme-rule';
import { CommodityPrices } from '../src/domain/models/commodity-prices';
import { DistrictCreditPlan } from '../src/domain/models/credit-plan';

const DISTRICTS = ['Satvara', 'Nandgiri', 'Jalnagar', 'Khetpur'];

export default function InsightsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'mandi' | 'credit' | 'schemes'>('mandi');
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<CommodityPrices[]>([]);
  const [schemes, setSchemes] = useState<SchemeRule[]>([]);
  const [district, setDistrict] = useState('Satvara');
  const [plan, setPlan] = useState<DistrictCreditPlan | null>(null);
  const [schemeQuery, setSchemeQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [priceRes, schemeRes, planRes] = await Promise.all([
        marketDataRepo.loadPrices(),
        schemeRepo.loadAll(),
        creditPlanRepo.getForDistrict(district),
      ]);
      if (cancelled) return;
      if (priceRes.success) setPrices(priceRes.data);
      if (schemeRes.success) setSchemes(schemeRes.data);
      if (planRes.success) setPlan(planRes.data);
      else setPlan(null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [district]);

  const filteredSchemes = schemes.filter((s) => {
    const q = schemeQuery.toLowerCase();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.shortName.toLowerCase().includes(q) ||
      s.eligibleSectors.some((sec) => sec.toLowerCase().includes(q))
    );
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Market & Credit Insights</Text>
      <Text style={styles.caption}>
        Live from mock Agmarknet prices, NABARD district credit plans, and scheme rules.
      </Text>

      <View style={styles.tabs}>
        {(['mandi', 'credit', 'schemes'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'mandi' ? 'Mandi Prices' : t === 'credit' ? 'Credit Plan' : 'Schemes'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <ActivityIndicator color="#0D6B6E" style={{ marginTop: 24 }} /> : null}

      {!loading && tab === 'mandi'
        ? prices.map((p) => {
            const vals = p.monthlyPrices.map((m) => m.price);
            const latest = vals[vals.length - 1] ?? 0;
            const min = Math.min(...vals);
            const max = Math.max(...vals);
            return (
              <View key={p.name} style={styles.card}>
                <Text style={styles.cardTitle}>{p.name}</Text>
                <Text style={styles.muted}>per {p.unit}</Text>
                <Text style={styles.price}>₹{latest}</Text>
                <Text style={styles.muted}>
                  12-mo min ₹{min} · max ₹{max} · spread ₹{(max - min).toFixed(0)}
                </Text>
              </View>
            );
          })
        : null}

      {!loading && tab === 'credit' ? (
        <>
          <View style={styles.districtRow}>
            {DISTRICTS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.villageChip, district === d && styles.villageChipActive]}
                onPress={() => setDistrict(d)}
              >
                <Text style={[styles.villageText, district === d && { color: '#fff' }]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {plan?.sectorPotential.map((s) => (
            <View key={s.sector} style={styles.card}>
              <Text style={styles.cardTitle}>{s.sector}</Text>
              <Text style={styles.muted}>NABARD target: ₹{s.creditPotentialLakhs}L</Text>
              <Text style={styles.rating}>{s.growthRating} growth</Text>
            </View>
          ))}
        </>
      ) : null}

      {!loading && tab === 'schemes' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Search schemes or sectors..."
            value={schemeQuery}
            onChangeText={setSchemeQuery}
          />
          {filteredSchemes.map((s) => (
            <View key={s.id} style={styles.card}>
              <Text style={styles.cardTitle}>{s.name}</Text>
              <Text style={styles.shortName}>{s.shortName}</Text>
              <Text style={styles.muted}>{s.description}</Text>
              <Text style={styles.muted}>
                Cap ₹{(s.maxLoanAmount / 100000).toFixed(1)}L · {s.tenureYears} yrs · {s.interestRatePercent}%
              </Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F2EB',
    padding: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  back: {
    color: '#0D6B6E',
    fontWeight: '600',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D6B6E',
  },
  caption: {
    fontSize: 13,
    color: '#5A5A72',
    marginTop: 6,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  tabActive: {
    backgroundColor: '#0D6B6E',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5A72',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  muted: {
    fontSize: 12,
    color: '#5A5A72',
    marginTop: 4,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D6B6E',
    marginTop: 8,
  },
  rating: {
    marginTop: 6,
    fontWeight: '700',
    color: '#E8913A',
  },
  shortName: {
    color: '#0D6B6E',
    fontWeight: '600',
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0DDD6',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  districtRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  villageChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  villageChipActive: {
    backgroundColor: '#0D6B6E',
  },
  villageText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },
});
