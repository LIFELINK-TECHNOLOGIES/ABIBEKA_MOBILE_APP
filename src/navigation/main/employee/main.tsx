import { createStackNavigator } from "@react-navigation/stack";
import EmployeeTab from "./tab";
import EmployeeStack from "./stack";



const Stack = createStackNavigator();

export default function EmpployeeMain() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            <Stack.Screen name="EmployeeTab" component={EmployeeTab}/>
            <Stack.Screen name="EmployeeStack" component={EmployeeStack}/>
        </Stack.Navigator>
    )
}