// components/StepCounter/StepVisualizer.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStepCounter } from '@/hooks/useStepCounter';
import { AppConfig } from '@/constants/AppConfig';

// Props型定義
type StepVisualizerProps = {
  targetSteps?: number; // デフォルト: AppConfig.DEFAULT_TARGET_STEPS
};

export const StepVisualizer = ({
  targetSteps = AppConfig.DEFAULT_TARGET_STEPS,
}: StepVisualizerProps) => {
  const { stepData, progress } = useStepCounter({ targetSteps });

  return (
    <View style={styles.container}>
      {/* 1. 上部のメッセージ（ゲージの上） */}
      <Text style={styles.message}>
        {stepData.todaySteps >= stepData.targetSteps ? '目標達成！🎉' : 'もっと歩こう...'}
      </Text>

      {/* 2. 横向きプログレスバー */}
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

      {/* 3. スペーサー（歩数を一番下に押し下げる） */}
      <View style={styles.spacer} />

      {/* 4. 歩数表示（一番下） */}
      <View style={styles.stepsContainer}>
        <Text style={styles.stepsText}>{stepData.todaySteps.toLocaleString()}</Text>
        <Text style={styles.stepsLabel}>/ {stepData.targetSteps.toLocaleString()} 歩</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'flex-start', padding: 20, flex: 1 },
  progressContainer: { width: '90%', marginTop: 60, marginBottom: 20 },
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
  message: { fontSize: 24, fontWeight: 'bold', marginTop: 60, marginBottom: 20, color: '#444' },
  spacer: { flex: 1 },
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
