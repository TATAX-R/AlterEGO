import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Pedometer } from 'expo-sensors';

type UseStepCounterOptions = {
  goalSteps?: number;
};

export const useStepCounter = (options: UseStepCounterOptions = {}) => {
  const { goalSteps = 8000 } = options;
  const [currentSteps, setCurrentSteps] = useState(0); //画面に表示する今の歩数
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean | null>(null); //スマホに歩数計センサーがついているかの判定結果
  const appState = useRef(AppState.currentState);

  // 進捗率を計算（0〜100%）
  const progress = Math.min((currentSteps / goalSteps) * 100, 100);

  // 今日の累計歩数を取得する関数
  const fetchTodaySteps = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(isAvailable); //センサーの有無のチェック

    if (isAvailable) {
      const end = new Date(); //今の時間
      const start = new Date(); //今日の始まり
      start.setHours(0, 0, 0, 0); //時間を[00:00:00]に戻す

      try {
        const result = await Pedometer.getStepCountAsync(start, end); //OSからの返信がくるまで待機、今日の０時から今までの歩数の集計をする命令
        if (result) {
          setCurrentSteps(result.steps); //画面の数字を書き直す
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
  }, []);

  return { currentSteps, isPedometerAvailable, progress, goalSteps }; //今の歩数とセンサー使えるか、進捗率を返す
};
