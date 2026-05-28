import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

const { width: W, height: H } = Dimensions.get("window");

// ─── Theme ────────────────────────────────────────────────────────────────────

export const MECH = {
  base: "#03060F",
  surface: "#060C1A",
  blue: "#00AAFF",
  blueDim: "#0066BB",
  blueFaint: "#003366",
  blueGlow: "#00AAFF18",
  blueDeep: "#001A33",
  white: "#E8F4FF",
  grey: "#1A2840",
  greyMid: "#243352",
  greyText: "rgba(0,170,255,0.45)",
  danger: "#FF3A3A",
  ok: "#00FF9F",
};

// ─── Seeded random ────────────────────────────────────────────────────────────

const sr = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

// ─── 1. Breathing dot grid ────────────────────────────────────────────────────

const DOT_SPACING = 28;
const COLS = Math.ceil(W / DOT_SPACING) + 1;
const ROWS = Math.ceil(H / DOT_SPACING) + 1;

const DotGrid = () => {
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.28],
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { opacity }]}
      pointerEvents="none"
    >
      <Svg width={W} height={H}>
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => (
            <Circle
              key={`d-${r}-${c}`}
              cx={c * DOT_SPACING}
              cy={r * DOT_SPACING}
              r={0.9}
              fill={MECH.blue}
            />
          )),
        )}
      </Svg>
    </Animated.View>
  );
};

// ─── 2. Data stream ───────────────────────────────────────────────────────────

const HEX_CHARS = "0123456789ABCDEF";
const BIN_CHARS = "01";
const rand8 = sr(7);

const makeStream = (len: number, hex: boolean) =>
  Array.from({ length: len }, () => {
    const pool = hex ? HEX_CHARS : BIN_CHARS;
    return pool[Math.floor(rand8() * pool.length)];
  });

interface StreamProps {
  x: number;
  charCount?: number;
  hex?: boolean;
  speed?: number;
  delay?: number;
  side: "left" | "right";
}

const DataStream = ({
  x,
  charCount = 32,
  hex = true,
  speed = 18000,
  delay = 0,
  side,
}: StreamProps) => {
  const translateY = useRef(new Animated.Value(-H * 0.6)).current;
  const chars = makeStream(charCount, hex);

  useEffect(() => {
    const run = () => {
      translateY.setValue(-H * 0.6);
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: H * 0.1,
          duration: speed,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => setTimeout(run, 800 + delay * 0.4));
    };
    run();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: x,
        top: 0,
        transform: [{ translateY }],
      }}
    >
      {chars.map((ch, i) => (
        <Text
          key={i}
          style={{
            fontSize: 9,
            fontFamily: "Courier New",
            color: MECH.blue,
            opacity: Math.max(0.08, 0.55 - i * 0.015),
            lineHeight: 14,
            letterSpacing: 1,
            textAlign: "center",
            width: 14,
          }}
        >
          {ch}
        </Text>
      ))}
    </Animated.View>
  );
};

const DataStreams = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Left cluster */}
    <DataStream x={6} hex speed={16000} delay={0} charCount={34} side="left" />
    <DataStream
      x={22}
      hex={false}
      speed={20000}
      delay={3000}
      charCount={28}
      side="left"
    />
    <DataStream
      x={36}
      hex
      speed={24000}
      delay={7000}
      charCount={40}
      side="left"
    />
    {/* Right cluster */}
    <DataStream
      x={W - 18}
      hex
      speed={17000}
      delay={1500}
      charCount={36}
      side="right"
    />
    <DataStream
      x={W - 32}
      hex={false}
      speed={21000}
      delay={5000}
      charCount={30}
      side="right"
    />
    <DataStream
      x={W - 46}
      hex
      speed={14000}
      delay={9000}
      charCount={26}
      side="right"
    />
  </View>
);

// ─── 3. Targeting reticle ─────────────────────────────────────────────────────

interface ReticleProps {
  cx?: number;
  cy?: number;
  size?: number;
}

