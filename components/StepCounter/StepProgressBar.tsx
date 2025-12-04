// components/StepCounter/StepProgressBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StepProgressBarProps = {
  progress: number; // 0〜100
};

export const StepProgressBar = ({ progress }: StepProgressBarProps) => {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
        {/* 目標の目印 */}
        <View style={styles.goalMarker}>
          <View style={styles.goalLine} />
          <Text style={styles.goalText}>目標</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: '90%',
    marginTop: 60,
    marginBottom: 20,
  },
  progressBar: {
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f39c12',
    borderRadius: 20,
  },
  goalMarker: {
    position: 'absolute',
    right: 0,
    top: -8,
    alignItems: 'center',
  },
  goalLine: {
    width: 3,
    height: 56,
    backgroundColor: '#e74c3c',
    borderRadius: 2,
  },
  goalText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginTop: 2,
  },
});
