// StepPage.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Pedometer } from 'expo-sensors';
// さっき作ったコンポーネントを読み込む
import { StepVisualizer } from '../components/StepVisualizer'; // ※パスが違う場合は修正してください

export default function StepPage() {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const GOAL_STEPS = 8000;

  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;
    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        subscription = Pedometer.watchStepCount((result) => {
          setCurrentSteps(result.steps);
          setIsWalking(true);
          // 2秒後に停止判定
          if ((global as any).stopTimer) clearTimeout((global as any).stopTimer);
          (global as any).stopTimer = setTimeout(() => {
            setIsWalking(false);
          }, 2000);
        });
      }
    };
    subscribe();
    return () => {
      subscription && subscription.remove();
    };
  }, []);

  return (
    <View style={styles.page}>
      {/* 子コンポーネントを表示 */}
      <StepVisualizer currentSteps={currentSteps} goalSteps={GOAL_STEPS} isWalking={isWalking} />

      {/* 開発用デバッグボタン（完成したら消す） */}
      <View style={styles.debugArea}>
        <Text style={styles.debugText}>開発用メニュー</Text>
        <Button
          title="歩数を +10 増やす"
          onPress={() => {
            setCurrentSteps((prev) => prev + 10);
            setIsWalking(true);
            setTimeout(() => setIsWalking(false), 2000);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
  debugArea: { marginTop: 50, padding: 20, backgroundColor: '#eee' },
  debugText: { textAlign: 'center', marginBottom: 10, color: '#666' },
});
