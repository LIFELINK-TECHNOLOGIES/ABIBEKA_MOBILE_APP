import { createStackNavigator } from "@react-navigation/stack";
import EmpployeeMain from "./main/employee/main";
import OrganizationMain from "./main/organization/main";
import { useAuthStore } from "../store/authStore";





const Stack = createStackNavigator();

export default function MainNavigation() {
    const userRole = useAuthStore((state) => state.userRole);
    return (
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            {
                userRole === "employee" ? 
                <Stack.Screen name="EmployeeMain" component={EmpployeeMain}/> 
                : 
                <Stack.Screen name="OrganizationMain" component={OrganizationMain}/>
            }
        </Stack.Navigator>
    )
}