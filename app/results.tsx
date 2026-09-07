import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../src/presentation/store/app-store';

export default function ResultsScreen() {
  const router = useRouter();
  const { verdict } = useAppStore();

  if (!verdict) {
    return (
      <View style={styles.center}>
        <Text>No assessment data found.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getVerdictColor = (v: string) => {
    if (v === 'Proceed') return '#10B981'; // Green
    if (v === 'Adjust') return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Assessment Verdict</Text>
      
      <View style={[styles.card, { borderTopWidth: 6, borderTopColor: getVerdictColor(verdict.verdict) }]}>
        <Text style={[styles.verdictText, { color: getVerdictColor(verdict.verdict) }]}>
          {verdict.verdict.toUpperCase()}
        </Text>
        <Text style={styles.subtitle}>{verdict.sector} in {verdict.villageName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Market Saturation</Text>
        <Text style={styles.text}>Level: {verdict.market.saturationLevel}</Text>
        <Text style={styles.text}>Competitors: {verdict.market.competitorCount}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>2. Affordability</Text>
        <Text style={styles.text}>Recommended Loan: ₹{verdict.affordability.recommendedLoanAmount}</Text>
        <Text style={styles.text}>Safe EMI: ₹{verdict.affordability.maxSafeMonthlyEMI}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>3. Scheme Match</Text>
        <Text style={styles.text}>Scheme: {verdict.scheme.schemeName}</Text>
        <Text style={styles.text}>Subsidy: {verdict.scheme.interestSubsidy}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>4. Risk Assessment</Text>
        <Text style={styles.text}>Stress Test Pass Rate: {(verdict.risk.stressTestPassRate * 100).toFixed(0)}%</Text>
        {verdict.risk.infraGaps.map((gap, idx) => (
          <Text key={idx} style={styles.textGap}>• {gap}</Text>
        ))}
      </View>

      {verdict.alternativeSectors.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>NABARD Alternative Sectors</Text>
          <Text style={styles.text}>{verdict.alternativeSectors.join(' · ')}</Text>
        </View>
      ) : null}

      {verdict.sourcesUsed.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data Sources</Text>
          {verdict.sourcesUsed.map((src) => (
            <Text key={src} style={styles.text}>• {src}</Text>
          ))}
        </View>
      ) : null}

      <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
        <Text style={styles.btnText}>Start New Assessment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#CCFBF1',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CCFBF1',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F766E',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  verdictText: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 6,
  },
  textGap: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
    fontStyle: 'italic',
  },
  btn: {
    backgroundColor: '#F59E0B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
