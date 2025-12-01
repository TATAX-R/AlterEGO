// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withTamagui } = require('@tamagui/metro-plugin');

// 1. デフォルトの設定を取得
const config = getDefaultConfig(__dirname);

// 2. config.resolverなどのカスタマイズが必要な場合はここに書く
const { transformer, resolver } = config;
config.resolver.sourceExts.push('mjs'); // 必要に応じて追加

// 3. withTamaguiでラップしてエクスポート
module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts', // 先ほど配置したファイルのパス
  outputCSS: './tamagui-web.css', // Web向けにCSSを吐き出す場合のパス（任意）
});
