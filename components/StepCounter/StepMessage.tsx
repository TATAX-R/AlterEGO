// components/StepCounter/StepMessage.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

type StepMessageProps = {
  isGoalReached: boolean;
};

export const StepMessage = ({ isGoalReached }: StepMessageProps) => {
  return <Text style={styles.message}>{isGoalReached ? '目標達成！🎉' : 'もっと歩こう...'}</Text>;
};

const styles = StyleSheet.create({
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
    color: '#444',
  },
});
