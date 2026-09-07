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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import VoiceSphere from '../../src/presentation/components/VoiceSphere';
import { useAzureLiveVoice } from '../../src/presentation/hooks/useAzureLiveVoice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPHERE_SIZE = Math.min(SCREEN_WIDTH * 0.75, 260);

// Multilingual action titles ("What are we doing")
const MULTILINGUAL_TITLES = [
  { lang: 'मराठी',   text: 'व्यवसाय मार्गदर्शन व नियोजन' },
  { lang: 'हिंदी',   text: 'व्यवसाय मार्गदर्शन एवं योजना' },
  { lang: 'English', text: 'Business Guidance & Planning' },
];

// Demo Marathi quick prompt suggestions
const SAMPLE_MARATHI_PROMPTS = [
  "दुग्धव्यवसायासाठी किती सबसिडी मिळते?",
  "किराणा दुकानासाठी कर्ज कसे मिळेल?",
  "माझ्याकडे ₹२०,००० आहेत, कोणता व्यवसाय करावा?",
];

export default function QuestionsScreen() {
  const router = useRouter();
  const {
    isListening,
    isProcessing,
    transcript,
    aiResponse,
    statusText,
    error,
    toggleListening,
    sendCustomPrompt,
  } = useAzureLiveVoice();

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

          {/* ── 3. SUBTITLE JUST BELOW THE SPHERE (LIVE STATUS BADGE) ──────── */}
          <View style={styles.subtitleBadge}>
            <View
              style={[
                styles.statusDot,
                isListening && styles.statusDotListening,
                isProcessing && styles.statusDotProcessing,
              ]}
            />
            <Text style={styles.subtitleText}>{statusText}</Text>
          </View>

          {/* ── 4. USER TRANSCRIBED MARATHI SPEECH (IF PRESENT) ───────────── */}
          {transcript ? (
            <View style={styles.userSpeechCard}>
              <Text style={styles.userLabel}>तुम्ही बोललात:</Text>
              <Text style={styles.userText}>"{transcript}"</Text>
            </View>
          ) : null}

          {/* ── 5. UDYAM SAARTHI MARATHI AI RESPONSE ────────────────────────── */}
          <View style={styles.speechContainer}>
            {isProcessing ? (
              <ActivityIndicator size="large" color="#BD5D38" />
            ) : (
              <Text style={styles.darkBlackText}>"{aiResponse}"</Text>
            )}
          </View>

          {/* ── 6. QUICK DEMO MARATHI PROMPTS ──────────────────────────────── */}
          <View style={styles.promptChipsWrapper}>
            <Text style={styles.chipHeaderLabel}>द्रुत प्रश्न (Quick Questions):</Text>
            <View style={styles.chipsRow}>
              {SAMPLE_MARATHI_PROMPTS.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptChip}
                  activeOpacity={0.8}
                  onPress={() => sendCustomPrompt(prompt)}
                >
                  <Ionicons name="chatbubble-outline" size={12} color="#BD5D38" />
                  <Text style={styles.promptChipText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* ── 7. MANUAL BUSINESS DETAILS INTAKE FORM BUTTON ──────────────── */}
          <TouchableOpacity
            style={styles.manualFormBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/intake')}
          >
            <Ionicons name="create-outline" size={18} color="#BD5D38" />
            <Text style={styles.manualFormBtnText}>व्यवसाय तपशील भरा (Manual Form)</Text>
            <Ionicons name="chevron-forward" size={16} color="#BD5D38" />
          </TouchableOpacity>

          {/* ── 8. CONTINUE TO DASHBOARD BUTTON ─────────────────────────────── */}
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
            style={[styles.micOuter, isListening && styles.micOuterActive]}
            activeOpacity={0.85}
            onPress={toggleListening}
          >
            <View style={[styles.micInner, isListening && styles.micInnerActive]}>
              <Ionicons name={isListening ? "mic" : "mic-outline"} size={28} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/intake')}
          >
            <Ionicons name="options-outline" size={22} color="#7D5333" />
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
    marginVertical: 6,
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
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#BD5D38',
    marginRight: 8,
  },
  statusDotListening: {
    backgroundColor: '#10B981',
  },
  statusDotProcessing: {
    backgroundColor: '#F59E0B',
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A3B2C',
    letterSpacing: 0.2,
  },

  // ── Transcribed User Speech Card ───────────────────────────────────────────
  userSpeechCard: {
    backgroundColor: '#F3E9DF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
    maxWidth: '92%',
    borderWidth: 1,
    borderColor: '#E5D6C7',
  },
  userLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#BD5D38',
    letterSpacing: 0.5,
  },
  userText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B2E2B',
    marginTop: 2,
  },

  // ── Caption Text (Pure Dark Black Text) ────────────────────────────────────
  speechContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  darkBlackText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: -0.2,
  },

  // ── Quick Prompt Chips ─────────────────────────────────────────────────────
  promptChipsWrapper: {
    width: '100%',
    marginBottom: 14,
    alignItems: 'center',
  },
  chipHeaderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7D5333',
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3E8DA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6D7C6',
  },
  promptChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A3C31',
  },

  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginBottom: 12,
    textAlign: 'center',
  },

  // ── Manual Form Button ────────────────────────────────────────────────────
  manualFormBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F5EBE0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E8DACC',
    marginBottom: 12,
    width: '92%',
  },
  manualFormBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#BD5D38',
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
    marginTop: 2,
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
