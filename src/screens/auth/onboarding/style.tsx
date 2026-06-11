import { Dimensions, StyleSheet } from "react-native";

export const { width, height } = Dimensions.get("window");
export const ILLUSTRATION_SIZE = width * 0.72;

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  // ─── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // ─── Slide ─────────────────────────────────────────────────────────────────
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    width: "100%",
    paddingBottom: 24,
  },

  // ─── Illustration shared ───────────────────────────────────────────────────
  illustrationWrap: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
    borderRadius: ILLUSTRATION_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    position: "absolute",
    width: ILLUSTRATION_SIZE * 0.96,
    height: ILLUSTRATION_SIZE * 0.96,
    borderRadius: (ILLUSTRATION_SIZE * 0.96) / 2,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  illustrationCircleOuter: {
    width: ILLUSTRATION_SIZE * 0.82,
    height: ILLUSTRATION_SIZE * 0.82,
    borderRadius: (ILLUSTRATION_SIZE * 0.82) / 2,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationCircleInner: {
    width: ILLUSTRATION_SIZE * 0.6,
    height: ILLUSTRATION_SIZE * 0.6,
    borderRadius: (ILLUSTRATION_SIZE * 0.6) / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  // ─── Heart ─────────────────────────────────────────────────────────────────
  heartContainer: {
    width: 48,
    height: 44,
    position: "relative",
    alignItems: "center",
  },
  heartLeft: {
    position: "absolute",
    top: 0,
    left: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  heartRight: {
    position: "absolute",
    top: 0,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  heartBottom: {
    position: "absolute",
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 4,
    transform: [{ rotate: "45deg" }],
  },

  // ─── AI ────────────────────────────────────────────────────────────────────
  aiContainer: {
    alignItems: "center",
    gap: 10,
  },
  aiHead: {
    width: 44,
    height: 36,
    borderWidth: 2.5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  aiEye: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  aiLines: {
    gap: 5,
    alignItems: "center",
  },
  aiLine: {
    height: 3,
    borderRadius: 2,
  },

  // ─── Chart ─────────────────────────────────────────────────────────────────
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 60,
  },
  chartBar: {
    width: 14,
    borderRadius: 4,
  },

  // ─── Shield ────────────────────────────────────────────────────────────────
  shieldBody: {
    width: 44,
    height: 52,
    borderWidth: 3,
    borderRadius: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldCheck: {
    width: 18,
    height: 10,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    transform: [{ rotate: "-45deg" }],
    marginTop: -4,
  },

  // ─── Footer ────────────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 20,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actions: {
    gap: 14,
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
