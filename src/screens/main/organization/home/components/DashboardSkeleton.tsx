import React from 'react';
import { View, StyleSheet } from 'react-native';
import { C } from './tokens';
import { ShimmerBlock } from './Shimmer';

// ─── Section spacing constants — match real layout for no layout shift ───────
const CARD_RADIUS = 16;
const SECTION_GAP = 10;

const SkeletonCard = ({ height, radius = CARD_RADIUS }: { height: number; radius?: number }) => (
  <ShimmerBlock width="100%" height={height} borderRadius={radius} style={{ marginTop: SECTION_GAP }} />
);

export const DashboardSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.headerRow}>
        <View>
          <ShimmerBlock width={140} height={22} borderRadius={6} />
          <ShimmerBlock width={180} height={11} borderRadius={4} style={{ marginTop: 8 }} />
        </View>
        <ShimmerBlock width={40} height={40} borderRadius={13} />
      </View>

      {/* Alert skeleton */}
      <ShimmerBlock width="100%" height={40} borderRadius={13} style={{ marginHorizontal: 14, marginTop: 10 }} />

      {/* Headline stats skeleton */}
      <View style={styles.row}>
        {[0, 1, 2].map((i) => (
          <ShimmerBlock
            key={i}
            width="100%"
            height={78}
            borderRadius={CARD_RADIUS}
            style={{ flex: 1, marginRight: i < 2 ? 8 : 0 }}
          />
        ))}
      </View>

      {/* Pulse card skeleton */}
      <View style={styles.card}>
        <ShimmerBlock width={120} height={64} borderRadius={8} />
      </View>

      {/* Productivity grid skeleton */}
      <View style={[styles.row, { marginTop: SECTION_GAP }]}>
        {[0, 1].map((i) => (
          <ShimmerBlock
            key={i}
            width="100%"
            height={90}
            borderRadius={CARD_RADIUS}
            style={{ flex: 1, marginRight: i === 0 ? 8 : 0 }}
          />
        ))}
      </View>
      <View style={[styles.row, { marginTop: 8 }]}>
        {[0, 1].map((i) => (
          <ShimmerBlock
            key={i}
            width="100%"
            height={90}
            borderRadius={CARD_RADIUS}
            style={{ flex: 1, marginRight: i === 0 ? 8 : 0 }}
          />
        ))}
      </View>

      {/* Mood distribution skeleton */}
      <View style={styles.card}>
        <ShimmerBlock width={140} height={14} borderRadius={4} />
        {[0, 1, 2, 3, 4].map((i) => (
          <ShimmerBlock key={i} width="100%" height={6} borderRadius={3} style={{ marginTop: 14 }} />
        ))}
      </View>

      {/* Department cards skeleton */}
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard key={i} height={110} />
      ))}

      {/* Emotion chips skeleton */}
      <View style={styles.card}>
        <ShimmerBlock width={180} height={11} borderRadius={4} />
        <View style={styles.chipsRow}>
          {[0, 1, 2, 3, 4].map((i) => (
            <ShimmerBlock key={i} width={90} height={26} borderRadius={20} />
          ))}
        </View>
      </View>

      {/* Heatmap skeleton */}
      <View style={styles.card}>
        <ShimmerBlock width={180} height={11} borderRadius={4} />
        <View style={[styles.row, { marginTop: 10 }]}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <ShimmerBlock
              key={i}
              width="100%"
              height={36}
              borderRadius={7}
              style={{ flex: 1, marginRight: i < 6 ? 4 : 0 }}
            />
          ))}
        </View>
      </View>

      {/* Quick actions skeleton */}
      <View style={[styles.row, { marginTop: SECTION_GAP }]}>
        {[0, 1, 2, 3].map((i) => (
          <ShimmerBlock
            key={i}
            width="100%"
            height={58}
            borderRadius={14}
            style={{ flex: 1, marginRight: i < 3 ? 8 : 0 }}
          />
        ))}
      </View>

      <View style={{ height: 40 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: SECTION_GAP,
  },
  card: {
    marginHorizontal: 14,
    marginTop: SECTION_GAP,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
});