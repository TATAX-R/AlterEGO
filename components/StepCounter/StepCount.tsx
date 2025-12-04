// components/StepCounter/StepCount.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StepData } from '@/types';

type StepCountProps = {
  stepData: StepData;
};

export const StepCount = ({ stepData }: StepCountProps) => {
  return (
    <View style={styles.stepsContainer}>
      <Text style={styles.stepsText}>{stepData.todaySteps.toLocaleString()}</Text>
      <Text style={styles.stepsLabel}>/ {stepData.targetSteps.toLocaleString()} 歩</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 40,
  },
  stepsText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  stepsLabel: {
    fontSize: 18,
    color: '#666',
    marginLeft: 8,
  },
});
