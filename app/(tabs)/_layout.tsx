import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { name: 'index',    label: 'Home',     icon: 'home-outline', activeIcon: 'home' },
  { name: 'intakeAction', label: 'Analysis', icon: 'analytics-outline', activeIcon: 'analytics', isAction: true },
  { name: 'history',  label: 'History',  icon: 'time-outline', activeIcon: 'time' },
  { name: 'settings', label: 'More',     icon: 'ellipsis-horizontal', activeIcon: 'ellipsis-horizontal' },
];

function CustomTabBar({ state, navigation }: any) {
  const router = useRouter();

  return (
    <View style={styles.navWrapper}>
      <View style={styles.pillBar}>
        {TABS.map((tab, index) => {
          const routeIndex = state.routes.findIndex((r: any) => r.name === tab.name);
          const isFocused = routeIndex !== -1 && state.index === routeIndex;

          const onPress = () => {
            if (tab.isAction) {
              router.push('/intake');
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[routeIndex]?.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tabItem, isFocused && styles.tabItemActive]}
              activeOpacity={0.8}
              onPress={onPress}
            >
              <Ionicons
                name={(isFocused ? tab.activeIcon : tab.icon) as any}
                size={22}
                color={isFocused ? '#BD5D38' : '#7A6B60'}
              />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.searchButton}
        activeOpacity={0.8}
        onPress={() => router.push('/ai-voice')}
      >
        <Ionicons name="mic" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="insights" options={{ href: null }} />
      <Tabs.Screen name="history" options={{ title: 'Activity' }} />
      <Tabs.Screen name="settings" options={{ title: 'More' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  pillBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#EAE1D2',
    elevation: 8,
    shadowColor: '#4A3B2C',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 26,
  },
  tabItemActive: {
    backgroundColor: '#F7EDE2',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A6B60',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#BD5D38',
    fontWeight: '800',
  },
  searchButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#BD5D38',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#BD5D38',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});
