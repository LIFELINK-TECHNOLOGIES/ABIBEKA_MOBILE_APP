import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../../screens/main/user/home";
import AssessmentScreen from "../../../screens/main/user/assessmentScreen";
import ForumRoot from "../../../screens/main/user/forum";
import AbibekaChatScreen from "../../../screens/main/user/aiChat";

const Tab = createBottomTabNavigator();

export default function UserTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Forum" component={ForumRoot} />
      <Tab.Screen name="AI" component={AbibekaChatScreen} />
      <Tab.Screen name="Assessment" component={AssessmentScreen} />
    </Tab.Navigator>
  );
}
