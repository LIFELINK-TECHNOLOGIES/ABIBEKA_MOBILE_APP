import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "../../screens/auth/onboarding";
import LoginScreen from "../../screens/auth/login";
import SignUpScreen from "../../screens/auth/signUp";
import { useAuthStore } from "../../store/authStore"




const Stack = createStackNavigator();




export default function AuthNavigation() {
    const isOnboarded = useAuthStore((state) => state.isOnboarded);
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {
                !isOnboarded ? <Stack.Screen name="Onboarding" component={OnboardingScreen} /> 
                    : 
                    <>
                        <Stack.Screen name="Login" component={LoginScreen}/>
                        <Stack.Screen name="SignUp" component={SignUpScreen}/>
                    </>
            }
           
         
        </Stack.Navigator>
    )
}