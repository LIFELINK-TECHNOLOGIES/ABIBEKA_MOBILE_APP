import { createStackNavigator } from "@react-navigation/stack";
import EmpployeeMain from "./main/employee/main";
import OrganizationMain from "./main/organization/main";





const Stack = createStackNavigator();
const isEmployee = true;


export default function MainNavigation() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            {
                isEmployee ? 
                <Stack.Screen name="EmployeeMain" component={EmpployeeMain}/> 
                : 
                <Stack.Screen name="OrganizationMain" component={OrganizationMain}/>
            }
        </Stack.Navigator>
    )
}