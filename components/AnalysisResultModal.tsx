import { Modal } from 'react-native';
import { useFoodScan } from '@/hooks/useFoodScan';
import { Image, Sheet, XStack } from 'tamagui';

export default function AnalysisResultModalComponent() {
  const {
    isResultVisible,
    imageUri,

    setIsResultVisible,
  } = useFoodScan();
  return (
    <Sheet
      open={isResultVisible}
      onOpenChange={setIsResultVisible}
      snapPoints={[50, 90]} //画面の50%と90%の位置で止まる
      dismissOnSnapToBottom
      animation="bouncy">
      {imageUri && <Image src={imageUri} />}
    </Sheet>
  );
}
