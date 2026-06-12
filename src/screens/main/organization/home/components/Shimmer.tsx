import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Shimmer animation timing — declared so it's tweakable in one place ──────
const SHIMMER_DURATION = 1100;
const SHIMMER_BG_COLOR = 'rgba(255,255,255,0.04)';
const SHIMMER_HIGHLIGHT_COLOR = 'rgba(255,255,255,0.08)';

type ShimmerBlockProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export const ShimmerBlock = ({
  width = '100%',
  height = 16,
  borderRadius = 6,
  style,
}: ShimmerBlockProps) => {
  const translateX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: SHIMMER_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateXInterpolated = translateX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-150, 150],
  });

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: SHIMMER_BG_COLOR,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { transform: [{ translateX: translateXInterpolated }] },
        ]}
      >
        <LinearGradient
          colors={['transparent', SHIMMER_HIGHLIGHT_COLOR, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 150, height: '100%' }}
        />
      </Animated.View>
    </View>
  );
};