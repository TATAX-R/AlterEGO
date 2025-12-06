// app/(tabs)/survival-days/index.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PetSurvivalDays } from '@/components/PetSurvivalDays';

export default function SurvivalDaysScreen() {
  return (
    <View style={styles.container}>
      <PetSurvivalDays />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
