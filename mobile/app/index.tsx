import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { isOnboardingDone } from '../services/storage';
import { COLORS } from '../constants/theme';

export default function Index() {
  useEffect(() => {
    isOnboardingDone().then((done) => {
      if (done) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/onboarding/welcome');
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={COLORS.primary} size="large" />
    </View>
  );
}
