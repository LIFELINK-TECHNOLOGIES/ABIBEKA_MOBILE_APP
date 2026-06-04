import React from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { B } from "./constants/constant";
import { ForumScreen } from ".";
import { NoOrgScreen } from "./components/Noorg";

// Flip this flag (or replace with real auth/org state) to switch screens
const HAS_ORGANIZATION = true;

export default function ForumRoot() {
  return (
    <View style={{ flex: 1, backgroundColor: B.bg }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaView style={{ flex: 1 }}>
        {HAS_ORGANIZATION ? <ForumScreen /> : <NoOrgScreen />}
      </SafeAreaView>
    </View>
  );
}
