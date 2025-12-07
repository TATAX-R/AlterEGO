import { Button, Text, XStack, YStack } from 'tamagui';
import { useRouter } from 'expo-router';
import { useFoodScan } from '@/hooks/useFoodScan';

export default function BootCameraButton() {
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
    <YStack>
      <Button animation="bouncy" w={150} pressStyle={{ scale: 0.9 }} onPress={handlePress}>
        たべさせる
      </Button>
    </YStack>
  );
}
