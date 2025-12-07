// components/StepCounter/StepMessage.tsx
import React from 'react';
import { StepData } from '@/types';
import { Text } from 'tamagui';

type StepMessageProps = {
  stepData: StepData;
};

const getStepMessage = (progress: number): string => {
  if (progress >= 1) {
    return '目標達成！';
  } else if (progress >= 0.75) {
    return 'ラストスパート!';
  } else if (progress >= 0.5) {
    return 'あと半分!';
  } else if (progress >= 0.25) {
    return '順調だね!';
  } else {
    return 'まだまだ歩こう!';
  }
};

export const StepMessage = ({ stepData }: StepMessageProps) => {
  const progress = stepData.todaySteps / stepData.targetSteps;

  const message = getStepMessage(progress);

  return (
    <Text fontSize={30} fontWeight="bold" marginTop={60} marginBottom={20} color='$color6'>
      {message}
    </Text>
  );
};
