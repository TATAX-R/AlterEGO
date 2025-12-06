import { Text, XStack, YStack, H2 } from 'tamagui';
import { useLocalSearchParams, Stack } from 'expo-router';
import { FoodAnalysisResult } from '@/types';
import { StyleSheet } from 'react-native';
import BackHomeButton from '@/components/BackHomeButton';
import { SimpleGauge } from '@/components/SimpleGauge';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const { response, imgUri } = useLocalSearchParams();
  const result: FoodAnalysisResult = JSON.parse(Array.isArray(response) ? response[0] : response);
  const SimpleGaugeTextSize = 15;
  return (
    <YStack backgroundColor="$color1" h="100%" alignItems="center" paddingTop="$8" px={10}>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <XStack h={50} />

      <YStack h={250} />
      <YStack
        gap="$2"
        padding="$6"
        mx={12}
        borderWidth={0.5}
        borderColor="#fff"
        borderRadius={16}
        alignContent="center"
        shadowColor="#ffff"
        backgroundColor="$color2">
        <XStack justifyContent="center" alignItems="center">
          <H2 alignContent="center" mb="$3">
            ごちそうメモ
          </H2>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <YStack h="100%">
            <Text position="absolute" top="50%" fontSize={SimpleGaugeTextSize}>
              肥満: {result.impact.obesity}
            </Text>
          </YStack>
          <SimpleGauge value={result.impact.obesity} isMeasure={true} />
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack h="100%">
            <Text position="absolute" top="50%" fontSize={SimpleGaugeTextSize}>
              糖尿病: {result.impact.diabetes}
            </Text>
          </YStack>
          <SimpleGauge value={result.impact.diabetes} />
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack h="100%">
            <Text position="absolute" top="50%" fontSize={SimpleGaugeTextSize}>
              高血圧: {result.impact.hypertension}
            </Text>
          </YStack>
          <SimpleGauge value={result.impact.hypertension} />
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack h="100%">
            <Text position="absolute" top="50%" fontSize={SimpleGaugeTextSize}>
              脂質異常症: {result.impact.dyslipidemia}
            </Text>
          </YStack>
          <SimpleGauge value={result.impact.dyslipidemia} />
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack h="100%">
            <Text position="absolute" top="50%" fontSize={SimpleGaugeTextSize}>
              痛風: {result.impact.gout}
            </Text>
          </YStack>
          <SimpleGauge value={result.impact.gout} />
        </XStack>
        <XStack
          backgroundColor="$color1"
          padding="$2"
          w="100%"
          borderRadius={8}
          alignItems="center"
          px="$3"
          py="$3"
          mt="$4"
          borderWidth={0.5}
          borderColor="#fff">
          <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#FFD700" />
          <Text px="$3">{result.message}</Text>
        </XStack>
      </YStack>

      <BackHomeButton />
    </YStack>
  );
}
