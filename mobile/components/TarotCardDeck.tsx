import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.xl * 2 - SPACING.md * 2) / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.75;

interface TarotCard {
  position: string;
  card_name: string;
  reversed: boolean;
  meaning: string;
  keywords: string[];
}

interface Props {
  cards: TarotCard[];
  onCardPress?: (card: TarotCard) => void;
}

function FlipCard({ card, delay, onPress }: { card: TarotCard; delay: number; onPress: () => void }) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const rotation = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  const flip = () => {
    if (flipped) {
      onPress();
      return;
    }
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setFlipped(true);
      setRevealed(true);
    });
  };

  const SYMBOLS = ['🌟', '🔮', '✨', '🌙', '⭐', '🌸', '🪐', '💫', '🌺'];
  const symbol = SYMBOLS[Math.abs(card.card_name.charCodeAt(0)) % SYMBOLS.length];

  return (
    <TouchableOpacity onPress={flip} activeOpacity={0.9}>
      <Animated.View style={[styles.cardWrapper, { transform: [{ rotateY: rotation }] }]}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: frontOpacity }]}>
          <LinearGradient
            colors={['#2D1A55', '#1A0035', '#0A0014']}
            style={styles.cardBack}
          >
            <Text style={styles.cardBackSymbol}>🔮</Text>
            <Text style={styles.cardBackText}>{card.position}</Text>
          </LinearGradient>
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: backOpacity, transform: [{ rotateY: '180deg' }] }]}>
          <LinearGradient
            colors={['#C9A84C', '#7B2FBE', '#0A0014']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardFront}
          >
            <Text style={styles.cardSymbol}>{symbol}</Text>
            <Text style={styles.cardName} numberOfLines={2}>{card.card_name.split('–')[0]}</Text>
            {card.reversed && <Text style={styles.reversedBadge}>↕ Ters</Text>}
          </LinearGradient>
        </Animated.View>
      </Animated.View>
      <Text style={styles.positionLabel}>{card.position}</Text>
    </TouchableOpacity>
  );
}

export default function TarotCardDeck({ cards, onCardPress }: Props) {
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  return (
    <View>
      <View style={styles.deckRow}>
        {cards.map((card, i) => (
          <FlipCard
            key={i}
            card={card}
            delay={i * 300}
            onPress={() => {
              setSelectedCard(card);
              onCardPress?.(card);
            }}
          />
        ))}
      </View>
      {selectedCard && (
        <TouchableOpacity
          style={styles.detailBox}
          onPress={() => setSelectedCard(null)}
          activeOpacity={0.9}
        >
          <LinearGradient colors={['#1A0035', '#0A0014']} style={styles.detailInner}>
            <Text style={styles.detailTitle}>{selectedCard.card_name}</Text>
            <Text style={styles.detailPosition}>{selectedCard.position} {selectedCard.reversed ? '· Ters' : ''}</Text>
            <Text style={styles.detailMeaning}>{selectedCard.meaning}</Text>
            <View style={styles.keywords}>
              {selectedCard.keywords?.map((kw, i) => (
                <View key={i} style={styles.keyword}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  deckRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardBack: {
    flex: 1,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  cardBackSymbol: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  cardBackText: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  cardFront: {
    flex: 1,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  cardSymbol: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  cardName: {
    color: COLORS.white,
    fontSize: 9,
    textAlign: 'center',
    fontWeight: '600',
  },
  reversedBadge: {
    color: COLORS.accent,
    fontSize: 8,
    marginTop: 2,
  },
  positionLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  detailBox: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  detailInner: {
    padding: SPACING.md,
  },
  detailTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailPosition: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: SPACING.sm,
  },
  detailMeaning: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  keyword: {
    backgroundColor: COLORS.secondary + '44',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  keywordText: {
    color: COLORS.text,
    fontSize: 11,
  },
});
