import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../../../screens/main/user/home";




const Stack = createStackNavigator();

export default function EmployeeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="Home" component={HomeScreen}/>
        </Stack.Navigator>
    )
}