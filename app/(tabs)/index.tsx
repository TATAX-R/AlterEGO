import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { StepVisualizer } from '../../components/StepVisualizer';

export default function HomeScreen() {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const GOAL_STEPS = 8000;
  const appState = useRef(AppState.currentState);

  // 今日の累計歩数を取得する関数
  const fetchTodaySteps = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0); // 今日の朝0時

      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        if (result) {
          setCurrentSteps(result.steps);
        }
      } catch (error) {
        console.log('歩数取得エラー:', error);
      }
    }
  };

  useEffect(() => {
    let subscription: Pedometer.Subscription | null = null;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();

      if (isAvailable) {
        // アプリを開いた瞬間、今日の「累計歩数」を取りに行く
        await fetchTodaySteps();

        // リアルタイムで歩数を監視
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        subscription = Pedometer.watchStepCount(async () => {
          // 歩くたびに「今日のトータル」を再取得（確実な方法）
          try {
            const updated = await Pedometer.getStepCountAsync(start, new Date());
            if (updated) {
              setCurrentSteps(updated.steps);
            }
          } catch (error) {
            console.log('リアルタイム歩数取得エラー:', error);
          }

          setIsWalking(true);
          if ((global as any).stopTimer) clearTimeout((global as any).stopTimer);
          (global as any).stopTimer = setTimeout(() => {
            setIsWalking(false);
          }, 2000);
        });
      }
    };

    subscribe();

    // アプリがフォアグラウンドに戻ったときに歩数を再取得
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        fetchTodaySteps();
      }
      appState.current = nextAppState;
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription && subscription.remove();
      appStateSubscription.remove();
    };
  }, []);

  return (
    <View style={styles.page}>
      <StepVisualizer currentSteps={currentSteps} goalSteps={GOAL_STEPS} isWalking={isWalking} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
});
