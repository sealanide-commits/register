import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import StarBackground from '../../components/StarBackground';
import { createUser } from '../../services/api';
import { saveUserProfile, getOrCreateDeviceId } from '../../services/storage';

export default function WelcomeScreen() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const STEPS = [
    {
      title: '🌟 MistikAI',
      subtitle: 'Evrenin sana özel mesajları burada seni bekliyor.',
      emoji: '🔮',
    },
    {
      title: 'Adın nedir?',
      subtitle: 'Kaderin seni nasıl çağırdığını bilmek istiyoruz.',
      emoji: '✨',
    },
    {
      title: 'Doğum tarihin?',
      subtitle: 'Yıldızların seni hangi anda dünyaya getirdiğini söyle.',
      emoji: '⭐',
    },
    {
      title: 'Doğum saat ve şehrin?',
      subtitle: 'İsteğe bağlı – daha hassas bir yükselen burç hesabı için.',
      emoji: '🌙',
    },
  ];

  const currentStep = STEPS[step];

  const handleNext = async () => {
    if (step === 1 && !name.trim()) {
      Alert.alert('', 'Lütfen adını gir.');
      return;
    }
    if (step === 2 && !birthDate.trim()) {
      Alert.alert('', 'Lütfen doğum tarihini gir (YYYY-AA-GG).');
      return;
    }

    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const deviceId = await getOrCreateDeviceId();
      await createUser({ name, birthDate, birthTime: birthTime || undefined, birthCity: birthCity || undefined });
      await saveUserProfile({ deviceId, name, birthDate, birthTime, birthCity });
      router.replace('/onboarding/palm-upload');
    } catch (e: any) {
      Alert.alert('Hata', e.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StarBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.topSection}>
            <Text style={styles.emoji}>{currentStep.emoji}</Text>
            <Text style={styles.title}>{currentStep.title}</Text>
            <Text style={styles.subtitle}>{currentStep.subtitle}</Text>
          </View>

          <View style={styles.inputSection}>
            {step === 1 && (
              <TextInput
                style={styles.input}
                placeholder="Adın ve soyadın"
                placeholderTextColor={COLORS.textDim}
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="next"
              />
            )}
            {step === 2 && (
              <TextInput
                style={styles.input}
                placeholder="YYYY-AA-GG (örn. 1992-05-15)"
                placeholderTextColor={COLORS.textDim}
                value={birthDate}
                onChangeText={setBirthDate}
                keyboardType="numbers-and-punctuation"
                autoFocus
              />
            )}
            {step === 3 && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Doğum saati (örn. 14:30)"
                  placeholderTextColor={COLORS.textDim}
                  value={birthTime}
                  onChangeText={setBirthTime}
                />
                <TextInput
                  style={[styles.input, { marginTop: SPACING.sm }]}
                  placeholder="Doğum şehri (örn. İstanbul)"
                  placeholderTextColor={COLORS.textDim}
                  value={birthCity}
                  onChangeText={setBirthCity}
                />
              </>
            )}
          </View>

          <View style={styles.dotsRow}>
            {STEPS.map((_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>

          <TouchableOpacity onPress={handleNext} disabled={loading} style={styles.btnWrapper}>
            <LinearGradient
              colors={[COLORS.primary, '#A07830']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>
                {loading ? '⌛ Yükleniyor...' : step === STEPS.length - 1 ? 'Başla 🔮' : 'Devam →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {step === 3 && (
            <TouchableOpacity onPress={handleNext} style={styles.skipBtn}>
              <Text style={styles.skipText}>Şimdilik atla</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </StarBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl * 2,
    paddingBottom: SPACING.xxl,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 72,
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: SPACING.xl,
  },
  input: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  btnWrapper: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  btn: {
    padding: SPACING.md,
    alignItems: 'center',
    borderRadius: RADIUS.lg,
  },
  btnText: {
    color: COLORS.background,
    fontSize: 17,
    fontWeight: '700',
  },
  skipBtn: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  skipText: {
    color: COLORS.textDim,
    fontSize: 14,
  },
});
