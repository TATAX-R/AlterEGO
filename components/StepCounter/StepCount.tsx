// components/StepCounter/StepCount.tsx
import React, { useState, useCallback, useRef } from 'react';
import { StepData } from '@/types';
import { useFocusEffect } from 'expo-router';
import { YStack, Text } from 'tamagui';
import Svg, { Line } from 'react-native-svg';

type StepCountProps = {
  stepData: StepData;
};

export const StepCount = ({ stepData }: StepCountProps) => {
  const [stepDataState, setStepDataState] = useState(0);
  const animationRef = useRef<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      setStepDataState(0);

      const duration = 1000; // アニメーション時間(ms)
      const startTime = Date.now();
      const targetValue = stepData.todaySteps;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutQuart イージング（より最初速く、終わりさらにゆっくり）
        const easedProgress = Math.sqrt(1 - (progress - 1) * (progress - 1));
        const currentValue = Math.floor(easedProgress * targetValue);

        setStepDataState(currentValue);

        if (progress < 1) {
          animationRef.current = setTimeout(animate, 33); // 約30fps
        }
      };

      const timer = setTimeout(animate, 100);

      return () => {
        clearTimeout(timer);
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
        setStepDataState(0);
      };
    }, [stepData.todaySteps])
  );

  return (
    <YStack alignItems="center" justifyContent="center" marginBottom={40} animation="lazy">
      <Text fontSize={48} fontWeight="bold" color='$color6' animation="lazy">
        {stepDataState.toLocaleString()}
      </Text>
      <Svg height="2" width="200" style={{ marginVertical: 8 }}>
        <Line x1="0" y1="1" x2="200" y2="1" stroke="#666" strokeWidth="2" />
      </Svg>
      <Text fontSize={18} color="$color6">
        {stepData.targetSteps.toLocaleString()} 歩
      </Text>
    </YStack>
  );
};
