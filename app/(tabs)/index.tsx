import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { ZStack, YStack, useTheme, Text, XStack } from 'tamagui';
import Svg, { Path } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import { LinearGradient } from '@tamagui/linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { PetSurvivalDays } from '@/components/PetSurvivalDays';
import { PetNameEditModal } from '@/components/PetName/PetNameEditModal';
import { usePetName } from '@/hooks/usePetName';

import BootCameraButton from '@/components/BootCameraButton';
import { SpeechBubble } from '@/components/speech-bubble';
import { usePetStateContext } from '@/hooks/usePetState';
import { diseaseData } from '@/constants/diseases';

/**
 * 曲線の地面を描画するコンポーネント
 * @param color
 * @param height
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

// デフォルトの症状（健康な時）
const DEFAULT_SYMPTOM = {
  id: 'healthy',
  text: '今日も元気！',
  tipsTitle: '健康',
  tipsContent: '今日も元気いっぱい！この調子で健康的な生活を続けましょう！',
};

export default function WorldScreen() {
  const theme = useTheme();
  // 両方のHookを統合
  const { petState } = usePetStateContext();
  const { petName, updatePetName } = usePetName();
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);

  const groundColor = theme.background.get();
  const GROUND_HEIGHT = 220;

  // 表示する症状（activeSymptomがあればそれを使用、なければデフォルト）
  const displaySymptom = petState.activeSymptom || DEFAULT_SYMPTOM;

  return (
    <YStack flex={1} backgroundColor="#45E6E6" position="relative" justifyContent="center">
      <LinearGradient
        colors={['#45E6E6', '#FFE4C4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
      />

      {/* --- feature/hukidasi の変更部分（吹き出し） --- */}
      <YStack position="absolute" top={200} left={0} right={0} zIndex={10} alignItems="center">
        <SpeechBubble symptom={displaySymptom} />
      </YStack>

      {/* --- develop の変更部分（生存日数） --- */}
      <YStack
        position="absolute"
        top={60}
        left={20}
        zIndex={10}
        backgroundColor="rgba(255, 255, 255, 0.9)"
        padding="$3"
        borderRadius="$4"
        borderWidth={1}
        borderColor="rgba(0,0,0,0.1)"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}>
        <PetSurvivalDays />
      </YStack>

      {/* --- develop の変更部分（名前編集ボタン） --- */}
      <YStack
        position="absolute"
        top={60}
        right={20}
        zIndex={10}
        backgroundColor="$color2"
        padding="$3"
        borderRadius="$4"
        borderWidth={1}
        borderColor="rgba(0,0,0,0.1)"
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        onPress={() => setIsNameModalVisible(true)}
        pressStyle={{ opacity: 0.7 }}>
        <XStack alignItems="center" gap="$2">
          <Text fontSize="$4" fontWeight="bold" color="$color">
            {petName}
          </Text>
          <MaterialCommunityIcons name="pencil" size={16} color="#666" />
        </XStack>
      </YStack>

      {/* --- develop の変更部分（モーダル） --- */}
      <PetNameEditModal
        visible={isNameModalVisible}
        currentName={petName}
        onClose={() => setIsNameModalVisible(false)}
        onSave={(newName) => {
          updatePetName(newName);
          setIsNameModalVisible(false);
        }}
      />

      <YStack
        position="absolute"
        width="100%"
        height="100%"
        zIndex={1}
        y={100}
        pointerEvents="none">
        <LottieView
          source={require('@/assets/lottie/pig-idle.json')}
          style={{ width: '100%', height: '100%' }}
          autoPlay
          loop
          resizeMode="contain"
        />
      </YStack>

      <BootCameraButton />

      <CurveGround color={groundColor} height={GROUND_HEIGHT} />
    </YStack>
  );
}