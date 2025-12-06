import { Sheet, Text, XStack, YStack, Image } from 'tamagui';
import { Dispatch, SetStateAction } from 'react';
import { StyleSheet } from 'react-native';
import { FlipInEasyX } from 'react-native-reanimated';

type Props = {
  isPreviewVisible: boolean;
  setIsPreviewVisible: Dispatch<SetStateAction<boolean>>;
  imageUri: string | null;
};

export default function ImagePreviewModalComponent({
  isPreviewVisible,
  setIsPreviewVisible,
  imageUri,
}: Props) {
  return (
    <>
      {' '}
      <Sheet
        open={isPreviewVisible}
        onOpenChange={setIsPreviewVisible}
        snapPoints={[50, 90]} //画面の50%と90%の位置で止まる
        dismissOnSnapToBottom
        modal
        animation="bouncy">
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame>
          <YStack>
            <Text>test</Text>
            <Text>現在setPreviewVisibleは{isPreviewVisible ? 'true' : 'false'}です</Text>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          </YStack>
        </Sheet.Frame>
      </Sheet>
      <Text>現在の状態isPreviewVisible:{String(isPreviewVisible)}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    margin: 5,
  },
});
