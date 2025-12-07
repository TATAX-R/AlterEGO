import { createTamagui } from 'tamagui';
import { config as defaultConfig } from '@tamagui/config/v3';
import { themes as customThemes } from './themes';

const appConfig = createTamagui({
  ...defaultConfig,
  themes: customThemes,
});

export type AppConfig = typeof appConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;
