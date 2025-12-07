import { Button, Text } from 'tamagui';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FoodAnalysisResult } from '@/types';
import { usePetState } from '@/hooks/usePetState';

export default function BackHomeButton({ result }: { result: FoodAnalysisResult }) {
  const router = useRouter();
  const { updateStats, petState } = usePetState();
  return (
    <Button
      margin={10}
      w="100%"
      backgroundColor="$color1"
      shadowColor="#fff"
      shadowOffset={{ width: 2, height: 2 }}
      shadowOpacity={0.3}
      shadowRadius={4}
      borderRadius={8}
      onPress={() => {
        updateStats({
          obesity: result.impact.obesity,
          diabetes: result.impact.diabetes,
          hypertension: result.impact.hypertension,
          dyslipidemia: result.impact.dyslipidemia,
          gout: result.impact.gout,
        });
        console.log('無事データの保存に成功しました');
        router.dismissAll();
      }}>
      <Text>戻る</Text>
    </Button>
  );
}
