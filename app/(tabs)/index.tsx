import React from 'react';
import { useWindowDimensions } from 'react-native';
import { YStack, useTheme } from 'tamagui';
import Svg, { Path } from 'react-native-svg';
import LottieView from 'lottie-react-native';

/**
 * 曲線の地面を描画するコンポーネント
 * @param color - 地面の色（Themeから取得）
 * @param height - 地面のエリアの高さ
 */
const CurveGround = ({ color, height }: { color: string; height: number }) => {
  const { width } = useWindowDimensions();

  // ベジェ曲線の定義
  // M=Move to, Q=Quadratic Bezier (制御点x y, 終点x y), L=Line to, Z=Close path
  const pathData = `
    M 0 ${height * 0.3}
    Q ${width / 2} 0 ${width} ${height * 0.3}
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

  return (
    <Svg height={height} width={width} style={{ position: 'absolute', bottom: 0 }}>
      <Path d={pathData} fill={color} />
    </Svg>
  );
};

export default function WorldScreen() {
  const theme = useTheme();

  // 地面の色はテーマから取得
  const groundColor = theme.background.get();

  // 地面エリアの高さ設定
  const GROUND_HEIGHT = 200;

  return (
    <YStack
      flex={1}
      backgroundColor="#45E6E6" // 指定された空の色（青に近い緑）
      position="relative">
      {/* キャラクター (Lottie)
        width/height 100% を維持しつつ、位置を下げるためにコンテナでラップしています。
        y={150} の値を増減させることで、地面との接地感を調整してください。
        zIndex={1} で地面より手前に表示していますが、足元を草むらに隠したい場合は0にしてください。
      */}
      <YStack
        position="absolute"
        width="100%"
        height="100%"
        zIndex={1}
        y={150} // ★ここを調整してキャラクターの高さを決めてください
        pointerEvents="none" // キャラクターがタッチ操作を邪魔しないように設定
      >
        <LottieView
          source={require('@/assets/lottie/pig-idle.json')}
          style={{ width: '100%', height: '100%' }}
          autoPlay
          loop
          // 必要に応じて resizeMode="contain" や "cover" を明示してください
          resizeMode="contain"
        />
      </YStack>

      {/* 地面 (絶対配置で最下部に固定) */}
      <CurveGround color={groundColor} height={GROUND_HEIGHT} />
    </YStack>
  );
}
