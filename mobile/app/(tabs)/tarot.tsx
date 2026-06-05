import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import StarBackground from '../../components/StarBackground';
import TarotCardDeck from '../../components/TarotCardDeck';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { getDailyTarot } from '../../services/api';

export default function TarotScreen() {
  const [tarot, setTarot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDailyTarot();
      setTarot(data);
    } catch (e: any) {
      setError('Tarot kartları yüklenemedi. Bağlantını kontrol et.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <StarBackground>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🃏</Text>
          <Text style={styles.title}>Günlük Tarot</Text>
          <Text style={styles.subtitle}>
            Kartlara odaklan. Zihnini boşalt. Sezgine güven.
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.primary} size="large" />
            <Text style={styles.loadingText}>Kartlar karıştırılıyor...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={load} style={styles.retryBtn}>
              <Text style={styles.retryText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : tarot ? (
          <>
            {!revealed ? (
              <TouchableOpacity
                style={styles.revealBtn}
                onPress={() => setRevealed(true)}
              >
                <LinearGradient
                  colors={[COLORS.secondary, '#4A0080']}
                  style={styles.revealGradient}
                >
                  <Text style={styles.revealEmoji}>🔮</Text>
                  <Text style={styles.revealText}>Kartlarını Aç</Text>
                  <Text style={styles.revealHint}>Üç kart seni bekliyor</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={styles.spreadLabel}>Geçmiş · Şimdi · Gelecek</Text>
                <TarotCardDeck cards={tarot.cards} />

                <View style={styles.cards}>
                  {tarot.cards.map((card: any, i: number) => (
                    <LinearGradient
                      key={i}
                      colors={['#1A0035', '#0A0014']}
                      style={styles.cardDetail}
                    >
                      <Text style={styles.cardPosition}>{card.position}</Text>
                      <Text style={styles.cardName}>{card.card_name}</Text>
                      <Text style={styles.cardMeaning}>{card.meaning}</Text>
                    </LinearGradient>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.deepReadingBtn}
                  onPress={() => router.push('/(tabs)/reading')}
                >
                  <LinearGradient
                    colors={[COLORS.primary, '#A07830']}
                    style={styles.deepReadingGradient}
                  >
                    <Text style={styles.deepReadingText}>Bu Kartlara Göre Soru Sor 🔮</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </>
        ) : null}
      </ScrollView>
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
  loadingBox: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 15,
  },
  errorBox: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xl,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
  retryBtn: {
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  retryText: {
    color: COLORS.text,
    fontSize: 14,
  },
  revealBtn: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.purpleGlow,
  },
  revealGradient: {
    padding: SPACING.xxl,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  revealEmoji: {
    fontSize: 56,
  },
  revealText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
  },
  revealHint: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  spreadLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 2,
  },
  cards: {
    gap: SPACING.sm,
  },
  cardDetail: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPosition: {
    color: COLORS.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardName: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  cardMeaning: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
  },
  deepReadingBtn: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  deepReadingGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  deepReadingText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
