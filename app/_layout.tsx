import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, Theme } from 'tamagui';

// ▼ ルートにある設定ファイルをインポート（パスに注意）
import config from '../tamagui.config';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // ▼ Tamaguiの設定でInterフォントを使っているため、ここで読み込みます
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  // フォント読み込み完了まで何も表示しない
  if (!loaded) {
    return null;
  }

  return (
    // ▼ ここが最重要：TamaguiProviderでアプリ全体を包む
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* スタックナビゲーションの設定 */}
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          {/* もし (tabs) フォルダがあるなら以下も有効にしてください */}
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </TamaguiProvider>
  );
}
