import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import TarotCardDeck from './TarotCardDeck';

interface Props {
  result: any;
  onReset: () => void;
  onBuyMore: () => void;
  questionsRemaining: number;
}

export default function ReadingResult({ result, onReset, onBuyMore, questionsRemaining }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.ScrollView
      style={{ opacity: fadeAnim }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🔮</Text>
          <Text style={styles.headerTitle}>Okuman Hazır</Text>
          <Text style={styles.headerSub}>{result.question}</Text>
        </View>

        <LinearGradient
          colors={['#1A0035', '#0A0014']}
          style={[styles.answerCard, SHADOWS.purpleGlow]}
        >
          <Text style={styles.answerText}>{result.answer}</Text>
        </LinearGradient>

        {result.tarot_cards?.cards?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🃏 Tarot Kartların</Text>
            <TarotCardDeck cards={result.tarot_cards.cards} />
          </View>
        )}

        {result.astrology && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Astroloji Profili</Text>
            <LinearGradient colors={['#1A0035', '#0A0014']} style={styles.infoCard}>
              <InfoRow label="Güneş Burcu" value={result.astrology.sun_sign} />
              <InfoRow label="Ay Burcu" value={result.astrology.moon_sign} />
              <InfoRow label="Yükselen" value={result.astrology.rising_sign} />
              <InfoRow label="Element" value={result.astrology.element} />
              <Text style={styles.dailyEnergy}>{result.astrology.daily_energy}</Text>
            </LinearGradient>
          </View>
        )}

        {result.numerology && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔢 Numeroloji Analizi</Text>
            <LinearGradient colors={['#1A0035', '#0A0014']} style={styles.infoCard}>
              <Text style={styles.numerologyDesc}>{result.numerology.life_path_description}</Text>
              <InfoRow label="Yaşam Yolu" value={String(result.numerology.life_path?.number)} />
              <InfoRow label="İfade Sayısı" value={String(result.numerology.expression?.number)} />
            </LinearGradient>
          </View>
        )}

        {result.palm_analysis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✋ Avuç Analizi</Text>
            <LinearGradient colors={['#1A0035', '#0A0014']} style={styles.infoCard}>
              <Text style={styles.palmText}>{result.palm_analysis.overall}</Text>
            </LinearGradient>
          </View>
        )}

        <View style={styles.remainingBox}>
          <Text style={styles.remainingText}>
            {questionsRemaining > 0
              ? `Kalan soru hakkın: ${questionsRemaining}`
              : 'Soru hakkın bitti'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.newQuestionBtn} onPress={onReset}>
            <Text style={styles.newQuestionText}>Yeni Soru Sor</Text>
          </TouchableOpacity>
          {questionsRemaining === 0 && (
            <TouchableOpacity style={styles.buyBtn} onPress={onBuyMore}>
              <LinearGradient
                colors={[COLORS.primary, '#A07830']}
                style={styles.buyGradient}
              >
                <Text style={styles.buyText}>Paket Satın Al 🌟</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  headerSub: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  answerCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    ...SHADOWS.purpleGlow,
  },
  answerText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  infoCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  infoValue: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  dailyEnergy: {
    color: COLORS.text,
    fontSize: 13,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  numerologyDesc: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: SPACING.sm,
    fontStyle: 'italic',
  },
  palmText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
  },
  remainingBox: {
    margin: SPACING.md,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  remainingText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  actions: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  newQuestionBtn: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  newQuestionText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  buyBtn: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  buyGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  buyText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
