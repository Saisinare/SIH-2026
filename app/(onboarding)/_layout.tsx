import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#0A0A12' },
      }}
    >
      <Stack.Screen name="signup" />
      <Stack.Screen name="language" />
      <Stack.Screen name="business-type" />
      <Stack.Screen name="questions" />
    </Stack>
  );
}
