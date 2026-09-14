import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,

  StatusBar,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../src/presentation/store/app-store';

const COLORS = {
  bg: '#FAF0E6',
  cardBg: '#FFFFFF',
  cardBorder: '#EAE1D2',
  textPrimary: '#2B231F',
  textSecondary: '#5A4E44',
  textMuted: '#8A7B6F',
  accent: '#BD5D38',
  teal: '#BD5D38',
  green: '#10B981',
  amber: '#D97706',
  red: '#EF4444',
};

const PIPELINE_STEPS = [
  'गांव आणि ८ किमी परिसराचा नकाशा तयार होत आहे...',
  'आर्थिक जनगणना डेटाबेसशी जुळवणी...',
  'स्पर्धा घनता आणि बाजारपेठ संपृक्तता गुणांकन...',
  'नाबार्ड, मुद्रा आणि पीएमईजीपी योजनांची तपासणी...',
  'मासिक नफा आणि सुरक्षित हप्ता मर्यादा गणित...',
  '१,००० परिस्थितींमध्ये महसूल आणि बाजारभाव ताण चाचणी...',
  'रस्ते आणि वीज पायाभूत सुविधा जोखीम तपासणी...',
  'अंतिम अधिकृत निष्कर्ष आणि ऑडिओ सल्ला तयार होत आहे...',
];

