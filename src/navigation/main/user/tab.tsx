import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../../../screens/main/user/home";
import AssessmentScreen from "../../../screens/main/user/assessmentScreen";
import AbibekaChatScreen from "../../../screens/main/user/aiChat";
import { ForumScreen } from "../../../screens/main/user/forum";

const Tab = createBottomTabNavigator();

export default function UserTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Forum") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "AI") {
            iconName = focused ? "sparkles" : "sparkles-outline";
          } else if (route.name === "Assessment") {
            iconName = focused ? "clipboard" : "clipboard-outline";
          }

          return (
            <View style={focused ? styles.activeIcon : styles.icon}>
              <Ionicons name={iconName} size={22} color={focused ? "#fff" : "#8e8e8e"} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Forum" component={ForumScreen} />
      <Tab.Screen name="AI" component={AbibekaChatScreen} />
      <Tab.Screen name="Assessment" component={AssessmentScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // position: "absolute",
    // bottom: 20,
    // left: 20,
    // right: 20,
    height: 65,
    borderRadius: 20,
    backgroundColor: "#050816",
    
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    borderRadius: 15,
  },

  activeIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#4F46E5",
  },
});