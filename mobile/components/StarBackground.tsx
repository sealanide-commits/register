import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: Animated.Value;
  duration: number;
}

export default function StarBackground({ children }: { children?: React.ReactNode }) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      opacity: new Animated.Value(Math.random()),
      duration: Math.random() * 3000 + 2000,
    }));
  }, []);

  useEffect(() => {
    stars.forEach((star) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.8 + 0.2,
            duration: star.duration,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3,
            duration: star.duration,
            useNativeDriver: true,
          }),
        ]).start(animate);
      };
      animate();
    });
  }, [stars]);

  return (
    <View style={styles.container}>
      <View style={styles.bg} />
      {stars.map((star, i) => (
        <Animated.View
          key={i}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#E8E0FF',
  },
});
