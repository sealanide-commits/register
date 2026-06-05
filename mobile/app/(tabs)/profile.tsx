import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import StarBackground from '../../components/StarBackground';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { getUserProfile, getNumerology, getAstrology } from '../../services/api';
import { clearAll } from '../../services/storage';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [numerology, setNumerology] = useState<any>(null);
  const [astrology, setAstrology] = useState<any>(null);

  useEffect(() => {
    Promise.allSettled([
      getUserProfile(),
      getNumerology(),
      getAstrology(),
    ]).then(([p, n, a]) => {
      if (p.status === 'fulfilled') setProfile(p.value);
      if (n.status === 'fulfilled') setNumerology(n.value);
      if (a.status === 'fulfilled') setAstrology(a.value);
    });
  }, []);

  const handleReset = () => {
    Alert.alert(
      'Hesabı Sıfırla',
      'Tüm verileriniz silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  return (
    <StarBackground>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🧿</Text>
          </View>
          <Text style={styles.name}>{profile?.name || 'Mistik Ruh'}</Text>
          <Text style={styles.birthDate}>{profile?.birth_date || ''}</Text>
          {profile?.streak_days > 0 && (
            <Text style={styles.streak}>🔥 {profile.streak_days} Günlük Seri</Text>
          )}
        </View>

        <LinearGradient
          colors={['#2D1A55', '#1A0035']}
          style={[styles.card, SHADOWS.purpleGlow]}
        >
          <Text style={styles.cardTitle}>📊 Soru Durumu</Text>
          <View style={styles.statRow}>
            <Stat label="Kalan Soru" value={String(profile?.questions_remaining ?? 0)} />
            <Stat label="Toplam Okuma" value={String(profile?.total_questions_used ?? 0)} />
            <Stat label="Streak" value={`${profile?.streak_days ?? 0} gün`} />
          </View>
        </LinearGradient>

        {astrology && (
          <LinearGradient colors={['#1A0035', '#0A0014']} style={styles.card}>
            <Text style={styles.cardTitle}>⭐ Astroloji Profilin</Text>
            <InfoRow label="☀️ Güneş Burcu" value={astrology.sun_sign} />
            <InfoRow label="🌙 Ay Burcu" value={astrology.moon_sign} />
            <InfoRow label="⬆️ Yükselen" value={astrology.rising_sign} />
            <InfoRow label="🔥 Element" value={astrology.element} />
            <InfoRow label="🪐 Yönetici Gezegen" value={astrology.ruling_planet} />
            <Text style={styles.signDesc}>{astrology.sun_description}</Text>
          </LinearGradient>
        )}

        {numerology && (
          <LinearGradient colors={['#1A0035', '#0A0014']} style={styles.card}>
            <Text style={styles.cardTitle}>🔢 Numeroloji Analizi</Text>
            <InfoRow label="Yaşam Yolu" value={`${numerology.life_path?.number}${numerology.life_path?.is_master ? ' (Master)' : ''}`} />
            <InfoRow label="İfade Sayısı" value={String(numerology.expression?.number)} />
            <InfoRow label="Ruh Dürtüsü" value={String(numerology.soul_urge?.number)} />
            <InfoRow label="Kişilik" value={String(numerology.personality?.number)} />
            <Text style={styles.signDesc}>{numerology.life_path_description}</Text>
          </LinearGradient>
        )}

        <TouchableOpacity
          style={styles.premiumBtn}
          onPress={() => router.push('/premium/packages')}
        >
          <LinearGradient colors={[COLORS.primary, '#A07830']} style={styles.premiumGradient}>
            <Text style={styles.premiumText}>⭐ Paket Satın Al</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetText}>Hesabı Sıfırla</Text>
        </TouchableOpacity>
      </ScrollView>
    </StarBackground>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xxl + SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  avatarEmoji: {
    fontSize: 44,
  },
  name: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '800',
  },
  birthDate: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  streak: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  card: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
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
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  signDesc: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  premiumBtn: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  premiumText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
  resetBtn: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  resetText: {
    color: COLORS.textDim,
    fontSize: 13,
  },
});
