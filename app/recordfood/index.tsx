import { Button, Text, XStack, YStack, Image } from 'tamagui';
import { useFoodScan } from '@/hooks/useFoodScan';
import { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import ImagePreviewModalComponent from '@/components/ImagePreviewModal';
import ImagePreview from '@/components/ImagePreview';
import BackHomeButton from '@/components/BackHomeButton';

export default function App() {
  const { imageUriFirst } = useLocalSearchParams();
  const {
    //Modal States
    isLoading,
    imageUri,
    //Functions
    startCamera,
    executeAnalysis,
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

  const router = useRouter();
  return (
    <YStack h={800} backgroundColor="$green10Light" alignItems="center" justifyContent="center">
      <Stack.Screen
        options={{
          title: '食事を記録する',
          headerBackTitle: '戻る',
        }}
      />
      <Text fontWeight={800}>ここにペットのアニメーションを置く</Text>
      {imageUri && <ImagePreview imageUri={Array.isArray(imageUri) ? imageUri[0] : imageUri} />}
      {/* isLoadingがfalseのときのみ表示 */}
      {!isLoading && (
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
                const stringResult = JSON.stringify(result);
                router.push({
                  pathname: '/recordfood/resultfood',
                  params: { response: stringResult },
                });
              }
            }
          }}
          animation="bouncy"
          pressStyle={{ scale: 0.9 }}>
          食べさせる！
        </Button>
      )}
      {!isLoading && (
        <Button
          onPress={async () => {
            const img = await startCamera();

            setImageUri(img);
          }}>
          撮影し直す
        </Button>
      )}
      {isLoading && <Text>解析中...</Text>}
      <BackHomeButton />
    </YStack>
  );
}
