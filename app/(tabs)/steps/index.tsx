import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StepVisualizer } from '@/components/StepCounter';

export default function StepsScreen() {
  return (
    <View style={styles.page}>
      <StepVisualizer />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
});
