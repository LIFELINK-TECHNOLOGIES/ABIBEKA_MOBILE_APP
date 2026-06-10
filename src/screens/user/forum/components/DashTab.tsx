import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGrad,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import {
  B,
  DAY_LABELS,
  EMOTIONS_DIST,
  ORG,
  TOP_ISSUES,
  WEEKLY_MOOD,
} from "../constants/constant";

const { width: W } = Dimensions.get("window");

// ─── Smooth line chart ────────────────────────────────────────────────────────
const WellnessChart = () => {
  const CW = W - 72,
    CH = 100,
    PAD = 16;
  const stepX = (CW - PAD * 2) / (WEEKLY_MOOD.length - 1);
  const pts = WEEKLY_MOOD.map((v, i) => ({
    x: PAD + i * stepX,
    y: PAD + ((100 - v) / 100) * (CH - PAD * 2),
    v,
  }));
  const line = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const pr = pts[i - 1];
      return `C ${(pr.x + p.x) / 2} ${pr.y} ${(pr.x + p.x) / 2} ${p.y} ${p.x} ${p.y}`;
    })
    .join(" ");
  const area = line + ` L ${pts[pts.length - 1].x} ${CH} L ${pts[0].x} ${CH} Z`;

  return (
    <View>
      <Svg width={CW} height={CH}>
        <Defs>
          <SvgGrad id="wg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={B.primary} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={B.primary} stopOpacity="0" />
          </SvgGrad>
        </Defs>
        <Path d={area} fill="url(#wg)" />
        <Path
          d={line}
          fill="none"
          stroke={B.primary}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        {pts.map((p, i) => (
          <React.Fragment key={i}>
            <Circle cx={p.x} cy={p.y} r={5} fill={B.card} />
            <Circle
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={p.v >= 60 ? B.accent : p.v >= 50 ? B.amber : B.red}
            />
          </React.Fragment>
        ))}
      </Svg>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: PAD,
          marginTop: 6,
        }}
      >
        {DAY_LABELS.map((d, i) => (
          <Text
            key={i}
            style={{
              fontSize: 10,
              color: B.muted2,
              textAlign: "center",
              flex: 1,
            }}
          >
            {d}
          </Text>
        ))}
      </View>
    </View>
  );
};

// ─── Emotion donut ────────────────────────────────────────────────────────────
const EmotionWheel = () => {
  const SIZE = 130,
    CX = 65,
    CY = 65,
    R = 44,
    SW = 16;
  let cum = 0;
  const arcs = EMOTIONS_DIST.map((e) => {
    const pct = e.pct / 100;
    const s = cum * 2 * Math.PI - Math.PI / 2;
    const en = (cum + pct) * 2 * Math.PI - Math.PI / 2;
    cum += pct;
    const x1 = CX + R * Math.cos(s),
      y1 = CY + R * Math.sin(s);
    const x2 = CX + R * Math.cos(en),
      y2 = CY + R * Math.sin(en);
    return {
      ...e,
      d: `M ${x1} ${y1} A ${R} ${R} 0 ${pct > 0.5 ? 1 : 0} 1 ${x2} ${y2}`,
    };
  });

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={SW + 2}
        />
        {arcs.map((a, i) => (
          <Path
            key={i}
            d={a.d}
            fill="none"
            stroke={a.color}
            strokeWidth={SW}
            strokeLinecap="butt"
          />
        ))}
        <Circle cx={CX} cy={CY} r={R - SW / 2 - 4} fill={B.card} />
        <SvgText
          x={CX}
          y={CY - 4}
          textAnchor="middle"
          fill={B.text}
          fontSize={20}
          fontWeight="800"
        >
          34%
        </SvgText>
        <SvgText
          x={CX}
          y={CY + 14}
          textAnchor="middle"
          fill={B.muted}
          fontSize={10}
        >
          Stressed
        </SvgText>
      </Svg>
      <View style={{ flex: 1, gap: 10 }}>
        {EMOTIONS_DIST.map((e, i) => (
          <View
            key={i}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: e.color,
              }}
            />
            <Text style={{ fontSize: 12, color: B.muted, flex: 1 }}>
              {e.label}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "700", color: e.color }}>
              {e.pct}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── Animated issues bars ─────────────────────────────────────────────────────
