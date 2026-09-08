import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,

  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../src/presentation/store/app-store';
import strings from '../../src/core/i18n/strings';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const { locale, setPhoneNumber } = useAppStore();
  const t = strings[locale] || strings.hi;

  const [phone, setPhone] = useState('8149117998');
  const [otpVal, setOtpVal] = useState(''); // Empty by default (no prefilled values)
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(58);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const handleSendOtp = () => {
    const cleaned = phone.trim().replace(/[^0-9]/g, '');
    if (cleaned.length < 10) {
      setError(t.invalidPhone);
      return;
    }
    setError('');
    setStep('otp');
    setOtpVal(''); // Empty by default
    setTimer(58);
  };

  const handleVerifyOtp = () => {
    if (otpVal.length < 4) {
      setError(t.invalidOtp);
      return;
    }
    setError('');
    const cleanedPhone = phone.trim().replace(/[^0-9]/g, '');
    setPhoneNumber(cleanedPhone);
    router.push('/(onboarding)/language');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF6EE" />

      {/* Full Screen Background Image (signup-bg.png for Phone step, otp-bg.jpg for OTP step) */}
      <Image
        source={step === 'phone' ? require('../../signup-bg.png') : require('../../otp-bg.jpg')}
        style={styles.bgImage}
        resizeMode="stretch"
      />

      {step === 'phone' ? (
        /* PHONE NUMBER STEP */
        <View style={styles.overlayContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>मोबाइल नंबर टाका</Text>
              <Text style={styles.cardSubtitle}>
                OTP द्वारे तुमचा नंबर पडताळा
              </Text>
            </View>

            <Text style={styles.fieldLabel}>मोबाइल नंबर</Text>
            <View style={styles.inputContainer}>
              <View style={styles.countryPicker}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <View style={styles.inputDivider} />
              <TextInput
                style={styles.phoneInput}
                placeholder="8149117998"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={(val) => {
                  setPhone(val);
                  if (error) setError('');
                }}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionButton}
              onPress={handleSendOtp}
            >
              <Text style={styles.actionButtonText}>OTP पाठवा</Text>
            </TouchableOpacity>

            <View style={styles.securityRow}>
              <Text style={styles.securityText}>
                तुमची माहिती पूर्णपणे सुरक्षित आहे
              </Text>
            </View>
          </View>
        </View>
      ) : (
        /* OTP STEP OVERLAY - ONLY FUNCTIONAL UI (NO DUPLICATE TEXT/TITLES) */
        <ScrollView
          contentContainerStyle={styles.otpScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar Back Button */}
          <View style={styles.otpTopBar}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.backBtn}
              onPress={() => {
                setStep('phone');
                setError('');
              }}
            >
              <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>
          </View>

          {/* Form Content Positioned Below Background Title Artwork */}
          <View style={styles.otpFormSection}>
            {/* 6-Digit Box OTP Inputs (Empty by default) */}
            <TouchableOpacity
              activeOpacity={1}
              style={styles.otpBoxesContainer}
              onPress={() => inputRef.current?.focus()}
            >
              <TextInput
                ref={inputRef}
                style={styles.hiddenInput}
                keyboardType="number-pad"
                maxLength={6}
                value={otpVal}
                onChangeText={(val) => {
                  setOtpVal(val);
                  if (error) setError('');
                }}
                autoFocus={true}
              />
              {Array.from({ length: 6 }).map((_, idx) => {
                const char = otpVal[idx] || '';
                const isFocused = otpVal.length === idx;
                return (
                  <View
                    key={idx}
                    style={[
                      styles.otpBox,
                      isFocused && styles.otpBoxFocused,
                      char.length > 0 && styles.otpBoxFilled,
                    ]}
                  >
                    <Text style={styles.otpBoxChar}>{char}</Text>
                  </View>
                );
              })}
            </TouchableOpacity>

            {error ? <Text style={styles.errorTextCenter}>{error}</Text> : null}

            {/* Resend Timer Subtext */}
            <Text style={styles.timerSubtext}>
              OTP{' '}
              <Text style={styles.timerHighlight}>{formatTimer(timer)}</Text>{' '}
              मध्ये पुन्हा पाठवू शकता.
            </Text>

            {/* OTP Submit Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.actionButton}
              onPress={handleVerifyOtp}
            >
              <Text style={styles.actionButtonText}>OTP सबमिट करा →</Text>
            </TouchableOpacity>

            {/* Divider Line */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>किंवा</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Resend OTP Link */}
            <TouchableOpacity
              style={styles.resendBtn}
              onPress={() => {
                setTimer(58);
                setOtpVal('');
              }}
            >
              <Text style={styles.resendText}>
                💬 OTP मिळाला नाही?{' '}
                <Text style={styles.resendHighlight}>पुन्हा पाठवा</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#FAF6EE',
    overflow: 'hidden',
    position: 'relative',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
    zIndex: 10,
  },
  card: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1A17',
  },
  cardSubtitle: {
    fontSize: 13.5,
    color: '#827B70',
    marginTop: 3,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#827B70',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F6F0',
    borderWidth: 1,
    borderColor: '#EAE4D9',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 18,
    height: 54,
  },
  countryPicker: {
    paddingRight: 8,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1A17',
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0D9CC',
    marginHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1A17',
    height: '100%',
  },
  actionButton: {
    backgroundColor: '#C05C38',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  securityRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  securityText: {
    fontSize: 12,
    color: '#827B70',
    fontWeight: '500',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12.5,
    marginBottom: 12,
  },
  errorTextCenter: {
    color: '#DC2626',
    fontSize: 12.5,
    textAlign: 'center',
    marginVertical: 6,
  },
  /* OTP Step Overlay Styles */
  otpScrollContent: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 8 : 16,
    paddingBottom: 40,
    minHeight: '100%',
  },
  otpTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3ECE3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6DDD1',
  },
  backBtnText: {
    fontSize: 20,
    color: '#4A443C',
    fontWeight: '700',
  },
  otpFormSection: {
    marginTop: 340, // Shifted lower to sit cleanly below background text inside otp-bg.jpg
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    position: 'relative',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    zIndex: 10,
  },
  otpBox: {
    width: 46,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EAE4D9',
    backgroundColor: '#FAF6EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFocused: {
    borderColor: '#C05C38',
    backgroundColor: '#FFFBF8',
    borderWidth: 2,
  },
  otpBoxFilled: {
    borderColor: '#C05C38',
  },
  otpBoxChar: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1A17',
  },
  timerSubtext: {
    textAlign: 'center',
    fontSize: 13,
    color: '#827B70',
    marginBottom: 20,
  },
  timerHighlight: {
    color: '#C05C38',
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6DFD4',
  },
  dividerText: {
    fontSize: 12.5,
    color: '#A0978B',
    paddingHorizontal: 12,
  },
  resendBtn: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 13.5,
    color: '#6E665C',
  },
  resendHighlight: {
    color: '#C05C38',
    fontWeight: '800',
  },
});
