import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { Package } from '../hooks/usePremium';

interface Props {
  pkg: Package;
  onPress: (pkg: Package) => void;
  loading?: boolean;
}

const PACKAGE_ICONS: Record<string, string> = {
  starter: '✨',
  monthly: '🌙',
  yearly: '⭐',
  special: '🔮',
};

const PACKAGE_COLORS: Record<string, [string, string]> = {
  starter: ['#2D1A55', '#1A0035'],
  monthly: ['#4A1A7B', '#2D0055'],
  yearly: ['#7B4A00', '#4A2800'],
  special: ['#4A0035', '#2D001A'],
};

export default function PackageCard({ pkg, onPress, loading }: Props) {
  const icon = PACKAGE_ICONS[pkg.id] || '🌟';
  const colors = PACKAGE_COLORS[pkg.id] || ['#2D1A55', '#1A0035'];

  return (
    <TouchableOpacity
      onPress={() => onPress(pkg)}
      activeOpacity={0.85}
      disabled={loading}
      style={[styles.wrapper, pkg.popular && styles.popularWrapper]}
    >
      {pkg.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>En Popüler 🔥</Text>
        </View>
      )}
      <LinearGradient
        colors={colors as any}
        style={[styles.card, pkg.popular && styles.popularCard]}
      >
        <View style={styles.left}>
          <Text style={styles.icon}>{icon}</Text>
          <View>
            <Text style={styles.name}>{pkg.name}</Text>
            <Text style={styles.description}>{pkg.description}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.price}>₺{pkg.price_tl}</Text>
          <Text style={styles.questions}>
            {pkg.questions >= 999 ? 'Sınırsız' : `${pkg.questions} soru`}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  popularWrapper: {
    marginTop: SPACING.lg,
    ...SHADOWS.glow,
  },
  popularBadge: {
    position: 'absolute',
    top: -14,
    left: SPACING.lg,
    zIndex: 10,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  popularBadgeText: {
    color: COLORS.background,
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  popularCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  icon: {
    fontSize: 28,
  },
  name: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  right: {
    alignItems: 'flex-end',
  },
  price: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  questions: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
