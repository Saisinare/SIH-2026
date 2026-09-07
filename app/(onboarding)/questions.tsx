import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import VoiceSphere from '../../src/presentation/components/VoiceSphere';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPHERE_SIZE = Math.min(SCREEN_WIDTH * 0.75, 260);

// Multilingual action titles ("What are we doing") — Natural human phrasing
const MULTILINGUAL_TITLES = [
  { lang: 'English', text: 'Business Guidance & Planning' },
  { lang: 'हिंदी',   text: 'व्यवसाय मार्गदर्शन एवं योजना' },
  { lang: 'मराठी',   text: 'व्यवसाय मार्गदर्शन व नियोजन' },
  { lang: 'தமிழ்',  text: 'வணிக வழிகாட்டுதல் மற்றும் திட்டம்' },
];

// Simulated natural voice lines spoken by Saarthi
const VOICE_LINES = [
  "Hello! What business idea or question do you have today?",
  "नमस्ते! आज आपके मन में व्यवसाय का क्या विचार है?",
  "नमस्कार! आज तुमच्या मनात व्यवसायाची कोणती कल्पना आहे?",
  "Tell me about your available capital or location.",
  "कृपया मुझे अपने बजट और जगह के बारे में बताएं।",
  "I am analyzing market demand in your area...",
];

export default function QuestionsScreen() {
  const router = useRouter();

  // ── Multilingual Header Title Animation ─────────────────────────────────────
  const [titleIndex, setTitleIndex] = useState(0);
  const titleOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(titleOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setTitleIndex((prev) => (prev + 1) % MULTILINGUAL_TITLES.length);
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ── Voice Line Cycling Animation ─────────────────────────────────────────────
  const [speechIndex, setSpeechIndex] = useState(0);
  const speechOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(speechOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setSpeechIndex((prev) => (prev + 1) % VOICE_LINES.length);
        Animated.timing(speechOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ── Mic Toggle State ────────────────────────────────────────────────────────
  const [isMicActive, setIsMicActive] = useState(false);

  const handleGoToDashboard = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF0E6" />

      <View style={styles.container}>

        {/* ── 1. TOP HEADER WITH BACK BUTTON & MULTILINGUAL TITLE ───────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => router.back()}
            accessibilityLabel="Back"
          >
            <Ionicons name="arrow-back" size={22} color="#2B231F" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.doingLabel}>WHAT WE ARE DOING</Text>
            <Animated.Text style={[styles.headerTitle, { opacity: titleOpacity }]}>
              {MULTILINGUAL_TITLES[titleIndex].text}
            </Animated.Text>
          </View>

          <TouchableOpacity
            style={styles.skipButton}
            activeOpacity={0.7}
            onPress={handleGoToDashboard}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ── 2. AI SPHERE ───────────────────────────────────────────────── */}
          <View style={styles.sphereContainer}>
            <VoiceSphere size={SPHERE_SIZE} />
          </View>

          {/* ── 3. SUBTITLE JUST BELOW THE SPHERE (NATURAL HUMAN STATUS) ───── */}
          <View style={styles.subtitleBadge}>
            <View style={[styles.statusDot, isMicActive && styles.statusDotActive]} />
            <Text style={styles.subtitleText}>
              {isMicActive ? 'Listening to you...' : 'Speaking with you...'}
            </Text>
          </View>

          {/* ── 4. WHAT IS BEING SPOKEN (NATURAL CAPTION WITHOUT BACKGROUND BOX) */}
          <View style={styles.speechContainer}>
            <Animated.Text style={[styles.darkBlackText, { opacity: speechOpacity }]}>
              "{VOICE_LINES[speechIndex]}"
            </Animated.Text>
          </View>

          {/* ── 5. OTHER DETAILS IN LOW OPACITY (NATURAL & WARM) ───────────── */}
          <View style={styles.lowOpacitySection}>
            <View style={styles.lowOpacityRow}>
              <Ionicons name="heart" size={13} color="#BD5D38" />
              <Text style={styles.lowOpacityText}>Udyam Saarthi · Voice Guidance</Text>
            </View>
            <Text style={styles.lowOpacitySubtext}>
              Always here to guide your business journey
            </Text>
          </View>

          {/* ── 6. CONTINUE TO DASHBOARD BUTTON ─────────────────────────────── */}
          <TouchableOpacity
            style={styles.dashboardBtn}
            activeOpacity={0.88}
            onPress={handleGoToDashboard}
          >
            <Text style={styles.dashboardBtnText}>Go to Dashboard</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </ScrollView>

        {/* ── BOTTOM CONTROLS ──────────────────────────────────────────────── */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={handleGoToDashboard}
          >
            <Ionicons name="home-outline" size={22} color="#7D5333" />
          </TouchableOpacity>

          {/* Glowing Fainted Orange Mic Button */}
          <TouchableOpacity
            style={[styles.micOuter, isMicActive && styles.micOuterActive]}
            activeOpacity={0.85}
            onPress={() => setIsMicActive((prev) => !prev)}
          >
            <View style={[styles.micInner, isMicActive && styles.micInnerActive]}>
              <Ionicons name={isMicActive ? "mic" : "mic-outline"} size={28} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={handleGoToDashboard}
          >
            <Ionicons name="checkmark" size={24} color="#7D5333" />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF0E6',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF0E6',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 12) + 4 : 12,
    paddingBottom: 20,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 6,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F2E5D7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7D7C5',
  },
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F2E5D7',
    borderWidth: 1,
    borderColor: '#E7D7C5',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7D5333',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  doingLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#BD5D38',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2B231F',
    textAlign: 'center',
  },

  // ── Scrollable Body ─────────────────────────────────────────────────────────
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 16,
  },

  // ── AI Sphere ───────────────────────────────────────────────────────────────
  sphereContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },

  // ── Subtitle (Just Below Sphere) ───────────────────────────────────────────
  subtitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2E4D6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E6D4C2',
    marginTop: 4,
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BD5D38',
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: '#10B981',
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A3B2C',
    letterSpacing: 0.2,
  },

  // ── Caption Text (Pure Dark Black Text) ────────────────────────────────────
  speechContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkBlackText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 27,
    letterSpacing: -0.2,
  },

  // ── Other Things in Low Opacity ─────────────────────────────────────────────
  lowOpacitySection: {
    alignItems: 'center',
    opacity: 0.4,
    marginBottom: 20,
  },
  lowOpacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  lowOpacityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C4E43',
  },
  lowOpacitySubtext: {
    fontSize: 11,
    color: '#7A6B60',
    textAlign: 'center',
  },

  // ── Go to Dashboard Primary Button ──────────────────────────────────────────
  dashboardBtn: {
    backgroundColor: '#BD5D38',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#BD5D38',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dashboardBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // ── Bottom Bar Controls ─────────────────────────────────────────────────────
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 6,
  },
  secondaryBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3EBDD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5D9C7',
  },
  micOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(189, 93, 56, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BD5D38',
  },
  micOuterActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: '#10B981',
  },
  micInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#BD5D38',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micInnerActive: {
    backgroundColor: '#10B981',
  },
});
