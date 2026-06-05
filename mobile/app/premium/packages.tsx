import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import StarBackground from '../../components/StarBackground';
import PackageCard from '../../components/PackageCard';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { usePremium } from '../../hooks/usePremium';

const TESTIMONIALS = [
  { name: 'Ayşe K.', text: '"Kariyer sorunum için aldığım okuma inanılmazdı. 3 ay içinde terfi aldım!" ⭐⭐⭐⭐⭐' },
  { name: 'Mehmet Y.', text: '"Aşk hayatım hakkındaki öngörüler birebir çıktı. Artık her hafta soruyorum." ⭐⭐⭐⭐⭐' },
  { name: 'Zeynep A.', text: '"Numeroloji analizim çok doğru çıktı. Kendimi çok daha iyi tanıdım." ⭐⭐⭐⭐⭐' },
];

export default function PackagesScreen() {
  const { packages, loading, purchasing, loadPackages, purchase } = usePremium();
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    loadPackages();
    const interval = setInterval(() => {
      setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StarBackground>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.emoji}>⭐</Text>
          <Text style={styles.title}>Premium'a Geç</Text>
          <Text style={styles.subtitle}>
            Evrenin rehberliğine tam erişim için paket seç.
          </Text>
        </View>

        <LinearGradient
          colors={['#2D1A55', '#1A0035']}
          style={[styles.featureBox, SHADOWS.purpleGlow]}
        >
          <Text style={styles.featureTitle}>Premium'la Ne Kazanırsın?</Text>
          {[
            '🔮 AI ile derin, kişisel okumalar',
            '⭐ Günlük astroloji + tarot',
            '✋ Avuç izi + yüz aura analizi',
            '📊 Tam numeroloji raporu',
            '🔔 Kişisel kozmik bildirimler',
          ].map((f, i) => (
            <Text key={i} style={styles.feature}>{f}</Text>
          ))}
        </LinearGradient>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="large" />
        ) : (
          <View style={styles.packages}>
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onPress={purchase}
                loading={purchasing}
              />
            ))}
          </View>
        )}

        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>{TESTIMONIALS[testimonialIdx].text}</Text>
          <Text style={styles.testimonialName}>— {TESTIMONIALS[testimonialIdx].name}</Text>
        </View>

        <View style={styles.trustBadges}>
          <Text style={styles.trustBadge}>🔒 Güvenli Ödeme</Text>
          <Text style={styles.trustBadge}>✅ Anında Aktif</Text>
          <Text style={styles.trustBadge}>↩️ İade Garantisi</Text>
        </View>

        <Text style={styles.legal}>
          Ödeme işlemleri App Store / Google Play üzerinden güvenli şekilde gerçekleştirilir.
          Abonelikler otomatik yenilenir, istediğiniz zaman iptal edebilirsiniz.
        </Text>
      </ScrollView>
    </StarBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  back: {
    marginBottom: SPACING.sm,
  },
  backText: {
    color: COLORS.textMuted,
    fontSize: 15,
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
    fontSize: 26,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  featureBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    gap: SPACING.xs,
  },
  featureTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  feature: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 24,
  },
  packages: {
    gap: SPACING.xs,
    paddingTop: SPACING.md,
  },
  testimonial: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  testimonialText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: SPACING.xs,
  },
  testimonialName: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trustBadge: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  legal: {
    color: COLORS.textDim,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
  },
});
