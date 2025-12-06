import BootCameraButton from '@/components/BootCameraButton';
import { YStack, Text } from 'tamagui';

export default function App() {
  return (
    <YStack
      backgroundColor="$color1"
      h={800}
      alignContent="center"
      justifyContent="center"
      alignItems="center">
      <Text
        color="white"
        justifyContent="center"
        alignContent="center"
        fontSize={30}
        style={{ marginBottom: 50 }}
        fontWeight={800}>
        ホーム画面のつもり
      </Text>
      <BootCameraButton />
    </YStack>
  );
}
