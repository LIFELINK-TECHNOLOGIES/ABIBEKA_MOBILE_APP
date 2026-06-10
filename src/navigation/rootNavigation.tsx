import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthNavigation from "./auth/auth";
import MainNavigation from ".";





const Stack = createStackNavigator();
const isAuthenticated = true;

export default function RootNavigation() {
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