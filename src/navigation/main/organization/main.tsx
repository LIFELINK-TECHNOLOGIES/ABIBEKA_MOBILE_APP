import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrganizationStack from "./stack";
import OrganizationTab from "./tab";

const Stack = createNativeStackNavigator();

export default function OrganizationMain() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrgStack" component={OrganizationStack} />
      <Stack.Screen name="OrgTab" component={OrganizationTab} />
    </Stack.Navigator>
  );
}
