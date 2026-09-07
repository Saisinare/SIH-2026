import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { name: 'index',    label: 'Home',     icon: 'home-outline', activeIcon: 'home' },
  { name: 'insights', label: 'DMs',      icon: 'chatbubbles-outline', activeIcon: 'chatbubbles' },
  { name: 'history',  label: 'Activity', icon: 'notifications-outline', activeIcon: 'notifications' },
  { name: 'settings', label: 'More',     icon: 'ellipsis-horizontal', activeIcon: 'ellipsis-horizontal' },
];

function CustomTabBar({ state, navigation }: any) {
  const router = useRouter();

  return (
    <View style={styles.navWrapper}>
      <View style={styles.pillBar}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[index]?.key,
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
                color="#FFFFFF"
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
        <Ionicons name="search" size={22} color="#FFFFFF" />
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
      <Tabs.Screen name="insights" options={{ title: 'DMs' }} />
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
    backgroundColor: '#1A1D24',
    borderRadius: 36,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginRight: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
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
    backgroundColor: '#2D3240',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9E9FA4',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1A1D24',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
});


