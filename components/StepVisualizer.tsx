// components/StepVisualizer.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

// （構造体）
type StepVisualizerProps = {
  currentSteps: number;
  goalSteps: number;
  isWalking: boolean;
};

export const StepVisualizer = ({ currentSteps, goalSteps, isWalking }: StepVisualizerProps) => {
  const lottieRef = useRef<LottieView>(null);
  const progress = Math.min((currentSteps / goalSteps) * 100, 100);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, [isWalking]);

  return (
    <View style={styles.container}>
      {/* 1. 上部のメッセージ（ゲージの上） */}
      <Text style={styles.message}>
        {currentSteps >= goalSteps
          ? '目標達成！🎉'
          : isWalking
            ? 'その調子！🏃‍♂️'
            : 'もっと歩こう...'}
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

      {/* 3. Lottieアニメーション */}
      <View style={styles.petArea}>
        <LottieView
          ref={lottieRef}
          source={
            isWalking
              ? require('../assets/images/animations/pet_walking.json')
              : require('../assets/images/animations/pet_sleeping.json')
          }
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        {/* JSONが空だと何も映らないので、仮のテキストも置いておく */}
        <Text style={{ position: 'absolute', bottom: 0, color: '#999' }}>
          {isWalking ? '（アニメ: 走ってる）' : '（アニメ: 待機中）'}
        </Text>
      </View>

      {/* 4. スペーサー（歩数を一番下に押し下げる） */}
      <View style={styles.spacer} />

      {/* 5. 歩数表示（一番下） */}
      <View style={styles.stepsContainer}>
        <Text style={styles.stepsText}>{currentSteps.toLocaleString()}</Text>
        <Text style={styles.stepsLabel}>/ {goalSteps.toLocaleString()} 歩</Text>
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
  petArea: { alignItems: 'center', justifyContent: 'center', height: 220 },
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
