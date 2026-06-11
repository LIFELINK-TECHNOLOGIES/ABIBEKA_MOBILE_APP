import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { useEntrance, useFloat, usePulse, useRotate } from "../hooks/animation";
import { Particle } from "./design";
import { ILLUSTRATION_SIZE, styles } from "../style";

interface IllustrationProps {
  accent: string;
  active: boolean;
}

// ─── Shared ring wrapper ───────────────────────────────────────────────────────

const IllustrationBase = ({
  accent,
  active,
  floatDistance,
  floatDuration,
  floatDelay,
  rotateDuration,
  children,
  particles,
}: IllustrationProps & {
  floatDistance: number;
  floatDuration: number;
  floatDelay: number;
  rotateDuration: number;
  children: React.ReactNode;
  particles: React.ReactNode;
}) => {
  const floatY = useFloat(floatDistance, floatDuration, floatDelay);
  const entrance = useEntrance(active, 100);
  const rotate = useRotate(rotateDuration);

  return (
    <View style={[styles.illustrationWrap, { backgroundColor: accent + "12" }]}>
      <Animated.View
        style={[
          styles.ringOuter,
          { borderColor: accent + "25", transform: [{ rotate }] },
        ]}
      />
      <Animated.View
        style={[
          styles.illustrationCircleOuter,
          {
            borderColor: accent + "35",
            opacity: entrance,
            transform: [
              {
                scale: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
              { translateY: floatY },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
      {particles}
    </View>
  );
};

// ─── Heart ────────────────────────────────────────────────────────────────────

export const IllustrationHeart = ({ accent, active }: IllustrationProps) => {
  const pulse = usePulse();

  return (
    <IllustrationBase
      accent={accent}
      active={active}
      floatDistance={8}
      floatDuration={2200}
      floatDelay={0}
      rotateDuration={12000}
      particles={
        <>
          <Particle
            accent={accent}
            size={14}
            top={ILLUSTRATION_SIZE * 0.08}
            left={ILLUSTRATION_SIZE * 0.72}
            delay={1}
            floatY={10}
            floatX={5}
            opacity={0.55}
          />
          <Particle
            accent={accent}
            size={9}
            top={ILLUSTRATION_SIZE * 0.18}
            left={ILLUSTRATION_SIZE * 0.1}
            delay={3}
            floatY={8}
            floatX={6}
            opacity={0.4}
          />
          <Particle
            accent={accent}
            size={18}
            top={ILLUSTRATION_SIZE * 0.7}
            left={ILLUSTRATION_SIZE * 0.78}
            delay={2}
            floatY={12}
            floatX={4}
            opacity={0.3}
          />
          <Particle
            accent={accent}
            size={7}
            top={ILLUSTRATION_SIZE * 0.75}
            left={ILLUSTRATION_SIZE * 0.15}
            delay={4}
            floatY={7}
            floatX={8}
            opacity={0.5}
          />
          <Particle
            accent={accent}
            size={11}
            top={ILLUSTRATION_SIZE * 0.45}
            left={ILLUSTRATION_SIZE * 0.88}
            delay={0}
            floatY={9}
            floatX={3}
            opacity={0.35}
          />
        </>
      }
    >
      <Animated.View
        style={[
          styles.illustrationCircleInner,
          { backgroundColor: accent + "20", transform: [{ scale: pulse }] },
        ]}
      >
        <View style={styles.heartContainer}>
          <View style={[styles.heartLeft, { backgroundColor: accent }]} />
          <View style={[styles.heartRight, { backgroundColor: accent }]} />
          <View style={[styles.heartBottom, { backgroundColor: accent }]} />
        </View>
      </Animated.View>
    </IllustrationBase>
  );
};

// ─── AI ───────────────────────────────────────────────────────────────────────

export const IllustrationAI = ({ accent, active }: IllustrationProps) => {
  const blink = useRef(new Animated.Value(1)).current;
  const line0 = useRef(new Animated.Value(0)).current;
  const line1 = useRef(new Animated.Value(0)).current;
  const line2 = useRef(new Animated.Value(0)).current;
  const lineAnims = [line0, line1, line2];

  useEffect(() => {
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(2500),
        Animated.timing(blink, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.delay(200),
        Animated.timing(blink, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
    );
    blinkLoop.start();
    return () => blinkLoop.stop();
  }, []);

  useEffect(() => {
    lineAnims.forEach((a, i) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300 + 600),
          Animated.timing(a, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(1200),
          Animated.timing(a, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.delay(800),
        ]),
      );
      loop.start();
    });
  }, []);

  return (
    <IllustrationBase
      accent={accent}
      active={active}
      floatDistance={7}
      floatDuration={2600}
      floatDelay={200}
      rotateDuration={15000}
      particles={
        <>
          <Particle
            accent={accent}
            size={12}
            top={ILLUSTRATION_SIZE * 0.1}
            left={ILLUSTRATION_SIZE * 0.75}
            delay={2}
            floatY={9}
            floatX={5}
            opacity={0.5}
          />
          <Particle
            accent={accent}
            size={8}
            top={ILLUSTRATION_SIZE * 0.22}
            left={ILLUSTRATION_SIZE * 0.08}
            delay={4}
            floatY={7}
            floatX={7}
            opacity={0.4}
          />
          <Particle
            accent={accent}
            size={16}
            top={ILLUSTRATION_SIZE * 0.72}
            left={ILLUSTRATION_SIZE * 0.8}
            delay={1}
            floatY={11}
            floatX={4}
            opacity={0.3}
          />
          <Particle
            accent={accent}
            size={10}
            top={ILLUSTRATION_SIZE * 0.78}
            left={ILLUSTRATION_SIZE * 0.12}
            delay={3}
            floatY={8}
            floatX={6}
            opacity={0.45}
          />
        </>
      }
    >
      <View
        style={[
          styles.illustrationCircleInner,
          { backgroundColor: accent + "20" },
        ]}
      >
        <View style={styles.aiContainer}>
          <View style={[styles.aiHead, { borderColor: accent }]}>
            <Animated.View
              style={[
                styles.aiEye,
                { backgroundColor: accent, transform: [{ scaleY: blink }] },
              ]}
            />
            <Animated.View
              style={[
                styles.aiEye,
                { backgroundColor: accent, transform: [{ scaleY: blink }] },
              ]}
            />
          </View>
          <View style={styles.aiLines}>
            {lineAnims.map((a, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.aiLine,
                  {
                    backgroundColor: accent,
                    width: i === 1 ? 28 : 20,
                    opacity: a.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                    transform: [
                      {
                        scaleX: a.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </IllustrationBase>
  );
};

// ─── Chart ────────────────────────────────────────────────────────────────────

const BAR_HEIGHTS = [40, 65, 50, 80, 60];

export const IllustrationChart = ({ accent, active }: IllustrationProps) => {
  const bar0 = useRef(new Animated.Value(0)).current;
  const bar1 = useRef(new Animated.Value(0)).current;
  const bar2 = useRef(new Animated.Value(0)).current;
  const bar3 = useRef(new Animated.Value(0)).current;
  const bar4 = useRef(new Animated.Value(0)).current;
  const barAnims = [bar0, bar1, bar2, bar3, bar4];

  useEffect(() => {
    if (active) {
      barAnims.forEach((a, i) => {
        a.setValue(0);
        Animated.spring(a, {
          toValue: 1,
          delay: 200 + i * 100,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [active]);

  return (
    <IllustrationBase
      accent={accent}
      active={active}
      floatDistance={6}
      floatDuration={3000}
      floatDelay={100}
      rotateDuration={18000}
      particles={
        <>
          <Particle
            accent={accent}
            size={13}
            top={ILLUSTRATION_SIZE * 0.09}
            left={ILLUSTRATION_SIZE * 0.73}
            delay={2}
            floatY={9}
            floatX={4}
            opacity={0.5}
          />
          <Particle
            accent={accent}
            size={8}
            top={ILLUSTRATION_SIZE * 0.2}
            left={ILLUSTRATION_SIZE * 0.09}
            delay={4}
            floatY={8}
            floatX={6}
            opacity={0.4}
          />
          <Particle
            accent={accent}
            size={17}
            top={ILLUSTRATION_SIZE * 0.71}
            left={ILLUSTRATION_SIZE * 0.79}
            delay={1}
            floatY={10}
            floatX={5}
            opacity={0.3}
          />
          <Particle
            accent={accent}
            size={9}
            top={ILLUSTRATION_SIZE * 0.77}
            left={ILLUSTRATION_SIZE * 0.13}
            delay={3}
            floatY={7}
            floatX={7}
            opacity={0.45}
          />
        </>
      }
    >
      <View
        style={[
          styles.illustrationCircleInner,
          { backgroundColor: accent + "20" },
        ]}
      >
        <View style={styles.chartContainer}>
          {BAR_HEIGHTS.map((h, i) => (
            <Animated.View
              key={i}
              style={[
                styles.chartBar,
                {
                  height: h * 0.7,
                  backgroundColor: i === 3 ? accent : accent + "55",
                  transform: [
                    {
                      scaleY: barAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </IllustrationBase>
  );
};

// ─── Shield ───────────────────────────────────────────────────────────────────

export const IllustrationShield = ({ accent, active }: IllustrationProps) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <IllustrationBase
      accent={accent}
      active={active}
      floatDistance={8}
      floatDuration={2500}
      floatDelay={300}
      rotateDuration={20000}
      particles={
        <>
          <Particle
            accent={accent}
            size={14}
            top={ILLUSTRATION_SIZE * 0.08}
            left={ILLUSTRATION_SIZE * 0.72}
            delay={1}
            floatY={10}
            floatX={5}
            opacity={0.55}
          />
          <Particle
            accent={accent}
            size={9}
            top={ILLUSTRATION_SIZE * 0.18}
            left={ILLUSTRATION_SIZE * 0.1}
            delay={3}
            floatY={8}
            floatX={6}
            opacity={0.4}
          />
          <Particle
            accent={accent}
            size={18}
            top={ILLUSTRATION_SIZE * 0.7}
            left={ILLUSTRATION_SIZE * 0.78}
            delay={2}
            floatY={12}
            floatX={4}
            opacity={0.3}
          />
          <Particle
            accent={accent}
            size={7}
            top={ILLUSTRATION_SIZE * 0.75}
            left={ILLUSTRATION_SIZE * 0.15}
            delay={4}
            floatY={7}
            floatX={8}
            opacity={0.5}
          />
        </>
      }
    >
      <Animated.View
        style={[
          styles.illustrationCircleInner,
          {
            backgroundColor: accent + "20",
            transform: [
              {
                scale: shimmer.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.04],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.shieldBody, { borderColor: accent }]}>
          <View style={[styles.shieldCheck, { borderColor: accent }]} />
        </View>
      </Animated.View>
    </IllustrationBase>
  );
};
