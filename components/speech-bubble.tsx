import React, { useState } from 'react';
import { YStack, Text } from 'tamagui';
import Animated from 'react-native-reanimated';
import { Symptom } from '@/types';
import { Modal } from '@/components/modal';

type Props = {
  symptom: Symptom;
};

// 統一された色設定
const BUBBLE_BACKGROUND = '$color5'; // 優しいクリーム色

export const SpeechBubble: React.FC<Props> = ({ symptom }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePress = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Animated.View
        style={{
          alignItems: 'center',
          width: '100%',
          // ふわふわ浮くアニメーション
          animationName: {
            '0%': { transform: [{ translateY: 0 }] },
            '50%': { transform: [{ translateY: -8 }] },
            '100%': { transform: [{ translateY: 0 }] },
          },
          animationDuration: '2000ms',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-in-out',
        }}>
        <YStack
          position="relative"
          alignItems="center"
          width="100%"
          $gtSm={{ width: 'auto' }}
          cursor="pointer"
          onPress={handlePress}
          pressStyle={{ scale: 0.98 }}>
          <YStack
            width="90%"
            maxWidth={280}
            $gtXs={{ maxWidth: 320 }}
            $gtSm={{ maxWidth: 350, borderRadius: '$5', padding: '$4' }}
            $gtMd={{ maxWidth: 400 }}
            minWidth={80}
            backgroundColor={BUBBLE_BACKGROUND}
            borderRadius="$4"
            shadowColor="rgba(0, 0, 0, 0.1)"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.8}
            shadowRadius={4}
            elevation={3}
            padding="$3"
            alignItems="center"
            justifyContent="center">
            <Text fontSize="$9" fontWeight="bold" color="#473C33">
              {symptom.text}
            </Text>
          </YStack>

          <YStack
            marginTop={-1}
            width={0}
            height={0}
            shadowColor="rgba(0, 0, 0, 0.1)"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.8}
            shadowRadius={4}
            borderColor={BUBBLE_BACKGROUND}
            style={{
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderTopWidth: 14,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
            }}
          />
        </YStack>
      </Animated.View>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        tipsTitle={symptom.tipsTitle}
        tipsContent={symptom.tipsContent}
      />
    </>
  );
};

export default SpeechBubble;