const Reticle = ({ cx = W / 2, cy = H * 0.36, size = 180 }: ReticleProps) => {
  const rotate = useRef(new Animated.Value(0)).current;
  const rotateRev = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.6)).current;
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 16000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    Animated.loop(
      Animated.timing(rotateRev, {
        toValue: -1,
        duration: 22000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
    // Blink lock indicator
    Animated.loop(
      Animated.sequence([
        Animated.delay(4000),
        Animated.timing(blink, {
          toValue: 0.1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 0.1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const rot = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const rotRev = rotateRev.interpolate({
    inputRange: [-1, 0],
    outputRange: ["-360deg", "0deg"],
  });

  const r1 = size / 2;
  const r2 = size * 0.38;
  const r3 = size * 0.22;
  const gap = 28; // gap in circle arcs (degrees)

  // Arc path helper — draws a circle with 4 gaps (one per quadrant corner)
  const arcPath = (r: number, gapDeg: number, cx2: number, cy2: number) => {
    const segs: string[] = [];
    const segCount = 4;
    const segSpan = 90 - gapDeg;
    for (let i = 0; i < segCount; i++) {
      const startDeg = i * 90 + gapDeg / 2;
      const endDeg = startDeg + segSpan;
      const s = (startDeg * Math.PI) / 180;
      const e = (endDeg * Math.PI) / 180;
      const x1 = cx2 + r * Math.cos(s);
      const y1 = cy2 + r * Math.sin(s);
      const x2 = cx2 + r * Math.cos(e);
      const y2 = cy2 + r * Math.sin(e);
      segs.push(`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`);
    }
    return segs.join(" ");
  };

  const svgSize = size + 60;
  const ox = (svgSize - size) / 2;
  const oy = (svgSize - size) / 2;
  const scx = svgSize / 2;
  const scy = svgSize / 2;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: cx - svgSize / 2,
        top: cy - svgSize / 2,
        width: svgSize,
        height: svgSize,
      }}
    >
      {/* Outer ring — slow rotate */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ rotate: rot }] }]}
      >
        <Svg width={svgSize} height={svgSize}>
          <Path
            d={arcPath(r1, 22, scx, scy)}
            stroke={MECH.blue}
            strokeWidth={1.2}
            fill="none"
            strokeOpacity={0.7}
          />
          {/* Tick marks on outer ring */}
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            const tickLen = i % 6 === 0 ? 10 : i % 3 === 0 ? 6 : 3;
            return (
              <Line
                key={`tick-${i}`}
                x1={scx + (r1 - 2) * Math.cos(a)}
                y1={scy + (r1 - 2) * Math.sin(a)}
                x2={scx + (r1 - 2 - tickLen) * Math.cos(a)}
                y2={scy + (r1 - 2 - tickLen) * Math.sin(a)}
                stroke={MECH.blue}
                strokeWidth={i % 6 === 0 ? 1.5 : 0.8}
                strokeOpacity={i % 6 === 0 ? 0.9 : 0.4}
              />
            );
          })}
        </Svg>
      </Animated.View>

      {/* Mid ring — counter-rotate */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ rotate: rotRev }] }]}
      >
        <Svg width={svgSize} height={svgSize}>
          <Path
            d={arcPath(r2, 30, scx, scy)}
            stroke={MECH.blue}
            strokeWidth={1}
            fill="none"
            strokeOpacity={0.5}
          />
          {/* Corner brackets on mid ring */}
          {[0, 90, 180, 270].map((deg) => {
            const a = (deg * Math.PI) / 180;
            const bx = scx + r2 * Math.cos(a);
            const by = scy + r2 * Math.sin(a);
            return (
              <Path
                key={`br-${deg}`}
                d={`M ${bx - 5 * Math.sin(a)} ${by + 5 * Math.cos(a)} L ${bx} ${by} L ${bx + 5 * Math.cos(a)} ${by + 5 * Math.sin(a)}`}
                stroke={MECH.blue}
                strokeWidth={1.5}
                fill="none"
                strokeOpacity={0.85}
              />
            );
          })}
        </Svg>
      </Animated.View>

      {/* Inner — static + pulse */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: pulse }]}>
        <Svg width={svgSize} height={svgSize}>
          {/* Crosshair lines */}
          <Line
            x1={scx - r3 - 8}
            y1={scy}
            x2={scx - 6}
            y2={scy}
            stroke={MECH.blue}
            strokeWidth={1}
            strokeOpacity={0.8}
          />
          <Line
            x1={scx + 6}
            y1={scy}
            x2={scx + r3 + 8}
            y2={scy}
            stroke={MECH.blue}
            strokeWidth={1}
            strokeOpacity={0.8}
          />
          <Line
            x1={scx}
            y1={scy - r3 - 8}
            x2={scx}
            y2={scy - 6}
            stroke={MECH.blue}
            strokeWidth={1}
            strokeOpacity={0.8}
          />
          <Line
            x1={scx}
            y1={scy + 6}
            x2={scx}
            y2={scy + r3 + 8}
            stroke={MECH.blue}
            strokeWidth={1}
            strokeOpacity={0.8}
          />
          {/* Center dot */}
          <Circle cx={scx} cy={scy} r={3} fill={MECH.blue} fillOpacity={0.9} />
          <Circle
            cx={scx}
            cy={scy}
            r={6}
            fill="none"
            stroke={MECH.blue}
            strokeWidth={0.8}
            strokeOpacity={0.5}
          />
        </Svg>
      </Animated.View>

      {/* Lock blink indicator */}
      <Animated.View
        style={{
          position: "absolute",
          top: scy - svgSize / 2 + svgSize * 0.12,
          left: scx - svgSize / 2 + svgSize * 0.62,
          opacity: blink,
        }}
      >
        <Text
          style={{
            fontSize: 7,
            color: MECH.blue,
            fontFamily: "Courier New",
            letterSpacing: 1,
          }}
        >
          LOCK
        </Text>
      </Animated.View>
    </View>
  );
};

