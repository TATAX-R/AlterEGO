import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { AppConfig } from '@/constants/AppConfig';
import { StepData } from '@/types';

type UseStepCounterOptions = {
  targetSteps?: number;
};

export const useStepCounter = (options: UseStepCounterOptions = {}) => {
  const { targetSteps = AppConfig.DEFAULT_TARGET_STEPS } = options;
  const [todaySteps, setTodaySteps] = useState(0); //画面に表示する今の歩数
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean | null>(null); //スマホに歩数計センサーがついているかの判定結果
  const appState = useRef(AppState.currentState);

  // 進捗率を計算（0〜100%）※整数に丸める（React Native Fabricの精度エラー防止）
  const progress = Math.round(Math.min((todaySteps / targetSteps) * 100, 100));

  // 歩数データをStepData型で返す
  const stepData: StepData = {
    todaySteps,
    targetSteps,
  };

  // 今日の累計歩数を取得する関数
  const fetchTodaySteps = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(isAvailable); //センサーの有無のチェック

    if (isAvailable) {
      const end = new Date(); //今の時間
      // 日本時間（UTC+9）の今日の0時を取得
      const start = new Date();
      const japanOffset = 9 * 60; // 日本はUTC+9（分単位）
      const localOffset = start.getTimezoneOffset(); // ローカルのUTCオフセット（分単位、日本なら-540）
      const diffMinutes = japanOffset + localOffset; // 日本時間との差分
      start.setHours(0, 0, 0, 0); //ローカルの0時
      start.setMinutes(start.getMinutes() - diffMinutes); //日本時間の0時に調整

      try {
        const result = await Pedometer.getStepCountAsync(start, end); //OSからの返信がくるまで待機、今日の０時から今までの歩数の集計をする命令
        if (result) {
          setTodaySteps(result.steps); //画面の数字を書き直す
        }
      } catch (error) {
        console.log('歩数取得エラー:', error);
      }
    }
  };

  useEffect(() => {
    //フックが使われた瞬間（画面が開いた瞬間）一回だけ実行される
    let subscription: Pedometer.Subscription | null = null;

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);
      // センサーがあるか確認
      if (!isAvailable) {
        console.log('歩数計センサーが利用できません');
        return;
      }

      // 権限をリクエスト
      const { status } = await Pedometer.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('歩数計の権限が拒否されました');
        return;
      }

      // アプリを開いた瞬間、今日の「累計歩数」を取りに行く
      await fetchTodaySteps();

      // リアルタイムで歩数を監視（日本時間の0時基準）
      const start = new Date();
      const japanOffset = 9 * 60;
      const localOffset = start.getTimezoneOffset();
      const diffMinutes = japanOffset + localOffset;
      start.setHours(0, 0, 0, 0);
      start.setMinutes(start.getMinutes() - diffMinutes);

      subscription = Pedometer.watchStepCount(async () => {
        // 歩くたびに「今日のトータル」を再取得（確実な方法）
        try {
          const updated = await Pedometer.getStepCountAsync(start, new Date());
          if (updated) {
            setTodaySteps(updated.steps);
          }
        } catch (error) {
          console.log('リアルタイム歩数取得エラー:', error);
        }
      });
    };

    subscribe(); //ここまでのことを実行、useEffect の直後の関数には、asyncを付けれないからこの書き方をしている

    // アプリがフォアグラウンドに戻ったときに歩数を再取得　バックグラウンド行ったときに処理止められたときにアプリ戻ってきても再度動くようにする為、歩き始めなくても再取得できるように
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        fetchTodaySteps();
      } //もしバックグラウンドから戻ってきたらデータの再取得を行う
      appState.current = nextAppState; //バックグラウンドから戻ってきた瞬間を見つけるためさっきまでの状態を更新する
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription && subscription.remove();
      appStateSubscription.remove();
    };
  }, [targetSteps]);

  return { stepData, progress, isPedometerAvailable }; //歩数データとセンサー使えるか、進捗率を返す
};
