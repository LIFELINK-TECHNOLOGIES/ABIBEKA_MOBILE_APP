import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useFloat } from "../hooks/animation";

interface ParticleProps {
  accent: string;
  size: number;
  top: number;
  left: number;
  delay: number;
  floatY: number;
  floatX: number;
  opacity: number;
}

export const Particle = ({
  accent,
  size,
  top,
  left,
  delay,
  floatY,
  floatX,
  opacity,
}: ParticleProps) => {
  const y = useFloat(floatY, 2800 + delay * 200, delay * 100);
  const x = useFloat(floatX, 3200 + delay * 150, delay * 80);
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(mountAnim, {
      toValue: 1,
      duration: 600,
      delay: 200 + delay * 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: accent,
        opacity: mountAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, opacity],
        }),
        transform: [{ translateY: y }, { translateX: x }],
      }}
    />
  );
};
