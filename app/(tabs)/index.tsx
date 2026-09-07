import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import VoiceSphere from '../../src/presentation/components/VoiceSphere';

const { width: SCREEN_W } = Dimensions.get('window');
const SPHERE_SIZE = Math.min(SCREEN_W * 0.85, 340);

// ── Fainted Orange Light Theme Color Tokens ─────────────
const COLORS = {
  bg: '#FAF0E6',                 // Fainted orange background
  bgCard: '#FFFFFF',             // White card containers
  bgCardBorder: '#EAE1D2',       // Warm card borders
  textPrimary: '#2B231F',        // Dark warm primary text
  textSecondary: '#5A4E44',      // Medium warm secondary text
  textMuted: '#8A7B6F',          // Subtle muted text
  accent: '#BD5D38',             // Terra cotta primary accent
  accentLight: '#D97757',
  accentGlow: 'rgba(189,93,56,0.18)',
  green: '#10B981',
  amber: '#D97706',
  pink: '#DB2777',
  blue: '#2563EB',
};

// ── Quick Action Cards ──────────────────────────────────
const FEATURES = [
  {
    icon: 'analytics-outline' as const,
    label: 'Analyze',
    desc: 'Business viability',
    color: '#BD5D38',
    route: '/intake',
  },
  {
    icon: 'document-text-outline' as const,
    label: 'Insights',
    desc: 'Market reports',
    color: '#10B981',
    route: '/(tabs)/insights',
  },
  {
    icon: 'time-outline' as const,
    label: 'History',
    desc: 'Past queries',
    color: '#D97706',
    route: '/(tabs)/history',
  },
  {
    icon: 'settings-outline' as const,
    label: 'Settings',
    desc: 'Preferences',
    color: '#2563EB',
    route: '/(tabs)/settings',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const toggleListening = useCallback(() => {
    setIsListening((prev) => !prev);
  }, []);

  const navigateToVoice = useCallback(() => {
    router.push('/ai-voice');
  }, [router]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>{greeting} 👋</Text>
            <Text style={styles.headerTitle}>उद्यम सारथी</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Ionicons name="person-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ── Voice Sphere Hero ──────────────────────── */}
        <View style={styles.sphereSection}>
          <VoiceSphere size={SPHERE_SIZE} />

          {/* Status indicator */}
          <View style={styles.statusPill}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isListening ? COLORS.green : COLORS.accent },
              ]}
            />
            <Text style={styles.statusText}>
              {isListening ? 'Listening...' : 'Tap mic to start'}
            </Text>
          </View>
        </View>

        {/* ── Assistant Badge ────────────────────────── */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="heart" size={14} color={COLORS.accent} />
            <Text style={styles.badgeText}>Udyam Saarthi Assistant</Text>
          </View>
        </View>

        {/* ── Voice CTA ──────────────────────────────── */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Business Guidance</Text>
          <Text style={styles.ctaSubtitle}>
            Ask anything about business viability, schemes, and market insights in your language.
          </Text>

          {/* Language support pill */}
          <View style={styles.langPill}>
            <Text style={styles.langText}>
              <Text style={{ color: COLORS.green }}>●</Text> हिंदी{'  '}•{'  '}English{'  '}•{'  '}मराठी
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            {/* Primary mic button */}
            <TouchableOpacity
              style={[
                styles.micButton,
                isListening && styles.micButtonActive,
              ]}
              activeOpacity={0.85}
              onPress={toggleListening}
            >
              <View style={[styles.micInner, isListening && styles.micInnerActive]}>
                <Ionicons
                  name={isListening ? 'stop' : 'mic'}
                  size={26}
                  color="#FFFFFF"
                />
              </View>
            </TouchableOpacity>

            {/* Full voice chat button */}
            <TouchableOpacity
              style={styles.voiceChatBtn}
              activeOpacity={0.8}
              onPress={navigateToVoice}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.accent} />
              <Text style={styles.voiceChatText}>Voice Chat</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Quick Access Cards ─────────────────────── */}
        <View style={styles.cardsSection}>
          <Text style={styles.cardsSectionTitle}>Quick Access</Text>
          <View style={styles.cardsGrid}>
            {FEATURES.map((f) => (
              <TouchableOpacity
                key={f.label}
                style={styles.featureCard}
                activeOpacity={0.75}
                onPress={() => router.push(f.route as any)}
              >
                <View style={[styles.featureIconWrap, { backgroundColor: f.color + '15' }]}>
                  <Ionicons name={f.icon} size={22} color={f.color} />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles (Light Fainted Orange Theme) ─────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 44) + 8 : 56,
    paddingBottom: 8,
  },
  greetingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    shadowColor: '#4A3B2C',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Sphere
  sphereSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2E4D6',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6D4C2',
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  // Badge
  badgeRow: {
    alignItems: 'center',
    marginTop: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    gap: 6,
    shadowColor: '#4A3B2C',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  badgeText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '700',
  },

  // CTA
  ctaSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 18,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  langPill: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.bgCardBorder,
    marginBottom: 20,
  },
  langText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  micButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(189,93,56,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  micButtonActive: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderColor: COLORS.green,
  },
  micInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  micInnerActive: {
    backgroundColor: COLORS.green,
  },
  voiceChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: COLORS.bgCardBorder,
    gap: 10,
    shadowColor: '#4A3B2C',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  voiceChatText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },

  // Feature Cards
  cardsSection: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  cardsSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: (SCREEN_W - 60) / 2,
    backgroundColor: COLORS.bgCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.bgCardBorder,
    shadowColor: '#4A3B2C',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  featureIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
