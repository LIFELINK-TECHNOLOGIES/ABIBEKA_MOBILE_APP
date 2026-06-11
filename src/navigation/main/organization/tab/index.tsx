import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Home from "../../../../screens/main/organization/home";
import JoinRequestsScreen from "../../../../screens/main/organization/request";
import AbibekaChatScreen from "../../../../screens/main/user/aiChat";
import AssignRoleScreen from "../../../../screens/main/organization/assignRole";
import SolutionsForumScreen from "../../../../screens/main/organization/solution";
import { ForumScreen } from "../../../../screens/main/user/forum";


// ─── Tokens (matches all org screens) ────────────────────────────────────────
const C = {
  bg: '#04060F',
  surface: '#0F1628',
  border: 'rgba(255,255,255,0.06)',
  text: '#F0F4FF',
  muted: 'rgba(255,255,255,0.28)',
  teal: '#0F766E',
  tealLight: '#5DCAA5',
};

// ─── Tab config ───────────────────────────────────────────────────────────────
type TabItem = {
  name: string;
  icon: (active: boolean) => string;
  label: string;
};

const TABS: TabItem[] = [
  {
    name: 'Home',
    label: 'Home',
    icon: (a) => a ? '⬡' : '⬡',
  },
  {
    name: 'Request',
    label: 'Requests',
    icon: (a) => a ? '◈' : '◈',
  },
  {
    name: 'Roles',
    label: 'Roles',
    icon: (a) => a ? '❖' : '❖',
  },
  {
    name: 'AI',
    label: 'Abibeka',
    icon: (a) => a ? '✦' : '✦',
  },
  {
    name: 'Forum',
    label: 'Forum',
    icon: (a) => a ? '◎' : '◎',
  },
];

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tabCfg = TABS.find(t => t.name === route.name);
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

          // Special center AI tab
          if (route.name === 'AI') {
            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.85}
                onPress={onPress}
                style={styles.centerTabBtn}
              >
                <View style={[styles.centerTabInner, isFocused && styles.centerTabInnerActive]}>
                  <Text style={[styles.centerTabIcon, isFocused && styles.centerTabIconActive]}>
                    ✦
                  </Text>
                </View>
                <Text style={[styles.centerTabLabel, isFocused && { color: C.tealLight }]}>
                  {tabCfg.label}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.75}
              onPress={onPress}
              style={styles.tabBtn}
            >
              {/* Active pill background */}
              {isFocused && <View style={styles.activePill} />}

              <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
                {tabCfg.icon(isFocused)}
              </Text>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {tabCfg.label}
              </Text>

              {/* Active dot */}
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
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Forum" component={ForumScreen} />
      <Tab.Screen name="AI" component={AbibekaChatScreen} />
      <Tab.Screen name="Roles" component={AssignRoleScreen} />
      <Tab.Screen name="Request" component={JoinRequestsScreen} />
    </Tab.Navigator>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Outer wrapper — sits above the system home indicator
  tabBarWrapper: {
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 6,
    paddingHorizontal: 8,
  },

  // Inner pill container
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

  // Regular tab button
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
    position: 'relative',
  },

  // Active pill glow behind icon
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

  // Center AI tab — raised
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