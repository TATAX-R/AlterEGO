// components/StepCounter/StepProgressBar.tsx
import React from 'react';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { Progress } from 'tamagui';

type StepProgressBarProps = {
  progress: number; // 0〜100
};

export const StepProgressBar = ({ progress }: StepProgressBarProps) => {
  const [progressState, setProgress] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // 1. 画面がフォーカスされたら、まず0にリセット (アニメーションの開始位置)
      setProgress(0);

      // 2. わずかな遅延を入れてから目標値をセット
      // これにより、0の状態が描画された後に目標値への変化が起き、アニメーションが走ります
      const timer = setTimeout(() => {
        setProgress(progress);
      }, 100); // 100ms程度の遅延推奨

      // 3. クリーンアップ関数（画面から離れる時や再実行前）
      return () => {
        clearTimeout(timer);
        setProgress(0); // 画面から離れるときも0に戻しておく
      };
    }, [progress])
  );

  return (
    <Progress value={progressState} size={'$6'} style={{ width: '100%' }} backgroundColor="$color5">
      <Progress.Indicator animation="lazy" backgroundColor={'$accent2'} />
    </Progress>
  );
};
