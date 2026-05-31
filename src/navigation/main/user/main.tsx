import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserStack from "./stack";
import UserTab from "./tab";
const Stack = createNativeStackNavigator();

export default function UserMain() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="UserTab"
    >
      <Stack.Screen name="UserTab" component={UserTab} />
      <Stack.Screen name="UserStack" component={UserStack} />
    </Stack.Navigator>
  );
}
