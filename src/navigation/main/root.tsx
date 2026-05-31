import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "../auth/authStack";
import UserMain from "./user/main";
import OrganizationMain from "./organization/main";

import { useAppStore } from "../../store/userStore";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  const userRole = useAppStore((state) => state.userRole);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : userRole === "ORGANIZATION" ? (
          <Stack.Screen name="OrganizationMain" component={OrganizationMain} />
        ) : (
          <Stack.Screen name="UserMain" component={UserMain} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
