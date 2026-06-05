import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import StarBackground from '../../components/StarBackground';
import ReadingResult from '../../components/ReadingResult';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { useReadingSession } from '../../hooks/useReadingSession';

const SUGGESTED_QUESTIONS = [
  'Aşk hayatımda neler olacak?',
  'Kariyer ve iş hayatımda ne değişecek?',
  'Finansal durumum nasıl olacak?',
  'Sağlığım hakkında ne söyleyebilirsiniz?',
  'Bu kararı almalı mıyım?',
  'Önümüzdeki 3 ayda ne bekliyorum?',
];

export default function ReadingScreen() {
  const [question, setQuestion] = useState('');
  const { ask, reset, loading, error, result, questionsRemaining, needsPremium } = useReadingSession();

  if (result) {
    return (
      <StarBackground>
        <View style={{ flex: 1, paddingTop: SPACING.xxl }}>
          <ReadingResult
            result={result}
            onReset={reset}
            onBuyMore={() => router.push('/premium/packages')}
            questionsRemaining={questionsRemaining}
          />
        </View>
      </StarBackground>
    );
  }

  return (
    <StarBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.emoji}>🔮</Text>
            <Text style={styles.title}>Sorunuzu Sorun</Text>
            <Text style={styles.subtitle}>
              Evren cevaplamaya hazır. Kalbinizden gelen soruyu yazın.
            </Text>
            {questionsRemaining > 0 && (
              <View style={styles.quota}>
                <Text style={styles.quotaText}>Kalan: {questionsRemaining} soru hakkı</Text>
              </View>
            )}
          </View>

          {needsPremium ? (
            <View style={styles.premiumBlock}>
              <Text style={styles.premiumEmoji}>⭐</Text>
              <Text style={styles.premiumTitle}>Soru Hakkın Bitti</Text>
              <Text style={styles.premiumText}>
                Sadece ₺49 ile 3 soru hakkı kazan. Ya da aylık pakete geç!
              </Text>
              <TouchableOpacity
                style={styles.premiumBtn}
                onPress={() => router.push('/premium/packages')}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#A07830']}
                  style={styles.premiumGradient}
                >
                  <Text style={styles.premiumBtnText}>Paket Seç 🌟</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Sorunuzu buraya yazın..."
                  placeholderTextColor={COLORS.textDim}
                  value={question}
                  onChangeText={setQuestion}
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{question.length}/500</Text>
              </View>

              {error && !needsPremium && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.askBtn, (!question.trim() || loading) && styles.askBtnDisabled]}
                onPress={() => ask(question)}
                disabled={!question.trim() || loading}
              >
                <LinearGradient
                  colors={question.trim() ? [COLORS.primary, '#A07830'] : [COLORS.border, COLORS.border]}
                  style={styles.askGradient}
                >
                  {loading ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator color={COLORS.background} size="small" />
                      <Text style={styles.askBtnText}>Evren cevaplar...</Text>
                    </View>
                  ) : (
                    <Text style={styles.askBtnText}>Oku 🔮</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.suggestSection}>
                <Text style={styles.suggestTitle}>Örnek Sorular</Text>
                <View style={styles.suggestGrid}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.suggestChip}
                      onPress={() => setQuestion(q)}
                    >
                      <Text style={styles.suggestText}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </StarBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xxl + SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  emoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  quota: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.secondary + '33',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  quotaText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  inputBox: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 140,
  },
  input: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 26,
    minHeight: 100,
  },
  charCount: {
    color: COLORS.textDim,
    fontSize: 11,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  errorBox: {
    backgroundColor: COLORS.error + '22',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.error + '44',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    textAlign: 'center',
  },
  askBtn: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  askBtnDisabled: {
    opacity: 0.5,
  },
  askGradient: {
    padding: SPACING.md,
    alignItems: 'center',
    borderRadius: RADIUS.lg,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  askBtnText: {
    color: COLORS.background,
    fontSize: 17,
    fontWeight: '700',
  },
  suggestSection: {
    gap: SPACING.sm,
  },
  suggestTitle: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  suggestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  suggestChip: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  premiumBlock: {
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  premiumEmoji: {
    fontSize: 56,
  },
  premiumTitle: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  premiumText: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  premiumBtn: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  premiumBtnText: {
    color: COLORS.background,
    fontSize: 17,
    fontWeight: '700',
  },
});
