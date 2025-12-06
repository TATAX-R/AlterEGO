import { Button, Text, XStack, YStack, Image } from 'tamagui';
import { useFoodScan } from '@/hooks/useFoodScan';
import { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import ImagePreviewModalComponent from '@/components/ImagePreviewModal';
import ImagePreview from '@/components/ImagePreview';

export default function App() {
  const { imageUriFirst } = useLocalSearchParams();
  const {
    //Modal States
    isPreviewVisible,
    imageUri,
    //Functions
    startCamera,
    executeAnalysis,
    setIsPreviewVisible,
    setImageUri,
    setIsLoading,
  } = useFoodScan();

  useEffect(() => {
    if (imageUriFirst) {
      const uriToSet = Array.isArray(imageUriFirst) ? imageUriFirst[0] : imageUriFirst;
      setImageUri(uriToSet);
    }
  }, [imageUriFirst]);
  const [aiMessage, setAiMessage] = useState('ここにメッセージが表示されます');
  return (
    <YStack h={800} backgroundColor="$green10Light" alignItems="center" justifyContent="center">
      <Text fontWeight={800}>ここにペットのアニメーションを置く</Text>
      {imageUri && <ImagePreview imageUri={Array.isArray(imageUri) ? imageUri[0] : imageUri} />}
      <Button
        onPress={async () => {
          setIsLoading(true);
          const validUri = Array.isArray(imageUri) ? imageUri[0] : imageUri;
          if (validUri) {
            //imgの値が存在した場合のみ送信する
            setImageUri(validUri);
            const result = await executeAnalysis(validUri);
            if (result?.message) {
              setIsLoading(false);
              setAiMessage(result.message);
            }
          }
        }}
        animation="bouncy"
        pressStyle={{ scale: 0.9 }}>
        食べさせる！
      </Button>
      <Button
        onPress={async () => {
          const img = await startCamera();

          setImageUri(img);
        }}>
        撮影し直す
      </Button>
      {aiMessage && <Text>{aiMessage}</Text>}
    </YStack>
  );
}
