import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Card from "./card";
import { B } from "../../../../../constant/them";
import {
  useTodayMoodEntry,
  useMoodDashboard,
} from "../../../../../api/hooks/shared/moodEntry"

type DayStatus = "checked" | "today" | "future" | "missed";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const StreakStrip = ({ week }: { week: { key: string; status: DayStatus }[] }) => {
  const { t } = useTranslation();
  return (
    <View style={s.stripWrap}>
      <View style={s.dayLabels}>
        {week.map((d, i) => (
          <Text
            key={i}
            style={[
              s.dayLabel,
              d.status === "checked" && { color: B.accent },
              d.status === "today" && {
                color: B.primary,
                fontWeight: "700",
              },
            ]}
          >
            {t(`home.weekDays.${d.key}`)}
          </Text>
        ))}
      </View>
      <View style={s.dotRow}>
        {week.map((d, i) => (
          <View
            key={i}
            style={[
              s.dot,
              d.status === "checked" && { backgroundColor: B.accent },
              d.status === "today" && {
                backgroundColor: B.primary,
              },
              (d.status === "future" || d.status === "missed") && {
                backgroundColor: "rgba(255,255,255,0.07)",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default function CheckInCard({ anim }: { anim: Animated.Value }) {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const y = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  const { data: todayData, isLoading: isTodayLoading } = useTodayMoodEntry();
  const { data: dashboardData, isLoading: isDashboardLoading } = useMoodDashboard(7);

  const hasCheckedIn = todayData?.checkedInToday ?? false;
  const isLoading = isTodayLoading || isDashboardLoading;

  useEffect(() => {
    if (hasCheckedIn || isLoading) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [hasCheckedIn, isLoading]);

  if (isLoading) {
    return (
      <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
        <Card style={s.card}>
          <View style={{ paddingVertical: 30, alignItems: "center" }}>
            <ActivityIndicator color={B.primary} />
          </View>
        </Card>
      </Animated.View>
    );
  }

  // Build a Sun-Sat week strip from the dashboard's daily mood data
  const dailyEntries = dashboardData?.data?.moodTrend?.daily ?? [];
  const checkedDates = new Set(
    dailyEntries.map((d) => new Date(d.date).toDateString())
  );

  const today = new Date();
  const todayDayIdx = today.getDay(); // 0 = Sun
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - todayDayIdx);

  const week: { key: string; status: DayStatus }[] = DAY_KEYS.map((key, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = date.toDateString();

    let status: DayStatus;
    if (i === todayDayIdx) {
      status = hasCheckedIn ? "checked" : "today";
    } else if (i > todayDayIdx) {
      status = "future";
    } else {
      status = checkedDates.has(dateStr) ? "checked" : "missed";
    }

    return { key, status };
  });

  const checkedCount = week.filter((d) => d.status === "checked").length;

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: y }] }}>
      <Card
        style={[
          s.card,
          hasCheckedIn
            ? { borderColor: B.accent + "35" }
            : { borderColor: B.primary + "40" },
        ]}
      >
        <View
          style={[
            s.topLine,
            { backgroundColor: hasCheckedIn ? B.accent : B.primary },
          ]}
        />

        <View style={s.body}>
          <View
            style={[
              s.iconWrap,
              hasCheckedIn
                ? {
                    backgroundColor: B.accent + "18",
                    borderColor: B.accent + "30",
                  }
                : {
                    backgroundColor: B.primary + "18",
                    borderColor: B.primary + "30",
                  },
            ]}
          >
            <Text style={{ fontSize: 20 }}>
              {hasCheckedIn ? "✅" : "✨"}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={s.title}>{t('home.dailyCheckIn')}</Text>
            <Text style={s.sub}>
              {hasCheckedIn
                ? t('home.doneForToday')
                : t('home.takesThirtySec')}
            </Text>
          </View>

          {hasCheckedIn ? (
            <View style={s.doneBadge}>
              <Text style={s.doneBadgeText}>{t('home.doneBadge')}</Text>
            </View>
          ) : (
            <View style={s.streakCount}>
              <Text style={s.streakNum}>{checkedCount}</Text>
              <Text style={s.streakLabel}>{t('home.thisWeek')}</Text>
            </View>
          )}
        </View>

        <StreakStrip week={week} />

        {!hasCheckedIn && (
          <Pressable
            onPress={() => navigation.navigate("CheckIn")}
            style={s.cta}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Text style={s.ctaText}>{t('home.checkInNow')}</Text>
            </Animated.View>
          </Pressable>
        )}
      </Card>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: { padding: 0, overflow: "hidden" },
  topLine: { height: 2, width: "100%", opacity: 0.8 },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    paddingBottom: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: B.text,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  sub: { fontSize: 11, color: B.muted },
  doneBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: B.accent + "18",
    borderWidth: 1,
    borderColor: B.accent + "35",
  },
  doneBadgeText: { fontSize: 11, fontWeight: "700", color: B.accent },
  streakCount: { alignItems: "center" },
  streakNum: {
    fontSize: 20,
    fontWeight: "900",
    color: B.primary,
    letterSpacing: -1,
  },
  streakLabel: { fontSize: 9, color: B.muted, fontWeight: "600" },
  stripWrap: { paddingHorizontal: 14, paddingBottom: 10 },
  dayLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  dayLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.2)",
    width: 26,
    textAlign: "center",
  },
  dotRow: { flexDirection: "row", justifyContent: "space-between" },
  dot: { width: 26, height: 6, borderRadius: 3 },
  cta: {
    marginHorizontal: 14,
    marginBottom: 14,
    height: 38,
    borderRadius: 12,
    backgroundColor: B.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { fontSize: 13, fontWeight: "800", color: "#fff" },
});