import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigation from "./auth/auth";
import MainNavigation from ".";
import { useAuthStore } from "../store/authStore";





const Stack = createStackNavigator();

export default function RootNavigation() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return (
        <NavigationContainer>
             <Stack.Navigator screenOptions={{ headerShown: false}}>
            {
                isAuthenticated ? 
                <Stack.Screen name="MainNavigation" component={MainNavigation}/>
                : 
                <Stack.Screen name="AuthNavigation" component={AuthNavigation}/> 
            }
        </Stack.Navigator>
        </NavigationContainer>
       
    )
}