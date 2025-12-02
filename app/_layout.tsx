import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
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
    <TamaguiProvider config={config} defaultTheme={colorScheme ?? 'light'}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* スタックナビゲーションの設定 */}
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          {/* もし (tabs) フォルダがあるなら以下も有効にしてください */}
          {<Stack.Screen name="(tabs)" options={{ headerShown: false }} />}
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </TamaguiProvider>
  );
}
