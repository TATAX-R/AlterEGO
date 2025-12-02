import { Text, YStack } from 'tamagui';

export default function HomeScreen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
      <Text fontSize="$8" color="$color">
        Hello World!
      </Text>
    </YStack>
  );
}
