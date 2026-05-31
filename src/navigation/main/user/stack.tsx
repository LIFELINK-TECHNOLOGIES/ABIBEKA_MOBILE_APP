import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../../screens/main/user/home";

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
