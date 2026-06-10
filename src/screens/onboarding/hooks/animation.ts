import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export const useEntrance = (trigger: boolean, delay = 0) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (trigger) {
      anim.setValue(0);
      Animated.spring(anim, {
        toValue: 1,
        delay,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [trigger, delay]);
  return anim;
};

export const usePulse = () => {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1.08,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return anim;
};

export const useFloat = (distance = 10, duration = 2400, delay = 0) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: -distance,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: distance,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return anim;
};

export const useRotate = (duration = 8000) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
};
