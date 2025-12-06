import React from 'react';
import { useWindowDimensions } from 'react-native';
import { YStack, useTheme, Text, Circle } from 'tamagui';
import Svg, { Path } from 'react-native-svg';

/**
 * キャラクターのプレースホルダー
 * 実際の実装時はここをSVGコンポーネントなどに置き換えてください
 */
const CharacterPlaceholder = () => {
  return (
    <YStack alignItems="center" justifyContent="center" gap="$2">
      {/* キャラクターの仮の姿 */}
      <Circle size={100} backgroundColor="$red10" elevation="$4" />
      <Text color="white" fontSize="$3" fontWeight="bold">
        Character
      </Text>
    </YStack>
  );
};

/**
 * 曲線の地面を描画するコンポーネント
 * @param color - 地面の色（Themeから取得）
 * @param height - 地面のエリアの高さ
 */
const CurveGround = ({ color, height }: { color: string; height: number }) => {
  const { width } = useWindowDimensions();

  // ベジェ曲線の定義
  // M=Move to, Q=Quadratic Bezier (制御点x y, 終点x y), L=Line to, Z=Close path
  // 画面左端(0, 50)からスタートし、
  // 中央上部(width/2, 0)を制御点として、
  // 右端(width, 50)へカーブを描き、
  // その後下部を埋めるパスです。
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

  // Theme Builderの定義に従って色を取得
  // .get() を使うことで、CSS変数やRawのカラーコード文字列を取り出せます(SVGで使うため)
  const skyColor = theme.color5.get();
  const groundColor = theme.background.get();

  // 地面エリアの高さ設定
  const GROUND_HEIGHT = 200;

  return (
    <YStack
      flex={1}
      backgroundColor={skyColor} // 全体の背景＝空
      justifyContent="flex-end" // コンテンツを下に寄せる
      alignItems="center" // 水平方向中央揃え
      position="relative">
      {/* キャラクター
        地面の曲線の上に立つようにマージンで調整
        (地面の高さ - 曲線の頂点までのオフセット分だけ上げるイメージ)
      */}
      <YStack marginBottom={GROUND_HEIGHT * 0.2} zIndex={1}>
        <CharacterPlaceholder />
      </YStack>

      {/* 地面 (絶対配置で最下部に固定) */}
      <CurveGround color={groundColor} height={GROUND_HEIGHT} />
    </YStack>
  );
}
