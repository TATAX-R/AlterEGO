import { useColorScheme } from 'react-native';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';

import config from '../tamagui.config';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <ThemeProvider value={DefaultTheme}>
        <Stack
          // ここを追加: 全画面の背景色を透明にして、index.tsxの色を表示させる
          screenOptions={{
            contentStyle: { backgroundColor: 'transparent' },
            headerShown: false, // デフォルトでヘッダーを非表示にする
          }}>
          {/* indexの設定: titleは不要になり、headerShown: falseを明示 */}
          <Stack.Screen
            name="index"
            options={{
              headerShown: false, // ここが重要！ヘッダーを消す
            }}
          />

          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </TamaguiProvider>
  );
}
