import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, Text, XStack } from 'tamagui';
import { SpeechBubble } from '@/components/speech-bubble';
import { Symptom } from '@/types';

// デバッグ用のサンプル症状データ
const sampleSymptoms: Symptom[] = [
  {
    id: 'diabetes-1',
    text: '目がかすむ...',
    tipsTitle: '視力低下',
    tipsContent: '高血糖により網膜の血管がダメージを受け、視力に影響が出ることがあります。',
  },
  {
    id: 'hypertension-1',
    text: '頭が痛い...',
    tipsTitle: '頭痛',
    tipsContent: '高血圧により血管に負担がかかり、頭痛を引き起こすことがあります。',
  },
  {
    id: 'obesity-1',
    text: 'お腹が苦しい...',
    tipsTitle: '腹部膨満感',
    tipsContent: '内臓脂肪の蓄積により、お腹が張った感覚を感じることがあります。',
  },
  {
    id: 'gout-1',
    text: '足がズキズキする...',
    tipsTitle: '痛風発作',
    tipsContent: '尿酸値が高くなると、関節に結晶が溜まり激しい痛みを引き起こします。',
  },
  {
    id: 'dyslipidemia-1',
    text: '疲れやすい...',
    tipsTitle: '倦怠感',
    tipsContent: '脂質異常により血流が悪くなり、疲れやすさを感じることがあります。',
  },
  {
    id: 'healthy-1',
    text: '今日も元気！',
    tipsTitle: '健康状態',
    tipsContent: 'パラメータが良好な状態です。この調子を維持しましょう！',
  },
];

export default function SpeechBubbleDebugScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
      <YStack flex={1} padding={20} gap={20}>
        <Text fontSize={24} fontWeight="bold" color="white" textAlign="center">
          🗨️ 吹き出しデバッグ
        </Text>
        <Text fontSize={14} color="#888" textAlign="center">
          各吹き出しをタップするとコンソールにtips情報が出力されます
        </Text>

        {sampleSymptoms.map((symptom, index) => (
          <YStack key={symptom.id} gap={8}>
            <XStack alignItems="center" gap={8}>
              <Text fontSize={12} color="#666">
                #{index + 1}
              </Text>
              <Text fontSize={12} color="#aaa">
                {symptom.tipsTitle}
              </Text>
            </XStack>
            <SpeechBubble symptom={symptom} />
          </YStack>
        ))}

        <YStack height={40} />
      </YStack>
    </ScrollView>
  );
}
