import React from 'react';
import { Text } from 'tamagui';
import { DeathRiskLevel } from '@/types/index';

type Props = {
  level: DeathRiskLevel;
};

const LEVEL_TEXT: Record<DeathRiskLevel, string> = {
  safe: '健康',
  warning: '注意',
  danger: '危険',
};

export const JudgeHealth: React.FC<Props> = ({ level }) => {
  return (
    <Text color="white" fontWeight="900" fontSize={50} letterSpacing={3}>
      {LEVEL_TEXT[level]}
    </Text>
  );
};
