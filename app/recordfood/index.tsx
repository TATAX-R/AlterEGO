import { Button, Text, XStack, YStack, Image, Spinner } from 'tamagui';
import { useFoodScan } from '@/hooks/useFoodScan';
import { useEffect } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import ImagePreview from '@/components/ImagePreview';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  const { imageUriFirst } = useLocalSearchParams();
  const {
    //Modal States
    isLoading,
    imageUri,
    isSuccess,
    //Functions
    setIsSuccess,
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

  const router = useRouter();
  return (
    <YStack h={900} backgroundColor="$background" alignItems="center" justifyContent="center">
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Text fontWeight={800}>ここにペットのアニメーションを置く</Text>
      {imageUri && <ImagePreview imageUri={Array.isArray(imageUri) ? imageUri[0] : imageUri} />}
      {/* isLoadingがfalseのときのみ表示 */}
      {!isLoading && isSuccess === true && (
        <Button
          icon={<MaterialCommunityIcons name="silverware-fork-knife" size={24} color="white" />}
          style={styles.button}
          onPress={async () => {
            setIsLoading(true);
            const validUri = Array.isArray(imageUri) ? imageUri[0] : imageUri;
            if (validUri) {
              //imgの値が存在した場合のみ送信する
              setImageUri(validUri);
              const result = await executeAnalysis(validUri);
              if (result?.message) {
                setIsLoading(false);
                const stringResult = JSON.stringify(result);
                if (result.isFood === false) {
                  setIsSuccess(false);
                  return;
                }
                setIsSuccess(true);
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
          icon={<Ionicons name="camera" size={24} color="white" />}
          style={styles.button}
          onPress={async () => {
            const img = await startCamera();
            setIsSuccess(true);
            setImageUri(img);
          }}>
          撮影し直す
        </Button>
      )}
      {isLoading && (
        <XStack alignItems="center" style={styles.marginTop}>
          <Spinner size="large" color="white" style={{ marginRight: 10 }} />
          <Text fontSize={20}>解析中...</Text>
        </XStack>
      )}
      {isSuccess === false && !isLoading && (
        <Text fontSize={16} color="red" style={styles.text}>
          これは食べ物ではないようです。 {'\n'}別の写真を試してください。
        </Text>
      )}
    </YStack>
  );
}

const styles = {
  button: {
    margin: 5,
    width: 200,
  },
  marginTop: {
    marginTop: 20,
  },
  text: {
    padding: 20,
    alignItems: 'center',
  },
};
