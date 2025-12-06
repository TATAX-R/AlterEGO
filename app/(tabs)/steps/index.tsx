import React from 'react';
import { Platform } from 'react-native';
import { YStack } from 'tamagui';
import {
  StepMessage,
  StepProgressBar,
  StepCount,
  StepUnavailableNotice,
} from '@/components/StepCounter';
import { useStepCounter } from '@/hooks/useStepCounter';

export default function StepsScreen() {
  const { stepData, progress } = useStepCounter();

  // AndroidのExpo Goでは歩数計が利用できない
  if (Platform.OS === 'android') {
    return (
      <YStack flex={1} backgroundColor="$background" alignItems="center" padding={20}>
        <StepUnavailableNotice />
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background" alignItems="center" padding={20}>
      <StepMessage stepData={stepData} />
      <StepProgressBar progress={progress} />
      <YStack flex={1} />
      <StepCount stepData={stepData} />
    </YStack>
  );
}
