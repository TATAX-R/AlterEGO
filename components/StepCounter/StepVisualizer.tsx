// components/StepCounter/StepVisualizer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { Pedometer } from 'expo-sensors';

// Props型定義
type StepVisualizerProps = {
  goalSteps?: number; // デフォルト: 8000
};

export const StepVisualizer = ({ goalSteps = 8000 }: StepVisualizerProps) => {
  const [currentSteps, setCurrentSteps] = useState(0);
  const appState = useRef(AppState.currentState);

  // 進捗率を計算（0〜100%）
  const progress = Math.min((currentSteps / goalSteps) * 100, 100);

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
      if (!isAvailable) {
        console.log('歩数計センサーが利用できません');
        return;
      }

      // ★ 権限をリクエスト（これがないと動かない！）
      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('歩数計の権限が拒否されました');
        return;
      }

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
      });
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
    <View style={styles.container}>
      {/* 1. 上部のメッセージ（ゲージの上） */}
      <Text style={styles.message}>
        {currentSteps >= goalSteps ? '目標達成！🎉' : 'もっと歩こう...'}
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
