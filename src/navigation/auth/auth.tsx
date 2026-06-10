import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "../../screens/onboarding";
import LoginScreen from "../../screens/login";
import SignUpScreen from "../../screens/signUp";





const Stack = createStackNavigator();



export default function AuthNavigation() {

    const isOnboarded = false;
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={isOnboarded? "Login" : "Onboarding" }>
            <Stack.Screen name="Onboarding" component={OnboardingScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="SignUp" component={SignUpScreen}/>
        </Stack.Navigator>
    )
}