import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import HomeScreen from "../../../../screens/main/user/home";
import { ForumScreen } from "../../../../screens/main/user/forum";
import AbibekaChatScreen from "../../../../screens/main/user/aiChat";
import AssessmentScreen from "../../../../screens/main/user/assessmentScreen";

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  HomeScreen: "home-outline",
  Forum: "chatbubbles-outline",
  AiChat: "sparkles-outline",
  Assessment: "document-text-outline",
};

const ICONS_ACTIVE: Record<string, string> = {
  HomeScreen: "home",
  Forum: "chatbubbles",
  AiChat: "sparkles",
  Assessment: "document-text",
};

function EmployeeTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#5DCAA5",
        tabBarInactiveTintColor: "rgba(255,255,255,0.32)",

        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: -2,
        },

        tabBarStyle: {
          backgroundColor: "#0B1020",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.06)",
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
          elevation: 0,
        },

        tabBarItemStyle: {
          paddingTop: 2,
        },

        tabBarIcon: ({ color, focused, size }) => {
          const iconName = focused
            ? ICONS_ACTIVE[route.name] || "ellipse"
            : ICONS[route.name] || "ellipse-outline";

          return (
            <View
              style={{
                width: 38,
                height: 30,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused
                  ? "rgba(93,202,165,0.12)"
                  : "transparent",
              }}
            >
              <Ionicons name={iconName as any} size={size - 2} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen name="Forum" component={ForumScreen} options={{ title: "Forum" }} />
      <Tab.Screen name="AiChat" component={AbibekaChatScreen} options={{ title: "Chat" }} />
      <Tab.Screen name="Assessment" component={AssessmentScreen} options={{ title: "Assess" }} />
    </Tab.Navigator>
  );
}

export default EmployeeTab;