// ─── 4. HUD corner brackets ───────────────────────────────────────────────────

interface CornerProps {
  position: "tl" | "tr" | "bl" | "br";
  size?: number;
}

const HudCorner = ({ position: pos, size = 28 }: CornerProps) => {
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const isTop = pos === "tl" || pos === "tr";
  const isLeft = pos === "tl" || pos === "bl";
  const margin = 16;

  const hLine = `M 0 0 L ${size} 0`;
  const vLine = `M 0 0 L 0 ${size}`;

  // SVG viewport always starts at 0,0; transforms handle corner placement
  const svgW = size + 2;
  const svgH = size + 2;

  const hPath = isLeft
    ? `M 1 1 L ${size} 1`
    : `M ${svgW - size} 1 L ${svgW - 1} 1`;
  const vPath = isTop
    ? `M ${isLeft ? 1 : svgW - 1} 1 L ${isLeft ? 1 : svgW - 1} ${size}`
    : `M ${isLeft ? 1 : svgW - 1} ${svgH - size} L ${isLeft ? 1 : svgW - 1} ${svgH - 1}`;

  const style: any = {
    position: "absolute",
    width: svgW,
    height: svgH,
  };
  if (isTop) style.top = margin;
  else style.bottom = margin;
  if (isLeft) style.left = margin;
  else style.right = margin;

  // Status dot
  const dotColor =
    pos === "tl" ? MECH.ok : pos === "tr" ? MECH.blue : MECH.greyText;

  return (
    <Animated.View style={[style, { opacity: pulse }]} pointerEvents="none">
      <Svg width={svgW} height={svgH}>
        <Path d={hPath} stroke={MECH.blue} strokeWidth={1.8} fill="none" />
        <Path d={vPath} stroke={MECH.blue} strokeWidth={1.8} fill="none" />
      </Svg>
      {/* Status dot */}
      {(pos === "tl" || pos === "tr") && (
        <View
          style={{
            position: "absolute",
            top: isTop ? size + 6 : undefined,
            bottom: !isTop ? size + 6 : undefined,
            left: isLeft ? 0 : undefined,
            right: !isLeft ? 0 : undefined,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: dotColor,
          }}
        />
      )}
    </Animated.View>
  );
};

// ─── 5. HUD status labels ─────────────────────────────────────────────────────

const HudLabels = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1800,
      delay: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}
      pointerEvents="none"
    >
      {/* Top left */}
      <View style={{ position: "absolute", top: 52, left: 18 }}>
        <Text style={styles.hudLabel}>SYS.VER 4.1.0</Text>
        <Text style={styles.hudLabel}>UNIT: LL-CORE</Text>
      </View>
      {/* Top right */}
      <View
        style={{
          position: "absolute",
          top: 52,
          right: 18,
          alignItems: "flex-end",
        }}
      >
        <Text style={styles.hudLabel}>NET: SECURE</Text>
        <Text style={styles.hudLabel}>ENC: AES-256</Text>
      </View>
      {/* Bottom left */}
      <View style={{ position: "absolute", bottom: 52, left: 18 }}>
        <Text style={styles.hudLabel}>LAT: 00.0000</Text>
        <Text style={styles.hudLabel}>LNG: 00.0000</Text>
      </View>
      {/* Bottom right */}
      <View
        style={{
          position: "absolute",
          bottom: 52,
          right: 18,
          alignItems: "flex-end",
        }}
      >
        <Text style={styles.hudLabel}>AUTH: PENDING</Text>
        <Text style={[styles.hudLabel, { color: MECH.ok + "99" }]}>
          CONN: ACTIVE
        </Text>
      </View>
    </Animated.View>
  );
};

