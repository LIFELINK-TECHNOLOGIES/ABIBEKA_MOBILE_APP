import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import Text from "../../../../components/basics/txt";
import {
  IllustrationAI,
  IllustrationChart,
  IllustrationHeart,
  IllustrationShield,
} from "./illustration";
import { SlideItem } from "../../../../constant/onboardingData";
import { styles, width } from "../style";

interface SlideContentProps {
  item: SlideItem;
  active: boolean;
}

const renderIllustration = (item: SlideItem, active: boolean) => {
  switch (item.id) {
    case "1":
      return <IllustrationHeart accent={item.accent} active={active} />;
    case "2":
      return <IllustrationAI accent={item.accent} active={active} />;
    case "3":
      return <IllustrationChart accent={item.accent} active={active} />;
    default:
      return <IllustrationShield accent={item.accent} active={active} />;
  }
};

export const SlideContent = ({ item, active }: SlideContentProps) => {
  const eyebrowAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      eyebrowAnim.setValue(0);
      titleAnim.setValue(0);
      subtitleAnim.setValue(0);
      Animated.stagger(90, [
        Animated.spring(eyebrowAnim, {
          toValue: 1,
          tension: 70,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.spring(titleAnim, {
          toValue: 1,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleAnim, {
          toValue: 1,
          tension: 60,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(eyebrowAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(titleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active]);

  const makeStyle = (anim: Animated.Value, offsetY = 24) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [offsetY, 0],
        }),
      },
    ],
  });

  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.illustrationContainer}>
        {renderIllustration(item, active)}
      </View>

      <View style={styles.textBlock}>
        <Animated.View style={makeStyle(eyebrowAnim, 16)}>
          <Text
            size="xs"
            variant="bold"
            color="textTertiary"
            transform="uppercase"
            tracking={2}
            style={{ marginBottom: 12 }}
          >
            {item.eyebrow}
          </Text>
        </Animated.View>

        <Animated.View style={makeStyle(titleAnim, 20)}>
          <Text
            variant="bold"
            size="3xl"
            color="textPrimary"
            tracking={-0.8}
            style={{ marginBottom: 16, lineHeight: 40 }}
          >
            {item.title}
          </Text>
        </Animated.View>

        <Animated.View style={makeStyle(subtitleAnim, 18)}>
          <Text
            size="md"
            variant="regular"
            color="textSecondary"
            style={{ lineHeight: 26 }}
          >
            {item.subtitle}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};
