import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../../screens/auth/onboarding";
import LoginScreen from "../../screens/auth/login";
import HomeScreen from "../../screens/main/user/home";
import SignUpScreen from "../../screens/auth/signUp";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen}/>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
