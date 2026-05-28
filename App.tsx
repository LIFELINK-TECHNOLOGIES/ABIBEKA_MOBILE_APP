import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import OnboardingScreen from "./src/screens/auth/onboarding";
import LoginScreen from "./src/screens/auth/login";

export default function App() {
  return <LoginScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
  },
});
