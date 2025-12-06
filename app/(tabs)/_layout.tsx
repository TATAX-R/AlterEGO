import { Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from 'tamagui';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  // Tamaguiのテーマを取得
  // app/_layout.tsx で defaultTheme="light" に固定されていれば、
  // ここでは自動的にライトテーマの色が取得されます。
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
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="figure.walk" color={color} />,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="waveform.path.ecg" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
