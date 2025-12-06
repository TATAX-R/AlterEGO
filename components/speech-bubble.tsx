import React from 'react';
import { YStack, Text, useTheme } from 'tamagui';
import { Symptom } from '@/types';

type Props = {
  Symptom: Symptom;
};

// 統一された色設定
const BUBBLE_BACKGROUND = '$background';

export const SpeechBubble: React.FC<Props> = ({ Symptom }) => {
  const theme = useTheme();
  const backgroundColor = theme.background.val;

  const handlePress = () => {
    console.log(Symptom.tipsTitle, Symptom.tipsContent);
  };

  return (
    <YStack
      position="relative"
      alignItems="center"
      width="100%"
      $gtSm={{ width: 'auto' }}
      cursor="pointer"
      onPress={handlePress}
      pressStyle={{ backgroundColor: '#ffffff', scale: 0.98 }}>
      <YStack
        width="90%"
        maxWidth={280}
        $gtXs={{ maxWidth: 320 }}
        $gtSm={{ maxWidth: 350, borderRadius: '$5', padding: '$4' }}
        $gtMd={{ maxWidth: 400 }}
        minWidth={80}
        backgroundColor={BUBBLE_BACKGROUND}
        borderRadius="$4"
        padding="$3"
        shadowColor="rgba(0, 0, 0, 0.1)"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.8}
        shadowRadius={4}
        elevation={3}
        alignItems="center"
        justifyContent="center">
        <Text fontSize="$9" fontWeight="bold" color="$color">
          {Symptom.text}
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
        elevation={2}
        style={{
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderTopWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: backgroundColor,
        }}
      />

      <YStack
        marginTop={-16}
        width={0}
        height={0}
        style={{
          borderLeftWidth: 15,
          borderRightWidth: 15,
          borderTopWidth: 15,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: backgroundColor,
        }}
      />
    </YStack>
  );
};

export default SpeechBubble;
