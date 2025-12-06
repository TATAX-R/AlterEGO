import { Text, XStack, YStack } from 'tamagui';

export default function HealthScreen() {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={20}
      backgroundColor="#fff">
      <XStack backgroundColor="#F8F9FA" padding={12} borderRadius={12} alignItems="center">
        <Text fontSize={20} fontWeight="bold" color="#333" textAlign="center">
          Health Screen
        </Text>
      </XStack>
    </YStack>
  );
}
