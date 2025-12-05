import React from 'react';
import { ThemedText } from './themed-text';
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
  return <ThemedText>{LEVEL_TEXT[level]}</ThemedText>;
};

export default JudgeHealth;
