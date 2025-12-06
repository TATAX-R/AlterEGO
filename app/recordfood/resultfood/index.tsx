import { Button, Text, XStack, YStack } from 'tamagui';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { FoodAnalysisResult } from '@/types';
import { BackHandler, StyleSheet } from 'react-native';
import BackHomeButton from '@/components/BackHomeButton';
import { HeaderTitle } from '@react-navigation/elements';

export default function App() {
  const { response } = useLocalSearchParams();
  const result: FoodAnalysisResult = JSON.parse(Array.isArray(response) ? response[0] : response);
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <XStack h={200} />
      <BackHomeButton />
      <Button
        onPress={() => {
          console.log('名前:', result.foodName);
          console.log('obesity:', result.impact.obesity);
          console.log('diabetes:', result.impact.diabetes);
          console.log('hypertension:', result.impact.hypertension);
          console.log('dyslipidemia:', result.impact.dyslipidemia);
          console.log('gout:', result.impact.gout);
          console.log('message:', result.message);
          router.dismissAll();
        }}>
        ここを押して結果を表示
      </Button>
      <YStack>
        <Text>Food Name: {result.foodName}</Text>
        <Text>Obesity Impact: {result.impact.obesity}</Text>
        <Text>Diabetes Impact: {result.impact.diabetes}</Text>
        <Text>Hypertension Impact: {result.impact.hypertension}</Text>
        <Text>Dyslipidemia Impact: {result.impact.dyslipidemia}</Text>
        <Text>Gout Impact: {result.impact.gout}</Text>
        <Text>AI Message: {result.message}</Text>
      </YStack>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
});
