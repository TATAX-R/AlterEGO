import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from 'tamagui';
import { Home, Footprints, ActivitySquare } from '@tamagui/lucide-icons';

import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.color2.val,
          borderTopColor: theme.borderColor?.val ?? theme.color2.val,
        },
        tabBarActiveTintColor: theme.color.val,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="steps/index"
        options={{
          title: 'Steps',
          tabBarIcon: ({ color }) => <Footprints size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color }) => <ActivitySquare size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="camerademo"
        options={{
          title: 'CameraDemo',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