export default function ResultsScreen() {
  const router = useRouter();
  const { verdict } = useAppStore();

  const [activeTab, setActiveTab] = useState<'Overview' | 'Market' | 'Cashflow' | 'Scheme' | 'Risk'>('Overview');
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [showSources, setShowSources] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // ── 8-Stage Deterministic Pipeline Loading Animation ───────────────
  useEffect(() => {
    if (!isVerifying) return;
    const interval = setInterval(() => {
      setPipelineProgress((prev) => {
        if (prev >= PIPELINE_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsVerifying(false), 400);
          return prev;
        }
        return prev + 1;
      });
    }, 280);
    return () => clearInterval(interval);
  }, [isVerifying]);

  if (!verdict) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>No assessment data found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getVerdictColor = (v: string) => {
    if (v === 'Proceed') return COLORS.green;
    if (v === 'Adjust') return COLORS.amber;
    return COLORS.red;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Udyam Saarthi Viability Report: ${verdict.sector} in ${verdict.villageName} (${verdict.verdict.toUpperCase()}). Recommended Loan: ₹${verdict.affordability.recommendedLoanAmount}`,
      });
    } catch (_) {}
  };

  // Dynamic calculations from verdict.
  // No default values here: every one of these is a measured number from the
  // backend, and a placeholder would be indistinguishable from a real reading.
  const saturationPercent = Math.round(
    Math.min(100, Math.max(0, verdict.market.saturationScore * 100)) * 10
  ) / 10;

  // -1 means the backend genuinely did not measure a shop count for this
  // sector (procurement sectors are scored on capacity, not competitors).
  const competitorsMeasured = verdict.market.competitorCount >= 0;
  const competitorText = competitorsMeasured
    ? String(verdict.market.competitorCount)
    : 'not measured';

  const recommendedRatio = Math.min(
    100,
    Math.round(
      (verdict.affordability.recommendedLoanAmount /
        Math.max(1, verdict.affordability.requestedLoanAmount)) *
        100
    )
  );

  const stressPassRatePercent = Math.round(verdict.risk.stressTestPassRate * 100);

  const netInterestRate =
    verdict.scheme.interestRate - verdict.scheme.interestSubsidy > 0
      ? `${(verdict.scheme.interestRate - verdict.scheme.interestSubsidy).toFixed(1)}%`
      : `-${verdict.scheme.interestSubsidy.toFixed(1)}%`;

  // ── 1. PIPELINE VERIFICATION MODAL (Matching Image 3) ──────────────
  if (isVerifying) {
    return (
      <SafeAreaView style={styles.pipelineSafeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF0E6" />
        <View style={styles.pipelineContainer}>
          <Text style={styles.pipelineHeaderTitle}>• व्यवहार्यता तपासणी सुरू आहे...</Text>
          <Text style={styles.pipelineSub}>Deterministic 8-stage verification pipeline</Text>

          <View style={styles.pipelineCard}>
            {PIPELINE_STEPS.map((stepText, idx) => {
              const isDone = idx <= pipelineProgress;
              return (
                <View
                  key={idx}
                  style={[styles.pipelineRow, isDone && styles.pipelineRowActive]}
                >
                  <View style={styles.pipelineLeft}>
                    <Ionicons
                      name={
                        idx === 0
                          ? 'location'
                          : idx === 1
                          ? 'business'
                          : idx === 2
                          ? 'bar-chart'
                          : idx === 3
                          ? 'school'
                          : idx === 4
                          ? 'wallet'
                          : idx === 5
                          ? 'flash'
                          : idx === 6
                          ? 'construct'
                          : 'sparkles'
                      }
                      size={18}
                      color={isDone ? COLORS.teal : COLORS.textMuted}
                    />
                    <Text
                      style={[
                        styles.pipelineStepText,
                        isDone && styles.pipelineStepTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {stepText}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkCircle,
                      isDone && styles.checkCircleActive,
                    ]}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── 2. VIABILITY REPORT SCREEN (Matching All Screenshots Dynamically)
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#BD5D38" />

      {/* Top Navigation Bar */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.reportTitle}>Viability Report</Text>
          <Text style={styles.reportSub}>
            {verdict.sector} • {verdict.villageName}
          </Text>
        </View>

        <View style={styles.headerActionRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)')}>
            <Ionicons name="home-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs Header */}
      <View style={styles.tabsRow}>
        {(['Overview', 'Market', 'Cashflow', 'Scheme', 'Risk'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabChip, activeTab === t && styles.tabChipActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[styles.tabChipText, activeTab === t && styles.tabChipTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────── */}
        {activeTab === 'Overview' && (
          <View>
            <View style={[styles.verdictBannerCard, { borderTopColor: getVerdictColor(verdict.verdict) }]}>
              <View style={styles.bannerTopRow}>
                <View style={[styles.verdictBadge, { backgroundColor: getVerdictColor(verdict.verdict) + '1F' }]}>
                  <Ionicons name="checkmark-circle" size={18} color={getVerdictColor(verdict.verdict)} />
                  <Text style={[styles.verdictBadgeText, { color: getVerdictColor(verdict.verdict) }]}>
                    {verdict.verdict.toUpperCase()}
                  </Text>
                </View>

                <TouchableOpacity style={styles.listenBtn} activeOpacity={0.8}>
                  <Ionicons name="volume-high" size={16} color="#FFFFFF" />
                  <Text style={styles.listenBtnText}>Listen</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.bannerTitle}>
                {verdict.sector} • {verdict.villageName}
              </Text>
              <Text style={styles.bannerSub}>
                District: {verdict.district} • Loan Req: ₹{verdict.affordability.requestedLoanAmount.toLocaleString('en-IN')}
              </Text>
            </View>

            <Text style={styles.moduleHeaderTitle}>Assessment Summary Modules</Text>

            <View style={styles.summaryGrid}>
              <TouchableOpacity
                style={styles.moduleCard}
                onPress={() => setActiveTab('Market')}
              >
                <View style={styles.moduleIconRow}>
                  <Ionicons name="storefront-outline" size={20} color={COLORS.teal} />
                  <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
                </View>
                <Text style={styles.moduleMetricValue}>{saturationPercent}%</Text>
                <Text style={styles.moduleMetricLabel}>Market Density</Text>
                <Text style={styles.moduleMetricSub}>
                  {verdict.market.saturationLevel}
                  {competitorsMeasured ? ` (${verdict.market.competitorCount} comp.)` : ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.moduleCard}
                onPress={() => setActiveTab('Cashflow')}
              >
                <View style={styles.moduleIconRow}>
                  <Ionicons name="wallet-outline" size={20} color={COLORS.teal} />
                  <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
                </View>
                <Text style={styles.moduleMetricValue}>
                  ₹{(verdict.affordability.recommendedLoanAmount / 1000).toFixed(0)}k
                </Text>
                <Text style={styles.moduleMetricLabel}>Safe Borrowing</Text>
                <Text style={[styles.moduleMetricSub, { color: verdict.affordability.isAffordable ? COLORS.green : COLORS.amber }]}>
                  {verdict.affordability.isAffordable ? 'Affordable' : 'Adjust Loan'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.moduleCard}
                onPress={() => setActiveTab('Scheme')}
              >
                <View style={styles.moduleIconRow}>
                  <Ionicons name="school-outline" size={20} color={COLORS.teal} />
                  <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
                </View>
                <Text style={styles.moduleMetricValue}>{verdict.scheme.schemeShortName}</Text>
                <Text style={styles.moduleMetricLabel}>Matched Scheme</Text>
                <Text style={styles.moduleMetricSub}>₹{(verdict.scheme.capAmount / 100000).toFixed(1)}L max cap</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.moduleCard}
                onPress={() => setActiveTab('Risk')}
              >
                <View style={styles.moduleIconRow}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.teal} />
                  <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
                </View>
                <Text style={styles.moduleMetricValue}>
                  {stressPassRatePercent}%
                </Text>
                <Text style={styles.moduleMetricLabel}>Risk & Resilience</Text>
                <Text style={[styles.moduleMetricSub, { color: stressPassRatePercent >= 80 ? COLORS.green : COLORS.amber }]}>
                  {stressPassRatePercent >= 80 ? 'Stress Passed' : 'Risk Warning'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Checklist */}
            <View style={styles.checklistCard}>
              <View style={styles.checklistHeaderRow}>
                <Ionicons name="checkbox-outline" size={18} color={COLORS.teal} />
                <Text style={styles.checklistTitle}>Actionable Next Steps & Documents</Text>
              </View>
              <Text style={styles.checklistSub}>
                Key checklist to approach your local branch or DIC coordinator:
              </Text>

              <View style={styles.checkItemRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.green} />
                <Text style={styles.checkItemText}>Aadhaar Card & PAN Card</Text>
              </View>
              <View style={styles.checkItemRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.green} />
                <Text style={styles.checkItemText}>Land Records / Rent Deed</Text>
              </View>
              <View style={styles.checkItemRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.green} />
                <Text style={styles.checkItemText}>Bank Account Statement (6 Months)</Text>
              </View>
              <View style={styles.checkItemRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.green} />
                <Text style={styles.checkItemText}>Brief Detailed Project Report (DPR)</Text>
              </View>

              <View style={styles.recommendedNodeBox}>
                <Ionicons name="business" size={16} color={COLORS.accent} />
                <Text style={styles.recommendedNodeText}>
                  Recommended Node: District Industries Centre (DIC) or Lead Bank Branch
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── TAB 2: MARKET (Dynamic Data from verdict.market) ──────────── */}
        {activeTab === 'Market' && (
          <View>
            <View style={styles.tabSectionHeader}>
              <View style={styles.tabIconBox}>
                <Ionicons name="storefront" size={20} color={COLORS.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tabSectionTitle}>Local Market Density (8km Radius)</Text>
                <Text style={styles.tabSectionSub}>Catchment competitor saturation audit</Text>
              </View>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.textMuted} />
            </View>

            {/* 2 Dynamic Metric Cards */}
            <View style={styles.sideBySideRow}>
              <View style={styles.sideCard}>
                <Text style={styles.sideCardLabel}>Active Competitors</Text>
                <Text
                  style={[styles.sideCardMetric, !competitorsMeasured && styles.metricUnmeasured]}
                >
                  {competitorText}
                </Text>
                <Text style={styles.sideCardSub}>Within 8km catchment</Text>
              </View>

              <View style={styles.sideCard}>
                <Text style={styles.sideCardLabel}>Saturation Status</Text>
                <Text style={[styles.sideCardMetric, { color: verdict.market.saturationLevel === 'Saturated' ? COLORS.red : verdict.market.saturationLevel === 'High' ? COLORS.amber : COLORS.green }]}>
                  {verdict.market.saturationLevel}
                </Text>
                <Text style={styles.sideCardSub}>{saturationPercent}% index</Text>
              </View>
            </View>

            {/* Dynamic Saturation Gauge Card */}
            <View style={styles.detailCard}>
              <View style={styles.gaugeHeader}>
                <Text style={styles.gaugeTitle}>Market Saturation Gauge</Text>
                <Text style={[styles.gaugeValue, { color: verdict.market.saturationLevel === 'Saturated' ? COLORS.red : verdict.market.saturationLevel === 'High' ? COLORS.amber : COLORS.green }]}>
                  {saturationPercent}%
                </Text>
              </View>

              <View style={styles.gaugeTrack}>
                <View style={[styles.gaugeFill, { width: `${saturationPercent}%`, backgroundColor: verdict.market.saturationLevel === 'Saturated' ? COLORS.red : verdict.market.saturationLevel === 'High' ? COLORS.amber : COLORS.green }]} />
              </View>

              <View style={styles.gaugeTicksRow}>
                <Text style={styles.gaugeTickText}>Low (&lt; 25%)</Text>
                <Text style={styles.gaugeTickText}>Medium (25-50%)</Text>
                <Text style={styles.gaugeTickText}>Saturated (&gt; 75%)</Text>
              </View>
            </View>

            {/* Dynamic Consumer Profile Card */}
            <View style={styles.detailCard}>
              <Text style={styles.cardHeaderTitle}>Catchment Consumer Profile</Text>

              <View style={styles.profileDataRow}>
                <Text style={styles.profileDataLabel}>Catchment Population (8km):</Text>
                <Text style={styles.profileDataValue}>
                  {verdict.market.populationInRadius.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.dividerLight} />

              <View style={styles.profileDataRow}>
                <Text style={styles.profileDataLabel}>Evaluated Sector:</Text>
                <Text style={styles.profileDataValue}>{verdict.sector}</Text>
              </View>
              <View style={styles.dividerLight} />

              <View style={styles.profileDataRow}>
                <Text style={styles.profileDataLabel}>Takeaway:</Text>
                <Text style={[styles.profileDataValue, { color: verdict.market.saturationLevel === 'Saturated' ? COLORS.red : COLORS.green }]}>
                  {verdict.market.saturationLevel === 'Saturated'
                    ? 'High competitor density. Consider alternative sectors.'
                    : verdict.market.saturationLevel === 'High'
                    ? 'Moderate competition. Differentiation required.'
                    : 'Healthy expansion capacity.'}
                </Text>
              </View>
            </View>

            <View style={styles.sourceFootnoteRow}>
              <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.teal} />
              <Text style={styles.sourceFootnoteText}>
                Source: Sixth Economic Census (MoSPI) & Census of India Village Directory
              </Text>
            </View>
          </View>
        )}

        {/* ── TAB 3: CASHFLOW (Dynamic Data from verdict.affordability) ─── */}
        {activeTab === 'Cashflow' && (
          <View>
            <View style={styles.tabSectionHeader}>
              <View style={styles.tabIconBox}>
                <Ionicons name="cash" size={20} color={COLORS.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tabSectionTitle}>Cashflow & Loan Sizing Analysis</Text>
                <Text style={styles.tabSectionSub}>Unit economics & safe borrowing limits</Text>
              </View>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.textMuted} />
            </View>

            {/* 2 Dynamic Metric Cards */}
            <View style={styles.sideBySideRow}>
              <View style={styles.sideCard}>
                <Text style={styles.sideCardLabel}>Monthly Surplus</Text>
                <Text style={styles.sideCardMetric}>
                  ₹{verdict.affordability.monthlySurplusEstimate.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.sideCardSub}>Net business profit</Text>
              </View>

              <View style={styles.sideCard}>
                <Text style={styles.sideCardLabel}>Safe EMI Capacity</Text>
                <Text style={[styles.sideCardMetric, { color: COLORS.accent }]}>
                  ₹{verdict.affordability.maxSafeMonthlyEMI.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.sideCardSub}>With 1.3x buffer</Text>
              </View>
            </View>

            {/* Dynamic Loan Comparison Card */}
            <View style={styles.detailCard}>
              <View style={styles.gaugeHeader}>
                <Text style={styles.gaugeTitle}>Loan Comparison: Requested vs Safe Limit</Text>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>Safe Loan Sizing</Text>
                </View>
              </View>

              <View style={styles.barCompareRow}>
                <Text style={styles.barCompareLabel}>Requested:</Text>
                <View style={styles.barCompareTrack}>
                  <View style={[styles.barCompareFill, { width: '100%', backgroundColor: COLORS.teal }]} />
                </View>
                <Text style={styles.barCompareValue}>
                  ₹{verdict.affordability.requestedLoanAmount.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.barCompareRow}>
                <Text style={styles.barCompareLabel}>Recommended:</Text>
                <View style={styles.barCompareTrack}>
                  <View style={[styles.barCompareFill, { width: `${recommendedRatio}%`, backgroundColor: COLORS.green }]} />
                </View>
                <Text style={styles.barCompareValue}>
                  ₹{verdict.affordability.recommendedLoanAmount.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            {/* Dynamic Repayment Details Card */}
            <View style={styles.detailCard}>
              <View style={styles.cardHeaderWithInfo}>
                <Text style={styles.cardHeaderTitle}>Monthly Repayment Details</Text>
                <Ionicons name="information-circle-outline" size={18} color={COLORS.textMuted} />
              </View>

              <View style={styles.profileDataRow}>
                <Text style={styles.profileDataLabel}>Estimated Monthly EMI:</Text>
                <Text style={styles.profileDataValue}>
                  ₹{verdict.affordability.monthlyEMI.toLocaleString('en-IN')} / month
                </Text>
              </View>
              <View style={styles.dividerLight} />

              <View style={styles.profileDataRow}>
                <Text style={styles.profileDataLabel}>Maximum Safe EMI Threshold:</Text>
                <Text style={styles.profileDataValue}>
                  ₹{verdict.affordability.maxSafeMonthlyEMI.toLocaleString('en-IN')} / month
                </Text>
              </View>
              <View style={styles.dividerLight} />

              <View style={styles.profileDataRow}>
                <Text style={styles.profileDataLabel}>Borrower Own Equity:</Text>
                <Text style={styles.profileDataValue}>
                  ₹{verdict.availableCapital.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.dividerLight} />

              <View style={styles.profileDataRow}>
                <Text style={styles.profileDataLabel}>Financial Guidance:</Text>
                <Text style={[styles.profileDataValue, { color: verdict.affordability.isAffordable ? COLORS.teal : COLORS.amber, flex: 1, textAlign: 'right' }]}>
                  {verdict.affordability.isAffordable
                    ? 'Cashflow safely covers loan debt service.'
                    : 'Monthly EMI exceeds safe surplus threshold. Reduce loan amount or increase equity.'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── TAB 4: SCHEME (Dynamic Data from verdict.scheme) ─────────── */}
        {activeTab === 'Scheme' && (
          <View>
            <View style={styles.tabSectionHeader}>
              <View style={styles.tabIconBox}>
                <Ionicons name="school" size={20} color={COLORS.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tabSectionTitle}>Matched Government Scheme & Subsidy</Text>
                <Text style={styles.tabSectionSub}>Scheme terms, subsidy rate & portal routing</Text>
              </View>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.textMuted} />
            </View>

            {/* Dynamic Scheme Details Card */}
            <View style={styles.detailCard}>
              <View style={styles.schemeCardHeader}>
                <View style={styles.schemeIconWrap}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.teal} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.schemeNameTitle}>{verdict.scheme.schemeName}</Text>
                  <Text style={styles.schemeShortCode}>{verdict.scheme.schemeShortName}</Text>
                </View>
              </View>

              <Text style={styles.schemeDescText}>{verdict.scheme.description}</Text>

              <View style={styles.schemeMetricsRow}>
                <View style={styles.schemePillCard}>
                  <Text style={styles.schemePillLabel}>Maximum Cap</Text>
                  <Text style={styles.schemePillValue}>
                    ₹{(verdict.scheme.capAmount / 100000).toFixed(1)}L
                  </Text>
                </View>

                <View style={styles.schemePillCard}>
                  <Text style={styles.schemePillLabel}>Tenure</Text>
                  <Text style={styles.schemePillValue}>{verdict.scheme.tenureYears} Yrs</Text>
                </View>

                <View style={styles.schemePillCard}>
                  <Text style={styles.schemePillLabel}>Net Interest</Text>
                  <Text style={styles.schemePillValue}>{netInterestRate}</Text>
                </View>
              </View>
            </View>

            {/* Dynamic Eligibility & Procedure Card */}
            <View style={styles.detailCard}>
              <Text style={styles.cardHeaderTitle}>Eligibility & Application Procedure</Text>

              <View style={styles.checkItemRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.teal} />
                <Text style={styles.checkItemText}>Age Criterion: Minimum 18 years, rural focus</Text>
              </View>

              <View style={styles.checkItemRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.teal} />
                <Text style={styles.checkItemText}>Higher subsidy slabs for Women & SC/ST applicants</Text>
              </View>

              <View style={styles.checkItemRow}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.teal} />
                <Text style={styles.checkItemText}>
                  Disbursed through Scheduled Commercial & Regional Rural Banks
                </Text>
              </View>

              <View style={styles.nodeBoxLight}>
                <Text style={styles.nodeBoxLabel}>Official Registration Node:</Text>
                <Text style={styles.nodeBoxLink}>
                  KVIC Online Portal / Udyami Mitra Portal (www.kviconline.gov.in)
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── TAB 5: RISK (Dynamic Data from verdict.risk) ─────────────── */}
        {activeTab === 'Risk' && (
          <View>
            <View style={styles.tabSectionHeader}>
              <View style={styles.tabIconBox}>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.teal} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tabSectionTitle}>Operational Risk & Stress Simulation</Text>
                <Text style={styles.tabSectionSub}>100 price/demand shock scenarios</Text>
              </View>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.textMuted} />
            </View>

            {/* Dynamic Stress Test Pass Rate Card */}
            <View style={styles.detailCard}>
              <View style={styles.gaugeHeader}>
                <Text style={styles.gaugeTitle}>1,000-Scenario Stress Test Pass Rate:</Text>
                <Text style={[styles.gaugeValue, { color: stressPassRatePercent >= 80 ? COLORS.teal : COLORS.amber, fontSize: 20 }]}>
                  {stressPassRatePercent}%
                </Text>
              </View>

              <View style={styles.gaugeTrack}>
                <View
                  style={[
                    styles.gaugeFill,
                    {
                      width: `${stressPassRatePercent}%`,
                      backgroundColor: stressPassRatePercent >= 80 ? COLORS.green : COLORS.amber,
                    },
                  ]}
                />
              </View>

              <Text style={styles.stressSubText}>
                {stressPassRatePercent >= 80
                  ? 'Robust viability: Cashflows absorb up to 20% price drops and cost inflation.'
                  : 'Revenue sensitivity detected: Cashflows show moderate vulnerability under extreme price shocks.'}
              </Text>
            </View>

            {/* Dynamic Village Infrastructure Risk Audit Card */}
            <View style={styles.detailCard}>
              <Text style={styles.cardHeaderTitle}>Village Infrastructure Risk Audit</Text>

              <View style={styles.checkItemRow}>
                <Ionicons
                  name={verdict.risk.infraGaps.length === 0 ? 'checkmark-circle' : 'alert-circle'}
                  size={18}
                  color={verdict.risk.infraGaps.length === 0 ? COLORS.teal : COLORS.amber}
                />
                <Text style={styles.checkItemText}>
                  {verdict.risk.infraGaps.length === 0
                    ? 'No critical road or electrical power deficits detected.'
                    : verdict.risk.infraGaps.join(' • ')}
                </Text>
              </View>
            </View>

            <View style={styles.sourceFootnoteRow}>
              <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.teal} />
              <Text style={styles.sourceFootnoteText}>
                Infrastructure flags come from the Village Directory (Census 2011, via SHRUG);
                the stress test is a Monte Carlo run on this village's own cashflow.
              </Text>
            </View>
          </View>
        )}

        {/* ── PROVENANCE (PERMANENT) ─────────────────────────────────── */}
        <TouchableOpacity
          style={styles.auditCard}
          activeOpacity={0.85}
          onPress={() => setShowSources((v) => !v)}
        >
          <Ionicons name="information-circle-outline" size={20} color={COLORS.teal} />
          <View style={{ flex: 1 }}>
            <Text style={styles.auditTitle}>Where these numbers come from</Text>
            <Text style={styles.auditSub}>
              {verdict.sourcesUsed.length} source
              {verdict.sourcesUsed.length === 1 ? '' : 's'} cited
              {showSources ? '' : ' · tap to read'}
            </Text>
          </View>
          <Ionicons
            name={showSources ? 'chevron-down' : 'chevron-forward'}
            size={16}
            color={COLORS.textMuted}
          />
        </TouchableOpacity>

        {showSources ? (
          <View style={styles.sourceListCard}>
            {verdict.sourcesUsed.length === 0 ? (
              <Text style={styles.sourceListItem}>
                This assessment carried no source list — treat it as unverified.
              </Text>
            ) : (
              verdict.sourcesUsed.map((src, i) => (
                <View key={i} style={styles.sourceListRow}>
                  <Text style={styles.sourceBullet}>•</Text>
                  <Text style={styles.sourceListItem}>{src}</Text>
                </View>
              ))
            )}
            {verdict.runId ? (
              <Text style={styles.runIdText}>
                Run ID {verdict.runId} — quote this to reproduce the exact same result.
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.bottomActionRow}>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={18} color={COLORS.teal} />
            <Text style={styles.shareBtnText}>Share Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.newAssessBtn} onPress={() => router.replace('/intake')}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
            <Text style={styles.newAssessBtnText}>New Assessment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    padding: 24,
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // 8-Stage Pipeline Loading Modal
  pipelineSafeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  pipelineContainer: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 12) + 20 : 20,
  },
  pipelineHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.teal,
    marginBottom: 4,
  },
  pipelineSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 20,
  },
  pipelineCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    gap: 10,
  },
  pipelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F4EE',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE1D2',
    opacity: 0.5,
  },
  pipelineRowActive: {
    opacity: 1,
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.teal,
  },
  pipelineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  pipelineStepText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  pipelineStepTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EAE1D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleActive: {
    backgroundColor: COLORS.green,
  },

  // Viability Report Header
  topHeader: {
    backgroundColor: '#BD5D38',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 12) + 8 : 14,
  },
  reportTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  reportSub: {
    color: '#E0F2FE',
    fontSize: 12,
    marginTop: 2,
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    padding: 6,
  },

  // Filter Tabs
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    justifyContent: 'space-around',
  },
  tabChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tabChipActive: {
    backgroundColor: '#F3E8DA',
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabChipTextActive: {
    color: COLORS.teal,
    fontWeight: '800',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Verdict Banner Card (Overview)
  verdictBannerCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderTopWidth: 6,
    marginBottom: 20,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  verdictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  verdictBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.teal,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  listenBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  bannerSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  // Summary Modules
  moduleHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  moduleIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleMetricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  moduleMetricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  moduleMetricSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },

  // Tab Section Headers
  tabSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  tabIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tabSectionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Side-by-side Metric Cards
  sideBySideRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sideCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  sideCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  sideCardMetric: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginVertical: 4,
  },
  sideCardSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  // Detail Cards
  detailCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  cardHeaderWithInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  // Gauge
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gaugeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  gaugeValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  gaugeTrack: {
    height: 10,
    backgroundColor: '#EAE1D2',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 5,
  },
  gaugeTicksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  gaugeTickText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },

  // Profile Rows
  profileDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  profileDataLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  profileDataValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  dividerLight: {
    height: 1,
    backgroundColor: '#F3E8DA',
    marginVertical: 6,
  },

  sourceFootnoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 16,
  },
  sourceFootnoteText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },

  // Cashflow Compare Bars
  tagBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.teal,
  },
  barCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 6,
  },
  barCompareLabel: {
    width: 100,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  barCompareTrack: {
    flex: 1,
    height: 14,
    backgroundColor: '#EAE1D2',
    borderRadius: 7,
    overflow: 'hidden',
  },
  barCompareFill: {
    height: '100%',
    borderRadius: 7,
  },
  barCompareValue: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textPrimary,
    minWidth: 70,
    textAlign: 'right',
  },

  // Scheme Tab Styles
  schemeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  schemeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceListCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 14,
  },
  sourceListRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  sourceBullet: {
    color: COLORS.accent,
    fontWeight: '800',
  },
  sourceListItem: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  runIdText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
    fontStyle: 'italic',
  },
  metricUnmeasured: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  schemeNameTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  schemeShortCode: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
    marginTop: 2,
  },
  schemeDescText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  schemeMetricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  schemePillCard: {
    flex: 1,
    backgroundColor: '#F8F4EE',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE1D2',
  },
  schemePillLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  schemePillValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 2,
  },

  nodeBoxLight: {
    backgroundColor: '#F3E8DA',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  nodeBoxLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  nodeBoxLink: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.teal,
    marginTop: 2,
  },

  stressSubText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },

  // Documents Checklist Card
  checklistCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
  },
  checklistHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  checklistSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 14,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  checkItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  recommendedNodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDF2E9',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FAD7C0',
  },
  recommendedNodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accent,
    flex: 1,
  },

  // Audit Card
  auditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginBottom: 24,
  },
  auditTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  auditSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Bottom Buttons
  bottomActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1.5,
    borderColor: COLORS.teal,
    paddingVertical: 14,
    borderRadius: 16,
  },
  shareBtnText: {
    color: COLORS.teal,
    fontSize: 14,
    fontWeight: '800',
  },
  newAssessBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.teal,
    paddingVertical: 14,
    borderRadius: 16,
  },
  newAssessBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