// ─── 6. Scanline ──────────────────────────────────────────────────────────────

const Scanline = () => {
  const y = useRef(new Animated.Value(-4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(y, {
          toValue: H + 4,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(3500),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: W,
        height: 3,
        transform: [{ translateY: y }],
      }}
    >
      <Svg width={W} height={3}>
        <Defs>
          <SvgLinearGradient id="scan" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={MECH.blue} stopOpacity="0" />
            <Stop offset="15%" stopColor={MECH.blue} stopOpacity="0.15" />
            <Stop offset="50%" stopColor={MECH.blue} stopOpacity="0.55" />
            <Stop offset="85%" stopColor={MECH.blue} stopOpacity="0.15" />
            <Stop offset="100%" stopColor={MECH.blue} stopOpacity="0" />
          </SvgLinearGradient>
        </Defs>
        <Rect x={0} y={0} width={W} height={3} fill="url(#scan)" />
      </Svg>
    </Animated.View>
  );
};

// ─── 7. Range rings ───────────────────────────────────────────────────────────

const RangeRings = () => {
  const rings = [
    { r: W * 0.52, duration: 4000, delay: 0 },
    { r: W * 0.72, duration: 4000, delay: 1000 },
    { r: W * 0.92, duration: 4000, delay: 2000 },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {rings.map((ring, i) => {
        const anim = useRef(new Animated.Value(0)).current;
        useEffect(() => {
          const run = () => {
            anim.setValue(0);
            Animated.sequence([
              Animated.delay(ring.delay + i * 200),
              Animated.timing(anim, {
                toValue: 1,
                duration: ring.duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ]).start(() => setTimeout(run, 6000));
          };
          run();
        }, []);

        const opacity = anim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [0, 0.2, 0],
        });
        const scale = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1.1],
        });

        return (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              left: W / 2 - ring.r,
              top: H * 0.36 - ring.r,
              width: ring.r * 2,
              height: ring.r * 2,
              borderRadius: ring.r,
              borderWidth: 1,
              borderColor: MECH.blue,
              opacity,
              transform: [{ scale }],
            }}
          />
        );
      })}
    </View>
  );
};

// ─── 8. Center radial glow ────────────────────────────────────────────────────

const CenterGlow = () => {
  const glow = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0.5,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  const opacity = glow.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0.04, 0.12],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: W / 2 - W * 0.6,
        top: H * 0.36 - W * 0.6,
        width: W * 1.2,
        height: W * 1.2,
        borderRadius: W * 0.6,
        backgroundColor: MECH.blue,
        opacity,
      }}
    />
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────

interface MechBackgroundProps {
  children?: React.ReactNode;
  reticleCenter?: { x: number; y: number };
  reticleSize?: number;
  showDataStreams?: boolean;
  showLabels?: boolean;
}

export const MechBackground = ({
  children,
  reticleCenter,
  reticleSize = 180,
  showDataStreams = true,
  showLabels = true,
}: MechBackgroundProps) => {
  return (
    <View style={{ flex: 1, backgroundColor: MECH.base }}>
      {/* Subtle top dark gradient */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            background: "transparent",
          },
        ]}
      />

      <CenterGlow />
      <DotGrid />
      {showDataStreams && <DataStreams />}
      <Reticle
        cx={reticleCenter?.x ?? W / 2}
        cy={reticleCenter?.y ?? H * 0.36}
        size={reticleSize}
      />
      <RangeRings />
      <HudCorner position="tl" />
      <HudCorner position="tr" />
      <HudCorner position="bl" />
      <HudCorner position="br" />
      {showLabels && <HudLabels />}
      <Scanline />

      {/* Content on top */}
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  hudLabel: {
    fontSize: 8,
    fontFamily: "Courier New",
    color: MECH.greyText,
    letterSpacing: 1,
    lineHeight: 13,
    textTransform: "uppercase",
  },
});
