import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Pressable,
  StatusBar,
  View,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import Btn from "../../../components/basics/btn";
import Text from "../../../components/basics/txt";
import { SLIDES } from "../../../constant/onboardingData";
import { SlideContent } from "./components/slides";
import { styles, width } from "./style";
import { useAuthStore } from "../../../store/authStore";

interface OnboardingScreenProps {
  onFinish?: () => void;
  onLogin?: () => void;
}

export default function OnboardingScreen({
  onFinish,
  onLogin,
}: OnboardingScreenProps) {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  const isLast = activeIndex === SLIDES.length - 1;
  const activeSlide = SLIDES[activeIndex];

  // ─── Mount entrance ─────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 60,
        friction: 12,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.spring(footerAnim, {
        toValue: 1,
        tension: 60,
        friction: 12,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ─── Background color transition ────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: activeIndex,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [activeIndex]);

  const bgColor = bgAnim.interpolate({
    inputRange: SLIDES.map((_, i) => i),
    outputRange: SLIDES.map((s) => s.bgAccent),
  });

  const accentColor = bgAnim.interpolate({
    inputRange: SLIDES.map((_, i) => i),
    outputRange: SLIDES.map((s) => s.accent),
  });

  // ─── Viewability ────────────────────────────────────────────────────────────
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index!);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  //isOnboarded variable
  const setIsOnboarded = useAuthStore((state) => state.setIsOnboarded);

  // ─── Button press ───────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    Animated.sequence([
      Animated.spring(btnScale, {
        toValue: 0.95,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(btnScale, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isLast) {
        setIsOnboarded(true);
        return;
      }
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    });
  }, [isLast, activeIndex]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Animated.View style={[styles.safe, { backgroundColor: bgColor }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.logoRow}>
            <Animated.View
              style={[styles.logoDot, { backgroundColor: accentColor }]}
            />
            <Text variant="bold" size="lg" color="textPrimary" tracking={-0.5}>
              Abibeka
            </Text>
          </View>
          {!isLast && (
            <Pressable onPress={onFinish} hitSlop={12}>
              <Text size="sm" variant="medium" color="textTertiary">
                Skip
              </Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Slides */}
        <Animated.FlatList
          ref={flatListRef}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item, index }) => (
            <SlideContent item={item} active={index === activeIndex} />
          )}
        />

        {/* Footer */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: footerAnim,
              transform: [
                {
                  translateY: footerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 28, 8],
                extrapolate: "clamp",
              });
              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.25, 1, 0.25],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity: dotOpacity,
                      backgroundColor: accentColor,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <Btn
                label={isLast ? "Get Started" : "Continue"}
                size="lg"
                fullWidth
                onPress={goNext}
                bgColor={activeSlide.accent}
                borderRadius={14}
              />
            </Animated.View>

            {isLast && (
              <Pressable onPress={onLogin} style={styles.loginRow} hitSlop={8}>
                <Text size="sm" variant="regular" color="textSecondary">
                  Already have an account?{" "}
                </Text>
                <Text size="sm" variant="semibold" color="brandPrimary">
                  Sign up
                </Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  );
}
