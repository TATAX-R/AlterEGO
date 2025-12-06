import React from 'react';
import { YStack, Text } from 'tamagui';
import { Symptom } from '@/types';

type Props = {
  Symptom: Symptom;
};

const BUBBLE_BACKGROUND = '#FFFFFF';
const TEXT_COLOR = '#333333';

export const SpeechBubble: React.FC<Props> = ({ Symptom }) => {
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
        <Text
          color={TEXT_COLOR}
          fontSize="$4"
          $gtSm={{ fontSize: '$5' }}
          $gtMd={{ fontSize: '$6' }}
          fontWeight="500"
          lineHeight="$1"
          flexWrap="wrap"
          textAlign="center">
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
          borderTopColor: BUBBLE_BACKGROUND,
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
          borderTopColor: '#ffffffff',
        }}
      />
    </YStack>
  );
};

export default SpeechBubble;
