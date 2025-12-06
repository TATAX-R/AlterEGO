import { Button, Text, XStack, YStack } from 'tamagui';
import { useRouter } from 'expo-router';
import { useFoodScan } from '@/hooks/useFoodScan';

export default function App() {
  const router = useRouter(); //ナビゲーション用
  const { startCamera } = useFoodScan();

  const handlePress = async () => {
    const img = await startCamera();
    if (img && img !== 'error') {
      //imgが存在するならrouterでpush
      router.push({
        pathname: '/recordfood',
        params: { imageUriFirst: img },
      });
    }
  };
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
      <Button animation="bouncy" w={150} pressStyle={{ scale: 0.9 }} onPress={handlePress}>
        写真を撮る
      </Button>
    </YStack>
  );
}
