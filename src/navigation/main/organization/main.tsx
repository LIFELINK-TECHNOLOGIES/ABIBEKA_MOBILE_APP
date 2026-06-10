import { createStackNavigator } from "@react-navigation/stack";
import OrganizationTab from "./tab";
import OrganizationStack from "./stack";



const Stack = createStackNavigator();

export default function OrganizationMain() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="OrganizationTab" component={OrganizationTab}/>
            <Stack.Screen name="OrganizationStack" component={OrganizationStack}/>
        </Stack.Navigator>
    )
}