// components/PetSurvivalDays/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePetStateContext } from '@/hooks/usePetState';

export const PetSurvivalDays: React.FC = () => {
  const { survivalDays, isLoading } = usePetStateContext();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        <Text style={styles.daysNumber}>{survivalDays}</Text>
        <Text style={styles.daysUnit}>日目</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
  },
  label: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  daysNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  daysUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },
});

export default PetSurvivalDays;
