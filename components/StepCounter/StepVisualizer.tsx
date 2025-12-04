// components/StepCounter/StepVisualizer.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useStepCounter } from '@/hooks/useStepCounter';
import { AppConfig } from '@/constants/AppConfig';
import { StepMessage } from './StepMessage';
import { StepProgressBar } from './StepProgressBar';
import { StepCount } from './StepCount';

// Props型定義
type StepVisualizerProps = {
  targetSteps?: number; // デフォルト: AppConfig.DEFAULT_TARGET_STEPS
};

export const StepVisualizer = ({
  targetSteps = AppConfig.DEFAULT_TARGET_STEPS,
}: StepVisualizerProps) => {
  const { stepData, progress } = useStepCounter({ targetSteps });

  const isGoalReached = stepData.todaySteps >= stepData.targetSteps;

  return (
    <View style={styles.container}>
      <StepMessage isGoalReached={isGoalReached} />
      <StepProgressBar progress={progress} />
      <View style={styles.spacer} />
      <StepCount stepData={stepData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    flex: 1,
  },
  spacer: { flex: 1 },
});