const IssuesList = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const anims = TOP_ISSUES.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    anims.forEach((a, i) =>
      Animated.timing(a, {
        toValue: 1,
        duration: 700,
        delay: i * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(),
    );
  }, []);

  return (
    <View style={{ gap: 14 }}>
      {TOP_ISSUES.map((issue, i) => {
        const w = anims[i].interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", `${issue.pct}%`],
        });
        const c =
          issue.pct >= 70 ? B.red : issue.pct >= 50 ? B.amber : B.primary;
        return (
          <View key={i}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 13, color: B.text }}>{issue.issue}</Text>
              <Text style={{ fontSize: 12, fontWeight: "700", color: c }}>
                {issue.pct}%
              </Text>
            </View>
            <View style={s.issueTrack}>
              <Animated.View
                style={[s.issueFill, { width: w, backgroundColor: c }]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

// ─── Dashboard tab ────────────────────────────────────────────────────────────
export const DashboardTab = () => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={s.scroll}
  >
    {/* Org card */}
    <View style={[s.card, { borderColor: B.primary + "28" }]}>
      <View style={s.orgHeader}>
        <View style={s.orgIconWrap}>
          <Text style={{ fontSize: 26 }}>{ORG.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.orgName}>{ORG.name}</Text>
          <Text style={s.orgIndustry}>{ORG.industry}</Text>
        </View>
        <View style={s.memberBadge}>
          <View style={s.memberDot} />
          <Text style={s.memberText}>Member</Text>
        </View>
      </View>
      <View style={s.divider} />
      <View style={s.infoGrid}>
        {[
          { label: "Location", val: ORG.location },
          { label: "Size", val: ORG.size },
          { label: "Founded", val: ORG.founded },
          { label: "Joined", val: ORG.joinedDate },
        ].map((item, i) => (
          <View key={i} style={s.infoItem}>
            <Text style={s.infoLabel}>{item.label}</Text>
            <Text style={s.infoVal}>{item.val}</Text>
          </View>
        ))}
      </View>
      <View style={s.divider} />
      <View style={s.statsRow}>
        {[
          { val: ORG.members, label: "Members", color: B.primary },
          { val: ORG.activeToday, label: "Active today", color: B.accent },
          { val: ORG.totalPosts, label: "Total posts", color: B.violet },
        ].map((st, i) => (
          <View key={i} style={{ alignItems: "center", flex: 1 }}>
            <Text style={[s.statVal, { color: st.color }]}>{st.val}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>
    </View>

    {/* Burnout alert */}
    <View style={s.alertCard}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 20 }}>⚠️</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.alertTitle}>High Burnout Risk</Text>
          <Text style={s.alertSub}>
            72% of members report elevated stress this week
          </Text>
        </View>
        <Text style={s.alertBadge}>HIGH</Text>
      </View>
    </View>

    {/* Wellness trend */}
    <View style={s.card}>
      <Text style={s.cardTitle}>Team Wellness</Text>
      <Text style={s.cardSub}>7-day score · higher is healthier</Text>
      <View style={{ marginTop: 16 }}>
        <WellnessChart />
      </View>
    </View>

    {/* Emotion breakdown */}
    <View style={s.card}>
      <Text style={s.cardTitle}>How People Feel</Text>
      <Text style={s.cardSub}>Emotion distribution this month</Text>
      <View style={{ marginTop: 18 }}>
        <EmotionWheel />
      </View>
    </View>

    {/* Top issues */}
    <View style={s.card}>
      <Text style={s.cardTitle}>Top Issues</Text>
      <Text style={s.cardSub}>Most reported concerns in the forum</Text>
      <View style={{ marginTop: 18 }}>
        <IssuesList />
      </View>
    </View>

    <View style={{ height: 100 }} />
  </ScrollView>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { paddingHorizontal: 18, paddingTop: 16, gap: 14 },
  card: {
    backgroundColor: B.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: B.border,
    padding: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: B.text,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  cardSub: { fontSize: 12, color: B.muted },
  orgHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  orgIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: B.primary + "18",
    borderWidth: 1,
    borderColor: B.primary + "28",
    alignItems: "center",
    justifyContent: "center",
  },
  orgName: {
    fontSize: 17,
    fontWeight: "800",
    color: B.text,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  orgIndustry: { fontSize: 12, color: B.muted },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: B.accent + "10",
    borderWidth: 1,
    borderColor: B.accent + "25",
  },
  memberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: B.accent,
  },
  memberText: { fontSize: 10, fontWeight: "700", color: B.accent },
  divider: { height: 1, backgroundColor: B.border, marginVertical: 14 },
  infoGrid: { gap: 12 },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: { fontSize: 12, color: B.muted },
  infoVal: { fontSize: 13, fontWeight: "600", color: B.text },
  statsRow: { flexDirection: "row" },
  statVal: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 3,
  },
  statLabel: { fontSize: 10, color: B.muted, textAlign: "center" },
  alertCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: B.red + "08",
    borderWidth: 1,
    borderColor: B.red + "25",
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: B.text,
    marginBottom: 2,
  },
  alertSub: { fontSize: 12, color: B.muted },
  alertBadge: {
    fontSize: 9,
    fontWeight: "800",
    color: B.red,
    letterSpacing: 1,
  },
  issueTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  issueFill: { height: 4, borderRadius: 2 },
});
