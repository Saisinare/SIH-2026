import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../src/presentation/store/app-store';
import strings, { LangKey } from '../../src/core/i18n/strings';

interface LanguageOption {
  key: LangKey;
  nativeTitle: string;
  subtitle: string;
  icon: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    key: 'mr',
    nativeTitle: 'मराठी',
    subtitle: 'मराठीत वापरा — महाराष्ट्रातील ग्रामीण उद्योजकांसाठी',
    icon: '🚩',
  },
  {
    key: 'hi',
    nativeTitle: 'हिंदी',
    subtitle: 'हिंदी में उपयोग करें — भारत के सभी क्षेत्रों के लिए',
    icon: '🇮🇳',
  },
  {
    key: 'en',
    nativeTitle: 'English',
    subtitle: 'Use in English — For institutional & officer mode',
    icon: '🌐',
  },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { locale, setLocale } = useAppStore();
  const t = strings[locale] || strings.hi;

  const handleSelectLanguage = (langKey: LangKey) => {
    setLocale(langKey);
  };

  const handleContinue = () => {
    router.push('/(onboarding)/business-type');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step Badge & Dots */}
        <View style={styles.topHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP 2 OF 4</Text>
          </View>
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{t.selectLanguageTitle}</Text>
        <Text style={styles.subtitle}>{t.selectLanguageSubtitle}</Text>

        {/* Language Options */}
        <View style={styles.optionsContainer}>
          {LANGUAGES.map((item) => {
            const isSelected = locale === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.85}
                style={[styles.langCard, isSelected && styles.langCardSelected]}
                onPress={() => handleSelectLanguage(item.key)}
              >
                <View style={styles.langHeader}>
                  <Text style={styles.langIcon}>{item.icon}</Text>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.langNativeTitle}>{item.nativeTitle}</Text>
                    <Text style={styles.langSubtext}>{item.subtitle}</Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInnerCircle} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.primaryButton}
          onPress={handleContinue}
        >
          <Text style={styles.primaryButtonText}>{t.proceed}</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EE',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    minHeight: '100%',
    justifyContent: 'center',
  },
  topHeader: {
    marginBottom: 20,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EBE4D8',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  stepBadgeText: {
    color: '#6B6358',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD6CA',
  },
  dotActive: {
    backgroundColor: '#BD5D38',
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1C1A17',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#6B6359',
    marginBottom: 28,
    lineHeight: 21,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  langCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#ECE6DC',
  },
  langCardSelected: {
    borderColor: '#BD5D38',
    backgroundColor: '#FFFBF8',
    shadowColor: '#BD5D38',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  langHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langIcon: {
    fontSize: 28,
  },
  langNativeTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1C1A17',
    marginBottom: 3,
  },
  langSubtext: {
    fontSize: 13,
    color: '#7A7267',
    lineHeight: 18,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C5BEB3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#BD5D38',
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#BD5D38',
  },
  primaryButton: {
    backgroundColor: '#BD5D38',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#BD5D38',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});
