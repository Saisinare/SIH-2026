import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import VoiceOrb from '../src/presentation/components/VoiceOrb';

export default function AiVoiceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#120826" />

      {/* Main Screen Container */}
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconCircle}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Voice chat</Text>

          <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
            <Ionicons name="ellipsis-vertical" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Center Content Area */}
        <View style={styles.centerContent}>
          {/* Interactive Voice Orb Sphere */}
          <View style={styles.orbContainer}>
            <VoiceOrb />
          </View>

          {/* Assistant Badge Pill */}
          <View style={styles.badgePill}>
            <Ionicons name="sparkles" size={14} color="#C084FC" style={{ marginRight: 6 }} />
            <Text style={styles.badgeText}>Your Assistant 3.0</Text>
          </View>

          {/* Headline & Description */}
          <Text style={styles.mainHeading}>Smart Voice Assistant</Text>
          <Text style={styles.subHeading}>
            Effortlessly chat with your AI bot, enjoying instant and seamless voice interactions.
          </Text>

          {/* Multilingual Support Pill */}
          <View style={styles.langPill}>
            <Text style={styles.langText}>
              <Text style={{ color: '#10B981' }}>● </Text>हिंदी  •  English  •  मराठी
            </Text>
          </View>
        </View>

        {/* Bottom Action Controls */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.sideControlBtn} activeOpacity={0.8}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#E9D5FF" />
          </TouchableOpacity>

          {/* Main Glowing Mic Button */}
          <TouchableOpacity style={styles.micGlowOuter} activeOpacity={0.85}>
            <View style={styles.micButtonInner}>
              <Ionicons name="mic" size={28} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideControlBtn}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="#E9D5FF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#120826',
  },
  container: {
    flex: 1,
    backgroundColor: '#120826',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 12 : 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 'auto',
  },
  orbContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#A855F7',
    shadowOpacity: 0.4,
    shadowRadius: 35,
    shadowOffset: { width: 0, height: 10 },
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 13,
    color: '#E9D5FF',
    fontWeight: '500',
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subHeading: {
    fontSize: 14,
    color: '#A78BFA',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
    marginBottom: 18,
  },
  langPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  langText: {
    fontSize: 13,
    color: '#DDD6FE',
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  sideControlBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  micGlowOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(236, 72, 153, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C084FC',
    elevation: 12,
    shadowColor: '#EC4899',
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
  },
  micButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
