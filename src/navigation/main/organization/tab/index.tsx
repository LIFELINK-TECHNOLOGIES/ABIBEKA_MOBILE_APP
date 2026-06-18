import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Home from "../../../../screens/main/organization/home";
import JoinRequestsScreen from "../../../../screens/main/organization/request";
import AbibekaChatScreen from "../../../../screens/main/user/aiChat";
import AssignRoleScreen from "../../../../screens/main/organization/assignRole";
import { ForumScreen } from "../../../../screens/main/user/forum";
import { useAuthStore } from "../../../../store/authStore"; 
// ─── Tokens ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#04060F',
  surface: '#0F1628',
  border: 'rgba(255,255,255,0.06)',
  text: '#F0F4FF',
  muted: 'rgba(255,255,255,0.28)',
  teal: '#0F766E',
  tealLight: '#5DCAA5',
};

// ─── Tab Config ───────────────────────────────────────────────────────────────
type TabItem = {
  name: string;
  icon: string;
  label: string;
  component: React.ComponentType<any>;
  requiredClearance?: number;
};

const TAB_CONFIG: TabItem[] = [
  { name: 'Home',    label: 'Home',     icon: '⬡', component: Home },
  { name: 'Forum',   label: 'Forum',    icon: '◎', component: ForumScreen },
  { name: 'AI',      label: 'Abibeka',  icon: '✦', component: AbibekaChatScreen },
  {
    name: 'Roles',
    label: 'Roles',
    icon: '❖',
    component: AssignRoleScreen,
    requiredClearance: 5, // only clearance level 5 can see this
  },
  { name: 'Request', label: 'Requests', icon: '◈', component: JoinRequestsScreen },
];

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabCfg = TAB_CONFIG.find(t => t.name === route.name);
          if (!tabCfg) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.75}
              onPress={onPress}
              style={styles.tabBtn}
            >
              {isFocused && <View style={styles.activePill} />}
              <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
                {tabCfg.icon}
              </Text>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {tabCfg.label}
              </Text>
              {isFocused && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Navigator ────────────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator();

export default function OrganizationTab() {
  const user = useAuthStore(state => state.user);

  // clearanceLevel is stored as a string in UserData, so parse it
  const clearanceLevel = user?.clearanceLevel ? parseInt(user.clearanceLevel, 10) : 0;

  const visibleTabs = TAB_CONFIG.filter(tab =>
    // show tab if it has no clearance requirement, OR user meets the exact level
    tab.requiredClearance === undefined || clearanceLevel === tab.requiredClearance
  );

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {visibleTabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
        />
      ))}
    </Tab.Navigator>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 4,
    paddingVertical: 6,
    alignItems: 'flex-end',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 2,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(15,118,110,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(15,118,110,0.28)',
  },
  tabIcon: {
    fontSize: 17,
    color: C.muted,
    lineHeight: 22,
  },
  tabIconActive: {
    color: C.tealLight,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: C.muted,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: C.tealLight,
    fontWeight: '800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.tealLight,
    marginTop: 1,
  },
  centerTabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
    gap: 3,
    marginTop: -14,
  },
  centerTabInner: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: 'rgba(15,118,110,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(15,118,110,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  centerTabInnerActive: {
    backgroundColor: 'rgba(15,118,110,0.35)',
    borderColor: C.tealLight,
    shadowOpacity: 0.5,
  },
  centerTabIcon: {
    fontSize: 20,
    color: C.muted,
  },
  centerTabIconActive: {
    color: C.tealLight,
  },
  centerTabLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: C.muted,
    letterSpacing: 0.3,
  },
});