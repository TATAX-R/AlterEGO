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
    <YStack backgroundColor="$background" h={900}>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <XStack h={100} />
      <BackHomeButton />

      <YStack>
        <Text>Food Name: {result.foodName}</Text>
        <Text>Obesity Impact: {result.impact.obesity}</Text>
        <Text>Diabetes Impact: {result.impact.diabetes}</Text>
        <Text>Hypertension Impact: {result.impact.hypertension}</Text>
        <Text>Dyslipidemia Impact: {result.impact.dyslipidemia}</Text>
        <Text>Gout Impact: {result.impact.gout}</Text>
        <Text>AI Message: {result.message}</Text>
      </YStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
});
