import { createStackNavigator } from "@react-navigation/stack";
import Home from "../../../../screens/main/organization/home";


const Stack = createStackNavigator();



export default function OrganizationStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="Home" component={Home}/>
        </Stack.Navigator>
    )
}