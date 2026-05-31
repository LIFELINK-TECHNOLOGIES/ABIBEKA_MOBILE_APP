import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../../screens/main/user/home";

const Tab = createBottomTabNavigator();

export default function OrganizationTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}
