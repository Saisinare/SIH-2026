import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,

  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../src/presentation/store/app-store';
import ExistingBusinessSvg from './components/ExistingBusinessSvg';
import NewBusinessSvg from './components/NewBusinessSvg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BusinessTypeScreen() {
  const router = useRouter();
  const { businessType, setBusinessType } = useAppStore();

  const handleSelect = (type: 'existing' | 'new') => {
    setBusinessType(type);
    router.push('/(onboarding)/questions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF6EE" />

      {/* Full-Screen Background Image */}
      <Image
        source={require('../../business-prompt.jpg')}
        style={styles.bgImage}
        resizeMode="stretch"
      />

      {/* Main Overlay Container with Steady Position */}
      <View style={styles.overlayContainer}>
        <View style={styles.cardsContainer}>
          {/* Card 1: Existing Business */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={[
              styles.card,
              businessType === 'existing' && styles.cardSelected,
            ]}
            onPress={() => handleSelect('existing')}
          >
            {/* Left Illustration */}
            <View style={styles.illustrationBox}>
              <ExistingBusinessSvg width={105} height={95} />
            </View>

            {/* Middle Content */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {'माझा आधीपासून\nव्यवसाय आहे'}
              </Text>
              <Text style={styles.cardSubtitle}>
                माझा व्यवसाय अधिक वाढवण्यासाठी आणि सुधारण्यासाठी मार्गदर्शन हवे आहे.
              </Text>
            </View>

            {/* Right Circle Arrow */}
            <View style={styles.arrowCircle}>
              <Text style={styles.arrowIcon}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Card 2: New Business */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={[
              styles.card,
              businessType === 'new' && styles.cardSelected,
            ]}
            onPress={() => handleSelect('new')}
          >
            {/* Left Illustration */}
            <View style={styles.illustrationBox}>
              <NewBusinessSvg width={105} height={95} />
            </View>

            {/* Middle Content */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {'मी नवीन\nव्यवसाय सुरु करू इच्छितो'}
              </Text>
              <Text style={styles.cardSubtitle}>
                मला नवीन व्यवसाय सुरु करण्यासाठी योग्य कल्पना, योजना आणि मार्गदर्शन हवे आहे.
              </Text>
            </View>

            {/* Right Circle Arrow */}
            <View style={styles.arrowCircle}>
              <Text style={styles.arrowIcon}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6EE',
    overflow: 'hidden',
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
    paddingHorizontal: 16,
    paddingTop: 120,
    paddingBottom: 40,
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
  cardsContainer: {
    gap: 18,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFDF9',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#EAE1D2',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4A3B2C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#BD5D38',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  illustrationBox: {
    width: 105,
    height: 95,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2B231F',
    lineHeight: 25,
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 12.5,
    fontWeight: '400',
    color: '#73685F',
    marginTop: 6,
    lineHeight: 18,
  },
  arrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3EBDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7D5333',
    marginTop: -2,
  },
});


