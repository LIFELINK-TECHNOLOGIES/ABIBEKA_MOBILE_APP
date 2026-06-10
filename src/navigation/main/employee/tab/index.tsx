import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../../../screens/user/home";
import { ForumScreen } from "../../../../screens/user/forum";
import AbibekaChatScreen from "../../../../screens/user/aiChat";
import AssessmentScreen from "../../../../screens/user/assessmentScreen";
import { Ionicons } from "@expo/vector-icons"






const Tab = createBottomTabNavigator();


function EmployeeTab() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: "#4F46E5",
                tabBarInactiveTintColor: "#A1A1AA",

                tabBarStyle: {
                    backgroundColor: "#fff",
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    borderTopWidth: 0,
                    elevation: 6,
                },

                
                tabBarIcon: ({ color, size }) => {
                    const icons = {
                        HomeScreen: "home-outline",
                        Forum: "chatbubbles-outline",
                        AiChat: "sparkles-outline",
                        Assessment: "document-text-outline",
                        Home: "document-text-outline",
                        
                    };

                    return (
                        <Ionicons
                            name={icons[route.name] || "ellipse-outline"}
                            size={size}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ title: "Home" }}
            />
            <Tab.Screen
                name="Forum"
                component={ForumScreen}
            />
            <Tab.Screen
                name="AiChat"
                component={AbibekaChatScreen}
            />
            <Tab.Screen
                name="Assessment"
                component={AssessmentScreen}
            />
        </Tab.Navigator>
    );
}

export default EmployeeTab;