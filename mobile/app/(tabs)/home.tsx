import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import StarBackground from '../../components/StarBackground';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { getUserProfile, getAstrology, getReadingHistory } from '../../services/api';
import { getUserProfile as getLocalProfile } from '../../services/storage';

export default function HomeScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [astrology, setAstrology] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [p, a, h] = await Promise.allSettled([
        getUserProfile(),
        getAstrology(),
        getReadingHistory(),
      ]);
      if (p.status === 'fulfilled') setProfile(p.value);
      if (a.status === 'fulfilled') setAstrology(a.value);
      if (h.status === 'fulfilled') setHistory((h.value as any[]).slice(0, 3));
    } catch {
      const local = await getLocalProfile();
      setProfile(local);
    }
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  return (
    <StarBackground>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>{profile?.name || 'Mistik Ruh'} ✨</Text>
          {profile?.streak_days > 1 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {profile.streak_days} Günlük Seri!</Text>
            </View>
          )}
        </View>

        {astrology && (
          <LinearGradient
            colors={['#2D1A55', '#1A0035']}
            style={[styles.astrologyCard, SHADOWS.purpleGlow]}
          >
            <Text style={styles.astrologyTitle}>⭐ Bugünkü Enerjin</Text>
            <View style={styles.astrologyRow}>
              <AstroChip label="☀️" value={astrology.sun_sign} />
              <AstroChip label="🌙" value={astrology.moon_sign} />
              <AstroChip label="⬆️" value={astrology.rising_sign === 'Bilinmiyor' ? '?' : astrology.rising_sign} />
            </View>
            <Text style={styles.dailyEnergy}>{astrology.daily_energy}</Text>
          </LinearGradient>
        )}

        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.push('/(tabs)/reading')}
        >
          <LinearGradient
            colors={[COLORS.primary, '#A07830']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaEmoji}>🔮</Text>
            <View>
              <Text style={styles.ctaTitle}>Şimdi Oku</Text>
              <Text style={styles.ctaSub}>
                {profile?.questions_remaining > 0
                  ? `${profile.questions_remaining} soru hakkın var`
                  : 'Paket satın al'}
              </Text>
            </View>
            <Text style={styles.ctaArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <QuickAction emoji="🃏" label="Tarot" onPress={() => router.push('/(tabs)/tarot')} />
          <QuickAction emoji="⭐" label="Burçlar" onPress={() => router.push('/(tabs)/profile')} />
          <QuickAction emoji="💫" label="Premium" onPress={() => router.push('/premium/packages')} />
        </View>

        {history.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📖 Son Okumalar</Text>
            {history.map((r, i) => (
              <View key={r.id} style={styles.historyCard}>
                <Text style={styles.historyQ} numberOfLines={1}>🔹 {r.question}</Text>
                <Text style={styles.historyA} numberOfLines={2}>{r.answer}</Text>
              </View>
            ))}
          </View>
        )}

        {profile?.questions_remaining === 0 && (
          <TouchableOpacity onPress={() => router.push('/premium/packages')}>
            <LinearGradient
              colors={['#4A0035', '#2D001A']}
              style={styles.upsellBanner}
            >
              <Text style={styles.upsellText}>
                🌟 Soru hakkın bitti! Aylık paket ile sınırsız okuma yap. Sadece ₺149/ay
              </Text>
              <Text style={styles.upsellCta}>Paket Al →</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </StarBackground>
  );
}

function AstroChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{value}</Text>
    </View>
  );
}

function QuickAction({ emoji, label, onPress }: { emoji: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickBtn} onPress={onPress}>
      <LinearGradient colors={['#1A0035', '#0A0014']} style={styles.quickGradient}>
        <Text style={styles.quickEmoji}>{emoji}</Text>
        <Text style={styles.quickLabel}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xxl + SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  greeting: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  name: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: '800',
  },
  streakBadge: {
    marginTop: SPACING.xs,
    backgroundColor: '#FF6B0022',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  streakText: {
    color: '#FF6B00',
    fontSize: 13,
    fontWeight: '700',
  },
  astrologyCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  astrologyTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  astrologyRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipLabel: {
    fontSize: 16,
    marginBottom: 2,
  },
  chipValue: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
  },
  dailyEnergy: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  cta: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  ctaEmoji: {
    fontSize: 36,
  },
  ctaTitle: {
    color: COLORS.background,
    fontSize: 20,
    fontWeight: '800',
  },
  ctaSub: {
    color: COLORS.background + 'AA',
    fontSize: 12,
  },
  ctaArrow: {
    color: COLORS.background,
    fontSize: 24,
    marginLeft: 'auto',
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  quickBtn: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickGradient: {
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  quickEmoji: {
    fontSize: 28,
  },
  quickLabel: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  historyCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyQ: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyA: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  upsellBanner: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accent + '44',
  },
  upsellText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: SPACING.xs,
  },
  upsellCta: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
