import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>उद्यम सारथी</Text>
      <Text style={styles.subtitle}>Udyam Saarthi</Text>
      <Text style={styles.description}>
        Empowering rural micro-entrepreneurs with smart, deterministic financial advice.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/intake')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F766E', // Teal 700
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FEF3C7', // Amber 100
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: '#FDE68A', // Amber 200
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#CCFBF1', // Teal 100
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#F59E0B', // Amber 500
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
