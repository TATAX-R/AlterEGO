import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { YStack, useTheme } from 'tamagui';
import LottieView from 'lottie-react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from '@tamagui/linear-gradient';
import {
  StepMessage,
  StepProgressBar,
  StepCount,
  StepUnavailableNotice,
} from '@/components/StepCounter';
import { useStepCounter } from '@/hooks/useStepCounter';

/**
 * 曲線の地面を描画するコンポーネント
 */
const CurveGround = ({ color, height }: { color: string; height: number }) => {
  const { width } = useWindowDimensions();

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

export default function StepsScreen() {
  const { stepData, progress } = useStepCounter();
  const theme = useTheme();
  const groundColor = '#8B8B8B'; // コンクリート風の灰色
  const GROUND_HEIGHT = 110;

  // グラデーション用の色（accent系の緑）
  const gradientColors = ['#81C784', '#A5D6A7', '#C8E6C9'] as const; // 上が濃い → 下が薄い

  // AndroidのExpo Goでは歩数計が利用できない
  if (Platform.OS === 'android') {
    return (
      <YStack flex={1} backgroundColor="$background" alignItems="center" padding={20}>
        <StepUnavailableNotice />
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background" alignItems="center">
      {/* 上部エリア（パディングあり） */}
      <YStack paddingHorizontal={20} paddingTop={20} width="100%" alignItems="center">
        <StepMessage stepData={stepData} />
        <StepProgressBar progress={progress} />
      </YStack>

      {/* ペットアニメーションエリア（パディングなし = 画面幅いっぱい） */}
      <YStack
        flex={1}
        width="100%"
        marginTop="$4"
        justifyContent="flex-end"
        alignItems="center"
        position="relative"
        overflow="hidden">
        {/* グラデーション背景（上が濃い） */}
        <LinearGradient
          colors={[...gradientColors]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
        />

        {/* ペットの歩くアニメーション */}
        <LottieView
          source={require('@/assets/lottie/pig-walk.json')}
          autoPlay
          loop
          style={{ width: 450, height: 450, marginBottom: 20, zIndex: 1 }}
        />

        {/* 曲線の地面 */}
        <CurveGround color={groundColor} height={GROUND_HEIGHT} />
      </YStack>

      {/* 区切り線 */}
      <YStack width="100%" height={2} backgroundColor="$borderColor" />

      {/* 下部エリア（パディングあり） */}
      <YStack paddingHorizontal={20} paddingBottom={20} width="100%" alignItems="center">
        <StepCount stepData={stepData} />
      </YStack>
    </YStack>
  );
}
