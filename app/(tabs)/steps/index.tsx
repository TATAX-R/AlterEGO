import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  StepMessage,
  StepProgressBar,
  StepCount,
  StepUnavailableNotice,
} from '@/components/StepCounter';
import { useStepCounter } from '@/hooks/useStepCounter';

export default function StepsScreen() {
  // AndroidのExpo Goでは歩数計が利用できない
  if (Platform.OS === 'android') {
    return (
      <View style={styles.page}>
        <StepUnavailableNotice />
      </View>
    );
  }

  const { stepData, progress } = useStepCounter();
  const isGoalReached = stepData.todaySteps >= stepData.targetSteps;

  return (
    <View style={styles.page}>
      <StepMessage isGoalReached={isGoalReached} />
      <StepProgressBar progress={progress} />
      <View style={styles.spacer} />
      <StepCount stepData={stepData} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 20 },
  spacer: { flex: 1 },
});
