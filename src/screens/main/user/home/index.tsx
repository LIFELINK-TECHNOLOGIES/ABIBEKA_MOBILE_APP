import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./component/header";
import AiCard from "./component/aiCard";
import CheckInCard from "./component/checkIn";
import MoodCard from "./component/moodCard";
import MoodTrendCard from "./component/moodTrend";
import StressCard from "./component/stressCard";
import EmotionCard from "./component/emotionCard";
import { WINDOW_WIDTH } from "./component/layout";
import Gap from "../../../../components/common/gap";
import OrgCard from "../../../../components/common/orgCard";
import { B } from "../../../../constant/them";

export default function HomeScreen() {
  const a = Array.from(
    { length: 8 },
    () => useRef(new Animated.Value(0)).current,
  );
  const [headerA, aiA, checkInA, moodA, trendA, stressA, emotionA, orgA] = a;

  useEffect(() => {
    Animated.stagger(
      80,
      a.map((v) =>
        Animated.spring(v, {
          toValue: 1,
          tension: 48,
          friction: 12,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.topGlow} pointerEvents="none" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Header anim={headerA} />
          {/* <Gap />
          <AiCard anim={aiA} /> */}
          <Gap />
          <CheckInCard anim={checkInA} />
          <Gap />
          <MoodTrendCard anim={trendA} />
          <Gap />
          <StressCard anim={stressA} />
          <Gap />
          <EmotionCard anim={emotionA} />
          <View style={{ height: 10 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: B.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  topGlow: {
    position: "absolute",
    top: -80,
    left: WINDOW_WIDTH * 0.1,
    width: WINDOW_WIDTH * 0.8,
    height: 200,
    borderRadius: 100,
    backgroundColor: B.primary,
    opacity: 0.07,
  },
});